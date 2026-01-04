import { report } from "./report.ts";

const EXCLUDED_GAMES = [
  // Already own
  "The Stanley Parable: Ultra Deluxe",
  "Before Your Eyes",
  "Slay the Princess",

  // Not interested
  "Retrowave"
];

(async () => {
  await report((steam, hltb) =>
    hltb && hltb.main_story < 4 &&
    steam["Estimated owners"] > 0 &&
    steam["Positive"] > 1000 &&
    (steam["Positive"] / (steam["Positive"] + steam["Negative"]) >= 0.9) &&
    !EXCLUDED_GAMES.includes(steam.Name) &&
    steam["Release date"] > 2013 && steam["Release date"] < 2025 && // Dataset is from April 2025
    !steam["Tags"].includes("Sexual") &&
    !steam["Tags"].includes("VR") &&
    !steam["Tags"].includes("Early Access") &&
    !steam["Tags"].includes("Anime") &&
    !steam["Tags"].includes("Free to Play") &&
    !steam["Tags"].includes("Pixel Graphics") &&
    !steam["Tags"].includes("Sandbox") &&
    !steam["Tags"].includes("Multiplayer"),
    { writeTo: 'short-and-good-wan.md', limit: -1 });
})();