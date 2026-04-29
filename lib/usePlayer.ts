"use client";

import { useEffect, useState } from "react";
import { getSupabase, type Personagem } from "./supabase";

/**
 * Hook que devolve o personagem do user logado na campanha atual.
 * Carrega 1x e cacheia em estado local.
 */
export function useMyChar() {
  const [char, setChar] = useState<Personagem | null>(null);

  useEffect(() => {
    const sb = getSupabase();
    let cancelled = false;
    (async () => {
      const { data: { user } } = await sb.auth.getUser();
      if (!user || cancelled) return;
      const { data } = await sb.from("personagens")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (!cancelled && data) setChar(data as Personagem);
    })();
    return () => { cancelled = true; };
  }, []);

  return char;
}
