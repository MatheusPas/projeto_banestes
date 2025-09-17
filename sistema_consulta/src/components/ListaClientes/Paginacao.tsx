import React from "react";

interface PaginacaoProps {
  paginaAtual: number;
  totalPaginas: number;
  onMudarPagina: (pagina: number) => void;
  totalItens: number;
  itensPorPagina: number;
  loading?: boolean;
}

const Paginacao: React.FC<PaginacaoProps> = ({
  paginaAtual,
  totalPaginas,
  onMudarPagina,
  totalItens,
  itensPorPagina,
  loading = false
}) => {
  if (totalPaginas <= 1) return null;

  const inicioItem = (paginaAtual - 1) * itensPorPagina + 1;
  const fimItem = Math.min(paginaAtual * itensPorPagina, totalItens);

  const handleMudarPagina = (novaPagina: number) => {
    if (novaPagina >= 1 && novaPagina <= totalPaginas && novaPagina !== paginaAtual && !loading) {
      onMudarPagina(novaPagina);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderBotoesPagina = () => {
    const botoes = [];
    const maxBotoes = 5;
    let inicio = Math.max(1, paginaAtual - Math.floor(maxBotoes / 2));
    let fim = Math.min(totalPaginas, inicio + maxBotoes - 1);

    if (fim - inicio < maxBotoes - 1) {
      inicio = Math.max(1, fim - maxBotoes + 1);
    }

    for (let i = inicio; i <= fim; i++) {
      botoes.push(
        <button
          key={i}
          onClick={() => handleMudarPagina(i)}
          disabled={loading}
          className={`px-3 py-2 mx-1 border-2 rounded-md cursor-pointer text-sm font-bold transition-all min-w-[40px] text-center disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-400 ${
            i === paginaAtual
              ? 'bg-blue-500 text-white border-blue-500'
              : 'border-blue-100 bg-white text-blue-500 hover:bg-blue-50'
          }`}
          aria-label={`Ir para página ${i}`}
          aria-current={i === paginaAtual ? 'page' : undefined}
        >
          {i}
        </button>
      );
    }

    return botoes;
  };

  return (
    <nav className="bg-gray-50 p-5 rounded-xl border-2 border-blue-100 mt-5 mb-5" aria-label="Navegação entre páginas">
      <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
        <p className="text-gray-600 text-sm">
          Mostrando {inicioItem} até {fimItem} de {totalItens} clientes
        </p>
        <p className="text-blue-500 text-sm font-bold">
          Página {paginaAtual} de {totalPaginas}
        </p>
      </div>

      <div className="flex flex-wrap justify-center items-center gap-2">
        <button
          onClick={() => handleMudarPagina(paginaAtual - 1)}
          disabled={paginaAtual === 1 || loading}
          className="px-3 py-2  rounded-md text-sm font-bold transition-all bg-green-500 hover:bg-green-600 text-white border-green-500 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-400"
          aria-label="Página anterior"
        >
          ← Anterior
        </button>

        {renderBotoesPagina()}

        <button
          onClick={() => handleMudarPagina(paginaAtual + 1)}
          disabled={paginaAtual === totalPaginas || loading}
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