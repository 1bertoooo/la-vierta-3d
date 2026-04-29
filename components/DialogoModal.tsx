"use client";

import { useState, useEffect } from "react";
import { useGame } from "@/lib/store";
import { useMyChar } from "@/lib/usePlayer";
import { getNPC, type DialogoOpcao } from "@/lib/dialogos";
import { avaliarCondicao } from "@/lib/conditions";

/**
 * Modal de diálogo. Renderiza o tópico atual do NPC ativo.
 * Player escolhe opção → muda tópico, aplica side effects (flag, pedaco, clock).
 *
 * Ações suportadas (DialogoOpcao):
 * - next: ir pro próximo tópico
 * - end: fechar modal
 * - set_flag: marcar flag global
 * - give_pedaco: adicionar pedaço ao state
 * - clock: incrementar doom clock
 * - goto_scene: trocar cena (TODO: implementar transição)
 * - start_combat: stub (TODO: ligar combate)
 */
export default function DialogoModal() {
  const me = useMyChar();
  const dialogoAtivo = useGame((s) => s.dialogoAtivo);
  const abrirDialogo = useGame((s) => s.abrirDialogo);
  const setFlag = useGame((s) => s.setFlag);
  const addPedaco = useGame((s) => s.addPedaco);
  const addItem = useGame((s) => s.addItem);
  const setDoomClock = useGame((s) => s.setDoomClock);
  const setScene = useGame((s) => s.setScene);
  const setFinal = useGame((s) => s.setFinal);

  const [topicId, setTopicId] = useState<string>("");

  const npc = dialogoAtivo ? getNPC(dialogoAtivo) : null;
  const topic = npc && topicId ? npc.topics[topicId] : null;

  // Quando abre um NPC, vai pro tópico default
  useEffect(() => {
    if (npc) {
      // Lógica especial: se Sérgio e player coletou coração, vai pro topic dele
      const state = useGame.getState();
      if (npc.id === "sergio" && state.pedacosColetados.includes("coracao") && !state.flags["sergio_deu_lagrima"]) {
        setTopicId("coracao_obtido");
        setFlag("sergio_deu_lagrima", true);
        return;
      }
      if (npc.id === "bia" && state.pedacosColetados.includes("mao") && !state.flags["bia_apos_pedaco"]) {
        setTopicId("apos_pedaco");
        setFlag("bia_apos_pedaco", true);
        return;
      }
      if (npc.id === "walber" && state.pedacosColetados.includes("voz") && !state.flags["walber_deu_chave"]) {
        setTopicId("apos_voz");
        setFlag("walber_deu_chave", true);
        return;
      }
      if (npc.id === "anderson" && state.pedacosColetados.length === 5 && !state.flags["anderson_finale"]) {
        setTopicId("todos_pedacos");
        setFlag("anderson_finale", true);
        return;
      }
      setTopicId(npc.default_topic);
    } else {
      setTopicId("");
    }
  }, [npc, setFlag]);

  // Aplica on_enter quando tópico muda
  useEffect(() => {
    if (!topic?.on_enter) return;
    if (topic.on_enter.set_flag) setFlag(topic.on_enter.set_flag, true);
    if (topic.on_enter.clock) {
      const state = useGame.getState();
      if (topic.on_enter.clock.vierta) setDoomClock("vierta", Math.min(12, state.vierta + topic.on_enter.clock.vierta));
      if (topic.on_enter.clock.esperanca) setDoomClock("esperanca", Math.min(6, state.esperanca + topic.on_enter.clock.esperanca));
      if (topic.on_enter.clock.sina) setDoomClock("sina", Math.min(6, state.sina + topic.on_enter.clock.sina));
    }
    // intentionally only run on topic id change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicId]);

  if (!npc || !topic) return null;

  function handleOption(opt: DialogoOpcao) {
    if (opt.set_flag) setFlag(opt.set_flag, true);
    if (opt.give_pedaco) addPedaco(opt.give_pedaco);
    if (opt.give_item) addItem(opt.give_item);
    if (opt.clock) {
      const state = useGame.getState();
      if (opt.clock.vierta) setDoomClock("vierta", Math.min(12, state.vierta + opt.clock.vierta));
      if (opt.clock.esperanca) setDoomClock("esperanca", Math.min(6, state.esperanca + opt.clock.esperanca));
      if (opt.clock.sina) setDoomClock("sina", Math.min(6, state.sina + opt.clock.sina));
    }

    // Combate: dispara via custom event consumido pelo /jogar
    if (opt.start_combat) {
      window.dispatchEvent(new CustomEvent("vierta:start-combat", { detail: opt.start_combat }));
    }

    // Cena / final: troca cena ou marca final escolhido
    if (opt.goto_scene) {
      if (opt.goto_scene.startsWith("final_")) {
        setFinal(opt.goto_scene.replace("final_", "") as "matar" | "prender" | "redimir");
        setScene("epilogo");
      } else {
        setScene(opt.goto_scene);
      }
    }

    if (opt.end) {
      abrirDialogo(null);
    } else if (opt.next) {
      setTopicId(opt.next);
    }
  }

  // Filtra opções por condição
  const optionsVisiveis = (topic.options || []).filter((o) => avaliarCondicao(o.if, me?.classe));

  return (
    <div className="fixed inset-0 z-30 bg-black/70 flex items-end sm:items-center justify-center px-3 pb-3 sm:pb-0">
      <div className="w-full max-w-2xl bg-[var(--color-carvao)] border border-[var(--color-dourado)]/40 rounded-lg p-5 shadow-2xl">
        <div className="flex items-baseline justify-between mb-3 border-b border-[var(--color-pergaminho-velho)]/20 pb-2">
          <h3
            className="text-lg uppercase tracking-widest text-[var(--color-dourado)]"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            {npc.nome}
          </h3>
          <button
            onClick={() => abrirDialogo(null)}
            className="text-[var(--color-pergaminho-velho)] hover:text-[var(--color-sangue)] text-xl leading-none"
          >
            ×
          </button>
        </div>
        <p className="text-[var(--color-pergaminho)] leading-relaxed whitespace-pre-wrap text-base mb-4">
          {topic.text}
        </p>
        <div className="space-y-2">
          {optionsVisiveis.length === 0 ? (
            <button
              onClick={() => abrirDialogo(null)}
              className="w-full text-left px-3 py-2 border border-[var(--color-pergaminho-velho)]/30 hover:border-[var(--color-dourado)]/60 rounded text-[var(--color-pergaminho)]"
            >
              [Sair]
            </button>
          ) : (
            optionsVisiveis.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleOption(opt)}
                className="w-full text-left px-3 py-2 border border-[var(--color-pergaminho-velho)]/30 hover:border-[var(--color-dourado)]/60 hover:bg-[var(--color-dourado)]/10 rounded text-[var(--color-pergaminho)] transition"
              >
                {opt.label}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
