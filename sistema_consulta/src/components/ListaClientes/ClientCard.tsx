import React from "react";
import type { Cliente } from "../../types";

interface ClientCardProps {
  cliente: Cliente;
  onSelectCliente: (cliente: Cliente) => void;
}

const ClientCard: React.FC<ClientCardProps> = ({ cliente, onSelectCliente }) => {
  const handleCardClick = () => {
    onSelectCliente(cliente);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick();
    }
  };

  return (
    <article 
      className="border-2 border-blue-100 rounded-xl p-4 bg-white shadow-md hover:shadow-lg hover:-translate-y-1 hover:border-blue-400 transition-all duration-300 min-h-[280px] flex flex-col justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      onClick={handleCardClick}
      onKeyDown={handleKeyPress}
      tabIndex={0}
      role="button"
      aria-label={`Ver detalhes do cliente ${cliente.nome}`}
    >
      {/* Header do Card */}
      <header className="border-b-2 border-green-500 pb-3 mb-3">
        <h3 className="text-blue-800 text-lg font-bold m-0 line-clamp-2">
          {cliente.nome}
        </h3>
        <p className="text-gray-600 text-xs mt-1 m-0">
          ID: {cliente.id}
        </p>
      </header>

      {/* Informações essenciais */}
      <div className="flex-1 space-y-2">
        <div>
          <span className="font-bold text-blue-500 text-xs block">
            Email:
          </span>
          <p className="text-xs mt-1 m-0 break-words line-clamp-2">
            {cliente.email || 'Não informado'}
          </p>
        </div>

        <div>
          <span className="font-bold text-blue-500 text-xs block">
            CPF/CNPJ:
          </span>
          <p className="text-xs mt-1 m-0">
            {cliente.cpfCnpj || 'Não informado'}
          </p>
        </div>

        <div>
          <span className="font-bold text-blue-500 text-xs block">
            Agência:
          </span>
          <p className="text-xs mt-1 m-0">
            {cliente.codigoAgencia}
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-3 pt-2 border-t border-gray-200 flex justify-between items-center">
        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-bold">
          {cliente.estadoCivil}
        </span>
        <span className="text-blue-500 text-xs font-bold" aria-hidden="true">
          Ver detalhes →
        </span>
      </footer>
    </article>
  );
};

export default ClientCard;