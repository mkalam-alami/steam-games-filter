import fs from "node:fs";
import { parse } from "csv-parse";
import path from "node:path";
import { fileURLToPath } from "node:url";

const CSV_FILE = path.resolve(fileURLToPath(import.meta.url), '../hltb.csv')

export async function readHtlbGames(): Promise<Record<string, HltbGame>> {
  const parser = fs.createReadStream(CSV_FILE).pipe(
    parse({
      delimiter: ',',
      quote: '',
      ignore_last_delimiters: true,
      relax_column_count_less: true,
      from_line: 2,
      columns: ['id', 'title', 'main_story', 'main_plus_extras', 'completionist', 'all_styles', 'coop', 'versus', 'type', 'developers', 'publishers', 'platforms', 'genres', 'release_na', 'release_eu', 'release_jp']
    })
  );

  const games: Record<string, HltbGame> = {};
  for await (const record of parser) {
    const game: HltbGame = record;
    game.main_story = parseFloat(game.main_story.toString());
    games[game.title] = game;
  }
  return games;
};

export interface HltbGame {
  id: string;
  title: string;
  main_story: number;
  main_plus_extras: number;
  completionist: number;
  all_styles: number;
  coop: string;
  versus: string;
  type: string;
  developers: string;
  publishers: string;
  platforms: string;
  genres: string;
  release_na: string;
  release_eu: string;
  release_jp: string;

}