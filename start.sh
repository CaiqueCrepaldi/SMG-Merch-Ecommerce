#!/bin/bash

# SMG Merch - Script de Instalação e Execução
# Este script configura e inicia o projeto

echo "=================================="
echo "SMG MERCH - LOJA ONLINE"
echo "=================================="
echo ""

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não está instalado!"
    echo "Instale de: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js encontrado: $(node --version)"

# Verificar npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm não está instalado!"
    exit 1
fi

echo "✅ npm encontrado: $(npm --version)"
echo ""

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Erro ao instalar dependências"
    exit 1
fi

echo "✅ Dependências instaladas com sucesso"
echo ""

# Compilar TypeScript
echo "🔨 Compilando TypeScript..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Erro ao compilar TypeScript"
    exit 1
fi

echo "✅ TypeScript compilado com sucesso"
echo ""

# Iniciar servidor
echo "🚀 Iniciando servidor SMG Merch..."
echo ""
echo "=================================="
echo "Servidor rodando em:"
echo "🌐 http://localhost:3000"
echo ""
echo "Credenciais de teste:"
echo "👤 Usuário: admin"
echo "🔑 Senha: 12345678"
echo "=================================="
echo ""

npm start
