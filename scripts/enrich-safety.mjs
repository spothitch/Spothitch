/**
 * Enrich safety sections for all 96 countries in guideSections-fr.js
 * Adds: SpotHitch tips (common) + country-specific safety advice + emergency numbers
 *
 * Run: node scripts/enrich-safety.mjs
 */

import fs from 'fs'

// Common SpotHitch safety tips (added to ALL countries)
const SPOTHITCH_TIPS_FR = [
  { type: 'sub', title: 'Utilise SpotHitch pour ta sécurité' },
  { type: 'rule', icon: '🛡️', text: 'Active le Mode Gardien avant chaque trajet. Un proche suit ta position en temps réel.' },
  { type: 'rule', icon: '🆘', text: 'Configure le mode SOS avec tes contacts. Un seul geste déclenche une triple alerte (push, SMS, appel).' },
  { type: 'rule', icon: '📱', text: 'Photographie la plaque du véhicule et envoie-la à un proche avant de monter.' },
  { type: 'rule', icon: '🎒', text: 'Garde ton sac accessible (sur tes genoux ou à tes pieds), jamais dans le coffre.' },
]

const SPOTHITCH_TIPS_EN = [
  { type: 'sub', title: 'Use SpotHitch for your safety' },
  { type: 'rule', icon: '🛡️', text: 'Activate Guardian Mode before every trip. A trusted person follows your position in real time.' },
  { type: 'rule', icon: '🆘', text: 'Set up SOS mode with your contacts. One tap triggers a triple alert (push, SMS, call).' },
  { type: 'rule', icon: '📱', text: 'Take a photo of the license plate and send it to someone before getting in.' },
  { type: 'rule', icon: '🎒', text: 'Keep your bag accessible (on your lap or at your feet), never in the trunk.' },
]

const SPOTHITCH_TIPS_ES = [
  { type: 'sub', title: 'Usa SpotHitch para tu seguridad' },
  { type: 'rule', icon: '🛡️', text: 'Activa el Modo Guardián antes de cada viaje. Una persona de confianza sigue tu posición en tiempo real.' },
  { type: 'rule', icon: '🆘', text: 'Configura el modo SOS con tus contactos. Un toque activa una triple alerta (push, SMS, llamada).' },
  { type: 'rule', icon: '📱', text: 'Fotografía la matrícula y envíala a alguien antes de subir.' },
  { type: 'rule', icon: '🎒', text: 'Mantén tu mochila accesible (en tu regazo o a tus pies), nunca en el maletero.' },
]

const SPOTHITCH_TIPS_DE = [
  { type: 'sub', title: 'Nutze SpotHitch für deine Sicherheit' },
  { type: 'rule', icon: '🛡️', text: 'Aktiviere den Guardian-Modus vor jeder Fahrt. Eine Vertrauensperson verfolgt deine Position in Echtzeit.' },
  { type: 'rule', icon: '🆘', text: 'Richte den SOS-Modus mit deinen Kontakten ein. Ein Tippen löst einen dreifachen Alarm aus (Push, SMS, Anruf).' },
  { type: 'rule', icon: '📱', text: 'Fotografiere das Kennzeichen und sende es jemandem, bevor du einsteigst.' },
  { type: 'rule', icon: '🎒', text: 'Halte deinen Rucksack griffbereit (auf dem Schoß oder zu deinen Füßen), nie im Kofferraum.' },
]

// Country-specific safety advice (FR)
const COUNTRY_SAFETY_FR = {
  // Western Europe
  FR: 'La France est un pays sûr pour l\'autostop. Évite de faire du stop la nuit sur les routes désertes. Les aires de péage sont les endroits les plus sûrs.',
  DE: 'L\'Allemagne est très sûre. Les Raststätten (aires d\'autoroute) sont bien éclairées et sûres. Les conducteurs respectent les règles.',
  BE: 'La Belgique est l\'un des pays les plus sûrs pour l\'autostop en Europe. Les Belges sont accueillants.',
  NL: 'Les Pays-Bas sont très sûrs. Le réseau routier est dense, tu ne seras jamais loin d\'une ville.',
  LU: 'Le Luxembourg est extrêmement sûr. Petit pays, distances courtes, bien éclairé.',
  CH: 'La Suisse est un pays très sûr. Le froid en montagne l\'hiver est le vrai risque, pas les gens.',
  AT: 'L\'Autriche est très sûre. Les routes de montagne peuvent être dangereuses en hiver (verglas, neige).',
  ES: 'L\'Espagne est sûre. Le soleil et la chaleur en été sont un vrai risque : emporte toujours de l\'eau. Les stations-service sont des spots sûrs.',
  PT: 'Le Portugal est l\'un des pays les plus sûrs au monde. Le principal risque est le pickpocket dans les zones touristiques de Lisbonne.',
  IT: 'L\'Italie est sûre. Évite de faire du stop en périphérie des grandes villes la nuit. Les Autogrill (stations-service d\'autoroute) sont bien éclairés.',
  GR: 'La Grèce est sûre. Les routes de montagne sont parfois mal entretenues. Attention à la chaleur extrême en été.',
  // Nordics
  NO: 'La Norvège est extrêmement sûre. Le principal danger est la météo : froid, pluie, vent. Prévois des vêtements chauds même en été dans le nord.',
  SE: 'La Suède est très sûre. Les distances sont longues dans le nord. Prévois de la nourriture et de l\'eau.',
  FI: 'La Finlande est très sûre. En hiver, les routes verglacées et le froid extrême sont les vrais risques.',
  DK: 'Le Danemark est très sûr. Petit pays, distances courtes, tout est bien organisé.',
  IS: 'L\'Islande est le pays le plus sûr au monde. Le vrai danger est la météo qui change en quelques minutes. Prévois des couches chaudes.',
  // British Isles
  GB: 'Le Royaume-Uni est sûr. Les services d\'autoroute sont de bons spots. Attention : on conduit à gauche.',
  IE: 'L\'Irlande est très sûre et accueillante. Les routes rurales sont étroites, sois visible.',
  // Balkans
  HR: 'La Croatie est sûre pour l\'autostop. Les routes côtières sont bien fréquentées en été. Les stations-service OMV et INA sont de bons spots.',
  SI: 'La Slovénie est très sûre. Petit pays, les gens sont accueillants et parlent souvent anglais.',
  AL: 'L\'Albanie est sûre pour les touristes. Les conducteurs sont très hospitaliers. Les routes de montagne peuvent être en mauvais état.',
  RS: 'La Serbie est sûre de jour. Préfère les stations-service éclairées la nuit.',
  BA: 'La Bosnie est sûre pour l\'autostop. Les gens sont très accueillants. Certaines zones rurales ont encore des mines non désamorcées hors des routes : reste sur les routes balisées.',
  ME: 'Le Monténégro est sûr. Les routes côtières sont étroites et sinueuses. Sois visible.',
  MK: 'La Macédoine du Nord est sûre. Les conducteurs sont accueillants. Les routes principales sont en bon état.',
  XK: 'Le Kosovo est sûr pour les touristes. Les gens sont très hospitaliers envers les étrangers.',
  // Eastern Europe
  PL: 'La Pologne est sûre. Attention à la conduite rapide sur les routes nationales. Les stations Orlen sont de bons spots.',
  CZ: 'La Tchéquie est sûre. Les aires de repos près de Prague sont bien fréquentées.',
  SK: 'La Slovaquie est sûre. Les gens sont accueillants, surtout en zone rurale.',
  HU: 'La Hongrie est sûre. Les stations MOL sont de bons spots. Attention aux autoroutes payantes (vignette obligatoire).',
  RO: 'La Roumanie est sûre. La conduite peut être agressive sur les routes nationales. Attache ta ceinture.',
  BG: 'La Bulgarie est sûre. Les routes secondaires peuvent être en mauvais état. Les conducteurs de camions font de longs trajets.',
  // Baltics
  LT: 'La Lituanie est sûre. Les stations-service sur la Via Baltica (E67) sont de bons spots.',
  LV: 'La Lettonie est sûre. Les routes principales sont en bon état. Les jeunes Lettons font souvent du stop en été.',
  EE: 'L\'Estonie est très sûre. Petit pays bien connecté. Les stations-service Circle K sont de bons spots.',
  // Turkey & Caucasus
  TR: 'La Turquie est sûre pour l\'autostop. Évite les zones frontalières avec la Syrie. Les stations-service sont des spots sûrs et les conducteurs souvent très généreux.',
  GE: 'La Géorgie est sûre. Les routes de montagne peuvent être dangereuses (virages, pas de garde-fou). La conduite est parfois agressive.',
  AM: 'L\'Arménie est sûre. Les routes de montagne sont le principal risque (état variable, peu de garde-fous).',
  // Eastern
  UA: 'Vérifie la situation sécuritaire avant de voyager. Les zones ouest et centre sont plus stables. Consulte les avis des ambassades.',
  BY: 'Vérifie la situation politique avant de voyager. Informations visa et sécurité auprès de ton ambassade.',
  MD: 'La Moldavie est sûre. Routes parfois en mauvais état. Les gens sont accueillants.',
  // North Africa & Middle East
  MA: 'Le Maroc est sûr pour l\'autostop. Les routes nationales sont en bon état. Prévois de l\'eau en été (chaleur intense).',
  TN: 'La Tunisie est sûre dans les zones touristiques. Évite les zones frontalières avec la Libye et l\'Algérie.',
  EG: 'L\'Égypte est sûre dans les zones touristiques. Préfère les bus longue distance pour les trajets de nuit.',
  DZ: 'Vérifie les avis de sécurité avant de voyager. Les grandes villes et le nord sont plus sûrs.',
  IL: 'Israël est sûr. Les trempiades (spots de stop officiels) existent avec des abribus. Le stop est culturellement accepté.',
  JO: 'La Jordanie est sûre et hospitalière. Les conducteurs s\'arrêtent souvent sans qu\'on leur demande.',
  LB: 'Le Liban est sûr dans les zones touristiques. Vérifie la situation sécuritaire avant de voyager.',
  IR: 'L\'Iran est sûr pour les touristes. L\'hospitalité est légendaire. Respecte le code vestimentaire. Prévois du cash (cartes internationales non acceptées).',
  OM: 'Oman est très sûr. Les conducteurs sont hospitaliers. La chaleur extrême en été est le vrai risque.',
  // Americas
  US: 'Les États-Unis sont sûrs dans la plupart des régions. Le stop est moins courant mais fonctionne sur les interstates via les gas stations. Les distances sont immenses.',
  CA: 'Le Canada est très sûr. Les distances sont immenses, prévois eau et nourriture. Certaines zones n\'ont aucun réseau téléphonique.',
  MX: 'Le Mexique est sûr sur les routes principales et dans les zones touristiques. Préfère les casetas de cobro (péages) comme spots.',
  GT: 'Le Guatemala est sûr dans les zones touristiques. Les gasolineras (stations-service) sont de bons spots.',
  CR: 'Le Costa Rica est sûr. Les Ticos sont accueillants. Les routes de montagne sont sinueuses.',
  PA: 'Le Panama est sûr. Les stations-service sont de bons spots. Attention à la chaleur.',
  CO: 'La Colombie est sûre dans les zones touristiques. Les péages sont les meilleurs spots. Évite de voyager de nuit.',
  BR: 'Le Brésil est sûr sur les routes principales. Les postos de gasolina (stations-service) sont les meilleurs spots. Apprends quelques mots de portugais.',
  AR: 'L\'Argentine est sûre. Les estaciones de servicio (stations-service) YPF sont de bons spots. Les distances sont immenses en Patagonie.',
  CL: 'Le Chili est sûr. Le stop fonctionne bien, surtout en Patagonie. Les distances sont longues dans le nord (désert d\'Atacama).',
  PE: 'Le Pérou est sûr sur les routes principales. Les péages et stations-service sont les meilleurs spots. Routes de montagne parfois en mauvais état.',
  BO: 'La Bolivie est sûre. Les routes de montagne sont le principal risque (altitude, virages). Attention au mal d\'altitude.',
  EC: 'L\'Équateur est sûr sur les routes principales. Les péages sont de bons spots. Attention à l\'altitude dans les Andes.',
  UY: 'L\'Uruguay est très sûr. Les estaciones Ancap sont de bons spots. Petit pays, distances courtes.',
  CU: 'Cuba est très sûr. Le stop est le moyen de transport principal pour les Cubains. Les botella (stops officiels) ont des employés qui organisent les trajets.',
  // Africa
  SN: 'Le Sénégal est sûr. Les Sénégalais sont très hospitaliers. Prévois de l\'eau et un chapeau.',
  GH: 'Le Ghana est sûr. L\'un des pays les plus stables d\'Afrique de l\'Ouest. Les stations-service sont de bons spots.',
  KE: 'Le Kenya est sûr sur les routes principales. Évite de voyager de nuit. Les matatus (minibus) sont une alternative.',
  TZ: 'La Tanzanie est sûre sur les routes principales. Évite les trajets de nuit. Les stations-service sont de bons spots.',
  ET: 'L\'Éthiopie est sûre pour les touristes. Les distances sont longues. Les conducteurs s\'attendent parfois à un paiement.',
  ZA: 'L\'Afrique du Sud est sûre sur les routes principales. Préfère les stations-service Engen ou Shell. Évite de faire du stop la nuit.',
  UG: 'L\'Ouganda est sûr. Les conducteurs sont accueillants. Les stations-service Total sont de bons spots.',
  RW: 'Le Rwanda est très sûr, l\'un des pays les plus sûrs d\'Afrique. Les routes sont en bon état.',
  MW: 'Le Malawi est sûr et accueillant. Les routes principales sont en état correct.',
  NA: 'La Namibie est sûre. Les distances sont immenses et le trafic faible. Prévois eau, nourriture et protection solaire.',
  // Asia
  TH: 'La Thaïlande est sûre. Les Thaïlandais sont accueillants. Le stop est moins courant mais fonctionne. Utilise un panneau avec ta destination en thaï.',
  VN: 'Le Vietnam est sûr. Le trafic est dense et chaotique dans les villes. Les stations-service sont de bons spots pour les longs trajets.',
  KH: 'Le Cambodge est sûr. Les routes principales sont en bon état. Les conducteurs ne comprennent pas toujours le concept de stop gratuit.',
  LA: 'Le Laos est sûr. Les routes de montagne sont en mauvais état. Les conducteurs s\'arrêtent facilement.',
  MM: 'Vérifie la situation sécuritaire avant de voyager. Certaines zones sont instables.',
  IN: 'L\'Inde est sûre pour l\'autostop. Le concept de stop gratuit est naturel. Aux stations-service et dhabas (restos routiers), aborde directement les camionneurs.',
  NP: 'Le Népal est sûr. Les routes de montagne sont le principal risque (état, précipices). Les conducteurs sont accueillants.',
  LK: 'Le Sri Lanka est sûr. Les conducteurs sont hospitaliers. Les routes côtières sont les plus faciles pour le stop.',
  JP: 'Le Japon est extrêmement sûr. Le stop fonctionne bien. Les conducteurs sont polis et fiables. Utilise un panneau en japonais.',
  KR: 'La Corée du Sud est très sûre. Le stop est moins courant mais les aires de repos d\'autoroute sont des spots parfaits.',
  CN: 'La Chine est sûre. La barrière de la langue est le principal obstacle. Un panneau en chinois est indispensable.',
  TW: 'Taïwan est très sûr. Les Taïwanais sont extrêmement accueillants. Le stop fonctionne bien.',
  PH: 'Les Philippines sont sûres sur les îles principales (Luzon, Visayas). Évite l\'extrême sud. Les jeepneys sont une alternative.',
  MY: 'La Malaisie est sûre. La péninsule et Sarawak sont très accueillants.',
  SG: 'Singapour est extrêmement sûr. Pas vraiment besoin de stop (petit pays, transports excellents).',
  ID: 'L\'Indonésie est sûre. Les conducteurs sont accueillants. Bali et Java sont les plus faciles. Les routes de montagne de Sumatra sont en mauvais état.',
  MN: 'La Mongolie est sûre. Les distances sont immenses et les routes parfois inexistantes. Prévois eau, nourriture et une tente.',
  // Central Asia
  KZ: 'Le Kazakhstan est sûr. Les distances sont immenses. Les stations-service sont rares en zone rurale. Prévois de l\'eau.',
  KG: 'Le Kirghizistan est sûr. Les routes de montagne sont spectaculaires mais dangereuses. Les conducteurs s\'arrêtent facilement.',
  UZ: 'L\'Ouzbékistan est sûr. Les conducteurs sont hospitaliers. Les contrôles de police aux checkpoints sont fréquents mais sans problème.',
  TJ: 'Le Tadjikistan est sûr. La Pamir Highway est spectaculaire mais les routes sont en mauvais état. Peu de trafic.',
  // Oceania
  AU: 'L\'Australie est sûre. Les distances sont immenses (parfois 500+ km entre villes). Prévois eau et protection solaire. Évite le stop la nuit dans l\'Outback.',
  NZ: 'La Nouvelle-Zélande est très sûre et le stop fonctionne très bien. Les Kiwis s\'arrêtent souvent. Les distances sont raisonnables.',
  // Pakistan
  PK: 'Vérifie les avis de sécurité avant de voyager. Le nord (Hunza, Gilgit) est sûr et accueillant. Évite les zones frontalières.',
}

// Same for EN
const COUNTRY_SAFETY_EN = {}
// I'll map FR to EN with translations
for (const [code, text] of Object.entries(COUNTRY_SAFETY_FR)) {
  // Basic mapping — the texts are already factual, no anecdotes
  COUNTRY_SAFETY_EN[code] = text
    .replace(/La France est/g, 'France is')
    .replace(/L'Allemagne est/g, 'Germany is')
    // ... this would be too long. Let's just inject FR for now and handle translations separately
}

// Read the file
const frContent = fs.readFileSync('src/data/guideSections-fr.js', 'utf8')

let modified = frContent
let count = 0

for (const [code, safetyText] of Object.entries(COUNTRY_SAFETY_FR)) {
  // Find the safety section for this country
  // Pattern: safety: { filterTypes: [...], blocks: [
  //   { type: 'text', text: '...' },
  //   { type: 'kv', items: [...] },
  // ]},

  // We need to find the safety blocks for this country and replace them
  // Strategy: find 'safety:' after the country code, then find the blocks array

  const countryPattern = new RegExp(`(\\b${code}:\\s*\\{[\\s\\S]*?safety:\\s*\\{\\s*filterTypes:\\s*\\[[^\\]]*\\],\\s*blocks:\\s*\\[)([\\s\\S]*?)(\\]\\s*\\})`, 'g')

  // This regex is too complex. Let's do it line by line instead.
}

// Actually, let's just report what we'd change
console.log('Would enrich', Object.keys(COUNTRY_SAFETY_FR).length, 'countries')
console.log('Script approach too complex for regex. Will edit manually with targeted replacements.')
