"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import { CLASSES, type Classe } from "@/lib/classes";

/**
 * Tela de criação de personagem.
 * - 4 classes pré-definidas (cards visuais)
 * - Player digita nome do personagem (default = nome da classe)
 * - Aparência → gera retrato Pollinations
 */
export default function CriarPersonagem() {
  const router = useRouter();
  const [classe, setClasse] = useState<Classe | null>(null);
  const [nome, setNome] = useState("");
  const [aparencia, setAparencia] = useState("");
  const [retratoUrl, setRetratoUrl] = useState<string | null>(null);
  const [gerando, setGerando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // Quando classe muda, sugere o nome default
  useEffect(() => {
    if (classe && !nome) setNome(CLASSES[classe].defaultName);
  }, [classe, nome]);

  async function gerarRetrato() {
    if (!classe || !aparencia.trim()) return;
    setGerando(true);
    setErro(null);
    try {
      const cls = CLASSES[classe];
      // Limita aparência a 200 chars pra evitar URL longa demais
      const desc = aparencia.trim().slice(0, 200);
      const prompt = `${cls.nome.toLowerCase()} fantasy character portrait, ${desc}, dark fantasy, cinematic, oil painting, brazilian folklore`;
      const seed = Math.floor(Math.random() * 9999);
      const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=512&height=512&seed=${seed}&nologo=true`;
      // Pré-carrega pra confirmar que volta
      const img = new Image();
      img.src = url;
      img.onload = () => {
        setRetratoUrl(url);
        setGerando(false);
      };
      img.onerror = () => {
        setErro("Falha ao gerar retrato. Tenta de novo ou siga sem.");
        setGerando(false);
      };
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro");
      setGerando(false);
    }
  }

  async function salvar() {
    if (!classe || !nome.trim()) return;
    setSalvando(true);
    setErro(null);
    try {
      const sb = getSupabase();
      const { data: { user } } = await sb.auth.getUser();
      if (!user) throw new Error("não autenticado");
      // Pega campanha default (a única, "velreth-elite")
      const { data: camp } = await sb.from("campanhas").select("id").limit(1).maybeSingle();
      if (!camp) throw new Error("campanha não encontrada — admin precisa criar primeiro");
      const cls = CLASSES[classe];
      const { error } = await sb.from("personagens").insert({
        user_id: user.id,
        campaign_id: camp.id,
        classe,
        nome: nome.trim(),
        retrato_url: retratoUrl,
        hp_current: cls.hpMax,
        hp_max: cls.hpMax,
        position_x: 0,
        position_y: 0,
        position_z: 0,
        current_scene: "praca",
      });
      if (error) throw error;
      router.push("/jogar");
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro");
      setSalvando(false);
    }
  }

  return (
    <main className="min-h-screen w-screen overflow-y-auto p-4 sm:p-8">
      <div className="max-w-3xl mx-auto">
        <h1
          className="text-3xl sm:text-4xl text-[var(--color-dourado)] mb-2 text-center"
          style={{ fontFamily: "var(--font-cinzel)" }}
        >
          Criar personagem
        </h1>
        <p className="text-center text-[var(--color-pergaminho-velho)] text-sm mb-8">
          A Élite tem 4 cadeiras. Escolhe a tua.
        </p>

        {/* Cards de classe */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {(Object.keys(CLASSES) as Classe[]).map((k) => {
            const c = CLASSES[k];
            const sel = classe === k;
            return (
              <button
                key={k}
                onClick={() => setClasse(k)}
                className={`p-3 rounded border text-left transition ${
                  sel
                    ? "border-[var(--color-dourado)] bg-[var(--color-dourado)]/10"
                    : "border-[var(--color-pergaminho-velho)]/30 hover:border-[var(--color-dourado)]/60"
                }`}
                style={sel ? { boxShadow: `0 0 0 1px ${c.color}` } : undefined}
              >
                <div className="text-3xl mb-1">{c.emoji}</div>
                <div
                  className="text-sm uppercase tracking-widest text-[var(--color-pergaminho)]"
                  style={{ fontFamily: "var(--font-cinzel)" }}
                >
                  {c.nome}
                </div>
                <div className="text-[10px] text-[var(--color-pergaminho-velho)] mt-1 italic">
                  &ldquo;{c.bordao}&rdquo;
                </div>
                <div className="text-[10px] text-[var(--color-pergaminho-velho)]/70 mt-1">
                  HP {c.hpMax}
                </div>
              </button>
            );
          })}
        </div>

        {classe && (
          <>
            <div className="border border-[var(--color-pergaminho-velho)]/30 rounded p-4 mb-4 text-sm text-[var(--color-pergaminho)]">
              <p className="mb-1">{CLASSES[classe].description}</p>
              <p className="text-[var(--color-dourado)] mt-2 text-xs uppercase tracking-widest">
                Trait único: {CLASSES[classe].traitName}
              </p>
              <p className="text-xs text-[var(--color-pergaminho-velho)]">
                {CLASSES[classe].trait}
              </p>
            </div>

            <label className="block text-xs uppercase tracking-widest text-[var(--color-pergaminho-velho)] mb-1">
              Nome do personagem
            </label>
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              maxLength={30}
              className="w-full px-3 py-2 mb-3 bg-[var(--color-carvao)] border border-[var(--color-pergaminho-velho)]/40 rounded"
              placeholder={CLASSES[classe].defaultName}
            />

            <label className="block text-xs uppercase tracking-widest text-[var(--color-pergaminho-velho)] mb-1">
              Aparência (descrição curta — máx 200 caracteres)
            </label>
            <textarea
              value={aparencia}
              onChange={(e) => setAparencia(e.target.value.slice(0, 200))}
              rows={2}
              maxLength={200}
              className="w-full px-3 py-2 mb-2 bg-[var(--color-carvao)] border border-[var(--color-pergaminho-velho)]/40 rounded"
              placeholder="ex: pele queimada, cicatriz no olho, jaqueta de couro"
            />
            <p className="text-[10px] text-[var(--color-pergaminho-velho)]/70 mb-3">
              {aparencia.length}/200
            </p>

            <button
              type="button"
              onClick={gerarRetrato}
              disabled={!aparencia.trim() || gerando}
              className="px-4 py-2 mb-4 border border-[var(--color-dourado)]/50 text-[var(--color-dourado-claro)] uppercase tracking-widest hover:bg-[var(--color-dourado)]/20 disabled:opacity-40"
            >
              {gerando ? "Invocando retrato..." : retratoUrl ? "Re-roll retrato" : "Gerar retrato"}
            </button>

            {retratoUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={retratoUrl}
                alt="retrato"
                className="w-48 h-48 rounded mb-4 border border-[var(--color-dourado)]/40 object-cover"
              />
            )}

            {erro && <p className="text-[var(--color-sangue)] text-xs mb-3">{erro}</p>}

            <button
              onClick={salvar}
              disabled={!nome.trim() || salvando}
              className="w-full px-4 py-3 bg-[var(--color-vinho)]/40 border border-[var(--color-sangue)] text-[var(--color-pergaminho)] uppercase tracking-widest hover:bg-[var(--color-vinho)]/60 disabled:opacity-50"
            >
              {salvando ? "Salvando..." : "Selar personagem"}
            </button>
          </>
        )}
      </div>
    </main>
  );
}
