const { englishCategories } = require("./data_part1.cjs");
const { englishCategoriesPart2 } = require("./data_part2.cjs");
const { tagalogCategories } = require("./data_tagalog.cjs");
const { refineCollections, words } = require("./hint_refiner.cjs");

const datasets = [
  ["English", { ...englishCategories, ...englishCategoriesPart2 }],
  ["Tagalog", tagalogCategories],
];
const forbidden = /specific, recognizable association|designed for subtle|which is why|kaya ito|iconic trait, common association|natural contextual clue/i;
const tierCounts = { Easy: 0, Normal: 0, Hard: 0, Extreme: 0 };
let totalWords = 0;
let totalHints = 0;
let failures = 0;

for (const [language, source] of datasets) {
  const refined = refineCollections(source, language);
  for (const [category, rows] of Object.entries(refined.collections)) {
    if (rows.length < 30) {
      console.error(`${language}/${category} has only ${rows.length} words.`);
      failures++;
    }
    rows.forEach((row, index) => {
      const difficulty = index < 8 ? "Easy" : index < 18 ? "Normal" : index < 26 ? "Hard" : "Extreme";
      tierCounts[difficulty]++;
      totalWords++;
      const unique = new Set();
      if (row.length !== 4) {
        console.error(`${language}/${category}/${row[0]} does not have exactly three hints.`);
        failures++;
      }
      for (const hint of row.slice(1)) {
        totalHints++;
        const key = `${language}|${category}|${row[0]}|${hint}`;
        const explanation = refined.explanations[key];
        if (words(hint).length < 1 || words(hint).length > 2) {
          console.error(`${key} is not a 1–2-word hint.`);
          failures++;
        }
        if (unique.has(hint.toLocaleLowerCase())) {
          console.error(`${language}/${category}/${row[0]} repeats the hint “${hint}.”`);
          failures++;
        }
        unique.add(hint.toLocaleLowerCase());
        if (!explanation || words(explanation).length > 38 || forbidden.test(explanation)) {
          console.error(`${key} has an invalid explanation.`);
          failures++;
        }
      }
    });
  }
}

console.log("Categories:", Object.keys(englishCategories).length + Object.keys(englishCategoriesPart2).length + Object.keys(tagalogCategories).length);
console.log("Secret words:", totalWords);
console.log("Hints and explanations:", totalHints);
console.log("Difficulty distribution:", tierCounts);
console.log("Verification:", failures ? `FAILED (${failures})` : "PASSED");
process.exitCode = failures ? 1 : 0;
