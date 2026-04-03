@echo off
REM SMG Merch - Script de Instalação e Execução (Windows)
REM Este script configura e inicia o projeto

echo ==================================
echo SMG MERCH - LOJA ONLINE
echo ==================================
echo.

REM Verificar Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo X Node.js nao esta instalado!
    echo Instale de: https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo [OK] Node.js encontrado: %NODE_VERSION%

REM Verificar npm
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo X npm nao esta instalado!
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo [OK] npm encontrado: %NPM_VERSION%
echo.

REM Instalar dependências
echo [INSTALANDO] Dependências...
call npm install

if %errorlevel% neq 0 (
    echo X Erro ao instalar dependências
    pause
    exit /b 1
)

echo [OK] Dependências instaladas com sucesso
echo.

REM Compilar TypeScript
echo [COMPILANDO] TypeScript...
call npm run build

if %errorlevel% neq 0 (
    echo X Erro ao compilar TypeScript
    pause
    exit /b 1
)

echo [OK] TypeScript compilado com sucesso
echo.

REM Iniciar servidor
echo [INICIANDO] Servidor SMG Merch...
echo.
echo ==================================
echo Servidor rodando em:
echo http://localhost:3000
echo.
echo Credenciais de teste:
echo Usuario: admin
echo Senha: 12345678
echo ==================================
echo.

call npm start

pause
