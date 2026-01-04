import fs from "node:fs";
import { parse } from "csv-parse";
import path from "node:path";
import { fileURLToPath } from "node:url";

const CSV_FILE = path.resolve(fileURLToPath(import.meta.url), '../hltb.csv')

export async function readHtlbGames(): Promise<Record<string, HltbGame>> {
  const parser = fs.createReadStream(CSV_FILE).pipe(
    parse({
      delimiter: ',',
      quote: '"',
      ignore_last_delimiters: true,
      relax_column_count_less: true,
      from_line: 2,
      columns: ["id", "name", "type", "platform", "genres", "developer", "publisher", "release_date", "release_precision", "release_year", "release_month", "release_day", "main_story_polled", "main_story", "main_plus_sides_polled", "main_plus_sides", "completionist_polled", "completionist", "all_styles_polled", "all_styles", "single_player_polled", "single_player", "co_op_polled", "co_op", "versus_polled", "versus", "source_url", "crawled_at"]
    })
  );

  const games: Record<string, HltbGame> = {};
  for await (const record of parser) {
    const game: HltbGame = record;
    game.main_story = parseFloat(game.main_story.toString());
    games[game.name] = game;
  }
  return games;
};

export interface HltbGame {
  "id": string;
  "name": string;
  "type": string;
  "platform": string;
  "genres": string;
  "developer": string;
  "publisher": string;
  "release_date": string;
  "release_precision": string;
  "release_year": string;
  "release_month": string;
  "release_day": string;
  "main_story_polled": number;
  "main_story": number;
  "main_plus_sides_polled": number;
  "main_plus_sides": number;
  "completionist_polled": number;
  "completionist": number;
  "all_styles_polled": number;
  "all_styles": number;
  "single_player_polled": number;
  "single_player": number;
  "co_op_polled": number;
  "co_op": number;
  "versus_polled": number;
  "versus": number;
  "source_url": string;
  "crawled_at": string;
}