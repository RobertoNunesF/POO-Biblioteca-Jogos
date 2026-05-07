import { Jogo } from "./Jogo";
import { Jogador } from "./Jogador";

export class Biblioteca {
  public jogos: Jogo[] = [];
  public jogadores: Jogador[] = [];

  adicionarJogador(jogador: Jogador): void {
    this.jogadores.push(jogador);
  }

  listarJogadores(): Jogador[] {
    return this.jogadores;
  }

  adicionarJogo(jogo: Jogo): void {
    this.jogos.push(jogo);
  }

  listarJogos(): Jogo[] {
    return this.jogos;
  }
}
