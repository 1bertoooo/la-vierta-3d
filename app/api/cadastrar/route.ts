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
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
      return NextResponse.json({ ok: false, error: "service_role não configurado no servidor" }, { status: 500 });
    }

    const sb = createClient(url, key, { auth: { persistSession: false } });
    const email = `${cleanNick}@lavierta.app`;

    // Cria user via admin
    const { data, error } = await sb.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { nick: cleanNick },
    });
    if (error) throw error;

    // Cria profile
    if (data.user) {
      await sb.from("profiles").upsert({
        id: data.user.id,
        email,
        nick: cleanNick,
        role: "player",
      });
    }

    return NextResponse.json({ ok: true, email });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Erro" },
      { status: 500 }
    );
  }
}
