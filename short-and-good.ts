import { report } from "./report.ts";

(async () => {
  await report((steam, hltb) =>
    hltb && hltb.main_story < 4 &&
    steam["Estimated owners"] > 0 &&
    steam["Positive"] > 1000 &&
    (steam["Positive"] / (steam["Positive"] + steam["Negative"]) >= 0.9) &&
    steam["Release date"] < 2025 && // Dataset is from April 2025
    !steam["Tags"].includes("Sexual") &&
    !steam["Tags"].includes("VR,") &&
    !steam["Tags"].includes("Early Access"),
    { writeTo: 'short-and-good.out', limit: -1 });
})();