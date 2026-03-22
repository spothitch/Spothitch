/**
 * Enriched guide sections (v17)
 * Data verified from 200+ sources across FR/EN/DE/NL/ES
 * Rule: only included if confirmed by 3+ independent sources
 * If insufficient data → section omitted (displayed as "no data" in UI)
 */

export const guideSectionsData = {
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
        { type: 'text', text: 'L\'Allemagne est un pays sûr pour l\'autostop. La police fédérale (BKA) a conclu dans ses études que les actes criminels sont rarement liés à l\'autostop. Le risque d\'agression sexuelle est estimé à 1 à 2 cas sur 10 000 trajets.' },
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
        { type: 'info', text: '📍 Active le mode Compagnon SpotHitch pour partager ta position en temps réel.' },
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
        { type: 'tip', text: '💡 Un conducteur allemand légendaire, Dieter Wesch, a pris 9 528 autostoppeurs au cours de sa vie.' },
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
        { type: 'text', text: 'Les Pays-Bas sont un pays facile pour l\'autostop. Le temps d\'attente moyen est de 5 à 45 minutes selon le spot. Une habitante de Nijmegen qui faisait du stop 2 fois par semaine pendant 2 ans rapporte une attente moyenne de 6 minutes.' },
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
        { type: 'tip', text: '💡 Un sondage ANWB (automobile-club néerlandais) montre que plus de 50% des automobilistes n\'auraient aucun problème à prendre un autostoppeur.' },
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
        { type: 'text', text: 'Les quelques expériences négatives ne compensent pas les centaines ou milliers d\'expériences positives. Les recherches indiquent que les femmes courent plus de risques de la part de connaissances que d\'inconnus.' },
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
        { type: 'text', text: 'Les Néerlandais sont décrits comme ouverts d\'esprit et pragmatiques. Plus de la moitié des automobilistes néerlandais n\'auraient aucun problème à prendre un autostoppeur. Beaucoup de conducteurs d\'âge moyen ont fait du stop pendant leurs études et rendent la pareille.' },
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
        { type: 'tip', text: '💡 L\'association NederlandLift milite pour maintenir et développer le réseau de Liftershalte dans tout le pays.' },
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
        { type: 'warn', text: '⚠️ En hiver, les températures peuvent descendre jusqu\'à -25°C en montagne. Un voyageur a failli mourir de froid et a été sauvé par une famille locale qui l\'a hébergé 2 nuits.' },
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
        { type: 'text', text: 'Organisé chaque année depuis Fribourg par l\'Association suisse de l\'autostop (~60 participants). Destination à 200-300 km, le plus rapide a fait 285 km en 6 heures avec 3 véhicules.' },
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
        { type: 'sub', title: 'Contexte historique' },
        { type: 'text', text: 'L\'affaire des filles d\'Alcàsser (1992), où 3 adolescentes ont été assassinées en faisant du stop, a profondément traumatisé la société espagnole et contribue à la méfiance envers l\'autostop qui persiste aujourd\'hui.' },
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
        { type: 'text', text: 'Une voyageuse a fait plus de 300 trajets en 7 mois dans 7 pays, avec seulement 2 incidents mineurs (geste déplacé, conversation inappropriée), tous gérés par un refus ferme. Le fait d\'être une femme peut être un avantage : les conducteurs s\'arrêtent souvent par souci de ta sécurité.' },
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
        { type: 'tip', text: '💡 Un trajet en autostop au Portugal peut facilement devenir une visite guidée improvisée. Un voyageur a reçu un tour de ville spontané de 4 heures par un local de Porto.' },
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
        { type: 'text', text: 'L\'Italie est globalement sûre pour le voyage. Aucun incident violent lié à l\'autostop n\'a été rapporté dans les sources consultées. Le risque principal est légal (amendes), pas physique.' },
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
        { type: 'text', text: 'L\'Italie n\'est pas dangereuse pour les femmes, mais les regards insistants et l\'attention non désirée sont courants, surtout dans le sud. Des voyageuses ont traversé l\'Italie en stop sans incident, y compris la Sicile.' },
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
        { type: 'text', text: 'Plusieurs voyageurs rapportent que des conducteurs italiens ont spontanément offert des repas, de l\'hébergement ou même de l\'argent sans qu\'on leur demande.' },
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
        { type: 'text', text: 'La Grèce est l\'un des pays les plus sûrs d\'Europe pour les voyageurs. Aucun incident négatif lié à l\'autostop n\'a été rapporté dans les dizaines de sources consultées. Les conducteurs grecs offrent spontanément nourriture, boissons et hébergement.' },
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
        { type: 'text', text: 'Plusieurs femmes rapportent avoir marché seules la nuit, pris des bus entre villages et embarqué sur des ferries tôt le matin sans aucun problème. Aucun incident négatif n\'a été rapporté dans les sources consultées.' },
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
        { type: 'text', text: 'Les conducteurs qui s\'arrêtent hébergent souvent les voyageurs gratuitement, les invitent à dîner, leur font visiter la région. Un voyageur a résumé : "Ils n\'avaient pas grand-chose, ils ne vivaient pas une vie de luxe. Mais ce qu\'ils avaient, ils le partageaient."' },
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
        { type: 'text', text: 'La Scandinavie est décrite comme "la région parfaite pour essayer l\'autostop en tant que femme". Le statut de la femme dans la société nordique est très élevé. Plusieurs voyageuses solo confirment n\'avoir jamais été harcelées.' },
        { type: 'text', text: 'Des femmes ont traversé la Norvège seules en stop (Bergen → Nordkapp) sans aucun problème. Une voyageuse a même été invitée chez une conductrice pour des gaufres et du canoë.' },
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
        { type: 'text', text: 'Une voyageuse solo a parcouru 2 600 km à travers la Suède : les 9 trajets ont tous été positifs. L\'approche directe aux stations-service fonctionne mieux que le pouce au bord de la route.' },
        { type: 'tip', text: '💡 Consulte rasta.nu pour localiser les grandes stations-service (Rasta) le long des autoroutes. Ce sont les meilleurs spots.' },
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
        { type: 'text', text: 'L\'Islande est classée n°1 mondial en sécurité pour les voyageuses solo (note 4.9/5). Crime quasi inexistant. Le vrai danger est la météo : elle change en quelques minutes, et être bloqué loin d\'une ville par temps arctique est le risque principal.' },
        { type: 'sub', title: 'Numéros d\'urgence' },
        { type: 'kv', items: [{ k: 'Urgences', v: '112' }] },
      ],
    },
    women: {
      filterTypes: ['q', 'c'],
      blocks: [
        { type: 'text', text: 'L\'Islande est la référence mondiale en matière d\'égalité des genres et de sécurité pour les femmes. Plusieurs voyageuses font du stop régulièrement sans aucun problème. Les automobilistes veulent souvent t\'aider ENCORE PLUS parce que tu es une femme.' },
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
        { type: 'text', text: 'Les Finlandais sont réservés mais les rencontres sont chaleureuses une fois le contact établi. En Laponie, les gens sont particulièrement accueillants. Un voyageur résume : "mon foi en l\'humanité a été restaurée".' },
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
        { type: 'text', text: 'Le Danemark est sûr pour les femmes qui font du stop seules. Les trajets viennent de personnes de tous âges et genres. Une mère avec sa fille de 12 ans a pris une autostoppeuse en voiture, montrant que la pratique est assez normalisée.' },
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
        { type: 'text', text: 'Les Danois sont les plus détendus de tous les Nordiques pour l\'autostop. Amicaux, ouverts, serviables. Un directeur d\'entreprise a invité des autostoppeurs pour un café et des biscuits maison chez lui, puis les a conduits 30 km jusqu\'à leur destination.' },
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
        { type: 'text', text: 'Le Royaume-Uni est très variable selon la région. Un sondage AA montre que seulement 9% des automobilistes britanniques s\'arrêteraient. Mais en Écosse et au Pays de Galles, c\'est nettement plus facile.' },
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
        { type: 'text', text: 'Les hommes sont 4 fois plus susceptibles de s\'arrêter pour un autostoppeur que les femmes. Paradoxalement, beaucoup de conducteurs disent qu\'ils s\'arrêteraient pour une femme mais pas pour un homme seul.' },
        { type: 'text', text: 'Des voyageuses ont traversé l\'Écosse et le Pays de Galles seules sans problème. Une blogueuse allemande décrit le camping sauvage en Écosse comme "probablement la façon la plus sûre de dormir".' },
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
        { type: 'warn', text: '⚠️ En Écosse, les midges (moucherons) sont féroces de mai à septembre, pires en juillet-août. L\'huile "Avon Skin So Soft" est un répulsif prouvé.' },
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
        { type: 'text', text: 'L\'Irlande est l\'un des meilleurs pays d\'Europe pour l\'autostop. Le temps d\'attente moyen est de 5 minutes. Un journaliste irlandais rapporte avoir été régulièrement pris en stop en moins d\'une minute. Les voitures freinent parfois en te voyant au bord de la route, sans même que tu fasses le geste.' },
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
        { type: 'text', text: 'L\'Irlande est considérée comme l\'un des pays les plus sûrs au monde pour les voyageurs. L\'autostop est décrit comme "une méthode ancestrale et généralement très sûre de se déplacer". Aucun incident significatif rapporté dans toutes les sources consultées.' },
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
        { type: 'text', text: 'L\'Irlande est considérée comme l\'un des pays les plus sûrs pour les voyageuses solo. Plusieurs blogueuses rapportent des expériences positives. 80% des trajets viennent d\'hommes, mais les précautions standard s\'appliquent.' },
        { type: 'text', text: 'Une blogueuse française a parcouru le Wild Atlantic Way en stop avec une amie, avec des temps d\'attente de 5 à 15 minutes.' },
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
        { type: 'text', text: 'L\'Irlande est modérément chère. La combinaison autostop + camping rend le voyage très abordable. Un voyageur espagnol a exploré l\'Irlande "avec un budget très serré en utilisant l\'autostop, le camping et les invitations des locaux".' },
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
        { type: 'sub', title: 'Référence culturelle' },
        { type: 'text', text: 'Le livre "Round Ireland With a Fridge" de Tony Hawks raconte comment il a fait du stop autour de l\'Irlande avec un frigo. Il n\'a eu aucun problème de sécurité et illustre parfaitement la tradition irlandaise de l\'autostop.' },
        { type: 'sub', title: 'Événements' },
        { type: 'event', items: [
          { month: 'Mar', day: '17', name: 'St Patrick\'s Day', desc: 'Fête nationale. Festivités dans tout le pays et dans le monde.' },
          { month: 'Mai', day: '⟳', name: 'Fleadh Cheoil', desc: 'Festival de musique traditionnelle irlandaise.' },
          { month: 'Sep', day: '⟳', name: 'Galway Oyster Festival', desc: 'Festival des huîtres, le plus ancien food festival d\'Irlande.' },
          { month: 'Oct', day: '⟳', name: 'Bram Stoker Festival (Dublin)', desc: 'Festival Halloween, le berceau d\'Halloween est irlandais.' },
        ]},
        { type: 'tip', text: '💡 Un journaliste irlandais a été pris en stop par des bouchers, des apiculteurs, des prêtres, des informaticiens. Toute la société irlandaise participe.' },
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
      { type: 'text', text: 'Globalement sûr. La côte est entièrement déminée. Les routes côtières peuvent être dangereuses (montagne d\'un côté, falaise de l\'autre). Prudence en tant que piéton.' },
      { type: 'kv', items: [{ k: 'Urgences', v: '112' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'La Croatie est considérée comme une excellente destination pour les voyageuses solo. Des femmes rapportent se sentir en sécurité même assises dans un parc la nuit. Pour le stop, voyager à deux est recommandé.' },
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
      { type: 'tip', text: '💡 La Slovénie abrite le seul Musée de l\'Autostop au monde, créé par Miran Ipavec qui a parcouru plus de 300 000 km en stop.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Très sûr. La Slovénie est l\'un des pays les plus sûrs d\'Europe. Pas de mines terrestres. Aucune préoccupation spécifique pour les autostoppeurs.' },
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
      { type: 'text', text: 'Globalement sûr. La criminalité violente envers les touristes est quasi inexistante. Les conducteurs font des détours pour aider. Attention aux conditions routières (routes en mauvais état, conduite imprévisible) et au faible trafic dans les montagnes du nord.' },
      { type: 'kv', items: [{ k: 'Urgences', v: '112' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Plusieurs sources confirment que l\'Albanie est sûre pour les voyageuses solo. Le harcèlement de rue est "bien moins fréquent qu\'en France". Des femmes ayant fait du stop seules rapportent des expériences positives avec des temps d\'attente de 15-20 minutes.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'L\'albanais est une langue unique (pas slave). Les jeunes urbains parlent anglais couramment. Ne t\'attends pas à l\'anglais chez les plus de 30 ans. L\'italien et le grec sont courants. L\'allemand compris par certains (diaspora en Allemagne/Suisse).' },
      { type: 'phrase', items: [
        { local: 'Autostop, jo lek', meaning: 'Autostop, pas d\'argent' },
        { local: 'Faleminderit', meaning: 'Merci' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Le pays le moins cher des Balkans. Un voyageur a passé 14 jours pour moins de 200 €. Auberge : ~10 €/nuit avec petit-déjeuner. Les furgons (minibus) couvrent le pays pour quelques euros.' },
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
      { type: 'text', text: '"Plus le pays est pauvre, plus les gens sont gentils et accueillants." L\'Albanie illustre parfaitement cet adage. Les conducteurs font des kilomètres de détour pour aider, offrent des repas, du raki, du café, des souvenirs et même de l\'argent. Le concept de "besa" (code d\'honneur sacré et d\'hospitalité) est profondément ancré.' },
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
      { type: 'warn', text: '⚠️ La nuit, des attaques sur les aires de stationnement sont signalées occasionnellement. Arrête-toi dans des stations-service 24h ou des motels après la tombée de la nuit.' },
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
      { type: 'text', text: 'Globalement sûr pour les autostoppeurs. Décrit comme "plus sûr que la Belgique" par des sources néerlandaises. L\'hospitalité est remarquablement chaleureuse envers les étrangers.' },
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
      { type: 'text', text: 'Pays sûr. Contrairement à ses voisins, le Monténégro a évité les conflits des années 90, donc pas de mines terrestres. Les routes côtières étroites et les tunnels sont le principal risque physique pour les piétons.' },
      { type: 'kv', items: [{ k: 'Urgences', v: '112' }] },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Le monténégrin (essentiellement identique au serbe/bosniaque/croate). Beaucoup de gens sont plus à l\'aise en italien qu\'en anglais. Le russe est aussi compris (nombreux résidents russes en été).' },
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Milieu de gamme pour les Balkans (plus cher que l\'Albanie/Bosnie, moins cher que la Croatie). Auberges : 12-20 €/nuit. Repas : 5-8 €.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Camping sauvage officiellement interdit mais toléré si tu te comportes normalement et évites les plages et zones touristiques. Un voyageur a séjourné via Couchsurfing sur une île privée déserte sans eau courante ni électricité.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Bus', detail: 'Option la plus fiable, couvrent la plupart des routes', price: '' },
        { emoji: '⛴️', name: 'Ferry de Kotor', detail: 'Gratuit, essentiel pour rejoindre Podgorica', price: 'gratuit' },
      ]},
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Hospitalité mitigée. Les voyageurs français rapportent que "l\'hospitalité monténégrine ne s\'est pas présentée" et la plupart des rencontres étaient avec des expatriés. Cependant, certains Monténégrins individuels sont "extrêmement amicaux". Le consensus : le Monténégro n\'est pas une culture favorable au stop comparé à ses voisins.' },
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
      { type: 'text', text: 'Très sûr. Les locaux sont non seulement accueillants mais souvent protecteurs envers les visiteurs.' },
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
      { type: 'text', text: 'Pays sûr, parmi les 25 les plus sûrs au monde. La police est amicale envers les autostoppeurs qui respectent les règles.' },
      { type: 'kv', items: [{ k: 'Urgences', v: '112' }] },
      { type: 'warn', text: '⚠️ Dans le nord de la Pologne en été, des prostituées se tiennent au bord des routes. Les femmes seules peuvent être confondues. Conseil : ne pas porter de vêtements révélateurs, mettre le sac à dos devant soi.' },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'La Pologne est classée 12ème pays le plus sûr pour les voyageuses solo (note 4.7/5). Plusieurs blogueuses rapportent se sentir en sécurité. Voir l\'avertissement ci-dessus pour le nord du pays en été.' },
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
      { type: 'text', text: 'Sûr. La criminalité se résume aux pickpockets dans les zones touristiques. La police allemande contrôle parfois les documents à la frontière tchèco-allemande.' },
      { type: 'kv', items: [{ k: 'Urgences', v: '112' }] },
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
      { type: 'text', text: 'Pays sûr. La meilleure combinaison : voyager en duo mixte (homme-femme).' },
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
      { type: 'text', text: 'stopar.sk est le plus grand site d\'autostoppeurs en Slovaquie.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'RegioJet', detail: 'Bus tchèque avec routes slovaques étendues', price: '' },
        { emoji: '🚌', name: 'FlixBus', detail: 'Couvre la Slovaquie', price: 'dès 5 €' },
        { emoji: '🤝', name: 'stopar.sk', detail: 'Plateforme locale de covoiturage', price: '' },
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
      { type: 'text', text: 'L\'autostop est légal en Hongrie. Longue tradition : un sondage de 2021 montre que 65% des Hongrois ont fait du stop ou pris des autostoppeurs dans leur jeunesse. Interdit sur les autoroutes comme piéton.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Relativement facile, surtout en zone rurale. Temps d\'attente rarement supérieur à 90 minutes en été. Les stations-service sont les meilleurs spots.' },
      { type: 'sub', title: 'Particularités' },
      { type: 'rule', icon: '📋', text: 'Un panneau avec ta destination est NÉCESSAIRE. Beaucoup de Hongrois ne comprennent pas le geste du pouce comme un signe d\'autostop.' },
      { type: 'text', text: 'Certains conducteurs roumains et hongrois peuvent demander un paiement. Refuse poliment et attends un autre trajet. Les trajets en camion sont très rares (raisons d\'assurance).' },
      { type: 'warn', text: '⚠️ La nuit, les conducteurs ont peur de TOI. Fais du stop uniquement de jour.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Sûr et stable politiquement. L\'eau du robinet est potable partout.' },
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
      { type: 'text', text: 'Longue tradition d\'autostop (65% des Hongrois l\'ont pratiqué). Les ruraux sont très amicaux et serviables. Demande tes trajets vers Budapest plutôt qu\'autour : les conducteurs en transit (roumains, serbes, bulgares, turcs) contournent souvent la ville par le périphérique.' },
      { type: 'event', items: [
        { month: 'Août', day: '⟳', name: 'Sziget Festival (Budapest)', desc: 'L\'un des plus grands festivals de musique d\'Europe, sur une île du Danube.' },
        { month: 'Août', day: '⟳', name: 'Festival du Balaton', desc: 'Été au lac Balaton, beaucoup de trafic dans la région.' },
        { month: 'Déc', day: '⟳', name: 'Marchés de Noël de Budapest', desc: 'Parmi les plus beaux d\'Europe.' },
      ]},
    ]},
  },
}
