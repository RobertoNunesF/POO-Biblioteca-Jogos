//Classe
export class Jogo {
  nome: string;
  genero: string;
  trofeus: number;
  ativo: boolean;
  horas_jogadas: number;

  // Campos/Atributos/Características
  constructor() {
    this.nome = "";
    this.genero = "";
    this.trofeus = 0;
    this.ativo = false;
    this.horas_jogadas = 0;
  }

  //Comportamento/Ações
}

export class Jogador {
  nome: string;
  id: number = 0;
  apelido: string;

  constructor(nome: string, id: number, apelido: string) {
    this.nome = nome;
    this.id = id;
    this.apelido = apelido;
  }
}
