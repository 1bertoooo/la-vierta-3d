import type { DialogoNPC } from "@/lib/dialogos";

const walber: DialogoNPC = {
  id: "walber",
  nome: "Walber, o Caixeiro",
  classe: "neutro",
  default_topic: "intro",
  topics: {
    intro: {
      text: "O rapaz tá tremendo atrás do balcão do mercado. O ombro caído mais que de costume. Não olha pra cês.\n\n— P-p-pode escolher, m-m-moças e moços. Te-te-tenho c-corda... lanterna... p-poção...\n\nEle olha pra um canto vazio. Volta pra cês. O olho esquerdo dele lacrimeja sozinho.",
      options: [
        { label: "Walber, cê tá vendo alguma coisa que a gente não tá?", next: "fantasma" },
        { label: "Quanto custa uma poção de cura?", next: "loja" },
        { label: "Cê parece ruim. Quer descansar?", next: "descansar" },
        { label: "[Sair]", end: true },
      ],
    },
    loja: {
      text: "P-poção de cura: cinco moeda. L-lanterna: duas. Corda: uma. P-pergaminho de luz: dez.\n\nEle ainda treme. As mãos dele largam tudo o que pegam.",
      options: [
        { label: "Comprar poção (5g).", give_item: "pocao_cura", end: true },
        { label: "[Voltar]", next: "intro" },
      ],
    },
    descansar: {
      text: "N-não posso. Ela fica brava se eu fechar o olho.\n\n— Quem é 'ela', Walber?\n\nEle morde o lábio. Não responde.",
      options: [
        { label: "[Empatia Forçada — Clérigo] Walber, me conta. Agora.", if: "classe:clerigo", next: "empatia_forcada", set_flag: "walber_revelou" },
        { label: "[Persuadir suavemente]", next: "persuadir" },
        { label: "[Voltar]", next: "intro" },
      ],
    },
    persuadir: {
      text: "Walber chora baixo. Sem som.\n\n— Eu vejo desde os sete. Ela mora aqui — ele aponta a própria garganta. Eu falo, mas é ela falando. Eu sou o copo. Ela é a água.\n\n— Por favor. Tirem ela. Eu não... eu não aguento mais.",
      options: [
        { label: "[Empatia Forçada — Clérigo]", if: "classe:clerigo", next: "empatia_forcada", set_flag: "walber_revelou" },
        { label: "[Detect Magic — Mago]", if: "classe:mago", next: "detect_magic", set_flag: "walber_revelou" },
        { label: "[A gente segura ele] — Pituca/Fefe segura, Mago/Clérigo age.", next: "imobilizar" },
      ],
    },
    fantasma: {
      text: "Walber empalidece.\n\n— Não posso falar. Ela tá ouvindo.\n\nEle olha pro canto. Cês olham. O canto tá vazio. Mas tem um rastro de água no chão como se alguém tivesse passado, descalço, chorando.",
      options: [
        { label: "[Empatia Forçada — Clérigo] Fala AGORA.", if: "classe:clerigo", next: "empatia_forcada", set_flag: "walber_revelou" },
        { label: "[Persistir gentilmente]", next: "persuadir" },
        { label: "[Voltar]", next: "intro" },
      ],
    },
    empatia_forcada: {
      text: "O Clérigo encosta dois dedos na testa do Walber.\n\nA loja inteira treme. Os vidros vibram. Walber abre a boca — e a voz que sai não é a dele.\n\n*'ele me vê. ele sempre me viu. eu vivo dentro dele desde que ele tinha sete anos.'*\n\nUma esfera vibrante, do tamanho de um punho, sai pela boca dele e fica flutuando entre cês. É a Voz. Da Bruna.\n\nWalber cai. Respira. PRIMEIRA vez em décadas que respira sem ela.",
      on_enter: { clock: { esperanca: 1 } },
      options: [
        { label: "[Pegar a Voz da Bruna]", give_pedaco: "voz", end: true },
      ],
    },
    detect_magic: {
      text: "O Mago foca os olhos. A esfera roxa pulsa nas mãos dele.\n\nA Voz aparece — verde, vibrante, alojada na garganta do Walber. Drain — DC 18 INT — pra extrair sem matá-lo.\n\n— [Rolagem mágica feita.] A Voz sai. Walber cai vivo. Respira fundo.\n\n— O-obrigado. Senhor.\n\nE ele fala SEM gaguejar.",
      on_enter: { clock: { esperanca: 1 } },
      options: [
        { label: "[Pegar a Voz da Bruna]", give_pedaco: "voz", end: true },
      ],
    },
    imobilizar: {
      text: "Cês seguram Walber. Ele luta — não com força física, com pavor.\n\nO ar fica frio. A esfera da Voz aparece visível pra todos.\n\n— [Sem mago/clérigo presentes, falha.]\n\nWalber se debate. Cês precisam soltar. Pena. Vão precisar voltar com ajuda mágica.",
      options: [
        { label: "[Sair]", end: true },
      ],
    },
    apos_voz: {
      text: "Walber tá sentado. Calmo. O olhar dele tá vivo.\n\n— Obrigado. Eu não sei como agradecer.\n\nEle tira algo do bolso. Uma chave pequena.\n\n— Tava com isso há vinte anos. Não sabia pra que era. Acho que é pra Pandórica do Sérgio.",
      options: [
        { label: "[Pegar a chave]", give_item: "chave_pandorica", end: true },
      ],
    },
  },
};

export default walber;
