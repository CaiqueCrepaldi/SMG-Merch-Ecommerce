const bcrypt = require('bcryptjs');

async function gerarSenha() {
  const senha = 'senha123';
  const hash = await bcrypt.hash(senha, 10);
  console.log('Hash gerado:', hash);
}

gerarSenha();
