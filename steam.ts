import * as https from "https";

export function buscarJogosSteam(steamId: string, apiKey: string): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const url = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${apiKey}&steamid=${steamId}&include_appinfo=true&include_played_free_games=true`;

    https.get(url, (res) => {
          console.log("Status HTTP:", res.statusCode); 
          console.log("URL gerada:", url);

      let data = "";
      res.on("data", (chunk: string) => (data += chunk));
      res.on("end", () => {
        console.log("Resposta da Steam:", data.substring(0, 300)); // mostra os primeiros 300 caracteres
        try {
          const json = JSON.parse(data);
          resolve(json.response.games || []);
        } catch (e) {
          console.log("Erro ao parsear JSON. A Steam retornou HTML em vez de dados.");
          resolve([]);
        }
      });
      res.on("error", reject);
    });
  });
}