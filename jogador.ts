export class Jogador {
  nome: string;
  nickname: string;
  email: string;
  dataNascimento: string;
  trofeus: number;
  horasJogadas: number;

  constructor() {
    this.nome = "";
    this.nickname = "";
    this.email = "";
    this.dataNascimento = "";
    this.trofeus = 0;
    this.horasJogadas = 0;
  }

  cadastrarJogador(nome: string, nickname: string, email: string, dataNascimento: string, trofeus: number, horasJogadas: number): void {
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
