export class Jogo {
  private _nome: string;
  private _genero: string;
  private _trofeus: number;
  private _ativo: boolean;
  private _horasJogadas: number;
  private _appId?: number;
  private _conquistas: { nome: string; desbloqueado: boolean; icone: string }[];

  constructor() {
    this._nome = "";
    this._genero = "";
    this._trofeus = 0;
    this._ativo = false;
    this._horasJogadas = 0;
    this._conquistas = [];
  }

  get nome(): string {
    return this._nome;
  }

  get genero(): string {
    return this._genero;
  }

  get trofeus(): number {
    return this._trofeus;
  }

  get ativo(): boolean {
    return this._ativo;
  }

  get horasJogadas(): number {
    return this._horasJogadas;
  }

  get appId(): number | undefined {
    return this._appId;
  }

  set nome(value: string) {
    this._nome = value;
  }

  set genero(value: string) {
    this._genero = value;
  }

  set trofeus(value: number) {
    this._trofeus = value;
  }

  set ativo(value: boolean) {
    this._ativo = value;
  }

  set horasJogadas(value: number) {
    this._horasJogadas = value;
  }

  set appId(value: number | undefined) {
    this._appId = value;
  }

  get conquistas(): { nome: string; desbloqueado: boolean; icone: string }[] {
    return this._conquistas;
  }

  set conquistas(value: { nome: string; desbloqueado: boolean; icone: string }[]) {
    this._conquistas = value;
  }

  cadastrarJogo(nome: string, genero: string, trofeus: number, ativo: boolean, horasJogadas: number): void {
    if (!nome || nome.length <= 2) {
      throw new Error("Nome jogo inválido");
    }
    if (!genero || genero.trim().length < 3) {
      throw new Error("Gênero inválido");
    }

    this._nome = nome;
    this._genero = genero;
    this._trofeus = trofeus;
    this._ativo = ativo;
    this._horasJogadas = horasJogadas;
  }
}
