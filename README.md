# La Vierta 3D — O Despertar de Bruna

RPG 3D online pra Élite. Quatro amigos, uma noite, Bruna a Pandórica. Sem IA inventando coisa.

## Stack

- **Next.js 16** (App Router)
- **Three.js + @react-three/fiber + @react-three/drei** — cena 3D isométrica low-poly
- **Zustand** — state global (posição, doom clocks, dialog)
- **Supabase** — Auth, Postgres, Realtime broadcast (multiplayer movement)
- **Pollinations.ai** — retratos dos personagens
- **OpenAI TTS** — gerado UMA vez, MP3 cacheado em Supabase Storage (sem chamada em runtime)
- **Tailwind 4** — UI

## Estrutura atual

```
app/
  page.tsx              # landing
  cadastro/             # criar conta (nick + senha)
  login/                # login (nick + senha)
  criar-personagem/     # escolher classe + nome + retrato
  jogar/                # /jogar — cena 3D + HUD
  api/
    cadastrar/          # endpoint server-side com SUPABASE_SERVICE_ROLE_KEY
components/
  Cena.tsx              # Canvas R3F principal
  Player.tsx            # avatar local + controle WASD
  RemoteAvatars.tsx     # outros 3 jogadores via realtime broadcast
  HUD.tsx               # overlay (doom clocks, ficha mini, online count)
  cenas/
    Praca.tsx           # primeira cena: praça central de Velreth
lib/
  classes.ts            # 4 classes (guerreira/mago/ladina/clérigo)
  store.ts              # Zustand global
  supabase.ts           # client supabase + tipos
  usePlayer.ts          # hook que carrega personagem do user
  usePresence.ts        # multiplayer broadcast XZ + rotation
supabase/migrations/
  0001_init.sql         # profiles, campanhas, personagens, dialogos_log
ROTEIRO.md              # roteiro completo do jogo (5000 palavras, 3 atos, 9 NPCs)
```

## Próximos sprints

- **Sprint Y** — Cenas restantes (taverna, torre, mercado, adega, casa letícia, cadeia, floresta)
- **Sprint Z** — Sistema de diálogo (JSON branching + UI de opções)
- **Sprint AA** — TTS pré-render: gerar 200 MP3s do roteiro e subir pro Storage
- **Sprint AB** — NPCs no mundo (Sergio na Taverna, Anderson na Torre, etc)
- **Sprint AC** — Combate turn-based (UI de turno, ataques pré-definidos)
- **Sprint AD** — Quest tracker e doom clocks reativos
- **Sprint AE** — Salvar progresso na campanha (autosave)
- **Sprint AF** — Polish: música ambiente + chuva + sons UI

## Variáveis de ambiente

```
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...   # só server-side, em /api/cadastrar
```

## Como rodar local

```bash
npm install
npm run dev
```

## Deploy

Vercel auto-deploy ao push pro main. Migration roda no Supabase Studio (SQL editor).
