import React from "react";

interface PaginacaoProps {
  paginaAtual: number;
  totalPaginas: number;
  onMudarPagina: (pagina: number) => void;
  totalItens: number;
  itensPorPagina: number;
}

const Paginacao: React.FC<PaginacaoProps> = ({
  paginaAtual,
  totalPaginas,
  onMudarPagina,
  totalItens,
  itensPorPagina
}) => {
  const inicioItem = (paginaAtual - 1) * itensPorPagina + 1;
  const fimItem = Math.min(paginaAtual * itensPorPagina, totalItens);

  // Handler para mudança de página com logs para debug
  const handleMudarPagina = (novaPagina: number) => {
    console.log(`🔄 Mudando da página ${paginaAtual} para ${novaPagina}`);
    if (novaPagina >= 1 && novaPagina <= totalPaginas && novaPagina !== paginaAtual) {
      onMudarPagina(novaPagina);
    }
  };

  // Handler para botão anterior
  const handleAnterior = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (paginaAtual > 1) {
      handleMudarPagina(paginaAtual - 1);
    }
  };

  // Handler para botão próximo
  const handleProximo = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (paginaAtual < totalPaginas) {
      handleMudarPagina(paginaAtual + 1);
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

    // Botão primeira página
    if (inicio > 1) {
      botoes.push(
        <button
          key="primeiro"
          onClick={(e) => {
            e.preventDefault();
            handleMudarPagina(1);
          }}
          className="px-3 py-2 mx-1 border-2 border-blue-100 rounded-md bg-white text-blue-500 cursor-pointer text-sm font-bold transition-all hover:bg-blue-50 min-w-[40px] text-center"
          type="button"
        >
          1
        </button>
      );
      if (inicio > 2) {
        botoes.push(
          <span key="ellipsis1" className="mx-2 text-gray-600">
            ...
          </span>
        );
      }
    }

    // Botões das páginas
    for (let i = inicio; i <= fim; i++) {
      botoes.push(
        <button
          key={i}
          onClick={(e) => {
            e.preventDefault();
            handleMudarPagina(i);
          }}
          className={`px-3 py-2 mx-1 border-2 rounded-md cursor-pointer text-sm font-bold transition-all min-w-[40px] text-center ${
            i === paginaAtual
              ? 'bg-blue-500 text-white border-blue-500'
              : 'border-blue-100 bg-white text-blue-500 hover:bg-blue-50'
          }`}
          type="button"
        >
          {i}
        </button>
      );
    }

    // Botão última página
    if (fim < totalPaginas) {
      if (fim < totalPaginas - 1) {
        botoes.push(
          <span key="ellipsis2" className="mx-2 text-gray-600">
            ...
          </span>
        );
      }
      botoes.push(
        <button
          key="ultimo"
          onClick={(e) => {
            e.preventDefault();
            handleMudarPagina(totalPaginas);
          }}
          className="px-3 py-2 mx-1 border-2 border-blue-100 rounded-md bg-white text-blue-500 cursor-pointer text-sm font-bold transition-all hover:bg-blue-50 min-w-[40px] text-center"
          type="button"
        >
          {totalPaginas}
        </button>
      );
    }

    return botoes;
  };

  // Se só tem uma página, não mostra paginação
  if (totalPaginas <= 1) return null;

  console.log(`📄 Paginação: página ${paginaAtual} de ${totalPaginas}, ${totalItens} itens total`);

  return (
    <div className="bg-gray-50 p-5 rounded-xl border-2 border-blue-100 mt-5">
      {/* Informações */}
      <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
        <div className="text-gray-600 text-sm">
          📊 Mostrando {inicioItem} até {fimItem} de {totalItens} clientes
        </div>
        <div className="text-blue-500 text-sm font-bold">
          📄 Página {paginaAtual} de {totalPaginas}
        </div>
      </div>

      {/* Controles de navegação */}
      <div className="flex flex-wrap justify-center items-center gap-2">
        {/* Botão Primeira Página */}
        <button
          onClick={(e) => {
            e.preventDefault();
            handleMudarPagina(1);
          }}
          disabled={paginaAtual === 1}
          className={`px-3 py-2 border-2 rounded-md text-sm font-bold transition-all ${
            paginaAtual === 1
              ? 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed'
              : 'bg-green-500 hover:bg-green-600 text-white border-green-500 cursor-pointer'
          }`}
          type="button"
          title="Primeira página"
        >
          ⏮️ Primeira
        </button>

        {/* Botão Anterior */}
        <button
          onClick={handleAnterior}
          disabled={paginaAtual === 1}
          className={`px-3 py-2 border-2 rounded-md text-sm font-bold transition-all ${
            paginaAtual === 1
              ? 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed'
              : 'bg-green-500 hover:bg-green-600 text-white border-green-500 cursor-pointer'
          }`}
          type="button"
          title="Página anterior"
        >
          ⬅️ Anterior
        </button>

        {/* Números das páginas */}
        <div className="flex items-center gap-1">
          {renderBotoesPagina()}
        </div>

        {/* Botão Próximo */}
        <button
          onClick={handleProximo}
          disabled={paginaAtual === totalPaginas}
          className={`px-3 py-2 border-2 rounded-md text-sm font-bold transition-all ${
            paginaAtual === totalPaginas
              ? 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed'
              : 'bg-green-500 hover:bg-green-600 text-white border-green-500 cursor-pointer'
          }`}
          type="button"
          title="Próxima página"
        >
          Próximo ➡️
        </button>

        {/* Botão Última Página */}
        <button
          onClick={(e) => {
            e.preventDefault();
            handleMudarPagina(totalPaginas);
          }}
          disabled={paginaAtual === totalPaginas}
          className={`px-3 py-2 border-2 rounded-md text-sm font-bold transition-all ${
            paginaAtual === totalPaginas
              ? 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed'
              : 'bg-green-500 hover:bg-green-600 text-white border-green-500 cursor-pointer'
          }`}
          type="button"
          title="Última página"
        >
          Última ⏭️
        </button>
      </div>

      {/* Input para ir direto para uma página */}
      <div className="mt-4 flex flex-wrap justify-center items-center gap-2">
        <span className="text-gray-600 text-sm">Ir para página:</span>
        <input
          type="number"
          min="1"
          max={totalPaginas}
          value={paginaAtual}
          onChange={(e) => {
            const novaPagina = parseInt(e.target.value);
            if (novaPagina && novaPagina >= 1 && novaPagina <= totalPaginas) {
              handleMudarPagina(novaPagina);
            }
          }}
          className="w-16 px-2 py-1 border-2 border-blue-100 rounded text-center text-sm focus:border-blue-500 outline-none"
        />
        <span className="text-gray-600 text-sm">de {totalPaginas}</span>
      </div>
    </div>
  );
};

export default Paginacao;