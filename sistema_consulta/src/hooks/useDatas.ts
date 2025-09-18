import { useState, useCallback, useMemo } from 'react';
import GoogleSheetsService from '../services/api';
import type { Cliente, Conta, Agencia } from '../types';

// Hook para Clientes
export const useClientes = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const googleSheetsService = useMemo(() => new GoogleSheetsService(), []);

  const carregarClientes = useCallback(async (): Promise<Cliente[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const clientes = await googleSheetsService.buscarTodosClientes();
      return clientes;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao carregar clientes';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [googleSheetsService]);

  const filtrarClientes = useCallback((
    clientes: Cliente[], 
    searchTerm: string, 
    pagina: number = 1, 
    itensPorPagina: number = 10
  ) => {
    // Se não há termo de busca, retorna todos os clientes
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

    const termoBusca = searchTerm.toLowerCase().trim();
    
    // Filtrar clientes baseado no termo de busca
    const clientesFiltrados = clientes.filter(cliente => {
      // Buscar por nome
      if (cliente.nome && cliente.nome.toLowerCase().includes(termoBusca)) {
        return true;
      }
      
      // Buscar por nome social
      if (cliente.nomeSocial && cliente.nomeSocial.toLowerCase().includes(termoBusca)) {
        return true;
      }
      
      // Buscar por CPF/CNPJ (com e sem formatação)
      if (cliente.cpfCnpj) {
        // Busca com formatação
        if (cliente.cpfCnpj.toLowerCase().includes(termoBusca)) {
          return true;
        }
        // Busca apenas números
        const cpfCnpjLimpo = cliente.cpfCnpj.replace(/[^\d]/g, '');
        const termoBuscaLimpo = termoBusca.replace(/[^\d]/g, '');
        if (termoBuscaLimpo && cpfCnpjLimpo.includes(termoBuscaLimpo)) {
          return true;
        }
      }
      
      return false;
    });

    // Calcular paginação
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

  return {
    carregarClientes,
    filtrarClientes,
    loading,
    error
  };
};

// Hook para Contas
export const useContas = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const googleSheetsService = useMemo(() => new GoogleSheetsService(), []);

  const buscarTodasContas = useCallback(async (): Promise<Conta[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const contas = await googleSheetsService.buscarTodasContas();
      return contas;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao carregar contas';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [googleSheetsService]);

  const buscarContasPorCliente = useCallback(async (cpfCnpj: string): Promise<Conta[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const contas = await googleSheetsService.buscarContasPorCliente(cpfCnpj);
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

// Hook para Agências
export const useAgencias = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const googleSheetsService = useMemo(() => new GoogleSheetsService(), []);

  const buscarTodasAgencias = useCallback(async (): Promise<Agencia[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const agencias = await googleSheetsService.buscarTodasAgencias();
      return agencias;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao carregar agências';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [googleSheetsService]);

  const buscarAgenciaPorCodigo = useCallback(async (codigo: number): Promise<Agencia | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const agencia = await googleSheetsService.buscarAgenciaPorCodigo(codigo);
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