import React from "react";
import type { Conta } from "../../types";

// Interface que define as props do componente
interface ContaCardProps {
  conta: Conta; // Dados completos da conta bancária
}

/**
 * Componente ContaCard - Renderiza informações de uma conta bancária
 * 
 * Funcionalidades:
 * - Exibe tipo de conta com ícone específico (corrente/poupança)
 * - Mostra saldo atual com cores baseadas no valor (positivo/negativo/zero)
 * - Exibe limite de crédito e crédito disponível
 * - Calcula e mostra limite total disponível
 * - Visual responsivo com hover effects
 */
const ContaCard: React.FC<ContaCardProps> = ({ conta }) => {
  
  /**
   * Função utilitária para formatação de valores monetários
   * Converte número para formato de moeda brasileira (R$)
   */
  const formatarMoeda = (valor: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  /**
   * Função que retorna o ícone apropriado baseado no tipo de conta
   * @param tipo - Tipo da conta ("corrente" ou "poupanca")
   * @returns Emoji representando o tipo de conta
   */
  const getTipoIcon = (tipo: "corrente" | "poupanca"): string => {
    return tipo === 'corrente' ? '💳' : '🏦'; // Cartão para corrente, banco para poupança
  };

  /**
   * Função que determina a cor do saldo baseada no valor
   * @param saldo - Valor do saldo da conta
   * @returns Classe CSS para colorir o saldo
   */
  const getSaldoColor = (saldo: number): string => {
    if (saldo > 0) return 'text-green-600'; // Verde para saldo positivo
    if (saldo < 0) return 'text-red-600';   // Vermelho para saldo negativo
    return 'text-gray-600';                 // Cinza para saldo zero
  };

  return (
    <article className="border-2 border-blue-100 rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition-all duration-300">
      {/* Cabeçalho do card com tipo de conta e ícone */}
      <header className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {/* Ícone baseado no tipo de conta */}
          <span className="text-2xl" aria-hidden="true">
            {getTipoIcon(conta.tipo)}
          </span>
          
          {/* Nome do tipo de conta (capitalizado) */}
          <h3 className="text-blue-800 font-bold text-lg capitalize">
            Conta {conta.tipo}
          </h3>
        </div>
        
        {/* ID removido conforme solicitação - era um badge pequeno com {conta.id} */}
      </header>

      {/* Corpo do card com informações financeiras */}
      <div className="space-y-3">
        
        {/* Saldo atual - destaque principal */}
        <div>
          <span className="text-sm font-bold text-blue-500 block">
            Saldo Atual:
          </span>
          <p className={`text-xl font-bold ${getSaldoColor(conta.saldo)}`}>
            {formatarMoeda(conta.saldo)}
          </p>
        </div>

        {/* Grid com limite de crédito e crédito disponível */}
        <div className="grid grid-cols-2 gap-3">
          
          {/* Limite de crédito total */}
          <div>
            <span className="text-xs font-bold text-blue-500 block">
              Limite de Crédito:
            </span>
            <p className="text-sm font-semibold text-gray-700">
              {formatarMoeda(conta.limiteCredito)}
            </p>
          </div>

          {/* Crédito ainda disponível para uso */}
          <div>
            <span className="text-xs font-bold text-blue-500 block">
              Crédito Disponível:
            </span>
            <p className="text-sm font-semibold text-green-600">
              {formatarMoeda(conta.creditoDisponivel)}
            </p>
          </div>
        </div>

        {/* Rodapé com cálculo do limite total (saldo + crédito disponível) */}
        <div className="pt-2 border-t border-gray-100">
          <span className="text-xs text-gray-600">
            Limite Total: {formatarMoeda(conta.saldo + conta.creditoDisponivel)}
          </span>
        </div>
      </div>
    </article>
  );
};

export default ContaCard;