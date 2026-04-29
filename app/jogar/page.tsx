"use client";

export const dynamic = "force-dynamic";

import dynamicImport from "next/dynamic";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import { useMyChar } from "@/lib/usePlayer";
import { usePresence } from "@/lib/usePresence";
import { useGame } from "@/lib/store";
import HUD from "@/components/HUD";
import DialogoModal from "@/components/DialogoModal";
import QuestPanel from "@/components/QuestPanel";
import Combate from "@/components/Combate";
import Autosave from "@/components/Autosave";
import InteractKey from "@/components/InteractKey";
import { EpilogoOverlay } from "@/components/cenas/Epilogo";

const Cena = dynamicImport(() => import("@/components/Cena"), { ssr: false });

export default function Jogar() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const me = useMyChar();
  const emCombate = useGame((s) => s.emCombate);
  const setEmCombate = useGame((s) => s.setEmCombate);
  const [encontroAtivo, setEncontroAtivo] = useState<string | null>(null);

  usePresence();

  // Bloqueia scroll do body só enquanto está na cena 3D (canvas precisa do gesture)
  useEffect(() => {
    document.body.classList.add("no-scroll");
    return () => document.body.classList.remove("no-scroll");
  }, []);

  useEffect(() => {
    const sb = getSupabase();
    sb.auth.getSession().then(({ data }) => {
      if (!data.session) router.push("/login");
      else setAuthChecked(true);
    });
  }, [router]);

  // Hint: dialogo opt.start_combat → seta encontroAtivo
  // (Por enquanto, dispatch via custom event do DialogoModal — ainda não conectado;
  // simulação manual via window.__startCombat se quiser testar)
  useEffect(() => {
    const onStart = (e: Event) => {
      const ce = e as CustomEvent<string>;
      setEncontroAtivo(ce.detail);
      setEmCombate(true);
    };
    window.addEventListener("vierta:start-combat", onStart);
    return () => window.removeEventListener("vierta:start-combat", onStart);
  }, [setEmCombate]);

  if (!authChecked) {
    return (
      <main className="h-screen w-screen flex items-center justify-center text-[var(--color-pergaminho-velho)]">
        Invocando...
      </main>
    );
  }

  if (!me) {
    return (
      <main className="h-screen w-screen flex flex-col items-center justify-center text-[var(--color-pergaminho-velho)] gap-3 px-6">
        <p className="text-lg">Você ainda não tem personagem nessa Élite.</p>
        <button
          onClick={() => router.push("/criar-personagem")}
          className="px-6 py-2 border border-[var(--color-dourado)] text-[var(--color-dourado-claro)] uppercase tracking-widest hover:bg-[var(--color-dourado)]/20"
        >
          Criar personagem
        </button>
      </main>
    );
  }

  return (
    <main className="h-screen w-screen relative">
      <Cena />
      <HUD />
      <QuestPanel />
      <DialogoModal />
      <Autosave />
      <InteractKey />
      <EpilogoOverlay />
      {emCombate && encontroAtivo && (
        <Combate
          encontroId={encontroAtivo}
          onFim={() => {
            setEmCombate(false);
            setEncontroAtivo(null);
          }}
        />
      )}
    </main>
  );
}
