import React from "react";
import type { Conta } from "../../types";

interface ContaCardProps {
  conta: Conta;
}

const ContaCard: React.FC<ContaCardProps> = ({ conta }) => {
  const formatarMoeda = (valor: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const getTipoIcon = (tipo: "corrente" | "poupanca"): string => {
    return tipo === 'corrente' ? '💳' : '🏦';
  };

  const getSaldoColor = (saldo: number): string => {
    if (saldo > 0) return 'text-green-600';
    if (saldo < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <article className="border-2 border-blue-100 rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition-all duration-300">
      <header className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl" aria-hidden="true">
            {getTipoIcon(conta.tipo)}
          </span>
          <h3 className="text-blue-800 font-bold text-lg capitalize">
            Conta {conta.tipo}
          </h3>
        </div>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
          {conta.id}
        </span>
      </header>

      <div className="space-y-3">
        <div>
          <span className="text-sm font-bold text-blue-500 block">
            Saldo Atual:
          </span>
          <p className={`text-xl font-bold ${getSaldoColor(conta.saldo)}`}>
            {formatarMoeda(conta.saldo)}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <span className="text-xs font-bold text-blue-500 block">
              Limite de Crédito:
            </span>
            <p className="text-sm font-semibold text-gray-700">
              {formatarMoeda(conta.limiteCredito)}
            </p>
          </div>

          <div>
            <span className="text-xs font-bold text-blue-500 block">
              Crédito Disponível:
            </span>
            <p className="text-sm font-semibold text-green-600">
              {formatarMoeda(conta.creditoDisponivel)}
            </p>
          </div>
        </div>

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