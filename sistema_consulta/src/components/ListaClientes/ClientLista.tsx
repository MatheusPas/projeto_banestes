import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useClientes } from "../../hooks/useDatas";
import type { Cliente } from "../../types";
import ClientCard from "./ClientCard";
import ClientFiltro from "./ClientFiltro";
import Paginacao from "./Paginacao";
import ClienteDetalhes from "./ClientesDetalhes";

const ClientesList: React.FC = () => {
  const [todosClientes, setTodosClientes] = useState<Cliente[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  const { carregarClientes, filtrarClientes, loading, error } = useClientes();

  // Carregar dados iniciais
  useEffect(() => {
    const carregarDadosIniciais = async () => {
      try {
        const clientes = await carregarClientes();
        setTodosClientes(clientes);
      } catch (error) {
        console.error('Erro ao carregar clientes:', error);
      } finally {
        setInitialLoading(false);
      }
    };

    carregarDadosIniciais();
  }, [carregarClientes]);

  // Filtrar e paginar clientes - agora com dependências corretas
  const dadosPaginados = useMemo(() => {
    if (todosClientes.length === 0) {
      return {
        clientes: [],
        total: 0,
        totalPages: 0,
        paginaAtual: 1,
        itensPorPagina: 10
      };
    }
    
    return filtrarClientes(todosClientes, searchTerm, paginaAtual, 10);
  }, [todosClientes, searchTerm, paginaAtual, filtrarClientes]);

  // Handlers
  const handleFiltroChange = useCallback((search: string) => {
    setSearchTerm(search);
    setPaginaAtual(1); // Reset para primeira página
  }, []);

  const handleMudarPagina = useCallback((pagina: number) => {
    setPaginaAtual(pagina);
  }, []);

  const handleSelectCliente = useCallback((cliente: Cliente) => {
    setClienteSelecionado(cliente);
    // Limpar campo de busca para evitar bugs ao voltar
    setSearchTerm('');
    setPaginaAtual(1);
  }, []);

  const handleVoltar = useCallback(() => {
    setClienteSelecionado(null);
  }, []);

  // Se um cliente está selecionado, mostrar detalhes
  if (clienteSelecionado) {
    return (
      <ClienteDetalhes 
        cliente={clienteSelecionado} 
        onVoltar={handleVoltar}
      />
    );
  }

  // Loading inicial
  if (initialLoading) {
    return (
      <div className="p-10 text-center bg-gray-50 min-h-screen flex flex-col justify-center items-center">
        <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin mb-5"></div>
        <p className="text-blue-500 text-lg font-bold">
          Carregando sistema...
        </p>
        <p className="text-gray-600 text-sm mt-2">
          Buscando dados 
        </p>
      </div>
    );
  }

  // Erro
  if (error) {
    return (
      <div className="p-10 text-center bg-red-50 border-2 border-red-300 rounded-xl m-5">
        <h1 className="text-red-800 mb-5 text-2xl font-bold">
          Erro ao Carregar Sistema
        </h1>
        <p className="text-red-700 mb-5">
          {error}
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white border-none rounded-lg cursor-pointer text-base font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="p-5 bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white p-6 rounded-xl border-2 border-blue-100 mb-5 shadow-md">
        <h1 className="text-blue-800 m-0 text-3xl text-center font-bold">
          Sistema de Gestão de Clientes
        </h1>
        <p className="text-gray-600 mt-2 m-0 text-base text-center">
          Total de {todosClientes.length} clientes cadastrados
          {dadosPaginados.total !== todosClientes.length && 
            ` • ${dadosPaginados.total} encontrados`
          }
        </p>
      </header>

      {/* Filtros */}
      <ClientFiltro 
        onFiltroChange={handleFiltroChange}
        loading={loading}
      />

      {/* Paginação superior */}
      {dadosPaginados.totalPages > 1 && (
        <Paginacao
          paginaAtual={paginaAtual}
          totalPaginas={dadosPaginados.totalPages}
          onMudarPagina={handleMudarPagina}
          totalItens={dadosPaginados.total}
          itensPorPagina={10}
          loading={loading}
        />
      )}

      {/* Lista de clientes */}
      <main>
        {loading ? (
          <div className="bg-white p-10 rounded-xl border-2 border-blue-100 text-center">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-blue-600">Buscando clientes...</span>
            </div>
          </div>
        ) : dadosPaginados.clientes.length === 0 ? (
          <div className="bg-white p-10 rounded-xl border-2 border-blue-100 text-center">
            <p className="text-gray-600 text-lg m-0">
              {searchTerm 
                ? `Nenhum cliente encontrado para "${searchTerm}"`
                : "Nenhum cliente encontrado"
              }
            </p>
            {searchTerm && (
              <button
                onClick={() => handleFiltroChange('')}
                className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Limpar Busca
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 bg-white p-5 rounded-xl border-2 border-blue-100 shadow-md">
            {dadosPaginados.clientes.map((cliente) => (
              <ClientCard 
                key={cliente.id} 
                cliente={cliente} 
                onSelectCliente={handleSelectCliente}
              />
            ))}
          </div>
        )}
      </main>

      {/* Paginação inferior */}
      {dadosPaginados.totalPages > 1 && (
        <Paginacao
          paginaAtual={paginaAtual}
          totalPaginas={dadosPaginados.totalPages}
          onMudarPagina={handleMudarPagina}
          totalItens={dadosPaginados.total}
          itensPorPagina={10}
          loading={loading}
        />
      )}
    </div>
  );
};

export default ClientesList;