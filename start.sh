#!/bin/bash

# SMG Merch - Script de Instalacao e Execucao

echo "=================================="
echo "SMG MERCH - LOJA ONLINE"
echo "=================================="
echo ""

if ! command -v node &> /dev/null; then
    echo "ERRO: Node.js nao esta instalado. Instale de: https://nodejs.org/"
    exit 1
fi

echo "OK: Node.js $(node --version)"

if ! command -v npm &> /dev/null; then
    echo "ERRO: npm nao encontrado."
    exit 1
fi

# Verificar arquivo .env
if [ ! -f "backend/.env" ]; then
    echo "ATENCAO: backend/.env nao encontrado!"
    echo "Copie backend/.env.example para backend/.env e configure as variaveis."
    exit 1
fi

# Instalar dependencias do backend
echo "Instalando dependencias do backend..."
cd backend && npm install

if [ $? -ne 0 ]; then
    echo "ERRO: Falha ao instalar dependencias"
    exit 1
fi

echo "OK: Dependencias instaladas"
echo ""

# Compilar TypeScript
echo "Compilando TypeScript..."
npm run build

if [ $? -ne 0 ]; then
    echo "ERRO: Falha ao compilar TypeScript"
    exit 1
fi

echo "OK: TypeScript compilado"
echo ""

# Iniciar servidor
echo "=================================="
echo "Servidor: http://localhost:3000"
echo "=================================="
echo ""

npm start
