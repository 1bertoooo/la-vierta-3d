export type Classe = "guerreira" | "mago" | "ladina" | "clerigo";

export const CLASSES: Record<Classe, {
  nome: string;
  emoji: string;
  defaultName: string;
  hpMax: number;
  trait: string;
  traitName: string;
  bordao: string;
  description: string;
  color: string; // tailwind ring/border color
}> = {
  guerreira: {
    nome: "Guerreira",
    emoji: "🪓",
    defaultName: "Pituca",
    hpMax: 22,
    traitName: "Cadeirada",
    trait: "1x por sessão pode parar qualquer combate atordoando o oponente por 3 turnos.",
    bordao: "tu vai apanhar pra aprender",
    description: "Cresceu na taverna do Tonel. Derrubou o pai aos 12 com uma cadeirada. Tank, dano físico, sem magia.",
    color: "#a52a2a",
  },
  mago: {
    nome: "Mago",
    emoji: "✨",
    defaultName: "Bebeto",
    hpMax: 12,
    traitName: "Pergaminho da Vierta",
    trait: "1x por sessão pode RELER uma cena passada e mudar 1 escolha pequena.",
    bordao: "sinto cheiro de cachaça",
    description: "Estudou na Torre de Velreth. Foi expulso por alucinar Bruna em sonhos. Frágil mas devastador.",
    color: "#722f37",
  },
  ladina: {
    nome: "Ladina",
    emoji: "🏹",
    defaultName: "Fefe",
    hpMax: 16,
    traitName: "Some",
    trait: "1x por cena pode desaparecer e reaparecer 9m de distância.",
    bordao: "não, eu não fui",
    description: "Gatuna do mercado de Velreth. Sumiu três vezes da forca. Conhece todos os atalhos.",
    color: "#d4a574",
  },
  clerigo: {
    nome: "Clérigo",
    emoji: "⚔",
    defaultName: "Careca",
    hpMax: 18,
    traitName: "Empatia Forçada",
    trait: "1x por sessão pode obrigar um NPC a contar UMA verdade que estava escondendo.",
    bordao: "ó a empatia, irmão",
    description: "Monge da ordem do Mato Seco. Ouve a Vierta sussurrar quando fecha os olhos. Cura, suporte, revelações.",
    color: "#c9a961",
  },
};
