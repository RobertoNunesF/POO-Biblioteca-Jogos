import path from "path";
import dotenv from "dotenv";
import prompt from "prompt-sync";
import { Biblioteca } from "./models/Biblioteca";
import { Jogador } from "./models/Jogador";
import { Jogo } from "./models/Jogo";
import { gerarHtmlPerfis } from "./services/Exportador";
import { buscarJogosSteam, buscarPerfilSteam, buscarConquistasSteam, resolveVanityUrl } from "./services/Steam";
import { MENU_OPTIONS, MENU_TEXT } from "./constants/Constantes";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const teclado = prompt();

let opcao = 0;
const biblioteca = new Biblioteca();

async function main() {
  while (opcao != MENU_OPTIONS.SAIR) {
    console.log(MENU_TEXT);
    opcao = +teclado("Escolha a opção: ");

    switch (opcao) {
      case MENU_OPTIONS.CADASTRAR_JOGADOR:
        cadastrarJogador();
        break;

      case MENU_OPTIONS.LISTAR_JOGADOR:
        console.table(biblioteca.listarJogadores());
        break;

      case MENU_OPTIONS.CADASTRAR_JOGO:
        cadastrarJogo();
        break;

      case MENU_OPTIONS.LISTAR_JOGOS:
        console.table(biblioteca.listarJogos());
        break;

      case MENU_OPTIONS.EDITAR_JOGO:
        console.log("Implementação posterior");
        break;

      case MENU_OPTIONS.EXCLUIR_JOGO:
        console.log("Implementação posterior");
        break;

      case MENU_OPTIONS.IMPORTAR_STEAM:
        await exportarSteam();
        break;

      case MENU_OPTIONS.EXPORTAR_HTML:
        exportarHTML();
        break;

      case MENU_OPTIONS.SAIR:
        console.log("Até logo!");
        break;

      default:
        console.log("Opção Inválida!");
        break;
    }

    if (opcao !== MENU_OPTIONS.SAIR) {
      pausar();
    }
  }
}

function pausar(): void {
  teclado("Pressione ENTER para continuar...");
}

function selecionarJogador(): Jogador | null {
  if (biblioteca.listarJogadores().length === 0) return null;
  console.log("Jogadores cadastrados:");
  biblioteca.listarJogadores().forEach((j, i) => console.log(`[${i + 1}] ${j.nickname}`));
  const idx = +teclado("Selecione o jogador (número): ") - 1;
  return idx >= 0 && idx < biblioteca.listarJogadores().length ? biblioteca.listarJogadores()[idx] : null;
}

function cadastrarJogador(): void {
  const jogador = new Jogador();

  const nome = teclado("Nome do Jogador: ");

  const nickname = teclado("Nickname: ");

  const email = teclado("Email: ");

  const dataNascimento = teclado("Data de Nascimento (DD/MM/AAAA): ");

  // Para um novo jogador, os totais de troféus e horas começam em 0
  const totalTrofeus = 0;
  const totalHoras = 0;

  try {
    jogador.cadastrarJogador(nome, nickname, email, dataNascimento, totalTrofeus, totalHoras);
    biblioteca.adicionarJogador(jogador);
  } catch (e) {
    console.log((e as Error).message);
  }
}

function cadastrarJogo(): void {
  const jogo = new Jogo();

  const nome = teclado("Nome do Jogo: ");
  const genero = teclado("Gênero: ");
  const horas = +teclado("Horas jogadas: ");
  const visivel = teclado("Jogo visível? (S/N) ").toUpperCase().charAt(0) === "S";

  const conquistas: { nome: string; desbloqueado: boolean; icone: string }[] = [];
  const adicionarTrofeus = teclado("Adicionar nomes de troféus? (S/N) ").toUpperCase().charAt(0) === "S";
  if (adicionarTrofeus) {
    console.log("Digite o nome de cada troféu (deixe em branco para terminar):");
    while (true) {
      const nomeTrofeu = teclado("Troféu: ").trim();
      if (!nomeTrofeu) break;
      conquistas.push({ nome: nomeTrofeu, desbloqueado: true, icone: "" });
    }
  }
  const trofeus = conquistas.length > 0 ? conquistas.length : +teclado("Troféus (número): ");

  try {
    jogo.cadastrarJogo(nome, genero, trofeus, visivel, horas);
    jogo.conquistas = conquistas;
    biblioteca.jogos.push(jogo);
    if (biblioteca.jogadores.length > 0) {
      const jogador = selecionarJogador();
      if (jogador) jogador.adicionarJogo(jogo);
    }
  } catch (e) {
    console.log((e as Error).message);
  }
}

async function exportarSteam(): Promise<void> {
  const apiKey = process.env.STEAM_API_KEY?.trim().replace(/^"|"$/g, "") ?? "";
  const steamIdInput = teclado("Seu Steam ID ou vanity URL: ").trim();

  if (!apiKey) {
    console.log("STEAM_API_KEY não definida. Verifique o arquivo .env.");
    return;
  }

  if (!steamIdInput) {
    console.log("Steam ID inválido. Informe um SteamID64 ou vanity URL válido.");
    return;
  }

  console.log("Buscando perfil e jogos na Steam...");

  try {
    const steamId = await resolveVanityUrl(steamIdInput, apiKey);
    const perfil = await buscarPerfilSteam(steamId, apiKey);
    const dadosSteam = await buscarJogosSteam(steamId, apiKey);

    const jogador = new Jogador();
    jogador.nickname = perfil.personaname;
    jogador.nome = perfil.personaname;
    biblioteca.jogadores.push(jogador);

    for (const item of dadosSteam) {
      const jogo = new Jogo();
      jogo.nome = item.name;
      jogo.genero = "Steam";
      jogo.horasJogadas = Math.round(item.playtime_forever / 60);
      jogo.trofeus = 0;
      jogo.ativo = true;
      jogo.appId = item.appid;
      biblioteca.jogos.push(jogo);
      jogador.adicionarJogo(jogo);
    }

    const jogosComHoras = jogador.jogos.filter((j) => j.horasJogadas > 0 && j.appId !== undefined);
    console.log(`Buscando conquistas de ${jogosComHoras.length} jogo(s) com horas jogadas...`);
    for (const jogo of jogosComHoras) {
      const conquistas = await buscarConquistasSteam(steamId, jogo.appId!, apiKey);
      jogo.conquistas = conquistas;
      jogo.trofeus = conquistas.filter((c) => c.desbloqueado).length;
    }

    console.log(`Perfil "${perfil.personaname}" importado com ${dadosSteam.length} jogos!`);
  } catch (erro) {
    console.log(`Erro ao buscar dados da Steam: ${erro instanceof Error ? erro.message : String(erro)}`);
  }
}

function exportarHTML(): void {
  if (biblioteca.jogadores.length === 0) {
    console.log("Nenhum jogador cadastrado para exportar!");
  } else {
    gerarHtmlPerfis(biblioteca.jogadores);
  }
}

main();
