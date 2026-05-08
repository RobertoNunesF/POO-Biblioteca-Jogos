import { Jogador } from "./Jogador";

export class JogadorManual extends Jogador {
  cadastrarJogador(
    nome: string,
    nickname: string,
    email: string,
    dataNascimento: string,
    trofeus: number,
    horasJogadas: number,
  ): void {
    if (!nome || nome.length <= 2) {
      throw new Error("Coloque seu nome completo");
    }
    if (!nickname) {
      throw new Error("Coloque seu nickname correto");
    }

    this.nome = nome;
    this.nickname = nickname;
    this.email = email;
    this.dataNascimento = dataNascimento;
    this.trofeus = trofeus;
    this.horasJogadas = horasJogadas;
  }
}
