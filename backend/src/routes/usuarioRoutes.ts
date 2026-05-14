import { Response, Router } from 'express';
import { UsuarioController } from '../controllers/usuarioController';
import { AuthRequest, authMiddleware, adminMiddleware } from '../middleware/auth';
import { enviarEmailRecuperacao } from '../services/emailService';

const router = Router();

// Login
router.post('/login', async (req: any, res: Response) => {
  try {
    const { usuario, senha } = req.body;
    console.log('Login attempt:', { usuario });

    if (!usuario || !senha) {
      return res.status(400).json({ 
        error: 'Erro: Usuário e senha obrigatórios',
        tipo: 'campos_vazios'
      });
    }

    const result = await UsuarioController.login(usuario, senha);

    if (!result.sucesso) {
      return res.status(401).json({ 
        error: result.mensagem,
        tipo: result.erro
      });
    }

    if (result.usuario) {
      req.session.usuarioId = result.usuario.id;
      req.session.usuario = result.usuario.usuario;
    }

    res.json({ 
      sucesso: true,
      mensagem: 'Login realizado com sucesso',
      usuario: result.usuario 
    });
  } catch (error: any) {
    console.error('Erro no login:', error);
    res.status(500).json({ 
      error: 'Erro: Falha ao conectar ao servidor',
      tipo: 'erro_servidor'
    });
  }
});

// Registrar
router.post('/registrar', async (req: any, res: Response) => {
  try {
    const { usuario, senha, cpf, email } = req.body;

    if (!usuario || !senha || !email) {
      return res.status(400).json({ 
        error: 'Usuário, senha e email obrigatórios' 
      });
    }

    // Validações
    if (usuario.length < 3) {
      return res.status(400).json({ error: 'Usuário deve ter no mínimo 3 caracteres' });
    }

    if (usuario.length > 50) {
      return res.status(400).json({ error: 'Usuário deve ter no máximo 50 caracteres' });
    }

    if (senha.length < 6) {
      return res.status(400).json({ error: 'Senha deve ter no mínimo 6 caracteres' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Email inválido' });
    }

    const id = await UsuarioController.registrar(usuario, senha, cpf, email);

    res.status(201).json({ 
      mensagem: 'Usuário registrado com sucesso',
      id 
    });
  } catch (error: any) {
    if (error.message.includes('Duplicate entry')) {
      res.status(400).json({ error: 'Usuário já existe' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Logout
router.post('/logout', (req: any, res: Response) => {
  req.session.destroy((err: any) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao fazer logout' });
    }
    res.json({ mensagem: 'Logout realizado com sucesso' });
  });
});

// Obter usuário atual
router.get('/me', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    res.json(req.usuario);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Alterar própria senha
router.post('/alterar-senha', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { senhaAtual, novaSenha, confirmarSenha } = req.body;

    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    if (novaSenha !== confirmarSenha) {
      return res.status(400).json({ error: 'As senhas não coincidem' });
    }

    if (novaSenha.length < 6) {
      return res.status(400).json({ error: 'Senha deve ter no mínimo 6 caracteres' });
    }

    if (!req.usuario) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    await UsuarioController.alterarSenha(req.usuario.id, senhaAtual, novaSenha);

    res.json({ mensagem: 'Senha alterada com sucesso' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Atualizar perfil do usuário logado
router.put('/perfil/atualizar', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email é obrigatório' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Email inválido' });
    }

    if (!req.usuario) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    const atualizado = await UsuarioController.atualizar(req.usuario.id, undefined, email);

    if (!atualizado) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json({ mensagem: 'Email atualizado com sucesso' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Recuperação de senha — envia email com link e token
router.post('/recuperar-senha', async (req: any, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email obrigatório' });
    }

    const resultado = await UsuarioController.gerarTokenRecuperacao(email);

    // Responde sempre com sucesso para não revelar se o email existe
    if (resultado) {
      try {
        await enviarEmailRecuperacao(resultado.email, resultado.usuario, resultado.token);
      } catch (emailErr) {
        console.error('Erro ao enviar email de recuperação:', emailErr);
      }
    }

    res.json({ mensagem: 'Se o email existir em nossa base, você receberá as instruções em breve.' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Resetar senha com token do email
router.post('/resetar-senha', async (req: any, res: Response) => {
  try {
    const { token, novaSenha } = req.body;

    if (!token || !novaSenha) {
      return res.status(400).json({ error: 'Token e nova senha são obrigatórios' });
    }

    if (novaSenha.length < 6) {
      return res.status(400).json({ error: 'Senha deve ter no mínimo 6 caracteres' });
    }

    await UsuarioController.resetarSenhaComToken(token, novaSenha);

    res.json({ mensagem: 'Senha redefinida com sucesso!' });
  } catch (error: any) {
    const status = error.message.includes('inválido') ? 400 : 500;
    res.status(status).json({ error: error.message });
  }
});

// Obter todos os usuários (admin only)
router.get('/', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const usuarios = await UsuarioController.obterTodos();
    res.json(usuarios);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Atualizar usuário (admin only)
router.put('/:id', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { cpf, email, novaSenha } = req.body;

    const atualizado = await UsuarioController.atualizar(parseInt(id), cpf, email, novaSenha);

    if (!atualizado) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json({ mensagem: 'Usuário atualizado com sucesso' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Deletar usuário (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const deletado = await UsuarioController.deletar(parseInt(id));

    if (!deletado) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json({ mensagem: 'Usuário deletado com sucesso' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
