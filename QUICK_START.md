# ⚡ GUIA RÁPIDO DE INSTALAÇÃO

## 1️⃣ Pré-requisitos

Antes de começar, certifique-se de ter:

- ✅ **Node.js** instalado (v16+) - [Baixar](https://nodejs.org/)
- ✅ **MySQL Server** rodando - [Documentação](https://dev.mysql.com/doc/refman/8.0/en/)
- ✅ **MySQL Workbench** (opcional, para gerenciar BD - [Baixar](https://www.mysql.com/products/workbench/))

## 2️⃣ Setup do Banco de Dados

### Windows/Mac/Linux:

1. Abra o **MySQL Workbench** ou seu cliente MySQL
2. Crie uma nova conexão com:
   - Host: `localhost`
   - Port: `3306`
   - User: `root`
   - Password: `root`

3. Abra um novo arquivo SQL e copie o conteúdo de `database.sql`
4. Execute o script (Ctrl+Enter)
5. Verifique se o banco foi criado e os dados foram inseridos

```sql
-- Verificar banco
SHOW DATABASES;
USE smg_merch;
SHOW TABLES;
SELECT * FROM usuarios;
SELECT * FROM produtos;
```

## 3️⃣ Instalação do Projeto

### Via Terminal/Prompt:

```bash
# 1. Navegar até o diretório
cd "c:\Users\caiqu\OneDrive\Documents\PROJETO SMG"

# 2. Instalar dependências
npm install

# 3. Compilar TypeScript
npm run build

# 4. Iniciar servidor (desenvolvimento)
npm run dev

# OU

# 4. Iniciar servidor (produção)
npm start
```

### Via Script (Mais Fácil):

**Windows:**
```bash
# Clique duplo em: start.bat
# OU execute no terminal:
start.bat
```

**Mac/Linux:**
```bash
# Dê permissão ao script
chmod +x start.sh

# Execute
./start.sh
```

## 4️⃣ Acessar o Sistema

Após iniciar o servidor, acesse:

- **Página de Login**: [http://localhost:3000/](http://localhost:3000/)
- **Loja Online**: [http://localhost:3000/loja](http://localhost:3000/loja)
- **Admin**: [http://localhost:3000/admin](http://localhost:3000/admin)

### Credenciais de Teste:
```
Usuário: admin
Senha: 12345678
```

## 5️⃣ Estrutura de Pastas

```
PROJETO SMG/
├── src/                    # Código TypeScript (Backend)
│   ├── controllers/       # Lógica de negócio
│   ├── routes/           # Rotas da API
│   ├── middleware/       # Middleware (autenticação)
│   ├── database.ts       # Configuração do BD
│   ├── types.ts          # Tipos TypeScript
│   └── server.ts         # Servidor principal
├── public/               # Frontend (HTML/CSS/JS)
│   ├── index.html       # Login/Registro
│   ├── loja.html        # Loja Online
│   ├── admin.html       # Painel Admin
│   ├── css/
│   │   └── style.css    # Estilos (Branco/Preto)
│   └── js/
│       ├── auth.js      # Sistema de autenticação
│       ├── loja.js      # Loja e carrinho
│       └── admin.js     # Painel administrativo
├── dist/                 # Código compilado (gerado)
├── node_modules/        # Dependências (gerado)
├── package.json         # Configuração npm
├── tsconfig.json        # Configuração TypeScript
├── .env                 # Variáveis de ambiente
└── README.md            # Documentação
```

## 🛠️ Comandos Úteis

```bash
# Iniciar em desenvolvimento (com hot-reload)
npm run dev

# Compilar TypeScript
npm run build

# Iniciar servidor compilado
npm start

# Assistir mudanças (recompila automaticamente)
npm run watch
```

## 📝 Variáveis de Ambiente (.env)

```env
# MySQL Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=smg_merch
DB_PORT=3306

# Server
PORT=3000
NODE_ENV=development
```

## ⚠️ Troubleshooting

### "Erro: Não consegue conectar ao MySQL"
- Verifique se o MySQL está rodando
- Confirme usuário e senha em `.env`
- Verifique se a porta 3306 está disponível

### "Erro: Porta 3000 já está em uso"
- Mude a `PORT` no arquivo `.env`
- OU encerre o processo usando essa porta

### "Erro: Banco de dados não existe"
- Execute o script `database.sql`
- Verifique se o banco `smg_merch` foi criado

### "Erro: npm install falha"
- Delete a pasta `node_modules`
- Execute: `npm install` novamente

## 🎯 Funcionalidades Principais

### Para Clientes:
- ✅ Login e Registro
- ✅ Visualizar produtos
- ✅ Adicionar ao carrinho
- ✅ Finalizar compra
- ✅ Visualizar pedidos

### Para Admin:
- ✅ Criar produtos
- ✅ Editar produtos
- ✅ Deletar produtos
- ✅ Ver todos os pedidos
- ✅ Gerenciar estoque
- ✅ Ver estatísticas

## 🎨 Design

- **Cores**: Branco e Preto (SMG Merch)
- **Responsivo**: Mobile, Tablet, Desktop
- **Moderno**: Interface limpa e intuitiva

## 📞 Próximas Etapas

1. Customize cores e logos conforme necessário
2. Adicione mais produtos
3. Configure seu domínio próprio
4. Implante em um servidor (Heroku, AWS, etc)

---

**Sistema pronto para uso! Bom desenvolvimento! 🚀**
