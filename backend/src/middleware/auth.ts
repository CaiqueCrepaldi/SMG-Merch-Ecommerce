import { Request, Response, NextFunction } from 'express';
import { UsuarioController } from '../controllers/usuarioController';

export interface AuthRequest extends Request {
  usuario?: any;
}

export async function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const usuarioId = (req.session as any)?.usuarioId;

    if (!usuarioId) {
      return res.status(401).json({ error: 'Não autenticado' });
    }

    const usuario = await UsuarioController.obterPorId(usuarioId);
    if (!usuario) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    req.usuario = usuario;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Erro na autenticação' });
  }
}

export function adminMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  if (req.usuario?.usuario !== 'admin') {
    return res.status(403).json({ error: 'Acesso negado. Apenas admin.' });
  }
  next();
}
