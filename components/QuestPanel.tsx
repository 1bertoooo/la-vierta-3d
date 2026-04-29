"use client";

import { useGame } from "@/lib/store";
import { useState } from "react";

const PEDACOS = [
  { key: "coracao", nome: "Coração", icon: "❤", local: "Adega do Sérgio" },
  { key: "olho", nome: "Olho", icon: "👁", local: "Diego das Sombras" },
  { key: "voz", nome: "Voz", icon: "🗣", local: "Walber, no mercado" },
  { key: "mao", nome: "Mão", icon: "✋", local: "Bia, atrás do mercado" },
  { key: "sombra", nome: "Sombra", icon: "🌑", local: "Letícia (te procura)" },
] as const;

/**
 * Painel de quest dobrável no canto superior direito.
 * Mostra os 5 pedaços com checkmark e dica do próximo objetivo.
 */
export default function QuestPanel() {
  const [aberto, setAberto] = useState(true);
  const pedacosColetados = useGame((s) => s.pedacosColetados);
  const flags = useGame((s) => s.flags);

  const totalCol = pedacosColetados.length;
  const proximoObjetivo = (() => {
    if (totalCol === 0 && !flags["sergio_falou_da_bruna"]) {
      return "Conversa com o Sérgio na Taverna pra entender o que tá rolando.";
    }
    if (totalCol === 0 && !flags["anderson_explicou_missao"]) {
      return "Sobe na Torre. Anderson explica a missão.";
    }
    if (totalCol < 5) {
      return `Faltam ${5 - totalCol} pedaços. Procura na cidade.`;
    }
    return "Todos os pedaços coletados. Volta pro Anderson na Torre pra escolher o final.";
  })();

  return (
    <div className="absolute top-12 right-3 z-10 w-64 max-w-[80vw]">
      <button
        onClick={() => setAberto((a) => !a)}
        className="w-full px-3 py-1.5 bg-[var(--color-carvao)]/90 border border-[var(--color-pergaminho-velho)]/30 rounded text-xs uppercase tracking-widest text-[var(--color-dourado)] flex justify-between items-center"
      >
        <span>📜 Pedaços {totalCol}/5</span>
        <span>{aberto ? "▾" : "◂"}</span>
      </button>
      {aberto && (
        <div className="mt-1 bg-[var(--color-carvao)]/90 border border-[var(--color-pergaminho-velho)]/30 rounded p-3 text-xs">
          <ul className="space-y-1.5 mb-3">
            {PEDACOS.map((p) => {
              const ok = pedacosColetados.includes(p.key);
              return (
                <li key={p.key} className={`flex items-center gap-2 ${ok ? "text-[var(--color-dourado)]" : "text-[var(--color-pergaminho-velho)]"}`}>
                  <span className="w-4">{ok ? "✓" : p.icon}</span>
                  <span className="flex-1">
                    <span className={ok ? "line-through" : ""}>{p.nome}</span>
                    {!ok && <span className="block text-[10px] text-[var(--color-pergaminho-velho)]/70">{p.local}</span>}
                  </span>
                </li>
              );
            })}
          </ul>
          <p className="text-[10px] italic text-[var(--color-pergaminho)]/80 border-t border-[var(--color-pergaminho-velho)]/20 pt-2">
            {proximoObjetivo}
          </p>
        </div>
      )}
    </div>
  );
}
