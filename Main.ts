import prompt from "prompt-sync";
import { Jogo } from "./jogo";
import { gerarHtmlJogos } from "./exportador";
import { buscarJogosSteam } from "./steam";
import "dotenv/config";

const teclado = prompt();

let opcao = 0;
let jogos: Jogo[] = [];

async function main() {
  while (opcao != 99) {
    console.log("+--------------------------+");
    console.log("|0. Cadastrar Jogador.     |");
    console.log("|1. Cadastrar Jogo.        |");
    console.log("|2. Listar.                |");
    console.log("|3. Editar Jogo.           |");
    console.log("|4. Excluir Jogo.          |");
    console.log("|5. Importar da Steam.     |");
    console.log("|6. Exportar para HTML.    |");
    console.log("|99. Sair.                 |");
    console.log("+--------------------------+");

    opcao = +teclado("Escolha a opção: ");

    switch (opcao) {
      case 0:
        console.log("Implementação posterior");
        break;

      case 1:
        cadastrarJogo();

        break;

      case 2:
        console.table(jogos);
        break;

      case 3:
        console.log("Implementação posterior");
        break;

      case 4:
        console.log("Implementação posterior");
        break;

      case 5:
        await exportarSteam();
        break;

      case 6:
        if (jogos.length === 0) {
          console.log("Nenhum jogo na lista para exportar!");
        } else {
          gerarHtmlJogos(jogos);
        }
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

function cadastrarJogo(): void {
  const jogo = new Jogo();

  const nome = teclado("Nome do Jogo: ");

  const genero = teclado("Gênero: ");

  const trofeus: number = +teclado("Troféus: ");

  const horas = +teclado("Horas jogadas: ");

  const visivel = teclado("Jogo visível? (S/N) ").toUpperCase().charAt(0) === "S";

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

main();
