# MySQL Database Setup - SMG MERCH

# Executar este script no MySQL Workbench

DROP DATABASE IF EXISTS smg_merch;
CREATE DATABASE smg_merch;
USE smg_merch;

-- Tabela USUARIOS (fix login)
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(50) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    cpf VARCHAR(20),
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela PRODUTOS (com tamanhos qty)
CREATE TABLE produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    img TEXT,
    tamanhos JSON DEFAULT (JSON_OBJECT('P', 0, 'M', 0, 'G', 0))
);

-- Tabela PEDIDOS
CREATE TABLE pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(50),
    produtos JSON,
    total DECIMAL(10,2),
    data TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- DADOS TESTE USUARIOS (senha: '12345678')
INSERT INTO usuarios (usuario, senha, cpf, email) VALUES 
('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '123.456.789-00', 'admin@smg.com'),
('teste', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '987.654.321-00', 'teste@gmail.com');

-- DADOS PRODUTOS (ESTOQUE REAL)
INSERT INTO produtos (nome, preco, tamanhos) VALUES
('Camiseta SMG Drops 1', 89.90, JSON_OBJECT('P',10,'M',15,'G',8)),
('Shorts Training', 129.90, JSON_OBJECT('P',5,'M',12,'G',20)),
('Meia SMG', 39.90, JSON_OBJECT('P',20,'M',25,'G',15));

-- VERIFICACAO
SELECT 'DB OK' as status;
DESCRIBE usuarios;
DESCRIBE produtos;
SELECT * FROM usuarios;
