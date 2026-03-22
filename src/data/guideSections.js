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
}
