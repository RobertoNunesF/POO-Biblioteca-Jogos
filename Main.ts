import prompt from "prompt-sync";
import { Jogo } from "./jogo";
import { gerarHtmlJogos } from "./exportador";
import { buscarJogosSteam } from "./steam";
import 'dotenv/config';

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
        let joguin: Jogo = new Jogo();

        const nome = teclado("Nome do Jogo: ");
        joguin.nome = nome;

        const genero = teclado("Gênero: ");
        joguin.genero = genero;

        const trofeus: number = +teclado("Troféus: ");
        joguin.trofeus = trofeus;

        const horas = +teclado("Horas jogadas: ");
        joguin.horas_jogadas = horas;

        const visivel = teclado("Jogo visível? (S/N) ");
        joguin.ativo = visivel.toUpperCase() === "S";

        jogos.push(joguin);
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
        const apiKey = process.env.STEAM_API_KEY;
        const steamId = teclado("Seu Steam ID: ");

        console.log("Buscando jogos na Steam...");

        try {
          const dadosSteam = await buscarJogosSteam(steamId, apiKey);

          for (const item of dadosSteam) {
            let jogo: Jogo = new Jogo();
            jogo.nome = item.name;
            jogo.genero = "Steam";
            jogo.horas_jogadas = Math.round(item.playtime_forever / 60);
            jogo.trofeus = 0;
            jogo.ativo = true;
            jogo.appId = item.appid;
            jogos.push(jogo);
          }

          console.log(`${dadosSteam.length} jogos importados com sucesso!`);
        } catch (erro) {
          console.log("Erro ao buscar jogos. Verifique sua API Key e Steam ID.");
        }
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

main();