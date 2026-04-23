import { describe, expect, it, test } from "@jest/globals";
import { Jogo } from "./jogo";
import { cadastrarJogo } from "./Main";

describe("QUANDO CADASTRAR UM NOVO JOGO", () => {
  it("DEVE LANÇAR ERRO SE O NOME FOR VAZIO", () => {
    const jogo = new Jogo();

    expect(() => {
      jogo.cadastrarJogo("", "RPG", 10, true, 20);
    }).toThrow("Nome jogo inválido");
  });

  it("DEVE CADASTRAR JOGO COM DADOS VÁLIDOS", () => {
    const jogo = new Jogo();

    jogo.cadastrarJogo("Pokemon", "RPG", 0, true, 20);

    expect(jogo.nome).toBe("Pokemon");
    expect(jogo.genero).toBe("RPG");
  });

  it("DEVE LANÇAR ERRO SE O GÊNERO TIVER TAMANHO MENOR QUE 3", () => {
    const jogo = new Jogo();

    expect(() => {
      jogo.cadastrarJogo("Pokemon", "RP", 0, true, 20);
    }).toThrow("Gênero inválido");
  });
});
