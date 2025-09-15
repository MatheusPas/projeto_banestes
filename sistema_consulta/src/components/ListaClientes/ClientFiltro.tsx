import React from "react";
import type { Cliente } from "../../types";

interface ClientFiltroProps {
  clientes: Cliente[];
  onFiltroChange: (clientesFiltrados: Cliente[]) => void;
}

const ClientFiltro: React.FC<ClientFiltroProps> = ({ clientes, onFiltroChange }) => {
  const [filtros, setFiltros] = React.useState({
    nome: '',
    estadoCivil: '',
    agencia: ''
  });

  React.useEffect(() => {
    let clientesFiltrados = [...clientes];

    // Filtro por nome
    if (filtros.nome) {
      clientesFiltrados = clientesFiltrados.filter(cliente =>
        cliente.nome.toLowerCase().includes(filtros.nome.toLowerCase()) ||
        cliente.email.toLowerCase().includes(filtros.nome.toLowerCase())
      );
    }

    // Filtro por estado civil
    if (filtros.estadoCivil) {
      clientesFiltrados = clientesFiltrados.filter(cliente =>
        cliente.estadoCivil === filtros.estadoCivil
      );
    }

    // Filtro por agência
    if (filtros.agencia) {
      clientesFiltrados = clientesFiltrados.filter(cliente =>
        cliente.codigoAgencia.toString().includes(filtros.agencia)
      );
    }

    onFiltroChange(clientesFiltrados);
  }, [filtros, clientes, onFiltroChange]);

  const limparFiltros = () => {
    setFiltros({ nome: '', estadoCivil: '', agencia: '' });
  };

  const estadosCivis = ['Solteiro', 'Casado', 'Viúvo', 'Divorciado'];
  const agenciasUnicas = [...new Set(clientes.map(c => c.codigoAgencia))].sort((a, b) => a - b);

  return (
    <div className="bg-gray-50 p-5 rounded-xl border-2 border-blue-100 mb-5">
      <h3 className="text-blue-800 m-0 mb-4 flex items-center gap-2">
        🔍 Filtros de Pesquisa
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        {/* Filtro por Nome/Email */}
        <div>
          <label className="block mb-1 font-bold text-blue-500 text-sm">
            Nome ou Email:
          </label>
          <input
            type="text"
            value={filtros.nome}
            onChange={(e) => setFiltros(prev => ({ ...prev, nome: e.target.value }))}
            placeholder="Digite o nome ou email..."
            className="w-full p-2 border-2 border-blue-100 rounded-md text-sm outline-none transition-colors focus:border-blue-500"
          />
        </div>

        {/* Filtro por Estado Civil */}
        <div>
          <label className="block mb-1 font-bold text-blue-500 text-sm">
            Estado Civil:
          </label>
          <select
            value={filtros.estadoCivil}
            onChange={(e) => setFiltros(prev => ({ ...prev, estadoCivil: e.target.value }))}
            className="w-full p-2 border-2 border-blue-100 rounded-md text-sm outline-none bg-white"
          >
            <option value="">Todos</option>
            {estadosCivis.map(estado => (
              <option key={estado} value={estado}>{estado}</option>
            ))}
          </select>
        </div>

        {/* Filtro por Agência */}
        <div>
          <label className="block mb-1 font-bold text-blue-500 text-sm">
            Agência:
          </label>
          <select
            value={filtros.agencia}
            onChange={(e) => setFiltros(prev => ({ ...prev, agencia: e.target.value }))}
            className="w-full p-2 border-2 border-blue-100 rounded-md text-sm outline-none bg-white"
          >
            <option value="">Todas</option>
            {agenciasUnicas.map(agencia => (
              <option key={agencia} value={agencia}>Agência {agencia}</option>
            ))}
          </select>
        </div>

        {/* Botão Limpar */}
        <div>
          <button
            onClick={limparFiltros}
            className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white border-none rounded-md cursor-pointer text-sm font-bold transition-colors"
          >
            🗑️ Limpar Filtros
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientFiltro;