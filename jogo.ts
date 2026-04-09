export class Jogo {
  nome: string;
  genero: string;
  trofeus: number;
  ativo: boolean;
  horasJogadas: number;
  appId?: number;

  constructor() {
    this.nome = "";
    this.genero = "";
    this.trofeus = 0;
    this.ativo = false;
    this.horasJogadas = 0;
  }

  cadastrarJogo(nome: string, genero: string, trofeus: number, ativo: boolean, horasJogadas: number): void {
    if (!nome || nome.length <= 2) {
      throw new Error("Nome jogo inválido");
    }
    if (!genero) {
      throw new Error("Gênero não informado");
    }

    this.nome = nome;
    this.genero = genero;
    this.trofeus = trofeus;
    this.ativo = ativo;
    this.horasJogadas = horasJogadas;
  }
}
