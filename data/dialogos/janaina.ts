import type { DialogoNPC } from "@/lib/dialogos";

const janaina: DialogoNPC = {
  id: "janaina",
  nome: "Cigana Janaína",
  classe: "neutro",
  default_topic: "intro",
  topics: {
    intro: {
      text: "Janaína senta numa esquina do mercado, atrás duma manta de baralhos. Cabelo preto comprido, brincos de moeda, sorriso enviesado.\n\n— Élite. Faz tempo que eu te espero. Cinquenta moedas pela visão verdadeira. Dez pela mentira que cê quer ouvir.",
      options: [
        { label: "Dá a visão verdadeira (50g).", if: "has:50g", next: "verdade", set_flag: "janaina_paga" },
        { label: "Dá a mentira (10g).", next: "mentira" },
        { label: "[Sair]", end: true },
      ],
    },
    verdade: {
      text: "Janaína fecha os olhos. Quando abre, são lácteos. Brancos. Falando outra voz.\n\n— Bruna não quer matar. Bruna quer existir. Quem oferecer empatia, fica viva. Quem oferecer ódio, vira pedaço. Cuidado com o caminho do meio. Não tem meio.\n\nEla volta. Os olhos dela voltam ao normal. Ela treme.\n\n— Foi forte essa.",
      on_enter: { clock: { esperanca: 1 } },
      options: [
        { label: "[Sair]", end: true },
      ],
    },
    mentira: {
      text: "Janaína sorri torto.\n\n— Cês vão ganhar. Tudo lindo. Bruna vai morrer queimada e a cidade vai cantar. Festa boa.\n\nEla pisca.\n\n— Boa sorte, Élite.",
      options: [
        { label: "[Sair]", end: true },
      ],
    },
  },
};

export default janaina;
