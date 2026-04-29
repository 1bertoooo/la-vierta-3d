"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { getSupabase } from "@/lib/supabase";

export default function Login() {
  const router = useRouter();
  const params = useSearchParams();
  const [nick, setNick] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const n = params.get("nick");
    if (n) setNick(n);
  }, [params]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setLoading(true);
    try {
      const sb = getSupabase();
      const email = `${nick.trim().toLowerCase()}@lavierta.app`;
      const { error } = await sb.auth.signInWithPassword({ email, password: senha });
      if (error) throw error;
      router.push("/jogar");
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="h-screen w-screen flex items-center justify-center px-6">
      <form
        onSubmit={submit}
        className="w-full max-w-sm border border-[var(--color-pergaminho-velho)]/40 p-6 rounded bg-[var(--color-carvao)]/80"
      >
        <h1
          className="text-3xl text-[var(--color-dourado)] mb-1"
          style={{ fontFamily: "var(--font-cinzel)" }}
        >
          Voltar à Élite
        </h1>
        <p className="text-[var(--color-pergaminho-velho)] text-sm mb-6">
          Entre com o nick que cadastrou.
        </p>
        <label className="block text-xs uppercase tracking-widest text-[var(--color-pergaminho-velho)] mb-1">
          Nick
        </label>
        <input
          value={nick}
          onChange={(e) => setNick(e.target.value)}
          required
          className="w-full px-3 py-2 mb-3 bg-[var(--color-carvao)] border border-[var(--color-pergaminho-velho)]/40 rounded text-[var(--color-pergaminho)]"
        />
        <label className="block text-xs uppercase tracking-widest text-[var(--color-pergaminho-velho)] mb-1">
          Senha
        </label>
        <input
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
          className="w-full px-3 py-2 mb-4 bg-[var(--color-carvao)] border border-[var(--color-pergaminho-velho)]/40 rounded text-[var(--color-pergaminho)]"
        />
        {erro && <p className="text-[var(--color-sangue)] text-xs mb-3">{erro}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-[var(--color-vinho)]/40 border border-[var(--color-sangue)] text-[var(--color-pergaminho)] uppercase tracking-widest hover:bg-[var(--color-vinho)]/60 disabled:opacity-50"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
        <p className="mt-4 text-xs text-[var(--color-pergaminho-velho)] text-center">
          Novo aqui?{" "}
          <Link href="/cadastro" className="text-[var(--color-dourado)] hover:underline">
            Cadastrar
          </Link>
        </p>
      </form>
    </main>
  );
}
