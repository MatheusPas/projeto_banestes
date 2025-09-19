import React, { useState, useCallback, useEffect } from "react";
import type { Agencia } from "../../types";

interface ClientFiltroProps {
  onFiltroChange: (search: string, agenciaCodigo: number | null) => void;
  loading?: boolean;
  agencias: Agencia[];
  loadingAgencias?: boolean;
  searchValue?: string;
  agenciaValue?: number | null;
}

const ClientFiltro: React.FC<ClientFiltroProps> = ({ 
  onFiltroChange, 
  loading = false, 
  agencias, 
  loadingAgencias = false,
  searchValue = '',
  agenciaValue = null
}) => {
  const [search, setSearch] = useState(searchValue);
  const [agenciaSelecionada, setAgenciaSelecionada] = useState<number | null>(agenciaValue);

  // Atualiza os estados internos quando os props mudam
  useEffect(() => {
    setSearch(searchValue);
  }, [searchValue]);

  useEffect(() => {
    setAgenciaSelecionada(agenciaValue);
  }, [agenciaValue]);

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    onFiltroChange(value, agenciaSelecionada);
  }, [onFiltroChange, agenciaSelecionada]);

  const handleAgenciaChange = useCallback((agenciaCodigo: number | null) => {
    setAgenciaSelecionada(agenciaCodigo);
    onFiltroChange(search, agenciaCodigo);
  }, [onFiltroChange, search]);

  const limparFiltros = () => {
    setSearch('');
    setAgenciaSelecionada(null);
    onFiltroChange('', null);
  };

  return (
    <section className="bg-gray-50 p-5 rounded-xl border-2 border-blue-100 mb-5">
      <h2 className="text-blue-800 m-0 mb-4 text-xl font-bold">
        Buscar Clientes
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        {/* Campo de busca por nome/CPF */}
        <div>
          <label 
            htmlFor="search-input"
            className="block mb-2 font-bold text-blue-500 text-sm"
          >
            Nome ou CPF/CNPJ:
          </label>
          <input
            id="search-input"
            type="text"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Digite o nome ou CPF/CNPJ do cliente..."
            disabled={loading}
            className="w-full p-3 border-2 border-blue-100 rounded-md text-sm outline-none transition-colors focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            aria-describedby="search-description"
          />
        </div>

        {/* Dropdown de agências */}
        <div>
          <label 
            htmlFor="agencia-select"
            className="block mb-2 font-bold text-blue-500 text-sm"
          >
            Filtrar por Agência:
          </label>
          <select
            id="agencia-select"
            value={agenciaSelecionada || ''}
            onChange={(e) => handleAgenciaChange(e.target.value ? Number(e.target.value) : null)}
            disabled={loading || loadingAgencias}
            className="w-full p-3 border-2 border-blue-100 rounded-md text-sm outline-none transition-colors focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            aria-describedby="agencia-description"
          >
            <option value="">Todas as agências</option>
            {agencias.map((agencia) => (
              <option key={agencia.codigo} value={agencia.codigo}>
                {agencia.codigo} - {agencia.nome}
              </option>
            ))}
          </select>
          {loadingAgencias && (
            <p className="text-xs text-gray-500 mt-1">Carregando agências...</p>
          )}
        </div>

        {/* Botão para limpar filtros */}
        <div>
          <button
            onClick={limparFiltros}
            disabled={loading || (!search && !agenciaSelecionada)}
            className="w-full px-4 py-3.5 bg-green-500 hover:bg-green-600 text-white border-none rounded-md cursor-pointer text-sm font-bold transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-400"
            aria-label="Limpar filtros de busca"
          >
            Limpar Filtros
          </button>
        </div>
      </div>
    </section>
  );
};

export default ClientFiltro;