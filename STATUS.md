# La Vierta 3D — Status

## ✅ Pronto

### Auth + Personagem
- Cadastro/login por nick + senha (`/cadastro`, `/login`).
- Endpoint `/api/cadastrar` cria user via `SUPABASE_SERVICE_ROLE_KEY`.
- Tela de criação de personagem: 4 classes (Guerreira, Mago, Ladina, Clérigo), nome customizável, aparência limitada a 200 chars (resolve bug do retrato com descrição longa), retrato Pollinations gerado client-side.

### Cena 3D — Praça Central de Velreth
- Three.js + React Three Fiber, câmera isométrica, sky noturno, fog atmosférico.
- Chão de paralelepípedo, fonte central, 4 lanternas com `pointLight` quentinha.
- Taverna do Amarelinho (oeste), Torre da Vierta (norte, janela arroxeada pulsando — Bruna), Mercado (leste).
- Player local com avatar capsule + cabeça, controle WASD, lerp suave.
- `OrbitControls` (drag pra rotacionar câmera, scroll pra zoom).

### Multiplayer
- Supabase Realtime broadcast: posição XZ + rotação a cada 100ms.
- Tracking de presence: quando alguém sai, é removido automaticamente em 8s.
- Avatares remotos com lerp suave pra esconder jitter.
- Filtra por `scene` — só vê quem tá na mesma cena.

### Sistema de diálogo (sem LLM)
- 7 NPCs com diálogo branching completo escrito por mim:
  - **Seu Sérgio** (Taverna) — entrega chave da adega + Lágrima de Bruna após coleta.
  - **Mestre Anderson** (Torre) — explica missão, oferece os 3 finais quando todos pedaços coletados.
  - **Walber** (Mercado) — possesso pela Voz, opções por classe (Clérigo/Mago).
  - **Bia** (atrás do Mercado) — anel preto = mão da Bruna, opções (curar/forçar/atacar).
  - **Diego** (mercado) — gem roxa = olho da Bruna, opções por classe.
  - **Letícia** (sul da praça) — sombra no bolso, 3 caminhos (empatia/reciprocar/hostil).
  - **Janaína** (cigana) — visão verdadeira ou mentira.
- Modal renderiza tópico atual + opções filtradas por condição (`flag:`, `classe:`, `pedaco:`, `esperanca:N`).
- Side effects funcionam: `set_flag`, `give_pedaco`, `give_item`, `clock`, `start_combat`, `goto_scene`, `end`.

### NPCs no mundo
- 7 capsules coloridas posicionadas na Praça, cada uma com indicador "!" amarelo flutuante quando o player local está a < 2.5m.
- Click direto OU tecla **E** quando próximo abre o diálogo.
- NPC olha pro player automaticamente quando dist < 6m.

### Doom Clocks
- 3 contadores no topo: 🌑 Vierta (0/12), ✨ Esperança (3/6), 💀 Sina (0/6).
- Sobem/descem por escolhas de diálogo.
- Esperança ≥ 5 destrava o final de Redenção.

### Quest Panel
- Canto superior direito, dobrável.
- Mostra os 5 pedaços (✓ verde quando coletado), local de cada um.
- Próximo objetivo dinâmico baseado em flags + pedaços.

### Combate (stub funcional)
- Modal overlay com barras HP, log de batalha, botões Atacar/Fugir.
- 1d20+4 pra acerto, 1d8+3 pra dano. Inimigo retalha.
- 4 encontros pré-definidos: `sombra_adega`, `bia_possessa`, `leticia_hostil`, `bruna_inteira`.
- Disparado via `start_combat` em diálogo OU click em garrafa do coração na adega.

### Adega (cena 2)
- Subterrâneo com prateleiras de garrafas pulsando azulado (sussurros).
- Garrafa central vermelha gira e pulsa (Coração da Bruna).
- Aproximar + tecla E coleta o pedaço E dispara combate com Sombra de Bruna.

### Epílogo (3 finais)
- Final escolhido via diálogo do Anderson após 5 pedaços.
- Overlay de tela inteira com texto narrativo customizado por final:
  - **Matar** — cidade perde a empatia.
  - **Prender** — um da Élite trocado pela Bruna.
  - **Redimir** — Bruna humanizada, vira aliada.
- Easter eggs no epílogo: status final dos NPCs aliados (Bia confeitaria, Walber sem gaguejar, Diego namora, Letícia date saudável).

### Persistência
- Autosave a cada 15s no Supabase: doom clocks, pedaços, flags, cena, em_combate.
- Carrega estado inicial no mount.
- Estado é compartilhado por toda a Élite (campanha "velreth-elite").

## 🚧 Polish futuro (não bloqueia jogabilidade)

- Cenas internas: Taverna interior, Torre interior (atualmente o NPC fica do lado de fora do prédio).
- Modelos 3D Quaternius/Kaykit pra substituir as capsules procedurais.
- Tag flutuante com nome do NPC (drei.Text).
- Música ambiente com crossfade (Howler.js).
- TTS pré-renderizado (~200 MP3) — adiado conforme combinado.
- Efeito de chuva na praça (drei.Cloud + particles).
- Animação de movimento do player (idle/walk).
- Combate: traits únicas das classes (Cadeirada, Some, Empatia Forçada, Pergaminho).
- Mecânica do final Redimir: input de empatia real dos 3 jogadores.
- Mecânica do final Prender: tela de escolha de quem troca de lugar.

## 🧪 Como testar

```bash
cd la-vierta-3d
npm install
# Configure .env.local com:
# NEXT_PUBLIC_SUPABASE_URL=...
# NEXT_PUBLIC_SUPABASE_ANON_KEY=...
# SUPABASE_SERVICE_ROLE_KEY=... (server-side)
npm run dev
```

Rodar migration `supabase/migrations/0001_init.sql` no Supabase Studio antes do primeiro acesso. Cria as tabelas (`profiles`, `campanhas`, `personagens`, `dialogos_log`) com RLS apropriada e seed da campanha "velreth-elite".

## 🎮 Fluxo de jogo

1. Cadastrar (`/cadastro`) → Login automático.
2. Criar personagem (`/criar-personagem`) → Escolhe 1 das 4 classes, customiza nome + aparência, gera retrato.
3. Tela do jogo (`/jogar`) → Praça Central de Velreth. WASD pra mover.
4. Aproxima do **Sérgio** (capsule marrom, oeste) → Aperta E → Diálogo abre.
5. Conversa com Sérgio sobre os bilhetes → ele dá a chave da adega.
6. Sobe na **Torre** falar com Anderson (capsule azul-cinza, norte) → ele explica os 5 pedaços + os 3 finais.
7. Volta na Taverna, click na garrafa do coração na adega → coleta + combate com Sombra de Bruna.
8. Procura os outros 4 pedaços (Walber, Bia, Diego, Letícia) — cada um tem caminho ótimo dependendo da classe.
9. Com 5 pedaços, volta no Anderson → escolhe o final.
10. Epílogo overlay aparece com texto customizado.

Outros 3 jogadores entram na mesma URL `/jogar` — aparecem em tempo real, andam juntos, conversam com NPCs em paralelo (estado compartilhado).
