# 📦 Atualização de Produtos - Endpoints

## ✅ Alterações Implementadas

Todos os endpoints de produtos agora **salva direto no banco de dados** com validações robustas!

---

## 🔧 Endpoints de Produto

### 1. **GET /api/produtos** - Listar Todos
**Descrição**: Obter todos os produtos
**Autenticação**: Não requer
**Resposta (200)**:
```json
{
  "sucesso": true,
  "total": 3,
  "produtos": [
    {
      "id": 1,
      "nome": "Camiseta SMG",
      "preco": 89.90,
      "img": "https://...",
      "tamanhos": { "P": 10, "M": 15, "G": 8 }
    }
  ]
}
```

---

### 2. **GET /api/produtos/:id** - Obter Um Produto
**Descrição**: Obter detalhes de um produto específico
**Autenticação**: Não requer
**URL**: `GET /api/produtos/1`

**Resposta (200)**:
```json
{
  "sucesso": true,
  "produto": {
    "id": 1,
    "nome": "Camiseta SMG",
    "preco": 89.90,
    "img": "https://...",
    "tamanhos": { "P": 10, "M": 15, "G": 8 }
  }
}
```

**Erro (404)**:
```json
{
  "sucesso": false,
  "erro": "Produto não encontrado",
  "tipo": "produto_nao_encontrado"
}
```

---

### 3. **GET /api/produtos/buscar/:termo** - Buscar Produtos
**Descrição**: Buscar produtos por termo
**Autenticação**: Não requer
**URL**: `GET /api/produtos/buscar/camiseta`

**Resposta (200)**:
```json
{
  "sucesso": true,
  "termo": "camiseta",
  "total": 2,
  "produtos": [...]
}
```

**Erro (400)**:
```json
{
  "sucesso": false,
  "erro": "Termo de busca deve ter no mínimo 2 caracteres",
  "tipo": "termo_invalido"
}
```

---

### 4. **POST /api/produtos** - Criar Produto
**Descrição**: Criar novo produto (Admin só)
**Autenticação**: Requer login + Admin
**Body**:
```json
{
  "nome": "Camiseta Nova",
  "preco": 99.90,
  "img": "https://exemplo.com/imagem.jpg",
  "tamanhos": { "P": 5, "M": 10, "G": 8 }
}
```

**Resposta (201)**:
```json
{
  "sucesso": true,
  "mensagem": "Produto criado com sucesso",
  "produto": {
    "id": 4,
    "nome": "Camiseta Nova",
    "preco": 99.90,
    "img": "https://exemplo.com/imagem.jpg",
    "tamanhos": { "P": 5, "M": 10, "G": 8 }
  }
}
```

**Validações**:
- ❌ Nome obrigatório (3-100 caracteres)
- ❌ Preço obrigatório (número positivo, máx 999.999,99)
- ❌ URL de imagem válida (se fornecida)

---

### 5. **PUT /api/produtos/:id** - Atualizar Produto ⭐
**Descrição**: Atualizar produto existente (Admin só)
**Autenticação**: Requer login + Admin
**URL**: `PUT /api/produtos/1`

**Body** (todos os campos são opcionais - envie apenas o que quer alterar):
```json
{
  "nome": "Camiseta SMG Atualizada",
  "preco": 109.90,
  "img": "https://novo-link.com/img.jpg",
  "tamanhos": { "P": 20, "M": 15, "G": 10 }
}
```

**Resposta (200) - ✅ Salva direto no banco**:
```json
{
  "sucesso": true,
  "mensagem": "Produto atualizado com sucesso",
  "produto": {
    "id": 1,
    "nome": "Camiseta SMG Atualizada",
    "preco": 109.90,
    "img": "https://novo-link.com/img.jpg",
    "tamanhos": { "P": 20, "M": 15, "G": 10 }
  }
}
```

**Validações**:
- ✅ ID do produto deve ser válido
- ✅ Produto deve existir no banco
- ✅ Nome (se fornecido): 3-100 caracteres
- ✅ Preço (se fornecido): número positivo
- ✅ URL imagem (se fornecida): válida
- ✅ Tamanhos (se fornecidos): P/M/G com valores inteiros >= 0

**Erros Possíveis**:
```json
// ID inválido
{
  "sucesso": false,
  "erro": "ID do produto inválido",
  "tipo": "id_invalido"
}

// Produto não existe
{
  "sucesso": false,
  "erro": "Produto não encontrado",
  "tipo": "produto_nao_encontrado"
}

// Nome muito curto
{
  "sucesso": false,
  "erro": "Nome do produto deve ter no mínimo 3 caracteres",
  "tipo": "nome_invalido"
}

// Preço negativo
{
  "sucesso": false,
  "erro": "Preço não pode ser negativo",
  "tipo": "preco_invalido"
}

// Tamanho inválido
{
  "sucesso": false,
  "erro": "Tamanho inválido: X. Aceitos: P, M, G",
  "tipo": "tamanho_invalido"
}
```

---

### 6. **DELETE /api/produtos/:id** - Deletar Produto
**Descrição**: Deletar produto (Admin só)
**Autenticação**: Requer login + Admin
**URL**: `DELETE /api/produtos/1`

**Resposta (200)**:
```json
{
  "sucesso": true,
  "mensagem": "Produto deletado com sucesso",
  "id": 1
}
```

**Erro (404)**:
```json
{
  "sucesso": false,
  "erro": "Produto não encontrado",
  "tipo": "produto_nao_encontrado"
}
```

---

## 🧪 Exemplos com CURL

### Criar Produto
```bash
curl -X POST http://localhost:3000/api/produtos \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Nova Camiseta",
    "preco": 89.90,
    "img": "https://exemplo.com/img.jpg",
    "tamanhos": {"P": 10, "M": 15, "G": 8}
  }'
```

### Atualizar Produto (SALVA NO BANCO DIRETO!) ⭐
```bash
curl -X PUT http://localhost:3000/api/produtos/1 \
  -H "Content-Type: application/json" \
  -d '{
    "preco": 99.90,
    "tamanhos": {"P": 20, "M": 25, "G": 15}
  }'
```

### Buscar Produtos
```bash
curl http://localhost:3000/api/produtos/buscar/camiseta
```

### Deletar Produto
```bash
curl -X DELETE http://localhost:3000/api/produtos/1
```

---

## 🔄 Fluxo de Atualização

```
1. Admin faz PUT /api/produtos/:id
   ↓
2. Validações são executadas
   ↓
3. ✅ Sucesso → UPDATE no MySQL
   ❌ Erro → Retorna erro específico
   ↓
4. SELECT produto atualizado do banco
   ↓
5. Retorna produto atualizado no JSON
```

**Importante**: O produto é **recuperado do banco** após a atualização para garantir que retorna os dados exatos do banco de dados!

---

## 🛡️ Segurança

✅ **Rate Limiting**: Máximo 100 requisições/15min por IP  
✅ **Autenticação**: Admin apenas (PUT, POST, DELETE)  
✅ **Validação**: Todos os campos validados e sanitizados  
✅ **Prepared Statements**: Proteção contra SQL injection  
✅ **Erro Handling**: Mensagens seguras sem expor detalhes internos  

---

## 📊 Estrutura no Banco

**Tabela: produtos**
```sql
id          INT PRIMARY KEY AUTO_INCREMENT
nome        VARCHAR(100)
preco       DECIMAL(10,2)
img         TEXT
tamanhos    JSON ({"P": int, "M": int, "G": int})
```

**Consulta de Atualização** (gerada automaticamente):
```sql
UPDATE produtos 
SET nome = ?, preco = ?, img = ?, tamanhos = ?
WHERE id = ?
```

---

## ✨ Resumo de Melhorias

| Feature | Antes | Depois |
|---------|--------|--------|
| Atualização de Produtos | ⚠️ Incompleto | ✅ Completo |
| Validação no PUT | ❌ Mínima | ✅ Robusta |
| Retorno do PUT | ⚠️ Só ID | ✅ Produto completo do banco |
| Error Handling | ❌ Genérico | ✅ Específico |
| GET Produtos | ⚠️ Array puro | ✅ Com metadata |
| Logging | ❌ Nenhum | ✅ Console errors |

---

## 🚀 Uso do Admin

### Atualizar apenas o preço:
```json
PUT /api/produtos/1
{
  "preco": 149.90
}
```

### Atualizar estoque de um tamanho:
```json
PUT /api/produtos/5
{
  "tamanhos": { "P": 50, "M": 30, "G": 20 }
}
```

### Atualizar tudo de uma vez:
```json
PUT /api/produtos/1
{
  "nome": "Novo Nome",
  "preco": 199.90,
  "img": "https://nova-url.com/img.jpg",
  "tamanhos": { "P": 100, "M": 80, "G": 60 }
}
```

✅ **Todas as mudanças são salvas direto no MySQL!**
