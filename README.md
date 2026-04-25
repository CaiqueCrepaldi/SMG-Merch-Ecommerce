# SMG Merch - Loja Online Completa

Loja de merchandising com CRUD completo usando Node.js, TypeScript e MySQL.

## 🚀 Funcionalidades

- ✅ **Sistema de Autenticação**: Login e registro de usuários
- ✅ **CRUD de Produtos**: Criar, ler, atualizar e deletar produtos (admin)
- ✅ **Loja Online**: Visualizar e comprar produtos
- ✅ **Carrinho de Compras**: Carrinho persistente no localStorage
- ✅ **Estoque**: Controle de estoque por tamanho (P, M, G)
- ✅ **Pedidos**: Criar e visualizar pedidos
- ✅ **Painel Admin**: Dashboard com estatísticas
- ✅ **Responsivo**: Design adaptável para mobile
- ✅ **Estética**: Branco e preto (SMG Merch)

## 📋 Pré-requisitos

- Node.js (v16+)
- MySQL Server
- npm ou yarn

## 🔧 Instalação

### 1. Clonar/Preparar Projeto
```bash
# Navegar até o diretório
cd "c:\Users\caiqu\OneDrive\Documents\PROJETO SMG"
```

### 2. Instalar Dependências
```bash
npm install
```

### 3. Configurar Banco de Dados
- Abrir MySQL Workbench
- Executar o script do banco de dados fornecido (smg_merch.sql)
- O banco criará as tabelas e dados de teste

### 4. Configurar Variáveis de Ambiente
```bash
# Copiar arquivo de exemplo
copy .env.example .env

# Editar .env com suas credenciais MySQL
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=smg_merch
DB_PORT=3306
PORT=3000
```

### 5. Compilar TypeScript
```bash
npm run build
```

### 6. Iniciar o Servidor
```bash
# Modo desenvolvimento (com recompilação automática)
npm run dev

# Modo produção
npm start
```

O servidor estará rodando em: **http://localhost:3000**

## 🔐 Teste Rápido

### Credenciais de Teste
- **Usuário**: admin
- **Senha**: 12345678

### URL de Acesso
- Página inicial: http://localhost:3000/
- Loja: http://localhost:3000/loja (após login)
- Admin: http://localhost:3000/admin (apenas admin)

## 📁 Estrutura do Projeto

```
PROJETO SMG/
├── src/
│   ├── controllers/
│   │   ├── usuarioController.ts
│   │   ├── produtoController.ts
│   │   └── pedidoController.ts
│   ├── routes/
│   │   ├── usuarioRoutes.ts
│   │   ├── produtoRoutes.ts
│   │   └── pedidoRoutes.ts
│   ├── middleware/
│   │   └── auth.ts
│   ├── database.ts
│   ├── types.ts
│   └── server.ts
├── public/
│   ├── index.html (Login/Registro)
│   ├── loja.html (Loja Online)
│   ├── admin.html (Painel Admin)
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── auth.js
│       ├── loja.js
│       └── admin.js
├── package.json
├── tsconfig.json
├── .env
└── .gitignore
```

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js** - Ambiente de execução JavaScript
- **Express.js** - Framework web
- **TypeScript** - Linguagem tipada
- **MySQL2** - Driver MySQL
- **BCryptjs** - Hash de senhas
- **Express-session** - Gerenciamento de sessão

### Frontend
- **HTML5** - Markup
- **CSS3** - Estilos (Branco e Preto)
- **Vanilla JavaScript** - Interatividade
- **Fetch API** - Requisições HTTP

## 📝 Endpoints da API

### Autenticação
- `POST /api/usuarios/login` - Fazer login
- `POST /api/usuarios/registrar` - Registrar novo usuário
- `POST /api/usuarios/logout` - Fazer logout
- `GET /api/usuarios/me` - Dados do usuário atual

### Produtos
- `GET /api/produtos` - Listar todos (público)
- `GET /api/produtos/:id` - Obter produto (público)
- `POST /api/produtos` - Criar (admin)
- `PUT /api/produtos/:id` - Atualizar (admin)
- `DELETE /api/produtos/:id` - Deletar (admin)

### Pedidos
- `POST /api/pedidos` - Criar pedido (autenticado)
- `GET /api/pedidos/meus-pedidos` - Meus pedidos (autenticado)
- `GET /api/pedidos` - Todos os pedidos (admin)
- `GET /api/pedidos/:id` - Obter pedido (autenticado)

## 💾 Banco de Dados

### Tabelas

**usuarios**
- id (INT, PK)
- usuario (VARCHAR 50, UNIQUE)
- senha (VARCHAR 255)
- cpf (VARCHAR 20)
- email (VARCHAR 100)
- created_at (TIMESTAMP)

**produtos**
- id (INT, PK)
- nome (VARCHAR 100)
- preco (DECIMAL 10,2)
- img (TEXT)
- tamanhos (JSON)

**pedidos**
- id (INT, PK)
- usuario (VARCHAR 50)
- produtos (JSON)
- total (DECIMAL 10,2)
- data (TIMESTAMP)

## 🎨 Design

### Cores Principais
- **Branco**: #ffffff
- **Preto**: #000000
- **Cinza**: #f5f5f5

### Tipografia
- Font: Segoe UI, Tahoma, Geneva
- Responsivo para desktop, tablet e mobile

## 🚀 Próximos Passos

Possíveis melhorias:
- [ ] Sistema de pagamento integrado (Stripe/PayPal)
- [ ] Email de confirmação de pedido
- [ ] Filtros avançados de produtos
- [ ] Sistema de avaliações
- [ ] Cupons e descontos
- [ ] Histórico de vendas (gráficos)
- [ ] Sistema de notificações
- [ ] Dark mode completo

## 📞 Suporte

Desenvolvido com ❤️ para SMG Merch

## 📄 Licença

Caique Crepaldi - 2026

---

**Made with Node.js + TypeScript + MySQL** 🎯
