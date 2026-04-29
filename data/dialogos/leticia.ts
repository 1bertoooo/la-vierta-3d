import type { DialogoNPC } from "@/lib/dialogos";

const leticia: DialogoNPC = {
  id: "leticia",
  nome: "Letícia Punhetícia",
  classe: "neutro",
  default_topic: "intro",
  topics: {
    intro: {
      text: "Letícia aparece. Vestido vermelho. Sorriso largo demais. Cabelo solto até a cintura.\n\nEla olha pra Élite — mas os olhos dela trancam num só de vocês. (O sistema sorteia qual.)\n\n— Eu só queria conversar. De verdade. Eu te sigo desde a praça. Cê não notou?\n\nEla ri. O riso fica um segundo a mais do que devia.",
      options: [
        { label: "[Empatia] Letícia, eu te respeito mas não rola. Tá tudo bem.", next: "rejeitar_empatia", set_flag: "leticia_rejeitada_bem" },
        { label: "[Reciprocar] Vamos jantar qualquer hora.", next: "reciprocar", set_flag: "leticia_reciprocada" },
        { label: "[Hostil] Some daqui antes que eu chame os guarda.", next: "rejeitar_mal", clock: { sina: 1 } },
        { label: "[Sair]", end: true },
      ],
    },
    rejeitar_empatia: {
      text: "Letícia para. O sorriso dela vai morrendo devagar. Os olhos enchem.\n\n— Eu... obrigada. Ninguém nunca falou assim.\n\nEla mete a mão no bolso. Tira uma sombra. Literalmente. Uma coisa preta, fluida, do tamanho de uma manga.\n\n— Eu não sabia que tava com isso. Toma. Tava me deixando triste sem saber por quê.\n\nE ela sai. Devagar. Pela primeira vez sem perseguir ninguém.",
      on_enter: { clock: { esperanca: 2 } },
      options: [
        { label: "[Pegar a Sombra da Bruna]", give_pedaco: "sombra", end: true, set_flag: "leticia_redimida" },
      ],
    },
    reciprocar: {
      text: "Letícia ilumina. Levanta as sobrancelhas.\n\n— Sério? Cê quer mesmo?\n\nEla tira algo do bolso. Uma sombra negra que cês não notaram que estava lá.\n\n— Achei isso outro dia. Sem querer. Tava me deixando angustiada. Quer levar?\n\nEla beija o rosto do alvo. Vai embora cantando.",
      on_enter: { clock: { esperanca: 1 } },
      options: [
        { label: "[Pegar a Sombra da Bruna]", give_pedaco: "sombra", end: true },
      ],
    },
    rejeitar_mal: {
      text: "Letícia se arrepia. O sorriso vira algo pior.\n\n— Eu não vou em lugar nenhum.\n\nEla saca um adaga curva. Combate.",
      options: [
        { label: "[Iniciar combate]", start_combat: "leticia_hostil", end: true },
      ],
    },
  },
};

export default leticia;
