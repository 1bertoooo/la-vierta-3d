import type { DialogoNPC } from "@/lib/dialogos";

const diego: DialogoNPC = {
  id: "diego",
  nome: "Diego das Sombras",
  classe: "neutro",
  default_topic: "intro",
  topics: {
    intro: {
      text: "Diego tá numa esquina do mercado, encostado num poste, fingindo que tá esperando alguém.\n\nMoreno alto, capa preta, um mamilo identificável (o esquerdo, furado de prata).\n\n— E aí, Élite. Dia bonito pra ficar respirando, né.\n\nEle sorri. Os olhos dele varrem a multidão buscando saída.",
      options: [
        { label: "Diego, cê tem uma gema roxa que não é tua.", next: "confronto" },
        { label: "[Ladina] Furtividade — passar e roubar a gema.", if: "classe:ladina", next: "ladina_rouba" },
        { label: "[Mago] Lançar Charme.", if: "classe:mago", next: "charme" },
        { label: "[Clérigo] Empatia Forçada.", if: "classe:clerigo", next: "empatia_forcada" },
        { label: "[Guerreira] Intimidar.", if: "classe:guerreira", next: "intimidar" },
        { label: "[Sair]", end: true },
      ],
    },
    confronto: {
      text: "Diego ri sem nervo aparente.\n\n— Que gema, irmão?\n\nMas o canto da boca dele tá tremendo. Cê vê.",
      options: [
        { label: "Sabe que sabe. Entrega.", next: "entrega_voluntaria" },
        { label: "[Voltar]", next: "intro" },
      ],
    },
    entrega_voluntaria: {
      text: "Diego suspira. Tira a gema do bolso. Olha pra ela como quem se despede.\n\n— Eu não roubei pra mal. Eu... tenho sonhado com uma mulher. Triste. Ela pediu pra eu pegar isso pra ela.\n\n— Aqui. Eu não quero mais.",
      on_enter: { clock: { esperanca: 1 } },
      options: [
        { label: "[Pegar o Olho da Bruna]", give_pedaco: "olho", end: true, set_flag: "diego_aliado" },
      ],
    },
    ladina_rouba: {
      text: "A Ladina some. Reaparece atrás do Diego. A mão entra no bolso da capa, sai.\n\n— [Furtividade DC 13: SUCESSO]\n\nDiego nem percebe. Cês saem normal.\n\nNo bolso da Ladina: o Olho da Bruna.",
      options: [
        { label: "[Pegar o Olho da Bruna]", give_pedaco: "olho", end: true },
      ],
    },
    charme: {
      text: "O Mago olha nos olhos do Diego. A esfera roxa pulsa.\n\n— Diego, irmão. Cê confia em mim, né?\n\n— [Persuasão mágica feita.]\n\nDiego entrega a gema sem hesitar. Sorri. Vai embora assobiando uma cantiga ruim.",
      options: [
        { label: "[Pegar o Olho da Bruna]", give_pedaco: "olho", end: true },
      ],
    },
    empatia_forcada: {
      text: "Clérigo encosta na testa.\n\nDiego cai de joelhos.\n\n— Eu trabalho pra ela. Sem saber. Tem uns três meses. Ela aparece em sonho. Pede coisas. Eu pego.\n\n— Tô amaldiçoado, irmão. Me ajuda.\n\nEle entrega a gema chorando.",
      on_enter: { set_flag: "diego_amaldicoado_revelado", clock: { esperanca: 1 } },
      options: [
        { label: "[Pegar o Olho da Bruna]", give_pedaco: "olho", end: true, set_flag: "diego_aliado" },
      ],
    },
    intimidar: {
      text: "A Guerreira pega o Diego pela gola. Suspende ele um palmo do chão.\n\n— Cê tem uma coisa que não é tua.\n\nDiego espuma. Tenta fugir. Entrega a gema.\n\nEle some assim que cê solta. Bordão dele ecoa: 'tu falou que n ia.'",
      on_enter: { clock: { sina: 1 } },
      options: [
        { label: "[Pegar o Olho da Bruna]", give_pedaco: "olho", end: true },
      ],
    },
  },
};

export default diego;
