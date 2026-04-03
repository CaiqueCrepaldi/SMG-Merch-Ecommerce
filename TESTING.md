# 🧪 Guia de Testes - SMG Merch

Este documento contém testes para validar se o sistema está funcionando corretamente.

## ✅ Verificação Pré-Inicialização

Antes de iniciar, verifique:

```bash
# 1. Node.js instalado
node --version
# Esperado: v16+ 

# 2. npm instalado
npm --version
# Esperado: v7+

# 3. MySQL rodando
# Abra MySQL Workbench e verifique conexão

# 4. Banco de dados criado
# Execute database.sql
```

## 🚀 Teste 1: Instalação

```bash
# 1. Navigate to project
cd "PROJETO SMG"

# 2. Install dependencies
npm install

# ✅ Esperado: Todos os pacotes instalados
# Procure por: "added X packages"
```

## 🔨 Teste 2: Compilação

```bash
# Compilar TypeScript
npm run build

# ✅ Esperado: Pasta dist/ criada com arquivos .js
# Verifique: dist/server.js existe
```

## 🗄️ Teste 3: Banco de Dados

```sql
-- Execute em MySQL Workbench

USE smg_merch;

-- Verificar tabelas
SHOW TABLES;
-- Esperado: usuarios, produtos, pedidos

-- Verificar usuários
SELECT COUNT(*) FROM usuarios;
-- Esperado: 2 registro (admin, teste)

-- Verificar produtos
SELECT * FROM produtos;
-- Esperado: 3 produtos com tamanhos

-- Verificar pedidos (vazio inicialmente)
SELECT COUNT(*) FROM pedidos;
-- Esperado: 0
```

## 🌐 Teste 4: Iniciar Servidor

```bash
# No terminal
npm run dev

# ✅ Esperado: Mensagem "Servidor SMG Merch rodando em http://localhost:3000"
# ✅ Conexão com banco estabelecida

# Para parar: Ctrl+C
```

## 🔐 Teste 5: Sistema de Autenticação

### 5.1 - Teste Login Admin

1. Acesse: http://localhost:3000/
2. Clique na aba "Login"
3. Preencha:
   - Usuário: `admin`
   - Senha: `12345678`
4. Clique em "Entrar"

✅ **Esperado:**
- Página redireciona para /admin
- Título da página: "SMG MERCH - Admin"
- Header com botão "Sair"

### 5.2 - Teste Logout

1. No painel admin, clique em "Sair"

✅ **Esperado:**
- Redireciona para /
- Session limpa

### 5.3 - Teste Registro Novo Usuário

1. Acesse: http://localhost:3000/
2. Clique na aba "Registrar"
3. Preencha:
   - Usuário: `novo_teste`
   - Email: `novo@teste.com`
   - CPF: `123.456.789-10`
   - Senha: `senha123`
4. Clique em "Registrar"

✅ **Esperado:**
- Mensagem "Usuário registrado com sucesso"
- Volta para aba Login
- Pode fazer login com novo usuário

## 🛒 Teste 6: Loja Online

### 6.1 - Acesso à Loja

1. Login com: `teste` / `12345678`
2. Página redireciona para /loja

✅ **Esperado:**
- Header com "SMG MERCH"
- Botões: Carrinho (0), Meus Pedidos, Sair
- Grid com 3 produtos visíveis

### 6.2 - Adicionar ao Carrinho

1. No primeiro produto:
   - Selecione tamanho (P, M ou G)
   - Clique "Adicionar ao Carrinho"

✅ **Esperado:**
- Alert: "Camiseta SMG Drops 1 (M) adicionado ao carrinho!"
- Contador no botão carrinho muda para 1

### 6.3 - Ver Carrinho

1. Clique no botão "Carrinho"
2. Modal abre com itens

✅ **Esperado:**
- Item com nome, tamanho, quantidade
- Botão remover
- Total calculado corretamente
- Botão "Finalizar Compra"

### 6.4 - Finalizar Compra

1. Com carrinho preenchido, clique "Finalizar Compra"

✅ **Esperado:**
- Alert: "Pedido #X criado com sucesso!"
- Carrinho limpo
- Contador volta para 0
- Estoque do produto atualizado

### 6.5 - Ver Meus Pedidos

1. Clique em "Meus Pedidos"
2. Modal mostra lista de pedidos

✅ **Esperado:**
- Pedido criado aparece na lista
- Mostra ID, data e total
- Pode clicar para ver detalhes

## 👨‍💼 Teste 7: Painel Admin

### 7.1 - Criar Novo Produto

1. Login com admin
2. Acesse /admin (automático)
3. Aba "Produtos" (já aberta)
4. Preencha formulário:
   - Nome: `Jaqueta Original`
   - Preço: `199.90`
   - Tamanho P: `5`
   - Tamanho M: `10`
   - Tamanho G: `8`
5. Clique "Criar Produto"

✅ **Esperado:**
- Mensagem "Produto criado com sucesso!"
- Produto aparece na tabela
- Estatísticas atualizadas

### 7.2 - Editar Produto

1. Na tabela, clique "Editar" em algum produto
2. Modal abre com dados
3. Altere preço para `99.90`
4. Clique "Salvar Alterações"

✅ **Esperado:**
- Alert: "Produto atualizado com sucesso!"
- Preço atualizado na tabela

### 7.3 - Deletar Produto

1. Na tabela, clique "Deletar" em algum produto
2. Confirme no dialog

✅ **Esperado:**
- Alert: "Produto deletado com sucesso!"
- Produto removido da tabela

### 7.4 - Ver Estatísticas

1. Clique na aba "Usuários"

✅ **Esperado:**
- 3 cards mostrando:
  - Total de Produtos: X
  - Total de Pedidos: X
  - Total de Vendas: R$ X.XX

### 7.5 - Ver Pedidos

1. Clique na aba "Pedidos"
2. Tabela com todos os pedidos

✅ **Esperado:**
- Pedidos criados aparecem
- Pode clicar "Ver Detalhes"
- Modal mostra produtos do pedido

## 📱 Teste 8: Responsividade

### 8.1 - Desktop
- Abra em tela cheia
- Tudo deve estar bem organizado

✅ **Esperado:**
- Grid de produtos em múltiplas colunas
- Tabelas visíveis completamente

### 8.2 - Tablet (768px)
- Redimensione navegador para ~768px

✅ **Esperado:**
- Layout se adapta
- Grid reduz para 2 colunas

### 8.3 - Mobile (480px)
- Redimensione para ~480px

✅ **Esperado:**
- Grid em 1 coluna
- Botões permanecem funcionais
- Modais redimensionam

## 🔗 Teste 9: API Endpoints

Abra DevTools (F12) e faça requisições via console:

```javascript
// 1. Listar produtos
fetch('http://localhost:3000/api/produtos')
  .then(r => r.json())
  .then(d => console.log(d))

// ✅ Esperado: Array com produtos

// 2. Verificar autenticação
fetch('http://localhost:3000/api/auth/status', {
  credentials: 'include'
})
  .then(r => r.json())
  .then(d => console.log(d))

// ✅ Esperado: { autenticado: true, usuario: 'admin' }
```

## 🐛 Teste 10: Tratamento de Erros

### 10.1 - Senha Incorreta
1. Login: admin
2. Senha: errada
3. Clique Entrar

✅ **Esperado:**
- Mensagem de erro: "Usuário ou senha inválidos"

### 10.2 - Produto Fora de Estoque
1. Na loja, tente comprar mais que o estoque disponível

✅ **Esperado:**
- Checkout fallha
- Mensagem: "Estoque insuficiente"

### 10.3 - Sem Tamanho Selecionado
1. Tente adicionar ao carrinho sem selecionar tamanho

✅ **Esperado:**
- Alert: "Selecione um tamanho!"

## 📋 Checklist Final

- [ ] Node.js e npm instalados
- [ ] Banco de dados criado
- [ ] npm install executado
- [ ] npm run build funcionou
- [ ] npm run dev iniciou o servidor
- [ ] Login admin funcionou
- [ ] Novo usuário registrado
- [ ] Loja exibe produtos
- [ ] Carrinho funciona
- [ ] Pedido criado com sucesso
- [ ] Painel admin acessa
- [ ] Criar produto funciona
- [ ] Editar produto funciona
- [ ] Deletar produto funciona
- [ ] Estatísticas aparecem
- [ ] Pedidos visíveis
- [ ] Responsividade OK
- [ ] API endpoints respondendo
- [ ] Tratamento de erros OK

## 🚀 Próximo Passo

Se todos os testes passaram:

1. **Desenvolvimento**: Faça customizações
2. **Deploy**: Envie para servidor de produção
3. **Monitoramento**: Configure logs e alerts

## 🆘 Problemas Comuns

| Problema | Solução |
|----------|---------|
| Porta 3000 em uso | Mude PORT em .env |
| BD não conecta | Verifique MySQL rodando |
| npm install falha | Delete node_modules e tente novamente |
| TypeScript não compila | Verifique instalação do TypeScript |
| CORS error | Adicione origem no CORS |

---

**Sistema teste completo! Sucesso! 🎉**
