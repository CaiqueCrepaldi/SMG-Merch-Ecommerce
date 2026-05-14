import validator from 'validator';

// 🔒 Validadores customizados

export class Validators {
  // Validar e sanitizar usuário
  static validarUsuario(usuario: string): { valido: boolean; erro?: string } {
    if (!usuario || typeof usuario !== 'string') {
      return { valido: false, erro: 'Usuário deve ser uma string' };
    }

    const limpo = usuario.trim();

    if (limpo.length < 3) {
      return { valido: false, erro: 'Usuário deve ter no mínimo 3 caracteres' };
    }

    if (limpo.length > 50) {
      return { valido: false, erro: 'Usuário deve ter no máximo 50 caracteres' };
    }

    // Apenas letras, números e underscore
    if (!/^[a-zA-Z0-9_]+$/.test(limpo)) {
      return { valido: false, erro: 'Usuário pode conter apenas letras, números e underscore' };
    }

    return { valido: true };
  }

  // Validar e sanitizar senha
  static validarSenha(senha: string): { valido: boolean; erro?: string } {
    if (!senha || typeof senha !== 'string') {
      return { valido: false, erro: 'Senha deve ser uma string' };
    }

    if (senha.length < 6) {
      return { valido: false, erro: 'Senha deve ter no mínimo 6 caracteres' };
    }

    if (senha.length > 128) {
      return { valido: false, erro: 'Senha muito longa' };
    }

    return { valido: true };
  }

  // Validar e sanitizar email
  static validarEmail(email: string): { valido: boolean; erro?: string } {
    if (!email || typeof email !== 'string') {
      return { valido: false, erro: 'Email deve ser uma string' };
    }

    const limpo = email.trim().toLowerCase();

    if (!validator.isEmail(limpo)) {
      return { valido: false, erro: 'Email inválido' };
    }

    if (limpo.length > 100) {
      return { valido: false, erro: 'Email muito longo' };
    }

    return { valido: true };
  }

  // Validar e sanitizar CPF
  static validarCPF(cpf: string): { valido: boolean; erro?: string } {
    if (!cpf || typeof cpf !== 'string') {
      return { valido: false, erro: 'CPF deve ser uma string' };
    }

    // Remover formatação
    const limpo = cpf.replace(/\D/g, '');

    if (limpo.length !== 11) {
      return { valido: false, erro: 'CPF deve ter 11 dígitos' };
    }

    // Verificar se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(limpo)) {
      return { valido: false, erro: 'CPF inválido' };
    }

    return { valido: true };
  }

  // Validar CEP
  static validarCEP(cep: string): { valido: boolean; erro?: string } {
    if (!cep || typeof cep !== 'string') {
      return { valido: false, erro: 'CEP deve ser uma string' };
    }

    const limpo = cep.replace(/\D/g, '');

    if (limpo.length !== 8) {
      return { valido: false, erro: 'CEP deve ter 8 dígitos' };
    }

    return { valido: true };
  }

  // Validar preço
  static validarPreco(preco: number): { valido: boolean; erro?: string } {
    if (typeof preco !== 'number') {
      return { valido: false, erro: 'Preço deve ser um número' };
    }

    if (preco < 0) {
      return { valido: false, erro: 'Preço não pode ser negativo' };
    }

    if (preco > 999999.99) {
      return { valido: false, erro: 'Preço muito alto' };
    }

    return { valido: true };
  }

  // Sanitizar string (remover caracteres perigosos)
  static sanitizarString(str: string): string {
    if (typeof str !== 'string') return '';
    return validator.escape(str).trim();
  }

  // Validar quantidade
  static validarQuantidade(qtd: number): { valido: boolean; erro?: string } {
    if (!Number.isInteger(qtd)) {
      return { valido: false, erro: 'Quantidade deve ser um número inteiro' };
    }

    if (qtd < 1) {
      return { valido: false, erro: 'Quantidade deve ser no mínimo 1' };
    }

    if (qtd > 1000) {
      return { valido: false, erro: 'Quantidade máxima é 1000' };
    }

    return { valido: true };
  }

  // Validar nome do produto
  static validarNomeProduto(nome: string): { valido: boolean; erro?: string } {
    if (!nome || typeof nome !== 'string') {
      return { valido: false, erro: 'Nome do produto deve ser uma string' };
    }

    const limpo = nome.trim();

    if (limpo.length < 3) {
      return { valido: false, erro: 'Nome do produto deve ter no mínimo 3 caracteres' };
    }

    if (limpo.length > 100) {
      return { valido: false, erro: 'Nome do produto deve ter no máximo 100 caracteres' };
    }

    return { valido: true };
  }

  // Validar URL
  static validarURL(url: string): { valido: boolean; erro?: string } {
    if (!url || typeof url !== 'string') {
      return { valido: false, erro: 'URL deve ser uma string' };
    }

    if (!validator.isURL(url)) {
      return { valido: false, erro: 'URL inválida' };
    }

    return { valido: true };
  }

  // Validar tamanho
  static validarTamanho(tamanho: string): { valido: boolean; erro?: string } {
    const tamanhos = ['P', 'M', 'G'];

    if (!tamanho || typeof tamanho !== 'string') {
      return { valido: false, erro: 'Tamanho deve ser uma string' };
    }

    if (!tamanhos.includes(tamanho.toUpperCase())) {
      return { valido: false, erro: 'Tamanho inválido. Aceitos: P, M, G' };
    }

    return { valido: true };
  }
}
