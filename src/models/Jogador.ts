import { Jogo } from "./Jogo";

export class Jogador {
  private _nome: string;
  private _nickname: string;
  private _email: string;
  private _dataNascimento: string;
  private _trofeus: number;
  private _horasJogadas: number;
  private _jogos: Jogo[];

  constructor() {
    this._nome = "";
    this._nickname = "";
    this._email = "";
    this._dataNascimento = "";
    this._trofeus = 0;
    this._horasJogadas = 0;
    this._jogos = [];
  }

  get nome(): string {
    return this._nome;
  }

  get nickname(): string {
    return this._nickname;
  }

  get email(): string {
    return this._email;
  }

  get dataNascimento(): string {
    return this._dataNascimento;
  }

  get trofeus(): number {
    return this._trofeus;
  }

  get horasJogadas(): number {
    return this._horasJogadas;
  }

  set nome(value: string) {
    this._nome = value;
  }

  set nickname(value: string) {
    this._nickname = value;
  }

  set email(value: string) {
    if (!value || !value.includes("@") || !value.includes(".")) {
      throw new Error("Email inválido");
    }
    this._email = value;
  }

  set dataNascimento(value: string) {
    this._dataNascimento = value;
  }

  set trofeus(value: number) {
    if (value < 0 || !Number.isInteger(value)) {
      throw new Error("Trofeus deve ser um número inteiro positivo");
    }
    this._trofeus = value;
  }

  set horasJogadas(value: number) {
    if (value < 0 || !Number.isInteger(value)) {
      throw new Error("Horas jogadas deve ser um número inteiro positivo");
    }
    this._horasJogadas = value;
  }

  get jogos(): Jogo[] {
    return this._jogos;
  }

  adicionarJogo(jogo: Jogo): void {
    this._jogos.push(jogo);
  }

  getTotalHoras(): number {
    return this._jogos.reduce((soma, jogo) => soma + jogo.horasJogadas, 0);
  }

  getTotalTrofeus(): number {
    return this._jogos.reduce((soma, jogo) => soma + jogo.trofeus, 0);
  }

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
    this._dataNascimento = dataNascimento;
    this.trofeus = trofeus;
    this.horasJogadas = horasJogadas;
  }
}
