"use client";

import { useEffect } from "react";
import { useGame } from "@/lib/store";
import { NPCS_NA_PRACA } from "./cenas/Praca";

/**
 * Listener global da tecla E — abre diálogo do NPC mais próximo.
 * Renderizado FORA do Canvas (em /jogar) pra evitar conflito com R3F.
 */
export default function InteractKey() {
  const abrirDialogo = useGame((s) => s.abrirDialogo);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== "e") return;
      const state = useGame.getState();
      if (state.dialogoAtivo) return;
      // Acha NPC mais próximo dentro do raio 2.5
      let melhor: { id: string; dist: number } | null = null;
      for (const n of NPCS_NA_PRACA) {
        const d = Math.hypot(n.position[0] - state.myX, n.position[2] - state.myZ);
        if (d < 2.5 && (!melhor || d < melhor.dist)) {
          melhor = { id: n.id, dist: d };
        }
      }
      if (melhor) abrirDialogo(melhor.id);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [abrirDialogo]);

  return null;
}
