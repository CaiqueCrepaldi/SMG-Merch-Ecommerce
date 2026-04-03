import pool from '../database';
import { Produto } from '../types';
import { RowDataPacket, OkPacket } from 'mysql2/promise';

export class ProdutoController {
  // Obter todos os produtos
  static async obterTodos() {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query<RowDataPacket[]>(
        'SELECT * FROM produtos'
      );
      return rows.map((row: any) => ({
        ...row,
        tamanhos: typeof row.tamanhos === 'string' ? JSON.parse(row.tamanhos) : row.tamanhos
      }));
    } finally {
      connection.release();
    }
  }

  // Obter um produto por ID
  static async obterPorId(id: number) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query<RowDataPacket[]>(
        'SELECT * FROM produtos WHERE id = ?',
        [id]
      );
      if (rows.length === 0) return null;
      const row = rows[0] as any;
      return {
        ...row,
        tamanhos: typeof row.tamanhos === 'string' ? JSON.parse(row.tamanhos) : row.tamanhos
      };
    } finally {
      connection.release();
    }
  }

  // Criar novo produto
  static async criar(nome: string, preco: number, img: string, tamanhos?: any) {
    const connection = await pool.getConnection();
    try {
      const tamanhosJson = tamanhos || { P: 0, M: 0, G: 0 };
      const [result] = await connection.query<OkPacket>(
        'INSERT INTO produtos (nome, preco, img, tamanhos) VALUES (?, ?, ?, ?)',
        [nome, preco, img, JSON.stringify(tamanhosJson)]
      );
      return result.insertId;
    } finally {
      connection.release();
    }
  }

  // Atualizar produto
  static async atualizar(
    id: number,
    nome?: string,
    preco?: number,
    img?: string,
    tamanhos?: any
  ) {
    const connection = await pool.getConnection();
    try {
      const updates: string[] = [];
      const values: any[] = [];

      if (nome !== undefined) {
        updates.push('nome = ?');
        values.push(nome);
      }
      if (preco !== undefined) {
        updates.push('preco = ?');
        values.push(preco);
      }
      if (img !== undefined) {
        updates.push('img = ?');
        values.push(img);
      }
      if (tamanhos !== undefined) {
        updates.push('tamanhos = ?');
        values.push(JSON.stringify(tamanhos));
      }

      if (updates.length === 0) return false;

      values.push(id);
      const [result] = await connection.query<OkPacket>(
        `UPDATE produtos SET ${updates.join(', ')} WHERE id = ?`,
        values
      );
      return result.affectedRows > 0;
    } finally {
      connection.release();
    }
  }

  // Deletar produto
  static async deletar(id: number) {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.query<OkPacket>(
        'DELETE FROM produtos WHERE id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } finally {
      connection.release();
    }
  }

  // Atualizar estoque
  static async atualizarEstoque(id: number, tamanho: string, quantidade: number) {
    const connection = await pool.getConnection();
    try {
      const produto = await this.obterPorId(id);
      if (!produto) return false;

      const tamanhos = produto.tamanhos;
      if (tamanho in tamanhos) {
        tamanhos[tamanho] -= quantidade;
        await this.atualizar(id, undefined, undefined, undefined, tamanhos);
        return true;
      }
      return false;
    } finally {
      connection.release();
    }
  }
}
