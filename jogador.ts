export class Jogador {
  private _nome: string;
  private _nickname: string;
  private _email: string;
  private _dataNascimento: string;
  private _trofeus: number;
  private _horasJogadas: number;

  constructor() {
    this._nome = "";
    this._nickname = "";
    this._email = "";
    this._dataNascimento = "";
    this._trofeus = 0;
    this._horasJogadas = 0;
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
    this._email = value;
  }

  set dataNascimento(value: string) {
    this._dataNascimento = value;
  }

  set trofeus(value: number) {
    this._trofeus = value;
  }

  set horasJogadas(value: number) {
    this._horasJogadas = value;
  }

  cadastrarJogador(nome: string, nickname: string, email: string, dataNascimento: string, trofeus: number, horasJogadas: number): void {
    if (!nome || nome.length <= 2) {
      throw new Error("Coloque seu nome completo");
    }
    if (!nickname) {
      throw new Error("Coloque seu nickname correto");
    }

    this._nome = nome;
    this._nickname = nickname;
    this._email = email;
    this._dataNascimento = dataNascimento;
    this._trofeus = trofeus;
    this._horasJogadas = horasJogadas;
  }
}
