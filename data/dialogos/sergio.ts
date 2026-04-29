import type { DialogoNPC } from "@/lib/dialogos";

const sergio: DialogoNPC = {
  id: "sergio",
  nome: "Seu Sérgio do Brechó",
  classe: "aliado",
  default_topic: "intro",
  topics: {
    intro: {
      text: "Ó a empatia, irmãos. Cês chegaram bem.\n\nO velho ajeita o copo lascado no balcão. Lustra. Lustra de novo. Não olha pra cês.\n\n— Tá feio lá fora, hein.",
      options: [
        { label: "Que tá rolando na cidade, Sérgio?", next: "cidade" },
        { label: "Cê tem o que pra beber?", next: "bebida" },
        { label: "Achamos uns bilhetes pela cidade — um em cada casa.", next: "bilhete" },
        { label: "[Sair]", end: true },
      ],
    },
    cidade: {
      text: "Eu nasci em Velreth. Setenta anos. Não vi o que tô vendo hoje.\n\n— A chuva tá vindo errada. Os passarinho não come.\n\nEle pausa. Olha pra um canto vazio onde, durante meio segundo, parece ter alguém.\n\n— Ela voltou.",
      options: [
        { label: "Quem voltou?", next: "quem_bruna", set_flag: "sergio_falou_da_bruna" },
        { label: "Como assim 'voltou'?", next: "como_assim" },
      ],
    },
    como_assim: {
      text: "...vocês não sabem? Sobe lá na Torre. Conversa com o Anderson. Ele te conta tudo.\n\nEle pausa. Olha pra cima como quem reza.\n\n— E pelo amor de... cuida dele. O homem carrega cada coisa.",
      options: [
        { label: "[Sair pra Torre]", set_flag: "tem_quest_anderson", end: true },
      ],
    },
    bebida: {
      text: "Cachaça da boa, vinte moedas. Vinho de bode, oito. Água do poço, gratis se cê pagar com história.\n\n— Mas hoje cê não vai precisar. Tá invocado o suficiente.",
      options: [
        { label: "Voltar.", next: "intro" },
      ],
    },
    bilhete: {
      text: "Sérgio para de lustrar. Pela primeira vez.\n\n— Mostra aí.\n\nEle pega. Lê. Os ombros caem.\n\n— Essa letra eu conheço, irmão. Conheço bem. Era pra eu ter sumido com isso. Eu errei.\n\nUma lágrima. Limpa rápido com o pano sujo.\n\n— Ela voltou. Eu falo da Bruna. A Pandórica. Essa que escreveu o bilhete em cada porta. Ela não tá inteira ainda. Mas tá juntando. E vocês vão ter que achar os pedaço dela antes do amanhecer.",
      options: [
        { label: "Onde tão os pedaços?", next: "pedacos" },
        { label: "Quem é Bruna a Pandórica?", next: "quem_bruna", set_flag: "sergio_falou_da_bruna" },
      ],
    },
    quem_bruna: {
      text: "Eu vou te dizer uma coisa que nunca disse: ela já foi gente.\n\n— Era uma menina. Bonita. Triste do jeito que algumas é. Em 2015 ela tentou ir embora. Cinco Novalginas. Sobreviveu pelo cano. Mas alguma coisa dela ficou do outro lado, sabe? Voltou inteira por fora, em pedacinhos por dentro.\n\nO Anderson cuidou dela. Sem cobrar nada. Por dois anos. Aí ela sumiu.\n\n— Hoje ela voltou. Mas em pedacinhos mesmo. Espalhados.",
      options: [
        { label: "Onde tão os pedaços?", next: "pedacos" },
        { label: "Como derrota ela?", next: "derrota" },
        { label: "[Voltar]", next: "intro" },
      ],
    },
    pedacos: {
      text: "Cinco pedaços. Eu sei de um. Os outros, vão ter que farejar.\n\n— Coração: tá lá embaixo. Adega. Eu guardei sem saber. Mil vezes burro.\n\n— Os outros: olho, voz, mão e sombra. Tão na cidade. Em coisa viva. Em gente. Talvez em vocês mesmos. Eu não sei.\n\n— Vão. Eu te entrego a chave da adega.",
      options: [
        { label: "Pegar a chave da adega.", give_item: "chave_adega", set_flag: "sergio_deu_chave", next: "apos_chave" },
      ],
    },
    apos_chave: {
      text: "Sérgio empurra a chave de ferro pelo balcão. Os olhos dele brilham mais do que de costume.\n\n— Tem uma coisa lá embaixo que sussurra. Não escuta o nome dela. Se escutar, sai. Não responde.\n\n— Boa sorte, Élite.",
      options: [
        { label: "[Descer pra adega]", goto_scene: "adega", end: true },
        { label: "[Sair]", end: true },
      ],
    },
    derrota: {
      text: "Não tem fórmula, irmão. Tem caminho.\n\n— Vocês podem matar ela de novo. Foi o que o Anderson fez. Mas tem custo. A cidade perde alguma coisa nesse caminho.\n\n— Podem prender ela na Pandórica. A caixa original. Tá na minha mesa. Mas aí um de vocês quatro vai ter que entrar no lugar dela. Pra ficar.\n\n— Ou — e isso ninguém nunca conseguiu — vocês podem trazer ela pra empatia. Pra ela voltar a ser gente. Inteira de novo. Mas precisa de três corações abertos. De vocês mesmos. Não é fácil.\n\n— Decidam quando tiverem os pedaço todo na mão.",
      options: [
        { label: "[Voltar]", next: "intro" },
      ],
    },
    // Após coletar coração:
    coracao_obtido: {
      text: "Sérgio olha pra cês. Os olhos vermelhos.\n\n— Cês conseguiram. Eu tava com medo de descer com vocês. Velho besta.\n\nEle entrega uma garrafinha pequena.\n\n— Lágrima de Bruna. Eu guardei pra esse dia. Cura quase qualquer coisa.\n\n— Ó a empatia, irmãos.",
      on_enter: { clock: { esperanca: 1 } },
      options: [
        { label: "[Pegar a Lágrima]", give_item: "lagrima_bruna", end: true },
      ],
    },
  },
};

export default sergio;
