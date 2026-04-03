# 🤍 SMG MERCH - Guia de Desenvolvimento

## 📋 Sumário Executivo

SMG Merch é uma plataforma de e-commerce specializada em merchandising underground e streetwear. O sistema oferece gerenciamento completo de produtos, pedidos e usuários através de uma interface administrativa intuitiva.

## 🛠 Stack Tecnológico

### Backend
- **Express.js** - Framework web Node.js
- **TypeScript** - Tipagem estática
- **MySQL 2** - Banco de dados relacional
- **bcryptjs** - Hash de senhas
- **dotenv** - Gerenciamento de variáveis de ambiente

### Frontend
- **HTML5/CSS3** - Markup e estilização
- **Vanilla JavaScript** - Lógica frontend
- **LocalStorage** - Persistência de dados do carrinho
- **ViaCEP API** - Cálculo de frete

## 🚀 Quick Start

### 1. Instalação
```bash
npm install
```

### 2. Configurar Banco de Dados
```bash
# Execute o script de criação de banco
mysql -u root -p < database_corrected.sql
```

### 3. Configuração de Variáveis
```bash
cp .env.example .env
# Edite .env com suas credenciais
```

### 4. Iniciar Servidor
```bash
npm start
```

O servidor estará disponível em `http://localhost:3000`

## 📖 Documentação de API

### Autenticação

#### Login
```
POST /api/usuarios/login
Content-Type: application/json

{
  "usuario": "admin",
  "senha": "12345678"
}

Response (200):
{
  "mensagem": "Login realizado com sucesso",
  "usuario": {
    "id": 1,
    "usuario": "admin",
    "email": "admin@smg.com",
    "cpf": "123.456.789-00",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}

Error (401):
{
  "error": "Senha incorreta, tente novamente"
}
```

#### Registrar
```
POST /api/usuarios/registrar
Content-Type: application/json

{
  "usuario": "novo_usuario",
  "email": "usuario@email.com",
  "cpf": "000.000.000-00",
  "senha": "senha123"
}
```

#### Logout
```
POST /api/usuarios/logout
Response (200):
{
  "mensagem": "Logout realizado com sucesso"
}
```

#### Recuperar Senha
```
POST /api/usuarios/recuperar-senha
Content-Type: application/json

{
  "usuario": "seu_usuario",
  "email": "seu@email.com"
}

Response (200):
{
  "mensagem": "Se o usuário e email existem, instruções foram enviadas",
  "codigoRecuperacao": "abc123def456..." (apenas desenvolvimento)
}
```

#### Resetar Senha
```
POST /api/usuarios/resetar-senha
Content-Type: application/json

{
  "usuario": "seu_usuario",
  "email": "seu@email.com",
  "novaSenha": "nova_senha_123"
}
```

### Usuários (Admin Only)

#### Listar Usuários
```
GET /api/usuarios
Authorization: Session com admin

Response (200):
[
  {
    "id": 1,
    "usuario": "admin",
    "email": "admin@smg.com",
    "cpf": "123.456.789-00",
    "created_at": "2024-01-01T00:00:00.000Z"
  },
  ...
]
```

#### Atualizar Usuário
```
PUT /api/usuarios/:id
Authorization: Session com admin
Content-Type: application/json

{
  "email": "novo@email.com",
  "cpf": "111.222.333-44",
  "novaSenha": "nova_senha" // opcional
}
```

#### Deletar Usuário
```
DELETE /api/usuarios/:id
Authorization: Session com admin
```

### Produtos (Public/Admin)

#### Listar Produtos
```
GET /api/produtos

Response (200):
[
  {
    "id": 1,
    "nome": "Camiseta SMG Drops 1",
    "preco": 89.90,
    "img": "https://...",
    "tamanhos": {
      "P": 10,
      "M": 15,
      "G": 8
    }
  },
  ...
]
```

#### Criar Produto (Admin Only)
```
POST /api/produtos
Authorization: Session com admin
Content-Type: application/json

{
  "nome": "Novo Produto",
  "preco": 99.90,
  "img": "https://...",
  "tamanhos": {
    "P": 5,
    "M": 10,
    "G": 8
  }
}
```

#### Atualizar Produto (Admin Only)
```
PUT /api/produtos/:id
Authorization: Session com admin
Content-Type: application/json

{
  "nome": "Produto Atualizado",
  "preco": 109.90,
  "img": "https://...",
  "tamanhos": {
    "P": 3,
    "M": 7,
    "G": 5
  }
}
```

#### Deletar Produto (Admin Only)
```
DELETE /api/produtos/:id
Authorization: Session com admin
```

### Pedidos

#### Criar Pedido
```
POST /api/pedidos
Content-Type: application/json

{
  "produtos": [
    {
      "id": 1,
      "tamanho": "M",
      "quantidade": 2
    },
    {
      "id": 2,
      "tamanho": "G",
      "quantidade": 1
    }
  ]
}

Response (201):
{
  "mensagem": "Pedido criado com sucesso",
  "id": 1,
  "total": 279.70
}
```

#### Meus Pedidos (Autenticado)
```
GET /api/pedidos/meus-pedidos
Authorization: Session com usuário

Response (200):
[
  {
    "id": 1,
    "usuario": "usuario123",
    "produtos": [...],
    "total": 279.70,
    "data": "2024-03-28T10:00:00.000Z"
  },
  ...
]
```

#### Todos os Pedidos (Admin Only)
```
GET /api/pedidos
Authorization: Session com admin
```

## 🔐 Segurança

### Implementado
- ✅ Hash de senhas com bcryptjs (10 rounds)
- ✅ Sessões seguras com HttpOnly cookies
- ✅ Proteção CSRF via SameSite
- ✅ Validação de entrada de dados
- ✅ Proteção de rota admin

### Recomendado Para Produção
- [ ] HTTPS/SSL obrigatório
- [ ] Rate limiting nas rotas de autenticação
- [ ] Implementar JWT ou OAuth2
- [ ] Sanitização de HTML (XSS)
- [ ] CORS configurado restritivamente
- [ ] Logs de auditoria
- [ ] Backup automático do banco

## 📊 Estrutura do Banco de Dados

### Tabela: usuarios
```sql
id INT AUTO_INCREMENT PRIMARY KEY
usuario VARCHAR(50) UNIQUE NOT NULL
senha VARCHAR(255) NOT NULL (bcrypt hash)
cpf VARCHAR(20)
email VARCHAR(100)
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

### Tabela: produtos
```sql
id INT AUTO_INCREMENT PRIMARY KEY
nome VARCHAR(100) NOT NULL
preco DECIMAL(10,2) NOT NULL
img TEXT
tamanhos JSON DEFAULT '{"P":0,"M":0,"G":0}'
```

### Tabela: pedidos
```sql
id INT AUTO_INCREMENT PRIMARY KEY
usuario VARCHAR(50)
produtos JSON (array de items)
total DECIMAL(10,2)
data TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

## 🎯 Fluxos de Usuário

### Cliente Regular
1. Acessa homepage (`/`)
2. Clica em "Loja" para ver produtos
3. Adiciona produtos ao carrinho
4. Clica "Finalizar Compra"
5. Pode criar conta ou prosseguir como visitante
6. Checkout via WhatsApp

### Administrador
1. Acessa `/auth`
2. Realiza login com (admin/12345678)
3. Redirecionado automaticamente para `/admin`
4. Acessa dashboard com 3 abas:
   - **Produtos**: CRUD completo
   - **Pedidos**: Visualizar todos os pedidos com detalhes
   - **Usuários**: Gerenciar usuários, alterar senhas, deletar

## 📁 Estrutura de Pastas

```
PROJETO SMG/
├── src/
│   ├── server.ts                     # Configuração Express
│   ├── database.ts                   # Conexão MySQL
│   ├── types.ts                      # Tipos TypeScript
│   ├── controllers/
│   │   ├── usuarioController.ts
│   │   ├── produtoController.ts
│   │   └── pedidoController.ts
│   ├── routes/
│   │   ├── usuarioRoutes.ts
│   │   ├── produtoRoutes.ts
│   │   └── pedidoRoutes.ts
│   ├── middleware/
│   │   └── auth.ts                  # Autenticação/autorização
│   └── database/
│       └── index.ts                 # Pool de conexões
├── public/
│   ├── index.html                   # Homepage
│   ├── auth.html                    # Login/Registro/Recuperação
│   ├── loja.html                    # Loja/Carrinho
│   ├── admin.html                   # Painel administrativo
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── auth.js
│       ├── loja.js
│       └── admin.js
├── .env.example
├── database_corrected.sql           # Schema + dados iniciais
├── package.json
├── tsconfig.json
├── start.sh                         # Script inicio (Linux/Mac)
└── start.bat                        # Script inicio (Windows)
```

## 🔧 Variáveis de Ambiente

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=smg_merch
PORT=3000
NODE_ENV=development
SESSION_SECRET=sua_chave_secreta
```

## 🐛 Troubleshooting

### Erro de Conexão ao Banco
- Verificar se MySQL está rodando
- Verificar credenciais no .env
- Verificar se banco foi criado: `mysql -u root -p < database_corrected.sql`

### Sessão não persistente
- Verificar se cookies estão habilitados no navegador
- Limpar cache do navegador
- Verificar SESSION_SECRET no .env

### Botões não funcionam
- Limpar cache do navegador (Ctrl+Shift+Delete)
- Verificar console do navegador (F12 > Console)
- Verificar se servidor está rodando

## 📝 Notas de Produção

1. **Senhas padrão**: Alterar admin/12345678 imediatamente
2. **Backup**: Implementar backup automático do banco
3. **SSL**: Usar HTTPS em produção
4. **Logs**: Implementar sistema de logs estruturado
5. **Monitoramento**: Adicionar APM (Application Performance Monitoring)
6. **Email**: Integrar envio de email para recuperação de senha
7. **Pagamento**: Integrar gateway de pagamento (Stripe, PayPal, etc)

## 🚀 Próximos Passos (Roadmap)

### Curto Prazo
- [ ] Envio de email para recuperação de senha
- [ ] Implementar sistema de carrinho (banco de dados)
- [ ] Relatórios de vendas
- [ ] Filtros na loja (preço, categoria)

### Médio Prazo
- [ ] Sistema de categorias de produtos
- [ ] Reviews/Avaliações
- [ ] Cupons de desconto
- [ ] Integração com loja física

### Longo Prazo
- [ ] App mobile nativo
- [ ] Sistema de recomendação
- [ ] IA para análise de tendências
- [ ] Integração com redes sociais

## 📞 Suporte

Em caso de dúvidas, consulte:
- README.md - Documentação geral
- Código comentado nos controllers
- Logs do servidor (console)
- Browser DevTools (F12)

---

**Última atualização**: 28/03/2026
**Versão**: 1.1.0
**Status**: ✅ Em desenvolvimento
