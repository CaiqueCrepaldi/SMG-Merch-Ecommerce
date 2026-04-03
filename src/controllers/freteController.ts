// ==========================================
// Controlador de Frete - Cálculo via Correios
// ==========================================

// Interface para resposta do ViaCEP
interface ViaCEPResponse {
  cep?: string;
  logradouro?: string;
  bairro?: string;
  localidade: string;
  uf: string;
  ibge?: string;
  gia?: string;
  ddd?: string;
  siafi?: string;
  erro?: boolean;
}

export class FreteController {
  // Tabela de preços base (por kg ou até 5kg)
  private static precosBASE = {
    sedex: 50.00,
    pac: 25.00
  };

  // Preços por região (multiplicadores)
  private static multiplicadores: { [key: string]: number } = {
    // Região Sudeste/Sul - Mais barato
    'SP': 0.7,   // -30%
    'RJ': 0.7,
    'MG': 0.75,  // -25%
    'ES': 0.75,
    'PR': 0.7,   // -30%
    'SC': 0.7,
    'RS': 0.7,

    // Região Nordeste - Normal
    'BA': 1.0,
    'PE': 1.0,
    'CE': 1.0,
    'MA': 1.0,
    'PB': 1.0,
    'RN': 1.0,
    'AL': 1.0,
    'SE': 1.0,
    'PI': 1.0,

    // Região Centro-Oeste - Normal
    'GO': 1.0,
    'MT': 1.0,
    'MS': 1.0,
    'DF': 1.0,

    // Região Norte - Mais caro
    'AM': 1.3,   // +30%
    'PA': 1.25,  // +25%
    'RO': 1.25,
    'AC': 1.3,
    'AP': 1.3,
    'RR': 1.3,
    'TO': 1.15   // +15%
  };

  // Calcular tempo de entrega por região
  private static diasEntrega: { [key: string]: { sedex: number; pac: number } } = {
    // Sudeste/Sul - Mais rápido
    'SP': { sedex: 1, pac: 4 },
    'RJ': { sedex: 1, pac: 4 },
    'MG': { sedex: 2, pac: 5 },
    'ES': { sedex: 2, pac: 5 },
    'PR': { sedex: 2, pac: 5 },
    'SC': { sedex: 2, pac: 5 },
    'RS': { sedex: 2, pac: 5 },

    // Nordeste
    'BA': { sedex: 3, pac: 7 },
    'PE': { sedex: 3, pac: 7 },
    'CE': { sedex: 3, pac: 7 },
    'MA': { sedex: 4, pac: 8 },
    'PB': { sedex: 3, pac: 7 },
    'RN': { sedex: 3, pac: 7 },
    'AL': { sedex: 3, pac: 7 },
    'SE': { sedex: 3, pac: 7 },
    'PI': { sedex: 4, pac: 8 },

    // Centro-Oeste
    'GO': { sedex: 3, pac: 7 },
    'MT': { sedex: 4, pac: 8 },
    'MS': { sedex: 3, pac: 7 },
    'DF': { sedex: 2, pac: 5 },

    // Norte - Mais lento
    'AM': { sedex: 5, pac: 10 },
    'PA': { sedex: 5, pac: 10 },
    'RO': { sedex: 5, pac: 10 },
    'AC': { sedex: 6, pac: 12 },
    'AP': { sedex: 6, pac: 12 },
    'RR': { sedex: 6, pac: 12 },
    'TO': { sedex: 4, pac: 9 }
  };

  // Calcular frete baseado em CEP e peso
  static async calcularFrete(cep: string, peso: number = 5): Promise<any> {
    try {
      // Remover formatação do CEP
      const cepLimpo = cep.replace(/\D/g, '');

      if (cepLimpo.length !== 8) {
        throw new Error('CEP inválido');
      }

      // Obter estado via API ViaCEP
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const dados = await response.json() as ViaCEPResponse;

      if (dados.erro) {
        throw new Error('CEP não encontrado');
      }

      const estado = dados.uf.toUpperCase();

      // Obter multiplicador da região
      const multiplicador = this.multiplicadores[estado] || 1.0;

      // Calcular preços
      const precoSedex = this.precosBASE.sedex * multiplicador;
      const precoPac = this.precosBASE.pac * multiplicador;

      // Obter dias de entrega
      const dias = this.diasEntrega[estado] || { sedex: 5, pac: 10 };

      return {
        sucesso: true,
        regiao: {
          estado,
          cidade: dados.localidade,
          regiao: this.obterNomeRegiao(estado)
        },
        opcoes: [
          {
            tipo: 'SEDEX',
            preco: parseFloat(precoSedex.toFixed(2)),
            diasEntrega: dias.sedex,
            descricao: `SEDEX - Entrega em até ${dias.sedex} dia(s)`
          },
          {
            tipo: 'PAC',
            preco: parseFloat(precoPac.toFixed(2)),
            diasEntrega: dias.pac,
            descricao: `PAC - Entrega em até ${dias.pac} dias`
          }
        ]
      };
    } catch (error: any) {
      return {
        sucesso: false,
        erro: error.message
      };
    }
  }

  // Obter nome da região
  private static obterNomeRegiao(estado: string): string {
    const regioesNorte = ['AM', 'PA', 'RO', 'AC', 'AP', 'RR', 'TO'];
    const regioesNordeste = ['BA', 'PE', 'CE', 'MA', 'PB', 'RN', 'AL', 'SE', 'PI'];
    const regioesCentroOeste = ['GO', 'MT', 'MS', 'DF'];
    const regioesSesuSul = ['SP', 'RJ', 'MG', 'ES', 'PR', 'SC', 'RS'];

    if (regioesNorte.includes(estado)) return 'Norte';
    if (regioesNordeste.includes(estado)) return 'Nordeste';
    if (regioesCentroOeste.includes(estado)) return 'Centro-Oeste';
    if (regioesSesuSul.includes(estado)) return 'Sudeste/Sul';
    return 'Desconhecida';
  }
}

export default FreteController;
