"use client";

import { useState } from "react";
import { useGame } from "@/lib/store";
import { useMyChar } from "@/lib/usePlayer";
import { CLASSES } from "@/lib/classes";

/**
 * Stub de combate turn-based. Tela cheia overlay.
 * Loop simples:
 *  1. Player escolhe ação (Atacar / Habilidade / Item / Fugir)
 *  2. Dado rola: 1d20 + modificador. Acerta se ≥ AC do inimigo.
 *  3. Dano: rolagem da arma + atributo.
 *  4. Inimigo ataca de volta. Mesma fórmula.
 *  5. Repete até HP de um lado = 0.
 *
 * Pra iniciar: NPC.dialogo opt.start_combat = "encontro_id"
 * Encontros pré-definidos abaixo.
 */

type Inimigo = {
  id: string;
  nome: string;
  hp_max: number;
  ac: number;
  ataque_bonus: number;
  ataque_dado: string; // ex: "1d8+3"
  cor: string;
};

const ENCONTROS: Record<string, Inimigo> = {
  sombra_adega: {
    id: "sombra_adega",
    nome: "Sombra de Bruna",
    hp_max: 10,
    ac: 12,
    ataque_bonus: 3,
    ataque_dado: "1d6",
    cor: "#3a1a4a",
  },
  bia_possessa: {
    id: "bia_possessa",
    nome: "Bia possessa",
    hp_max: 25,
    ac: 14,
    ataque_bonus: 5,
    ataque_dado: "1d8+3",
    cor: "#7a3a5a",
  },
  leticia_hostil: {
    id: "leticia_hostil",
    nome: "Letícia hostil",
    hp_max: 20,
    ac: 13,
    ataque_bonus: 4,
    ataque_dado: "1d10",
    cor: "#a52a2a",
  },
  bruna_inteira: {
    id: "bruna_inteira",
    nome: "Bruna a Pandórica",
    hp_max: 60,
    ac: 16,
    ataque_bonus: 7,
    ataque_dado: "1d10+4",
    cor: "#7a3aa0",
  },
};

function rolarDado(expr: string): { total: number; rolls: number[] } {
  // expr tipo "1d8+3" ou "1d20"
  const m = expr.match(/(\d+)d(\d+)([+-]\d+)?/);
  if (!m) return { total: 0, rolls: [] };
  const n = parseInt(m[1]);
  const faces = parseInt(m[2]);
  const mod = m[3] ? parseInt(m[3]) : 0;
  const rolls: number[] = [];
  let total = mod;
  for (let i = 0; i < n; i++) {
    const r = 1 + Math.floor(Math.random() * faces);
    rolls.push(r);
    total += r;
  }
  return { total, rolls };
}

export default function Combate({ encontroId, onFim }: { encontroId: string; onFim: () => void }) {
  const me = useMyChar();
  const inimigo = ENCONTROS[encontroId];
  const cls = me ? CLASSES[me.classe] : null;

  const [hpJogador, setHpJogador] = useState(me?.hp_current ?? 10);
  const [hpInimigo, setHpInimigo] = useState(inimigo?.hp_max ?? 10);
  const [log, setLog] = useState<string[]>([]);
  const [turno, setTurno] = useState<"player" | "inimigo">("player");
  const [acabou, setAcabou] = useState(false);

  if (!inimigo || !me || !cls) {
    return null;
  }

  function logLinha(s: string) {
    setLog((l) => [...l.slice(-9), s]);
  }

  function atacar() {
    if (turno !== "player" || acabou) return;
    const ataque = rolarDado("1d20+4"); // simplificação — mod fixo +4
    if (ataque.total >= inimigo.ac) {
      const dano = rolarDado("1d8+3");
      const novoHp = Math.max(0, hpInimigo - dano.total);
      setHpInimigo(novoHp);
      logLinha(`Tu acertou (${ataque.total} vs AC ${inimigo.ac}) e causou ${dano.total} de dano.`);
      if (novoHp === 0) {
        logLinha(`${inimigo.nome} caiu.`);
        setAcabou(true);
        setTimeout(onFim, 2000);
        return;
      }
    } else {
      logLinha(`Tu errou (${ataque.total} vs AC ${inimigo.ac}).`);
    }
    setTurno("inimigo");
    setTimeout(turnoInimigo, 1200);
  }

  function turnoInimigo() {
    const ataque = rolarDado("1d20" + (inimigo.ataque_bonus >= 0 ? "+" : "") + inimigo.ataque_bonus);
    if (ataque.total >= 12) { // AC do player simplificada
      const dano = rolarDado(inimigo.ataque_dado);
      const novoHp = Math.max(0, hpJogador - dano.total);
      setHpJogador(novoHp);
      logLinha(`${inimigo.nome} acertou (${ataque.total}) e causou ${dano.total} de dano.`);
      if (novoHp === 0) {
        logLinha("Tu caiu inconsciente.");
        setAcabou(true);
        setTimeout(onFim, 2500);
        return;
      }
    } else {
      logLinha(`${inimigo.nome} errou (${ataque.total}).`);
    }
    setTurno("player");
  }

  function fugir() {
    if (turno !== "player" || acabou) return;
    const r = rolarDado("1d20");
    if (r.total >= 10) {
      logLinha("Tu fugiu.");
      setAcabou(true);
      setTimeout(onFim, 1500);
    } else {
      logLinha("Tu não conseguiu fugir.");
      setTurno("inimigo");
      setTimeout(turnoInimigo, 1200);
    }
  }

  return (
    <div className="fixed inset-0 z-40 bg-black/85 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-2xl border border-[var(--color-sangue)]/60 rounded-lg p-5 bg-[var(--color-carvao)] shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl text-[var(--color-sangue)]" style={{ fontFamily: "var(--font-cinzel)" }}>
            ⚔ {inimigo.nome}
          </h2>
          <span className="text-xs uppercase tracking-widest text-[var(--color-pergaminho-velho)]">
            {turno === "player" ? "Tua vez" : "Vez do inimigo"}
          </span>
        </div>

        {/* Barras HP */}
        <div className="space-y-2 mb-4">
          <div>
            <div className="text-xs text-[var(--color-pergaminho-velho)] flex justify-between">
              <span>{me.nome} ({cls.nome})</span>
              <span>{hpJogador}/{me.hp_max}</span>
            </div>
            <div className="h-2 bg-[var(--color-carvao)] border border-[var(--color-pergaminho-velho)]/30 rounded">
              <div
                className="h-full bg-[var(--color-sangue)] rounded transition-all"
                style={{ width: `${(hpJogador / me.hp_max) * 100}%` }}
              />
            </div>
          </div>
          <div>
            <div className="text-xs text-[var(--color-pergaminho-velho)] flex justify-between">
              <span>{inimigo.nome}</span>
              <span>{hpInimigo}/{inimigo.hp_max}</span>
            </div>
            <div className="h-2 bg-[var(--color-carvao)] border border-[var(--color-pergaminho-velho)]/30 rounded">
              <div
                className="h-full rounded transition-all"
                style={{
                  width: `${(hpInimigo / inimigo.hp_max) * 100}%`,
                  background: inimigo.cor,
                }}
              />
            </div>
          </div>
        </div>

        {/* Log */}
        <div className="bg-[var(--color-carvao)]/60 border border-[var(--color-pergaminho-velho)]/20 rounded p-3 h-32 overflow-y-auto mb-4 text-sm text-[var(--color-pergaminho)] space-y-1">
          {log.length === 0 ? (
            <p className="text-[var(--color-pergaminho-velho)] italic">A batalha começa...</p>
          ) : (
            log.map((l, i) => <p key={i}>{l}</p>)
          )}
        </div>

        {/* Ações */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={atacar}
            disabled={turno !== "player" || acabou}
            className="px-4 py-2 bg-[var(--color-sangue)]/40 border border-[var(--color-sangue)] text-[var(--color-pergaminho)] uppercase tracking-widest hover:bg-[var(--color-sangue)]/60 disabled:opacity-30"
          >
            ⚔ Atacar
          </button>
          <button
            onClick={fugir}
            disabled={turno !== "player" || acabou}
            className="px-4 py-2 border border-[var(--color-pergaminho-velho)]/40 text-[var(--color-pergaminho-velho)] uppercase tracking-widest hover:border-[var(--color-dourado)] disabled:opacity-30"
          >
            ⚡ Fugir
          </button>
        </div>
      </div>
    </div>
  );
}
