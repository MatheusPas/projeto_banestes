import React, { useState, useEffect } from "react";
import { useContas } from "../../hooks/useDatas";
import { useAgencias } from "../../hooks/useDatas";
import type { Cliente, Conta, Agencia } from "../../types";
import ContaCard from "../Conta/ContaCard";
import AgenciaInfo from "../Agencia/AgenciaInfo";

interface ClienteDetalhesProps {
  cliente: Cliente;
  onVoltar: () => void;
}

const ClienteDetalhes: React.FC<ClienteDetalhesProps> = ({ cliente, onVoltar }) => {
  const [contas, setContas] = useState<Conta[]>([]);
  const [agencia, setAgencia] = useState<Agencia | null>(null);
  
  const { buscarContasPorCliente, loading: loadingContas, error: errorContas } = useContas();
  const { buscarAgenciaPorCodigo, loading: loadingAgencia, error: errorAgencia } = useAgencias();

  useEffect(() => {
    const carregarDados = async () => {
      try {
        // Carregar contas do cliente
        const contasData = await buscarContasPorCliente(cliente.cpfCnpj);
        setContas(contasData);

        // Carregar agência do cliente
        const agenciaData = await buscarAgenciaPorCodigo(cliente.codigoAgencia);
        setAgencia(agenciaData);
      } catch (error) {
        console.error('Erro ao carregar dados do cliente:', error);
      }
    };

    carregarDados();
  }, [cliente, buscarContasPorCliente, buscarAgenciaPorCodigo]);

  const formatarMoeda = (valor: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const formatarCPF = (cpf: string): string => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  return (
    <div className="p-5 bg-gray-50 min-h-screen">
      {/* Header com botão voltar */}
      <div className="mb-6">
        <button
          onClick={onVoltar}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
          aria-label="Voltar para lista de clientes"
        >
          ← Voltar à Lista
        </button>
      </div>

      {/* Informações do Cliente */}
      <section className="bg-white rounded-xl border-2 border-blue-100 p-6 mb-6 shadow-md">
        <header className="border-b-2 border-blue-500 pb-4 mb-6">
          <h1 className="text-blue-800 text-3xl font-bold">
            {cliente.nome}
          </h1>
          {cliente.nomeSocial && (
            <p className="text-blue-600 text-lg mt-1">
              Nome Social: {cliente.nomeSocial}
            </p>
          )}
          <p className="text-gray-600 text-sm mt-2">
            ID: {cliente.id}
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-4">
            <h2 className="text-blue-700 font-bold text-lg border-b border-blue-200 pb-2">
              Dados Pessoais
            </h2>
            
            <div>
              <span className="font-bold text-blue-500 text-sm block">CPF/CNPJ:</span>
              <p className="text-gray-800">{formatarCPF(cliente.cpfCnpj)}</p>
            </div>

            {cliente.rg && (
              <div>
                <span className="font-bold text-blue-500 text-sm block">RG:</span>
                <p className="text-gray-800">{cliente.rg}</p>
              </div>
            )}

            <div>
              <span className="font-bold text-blue-500 text-sm block">Data de Nascimento:</span>
              <p className="text-gray-800">{cliente.dataNascimento.toLocaleDateString('pt-BR')}</p>
            </div>

            <div>
              <span className="font-bold text-blue-500 text-sm block">Estado Civil:</span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold">
                {cliente.estadoCivil}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-blue-700 font-bold text-lg border-b border-blue-200 pb-2">
              Contato
            </h2>
            
            <div>
              <span className="font-bold text-blue-500 text-sm block">Email:</span>
              <p className="text-gray-800 break-words">
                {cliente.email || 'Não informado'}
              </p>
            </div>

            <div>
              <span className="font-bold text-blue-500 text-sm block">Endereço:</span>
              <p className="text-gray-800">
                {cliente.endereco || 'Não informado'}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-blue-700 font-bold text-lg border-b border-blue-200 pb-2">
              Informações Financeiras
            </h2>
            
            <div>
              <span className="font-bold text-blue-500 text-sm block">Renda Anual:</span>
              <p className="text-green-600 font-bold text-lg">
                {formatarMoeda(cliente.rendaAnual)}
              </p>
            </div>

            <div>
              <span className="font-bold text-blue-500 text-sm block">Patrimônio:</span>
              <p className="text-green-600 font-bold text-lg">
                {formatarMoeda(cliente.patrimonio)}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Agência */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-blue-800 mb-4">Agência</h2>
        {loadingAgencia ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <span className="ml-3 text-green-600">Carregando agência...</span>
          </div>
        ) : errorAgencia ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">Erro ao carregar agência: {errorAgencia}</p>
          </div>
        ) : agencia ? (
          <AgenciaInfo agencia={agencia} />
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800">Agência não encontrada</p>
          </div>
        )}
      </div>

      {/* Contas */}
      <div>
        <h2 className="text-2xl font-bold text-blue-800 mb-4">
          Contas Bancárias ({contas.length})
        </h2>
        
        {loadingContas ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-blue-600">Carregando contas...</span>
          </div>
        ) : errorContas ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">Erro ao carregar contas: {errorContas}</p>
          </div>
        ) : contas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contas.map((conta) => (
              <ContaCard key={conta.id} conta={conta} />
            ))}
          </div>
        ) : (
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