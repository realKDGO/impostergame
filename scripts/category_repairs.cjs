// Dedicated banks for category names that previously used modulo-indexed lists.
// Each row is word | citizen meaning | three independent Impostor hints.
const source={
'World Cities':`Tokyo|The capital city of Japan.|Japan|Shibuya|Shinjuku
Paris|The capital city of France.|France|Eiffel|Haussmann
London|The capital city of the United Kingdom.|Britain|Thames|Westminster
Rome|The capital city of Italy.|Italy|Colosseum|Forum`,
'Technology Brands':`Apple|A technology company that makes iPhones and Mac computers.|iPhone|Mac|Cupertino
Samsung|A South Korean company that makes electronics.|Galaxy|Korea|OLED
Nintendo|A Japanese company that makes video games and consoles.|Mario|Switch|Kyoto
Microsoft|The company behind Windows and Xbox.|Windows|Xbox|Redmond`,
'Social Media':`Hashtag|A word marked with a hash sign to group related posts.|Tag|Trending|Octothorpe
Livestream|Video broadcast over the internet as events happen.|Live|Audience|Latency
Algorithm|A set of steps a platform can use to choose recommended posts.|Steps|Recommendations|Ranking
Moderation|The review of posts and comments to enforce community rules.|Rules|Review|Appeals`,
'Philippine Food':`Adobo|Meat or vegetables simmered in vinegar, garlic, and often soy sauce.|Vinegar|Garlic|Braising
Sinigang|A Filipino sour soup often made with tamarind.|Sour|Tamarind|Broth
Bibingka|A Filipino rice cake traditionally cooked with heat above and below.|Rice cake|Christmas|Clay pot
Laing|Taro leaves cooked in coconut milk.|Taro|Coconut milk|Bicol`,
'Philippine Cities':`Manila|The capital city of the Philippines.|Capital|Bay|Intramuros
Baguio|A mountain city in northern Luzon known for its cool weather.|Cool|Pines|Burnham
Vigan|A city in Ilocos Sur known for its preserved historic streets.|Heritage|Calle Crisologo|Ilocos Sur
Davao City|A major city in southeastern Mindanao.|Mindanao|Durian|Kadayawan`,
'Philippine Provinces':`Rizal|A province east of Metro Manila named after Jose Rizal.|Antipolo|Luzon|Angono
Palawan|An island province in western Philippines.|Islands|El Nido|Calamian
Batanes|The northernmost province of the Philippines.|North|Ivatan|Basco
Siquijor|An island province in the central Philippines.|Island|Visayas|Fireflies`,
'Filipino Culture':`Bayanihan|Community members helping one another with a shared task.|Helping|Community|House moving
Mano|A gesture of respect that brings an elder's hand to the forehead.|Respect|Elder|Forehead
Harana|A traditional serenade sung to express romantic affection.|Serenade|Courtship|Guitar
Bayan|A Filipino term that can mean a town, people, or nation.|Town|Community|Nation`,
'Filipino Festivals':`Sinulog|A Cebu festival honoring the Santo Nino with dances and processions.|Cebu|Santo Nino|Pit Senyor
Panagbenga|Baguio's flower festival featuring floral floats.|Flowers|Baguio|Floats
Pahiyas|A Lucban harvest festival known for decorated houses.|Harvest|Lucban|Kiping
Kadayawan|A Davao festival celebrating harvests and local cultures.|Davao|Harvest|Indigenous`,
'Filipino Slang':`Lodi|A reversed form of idol used to praise someone.|Idol|Praise|Reversal
Petmalu|A reversed form of malupit used to mean impressive.|Impressive|Malupit|Reversed
Werpa|A playful reversal of power used as encouragement.|Power|Encouragement|Reversed
Charot|A word used to show that a remark is a joke.|Joking|Teasing|Retraction`,
'Block Worlds':`Block|A basic cube-shaped building unit in a voxel game.|Cube|Building|Voxel
Crafting Table|A game station used to combine materials into items.|Tools|Recipe|Grid
Redstone|A Minecraft resource used to build powered mechanisms.|Circuit|Power|Repeater
Nether|A dangerous Minecraft dimension with lava and unusual creatures.|Lava|Portal|Netherrack`,
'Roblox Worlds':`Obby|An obstacle-course game on Roblox.|Jump|Obstacles|Checkpoints
Robux|The virtual currency used on Roblox.|Currency|Avatar|Marketplace
Studio|Roblox's tool for building and scripting experiences.|Build|Editor|Luau
Tycoon|A game style where players build and grow a business or base.|Business|Income|Droppers`,
'Anime':`Anime|Animation associated with Japan.|Animation|Japan|Sakuga
Manga|Japanese comics and graphic novels.|Comics|Panels|Tankobon
Shonen|A manga or anime audience category aimed mainly at young boys.|Youth|Action|Demographic
Isekai|A story genre in which a character enters another world.|Other world|Portal|Reincarnation`,
'Space':`Moon|A natural body that orbits a planet.|Orbit|Crater|Regolith
Galaxy|A vast group of stars, gas, and dust held together by gravity.|Stars|Spiral|Dark matter
Nebula|A large cloud of gas and dust in space.|Cloud|Gas|Emission
Quasar|An extremely bright galactic center powered by matter falling toward a black hole.|Bright|Black hole|Accretion`,
'Science':`Atom|A small unit of matter made of a nucleus and electrons.|Matter|Nucleus|Orbital
Gravity|The attraction between objects that have mass.|Falling|Attraction|Curvature
Osmosis|The movement of water through a selectively permeable membrane.|Water|Membrane|Concentration
Entropy|A measure of how many microscopic arrangements a system can have.|Disorder|Energy|Microstates`,
'Health':`Exercise|Physical activity performed to improve or maintain fitness.|Movement|Fitness|Endurance
Nutrition|The process of getting and using nutrients from food.|Food|Nutrients|Metabolism
Immunity|The body's ability to defend itself against disease.|Defense|Antibodies|Lymphocytes
Homeostasis|The regulation of internal conditions to keep the body stable.|Balance|Temperature|Feedback`,
'Weather':`Rain|Water droplets falling from clouds.|Drops|Clouds|Precipitation
Fog|Tiny suspended water droplets that reduce visibility near the ground.|Mist|Visibility|Condensation
Monsoon|A seasonal wind pattern that often changes rainfall.|Season|Wind|Circulation
Virga|Rain or snow that evaporates before reaching the ground.|Rain|Evaporation|Streaks`,
'Holidays':`Christmas|A Christian holiday celebrating the birth of Jesus.|Gifts|December|Nativity
New Year|A celebration marking the beginning of a calendar year.|Midnight|Countdown|Calendar
Easter|A Christian celebration of the resurrection of Jesus.|Eggs|Spring|Resurrection
Diwali|A festival of lights celebrated by several religious communities in South Asia.|Lights|Lamps|Rangoli`,
'Ocean Life':`Coral|A marine animal whose colonies can build reefs.|Reef|Colony|Polyps
Jellyfish|A soft marine animal with a bell-shaped body and tentacles.|Tentacles|Sting|Medusa
Seahorse|A small fish with an upright body and a horse-shaped head.|Fish|Curled tail|Brood pouch
Nautilus|A marine mollusk with a coiled, chambered shell.|Shell|Chambers|Buoyancy`,
'Travel':`Passport|An official document identifying a person for international travel.|Border|Identity|Visa
Itinerary|A planned schedule of destinations and activities for a trip.|Plan|Schedule|Route
Layover|A stop between connecting parts of a journey.|Airport|Connection|Transit
Jet Lag|A temporary disruption of sleep after crossing time zones.|Sleep|Flight|Circadian`,
'Art':`Painting|Making an image by applying paint to a surface.|Brush|Canvas|Pigment
Sculpture|A three-dimensional artwork made by shaping or assembling material.|Shape|Chisel|Casting
Fresco|A painting made on fresh plaster.|Wall|Plaster|Pigment
Chiaroscuro|The use of strong light and dark contrasts in art.|Shadow|Contrast|Modeling`,
'Books':`Novel|A long fictional story written in prose.|Story|Chapters|Narrator
Biography|An account of another person's life.|Life|Person|Chronology
Anthology|A collection of selected writings published together.|Collection|Writers|Selections
Colophon|A note giving details about how a book was produced.|Printing|Book|Typesetting`,
'Superpowers':`Flight|The ability to move through the air without ordinary support.|Air|Wings|Levitation
Invisibility|The ability to remain unseen.|Hidden|Light|Cloaking
Telepathy|An imagined ability to communicate directly between minds.|Mind|Thoughts|Psychic
Telekinesis|An imagined ability to move objects using the mind.|Objects|Mind|Psychokinesis`,
'Mystery':`Clue|A piece of information that helps solve a problem or crime.|Evidence|Trace|Inference
Alibi|An account that places someone elsewhere when an event occurred.|Elsewhere|Witness|Timeline
Red Herring|A misleading detail that draws attention away from the answer.|Distraction|False lead|Misdirection
Cipher|A system for transforming a message to conceal its meaning.|Code|Secret|Substitution`,
'Camping':`Tent|A portable fabric shelter supported by poles.|Shelter|Poles|Guyline
Campfire|An outdoor fire used for warmth, light, or cooking.|Warmth|Logs|Embers
Bivouac|A temporary camp, often with little shelter.|Camp|Temporary|Open air
Kindling|Small dry material used to start a fire.|Twigs|Fire|Ignition`,
'Garden':`Seed|A plant structure that can grow into a new plant.|Plant|Growth|Germination
Compost|Decomposed organic material used to enrich soil.|Soil|Decomposition|Humus
Mulch|Material spread over soil to protect it and retain moisture.|Cover|Moisture|Bark
Grafting|Joining part of one plant to another so they grow together.|Plants|Joining|Rootstock`,
'Farm':`Tractor|A powered farm vehicle used to pull equipment.|Vehicle|Fields|Drawbar
Irrigation|Supplying water to land or crops.|Water|Crops|Canals
Silo|A tall structure for storing grain or other bulk farm material.|Storage|Grain|Cylinder
Silage|Fermented green plant material stored as animal feed.|Feed|Fermented|Fodder`,
'Office':`Desk|A table used for writing or office work.|Table|Work|Drawers
Meeting|A gathering to discuss matters or make decisions.|Discussion|Agenda|Minutes
Memo|A short written message used within an organization.|Message|Office|Internal
Quorum|The minimum number of members needed for a meeting to conduct business.|Members|Minimum|Voting`,
'Kitchen':`Pan|A shallow container used for cooking food.|Cooking|Handle|Skillet
Whisk|A tool used to beat or mix ingredients.|Mixing|Wires|Aeration
Colander|A perforated bowl used to drain liquids from food.|Drain|Holes|Pasta
Mandoline|A kitchen tool for slicing food into thin, even pieces.|Slicing|Blade|Julienne`,
'Bathroom':`Soap|A cleaning substance used with water.|Wash|Bubbles|Lather
Towel|An absorbent cloth used for drying.|Drying|Cloth|Terry
Bidet|A fixture or spray used to wash after using the toilet.|Water|Hygiene|Spray
Pumice|A porous volcanic stone used to rub away rough skin.|Stone|Rough skin|Volcanic`,
'Party':`Balloon|A flexible bag filled with gas for decoration or play.|Air|Decoration|Latex
Confetti|Small pieces of paper scattered during celebrations.|Paper|Celebration|Streamers
Karaoke|Singing along to recorded music with the lead vocals removed.|Singing|Microphone|Lyrics
Canape|A small decorative savory snack served at gatherings.|Snack|Topping|Appetizer`,
'Childhood':`Toy|An object made for play.|Play|Child|Imagination
Playground|An area with equipment for children to play on.|Slide|Swings|Climbing
Hide-and-Seek|A game where one player searches for others who hide.|Hiding|Counting|Seeker
Hopscotch|A game of hopping through numbered spaces drawn on the ground.|Hopping|Chalk|Marker`,
'Feelings':`Joy|A feeling of great happiness.|Happy|Delight|Elation
Fear|An emotional response to a perceived threat.|Afraid|Danger|Alarm
Nostalgia|A longing or affection for experiences from the past.|Memory|Past|Longing
Ambivalence|Having conflicting feelings about the same thing.|Mixed|Conflict|Uncertainty`,
'Actions':`Run|To move quickly on foot with moments when neither foot touches the ground.|Fast|Feet|Stride
Whisper|To speak very softly without normal vocal-cord vibration.|Quiet|Speech|Breath
Improvise|To act or create without preparing every detail in advance.|Spontaneous|Adapt|Unscripted
Reconcile|To restore agreement or a friendly relationship after conflict.|Agreement|Repair|Resolution`,
'Sounds':`Echo|A sound heard again after reflecting from a surface.|Repeat|Reflection|Delay
Thunder|The loud sound caused by rapidly expanding air heated by lightning.|Storm|Lightning|Expansion
Resonance|A strong vibration produced when a system is driven near its natural frequency.|Vibration|Frequency|Amplification
Timbre|The quality of a sound that distinguishes one voice or instrument from another.|Tone|Instrument|Overtones`,
'Shapes & Colors':`Circle|A round shape whose edge is equally distant from its center.|Round|Center|Radius
Triangle|A closed shape with three straight sides.|Three|Angles|Vertices
Magenta|A vivid color between red and purple.|Pink|Purple|Printing
Tesseract|A four-dimensional equivalent of a cube.|Cube|Dimensions|Hypercube`,
'Money':`Coin|A small piece of metal issued as money.|Metal|Change|Mint
Budget|A plan for income and spending.|Plan|Spending|Allocation
Inflation|A general rise in prices over time.|Prices|Purchasing power|Index
Seigniorage|The difference between money's face value and the cost of producing it.|Currency|Issuance|Minting`,
'Shopping':`Cart|A wheeled container used to carry purchases.|Wheels|Groceries|Basket
Receipt|A written record of a payment or purchase.|Proof|Payment|Transaction
Refund|Money returned after a payment or purchase.|Return|Money|Reimbursement
Consignment|An arrangement where goods are sold on behalf of their owner.|Sale|Owner|Commission`,
'Construction':`Brick|A rectangular block used to build walls.|Wall|Block|Masonry
Concrete|A building material made from cement, water, and aggregates.|Cement|Building|Aggregate
Scaffold|A temporary structure supporting workers and materials at height.|Platform|Workers|Bracing
Cantilever|A structure supported at one end and projecting outward.|Beam|Projection|Bending`,
'Crime & Law':`Witness|A person who sees an event or gives evidence about it.|Evidence|Seeing|Testimony
Jury|A group selected to decide facts in a trial.|Court|Verdict|Deliberation
Subpoena|A legal order to appear or provide evidence.|Order|Court|Testimony
Habeas Corpus|A legal procedure used to challenge the lawfulness of detention.|Detention|Court|Liberty`,
'History':`Artifact|An object made or modified by people in the past.|Object|Past|Excavation
Empire|A group of territories governed by a central ruler or state.|Territory|Ruler|Expansion
Renaissance|A period of renewed interest in classical learning and arts in Europe.|Art|Revival|Humanism
Paleography|The study of old handwriting and written documents.|Handwriting|Manuscripts|Scripts`,
'Campus Life':`Lecture|A lesson presented mainly through spoken explanation.|Lesson|Speaker|Auditorium
Dormitory|A building where students live.|Students|Rooms|Residence
Thesis|A substantial research work submitted for an academic qualification.|Research|Defense|Dissertation
Colloquium|An academic meeting where a topic is presented and discussed.|Discussion|Academic|Seminar`,
'Programming':`Variable|A named place or reference used to represent a value in a program.|Value|Name|Binding
Loop|An instruction structure that repeats a block of code.|Repeat|Iteration|Condition
Recursion|Solving a problem through a function calling itself on smaller cases.|Self-call|Base case|Stack
Closure|A function together with access to variables from its surrounding scope.|Function|Scope|Lexical`,
'Board Games':`Chess|A two-player strategy game whose goal is to checkmate the opposing king.|King|Checkmate|Castling
Monopoly|A board game about buying property and collecting rent.|Property|Rent|Banker
Scrabble|A game of forming words with letter tiles for points.|Letters|Words|Tiles
Go|A strategy game in which players place stones to surround territory.|Stones|Territory|Liberties`,
'Photography':`Camera|A device used to capture photographs or video.|Lens|Image|Sensor
Aperture|The opening in a lens that controls how much light enters.|Opening|Light|F-stop
Bokeh|The appearance of out-of-focus areas in a photograph.|Blur|Background|Defocus
Parallax|The apparent shift of an object's position when viewed from different locations.|Viewpoint|Shift|Baseline`
};
const categoryRepairs=Object.fromEntries(Object.entries(source).map(([category,text])=>[category,text.split('\n').map((line,i)=>{const [word,meaning,...hints]=line.split('|');return [word,...hints,meaning,['Easy','Normal','Hard','Extreme'][i]]})]));
module.exports={categoryRepairs};
