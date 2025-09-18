// Importa hooks do React
import { useState, useCallback, useMemo } from 'react';
// Importa o serviço para comunicação com o Google Sheets
import GoogleSheetsService from '../services/api';
// Importa os tipos para clientes, contas e agências
import type { Cliente, Conta, Agencia } from '../types';

//
// HOOK: useClientes
//
export const useClientes = () => {
  const [loading, setLoading] = useState(false); // Estado de carregamento
  const [error, setError] = useState<string | null>(null); // Estado de erro

  // Cria uma instância única do serviço usando useMemo
  const googleSheetsService = useMemo(() => new GoogleSheetsService(), []);

  // Função para carregar todos os clientes
  const carregarClientes = useCallback(async (): Promise<Cliente[]> => {
    setLoading(true);
    setError(null);

    try {
      const clientes = await googleSheetsService.buscarTodosClientes(); // Chama a API
      return clientes;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao carregar clientes';
      setError(errorMessage); // Define o erro no estado
      throw err; // Propaga o erro
    } finally {
      setLoading(false); // Finaliza o carregamento
    }
  }, [googleSheetsService]);

  // Função para filtrar e paginar clientes
  const filtrarClientes = useCallback((
    clientes: Cliente[], 
    searchTerm: string, 
    pagina: number = 1, 
    itensPorPagina: number = 10
  ) => {
    // Se o termo de busca estiver vazio, apenas paginar
    if (!searchTerm || searchTerm.trim() === '') {
      const totalItens = clientes.length;
      const totalPages = Math.ceil(totalItens / itensPorPagina);
      const inicio = (pagina - 1) * itensPorPagina;
      const fim = inicio + itensPorPagina;
      const clientesPaginados = clientes.slice(inicio, fim);

      return {
        clientes: clientesPaginados,
        total: totalItens,
        totalPages: totalPages,
        paginaAtual: pagina,
        itensPorPagina
      };
    }

    // Normaliza o termo de busca (remove espaços e transforma em minúsculas)
    const termoBusca = searchTerm.toLowerCase().trim();

    // Aplica o filtro nos clientes
    const clientesFiltrados = clientes.filter(cliente => {
      // Busca pelo nome
      if (cliente.nome && cliente.nome.toLowerCase().includes(termoBusca)) {
        return true;
      }

      // Busca pelo nome social
      if (cliente.nomeSocial && cliente.nomeSocial.toLowerCase().includes(termoBusca)) {
        return true;
      }

      // Busca por CPF/CNPJ com e sem formatação
      if (cliente.cpfCnpj) {
        if (cliente.cpfCnpj.toLowerCase().includes(termoBusca)) {
          return true;
        }
        const cpfCnpjLimpo = cliente.cpfCnpj.replace(/[^\d]/g, '');
        const termoBuscaLimpo = termoBusca.replace(/[^\d]/g, '');
        if (termoBuscaLimpo && cpfCnpjLimpo.includes(termoBuscaLimpo)) {
          return true;
        }
      }

      return false; // Caso não atenda a nenhum critério
    });

    // Aplica a paginação nos clientes filtrados
    const totalItens = clientesFiltrados.length;
    const totalPages = Math.ceil(totalItens / itensPorPagina);
    const inicio = (pagina - 1) * itensPorPagina;
    const fim = inicio + itensPorPagina;
    const clientesPaginados = clientesFiltrados.slice(inicio, fim);

    return {
      clientes: clientesPaginados,
      total: totalItens,
      totalPages: totalPages,
      paginaAtual: pagina,
      itensPorPagina
    };
  }, []);

  // Retorna as funções e estados para uso no componente
  return {
    carregarClientes,
    filtrarClientes,
    loading,
    error
  };
};

//
// HOOK: useContas
//
export const useContas = () => {
  const [loading, setLoading] = useState(false); // Estado de carregamento
  const [error, setError] = useState<string | null>(null); // Estado de erro

  // Instancia o serviço de forma memoizada
  const googleSheetsService = useMemo(() => new GoogleSheetsService(), []);

  // Busca todas as contas da API
  const buscarTodasContas = useCallback(async (): Promise<Conta[]> => {
    setLoading(true);
    setError(null);

    try {
      const contas = await googleSheetsService.buscarTodasContas(); // API
      return contas;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao carregar contas';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [googleSheetsService]);

  // Busca contas de um cliente específico, baseado no CPF/CNPJ
  const buscarContasPorCliente = useCallback(async (cpfCnpj: string): Promise<Conta[]> => {
    setLoading(true);
    setError(null);

    try {
      const contas = await googleSheetsService.buscarContasPorCliente(cpfCnpj); // API
      return contas;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao carregar contas do cliente';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [googleSheetsService]);

  return {
    buscarTodasContas,
    buscarContasPorCliente,
    loading,
    error
  };
};

//
// HOOK: useAgencias
//
export const useAgencias = () => {
  const [loading, setLoading] = useState(false); // Estado de carregamento
  const [error, setError] = useState<string | null>(null); // Estado de erro

  // Instancia o serviço de forma memoizada
  const googleSheetsService = useMemo(() => new GoogleSheetsService(), []);

  // Busca todas as agências disponíveis
  const buscarTodasAgencias = useCallback(async (): Promise<Agencia[]> => {
    setLoading(true);
    setError(null);

    try {
      const agencias = await googleSheetsService.buscarTodasAgencias(); // API
      return agencias;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao carregar agências';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [googleSheetsService]);

  // Busca uma agência específica pelo código
  const buscarAgenciaPorCodigo = useCallback(async (codigo: number): Promise<Agencia | null> => {
    setLoading(true);
    setError(null);

    try {
      const agencia = await googleSheetsService.buscarAgenciaPorCodigo(codigo); // API
      return agencia;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao carregar agência';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [googleSheetsService]);

  return {
    buscarTodasAgencias,
    buscarAgenciaPorCodigo,
    loading,
    error
  };
};
