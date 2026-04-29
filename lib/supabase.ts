import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (_client) return _client;
  _client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        storage: typeof window !== "undefined" ? window.localStorage : undefined,
        storageKey: "lavierta3d-auth",
      },
      realtime: { params: { eventsPerSecond: 30 } }, // mais alto pra movimento de personagem
    }
  );
  return _client;
}

export type Profile = {
  id: string;
  email: string;
  nick: string | null;
  role: "admin" | "player";
  avatar_url: string | null;
  created_at: string;
};

export type Classe = "guerreira" | "mago" | "ladina" | "clerigo";

export type Personagem = {
  id: string;
  user_id: string;
  campaign_id: string;
  classe: Classe;
  nome: string;
  retrato_url: string | null;
  hp_current: number;
  hp_max: number;
  position_x: number;
  position_y: number;
  position_z: number;
  current_scene: string;
  created_at: string;
};
