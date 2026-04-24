import prompt from "prompt-sync";
import { Jogo } from "./jogo";
import { Jogador } from "./jogador";
import { gerarHtmlJogos } from "./exportador";
import { buscarJogosSteam } from "./steam";
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

  const trofeus: number = +teclado("Troféus: ");

  const horas = +teclado("Horas jogadas: ");

  const visivel =
    teclado("Jogo visível? (S/N) ").toUpperCase().charAt(0) === "S";

  try {
    jogo.cadastrarJogo(nome, genero, trofeus, visivel, horas);
    jogos.push(jogo);
  } catch (e) {
    console.log((e as Error).message);
  }
}

async function exportarSteam(): Promise<void> {
  const apiKey = process.env.STEAM_API_KEY;
  const steamId = teclado("Seu Steam ID: ").trim();

  console.log("Buscando jogos na Steam...");

  try {
    const dadosSteam = await buscarJogosSteam(steamId, apiKey);

    for (const item of dadosSteam) {
      let jogo: Jogo = new Jogo();
      jogo.nome = item.name;
      jogo.genero = "Steam";
      jogo.horasJogadas = Math.round(item.playtime_forever / 60);
      jogo.trofeus = 0;
      jogo.ativo = true;
      jogo.appId = item.appid;
      jogos.push(jogo);
    }

    console.log(`${dadosSteam.length} jogos importados com sucesso!`);
  } catch (erro) {
    console.log("Erro ao buscar jogos. Verifique sua API Key e Steam ID.");
  }
}

function exportarHTML(): void {
  if (jogos.length === 0) {
    console.log("Nenhum jogo na lista para exportar!");
  } else {
    gerarHtmlJogos(jogos);
  }
}

main();
