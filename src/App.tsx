import {useEffect,useMemo,useRef,useState} from "react";
import {BookOpen,Briefcase,Camera,Car,Castle,ChevronLeft,CloudSun,Code2,Coffee,Eye,Film,Gamepad2,Globe2,GraduationCap,GripVertical,House,Leaf,MapPin,Music2,PawPrint,Play,RefreshCw,Rocket,Settings,Shapes,Shirt,Shuffle,Smartphone,Star,Sun,TreePine,Trophy,Users,WandSparkles,type LucideIcon} from "lucide-react";
import {categories as dataCategories,forLanguage} from "./word-data";
import {getSmartHintExplanation} from "./hint-explanations";
type Screen="home"|"setup"|"topics"|"reveal"|"firstPlayer"|"imposterReveal"|"clue"|"discussion"|"voting"|"guess"|"result"|"scores"|"settings"|"stats"|"help";
const APP_SCREENS=new Set<Screen>(["home","setup","topics","reveal","firstPlayer","imposterReveal","clue","discussion","voting","guess","result","scores","settings","stats","help"]);
type Player={id:string,name:string,points:number,wins:number,correct:number,rounds:number};
const names=["Alex","Sam","Jordan","Taylor"];
const starters=["Food","Animals","Countries","World Cities","Sports","Movies","TV Shows","Video Games","Technology","School","Jobs","Places","Household Objects","Transportation","Nature","Clothing","Technology Brands","Social Media","Philippine Food","Philippine Cities","Philippine Provinces","Filipino Culture","Filipino Festivals","Filipino Slang","Internet Culture","Fantasy","Block Worlds","Roblox Worlds","Anime","Music","Space","Science","Health","Weather","Holidays","Ocean Life","Travel","Art","Books","Superpowers","Mystery","Camping","Garden","Farm","Office","Kitchen","Bathroom","Party","Childhood","Feelings","Actions","Sounds","Shapes & Colors","Money","Shopping","Construction","Crime & Law","History","Campus Life","Programming","Board Games","Photography","Extreme Ideas"];
const banks=[
["Pizza","Burger","Sushi","Ramen","Fried Chicken","Ice Cream","Pancakes","Donut","Chocolate","Spaghetti","Tacos","Sandwich","Steak","Noodles","Popcorn","Lasagna","Curry","Dumplings","Salad","Waffles"],
["Dog","Cat","Lion","Tiger","Elephant","Giraffe","Monkey","Penguin","Dolphin","Shark","Eagle","Snake","Turtle","Panda","Kangaroo","Otter","Wolf","Owl","Octopus","Cheetah"],
["Philippines","Japan","Canada","Brazil","France","Egypt","Australia","India","Mexico","Thailand","Norway","Argentina","Kenya","Italy","Spain","Germany","Vietnam","Morocco","Chile","Indonesia"],
["Manila","Tokyo","Paris","Seoul","Singapore","London","New York","Sydney","Dubai","Rome","Bangkok","Toronto","Cairo","Mumbai","Barcelona","Nairobi","Lima","Amsterdam","Istanbul","Auckland"],
["Basketball","Football","Soccer","Volleyball","Tennis","Baseball","Boxing","Swimming","Golf","Badminton","Cycling","Skateboarding","Archery","Surfing","Fencing","Rugby","Bowling","Gymnastics","Hockey","Wrestling"],
["Smartphone","Laptop","Keyboard","Mouse","Internet","Wi-Fi","Bluetooth","Server","Programming","Robot","Artificial Intelligence","Camera","Password","Database","Algorithm","Touchscreen","Web Browser","Microchip","Cloud Storage","USB Cable"],
["Teacher","Student","Exam","Classroom","Homework","Blackboard","Mathematics","Science","Library","Principal","Report Card","Recess","Notebook","Pencil","Laboratory","Graduation","Uniform","Project","Attendance","Field Trip"],
["Doctor","Nurse","Programmer","Teacher","Engineer","Chef","Pilot","Lawyer","Police Officer","Farmer","Architect","Designer","Firefighter","Dentist","Journalist","Mechanic","Photographer","Accountant","Barber","Scientist"],
["Airport","Hospital","School","Mall","Beach","Restaurant","Hotel","Park","Museum","Library","Cinema","Bakery","Stadium","Market","Zoo","Pharmacy","Office","Church","Campsite","Playground"],
["Adobo","Sinigang","Lechon","Kare-Kare","Lumpia","Halo-Halo","Pancit","Sisig","Balut","Taho","Bibingka","Champorado","Tinola","Turon","Dinuguan","Longganisa","Puto","Bicol Express","Laing","Chicken Inasal"],
["Dragon","Wizard","Knight","Castle","Magic","Sword","Dungeon","Potion","Monster","Princess","Elf","Goblin","Spellbook","Crystal Ball","Treasure Chest","Unicorn","Fairy","Crown","Quest","Portal"],
["Guitar","Piano","Drums","Violin","Hip-Hop","Jazz","Pop Music","Rock Band","Concert","Microphone","Playlist","Chorus","Melody","Bass","DJ","Album","Encore","Singer","Headphones","Music Festival"],
["Passport","Suitcase","Boarding Pass","Tour Guide","Souvenir","Hostel","Itinerary","Road Trip","Map","Tourist","Currency Exchange","Backpack","Landmark","Flight","Cruise","Reservation","Customs","Adventure","Postcard","Jet Lag"],
["Meme","Going Viral","Clickbait","Reaction Video","Thread","Lurker","Troll","Screenshot","Fan Edit","Unboxing","POV","Challenge","Influencer","Livestream","Copypasta","Avatar","Username","Comment War","Trending Page","Notification"],
["Déjà Vu","Paradox","Nostalgia","Gravity Well","Butterfly Effect","Identity","Free Will","Parallel Universe","Collective Memory","Optical Illusion","Social Contract","Infinite Loop","Uncanny Valley","Moral Dilemma","Placebo Effect","Time Perception","Chaos Theory","Confirmation Bias","Lost Civilization","Simulation"]
];
const legacyCategories=starters.map((name,i)=>({name,words:banks[i%banks.length].map((w,j)=>i>14&&j%4===0?`${w} · ${name}`:w)}));
const ico=(n:string)=>{
 const icons:Record<string,LucideIcon>={gear:Settings,sun:Sun,moon:Sun,play:Play,back:ChevronLeft,eye:Eye,shuffle:Shuffle};
 const Icon=icons[n]||Shapes;
 return <Icon aria-hidden="true"/>;
};
const getCategoryIcon=(name:string)=>{
 const groups:Array<[LucideIcon,string[]]>=[
  [Coffee,["Food","Pagkain","Philippine Food","Drinks","Inumin","Kitchen"]],[PawPrint,["Animals","Hayop","Ocean Life"]],
  [Globe2,["Countries","Cities","World Cities","Philippine Cities","Philippine Provinces","Lugar","Mga Lugar sa Pilipinas","Places","Travel"]],[Trophy,["Sports","Palakasan","Board Games"]],
  [Film,["Movies","TV Shows","Pelikula","Anime"]],[Gamepad2,["Video Games","Larong Pinoy","Roblox Worlds","Block Worlds"]],
  [Smartphone,["Technology","Technology Brands","Social Media","Internet Culture","Brands & Social Media"]],[Code2,["Programming"]],[Briefcase,["Jobs","Trabaho","Office"]],
  [GraduationCap,["School","Paaralan","Campus Life"]],[Car,["Transportation","Sasakyan"]],[Shirt,["Clothing"]],[House,["Household Objects","Bagay","Bahay","Bathroom"]],
  [TreePine,["Nature","Camping","Garden","Farm"]],[Leaf,["Kalikasan"]],[CloudSun,["Weather"]],[Music2,["Music","Sounds"]],[WandSparkles,["Fantasy","Superpowers"]],
  [Rocket,["Science & Space","Science","Space"]],[Camera,["Photography","Art","Hobbies"]],[BookOpen,["Books","History"]],
  [Star,["Celebrity","Artista","Artista at Aliwan","Filipino Culture","Kulturang Pilipino","Filipino Slang","Pinoy Slang","Pista at Tradisyon","Filipino Festivals","Holidays","Party"]],
  [Users,["Childhood","Feelings","Actions","Pang-araw-araw na Buhay"]],[Castle,["Mystery","Extreme Ideas","Crime & Law"]],[MapPin,["Money","Shopping","Construction"]]
 ];
 const Icon=groups.find(([,names])=>names.includes(name))?.[0]||Shapes;
 return <Icon aria-hidden="true"/>;
};
const getCategoryDescription=(name:string, language:string)=>{
 const descs:Record<string,string>={
  "Food":"Delicious dishes, meals, snacks, and treats from around the world.",
  "Pagkain":"Masasarap na ulam, miryenda, at tradisyonal na pagkaing Pinoy.",
  "Philippine Food":"Popular and iconic Filipino dishes, street foods, and regional delicacies.",
  "Drinks":"Refreshing beverages, sodas, coffees, teas, and specialty drinks.",
  "Inumin":"Mga pampalamig, tradisyonal na inumin, kape, at sari-saring inumin.",
  "Animals":"Wild beasts, friendly pets, birds, sea creatures, and safari wildlife.",
  "Hayop":"Mga alagang hayop, maiilap na hayop sa gubat, at mga lumilipad at lumalangoy.",
  "Countries":"Nations and territories across all continents around the globe.",
  "Cities":"Famous world metropolises, iconic landmarks, and bustling capitals.",
  "World Cities":"Major international destinations and world-famous cities.",
  "Philippine Cities":"Prominent cities and urban centers across Luzon, Visayas, and Mindanao.",
  "Philippine Provinces":"Provinces and island regions known across the Philippines.",
  "Places":"Everyday locations, travel destinations, public spots, and venues.",
  "Lugar":"Mga pamilyar na pook, pasyalan, gusali, at pampublikong lugar.",
  "Mga Lugar sa Pilipinas":"Mga sikat na pasyalan, tanawin, at isla sa buong Pilipinas.",
  "Sports":"Popular team sports, athletics, competitive games, and matches.",
  "Palakasan":"Mga larong pampalakasan, kompetisyon, at pisikal na aktibidad.",
  "Movies":"Film terms, cinematic tropes, blockbuster cinema, and Hollywood magic.",
  "Pelikula":"Mga termino sa pelikula, eksena, at industriya ng sine.",
  "TV Shows":"Television series, streaming favorites, sitcoms, and broadcast formats.",
  "Video Games":"Gaming terms, mechanics, console favorites, and virtual adventures.",
  "Larong Pinoy":"Mga tradisyonal na larong kalye at paboritong libangan ng kabataan.",
  "Board Games":"Tabletop classics, strategy board games, and family party pastimes.",
  "Roblox Worlds":"Popular virtual worlds, obbies, and experiences on Roblox.",
  "Block Worlds":"Sandbox crafting, voxel survival, and block-building dimensions.",
  "Technology":"Digital devices, computing hardware, modern gadgets, and networks.",
  "Technology Brands":"World-leading tech innovators, hardware manufacturers, and software giants.",
  "Programming":"Coding concepts, development workflows, software architecture, and syntax.",
  "Jobs":"Professions, trades, workplace careers, and skilled occupations.",
  "Trabaho":"Iba't ibang hanapbuhay, propesyon, at serbisyong panlipunan.",
  "School":"Classroom life, school subjects, study gear, and academic milestones.",
  "Paaralan":"Buhay-estudyante, silid-aralan, gamit sa klase, at pagsusulit.",
  "Campus Life":"College student culture, university events, dorms, and campus routines.",
  "Transportation":"Vehicles, public transit systems, flights, and road travel.",
  "Sasakyan":"Mga pampublikong sasakyan, pampasaherong biyahe, at sasakyang panlupa't dagat.",
  "Clothing":"Apparel, fashion accessories, everyday wear, and wardrobe essentials.",
  "Household Objects":"Everyday tools, furniture, and appliances found inside the home.",
  "Bagay":"Mga karaniwang gamit, kagamitan sa bahay, at personal na ari-arian.",
  "Bahay":"Mga bahagi ng tahanan, silid, at kasangkapan sa pamamahay.",
  "Kitchen":"Cooking utensils, pantry staples, appliances, and kitchen items.",
  "Bathroom":"Bath essentials, hygiene products, toiletries, and restroom fixtures.",
  "Office":"Workplace furniture, desktop stationery, and office supplies.",
  "Nature":"Natural landscapes, weather wonders, wilderness, and Earth's terrain.",
  "Kalikasan":"Mga anyong lupa, anyong tubig, panahon, at kagandahan ng kapaligiran.",
  "Camping":"Outdoor survival gear, campfire basics, tents, and wild expeditions.",
  "Garden":"Plants, flowers, gardening tools, soil, and backyard greenery.",
  "Farm":"Agriculture, livestock, barn equipment, and countryside harvest.",
  "Ocean Life":"Marine creatures, coral reefs, deep-sea wonders, and coastal life.",
  "Weather":"Atmospheric phenomena, seasons, storms, and climate conditions.",
  "Music":"Instruments, genres, live concerts, melody, and rhythm.",
  "Internet Culture":"Viral memes, social trends, digital slang, and online behavior.",
  "Social Media":"Feeds, followers, viral reels, notifications, and social networks.",
  "Brands & Social Media":"Household brand names, tech platforms, and digital networks.",
  "Fantasy":"Dragons, spells, mythical creatures, knights, and magical lore.",
  "Anime":"Popular Japanese animation tropes, genres, and anime world concepts.",
  "Superpowers":"Extraordinary superhero abilities, psychic powers, and heroic gifts.",
  "Science & Space":"Cosmic wonders, astronomy, physics, experiments, and the universe.",
  "Science":"Scientific discoveries, lab experiments, elements, and natural laws.",
  "Space":"Planets, star clusters, galaxies, astronauts, and deep space exploration.",
  "Hobbies":"Creative crafts, leisure activities, outdoor pursuits, and relaxing pastimes.",
  "Art":"Fine art tools, painting techniques, gallery aesthetics, and drawing mediums.",
  "Photography":"Camera gear, lighting, shutter techniques, and visual composition.",
  "Books":"Literary terms, reading culture, book genres, and storytelling.",
  "Extreme Ideas":"Mind-bending paradoxes, philosophy, consciousness, and deep concepts.",
  "Mystery":"Whodunit clues, unsolved cases, secret agents, and cryptic riddles.",
  "History":"Ancient civilizations, historical eras, empires, and monumental events.",
  "Crime & Law":"Courtroom trials, legal terms, detectives, and criminal investigations.",
  "Money":"Currency, banking, finance, market economics, and wealth terms.",
  "Shopping":"Retail therapy, department stores, bargaining, and checkout carts.",
  "Construction":"Heavy machinery, building tools, materials, and architectural works.",
  "Celebrity":"World-famous musicians, Hollywood icons, and pop-culture megastars.",
  "Artista":"Mga sikat na aktor, aktres, mang-aawit, at personalidad sa Pilipinas.",
  "Artista at Aliwan":"Showbiz, teleserye, konsiyerto, at industriya ng aliwan sa Pilipinas.",
  "Filipino Culture":"Pinoy values, hospitality, customs, and proud national identity.",
  "Kulturang Pilipino":"Mga kaugalian, pagpapahalaga, at natatanging tradisyon ng mga Pilipino.",
  "Filipino Slang":"Lingo, trending colloquialisms, and conversational Pinoy expressions.",
  "Pinoy Slang":"Mga patok na salita, millennial/Gen-Z slang, at usapang kalye.",
  "Filipino Festivals":"Colorful cultural fiestas, street dancing, and religious celebrations.",
  "Pista at Tradisyon":"Mga pista, kapistahan, at nakagawiang pagdiriwang sa Pilipinas.",
  "Holidays":"Global festivities, seasonal holiday traditions, and celebrations.",
  "Party":"Birthday bashes, celebrations, music, decorations, and party games.",
  "Childhood":"Nostalgic playground games, toy memories, and youthful experiences.",
  "Feelings":"Human emotions, mood states, empathy, and heartfelt reactions.",
  "Actions":"Physical movements, dynamic activities, verbs, and athletic motions.",
  "Sounds":"Noises, acoustic echoes, music effects, and auditory sensations.",
  "Shapes & Colors":"Geometric shapes, vibrant hues, shades, and visual palettes.",
  "Health":"Wellness, medicine, fitness, healthcare, and bodily vitality.",
  "Travel":"Vacations, flight itineraries, luggage, and globetrotting adventures.",
  "Pang-araw-araw na Buhay":"Mga gawaing-bahay, araw-araw na rutina, at buhay sa komunidad."
 };
 return descs[name] || (language === "Tagalog" ? `Koleksyon ng mga salita para sa ${name}.` : `Word pack featuring ${name} terms and associations.`);
};
const shuffled=<T,>(x:T[])=>{const a=[...x];for(let i=a.length-1;i;i--){let j=crypto.getRandomValues(new Uint32Array(1))[0]%(i+1);[a[i],a[j]]=[a[j],a[i]]}return a};
const explainHint=(word:string,hint:string,language:string,category:string)=>{
 return getSmartHintExplanation(word, hint, language, category);
};
export default function App(){
 const [screen,setScreen]=useState<Screen>("home"),[players,setPlayers]=useState<Player[]>(names.map((name,i)=>({id:"p"+i,name,points:0,wins:0,correct:0,rounds:0}))),[selected,setSelected]=useState(["Food","Animals","Technology"]),[favorites,setFavorites]=useState<string[]>([]),[difficulty,setDifficulty]=useState("Easy"),[mode,setMode]=useState("Classic"),[imposterN,setImposterN]=useState(1),[escape,setEscape]=useState(false),[scoring,setScoring]=useState(false),[imposterHint,setImposterHint]=useState(true),[language,setLanguage]=useState<"English"|"Tagalog"|"Both">("English"),[timerSetting,setTimerSetting]=useState<number|null>(null),[theme,setTheme]=useState("dark"),[motion,setMotion]=useState(true),[rounds,setRounds]=useState(0),[used,setUsed]=useState<string[]>([]),[query,setQuery]=useState("");
 const screenRef=useRef<Screen>("home");
 const draggedPlayerId=useRef<string|null>(null);
 const [word,setWord]=useState(""),[imposterHints,setImposterHints]=useState<Record<string,string>>({}),[hintHistory,setHintHistory]=useState<Record<string,number>>({}),[selectedHint,setSelectedHint]=useState<{player:string;hint:string}|null>(null),[topic,setTopic]=useState(""),[wordLanguage,setWordLanguage]=useState("English"),[order,setOrder]=useState<Player[]>([]),[firstPlayerId,setFirstPlayerId]=useState(""),[voteMode,setVoteMode]=useState<"off"|"normal"|"anonymous">("off"),[imps,setImps]=useState<string[]>([]),[ri,setRi]=useState(0),[shown,setShown]=useState(false),[hasRevealed,setHasRevealed]=useState(false),[rerollConfirm,setRerollConfirm]=useState(false),[publicReveal,setPublicReveal]=useState(false),[ci,setCi]=useState(0),[time,setTime]=useState(0),[votes,setVotes]=useState<Record<string,string>>({}),[vi,setVi]=useState(0),[guess,setGuess]=useState(""),[winner,setWinner]=useState(""),[roundResolved,setRoundResolved]=useState(false),[escapedRound,setEscapedRound]=useState(false);
 const currentLanguageCategories=forLanguage(language),knownEntries=dataCategories.flatMap(c=>c.words);
 const preservedEnglish=legacyCategories.filter(c=>!dataCategories.some(d=>d.language==="English"&&d.name===c.name)).map(c=>({name:c.name,language:"English" as const,words:c.words.map((raw,i)=>{const word=raw.split(" · ")[0],known=knownEntries.find(x=>x.word===word),primary=["Familiar","Everyday","Recognizable","Common pairing","Often seen"][i%5];return{word,hints:known?.hints||[primary,`Linked to ${primary}`,`${primary} clue`],language:"English" as const,difficulty:(i<5?"Easy":i<10?"Normal":i<14?"Hard":"Extreme") as "Easy"|"Normal"|"Hard"|"Extreme"}})}));
 const gameCategories=language==="Tagalog"?currentLanguageCategories:[...currentLanguageCategories,...preservedEnglish],totalWords=gameCategories.reduce((n,c)=>n+c.words.length,0);
 useEffect(()=>{try{let s=JSON.parse(localStorage.getItem("uwp")||"null");if(s){setPlayers(s.players);setFavorites(s.favorites||[]);setTheme(s.theme||"dark");setRounds(s.rounds||0);setUsed(s.used||[]);setLanguage(s.language||"English");setTimerSetting(s.timerSetting===undefined?null:s.timerSetting);setEscape(s.escape??false);setScoring(s.scoring??false);setVoteMode(s.voteMode||"off");setImposterHint(s.imposterHint??true);setHintHistory(s.hintHistory||{})}}catch{}},[]);
 useEffect(()=>{localStorage.setItem("uwp",JSON.stringify({players,favorites,theme,rounds,used,language,timerSetting,escape,scoring,voteMode,imposterHint,hintHistory}));document.documentElement.dataset.theme=theme;document.documentElement.classList.toggle("reduced",!motion)},[players,favorites,theme,rounds,used,motion,language,timerSetting,escape,scoring,voteMode,imposterHint,hintHistory]);
 useEffect(()=>{if(voteMode==="off"&&escape)setEscape(false)},[voteMode,escape]);
 useEffect(()=>{if(timerSetting===null||!time)return;let t=setInterval(()=>setTime(v=>Math.max(0,v-1)),1000);return()=>clearInterval(t)},[time,timerSetting]);
 useEffect(()=>{screenRef.current=screen},[screen]);
 useEffect(()=>{
  history.replaceState({...history.state,blendinScreen:"home"},"",location.href);
  const medianBridge=(window as typeof window&{median?:{android?:{swipeGestures?:{enable?:()=>void}}}}).median;
  try{medianBridge?.android?.swipeGestures?.enable?.()}catch{}
  const onPopState=(event:PopStateEvent)=>{
   const destination=event.state?.blendinScreen;
   const next=APP_SCREENS.has(destination)?destination as Screen:"home";
   screenRef.current=next;
   setShown(false);
   setSelectedHint(null);
   setScreen(next);
   scrollTo({top:0,left:0,behavior:"instant"});
   if(!APP_SCREENS.has(destination))history.replaceState({...history.state,blendinScreen:"home"},"",location.href);
  };
  let touchStartY=0;
  const onTouchStart=(event:TouchEvent)=>{touchStartY=event.touches[0]?.clientY??0};
  const preventPullRefresh=(event:TouchEvent)=>{const currentY=event.touches[0]?.clientY??touchStartY;if(scrollY<=0&&currentY>touchStartY&&event.cancelable)event.preventDefault()};
  addEventListener("popstate",onPopState);
  document.addEventListener("touchstart",onTouchStart,{passive:true});
  document.addEventListener("touchmove",preventPullRefresh,{passive:false});
  return()=>{removeEventListener("popstate",onPopState);document.removeEventListener("touchstart",onTouchStart);document.removeEventListener("touchmove",preventPullRefresh)};
 },[]);
 useEffect(()=>{
  const getRow=(target:EventTarget|null)=>target instanceof Element?target.closest(".players label"):null;
  const beginDrag=(event:Event)=>{const handle=event.target instanceof Element?event.target.closest(".drag-handle"):null;if(handle)getRow(handle)?.classList.add("is-dragging")};
  const moveAcrossRows=(event:PointerEvent|DragEvent)=>{
   const sourceId=draggedPlayerId.current;
   if(!sourceId)return;
   const rows=[...document.querySelectorAll<HTMLElement>(".players label[data-player-id]")].filter(row=>row.dataset.playerId!==sourceId);
   const beforeRow=rows.find(row=>event.clientY<row.getBoundingClientRect().top+row.getBoundingClientRect().height/2);
   const beforeId=beforeRow?.dataset.playerId;
   setPlayers(current=>{
    const from=current.findIndex(player=>player.id===sourceId);
    if(from<0)return current;
    const next=current.filter(player=>player.id!==sourceId);
    const insertAt=beforeId?next.findIndex(player=>player.id===beforeId):next.length;
    const safeIndex=insertAt<0?next.length:insertAt;
    next.splice(safeIndex,0,current[from]);
    return next.every((player,index)=>player.id===current[index]?.id)?current:next;
   });
   if(event.cancelable)event.preventDefault();
  };
  const endDrag=()=>{draggedPlayerId.current=null;document.querySelectorAll(".players label.is-dragging").forEach(row=>row.classList.remove("is-dragging"))};
  document.addEventListener("dragstart",beginDrag);
  document.addEventListener("dragover",moveAcrossRows);
  document.addEventListener("dragend",endDrag);
  document.addEventListener("pointerdown",beginDrag);
  document.addEventListener("pointermove",moveAcrossRows,{passive:false});
  document.addEventListener("pointerup",endDrag);
  document.addEventListener("pointercancel",endDrag);
  return()=>{document.removeEventListener("dragstart",beginDrag);document.removeEventListener("dragover",moveAcrossRows);document.removeEventListener("dragend",endDrag);document.removeEventListener("pointerdown",beginDrag);document.removeEventListener("pointermove",moveAcrossRows);document.removeEventListener("pointerup",endDrag);document.removeEventListener("pointercancel",endDrag)};
 },[]);
 const go=(s:Screen)=>{if(s!==screenRef.current){screenRef.current=s;history.pushState({...history.state,blendinScreen:s},"",location.href)}setShown(false);setSelectedHint(null);setScreen(s);scrollTo({top:0,left:0,behavior:"instant"})},top=<header className="top"><button aria-label="Back" onClick={()=>go(screen==="topics"?"setup":"home")}>{ico("back")}</button><img src="/brand-logo.png" alt="BLENDIN Logo" className="brand-logo-mark"/><button aria-label="Settings" onClick={()=>go("settings")}>{ico("gear")}</button></header>;
 const start=()=>{let cs=selected.length?gameCategories.filter(c=>selected.includes(c.name)):gameCategories;if(!cs.length)cs=gameCategories;const wanted=mode==="No Mercy"?["Hard","Extreme"]:difficulty==="Easy"?["Easy"]:difficulty==="Normal"?["Normal"]:difficulty==="Hard"?["Hard"]:["Extreme"];let candidates=cs.flatMap(category=>{const matching=category.words.filter(w=>wanted.includes(w.difficulty));return matching.map(entry=>({entry,category}))});if(!candidates.length)candidates=gameCategories.flatMap(category=>category.words.filter(w=>wanted.includes(w.difficulty)).map(entry=>({entry,category})));const seen=new Set<string>();candidates=candidates.filter(({entry})=>{const key=entry.language+":"+entry.word.trim().toLowerCase();if(seen.has(key))return false;seen.add(key);return true});const wordKey=(entry:(typeof candidates)[number]["entry"])=>"word:"+entry.language+":"+entry.word.trim().toLowerCase();let fresh=candidates.filter(({entry})=>!used.includes(wordKey(entry)));if(!fresh.length){const ranked=[...candidates].sort((a,b)=>used.lastIndexOf(wordKey(a.entry))-used.lastIndexOf(wordKey(b.entry)));fresh=ranked.slice(0,Math.max(1,Math.ceil(ranked.length*.2)))}const pick=fresh[crypto.getRandomValues(new Uint32Array(1))[0]%fresh.length],entry=pick.entry,c=pick.category,n=mode==="Double Imposter"?2:mode==="Chaos"?1+crypto.getRandomValues(new Uint32Array(1))[0]%Math.min(3,players.length-2):imposterN,o=[...players],chosenImps=shuffled(players).slice(0,n).map(p=>p.id),tierOrder=entry.difficulty==="Easy"?[0,1,2]:entry.difficulty==="Normal"?[1,0,2]:entry.difficulty==="Hard"?[1,2,0]:[2,1,0],availableOrder=tierOrder.filter(i=>i<entry.hints.length),historyKey=entry.language+":"+entry.word+":"+entry.difficulty,base=(hintHistory[historyKey]||0)%availableOrder.length,hintMap=Object.fromEntries(chosenImps.map((id,i)=>[id,entry.hints[availableOrder[(base+i)%availableOrder.length]]]));setWord(entry.word);setImposterHints(hintMap);setHintHistory(h=>({...h,[historyKey]:(base+Math.max(1,n))%availableOrder.length}));setWordLanguage(entry.language);setTopic(c.name);setUsed(v=>[...v,wordKey(entry)].slice(-2000));setOrder(o);setFirstPlayerId("");setImps(chosenImps);setRi(0);setShown(false);setHasRevealed(false);setPublicReveal(false);setRoundResolved(false);setEscapedRound(false);setWinner("");setCi(0);setVotes({});setVi(0);setGuess("");setTime(0);go("reveal")};
 const counts=useMemo(()=>Object.values(votes).reduce((a,x)=>(a[x]=(a[x]||0)+1,a),{} as Record<string,number>),[votes]),mx=Math.max(0,...Object.values(counts)),accused=Object.keys(counts).filter(x=>mx>0&&counts[x]===mx),caughtImps=accused.filter(id=>imps.includes(id)),caught=caughtImps.length>0;
 const resolveRound=(win:string,escaped=false)=>{if(roundResolved)return;setWinner(win);setEscapedRound(escaped);setRoundResolved(true);setRounds(x=>x+1);setPlayers(ps=>ps.map(p=>{const imp=imps.includes(p.id),correct=imps.includes(votes[p.id]);const gain=scoring?((win==="players"&&!imp?2:0)+(win==="imposters"&&imp?(escaped?4:3):0)+(correct?1:0)):0;return{...p,points:p.points+gain,wins:p.wins+((win==="players"&&!imp)||(win==="imposters"&&imp)?1:0),correct:p.correct+(correct?1:0),rounds:p.rounds+1}}))};
 const revealRound=()=>{if(publicReveal)return;setPublicReveal(true);if(voteMode==="off"){setRoundResolved(true);setRounds(x=>x+1);setPlayers(ps=>ps.map(p=>({...p,rounds:p.rounds+1})))}else if(!caught)resolveRound("imposters");else if(!escape)resolveRound("players")};
 if(screen==="home")return <main className="shell home"><header><img src="/brand-logo.png" alt="BLENDIN Logo" className="brand-logo-mark"/><button onClick={()=>go("settings")}>{ico("gear")}</button></header><section className="hero"><p>WHO&apos;S THE IMPOSTOR?</p><h1>BLEND<br/><span>IN</span></h1><small>One secret word. Someone is trying to blend in.</small></section><button className="primary big" onClick={()=>go("setup")}>{ico("play")}<span><b>Play</b><small>Set up your perfect round</small></span></button><button className="secondary big" onClick={start}>{ico("shuffle")}<span><b>Quick Play</b><small>Jump in with saved players</small></span></button><nav>{[["topics","Categories","Browse topics"],["stats","Statistics",rounds+" rounds"],["settings","Settings","Rules & display"],["help","How to Play","Learn in 60 sec"]].map(x=><button key={x[0]} onClick={()=>go(x[0] as Screen)}><b>{x[1]}</b><small>{x[2]}</small></button>)}</nav></main>;
 if(screen==="setup"){const moveDragged=(targetId:string)=>{const sourceId=draggedPlayerId.current;if(!sourceId||sourceId===targetId)return;setPlayers(current=>{const from=current.findIndex(p=>p.id===sourceId),to=current.findIndex(p=>p.id===targetId);if(from<0||to<0)return current;const next=[...current],[moved]=next.splice(from,1);next.splice(to,0,moved);return next})};return <main className="shell">{top}<Head over="New game" title="Build your crew" sub="Pass one phone. Trust no clue."/><Card><div className="row"><b>Players <em>{players.length}/15</em></b><button className="text" onClick={()=>setPlayers(shuffled(players))}>{ico("shuffle")} Shuffle</button></div><div className="players">{players.map((p,i)=><label key={p.id} data-player-id={p.id} onDragOver={e=>{e.preventDefault();moveDragged(p.id)}}><button type="button" className="drag-handle" aria-label={`Move ${p.name}`} draggable onDragStart={e=>{draggedPlayerId.current=p.id;e.dataTransfer.effectAllowed="move"}} onDragEnd={()=>{draggedPlayerId.current=null}} onPointerDown={e=>{draggedPlayerId.current=p.id;e.currentTarget.setPointerCapture(e.pointerId)}} onPointerMove={e=>{if(draggedPlayerId.current!==p.id)return;const target=document.elementFromPoint(e.clientX,e.clientY)?.closest<HTMLElement>("[data-player-id]")?.dataset.playerId;if(target)moveDragged(target)}} onPointerUp={e=>{draggedPlayerId.current=null;e.currentTarget.releasePointerCapture(e.pointerId)}} onPointerCancel={()=>{draggedPlayerId.current=null}}><GripVertical aria-hidden="true"/></button><small>{String(i+1).padStart(2,"0")}</small><input value={p.name} onChange={e=>setPlayers(players.map(x=>x.id===p.id?{...x,name:e.target.value}:x))}/><button disabled={players.length<=3} onClick={()=>setPlayers(players.filter(x=>x.id!==p.id))}>×</button></label>)}</div><button className="add" disabled={players.length>=15} onClick={()=>setPlayers([...players,{id:crypto.randomUUID(),name:"Player "+(players.length+1),points:0,wins:0,correct:0,rounds:0}])}>+ Add player</button></Card><Card><Label>Language</Label><div className="segments three">{(["English","Tagalog","Both"] as const).map(x=><button key={x} className={language===x?"on":""} onClick={()=>{setLanguage(x);setSelected([])}}>{x}</button>)}</div><div className="row topic-row"><span><b>Topic packs</b>{selected.length===0?(<small className="topic-all">All categories</small>):(<span className="topic-chips">{selected.slice(0,4).map(n=><span key={n} className="topic-chip">{n}</span>)}{selected.length>4&&<span className="topic-chip topic-chip-more">+{selected.length-4}</span>}</span>)}</span><button className="pill" onClick={()=>go("topics")}>Choose</button></div><Label>Difficulty</Label><div className="segments">{["Easy","Normal","Hard","Extreme"].map(x=><button key={x} className={difficulty===x?"on":""} onClick={()=>setDifficulty(x)}>{x}</button>)}</div><Label>Game mode</Label><div className="modes">{["Classic","Double Imposter","Chaos","Hidden Topic","Known Topic","No Mercy","Quick Round","Troll Mode"].map(x=><button key={x} className={mode===x?"on":""} onClick={()=>setMode(x)}><b>{x}</b><small>{x==="Classic"?"One hidden player":x==="Double Imposter"?"Two hidden players":x==="Chaos"?"Unknown enemy count":x==="Hidden Topic"?"Category stays secret":x==="Known Topic"?"Category is public":x==="No Mercy"?"Hard words only":x==="Quick Round"?"Short timers":"Reverse clue order"}</small></button>)}</div>{mode==="Classic"&&<div className="row line"><span><b>Imposters</b><small>Keep two citizens</small></span><div className="step"><button onClick={()=>setImposterN(Math.max(1,imposterN-1))}>−</button><b>{imposterN}</b><button onClick={()=>setImposterN(Math.min(players.length-2,imposterN+1))}>+</button></div></div>}</Card><Sticky onClick={start} disabled={players.length<3||players.some(p=>!p.name.trim())}>Start game</Sticky></main>}
 if(screen==="topics"){let list=gameCategories.filter(c=>c.name.toLowerCase().includes(query.toLowerCase()));return <main className="shell">{top}<Head over="Word library" title="Choose topics" sub="Mix English and Tagalog packs for unpredictable rounds."/><div className="language-badge">{language} collection</div><div className="search"><input aria-label="Search categories" placeholder="Search categories" value={query} onChange={e=>setQuery(e.target.value)}/></div><div className="tools"><button onClick={()=>setSelected(gameCategories.map(c=>c.name))}>Select all</button><button onClick={()=>setSelected([])}>Clear all</button><button onClick={()=>setSelected(shuffled(gameCategories).slice(0,3).map(c=>c.name))}>Random 3</button></div><div className="cats">{list.map((c,i)=>{const desc=getCategoryDescription(c.name,c.language);return <button key={c.language+c.name} className={"cat-btn "+(selected.includes(c.name)?"on":"")} title={`${c.name}: ${desc}`} aria-label={`${c.name} (${c.language}): ${desc}`} onClick={()=>setSelected(v=>v.includes(c.name)?v.filter(x=>x!==c.name):[...v,c.name])}><i className={"cat-icon a"+i%6}>{getCategoryIcon(c.name)}</i><span><b>{c.name}</b><small>{c.language}</small></span><em onClick={e=>{e.stopPropagation();setFavorites(f=>f.includes(c.name)?f.filter(x=>x!==c.name):[...f,c.name])}}>{favorites.includes(c.name)?"★":"☆"}</em><span className="cat-tooltip" role="tooltip">{desc}</span></button>})}</div><Sticky onClick={()=>go("setup")}>Use {selected.length||"all"} categories</Sticky></main>}
 if(screen==="reveal"){let p=order[ri],imp=imps.includes(p.id);const hide=()=>setShown(false),reveal=()=>{setShown(true);setHasRevealed(true)},next=()=>{setShown(false);setHasRevealed(false);if(ri<order.length-1)setRi(ri+1);else{const chosen=players[crypto.getRandomValues(new Uint32Array(1))[0]%players.length];setFirstPlayerId(chosen.id);go("firstPlayer")}},skipCurrent=()=>{if(hasRevealed||order.length-ri<=1)return;setOrder(current=>{const next=[...current],[skipped]=next.splice(ri,1);next.push(skipped);return next})};
  // Category visibility rules: mode overrides take priority over difficulty
  const showCatToPlayer=mode==="Hidden Topic"?false:true;
  const showCatToImp=mode==="Known Topic"?true:mode==="Hidden Topic"?false:mode==="No Mercy"?false:(difficulty==="Easy"||difficulty==="Normal")?true:false;
  return <main className={"shell reveal-card-screen "+(shown?(imp?"danger":"safe"):"")}><div className="phase reveal-phase"><span>PRIVATE ROLE</span><span>{ri+1} / {order.length}</span><button className="reroll-trigger" aria-label="Emergency reroll round" title="Reroll round" disabled={shown} onClick={()=>setRerollConfirm(true)}><RefreshCw aria-hidden="true"/></button></div><div className="bar"><i style={{width:(ri/order.length*100)+"%"}}/></div><header className="reveal-player"><p>Pass the phone to</p><h1>{p.name}</h1><small>Only {p.name} should view the card</small></header><div className="flip-stage"><button className={"flip-card "+(shown?"is-flipped":"")} aria-label="Press and hold to reveal your private role" aria-pressed={shown} onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);reveal()}} onPointerUp={hide} onPointerCancel={hide} onPointerLeave={hide} onContextMenu={e=>e.preventDefault()}><span className="flip-inner"><span className="card-face card-front"><i>B</i><em>PLAYER {ri+1}</em><h2>{p.name}</h2><div className="hold-ring">{ico("eye")}</div><b>Press and hold</b><small>Release to hide</small></span><span className={"card-face card-back "+(imp?"imposter-face":"word-face")}>{imp?<>{(showCatToImp&&topic)&&<div className="card-category"><em>CATEGORY</em><strong>{topic}</strong></div>}<i className="card-mark">?</i><em>PRIVATE ROLE</em><h2>YOU ARE THE<br/><b>IMPOSTOR</b></h2>{imposterHint&&<aside>Hint<b>{imposterHints[p.id]}</b></aside>}</>:<>{(showCatToPlayer&&topic)&&<div className="card-category"><em>CATEGORY</em><strong>{topic}</strong></div>}<em>YOUR WORD</em><h2 className="card-word">{word}</h2></>}<small>Keep holding to view</small></span></span></button></div><p className="reveal-instruction">{shown?"Release the card before passing the phone.":"Hold the card to check your private role."}</p><div className="reveal-controls">{!hasRevealed&&<button className="secondary change-player" disabled={order.length-ri<=1} onClick={skipCurrent}>Change next player</button>}{hasRevealed&&<button className="primary next-player" disabled={shown} onClick={next}>{ri<order.length-1?"Next player":"Choose first player"} <span>→</span></button>}</div>{rerollConfirm&&<div className="hint-modal-backdrop" role="presentation" onPointerDown={e=>{if(e.target===e.currentTarget)setRerollConfirm(false)}}><div className="hint-modal reroll-modal" role="dialog" aria-modal="true" aria-labelledby="reroll-title"><button className="modal-close" aria-label="Cancel reroll" onClick={()=>setRerollConfirm(false)}>×</button><RefreshCw aria-hidden="true"/><p>EMERGENCY OPTION</p><h2 id="reroll-title">Change the secret word?</h2><p className="hint-explanation">Everyone will receive new private cards. This abandoned round will not affect scores or statistics.</p><button className="primary wide red" onClick={()=>{setRerollConfirm(false);start()}}>Change word and restart</button><button className="secondary wide" onClick={()=>setRerollConfirm(false)}>Cancel</button></div></div>}</main>}
 if(screen==="firstPlayer"){const first=players.find(p=>p.id===firstPlayerId)||players[0],continueRound=()=>{if(voteMode==="off")go("imposterReveal");else{setVotes({});setVi(0);go("voting")}};return <main className="shell first-player-screen"><div className="phase"><span>FIRST PLAYER</span><span>RANDOM PICK</span></div><section><i>{first.name.slice(0,1).toUpperCase()}</i><p>FIRST TO SPEAK</p><h1>{first.name}</h1><small>{first.name} gives the first clue. Only the first player is randomized, so the group can choose who follows.</small><button className="primary wide" onClick={continueRound}>{voteMode==="off"?"Continue to reveal":"Continue to voting"} →</button></section></main>}
 if(screen==="imposterReveal")return (
  <main className={"shell public-reveal "+(publicReveal?"danger":"")}>
   <div className="phase"><span>ROUND REVEAL</span><span>EVERYONE</span></div>
   <section>
    {!publicReveal ? (
     <>
      <i className="sealed-mark">?</i>
      <p className="eyebrow-public">THE MOMENT OF TRUTH</p>
      <h1>Ready to reveal<br/>the Impostor?</h1>
      <small>Make sure everyone can see the screen.</small>
      <button className="primary wide red" onClick={revealRound}>Reveal the Impostor →</button>
     </>
    ) : (
     <>
      <div className="public-secret"><small>SECRET WORD</small><b>{word}</b></div>
      {voteMode!=="off"&&<div className="combined-votes"><p>VOTE RESULT</p><div className="voteResult">{[...order].sort((a,b)=>(counts[b.id]||0)-(counts[a.id]||0)).map(p=>{const voterNames=order.filter(v=>votes[v.id]===p.id).map(v=>v.name);return <div key={p.id}><i>{p.name[0]}</i><b>{p.name}</b><span><em style={{width:(counts[p.id]||0)/order.length*100+"%"}}/></span><strong>{counts[p.id]||0}</strong>{voteMode==="normal"&&<small className="voter-list">{voterNames.length?"Voted by: "+voterNames.join(", "):"No votes"}</small>}</div>})}</div></div>}
      {voteMode!=="off"&&<div className={"round-verdict "+(winner==="players"?"players-win":"impostor-win")}><small>{caught?"IMPOSTOR CAUGHT":"GROUP VOTED INCORRECTLY"}</small><b>{winner==="players"?"PLAYERS WIN":escapedRound?"THE IMPOSTOR ESCAPED":caught&&escape&&!roundResolved?"FINAL GUESS AVAILABLE":"IMPOSTORS WIN"}</b>{caught&&<span>{caughtImps.map(id=>players.find(p=>p.id===id)?.name).join(" & ")}{caughtImps.length>1?" were":" was"} among the highest-voted players.</span>}</div>}
      <div className="impostor-identity"><i className="unmasked">!</i><p className="eyebrow-public">THE IMPOSTOR{imps.length>1?"S ARE":" IS"}</p><h1>{imps.map(id=>players.find(p=>p.id===id)?.name).join(" & ")}</h1></div>
      <div className="revealed-hints">
       {imps.map(id=>{const player=players.find(p=>p.id===id)?.name||"Impostor",playerHint=imposterHints[id];return <div key={id}><span><small>{player}&apos;s hint</small><b>{playerHint}</b></span><button aria-label={`Explain the connection between ${playerHint} and ${word}`} onClick={()=>setSelectedHint({player,hint:playerHint})}>?</button></div>})}
      </div>
      {(voteMode==="off"||roundResolved)&&<div className="reveal-actions"><button className="primary wide" onClick={start}>Play again →</button><button className="secondary wide" onClick={()=>go("home")}>Return home</button></div>}
      {selectedHint&&<div className="hint-modal-backdrop" role="presentation" onPointerDown={e=>{if(e.target===e.currentTarget)setSelectedHint(null)}}><div className="hint-modal" role="dialog" aria-modal="true" aria-labelledby="hint-title"><button className="modal-close" aria-label="Close explanation" onClick={()=>setSelectedHint(null)}>×</button><i>?</i><p>{selectedHint.player}&apos;s hint</p><h2 id="hint-title">{selectedHint.hint}</h2><div className="hint-equation"><b>{word}</b><span>→</span><b>{selectedHint.hint}</b></div><p className="hint-explanation">{explainHint(word,selectedHint.hint,wordLanguage,topic)}</p><button className="primary wide" onClick={()=>setSelectedHint(null)}>Got it</button></div></div>}
     </>
    )}
   </section>
  </main>
 );
 if(screen==="clue"){let p=order[ci];return <main className="shell"><div className="phase"><span>CLUE PHASE</span><span>{ci+1} OF {order.length}</span></div><div className="bar"><i style={{width:(ci+1)/order.length*100+"%"}}/></div><section className={"turn "+(timerSetting===null?"untimed":"")}><small>IT'S YOUR TURN</small><h2>{p.name}</h2>{mode!=="Hidden Topic"&&<em>Topic: {topic}</em>}{timerSetting!==null&&<Timer time={time}/>}<aside><b>Give one clue out loud</b><p>Say something connected to the word. Be useful, but stay subtle.</p></aside><button className="primary" onClick={()=>{if(ci<order.length-1){setCi(ci+1);setTime(mode==="Quick Round"?15:(timerSetting||0))}else{setTime(timerSetting===null?0:(mode==="Quick Round"?60:Math.min(300,timerSetting*4)));go("discussion")}}}>{ci<order.length-1?"Clue given · Next player":"All clues given · Discuss"} →</button><p>Up next: {order[ci+1]?.name||"Group discussion"}</p></section></main>}
 if(screen==="discussion")return <main className="shell"><div className="phase"><span>OPEN DISCUSSION</span><span>EVERYONE</span></div><section className={"discuss "+(timerSetting===null?"untimed":"")}><i>?</i><h2>Who doesn't belong?</h2><p>Compare clues. Defend your answer. Watch for hesitation.</p>{timerSetting!==null&&<Timer time={time}/>}<div>{order.map((p,i)=><span key={p.id}><b>{i+1}</b>{p.name}</span>)}</div><button className="primary red" onClick={()=>go("voting")}>Start secret voting →</button></section></main>;
 if(screen==="voting"){let voter=order[vi],choice=votes[voter.id];const lockVote=()=>{if(vi<order.length-1){setVi(vi+1);return}if(caught&&escape){go("guess");return}resolveRound(caught?"players":"imposters");setPublicReveal(true);go("imposterReveal")};return <main className="shell"><div className="phase"><span>{voteMode==="normal"?"NORMAL VOTING":"ANONYMOUS VOTING"}</span><span>{vi+1} / {order.length}</span></div><aside className="handoff">Pass to <b>{voter.name}</b>. Voting follows the player list order.</aside><Head over="" title="Who is the Impostor?" sub="Choose one player. You cannot vote for yourself."/><div className="ballot">{order.filter(p=>p.id!==voter.id).map(p=><button key={p.id} className={choice===p.id?"on":""} onClick={()=>setVotes(v=>({...v,[voter.id]:p.id}))}><i>{p.name[0]}</i><b>{p.name}</b><small>{choice===p.id?"Selected":"Tap to vote"}</small></button>)}</div><Sticky disabled={!choice} onClick={lockVote}>{vi===order.length-1?"Lock final vote":"Lock vote & pass"}</Sticky></main>}
 if(screen==="guess"){const caughtNames=caughtImps.map(id=>players.find(p=>p.id===id)?.name).filter(Boolean).join(" & ");const showResult=(win:string,escaped=false)=>{resolveRound(win,escaped);setPublicReveal(true);go("imposterReveal")};const submitGuess=()=>{const correct=guess.trim().toLocaleLowerCase()===word.trim().toLocaleLowerCase();showResult(correct?"imposters":"players",correct)};return <main className="shell reveal danger"><section className="role"><p>IMPOSTOR ESCAPE</p><i className="mark">?</i><h2>THE IMPOSTOR<br/><b>WAS CAUGHT</b></h2><small>Pass the phone to {caughtNames}. {caughtImps.length>1?"They have one shared chance":"They have one chance"} to enter the secret word before it is revealed.</small><label className="guess">SECRET WORD GUESS<input value={guess} onChange={e=>setGuess(e.target.value)} placeholder="Enter your guess" autoComplete="off" autoFocus/></label><button className="primary wide" disabled={!guess.trim()} onClick={submitGuess}>Submit guess →</button><button className="text" onClick={()=>showResult("players")}>Skip and lose</button></section></main>}
 if(screen==="result")return <main className={"shell reveal "+(winner==="players"?"safe":"danger")}><section className="final"><i>{winner==="players"?"V":"X"}</i><p>ROUND COMPLETE</p><h2>{winner==="players"?"PLAYERS WIN":"IMPOSTOR REVEALED"}</h2><small>{winner==="players"?"The crew uncovered the deception.":"The hidden player has been unmasked."}</small><div><span>SECRET WORD<b>{word}</b></span><span>IMPOSTOR{imps.length>1?"S":""}<b>{imps.map(id=>players.find(p=>p.id===id)?.name).join(", ")}</b></span></div>{scoring&&<button className="secondary wide" onClick={()=>go("scores")}>View scoreboard</button>}<button className="primary wide" onClick={start}>Play another round →</button><button className="text" onClick={()=>go("home")}>Return home</button></section></main>;
 if(screen==="scores")return <main className="shell">{top}<Head over="League table" title="Scoreboard" sub="Every bluff and correct read counts."/><div className="score"><header><span>Player</span><span>Pts</span><span>Wins</span><span>Votes</span></header>{[...players].sort((a,b)=>b.points-a.points).map((p,i)=><div><span><i>{i+1}</i><b>{p.name}</b></span><strong>{p.points}</strong><span>{p.wins}</span><span>{p.correct}</span></div>)}</div><button className="primary wide" onClick={start}>Next round →</button></main>;
 if(screen==="settings")return <main className="shell">{top}<Head over="Preferences" title="Game settings" sub="Make every round work for your group."/><Card><Toggle label="Imposter escape" note={voteMode==="off"?"Turn on voting to use the final word guess":"Final word guess after an Impostor is caught"} v={escape} set={setEscape} disabled={voteMode==="off"}/><Toggle label="Imposter hint" note="Show a subtle word-specific association" v={imposterHint} set={setImposterHint}/><Toggle label="Scoring" note="Track wins, votes and points" v={scoring} set={setScoring}/><div className="setting-block"><span><b>Voting system</b><small>Choose whether votes reveal voter names</small></span><div className="segments three setting-segments">{(["off","normal","anonymous"] as const).map(x=><button key={x} className={voteMode===x?"on":""} onClick={()=>{setVoteMode(x);if(x==="off")setEscape(false)}}>{x==="off"?"OFF":x==="normal"?"Normal":"Anonymous"}</button>)}</div></div><div className="setting-block"><span><b>Round timer</b><small>OFF creates a completely untimed game</small></span><div className="timer-options">{([null,15,30,45,60,90] as (number|null)[]).map(x=><button key={x??"off"} className={timerSetting===x?"on":""} onClick={()=>setTimerSetting(x)}>{x===null?"OFF":x+"s"}</button>)}</div></div><Toggle label="Reduced motion" note="Limit interface animations" v={!motion} set={v=>setMotion(!v)}/><div className="row setting"><span><b>Theme</b><small>Choose display style</small></span><div className="segments mini theme-toggle">{[{id:"dark",label:"Dark mode",icon:"moon"},{id:"light",label:"Light mode",icon:"sun"}].map(x=><button key={x.id} aria-label={x.label} title={x.label} className={theme===x.id?"on":""} onClick={()=>setTheme(x.id)}>{ico(x.icon)}</button>)}</div></div></Card></main>;
 if(screen==="stats")return <main className="shell">{top}<Head over="Your group" title="Game statistics" sub="Stored privately on this device."/><div className="stats">{[["Total rounds",rounds],["Players",players.length],["Words seen",used.length],["Favorites",favorites.length]].map(x=><div><small>{x[0]}</small><b>{x[1]}</b></div>)}</div><Card><b>Top detectives</b>{[...players].sort((a,b)=>b.correct-a.correct).map((p,i)=><div className="rank"><i>{i+1}</i><b>{p.name}</b><small>{p.correct} correct votes</small></div>)}</Card></main>;
 return <main className="shell">{top}<Head over="Quick guide" title="How to play" sub="Learn the whole game in one minute."/><div className="steps">{[["01","Set the crew","Add 3–15 players, topics and a mode."],["02","Reveal privately","Citizens see the word. Imposters do not."],["03","Give clues","Say one related clue without exposing the answer."],["04","Discuss & vote","Compare stories and cast private ballots."],["05","Reveal the truth","Catch the Imposter before they escape."]].map(x=><div><i>{x[0]}</i><span><b>{x[1]}</b><p>{x[2]}</p></span></div>)}</div><button className="primary wide" onClick={()=>go("setup")}>Set up a game →</button></main>
}
function Head({over,title,sub}:{over:string,title:string,sub:string}){return <header className="head"><p>{over}</p><h1>{title}</h1><small>{sub}</small></header>}
function Card({children}:{children:React.ReactNode}){return <section className="card">{children}</section>}
function Label({children}:{children:React.ReactNode}){return <p className="label">{children}</p>}
function Sticky({children,onClick,disabled=false}:{children:React.ReactNode,onClick:()=>void,disabled?:boolean}){return <div className="sticky"><button className="primary" disabled={disabled} onClick={onClick}>{children}<span>→</span></button></div>}
function Timer({time}:{time:number}){return <div className={"timer "+(!time?"ended":"")}><b>{String(Math.floor(time/60)).padStart(2,"0")}:{String(time%60).padStart(2,"0")}</b><small>{time?"Time remaining":"Time is up"}</small></div>}
function Toggle({label,note,v,set,disabled=false}:{label:string,note:string,v:boolean,set:(x:boolean)=>void,disabled?:boolean}){return <div className={"row setting "+(disabled?"disabled-setting":"")}><span><b>{label}</b><small>{note}</small></span><button role="switch" aria-checked={v} disabled={disabled} className={"toggle "+(v?"on":"")} onClick={()=>set(!v)}><i/></button></div>}
