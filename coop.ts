import { report } from "./report.ts";

(async () => {
  await report((steam, hltb) =>
    steam["Positive"] > 500 &&
    (steam["Positive"] / (steam["Positive"] + steam["Negative"]) > 0.85) &&
    steam["Release date"] < 2025 && // Dataset is from April 2025
    steam["Tags"].includes("Online Co-Op") &&
    !steam["Tags"].includes("Competitive"),
    { writeTo: 'coop.out', limit: -1 });
})();