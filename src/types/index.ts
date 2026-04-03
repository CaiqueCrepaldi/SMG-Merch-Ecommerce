export interface Usuario {
  id: number;
  usuario: string;
  email: string;
  cpf: string;
  senha?: string;
  created_at: Date;
}

export interface Produto {
  id: number;
  nome: string;
  preco: number;
  estoque_p: number;
  estoque_m: number;
  estoque_g: number;
}

export interface Pedido {
  id: number;
  usuario_id: number;
  total: number;
  data_pedido: Date;
}