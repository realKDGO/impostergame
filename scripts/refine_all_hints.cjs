const fs = require("fs");
const path = require("path");
const { englishCategories } = require("./data_part1.cjs");
const { englishCategoriesPart2 } = require("./data_part2.cjs");
const { tagalogCategories } = require("./data_tagalog.cjs");
const { refineCollections } = require("./hint_refiner.cjs");

const english = refineCollections({ ...englishCategories, ...englishCategoriesPart2 }, "English");
const tagalog = refineCollections(tagalogCategories, "Tagalog");

const lines = [
  'export type Language="English"|"Tagalog";',
  'export type WordEntry={word:string;hints:string[];language:Language;difficulty:"Easy"|"Normal"|"Hard"|"Extreme"};',
  'export type Category={name:string;language:Language;words:WordEntry[]};',
  'const E="English" as const,T="Tagalog" as const;',
  'const diff=(i:number):WordEntry["difficulty"]=>i<8?"Easy":i<18?"Normal":i<26?"Hard":"Extreme";',
  '// Each entry contains one secret word and three distinct 1–2-word Impostor hints.',
  'const make=(name:string,language:Language,pairs:string[][]):Category=>({name,language,words:pairs.map((x,i)=>({word:x[0],hints:x.slice(1,4),language,difficulty:diff(i)}))});',
  'export const categories:Category[]=[',
];
for (const [category, rows] of Object.entries(english.collections)) lines.push(`make(${JSON.stringify(category)},E,${JSON.stringify(rows)}),`);
for (const [category, rows] of Object.entries(tagalog.collections)) lines.push(`make(${JSON.stringify(category)},T,${JSON.stringify(rows)}),`);
lines.push('];', 'export const forLanguage=(language:"English"|"Tagalog"|"Both")=>language==="Both"?categories:categories.filter(c=>c.language===language);', '');
fs.writeFileSync(path.resolve(__dirname, "../src/word-data.ts"), lines.join("\n"));

const explanations = { ...english.explanations, ...tagalog.explanations };
const explanationSource = `export const detailedExplanations: Record<string,string> = ${JSON.stringify(explanations, null, 1)};

export const getSmartHintExplanation = (word:string,hint:string,language:string,category:string):string => {
  const exact = detailedExplanations[\`${"${language}|${category}|${word}|${hint}"}\`];
  if (exact) return exact;
  return language === "Tagalog"
    ? \`Ang “${"${hint}"}” ay tumutukoy sa isang tiyak na detalye ng “${"${word}"}.”\`
    : \`“${"${hint}"}” refers to one defining detail of “${"${word}"}.”\`;
};
`;
fs.writeFileSync(path.resolve(__dirname, "../src/hint-explanations.ts"), explanationSource);

console.log(`Refined ${Object.keys(explanations).length} hint explanations across ${Object.keys(english.collections).length + Object.keys(tagalog.collections).length} categories.`);
