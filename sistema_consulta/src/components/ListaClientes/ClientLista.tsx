import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useClientes, useAgencias } from "../../hooks/useDatas";
import type { Cliente, Agencia } from "../../types";
import ClientCard from "./ClientCard";
import ClientFiltro from "./ClientFiltro";
import Paginacao from "./Paginacao";
import ClienteDetalhes from "./ClientesDetalhes";

const ClientesList: React.FC = () => {
  // Estados para gerenciar os dados e interações
  const [todosClientes, setTodosClientes] = useState<Cliente[]>([]);
  const [todasAgencias, setTodasAgencias] = useState<Agencia[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [agenciaFiltro, setAgenciaFiltro] = useState<number | null>(null);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  // Estados para salvar os filtros quando navegar para detalhes
  const [filtrosSalvos, setFiltrosSalvos] = useState<{
    searchTerm: string;
    agenciaFiltro: number | null;
    paginaAtual: number;
  }>({
    searchTerm: '',
    agenciaFiltro: null,
    paginaAtual: 1
  });

  // Hooks para carregar dados
  const { carregarClientes, filtrarClientes, loading: loadingClientes, error: errorClientes } = useClientes();
  const { buscarTodasAgencias, loading: loadingAgencias, error: errorAgencias } = useAgencias();

  // Carregar dados iniciais
  useEffect(() => {
    const carregarDadosIniciais = async () => {
      try {
        // Carrega clientes e agências simultaneamente
        const [clientes, agencias] = await Promise.all([
          carregarClientes(),
          buscarTodasAgencias()
        ]);
        
        setTodosClientes(clientes);
        setTodasAgencias(agencias.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR')));
      } catch (error) {
        console.error('Erro ao carregar dados iniciais:', error);
      } finally {
        setInitialLoading(false);
      }
    };

    carregarDadosIniciais();
  }, [carregarClientes, buscarTodasAgencias]);

  // Filtrar clientes por agência e termo de busca
  const clientesFiltrados = useMemo(() => {
    if (todosClientes.length === 0) return [];

    let resultado = todosClientes;

    // Primeiro filtrar por agência
    if (agenciaFiltro !== null) {
      resultado = resultado.filter(cliente => cliente.codigoAgencia === agenciaFiltro);
    }

    return resultado;
  }, [todosClientes, agenciaFiltro]);

  // Aplicar paginação nos clientes já filtrados por agência
  const dadosPaginados = useMemo(() => {
    if (clientesFiltrados.length === 0) {
      return {
        clientes: [],
        total: 0,
        totalPages: 0,
        paginaAtual: 1,
        itensPorPagina: 10
      };
    }
    
    // Aplicar filtro de busca e paginação nos clientes já filtrados por agência
    return filtrarClientes(clientesFiltrados, searchTerm, paginaAtual, 10);
  }, [clientesFiltrados, searchTerm, paginaAtual, filtrarClientes]);

  // Handler para mudanças nos filtros
  const handleFiltroChange = useCallback((search: string, agenciaCodigo: number | null) => {
    setSearchTerm(search);
    setAgenciaFiltro(agenciaCodigo);
    setPaginaAtual(1); // Reset para primeira página
  }, []);

  // Handler para mudança de página
  const handleMudarPagina = useCallback((pagina: number) => {
    setPaginaAtual(pagina);
  }, []);

  // Handler para seleção de cliente - salva os filtros atuais
  const handleSelectCliente = useCallback((cliente: Cliente) => {
    // Salvar os filtros atuais antes de navegar para detalhes
    setFiltrosSalvos({
      searchTerm,
      agenciaFiltro,
      paginaAtual
    });
    
    setClienteSelecionado(cliente);
  }, [searchTerm, agenciaFiltro, paginaAtual]);

  // Handler para voltar à lista - restaura os filtros salvos
  const handleVoltar = useCallback(() => {
    // Restaurar os filtros salvos
    setSearchTerm(filtrosSalvos.searchTerm);
    setAgenciaFiltro(filtrosSalvos.agenciaFiltro);
    setPaginaAtual(filtrosSalvos.paginaAtual);
    
    setClienteSelecionado(null);
  }, [filtrosSalvos]);

  // Se um cliente está selecionado, mostra detalhes
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

  // Erro no carregamento
  if (errorClientes || errorAgencias) {
    return (
      <div className="p-10 text-center bg-red-50 border-2 border-red-300 rounded-xl m-5">
        <h1 className="text-red-800 mb-5 text-2xl font-bold">
          Erro ao Carregar Sistema
        </h1>
        <p className="text-red-700 mb-5">
          {errorClientes || errorAgencias}
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

  // Calcular estatísticas para exibição
  const totalClientesSistema = todosClientes.length;
  const totalClientesAgencia = clientesFiltrados.length;
  const totalEncontrados = dadosPaginados.total;
  const nomeAgenciaSelecionada = agenciaFiltro 
    ? todasAgencias.find(a => a.codigo === agenciaFiltro)?.nome 
    : null;

  return (
    <div className="p-5 bg-gray-50 min-h-screen">
      {/* Cabeçalho */}
      <header className="bg-white p-6 rounded-xl border-2 border-blue-100 mb-5 shadow-md">
        <h1 className="text-blue-800 m-0 text-3xl text-center font-bold">
          Sistema de Gestão de Clientes
        </h1>
        <div className="text-gray-600 mt-2 text-base text-center">
          <p className="m-0">
            Total de {totalClientesSistema} clientes cadastrados
          </p>
          {agenciaFiltro && (
            <p className="m-0 text-sm">
              • {totalClientesAgencia} clientes na agência "{nomeAgenciaSelecionada}"
            </p>
          )}
          {totalEncontrados !== (agenciaFiltro ? totalClientesAgencia : totalClientesSistema) && (
            <p className="m-0 text-sm">
              • {totalEncontrados} encontrados na busca
            </p>
          )}
        </div>
      </header>

      {/* Filtros */}
      <ClientFiltro 
        onFiltroChange={handleFiltroChange}
        loading={loadingClientes}
        agencias={todasAgencias}
        loadingAgencias={loadingAgencias}
        searchValue={searchTerm}
        agenciaValue={agenciaFiltro}
      />

      {/* Paginação superior */}
      {dadosPaginados.totalPages > 1 && (
        <Paginacao
          paginaAtual={paginaAtual}
          totalPaginas={dadosPaginados.totalPages}
          onMudarPagina={handleMudarPagina}
          totalItens={dadosPaginados.total}
          itensPorPagina={10}
          loading={loadingClientes}
        />
      )}

      {/* Lista de clientes */}
      <main>
        {loadingClientes ? (
          <div className="bg-white p-10 rounded-xl border-2 border-blue-100 text-center">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-blue-600">Buscando clientes...</span>
            </div>
          </div>
        ) : dadosPaginados.clientes.length === 0 ? (
          <div className="bg-white p-10 rounded-xl border-2 border-blue-100 text-center">
            <p className="text-gray-600 text-lg m-0">
              {searchTerm || agenciaFiltro
                ? `Nenhum cliente encontrado${searchTerm ? ` para "${searchTerm}"` : ''}${agenciaFiltro ? ` na agência selecionada` : ''}`
                : "Nenhum cliente encontrado"
              }
            </p>
            {(searchTerm || agenciaFiltro) && (
              <button
                onClick={() => handleFiltroChange('', null)}
                className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Limpar Filtros
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
          loading={loadingClientes}
        />
      )}
    </div>
  );
};

export default ClientesList;