import prompt from "prompt-sync";
import { Jogo } from "./jogo";
import { Jogador } from "./jogador";
import { gerarHtmlPerfis } from "./exportador";
import { buscarJogosSteam, buscarPerfilSteam, buscarConquistasSteam } from "./steam";
import "dotenv/config";

const teclado = prompt();

let opcao = 0;
let jogos: Jogo[] = [];
let jogadores: Jogador[] = [];

async function main() {
  while (opcao != 99) {
    console.log("+--------------------------+");
    console.log("|0. Cadastrar Jogador.     |");
    console.log("|1. Listar Jogador.        |");
    console.log("|2. Cadastrar Jogo.        |");
    console.log("|3. Listar Jogos.          |");
    console.log("|4. Editar Jogo.           |");
    console.log("|5. Excluir Jogo.          |");
    console.log("|6. Importar da Steam.     |");
    console.log("|7. Exportar para HTML.    |");
    console.log("|99. Sair.                 |");
    console.log("+--------------------------+");

    opcao = +teclado("Escolha a opção: ");

    switch (opcao) {
      case 0:
        cadastrarJogador();
        break;

      case 1:
        console.table(jogadores);
        break;

      case 2:
        cadastrarJogo();

        break;

      case 3:
        console.table(jogos);
        break;

      case 4:
        console.log("Implementação posterior");
        break;

      case 5:
        console.log("Implementação posterior");
        break;

      case 6:
        await exportarSteam();
        break;

      case 7:
        exportarHTML();
        break;

      case 99:
        console.log("Até logo!");
        break;

      default:
        console.log("Opção Inválida!");
        break;
    }
  }
}

function selecionarJogador(): Jogador | null {
  if (jogadores.length === 0) return null;
  console.log("Jogadores cadastrados:");
  jogadores.forEach((j, i) => console.log(`[${i + 1}] ${j.nickname}`));
  const idx = +teclado("Selecione o jogador (número): ") - 1;
  return (idx >= 0 && idx < jogadores.length) ? jogadores[idx] : null;
}

function cadastrarJogador(): void {
  const jogador = new Jogador();

  const nome = teclado("Nome do Jogador: ");

  const nickname = teclado("Nickname: ");

  const email = teclado("Email: ");

  const dataNascimento = teclado("Data de Nascimento (DD/MM/AAAA): ");

  // trofeus e horas sao convertidos em numeros no .reduce, soma e jogo sao parametros, soma vai pegar o valor inicial 0, que foi definido no final, e somar com o numero do proximo jogo
  const totalTrofeus = jogos.reduce((soma, jogo) => soma + jogo.trofeus, 0);
  const totalHoras = jogos.reduce((soma, jogo) => soma + jogo.horasJogadas, 0);

  try {
    jogador.cadastrarJogador(
      nome,
      nickname,
      email,
      dataNascimento,
      totalTrofeus,
      totalHoras,
    );
    jogadores.push(jogador);
  } catch (e) {
    console.log((e as Error).message);
  }
}

function cadastrarJogo(): void {
  const jogo = new Jogo();

  const nome = teclado("Nome do Jogo: ");
  const genero = teclado("Gênero: ");
  const horas = +teclado("Horas jogadas: ");
  const visivel = teclado("Jogo visível? (S/N) ").toUpperCase().charAt(0) === "S";

  const conquistas: { nome: string; desbloqueado: boolean; icone: string }[] = [];
  const adicionarTrofeus = teclado("Adicionar nomes de troféus? (S/N) ").toUpperCase().charAt(0) === "S";
  if (adicionarTrofeus) {
    console.log("Digite o nome de cada troféu (deixe em branco para terminar):");
    while (true) {
      const nomeTrofeu = teclado("Troféu: ").trim();
      if (!nomeTrofeu) break;
      conquistas.push({ nome: nomeTrofeu, desbloqueado: true, icone: "" });
    }
  }
  const trofeus = conquistas.length > 0 ? conquistas.length : +teclado("Troféus (número): ");

  try {
    jogo.cadastrarJogo(nome, genero, trofeus, visivel, horas);
    jogo.conquistas = conquistas;
    jogos.push(jogo);
    if (jogadores.length > 0) {
      const jogador = selecionarJogador();
      if (jogador) jogador.adicionarJogo(jogo);
    }
  } catch (e) {
    console.log((e as Error).message);
  }
}

async function exportarSteam(): Promise<void> {
  const apiKey = process.env.STEAM_API_KEY;
  const steamId = teclado("Seu Steam ID: ").trim();

  console.log("Buscando perfil e jogos na Steam...");

  try {
    const perfil = await buscarPerfilSteam(steamId, apiKey);
    const dadosSteam = await buscarJogosSteam(steamId, apiKey);

    const jogador = new Jogador();
    jogador.nickname = perfil.personaname;
    jogador.nome = perfil.personaname;
    jogadores.push(jogador);

    for (const item of dadosSteam) {
      const jogo = new Jogo();
      jogo.nome = item.name;
      jogo.genero = "Steam";
      jogo.horasJogadas = Math.round(item.playtime_forever / 60);
      jogo.trofeus = 0;
      jogo.ativo = true;
      jogo.appId = item.appid;
      jogos.push(jogo);
      jogador.adicionarJogo(jogo);
    }

    const jogosComHoras = jogador.jogos.filter(j => j.horasJogadas > 0 && j.appId !== undefined);
    console.log(`Buscando conquistas de ${jogosComHoras.length} jogo(s) com horas jogadas...`);
    for (const jogo of jogosComHoras) {
      const conquistas = await buscarConquistasSteam(steamId, jogo.appId!, apiKey);
      jogo.conquistas = conquistas;
      jogo.trofeus = conquistas.filter(c => c.desbloqueado).length;
    }

    console.log(`Perfil "${perfil.personaname}" importado com ${dadosSteam.length} jogos!`);
  } catch (erro) {
    console.log("Erro ao buscar dados da Steam. Verifique sua API Key e Steam ID.");
  }
}

function exportarHTML(): void {
  if (jogadores.length === 0) {
    console.log("Nenhum jogador cadastrado para exportar!");
  } else {
    gerarHtmlPerfis(jogadores);
  }
}

main();
