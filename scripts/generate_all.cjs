const fs = require('fs');
const path = require('path');
const { englishCategories } = require('./data_part1.cjs');
const { englishCategoriesPart2 } = require('./data_part2.cjs');
const { tagalogCategories } = require('./data_tagalog.cjs');

const allEnglish = { ...englishCategories, ...englishCategoriesPart2 };
const allTagalog = { ...tagalogCategories };

console.log('Total English Categories:', Object.keys(allEnglish).length);
console.log('Total Tagalog Categories:', Object.keys(allTagalog).length);

// 1. Build word-data.ts
let wordDataContent = `export type Language="English"|"Tagalog";
export type WordEntry={word:string;hints:string[];language:Language;difficulty:"Easy"|"Normal"|"Hard"|"Extreme"};
export type Category={name:string;language:Language;words:WordEntry[]};
const E="English" as const,T="Tagalog" as const;
const diff=(i:number):WordEntry["difficulty"]=>i<8?"Easy":i<18?"Normal":i<26?"Hard":"Extreme";
// Each entry: [word, easyHint, normalHint, hardHint] — all 3 hints required
const make=(name:string,language:Language,pairs:string[][]):Category=>({name,language,words:pairs.map((x,i)=>({word:x[0],hints:x.slice(1,4),language,difficulty:diff(i)}))});
export const categories:Category[]=[\n`;

for (const [catName, words] of Object.entries(allEnglish)) {
  wordDataContent += `make("${catName}",E,${JSON.stringify(words)}),\n`;
}

for (const [catName, words] of Object.entries(allTagalog)) {
  wordDataContent += `make("${catName}",T,${JSON.stringify(words)}),\n`;
}

wordDataContent += `];
export const forLanguage=(language:"English"|"Tagalog"|"Both")=>language==="Both"?categories:categories.filter(c=>c.language===language);
`;

fs.writeFileSync(path.resolve(__dirname, '../src/word-data.ts'), wordDataContent, 'utf8');
console.log('Successfully written src/word-data.ts');

// 2. Build detailed hint explanations
// Let's create an intelligent explanation generator for every word & hint
const explanations = {};

// Helper to generate natural relationship explanation
function createExplanation(word, hint, category, lang) {
  if (lang === 'Tagalog') {
    return `Ang “${hint}” ay may malapit at natural na kaugnayan sa “${word}” sa kategoryang ${category}, na nagpapakita ng kilalang katangian, gamit, o palatandaan nito sa larong BLENDIN.`;
  }
  return `“${hint}” directly connects to “${word}” in the ${category} pack as an iconic trait, common association, or recognizable feature designed for subtle clue-giving.`;
}

// Populate English
for (const [catName, words] of Object.entries(allEnglish)) {
  for (const item of words) {
    const word = item[0];
    const hints = item.slice(1, 4);
    for (const hint of hints) {
      const key = `${word}:${hint}`;
      explanations[key] = createExplanation(word, hint, catName, 'English');
    }
  }
}

// Populate Tagalog
for (const [catName, words] of Object.entries(allTagalog)) {
  for (const item of words) {
    const word = item[0];
    const hints = item.slice(1, 4);
    for (const hint of hints) {
      const key = `${word}:${hint}`;
      explanations[key] = createExplanation(word, hint, catName, 'Tagalog');
    }
  }
}

// Add our rich custom curated explanations for key words
const customRich = {
  // Food
  "Pizza:Round": "Pizzas are classically rolled, tossed, and baked as whole circular pies before being sliced.",
  "Pizza:Delivery": "Hot pizza in cardboard boxes is universally ordered and delivered directly to doorsteps.",
  "Pizza:Margherita": "The classic Neapolitan pizza topped with simple fresh basil, tomato sauce, and mozzarella.",
  "Burger:Patty": "Seasoned ground beef patties form the flavorful center of every hamburger.",
  "Burger:Drive-thru": "Fast food burger restaurants famously popularized ordering meals through drive-thru windows.",
  "Burger:Smash": "Smashing the patty flat onto a hot griddle creates caramelized edges and maximum crust flavor.",
  "Sushi:Seaweed": "Crispy roasted nori seaweed sheets wrap around seasoned rice and fresh fish fillings.",
  "Sushi:Omakase": "The traditional Japanese dining format where the sushi chef selects and prepares custom courses.",
  "Sushi:Nigiri": "Hand-pressed oval mounds of vinegared sushi rice draped with fresh slices of raw seafood.",
  "Ramen:Noodles": "Springy wheat noodles are served submerged in piping hot, rich savory broth.",
  "Ramen:Tonkotsu": "A dense, milky broth made from slow-simmering pork bones for up to twenty hours.",
  "Ramen:Tare": "The concentrated seasoning base—soy, miso, or salt—added to the bowl before pouring broth.",
  "Fried Chicken:Crispy": "Deep-fried seasoned coating creates the signature loud crunch with every bite.",
  "Fried Chicken:Southern": "Traditional American Southern buttermilk marinades and seasoned flour give fried chicken its depth.",
  "Fried Chicken:Batter": "Dredging chicken pieces in seasoned liquid batter locks in moisture while frying to golden perfection.",
  "Lasagna:Layers": "Wide pasta ribbons alternate with rich meat ragù, creamy bechamel, and melted cheese in lasagna.",
  "Croissant:Flaky": "Laminated butter dough creates hundreds of paper-thin airy layers that shatter when bitten.",
  "Burrito:Foil wrap": "Tight aluminum foil wrapping keeps giant mission-style burritos warm and structurally intact.",
  "Waffles:Grid pockets": "Heated waffle iron grids press deep square pockets designed to capture maple syrup and butter.",
  "Cheesecake:Graham crust": "Crushed buttery graham cracker crumbs provide the sweet, crunchy base beneath creamy cheesecake filling.",

  // Drinks
  "Matcha:Green powder": "Finely stone-ground vibrant green tea leaves are whisked into hot water to make matcha.",
  "Matcha:Bamboo whisk": "A delicate multi-pronged chasen bamboo whisk froths matcha into a smooth, velvety foam.",
  "Kombucha:Fermented tea": "Sweetened black or green tea undergoes probiotic fermentation to produce sparkling kombucha.",
  "Mojito:Fresh mint": "Bruised fresh mint leaves release refreshing aromatic oils in traditional Cuban mojitos.",
  "Boba Tea:Chewy tapioca": "Springy brown sugar tapioca pearls rest at the bottom of the cup, sipped through oversized straws.",
  "Espresso:Shot": "High pressure water forced through finely ground beans extracts a concentrated, crema-topped espresso shot.",

  // Animals
  "Dog:Canine": "Canines belong to the Canidae family, sharing ancestry with wolves and foxes.",
  "Cat:Purr": "Cats vibrate their laryngeal muscles to purr when feeling secure, content, or nursing.",
  "Lion:Pride": "Lions are unique among big cats for living and hunting together in social family prides.",
  "Wolf:Howling pack": "Wolves vocalize with eerie long-distance howls to rally their pack and mark forest territory.",
  "Owl:Silent feathers": "Specialized fringe edges on owl wing feathers muffle sound, enabling completely silent ambush flight.",
  "Cheetah:Sprint speed": "Cheetahs can accelerate from zero to sixty miles per hour in just three seconds on the savanna.",
  "Octopus:Chromatophores": "Specialized pigment cells in octopus skin expand and contract rapidly to blend seamlessly into ocean rocks.",

  // Tagalog rich explanations
  "Adobo:Toyo": "Ang toyo ang nagbibigay ng maalat at maitim na kulay sa sarsa ng adobo kasama ng suka at bawang.",
  "Adobo:Asim": "Ang natural na asim mula sa suka ang nagbabalanse sa alat ng toyo at nagpapatagal sa buhay ng ulam.",
  "Sinigang:Sampalok": "Bunga ng sampalok ang tradisyonal na pampaasim na nagbibigay ng nakapupukaw na sarap sa sabaw.",
  "Sinigang:Maasim": "Kilala ang sinigang sa matapang na asim na humahaplos sa lalamunan lalo na kapag umuulan.",
  "Lechon:Balat": "Ang malutong at mapulang balat ng lechon ang pinakaaagawan sa bawat handaan at piyesta.",
  "Kare-Kare:Mani": "Ginisang mani at peanut butter ang nagpapalapot at nagbibigay ng kulay at lasa sa sarsa ng kare-kare.",
  "Sisig:Sizzling": "Inihahain ang tinadtad na pisngi at tainga ng baboy sa umuusok na bakal na plato na may kalamansi at sili.",
  "Halo-halo:Yelo": "Pinong kinaskas na yelo ang nagpapalamig sa halo-halong minatamis na saging, gulaman, leche flan, at ube.",
  "Balut:Itik": "Itlog ng itik na may 18-araw na sisiw ang pinakukuluan at kinakain nang may asin at maanghang na suka.",
  "Taho:Arnibal": "Matamis na arnibal at sago ang ibinubuhos sa malasutlang tokwa ng magtataho tuwing umaga.",
  "Jeepney:Bayad": "Iniaabot ng mga pasahero ang kanilang barya sa tsuper habang sumisigaw ng 'bayad po'.",
  "Jeepney:Ruta": "Nakasulat sa gilid ng jeepney ang mga lansangang dinadaanan nito mula terminal hanggang dulo."
};

// Merge rich custom explanations
Object.assign(explanations, customRich);

let hintContent = `export const detailedExplanations: Record<string, string> = ${JSON.stringify(explanations, null, 1)};

export const getSmartHintExplanation = (
  word: string,
  hint: string,
  language: string,
  category: string
): string => {
  const baseHint = hint
    .replace(/^Paired with /, "")
    .replace(/^Kaugnay ng /, "")
    .replace(/ connection$/, "")
    .replace(/^Palatandaan: /, "")
    .trim();

  const lookupKey = \`\${word}:\${baseHint}\`;
  if (detailedExplanations[lookupKey]) {
    return detailedExplanations[lookupKey];
  }

  // Tagalog dynamic fallback
  if (language === "Tagalog") {
    return \`Ang “\${baseHint}” ay may malapit na kaugnayan sa “\${word}” sa kategoryang \${category}, na nagbibigay ng pahiwatig nang hindi agad ibinubunyag ang lihim na salita.\`;
  }

  // English dynamic fallback
  return \`“\${baseHint}” serves as a natural contextual clue for “\${word}” in the \${category} pack, designed to help impostors blend in while preserving mystery.\`;
};
`;

fs.writeFileSync(path.resolve(__dirname, '../src/hint-explanations.ts'), hintContent, 'utf8');
console.log('Successfully written src/hint-explanations.ts');
console.log('Total explanations generated:', Object.keys(explanations).length);
