import type { Cliente } from "../types";

class BuscarDados {
  private baseUrl: string;

  constructor() {
    this.baseUrl =
      "https://docs.google.com/spreadsheets/d/1PBN_HQOi5ZpKDd63mouxttFvvCwtmY97Tb5if5_cdBA/gviz/tq?tqx=out:csv";
  }

  async buscarClientes(sheet: string): Promise<Cliente[]> {
    try {
      console.log("🚀 Iniciando busca na planilha...");
      
      const resposta = await fetch(`${this.baseUrl}&sheet=${sheet}`);
      
      if (!resposta.ok) {
        throw new Error(`Erro HTTP: ${resposta.status} - ${resposta.statusText}`);
      }

      const texto = await resposta.text();
      console.log("📄 Dados brutos recebidos:", texto.substring(0, 200) + "...");

      if (!texto || texto.trim() === '') {
        console.warn("⚠️ Resposta vazia da planilha");
        return [];
      }

      const linhas = texto.split(/\r?\n/).filter((linha) => linha.trim() !== "");
      console.log("📝 Total de linhas:", linhas.length);

      if (linhas.length < 2) {
        console.warn("⚠️ Planilha sem dados suficientes");
        return [];
      }

      const headers = this.parseCSVLine(linhas[0])
        .map((h) => h.trim().toLowerCase().replace(/['"]/g, ''));

      console.log("🏷️ Headers encontrados:", headers);

      const clientes: Cliente[] = [];

      for (let i = 1; i < linhas.length; i++) {
        try {
          const valores = this.parseCSVLine(linhas[i]);
          const clienteRaw: Record<string, string> = {};
          
          headers.forEach((header, index) => {
            clienteRaw[header] = valores[index] ? valores[index].trim().replace(/['"]/g, '') : "";
          });

          const cliente = this.converterCliente(clienteRaw);
          if (cliente) {
            clientes.push(cliente);
          }
        } catch (error) {
          console.warn(`⚠️ Erro ao processar linha ${i + 1}:`, error);
          // Continue processando outras linhas
        }
      }

      console.log("✅ Clientes processados:", clientes.length);
      return clientes;

    } catch (error: any) {
      console.error("❌ Erro ao buscar dados:", error);
      throw new Error(`Falha ao carregar dados: ${error.message}`);
    }
  }

  private parseCSVLine(linha: string): string[] {
    const resultado: string[] = [];
    let campo = '';
    let dentroAspas = false;
    
    for (let i = 0; i < linha.length; i++) {
      const char = linha[i];
      
      if (char === '"') {
        dentroAspas = !dentroAspas;
      } else if (char === ',' && !dentroAspas) {
        resultado.push(campo);
        campo = '';
      } else {
        campo += char;
      }
    }
    resultado.push(campo);
    return resultado;
  }

  private converterCliente(dados: Record<string, string>): Cliente | null {
    try {
      // Validação básica - pelo menos nome deve existir
      if (!dados.nome || dados.nome.trim() === '') {
        console.warn("⚠️ Cliente sem nome, pulando...");
        return null;
      }

      const cliente: Cliente = {
        id: dados.id || `cliente_${Date.now()}_${Math.random()}`,
        nome: dados.nome || '',
        cpfCnpj: dados.cpfcnpj || dados['cpf/cnpj'] || dados.cpf || dados.cnpj || '',
        rg: dados.rg || undefined,
        email: dados.email || '',
        endereco: dados.endereco || dados['endereço'] || '',
        dataNascimento: this.parseDate(dados.datanascimento || dados['data nascimento'] || dados['data_nascimento']),
        nomeSocial: dados.nomesocial || dados['nome social'] || dados['nome_social'] || undefined,
        rendaAnual: this.parseNumber(dados.rendaanual || dados['renda anual'] || dados['renda_anual']),
        patrimonio: this.parseNumber(dados.patrimonio || dados['patrimônio']),
        estadoCivil: this.parseEstadoCivil(dados.estadocivil || dados['estado civil'] || dados['estado_civil']),
        codigoAgencia: this.parseNumber(dados.codigoagencia || dados['código agência'] || dados.agencia || dados['codigo_agencia'])
      };

      return cliente;
    } catch (error) {
      console.error("❌ Erro ao converter cliente:", error, dados);
      return null;
    }
  }

  private parseDate(dateStr: string): Date {
    if (!dateStr || dateStr.trim() === '') {
      return new Date();
    }
    
    // Remove espaços e caracteres especiais
    const cleanDate = dateStr.trim();
    
    // Tenta diferentes formatos
    const patterns = [
      /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/,  // dd/mm/yyyy
      /^(\d{4})-(\d{1,2})-(\d{1,2})$/,   // yyyy-mm-dd
      /^(\d{1,2})-(\d{1,2})-(\d{4})$/,   // dd-mm-yyyy
    ];

    for (const pattern of patterns) {
      const match = cleanDate.match(pattern);
      if (match) {
        if (pattern.source.startsWith('^(\\\\d{4})')) {
          // yyyy-mm-dd
          return new Date(parseInt(match[1]), parseInt(match[2]) - 1, parseInt(match[3]));
        } else {
          // dd/mm/yyyy ou dd-mm-yyyy
          return new Date(parseInt(match[3]), parseInt(match[2]) - 1, parseInt(match[1]));
        }
      }
    }

    // Tenta parse direto
    const tentativa = new Date(cleanDate);
    if (!isNaN(tentativa.getTime())) {
      return tentativa;
    }

    // Se falhar, retorna data atual
    console.warn(`⚠️ Data inválida: "${dateStr}", usando data atual`);
    return new Date();
  }

  private parseNumber(value: string): number {
    if (!value || value.trim() === '') return 0;
    
    // Remove tudo exceto números, pontos e vírgulas
    const cleanValue = value.toString().replace(/[^\d.,-]/g, '');
    
    // Substitui vírgula por ponto
    const normalizedValue = cleanValue.replace(',', '.');
    
    const number = parseFloat(normalizedValue);
    return isNaN(number) ? 0 : number;
  }

  private parseEstadoCivil(value: string): 'Solteiro' | 'Casado' | 'Viúvo' | 'Divorciado' {
    if (!value) return 'Solteiro';
    
    const normalizado = value.toLowerCase().trim();
    
    if (normalizado.includes('casado')) return 'Casado';
    if (normalizado.includes('viuv') || normalizado.includes('viúv')) return 'Viúvo';
    if (normalizado.includes('divorciad')) return 'Divorciado';
    
    return 'Solteiro';
  }
}

export default BuscarDados;