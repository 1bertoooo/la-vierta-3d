"use client";

import { useEffect } from "react";
import { useGame } from "@/lib/store";
import { getSupabase } from "@/lib/supabase";

/**
 * Salva o estado da campanha no Supabase a cada 15s.
 * Atualiza tabela `campanhas`: doom clocks, pedaços, flags, cena.
 *
 * Por que aqui e não em cada ação? Reduz writes — performático.
 * Estado é "Élite-shared" (todos os 4 jogadores compartilham 1 campanha).
 */
export default function Autosave() {
  useEffect(() => {
    const interval = setInterval(async () => {
      const state = useGame.getState();
      try {
        const sb = getSupabase();
        await sb.from("campanhas")
          .update({
            doom_vierta: state.vierta,
            doom_esperanca: state.esperanca,
            doom_sina: state.sina,
            pedacos_coletados: state.pedacosColetados,
            flags: state.flags,
            cena_atual: state.scene,
            em_combate: state.emCombate,
          })
          .eq("codigo", "velreth-elite");
      } catch {}
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // Carrega estado inicial no mount
  useEffect(() => {
    (async () => {
      try {
        const sb = getSupabase();
        const { data } = await sb.from("campanhas")
          .select("*")
          .eq("codigo", "velreth-elite")
          .maybeSingle();
        if (!data) return;
        const s = useGame.getState();
        s.setDoomClock("vierta", data.doom_vierta || 0);
        s.setDoomClock("esperanca", data.doom_esperanca ?? 3);
        s.setDoomClock("sina", data.doom_sina || 0);
        if (Array.isArray(data.pedacos_coletados)) {
          for (const p of data.pedacos_coletados) s.addPedaco(p);
        }
        if (data.flags && typeof data.flags === "object") {
          for (const [k, v] of Object.entries(data.flags)) {
            if (v) s.setFlag(k, true);
          }
        }
        if (data.cena_atual) s.setScene(data.cena_atual);
      } catch {}
    })();
  }, []);

  return null;
}
