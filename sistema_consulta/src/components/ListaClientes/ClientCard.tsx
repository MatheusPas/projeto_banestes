import React from "react";
import type { Cliente } from "../../types";

interface ClientCardProps {
  cliente: Cliente;
}

const ClientCard: React.FC<ClientCardProps> = ({ cliente }) => {
  return (
    <div className="border-2 border-blue-100 rounded-xl p-4 bg-white shadow-md hover:shadow-lg hover:-translate-y-1 hover:border-blue-400 transition-all duration-300 min-h-[280px] flex flex-col justify-between">
      {/* Header do Card */}
      <div className="border-b-2 border-green-500 pb-3 mb-3">
        <h3 className="text-blue-800 text-lg font-bold m-0">
          {cliente.nome}
        </h3>
        <p className="text-gray-600 text-xs mt-1 m-0">
          ID: {cliente.id}
        </p>
      </div>

      {/* Informações principais */}
      <div className="flex-1">
        <div className="mb-2">
          <span className="font-bold text-blue-500 text-xs">
            📧 Email:
          </span>
          <p className="text-xs mt-1 m-0 break-words">
            {cliente.email || 'Não informado'}
          </p>
        </div>

        <div className="mb-2">
          <span className="font-bold text-blue-500 text-xs">
            🆔 CPF/CNPJ:
          </span>
          <p className="text-xs mt-1 m-0">
            {cliente.cpfCnpj || 'Não informado'}
          </p>
        </div>

        <div className="mb-2">
          <span className="font-bold text-blue-500 text-xs">
            🎂 Nascimento:
          </span>
          <p className="text-xs mt-1 m-0">
            {cliente.dataNascimento.toLocaleDateString('pt-BR')}
          </p>
        </div>

        <div className="mb-2">
          <span className="font-bold text-blue-500 text-xs">
            💰 Renda Anual:
          </span>
          <p className="text-xs mt-1 m-0 text-green-600 font-bold">
            R$ {cliente.rendaAnual.toLocaleString('pt-BR')}
          </p>
        </div>

        <div className="mb-2">
          <span className="font-bold text-blue-500 text-xs">
            🏦 Agência:
          </span>
          <p className="text-xs mt-1 m-0">
            {cliente.codigoAgencia}
          </p>
        </div>
      </div>

      {/* Footer com estado civil */}
      <div className="mt-3 pt-2 border-t border-gray-200">
        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-bold">
          {cliente.estadoCivil}
        </span>
      </div>
    </div>
  );
};

export default ClientCard;