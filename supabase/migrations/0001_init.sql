-- La Vierta 3D — Schema inicial.
-- Reusa profiles do projeto antigo (mesmo Supabase). Adiciona:
--   - campanhas: 1 campanha "velreth-elite" por enquanto
--   - personagens: 1 por user (classe fixa, nome+retrato customizáveis)
--   - cenas_estado: estado das cenas (pedaços coletados, flags, doom clocks) — global pra Élite
--   - dialogos_log: histórico de diálogos disparados (pra evitar repetir)

-- 1. profiles (se não existir, cria; se existir do projeto antigo, mantém)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  nick text UNIQUE,
  role text NOT NULL DEFAULT 'player' CHECK (role IN ('admin', 'player')),
  avatar_url text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "profiles_self_read" ON public.profiles FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "profiles_self_update" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. campanhas (uma só por enquanto: "velreth-elite")
CREATE TABLE IF NOT EXISTS public.campanhas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo text UNIQUE NOT NULL,
  nome text NOT NULL,
  doom_vierta integer DEFAULT 0,
  doom_esperanca integer DEFAULT 3,
  doom_sina integer DEFAULT 0,
  pedacos_coletados text[] DEFAULT ARRAY[]::text[],
  flags jsonb DEFAULT '{}'::jsonb,
  cena_atual text DEFAULT 'praca',
  em_combate boolean DEFAULT false,
  criada_em timestamptz DEFAULT now()
);
ALTER TABLE public.campanhas ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "campanhas_read" ON public.campanhas FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "campanhas_update_admin" ON public.campanhas FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

-- 3. personagens
CREATE TABLE IF NOT EXISTS public.personagens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  campaign_id uuid REFERENCES public.campanhas(id) ON DELETE CASCADE,
  classe text NOT NULL CHECK (classe IN ('guerreira', 'mago', 'ladina', 'clerigo')),
  nome text NOT NULL,
  retrato_url text,
  hp_current integer NOT NULL DEFAULT 0,
  hp_max integer NOT NULL DEFAULT 0,
  position_x real DEFAULT 0,
  position_y real DEFAULT 0,
  position_z real DEFAULT 0,
  current_scene text DEFAULT 'praca',
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id, campaign_id)
);
ALTER TABLE public.personagens ENABLE ROW LEVEL SECURITY;
-- Todo mundo vê todos os personagens da campanha (player visibility).
CREATE POLICY IF NOT EXISTS "personagens_read_all" ON public.personagens FOR SELECT USING (true);
-- Player só pode INSERT/UPDATE o próprio.
CREATE POLICY IF NOT EXISTS "personagens_insert_self" ON public.personagens FOR INSERT
  WITH CHECK (user_id = auth.uid());
CREATE POLICY IF NOT EXISTS "personagens_update_self" ON public.personagens FOR UPDATE
  USING (user_id = auth.uid());
-- Admin pode tudo.
CREATE POLICY IF NOT EXISTS "personagens_admin_all" ON public.personagens FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

-- 4. dialogos_log (histórico de diálogos disparados na campanha)
CREATE TABLE IF NOT EXISTS public.dialogos_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid REFERENCES public.campanhas(id) ON DELETE CASCADE,
  npc_id text NOT NULL,
  topic_id text NOT NULL,
  player_id uuid REFERENCES auth.users(id),
  ts timestamptz DEFAULT now()
);
ALTER TABLE public.dialogos_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "dialogos_log_read" ON public.dialogos_log FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "dialogos_log_insert" ON public.dialogos_log FOR INSERT WITH CHECK (true);

-- 5. Seed: cria a campanha velreth-elite se não existir
INSERT INTO public.campanhas (codigo, nome) VALUES ('velreth-elite', 'A Maldição de Bruna LaVierta')
ON CONFLICT (codigo) DO NOTHING;

-- 6. RLS pra realtime broadcast (público, mas auth-only)
-- Realtime do supabase usa schema próprio; pra broadcast funcionar com persistSession, basta auth ok.
