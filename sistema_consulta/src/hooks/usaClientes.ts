import BuscarDados from "./buscarAPI";
import type { Cliente } from "../types";

class BuscarClientes {
  private api: BuscarDados;

  constructor() {
    this.api = new BuscarDados();
  }

  async obterClientes(): Promise<Cliente[]> {
    try {
      console.log("🔍 Buscando clientes...");
      const clientes = await this.api.buscarClientes("clientes");
      console.log(`✅ ${clientes.length} clientes carregados`);
      return clientes;
    } catch (error: any) {
      console.error("❌ Falha ao obter clientes:", error);
      return [];
    }
  }
}

export default BuscarClientes;