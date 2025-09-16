import React from "react";
import type { Agencia } from "../../types";

interface AgenciaInfoProps {
  agencia: Agencia;
}

const AgenciaInfo: React.FC<AgenciaInfoProps> = ({ agencia }) => {
  return (
    <section className="border-2 border-green-100 rounded-xl p-6 bg-gradient-to-r from-green-50 to-blue-50 shadow-sm">
      <header className="flex items-center gap-3 mb-4">
        <span className="text-3xl" aria-hidden="true">🏢</span>
        <div>
          <h2 className="text-green-800 font-bold text-xl">
            {agencia.nome}
          </h2>
          <p className="text-green-600 text-sm">
            Agência {agencia.codigo}
          </p>
        </div>
      </header>

      <div className="space-y-3">
        <div>
          <span className="text-sm font-bold text-green-600 block">
            Endereço:
          </span>
          <p className="text-gray-700">
            {agencia.endereco || 'Endereço não informado'}
          </p>
        </div>

        <div>
          <span className="text-xs text-gray-600">
            ID: {agencia.id}
          </span>
        </div>
      </div>
    </section>
  );
};

export default AgenciaInfo;