import React, { useState, useEffect } from "react";
import { useContas } from "../../hooks/useDatas";
import { useAgencias } from "../../hooks/useDatas";
import type { Cliente, Conta, Agencia } from "../../types";
import ContaCard from "../Conta/ContaCard";
import AgenciaInfo from "../Agencia/AgenciaInfo";

// Interface que define as props do componente
interface ClienteDetalhesProps {
  cliente: Cliente; // Dados completos do cliente selecionado
  onVoltar: () => void; // Função callback para voltar à lista
}

/**
 * Componente ClienteDetalhes - Tela de detalhes completos do cliente
 * 
 * Funcionalidades:
 * - Exibe todas as informações do cliente (pessoais, contato, financeiras)
 * - Carrega e exibe informações da agência do cliente
 * - Carrega e exibe todas as contas bancárias do cliente
 * - Permite navegação de volta para a lista
 * - Gerencia estados de loading e erro para dados assíncronos
 */
const ClienteDetalhes: React.FC<ClienteDetalhesProps> = ({ cliente, onVoltar }) => {
  // Estados locais para gerenciar dados carregados assincronamente
  const [contas, setContas] = useState<Conta[]>([]); // Lista de contas do cliente
  const [agencia, setAgencia] = useState<Agencia | null>(null); // Dados da agência
  
  // Hooks personalizados para acessar APIs de contas e agências
  const { buscarContasPorCliente, loading: loadingContas, error: errorContas } = useContas();
  const { buscarAgenciaPorCodigo, loading: loadingAgencia, error: errorAgencia } = useAgencias();

  // Effect que carrega dados adicionais quando o componente é montado ou cliente muda
  useEffect(() => {
    const carregarDados = async () => {
      try {
        // Carregar contas bancárias do cliente usando seu CPF/CNPJ
        const contasData = await buscarContasPorCliente(cliente.cpfCnpj);
        setContas(contasData);

        // Carregar dados da agência usando o código da agência do cliente
        const agenciaData = await buscarAgenciaPorCodigo(cliente.codigoAgencia);
        setAgencia(agenciaData);
      } catch (error) {
        // Log de erro para debugging
        console.error('Erro ao carregar dados do cliente:', error);
      }
    };

    carregarDados();
  }, [cliente, buscarContasPorCliente, buscarAgenciaPorCodigo]); // Dependências do useEffect

  // Função utilitária para formatação de valores monetários
  const formatarMoeda = (valor: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  // Função utilitária para formatação de CPF (adiciona pontos e hífen)
  const formatarCPF = (cpf: string): string => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  return (
    <div className="p-5 bg-gray-50 min-h-screen">
      {/* Cabeçalho com botão de voltar */}
      <div className="mb-6">
        <button
          onClick={onVoltar}
          className="flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-lg font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
          aria-label="Voltar para lista de clientes"
        >
          ← Voltar à Lista
        </button>
      </div>

      {/* Seção principal com informações detalhadas do cliente */}
      <section className="bg-white rounded-xl border-2 border-blue-100 p-6 mb-6 shadow-md">
        {/* Cabeçalho da seção com nome e nome social */}
        <header className="border-b-2 border-blue-700 pb-4 mb-6">
          <h1 className="text-blue-800 text-3xl font-bold">
            {cliente.nome}
          </h1>
          
          {/* Nome social - só aparece se existir */}
          {cliente.nomeSocial && (
            <p className="text-blue-600 text-lg mt-1">
              Nome Social: {cliente.nomeSocial}
            </p>
          )}
          
          {/* ID removido conforme solicitação - era: ID: {cliente.id} */}
        </header>

        {/* Grid responsivo com três colunas de informações */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Coluna 1: Dados Pessoais */}
          <div className="space-y-4">
            <h2 className="text-blue-800 font-bold text-lg border-b border-blue-200 pb-2">
              Dados Pessoais
            </h2>
            
            {/* CPF/CNPJ formatado */}
            <div>
              <span className="font-bold text-blue-700 text-sm block">CPF/CNPJ:</span>
              <p className="text-gray-800">{formatarCPF(cliente.cpfCnpj)}</p>
            </div>

            {/* RG - só aparece se existir */}
            {cliente.rg && (
              <div>
                <span className="font-bold text-blue-700 text-sm block">RG:</span>
                <p className="text-gray-800">{cliente.rg}</p>
              </div>
            )}

            {/* Data de nascimento formatada */}
            <div>
              <span className="font-bold text-blue-700 text-sm block">Data de Nascimento:</span>
              <p className="text-gray-800">{cliente.dataNascimento.toLocaleDateString('pt-BR')}</p>
            </div>

            {/* Estado civil com badge */}
            <div>
              <span className="font-bold text-blue-700 text-sm block">Estado Civil:</span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold">
                {cliente.estadoCivil}
              </span>
            </div>
          </div>

          {/* Coluna 2: Informações de Contato */}
          <div className="space-y-4">
            <h2 className="text-blue-800 font-bold text-lg border-b border-blue-200 pb-2">
              Contato
            </h2>
            
            {/* Email com fallback */}
            <div>
              <span className="font-bold text-blue-700 text-sm block">Email:</span>
              <p className="text-gray-800 break-words">
                {cliente.email || 'Não informado'}
              </p>
            </div>

            {/* Endereço com fallback */}
            <div>
              <span className="font-bold text-blue-700 text-sm block">Endereço:</span>
              <p className="text-gray-800">
                {cliente.endereco || 'Não informado'}
              </p>
            </div>
          </div>

          {/* Coluna 3: Informações Financeiras */}
          <div className="space-y-4">
            <h2 className="text-blue-800 font-bold text-lg border-b border-blue-200 pb-2">
              Informações Financeiras
            </h2>
            
            {/* Renda anual formatada como moeda */}
            <div>
              <span className="font-bold text-blue-700 text-sm block">Renda Anual:</span>
              <p className="text-green-600 font-bold text-lg">
                {formatarMoeda(cliente.rendaAnual)}
              </p>
            </div>

            {/* Patrimônio formatado como moeda */}
            <div>
              <span className="font-bold text-blue-700 text-sm block">Patrimônio:</span>
              <p className="text-green-600 font-bold text-lg">
                {formatarMoeda(cliente.patrimonio)}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Seção da Agência */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-blue-800 mb-4">Agência</h2>
        
        {/* Estados condicionais baseados no carregamento da agência */}
        {loadingAgencia ? (
          // Loading spinner para agência
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <span className="ml-3 text-green-600">Carregando agência...</span>
          </div>
        ) : errorAgencia ? (
          // Estado de erro para agência
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">Erro ao carregar agência: {errorAgencia}</p>
          </div>
        ) : agencia ? (
          // Componente da agência se dados carregaram com sucesso
          <AgenciaInfo agencia={agencia} />
        ) : (
          // Estado quando agência não é encontrada
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800">Agência não encontrada</p>
          </div>
        )}
      </div>

      {/* Seção das Contas Bancárias */}
      <div>
        <h2 className="text-2xl font-bold text-blue-800 mb-4">
          Contas Bancárias ({contas.length}) {/* Mostra quantidade de contas */}
        </h2>
        
        {/* Estados condicionais baseados no carregamento das contas */}
        {loadingContas ? (
          // Loading spinner para contas
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-blue-600">Carregando contas...</span>
          </div>
        ) : errorContas ? (
          // Estado de erro para contas
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">Erro ao carregar contas: {errorContas}</p>
          </div>
        ) : contas.length > 0 ? (
          // Grid de contas se existirem contas
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contas.map((conta) => (
              <ContaCard key={conta.id} conta={conta} />
            ))}
          </div>
        ) : (
          // Estado quando cliente não possui contas
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <p className="text-blue-800 text-lg">
              Este cliente não possui contas bancárias cadastradas.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClienteDetalhes;