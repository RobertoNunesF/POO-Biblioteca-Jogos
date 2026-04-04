export class Jogo {
  nome: string;
  genero: string;
  trofeus: number;
  ativo: boolean;
  horas_jogadas: number;
  appId?: number; 

  constructor() {
    this.nome = "";
    this.genero = "";
    this.trofeus = 0;
    this.ativo = false;
    this.horas_jogadas = 0;
  }
}