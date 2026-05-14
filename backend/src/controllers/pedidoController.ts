import pool from '../database';
import { RowDataPacket, OkPacket } from 'mysql2/promise';
import { Pedido } from '../types';

export class PedidoController {
  // Criar novo pedido
  static async criar(usuario: string, produtos: any[], total: number) {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.query<OkPacket>(
        'INSERT INTO pedidos (usuario, produtos, total) VALUES (?, ?, ?)',
        [usuario, JSON.stringify(produtos), total]
      );
      return result.insertId;
    } finally {
      connection.release();
    }
  }

  // Obter pedidos do usuário
  static async obterPorUsuario(usuario: string) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query<RowDataPacket[]>(
        'SELECT * FROM pedidos WHERE usuario = ? ORDER BY data DESC',
        [usuario]
      );

      return rows.map((row: any) => ({
        ...row,
        produtos: typeof row.produtos === 'string' ? JSON.parse(row.produtos) : row.produtos
      }));
    } finally {
      connection.release();
    }
  }

  // Obter todos os pedidos (admin)
  static async obterTodos() {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query<RowDataPacket[]>(
        'SELECT * FROM pedidos ORDER BY data DESC'
      );

      return rows.map((row: any) => ({
        ...row,
        produtos: typeof row.produtos === 'string' ? JSON.parse(row.produtos) : row.produtos
      }));
    } finally {
      connection.release();
    }
  }

  // Obter pedido por ID
  static async obterPorId(id: number) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query<RowDataPacket[]>(
        'SELECT * FROM pedidos WHERE id = ?',
        [id]
      );

      if (rows.length === 0) return null;
      const row = rows[0] as any;
      return {
        ...row,
        produtos: typeof row.produtos === 'string' ? JSON.parse(row.produtos) : row.produtos
      };
    } finally {
      connection.release();
    }
  }
}
