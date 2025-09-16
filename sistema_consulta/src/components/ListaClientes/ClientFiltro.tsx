import React, { useState, useCallback } from "react";

interface ClientFiltroProps {
  onFiltroChange: (search: string) => void;
  loading?: boolean;
}

const ClientFiltro: React.FC<ClientFiltroProps> = ({ onFiltroChange, loading = false }) => {
  const [search, setSearch] = useState('');

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    onFiltroChange(value);
  }, [onFiltroChange]);

  const limparFiltros = () => {
    handleSearchChange('');
  };

  return (
    <section className="bg-gray-50 p-5 rounded-xl border-2 border-blue-100 mb-5">
      <h2 className="text-blue-800 m-0 mb-4 text-xl font-bold">
        Buscar Clientes
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
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

        <div>
          <button
            onClick={limparFiltros}
            disabled={loading || !search}
            className="w-full px-4 py-3.5 bg-green-500 hover:bg-green-600 text-white border-none rounded-md cursor-pointer text-sm font-bold transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-400"
            aria-label="Limpar filtros de busca"
          >
            Limpar Busca
          </button>
        </div>
      </div>
    </section>
  );
};

export default ClientFiltro;