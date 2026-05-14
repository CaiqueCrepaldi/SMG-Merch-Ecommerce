# SMG Merch — Loja Online

Plataforma de e-commerce para merchandising, desenvolvida com Node.js, TypeScript, Express e MySQL.

---

## Tecnologias

**Backend:** Node.js · TypeScript · Express · MySQL 2 · bcryptjs · express-session · express-rate-limit · validator  
**Frontend:** HTML5 · CSS3 · JavaScript (Vanilla) · Fetch API · ViaCEP API

---

## Estrutura do Projeto

```
SMG-Merch-Ecommerce/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── limiters.ts          # Rate limiting
│   │   ├── controllers/
│   │   │   ├── usuarioController.ts
│   │   │   ├── produtoController.ts
│   │   │   ├── pedidoController.ts
│   │   │   └── freteController.ts
│   │   ├── database/
│   │   │   └── index.ts             # Pool de conexão MySQL
│   │   ├── middleware/
│   │   │   └── auth.ts              # Autenticação e autorização
│   │   ├── routes/
│   │   │   ├── usuarioRoutes.ts
│   │   │   ├── produtoRoutes.ts
│   │   │   ├── pedidoRoutes.ts
│   │   │   └── freteRoutes.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── utils/
│   │   │   └── validators.ts
│   │   └── server.ts
│   ├── database/
│   │   └── schema.sql               # Schema do banco de dados
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── index.html                   # Página inicial
│   ├── auth.html                    # Login / Registro / Recuperação
│   ├── loja.html                    # Loja e carrinho
│   ├── admin.html                   # Painel administrativo
│   ├── cliente.html                 # Perfil do cliente
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── auth.js
│       ├── loja.js
│       ├── admin.js
│       └── cliente.js
├── start.bat                        # Inicialização Windows
├── start.sh                         # Inicialização Linux/Mac
└── .gitignore
```

---

## Pré-requisitos

- [Node.js](https://nodejs.org/) v18 ou superior
- MySQL Server 8.0 ou superior

---

## Instalação

### 1. Criar o banco de dados

```bash
mysql -u root -p < backend/database/schema.sql
```

Ou abra o arquivo [backend/database/schema.sql](backend/database/schema.sql) no MySQL Workbench e execute.

### 2. Configurar variáveis de ambiente

```bash
cp backend/.env.example backend/.env
```

Edite `backend/.env` com suas credenciais:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha_aqui
DB_NAME=smg_merch
DB_PORT=3306

PORT=3000
NODE_ENV=development

# Gere uma chave segura:
# node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
SESSION_SECRET=chave_longa_e_aleatoria_aqui

# Domínio do frontend em produção
CORS_ORIGIN=http://localhost:3000
```

### 3. Instalar dependências e iniciar

```bash
cd backend
npm install
npm run dev       # desenvolvimento (ts-node)
```

Para produção:

```bash
npm run build     # compila TypeScript para dist/
npm start         # executa o compilado
```

O servidor ficará disponível em **http://localhost:3000**

### Usando os scripts prontos

**Windows:** execute `start.bat`  
**Linux/Mac:**
```bash
chmod +x start.sh && ./start.sh
```

---

## Criar usuário admin

Após criar o banco, gere o hash bcrypt da sua senha e insira no banco:

```bash
node -e "const b=require('bcryptjs'); b.hash('SUA_SENHA',10).then(h=>console.log(h))"
```

```sql
INSERT INTO usuarios (usuario, senha, email)
VALUES ('admin', '<hash_gerado_acima>', 'admin@seudominio.com');
```

---

## Páginas

| Rota | Descrição | Acesso |
|------|-----------|--------|
| `/` | Página inicial | Público |
| `/auth` | Login, registro e recuperação de senha | Público |
| `/loja` | Catálogo de produtos e carrinho | Público |
| `/cliente` | Perfil do usuário logado | Autenticado |
| `/admin` | Painel administrativo | Admin |

---

## API

### Autenticação

| Método | Rota | Descrição | Acesso |
|--------|------|-----------|--------|
| `POST` | `/api/usuarios/login` | Fazer login | Público |
| `POST` | `/api/usuarios/registrar` | Registrar conta | Público |
| `POST` | `/api/usuarios/logout` | Encerrar sessão | Autenticado |
| `GET` | `/api/usuarios/me` | Dados do usuário atual | Autenticado |
| `POST` | `/api/usuarios/alterar-senha` | Alterar própria senha | Autenticado |
| `PUT` | `/api/usuarios/perfil/atualizar` | Atualizar e-mail | Autenticado |
| `POST` | `/api/usuarios/recuperar-senha` | Solicitar recuperação | Público |
| `POST` | `/api/usuarios/resetar-senha` | Redefinir senha | Público |
| `GET` | `/api/auth/status` | Verificar se está logado | Público |

### Usuários (admin)

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/usuarios` | Listar todos os usuários |
| `PUT` | `/api/usuarios/:id` | Atualizar usuário |
| `DELETE` | `/api/usuarios/:id` | Deletar usuário |

### Produtos

| Método | Rota | Descrição | Acesso |
|--------|------|-----------|--------|
| `GET` | `/api/produtos` | Listar todos | Público |
| `GET` | `/api/produtos/:id` | Obter um produto | Público |
| `POST` | `/api/produtos` | Criar produto | Admin |
| `PUT` | `/api/produtos/:id` | Atualizar produto | Admin |
| `DELETE` | `/api/produtos/:id` | Deletar produto | Admin |

### Pedidos

| Método | Rota | Descrição | Acesso |
|--------|------|-----------|--------|
| `POST` | `/api/pedidos` | Criar pedido | Público |
| `GET` | `/api/pedidos/meus-pedidos` | Meus pedidos | Autenticado |
| `GET` | `/api/pedidos` | Todos os pedidos | Admin |
| `GET` | `/api/pedidos/:id` | Detalhe do pedido | Autenticado |

### Frete

| Método | Rota | Descrição |
|--------|------|-----------|
| `POST` | `/api/frete/calcular` | Calcular frete por CEP |

### Exemplos de uso

**Login:**
```json
POST /api/usuarios/login
{ "usuario": "seu_usuario", "senha": "sua_senha" }
```

**Criar produto (admin):**
```json
POST /api/produtos
{ "nome": "Camiseta SMG", "preco": 89.90, "img": "https://...", "tamanhos": { "P": 10, "M": 15, "G": 8 } }
```

**Finalizar pedido:**
```json
POST /api/pedidos
{ "produtos": [{ "id": 1, "tamanho": "M", "quantidade": 2 }] }
```

**Calcular frete:**
```json
POST /api/frete/calcular
{ "cep": "01310100", "peso": 5 }
```

---

## Banco de Dados

### Tabela `usuarios`
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | INT PK | Identificador |
| `usuario` | VARCHAR(50) UNIQUE | Nome de usuário |
| `senha` | VARCHAR(255) | Hash bcrypt |
| `cpf` | VARCHAR(20) | CPF |
| `email` | VARCHAR(100) | E-mail |
| `created_at` | TIMESTAMP | Data de criação |

### Tabela `produtos`
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | INT PK | Identificador |
| `nome` | VARCHAR(100) | Nome do produto |
| `preco` | DECIMAL(10,2) | Preço |
| `img` | TEXT | URL da imagem |
| `tamanhos` | JSON | Estoque por tamanho `{"P":0,"M":0,"G":0}` |

### Tabela `pedidos`
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | INT PK | Identificador |
| `usuario` | VARCHAR(50) | Nome do usuário |
| `produtos` | JSON | Itens do pedido |
| `total` | DECIMAL(10,2) | Valor total |
| `data` | TIMESTAMP | Data do pedido |

---

## Segurança

| Recurso | Implementação |
|---------|---------------|
| Hash de senhas | bcryptjs com 10 rounds |
| Sessões | HttpOnly cookies, 24h de duração |
| Rate limiting global | 100 req / 15 min por IP |
| Rate limiting login | 5 tentativas / 15 min por IP |
| CORS | Restrito à origem configurada em `CORS_ORIGIN` |
| SQL Injection | Queries parametrizadas (mysql2) |
| Validação de entrada | Classe `Validators` com 12 validadores |
| Erros em produção | Mensagens genéricas (detalhes ocultados) |
| Variáveis sensíveis | `.env` nunca commitado |

**Checklist antes de ir para produção:**
- [ ] `NODE_ENV=production`
- [ ] `SESSION_SECRET` com chave aleatória longa
- [ ] `CORS_ORIGIN` com domínio real
- [ ] HTTPS/SSL configurado no servidor
- [ ] Alterar senha do usuário admin padrão

---

## Troubleshooting

**Erro de conexão ao MySQL**
- Verifique se o MySQL está rodando
- Confirme usuário, senha e porta no `backend/.env`
- Verifique se o banco `smg_merch` foi criado

**Sessão não persiste**
- Certifique-se que `SESSION_SECRET` está definido no `.env`
- Limpe os cookies do navegador

**Porta 3000 já está em uso**
- Altere `PORT` no `backend/.env`

**`npm install` falha**
- Delete `backend/node_modules/` e execute novamente

**TypeScript não compila**
- Verifique se está dentro da pasta `backend/`
- Execute `npx tsc --noEmit` para ver os erros

---

## Scripts disponíveis

Execute dentro da pasta `backend/`:

```bash
npm run dev      # Inicia com ts-node (desenvolvimento)
npm run build    # Compila TypeScript para dist/
npm start        # Executa o build compilado
npm run watch    # Recompila automaticamente ao salvar
```

---

## Licença

Caique Crepaldi — 2026
