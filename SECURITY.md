# 🔒 Guia de Segurança - SMG Merch

## Melhorias de Segurança Implementadas

### 1. **Helmet.js - Headers HTTP Seguros**
✅ Instalado e configurado  
- Protege contra clickjacking (X-Frame-Options)
- Remove headers perigosos (X-Powered-By)
- Ativa X-Content-Type-Options
- HTTPS redirect automático em produção

```typescript
import helmet from 'helmet';
app.use(helmet());
```

### 2. **CORS com Whitelist**
✅ Implementado  
- Antes: Aberto para qualquer origem (`*`)
- Agora: Whitelist de domínios específicos
- Use a variável `ALLOWED_ORIGINS` no `.env`

```env
ALLOWED_ORIGINS=http://localhost:3000,https://seu-dominio.com
```

### 3. **Rate Limiting - Proteção contra Força Bruta**
✅ Implementado com express-rate-limit  
- **Global**: 100 requisições por 15 minutos
- **Login específico**: 5 tentativas por 15 minutos
- URL: Protege `/api/usuarios/login`

```typescript
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // máximo 5 tentativas
  skipSuccessfulRequests: true
});
app.post('/login', loginLimiter, ...);
```

### 4. **Session Security - Proteção CSRF**
✅ Melhorado  
- **HttpOnly**: Cookies não acessíveis por JavaScript
- **SameSite=strict**: Proteção contra CSRF
- **Secure**: Ativado apenas em HTTPS (produção)
- **maxAge**: 24 horas

```typescript
cookie: {
  httpOnly: true,
  sameSite: 'strict',
  secure: NODE_ENV === 'production',
  maxAge: 24 * 60 * 60 * 1000
}
```

### 5. **Validação Robusta de Entrada**
✅ Classe `Validators` criada  
- Validação de usuário (3-50 caracteres, alphanumério)
- Validação de senha (mínimo 6 caracteres)
- Validação de email com regex
- Validação de CPF (11 dígitos)
- Validação de CEP (8 dígitos)
- Validação de preço (positivo, máximo 999.999,99)
- Validação de quantidade (1-1000)
- Validação de tamanho (P, M, G)

Exemplo:
```typescript
import { Validators } from '../utils/validators';

const validacao = Validators.validarEmail(email);
if (!validacao.valido) {
  return res.status(400).json({ erro: validacao.erro });
}
```

### 6. **Sanitização de Entrada**
✅ Implementado com validator.js  
- Escaping de strings
- Trimming automático
- Remoção de caracteres perigosos

### 7. **Tratamento de Erros Seguro**
✅ Middleware de erro global  
- Detalhes completos em desenvolvimento
- Mensagens genéricas em produção
- Logging estruturado

```typescript
// Development
{ "erro": "User not found" }

// Production
{ "erro": "Erro interno do servidor" }
```

### 8. **Autenticação Melhorada**
✅ Middleware atualizado  
- Verificação obrigatória de usuário
- Proteção de rotas admin
- Mensagens de erro padronizadas

### 9. **Busca de Produtos**
✅ Novo endpoint `/api/produtos/buscar/:termo`
- Protegido contra SQL Injection (parameterized queries)
- Limite de 20 resultados
- Validação de termo (mínimo 2 caracteres)

### 10. **Ambiente Seguro**
✅ Variáveis de ambiente  
- `NODE_ENV` diferencia produção/desenvolvimento
- `SESSION_SECRET` dinâmico
- `ALLOWED_ORIGINS` customizável
- Debug mode desativado em produção

---

## Checklist de Segurança para Produção

### Antes de Deploy:

- [ ] `NODE_ENV=production`
- [ ] `SESSION_SECRET` alterado (não usar padrão)
- [ ] `ALLOWED_ORIGINS` com domínio real
- [ ] HTTPS/SSL configurado
- [ ] Database backups automáticos
- [ ] Logs centralizados
- [ ] Monitoramento ativo
- [ ] WAF (Web Application Firewall)

### Não Implementado (Próximo Passo):

- ❌ Autenticação 2FA
- ❌ Sistema de Pagamento (Stripe, PayPal)
- ❌ Envio de Email (para recuperação de senha)
- ❌ Testes automatizados
- ❌ API Rate Limiting por usuário
- ❌ Audit logs
- ❌ Criptografia de dados sensíveis

---

## Como Usar os Validadores

```typescript
import { Validators } from '../utils/validators';

// Validar usuário
const { valido, erro } = Validators.validarUsuario('novo_user');
if (!valido) {
  console.log(erro); // "Usuário deve ter no mínimo 3 caracteres"
}

// Validar email
const validEmail = Validators.validarEmail('user@example.com');

// Validar CPF
const validCPF = Validators.validarCPF('123.456.789-00');

// Sanitizar string
const seguro = Validators.sanitizarString('<script>alert("xss")</script>');
// Resultado: "&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;"
```

---

## Status de Segurança

| Aspecto | Status | Score |
|---|---|---|
| **Headers HTTP** | ✅ Helmet | 10/10 |
| **CORS** | ✅ Whitelist | 9/10 |
| **Rate Limiting** | ✅ Implementado | 8/10 |
| **Validação** | ✅ Robusta | 9/10 |
| **Session Security** | ✅ Configurado | 9/10 |
| **Sanitização** | ✅ Implementada | 8/10 |
| **Autenticação** | ✅ Básica | 7/10 |
| **Criptografia** | ⚠️ Apenas senha | 5/10 |
| **Testes** | ❌ Nenhum | 0/10 |
| **Audit Logs** | ❌ Nenhum | 0/10 |

**Score Total: 65/100** (Bom para MVP, precisa melhorias antes de produção)

---

## Referências

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express Security](https://expressjs.com/en/advanced/best-practice-security.html)
- [helmet.js](https://helmetjs.github.io/)
- [validator.js](https://github.com/validatorjs/validator.js)
