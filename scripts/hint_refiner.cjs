const EN_STOP = new Set(["a","an","the","of","to","in","on","at","for","with","and","or","from","by","into","its","is","as"]);
const TL_STOP = new Set(["ang","mga","ng","sa","at","ay","na","nang","para","kay","ni","mula","isang","may"]);

const clean = (value) => String(value).replace(/\s+/g, " ").trim();
const words = (value) => clean(value).split(/\s+/).filter(Boolean);
const normalized = (value) => clean(value).toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu, "");

const phraseOverrides = {
  "standing on one leg": "One-legged",
  "rolling into a ball": "Defensive curl",
  "hanging upside down": "Inverted rest",
  "things commonly seen": "Familiar sight",
  "often seen": "Crowd staple",
  "daily dental hygiene": "Daily hygiene",
  "bantog na loboc river cruise at chocolate hills": "Loboc cruise",
  "bantayog ng pambansang bayaning si dr. jose rizal": "Rizal monument",
  "pinakamalaking contiguous coral reef sa bansa": "Contiguous reef",
  "triangle of sadness": "Triangle Sadness",
  "judy ann's kitchen": "Judy's Kitchen",
  "juan for all": "Juan4All",
  "forrest gump park bench": "Forrest Gump",
  "cast away volleyball friend": "Cast Away",
  "nylon cleaning bristles": "Nylon bristles",
  "makasaysayang death march noong digmaan": "Death March",
  "lalawigan ng kabayanihan": "Kabayanihan",
  "santwaryo ng mga pating pagong at corals": "Pating pagong",
};

function compactHint(original, difficulty, language, variant = 0) {
  const source = clean(original);
  const override = phraseOverrides[source.toLocaleLowerCase()];
  if (override) return override;
  if (words(source).length <= 2) return source;

  const stop = new Set([...EN_STOP, ...TL_STOP]);
  const content = words(source)
    .map((token) => token.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}'’-]+$/gu, ""))
    .filter((token) => token && !stop.has(token.toLocaleLowerCase()));
  if (!content.length) return words(source).slice(0, 2).join(" ");

  const proper = content.filter((token) => /^[A-ZÁÉÍÓÚÑ]/u.test(token));
  if (proper.length >= 2) return proper.slice(0, 2).join(" ");

  if (difficulty === "Easy") return content.slice(0, 2).join(" ");
  if (difficulty === "Hard" || difficulty === "Extreme") return content.slice(-2).join(" ");

  const scored = content.map((token, index) => ({
    token,
    index,
    score: token.replace(/[^\p{L}\p{N}]/gu, "").length + (/^[A-ZÁÉÍÓÚÑ]/u.test(token) ? 2 : 0),
  }));
  scored.sort((a, b) => b.score - a.score || a.index - b.index);

  const first = scored[0];
  const neighbor = scored
    .slice(1)
    .sort((a, b) => Math.abs(a.index - first.index) - Math.abs(b.index - first.index) || b.score - a.score)[0];
  return [first, neighbor].filter(Boolean).sort((a, b) => a.index - b.index).map((item) => item.token).join(" ");
}

const specialExplanations = {
  "English|Pizza|Round": "Pizza is commonly baked as a round pie before it is sliced.",
  "English|Pizza|Delivery": "Pizza is one of the foods most commonly delivered in a flat box.",
  "English|Pizza|Margherita": "Margherita is a pizza topped with tomato, mozzarella, and basil.",
  "English|Coke|Bubbles": "Bubbles come from the carbonation that gives Coke its fizz.",
  "English|Coffee|Caffeine": "Caffeine is the natural stimulant people associate with coffee.",
  "English|Ice Cream|Scoop": "Ice cream is commonly portioned into rounded scoops.",
  "English|Popcorn|Kernel": "A popcorn kernel bursts open when its trapped moisture turns to steam.",
  "English|Hot Chocolate|Mug": "Hot chocolate is normally served warm in a mug.",
  "English|Camera|Lens": "A camera focuses incoming light through its lens.",
  "English|Recess|Break": "Recess is the scheduled break between school lessons.",
  "English|Recess|Playground": "Students commonly spend recess playing on the playground.",
  "English|Recess|Unstructured": "Recess is usually unstructured time rather than a formal lesson.",
  "English|Beach|Sand": "Sand covers the shore of a typical beach.",
  "English|Vase|Flowers": "A vase holds and displays cut flowers.",
  "English|Pillow|Soft": "A pillow is soft so it can cushion the head during sleep.",
  "English|Umbrella|Rain": "An umbrella opens overhead to shield a person from rain.",
  "English|Candle|Flame": "A candle produces a flame when its wick is lit.",
  "English|Toothbrush|Nylon bristles": "Nylon bristles scrub plaque from teeth on a toothbrush.",
  "English|Guitar|Strings": "A guitar produces notes when its strings vibrate.",
  "English|Tom Hanks|Forrest Gump": "Tom Hanks played the title character in “Forrest Gump.”",
  "English|Tom Hanks|Cast Away": "Tom Hanks played the stranded survivor in “Cast Away.”",
  "English|Tom Hanks|Beloved American": "Tom Hanks is widely described as a beloved American actor.",
  "Tagalog|Regine Velasquez|Asia's Songbird": "Ang “Asia's Songbird” ay kilalang palayaw ni Regine Velasquez.",
  "Tagalog|Regine Velasquez|High Notes": "Kilala si Regine Velasquez sa pag-abot ng matataas na nota.",
  "Tagalog|Regine Velasquez|R2K": "Ang “R2K” ay album at concert project ni Regine Velasquez.",
  "Tagalog|Judy Ann Santos|Teleserye Queen": "Ang “Teleserye Queen” ay palayaw ni Judy Ann Santos dahil sa kanyang mga dramang pantelebisyon.",
  "Tagalog|Judy Ann Santos|Judy's Kitchen": "Ang “Judy Ann's Kitchen” ay cooking show ni Judy Ann Santos.",
  "Tagalog|Judy Ann Santos|Mara": "Si Mara ang karakter ni Judy Ann Santos sa “Mara Clara.”",
  "Tagalog|Jose Manalo|Juan4All": "Ang “Juan for All” ay segment na matagal na sinalihan ni Jose Manalo.",
  "Tagalog|Jose Manalo|Lola Tinidora": "Ang “Lola Tinidora” ay karakter na ginampanan ni Jose Manalo sa Kalyeserye.",
  "Tagalog|Jose Manalo|Kalyeserye": "Kabilang si Jose Manalo sa mga pangunahing performer ng Kalyeserye.",
  "Tagalog|Dolly de Leon|Triangle Sadness": "Ang “Triangle of Sadness” ay pelikulang pinagbidahan ni Dolly de Leon bilang Abigail.",
  "Tagalog|Dolly de Leon|Golden Globe": "Nominado si Dolly de Leon sa Golden Globe para sa “Triangle of Sadness.”",
  "Tagalog|Dolly de Leon|Abigail": "Si Abigail ang karakter ni Dolly de Leon sa “Triangle of Sadness.”",
  "Tagalog|Bataan|Kagitingan": "Nasa Bataan ang Dambana ng Kagitingan sa Bundok Samat.",
  "Tagalog|Bataan|Death March": "Sa Bataan nagsimula ang makasaysayang Death March noong Ikalawang Digmaang Pandaigdig.",
  "Tagalog|Bataan|Kabayanihan": "Sagisag ng kabayanihan ang Bataan dahil sa pagtatanggol dito noong digmaan.",
  "Tagalog|Apo Reef|Contiguous reef": "Ang Apo Reef ang pinakamalaking contiguous coral reef system sa Pilipinas.",
  "Tagalog|Apo Reef|Pating pagong": "May mga pating at pawikan sa santuwaryong dagat ng Apo Reef.",
  "Tagalog|Apo Reef|Occidental": "Matatagpuan ang Apo Reef sa Occidental Mindoro.",
};

function relationship(category, original, language, word) {
  const c = category.toLocaleLowerCase();
  const o = original.toLocaleLowerCase();
  const w = word.toLocaleLowerCase();
  if (/(celebrity|artista|aliwan)/.test(c)) {
    if (/(nickname|palayaw|queen|king|songbird|superstar|megastar|diamond star)/.test(o)) return "nickname";
    if (/(award|globe|oscar|grammy|emmy|medal|nomination)/.test(o)) return "award";
    return "career";
  }
  if (/(food|pagkain|kitchen)/.test(c)) {
    if (/(salt|sugar|rice|flour|cheese|milk|cocoa|patty|cream|crust|mani|toyo|suka|luya|sili|bawang|sarsa|dahon|karne)/.test(o)) return "ingredient";
    if (/(fried|baked|roast|grill|boil|steam|churn|proof|stir|inihaw|prito|nilaga|luto)/.test(o)) return "preparation";
    if (/(delivery|takeout|drive-thru|served|plate|bowl|cup|wrap)/.test(o)) return "service";
    return "variety";
  }
  if (/(drink|inumin)/.test(c)) {
    if (/(milk|water|tea|coffee|mint|lemon|lime|sugar|caffeine|cacao|acid|phosphoric|syrup|juice|tapioca|cinnamon|luya|kalamansi|pulot|yelo)/.test(o)) return "ingredient";
    if (/(shot|cup|mug|glass|straw|pitcher|bottle|tasa|baso|mangkok)/.test(o)) return "drinkServing";
    return "drink";
  }
  if (/(animal|hayop|ocean life)/.test(c)) return /(feet|tail|beak|snout|jaw|claw|feather|fur|coat|pouch|shell|mane|trunk|fin|wing|mata|buntot|balat|pakpak)/.test(o) ? "anatomy" : "behavior";
  if (/(countries|cities|places|lugar|province|travel)/.test(c)) {
    if (/(tower|gate|bridge|palace|temple|church|monument|ruin|museum|mountain|bulkan|simbahan|bantayog|dambana)/.test(o)) return "landmark";
    if (/(festival|dance|ritual|music|food|cuisine|tradition|pista|sayaw|pagkain|kaugalian)/.test(o)) return "culture";
    return "geography";
  }
  if (/(sport|palakasan|game|laro)/.test(c)) return /(ball|racket|paddle|bat|glove|helmet|board|puck|pin|hoop|pedal|wicket|oar|ski|foil|bow|arrow|bola|raketa|ring)/.test(o) ? "equipment" : "action";
  if (/(school|paaralan|campus)/.test(c)) {
    if (/(teacher|student|principal|guro|estudyante|punong-guro)/.test(w)) return "schoolPerson";
    if (/(mathematics|science|history|english|matematika|agham|kasaysayan|filipino)/.test(w)) return "schoolSubject";
    if (/(blackboard|notebook|backpack|pencil|desk|calculator|ruler|eraser|textbook|locker|report card|school bell|pisara|kuwaderno|lapis|mesa|kalkulador|panukat|pambura|aklat|locker)/.test(w)) return "schoolObject";
    if (/(classroom|library|laboratory|cafeteria|hallway|playground|silid-aralan|aklatan|laboratoryo|kantina|pasilyo|palaruan)/.test(w)) return "schoolPlace";
    if (/(exam|homework|graduation|attendance|field trip|semester|recess|pagsusulit|takdang-aralin|pagtatapos|pagpasok|lakbay-aral|semestre)/.test(w)) return "schoolEvent";
    if (/(playground|classroom|library|office|gym|cafeteria|laboratory|silid|aklatan|kantina)/.test(o)) return "schoolPlace";
    if (/(break|lesson|exam|study|play|read|write|graduate|lecture|quiz|aral|sulit|basa|sulat)/.test(o)) return "schoolAction";
    return "schoolEvent";
  }
  if (/(job|trabaho|profession)/.test(c)) return "work";
  if (/(transportation|sasakyan)/.test(c)) return /(wheel|engine|wing|tire|handle|seat|tread|propeller|gulong|makina|pakpak|manibela|pedal|katig)/.test(o) ? "transportPart" : "transportUse";
  if (/(clothing|damit)/.test(c)) return "clothingFeature";
  if (/(technology|programming|social media|internet)/.test(c)) return /(port|circuit|sensor|screen|panel|chip|cable|button|lens|keyboard)/.test(o) ? "component" : "function";
  if (/(house|bahay|bagay|office|bathroom)/.test(c)) return /(handle|cover|blade|bristle|wick|frame|drawer|hinge|hawakan|takip|talim)/.test(o) ? "part" : "use";
  if (/(movie|pelikula|tv show|music|anime)/.test(c)) {
    if (/(role|character|hero|villain|actor|actress|papel|karakter)/.test(o)) return "role";
    if (/(song|music|melody|rhythm|audio|voice|sound|kanta|tugtog|tunog)/.test(o)) return "sound";
    return "productionWork";
  }
  if (/(nature|kalikasan|weather|space|science)/.test(c)) return "feature";
  if (/(slang)/.test(c)) return "meaning";
  if (/(culture|kultura|pista|tradisyon|festival|holiday)/.test(c)) return "tradition";
  if (/(pang-araw-araw|daily)/.test(c)) return "daily";
  return language === "Tagalog" ? "ugnay" : "feature";
}

function explanation(word, hint, original, category, language) {
  const special = specialExplanations[`${language}|${word}|${hint}`];
  if (special) return special;
  const detail = clean(original);
  const rel = relationship(category, original, language, word);
  const possessive = word.endsWith("s") ? `${word}'` : `${word}'s`;

  if (language === "Tagalog") {
    const templates = {
      career: `Ang “${hint}” ay tumutukoy sa “${detail}” sa karera ni ${word}.`,
      nickname: `Ang “${hint}” ay palayaw na ginagamit para kay ${word}.`,
      award: `Ang “${hint}” ay parangal na kaugnay ng karera ni ${word}.`,
      ingredient: `Ang “${hint}” ay sangkap na nagbibigay ng natatanging lasa sa ${word}.`,
      preparation: `Ang “${hint}” ay tumutukoy sa “${detail}” na paghahanda ng ${word}.`,
      service: `Ang “${hint}” ay tumutukoy sa “${detail}” na paghahain ng ${word}.`,
      variety: `Ang “${hint}” ay tumutukoy sa “${detail}” na uri ng ${word}.`,
      drink: `Ang “${hint}” ay tumutukoy sa “${detail}” na katangian ng ${word}.`,
      drinkServing: `Ang “${hint}” ay tumutukoy sa paraan ng paghahain ng ${word}.`,
      anatomy: `Ang “${hint}” ay tumutukoy sa “${detail}” na bahagi ng katawan ng ${word}.`,
      behavior: `Ang “${hint}” ay naglalarawan sa gawing “${detail}” ng ${word}.`,
      landmark: `Ang “${hint}” ay tumutukoy sa “${detail}” na bantog na palatandaan ng ${word}.`,
      culture: `Ang “${hint}” ay tumutukoy sa tradisyong “${detail}” ng ${word}.`,
      geography: `Ang “${hint}” ay tumutukoy sa heograpiyang “${detail}” ng ${word}.`,
      equipment: `Ang “${hint}” ay tumutukoy sa “${detail}” na kagamitang ginagamit sa ${word}.`,
      action: `Ang “${hint}” ay tumutukoy sa “${detail}” na kilos sa ${word}.`,
      schoolPerson: `Ang “${hint}” ay bahagi ng tungkulin ng ${word} sa paaralan.`,
      schoolSubject: `Ang “${hint}” ay konseptong pinag-aaralan sa ${word}.`,
      schoolObject: `Ang “${hint}” ay tumutukoy sa “${detail}” na makikita sa ${word}.`,
      schoolEvent: `Ang “${hint}” ay nangyayari bilang bahagi ng ${word}.`,
      schoolPlace: `Ang “${hint}” ay karaniwang makikita sa ${word}.`,
      schoolAction: `Ang “${hint}” ay tumutukoy sa gawaing “${detail}” sa ${word}.`,
      work: `Ang “${hint}” ay tumutukoy sa “${detail}” na bahagi ng trabaho ng ${word}.`,
      transportPart: `Ang “${hint}” ay tumutukoy sa bahaging “${detail}” ng ${word}.`,
      transportUse: `Ang “${hint}” ay tumutukoy sa galaw na “${detail}” ng ${word}.`,
      clothingFeature: `Ang “${hint}” ay tumutukoy sa anyong “${detail}” ng ${word}.`,
      component: `Ang “${hint}” ay tumutukoy sa “${detail}” na bahagi ng ${word}.`,
      function: `Ang “${hint}” ay tumutukoy sa “${detail}” na proseso ng ${word}.`,
      part: `Ang “${hint}” ay tumutukoy sa “${detail}” na bahagi ng ${word}.`,
      use: `Ang “${hint}” ay tumutukoy sa “${detail}” na gamit ng ${word}.`,
      role: `Ang “${hint}” ay tumutukoy sa “${detail}” na karakter o papel sa ${word}.`,
      sound: `Ang “${hint}” ay tumutukoy sa “${detail}” na tunog sa ${word}.`,
      productionWork: `Ang “${hint}” ay tumutukoy sa “${detail}” na gawang kaugnay ng ${word}.`,
      feature: `Ang “${hint}” ay tumutukoy sa “${detail}” na katangian ng ${word}.`,
      meaning: `Ang “${hint}” ang kahulugang ipinapahiwatig ng salitang “${word}.”`,
      tradition: `Ang “${hint}” ay tumutukoy sa kaugaliang “${detail}” ng ${word}.`,
      daily: `Ang “${hint}” ay tumutukoy sa gawaing “${detail}” sa ${word}.`,
      ugnay: `Ang “${hint}” ay tumutukoy sa “${detail}” na direktang kaugnay ng ${word}.`,
    };
    return templates[rel];
  }

  const templates = {
    career: `“${hint}” refers to “${detail}” in ${possessive} career.`,
    nickname: `“${hint}” is a nickname used for “${word}.”`,
    award: `“${hint}” is an award connected to ${possessive} career.`,
    ingredient: `“${hint}” identifies the ${detail.toLocaleLowerCase()} used in “${word}.”`,
    preparation: `“${hint}” describes the ${detail.toLocaleLowerCase()} preparation of “${word}.”`,
    service: `“${hint}” describes how “${word}” is commonly served.`,
    variety: `“${hint}” names the ${detail.toLocaleLowerCase()} variety of “${word}.”`,
    drink: `“${hint}” describes the ${detail.toLocaleLowerCase()} quality of “${word}.”`,
    drinkServing: `“${hint}” describes how “${word}” is normally served.`,
    anatomy: `“${hint}” identifies the ${detail.toLocaleLowerCase()} body feature of a ${word}.`,
    behavior: `“${hint}” describes the ${detail.toLocaleLowerCase()} behavior of a ${word}.`,
    landmark: `“${hint}” refers to ${possessive} ${detail.toLocaleLowerCase()} landmark.`,
    culture: `“${hint}” refers to the ${detail.toLocaleLowerCase()} tradition of “${word}.”`,
    geography: `“${hint}” refers to the ${detail.toLocaleLowerCase()} geography of “${word}.”`,
    equipment: `“${hint}” refers to the ${detail.toLocaleLowerCase()} equipment used in “${word}.”`,
    action: `“${hint}” refers to the ${detail.toLocaleLowerCase()} action performed in “${word}.”`,
    schoolPerson: `“${hint}” belongs to the school role of a “${word}.”`,
    schoolSubject: `“${hint}” is a concept studied in “${word}.”`,
    schoolObject: `“${hint}” identifies the ${detail.toLocaleLowerCase()} found on “${word}.”`,
    schoolEvent: `“${hint}” occurs as part of “${word}.”`,
    schoolPlace: `“${hint}” is commonly found in “${word}.”`,
    schoolAction: `“${hint}” identifies the ${detail.toLocaleLowerCase()} activity within “${word}.”`,
    work: `“${hint}” refers to ${detail.toLocaleLowerCase()} used in a ${word}'s work.`,
    transportPart: `“${hint}” refers to the ${detail.toLocaleLowerCase()} part of “${word}.”`,
    transportUse: `“${hint}” refers to the ${detail.toLocaleLowerCase()} movement of “${word}.”`,
    clothingFeature: `“${hint}” describes the ${detail.toLocaleLowerCase()} design of “${word}.”`,
    component: `“${hint}” refers to the ${detail.toLocaleLowerCase()} component of “${word}.”`,
    function: `“${hint}” refers to the ${detail.toLocaleLowerCase()} function of “${word}.”`,
    part: `“${hint}” refers to the ${detail.toLocaleLowerCase()} part of “${word}.”`,
    use: `“${hint}” refers to the ${detail.toLocaleLowerCase()} use of “${word}.”`,
    role: `“${hint}” refers to the ${detail.toLocaleLowerCase()} role within “${word}.”`,
    sound: `“${hint}” refers to the ${detail.toLocaleLowerCase()} sound within “${word}.”`,
    productionWork: `“${hint}” refers to the ${detail.toLocaleLowerCase()} work connected to “${word}.”`,
    feature: `“${hint}” describes the ${detail.toLocaleLowerCase()} feature of “${word}.”`,
    meaning: `“${hint}” states what the slang term “${word}” means.`,
    tradition: `“${hint}” refers to the ${detail.toLocaleLowerCase()} custom within “${word}.”`,
    daily: `“${hint}” refers to the ${detail.toLocaleLowerCase()} routine in “${word}.”`,
  };
  return templates[rel] || `“${hint}” refers to the ${detail.toLocaleLowerCase()} detail of “${word}.”`;
}

function refineCollections(collections, language) {
  const explanations = {};
  const output = {};
  for (const [category, rows] of Object.entries(collections)) {
    output[category] = rows.map((row, rowIndex) => {
      const difficulty = rowIndex < 8 ? "Easy" : rowIndex < 18 ? "Normal" : rowIndex < 26 ? "Hard" : "Extreme";
      const used = new Set();
      const refined = [row[0]];
      row.slice(1, 4).forEach((original, variant) => {
        let hint = compactHint(original, difficulty, language, variant);
        if (normalized(hint) === normalized(row[0])) hint = compactHint(original, difficulty, language, variant + 1);
        if (used.has(hint.toLocaleLowerCase())) {
          const candidates = words(original).filter((token) => !used.has(token.toLocaleLowerCase()));
          hint = candidates.at(-1) || `${hint}${variant + 1}`;
        }
        hint = words(hint).slice(0, 2).join(" ");
        used.add(hint.toLocaleLowerCase());
        refined.push(hint);
        explanations[`${language}|${category}|${row[0]}|${hint}`] = explanation(row[0], hint, original, category, language);
      });
      return refined;
    });
  }
  return { collections: output, explanations };
}

module.exports = { compactHint, explanation, refineCollections, words };
