import React from "react";
import type { Agencia } from "../../types";

// Interface que define as props do componente
interface AgenciaInfoProps {
  agencia: Agencia; // Dados completos da agência
}

/**
 * Componente AgenciaInfo - Exibe informações de uma agência bancária
 * 
 * Funcionalidades:
 * - Mostra nome da agência com ícone decorativo
 * - Exibe código da agência
 * - Mostra endereço com fallback para casos sem informação
 * - Visual com gradiente e bordas estilizadas
 */
const AgenciaInfo: React.FC<AgenciaInfoProps> = ({ agencia }) => {
  return (
    <section className="border-2 border-green-100 rounded-xl p-6 bg-gradient-to-r from-green-50 to-blue-50 shadow-sm">
      {/* Cabeçalho com ícone e informações principais da agência */}
      <header className="flex items-center gap-3 mb-4">
        {/* Ícone decorativo de prédio para representar a agência */}
        <span className="text-3xl" aria-hidden="true">🏢</span>
        
        <div>
          {/* Nome da agência */}
          <h2 className="text-green-800 font-bold text-xl">
            {agencia.nome}
          </h2>
          
          {/* Código da agência */}
          <p className="text-green-600 text-sm">
            Agência {agencia.codigo}
          </p>
        </div>
      </header>

      {/* Corpo do componente com informações detalhadas */}
      <div className="space-y-3">
        {/* Endereço da agência */}
        <div>
          <span className="text-sm font-bold text-green-600 block">
            Endereço:
          </span>
          <p className="text-gray-700">
            {agencia.endereco || 'Endereço não informado'} {/* Fallback caso não tenha endereço */}
          </p>
        </div>

        {/* ID removido conforme solicitação - era: ID: {agencia.id} */}
      </div>
    </section>
  );
};

export default AgenciaInfo;