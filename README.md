**Projeto**

- **Descrição:** Biblioteca de jogos em TypeScript para cadastro, importação via Steam e exportação HTML.

**Requisitos**

- **Node:** versão 16+ recomendada
- **NPM:** versão compatível com Node

**Instalação**

- **Instala dependências:**

```bash
npm install
```

**Configuração de ambiente**

- **Arquivo .env:** coloque sua chave da Steam em `.env` na raiz do projeto com a variável `STEAM_API_KEY`.
- **Arquivo ignorado:** `.env` já está listado em [.gitignore](.gitignore) para não ser comitado.

Exemplo de `.env`:

```text
STEAM_API_KEY=insira_sua_chave_aqui
```

**Execução**

- **Modo desenvolvimento (executa diretamente com ts-node):**

```bash
npm run dev
```

- **Compilar + executar (produção):**

```bash
npm run build
npm start
```

**Testes**

- Executar suíte de testes:

```bash
npm test
```

**Pontos importantes / notas**

- O ponto de entrada do projeto é `src/Main.ts` — o script `dev` foi ajustado para `ts-node src/Main.ts` para evitar problemas em sistemas case-sensitive como Linux.
- O carregamento das variáveis de ambiente é feito em [src/Main.ts](src/Main.ts) via `dotenv.config({ path: path.resolve(__dirname, "../.env") })`.
- Campos do modelo `Jogador` foram alterados de `private` para `protected` para permitir acesso por subclasses sem expor os campos publicamente; os getters/setters foram mantidos para validação e segurança.

**Arquivos úteis**

- Código principal: [src/Main.ts](src/Main.ts)
- Modelo principal: [src/models/Jogador.ts](src/models/Jogador.ts)
- Decisões tomadas: [DECISIONS.txt](DECISIONS.txt)

**Sugestões futuras**

- Usar variáveis de ambiente com gerenciador de segredos em produção.
- Extrair chamadas à Steam para serviços injetáveis para facilitar testes e mocking.

