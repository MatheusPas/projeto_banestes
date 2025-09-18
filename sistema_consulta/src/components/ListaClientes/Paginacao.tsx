import React from "react";

// Interface que define as propriedades esperadas pelo componente de paginação
interface PaginacaoProps {
  paginaAtual: number; // Página atualmente selecionada
  totalPaginas: number; // Total de páginas disponíveis
  onMudarPagina: (pagina: number) => void; // Função chamada ao mudar de página
  totalItens: number; // Total de itens disponíveis
  itensPorPagina: number; // Quantidade de itens por página
  loading?: boolean; // Indica se está carregando (opcional)
}

// Componente funcional de paginação
const Paginacao: React.FC<PaginacaoProps> = ({
  paginaAtual,
  totalPaginas,
  onMudarPagina,
  totalItens,
  itensPorPagina,
  loading = false // Valor padrão para loading é false
}) => {
  // Se só há uma página, não há necessidade de renderizar o componente
  if (totalPaginas <= 1) return null;

  // Calcula o índice do primeiro e último item exibido na página atual
  const inicioItem = (paginaAtual - 1) * itensPorPagina + 1;
  const fimItem = Math.min(paginaAtual * itensPorPagina, totalItens);

  // Função para trocar de página com validações
  const handleMudarPagina = (novaPagina: number) => {
    // Verifica se a nova página é válida, diferente da atual e se não está carregando
    if (novaPagina >= 1 && novaPagina <= totalPaginas && novaPagina !== paginaAtual && !loading) {
      onMudarPagina(novaPagina); // Chama a função de mudança de página
      window.scrollTo({ top: 0, behavior: 'smooth' }); // Volta ao topo da página com rolagem suave
    }
  };

  // Renderiza os botões de número de páginas
  const renderBotoesPagina = () => {
    const botoes = [];
    const maxBotoes = 5; // Número máximo de botões de página visíveis

    // Define o intervalo de páginas a serem exibidas
    let inicio = Math.max(1, paginaAtual - Math.floor(maxBotoes / 2));
    let fim = Math.min(totalPaginas, inicio + maxBotoes - 1);

    // Ajusta o início se o intervalo estiver incompleto
    if (fim - inicio < maxBotoes - 1) {
      inicio = Math.max(1, fim - maxBotoes + 1);
    }

    // Cria os botões de número de página
    for (let i = inicio; i <= fim; i++) {
      botoes.push(
        <button
          key={i}
          onClick={() => handleMudarPagina(i)} // Muda para a página clicada
          disabled={loading} // Desabilita se estiver carregando
          className={`px-3 py-2 mx-1 border-2 rounded-md cursor-pointer text-sm font-bold transition-all min-w-[40px] text-center disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-400 ${
            i === paginaAtual
              ? 'bg-blue-500 text-white border-blue-500' // Estilo da página atual
              : 'border-blue-100 bg-white text-blue-500 hover:bg-blue-50' // Estilo das outras páginas
          }`}
          aria-label={`Ir para página ${i}`} // Acessibilidade
          aria-current={i === paginaAtual ? 'page' : undefined} // Indica qual é a página atual para leitores de tela
        >
          {i}
        </button>
      );
    }

    return botoes;
  };

  return (
    // Elemento de navegação com estilos
    <nav className="bg-gray-50 p-5 rounded-xl border-2 border-blue-100 mt-5 mb-5" aria-label="Navegação entre páginas">
      {/* Informações de página e itens exibidos */}
      <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
        <p className="text-gray-600 text-sm">
          Mostrando {inicioItem} até {fimItem} de {totalItens} clientes
        </p>
        <p className="text-blue-500 text-sm font-bold">
          Página {paginaAtual} de {totalPaginas}
        </p>
      </div>

      {/* Botões de navegação */}
      <div className="flex flex-wrap justify-center items-center gap-2">
        {/* Botão de página anterior */}
        <button
          onClick={() => handleMudarPagina(paginaAtual - 1)}
          disabled={paginaAtual === 1 || loading} // Desabilita se já estiver na primeira página ou carregando
          className="px-3 py-2  rounded-md text-sm font-bold transition-all bg-green-500 hover:bg-green-600 text-white border-green-500 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-400"
          aria-label="Página anterior"
        >
          ← Anterior
        </button>

        {/* Botões numerados das páginas */}
        {renderBotoesPagina()}

        {/* Botão de próxima página */}
        <button
          onClick={() => handleMudarPagina(paginaAtual + 1)}
          disabled={paginaAtual === totalPaginas || loading} // Desabilita se já estiver na última página ou carregando
          className="px-3 py-2 rounded-md text-sm font-bold transition-all bg-green-500 hover:bg-green-600 text-white border-green-500 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-400"
          aria-label="Próxima página"
        >
          Próximo →
        </button>
      </div>
    </nav>
  );
};

export default Paginacao;
