"use client";

import { useGame } from "@/lib/store";
import { useEffect } from "react";

/**
 * Cena final / epílogo. Renderiza fora do Canvas — overlay narrativo simples.
 * Mostra texto final dependendo do `finalEscolhido` no store.
 *
 * Os 3 finais:
 *  - matar: combate com Bruna inteira; vitória → texto + custo da empatia perdida.
 *  - prender: cutscene com escolha do "trocado" (random ou escolhido); cidade salva mas fragmentada.
 *  - redimir: 3 dos 4 jogadores recitam empatia (input de texto livre); Bruna humanizada.
 *
 * Por simplicidade nessa primeira versão, todos os 3 finais mostram texto +
 * créditos. Mecânicas avançadas (combate Bruna, escolha do trocado, recitar
 * empatia) são polish futuro.
 */
export default function Epilogo() {
  const finalEscolhido = useGame((s) => s.finalEscolhido);
  const setEmCombate = useGame((s) => s.setEmCombate);

  // Se for "matar", dispara combate com Bruna inteira
  useEffect(() => {
    if (finalEscolhido === "matar") {
      window.dispatchEvent(new CustomEvent("vierta:start-combat", { detail: "bruna_inteira" }));
    } else {
      setEmCombate(false);
    }
  }, [finalEscolhido, setEmCombate]);

  return null;
}

/**
 * Overlay HTML mostrado fora do Canvas — chamado direto pelo /jogar.
 */
export function EpilogoOverlay() {
  const finalEscolhido = useGame((s) => s.finalEscolhido);
  const pedacos = useGame((s) => s.pedacosColetados);
  const flags = useGame((s) => s.flags);

  if (!finalEscolhido) return null;

  const textos: Record<string, { titulo: string; texto: string }> = {
    matar: {
      titulo: "O caminho da queima",
      texto:
        "Anderson acende o sal. Os 5 pedaços queimam roxos.\n\nBruna grita. Não de dor — de despedida. O som varre Velreth como uma onda. Janelas trincam. Cães uivam.\n\nQuando para, é silêncio. A cidade respira.\n\nMas algo muda. Sérgio abre a boca pra falar 'ó a empatia' — e a frase trava. Ele não consegue. Os ombros caem. Ele continua lustrando o copo.\n\nVocês ganharam. Mas Velreth pagou a fatura.",
    },
    prender: {
      titulo: "O caminho da Pandórica",
      texto:
        "A caixa de madeira, gravada com '5 NOVALGINAS, 2015', se abre. Dentro: vazio. Cheiro de Novalgina velha.\n\nUm de vocês entra. Sem dizer qual — vocês decidem juntos no escuro. A caixa fecha.\n\nBruna sai como fumaça. Anderson sela.\n\nA cidade salva. Mas tem três Élite na mesa, agora. E uma cadeira vazia que ninguém senta.\n\nVocês prometem voltar. A campanha continua — outra noite.",
    },
    redimir: {
      titulo: "O caminho da empatia",
      texto:
        "Três de vocês falam. De uma cena real. Um pai que voltou. Um amigo que segurou. Uma noite em que ninguém sabia se ia voltar.\n\nBruna escuta. Os pedaços vibram. Reúnem. Lentamente, ela toma forma humana. Cabelo preto, vestido roxo, olhos vivos pela primeira vez em uma década.\n\nEla chora.\n\n— obrigada pelo cuidado.\n\nAnderson sorri. Pela primeira vez na noite.\n\nVocês vão cuidar dela por seis meses. Trabalhoso. Mas Velreth tem mais um morador agora — e a Élite tem mais uma irmã.",
    },
  };

  const f = textos[finalEscolhido];

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center px-6 overflow-y-auto">
      <div className="max-w-2xl w-full py-12">
        <p className="text-xs uppercase tracking-widest text-[var(--color-pergaminho-velho)] text-center mb-2">
          Final
        </p>
        <h1
          className="text-4xl text-[var(--color-dourado)] text-center mb-8"
          style={{ fontFamily: "var(--font-cinzel)" }}
        >
          {f.titulo}
        </h1>
        <p className="text-[var(--color-pergaminho)] leading-relaxed whitespace-pre-wrap text-base mb-8">
          {f.texto}
        </p>
        <div className="border-t border-[var(--color-pergaminho-velho)]/30 pt-4 text-center">
          <p className="text-[10px] uppercase tracking-widest text-[var(--color-pergaminho-velho)]">
            Pedaços coletados: {pedacos.length}/5 · Doom Vierta:{" "}
            {useGame.getState().vierta} · Esperança: {useGame.getState().esperanca} · Sina:{" "}
            {useGame.getState().sina}
          </p>
          <p className="text-[10px] text-[var(--color-pedra)] mt-2 italic">
            A Élite voltou pra mesa. A gente sempre volta pra mesa.
          </p>
          {flags["bia_aliada"] && (
            <p className="text-[10px] text-[var(--color-dourado)]/70 mt-3">
              Bia abriu uma confeitaria. Vende doces de bode.
            </p>
          )}
          {flags["leticia_redimida"] && (
            <p className="text-[10px] text-[var(--color-dourado)]/70 mt-1">
              Letícia tá num date saudável. Sorri.
            </p>
          )}
          {flags["walber_revelou"] && (
            <p className="text-[10px] text-[var(--color-dourado)]/70 mt-1">
              Walber fala sem gaguejar. Pela primeira vez. &ldquo;Obrigado.&rdquo;
            </p>
          )}
          {flags["diego_aliado"] && (
            <p className="text-[10px] text-[var(--color-dourado)]/70 mt-1">
              Diego namora alguém que não traiu. Aprendeu.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
