import prompt from "prompt-sync";
import { Jogo } from "./jogo";
import { Jogador } from "./jogo";

const teclado = prompt();

let opcao = 0;
let jogos: Jogo[] = [];

while (opcao != 99) {
  console.log("+--------------------------+");
  console.log("|0. Cadastrar Jogador.     |");
  console.log("|1. Cadastrar Jogo.        |");
  console.log("|2. Listar.                |");
  console.log("|3. Editar Jogo.           |");
  console.log("|4. Excluir Jogo.          |");
  console.log("|99. Sair.                 |");
  console.log("+--------------------------+");

  opcao = +teclado("Escolha a opção: ");

  switch (opcao) {
    case 0:
      // let jogador: Jogador = new Jogador("", 0, "");

      // const nomeJogador = teclado("Nome real do jogador: ");
      // jogador.nome = nomeJogador;
      // const idJogador = +teclado("ID do jogador: ");
      // jogador.id = idJogador;
      // const apelidoJogador = teclado("Apelido na plataforma: ");
      // jogador.apelido = apelidoJogador;
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
      //console.log(Jogador);
      console.table(jogos);
      break;
    case 3:
      console.log("Implementação posterior");
      break;
    case 4:
      console.log("Implementação posterior");
      break;
    case 99:
      console.log("Até logo!");
      break;
    default:
      console.log("Opção Inválida!");
      break;
  }
}
