@echo off
REM SMG Merch - Script de Instalacao e Execucao (Windows)

echo ==================================
echo SMG MERCH - LOJA ONLINE
echo ==================================
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERRO] Node.js nao esta instalado. Instale de: https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo [OK] Node.js: %NODE_VERSION%

where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERRO] npm nao encontrado.
    pause
    exit /b 1
)

echo.

REM Verificar arquivo .env
if not exist "backend\.env" (
    echo [ATENCAO] Arquivo backend\.env nao encontrado!
    echo Copie backend\.env.example para backend\.env e configure as variaveis.
    pause
    exit /b 1
)

REM Instalar dependencias do backend
echo [INSTALANDO] Dependencias do backend...
cd backend
call npm install

if %errorlevel% neq 0 (
    echo [ERRO] Falha ao instalar dependencias
    pause
    exit /b 1
)

echo [OK] Dependencias instaladas
echo.

REM Compilar TypeScript
echo [COMPILANDO] TypeScript...
call npm run build

if %errorlevel% neq 0 (
    echo [ERRO] Falha ao compilar TypeScript
    pause
    exit /b 1
)

echo [OK] TypeScript compilado
echo.

REM Iniciar servidor
echo ==================================
echo Servidor: http://localhost:3000
echo ==================================
echo.

call npm start

pause
