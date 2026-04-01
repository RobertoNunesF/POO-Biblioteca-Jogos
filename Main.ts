import prompt from "prompt-sync";
import { Jogo } from "./jogo";
import { Jogador } from "./jogo";
import { buscarJogosSteam } from "./steam";

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
        const apiKey = teclado("Sua Steam API Key: ");
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
            jogos.push(jogo);
          }

          console.log(`${dadosSteam.length} jogos importados com sucesso!`);
        } catch (erro) {
          console.log("Erro ao buscar jogos. Verifique sua API Key e Steam ID.");
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