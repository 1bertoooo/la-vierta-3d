import { create } from "zustand";
import type { Classe } from "./classes";

export type RemotePlayer = {
  user_id: string;
  nick: string;
  classe: Classe;
  nome: string;
  retrato_url: string | null;
  hp_current: number;
  hp_max: number;
  x: number;
  z: number;
  rotation: number;
  scene: string;
  last_seen: number;
};

type GameState = {
  // Local player position (predicted client-side)
  myX: number;
  myZ: number;
  myRotation: number;
  // Remote players seen via realtime broadcast
  remotes: Record<string, RemotePlayer>;
  // Current scene (Praça, Taverna, Torre, etc.)
  scene: string;
  // Doom clocks
  vierta: number;     // 0-12
  esperanca: number;  // 0-6
  sina: number;       // 0-6
  // Quest state
  pedacosColetados: ("coracao" | "olho" | "voz" | "mao" | "sombra")[];
  flags: Record<string, boolean>;
  inventario: string[]; // ids de items: "chave_adega", "lagrima_bruna", "pocao_cura", "chave_pandorica"
  // Active dialog (NPC ID)
  dialogoAtivo: string | null;
  // Combat state
  emCombate: boolean;
  // Final escolhido (após Ato 3)
  finalEscolhido: "matar" | "prender" | "redimir" | null;
  // Actions
  setMyPosition: (x: number, z: number, rot: number) => void;
  setScene: (scene: string) => void;
  upsertRemote: (p: RemotePlayer) => void;
  removeRemote: (userId: string) => void;
  setFlag: (key: string, value: boolean) => void;
  addPedaco: (p: "coracao" | "olho" | "voz" | "mao" | "sombra") => void;
  addItem: (item: string) => void;
  setDoomClock: (k: "vierta" | "esperanca" | "sina", v: number) => void;
  abrirDialogo: (npcId: string | null) => void;
  setEmCombate: (b: boolean) => void;
  setFinal: (f: "matar" | "prender" | "redimir" | null) => void;
};

export const useGame = create<GameState>((set) => ({
  myX: 0,
  myZ: 0,
  myRotation: 0,
  remotes: {},
  scene: "praca",
  vierta: 0,
  esperanca: 3,
  sina: 0,
  pedacosColetados: [],
  flags: {},
  inventario: [],
  dialogoAtivo: null,
  emCombate: false,
  finalEscolhido: null,
  setMyPosition: (x, z, rot) => set({ myX: x, myZ: z, myRotation: rot }),
  setScene: (scene) => set({ scene }),
  upsertRemote: (p) =>
    set((state) => ({ remotes: { ...state.remotes, [p.user_id]: p } })),
  removeRemote: (userId) =>
    set((state) => {
      const next = { ...state.remotes };
      delete next[userId];
      return { remotes: next };
    }),
  setFlag: (key, value) =>
    set((state) => ({ flags: { ...state.flags, [key]: value } })),
  addPedaco: (p) =>
    set((state) =>
      state.pedacosColetados.includes(p)
        ? state
        : { pedacosColetados: [...state.pedacosColetados, p] }
    ),
  addItem: (item) =>
    set((state) =>
      state.inventario.includes(item)
        ? state
        : { inventario: [...state.inventario, item] }
    ),
  setDoomClock: (k, v) => set({ [k]: v } as Partial<GameState>),
  abrirDialogo: (npcId) => set({ dialogoAtivo: npcId }),
  setEmCombate: (emCombate) => set({ emCombate }),
  setFinal: (finalEscolhido) => set({ finalEscolhido }),
}));
