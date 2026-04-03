import express, { Response, Router } from 'express';
import { PedidoController } from '../controllers/pedidoController';
import { ProdutoController } from '../controllers/produtoController';
import { authMiddleware, adminMiddleware, AuthRequest } from '../middleware/auth';

declare module 'express-session' {
  interface SessionData {
    usuarioId?: string;
  }
}

const router = Router();

// Criar novo pedido
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { produtos } = req.body;

    if (!produtos || produtos.length === 0) {
      return res.status(400).json({ error: 'Produtos obrigatórios' });
    }

    // Calcular total e atualizar estoque
    let total = 0;
    const produtosProcessados: any[] = [];

    for (const item of produtos) {
      const produto = await ProdutoController.obterPorId(item.id);
      if (!produto) {
        return res.status(404).json({ 
          error: `Produto ${item.id} não encontrado` 
        });
      }

      // Verificar estoque
      if (produto.tamanhos[item.tamanho] < item.quantidade) {
        return res.status(400).json({ 
          error: `Estoque insuficiente para ${produto.nome} tamanho ${item.tamanho}` 
        });
      }

      // Atualizar estoque
      await ProdutoController.atualizarEstoque(item.id, item.tamanho, item.quantidade);

      const subtotal = produto.preco * item.quantidade;
      total += subtotal;

      produtosProcessados.push({
        id: produto.id,
        nome: produto.nome,
        preco: produto.preco,
        quantidade: item.quantidade,
        tamanho: item.tamanho
      });
    }

    // Verificar se o usuário está logado no momento do checkout
    const usuario = req.session?.usuarioId ? req.usuario.usuario : 'Visitante';

    const pedidoId = await PedidoController.criar(
      usuario,
      produtosProcessados,
      total
    );

    res.status(201).json({ 
      mensagem: 'Pedido criado com sucesso',
      id: pedidoId,
      total 
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Obter pedidos do usuário
router.get('/meus-pedidos', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const pedidos = await PedidoController.obterPorUsuario(req.usuario.usuario);
    res.json(pedidos);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Obter todos os pedidos (admin only)
router.get('/', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const pedidos = await PedidoController.obterTodos();
    res.json(pedidos);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Obter pedido por ID
router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const pedido = await PedidoController.obterPorId(parseInt(id));

    if (!pedido) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    // Verificar se é do próprio usuário ou admin
    if (pedido.usuario !== req.usuario.usuario && req.usuario.usuario !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    res.json(pedido);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
