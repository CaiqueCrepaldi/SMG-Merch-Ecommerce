-- SMG Merch - Schema do banco de dados
-- Execute no MySQL Workbench ou via CLI: mysql -u root -p < schema.sql

CREATE DATABASE IF NOT EXISTS smg_merch CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE smg_merch;

CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(50) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    cpf VARCHAR(20),
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    img TEXT,
    tamanhos JSON DEFAULT (JSON_OBJECT('P', 0, 'M', 0, 'G', 0))
);

CREATE TABLE IF NOT EXISTS pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(50),
    produtos JSON,
    total DECIMAL(10,2),
    data TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Para criar o usuário admin inicial, gere o hash da senha com bcrypt e execute:
-- INSERT INTO usuarios (usuario, senha, email) VALUES ('admin', '<hash_bcrypt>', 'admin@seudominio.com');
-- Exemplo usando Node.js: node -e "const b=require('bcryptjs'); b.hash('SUA_SENHA',10).then(h=>console.log(h))"

SELECT 'Schema criado com sucesso' AS status;
