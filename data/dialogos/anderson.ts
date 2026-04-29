import type { DialogoNPC } from "@/lib/dialogos";

const anderson: DialogoNPC = {
  id: "anderson",
  nome: "Mestre Anderson",
  classe: "aliado",
  default_topic: "intro",
  topics: {
    intro: {
      text: "O homem está sentado numa cadeira de pinho que range. Cabelos prateados, mãos calejadas, o anel de prata 24h girando sem ele perceber. A torre cheira a alecrim e papel velho.\n\n— Cês vieram. Eu sabia.\n\nEle não levanta os olhos. Tem um copo de chá frio na mesa, intocado.\n\n— Sentem aí.",
      options: [
        { label: "Sérgio nos mandou. A Bruna voltou?", next: "voltou" },
        { label: "Quem é o senhor de verdade?", next: "quem_voce" },
        { label: "[Sair]", end: true },
      ],
    },
    voltou: {
      text: "Voltou. Eu tinha esperança que não.\n\n— Eu matei ela em dois mil e quinze. Não com a mão — com o ritual. Selei. Achei que era pra sempre.\n\nEle finalmente olha. Os olhos dele não são de mago. São de homem cansado.\n\n— Mas a gente não mata empatia, irmão. A gente trata.\n\n— Eu falhei.",
      options: [
        { label: "Como ela voltou?", next: "como_voltou" },
        { label: "O que precisamos fazer?", next: "missao" },
      ],
    },
    como_voltou: {
      text: "Ela ficou em pedacinhos. Cada pedaço escolheu uma casa, uma alma, um móvel. Esperaram. Vinte anos esperando. Dez. Não importa o tempo pra um pedaço de mulher quebrada.\n\n— Hoje os pedaços tão querendo se reunir. Eu sinto. Cê sente também se prestar atenção.\n\n— A noite inteira é tudo que cês têm.",
      options: [
        { label: "O que precisamos fazer?", next: "missao" },
      ],
    },
    quem_voce: {
      text: "Anderson abre um meio-sorriso pela primeira vez.\n\n— Padrinho. Já fui muita coisa. Hoje sou só padrinho. De alguns que pediram, e de alguns que não pediram.\n\n— A Bruna foi minha afilhada. Os dois primeiros anos. Aí eu errei. E eu carrego.\n\n— Vocês vão entender. Talvez. Boa sorte.",
      options: [
        { label: "[Voltar]", next: "intro" },
      ],
    },
    missao: {
      text: "Cinco pedaços, espalhados:\n\n— Coração. Adega do Sérgio.\n— Olho. Diego das Sombras roubou. Sem saber.\n— Voz. Walber, o caixeiro, vê fantasmas. Ela tá nele.\n— Mão. A princesa Bia, achou um anel num poço. Não sai mais.\n— Sombra. A Letícia. Ela tá obcecada por um de vocês — não sei qual. Sem saber, ela carrega o último pedaço no bolso.\n\n— Tragam tudo pra cá. Pra essa torre. Eu monto o ritual de fechamento.\n\nEle pausa.\n\n— E aí, com tudo aqui, vocês escolhem o que fazer com ela. Eu não escolho. Hoje é a vez de vocês.",
      on_enter: { set_flag: "anderson_explicou_missao", clock: { esperanca: 1 } },
      options: [
        { label: "Que escolhas a gente vai ter?", next: "escolhas" },
        { label: "[Vamos atrás dos pedaços]", end: true },
      ],
    },
    escolhas: {
      text: "Três caminhos. Todos custam.\n\n1. Matar. Queimar os cinco pedaços junto comigo no fogo da torre. Bruna some pra sempre. Mas a cidade perde a empatia — ninguém em Velreth vai conseguir falar 'ó a empatia' sem trancar a língua. Sérgio vira mudo emocional. Tem custo.\n\n2. Prender. Selar ela na Pandórica original — caixa que tá com Sérgio. Mas a caixa exige uma alma viva pra equilibrar. Um de vocês quatro entra no lugar dela. Pode ser libertado se a Élite voltar daqui um tempo. Talvez. Sem garantia.\n\n3. Redimir. Três de vocês recitam, pra ela, uma cena real de empatia que viveram. Não inventada. Real. Ela absorve. Volta a ser gente. Vai morar aqui. Vocês vão cuidar dela por seis meses. Trabalhoso.\n\n— Decidam quando tiver tudo aqui na mesa. Não antes.",
      options: [
        { label: "[Sair pra missão]", end: true },
      ],
    },
    // Após Élite trazer todos os pedaços (escolha do final)
    todos_pedacos: {
      text: "Anderson levanta. Pela primeira vez na noite. Põe os cinco pedaços no centro do círculo de sal.\n\nA chuva para. As velas tremem.\n\n— Hora.\n\n— Qual caminho a Élite escolhe?",
      options: [
        { label: "Matar Bruna em definitivo.", goto_scene: "final_matar", end: true },
        { label: "Prender Bruna na Pandórica (alguém troca de lugar).", goto_scene: "final_prender", end: true },
        { label: "Redimir Bruna (só se tiver Esperança ≥ 5).", if: "esperanca:5", goto_scene: "final_redimir", end: true },
      ],
    },
  },
};

export default anderson;
