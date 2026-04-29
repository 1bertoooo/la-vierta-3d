/**
 * Sistema de diálogos branching, fixo, sem LLM.
 *
 * Cada NPC tem um conjunto de TÓPICOS. Um tópico tem:
 * - text: o que o NPC fala (texto simples ou múltiplos parágrafos com \n\n)
 * - options[]: opções de resposta do player. Cada uma pode:
 *    - apontar pro próximo tópico (next)
 *    - exigir condição (if: "flag:nome" ou "has:item" ou "pedaco:coracao")
 *    - setar flag (set_flag)
 *    - dar item (give_item)
 *    - dar pedaço (give_pedaco)
 *    - mudar doom clock (clock: { vierta?: +1, esperanca?: +1, sina?: +1 })
 *    - encerrar diálogo (end: true)
 *    - mudar cena (goto_scene)
 *    - iniciar combate (start_combat: "encontro_id")
 */

export type DialogoOpcao = {
  label: string;
  next?: string;
  if?: string; // condição: "flag:nome", "pedaco:coracao", "has:item:X"
  set_flag?: string; // ex: "sergio_sabe_bruna"
  give_item?: string;
  give_pedaco?: "coracao" | "olho" | "voz" | "mao" | "sombra";
  clock?: { vierta?: number; esperanca?: number; sina?: number };
  end?: boolean;
  goto_scene?: string;
  start_combat?: string;
};

export type DialogoTopic = {
  text: string;
  options?: DialogoOpcao[];
  on_enter?: { set_flag?: string; clock?: { vierta?: number; esperanca?: number; sina?: number } };
  // Se options vazio, mostra "Sair" automático.
};

export type DialogoNPC = {
  id: string;
  nome: string;
  classe?: "aliado" | "neutro" | "antagonista";
  default_topic: string;
  topics: Record<string, DialogoTopic>;
};

import sergio from "@/data/dialogos/sergio";
import anderson from "@/data/dialogos/anderson";
import walber from "@/data/dialogos/walber";
import bia from "@/data/dialogos/bia";
import diego from "@/data/dialogos/diego";
import leticia from "@/data/dialogos/leticia";
import janaina from "@/data/dialogos/janaina";

export const NPCS: Record<string, DialogoNPC> = {
  sergio,
  anderson,
  walber,
  bia,
  diego,
  leticia,
  janaina,
};

export function getNPC(id: string): DialogoNPC | null {
  return NPCS[id] || null;
}
