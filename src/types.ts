export interface Usuario {
  id: number;
  usuario: string;
  cpf: string;
  email: string;
  created_at: Date;
}

export interface Produto {
  id: number;
  nome: string;
  preco: number;
  img: string;
  tamanhos: {
    P: number;
    M: number;
    G: number;
  };
}

export interface Pedido {
  id: number;
  usuario: string;
  produtos: Array<{
    id: number;
    nome: string;
    preco: number;
    quantidade: number;
    tamanho: string;
  }>;
  total: number;
  data: Date;
}

export interface CarrinhoItem {
  id: number;
  nome: string;
  preco: number;
  quantidade: number;
  tamanho: string;
}
