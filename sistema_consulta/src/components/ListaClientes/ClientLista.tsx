import React, { useEffect, useState } from "react";
import BuscarClientes from "../../hooks/usaClientes";
import type { Cliente } from "../../types";
import ClientCard from "./ClientCard";
import ClientFiltro from "./ClientFiltro";
import Paginacao from "./Paginacao";

interface ClientesListProps {}

const ClientesList: React.FC<ClientesListProps> = () => {
  const [todosClientes, setTodosClientes] = useState<Cliente[]>([]);
  const [clientesFiltrados, setClientesFiltrados] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [paginaAtual, setPaginaAtual] = useState<number>(1);
  
  const ITENS_POR_PAGINA = 10;
  const CARDS_POR_LINHA = 5;

  useEffect(() => {
    let isMounted = true;

    const carregarClientes = async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);
        
        const api = new BuscarClientes();
        const dados = await api.obterClientes();
        
        if (isMounted) {
          setTodosClientes(dados);
          setClientesFiltrados(dados);
          console.log(`📊 ${dados.length} clientes carregados no componente`);
        }
      } catch (err: any) {
        if (isMounted) {
          console.error("❌ Erro no componente:", err);
          setError(err.message || "Erro desconhecido ao carregar clientes");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    carregarClientes();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleFiltroChange = React.useCallback((clientes: Cliente[]) => {
    console.log(`🔍 Filtros aplicados: ${clientes.length} clientes encontrados`);
    setClientesFiltrados(clientes);
    setPaginaAtual(1); // Reset para primeira página quando filtrar
  }, []);

  const handleMudarPagina = React.useCallback((novaPagina: number) => {
    console.log(`📄 Mudando para página ${novaPagina}`);
    setPaginaAtual(novaPagina);
    // Scroll para o topo quando mudar de página
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Calcular dados da paginação
  const totalPaginas = Math.ceil(clientesFiltrados.length / ITENS_POR_PAGINA);
  const inicioIndex = (paginaAtual - 1) * ITENS_POR_PAGINA;
  const fimIndex = inicioIndex + ITENS_POR_PAGINA;
  const clientesPaginaAtual = clientesFiltrados.slice(inicioIndex, fimIndex);

  // Debug logs
  React.useEffect(() => {
    console.log(`📊 Estado da paginação:`, {
      paginaAtual,
      totalPaginas,
      clientesFiltrados: clientesFiltrados.length,
      clientesPaginaAtual: clientesPaginaAtual.length,
      inicioIndex,
      fimIndex
    });
  }, [paginaAtual, totalPaginas, clientesFiltrados.length, clientesPaginaAtual.length, inicioIndex, fimIndex]);

  const recarregar = (): void => {
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="p-10 text-center bg-gray-50 min-h-screen flex flex-col justify-center items-center">
        <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin mb-5"></div>
        <p className="text-blue-500 text-lg font-bold">
          🔄 Carregando clientes...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-center bg-red-50 border-2 border-red-300 rounded-xl m-5">
        <p className="text-red-800 mb-5 text-lg font-bold">
          ❌ {error}
        </p>
        <button 
          onClick={recarregar}
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white border-none rounded-lg cursor-pointer text-base font-bold transition-colors"
        >
          🔄 Tentar Novamente
        </button>
      </div>
    );
  }

  if (todosClientes.length === 0) {
    return (
      <div className="p-10 text-center bg-purple-50 border-2 border-purple-300 rounded-xl m-5">
        <p className="text-purple-800 text-lg font-bold">
          📭 Nenhum cliente encontrado.
        </p>
        <p className="text-purple-800">
          Verifique se a planilha contém dados válidos.
        </p>
        <button 
          onClick={recarregar}
          className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white border-none rounded-lg cursor-pointer text-base font-bold mt-3 transition-colors"
        >
          🔄 Recarregar
        </button>
      </div>
    );
  }

  return (
    <div className="p-5 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border-2 border-blue-100 mb-5 shadow-md">
        <h1 className="text-blue-800 m-0 text-3xl font-bold flex items-center gap-3">
          📋 Sistema de Clientes
        </h1>
        <p className="text-gray-600 mt-2 m-0 text-base">
          Total de {todosClientes.length} clientes cadastrados
          {clientesFiltrados.length !== todosClientes.length && 
            ` • ${clientesFiltrados.length} encontrados`
          }
        </p>
      </div>

      {/* Filtros */}
      <ClientFiltro 
        clientes={todosClientes}
        onFiltroChange={handleFiltroChange}
      />

      {/* Paginação no topo */}
      {totalPaginas > 1 && (
        <Paginacao
          paginaAtual={paginaAtual}
          totalPaginas={totalPaginas}
          onMudarPagina={handleMudarPagina}
          totalItens={clientesFiltrados.length}
          itensPorPagina={ITENS_POR_PAGINA}
        />
      )}

      {/* Grid de Cards */}
      {clientesFiltrados.length === 0 ? (
        <div className="bg-white p-10 rounded-xl border-2 border-blue-100 text-center">
          <p className="text-gray-600 text-lg m-0">
            🔍 Nenhum cliente encontrado com os filtros aplicados
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 bg-white p-5 rounded-xl border-2 border-blue-100 shadow-md">
          {clientesPaginaAtual.map((cliente, index) => (
            <ClientCard key={cliente.id || `cliente-${index}`} cliente={cliente} />
          ))}
        </div>
      )}

      {/* Paginação no final */}
      {totalPaginas > 1 && (
        <Paginacao
          paginaAtual={paginaAtual}
          totalPaginas={totalPaginas}
          onMudarPagina={handleMudarPagina}
          totalItens={clientesFiltrados.length}
          itensPorPagina={ITENS_POR_PAGINA}
        />
      )}
    </div>
  );
};

export default ClientesList;