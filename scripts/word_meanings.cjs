// Citizen definitions are independent of the three Impostor hints.
// Missing definitions stay optional instead of being guessed from clue text.
const {categoryRepairs}=require('./category_repairs.cjs');
const definitions={
Pizza:'A baked flatbread topped with sauce, cheese, and other ingredients.',
Burger:'A sandwich with a cooked patty inside a split bun.',
Sushi:'A Japanese dish made with seasoned rice and fillings or toppings.',
Ramen:'A Japanese noodle soup served with broth and toppings.',
'Fried Chicken':'Chicken cooked in hot oil, often with a crisp coating.',
'Ice Cream':'A sweet frozen dessert commonly made from milk or cream.',
Pancakes:'Flat cakes cooked from batter on a hot surface.',
Donut:'A sweet fried dough snack, often shaped like a ring.',
Chocolate:'A food made from processed cacao, usually with sugar.',
Spaghetti:'Long, thin strands of pasta.',
Dog:'A domesticated mammal commonly kept as a companion or working animal.',
Cat:'A small domesticated feline commonly kept as a pet.',
Lion:'A large wild cat whose adult males usually have a mane.',
Tiger:'A large wild cat with dark stripes on its coat.',
Elephant:'A very large mammal with a trunk and broad ears.',
Giraffe:'A tall African mammal with a long neck and spotted coat.',
Coffee:'A drink made by brewing roasted coffee beans.',
Tea:'A drink made by steeping tea leaves in water.',
Water:'A clear liquid essential for living things.',
Doctor:'A trained medical professional who diagnoses and treats illness.',
Teacher:'A person who helps others learn knowledge or skills.',
Adobo:'Ulam na niluluto sa suka, bawang, at karaniwang may toyo.',
Sinigang:'Maasim na sabaw na may karne o isda at mga gulay.',
Lechon:'Buong baboy na iniihaw hanggang maluto at lumutong ang balat.',
'Kare-Kare':'Nilagang karne at gulay sa malapot na sarsang mani.',
Tinola:'Sabaw na may manok, luya, at mga gulay.',
Sisig:'Tinadtad na karne na karaniwang tinimplahan ng kalamansi at sili.',
Lumpia:'Pagkaing may palamang nakabalot sa manipis na pambalot.',
Aso:'Alagang hayop na karaniwang kasama o bantay ng tao.',
Pusa:'Maliit na alagang hayop na kabilang sa mga pusa at mahusay manghuli ng daga.',
Guro:'Taong nagtuturo upang matuto ang mga mag-aaral.',
Doktor:'Propesyonal na sumusuri at gumagamot sa mga may sakit.',
Bayanihan:'Sama-samang pagtutulungan ng mga tao sa isang gawain.',
Sinulog:'Pista sa Cebu na nagpaparangal sa Santo Nino sa pamamagitan ng sayaw at prusisyon.',
Panagbenga:'Pista ng mga bulaklak sa Baguio.',
Pahiyas:'Pista ng ani sa Lucban na kilala sa makukulay na palamuti sa bahay.'
};
const english={};for(const rows of Object.values(categoryRepairs))for(const row of rows)english[row[0]]=row[4];
function meaningFor(word,language){return language==='English'?(english[word]||(!['Adobo','Sinigang','Lechon','Kare-Kare','Tinola','Sisig','Lumpia','Aso','Pusa','Guro','Doktor','Bayanihan','Sinulog','Panagbenga','Pahiyas'].includes(word)?definitions[word]:undefined)):definitions[word]}
module.exports={meaningFor};
