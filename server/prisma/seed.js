'use strict';
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

const cities = [
  { name:'Paris',country:'France',region:'Île-de-France',latitude:48.8566,longitude:2.3522,costIndex:3,popularityScore:98,description:'The City of Light, famous for art, fashion, and cuisine.',imageUrl:'https://picsum.photos/seed/paris/800/600',timezone:'Europe/Paris' },
  { name:'Rome',country:'Italy',region:'Lazio',latitude:41.9028,longitude:12.4964,costIndex:2,popularityScore:95,description:'Eternal city packed with ancient history and world-class food.',imageUrl:'https://picsum.photos/seed/rome/800/600',timezone:'Europe/Rome' },
  { name:'Barcelona',country:'Spain',region:'Catalonia',latitude:41.3851,longitude:2.1734,costIndex:2,popularityScore:93,description:'Vibrant coastal city famed for Gaudí and its nightlife.',imageUrl:'https://picsum.photos/seed/barcelona/800/600',timezone:'Europe/Madrid' },
  { name:'Tokyo',country:'Japan',region:'Kanto',latitude:35.6762,longitude:139.6503,costIndex:3,popularityScore:99,description:'Ultra-modern metropolis blending tradition with cutting-edge innovation.',imageUrl:'https://picsum.photos/seed/tokyo/800/600',timezone:'Asia/Tokyo' },
  { name:'Bangkok',country:'Thailand',region:'Central',latitude:13.7563,longitude:100.5018,costIndex:1,popularityScore:94,description:'Bustling street food capital with ornate temples and wild nightlife.',imageUrl:'https://picsum.photos/seed/bangkok/800/600',timezone:'Asia/Bangkok' },
  { name:'Bali',country:'Indonesia',region:'Lesser Sunda Islands',latitude:-8.3405,longitude:115.0920,costIndex:1,popularityScore:91,description:'Tropical paradise with rice terraces, surf, and Hindu temples.',imageUrl:'https://picsum.photos/seed/bali/800/600',timezone:'Asia/Makassar' },
  { name:'New York',country:'USA',region:'New York',latitude:40.7128,longitude:-74.0060,costIndex:3,popularityScore:97,description:'The city that never sleeps — iconic skyline, culture, and energy.',imageUrl:'https://picsum.photos/seed/newyork/800/600',timezone:'America/New_York' },
  { name:'London',country:'UK',region:'England',latitude:51.5074,longitude:-0.1278,costIndex:3,popularityScore:96,description:'Historic capital with world-class museums and diverse food scenes.',imageUrl:'https://picsum.photos/seed/london/800/600',timezone:'Europe/London' },
  { name:'Amsterdam',country:'Netherlands',region:'North Holland',latitude:52.3676,longitude:4.9041,costIndex:2,popularityScore:89,description:'Charming canal city known for cycling, art, and open culture.',imageUrl:'https://picsum.photos/seed/amsterdam/800/600',timezone:'Europe/Amsterdam' },
  { name:'Prague',country:'Czech Republic',region:'Bohemia',latitude:50.0755,longitude:14.4378,costIndex:1,popularityScore:88,description:'Fairy-tale architecture and a thriving craft beer scene.',imageUrl:'https://picsum.photos/seed/prague/800/600',timezone:'Europe/Prague' },
  { name:'Dubai',country:'UAE',region:'Dubai',latitude:25.2048,longitude:55.2708,costIndex:3,popularityScore:92,description:'Desert megacity of record-breaking skyscrapers and luxury shopping.',imageUrl:'https://picsum.photos/seed/dubai/800/600',timezone:'Asia/Dubai' },
  { name:'Istanbul',country:'Turkey',region:'Marmara',latitude:41.0082,longitude:28.9784,costIndex:1,popularityScore:90,description:'Where East meets West — mosques, bazaars, and Bosphorus views.',imageUrl:'https://picsum.photos/seed/istanbul/800/600',timezone:'Europe/Istanbul' },
  { name:'Lisbon',country:'Portugal',region:'Lisbon',latitude:38.7223,longitude:-9.1393,costIndex:2,popularityScore:87,description:'Hilly city of fado music, trams, and pastel de nata.',imageUrl:'https://picsum.photos/seed/lisbon/800/600',timezone:'Europe/Lisbon' },
  { name:'Vienna',country:'Austria',region:'Vienna',latitude:48.2082,longitude:16.3738,costIndex:2,popularityScore:86,description:'Imperial grandeur, classical music, and world-renowned coffee houses.',imageUrl:'https://picsum.photos/seed/vienna/800/600',timezone:'Europe/Vienna' },
  { name:'Singapore',country:'Singapore',region:'Central',latitude:1.3521,longitude:103.8198,costIndex:3,popularityScore:91,description:'Garden city famed for food, cleanliness, and futuristic architecture.',imageUrl:'https://picsum.photos/seed/singapore/800/600',timezone:'Asia/Singapore' },
  { name:'Sydney',country:'Australia',region:'New South Wales',latitude:-33.8688,longitude:151.2093,costIndex:3,popularityScore:90,description:'Iconic harbour city with golden beaches and a laid-back lifestyle.',imageUrl:'https://picsum.photos/seed/sydney/800/600',timezone:'Australia/Sydney' },
  { name:'Cape Town',country:'South Africa',region:'Western Cape',latitude:-33.9249,longitude:18.4241,costIndex:1,popularityScore:85,description:'Stunning coastal city at the foot of Table Mountain.',imageUrl:'https://picsum.photos/seed/capetown/800/600',timezone:'Africa/Johannesburg' },
  { name:'Marrakech',country:'Morocco',region:'Marrakech-Safi',latitude:31.6295,longitude:-7.9811,costIndex:1,popularityScore:84,description:'Medieval medina city with souks, riads, and exotic spices.',imageUrl:'https://picsum.photos/seed/marrakech/800/600',timezone:'Africa/Casablanca' },
  { name:'Buenos Aires',country:'Argentina',region:'Buenos Aires',latitude:-34.6037,longitude:-58.3816,costIndex:1,popularityScore:83,description:'The Paris of South America — tango, steak, and European flair.',imageUrl:'https://picsum.photos/seed/buenosaires/800/600',timezone:'America/Argentina/Buenos_Aires' },
  { name:'Mexico City',country:'Mexico',region:'Valley of Mexico',latitude:19.4326,longitude:-99.1332,costIndex:1,popularityScore:82,description:'Massive megalopolis with world-class museums and incredible tacos.',imageUrl:'https://picsum.photos/seed/mexicocity/800/600',timezone:'America/Mexico_City' },
  { name:'Kyoto',country:'Japan',region:'Kansai',latitude:35.0116,longitude:135.7681,costIndex:2,popularityScore:94,description:'Ancient capital with thousands of temples, shrines, and bamboo groves.',imageUrl:'https://picsum.photos/seed/kyoto/800/600',timezone:'Asia/Tokyo' },
  { name:'Berlin',country:'Germany',region:'Berlin',latitude:52.5200,longitude:13.4050,costIndex:2,popularityScore:88,description:'Edgy creative capital with a turbulent history and thriving arts scene.',imageUrl:'https://picsum.photos/seed/berlin/800/600',timezone:'Europe/Berlin' },
  { name:'Budapest',country:'Hungary',region:'Central Hungary',latitude:47.4979,longitude:19.0402,costIndex:1,popularityScore:87,description:'Two cities united by the Danube — thermal baths and ruin bars.',imageUrl:'https://picsum.photos/seed/budapest/800/600',timezone:'Europe/Budapest' },
  { name:'Reykjavik',country:'Iceland',region:'Capital Region',latitude:64.1355,longitude:-21.8954,costIndex:3,popularityScore:80,description:'Gateway to the Northern Lights, geysers, and midnight sun.',imageUrl:'https://picsum.photos/seed/reykjavik/800/600',timezone:'Atlantic/Reykjavik' },
  { name:'Havana',country:'Cuba',region:'La Habana',latitude:23.1136,longitude:-82.3666,costIndex:1,popularityScore:78,description:'Colourful vintage cars, salsa rhythms, and crumbling Baroque grandeur.',imageUrl:'https://picsum.photos/seed/havana/800/600',timezone:'America/Havana' },
  { name:'Kathmandu',country:'Nepal',region:'Bagmati',latitude:27.7172,longitude:85.3240,costIndex:1,popularityScore:76,description:'Himalayan gateway city with ancient durbar squares and trekking culture.',imageUrl:'https://picsum.photos/seed/kathmandu/800/600',timezone:'Asia/Kathmandu' },
  { name:'Cairo',country:'Egypt',region:'Cairo',latitude:30.0444,longitude:31.2357,costIndex:1,popularityScore:85,description:'Millennial city beside the Nile, home to the Great Pyramids.',imageUrl:'https://picsum.photos/seed/cairo/800/600',timezone:'Africa/Cairo' },
  { name:'Petra',country:'Jordan',region:'Aqaba',latitude:30.3285,longitude:35.4444,costIndex:2,popularityScore:79,description:'Rose-red city half as old as time carved into desert cliffs.',imageUrl:'https://picsum.photos/seed/petra/800/600',timezone:'Asia/Amman' },
  { name:'Vancouver',country:'Canada',region:'British Columbia',latitude:49.2827,longitude:-123.1207,costIndex:3,popularityScore:86,description:'Mountain-meets-ocean city with world-class ski and surf.',imageUrl:'https://picsum.photos/seed/vancouver/800/600',timezone:'America/Vancouver' },
  { name:'Santorini',country:'Greece',region:'South Aegean',latitude:36.3932,longitude:25.4615,costIndex:3,popularityScore:92,description:'Iconic caldera island with white-domed churches and volcanic beaches.',imageUrl:'https://picsum.photos/seed/santorini/800/600',timezone:'Europe/Athens' },
];

// Activities keyed by city name. Each entry: [name, category, cost, isFree, duration, rating]
const activitiesByCityName = {
  Paris: [
    ['Eiffel Tower Visit','SIGHTSEEING',26,false,120,4.8],
    ['Louvre Museum','CULTURAL',17,false,180,4.9],
    ['Seine River Cruise','RELAXATION',15,false,60,4.6],
    ['Montmartre Walking Tour','SIGHTSEEING',0,true,90,4.5],
    ['French Cooking Class','FOOD',85,false,180,4.7],
    ['Palais Royal Gardens','RELAXATION',0,true,45,4.4],
    ['Champs-Élysées Shopping','SHOPPING',0,false,120,4.2],
  ],
  Rome: [
    ['Colosseum Tour','SIGHTSEEING',16,false,120,4.9],
    ['Vatican Museums','CULTURAL',20,false,180,4.8],
    ['Trevi Fountain','SIGHTSEEING',0,true,30,4.7],
    ['Pasta-Making Class','FOOD',65,false,150,4.8],
    ['Roman Forum Walk','CULTURAL',12,false,90,4.6],
    ['Gelato Tasting Tour','FOOD',30,false,90,4.7],
  ],
  Barcelona: [
    ['Sagrada Família','SIGHTSEEING',26,false,90,4.9],
    ['Park Güell','SIGHTSEEING',10,false,60,4.7],
    ['La Boqueria Market','FOOD',0,true,60,4.5],
    ['Barceloneta Beach','RELAXATION',0,true,180,4.4],
    ['Flamenco Show','CULTURAL',45,false,90,4.6],
    ['Tapas Bar Crawl','FOOD',40,false,120,4.7],
    ['Gothic Quarter Walk','SIGHTSEEING',0,true,75,4.5],
  ],
  Tokyo: [
    ['Shibuya Crossing','SIGHTSEEING',0,true,30,4.6],
    ['teamLab Borderless','CULTURAL',32,false,180,4.8],
    ['Tsukiji Outer Market','FOOD',0,true,90,4.7],
    ['Senso-ji Temple','CULTURAL',0,true,60,4.8],
    ['Akihabara Electronics District','SHOPPING',0,false,120,4.4],
    ['Sumo Morning Practice','CULTURAL',0,true,90,4.5],
    ['Shinjuku Izakaya Hopping','FOOD',50,false,180,4.6],
    ['Mount Fuji Day Trip','ADVENTURE',80,false,480,4.9],
  ],
  Bangkok: [
    ['Wat Pho Temple','CULTURAL',3,false,60,4.8],
    ['Grand Palace','SIGHTSEEING',15,false,120,4.7],
    ['Floating Market Tour','FOOD',25,false,180,4.6],
    ['Street Food Night Walk','FOOD',20,false,120,4.8],
    ['Chao Phraya Boat Ride','TRANSPORT',1,false,60,4.4],
    ['Thai Cooking Class','FOOD',35,false,150,4.7],
  ],
  Bali: [
    ['Ubud Monkey Forest','SIGHTSEEING',3,false,60,4.5],
    ['Tegallalang Rice Terraces','SIGHTSEEING',2,false,90,4.7],
    ['Surf Lesson Kuta','ADVENTURE',25,false,120,4.5],
    ['Balinese Cooking Class','FOOD',40,false,150,4.7],
    ['Tanah Lot Temple Sunset','SIGHTSEEING',3,false,60,4.8],
    ['Yoga Retreat Morning','RELAXATION',15,false,90,4.6],
  ],
  'New York': [
    ['Central Park Stroll','RELAXATION',0,true,120,4.7],
    ['Metropolitan Museum of Art','CULTURAL',25,false,180,4.9],
    ['Brooklyn Bridge Walk','SIGHTSEEING',0,true,60,4.7],
    ['Broadway Show','CULTURAL',120,false,180,4.9],
    ['Staten Island Ferry','SIGHTSEEING',0,true,50,4.5],
    ['Times Square & 5th Ave','SHOPPING',0,false,90,4.2],
    ['Chelsea Market Food Tour','FOOD',30,false,90,4.6],
  ],
  London: [
    ['British Museum','CULTURAL',0,true,180,4.9],
    ['Tower of London','SIGHTSEEING',30,false,120,4.7],
    ['Thames Evening Cruise','RELAXATION',20,false,90,4.5],
    ['Borough Market','FOOD',0,true,60,4.7],
    ['Hyde Park','RELAXATION',0,true,90,4.5],
    ['West End Show','CULTURAL',85,false,150,4.8],
    ['Notting Hill Walk','SIGHTSEEING',0,true,60,4.4],
  ],
  Amsterdam: [
    ['Rijksmuseum','CULTURAL',22,false,180,4.9],
    ['Anne Frank House','CULTURAL',14,false,90,4.8],
    ['Canal Boat Tour','SIGHTSEEING',16,false,75,4.6],
    ['Cycling Tour','ADVENTURE',22,false,180,4.7],
    ['Heineken Experience','FOOD',21,false,90,4.4],
    ['Vondelpark Picnic','RELAXATION',0,true,90,4.5],
  ],
  Prague: [
    ['Prague Castle','SIGHTSEEING',12,false,120,4.8],
    ['Charles Bridge at Dawn','SIGHTSEEING',0,true,30,4.9],
    ['Old Town Square','SIGHTSEEING',0,true,60,4.7],
    ['Czech Beer Tasting','FOOD',15,false,90,4.7],
    ['Underground Torture Museum','CULTURAL',10,false,60,4.3],
    ['Vltava River Cruise','RELAXATION',12,false,60,4.5],
  ],
  Dubai: [
    ['Burj Khalifa Observation Deck','SIGHTSEEING',35,false,90,4.7],
    ['Dubai Mall','SHOPPING',0,false,180,4.5],
    ['Desert Safari','ADVENTURE',60,false,360,4.8],
    ['Dubai Creek Abra Ride','TRANSPORT',1,false,15,4.6],
    ['Palm Jumeirah Tour','SIGHTSEEING',0,true,90,4.4],
    ['Gold & Spice Souk','SHOPPING',0,true,60,4.6],
  ],
  Istanbul: [
    ['Hagia Sophia','CULTURAL',0,true,90,4.9],
    ['Grand Bazaar','SHOPPING',0,true,120,4.7],
    ['Bosphorus Cruise','SIGHTSEEING',15,false,90,4.7],
    ['Topkapi Palace','CULTURAL',15,false,120,4.7],
    ['Turkish Hammam','RELAXATION',35,false,90,4.6],
    ['Turkish Cooking Class','FOOD',50,false,180,4.7],
  ],
  Lisbon: [
    ['Tram 28 Ride','TRANSPORT',3,false,45,4.5],
    ['Belém Tower','SIGHTSEEING',6,false,60,4.6],
    ['Fado Night Show','CULTURAL',20,false,120,4.8],
    ['Pastéis de Belém Bakery','FOOD',5,false,30,4.9],
    ['Alfama Neighbourhood Walk','SIGHTSEEING',0,true,90,4.7],
    ['Sintra Day Trip','ADVENTURE',25,false,360,4.8],
  ],
  Vienna: [
    ['Schönbrunn Palace','CULTURAL',18,false,120,4.8],
    ['Vienna Opera House Tour','CULTURAL',13,false,60,4.7],
    ['Kunsthistorisches Museum','CULTURAL',18,false,180,4.7],
    ['Vienna Coffee House Visit','FOOD',8,false,60,4.8],
    ['St. Stephen\'s Cathedral','SIGHTSEEING',0,true,45,4.8],
    ['Naschmarkt Food Market','FOOD',0,true,60,4.6],
  ],
  Singapore: [
    ['Gardens by the Bay','SIGHTSEEING',14,false,120,4.8],
    ['Marina Bay Sands Skypark','SIGHTSEEING',23,false,60,4.6],
    ['Hawker Centre Food Tour','FOOD',15,false,90,4.9],
    ['Sentosa Island','RELAXATION',0,false,240,4.5],
    ['Universal Studios Singapore','ADVENTURE',79,false,480,4.5],
    ['Night Safari','ADVENTURE',47,false,180,4.6],
  ],
  Sydney: [
    ['Sydney Opera House Tour','CULTURAL',40,false,60,4.8],
    ['Bondi to Coogee Coastal Walk','ADVENTURE',0,true,180,4.8],
    ['Harbour Bridge Climb','ADVENTURE',174,false,180,4.9],
    ['Taronga Zoo','RELAXATION',45,false,240,4.6],
    ['Blue Mountains Day Trip','ADVENTURE',50,false,480,4.8],
    ['Manly Ferry & Beach','RELAXATION',8,false,120,4.7],
  ],
  'Cape Town': [
    ['Table Mountain Cable Car','ADVENTURE',28,false,120,4.9],
    ['Boulders Penguin Colony','SIGHTSEEING',14,false,90,4.7],
    ['Robben Island Tour','CULTURAL',25,false,180,4.8],
    ['Cape Point National Park','ADVENTURE',22,false,240,4.7],
    ['V&A Waterfront','SHOPPING',0,true,120,4.5],
    ['Cape Winelands Tour','FOOD',80,false,360,4.8],
  ],
  Marrakech: [
    ['Jemaa el-Fna Square','SIGHTSEEING',0,true,120,4.7],
    ['Majorelle Garden','SIGHTSEEING',8,false,60,4.7],
    ['Medina Souk Walk','SHOPPING',0,true,90,4.6],
    ['Moroccan Cooking Class','FOOD',45,false,180,4.8],
    ['Hammam Experience','RELAXATION',20,false,90,4.5],
    ['Sahara Desert Day Trip','ADVENTURE',70,false,480,4.9],
  ],
  'Buenos Aires': [
    ['La Boca Caminito','SIGHTSEEING',0,true,60,4.6],
    ['Tango Show & Dinner','CULTURAL',90,false,180,4.8],
    ['Recoleta Cemetery','CULTURAL',0,true,60,4.7],
    ['Steakhouse Asado Night','FOOD',40,false,120,4.9],
    ['MALBA Art Museum','CULTURAL',10,false,120,4.6],
    ['Palermo Parks Walk','RELAXATION',0,true,90,4.4],
  ],
  'Mexico City': [
    ['Teotihuacan Pyramids','SIGHTSEEING',4,false,300,4.9],
    ['Frida Kahlo Museum','CULTURAL',11,false,90,4.8],
    ['Lucha Libre Wrestling','CULTURAL',10,false,120,4.7],
    ['Xochimilco Gondola Ride','ADVENTURE',25,false,180,4.6],
    ['Tacos al Pastor Street Food','FOOD',5,false,60,4.9],
    ['National Palace Murals','CULTURAL',0,true,60,4.7],
  ],
  Kyoto: [
    ['Fushimi Inari Shrine','SIGHTSEEING',0,true,120,4.9],
    ['Arashiyama Bamboo Grove','SIGHTSEEING',0,true,60,4.8],
    ['Nijo Castle','CULTURAL',6,false,90,4.7],
    ['Tea Ceremony Experience','CULTURAL',30,false,60,4.8],
    ['Gion District Walk at Dusk','SIGHTSEEING',0,true,90,4.7],
    ['Kyoto Ramen Alley','FOOD',12,false,60,4.7],
  ],
  Berlin: [
    ['Brandenburg Gate','SIGHTSEEING',0,true,30,4.7],
    ['East Side Gallery','CULTURAL',0,true,60,4.8],
    ['Berlin Wall Memorial','CULTURAL',0,true,90,4.8],
    ['Pergamon Museum','CULTURAL',12,false,180,4.7],
    ['Currywurst Street Food','FOOD',5,false,20,4.6],
    ['Kreuzberg Street Art Walk','SIGHTSEEING',0,true,90,4.5],
    ['Berghain Club (Weekend)','ADVENTURE',15,false,300,4.2],
  ],
  Budapest: [
    ['Széchenyi Thermal Baths','RELAXATION',22,false,180,4.8],
    ['Parliament Building Tour','CULTURAL',15,false,60,4.8],
    ['Ruin Bar Crawl','FOOD',20,false,180,4.7],
    ['Buda Castle Hill','SIGHTSEEING',0,true,120,4.7],
    ['Danube Evening Cruise','RELAXATION',25,false,90,4.7],
    ['Hungarian Cooking Class','FOOD',55,false,180,4.6],
  ],
  Reykjavik: [
    ['Northern Lights Tour','ADVENTURE',80,false,240,4.9],
    ['Blue Lagoon Geothermal Spa','RELAXATION',60,false,180,4.8],
    ['Golden Circle Day Tour','ADVENTURE',75,false,480,4.9],
    ['Whale Watching','ADVENTURE',90,false,240,4.7],
    ['Hallgrímskirkja Church','SIGHTSEEING',0,true,30,4.6],
    ['Local Lamb Soup Dinner','FOOD',18,false,60,4.6],
  ],
  Havana: [
    ['Old Havana Walking Tour','SIGHTSEEING',0,true,120,4.7],
    ['Classic Car Convertible Ride','ADVENTURE',30,false,60,4.8],
    ['Salsa Dance Class','CULTURAL',15,false,90,4.7],
    ['Tropicana Cabaret Show','CULTURAL',75,false,150,4.7],
    ['Havana Cigar Factory Tour','CULTURAL',10,false,60,4.5],
    ['Malecón Sunset Walk','RELAXATION',0,true,60,4.6],
  ],
  Kathmandu: [
    ['Swayambhunath Monkey Temple','CULTURAL',2,false,90,4.7],
    ['Boudhanath Stupa','CULTURAL',3,false,60,4.8],
    ['Pashupatinath Temple','CULTURAL',0,false,60,4.6],
    ['Thamel Market Shopping','SHOPPING',0,true,120,4.4],
    ['Himalayan Cooking Class','FOOD',25,false,150,4.6],
    ['Nagarkot Sunrise Trek','ADVENTURE',20,false,300,4.8],
  ],
  Cairo: [
    ['Pyramids of Giza','SIGHTSEEING',15,false,240,5.0],
    ['Egyptian Museum','CULTURAL',10,false,180,4.8],
    ['Khan el-Khalili Bazaar','SHOPPING',0,true,120,4.6],
    ['Nile Felucca Sail','RELAXATION',10,false,60,4.5],
    ['Coptic Cairo Walk','CULTURAL',0,true,90,4.5],
    ['Cairo Cuisine Food Tour','FOOD',35,false,150,4.7],
  ],
  Petra: [
    ['The Treasury (Al-Khazneh)','SIGHTSEEING',70,false,240,5.0],
    ['Petra by Night','SIGHTSEEING',17,false,120,4.8],
    ['Monastery (Ad-Deir) Hike','ADVENTURE',0,false,180,4.8],
    ['Wadi Rum Jeep Tour','ADVENTURE',55,false,300,4.9],
    ['Jordanian Mansaf Dinner','FOOD',20,false,90,4.7],
    ['Siq Canyon Walk','ADVENTURE',0,false,60,4.9],
  ],
  Vancouver: [
    ['Stanley Park Seawall Cycle','ADVENTURE',10,false,180,4.8],
    ['Capilano Suspension Bridge','ADVENTURE',55,false,120,4.7],
    ['Granville Island Market','FOOD',0,true,90,4.7],
    ['Whistler Ski Day Trip','ADVENTURE',120,false,480,4.9],
    ['Grouse Mountain Gondola','ADVENTURE',65,false,240,4.6],
    ['Gastown Walk & Craft Beer','FOOD',20,false,90,4.5],
  ],
  Santorini: [
    ['Oia Sunset Walk','SIGHTSEEING',0,true,90,5.0],
    ['Caldera Sailing Tour','ADVENTURE',110,false,360,4.9],
    ['Wine Tasting at Vineyard','FOOD',40,false,120,4.7],
    ['Red Beach Swim','RELAXATION',0,true,120,4.7],
    ['Akrotiri Prehistoric Site','CULTURAL',12,false,90,4.6],
    ['Fira to Oia Hiking Trail','ADVENTURE',0,true,300,4.8],
  ],
};

async function main() {
  console.log('🌱 Starting seed...');

  // Wipe existing seed data in safe order
  await prisma.stopActivity.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.tripNote.deleteMany();
  await prisma.packingItem.deleteMany();
  await prisma.expense.deleteMany();
  await prisma.budgetAllocation.deleteMany();
  await prisma.tripMember.deleteMany();
  await prisma.tripStop.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();
  await prisma.city.deleteMany();

  // Seed cities + activities in a single transaction for atomicity
  await prisma.$transaction(async (tx) => {
    for (const cityData of cities) {
      const city = await tx.city.create({ data: cityData });

      const acts = activitiesByCityName[cityData.name] || [];
      for (const [name, category, costPerPerson, isFree, durationMinutes, rating] of acts) {
        await tx.activity.create({
          data: { name, category, costPerPerson, isFree, durationMinutes, rating, cityId: city.id },
        });
      }

      console.log(`  ✓ ${cityData.name} (${acts.length} activities)`);
    }
  });

  // Admin user
  const passwordHash = await bcrypt.hash('Admin@1234', 12);
  await prisma.user.create({
    data: {
      email: 'admin@traveloop.com',
      passwordHash,
      name: 'Admin',
      role: 'ADMIN',
    },
  });
  console.log('  ✓ Admin user created (admin@traveloop.com)');

  console.log('✅ Seed complete');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
