import { report } from "./report.ts";

const EXCLUDED_GAMES = [
  // Already own
  "Crash Bandicoot™ 4: It’s About Time", // Broken SteamSpy data?
  "Dungeon Keeper Gold™"
];

(async () => {
  await report((steam, hltb) =>
    steam["Estimated owners"] < 100000 &&
    steam["Release date"] > 2020 &&
    steam["Positive"] > 10 &&
    steam["Positive"] < 100 &&
    steam["Median playtime forever"] > 0 &&
    (steam["Positive"] / (steam["Positive"] + steam["Negative"]) >= 0.9) &&
    !EXCLUDED_GAMES.includes(steam.Name) &&
    steam["Release date"] < 2025 && // Dataset is from April 2025
    !steam["Tags"].includes("Sexual") &&
    !steam["Tags"].includes("VR") &&
    !steam["Tags"].includes("Early Access") &&
    !steam["Tags"].includes("Anime") &&
    !steam["Tags"].includes("Free to Play") &&
    !steam["Tags"].includes("Pixel Graphics") &&
    !steam["Tags"].includes("Sandbox") &&
    !steam["Tags"].includes("Multiplayer"),
    { writeTo: 'underrated-wan.md', limit: -1 });
})();