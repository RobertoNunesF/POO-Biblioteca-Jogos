import { Jogador } from "./Jogador";

export class JogadorSteam extends Jogador {
  private _steamId: string;

  constructor(steamId: string) {
    super();
    this._steamId = steamId;
  }

  get steamId(): string {
    return this._steamId;
  }

  set steamId(value: string) {
    this._steamId = value;
  }
}
