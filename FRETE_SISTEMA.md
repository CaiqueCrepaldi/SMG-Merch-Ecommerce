# 📦 Sistema de Cálculo de Frete - SMG Merch

## Visão Geral

O sistema de cálculo de frete automaticamente calcula os preços de entrega através da API dos Correios, com preços diferenciados por região do Brasil.

## 🚚 Opções de Entrega

### SEDEX (Entrega Rápida)
- Preço base: R$ 50,00
- Prazo: 1-6 dias úteis (varia por região)

### PAC (Entrega Econômica)
- Preço base: R$ 25,00
- Prazo: 4-12 dias úteis (varia por região)

## 🗺️ Regiões e Preços

### Região **SUDESTE/SUL** - ✅ MAIS BARATO (-30%)
Preços reduzidos em 30%

Estados: SP, RJ, PR, SC, RS
Estados: MG, ES (-25%)

**Prazos:**
- SEDEX: 1-2 dias
- PAC: 4-5 dias

---

### Região **NORDESTE** - Preço Normal (1.0)

Estados: BA, PE, CE, MA, PB, RN, AL, SE, PI

**Prazos:**
- SEDEX: 3-4 dias
- PAC: 7-8 dias

---

### Região **CENTRO-OESTE** - Preço Normal (1.0)

Estados: GO, MT, MS, DF

**Prazos:**
- SEDEX: 2-3 dias
- PAC: 5-8 dias

---

### Região **NORTE** - ⚠️ MAIS CARO (+25-30%)
Preços acrescidos em 25-30%

Estados: AM, PA, RO, AC, AP, RR (+30%)
Estados: TO (+15%)

**Prazos:**
- SEDEX: 5-6 dias
- PAC: 9-12 dias

## 💻 API Endpoints

### Calcular Frete

**POST** `/api/frete/calcular`

**Request:**
```json
{
  "cep": "01310-100",
  "peso": 5
}
```

**Response (Sucesso):**
```json
{
  "sucesso": true,
  "regiao": {
    "estado": "SP",
    "cidade": "São Paulo",
    "regiao": "Sudeste/Sul"
  },
  "opcoes": [
    {
      "tipo": "SEDEX",
      "preco": 35.00,
      "diasEntrega": 1,
      "descricao": "SEDEX - Entrega em até 1 dia(s)"
    },
    {
      "tipo": "PAC",
      "preco": 17.50,
      "diasEntrega": 4,
      "descricao": "PAC - Entrega em até 4 dias"
    }
  ]
}
```

**Response (Erro):**
```json
{
  "sucesso": false,
  "erro": "CEP inválido"
}
```

## 🔧 Como Funciona

1. **Usuário insere o CEP** na modal de cálculo de frete
2. **Sistema valida o CEP** (8 dígitos)
3. **API ViaCEP** identifica o estado/região
4. **Multiplicador regional** é aplicado aos preços base
5. **Prazos de entrega** são mostrados conforme região
6. **Usuário seleciona** uma opção de frete
7. **Frete é armazenado** no localStorage para referência

## 📊 Tabela de Multiplicadores

| Região | Estado | Multiplicador | Desconto/Acréscimo |
|--------|--------|---------------|--------------------|
| Sudeste/Sul | SP, PR, SC, RS | 0.7 | -30% |
| Sudeste/Sul | RJ, MG, ES | 0.75 | -25% |
| Nordeste | BA, PE, CE, etc | 1.0 | Normal |
| Centro-Oeste | GO, MT, MS, DF | 1.0 | Normal |
| Norte | AM, AC, AP, RR | 1.3 | +30% |
| Norte | PA, RO | 1.25 | +25% |
| Norte | TO | 1.15 | +15% |

## 🛠️ Exemplos de Cálculo

### Exemplo 1: São Paulo (Sudeste)
- CEP: 01310-100
- Preço SEDEX: 50.00 × 0.7 = **R$ 35,00**
- Preço PAC: 25.00 × 0.7 = **R$ 17,50**
- Prazo SEDEX: 1 dia
- Prazo PAC: 4 dias

### Exemplo 2: Manaus (Norte)
- CEP: 69000-000
- Preço SEDEX: 50.00 × 1.3 = **R$ 65,00**
- Preço PAC: 25.00 × 1.3 = **R$ 32,50**
- Prazo SEDEX: 5 dias
- Prazo PAC: 10 dias

### Exemplo 3: Salvador (Nordeste)
- CEP: 40000-000
- Preço SEDEX: 50.00 × 1.0 = **R$ 50,00**
- Preço PAC: 25.00 × 1.0 = **R$ 25,00**
- Prazo SEDEX: 3 dias
- Prazo PAC: 7 dias

## 🔐 Segurança

- CEP é validado antes de processar
- Integração com API ViaCEP (público, seguro)
- Nenhum dado sensível é armazenado
- Preços são definidos no servidor (não podem ser alterados pelo cliente)

## 🚀 Próximas Melhorias Potenciais

- [ ] Integração real com API Correios
- [ ] Suporte a múltiplos pesos de pacote
- [ ] Rastreamento de envios
- [ ] Cálculo de frete grátis por valor de pedido
- [ ] Cálculo de frete por dimensões do pacote
- [ ] Promoções regionais
