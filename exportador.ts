import * as fs from "fs";
import { Jogo } from "./jogo";


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