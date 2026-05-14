import pool from '../database';
import { RowDataPacket, OkPacket } from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { Usuario } from '../types';

// ...existing code...

export class UsuarioController {
  // Login do usuário - retorna objeto com status e mensagem
  static async login(usuario: string, senha: string) {
    try {
      const connection = await pool.getConnection();
      try {
        const [rows] = await connection.query<RowDataPacket[]>(
          'SELECT * FROM usuarios WHERE usuario = ?',
          [usuario]
        );

        if (rows.length === 0) {
          return {
            sucesso: false,
            erro: 'usuario_nao_existe',
            mensagem: 'Usuário não encontrado. Verifique o nome de usuário ou registre-se!'
          };
        }

        const user = rows[0] as any;
        const senhaValida = await bcrypt.compare(senha, user.senha);

        if (!senhaValida) {
          return {
            sucesso: false,
            erro: 'senha_incorreta',
            mensagem: 'Senha incorreta. Tente novamente ou clique em "Esqueci Senha"!'
          };
        }

        return {
          sucesso: true,
          usuario: {
            id: user.id,
            usuario: user.usuario,
            cpf: user.cpf,
            email: user.email,
            created_at: user.created_at
          }
        };
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error('Erro no controller login:', error);
      return {
        sucesso: false,
        erro: 'erro_servidor',
        mensagem: 'Erro no servidor. Tente novamente mais tarde!'
      };
    }
  }

  // Registrar novo usuário
  static async registrar(usuario: string, senha: string, cpf: string, email: string) {
    const connection = await pool.getConnection();
    try {
      // Verificar se usuário já existe
      const [existing] = await connection.query<RowDataPacket[]>(
        'SELECT id FROM usuarios WHERE usuario = ?',
        [usuario]
      );

      if (existing.length > 0) {
        throw new Error('Usuário já existe');
      }

      // Hash da senha
      const senhaHash = await bcrypt.hash(senha, 10);

      const [result] = await connection.query<OkPacket>(
        'INSERT INTO usuarios (usuario, senha, cpf, email) VALUES (?, ?, ?, ?)',
        [usuario, senhaHash, cpf, email]
      );

      return result.insertId;
    } finally {
      connection.release();
    }
  }

  // Obter usuário por ID
  static async obterPorId(id: number) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query<RowDataPacket[]>(
        'SELECT id, usuario, cpf, email, created_at FROM usuarios WHERE id = ?',
        [id]
      );

      if (rows.length === 0) return null;
      return rows[0];
    } finally {
      connection.release();
    }
  }

  // Obter usuário por nome de usuário
  static async obterPorUsuario(usuario: string) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query<RowDataPacket[]>(
        'SELECT id, usuario, cpf, email, created_at FROM usuarios WHERE usuario = ?',
        [usuario]
      );

      if (rows.length === 0) return null;
      return rows[0];
    } finally {
      connection.release();
    }
  }

  // Obter todos os usuários (admin)
  static async obterTodos() {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query<RowDataPacket[]>(
        'SELECT id, usuario, cpf, email, created_at FROM usuarios ORDER BY created_at DESC'
      );

      return rows;
    } finally {
      connection.release();
    }
  }

  // Alterar senha (usuário logado)
  static async alterarSenha(usuarioId: number, senhaAtual: string, novaSenha: string) {
    const connection = await pool.getConnection();
    try {
      // Obter usuário atual
      const [rows] = await connection.query<RowDataPacket[]>(
        'SELECT senha FROM usuarios WHERE id = ?',
        [usuarioId]
      );

      if (rows.length === 0) {
        throw new Error('Usuário não encontrado');
      }

      const user = rows[0] as any;
      const senhaValida = await bcrypt.compare(senhaAtual, user.senha);

      if (!senhaValida) {
        throw new Error('Senha atual incorreta');
      }

      const novaHash = await bcrypt.hash(novaSenha, 10);

      const [result] = await connection.query<OkPacket>(
        'UPDATE usuarios SET senha = ? WHERE id = ?',
        [novaHash, usuarioId]
      );

      return result.affectedRows > 0;
    } finally {
      connection.release();
    }
  }

  // Resetar senha (admin)
  static async resetarSenha(usuarioId: number, novaSenha: string) {
    const connection = await pool.getConnection();
    try {
      const novaHash = await bcrypt.hash(novaSenha, 10);

      const [result] = await connection.query<OkPacket>(
        'UPDATE usuarios SET senha = ? WHERE id = ?',
        [novaHash, usuarioId]
      );

      return result.affectedRows > 0;
    } finally {
      connection.release();
    }
  }

  // Gerar token de recuperação de senha e salvar no banco
  static async gerarTokenRecuperacao(email: string) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query<RowDataPacket[]>(
        'SELECT id, usuario, email FROM usuarios WHERE email = ?',
        [email]
      );

      if (rows.length === 0) return null;

      const user = rows[0] as any;
      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

      // Remove tokens anteriores do mesmo usuário
      await connection.query('DELETE FROM password_reset_tokens WHERE usuario_id = ?', [user.id]);

      await connection.query(
        'INSERT INTO password_reset_tokens (usuario_id, token, expires_at) VALUES (?, ?, ?)',
        [user.id, token, expiresAt]
      );

      return { id: user.id, usuario: user.usuario, email: user.email, token };
    } finally {
      connection.release();
    }
  }

  // Validar token e resetar senha
  static async resetarSenhaComToken(token: string, novaSenha: string) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query<RowDataPacket[]>(
        'SELECT * FROM password_reset_tokens WHERE token = ? AND expires_at > NOW()',
        [token]
      );

      if (rows.length === 0) {
        throw new Error('Token inválido ou expirado');
      }

      const usuarioId = (rows[0] as any).usuario_id;
      const novaHash = await bcrypt.hash(novaSenha, 10);

      await connection.query('UPDATE usuarios SET senha = ? WHERE id = ?', [novaHash, usuarioId]);
      await connection.query('DELETE FROM password_reset_tokens WHERE token = ?', [token]);

      return true;
    } finally {
      connection.release();
    }
  }

  // Atualizar usuário (admin)
  static async atualizar(usuarioId: number, cpf?: string, email?: string, novaSenha?: string) {
    const connection = await pool.getConnection();
    try {
      const updates: string[] = [];
      const values: any[] = [];

      if (cpf !== undefined) {
        updates.push('cpf = ?');
        values.push(cpf);
      }
      if (email !== undefined) {
        updates.push('email = ?');
        values.push(email);
      }
      if (novaSenha !== undefined) {
        const novaHash = await bcrypt.hash(novaSenha, 10);
        updates.push('senha = ?');
        values.push(novaHash);
      }

      if (updates.length === 0) return false;

      values.push(usuarioId);
      const [result] = await connection.query<OkPacket>(
        `UPDATE usuarios SET ${updates.join(', ')} WHERE id = ?`,
        values
      );

      return result.affectedRows > 0;
    } finally {
      connection.release();
    }
  }

  // Deletar usuário (admin)
  static async deletar(usuarioId: number) {
    const connection = await pool.getConnection();
    try {
      // Não permitir deletar admin
      const [rows] = await connection.query<RowDataPacket[]>(
        'SELECT usuario FROM usuarios WHERE id = ?',
        [usuarioId]
      );

      if (rows.length === 0) {
        throw new Error('Usuário não encontrado');
      }

      if ((rows[0] as any).usuario === 'admin') {
        throw new Error('Não é possível deletar o usuário admin');
      }

      const [result] = await connection.query<OkPacket>(
        'DELETE FROM usuarios WHERE id = ?',
        [usuarioId]
      );

      return result.affectedRows > 0;
    } finally {
      connection.release();
    }
  }
}
