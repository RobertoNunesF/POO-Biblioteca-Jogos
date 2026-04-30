# Alterações do Projeto — Biblioteca de Jogos

## `jogo.ts`

### Campo `conquistas`
```typescript
private _conquistas: { nome: string; desbloqueado: boolean; icone: string }[];
```
Armazena a lista de conquistas (troféus) de cada jogo. Cada conquista tem:
- `nome` — nome exibido da conquista
- `desbloqueado` — se o jogador já desbloqueou
- `icone` — URL do ícone vindo da Steam (vazio em jogos manuais)

Getter e setter adicionados normalmente seguindo o padrão do projeto.

---

## `jogador.ts`

### Import de `Jogo`
```typescript
import { Jogo } from "./jogo";
```

### Campo `_jogos`
```typescript
private _jogos: Jogo[];
```
Cada `Jogador` agora tem sua própria biblioteca de jogos, separada dos outros jogadores.

### Getter `jogos`
```typescript
get jogos(): Jogo[] { ... }
```

### Método `adicionarJogo`
```typescript
adicionarJogo(jogo: Jogo): void { ... }
```
Adiciona um jogo à biblioteca do jogador. Usado tanto no cadastro manual quanto na importação da Steam.

---

## `steam.ts`

### Helper interno `httpsGet`
```typescript
function httpsGet(url: string): Promise<string> { ... }
```
Centraliza as requisições HTTPS para evitar repetição de código. Todas as funções da Steam passaram a usar ela.

### Função `buscarPerfilSteam`
```typescript
export async function buscarPerfilSteam(steamId, apiKey): Promise<{ personaname: string }>
```
Chama o endpoint `ISteamUser/GetPlayerSummaries` para obter o nome de exibição do perfil Steam. Usada para criar o `Jogador` automaticamente ao importar, sem precisar de cadastro prévio.

### Função `buscarJogosSteam` (refatorada)
Mantém o comportamento original mas agora usa o helper `httpsGet` e `async/await` no lugar de callbacks.

### Função `buscarConquistasSteam`
```typescript
export async function buscarConquistasSteam(steamId, appId, apiKey): Promise<{ nome, desbloqueado, icone }[]>
```
Faz **duas requisições em paralelo** com `Promise.all`:
- `GetPlayerAchievements` — quais conquistas o jogador desbloqueou, com nomes em português (`&l=portuguese`)
- `GetSchemaForGame` — dados de cada conquista do jogo, incluindo URLs dos ícones coloridos e cinza

As duas respostas são cruzadas pelo `apiname` para montar a lista final. Só é chamada para jogos com `horasJogadas > 0` para reduzir o número de requisições.

---

## `Main.ts`

### Import atualizado
```typescript
import { gerarHtmlJogos, gerarHtmlPerfis } from "./exportador";
import { buscarJogosSteam, buscarPerfilSteam, buscarConquistasSteam } from "./steam";
```

### Função `selecionarJogador` (nova)
```typescript
function selecionarJogador(): Jogador | null { ... }
```
Exibe a lista de jogadores cadastrados e retorna o escolhido pelo número. Usada no cadastro de jogo manual para vincular ao jogador correto.

### `cadastrarJogo` (atualizada)
- Pergunta se o usuário quer adicionar **nomes de troféus** manualmente
- Se sim: entra em loop pedindo um nome por vez até o usuário deixar em branco. O contador de troféus é derivado automaticamente da quantidade inserida
- Se não: pede o número de troféus normalmente
- Ao final, pergunta a qual jogador cadastrado vincular o jogo (se houver algum)

### `exportarSteam` (reescrita)
Fluxo anterior exigia um jogador já cadastrado. O novo fluxo:
1. Pede o Steam ID
2. Chama `buscarPerfilSteam` → cria o `Jogador` automaticamente com o nome do perfil Steam
3. Chama `buscarJogosSteam` → adiciona cada jogo à biblioteca do jogador
4. Filtra os jogos com `horasJogadas > 0` e chama `buscarConquistasSteam` para cada um
5. Salva as conquistas no jogo e calcula `trofeus` a partir delas

Perfis manuais e perfis Steam são completamente independentes.

### `exportarHTML` (atualizada)
Passou a chamar `gerarHtmlPerfis(jogadores)` em vez de `gerarHtmlJogos(jogos)`.

---

## `exportador.ts`

### Função `gerarHtmlPerfis` (nova)
Gera o `biblioteca.html` com três views navegáveis via JavaScript puro, sem frameworks:

#### View 1 — Perfis
Grid de cards com um perfil por jogador. Exibe:
- Inicial do nickname num círculo
- Nickname e nome completo
- Total de jogos, horas e troféus (calculados a partir dos jogos do jogador)

Clicar num card abre a View 2 daquele jogador.

#### View 2 — Biblioteca
Grid de jogos do jogador selecionado, ordenados por **horas jogadas decrescente** (mais jogados primeiro). Cada card exibe imagem, gênero, horas e troféus.

Clicar num jogo abre a View 3. Botão **Voltar** retorna à View 1.

#### View 3 — Conquistas
Lista de conquistas do jogo clicado. Cada item mostra:
- Ícone da conquista (colorido se desbloqueada, cinza se não)
- Indicador `[X]` ou `[ ]`
- Nome da conquista

Jogos sem conquistas (manuais ou sem achievements na Steam) exibem "Nenhuma conquista registrada". Botão **Voltar** retorna à View 2.

