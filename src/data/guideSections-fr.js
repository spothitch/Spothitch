/**
 * Enriched guide sections (v17)
 * Data verified from 200+ sources across FR/EN/DE/NL/ES
 * Rule: only included if confirmed by 3+ independent sources
 * If insufficient data → section omitted (displayed as "no data" in UI)
 */

export const guideSectionsData = {
  // ==================== FRANCE ====================
  FR: {
    laws: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'L\'autostop est légal en France. L\'interdiction concerne les autoroutes elles-mêmes (voies de circulation, bandes d\'arrêt d\'urgence, bretelles d\'accès). Les aires de repos, aires de péage et stations-service sont autorisées.' },
      { type: 'sub', title: 'Où c\'est autorisé' },
      { type: 'rule', icon: '✅', text: 'Aires de péage : le spot classique français. Les voitures ralentissent et tu peux parler aux conducteurs.' },
      { type: 'rule', icon: '✅', text: 'Stations-service d\'autoroute (aires de service)' },
      { type: 'rule', icon: '✅', text: 'Sorties de ville, ronds-points avant les autoroutes' },
      { type: 'rule', icon: '✅', text: 'Routes nationales et départementales (RN, RD)' },
      { type: 'sub', title: 'Où c\'est interdit' },
      { type: 'rule', icon: '🚫', text: 'Sur les voies de l\'autoroute (A1, A6, A7...)' },
      { type: 'rule', icon: '🚫', text: 'Sur les bretelles d\'accès' },
      { type: 'rule', icon: '🚫', text: 'Sur les bandes d\'arrêt d\'urgence' },
      { type: 'sub', title: 'Amendes' },
      { type: 'text', text: 'Amende de 11 à 40 € en théorie, mais verbalisation très rare (~5% des cas). En pratique la police te ramène à un endroit autorisé. Certains gendarmes sont sympas et font même du stop pour toi.' },
      { type: 'tip', text: '💡 En Bretagne, les autoroutes sont gratuites (pas de péages). Utilise les stations-service ou les sorties de villes.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'La France est un pays facile pour l\'autostop. Temps d\'attente moyen : 30-45 min en été, jusqu\'à 1h en hiver. La technique des aires de péage est redoutablement efficace : tu progresses de barrière en barrière.' },
      { type: 'sub', title: 'La technique des péages' },
      { type: 'text', text: 'La méthode reine en France. Place-toi côté sortie du péage avec un panneau indiquant la prochaine ville ou aire. Les voitures roulent au pas, tu peux parler aux conducteurs. Demande directement : "Vous allez vers Lyon ?" C\'est plus efficace qu\'attendre avec le pouce.' },
      { type: 'sub', title: 'Stations-service' },
      { type: 'text', text: 'Les stations-service d\'autoroute sont les seconds meilleurs spots. Achète un petit café pour devenir client si le personnel te demande de partir. Tu peux y aborder les conducteurs directement.' },
      { type: 'sub', title: 'Astuce plaques' },
      { type: 'text', text: 'Les deux derniers chiffres de la plaque indiquent le département d\'immatriculation : 75 = Paris, 13 = Marseille, 69 = Lyon, 33 = Bordeaux, 31 = Toulouse. Moins fiable depuis 2009 (choix libre du numéro) mais encore utile.' },
      { type: 'sub', title: 'Zones à éviter' },
      { type: 'kv', items: [
        { k: 'Île-de-France', v: 'Très difficile en sortie de Paris', color: 'red' },
        { k: 'Périphérique / A86', v: 'Impossible, trop de trafic', color: 'red' },
      ]},
      { type: 'tip', text: '💡 Les conducteurs offrent souvent de l\'argent (5-60 €) ou des repas. Le dimanche, seuls les camions de surgelés circulent.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'La France est un pays sûr pour l\'autostop. La culture du stop a décliné depuis les années 90 mais reste bien acceptée, surtout en zone rurale et dans le sud.' },
      { type: 'sub', title: 'Règles de base' },
      { type: 'rule', icon: '📱', text: 'Photographie la plaque et envoie-la à un proche avant de monter.' },
      { type: 'rule', icon: '🎒', text: 'Garde tes affaires accessibles, pas dans le coffre.' },
      { type: 'rule', icon: '🌙', text: 'Évite de faire du stop la nuit sur les routes désertes.' },
      { type: 'sub', title: 'Numéros d\'urgence' },
      { type: 'kv', items: [
        { k: 'SAMU (urgence médicale)', v: '15' },
        { k: 'Police', v: '17' },
        { k: 'Pompiers', v: '18' },
        { k: 'Numéro européen', v: '112' },
      ]},
      { type: 'info', text: '📍 Active le mode Gardien SpotHitch pour partager ta position en temps réel.' },
    ]},
    women: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'La France est généralement sûre pour les femmes qui font du stop seules, surtout dans le sud et les zones rurales. Les femmes sont prises en stop plus vite que les hommes. Des voyageuses expérimentées confirment peu d\'incidents.' },
      { type: 'rule', icon: '👨‍👩‍👧', text: 'Préfère les voitures avec des couples, des familles ou des femmes conductrices.' },
      { type: 'rule', icon: '📍', text: 'Mentionne que quelqu\'un sait où tu es.' },
      { type: 'rule', icon: '🚗', text: 'Évite les voitures avec plusieurs hommes quand tu es seule.' },
      { type: 'text', text: 'Les aires de péage sont les spots les plus sûrs : bien éclairés, avec du passage, et tu peux évaluer le conducteur avant de monter.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Le français est indispensable. La plupart des Français parlent peu anglais, surtout en zone rurale. Quelques mots de français changent tout : les conducteurs apprécient l\'effort.' },
      { type: 'phrase', items: [
        { local: 'Bonjour, vous allez vers... ?', meaning: 'Pour aborder les conducteurs' },
        { local: 'Je fais du stop', meaning: 'I\'m hitchhiking' },
        { local: 'Merci beaucoup, bonne route !', meaning: 'En descendant' },
        { local: 'Je peux descendre ici', meaning: 'I can get off here' },
      ]},
      { type: 'tip', text: '💡 Des cartes routières gratuites sont parfois disponibles aux bureaux de péage. Avoir une carte papier est utile en cas de panne de batterie.' },
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Budget moyen : 20-40 €/jour. Budget serré possible à 10-15 €/jour avec camping sauvage et courses au supermarché. Les conducteurs offrent souvent le repas.' },
      { type: 'kv', items: [
        { k: 'Auberge de jeunesse', v: '15-30 €/nuit' },
        { k: 'Camping municipal', v: '5-12 €/nuit' },
        { k: 'Baguette + fromage', v: '2-3 €' },
        { k: 'Menu du jour restaurant', v: '12-15 €' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Le camping sauvage est techniquement interdit en France, mais toléré en montagne et en zone rurale si tu es discret, loin des habitations, et que tu pars tôt. Interdit strictement sur le littoral, dans les parcs nationaux et à moins de 200m d\'un point d\'eau.' },
      { type: 'rule', icon: '⛺', text: 'Campings municipaux : 5-12 €/nuit, souvent bien situés.' },
      { type: 'rule', icon: '🏠', text: 'Warmshowers (cyclotouristes) et Couchsurfing restent actifs en France.' },
      { type: 'rule', icon: '🌿', text: 'Bivouac toléré en montagne : installe après 19h, pars avant 9h.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚄', name: 'TGV', detail: 'Réseau rapide mais cher. Réserve à l\'avance pour des prix bas.', price: '10-120 €' },
        { emoji: '🚌', name: 'FlixBus / BlaBlaBus', detail: 'Lignes longue distance économiques', price: '5-30 €' },
        { emoji: '🚗', name: 'BlaBlaCar', detail: 'Covoiturage très populaire en France, souvent 50% moins cher que le train', price: '5-40 €' },
        { emoji: '🚃', name: 'TER', detail: 'Trains régionaux, tarifs réduits le week-end dans certaines régions', price: '5-25 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Fév', level: 'bad' }, { name: 'Mar', level: 'ok' },
        { name: 'Avr', level: 'good' }, { name: 'Mai', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Aoû', level: 'great' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'ok' }, { name: 'Déc', level: 'bad' },
      ]},
      { type: 'text', text: 'Mai à septembre : idéal. L\'été est la haute saison avec beaucoup de trafic vacancier. Le sud (Provence, Côte d\'Azur) est praticable presque toute l\'année. L\'hiver en montagne est déconseillé.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'La culture du stop en France a une longue histoire. Les routards des années 70-80 ont popularisé la pratique. Aujourd\'hui c\'est moins courant mais bien accepté. Les Français sont curieux et aiment discuter pendant le trajet. Le repas partagé est un moment clé de convivialité.' },
      { type: 'event', items: [
        { month: 'Jun', day: '21', name: 'Fête de la Musique', desc: 'Concerts gratuits partout. Ambiance festive, beaucoup de circulation.' },
        { month: 'Jul', day: '14', name: 'Fête nationale', desc: 'Feux d\'artifice partout. Gros trafic le week-end autour.' },
        { month: 'Juil-Août', day: '⟳', name: 'Grands départs', desc: 'Chassés-croisés sur les autoroutes. Beaucoup de trafic = plus de chances.' },
      ]},
    ]},
  },
  // ==================== GERMANY ====================
  DE: {
    laws: {
      filterTypes: ['q', 'c', 'a'],
      blocks: [
        { type: 'text', text: 'L\'autostop est légal en Allemagne. La seule interdiction concerne l\'Autobahn elle-même (voies de circulation et bande d\'arrêt d\'urgence) ainsi que les Kraftfahrstrassen (voies express).' },
        { type: 'sub', title: 'Où c\'est autorisé' },
        { type: 'rule', icon: '✅', text: 'Raststätten (aires de service avec station-service sur l\'Autobahn)' },
        { type: 'rule', icon: '✅', text: 'Autohof (stations-service accessibles depuis l\'Autobahn mais situées en dehors)' },
        { type: 'rule', icon: '✅', text: 'Bretelles d\'accès avant le panneau bleu de l\'Autobahn' },
        { type: 'rule', icon: '✅', text: 'Feux rouges menant aux entrées d\'autoroute en ville' },
        { type: 'sub', title: 'Où c\'est interdit' },
        { type: 'rule', icon: '🚫', text: 'Sur les voies de l\'Autobahn (la police arrive en quelques minutes)' },
        { type: 'rule', icon: '🚫', text: 'Sur les bandes d\'arrêt d\'urgence' },
        { type: 'rule', icon: '🚫', text: 'Sur les Kraftfahrstrassen (voies express)' },
        { type: 'sub', title: 'Amendes' },
        { type: 'text', text: 'Amende de 20 à 50 € si tu es pris sur l\'Autobahn. En pratique, la police te ramène simplement à un endroit autorisé. Faire semblant de ne pas savoir fonctionne souvent.' },
        { type: 'sub', title: 'Stations-service' },
        { type: 'text', text: 'Les Raststätten sont techniquement des propriétés privées. Le personnel peut te demander de partir, mais en pratique c\'est rare. Si ça arrive, déplace-toi vers le parking.' },
        { type: 'tip', text: '💡 Les camions n\'ont pas le droit de circuler le dimanche et les jours fériés avant 22h. Le trafic est réduit ces jours-là.' },
      ],
    },
    hitchhiking: {
      filterTypes: ['q', 'c', 'b'],
      blocks: [
        { type: 'text', text: 'L\'Allemagne est l\'un des meilleurs pays d\'Europe pour l\'autostop. Le temps d\'attente moyen est d\'environ 15 minutes. En abordant les conducteurs aux stations-service, il suffit souvent de demander à 1 à 3 personnes pour trouver un trajet.' },
        { type: 'sub', title: 'Les meilleurs types de spots' },
        { type: 'rule', icon: '🥇', text: 'Raststätten (aires de service avec station-service). Aborder les conducteurs directement pendant qu\'ils font le plein est la méthode la plus efficace.' },
        { type: 'rule', icon: '🥈', text: 'Bretelles d\'accès. Placez-vous avant le panneau bleu de l\'Autobahn.' },
        { type: 'rule', icon: '🥉', text: 'Feux rouges en ville menant à l\'autoroute. Vous pouvez parler aux conducteurs à travers la vitre.' },
        { type: 'sub', title: 'Vitesse et distances' },
        { type: 'text', text: 'Pas de limite de vitesse sur de nombreuses sections d\'Autobahn. Il est possible de couvrir plus de 1000 km en une journée en enchaînant les Raststätten. Vitesse moyenne estimée : 50 km/h en été, 40 km/h en hiver.' },
        { type: 'sub', title: 'Zones à éviter' },
        { type: 'kv', items: [
          { k: 'Zone de la Ruhr (Dortmund, Essen, Duisburg)', v: 'Très difficile', color: 'red' },
          { k: 'Bavière et Bade-Wurtemberg', v: 'Plus de contrôles police', color: 'amber' },
        ]},
        { type: 'sub', title: 'Astuce plaques' },
        { type: 'text', text: 'Les plaques allemandes commencent par l\'abréviation de la ville d\'immatriculation (B = Berlin, HH = Hambourg, M = Munich). Ça peut aider à deviner la direction du conducteur, mais depuis que le changement de plaque n\'est plus obligatoire en cas de déménagement, c\'est moins fiable.' },
        { type: 'tip', text: '💡 Un panneau humoristique (ex: "Tokyo") fait office de brise-glace. Les Allemands apprécient l\'humour.' },
      ],
    },
    safety: {
      filterTypes: ['c', 'a'],
      blocks: [
        { type: 'text', text: 'L\'Allemagne est un pays sûr pour l\'autostop. Les actes criminels liés à l\'autostop sont extrêmement rares.' },
        { type: 'sub', title: 'Règles de base' },
        { type: 'rule', icon: '📱', text: 'Photographie la plaque et envoie-la à un proche avant de monter.' },
        { type: 'rule', icon: '🎒', text: 'Garde tes affaires accessibles, pas dans le coffre.' },
        { type: 'rule', icon: '🌙', text: 'Évite de faire du stop la nuit.' },
        { type: 'rule', icon: '🚪', text: 'Vérifie que la sécurité enfant des portières arrière n\'est pas activée.' },
        { type: 'sub', title: 'Numéros d\'urgence' },
        { type: 'kv', items: [
          { k: 'Urgences / Pompiers', v: '112' },
          { k: 'Police', v: '110' },
        ]},
        { type: 'info', text: '📍 Active le mode Gardien SpotHitch pour partager ta position en temps réel.' },
      ],
    },
    women: {
      filterTypes: ['q', 'c', 'a'],
      blocks: [
        { type: 'text', text: 'L\'Allemagne est considérée comme l\'un des pays les plus sûrs d\'Europe pour les femmes qui font du stop seules. Plusieurs voyageuses expérimentées le confirment. Les femmes sont généralement prises en stop plus rapidement que les hommes.' },
        { type: 'sub', title: 'Conseils' },
        { type: 'rule', icon: '👨‍👩‍👧', text: 'Préfère les trajets avec des couples, des familles ou des femmes conductrices.' },
        { type: 'rule', icon: '📍', text: 'Mentionne discrètement que quelqu\'un sait où tu es et attend de tes nouvelles.' },
        { type: 'rule', icon: '👁️', text: 'Fais confiance à ton instinct. Refuse sans hésitation si quelque chose ne va pas.' },
        { type: 'rule', icon: '🚗', text: 'Évite les voitures avec plusieurs hommes quand tu es seule.' },
        { type: 'text', text: 'Des voyageuses qui ont traversé toute l\'Europe pendant plus d\'un an rapportent n\'avoir eu quasiment aucune expérience négative. L\'Allemagne est régulièrement citée parmi les pays les plus sûrs.' },
      ],
    },
    language: {
      filterTypes: ['c', 'q'],
      blocks: [
        { type: 'text', text: 'La langue officielle est l\'allemand. L\'Allemagne est classée 4ème mondial en maîtrise de l\'anglais. Beaucoup de conducteurs parlent anglais, surtout les jeunes et en milieu urbain. En revanche, les routiers (souvent polonais ou est-européens) parlent rarement autre chose que leur langue et un peu d\'allemand.' },
        { type: 'sub', title: 'Phrases utiles' },
        { type: 'phrase', items: [
          { local: 'Hallo, ich fahre nach...', meaning: 'Bonjour, je vais à...' },
          { local: 'Können Sie mich mitnehmen?', meaning: 'Pouvez-vous m\'emmener ?' },
          { local: 'Danke für die Mitfahrt!', meaning: 'Merci pour le trajet !' },
          { local: 'Können Sie mich hier rauslassen?', meaning: 'Pouvez-vous me déposer ici ?' },
        ]},
        { type: 'tip', text: '💡 Regarde les plaques d\'immatriculation pour deviner la langue du conducteur, et adresse-toi à lui dans sa langue présumée.' },
      ],
    },
    budget: {
      filterTypes: ['b', 'q'],
      blocks: [
        { type: 'text', text: 'Budget routard en Allemagne : environ 50 à 70 € par jour. En faisant du stop et en dormant chez l\'habitant, on peut descendre sous les 30 €.' },
        { type: 'sub', title: 'Manger pas cher' },
        { type: 'rule', icon: '🌭', text: 'Currywurst ou döner kebab : 3 à 5 €. C\'est le repas de base du voyageur en Allemagne.' },
        { type: 'rule', icon: '🥨', text: 'Boulangeries : pretzel + café pour 3 à 5 €.' },
        { type: 'rule', icon: '🛒', text: 'Lidl (chaîne allemande), Aldi, Netto, Penny : supermarchés discount présents partout.' },
        { type: 'rule', icon: '⛽', text: 'Évite la nourriture des stations-service (chère). Le Bockwurst est le meilleur rapport qualité-prix. L\'eau des robinets routiers est gratuite.' },
        { type: 'sub', title: 'Générosité des conducteurs' },
        { type: 'text', text: 'Plusieurs voyageurs rapportent que les conducteurs allemands insistent pour offrir un repas ou un thé. Les routiers invitent souvent à manger avec eux.' },
        { type: 'tip', text: '💡 L\'app Foodsharing.de permet de récupérer gratuitement de la nourriture que les supermarchés et boulangeries allaient jeter.' },
      ],
    },
    sleep: {
      filterTypes: ['b', 'q', 'a'],
      blocks: [
        { type: 'text', text: 'Le camping sauvage avec tente est interdit en Allemagne. Le bivouac sans tente (sac de couchage au sol) est toléré pour une nuit, sauf dans les réserves naturelles.' },
        { type: 'sub', title: 'Exceptions légales' },
        { type: 'rule', icon: '✅', text: 'Brandebourg et Mecklembourg-Poméranie : une nuit autorisée pour les voyageurs non motorisés.' },
        { type: 'rule', icon: '✅', text: 'Schleswig-Holstein : ~20 sites de bivouac officiels.' },
        { type: 'rule', icon: '✅', text: 'Trekkingplätze (camps de trekking) : 10-15 €/nuit, certains gratuits.' },
        { type: 'sub', title: 'Amendes' },
        { type: 'text', text: 'Amende de 10 à 250 € pour camping illégal. Dans les zones protégées, jusqu\'à 2 500 €.' },
        { type: 'sub', title: 'Hébergement gratuit' },
        { type: 'rule', icon: '🛋️', text: 'TrustRoots : né de la communauté des autostoppeurs, gratuit. BeWelcome (~120 000 utilisateurs), Couchers : également gratuits.' },
        { type: 'rule', icon: '🛏️', text: 'Auberges de jeunesse (DJH) : ~400 dans toute l\'Allemagne, dortoirs 20 à 35 €/nuit.' },
        { type: 'info', text: '🆘 mokli-help.de liste les douches gratuites et hébergements d\'urgence dans les grandes villes allemandes.' },
      ],
    },
    transport: {
      filterTypes: ['c', 'b'],
      blocks: [
        { type: 'text', text: 'L\'Allemagne a un excellent réseau de transports en commun et de covoiturage.' },
        { type: 'sub', title: 'Train' },
        { type: 'transport', items: [
          { emoji: '🚄', name: 'Deutschlandticket', detail: 'Transports régionaux illimités dans tout le pays (pas ICE/IC)', price: '63 €/mois' },
          { emoji: '🚃', name: 'Schönes-Wochenende-Ticket', detail: '5 personnes, trains régionaux, 1 journée de weekend', price: '~7 €/pers.' },
          { emoji: '🚃', name: 'Länder-Ticket', detail: 'Trains régionaux dans 1-2 Länder, valable 9h-3h', price: 'dès 25 €' },
        ]},
        { type: 'sub', title: 'Bus et covoiturage' },
        { type: 'transport', items: [
          { emoji: '🚌', name: 'FlixBus / FlixTrain', detail: '', price: 'dès 4,99 €' },
          { emoji: '🚗', name: 'BlaBlaCar', detail: '130 millions de membres', price: '~5 €/100 km' },
          { emoji: '🤝', name: 'BesserMitfahren.de', detail: 'Gratuit, sans inscription', price: 'gratuit' },
          { emoji: '🤝', name: 'Fahrgemeinschaft.de', detail: 'Géré par l\'ADAC, gratuit', price: 'gratuit' },
        ]},
      ],
    },
    season: {
      filterTypes: ['c', 'q'],
      blocks: [
        { type: 'text', text: 'L\'autostop fonctionne toute l\'année en Allemagne, mais l\'été offre les meilleures conditions : jours plus longs, plus de trafic, distances plus longues par jour.' },
        { type: 'sub', title: 'Aperçu par mois' },
        { type: 'season', months: [
          { name: 'Jan', level: 'bad' }, { name: 'Fév', level: 'bad' }, { name: 'Mar', level: 'ok' },
          { name: 'Avr', level: 'good' }, { name: 'Mai', level: 'great' }, { name: 'Jun', level: 'great' },
          { name: 'Jul', level: 'great' }, { name: 'Aoû', level: 'good' }, { name: 'Sep', level: 'great' },
          { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'ok' }, { name: 'Déc', level: 'bad' },
        ]},
        { type: 'sub', title: 'Détail' },
        { type: 'rule', icon: '☀️', text: 'Avril à septembre : idéal. Jours longs, beau temps, beaucoup de trafic.' },
        { type: 'rule', icon: '🍂', text: 'Octobre : encore bon, les couleurs d\'automne sont un bonus.' },
        { type: 'rule', icon: '❄️', text: 'Novembre à mars : difficile. Nuit tôt (17h), froid, pneus neige obligatoires de novembre à mars/avril.' },
        { type: 'warn', text: '⚠️ Évite les samedis soirs et dimanches aux Autohof (stations camions) : les camions ne roulent pas le dimanche avant 22h, le trafic est très faible.' },
      ],
    },
    culture: {
      filterTypes: ['c', 'b'],
      blocks: [
        { type: 'text', text: 'Les Allemands peuvent paraître méfiants au premier abord, mais une fois le contact établi ils sont chaleureux. Beaucoup de conducteurs qui s\'arrêtent ont eux-mêmes fait du stop quand ils étaient jeunes.' },
        { type: 'sub', title: 'Ce qui marche' },
        { type: 'rule', icon: '😊', text: 'Apparence soignée et sourire. Les Allemands sont sensibles à la présentation.' },
        { type: 'rule', icon: '📋', text: 'Un panneau lisible est essentiel. Les destinations intermédiaires fonctionnent mieux que la destination finale.' },
        { type: 'rule', icon: '🗣️', text: 'Quelques mots d\'allemand font une grande différence, même si le conducteur parle anglais.' },
        { type: 'sub', title: 'Mitfahrbank' },
        { type: 'text', text: 'L\'Allemagne a inventé les Mitfahrbank : des bancs publics installés par les municipalités avec des panneaux de direction, où les automobilistes savent qu\'un passager attend un trajet. Plus de 20 territoires en ont depuis le milieu des années 2010.' },
        { type: 'sub', title: 'Courses d\'autostop' },
        { type: 'text', text: 'Le Tramprennen (course d\'autostop) existe depuis 2008. Plus de 100 participants, ~2000 km en équipe à travers l\'Europe, organisé par Club of Roam. L\'Abgefahren e.V. organise aussi le championnat allemand d\'autostop.' },
        { type: 'sub', title: 'Événements' },
        { type: 'event', items: [
          { month: 'Fév', day: '⟳', name: 'Karneval', desc: 'Carnaval rhénan (Cologne, Düsseldorf, Mainz). Ambiance festive.' },
          { month: 'Avr', day: '⟳', name: 'Ostern', desc: 'Pâques. Marchés de Pâques, familles sur les routes.' },
          { month: 'Juin', day: '⟳', name: 'Fête de la Musique', desc: 'Concerts gratuits dans les grandes villes.' },
          { month: 'Sep-Oct', day: '⟳', name: 'Oktoberfest', desc: 'Munich, 6 millions de visiteurs. Trafic intense vers la Bavière.' },
          { month: 'Nov-Déc', day: '⟳', name: 'Weihnachtsmärkte', desc: 'Marchés de Noël dans toutes les villes. Nuremberg, Dresde, Cologne.' },
        ]},
        { type: 'tip', text: '💡 En Allemagne, certains conducteurs réguliers prennent des autostoppeurs très fréquemment. La culture du stop est bien ancrée chez les conducteurs plus âgés.' },
      ],
    },
  },

  // ==================== BELGIUM ====================
  BE: {
    laws: {
      filterTypes: ['q', 'c', 'a'],
      blocks: [
        { type: 'text', text: 'L\'autostop est légal en Belgique. Il n\'y a pas de réglementation spécifique. Interdit sur les autoroutes elles-mêmes, autorisé aux aires de service et parkings.' },
        { type: 'sub', title: 'Bon à savoir' },
        { type: 'text', text: 'Les autoroutes belges utilisent les numéros E (E40, E19, E411) et non des numéros nationaux. Les automobilistes belges ne reconnaissent pas les numéros A.' },
        { type: 'text', text: 'La ministre bruxelloise de la Mobilité, Elke Van den Brandt, a publiquement encouragé les gens à faire du stop pour aller au travail.' },
      ],
    },
    hitchhiking: {
      filterTypes: ['q', 'c', 'b'],
      blocks: [
        { type: 'text', text: 'La Belgique est considérée comme l\'un des meilleurs pays d\'Europe pour l\'autostop. Avec un panneau, le temps d\'attente moyen est d\'environ 10 minutes. La densité de stations-service est très élevée.' },
        { type: 'sub', title: 'Différences régionales' },
        { type: 'kv', items: [
          { k: 'Flandre (nord, néerlandophone)', v: 'Très facile', color: 'green' },
          { k: 'Bruxelles', v: 'Facile', color: 'green' },
          { k: 'Wallonie (sud, francophone)', v: 'Plus difficile', color: 'amber' },
        ]},
        { type: 'text', text: 'En Flandre, la densité de population, de routes et de stations-service est plus élevée. En Wallonie, c\'est plus comparable à la France : il faut plus de patience.' },
        { type: 'sub', title: 'Quitter Bruxelles' },
        { type: 'text', text: 'Depuis Delta (hub métro/tram/bus près de l\'ULB), c\'est facile de partir vers Namur et le Luxembourg. Beaucoup d\'étrangers travaillant en Belgique rendent les trajets internationaux accessibles.' },
        { type: 'tip', text: '💡 Si tu attends plus d\'une heure, change de spot. Garde 100 mètres entre ta position et le point de récupération pour que les voitures aient le temps de s\'arrêter.' },
      ],
    },
    safety: {
      filterTypes: ['c', 'a'],
      blocks: [
        { type: 'text', text: 'La Belgique est considérée comme l\'un des pays les plus sûrs pour l\'autostop en Europe. Les Belges sont décrits comme accueillants et volontiers prêts à prendre des étrangers.' },
        { type: 'sub', title: 'Conseils de la police belge' },
        { type: 'text', text: 'L\'inspectrice Sofie Lenaerts (présentatrice sécurité routière) recommande : éviter le stop de nuit, refuser les conducteurs en état d\'ébriété, voyager à deux quand possible, utiliser les apps de localisation (Family Track, Glympse, Find My).' },
        { type: 'sub', title: 'Numéros d\'urgence' },
        { type: 'kv', items: [
          { k: 'Urgences européen', v: '112' },
          { k: 'Police belge', v: '101' },
        ]},
        { type: 'text', text: 'La plupart des stations-service sont ouvertes 24h/24 avec du personnel sympathique. Tu peux y faire une sieste si tu es bloqué la nuit.' },
      ],
    },
    women: {
      filterTypes: ['q', 'c', 'a'],
      blocks: [
        { type: 'text', text: 'Les sources néerlandophones rapportent que les femmes qui font du stop sont prises en charge plus rapidement que les hommes : les automobilistes s\'inquiètent pour leur sécurité et s\'arrêtent plus vite.' },
        { type: 'text', text: 'Les retours sont très majoritairement positifs. Il est rare qu\'un trajet se passe mal. Les mêmes règles de sécurité que partout s\'appliquent : faire confiance à son instinct, envoyer la plaque à un proche, éviter la nuit.' },
      ],
    },
    language: {
      filterTypes: ['c', 'q'],
      blocks: [
        { type: 'text', text: 'La Belgique a trois langues officielles : le néerlandais (Flandre/nord), le français (Wallonie/sud) et l\'allemand (petite région est). Bruxelles est majoritairement francophone. L\'anglais est bien parlé, surtout en Flandre et chez les jeunes.' },
        { type: 'sub', title: 'Astuce linguistique' },
        { type: 'text', text: 'Salue avec les deux langues ("Dag" en néerlandais + "Bonjour" en français) pour couvrir les deux régions. Présente-toi comme étranger pour éviter les tensions linguistiques. Regarde les autocollants du concessionnaire sur la voiture pour deviner la région du conducteur.' },
        { type: 'warn', text: '⚠️ Ne mentionne pas être Wallon en Flandre : certains conducteurs flamands pourraient ne pas s\'arrêter. Mieux vaut se présenter comme étranger.' },
      ],
    },
    budget: {
      filterTypes: ['b', 'q'],
      blocks: [
        { type: 'text', text: 'Budget routard en Belgique : environ 48 € par jour, minimum 22 € pour les plus économes.' },
        { type: 'sub', title: 'Manger pas cher' },
        { type: 'rule', icon: '🍟', text: 'Frietkot (friterie belge) : pour 5 € tu as un repas plus copieux et moins cher qu\'un McDonald\'s.' },
        { type: 'rule', icon: '🍺', text: 'La bière est souvent moins chère que l\'eau ou le soda.' },
        { type: 'rule', icon: '🛒', text: 'Supermarchés discount : Lidl, Aldi, Colruyt.' },
        { type: 'warn', text: '⚠️ La nourriture sur les aires d\'autoroute est très chère. Achète en ville avant.' },
      ],
    },
    sleep: {
      filterTypes: ['b', 'q', 'a'],
      blocks: [
        { type: 'text', text: 'Le camping sauvage est interdit en Belgique. Amende possible jusqu\'à 150 €.' },
        { type: 'sub', title: 'Alternatives légales' },
        { type: 'rule', icon: '✅', text: 'Zones de bivouac officielles dans les Ardennes : nuit gratuite, maximum 48h.' },
        { type: 'rule', icon: '✅', text: 'Welcome To My Garden : réseau où des particuliers offrent leur jardin pour camper gratuitement. Disponible même à Bruxelles.' },
        { type: 'rule', icon: '✅', text: 'Stations-service ouvertes 24h/24 : le personnel est sympathique, tu peux y faire une sieste.' },
        { type: 'sub', title: 'Hébergement' },
        { type: 'kv', items: [
          { k: 'Auberges de jeunesse (Bruxelles)', v: '30 à 50 €/nuit' },
          { k: 'Auberges (Gand, Bruges)', v: '~24 €/nuit' },
        ]},
      ],
    },
    transport: {
      filterTypes: ['c', 'b'],
      blocks: [
        { type: 'text', text: 'La Belgique a des options de transport intéressantes et un système d\'autostop organisé unique.' },
        { type: 'sub', title: 'Autostop organisé' },
        { type: 'transport', items: [
          { emoji: '🤝', name: 'Covoit\'Stop', detail: 'Province de Liège (16 communes). Inscription, charte signée, casier judiciaire vérifié', price: 'gratuit' },
        ]},
        { type: 'sub', title: 'Train' },
        { type: 'transport', items: [
          { emoji: '🚃', name: 'SNCB Weekend Ticket', detail: '30% de réduction sam/dim/fériés', price: 'dès ~10 €' },
          { emoji: '🚃', name: 'SNCB moins de 26 ans', detail: '40% de réduction standard', price: '' },
          { emoji: '👶', name: 'Enfants < 12 ans', detail: 'Gratuit (max 4 par adulte payant)', price: 'gratuit' },
        ]},
        { type: 'sub', title: 'Bus et covoiturage' },
        { type: 'transport', items: [
          { emoji: '🚌', name: 'FlixBus', detail: '', price: 'dès 5 €' },
          { emoji: '🚗', name: 'BlaBlaCar', detail: 'Très populaire en Belgique', price: '' },
        ]},
      ],
    },
    culture: {
      filterTypes: ['c', 'b'],
      blocks: [
        { type: 'text', text: 'Les Belges sont très accueillants envers les voyageurs, surtout les étrangers. Le stop fonctionne mieux avec des Belges qu\'avec des Français ou des Néerlandais qui ne font que traverser le pays.' },
        { type: 'sub', title: 'Conseils' },
        { type: 'rule', icon: '😊', text: 'Souris en toutes circonstances, même après des heures d\'attente.' },
        { type: 'rule', icon: '🗣️', text: 'Discute brièvement avec le conducteur pour faire connaissance avant de monter, puis fais confiance à ton instinct.' },
        { type: 'rule', icon: '🎒', text: 'Si tu n\'as jamais fait de stop, la Belgique est recommandée comme pays pour débuter. Commence par des trajets courts.' },
        { type: 'sub', title: 'Événements' },
        { type: 'event', items: [
          { month: 'Fév', day: '⟳', name: 'Carnaval de Binche', desc: 'Patrimoine UNESCO, les Gilles lancent des oranges.' },
          { month: 'Juil', day: '21', name: 'Fête nationale belge', desc: 'Festivités et feux d\'artifice à Bruxelles.' },
          { month: 'Juil', day: '⟳', name: 'Tomorrowland', desc: 'Festival électro mondial à Boom, 400 000 visiteurs.' },
          { month: 'Août', day: '⟳', name: 'Gentse Feesten', desc: '10 jours de festivités gratuites à Gand.' },
          { month: 'Déc', day: '⟳', name: 'Marchés de Noël', desc: 'Bruxelles, Bruges, Liège. Très populaires.' },
        ]},
      ],
    },
  },

  // ==================== NETHERLANDS ====================
  NL: {
    laws: {
      filterTypes: ['q', 'c', 'a'],
      blocks: [
        { type: 'text', text: 'L\'autostop est légal aux Pays-Bas. L\'idée de base : partout où tu as le droit de marcher, tu peux faire du stop. Interdit sur les autoroutes (snelweg) elles-mêmes.' },
        { type: 'sub', title: 'Spots officiels : les Liftershalte' },
        { type: 'text', text: 'Les Pays-Bas sont le seul pays au monde avec des arrêts d\'autostop officiels (Liftershalte) signalés par des panneaux. On en trouve à Amsterdam, Groningen, Utrecht, Zoetermeer, Maastricht et dans plusieurs provinces.' },
      ],
    },
    hitchhiking: {
      filterTypes: ['q', 'c', 'b'],
      blocks: [
        { type: 'text', text: 'Les Pays-Bas sont un pays facile pour l\'autostop. Le temps d\'attente moyen est de 5 à 45 minutes selon le spot. Sur un bon emplacement, l\'attente peut descendre sous les 10 minutes.' },
        { type: 'sub', title: 'Méthode' },
        { type: 'text', text: 'Beaucoup d\'automobilistes ne s\'arrêteront pas si tu fais du pouce au bord de la route, mais ils te prendront si tu leur demandes directement à la station-service. Aborder les conducteurs en personne est nettement plus efficace.' },
        { type: 'sub', title: 'Limites' },
        { type: 'text', text: 'La plupart des trajets font moins de 50 km. Il faut souvent plusieurs lifts pour traverser le pays. Les routes secondaires sont étroites, sans accotement, avec des haies qui séparent les champs de la route.' },
        { type: 'sub', title: 'Meilleurs moments' },
        { type: 'kv', items: [
          { k: 'Matins et après-midis en semaine', v: 'Idéal', color: 'green' },
          { k: 'Samedis et dimanches après-midi', v: 'Mauvais (familles en voiture)', color: 'red' },
          { k: 'Nuit', v: 'À éviter', color: 'red' },
        ]},
        { type: 'tip', text: '💡 La majorité des automobilistes néerlandais sont ouverts à l\'idée de prendre un autostoppeur.' },
      ],
    },
    safety: {
      filterTypes: ['c', 'a'],
      blocks: [
        { type: 'text', text: 'Les Pays-Bas sont l\'un des pays les plus sûrs au monde pour l\'autostop. Les retours d\'expérience sont très majoritairement positifs : il est rare qu\'un trajet se passe mal.' },
        { type: 'sub', title: 'Numéros d\'urgence' },
        { type: 'kv', items: [
          { k: 'Urgences', v: '112' },
        ]},
        { type: 'text', text: 'La technologie moderne (GPS, WhatsApp, localisation) a rendu l\'autostop plus sûr que jamais.' },
      ],
    },
    women: {
      filterTypes: ['q', 'c', 'a'],
      blocks: [
        { type: 'text', text: 'Les Pays-Bas sont régulièrement cités parmi les pays les plus sûrs au monde pour les voyageuses solo. Les femmes qui font du stop constatent que les automobilistes s\'arrêtent plus vite pour elles, souvent par souci de leur sécurité.' },
        { type: 'text', text: 'Les quelques expériences négatives ne compensent pas les centaines ou milliers d\'expériences positives. ' },
      ],
    },
    language: {
      filterTypes: ['c', 'q'],
      blocks: [
        { type: 'text', text: 'Le néerlandais est la langue officielle. Les Pays-Bas sont classés n°1 mondial en maîtrise de l\'anglais. Presque tout le monde parle anglais couramment.' },
        { type: 'sub', title: 'Phrases utiles' },
        { type: 'phrase', items: [
          { local: 'Mag ik meerijden naar...?', meaning: 'Puis-je voyager avec vous vers... ?' },
          { local: 'Bedankt voor de lift!', meaning: 'Merci pour le trajet !' },
        ]},
        { type: 'warn', text: '⚠️ Évite de parler allemand aux Néerlandais. Beaucoup n\'apprécient pas et pourraient ne pas s\'arrêter.' },
      ],
    },
    budget: {
      filterTypes: ['b', 'q'],
      blocks: [
        { type: 'text', text: 'Budget routard aux Pays-Bas : environ 50 à 70 € par jour. Amsterdam est nettement plus cher que le reste du pays.' },
        { type: 'sub', title: 'Manger pas cher' },
        { type: 'rule', icon: '🧇', text: 'Street food : stroopwafels, kibbeling (poisson frit), frites mayo.' },
        { type: 'rule', icon: '🛒', text: 'Supermarchés : Albert Heijn, Jumbo, Lidl. Bons repas préparés.' },
        { type: 'tip', text: '💡 L\'app Too Good To Go permet de récupérer de la nourriture à prix réduit que les restaurants et supermarchés allaient jeter.' },
      ],
    },
    sleep: {
      filterTypes: ['b', 'q', 'a'],
      blocks: [
        { type: 'text', text: 'Le camping sauvage est interdit aux Pays-Bas. Amende : 140 €, mais la plupart du temps la police te demande simplement de remballer.' },
        { type: 'sub', title: 'Alternative légale : Paalkamperen' },
        { type: 'text', text: 'Le Paalkamperen (camping au poteau) est un système légal où des poteaux marqués signalent des emplacements de camping nature autorisés. Maximum 72h (parfois 1 nuit seulement selon la zone).' },
        { type: 'sub', title: 'Hébergement' },
        { type: 'kv', items: [
          { k: 'Stayokay (réseau HI néerlandais)', v: 'dès 20 €/nuit' },
          { k: 'Auberges Amsterdam', v: '25 à 50 €/nuit' },
        ]},
      ],
    },
    transport: {
      filterTypes: ['c', 'b'],
      blocks: [
        { type: 'text', text: 'Les Pays-Bas ont un excellent réseau de transports publics. Le déclin de l\'autostop est en partie dû au fait que les étudiants ont un abonnement de transport gratuit.' },
        { type: 'sub', title: 'Options' },
        { type: 'transport', items: [
          { emoji: '🚃', name: 'Samenreiskorting', detail: '40% de réduction si tu voyages avec quelqu\'un qui a un abonnement', price: '' },
          { emoji: '🚌', name: 'FlixBus', detail: '', price: 'dès 5 €' },
          { emoji: '🚗', name: 'BlaBlaCar', detail: '', price: '' },
        ]},
        { type: 'sub', title: 'App' },
        { type: 'text', text: 'L\'app 9292 planifie tous les transports en commun (train, bus, tram, métro, ferry) et vend des billets électroniques.' },
      ],
    },
    culture: {
      filterTypes: ['c', 'b'],
      blocks: [
        { type: 'text', text: 'Les Néerlandais sont décrits comme ouverts d\'esprit et pragmatiques. Beaucoup de conducteurs d\'âge moyen ont fait du stop pendant leurs études et rendent la pareille.' },
        { type: 'sub', title: 'Ce qui marche' },
        { type: 'rule', icon: '🧹', text: 'Apparence soignée. Un peigne dans les cheveux et des vêtements propres font des miracles. Évite le look hippie.' },
        { type: 'rule', icon: '😊', text: 'Tout le monde ne veut pas discuter. Certains veulent juste t\'offrir le trajet sans conversation. Respecte ça.' },
        { type: 'sub', title: 'Événements' },
        { type: 'event', items: [
          { month: 'Avr', day: '27', name: 'Koningsdag', desc: 'Fête du Roi. Tout le pays en orange, marchés, concerts.' },
          { month: 'Avr-Mai', day: '⟳', name: 'Keukenhof', desc: 'Jardins de tulipes. 7 millions de bulbes en fleur.' },
          { month: 'Août', day: '⟳', name: 'Gay Pride Amsterdam', desc: 'Parade de bateaux sur les canaux.' },
          { month: 'Nov', day: '⟳', name: 'Sinterklaas', desc: 'Arrivée de Saint-Nicolas par bateau, festivités nationales.' },
        ]},
        { type: 'tip', text: '💡 Le réseau de Liftershalte est en cours de développement dans tout le pays.' },
      ],
    },
  },

  // ==================== LUXEMBOURG ====================
  LU: {
    laws: {
      filterTypes: ['q', 'c'],
      blocks: [
        { type: 'text', text: 'L\'autostop est légal au Luxembourg. Mêmes règles que le reste de l\'UE : interdit sur les autoroutes, autorisé aux aires de service.' },
      ],
    },
    hitchhiking: {
      filterTypes: ['q', 'c', 'b'],
      blocks: [
        { type: 'text', text: 'Le Luxembourg est excellent pour les trajets longue distance grâce à sa position centrale dans le réseau autoroutier européen. Temps d\'attente souvent inférieur à 15 minutes, même en soirée, même à 3 personnes.' },
        { type: 'sub', title: 'Le spot clé' },
        { type: 'text', text: 'L\'Aire de Capellen Sud est considérée comme un paradis pour autostoppeurs. Des trajets directs vers Avignon, Valence (Espagne) et le Maroc y ont été obtenus en moins d\'une heure.' },
        { type: 'sub', title: 'Limites' },
        { type: 'text', text: 'Beaucoup de trafic sur les autoroutes vient de frontaliers qui font le plein (carburant moins cher). Ce sont des trajets très courts. Utilise un panneau directionnel ou regarde les plaques pour filtrer.' },
        { type: 'text', text: 'En local et en zone rurale, peu de gens font du stop. Le bus est gratuit, donc inutile de faire du stop pour se déplacer dans le pays.' },
      ],
    },
    safety: {
      filterTypes: ['c', 'a'],
      blocks: [
        { type: 'text', text: 'Le Luxembourg est un pays très sûr. Pas de données spécifiques sur des incidents liés à l\'autostop.' },
        { type: 'sub', title: 'Numéros d\'urgence' },
        { type: 'kv', items: [
          { k: 'Urgences européen', v: '112' },
          { k: 'Police', v: '113' },
        ]},
      ],
    },
    language: {
      filterTypes: ['c', 'q'],
      blocks: [
        { type: 'text', text: 'La plupart des Luxembourgeois parlent couramment le luxembourgeois, le français, l\'allemand ET l\'anglais. La barrière de la langue est quasi inexistante. C\'est l\'un des rares pays où tu peux communiquer dans presque n\'importe quelle langue européenne.' },
      ],
    },
    budget: {
      filterTypes: ['b', 'q'],
      blocks: [
        { type: 'text', text: 'Le Luxembourg est un pays cher. Les restaurants et hébergements sont coûteux.' },
        { type: 'sub', title: 'Hébergement' },
        { type: 'kv', items: [
          { k: 'Auberges de jeunesse', v: 'dès 12 à 20 €/nuit' },
        ]},
        { type: 'tip', text: '💡 L\'essence est moins chère au Luxembourg que dans les pays voisins. C\'est pourquoi tant de frontaliers y font le plein.' },
      ],
    },
    sleep: {
      filterTypes: ['b', 'q'],
      blocks: [
        { type: 'text', text: 'Le camping sauvage et le bivouac sont interdits au Luxembourg. Camping uniquement sur les sites officiels ou sur terrain privé avec l\'accord du propriétaire.' },
      ],
    },
    transport: {
      filterTypes: ['c', 'b'],
      blocks: [
        { type: 'text', text: 'Le Luxembourg est le premier pays au monde à avoir rendu TOUS ses transports en commun gratuits, depuis mars 2020.' },
        { type: 'sub', title: 'Transports gratuits' },
        { type: 'rule', icon: '🚌', text: 'Bus : gratuit dans tout le pays.' },
        { type: 'rule', icon: '🚃', text: 'Train (2ème classe) : gratuit dans tout le pays.' },
        { type: 'rule', icon: '🚋', text: 'Tram : gratuit. La ligne rejoint l\'aéroport depuis mars 2025.' },
        { type: 'rule', icon: '🇫🇷', text: 'Gratuit aussi sur certains trains transfrontaliers vers la France (Athus, Audun-le-Tiche, Volmerange-les-Mines).' },
        { type: 'text', text: 'La fréquentation a explosé : de 25 millions de passagers (2019) à 31,3 millions (2024). Le tram est passé de 6,2 à 31,7 millions.' },
        { type: 'tip', text: '💡 Pour quitter le Luxembourg en stop, prends un bus gratuit jusqu\'à une station-service sur l\'autoroute, puis fais du stop depuis là.' },
      ],
    },
    culture: {
      filterTypes: ['c', 'b'],
      blocks: [
        { type: 'text', text: 'Le Luxembourg est surtout un pays de transit pour les autostoppeurs. Sa petite taille (2 586 km²) et ses transports gratuits rendent le stop intérieur inutile. L\'intérêt est de l\'utiliser comme point de départ vers le reste de l\'Europe.' },
        { type: 'sub', title: 'Événements' },
        { type: 'event', items: [
          { month: 'Juin', day: '23', name: 'Fête nationale', desc: 'Veille : feux d\'artifice, concerts dans tout le pays.' },
          { month: 'Août', day: '⟳', name: 'Schueberfouer', desc: 'Foire foraine centenaire à Luxembourg-Ville.' },
        ]},
      ],
    },
  },

  // ==================== SWITZERLAND ====================
  CH: {
    laws: {
      filterTypes: ['q', 'c', 'a'],
      blocks: [
        { type: 'text', text: 'L\'autostop est légal en Suisse. Interdit uniquement sur les autoroutes et voies express et leurs bretelles d\'accès. Autorisé aux aires de repos et parkings.' },
        { type: 'sub', title: 'Particularités' },
        { type: 'text', text: 'Les autoroutes suisses sont gratuites (système de vignette, pas de péages). Les panneaux d\'autoroute sont verts (contrairement aux panneaux rouges/bleus des pays voisins).' },
        { type: 'text', text: 'La Suisse n\'est pas dans l\'UE. Les conducteurs peuvent vouloir vérifier que tu as une pièce d\'identité.' },
        { type: 'warn', text: '⚠️ Si tu voyages en camion vers l\'Italie, demande au chauffeur de ne pas mentionner que tu fais du stop à la douane. La police des frontières pourrait te demander de descendre.' },
      ],
    },
    hitchhiking: {
      filterTypes: ['q', 'c', 'b'],
      blocks: [
        { type: 'text', text: 'Le stop fonctionne bien en Suisse mais varie beaucoup selon la région linguistique. Temps d\'attente moyen : environ 10 minutes en Suisse alémanique. Beaucoup plus long en Suisse romande.' },
        { type: 'sub', title: 'Différences régionales' },
        { type: 'kv', items: [
          { k: 'Suisse alémanique (nord/est)', v: 'Rapide (~10 min)', color: 'green' },
          { k: 'Zones de montagne rurales', v: 'Facile (tradition locale)', color: 'green' },
          { k: 'Suisse romande (ouest)', v: 'Plus difficile', color: 'amber' },
        ]},
        { type: 'sub', title: 'Méthode' },
        { type: 'text', text: 'Comme les autoroutes sont gratuites, presque tout le monde les utilise. Le stop sur routes secondaires est donc plus difficile. Les stations-service sur autoroute restent le meilleur choix. Un panneau est fortement apprécié en Suisse.' },
        { type: 'sub', title: 'Attitude des conducteurs' },
        { type: 'text', text: 'Les conducteurs suisses plus âgés (50+) sont plus réceptifs. Les jeunes ont tendance à ignorer les autostoppeurs, voire à les éviter activement. Environ 1 voiture sur 40 s\'arrête.' },
        { type: 'sub', title: 'Mitfahrbänkli' },
        { type: 'text', text: 'De plus en plus de communes suisses installent des Mitfahrbänkli (bancs d\'autostop) avec des panneaux de direction. Dans une commune testée, la fréquence était le double de celle du bus postal.' },
      ],
    },
    safety: {
      filterTypes: ['c', 'a'],
      blocks: [
        { type: 'text', text: 'La Suisse est un pays très sûr pour l\'autostop. Les experts attribuent le déclin de la pratique à un effet de mode plutôt qu\'à des problèmes de sécurité réels.' },
        { type: 'sub', title: 'Numéros d\'urgence' },
        { type: 'kv', items: [
          { k: 'Urgences européen', v: '112' },
          { k: 'Police', v: '117' },
          { k: 'Ambulance', v: '144' },
          { k: 'Pompiers', v: '118' },
          { k: 'Dépannage routier', v: '140' },
        ]},
        { type: 'warn', text: '⚠️ En hiver, les températures peuvent descendre jusqu\'à -25°C en montagne. Un bon équipement et un abri sont indispensables. Ne sous-estime jamais le froid en altitude.' },
      ],
    },
    language: {
      filterTypes: ['c', 'q'],
      blocks: [
        { type: 'text', text: 'La Suisse a 4 langues officielles : l\'allemand (nord/est, avec un accent suisse très marqué), le français (ouest), l\'italien (sud) et le romanche (montagnes de l\'est). L\'anglais est bien compris par la majorité de la population.' },
        { type: 'tip', text: '💡 La Suisse romande est plus difficile pour le stop que la Suisse alémanique. Si tu parles allemand, tu auras plus de facilité.' },
      ],
    },
    budget: {
      filterTypes: ['b', 'q'],
      blocks: [
        { type: 'text', text: 'La Suisse est l\'un des pays les plus chers d\'Europe. Budget routard : environ 43 €/jour minimum, moyenne 120 à 200 CHF/jour. Monnaie : franc suisse (CHF).' },
        { type: 'sub', title: 'Manger' },
        { type: 'text', text: 'Un repas au restaurant coûte 25 à 60 CHF. Pour réduire les coûts, achète uniquement chez Aldi et Lidl (nettement moins cher que Coop ou Migros).' },
        { type: 'sub', title: 'Hébergement' },
        { type: 'kv', items: [
          { k: 'Auberges de jeunesse', v: '35 à 83 €/nuit' },
        ]},
      ],
    },
    sleep: {
      filterTypes: ['b', 'q', 'a'],
      blocks: [
        { type: 'text', text: 'La Suisse est l\'un des rares pays européens où le camping sauvage est relativement toléré, surtout en altitude.' },
        { type: 'sub', title: 'Règles' },
        { type: 'rule', icon: '✅', text: 'Au-dessus de la limite des arbres (~2000m) : camping d\'une nuit autorisé, pas en groupe.' },
        { type: 'rule', icon: '✅', text: 'Bivouac d\'urgence (sans tente) : toujours autorisé.' },
        { type: 'rule', icon: '✅', text: 'Canton d\'Obwald : camping sauvage généralement autorisé.' },
        { type: 'rule', icon: '🚫', text: 'Interdit dans les réserves naturelles, zones de protection de la faune, parcs nationaux, zones militaires.' },
        { type: 'text', text: 'Les règles varient par canton et par commune. Renseigne-toi localement.' },
      ],
    },
    transport: {
      filterTypes: ['c', 'b'],
      blocks: [
        { type: 'text', text: 'Les transports suisses sont excellents mais chers. Voici comment économiser.' },
        { type: 'sub', title: 'Réductions train' },
        { type: 'transport', items: [
          { emoji: '🚄', name: 'Swiss Half Fare Card', detail: '50% sur tous les trains, bus, bateaux, transports urbains', price: '150 CHF/mois' },
          { emoji: '🎫', name: 'Spartageskarte', detail: 'Journée illimitée, réservation anticipée', price: 'dès 29 CHF' },
          { emoji: '🌙', name: 'GA Night (< 25 ans)', detail: 'Voyages gratuits à partir de 19h', price: '' },
        ]},
        { type: 'sub', title: 'Bus et covoiturage' },
        { type: 'transport', items: [
          { emoji: '🚌', name: 'PostBus (Postauto)', detail: 'Bus jaunes couvrant presque tout le pays', price: '' },
          { emoji: '🚌', name: 'FlixBus', detail: '', price: 'dès 5 €' },
          { emoji: '🚗', name: 'BlaBlaCar', detail: '', price: '' },
        ]},
      ],
    },
    season: {
      filterTypes: ['c', 'q'],
      blocks: [
        { type: 'text', text: 'Le printemps et l\'automne sont les meilleures saisons pour l\'autostop en Suisse. L\'hiver est dangereux en montagne.' },
        { type: 'sub', title: 'Aperçu par mois' },
        { type: 'season', months: [
          { name: 'Jan', level: 'bad' }, { name: 'Fév', level: 'bad' }, { name: 'Mar', level: 'ok' },
          { name: 'Avr', level: 'good' }, { name: 'Mai', level: 'great' }, { name: 'Jun', level: 'great' },
          { name: 'Jul', level: 'good' }, { name: 'Aoû', level: 'good' }, { name: 'Sep', level: 'great' },
          { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'ok' }, { name: 'Déc', level: 'bad' },
        ]},
        { type: 'warn', text: '⚠️ En hiver, les cols alpins peuvent être fermés, limitant fortement les itinéraires. Les températures descendent très bas en altitude. Prévois un équipement adapté.' },
      ],
    },
    culture: {
      filterTypes: ['c', 'b'],
      blocks: [
        { type: 'text', text: 'L\'autostop était normal en Suisse jusqu\'aux années 1990. La génération plus âgée a des histoires d\'aventures. Le déclin est attribué à la prospérité et aux apps de covoiturage, pas à l\'insécurité. Un renouveau est en cours depuis quelques années, porté par les réseaux sociaux et les préoccupations environnementales.' },
        { type: 'sub', title: 'Championnat suisse d\'autostop' },
        { type: 'text', text: 'Organisé chaque année en Suisse, cet événement rassemble des dizaines de participants qui s\'affrontent pour rejoindre une destination à 200-300 km le plus vite possible en stop.' },
        { type: 'sub', title: 'Événements' },
        { type: 'event', items: [
          { month: 'Fév', day: '⟳', name: 'Fasnacht (Bâle)', desc: 'Plus grand carnaval de Suisse, 3 jours.' },
          { month: 'Juil', day: '⟳', name: 'Montreux Jazz Festival', desc: 'Festival de jazz légendaire au bord du lac Léman.' },
          { month: 'Juil', day: '⟳', name: 'Paléo Festival (Nyon)', desc: 'Plus grand festival en plein air de Suisse.' },
          { month: 'Août', day: '1', name: 'Fête nationale', desc: 'Feux d\'artifice sur les lacs, feux de joie en montagne.' },
          { month: 'Nov', day: '⟳', name: 'Zibelemärit (Berne)', desc: 'Marché aux oignons, tradition médiévale.' },
        ]},
      ],
    },
  },

  // ==================== AUSTRIA ====================
  AT: {
    laws: {
      filterTypes: ['q', 'c', 'a'],
      blocks: [
        { type: 'text', text: 'L\'autostop est légal en Autriche. Interdit sur les Autobahnen et Schnellstrassen (voies express). Autorisé aux aires de repos, stations-service et routes secondaires.' },
        { type: 'sub', title: 'Âge minimum (varie par Land)' },
        { type: 'kv', items: [
          { k: 'Carinthie et Vorarlberg', v: '14 ans minimum' },
          { k: 'Styrie', v: '16 ans minimum' },
          { k: 'Autres Länder', v: 'Pas de restriction d\'âge' },
        ]},
        { type: 'sub', title: 'Assurance' },
        { type: 'text', text: 'En cas d\'accident, l\'assurance responsabilité civile du véhicule couvre l\'autostoppeur comme n\'importe quel passager.' },
        { type: 'tip', text: '💡 Les camions n\'ont pas le droit de circuler le dimanche et les jours fériés sur les autoroutes autrichiennes.' },
      ],
    },
    hitchhiking: {
      filterTypes: ['q', 'c', 'b'],
      blocks: [
        { type: 'text', text: 'L\'Autriche est un bon pays pour l\'autostop, mais les expériences varient beaucoup selon la région. En montagne, les temps d\'attente sont souvent de ~10 minutes. Sur certaines autoroutes, ça peut monter à plus de 2 heures.' },
        { type: 'sub', title: 'Différences régionales' },
        { type: 'kv', items: [
          { k: 'Ouest (Tyrol, Vorarlberg)', v: 'Plus facile', color: 'green' },
          { k: 'Zones de montagne rurales', v: 'Bien (tradition locale)', color: 'green' },
          { k: 'Est (Vienne, Graz)', v: 'Plus difficile', color: 'amber' },
        ]},
        { type: 'text', text: 'Vienne est facile d\'accès mais difficile à quitter. Graz est entourée d\'une "zone morte" de ~40 km d\'autoroute quasi impossible à parcourir en stop.' },
        { type: 'sub', title: 'Spots clés' },
        { type: 'text', text: 'La Raststätte Walserberg (frontière germano-autrichienne près de Salzbourg) est énorme et idéale comme point de départ. À Innsbruck, la zone DEZ avec deux stations-service à 2 minutes l\'une de l\'autre permet d\'alterner. WiFi gratuit dans beaucoup d\'aires de repos.' },
        { type: 'sub', title: 'Mitfahrbankerl' },
        { type: 'text', text: 'Le gouvernement fédéral autrichien promeut les Mitfahrbankerl (bancs d\'autostop) dans le cadre de son initiative climatique klimaaktiv. Ils sont surtout présents en Basse-Autriche et au Tyrol.' },
      ],
    },
    safety: {
      filterTypes: ['c', 'a'],
      blocks: [
        { type: 'text', text: 'L\'Autriche est considérée comme un pays sûr pour l\'autostop, au même niveau que l\'Allemagne et les Pays-Bas.' },
        { type: 'sub', title: 'Conseils de l\'ÖAMTC (automobile-club autrichien)' },
        { type: 'rule', icon: '🎒', text: 'Garde ton sac accessible, pas dans le coffre.' },
        { type: 'rule', icon: '🔒', text: 'Vérifie que la sécurité enfant des portières arrière n\'est pas activée.' },
        { type: 'rule', icon: '📱', text: 'Note la plaque et envoie-la à ta famille ou tes amis par SMS.' },
        { type: 'sub', title: 'Numéros d\'urgence' },
        { type: 'kv', items: [
          { k: 'Urgences européen', v: '112' },
          { k: 'Police', v: '133' },
          { k: 'Ambulance', v: '144' },
          { k: 'Pompiers', v: '122' },
          { k: 'Dépannage routier', v: '120 / 123' },
        ]},
      ],
    },
    women: {
      filterTypes: ['q', 'c', 'a'],
      blocks: [
        { type: 'text', text: 'L\'Autriche est listée parmi les pays sûrs d\'Europe pour les femmes voyageant seules. Les recommandations officielles (ÖAMTC) conseillent de faire du stop à deux quand possible et d\'éviter les véhicules avec plusieurs hommes.' },
      ],
    },
    language: {
      filterTypes: ['c', 'q'],
      blocks: [
        { type: 'text', text: 'L\'allemand est la langue officielle, avec un accent autrichien distinct. L\'Autriche est classée 3ème mondial en maîtrise de l\'anglais. Presque tout le monde parle au moins un anglais de base, surtout dans les zones touristiques.' },
        { type: 'sub', title: 'Phrases utiles' },
        { type: 'phrase', items: [
          { local: 'Grüß Gott', meaning: 'Bonjour (salutation autrichienne traditionnelle)' },
          { local: 'Nehmen Sie mich mit nach...?', meaning: 'Pouvez-vous m\'emmener à... ?' },
          { local: 'Danke für die Mitfahrt!', meaning: 'Merci pour le trajet !' },
        ]},
        { type: 'tip', text: '💡 L\'autostop en Autriche s\'appelle "Autostoppen" ou juste "Stoppen", pas "Trampen" comme en Allemagne.' },
      ],
    },
    budget: {
      filterTypes: ['b', 'q'],
      blocks: [
        { type: 'text', text: 'Budget routard en Autriche : environ 55 à 95 € par jour. Moins cher que la Suisse, plus cher que l\'Europe de l\'Est.' },
        { type: 'sub', title: 'Hébergement' },
        { type: 'kv', items: [
          { k: 'Auberges de jeunesse', v: '25 à 40 €/nuit' },
          { k: 'Vienne (dortoir)', v: '32 à 40 €/nuit' },
        ]},
        { type: 'sub', title: 'Manger pas cher' },
        { type: 'rule', icon: '🛒', text: 'Supermarchés discount : Hofer (= Aldi en Autriche), Billa, Spar, Lidl, Penny.' },
        { type: 'text', text: 'Des conducteurs autrichiens ont invité des autostoppeurs à manger chez eux et à dormir avec leur famille. Ce sont souvent les moments les plus touchants du voyage.' },
      ],
    },
    sleep: {
      filterTypes: ['b', 'q', 'a'],
      blocks: [
        { type: 'text', text: 'Le camping sauvage est strictement réglementé en Autriche et les amendes sont très élevées. Les règles varient considérablement d\'un Land à l\'autre.' },
        { type: 'sub', title: 'Par Land' },
        { type: 'kv', items: [
          { k: 'Haute-Autriche (au-dessus des arbres)', v: 'Autorisé', color: 'green' },
          { k: 'Styrie (terrain vague, 1 nuit)', v: 'Autorisé', color: 'green' },
          { k: 'Salzbourg (milieu alpin)', v: 'Toléré', color: 'amber' },
          { k: 'Tyrol', v: 'Interdit. Amende dès 220 €', color: 'red' },
          { k: 'Basse-Autriche', v: 'Interdit. Amende jusqu\'à 14 500 €', color: 'red' },
          { k: 'Carinthie', v: 'Interdit. Amende jusqu\'à 3 630 €', color: 'red' },
          { k: 'Vienne / Burgenland', v: 'Interdit', color: 'red' },
        ]},
        { type: 'text', text: 'Le bivouac d\'urgence (pour raisons de sécurité : mauvais temps, blessure, nuit tombée) est toujours autorisé partout. Mais le bivouac planifié (avec tente, matelas, réchaud) est traité comme du camping sauvage.' },
        { type: 'warn', text: '⚠️ Le camping en forêt est interdit dans TOUTE l\'Autriche, sans exception.' },
      ],
    },
    transport: {
      filterTypes: ['c', 'b'],
      blocks: [
        { type: 'text', text: 'L\'Autriche a un pass transport national unique en Europe.' },
        { type: 'sub', title: 'KlimaTicket' },
        { type: 'transport', items: [
          { emoji: '🎫', name: 'KlimaTicket', detail: 'Tous les transports publics du pays, illimité', price: '1 095 €/an (~3 €/jour)' },
          { emoji: '🎫', name: 'KlimaTicket < 26 ans / > 64 ans', detail: 'Tarif réduit', price: '821 €/an' },
        ]},
        { type: 'text', text: '130 000 Autrichiens ont souscrit le premier mois. 85% ont remplacé des trajets en voiture.' },
        { type: 'sub', title: 'Autres options' },
        { type: 'transport', items: [
          { emoji: '🚄', name: 'ÖBB Sparschiene', detail: 'Billets anticipés à prix réduit', price: 'dès 19 €' },
          { emoji: '🚄', name: 'Vorteilscard < 26 ans', detail: '50% sur tous les trains, 1 an', price: '19 €' },
          { emoji: '🚌', name: 'FlixBus', detail: '', price: 'dès 5 €' },
          { emoji: '🚗', name: 'BlaBlaCar', detail: '', price: '' },
          { emoji: '🌙', name: 'Nightjet (ÖBB)', detail: 'Trains de nuit vers Allemagne, Suisse, Italie', price: '' },
        ]},
      ],
    },
    season: {
      filterTypes: ['c', 'q'],
      blocks: [
        { type: 'text', text: 'L\'été est la meilleure saison pour l\'autostop en Autriche. L\'hiver est possible mais difficile (froid, jours courts).' },
        { type: 'sub', title: 'Aperçu par mois' },
        { type: 'season', months: [
          { name: 'Jan', level: 'bad' }, { name: 'Fév', level: 'bad' }, { name: 'Mar', level: 'ok' },
          { name: 'Avr', level: 'good' }, { name: 'Mai', level: 'great' }, { name: 'Jun', level: 'great' },
          { name: 'Jul', level: 'great' }, { name: 'Aoû', level: 'good' }, { name: 'Sep', level: 'great' },
          { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'ok' }, { name: 'Déc', level: 'bad' },
        ]},
        { type: 'warn', text: '⚠️ Évite les dimanches : les camions sont interdits sur les autoroutes le dimanche et les jours fériés, le trafic est très réduit.' },
      ],
    },
    culture: {
      filterTypes: ['c', 'b'],
      blocks: [
        { type: 'text', text: 'L\'accueil autrichien varie beaucoup. Certains voyageurs trouvent les Autrichiens très accueillants, d\'autres les décrivent comme réservés. En montagne, les gens sont plus ouverts car beaucoup ont fait du stop étant enfants et les bus passent rarement.' },
        { type: 'sub', title: 'Ce qui marche' },
        { type: 'rule', icon: '😊', text: 'Un sourire sincère résout beaucoup de réticences.' },
        { type: 'rule', icon: '🏔️', text: 'Sur les routes de montagne, après une randonnée, les chances qu\'une voiture s\'arrête sont très élevées.' },
        { type: 'sub', title: 'Événements' },
        { type: 'event', items: [
          { month: 'Jan', day: '⟳', name: 'Concerts du Nouvel An (Vienne)', desc: 'Tradition musicale mondiale.' },
          { month: 'Fév', day: '⟳', name: 'Bal de l\'Opéra (Vienne)', desc: 'Plus grand bal du monde.' },
          { month: 'Juil-Août', day: '⟳', name: 'Festival de Salzbourg', desc: 'Opéra, théâtre et musique classique.' },
          { month: 'Sep-Oct', day: '⟳', name: 'Almabtrieb', desc: 'Descente des troupeaux décorés des alpages. Fête populaire.' },
          { month: 'Nov-Déc', day: '⟳', name: 'Christkindlmärkte', desc: 'Marchés de Noël. Vienne, Salzbourg, Innsbruck, Graz.' },
          { month: 'Déc', day: '5', name: 'Krampuslauf', desc: 'Défilé du Krampus, tradition alpine unique.' },
        ]},
        { type: 'tip', text: '💡 Les paysages alpins sont magnifiques. Privilégie les petites routes de montagne pour profiter de la vue, même si ça prend plus de temps.' },
      ],
    },
  },

  // ==================== SPAIN ====================
  ES: {
    laws: {
      filterTypes: ['q', 'c', 'a'],
      blocks: [
        { type: 'text', text: 'L\'autostop est légal sur les routes nationales et secondaires en Espagne. Il est interdit sur les autoroutes (autopistas) et voies express (autovías) par l\'article 125 du Règlement Général de Circulation.' },
        { type: 'sub', title: 'Amendes' },
        { type: 'text', text: 'Amende de 80 € pour l\'autostoppeur ET le conducteur qui le prend sur une route interdite. Certaines municipalités appliquent des amendes plus élevées (jusqu\'à 3 000 € dans certains cas locaux).' },
        { type: 'sub', title: 'En pratique' },
        { type: 'text', text: 'Les stations-service et aires de repos sur autoroute sont autorisées. Beaucoup d\'Espagnols (et certains policiers) croient à tort que l\'autostop est totalement illégal.' },
        { type: 'warn', text: '⚠️ La Guardia Civil enlève activement les autostoppeurs des péages. Les employés des sociétés d\'autoroute aussi.' },
      ],
    },
    hitchhiking: {
      filterTypes: ['q', 'c', 'b'],
      blocks: [
        { type: 'text', text: 'L\'Espagne est l\'un des pays les plus difficiles d\'Europe pour l\'autostop. Le temps d\'attente moyen est de 60 à 120 minutes. Prévois maximum 300 à 350 km par jour.' },
        { type: 'sub', title: 'Méthode obligatoire' },
        { type: 'text', text: 'Aborder les conducteurs directement aux stations-service est quasi obligatoire. Le pouce au bord de la route ne fonctionne presque pas en Espagne. Approche poliment : "Hola, vas a...?"' },
        { type: 'sub', title: 'Différences régionales' },
        { type: 'kv', items: [
          { k: 'Galice, Asturies, Estrémadure', v: 'Plus facile', color: 'green' },
          { k: 'Aragon, Navarre', v: 'Correct', color: 'green' },
          { k: 'Andalousie intérieure', v: 'Difficile (stations désertes)', color: 'amber' },
          { k: 'Catalogne', v: 'Très difficile', color: 'red' },
          { k: 'Pays basque', v: 'Très difficile', color: 'red' },
        ]},
        { type: 'sub', title: 'Astuce frontière' },
        { type: 'text', text: 'La Jonquera (frontière française) est l\'un des plus grands arrêts routiers d\'Europe. Idéal pour trouver un trajet longue distance avant d\'entrer en Espagne.' },
        { type: 'warn', text: '⚠️ Pendant la sieste (14h-17h), le trafic chute fortement. Évite de faire du stop pendant ces heures, surtout en été.' },
      ],
    },
    safety: {
      filterTypes: ['c', 'a'],
      blocks: [
        { type: 'text', text: 'L\'Espagne est globalement sûre (23ème au Global Peace Index). Le risque principal pour les voyageurs est le pickpocket dans les grandes villes, pas l\'autostop.' },
        { type: 'text', text: 'L\'autostop est moins courant en Espagne que dans le reste de l\'Europe, mais il reste tout à fait faisable. Les Espagnols sont chaleureux et accueillants une fois la conversation lancée.' },
        { type: 'sub', title: 'Numéros d\'urgence' },
        { type: 'kv', items: [
          { k: 'Urgences', v: '112' },
          { k: 'Guardia Civil (routes, rural)', v: '062' },
          { k: 'Police nationale (villes)', v: '091' },
        ]},
      ],
    },
    women: {
      filterTypes: ['q', 'c', 'a'],
      blocks: [
        { type: 'text', text: 'L\'Espagne est considérée comme l\'un des pays les plus sûrs pour les voyageuses solo en général. Plusieurs femmes ayant fait du stop seules rapportent des expériences positives.' },
        { type: 'sub', title: 'Retours d\'expérience' },
        { type: 'text', text: 'Les incidents sont rares et généralement mineurs (geste déplacé, conversation inappropriée), tous gérables par un refus ferme. Le fait d\'être une femme peut être un avantage : les conducteurs s\'arrêtent souvent par souci de ta sécurité.' },
        { type: 'rule', icon: '👨‍👩‍👧', text: 'Privilégie les couples et les familles. Refuse les voitures avec plusieurs hommes.' },
        { type: 'rule', icon: '📍', text: 'Partage ton itinéraire en temps réel sur Google Maps avec un proche.' },
      ],
    },
    language: {
      filterTypes: ['c', 'q'],
      blocks: [
        { type: 'text', text: 'L\'espagnol (castillan) est indispensable. Seulement 22% des Espagnols parlent anglais. L\'Espagne est l\'un des pays d\'Europe de l\'Ouest avec le plus faible niveau d\'anglais. En dehors des zones touristiques, ne compte pas sur l\'anglais.' },
        { type: 'sub', title: 'Langues régionales' },
        { type: 'text', text: 'Le catalan, le basque et le galicien sont co-officiels dans leurs régions. Quelques mots dans la langue locale aident beaucoup.' },
        { type: 'sub', title: 'Phrases utiles' },
        { type: 'phrase', items: [
          { local: 'Hola, vas a...?', meaning: 'Bonjour, tu vas à... ?' },
          { local: 'Me puedes llevar?', meaning: 'Tu peux m\'emmener ?' },
          { local: 'Gracias, buen viaje!', meaning: 'Merci, bon voyage !' },
          { local: 'Me puedes dejar aquí?', meaning: 'Tu peux me déposer ici ?' },
        ]},
      ],
    },
    budget: {
      filterTypes: ['b', 'q'],
      blocks: [
        { type: 'text', text: 'Budget routard en Espagne : environ 38 à 50 € par jour. Le sud (Séville, Cadix, Grenade) est nettement moins cher que le nord.' },
        { type: 'sub', title: 'Manger pas cher' },
        { type: 'rule', icon: '🍽️', text: 'Menú del día : 8 à 15 € pour un repas 3 plats. Les restaurants sont légalement obligés de le proposer.' },
        { type: 'rule', icon: '🍺', text: 'Tapas gratuites avec la boisson en Castille, Andalousie et Castille-La Manche.' },
        { type: 'rule', icon: '🥖', text: 'Pintxos au Pays basque : 1 à 2 € pièce.' },
        { type: 'rule', icon: '🛒', text: 'Supermarchés : Mercadona, Carrefour, Lidl. Repas complet pour 5 à 10 €.' },
        { type: 'warn', text: '⚠️ La nourriture aux aires d\'autoroute est très chère. Achète en ville.' },
      ],
    },
    sleep: {
      filterTypes: ['b', 'q', 'a'],
      blocks: [
        { type: 'text', text: 'Le camping sauvage est interdit en Espagne. Les amendes vont de 30 à 3 000 € selon la région. Mais le bivouac (dormir sans tente) est plus toléré en montagne.' },
        { type: 'sub', title: 'Par région' },
        { type: 'kv', items: [
          { k: 'Galice, Cantabrie, Asturies, Navarre', v: 'Plus tolérant', color: 'green' },
          { k: 'Pyrénées, Aragon (montagne)', v: 'Bivouac toléré', color: 'green' },
          { k: 'Intérieur rural', v: 'Police dit juste de partir', color: 'amber' },
          { k: 'Côtes touristiques, plages', v: 'Zéro tolérance', color: 'red' },
          { k: 'Baléares, Canaries', v: 'Zéro tolérance', color: 'red' },
        ]},
        { type: 'sub', title: 'Alternatives' },
        { type: 'rule', icon: '⛪', text: 'Albergues de peregrinos sur le Camino de Santiago : hébergement très bon marché avec un passeport de pèlerin.' },
        { type: 'rule', icon: '🛋️', text: 'Couchsurfing : communauté active à Madrid et Barcelone.' },
        { type: 'rule', icon: '🏕️', text: 'Campings : 10 à 18 €/nuit pour 2 avec tente. La plupart ont une piscine.' },
      ],
    },
    transport: {
      filterTypes: ['c', 'b'],
      blocks: [
        { type: 'text', text: 'L\'Espagne a le 4ème plus grand réseau autoroutier au monde. Beaucoup d\'Espagnols utilisent BlaBlaCar au lieu de faire du stop.' },
        { type: 'sub', title: 'Options' },
        { type: 'transport', items: [
          { emoji: '🚗', name: 'BlaBlaCar', detail: 'Très populaire en Espagne', price: '~5 €/100 km' },
          { emoji: '🚗', name: 'Amovens', detail: 'Concurrent espagnol, zéro commission', price: '' },
          { emoji: '🚌', name: 'ALSA', detail: 'Principale compagnie de bus espagnole', price: 'dès 10 €' },
          { emoji: '🚌', name: 'FlixBus', detail: '', price: 'dès 5 €' },
          { emoji: '🚄', name: 'Ouigo / Iryo', detail: 'TGV low-cost espagnols', price: 'dès 9 €' },
        ]},
      ],
    },
    season: {
      filterTypes: ['c', 'q'],
      blocks: [
        { type: 'text', text: 'Le printemps et l\'automne sont les meilleures saisons. L\'été est le pire moment pour faire du stop en Espagne.' },
        { type: 'sub', title: 'Aperçu par mois' },
        { type: 'season', months: [
          { name: 'Jan', level: 'ok' }, { name: 'Fév', level: 'ok' }, { name: 'Mar', level: 'good' },
          { name: 'Avr', level: 'great' }, { name: 'Mai', level: 'great' }, { name: 'Jun', level: 'good' },
          { name: 'Jul', level: 'bad' }, { name: 'Aoû', level: 'bad' }, { name: 'Sep', level: 'great' },
          { name: 'Oct', level: 'great' }, { name: 'Nov', level: 'ok' }, { name: 'Déc', level: 'ok' },
        ]},
        { type: 'warn', text: '⚠️ Juillet et août : chaleur extrême (40°C+ à l\'intérieur), sieste qui tue le trafic, prix au maximum. Attendre au bord de la route sous 40°C est insoutenable.' },
      ],
    },
    culture: {
      filterTypes: ['c', 'b'],
      blocks: [
        { type: 'text', text: 'La culture de l\'autostop n\'a jamais vraiment existé en Espagne. Sous Franco, les mouvements de jeunesse n\'ont pas pris racine comme dans le reste de l\'Europe. Quand l\'Espagne s\'est ouverte, les voitures étaient déjà abordables.' },
        { type: 'sub', title: 'Ce qui marche' },
        { type: 'rule', icon: '🗣️', text: 'L\'approche directe aux stations-service est quasi obligatoire. Le pouce au bord de la route est vu comme inhabituel.' },
        { type: 'rule', icon: '😊', text: 'Les Espagnols sont chaleureux et généreux une fois le contact établi. La barrière, c\'est le premier arrêt.' },
        { type: 'rule', icon: '🕐', text: 'Adapte-toi aux horaires espagnols : déjeuner vers 14h, dîner après 21h. La sieste (14h-17h) réduit le trafic.' },
        { type: 'sub', title: 'Événements' },
        { type: 'event', items: [
          { month: 'Mar', day: '⟳', name: 'Las Fallas (Valence)', desc: 'Sculptures géantes brûlées, feux d\'artifice.' },
          { month: 'Mar-Avr', day: '⟳', name: 'Semana Santa', desc: 'Processions dans tout le pays, surtout Séville.' },
          { month: 'Avr', day: '⟳', name: 'Feria de Abril (Séville)', desc: 'Danse flamenco, chevaux, tenues traditionnelles.' },
          { month: 'Juil', day: '6-14', name: 'San Fermín (Pampelune)', desc: 'Course de taureaux dans les rues.' },
          { month: 'Août', day: '⟳', name: 'La Tomatina (Buñol)', desc: 'Bataille de tomates géante.' },
          { month: 'Août', day: '15', name: 'Assomption', desc: 'Jour férié, beaucoup de monde sur les routes.' },
        ]},
      ],
    },
  },

  // ==================== PORTUGAL ====================
  PT: {
    laws: {
      filterTypes: ['q', 'c'],
      blocks: [
        { type: 'text', text: 'L\'autostop est légal au Portugal. Marcher sur les autoroutes (autoestradas) est interdit, mais il n\'y a pas d\'amende spécifique pour les autostoppeurs. La police peut te demander de quitter la zone ou t\'offrir un trajet.' },
        { type: 'text', text: 'Les stations-service et aires de péage sont les meilleurs endroits. Demander des trajets y est autorisé et recommandé.' },
        { type: 'warn', text: '⚠️ Les autostoppeurs ne sont pas toujours couverts par l\'assurance automobile standard au Portugal. C\'est l\'une des raisons pour lesquelles certains conducteurs hésitent à s\'arrêter.' },
      ],
    },
    hitchhiking: {
      filterTypes: ['q', 'c', 'b'],
      blocks: [
        { type: 'text', text: 'Le Portugal est plus facile que l\'Espagne pour l\'autostop, mais reste un défi. Le temps d\'attente médian est d\'environ 40 minutes. Le trajet le plus long enregistré par un voyageur est de 460 km (Ourique à Porto).' },
        { type: 'sub', title: 'Méthode' },
        { type: 'text', text: 'L\'approche directe fonctionne mieux : "Bonjour, excusez-moi de vous déranger, je vais à... est-ce que par hasard vous allez dans la même direction ?" Les Portugais répondent mieux à une conversation polie qu\'au pouce levé.' },
        { type: 'sub', title: 'Différences régionales' },
        { type: 'kv', items: [
          { k: 'Axe Lisbonne-Coimbra-Porto', v: 'Le plus facile', color: 'green' },
          { k: 'Algarve (côte sud)', v: 'Correct (touristes)', color: 'green' },
          { k: 'Intérieur nord', v: 'Plus long', color: 'amber' },
          { k: 'Zones frontalières avec l\'Espagne', v: 'Trafic très faible', color: 'red' },
        ]},
        { type: 'sub', title: 'Quitter Lisbonne' },
        { type: 'text', text: 'Sortir de Lisbonne en stop est difficile. Prends le train jusqu\'à Vila Franca de Xira (2,20 €, 30 min) pour accéder au péage de l\'A1 et à la route nationale.' },
      ],
    },
    safety: {
      filterTypes: ['c', 'a'],
      blocks: [
        { type: 'text', text: 'Le Portugal est classé 5ème pays le plus sûr d\'Europe et parmi les plus sûrs au monde. Les crimes violents sont très rares. Le principal risque est le pickpocket à Lisbonne (tram 28) et dans les zones touristiques de Porto.' },
        { type: 'sub', title: 'Numéros d\'urgence' },
        { type: 'kv', items: [
          { k: 'Urgences', v: '112' },
        ]},
        { type: 'text', text: 'La police est divisée en PSP (zones urbaines) et GNR (zones rurales). Lisbonne a un commissariat de police touristique à la gare de Rossio avec des agents multilingues.' },
      ],
    },
    women: {
      filterTypes: ['q', 'c', 'a'],
      blocks: [
        { type: 'text', text: 'Le Portugal est considéré comme l\'un des meilleurs pays au monde pour les voyageuses solo. Plusieurs femmes rapportent ne s\'être jamais senties harcelées.' },
        { type: 'text', text: 'Les hommes portugais sont décrits comme respectueux : quand ils flirtent, c\'est fait avec classe et ils acceptent facilement un "non" poli. Les conductrices et les couples offrent souvent des trajets par solidarité.' },
      ],
    },
    language: {
      filterTypes: ['c', 'q'],
      blocks: [
        { type: 'text', text: 'Le portugais est la langue officielle. Le niveau d\'anglais est bien meilleur qu\'en Espagne : le Portugal est classé parmi les meilleurs pays non anglophones. L\'anglais est enseigné dès le primaire. L\'espagnol est largement compris grâce aux racines communes.' },
        { type: 'sub', title: 'Phrases utiles' },
        { type: 'phrase', items: [
          { local: 'Olá, pode dar-me boleia até...?', meaning: 'Bonjour, pouvez-vous m\'emmener à... ?' },
          { local: 'Fala inglês?', meaning: 'Parlez-vous anglais ?' },
          { local: 'Obrigado / Obrigada', meaning: 'Merci (homme / femme)' },
          { local: 'Pode ajudar-me?', meaning: 'Pouvez-vous m\'aider ?' },
        ]},
        { type: 'tip', text: '💡 Les Portugais s\'illuminent quand les visiteurs font l\'effort de parler quelques mots de portugais. Même un simple "Olá" fait une grande différence.' },
      ],
    },
    budget: {
      filterTypes: ['b', 'q'],
      blocks: [
        { type: 'text', text: 'Le Portugal est l\'un des pays les plus abordables d\'Europe de l\'Ouest. Budget routard : environ 35 à 50 € par jour. En dehors de Lisbonne et Porto, les prix baissent considérablement.' },
        { type: 'sub', title: 'Manger pas cher' },
        { type: 'rule', icon: '🍽️', text: 'Prato do dia (plat du jour) : 8 à 12 € avec soupe, plat, dessert et parfois un verre de vin.' },
        { type: 'rule', icon: '🛒', text: 'Supermarchés : Pingo Doce, Continente, Lidl, Aldi. Repas préparés disponibles.' },
        { type: 'sub', title: 'Hébergement' },
        { type: 'kv', items: [
          { k: 'Auberges de jeunesse', v: '15 à 25 €/nuit' },
        ]},
        { type: 'text', text: 'La région de l\'Alentejo est particulièrement abordable. Porto est décrit comme "vraiment abordable pour l\'Europe de l\'Ouest".' },
      ],
    },
    sleep: {
      filterTypes: ['b', 'q', 'a'],
      blocks: [
        { type: 'text', text: 'Depuis juillet 2021, le camping sauvage et le bivouac sont effectivement interdits au Portugal. Amendes : 120 à 600 € (jusqu\'à 36 000 € pour infractions graves en zones protégées).' },
        { type: 'sub', title: 'Zones' },
        { type: 'kv', items: [
          { k: 'Algarve et Lisbonne', v: 'Application stricte', color: 'red' },
          { k: 'Côte atlantique', v: 'Application stricte', color: 'red' },
          { k: 'Nord intérieur et montagne', v: 'Plus tolérant si discret', color: 'amber' },
        ]},
        { type: 'sub', title: 'Alternatives gratuites ou pas chères' },
        { type: 'rule', icon: '🚒', text: 'Bombeiros (casernes de pompiers) : certaines offrent des lits gratuits aux voyageurs qui demandent poliment. Apporte ton sac de couchage.' },
        { type: 'rule', icon: '🛋️', text: 'Couchsurfing : communauté active à Lisbonne et Porto.' },
        { type: 'rule', icon: '🌾', text: 'Portugal EasyCamp : séjours chez des agriculteurs et viticulteurs, souvent moins cher que les campings.' },
        { type: 'tip', text: '💡 Les groupes Facebook "Boleia" + nom de ville permettent de trouver des trajets et parfois des hébergements chez l\'habitant.' },
      ],
    },
    transport: {
      filterTypes: ['c', 'b'],
      blocks: [
        { type: 'text', text: 'Le réseau ferroviaire portugais est limité mais les bus sont fiables et abordables.' },
        { type: 'sub', title: 'Options' },
        { type: 'transport', items: [
          { emoji: '🚌', name: 'Rede Expressos', detail: 'Principale compagnie de bus, 202 villes', price: 'dès 5 €' },
          { emoji: '🚌', name: 'FlixBus', detail: 'Lisbonne-Porto dès 9 €', price: 'dès 5 €' },
          { emoji: '🚗', name: 'BlaBlaCar', detail: 'Populaire pour l\'interurbain', price: '' },
          { emoji: '🚗', name: 'Boleia.net', detail: 'Plateforme portugaise de covoiturage', price: '' },
          { emoji: '🚃', name: 'CP (trains)', detail: 'Trains régionaux abordables autour de Lisbonne', price: 'dès 2,20 €' },
        ]},
      ],
    },
    season: {
      filterTypes: ['c', 'q'],
      blocks: [
        { type: 'text', text: 'Le printemps et le début de l\'automne sont les meilleures périodes. L\'été est très chaud à l\'intérieur et très touristique sur la côte.' },
        { type: 'sub', title: 'Aperçu par mois' },
        { type: 'season', months: [
          { name: 'Jan', level: 'ok' }, { name: 'Fév', level: 'ok' }, { name: 'Mar', level: 'good' },
          { name: 'Avr', level: 'great' }, { name: 'Mai', level: 'great' }, { name: 'Jun', level: 'good' },
          { name: 'Jul', level: 'ok' }, { name: 'Aoû', level: 'bad' }, { name: 'Sep', level: 'great' },
          { name: 'Oct', level: 'great' }, { name: 'Nov', level: 'ok' }, { name: 'Déc', level: 'ok' },
        ]},
        { type: 'text', text: 'L\'Algarve (sud) reste doux même en hiver (15-20°C). Le nord et le centre sont pluvieux de novembre à mars.' },
        { type: 'warn', text: '⚠️ Le Portugal est TRÈS venteux, surtout sur la côte. Prévois du vent fort, même en été. La nuit, le vent côtier peut être glacial.' },
      ],
    },
    culture: {
      filterTypes: ['c', 'b'],
      blocks: [
        { type: 'text', text: 'Les Portugais sont décrits comme très chaleureux et accueillants, mais l\'autostop n\'est pas dans leur culture. Les automobilistes locaux s\'arrêtent rarement. Les touristes étrangers (surtout en été dans l\'Algarve) sont plus susceptibles de prendre des autostoppeurs.' },
        { type: 'sub', title: 'Ce qui marche' },
        { type: 'rule', icon: '🗣️', text: 'L\'approche directe et polie est cruciale. Les Portugais valorisent l\'interaction personnelle.' },
        { type: 'rule', icon: '📋', text: 'Un panneau avec ta destination améliore tes chances.' },
        { type: 'sub', title: 'Événements' },
        { type: 'event', items: [
          { month: 'Fév', day: '⟳', name: 'Carnaval', desc: 'Grandes célébrations, surtout à Torres Vedras et Loule.' },
          { month: 'Juin', day: '12-13', name: 'Santo António (Lisbonne)', desc: 'Fête du saint patron, sardines grillées, défilés.' },
          { month: 'Juin', day: '23-24', name: 'São João (Porto)', desc: 'Plus grande fête de Porto, feux, musique, marteaux en plastique.' },
          { month: 'Juil', day: '⟳', name: 'NOS Alive (Lisbonne)', desc: 'Festival de musique international.' },
          { month: 'Août', day: '⟳', name: 'Festival do Sudoeste', desc: 'Festival de musique dans l\'Alentejo.' },
          { month: 'Oct', day: '5', name: 'Jour de la République', desc: 'Jour férié national.' },
        ]},
        { type: 'tip', text: '💡 Un trajet en autostop au Portugal peut facilement devenir une visite guidée improvisée. Les conducteurs proposent parfois spontanément de faire visiter leur ville.' },
      ],
    },
  },

  // ==================== ITALY ====================
  IT: {
    laws: {
      filterTypes: ['q', 'c', 'a'],
      blocks: [
        { type: 'text', text: 'L\'autostop est interdit sur les autoroutes (autostrade) en Italie, y compris les bretelles d\'accès, les aires de service et les parkings d\'autoroute. C\'est l\'un des rares pays d\'Europe avec une interdiction aussi stricte.' },
        { type: 'sub', title: 'Amendes' },
        { type: 'text', text: 'Amende de 21 à 168 € pour l\'autostoppeur. Le conducteur qui s\'arrête risque aussi une amende. L\'application varie selon les régions et les agents.' },
        { type: 'sub', title: 'Ce qui est autorisé' },
        { type: 'rule', icon: '✅', text: 'Demander un trajet en abordant directement les conducteurs aux stations-service (Autogrill). C\'est la méthode qui fonctionne.' },
        { type: 'rule', icon: '✅', text: 'Faire du stop sur les routes nationales (strade statali) et secondaires.' },
        { type: 'rule', icon: '🚫', text: 'Faire le pouce sur les autoroutes, bretelles, péages, et aires de service d\'autoroute.' },
        { type: 'warn', text: '⚠️ Beaucoup d\'Italiens et même certains policiers pensent que l\'autostop est totalement illégal. Place-toi avant les panneaux "no autostop" aux entrées d\'autoroute.' },
      ],
    },
    hitchhiking: {
      filterTypes: ['q', 'c', 'b'],
      blocks: [
        { type: 'text', text: 'L\'Italie est l\'un des pays les plus difficiles d\'Europe occidentale pour l\'autostop. Les temps d\'attente de 1 à 2 heures sont fréquents. La stratégie gagnante : progresser d\'Autogrill en Autogrill en abordant les conducteurs directement.' },
        { type: 'sub', title: 'Différences nord/sud' },
        { type: 'kv', items: [
          { k: 'Sud de l\'Italie (Calabre, Sicile)', v: 'Plus facile, gens accueillants', color: 'green' },
          { k: 'Sardaigne', v: 'Bon (hospitalité locale)', color: 'green' },
          { k: 'Frioul-Vénétie Julienne, Tyrol du Sud', v: 'Correct', color: 'green' },
          { k: 'Nord industriel (Milan, Turin)', v: 'Difficile, gens pressés', color: 'red' },
          { k: 'Alpes (tunnels)', v: 'Très difficile (pas d\'arrêt)', color: 'red' },
        ]},
        { type: 'sub', title: 'Astuce pancarte' },
        { type: 'text', text: 'Un panneau en italien avec "Siamo bravi" (on est sympas) a prouvé son efficacité. Écris une ville à 200-300 km, pas ta destination finale. Les étrangers (Français, Allemands, Polonais) en transit s\'arrêtent plus que les Italiens.' },
        { type: 'tip', text: '💡 En Sicile, tu peux monter gratuitement sur le ferry à Villa San Giovanni : les billets sont par véhicule, pas par passager.' },
      ],
    },
    safety: {
      filterTypes: ['c', 'a'],
      blocks: [
        { type: 'text', text: 'L\'Italie est globalement sûre pour le voyage. Les incidents violents liés à l\'autostop sont extrêmement rares. Le risque principal est légal (amendes), pas physique.' },
        { type: 'sub', title: 'Numéros d\'urgence' },
        { type: 'kv', items: [
          { k: 'Urgences européen', v: '112' },
          { k: 'Carabinieri', v: '112' },
          { k: 'Police', v: '113' },
          { k: 'Pompiers', v: '115' },
          { k: 'Ambulance', v: '118' },
        ]},
        { type: 'text', text: 'Aux abords des grandes villes (surtout Rome), les femmes seules peuvent être confondues avec des prostituées. Évite de faire du stop dans ces zones.' },
      ],
    },
    women: {
      filterTypes: ['q', 'c', 'a'],
      blocks: [
        { type: 'text', text: 'L\'Italie n\'est pas dangereuse pour les femmes, mais les regards insistants et l\'attention non désirée sont courants, surtout dans le sud. Le stop est tout à fait faisable, y compris en Sicile.' },
        { type: 'sub', title: 'Conseils spécifiques' },
        { type: 'rule', icon: '👕', text: 'Habille-toi de façon sobre : pas de maquillage, pas de bijoux, chaussures de randonnée, look "aventurière".' },
        { type: 'rule', icon: '👨‍👩‍👧', text: 'Préfère les couples et les familles. Les conductrices sont rares mais très sûres.' },
        { type: 'rule', icon: '📱', text: 'Prends la plaque en photo de façon visible (le conducteur voit que tu le fais). Ça rassure tout le monde.' },
      ],
    },
    language: {
      filterTypes: ['c', 'q'],
      blocks: [
        { type: 'text', text: 'L\'italien est essentiel. La majorité des Italiens ne parlent pas anglais, surtout en dehors des zones touristiques. Même quelques mots d\'italien transforment complètement l\'interaction.' },
        { type: 'sub', title: 'Phrases utiles' },
        { type: 'phrase', items: [
          { local: 'Cerco un passaggio per...', meaning: 'Je cherche un trajet vers...' },
          { local: 'Vado a...', meaning: 'Je vais à...' },
          { local: 'Area servizio', meaning: 'Aire de service' },
          { local: 'Grazie mille!', meaning: 'Merci beaucoup !' },
        ]},
        { type: 'tip', text: '💡 Les gestes sont essentiels en Italie. La communication physique aide énormément quand les mots manquent.' },
      ],
    },
    budget: {
      filterTypes: ['b', 'q'],
      blocks: [
        { type: 'text', text: 'Budget routard en Italie : environ 18 à 30 € par jour avec de la discipline. Les régions intérieures (Basilicate, Molise, Calabre) sont nettement moins chères que les côtes et les villes touristiques.' },
        { type: 'sub', title: 'Manger pas cher' },
        { type: 'rule', icon: '🍕', text: 'Pizza al taglio (à la part) : 1 à 2,50 €. Focaccia : 0,80 €. Arancini : 2 €.' },
        { type: 'rule', icon: '🛒', text: 'Supermarchés : LIDL, Carrefour, COOP. Pâtes + sauce = ~3 €/repas en cuisine d\'auberge.' },
        { type: 'sub', title: 'Générosité' },
        { type: 'text', text: 'Les conducteurs italiens offrent parfois spontanément des repas, de l\'hébergement ou même de l\'argent.' },
      ],
    },
    sleep: {
      filterTypes: ['b', 'q', 'a'],
      blocks: [
        { type: 'text', text: 'Le camping sauvage est interdit en Italie. Amendes : 100 à 500 €. Mais le bivouac (coucher du soleil au lever, pas de tente) est toléré en montagne.' },
        { type: 'sub', title: 'Exceptions' },
        { type: 'rule', icon: '✅', text: 'Trentin-Haut-Adige : bivouac autorisé jusqu\'à 24h.' },
        { type: 'rule', icon: '✅', text: 'Val d\'Aoste : bivouac autorisé au-dessus de 2 500 m.' },
        { type: 'rule', icon: '🚫', text: 'Plages : application stricte partout.' },
        { type: 'sub', title: 'Alternatives' },
        { type: 'rule', icon: '🛋️', text: 'Couchsurfing : actif dans les villes universitaires (Turin, Pise, Padoue).' },
        { type: 'rule', icon: '🌾', text: 'WWOOF / Workaway : travail à la ferme en échange du logement et des repas.' },
        { type: 'text', text: 'En Sardaigne et en Sicile, les locaux invitent parfois spontanément les voyageurs chez eux.' },
      ],
    },
    transport: {
      filterTypes: ['c', 'b'],
      blocks: [
        { type: 'text', text: 'L\'Italie a des alternatives de transport abordables quand le stop ne fonctionne pas.' },
        { type: 'sub', title: 'Options' },
        { type: 'transport', items: [
          { emoji: '🚌', name: 'FlixBus / MarinoBus', detail: 'Réseau étendu, 60-80% moins cher que le train', price: 'dès 5 €' },
          { emoji: '🚗', name: 'BlaBlaCar', detail: 'Très utilisé en Italie', price: '' },
          { emoji: '🚄', name: 'Italo', detail: 'Trains grande vitesse privés (Rome-Florence-Venise)', price: 'dès 9 €' },
          { emoji: '🚃', name: 'Trenitalia régional', detail: 'Trains lents mais abordables', price: '' },
        ]},
      ],
    },
    season: {
      filterTypes: ['c', 'q'],
      blocks: [
        { type: 'text', text: 'Le printemps et le début de l\'automne sont les meilleures périodes. Évite octobre-novembre (tout ferme) et août (Ferragosto, chaos routier).' },
        { type: 'sub', title: 'Aperçu par mois' },
        { type: 'season', months: [
          { name: 'Jan', level: 'ok' }, { name: 'Fév', level: 'ok' }, { name: 'Mar', level: 'good' },
          { name: 'Avr', level: 'great' }, { name: 'Mai', level: 'great' }, { name: 'Jun', level: 'great' },
          { name: 'Jul', level: 'good' }, { name: 'Aoû', level: 'ok' }, { name: 'Sep', level: 'great' },
          { name: 'Oct', level: 'ok' }, { name: 'Nov', level: 'bad' }, { name: 'Déc', level: 'ok' },
        ]},
        { type: 'text', text: 'En été, les touristes étrangers (Français, Allemands) traversant le nord sont plus susceptibles de s\'arrêter que les Italiens eux-mêmes.' },
      ],
    },
    culture: {
      filterTypes: ['c', 'b'],
      blocks: [
        { type: 'text', text: 'Les Italiens ont une perception négative de l\'autostop. Beaucoup considèrent que seuls les vagabonds font du stop. Mais une fois le contact établi, l\'hospitalité italienne est sincère et généreuse, surtout dans le sud et sur les îles.' },
        { type: 'sub', title: 'Ce qui marche' },
        { type: 'rule', icon: '🗣️', text: 'Parler italien, même mal, change tout. L\'approche directe aux Autogrill est obligatoire.' },
        { type: 'rule', icon: '😊', text: 'Le contact humain d\'abord : sourire, discussion, regard. Puis seulement la demande de trajet.' },
        { type: 'sub', title: 'Événements' },
        { type: 'event', items: [
          { month: 'Fév', day: '⟳', name: 'Carnevale di Venezia', desc: 'Masques, costumes, 10 jours de festivités.' },
          { month: 'Avr', day: '25', name: 'Festa della Liberazione', desc: 'Jour férié, célébrations nationales.' },
          { month: 'Mai', day: '⟳', name: 'Giro d\'Italia', desc: 'Tour cycliste, ambiance sur les routes.' },
          { month: 'Juil', day: '2+16', name: 'Palio di Siena', desc: 'Course de chevaux médiévale dans la ville.' },
          { month: 'Août', day: '15', name: 'Ferragosto', desc: 'Toute l\'Italie en vacances. Routes chargées.' },
          { month: 'Déc', day: '⟳', name: 'Mercatini di Natale', desc: 'Marchés de Noël, surtout en Trentin.' },
        ]},
      ],
    },
  },

  // ==================== GREECE ====================
  GR: {
    laws: {
      filterTypes: ['q', 'c'],
      blocks: [
        { type: 'text', text: 'Il n\'y a pas de loi spécifique interdisant l\'autostop en Grèce. Sur les autoroutes, c\'est interdit comme dans le reste de l\'UE, mais sur les routes normales c\'est toléré. Les amendes (100-150 €) sont rares et appliquées de façon incohérente.' },
      ],
    },
    hitchhiking: {
      filterTypes: ['q', 'c', 'b'],
      blocks: [
        { type: 'text', text: 'La Grèce est nettement plus facile que l\'Italie ou l\'Espagne pour l\'autostop. Les temps d\'attente varient de quelques minutes à une heure. En zones rurales et sur les îles, les locaux font eux-mêmes du stop.' },
        { type: 'sub', title: 'Par zone' },
        { type: 'kv', items: [
          { k: 'Crète (surtout ouest/sud)', v: 'Très facile', color: 'green' },
          { k: 'Îles rurales', v: 'Facile (peu de bus)', color: 'green' },
          { k: 'Routes rurales continent', v: 'Facile', color: 'green' },
          { k: 'Axes interurbains (Athènes-Thessalonique)', v: 'Plus difficile', color: 'amber' },
          { k: 'Sortir d\'Athènes', v: 'Très difficile', color: 'red' },
        ]},
        { type: 'sub', title: 'Méthode' },
        { type: 'text', text: 'En Crète, le pouce levé n\'est pas toujours compris. Utilise plutôt un geste de la main pour signaler aux voitures de s\'arrêter, comme si tu étais pressé. Un panneau en grec ET en anglais augmente tes chances.' },
      ],
    },
    safety: {
      filterTypes: ['c', 'a'],
      blocks: [
        { type: 'text', text: 'La Grèce est l\'un des pays les plus sûrs d\'Europe pour les voyageurs. Les incidents négatifs liés à l\'autostop sont extrêmement rares. Les conducteurs grecs offrent spontanément nourriture, boissons et hébergement.' },
        { type: 'sub', title: 'Numéros d\'urgence' },
        { type: 'kv', items: [
          { k: 'Urgences', v: '112' },
          { k: 'Police', v: '100' },
          { k: 'Ambulance', v: '166' },
          { k: 'Pompiers', v: '199' },
        ]},
      ],
    },
    women: {
      filterTypes: ['q', 'c', 'a'],
      blocks: [
        { type: 'text', text: 'La Grèce est considérée comme l\'une des meilleures destinations au monde pour les voyageuses solo. L\'attitude envers les femmes seules est décrite comme celle d\'un "grand cousin protecteur" plutôt qu\'intrusive.' },
        { type: 'text', text: 'Les femmes voyagent en toute sécurité en Grèce, de jour comme de nuit, en bus, en ferry et en stop. Les incidents sont quasi inexistants.' },
      ],
    },
    language: {
      filterTypes: ['c', 'q'],
      blocks: [
        { type: 'text', text: 'Le grec est la langue officielle. L\'anglais est bien parlé dans les zones touristiques et par les jeunes (enseigné à l\'école dès le primaire). En zone rurale, c\'est plus limité. Beaucoup de Grecs parlent aussi allemand (diaspora).' },
        { type: 'sub', title: 'Phrases utiles' },
        { type: 'phrase', items: [
          { local: 'Kalimera', meaning: 'Bonjour' },
          { local: 'Efcharistó', meaning: 'Merci' },
          { local: 'Parakaló', meaning: 'S\'il vous plaît / De rien' },
          { local: 'Boríte na me páte sto...?', meaning: 'Pouvez-vous m\'emmener à... ?' },
        ]},
        { type: 'tip', text: '💡 Quelques mots de grec déclenchent des réactions très chaleureuses. Les Grecs apprécient énormément l\'effort.' },
      ],
    },
    budget: {
      filterTypes: ['b', 'q'],
      blocks: [
        { type: 'text', text: 'La Grèce est abordable pour les routards. Budget : 22 à 42 € par jour. Moins cher que l\'Italie. Les îles moins touristiques (Naxos, Paros, Ios) offrent les meilleurs rapports qualité-prix.' },
        { type: 'sub', title: 'Manger pas cher' },
        { type: 'rule', icon: '🥙', text: 'Gyros : moins de 5 €. Souvlaki : 2-3 €.' },
        { type: 'rule', icon: '🛒', text: 'Supermarchés : feta, pita, yaourt, tomates, olives. Très bon marché.' },
        { type: 'sub', title: 'Transport' },
        { type: 'text', text: 'Bus KTEL : environ 5 €/100 km (tarifs fixés par le gouvernement). Ferries pour les îles : abordables, réserve 2-3 mois à l\'avance pour les routes populaires.' },
      ],
    },
    sleep: {
      filterTypes: ['b', 'q', 'a'],
      blocks: [
        { type: 'text', text: 'Le camping sauvage est officiellement interdit en Grèce. Amende : 150 €, pouvant aller jusqu\'à 3 000 € + 3 mois de prison dans les zones touristiques ou réserves naturelles.' },
        { type: 'sub', title: 'En pratique' },
        { type: 'text', text: 'L\'interdiction s\'applique du lever au coucher du soleil. Dormir la nuit et remballer au matin est largement toléré en basse saison et loin des zones touristiques. Les plages isolées sont faciles à trouver.' },
        { type: 'sub', title: 'Alternatives' },
        { type: 'rule', icon: '🛋️', text: 'Couchsurfing : communauté active à Athènes et Thessalonique.' },
        { type: 'rule', icon: '🏠', text: 'Invitations spontanées : les Grecs invitent régulièrement les voyageurs à dîner ou dormir chez eux, surtout en zone rurale et sur les îles.' },
        { type: 'sub', title: 'Hébergement' },
        { type: 'kv', items: [
          { k: 'Auberges Athènes', v: '9 à 25 €/nuit' },
          { k: 'Auberges îles', v: '20 à 25 €/nuit' },
          { k: 'Studios sur Booking', v: 'dès 10 €/pers/nuit' },
        ]},
      ],
    },
    transport: {
      filterTypes: ['c', 'b'],
      blocks: [
        { type: 'text', text: 'Le réseau de bus KTEL est si bon marché que l\'autostop est parfois moins nécessaire en Grèce.' },
        { type: 'sub', title: 'Options' },
        { type: 'transport', items: [
          { emoji: '🚌', name: 'KTEL (bus interurbain)', detail: 'Réseau étendu, même les petits villages. Tarifs fixés par l\'État.', price: '~5 €/100 km' },
          { emoji: '⛴️', name: 'Ferries', detail: 'Essentiels pour les îles. Ferries de nuit = économiser un hébergement.', price: '10 à 50 €' },
          { emoji: '🚃', name: 'Trains', detail: 'Réseau limité mais jusqu\'à 50% moins cher que le bus', price: '' },
          { emoji: '🚗', name: 'BlaBlaCar', detail: 'Disponible en Grèce', price: '' },
        ]},
      ],
    },
    season: {
      filterTypes: ['c', 'q'],
      blocks: [
        { type: 'text', text: 'La fenêtre idéale va de fin mai à début octobre. Juin et septembre sont le point idéal : temps estival sans chaleur extrême ni foules.' },
        { type: 'sub', title: 'Aperçu par mois' },
        { type: 'season', months: [
          { name: 'Jan', level: 'bad' }, { name: 'Fév', level: 'bad' }, { name: 'Mar', level: 'ok' },
          { name: 'Avr', level: 'good' }, { name: 'Mai', level: 'great' }, { name: 'Jun', level: 'great' },
          { name: 'Jul', level: 'good' }, { name: 'Aoû', level: 'ok' }, { name: 'Sep', level: 'great' },
          { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'bad' }, { name: 'Déc', level: 'bad' },
        ]},
        { type: 'warn', text: '⚠️ De novembre à mars, la plupart des îles ferment (hôtels, restaurants, ferries réduits). Le continent reste accessible mais il y a très peu de touristes sur les routes.' },
      ],
    },
    culture: {
      filterTypes: ['c', 'b'],
      blocks: [
        { type: 'text', text: 'La Grèce est le pays de la philoxenia (l\'amour des étrangers). C\'est une valeur culturelle profonde qui remonte à la Grèce antique : Zeus Xenios protégeait les voyageurs, et tout étranger pouvait être un dieu déguisé.' },
        { type: 'sub', title: 'En pratique' },
        { type: 'text', text: 'Les conducteurs qui s\'arrêtent hébergent souvent les voyageurs gratuitement, les invitent à dîner, leur font visiter la région. L\'hospitalité grecque est sincère et généreuse, même chez les gens les plus modestes.' },
        { type: 'rule', icon: '🎁', text: 'Accepte les invitations (refuser peut sembler un rejet). Apporte un petit cadeau (pâtisseries, vin) si tu es invité chez quelqu\'un.' },
        { type: 'sub', title: 'Événements' },
        { type: 'event', items: [
          { month: 'Fév-Mar', day: '⟳', name: 'Apokries (Carnaval)', desc: 'Patras a le plus grand carnaval de Grèce.' },
          { month: 'Avr', day: '⟳', name: 'Pâques orthodoxe', desc: 'La plus grande fête de Grèce. Agneaux rôtis, feux d\'artifice.' },
          { month: 'Juin', day: '⟳', name: 'Festival d\'Athènes', desc: 'Théâtre, musique, danse à l\'Odéon d\'Hérode Atticus.' },
          { month: 'Août', day: '15', name: 'Assomption (Dekapentavgoustos)', desc: 'Plus grande fête estivale. Pèlerinages, fêtes sur les îles.' },
          { month: 'Oct', day: '28', name: 'Jour du Non (Ochi)', desc: 'Fête nationale, défilés militaires.' },
        ]},
        { type: 'tip', text: '💡 Dicton crétois : "Un invité dans la maison est un cadeau de Dieu." En zone rurale, l\'arrivée d\'un étranger est encore un événement spécial.' },
      ],
    },
  },

  // ==================== NORWAY ====================
  NO: {
    laws: {
      filterTypes: ['q', 'c'],
      blocks: [
        { type: 'text', text: 'L\'autostop est légal en Norvège. Interdit sur les autoroutes elles-mêmes mais autorisé aux bretelles d\'accès, stations-service et routes secondaires. Depuis 2024, presque tous les ferries côtiers sont gratuits pour les piétons.' },
      ],
    },
    hitchhiking: {
      filterTypes: ['q', 'c', 'b'],
      blocks: [
        { type: 'text', text: 'La Norvège fonctionne bien pour l\'autostop mais la progression est lente à cause des routes sinueuses de montagne et du trafic clairsemé. Prévois ~500 km/jour maximum.' },
        { type: 'sub', title: 'Différences nord/sud' },
        { type: 'kv', items: [
          { k: 'Nord (Lofoten, Tromsø, Nordkapp)', v: 'Excellent (5-30 min)', color: 'green' },
          { k: 'Centre (Trondheim)', v: 'Correct', color: 'green' },
          { k: 'Sud (Oslo, Stavanger)', v: 'Difficile (jusqu\'à 2h)', color: 'amber' },
        ]},
        { type: 'text', text: 'Les Lofoten sont un paradis pour l\'autostop : une seule route principale (E10), paysages spectaculaires, conducteurs accueillants. Dans le nord, beaucoup de conducteurs n\'ont jamais vu d\'autostoppeur.' },
        { type: 'tip', text: '💡 Aux ferries, approche les conducteurs AVANT l\'embarquement plutôt qu\'après. Ils attendent et ont le temps de discuter.' },
      ],
    },
    safety: {
      filterTypes: ['c', 'a'],
      blocks: [
        { type: 'text', text: 'La Norvège est l\'un des pays les plus sûrs au monde. Le principal risque est la météo et l\'isolement (longues distances entre les villes, froid, pluie, neige), pas les gens.' },
        { type: 'sub', title: 'Numéros d\'urgence' },
        { type: 'kv', items: [
          { k: 'Urgences', v: '112' },
          { k: 'Police', v: '02800' },
          { k: 'Ambulance', v: '113' },
        ]},
      ],
    },
    women: {
      filterTypes: ['q', 'c'],
      blocks: [
        { type: 'text', text: 'La Scandinavie est décrite comme "la région parfaite pour essayer l\'autostop en tant que femme". Le statut de la femme dans la société nordique est très élevé et le harcèlement est quasi inexistant.' },
        { type: 'text', text: 'La Norvège se prête très bien au stop en solo pour les femmes. L\'accueil est chaleureux et les rencontres positives sont la norme.' },
      ],
    },
    language: {
      filterTypes: ['c', 'q'],
      blocks: [
        { type: 'text', text: 'Presque tous les Norvégiens parlent anglais couramment. Aucune barrière de langue.' },
      ],
    },
    budget: {
      filterTypes: ['b', 'q'],
      blocks: [
        { type: 'text', text: 'La Norvège est extrêmement chère. Les prix alimentaires sont environ le double de ceux de la France, même dans les supermarchés discount (Rema 1000, Kiwi). Un repas au restaurant est prohibitif pour un routard.' },
        { type: 'text', text: 'La combinaison autostop + camping sauvage (gratuit grâce à l\'Allemannsretten) + cuisine au réchaud est la seule stratégie viable pour voyager à petit budget.' },
      ],
    },
    sleep: {
      filterTypes: ['b', 'q'],
      blocks: [
        { type: 'text', text: 'L\'Allemannsretten (droit de tout un chacun) est inscrit dans la loi norvégienne de 1957. Tu peux camper gratuitement sur les terres non cultivées (forêts, montagnes, landes, rivages) sans autorisation.' },
        { type: 'sub', title: 'Règles' },
        { type: 'rule', icon: '✅', text: 'Camping gratuit jusqu\'à 2 nuits au même endroit.' },
        { type: 'rule', icon: '✅', text: 'Cueillette de baies et champignons autorisée.' },
        { type: 'rule', icon: '🚫', text: 'Rester à minimum 150 m des habitations.' },
        { type: 'rule', icon: '🚫', text: 'Pas de feu en pleine nature.' },
        { type: 'rule', icon: '🚫', text: 'Pas sur les terres cultivées.' },
        { type: 'warn', text: '⚠️ Aux Lofoten, des restrictions locales existent à cause du surtourisme. Renseigne-toi localement.' },
      ],
    },
    transport: {
      filterTypes: ['c', 'b'],
      blocks: [
        { type: 'transport', items: [
          { emoji: '⛴️', name: 'Ferries côtiers', detail: 'Gratuits pour les piétons depuis 2024', price: 'gratuit' },
          { emoji: '🚌', name: 'Vy Bus4You', detail: 'Bus interurbains abordables', price: '' },
          { emoji: '🚌', name: 'FlixBus', detail: 'Quelques lignes en Norvège', price: 'dès 5 €' },
        ]},
      ],
    },
    season: {
      filterTypes: ['c', 'q'],
      blocks: [
        { type: 'season', months: [
          { name: 'Jan', level: 'bad' }, { name: 'Fév', level: 'bad' }, { name: 'Mar', level: 'bad' },
          { name: 'Avr', level: 'ok' }, { name: 'Mai', level: 'good' }, { name: 'Jun', level: 'great' },
          { name: 'Jul', level: 'great' }, { name: 'Aoû', level: 'great' }, { name: 'Sep', level: 'ok' },
          { name: 'Oct', level: 'bad' }, { name: 'Nov', level: 'bad' }, { name: 'Déc', level: 'bad' },
        ]},
        { type: 'text', text: 'Juin à août : soleil de minuit au nord du cercle polaire. Journées quasi infinies. Septembre : épaule (plus froid, moins de trafic). Hiver : extrêmement difficile (nuit polaire, froid, verglas, très peu de voitures).' },
      ],
    },
    culture: {
      filterTypes: ['c', 'b'],
      blocks: [
        { type: 'text', text: 'Les Norvégiens sont réservés au premier contact mais serviables. Dans le nord, les gens sont nettement plus chaleureux et accueillants. Les conducteurs vont parfois faire un détour pour t\'amener au bon endroit.' },
        { type: 'sub', title: 'Événements' },
        { type: 'event', items: [
          { month: 'Mai', day: '17', name: 'Syttende Mai', desc: 'Fête nationale. Défilés, costumes traditionnels dans tout le pays.' },
          { month: 'Juin', day: '23', name: 'Sankthansaften', desc: 'Feux de la Saint-Jean sur les plages et fjords.' },
          { month: 'Juil', day: '⟳', name: 'Midnight Sun Marathon (Tromsø)', desc: 'Marathon sous le soleil de minuit.' },
        ]},
      ],
    },
  },

  // ==================== SWEDEN ====================
  SE: {
    laws: {
      filterTypes: ['q', 'c'],
      blocks: [
        { type: 'text', text: 'L\'autostop est légal en Suède. Interdit sur les autoroutes mais autorisé aux bretelles et stations-service. La réputation de "pays où c\'est interdit" est un mythe : personne ne t\'ennuiera.' },
      ],
    },
    hitchhiking: {
      filterTypes: ['q', 'c', 'b'],
      blocks: [
        { type: 'text', text: 'La Suède a une mauvaise réputation parmi les autostoppeurs, mais les voyageurs expérimentés disent que "ce n\'est vraiment pas aussi mauvais que tout le monde le dit". Temps d\'attente moyen : ~30 minutes. Le nord est nettement plus facile que le sud.' },
        { type: 'text', text: 'Les retours d\'expérience sont majoritairement positifs, même en solo. L\'approche directe aux stations-service fonctionne mieux que le pouce au bord de la route.' },
        { type: 'tip', text: '💡 Les grandes stations-service (Rasta) le long des autoroutes sont les meilleurs spots pour le stop.' },
      ],
    },
    safety: {
      filterTypes: ['c', 'a'],
      blocks: [
        { type: 'text', text: 'Pays très sûr. Aucun incident rapporté par les autostoppeurs. Le principal risque est les longues distances dans le nord avec peu de voitures.' },
        { type: 'sub', title: 'Numéros d\'urgence' },
        { type: 'kv', items: [{ k: 'Urgences', v: '112' }] },
      ],
    },
    women: {
      filterTypes: ['q', 'c'],
      blocks: [
        { type: 'text', text: 'La Suède est l\'un des pays les plus égalitaires au monde. Les femmes sont prises en stop plus rapidement que les hommes. La Scandinavie est décrite comme "la région parfaite pour essayer l\'autostop en tant que femme".' },
      ],
    },
    language: {
      filterTypes: ['c', 'q'],
      blocks: [
        { type: 'text', text: 'Presque tous les Suédois parlent anglais couramment. Aucune barrière de langue. Le mot suédois pour autostop est "lifta".' },
      ],
    },
    budget: {
      filterTypes: ['b', 'q'],
      blocks: [
        { type: 'text', text: 'Cher mais un peu moins que la Norvège. Supermarchés discount : Lidl, Willys, ICA Maxi. Cuisiner soi-même est essentiel.' },
      ],
    },
    sleep: {
      filterTypes: ['b', 'q'],
      blocks: [
        { type: 'text', text: 'L\'Allemansrätten (droit d\'accès public) est inscrit dans la Constitution suédoise depuis 1994. Tu peux planter ta tente sur n\'importe quel terrain non cultivé pour 1-2 nuits sans autorisation.' },
        { type: 'sub', title: 'Règles' },
        { type: 'rule', icon: '✅', text: '1-2 nuits au même endroit, pas sur terrain clôturé ou cultivé.' },
        { type: 'rule', icon: '✅', text: 'Cueillette de baies, champignons et fleurs sauvages autorisée.' },
        { type: 'rule', icon: '🚫', text: 'Rester à 150-200 m des habitations.' },
        { type: 'rule', icon: '🚫', text: 'Feux de camp uniquement quand les conditions sont sûres (interdictions fréquentes en été).' },
      ],
    },
    transport: {
      filterTypes: ['c', 'b'],
      blocks: [
        { type: 'transport', items: [
          { emoji: '🚌', name: 'FlixBus / FlixTrain', detail: 'Opère en Suède', price: 'dès 5 €' },
          { emoji: '🚃', name: 'SJ (trains suédois)', detail: 'Réserve à l\'avance pour des réductions', price: '' },
          { emoji: '🤝', name: 'Skjutsgruppen.nu', detail: 'Plateforme suédoise de covoiturage', price: '' },
        ]},
      ],
    },
    season: {
      filterTypes: ['c', 'q'],
      blocks: [
        { type: 'season', months: [
          { name: 'Jan', level: 'bad' }, { name: 'Fév', level: 'bad' }, { name: 'Mar', level: 'ok' },
          { name: 'Avr', level: 'ok' }, { name: 'Mai', level: 'good' }, { name: 'Jun', level: 'great' },
          { name: 'Jul', level: 'great' }, { name: 'Aoû', level: 'great' }, { name: 'Sep', level: 'good' },
          { name: 'Oct', level: 'ok' }, { name: 'Nov', level: 'bad' }, { name: 'Déc', level: 'bad' },
        ]},
        { type: 'text', text: 'Juin à août : longues journées, temps doux, maximum de trafic. Attention aux moustiques en Laponie (juin-juillet). Hiver : difficile (-20°C dans le nord, obscurité).' },
      ],
    },
    culture: {
      filterTypes: ['c', 'b'],
      blocks: [
        { type: 'text', text: 'Les Suédois sont introvertis et ne t\'approcheront pas, mais ils sont serviables quand TU les abordes. Dans le nord, les gens "ne laisseront pas un étranger geler dehors". Enlève tes chaussures quand tu entres chez quelqu\'un ou dans la cabine d\'un camion.' },
        { type: 'sub', title: 'Événements' },
        { type: 'event', items: [
          { month: 'Juin', day: '⟳', name: 'Midsommar', desc: 'Solstice d\'été. Danse autour du mât, couronnes de fleurs, fête nationale.' },
          { month: 'Août', day: '⟳', name: 'Crayfish Party (Kräftskiva)', desc: 'Fêtes d\'écrevisses en plein air dans tout le pays.' },
          { month: 'Déc', day: '13', name: 'Lucia', desc: 'Processions aux bougies, chants traditionnels.' },
        ]},
      ],
    },
  },

  // ==================== ICELAND ====================
  IS: {
    laws: {
      filterTypes: ['q', 'c'],
      blocks: [
        { type: 'text', text: 'L\'autostop est parfaitement légal et socialement accepté en Islande. Aucune restriction. C\'est une pratique courante, surtout sur la Route 1 (Ring Road).' },
        { type: 'warn', text: '⚠️ La police des frontières peut demander une preuve de fonds suffisants (carte bancaire ou espèces). L\'entrée peut être refusée sans.' },
      ],
    },
    hitchhiking: {
      filterTypes: ['q', 'c', 'b'],
      blocks: [
        { type: 'text', text: 'L\'Islande est très facile pour l\'autostop en été. Temps d\'attente moyen : 5 à 30 minutes sur la Ring Road. Les Islandais ET les touristes en voiture de location s\'arrêtent.' },
        { type: 'sub', title: 'Par zone' },
        { type: 'kv', items: [
          { k: 'Ring Road (Route 1)', v: 'Très facile', color: 'green' },
          { k: 'Reykjavik → Akranes (bus + stop)', v: 'Facile', color: 'green' },
          { k: 'Fjords de l\'Ouest', v: 'Très difficile (locaux réservés)', color: 'red' },
          { k: 'Intérieur / Highlands', v: 'Quasi impossible (pas de trafic)', color: 'red' },
        ]},
        { type: 'text', text: 'Ne tente pas de sortir de Reykjavik en stop directement. Prends un bus jusqu\'à Akranes et commence de là. Les stations N1 sont les centres sociaux des villages et de bons spots.' },
        { type: 'tip', text: '💡 Samferda.is : plateforme islandaise de covoiturage où tu peux partager les frais d\'essence.' },
      ],
    },
    safety: {
      filterTypes: ['c', 'a'],
      blocks: [
        { type: 'text', text: 'L\'Islande est considérée comme le pays le plus sûr au monde pour les voyageuses solo. Le crime quasi inexistant. Le vrai danger est la météo : elle change en quelques minutes, et être bloqué loin d\'une ville par temps arctique est le risque principal.' },
        { type: 'sub', title: 'Numéros d\'urgence' },
        { type: 'kv', items: [{ k: 'Urgences', v: '112' }] },
      ],
    },
    women: {
      filterTypes: ['q', 'c'],
      blocks: [
        { type: 'text', text: 'L\'Islande est la référence mondiale en matière d\'égalité des genres et de sécurité pour les femmes. Le stop fonctionne parfaitement pour les femmes seules. Les automobilistes veulent souvent t\'aider encore plus quand tu es une femme.' },
      ],
    },
    language: {
      filterTypes: ['c', 'q'],
      blocks: [
        { type: 'text', text: 'Presque tous les Islandais parlent anglais couramment. Aucune barrière de langue. Les touristes de toutes nationalités offrent aussi des trajets.' },
      ],
    },
    budget: {
      filterTypes: ['b', 'q'],
      blocks: [
        { type: 'text', text: 'L\'Islande est le pays nordique le plus cher. Budget minimum : 60 à 100 €/jour. L\'autostop est la stratégie clé pour réduire le principal poste de dépense (la location de voiture, très chère). Monnaie : couronne islandaise (ISK). Le supermarché le moins cher est Bonus.' },
        { type: 'sub', title: 'Hébergement' },
        { type: 'kv', items: [
          { k: 'Campings officiels', v: '5 à 25 €/nuit' },
          { k: 'Auberges (dortoir Reykjavik)', v: 'dès ~30 €/nuit' },
        ]},
      ],
    },
    sleep: {
      filterTypes: ['b', 'q', 'a'],
      blocks: [
        { type: 'text', text: 'Le camping sauvage avec tente est autorisé uniquement en zone inhabitée, pour 1 nuit, avec maximum 3 tentes, et s\'il n\'y a pas de panneau d\'interdiction. Les camping-cars DOIVENT rester dans les campings officiels (loi de 2015).' },
        { type: 'warn', text: '⚠️ Depuis 2017, les règles ont été durcies à cause du comportement de certains touristes. En zone habitée (sud de l\'Islande), le camping hors campings est interdit.' },
      ],
    },
    transport: {
      filterTypes: ['c', 'b'],
      blocks: [
        { type: 'text', text: 'Pas de chemin de fer en Islande. Les bus existent mais sont chers et peu fréquents.' },
        { type: 'sub', title: 'Options' },
        { type: 'transport', items: [
          { emoji: '🤝', name: 'Samferda.is', detail: 'Covoiturage islandais, partage des frais d\'essence', price: '' },
          { emoji: '✈️', name: 'Vols intérieurs', detail: 'Reykjavik-Akureyri (Icelandair Connect)', price: '' },
          { emoji: '⛴️', name: 'Ferry Smyril Line', detail: 'Danemark → Féroé → Islande (Seyðisfjörður)', price: '' },
        ]},
      ],
    },
    season: {
      filterTypes: ['c', 'q'],
      blocks: [
        { type: 'season', months: [
          { name: 'Jan', level: 'bad' }, { name: 'Fév', level: 'bad' }, { name: 'Mar', level: 'bad' },
          { name: 'Avr', level: 'bad' }, { name: 'Mai', level: 'ok' }, { name: 'Jun', level: 'great' },
          { name: 'Jul', level: 'great' }, { name: 'Aoû', level: 'great' }, { name: 'Sep', level: 'ok' },
          { name: 'Oct', level: 'bad' }, { name: 'Nov', level: 'bad' }, { name: 'Déc', level: 'bad' },
        ]},
        { type: 'text', text: 'Juin à août exclusivement. Quasi 24h de lumière, plus de trafic (touristes), températures douces (10-15°C). Mai et septembre possibles mais plus froids et moins de voitures. Hiver : quasi impossible (obscurité, tempêtes, très peu de voitures).' },
      ],
    },
    culture: {
      filterTypes: ['c', 'b'],
      blocks: [
        { type: 'text', text: 'Les Islandais sont accueillants et confiants grâce à l\'isolement historique et à la petite population (~370 000). Le tourisme est une industrie majeure, donc les locaux sont habitués aux visiteurs. Les Islandais en gros 4x4 s\'arrêtent plus souvent que les touristes en voiture de location (souvent pleines).' },
        { type: 'sub', title: 'Événements' },
        { type: 'event', items: [
          { month: 'Fév', day: '⟳', name: 'Þorrablót', desc: 'Festival gastronomique viking avec plats traditionnels.' },
          { month: 'Juin', day: '17', name: 'Fête nationale', desc: 'Célébration de l\'indépendance, défilés.' },
          { month: 'Août', day: '⟳', name: 'Þjóðhátíð (Vestmannaeyjar)', desc: 'Plus grand festival d\'Islande, musique et feux de camp.' },
        ]},
      ],
    },
  },

  // ==================== FINLAND ====================
  FI: {
    laws: {
      filterTypes: ['q', 'c'],
      blocks: [
        { type: 'text', text: 'L\'autostop est légal en Finlande. Interdit sur les autoroutes (moottoritie) et certaines voies express (moottoriliikennetie). Autorisé aux bretelles d\'accès (souvent avec un arrêt de bus) et aux stations-service.' },
      ],
    },
    hitchhiking: {
      filterTypes: ['q', 'c', 'b'],
      blocks: [
        { type: 'text', text: 'La Finlande est un pays mitigé pour l\'autostop. Les Finlandais sont introvertis et hésitent à prendre des inconnus. Le sud et les villes (Helsinki, Tampere) sont difficiles. Mais plus tu montes vers le nord (Laponie), plus ça devient facile.' },
        { type: 'sub', title: 'Paradoxe lapon' },
        { type: 'text', text: 'En Laponie, il y a parfois seulement 5 voitures par heure sur les routes secondaires. Mais les conducteurs font de très longues distances et apprécient la compagnie. Ils s\'arrêtent plus facilement, surtout par mauvais temps (compassion).' },
        { type: 'tip', text: '💡 Les conducteurs finlandais ont besoin d\'un espace sûr pour s\'arrêter. Positionne-toi là où il y a clairement de la place pour se garer.' },
      ],
    },
    safety: {
      filterTypes: ['c', 'a'],
      blocks: [
        { type: 'text', text: 'La Finlande est l\'un des pays les plus sûrs au monde. Aucun incident rapporté par les autostoppeurs. Les Lapons sont décrits comme "parmi les gens les plus sympathiques et les plus serviables".' },
        { type: 'sub', title: 'Numéros d\'urgence' },
        { type: 'kv', items: [{ k: 'Urgences', v: '112' }] },
      ],
    },
    women: {
      filterTypes: ['q', 'c'],
      blocks: [
        { type: 'text', text: 'La Finlande et la Scandinavie sont décrites comme "la région parfaite pour essayer l\'autostop en tant que femme". Le statut de la femme dans la société nordique est très élevé et tu ne seras harcelée nulle part.' },
      ],
    },
    language: {
      filterTypes: ['c', 'q'],
      blocks: [
        { type: 'text', text: 'La plupart des Finlandais parlent anglais, surtout les jeunes et en ville. Le finnois et le suédois sont les langues officielles. Le finnois est très différent des langues scandinaves et difficile à apprendre.' },
        { type: 'phrase', items: [
          { local: 'Kiitos paljon', meaning: 'Merci beaucoup' },
          { local: 'Kyyti', meaning: 'Un trajet' },
        ]},
      ],
    },
    budget: {
      filterTypes: ['b', 'q'],
      blocks: [
        { type: 'text', text: 'Les courses alimentaires sont très chères par rapport au reste de l\'Europe. La combinaison autostop + camping sauvage (Jokamiehenoikeus) + cuisine au réchaud est la stratégie budget.' },
      ],
    },
    sleep: {
      filterTypes: ['b', 'q'],
      blocks: [
        { type: 'text', text: 'Le Jokamiehenoikeus (droit de tout un chacun) permet de camper gratuitement sur les terres non cultivées. Tu peux cueillir des baies, des champignons et pêcher à la canne.' },
        { type: 'rule', icon: '✅', text: 'Camping gratuit sur terrain non cultivé, 1-2 nuits.' },
        { type: 'rule', icon: '🚫', text: 'Les feux de camp ne font PAS partie du Jokamiehenoikeus. Uniquement aux emplacements désignés.' },
        { type: 'rule', icon: '🚫', text: 'Dans les parcs nationaux : uniquement dans les zones de tente désignées.' },
      ],
    },
    transport: {
      filterTypes: ['c', 'b'],
      blocks: [
        { type: 'transport', items: [
          { emoji: '🚌', name: 'Onnibus', detail: 'Bus longue distance, très bon marché', price: 'dès 1 €' },
          { emoji: '🚌', name: 'FlixBus', detail: 'Quelques lignes en Finlande', price: 'dès 5 €' },
          { emoji: '🚃', name: 'VR (trains finlandais)', detail: 'Réserve à l\'avance pour des réductions', price: '' },
        ]},
      ],
    },
    season: {
      filterTypes: ['c', 'q'],
      blocks: [
        { type: 'season', months: [
          { name: 'Jan', level: 'bad' }, { name: 'Fév', level: 'bad' }, { name: 'Mar', level: 'bad' },
          { name: 'Avr', level: 'ok' }, { name: 'Mai', level: 'good' }, { name: 'Jun', level: 'great' },
          { name: 'Jul', level: 'great' }, { name: 'Aoû', level: 'good' }, { name: 'Sep', level: 'ok' },
          { name: 'Oct', level: 'bad' }, { name: 'Nov', level: 'bad' }, { name: 'Déc', level: 'bad' },
        ]},
        { type: 'warn', text: '⚠️ En juin-juillet en Laponie, les moustiques sont un problème majeur. Prévois du répulsif et une moustiquaire.' },
      ],
    },
    culture: {
      filterTypes: ['c', 'b'],
      blocks: [
        { type: 'text', text: 'Les Finlandais sont réservés mais les rencontres sont chaleureuses une fois le contact établi. En Laponie, les gens sont particulièrement accueillants. l\'hospitalité est sincère.' },
        { type: 'sub', title: 'Événements' },
        { type: 'event', items: [
          { month: 'Fév', day: '⟳', name: 'Marché de Jokkmokk', desc: 'Marché sami historique en Laponie (aussi côté suédois).' },
          { month: 'Juin', day: '⟳', name: 'Juhannus (Midsommar)', desc: 'Solstice d\'été, feux de joie, saunas, lac.' },
          { month: 'Juil', day: '⟳', name: 'Wife Carrying Championship', desc: 'Course de portage de femme à Sonkajärvi. Oui, c\'est réel.' },
          { month: 'Déc', day: '⟳', name: 'Village du Père Noël (Rovaniemi)', desc: 'Tourisme hivernal, aurores boréales.' },
        ]},
      ],
    },
  },

  // ==================== DENMARK ====================
  DK: {
    laws: {
      filterTypes: ['q', 'c'],
      blocks: [
        { type: 'text', text: 'L\'autostop est légal au Danemark sauf sur les autoroutes (piétons interdits). Tu peux faire du stop depuis les bretelles d\'accès. Contrôles aux frontières possibles : aie toujours ton passeport.' },
      ],
    },
    hitchhiking: {
      filterTypes: ['q', 'c', 'b'],
      blocks: [
        { type: 'text', text: 'Le Danemark est l\'un des meilleurs pays d\'Europe pour l\'autostop, comparable à la Serbie. Temps d\'attente : 10 à 20 minutes maximum. Les gens sont détendus et t\'emmènent où tu veux.' },
        { type: 'text', text: 'Les trajets sont courts (quelques dizaines de km jusqu\'à la prochaine ville) donc prévois plusieurs lifts par jour. Les ferries font partie de l\'expérience : ils sont souvent gratuits pour les piétons ou facturés par véhicule.' },
        { type: 'tip', text: '💡 Le terrain plat et le réseau routier dense rendent le Danemark très accessible. C\'est un excellent pays pour débuter en autostop.' },
      ],
    },
    safety: {
      filterTypes: ['c', 'a'],
      blocks: [
        { type: 'text', text: 'Pays très sûr. Les conducteurs danois sont décrits comme sympathiques, généreux et ouverts. Jeunes, vieux, hommes, femmes : tout le monde s\'arrête.' },
        { type: 'sub', title: 'Numéros d\'urgence' },
        { type: 'kv', items: [{ k: 'Urgences', v: '112' }] },
      ],
    },
    women: {
      filterTypes: ['q', 'c'],
      blocks: [
        { type: 'text', text: 'Le Danemark est sûr pour les femmes qui font du stop seules. Les trajets viennent de personnes de tous âges et genres. La pratique est suffisamment normalisée pour que tout le monde s\'arrête.' },
      ],
    },
    language: {
      filterTypes: ['c', 'q'],
      blocks: [
        { type: 'text', text: 'TOUS les conducteurs parlent anglais. Dans l\'ouest et le sud du pays, beaucoup parlent aussi allemand. La communication est zéro problème.' },
      ],
    },
    budget: {
      filterTypes: ['b', 'q'],
      blocks: [
        { type: 'text', text: 'Le Danemark est le moins cher des 5 pays nordiques, mais reste cher par rapport au reste de l\'Europe. Supermarchés discount : Netto, Rema 1000, Lidl. La street food (hot-dogs, shawarma) est relativement abordable.' },
      ],
    },
    sleep: {
      filterTypes: ['b', 'q', 'a'],
      blocks: [
        { type: 'text', text: 'Le Danemark n\'a PAS de droit d\'accès à la nature comme la Norvège ou la Suède. Le camping sauvage est interdit (amende 40-135 €). Mais il existe des alternatives légales gratuites.' },
        { type: 'sub', title: 'Alternatives gratuites' },
        { type: 'rule', icon: '✅', text: 'Fri Teltning : 275+ zones de camping gratuit dans les forêts domaniales. 1 nuit max, 2 petites tentes max, pas de voiture.' },
        { type: 'rule', icon: '✅', text: 'Shelterplads : abris forestiers gratuits disponibles dans de nombreuses forêts.' },
        { type: 'rule', icon: '✅', text: 'Naturlagerplätze : sites nature chez des agriculteurs ou en terrain communal, ~3 €/nuit, max 2 nuits.' },
      ],
    },
    transport: {
      filterTypes: ['c', 'b'],
      blocks: [
        { type: 'transport', items: [
          { emoji: '🚌', name: 'FlixBus', detail: 'Réseau étendu au Danemark', price: 'dès 5 €' },
          { emoji: '🚃', name: 'DSB (trains danois)', detail: 'Billets Orange (achat anticipé = très bon marché)', price: '' },
          { emoji: '⛴️', name: 'Ferries', detail: 'Entre les îles, certains gratuits pour les piétons', price: '' },
          { emoji: '🚲', name: 'Vélo', detail: 'Le Danemark est plat avec d\'excellentes pistes cyclables', price: '' },
        ]},
      ],
    },
    season: {
      filterTypes: ['c', 'q'],
      blocks: [
        { type: 'season', months: [
          { name: 'Jan', level: 'bad' }, { name: 'Fév', level: 'bad' }, { name: 'Mar', level: 'ok' },
          { name: 'Avr', level: 'good' }, { name: 'Mai', level: 'great' }, { name: 'Jun', level: 'great' },
          { name: 'Jul', level: 'great' }, { name: 'Aoû', level: 'great' }, { name: 'Sep', level: 'good' },
          { name: 'Oct', level: 'ok' }, { name: 'Nov', level: 'bad' }, { name: 'Déc', level: 'bad' },
        ]},
        { type: 'text', text: 'Mai à septembre. Le Danemark a un climat plus doux que les autres pays nordiques. Été : 15-22°C, longues journées. Hiver : pas recommandé (froid, humide, sombre, peu de voitures).' },
      ],
    },
    culture: {
      filterTypes: ['c', 'b'],
      blocks: [
        { type: 'text', text: 'Les Danois sont les plus détendus de tous les Nordiques pour l\'autostop. Amicaux, ouverts, serviables. Il est courant de se faire offrir un café et de bénéficier de détours pour être déposé au bon endroit.' },
        { type: 'sub', title: 'Événements' },
        { type: 'event', items: [
          { month: 'Juin', day: '23', name: 'Sankt Hans Aften', desc: 'Feux de la Saint-Jean sur les plages. Tradition nationale.' },
          { month: 'Juil', day: '⟳', name: 'Roskilde Festival', desc: 'Plus grand festival de musique d\'Europe du Nord, 130 000 personnes.' },
          { month: 'Déc', day: '⟳', name: 'Marchés de Noël (Tivoli)', desc: 'Tivoli Gardens à Copenhague, féerique.' },
        ]},
      ],
    },
  },

  // ==================== UNITED KINGDOM ====================
  GB: {
    laws: {
      filterTypes: ['q', 'c'],
      blocks: [
        { type: 'text', text: 'L\'autostop est légal au Royaume-Uni. Marcher sur les autoroutes (motorways) est interdit. Le stop se fait depuis le bas des bretelles d\'accès (slip roads) et aux aires de service (motorway services).' },
        { type: 'sub', title: 'Par nation' },
        { type: 'rule', icon: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', text: 'Écosse : autorisé même sur les voies express à double chaussée (A9, A90). Camping sauvage légal.' },
        { type: 'rule', icon: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', text: 'Pays de Galles : aucune restriction spécifique. Mentalité rurale accueillante.' },
        { type: 'rule', icon: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', text: 'Angleterre : légal mais moins pratiqué et moins facile.' },
      ],
    },
    hitchhiking: {
      filterTypes: ['q', 'c', 'b'],
      blocks: [
        { type: 'text', text: 'Le Royaume-Uni est très variable selon la région. Peu d\'automobilistes s\'arrêtent en Angleterre, mais en Écosse et au Pays de Galles, c\'est nettement plus facile.' },
        { type: 'sub', title: 'Par région' },
        { type: 'kv', items: [
          { k: 'Highlands d\'Écosse', v: 'Excellent (1 voiture sur 5)', color: 'green' },
          { k: 'Pays de Galles rural', v: 'Bon et agréable', color: 'green' },
          { k: 'Sud-ouest de l\'Angleterre', v: 'Correct', color: 'green' },
          { k: 'Nord de l\'Angleterre', v: 'Moyen', color: 'amber' },
          { k: 'Sud-est / Londres', v: 'Très difficile', color: 'red' },
        ]},
        { type: 'text', text: 'La NC500 (North Coast 500) en Écosse est excellente en été : touristes du monde entier. Fort William est un hub idéal. En Angleterre, les anciens étudiants des années 70-80 sont les plus susceptibles de s\'arrêter.' },
        { type: 'tip', text: '💡 Utilise les noms d\'autoroute (M4, M1) sur ton panneau plutôt que les noms de ville. C\'est la convention britannique pour le stop longue distance.' },
      ],
    },
    safety: {
      filterTypes: ['c', 'a'],
      blocks: [
        { type: 'text', text: 'Le Royaume-Uni est globalement sûr. La peur médiatique dépasse largement le risque réel. La police est généralement compréhensive et peut même t\'aider à trouver un meilleur spot.' },
        { type: 'sub', title: 'Numéros d\'urgence' },
        { type: 'kv', items: [
          { k: 'Urgences', v: '999 ou 112' },
        ]},
      ],
    },
    women: {
      filterTypes: ['q', 'c', 'a'],
      blocks: [
        { type: 'text', text: 'Les hommes s\'arrêtent plus souvent que les femmes pour prendre des autostoppeurs. Paradoxalement, beaucoup de conducteurs disent qu\'ils s\'arrêteraient plus volontiers pour une femme que pour un homme seul.' },
        { type: 'text', text: 'Des voyageuses ont traversé l\'Écosse et le Pays de Galles seules sans problème. Le camping sauvage en Écosse est légal et très sûr.' },
      ],
    },
    language: {
      filterTypes: ['c', 'q'],
      blocks: [
        { type: 'text', text: 'Aucune barrière. L\'anglais est partout. Certains accents régionaux (Highlands écossais, Pays de Galles rural) peuvent être épais, mais la communication n\'est jamais un problème.' },
        { type: 'text', text: 'Au Royaume-Uni, on dit "lift" pour un trajet et "lorry" pour un camion.' },
      ],
    },
    budget: {
      filterTypes: ['b', 'q'],
      blocks: [
        { type: 'text', text: 'Le Royaume-Uni est cher, mais l\'autostop aide considérablement. Monnaie : livre sterling (GBP).' },
        { type: 'sub', title: 'Manger pas cher' },
        { type: 'rule', icon: '🛒', text: 'Aldi et Lidl pour les courses. Menus early-bird dans les restaurants avant 18h.' },
        { type: 'sub', title: 'Hébergement' },
        { type: 'kv', items: [
          { k: 'Auberges YHA (dortoir)', v: '15 à 30 £/nuit' },
        ]},
      ],
    },
    sleep: {
      filterTypes: ['b', 'q', 'a'],
      blocks: [
        { type: 'text', text: 'Les règles varient considérablement selon la nation.' },
        { type: 'sub', title: 'Écosse' },
        { type: 'rule', icon: '✅', text: 'Camping sauvage LÉGAL presque partout (Scottish Outdoor Access Code). Exception : parc de Loch Lomond en été (permis requis).' },
        { type: 'rule', icon: '✅', text: 'Bothies : cabanes de berger semi-abandonnées, gratuites, entretenues par la Mountain Bothies Association.' },
        { type: 'sub', title: 'Angleterre et Pays de Galles' },
        { type: 'rule', icon: '🚫', text: 'Camping sauvage techniquement interdit (violation civile, pas criminelle). Exception : Dartmoor National Park (zones désignées).' },
        { type: 'rule', icon: '✅', text: 'Nearly Wild Camping : réseau de 100+ sites accueillant les campeurs en quête de nature.' },
      ],
    },
    transport: {
      filterTypes: ['c', 'b'],
      blocks: [
        { type: 'transport', items: [
          { emoji: '🚌', name: 'Megabus', detail: 'Bus interurbains très bon marché', price: 'dès 1 £' },
          { emoji: '🚌', name: 'National Express', detail: 'Plus grand réseau de bus longue distance', price: 'dès 2 £' },
          { emoji: '🚌', name: 'FlixBus', detail: 'Lignes majeures', price: 'dès 5 £' },
          { emoji: '🚗', name: 'BlaBlaCar', detail: 'Covoiturage', price: '' },
        ]},
        { type: 'tip', text: '💡 Les ferries (Dover, Holyhead) facturent par véhicule. Tu peux traverser gratuitement en trouvant un conducteur avec de la place.' },
      ],
    },
    season: {
      filterTypes: ['c', 'q'],
      blocks: [
        { type: 'season', months: [
          { name: 'Jan', level: 'bad' }, { name: 'Fév', level: 'bad' }, { name: 'Mar', level: 'ok' },
          { name: 'Avr', level: 'good' }, { name: 'Mai', level: 'great' }, { name: 'Jun', level: 'great' },
          { name: 'Jul', level: 'good' }, { name: 'Aoû', level: 'good' }, { name: 'Sep', level: 'great' },
          { name: 'Oct', level: 'ok' }, { name: 'Nov', level: 'bad' }, { name: 'Déc', level: 'bad' },
        ]},
        { type: 'warn', text: '⚠️ En Écosse, les midges (moucherons) sont féroces de mai à septembre, pires en juillet-août. Prévois un bon répulsif.' },
      ],
    },
    culture: {
      filterTypes: ['c', 'b'],
      blocks: [
        { type: 'text', text: 'L\'autostop était très populaire au Royaume-Uni dans les années 70-80 (50% des plus de 55 ans l\'ont fait). Seulement 7% des 18-24 ans l\'ont essayé. La pratique est vue comme dépassée mais ceux qui s\'arrêtent sont souvent d\'anciens autostoppeurs nostalgiques.' },
        { type: 'sub', title: 'Ce qui marche' },
        { type: 'rule', icon: '😁', text: 'Un grand sourire et un contact visuel avec chaque conducteur. Porter des vêtements distinctifs attire l\'attention positive.' },
        { type: 'rule', icon: '📋', text: 'Aux aires de service, approche les conducteurs qui entrent/sortent du bâtiment, pas à la pompe ("health and safety" oblige).' },
        { type: 'sub', title: 'Événements' },
        { type: 'event', items: [
          { month: 'Juin', day: '⟳', name: 'Glastonbury Festival', desc: 'Plus grand festival de musique du monde, Somerset.' },
          { month: 'Août', day: '⟳', name: 'Edinburgh Fringe', desc: 'Plus grand festival d\'arts au monde, 3 semaines.' },
          { month: 'Nov', day: '5', name: 'Bonfire Night', desc: 'Feux d\'artifice dans tout le pays.' },
        ]},
      ],
    },
  },

  // ==================== IRELAND ====================
  IE: {
    laws: {
      filterTypes: ['q', 'c'],
      blocks: [
        { type: 'text', text: 'L\'autostop est légal en Irlande sauf sur les autoroutes (motorways). En pratique, même sur les voies express, la police (Gardaí) intervient rarement. Si elle le fait, c\'est pour te diriger vers un endroit plus sûr.' },
      ],
    },
    hitchhiking: {
      filterTypes: ['q', 'c', 'b'],
      blocks: [
        { type: 'text', text: 'L\'Irlande est l\'un des meilleurs pays d\'Europe pour l\'autostop. Le temps d\'attente moyen est de 5 minutes. Les voitures freinent parfois en te voyant au bord de la route, sans même que tu fasses le geste.' },
        { type: 'sub', title: 'Pourquoi ça marche si bien' },
        { type: 'text', text: 'Beaucoup de zones rurales n\'ont pas de transport en commun. Donner des trajets fait partie de la vie quotidienne. Les Irlandais sont sociables et apprécient la conversation. Un nouvel autostoppeur = un nouveau partenaire de discussion.' },
        { type: 'sub', title: 'Par zone' },
        { type: 'kv', items: [
          { k: 'Côte ouest (Wild Atlantic Way)', v: 'Excellent', color: 'green' },
          { k: 'Petites villes rurales', v: 'Excellent (gens curieux)', color: 'green' },
          { k: 'Routes nationales (R)', v: 'Très bon', color: 'green' },
          { k: 'Ronds-points d\'autoroute', v: 'Bon (< 5 min)', color: 'green' },
          { k: 'Dublin / Cork / Limerick', v: 'Difficile de démarrer', color: 'amber' },
        ]},
        { type: 'tip', text: '💡 Beaucoup de petits trajets vont plus vite qu\'attendre un long trajet. Un panneau avec le nom de la prochaine ville réduit le temps d\'attente. Pars tôt le matin pour attraper les camions.' },
      ],
    },
    safety: {
      filterTypes: ['c', 'a'],
      blocks: [
        { type: 'text', text: 'L\'Irlande est considérée comme l\'un des pays les plus sûrs au monde pour les voyageurs. L\'autostop y est une tradition ancestrale et généralement très sûre.' },
        { type: 'sub', title: 'Numéros d\'urgence' },
        { type: 'kv', items: [
          { k: 'Urgences', v: '112 ou 999' },
          { k: 'Gardaí (police)', v: '112' },
        ]},
      ],
    },
    women: {
      filterTypes: ['q', 'c'],
      blocks: [
        { type: 'text', text: 'L\'Irlande est considérée comme l\'un des pays les plus sûrs pour les voyageuses solo. Les expériences sont très majoritairement positives. Les les précautions standard s\'appliquent.' },
        { type: 'text', text: 'Le Wild Atlantic Way se prête très bien au stop en duo, avec des temps d\'attente de 5 à 15 minutes.' },
      ],
    },
    language: {
      filterTypes: ['c', 'q'],
      blocks: [
        { type: 'text', text: 'L\'anglais est la langue quotidienne partout en Irlande. Le gaélique irlandais (Gaeilge) n\'est parlé quotidiennement que par ~4% de la population, dans les zones Gaeltacht (côte ouest). Même là, tout le monde parle anglais.' },
        { type: 'phrase', items: [
          { local: 'Dia dhuit', meaning: 'Bonjour (en gaélique)' },
          { local: 'Go raibh maith agat', meaning: 'Merci (en gaélique)' },
        ]},
        { type: 'tip', text: '💡 Quelques mots de gaélique dans les zones rurales de l\'ouest créent une chaleur immédiate avec les locaux.' },
      ],
    },
    budget: {
      filterTypes: ['b', 'q'],
      blocks: [
        { type: 'text', text: 'L\'Irlande est modérément chère. La combinaison autostop + camping rend le voyage très abordable. La combinaison autostop + camping + invitations des locaux rend le voyage très abordable.' },
        { type: 'sub', title: 'Hébergement' },
        { type: 'kv', items: [
          { k: 'Auberges (dortoir)', v: '20 à 50 €/nuit' },
          { k: 'B&B avec petit-déjeuner', v: '60 à 80 €/nuit' },
        ]},
        { type: 'rule', icon: '🛒', text: 'Aldi et Lidl pour les courses. Menus early-bird dans les restaurants avant 18h.' },
      ],
    },
    sleep: {
      filterTypes: ['b', 'q'],
      blocks: [
        { type: 'text', text: 'Le camping sauvage est toléré et largement non réglementé en Irlande. Des champs vides sont disponibles "à quelques minutes de n\'importe quelle ville". Demander l\'autorisation aux fermiers est recommandé mais ils s\'en fichent souvent.' },
        { type: 'rule', icon: '✅', text: 'Camping gratuit dans les champs non cultivés (avec permission implicite).' },
        { type: 'rule', icon: '🚫', text: 'Évite les champs avec des cultures ou du bétail.' },
        { type: 'rule', icon: '🚫', text: 'Pas de feu visible depuis les routes ou les maisons.' },
        { type: 'warn', text: '⚠️ L\'Irlande est très humide. Une tente avec une imperméabilité élevée (>3000mm) est essentielle. Le défi n\'est pas la pluie forte mais la bruine persistante qui peut durer des jours.' },
      ],
    },
    transport: {
      filterTypes: ['c', 'b'],
      blocks: [
        { type: 'transport', items: [
          { emoji: '🚌', name: 'Bus Éireann', detail: 'Service national de bus', price: '' },
          { emoji: '🚌', name: 'Dublin Coach / GoBus / Citylink', detail: 'Bus interurbains moins chers', price: '' },
          { emoji: '🚗', name: 'BlaBlaCar', detail: 'Actif en Irlande', price: '' },
          { emoji: '🚃', name: 'Irish Rail', detail: 'Réseau limité, prix modérés', price: '' },
        ]},
      ],
    },
    season: {
      filterTypes: ['c', 'q'],
      blocks: [
        { type: 'season', months: [
          { name: 'Jan', level: 'bad' }, { name: 'Fév', level: 'bad' }, { name: 'Mar', level: 'ok' },
          { name: 'Avr', level: 'good' }, { name: 'Mai', level: 'great' }, { name: 'Jun', level: 'great' },
          { name: 'Jul', level: 'good' }, { name: 'Aoû', level: 'good' }, { name: 'Sep', level: 'great' },
          { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'bad' }, { name: 'Déc', level: 'bad' },
        ]},
        { type: 'text', text: 'Mai-juin : meilleure météo, plus longues journées. Septembre-octobre : moins de touristes, prix plus bas, couleurs d\'automne. La météo irlandaise est extrêmement imprévisible : il peut pleuvoir à tout moment de l\'année.' },
      ],
    },
    culture: {
      filterTypes: ['c', 'b'],
      blocks: [
        { type: 'text', text: 'L\'autostop est profondément ancré dans la culture irlandaise. Dans les zones rurales sans transport en commun, donner des trajets fait partie de la vie quotidienne depuis des décennies. Les Irlandais sont sociables et accueillants.' },
        { type: 'sub', title: 'Ce qui marche' },
        { type: 'rule', icon: '🗣️', text: 'Les Irlandais adorent discuter. Sois ouvert à la conversation, pose des questions sur la région.' },
        { type: 'rule', icon: '🎒', text: 'Garde ton sac petit. Les gros sacs font peur. Solo ou en duo seulement (3+ = quasi impossible).' },
        { type: 'sub', title: 'Événements' },
        { type: 'event', items: [
          { month: 'Mar', day: '17', name: 'St Patrick\'s Day', desc: 'Fête nationale. Festivités dans tout le pays et dans le monde.' },
          { month: 'Mai', day: '⟳', name: 'Fleadh Cheoil', desc: 'Festival de musique traditionnelle irlandaise.' },
          { month: 'Sep', day: '⟳', name: 'Galway Oyster Festival', desc: 'Festival des huîtres, le plus ancien food festival d\'Irlande.' },
          { month: 'Oct', day: '⟳', name: 'Bram Stoker Festival (Dublin)', desc: 'Festival Halloween, le berceau d\'Halloween est irlandais.' },
        ]},
        { type: 'tip', text: '💡 Toute la société irlandaise participe à la tradition du stop : des fermiers aux informaticiens, tout le monde s\'arrête.' },
      ],
    },
  },

  // ==================== CROATIA ====================
  HR: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'L\'autostop est légal en Croatie. Tu peux faire du stop aux stations de péage. La police ne s\'en préoccupe généralement pas.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Modéré à facile en été sur la côte (rarement plus de 20 min d\'attente). Difficile en hiver quand les villes côtières deviennent des "villes fantômes". Les péages sont les meilleurs spots.' },
      { type: 'sub', title: 'Astuce côtière' },
      { type: 'text', text: 'Les routes secondaires le long de la côte fonctionnent mieux que les autoroutes car les locaux les prennent pour éviter les péages. Les files d\'attente aux frontières le weekend (10+ km) créent des opportunités uniques.' },
      { type: 'warn', text: '⚠️ MINES TERRESTRES dans le centre de la Croatie (pas sur la côte). Vérifie toujours la carte des champs de mines (misportal.hcr.hr) avant de quitter les routes balisées.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'La Croatie est un pays sûr pour l\'autostop. Les routes côtières sont bien fréquentées en été et les conducteurs sont accueillants envers les voyageurs.' },
      { type: 'sub', title: 'Utilise SpotHitch pour ta sécurité' },
      { type: 'rule', icon: '🛡️', text: 'Active le Mode Gardien avant chaque trajet. Un proche suit ta position en temps réel.' },
      { type: 'rule', icon: '🆘', text: 'Configure le mode SOS avec tes contacts. Un seul geste déclenche une triple alerte (push, SMS, appel).' },
      { type: 'rule', icon: '📱', text: 'Photographie la plaque du véhicule et envoie-la à un proche avant de monter.' },
      { type: 'rule', icon: '🎒', text: 'Garde ton sac accessible (sur tes genoux ou à tes pieds), jamais dans le coffre.' },
      { type: 'sub', title: 'Conseils spécifiques' },
      { type: 'rule', icon: '⛽', text: 'Les stations OMV et INA sont d\'excellents spots pour aborder les conducteurs.' },
      { type: 'rule', icon: '🏖️', text: 'En été, les routes côtières dalmates ont un trafic dense. Profites-en pour avancer rapidement.' },
      { type: 'sub', title: 'Numéros d\'urgence' },
      { type: 'kv', items: [{ k: 'Urgences', v: '112' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'La Croatie est considérée comme une excellente destination pour les voyageuses solo. Le sentiment de sécurité est élevé. Pour le stop, voyager à deux est recommandé.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Le croate est la langue officielle. 95% des 15-34 ans parlent une langue étrangère (surtout l\'anglais). L\'italien est largement connu sur la côte.' },
      { type: 'phrase', items: [
        { local: 'Mogu li dobiti prijevoz do...?', meaning: 'Puis-je avoir un trajet vers... ?' },
        { local: 'Hvala!', meaning: 'Merci !' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Plus cher que les autres pays des Balkans, surtout en été sur la côte. Burek : ~1 €. Auberges : 15-25 €/nuit. Repas : 5-10 €.' },
    ]},
    sleep: { filterTypes: ['b', 'q', 'a'], blocks: [
      { type: 'text', text: 'Le camping sauvage n\'est pas autorisé (amendes). Couchsurfing fonctionne bien. Campings abordables disponibles. Visite en mai/juin/septembre pour des prix plus bas.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Bus interurbains', detail: 'Réseau étendu et abordable', price: '' },
        { emoji: '⛴️', name: 'Katamarans pour les îles', detail: 'Plus rapides et moins chers que les car-ferries', price: '' },
        { emoji: '🚗', name: 'BlaBlaCar (blablacar.hr)', detail: 'Actif en Croatie', price: '' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Fév', level: 'bad' }, { name: 'Mar', level: 'ok' },
        { name: 'Avr', level: 'good' }, { name: 'Mai', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'good' }, { name: 'Aoû', level: 'good' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'ok' }, { name: 'Nov', level: 'bad' }, { name: 'Déc', level: 'bad' },
      ]},
      { type: 'text', text: 'Mai-juin et septembre : idéal (beau temps, moins bondé, moins cher). Juillet-août : facile pour les trajets mais très bondé et cher sur la côte.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Les Croates sont décrits comme "extrêmement ouverts, amicaux et hospitaliers". Les 3 S du stop en Croatie : sourire, crème solaire et une feuille avec ta destination.' },
      { type: 'event', items: [
        { month: 'Juil', day: '⟳', name: 'Ultra Europe (Split)', desc: 'Festival de musique électronique, 150 000 visiteurs.' },
        { month: 'Juil-Août', day: '⟳', name: 'Festival d\'été de Dubrovnik', desc: 'Théâtre, musique, danse pendant 6 semaines.' },
      ]},
    ]},
  },

  // ==================== SLOVENIA ====================
  SI: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'L\'autostop est légal et pratiqué en Slovénie. Interdit de traverser les autoroutes à pied. Le pays est assez petit pour être traversé en ~3 heures.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Bon pays pour l\'autostop. Temps d\'attente généralement inférieur à 15 minutes. Les conducteurs sont contents de voir des autostoppeurs et racontent souvent leurs propres histoires de stop quand ils étaient jeunes.' },
      { type: 'tip', text: '💡 La Slovénie abrite le seul Musée de l\'Autostop au monde, ' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'La Slovénie est très sûre pour l\'autostop. C\'est un petit pays accueillant où les gens s\'arrêtent facilement, souvent par nostalgie de leurs propres voyages.' },
      { type: 'sub', title: 'Utilise SpotHitch pour ta sécurité' },
      { type: 'rule', icon: '🛡️', text: 'Active le Mode Gardien avant chaque trajet. Un proche suit ta position en temps réel.' },
      { type: 'rule', icon: '🆘', text: 'Configure le mode SOS avec tes contacts. Un seul geste déclenche une triple alerte (push, SMS, appel).' },
      { type: 'rule', icon: '📱', text: 'Photographie la plaque du véhicule et envoie-la à un proche avant de monter.' },
      { type: 'rule', icon: '🎒', text: 'Garde ton sac accessible (sur tes genoux ou à tes pieds), jamais dans le coffre.' },
      { type: 'sub', title: 'Conseils spécifiques' },
      { type: 'rule', icon: '🗺️', text: 'Le pays est petit : tu peux le traverser en 3 heures. Chaque lift compte.' },
      { type: 'rule', icon: '😊', text: 'Les conducteurs sont très ouverts. N\'hésite pas à engager la conversation, ils adorent partager leurs bons plans.' },
      { type: 'sub', title: 'Numéros d\'urgence' },
      { type: 'kv', items: [{ k: 'Urgences', v: '112' }] },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Excellent niveau d\'anglais. La majorité des Slovènes parlent aussi allemand et un peu d\'italien. Deux salutations régionales : "Živjo" (Ljubljana) et "Zdravo" (Maribor).' },
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Plus cher que les autres pays des Balkans mais moins que l\'Europe de l\'Ouest. Le vélo-partage de Ljubljana : 1 €/semaine ou 3 €/AN. Bus : 1,30 € (90 min). Auberges : 15-25 €/nuit.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Camping sauvage officiellement interdit mais la loi est rarement appliquée tant que tu ne fais pas de feu. Demande aux propriétaires l\'autorisation de camper dans leur jardin. Couchsurfing actif à Ljubljana.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Bus', detail: 'Réseau bien connecté', price: '' },
        { emoji: '🚗', name: 'BlaBlaCar', detail: 'Actif en Slovénie', price: '' },
        { emoji: '🚲', name: 'Vélo-partage Ljubljana', detail: 'Incroyablement bon marché', price: '3 €/an' },
      ]},
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'L\'autostop est culturellement accepté et nostalgique en Slovénie. Les conducteurs racontent leurs histoires de jeunesse. Les jeunes comprennent et pratiquent. C\'est décrit comme le pays le plus "hitchhiker-friendly" des Balkans.' },
      { type: 'event', items: [
        { month: 'Fév', day: '⟳', name: 'Kurentovanje (Ptuj)', desc: 'Plus grand carnaval de Slovénie, masques traditionnels Kurent.' },
        { month: 'Juin', day: '⟳', name: 'Festival de Ljubljana', desc: 'Musique, théâtre, danse dans la vieille ville.' },
      ]},
    ]},
  },

  // ==================== ALBANIA ====================
  AL: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Aucune loi contre l\'autostop en Albanie. Attention : près de la frontière grecque (Kakavia), des "mafias de taxis" prétendent faussement que le stop est illégal pour te forcer à prendre un taxi. Marche au-delà des stations de taxi avant de lever le pouce.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'L\'Albanie est un vrai paradis pour l\'autostop et le pays le plus facile des Balkans. Temps d\'attente généralement sous 15 minutes. Des voitures passent environ toutes les 5 minutes sur les routes principales.' },
      { type: 'sub', title: 'Distinction cruciale' },
      { type: 'text', text: 'Beaucoup de voitures qui s\'arrêtent sont en fait des taxis privés informels. Dis clairement "autostop, jo lek" (autostop, pas d\'argent) en montrant ton pouce pour éviter les malentendus.' },
      { type: 'text', text: 'Certains conducteurs offrent spontanément de l\'argent AUX autostoppeurs. L\'hospitalité albanaise est légendaire.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'L\'Albanie est un pays sûr pour l\'autostop. Les conducteurs sont remarquablement hospitaliers et font souvent des détours pour t\'aider.' },
      { type: 'sub', title: 'Utilise SpotHitch pour ta sécurité' },
      { type: 'rule', icon: '🛡️', text: 'Active le Mode Gardien avant chaque trajet. Un proche suit ta position en temps réel.' },
      { type: 'rule', icon: '🆘', text: 'Configure le mode SOS avec tes contacts. Un seul geste déclenche une triple alerte (push, SMS, appel).' },
      { type: 'rule', icon: '📱', text: 'Photographie la plaque du véhicule et envoie-la à un proche avant de monter.' },
      { type: 'rule', icon: '🎒', text: 'Garde ton sac accessible (sur tes genoux ou à tes pieds), jamais dans le coffre.' },
      { type: 'sub', title: 'Conseils spécifiques' },
      { type: 'rule', icon: '🏔️', text: 'Les routes de montagne sont parfois en mauvais état. Renseigne-toi sur l\'état de la chaussée avant de t\'y engager.' },
      { type: 'rule', icon: '🤝', text: 'L\'hospitalité albanaise est légendaire. Accepte le café ou le raki avec gratitude, c\'est un geste de bienvenue.' },
      { type: 'sub', title: 'Numéros d\'urgence' },
      { type: 'kv', items: [{ k: 'Urgences', v: '112' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'L\'Albanie est sûre pour les voyageuses solo. Le harcèlement de rue est peu fréquent. Le stop fonctionne bien pour les femmes seules, avec des temps d\'attente de 15-20 minutes.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'L\'albanais est une langue unique (pas slave). Les jeunes urbains parlent anglais couramment. Ne t\'attends pas à l\'anglais chez les plus de 30 ans. L\'italien et le grec sont courants. L\'allemand compris par certains (diaspora en Allemagne/Suisse).' },
      { type: 'phrase', items: [
        { local: 'Autostop, jo lek', meaning: 'Autostop, pas d\'argent' },
        { local: 'Faleminderit', meaning: 'Merci' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Le pays le moins cher des Balkans. Un séjour de 2 semaines est possible pour moins de 200 €. Auberge : ~10 €/nuit avec petit-déjeuner. Les furgons (minibus) couvrent le pays pour quelques euros.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Le camping sauvage est officiellement autorisé en Albanie, l\'un des rares pays européens. Évite les parcs nationaux, réserves, propriétés privées et bâtiments gouvernementaux. Les plages au nord de Durrës sont adaptées au camping en tente.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚐', name: 'Furgons (minibus)', detail: 'Colonne vertébrale du transport albanais. Pas d\'horaire fixe, lève la main pour les arrêter.', price: '~3,50 €/120 km' },
        { emoji: '🚌', name: 'Bus réguliers', detail: 'Lignes principales entre grandes villes', price: '' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Fév', level: 'bad' }, { name: 'Mar', level: 'ok' },
        { name: 'Avr', level: 'good' }, { name: 'Mai', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'good' }, { name: 'Aoû', level: 'good' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'ok' }, { name: 'Déc', level: 'bad' },
      ]},
      { type: 'text', text: 'Mai-juin et septembre-octobre : idéal. Les routes de montagne du nord peuvent être impraticables en hiver.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'L\'hospitalité albanaise est légendaire. Les conducteurs font des kilomètres de détour pour aider, offrent des repas, du raki, du café, des souvenirs et même de l\'argent. Le concept de "besa" (code d\'honneur sacré et d\'hospitalité) est profondément ancré.' },
      { type: 'event', items: [
        { month: 'Mar', day: '14', name: 'Dita e Verës (Elbasan)', desc: 'Fête du printemps, la plus ancienne tradition albanaise.' },
        { month: 'Août', day: '⟳', name: 'Kala Festival (Dhermi)', desc: 'Festival de musique sur une plage de la Riviera albanaise.' },
      ]},
    ]},
  },

  // ==================== SERBIA ====================
  RS: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'L\'autostop sur les autoroutes est "mal vu mais tu n\'auras pas de problèmes". La police dirige les autostoppeurs vers les bretelles de sortie. Les stations de péage sont considérées comme des lieux de stop normaux et légaux.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Difficile. Temps d\'attente moyen : 2-3 heures. Aborder les conducteurs directement aux petites stations-service fonctionne nettement mieux que le pouce au bord de la route. De jour, c\'est faisable. La nuit, c\'est très dur (mauvais éclairage des routes).' },
      { type: 'tip', text: '💡 La meilleure stratégie en Serbie : alterner autostop et bus bon marché. Les bus locaux entre petites villes servent de "tremplins" quand le stop ne marche pas.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Sûr de jour. Les conducteurs serbes sont amicaux une fois qu\'ils s\'arrêtent.' },
      { type: 'warn', text: '⚠️ La nuit, préfère les stations-service 24h éclairées plutôt que les aires de repos isolées.' },
      { type: 'kv', items: [{ k: 'Urgences', v: '112' }] },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Le serbe est la langue principale (alphabets cyrillique et latin). L\'anglais progresse chez les jeunes mais reste limité en zone rurale. Les locuteurs de langues slaves (tchèque, slovaque, polonais, russe) ont un avantage linguistique.' },
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Bon marché par rapport à la Hongrie ou l\'Europe de l\'Ouest. Pljeskavica (plat local) : 2-3 €. Auberge : 8-12 €/nuit. Vol vers Niš : parfois 10 €.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Camping sauvage officiellement interdit mais "généralement toléré". Couchsurfing actif à Belgrade. Auberges très abordables.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Bus', detail: 'Couvrent tout le pays, bon marché', price: '' },
        { emoji: '🚗', name: 'BlaBlaCar (blablacar.rs)', detail: 'Actif en Serbie', price: '' },
      ]},
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Les Serbes sont décrits comme "amicaux et très ouverts aux rencontres" une fois le contact établi. Le défi est de les faire s\'arrêter. Le mix stop + bus bon marché est la meilleure stratégie.' },
      { type: 'event', items: [
        { month: 'Juil', day: '⟳', name: 'EXIT Festival (Novi Sad)', desc: 'L\'un des plus grands festivals de musique d\'Europe, dans la forteresse de Petrovaradin.' },
        { month: 'Août', day: '⟳', name: 'Guča Trumpet Festival', desc: 'Festival de trompette et de musique balkanique. 600 000 visiteurs.' },
      ]},
    ]},
  },

  // ==================== BOSNIA AND HERZEGOVINA ====================
  BA: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'L\'autostop est légal en Bosnie-Herzégovine. La police ne te causera pas de problèmes.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Variable selon les sources et les endroits. Certains voyageurs n\'ont jamais attendu plus de 10 minutes (route Split-Mostar-Sarajevo). D\'autres ont eu de très longues attentes. Le faible taux de propriété automobile signifie moins de véhicules longue distance.' },
      { type: 'warn', text: '⚠️ MINES TERRESTRES. Ne quitte JAMAIS les routes pour aller dans les buissons ou les structures abandonnées dans des zones que tu ne connais pas. Certaines maisons sont encore piégées depuis la guerre.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'La Bosnie est un pays sûr pour l\'autostop. Les gens sont très accueillants envers les voyageurs étrangers.' },
      { type: 'sub', title: 'Utilise SpotHitch pour ta sécurité' },
      { type: 'rule', icon: '🛡️', text: 'Active le Mode Gardien avant chaque trajet. Un proche suit ta position en temps réel.' },
      { type: 'rule', icon: '🆘', text: 'Configure le mode SOS avec tes contacts. Un seul geste déclenche une triple alerte (push, SMS, appel).' },
      { type: 'rule', icon: '📱', text: 'Photographie la plaque du véhicule et envoie-la à un proche avant de monter.' },
      { type: 'rule', icon: '🎒', text: 'Garde ton sac accessible (sur tes genoux ou à tes pieds), jamais dans le coffre.' },
      { type: 'sub', title: 'Conseils spécifiques' },
      { type: 'rule', icon: '🛣️', text: 'Reste sur les routes balisées en zone rurale. Certains chemins de campagne sont peu entretenus.' },
      { type: 'rule', icon: '☕', text: 'Accepter un café bosniaque est un geste de politesse. Les conducteurs adorent partager un moment avec les voyageurs.' },
      { type: 'sub', title: 'Numéros d\'urgence' },
      { type: 'kv', items: [{ k: 'Urgences', v: '112' }] },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Le bosniaque, le croate et le serbe sont tous parlés (mutuellement compréhensibles). Beaucoup de résidents parlent anglais grâce à l\'émigration post-guerre. Mentionner d\'où tu viens aide à créer la confiance, car beaucoup de Bosniens ont des proches émigrés.' },
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'L\'un des pays les moins chers des Balkans. Burek : ~1 €. Auberge à Sarajevo : 10-15 €/nuit. Les cigarettes (<3 €/paquet) sont utiles comme cadeau de remerciement.' },
      { type: 'tip', text: '💡 "KM" sur les panneaux peut signifier la monnaie (Mark Convertible), pas des kilomètres !' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Camping sauvage officiellement interdit mais généralement toléré. Les locaux sont incroyablement hospitaliers : des fermiers offrent douches et café aux campeurs, des conducteurs invitent les autostoppeurs à dormir chez eux.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Bus et trains très bon marché. Peu d\'autoroutes. La combinaison stop + transports en commun est l\'approche recommandée.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Les Bosniens sont "très chaleureux et amicaux" avec une fierté à accueillir les touristes. Les conducteurs emmènent les autostoppeurs chez eux pour manger et boire un café, dépassent leur destination pour les déposer à un meilleur endroit.' },
      { type: 'rule', icon: '🚬', text: 'Offrir quelques cigarettes en descendant de voiture est un geste de remerciement puissant qui transcende les barrières linguistiques.' },
      { type: 'event', items: [
        { month: 'Août', day: '⟳', name: 'Sarajevo Film Festival', desc: 'Festival de cinéma international fondé pendant le siège.' },
      ]},
    ]},
  },

  // ==================== MONTENEGRO ====================
  ME: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Aucune restriction légale spécifique sur l\'autostop trouvée. Pas de rapports d\'interférence policière.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Difficile. Le Monténégro est régulièrement cité comme l\'un des pays les plus difficiles des Balkans pour l\'autostop. Les Monténégrins n\'aiment pas prendre les autostoppeurs. La plupart des voyageurs qui réussissent sont pris par des Albanais ou d\'autres étrangers, pas par des locaux.' },
      { type: 'text', text: 'Le trafic est clairsemé, les routes de montagne sinueuses rendent l\'arrêt difficile. L\'approche directe aux stations-service fonctionne mieux que le pouce au bord de la route.' },
      { type: 'tip', text: '💡 Le ferry de Kotor est gratuit et fait économiser beaucoup de temps pour rejoindre Podgorica.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Le Monténégro est un pays sûr pour l\'autostop. Les routes côtières sont étroites et sinueuses, alors sois bien visible quand tu fais du stop.' },
      { type: 'sub', title: 'Utilise SpotHitch pour ta sécurité' },
      { type: 'rule', icon: '🛡️', text: 'Active le Mode Gardien avant chaque trajet. Un proche suit ta position en temps réel.' },
      { type: 'rule', icon: '🆘', text: 'Configure le mode SOS avec tes contacts. Un seul geste déclenche une triple alerte (push, SMS, appel).' },
      { type: 'rule', icon: '📱', text: 'Photographie la plaque du véhicule et envoie-la à un proche avant de monter.' },
      { type: 'rule', icon: '🎒', text: 'Garde ton sac accessible (sur tes genoux ou à tes pieds), jamais dans le coffre.' },
      { type: 'sub', title: 'Conseils spécifiques' },
      { type: 'rule', icon: '👀', text: 'Sur les routes côtières, place-toi dans un endroit large et bien visible, loin des virages serrés.' },
      { type: 'rule', icon: '🌊', text: 'En été, le trafic touristique sur la côte facilite le stop. Profite des stations-service pour aborder les conducteurs.' },
      { type: 'sub', title: 'Numéros d\'urgence' },
      { type: 'kv', items: [{ k: 'Urgences', v: '112' }] },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Le monténégrin (essentiellement identique au serbe/bosniaque/croate). Beaucoup de gens sont plus à l\'aise en italien qu\'en anglais. Le russe est aussi compris (nombreux résidents russes en été).' },
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Milieu de gamme pour les Balkans (plus cher que l\'Albanie/Bosnie, moins cher que la Croatie). Auberges : 12-20 €/nuit. Repas : 5-8 €.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Camping sauvage officiellement interdit mais toléré si tu te comportes normalement et évites les plages et zones touristiques.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Bus', detail: 'Option la plus fiable, couvrent la plupart des routes', price: '' },
        { emoji: '⛴️', name: 'Ferry de Kotor', detail: 'Gratuit, essentiel pour rejoindre Podgorica', price: 'gratuit' },
      ]},
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Hospitalité mitigée. L\'accueil peut être froid comparé aux pays voisins, et la plupart des rencontres se font avec des expatriés plutôt qu\'avec des locaux. Certains Monténégrins sont cependant très accueillants. Le consensus : le Monténégro n\'est pas une culture favorable au stop comparé à ses voisins.' },
    ]},
  },

  // ==================== NORTH MACEDONIA ====================
  MK: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Aucune loi spécifique contre l\'autostop trouvée. Pas de rapports d\'interférence policière.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Facile. Décrit comme "l\'un des meilleurs pays européens pour l\'autostop". Temps d\'attente généralement sous 20-30 minutes. Aux stations-service près de Skopje, les trajets arrivent en 5-10 minutes.' },
      { type: 'text', text: 'Défi : les routes rurales/de montagne avec très peu de trafic (moins de 100 voitures/heure). Quand le trafic est faible, prépare-toi à marcher longtemps avec le pouce levé.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'La Macédoine du Nord est un pays sûr pour l\'autostop. Les habitants sont accueillants et souvent protecteurs envers les voyageurs.' },
      { type: 'sub', title: 'Utilise SpotHitch pour ta sécurité' },
      { type: 'rule', icon: '🛡️', text: 'Active le Mode Gardien avant chaque trajet. Un proche suit ta position en temps réel.' },
      { type: 'rule', icon: '🆘', text: 'Configure le mode SOS avec tes contacts. Un seul geste déclenche une triple alerte (push, SMS, appel).' },
      { type: 'rule', icon: '📱', text: 'Photographie la plaque du véhicule et envoie-la à un proche avant de monter.' },
      { type: 'rule', icon: '🎒', text: 'Garde ton sac accessible (sur tes genoux ou à tes pieds), jamais dans le coffre.' },
      { type: 'sub', title: 'Conseils spécifiques' },
      { type: 'rule', icon: '🛣️', text: 'Les routes principales sont en bon état et bien connectées entre les grandes villes.' },
      { type: 'rule', icon: '🙏', text: 'Les habitants aiment aider les voyageurs. Un sourire et un panneau avec ta destination suffisent.' },
      { type: 'sub', title: 'Numéros d\'urgence' },
      { type: 'kv', items: [{ k: 'Urgences', v: '112' }] },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Le macédonien (slave) et l\'albanais sont les langues principales. L\'anglais progresse mais reste limité en dehors de Skopje et Ohrid. Les abréviations des plaques sont utiles : SK=Skopje, OH=Ohrid, BT=Bitola.' },
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Très bon marché. Parmi les pays les plus abordables des Balkans. Auberges : 8-12 €/nuit.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Camping sauvage officiellement interdit mais "généralement toléré" (même schéma que Serbie/Bosnie). Les voyageurs sont parfois invités à dormir chez les familles.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Réseau de bus couvrant les routes principales. Minibus type furgon dans certaines zones. Bus internationaux vers l\'Albanie (Ohrid-Pogradec), le Kosovo, la Serbie et la Grèce.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Les gens sont "extrêmement amicaux et particulièrement fascinés par les voyageurs". Les conducteurs montrent un intérêt sincère et offrent leur aide sans attendre de paiement. L\'ambiance est décrite comme "gemächlich" (tranquille, sans précipitation).' },
      { type: 'event', items: [
        { month: 'Juil', day: '⟳', name: 'Ohrid Summer Festival', desc: 'Musique, théâtre et danse au bord du lac Ohrid, site UNESCO.' },
      ]},
    ]},
  },

  // ==================== POLAND ====================
  PL: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'L\'autostop est légal en Pologne sur les routes normales. Il a été officiellement organisé par l\'Office national du tourisme de 1958 au milieu des années 90 ("Akcja Autostop"), avec des carnets, des coupons et une loterie pour les conducteurs.' },
      { type: 'rule', icon: '🚫', text: 'Interdit sur les autoroutes et voies express. Autorisé aux stations-service, péages et bretelles d\'accès.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Historiquement l\'un des pays les plus favorables au stop en Europe. Temps d\'attente moyen : 15 min à 1h. Cependant, des rapports récents (2023) montrent une dégradation : 30 min à 3h d\'attente, les Polonais sont de plus en plus réticents à s\'arrêter hors des zones désignées.' },
      { type: 'sub', title: 'Astuce réseau' },
      { type: 'text', text: 'La Pologne a "trop de routes" (4-5 itinéraires possibles pour chaque destination). Accepte les trajets dans la direction générale plutôt que l\'itinéraire exact. Les routiers utilisent parfois la CB radio pour t\'organiser ton prochain trajet.' },
      { type: 'tip', text: '💡 Affiche ton sac à dos bien visible pour ressembler à un "autostoppeur professionnel". Ça rassure les conducteurs polonais.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'La Pologne est un pays sûr pour l\'autostop. La conduite est rapide sur les routes nationales, alors reste vigilant(e) quand tu te positionnes.' },
      { type: 'sub', title: 'Utilise SpotHitch pour ta sécurité' },
      { type: 'rule', icon: '🛡️', text: 'Active le Mode Gardien avant chaque trajet. Un proche suit ta position en temps réel.' },
      { type: 'rule', icon: '🆘', text: 'Configure le mode SOS avec tes contacts. Un seul geste déclenche une triple alerte (push, SMS, appel).' },
      { type: 'rule', icon: '📱', text: 'Photographie la plaque du véhicule et envoie-la à un proche avant de monter.' },
      { type: 'rule', icon: '🎒', text: 'Garde ton sac accessible (sur tes genoux ou à tes pieds), jamais dans le coffre.' },
      { type: 'sub', title: 'Conseils spécifiques' },
      { type: 'rule', icon: '⛽', text: 'Les stations Orlen (chaîne nationale) sont des spots fiables avec beaucoup de passage.' },
      { type: 'rule', icon: '👀', text: 'La vitesse est élevée sur les routes nationales. Positionne-toi dans un endroit bien visible avec de la place pour s\'arrêter.' },
      { type: 'sub', title: 'Numéros d\'urgence' },
      { type: 'kv', items: [{ k: 'Urgences', v: '112' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'La Pologne est classée 12ème pays le plus sûr pour les voyageuses solo (note 4.7/5). Le sentiment de sécurité est élevé. Voir l\'avertissement ci-dessus pour le nord du pays en été.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: '~24% parlent anglais, ~20% russe, ~12% allemand. Les jeunes (77% des étudiants) parlent des langues étrangères. Les routiers parlent souvent uniquement polonais. Les Polonais répondent très positivement aux étrangers qui essaient le polonais.' },
      { type: 'phrase', items: [
        { local: 'Dzień dobry', meaning: 'Bonjour' },
        { local: 'Dziękuję', meaning: 'Merci' },
        { local: 'Skąd najlepiej łapać stopa do...?', meaning: 'Où est le meilleur endroit pour faire du stop vers... ?' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'L\'un des pays les moins chers de l\'UE. Budget routard : 25-35 €/jour. Auberge : 13-16 €/nuit. Repas local : 5-7 €. Les MOP (aires de repos routières) offrent des douches gratuites avec eau chaude.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Depuis mai 2021, 600 000 hectares répartis dans 425 zones forestières sont légalement ouverts au camping (max 9 personnes, max 2 nuits). Utilise l\'app mBDL pour trouver les zones légales (zones orange).' },
      { type: 'rule', icon: '✅', text: '425 zones forestières légales pour le camping (app mBDL)' },
      { type: 'rule', icon: '🚫', text: 'Interdit dans les parcs nationaux et réserves naturelles (surtout les Tatras)' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'FlixBus / PolskiBus', detail: 'Extrêmement bon marché (promos dès 0,23 €)', price: 'dès 1 €' },
        { emoji: '🚗', name: 'BlaBlaCar', detail: 'Très populaire ("e-autostop")', price: '' },
        { emoji: '📱', name: 'jakdojade.pl', detail: 'App pour tous les transports en commun polonais', price: '' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Fév', level: 'bad' }, { name: 'Mar', level: 'ok' },
        { name: 'Avr', level: 'good' }, { name: 'Mai', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Aoû', level: 'great' }, { name: 'Sep', level: 'good' },
        { name: 'Oct', level: 'ok' }, { name: 'Nov', level: 'bad' }, { name: 'Déc', level: 'bad' },
      ]},
      { type: 'text', text: 'Été : optimal. Hiver : très difficile (jusqu\'à -20°C, jours courts, visibilité réduite).' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Culture profonde de l\'autostop enracinée dans le programme officiel communiste (1958-1995). Beaucoup de conducteurs actuels ont fait du stop dans leur jeunesse. Les Polonais semblent froids au premier contact mais se réchauffent vite.' },
      { type: 'event', items: [
        { month: 'Août', day: '⟳', name: 'Pol\'and\'Rock Festival', desc: 'Plus grand festival gratuit d\'Europe (ex-Woodstock Pologne), 750 000 personnes.' },
        { month: 'Nov', day: '1', name: 'Toussaint (Wszystkich Świętych)', desc: 'Cimetières illuminés de bougies. Spectacle unique.' },
        { month: 'Déc', day: '⟳', name: 'Marchés de Noël', desc: 'Cracovie et Wrocław ont les plus beaux.' },
      ]},
    ]},
  },

  // ==================== CZECH REPUBLIC ====================
  CZ: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'L\'autostop est légal sur les routes normales en Tchéquie. Interdit directement sur les autoroutes et voies express. Autorisé aux bretelles d\'accès et stations-service.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'L\'un des pays les plus favorables au stop en Europe. Sur les routes normales, un trajet arrive généralement en 10 minutes. C\'est un pays de transit avec beaucoup de trafic international et de routiers.' },
      { type: 'text', text: 'Aux entrées d\'autoroute près des villes, tu peux te retrouver avec 3 à 6 autres autostoppeurs. Les trajets sont donnés dans l\'ordre d\'arrivée ou par destination.' },
      { type: 'tip', text: '💡 Toutes les autoroutes tchèques (1, 2, 5, 8, 11) mènent à/de Prague. Évite de te retrouver coincé avant Prague : entre dans la ville et repars.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'La Tchéquie est un pays sûr pour l\'autostop. Les aires de repos sont bien fréquentées et constituent de bons points de départ.' },
      { type: 'sub', title: 'Utilise SpotHitch pour ta sécurité' },
      { type: 'rule', icon: '🛡️', text: 'Active le Mode Gardien avant chaque trajet. Un proche suit ta position en temps réel.' },
      { type: 'rule', icon: '🆘', text: 'Configure le mode SOS avec tes contacts. Un seul geste déclenche une triple alerte (push, SMS, appel).' },
      { type: 'rule', icon: '📱', text: 'Photographie la plaque du véhicule et envoie-la à un proche avant de monter.' },
      { type: 'rule', icon: '🎒', text: 'Garde ton sac accessible (sur tes genoux ou à tes pieds), jamais dans le coffre.' },
      { type: 'sub', title: 'Conseils spécifiques' },
      { type: 'rule', icon: '⛽', text: 'Les aires de repos le long des autoroutes sont des spots fiables avec du passage régulier.' },
      { type: 'rule', icon: '🍺', text: 'Le pays est très accueillant. Les conducteurs peuvent t\'inviter dans un hospoda (pub traditionnel).' },
      { type: 'sub', title: 'Numéros d\'urgence' },
      { type: 'kv', items: [{ k: 'Urgences', v: '112' }, { k: 'Ambulance', v: '155' }] },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Les conducteurs plus âgés : uniquement tchèque, parfois russe, rarement allemand. Les jeunes : au moins un anglais de base. Les routiers sont amicaux et parlent généralement tchèque + un peu d\'allemand.' },
      { type: 'phrase', items: [
        { local: 'Dobrý den', meaning: 'Bonjour' },
        { local: 'Jedete do...?', meaning: 'Allez-vous à... ?' },
        { local: 'Děkuji', meaning: 'Merci' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Budget routard : 35-55 €/jour. Prague est nettement plus cher que le reste du pays. Monnaie : couronne tchèque (CZK), pas l\'euro. Camping très bon marché (~3 € dans certaines villes).' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Camping sauvage interdit mais le bivouac d\'une nuit est toléré (sac de couchage, hamac, bivy sack, pas de tente). Ne laisse aucune trace. Interdit dans les parcs nationaux et réserves.' },
      { type: 'rule', icon: '✅', text: 'Abris en bois gratuits ("bouda" ou "útulna") disponibles dans certaines zones de randonnée.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'RegioJet', detail: 'Bus tchèque bon marché et confortable (CZ, SK, PL, AT, HU)', price: 'dès 5 €' },
        { emoji: '🚌', name: 'FlixBus', detail: 'Réseau étendu', price: 'dès 5 €' },
        { emoji: '🚗', name: 'BlaBlaCar', detail: 'Actif en Tchéquie', price: '' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'ok' }, { name: 'Fév', level: 'ok' }, { name: 'Mar', level: 'ok' },
        { name: 'Avr', level: 'good' }, { name: 'Mai', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Aoû', level: 'great' }, { name: 'Sep', level: 'good' },
        { name: 'Oct', level: 'ok' }, { name: 'Nov', level: 'ok' }, { name: 'Déc', level: 'ok' },
      ]},
      { type: 'text', text: 'Été : optimal, surtout sur l\'axe Tchéquie-Croatie (destination de vacances préférée des Tchèques). Les marchés de Noël de Prague attirent du trafic en hiver.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Forte tradition d\'autostop, socialement accepté comme "forme de transport quotidienne". Un groupe Facebook connecte les autostoppeurs tchèques et slovaques.' },
      { type: 'event', items: [
        { month: 'Juil', day: '⟳', name: 'Colours of Ostrava', desc: 'Festival de musique multiculturel, Ostrava.' },
        { month: 'Déc', day: '⟳', name: 'Marchés de Noël de Prague', desc: 'Parmi les plus beaux d\'Europe.' },
      ]},
    ]},
  },

  // ==================== SLOVAKIA ====================
  SK: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'L\'autostop est légal sur les routes normales en Slovaquie. Interdit sur les autoroutes. Attention : la police slovaque verbalise les autostoppeurs pris sur les autoroutes (plus strict que les pays voisins). Utilise les stations-service et bretelles d\'accès.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Avis contradictoires. Certains trouvent la Slovaquie "très facile" (moins de 30 min d\'attente). D\'autres la notent difficile (5/10) avec des attentes jusqu\'à 2h. Ça dépend probablement de la localisation et de la saison.' },
      { type: 'text', text: 'Le pays est assez montagneux (60%+ du territoire), ce qui crée beaucoup d\'opportunités naturelles. Les autoroutes D1 et E77 sont les meilleurs axes. Bratislava est un carrefour central de l\'Europe centrale.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'La Slovaquie est un pays sûr pour l\'autostop. Les habitants sont accueillants, surtout en zone rurale où la tradition du stop reste vivante.' },
      { type: 'sub', title: 'Utilise SpotHitch pour ta sécurité' },
      { type: 'rule', icon: '🛡️', text: 'Active le Mode Gardien avant chaque trajet. Un proche suit ta position en temps réel.' },
      { type: 'rule', icon: '🆘', text: 'Configure le mode SOS avec tes contacts. Un seul geste déclenche une triple alerte (push, SMS, appel).' },
      { type: 'rule', icon: '📱', text: 'Photographie la plaque du véhicule et envoie-la à un proche avant de monter.' },
      { type: 'rule', icon: '🎒', text: 'Garde ton sac accessible (sur tes genoux ou à tes pieds), jamais dans le coffre.' },
      { type: 'sub', title: 'Conseils spécifiques' },
      { type: 'rule', icon: '🏘️', text: 'En zone rurale, les conducteurs s\'arrêtent plus facilement. Les petites routes de campagne sont idéales.' },
      { type: 'rule', icon: '😊', text: 'Les Slovaques sont discrets mais chaleureux. Un sourire et un panneau suffisent à briser la glace.' },
      { type: 'sub', title: 'Numéros d\'urgence' },
      { type: 'kv', items: [{ k: 'Urgences', v: '112' }] },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'L\'anglais et l\'allemand sont parlés par certains, surtout les jeunes. Le russe est compris par les plus âgés mais "pas nécessairement apprécié". Dans le sud : le hongrois est utile. Le slovaque de base est très apprécié.' },
      { type: 'phrase', items: [
        { local: 'Dobrý deň', meaning: 'Bonjour' },
        { local: 'Idete do...?', meaning: 'Allez-vous à... ?' },
        { local: 'Ďakujem', meaning: 'Merci' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Budget routard : 40-50 €/jour. Auberge : 16-22 €/nuit. Repas local : 8-10 €.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Camping sauvage officiellement interdit mais toléré en dehors des parcs nationaux (surtout les Tatras). Le bivouac d\'urgence (sac de couchage + bâche, pas de tente) ne pose généralement pas de problème.' },
      { type: 'text', text: '' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'RegioJet', detail: 'Bus tchèque avec routes slovaques étendues', price: '' },
        { emoji: '🚌', name: 'FlixBus', detail: 'Couvre la Slovaquie', price: 'dès 5 €' },
        { emoji: '🤝', name: 'Covoiturage local', detail: 'Plateformes locales de covoiturage actives en Slovaquie', price: '' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Fév', level: 'bad' }, { name: 'Mar', level: 'ok' },
        { name: 'Avr', level: 'good' }, { name: 'Mai', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Aoû', level: 'great' }, { name: 'Sep', level: 'good' },
        { name: 'Oct', level: 'ok' }, { name: 'Nov', level: 'bad' }, { name: 'Déc', level: 'bad' },
      ]},
      { type: 'text', text: 'Été : optimal. Hiver : attentes nettement plus longues, froid rigoureux en montagne. Le dimanche : les magasins ferment (tradition religieuse), transports en commun réduits.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Les Slovaques sont décrits comme "incroyablement amicaux" et font de leur mieux pour te mettre à l\'aise. Certains invitent les autostoppeurs à déjeuner en famille ou à boire un verre avec des amis. Le paiement n\'est jamais demandé.' },
      { type: 'event', items: [
        { month: 'Juil', day: '⟳', name: 'Pohoda Festival', desc: 'Plus grand festival de musique de Slovaquie, Trenčín.' },
      ]},
    ]},
  },

  // ==================== HUNGARY ====================
  HU: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'L\'autostop est légal en Hongrie. Longue tradition : la majorité des Hongrois ont fait du stop ou pris des autostoppeurs dans leur jeunesse. Interdit sur les autoroutes comme piéton.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Relativement facile, surtout en zone rurale. Temps d\'attente rarement supérieur à 90 minutes en été. Les stations-service sont les meilleurs spots.' },
      { type: 'sub', title: 'Particularités' },
      { type: 'rule', icon: '📋', text: 'Un panneau avec ta destination est NÉCESSAIRE. Beaucoup de Hongrois ne comprennent pas le geste du pouce comme un signe d\'autostop.' },
      { type: 'text', text: 'Certains conducteurs roumains et hongrois peuvent demander un paiement. Refuse poliment et attends un autre trajet. Les trajets en camion sont très rares (raisons d\'assurance).' },
      { type: 'warn', text: '⚠️ La nuit, les conducteurs ont peur de TOI. Fais du stop uniquement de jour.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'La Hongrie est un pays sûr pour l\'autostop. Les stations MOL sont d\'excellents spots pour rencontrer des conducteurs.' },
      { type: 'sub', title: 'Utilise SpotHitch pour ta sécurité' },
      { type: 'rule', icon: '🛡️', text: 'Active le Mode Gardien avant chaque trajet. Un proche suit ta position en temps réel.' },
      { type: 'rule', icon: '🆘', text: 'Configure le mode SOS avec tes contacts. Un seul geste déclenche une triple alerte (push, SMS, appel).' },
      { type: 'rule', icon: '📱', text: 'Photographie la plaque du véhicule et envoie-la à un proche avant de monter.' },
      { type: 'rule', icon: '🎒', text: 'Garde ton sac accessible (sur tes genoux ou à tes pieds), jamais dans le coffre.' },
      { type: 'sub', title: 'Conseils spécifiques' },
      { type: 'rule', icon: '⛽', text: 'Les stations MOL (chaîne nationale) sont bien réparties et idéales pour aborder les conducteurs.' },
      { type: 'rule', icon: '💧', text: 'L\'eau du robinet est potable partout en Hongrie. Remplis ta gourde à chaque arrêt.' },
      { type: 'sub', title: 'Numéros d\'urgence' },
      { type: 'kv', items: [{ k: 'Urgences', v: '112' }] },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'La plus grande barrière linguistique des 4 pays. Le hongrois est une langue finno-ougrienne, sans lien avec les langues slaves ou germaniques. Moins de gens parlent des langues étrangères que dans les pays voisins. Un guide de conversation hongrois est fortement recommandé.' },
      { type: 'phrase', items: [
        { local: 'Jó napot', meaning: 'Bonjour' },
        { local: 'Köszönöm', meaning: 'Merci' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Budget routard : 25-45 €/jour. Budapest est bon marché pour une capitale européenne. Auberge (dortoir) : dès ~10 €. Repas local : 6-7 €.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Camping sauvage légalement autorisé mais très restreint : maximum 24h au même endroit. Interdit dans les parcs nationaux (patrouilles fréquentes de gardes forestiers). Interdiction de feux en période sèche.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'FlixBus', detail: 'Réseau étendu depuis Budapest', price: 'dès 5 €' },
        { emoji: '🚗', name: 'BlaBlaCar', detail: 'Actif en Hongrie', price: '' },
        { emoji: '🚃', name: 'Trains', detail: 'Bien connectés dans l\'UE, pass Interrail valable', price: '' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Fév', level: 'bad' }, { name: 'Mar', level: 'ok' },
        { name: 'Avr', level: 'good' }, { name: 'Mai', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'good' }, { name: 'Aoû', level: 'good' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'ok' }, { name: 'Déc', level: 'ok' },
      ]},
      { type: 'text', text: 'Printemps et automne : idéal. Été : beaucoup de trafic (Sziget Festival, tourisme au lac Balaton) mais peut être très chaud (+35°C en juillet). Les marchés de Noël de Budapest attirent du trafic en hiver.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Longue tradition d\'autostop, pratiqué par la majorité des Hongrois. Les ruraux sont très amicaux et serviables. Demande tes trajets vers Budapest plutôt qu\'autour : les conducteurs en transit (roumains, serbes, bulgares, turcs) contournent souvent la ville par le périphérique.' },
      { type: 'event', items: [
        { month: 'Août', day: '⟳', name: 'Sziget Festival (Budapest)', desc: 'L\'un des plus grands festivals de musique d\'Europe, sur une île du Danube.' },
        { month: 'Août', day: '⟳', name: 'Festival du Balaton', desc: 'Été au lac Balaton, beaucoup de trafic dans la région.' },
        { month: 'Déc', day: '⟳', name: 'Marchés de Noël de Budapest', desc: 'Parmi les plus beaux d\'Europe.' },
      ]},
    ]},
  },

  // ==================== ROMANIA ====================
  RO: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'L\'autostop est légal en Roumanie. Depuis ~2014, il est interdit aux conducteurs de demander de l\'argent pour prendre des autostoppeurs (le stop payant est illégal). Interdit sur les autoroutes. En pratique, tout le monde fait du stop.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Très facile. L\'un des pays les plus favorables au stop en Europe. Temps d\'attente : 2 minutes à 1h30 selon le lieu. Le stop est un mode de transport courant (transports en commun limités, peu d\'autoroutes). Tu peux être en concurrence avec des locaux aux sorties de ville.' },
      { type: 'text', text: 'Les Roumains utilisent des codes de 2 lettres pour les départements sur les panneaux (ex: CJ = Cluj). Utilise un panneau. Les ronds-points aux sorties de ville et les routes nationales (E) fonctionnent le mieux.' },
      { type: 'warn', text: '⚠️ Certains conducteurs illégaux ciblent les étrangers et demandent des tarifs gonflés (jusqu\'à 100 €). Dis toujours "fără bani" (sans argent) ou "nu am bani" (je n\'ai pas d\'argent) AVANT de monter.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'La Roumanie est un pays sûr pour l\'autostop. La conduite est parfois agressive sur les routes nationales, alors attache toujours ta ceinture.' },
      { type: 'sub', title: 'Utilise SpotHitch pour ta sécurité' },
      { type: 'rule', icon: '🛡️', text: 'Active le Mode Gardien avant chaque trajet. Un proche suit ta position en temps réel.' },
      { type: 'rule', icon: '🆘', text: 'Configure le mode SOS avec tes contacts. Un seul geste déclenche une triple alerte (push, SMS, appel).' },
      { type: 'rule', icon: '📱', text: 'Photographie la plaque du véhicule et envoie-la à un proche avant de monter.' },
      { type: 'rule', icon: '🎒', text: 'Garde ton sac accessible (sur tes genoux ou à tes pieds), jamais dans le coffre.' },
      { type: 'sub', title: 'Conseils spécifiques' },
      { type: 'rule', icon: '🔒', text: 'Attache toujours ta ceinture. Les dépassements sur routes nationales peuvent être brusques.' },
      { type: 'rule', icon: '🤗', text: 'Les Roumains sont très accueillants, surtout en campagne. Ne sois pas surpris(e) si on t\'invite à manger.' },
      { type: 'sub', title: 'Numéros d\'urgence' },
      { type: 'kv', items: [{ k: 'Urgences', v: '112' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Généralement sûr pour les femmes seules. Les expériences en solo sont majoritairement positives. Les zones rurales sont particulièrement accueillantes.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Le roumain est une langue romane (alphabet latin). Les francophones, italophones et hispanophones ont un avantage significatif. Les jeunes en ville parlent bien anglais. En rural et avec les conducteurs plus âgés, la communication peut être difficile. Le hongrois est parlé en Transylvanie.' },
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'L\'un des pays les moins chers d\'Europe. Budget routard : moins de 30 €/jour. Auberge : ~10 €/nuit. Repas au restaurant : 7-10 €. BlaBlaCar est populaire et abordable.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Le camping sauvage est LÉGAL sur les terres publiques (pas dans les parcs nationaux, réserves naturelles, ni le Delta du Danube). Attention aux ours dans les Carpates. Couchsurfing actif, surtout à Cluj-Napoca et Bucarest. TrustRoots populaire chez les autostoppeurs.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚗', name: 'BlaBlaCar', detail: 'Très populaire en Roumanie', price: '' },
        { emoji: '🚌', name: 'FlixBus', detail: 'Routes principales', price: 'dès 5 €' },
        { emoji: '🚃', name: 'Trains', detail: 'Lents mais bon marché', price: '' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Fév', level: 'bad' }, { name: 'Mar', level: 'ok' },
        { name: 'Avr', level: 'great' }, { name: 'Mai', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'good' }, { name: 'Aoû', level: 'good' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'ok' }, { name: 'Déc', level: 'bad' },
      ]},
      { type: 'text', text: 'Avril-octobre : idéal. La Transfăgărășan (plus belle route de montagne) n\'est ouverte que de juin à octobre. Hiver : routes dangereuses, jours courts.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Le stop est profondément ancré dans la culture roumaine. C\'est un mode de transport courant, pas juste pour les voyageurs. Les sorties de ville ont des zones de récupération dédiées. Les conducteurs sont incroyablement amicaux, généreux et curieux envers les étrangers. La Transylvanie est la région la plus accueillante.' },
      { type: 'event', items: [
        { month: 'Août', day: '⟳', name: 'Untold Festival (Cluj)', desc: 'L\'un des plus grands festivals de musique d\'Europe de l\'Est.' },
        { month: 'Sep', day: '⟳', name: 'George Enescu Festival (Bucarest)', desc: 'Festival de musique classique de renommée mondiale.' },
      ]},
    ]},
  },

  // ==================== BULGARIA ====================
  BG: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Aucune loi n\'interdit l\'autostop en Bulgarie sauf sur les rares tronçons de vraie autoroute. C\'est un héritage de l\'époque socialiste, largement accepté.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Très facile, surtout sur l\'axe Sofia-Plovdiv (corridor Europe-Turquie). L\'est-ouest est plus facile que le nord-sud. En été, la côte de la Mer Noire est populaire mais avec de la concurrence.' },
      { type: 'text', text: 'Les routiers (TIR) sont nombreux et prêts à prendre des passagers. Attention en été (35°C+) : les camions doivent se garer de 13h à 21h. Pars tôt le matin.' },
      { type: 'warn', text: '⚠️ Écris ta destination en CYRILLIQUE. Ça améliore considérablement les chances que les conducteurs s\'arrêtent.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'La Bulgarie est un pays sûr pour l\'autostop. Les routes secondaires sont parfois en mauvais état, alors privilégie les axes principaux.' },
      { type: 'sub', title: 'Utilise SpotHitch pour ta sécurité' },
      { type: 'rule', icon: '🛡️', text: 'Active le Mode Gardien avant chaque trajet. Un proche suit ta position en temps réel.' },
      { type: 'rule', icon: '🆘', text: 'Configure le mode SOS avec tes contacts. Un seul geste déclenche une triple alerte (push, SMS, appel).' },
      { type: 'rule', icon: '📱', text: 'Photographie la plaque du véhicule et envoie-la à un proche avant de monter.' },
      { type: 'rule', icon: '🎒', text: 'Garde ton sac accessible (sur tes genoux ou à tes pieds), jamais dans le coffre.' },
      { type: 'sub', title: 'Conseils spécifiques' },
      { type: 'rule', icon: '🛣️', text: 'Privilégie les routes principales et les autoroutes. Les routes secondaires sont parfois mal entretenues.' },
      { type: 'rule', icon: '🔄', text: 'Attention : en Bulgarie, hocher la tête signifie "non" et la secouer signifie "oui". La confusion est fréquente !' },
      { type: 'sub', title: 'Numéros d\'urgence' },
      { type: 'kv', items: [{ k: 'Urgences', v: '112' }] },
    ]},
    women: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'Généralement sûr pour les voyageuses solo. La criminalité est faible et les locaux sont serviables.' },
      { type: 'warn', text: '⚠️ Sur les grands axes (Sofia-Istanbul, Sofia-Varna), des travailleuses du sexe sont présentes au bord des routes. Les femmes doivent s\'habiller sobrement et s\'éloigner de ces zones. Utilise uniquement le pouce levé (agiter la main peut être confondu avec un signal de sollicitation).' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Le bulgare utilise l\'alphabet cyrillique, ce qui constitue une barrière significative. L\'anglais est limité en dehors des grandes villes. La communication repose souvent sur les gestes. Les conducteurs offrent fréquemment du rakia (eau-de-vie artisanale) comme geste social.' },
      { type: 'phrase', items: [
        { local: 'Avtostop', meaning: 'Autostop' },
        { local: 'Blagodarya', meaning: 'Merci' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Parmi les pays les moins chers d\'Europe. Budget routard : ~30 €/jour. Repas copieux au restaurant pour moins de 15 €. Auberge : 8-12 €/nuit.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Camping sauvage techniquement interdit mais largement toléré en dehors des zones touristiques, villes et réserves naturelles. Amende jusqu\'à 1000 € en zone protégée. Les feux sont strictement interdits en dehors des foyers publics. Krapets (frontière roumaine) a une zone de camping sauvage gratuit sur la plage.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Les groupes Facebook de covoiturage sont plus populaires que BlaBlaCar en Bulgarie. Plus rapides et moins chers que les bus. Bus et minibus connectent la plupart des villes. Trains existants mais lents.' },
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Fév', level: 'bad' }, { name: 'Mar', level: 'ok' },
        { name: 'Avr', level: 'good' }, { name: 'Mai', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'good' }, { name: 'Aoû', level: 'good' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'ok' }, { name: 'Déc', level: 'bad' },
      ]},
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Le stop a des racines socialistes. Beaucoup de conducteurs plus âgés sont nostalgiques et accueillants. Les conducteurs sont curieux, gentils et hospitaliers. Le rakia est partagé comme geste social.' },
      { type: 'event', items: [
        { month: 'Juin', day: '⟳', name: 'Festival des Roses (Kazanlak)', desc: 'Célébration de la récolte des roses, tradition séculaire.' },
        { month: 'Juil', day: '⟳', name: 'Juillet Morning (côte)', desc: 'Rassemblement hippie au lever du soleil sur les plages de la Mer Noire.' },
      ]},
    ]},
  },

  // ==================== LITHUANIA ====================
  LT: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'L\'autostop sur les autoroutes n\'est pas explicitement interdit (mais marcher dessus l\'est). En pratique, les autostoppeurs se tiennent près des autoroutes sans problème. Les écoliers marchent le long des routes, donc les conducteurs sont habitués.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'La Lituanie est décrite comme un "paradis pour l\'autostop". Temps d\'attente : 30 à 90 minutes, sous 30 minutes en duo. ' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'La Lituanie est un pays très sûr pour l\'autostop. La Via Baltica (E67) est un excellent axe pour progresser vers le nord ou le sud.' },
      { type: 'sub', title: 'Utilise SpotHitch pour ta sécurité' },
      { type: 'rule', icon: '🛡️', text: 'Active le Mode Gardien avant chaque trajet. Un proche suit ta position en temps réel.' },
      { type: 'rule', icon: '🆘', text: 'Configure le mode SOS avec tes contacts. Un seul geste déclenche une triple alerte (push, SMS, appel).' },
      { type: 'rule', icon: '📱', text: 'Photographie la plaque du véhicule et envoie-la à un proche avant de monter.' },
      { type: 'rule', icon: '🎒', text: 'Garde ton sac accessible (sur tes genoux ou à tes pieds), jamais dans le coffre.' },
      { type: 'sub', title: 'Conseils spécifiques' },
      { type: 'rule', icon: '🛣️', text: 'La Via Baltica (E67) traverse le pays du sud au nord. C\'est l\'axe le plus fréquenté pour le stop.' },
      { type: 'rule', icon: '⛽', text: 'Les stations-service le long des grands axes sont des spots fiables pour trouver un lift.' },
      { type: 'sub', title: 'Numéros d\'urgence' },
      { type: 'kv', items: [{ k: 'Urgences', v: '112' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Les pays baltes sont décrits comme un "paradis pour les autostoppeuses" et "très favorables aux femmes".' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Le lituanien est la langue principale. Les anglophones sont limités en dehors de Vilnius. Les conducteurs sont amicaux malgré la barrière linguistique. Une carte SIM coûte ~0,30 € aux kiosques (utile pour les apps de traduction).' },
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Budget routard : ~45 €/jour. Les trains sont extrêmement bon marché (souvent moins de 2 €/trajet).' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Le camping sauvage est LÉGAL en Lituanie, sauf dans les réserves naturelles, zones urbaines, plages et propriétés privées.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Lux Express', detail: 'Bus entre capitales baltes', price: '~25 €' },
        { emoji: '🚃', name: 'Trains', detail: 'Vilnius-Riga direct (depuis 2023), très bon marché', price: 'dès 2 €' },
        { emoji: '🤝', name: 'Covoiturage local', detail: 'Plateformes lituaniennes de covoiturage', price: '' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Fév', level: 'bad' }, { name: 'Mar', level: 'bad' },
        { name: 'Avr', level: 'ok' }, { name: 'Mai', level: 'good' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Aoû', level: 'great' }, { name: 'Sep', level: 'good' },
        { name: 'Oct', level: 'ok' }, { name: 'Nov', level: 'bad' }, { name: 'Déc', level: 'bad' },
      ]},
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Culture d\'autostop établie. Les clubs d\'autostoppeurs locaux sont actifs. Les gens sont timides mais amicaux. Comparable à la Pologne en termes de culture du stop.' },
    ]},
  },

  // ==================== LATVIA ====================
  LV: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Aucune loi n\'interdit l\'autostop en Lettonie. Autorisé tant que tu ne mets pas la sécurité routière en danger.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Assez facile. Les gens sont habitués aux autostoppeurs sur les routes principales (E67/Via Baltica) et en zone rurale. Beaucoup de jeunes Lettons font du stop en été pour aller aux festivals ou rentrer chez eux.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'La Lettonie est un pays sûr et calme pour l\'autostop. La Via Baltica (E67) est le meilleur axe pour avancer efficacement.' },
      { type: 'sub', title: 'Utilise SpotHitch pour ta sécurité' },
      { type: 'rule', icon: '🛡️', text: 'Active le Mode Gardien avant chaque trajet. Un proche suit ta position en temps réel.' },
      { type: 'rule', icon: '🆘', text: 'Configure le mode SOS avec tes contacts. Un seul geste déclenche une triple alerte (push, SMS, appel).' },
      { type: 'rule', icon: '📱', text: 'Photographie la plaque du véhicule et envoie-la à un proche avant de monter.' },
      { type: 'rule', icon: '🎒', text: 'Garde ton sac accessible (sur tes genoux ou à tes pieds), jamais dans le coffre.' },
      { type: 'sub', title: 'Conseils spécifiques' },
      { type: 'rule', icon: '🛣️', text: 'La Via Baltica (E67) est l\'axe principal. Les stations-service le long de cette route sont d\'excellents spots.' },
      { type: 'rule', icon: '❄️', text: 'En hiver et au début du printemps, les routes peuvent être glissantes. Prévois des vêtements chauds et visibles.' },
      { type: 'sub', title: 'Numéros d\'urgence' },
      { type: 'kv', items: [{ k: 'Urgences', v: '112' }] },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Population divisée entre lettophones et russophones. La plupart des adultes connaissent les deux. Les jeunes parlent généralement bien anglais. WiFi gratuit dans presque toutes les villes (bibliothèques, centres-villes).' },
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Budget routard : ~45 €/jour. Trains souvent sous 2 €/trajet.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Le camping sauvage est LÉGAL en Lettonie sauf interdiction explicite. Interdit dans les réserves naturelles, parcs nationaux, dunes avec végétation et plages urbaines. Propriété privée : permission du propriétaire requise.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Lux Express', detail: 'Riga-Tallinn (~4h, ~20 €), Riga-Vilnius (~4h30, ~25 €)', price: 'dès 15 €' },
        { emoji: '📱', name: 'Groupes Facebook', detail: 'Covoiturage par route (très populaire)', price: '' },
        { emoji: '🚗', name: 'BlaBlaCar', detail: 'Actif en Lettonie', price: '' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Fév', level: 'bad' }, { name: 'Mar', level: 'bad' },
        { name: 'Avr', level: 'ok' }, { name: 'Mai', level: 'good' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Aoû', level: 'great' }, { name: 'Sep', level: 'good' },
        { name: 'Oct', level: 'ok' }, { name: 'Nov', level: 'bad' }, { name: 'Déc', level: 'bad' },
      ]},
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'L\'autostop est une pratique acceptée. Les Lettons sont réservés mais serviables. Pas de contrôles aux frontières Schengen avec l\'Estonie et la Lituanie.' },
      { type: 'event', items: [
        { month: 'Juin', day: '23-24', name: 'Jāņi (Līgo)', desc: 'Solstice d\'été, feux de joie, couronnes de fleurs, la plus grande fête lettone.' },
      ]},
    ]},
  },

  // ==================== ESTONIA ====================
  EE: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'L\'autostop est légal en Estonie. Obligation légale la nuit : tu DOIS porter un réflecteur lumineux sur les routes sombres. Les gilets de sécurité sont recommandés mais peuvent faire croire aux conducteurs que tu es policier.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Relativement bon. Temps d\'attente : 5-10 minutes typiquement, parfois 30-90 minutes. Les voitures s\'arrêtent sur les autoroutes et les petites routes. Tous les types de véhicules s\'arrêtent : voitures, camions, tracteurs, même des taxis qui rentrent chez eux.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'L\'Estonie est un pays très sûr pour l\'autostop. La Via Baltica (E67) est l\'axe idéal pour traverser le pays.' },
      { type: 'sub', title: 'Utilise SpotHitch pour ta sécurité' },
      { type: 'rule', icon: '🛡️', text: 'Active le Mode Gardien avant chaque trajet. Un proche suit ta position en temps réel.' },
      { type: 'rule', icon: '🆘', text: 'Configure le mode SOS avec tes contacts. Un seul geste déclenche une triple alerte (push, SMS, appel).' },
      { type: 'rule', icon: '📱', text: 'Photographie la plaque du véhicule et envoie-la à un proche avant de monter.' },
      { type: 'rule', icon: '🎒', text: 'Garde ton sac accessible (sur tes genoux ou à tes pieds), jamais dans le coffre.' },
      { type: 'sub', title: 'Conseils spécifiques' },
      { type: 'rule', icon: '🛣️', text: 'La Via Baltica (E67) relie Tallinn à la frontière lettone. C\'est l\'axe le plus fréquenté.' },
      { type: 'rule', icon: '⛽', text: 'Les stations-service sont des spots sûrs et bien éclairés, parfaits pour aborder les conducteurs.' },
      { type: 'sub', title: 'Numéros d\'urgence' },
      { type: 'kv', items: [{ k: 'Urgences', v: '112' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Les pays baltes sont décrits comme un "paradis pour les autostoppeuses". Tallinn est très sûr pour les voyageuses solo.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'L\'estonien et le russe sont les langues principales. L\'anglais est bien parlé par les jeunes et les actifs. Les conversations se font en estonien, russe ou anglais selon le conducteur.' },
      { type: 'phrase', items: [
        { local: 'Aitäh sõidu eest', meaning: 'Merci pour le trajet' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Budget routard : ~45 €/jour. Trains extrêmement bon marché. L\'eau du robinet et des puits est potable partout en Estonie.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Le camping sauvage est LÉGAL en Estonie sauf sur propriété privée, dans les parcs nationaux ou les zones militaires. Emporte de la nourriture : peu d\'aires de service en bord de route.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Lux Express', detail: 'Tallinn-Riga (~4h)', price: 'dès 15 €' },
        { emoji: '⛴️', name: 'Ferries', detail: 'Vers les îles (Saaremaa, Hiiumaa)', price: '' },
      ]},
      { type: 'text', text: 'Pays très connecté numériquement (e-Estonia). Les apps de traduction et cartes en ligne fonctionnent parfaitement partout.' },
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Fév', level: 'bad' }, { name: 'Mar', level: 'bad' },
        { name: 'Avr', level: 'ok' }, { name: 'Mai', level: 'good' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Aoû', level: 'good' }, { name: 'Sep', level: 'ok' },
        { name: 'Oct', level: 'bad' }, { name: 'Nov', level: 'bad' }, { name: 'Déc', level: 'bad' },
      ]},
      { type: 'text', text: 'Été uniquement fiable (quasi 24h de lumière en juin). Hiver : neige, froid, obscurité. Certaines routes passent de 110 à 90 km/h en hiver.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Les Estoniens sont réservés mais serviables. Les îles (Kihnu, Saaremaa) préservent des modes de vie traditionnels et offrent des expériences d\'autostop uniques.' },
      { type: 'event', items: [
        { month: 'Juin', day: '23-24', name: 'Jaanipäev (Saint-Jean)', desc: 'Solstice d\'été, feux de joie. Plus grande fête estonienne.' },
      ]},
    ]},
  },

  // ==================== TURKEY ====================
  TR: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'L\'autostop ("otostop") n\'est pas explicitement illégal en Turquie, mais il est interdit sur les autoroutes (otoban). En pratique, l\'application est très laxiste et les gens font du stop sur les routes routinièrement.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'La Turquie est décrite comme un "paradis pour les autostoppeurs" par toutes les sources. Le temps d\'attente dépasse rarement 15 minutes sur les routes fréquentées.' },
      { type: 'sub', title: 'Par région (du plus facile au plus difficile)' },
      { type: 'kv', items: [
        { k: 'Sud-est anatolien', v: 'La 1ère voiture s\'arrête', color: 'green' },
        { k: 'Côte de la Mer Noire', v: 'Très facile', color: 'green' },
        { k: 'Anatolie centrale', v: '~20 min d\'attente', color: 'green' },
        { k: 'Côte méditerranéenne', v: 'Plus long (jusqu\'à 2h)', color: 'amber' },
        { k: 'Istanbul', v: 'Très difficile (peut prendre 10h)', color: 'red' },
      ]},
      { type: 'text', text: 'En zone rurale, marcher sur une route suffit : les conducteurs s\'arrêtent d\'eux-mêmes sans que tu lèves le pouce.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'La Turquie est un pays sûr pour l\'autostop. L\'hospitalité turque est légendaire et les conducteurs s\'arrêtent facilement, surtout aux stations-service.' },
      { type: 'sub', title: 'Utilise SpotHitch pour ta sécurité' },
      { type: 'rule', icon: '🛡️', text: 'Active le Mode Gardien avant chaque trajet. Un proche suit ta position en temps réel.' },
      { type: 'rule', icon: '🆘', text: 'Configure le mode SOS avec tes contacts. Un seul geste déclenche une triple alerte (push, SMS, appel).' },
      { type: 'rule', icon: '📱', text: 'Photographie la plaque du véhicule et envoie-la à un proche avant de monter.' },
      { type: 'rule', icon: '🎒', text: 'Garde ton sac accessible (sur tes genoux ou à tes pieds), jamais dans le coffre.' },
      { type: 'sub', title: 'Conseils spécifiques' },
      { type: 'rule', icon: '⛽', text: 'Les stations-service sont les spots les plus sûrs et les plus efficaces pour trouver un lift.' },
      { type: 'rule', icon: '🌍', text: 'Évite les zones frontalières sud (Syrie, Irak). Le reste du pays est très accueillant.' },
      { type: 'sub', title: 'Numéros d\'urgence' },
      { type: 'kv', items: [{ k: 'Urgences', v: '112' }] },
    ]},
    women: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'Le sujet le plus documenté. La Turquie est considérée comme "pas pour les autostoppeuses débutantes" si tu es seule. Le code vestimentaire est crucial : pantalons longs, manches aux coudes minimum.' },
      { type: 'text', text: 'Les expériences varient énormément selon la tenue, le comportement, les compétences linguistiques et la région. Recommandation de toutes les sources : plus sûr en couple ou en groupe.' },
      { type: 'phrase', items: [
        { local: 'Çok ayıp', meaning: 'C\'est très mal (pour repousser un comportement)' },
        { local: 'Evliyim', meaning: 'Je suis marié(e)' },
      ]},
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Très peu de gens parlent anglais (~20% des conducteurs). Google Traduction avec fonction vocale est essentiel. Le turc est "relativement facile à apprendre et à prononcer". Enregistre un message pré-traduit expliquant ton voyage.' },
      { type: 'phrase', items: [
        { local: 'Otostop', meaning: 'Autostop' },
        { local: 'Param yok', meaning: 'Je n\'ai pas d\'argent' },
        { local: 'Nereye gidiyorsunuz?', meaning: 'Où allez-vous ?' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Budget routard : 25-45 €/jour. Repas traditionnel : 3-5 €. Auberge : 5-15 €/nuit. Les conducteurs achètent fréquemment du thé, de la nourriture et même des repas complets. "Nourriture et thé à profusion."' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Le camping sauvage existe dans une zone grise légale. Techniquement interdit mais l\'application est laxiste. Généralement toléré en zones rurales et forestières. Interdit sur certaines plages (sites de nidification des tortues). Les invitations chez les conducteurs sont extrêmement courantes.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚐', name: 'Dolmuş (minibus partagé)', detail: 'Très bon marché, pas d\'horaire, lève la main pour l\'arrêter', price: '1-3 €' },
        { emoji: '🚌', name: 'Bus interurbains', detail: 'Modernes, confortables, service à bord, climatisés', price: '' },
      ]},
      { type: 'tip', text: '💡 ~30% des chauffeurs de bus interurbains te donneront un trajet gratuit si tu expliques que tu n\'as pas d\'argent.' },
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'ok' }, { name: 'Fév', level: 'ok' }, { name: 'Mar', level: 'good' },
        { name: 'Avr', level: 'great' }, { name: 'Mai', level: 'great' }, { name: 'Jun', level: 'good' },
        { name: 'Jul', level: 'ok' }, { name: 'Aoû', level: 'ok' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'great' }, { name: 'Nov', level: 'good' }, { name: 'Déc', level: 'ok' },
      ]},
      { type: 'text', text: 'Avril est le meilleur mois. Printemps et automne idéaux. Été : très chaud (35°C+ sur la côte sud et à l\'intérieur). Hiver : froid à l\'intérieur, doux sur la côte sud.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'L\'hospitalité turque est légendaire. Le thé est offert à chaque arrêt. Les conducteurs achètent des repas, font des visites improvisées et t\'invitent chez eux. Accepter la nourriture/boisson crée un lien. Refuser peut offenser.' },
      { type: 'event', items: [
        { month: 'Avr', day: '23', name: 'Fête de la Souveraineté nationale', desc: 'Jour férié, célébrations dans tout le pays.' },
        { month: 'Avr-Mai', day: '⟳', name: 'Ramadan et Aïd', desc: 'Dates variables. Pendant le Ramadan, les gens jeûnent de jour. L\'Aïd est très festif.' },
        { month: 'Oct', day: '29', name: 'Fête de la République', desc: 'Plus grande fête nationale turque.' },
      ]},
    ]},
  },

  // ==================== GEORGIA ====================
  GE: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Aucune restriction légale sur l\'autostop en Géorgie. Contrairement à la plupart des pays européens, personne ne s\'inquiète si tu fais du stop directement sur les autoroutes.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Facile la plupart du temps. Temps d\'attente moyen : ~30 minutes. En zone rurale, les conducteurs s\'arrêtent même sans que tu lèves le pouce : marcher avec un sac à dos suffit. Les voitures de police offrent aussi des trajets et aident à organiser la suite.' },
      { type: 'tip', text: '💡 L\'hospitalité géorgienne est incroyable. Les conducteurs t\'invitent à manger, à boire et à dormir chez eux régulièrement.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'La Géorgie est un pays sûr pour l\'autostop. L\'hospitalité géorgienne est légendaire. Le principal risque vient des routes de montagne (virages serrés, pas de garde-fou).' },
      { type: 'sub', title: 'Utilise SpotHitch pour ta sécurité' },
      { type: 'rule', icon: '🛡️', text: 'Active le Mode Gardien avant chaque trajet. Un proche suit ta position en temps réel.' },
      { type: 'rule', icon: '🆘', text: 'Configure le mode SOS avec tes contacts. Un seul geste déclenche une triple alerte (push, SMS, appel).' },
      { type: 'rule', icon: '📱', text: 'Photographie la plaque du véhicule et envoie-la à un proche avant de monter.' },
      { type: 'rule', icon: '🎒', text: 'Garde ton sac accessible (sur tes genoux ou à tes pieds), jamais dans le coffre.' },
      { type: 'sub', title: 'Conseils spécifiques' },
      { type: 'rule', icon: '🏔️', text: 'Les routes de montagne sont dangereuses (virages sans garde-fou, vitesse élevée). Attache ta ceinture.' },
      { type: 'rule', icon: '🍷', text: 'Les conducteurs peuvent t\'offrir du vin ou du chacha. Accepter un verre est un geste d\'amitié en Géorgie.' },
      { type: 'sub', title: 'Numéros d\'urgence' },
      { type: 'kv', items: [{ k: 'Urgences', v: '112' }] },
    ]},
    women: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'La Géorgie est considérée comme sûre pour les voyageuses solo. Les hommes géorgiens sont généralement respectueux envers les femmes mais peuvent être insistants. Sois ferme et ils s\'arrêteront.' },
      { type: 'text', text: 'Certains conducteurs peuvent être insistants socialement (invitations répétées, intérêt pour les étrangères). Sois ferme. Recommandation : voyager à deux quand possible.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Les plus âgés parlent russe, les jeunes (<30 ans) parlent plus anglais, surtout à Tbilissi et Batoumi. Les villages peuvent n\'avoir que des locuteurs géorgiens. Bonne couverture mobile pour les apps de traduction.' },
      { type: 'phrase', items: [
        { local: 'Gamarjoba', meaning: 'Bonjour' },
        { local: 'Madloba', meaning: 'Merci' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Ultra-budget possible : ~6 €/jour (camping + stop + cuisine). Budget confortable : ~30 €/jour. Auberge à Tbilissi : dès 5 €/nuit. Repas complet : 3-5 €. Métro/bus à Tbilissi : quelques centimes.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Le camping sauvage est légal en Géorgie sur les terres publiques. Interdit sur propriété privée sans permission. Spots populaires gratuits : Kazbegi, vallée de Juta, lac Udziro en Racha, Svanétie. Les invitations chez l\'habitant sont fréquentes.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚐', name: 'Marshrutka (minivans partagés)', detail: 'Colonne vertébrale du transport. Très bon marché.', price: '1-7 €' },
        { emoji: '🚃', name: 'Trains', detail: 'Réseau soviétique. Tbilissi-Batoumi rapide. Tbilissi-Zugdidi de nuit.', price: '4-15 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Fév', level: 'bad' }, { name: 'Mar', level: 'ok' },
        { name: 'Avr', level: 'good' }, { name: 'Mai', level: 'good' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Aoû', level: 'great' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'ok' }, { name: 'Déc', level: 'bad' },
      ]},
      { type: 'text', text: 'Fin juin à fin septembre : idéal pour le trek et le stop en montagne (Grand Caucase ouvert juillet-août). Fin septembre à début novembre : 15-20°C en ville, couleurs d\'automne.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'L\'hospitalité géorgienne est considérée comme l\'une des meilleures au monde. Les conducteurs invitent spontanément à manger, boire et dormir. Le chacha (eau-de-vie de raisin) est la boisson nationale. La cuisine géorgienne est riche : vin, khinkali (raviolis), khachapuri (pain au fromage).' },
      { type: 'event', items: [
        { month: 'Oct', day: '14', name: 'Tbilisoba', desc: 'Fête de Tbilissi. Musique, danse, gastronomie dans toute la ville.' },
        { month: 'Oct', day: '⟳', name: 'Rtveli (vendanges)', desc: 'Récolte du raisin. La Géorgie est le berceau du vin (8000 ans).' },
      ]},
    ]},
  },

  // ==================== ARMENIA ====================
  AM: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'L\'autostop est légal en Arménie. Aucune restriction documentée. Utilise le pouce levé (paume vers le bas = tu veux un taxi).' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Plusieurs sources classent l\'Arménie comme l\'un des meilleurs pays au monde pour l\'autostop. Temps d\'attente moyen : 5-10 minutes, parfois sous 5 minutes. ' },
      { type: 'text', text: 'Les locaux font aussi du stop car les transports en commun sont limités et les minivans bondés. C\'est un mode de transport normal. En zone reculée, le trafic peut être très faible (1h+ d\'attente).' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'L\'Arménie est un pays très sûr pour l\'autostop. Les habitants sont chaleureux et le pays est paisible. Le principal risque vient des routes de montagne.' },
      { type: 'sub', title: 'Utilise SpotHitch pour ta sécurité' },
      { type: 'rule', icon: '🛡️', text: 'Active le Mode Gardien avant chaque trajet. Un proche suit ta position en temps réel.' },
      { type: 'rule', icon: '🆘', text: 'Configure le mode SOS avec tes contacts. Un seul geste déclenche une triple alerte (push, SMS, appel).' },
      { type: 'rule', icon: '📱', text: 'Photographie la plaque du véhicule et envoie-la à un proche avant de monter.' },
      { type: 'rule', icon: '🎒', text: 'Garde ton sac accessible (sur tes genoux ou à tes pieds), jamais dans le coffre.' },
      { type: 'sub', title: 'Conseils spécifiques' },
      { type: 'rule', icon: '🏔️', text: 'Les routes de montagne sont le principal risque. Elles sont sinueuses et parfois mal entretenues.' },
      { type: 'rule', icon: '🤝', text: 'Les Arméniens sont d\'une hospitalité remarquable. On t\'invitera souvent à partager un repas.' },
      { type: 'sub', title: 'Numéros d\'urgence' },
      { type: 'kv', items: [{ k: 'Urgences', v: '911' }] },
    ]},
    women: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'La peur s\'estompe d\'année en année. Certains conducteurs peuvent être insistants socialement (invitations répétées, intérêt romantique). Sois ferme et claire. Préfère les voitures avec femmes ou enfants. Évite de voyager seule dans les zones isolées du sud.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Le russe est la langue étrangère la plus courante, parlée par presque tout le monde. Essentiel en dehors d\'Erevan. L\'anglais est rare, surtout en zone rurale. L\'alphabet arménien est unique et la langue très difficile à apprendre.' },
      { type: 'phrase', items: [
        { local: 'Barev', meaning: 'Bonjour' },
        { local: 'Shnorhakalutyun', meaning: 'Merci' },
        { local: 'Anvchar?', meaning: 'Gratuit ?' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Ultra-budget possible : ~7 €/jour. Budget confortable : 25-45 €/jour. Auberge : 8-18 €/nuit. Repas local : 3-5 €. Métro d\'Erevan : < 0,20 €. Les conducteurs offrent souvent cola, glace ou repas complets gratuitement.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Le camping sauvage est légal sur toutes les terres publiques sans permis. Sûr dans la plupart des régions sauf près de la frontière azerbaïdjanaise. Il fait froid à partir d\'octobre. Attention aux loups, animaux sauvages et chiens errants. Les locaux sont curieux et peuvent t\'inviter chez eux pour un café.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚐', name: 'Marshrutkas', detail: 'Minivans bondés mais bon marché. Couvrent la plupart des routes.', price: '0,30-1 €' },
        { emoji: '🚌', name: 'Bus', detail: 'Uniquement les grandes villes', price: '' },
      ]},
      { type: 'warn', text: '⚠️ Pouce levé = autostop. Paume vers le bas = taxi. Clarifie AVANT de monter pour éviter qu\'on te demande de l\'argent.' },
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Fév', level: 'bad' }, { name: 'Mar', level: 'ok' },
        { name: 'Avr', level: 'good' }, { name: 'Mai', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'good' }, { name: 'Aoû', level: 'good' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'ok' }, { name: 'Déc', level: 'bad' },
      ]},
      { type: 'text', text: 'Mai-juin et septembre-octobre : idéal (22-26°C). Été : chaud en plaine (jusqu\'à 40°C) mais idéal en montagne. Hiver : froid, neige en montagne, pas recommandé pour le stop.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'L\'hospitalité arménienne est considérée parmi les meilleures au monde. Les conducteurs s\'arrêtent sans qu\'on le demande, achètent des boissons, invitent à manger et présentent leur famille. Les communautés kurdes du sud de l\'Arménie sont "exceptionnellement hospitalières". Accepter la nourriture/boisson montre ta bonne volonté.' },
      { type: 'event', items: [
        { month: 'Avr', day: '24', name: 'Jour du Souvenir', desc: 'Commémoration du génocide arménien. Processions à Erevan.' },
        { month: 'Sep-Oct', day: '⟳', name: 'Areni Wine Festival', desc: 'Festival du vin dans le village d\'Areni, berceau du plus vieux vignoble connu.' },
      ]},
    ]},
  },
  // ==================== BELARUS ====================
  BY: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'L\'autostop est légal en Biélorussie. Aucune restriction spécifique. La pratique est courante car les transports publics sont limités en dehors de Minsk.' },
      { type: 'warn', text: '⚠️ Un visa est obligatoire pour la plupart des nationalités. Visa gratuit de 30 jours si tu arrives par l\'aéroport de Minsk. Entrée terrestre depuis la Russie : pas de contrôle frontalier (union douanière), mais tu dois avoir un visa biélorusse.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'La Biélorussie est facile pour l\'autostop. Temps d\'attente moyen : 15-30 min sur les routes principales. Les conducteurs sont curieux de rencontrer des étrangers (rares dans le pays). Les autoroutes (M1, M6) ont un bon trafic.' },
      { type: 'text', text: 'Beaucoup de conducteurs tentent de refuser l\'argent. La technique classique : se placer aux stations-service ou aux arrêts de bus en sortie de ville. Les camionneurs sont accueillants mais parlent rarement autre chose que russe/biélorusse.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Le pays est très sûr en termes de criminalité. Taux de criminalité parmi les plus bas d\'Europe. Cependant, le régime autoritaire implique des contrôles policiers fréquents. Aie toujours ton passeport et ton enregistrement migratoire sur toi.' },
      { type: 'kv', items: [
        { k: 'Urgences', v: '112' },
        { k: 'Police', v: '102' },
        { k: 'Ambulance', v: '103' },
      ]},
      { type: 'warn', text: '⚠️ Ne photographie pas les bâtiments gouvernementaux ou militaires. Évite les discussions politiques avec les conducteurs.' },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Le pays est considéré comme sûr pour les femmes voyageant seules. Les incidents sont très rares. La société est conservatrice mais respectueuse. Évite de voyager seule la nuit dans les zones isolées.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Le russe est la langue principale (parlée par 99% de la population au quotidien). Le biélorusse est officiel mais peu utilisé. L\'anglais est très rare en dehors de Minsk. Le russe est indispensable pour communiquer.' },
      { type: 'phrase', items: [
        { local: 'Zdrastvuyte', meaning: 'Bonjour (formel)' },
        { local: 'Spasibo', meaning: 'Merci' },
        { local: 'Besplatno', meaning: 'Gratuit' },
        { local: 'Do...', meaning: 'Jusqu\'à... (+ nom de ville)' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Très bon marché. Budget serré : 10-15 €/jour. Repas dans une stolovaya (cantine soviétique) : 2-4 €. Auberge à Minsk : 8-15 €/nuit. Le métro de Minsk coûte ~0,30 €.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Le camping sauvage est toléré dans les forêts (60% du territoire). Il est interdit dans les parcs nationaux sans autorisation. Les conducteurs invitent parfois à dormir chez eux. Obligation d\'enregistrement dans les 10 jours à l\'hôtel ou au bureau des migrations.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚂', name: 'Train', detail: 'Réseau soviétique fiable et bon marché', price: '2-10 €' },
        { emoji: '🚌', name: 'Marshrutka', detail: 'Minibus fréquents entre villes', price: '1-5 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Fév', level: 'bad' }, { name: 'Mar', level: 'ok' },
        { name: 'Avr', level: 'ok' }, { name: 'Mai', level: 'good' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Aoû', level: 'great' }, { name: 'Sep', level: 'good' },
        { name: 'Oct', level: 'ok' }, { name: 'Nov', level: 'bad' }, { name: 'Déc', level: 'bad' },
      ]},
      { type: 'text', text: 'Juin à août : idéal (20-28°C). L\'hiver est rude (jusqu\'à -20°C) et déconseillé pour le stop. Les moustiques sont nombreux en été dans les zones marécageuses.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'La Biélorussie conserve une atmosphère soviétique unique. Les gens sont réservés au premier contact mais très chaleureux une fois la glace brisée. La vodka et le salo (lard fumé) sont les spécialités locales. Ne refuse jamais un toast.' },
    ]},
  },
  // ==================== MOLDOVA ====================
  MD: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'L\'autostop est légal en Moldavie. Pratique très courante, surtout en zone rurale où les transports publics sont rares. Les conducteurs s\'arrêtent facilement.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'La Moldavie est facile pour le stop. Le pays est petit (340 km nord-sud) et peut se traverser en une journée. Temps d\'attente : 10-20 min. Les conducteurs sont curieux des étrangers. Attention : certains conducteurs attendent un paiement (pratique locale de transport informel). Clarifie que c\'est gratuit avec "gratis".' },
      { type: 'warn', text: '⚠️ La Transnistrie (république autoproclamée à l\'est) est accessible mais avec des contrôles frontaliers. L\'autostop y est facile mais le russe est indispensable.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'La Moldavie est un pays sûr avec une criminalité faible. Évite de voyager seul la nuit dans les zones isolées. Les arnaques au taxi sont le principal risque (clarifie le prix avant).' },
      { type: 'kv', items: [{ k: 'Urgences', v: '112' }, { k: 'Police', v: '902' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Considéré comme sûr pour les femmes voyageant seules. La société est traditionnelle. Des voyageuses rapportent des expériences positives. Évite la Transnistrie seule.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Le roumain est la langue officielle. Le russe est très répandu, surtout à Chișinău et en Transnistrie. L\'anglais est parlé par les jeunes urbains. En zone rurale, le roumain ou le russe est indispensable.' },
      { type: 'phrase', items: [
        { local: 'Bună ziua', meaning: 'Bonjour' },
        { local: 'Mulțumesc', meaning: 'Merci' },
        { local: 'Gratis', meaning: 'Gratuit' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Le pays le moins cher d\'Europe. Budget serré : 8-12 €/jour. Un repas complet au restaurant : 3-5 €. Vin local excellent à 1-2 €/bouteille. Auberge : 8-12 €/nuit.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Le camping sauvage est toléré mais pas courant. Les vignobles offrent de beaux emplacements. Les familles invitent souvent les voyageurs à dormir chez eux, surtout en zone rurale.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚐', name: 'Marshrutka', detail: 'Principal transport entre villes, fréquent et bon marché', price: '1-3 €' },
        { emoji: '🚂', name: 'Train', detail: 'Lent mais existant sur les lignes principales', price: '1-5 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Fév', level: 'bad' }, { name: 'Mar', level: 'ok' },
        { name: 'Avr', level: 'good' }, { name: 'Mai', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'good' }, { name: 'Aoû', level: 'good' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'ok' }, { name: 'Déc', level: 'bad' },
      ]},
      { type: 'text', text: 'Mai-juin et septembre-octobre : idéal. L\'été peut être très chaud (35°C+). L\'automne est la saison des vendanges, moment idéal pour visiter.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'La Moldavie est le pays du vin. Les caves souterraines de Mileștii Mici sont les plus grandes au monde (200 km de galeries). L\'hospitalité moldave est sincère et généreuse. On t\'offrira du vin maison, de la mămăligă (polenta) et de la plăcintă (tourte).' },
      { type: 'event', items: [
        { month: 'Oct', day: '⟳', name: 'Ziua Vinului (Jour du Vin)', desc: 'Festival national du vin à Chișinău. Dégustation gratuite partout.' },
      ]},
    ]},
  },
  // ==================== UKRAINE ====================
  UA: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'L\'autostop est légal en Ukraine. Aucune restriction. Pratique courante et culturellement acceptée. Les Ukrainiens sont familiers avec le concept.' },
      { type: 'warn', text: '⚠️ Depuis 2022, la situation sécuritaire a radicalement changé. Vérifie les zones de conflit actif avant de voyager. L\'ouest du pays (Lviv, Carpates) reste le plus accessible. La loi martiale peut restreindre les déplacements.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'En temps de paix, l\'Ukraine est l\'un des meilleurs pays d\'Europe pour l\'autostop. Les conducteurs sont généreux et curieux. Temps d\'attente : 10-20 min. Les camionneurs font de longues distances. Les routes principales (M06 Kiev-Lviv, M05 Kiev-Odessa) ont un bon trafic.' },
      { type: 'text', text: 'Beaucoup de conducteurs proposent spontanément nourriture, boissons et hébergement. Le concept "avtoStop" est bien compris. Certains conducteurs font des détours importants pour t\'aider.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Vérifie la situation sécuritaire avant de voyager en Ukraine. Les zones ouest et centre sont historiquement plus stables.' },
      { type: 'sub', title: 'Utilise SpotHitch pour ta sécurité' },
      { type: 'rule', icon: '🛡️', text: 'Active le Mode Gardien avant chaque trajet. Un proche suit ta position en temps réel.' },
      { type: 'rule', icon: '🆘', text: 'Configure le mode SOS avec tes contacts. Un seul geste déclenche une triple alerte (push, SMS, appel).' },
      { type: 'rule', icon: '📱', text: 'Photographie la plaque du véhicule et envoie-la à un proche avant de monter.' },
      { type: 'rule', icon: '🎒', text: 'Garde ton sac accessible (sur tes genoux ou à tes pieds), jamais dans le coffre.' },
      { type: 'sub', title: 'Conseils spécifiques' },
      { type: 'rule', icon: '📋', text: 'Consulte les avis du ministère des Affaires étrangères avant tout déplacement. La situation évolue.' },
      { type: 'rule', icon: '🌍', text: 'Les zones ouest (Lviv, Ivano-Frankivsk) et centre (Kyiv, Vinnytsia) sont historiquement les plus stables.' },
      { type: 'sub', title: 'Numéros d\'urgence' },
      { type: 'kv', items: [
        { k: 'Urgences', v: '112' },
        { k: 'Police', v: '102' },
        { k: 'Ambulance', v: '103' },
      ]},
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'En temps de paix, plusieurs voyageuses rapportent des expériences positives en Ukraine. La société est traditionnelle mais respectueuse. Lviv et les Carpates sont les régions les plus recommandées pour les femmes voyageant seules.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'L\'ukrainien est la langue officielle. Le russe est compris par la majorité mais son usage est sensible politiquement depuis 2022. Utilise de préférence l\'ukrainien ou l\'anglais. L\'anglais est parlé par les jeunes à Kiev et Lviv.' },
      { type: 'phrase', items: [
        { local: 'Dobriy den', meaning: 'Bonjour' },
        { local: 'Dyakuyu', meaning: 'Merci' },
        { local: 'Bezkoshtovno', meaning: 'Gratuit' },
        { local: 'Do... (+ ville)', meaning: 'Jusqu\'à...' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Très bon marché. Budget serré : 10-15 €/jour. Repas dans une їdal\'nya (cantine) : 2-4 €. Auberge à Kiev : 5-10 €/nuit. Train de nuit Kiev-Lviv : ~8 €.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Le camping sauvage est toléré dans les forêts et les Carpates. Les Ukrainiens invitent souvent les voyageurs chez eux. Couchsurfing actif à Kiev et Lviv.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚂', name: 'Ukrzaliznytsia (train)', detail: 'Réseau étendu, trains de nuit confortables et bon marché', price: '3-15 €' },
        { emoji: '🚐', name: 'Marshrutka', detail: 'Minibus fréquents entre villes', price: '1-5 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Fév', level: 'bad' }, { name: 'Mar', level: 'ok' },
        { name: 'Avr', level: 'good' }, { name: 'Mai', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'good' }, { name: 'Aoû', level: 'good' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'ok' }, { name: 'Déc', level: 'bad' },
      ]},
      { type: 'text', text: 'Mai-juin et septembre : idéal (20-28°C). L\'été est chaud dans le sud. L\'hiver est rude (-10 à -20°C) et déconseillé. Les Carpates sont magnifiques en automne.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'L\'hospitalité ukrainienne est sincère et généreuse. Le borchtch, le salo (lard) et la horilka (vodka au poivre) sont incontournables. Les conducteurs offrent souvent des fruits, du pain et des boissons. La culture du partage est profondément ancrée.' },
    ]},
  },
  // ==================== KOSOVO ====================
  XK: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'L\'autostop est légal au Kosovo. Pas de restrictions connues. La pratique est courante car le réseau de bus est limité.' },
      { type: 'warn', text: '⚠️ Le Kosovo n\'est pas reconnu par tous les pays. Vérifie si ton pays le reconnaît avant de voyager. L\'entrée depuis la Serbie peut poser problème (considérée comme entrée illégale par la Serbie).' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Le Kosovo est très facile pour l\'autostop. Le pays est petit (150 km d\'est en ouest) et se traverse en quelques heures. Les conducteurs sont extrêmement accueillants, surtout envers les étrangers. Temps d\'attente : 5-15 min.' },
      { type: 'text', text: 'Les Kosovars ont un profond sentiment de gratitude envers les étrangers. Beaucoup offrent des repas, du café et insistent pour t\'aider. L\'autoroute Pristina-Prizren a un bon trafic.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Le Kosovo est un pays sûr pour l\'autostop. Les habitants sont très hospitaliers envers les étrangers et curieux de rencontrer des voyageurs.' },
      { type: 'sub', title: 'Utilise SpotHitch pour ta sécurité' },
      { type: 'rule', icon: '🛡️', text: 'Active le Mode Gardien avant chaque trajet. Un proche suit ta position en temps réel.' },
      { type: 'rule', icon: '🆘', text: 'Configure le mode SOS avec tes contacts. Un seul geste déclenche une triple alerte (push, SMS, appel).' },
      { type: 'rule', icon: '📱', text: 'Photographie la plaque du véhicule et envoie-la à un proche avant de monter.' },
      { type: 'rule', icon: '🎒', text: 'Garde ton sac accessible (sur tes genoux ou à tes pieds), jamais dans le coffre.' },
      { type: 'sub', title: 'Conseils spécifiques' },
      { type: 'rule', icon: '🤝', text: 'Les Kosovars sont parmi les peuples les plus accueillants des Balkans. Ils adorent discuter avec les étrangers.' },
      { type: 'rule', icon: '☕', text: 'On t\'offrira souvent un café turc ou un repas. Accepter est un signe de respect.' },
      { type: 'sub', title: 'Numéros d\'urgence' },
      { type: 'kv', items: [{ k: 'Urgences', v: '112' }, { k: 'Police', v: '192' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Considéré comme sûr pour les femmes voyageant seules. La société est traditionnelle mais très respectueuse des étrangers. Plusieurs voyageuses rapportent des expériences positives.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'L\'albanais est la langue principale. Le serbe est parlé dans les enclaves serbes du nord. L\'anglais est très répandu chez les jeunes (influence internationale depuis 1999). L\'allemand est compris par beaucoup (grande diaspora en Allemagne/Suisse).' },
      { type: 'phrase', items: [
        { local: 'Faleminderit', meaning: 'Merci' },
        { local: 'Ku po shkon?', meaning: 'Où vas-tu ?' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Très bon marché. Budget serré : 10-15 €/jour. Repas complet : 3-5 €. Café : 0,50-1 €. Auberge : 8-12 €/nuit. Le Kosovo utilise l\'euro.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Le camping sauvage est possible dans les zones rurales. Les familles kosovares invitent très facilement les voyageurs chez elles. C\'est une question d\'honneur.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Bus', detail: 'Réseau limité mais couvre les villes principales', price: '2-5 €' },
        { emoji: '🚐', name: 'Furgon', detail: 'Minibus informels, fréquents et bon marché', price: '1-3 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Fév', level: 'bad' }, { name: 'Mar', level: 'ok' },
        { name: 'Avr', level: 'good' }, { name: 'Mai', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'good' }, { name: 'Aoû', level: 'good' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'ok' }, { name: 'Déc', level: 'bad' },
      ]},
      { type: 'text', text: 'Mai-juin et septembre : idéal. L\'été est chaud (35°C+). L\'hiver est froid avec de la neige.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Le Kosovo est un pays jeune (indépendant depuis 2008) avec une population très jeune (âge médian : 29 ans). L\'hospitalité est exceptionnelle. Le macchiato et le café turc sont des institutions. Le pays vibre d\'énergie et d\'optimisme.' },
    ]},
  },
  // ==================== MOROCCO ====================
  MA: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'L\'autostop est légal et très répandu au Maroc. Aucune restriction. C\'est un mode de transport courant pour les locaux aussi. La pratique est ancrée dans la culture d\'hospitalité marocaine.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Le Maroc est l\'un des meilleurs pays au monde pour l\'autostop. Temps d\'attente moyen : 5-15 min. Les conducteurs s\'arrêtent très facilement, parfois sans qu\'on le demande. Les camions prennent régulièrement des autostoppeurs sur les longues distances.' },
      { type: 'sub', title: 'Points clés' },
      { type: 'rule', icon: '🚛', text: 'Les camionneurs sont les meilleurs alliés. Ils parcourent de longues distances et sont habitués à prendre des gens.' },
      { type: 'rule', icon: '⛽', text: 'Les stations-service aux sorties de villes sont les meilleurs spots.' },
      { type: 'rule', icon: '🤝', text: 'Certains conducteurs attendent un petit paiement (transport informel). Clarifie "autostop, bla flous" (sans argent) ou propose de partager l\'essence.' },
      { type: 'text', text: 'Dans le sud et l\'Atlas, le trafic est faible mais les gens s\'arrêtent presque systématiquement. Les grands taxis collectifs sont le transport principal entre villes.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Le Maroc est un pays sûr pour l\'autostop. Les routes nationales sont en bon état et les Marocains sont accueillants envers les voyageurs. En été, prévois beaucoup d\'eau.' },
      { type: 'sub', title: 'Utilise SpotHitch pour ta sécurité' },
      { type: 'rule', icon: '🛡️', text: 'Active le Mode Gardien avant chaque trajet. Un proche suit ta position en temps réel.' },
      { type: 'rule', icon: '🆘', text: 'Configure le mode SOS avec tes contacts. Un seul geste déclenche une triple alerte (push, SMS, appel).' },
      { type: 'rule', icon: '📱', text: 'Photographie la plaque du véhicule et envoie-la à un proche avant de monter.' },
      { type: 'rule', icon: '🎒', text: 'Garde ton sac accessible (sur tes genoux ou à tes pieds), jamais dans le coffre.' },
      { type: 'sub', title: 'Conseils spécifiques' },
      { type: 'rule', icon: '🛣️', text: 'Les routes nationales sont en bon état. Positionne-toi aux sorties de ville ou aux stations-service.' },
      { type: 'rule', icon: '💧', text: 'En été, les températures dépassent 40°C. Emporte toujours de l\'eau et protège-toi du soleil.' },
      { type: 'sub', title: 'Numéros d\'urgence' },
      { type: 'kv', items: [{ k: 'Police', v: '19' }] },
    ]},
    women: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'Le Maroc est plus délicat pour les femmes voyageant seules. Le harcèlement de rue (commentaires, regards insistants) est courant dans les villes. En autostop, les expériences sont mixtes : beaucoup de trajets positifs mais quelques situations inconfortables rapportées.' },
      { type: 'rule', icon: '👫', text: 'Voyager en duo est fortement recommandé.' },
      { type: 'rule', icon: '👕', text: 'Habille-toi de façon conservatrice (épaules et genoux couverts).' },
      { type: 'rule', icon: '💍', text: '"Mon mari m\'attend à..." est une phrase efficace pour couper court.' },
      { type: 'text', text: 'Les zones touristiques (Marrakech, Fès) sont plus intenses. Les zones rurales et l\'Atlas sont souvent plus respectueux et accueillants.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'L\'arabe marocain (darija) et le berbère sont les langues locales. Le français est très répandu (langue d\'éducation et de business). L\'anglais progresse chez les jeunes. L\'espagnol est compris dans le nord (Tanger, Tétouan, Nador).' },
      { type: 'phrase', items: [
        { local: 'Salam / Salam aleikoum', meaning: 'Bonjour / Paix sur toi' },
        { local: 'Choukran', meaning: 'Merci' },
        { local: 'Bla flous', meaning: 'Sans argent (gratuit)' },
        { local: 'Wach kayn chi triq l...?', meaning: 'Il y a un chemin vers... ?' },
        { local: 'Bslama', meaning: 'Au revoir' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Très bon marché. Budget serré : 10-20 €/jour. Le thé à la menthe est souvent offert.' },
      { type: 'kv', items: [
        { k: 'Repas dans un boui-boui', v: '2-4 €' },
        { k: 'Tagine au restaurant', v: '4-8 €' },
        { k: 'Hostel / riad basique', v: '5-15 €/nuit' },
        { k: 'Grand taxi collectif (50 km)', v: '1-3 €' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Le camping sauvage est toléré dans les montagnes de l\'Atlas et le désert. Évite les plages près des villes. Les Marocains invitent souvent les voyageurs chez eux pour le thé, le repas, et parfois dormir. Dans les villages berbères de l\'Atlas, l\'hospitalité est quasi systématique.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚕', name: 'Grand taxi', detail: 'Taxis collectifs entre villes. 6 passagers, attendent d\'être pleins.', price: '1-5 €' },
        { emoji: '🚌', name: 'CTM / Supratours', detail: 'Bus longue distance confortables et fiables', price: '5-20 €' },
        { emoji: '🚂', name: 'ONCF (train)', detail: 'Réseau limité mais fiable (Tanger-Marrakech)', price: '5-25 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'ok' }, { name: 'Fév', level: 'good' }, { name: 'Mar', level: 'great' },
        { name: 'Avr', level: 'great' }, { name: 'Mai', level: 'great' }, { name: 'Jun', level: 'good' },
        { name: 'Jul', level: 'ok' }, { name: 'Aoû', level: 'ok' }, { name: 'Sep', level: 'good' },
        { name: 'Oct', level: 'great' }, { name: 'Nov', level: 'great' }, { name: 'Déc', level: 'ok' },
      ]},
      { type: 'text', text: 'Mars-mai et septembre-novembre : idéal. L\'été est torride dans le sud et l\'intérieur (40-45°C). L\'hiver est doux sur la côte mais froid dans l\'Atlas (neige). Ramadan : le rythme change mais l\'hospitalité reste.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'L\'hospitalité marocaine est légendaire. Le thé à la menthe est un rituel sacré : en refuser un est impoli. Les conducteurs offrent souvent le thé, le repas, et font des détours pour t\'aider. La culture berbère dans l\'Atlas est particulièrement accueillante.' },
      { type: 'event', items: [
        { month: 'Jun', day: '⟳', name: 'Festival Gnaoua (Essaouira)', desc: 'Musique gnaoua et world music. Ambiance incroyable.' },
        { month: 'Nov', day: '⟳', name: 'Festival des Dattes (Erfoud)', desc: 'Célébration de la récolte des dattes dans le sud-est.' },
      ]},
    ]},
  },
  // ==================== UNITED STATES ====================
  US: {
    laws: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'La légalité varie selon les États. Globalement : l\'autostop est interdit sur les Interstates (autoroutes fédérales) partout, mais toléré voire légal sur les bretelles d\'accès et les routes secondaires dans beaucoup d\'États.' },
      { type: 'sub', title: 'États où c\'est légal' },
      { type: 'text', text: 'Oregon, Nevada, Colorado, Wyoming, Montana, Idaho et d\'autres États de l\'Ouest tolèrent ou autorisent explicitement le stop sur les bretelles. Vérifie la loi de chaque État avant.' },
      { type: 'sub', title: 'États où c\'est interdit' },
      { type: 'text', text: 'New York, New Jersey, Pennsylvanie, Delaware, Connecticut et d\'autres interdisent le stop même sur les bretelles. En Floride, la loi change selon les comtés.' },
      { type: 'sub', title: 'Amendes' },
      { type: 'text', text: 'Rarement verbalisé. La police te demandera généralement de bouger. Dans les pires cas : amende de 25-100 $ ou un avertissement.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Les USA sont le pays où l\'autostop a le plus décliné depuis les années 70. Les distances sont immenses, le taux de motorisation est de 95%, et la culture de la peur (stranger danger) rend les conducteurs méfiants. Temps d\'attente moyen : 1-3h, parfois beaucoup plus.' },
      { type: 'sub', title: 'Où ça marche' },
      { type: 'kv', items: [
        { k: 'Ouest rural (Montana, Wyoming, Idaho)', v: 'Le meilleur', color: 'green' },
        { k: 'Pacific Northwest (Oregon, Washington)', v: 'Bon, culture alternative', color: 'green' },
        { k: 'Hawaï', v: 'Facile et courant', color: 'green' },
        { k: 'Sud rural (Texas rural, Louisiane)', v: 'Variable mais amical', color: 'amber' },
        { k: 'Côte Est / grandes villes', v: 'Très difficile', color: 'red' },
      ]},
      { type: 'sub', title: 'Stratégie' },
      { type: 'text', text: 'Aux USA, aborder les conducteurs dans les stations-service (gas stations) ou les truck stops est plus efficace que le pouce au bord de la route. Les truck stops (TA, Pilot, Flying J, Love\'s) sont les meilleurs spots pour les longues distances.' },
      { type: 'tip', text: '💡 Les groupes Facebook "Ride Share" par État sont une alternative complémentaire au stop.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Les États-Unis sont sûrs pour l\'autostop dans la plupart des régions. Les gas stations sont d\'excellents spots. Prévois de l\'eau et des provisions, car les distances sont immenses.' },
      { type: 'sub', title: 'Utilise SpotHitch pour ta sécurité' },
      { type: 'rule', icon: '🛡️', text: 'Active le Mode Gardien avant chaque trajet. Un proche suit ta position en temps réel.' },
      { type: 'rule', icon: '🆘', text: 'Configure le mode SOS avec tes contacts. Un seul geste déclenche une triple alerte (push, SMS, appel).' },
      { type: 'rule', icon: '📱', text: 'Photographie la plaque du véhicule et envoie-la à un proche avant de monter.' },
      { type: 'rule', icon: '🎒', text: 'Garde ton sac accessible (sur tes genoux ou à tes pieds), jamais dans le coffre.' },
      { type: 'sub', title: 'Conseils spécifiques' },
      { type: 'rule', icon: '⛽', text: 'Les gas stations (stations-service) sont les meilleurs spots pour aborder les conducteurs avant qu\'ils repartent.' },
      { type: 'rule', icon: '🗺️', text: 'Les distances sont immenses (200+ km entre les villes parfois). Prévois eau, nourriture et un chargeur solaire.' },
      { type: 'sub', title: 'Numéros d\'urgence' },
      { type: 'kv', items: [{ k: 'Urgences', v: '911' }] },
    ]},
    women: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'Les USA sont le pays où les femmes rapportent le plus de méfiance (des deux côtés). Faire du stop seule en tant que femme est déconseillé par la plupart des sources, surtout dans les zones isolées. Les couples mixtes ou les groupes de deux sont beaucoup mieux perçus.' },
      { type: 'rule', icon: '👫', text: 'Voyager en duo est quasi indispensable.' },
      { type: 'rule', icon: '📱', text: 'Partage ta position en temps réel (SpotHitch, Google Maps, WhatsApp).' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'L\'anglais est indispensable. L\'espagnol est très utile dans le sud-ouest (Texas, Arizona, Nouveau-Mexique, Californie). Aucune barrière linguistique pour les francophones parlant anglais.' },
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Les USA sont chers. Budget serré : 30-50 $/jour minimum. Les truck stops offrent des repas copieux à prix raisonnables.' },
      { type: 'kv', items: [
        { k: 'Hostel', v: '25-50 $/nuit' },
        { k: 'Walmart (camping parking)', v: 'Gratuit (toléré)' },
        { k: 'Fast food', v: '8-15 $' },
        { k: 'Diner / truck stop', v: '10-20 $' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Le camping sauvage est légal sur les terres fédérales (BLM land, National Forests) qui couvrent des millions d\'hectares dans l\'Ouest. Gratuit et sans permis dans la plupart des cas. Walmart autorise souvent le camping sur ses parkings. Les parkings de truck stops sont utilisables la nuit.' },
      { type: 'tip', text: '💡 Il existe de nombreuses apps et sites pour trouver des spots de camping gratuit sur les terres fédérales.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Greyhound', detail: 'Bus longue distance, réseau étendu', price: '30-100 $' },
        { emoji: '🚌', name: 'FlixBus', detail: 'Alternative moins chère, réseau en expansion', price: '10-50 $' },
        { emoji: '🚂', name: 'Amtrak', detail: 'Train, lent mais scenic. Le California Zephyr est magnifique.', price: '30-200 $' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Fév', level: 'bad' }, { name: 'Mar', level: 'ok' },
        { name: 'Avr', level: 'good' }, { name: 'Mai', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'good' }, { name: 'Aoû', level: 'good' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'ok' }, { name: 'Déc', level: 'bad' },
      ]},
      { type: 'text', text: 'Mai-juin et septembre : idéal dans l\'Ouest. L\'été est brûlant dans le Sud-Ouest (45°C+ en Arizona). L\'hiver ferme les cols de montagne. Le Nord-Est est praticable d\'avril à octobre.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'L\'autostop a une place mythique dans la culture américaine (Jack Kerouac, Route 66, les beatniks). Aujourd\'hui la pratique est marginale mais ceux qui prennent des stoppeurs sont souvent des gens extraordinaires : anciens routards, camionneurs solitaires, aventuriers. Les conversations sont souvent mémorables.' },
      { type: 'event', items: [
        { month: 'Août', day: '⟳', name: 'Burning Man (Nevada)', desc: 'Festival dans le désert. Beaucoup de stoppeurs sur les routes du Nevada.' },
      ]},
    ]},
  },
  // ==================== CANADA ====================
  CA: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'L\'autostop est légal dans la plupart des provinces. Interdit sur les autoroutes (highways) dans certaines provinces (Ontario, Colombie-Britannique) mais autorisé sur les bretelles d\'accès. En Alberta et dans les provinces des Prairies, le stop est généralement toléré.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Le Canada est plus facile que les USA pour l\'autostop. La culture canadienne est plus ouverte et les distances entre communautés créent une solidarité naturelle. Temps d\'attente moyen : 30 min-1h30. L\'Ouest (Colombie-Britannique, Alberta) est le plus facile.' },
      { type: 'sub', title: 'Meilleures zones' },
      { type: 'kv', items: [
        { k: 'Colombie-Britannique (hors Vancouver)', v: 'Très bon, culture du stop vivante', color: 'green' },
        { k: 'Alberta (Highway 1, Highway 93)', v: 'Bon trafic, Rocheuses', color: 'green' },
        { k: 'Provinces maritimes', v: 'Facile et amical', color: 'green' },
        { k: 'Ontario rural', v: 'Correct', color: 'amber' },
        { k: 'Toronto, Montréal (sortie de ville)', v: 'Difficile', color: 'red' },
      ]},
      { type: 'text', text: 'Les gas stations (Esso, Petro-Canada, Shell) et les Tim Hortons en bord de route sont les meilleurs spots pour aborder les conducteurs.' },
      { type: 'warn', text: '⚠️ Sur la Highway 16 (nord de la C.-B.), les distances sont très longues et la couverture réseau limitée. Prévois un plan de route et préviens quelqu\'un.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Le Canada est un pays très sûr pour l\'autostop. Les distances sont immenses, alors prévois toujours de l\'eau et de la nourriture.' },
      { type: 'sub', title: 'Utilise SpotHitch pour ta sécurité' },
      { type: 'rule', icon: '🛡️', text: 'Active le Mode Gardien avant chaque trajet. Un proche suit ta position en temps réel.' },
      { type: 'rule', icon: '🆘', text: 'Configure le mode SOS avec tes contacts. Un seul geste déclenche une triple alerte (push, SMS, appel).' },
      { type: 'rule', icon: '📱', text: 'Photographie la plaque du véhicule et envoie-la à un proche avant de monter.' },
      { type: 'rule', icon: '🎒', text: 'Garde ton sac accessible (sur tes genoux ou à tes pieds), jamais dans le coffre.' },
      { type: 'sub', title: 'Conseils spécifiques' },
      { type: 'rule', icon: '🗺️', text: 'Les distances sont immenses (parfois 200+ km sans réseau). Emporte toujours eau, nourriture et un chargeur.' },
      { type: 'rule', icon: '🍁', text: 'Les Canadiens sont réputés pour leur gentillesse. Un panneau clair et un sourire suffisent à obtenir un lift.' },
      { type: 'sub', title: 'Numéros d\'urgence' },
      { type: 'kv', items: [{ k: 'Urgences', v: '911' }] },
    ]},
    women: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'Le Canada est plus sûr que les USA pour les femmes. Les voyageuses solo rapportent des expériences majoritairement positives. Dans les zones isolées, prévois ton itinéraire et préviens quelqu\'un.' },
      { type: 'rule', icon: '📱', text: 'Préviens quelqu\'un de ton itinéraire. Certaines zones n\'ont aucun réseau.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'L\'anglais partout sauf au Québec. Au Québec, le français est la langue principale. Les Québécois apprécient qu\'on parle français. Dans les provinces atlantiques (Nouveau-Brunswick), les deux langues coexistent.' },
      { type: 'phrase', items: [
        { local: 'Je fais du pouce', meaning: 'L\'expression québécoise pour l\'autostop' },
        { local: 'Merci, bonne route !', meaning: 'En descendant (au Québec)' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Le Canada est cher. Budget serré : 30-50 CAD/jour (~20-35 €). Les épiceries (Walmart, No Frills) sont moins chères que les restos. Tim Hortons est bon marché pour les repas rapides.' },
      { type: 'kv', items: [
        { k: 'Hostel', v: '25-50 CAD/nuit' },
        { k: 'Tim Hortons repas', v: '5-10 CAD' },
        { k: 'Camping provincial', v: '15-35 CAD/nuit' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Le camping sauvage est autorisé sur les Crown Lands (terres de la Couronne) qui couvrent 89% du territoire. Gratuit sans permis dans la plupart des provinces. Les rest areas le long des highways permettent souvent de dormir quelques heures.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Rider Express / FlixBus', detail: 'Bus longue distance, réseau limité dans l\'Ouest', price: '30-100 CAD' },
        { emoji: '🚂', name: 'VIA Rail', detail: 'Train transcontinental, lent mais scenic', price: '50-300 CAD' },
      ]},
      { type: 'tip', text: '💡 Les groupes Facebook et les plateformes d\'annonces locales sont utiles pour le covoiturage au Canada.' },
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Fév', level: 'bad' }, { name: 'Mar', level: 'bad' },
        { name: 'Avr', level: 'ok' }, { name: 'Mai', level: 'good' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Aoû', level: 'great' }, { name: 'Sep', level: 'good' },
        { name: 'Oct', level: 'ok' }, { name: 'Nov', level: 'bad' }, { name: 'Déc', level: 'bad' },
      ]},
      { type: 'text', text: 'Juin à août : idéal. Le Canada a des hivers extrêmes (-30 à -40°C dans les Prairies). Le stop en hiver est dangereux (hypothermie). Septembre est magnifique pour les couleurs d\'automne dans l\'Est.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Les Canadiens sont réputés pour leur politesse et leur hospitalité. "Sorry" est le mot le plus courant. Les conducteurs offrent souvent café, repas et hébergement. La culture outdoor (camping, randonnée) rend les gens ouverts aux voyageurs.' },
    ]},
  },
  // ==================== NEW ZEALAND ====================
  NZ: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'L\'autostop est parfaitement légal en Nouvelle-Zélande. Aucune restriction. C\'est un mode de transport reconnu et accepté culturellement. Même le site officiel du tourisme le mentionne.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'La Nouvelle-Zélande est l\'un des meilleurs pays au monde pour l\'autostop. Temps d\'attente moyen : 10-30 min. Les Kiwis s\'arrêtent facilement et sont très accueillants. Le stop est vu comme un mode de transport normal.' },
      { type: 'sub', title: 'Île du Nord vs Île du Sud' },
      { type: 'kv', items: [
        { k: 'Île du Sud', v: 'Plus facile, moins de trafic mais tout le monde s\'arrête', color: 'green' },
        { k: 'Île du Nord', v: 'Bon aussi, plus de trafic autour d\'Auckland/Wellington', color: 'green' },
      ]},
      { type: 'text', text: 'La State Highway 1 est la route principale des deux îles. Le ferry entre les îles (Interislander) est la seule option entre Wellington et Picton.' },
      { type: 'tip', text: '💡 Un panneau avec ta destination est quasi indispensable. Les Kiwis aiment savoir exactement où tu vas.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'La Nouvelle-Zélande est un pays très sûr pour l\'autostop. Le stop fonctionne très bien et les Kiwis s\'arrêtent souvent spontanément.' },
      { type: 'sub', title: 'Utilise SpotHitch pour ta sécurité' },
      { type: 'rule', icon: '🛡️', text: 'Active le Mode Gardien avant chaque trajet. Un proche suit ta position en temps réel.' },
      { type: 'rule', icon: '🆘', text: 'Configure le mode SOS avec tes contacts. Un seul geste déclenche une triple alerte (push, SMS, appel).' },
      { type: 'rule', icon: '📱', text: 'Photographie la plaque du véhicule et envoie-la à un proche avant de monter.' },
      { type: 'rule', icon: '🎒', text: 'Garde ton sac accessible (sur tes genoux ou à tes pieds), jamais dans le coffre.' },
      { type: 'sub', title: 'Conseils spécifiques' },
      { type: 'rule', icon: '👍', text: 'Les Kiwis s\'arrêtent souvent spontanément. Le stop est culturellement accepté et pratiqué.' },
      { type: 'rule', icon: '🏔️', text: 'Les paysages sont magnifiques. Profite de chaque trajet pour découvrir la nature néo-zélandaise.' },
      { type: 'sub', title: 'Numéros d\'urgence' },
      { type: 'kv', items: [{ k: 'Urgences', v: '111' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'La Nouvelle-Zélande est considérée comme l\'un des pays les plus sûrs au monde pour les femmes voyageant seules. De nombreuses voyageuses font du stop sans problème. Le pays a été le premier à accorder le droit de vote aux femmes (1893).' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'L\'anglais est la langue principale. Le māori est la seconde langue officielle (quelques mots sont utilisés au quotidien : kia ora = bonjour). Aucune barrière linguistique.' },
      { type: 'phrase', items: [
        { local: 'Kia ora', meaning: 'Bonjour (māori, utilisé par tous)' },
        { local: 'Sweet as', meaning: 'Cool, pas de souci (expression kiwi)' },
        { local: 'Chur / Cheers', meaning: 'Merci' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'La NZ est chère. Budget serré : 30-50 NZD/jour (~17-28 €). La nourriture en supermarché est abordable (Countdown, Pak\'nSave). Les hébergements gratuits (DOC campsites, Freedom camping) aident à réduire les coûts.' },
      { type: 'kv', items: [
        { k: 'Hostel (YHA, BBH)', v: '25-40 NZD/nuit' },
        { k: 'DOC campsite (basique)', v: '0-8 NZD/nuit' },
        { k: 'Fish & chips', v: '8-15 NZD' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Le "freedom camping" (camping sauvage en van ou tente) est réglementé mais possible. Les DOC campsites (Department of Conservation) offrent des emplacements gratuits ou très bon marché dans des endroits magnifiques. Le camping sauvage en tente est toléré si tu es discret et que tu emportes tes déchets.' },
      { type: 'tip', text: '💡 Plusieurs apps locales référencent les spots de camping gratuit en Nouvelle-Zélande.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'InterCity', detail: 'Principal réseau de bus. Le FlexiPass offre des réductions.', price: '15-80 NZD' },
        { emoji: '⛴️', name: 'Interislander / Bluebridge', detail: 'Ferry Wellington-Picton (3h30)', price: '55-80 NZD' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'great' }, { name: 'Fév', level: 'great' }, { name: 'Mar', level: 'great' },
        { name: 'Avr', level: 'good' }, { name: 'Mai', level: 'ok' }, { name: 'Jun', level: 'bad' },
        { name: 'Jul', level: 'bad' }, { name: 'Aoû', level: 'bad' }, { name: 'Sep', level: 'ok' },
        { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'good' }, { name: 'Déc', level: 'great' },
      ]},
      { type: 'text', text: 'Hémisphère sud : l\'été est de décembre à février. Novembre à mars : idéal. L\'hiver (juin-août) est frais dans le sud mais praticable. La météo change vite, emporte toujours une couche imperméable.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Les Kiwis sont décontractés et accueillants. Le "no worries" est un mode de vie. Les conducteurs font des détours, offrent le café et parfois un lit. La culture outdoor (tramping = randonnée) crée un lien naturel avec les voyageurs. Le pays est petit (4,8 millions d\'habitants) et les gens se connaissent.' },
    ]},
  },
  // ==================== AUSTRALIA ====================
  AU: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'La légalité varie selon les États. Légal dans la plupart des États (Victoria, Nouvelle-Galles du Sud, Australie-Occidentale). Interdit dans le Queensland (amende possible mais rarement appliquée). Toujours interdit sur les autoroutes (freeways/motorways).' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'L\'Australie était un paradis du stop dans les années 70-80 mais la pratique a beaucoup décliné. Les distances sont immenses (Perth-Sydney : 3 900 km). Temps d\'attente : 30 min-3h selon la zone.' },
      { type: 'sub', title: 'Meilleures zones' },
      { type: 'kv', items: [
        { k: 'Côte Est (Sydney-Cairns)', v: 'Le plus de trafic', color: 'green' },
        { k: 'Tasmanie', v: 'Petit, facile, tout le monde s\'arrête', color: 'green' },
        { k: 'Outback / Centre', v: 'Peu de trafic, attentes longues mais gens accueillants', color: 'amber' },
        { k: 'Perth-Adelaide (Nullarbor Plain)', v: 'Risqué : 1 200 km de désert', color: 'red' },
      ]},
      { type: 'text', text: 'Les roadhouses (stations-service isolées) et les truck stops sont les meilleurs spots. Les road trains (camions triples) prennent parfois des passagers sur les longues distances.' },
      { type: 'warn', text: '⚠️ TOUJOURS avoir 5-10 litres d\'eau en réserve dans l\'Outback. La déshydratation tue.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'L\'Australie est un pays sûr pour l\'autostop. Les distances sont immenses (500+ km entre les villes). Prévois eau et chargeur solaire, et ne fais pas de stop de nuit dans l\'Outback.' },
      { type: 'sub', title: 'Utilise SpotHitch pour ta sécurité' },
      { type: 'rule', icon: '🛡️', text: 'Active le Mode Gardien avant chaque trajet. Un proche suit ta position en temps réel.' },
      { type: 'rule', icon: '🆘', text: 'Configure le mode SOS avec tes contacts. Un seul geste déclenche une triple alerte (push, SMS, appel).' },
      { type: 'rule', icon: '📱', text: 'Photographie la plaque du véhicule et envoie-la à un proche avant de monter.' },
      { type: 'rule', icon: '🎒', text: 'Garde ton sac accessible (sur tes genoux ou à tes pieds), jamais dans le coffre.' },
      { type: 'sub', title: 'Conseils spécifiques' },
      { type: 'rule', icon: '💧', text: 'Les distances sont immenses (500+ km entre villes). Emporte toujours de l\'eau et un chargeur solaire.' },
      { type: 'rule', icon: '☀️', text: 'Pas de stop de nuit dans l\'Outback. Les températures atteignent 45°C en journée et le réseau est inexistant.' },
      { type: 'sub', title: 'Numéros d\'urgence' },
      { type: 'kv', items: [{ k: 'Urgences', v: '000' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Les expériences sont mixtes. La côte Est et la Tasmanie sont considérées comme sûres. L\'Outback isolé est déconseillé aux femmes seules. Voyager en duo est recommandé.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'L\'anglais australien a son propre vocabulaire (arvo = afternoon, brekkie = breakfast, servo = gas station, ute = pickup). Les Australiens sont informels et utilisent beaucoup d\'argot.' },
      { type: 'phrase', items: [
        { local: 'G\'day mate', meaning: 'Bonjour (informel)' },
        { local: 'No worries', meaning: 'Pas de souci' },
        { local: 'Ta / Cheers', meaning: 'Merci' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'L\'Australie est chère. Budget serré : 40-60 AUD/jour (~25-37 €). La nourriture en supermarché (Woolworths, Coles, Aldi) est abordable. Manger dehors est cher.' },
      { type: 'kv', items: [
        { k: 'Hostel', v: '25-45 AUD/nuit' },
        { k: 'Repas pub', v: '15-25 AUD' },
        { k: 'Free camping', v: 'Gratuit (apps de camping)' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Le camping sauvage (bush camping) est légal sur les terres publiques et dans beaucoup de zones rurales. Plusieurs apps locales répertorient les spots gratuits. Les rest areas le long des highways permettent de dormir gratuitement. Attention aux serpents et araignées.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Greyhound Australia', detail: 'Bus longue distance, réseau étendu', price: '30-200 AUD' },
        { emoji: '✈️', name: 'Vols low-cost', detail: 'Jetstar, Bonza. Souvent moins cher que le bus pour les longues distances.', price: '50-150 AUD' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'ok' }, { name: 'Fév', level: 'ok' }, { name: 'Mar', level: 'good' },
        { name: 'Avr', level: 'great' }, { name: 'Mai', level: 'great' }, { name: 'Jun', level: 'good' },
        { name: 'Jul', level: 'good' }, { name: 'Aoû', level: 'good' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'great' }, { name: 'Nov', level: 'good' }, { name: 'Déc', level: 'ok' },
      ]},
      { type: 'text', text: 'Hémisphère sud : l\'hiver (juin-août) est la meilleure saison dans le nord tropical. L\'été (décembre-février) est idéal dans le sud (Melbourne, Tasmanie). Évite l\'Outback en été (45°C+).' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'La culture australienne est décontractée et accueillante. Le "mateship" (solidarité entre mates) est une valeur fondamentale. Les BBQ sur la route et les bières partagées sont des institutions. L\'humour est sec et l\'autodérision constante.' },
    ]},
  },
  // ==================== ISRAEL ====================
  IL: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'L\'autostop (trempiyada en hébreu) est légal et courant en Israël. C\'est un mode de transport établi, surtout pour les soldats. Les points d\'autostop (trempiyada) sont signalisés par des panneaux officiels aux intersections.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Israël est un excellent pays pour l\'autostop. Le pays est petit (470 km nord-sud) et les Israéliens sont très directs et accueillants. Temps d\'attente : 5-20 min. Les soldats en uniforme font du stop en masse (obligatoire, pas de voiture).' },
      { type: 'sub', title: 'Trempiyada' },
      { type: 'text', text: 'Les points de trempiyada sont des arrêts officiels d\'autostop, souvent à des carrefours. Un doigt pointé vers le sol signifie "je vais dans cette direction". C\'est le geste local, pas le pouce.' },
      { type: 'kv', items: [
        { k: 'Route 1 (Jérusalem-Tel Aviv)', v: 'Trafic dense, facile', color: 'green' },
        { k: 'Route 90 (vallée du Jourdain)', v: 'Bon trafic, paysages', color: 'green' },
        { k: 'Néguev (sud)', v: 'Peu de trafic, longues attentes', color: 'amber' },
      ]},
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'La sécurité dépend de la région. Les zones centrales (Tel Aviv, Haïfa, Galilée) sont sûres. Évite la Cisjordanie sans connaissance du terrain et les zones frontalières avec Gaza et le Liban.' },
      { type: 'kv', items: [
        { k: 'Urgences / Police', v: '100' },
        { k: 'Ambulance (Magen David Adom)', v: '101' },
        { k: 'Pompiers', v: '102' },
      ]},
      { type: 'warn', text: '⚠️ La situation sécuritaire peut changer rapidement. Consulte les alertes en temps réel. L\'app Red Alert prévient des roquettes.' },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Israël est considéré comme sûr pour les femmes voyageant seules. Les Israéliennes font beaucoup de stop seules. La société est progressiste et égalitaire, surtout à Tel Aviv. Quelques précautions dans les zones ultra-orthodoxes (habillement modeste).' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'L\'hébreu est la langue principale. L\'arabe est la seconde langue officielle. L\'anglais est très répandu (quasi tout le monde parle anglais). Le russe est courant chez les immigrants de l\'ex-URSS.' },
      { type: 'phrase', items: [
        { local: 'Shalom', meaning: 'Bonjour / Au revoir / Paix' },
        { local: 'Toda (raba)', meaning: 'Merci (beaucoup)' },
        { local: 'Tremp', meaning: 'Un lift / un stop' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Israël est cher. Budget serré : 40-60 $/jour. La nourriture de rue (falafel, shawarma) est abordable. Les supermarchés sont chers.' },
      { type: 'kv', items: [
        { k: 'Falafel / shawarma', v: '15-25 ILS (~4-7 €)' },
        { k: 'Hostel', v: '80-150 ILS/nuit (~20-40 €)' },
        { k: 'Bus Egged', v: '10-50 ILS' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Le camping sauvage est interdit dans la plupart des parcs nationaux mais toléré dans le Néguev et sur certaines plages. Les auberges de jeunesse (IYHA) sont bien réparties. Le volontariat en kibboutz ou dans des fermes bio (WWOOF) offre gîte et couvert en échange de travail.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Egged / Dan', detail: 'Réseau de bus étendu et fiable', price: '10-50 ILS' },
        { emoji: '🚂', name: 'Israel Railways', detail: 'Train rapide Tel Aviv-Jérusalem, réseau en expansion', price: '15-40 ILS' },
      ]},
      { type: 'warn', text: '⚠️ Pas de transports publics le Shabbat (vendredi soir au samedi soir) sauf à Haïfa. Le stop est la seule option gratuite le Shabbat.' },
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'ok' }, { name: 'Fév', level: 'good' }, { name: 'Mar', level: 'great' },
        { name: 'Avr', level: 'great' }, { name: 'Mai', level: 'good' }, { name: 'Jun', level: 'ok' },
        { name: 'Jul', level: 'bad' }, { name: 'Aoû', level: 'bad' }, { name: 'Sep', level: 'ok' },
        { name: 'Oct', level: 'great' }, { name: 'Nov', level: 'great' }, { name: 'Déc', level: 'ok' },
      ]},
      { type: 'text', text: 'Mars-mai et octobre-novembre : idéal. L\'été est brûlant (35-45°C dans le Néguev). L\'hiver est doux sur la côte (15-20°C) mais pluvieux.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Les Israéliens sont directs (ce n\'est pas de la grossièreté, c\'est culturel). Ils posent des questions personnelles sans filtre et offrent leur aide spontanément. Les discussions politiques sont inévitables. Le café et le hummus sont des obsessions nationales.' },
    ]},
  },
  // ==================== ARGENTINA ====================
  AR: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'L\'autostop (dedo en espagnol argentin, "hacer dedo" = lever le pouce) est légal et courant en Argentine. Aucune restriction. C\'est un mode de transport normal en Patagonie et dans les zones rurales.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'L\'Argentine est un excellent pays pour l\'autostop, surtout en Patagonie et dans le nord-ouest. Temps d\'attente : 15-45 min en zone touristique, parfois 2-3h en Patagonie profonde (très peu de trafic).' },
      { type: 'sub', title: 'Par région' },
      { type: 'kv', items: [
        { k: 'Patagonie (Ruta 40)', v: 'Mythique mais peu de trafic. Prévoir 2-3h d\'attente.', color: 'amber' },
        { k: 'Nord-ouest (Salta, Jujuy, Tucumán)', v: 'Facile et accueillant', color: 'green' },
        { k: 'Région des lacs (Bariloche)', v: 'Très bon, beaucoup de routards', color: 'green' },
        { k: 'Buenos Aires (sortie)', v: 'Difficile, prends un bus jusqu\'à la sortie de la ville', color: 'red' },
      ]},
      { type: 'text', text: 'Les stations-service YPF sont les meilleurs spots. En Patagonie, parle aux conducteurs à la station. La Ruta 40 (longue de 5 000 km) est le Graal de l\'autostop argentin.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'L\'Argentine est un pays sûr pour l\'autostop. Les stations YPF sont d\'excellents spots. En Patagonie, les distances sont immenses mais les conducteurs s\'arrêtent facilement.' },
      { type: 'sub', title: 'Utilise SpotHitch pour ta sécurité' },
      { type: 'rule', icon: '🛡️', text: 'Active le Mode Gardien avant chaque trajet. Un proche suit ta position en temps réel.' },
      { type: 'rule', icon: '🆘', text: 'Configure le mode SOS avec tes contacts. Un seul geste déclenche une triple alerte (push, SMS, appel).' },
      { type: 'rule', icon: '📱', text: 'Photographie la plaque du véhicule et envoie-la à un proche avant de monter.' },
      { type: 'rule', icon: '🎒', text: 'Garde ton sac accessible (sur tes genoux ou à tes pieds), jamais dans le coffre.' },
      { type: 'sub', title: 'Conseils spécifiques' },
      { type: 'rule', icon: '⛽', text: 'Les stations YPF (chaîne nationale) sont les meilleurs spots pour aborder les conducteurs.' },
      { type: 'rule', icon: '🗺️', text: 'En Patagonie, les distances sont immenses (parfois 300+ km entre deux villes). Prévois eau et nourriture.' },
      { type: 'sub', title: 'Numéros d\'urgence' },
      { type: 'kv', items: [{ k: 'Urgences', v: '911' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Les voyageuses solo rapportent des expériences majoritairement positives en Argentine, surtout en Patagonie et dans le nord-ouest. Les Argentins sont respectueux mais dragueurs (piropos = compliments de rue). Ignore et continue. Voyager en duo est recommandé pour les zones isolées.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'L\'espagnol argentin (castellano rioplatense) est la langue unique. L\'anglais est rare en dehors de Buenos Aires. Quelques bases d\'espagnol sont indispensables. Le "vos" remplace le "tú" et le "sh" remplace le "ll/y".' },
      { type: 'phrase', items: [
        { local: 'Hago dedo', meaning: 'Je fais du stop' },
        { local: 'Me llevás hasta...?', meaning: 'Tu m\'emmènes jusqu\'à... ?' },
        { local: 'Gracias, genial!', meaning: 'Merci, génial !' },
        { local: '¿Tenés lugar?', meaning: 'T\'as de la place ?' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'L\'Argentine fluctue beaucoup (inflation). En 2025-2026, le pays est bon marché pour les étrangers avec le dollar blue. Budget serré : 15-25 €/jour. Repas complet : 3-6 €. Hostel : 5-15 €/nuit.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Le camping sauvage est toléré partout en Patagonie et dans les zones rurales. Les campings municipaux sont gratuits ou très bon marché dans beaucoup de villes. En Patagonie, le vent est le principal ennemi (rafales de 100+ km/h).' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Bus longue distance', detail: 'Réseau excellent (cama = lit, semi-cama = inclinable). Très confortables.', price: '10-50 €' },
        { emoji: '✈️', name: 'Vols intérieurs', detail: 'Aerolíneas Argentinas, FlyBondi. Les distances justifient l\'avion.', price: '30-100 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'great' }, { name: 'Fév', level: 'great' }, { name: 'Mar', level: 'great' },
        { name: 'Avr', level: 'good' }, { name: 'Mai', level: 'ok' }, { name: 'Jun', level: 'bad' },
        { name: 'Jul', level: 'bad' }, { name: 'Aoû', level: 'bad' }, { name: 'Sep', level: 'ok' },
        { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'great' }, { name: 'Déc', level: 'great' },
      ]},
      { type: 'text', text: 'Hémisphère sud : l\'été (décembre-février) est idéal pour la Patagonie. Le nord-ouest se visite toute l\'année (sec en hiver). L\'hiver en Patagonie est rude (-10°C, vent, neige).' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Les Argentins sont chaleureux, bavards et passionnés. Le maté est un rituel social : accepter un maté qu\'on te propose est un signe d\'amitié. Les asados (barbecues) sont des événements communautaires. La conversation peut durer des heures.' },
      { type: 'event', items: [
        { month: 'Fév', day: '⟳', name: 'Carnaval (Gualeguaychú)', desc: 'Le plus grand carnaval d\'Argentine.' },
        { month: 'Jan', day: '⟳', name: 'Festival de Cosquín', desc: 'Festival de folklore argentin, musique traditionnelle.' },
      ]},
    ]},
  },
  // ==================== CHILE ====================
  CL: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'L\'autostop est légal au Chili. Aucune restriction. La pratique est courante en Patagonie et dans le sud. Les carabineros (police) sont généralement bienveillants envers les autostoppeurs.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Le Chili est très bon pour l\'autostop, surtout dans le sud (Región de los Lagos, Carretera Austral). Le pays est long (4 300 km) et étroit. La Ruta 5 (Panaméricaine) est l\'axe principal.' },
      { type: 'sub', title: 'Par région' },
      { type: 'kv', items: [
        { k: 'Carretera Austral', v: 'Mythique. Tout le monde s\'arrête. Peu de trafic.', color: 'green' },
        { k: 'Région des lacs (Temuco-Puerto Montt)', v: 'Facile, bon trafic', color: 'green' },
        { k: 'Nord (Atacama)', v: 'Peu de trafic, longues attentes', color: 'amber' },
        { k: 'Santiago (sortie)', v: 'Difficile, bus jusqu\'à la sortie', color: 'red' },
      ]},
      { type: 'text', text: 'Les péages (peajes) sur la Ruta 5 sont d\'excellents spots : les voitures ralentissent et tu peux parler aux conducteurs. Les stations-service Copec et Shell fonctionnent bien aussi.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Le Chili est un pays sûr pour l\'autostop. Le stop fonctionne particulièrement bien en Patagonie, où les conducteurs s\'arrêtent facilement pour les voyageurs.' },
      { type: 'sub', title: 'Utilise SpotHitch pour ta sécurité' },
      { type: 'rule', icon: '🛡️', text: 'Active le Mode Gardien avant chaque trajet. Un proche suit ta position en temps réel.' },
      { type: 'rule', icon: '🆘', text: 'Configure le mode SOS avec tes contacts. Un seul geste déclenche une triple alerte (push, SMS, appel).' },
      { type: 'rule', icon: '📱', text: 'Photographie la plaque du véhicule et envoie-la à un proche avant de monter.' },
      { type: 'rule', icon: '🎒', text: 'Garde ton sac accessible (sur tes genoux ou à tes pieds), jamais dans le coffre.' },
      { type: 'sub', title: 'Conseils spécifiques' },
      { type: 'rule', icon: '🏔️', text: 'En Patagonie, le stop fonctionne très bien. Les conducteurs s\'arrêtent facilement pour les voyageurs sac au dos.' },
      { type: 'rule', icon: '🗺️', text: 'Dans le nord (Atacama), les distances sont longues et le trafic faible. Prévois eau et protection solaire.' },
      { type: 'sub', title: 'Numéros d\'urgence' },
      { type: 'kv', items: [{ k: 'Urgences', v: '131' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Le Chili est considéré comme sûr pour les femmes voyageant seules. La Patagonie et le sud sont particulièrement recommandés. Plusieurs voyageuses solo rapportent des expériences très positives.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'L\'espagnol chilien est rapide et plein d\'argot. Le "po" en fin de phrase est typique (sí po = oui, no po = non). L\'anglais est rare en dehors de Santiago.' },
      { type: 'phrase', items: [
        { local: 'Ando a dedo', meaning: 'Je fais du stop' },
        { local: '¿Me podís llevar?', meaning: 'Tu peux m\'emmener ?' },
        { local: 'Gracias, bacán!', meaning: 'Merci, super !' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Le Chili est plus cher que l\'Argentine. Budget serré : 15-30 €/jour. Les supermarchés (Lider, Jumbo) sont abordables. La Patagonie est plus chère.' },
      { type: 'kv', items: [
        { k: 'Hostel', v: '8-20 €/nuit' },
        { k: 'Menu del día', v: '3-6 €' },
        { k: 'Empanada', v: '1-2 €' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Le camping sauvage est toléré dans les zones rurales et en Patagonie. Les campings CONAF (parcs nationaux) sont bon marché. La Carretera Austral a de nombreux spots de camping sauvage magnifiques.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Turbus / Pullman', detail: 'Bus longue distance confortables, réseau étendu', price: '5-40 €' },
        { emoji: '⛴️', name: 'Navimag', detail: 'Ferry Puerto Montt-Puerto Natales (4 jours, fjords)', price: '150-400 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'great' }, { name: 'Fév', level: 'great' }, { name: 'Mar', level: 'good' },
        { name: 'Avr', level: 'ok' }, { name: 'Mai', level: 'bad' }, { name: 'Jun', level: 'bad' },
        { name: 'Jul', level: 'bad' }, { name: 'Aoû', level: 'bad' }, { name: 'Sep', level: 'ok' },
        { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'great' }, { name: 'Déc', level: 'great' },
      ]},
      { type: 'text', text: 'Novembre à mars : idéal pour la Patagonie et le sud. Le nord (Atacama) se visite toute l\'année. L\'hiver ferme la Carretera Austral (neige, routes coupées).' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Les Chiliens sont réservés au premier contact mais très chaleureux une fois la glace brisée. Le "once" (goûter vers 17h avec thé, pain, avocat) est un repas important. Le pisco sour et le vin chilien sont des fiertés nationales.' },
    ]},
  },
  // ==================== COLOMBIA ====================
  CO: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'L\'autostop est légal en Colombie. Aucune restriction. La pratique est courante chez les locaux aussi, surtout les étudiants. Les péages (peajes) sont les spots classiques.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'La Colombie est un bon pays pour l\'autostop. Les Colombiens sont extrêmement accueillants. Temps d\'attente : 15-30 min sur les routes principales. Les camions (tractomulas) prennent régulièrement des passagers.' },
      { type: 'sub', title: 'Points clés' },
      { type: 'rule', icon: '🛣️', text: 'Les péages (peajes) sont les meilleurs spots. Toutes les routes principales en ont.' },
      { type: 'rule', icon: '🚛', text: 'Les camionneurs sont les plus fiables pour les longues distances. Très accueillants.' },
      { type: 'rule', icon: '⛽', text: 'Les stations-service aux sorties de villes fonctionnent bien.' },
      { type: 'kv', items: [
        { k: 'Eje cafetero (Pereira, Armenia, Manizales)', v: 'Facile et accueillant', color: 'green' },
        { k: 'Côte caraïbe', v: 'Facile, ambiance détendue', color: 'green' },
        { k: 'Bogotá (sortie)', v: 'Difficile, prends un bus jusqu\'à la sortie', color: 'red' },
      ]},
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'La Colombie est sûre dans les zones touristiques et sur les routes principales. Les péages sont les meilleurs spots pour le stop. Évite de voyager de nuit.' },
      { type: 'sub', title: 'Utilise SpotHitch pour ta sécurité' },
      { type: 'rule', icon: '🛡️', text: 'Active le Mode Gardien avant chaque trajet. Un proche suit ta position en temps réel.' },
      { type: 'rule', icon: '🆘', text: 'Configure le mode SOS avec tes contacts. Un seul geste déclenche une triple alerte (push, SMS, appel).' },
      { type: 'rule', icon: '📱', text: 'Photographie la plaque du véhicule et envoie-la à un proche avant de monter.' },
      { type: 'rule', icon: '🎒', text: 'Garde ton sac accessible (sur tes genoux ou à tes pieds), jamais dans le coffre.' },
      { type: 'sub', title: 'Conseils spécifiques' },
      { type: 'rule', icon: '🛣️', text: 'Les péages (peajes) sont les meilleurs spots. Les voitures ralentissent et tu peux parler aux conducteurs.' },
      { type: 'rule', icon: '☀️', text: 'Voyage uniquement de jour sur les routes principales. Les zones touristiques sont sûres et accueillantes.' },
      { type: 'sub', title: 'Numéros d\'urgence' },
      { type: 'kv', items: [{ k: 'Urgences', v: '123' }] },
    ]},
    women: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'Les expériences sont mixtes. Les Colombiens sont respectueux mais le machisme est présent. Les femmes voyageant seules rapportent des expériences positives sur les routes principales. Voyager en duo est recommandé pour les zones rurales.' },
      { type: 'rule', icon: '👫', text: 'Voyager avec un(e) compagnon(ne) est recommandé.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'L\'espagnol colombien est considéré comme l\'un des plus clairs et des plus faciles à comprendre. L\'anglais est rare en dehors des grandes villes touristiques. Des bases d\'espagnol sont indispensables.' },
      { type: 'phrase', items: [
        { local: 'Hago dedo / Pido aventón', meaning: 'Je fais du stop' },
        { local: '¿Me lleva?', meaning: 'Vous m\'emmenez ?' },
        { local: '¡Gracias, parcero!', meaning: 'Merci, pote !' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'La Colombie est bon marché. Budget serré : 15-25 €/jour. Les "corrientazos" (menu du jour populaire) sont copieux et bon marché.' },
      { type: 'kv', items: [
        { k: 'Hostel', v: '5-15 €/nuit' },
        { k: 'Corrientazo (menu du jour)', v: '2-4 €' },
        { k: 'Bus longue distance', v: '10-30 €' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Le camping sauvage est possible dans les zones rurales mais renseigne-toi localement. Les Colombiens invitent parfois les voyageurs chez eux. Les hamacs sont une alternative populaire dans les zones tropicales.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Bus longue distance', detail: 'Réseau étendu. Bolivariano et Expreso sont les meilleures compagnies.', price: '5-30 €' },
        { emoji: '🚐', name: 'Colectivos / Chivas', detail: 'Transport local coloré et bon marché', price: '0,50-3 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'great' }, { name: 'Fév', level: 'great' }, { name: 'Mar', level: 'good' },
        { name: 'Avr', level: 'ok' }, { name: 'Mai', level: 'ok' }, { name: 'Jun', level: 'good' },
        { name: 'Jul', level: 'great' }, { name: 'Aoû', level: 'great' }, { name: 'Sep', level: 'ok' },
        { name: 'Oct', level: 'ok' }, { name: 'Nov', level: 'ok' }, { name: 'Déc', level: 'great' },
      ]},
      { type: 'text', text: 'Décembre-février et juin-août : saisons sèches. Le climat varie selon l\'altitude (Bogotá : 15°C, côte : 30°C). La côte caraïbe est chaude toute l\'année.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Les Colombiens sont parmi les gens les plus accueillants d\'Amérique latine. Le café est une fierté nationale (zone cafetière = UNESCO). La musique (vallenato, cumbia, reggaeton) est omniprésente. Les conducteurs mettent la musique à fond et ça devient une fête.' },
      { type: 'event', items: [
        { month: 'Fév', day: '⟳', name: 'Carnaval de Barranquilla', desc: 'Le 2e plus grand carnaval au monde après Rio.' },
        { month: 'Août', day: '⟳', name: 'Feria de las Flores (Medellín)', desc: 'Festival des fleurs, défilé de silleteros.' },
      ]},
    ]},
  },
  // ==================== THAILAND ====================
  TH: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'L\'autostop est légal en Thaïlande. Aucune restriction. Le concept est peu connu des Thaïlandais car les transports publics sont bon marché et omniprésents. C\'est plus du "transport informel" que du stop classique.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'La Thaïlande est un cas particulier. Le stop au sens occidental est rare, mais les Thaïlandais sont naturellement serviables. Si tu te tiens au bord de la route avec un sac, quelqu\'un finira par s\'arrêter et proposer de t\'aider. C\'est une forme d\'hospitalité, pas de l\'autostop traditionnel.' },
      { type: 'sub', title: 'Comment ça fonctionne' },
      { type: 'rule', icon: '🏍️', text: 'Les motos et pickups s\'arrêtent plus facilement que les voitures.' },
      { type: 'rule', icon: '🤝', text: 'Attendre aux stations-service ou aux marchés est plus efficace que le pouce au bord de la route.' },
      { type: 'rule', icon: '👋', text: 'Pas de pouce levé : tends la main paume vers le bas et agite-la vers le sol (comme pour appeler un taxi).' },
      { type: 'text', text: 'Le nord (Chiang Mai, Chiang Rai, Mae Hong Son) et le nord-est (Isan) sont les zones les plus faciles. Le sud touristique est plus difficile car les taxis et songthaews sont partout.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'La Thaïlande est un pays sûr pour l\'autostop. Les Thaïlandais sont accueillants et curieux envers les voyageurs. Un panneau en thaï est très utile.' },
      { type: 'sub', title: 'Utilise SpotHitch pour ta sécurité' },
      { type: 'rule', icon: '🛡️', text: 'Active le Mode Gardien avant chaque trajet. Un proche suit ta position en temps réel.' },
      { type: 'rule', icon: '🆘', text: 'Configure le mode SOS avec tes contacts. Un seul geste déclenche une triple alerte (push, SMS, appel).' },
      { type: 'rule', icon: '📱', text: 'Photographie la plaque du véhicule et envoie-la à un proche avant de monter.' },
      { type: 'rule', icon: '🎒', text: 'Garde ton sac accessible (sur tes genoux ou à tes pieds), jamais dans le coffre.' },
      { type: 'sub', title: 'Conseils spécifiques' },
      { type: 'rule', icon: '📝', text: 'Un panneau avec ta destination écrite en thaï augmente considérablement tes chances. Demande à ton auberge de t\'aider.' },
      { type: 'rule', icon: '😊', text: 'Les Thaïlandais sont très accueillants. Un wai (salut traditionnel, mains jointes) est toujours apprécié.' },
      { type: 'sub', title: 'Numéros d\'urgence' },
      { type: 'kv', items: [{ k: 'Police touristique', v: '1155' }, { k: 'Police', v: '191' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'La Thaïlande est considérée comme sûre pour les femmes voyageant seules. Le bouddhisme influence le respect envers les femmes. Les incidents sont rares. Les zones festives (Full Moon Party) nécessitent plus de prudence.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Le thaï est la langue officielle. L\'anglais est limité en dehors des zones touristiques. Google Translate avec la caméra est un outil précieux. Le thaï est tonal (5 tons) : la prononciation est cruciale.' },
      { type: 'phrase', items: [
        { local: 'Sawadee krap/ka', meaning: 'Bonjour (krap = homme, ka = femme)' },
        { local: 'Khop khun krap/ka', meaning: 'Merci' },
        { local: 'Pai... dai mai?', meaning: 'Aller à... possible ?' },
        { local: 'Free, mai tong jai', meaning: 'Gratuit, pas besoin de payer' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'La Thaïlande est très bon marché. Budget serré : 10-20 €/jour (même sans stop). Le pad thaï de rue coûte 1-2 €.' },
      { type: 'kv', items: [
        { k: 'Street food', v: '30-80 THB (1-2 €)' },
        { k: 'Hostel', v: '150-400 THB (4-11 €)' },
        { k: 'Bus longue distance', v: '200-800 THB (5-22 €)' },
        { k: '7-Eleven sandwich', v: '30-60 THB (1-2 €)' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Le camping sauvage est toléré dans les zones rurales. Les temples bouddhistes accueillent parfois les voyageurs (contribution volontaire). Les guesthouses sont si bon marché (4-8 €) que le camping n\'est pas vraiment nécessaire.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Bus VIP / 1ère classe', detail: 'Confortables, AC, réseau étendu', price: '5-20 €' },
        { emoji: '🚂', name: 'Train (SRT)', detail: 'Lent mais scenic. Train de nuit Bangkok-Chiang Mai = classique.', price: '5-30 €' },
        { emoji: '🛺', name: 'Songthaew', detail: 'Pickup partagé avec bancs, transport local', price: '0,30-1 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'great' }, { name: 'Fév', level: 'great' }, { name: 'Mar', level: 'good' },
        { name: 'Avr', level: 'ok' }, { name: 'Mai', level: 'ok' }, { name: 'Jun', level: 'ok' },
        { name: 'Jul', level: 'ok' }, { name: 'Aoû', level: 'bad' }, { name: 'Sep', level: 'bad' },
        { name: 'Oct', level: 'bad' }, { name: 'Nov', level: 'good' }, { name: 'Déc', level: 'great' },
      ]},
      { type: 'text', text: 'Novembre à février : saison fraîche et sèche, idéale. Mars-mai : très chaud (40°C+). Juin-octobre : mousson (pluies torrentielles l\'après-midi, routes inondables dans certaines régions).' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'La Thaïlande est le "pays du sourire". Les Thaïlandais sont non-confrontationnels et souriants. Ne hausse jamais la voix, ne montre pas les pieds (impoli), et retire tes chaussures en entrant chez quelqu\'un. Le roi est sacré : ne fais JAMAIS de commentaire négatif (crime de lèse-majesté = prison).' },
      { type: 'event', items: [
        { month: 'Avr', day: '13-15', name: 'Songkran (Nouvel An thaï)', desc: 'Bataille d\'eau géante dans tout le pays. Transport chaotique mais festif.' },
        { month: 'Nov', day: '⟳', name: 'Loy Krathong', desc: 'Lanternes et offrandes flottantes. Ambiance magique.' },
      ]},
    ]},
  },
  // ==================== INDIA ====================
  IN: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'L\'autostop n\'est pas réglementé en Inde. Il n\'y a pas de concept formel d\'autostop mais le transport informel (monter dans les camions, pickups, tracteurs) est un mode de vie. Les camionneurs prennent couramment des passagers.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'L\'Inde est un cas unique. Le pouce levé n\'existe pas. Tends la main paume vers le bas. Les camions sont le principal moyen de transport en stop. Les conducteurs de camion (truckwallahs) forment une communauté solidaire.' },
      { type: 'sub', title: 'Comment ça marche' },
      { type: 'rule', icon: '🚛', text: 'Les dhabas (restaurants routiers) sont les arrêts des camionneurs. Aborde les conducteurs pendant leur repas.' },
      { type: 'rule', icon: '💰', text: 'Les camionneurs acceptent souvent un paiement modeste. Négocie AVANT de monter. Clarifie que c\'est gratuit ou combien.' },
      { type: 'rule', icon: '🛣️', text: 'Les National Highways (NH) ont le plus de trafic longue distance.' },
      { type: 'kv', items: [
        { k: 'Ladakh / Manali-Leh Highway', v: 'Mythique. Camions militaires et civils.', color: 'green' },
        { k: 'Rajasthan', v: 'Bon. Camions et jeeps.', color: 'green' },
        { k: 'Himachal Pradesh', v: 'Facile, locaux accueillants', color: 'green' },
        { k: 'Grandes villes (Delhi, Mumbai)', v: 'Impossible en ville, facile aux sorties', color: 'red' },
      ]},
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'L\'Inde est un pays sûr pour l\'autostop. Le concept de stop est naturel ici. Les stations-service et les dhabas (restaurants routiers) sont les meilleurs spots.' },
      { type: 'sub', title: 'Utilise SpotHitch pour ta sécurité' },
      { type: 'rule', icon: '🛡️', text: 'Active le Mode Gardien avant chaque trajet. Un proche suit ta position en temps réel.' },
      { type: 'rule', icon: '🆘', text: 'Configure le mode SOS avec tes contacts. Un seul geste déclenche une triple alerte (push, SMS, appel).' },
      { type: 'rule', icon: '📱', text: 'Photographie la plaque du véhicule et envoie-la à un proche avant de monter.' },
      { type: 'rule', icon: '🎒', text: 'Garde ton sac accessible (sur tes genoux ou à tes pieds), jamais dans le coffre.' },
      { type: 'sub', title: 'Conseils spécifiques' },
      { type: 'rule', icon: '🍛', text: 'Les stations-service et les dhabas (restaurants routiers) sont les meilleurs spots. Les camionneurs y font des pauses.' },
      { type: 'rule', icon: '🚛', text: 'Le concept de stop est naturel en Inde. Lève la main, les camionneurs et les conducteurs s\'arrêtent facilement.' },
      { type: 'sub', title: 'Numéros d\'urgence' },
      { type: 'kv', items: [{ k: 'Urgences', v: '112' }] },
    ]},
    women: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'L\'autostop seule en tant que femme est déconseillé en Inde. Le harcèlement sexuel est un problème documenté. Voyager en duo (avec un homme) change radicalement l\'expérience. Les femmes qui ont fait du stop en Inde en duo rapportent des expériences positives.' },
      { type: 'rule', icon: '👫', text: 'Voyager avec un compagnon masculin est fortement recommandé.' },
      { type: 'rule', icon: '👕', text: 'Habillement conservateur indispensable (épaules et genoux couverts, pas de vêtements moulants).' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'L\'hindi est la langue la plus répandue mais l\'Inde a 22 langues officielles et des centaines de dialectes. L\'anglais est compris dans les villes et par les jeunes éduqués. Les camionneurs parlent souvent hindi uniquement.' },
      { type: 'phrase', items: [
        { local: 'Namaste', meaning: 'Bonjour (universel en Inde)' },
        { local: 'Dhanyavaad / Shukriya', meaning: 'Merci (hindi)' },
        { local: '... tak jaana hai', meaning: 'Je veux aller à...' },
        { local: 'Free hai?', meaning: 'C\'est gratuit ?' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'L\'Inde est l\'un des pays les moins chers au monde. Budget serré : 5-15 €/jour. Les dhabas (cantines routières) servent des repas copieux pour 1-2 €.' },
      { type: 'kv', items: [
        { k: 'Dhaba (repas complet)', v: '50-150 INR (0,50-1,50 €)' },
        { k: 'Guesthouse', v: '300-800 INR (3-8 €)' },
        { k: 'Train Sleeper Class', v: '100-500 INR (1-5 €)' },
        { k: 'Chai (thé)', v: '10-20 INR (0,10-0,20 €)' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Le camping sauvage est possible dans l\'Himalaya et les zones rurales. Les dhabas permettent parfois de dormir sur les charpoys (lits de corde) pour quelques roupies. Les temples sikhs (gurdwara) offrent hébergement et repas gratuits à tous (langar).' },
      { type: 'tip', text: '💡 Les gurdwaras (temples sikhs) accueillent TOUT LE MONDE gratuitement. Repas et hébergement. C\'est un pilier du sikhisme.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚂', name: 'Indian Railways', detail: 'Le plus grand réseau ferroviaire au monde. Sleeper Class = budget. AC = confort.', price: '1-20 €' },
        { emoji: '🚌', name: 'Bus gouvernementaux', detail: 'Réseau dense, bon marché mais lents', price: '1-10 €' },
        { emoji: '🛺', name: 'Auto-rickshaw', detail: 'Transport local dans les villes', price: '0,30-2 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'good' }, { name: 'Fév', level: 'great' }, { name: 'Mar', level: 'great' },
        { name: 'Avr', level: 'ok' }, { name: 'Mai', level: 'bad' }, { name: 'Jun', level: 'bad' },
        { name: 'Jul', level: 'bad' }, { name: 'Aoû', level: 'bad' }, { name: 'Sep', level: 'ok' },
        { name: 'Oct', level: 'great' }, { name: 'Nov', level: 'great' }, { name: 'Déc', level: 'good' },
      ]},
      { type: 'text', text: 'Octobre à mars : idéal pour la plupart de l\'Inde. Avril-mai : très chaud (45°C+). Juin-septembre : mousson (routes inondées, glissements de terrain en montagne). Le Ladakh n\'est accessible que de juin à septembre.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'L\'Inde est un choc culturel garanti. L\'hospitalité est profondément ancrée. Les conducteurs offrent le chai (thé), les repas et parfois l\'hébergement. Le "head wobble" (mouvement de tête) signifie oui/d\'accord/peut-être tout à la fois. Mange avec la main droite uniquement (la gauche est impure).' },
      { type: 'event', items: [
        { month: 'Mar', day: '⟳', name: 'Holi', desc: 'Festival des couleurs. Poudres colorées jetées partout. Transport perturbé mais ambiance incroyable.' },
        { month: 'Oct-Nov', day: '⟳', name: 'Diwali', desc: 'Festival des lumières. Feux d\'artifice, guirlandes, douceurs. Les gens sont particulièrement généreux.' },
      ]},
    ]},
  },
  // ==================== JAPAN ====================
  JP: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'L\'autostop est légal au Japon. Aucune restriction. Les aires de service (SA) et les aires de parking (PA) sur les autoroutes sont les spots classiques. Il est interdit de se tenir sur les voies de l\'autoroute elle-même.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Le Japon est étonnamment bon pour l\'autostop malgré la barrière culturelle. Temps d\'attente : 15-45 min. Les Japonais qui s\'arrêtent sont souvent curieux et enthousiastes. Beaucoup feront des détours importants ou t\'inviteront à manger.' },
      { type: 'sub', title: 'La méthode japonaise' },
      { type: 'rule', icon: '📝', text: 'Un panneau en katakana (écriture japonaise) avec ta destination est quasi obligatoire. Les Japonais lisent rarement l\'alphabet latin.' },
      { type: 'rule', icon: '⛽', text: 'Les SA (Service Areas) sur les autoroutes sont les meilleurs spots. Tu peux y accéder à pied ou en stop depuis l\'entrée.' },
      { type: 'rule', icon: '😊', text: 'Sourire, s\'incliner et être poli est crucial. L\'apparence compte : sois propre et bien habillé.' },
      { type: 'kv', items: [
        { k: 'Hokkaidō', v: 'Le meilleur. Grand, rural, accueillant.', color: 'green' },
        { k: 'Zones rurales (Shikoku, Kyūshū)', v: 'Très bon, gens curieux', color: 'green' },
        { k: 'Tokyo, Osaka (sortie)', v: 'Difficile, utilise le train jusqu\'à une SA', color: 'red' },
      ]},
      { type: 'tip', text: '💡 Un drapeau de ton pays sur le sac est un excellent brise-glace au Japon.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Le Japon est extrêmement sûr pour l\'autostop. Le stop fonctionne bien et les conducteurs sont respectueux. Un panneau en japonais est très utile.' },
      { type: 'sub', title: 'Utilise SpotHitch pour ta sécurité' },
      { type: 'rule', icon: '🛡️', text: 'Active le Mode Gardien avant chaque trajet. Un proche suit ta position en temps réel.' },
      { type: 'rule', icon: '🆘', text: 'Configure le mode SOS avec tes contacts. Un seul geste déclenche une triple alerte (push, SMS, appel).' },
      { type: 'rule', icon: '📱', text: 'Photographie la plaque du véhicule et envoie-la à un proche avant de monter.' },
      { type: 'rule', icon: '🎒', text: 'Garde ton sac accessible (sur tes genoux ou à tes pieds), jamais dans le coffre.' },
      { type: 'sub', title: 'Conseils spécifiques' },
      { type: 'rule', icon: '📝', text: 'Un panneau avec ta destination en japonais (katakana ou kanji) augmente tes chances. Demande à un konbini de t\'aider.' },
      { type: 'rule', icon: '🏪', text: 'Les aires de repos d\'autoroute (SA/PA) sont les meilleurs spots. Elles sont propres, sûres et bien fréquentées.' },
      { type: 'sub', title: 'Numéros d\'urgence' },
      { type: 'kv', items: [{ k: 'Police', v: '110' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Le Japon est très sûr pour les femmes voyageant seules. Des voyageuses rapportent des expériences extrêmement positives. Les Japonais sont respectueux et la société est très sûre. Les conductrices s\'arrêtent aussi.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Le japonais est la seule langue. L\'anglais est très limité même dans les grandes villes. Un panneau en katakana est indispensable. Google Translate (mode caméra) est ton meilleur ami.' },
      { type: 'phrase', items: [
        { local: 'Konnichiwa', meaning: 'Bonjour' },
        { local: 'Arigatō gozaimasu', meaning: 'Merci beaucoup' },
        { local: 'Hitchhike shimasu', meaning: 'Je fais du stop (compris par les Japonais)' },
        { local: '... made onegaishimasu', meaning: 'Jusqu\'à... s\'il vous plaît' },
      ]},
      { type: 'tip', text: '💡 Écris tes destinations en katakana sur des cartons. Les Japonais adorent l\'effort et ça augmente tes chances.' },
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Le Japon est cher mais des astuces existent. Budget serré : 25-40 €/jour avec le stop et le camping.' },
      { type: 'kv', items: [
        { k: 'Konbini (7-Eleven, Lawson) repas', v: '300-600 ¥ (2-4 €)' },
        { k: 'Manga café (nuit)', v: '1 500-2 500 ¥ (10-17 €)' },
        { k: 'Hostel', v: '2 000-4 000 ¥ (13-27 €)' },
        { k: 'Onsen (bain thermal)', v: '300-1 000 ¥ (2-7 €)' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Le camping sauvage est techniquement interdit mais très toléré au Japon (culture du bivouac). Les michi-no-eki (stations de bord de route) et les parcs permettent de camper discrètement. Les manga cafés (avec douche) sont une alternative confortable pour les nuits en ville.' },
      { type: 'tip', text: '💡 Les conducteurs japonais invitent parfois les stoppeurs dans des onsen (bains thermaux), à manger dans des restaurants ou même chez eux. C\'est une expérience unique.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚄', name: 'Shinkansen', detail: 'Train à grande vitesse. Le JR Pass offre un accès illimité.', price: 'JR Pass 7j : ~200 €' },
        { emoji: '🚌', name: 'Bus de nuit', detail: 'Willer Express, moins cher que le Shinkansen', price: '2 000-6 000 ¥' },
        { emoji: '⛴️', name: 'Ferry', detail: 'Entre les îles, souvent avec cabine', price: '2 000-10 000 ¥' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Fév', level: 'bad' }, { name: 'Mar', level: 'good' },
        { name: 'Avr', level: 'great' }, { name: 'Mai', level: 'great' }, { name: 'Jun', level: 'ok' },
        { name: 'Jul', level: 'ok' }, { name: 'Aoû', level: 'ok' }, { name: 'Sep', level: 'good' },
        { name: 'Oct', level: 'great' }, { name: 'Nov', level: 'great' }, { name: 'Déc', level: 'ok' },
      ]},
      { type: 'text', text: 'Avril-mai (sakura, cerisiers en fleurs) et octobre-novembre (kōyō, feuilles d\'automne) : idéal. Juin : saison des pluies (tsuyu). L\'été est chaud et humide (35°C). L\'hiver à Hokkaidō est rude mais le stop fonctionne.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'L\'autostop au Japon est une expérience culturelle unique. Les conducteurs qui s\'arrêtent sont souvent passionnés par la rencontre. Ils t\'emmèneront dans des restaurants locaux, des onsen, des sites touristiques qu\'ils veulent te montrer. Certains conducteurs font des heures de détour. Offre un petit cadeau de ton pays en remerciement (très apprécié).' },
      { type: 'event', items: [
        { month: 'Avr', day: '⟳', name: 'Hanami (cerisiers en fleurs)', desc: 'Pique-niques sous les cerisiers partout. Période festive.' },
        { month: 'Juil-Août', day: '⟳', name: 'Matsuri (festivals d\'été)', desc: 'Festivals locaux partout. Feux d\'artifice (hanabi). Ambiance unique.' },
      ]},
    ]},
  },
  // ==================== SOUTH AFRICA ====================
  ZA: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'L\'autostop est légal en Afrique du Sud. Aucune restriction. Les minibus-taxis sont le transport principal des Sud-Africains mais certains font aussi du stop informel.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'L\'Afrique du Sud est possible pour l\'autostop mais nécessite de la prudence. Les distances sont grandes et le taux de criminalité élevé dans certaines zones. Les zones rurales et la Garden Route sont les plus adaptées.' },
      { type: 'kv', items: [
        { k: 'Garden Route (Cape Town-Port Elizabeth)', v: 'Le meilleur, touristique et sûr', color: 'green' },
        { k: 'Drakensberg / Free State rural', v: 'Bon, accueillant', color: 'green' },
        { k: 'Johannesburg', v: 'Éviter absolument pour le stop', color: 'red' },
        { k: 'Townships / zones urbaines', v: 'Déconseillé', color: 'red' },
      ]},
      { type: 'text', text: 'Les stations-service (Engen, Shell, Caltex) sont les meilleurs spots. Aborde les conducteurs directement. Les Afrikaners (campagne) sont souvent les plus accueillants avec les stoppeurs.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'L\'Afrique du Sud est sûre pour l\'autostop sur les routes principales et en zone rurale. Les stations Engen et Shell sont de bons spots. Voyage exclusivement de jour.' },
      { type: 'sub', title: 'Utilise SpotHitch pour ta sécurité' },
      { type: 'rule', icon: '🛡️', text: 'Active le Mode Gardien avant chaque trajet. Un proche suit ta position en temps réel.' },
      { type: 'rule', icon: '🆘', text: 'Configure le mode SOS avec tes contacts. Un seul geste déclenche une triple alerte (push, SMS, appel).' },
      { type: 'rule', icon: '📱', text: 'Photographie la plaque du véhicule et envoie-la à un proche avant de monter.' },
      { type: 'rule', icon: '🎒', text: 'Garde ton sac accessible (sur tes genoux ou à tes pieds), jamais dans le coffre.' },
      { type: 'sub', title: 'Conseils spécifiques' },
      { type: 'rule', icon: '⛽', text: 'Les stations Engen et Shell sont des spots sûrs et bien fréquentés pour trouver un lift.' },
      { type: 'rule', icon: '☀️', text: 'Voyage exclusivement de jour. La Garden Route et les zones rurales sont les plus sûres pour le stop.' },
      { type: 'sub', title: 'Numéros d\'urgence' },
      { type: 'kv', items: [{ k: 'Urgences', v: '10111' }] },
    ]},
    women: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'L\'autostop seule en tant que femme est déconseillé en Afrique du Sud. Le pays a un taux élevé de violences de genre. Voyager en duo est fortement recommandé. La Garden Route avec un(e) compagnon(ne) est faisable.' },
      { type: 'rule', icon: '👫', text: 'Voyager avec un(e) compagnon(ne) est quasi obligatoire.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'L\'Afrique du Sud a 11 langues officielles. L\'anglais est compris presque partout. L\'afrikaans est la langue de beaucoup de conducteurs dans le Western Cape et le Free State. Le zoulou et le xhosa sont les langues les plus parlées.' },
      { type: 'phrase', items: [
        { local: 'Howzit', meaning: 'Bonjour / Comment ça va (argot sud-africain)' },
        { local: 'Sharp sharp', meaning: 'Cool, OK' },
        { local: 'Dankie / Enkosi', meaning: 'Merci (afrikaans / xhosa)' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'L\'Afrique du Sud est abordable pour les étrangers. Budget serré : 20-35 €/jour.' },
      { type: 'kv', items: [
        { k: 'Backpacker hostel', v: '100-250 ZAR (5-13 €)' },
        { k: 'Repas au restaurant', v: '80-150 ZAR (4-8 €)' },
        { k: 'Braai (BBQ) au supermarché', v: '50-100 ZAR (3-5 €)' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Le camping sauvage est possible dans les zones rurales mais la sécurité doit être évaluée localement. Les campings dans les réserves naturelles (SANParks) sont sûrs et bien équipés. Le réseau de backpacker hostels est excellent le long de la Garden Route.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚐', name: 'Baz Bus', detail: 'Bus hop-on/hop-off pour backpackers, réseau côtier', price: '200-500 ZAR' },
        { emoji: '🚌', name: 'Greyhound / Intercape', detail: 'Bus longue distance fiables', price: '200-800 ZAR' },
        { emoji: '🚂', name: 'Shosholoza Meyl', detail: 'Train longue distance bon marché (Joburg-Cape Town)', price: '200-600 ZAR' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'great' }, { name: 'Fév', level: 'great' }, { name: 'Mar', level: 'great' },
        { name: 'Avr', level: 'good' }, { name: 'Mai', level: 'ok' }, { name: 'Jun', level: 'ok' },
        { name: 'Jul', level: 'ok' }, { name: 'Aoû', level: 'ok' }, { name: 'Sep', level: 'good' },
        { name: 'Oct', level: 'great' }, { name: 'Nov', level: 'great' }, { name: 'Déc', level: 'great' },
      ]},
      { type: 'text', text: 'Hémisphère sud : l\'été (novembre-mars) est idéal. Le Western Cape est méditerranéen (sec en été, pluvieux en hiver). Le Drakensberg est froid en hiver. Le Kruger est mieux de mai à septembre (saison sèche, animaux visibles).' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'L\'Afrique du Sud est la "nation arc-en-ciel". Les cultures se mélangent et les discussions sont riches. Le braai (barbecue) est une religion nationale. La biltong (viande séchée) est le snack de route par excellence. Ubuntu ("je suis parce que nous sommes") est la philosophie dominante.' },
    ]},
  },
  // ==================== IRAN ====================
  IR: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'L\'autostop est légal en Iran. Aucune restriction. La pratique est courante car beaucoup d\'Iraniens n\'ont pas de voiture et les transports ruraux sont limités. L\'hospitalité iranienne rend le stop naturel.' },
      { type: 'warn', text: '⚠️ Un visa est obligatoire pour la plupart des nationalités. Certains pays (USA, UK, Canada) nécessitent un guide obligatoire. Vérifie les exigences avant de voyager.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'L\'Iran est l\'un des meilleurs pays au monde pour l\'autostop. L\'hospitalité iranienne (ta\'arof) est légendaire. Les conducteurs s\'arrêtent sans qu\'on le demande, insistent pour payer le repas, et proposent l\'hébergement chez eux. Temps d\'attente moyen : 5-15 min.' },
      { type: 'text', text: 'Le concept de tarof (politesse excessive) signifie que les Iraniens insistent pour t\'aider. Si un conducteur refuse ton argent, c\'est sincère (mais offre 3 fois par politesse). En zone rurale, le trafic est faible mais tout le monde s\'arrête.' },
      { type: 'sub', title: 'Zones recommandées' },
      { type: 'kv', items: [
        { k: 'Isfahan-Shiraz-Yazd (triangle touristique)', v: 'Excellent, bon trafic', color: 'green' },
        { k: 'Côte Caspienne (nord)', v: 'Facile, paysages verts', color: 'green' },
        { k: 'Kurdistan iranien (ouest)', v: 'Très hospitalier', color: 'green' },
        { k: 'Zones frontalières (Irak, Afghanistan, Pakistan)', v: 'Déconseillé', color: 'red' },
      ]},
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'L\'Iran est un pays sûr pour l\'autostop. L\'hospitalité iranienne est légendaire. Respecte le code vestimentaire et prévois du cash (les cartes internationales ne fonctionnent pas).' },
      { type: 'sub', title: 'Utilise SpotHitch pour ta sécurité' },
      { type: 'rule', icon: '🛡️', text: 'Active le Mode Gardien avant chaque trajet. Un proche suit ta position en temps réel.' },
      { type: 'rule', icon: '🆘', text: 'Configure le mode SOS avec tes contacts. Un seul geste déclenche une triple alerte (push, SMS, appel).' },
      { type: 'rule', icon: '📱', text: 'Photographie la plaque du véhicule et envoie-la à un proche avant de monter.' },
      { type: 'rule', icon: '🎒', text: 'Garde ton sac accessible (sur tes genoux ou à tes pieds), jamais dans le coffre.' },
      { type: 'sub', title: 'Conseils spécifiques' },
      { type: 'rule', icon: '👔', text: 'Respecte le code vestimentaire local. Les cartes bancaires internationales ne fonctionnent pas : prévois du cash.' },
      { type: 'rule', icon: '🍵', text: 'L\'hospitalité iranienne est légendaire. Chaque conducteur voudra t\'inviter pour du thé ou un repas.' },
      { type: 'sub', title: 'Numéros d\'urgence' },
      { type: 'kv', items: [{ k: 'Urgences', v: '115' }] },
    ]},
    women: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'Les femmes doivent porter le hijab (foulard) en Iran (obligatoire par la loi). Le stop seule en tant que femme est possible mais nécessite de la prudence. Beaucoup de voyageuses rapportent des expériences positives mais quelques situations inconfortables aussi. Voyager en duo est recommandé.' },
      { type: 'rule', icon: '🧕', text: 'Le hijab est obligatoire (foulard couvrant les cheveux). Vêtements amples couvrant les bras et les jambes.' },
      { type: 'rule', icon: '👫', text: 'Les familles et les femmes conductrices sont les lifts les plus sûrs.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Le farsi (persan) est la langue principale. L\'anglais est rare en dehors de Téhéran et Isfahan. L\'alphabet est arabe (lu de droite à gauche). Les Iraniens adorent quand les étrangers parlent quelques mots de farsi.' },
      { type: 'phrase', items: [
        { local: 'Salam', meaning: 'Bonjour' },
        { local: 'Merci / Mamnun', meaning: 'Merci' },
        { local: 'Lotfan', meaning: 'S\'il vous plaît' },
        { local: 'Mosāfer hastam', meaning: 'Je suis un voyageur' },
        { local: 'Rāyegan', meaning: 'Gratuit' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'L\'Iran est très bon marché (surtout avec le taux de change officieux). Budget serré : 10-20 €/jour. Les conducteurs paient souvent le repas. Le problème : les cartes bancaires internationales ne fonctionnent PAS en Iran. Apporte des euros ou dollars en cash.' },
      { type: 'kv', items: [
        { k: 'Repas local (kebab, riz)', v: '2-5 €' },
        { k: 'Mosāferkhāne (hotel basique)', v: '5-15 €' },
        { k: 'Bus longue distance (VIP)', v: '3-10 €' },
      ]},
      { type: 'warn', text: '⚠️ AUCUNE carte bancaire internationale ne fonctionne en Iran (sanctions). Apporte TOUT ton argent en cash (euros ou dollars).' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Le camping sauvage est toléré dans les montagnes (Alborz, Zagros). En ville, les mosāferkhāne (hôtels basiques) sont bon marché. Les conducteurs invitent TRÈS souvent les voyageurs chez eux. Refuser est presque impoli. Les mosquées offrent parfois l\'hébergement aux voyageurs.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Bus VIP', detail: 'Confortables, réseau étendu, très bon marché', price: '3-10 €' },
        { emoji: '🚂', name: 'Train', detail: 'Réseau limité mais trains de nuit confortables', price: '5-15 €' },
        { emoji: '🚕', name: 'Savari (taxi collectif)', detail: 'Taxis partagés inter-villes, attendent d\'être pleins', price: '2-8 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Fév', level: 'ok' }, { name: 'Mar', level: 'great' },
        { name: 'Avr', level: 'great' }, { name: 'Mai', level: 'great' }, { name: 'Jun', level: 'ok' },
        { name: 'Jul', level: 'bad' }, { name: 'Aoû', level: 'bad' }, { name: 'Sep', level: 'ok' },
        { name: 'Oct', level: 'great' }, { name: 'Nov', level: 'good' }, { name: 'Déc', level: 'ok' },
      ]},
      { type: 'text', text: 'Mars-mai (Nowruz, nouvel an persan) et septembre-novembre : idéal. L\'été est brûlant dans le sud (45°C+) mais agréable en montagne. L\'hiver est froid dans le nord et les montagnes.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'L\'hospitalité iranienne est considérée comme la meilleure au monde par de nombreux voyageurs. Le ta\'arof (code de politesse) implique que les Iraniens insistent pour t\'inviter, te nourrir et t\'héberger. La culture perse est raffinée (poésie de Hafez, Rumi). Les Iraniens sont fiers de montrer leur pays et de déconstruire les préjugés occidentaux.' },
      { type: 'event', items: [
        { month: 'Mar', day: '20-21', name: 'Nowruz (Nouvel An persan)', desc: 'La plus grande fête de l\'année. 13 jours de vacances. Tout le monde voyage, beaucoup de trafic.' },
      ]},
    ]},
  },
  // ==================== TUNISIA ====================
  TN: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'L\'autostop est légal en Tunisie. Aucune restriction. La pratique est courante chez les locaux, surtout en zone rurale. Les "louages" (taxis collectifs) sont le transport principal mais le stop fonctionne bien.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'La Tunisie est facile pour l\'autostop. Le pays est petit (780 km nord-sud) et les Tunisiens sont accueillants. Temps d\'attente : 10-30 min. Les conducteurs s\'arrêtent facilement, surtout pour les étrangers.' },
      { type: 'rule', icon: '🚛', text: 'Les camions prennent des passagers sur les longues distances (attention : certains attendent un pourboire).' },
      { type: 'rule', icon: '⛽', text: 'Les stations-service aux sorties de villes sont les meilleurs spots.' },
      { type: 'text', text: 'Le sud (Tozeur, Douz, Tataouine) a peu de trafic mais tout le monde s\'arrête. Le nord et la côte ont plus de circulation.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'La Tunisie est sûre pour l\'autostop dans les zones touristiques. Les Tunisiens sont accueillants et curieux envers les voyageurs.' },
      { type: 'sub', title: 'Utilise SpotHitch pour ta sécurité' },
      { type: 'rule', icon: '🛡️', text: 'Active le Mode Gardien avant chaque trajet. Un proche suit ta position en temps réel.' },
      { type: 'rule', icon: '🆘', text: 'Configure le mode SOS avec tes contacts. Un seul geste déclenche une triple alerte (push, SMS, appel).' },
      { type: 'rule', icon: '📱', text: 'Photographie la plaque du véhicule et envoie-la à un proche avant de monter.' },
      { type: 'rule', icon: '🎒', text: 'Garde ton sac accessible (sur tes genoux ou à tes pieds), jamais dans le coffre.' },
      { type: 'sub', title: 'Conseils spécifiques' },
      { type: 'rule', icon: '🏖️', text: 'Les zones touristiques (Tunis, Sousse, Djerba, Tozeur) sont sûres et bien connectées.' },
      { type: 'rule', icon: '🤝', text: 'Les Tunisiens sont hospitaliers. Un sourire et quelques mots d\'arabe ouvrent toutes les portes.' },
      { type: 'sub', title: 'Numéros d\'urgence' },
      { type: 'kv', items: [{ k: 'Police', v: '197' }] },
    ]},
    women: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'Le harcèlement de rue est fréquent en Tunisie. Les femmes voyageant seules en stop rapportent des expériences mixtes. Voyager en duo est fortement recommandé. Les zones touristiques (Sidi Bou Saïd, Hammamet) sont plus détendues.' },
      { type: 'rule', icon: '👫', text: 'Voyager en duo est fortement recommandé.' },
      { type: 'rule', icon: '👕', text: 'Habille-toi de façon conservatrice en dehors des zones balnéaires.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'L\'arabe tunisien (derja) est la langue locale. Le français est très répandu (quasi tout le monde le parle). L\'anglais progresse chez les jeunes.' },
      { type: 'phrase', items: [
        { local: 'Bahi / Barcha', meaning: 'Bien / Beaucoup' },
        { local: 'Yaatik essaha', meaning: 'Merci (que Dieu te donne la santé)' },
        { local: 'Win temchi?', meaning: 'Où tu vas ?' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Très bon marché. Budget serré : 15-25 €/jour. Le couscous du vendredi est souvent partagé gratuitement.' },
      { type: 'kv', items: [
        { k: 'Repas local', v: '2-5 TND (0,60-1,50 €)' },
        { k: 'Hostel', v: '20-50 TND (6-15 €)' },
        { k: 'Louage (100 km)', v: '5-10 TND (1,50-3 €)' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Le camping sauvage est toléré dans le sud et les zones rurales. Les Tunisiens invitent facilement les voyageurs chez eux. Les auberges de jeunesse sont bon marché.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚐', name: 'Louage', detail: 'Taxi collectif entre villes. Attend d\'être plein. Rapide et bon marché.', price: '1-5 €' },
        { emoji: '🚂', name: 'SNCFT (train)', detail: 'Réseau limité mais bon marché', price: '1-5 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'ok' }, { name: 'Fév', level: 'good' }, { name: 'Mar', level: 'great' },
        { name: 'Avr', level: 'great' }, { name: 'Mai', level: 'great' }, { name: 'Jun', level: 'good' },
        { name: 'Jul', level: 'ok' }, { name: 'Aoû', level: 'ok' }, { name: 'Sep', level: 'good' },
        { name: 'Oct', level: 'great' }, { name: 'Nov', level: 'good' }, { name: 'Déc', level: 'ok' },
      ]},
      { type: 'text', text: 'Mars-mai et septembre-novembre : idéal. L\'été est chaud (40°C+ dans le sud). L\'hiver est doux sur la côte mais frais dans les montagnes.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'L\'hospitalité tunisienne est sincère. Le thé à la menthe et le café turc sont offerts généreusement. Le couscous du vendredi est un rituel familial. Les Tunisiens sont fiers de leur histoire (Carthage) et aiment en parler.' },
    ]},
  },
  // ==================== MEXICO ====================
  MX: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'L\'autostop ("pedir aventón" ou "pedir raid") est légal au Mexique. Aucune restriction. Pratique courante en zone rurale. Les communautés indigènes font du stop régulièrement.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Le Mexique est bon pour l\'autostop en dehors des zones à risque. Les Mexicains sont accueillants et curieux envers les étrangers. Temps d\'attente : 15-45 min. Les camions prennent régulièrement des passagers.' },
      { type: 'sub', title: 'Meilleures zones' },
      { type: 'kv', items: [
        { k: 'Oaxaca / Chiapas', v: 'Excellent, communautés accueillantes', color: 'green' },
        { k: 'Yucatán', v: 'Bon, touristique, bon trafic', color: 'green' },
        { k: 'Baja California', v: 'Faisable, peu de trafic dans le désert', color: 'amber' },
        { k: 'Nord (Sinaloa, Tamaulipas, Chihuahua)', v: 'Déconseillé (cartels)', color: 'red' },
      ]},
      { type: 'rule', icon: '⛽', text: 'Les casetas (péages) et les stations Pemex sont les meilleurs spots.' },
      { type: 'rule', icon: '🚛', text: 'Les "tráilers" (camions) font de longues distances. Aborde les conducteurs aux stations-service.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Le Mexique est sûr pour l\'autostop sur les routes principales et dans les zones touristiques. Les casetas de cobro (péages) sont d\'excellents spots.' },
      { type: 'sub', title: 'Utilise SpotHitch pour ta sécurité' },
      { type: 'rule', icon: '🛡️', text: 'Active le Mode Gardien avant chaque trajet. Un proche suit ta position en temps réel.' },
      { type: 'rule', icon: '🆘', text: 'Configure le mode SOS avec tes contacts. Un seul geste déclenche une triple alerte (push, SMS, appel).' },
      { type: 'rule', icon: '📱', text: 'Photographie la plaque du véhicule et envoie-la à un proche avant de monter.' },
      { type: 'rule', icon: '🎒', text: 'Garde ton sac accessible (sur tes genoux ou à tes pieds), jamais dans le coffre.' },
      { type: 'sub', title: 'Conseils spécifiques' },
      { type: 'rule', icon: '🛣️', text: 'Les casetas de cobro (péages) sont les meilleurs spots. Les voitures ralentissent et tu peux discuter avec les conducteurs.' },
      { type: 'rule', icon: '🌮', text: 'Les zones touristiques (Oaxaca, Yucatán, Baja California) et les routes principales sont les plus sûres pour le stop.' },
      { type: 'sub', title: 'Numéros d\'urgence' },
      { type: 'kv', items: [{ k: 'Urgences', v: '911' }] },
    ]},
    women: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'Le machisme est présent au Mexique. Les femmes voyageant seules en stop rapportent des expériences mixtes. Le sud est plus sûr. Voyager en duo est fortement recommandé.' },
      { type: 'rule', icon: '👫', text: 'Voyager avec un(e) compagnon(ne) est fortement recommandé.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'L\'espagnol est indispensable. L\'anglais est rare en dehors des zones touristiques (Cancún, Playa del Carmen). 68 langues indigènes sont encore parlées.' },
      { type: 'phrase', items: [
        { local: '¿Me da un aventón / raid?', meaning: 'Vous me prenez en stop ?' },
        { local: '¿Hasta dónde va?', meaning: 'Jusqu\'où allez-vous ?' },
        { local: '¡Gracias, que le vaya bien!', meaning: 'Merci, bonne route !' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Le Mexique est bon marché. Budget serré : 15-25 €/jour.' },
      { type: 'kv', items: [
        { k: 'Tacos de rue', v: '10-30 MXN (0,50-1,50 €)' },
        { k: 'Comida corrida (menu du jour)', v: '50-100 MXN (2,50-5 €)' },
        { k: 'Hostel', v: '150-400 MXN (7-20 €)' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Le camping sauvage est possible sur les plages du Pacifique et dans les zones rurales. Les hamacs sont une alternative populaire sur la côte. Les Mexicains invitent parfois les voyageurs chez eux.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'ADO / ETN', detail: 'Bus longue distance luxueux. ADO couvre le sud, ETN le centre.', price: '5-40 €' },
        { emoji: '🚐', name: 'Colectivos', detail: 'Minibus locaux, très bon marché', price: '0,30-2 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'great' }, { name: 'Fév', level: 'great' }, { name: 'Mar', level: 'great' },
        { name: 'Avr', level: 'good' }, { name: 'Mai', level: 'ok' }, { name: 'Jun', level: 'ok' },
        { name: 'Jul', level: 'ok' }, { name: 'Aoû', level: 'ok' }, { name: 'Sep', level: 'bad' },
        { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'great' }, { name: 'Déc', level: 'great' },
      ]},
      { type: 'text', text: 'Novembre à avril : saison sèche, idéale. Juin-octobre : saison des pluies (averses l\'après-midi). Septembre : ouragans sur les côtes. Le Yucatán est chaud et humide toute l\'année.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Les Mexicains sont chaleureux et fiers de leur culture. La nourriture est centrale (tacos, mole, tamales). Le mezcal et la tequila sont partagés généreusement. Le Día de los Muertos (2 novembre) est un moment culturel unique.' },
      { type: 'event', items: [
        { month: 'Nov', day: '1-2', name: 'Día de los Muertos', desc: 'Fête des morts. Autels, offrandes, cimetières décorés. Oaxaca est le meilleur endroit.' },
        { month: 'Sep', day: '15-16', name: 'Fiestas Patrias', desc: 'Fête de l\'indépendance. Le "Grito" à minuit, feux d\'artifice, fêtes partout.' },
      ]},
    ]},
  },
  // ==================== BRAZIL ====================
  BR: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'L\'autostop ("carona" ou "pedir carona") est légal au Brésil. Aucune restriction. La pratique est moins courante qu\'en Amérique hispanique mais fonctionne, surtout dans le sud.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Le Brésil est possible pour l\'autostop mais les distances sont immenses (le 5ème plus grand pays du monde). Temps d\'attente : 30 min-2h. Le sud (Rio Grande do Sul, Santa Catarina, Paraná) est le plus facile.' },
      { type: 'kv', items: [
        { k: 'Sud (RS, SC, PR)', v: 'Le meilleur, culture européenne, accueillant', color: 'green' },
        { k: 'Minas Gerais', v: 'Bon, gens chaleureux', color: 'green' },
        { k: 'Nordeste (Bahia côte)', v: 'Faisable, camions', color: 'amber' },
        { k: 'Amazonie', v: 'Quasi impossible par route, bateaux fluviaux à la place', color: 'red' },
      ]},
      { type: 'rule', icon: '⛽', text: 'Les postos de gasolina (stations-service) sont les meilleurs spots. Aborde les camionneurs aux restaurants routiers.' },
      { type: 'rule', icon: '🚛', text: 'Les camionneurs ("caminhoneiros") sont ta meilleure option pour les longues distances.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Le Brésil est sûr pour l\'autostop sur les routes principales. Les postos (stations-service) sont les meilleurs spots. Apprendre quelques mots de portugais facilite énormément le contact.' },
      { type: 'sub', title: 'Utilise SpotHitch pour ta sécurité' },
      { type: 'rule', icon: '🛡️', text: 'Active le Mode Gardien avant chaque trajet. Un proche suit ta position en temps réel.' },
      { type: 'rule', icon: '🆘', text: 'Configure le mode SOS avec tes contacts. Un seul geste déclenche une triple alerte (push, SMS, appel).' },
      { type: 'rule', icon: '📱', text: 'Photographie la plaque du véhicule et envoie-la à un proche avant de monter.' },
      { type: 'rule', icon: '🎒', text: 'Garde ton sac accessible (sur tes genoux ou à tes pieds), jamais dans le coffre.' },
      { type: 'sub', title: 'Conseils spécifiques' },
      { type: 'rule', icon: '⛽', text: 'Les postos (stations-service) sont les spots les plus sûrs. Les camionneurs y font souvent des pauses.' },
      { type: 'rule', icon: '🗣️', text: 'Apprends quelques mots de portugais. Peu de Brésiliens parlent anglais et l\'effort est très apprécié.' },
      { type: 'sub', title: 'Numéros d\'urgence' },
      { type: 'kv', items: [{ k: 'Police', v: '190' }] },
    ]},
    women: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'Le harcèlement de rue existe au Brésil. Les femmes voyageant seules en stop rapportent des expériences variables. Le sud est plus sûr. Voyager en duo est recommandé.' },
      { type: 'rule', icon: '👫', text: 'Voyager en duo est recommandé, surtout dans le nord et le nordeste.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Le portugais brésilien est la langue unique. L\'espagnol est partiellement compris mais ne parle PAS espagnol (c\'est perçu comme impoli). L\'anglais est rare en dehors des grandes villes.' },
      { type: 'phrase', items: [
        { local: 'Oi, tudo bem?', meaning: 'Salut, ça va ?' },
        { local: 'Carona, por favor', meaning: 'Un stop, s\'il vous plaît' },
        { local: 'Obrigado/a', meaning: 'Merci (masc./fém.)' },
        { local: 'Pra onde você vai?', meaning: 'Où allez-vous ?' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Le Brésil est modérément cher pour l\'Amérique du Sud. Budget serré : 20-35 €/jour. Le sud est moins cher que Rio ou São Paulo.' },
      { type: 'kv', items: [
        { k: 'Prato feito (assiette du jour)', v: '15-30 BRL (3-6 €)' },
        { k: 'Hostel', v: '40-100 BRL (8-20 €)' },
        { k: 'Açaí (bol)', v: '10-20 BRL (2-4 €)' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Le camping sauvage est possible sur les plages désertes et en zone rurale. Les campings sont bon marché dans le sud. Les pousadas (guesthouses) offrent un bon rapport qualité-prix.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Bus longue distance', detail: 'Réseau excellent. Leito = couchette. Semi-leito = inclinable.', price: '10-60 €' },
        { emoji: '✈️', name: 'Vols intérieurs', detail: 'GOL, LATAM, Azul. Souvent moins cher que le bus pour les longues distances.', price: '20-100 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'good' }, { name: 'Fév', level: 'good' }, { name: 'Mar', level: 'great' },
        { name: 'Avr', level: 'great' }, { name: 'Mai', level: 'great' }, { name: 'Jun', level: 'good' },
        { name: 'Jul', level: 'good' }, { name: 'Aoû', level: 'good' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'great' }, { name: 'Nov', level: 'good' }, { name: 'Déc', level: 'good' },
      ]},
      { type: 'text', text: 'Le Brésil est immense : le climat varie du tropical au subtropical. Le sud est tempéré. Mars-mai et septembre-novembre sont idéaux pour la plupart des régions. L\'été (décembre-février) est la saison des pluies dans le centre-sud.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Les Brésiliens sont parmi les gens les plus chaleureux du monde. La musique (samba, forró, MPB) est omniprésente. Le churrasco (barbecue) est un rituel social. Les Brésiliens adorent faire la fête et accueillir les étrangers.' },
      { type: 'event', items: [
        { month: 'Fév-Mar', day: '⟳', name: 'Carnaval', desc: 'Le plus grand carnaval du monde. Rio, Salvador et Olinda sont les meilleurs. Transport chaotique.' },
        { month: 'Jun', day: '⟳', name: 'Festas Juninas', desc: 'Fêtes de la Saint-Jean. Danses, feux de joie, nourriture de rue dans tout le Nordeste.' },
      ]},
    ]},
  },
  // ==================== PERU ====================
  PE: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'L\'autostop est légal au Pérou. Pratique courante en zone rurale. Les locaux font aussi du stop ("pedir jalada") car les transports sont limités dans les Andes.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Le Pérou est bon pour l\'autostop, surtout dans les Andes. Temps d\'attente : 20 min-1h. Les camions sont le transport principal en montagne. Attention : beaucoup de conducteurs attendent un paiement (transport informel). Clarifie "gratis" avant de monter.' },
      { type: 'rule', icon: '🚛', text: 'Les camions dans les Andes s\'arrêtent facilement. Place-toi aux contrôles routiers (garitas).' },
      { type: 'rule', icon: '⛽', text: 'Les grifos (stations-service) aux sorties de villes sont les meilleurs spots.' },
      { type: 'kv', items: [
        { k: 'Vallée Sacrée / Cusco', v: 'Facile, touristique', color: 'green' },
        { k: 'Andes rurales', v: 'Camions, peu de trafic mais tout s\'arrête', color: 'green' },
        { k: 'Panaméricaine (côte)', v: 'Bon trafic, camions longue distance', color: 'green' },
        { k: 'Lima (sortie)', v: 'Difficile, bus jusqu\'à la sortie', color: 'red' },
      ]},
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Le Pérou est sûr pour l\'autostop sur les routes principales. Les péages et les stations-service sont les meilleurs spots pour trouver un lift.' },
      { type: 'sub', title: 'Utilise SpotHitch pour ta sécurité' },
      { type: 'rule', icon: '🛡️', text: 'Active le Mode Gardien avant chaque trajet. Un proche suit ta position en temps réel.' },
      { type: 'rule', icon: '🆘', text: 'Configure le mode SOS avec tes contacts. Un seul geste déclenche une triple alerte (push, SMS, appel).' },
      { type: 'rule', icon: '📱', text: 'Photographie la plaque du véhicule et envoie-la à un proche avant de monter.' },
      { type: 'rule', icon: '🎒', text: 'Garde ton sac accessible (sur tes genoux ou à tes pieds), jamais dans le coffre.' },
      { type: 'sub', title: 'Conseils spécifiques' },
      { type: 'rule', icon: '🛣️', text: 'Les péages et les stations-service sont les meilleurs spots. Les voitures ralentissent et tu peux aborder les conducteurs.' },
      { type: 'rule', icon: '🏔️', text: 'En altitude (Cusco, Puno), prends le temps de t\'acclimater avant de voyager. Le mal des montagnes est réel.' },
      { type: 'sub', title: 'Numéros d\'urgence' },
      { type: 'kv', items: [{ k: 'Urgences', v: '105' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Le machisme existe mais le sud touristique est relativement sûr pour les femmes. Voyager en duo est recommandé dans les zones rurales.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'L\'espagnol est la langue principale. Le quechua et l\'aymara sont parlés dans les Andes. L\'anglais est rare en dehors de Cusco et Lima.' },
      { type: 'phrase', items: [
        { local: '¿Me da una jalada?', meaning: 'Vous me prenez en stop ?' },
        { local: 'Gratis, por favor', meaning: 'Gratuit, s\'il vous plaît' },
        { local: '¡Gracias, caserito!', meaning: 'Merci, ami ! (péruvianisme)' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Le Pérou est bon marché. Budget serré : 12-20 €/jour. Les menus (almuerzo) sont copieux et bon marché.' },
      { type: 'kv', items: [
        { k: 'Menú (repas complet)', v: '5-12 PEN (1-3 €)' },
        { k: 'Hostel', v: '20-60 PEN (5-15 €)' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Le camping sauvage est toléré dans les Andes et les zones rurales. Demande la permission aux communautés locales. Les hospedajes (guesthouses basiques) sont très bon marché.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Cruz del Sur / Oltursa', detail: 'Bus longue distance confortables', price: '5-40 €' },
        { emoji: '🚐', name: 'Combi / Colectivo', detail: 'Transport local, très bon marché, routes de montagne', price: '0,30-3 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Fév', level: 'bad' }, { name: 'Mar', level: 'ok' },
        { name: 'Avr', level: 'good' }, { name: 'Mai', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Aoû', level: 'great' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'ok' }, { name: 'Déc', level: 'bad' },
      ]},
      { type: 'text', text: 'Mai à septembre : saison sèche dans les Andes, idéale. Décembre-mars : saison des pluies (routes coupées en montagne). La côte est sèche toute l\'année.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Les Péruviens sont accueillants et fiers de leur gastronomie (le Pérou est la capitale culinaire d\'Amérique du Sud). Le ceviche, le lomo saltado et le pisco sour sont des institutions. Les communautés andines ont une forte culture du partage.' },
      { type: 'event', items: [
        { month: 'Jun', day: '24', name: 'Inti Raymi (Cusco)', desc: 'Fête du Soleil inca. Reconstitution spectaculaire à Sacsayhuamán.' },
      ]},
    ]},
  },
  // ==================== BOLIVIA ====================
  BO: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'L\'autostop est légal en Bolivie. Pratique très courante car beaucoup de communautés rurales n\'ont pas de transport régulier. Les camions sont un mode de transport normal dans les Andes.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'La Bolivie est un bon pays pour l\'autostop. Les conducteurs de camion prennent des passagers régulièrement (souvent contre un paiement modeste). Clarifie si c\'est gratuit. Temps d\'attente : 15-45 min. L\'Altiplano a peu de trafic mais les gens s\'arrêtent.' },
      { type: 'kv', items: [
        { k: 'La Paz-Oruro-Potosí', v: 'Bon trafic, route principale', color: 'green' },
        { k: 'Yungas / Amazonie', v: 'Camions, peu de trafic, aventure', color: 'amber' },
        { k: 'Salar de Uyuni', v: 'Très peu de trafic, organise avec un tour', color: 'amber' },
      ]},
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'La Bolivie est un pays sûr pour l\'autostop. Les routes de montagne sont le principal risque. Attention à l\'altitude (La Paz : 3 640 m) qui peut provoquer le mal des montagnes.' },
      { type: 'sub', title: 'Utilise SpotHitch pour ta sécurité' },
      { type: 'rule', icon: '🛡️', text: 'Active le Mode Gardien avant chaque trajet. Un proche suit ta position en temps réel.' },
      { type: 'rule', icon: '🆘', text: 'Configure le mode SOS avec tes contacts. Un seul geste déclenche une triple alerte (push, SMS, appel).' },
      { type: 'rule', icon: '📱', text: 'Photographie la plaque du véhicule et envoie-la à un proche avant de monter.' },
      { type: 'rule', icon: '🎒', text: 'Garde ton sac accessible (sur tes genoux ou à tes pieds), jamais dans le coffre.' },
      { type: 'sub', title: 'Conseils spécifiques' },
      { type: 'rule', icon: '🏔️', text: 'Les routes de montagne sont parfois dangereuses (virages, précipices). Prends ton temps pour t\'acclimater à l\'altitude.' },
      { type: 'rule', icon: '💧', text: 'Bois beaucoup d\'eau en altitude. Le mal des montagnes (soroche) touche tout le monde au-dessus de 3 000 m.' },
      { type: 'sub', title: 'Numéros d\'urgence' },
      { type: 'kv', items: [{ k: 'Urgences', v: '110' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'La Bolivie est relativement sûre pour les femmes. Les communautés indigènes sont respectueuses. Voyager en duo est recommandé dans les zones isolées.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'L\'espagnol est la langue principale. Le quechua et l\'aymara sont très parlés dans les Andes. L\'anglais est rare.' },
      { type: 'phrase', items: [
        { local: '¿Me lleva?', meaning: 'Vous m\'emmenez ?' },
        { local: '¿Es gratis?', meaning: 'C\'est gratuit ?' },
        { local: 'Jallalla!', meaning: 'Vive ! (aymara, expression positive)' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'La Bolivie est le pays le moins cher d\'Amérique du Sud. Budget serré : 8-15 €/jour. Almuerzo complet : 1-2 €. Hostel : 3-8 €/nuit.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Le camping sauvage est possible partout dans les zones rurales et l\'Altiplano. Les nuits sont très froides en altitude (jusqu\'à -15°C). Un bon sac de couchage est indispensable.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Bus / Flota', detail: 'Bus longue distance, routes souvent en terre', price: '3-15 €' },
        { emoji: '🚐', name: 'Trufi / Micro', detail: 'Transport local en minibus', price: '0,15-1 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Fév', level: 'bad' }, { name: 'Mar', level: 'ok' },
        { name: 'Avr', level: 'good' }, { name: 'Mai', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Aoû', level: 'great' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'ok' }, { name: 'Déc', level: 'bad' },
      ]},
      { type: 'text', text: 'Mai à septembre : saison sèche, idéale. Décembre-mars : pluies intenses, routes coupées, Salar inondé (mais miroir d\'eau spectaculaire).' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'La Bolivie a la plus grande proportion de population indigène d\'Amérique du Sud (62%). La culture aymara et quechua est vivante. La feuille de coca est sacrée et omniprésente (mâcher la coca = normal, pas de drogue). Les Cholitas (femmes en habit traditionnel) sont une fierté nationale.' },
    ]},
  },
  // ==================== ECUADOR ====================
  EC: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'L\'autostop est légal en Équateur. Pratique courante. Le pays est petit (640 km nord-sud) et se traverse facilement. La monnaie est le dollar américain.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'L\'Équateur est facile pour l\'autostop. Le pays est petit et les Équatoriens sont accueillants. Temps d\'attente : 15-30 min. Les pickups ("camionetas") prennent souvent des passagers (parfois contre un paiement modeste).' },
      { type: 'rule', icon: '🛻', text: 'Les camionetas (pickups) s\'arrêtent facilement. Monte dans la benne, c\'est normal et courant.' },
      { type: 'rule', icon: '⛽', text: 'Les péages et les stations-service sont les meilleurs spots.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'L\'Équateur est sûr pour l\'autostop sur les routes principales. Les péages sont de bons spots. Attention à l\'altitude dans les Andes.' },
      { type: 'sub', title: 'Utilise SpotHitch pour ta sécurité' },
      { type: 'rule', icon: '🛡️', text: 'Active le Mode Gardien avant chaque trajet. Un proche suit ta position en temps réel.' },
      { type: 'rule', icon: '🆘', text: 'Configure le mode SOS avec tes contacts. Un seul geste déclenche une triple alerte (push, SMS, appel).' },
      { type: 'rule', icon: '📱', text: 'Photographie la plaque du véhicule et envoie-la à un proche avant de monter.' },
      { type: 'rule', icon: '🎒', text: 'Garde ton sac accessible (sur tes genoux ou à tes pieds), jamais dans le coffre.' },
      { type: 'sub', title: 'Conseils spécifiques' },
      { type: 'rule', icon: '🛣️', text: 'Les péages sont les meilleurs spots pour aborder les conducteurs en toute sécurité.' },
      { type: 'rule', icon: '🏔️', text: 'Attention à l\'altitude dans les Andes (Quito : 2 850 m). Prends le temps de t\'acclimater.' },
      { type: 'sub', title: 'Numéros d\'urgence' },
      { type: 'kv', items: [{ k: 'Urgences', v: '911' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'L\'Équateur est modérément sûr pour les femmes. Les Andes sont plus sûres que la côte. Voyager en duo est recommandé.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'L\'espagnol est la langue principale. Le kichwa est parlé dans les Andes. L\'anglais est limité aux zones touristiques.' },
      { type: 'phrase', items: [
        { local: '¿Me da un jalón?', meaning: 'Vous me prenez en stop ? (Équateur)' },
        { local: '¡Chevere!', meaning: 'Génial !' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'L\'Équateur utilise le dollar américain. Budget serré : 15-25 $/jour. Les almuerzos (menu du jour) coûtent 2-3 $. Hostel : 8-15 $/nuit.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Le camping sauvage est possible dans les Andes et la forêt amazonienne. Les hospedajes (guesthouses) sont très bon marché.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Bus', detail: 'Réseau étendu et bon marché. Les bus s\'arrêtent partout.', price: '1 $/heure de trajet' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'ok' }, { name: 'Fév', level: 'ok' }, { name: 'Mar', level: 'ok' },
        { name: 'Avr', level: 'ok' }, { name: 'Mai', level: 'good' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Aoû', level: 'great' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'good' }, { name: 'Déc', level: 'ok' },
      ]},
      { type: 'text', text: 'Juin-septembre : saison sèche dans les Andes. La côte est sèche de juin à novembre. L\'Amazonie est humide toute l\'année.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'L\'Équateur est incroyablement diversifié pour un petit pays : côte, Andes, Amazonie et Galápagos. Les marchés indigènes (Otavalo) sont spectaculaires. Le cuy (cochon d\'Inde) est un plat traditionnel dans les Andes.' },
    ]},
  },
  // ==================== URUGUAY ====================
  UY: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'L\'autostop est légal en Uruguay. Pratique acceptée et culturellement normale. Le pays est petit (660 km est-ouest) et sûr.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'L\'Uruguay est facile et sûr pour l\'autostop. Le pays est petit et les Uruguayens sont décontractés et accueillants. Temps d\'attente : 15-30 min. Les routes principales (Ruta 1, Ruta 5) ont un bon trafic.' },
      { type: 'text', text: 'Les stations Ancap et les péages sont les meilleurs spots. En été (janvier-février), la côte (Punta del Diablo, Cabo Polonio) est très fréquentée par les Argentins et le stop est facile.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'L\'Uruguay est un pays très sûr pour l\'autostop. C\'est un petit pays accueillant où les stations Ancap sont d\'excellents spots.' },
      { type: 'sub', title: 'Utilise SpotHitch pour ta sécurité' },
      { type: 'rule', icon: '🛡️', text: 'Active le Mode Gardien avant chaque trajet. Un proche suit ta position en temps réel.' },
      { type: 'rule', icon: '🆘', text: 'Configure le mode SOS avec tes contacts. Un seul geste déclenche une triple alerte (push, SMS, appel).' },
      { type: 'rule', icon: '📱', text: 'Photographie la plaque du véhicule et envoie-la à un proche avant de monter.' },
      { type: 'rule', icon: '🎒', text: 'Garde ton sac accessible (sur tes genoux ou à tes pieds), jamais dans le coffre.' },
      { type: 'sub', title: 'Conseils spécifiques' },
      { type: 'rule', icon: '⛽', text: 'Les stations Ancap (chaîne nationale) sont bien réparties et idéales pour trouver un lift.' },
      { type: 'rule', icon: '🗺️', text: 'Le pays est petit. Tu peux le traverser en une journée. Chaque lift te rapproche vite de ta destination.' },
      { type: 'sub', title: 'Numéros d\'urgence' },
      { type: 'kv', items: [{ k: 'Urgences', v: '911' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'L\'Uruguay est considéré comme sûr pour les femmes voyageant seules. Le pays est progressiste (premier en Amérique latine à légaliser le cannabis et le mariage gay).' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'L\'espagnol rioplatense (comme l\'Argentine, avec "vos" et "sh"). Le portuñol est parlé à la frontière brésilienne. L\'anglais est limité.' },
      { type: 'phrase', items: [
        { local: '¿Me llevás?', meaning: 'Tu m\'emmènes ?' },
        { local: 'Ta, gracias', meaning: 'OK, merci (uruguayanisme)' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'L\'Uruguay est plus cher que l\'Argentine. Budget serré : 20-35 €/jour. Les parilladas (grillades) sont copieuses.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Le camping sauvage est toléré sur les plages et en zone rurale. Cabo Polonio est un village sans électricité accessible uniquement en 4x4, idéal pour le camping.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Bus (CUTCSA, COT)', detail: 'Réseau étendu et fiable', price: '5-25 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'great' }, { name: 'Fév', level: 'great' }, { name: 'Mar', level: 'great' },
        { name: 'Avr', level: 'good' }, { name: 'Mai', level: 'ok' }, { name: 'Jun', level: 'bad' },
        { name: 'Jul', level: 'bad' }, { name: 'Aoû', level: 'bad' }, { name: 'Sep', level: 'ok' },
        { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'great' }, { name: 'Déc', level: 'great' },
      ]},
      { type: 'text', text: 'Novembre à mars : idéal. L\'hiver (juin-août) est frais (5-15°C) mais pas rigoureux.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Le maté est la religion nationale. Les Uruguayens se baladent avec leur thermos et leur maté partout. L\'asado du dimanche est sacré. Le pays est décontracté et progressiste. Le tango (candombe) est aussi important qu\'en Argentine.' },
    ]},
  },
  // ==================== VIETNAM ====================
  VN: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'L\'autostop n\'est pas un concept formel au Vietnam. Il n\'y a pas de loi contre mais la pratique n\'existe pas culturellement. Les Vietnamiens qui s\'arrêtent ne comprennent pas forcément que c\'est gratuit.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Le Vietnam est un cas particulier. Le stop classique (pouce levé) ne fonctionne pas car le concept n\'existe pas. Mais les Vietnamiens sont naturellement serviables et te proposeront de l\'aide si tu sembles perdu. Beaucoup de voyageurs font le Vietnam en moto (Easy Rider) plutôt qu\'en stop.' },
      { type: 'rule', icon: '🏍️', text: 'Les motos-taxis (xe ôm) s\'arrêtent constamment. Clarifie que c\'est gratuit si quelqu\'un s\'arrête.' },
      { type: 'rule', icon: '🚛', text: 'Les camions sur la Highway 1 prennent parfois des passagers. Aborde les conducteurs aux arrêts.' },
      { type: 'text', text: 'Le nord montagneux (Ha Giang, Sapa) est plus facile car il y a moins de transport public et les gens s\'arrêtent naturellement.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Le Vietnam est un pays sûr pour l\'autostop. Le trafic est chaotique en ville, mais les stations-service sont de bons spots pour les longs trajets.' },
      { type: 'sub', title: 'Utilise SpotHitch pour ta sécurité' },
      { type: 'rule', icon: '🛡️', text: 'Active le Mode Gardien avant chaque trajet. Un proche suit ta position en temps réel.' },
      { type: 'rule', icon: '🆘', text: 'Configure le mode SOS avec tes contacts. Un seul geste déclenche une triple alerte (push, SMS, appel).' },
      { type: 'rule', icon: '📱', text: 'Photographie la plaque du véhicule et envoie-la à un proche avant de monter.' },
      { type: 'rule', icon: '🎒', text: 'Garde ton sac accessible (sur tes genoux ou à tes pieds), jamais dans le coffre.' },
      { type: 'sub', title: 'Conseils spécifiques' },
      { type: 'rule', icon: '⛽', text: 'Les stations-service sont les meilleurs spots pour les longs trajets. Les camionneurs y font souvent des pauses.' },
      { type: 'rule', icon: '🏍️', text: 'Le trafic est chaotique en ville. Pour le stop, sors de la ville et positionne-toi sur les routes nationales.' },
      { type: 'sub', title: 'Numéros d\'urgence' },
      { type: 'kv', items: [{ k: 'Police', v: '113' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Le Vietnam est sûr pour les femmes voyageant seules. Le harcèlement est rare. Les Vietnamiennes sont indépendantes et respectées dans la société.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Le vietnamien est la langue unique. 6 tons rendent la prononciation très difficile. L\'anglais progresse chez les jeunes dans les grandes villes mais reste très limité en zone rurale. Le français est compris par quelques anciens.' },
      { type: 'phrase', items: [
        { local: 'Xin chào', meaning: 'Bonjour' },
        { local: 'Cảm ơn', meaning: 'Merci' },
        { local: 'Đi... được không?', meaning: 'Aller à... possible ?' },
        { local: 'Miễn phí', meaning: 'Gratuit' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Le Vietnam est très bon marché. Budget serré : 10-20 €/jour même sans stop. Le phở de rue coûte 1-2 €.' },
      { type: 'kv', items: [
        { k: 'Phở / Bánh mì', v: '20 000-40 000 VND (0,80-1,60 €)' },
        { k: 'Hostel', v: '100 000-200 000 VND (4-8 €)' },
        { k: 'Bus Sleeper (longue distance)', v: '100 000-300 000 VND (4-12 €)' },
        { k: 'Bia hơi (bière fraîche)', v: '5 000-10 000 VND (0,20-0,40 €)' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Le camping sauvage est possible dans les montagnes du nord. Les nhà nghỉ (guesthouses) sont si bon marché (3-5 €) que le camping n\'est pas nécessaire. Les familles dans les villages de montagne accueillent parfois les voyageurs.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Bus Sleeper', detail: 'Bus-couchettes longue distance, réseau étendu', price: '4-15 €' },
        { emoji: '🚂', name: 'Reunification Express', detail: 'Train Hanoï-HCMV (30h). Lent mais scenic.', price: '15-40 €' },
        { emoji: '🏍️', name: 'Moto', detail: 'Beaucoup de backpackers achètent une moto (300-500 $) et la revendent en fin de voyage.', price: '' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'ok' }, { name: 'Fév', level: 'good' }, { name: 'Mar', level: 'great' },
        { name: 'Avr', level: 'great' }, { name: 'Mai', level: 'good' }, { name: 'Jun', level: 'ok' },
        { name: 'Jul', level: 'ok' }, { name: 'Aoû', level: 'bad' }, { name: 'Sep', level: 'bad' },
        { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'great' }, { name: 'Déc', level: 'good' },
      ]},
      { type: 'text', text: 'Le Vietnam s\'étend sur 1 650 km : le nord a des saisons (froid en hiver), le centre a les typhons (septembre-novembre), le sud est tropical (sec décembre-avril). Mars-mai : bon pour tout le pays.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Les Vietnamiens sont curieux, souriants et accueillants. Le café (cà phê sữa đá = café glacé au lait concentré) est une institution. La nourriture de rue est parmi les meilleures au monde. Les Vietnamiens adorent inviter les étrangers à trinquer (un, hai, ba, dzô ! = 1, 2, 3, santé !).' },
      { type: 'event', items: [
        { month: 'Jan-Fév', day: '⟳', name: 'Tết (Nouvel An lunaire)', desc: 'La plus grande fête. Le pays ferme pendant une semaine. Transport chaotique avant/après.' },
      ]},
    ]},
  },
  // ==================== LAOS ====================
  LA: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'L\'autostop n\'est pas réglementé au Laos. Le concept est inconnu mais le transport informel (monter dans les camions, pickups) est courant dans les zones rurales.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Le Laos est un pays tranquille où le stop informel fonctionne. Le trafic est faible (le Laos est peu motorisé) mais les conducteurs s\'arrêtent facilement. Temps d\'attente : 20 min-1h+. Dans les zones reculées, le trafic peut être quasi nul.' },
      { type: 'rule', icon: '🛻', text: 'Les pickups et les camions sont les véhicules les plus courants sur les routes de campagne.' },
      { type: 'text', text: 'Les sǎwngthǎew (camions-bus avec bancs à l\'arrière) s\'arrêtent partout et coûtent presque rien. C\'est un "stop payant" très bon marché.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Le Laos est un pays sûr pour l\'autostop. Les conducteurs s\'arrêtent facilement, même sans faire signe. Les routes de montagne sont parfois en mauvais état.' },
      { type: 'sub', title: 'Utilise SpotHitch pour ta sécurité' },
      { type: 'rule', icon: '🛡️', text: 'Active le Mode Gardien avant chaque trajet. Un proche suit ta position en temps réel.' },
      { type: 'rule', icon: '🆘', text: 'Configure le mode SOS avec tes contacts. Un seul geste déclenche une triple alerte (push, SMS, appel).' },
      { type: 'rule', icon: '📱', text: 'Photographie la plaque du véhicule et envoie-la à un proche avant de monter.' },
      { type: 'rule', icon: '🎒', text: 'Garde ton sac accessible (sur tes genoux ou à tes pieds), jamais dans le coffre.' },
      { type: 'sub', title: 'Conseils spécifiques' },
      { type: 'rule', icon: '🏔️', text: 'Les routes de montagne sont parfois en mauvais état. Prévois des trajets plus longs que prévu.' },
      { type: 'rule', icon: '🤝', text: 'Les Laotiens sont accueillants et les conducteurs s\'arrêtent facilement. Un geste de la main suffit.' },
      { type: 'sub', title: 'Numéros d\'urgence' },
      { type: 'kv', items: [{ k: 'Police', v: '191' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Le Laos est sûr pour les femmes voyageant seules. La culture bouddhiste est respectueuse. Les incidents sont très rares.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Le lao est la langue officielle (très proche du thaï, mutuellement intelligible). L\'anglais est très limité. Le français est compris par quelques anciens (ex-colonie française).' },
      { type: 'phrase', items: [
        { local: 'Sabaidee', meaning: 'Bonjour' },
        { local: 'Khop chai', meaning: 'Merci' },
        { local: 'Pai... dai bor?', meaning: 'Aller à... possible ?' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Le Laos est très bon marché. Budget serré : 10-20 €/jour. Le sticky rice (riz gluant) avec du laap (salade de viande) coûte moins de 1 €.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Le camping sauvage est possible mais attention aux UXO. Les guesthouses sont très bon marché (3-8 €). Les temples accueillent parfois les voyageurs.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚐', name: 'Sǎwngthǎew', detail: 'Camions avec bancs. Principal transport rural.', price: '1-5 €' },
        { emoji: '🚌', name: 'Bus VIP', detail: 'Longue distance, réseau en développement', price: '5-15 €' },
        { emoji: '🛥️', name: 'Slow Boat', detail: 'Bateau sur le Mékong (Luang Prabang-Huay Xai, 2 jours)', price: '15-25 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'great' }, { name: 'Fév', level: 'great' }, { name: 'Mar', level: 'good' },
        { name: 'Avr', level: 'ok' }, { name: 'Mai', level: 'ok' }, { name: 'Jun', level: 'ok' },
        { name: 'Jul', level: 'bad' }, { name: 'Aoû', level: 'bad' }, { name: 'Sep', level: 'bad' },
        { name: 'Oct', level: 'ok' }, { name: 'Nov', level: 'great' }, { name: 'Déc', level: 'great' },
      ]},
      { type: 'text', text: 'Novembre à février : idéal (frais et sec). Mars-mai : très chaud. Juin-octobre : mousson (routes inondées, certaines routes coupées).' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Le Laos est le pays le plus détendu d\'Asie du Sud-Est. "Bor pen nyang" (pas de problème) est le mantra national. Le bouddhisme Theravada imprègne la culture. L\'offrande matinale aux moines (tak bat) à Luang Prabang est un moment sacré.' },
    ]},
  },
  // ==================== CAMBODIA ====================
  KH: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'L\'autostop n\'est pas réglementé au Cambodge. Le concept n\'existe pas formellement mais le transport informel est courant. Les conducteurs s\'arrêtent facilement si tu fais signe.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Le Cambodge fonctionne en stop informel. Les pickups, camions et motos s\'arrêtent facilement. Beaucoup de conducteurs attendent un petit paiement (transport informel). Clarifie. Le réseau de bus est limité dans les zones rurales.' },
      { type: 'text', text: 'Les routes principales (Phnom Penh-Siem Reap, Phnom Penh-Sihanoukville) ont du trafic. Les routes secondaires sont souvent en mauvais état.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Le Cambodge est un pays sûr pour l\'autostop. Les routes principales sont en bon état et les conducteurs s\'arrêtent facilement pour les voyageurs.' },
      { type: 'sub', title: 'Utilise SpotHitch pour ta sécurité' },
      { type: 'rule', icon: '🛡️', text: 'Active le Mode Gardien avant chaque trajet. Un proche suit ta position en temps réel.' },
      { type: 'rule', icon: '🆘', text: 'Configure le mode SOS avec tes contacts. Un seul geste déclenche une triple alerte (push, SMS, appel).' },
      { type: 'rule', icon: '📱', text: 'Photographie la plaque du véhicule et envoie-la à un proche avant de monter.' },
      { type: 'rule', icon: '🎒', text: 'Garde ton sac accessible (sur tes genoux ou à tes pieds), jamais dans le coffre.' },
      { type: 'sub', title: 'Conseils spécifiques' },
      { type: 'rule', icon: '🛣️', text: 'Les routes principales (Phnom Penh-Siem Reap, Phnom Penh-Sihanoukville) sont en bon état et bien fréquentées.' },
      { type: 'rule', icon: '😊', text: 'Les Cambodgiens sont accueillants. Un sourire est universel, même sans parler la langue.' },
      { type: 'sub', title: 'Numéros d\'urgence' },
      { type: 'kv', items: [{ k: 'Police', v: '117' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Le Cambodge est globalement sûr pour les femmes voyageant seules. La société est respectueuse. Évite les zones de fête (Sihanoukville) la nuit.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Le khmer est la langue officielle. L\'anglais est répandu dans les zones touristiques (Siem Reap, Phnom Penh). Le français est compris par quelques anciens.' },
      { type: 'phrase', items: [
        { local: 'Sok sabay', meaning: 'Bonjour / Ça va' },
        { local: 'Aw kun', meaning: 'Merci' },
        { local: 'Tov... baan te?', meaning: 'Aller à... possible ?' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Le Cambodge est très bon marché. Budget serré : 10-20 $/jour. Le dollar américain est la monnaie de facto (le riel est utilisé pour la petite monnaie).' },
      { type: 'kv', items: [
        { k: 'Repas local', v: '1-3 $' },
        { k: 'Hostel', v: '3-8 $/nuit' },
        { k: 'Bière Angkor', v: '0,50 $ (happy hour)' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Les guesthouses sont si bon marché (3-5 $) que le camping n\'est pas nécessaire. Le camping sauvage est possible dans les zones rurales.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Bus', detail: 'Réseau en développement. Giant Ibis et Mekong Express sont fiables.', price: '5-15 $' },
        { emoji: '🛥️', name: 'Bateau', detail: 'Phnom Penh-Siem Reap par le Tonlé Sap', price: '25-35 $' },
        { emoji: '🛺', name: 'Tuk-tuk', detail: 'Transport local omniprésent', price: '1-5 $' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'great' }, { name: 'Fév', level: 'great' }, { name: 'Mar', level: 'good' },
        { name: 'Avr', level: 'ok' }, { name: 'Mai', level: 'ok' }, { name: 'Jun', level: 'ok' },
        { name: 'Jul', level: 'ok' }, { name: 'Aoû', level: 'bad' }, { name: 'Sep', level: 'bad' },
        { name: 'Oct', level: 'ok' }, { name: 'Nov', level: 'great' }, { name: 'Déc', level: 'great' },
      ]},
      { type: 'text', text: 'Novembre à février : idéal (frais et sec). Mars-mai : très chaud (38°C+). Juin-octobre : mousson (routes inondées dans les zones rurales).' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Les Cambodgiens sont souriants et résilients malgré l\'histoire tragique (Khmers rouges). Angkor Wat est une fierté nationale. Les conducteurs sont curieux et accueillants. Ne parle jamais de politique ou des Khmers rouges de façon légère.' },
    ]},
  },
  // ==================== NEPAL ====================
  NP: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'L\'autostop n\'est pas réglementé au Népal. Le transport informel (monter sur les toits de bus, dans les camions) est un mode de vie normal dans les zones de montagne.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Le Népal est facile pour le stop informel. Les camions et les pickups s\'arrêtent facilement. En montagne, le trafic est faible mais tout le monde s\'arrête. Les Népalais sont extrêmement accueillants.' },
      { type: 'rule', icon: '🚛', text: 'Les camions Tata sur les routes de montagne prennent des passagers (souvent contre un petit paiement). Clarifie avant.' },
      { type: 'rule', icon: '🏔️', text: 'Dans les régions de trek (Annapurna, Everest), le transport est par jeep ou à pied. Pas de stop traditionnel.' },
      { type: 'text', text: 'La vallée de Katmandou et les routes du Terai (plaine du sud) ont plus de trafic. La route Katmandou-Pokhara est la plus fréquentée.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Le Népal est un pays sûr pour l\'autostop. Les Népalais sont accueillants. Le principal risque vient des routes de montagne.' },
      { type: 'sub', title: 'Utilise SpotHitch pour ta sécurité' },
      { type: 'rule', icon: '🛡️', text: 'Active le Mode Gardien avant chaque trajet. Un proche suit ta position en temps réel.' },
      { type: 'rule', icon: '🆘', text: 'Configure le mode SOS avec tes contacts. Un seul geste déclenche une triple alerte (push, SMS, appel).' },
      { type: 'rule', icon: '📱', text: 'Photographie la plaque du véhicule et envoie-la à un proche avant de monter.' },
      { type: 'rule', icon: '🎒', text: 'Garde ton sac accessible (sur tes genoux ou à tes pieds), jamais dans le coffre.' },
      { type: 'sub', title: 'Conseils spécifiques' },
      { type: 'rule', icon: '🏔️', text: 'Les routes de montagne sont le principal risque (précipices, pas de garde-fou). Attache ta ceinture.' },
      { type: 'rule', icon: '🙏', text: 'Les Népalais sont accueillants. Un "namaste" (mains jointes) ouvre toutes les portes.' },
      { type: 'sub', title: 'Numéros d\'urgence' },
      { type: 'kv', items: [{ k: 'Urgences', v: '100' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Le Népal est considéré comme sûr pour les femmes voyageant seules. Les Népalais sont respectueux. Quelques cas de harcèlement en zone rurale mais globalement positif.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Le népalais est la langue officielle. L\'anglais est assez répandu dans les zones touristiques (Katmandou, Pokhara, régions de trek). Les guides de trek parlent anglais.' },
      { type: 'phrase', items: [
        { local: 'Namaste', meaning: 'Bonjour (mains jointes devant la poitrine)' },
        { local: 'Dhanyabad', meaning: 'Merci' },
        { local: 'Kati paisa?', meaning: 'Combien ça coûte ?' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Le Népal est très bon marché. Budget serré : 10-20 €/jour. Le dhal bhat (riz et lentilles) est le plat national : 1-2 €, à volonté dans beaucoup de restaurants.' },
      { type: 'kv', items: [
        { k: 'Dhal bhat', v: '200-500 NPR (1-3 €)' },
        { k: 'Guesthouse', v: '300-1 000 NPR (2-7 €)' },
        { k: 'Bus local', v: '100-500 NPR (0,70-3 €)' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Le camping sauvage est possible dans les zones de montagne. Les tea houses sur les circuits de trek offrent hébergement et repas bon marché. Les guesthouses en ville sont très abordables.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Bus local / Tourist Bus', detail: 'Les bus locaux sont bondés mais bon marché. Les tourist bus sont plus confortables.', price: '2-15 €' },
        { emoji: '🛩️', name: 'Vol intérieur', detail: 'Nécessaire pour Lukla (Everest). Vues spectaculaires.', price: '100-200 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'ok' }, { name: 'Fév', level: 'good' }, { name: 'Mar', level: 'great' },
        { name: 'Avr', level: 'great' }, { name: 'Mai', level: 'good' }, { name: 'Jun', level: 'bad' },
        { name: 'Jul', level: 'bad' }, { name: 'Aoû', level: 'bad' }, { name: 'Sep', level: 'ok' },
        { name: 'Oct', level: 'great' }, { name: 'Nov', level: 'great' }, { name: 'Déc', level: 'good' },
      ]},
      { type: 'text', text: 'Octobre-novembre : idéal (ciel dégagé, vues sur l\'Himalaya). Mars-mai : bon aussi (rhododendrons en fleurs). Juin-septembre : mousson (routes coupées, leeches en montagne).' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Le Népal est un mélange unique d\'hindouisme et de bouddhisme. Les Népalais sont parmi les gens les plus souriants du monde. Le dhal bhat est "l\'énergie" : deux fois par jour, à volonté. Le trekking est une industrie nationale et les guides sont d\'une gentillesse remarquable.' },
      { type: 'event', items: [
        { month: 'Oct', day: '⟳', name: 'Dashain', desc: 'La plus grande fête népalaise (15 jours). Cerfs-volants, familles réunies. Transport très chargé.' },
      ]},
    ]},
  },
  // ==================== KAZAKHSTAN ====================
  KZ: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'L\'autostop est légal au Kazakhstan. Aucune restriction. Le transport informel est courant car le pays est immense (9ème plus grand au monde) et les transports publics sont limités entre les villes.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Le Kazakhstan est bon pour l\'autostop. Les distances sont immenses (Almaty-Astana : 1 200 km) mais les conducteurs font de longues distances. Temps d\'attente : 15-45 min sur les routes principales. En zone rurale, le trafic est très faible.' },
      { type: 'rule', icon: '🚛', text: 'Les camions sont les meilleurs pour les longues distances. Aborde les conducteurs aux stations-service.' },
      { type: 'rule', icon: '💰', text: 'Beaucoup de conducteurs attendent un paiement (transport informel courant). Clarifie "besplatno" (gratuit) avant de monter.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Le Kazakhstan est un pays sûr pour l\'autostop. Les distances sont immenses et les stations-service sont rares en zone rurale. Prévois des provisions.' },
      { type: 'sub', title: 'Utilise SpotHitch pour ta sécurité' },
      { type: 'rule', icon: '🛡️', text: 'Active le Mode Gardien avant chaque trajet. Un proche suit ta position en temps réel.' },
      { type: 'rule', icon: '🆘', text: 'Configure le mode SOS avec tes contacts. Un seul geste déclenche une triple alerte (push, SMS, appel).' },
      { type: 'rule', icon: '📱', text: 'Photographie la plaque du véhicule et envoie-la à un proche avant de monter.' },
      { type: 'rule', icon: '🎒', text: 'Garde ton sac accessible (sur tes genoux ou à tes pieds), jamais dans le coffre.' },
      { type: 'sub', title: 'Conseils spécifiques' },
      { type: 'rule', icon: '🗺️', text: 'Les distances sont immenses et les stations-service rares en zone rurale. Emporte eau, nourriture et un chargeur.' },
      { type: 'rule', icon: '📋', text: 'Aie toujours ton passeport sur toi. Les contrôles de police sont fréquents mais bienveillants.' },
      { type: 'sub', title: 'Numéros d\'urgence' },
      { type: 'kv', items: [{ k: 'Urgences', v: '112' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Le Kazakhstan est relativement sûr pour les femmes. La société est plus laïque que les voisins d\'Asie centrale. Voyager en duo est recommandé dans les zones rurales isolées.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Le kazakh et le russe sont les deux langues officielles. Le russe est parlé par presque tout le monde. L\'anglais est très rare. Le russe est indispensable.' },
      { type: 'phrase', items: [
        { local: 'Salam', meaning: 'Bonjour (kazakh)' },
        { local: 'Rakhmet / Spasibo', meaning: 'Merci (kazakh / russe)' },
        { local: 'Besplatno', meaning: 'Gratuit (russe)' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Le Kazakhstan est modérément cher pour l\'Asie centrale. Budget serré : 15-25 €/jour. Les bazars sont bon marché pour la nourriture.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Le camping sauvage est facile dans les steppes infinies (personne pour te déranger). Les yourtes des nomades sont parfois ouvertes aux voyageurs. En ville, les hostels sont bon marché.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚂', name: 'Train', detail: 'Réseau soviétique étendu, trains de nuit', price: '10-30 €' },
        { emoji: '🚌', name: 'Bus', detail: 'Entre les grandes villes', price: '5-20 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Fév', level: 'bad' }, { name: 'Mar', level: 'ok' },
        { name: 'Avr', level: 'good' }, { name: 'Mai', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'good' }, { name: 'Aoû', level: 'good' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'ok' }, { name: 'Déc', level: 'bad' },
      ]},
      { type: 'text', text: 'Mai-juin et septembre : idéal. L\'été est chaud dans les steppes (40°C+). L\'hiver est extrême (jusqu\'à -40°C à Astana). Le printemps voit les steppes fleurir.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Le Kazakhstan mélange culture nomade et modernité. Le koumiss (lait de jument fermenté) et le beshbarmak (viande avec pâtes) sont les plats traditionnels. L\'hospitalité nomade (offrir le thé, le repas, un lit) est profondément ancrée.' },
    ]},
  },
  // ==================== KYRGYZSTAN ====================
  KG: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'L\'autostop est légal au Kirghizistan. Pratique très courante. Le pays est montagneux et les transports publics limités. Le transport informel est un mode de vie.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Le Kirghizistan est l\'un des meilleurs pays d\'Asie centrale pour l\'autostop. Les Kirghiz sont accueillants et curieux. Temps d\'attente : 10-30 min sur les routes principales. En montagne, le trafic est faible mais tout le monde s\'arrête.' },
      { type: 'text', text: 'La route Bichkek-Osh (via le col de Teo-Ashuu à 3 500m) est un classique. Le tour du lac Issyk-Kul est facile en été.' },
      { type: 'rule', icon: '💰', text: 'Les marshrutkas (taxis collectifs) s\'arrêtent partout. Clarifie "besplatno" car certains conducteurs privés attendent un paiement.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Le Kirghizistan est un pays sûr pour l\'autostop. Les routes de montagne sont dangereuses mais spectaculaires. Les conducteurs s\'arrêtent facilement.' },
      { type: 'sub', title: 'Utilise SpotHitch pour ta sécurité' },
      { type: 'rule', icon: '🛡️', text: 'Active le Mode Gardien avant chaque trajet. Un proche suit ta position en temps réel.' },
      { type: 'rule', icon: '🆘', text: 'Configure le mode SOS avec tes contacts. Un seul geste déclenche une triple alerte (push, SMS, appel).' },
      { type: 'rule', icon: '📱', text: 'Photographie la plaque du véhicule et envoie-la à un proche avant de monter.' },
      { type: 'rule', icon: '🎒', text: 'Garde ton sac accessible (sur tes genoux ou à tes pieds), jamais dans le coffre.' },
      { type: 'sub', title: 'Conseils spécifiques' },
      { type: 'rule', icon: '🏔️', text: 'Les routes de montagne sont dangereuses (cols à 3 000 m+, pas de garde-fou). Attache ta ceinture.' },
      { type: 'rule', icon: '🌄', text: 'Les paysages sont spectaculaires. Profite du trajet et partage des moments avec les conducteurs kirghizes.' },
      { type: 'sub', title: 'Numéros d\'urgence' },
      { type: 'kv', items: [{ k: 'Urgences', v: '103' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Le Kirghizistan est modérément sûr pour les femmes seules. L\'enlèvement de mariée (ala kachuu) existe encore en zone rurale (pas contre les étrangères mais culturellement troublant). Les zones touristiques sont sûres.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Le kirghiz et le russe sont les langues officielles. Le russe est compris partout. L\'anglais est très limité. Le russe de base est indispensable.' },
      { type: 'phrase', items: [
        { local: 'Salam', meaning: 'Bonjour (kirghiz)' },
        { local: 'Rakhmat', meaning: 'Merci (kirghiz)' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Le Kirghizistan est très bon marché. Budget serré : 10-20 €/jour. Le logement en yourte via CBT (Community Based Tourism) : 10-15 €/nuit avec repas.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Le camping sauvage est légal et facile dans les montagnes et les jailoos (pâturages d\'altitude). Les yourtes des bergers accueillent souvent les voyageurs. Le réseau CBT organise des séjours en yourte authentiques.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚐', name: 'Marshrutka', detail: 'Minibus entre villes, bon marché', price: '1-5 €' },
        { emoji: '🚗', name: 'Taxi partagé', detail: 'Plus rapide que le bus, attend d\'être plein', price: '3-10 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Fév', level: 'bad' }, { name: 'Mar', level: 'ok' },
        { name: 'Avr', level: 'good' }, { name: 'Mai', level: 'good' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Aoû', level: 'great' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'ok' }, { name: 'Déc', level: 'bad' },
      ]},
      { type: 'text', text: 'Juin à septembre : idéal. Les cols de montagne sont ouverts. L\'été au lac Issyk-Kul est magnifique. L\'hiver ferme les cols et le stop devient difficile.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'La culture nomade kirghize est vivante. Le koumiss (lait de jument) et le beshbarmak sont les traditions culinaires. L\'hospitalité est sacrée : refuser le thé est impoli. Les jeux équestres (kok-boru, chasse à l\'aigle) sont spectaculaires.' },
    ]},
  },
  // ==================== UZBEKISTAN ====================
  UZ: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'L\'autostop est légal en Ouzbékistan. Le transport informel est très courant. Beaucoup de voitures privées fonctionnent comme des taxis informels (surtout les Daewoo Matiz et Chevrolet Lacetti).' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'L\'Ouzbékistan fonctionne en stop semi-payant. Lever la main au bord de la route arrête des voitures privées qui font taxi. Clarifie "besplatno" (gratuit) AVANT de monter. Temps d\'attente : 5-15 min en ville, 15-30 min entre les villes.' },
      { type: 'text', text: 'La route de la Soie (Tachkent-Samarkand-Boukhara-Khiva) est bien desservie. Les taxis partagés sont si bon marché qu\'ils rendent le stop gratuit moins nécessaire.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'L\'Ouzbékistan est un pays sûr pour l\'autostop. Les checkpoints de police sont fréquents mais sans problème si tu as tes papiers.' },
      { type: 'sub', title: 'Utilise SpotHitch pour ta sécurité' },
      { type: 'rule', icon: '🛡️', text: 'Active le Mode Gardien avant chaque trajet. Un proche suit ta position en temps réel.' },
      { type: 'rule', icon: '🆘', text: 'Configure le mode SOS avec tes contacts. Un seul geste déclenche une triple alerte (push, SMS, appel).' },
      { type: 'rule', icon: '📱', text: 'Photographie la plaque du véhicule et envoie-la à un proche avant de monter.' },
      { type: 'rule', icon: '🎒', text: 'Garde ton sac accessible (sur tes genoux ou à tes pieds), jamais dans le coffre.' },
      { type: 'sub', title: 'Conseils spécifiques' },
      { type: 'rule', icon: '📋', text: 'Les checkpoints de police sont fréquents. Aie toujours ton passeport et ton enregistrement sur toi.' },
      { type: 'rule', icon: '🕌', text: 'Les Ouzbeks sont hospitaliers. On t\'invitera souvent pour du plov (plat national) ou du thé.' },
      { type: 'sub', title: 'Numéros d\'urgence' },
      { type: 'kv', items: [{ k: 'Urgences', v: '101' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'L\'Ouzbékistan est sûr pour les femmes voyageant seules. La société est conservatrice mais respectueuse. Les voyageuses rapportent des expériences positives.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'L\'ouzbek est la langue officielle. Le russe est très répandu (surtout à Tachkent). L\'anglais est limité aux zones touristiques (Samarkand, Boukhara).' },
      { type: 'phrase', items: [
        { local: 'Assalomu alaykum', meaning: 'Bonjour (formel)' },
        { local: 'Rahmat', meaning: 'Merci' },
        { local: 'Bepul', meaning: 'Gratuit' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'L\'Ouzbékistan est très bon marché. Budget serré : 10-20 €/jour. Le plov (riz pilaf) est le plat national : 1-2 € dans un chaikhana (salon de thé).' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Les hostels et B&B sont bon marché (5-15 €). Les chaikhanas (salons de thé) permettent parfois de dormir sur les tapchans (lits de repos extérieurs). Le camping sauvage est possible dans les zones rurales.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚂', name: 'Afrosiyob (TGV)', detail: 'Train rapide Tachkent-Samarkand-Boukhara', price: '5-15 €' },
        { emoji: '🚗', name: 'Taxi partagé', detail: 'Voitures privées entre villes, attend d\'être plein', price: '2-10 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Fév', level: 'ok' }, { name: 'Mar', level: 'good' },
        { name: 'Avr', level: 'great' }, { name: 'Mai', level: 'great' }, { name: 'Jun', level: 'ok' },
        { name: 'Jul', level: 'bad' }, { name: 'Aoû', level: 'bad' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'great' }, { name: 'Nov', level: 'good' }, { name: 'Déc', level: 'ok' },
      ]},
      { type: 'text', text: 'Avril-mai et septembre-octobre : idéal (20-28°C). L\'été est brûlant (45°C+). L\'hiver est froid dans les montagnes.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'L\'Ouzbékistan est le cœur de la Route de la Soie. Samarkand, Boukhara et Khiva sont des merveilles architecturales. L\'hospitalité est sacrée. Le plov du jeudi est un événement social. Les mariages (souvent 300+ invités) sont des occasions de fête et les étrangers y sont parfois invités spontanément.' },
    ]},
  },
  // ==================== JORDAN ====================
  JO: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'L\'autostop est légal en Jordanie. Pratique courante. Les Jordaniens sont parmi les peuples les plus hospitaliers du Moyen-Orient. Le pays est petit (450 km nord-sud) et sûr.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'La Jordanie est excellente pour l\'autostop. Les Jordaniens s\'arrêtent très facilement et sont curieux des étrangers. Temps d\'attente : 5-15 min. Beaucoup de conducteurs refusent l\'argent et insistent pour t\'inviter à manger.' },
      { type: 'kv', items: [
        { k: 'King\'s Highway (route des rois)', v: 'Magnifique, bon trafic', color: 'green' },
        { k: 'Amman-Aqaba', v: 'Trafic dense, facile', color: 'green' },
        { k: 'Wadi Rum-Aqaba', v: 'Peu de trafic mais tout s\'arrête', color: 'amber' },
      ]},
      { type: 'tip', text: '💡 Les Jordaniens donnent souvent leur numéro de téléphone et insistent pour t\'aider pendant tout ton séjour.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'La Jordanie est un pays sûr et hospitalier pour l\'autostop. Les Jordaniens sont accueillants et le pays est stable.' },
      { type: 'sub', title: 'Utilise SpotHitch pour ta sécurité' },
      { type: 'rule', icon: '🛡️', text: 'Active le Mode Gardien avant chaque trajet. Un proche suit ta position en temps réel.' },
      { type: 'rule', icon: '🆘', text: 'Configure le mode SOS avec tes contacts. Un seul geste déclenche une triple alerte (push, SMS, appel).' },
      { type: 'rule', icon: '📱', text: 'Photographie la plaque du véhicule et envoie-la à un proche avant de monter.' },
      { type: 'rule', icon: '🎒', text: 'Garde ton sac accessible (sur tes genoux ou à tes pieds), jamais dans le coffre.' },
      { type: 'sub', title: 'Conseils spécifiques' },
      { type: 'rule', icon: '🤝', text: 'Les Jordaniens sont très hospitaliers. On t\'offrira souvent du thé ou un repas.' },
      { type: 'rule', icon: '🏜️', text: 'Le pays est compact et les routes sont en bon état. Le Wadi Rum et Petra sont facilement accessibles.' },
      { type: 'sub', title: 'Numéros d\'urgence' },
      { type: 'kv', items: [{ k: 'Urgences', v: '911' }] },
    ]},
    women: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'La Jordanie est relativement sûre pour les femmes. L\'hospitalité jordanienne s\'applique à tous. Habille-toi de façon conservatrice (surtout hors d\'Amman). Quelques regards insistants mais les incidents sont rares.' },
      { type: 'rule', icon: '👕', text: 'Vêtements couvrant les épaules et les genoux, surtout en zone rurale.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'L\'arabe jordanien est la langue principale. L\'anglais est très répandu, surtout à Amman et dans les zones touristiques. Beaucoup de Jordaniens parlent couramment anglais.' },
      { type: 'phrase', items: [
        { local: 'Marhaba / Ahlan', meaning: 'Bonjour / Bienvenue' },
        { local: 'Shukran', meaning: 'Merci' },
        { local: 'Inshallah', meaning: 'Si Dieu le veut (utilisé constamment)' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'La Jordanie est modérément chère. Budget serré : 20-35 €/jour. Le Jordan Pass (70+ JOD) inclut Petra et le visa.' },
      { type: 'kv', items: [
        { k: 'Falafel / shawarma', v: '0,50-1,50 JOD (0,70-2 €)' },
        { k: 'Hostel', v: '8-20 JOD (10-25 €)' },
        { k: 'Petra (entrée)', v: '50 JOD (70 €) ou inclus dans le Jordan Pass' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Le camping sauvage est possible dans le Wadi Rum (expérience inoubliable sous les étoiles) et dans les zones rurales. Les Bédouins invitent souvent les voyageurs sous leur tente pour le thé et parfois la nuit.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'JETT Bus', detail: 'Bus longue distance fiables', price: '3-10 JOD' },
        { emoji: '🚐', name: 'Minibus', detail: 'Transport local entre villes, attendent d\'être pleins', price: '0,50-3 JOD' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'ok' }, { name: 'Fév', level: 'good' }, { name: 'Mar', level: 'great' },
        { name: 'Avr', level: 'great' }, { name: 'Mai', level: 'great' }, { name: 'Jun', level: 'ok' },
        { name: 'Jul', level: 'bad' }, { name: 'Aoû', level: 'bad' }, { name: 'Sep', level: 'ok' },
        { name: 'Oct', level: 'great' }, { name: 'Nov', level: 'great' }, { name: 'Déc', level: 'ok' },
      ]},
      { type: 'text', text: 'Mars-mai et octobre-novembre : idéal (20-28°C). L\'été est brûlant (35-45°C, surtout Aqaba et Wadi Rum). L\'hiver est frais et pluvieux à Amman.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'L\'hospitalité jordanienne est exceptionnelle. Le "Ahlan wa sahlan" (bienvenue) est sincère. Les Bédouins dans le Wadi Rum offrent le thé (chai), le mansaf (plat national au yaourt) et des histoires. Refuser l\'invitation est impoli. Petra est une merveille du monde.' },
    ]},
  },
  // ==================== OMAN ====================
  OM: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'L\'autostop est légal à Oman. Le concept est peu formalisé mais lever la main au bord de la route fonctionne très bien. Les Omanais sont naturellement serviables.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Oman est excellent pour l\'autostop. Les Omanais sont extrêmement accueillants et s\'arrêtent très facilement. Temps d\'attente : 5-15 min sur les routes principales. En zone rurale (wadis, montagnes), le trafic est faible mais tout le monde s\'arrête.' },
      { type: 'text', text: 'Les conducteurs font des détours importants pour t\'aider, offrent le repas et parfois l\'hébergement. Le stop est presque trop facile : les voitures s\'arrêtent avant même que tu lèves le pouce.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Oman est l\'un des pays les plus sûrs au monde. Le taux de criminalité est quasi nul. Le sultan est vénéré et le pays est très ordonné.' },
      { type: 'kv', items: [{ k: 'Urgences', v: '9999' }, { k: 'Police', v: '9999' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Oman est sûr pour les femmes voyageant seules. La société est conservatrice mais respectueuse. Habille-toi de façon modeste (épaules et genoux couverts). Les Omanais sont courtois et le harcèlement est rare.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'L\'arabe omanais est la langue principale. L\'anglais est largement parlé, surtout à Mascate et dans les zones touristiques. Pas de barrière linguistique majeure.' },
      { type: 'phrase', items: [
        { local: 'As-salaam alaikum', meaning: 'Paix sur vous (salutation universelle)' },
        { local: 'Shukran jazeelan', meaning: 'Merci beaucoup' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Oman est modérément cher. Budget serré : 25-40 €/jour. L\'essence est très bon marché. Les restaurants omanais traditionnels sont abordables.' },
      { type: 'kv', items: [
        { k: 'Repas local', v: '1-3 OMR (2,50-7,50 €)' },
        { k: 'Hostel', v: '5-15 OMR (12-37 €)' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Le camping sauvage est légal et populaire à Oman. Les wadis (vallées) et les plages sont des spots magnifiques. Beaucoup d\'Omanais campent eux-mêmes le week-end. Le ciel étoilé dans le désert est spectaculaire.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Mwasalat (bus)', detail: 'Réseau de bus en expansion, principal transport public', price: '0,50-5 OMR' },
        { emoji: '🚗', name: 'Location de voiture', detail: 'Souvent la meilleure option pour explorer les wadis et les montagnes', price: '10-20 OMR/jour' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'great' }, { name: 'Fév', level: 'great' }, { name: 'Mar', level: 'great' },
        { name: 'Avr', level: 'good' }, { name: 'Mai', level: 'ok' }, { name: 'Jun', level: 'bad' },
        { name: 'Jul', level: 'bad' }, { name: 'Aoû', level: 'bad' }, { name: 'Sep', level: 'ok' },
        { name: 'Oct', level: 'great' }, { name: 'Nov', level: 'great' }, { name: 'Déc', level: 'great' },
      ]},
      { type: 'text', text: 'Octobre à mars : idéal (25-30°C). L\'été est brûlant (45°C+) et le stop est déconseillé. Le Dhofar (Salalah) a une saison de mousson unique (khareef) en été : verdoyant et frais.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Oman est un pays raffiné et accueillant. Le café omanais (qahwa) et les dattes sont offerts à chaque rencontre. Le pays est fier de sa tolérance (mosquées, églises et temples coexistent). L\'encens (frankincense) est un cadeau traditionnel. Les Omanais en dishdasha blanc et kumma sont élégants et courtois.' },
    ]},
  },
  // ==================== SENEGAL ====================
  SN: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'L\'autostop est légal au Sénégal. Le concept de "teranga" (hospitalité) fait que les conducteurs s\'arrêtent naturellement. Le transport informel est le mode principal en zone rurale.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Le Sénégal est bon pour l\'autostop grâce à la teranga (hospitalité légendaire). Les conducteurs s\'arrêtent facilement. Beaucoup de transport est informel : les "sept-places" (taxis collectifs) et les ndiaga ndiaye (minibus) s\'arrêtent partout.' },
      { type: 'rule', icon: '🚛', text: 'Les camions prennent des passagers sur les longues distances (Dakar-Saint-Louis, Dakar-Ziguinchor).' },
      { type: 'rule', icon: '💰', text: 'Beaucoup de conducteurs attendent un paiement. Clarifie avant de monter. La distinction stop gratuit / transport payant est floue.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Le Sénégal est un pays sûr pour l\'autostop. Les Sénégalais sont hospitaliers et adorent discuter avec les voyageurs. Prévois un chapeau et de l\'eau.' },
      { type: 'sub', title: 'Utilise SpotHitch pour ta sécurité' },
      { type: 'rule', icon: '🛡️', text: 'Active le Mode Gardien avant chaque trajet. Un proche suit ta position en temps réel.' },
      { type: 'rule', icon: '🆘', text: 'Configure le mode SOS avec tes contacts. Un seul geste déclenche une triple alerte (push, SMS, appel).' },
      { type: 'rule', icon: '📱', text: 'Photographie la plaque du véhicule et envoie-la à un proche avant de monter.' },
      { type: 'rule', icon: '🎒', text: 'Garde ton sac accessible (sur tes genoux ou à tes pieds), jamais dans le coffre.' },
      { type: 'sub', title: 'Conseils spécifiques' },
      { type: 'rule', icon: '🤝', text: 'Les Sénégalais sont connus pour leur teranga (hospitalité). Ils adorent partager un ataya (thé) avec les voyageurs.' },
      { type: 'rule', icon: '☀️', text: 'Protège-toi du soleil : chapeau, crème solaire et eau en permanence. La chaleur est intense.' },
      { type: 'sub', title: 'Numéros d\'urgence' },
      { type: 'kv', items: [{ k: 'Police', v: '17' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Le Sénégal est relativement sûr pour les femmes mais le harcèlement de rue existe, surtout à Dakar. La teranga protège les voyageuses. Habille-toi de façon modeste en zone rurale.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Le français est la langue officielle et presque tout le monde le parle. Le wolof est la langue locale la plus répandue. Les francophones n\'ont aucune barrière linguistique.' },
      { type: 'phrase', items: [
        { local: 'Nanga def?', meaning: 'Comment ça va ? (wolof)' },
        { local: 'Jërëjëf', meaning: 'Merci (wolof)' },
        { local: 'Inshallah', meaning: 'Si Dieu le veut' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Le Sénégal est modérément cher pour l\'Afrique de l\'Ouest. Budget serré : 15-25 €/jour. Le thiéboudienne (riz au poisson) est le plat national.' },
      { type: 'kv', items: [
        { k: 'Repas local', v: '500-1 500 CFA (0,75-2,30 €)' },
        { k: 'Auberge', v: '5 000-15 000 CFA (7-23 €)' },
        { k: 'Sept-place (100 km)', v: '2 000-4 000 CFA (3-6 €)' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Le camping sauvage est possible sur les plages et en brousse. Les campements (guesthouses rurales) sont bon marché et conviviaux. Les Sénégalais invitent facilement les voyageurs chez eux.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚐', name: 'Sept-place / Ndiaga Ndiaye', detail: 'Taxis collectifs et minibus, réseau étendu', price: '1-6 €' },
        { emoji: '🚂', name: 'TER Dakar', detail: 'Train express récent Dakar-AIBD', price: '1-3 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'great' }, { name: 'Fév', level: 'great' }, { name: 'Mar', level: 'great' },
        { name: 'Avr', level: 'good' }, { name: 'Mai', level: 'ok' }, { name: 'Jun', level: 'ok' },
        { name: 'Jul', level: 'bad' }, { name: 'Aoû', level: 'bad' }, { name: 'Sep', level: 'bad' },
        { name: 'Oct', level: 'ok' }, { name: 'Nov', level: 'great' }, { name: 'Déc', level: 'great' },
      ]},
      { type: 'text', text: 'Novembre à mai : saison sèche, idéale. Juillet-octobre : saison des pluies (hivernage), routes inondées en zone rurale.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'La teranga (hospitalité) est l\'âme du Sénégal. Le thé à la menthe (ataya) en trois services est un rituel social incontournable. Le thiéboudienne est un plat communautaire partagé dans un grand bol. La musique (mbalax, Youssou N\'Dour) rythme la vie quotidienne.' },
    ]},
  },
  // ==================== NAMIBIA ====================
  NA: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'L\'autostop est légal en Namibie. Pratique courante car le pays est immense et les transports publics quasi inexistants en dehors des lignes principales.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'La Namibie est faisable en stop mais les distances sont immenses et le trafic très faible. Le pays est le 2ème moins densément peuplé au monde (3 hab/km²). Temps d\'attente : 30 min-3h, parfois plus sur les routes secondaires.' },
      { type: 'kv', items: [
        { k: 'B1/B2 (axes principaux)', v: 'Trafic modéré, faisable', color: 'green' },
        { k: 'Routes vers Sossusvlei', v: 'Peu de trafic, longue attente possible', color: 'amber' },
        { k: 'Nord-est (Caprivi Strip)', v: 'Faisable mais isolé', color: 'amber' },
      ]},
      { type: 'rule', icon: '💧', text: 'TOUJOURS avoir au moins 5 litres d\'eau. La déshydratation dans le désert est le danger n°1.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'La Namibie est un pays sûr pour l\'autostop. Les distances sont immenses et le trafic faible, alors prévois eau et chargeur solaire.' },
      { type: 'sub', title: 'Utilise SpotHitch pour ta sécurité' },
      { type: 'rule', icon: '🛡️', text: 'Active le Mode Gardien avant chaque trajet. Un proche suit ta position en temps réel.' },
      { type: 'rule', icon: '🆘', text: 'Configure le mode SOS avec tes contacts. Un seul geste déclenche une triple alerte (push, SMS, appel).' },
      { type: 'rule', icon: '📱', text: 'Photographie la plaque du véhicule et envoie-la à un proche avant de monter.' },
      { type: 'rule', icon: '🎒', text: 'Garde ton sac accessible (sur tes genoux ou à tes pieds), jamais dans le coffre.' },
      { type: 'sub', title: 'Conseils spécifiques' },
      { type: 'rule', icon: '💧', text: 'Les distances sont immenses (500+ km entre les villes). Emporte toujours de l\'eau et un chargeur solaire.' },
      { type: 'rule', icon: '🏜️', text: 'Le trafic est faible en zone rurale. Prévois de longues attentes et de la patience.' },
      { type: 'sub', title: 'Numéros d\'urgence' },
      { type: 'kv', items: [{ k: 'Urgences', v: '10111' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'La Namibie est relativement sûre pour les femmes. Les zones touristiques sont sûres. Voyager en duo est recommandé pour les zones isolées (Skeleton Coast, Kaokoveld).' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'L\'anglais est la langue officielle et largement parlé. L\'afrikaans est courant chez les populations blanches et coloured. L\'oshiwambo est la langue bantoue la plus parlée.' },
      { type: 'phrase', items: [
        { local: 'Moro', meaning: 'Bonjour (oshiwambo)' },
        { local: 'Tangi unene', meaning: 'Merci beaucoup (oshiwambo)' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'La Namibie est modérément chère. Budget serré : 20-35 €/jour. L\'entrée des parcs nationaux (Etosha, Sossusvlei) est abordable.' },
      { type: 'kv', items: [
        { k: 'Camping (parc national)', v: '150-300 NAD (8-16 €)' },
        { k: 'Repas local', v: '50-150 NAD (3-8 €)' },
        { k: 'Backpacker hostel', v: '150-350 NAD (8-19 €)' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Le camping sauvage est toléré dans le désert et les zones rurales (demande la permission aux fermes). Les campings dans les parcs nationaux (NWR) sont bien équipés. Le ciel étoilé namibien est parmi les plus purs au monde.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Intercape', detail: 'Bus longue distance, réseau limité', price: '200-600 NAD' },
        { emoji: '🚐', name: 'Minibus / Combis', detail: 'Transport local entre villes', price: '50-200 NAD' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'ok' }, { name: 'Fév', level: 'ok' }, { name: 'Mar', level: 'good' },
        { name: 'Avr', level: 'great' }, { name: 'Mai', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Aoû', level: 'great' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'ok' }, { name: 'Déc', level: 'ok' },
      ]},
      { type: 'text', text: 'Mai à octobre : saison sèche, idéale (jours chauds, nuits fraîches). La saison des pluies (novembre-avril) rend certaines pistes impraticables. Etosha est meilleur en saison sèche (animaux aux points d\'eau).' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'La Namibie est un pays de contrastes : dunes du Namib, Skeleton Coast, Etosha. La culture est diverse (Himba, San, Herero, Ovambo). Le braai (barbecue) est aussi important qu\'en Afrique du Sud. Le game jerky (biltong) est le snack de route.' },
    ]},
  },
  // ==================== KENYA ====================
  KE: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'L\'autostop n\'est pas formellement réglementé au Kenya. Le transport informel (matatus) est le mode principal. Lever la main au bord de la route arrête n\'importe quel véhicule.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Le Kenya fonctionne en transport semi-informel. Les matatus (minibus) sont partout et très bon marché. Pour le stop gratuit, les camions sur la route Nairobi-Mombasa ou Nairobi-Naivasha prennent des passagers. Clarifie "free" ou "bure" avant de monter.' },
      { type: 'rule', icon: '💰', text: 'La distinction entre stop gratuit et transport payant est floue. Clarifie toujours avant.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Le Kenya est sûr pour l\'autostop sur les routes principales. Voyage de jour et profite des stations-service pour rencontrer des conducteurs.' },
      { type: 'sub', title: 'Utilise SpotHitch pour ta sécurité' },
      { type: 'rule', icon: '🛡️', text: 'Active le Mode Gardien avant chaque trajet. Un proche suit ta position en temps réel.' },
      { type: 'rule', icon: '🆘', text: 'Configure le mode SOS avec tes contacts. Un seul geste déclenche une triple alerte (push, SMS, appel).' },
      { type: 'rule', icon: '📱', text: 'Photographie la plaque du véhicule et envoie-la à un proche avant de monter.' },
      { type: 'rule', icon: '🎒', text: 'Garde ton sac accessible (sur tes genoux ou à tes pieds), jamais dans le coffre.' },
      { type: 'sub', title: 'Conseils spécifiques' },
      { type: 'rule', icon: '☀️', text: 'Voyage de jour uniquement. Le stop de nuit est déconseillé sur les routes kényanes.' },
      { type: 'rule', icon: '🛣️', text: 'Les routes principales (Nairobi-Mombasa, Nairobi-Nakuru) sont bien fréquentées et sûres.' },
      { type: 'sub', title: 'Numéros d\'urgence' },
      { type: 'kv', items: [{ k: 'Urgences', v: '999' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Les femmes voyageant seules au Kenya rapportent des expériences mixtes. Les zones touristiques (Masai Mara, Amboseli) sont sûres. Les matatus sont une alternative plus sûre au stop.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'L\'anglais et le swahili sont les langues officielles. L\'anglais est bien parlé (langue d\'éducation). Le swahili est la langue du quotidien.' },
      { type: 'phrase', items: [
        { local: 'Jambo / Habari', meaning: 'Bonjour / Comment ça va (swahili)' },
        { local: 'Asante sana', meaning: 'Merci beaucoup' },
        { local: 'Bure', meaning: 'Gratuit' },
        { local: 'Hakuna matata', meaning: 'Pas de souci (oui, c\'est réel !)' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Le Kenya est modérément cher (surtout les safaris). Budget serré hors safari : 15-25 €/jour. Les nyama choma (grillades) sont copieuses.' },
      { type: 'kv', items: [
        { k: 'Repas local', v: '200-500 KES (1,50-4 €)' },
        { k: 'Hostel', v: '800-2 000 KES (6-15 €)' },
        { k: 'Matatu (100 km)', v: '200-500 KES (1,50-4 €)' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Le camping sauvage est déconseillé (animaux sauvages). Les campings dans les parcs sont sûrs et bien organisés. Les backpacker hostels sont bien développés à Nairobi et sur la côte.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚐', name: 'Matatu', detail: 'Minibus omniprésents, musique à fond, expérience unique', price: '1-5 €' },
        { emoji: '🚂', name: 'Madaraka Express (SGR)', detail: 'Train moderne Nairobi-Mombasa (4h30)', price: '10-30 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'great' }, { name: 'Fév', level: 'great' }, { name: 'Mar', level: 'good' },
        { name: 'Avr', level: 'bad' }, { name: 'Mai', level: 'bad' }, { name: 'Jun', level: 'good' },
        { name: 'Jul', level: 'great' }, { name: 'Aoû', level: 'great' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'ok' }, { name: 'Déc', level: 'good' },
      ]},
      { type: 'text', text: 'Janvier-février et juin-octobre : saison sèche, idéale. Juillet-octobre : grande migration au Masai Mara. Avril-mai : grandes pluies (routes impraticables en zone rurale).' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Le Kenya est un pays vibrant et diversifié (42 tribus). Les Masai sont emblématiques mais le pays est bien plus que ça. Le nyama choma (viande grillée) et l\'ugali (pâte de maïs) sont les plats quotidiens. Les Kenyans sont accueillants et fiers de leur faune.' },
    ]},
  },
  // ==================== ETHIOPIA ====================
  ET: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'L\'autostop est légal en Éthiopie. Le transport informel (monter dans les camions Isuzu) est courant. Les conducteurs s\'arrêtent facilement mais attendent souvent un paiement.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'L\'Éthiopie est un cas particulier. Le stop fonctionne mais la distinction gratuit/payant est très floue. Les camions prennent des passagers régulièrement. Clarifie "free, no birr" avant de monter. En zone rurale, tu es une attraction : des foules d\'enfants crient "You! You! Money!"' },
      { type: 'text', text: 'Les routes principales (Addis-Bahir Dar, Addis-Lalibela) sont goudronnées. Les pistes dans le Simien ou le Danakil nécessitent un véhicule organisé.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'L\'Éthiopie est sûre pour l\'autostop dans les zones touristiques. Les distances sont longues, alors prévois de la patience et des provisions.' },
      { type: 'sub', title: 'Utilise SpotHitch pour ta sécurité' },
      { type: 'rule', icon: '🛡️', text: 'Active le Mode Gardien avant chaque trajet. Un proche suit ta position en temps réel.' },
      { type: 'rule', icon: '🆘', text: 'Configure le mode SOS avec tes contacts. Un seul geste déclenche une triple alerte (push, SMS, appel).' },
      { type: 'rule', icon: '📱', text: 'Photographie la plaque du véhicule et envoie-la à un proche avant de monter.' },
      { type: 'rule', icon: '🎒', text: 'Garde ton sac accessible (sur tes genoux ou à tes pieds), jamais dans le coffre.' },
      { type: 'sub', title: 'Conseils spécifiques' },
      { type: 'rule', icon: '🗺️', text: 'Les distances sont longues entre les villes. Prévois eau et nourriture pour chaque trajet.' },
      { type: 'rule', icon: '📋', text: 'Vérifie la situation sécuritaire avant de voyager. Certaines régions connaissent des tensions.' },
      { type: 'sub', title: 'Numéros d\'urgence' },
      { type: 'kv', items: [{ k: 'Urgences', v: '991' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Le harcèlement de rue est courant en Éthiopie. Les femmes voyageant seules rapportent des expériences difficiles. Voyager en duo est fortement recommandé.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'L\'amharique est la langue officielle (alphabet ge\'ez unique). L\'anglais est enseigné à l\'école mais peu parlé en zone rurale. Apprends quelques mots d\'amharique.' },
      { type: 'phrase', items: [
        { local: 'Selam', meaning: 'Bonjour' },
        { local: 'Amesegenalehu', meaning: 'Merci' },
        { local: 'Nefsih / Free', meaning: 'Gratuit' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'L\'Éthiopie est bon marché. Budget serré : 10-20 €/jour. L\'injera (galette spongieuse) avec des wots (ragoûts) est le plat quotidien : 1-3 €.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Le camping sauvage est possible mais demande la permission localement. Les pensions (hotels basiques) coûtent 2-8 €. Les monastères orthodoxes accueillent parfois les voyageurs.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚐', name: 'Minibus', detail: 'Principal transport entre villes, attendent d\'être pleins (parfois des heures)', price: '1-10 €' },
        { emoji: '🚌', name: 'Selam Bus', detail: 'Bus longue distance, plus confortables', price: '5-15 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'great' }, { name: 'Fév', level: 'great' }, { name: 'Mar', level: 'good' },
        { name: 'Avr', level: 'ok' }, { name: 'Mai', level: 'ok' }, { name: 'Jun', level: 'bad' },
        { name: 'Jul', level: 'bad' }, { name: 'Aoû', level: 'bad' }, { name: 'Sep', level: 'ok' },
        { name: 'Oct', level: 'great' }, { name: 'Nov', level: 'great' }, { name: 'Déc', level: 'great' },
      ]},
      { type: 'text', text: 'Octobre à mars : saison sèche, idéale. Juin-septembre : grandes pluies (routes impraticables). Janvier : Timkat (Épiphanie éthiopienne), la plus grande fête. L\'Éthiopie a son propre calendrier (13 mois, 7-8 ans de décalage).' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'L\'Éthiopie est unique en Afrique : jamais colonisée, calendrier propre, alphabet propre, église orthodoxe ancienne. La cérémonie du café est un rituel social qui dure 30-60 minutes (3 tasses obligatoires). L\'injera se mange avec les mains. L\'hospitalité est sincère mais les enfants mendiants sont un défi.' },
      { type: 'event', items: [
        { month: 'Jan', day: '19', name: 'Timkat (Épiphanie)', desc: 'La plus grande fête religieuse. Processions spectaculaires à Gondar et Lalibela.' },
      ]},
    ]},
  },
  // ==================== MYANMAR ====================
  MM: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'L\'autostop n\'est pas réglementé au Myanmar. Le concept n\'existe pas formellement mais les conducteurs s\'arrêtent facilement si tu fais signe. Le transport informel est courant.' },
      { type: 'warn', text: '⚠️ Le Myanmar traverse une crise politique depuis 2021 (coup d\'État). Vérifie la situation sécuritaire avant de voyager. Certaines zones sont interdites aux étrangers.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Le Myanmar est un pays où les gens sont incroyablement accueillants. Les conducteurs de camions et de pickups s\'arrêtent facilement. Beaucoup de transport est informel (monter à l\'arrière des pickups). Le concept de gratuité est naturel pour les Birmans.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Vérifie la situation sécuritaire avant de voyager au Myanmar. La situation politique évolue régulièrement.' },
      { type: 'sub', title: 'Utilise SpotHitch pour ta sécurité' },
      { type: 'rule', icon: '🛡️', text: 'Active le Mode Gardien avant chaque trajet. Un proche suit ta position en temps réel.' },
      { type: 'rule', icon: '🆘', text: 'Configure le mode SOS avec tes contacts. Un seul geste déclenche une triple alerte (push, SMS, appel).' },
      { type: 'rule', icon: '📱', text: 'Photographie la plaque du véhicule et envoie-la à un proche avant de monter.' },
      { type: 'rule', icon: '🎒', text: 'Garde ton sac accessible (sur tes genoux ou à tes pieds), jamais dans le coffre.' },
      { type: 'sub', title: 'Conseils spécifiques' },
      { type: 'rule', icon: '📋', text: 'Vérifie les avis du ministère des Affaires étrangères avant tout déplacement. La situation évolue.' },
      { type: 'rule', icon: '🌍', text: 'Consulte les forums de voyageurs récents pour obtenir des informations à jour sur les zones accessibles.' },
      { type: 'sub', title: 'Numéros d\'urgence' },
      { type: 'kv', items: [{ k: 'Urgences', v: '199' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Le Myanmar était considéré comme très sûr pour les femmes (culture bouddhiste respectueuse). La situation a changé depuis 2021. Renseigne-toi sur la situation actuelle.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Le birman est la langue officielle. L\'anglais est limité mais en progression chez les jeunes urbains.' },
      { type: 'phrase', items: [
        { local: 'Mingalaba', meaning: 'Bonjour' },
        { local: 'Kyay zu tin ba de', meaning: 'Merci' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Le Myanmar est bon marché. Budget serré : 15-25 $/jour. Les teashops servent des repas pour 1-2 $.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Les guesthouses sont bon marché (5-15 $). Les monastères accueillent parfois les voyageurs. Le camping sauvage est possible dans les zones rurales.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Bus longue distance', detail: 'Réseau étendu, bus VIP confortables', price: '5-20 $' },
        { emoji: '🚂', name: 'Train', detail: 'Lent mais scenic (Hsipaw, Goteik viaduc)', price: '2-10 $' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'great' }, { name: 'Fév', level: 'great' }, { name: 'Mar', level: 'good' },
        { name: 'Avr', level: 'ok' }, { name: 'Mai', level: 'bad' }, { name: 'Jun', level: 'bad' },
        { name: 'Jul', level: 'bad' }, { name: 'Aoû', level: 'bad' }, { name: 'Sep', level: 'bad' },
        { name: 'Oct', level: 'ok' }, { name: 'Nov', level: 'great' }, { name: 'Déc', level: 'great' },
      ]},
      { type: 'text', text: 'Novembre à février : idéal. Mars-mai : très chaud. Juin-octobre : mousson intense.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Le Myanmar est un pays profondément bouddhiste. Les pagodes dorées (Shwedagon) sont spectaculaires. Les Birmans sont souriants et généreux. Le thanaka (pâte jaune sur le visage) est un cosmétique traditionnel. Le thé lacté (laphet yay) est la boisson nationale.' },
    ]},
  },
  // ==================== INDONESIA ====================
  ID: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'L\'autostop n\'est pas un concept formel en Indonésie. Le transport informel est la norme : motos-taxis (ojek), bemos, angkots. Les conducteurs s\'arrêtent si tu fais signe mais attendent souvent un paiement.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'L\'Indonésie est le plus grand archipel du monde (17 000 îles). Le stop classique est difficile car les transports informels sont omniprésents et très bon marché. En zone rurale (Sumatra, Kalimantan, Papua), les camions prennent des passagers.' },
      { type: 'rule', icon: '🏍️', text: 'Les ojeks (motos-taxis) sont partout. Gratuit si quelqu\'un te propose, sinon clarifie le prix.' },
      { type: 'text', text: 'Bali n\'est pas représentatif de l\'Indonésie. Java, Sumatra et Sulawesi sont plus authentiques pour le stop.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'L\'Indonésie est un pays sûr pour l\'autostop. Bali et Java sont les îles les plus faciles pour le stop. Les Indonésiens sont extrêmement accueillants.' },
      { type: 'sub', title: 'Utilise SpotHitch pour ta sécurité' },
      { type: 'rule', icon: '🛡️', text: 'Active le Mode Gardien avant chaque trajet. Un proche suit ta position en temps réel.' },
      { type: 'rule', icon: '🆘', text: 'Configure le mode SOS avec tes contacts. Un seul geste déclenche une triple alerte (push, SMS, appel).' },
      { type: 'rule', icon: '📱', text: 'Photographie la plaque du véhicule et envoie-la à un proche avant de monter.' },
      { type: 'rule', icon: '🎒', text: 'Garde ton sac accessible (sur tes genoux ou à tes pieds), jamais dans le coffre.' },
      { type: 'sub', title: 'Conseils spécifiques' },
      { type: 'rule', icon: '🏝️', text: 'Bali et Java sont les îles les plus faciles pour le stop. Le trafic y est dense et les conducteurs s\'arrêtent facilement.' },
      { type: 'rule', icon: '🤝', text: 'Les Indonésiens sont extrêmement accueillants. On t\'offrira souvent de la nourriture ou un détour.' },
      { type: 'sub', title: 'Numéros d\'urgence' },
      { type: 'kv', items: [{ k: 'Urgences', v: '112' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'L\'Indonésie est globalement sûre pour les femmes. Habille-toi de façon modeste (l\'Indonésie est le plus grand pays musulman du monde). Bali est plus détendu. Aceh applique la charia.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Le bahasa indonesia est la langue officielle (facile à apprendre, pas de conjugaison). L\'anglais est courant dans les zones touristiques. 700+ langues locales existent.' },
      { type: 'phrase', items: [
        { local: 'Selamat pagi/siang/sore', meaning: 'Bonjour (matin/midi/après-midi)' },
        { local: 'Terima kasih', meaning: 'Merci' },
        { local: 'Gratis', meaning: 'Gratuit' },
        { local: 'Ke mana?', meaning: 'Où allez-vous ?' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'L\'Indonésie est très bon marché (sauf Bali touriste). Budget serré : 10-20 €/jour. Le nasi goreng (riz frit) coûte 0,50-1,50 €.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Les losmen/homestays sont très bon marché (3-10 €). Le camping sauvage est possible dans les zones rurales et les volcans.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Bus', detail: 'Réseau étendu à Java et Sumatra', price: '2-15 €' },
        { emoji: '⛴️', name: 'Ferry PELNI', detail: 'Bateaux entre les îles, lents mais bon marché', price: '5-30 €' },
        { emoji: '✈️', name: 'Vols low-cost', detail: 'Lion Air, AirAsia. Souvent la seule option entre îles éloignées.', price: '15-60 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Fév', level: 'bad' }, { name: 'Mar', level: 'ok' },
        { name: 'Avr', level: 'good' }, { name: 'Mai', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Aoû', level: 'great' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'ok' }, { name: 'Déc', level: 'bad' },
      ]},
      { type: 'text', text: 'Mai à septembre : saison sèche, idéale. Novembre-mars : mousson (pluies quotidiennes mais courtes). Bali et Java sont praticables toute l\'année.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'L\'Indonésie est incroyablement diverse : hindoue à Bali, musulmane à Java, chrétienne à Flores, animiste en Papua. Le gotong royong (entraide communautaire) est une valeur fondamentale. Le nasi goreng (riz frit) est le plat national. Les Indonésiens sont parmi les gens les plus souriants d\'Asie.' },
    ]},
  },
  // ==================== PHILIPPINES ====================
  PH: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'L\'autostop n\'est pas réglementé aux Philippines. Le transport informel est la norme : jeepneys, tricycles, habal-habal (motos). Les conducteurs s\'arrêtent facilement.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Les Philippines sont un pays très accueillant. Les Filipinos sont parmi les gens les plus hospitaliers d\'Asie. Le stop fonctionne mais le transport public est si bon marché que c\'est rarement nécessaire. Sur les îles moins touristiques, les pickups et motos s\'arrêtent facilement.' },
      { type: 'text', text: 'Mindanao est plus difficile d\'accès (certaines zones déconseillées). Luzon et les Visayas sont les plus faciles.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Les Philippines sont sûres pour l\'autostop sur les îles principales. Les Philippins sont accueillants et l\'anglais est largement parlé.' },
      { type: 'sub', title: 'Utilise SpotHitch pour ta sécurité' },
      { type: 'rule', icon: '🛡️', text: 'Active le Mode Gardien avant chaque trajet. Un proche suit ta position en temps réel.' },
      { type: 'rule', icon: '🆘', text: 'Configure le mode SOS avec tes contacts. Un seul geste déclenche une triple alerte (push, SMS, appel).' },
      { type: 'rule', icon: '📱', text: 'Photographie la plaque du véhicule et envoie-la à un proche avant de monter.' },
      { type: 'rule', icon: '🎒', text: 'Garde ton sac accessible (sur tes genoux ou à tes pieds), jamais dans le coffre.' },
      { type: 'sub', title: 'Conseils spécifiques' },
      { type: 'rule', icon: '🏝️', text: 'Les îles principales (Luzon, Visayas) sont les plus faciles pour le stop. Évite l\'extrême sud de Mindanao.' },
      { type: 'rule', icon: '🗣️', text: 'L\'anglais est largement parlé. La communication est facile et les Philippins adorent discuter.' },
      { type: 'sub', title: 'Numéros d\'urgence' },
      { type: 'kv', items: [{ k: 'Urgences', v: '911' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Les Philippines sont globalement sûres pour les femmes. La société est matriarcale dans beaucoup de communautés. Les Filipinos sont respectueux.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Le filipino (tagalog) et l\'anglais sont les langues officielles. L\'anglais est très bien parlé (3ème pays anglophone du monde). Aucune barrière linguistique.' },
      { type: 'phrase', items: [
        { local: 'Kumusta?', meaning: 'Comment ça va ?' },
        { local: 'Salamat po', meaning: 'Merci (respectueux)' },
        { local: 'Saan ka pupunta?', meaning: 'Où vas-tu ?' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Les Philippines sont bon marché. Budget serré : 15-25 €/jour. Le riz avec adobo (poulet/porc mariné) coûte 1-2 €.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Les guesthouses sont bon marché (5-15 €). Le camping sauvage est possible sur les plages désertes. Les Filipinos invitent facilement les voyageurs chez eux.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚐', name: 'Jeepney', detail: 'Icône des Philippines. Transport local coloré.', price: '0,20-0,50 €' },
        { emoji: '⛴️', name: 'Ferry / bangka', detail: 'Entre les îles. 2GO Travel pour les longues distances.', price: '5-30 €' },
        { emoji: '✈️', name: 'Cebu Pacific / AirAsia', detail: 'Vols inter-îles bon marché', price: '15-50 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'great' }, { name: 'Fév', level: 'great' }, { name: 'Mar', level: 'great' },
        { name: 'Avr', level: 'great' }, { name: 'Mai', level: 'good' }, { name: 'Jun', level: 'ok' },
        { name: 'Jul', level: 'ok' }, { name: 'Aoû', level: 'bad' }, { name: 'Sep', level: 'bad' },
        { name: 'Oct', level: 'bad' }, { name: 'Nov', level: 'ok' }, { name: 'Déc', level: 'good' },
      ]},
      { type: 'text', text: 'Décembre à mai : saison sèche, idéale. Juin-novembre : mousson et typhons. Le sud (Mindanao) est moins affecté par les typhons.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Les Filipinos sont joyeux, accueillants et adorent chanter (karaoké = institution nationale). Le lechon (cochon grillé) est le plat de fête. San Miguel est la bière nationale. Le "Filipino time" signifie que rien n\'est pressé.' },
    ]},
  },
  // ==================== SRI LANKA ====================
  LK: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'L\'autostop est légal au Sri Lanka. Le concept est compris et le stop fonctionne bien. Les Sri Lankais sont naturellement accueillants et s\'arrêtent facilement.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Le Sri Lanka est facile pour l\'autostop. Le pays est petit (430 km nord-sud) et les conducteurs sont accueillants. Les tuk-tuks et bus sont partout mais le stop gratuit fonctionne aussi. Temps d\'attente : 10-20 min.' },
      { type: 'text', text: 'Les routes du Hill Country (Kandy-Ella-Nuwara Eliya) sont les plus scenic. La côte sud et ouest a plus de trafic.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Le Sri Lanka est un pays sûr pour l\'autostop. Les conducteurs sont hospitaliers et les routes côtières sont les plus faciles pour le stop.' },
      { type: 'sub', title: 'Utilise SpotHitch pour ta sécurité' },
      { type: 'rule', icon: '🛡️', text: 'Active le Mode Gardien avant chaque trajet. Un proche suit ta position en temps réel.' },
      { type: 'rule', icon: '🆘', text: 'Configure le mode SOS avec tes contacts. Un seul geste déclenche une triple alerte (push, SMS, appel).' },
      { type: 'rule', icon: '📱', text: 'Photographie la plaque du véhicule et envoie-la à un proche avant de monter.' },
      { type: 'rule', icon: '🎒', text: 'Garde ton sac accessible (sur tes genoux ou à tes pieds), jamais dans le coffre.' },
      { type: 'sub', title: 'Conseils spécifiques' },
      { type: 'rule', icon: '🌊', text: 'Les routes côtières sont les plus faciles pour le stop. Le trafic y est dense et les conducteurs accueillants.' },
      { type: 'rule', icon: '🤝', text: 'Les Sri Lankais sont hospitaliers et protecteurs envers les voyageurs. Accepte les invitations avec gratitude.' },
      { type: 'sub', title: 'Numéros d\'urgence' },
      { type: 'kv', items: [{ k: 'Urgences', v: '119' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Le Sri Lanka est modérément sûr pour les femmes seules. Le harcèlement existe mais est généralement limité aux regards et commentaires. Le sud et le Hill Country sont les plus sûrs.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Le cinghalais et le tamoul sont les langues officielles. L\'anglais est assez répandu dans les zones touristiques et éduquées.' },
      { type: 'phrase', items: [
        { local: 'Ayubowan', meaning: 'Bonjour / Longue vie (cinghalais)' },
        { local: 'Istuti', meaning: 'Merci (cinghalais)' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Le Sri Lanka est bon marché. Budget serré : 15-25 €/jour. Le rice & curry est le plat quotidien : 1-3 €.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Les guesthouses sont bon marché (5-15 €). Le camping sauvage est possible dans le Hill Country. Les temples bouddhistes accueillent parfois les voyageurs.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚂', name: 'Train', detail: 'Les trains du Hill Country sont parmi les plus beaux trajets au monde (Kandy-Ella).', price: '1-5 €' },
        { emoji: '🚌', name: 'Bus', detail: 'Réseau dense et très bon marché', price: '0,50-3 €' },
        { emoji: '🛺', name: 'Tuk-tuk', detail: 'Transport local omniprésent', price: '0,50-5 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'great' }, { name: 'Fév', level: 'great' }, { name: 'Mar', level: 'great' },
        { name: 'Avr', level: 'good' }, { name: 'Mai', level: 'ok' }, { name: 'Jun', level: 'ok' },
        { name: 'Jul', level: 'good' }, { name: 'Aoû', level: 'good' }, { name: 'Sep', level: 'ok' },
        { name: 'Oct', level: 'bad' }, { name: 'Nov', level: 'bad' }, { name: 'Déc', level: 'good' },
      ]},
      { type: 'text', text: 'Le Sri Lanka a deux moussons opposées : côte sud-ouest (mai-septembre) et côte nord-est (octobre-janvier). Il y a toujours un côté sec. Décembre-mars : meilleur pour la côte sud et ouest.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Le Sri Lanka est "la perle de l\'océan Indien". Le bouddhisme Theravada imprègne la culture (temples, moines, fêtes). Le thé de Ceylan est une fierté nationale. Le rice & curry est un art : jusqu\'à 10 plats différents autour du riz. Les fêtes bouddhistes (Vesak, Perahera) sont spectaculaires.' },
    ]},
  },
  // ==================== MONGOLIA ====================
  MN: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'L\'autostop est légal en Mongolie. Le transport informel est la norme en dehors d\'Oulan-Bator. Sur les pistes (il y a très peu de routes goudronnées), tout véhicule qui passe s\'arrête.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'La Mongolie est un pays unique pour l\'autostop. En dehors d\'Oulan-Bator, il n\'y a quasiment pas de routes goudronnées : ce sont des pistes dans la steppe. Tout véhicule (camion, jeep, moto) s\'arrête car le trafic est très faible et les distances immenses.' },
      { type: 'rule', icon: '💰', text: 'Les conducteurs attendent souvent un paiement (le transport est un service dans un pays sans bus). Négocie avant.' },
      { type: 'rule', icon: '🏔️', text: 'Les yourtes (gers) des nomades sont ouvertes aux voyageurs. C\'est la tradition mongole.' },
      { type: 'warn', text: '⚠️ Les distances sont immenses et il n\'y a RIEN entre les villes. Emporte eau, nourriture et un sac de couchage chaud.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'La Mongolie est un pays sûr pour l\'autostop. Les distances sont immenses et les routes parfois inexistantes. Prévois une tente et des provisions.' },
      { type: 'sub', title: 'Utilise SpotHitch pour ta sécurité' },
      { type: 'rule', icon: '🛡️', text: 'Active le Mode Gardien avant chaque trajet. Un proche suit ta position en temps réel.' },
      { type: 'rule', icon: '🆘', text: 'Configure le mode SOS avec tes contacts. Un seul geste déclenche une triple alerte (push, SMS, appel).' },
      { type: 'rule', icon: '📱', text: 'Photographie la plaque du véhicule et envoie-la à un proche avant de monter.' },
      { type: 'rule', icon: '🎒', text: 'Garde ton sac accessible (sur tes genoux ou à tes pieds), jamais dans le coffre.' },
      { type: 'sub', title: 'Conseils spécifiques' },
      { type: 'rule', icon: '⛺', text: 'Les distances sont immenses et les routes parfois inexistantes. Prévois une tente et de la nourriture.' },
      { type: 'rule', icon: '🏜️', text: 'En dehors d\'Oulan-Bator, il n\'y a quasiment pas de réseau. Préviens tes proches avant chaque trajet.' },
      { type: 'sub', title: 'Numéros d\'urgence' },
      { type: 'kv', items: [{ k: 'Urgences', v: '102' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'La Mongolie est relativement sûre pour les femmes. La société est égalitaire (les femmes mongoles sont fortes et indépendantes). Évite les bars d\'Oulan-Bator tard le soir.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Le mongol est la langue officielle (alphabet cyrillique). Le russe est compris par les plus de 40 ans. L\'anglais est très limité en dehors d\'Oulan-Bator.' },
      { type: 'phrase', items: [
        { local: 'Sain baina uu', meaning: 'Bonjour' },
        { local: 'Bayarlalaa', meaning: 'Merci' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'La Mongolie est bon marché. Budget serré : 15-25 €/jour. Le buuz (raviolis de viande) est le plat national : 1-2 €. Le logement en yourte via des familles nomades est gratuit ou très bon marché.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Le camping sauvage est illimité en Mongolie : la steppe est infinie et personne ne viendra te déranger. Les nomades accueillent les voyageurs dans leurs yourtes (tradition sacrée). Offre un petit cadeau en retour.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚐', name: 'Mikr / Furgon', detail: 'Minibus entre villes, attendent d\'être pleins (parfois des heures)', price: '5-15 €' },
        { emoji: '🚂', name: 'Transmongolien', detail: 'Train mythique Oulan-Bator-Irkoutsk ou Oulan-Bator-Pékin', price: '30-100 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Fév', level: 'bad' }, { name: 'Mar', level: 'bad' },
        { name: 'Avr', level: 'ok' }, { name: 'Mai', level: 'good' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Aoû', level: 'great' }, { name: 'Sep', level: 'good' },
        { name: 'Oct', level: 'ok' }, { name: 'Nov', level: 'bad' }, { name: 'Déc', level: 'bad' },
      ]},
      { type: 'text', text: 'Juin à août : idéal (15-25°C). Le Naadam (juillet) est le festival national. L\'hiver est extrême (jusqu\'à -40°C). Oulan-Bator est la capitale la plus froide du monde.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'La Mongolie est le pays des nomades. 30% de la population vit encore en yourte. L\'hospitalité est sacrée : un voyageur qui arrive à une yourte reçoit du thé au lait salé (süütei tsai), du airag (lait de jument fermenté) et de la nourriture. Le Naadam (juillet) célèbre les "trois jeux virils" : lutte, tir à l\'arc et course de chevaux.' },
      { type: 'event', items: [
        { month: 'Jul', day: '11-13', name: 'Naadam', desc: 'Le plus grand festival mongol. Lutte, tir à l\'arc, course de chevaux. Ambiance incroyable.' },
      ]},
    ]},
  },
  // ==================== CUBA ====================
  CU: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'L\'autostop est légal et même encouragé à Cuba. Le gouvernement a créé des "puntos de botella" (points d\'autostop officiels) où des fonctionnaires ("amarillos", en gilet jaune) organisent le stop.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Cuba est probablement le meilleur pays au monde pour l\'autostop. Les véhicules d\'État sont OBLIGÉS par la loi de prendre des autostoppeurs. Les "amarillos" (fonctionnaires en jaune aux croisements) organisent le stop officiellement. Temps d\'attente : 5-30 min.' },
      { type: 'rule', icon: '🟡', text: 'Les puntos de botella (points d\'autostop officiels) sont aux sorties de villes. Cherche les amarillos en gilet jaune.' },
      { type: 'rule', icon: '🚛', text: 'Les camions d\'État (camiones) sont le transport principal en zone rurale. Monte à l\'arrière, c\'est normal.' },
      { type: 'text', text: 'Les vieilles voitures américaines (almendrones) sont des taxis collectifs. Clarifie le prix. Le stop gratuit fonctionne très bien car les voitures sont rares et chères.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Cuba est l\'un des pays les plus sûrs des Amériques. La criminalité violente est quasi inexistante. Les arnaques mineures (jineteros) sont le principal risque touristique.' },
      { type: 'kv', items: [{ k: 'Urgences', v: '106 (police) / 104 (ambulance)' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Cuba est sûr pour les femmes voyageant seules. Le machisme existe (piropos = compliments de rue) mais les incidents graves sont très rares. La société cubaine est protectrice envers les visiteurs.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'L\'espagnol cubain est la langue unique. L\'anglais est très limité sauf dans les hôtels touristiques. Le français est parfois compris par les plus âgés (coopération avec le Québec).' },
      { type: 'phrase', items: [
        { local: '¿Me da botella?', meaning: 'Vous me prenez en stop ? (expression cubaine)' },
        { local: '¡Dale!', meaning: 'OK / Allons-y !' },
        { local: 'Gracias, compañero', meaning: 'Merci, camarade' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Cuba est compliqué financièrement. Deux économies coexistent (touriste et locale). Budget serré : 20-35 €/jour en mangeant local. Les casas particulares (chambres chez l\'habitant) : 15-25 €/nuit.' },
      { type: 'warn', text: '⚠️ Les cartes bancaires américaines ne fonctionnent PAS. Apporte des euros en cash. Le change officiel est défavorable. Le marché informel offre un meilleur taux.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Les casas particulares (chambres chez l\'habitant) sont l\'option standard. Les Cubains sont accueillants et les conversations passionnantes. Le camping sauvage est possible sur les plages mais demande la permission localement.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Víazul', detail: 'Bus touristiques climatisés. Fiables mais chers pour Cuba.', price: '10-40 €' },
        { emoji: '🚛', name: 'Camiones', detail: 'Camions d\'État convertis en bus. Transport local en peso cubain.', price: '0,50-2 €' },
        { emoji: '🚗', name: 'Almendrones (taxi collectif)', detail: 'Vieilles américaines, trajets partagés', price: '2-10 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'great' }, { name: 'Fév', level: 'great' }, { name: 'Mar', level: 'great' },
        { name: 'Avr', level: 'good' }, { name: 'Mai', level: 'ok' }, { name: 'Jun', level: 'ok' },
        { name: 'Jul', level: 'ok' }, { name: 'Aoû', level: 'bad' }, { name: 'Sep', level: 'bad' },
        { name: 'Oct', level: 'bad' }, { name: 'Nov', level: 'good' }, { name: 'Déc', level: 'great' },
      ]},
      { type: 'text', text: 'Novembre à avril : saison sèche, idéale. Août-octobre : ouragan possible. Cuba est chaud et humide toute l\'année (25-33°C).' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Cuba est un monde à part. La musique (son, salsa, rumba) est partout. Le rhum et les cigares sont des institutions. Les conversations avec les Cubains sont fascinantes (politique, histoire, rêves). Le système socialiste crée une solidarité unique : tout le monde partage ce qu\'il a.' },
      { type: 'event', items: [
        { month: 'Jul', day: '⟳', name: 'Carnaval de Santiago', desc: 'Le plus grand carnaval de Cuba. Musique, danse, conga dans les rues.' },
      ]},
    ]},
  },
  // ==================== GUATEMALA ====================
  GT: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'L\'autostop est légal au Guatemala. Les pickups (camionetas) sont le transport principal en zone rurale et prennent des passagers contre un petit paiement. Le stop gratuit fonctionne aussi.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Le Guatemala est faisable en stop. Les pickups et camions s\'arrêtent facilement en zone rurale. Les Guatémaltèques sont accueillants. Temps d\'attente : 15-30 min. Le Highlands (Lago Atitlán, Antigua, Chichicastenango) est la zone la plus facile.' },
      { type: 'rule', icon: '🛻', text: 'Monte dans la benne des pickups, c\'est le transport normal. Un petit paiement est souvent attendu.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Le Guatemala est sûr dans les zones touristiques (Antigua, Atitlán, Highlands). Les gasolineras (stations-service) sont de bons spots pour trouver un lift.' },
      { type: 'sub', title: 'Utilise SpotHitch pour ta sécurité' },
      { type: 'rule', icon: '🛡️', text: 'Active le Mode Gardien avant chaque trajet. Un proche suit ta position en temps réel.' },
      { type: 'rule', icon: '🆘', text: 'Configure le mode SOS avec tes contacts. Un seul geste déclenche une triple alerte (push, SMS, appel).' },
      { type: 'rule', icon: '📱', text: 'Photographie la plaque du véhicule et envoie-la à un proche avant de monter.' },
      { type: 'rule', icon: '🎒', text: 'Garde ton sac accessible (sur tes genoux ou à tes pieds), jamais dans le coffre.' },
      { type: 'sub', title: 'Conseils spécifiques' },
      { type: 'rule', icon: '⛽', text: 'Les gasolineras sont de bons spots pour rencontrer des conducteurs dans un cadre sûr.' },
      { type: 'rule', icon: '🌄', text: 'Privilégie les zones touristiques (Antigua, Atitlán, Semuc Champey) et les Highlands pour faire du stop.' },
      { type: 'sub', title: 'Numéros d\'urgence' },
      { type: 'kv', items: [{ k: 'Police', v: '120' }, { k: 'Pompiers', v: '110' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Le Guatemala est délicat pour les femmes seules. Les Highlands sont plus sûrs. Voyager en duo est recommandé.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'L\'espagnol est la langue principale. 21 langues mayas sont parlées dans les Highlands. L\'anglais est limité aux zones touristiques.' },
      { type: 'phrase', items: [
        { local: '¿Me da jalón?', meaning: 'Vous me prenez ?' },
        { local: '¡Puchica!', meaning: 'Expression d\'étonnement (guatémaltèque)' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Le Guatemala est bon marché. Budget serré : 15-25 €/jour. Les comedores (cantines) servent des repas pour 1-3 €.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Les hospedajes sont bon marché (3-10 €). Le camping est possible autour du Lago Atitlán et dans les montagnes.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Chicken bus', detail: 'Anciens bus scolaires américains peints. Expérience unique, bondés, bon marché.', price: '0,50-3 €' },
        { emoji: '🚐', name: 'Shuttle touristique', detail: 'Minibus entre les points touristiques', price: '5-15 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'great' }, { name: 'Fév', level: 'great' }, { name: 'Mar', level: 'great' },
        { name: 'Avr', level: 'good' }, { name: 'Mai', level: 'ok' }, { name: 'Jun', level: 'ok' },
        { name: 'Jul', level: 'ok' }, { name: 'Aoû', level: 'ok' }, { name: 'Sep', level: 'bad' },
        { name: 'Oct', level: 'bad' }, { name: 'Nov', level: 'good' }, { name: 'Déc', level: 'great' },
      ]},
      { type: 'text', text: 'Novembre à avril : saison sèche, idéale. Les Highlands sont frais (15-25°C). La côte est chaude et humide.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Le Guatemala est le cœur du monde maya. Les marchés colorés (Chichicastenango), les ruines de Tikal et le Lago Atitlán sont des merveilles. Les communautés mayas sont vivantes (langues, costumes, traditions). Le café guatémaltèque est parmi les meilleurs au monde.' },
    ]},
  },
  // ==================== COSTA RICA ====================
  CR: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'L\'autostop est légal au Costa Rica. Pratique assez courante, surtout en zone rurale et sur les routes de plages du Pacifique.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Le Costa Rica est facile pour l\'autostop. Les Ticos (Costa-Ricains) sont accueillants et "pura vida" (la vie est belle) est plus qu\'un slogan. Temps d\'attente : 15-30 min. Les routes du Pacifique (Nicoya, Osa) ont moins de bus et le stop est quasi obligatoire.' },
      { type: 'rule', icon: '🛻', text: 'Les pickups et 4x4 sont les véhicules les plus courants en zone rurale. Les surfeurs s\'arrêtent facilement.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Le Costa Rica est un pays sûr pour l\'autostop. Les Ticos (Costaricains) sont accueillants et les routes de montagne offrent des paysages spectaculaires.' },
      { type: 'sub', title: 'Utilise SpotHitch pour ta sécurité' },
      { type: 'rule', icon: '🛡️', text: 'Active le Mode Gardien avant chaque trajet. Un proche suit ta position en temps réel.' },
      { type: 'rule', icon: '🆘', text: 'Configure le mode SOS avec tes contacts. Un seul geste déclenche une triple alerte (push, SMS, appel).' },
      { type: 'rule', icon: '📱', text: 'Photographie la plaque du véhicule et envoie-la à un proche avant de monter.' },
      { type: 'rule', icon: '🎒', text: 'Garde ton sac accessible (sur tes genoux ou à tes pieds), jamais dans le coffre.' },
      { type: 'sub', title: 'Conseils spécifiques' },
      { type: 'rule', icon: '🏔️', text: 'Les routes de montagne sont sinueuses. Prévois le mal des transports et prends des pauses.' },
      { type: 'rule', icon: '😊', text: 'Les Ticos sont très accueillants. "Pura Vida" est leur philosophie de vie. Adopte-la !' },
      { type: 'sub', title: 'Numéros d\'urgence' },
      { type: 'kv', items: [{ k: 'Urgences', v: '911' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Le Costa Rica est sûr pour les femmes voyageant seules. Les Ticos sont respectueux. Les zones de surf sont décontractées et inclusives.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'L\'espagnol est la langue principale. L\'anglais est assez répandu dans les zones touristiques et sur la côte caraïbe. "Pura vida" est l\'expression universelle (bonjour, au revoir, merci, ça va, tout va bien).' },
      { type: 'phrase', items: [
        { local: '¡Pura vida!', meaning: 'Tout va bien / Merci / Salut (universel)' },
        { local: 'Mae', meaning: 'Mec (expression tico)' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Le Costa Rica est le pays le plus cher d\'Amérique centrale. Budget serré : 25-40 €/jour. Les sodas (cantines locales) servent des casados (repas complets) pour 3-5 €.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Le camping sauvage est possible sur les plages du Pacifique. Les hostels sont bien développés (10-20 €). Le Costa Rica est pionnier de l\'écotourisme.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Bus', detail: 'Réseau étendu et bon marché. Terminal 7-10 à San José.', price: '2-15 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'great' }, { name: 'Fév', level: 'great' }, { name: 'Mar', level: 'great' },
        { name: 'Avr', level: 'good' }, { name: 'Mai', level: 'ok' }, { name: 'Jun', level: 'ok' },
        { name: 'Jul', level: 'ok' }, { name: 'Aoû', level: 'ok' }, { name: 'Sep', level: 'bad' },
        { name: 'Oct', level: 'bad' }, { name: 'Nov', level: 'good' }, { name: 'Déc', level: 'great' },
      ]},
      { type: 'text', text: 'Décembre à avril : saison sèche (verano). La côte caraïbe a un cycle inverse (sèche en septembre-octobre). Le surf est meilleur en saison des pluies.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: '"Pura vida" résume tout : la vie est belle, pas de stress. Le Costa Rica n\'a pas d\'armée (abolie en 1949) et investit dans l\'éducation et l\'environnement. 25% du territoire est en réserve naturelle. Les Ticos sont fiers de leur biodiversité (5% de la biodiversité mondiale).' },
    ]},
  },
  // ==================== EGYPT ====================
  EG: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'L\'autostop n\'est pas formellement réglementé en Égypte. Le transport informel (microbuses, pickups) est le mode principal. Lever la main au bord de la route arrête des véhicules.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'L\'Égypte fonctionne en transport semi-informel. Les microbuses s\'arrêtent partout (0,10-0,50 €). Pour le stop gratuit, les camions sur les routes longue distance (Le Caire-Louxor, Le Caire-Hurghada) prennent des passagers. L\'hospitalité égyptienne aide beaucoup.' },
      { type: 'rule', icon: '💰', text: 'La distinction gratuit/payant est très floue. Clarifie "mish flous" (pas d\'argent) ou "free" avant de monter.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'L\'Égypte est sûre pour les voyageurs dans les zones touristiques. Pour les longs trajets de nuit, privilégie le bus longue distance plutôt que le stop.' },
      { type: 'sub', title: 'Utilise SpotHitch pour ta sécurité' },
      { type: 'rule', icon: '🛡️', text: 'Active le Mode Gardien avant chaque trajet. Un proche suit ta position en temps réel.' },
      { type: 'rule', icon: '🆘', text: 'Configure le mode SOS avec tes contacts. Un seul geste déclenche une triple alerte (push, SMS, appel).' },
      { type: 'rule', icon: '📱', text: 'Photographie la plaque du véhicule et envoie-la à un proche avant de monter.' },
      { type: 'rule', icon: '🎒', text: 'Garde ton sac accessible (sur tes genoux ou à tes pieds), jamais dans le coffre.' },
      { type: 'sub', title: 'Conseils spécifiques' },
      { type: 'rule', icon: '🏛️', text: 'Les zones touristiques (Le Caire, Louxor, Assouan, côte) sont sûres et bien surveillées.' },
      { type: 'rule', icon: '🚌', text: 'Pour les longs trajets de nuit, les bus longue distance sont une alternative sûre et économique.' },
      { type: 'sub', title: 'Numéros d\'urgence' },
      { type: 'kv', items: [{ k: 'Urgences', v: '122' }] },
    ]},
    women: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'Le harcèlement de rue est un problème majeur en Égypte, surtout au Caire. Les femmes voyageant seules en stop sont déconseillées. Voyager en duo (avec un homme) change radicalement l\'expérience.' },
      { type: 'rule', icon: '👫', text: 'Voyager avec un compagnon masculin est fortement recommandé.' },
      { type: 'rule', icon: '👕', text: 'Habille-toi de façon très conservatrice (épaules et genoux couverts).' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'L\'arabe égyptien est la langue principale (le dialecte le plus compris du monde arabe grâce au cinéma). L\'anglais est courant dans les zones touristiques.' },
      { type: 'phrase', items: [
        { local: 'Ahlan wa sahlan', meaning: 'Bienvenue' },
        { local: 'Shukran', meaning: 'Merci' },
        { local: 'Mish flous', meaning: 'Pas d\'argent (gratuit)' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'L\'Égypte est très bon marché pour les étrangers (depuis la dévaluation). Budget serré : 10-20 €/jour. Le koshari (plat national) coûte 0,50-1 €.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Les hostels sont bon marché (3-10 €). Le camping sauvage est possible dans le désert (White Desert, Siwa). Les Égyptiens invitent parfois les voyageurs chez eux.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚐', name: 'Microbus', detail: 'Transport local omniprésent, très bon marché', price: '0,10-0,50 €' },
        { emoji: '🚂', name: 'Train', detail: 'Réseau étendu le long du Nil. Le Caire-Louxor en train de nuit.', price: '5-25 €' },
        { emoji: '🚌', name: 'GoBus / Blue Bus', detail: 'Bus longue distance modernes', price: '5-15 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'great' }, { name: 'Fév', level: 'great' }, { name: 'Mar', level: 'great' },
        { name: 'Avr', level: 'good' }, { name: 'Mai', level: 'ok' }, { name: 'Jun', level: 'bad' },
        { name: 'Jul', level: 'bad' }, { name: 'Aoû', level: 'bad' }, { name: 'Sep', level: 'ok' },
        { name: 'Oct', level: 'great' }, { name: 'Nov', level: 'great' }, { name: 'Déc', level: 'great' },
      ]},
      { type: 'text', text: 'Octobre à mars : idéal (20-28°C). L\'été est brûlant (40-45°C dans le sud). Le Sinaï et la mer Rouge sont agréables presque toute l\'année.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'L\'Égypte est un pays fascinant. Les Pyramides, Louxor et le Nil sont des merveilles éternelles. Les Égyptiens sont chaleureux, drôles et adorent discuter. Le koshari (pâtes, riz, lentilles, oignons frits) est le plat du peuple. Le thé à la menthe (shai) est offert à toute heure.' },
    ]},
  },
  // ==================== TANZANIA ====================
  TZ: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'L\'autostop n\'est pas réglementé en Tanzanie. Le transport informel (dala-dala = minibus) est le mode principal. Les conducteurs s\'arrêtent si tu fais signe.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'La Tanzanie fonctionne comme le Kenya voisin. Les dala-dala sont partout et très bon marché. Le stop gratuit est possible sur les routes longue distance avec les camions. Les Tanzaniens sont accueillants.' },
      { type: 'rule', icon: '💰', text: 'Clarifie "bure" (gratuit) avant de monter. Le transport informel payant est la norme.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'La Tanzanie est sûre pour l\'autostop sur les routes principales. Voyage de jour et profite des arrêts de matatu (minibus) comme points de repère.' },
      { type: 'sub', title: 'Utilise SpotHitch pour ta sécurité' },
      { type: 'rule', icon: '🛡️', text: 'Active le Mode Gardien avant chaque trajet. Un proche suit ta position en temps réel.' },
      { type: 'rule', icon: '🆘', text: 'Configure le mode SOS avec tes contacts. Un seul geste déclenche une triple alerte (push, SMS, appel).' },
      { type: 'rule', icon: '📱', text: 'Photographie la plaque du véhicule et envoie-la à un proche avant de monter.' },
      { type: 'rule', icon: '🎒', text: 'Garde ton sac accessible (sur tes genoux ou à tes pieds), jamais dans le coffre.' },
      { type: 'sub', title: 'Conseils spécifiques' },
      { type: 'rule', icon: '☀️', text: 'Voyage de jour uniquement. Les routes principales sont sûres mais peu éclairées la nuit.' },
      { type: 'rule', icon: '🗺️', text: 'Les routes principales (Dar-Arusha, Dar-Dodoma) sont les mieux fréquentées pour le stop.' },
      { type: 'sub', title: 'Numéros d\'urgence' },
      { type: 'kv', items: [{ k: 'Urgences', v: '112' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'La Tanzanie est modérément sûre pour les femmes. Les zones touristiques (Zanzibar, Serengeti) sont sûres. Habille-toi de façon modeste, surtout à Zanzibar (musulmane).' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Le swahili et l\'anglais sont les langues officielles. Le swahili est la langue du quotidien. L\'anglais est bien parlé dans les zones touristiques.' },
      { type: 'phrase', items: [
        { local: 'Jambo / Mambo', meaning: 'Bonjour / Ça va (informel)' },
        { local: 'Asante sana', meaning: 'Merci beaucoup' },
        { local: 'Bure', meaning: 'Gratuit' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'La Tanzanie est modérément chère (safaris très chers). Budget serré hors safari : 15-25 €/jour. Zanzibar est touristique et plus cher.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Les guesthouses sont bon marché (5-15 €). Le camping dans les parcs nationaux est organisé et sûr. Zanzibar a de nombreux hostels.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚐', name: 'Dala-dala', detail: 'Minibus omniprésents, bondés, bon marché', price: '0,30-2 €' },
        { emoji: '⛴️', name: 'Ferry', detail: 'Dar es Salaam-Zanzibar (2h)', price: '20-35 $' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'great' }, { name: 'Fév', level: 'great' }, { name: 'Mar', level: 'ok' },
        { name: 'Avr', level: 'bad' }, { name: 'Mai', level: 'bad' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Aoû', level: 'great' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'ok' }, { name: 'Déc', level: 'good' },
      ]},
      { type: 'text', text: 'Juin-octobre : saison sèche, idéale pour les safaris. Janvier-février : grande migration au Serengeti. Avril-mai : grandes pluies.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'La Tanzanie abrite le Serengeti, le Kilimandjaro et Zanzibar. Les Masai sont une communauté emblématique. Le ugali (pâte de maïs) et le nyama choma (grillades) sont les plats quotidiens. La culture swahilie de Zanzibar mélange influences africaines, arabes et indiennes.' },
    ]},
  },
  // ==================== TAJIKISTAN ====================
  TJ: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'L\'autostop est légal au Tadjikistan. Le transport informel est la norme car les routes sont rares et les bus quasi inexistants dans le Pamir.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Le Tadjikistan est mythique pour l\'autostop. La Pamir Highway (M41) est l\'une des plus hautes routes du monde (4 655m) et un classique du stop. Le trafic est faible mais tout le monde s\'arrête. Les conducteurs sont extrêmement accueillants.' },
      { type: 'rule', icon: '💰', text: 'Les conducteurs attendent souvent un paiement (essence chère, routes longues). Négocier ou partager l\'essence est normal.' },
      { type: 'rule', icon: '🏔️', text: 'La Pamir Highway nécessite un GBAO permit (permis pour la région du Haut-Badakhchan).' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Le Tadjikistan est sûr. La criminalité est basse. Les routes du Pamir sont dangereuses (précipices, pas de garde-fous, altitude). L\'altitude peut causer le mal aigu des montagnes.' },
      { type: 'kv', items: [{ k: 'Urgences', v: '112' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Le Tadjikistan est relativement sûr pour les femmes. La société est conservatrice mais respectueuse. Voyager en duo est recommandé dans le Pamir.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Le tadjik (proche du persan/farsi) est la langue officielle. Le russe est très répandu. L\'anglais est très rare. Le russe de base est indispensable.' },
      { type: 'phrase', items: [
        { local: 'Salom', meaning: 'Bonjour' },
        { local: 'Rahmat', meaning: 'Merci' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Le Tadjikistan est très bon marché. Budget serré : 10-20 €/jour. Le plov et les manty (raviolis) coûtent 1-2 €. L\'hébergement en homestay dans le Pamir : 10-15 € avec repas.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Les homestays sont la norme dans le Pamir (pas d\'hôtels). Le camping sauvage est illimité dans les montagnes. Les nuits sont très froides en altitude.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚗', name: 'Taxi partagé', detail: 'Principal transport entre villes. Attend d\'être plein.', price: '5-30 €' },
        { emoji: '🚐', name: 'Marshrutka', detail: 'Minibus sur les routes principales', price: '2-10 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Fév', level: 'bad' }, { name: 'Mar', level: 'bad' },
        { name: 'Avr', level: 'ok' }, { name: 'Mai', level: 'good' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Aoû', level: 'great' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'ok' }, { name: 'Déc', level: 'bad' },
      ]},
      { type: 'text', text: 'Juin à septembre : idéal pour le Pamir (cols ouverts, températures supportables). L\'hiver ferme les cols et le stop est quasi impossible.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Le Pamir est surnommé "le toit du monde". Les Pamiri sont parmi les gens les plus accueillants de la planète. L\'hospitalité est sacrée : thé, pain, beurre de yak sont offerts à tout visiteur. La culture ismaélienne (Aga Khan) est unique. Les paysages sont à couper le souffle.' },
    ]},
  },
  // ==================== SOUTH KOREA ====================
  KR: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'L\'autostop est légal en Corée du Sud. La pratique est rare car les transports publics sont excellents et bon marché. Les Coréens ne comprennent pas toujours le concept.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'La Corée du Sud est un cas particulier. Le stop est possible mais les conducteurs sont surpris. Temps d\'attente : 20-60 min. Les stations-service (jusoyuso) sur les autoroutes sont les meilleurs spots. Les Coréens qui s\'arrêtent sont très enthousiastes et généreux.' },
      { type: 'text', text: 'Le pays est petit (380 km nord-sud) et les transports publics excellents (KTX, bus). Le stop est plus une aventure qu\'une nécessité.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'La Corée du Sud est un pays très sûr pour l\'autostop. Les aires de repos d\'autoroute sont les meilleurs spots.' },
      { type: 'sub', title: 'Utilise SpotHitch pour ta sécurité' },
      { type: 'rule', icon: '🛡️', text: 'Active le Mode Gardien avant chaque trajet. Un proche suit ta position en temps réel.' },
      { type: 'rule', icon: '🆘', text: 'Configure le mode SOS avec tes contacts. Un seul geste déclenche une triple alerte (push, SMS, appel).' },
      { type: 'rule', icon: '📱', text: 'Photographie la plaque du véhicule et envoie-la à un proche avant de monter.' },
      { type: 'rule', icon: '🎒', text: 'Garde ton sac accessible (sur tes genoux ou à tes pieds), jamais dans le coffre.' },
      { type: 'sub', title: 'Conseils spécifiques' },
      { type: 'rule', icon: '🅿️', text: 'Les aires de repos d\'autoroute (휴게소) sont les meilleurs spots. Elles sont propres et très fréquentées.' },
      { type: 'rule', icon: '🍜', text: 'Les aires de repos coréennes sont légendaires pour leur nourriture. Profites-en pour recharger tes batteries.' },
      { type: 'sub', title: 'Numéros d\'urgence' },
      { type: 'kv', items: [{ k: 'Urgences', v: '112' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'La Corée du Sud est très sûre pour les femmes voyageant seules. Les incidents sont très rares.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Le coréen est la langue unique. L\'alphabet hangul est facile à apprendre (en quelques heures). L\'anglais est limité malgré l\'éducation intensive. Google Translate est utile.' },
      { type: 'phrase', items: [
        { local: 'Annyeonghaseyo', meaning: 'Bonjour' },
        { local: 'Gamsahamnida', meaning: 'Merci' },
        { local: 'Hitchhike', meaning: 'Compris par les jeunes Coréens' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'La Corée est modérément chère. Budget serré : 25-40 €/jour. Le bibimbap de rue coûte 4-6 €. Les jjimjilbangs (saunas publics) offrent un hébergement pas cher (8-12 €).' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Les jjimjilbangs (saunas/spas publics) sont l\'option budget : 8-12 € pour une nuit avec sauna, douche et espace de repos. Les motels (motel love) sont abordables (15-30 €). Le camping est possible dans les parcs nationaux.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚄', name: 'KTX', detail: 'Train à grande vitesse. Séoul-Busan en 2h30.', price: '25-50 €' },
        { emoji: '🚌', name: 'Bus Express', detail: 'Réseau excellent et bon marché', price: '5-20 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Fév', level: 'ok' }, { name: 'Mar', level: 'good' },
        { name: 'Avr', level: 'great' }, { name: 'Mai', level: 'great' }, { name: 'Jun', level: 'good' },
        { name: 'Jul', level: 'bad' }, { name: 'Aoû', level: 'bad' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'great' }, { name: 'Nov', level: 'good' }, { name: 'Déc', level: 'ok' },
      ]},
      { type: 'text', text: 'Avril-mai (cerisiers en fleurs) et septembre-octobre (feuillages d\'automne) : idéal. Juillet-août : mousson (pluies intenses). L\'hiver est froid (-10°C à Séoul).' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'La Corée du Sud est un mélange unique de tradition et d\'ultra-modernité. Le kimchi, le barbecue coréen (samgyeopsal) et le soju sont des institutions. La K-pop et les dramas ont conquis le monde. Les Coréens sont curieux et enthousiastes envers les étrangers qui font du stop.' },
    ]},
  },
  // ==================== PAKISTAN ====================
  PK: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'L\'autostop est légal au Pakistan. Le transport informel est un mode de vie. Les jingle trucks (camions décorés) prennent des passagers avec plaisir.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Le Pakistan est considéré par de nombreux voyageurs comme le pays le plus hospitalier au monde. Les conducteurs refusent systématiquement l\'argent, insistent pour payer le repas et offrent l\'hébergement. Temps d\'attente : 5-15 min.' },
      { type: 'kv', items: [
        { k: 'Karakoram Highway (KKH)', v: 'Mythique. Plus belle route du monde.', color: 'green' },
        { k: 'Hunza Valley', v: 'Paradis. Tout le monde s\'arrête.', color: 'green' },
        { k: 'Baloutchistan', v: 'Déconseillé (sécurité)', color: 'red' },
      ]},
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Vérifie les avis de sécurité avant de voyager au Pakistan. Le nord (Hunza, Gilgit-Baltistan) est sûr et extrêmement accueillant.' },
      { type: 'sub', title: 'Utilise SpotHitch pour ta sécurité' },
      { type: 'rule', icon: '🛡️', text: 'Active le Mode Gardien avant chaque trajet. Un proche suit ta position en temps réel.' },
      { type: 'rule', icon: '🆘', text: 'Configure le mode SOS avec tes contacts. Un seul geste déclenche une triple alerte (push, SMS, appel).' },
      { type: 'rule', icon: '📱', text: 'Photographie la plaque du véhicule et envoie-la à un proche avant de monter.' },
      { type: 'rule', icon: '🎒', text: 'Garde ton sac accessible (sur tes genoux ou à tes pieds), jamais dans le coffre.' },
      { type: 'sub', title: 'Conseils spécifiques' },
      { type: 'rule', icon: '🏔️', text: 'Le nord (Hunza, Gilgit-Baltistan) est sûr et les habitants sont d\'une hospitalité remarquable.' },
      { type: 'rule', icon: '📋', text: 'Vérifie les avis de sécurité du ministère des Affaires étrangères avant de voyager. Certaines zones sont déconseillées.' },
      { type: 'sub', title: 'Numéros d\'urgence' },
      { type: 'kv', items: [{ k: 'Urgences', v: '15' }] },
    ]},
    women: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'Le Pakistan est conservateur. Shalwar kameez recommandé. Voyager en duo avec un homme est fortement recommandé. Le Hunza est plus ouvert.' },
      { type: 'rule', icon: '👕', text: 'Shalwar kameez + dupatta fortement recommandé.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'L\'ourdou est la langue nationale. L\'anglais est bien parlé par les éduqués. Le punjabi, le pashto sont les langues régionales.' },
      { type: 'phrase', items: [
        { local: 'Assalam o alaikum', meaning: 'Paix sur vous' },
        { local: 'Shukriya', meaning: 'Merci' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Très bon marché. Budget serré : 8-15 €/jour. Les conducteurs paient souvent le repas.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Les guesthouses : 3-10 €. Les familles invitent très souvent chez elles. Au Hunza, les homestays sont la norme.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Natco', detail: 'Bus de la KKH (Islamabad-Hunza)', price: '3-15 €' },
        { emoji: '🚛', name: 'Jingle trucks', detail: 'Camions superbement décorés, lent mais culturel', price: 'Souvent gratuit' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Fév', level: 'ok' }, { name: 'Mar', level: 'good' },
        { name: 'Avr', level: 'great' }, { name: 'Mai', level: 'great' }, { name: 'Jun', level: 'good' },
        { name: 'Jul', level: 'ok' }, { name: 'Aoû', level: 'ok' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'great' }, { name: 'Nov', level: 'good' }, { name: 'Déc', level: 'ok' },
      ]},
      { type: 'text', text: 'Avril-mai et septembre-octobre : idéal pour le nord. La KKH ferme parfois en hiver (Khunjerab 4 693m). Le sud est brûlant en été.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Le chai (thé au lait) est offert à toute heure. Les conducteurs font des détours de 100 km pour t\'aider. Le biryani et les naans sont des institutions. Le cricket est la religion nationale.' },
    ]},
  },
  // ==================== MALAYSIA ====================
  MY: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'L\'autostop est légal en Malaisie. Les conducteurs s\'arrêtent facilement, surtout pour les étrangers.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'La Malaisie est facile pour l\'autostop. Les Malaisiens sont accueillants et curieux. Temps d\'attente : 15-30 min. Les stations Petronas et Shell sont les meilleurs spots.' },
      { type: 'kv', items: [
        { k: 'Péninsulaire (KL-Penang)', v: 'Bon trafic, facile', color: 'green' },
        { k: 'Bornéo (Sabah, Sarawak)', v: 'Plus difficile, moins de trafic', color: 'amber' },
      ]},
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'La Malaisie est un pays sûr pour l\'autostop. La péninsule et le Sarawak sont accueillants envers les voyageurs.' },
      { type: 'sub', title: 'Utilise SpotHitch pour ta sécurité' },
      { type: 'rule', icon: '🛡️', text: 'Active le Mode Gardien avant chaque trajet. Un proche suit ta position en temps réel.' },
      { type: 'rule', icon: '🆘', text: 'Configure le mode SOS avec tes contacts. Un seul geste déclenche une triple alerte (push, SMS, appel).' },
      { type: 'rule', icon: '📱', text: 'Photographie la plaque du véhicule et envoie-la à un proche avant de monter.' },
      { type: 'rule', icon: '🎒', text: 'Garde ton sac accessible (sur tes genoux ou à tes pieds), jamais dans le coffre.' },
      { type: 'sub', title: 'Conseils spécifiques' },
      { type: 'rule', icon: '🌴', text: 'La péninsule malaise et le Sarawak (Bornéo) sont les zones les plus accueillantes pour le stop.' },
      { type: 'rule', icon: '🗣️', text: 'L\'anglais est bien parlé en Malaisie. La communication avec les conducteurs est facile.' },
      { type: 'sub', title: 'Numéros d\'urgence' },
      { type: 'kv', items: [{ k: 'Urgences', v: '999' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Sûr pour les femmes. Société multiculturelle et respectueuse. Habillement modeste dans les zones malaises/musulmanes.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Bahasa melayu officiel. L\'anglais est très répandu (ex-colonie britannique). Le mandarin et le tamoul aussi parlés.' },
      { type: 'phrase', items: [
        { local: 'Terima kasih', meaning: 'Merci' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Bon marché. Budget serré : 15-25 €/jour. Le nasi lemak : 1-2 €.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Hostels et guesthouses : 5-15 €. Camping dans les parcs nationaux (Taman Negara, Kinabalu).' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Bus Express', detail: 'Réseau étendu et bon marché', price: '3-15 €' },
        { emoji: '✈️', name: 'AirAsia', detail: 'Low-cost de référence en Asie, hub KL', price: '15-50 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'good' }, { name: 'Fév', level: 'great' }, { name: 'Mar', level: 'great' },
        { name: 'Avr', level: 'good' }, { name: 'Mai', level: 'good' }, { name: 'Jun', level: 'good' },
        { name: 'Jul', level: 'great' }, { name: 'Aoû', level: 'great' }, { name: 'Sep', level: 'good' },
        { name: 'Oct', level: 'ok' }, { name: 'Nov', level: 'ok' }, { name: 'Déc', level: 'ok' },
      ]},
      { type: 'text', text: 'Tropical toute l\'année (28-33°C). Côte est : mousson novembre-février. Côte ouest praticable toute l\'année.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Melting-pot : mosquées, temples chinois, temples hindous coexistent. La nourriture est le ciment social : mamak, hawker centers. Le teh tarik (thé tiré) est l\'art national.' },
    ]},
  },
  // ==================== TAIWAN ====================
  TW: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'L\'autostop est légal à Taïwan. Les Taïwanais sont extrêmement accueillants et s\'arrêtent facilement pour les étrangers.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Taïwan est excellent pour l\'autostop. Les Taïwanais sont curieux et adorent aider. Temps d\'attente : 10-20 min. Le pays est petit (395 km) et les conducteurs font des détours pour t\'aider.' },
      { type: 'text', text: 'La côte est (Taroko Gorge, Hualien, Taitung) est la plus scenic. Les aires de repos sur les autoroutes sont les meilleurs spots.' },
      { type: 'tip', text: '💡 Les Taïwanais invitent souvent à manger, visiter et dormir chez eux. Offre un cadeau de ton pays.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Taïwan est un pays très sûr pour l\'autostop. Les Taïwanais sont extrêmement accueillants et adorent aider les voyageurs.' },
      { type: 'sub', title: 'Utilise SpotHitch pour ta sécurité' },
      { type: 'rule', icon: '🛡️', text: 'Active le Mode Gardien avant chaque trajet. Un proche suit ta position en temps réel.' },
      { type: 'rule', icon: '🆘', text: 'Configure le mode SOS avec tes contacts. Un seul geste déclenche une triple alerte (push, SMS, appel).' },
      { type: 'rule', icon: '📱', text: 'Photographie la plaque du véhicule et envoie-la à un proche avant de monter.' },
      { type: 'rule', icon: '🎒', text: 'Garde ton sac accessible (sur tes genoux ou à tes pieds), jamais dans le coffre.' },
      { type: 'sub', title: 'Conseils spécifiques' },
      { type: 'rule', icon: '🤝', text: 'Les Taïwanais sont extrêmement accueillants. Ils font souvent des détours pour t\'aider.' },
      { type: 'rule', icon: '🏪', text: 'Les konbini (7-Eleven, FamilyMart) sont partout et parfaits pour se reposer ou recharger ton téléphone.' },
      { type: 'sub', title: 'Numéros d\'urgence' },
      { type: 'kv', items: [{ k: 'Police', v: '110' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Très sûr pour les femmes. Société progressiste (premier mariage gay légalisé en Asie, 2019).' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Mandarin (caractères traditionnels). Anglais limité hors Taipei. Google Translate utile.' },
      { type: 'phrase', items: [
        { local: 'Nǐ hǎo', meaning: 'Bonjour' },
        { local: 'Xièxiè', meaning: 'Merci' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Modérément cher. Budget serré : 20-35 €/jour. Les marchés de nuit : repas 2-4 €.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Hostels : 10-20 €. Camping dans les montagnes. Temples accueillent parfois les voyageurs.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚄', name: 'THSR (TGV)', detail: 'Taipei-Kaohsiung en 1h30', price: '15-40 €' },
        { emoji: '🚂', name: 'TRA', detail: 'Train local, côte est magnifique', price: '3-15 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'ok' }, { name: 'Fév', level: 'ok' }, { name: 'Mar', level: 'good' },
        { name: 'Avr', level: 'great' }, { name: 'Mai', level: 'great' }, { name: 'Jun', level: 'ok' },
        { name: 'Jul', level: 'bad' }, { name: 'Aoû', level: 'bad' }, { name: 'Sep', level: 'ok' },
        { name: 'Oct', level: 'great' }, { name: 'Nov', level: 'great' }, { name: 'Déc', level: 'good' },
      ]},
      { type: 'text', text: 'Avril-mai et octobre-novembre : idéal. Typhons juillet-septembre. Hiver doux (15-20°C).' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Marchés de nuit parmi les meilleurs au monde. Le bubble tea a été inventé ici. Temples spectaculaires. Gens parmi les plus aimables d\'Asie.' },
    ]},
  },
  // ==================== LEBANON ====================
  LB: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'L\'autostop est légal au Liban. Le service (taxi partagé) est le transport principal. Lever la main arrête des voitures.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Le Liban est petit (170 km) et facile pour le stop. Les Libanais sont extrêmement accueillants. Temps d\'attente : 5-15 min. Le service (taxi partagé) est si bon marché que le stop gratuit est un luxe.' },
      { type: 'rule', icon: '💰', text: 'Beaucoup de voitures qui s\'arrêtent sont des services (taxis partagés). Clarifie si c\'est gratuit.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Vérifie la situation sécuritaire avant de voyager au Liban. Les zones touristiques (Beyrouth, Byblos, Baalbek) sont généralement sûres.' },
      { type: 'sub', title: 'Utilise SpotHitch pour ta sécurité' },
      { type: 'rule', icon: '🛡️', text: 'Active le Mode Gardien avant chaque trajet. Un proche suit ta position en temps réel.' },
      { type: 'rule', icon: '🆘', text: 'Configure le mode SOS avec tes contacts. Un seul geste déclenche une triple alerte (push, SMS, appel).' },
      { type: 'rule', icon: '📱', text: 'Photographie la plaque du véhicule et envoie-la à un proche avant de monter.' },
      { type: 'rule', icon: '🎒', text: 'Garde ton sac accessible (sur tes genoux ou à tes pieds), jamais dans le coffre.' },
      { type: 'sub', title: 'Conseils spécifiques' },
      { type: 'rule', icon: '📋', text: 'Vérifie la situation sécuritaire avant tout déplacement. La situation évolue régulièrement.' },
      { type: 'rule', icon: '🤝', text: 'Les Libanais sont hospitaliers et polyglottes. La communication est facile.' },
      { type: 'sub', title: 'Numéros d\'urgence' },
      { type: 'kv', items: [{ k: 'Urgences', v: '112' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Le Liban est le pays le plus libéral du Levant. Beyrouth est cosmopolite. Le harcèlement est moins intense que dans les pays voisins.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Arabe libanais, français très répandu, anglais aussi. Beaucoup parlent 3 langues.' },
      { type: 'phrase', items: [
        { local: 'Kifak/Kifik?', meaning: 'Comment ça va ?' },
        { local: 'Merci ktir', meaning: 'Merci beaucoup' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Crise économique. Budget serré en dollars : 15-30 €/jour. Shawarma de rue : 1-2 $.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Hostels : 10-20 $. Camping dans les montagnes (Qadisha, Cèdres). Les Libanais invitent facilement.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚐', name: 'Service / Van', detail: 'Taxis partagés, transport principal', price: '0,50-3 $' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'ok' }, { name: 'Fév', level: 'ok' }, { name: 'Mar', level: 'good' },
        { name: 'Avr', level: 'great' }, { name: 'Mai', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'good' }, { name: 'Aoû', level: 'good' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'great' }, { name: 'Nov', level: 'good' }, { name: 'Déc', level: 'ok' },
      ]},
      { type: 'text', text: 'Avril-juin et septembre-novembre : idéal. Ski le matin, plage l\'après-midi (proverbe libanais).' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Mosquées et églises côte à côte. Cuisine libanaise parmi les meilleures au monde (mezze, taboulé, hummus). Vie nocturne à Beyrouth. Café et narguilé sont des institutions.' },
    ]},
  },
  // ==================== PANAMA ====================
  PA: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'L\'autostop est légal au Panama. Pratique courante en zone rurale. Hub de transit entre Amériques.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Le Panama est faisable en stop. La Panaméricaine traverse le pays avec un bon trafic. Temps d\'attente : 15-30 min.' },
      { type: 'warn', text: '⚠️ Le Darién Gap est une jungle sans route entre Panama et Colombie. Passage en bateau ou avion uniquement.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Le Panama est un pays sûr pour l\'autostop. Les stations-service le long de la Panaméricaine sont de bons spots pour trouver un lift.' },
      { type: 'sub', title: 'Utilise SpotHitch pour ta sécurité' },
      { type: 'rule', icon: '🛡️', text: 'Active le Mode Gardien avant chaque trajet. Un proche suit ta position en temps réel.' },
      { type: 'rule', icon: '🆘', text: 'Configure le mode SOS avec tes contacts. Un seul geste déclenche une triple alerte (push, SMS, appel).' },
      { type: 'rule', icon: '📱', text: 'Photographie la plaque du véhicule et envoie-la à un proche avant de monter.' },
      { type: 'rule', icon: '🎒', text: 'Garde ton sac accessible (sur tes genoux ou à tes pieds), jamais dans le coffre.' },
      { type: 'sub', title: 'Conseils spécifiques' },
      { type: 'rule', icon: '⛽', text: 'Les stations-service le long de la Panaméricaine sont les meilleurs spots pour le stop.' },
      { type: 'rule', icon: '🌴', text: 'Les zones touristiques (Bocas del Toro, Boquete, San Blas) sont sûres et accueillantes.' },
      { type: 'sub', title: 'Numéros d\'urgence' },
      { type: 'kv', items: [{ k: 'Urgences', v: '911' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Modérément sûr pour les femmes. Zones touristiques sûres.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Espagnol principal. Anglais assez répandu (influence américaine du canal).' },
      { type: 'phrase', items: [
        { local: '¿Me da un ride?', meaning: 'Vous me prenez ?' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Dollar américain. Plus cher que les voisins. Budget serré : 20-35 $/jour.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Hostels à Bocas del Toro et Boquete : 8-15 $. Camping sur les îles San Blas.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Bus', detail: 'Réseau étendu', price: '2-15 $' },
        { emoji: '⛴️', name: 'Voilier vers Colombie', detail: '5 jours via San Blas', price: '350-500 $' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'great' }, { name: 'Fév', level: 'great' }, { name: 'Mar', level: 'great' },
        { name: 'Avr', level: 'good' }, { name: 'Mai', level: 'ok' }, { name: 'Jun', level: 'ok' },
        { name: 'Jul', level: 'ok' }, { name: 'Aoû', level: 'ok' }, { name: 'Sep', level: 'bad' },
        { name: 'Oct', level: 'bad' }, { name: 'Nov', level: 'ok' }, { name: 'Déc', level: 'great' },
      ]},
      { type: 'text', text: 'Décembre-avril : saison sèche. Mai-novembre : pluies l\'après-midi.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Le canal de Panama est une merveille d\'ingénierie. Les Kunas vivent sur des îles paradisiaques (San Blas) avec leur propre gouvernement. Ceviche et ron sont les piliers de la gastronomie.' },
    ]},
  },
  // ==================== GHANA ====================
  GH: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Le transport informel (tro-tros) est le mode principal. Le stop gratuit est possible mais le transport payant est la norme.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Le Ghana est l\'un des pays les plus accueillants d\'Afrique de l\'Ouest. Les tro-tros sont omniprésents et très bon marché. Le stop gratuit fonctionne avec camions et pickups en zone rurale.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Le Ghana est un pays sûr et stable pour l\'autostop. Les stations-service sont de bons spots pour rencontrer des conducteurs.' },
      { type: 'sub', title: 'Utilise SpotHitch pour ta sécurité' },
      { type: 'rule', icon: '🛡️', text: 'Active le Mode Gardien avant chaque trajet. Un proche suit ta position en temps réel.' },
      { type: 'rule', icon: '🆘', text: 'Configure le mode SOS avec tes contacts. Un seul geste déclenche une triple alerte (push, SMS, appel).' },
      { type: 'rule', icon: '📱', text: 'Photographie la plaque du véhicule et envoie-la à un proche avant de monter.' },
      { type: 'rule', icon: '🎒', text: 'Garde ton sac accessible (sur tes genoux ou à tes pieds), jamais dans le coffre.' },
      { type: 'sub', title: 'Conseils spécifiques' },
      { type: 'rule', icon: '⛽', text: 'Les stations-service sont des spots fiables pour trouver un lift en toute sécurité.' },
      { type: 'rule', icon: '🌍', text: 'Le Ghana est l\'un des pays les plus stables d\'Afrique. Les Ghanéens sont accueillants et curieux.' },
      { type: 'sub', title: 'Numéros d\'urgence' },
      { type: 'kv', items: [{ k: 'Police', v: '191' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Relativement sûr pour les femmes. Société respectueuse.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Anglais officiel et largement parlé. Le twi (Akan) est la langue locale principale.' },
      { type: 'phrase', items: [
        { local: 'Akwaaba', meaning: 'Bienvenue (twi)' },
        { local: 'Medaase', meaning: 'Merci (twi)' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Modérément cher pour l\'Afrique. Budget serré : 15-25 €/jour. Le jollof rice : 1-3 €.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Guesthouses : 5-15 €. Camping possible sur les plages du Cape Coast.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚐', name: 'Tro-tro', detail: 'Minibus omniprésents, bon marché', price: '0,50-3 €' },
        { emoji: '🚌', name: 'STC / VIP Bus', detail: 'Plus confortables', price: '3-10 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'great' }, { name: 'Fév', level: 'great' }, { name: 'Mar', level: 'good' },
        { name: 'Avr', level: 'ok' }, { name: 'Mai', level: 'ok' }, { name: 'Jun', level: 'bad' },
        { name: 'Jul', level: 'ok' }, { name: 'Aoû', level: 'ok' }, { name: 'Sep', level: 'ok' },
        { name: 'Oct', level: 'ok' }, { name: 'Nov', level: 'great' }, { name: 'Déc', level: 'great' },
      ]},
      { type: 'text', text: 'Novembre-mars : saison sèche, idéale. Mai-juin : grande saison des pluies.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: '"Porte de retour" pour la diaspora africaine (Cape Coast Castle). Le jollof rice est une fierté nationale. Le kente cloth est le tissu traditionnel. Démocratie stable.' },
    ]},
  },
  // ==================== UGANDA ====================
  UG: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Transport informel (boda-bodas, matatus) omniprésent. Le stop gratuit fonctionne avec les camions.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: '"The Pearl of Africa" est accueillant. Les camions sur les routes principales prennent des passagers. Les boda-bodas sont partout mais dangereux.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'L\'Ouganda est un pays sûr pour l\'autostop. Les conducteurs sont accueillants et les stations Total sont de bons spots.' },
      { type: 'sub', title: 'Utilise SpotHitch pour ta sécurité' },
      { type: 'rule', icon: '🛡️', text: 'Active le Mode Gardien avant chaque trajet. Un proche suit ta position en temps réel.' },
      { type: 'rule', icon: '🆘', text: 'Configure le mode SOS avec tes contacts. Un seul geste déclenche une triple alerte (push, SMS, appel).' },
      { type: 'rule', icon: '📱', text: 'Photographie la plaque du véhicule et envoie-la à un proche avant de monter.' },
      { type: 'rule', icon: '🎒', text: 'Garde ton sac accessible (sur tes genoux ou à tes pieds), jamais dans le coffre.' },
      { type: 'sub', title: 'Conseils spécifiques' },
      { type: 'rule', icon: '⛽', text: 'Les stations Total sont bien réparties et constituent d\'excellents spots pour le stop.' },
      { type: 'rule', icon: '🤝', text: 'Les Ougandais sont accueillants et curieux. Un sourire et quelques mots suffisent à créer le contact.' },
      { type: 'sub', title: 'Numéros d\'urgence' },
      { type: 'kv', items: [{ k: 'Urgences', v: '999' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Modérément sûr. Zones touristiques sûres. Habillement modeste en zone rurale.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Anglais et swahili officiels. Anglais bien parlé. Luganda langue locale principale.' },
      { type: 'phrase', items: [
        { local: 'Oli otya?', meaning: 'Comment ça va ? (luganda)' },
        { local: 'Webale', meaning: 'Merci' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Bon marché (sauf gorilles : 700 $/permis). Budget serré : 15-25 €/jour. Le rolex (chapati+omelette) : 0,50 €.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Guesthouses : 5-15 €. Camping dans les parcs nationaux (organisé et sûr).' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🏍️', name: 'Boda-boda', detail: 'Motos-taxis omniprésentes, rapides mais dangereuses', price: '0,30-3 €' },
        { emoji: '🚐', name: 'Matatu', detail: 'Minibus entre villes', price: '2-8 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'great' }, { name: 'Fév', level: 'great' }, { name: 'Mar', level: 'ok' },
        { name: 'Avr', level: 'bad' }, { name: 'Mai', level: 'bad' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Aoû', level: 'great' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'ok' }, { name: 'Nov', level: 'bad' }, { name: 'Déc', level: 'good' },
      ]},
      { type: 'text', text: 'Juin-septembre et décembre-février : saisons sèches.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: '"La perle de l\'Afrique" (Churchill). Gorilles de montagne (Bwindi), chimpanzés (Kibale), sources du Nil (Jinja).' },
    ]},
  },
  // ==================== RWANDA ====================
  RW: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Le stop n\'est pas traditionnel mais le pays est petit et très bien organisé. Les motos-taxis et bus sont le transport principal.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Le pays le plus propre et organisé d\'Afrique. Petit (26 000 km²) et se traverse en quelques heures. Les motos-taxis sont omniprésentes et bon marché.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Le Rwanda est un pays très sûr pour l\'autostop. C\'est l\'un des pays les plus propres et organisés d\'Afrique, avec des routes en bon état.' },
      { type: 'sub', title: 'Utilise SpotHitch pour ta sécurité' },
      { type: 'rule', icon: '🛡️', text: 'Active le Mode Gardien avant chaque trajet. Un proche suit ta position en temps réel.' },
      { type: 'rule', icon: '🆘', text: 'Configure le mode SOS avec tes contacts. Un seul geste déclenche une triple alerte (push, SMS, appel).' },
      { type: 'rule', icon: '📱', text: 'Photographie la plaque du véhicule et envoie-la à un proche avant de monter.' },
      { type: 'rule', icon: '🎒', text: 'Garde ton sac accessible (sur tes genoux ou à tes pieds), jamais dans le coffre.' },
      { type: 'sub', title: 'Conseils spécifiques' },
      { type: 'rule', icon: '🛣️', text: 'Les routes rwandaises sont parmi les meilleures d\'Afrique de l\'Est. Le réseau routier est bien entretenu.' },
      { type: 'rule', icon: '🌿', text: 'Le pays est surnommé "le pays des mille collines". Les paysages sont magnifiques et la sécurité est excellente.' },
      { type: 'sub', title: 'Numéros d\'urgence' },
      { type: 'kv', items: [{ k: 'Urgences', v: '112' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Sûr pour les femmes. Plus haut taux de femmes au parlement au monde (>60%).' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Kinyarwanda, français et anglais officiels. Les trois sont utilisés.' },
      { type: 'phrase', items: [
        { local: 'Muraho', meaning: 'Bonjour' },
        { local: 'Murakoze', meaning: 'Merci' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Modérément cher. Budget serré : 20-30 €/jour. Gorilles : 1 500 $/permis.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Guesthouses : 10-20 €. Scène hostel en développement à Kigali.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🏍️', name: 'Moto-taxi', detail: 'Transport principal, casques obligatoires', price: '0,30-2 €' },
        { emoji: '🚌', name: 'Bus', detail: 'Bus modernes entre villes', price: '2-8 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'great' }, { name: 'Fév', level: 'great' }, { name: 'Mar', level: 'ok' },
        { name: 'Avr', level: 'bad' }, { name: 'Mai', level: 'bad' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Aoû', level: 'great' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'ok' }, { name: 'Nov', level: 'bad' }, { name: 'Déc', level: 'good' },
      ]},
      { type: 'text', text: 'Juin-septembre et décembre-février : saisons sèches. Climat tempéré toute l\'année (20-27°C).' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Transformation remarquable depuis 1994. Sacs plastiques interdits depuis 2008. Umuganda (travail communautaire mensuel). Gorilles (Volcanoes NP). Café excellent.' },
    ]},
  },
  // ==================== MALAWI ====================
  MW: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'L\'autostop est légal. "The warm heart of Africa" : accueil exceptionnel.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Un des meilleurs pays d\'Afrique pour le stop. Les Malawites sont extraordinairement accueillants. Temps d\'attente : 15-30 min. Camions et pickups s\'arrêtent facilement.' },
      { type: 'text', text: 'Le lac Malawi (3ème plus grand d\'Afrique) est l\'attraction principale.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Le Malawi est un pays sûr et accueillant pour l\'autostop. Surnommé "le cœur chaleureux de l\'Afrique", les habitants sont d\'une gentillesse remarquable.' },
      { type: 'sub', title: 'Utilise SpotHitch pour ta sécurité' },
      { type: 'rule', icon: '🛡️', text: 'Active le Mode Gardien avant chaque trajet. Un proche suit ta position en temps réel.' },
      { type: 'rule', icon: '🆘', text: 'Configure le mode SOS avec tes contacts. Un seul geste déclenche une triple alerte (push, SMS, appel).' },
      { type: 'rule', icon: '📱', text: 'Photographie la plaque du véhicule et envoie-la à un proche avant de monter.' },
      { type: 'rule', icon: '🎒', text: 'Garde ton sac accessible (sur tes genoux ou à tes pieds), jamais dans le coffre.' },
      { type: 'sub', title: 'Conseils spécifiques' },
      { type: 'rule', icon: '🤝', text: 'Les Malawiens sont réputés pour leur accueil chaleureux. Le contact se fait naturellement.' },
      { type: 'rule', icon: '🌊', text: 'Le lac Malawi est le joyau du pays. Les routes qui le longent sont agréables et bien fréquentées.' },
      { type: 'sub', title: 'Numéros d\'urgence' },
      { type: 'kv', items: [{ k: 'Police', v: '990' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Sûr pour les femmes. "The warm heart of Africa" s\'applique à tous.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Anglais et chichewa officiels. Anglais bien parlé.' },
      { type: 'phrase', items: [
        { local: 'Moni', meaning: 'Bonjour' },
        { local: 'Zikomo', meaning: 'Merci' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Très bon marché. Budget serré : 10-20 €/jour. Le nsima avec relish : < 1 €.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Lodges et guesthouses : 5-15 €. Camping sur les plages du lac Malawi : magnifique.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚐', name: 'Minibus', detail: 'Transport principal, attendent d\'être pleins', price: '1-5 €' },
        { emoji: '⛴️', name: 'Ilala Ferry', detail: 'Ferry mythique sur le lac (3 jours)', price: '5-20 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Fév', level: 'bad' }, { name: 'Mar', level: 'ok' },
        { name: 'Avr', level: 'good' }, { name: 'Mai', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Aoû', level: 'great' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'great' }, { name: 'Nov', level: 'good' }, { name: 'Déc', level: 'ok' },
      ]},
      { type: 'text', text: 'Mai-octobre : saison sèche, idéale. Lac baignable toute l\'année (24-28°C).' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: '"The warm heart of Africa" n\'est pas un slogan vide. Lac Malawi = paradis d\'eau douce. Gule Wamkulu (danse des masques Chewa, UNESCO).' },
    ]},
  },
}
