import React from "react";
import type { Cliente } from "../../types";

// Interface que define as props que o componente ClientCard recebe
interface ClientCardProps {
  cliente: Cliente; // Objeto com dados completos do cliente
  onSelectCliente: (cliente: Cliente) => void; // Função callback para quando o cliente é selecionado
}

/**
 * Componente ClientCard - Renderiza um card individual para cada cliente
 * 
 * Funcionalidades:
 * - Exibe informações resumidas do cliente (nome, nome social, email, CPF/CNPJ, agência, estado civil)
 * - Permite navegação para detalhes do cliente ao clicar
 * - Suporta navegação por teclado (Enter e Espaço)
 * - Visual responsivo com hover effects
 */
const ClientCard: React.FC<ClientCardProps> = ({ cliente, onSelectCliente }) => {
  // Handler para clique no card - executa a função de callback passada pelo componente pai
  const handleCardClick = () => {
    onSelectCliente(cliente);
  };

  // Handler para navegação por teclado - permite acessibilidade
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault(); // Previne comportamento padrão do navegador
      handleCardClick(); // Executa a mesma ação do clique
    }
  };

  return (
    <article 
      className="border-2 border-blue-100 rounded-xl p-4 bg-white shadow-md hover:shadow-lg hover:-translate-y-1 hover:border-blue-900 transition-all duration-300 min-h-[320px] flex flex-col justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2"
      onClick={handleCardClick}
      onKeyDown={handleKeyPress}
      tabIndex={0} // Permite que o card seja focável via teclado
      role="button" // Indica que é um elemento clicável
      aria-label={`Ver detalhes do cliente ${cliente.nome}`} // Descrição para leitores de tela
    >
      {/* Cabeçalho do Card - Nome do cliente e nome social */}
      <header className="border-b-2 border-green-700 pb-3 mb-3">
        {/* Nome principal do cliente */}
        <h3 className="text-blue-800 text-lg font-bold m-0 line-clamp-2">
          {cliente.nome}
        </h3>
        
        {/* Nome social - só aparece se existir */}
        {cliente.nomeSocial && (
          <p className="text-blue-600 text-sm mt-1 m-0 italic">
            Nome Social: {cliente.nomeSocial}
          </p>
        )}
        
        {/* ID removido conforme solicitação - era: ID: {cliente.id} */}
      </header>

      {/* Seção principal com informações essenciais do cliente */}
      <div className="flex-1 space-y-2">
        {/* Email do cliente */}
        <div>
          <span className="font-bold text-blue-700 text-xs block">
            Email:
          </span>
          <p className="text-xs mt-1 m-0 break-words line-clamp-2">
            {cliente.email || 'Não informado'} {/* Fallback caso não tenha email */}
          </p>
        </div>

        {/* CPF/CNPJ do cliente */}
        <div>
          <span className="font-bold text-blue-700 text-xs block">
            CPF/CNPJ:
          </span>
          <p className="text-xs mt-1 m-0">
            {cliente.cpfCnpj || 'Não informado'} {/* Fallback caso não tenha CPF/CNPJ */}
          </p>
        </div>

        {/* Código da agência do cliente */}
        <div>
          <span className="font-bold text-blue-700 text-xs block">
            Agência:
          </span>
          <p className="text-xs mt-1 m-0">
            {cliente.codigoAgencia}
          </p>
        </div>
      </div>

      {/* Rodapé do card com estado civil e indicador visual */}
      <footer className="mt-3 pt-2 border-t border-gray-200 flex justify-between items-center">
        {/* Badge com estado civil */}
        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-bold">
          {cliente.estadoCivil}
        </span>
        
        {/* Indicador visual de que é clicável */}
        <span className="text-blue-700 text-xs font-bold" aria-hidden="true">
          Ver detalhes →
        </span>
      </footer>
    </article>
  );
};

export default ClientCard;