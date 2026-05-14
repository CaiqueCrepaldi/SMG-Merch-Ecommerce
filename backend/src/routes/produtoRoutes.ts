import { Response, Router } from 'express';
import { ProdutoController } from '../controllers/produtoController';
import { authMiddleware, adminMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// Obter todos os produtos (público)
router.get('/', async (req: any, res: Response) => {
  try {
    const produtos = await ProdutoController.obterTodos();
    res.json(produtos);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Obter um produto (público)
router.get('/:id', async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const produto = await ProdutoController.obterPorId(parseInt(id));

    if (!produto) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    res.json(produto);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Criar produto (admin only)
router.post('/', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { nome, preco, img, tamanhos } = req.body;

    if (!nome || !preco) {
      return res.status(400).json({ 
        error: 'Nome e preço obrigatórios' 
      });
    }

    const id = await ProdutoController.criar(nome, preco, img, tamanhos);

    res.status(201).json({ 
      mensagem: 'Produto criado com sucesso',
      id 
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Atualizar produto (admin only)
router.put('/:id', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { nome, preco, img, tamanhos } = req.body;

    const atualizado = await ProdutoController.atualizar(
      parseInt(id),
      nome,
      preco,
      img,
      tamanhos
    );

    if (!atualizado) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    res.json({ mensagem: 'Produto atualizado com sucesso' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Deletar produto (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const deletado = await ProdutoController.deletar(parseInt(id));

    if (!deletado) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    res.json({ mensagem: 'Produto deletado com sucesso' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
