import { HltbGame, readHtlbGames as readHltbGames } from "./data/hltb.ts";
import { readSteamGames, SteamGame } from "./data/steam-spy.ts";

export async function report(
  filter: (game: SteamGame, hltb?: HltbGame) => boolean | undefined,
  options: { json?: boolean, limit?: number } = {}) {

  const hltb = await readHltbGames();
  const steam = await readSteamGames({ limit: options.limit });

  const results = steam
    .filter(game => filter(game, hltb[game.Name]));

  let formattedResults = formatResults(results, hltb, options);


  console.log(`${formattedResults}\n\n`
    + rightPad(`Found ${results.length} matching games.`, 50));
}

function formatResults(results: SteamGame[], hltb: Record<string, HltbGame>, options: { json?: boolean }): string {
  if (options.json) {
    return JSON.stringify(results.map(game => ({
      name: game.Name,
      releaseDate: game["Release date"],
      estimatedOwners: game["Estimated owners"],
      positive: game["Positive"],
      percPositive: formatPercentage(game["Positive"] / (game["Positive"] + game["Negative"])),
      mainStoryHours: hltb[game.Name].main_story.toFixed(1)
    })), null, 2);

  } else {
    return results
      .map(game => {
        const percPositive = game["Positive"] / (game["Positive"] + game["Negative"]);
        const score = percPositive * (game["Positive"] / 10) * (game["Estimated owners"] / 1000) * (10 - hltb[game.Name].main_story);
        return ({
          score,
          text: `${rightPad(`[${game.Name}]`, 50)} ${game["Release date"]} | ${formatKilos(game["Estimated owners"])} | ` +
            `${game["Positive"]} (${formatPercentage(percPositive)}) | ` +
            `${hltb[game.Name].main_story.toFixed(1)}h`
        })
      })
      .sort((a, b) => b.score - a.score)
      .map(game => game.text)
      .join('\n');
  }
}

function formatPercentage(num: number): string {
  return (num * 100).toFixed(0) + '%';
}

function formatKilos(num: number): string {
  return (num / 1000).toFixed(0) + 'k';
}

function rightPad(str: string, length: number, char: string = ' '): string {
  return char.repeat(length - str.length) + str;
}
