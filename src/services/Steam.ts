import * as https from "https";

function httpsGet(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const req = https.get(url, (res) => {
      let data = "";
      res.on("data", (chunk: string) => (data += chunk));
      res.on("end", () => {
        if (res.statusCode && res.statusCode >= 400) {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        } else {
          resolve(data);
        }
      });
      res.on("error", reject);
    });

    req.on("error", reject);
    req.setTimeout(15000, () => {
      req.destroy(new Error("Timeout de conexão ao acessar a API Steam."));
    });
  });
}

function isSteamId64(value: string): boolean {
  return /^\d{17}$/.test(value);
}

function extractSteamIdentifier(value: string): string {
  let id = value.trim();
  if (!id) return id;

  try {
    const url = new URL(id);
    id = url.pathname.replace(/^\/+/, "");
  } catch {
    // não é URL, continua como está
  }

  if (id.startsWith("profiles/")) {
    return id.replace(/^profiles\//, "");
  }
  if (id.startsWith("id/")) {
    return id.replace(/^id\//, "");
  }
  return id;
}

export async function resolveVanityUrl(steamIdOrVanity: string, apiKey: string): Promise<string> {
  if (!apiKey) {
    throw new Error("STEAM_API_KEY está vazio ou não definido.");
  }

  const identifier = extractSteamIdentifier(steamIdOrVanity);
  if (isSteamId64(identifier)) {
    return identifier;
  }

  const url = `https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1/?key=${apiKey}&vanityurl=${encodeURIComponent(identifier)}`;
  const data = await httpsGet(url);
  const json = JSON.parse(data);
  if (json.response?.success !== 1) {
    throw new Error(`Não foi possível resolver vanity URL: ${identifier}`);
  }
  return json.response.steamid;
}

export async function buscarPerfilSteam(steamId: string, apiKey: string): Promise<{ personaname: string }> {
  if (!apiKey) {
    throw new Error("STEAM_API_KEY não definido.");
  }
  if (!isSteamId64(steamId)) {
    throw new Error("Steam ID inválido. Use SteamID64 ou vanity URL resolvível.");
  }

  const url = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${steamId}`;
  try {
    const data = await httpsGet(url);
    const json = JSON.parse(data);
    const player = json.response?.players?.[0];
    if (!player) {
      throw new Error("Perfil Steam não encontrado ou não acessível.");
    }
    return player;
  } catch (error) {
    throw new Error(`Erro ao buscar perfil Steam: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function buscarConquistasSteam(
  steamId: string,
  appId: number,
  apiKey: string,
): Promise<{ nome: string; desbloqueado: boolean; icone: string }[]> {
  if (!apiKey) {
    throw new Error("STEAM_API_KEY não definido.");
  }
  if (!isSteamId64(steamId)) {
    throw new Error("Steam ID inválido. Use SteamID64 ou vanity URL resolvível.");
  }

  const playerUrl = `https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid=${appId}&key=${apiKey}&steamid=${steamId}&l=portuguese`;
  const schemaUrl = `https://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/?appid=${appId}&key=${apiKey}&l=portuguese`;
  try {
    const [playerRaw, schemaRaw] = await Promise.all([httpsGet(playerUrl), httpsGet(schemaUrl)]);
    const playerJson = JSON.parse(playerRaw);
    const schemaJson = JSON.parse(schemaRaw);
    if (!playerJson.playerstats?.success || !playerJson.playerstats?.achievements) return [];
    const schemaAchs: any[] = schemaJson.game?.availableGameStats?.achievements ?? [];
    const iconMap: Record<string, { icon: string; icongray: string }> = {};
    for (const a of schemaAchs) {
      iconMap[a.name] = { icon: a.icon, icongray: a.icongray };
    }
    return playerJson.playerstats.achievements.map((a: any) => ({
      nome: a.name || a.apiname,
      desbloqueado: a.achieved === 1,
      icone: a.desbloqueado ? (iconMap[a.apiname]?.icon ?? "") : (iconMap[a.apiname]?.icongray ?? ""),
    }));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes("Requested app has no stats")) {
      return [];
    }
    throw new Error(`Erro ao buscar conquistas Steam: ${message}`);
  }
}

export async function buscarJogosSteam(steamId: string, apiKey: string): Promise<any[]> {
  if (!apiKey) {
    throw new Error("STEAM_API_KEY não definido.");
  }
  if (!isSteamId64(steamId)) {
    throw new Error("Steam ID inválido. Use SteamID64 ou vanity URL resolvível.");
  }

  const url = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${apiKey}&steamid=${steamId}&include_appinfo=true&include_played_free_games=true`;
  const data = await httpsGet(url);
  try {
    const json = JSON.parse(data);
    return json.response?.games ?? [];
  } catch (error) {
    throw new Error(`Erro ao parsear resposta da Steam: ${error instanceof Error ? error.message : String(error)}`);
  }
}
