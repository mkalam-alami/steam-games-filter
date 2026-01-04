import { report } from "./report.ts";

(async () => {
  await report((steam, hltb) =>
    steam["Estimated owners"] < 100000 &&
    steam["Release date"] > 2020 &&
    steam["Positive"] > 20 &&
    steam["Positive"] < 200 &&
    steam["Median playtime forever"] > 0 &&
    (steam["Positive"] / (steam["Positive"] + steam["Negative"]) >= 0.95));
})();