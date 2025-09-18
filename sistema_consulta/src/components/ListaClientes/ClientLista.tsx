import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useClientes } from "../../hooks/useDatas";
import type { Cliente } from "../../types";
import ClientCard from "./ClientCard";
import ClientFiltro from "./ClientFiltro";
import Paginacao from "./Paginacao";
import ClienteDetalhes from "./ClientesDetalhes";

const ClientesList: React.FC = () => {
  // Declaração de estados para gerenciar os dados e interações
  const [todosClientes, setTodosClientes] = useState<Cliente[]>([]); // Todos os clientes carregados
  const [searchTerm, setSearchTerm] = useState(''); // Termo de pesquisa para filtrar clientes
  const [paginaAtual, setPaginaAtual] = useState(1); // Página atual para a paginação
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null); // Cliente selecionado para exibição de detalhes
  const [initialLoading, setInitialLoading] = useState(true); // Estado de carregamento inicial

  // Funções fornecidas pelo hook useClientes para carregar e filtrar dados
  const { carregarClientes, filtrarClientes, loading, error } = useClientes();

  // Carregar dados iniciais dos clientes assim que o componente é montado
  useEffect(() => {
    const carregarDadosIniciais = async () => {
      try {
        const clientes = await carregarClientes(); // Chama a função para carregar os clientes
        setTodosClientes(clientes); // Atualiza o estado com os clientes carregados
      } catch (error) {
        console.error('Erro ao carregar clientes:', error); // Em caso de erro, exibe no console
      } finally {
        setInitialLoading(false); // Define que o carregamento inicial foi concluído
      }
    };

    carregarDadosIniciais(); // Executa a função de carregamento ao montar o componente
  }, [carregarClientes]);

  // Filtragem e paginação dos clientes com base nos dados carregados
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
    
    // Filtra e pagina os clientes conforme o termo de busca e a página atual
    return filtrarClientes(todosClientes, searchTerm, paginaAtual, 10);
  }, [todosClientes, searchTerm, paginaAtual, filtrarClientes]);

  // Função para atualizar o termo de pesquisa e resetar a paginação para a primeira página
  const handleFiltroChange = useCallback((search: string) => {
    setSearchTerm(search);
    setPaginaAtual(1); // Reset para a primeira página após mudança no filtro
  }, []);

  // Função para mudar a página na paginação
  const handleMudarPagina = useCallback((pagina: number) => {
    setPaginaAtual(pagina); // Atualiza a página atual
  }, []);

  // Função para selecionar um cliente e exibir seus detalhes
  const handleSelectCliente = useCallback((cliente: Cliente) => {
    setClienteSelecionado(cliente); // Define o cliente selecionado
    setSearchTerm(''); // Limpa o campo de busca para evitar bugs ao voltar
    setPaginaAtual(1); // Reseta a paginação para a primeira página
  }, []);

  // Função para voltar à lista de clientes e desmarcar o cliente selecionado
  const handleVoltar = useCallback(() => {
    setClienteSelecionado(null); // Limpa o cliente selecionado
  }, []);

  // Se um cliente for selecionado, exibe a tela de detalhes desse cliente
  if (clienteSelecionado) {
    return (
      <ClienteDetalhes 
        cliente={clienteSelecionado} 
        onVoltar={handleVoltar} // Passa a função de voltar como prop
      />
    );
  }

  // Exibe um spinner enquanto os dados estão sendo carregados inicialmente
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

  // Exibe uma mensagem de erro caso o carregamento dos dados falhe
  if (error) {
    return (
      <div className="p-10 text-center bg-red-50 border-2 border-red-300 rounded-xl m-5">
        <h1 className="text-red-800 mb-5 text-2xl font-bold">
          Erro ao Carregar Sistema
        </h1>
        <p className="text-red-700 mb-5">
          {error} {/* Exibe a mensagem de erro */}
        </p>
        <button 
          onClick={() => window.location.reload()} // Botão para recarregar a página
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white border-none rounded-lg cursor-pointer text-base font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="p-5 bg-gray-50 min-h-screen">
      {/* Cabeçalho com título e informações sobre o total de clientes */}
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

      {/* Componente de filtro de clientes */}
      <ClientFiltro 
        onFiltroChange={handleFiltroChange} // Passa a função de filtro como prop
        loading={loading} // Passa o estado de loading para desabilitar o filtro enquanto carrega
      />

      {/* Exibe a paginação superior, se houver mais de uma página */}
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
          // Exibe um spinner enquanto os dados estão sendo carregados
          <div className="bg-white p-10 rounded-xl border-2 border-blue-100 text-center">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-blue-600">Buscando clientes...</span>
            </div>
          </div>
        ) : dadosPaginados.clientes.length === 0 ? (
          // Exibe uma mensagem se nenhum cliente for encontrado
          <div className="bg-white p-10 rounded-xl border-2 border-blue-100 text-center">
            <p className="text-gray-600 text-lg m-0">
              {searchTerm 
                ? `Nenhum cliente encontrado para "${searchTerm}"`
                : "Nenhum cliente encontrado"
              }
            </p>
            {searchTerm && (
              // Exibe o botão para limpar a busca
              <button
                onClick={() => handleFiltroChange('')}
                className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Limpar Busca
              </button>
            )}
          </div>
        ) : (
          // Exibe a lista de clientes se houver resultados
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 bg-white p-5 rounded-xl border-2 border-blue-100 shadow-md">
            {dadosPaginados.clientes.map((cliente) => (
              <ClientCard 
                key={cliente.id} 
                cliente={cliente} 
                onSelectCliente={handleSelectCliente} // Passa a função de seleção de cliente
              />
            ))}
          </div>
        )}
      </main>

      {/* Exibe a paginação inferior, se houver mais de uma página */}
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
