Para o jogador: colocar um boolean para saber se pode mostrar informações (nome real, id, nickname) ou se mostra somente nickname (criar condicional se o boolean for false?)

Para cadastrar o jogador, como é privado, temos que criar novas entidades e puxar, conforme aula: let nomeDigitado prompt('Nome real do jogador: '); let idDigitado = Number(prompt('ID: ')); let nickDigitado = prompt('Informe seu nick: ');
let Jogador = new Jogador(nomeDigitado,idDigitado,nickDigitado);
