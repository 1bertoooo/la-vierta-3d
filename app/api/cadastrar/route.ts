import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const { nick, password } = await req.json();
    if (!nick || !password) {
      return NextResponse.json({ ok: false, error: "nick e senha obrigatórios" }, { status: 400 });
    }
    const cleanNick = String(nick).trim().toLowerCase();
    if (!/^[a-z0-9_]{2,20}$/.test(cleanNick)) {
      return NextResponse.json({ ok: false, error: "nick inválido (2-20, letras/números/underscore)" }, { status: 400 });
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !anon) {
      return NextResponse.json({ ok: false, error: "supabase não configurado" }, { status: 500 });
    }

    const email = `${cleanNick}@lavierta.app`;

    // Tenta primeiro com service_role + admin.createUser (atalho com email já confirmado)
    if (service) {
      try {
        const sbAdmin = createClient(url, service, { auth: { persistSession: false } });
        const { data, error } = await sbAdmin.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: { nick: cleanNick },
        });
        if (!error && data.user) {
          await sbAdmin.from("profiles").upsert({
            id: data.user.id,
            email,
            nick: cleanNick,
            role: "player",
          });
          return NextResponse.json({ ok: true, email, mode: "admin" });
        }
        // Se admin falhou ("User not allowed" etc), continua pro fallback abaixo
        if (error && !/already|registered|exists/i.test(error.message)) {
          // Loga em produção pra observabilidade
          console.warn("admin.createUser falhou, tentando signUp:", error.message);
        } else if (error && /already|registered|exists/i.test(error.message)) {
          return NextResponse.json({ ok: false, error: "nick já cadastrado" }, { status: 409 });
        }
      } catch (e) {
        console.warn("admin.createUser exception:", e);
      }
    }

    // Fallback: signUp público com anon key (depende de email confirmation OFF nas settings)
    const sbAnon = createClient(url, anon, { auth: { persistSession: false } });
    const { data, error } = await sbAnon.auth.signUp({
      email,
      password,
      options: { data: { nick: cleanNick } },
    });
    if (error) {
      if (/already|registered|exists/i.test(error.message)) {
        return NextResponse.json({ ok: false, error: "nick já cadastrado" }, { status: 409 });
      }
      throw error;
    }

    // Cria profile via admin (se disponível) — sem isso, RLS pode bloquear o INSERT
    if (data.user && service) {
      try {
        const sbAdmin = createClient(url, service, { auth: { persistSession: false } });
        await sbAdmin.from("profiles").upsert({
          id: data.user.id,
          email,
          nick: cleanNick,
          role: "player",
        });
      } catch {}
    }

    return NextResponse.json({ ok: true, email, mode: "signup" });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Erro" },
      { status: 500 }
    );
  }
}
