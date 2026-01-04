import { report } from "./report.ts";

(async () => {
  await report((steam, hltb) =>
    steam["Estimated owners"] < 100000 &&
    steam["Release date"] > 2013 &&
    steam["Positive"] > 20 &&
    steam["Positive"] < 200 &&
    steam["Median playtime forever"] > 0 &&
    (steam["Positive"] / (steam["Positive"] + steam["Negative"]) >= 0.95) &&
    steam["Release date"] < 2025 && // Dataset is from April 2025
    !steam["Tags"].includes("Sexual") &&
    !steam["Tags"].includes("VR") &&
    !steam["Tags"].includes("Early Access"),
    { writeTo: 'underrated.md', limit: -1 });
})();