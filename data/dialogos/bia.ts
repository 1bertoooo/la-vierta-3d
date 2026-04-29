import type { DialogoNPC } from "@/lib/dialogos";

const bia: DialogoNPC = {
  id: "bia",
  nome: "Bia, a Triste",
  classe: "neutro",
  default_topic: "intro",
  topics: {
    intro: {
      text: "Atrás do mercado, encolhida, vestido sujo de viagem, vozinha cantante.\n\n— Por favor — ela sussurra, sem olhar — não me leva pra casa. Eu fugi. Não me leva.\n\nEla esconde a mão direita debaixo do vestido. No dedo, dá pra ver a pedra preta de um anel.\n\n— Tem comida?",
      options: [
        { label: "A gente te dá comida. Quem é cê?", next: "quem", set_flag: "bia_confiou" },
        { label: "Mostra essa mão.", next: "mao_direta" },
        { label: "[Atacar — coleta a mão à força]", next: "atacar", clock: { sina: 1 } },
        { label: "[Sair]", end: true },
      ],
    },
    quem: {
      text: "Bia. Eu era princesa. Acho que ainda sou. No reino de Velheim, longe daqui.\n\n— Fugi. Faz três meses. Achei um anel num poço seco. Era bonito. Coloquei. Não sai mais.\n\nEla mostra a mão. O anel preto pulsa devagar. Como um coração ruim.\n\n— Eu sinto outra pessoa no meu braço. Tipo... uma mulher. Triste. Brava. As duas.",
      options: [
        { label: "Vamos tirar esse anel. A gente cuida.", next: "tirar_anel", set_flag: "bia_aceitou_ajuda" },
        { label: "[Voltar]", next: "intro" },
      ],
    },
    mao_direta: {
      text: "Ela mostra. O anel preto pulsando.\n\n— Por favor. Eu não consigo tirar. Tentei tudo.",
      options: [
        { label: "Vamos te ajudar.", next: "tirar_anel", set_flag: "bia_aceitou_ajuda" },
        { label: "[Voltar]", next: "intro" },
      ],
    },
    tirar_anel: {
      text: "[Decisão: como tirar o anel?]",
      options: [
        { label: "[Clérigo] Remover Maldição (DC 16 SAB).", if: "classe:clerigo", next: "remover_maldicao_sucesso", set_flag: "bia_viva" },
        { label: "[Mago] Drenar a magia do anel (DC 16 INT).", if: "classe:mago", next: "remover_maldicao_sucesso", set_flag: "bia_viva" },
        { label: "[Forçar] Quebrar o dedo da Bia. Anel sai.", next: "forcar", clock: { sina: 2 } },
        { label: "[Voltar]", next: "intro" },
      ],
    },
    remover_maldicao_sucesso: {
      text: "A magia toma forma.\n\nO anel preto chia, esfumaça. Sai do dedo da Bia como uma cobra que perdeu a presa.\n\nBia chora. De alívio.\n\n— Obrigada. Obrigada.\n\nVocês pegam o anel. É a Mão da Bruna materializada — pesa três vezes mais do que devia.",
      on_enter: { clock: { esperanca: 1 } },
      options: [
        { label: "[Pegar a Mão da Bruna]", give_pedaco: "mao", end: true, set_flag: "bia_viva" },
      ],
    },
    forcar: {
      text: "Cês quebram o dedo dela. Bia grita.\n\nO anel sai. Mas ela morre de choque três horas depois — perdeu sangue demais.\n\nA Élite carrega isso.",
      on_enter: { clock: { sina: 2 } },
      options: [
        { label: "[Pegar a Mão da Bruna]", give_pedaco: "mao", end: true },
      ],
    },
    atacar: {
      text: "Cês avançam. Bia recua, encurralada.\n\nO anel preto explode em luz roxa. A mão dela vira garra. Os olhos roxos.\n\n— EU NUNCA QUIS SER NADA DISSO\n\nCombate forçado. Bia possessa, HP 25, dano 1d8+3.",
      options: [
        { label: "[Iniciar combate]", start_combat: "bia_possessa", end: true },
      ],
    },
    apos_pedaco: {
      text: "Bia respira normal. Olha pra cês.\n\n— Eu posso ir junto? Eu... acho que posso ajudar. Eu sinto ela, ainda. Faz três meses.\n\nEla mostra um sorriso pequeno. O primeiro da vida dela em três meses.",
      on_enter: { set_flag: "bia_aliada", clock: { esperanca: 1 } },
      options: [
        { label: "Vem com a gente.", end: true },
        { label: "Fica em segurança aqui.", end: true },
      ],
    },
  },
};

export default bia;
