"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase";

export default function Landing() {
  const router = useRouter();
  const [logado, setLogado] = useState<boolean | null>(null);

  useEffect(() => {
    const sb = getSupabase();
    sb.auth.getSession().then(({ data }) => {
      setLogado(!!data.session);
    });
  }, []);

  return (
    <main
      className="h-screen w-screen flex items-center justify-center text-center px-6 relative overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at center, #2a1a14 0%, #1a1612 60%, #0a0808 100%)",
      }}
    >
      <div className="relative z-10 max-w-2xl">
        <h1
          className="text-5xl sm:text-7xl mb-2 text-[var(--color-dourado)] tracking-widest"
          style={{ fontFamily: "var(--font-cinzel)" }}
        >
          LA VIERTA
        </h1>
        <p
          className="text-xl sm:text-2xl text-[var(--color-pergaminho-velho)] italic mb-8"
          style={{ fontFamily: "var(--font-cormorant)" }}
        >
          O Despertar de Bruna
        </p>
        <p className="text-[var(--color-pergaminho)] text-base sm:text-lg leading-relaxed mb-10 max-w-lg mx-auto">
          A cidade de Velreth acordou com o cheiro de cinzas e um bilhete na soleira de
          cada casa: <span className="italic text-[var(--color-sangue)]">"estou em pedacinhos."</span> Bruna a Pandórica voltou. Você tem uma noite — só uma — pra
          encontrar os 5 pedaços antes que ela desabe a cidade.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {logado ? (
            <button
              onClick={() => router.push("/jogar")}
              className="px-8 py-3 bg-[var(--color-dourado)]/20 border border-[var(--color-dourado)] text-[var(--color-dourado-claro)] uppercase tracking-widest hover:bg-[var(--color-dourado)]/40 transition"
            >
              Continuar
            </button>
          ) : (
            <>
              <Link
                href="/cadastro"
                className="px-8 py-3 bg-[var(--color-vinho)]/40 border border-[var(--color-sangue)] text-[var(--color-pergaminho)] uppercase tracking-widest hover:bg-[var(--color-vinho)]/60 transition"
              >
                Entrar na Élite
              </Link>
              <Link
                href="/login"
                className="px-8 py-3 border border-[var(--color-pergaminho-velho)]/40 text-[var(--color-pergaminho-velho)] uppercase tracking-widest hover:border-[var(--color-dourado)] hover:text-[var(--color-dourado)] transition"
              >
                Já tenho conta
              </Link>
            </>
          )}
        </div>
        <p className="text-xs text-[var(--color-pedra)] uppercase tracking-widest mt-12">
          versão 0.1 · só pra Élite
        </p>
      </div>
    </main>
  );
}
