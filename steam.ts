import * as https from "https";

function httpsGet(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = "";
      res.on("data", (chunk: string) => (data += chunk));
      res.on("end", () => resolve(data));
      res.on("error", reject);
    });
  });
}

export async function buscarPerfilSteam(steamId: string, apiKey: string): Promise<{ personaname: string }> {
  const url = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${steamId}`;
  try {
    const data = await httpsGet(url);
    const json = JSON.parse(data);
    const player = json.response?.players?.[0];
    return player ?? { personaname: "Jogador Steam" };
  } catch {
    return { personaname: "Jogador Steam" };
  }
}

export async function buscarConquistasSteam(steamId: string, appId: number, apiKey: string): Promise<{ nome: string; desbloqueado: boolean; icone: string }[]> {
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
      icone: a.achieved === 1 ? (iconMap[a.apiname]?.icon ?? "") : (iconMap[a.apiname]?.icongray ?? ""),
    }));
  } catch {
    return [];
  }
}

export async function buscarJogosSteam(steamId: string, apiKey: string): Promise<any[]> {
  const url = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${apiKey}&steamid=${steamId}&include_appinfo=true&include_played_free_games=true`;
  const data = await httpsGet(url);
  try {
    const json = JSON.parse(data);
    return json.response?.games ?? [];
  } catch {
    console.log("Erro ao parsear resposta da Steam.");
    return [];
  }
}