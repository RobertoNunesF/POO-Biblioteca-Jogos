//Classe
export class Jogo {
  nome: string;
  genero: string;
  trofeus: number;
  ativo: boolean;
  horas_jogadas: number;

  // Campos/Atributos/Características
  constructor(nome: string, genero: string, trofeus: number, ativo: boolean, horas_jogadas: number) {
    this.nome = nome;
    this.genero = genero;
    this.trofeus = trofeus;
    this.ativo = ativo;
    this.horas_jogadas = horas_jogadas;
  }

  //Comportamento/Ações
}

export class Jogador {
  private nome: string = "";
  private id: number = 0;
  private apelido: string = "";
}
