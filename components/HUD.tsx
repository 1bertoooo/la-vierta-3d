"use client";

import { useGame } from "@/lib/store";
import { useMyChar } from "@/lib/usePlayer";
import { CLASSES } from "@/lib/classes";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase";

/**
 * Overlay HUD por cima do canvas 3D.
 * - Topo: doom clocks + pedaços coletados
 * - Canto inferior esquerdo: ficha minimal (HP, classe, trait)
 * - Canto inferior direito: lista de jogadores online
 * - Canto superior direito: botão sair
 */
export default function HUD() {
  const router = useRouter();
  const me = useMyChar();
  const remotes = useGame((s) => s.remotes);
  const vierta = useGame((s) => s.vierta);
  const esperanca = useGame((s) => s.esperanca);
  const sina = useGame((s) => s.sina);
  const pedacos = useGame((s) => s.pedacosColetados);
  const scene = useGame((s) => s.scene);

  const cls = me ? CLASSES[me.classe] : null;
  const playerCount = Object.keys(remotes).length + 1;

  async function logout() {
    await getSupabase().auth.signOut();
    router.push("/");
  }

  return (
    <>
      {/* Top — Doom clocks */}
      <div className="absolute top-0 left-0 right-0 z-10 px-4 py-2 flex justify-between items-center text-xs">
        <div className="flex gap-4 text-[var(--color-pergaminho-velho)] uppercase tracking-widest">
          <span title="A Vierta acorda">🌑 {vierta}/12</span>
          <span title="Esperança da Élite">✨ {esperanca}/6</span>
          <span title="Sina da Pandórica">💀 {sina}/6</span>
          {pedacos.length > 0 && (
            <span className="text-[var(--color-dourado)]">
              Pedaços: {pedacos.length}/5
            </span>
          )}
        </div>
        <div className="flex gap-3 items-center">
          <span className="text-[var(--color-pergaminho-velho)] uppercase tracking-widest">
            {playerCount} {playerCount === 1 ? "online" : "online"}
          </span>
          <button
            onClick={logout}
            className="text-[var(--color-pergaminho-velho)] hover:text-[var(--color-sangue)] uppercase tracking-widest"
          >
            Sair
          </button>
        </div>
      </div>

      {/* Bottom-left — Ficha mini */}
      {me && cls && (
        <div className="absolute bottom-3 left-3 z-10 bg-[var(--color-carvao)]/85 border border-[var(--color-pergaminho-velho)]/30 rounded px-3 py-2 text-xs flex items-center gap-3">
          {me.retrato_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={me.retrato_url}
              alt={me.nome}
              className="w-12 h-12 rounded-full object-cover border border-[var(--color-dourado)]/40"
            />
          ) : (
            <span
              className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
              style={{ background: cls.color + "40" }}
            >
              {cls.emoji}
            </span>
          )}
          <div>
            <div className="text-[var(--color-dourado)] font-[family-name:var(--font-cinzel)] uppercase tracking-widest">
              {me.nome}
            </div>
            <div className="text-[var(--color-pergaminho-velho)]">{cls.nome}</div>
            <div className="text-[var(--color-sangue)]">
              ❤ {me.hp_current}/{me.hp_max}
            </div>
          </div>
        </div>
      )}

      {/* Bottom-center — controle hint */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 text-[10px] text-[var(--color-pergaminho-velho)]/60 uppercase tracking-widest text-center">
        WASD pra mover · Cena: {scene}
      </div>
    </>
  );
}
