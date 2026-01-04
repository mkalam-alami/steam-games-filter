import fs from "node:fs";
import { HltbGame, readHltbGames } from "./data/hltb.ts";
import { readSteamGames, SteamGame } from "./data/steam-spy.ts";

const RIGHT_PAD = 30;

export async function report(
  filter: (game: SteamGame, hltb?: HltbGame) => boolean | undefined,
  options: { json?: boolean, limit?: number, writeTo?: string } = {}) {

  const hltb = await readHltbGames();
  const steam = await readSteamGames({ limit: options.limit });
  const results = steam.filter(game => filter(game, hltb[game.Name]));

  let formattedResults = `${formatResults(results, hltb, options)}\n\n`
    + rightPad(`Found ${results.length} matching games.`, RIGHT_PAD);
  console.log(formattedResults);
  if (options.writeTo) {
    fs.writeFileSync(options.writeTo, formattedResults);
  }
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
        let playTime = hltb[game.Name] ? hltb[game.Name]?.main_story.toFixed(1) : ((game["Median playtime forever"] / 60) || 0).toFixed(1);
        playTime = playTime === 'NaN' ? (0).toFixed(1) : playTime;
        const score = percPositive * (game["Positive"] / 10) * (game["Estimated owners"] / 1000);
        return ({
          score,
          text: `${rightPad(`[${game.Name}]`, RIGHT_PAD)} ${game["Release date"]} | ${formatKilos(game["Estimated owners"])} | ` +
            `${game["Positive"]} (${formatPercentage(percPositive)}) | ` +
            `${playTime}h\n` + 
            `${' '.repeat(RIGHT_PAD)} ${ellipsify(game["Tags"], 50)}`
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
  if (str.length >= length) return str;
  return char.repeat(length - str.length) + str;
}

function ellipsify(str: string, length: number): string {
  return str.length > length? str.slice(0, length - 3) + '...' : str;
}