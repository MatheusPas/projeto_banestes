import { useState, useCallback } from 'react';
import GoogleSheetsService from '../services/api';
import type { Cliente, Conta, Agencia } from '../types';

const service = new GoogleSheetsService();

export const useClientes = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const carregarClientes = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const dados = await service.buscarTodosClientes();
      setClientes(dados);
      return dados;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Filtrar clientes com paginação local
  const filtrarClientes = useCallback((
    todosClientes: Cliente[], 
    search: string, 
    page: number = 1, 
    limit: number = 10
  ) => {
    let clientesFiltrados = todosClientes;

    // Aplicar filtro de busca
    if (search.trim()) {
      const searchLower = search.toLowerCase().trim();
      clientesFiltrados = todosClientes.filter(cliente =>
        cliente.nome.toLowerCase().includes(searchLower) ||
        cliente.email.toLowerCase().includes(searchLower) ||
        cliente.cpfCnpj.includes(search.replace(/\D/g, '')) // Remove formatação do CPF
      );
    }

    // Aplicar paginação
    const total = clientesFiltrados.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const clientesPaginados = clientesFiltrados.slice(startIndex, endIndex);

    return {
      clientes: clientesPaginados,
      total,
      totalPages,
      currentPage: page
    };
  }, []);

  return { 
    clientes, 
    carregarClientes, 
    filtrarClientes,
    loading, 
    error 
  };
};

export const useContas = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buscarContasPorCliente = useCallback(async (cpfCnpj: string): Promise<Conta[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const contas = await service.buscarContasPorCliente(cpfCnpj);
      return contas;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { buscarContasPorCliente, loading, error };
};

export const useAgencias = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buscarAgenciaPorCodigo = useCallback(async (codigo: number): Promise<Agencia | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const agencia = await service.buscarAgenciaPorCodigo(codigo);
      return agencia;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { buscarAgenciaPorCodigo, loading, error };
};
