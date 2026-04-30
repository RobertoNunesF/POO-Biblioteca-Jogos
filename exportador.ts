import * as fs from "fs";
import { Jogo } from "./jogo";
import { Jogador } from "./jogador";


export function gerarHtmlJogos(listaJogos: Jogo[]) {
  const listaOrdenada = [...listaJogos].sort((a, b) => (b.horasJogadas || 0) - (a.horasJogadas || 0));

  const itensHtml = listaOrdenada.map(jogo => {
    const imagem = jogo.appId 
      ? `https://cdn.akamai.steamstatic.com/steam/apps/${jogo.appId}/header.jpg`
      : "https://via.placeholder.com/460x215?text=Sem+Imagem";

    return `
      <div class="card">
        <img src="${imagem}" alt="${jogo.nome}">
        <div class="info">
          <h3>${jogo.nome}</h3>
          <p><strong>Gênero:</strong> ${jogo.genero}</p>
          <p><strong>Horas:</strong> ${jogo.horasJogadas}h</p>
        </div>
      </div>
    `;
  }).join("");

  const template = `
    <!DOCTYPE html>
    <html lang="pt-br">
    <head>
        <meta charset="UTF-8">
        <title>Minha Biblioteca de Jogos</title>
        <style>
            body { font-family: sans-serif; background: #1b2838; color: white; padding: 20px; }
            h1 { text-align: center; color: #66c0f4; }
            .grid { 
                display: grid; 
                grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); 
                gap: 20px; 
                padding: 20px;
            }
            .card { 
                background: #2a475e; 
                border-radius: 8px; 
                overflow: hidden; 
                transition: transform 0.2s;
                box-shadow: 0 4px 15px rgba(0,0,0,0.5);
            }
            .card:hover { transform: scale(1.05); }
            .card img { width: 100%; display: block; }
            .info { padding: 15px; }
            h3 { margin: 0 0 10px 0; font-size: 1.2em; color: #fff; }
            p { margin: 5px 0; font-size: 0.9em; color: #acb2b8; }
        </style>
    </head>
    <body>
        <h1>Meus jogos importados!</h1>
        <div class="grid">
            ${itensHtml}
        </div>
    </body>
    </html>
  `;

  fs.writeFileSync("biblioteca.html", template);
  console.log("Arquivo 'biblioteca.html' gerado com sucesso!");
}

export function gerarHtmlPerfis(jogadores: Jogador[]): void {
  const dados = jogadores.map(j => ({
    nickname: j.nickname,
    nome: j.nome,
    inicial: j.nickname.charAt(0).toUpperCase(),
    totalJogos: j.jogos.length,
    totalHoras: j.jogos.reduce((s, jg) => s + jg.horasJogadas, 0),
    totalTrofeus: j.jogos.reduce((s, jg) => s + jg.trofeus, 0),
    jogos: [...j.jogos].sort((a, b) => b.horasJogadas - a.horasJogadas).map(jg => ({
      nome: jg.nome,
      genero: jg.genero,
      horasJogadas: jg.horasJogadas,
      trofeus: jg.trofeus,
      imagem: jg.appId
        ? "https://cdn.akamai.steamstatic.com/steam/apps/" + jg.appId + "/header.jpg"
        : "https://via.placeholder.com/460x215?text=Sem+Imagem",
      conquistas: jg.conquistas,
    })),
  }));

  const perfilCards = dados.map((d, i) => `
    <div class="card perfil-card" onclick="mostrarBiblioteca(${i})">
      <div class="avatar">${d.inicial}</div>
      <h2>${d.nickname}</h2>
      <p class="nome-real">${d.nome}</p>
      <div class="stats">
        <span>${d.totalJogos} jogo(s)</span>
        <span>${d.totalHoras}h jogadas</span>
        <span>${d.totalTrofeus} trofeus</span>
      </div>
    </div>
  `).join("");

  const template = `<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <title>Biblioteca de Jogos</title>
  <style>
    body { font-family: sans-serif; background: #1b2838; color: white; padding: 20px; }
    h1 { text-align: center; color: #66c0f4; }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 20px;
      padding: 20px;
    }
    .card {
      background: #2a475e;
      border-radius: 8px;
      overflow: hidden;
      transition: transform 0.2s;
      box-shadow: 0 4px 15px rgba(0,0,0,0.5);
    }
    .card:hover { transform: scale(1.05); }
    .perfil-card {
      padding: 25px 20px;
      text-align: center;
      cursor: pointer;
    }
    .avatar {
      width: 72px; height: 72px;
      border-radius: 50%;
      background: #1b2838;
      color: white;
      font-size: 2em;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 15px;
    }
    .perfil-card h2 { color: #66c0f4; font-size: 1.2em; margin: 0 0 4px 0; }
    .nome-real { font-size: 0.9em; color: #acb2b8; margin: 5px 0; }
    .stats { margin-top: 10px; }
    .stats span { display: block; font-size: 0.9em; color: #acb2b8; margin: 5px 0; }
    .jogo-card { cursor: pointer; }
    .jogo-card img { width: 100%; display: block; }
    .jogo-card .info { padding: 15px; }
    .jogo-card h3 { margin: 0 0 10px 0; font-size: 1.2em; color: #fff; }
    .jogo-card p { margin: 5px 0; font-size: 0.9em; color: #acb2b8; }
    .sem-jogos { text-align: center; color: #acb2b8; padding: 40px; grid-column: 1/-1; }
    #view-biblioteca { display: none; }
    #view-conquistas { display: none; }
    .topo-biblioteca {
      display: flex;
      align-items: center;
      gap: 20px;
      margin-bottom: 20px;
    }
    .btn-voltar {
      background: #2a475e;
      color: white;
      border: none;
      padding: 8px 18px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.9em;
      box-shadow: 0 4px 15px rgba(0,0,0,0.5);
    }
    .btn-voltar:hover { transform: scale(1.05); }
    #titulo-biblioteca { color: #66c0f4; }
    #titulo-conquistas { color: #66c0f4; }
    .conquista-lista { padding: 20px; max-width: 700px; margin: 0 auto; }
    .conquista-item {
      background: #2a475e;
      border-radius: 6px;
      padding: 10px 15px;
      margin-bottom: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.4);
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .conquista-item.desbloqueada { color: white; }
    .conquista-item.bloqueada { color: #acb2b8; }
    .conquista-icone { width: 32px; height: 32px; border-radius: 4px; flex-shrink: 0; }
    .conquista-status { font-weight: bold; flex-shrink: 0; }
    .desbloqueada .conquista-status { color: #66c0f4; }
    .bloqueada .conquista-status { color: #acb2b8; }
    .sem-conquistas { text-align: center; color: #acb2b8; padding: 40px; }
  </style>
</head>
<body>
  <div id="view-perfis">
    <h1>Perfis</h1>
    <div class="grid">
      ${perfilCards}
    </div>
  </div>
  <div id="view-biblioteca">
    <div class="topo-biblioteca">
      <button class="btn-voltar" onclick="voltarPerfis()">&#8592; Voltar</button>
      <h1 id="titulo-biblioteca"></h1>
    </div>
    <div class="grid" id="grid-jogos"></div>
  </div>
  <div id="view-conquistas">
    <div class="topo-biblioteca">
      <button class="btn-voltar" onclick="voltarBiblioteca()">&#8592; Voltar</button>
      <h1 id="titulo-conquistas"></h1>
    </div>
    <div class="conquista-lista" id="lista-conquistas"></div>
  </div>
  <script>
    var dados = ${JSON.stringify(dados)};
    var jogadorAtual = 0;

    function mostrarBiblioteca(index) {
      jogadorAtual = index;
      var j = dados[index];
      document.getElementById('titulo-biblioteca').textContent = j.nickname;
      var grid = document.getElementById('grid-jogos');
      if (j.jogos.length === 0) {
        grid.innerHTML = '<p class="sem-jogos">Nenhum jogo na biblioteca.</p>';
      } else {
        grid.innerHTML = j.jogos.map(function(jg, ji) {
          return '<div class="card jogo-card" onclick="mostrarConquistas(' + index + ',' + ji + ')">' +
            '<img src="' + jg.imagem + '" alt="">' +
            '<div class="info">' +
            '<h3>' + jg.nome + '</h3>' +
            '<p><strong>Genero:</strong> ' + jg.genero + '</p>' +
            '<p><strong>Horas:</strong> ' + jg.horasJogadas + 'h</p>' +
            '<p><strong>Trofeus:</strong> ' + jg.trofeus + '</p>' +
            '</div></div>';
        }).join('');
      }
      document.getElementById('view-perfis').style.display = 'none';
      document.getElementById('view-conquistas').style.display = 'none';
      document.getElementById('view-biblioteca').style.display = 'block';
    }

    function mostrarConquistas(jogIdx, jogoIdx) {
      var jg = dados[jogIdx].jogos[jogoIdx];
      document.getElementById('titulo-conquistas').textContent = jg.nome;
      var lista = document.getElementById('lista-conquistas');
      if (!jg.conquistas || jg.conquistas.length === 0) {
        lista.innerHTML = '<p class="sem-conquistas">Nenhuma conquista registrada.</p>';
      } else {
        lista.innerHTML = jg.conquistas.map(function(c) {
          var cls = c.desbloqueado ? 'desbloqueada' : 'bloqueada';
          var status = c.desbloqueado ? '[X]' : '[ ]';
          var iconeHtml = c.icone ? '<img class="conquista-icone" src="' + c.icone + '" alt="">' : '';
          return '<div class="conquista-item ' + cls + '">' +
            iconeHtml +
            '<span class="conquista-status">' + status + '</span>' +
            c.nome +
            '</div>';
        }).join('');
      }
      document.getElementById('view-biblioteca').style.display = 'none';
      document.getElementById('view-conquistas').style.display = 'block';
    }

    function voltarBiblioteca() {
      document.getElementById('view-conquistas').style.display = 'none';
      document.getElementById('view-biblioteca').style.display = 'block';
    }

    function voltarPerfis() {
      document.getElementById('view-perfis').style.display = '';
      document.getElementById('view-biblioteca').style.display = 'none';
    }
  </script>
</body>
</html>`;

  fs.writeFileSync("biblioteca.html", template);
  console.log("Arquivo 'biblioteca.html' gerado com sucesso!");
}