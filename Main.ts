import prompt from "prompt-sync";
import { Jogo } from "./jogo";

const teclado = prompt();

let opcao = 0;
let jogos: Jogo[] = [];

while (opcao != 99) {
  console.log("+--------------------------+");
  console.log("|1. Cadastrar Jogo.        |");
  console.log("|2. Listar.                |");
  console.log("|3. Editar Jogo.           |");
  console.log("|4. Excluir Jogo.          |");
  console.log("|0. Sair.                  |");
  console.log("+--------------------------+");

  opcao = +teclado("Escolha a opção: ");

  switch (opcao) {
    case 1:
      let joguin: Jogo = new Jogo("", "", 0, false, 0);

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
    case 0:
      console.log("Até logo!");
      break;
    default:
      console.log("Opção Inválida!");
      break;
  }
}
