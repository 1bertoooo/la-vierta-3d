"use client";

import { useEffect } from "react";
import { getSupabase } from "./supabase";
import { useGame, type RemotePlayer } from "./store";
import { useMyChar } from "./usePlayer";

/**
 * Multiplayer realtime via Supabase broadcast.
 *
 * Cada player publica posição XZ + rotação a cada 100ms (TICK_MS no Player.tsx).
 * Outros clients escutam o channel `vierta-presence` e atualizam state.remotes.
 *
 * Por que broadcast e não postgres_changes:
 * - Movimento gera 10 updates/s/player. Postgres não aguenta isso.
 * - Broadcast é efêmero, perfeito pra estado de presença.
 * - Quando player sai, limpa via `presence_state` event.
 */
export function usePresence() {
  const me = useMyChar();
  const upsertRemote = useGame((s) => s.upsertRemote);
  const removeRemote = useGame((s) => s.removeRemote);
  const myScene = useGame((s) => s.scene);

  useEffect(() => {
    if (!me) return;
    const sb = getSupabase();
    const channel = sb.channel("vierta-presence", {
      config: {
        presence: { key: me.user_id },
        broadcast: { self: false },
      },
    });

    // Recebe posições dos outros
    channel.on("broadcast", { event: "pos" }, (msg) => {
      const p = msg.payload as RemotePlayer;
      upsertRemote({ ...p, last_seen: Date.now() });
    });

    // Quando alguém sai, remove do state
    channel.on("presence", { event: "leave" }, (msg: { leftPresences?: { user_id?: string }[] }) => {
      const left = msg.leftPresences || [];
      for (const p of left) {
        if (p.user_id) removeRemote(p.user_id);
      }
    });

    channel.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        // Track presence pra outros saberem que estou aqui
        await channel.track({
          user_id: me.user_id,
          nick: me.nome,
          classe: me.classe,
        });
      }
    });

    // Listener do evento custom disparado pelo Player.tsx
    const onPos = (e: Event) => {
      const ce = e as CustomEvent<{ x: number; z: number; rotation: number }>;
      const payload: RemotePlayer = {
        user_id: me.user_id,
        nick: me.nome,
        classe: me.classe,
        nome: me.nome,
        retrato_url: me.retrato_url,
        hp_current: me.hp_current,
        hp_max: me.hp_max,
        x: ce.detail.x,
        z: ce.detail.z,
        rotation: ce.detail.rotation,
        scene: myScene,
        last_seen: Date.now(),
      };
      channel.send({ type: "broadcast", event: "pos", payload });
    };
    window.addEventListener("vierta:my-position", onPos);

    return () => {
      window.removeEventListener("vierta:my-position", onPos);
      sb.removeChannel(channel);
    };
  }, [me, upsertRemote, removeRemote, myScene]);

  // Limpa remotes que não enviam posição há > 8s (provavelmente caíram)
  useEffect(() => {
    const interval = setInterval(() => {
      const state = useGame.getState();
      const now = Date.now();
      for (const [uid, r] of Object.entries(state.remotes)) {
        if (now - r.last_seen > 8000) state.removeRemote(uid);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);
}
