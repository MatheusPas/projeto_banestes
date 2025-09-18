// Importa os tipos utilizados no serviço
import type { Cliente, Conta, Agencia } from '../types';

class GoogleSheetsService {
  // URL base da planilha pública do Google Sheets em formato CSV
  private baseUrl = "https://docs.google.com/spreadsheets/d/1PBN_HQOi5ZpKDd63mouxttFvvCwtmY97Tb5if5_cdBA/gviz/tq?tqx=out:csv";

  // Método para dividir uma linha CSV, respeitando aspas
  private parseCSVLine(linha: string): string[] {
    const resultado: string[] = [];
    let campo = '';
    let dentroAspas = false;
    
    // Itera por cada caractere da linha
    for (let i = 0; i < linha.length; i++) {
      const char = linha[i];
      
      // Verifica se está abrindo ou fechando aspas
      if (char === '"') {
        dentroAspas = !dentroAspas;
      } else if (char === ',' && !dentroAspas) {
        // Se for vírgula fora de aspas, é um separador de campo
        resultado.push(campo);
        campo = '';
      } else {
        // Adiciona caractere ao campo atual
        campo += char;
      }
    }

    // Adiciona o último campo
    resultado.push(campo);
    return resultado;
  }

  // Faz o parse de uma string de data em um objeto Date válido
  private parseDate(dateStr: string): Date {
    if (!dateStr || dateStr.trim() === '') {
      return new Date(); // Retorna data atual se estiver vazio
    }
    
    const cleanDate = dateStr.trim();

    // Padrões suportados: dd/mm/yyyy, yyyy-mm-dd, dd-mm-yyyy
    const patterns = [
      /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/,
      /^(\d{4})-(\d{1,2})-(\d{1,2})$/,
      /^(\d{1,2})-(\d{1,2})-(\d{4})$/,
    ];

    for (const pattern of patterns) {
      const match = cleanDate.match(pattern);
      if (match) {
        if (pattern.source.startsWith('^(\\\\d{4})')) {
          return new Date(parseInt(match[1]), parseInt(match[2]) - 1, parseInt(match[3]));
        } else {
          return new Date(parseInt(match[3]), parseInt(match[2]) - 1, parseInt(match[1]));
        }
      }
    }

    // Tenta converter a string diretamente
    const tentativa = new Date(cleanDate);
    if (!isNaN(tentativa.getTime())) {
      return tentativa;
    }

    // Fallback: data atual
    return new Date();
  }

  // Converte valores numéricos (ex: com vírgula, moeda etc.) para número
  private parseNumber(value: string): number {
    if (!value || value.trim() === '') return 0;

    // Remove tudo que não for número, vírgula, ponto ou sinal
    const cleanValue = value.toString().replace(/[^\d.,-]/g, '');
    const normalizedValue = cleanValue.replace(',', '.');
    const number = parseFloat(normalizedValue);

    return isNaN(number) ? 0 : number;
  }

  // Busca e converte os dados CSV de uma aba da planilha
  private async fetchCSVData(sheet: string): Promise<string[][]> {
    try {
      const response = await fetch(`${this.baseUrl}&sheet=${sheet}`);
      
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const texto = await response.text();

      // Quebra em linhas e remove vazias
      const linhas = texto.split(/\r?\n/).filter(linha => linha.trim() !== "");

      if (linhas.length < 2) {
        return [];
      }

      // Converte cada linha usando o parseCSVLine
      return linhas.map(linha => this.parseCSVLine(linha));
    } catch (error) {
      console.error(`Erro ao buscar dados da planilha ${sheet}:`, error);
      throw error;
    }
  }

  //
  // CLIENTES
  //

  // Busca todos os clientes da aba "clientes"
  async buscarTodosClientes(): Promise<Cliente[]> {
    try {
      const dados = await this.fetchCSVData('clientes');

      if (dados.length === 0) return [];

      // Normaliza os cabeçalhos (ex: remove espaços, aspas e lowercase)
      const headers = dados[0].map(h => h.trim().toLowerCase().replace(/['"]/g, ''));
      const clientes: Cliente[] = [];

      // Itera sobre as linhas, ignorando a primeira (cabeçalho)
      for (let i = 1; i < dados.length; i++) {
        const valores = dados[i];
        const clienteRaw: Record<string, string> = {};

        // Mapeia cada valor com seu respectivo cabeçalho
        headers.forEach((header, index) => {
          clienteRaw[header] = valores[index] ? valores[index].trim().replace(/['"]/g, '') : "";
        });

        // Ignora registros sem nome
        if (!clienteRaw.nome || clienteRaw.nome.trim() === '') continue;

        const cliente: Cliente = {
          id: clienteRaw.id || `cliente_${Date.now()}_${Math.random()}`,
          nome: clienteRaw.nome || '',
          cpfCnpj: clienteRaw.cpfcnpj || clienteRaw['cpf/cnpj'] || clienteRaw.cpf || '',
          rg: clienteRaw.rg || undefined,
          email: clienteRaw.email || '',
          endereco: clienteRaw.endereco || clienteRaw['endereço'] || '',
          dataNascimento: this.parseDate(clienteRaw.datanascimento || clienteRaw['data nascimento']),
          nomeSocial: clienteRaw.nomesocial || clienteRaw['nome social'] || undefined,
          rendaAnual: this.parseNumber(clienteRaw.rendaanual || clienteRaw['renda anual']),
          patrimonio: this.parseNumber(clienteRaw.patrimonio || clienteRaw['patrimônio']),
          estadoCivil: this.parseEstadoCivil(clienteRaw.estadocivil || clienteRaw['estado civil']),
          codigoAgencia: this.parseNumber(clienteRaw.codigoagencia || clienteRaw['código agência'] || clienteRaw.agencia)
        };

        clientes.push(cliente);
      }

      return clientes;
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      throw new Error('Falha ao carregar dados dos clientes');
    }
  }

  // Converte uma string em um dos valores possíveis de estado civil
  private parseEstadoCivil(value: string): "Solteiro" | "Casado" | "Viúvo" | "Divorciado" {
    if (!value) return 'Solteiro';

    const normalizado = value.toLowerCase().trim();

    if (normalizado.includes('casado')) return 'Casado';
    if (normalizado.includes('viuv') || normalizado.includes('viúv')) return 'Viúvo';
    if (normalizado.includes('divorciad')) return 'Divorciado';

    return 'Solteiro';
  }

  //
  // CONTAS
  //

  // Busca todas as contas da aba "contas"
  async buscarTodasContas(): Promise<Conta[]> {
    try {
      const dados = await this.fetchCSVData('contas');
      if (dados.length === 0) return [];

      const headers = dados[0].map(h => h.trim().toLowerCase().replace(/['"]/g, ''));
      const contas: Conta[] = [];

      for (let i = 1; i < dados.length; i++) {
        const valores = dados[i];
        const contaRaw: Record<string, string> = {};

        headers.forEach((header, index) => {
          contaRaw[header] = valores[index] ? valores[index].trim().replace(/['"]/g, '') : "";
        });

        const conta: Conta = {
          id: contaRaw.id || `conta_${Date.now()}_${Math.random()}`,
          cpfCnpjCliente: contaRaw.cpfcnpjcliente || contaRaw['cpf/cnpj cliente'] || '',
          tipo: this.parseTipoConta(contaRaw.tipo),
          saldo: this.parseNumber(contaRaw.saldo),
          limiteCredito: this.parseNumber(contaRaw.limitecredito || contaRaw['limite crédito']),
          creditoDisponivel: this.parseNumber(contaRaw.creditodisponivel || contaRaw['crédito disponível'])
        };

        contas.push(conta);
      }

      return contas;
    } catch (error) {
      console.error('Erro ao buscar contas:', error);
      throw new Error('Falha ao carregar dados das contas');
    }
  }

  // Converte o valor de tipo de conta para "corrente" ou "poupanca"
  private parseTipoConta(value: string): "corrente" | "poupanca" {
    if (!value) return 'corrente';

    const normalizado = value.toLowerCase().trim();

    if (normalizado.includes('poupan')) return 'poupanca';

    return 'corrente';
  }

  // Filtra as contas por cliente (baseado no CPF/CNPJ)
  async buscarContasPorCliente(cpfCnpj: string): Promise<Conta[]> {
    const todasContas = await this.buscarTodasContas();
    return todasContas.filter(conta => conta.cpfCnpjCliente === cpfCnpj);
  }

  //
  // AGÊNCIAS
  //

  // Busca todas as agências da aba "agencias"
  async buscarTodasAgencias(): Promise<Agencia[]> {
    try {
      const dados = await this.fetchCSVData('agencias');
      if (dados.length === 0) return [];

      const headers = dados[0].map(h => h.trim().toLowerCase().replace(/['"]/g, ''));
      const agencias: Agencia[] = [];

      for (let i = 1; i < dados.length; i++) {
        const valores = dados[i];
        const agenciaRaw: Record<string, string> = {};

        headers.forEach((header, index) => {
          agenciaRaw[header] = valores[index] ? valores[index].trim().replace(/['"]/g, '') : "";
        });

        const agencia: Agencia = {
          id: agenciaRaw.id || `agencia_${Date.now()}_${Math.random()}`,
          codigo: this.parseNumber(agenciaRaw.codigo || agenciaRaw['código']),
          nome: agenciaRaw.nome || '',
          endereco: agenciaRaw.endereco || agenciaRaw['endereço'] || ''
        };

        agencias.push(agencia);
      }

      return agencias;
    } catch (error) {
      console.error('Erro ao buscar agências:', error);
      throw new Error('Falha ao carregar dados das agências');
    }
  }

  // Busca uma agência específica pelo código
  async buscarAgenciaPorCodigo(codigo: number): Promise<Agencia | null> {
    const todasAgencias = await this.buscarTodasAgencias();
    return todasAgencias.find(agencia => agencia.codigo === codigo) || null;
  }
}

export default GoogleSheetsService;
