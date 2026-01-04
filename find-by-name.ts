import { readHltbGames } from "./data/hltb.ts";
import { readSteamGames } from "./data/steam-spy.ts";

(async () => {
  const find = process.argv[2];
  if (!find) {
    console.error("Please specify a game name to find.");
    return;
  }

  const hltb = await readHltbGames();
  const steam = await readSteamGames({ find });

  if (steam.length === 0) {
    console.log(`No matching game for "${find}".`);
    return;
  }
  console.log(JSON.stringify(steam.map(game => ({
    ...game,
    hltb: hltb[game.Name],
  })), null, 2))
})();
