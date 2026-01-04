import { report } from "./report.ts";

(async () => {
  await report((steam, hltb) =>
    steam["Estimated owners"] > 0 &&
    // steam["Release date"] > 2020 &&
    steam["Positive"] > 1000 &&
    (steam["Positive"] / (steam["Positive"] + steam["Negative"]) >= 0.9) &&
    hltb && hltb.main_story < 4);
})();