import fs from "node:fs";
import { parse } from "csv-parse";
import path from "node:path";
import { fileURLToPath } from "node:url";

const CSV_FILE = path.resolve(fileURLToPath(import.meta.url), '../steam-spy.csv')


export async function readSteamGames(options: { limit?: number, find?: string } = {}): Promise<SteamGame[]> {
  const parser = fs.createReadStream(CSV_FILE).pipe(
    parse({
      delimiter: ',',
      quote: '"',
      ignore_last_delimiters: true,
      relax_column_count_less: true,
      from_line: 2,
      columns: ['AppID', 'Name', 'Release date', 'Estimated owners', 'Peak CCU', 'Required age', 'Price', 'Discount', 'DLC count', 'About the game', 'Supported languages', 'Full audio languages', 'Reviews', 'Header image', 'Website', 'Support url', 'Support email', 'Windows', 'Mac', 'Linux', 'Metacritic score', 'Metacritic url', 'User score', 'Positive', 'Negative', 'Score rank', 'Achievements', 'Recommendations', 'Notes', 'Average playtime forever', 'Average playtime two weeks', 'Median playtime forever', 'Median playtime two weeks', 'Developers', 'Publishers', 'Categories', 'Genres', 'Tags', 'Screenshots', 'Movies']
    }),
  );

  let i = 0;
  const games = [];
  for await (const record of parser) {
    const game: SteamGame = record;
    record["Estimated owners"] = parseInt(record["Estimated owners"].split(' - ')[0]);
    record["Positive"] = parseInt(record["Positive"]);
    record["Negative"] = parseInt(record["Negative"]);
    record["Median playtime forever"] = parseInt(record["Median playtime forever"]);
    record["Release date"] = parseInt(record["Release date"].split(' ')[2]);
    if (!options.find || game.Name.toLowerCase().includes(options.find.toLowerCase())) {
      games.push(game);
    }
    if (options.limit && options.limit > 0 && i++ > options.limit) break;
  }
  return games;
};

export interface SteamGame {
  AppId: string,
  Name: string,
  "Release date": number,
  "Estimated owners": number,
  "Peak CCU": string,
  "Required age": string,
  Price: string,
  Discount: string,
  "DLC count": string,
  "About the game": string,
  "Supported languages": string,
  "Full audio languages": string,
  Reviews: string,
  "Header image": string,
  Website: string,
  "Support url": string,
  "Support email": string,
  Windows: string,
  Mac: string,
  Linux: string,
  "Metacritic score": string,
  "Metacritic url": string,
  "User score": string,
  Positive: number,
  Negative: number,
  "Score rank": string,
  Achievements: string,
  Recommendations: number,
  Notes: string,
  /**
   * In minutes
   */
  "Average playtime forever": number,
  /**
   * In minutes
   */
  "Average playtime two weeks": number,
  /**
   * In minutes
   */
  "Median playtime forever": number,
  /**
   * In minutes
   */
  "Median playtime two weeks": number,
  Developers: string,
  Publishers: string,
  Categories: string,
  Genres: string,
  Tags: string,
  Screenshots: string,
  Movies: string,
}