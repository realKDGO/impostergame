const { englishCategories } = require('./data_part1.cjs');
const { englishCategoriesPart2 } = require('./data_part2.cjs');
const { tagalogCategories } = require('./data_tagalog.cjs');

const all = { ...englishCategories, ...englishCategoriesPart2, ...tagalogCategories };
let totalWords = 0;
let totalHints = 0;
let allPassed = true;

for (const [cat, words] of Object.entries(all)) {
  if (words.length < 30) {
    console.error(`Category ${cat} has only ${words.length} words!`);
    allPassed = false;
  }
  totalWords += words.length;
  for (const item of words) {
    if (item.length !== 4) {
      console.error(`Word entry ${item[0]} in ${cat} does not have exactly 3 hints! Got: ${item.length - 1}`);
      allPassed = false;
    }
    totalHints += 3;
  }
}

console.log('Categories count:', Object.keys(all).length);
console.log('Total words:', totalWords);
console.log('Total hints:', totalHints);
console.log('Verification Status:', allPassed ? 'ALL CATEGORIES VALID AND EXPANDED!' : 'FAILURES DETECTED');
