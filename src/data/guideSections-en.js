/**
 * Enriched guide sections (v17) - English translation
 * Data verified from 200+ sources across FR/EN/DE/NL/ES
 * Rule: only included if confirmed by 3+ independent sources
 * If insufficient data → section omitted (displayed as "no data" in UI)
 */

export const guideSectionsData = {
  // ==================== FRANCE ====================
  FR: {
    laws: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'Hitchhiking is legal in France. The restriction applies to motorways themselves (carriageways, hard shoulders, access ramps). Rest areas, toll plazas and petrol stations are allowed.' },
      { type: 'sub', title: 'Where it\'s allowed' },
      { type: 'rule', icon: '✅', text: 'Toll plazas: the classic French spot. Cars slow down and you can talk to drivers.' },
      { type: 'rule', icon: '✅', text: 'Motorway petrol stations (service areas)' },
      { type: 'rule', icon: '✅', text: 'City exits, roundabouts before motorways' },
      { type: 'rule', icon: '✅', text: 'National and departmental roads (RN, RD)' },
      { type: 'sub', title: 'Where it\'s forbidden' },
      { type: 'rule', icon: '🚫', text: 'On motorway carriageways (A1, A6, A7...)' },
      { type: 'rule', icon: '🚫', text: 'On access ramps' },
      { type: 'rule', icon: '🚫', text: 'On hard shoulders' },
      { type: 'sub', title: 'Fines' },
      { type: 'text', text: 'Fine of 11 to 40 EUR in theory, but enforcement is very rare (~5% of cases). In practice, police bring you back to an allowed spot. Some officers are friendly and even hitchhike for you.' },
      { type: 'tip', text: '💡 In Brittany, motorways are free (no tolls). Use petrol stations or city exits instead.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'France is an easy country for hitchhiking. Average waiting time: 30 to 45 min in summer, up to 1h in winter. The toll plaza technique is remarkably effective: you progress from barrier to barrier.' },
      { type: 'sub', title: 'The toll technique' },
      { type: 'text', text: 'The top method in France. Stand on the exit side of the toll with a sign showing the next city or rest area. Cars drive at walking pace, so you can talk to drivers. Ask directly: "Are you heading towards Lyon?" This is more effective than waiting with your thumb out.' },
      { type: 'sub', title: 'Petrol stations' },
      { type: 'text', text: 'Motorway petrol stations are the second best spots. Buy a small coffee to become a customer if staff ask you to leave. You can approach drivers directly there.' },
      { type: 'sub', title: 'Licence plate tip' },
      { type: 'text', text: 'The last two digits of the plate indicate the registration department: 75 = Paris, 13 = Marseille, 69 = Lyon, 33 = Bordeaux, 31 = Toulouse. Less reliable since 2009 (free choice of number) but still useful.' },
      { type: 'sub', title: 'Areas to avoid' },
      { type: 'kv', items: [
        { k: 'Île-de-France', v: 'Very difficult leaving Paris', color: 'red' },
        { k: 'Périphérique / A86', v: 'Impossible, too much traffic', color: 'red' },
      ]},
      { type: 'tip', text: '💡 Drivers often offer money (5 to 60 EUR) or meals. On Sundays, only frozen goods lorries are on the road.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'France is a safe country for hitchhiking. The hitchhiking culture has declined since the 90s but remains well accepted, especially in rural areas and in the south.' },
      { type: 'sub', title: 'Basic rules' },
      { type: 'rule', icon: '📱', text: 'Photograph the licence plate and send it to someone you trust before getting in.' },
      { type: 'rule', icon: '🎒', text: 'Keep your belongings accessible, not in the boot.' },
      { type: 'rule', icon: '🌙', text: 'Avoid hitchhiking at night on deserted roads.' },
      { type: 'sub', title: 'Emergency numbers' },
      { type: 'kv', items: [
        { k: 'SAMU (medical emergency)', v: '15' },
        { k: 'Police', v: '17' },
        { k: 'Fire brigade', v: '18' },
        { k: 'European number', v: '112' },
      ]},
      { type: 'info', text: '📍 Activate SpotHitch Companion mode to share your location in real time.' },
    ]},
    women: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'France is generally safe for women hitchhiking alone, especially in the south and rural areas. Women get picked up faster than men. Experienced female travellers confirm few incidents.' },
      { type: 'rule', icon: '👨‍👩‍👧', text: 'Prefer cars with couples, families or female drivers.' },
      { type: 'rule', icon: '📍', text: 'Mention that someone knows where you are.' },
      { type: 'rule', icon: '🚗', text: 'Avoid cars with multiple men when you are alone.' },
      { type: 'text', text: 'Toll plazas are the safest spots: well lit, with people around, and you can assess the driver before getting in.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'French is essential. Most French people speak little English, especially in rural areas. A few words of French change everything: drivers appreciate the effort.' },
      { type: 'phrase', items: [
        { local: 'Bonjour, vous allez vers... ?', meaning: 'To approach drivers' },
        { local: 'Je fais du stop', meaning: 'I\'m hitchhiking' },
        { local: 'Merci beaucoup, bonne route !', meaning: 'When getting out' },
        { local: 'Je peux descendre ici', meaning: 'I can get off here' },
      ]},
      { type: 'tip', text: '💡 Free road maps are sometimes available at toll offices. Having a paper map is useful in case your phone battery dies.' },
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Average budget: 20 to 40 EUR/day. Tight budget possible at 10 to 15 EUR/day with wild camping and supermarket shopping. Drivers often buy you a meal.' },
      { type: 'kv', items: [
        { k: 'Youth hostel', v: '15-30 EUR/night' },
        { k: 'Municipal campsite', v: '5-12 EUR/night' },
        { k: 'Baguette + cheese', v: '2-3 EUR' },
        { k: 'Set lunch menu', v: '12-15 EUR' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wild camping is technically forbidden in France, but tolerated in the mountains and rural areas if you are discreet, away from houses, and leave early. Strictly forbidden on the coast, in national parks and within 200m of a water source.' },
      { type: 'rule', icon: '⛺', text: 'Municipal campsites: 5 to 12 EUR/night, often well located.' },
      { type: 'rule', icon: '🏠', text: 'Warmshowers (cycle tourists) and Couchsurfing remain active in France.' },
      { type: 'rule', icon: '🌿', text: 'Bivouacking tolerated in the mountains: set up after 7pm, leave before 9am.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚄', name: 'TGV', detail: 'Fast but expensive rail network. Book in advance for low fares.', price: '10-120 EUR' },
        { emoji: '🚌', name: 'FlixBus / BlaBlaBus', detail: 'Budget long-distance coach services', price: '5-30 EUR' },
        { emoji: '🚗', name: 'BlaBlaCar', detail: 'Very popular ride-sharing in France, often 50% cheaper than the train', price: '5-40 EUR' },
        { emoji: '🚃', name: 'TER', detail: 'Regional trains, reduced fares at weekends in some regions', price: '5-25 EUR' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mar', level: 'ok' },
        { name: 'Apr', level: 'good' }, { name: 'May', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Aug', level: 'great' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'ok' }, { name: 'Dec', level: 'bad' },
      ]},
      { type: 'text', text: 'May to September: ideal. Summer is peak season with heavy holiday traffic. The south (Provence, French Riviera) is doable almost year-round. Winter in the mountains is not recommended.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'France has a long hitchhiking history. Backpackers in the 70s and 80s popularised the practice. Today it is less common but well accepted. French people are curious and enjoy chatting during the ride. A shared meal is a key moment of connection.' },
      { type: 'event', items: [
        { month: 'Jun', day: '21', name: 'Fête de la Musique', desc: 'Free concerts everywhere. Festive atmosphere, lots of traffic.' },
        { month: 'Jul', day: '14', name: 'Bastille Day', desc: 'Fireworks everywhere. Heavy traffic around the weekend.' },
        { month: 'Jul-Aug', day: '⟳', name: 'Summer getaways', desc: 'Mass holiday departures on motorways. More traffic = more chances.' },
      ]},
    ]},
  },
  // ==================== GERMANY ====================
  DE: {
    laws: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'Hitchhiking is legal in Germany. The only restriction applies to the Autobahn itself (carriageways and hard shoulder) as well as Kraftfahrstrassen (expressways).' },
      { type: 'sub', title: 'Where it\'s allowed' },
      { type: 'rule', icon: '✅', text: 'Raststätten (service areas with petrol stations on the Autobahn)' },
      { type: 'rule', icon: '✅', text: 'Autohof (petrol stations accessible from the Autobahn but located off it)' },
      { type: 'rule', icon: '✅', text: 'Access ramps before the blue Autobahn sign' },
      { type: 'rule', icon: '✅', text: 'Red lights in cities leading to motorway entrances' },
      { type: 'sub', title: 'Where it\'s forbidden' },
      { type: 'rule', icon: '🚫', text: 'On Autobahn carriageways (police arrive within minutes)' },
      { type: 'rule', icon: '🚫', text: 'On hard shoulders' },
      { type: 'rule', icon: '🚫', text: 'On Kraftfahrstrassen (expressways)' },
      { type: 'sub', title: 'Fines' },
      { type: 'text', text: 'Fine of 20 to 50 EUR if caught on the Autobahn. In practice, police simply bring you to an allowed spot. Pretending you didn\'t know often works.' },
      { type: 'sub', title: 'Petrol stations' },
      { type: 'text', text: 'Raststätten are technically private property. Staff can ask you to leave, but in practice it\'s rare. If it happens, move to the car park.' },
      { type: 'tip', text: '💡 Lorries are not allowed to drive on Sundays and public holidays before 10pm. Traffic is reduced on those days.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Germany is one of the best countries in Europe for hitchhiking. Average waiting time is about 15 minutes. When approaching drivers at petrol stations, it often takes just 1 to 3 people to find a ride.' },
      { type: 'sub', title: 'Best spot types' },
      { type: 'rule', icon: '🥇', text: 'Raststätten (service areas with petrol stations). Approaching drivers directly while they refuel is the most effective method.' },
      { type: 'rule', icon: '🥈', text: 'Access ramps. Stand before the blue Autobahn sign.' },
      { type: 'rule', icon: '🥉', text: 'Red lights in cities leading to the motorway. You can talk to drivers through the window.' },
      { type: 'sub', title: 'Speed and distances' },
      { type: 'text', text: 'No speed limit on many Autobahn sections. It is possible to cover over 1000 km in a day by hopping between Raststätten. Estimated average speed: 50 km/h in summer, 40 km/h in winter.' },
      { type: 'sub', title: 'Areas to avoid' },
      { type: 'kv', items: [
        { k: 'Ruhr area (Dortmund, Essen, Duisburg)', v: 'Very difficult', color: 'red' },
        { k: 'Bavaria and Baden-Württemberg', v: 'More police checks', color: 'amber' },
      ]},
      { type: 'sub', title: 'Licence plate tip' },
      { type: 'text', text: 'German plates start with the city abbreviation (B = Berlin, HH = Hamburg, M = Munich). This can help guess the driver\'s direction, but since changing plates is no longer required when moving, it\'s less reliable.' },
      { type: 'tip', text: '💡 A humorous sign (e.g. "Tokyo") works as an icebreaker. Germans appreciate humour.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Germany is a safe country for hitchhiking. Criminal incidents related to hitchhiking are extremely rare.' },
      { type: 'sub', title: 'Basic rules' },
      { type: 'rule', icon: '📱', text: 'Photograph the licence plate and send it to someone you trust before getting in.' },
      { type: 'rule', icon: '🎒', text: 'Keep your belongings accessible, not in the boot.' },
      { type: 'rule', icon: '🌙', text: 'Avoid hitchhiking at night.' },
      { type: 'rule', icon: '🚪', text: 'Check that the child lock on the rear doors is not engaged.' },
      { type: 'sub', title: 'Emergency numbers' },
      { type: 'kv', items: [
        { k: 'Emergency / Fire brigade', v: '112' },
        { k: 'Police', v: '110' },
      ]},
      { type: 'info', text: '📍 Activate SpotHitch Companion mode to share your location in real time.' },
    ]},
    women: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'Germany is considered one of the safest countries in Europe for women hitchhiking alone. Several experienced female travellers confirm this. Women are generally picked up faster than men.' },
      { type: 'sub', title: 'Tips' },
      { type: 'rule', icon: '👨‍👩‍👧', text: 'Prefer rides with couples, families or female drivers.' },
      { type: 'rule', icon: '📍', text: 'Casually mention that someone knows where you are and is expecting to hear from you.' },
      { type: 'rule', icon: '👁️', text: 'Trust your instinct. Refuse without hesitation if something feels off.' },
      { type: 'rule', icon: '🚗', text: 'Avoid cars with multiple men when you are alone.' },
      { type: 'text', text: 'Female travellers who crossed all of Europe for over a year report having virtually no negative experiences. Germany is consistently cited among the safest countries.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'The official language is German. Germany ranks 4th worldwide in English proficiency. Many drivers speak English, especially younger ones and in urban areas. However, lorry drivers (often Polish or Eastern European) rarely speak anything other than their own language and some German.' },
      { type: 'sub', title: 'Useful phrases' },
      { type: 'phrase', items: [
        { local: 'Hallo, ich fahre nach...', meaning: 'Hello, I\'m going to...' },
        { local: 'Können Sie mich mitnehmen?', meaning: 'Can you give me a lift?' },
        { local: 'Danke für die Mitfahrt!', meaning: 'Thanks for the ride!' },
        { local: 'Können Sie mich hier rauslassen?', meaning: 'Can you drop me off here?' },
      ]},
      { type: 'tip', text: '💡 Check licence plates to guess the driver\'s language, and address them in their presumed language.' },
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Backpacker budget in Germany: about 50 to 70 EUR per day. By hitchhiking and staying with locals, you can get below 30 EUR.' },
      { type: 'sub', title: 'Eating cheap' },
      { type: 'rule', icon: '🌭', text: 'Currywurst or döner kebab: 3 to 5 EUR. This is the traveller\'s staple meal in Germany.' },
      { type: 'rule', icon: '🥨', text: 'Bakeries: pretzel + coffee for 3 to 5 EUR.' },
      { type: 'rule', icon: '🛒', text: 'Lidl (German chain), Aldi, Netto, Penny: discount supermarkets found everywhere.' },
      { type: 'rule', icon: '⛽', text: 'Avoid petrol station food (expensive). Bockwurst is the best value. Roadside tap water is free.' },
      { type: 'sub', title: 'Driver generosity' },
      { type: 'text', text: 'Several travellers report that German drivers insist on buying a meal or tea. Lorry drivers often invite you to eat with them.' },
      { type: 'tip', text: '💡 The app Foodsharing.de lets you pick up free food that supermarkets and bakeries would otherwise throw away.' },
    ]},
    sleep: { filterTypes: ['b', 'q', 'a'], blocks: [
      { type: 'text', text: 'Wild camping with a tent is forbidden in Germany. Bivouacking without a tent (sleeping bag on the ground) is tolerated for one night, except in nature reserves.' },
      { type: 'sub', title: 'Legal exceptions' },
      { type: 'rule', icon: '✅', text: 'Brandenburg and Mecklenburg-Western Pomerania: one night allowed for non-motorised travellers.' },
      { type: 'rule', icon: '✅', text: 'Schleswig-Holstein: ~20 official bivouac sites.' },
      { type: 'rule', icon: '✅', text: 'Trekkingplätze (trekking camps): 10 to 15 EUR/night, some free.' },
      { type: 'sub', title: 'Fines' },
      { type: 'text', text: 'Fine of 10 to 250 EUR for illegal camping. In protected areas, up to 2,500 EUR.' },
      { type: 'sub', title: 'Free accommodation' },
      { type: 'rule', icon: '🛋️', text: 'TrustRoots: born from the hitchhiking community, free. BeWelcome (~120,000 users), Couchers: also free.' },
      { type: 'rule', icon: '🛏️', text: 'Youth hostels (DJH): ~400 across Germany, dorms 20 to 35 EUR/night.' },
      { type: 'info', text: '🆘 mokli-help.de lists free showers and emergency accommodation in major German cities.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Germany has an excellent public transport and ride-sharing network.' },
      { type: 'sub', title: 'Train' },
      { type: 'transport', items: [
        { emoji: '🚄', name: 'Deutschlandticket', detail: 'Unlimited regional transport nationwide (not ICE/IC)', price: '63 EUR/month' },
        { emoji: '🚃', name: 'Schönes-Wochenende-Ticket', detail: '5 people, regional trains, 1 weekend day', price: '~7 EUR/pers.' },
        { emoji: '🚃', name: 'Länder-Ticket', detail: 'Regional trains in 1-2 Länder, valid 9am-3am', price: 'from 25 EUR' },
      ]},
      { type: 'sub', title: 'Bus and ride-sharing' },
      { type: 'transport', items: [
        { emoji: '🚌', name: 'FlixBus / FlixTrain', detail: '', price: 'from 4.99 EUR' },
        { emoji: '🚗', name: 'BlaBlaCar', detail: '130 million members', price: '~5 EUR/100 km' },
        { emoji: '🤝', name: 'BesserMitfahren.de', detail: 'Free, no registration', price: 'free' },
        { emoji: '🤝', name: 'Fahrgemeinschaft.de', detail: 'Run by ADAC, free', price: 'free' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Hitchhiking works year-round in Germany, but summer offers the best conditions: longer days, more traffic, longer distances per day.' },
      { type: 'sub', title: 'Monthly overview' },
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mar', level: 'ok' },
        { name: 'Apr', level: 'good' }, { name: 'May', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Aug', level: 'good' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'ok' }, { name: 'Dec', level: 'bad' },
      ]},
      { type: 'sub', title: 'Details' },
      { type: 'rule', icon: '☀️', text: 'April to September: ideal. Long days, good weather, heavy traffic.' },
      { type: 'rule', icon: '🍂', text: 'October: still good, autumn colours are a bonus.' },
      { type: 'rule', icon: '❄️', text: 'November to March: difficult. Dark early (5pm), cold, winter tyres mandatory from November to March/April.' },
      { type: 'warn', text: '⚠️ Avoid Saturday evenings and Sundays at Autohof (truck stops): lorries are not allowed to drive on Sundays before 10pm, traffic is very low.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Germans may seem wary at first, but once contact is made they are warm. Many drivers who stop hitchhiked themselves when they were young.' },
      { type: 'sub', title: 'What works' },
      { type: 'rule', icon: '😊', text: 'Neat appearance and a smile. Germans are sensitive to presentation.' },
      { type: 'rule', icon: '📋', text: 'A readable sign is essential. Intermediate destinations work better than your final destination.' },
      { type: 'rule', icon: '🗣️', text: 'A few words of German make a big difference, even if the driver speaks English.' },
      { type: 'sub', title: 'Mitfahrbank' },
      { type: 'text', text: 'Germany invented the Mitfahrbank: public benches installed by municipalities with direction signs, where motorists know a passenger is waiting for a ride. Over 20 areas have had them since the mid-2010s.' },
      { type: 'sub', title: 'Hitchhiking races' },
      { type: 'text', text: 'The Tramprennen (hitchhiking race) has existed since 2008. Over 100 participants, ~2000 km in teams across Europe, organised by Club of Roam. Abgefahren e.V. also organises the German hitchhiking championship.' },
      { type: 'sub', title: 'Events' },
      { type: 'event', items: [
        { month: 'Feb', day: '⟳', name: 'Karneval', desc: 'Rhineland carnival (Cologne, Düsseldorf, Mainz). Festive atmosphere.' },
        { month: 'Apr', day: '⟳', name: 'Ostern', desc: 'Easter. Easter markets, families on the roads.' },
        { month: 'Jun', day: '⟳', name: 'Fête de la Musique', desc: 'Free concerts in major cities.' },
        { month: 'Sep-Oct', day: '⟳', name: 'Oktoberfest', desc: 'Munich, 6 million visitors. Intense traffic towards Bavaria.' },
        { month: 'Nov-Dec', day: '⟳', name: 'Weihnachtsmärkte', desc: 'Christmas markets in every city. Nuremberg, Dresden, Cologne.' },
      ]},
      { type: 'tip', text: '💡 In Germany, some regular drivers pick up hitchhikers very frequently. The hitchhiking culture is well rooted among older drivers.' },
    ]},
  },

  // ==================== BELGIUM ====================
  BE: {
    laws: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'Hitchhiking is legal in Belgium. There is no specific regulation. Forbidden on the motorways themselves, allowed at service areas and car parks.' },
      { type: 'sub', title: 'Good to know' },
      { type: 'text', text: 'Belgian motorways use E numbers (E40, E19, E411) rather than national numbers. Belgian drivers do not recognise A numbers.' },
      { type: 'text', text: 'The Brussels Mobility Minister, Elke Van den Brandt, has publicly encouraged people to hitchhike to work.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Belgium is considered one of the best countries in Europe for hitchhiking. With a sign, the average waiting time is about 10 minutes. The density of petrol stations is very high.' },
      { type: 'sub', title: 'Regional differences' },
      { type: 'kv', items: [
        { k: 'Flanders (north, Dutch-speaking)', v: 'Very easy', color: 'green' },
        { k: 'Brussels', v: 'Easy', color: 'green' },
        { k: 'Wallonia (south, French-speaking)', v: 'More difficult', color: 'amber' },
      ]},
      { type: 'text', text: 'In Flanders, the density of population, roads and petrol stations is higher. In Wallonia, it\'s more like France: you need more patience.' },
      { type: 'sub', title: 'Leaving Brussels' },
      { type: 'text', text: 'From Delta (metro/tram/bus hub near ULB), it\'s easy to head towards Namur and Luxembourg. Many foreigners working in Belgium make international rides accessible.' },
      { type: 'tip', text: '💡 If you have been waiting over an hour, change spots. Keep 100 metres between your position and the pick-up point so cars have time to stop.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Belgium is considered one of the safest countries for hitchhiking in Europe. Belgians are described as welcoming and happy to give rides to strangers.' },
      { type: 'sub', title: 'Tips from Belgian police' },
      { type: 'text', text: 'Inspector Sofie Lenaerts (road safety presenter) recommends: avoid hitchhiking at night, refuse intoxicated drivers, travel in pairs when possible, use location apps (Family Track, Glympse, Find My).' },
      { type: 'sub', title: 'Emergency numbers' },
      { type: 'kv', items: [
        { k: 'European emergency', v: '112' },
        { k: 'Belgian police', v: '101' },
      ]},
      { type: 'text', text: 'Most petrol stations are open 24/7 with friendly staff. You can take a nap there if you are stuck at night.' },
    ]},
    women: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'Dutch-language sources report that women who hitchhike are picked up faster than men: drivers worry about their safety and stop more quickly.' },
      { type: 'text', text: 'Feedback is overwhelmingly positive. It is rare for a ride to go badly. The same safety rules as everywhere apply: trust your instinct, send the plate to someone you trust, avoid the night.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Belgium has three official languages: Dutch (Flanders/north), French (Wallonia/south) and German (small eastern region). Brussels is predominantly French-speaking. English is widely spoken, especially in Flanders and among young people.' },
      { type: 'sub', title: 'Language tip' },
      { type: 'text', text: 'Greet with both languages ("Dag" in Dutch + "Bonjour" in French) to cover both regions. Introduce yourself as a foreigner to avoid linguistic tensions. Check the dealership stickers on the car to guess the driver\'s region.' },
      { type: 'warn', text: '⚠️ Don\'t mention being Walloon in Flanders: some Flemish drivers might not stop. Better to present yourself as a foreigner.' },
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Backpacker budget in Belgium: about 48 EUR per day, minimum 22 EUR for the most frugal.' },
      { type: 'sub', title: 'Eating cheap' },
      { type: 'rule', icon: '🍟', text: 'Frietkot (Belgian chip shop): for 5 EUR you get a meal that is bigger and cheaper than McDonald\'s.' },
      { type: 'rule', icon: '🍺', text: 'Beer is often cheaper than water or soda.' },
      { type: 'rule', icon: '🛒', text: 'Discount supermarkets: Lidl, Aldi, Colruyt.' },
      { type: 'warn', text: '⚠️ Food at motorway rest areas is very expensive. Buy in town beforehand.' },
    ]},
    sleep: { filterTypes: ['b', 'q', 'a'], blocks: [
      { type: 'text', text: 'Wild camping is forbidden in Belgium. Possible fine up to 150 EUR.' },
      { type: 'sub', title: 'Legal alternatives' },
      { type: 'rule', icon: '✅', text: 'Official bivouac zones in the Ardennes: free overnight, maximum 48h.' },
      { type: 'rule', icon: '✅', text: 'Welcome To My Garden: a network where locals offer their garden for free camping. Available even in Brussels.' },
      { type: 'rule', icon: '✅', text: '24/7 petrol stations: staff are friendly, you can nap there.' },
      { type: 'sub', title: 'Accommodation' },
      { type: 'kv', items: [
        { k: 'Youth hostels (Brussels)', v: '30 to 50 EUR/night' },
        { k: 'Hostels (Ghent, Bruges)', v: '~24 EUR/night' },
      ]},
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Belgium has interesting transport options and a unique organised hitchhiking system.' },
      { type: 'sub', title: 'Organised hitchhiking' },
      { type: 'transport', items: [
        { emoji: '🤝', name: 'Covoit\'Stop', detail: 'Province of Liège (16 municipalities). Registration, signed charter, criminal record checked', price: 'free' },
      ]},
      { type: 'sub', title: 'Train' },
      { type: 'transport', items: [
        { emoji: '🚃', name: 'SNCB Weekend Ticket', detail: '30% discount Sat/Sun/holidays', price: 'from ~10 EUR' },
        { emoji: '🚃', name: 'SNCB under 26', detail: '40% standard discount', price: '' },
        { emoji: '👶', name: 'Children < 12', detail: 'Free (max 4 per paying adult)', price: 'free' },
      ]},
      { type: 'sub', title: 'Bus and ride-sharing' },
      { type: 'transport', items: [
        { emoji: '🚌', name: 'FlixBus', detail: '', price: 'from 5 EUR' },
        { emoji: '🚗', name: 'BlaBlaCar', detail: 'Very popular in Belgium', price: '' },
      ]},
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Belgians are very welcoming towards travellers, especially foreigners. Hitchhiking works better with Belgians than with French or Dutch people just passing through.' },
      { type: 'sub', title: 'Tips' },
      { type: 'rule', icon: '😊', text: 'Smile at all times, even after hours of waiting.' },
      { type: 'rule', icon: '🗣️', text: 'Chat briefly with the driver to get acquainted before getting in, then trust your instinct.' },
      { type: 'rule', icon: '🎒', text: 'If you have never hitchhiked, Belgium is recommended as a country to start. Begin with short trips.' },
      { type: 'sub', title: 'Events' },
      { type: 'event', items: [
        { month: 'Feb', day: '⟳', name: 'Carnival of Binche', desc: 'UNESCO heritage, the Gilles throw oranges.' },
        { month: 'Jul', day: '21', name: 'Belgian National Day', desc: 'Celebrations and fireworks in Brussels.' },
        { month: 'Jul', day: '⟳', name: 'Tomorrowland', desc: 'Global electronic music festival in Boom, 400,000 visitors.' },
        { month: 'Aug', day: '⟳', name: 'Gentse Feesten', desc: '10 days of free celebrations in Ghent.' },
        { month: 'Dec', day: '⟳', name: 'Christmas Markets', desc: 'Brussels, Bruges, Liège. Very popular.' },
      ]},
    ]},
  },

  // ==================== NETHERLANDS ====================
  NL: {
    laws: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'Hitchhiking is legal in the Netherlands. The basic idea: anywhere you are allowed to walk, you can hitchhike. Forbidden on motorways (snelweg) themselves.' },
      { type: 'sub', title: 'Official spots: the Liftershalte' },
      { type: 'text', text: 'The Netherlands is the only country in the world with official hitchhiking stops (Liftershalte) marked with signs. They can be found in Amsterdam, Groningen, Utrecht, Zoetermeer, Maastricht and in several provinces.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'The Netherlands is an easy country for hitchhiking. Average waiting time is 5 to 45 minutes depending on the spot. At a good location, the wait can drop below 10 minutes.' },
      { type: 'sub', title: 'Method' },
      { type: 'text', text: 'Many drivers will not stop if you thumb from the roadside, but they will give you a lift if you ask directly at the petrol station. Approaching drivers in person is significantly more effective.' },
      { type: 'sub', title: 'Limitations' },
      { type: 'text', text: 'Most rides are under 50 km. You often need several lifts to cross the country. Secondary roads are narrow, with no verge, and hedges separating the fields from the road.' },
      { type: 'sub', title: 'Best times' },
      { type: 'kv', items: [
        { k: 'Weekday mornings and afternoons', v: 'Ideal', color: 'green' },
        { k: 'Saturday and Sunday afternoons', v: 'Poor (families in cars)', color: 'red' },
        { k: 'Night', v: 'Avoid', color: 'red' },
      ]},
      { type: 'tip', text: '💡 The majority of Dutch drivers are open to picking up a hitchhiker.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'The Netherlands is one of the safest countries in the world for hitchhiking. Feedback is overwhelmingly positive: it is rare for a ride to go badly.' },
      { type: 'sub', title: 'Emergency numbers' },
      { type: 'kv', items: [{ k: 'Emergency', v: '112' }] },
      { type: 'text', text: 'Modern technology (GPS, WhatsApp, location sharing) has made hitchhiking safer than ever.' },
    ]},
    women: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'The Netherlands is consistently listed among the safest countries in the world for solo female travellers. Women who hitchhike find that drivers stop more quickly for them, often out of concern for their safety.' },
      { type: 'text', text: 'The few negative experiences do not outweigh the hundreds or thousands of positive ones.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Dutch is the official language. The Netherlands ranks #1 worldwide in English proficiency. Almost everyone speaks English fluently.' },
      { type: 'sub', title: 'Useful phrases' },
      { type: 'phrase', items: [
        { local: 'Mag ik meerijden naar...?', meaning: 'Can I ride with you to...?' },
        { local: 'Bedankt voor de lift!', meaning: 'Thanks for the ride!' },
      ]},
      { type: 'warn', text: '⚠️ Avoid speaking German to the Dutch. Many don\'t appreciate it and might not stop.' },
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Backpacker budget in the Netherlands: about 50 to 70 EUR per day. Amsterdam is significantly more expensive than the rest of the country.' },
      { type: 'sub', title: 'Eating cheap' },
      { type: 'rule', icon: '🧇', text: 'Street food: stroopwafels, kibbeling (fried fish), fries with mayo.' },
      { type: 'rule', icon: '🛒', text: 'Supermarkets: Albert Heijn, Jumbo, Lidl. Good ready meals.' },
      { type: 'tip', text: '💡 The Too Good To Go app lets you pick up discounted food that restaurants and supermarkets would otherwise throw away.' },
    ]},
    sleep: { filterTypes: ['b', 'q', 'a'], blocks: [
      { type: 'text', text: 'Wild camping is forbidden in the Netherlands. Fine: 140 EUR, but most of the time police simply ask you to pack up.' },
      { type: 'sub', title: 'Legal alternative: Paalkamperen' },
      { type: 'text', text: 'Paalkamperen (pole camping) is a legal system where marked poles indicate authorised nature camping spots. Maximum 72h (sometimes 1 night only depending on the area).' },
      { type: 'sub', title: 'Accommodation' },
      { type: 'kv', items: [
        { k: 'Stayokay (Dutch HI network)', v: 'from 20 EUR/night' },
        { k: 'Amsterdam hostels', v: '25 to 50 EUR/night' },
      ]},
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'The Netherlands has an excellent public transport network. The decline of hitchhiking is partly due to students having a free transport pass.' },
      { type: 'sub', title: 'Options' },
      { type: 'transport', items: [
        { emoji: '🚃', name: 'Samenreiskorting', detail: '40% discount if you travel with someone who has a pass', price: '' },
        { emoji: '🚌', name: 'FlixBus', detail: '', price: 'from 5 EUR' },
        { emoji: '🚗', name: 'BlaBlaCar', detail: '', price: '' },
      ]},
      { type: 'sub', title: 'App' },
      { type: 'text', text: 'The 9292 app plans all public transport (train, bus, tram, metro, ferry) and sells electronic tickets.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'The Dutch are described as open-minded and pragmatic. Many middle-aged drivers hitchhiked during their student years and return the favour.' },
      { type: 'sub', title: 'What works' },
      { type: 'rule', icon: '🧹', text: 'Neat appearance. A comb through your hair and clean clothes work wonders. Avoid the hippie look.' },
      { type: 'rule', icon: '😊', text: 'Not everyone wants to chat. Some just want to give you the ride without conversation. Respect that.' },
      { type: 'sub', title: 'Events' },
      { type: 'event', items: [
        { month: 'Apr', day: '27', name: 'Koningsdag', desc: 'King\'s Day. The whole country in orange, markets, concerts.' },
        { month: 'Apr-May', day: '⟳', name: 'Keukenhof', desc: 'Tulip gardens. 7 million bulbs in bloom.' },
        { month: 'Aug', day: '⟳', name: 'Gay Pride Amsterdam', desc: 'Boat parade on the canals.' },
        { month: 'Nov', day: '⟳', name: 'Sinterklaas', desc: 'Arrival of Saint Nicholas by boat, national celebrations.' },
      ]},
      { type: 'tip', text: '💡 The Liftershalte network is being expanded across the country.' },
    ]},
  },

  // ==================== LUXEMBOURG ====================
  LU: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Hitchhiking is legal in Luxembourg. Same rules as the rest of the EU: forbidden on motorways, allowed at service areas.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Luxembourg is excellent for long-distance rides thanks to its central position in the European motorway network. Waiting time often under 15 minutes, even in the evening, even as a group of 3.' },
      { type: 'sub', title: 'The key spot' },
      { type: 'text', text: 'The Aire de Capellen Sud is considered a hitchhiker\'s paradise. Direct rides to Avignon, Valencia (Spain) and Morocco have been obtained there in under an hour.' },
      { type: 'sub', title: 'Limitations' },
      { type: 'text', text: 'A lot of motorway traffic comes from cross-border commuters filling up (cheaper fuel). These are very short rides. Use a directional sign or check plates to filter.' },
      { type: 'text', text: 'Locally and in rural areas, few people hitchhike. The bus is free, so there is no point hitchhiking to get around within the country.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Luxembourg is a very safe country. No specific data on incidents related to hitchhiking.' },
      { type: 'sub', title: 'Emergency numbers' },
      { type: 'kv', items: [
        { k: 'European emergency', v: '112' },
        { k: 'Police', v: '113' },
      ]},
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Most Luxembourgers speak fluent Luxembourgish, French, German AND English. The language barrier is virtually non-existent. It is one of the few countries where you can communicate in almost any European language.' },
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Luxembourg is an expensive country. Restaurants and accommodation are costly.' },
      { type: 'sub', title: 'Accommodation' },
      { type: 'kv', items: [{ k: 'Youth hostels', v: 'from 12 to 20 EUR/night' }] },
      { type: 'tip', text: '💡 Fuel is cheaper in Luxembourg than in neighbouring countries. That is why so many cross-border commuters fill up there.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wild camping and bivouacking are forbidden in Luxembourg. Camping only at official sites or on private land with the owner\'s permission.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Luxembourg is the first country in the world to have made ALL its public transport free, since March 2020.' },
      { type: 'sub', title: 'Free transport' },
      { type: 'rule', icon: '🚌', text: 'Bus: free throughout the country.' },
      { type: 'rule', icon: '🚃', text: 'Train (2nd class): free throughout the country.' },
      { type: 'rule', icon: '🚋', text: 'Tram: free. The line reaches the airport since March 2025.' },
      { type: 'rule', icon: '🇫🇷', text: 'Also free on some cross-border trains to France (Athus, Audun-le-Tiche, Volmerange-les-Mines).' },
      { type: 'text', text: 'Ridership has soared: from 25 million passengers (2019) to 31.3 million (2024). The tram went from 6.2 to 31.7 million.' },
      { type: 'tip', text: '💡 To leave Luxembourg by hitchhiking, take a free bus to a petrol station on the motorway, then hitchhike from there.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Luxembourg is mainly a transit country for hitchhikers. Its small size (2,586 km²) and free transport make domestic hitchhiking pointless. The interest lies in using it as a starting point for the rest of Europe.' },
      { type: 'sub', title: 'Events' },
      { type: 'event', items: [
        { month: 'Jun', day: '23', name: 'National Day', desc: 'Eve: fireworks, concerts throughout the country.' },
        { month: 'Aug', day: '⟳', name: 'Schueberfouer', desc: 'Centuries-old funfair in Luxembourg City.' },
      ]},
    ]},
  },

  // ==================== SWITZERLAND ====================
  CH: {
    laws: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'Hitchhiking is legal in Switzerland. Forbidden only on motorways, expressways and their access ramps. Allowed at rest areas and car parks.' },
      { type: 'sub', title: 'Particularities' },
      { type: 'text', text: 'Swiss motorways are free (vignette system, no tolls). Motorway signs are green (unlike the red/blue signs in neighbouring countries).' },
      { type: 'text', text: 'Switzerland is not in the EU. Drivers may want to check that you have ID.' },
      { type: 'warn', text: '⚠️ If travelling by lorry to Italy, ask the driver not to mention you are hitchhiking at customs. Border police might ask you to get out.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Hitchhiking works well in Switzerland but varies greatly by language region. Average waiting time: about 10 minutes in German-speaking Switzerland. Much longer in French-speaking Switzerland.' },
      { type: 'sub', title: 'Regional differences' },
      { type: 'kv', items: [
        { k: 'German-speaking Switzerland (north/east)', v: 'Fast (~10 min)', color: 'green' },
        { k: 'Rural mountain areas', v: 'Easy (local tradition)', color: 'green' },
        { k: 'French-speaking Switzerland (west)', v: 'More difficult', color: 'amber' },
      ]},
      { type: 'sub', title: 'Method' },
      { type: 'text', text: 'Since motorways are free, almost everyone uses them. Hitchhiking on secondary roads is therefore harder. Motorway petrol stations remain the best choice. A sign is highly valued in Switzerland.' },
      { type: 'sub', title: 'Driver attitudes' },
      { type: 'text', text: 'Older Swiss drivers (50+) are more receptive. Younger people tend to ignore hitchhikers, or even actively avoid them. About 1 in 40 cars stops.' },
      { type: 'sub', title: 'Mitfahrbänkli' },
      { type: 'text', text: 'More and more Swiss municipalities are installing Mitfahrbänkli (hitchhiking benches) with direction signs. In one tested municipality, the frequency was double that of the postal bus.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Switzerland is a very safe country for hitchhiking. Experts attribute the decline of the practice to a trend effect rather than real safety concerns.' },
      { type: 'sub', title: 'Emergency numbers' },
      { type: 'kv', items: [
        { k: 'European emergency', v: '112' },
        { k: 'Police', v: '117' },
        { k: 'Ambulance', v: '144' },
        { k: 'Fire brigade', v: '118' },
        { k: 'Roadside assistance', v: '140' },
      ]},
      { type: 'warn', text: '⚠️ In winter, temperatures can drop to -25°C in the mountains. Good gear and shelter are essential. Never underestimate the cold at altitude.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Switzerland has 4 official languages: German (north/east, with a very strong Swiss accent), French (west), Italian (south) and Romansh (eastern mountains). English is well understood by the majority of the population.' },
      { type: 'tip', text: '💡 French-speaking Switzerland is harder for hitchhiking than German-speaking Switzerland. If you speak German, you will have an easier time.' },
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Switzerland is one of the most expensive countries in Europe. Backpacker budget: about 43 EUR/day minimum, average 120 to 200 CHF/day. Currency: Swiss franc (CHF).' },
      { type: 'sub', title: 'Eating' },
      { type: 'text', text: 'A restaurant meal costs 25 to 60 CHF. To cut costs, buy only at Aldi and Lidl (significantly cheaper than Coop or Migros).' },
      { type: 'sub', title: 'Accommodation' },
      { type: 'kv', items: [{ k: 'Youth hostels', v: '35 to 83 EUR/night' }] },
    ]},
    sleep: { filterTypes: ['b', 'q', 'a'], blocks: [
      { type: 'text', text: 'Switzerland is one of the few European countries where wild camping is relatively tolerated, especially at altitude.' },
      { type: 'sub', title: 'Rules' },
      { type: 'rule', icon: '✅', text: 'Above the tree line (~2000m): one-night camping allowed, not in groups.' },
      { type: 'rule', icon: '✅', text: 'Emergency bivouac (without tent): always allowed.' },
      { type: 'rule', icon: '✅', text: 'Canton of Obwalden: wild camping generally allowed.' },
      { type: 'rule', icon: '🚫', text: 'Forbidden in nature reserves, wildlife protection zones, national parks, military areas.' },
      { type: 'text', text: 'Rules vary by canton and municipality. Check locally.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Swiss transport is excellent but expensive. Here is how to save.' },
      { type: 'sub', title: 'Train discounts' },
      { type: 'transport', items: [
        { emoji: '🚄', name: 'Swiss Half Fare Card', detail: '50% off all trains, buses, boats, urban transport', price: '150 CHF/month' },
        { emoji: '🎫', name: 'Spartageskarte', detail: 'Unlimited day pass, advance booking', price: 'from 29 CHF' },
        { emoji: '🌙', name: 'GA Night (< 25)', detail: 'Free travel from 7pm', price: '' },
      ]},
      { type: 'sub', title: 'Bus and ride-sharing' },
      { type: 'transport', items: [
        { emoji: '🚌', name: 'PostBus (Postauto)', detail: 'Yellow buses covering almost the entire country', price: '' },
        { emoji: '🚌', name: 'FlixBus', detail: '', price: 'from 5 EUR' },
        { emoji: '🚗', name: 'BlaBlaCar', detail: '', price: '' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Spring and autumn are the best seasons for hitchhiking in Switzerland. Winter is dangerous in the mountains.' },
      { type: 'sub', title: 'Monthly overview' },
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mar', level: 'ok' },
        { name: 'Apr', level: 'good' }, { name: 'May', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'good' }, { name: 'Aug', level: 'good' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'ok' }, { name: 'Dec', level: 'bad' },
      ]},
      { type: 'warn', text: '⚠️ In winter, Alpine passes may be closed, severely limiting routes. Temperatures drop very low at altitude. Bring appropriate gear.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Hitchhiking was normal in Switzerland until the 1990s. The older generation has adventure stories. The decline is attributed to prosperity and ride-sharing apps, not insecurity. A revival has been underway for several years, driven by social media and environmental concerns.' },
      { type: 'sub', title: 'Swiss hitchhiking championship' },
      { type: 'text', text: 'Held every year in Switzerland, this event gathers dozens of participants who race to reach a destination 200 to 300 km away as fast as possible by hitchhiking.' },
      { type: 'sub', title: 'Events' },
      { type: 'event', items: [
        { month: 'Feb', day: '⟳', name: 'Fasnacht (Basel)', desc: 'Biggest carnival in Switzerland, 3 days.' },
        { month: 'Jul', day: '⟳', name: 'Montreux Jazz Festival', desc: 'Legendary jazz festival on Lake Geneva.' },
        { month: 'Jul', day: '⟳', name: 'Paléo Festival (Nyon)', desc: 'Biggest open-air festival in Switzerland.' },
        { month: 'Aug', day: '1', name: 'National Day', desc: 'Fireworks on the lakes, bonfires in the mountains.' },
        { month: 'Nov', day: '⟳', name: 'Zibelemärit (Bern)', desc: 'Onion market, medieval tradition.' },
      ]},
    ]},
  },

  // ==================== AUSTRIA ====================
  AT: {
    laws: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'Hitchhiking is legal in Austria. Forbidden on Autobahnen and Schnellstrassen (expressways). Allowed at rest areas, petrol stations and secondary roads.' },
      { type: 'sub', title: 'Minimum age (varies by state)' },
      { type: 'kv', items: [
        { k: 'Carinthia and Vorarlberg', v: '14 years minimum' },
        { k: 'Styria', v: '16 years minimum' },
        { k: 'Other states', v: 'No age restriction' },
      ]},
      { type: 'sub', title: 'Insurance' },
      { type: 'text', text: 'In case of an accident, the vehicle\'s liability insurance covers the hitchhiker like any other passenger.' },
      { type: 'tip', text: '💡 Lorries are not allowed to drive on Sundays and public holidays on Austrian motorways.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Austria is a good country for hitchhiking, but experiences vary greatly by region. In the mountains, waiting times are often ~10 minutes. On some motorways, it can go above 2 hours.' },
      { type: 'sub', title: 'Regional differences' },
      { type: 'kv', items: [
        { k: 'West (Tyrol, Vorarlberg)', v: 'Easier', color: 'green' },
        { k: 'Rural mountain areas', v: 'Good (local tradition)', color: 'green' },
        { k: 'East (Vienna, Graz)', v: 'More difficult', color: 'amber' },
      ]},
      { type: 'text', text: 'Vienna is easy to reach but hard to leave. Graz is surrounded by a "dead zone" of ~40 km of motorway nearly impossible to cover by hitchhiking.' },
      { type: 'sub', title: 'Key spots' },
      { type: 'text', text: 'The Raststätte Walserberg (German-Austrian border near Salzburg) is huge and ideal as a starting point. In Innsbruck, the DEZ area with two petrol stations 2 minutes apart lets you alternate. Free WiFi at many rest areas.' },
      { type: 'sub', title: 'Mitfahrbankerl' },
      { type: 'text', text: 'The Austrian federal government promotes Mitfahrbankerl (hitchhiking benches) as part of its klimaaktiv climate initiative. They are mostly found in Lower Austria and Tyrol.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Austria is considered a safe country for hitchhiking, on par with Germany and the Netherlands.' },
      { type: 'sub', title: 'Tips from ÖAMTC (Austrian automobile club)' },
      { type: 'rule', icon: '🎒', text: 'Keep your bag accessible, not in the boot.' },
      { type: 'rule', icon: '🔒', text: 'Check that the child lock on the rear doors is not engaged.' },
      { type: 'rule', icon: '📱', text: 'Note the plate and send it to your family or friends by text.' },
      { type: 'sub', title: 'Emergency numbers' },
      { type: 'kv', items: [
        { k: 'European emergency', v: '112' },
        { k: 'Police', v: '133' },
        { k: 'Ambulance', v: '144' },
        { k: 'Fire brigade', v: '122' },
        { k: 'Roadside assistance', v: '120 / 123' },
      ]},
    ]},
    women: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'Austria is listed among the safe countries in Europe for women travelling alone. Official recommendations (ÖAMTC) advise hitchhiking in pairs when possible and avoiding vehicles with multiple men.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'German is the official language, with a distinct Austrian accent. Austria ranks 3rd worldwide in English proficiency. Almost everyone speaks at least basic English, especially in tourist areas.' },
      { type: 'sub', title: 'Useful phrases' },
      { type: 'phrase', items: [
        { local: 'Grüß Gott', meaning: 'Hello (traditional Austrian greeting)' },
        { local: 'Nehmen Sie mich mit nach...?', meaning: 'Can you take me to...?' },
        { local: 'Danke für die Mitfahrt!', meaning: 'Thanks for the ride!' },
      ]},
      { type: 'tip', text: '💡 Hitchhiking in Austria is called "Autostoppen" or just "Stoppen", not "Trampen" as in Germany.' },
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Backpacker budget in Austria: about 55 to 95 EUR per day. Cheaper than Switzerland, more expensive than Eastern Europe.' },
      { type: 'sub', title: 'Accommodation' },
      { type: 'kv', items: [
        { k: 'Youth hostels', v: '25 to 40 EUR/night' },
        { k: 'Vienna (dorm)', v: '32 to 40 EUR/night' },
      ]},
      { type: 'sub', title: 'Eating cheap' },
      { type: 'rule', icon: '🛒', text: 'Discount supermarkets: Hofer (= Aldi in Austria), Billa, Spar, Lidl, Penny.' },
      { type: 'text', text: 'Austrian drivers have invited hitchhikers to eat at their home and sleep with their family. These are often the most touching moments of the journey.' },
    ]},
    sleep: { filterTypes: ['b', 'q', 'a'], blocks: [
      { type: 'text', text: 'Wild camping is strictly regulated in Austria and fines are very high. Rules vary considerably from state to state.' },
      { type: 'sub', title: 'By state' },
      { type: 'kv', items: [
        { k: 'Upper Austria (above tree line)', v: 'Allowed', color: 'green' },
        { k: 'Styria (wasteland, 1 night)', v: 'Allowed', color: 'green' },
        { k: 'Salzburg (alpine area)', v: 'Tolerated', color: 'amber' },
        { k: 'Tyrol', v: 'Forbidden. Fine from 220 EUR', color: 'red' },
        { k: 'Lower Austria', v: 'Forbidden. Fine up to 14,500 EUR', color: 'red' },
        { k: 'Carinthia', v: 'Forbidden. Fine up to 3,630 EUR', color: 'red' },
        { k: 'Vienna / Burgenland', v: 'Forbidden', color: 'red' },
      ]},
      { type: 'text', text: 'Emergency bivouac (for safety reasons: bad weather, injury, nightfall) is always allowed everywhere. But planned bivouac (with tent, mat, stove) is treated as wild camping.' },
      { type: 'warn', text: '⚠️ Camping in forests is forbidden throughout ALL of Austria, without exception.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Austria has a unique nationwide transport pass.' },
      { type: 'sub', title: 'KlimaTicket' },
      { type: 'transport', items: [
        { emoji: '🎫', name: 'KlimaTicket', detail: 'All public transport nationwide, unlimited', price: '1,095 EUR/year (~3 EUR/day)' },
        { emoji: '🎫', name: 'KlimaTicket < 26 / > 64', detail: 'Reduced rate', price: '821 EUR/year' },
      ]},
      { type: 'text', text: '130,000 Austrians subscribed in the first month. 85% replaced car trips.' },
      { type: 'sub', title: 'Other options' },
      { type: 'transport', items: [
        { emoji: '🚄', name: 'ÖBB Sparschiene', detail: 'Advance discounted tickets', price: 'from 19 EUR' },
        { emoji: '🚄', name: 'Vorteilscard < 26', detail: '50% off all trains, 1 year', price: '19 EUR' },
        { emoji: '🚌', name: 'FlixBus', detail: '', price: 'from 5 EUR' },
        { emoji: '🚗', name: 'BlaBlaCar', detail: '', price: '' },
        { emoji: '🌙', name: 'Nightjet (ÖBB)', detail: 'Night trains to Germany, Switzerland, Italy', price: '' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Summer is the best season for hitchhiking in Austria. Winter is possible but difficult (cold, short days).' },
      { type: 'sub', title: 'Monthly overview' },
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mar', level: 'ok' },
        { name: 'Apr', level: 'good' }, { name: 'May', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Aug', level: 'good' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'ok' }, { name: 'Dec', level: 'bad' },
      ]},
      { type: 'warn', text: '⚠️ Avoid Sundays: lorries are banned on motorways on Sundays and public holidays, traffic is very low.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'The Austrian welcome varies a lot. Some travellers find Austrians very welcoming, others describe them as reserved. In the mountains, people are more open because many hitchhiked as children and buses run infrequently.' },
      { type: 'sub', title: 'What works' },
      { type: 'rule', icon: '😊', text: 'A genuine smile overcomes a lot of reluctance.' },
      { type: 'rule', icon: '🏔️', text: 'On mountain roads, after a hike, the chances of a car stopping are very high.' },
      { type: 'sub', title: 'Events' },
      { type: 'event', items: [
        { month: 'Jan', day: '⟳', name: 'New Year\'s Concerts (Vienna)', desc: 'World-famous musical tradition.' },
        { month: 'Feb', day: '⟳', name: 'Opera Ball (Vienna)', desc: 'Largest ball in the world.' },
        { month: 'Jul-Aug', day: '⟳', name: 'Salzburg Festival', desc: 'Opera, theatre and classical music.' },
        { month: 'Sep-Oct', day: '⟳', name: 'Almabtrieb', desc: 'Decorated herds descending from alpine pastures. Folk festival.' },
        { month: 'Nov-Dec', day: '⟳', name: 'Christkindlmärkte', desc: 'Christmas markets. Vienna, Salzburg, Innsbruck, Graz.' },
        { month: 'Dec', day: '5', name: 'Krampuslauf', desc: 'Krampus parade, unique Alpine tradition.' },
      ]},
      { type: 'tip', text: '💡 The Alpine scenery is magnificent. Favour small mountain roads for the views, even if it takes longer.' },
    ]},
  },

  // ==================== SPAIN ====================
  ES: {
    laws: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'Hitchhiking is legal on national and secondary roads in Spain. It is forbidden on motorways (autopistas) and expressways (autovías) under Article 125 of the General Traffic Regulations.' },
      { type: 'sub', title: 'Fines' },
      { type: 'text', text: 'Fine of 80 EUR for the hitchhiker AND the driver who picks them up on a forbidden road. Some municipalities impose higher fines (up to 3,000 EUR in some local cases).' },
      { type: 'sub', title: 'In practice' },
      { type: 'text', text: 'Petrol stations and rest areas on motorways are allowed. Many Spaniards (and some police officers) wrongly believe that hitchhiking is completely illegal.' },
      { type: 'warn', text: '⚠️ The Guardia Civil actively removes hitchhikers from toll plazas. Motorway company employees do the same.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Spain is one of the most difficult countries in Europe for hitchhiking. Average waiting time is 60 to 120 minutes. Plan for a maximum of 300 to 350 km per day.' },
      { type: 'sub', title: 'Essential method' },
      { type: 'text', text: 'Approaching drivers directly at petrol stations is almost mandatory. Thumbing by the roadside barely works in Spain. Approach politely: "Hola, vas a...?"' },
      { type: 'sub', title: 'Regional differences' },
      { type: 'kv', items: [
        { k: 'Galicia, Asturias, Extremadura', v: 'Easier', color: 'green' },
        { k: 'Aragon, Navarre', v: 'Decent', color: 'green' },
        { k: 'Inland Andalusia', v: 'Difficult (empty stations)', color: 'amber' },
        { k: 'Catalonia', v: 'Very difficult', color: 'red' },
        { k: 'Basque Country', v: 'Very difficult', color: 'red' },
      ]},
      { type: 'sub', title: 'Border tip' },
      { type: 'text', text: 'La Jonquera (French border) is one of the biggest truck stops in Europe. Ideal for finding a long-distance ride before entering Spain.' },
      { type: 'warn', text: '⚠️ During siesta (2pm to 5pm), traffic drops sharply. Avoid hitchhiking during these hours, especially in summer.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Spain is generally safe (23rd in the Global Peace Index). The main risk for travellers is pickpocketing in big cities, not hitchhiking.' },
      { type: 'text', text: 'Hitchhiking is less common in Spain than in the rest of Europe, but it is perfectly doable. Spaniards are warm and welcoming once you start a conversation.' },
      { type: 'sub', title: 'Emergency numbers' },
      { type: 'kv', items: [
        { k: 'Emergency', v: '112' },
        { k: 'Guardia Civil (roads, rural)', v: '062' },
        { k: 'National Police (cities)', v: '091' },
      ]},
    ]},
    women: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'Spain is considered one of the safest countries for solo female travellers in general. Several women who have hitchhiked alone report positive experiences.' },
      { type: 'sub', title: 'Feedback' },
      { type: 'text', text: 'Incidents are rare and generally minor (inappropriate gesture, improper conversation), all manageable with a firm refusal. Being a woman can be an advantage: drivers often stop out of concern for your safety.' },
      { type: 'rule', icon: '👨‍👩‍👧', text: 'Favour couples and families. Refuse cars with multiple men.' },
      { type: 'rule', icon: '📍', text: 'Share your route in real time on Google Maps with someone you trust.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Spanish (Castilian) is essential. Only 22% of Spaniards speak English. Spain is one of the Western European countries with the lowest English proficiency. Outside tourist areas, do not rely on English.' },
      { type: 'sub', title: 'Regional languages' },
      { type: 'text', text: 'Catalan, Basque and Galician are co-official in their regions. A few words in the local language help a lot.' },
      { type: 'sub', title: 'Useful phrases' },
      { type: 'phrase', items: [
        { local: 'Hola, vas a...?', meaning: 'Hi, are you going to...?' },
        { local: 'Me puedes llevar?', meaning: 'Can you give me a ride?' },
        { local: 'Gracias, buen viaje!', meaning: 'Thanks, safe travels!' },
        { local: 'Me puedes dejar aquí?', meaning: 'Can you drop me off here?' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Backpacker budget in Spain: about 38 to 50 EUR per day. The south (Seville, Cadiz, Granada) is significantly cheaper than the north.' },
      { type: 'sub', title: 'Eating cheap' },
      { type: 'rule', icon: '🍽️', text: 'Menú del día: 8 to 15 EUR for a 3-course meal. Restaurants are legally required to offer one.' },
      { type: 'rule', icon: '🍺', text: 'Free tapas with your drink in Castile, Andalusia and Castilla-La Mancha.' },
      { type: 'rule', icon: '🥖', text: 'Pintxos in the Basque Country: 1 to 2 EUR each.' },
      { type: 'rule', icon: '🛒', text: 'Supermarkets: Mercadona, Carrefour, Lidl. Full meal for 5 to 10 EUR.' },
      { type: 'warn', text: '⚠️ Food at motorway rest areas is very expensive. Buy in town.' },
    ]},
    sleep: { filterTypes: ['b', 'q', 'a'], blocks: [
      { type: 'text', text: 'Wild camping is forbidden in Spain. Fines range from 30 to 3,000 EUR depending on the region. But bivouacking (sleeping without a tent) is more tolerated in the mountains.' },
      { type: 'sub', title: 'By region' },
      { type: 'kv', items: [
        { k: 'Galicia, Cantabria, Asturias, Navarre', v: 'More tolerant', color: 'green' },
        { k: 'Pyrenees, Aragon (mountains)', v: 'Bivouac tolerated', color: 'green' },
        { k: 'Rural interior', v: 'Police just tell you to move on', color: 'amber' },
        { k: 'Tourist coasts, beaches', v: 'Zero tolerance', color: 'red' },
        { k: 'Balearics, Canaries', v: 'Zero tolerance', color: 'red' },
      ]},
      { type: 'sub', title: 'Alternatives' },
      { type: 'rule', icon: '⛪', text: 'Albergues de peregrinos on the Camino de Santiago: very cheap accommodation with a pilgrim passport.' },
      { type: 'rule', icon: '🛋️', text: 'Couchsurfing: active community in Madrid and Barcelona.' },
      { type: 'rule', icon: '🏕️', text: 'Campsites: 10 to 18 EUR/night for 2 with tent. Most have a pool.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Spain has the 4th largest motorway network in the world. Many Spaniards use BlaBlaCar instead of hitchhiking.' },
      { type: 'sub', title: 'Options' },
      { type: 'transport', items: [
        { emoji: '🚗', name: 'BlaBlaCar', detail: 'Very popular in Spain', price: '~5 EUR/100 km' },
        { emoji: '🚗', name: 'Amovens', detail: 'Spanish competitor, zero commission', price: '' },
        { emoji: '🚌', name: 'ALSA', detail: 'Main Spanish bus company', price: 'from 10 EUR' },
        { emoji: '🚌', name: 'FlixBus', detail: '', price: 'from 5 EUR' },
        { emoji: '🚄', name: 'Ouigo / Iryo', detail: 'Low-cost Spanish high-speed trains', price: 'from 9 EUR' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Spring and autumn are the best seasons. Summer is the worst time to hitchhike in Spain.' },
      { type: 'sub', title: 'Monthly overview' },
      { type: 'season', months: [
        { name: 'Jan', level: 'ok' }, { name: 'Feb', level: 'ok' }, { name: 'Mar', level: 'good' },
        { name: 'Apr', level: 'great' }, { name: 'May', level: 'great' }, { name: 'Jun', level: 'good' },
        { name: 'Jul', level: 'bad' }, { name: 'Aug', level: 'bad' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'great' }, { name: 'Nov', level: 'ok' }, { name: 'Dec', level: 'ok' },
      ]},
      { type: 'warn', text: '⚠️ July and August: extreme heat (40°C+ inland), siesta kills traffic, prices at their peak. Waiting by the road in 40°C is unbearable.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'A hitchhiking culture never really existed in Spain. Under Franco, youth movements did not take root as in the rest of Europe. When Spain opened up, cars were already affordable.' },
      { type: 'sub', title: 'What works' },
      { type: 'rule', icon: '🗣️', text: 'The direct approach at petrol stations is virtually mandatory. Thumbing by the road is seen as unusual.' },
      { type: 'rule', icon: '😊', text: 'Spaniards are warm and generous once contact is made. The barrier is getting that first stop.' },
      { type: 'rule', icon: '🕐', text: 'Adapt to Spanish schedules: lunch around 2pm, dinner after 9pm. Siesta (2pm to 5pm) reduces traffic.' },
      { type: 'sub', title: 'Events' },
      { type: 'event', items: [
        { month: 'Mar', day: '⟳', name: 'Las Fallas (Valencia)', desc: 'Giant sculptures burned, fireworks.' },
        { month: 'Mar-Apr', day: '⟳', name: 'Semana Santa', desc: 'Processions nationwide, especially Seville.' },
        { month: 'Apr', day: '⟳', name: 'Feria de Abril (Seville)', desc: 'Flamenco, horses, traditional outfits.' },
        { month: 'Jul', day: '6-14', name: 'San Fermín (Pamplona)', desc: 'Bull running through the streets.' },
        { month: 'Aug', day: '⟳', name: 'La Tomatina (Buñol)', desc: 'Giant tomato fight.' },
        { month: 'Aug', day: '15', name: 'Assumption', desc: 'Public holiday, lots of people on the roads.' },
      ]},
    ]},
  },

  // ==================== PORTUGAL ====================
  PT: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Hitchhiking is legal in Portugal. Walking on motorways (autoestradas) is forbidden, but there is no specific fine for hitchhikers. Police may ask you to leave the area or offer you a ride.' },
      { type: 'text', text: 'Petrol stations and toll areas are the best places. Asking for rides there is allowed and recommended.' },
      { type: 'warn', text: '⚠️ Hitchhikers are not always covered by standard car insurance in Portugal. This is one reason some drivers hesitate to stop.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Portugal is easier than Spain for hitchhiking, but still a challenge. Median waiting time is about 40 minutes. The longest ride recorded by a traveller is 460 km (Ourique to Porto).' },
      { type: 'sub', title: 'Method' },
      { type: 'text', text: 'The direct approach works best: "Hello, sorry to bother you, I am going to... do you happen to be going in the same direction?" Portuguese people respond better to polite conversation than to a raised thumb.' },
      { type: 'sub', title: 'Regional differences' },
      { type: 'kv', items: [
        { k: 'Lisbon-Coimbra-Porto axis', v: 'Easiest', color: 'green' },
        { k: 'Algarve (south coast)', v: 'Decent (tourists)', color: 'green' },
        { k: 'Northern interior', v: 'Longer waits', color: 'amber' },
        { k: 'Border areas with Spain', v: 'Very low traffic', color: 'red' },
      ]},
      { type: 'sub', title: 'Leaving Lisbon' },
      { type: 'text', text: 'Getting out of Lisbon by hitchhiking is difficult. Take the train to Vila Franca de Xira (2.20 EUR, 30 min) to access the A1 toll and the national road.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Portugal ranks 5th safest country in Europe and among the safest in the world. Violent crime is very rare. The main risk is pickpocketing in Lisbon (tram 28) and in Porto tourist areas.' },
      { type: 'sub', title: 'Emergency numbers' },
      { type: 'kv', items: [{ k: 'Emergency', v: '112' }] },
      { type: 'text', text: 'The police is divided into PSP (urban areas) and GNR (rural areas). Lisbon has a tourist police station at Rossio station with multilingual officers.' },
    ]},
    women: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'Portugal is considered one of the best countries in the world for solo female travellers. Several women report never having felt harassed.' },
      { type: 'text', text: 'Portuguese men are described as respectful: when they flirt, it is done with class and they easily accept a polite "no". Female drivers and couples often offer rides out of solidarity.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Portuguese is the official language. English proficiency is much better than in Spain: Portugal ranks among the best non-English-speaking countries. English is taught from primary school. Spanish is widely understood due to shared roots.' },
      { type: 'sub', title: 'Useful phrases' },
      { type: 'phrase', items: [
        { local: 'Olá, pode dar-me boleia até...?', meaning: 'Hello, can you give me a ride to...?' },
        { local: 'Fala inglês?', meaning: 'Do you speak English?' },
        { local: 'Obrigado / Obrigada', meaning: 'Thank you (male / female)' },
        { local: 'Pode ajudar-me?', meaning: 'Can you help me?' },
      ]},
      { type: 'tip', text: '💡 Portuguese people light up when visitors make the effort to speak a few words of Portuguese. Even a simple "Olá" makes a big difference.' },
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Portugal is one of the most affordable countries in Western Europe. Backpacker budget: about 35 to 50 EUR per day. Outside Lisbon and Porto, prices drop considerably.' },
      { type: 'sub', title: 'Eating cheap' },
      { type: 'rule', icon: '🍽️', text: 'Prato do dia (dish of the day): 8 to 12 EUR with soup, main, dessert and sometimes a glass of wine.' },
      { type: 'rule', icon: '🛒', text: 'Supermarkets: Pingo Doce, Continente, Lidl, Aldi. Ready meals available.' },
      { type: 'sub', title: 'Accommodation' },
      { type: 'kv', items: [{ k: 'Youth hostels', v: '15 to 25 EUR/night' }] },
      { type: 'text', text: 'The Alentejo region is particularly affordable. Porto is described as "truly affordable for Western Europe".' },
    ]},
    sleep: { filterTypes: ['b', 'q', 'a'], blocks: [
      { type: 'text', text: 'Since July 2021, wild camping and bivouacking are effectively forbidden in Portugal. Fines: 120 to 600 EUR (up to 36,000 EUR for serious offences in protected areas).' },
      { type: 'sub', title: 'Zones' },
      { type: 'kv', items: [
        { k: 'Algarve and Lisbon', v: 'Strict enforcement', color: 'red' },
        { k: 'Atlantic coast', v: 'Strict enforcement', color: 'red' },
        { k: 'Northern interior and mountains', v: 'More tolerant if discreet', color: 'amber' },
      ]},
      { type: 'sub', title: 'Free or cheap alternatives' },
      { type: 'rule', icon: '🚒', text: 'Bombeiros (fire stations): some offer free beds to travellers who ask politely. Bring your sleeping bag.' },
      { type: 'rule', icon: '🛋️', text: 'Couchsurfing: active community in Lisbon and Porto.' },
      { type: 'rule', icon: '🌾', text: 'Portugal EasyCamp: stays with farmers and winemakers, often cheaper than campsites.' },
      { type: 'tip', text: '💡 Facebook groups "Boleia" + city name help find rides and sometimes accommodation with locals.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'The Portuguese rail network is limited but buses are reliable and affordable.' },
      { type: 'sub', title: 'Options' },
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Rede Expressos', detail: 'Main bus company, 202 cities', price: 'from 5 EUR' },
        { emoji: '🚌', name: 'FlixBus', detail: 'Lisbon-Porto from 9 EUR', price: 'from 5 EUR' },
        { emoji: '🚗', name: 'BlaBlaCar', detail: 'Popular for intercity travel', price: '' },
        { emoji: '🚗', name: 'Boleia.net', detail: 'Portuguese ride-sharing platform', price: '' },
        { emoji: '🚃', name: 'CP (trains)', detail: 'Affordable regional trains around Lisbon', price: 'from 2.20 EUR' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Spring and early autumn are the best periods. Summer is very hot inland and very touristy on the coast.' },
      { type: 'sub', title: 'Monthly overview' },
      { type: 'season', months: [
        { name: 'Jan', level: 'ok' }, { name: 'Feb', level: 'ok' }, { name: 'Mar', level: 'good' },
        { name: 'Apr', level: 'great' }, { name: 'May', level: 'great' }, { name: 'Jun', level: 'good' },
        { name: 'Jul', level: 'ok' }, { name: 'Aug', level: 'bad' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'great' }, { name: 'Nov', level: 'ok' }, { name: 'Dec', level: 'ok' },
      ]},
      { type: 'text', text: 'The Algarve (south) stays mild even in winter (15 to 20°C). The north and centre are rainy from November to March.' },
      { type: 'warn', text: '⚠️ Portugal is VERY windy, especially on the coast. Expect strong wind, even in summer. At night, the coastal wind can be freezing.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Portuguese people are described as very warm and welcoming, but hitchhiking is not part of their culture. Local drivers rarely stop. Foreign tourists (especially in summer in the Algarve) are more likely to pick up hitchhikers.' },
      { type: 'sub', title: 'What works' },
      { type: 'rule', icon: '🗣️', text: 'The direct and polite approach is crucial. Portuguese people value personal interaction.' },
      { type: 'rule', icon: '📋', text: 'A sign with your destination improves your chances.' },
      { type: 'sub', title: 'Events' },
      { type: 'event', items: [
        { month: 'Feb', day: '⟳', name: 'Carnival', desc: 'Big celebrations, especially in Torres Vedras and Loulé.' },
        { month: 'Jun', day: '12-13', name: 'Santo António (Lisbon)', desc: 'Patron saint festival, grilled sardines, parades.' },
        { month: 'Jun', day: '23-24', name: 'São João (Porto)', desc: 'Porto\'s biggest party, bonfires, music, plastic hammers.' },
        { month: 'Jul', day: '⟳', name: 'NOS Alive (Lisbon)', desc: 'International music festival.' },
        { month: 'Aug', day: '⟳', name: 'Festival do Sudoeste', desc: 'Music festival in the Alentejo.' },
        { month: 'Oct', day: '5', name: 'Republic Day', desc: 'National holiday.' },
      ]},
      { type: 'tip', text: '💡 A hitchhiking ride in Portugal can easily turn into an impromptu guided tour. Drivers sometimes spontaneously offer to show you around their city.' },
    ]},
  },

  // ==================== ITALY ====================
  IT: {
    laws: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'Hitchhiking is forbidden on motorways (autostrade) in Italy, including access ramps, service areas and motorway car parks. It is one of the few European countries with such a strict ban.' },
      { type: 'sub', title: 'Fines' },
      { type: 'text', text: 'Fine of 21 to 168 EUR for the hitchhiker. The driver who stops also risks a fine. Enforcement varies by region and officer.' },
      { type: 'sub', title: 'What is allowed' },
      { type: 'rule', icon: '✅', text: 'Asking for a ride by directly approaching drivers at petrol stations (Autogrill). This is the method that works.' },
      { type: 'rule', icon: '✅', text: 'Hitchhiking on national roads (strade statali) and secondary roads.' },
      { type: 'rule', icon: '🚫', text: 'Thumbing on motorways, ramps, tolls and motorway service areas.' },
      { type: 'warn', text: '⚠️ Many Italians and even some police officers believe hitchhiking is completely illegal. Position yourself before the "no autostop" signs at motorway entrances.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Italy is one of the most difficult countries in Western Europe for hitchhiking. Waiting times of 1 to 2 hours are common. The winning strategy: progress from Autogrill to Autogrill by approaching drivers directly.' },
      { type: 'sub', title: 'North/south differences' },
      { type: 'kv', items: [
        { k: 'Southern Italy (Calabria, Sicily)', v: 'Easier, welcoming people', color: 'green' },
        { k: 'Sardinia', v: 'Good (local hospitality)', color: 'green' },
        { k: 'Friuli-Venezia Giulia, South Tyrol', v: 'Decent', color: 'green' },
        { k: 'Industrial north (Milan, Turin)', v: 'Difficult, people in a rush', color: 'red' },
        { k: 'Alps (tunnels)', v: 'Very difficult (no stopping)', color: 'red' },
      ]},
      { type: 'sub', title: 'Sign tip' },
      { type: 'text', text: 'A sign in Italian with "Siamo bravi" (we are nice) has proven effective. Write a city 200 to 300 km away, not your final destination. Foreigners (French, Germans, Poles) in transit stop more than Italians.' },
      { type: 'tip', text: '💡 In Sicily, you can board the ferry at Villa San Giovanni for free: tickets are per vehicle, not per passenger.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Italy is generally safe for travel. Violent incidents related to hitchhiking are extremely rare. The main risk is legal (fines), not physical.' },
      { type: 'sub', title: 'Emergency numbers' },
      { type: 'kv', items: [
        { k: 'European emergency', v: '112' },
        { k: 'Carabinieri', v: '112' },
        { k: 'Police', v: '113' },
        { k: 'Fire brigade', v: '115' },
        { k: 'Ambulance', v: '118' },
      ]},
      { type: 'text', text: 'Near big cities (especially Rome), lone women may be mistaken for sex workers. Avoid hitchhiking in those areas.' },
    ]},
    women: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'Italy is not dangerous for women, but staring and unwanted attention are common, especially in the south. Hitchhiking is entirely doable, including in Sicily.' },
      { type: 'sub', title: 'Specific tips' },
      { type: 'rule', icon: '👕', text: 'Dress plainly: no make-up, no jewellery, hiking boots, "adventurer" look.' },
      { type: 'rule', icon: '👨‍👩‍👧', text: 'Prefer couples and families. Female drivers are rare but very safe.' },
      { type: 'rule', icon: '📱', text: 'Photograph the plate visibly (let the driver see you do it). It reassures everyone.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Italian is essential. The majority of Italians do not speak English, especially outside tourist areas. Even a few words of Italian completely transform the interaction.' },
      { type: 'sub', title: 'Useful phrases' },
      { type: 'phrase', items: [
        { local: 'Cerco un passaggio per...', meaning: 'I\'m looking for a ride to...' },
        { local: 'Vado a...', meaning: 'I\'m going to...' },
        { local: 'Area servizio', meaning: 'Service area' },
        { local: 'Grazie mille!', meaning: 'Thank you so much!' },
      ]},
      { type: 'tip', text: '💡 Gestures are essential in Italy. Physical communication helps enormously when words fail.' },
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Backpacker budget in Italy: about 18 to 30 EUR per day with discipline. Interior regions (Basilicata, Molise, Calabria) are significantly cheaper than the coasts and tourist cities.' },
      { type: 'sub', title: 'Eating cheap' },
      { type: 'rule', icon: '🍕', text: 'Pizza al taglio (by the slice): 1 to 2.50 EUR. Focaccia: 0.80 EUR. Arancini: 2 EUR.' },
      { type: 'rule', icon: '🛒', text: 'Supermarkets: LIDL, Carrefour, COOP. Pasta + sauce = ~3 EUR/meal in a hostel kitchen.' },
      { type: 'sub', title: 'Generosity' },
      { type: 'text', text: 'Italian drivers sometimes spontaneously offer meals, accommodation or even money.' },
    ]},
    sleep: { filterTypes: ['b', 'q', 'a'], blocks: [
      { type: 'text', text: 'Wild camping is forbidden in Italy. Fines: 100 to 500 EUR. But bivouacking (sunset to sunrise, no tent) is tolerated in the mountains.' },
      { type: 'sub', title: 'Exceptions' },
      { type: 'rule', icon: '✅', text: 'Trentino-Alto Adige: bivouac allowed for up to 24h.' },
      { type: 'rule', icon: '✅', text: 'Aosta Valley: bivouac allowed above 2,500 m.' },
      { type: 'rule', icon: '🚫', text: 'Beaches: strict enforcement everywhere.' },
      { type: 'sub', title: 'Alternatives' },
      { type: 'rule', icon: '🛋️', text: 'Couchsurfing: active in university cities (Turin, Pisa, Padua).' },
      { type: 'rule', icon: '🌾', text: 'WWOOF / Workaway: farm work in exchange for accommodation and meals.' },
      { type: 'text', text: 'In Sardinia and Sicily, locals sometimes spontaneously invite travellers into their homes.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Italy has affordable transport alternatives when hitchhiking is not working.' },
      { type: 'sub', title: 'Options' },
      { type: 'transport', items: [
        { emoji: '🚌', name: 'FlixBus / MarinoBus', detail: 'Extensive network, 60 to 80% cheaper than trains', price: 'from 5 EUR' },
        { emoji: '🚗', name: 'BlaBlaCar', detail: 'Very popular in Italy', price: '' },
        { emoji: '🚄', name: 'Italo', detail: 'Private high-speed trains (Rome-Florence-Venice)', price: 'from 9 EUR' },
        { emoji: '🚃', name: 'Trenitalia regional', detail: 'Slow but affordable trains', price: '' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Spring and early autumn are the best periods. Avoid October to November (everything closes) and August (Ferragosto, road chaos).' },
      { type: 'sub', title: 'Monthly overview' },
      { type: 'season', months: [
        { name: 'Jan', level: 'ok' }, { name: 'Feb', level: 'ok' }, { name: 'Mar', level: 'good' },
        { name: 'Apr', level: 'great' }, { name: 'May', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'good' }, { name: 'Aug', level: 'ok' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'ok' }, { name: 'Nov', level: 'bad' }, { name: 'Dec', level: 'ok' },
      ]},
      { type: 'text', text: 'In summer, foreign tourists (French, Germans) crossing the north are more likely to stop than Italians themselves.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Italians have a negative perception of hitchhiking. Many believe only vagrants hitchhike. But once contact is made, Italian hospitality is sincere and generous, especially in the south and on the islands.' },
      { type: 'sub', title: 'What works' },
      { type: 'rule', icon: '🗣️', text: 'Speaking Italian, even badly, changes everything. The direct approach at Autogrill is mandatory.' },
      { type: 'rule', icon: '😊', text: 'Human contact first: smile, chat, eye contact. Only then ask for a ride.' },
      { type: 'sub', title: 'Events' },
      { type: 'event', items: [
        { month: 'Feb', day: '⟳', name: 'Carnevale di Venezia', desc: 'Masks, costumes, 10 days of celebrations.' },
        { month: 'Apr', day: '25', name: 'Festa della Liberazione', desc: 'Public holiday, national celebrations.' },
        { month: 'May', day: '⟳', name: 'Giro d\'Italia', desc: 'Cycling tour, lively atmosphere on the roads.' },
        { month: 'Jul', day: '2+16', name: 'Palio di Siena', desc: 'Medieval horse race through the city.' },
        { month: 'Aug', day: '15', name: 'Ferragosto', desc: 'All of Italy on holiday. Roads packed.' },
        { month: 'Dec', day: '⟳', name: 'Mercatini di Natale', desc: 'Christmas markets, especially in Trentino.' },
      ]},
    ]},
  },

  // ==================== GREECE ====================
  GR: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'There is no specific law against hitchhiking in Greece. On motorways, it is forbidden as in the rest of the EU, but on normal roads it is tolerated. Fines (100 to 150 EUR) are rare and inconsistently enforced.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Greece is significantly easier than Italy or Spain for hitchhiking. Waiting times range from a few minutes to an hour. In rural areas and on the islands, locals hitchhike themselves.' },
      { type: 'sub', title: 'By area' },
      { type: 'kv', items: [
        { k: 'Crete (especially west/south)', v: 'Very easy', color: 'green' },
        { k: 'Rural islands', v: 'Easy (few buses)', color: 'green' },
        { k: 'Rural mainland roads', v: 'Easy', color: 'green' },
        { k: 'Intercity axes (Athens-Thessaloniki)', v: 'More difficult', color: 'amber' },
        { k: 'Leaving Athens', v: 'Very difficult', color: 'red' },
      ]},
      { type: 'sub', title: 'Method' },
      { type: 'text', text: 'In Crete, the raised thumb is not always understood. Instead use a hand gesture to signal cars to stop, as if you are in a hurry. A sign in both Greek AND English increases your chances.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Greece is one of the safest countries in Europe for travellers. Negative incidents related to hitchhiking are extremely rare. Greek drivers spontaneously offer food, drinks and accommodation.' },
      { type: 'sub', title: 'Emergency numbers' },
      { type: 'kv', items: [
        { k: 'Emergency', v: '112' },
        { k: 'Police', v: '100' },
        { k: 'Ambulance', v: '166' },
        { k: 'Fire brigade', v: '199' },
      ]},
    ]},
    women: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'Greece is considered one of the best destinations in the world for solo female travellers. The attitude towards lone women is described as that of a "protective big cousin" rather than intrusive.' },
      { type: 'text', text: 'Women travel safely in Greece, day and night, by bus, ferry and hitchhiking. Incidents are virtually non-existent.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Greek is the official language. English is well spoken in tourist areas and by young people (taught at school from primary level). In rural areas, it is more limited. Many Greeks also speak German (diaspora).' },
      { type: 'sub', title: 'Useful phrases' },
      { type: 'phrase', items: [
        { local: 'Kalimera', meaning: 'Good morning' },
        { local: 'Efcharistó', meaning: 'Thank you' },
        { local: 'Parakaló', meaning: 'Please / You\'re welcome' },
        { local: 'Boríte na me páte sto...?', meaning: 'Can you take me to...?' },
      ]},
      { type: 'tip', text: '💡 A few words of Greek trigger very warm reactions. Greeks hugely appreciate the effort.' },
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Greece is affordable for backpackers. Budget: 22 to 42 EUR per day. Cheaper than Italy. The less touristy islands (Naxos, Paros, Ios) offer the best value.' },
      { type: 'sub', title: 'Eating cheap' },
      { type: 'rule', icon: '🥙', text: 'Gyros: under 5 EUR. Souvlaki: 2 to 3 EUR.' },
      { type: 'rule', icon: '🛒', text: 'Supermarkets: feta, pita, yoghurt, tomatoes, olives. Very cheap.' },
      { type: 'sub', title: 'Transport' },
      { type: 'text', text: 'KTEL buses: about 5 EUR/100 km (government-fixed fares). Ferries to the islands: affordable, book 2 to 3 months in advance for popular routes.' },
    ]},
    sleep: { filterTypes: ['b', 'q', 'a'], blocks: [
      { type: 'text', text: 'Wild camping is officially forbidden in Greece. Fine: 150 EUR, potentially up to 3,000 EUR + 3 months in prison in tourist areas or nature reserves.' },
      { type: 'sub', title: 'In practice' },
      { type: 'text', text: 'The ban applies from sunrise to sunset. Sleeping at night and packing up in the morning is widely tolerated in low season and away from tourist areas. Secluded beaches are easy to find.' },
      { type: 'sub', title: 'Alternatives' },
      { type: 'rule', icon: '🛋️', text: 'Couchsurfing: active community in Athens and Thessaloniki.' },
      { type: 'rule', icon: '🏠', text: 'Spontaneous invitations: Greeks regularly invite travellers to dinner or to sleep at their home, especially in rural areas and on the islands.' },
      { type: 'sub', title: 'Accommodation' },
      { type: 'kv', items: [
        { k: 'Athens hostels', v: '9 to 25 EUR/night' },
        { k: 'Island hostels', v: '20 to 25 EUR/night' },
        { k: 'Studios on Booking', v: 'from 10 EUR/pers/night' },
      ]},
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'The KTEL bus network is so cheap that hitchhiking is sometimes less necessary in Greece.' },
      { type: 'sub', title: 'Options' },
      { type: 'transport', items: [
        { emoji: '🚌', name: 'KTEL (intercity bus)', detail: 'Extensive network, even small villages. Government-fixed fares.', price: '~5 EUR/100 km' },
        { emoji: '⛴️', name: 'Ferries', detail: 'Essential for the islands. Night ferries = save on accommodation.', price: '10 to 50 EUR' },
        { emoji: '🚃', name: 'Trains', detail: 'Limited network but up to 50% cheaper than buses', price: '' },
        { emoji: '🚗', name: 'BlaBlaCar', detail: 'Available in Greece', price: '' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'The ideal window runs from late May to early October. June and September are the sweet spot: summer weather without extreme heat or crowds.' },
      { type: 'sub', title: 'Monthly overview' },
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mar', level: 'ok' },
        { name: 'Apr', level: 'good' }, { name: 'May', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'good' }, { name: 'Aug', level: 'ok' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'bad' }, { name: 'Dec', level: 'bad' },
      ]},
      { type: 'warn', text: '⚠️ From November to March, most islands shut down (hotels, restaurants, reduced ferries). The mainland remains accessible but there are very few tourists on the roads.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Greece is the land of philoxenia (love of strangers). It is a deep cultural value going back to ancient Greece: Zeus Xenios protected travellers, and any stranger could be a god in disguise.' },
      { type: 'sub', title: 'In practice' },
      { type: 'text', text: 'Drivers who stop often host travellers for free, invite them to dinner, show them around the region. Greek hospitality is sincere and generous, even among the most modest people.' },
      { type: 'rule', icon: '🎁', text: 'Accept invitations (refusing can seem like rejection). Bring a small gift (pastries, wine) if invited to someone\'s home.' },
      { type: 'sub', title: 'Events' },
      { type: 'event', items: [
        { month: 'Feb-Mar', day: '⟳', name: 'Apokries (Carnival)', desc: 'Patras has the biggest carnival in Greece.' },
        { month: 'Apr', day: '⟳', name: 'Orthodox Easter', desc: 'The biggest celebration in Greece. Roast lamb, fireworks.' },
        { month: 'Jun', day: '⟳', name: 'Athens Festival', desc: 'Theatre, music, dance at the Odeon of Herodes Atticus.' },
        { month: 'Aug', day: '15', name: 'Assumption (Dekapentavgoustos)', desc: 'Biggest summer celebration. Pilgrimages, island parties.' },
        { month: 'Oct', day: '28', name: 'Ochi Day', desc: 'National holiday, military parades.' },
      ]},
      { type: 'tip', text: '💡 Cretan saying: "A guest in the house is a gift from God." In rural areas, the arrival of a stranger is still a special event.' },
    ]},
  },

  // ==================== NORWAY ====================
  NO: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Hitchhiking is legal in Norway. Forbidden on motorways themselves but allowed at access ramps, petrol stations and secondary roads. Since 2024, almost all coastal ferries are free for pedestrians.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Norway works well for hitchhiking but progress is slow due to winding mountain roads and sparse traffic. Plan for ~500 km/day maximum.' },
      { type: 'sub', title: 'North/south differences' },
      { type: 'kv', items: [
        { k: 'North (Lofoten, Tromsø, Nordkapp)', v: 'Excellent (5 to 30 min)', color: 'green' },
        { k: 'Centre (Trondheim)', v: 'Decent', color: 'green' },
        { k: 'South (Oslo, Stavanger)', v: 'Difficult (up to 2h)', color: 'amber' },
      ]},
      { type: 'text', text: 'The Lofoten Islands are a hitchhiking paradise: one main road (E10), spectacular scenery, welcoming drivers. In the north, many drivers have never seen a hitchhiker.' },
      { type: 'tip', text: '💡 At ferries, approach drivers BEFORE boarding rather than after. They are waiting and have time to chat.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Norway is one of the safest countries in the world. The main risk is weather and isolation (long distances between towns, cold, rain, snow), not people.' },
      { type: 'sub', title: 'Emergency numbers' },
      { type: 'kv', items: [
        { k: 'Emergency', v: '112' },
        { k: 'Police', v: '02800' },
        { k: 'Ambulance', v: '113' },
      ]},
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Scandinavia is described as "the perfect region to try hitchhiking as a woman". The status of women in Nordic society is very high and harassment is virtually non-existent.' },
      { type: 'text', text: 'Norway is very well suited for solo female hitchhiking. The welcome is warm and positive encounters are the norm.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Almost all Norwegians speak English fluently. No language barrier.' },
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Norway is extremely expensive. Food prices are roughly double those in France, even at discount supermarkets (Rema 1000, Kiwi). A restaurant meal is prohibitive for backpackers.' },
      { type: 'text', text: 'The combination of hitchhiking + wild camping (free thanks to Allemannsretten) + cooking on a stove is the only viable budget strategy.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Allemannsretten (the right of public access) is enshrined in Norwegian law since 1957. You can camp for free on uncultivated land (forests, mountains, moors, shorelines) without permission.' },
      { type: 'sub', title: 'Rules' },
      { type: 'rule', icon: '✅', text: 'Free camping for up to 2 nights in the same spot.' },
      { type: 'rule', icon: '✅', text: 'Picking berries and mushrooms is allowed.' },
      { type: 'rule', icon: '🚫', text: 'Stay at least 150 m from houses.' },
      { type: 'rule', icon: '🚫', text: 'No open fires in the wild.' },
      { type: 'rule', icon: '🚫', text: 'Not on cultivated land.' },
      { type: 'warn', text: '⚠️ In the Lofoten, local restrictions exist due to overtourism. Check locally.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '⛴️', name: 'Coastal ferries', detail: 'Free for pedestrians since 2024', price: 'free' },
        { emoji: '🚌', name: 'Vy Bus4You', detail: 'Affordable intercity buses', price: '' },
        { emoji: '🚌', name: 'FlixBus', detail: 'Some routes in Norway', price: 'from 5 EUR' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mar', level: 'bad' },
        { name: 'Apr', level: 'ok' }, { name: 'May', level: 'good' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Aug', level: 'great' }, { name: 'Sep', level: 'ok' },
        { name: 'Oct', level: 'bad' }, { name: 'Nov', level: 'bad' }, { name: 'Dec', level: 'bad' },
      ]},
      { type: 'text', text: 'June to August: midnight sun north of the Arctic Circle. Nearly endless daylight. September: shoulder season (colder, less traffic). Winter: extremely difficult (polar night, cold, ice, very few cars).' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Norwegians are reserved at first contact but helpful. In the north, people are noticeably warmer and more welcoming. Drivers sometimes make a detour to get you to the right spot.' },
      { type: 'sub', title: 'Events' },
      { type: 'event', items: [
        { month: 'May', day: '17', name: 'Syttende Mai', desc: 'National Day. Parades, traditional costumes throughout the country.' },
        { month: 'Jun', day: '23', name: 'Sankthansaften', desc: 'Midsummer bonfires on beaches and fjords.' },
        { month: 'Jul', day: '⟳', name: 'Midnight Sun Marathon (Tromsø)', desc: 'Marathon under the midnight sun.' },
      ]},
    ]},
  },

  // ==================== SWEDEN ====================
  SE: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Hitchhiking is legal in Sweden. Forbidden on motorways but allowed at ramps and petrol stations. The reputation of being "a country where it is illegal" is a myth: nobody will bother you.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Sweden has a bad reputation among hitchhikers, but experienced travellers say "it is really not as bad as everyone says". Average waiting time: ~30 minutes. The north is significantly easier than the south.' },
      { type: 'text', text: 'Feedback is mostly positive, even solo. The direct approach at petrol stations works better than thumbing by the road.' },
      { type: 'tip', text: '💡 Large petrol stations (Rasta) along the motorways are the best hitchhiking spots.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Very safe country. No incidents reported by hitchhikers. The main risk is long distances in the north with few cars.' },
      { type: 'sub', title: 'Emergency numbers' },
      { type: 'kv', items: [{ k: 'Emergency', v: '112' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Sweden is one of the most egalitarian countries in the world. Women are picked up faster than men. Scandinavia is described as "the perfect region to try hitchhiking as a woman".' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Almost all Swedes speak English fluently. No language barrier. The Swedish word for hitchhiking is "lifta".' },
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Expensive but slightly less than Norway. Discount supermarkets: Lidl, Willys, ICA Maxi. Cooking for yourself is essential.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Allemansrätten (the right of public access) has been enshrined in the Swedish Constitution since 1994. You can pitch your tent on any uncultivated land for 1 to 2 nights without permission.' },
      { type: 'sub', title: 'Rules' },
      { type: 'rule', icon: '✅', text: '1 to 2 nights in the same spot, not on fenced or cultivated land.' },
      { type: 'rule', icon: '✅', text: 'Picking berries, mushrooms and wild flowers is allowed.' },
      { type: 'rule', icon: '🚫', text: 'Stay 150 to 200 m from houses.' },
      { type: 'rule', icon: '🚫', text: 'Campfires only when conditions are safe (bans are frequent in summer).' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'FlixBus / FlixTrain', detail: 'Operates in Sweden', price: 'from 5 EUR' },
        { emoji: '🚃', name: 'SJ (Swedish trains)', detail: 'Book in advance for discounts', price: '' },
        { emoji: '🤝', name: 'Skjutsgruppen.nu', detail: 'Swedish ride-sharing platform', price: '' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mar', level: 'ok' },
        { name: 'Apr', level: 'ok' }, { name: 'May', level: 'good' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Aug', level: 'great' }, { name: 'Sep', level: 'good' },
        { name: 'Oct', level: 'ok' }, { name: 'Nov', level: 'bad' }, { name: 'Dec', level: 'bad' },
      ]},
      { type: 'text', text: 'June to August: long days, mild weather, peak traffic. Watch out for mosquitoes in Lapland (June to July). Winter: difficult (-20°C in the north, darkness).' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Swedes are introverted and will not approach you, but they are helpful when YOU approach them. In the north, people "will not let a stranger freeze outside". Take your shoes off when entering someone\'s home or a lorry cabin.' },
      { type: 'sub', title: 'Events' },
      { type: 'event', items: [
        { month: 'Jun', day: '⟳', name: 'Midsommar', desc: 'Summer solstice. Dancing around the maypole, flower crowns, unofficial national holiday.' },
        { month: 'Aug', day: '⟳', name: 'Crayfish Party (Kräftskiva)', desc: 'Outdoor crayfish parties across the country.' },
        { month: 'Dec', day: '13', name: 'Lucia', desc: 'Candlelight processions, traditional songs.' },
      ]},
    ]},
  },

  // ==================== ICELAND ====================
  IS: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Hitchhiking is perfectly legal and socially accepted in Iceland. No restrictions. It is a common practice, especially on Route 1 (Ring Road).' },
      { type: 'warn', text: '⚠️ Border police may ask for proof of sufficient funds (bank card or cash). Entry can be refused without it.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Iceland is very easy for hitchhiking in summer. Average waiting time: 5 to 30 minutes on the Ring Road. Both Icelanders AND tourists in rental cars stop.' },
      { type: 'sub', title: 'By area' },
      { type: 'kv', items: [
        { k: 'Ring Road (Route 1)', v: 'Very easy', color: 'green' },
        { k: 'Reykjavik → Akranes (bus + hitch)', v: 'Easy', color: 'green' },
        { k: 'Westfjords', v: 'Very difficult (reserved locals)', color: 'red' },
        { k: 'Interior / Highlands', v: 'Nearly impossible (no traffic)', color: 'red' },
      ]},
      { type: 'text', text: 'Don\'t try to leave Reykjavik by hitchhiking directly. Take a bus to Akranes and start from there. N1 stations are the social centres of villages and good spots.' },
      { type: 'tip', text: '💡 Samferda.is: Icelandic ride-sharing platform where you can share fuel costs.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Iceland is considered the safest country in the world for solo female travellers. Crime is virtually non-existent. The real danger is the weather: it changes within minutes, and being stranded far from a town in Arctic conditions is the main risk.' },
      { type: 'sub', title: 'Emergency numbers' },
      { type: 'kv', items: [{ k: 'Emergency', v: '112' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Iceland is the world reference for gender equality and safety for women. Hitchhiking works perfectly for women alone. Drivers often want to help you even more when you are a woman.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Almost all Icelanders speak English fluently. No language barrier. Tourists of all nationalities also offer rides.' },
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Iceland is the most expensive Nordic country. Minimum budget: 60 to 100 EUR/day. Hitchhiking is the key strategy to reduce the biggest expense (car rental, which is very pricey). Currency: Icelandic króna (ISK). The cheapest supermarket is Bonus.' },
      { type: 'sub', title: 'Accommodation' },
      { type: 'kv', items: [
        { k: 'Official campsites', v: '5 to 25 EUR/night' },
        { k: 'Hostels (Reykjavik dorm)', v: 'from ~30 EUR/night' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q', 'a'], blocks: [
      { type: 'text', text: 'Wild camping with a tent is allowed only in uninhabited areas, for 1 night, with a maximum of 3 tents, and if there is no sign prohibiting it. Campervans MUST stay at official campsites (2015 law).' },
      { type: 'warn', text: '⚠️ Since 2017, rules have been tightened due to the behaviour of some tourists. In inhabited areas (southern Iceland), camping outside campsites is forbidden.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'No railway in Iceland. Buses exist but are expensive and infrequent.' },
      { type: 'sub', title: 'Options' },
      { type: 'transport', items: [
        { emoji: '🤝', name: 'Samferda.is', detail: 'Icelandic ride-sharing, fuel cost sharing', price: '' },
        { emoji: '✈️', name: 'Domestic flights', detail: 'Reykjavik-Akureyri (Icelandair Connect)', price: '' },
        { emoji: '⛴️', name: 'Smyril Line ferry', detail: 'Denmark → Faroe Islands → Iceland (Seyðisfjörður)', price: '' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mar', level: 'bad' },
        { name: 'Apr', level: 'bad' }, { name: 'May', level: 'ok' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Aug', level: 'great' }, { name: 'Sep', level: 'ok' },
        { name: 'Oct', level: 'bad' }, { name: 'Nov', level: 'bad' }, { name: 'Dec', level: 'bad' },
      ]},
      { type: 'text', text: 'June to August exclusively. Nearly 24h of daylight, more traffic (tourists), mild temperatures (10 to 15°C). May and September possible but colder and fewer cars. Winter: nearly impossible (darkness, storms, very few cars).' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Icelanders are welcoming and trusting thanks to historical isolation and a small population (~370,000). Tourism is a major industry, so locals are used to visitors. Icelanders in big 4x4s stop more often than tourists in rental cars (often full).' },
      { type: 'sub', title: 'Events' },
      { type: 'event', items: [
        { month: 'Feb', day: '⟳', name: 'Þorrablót', desc: 'Viking food festival with traditional dishes.' },
        { month: 'Jun', day: '17', name: 'National Day', desc: 'Independence celebration, parades.' },
        { month: 'Aug', day: '⟳', name: 'Þjóðhátíð (Vestmannaeyjar)', desc: 'Biggest festival in Iceland, music and bonfires.' },
      ]},
    ]},
  },

  // ==================== FINLAND ====================
  FI: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Hitchhiking is legal in Finland. Forbidden on motorways (moottoritie) and some expressways (moottoriliikennetie). Allowed at access ramps (often with a bus stop) and petrol stations.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Finland is a mixed country for hitchhiking. Finns are introverted and hesitate to pick up strangers. The south and cities (Helsinki, Tampere) are difficult. But the further north you go (Lapland), the easier it gets.' },
      { type: 'sub', title: 'The Lapland paradox' },
      { type: 'text', text: 'In Lapland, there may be only 5 cars per hour on secondary roads. But drivers travel long distances and appreciate the company. They stop more easily, especially in bad weather (compassion).' },
      { type: 'tip', text: '💡 Finnish drivers need a safe space to stop. Position yourself where there is clearly room to pull over.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Finland is one of the safest countries in the world. No incidents reported by hitchhikers. Laplanders are described as "among the friendliest and most helpful people".' },
      { type: 'sub', title: 'Emergency numbers' },
      { type: 'kv', items: [{ k: 'Emergency', v: '112' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Finland and Scandinavia are described as "the perfect region to try hitchhiking as a woman". The status of women in Nordic society is very high and you will not be harassed anywhere.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Most Finns speak English, especially young people and in cities. Finnish and Swedish are the official languages. Finnish is very different from Scandinavian languages and difficult to learn.' },
      { type: 'phrase', items: [
        { local: 'Kiitos paljon', meaning: 'Thank you very much' },
        { local: 'Kyyti', meaning: 'A ride' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Groceries are very expensive compared to the rest of Europe. The combination of hitchhiking + wild camping (Jokamiehenoikeus) + cooking on a stove is the budget strategy.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Jokamiehenoikeus (everyman\'s right) allows free camping on uncultivated land. You can pick berries, mushrooms and fish with a rod.' },
      { type: 'rule', icon: '✅', text: 'Free camping on uncultivated land, 1 to 2 nights.' },
      { type: 'rule', icon: '🚫', text: 'Campfires are NOT part of Jokamiehenoikeus. Only at designated spots.' },
      { type: 'rule', icon: '🚫', text: 'In national parks: only in designated tent areas.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Onnibus', detail: 'Long-distance buses, very affordable', price: 'from 1 EUR' },
        { emoji: '🚌', name: 'FlixBus', detail: 'Some routes in Finland', price: 'from 5 EUR' },
        { emoji: '🚃', name: 'VR (Finnish trains)', detail: 'Book in advance for discounts', price: '' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mar', level: 'bad' },
        { name: 'Apr', level: 'ok' }, { name: 'May', level: 'good' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Aug', level: 'good' }, { name: 'Sep', level: 'ok' },
        { name: 'Oct', level: 'bad' }, { name: 'Nov', level: 'bad' }, { name: 'Dec', level: 'bad' },
      ]},
      { type: 'warn', text: '⚠️ In June and July in Lapland, mosquitoes are a major problem. Bring repellent and a mosquito net.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Finns are reserved but encounters are warm once contact is made. In Lapland, people are particularly welcoming. The hospitality is sincere.' },
      { type: 'sub', title: 'Events' },
      { type: 'event', items: [
        { month: 'Feb', day: '⟳', name: 'Jokkmokk Market', desc: 'Historic Sami market in Lapland (also on the Swedish side).' },
        { month: 'Jun', day: '⟳', name: 'Juhannus (Midsummer)', desc: 'Summer solstice, bonfires, saunas, lakes.' },
        { month: 'Jul', day: '⟳', name: 'Wife Carrying Championship', desc: 'Wife carrying race in Sonkajärvi. Yes, it\'s real.' },
        { month: 'Dec', day: '⟳', name: 'Santa Claus Village (Rovaniemi)', desc: 'Winter tourism, Northern Lights.' },
      ]},
    ]},
  },

  // ==================== DENMARK ====================
  DK: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Hitchhiking is legal in Denmark except on motorways (pedestrians forbidden). You can hitchhike from access ramps. Border checks possible: always have your passport.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Denmark is one of the best countries in Europe for hitchhiking, comparable to Serbia. Waiting time: 10 to 20 minutes maximum. People are relaxed and take you where you want.' },
      { type: 'text', text: 'Rides are short (a few dozen km to the next town) so plan for several lifts per day. Ferries are part of the experience: they are often free for pedestrians or charged per vehicle.' },
      { type: 'tip', text: '💡 The flat terrain and dense road network make Denmark very accessible. It is an excellent country to start hitchhiking.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Very safe country. Danish drivers are described as friendly, generous and open. Young, old, men, women: everyone stops.' },
      { type: 'sub', title: 'Emergency numbers' },
      { type: 'kv', items: [{ k: 'Emergency', v: '112' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Denmark is safe for women hitchhiking alone. Rides come from people of all ages and genders. The practice is normalised enough that everyone stops.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'ALL drivers speak English. In the west and south of the country, many also speak German. Communication is never a problem.' },
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Denmark is the cheapest of the 5 Nordic countries, but still expensive by European standards. Discount supermarkets: Netto, Rema 1000, Lidl. Street food (hot dogs, shawarma) is relatively affordable.' },
    ]},
    sleep: { filterTypes: ['b', 'q', 'a'], blocks: [
      { type: 'text', text: 'Denmark does NOT have a right of public access to nature like Norway or Sweden. Wild camping is forbidden (fine 40 to 135 EUR). But free legal alternatives exist.' },
      { type: 'sub', title: 'Free alternatives' },
      { type: 'rule', icon: '✅', text: 'Fri Teltning: 275+ free camping zones in state forests. 1 night max, 2 small tents max, no car.' },
      { type: 'rule', icon: '✅', text: 'Shelterplads: free forest shelters available in many forests.' },
      { type: 'rule', icon: '✅', text: 'Naturlagerplätze: nature sites with farmers or on communal land, ~3 EUR/night, max 2 nights.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'FlixBus', detail: 'Extensive network in Denmark', price: 'from 5 EUR' },
        { emoji: '🚃', name: 'DSB (Danish trains)', detail: 'Orange tickets (advance purchase = very cheap)', price: '' },
        { emoji: '⛴️', name: 'Ferries', detail: 'Between islands, some free for pedestrians', price: '' },
        { emoji: '🚲', name: 'Bicycle', detail: 'Denmark is flat with excellent cycle paths', price: '' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mar', level: 'ok' },
        { name: 'Apr', level: 'good' }, { name: 'May', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Aug', level: 'great' }, { name: 'Sep', level: 'good' },
        { name: 'Oct', level: 'ok' }, { name: 'Nov', level: 'bad' }, { name: 'Dec', level: 'bad' },
      ]},
      { type: 'text', text: 'May to September. Denmark has a milder climate than the other Nordic countries. Summer: 15 to 22°C, long days. Winter: not recommended (cold, wet, dark, few cars).' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Danes are the most relaxed of all Nordics when it comes to hitchhiking. Friendly, open, helpful. It is common to be offered coffee and to benefit from detours to be dropped at the right spot.' },
      { type: 'sub', title: 'Events' },
      { type: 'event', items: [
        { month: 'Jun', day: '23', name: 'Sankt Hans Aften', desc: 'Midsummer bonfires on beaches. National tradition.' },
        { month: 'Jul', day: '⟳', name: 'Roskilde Festival', desc: 'Biggest music festival in Northern Europe, 130,000 people.' },
        { month: 'Dec', day: '⟳', name: 'Christmas Markets (Tivoli)', desc: 'Tivoli Gardens in Copenhagen, magical.' },
      ]},
    ]},
  },

  // ==================== UNITED KINGDOM ====================
  GB: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Hitchhiking is legal in the United Kingdom. Walking on motorways is forbidden. Hitchhike from the bottom of slip roads and at motorway services.' },
      { type: 'sub', title: 'By nation' },
      { type: 'rule', icon: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', text: 'Scotland: allowed even on dual carriageway expressways (A9, A90). Wild camping is legal.' },
      { type: 'rule', icon: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', text: 'Wales: no specific restrictions. Welcoming rural mentality.' },
      { type: 'rule', icon: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', text: 'England: legal but less practised and less easy.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'The UK is very variable by region. Few drivers stop in England, but in Scotland and Wales it is significantly easier.' },
      { type: 'sub', title: 'By region' },
      { type: 'kv', items: [
        { k: 'Scottish Highlands', v: 'Excellent (1 in 5 cars)', color: 'green' },
        { k: 'Rural Wales', v: 'Good and pleasant', color: 'green' },
        { k: 'South-west England', v: 'Decent', color: 'green' },
        { k: 'Northern England', v: 'Average', color: 'amber' },
        { k: 'South-east / London', v: 'Very difficult', color: 'red' },
      ]},
      { type: 'text', text: 'The NC500 (North Coast 500) in Scotland is excellent in summer: tourists from around the world. Fort William is an ideal hub. In England, former students from the 70s and 80s are the most likely to stop.' },
      { type: 'tip', text: '💡 Use motorway names (M4, M1) on your sign rather than city names. This is the British convention for long-distance hitchhiking.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'The UK is generally safe. Media fear far exceeds the actual risk. Police are generally understanding and may even help you find a better spot.' },
      { type: 'sub', title: 'Emergency numbers' },
      { type: 'kv', items: [{ k: 'Emergency', v: '999 or 112' }] },
    ]},
    women: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'Men stop more often than women to pick up hitchhikers. Paradoxically, many drivers say they would more readily stop for a woman than for a lone man.' },
      { type: 'text', text: 'Female travellers have crossed Scotland and Wales alone without any problems. Wild camping in Scotland is legal and very safe.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'No barrier. English is everywhere. Some regional accents (Scottish Highlands, rural Wales) can be thick, but communication is never a problem.' },
      { type: 'text', text: 'In the UK, a ride is called a "lift" and a truck is called a "lorry".' },
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'The UK is expensive, but hitchhiking helps considerably. Currency: pound sterling (GBP).' },
      { type: 'sub', title: 'Eating cheap' },
      { type: 'rule', icon: '🛒', text: 'Aldi and Lidl for groceries. Early-bird menus in restaurants before 6pm.' },
      { type: 'sub', title: 'Accommodation' },
      { type: 'kv', items: [{ k: 'YHA hostels (dorm)', v: '15 to 30 GBP/night' }] },
    ]},
    sleep: { filterTypes: ['b', 'q', 'a'], blocks: [
      { type: 'text', text: 'Rules vary considerably by nation.' },
      { type: 'sub', title: 'Scotland' },
      { type: 'rule', icon: '✅', text: 'Wild camping LEGAL almost everywhere (Scottish Outdoor Access Code). Exception: Loch Lomond park in summer (permit required).' },
      { type: 'rule', icon: '✅', text: 'Bothies: semi-abandoned shepherd huts, free, maintained by the Mountain Bothies Association.' },
      { type: 'sub', title: 'England and Wales' },
      { type: 'rule', icon: '🚫', text: 'Wild camping technically forbidden (civil offence, not criminal). Exception: Dartmoor National Park (designated areas).' },
      { type: 'rule', icon: '✅', text: 'Nearly Wild Camping: network of 100+ sites welcoming nature-seeking campers.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Megabus', detail: 'Very cheap intercity coaches', price: 'from 1 GBP' },
        { emoji: '🚌', name: 'National Express', detail: 'Largest long-distance coach network', price: 'from 2 GBP' },
        { emoji: '🚌', name: 'FlixBus', detail: 'Major routes', price: 'from 5 GBP' },
        { emoji: '🚗', name: 'BlaBlaCar', detail: 'Ride-sharing', price: '' },
      ]},
      { type: 'tip', text: '💡 Ferries (Dover, Holyhead) charge per vehicle. You can cross for free by finding a driver with space.' },
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mar', level: 'ok' },
        { name: 'Apr', level: 'good' }, { name: 'May', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'good' }, { name: 'Aug', level: 'good' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'ok' }, { name: 'Nov', level: 'bad' }, { name: 'Dec', level: 'bad' },
      ]},
      { type: 'warn', text: '⚠️ In Scotland, midges are fierce from May to September, worst in July and August. Bring good repellent.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Hitchhiking was very popular in the UK in the 70s and 80s (50% of over-55s have done it). Only 7% of 18 to 24 year olds have tried it. The practice is seen as outdated but those who stop are often nostalgic former hitchhikers.' },
      { type: 'sub', title: 'What works' },
      { type: 'rule', icon: '😁', text: 'A big smile and eye contact with each driver. Wearing distinctive clothing draws positive attention.' },
      { type: 'rule', icon: '📋', text: 'At services, approach drivers entering/leaving the building, not at the pump ("health and safety").' },
      { type: 'sub', title: 'Events' },
      { type: 'event', items: [
        { month: 'Jun', day: '⟳', name: 'Glastonbury Festival', desc: 'Biggest music festival in the world, Somerset.' },
        { month: 'Aug', day: '⟳', name: 'Edinburgh Fringe', desc: 'Biggest arts festival in the world, 3 weeks.' },
        { month: 'Nov', day: '5', name: 'Bonfire Night', desc: 'Fireworks across the country.' },
      ]},
    ]},
  },

  // ==================== IRELAND ====================
  IE: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Hitchhiking is legal in Ireland except on motorways. In practice, even on expressways, the police (Gardaí) rarely intervene. If they do, it is to direct you to a safer spot.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Ireland is one of the best countries in Europe for hitchhiking. Average waiting time is 5 minutes. Cars sometimes brake when they see you by the roadside, without you even making a gesture.' },
      { type: 'sub', title: 'Why it works so well' },
      { type: 'text', text: 'Many rural areas have no public transport. Giving lifts is part of daily life. The Irish are sociable and enjoy conversation. A new hitchhiker = a new chat partner.' },
      { type: 'sub', title: 'By area' },
      { type: 'kv', items: [
        { k: 'West coast (Wild Atlantic Way)', v: 'Excellent', color: 'green' },
        { k: 'Small rural towns', v: 'Excellent (curious people)', color: 'green' },
        { k: 'National roads (R)', v: 'Very good', color: 'green' },
        { k: 'Motorway roundabouts', v: 'Good (< 5 min)', color: 'green' },
        { k: 'Dublin / Cork / Limerick', v: 'Difficult to get started', color: 'amber' },
      ]},
      { type: 'tip', text: '💡 Many short rides are faster than waiting for a long one. A sign with the next town name reduces waiting time. Leave early in the morning to catch the lorries.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Ireland is considered one of the safest countries in the world for travellers. Hitchhiking is an ancestral tradition and generally very safe.' },
      { type: 'sub', title: 'Emergency numbers' },
      { type: 'kv', items: [
        { k: 'Emergency', v: '112 or 999' },
        { k: 'Gardaí (police)', v: '112' },
      ]},
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Ireland is considered one of the safest countries for solo female travellers. Experiences are overwhelmingly positive. Standard precautions apply.' },
      { type: 'text', text: 'The Wild Atlantic Way is ideal for hitchhiking in pairs, with waiting times of 5 to 15 minutes.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'English is the everyday language throughout Ireland. Irish Gaelic (Gaeilge) is spoken daily by only ~4% of the population, in Gaeltacht areas (west coast). Even there, everyone speaks English.' },
      { type: 'phrase', items: [
        { local: 'Dia dhuit', meaning: 'Hello (in Gaelic)' },
        { local: 'Go raibh maith agat', meaning: 'Thank you (in Gaelic)' },
      ]},
      { type: 'tip', text: '💡 A few words of Gaelic in the rural west create instant warmth with locals.' },
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Ireland is moderately expensive. The combination of hitchhiking + camping + invitations from locals makes travel very affordable.' },
      { type: 'sub', title: 'Accommodation' },
      { type: 'kv', items: [
        { k: 'Hostels (dorm)', v: '20 to 50 EUR/night' },
        { k: 'B&B with breakfast', v: '60 to 80 EUR/night' },
      ]},
      { type: 'rule', icon: '🛒', text: 'Aldi and Lidl for groceries. Early-bird menus in restaurants before 6pm.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wild camping is tolerated and largely unregulated in Ireland. Empty fields are available "within minutes of any town". Asking permission from farmers is recommended but they often don\'t mind.' },
      { type: 'rule', icon: '✅', text: 'Free camping in uncultivated fields (with implicit permission).' },
      { type: 'rule', icon: '🚫', text: 'Avoid fields with crops or livestock.' },
      { type: 'rule', icon: '🚫', text: 'No visible fire from roads or houses.' },
      { type: 'warn', text: '⚠️ Ireland is very wet. A tent with high waterproofing (>3000mm) is essential. The challenge is not heavy rain but persistent drizzle that can last for days.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Bus Éireann', detail: 'National bus service', price: '' },
        { emoji: '🚌', name: 'Dublin Coach / GoBus / Citylink', detail: 'Cheaper intercity buses', price: '' },
        { emoji: '🚗', name: 'BlaBlaCar', detail: 'Active in Ireland', price: '' },
        { emoji: '🚃', name: 'Irish Rail', detail: 'Limited network, moderate prices', price: '' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mar', level: 'ok' },
        { name: 'Apr', level: 'good' }, { name: 'May', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'good' }, { name: 'Aug', level: 'good' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'bad' }, { name: 'Dec', level: 'bad' },
      ]},
      { type: 'text', text: 'May to June: best weather, longest days. September to October: fewer tourists, lower prices, autumn colours. Irish weather is extremely unpredictable: it can rain at any time of year.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Hitchhiking is deeply rooted in Irish culture. In rural areas without public transport, giving lifts has been part of daily life for decades. The Irish are sociable and welcoming.' },
      { type: 'sub', title: 'What works' },
      { type: 'rule', icon: '🗣️', text: 'The Irish love to chat. Be open to conversation, ask questions about the area.' },
      { type: 'rule', icon: '🎒', text: 'Keep your bag small. Big bags scare people. Solo or in pairs only (3+ = nearly impossible).' },
      { type: 'sub', title: 'Events' },
      { type: 'event', items: [
        { month: 'Mar', day: '17', name: 'St Patrick\'s Day', desc: 'National holiday. Celebrations across the country and worldwide.' },
        { month: 'May', day: '⟳', name: 'Fleadh Cheoil', desc: 'Traditional Irish music festival.' },
        { month: 'Sep', day: '⟳', name: 'Galway Oyster Festival', desc: 'Oyster festival, the oldest food festival in Ireland.' },
        { month: 'Oct', day: '⟳', name: 'Bram Stoker Festival (Dublin)', desc: 'Halloween festival. The birthplace of Halloween is Irish.' },
      ]},
      { type: 'tip', text: '💡 All of Irish society participates in the hitchhiking tradition: from farmers to IT workers, everyone stops.' },
    ]},
  },

  // ==================== CROATIA ====================
  HR: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Hitchhiking is legal in Croatia. You can hitchhike at toll stations. Police generally do not bother with it.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Moderate to easy in summer on the coast (rarely more than 20 min wait). Difficult in winter when coastal towns become "ghost towns". Toll stations are the best spots.' },
      { type: 'sub', title: 'Coastal tip' },
      { type: 'text', text: 'Secondary roads along the coast work better than motorways because locals use them to avoid tolls. Border queues at weekends (10+ km) create unique opportunities.' },
      { type: 'warn', text: '⚠️ LANDMINES in central Croatia (not the coast). Always check the mine map (misportal.hcr.hr) before leaving marked roads.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Croatia is a safe country for hitchhiking. Coastal roads are well travelled in summer and drivers are welcoming towards travellers.' },
      { type: 'sub', title: 'Use SpotHitch for your safety' },
      { type: 'rule', icon: '🛡️', text: 'Activate Guardian Mode before every trip. A trusted person follows your position in real time.' },
      { type: 'rule', icon: '🆘', text: 'Set up SOS mode with your contacts. One tap triggers a triple alert (push, SMS, call).' },
      { type: 'rule', icon: '📱', text: 'Take a photo of the licence plate and send it to someone before getting in.' },
      { type: 'rule', icon: '🎒', text: 'Keep your bag accessible (on your lap or at your feet), never in the boot.' },
      { type: 'sub', title: 'Country tips' },
      { type: 'rule', icon: '⛽', text: 'OMV and INA petrol stations are excellent spots to approach drivers.' },
      { type: 'rule', icon: '🏖️', text: 'In summer, the Dalmatian coastal roads have heavy traffic. Take advantage of it to progress quickly.' },
      { type: 'sub', title: 'Emergency numbers' },
      { type: 'kv', items: [{ k: 'Emergency', v: '112' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Croatia is considered an excellent destination for solo female travellers. The sense of safety is high. For hitchhiking, travelling in pairs is recommended.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Croatian is the official language. 95% of 15 to 34 year olds speak a foreign language (mainly English). Italian is widely known on the coast.' },
      { type: 'phrase', items: [
        { local: 'Mogu li dobiti prijevoz do...?', meaning: 'Can I get a ride to...?' },
        { local: 'Hvala!', meaning: 'Thank you!' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'More expensive than other Balkan countries, especially in summer on the coast. Burek: ~1 EUR. Hostels: 15 to 25 EUR/night. Meals: 5 to 10 EUR.' },
    ]},
    sleep: { filterTypes: ['b', 'q', 'a'], blocks: [
      { type: 'text', text: 'Wild camping is not allowed (fines). Couchsurfing works well. Affordable campsites available. Visit in May/June/September for lower prices.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Intercity buses', detail: 'Extensive and affordable network', price: '' },
        { emoji: '⛴️', name: 'Catamarans for islands', detail: 'Faster and cheaper than car ferries', price: '' },
        { emoji: '🚗', name: 'BlaBlaCar (blablacar.hr)', detail: 'Active in Croatia', price: '' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mar', level: 'ok' },
        { name: 'Apr', level: 'good' }, { name: 'May', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'good' }, { name: 'Aug', level: 'good' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'ok' }, { name: 'Nov', level: 'bad' }, { name: 'Dec', level: 'bad' },
      ]},
      { type: 'text', text: 'May to June and September: ideal (good weather, less crowded, cheaper). July and August: easy for rides but very crowded and expensive on the coast.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Croats are described as "extremely open, friendly and hospitable". The 3 S\'s of hitchhiking in Croatia: smile, sunscreen and a sheet with your destination.' },
      { type: 'event', items: [
        { month: 'Jul', day: '⟳', name: 'Ultra Europe (Split)', desc: 'Electronic music festival, 150,000 visitors.' },
        { month: 'Jul-Aug', day: '⟳', name: 'Dubrovnik Summer Festival', desc: 'Theatre, music, dance over 6 weeks.' },
      ]},
    ]},
  },

  // ==================== SLOVENIA ====================
  SI: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Hitchhiking is legal and practised in Slovenia. Walking across motorways is forbidden. The country is small enough to cross in ~3 hours.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Good country for hitchhiking. Waiting time usually under 15 minutes. Drivers are happy to see hitchhikers and often tell their own hitchhiking stories from their youth.' },
      { type: 'tip', text: '💡 Slovenia is home to the world\'s only Hitchhiking Museum.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Slovenia is very safe for hitchhiking. It is a small, welcoming country where people stop easily, often out of nostalgia for their own travels.' },
      { type: 'sub', title: 'Use SpotHitch for your safety' },
      { type: 'rule', icon: '🛡️', text: 'Activate Guardian Mode before every trip. A trusted person follows your position in real time.' },
      { type: 'rule', icon: '🆘', text: 'Set up SOS mode with your contacts. One tap triggers a triple alert (push, SMS, call).' },
      { type: 'rule', icon: '📱', text: 'Take a photo of the licence plate and send it to someone before getting in.' },
      { type: 'rule', icon: '🎒', text: 'Keep your bag accessible (on your lap or at your feet), never in the boot.' },
      { type: 'sub', title: 'Country tips' },
      { type: 'rule', icon: '🗺️', text: 'The country is small: you can cross it in 3 hours. Every lift counts.' },
      { type: 'rule', icon: '😊', text: 'Drivers are very open. Do not hesitate to start a conversation, they love sharing their tips.' },
      { type: 'sub', title: 'Emergency numbers' },
      { type: 'kv', items: [{ k: 'Emergency', v: '112' }] },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Excellent English proficiency. Most Slovenians also speak German and some Italian. Two regional greetings: "Živjo" (Ljubljana) and "Zdravo" (Maribor).' },
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'More expensive than other Balkan countries but cheaper than Western Europe. Ljubljana bike-sharing: 1 EUR/week or 3 EUR/YEAR. Bus: 1.30 EUR (90 min). Hostels: 15 to 25 EUR/night.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wild camping officially forbidden but the law is rarely enforced as long as you do not make a fire. Ask owners for permission to camp in their garden. Couchsurfing active in Ljubljana.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Bus', detail: 'Well-connected network', price: '' },
        { emoji: '🚗', name: 'BlaBlaCar', detail: 'Active in Slovenia', price: '' },
        { emoji: '🚲', name: 'Ljubljana bike-sharing', detail: 'Incredibly cheap', price: '3 EUR/year' },
      ]},
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Hitchhiking is culturally accepted and nostalgic in Slovenia. Drivers share their youth stories. Young people understand and practise it. Described as the most "hitchhiker-friendly" Balkan country.' },
      { type: 'event', items: [
        { month: 'Feb', day: '⟳', name: 'Kurentovanje (Ptuj)', desc: 'Biggest carnival in Slovenia, traditional Kurent masks.' },
        { month: 'Jun', day: '⟳', name: 'Ljubljana Festival', desc: 'Music, theatre, dance in the old town.' },
      ]},
    ]},
  },

  // ==================== ALBANIA ====================
  AL: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'No law against hitchhiking in Albania. Warning: near the Greek border (Kakavia), "taxi mafias" falsely claim hitchhiking is illegal to force you into a taxi. Walk past the taxi stations before thumbing.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Albania is a true hitchhiking paradise and the easiest Balkan country. Waiting time usually under 15 minutes. Cars pass roughly every 5 minutes on main roads.' },
      { type: 'sub', title: 'Crucial distinction' },
      { type: 'text', text: 'Many cars that stop are actually informal private taxis. Clearly say "autostop, jo lek" (hitchhiking, no money) while showing your thumb to avoid misunderstandings.' },
      { type: 'text', text: 'Some drivers spontaneously offer money TO hitchhikers. Albanian hospitality is legendary.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Albania is a safe country for hitchhiking. Drivers are remarkably hospitable and often make detours to help you.' },
      { type: 'sub', title: 'Use SpotHitch for your safety' },
      { type: 'rule', icon: '🛡️', text: 'Activate Guardian Mode before every trip. A trusted person follows your position in real time.' },
      { type: 'rule', icon: '🆘', text: 'Set up SOS mode with your contacts. One tap triggers a triple alert (push, SMS, call).' },
      { type: 'rule', icon: '📱', text: 'Take a photo of the licence plate and send it to someone before getting in.' },
      { type: 'rule', icon: '🎒', text: 'Keep your bag accessible (on your lap or at your feet), never in the boot.' },
      { type: 'sub', title: 'Country tips' },
      { type: 'rule', icon: '🏔️', text: 'Mountain roads are sometimes in poor condition. Check road conditions before heading out.' },
      { type: 'rule', icon: '🤝', text: 'Albanian hospitality is legendary. Accept coffee or raki with gratitude, it is a welcoming gesture.' },
      { type: 'sub', title: 'Emergency numbers' },
      { type: 'kv', items: [{ k: 'Emergency', v: '112' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Albania is safe for solo female travellers. Street harassment is infrequent. Hitchhiking works well for women alone, with waiting times of 15 to 20 minutes.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Albanian is a unique language (not Slavic). Young urban people speak English fluently. Don\'t expect English from those over 30. Italian and Greek are common. German understood by some (diaspora in Germany/Switzerland).' },
      { type: 'phrase', items: [
        { local: 'Autostop, jo lek', meaning: 'Hitchhiking, no money' },
        { local: 'Faleminderit', meaning: 'Thank you' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'The cheapest Balkan country. A 2-week stay is possible for under 200 EUR. Hostel: ~10 EUR/night with breakfast. Furgons (minibuses) cover the country for a few euros.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wild camping is officially allowed in Albania, one of the few European countries. Avoid national parks, reserves, private property and government buildings. Beaches north of Durrës are suitable for tent camping.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚐', name: 'Furgons (minibuses)', detail: 'Backbone of Albanian transport. No fixed schedule, wave them down.', price: '~3.50 EUR/120 km' },
        { emoji: '🚌', name: 'Regular buses', detail: 'Main routes between big cities', price: '' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mar', level: 'ok' },
        { name: 'Apr', level: 'good' }, { name: 'May', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'good' }, { name: 'Aug', level: 'good' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'ok' }, { name: 'Dec', level: 'bad' },
      ]},
      { type: 'text', text: 'May to June and September to October: ideal. Northern mountain roads can be impassable in winter.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Albanian hospitality is legendary. Drivers go kilometres out of their way to help, offer meals, raki, coffee, souvenirs and even money. The concept of "besa" (sacred code of honour and hospitality) is deeply rooted.' },
      { type: 'event', items: [
        { month: 'Mar', day: '14', name: 'Dita e Verës (Elbasan)', desc: 'Spring festival, the oldest Albanian tradition.' },
        { month: 'Aug', day: '⟳', name: 'Kala Festival (Dhermi)', desc: 'Music festival on a beach of the Albanian Riviera.' },
      ]},
    ]},
  },

  // ==================== SERBIA ====================
  RS: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Hitchhiking on motorways is "frowned upon but you won\'t have problems". Police direct hitchhikers to exit ramps. Toll stations are considered normal and legal hitchhiking spots.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Difficult. Average waiting time: 2 to 3 hours. Approaching drivers directly at small petrol stations works much better than thumbing by the road. In daytime, it is doable. At night, it is very hard (poor road lighting).' },
      { type: 'tip', text: '💡 Best strategy in Serbia: alternate hitchhiking and cheap buses. Local buses between small towns serve as "stepping stones" when hitching is not working.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Safe in daytime. Serbian drivers are friendly once they stop.' },
      { type: 'warn', text: '⚠️ At night, attacks at parking areas are occasionally reported. Stop at 24h petrol stations or motels after dark.' },
      { type: 'kv', items: [{ k: 'Emergency', v: '112' }] },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Serbian is the main language (both Cyrillic and Latin alphabets). English is improving among young people but remains limited in rural areas. Speakers of Slavic languages (Czech, Slovak, Polish, Russian) have a linguistic advantage.' },
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Affordable compared to Hungary or Western Europe. Pljeskavica (local dish): 2 to 3 EUR. Hostel: 8 to 12 EUR/night. Flights to Niš: sometimes 10 EUR.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wild camping officially forbidden but "generally tolerated". Couchsurfing active in Belgrade. Hostels very affordable.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Bus', detail: 'Covers the whole country, affordable', price: '' },
        { emoji: '🚗', name: 'BlaBlaCar (blablacar.rs)', detail: 'Active in Serbia', price: '' },
      ]},
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Serbians are described as "friendly and very open to encounters" once contact is made. The challenge is getting them to stop. The mix of hitchhiking + cheap buses is the best strategy.' },
      { type: 'event', items: [
        { month: 'Jul', day: '⟳', name: 'EXIT Festival (Novi Sad)', desc: 'One of the biggest music festivals in Europe, in the Petrovaradin Fortress.' },
        { month: 'Aug', day: '⟳', name: 'Guča Trumpet Festival', desc: 'Trumpet and Balkan music festival. 600,000 visitors.' },
      ]},
    ]},
  },

  // ==================== BOSNIA AND HERZEGOVINA ====================
  BA: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Hitchhiking is legal in Bosnia and Herzegovina. Police will not cause you any problems.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Variable depending on sources and locations. Some travellers have never waited more than 10 minutes (Split-Mostar-Sarajevo road). Others have had very long waits. The low car ownership rate means fewer long-distance vehicles.' },
      { type: 'warn', text: '⚠️ LANDMINES. NEVER leave roads to go into bushes or abandoned structures in areas you don\'t know. Some houses are still booby-trapped from the war.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Bosnia is a safe country for hitchhiking. People are very welcoming towards foreign travellers.' },
      { type: 'sub', title: 'Use SpotHitch for your safety' },
      { type: 'rule', icon: '🛡️', text: 'Activate Guardian Mode before every trip. A trusted person follows your position in real time.' },
      { type: 'rule', icon: '🆘', text: 'Set up SOS mode with your contacts. One tap triggers a triple alert (push, SMS, call).' },
      { type: 'rule', icon: '📱', text: 'Take a photo of the licence plate and send it to someone before getting in.' },
      { type: 'rule', icon: '🎒', text: 'Keep your bag accessible (on your lap or at your feet), never in the boot.' },
      { type: 'sub', title: 'Country tips' },
      { type: 'rule', icon: '🛣️', text: 'Stick to marked roads in rural areas. Some country tracks are poorly maintained.' },
      { type: 'rule', icon: '☕', text: 'Accepting a Bosnian coffee is a sign of politeness. Drivers love sharing a moment with travellers.' },
      { type: 'sub', title: 'Emergency numbers' },
      { type: 'kv', items: [{ k: 'Emergency', v: '112' }] },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Bosnian, Croatian and Serbian are all spoken (mutually comprehensible). Many residents speak English thanks to post-war emigration. Mentioning where you are from helps build trust, as many Bosnians have relatives abroad.' },
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'One of the cheapest Balkan countries. Burek: ~1 EUR. Hostel in Sarajevo: 10 to 15 EUR/night. Cigarettes (<3 EUR/pack) are useful as a thank-you gift.' },
      { type: 'tip', text: '💡 "KM" on signs can mean the currency (Convertible Mark), not kilometres!' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wild camping officially forbidden but generally tolerated. Locals are incredibly hospitable: farmers offer showers and coffee to campers, drivers invite hitchhikers to sleep at their home.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Buses and trains are very cheap. Few motorways. The combination of hitchhiking + public transport is the recommended approach.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Bosnians are "very warm and friendly" with a pride in welcoming tourists. Drivers take hitchhikers home to eat and drink coffee, go past their own destination to drop you at a better spot.' },
      { type: 'rule', icon: '🚬', text: 'Offering a few cigarettes when getting out of the car is a powerful thank-you gesture that transcends language barriers.' },
      { type: 'event', items: [
        { month: 'Aug', day: '⟳', name: 'Sarajevo Film Festival', desc: 'International film festival founded during the siege.' },
      ]},
    ]},
  },

  // ==================== MONTENEGRO ====================
  ME: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'No specific legal restriction on hitchhiking found. No reports of police interference.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Difficult. Montenegro is regularly cited as one of the most difficult Balkan countries for hitchhiking. Montenegrins don\'t like picking up hitchhikers. Most travellers who succeed are picked up by Albanians or other foreigners, not locals.' },
      { type: 'text', text: 'Traffic is sparse, winding mountain roads make stopping difficult. The direct approach at petrol stations works better than thumbing by the road.' },
      { type: 'tip', text: '💡 The Kotor ferry is free and saves a lot of time reaching Podgorica.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Montenegro is a safe country for hitchhiking. Coastal roads are narrow and winding, so make sure you are clearly visible when thumbing.' },
      { type: 'sub', title: 'Use SpotHitch for your safety' },
      { type: 'rule', icon: '🛡️', text: 'Activate Guardian Mode before every trip. A trusted person follows your position in real time.' },
      { type: 'rule', icon: '🆘', text: 'Set up SOS mode with your contacts. One tap triggers a triple alert (push, SMS, call).' },
      { type: 'rule', icon: '📱', text: 'Take a photo of the licence plate and send it to someone before getting in.' },
      { type: 'rule', icon: '🎒', text: 'Keep your bag accessible (on your lap or at your feet), never in the boot.' },
      { type: 'sub', title: 'Country tips' },
      { type: 'rule', icon: '👀', text: 'On coastal roads, stand in a wide, visible spot, away from sharp bends.' },
      { type: 'rule', icon: '🌊', text: 'In summer, tourist traffic on the coast makes hitching easier. Use petrol stations to approach drivers.' },
      { type: 'sub', title: 'Emergency numbers' },
      { type: 'kv', items: [{ k: 'Emergency', v: '112' }] },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Montenegrin (essentially identical to Serbian/Bosnian/Croatian). Many people are more comfortable in Italian than English. Russian is also understood (many Russian residents in summer).' },
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Mid-range for the Balkans (more expensive than Albania/Bosnia, cheaper than Croatia). Hostels: 12 to 20 EUR/night. Meals: 5 to 8 EUR.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wild camping officially forbidden but tolerated if you behave normally and avoid beaches and tourist areas.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Bus', detail: 'Most reliable option, covers most routes', price: '' },
        { emoji: '⛴️', name: 'Kotor Ferry', detail: 'Free, essential for reaching Podgorica', price: 'free' },
      ]},
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Mixed hospitality. The welcome can be cold compared to neighbouring countries, and most encounters are with expats rather than locals. Some Montenegrins are very welcoming though. The consensus: Montenegro is not a hitchhiking-friendly culture compared to its neighbours.' },
    ]},
  },

  // ==================== NORTH MACEDONIA ====================
  MK: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'No specific law against hitchhiking found. No reports of police interference.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Easy. Described as "one of the best European countries for hitchhiking". Waiting time usually under 20 to 30 minutes. At petrol stations near Skopje, rides come in 5 to 10 minutes.' },
      { type: 'text', text: 'Challenge: rural/mountain roads with very low traffic (fewer than 100 cars/hour). When traffic is low, prepare to walk a long time with your thumb out.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'North Macedonia is a safe country for hitchhiking. The locals are welcoming and often protective towards travellers.' },
      { type: 'sub', title: 'Use SpotHitch for your safety' },
      { type: 'rule', icon: '🛡️', text: 'Activate Guardian Mode before every trip. A trusted person follows your position in real time.' },
      { type: 'rule', icon: '🆘', text: 'Set up SOS mode with your contacts. One tap triggers a triple alert (push, SMS, call).' },
      { type: 'rule', icon: '📱', text: 'Take a photo of the licence plate and send it to someone before getting in.' },
      { type: 'rule', icon: '🎒', text: 'Keep your bag accessible (on your lap or at your feet), never in the boot.' },
      { type: 'sub', title: 'Country tips' },
      { type: 'rule', icon: '🛣️', text: 'Main roads are in good condition and well connected between major cities.' },
      { type: 'rule', icon: '🙏', text: 'Locals love helping travellers. A smile and a sign with your destination are enough.' },
      { type: 'sub', title: 'Emergency numbers' },
      { type: 'kv', items: [{ k: 'Emergency', v: '112' }] },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Macedonian (Slavic) and Albanian are the main languages. English is improving but remains limited outside Skopje and Ohrid. Plate abbreviations are useful: SK=Skopje, OH=Ohrid, BT=Bitola.' },
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Very affordable. Among the cheapest Balkan countries. Hostels: 8 to 12 EUR/night.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wild camping officially forbidden but "generally tolerated" (same pattern as Serbia/Bosnia). Travellers are sometimes invited to sleep with families.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Bus network covering main routes. Furgon-type minibuses in some areas. International buses to Albania (Ohrid-Pogradec), Kosovo, Serbia and Greece.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'People are "extremely friendly and particularly fascinated by travellers". Drivers show genuine interest and offer help without expecting payment. The atmosphere is described as "gemächlich" (unhurried, relaxed).' },
      { type: 'event', items: [
        { month: 'Jul', day: '⟳', name: 'Ohrid Summer Festival', desc: 'Music, theatre and dance by Lake Ohrid, a UNESCO site.' },
      ]},
    ]},
  },

  // ==================== POLAND ====================
  PL: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Hitchhiking is legal in Poland on normal roads. It was officially organised by the National Tourism Office from 1958 to the mid-90s ("Akcja Autostop"), with booklets, coupons and a lottery for drivers.' },
      { type: 'rule', icon: '🚫', text: 'Forbidden on motorways and expressways. Allowed at petrol stations, tolls and access ramps.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Historically one of the most hitchhiking-friendly countries in Europe. Average waiting time: 15 min to 1h. However, recent reports (2023) show decline: 30 min to 3h waits, Poles are increasingly reluctant to stop outside designated areas.' },
      { type: 'sub', title: 'Network tip' },
      { type: 'text', text: 'Poland has "too many roads" (4 to 5 possible routes for each destination). Accept rides in the general direction rather than the exact route. Lorry drivers sometimes use CB radio to arrange your next ride.' },
      { type: 'tip', text: '💡 Display your backpack prominently to look like a "professional hitchhiker". It reassures Polish drivers.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Poland is a safe country for hitchhiking. Driving is fast on national roads, so stay alert when positioning yourself.' },
      { type: 'sub', title: 'Use SpotHitch for your safety' },
      { type: 'rule', icon: '🛡️', text: 'Activate Guardian Mode before every trip. A trusted person follows your position in real time.' },
      { type: 'rule', icon: '🆘', text: 'Set up SOS mode with your contacts. One tap triggers a triple alert (push, SMS, call).' },
      { type: 'rule', icon: '📱', text: 'Take a photo of the licence plate and send it to someone before getting in.' },
      { type: 'rule', icon: '🎒', text: 'Keep your bag accessible (on your lap or at your feet), never in the boot.' },
      { type: 'sub', title: 'Country tips' },
      { type: 'rule', icon: '⛽', text: 'Orlen petrol stations (national chain) are reliable spots with plenty of traffic.' },
      { type: 'rule', icon: '👀', text: 'Speed is high on national roads. Position yourself in a clearly visible spot with room for cars to pull over.' },
      { type: 'sub', title: 'Emergency numbers' },
      { type: 'kv', items: [{ k: 'Emergency', v: '112' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Poland ranks 12th safest country for solo female travellers (score 4.7/5). The sense of safety is high. See the warning above for northern Poland in summer.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: '~24% speak English, ~20% Russian, ~12% German. Young people (77% of students) speak foreign languages. Lorry drivers often speak only Polish. Poles respond very positively to foreigners trying Polish.' },
      { type: 'phrase', items: [
        { local: 'Dzień dobry', meaning: 'Good day' },
        { local: 'Dziękuję', meaning: 'Thank you' },
        { local: 'Skąd najlepiej łapać stopa do...?', meaning: 'Where is the best spot to hitchhike to...?' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'One of the cheapest EU countries. Backpacker budget: 25 to 35 EUR/day. Hostel: 13 to 16 EUR/night. Local meal: 5 to 7 EUR. MOPs (roadside rest areas) offer free showers with hot water.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Since May 2021, 600,000 hectares across 425 forest zones are legally open for camping (max 9 people, max 2 nights). Use the mBDL app to find legal zones (orange zones).' },
      { type: 'rule', icon: '✅', text: '425 legal forest zones for camping (mBDL app)' },
      { type: 'rule', icon: '🚫', text: 'Forbidden in national parks and nature reserves (especially the Tatras)' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'FlixBus / PolskiBus', detail: 'Extremely cheap (promos from 0.23 EUR)', price: 'from 1 EUR' },
        { emoji: '🚗', name: 'BlaBlaCar', detail: 'Very popular ("e-hitchhiking")', price: '' },
        { emoji: '📱', name: 'jakdojade.pl', detail: 'App for all Polish public transport', price: '' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mar', level: 'ok' },
        { name: 'Apr', level: 'good' }, { name: 'May', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Aug', level: 'great' }, { name: 'Sep', level: 'good' },
        { name: 'Oct', level: 'ok' }, { name: 'Nov', level: 'bad' }, { name: 'Dec', level: 'bad' },
      ]},
      { type: 'text', text: 'Summer: optimal. Winter: very difficult (down to -20°C, short days, poor visibility).' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Deep hitchhiking culture rooted in the official communist programme (1958 to 1995). Many current drivers hitchhiked in their youth. Poles may seem cold at first but warm up quickly.' },
      { type: 'event', items: [
        { month: 'Aug', day: '⟳', name: 'Pol\'and\'Rock Festival', desc: 'Biggest free festival in Europe (formerly Woodstock Poland), 750,000 people.' },
        { month: 'Nov', day: '1', name: 'All Saints\' Day (Wszystkich Świętych)', desc: 'Cemeteries lit with candles. Unique spectacle.' },
        { month: 'Dec', day: '⟳', name: 'Christmas Markets', desc: 'Kraków and Wrocław have the most beautiful.' },
      ]},
    ]},
  },

  // ==================== CZECH REPUBLIC ====================
  CZ: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Hitchhiking is legal on normal roads in Czechia. Forbidden directly on motorways and expressways. Allowed at access ramps and petrol stations.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'One of the most hitchhiking-friendly countries in Europe. On normal roads, a ride usually comes within 10 minutes. It is a transit country with heavy international traffic and many lorry drivers.' },
      { type: 'text', text: 'At motorway entrances near cities, you may find yourself with 3 to 6 other hitchhikers. Rides are given in order of arrival or by destination.' },
      { type: 'tip', text: '💡 All Czech motorways (1, 2, 5, 8, 11) lead to/from Prague. Avoid getting stuck before Prague: enter the city and start again.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Czechia is a safe country for hitchhiking. Rest areas are well frequented and make good starting points.' },
      { type: 'sub', title: 'Use SpotHitch for your safety' },
      { type: 'rule', icon: '🛡️', text: 'Activate Guardian Mode before every trip. A trusted person follows your position in real time.' },
      { type: 'rule', icon: '🆘', text: 'Set up SOS mode with your contacts. One tap triggers a triple alert (push, SMS, call).' },
      { type: 'rule', icon: '📱', text: 'Take a photo of the licence plate and send it to someone before getting in.' },
      { type: 'rule', icon: '🎒', text: 'Keep your bag accessible (on your lap or at your feet), never in the boot.' },
      { type: 'sub', title: 'Country tips' },
      { type: 'rule', icon: '⛽', text: 'Rest areas along motorways are reliable spots with regular traffic.' },
      { type: 'rule', icon: '🍺', text: 'The country is very welcoming. Drivers may invite you to a hospoda (traditional pub).' },
      { type: 'sub', title: 'Emergency numbers' },
      { type: 'kv', items: [{ k: 'Emergency', v: '112' }, { k: 'Ambulance', v: '155' }] },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Older drivers: Czech only, sometimes Russian, rarely German. Young people: at least basic English. Lorry drivers are friendly and generally speak Czech + some German.' },
      { type: 'phrase', items: [
        { local: 'Dobrý den', meaning: 'Good day' },
        { local: 'Jedete do...?', meaning: 'Are you going to...?' },
        { local: 'Děkuji', meaning: 'Thank you' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Backpacker budget: 35 to 55 EUR/day. Prague is significantly more expensive than the rest of the country. Currency: Czech koruna (CZK), not the euro. Camping is very cheap (~3 EUR in some towns).' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wild camping is forbidden but one-night bivouacking is tolerated (sleeping bag, hammock, bivy sack, no tent). Leave no trace. Forbidden in national parks and reserves.' },
      { type: 'rule', icon: '✅', text: 'Free wooden shelters ("bouda" or "útulna") available in some hiking areas.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'RegioJet', detail: 'Cheap and comfortable Czech bus company (CZ, SK, PL, AT, HU)', price: 'from 5 EUR' },
        { emoji: '🚌', name: 'FlixBus', detail: 'Extensive network', price: 'from 5 EUR' },
        { emoji: '🚗', name: 'BlaBlaCar', detail: 'Active in Czechia', price: '' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'ok' }, { name: 'Feb', level: 'ok' }, { name: 'Mar', level: 'ok' },
        { name: 'Apr', level: 'good' }, { name: 'May', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Aug', level: 'great' }, { name: 'Sep', level: 'good' },
        { name: 'Oct', level: 'ok' }, { name: 'Nov', level: 'ok' }, { name: 'Dec', level: 'ok' },
      ]},
      { type: 'text', text: 'Summer: optimal, especially on the Czechia-Croatia axis (favourite Czech holiday destination). Prague Christmas markets draw traffic in winter.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Strong hitchhiking tradition, socially accepted as an "everyday form of transport". A Facebook group connects Czech and Slovak hitchhikers.' },
      { type: 'event', items: [
        { month: 'Jul', day: '⟳', name: 'Colours of Ostrava', desc: 'Multicultural music festival, Ostrava.' },
        { month: 'Dec', day: '⟳', name: 'Prague Christmas Markets', desc: 'Among the most beautiful in Europe.' },
      ]},
    ]},
  },

  // ==================== SLOVAKIA ====================
  SK: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Hitchhiking is legal on normal roads in Slovakia. Forbidden on motorways. Warning: Slovak police fine hitchhikers caught on motorways (stricter than neighbouring countries). Use petrol stations and access ramps.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Mixed reviews. Some find Slovakia "very easy" (under 30 min wait). Others rate it difficult (5/10) with waits up to 2h. It probably depends on location and season.' },
      { type: 'text', text: 'The country is quite mountainous (60%+ of the territory), creating many natural opportunities. The D1 and E77 motorways are the best routes. Bratislava is a central hub of Central Europe.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Slovakia is a safe country for hitchhiking. Locals are welcoming, especially in rural areas where the tradition of hitching is still alive.' },
      { type: 'sub', title: 'Use SpotHitch for your safety' },
      { type: 'rule', icon: '🛡️', text: 'Activate Guardian Mode before every trip. A trusted person follows your position in real time.' },
      { type: 'rule', icon: '🆘', text: 'Set up SOS mode with your contacts. One tap triggers a triple alert (push, SMS, call).' },
      { type: 'rule', icon: '📱', text: 'Take a photo of the licence plate and send it to someone before getting in.' },
      { type: 'rule', icon: '🎒', text: 'Keep your bag accessible (on your lap or at your feet), never in the boot.' },
      { type: 'sub', title: 'Country tips' },
      { type: 'rule', icon: '🏘️', text: 'In rural areas, drivers stop more easily. Small country roads are ideal.' },
      { type: 'rule', icon: '😊', text: 'Slovaks are reserved but warm. A smile and a sign are enough to break the ice.' },
      { type: 'sub', title: 'Emergency numbers' },
      { type: 'kv', items: [{ k: 'Emergency', v: '112' }] },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'English and German are spoken by some, especially young people. Russian is understood by older people but "not necessarily appreciated". In the south: Hungarian is useful. Basic Slovak is much appreciated.' },
      { type: 'phrase', items: [
        { local: 'Dobrý deň', meaning: 'Good day' },
        { local: 'Idete do...?', meaning: 'Are you going to...?' },
        { local: 'Ďakujem', meaning: 'Thank you' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Backpacker budget: 40 to 50 EUR/day. Hostel: 16 to 22 EUR/night. Local meal: 8 to 10 EUR.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wild camping officially forbidden but tolerated outside national parks (especially the Tatras). Emergency bivouac (sleeping bag + tarp, no tent) generally causes no problems.' },
      { type: 'text', text: '' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'RegioJet', detail: 'Czech bus company with extensive Slovak routes', price: '' },
        { emoji: '🚌', name: 'FlixBus', detail: 'Covers Slovakia', price: 'from 5 EUR' },
        { emoji: '🤝', name: 'Local ride-sharing', detail: 'Local ride-sharing platforms active in Slovakia', price: '' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mar', level: 'ok' },
        { name: 'Apr', level: 'good' }, { name: 'May', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Aug', level: 'great' }, { name: 'Sep', level: 'good' },
        { name: 'Oct', level: 'ok' }, { name: 'Nov', level: 'bad' }, { name: 'Dec', level: 'bad' },
      ]},
      { type: 'text', text: 'Summer: optimal. Winter: significantly longer waits, harsh cold in the mountains. Sundays: shops close (religious tradition), reduced public transport.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Slovaks are described as "incredibly friendly" and do their best to make you comfortable. Some invite hitchhikers for a family lunch or drinks with friends. Payment is never asked.' },
      { type: 'event', items: [
        { month: 'Jul', day: '⟳', name: 'Pohoda Festival', desc: 'Biggest music festival in Slovakia, Trenčín.' },
      ]},
    ]},
  },

  // ==================== HUNGARY ====================
  HU: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Hitchhiking is legal in Hungary. Long tradition: the majority of Hungarians hitchhiked or picked up hitchhikers in their youth. Forbidden on motorways as a pedestrian.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Relatively easy, especially in rural areas. Waiting time rarely exceeds 90 minutes in summer. Petrol stations are the best spots.' },
      { type: 'sub', title: 'Particularities' },
      { type: 'rule', icon: '📋', text: 'A sign with your destination is NECESSARY. Many Hungarians do not understand the thumb gesture as a hitchhiking sign.' },
      { type: 'text', text: 'Some Romanian and Hungarian drivers may ask for payment. Politely refuse and wait for another ride. Lorry rides are very rare (insurance reasons).' },
      { type: 'warn', text: '⚠️ At night, drivers are afraid of YOU. Only hitchhike in daylight.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Hungary is a safe country for hitchhiking. MOL petrol stations are excellent spots to meet drivers.' },
      { type: 'sub', title: 'Use SpotHitch for your safety' },
      { type: 'rule', icon: '🛡️', text: 'Activate Guardian Mode before every trip. A trusted person follows your position in real time.' },
      { type: 'rule', icon: '🆘', text: 'Set up SOS mode with your contacts. One tap triggers a triple alert (push, SMS, call).' },
      { type: 'rule', icon: '📱', text: 'Take a photo of the licence plate and send it to someone before getting in.' },
      { type: 'rule', icon: '🎒', text: 'Keep your bag accessible (on your lap or at your feet), never in the boot.' },
      { type: 'sub', title: 'Country tips' },
      { type: 'rule', icon: '⛽', text: 'MOL petrol stations (national chain) are well spread out and ideal for approaching drivers.' },
      { type: 'rule', icon: '💧', text: 'Tap water is drinkable everywhere in Hungary. Refill your bottle at every stop.' },
      { type: 'sub', title: 'Emergency numbers' },
      { type: 'kv', items: [{ k: 'Emergency', v: '112' }] },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'The biggest language barrier of the 4 countries. Hungarian is a Finno-Ugric language, unrelated to Slavic or Germanic languages. Fewer people speak foreign languages than in neighbouring countries. A Hungarian phrasebook is highly recommended.' },
      { type: 'phrase', items: [
        { local: 'Jó napot', meaning: 'Good day' },
        { local: 'Köszönöm', meaning: 'Thank you' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Backpacker budget: 25 to 45 EUR/day. Budapest is cheap for a European capital. Hostel (dorm): from ~10 EUR. Local meal: 6 to 7 EUR.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wild camping legally allowed but very restricted: maximum 24h in the same spot. Forbidden in national parks (frequent ranger patrols). No fires in dry periods.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'FlixBus', detail: 'Extensive network from Budapest', price: 'from 5 EUR' },
        { emoji: '🚗', name: 'BlaBlaCar', detail: 'Active in Hungary', price: '' },
        { emoji: '🚃', name: 'Trains', detail: 'Well connected in the EU, Interrail pass valid', price: '' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mar', level: 'ok' },
        { name: 'Apr', level: 'good' }, { name: 'May', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'good' }, { name: 'Aug', level: 'good' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'ok' }, { name: 'Dec', level: 'ok' },
      ]},
      { type: 'text', text: 'Spring and autumn: ideal. Summer: heavy traffic (Sziget Festival, Lake Balaton tourism) but can be very hot (+35°C in July). Budapest Christmas markets draw traffic in winter.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Long hitchhiking tradition, practised by the majority of Hungarians. Rural people are very friendly and helpful. Ask for rides towards Budapest rather than around it: transit drivers (Romanian, Serbian, Bulgarian, Turkish) often bypass the city on the ring road.' },
      { type: 'event', items: [
        { month: 'Aug', day: '⟳', name: 'Sziget Festival (Budapest)', desc: 'One of the biggest music festivals in Europe, on a Danube island.' },
        { month: 'Aug', day: '⟳', name: 'Balaton Festival', desc: 'Summer at Lake Balaton, lots of traffic in the region.' },
        { month: 'Dec', day: '⟳', name: 'Budapest Christmas Markets', desc: 'Among the most beautiful in Europe.' },
      ]},
    ]},
  },

  // ==================== ROMANIA ====================
  RO: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Hitchhiking is legal in Romania. Since ~2014, it is illegal for drivers to ask for money from hitchhikers (paid hitchhiking is illegal). Forbidden on motorways. In practice, everyone hitchhikes.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Very easy. One of the most hitchhiking-friendly countries in Europe. Waiting time: 2 minutes to 1h30 depending on location. Hitchhiking is a common mode of transport (limited public transport, few motorways). You may compete with locals at city exits.' },
      { type: 'text', text: 'Romanians use 2-letter codes for departments on signs (e.g. CJ = Cluj). Use a sign. Roundabouts at city exits and national roads (E) work best.' },
      { type: 'warn', text: '⚠️ Some illegal drivers target foreigners and charge inflated fares (up to 100 EUR). Always say "fără bani" (without money) or "nu am bani" (I have no money) BEFORE getting in.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Romania is a safe country for hitchhiking. Driving can be aggressive on national roads, so always wear your seatbelt.' },
      { type: 'sub', title: 'Use SpotHitch for your safety' },
      { type: 'rule', icon: '🛡️', text: 'Activate Guardian Mode before every trip. A trusted person follows your position in real time.' },
      { type: 'rule', icon: '🆘', text: 'Set up SOS mode with your contacts. One tap triggers a triple alert (push, SMS, call).' },
      { type: 'rule', icon: '📱', text: 'Take a photo of the licence plate and send it to someone before getting in.' },
      { type: 'rule', icon: '🎒', text: 'Keep your bag accessible (on your lap or at your feet), never in the boot.' },
      { type: 'sub', title: 'Country tips' },
      { type: 'rule', icon: '🔒', text: 'Always wear your seatbelt. Overtaking on national roads can be sudden.' },
      { type: 'rule', icon: '🤗', text: 'Romanians are very welcoming, especially in the countryside. Do not be surprised if you are invited to eat.' },
      { type: 'sub', title: 'Emergency numbers' },
      { type: 'kv', items: [{ k: 'Emergency', v: '112' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Generally safe for solo women. Solo experiences are mostly positive. Rural areas are particularly welcoming.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Romanian is a Romance language (Latin alphabet). French, Italian and Spanish speakers have a significant advantage. Young city dwellers speak good English. In rural areas and with older drivers, communication can be difficult. Hungarian is spoken in Transylvania.' },
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'One of the cheapest countries in Europe. Backpacker budget: under 30 EUR/day. Hostel: ~10 EUR/night. Restaurant meal: 7 to 10 EUR. BlaBlaCar is popular and affordable.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wild camping is LEGAL on public land (not in national parks, nature reserves, or the Danube Delta). Watch out for bears in the Carpathians. Couchsurfing active, especially in Cluj-Napoca and Bucharest. TrustRoots popular among hitchhikers.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚗', name: 'BlaBlaCar', detail: 'Very popular in Romania', price: '' },
        { emoji: '🚌', name: 'FlixBus', detail: 'Main routes', price: 'from 5 EUR' },
        { emoji: '🚃', name: 'Trains', detail: 'Slow but cheap', price: '' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mar', level: 'ok' },
        { name: 'Apr', level: 'great' }, { name: 'May', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'good' }, { name: 'Aug', level: 'good' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'ok' }, { name: 'Dec', level: 'bad' },
      ]},
      { type: 'text', text: 'April to October: ideal. The Transfăgărășan (most beautiful mountain road) is only open June to October. Winter: dangerous roads, short days.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Hitchhiking is deeply rooted in Romanian culture. It is a common mode of transport, not just for travellers. City exits have dedicated pick-up zones. Drivers are incredibly friendly, generous and curious towards foreigners. Transylvania is the most welcoming region.' },
      { type: 'event', items: [
        { month: 'Aug', day: '⟳', name: 'Untold Festival (Cluj)', desc: 'One of the biggest music festivals in Eastern Europe.' },
        { month: 'Sep', day: '⟳', name: 'George Enescu Festival (Bucharest)', desc: 'World-renowned classical music festival.' },
      ]},
    ]},
  },

  // ==================== BULGARIA ====================
  BG: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'No law forbids hitchhiking in Bulgaria except on the rare stretches of actual motorway. It is a legacy of the socialist era, widely accepted.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Very easy, especially on the Sofia-Plovdiv axis (Europe-Turkey corridor). East-west is easier than north-south. In summer, the Black Sea coast is popular but with competition.' },
      { type: 'text', text: 'Lorry drivers (TIR) are numerous and willing to take passengers. In summer (35°C+) lorries must park from 1pm to 9pm. Leave early in the morning.' },
      { type: 'warn', text: '⚠️ Write your destination in CYRILLIC. This considerably improves the chances of drivers stopping.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Bulgaria is a safe country for hitchhiking. Secondary roads are sometimes in poor condition, so stick to main routes.' },
      { type: 'sub', title: 'Use SpotHitch for your safety' },
      { type: 'rule', icon: '🛡️', text: 'Activate Guardian Mode before every trip. A trusted person follows your position in real time.' },
      { type: 'rule', icon: '🆘', text: 'Set up SOS mode with your contacts. One tap triggers a triple alert (push, SMS, call).' },
      { type: 'rule', icon: '📱', text: 'Take a photo of the licence plate and send it to someone before getting in.' },
      { type: 'rule', icon: '🎒', text: 'Keep your bag accessible (on your lap or at your feet), never in the boot.' },
      { type: 'sub', title: 'Country tips' },
      { type: 'rule', icon: '🛣️', text: 'Stick to main roads and motorways. Secondary roads are sometimes poorly maintained.' },
      { type: 'rule', icon: '🔄', text: 'Note: in Bulgaria, nodding your head means "no" and shaking it means "yes". Confusion is common!' },
      { type: 'sub', title: 'Emergency numbers' },
      { type: 'kv', items: [{ k: 'Emergency', v: '112' }] },
    ]},
    women: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'Generally safe for solo female travellers. Crime is low and locals are helpful.' },
      { type: 'warn', text: '⚠️ On major routes (Sofia-Istanbul, Sofia-Varna), sex workers are present by the roads. Women should dress plainly and stay away from these areas. Only use the raised thumb (waving can be confused with a solicitation signal).' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Bulgarian uses the Cyrillic alphabet, which is a significant barrier. English is limited outside big cities. Communication often relies on gestures. Drivers frequently offer rakia (homemade brandy) as a social gesture.' },
      { type: 'phrase', items: [
        { local: 'Avtostop', meaning: 'Hitchhiking' },
        { local: 'Blagodarya', meaning: 'Thank you' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Among the cheapest countries in Europe. Backpacker budget: ~30 EUR/day. Full restaurant meal for under 15 EUR. Hostel: 8 to 12 EUR/night.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wild camping technically forbidden but widely tolerated outside tourist areas, cities and nature reserves. Fine up to 1000 EUR in protected areas. Fires strictly forbidden outside public fireplaces. Krapets (Romanian border) has a free wild camping area on the beach.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Facebook ride-sharing groups are more popular than BlaBlaCar in Bulgaria. Faster and cheaper than buses. Buses and minibuses connect most towns. Trains exist but are slow.' },
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mar', level: 'ok' },
        { name: 'Apr', level: 'good' }, { name: 'May', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'good' }, { name: 'Aug', level: 'good' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'ok' }, { name: 'Dec', level: 'bad' },
      ]},
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Hitchhiking has socialist roots. Many older drivers are nostalgic and welcoming. Drivers are curious, kind and hospitable. Rakia is shared as a social gesture.' },
      { type: 'event', items: [
        { month: 'Jun', day: '⟳', name: 'Rose Festival (Kazanlak)', desc: 'Celebration of the rose harvest, centuries-old tradition.' },
        { month: 'Jul', day: '⟳', name: 'July Morning (coast)', desc: 'Hippie sunrise gathering on Black Sea beaches.' },
      ]},
    ]},
  },

  // ==================== LITHUANIA ====================
  LT: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Hitchhiking on motorways is not explicitly forbidden (but walking on them is). In practice, hitchhikers stand near motorways without problems. Schoolchildren walk along roads, so drivers are used to pedestrians.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Lithuania is described as a "hitchhiking paradise". Waiting time: 30 to 90 minutes, under 30 minutes in pairs.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Lithuania is a very safe country for hitchhiking. The Via Baltica (E67) is an excellent route for heading north or south.' },
      { type: 'sub', title: 'Use SpotHitch for your safety' },
      { type: 'rule', icon: '🛡️', text: 'Activate Guardian Mode before every trip. A trusted person follows your position in real time.' },
      { type: 'rule', icon: '🆘', text: 'Set up SOS mode with your contacts. One tap triggers a triple alert (push, SMS, call).' },
      { type: 'rule', icon: '📱', text: 'Take a photo of the licence plate and send it to someone before getting in.' },
      { type: 'rule', icon: '🎒', text: 'Keep your bag accessible (on your lap or at your feet), never in the boot.' },
      { type: 'sub', title: 'Country tips' },
      { type: 'rule', icon: '🛣️', text: 'The Via Baltica (E67) runs through the country from south to north. It is the busiest route for hitching.' },
      { type: 'rule', icon: '⛽', text: 'Petrol stations along major routes are reliable spots to find a ride.' },
      { type: 'sub', title: 'Emergency numbers' },
      { type: 'kv', items: [{ k: 'Emergency', v: '112' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'The Baltic states are described as a "paradise for female hitchhikers" and "very female-friendly".' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Lithuanian is the main language. English speakers are limited outside Vilnius. Drivers are friendly despite the language barrier. A SIM card costs ~0.30 EUR at kiosks (useful for translation apps).' },
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Backpacker budget: ~45 EUR/day. Trains are extremely cheap (often under 2 EUR/trip).' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wild camping is LEGAL in Lithuania, except in nature reserves, urban areas, beaches and private property.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Lux Express', detail: 'Buses between Baltic capitals', price: '~25 EUR' },
        { emoji: '🚃', name: 'Trains', detail: 'Vilnius-Riga direct (since 2023), very cheap', price: 'from 2 EUR' },
        { emoji: '🤝', name: 'Local ride-sharing', detail: 'Lithuanian ride-sharing platforms', price: '' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mar', level: 'bad' },
        { name: 'Apr', level: 'ok' }, { name: 'May', level: 'good' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Aug', level: 'great' }, { name: 'Sep', level: 'good' },
        { name: 'Oct', level: 'ok' }, { name: 'Nov', level: 'bad' }, { name: 'Dec', level: 'bad' },
      ]},
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Established hitchhiking culture. Local hitchhiking clubs are active. People are shy but friendly. Comparable to Poland in terms of hitchhiking culture.' },
    ]},
  },

  // ==================== LATVIA ====================
  LV: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'No law forbids hitchhiking in Latvia. Allowed as long as you do not endanger road safety.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Fairly easy. People are used to hitchhikers on main roads (E67/Via Baltica) and in rural areas. Many young Latvians hitchhike in summer to get to festivals or go home.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Latvia is a safe and quiet country for hitchhiking. The Via Baltica (E67) is the best route for getting around efficiently.' },
      { type: 'sub', title: 'Use SpotHitch for your safety' },
      { type: 'rule', icon: '🛡️', text: 'Activate Guardian Mode before every trip. A trusted person follows your position in real time.' },
      { type: 'rule', icon: '🆘', text: 'Set up SOS mode with your contacts. One tap triggers a triple alert (push, SMS, call).' },
      { type: 'rule', icon: '📱', text: 'Take a photo of the licence plate and send it to someone before getting in.' },
      { type: 'rule', icon: '🎒', text: 'Keep your bag accessible (on your lap or at your feet), never in the boot.' },
      { type: 'sub', title: 'Country tips' },
      { type: 'rule', icon: '🛣️', text: 'The Via Baltica (E67) is the main route. Petrol stations along this road are excellent spots.' },
      { type: 'rule', icon: '❄️', text: 'In winter and early spring, roads can be slippery. Bring warm and visible clothing.' },
      { type: 'sub', title: 'Emergency numbers' },
      { type: 'kv', items: [{ k: 'Emergency', v: '112' }] },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Population divided between Latvian speakers and Russian speakers. Most adults know both. Young people generally speak good English. Free WiFi in almost every town (libraries, town centres).' },
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Backpacker budget: ~45 EUR/day. Trains often under 2 EUR/trip.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wild camping is LEGAL in Latvia unless explicitly prohibited. Forbidden in nature reserves, national parks, vegetated dunes and urban beaches. Private property: owner\'s permission required.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Lux Express', detail: 'Riga-Tallinn (~4h, ~20 EUR), Riga-Vilnius (~4h30, ~25 EUR)', price: 'from 15 EUR' },
        { emoji: '📱', name: 'Facebook groups', detail: 'Ride-sharing by route (very popular)', price: '' },
        { emoji: '🚗', name: 'BlaBlaCar', detail: 'Active in Latvia', price: '' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mar', level: 'bad' },
        { name: 'Apr', level: 'ok' }, { name: 'May', level: 'good' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Aug', level: 'great' }, { name: 'Sep', level: 'good' },
        { name: 'Oct', level: 'ok' }, { name: 'Nov', level: 'bad' }, { name: 'Dec', level: 'bad' },
      ]},
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Hitchhiking is an accepted practice. Latvians are reserved but helpful. No Schengen border checks with Estonia and Lithuania.' },
      { type: 'event', items: [
        { month: 'Jun', day: '23-24', name: 'Jāņi (Līgo)', desc: 'Summer solstice, bonfires, flower crowns, the biggest Latvian celebration.' },
      ]},
    ]},
  },

  // ==================== ESTONIA ====================
  EE: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Hitchhiking is legal in Estonia. Legal requirement at night: you MUST wear a reflective tag on dark roads. Hi-vis vests are recommended but may make drivers think you are police.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Relatively good. Waiting time: 5 to 10 minutes typically, sometimes 30 to 90 minutes. Cars stop on motorways and small roads. All types of vehicles stop: cars, lorries, tractors, even taxis heading home.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Estonia is a very safe country for hitchhiking. The Via Baltica (E67) is the ideal route for crossing the country.' },
      { type: 'sub', title: 'Use SpotHitch for your safety' },
      { type: 'rule', icon: '🛡️', text: 'Activate Guardian Mode before every trip. A trusted person follows your position in real time.' },
      { type: 'rule', icon: '🆘', text: 'Set up SOS mode with your contacts. One tap triggers a triple alert (push, SMS, call).' },
      { type: 'rule', icon: '📱', text: 'Take a photo of the licence plate and send it to someone before getting in.' },
      { type: 'rule', icon: '🎒', text: 'Keep your bag accessible (on your lap or at your feet), never in the boot.' },
      { type: 'sub', title: 'Country tips' },
      { type: 'rule', icon: '🛣️', text: 'The Via Baltica (E67) connects Tallinn to the Latvian border. It is the busiest route.' },
      { type: 'rule', icon: '⛽', text: 'Petrol stations are safe and well-lit spots, perfect for approaching drivers.' },
      { type: 'sub', title: 'Emergency numbers' },
      { type: 'kv', items: [{ k: 'Emergency', v: '112' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'The Baltic states are described as a "paradise for female hitchhikers". Tallinn is very safe for solo female travellers.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Estonian and Russian are the main languages. English is well spoken by young people and working adults. Conversations happen in Estonian, Russian or English depending on the driver.' },
      { type: 'phrase', items: [
        { local: 'Aitäh sõidu eest', meaning: 'Thanks for the ride' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Backpacker budget: ~45 EUR/day. Trains are extremely cheap. Tap water and well water are drinkable everywhere in Estonia.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wild camping is LEGAL in Estonia except on private property, in national parks or military areas. Bring food: few roadside service areas.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Lux Express', detail: 'Tallinn-Riga (~4h)', price: 'from 15 EUR' },
        { emoji: '⛴️', name: 'Ferries', detail: 'To the islands (Saaremaa, Hiiumaa)', price: '' },
      ]},
      { type: 'text', text: 'Very digitally connected country (e-Estonia). Translation apps and online maps work perfectly everywhere.' },
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mar', level: 'bad' },
        { name: 'Apr', level: 'ok' }, { name: 'May', level: 'good' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Aug', level: 'good' }, { name: 'Sep', level: 'ok' },
        { name: 'Oct', level: 'bad' }, { name: 'Nov', level: 'bad' }, { name: 'Dec', level: 'bad' },
      ]},
      { type: 'text', text: 'Summer only reliable (nearly 24h of light in June). Winter: snow, cold, darkness. Some roads drop from 110 to 90 km/h in winter.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Estonians are reserved but helpful. The islands (Kihnu, Saaremaa) preserve traditional ways of life and offer unique hitchhiking experiences.' },
      { type: 'event', items: [
        { month: 'Jun', day: '23-24', name: 'Jaanipäev (St John\'s Day)', desc: 'Summer solstice, bonfires. Biggest Estonian celebration.' },
      ]},
    ]},
  },

  // ==================== TURKEY ====================
  TR: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Hitchhiking ("otostop") is not explicitly illegal in Turkey, but it is forbidden on motorways (otoban). In practice, enforcement is very lax and people hitchhike on roads routinely.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Turkey is described as a "hitchhiker\'s paradise" by all sources. Waiting time rarely exceeds 15 minutes on busy roads.' },
      { type: 'sub', title: 'By region (easiest to hardest)' },
      { type: 'kv', items: [
        { k: 'South-east Anatolia', v: 'The 1st car stops', color: 'green' },
        { k: 'Black Sea coast', v: 'Very easy', color: 'green' },
        { k: 'Central Anatolia', v: '~20 min wait', color: 'green' },
        { k: 'Mediterranean coast', v: 'Longer (up to 2h)', color: 'amber' },
        { k: 'Istanbul', v: 'Very difficult (can take 10h)', color: 'red' },
      ]},
      { type: 'text', text: 'In rural areas, just walking on a road is enough: drivers stop on their own without you raising your thumb.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Turkey is a safe country for hitchhiking. Turkish hospitality is legendary and drivers stop readily, especially at petrol stations.' },
      { type: 'sub', title: 'Use SpotHitch for your safety' },
      { type: 'rule', icon: '🛡️', text: 'Activate Guardian Mode before every trip. A trusted person follows your position in real time.' },
      { type: 'rule', icon: '🆘', text: 'Set up SOS mode with your contacts. One tap triggers a triple alert (push, SMS, call).' },
      { type: 'rule', icon: '📱', text: 'Take a photo of the licence plate and send it to someone before getting in.' },
      { type: 'rule', icon: '🎒', text: 'Keep your bag accessible (on your lap or at your feet), never in the boot.' },
      { type: 'sub', title: 'Country tips' },
      { type: 'rule', icon: '⛽', text: 'Petrol stations are the safest and most efficient spots to find a ride.' },
      { type: 'rule', icon: '🌍', text: 'Avoid the southern border areas (Syria, Iraq). The rest of the country is very welcoming.' },
      { type: 'sub', title: 'Emergency numbers' },
      { type: 'kv', items: [{ k: 'Emergency', v: '112' }] },
    ]},
    women: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'The most documented topic. Turkey is considered "not for beginner female hitchhikers" if you are alone. Dress code is crucial: long trousers, sleeves to the elbows minimum.' },
      { type: 'text', text: 'Experiences vary enormously depending on outfit, behaviour, language skills and region. Recommendation from all sources: safer as a couple or in a group.' },
      { type: 'phrase', items: [
        { local: 'Çok ayıp', meaning: 'That is very wrong (to rebuff behaviour)' },
        { local: 'Evliyim', meaning: 'I am married' },
      ]},
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Very few people speak English (~20% of drivers). Google Translate with voice function is essential. Turkish is "relatively easy to learn and pronounce". Save a pre-translated message explaining your trip.' },
      { type: 'phrase', items: [
        { local: 'Otostop', meaning: 'Hitchhiking' },
        { local: 'Param yok', meaning: 'I have no money' },
        { local: 'Nereye gidiyorsunuz?', meaning: 'Where are you going?' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Backpacker budget: 25 to 45 EUR/day. Traditional meal: 3 to 5 EUR. Hostel: 5 to 15 EUR/night. Drivers frequently buy tea, food and even full meals. "Food and tea in abundance."' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wild camping exists in a legal grey area. Technically forbidden but enforcement is lax. Generally tolerated in rural and forested areas. Forbidden on some beaches (turtle nesting sites). Invitations to stay with drivers are extremely common.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚐', name: 'Dolmuş (shared minibus)', detail: 'Very cheap, no schedule, wave them down', price: '1-3 EUR' },
        { emoji: '🚌', name: 'Intercity buses', detail: 'Modern, comfortable, onboard service, air-conditioned', price: '' },
      ]},
      { type: 'tip', text: '💡 ~30% of intercity bus drivers will give you a free ride if you explain you have no money.' },
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'ok' }, { name: 'Feb', level: 'ok' }, { name: 'Mar', level: 'good' },
        { name: 'Apr', level: 'great' }, { name: 'May', level: 'great' }, { name: 'Jun', level: 'good' },
        { name: 'Jul', level: 'ok' }, { name: 'Aug', level: 'ok' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'great' }, { name: 'Nov', level: 'good' }, { name: 'Dec', level: 'ok' },
      ]},
      { type: 'text', text: 'April is the best month. Spring and autumn are ideal. Summer: very hot (35°C+ on the south coast and inland). Winter: cold inland, mild on the south coast.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Turkish hospitality is legendary. Tea is offered at every stop. Drivers buy meals, give impromptu tours and invite you to their home. Accepting food/drink creates a bond. Refusing can offend.' },
      { type: 'event', items: [
        { month: 'Apr', day: '23', name: 'National Sovereignty Day', desc: 'Public holiday, celebrations across the country.' },
        { month: 'Apr-May', day: '⟳', name: 'Ramadan and Eid', desc: 'Variable dates. During Ramadan, people fast by day. Eid is very festive.' },
        { month: 'Oct', day: '29', name: 'Republic Day', desc: 'Biggest Turkish national holiday.' },
      ]},
    ]},
  },

  // ==================== GEORGIA ====================
  GE: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'No legal restriction on hitchhiking in Georgia. Unlike most European countries, nobody worries if you hitchhike directly on motorways.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Easy most of the time. Average waiting time: ~30 minutes. In rural areas, drivers stop even without you raising your thumb: walking with a backpack is enough. Police cars also offer rides and help arrange your next one.' },
      { type: 'tip', text: '💡 Georgian hospitality is incredible. Drivers regularly invite you to eat, drink and sleep at their home.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Georgia is a safe country for hitchhiking. Georgian hospitality is legendary. The main risk comes from mountain roads (sharp bends, no guardrails).' },
      { type: 'sub', title: 'Use SpotHitch for your safety' },
      { type: 'rule', icon: '🛡️', text: 'Activate Guardian Mode before every trip. A trusted person follows your position in real time.' },
      { type: 'rule', icon: '🆘', text: 'Set up SOS mode with your contacts. One tap triggers a triple alert (push, SMS, call).' },
      { type: 'rule', icon: '📱', text: 'Take a photo of the licence plate and send it to someone before getting in.' },
      { type: 'rule', icon: '🎒', text: 'Keep your bag accessible (on your lap or at your feet), never in the boot.' },
      { type: 'sub', title: 'Country tips' },
      { type: 'rule', icon: '🏔️', text: 'Mountain roads are dangerous (bends without guardrails, high speed). Buckle up.' },
      { type: 'rule', icon: '🍷', text: 'Drivers may offer you wine or chacha. Accepting a glass is a gesture of friendship in Georgia.' },
      { type: 'sub', title: 'Emergency numbers' },
      { type: 'kv', items: [{ k: 'Emergency', v: '112' }] },
    ]},
    women: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'Georgia is considered safe for solo female travellers. Georgian men are generally respectful towards women but can be insistent. Be firm and they will stop.' },
      { type: 'text', text: 'Some drivers can be socially insistent (repeated invitations, interest in foreign women). Be firm. Recommendation: travel in pairs when possible.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Older people speak Russian, younger people (<30) speak more English, especially in Tbilisi and Batumi. Villages may only have Georgian speakers. Good mobile coverage for translation apps.' },
      { type: 'phrase', items: [
        { local: 'Gamarjoba', meaning: 'Hello' },
        { local: 'Madloba', meaning: 'Thank you' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Ultra-budget possible: ~6 EUR/day (camping + hitchhiking + cooking). Comfortable budget: ~30 EUR/day. Hostel in Tbilisi: from 5 EUR/night. Full meal: 3 to 5 EUR. Metro/bus in Tbilisi: a few cents.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wild camping is legal in Georgia on public land. Forbidden on private property without permission. Popular free spots: Kazbegi, Juta valley, Lake Udziro in Racha, Svaneti. Invitations from locals are frequent.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚐', name: 'Marshrutka (shared minivans)', detail: 'Backbone of transport. Very cheap.', price: '1-7 EUR' },
        { emoji: '🚃', name: 'Trains', detail: 'Soviet network. Fast Tbilisi-Batumi. Overnight Tbilisi-Zugdidi.', price: '4-15 EUR' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mar', level: 'ok' },
        { name: 'Apr', level: 'good' }, { name: 'May', level: 'good' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Aug', level: 'great' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'ok' }, { name: 'Dec', level: 'bad' },
      ]},
      { type: 'text', text: 'Late June to late September: ideal for trekking and mountain hitchhiking (Greater Caucasus open July to August). Late September to early November: 15 to 20°C in the city, autumn colours.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Georgian hospitality is considered among the best in the world. Drivers spontaneously invite you to eat, drink and sleep. Chacha (grape brandy) is the national drink. Georgian cuisine is rich: wine, khinkali (dumplings), khachapuri (cheese bread).' },
      { type: 'event', items: [
        { month: 'Oct', day: '14', name: 'Tbilisoba', desc: 'Tbilisi city festival. Music, dance, gastronomy across the city.' },
        { month: 'Oct', day: '⟳', name: 'Rtveli (grape harvest)', desc: 'Grape harvest. Georgia is the cradle of wine (8000 years).' },
      ]},
    ]},
  },

  // ==================== ARMENIA ====================
  AM: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Hitchhiking is legal in Armenia. No documented restrictions. Use the raised thumb (palm facing down = you want a taxi).' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Several sources rank Armenia as one of the best countries in the world for hitchhiking. Average waiting time: 5 to 10 minutes, sometimes under 5 minutes.' },
      { type: 'text', text: 'Locals also hitchhike because public transport is limited and minivans are crowded. It is a normal mode of transport. In remote areas, traffic can be very low (1h+ wait).' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Armenia is a very safe country for hitchhiking. The locals are warm and the country is peaceful. The main risk comes from mountain roads.' },
      { type: 'sub', title: 'Use SpotHitch for your safety' },
      { type: 'rule', icon: '🛡️', text: 'Activate Guardian Mode before every trip. A trusted person follows your position in real time.' },
      { type: 'rule', icon: '🆘', text: 'Set up SOS mode with your contacts. One tap triggers a triple alert (push, SMS, call).' },
      { type: 'rule', icon: '📱', text: 'Take a photo of the licence plate and send it to someone before getting in.' },
      { type: 'rule', icon: '🎒', text: 'Keep your bag accessible (on your lap or at your feet), never in the boot.' },
      { type: 'sub', title: 'Country tips' },
      { type: 'rule', icon: '🏔️', text: 'Mountain roads are the main risk. They are winding and sometimes poorly maintained.' },
      { type: 'rule', icon: '🤝', text: 'Armenians are remarkably hospitable. You will often be invited to share a meal.' },
      { type: 'sub', title: 'Emergency numbers' },
      { type: 'kv', items: [{ k: 'Emergency', v: '911' }] },
    ]},
    women: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'Fear fades year by year. Some drivers can be socially insistent (repeated invitations, romantic interest). Be firm and clear. Prefer cars with women or children. Avoid travelling alone in remote southern areas.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Russian is the most common foreign language, spoken by almost everyone. Essential outside Yerevan. English is rare, especially in rural areas. The Armenian alphabet is unique and the language very difficult to learn.' },
      { type: 'phrase', items: [
        { local: 'Barev', meaning: 'Hello' },
        { local: 'Shnorhakalutyun', meaning: 'Thank you' },
        { local: 'Anvchar?', meaning: 'Free?' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Ultra-budget possible: ~7 EUR/day. Comfortable budget: 25 to 45 EUR/day. Hostel: 8 to 18 EUR/night. Local meal: 3 to 5 EUR. Yerevan metro: < 0.20 EUR. Drivers often buy cola, ice cream or full meals for free.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wild camping is legal on all public land without a permit. Safe in most regions except near the Azerbaijani border. It gets cold from October. Watch out for wolves, wild animals and stray dogs. Locals are curious and may invite you for a coffee.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚐', name: 'Marshrutkas', detail: 'Crowded but cheap minivans. Cover most routes.', price: '0.30-1 EUR' },
        { emoji: '🚌', name: 'Bus', detail: 'Major cities only', price: '' },
      ]},
      { type: 'warn', text: '⚠️ Raised thumb = hitchhiking. Palm facing down = taxi. Clarify BEFORE getting in to avoid being asked for money.' },
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mar', level: 'ok' },
        { name: 'Apr', level: 'good' }, { name: 'May', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'good' }, { name: 'Aug', level: 'good' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'ok' }, { name: 'Dec', level: 'bad' },
      ]},
      { type: 'text', text: 'May to June and September to October: ideal (22 to 26°C). Summer: hot in the plains (up to 40°C) but ideal in the mountains. Winter: cold, snow in the mountains, not recommended for hitchhiking.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Armenian hospitality is considered among the best in the world. Drivers stop without being asked, buy drinks, invite you to eat and introduce their family. Kurdish communities in southern Armenia are "exceptionally hospitable". Accepting food/drink shows your goodwill.' },
      { type: 'event', items: [
        { month: 'Apr', day: '24', name: 'Remembrance Day', desc: 'Commemoration of the Armenian Genocide. Processions in Yerevan.' },
        { month: 'Sep-Oct', day: '⟳', name: 'Areni Wine Festival', desc: 'Wine festival in the village of Areni, home of the oldest known winery.' },
      ]},
    ]},
  },
  // ==================== BELARUS ====================
  BY: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Hitchhiking is legal in Belarus. No specific restrictions. The practice is common as public transport is limited outside Minsk.' },
      { type: 'warn', text: '⚠️ A visa is mandatory for most nationalities. Free 30-day visa if arriving via Minsk airport. Land entry from Russia: no border check (customs union), but you must have a Belarusian visa.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Belarus is easy for hitchhiking. Average waiting time: 15 to 30 min on main roads. Drivers are curious to meet foreigners (rare in the country). The M1 and M6 motorways have good traffic.' },
      { type: 'text', text: 'Many drivers try to refuse money. Classic technique: stand at petrol stations or bus stops on city outskirts. Lorry drivers are welcoming but rarely speak anything other than Russian/Belarusian.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'The country is very safe in terms of crime. Crime rate among the lowest in Europe. However, the authoritarian regime means frequent police checks. Always have your passport and migration registration on you.' },
      { type: 'kv', items: [
        { k: 'Emergency', v: '112' },
        { k: 'Police', v: '102' },
        { k: 'Ambulance', v: '103' },
      ]},
      { type: 'warn', text: '⚠️ Do not photograph government or military buildings. Avoid political discussions with drivers.' },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'The country is considered safe for women travelling alone. Incidents are very rare. Society is conservative but respectful. Avoid travelling alone at night in isolated areas.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Russian is the main language (spoken daily by 99% of the population). Belarusian is official but little used. English is very rare outside Minsk. Russian is essential for communication.' },
      { type: 'phrase', items: [
        { local: 'Zdrastvuyte', meaning: 'Hello (formal)' },
        { local: 'Spasibo', meaning: 'Thank you' },
        { local: 'Besplatno', meaning: 'Free' },
        { local: 'Do...', meaning: 'To... (+ city name)' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Very cheap. Tight budget: 10 to 15 EUR/day. Meal in a stolovaya (Soviet canteen): 2 to 4 EUR. Hostel in Minsk: 8 to 15 EUR/night. Minsk metro costs ~0.30 EUR.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wild camping is tolerated in forests (60% of the territory). Forbidden in national parks without permission. Drivers sometimes invite you to sleep at their home. Obligation to register within 10 days at a hotel or migration office.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚂', name: 'Train', detail: 'Reliable and cheap Soviet network', price: '2-10 EUR' },
        { emoji: '🚌', name: 'Marshrutka', detail: 'Frequent minibuses between cities', price: '1-5 EUR' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mar', level: 'ok' },
        { name: 'Apr', level: 'ok' }, { name: 'May', level: 'good' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Aug', level: 'great' }, { name: 'Sep', level: 'good' },
        { name: 'Oct', level: 'ok' }, { name: 'Nov', level: 'bad' }, { name: 'Dec', level: 'bad' },
      ]},
      { type: 'text', text: 'June to August: ideal (20 to 28°C). Winter is harsh (down to -20°C) and not recommended for hitchhiking. Mosquitoes are numerous in summer in marshy areas.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Belarus retains a unique Soviet atmosphere. People are reserved at first but very warm once the ice is broken. Vodka and salo (smoked lard) are local specialities. Never refuse a toast.' },
    ]},
  },
  // ==================== MOLDOVA ====================
  MD: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Hitchhiking is legal in Moldova. Very common practice, especially in rural areas where public transport is rare. Drivers stop easily.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Moldova is easy for hitchhiking. The country is small (340 km north to south) and can be crossed in a day. Waiting time: 10 to 20 min. Drivers are curious about foreigners. Warning: some drivers expect payment (local informal transport practice). Clarify it is free with "gratis".' },
      { type: 'warn', text: '⚠️ Transnistria (self-proclaimed republic to the east) is accessible but with border checks. Hitchhiking is easy there but Russian is essential.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Moldova is a safe country with low crime. Avoid travelling alone at night in isolated areas. Taxi scams are the main risk (agree on a price beforehand).' },
      { type: 'kv', items: [{ k: 'Emergency', v: '112' }, { k: 'Police', v: '902' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Considered safe for women travelling alone. Society is traditional. Female travellers report positive experiences. Avoid Transnistria alone.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Romanian is the official language. Russian is very widespread, especially in Chișinău and Transnistria. English is spoken by young urbanites. In rural areas, Romanian or Russian is essential.' },
      { type: 'phrase', items: [
        { local: 'Bună ziua', meaning: 'Good day' },
        { local: 'Mulțumesc', meaning: 'Thank you' },
        { local: 'Gratis', meaning: 'Free' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'The cheapest country in Europe. Tight budget: 8 to 12 EUR/day. Full restaurant meal: 3 to 5 EUR. Excellent local wine at 1 to 2 EUR/bottle. Hostel: 8 to 12 EUR/night.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wild camping is tolerated but not common. Vineyards offer beautiful spots. Families often invite travellers to sleep at their home, especially in rural areas.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚐', name: 'Marshrutka', detail: 'Main transport between cities, frequent and cheap', price: '1-3 EUR' },
        { emoji: '🚂', name: 'Train', detail: 'Slow but exists on main lines', price: '1-5 EUR' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mar', level: 'ok' },
        { name: 'Apr', level: 'good' }, { name: 'May', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'good' }, { name: 'Aug', level: 'good' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'ok' }, { name: 'Dec', level: 'bad' },
      ]},
      { type: 'text', text: 'May to June and September to October: ideal. Summer can be very hot (35°C+). Autumn is grape harvest season, the ideal time to visit.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Moldova is the land of wine. The underground cellars of Mileștii Mici are the largest in the world (200 km of galleries). Moldovan hospitality is sincere and generous. You will be offered homemade wine, mămăligă (polenta) and plăcintă (pie).' },
      { type: 'event', items: [
        { month: 'Oct', day: '⟳', name: 'Ziua Vinului (Wine Day)', desc: 'National wine festival in Chișinău. Free tasting everywhere.' },
      ]},
    ]},
  },
  // ==================== UKRAINE ====================
  UA: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Hitchhiking is legal in Ukraine. No restrictions. A common and culturally accepted practice. Ukrainians are familiar with the concept.' },
      { type: 'warn', text: '⚠️ Since 2022, the security situation has changed radically. Check active conflict zones before travelling. The west of the country (Lviv, Carpathians) remains the most accessible. Martial law may restrict movement.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'In peacetime, Ukraine is one of the best countries in Europe for hitchhiking. Drivers are generous and curious. Waiting time: 10 to 20 min. Lorry drivers cover long distances. Main roads (M06 Kyiv-Lviv, M05 Kyiv-Odesa) have good traffic.' },
      { type: 'text', text: 'Many drivers spontaneously offer food, drinks and accommodation. The concept "avtoStop" is well understood. Some drivers make significant detours to help you.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Check the security situation before travelling in Ukraine. The western and central areas are historically more stable.' },
      { type: 'sub', title: 'Use SpotHitch for your safety' },
      { type: 'rule', icon: '🛡️', text: 'Activate Guardian Mode before every trip. A trusted person follows your position in real time.' },
      { type: 'rule', icon: '🆘', text: 'Set up SOS mode with your contacts. One tap triggers a triple alert (push, SMS, call).' },
      { type: 'rule', icon: '📱', text: 'Take a photo of the licence plate and send it to someone before getting in.' },
      { type: 'rule', icon: '🎒', text: 'Keep your bag accessible (on your lap or at your feet), never in the boot.' },
      { type: 'sub', title: 'Country tips' },
      { type: 'rule', icon: '📋', text: 'Check your foreign ministry\'s advisories before any trip. The situation is evolving.' },
      { type: 'rule', icon: '🌍', text: 'The western (Lviv, Ivano-Frankivsk) and central (Kyiv, Vinnytsia) areas are historically the most stable.' },
      { type: 'sub', title: 'Emergency numbers' },
      { type: 'kv', items: [
        { k: 'Emergency', v: '112' },
        { k: 'Police', v: '102' },
        { k: 'Ambulance', v: '103' },
      ]},
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'In peacetime, several female travellers report positive experiences in Ukraine. Society is traditional but respectful. Lviv and the Carpathians are the most recommended regions for women travelling alone.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Ukrainian is the official language. Russian is understood by the majority but its use is politically sensitive since 2022. Preferably use Ukrainian or English. English is spoken by young people in Kyiv and Lviv.' },
      { type: 'phrase', items: [
        { local: 'Dobriy den', meaning: 'Good day' },
        { local: 'Dyakuyu', meaning: 'Thank you' },
        { local: 'Bezkoshtovno', meaning: 'Free' },
        { local: 'Do... (+ city)', meaning: 'To...' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Very cheap. Tight budget: 10 to 15 EUR/day. Meal in a canteen: 2 to 4 EUR. Hostel in Kyiv: 5 to 10 EUR/night. Night train Kyiv-Lviv: ~8 EUR.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wild camping is tolerated in forests and the Carpathians. Ukrainians often invite travellers to their home. Couchsurfing active in Kyiv and Lviv.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚂', name: 'Ukrzaliznytsia (train)', detail: 'Extensive network, comfortable and cheap night trains', price: '3-15 EUR' },
        { emoji: '🚐', name: 'Marshrutka', detail: 'Frequent minibuses between cities', price: '1-5 EUR' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mar', level: 'ok' },
        { name: 'Apr', level: 'good' }, { name: 'May', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'good' }, { name: 'Aug', level: 'good' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'ok' }, { name: 'Dec', level: 'bad' },
      ]},
      { type: 'text', text: 'May to June and September: ideal (20 to 28°C). Summer is hot in the south. Winter is harsh (-10 to -20°C) and not recommended. The Carpathians are magnificent in autumn.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Ukrainian hospitality is sincere and generous. Borscht, salo (lard) and horilka (pepper vodka) are essential. Drivers often offer fruit, bread and drinks. The sharing culture is deeply rooted.' },
    ]},
  },
  // ==================== KOSOVO ====================
  XK: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Hitchhiking is legal in Kosovo. No known restrictions. The practice is common as the bus network is limited.' },
      { type: 'warn', text: '⚠️ Kosovo is not recognised by all countries. Check if your country recognises it before travelling. Entry from Serbia may be problematic (considered illegal entry by Serbia).' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Kosovo is very easy for hitchhiking. The country is small (150 km east to west) and can be crossed in a few hours. Drivers are extremely welcoming, especially towards foreigners. Waiting time: 5 to 15 min.' },
      { type: 'text', text: 'Kosovars have a deep sense of gratitude towards foreigners. Many offer meals, coffee and insist on helping. The Pristina-Prizren motorway has good traffic.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Kosovo is a safe country for hitchhiking. The locals are very hospitable towards foreigners and eager to meet travellers.' },
      { type: 'sub', title: 'Use SpotHitch for your safety' },
      { type: 'rule', icon: '🛡️', text: 'Activate Guardian Mode before every trip. A trusted person follows your position in real time.' },
      { type: 'rule', icon: '🆘', text: 'Set up SOS mode with your contacts. One tap triggers a triple alert (push, SMS, call).' },
      { type: 'rule', icon: '📱', text: 'Take a photo of the licence plate and send it to someone before getting in.' },
      { type: 'rule', icon: '🎒', text: 'Keep your bag accessible (on your lap or at your feet), never in the boot.' },
      { type: 'sub', title: 'Country tips' },
      { type: 'rule', icon: '🤝', text: 'Kosovars are among the most welcoming people in the Balkans. They love chatting with foreigners.' },
      { type: 'rule', icon: '☕', text: 'You will often be offered Turkish coffee or a meal. Accepting is a sign of respect.' },
      { type: 'sub', title: 'Emergency numbers' },
      { type: 'kv', items: [{ k: 'Emergency', v: '112' }, { k: 'Police', v: '192' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Considered safe for women travelling alone. Society is traditional but very respectful of foreigners. Several female travellers report positive experiences.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Albanian is the main language. Serbian is spoken in the northern Serbian enclaves. English is very widespread among young people (international influence since 1999). German is understood by many (large diaspora in Germany/Switzerland).' },
      { type: 'phrase', items: [
        { local: 'Faleminderit', meaning: 'Thank you' },
        { local: 'Ku po shkon?', meaning: 'Where are you going?' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Very cheap. Tight budget: 10 to 15 EUR/day. Full meal: 3 to 5 EUR. Coffee: 0.50 to 1 EUR. Hostel: 8 to 12 EUR/night. Kosovo uses the euro.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wild camping is possible in rural areas. Kosovar families very readily invite travellers into their homes. It is a matter of honour.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Bus', detail: 'Limited network but covers main cities', price: '2-5 EUR' },
        { emoji: '🚐', name: 'Furgon', detail: 'Informal minibuses, frequent and cheap', price: '1-3 EUR' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mar', level: 'ok' },
        { name: 'Apr', level: 'good' }, { name: 'May', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'good' }, { name: 'Aug', level: 'good' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'ok' }, { name: 'Dec', level: 'bad' },
      ]},
      { type: 'text', text: 'May to June and September: ideal. Summer is hot (35°C+). Winter is cold with snow.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Kosovo is a young country (independent since 2008) with a very young population (median age: 29). Hospitality is exceptional. Macchiato and Turkish coffee are institutions. The country vibrates with energy and optimism.' },
    ]},
  },
  // ==================== MOROCCO ====================
  MA: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Hitchhiking is legal and very common in Morocco. No restrictions. It is a standard mode of transport for locals too. The practice is rooted in Moroccan hospitality culture.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Morocco is one of the best countries in the world for hitchhiking. Average waiting time: 5 to 15 min. Drivers stop very easily, sometimes without being asked. Lorries regularly take hitchhikers on long distances.' },
      { type: 'sub', title: 'Key points' },
      { type: 'rule', icon: '🚛', text: 'Lorry drivers are your best allies. They cover long distances and are used to taking people.' },
      { type: 'rule', icon: '⛽', text: 'Petrol stations at city exits are the best spots.' },
      { type: 'rule', icon: '🤝', text: 'Some drivers expect a small payment (informal transport). Clarify "autostop, bla flous" (without money) or offer to share fuel costs.' },
      { type: 'text', text: 'In the south and the Atlas, traffic is low but people stop almost systematically. Grand taxis collectifs are the main transport between cities.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Morocco is a safe country for hitchhiking. National roads are in good condition and Moroccans are welcoming towards travellers. In summer, bring plenty of water.' },
      { type: 'sub', title: 'Use SpotHitch for your safety' },
      { type: 'rule', icon: '🛡️', text: 'Activate Guardian Mode before every trip. A trusted person follows your position in real time.' },
      { type: 'rule', icon: '🆘', text: 'Set up SOS mode with your contacts. One tap triggers a triple alert (push, SMS, call).' },
      { type: 'rule', icon: '📱', text: 'Take a photo of the licence plate and send it to someone before getting in.' },
      { type: 'rule', icon: '🎒', text: 'Keep your bag accessible (on your lap or at your feet), never in the boot.' },
      { type: 'sub', title: 'Country tips' },
      { type: 'rule', icon: '🛣️', text: 'National roads are in good condition. Position yourself at city exits or petrol stations.' },
      { type: 'rule', icon: '💧', text: 'In summer, temperatures exceed 40\u00b0C. Always carry water and protect yourself from the sun.' },
      { type: 'sub', title: 'Emergency numbers' },
      { type: 'kv', items: [{ k: 'Police', v: '19' }] },
    ]},
    women: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'Morocco is trickier for women travelling alone. Street harassment (comments, staring) is common in cities. For hitchhiking, experiences are mixed: many positive rides but some uncomfortable situations reported.' },
      { type: 'rule', icon: '👫', text: 'Travelling in pairs is strongly recommended.' },
      { type: 'rule', icon: '👕', text: 'Dress conservatively (shoulders and knees covered).' },
      { type: 'rule', icon: '💍', text: '"My husband is waiting for me in..." is an effective phrase to cut things short.' },
      { type: 'text', text: 'Tourist areas (Marrakech, Fez) are more intense. Rural areas and the Atlas are often more respectful and welcoming.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Moroccan Arabic (darija) and Berber are the local languages. French is very widespread (language of education and business). English is improving among young people. Spanish is understood in the north (Tangier, Tetouan, Nador).' },
      { type: 'phrase', items: [
        { local: 'Salam / Salam aleikoum', meaning: 'Hello / Peace upon you' },
        { local: 'Choukran', meaning: 'Thank you' },
        { local: 'Bla flous', meaning: 'Without money (free)' },
        { local: 'Wach kayn chi triq l...?', meaning: 'Is there a way to...?' },
        { local: 'Bslama', meaning: 'Goodbye' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Very cheap. Tight budget: 10 to 20 EUR/day. Mint tea is often offered for free.' },
      { type: 'kv', items: [
        { k: 'Meal at a street stall', v: '2-4 EUR' },
        { k: 'Tagine at a restaurant', v: '4-8 EUR' },
        { k: 'Hostel / basic riad', v: '5-15 EUR/night' },
        { k: 'Grand taxi collectif (50 km)', v: '1-3 EUR' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wild camping is tolerated in the Atlas mountains and the desert. Avoid beaches near cities. Moroccans often invite travellers for tea, a meal, and sometimes to sleep. In Berber villages of the Atlas, hospitality is almost automatic.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚕', name: 'Grand taxi', detail: 'Shared taxis between cities. 6 passengers, wait until full.', price: '1-5 EUR' },
        { emoji: '🚌', name: 'CTM / Supratours', detail: 'Comfortable and reliable long-distance buses', price: '5-20 EUR' },
        { emoji: '🚂', name: 'ONCF (train)', detail: 'Limited but reliable network (Tangier-Marrakech)', price: '5-25 EUR' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'ok' }, { name: 'Feb', level: 'good' }, { name: 'Mar', level: 'great' },
        { name: 'Apr', level: 'great' }, { name: 'May', level: 'great' }, { name: 'Jun', level: 'good' },
        { name: 'Jul', level: 'ok' }, { name: 'Aug', level: 'ok' }, { name: 'Sep', level: 'good' },
        { name: 'Oct', level: 'great' }, { name: 'Nov', level: 'great' }, { name: 'Dec', level: 'ok' },
      ]},
      { type: 'text', text: 'March to May and September to November: ideal. Summer is scorching in the south and inland (40 to 45°C). Winter is mild on the coast but cold in the Atlas (snow). Ramadan: the rhythm changes but hospitality remains.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Moroccan hospitality is legendary. Mint tea is a sacred ritual: refusing one is impolite. Drivers often offer tea, a meal, and make detours to help. Berber culture in the Atlas is particularly welcoming.' },
      { type: 'event', items: [
        { month: 'Jun', day: '⟳', name: 'Gnaoua Festival (Essaouira)', desc: 'Gnaoua and world music. Incredible atmosphere.' },
        { month: 'Nov', day: '⟳', name: 'Date Festival (Erfoud)', desc: 'Celebration of the date harvest in the south-east.' },
      ]},
    ]},
  },
  // ==================== UNITED STATES ====================
  US: {
    laws: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'Legality varies by state. Overall: hitchhiking is prohibited on Interstates (federal motorways) everywhere, but tolerated or even legal on on-ramps and secondary roads in many states.' },
      { type: 'sub', title: 'States where it is legal' },
      { type: 'text', text: 'Oregon, Nevada, Colorado, Wyoming, Montana, Idaho and other Western states tolerate or explicitly allow hitchhiking on ramps. Check each state\'s law beforehand.' },
      { type: 'sub', title: 'States where it is prohibited' },
      { type: 'text', text: 'New York, New Jersey, Pennsylvania, Delaware, Connecticut and others ban hitchhiking even on ramps. In Florida, the law varies by county.' },
      { type: 'sub', title: 'Fines' },
      { type: 'text', text: 'Rarely enforced. Police will usually ask you to move. Worst case: a $25-100 fine or a warning.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'The US is the country where hitchhiking has declined the most since the 1970s. Distances are huge, the car ownership rate is 95%, and the culture of fear (stranger danger) makes drivers wary. Average wait time: 1-3h, sometimes much more.' },
      { type: 'sub', title: 'Where it works' },
      { type: 'kv', items: [
        { k: 'Rural West (Montana, Wyoming, Idaho)', v: 'The best', color: 'green' },
        { k: 'Pacific Northwest (Oregon, Washington)', v: 'Good, alternative culture', color: 'green' },
        { k: 'Hawaii', v: 'Easy and common', color: 'green' },
        { k: 'Rural South (rural Texas, Louisiana)', v: 'Variable but friendly', color: 'amber' },
        { k: 'East Coast / big cities', v: 'Very difficult', color: 'red' },
      ]},
      { type: 'sub', title: 'Strategy' },
      { type: 'text', text: 'In the US, approaching drivers at gas stations or truck stops is more effective than thumbing on the roadside. Truck stops (TA, Pilot, Flying J, Love\'s) are the best spots for long distances.' },
      { type: 'tip', text: '💡 Facebook "Ride Share" groups by state are a complementary alternative to hitchhiking.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'The United States is safe for hitchhiking in most regions. Gas stations are excellent spots. Bring water and supplies, as distances are immense.' },
      { type: 'sub', title: 'Use SpotHitch for your safety' },
      { type: 'rule', icon: '🛡️', text: 'Activate Guardian Mode before every trip. A trusted person follows your position in real time.' },
      { type: 'rule', icon: '🆘', text: 'Set up SOS mode with your contacts. One tap triggers a triple alert (push, SMS, call).' },
      { type: 'rule', icon: '📱', text: 'Take a photo of the licence plate and send it to someone before getting in.' },
      { type: 'rule', icon: '🎒', text: 'Keep your bag accessible (on your lap or at your feet), never in the boot.' },
      { type: 'sub', title: 'Country tips' },
      { type: 'rule', icon: '⛽', text: 'Gas stations are the best spots to approach drivers before they head off.' },
      { type: 'rule', icon: '🗺️', text: 'Distances are immense (sometimes 200+ km between towns). Bring water, food and a solar charger.' },
      { type: 'sub', title: 'Emergency numbers' },
      { type: 'kv', items: [{ k: 'Emergency', v: '911' }] },
    ]},
    women: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'The US is the country where women report the most wariness (on both sides). Hitchhiking alone as a woman is discouraged by most sources, especially in isolated areas. Mixed couples or pairs are much better perceived.' },
      { type: 'rule', icon: '👫', text: 'Travelling as a duo is almost essential.' },
      { type: 'rule', icon: '📱', text: 'Share your live location (SpotHitch, Google Maps, WhatsApp).' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'English is essential. Spanish is very useful in the southwest (Texas, Arizona, New Mexico, California). No language barrier for English speakers.' },
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'The US is expensive. Tight budget: $30-50/day minimum. Truck stops offer hearty meals at reasonable prices.' },
      { type: 'kv', items: [
        { k: 'Hostel', v: '$25-50/night' },
        { k: 'Walmart (parking camping)', v: 'Free (tolerated)' },
        { k: 'Fast food', v: '$8-15' },
        { k: 'Diner / truck stop', v: '$10-20' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wild camping is legal on federal lands (BLM land, National Forests) covering millions of hectares in the West. Free and without a permit in most cases. Walmart often allows camping in its parking lots. Truck stop parking lots can be used at night.' },
      { type: 'tip', text: '💡 Many apps and websites exist to find free camping spots on federal lands.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Greyhound', detail: 'Long-distance bus, extensive network', price: '$30-100' },
        { emoji: '🚌', name: 'FlixBus', detail: 'Cheaper alternative, expanding network', price: '$10-50' },
        { emoji: '🚂', name: 'Amtrak', detail: 'Train, slow but scenic. The California Zephyr is magnificent.', price: '$30-200' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mar', level: 'ok' },
        { name: 'Apr', level: 'good' }, { name: 'May', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'good' }, { name: 'Aug', level: 'good' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'ok' }, { name: 'Dec', level: 'bad' },
      ]},
      { type: 'text', text: 'May-June and September: ideal in the West. Summer is scorching in the Southwest (45°C+ in Arizona). Winter closes mountain passes. The Northeast is doable from April to October.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Hitchhiking holds a mythical place in American culture (Jack Kerouac, Route 66, the beatniks). Today the practice is marginal but those who pick up hitchhikers are often extraordinary people: former travellers, lonely truckers, adventurers. The conversations are often memorable.' },
      { type: 'event', items: [
        { month: 'Aug', day: '⟳', name: 'Burning Man (Nevada)', desc: 'Desert festival. Many hitchhikers on Nevada roads.' },
      ]},
    ]},
  },
  // ==================== CANADA ====================
  CA: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Hitchhiking is legal in most provinces. Prohibited on highways in some provinces (Ontario, British Columbia) but allowed on on-ramps. In Alberta and the Prairie provinces, hitchhiking is generally tolerated.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Canada is easier than the US for hitchhiking. Canadian culture is more open and distances between communities create a natural solidarity. Average wait time: 30 min-1h30. The West (British Columbia, Alberta) is the easiest.' },
      { type: 'sub', title: 'Best areas' },
      { type: 'kv', items: [
        { k: 'British Columbia (outside Vancouver)', v: 'Very good, living hitchhiking culture', color: 'green' },
        { k: 'Alberta (Highway 1, Highway 93)', v: 'Good traffic, Rockies', color: 'green' },
        { k: 'Maritime provinces', v: 'Easy and friendly', color: 'green' },
        { k: 'Rural Ontario', v: 'Decent', color: 'amber' },
        { k: 'Toronto, Montreal (leaving the city)', v: 'Difficult', color: 'red' },
      ]},
      { type: 'text', text: 'Gas stations (Esso, Petro-Canada, Shell) and roadside Tim Hortons are the best spots to approach drivers.' },
      { type: 'warn', text: '⚠️ On Highway 16 (northern B.C.), distances are very long and cell coverage is limited. Plan your route and let someone know.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Canada is a very safe country for hitchhiking. Distances are immense, so always bring water and food.' },
      { type: 'sub', title: 'Use SpotHitch for your safety' },
      { type: 'rule', icon: '🛡️', text: 'Activate Guardian Mode before every trip. A trusted person follows your position in real time.' },
      { type: 'rule', icon: '🆘', text: 'Set up SOS mode with your contacts. One tap triggers a triple alert (push, SMS, call).' },
      { type: 'rule', icon: '📱', text: 'Take a photo of the licence plate and send it to someone before getting in.' },
      { type: 'rule', icon: '🎒', text: 'Keep your bag accessible (on your lap or at your feet), never in the boot.' },
      { type: 'sub', title: 'Country tips' },
      { type: 'rule', icon: '🗺️', text: 'Distances are immense (sometimes 200+ km without signal). Always bring water, food and a charger.' },
      { type: 'rule', icon: '🍁', text: 'Canadians are known for their kindness. A clear sign and a smile are all you need to get a ride.' },
      { type: 'sub', title: 'Emergency numbers' },
      { type: 'kv', items: [{ k: 'Emergency', v: '911' }] },
    ]},
    women: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'Canada is safer than the US for women. Solo female travellers report mostly positive experiences. In remote areas, plan ahead and let someone know your route.' },
      { type: 'rule', icon: '📱', text: 'Let someone know your route. Some areas have no signal at all.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'English everywhere except Quebec. In Quebec, French is the main language. Quebecers appreciate when you speak French. In the Atlantic provinces (New Brunswick), both languages coexist.' },
      { type: 'phrase', items: [
        { local: 'Je fais du pouce', meaning: 'The Quebecois expression for hitchhiking' },
        { local: 'Merci, bonne route !', meaning: 'When getting out (in Quebec)' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Canada is expensive. Tight budget: 30-50 CAD/day (~20-35 €). Grocery stores (Walmart, No Frills) are cheaper than restaurants. Tim Hortons is affordable for quick meals.' },
      { type: 'kv', items: [
        { k: 'Hostel', v: '25-50 CAD/night' },
        { k: 'Tim Hortons meal', v: '5-10 CAD' },
        { k: 'Provincial campsite', v: '15-35 CAD/night' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wild camping is allowed on Crown Lands which cover 89% of the territory. Free without a permit in most provinces. Rest areas along highways often allow sleeping for a few hours.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Rider Express / FlixBus', detail: 'Long-distance bus, limited network in the West', price: '30-100 CAD' },
        { emoji: '🚂', name: 'VIA Rail', detail: 'Transcontinental train, slow but scenic', price: '50-300 CAD' },
      ]},
      { type: 'tip', text: '💡 Facebook groups and local classifieds platforms are useful for carpooling in Canada.' },
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mar', level: 'bad' },
        { name: 'Apr', level: 'ok' }, { name: 'May', level: 'good' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Aug', level: 'great' }, { name: 'Sep', level: 'good' },
        { name: 'Oct', level: 'ok' }, { name: 'Nov', level: 'bad' }, { name: 'Dec', level: 'bad' },
      ]},
      { type: 'text', text: 'June to August: ideal. Canada has extreme winters (-30 to -40°C in the Prairies). Hitchhiking in winter is dangerous (hypothermia). September is beautiful for autumn colours in the East.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Canadians are known for their politeness and hospitality. "Sorry" is the most common word. Drivers often offer coffee, meals and accommodation. The outdoor culture (camping, hiking) makes people open to travellers.' },
    ]},
  },
  // ==================== NEW ZEALAND ====================
  NZ: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Hitchhiking is perfectly legal in New Zealand. No restrictions. It is a recognised and culturally accepted mode of transport. Even the official tourism website mentions it.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'New Zealand is one of the best countries in the world for hitchhiking. Average wait time: 10-30 min. Kiwis stop easily and are very welcoming. Hitchhiking is seen as a normal mode of transport.' },
      { type: 'sub', title: 'North Island vs South Island' },
      { type: 'kv', items: [
        { k: 'South Island', v: 'Easier, less traffic but everyone stops', color: 'green' },
        { k: 'North Island', v: 'Good too, more traffic around Auckland/Wellington', color: 'green' },
      ]},
      { type: 'text', text: 'State Highway 1 is the main road on both islands. The ferry between the islands (Interislander) is the only option between Wellington and Picton.' },
      { type: 'tip', text: '💡 A sign with your destination is almost essential. Kiwis like to know exactly where you\'re going.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'New Zealand is a very safe country for hitchhiking. Hitching works very well and Kiwis often stop spontaneously.' },
      { type: 'sub', title: 'Use SpotHitch for your safety' },
      { type: 'rule', icon: '🛡️', text: 'Activate Guardian Mode before every trip. A trusted person follows your position in real time.' },
      { type: 'rule', icon: '🆘', text: 'Set up SOS mode with your contacts. One tap triggers a triple alert (push, SMS, call).' },
      { type: 'rule', icon: '📱', text: 'Take a photo of the licence plate and send it to someone before getting in.' },
      { type: 'rule', icon: '🎒', text: 'Keep your bag accessible (on your lap or at your feet), never in the boot.' },
      { type: 'sub', title: 'Country tips' },
      { type: 'rule', icon: '👍', text: 'Kiwis often stop spontaneously. Hitching is culturally accepted and practised.' },
      { type: 'rule', icon: '🏔️', text: 'The scenery is stunning. Enjoy every ride to discover New Zealand\'s nature.' },
      { type: 'sub', title: 'Emergency numbers' },
      { type: 'kv', items: [{ k: 'Emergency', v: '111' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'New Zealand is considered one of the safest countries in the world for women travelling alone. Many female travellers hitchhike without any problems. The country was the first to grant women the right to vote (1893).' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'English is the main language. Maori is the second official language (some words are used daily: kia ora = hello). No language barrier.' },
      { type: 'phrase', items: [
        { local: 'Kia ora', meaning: 'Hello (Maori, used by everyone)' },
        { local: 'Sweet as', meaning: 'Cool, no worries (Kiwi expression)' },
        { local: 'Chur / Cheers', meaning: 'Thanks' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'NZ is expensive. Tight budget: 30-50 NZD/day (~17-28 €). Supermarket food is affordable (Countdown, Pak\'nSave). Free accommodation (DOC campsites, freedom camping) helps reduce costs.' },
      { type: 'kv', items: [
        { k: 'Hostel (YHA, BBH)', v: '25-40 NZD/night' },
        { k: 'DOC campsite (basic)', v: '0-8 NZD/night' },
        { k: 'Fish & chips', v: '8-15 NZD' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Freedom camping (wild camping in a van or tent) is regulated but possible. DOC campsites (Department of Conservation) offer free or very cheap pitches in beautiful locations. Wild tent camping is tolerated if you\'re discreet and take your rubbish with you.' },
      { type: 'tip', text: '💡 Several local apps list free camping spots in New Zealand.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'InterCity', detail: 'Main bus network. The FlexiPass offers discounts.', price: '15-80 NZD' },
        { emoji: '⛴️', name: 'Interislander / Bluebridge', detail: 'Ferry Wellington-Picton (3h30)', price: '55-80 NZD' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'great' }, { name: 'Feb', level: 'great' }, { name: 'Mar', level: 'great' },
        { name: 'Apr', level: 'good' }, { name: 'May', level: 'ok' }, { name: 'Jun', level: 'bad' },
        { name: 'Jul', level: 'bad' }, { name: 'Aug', level: 'bad' }, { name: 'Sep', level: 'ok' },
        { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'good' }, { name: 'Dec', level: 'great' },
      ]},
      { type: 'text', text: 'Southern hemisphere: summer is December to February. November to March: ideal. Winter (June-August) is cool in the south but doable. The weather changes fast, always bring a waterproof layer.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Kiwis are laid-back and welcoming. "No worries" is a way of life. Drivers make detours, offer coffee and sometimes a bed. The outdoor culture (tramping = hiking) creates a natural bond with travellers. The country is small (4.8 million people) and people know each other.' },
    ]},
  },
  // ==================== AUSTRALIA ====================
  AU: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Legality varies by state. Legal in most states (Victoria, New South Wales, Western Australia). Prohibited in Queensland (fine possible but rarely enforced). Always prohibited on motorways (freeways/motorways).' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Australia was a hitchhiking paradise in the 70s-80s but the practice has declined a lot. Distances are immense (Perth-Sydney: 3,900 km). Wait time: 30 min-3h depending on the area.' },
      { type: 'sub', title: 'Best areas' },
      { type: 'kv', items: [
        { k: 'East Coast (Sydney-Cairns)', v: 'Most traffic', color: 'green' },
        { k: 'Tasmania', v: 'Small, easy, everyone stops', color: 'green' },
        { k: 'Outback / Centre', v: 'Little traffic, long waits but welcoming people', color: 'amber' },
        { k: 'Perth-Adelaide (Nullarbor Plain)', v: 'Risky: 1,200 km of desert', color: 'red' },
      ]},
      { type: 'text', text: 'Roadhouses (isolated gas stations) and truck stops are the best spots. Road trains (triple-trailer trucks) sometimes take passengers on long distances.' },
      { type: 'warn', text: '⚠️ ALWAYS carry 5-10 litres of spare water in the Outback. Dehydration kills.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Australia is a safe country for hitchhiking. Distances are immense (500+ km between cities). Bring water and a solar charger, and do not hitch at night in the Outback.' },
      { type: 'sub', title: 'Use SpotHitch for your safety' },
      { type: 'rule', icon: '🛡️', text: 'Activate Guardian Mode before every trip. A trusted person follows your position in real time.' },
      { type: 'rule', icon: '🆘', text: 'Set up SOS mode with your contacts. One tap triggers a triple alert (push, SMS, call).' },
      { type: 'rule', icon: '📱', text: 'Take a photo of the licence plate and send it to someone before getting in.' },
      { type: 'rule', icon: '🎒', text: 'Keep your bag accessible (on your lap or at your feet), never in the boot.' },
      { type: 'sub', title: 'Country tips' },
      { type: 'rule', icon: '💧', text: 'Distances are immense (500+ km between cities). Always carry water and a solar charger.' },
      { type: 'rule', icon: '☀️', text: 'Do not hitch at night in the Outback. Daytime temperatures reach 45\u00b0C and there is no signal.' },
      { type: 'sub', title: 'Emergency numbers' },
      { type: 'kv', items: [{ k: 'Emergency', v: '000' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Experiences are mixed. The East Coast and Tasmania are considered safe. The isolated Outback is discouraged for women alone. Travelling as a duo is recommended.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Australian English has its own vocabulary (arvo = afternoon, brekkie = breakfast, servo = gas station, ute = pickup). Australians are informal and use a lot of slang.' },
      { type: 'phrase', items: [
        { local: 'G\'day mate', meaning: 'Hello (informal)' },
        { local: 'No worries', meaning: 'No problem' },
        { local: 'Ta / Cheers', meaning: 'Thanks' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Australia is expensive. Tight budget: 40-60 AUD/day (~25-37 €). Supermarket food (Woolworths, Coles, Aldi) is affordable. Eating out is expensive.' },
      { type: 'kv', items: [
        { k: 'Hostel', v: '25-45 AUD/night' },
        { k: 'Pub meal', v: '15-25 AUD' },
        { k: 'Free camping', v: 'Free (camping apps)' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wild camping (bush camping) is legal on public lands and in many rural areas. Several local apps list free spots. Rest areas along highways allow free sleeping. Watch out for snakes and spiders.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Greyhound Australia', detail: 'Long-distance bus, extensive network', price: '30-200 AUD' },
        { emoji: '✈️', name: 'Low-cost flights', detail: 'Jetstar, Bonza. Often cheaper than the bus for long distances.', price: '50-150 AUD' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'ok' }, { name: 'Feb', level: 'ok' }, { name: 'Mar', level: 'good' },
        { name: 'Apr', level: 'great' }, { name: 'May', level: 'great' }, { name: 'Jun', level: 'good' },
        { name: 'Jul', level: 'good' }, { name: 'Aug', level: 'good' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'great' }, { name: 'Nov', level: 'good' }, { name: 'Dec', level: 'ok' },
      ]},
      { type: 'text', text: 'Southern hemisphere: winter (June-August) is the best season in the tropical north. Summer (December-February) is ideal in the south (Melbourne, Tasmania). Avoid the Outback in summer (45°C+).' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Australian culture is laid-back and welcoming. "Mateship" (solidarity between mates) is a core value. BBQs on the road and shared beers are institutions. The humour is dry and self-deprecation is constant.' },
    ]},
  },
  // ==================== ISRAEL ====================
  IL: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Hitchhiking (trempiyada in Hebrew) is legal and common in Israel. It is an established mode of transport, especially for soldiers. Hitchhiking points (trempiyada) are marked by official signs at intersections.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Israel is an excellent country for hitchhiking. The country is small (470 km north-south) and Israelis are very direct and welcoming. Wait time: 5-20 min. Soldiers in uniform hitchhike en masse (mandatory service, no car).' },
      { type: 'sub', title: 'Trempiyada' },
      { type: 'text', text: 'Trempiyada points are official hitchhiking stops, often at junctions. A finger pointing at the ground means "I\'m going in this direction." This is the local gesture, not the thumb.' },
      { type: 'kv', items: [
        { k: 'Route 1 (Jerusalem-Tel Aviv)', v: 'Dense traffic, easy', color: 'green' },
        { k: 'Route 90 (Jordan Valley)', v: 'Good traffic, scenery', color: 'green' },
        { k: 'Negev (south)', v: 'Little traffic, long waits', color: 'amber' },
      ]},
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Safety depends on the region. Central areas (Tel Aviv, Haifa, Galilee) are safe. Avoid the West Bank without local knowledge and border areas with Gaza and Lebanon.' },
      { type: 'kv', items: [
        { k: 'Emergencies / Police', v: '100' },
        { k: 'Ambulance (Magen David Adom)', v: '101' },
        { k: 'Fire department', v: '102' },
      ]},
      { type: 'warn', text: '⚠️ The security situation can change rapidly. Check real-time alerts. The Red Alert app warns of rockets.' },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Israel is considered safe for women travelling alone. Israeli women hitchhike alone frequently. Society is progressive and egalitarian, especially in Tel Aviv. Some precautions in ultra-Orthodox areas (modest clothing).' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Hebrew is the main language. Arabic is the second official language. English is very widespread (almost everyone speaks English). Russian is common among ex-USSR immigrants.' },
      { type: 'phrase', items: [
        { local: 'Shalom', meaning: 'Hello / Goodbye / Peace' },
        { local: 'Toda (raba)', meaning: 'Thank you (very much)' },
        { local: 'Tremp', meaning: 'A lift / a ride' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Israel is expensive. Tight budget: $40-60/day. Street food (falafel, shawarma) is affordable. Supermarkets are pricey.' },
      { type: 'kv', items: [
        { k: 'Falafel / shawarma', v: '15-25 ILS (~4-7 €)' },
        { k: 'Hostel', v: '80-150 ILS/night (~20-40 €)' },
        { k: 'Egged bus', v: '10-50 ILS' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wild camping is prohibited in most national parks but tolerated in the Negev and on some beaches. Youth hostels (IYHA) are well distributed. Volunteering on a kibbutz or organic farms (WWOOF) offers room and board in exchange for work.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Egged / Dan', detail: 'Extensive and reliable bus network', price: '10-50 ILS' },
        { emoji: '🚂', name: 'Israel Railways', detail: 'Fast train Tel Aviv-Jerusalem, expanding network', price: '15-40 ILS' },
      ]},
      { type: 'warn', text: '⚠️ No public transport on Shabbat (Friday evening to Saturday evening) except in Haifa. Hitchhiking is the only free option on Shabbat.' },
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'ok' }, { name: 'Feb', level: 'good' }, { name: 'Mar', level: 'great' },
        { name: 'Apr', level: 'great' }, { name: 'May', level: 'good' }, { name: 'Jun', level: 'ok' },
        { name: 'Jul', level: 'bad' }, { name: 'Aug', level: 'bad' }, { name: 'Sep', level: 'ok' },
        { name: 'Oct', level: 'great' }, { name: 'Nov', level: 'great' }, { name: 'Dec', level: 'ok' },
      ]},
      { type: 'text', text: 'March-May and October-November: ideal. Summer is scorching (35-45°C in the Negev). Winter is mild on the coast (15-20°C) but rainy.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Israelis are direct (it\'s not rudeness, it\'s cultural). They ask personal questions without filter and offer help spontaneously. Political discussions are inevitable. Coffee and hummus are national obsessions.' },
    ]},
  },
  // ==================== ARGENTINA ====================
  AR: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Hitchhiking (dedo in Argentine Spanish, "hacer dedo" = raise the thumb) is legal and common in Argentina. No restrictions. It is a normal mode of transport in Patagonia and rural areas.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Argentina is an excellent country for hitchhiking, especially in Patagonia and the northwest. Wait time: 15-45 min in tourist areas, sometimes 2-3h in deep Patagonia (very little traffic).' },
      { type: 'sub', title: 'By region' },
      { type: 'kv', items: [
        { k: 'Patagonia (Ruta 40)', v: 'Legendary but little traffic. Expect 2-3h waits.', color: 'amber' },
        { k: 'Northwest (Salta, Jujuy, Tucuman)', v: 'Easy and welcoming', color: 'green' },
        { k: 'Lake District (Bariloche)', v: 'Very good, many backpackers', color: 'green' },
        { k: 'Buenos Aires (leaving the city)', v: 'Difficult, take a bus to the city outskirts', color: 'red' },
      ]},
      { type: 'text', text: 'YPF gas stations are the best spots. In Patagonia, talk to drivers at the station. The Ruta 40 (5,000 km long) is the holy grail of Argentine hitchhiking.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Argentina is a safe country for hitchhiking. YPF petrol stations are excellent spots. In Patagonia, distances are immense but drivers stop readily.' },
      { type: 'sub', title: 'Use SpotHitch for your safety' },
      { type: 'rule', icon: '🛡️', text: 'Activate Guardian Mode before every trip. A trusted person follows your position in real time.' },
      { type: 'rule', icon: '🆘', text: 'Set up SOS mode with your contacts. One tap triggers a triple alert (push, SMS, call).' },
      { type: 'rule', icon: '📱', text: 'Take a photo of the licence plate and send it to someone before getting in.' },
      { type: 'rule', icon: '🎒', text: 'Keep your bag accessible (on your lap or at your feet), never in the boot.' },
      { type: 'sub', title: 'Country tips' },
      { type: 'rule', icon: '⛽', text: 'YPF petrol stations (national chain) are the best spots to approach drivers.' },
      { type: 'rule', icon: '🗺️', text: 'In Patagonia, distances are immense (sometimes 300+ km between towns). Bring water and food.' },
      { type: 'sub', title: 'Emergency numbers' },
      { type: 'kv', items: [{ k: 'Emergency', v: '911' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Solo female travellers report mostly positive experiences in Argentina, especially in Patagonia and the northwest. Argentines are respectful but flirtatious (piropos = street compliments). Ignore and move on. Travelling as a duo is recommended for isolated areas.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Argentine Spanish (castellano rioplatense) is the only language. English is rare outside Buenos Aires. Some basic Spanish is essential. "Vos" replaces "tu" and "sh" replaces "ll/y".' },
      { type: 'phrase', items: [
        { local: 'Hago dedo', meaning: 'I\'m hitchhiking' },
        { local: 'Me llevas hasta...?', meaning: 'Can you take me to...?' },
        { local: 'Gracias, genial!', meaning: 'Thanks, awesome!' },
        { local: '¿Tenes lugar?', meaning: 'Do you have room?' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Argentina fluctuates a lot (inflation). In 2025-2026, the country is cheap for foreigners with the blue dollar. Tight budget: 15-25 €/day. Full meal: 3-6 €. Hostel: 5-15 €/night.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wild camping is tolerated everywhere in Patagonia and rural areas. Municipal campsites are free or very cheap in many towns. In Patagonia, wind is the main enemy (gusts of 100+ km/h).' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Long-distance bus', detail: 'Excellent network (cama = bed, semi-cama = reclining). Very comfortable.', price: '10-50 €' },
        { emoji: '✈️', name: 'Domestic flights', detail: 'Aerolineas Argentinas, FlyBondi. Distances justify flying.', price: '30-100 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'great' }, { name: 'Feb', level: 'great' }, { name: 'Mar', level: 'great' },
        { name: 'Apr', level: 'good' }, { name: 'May', level: 'ok' }, { name: 'Jun', level: 'bad' },
        { name: 'Jul', level: 'bad' }, { name: 'Aug', level: 'bad' }, { name: 'Sep', level: 'ok' },
        { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'great' }, { name: 'Dec', level: 'great' },
      ]},
      { type: 'text', text: 'Southern hemisphere: summer (December-February) is ideal for Patagonia. The northwest can be visited year-round (dry in winter). Winter in Patagonia is harsh (-10°C, wind, snow).' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Argentines are warm, talkative and passionate. Mate is a social ritual: accepting a mate offered to you is a sign of friendship. Asados (barbecues) are community events. Conversations can last for hours.' },
      { type: 'event', items: [
        { month: 'Feb', day: '⟳', name: 'Carnival (Gualeguaychu)', desc: 'The biggest carnival in Argentina.' },
        { month: 'Jan', day: '⟳', name: 'Cosquin Festival', desc: 'Argentine folk festival, traditional music.' },
      ]},
    ]},
  },
  // ==================== CHILE ====================
  CL: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Hitchhiking is legal in Chile. No restrictions. The practice is common in Patagonia and the south. The carabineros (police) are generally friendly towards hitchhikers.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Chile is very good for hitchhiking, especially in the south (Region de los Lagos, Carretera Austral). The country is long (4,300 km) and narrow. The Ruta 5 (Pan-American Highway) is the main axis.' },
      { type: 'sub', title: 'By region' },
      { type: 'kv', items: [
        { k: 'Carretera Austral', v: 'Legendary. Everyone stops. Little traffic.', color: 'green' },
        { k: 'Lake District (Temuco-Puerto Montt)', v: 'Easy, good traffic', color: 'green' },
        { k: 'North (Atacama)', v: 'Little traffic, long waits', color: 'amber' },
        { k: 'Santiago (leaving the city)', v: 'Difficult, bus to the outskirts', color: 'red' },
      ]},
      { type: 'text', text: 'Toll booths (peajes) on the Ruta 5 are excellent spots: cars slow down and you can talk to drivers. Copec and Shell gas stations work well too.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Chile is a safe country for hitchhiking. Hitching works particularly well in Patagonia, where drivers readily stop for travellers.' },
      { type: 'sub', title: 'Use SpotHitch for your safety' },
      { type: 'rule', icon: '🛡️', text: 'Activate Guardian Mode before every trip. A trusted person follows your position in real time.' },
      { type: 'rule', icon: '🆘', text: 'Set up SOS mode with your contacts. One tap triggers a triple alert (push, SMS, call).' },
      { type: 'rule', icon: '📱', text: 'Take a photo of the licence plate and send it to someone before getting in.' },
      { type: 'rule', icon: '🎒', text: 'Keep your bag accessible (on your lap or at your feet), never in the boot.' },
      { type: 'sub', title: 'Country tips' },
      { type: 'rule', icon: '🏔️', text: 'In Patagonia, hitching works very well. Drivers readily stop for backpackers.' },
      { type: 'rule', icon: '🗺️', text: 'In the north (Atacama), distances are long and traffic is sparse. Bring water and sun protection.' },
      { type: 'sub', title: 'Emergency numbers' },
      { type: 'kv', items: [{ k: 'Emergency', v: '131' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Chile is considered safe for women travelling alone. Patagonia and the south are particularly recommended. Several solo female travellers report very positive experiences.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Chilean Spanish is fast and full of slang. The "po" at the end of sentences is typical (si po = yes, no po = no). English is rare outside Santiago.' },
      { type: 'phrase', items: [
        { local: 'Ando a dedo', meaning: 'I\'m hitchhiking' },
        { local: '¿Me podis llevar?', meaning: 'Can you take me?' },
        { local: 'Gracias, bacan!', meaning: 'Thanks, awesome!' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Chile is more expensive than Argentina. Tight budget: 15-30 €/day. Supermarkets (Lider, Jumbo) are affordable. Patagonia is pricier.' },
      { type: 'kv', items: [
        { k: 'Hostel', v: '8-20 €/night' },
        { k: 'Menu del dia', v: '3-6 €' },
        { k: 'Empanada', v: '1-2 €' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wild camping is tolerated in rural areas and in Patagonia. CONAF campsites (national parks) are cheap. The Carretera Austral has many beautiful wild camping spots.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Turbus / Pullman', detail: 'Comfortable long-distance buses, extensive network', price: '5-40 €' },
        { emoji: '⛴️', name: 'Navimag', detail: 'Ferry Puerto Montt-Puerto Natales (4 days, fjords)', price: '150-400 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'great' }, { name: 'Feb', level: 'great' }, { name: 'Mar', level: 'good' },
        { name: 'Apr', level: 'ok' }, { name: 'May', level: 'bad' }, { name: 'Jun', level: 'bad' },
        { name: 'Jul', level: 'bad' }, { name: 'Aug', level: 'bad' }, { name: 'Sep', level: 'ok' },
        { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'great' }, { name: 'Dec', level: 'great' },
      ]},
      { type: 'text', text: 'November to March: ideal for Patagonia and the south. The north (Atacama) can be visited year-round. Winter closes the Carretera Austral (snow, blocked roads).' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Chileans are reserved at first but very warm once the ice is broken. The "once" (afternoon snack around 5pm with tea, bread, avocado) is an important meal. Pisco sour and Chilean wine are national prides.' },
    ]},
  },
  // ==================== COLOMBIA ====================
  CO: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Hitchhiking is legal in Colombia. No restrictions. The practice is common among locals too, especially students. Toll booths (peajes) are the classic spots.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Colombia is a good country for hitchhiking. Colombians are extremely welcoming. Wait time: 15-30 min on main roads. Trucks (tractomulas) regularly take passengers.' },
      { type: 'sub', title: 'Key points' },
      { type: 'rule', icon: '🛣️', text: 'Toll booths (peajes) are the best spots. All main roads have them.' },
      { type: 'rule', icon: '🚛', text: 'Truckers are the most reliable for long distances. Very welcoming.' },
      { type: 'rule', icon: '⛽', text: 'Gas stations at city exits work well.' },
      { type: 'kv', items: [
        { k: 'Coffee region (Pereira, Armenia, Manizales)', v: 'Easy and welcoming', color: 'green' },
        { k: 'Caribbean coast', v: 'Easy, relaxed atmosphere', color: 'green' },
        { k: 'Bogota (leaving the city)', v: 'Difficult, take a bus to the outskirts', color: 'red' },
      ]},
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Colombia is safe in tourist areas and on main roads. Toll plazas are the best spots for hitching. Avoid travelling at night.' },
      { type: 'sub', title: 'Use SpotHitch for your safety' },
      { type: 'rule', icon: '🛡️', text: 'Activate Guardian Mode before every trip. A trusted person follows your position in real time.' },
      { type: 'rule', icon: '🆘', text: 'Set up SOS mode with your contacts. One tap triggers a triple alert (push, SMS, call).' },
      { type: 'rule', icon: '📱', text: 'Take a photo of the licence plate and send it to someone before getting in.' },
      { type: 'rule', icon: '🎒', text: 'Keep your bag accessible (on your lap or at your feet), never in the boot.' },
      { type: 'sub', title: 'Country tips' },
      { type: 'rule', icon: '🛣️', text: 'Toll plazas (peajes) are the best spots. Cars slow down and you can talk to drivers.' },
      { type: 'rule', icon: '☀️', text: 'Travel only during the day on main roads. Tourist areas are safe and welcoming.' },
      { type: 'sub', title: 'Emergency numbers' },
      { type: 'kv', items: [{ k: 'Emergency', v: '123' }] },
    ]},
    women: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'Experiences are mixed. Colombians are respectful but machismo is present. Women travelling alone report positive experiences on main roads. Travelling as a duo is recommended for rural areas.' },
      { type: 'rule', icon: '👫', text: 'Travelling with a companion is recommended.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Colombian Spanish is considered one of the clearest and easiest to understand. English is rare outside large tourist cities. Basic Spanish is essential.' },
      { type: 'phrase', items: [
        { local: 'Hago dedo / Pido aventon', meaning: 'I\'m hitchhiking' },
        { local: '¿Me lleva?', meaning: 'Will you take me?' },
        { local: '¡Gracias, parcero!', meaning: 'Thanks, mate!' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Colombia is cheap. Tight budget: 15-25 €/day. The "corrientazos" (popular set menu) are hearty and cheap.' },
      { type: 'kv', items: [
        { k: 'Hostel', v: '5-15 €/night' },
        { k: 'Corrientazo (set menu)', v: '2-4 €' },
        { k: 'Long-distance bus', v: '10-30 €' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wild camping is possible in rural areas but check locally. Colombians sometimes invite travellers into their homes. Hammocks are a popular alternative in tropical areas.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Long-distance bus', detail: 'Extensive network. Bolivariano and Expreso are the best companies.', price: '5-30 €' },
        { emoji: '🚐', name: 'Colectivos / Chivas', detail: 'Colourful and cheap local transport', price: '0.50-3 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'great' }, { name: 'Feb', level: 'great' }, { name: 'Mar', level: 'good' },
        { name: 'Apr', level: 'ok' }, { name: 'May', level: 'ok' }, { name: 'Jun', level: 'good' },
        { name: 'Jul', level: 'great' }, { name: 'Aug', level: 'great' }, { name: 'Sep', level: 'ok' },
        { name: 'Oct', level: 'ok' }, { name: 'Nov', level: 'ok' }, { name: 'Dec', level: 'great' },
      ]},
      { type: 'text', text: 'December-February and June-August: dry seasons. Climate varies with altitude (Bogota: 15°C, coast: 30°C). The Caribbean coast is hot year-round.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Colombians are among the most welcoming people in Latin America. Coffee is a national pride (coffee region = UNESCO). Music (vallenato, cumbia, reggaeton) is everywhere. Drivers blast the music and it becomes a party.' },
      { type: 'event', items: [
        { month: 'Feb', day: '⟳', name: 'Carnival of Barranquilla', desc: 'The 2nd biggest carnival in the world after Rio.' },
        { month: 'Aug', day: '⟳', name: 'Feria de las Flores (Medellin)', desc: 'Festival of flowers, silleteros parade.' },
      ]},
    ]},
  },
  // ==================== THAILAND ====================
  TH: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Hitchhiking is legal in Thailand. No restrictions. The concept is little known to Thais as public transport is cheap and omnipresent. It is more "informal transport" than classic hitchhiking.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Thailand is a special case. Western-style hitchhiking is rare, but Thais are naturally helpful. If you stand by the road with a bag, someone will eventually stop and offer to help. It is a form of hospitality, not traditional hitchhiking.' },
      { type: 'sub', title: 'How it works' },
      { type: 'rule', icon: '🏍️', text: 'Motorbikes and pickups stop more easily than cars.' },
      { type: 'rule', icon: '🤝', text: 'Waiting at gas stations or markets is more effective than thumbing on the roadside.' },
      { type: 'rule', icon: '👋', text: 'No thumb up: extend your hand palm down and wave it towards the ground (like hailing a taxi).' },
      { type: 'text', text: 'The north (Chiang Mai, Chiang Rai, Mae Hong Son) and northeast (Isan) are the easiest areas. The tourist south is harder as taxis and songthaews are everywhere.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Thailand is a safe country for hitchhiking. Thais are welcoming and curious towards travellers. A sign in Thai is very helpful.' },
      { type: 'sub', title: 'Use SpotHitch for your safety' },
      { type: 'rule', icon: '🛡️', text: 'Activate Guardian Mode before every trip. A trusted person follows your position in real time.' },
      { type: 'rule', icon: '🆘', text: 'Set up SOS mode with your contacts. One tap triggers a triple alert (push, SMS, call).' },
      { type: 'rule', icon: '📱', text: 'Take a photo of the licence plate and send it to someone before getting in.' },
      { type: 'rule', icon: '🎒', text: 'Keep your bag accessible (on your lap or at your feet), never in the boot.' },
      { type: 'sub', title: 'Country tips' },
      { type: 'rule', icon: '📝', text: 'A sign with your destination written in Thai greatly increases your chances. Ask your hostel to help.' },
      { type: 'rule', icon: '😊', text: 'Thais are very welcoming. A wai (traditional greeting, hands together) is always appreciated.' },
      { type: 'sub', title: 'Emergency numbers' },
      { type: 'kv', items: [{ k: 'Tourist Police', v: '1155' }, { k: 'Police', v: '191' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Thailand is considered safe for women travelling alone. Buddhism influences respect towards women. Incidents are rare. Party areas (Full Moon Party) require more caution.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Thai is the official language. English is limited outside tourist areas. Google Translate with the camera is a valuable tool. Thai is tonal (5 tones): pronunciation is crucial.' },
      { type: 'phrase', items: [
        { local: 'Sawadee krap/ka', meaning: 'Hello (krap = male, ka = female)' },
        { local: 'Khop khun krap/ka', meaning: 'Thank you' },
        { local: 'Pai... dai mai?', meaning: 'Go to... possible?' },
        { local: 'Free, mai tong jai', meaning: 'Free, no need to pay' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Thailand is very cheap. Tight budget: 10-20 €/day (even without hitchhiking). A street pad thai costs 1-2 €.' },
      { type: 'kv', items: [
        { k: 'Street food', v: '30-80 THB (1-2 €)' },
        { k: 'Hostel', v: '150-400 THB (4-11 €)' },
        { k: 'Long-distance bus', v: '200-800 THB (5-22 €)' },
        { k: '7-Eleven sandwich', v: '30-60 THB (1-2 €)' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wild camping is tolerated in rural areas. Buddhist temples sometimes host travellers (voluntary contribution). Guesthouses are so cheap (4-8 €) that camping is not really necessary.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'VIP / 1st class bus', detail: 'Comfortable, AC, extensive network', price: '5-20 €' },
        { emoji: '🚂', name: 'Train (SRT)', detail: 'Slow but scenic. Overnight train Bangkok-Chiang Mai = classic.', price: '5-30 €' },
        { emoji: '🛺', name: 'Songthaew', detail: 'Shared pickup with benches, local transport', price: '0.30-1 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'great' }, { name: 'Feb', level: 'great' }, { name: 'Mar', level: 'good' },
        { name: 'Apr', level: 'ok' }, { name: 'May', level: 'ok' }, { name: 'Jun', level: 'ok' },
        { name: 'Jul', level: 'ok' }, { name: 'Aug', level: 'bad' }, { name: 'Sep', level: 'bad' },
        { name: 'Oct', level: 'bad' }, { name: 'Nov', level: 'good' }, { name: 'Dec', level: 'great' },
      ]},
      { type: 'text', text: 'November to February: cool and dry season, ideal. March-May: very hot (40°C+). June-October: monsoon (torrential afternoon rains, some roads flood in certain regions).' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Thailand is the "Land of Smiles." Thais are non-confrontational and smiling. Never raise your voice, never show the soles of your feet (impolite), and remove your shoes when entering someone\'s home. The King is sacred: NEVER make negative comments (lese-majeste = prison).' },
      { type: 'event', items: [
        { month: 'Apr', day: '13-15', name: 'Songkran (Thai New Year)', desc: 'Giant water fight across the country. Chaotic but festive transport.' },
        { month: 'Nov', day: '⟳', name: 'Loy Krathong', desc: 'Lanterns and floating offerings. Magical atmosphere.' },
      ]},
    ]},
  },
  // ==================== INDIA ====================
  IN: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Hitchhiking is not regulated in India. There is no formal concept of hitchhiking but informal transport (getting on trucks, pickups, tractors) is a way of life. Truckers commonly take passengers.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'India is a unique case. The raised thumb does not exist. Extend your hand palm down. Trucks are the main means of hitchhiking. Truck drivers (truckwallahs) form a supportive community.' },
      { type: 'sub', title: 'How it works' },
      { type: 'rule', icon: '🚛', text: 'Dhabas (roadside restaurants) are trucker stops. Approach drivers during their meals.' },
      { type: 'rule', icon: '💰', text: 'Truckers often accept a modest payment. Negotiate BEFORE getting in. Clarify if it\'s free or how much.' },
      { type: 'rule', icon: '🛣️', text: 'National Highways (NH) have the most long-distance traffic.' },
      { type: 'kv', items: [
        { k: 'Ladakh / Manali-Leh Highway', v: 'Legendary. Military and civilian trucks.', color: 'green' },
        { k: 'Rajasthan', v: 'Good. Trucks and jeeps.', color: 'green' },
        { k: 'Himachal Pradesh', v: 'Easy, welcoming locals', color: 'green' },
        { k: 'Big cities (Delhi, Mumbai)', v: 'Impossible in the city, easy at the exits', color: 'red' },
      ]},
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'India is a safe country for hitchhiking. The concept of hitching is natural here. Petrol stations and dhabas (roadside restaurants) are the best spots.' },
      { type: 'sub', title: 'Use SpotHitch for your safety' },
      { type: 'rule', icon: '🛡️', text: 'Activate Guardian Mode before every trip. A trusted person follows your position in real time.' },
      { type: 'rule', icon: '🆘', text: 'Set up SOS mode with your contacts. One tap triggers a triple alert (push, SMS, call).' },
      { type: 'rule', icon: '📱', text: 'Take a photo of the licence plate and send it to someone before getting in.' },
      { type: 'rule', icon: '🎒', text: 'Keep your bag accessible (on your lap or at your feet), never in the boot.' },
      { type: 'sub', title: 'Country tips' },
      { type: 'rule', icon: '🍛', text: 'Petrol stations and dhabas (roadside restaurants) are the best spots. Truck drivers stop there regularly.' },
      { type: 'rule', icon: '🚛', text: 'The concept of hitching is natural in India. Wave your hand and truck drivers and motorists stop readily.' },
      { type: 'sub', title: 'Emergency numbers' },
      { type: 'kv', items: [{ k: 'Emergency', v: '112' }] },
    ]},
    women: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'Hitchhiking alone as a woman is discouraged in India. Sexual harassment is a documented problem. Travelling as a duo (with a man) radically changes the experience. Women who hitchhiked in India as a duo report positive experiences.' },
      { type: 'rule', icon: '👫', text: 'Travelling with a male companion is strongly recommended.' },
      { type: 'rule', icon: '👕', text: 'Conservative clothing is essential (covered shoulders and knees, no tight clothing).' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Hindi is the most widespread language but India has 22 official languages and hundreds of dialects. English is understood in cities and by educated youth. Truckers often speak Hindi only.' },
      { type: 'phrase', items: [
        { local: 'Namaste', meaning: 'Hello (universal in India)' },
        { local: 'Dhanyavaad / Shukriya', meaning: 'Thank you (Hindi)' },
        { local: '... tak jaana hai', meaning: 'I want to go to...' },
        { local: 'Free hai?', meaning: 'Is it free?' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'India is one of the cheapest countries in the world. Tight budget: 5-15 €/day. Dhabas (roadside canteens) serve hearty meals for 1-2 €.' },
      { type: 'kv', items: [
        { k: 'Dhaba (full meal)', v: '50-150 INR (0.50-1.50 €)' },
        { k: 'Guesthouse', v: '300-800 INR (3-8 €)' },
        { k: 'Train Sleeper Class', v: '100-500 INR (1-5 €)' },
        { k: 'Chai (tea)', v: '10-20 INR (0.10-0.20 €)' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wild camping is possible in the Himalayas and rural areas. Dhabas sometimes allow sleeping on charpoys (string beds) for a few rupees. Sikh temples (gurdwaras) offer free accommodation and meals to all (langar).' },
      { type: 'tip', text: '💡 Gurdwaras (Sikh temples) welcome EVERYONE for free. Meals and accommodation. It is a pillar of Sikhism.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚂', name: 'Indian Railways', detail: 'The largest railway network in the world. Sleeper Class = budget. AC = comfort.', price: '1-20 €' },
        { emoji: '🚌', name: 'Government buses', detail: 'Dense, cheap but slow network', price: '1-10 €' },
        { emoji: '🛺', name: 'Auto-rickshaw', detail: 'Local transport in cities', price: '0.30-2 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'good' }, { name: 'Feb', level: 'great' }, { name: 'Mar', level: 'great' },
        { name: 'Apr', level: 'ok' }, { name: 'May', level: 'bad' }, { name: 'Jun', level: 'bad' },
        { name: 'Jul', level: 'bad' }, { name: 'Aug', level: 'bad' }, { name: 'Sep', level: 'ok' },
        { name: 'Oct', level: 'great' }, { name: 'Nov', level: 'great' }, { name: 'Dec', level: 'good' },
      ]},
      { type: 'text', text: 'October to March: ideal for most of India. April-May: very hot (45°C+). June-September: monsoon (flooded roads, landslides in the mountains). Ladakh is only accessible from June to September.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'India is a guaranteed culture shock. Hospitality is deeply rooted. Drivers offer chai (tea), meals and sometimes accommodation. The "head wobble" (head movement) means yes/OK/maybe all at once. Eat with the right hand only (the left is impure).' },
      { type: 'event', items: [
        { month: 'Mar', day: '⟳', name: 'Holi', desc: 'Festival of colours. Coloured powder thrown everywhere. Transport disrupted but incredible atmosphere.' },
        { month: 'Oct-Nov', day: '⟳', name: 'Diwali', desc: 'Festival of lights. Fireworks, garlands, sweets. People are particularly generous.' },
      ]},
    ]},
  },
  // ==================== JAPAN ====================
  JP: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Hitchhiking is legal in Japan. No restrictions. Service areas (SA) and parking areas (PA) on motorways are the classic spots. Standing on the motorway lanes themselves is prohibited.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Japan is surprisingly good for hitchhiking despite the cultural barrier. Wait time: 15-45 min. Japanese drivers who stop are often curious and enthusiastic. Many will make significant detours or invite you to eat.' },
      { type: 'sub', title: 'The Japanese method' },
      { type: 'rule', icon: '📝', text: 'A sign in katakana (Japanese writing) with your destination is almost mandatory. Japanese people rarely read the Latin alphabet.' },
      { type: 'rule', icon: '⛽', text: 'Service Areas (SA) on motorways are the best spots. You can access them on foot or by hitchhiking from the entrance.' },
      { type: 'rule', icon: '😊', text: 'Smiling, bowing and being polite is crucial. Appearance matters: be clean and well-dressed.' },
      { type: 'kv', items: [
        { k: 'Hokkaido', v: 'The best. Large, rural, welcoming.', color: 'green' },
        { k: 'Rural areas (Shikoku, Kyushu)', v: 'Very good, curious people', color: 'green' },
        { k: 'Tokyo, Osaka (leaving the city)', v: 'Difficult, use the train to a SA', color: 'red' },
      ]},
      { type: 'tip', text: '💡 A flag from your country on your bag is an excellent icebreaker in Japan.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Japan is extremely safe for hitchhiking. Hitching works well and drivers are respectful. A sign in Japanese is very helpful.' },
      { type: 'sub', title: 'Use SpotHitch for your safety' },
      { type: 'rule', icon: '🛡️', text: 'Activate Guardian Mode before every trip. A trusted person follows your position in real time.' },
      { type: 'rule', icon: '🆘', text: 'Set up SOS mode with your contacts. One tap triggers a triple alert (push, SMS, call).' },
      { type: 'rule', icon: '📱', text: 'Take a photo of the licence plate and send it to someone before getting in.' },
      { type: 'rule', icon: '🎒', text: 'Keep your bag accessible (on your lap or at your feet), never in the boot.' },
      { type: 'sub', title: 'Country tips' },
      { type: 'rule', icon: '📝', text: 'A sign with your destination in Japanese (katakana or kanji) boosts your chances. Ask a konbini to help.' },
      { type: 'rule', icon: '🏪', text: 'Motorway rest areas (SA/PA) are the best spots. They are clean, safe and well frequented.' },
      { type: 'sub', title: 'Emergency numbers' },
      { type: 'kv', items: [{ k: 'Police', v: '110' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Japan is very safe for women travelling alone. Female travellers report extremely positive experiences. Japanese people are respectful and society is very safe. Female drivers also stop.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Japanese is the only language. English is very limited even in big cities. A sign in katakana is essential. Google Translate (camera mode) is your best friend.' },
      { type: 'phrase', items: [
        { local: 'Konnichiwa', meaning: 'Hello' },
        { local: 'Arigato gozaimasu', meaning: 'Thank you very much' },
        { local: 'Hitchhike shimasu', meaning: 'I\'m hitchhiking (understood by Japanese)' },
        { local: '... made onegaishimasu', meaning: 'To... please' },
      ]},
      { type: 'tip', text: '💡 Write your destinations in katakana on cardboard. Japanese people love the effort and it increases your chances.' },
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Japan is expensive but tricks exist. Tight budget: 25-40 €/day with hitchhiking and camping.' },
      { type: 'kv', items: [
        { k: 'Konbini (7-Eleven, Lawson) meal', v: '300-600 ¥ (2-4 €)' },
        { k: 'Manga cafe (night)', v: '1,500-2,500 ¥ (10-17 €)' },
        { k: 'Hostel', v: '2,000-4,000 ¥ (13-27 €)' },
        { k: 'Onsen (hot spring bath)', v: '300-1,000 ¥ (2-7 €)' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wild camping is technically prohibited but very tolerated in Japan (bivouac culture). Michi-no-eki (roadside stations) and parks allow discreet camping. Manga cafes (with showers) are a comfortable alternative for nights in the city.' },
      { type: 'tip', text: '💡 Japanese drivers sometimes invite hitchhikers to onsen (hot spring baths), restaurants or even their homes. It is a unique experience.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚄', name: 'Shinkansen', detail: 'High-speed train. The JR Pass offers unlimited access.', price: 'JR Pass 7d: ~200 €' },
        { emoji: '🚌', name: 'Night bus', detail: 'Willer Express, cheaper than Shinkansen', price: '2,000-6,000 ¥' },
        { emoji: '⛴️', name: 'Ferry', detail: 'Between the islands, often with cabin', price: '2,000-10,000 ¥' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mar', level: 'good' },
        { name: 'Apr', level: 'great' }, { name: 'May', level: 'great' }, { name: 'Jun', level: 'ok' },
        { name: 'Jul', level: 'ok' }, { name: 'Aug', level: 'ok' }, { name: 'Sep', level: 'good' },
        { name: 'Oct', level: 'great' }, { name: 'Nov', level: 'great' }, { name: 'Dec', level: 'ok' },
      ]},
      { type: 'text', text: 'April-May (sakura, cherry blossoms) and October-November (koyo, autumn leaves): ideal. June: rainy season (tsuyu). Summer is hot and humid (35°C). Winter in Hokkaido is harsh but hitchhiking works.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Hitchhiking in Japan is a unique cultural experience. Drivers who stop are often passionate about the encounter. They will take you to local restaurants, onsen, tourist sites they want to show you. Some drivers make hours of detours. Offer a small gift from your country as thanks (highly appreciated).' },
      { type: 'event', items: [
        { month: 'Apr', day: '⟳', name: 'Hanami (cherry blossoms)', desc: 'Picnics under the cherry trees everywhere. Festive period.' },
        { month: 'Jul-Aug', day: '⟳', name: 'Matsuri (summer festivals)', desc: 'Local festivals everywhere. Fireworks (hanabi). Unique atmosphere.' },
      ]},
    ]},
  },
  // ==================== SOUTH AFRICA ====================
  ZA: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Hitchhiking is legal in South Africa. No restrictions. Minibus-taxis are the main transport for South Africans but some also hitchhike informally.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'South Africa is possible for hitchhiking but requires caution. Distances are large and crime rates are high in certain areas. Rural areas and the Garden Route are the most suitable.' },
      { type: 'kv', items: [
        { k: 'Garden Route (Cape Town-Port Elizabeth)', v: 'The best, touristy and safe', color: 'green' },
        { k: 'Drakensberg / Free State rural', v: 'Good, welcoming', color: 'green' },
        { k: 'Johannesburg', v: 'Absolutely avoid for hitchhiking', color: 'red' },
        { k: 'Townships / urban areas', v: 'Not recommended', color: 'red' },
      ]},
      { type: 'text', text: 'Gas stations (Engen, Shell, Caltex) are the best spots. Approach drivers directly. Afrikaners (countryside) are often the most welcoming to hitchhikers.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'South Africa is safe for hitchhiking on main roads and in rural areas. Engen and Shell petrol stations are good spots. Travel exclusively during the day.' },
      { type: 'sub', title: 'Use SpotHitch for your safety' },
      { type: 'rule', icon: '🛡️', text: 'Activate Guardian Mode before every trip. A trusted person follows your position in real time.' },
      { type: 'rule', icon: '🆘', text: 'Set up SOS mode with your contacts. One tap triggers a triple alert (push, SMS, call).' },
      { type: 'rule', icon: '📱', text: 'Take a photo of the licence plate and send it to someone before getting in.' },
      { type: 'rule', icon: '🎒', text: 'Keep your bag accessible (on your lap or at your feet), never in the boot.' },
      { type: 'sub', title: 'Country tips' },
      { type: 'rule', icon: '⛽', text: 'Engen and Shell petrol stations are safe and well-frequented spots to find a ride.' },
      { type: 'rule', icon: '☀️', text: 'Travel exclusively during the day. The Garden Route and rural areas are the safest for hitching.' },
      { type: 'sub', title: 'Emergency numbers' },
      { type: 'kv', items: [{ k: 'Emergency', v: '10111' }] },
    ]},
    women: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'Hitchhiking alone as a woman is discouraged in South Africa. The country has a high rate of gender-based violence. Travelling as a duo is strongly recommended. The Garden Route with a companion is doable.' },
      { type: 'rule', icon: '👫', text: 'Travelling with a companion is almost mandatory.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'South Africa has 11 official languages. English is understood almost everywhere. Afrikaans is the language of many drivers in the Western Cape and Free State. Zulu and Xhosa are the most spoken languages.' },
      { type: 'phrase', items: [
        { local: 'Howzit', meaning: 'Hello / How are you (South African slang)' },
        { local: 'Sharp sharp', meaning: 'Cool, OK' },
        { local: 'Dankie / Enkosi', meaning: 'Thank you (Afrikaans / Xhosa)' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'South Africa is affordable for foreigners. Tight budget: 20-35 €/day.' },
      { type: 'kv', items: [
        { k: 'Backpacker hostel', v: '100-250 ZAR (5-13 €)' },
        { k: 'Restaurant meal', v: '80-150 ZAR (4-8 €)' },
        { k: 'Braai (BBQ) from supermarket', v: '50-100 ZAR (3-5 €)' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wild camping is possible in rural areas but safety must be assessed locally. Campsites in nature reserves (SANParks) are safe and well equipped. The backpacker hostel network is excellent along the Garden Route.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚐', name: 'Baz Bus', detail: 'Hop-on/hop-off bus for backpackers, coastal network', price: '200-500 ZAR' },
        { emoji: '🚌', name: 'Greyhound / Intercape', detail: 'Reliable long-distance buses', price: '200-800 ZAR' },
        { emoji: '🚂', name: 'Shosholoza Meyl', detail: 'Cheap long-distance train (Joburg-Cape Town)', price: '200-600 ZAR' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'great' }, { name: 'Feb', level: 'great' }, { name: 'Mar', level: 'great' },
        { name: 'Apr', level: 'good' }, { name: 'May', level: 'ok' }, { name: 'Jun', level: 'ok' },
        { name: 'Jul', level: 'ok' }, { name: 'Aug', level: 'ok' }, { name: 'Sep', level: 'good' },
        { name: 'Oct', level: 'great' }, { name: 'Nov', level: 'great' }, { name: 'Dec', level: 'great' },
      ]},
      { type: 'text', text: 'Southern hemisphere: summer (November-March) is ideal. The Western Cape is Mediterranean (dry in summer, rainy in winter). The Drakensberg is cold in winter. Kruger is better May to September (dry season, animals visible).' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'South Africa is the "Rainbow Nation." Cultures blend and conversations are rich. The braai (barbecue) is a national religion. Biltong (dried meat) is the quintessential road snack. Ubuntu ("I am because we are") is the dominant philosophy.' },
    ]},
  },
  // ==================== IRAN ====================
  IR: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Hitchhiking is legal in Iran. No restrictions. The practice is common as many Iranians do not have a car and rural transport is limited. Iranian hospitality makes hitchhiking natural.' },
      { type: 'warn', text: '⚠️ A visa is mandatory for most nationalities. Some countries (US, UK, Canada) require a mandatory guide. Check the requirements before travelling.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Iran is one of the best countries in the world for hitchhiking. Iranian hospitality (ta\'arof) is legendary. Drivers stop without being asked, insist on paying for your meal, and offer accommodation in their homes. Average wait time: 5-15 min.' },
      { type: 'text', text: 'The concept of tarof (excessive politeness) means Iranians insist on helping you. If a driver refuses your money, it is sincere (but offer 3 times out of politeness). In rural areas, traffic is low but everyone stops.' },
      { type: 'sub', title: 'Recommended areas' },
      { type: 'kv', items: [
        { k: 'Isfahan-Shiraz-Yazd (tourist triangle)', v: 'Excellent, good traffic', color: 'green' },
        { k: 'Caspian coast (north)', v: 'Easy, green landscapes', color: 'green' },
        { k: 'Iranian Kurdistan (west)', v: 'Very hospitable', color: 'green' },
        { k: 'Border zones (Iraq, Afghanistan, Pakistan)', v: 'Not recommended', color: 'red' },
      ]},
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Iran is a safe country for hitchhiking. Iranian hospitality is legendary. Respect the dress code and bring cash (international cards do not work).' },
      { type: 'sub', title: 'Use SpotHitch for your safety' },
      { type: 'rule', icon: '🛡️', text: 'Activate Guardian Mode before every trip. A trusted person follows your position in real time.' },
      { type: 'rule', icon: '🆘', text: 'Set up SOS mode with your contacts. One tap triggers a triple alert (push, SMS, call).' },
      { type: 'rule', icon: '📱', text: 'Take a photo of the licence plate and send it to someone before getting in.' },
      { type: 'rule', icon: '🎒', text: 'Keep your bag accessible (on your lap or at your feet), never in the boot.' },
      { type: 'sub', title: 'Country tips' },
      { type: 'rule', icon: '👔', text: 'Respect the local dress code. International bank cards do not work: bring cash.' },
      { type: 'rule', icon: '🍵', text: 'Iranian hospitality is legendary. Every driver will want to invite you for tea or a meal.' },
      { type: 'sub', title: 'Emergency numbers' },
      { type: 'kv', items: [{ k: 'Emergency', v: '115' }] },
    ]},
    women: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'Women must wear a hijab (headscarf) in Iran (required by law). Hitchhiking alone as a woman is possible but requires caution. Many female travellers report positive experiences but some uncomfortable situations too. Travelling as a duo is recommended.' },
      { type: 'rule', icon: '🧕', text: 'The hijab is mandatory (headscarf covering hair). Loose clothing covering arms and legs.' },
      { type: 'rule', icon: '👫', text: 'Families and female drivers are the safest rides.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Farsi (Persian) is the main language. English is rare outside Tehran and Isfahan. The alphabet is Arabic (read right to left). Iranians love it when foreigners speak a few words of Farsi.' },
      { type: 'phrase', items: [
        { local: 'Salam', meaning: 'Hello' },
        { local: 'Merci / Mamnun', meaning: 'Thank you' },
        { local: 'Lotfan', meaning: 'Please' },
        { local: 'Mosafer hastam', meaning: 'I am a traveller' },
        { local: 'Rayegan', meaning: 'Free' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Iran is very cheap (especially with the unofficial exchange rate). Tight budget: 10-20 €/day. Drivers often pay for the meal. The problem: international bank cards do NOT work in Iran. Bring euros or dollars in cash.' },
      { type: 'kv', items: [
        { k: 'Local meal (kebab, rice)', v: '2-5 €' },
        { k: 'Mosaferkhane (basic hotel)', v: '5-15 €' },
        { k: 'Long-distance bus (VIP)', v: '3-10 €' },
      ]},
      { type: 'warn', text: '⚠️ NO international bank card works in Iran (sanctions). Bring ALL your money in cash (euros or dollars).' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wild camping is tolerated in the mountains (Alborz, Zagros). In cities, mosaferkhanes (basic hotels) are cheap. Drivers VERY often invite travellers into their homes. Refusing is almost impolite. Mosques sometimes offer accommodation to travellers.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'VIP bus', detail: 'Comfortable, extensive network, very cheap', price: '3-10 €' },
        { emoji: '🚂', name: 'Train', detail: 'Limited network but comfortable night trains', price: '5-15 €' },
        { emoji: '🚕', name: 'Savari (shared taxi)', detail: 'Shared inter-city taxis, wait to be full', price: '2-8 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Feb', level: 'ok' }, { name: 'Mar', level: 'great' },
        { name: 'Apr', level: 'great' }, { name: 'May', level: 'great' }, { name: 'Jun', level: 'ok' },
        { name: 'Jul', level: 'bad' }, { name: 'Aug', level: 'bad' }, { name: 'Sep', level: 'ok' },
        { name: 'Oct', level: 'great' }, { name: 'Nov', level: 'good' }, { name: 'Dec', level: 'ok' },
      ]},
      { type: 'text', text: 'March-May (Nowruz, Persian New Year) and September-November: ideal. Summer is scorching in the south (45°C+) but pleasant in the mountains. Winter is cold in the north and mountains.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Iranian hospitality is considered the best in the world by many travellers. Ta\'arof (politeness code) means Iranians insist on inviting you, feeding you and hosting you. Persian culture is refined (poetry of Hafez, Rumi). Iranians are proud to show their country and deconstruct Western prejudices.' },
      { type: 'event', items: [
        { month: 'Mar', day: '20-21', name: 'Nowruz (Persian New Year)', desc: 'The biggest celebration of the year. 13 days of holidays. Everyone travels, lots of traffic.' },
      ]},
    ]},
  },
  // ==================== TUNISIA ====================
  TN: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Hitchhiking is legal in Tunisia. No restrictions. The practice is common among locals, especially in rural areas. "Louages" (shared taxis) are the main transport but hitchhiking works well.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Tunisia is easy for hitchhiking. The country is small (780 km north-south) and Tunisians are welcoming. Wait time: 10-30 min. Drivers stop easily, especially for foreigners.' },
      { type: 'rule', icon: '🚛', text: 'Trucks take passengers on long distances (note: some expect a tip).' },
      { type: 'rule', icon: '⛽', text: 'Gas stations at city exits are the best spots.' },
      { type: 'text', text: 'The south (Tozeur, Douz, Tataouine) has little traffic but everyone stops. The north and coast have more circulation.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Tunisia is safe for hitchhiking in tourist areas. Tunisians are welcoming and curious towards travellers.' },
      { type: 'sub', title: 'Use SpotHitch for your safety' },
      { type: 'rule', icon: '🛡️', text: 'Activate Guardian Mode before every trip. A trusted person follows your position in real time.' },
      { type: 'rule', icon: '🆘', text: 'Set up SOS mode with your contacts. One tap triggers a triple alert (push, SMS, call).' },
      { type: 'rule', icon: '📱', text: 'Take a photo of the licence plate and send it to someone before getting in.' },
      { type: 'rule', icon: '🎒', text: 'Keep your bag accessible (on your lap or at your feet), never in the boot.' },
      { type: 'sub', title: 'Country tips' },
      { type: 'rule', icon: '🏖️', text: 'Tourist areas (Tunis, Sousse, Djerba, Tozeur) are safe and well connected.' },
      { type: 'rule', icon: '🤝', text: 'Tunisians are hospitable. A smile and a few words of Arabic open all doors.' },
      { type: 'sub', title: 'Emergency numbers' },
      { type: 'kv', items: [{ k: 'Police', v: '197' }] },
    ]},
    women: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'Street harassment is common in Tunisia. Women travelling alone by hitchhiking report mixed experiences. Travelling as a duo is strongly recommended. Tourist areas (Sidi Bou Said, Hammamet) are more relaxed.' },
      { type: 'rule', icon: '👫', text: 'Travelling as a duo is strongly recommended.' },
      { type: 'rule', icon: '👕', text: 'Dress conservatively outside beach areas.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Tunisian Arabic (derja) is the local language. French is very widespread (almost everyone speaks it). English is growing among young people.' },
      { type: 'phrase', items: [
        { local: 'Bahi / Barcha', meaning: 'Good / A lot' },
        { local: 'Yaatik essaha', meaning: 'Thank you (may God give you health)' },
        { local: 'Win temchi?', meaning: 'Where are you going?' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Very cheap. Tight budget: 15-25 €/day. Friday couscous is often shared for free.' },
      { type: 'kv', items: [
        { k: 'Local meal', v: '2-5 TND (0.60-1.50 €)' },
        { k: 'Hostel', v: '20-50 TND (6-15 €)' },
        { k: 'Louage (100 km)', v: '5-10 TND (1.50-3 €)' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wild camping is tolerated in the south and rural areas. Tunisians easily invite travellers into their homes. Youth hostels are cheap.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚐', name: 'Louage', detail: 'Shared taxi between cities. Waits to be full. Fast and cheap.', price: '1-5 €' },
        { emoji: '🚂', name: 'SNCFT (train)', detail: 'Limited but cheap network', price: '1-5 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'ok' }, { name: 'Feb', level: 'good' }, { name: 'Mar', level: 'great' },
        { name: 'Apr', level: 'great' }, { name: 'May', level: 'great' }, { name: 'Jun', level: 'good' },
        { name: 'Jul', level: 'ok' }, { name: 'Aug', level: 'ok' }, { name: 'Sep', level: 'good' },
        { name: 'Oct', level: 'great' }, { name: 'Nov', level: 'good' }, { name: 'Dec', level: 'ok' },
      ]},
      { type: 'text', text: 'March-May and September-November: ideal. Summer is hot (40°C+ in the south). Winter is mild on the coast but cool in the mountains.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Tunisian hospitality is sincere. Mint tea and Turkish coffee are offered generously. Friday couscous is a family ritual. Tunisians are proud of their history (Carthage) and love to talk about it.' },
    ]},
  },
  // ==================== MEXICO ====================
  MX: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Hitchhiking ("pedir aventon" or "pedir raid") is legal in Mexico. No restrictions. Common practice in rural areas. Indigenous communities hitchhike regularly.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Mexico is good for hitchhiking outside risk areas. Mexicans are welcoming and curious about foreigners. Wait time: 15-45 min. Trucks regularly take passengers.' },
      { type: 'sub', title: 'Best areas' },
      { type: 'kv', items: [
        { k: 'Oaxaca / Chiapas', v: 'Excellent, welcoming communities', color: 'green' },
        { k: 'Yucatan', v: 'Good, touristy, good traffic', color: 'green' },
        { k: 'Baja California', v: 'Doable, little traffic in the desert', color: 'amber' },
        { k: 'North (Sinaloa, Tamaulipas, Chihuahua)', v: 'Not recommended (cartels)', color: 'red' },
      ]},
      { type: 'rule', icon: '⛽', text: 'Casetas (toll booths) and Pemex gas stations are the best spots.' },
      { type: 'rule', icon: '🚛', text: '"Trailers" (trucks) cover long distances. Approach drivers at gas stations.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Mexico is safe for hitchhiking on main roads and in tourist areas. Casetas de cobro (toll plazas) are excellent spots.' },
      { type: 'sub', title: 'Use SpotHitch for your safety' },
      { type: 'rule', icon: '🛡️', text: 'Activate Guardian Mode before every trip. A trusted person follows your position in real time.' },
      { type: 'rule', icon: '🆘', text: 'Set up SOS mode with your contacts. One tap triggers a triple alert (push, SMS, call).' },
      { type: 'rule', icon: '📱', text: 'Take a photo of the licence plate and send it to someone before getting in.' },
      { type: 'rule', icon: '🎒', text: 'Keep your bag accessible (on your lap or at your feet), never in the boot.' },
      { type: 'sub', title: 'Country tips' },
      { type: 'rule', icon: '🛣️', text: 'Casetas de cobro (toll plazas) are the best spots. Cars slow down and you can chat with drivers.' },
      { type: 'rule', icon: '🌮', text: 'Tourist areas (Oaxaca, Yucatan, Baja California) and main roads are the safest for hitching.' },
      { type: 'sub', title: 'Emergency numbers' },
      { type: 'kv', items: [{ k: 'Emergency', v: '911' }] },
    ]},
    women: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'Machismo is present in Mexico. Women travelling alone by hitchhiking report mixed experiences. The south is safer. Travelling as a duo is strongly recommended.' },
      { type: 'rule', icon: '👫', text: 'Travelling with a companion is strongly recommended.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Spanish is essential. English is rare outside tourist areas (Cancun, Playa del Carmen). 68 indigenous languages are still spoken.' },
      { type: 'phrase', items: [
        { local: '¿Me da un aventon / raid?', meaning: 'Will you give me a ride?' },
        { local: '¿Hasta donde va?', meaning: 'How far are you going?' },
        { local: '¡Gracias, que le vaya bien!', meaning: 'Thanks, safe travels!' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Mexico is cheap. Tight budget: 15-25 €/day.' },
      { type: 'kv', items: [
        { k: 'Street tacos', v: '10-30 MXN (0.50-1.50 €)' },
        { k: 'Comida corrida (set menu)', v: '50-100 MXN (2.50-5 €)' },
        { k: 'Hostel', v: '150-400 MXN (7-20 €)' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wild camping is possible on Pacific beaches and in rural areas. Hammocks are a popular alternative on the coast. Mexicans sometimes invite travellers into their homes.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'ADO / ETN', detail: 'Luxurious long-distance buses. ADO covers the south, ETN the centre.', price: '5-40 €' },
        { emoji: '🚐', name: 'Colectivos', detail: 'Local minibuses, very cheap', price: '0.30-2 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'great' }, { name: 'Feb', level: 'great' }, { name: 'Mar', level: 'great' },
        { name: 'Apr', level: 'good' }, { name: 'May', level: 'ok' }, { name: 'Jun', level: 'ok' },
        { name: 'Jul', level: 'ok' }, { name: 'Aug', level: 'ok' }, { name: 'Sep', level: 'bad' },
        { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'great' }, { name: 'Dec', level: 'great' },
      ]},
      { type: 'text', text: 'November to April: dry season, ideal. June-October: rainy season (afternoon showers). September: hurricanes on the coasts. The Yucatan is hot and humid year-round.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Mexicans are warm and proud of their culture. Food is central (tacos, mole, tamales). Mezcal and tequila are shared generously. Dia de los Muertos (November 2) is a unique cultural moment.' },
      { type: 'event', items: [
        { month: 'Nov', day: '1-2', name: 'Dia de los Muertos', desc: 'Day of the Dead. Altars, offerings, decorated cemeteries. Oaxaca is the best place.' },
        { month: 'Sep', day: '15-16', name: 'Fiestas Patrias', desc: 'Independence Day. The "Grito" at midnight, fireworks, parties everywhere.' },
      ]},
    ]},
  },
  // ==================== BRAZIL ====================
  BR: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Hitchhiking ("carona" or "pedir carona") is legal in Brazil. No restrictions. The practice is less common than in Hispanic America but works, especially in the south.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Brazil is possible for hitchhiking but distances are immense (the 5th largest country in the world). Wait time: 30 min-2h. The south (Rio Grande do Sul, Santa Catarina, Parana) is the easiest.' },
      { type: 'kv', items: [
        { k: 'South (RS, SC, PR)', v: 'The best, European culture, welcoming', color: 'green' },
        { k: 'Minas Gerais', v: 'Good, warm people', color: 'green' },
        { k: 'Northeast (Bahia coast)', v: 'Doable, trucks', color: 'amber' },
        { k: 'Amazon', v: 'Almost impossible by road, river boats instead', color: 'red' },
      ]},
      { type: 'rule', icon: '⛽', text: 'Postos de gasolina (gas stations) are the best spots. Approach truckers at truck stop restaurants.' },
      { type: 'rule', icon: '🚛', text: 'Truckers ("caminhoneiros") are your best option for long distances.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Brazil is safe for hitchhiking on main roads. Postos (petrol stations) are the best spots. Learning a few words of Portuguese makes a huge difference.' },
      { type: 'sub', title: 'Use SpotHitch for your safety' },
      { type: 'rule', icon: '🛡️', text: 'Activate Guardian Mode before every trip. A trusted person follows your position in real time.' },
      { type: 'rule', icon: '🆘', text: 'Set up SOS mode with your contacts. One tap triggers a triple alert (push, SMS, call).' },
      { type: 'rule', icon: '📱', text: 'Take a photo of the licence plate and send it to someone before getting in.' },
      { type: 'rule', icon: '🎒', text: 'Keep your bag accessible (on your lap or at your feet), never in the boot.' },
      { type: 'sub', title: 'Country tips' },
      { type: 'rule', icon: '⛽', text: 'Postos (petrol stations) are the safest spots. Truck drivers often stop there for breaks.' },
      { type: 'rule', icon: '🗣️', text: 'Learn a few words of Portuguese. Few Brazilians speak English and the effort is greatly appreciated.' },
      { type: 'sub', title: 'Emergency numbers' },
      { type: 'kv', items: [{ k: 'Police', v: '190' }] },
    ]},
    women: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'Street harassment exists in Brazil. Women hitchhiking alone report variable experiences. The south is safer. Travelling as a duo is recommended.' },
      { type: 'rule', icon: '👫', text: 'Travelling as a duo is recommended, especially in the north and northeast.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Brazilian Portuguese is the only language. Spanish is partially understood but do NOT speak Spanish (it is perceived as rude). English is rare outside big cities.' },
      { type: 'phrase', items: [
        { local: 'Oi, tudo bem?', meaning: 'Hi, how are you?' },
        { local: 'Carona, por favor', meaning: 'A ride, please' },
        { local: 'Obrigado/a', meaning: 'Thank you (masc./fem.)' },
        { local: 'Pra onde voce vai?', meaning: 'Where are you going?' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Brazil is moderately expensive for South America. Tight budget: 20-35 €/day. The south is cheaper than Rio or Sao Paulo.' },
      { type: 'kv', items: [
        { k: 'Prato feito (plate of the day)', v: '15-30 BRL (3-6 €)' },
        { k: 'Hostel', v: '40-100 BRL (8-20 €)' },
        { k: 'Acai (bowl)', v: '10-20 BRL (2-4 €)' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wild camping is possible on deserted beaches and in rural areas. Campsites are cheap in the south. Pousadas (guesthouses) offer good value for money.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Long-distance bus', detail: 'Excellent network. Leito = sleeper. Semi-leito = reclining.', price: '10-60 €' },
        { emoji: '✈️', name: 'Domestic flights', detail: 'GOL, LATAM, Azul. Often cheaper than the bus for long distances.', price: '20-100 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'good' }, { name: 'Feb', level: 'good' }, { name: 'Mar', level: 'great' },
        { name: 'Apr', level: 'great' }, { name: 'May', level: 'great' }, { name: 'Jun', level: 'good' },
        { name: 'Jul', level: 'good' }, { name: 'Aug', level: 'good' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'great' }, { name: 'Nov', level: 'good' }, { name: 'Dec', level: 'good' },
      ]},
      { type: 'text', text: 'Brazil is immense: the climate varies from tropical to subtropical. The south is temperate. March-May and September-November are ideal for most regions. Summer (December-February) is the rainy season in the centre-south.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Brazilians are among the warmest people in the world. Music (samba, forro, MPB) is everywhere. Churrasco (barbecue) is a social ritual. Brazilians love to party and welcome foreigners.' },
      { type: 'event', items: [
        { month: 'Feb-Mar', day: '⟳', name: 'Carnival', desc: 'The biggest carnival in the world. Rio, Salvador and Olinda are the best. Chaotic transport.' },
        { month: 'Jun', day: '⟳', name: 'Festas Juninas', desc: 'St John\'s festivals. Dances, bonfires, street food across the Northeast.' },
      ]},
    ]},
  },
  // ==================== PERU ====================
  PE: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Hitchhiking is legal in Peru. Common practice in rural areas. Locals also hitchhike ("pedir jalada") as transport is limited in the Andes.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Peru is good for hitchhiking, especially in the Andes. Wait time: 20 min-1h. Trucks are the main transport in the mountains. Note: many drivers expect payment (informal transport). Clarify "gratis" before getting in.' },
      { type: 'rule', icon: '🚛', text: 'Trucks in the Andes stop easily. Position yourself at road checkpoints (garitas).' },
      { type: 'rule', icon: '⛽', text: 'Grifos (gas stations) at city exits are the best spots.' },
      { type: 'kv', items: [
        { k: 'Sacred Valley / Cusco', v: 'Easy, touristy', color: 'green' },
        { k: 'Rural Andes', v: 'Trucks, little traffic but everything stops', color: 'green' },
        { k: 'Pan-American Highway (coast)', v: 'Good traffic, long-distance trucks', color: 'green' },
        { k: 'Lima (leaving the city)', v: 'Difficult, bus to the outskirts', color: 'red' },
      ]},
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Peru is safe for hitchhiking on main roads. Toll plazas and petrol stations are the best spots to find a ride.' },
      { type: 'sub', title: 'Use SpotHitch for your safety' },
      { type: 'rule', icon: '🛡️', text: 'Activate Guardian Mode before every trip. A trusted person follows your position in real time.' },
      { type: 'rule', icon: '🆘', text: 'Set up SOS mode with your contacts. One tap triggers a triple alert (push, SMS, call).' },
      { type: 'rule', icon: '📱', text: 'Take a photo of the licence plate and send it to someone before getting in.' },
      { type: 'rule', icon: '🎒', text: 'Keep your bag accessible (on your lap or at your feet), never in the boot.' },
      { type: 'sub', title: 'Country tips' },
      { type: 'rule', icon: '🛣️', text: 'Toll plazas and petrol stations are the best spots. Cars slow down and you can approach drivers.' },
      { type: 'rule', icon: '🏔️', text: 'At high altitude (Cusco, Puno), take time to acclimatise before travelling. Altitude sickness is real.' },
      { type: 'sub', title: 'Emergency numbers' },
      { type: 'kv', items: [{ k: 'Emergency', v: '105' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Machismo exists but the touristy south is relatively safe for women. Travelling as a duo is recommended in rural areas.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Spanish is the main language. Quechua and Aymara are spoken in the Andes. English is rare outside Cusco and Lima.' },
      { type: 'phrase', items: [
        { local: '¿Me da una jalada?', meaning: 'Will you give me a ride?' },
        { local: 'Gratis, por favor', meaning: 'Free, please' },
        { local: '¡Gracias, caserito!', meaning: 'Thanks, friend! (Peruvian expression)' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Peru is cheap. Tight budget: 12-20 €/day. Set menus (almuerzo) are hearty and cheap.' },
      { type: 'kv', items: [
        { k: 'Menu (full meal)', v: '5-12 PEN (1-3 €)' },
        { k: 'Hostel', v: '20-60 PEN (5-15 €)' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wild camping is tolerated in the Andes and rural areas. Ask permission from local communities. Hospedajes (basic guesthouses) are very cheap.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Cruz del Sur / Oltursa', detail: 'Comfortable long-distance buses', price: '5-40 €' },
        { emoji: '🚐', name: 'Combi / Colectivo', detail: 'Local transport, very cheap, mountain roads', price: '0.30-3 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mar', level: 'ok' },
        { name: 'Apr', level: 'good' }, { name: 'May', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Aug', level: 'great' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'ok' }, { name: 'Dec', level: 'bad' },
      ]},
      { type: 'text', text: 'May to September: dry season in the Andes, ideal. December-March: rainy season (roads blocked in the mountains). The coast is dry year-round.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Peruvians are welcoming and proud of their cuisine (Peru is the culinary capital of South America). Ceviche, lomo saltado and pisco sour are institutions. Andean communities have a strong culture of sharing.' },
      { type: 'event', items: [
        { month: 'Jun', day: '24', name: 'Inti Raymi (Cusco)', desc: 'Inca Festival of the Sun. Spectacular re-enactment at Sacsayhuaman.' },
      ]},
    ]},
  },
  // ==================== BOLIVIA ====================
  BO: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Hitchhiking is legal in Bolivia. Very common practice as many rural communities have no regular transport. Trucks are a normal mode of transport in the Andes.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Bolivia is a good country for hitchhiking. Truck drivers regularly take passengers (often for a modest payment). Clarify if it is free. Wait time: 15-45 min. The Altiplano has little traffic but people stop.' },
      { type: 'kv', items: [
        { k: 'La Paz-Oruro-Potosi', v: 'Good traffic, main road', color: 'green' },
        { k: 'Yungas / Amazon', v: 'Trucks, little traffic, adventure', color: 'amber' },
        { k: 'Salar de Uyuni', v: 'Very little traffic, organise with a tour', color: 'amber' },
      ]},
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Bolivia is a safe country for hitchhiking. Mountain roads are the main risk. Watch out for altitude (La Paz: 3,640 m) which can cause altitude sickness.' },
      { type: 'sub', title: 'Use SpotHitch for your safety' },
      { type: 'rule', icon: '🛡️', text: 'Activate Guardian Mode before every trip. A trusted person follows your position in real time.' },
      { type: 'rule', icon: '🆘', text: 'Set up SOS mode with your contacts. One tap triggers a triple alert (push, SMS, call).' },
      { type: 'rule', icon: '📱', text: 'Take a photo of the licence plate and send it to someone before getting in.' },
      { type: 'rule', icon: '🎒', text: 'Keep your bag accessible (on your lap or at your feet), never in the boot.' },
      { type: 'sub', title: 'Country tips' },
      { type: 'rule', icon: '🏔️', text: 'Mountain roads are sometimes dangerous (bends, precipices). Take time to acclimatise to the altitude.' },
      { type: 'rule', icon: '💧', text: 'Drink plenty of water at altitude. Altitude sickness (soroche) affects everyone above 3,000 m.' },
      { type: 'sub', title: 'Emergency numbers' },
      { type: 'kv', items: [{ k: 'Emergency', v: '110' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Bolivia is relatively safe for women. Indigenous communities are respectful. Travelling as a duo is recommended in isolated areas.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Spanish is the main language. Quechua and Aymara are widely spoken in the Andes. English is rare.' },
      { type: 'phrase', items: [
        { local: '¿Me lleva?', meaning: 'Will you take me?' },
        { local: '¿Es gratis?', meaning: 'Is it free?' },
        { local: 'Jallalla!', meaning: 'Cheers! (Aymara, positive expression)' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Bolivia is the cheapest country in South America. Tight budget: 8-15 €/day. Full almuerzo: 1-2 €. Hostel: 3-8 €/night.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wild camping is possible everywhere in rural areas and the Altiplano. Nights are very cold at altitude (down to -15°C). A good sleeping bag is essential.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Bus / Flota', detail: 'Long-distance buses, often on dirt roads', price: '3-15 €' },
        { emoji: '🚐', name: 'Trufi / Micro', detail: 'Local minibus transport', price: '0.15-1 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mar', level: 'ok' },
        { name: 'Apr', level: 'good' }, { name: 'May', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Aug', level: 'great' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'ok' }, { name: 'Dec', level: 'bad' },
      ]},
      { type: 'text', text: 'May to September: dry season, ideal. December-March: intense rains, blocked roads, flooded Salar (but spectacular mirror effect).' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Bolivia has the highest proportion of indigenous population in South America (62%). Aymara and Quechua culture is alive. The coca leaf is sacred and omnipresent (chewing coca = normal, not a drug). Cholitas (women in traditional dress) are a national pride.' },
    ]},
  },
  // ==================== ECUADOR ====================
  EC: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Hitchhiking is legal in Ecuador. Common practice. The country is small (640 km north-south) and easy to cross. The currency is the US dollar.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Ecuador is easy for hitchhiking. The country is small and Ecuadorians are welcoming. Wait time: 15-30 min. Pickups ("camionetas") often take passengers (sometimes for a modest payment).' },
      { type: 'rule', icon: '🛻', text: 'Camionetas (pickups) stop easily. Riding in the back is normal and common.' },
      { type: 'rule', icon: '⛽', text: 'Toll booths and gas stations are the best spots.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Ecuador is safe for hitchhiking on main roads. Toll plazas are good spots. Watch out for altitude in the Andes.' },
      { type: 'sub', title: 'Use SpotHitch for your safety' },
      { type: 'rule', icon: '🛡️', text: 'Activate Guardian Mode before every trip. A trusted person follows your position in real time.' },
      { type: 'rule', icon: '🆘', text: 'Set up SOS mode with your contacts. One tap triggers a triple alert (push, SMS, call).' },
      { type: 'rule', icon: '📱', text: 'Take a photo of the licence plate and send it to someone before getting in.' },
      { type: 'rule', icon: '🎒', text: 'Keep your bag accessible (on your lap or at your feet), never in the boot.' },
      { type: 'sub', title: 'Country tips' },
      { type: 'rule', icon: '🛣️', text: 'Toll plazas are the best spots to approach drivers safely.' },
      { type: 'rule', icon: '🏔️', text: 'Watch out for altitude in the Andes (Quito: 2,850 m). Take time to acclimatise.' },
      { type: 'sub', title: 'Emergency numbers' },
      { type: 'kv', items: [{ k: 'Emergency', v: '911' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Ecuador is moderately safe for women. The Andes are safer than the coast. Travelling as a duo is recommended.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Spanish is the main language. Kichwa is spoken in the Andes. English is limited to tourist areas.' },
      { type: 'phrase', items: [
        { local: '¿Me da un jalon?', meaning: 'Will you give me a ride? (Ecuador)' },
        { local: '¡Chevere!', meaning: 'Awesome!' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Ecuador uses the US dollar. Tight budget: $15-25/day. Almuerzos (set menu) cost $2-3. Hostel: $8-15/night.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wild camping is possible in the Andes and the Amazon rainforest. Hospedajes (guesthouses) are very cheap.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Bus', detail: 'Extensive and cheap network. Buses stop everywhere.', price: '$1/hour of travel' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'ok' }, { name: 'Feb', level: 'ok' }, { name: 'Mar', level: 'ok' },
        { name: 'Apr', level: 'ok' }, { name: 'May', level: 'good' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Aug', level: 'great' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'good' }, { name: 'Dec', level: 'ok' },
      ]},
      { type: 'text', text: 'June-September: dry season in the Andes. The coast is dry from June to November. The Amazon is wet year-round.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Ecuador is incredibly diverse for a small country: coast, Andes, Amazon and Galapagos. Indigenous markets (Otavalo) are spectacular. Cuy (guinea pig) is a traditional dish in the Andes.' },
    ]},
  },
  // ==================== URUGUAY ====================
  UY: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Hitchhiking is legal in Uruguay. Accepted and culturally normal practice. The country is small (660 km east-west) and safe.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Uruguay is easy and safe for hitchhiking. The country is small and Uruguayans are laid-back and welcoming. Wait time: 15-30 min. Main roads (Ruta 1, Ruta 5) have good traffic.' },
      { type: 'text', text: 'Ancap stations and toll booths are the best spots. In summer (January-February), the coast (Punta del Diablo, Cabo Polonio) is very popular with Argentines and hitchhiking is easy.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Uruguay is a very safe country for hitchhiking. It is a small, welcoming country where Ancap petrol stations are excellent spots.' },
      { type: 'sub', title: 'Use SpotHitch for your safety' },
      { type: 'rule', icon: '🛡️', text: 'Activate Guardian Mode before every trip. A trusted person follows your position in real time.' },
      { type: 'rule', icon: '🆘', text: 'Set up SOS mode with your contacts. One tap triggers a triple alert (push, SMS, call).' },
      { type: 'rule', icon: '📱', text: 'Take a photo of the licence plate and send it to someone before getting in.' },
      { type: 'rule', icon: '🎒', text: 'Keep your bag accessible (on your lap or at your feet), never in the boot.' },
      { type: 'sub', title: 'Country tips' },
      { type: 'rule', icon: '⛽', text: 'Ancap petrol stations (national chain) are well spread out and ideal for finding a ride.' },
      { type: 'rule', icon: '🗺️', text: 'The country is small. You can cross it in a day. Every ride brings you quickly to your destination.' },
      { type: 'sub', title: 'Emergency numbers' },
      { type: 'kv', items: [{ k: 'Emergency', v: '911' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Uruguay is considered safe for women travelling alone. The country is progressive (first in Latin America to legalise cannabis and same-sex marriage).' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Rioplatense Spanish (like Argentina, with "vos" and "sh"). Portunol is spoken at the Brazilian border. English is limited.' },
      { type: 'phrase', items: [
        { local: '¿Me llevas?', meaning: 'Will you take me?' },
        { local: 'Ta, gracias', meaning: 'OK, thanks (Uruguayan expression)' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Uruguay is more expensive than Argentina. Tight budget: 20-35 €/day. Parilladas (grills) are hearty.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wild camping is tolerated on beaches and in rural areas. Cabo Polonio is a village without electricity accessible only by 4x4, ideal for camping.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Bus (CUTCSA, COT)', detail: 'Extensive and reliable network', price: '5-25 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'great' }, { name: 'Feb', level: 'great' }, { name: 'Mar', level: 'great' },
        { name: 'Apr', level: 'good' }, { name: 'May', level: 'ok' }, { name: 'Jun', level: 'bad' },
        { name: 'Jul', level: 'bad' }, { name: 'Aug', level: 'bad' }, { name: 'Sep', level: 'ok' },
        { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'great' }, { name: 'Dec', level: 'great' },
      ]},
      { type: 'text', text: 'November to March: ideal. Winter (June-August) is cool (5-15°C) but not harsh.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Mate is the national religion. Uruguayans walk around with their thermos and mate everywhere. Sunday asado is sacred. The country is laid-back and progressive. Tango (candombe) is as important as in Argentina.' },
    ]},
  },
  // ==================== VIETNAM ====================
  VN: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Hitchhiking is not a formal concept in Vietnam. There is no law against it but the practice does not exist culturally. Vietnamese who stop may not understand that it is free.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Vietnam is a special case. Classic hitchhiking (thumb up) does not work because the concept does not exist. But Vietnamese are naturally helpful and will offer help if you seem lost. Many travellers do Vietnam by motorbike (Easy Rider) rather than hitchhiking.' },
      { type: 'rule', icon: '🏍️', text: 'Motorbike taxis (xe om) stop constantly. Clarify that it is free if someone stops.' },
      { type: 'rule', icon: '🚛', text: 'Trucks on Highway 1 sometimes take passengers. Approach drivers at stops.' },
      { type: 'text', text: 'The mountainous north (Ha Giang, Sapa) is easier as there is less public transport and people stop naturally.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Vietnam is a safe country for hitchhiking. Traffic is chaotic in cities, but petrol stations are good spots for long journeys.' },
      { type: 'sub', title: 'Use SpotHitch for your safety' },
      { type: 'rule', icon: '🛡️', text: 'Activate Guardian Mode before every trip. A trusted person follows your position in real time.' },
      { type: 'rule', icon: '🆘', text: 'Set up SOS mode with your contacts. One tap triggers a triple alert (push, SMS, call).' },
      { type: 'rule', icon: '📱', text: 'Take a photo of the licence plate and send it to someone before getting in.' },
      { type: 'rule', icon: '🎒', text: 'Keep your bag accessible (on your lap or at your feet), never in the boot.' },
      { type: 'sub', title: 'Country tips' },
      { type: 'rule', icon: '⛽', text: 'Petrol stations are the best spots for long journeys. Truck drivers often stop there for breaks.' },
      { type: 'rule', icon: '🏍️', text: 'Traffic is chaotic in cities. For hitching, leave the city and position yourself on national roads.' },
      { type: 'sub', title: 'Emergency numbers' },
      { type: 'kv', items: [{ k: 'Police', v: '113' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Vietnam is safe for women travelling alone. Harassment is rare. Vietnamese women are independent and respected in society.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Vietnamese is the only language. 6 tones make pronunciation very difficult. English is growing among young people in big cities but remains very limited in rural areas. French is understood by some older people.' },
      { type: 'phrase', items: [
        { local: 'Xin chao', meaning: 'Hello' },
        { local: 'Cam on', meaning: 'Thank you' },
        { local: 'Di... duoc khong?', meaning: 'Go to... possible?' },
        { local: 'Mien phi', meaning: 'Free' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Vietnam is very cheap. Tight budget: 10-20 €/day even without hitchhiking. A street pho costs 1-2 €.' },
      { type: 'kv', items: [
        { k: 'Pho / Banh mi', v: '20,000-40,000 VND (0.80-1.60 €)' },
        { k: 'Hostel', v: '100,000-200,000 VND (4-8 €)' },
        { k: 'Sleeper bus (long distance)', v: '100,000-300,000 VND (4-12 €)' },
        { k: 'Bia hoi (fresh beer)', v: '5,000-10,000 VND (0.20-0.40 €)' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wild camping is possible in the northern mountains. Nha nghi (guesthouses) are so cheap (3-5 €) that camping is not necessary. Families in mountain villages sometimes host travellers.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Sleeper bus', detail: 'Long-distance sleeper buses, extensive network', price: '4-15 €' },
        { emoji: '🚂', name: 'Reunification Express', detail: 'Train Hanoi-HCMC (30h). Slow but scenic.', price: '15-40 €' },
        { emoji: '🏍️', name: 'Motorbike', detail: 'Many backpackers buy a motorbike ($300-500) and resell it at the end of the trip.', price: '' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'ok' }, { name: 'Feb', level: 'good' }, { name: 'Mar', level: 'great' },
        { name: 'Apr', level: 'great' }, { name: 'May', level: 'good' }, { name: 'Jun', level: 'ok' },
        { name: 'Jul', level: 'ok' }, { name: 'Aug', level: 'bad' }, { name: 'Sep', level: 'bad' },
        { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'great' }, { name: 'Dec', level: 'good' },
      ]},
      { type: 'text', text: 'Vietnam stretches 1,650 km: the north has seasons (cold in winter), the centre has typhoons (September-November), the south is tropical (dry December-April). March-May: good for the whole country.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Vietnamese are curious, smiling and welcoming. Coffee (ca phe sua da = iced coffee with condensed milk) is an institution. Street food is among the best in the world. Vietnamese love to invite foreigners to drink (mot, hai, ba, dzo! = 1, 2, 3, cheers!).' },
      { type: 'event', items: [
        { month: 'Jan-Feb', day: '⟳', name: 'Tet (Lunar New Year)', desc: 'The biggest celebration. The country shuts down for a week. Chaotic transport before/after.' },
      ]},
    ]},
  },
  // ==================== LAOS ====================
  LA: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Hitchhiking is not regulated in Laos. The concept is unknown but informal transport (getting on trucks, pickups) is common in rural areas.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Laos is a quiet country where informal hitchhiking works. Traffic is low (Laos is not very motorised) but drivers stop easily. Wait time: 20 min-1h+. In remote areas, traffic can be almost non-existent.' },
      { type: 'rule', icon: '🛻', text: 'Pickups and trucks are the most common vehicles on rural roads.' },
      { type: 'text', text: 'Sawngthaw (truck-buses with benches in the back) stop everywhere and cost almost nothing. It is very cheap "paid hitchhiking."' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Laos is a safe country for hitchhiking. Drivers stop readily, even without being flagged. Mountain roads are sometimes in poor condition.' },
      { type: 'sub', title: 'Use SpotHitch for your safety' },
      { type: 'rule', icon: '🛡️', text: 'Activate Guardian Mode before every trip. A trusted person follows your position in real time.' },
      { type: 'rule', icon: '🆘', text: 'Set up SOS mode with your contacts. One tap triggers a triple alert (push, SMS, call).' },
      { type: 'rule', icon: '📱', text: 'Take a photo of the licence plate and send it to someone before getting in.' },
      { type: 'rule', icon: '🎒', text: 'Keep your bag accessible (on your lap or at your feet), never in the boot.' },
      { type: 'sub', title: 'Country tips' },
      { type: 'rule', icon: '🏔️', text: 'Mountain roads are sometimes in poor condition. Allow for longer journey times than expected.' },
      { type: 'rule', icon: '🤝', text: 'Laotians are welcoming and drivers stop readily. A simple wave is enough.' },
      { type: 'sub', title: 'Emergency numbers' },
      { type: 'kv', items: [{ k: 'Police', v: '191' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Laos is safe for women travelling alone. Buddhist culture is respectful. Incidents are very rare.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Lao is the official language (very close to Thai, mutually intelligible). English is very limited. French is understood by some older people (former French colony).' },
      { type: 'phrase', items: [
        { local: 'Sabaidee', meaning: 'Hello' },
        { local: 'Khop chai', meaning: 'Thank you' },
        { local: 'Pai... dai bor?', meaning: 'Go to... possible?' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Laos is very cheap. Tight budget: 10-20 €/day. Sticky rice with laap (meat salad) costs less than 1 €.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wild camping is possible but watch out for UXO. Guesthouses are very cheap (3-8 €). Temples sometimes host travellers.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚐', name: 'Sawngthaw', detail: 'Trucks with benches. Main rural transport.', price: '1-5 €' },
        { emoji: '🚌', name: 'VIP bus', detail: 'Long distance, developing network', price: '5-15 €' },
        { emoji: '🛥️', name: 'Slow Boat', detail: 'Boat on the Mekong (Luang Prabang-Huay Xai, 2 days)', price: '15-25 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'great' }, { name: 'Feb', level: 'great' }, { name: 'Mar', level: 'good' },
        { name: 'Apr', level: 'ok' }, { name: 'May', level: 'ok' }, { name: 'Jun', level: 'ok' },
        { name: 'Jul', level: 'bad' }, { name: 'Aug', level: 'bad' }, { name: 'Sep', level: 'bad' },
        { name: 'Oct', level: 'ok' }, { name: 'Nov', level: 'great' }, { name: 'Dec', level: 'great' },
      ]},
      { type: 'text', text: 'November to February: ideal (cool and dry). March-May: very hot. June-October: monsoon (flooded roads, some roads blocked).' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Laos is the most relaxed country in Southeast Asia. "Bor pen nyang" (no problem) is the national mantra. Theravada Buddhism permeates the culture. The morning alms offering (tak bat) in Luang Prabang is a sacred moment.' },
    ]},
  },
  // ==================== CAMBODIA ====================
  KH: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Hitchhiking is not regulated in Cambodia. The concept does not formally exist but informal transport is common. Drivers stop easily if you wave.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Cambodia works on informal hitchhiking. Pickups, trucks and motorbikes stop easily. Many drivers expect a small payment (informal transport). Clarify. The bus network is limited in rural areas.' },
      { type: 'text', text: 'Main roads (Phnom Penh-Siem Reap, Phnom Penh-Sihanoukville) have traffic. Secondary roads are often in poor condition.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Cambodia is a safe country for hitchhiking. Main roads are in good condition and drivers stop readily for travellers.' },
      { type: 'sub', title: 'Use SpotHitch for your safety' },
      { type: 'rule', icon: '🛡️', text: 'Activate Guardian Mode before every trip. A trusted person follows your position in real time.' },
      { type: 'rule', icon: '🆘', text: 'Set up SOS mode with your contacts. One tap triggers a triple alert (push, SMS, call).' },
      { type: 'rule', icon: '📱', text: 'Take a photo of the licence plate and send it to someone before getting in.' },
      { type: 'rule', icon: '🎒', text: 'Keep your bag accessible (on your lap or at your feet), never in the boot.' },
      { type: 'sub', title: 'Country tips' },
      { type: 'rule', icon: '🛣️', text: 'Main roads (Phnom Penh to Siem Reap, Phnom Penh to Sihanoukville) are in good condition and well travelled.' },
      { type: 'rule', icon: '😊', text: 'Cambodians are welcoming. A smile is universal, even without speaking the language.' },
      { type: 'sub', title: 'Emergency numbers' },
      { type: 'kv', items: [{ k: 'Police', v: '117' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Cambodia is generally safe for women travelling alone. Society is respectful. Avoid party areas (Sihanoukville) at night.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Khmer is the official language. English is widespread in tourist areas (Siem Reap, Phnom Penh). French is understood by some older people.' },
      { type: 'phrase', items: [
        { local: 'Sok sabay', meaning: 'Hello / How are you' },
        { local: 'Aw kun', meaning: 'Thank you' },
        { local: 'Tov... baan te?', meaning: 'Go to... possible?' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Cambodia is very cheap. Tight budget: $10-20/day. The US dollar is the de facto currency (the riel is used for small change).' },
      { type: 'kv', items: [
        { k: 'Local meal', v: '$1-3' },
        { k: 'Hostel', v: '$3-8/night' },
        { k: 'Angkor beer', v: '$0.50 (happy hour)' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Guesthouses are so cheap ($3-5) that camping is not necessary. Wild camping is possible in rural areas.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Bus', detail: 'Developing network. Giant Ibis and Mekong Express are reliable.', price: '$5-15' },
        { emoji: '🛥️', name: 'Boat', detail: 'Phnom Penh-Siem Reap via Tonle Sap', price: '$25-35' },
        { emoji: '🛺', name: 'Tuk-tuk', detail: 'Ubiquitous local transport', price: '$1-5' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'great' }, { name: 'Feb', level: 'great' }, { name: 'Mar', level: 'good' },
        { name: 'Apr', level: 'ok' }, { name: 'May', level: 'ok' }, { name: 'Jun', level: 'ok' },
        { name: 'Jul', level: 'ok' }, { name: 'Aug', level: 'bad' }, { name: 'Sep', level: 'bad' },
        { name: 'Oct', level: 'ok' }, { name: 'Nov', level: 'great' }, { name: 'Dec', level: 'great' },
      ]},
      { type: 'text', text: 'November to February: ideal (cool and dry). March-May: very hot (38°C+). June-October: monsoon (flooded roads in rural areas).' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Cambodians are smiling and resilient despite the tragic history (Khmer Rouge). Angkor Wat is a national pride. Drivers are curious and welcoming. Never talk about politics or the Khmer Rouge lightly.' },
    ]},
  },
  // ==================== NEPAL ====================
  NP: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Hitchhiking is not regulated in Nepal. Informal transport (riding on bus roofs, in trucks) is a normal way of life in mountain areas.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Nepal is easy for informal hitchhiking. Trucks and pickups stop easily. In the mountains, traffic is low but everyone stops. Nepalese are extremely welcoming.' },
      { type: 'rule', icon: '🚛', text: 'Tata trucks on mountain roads take passengers (often for a small payment). Clarify before.' },
      { type: 'rule', icon: '🏔️', text: 'In trekking regions (Annapurna, Everest), transport is by jeep or on foot. No traditional hitchhiking.' },
      { type: 'text', text: 'The Kathmandu Valley and Terai roads (southern plain) have more traffic. The Kathmandu-Pokhara road is the busiest.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Nepal is a safe country for hitchhiking. Nepalis are welcoming. The main risk comes from mountain roads.' },
      { type: 'sub', title: 'Use SpotHitch for your safety' },
      { type: 'rule', icon: '🛡️', text: 'Activate Guardian Mode before every trip. A trusted person follows your position in real time.' },
      { type: 'rule', icon: '🆘', text: 'Set up SOS mode with your contacts. One tap triggers a triple alert (push, SMS, call).' },
      { type: 'rule', icon: '📱', text: 'Take a photo of the licence plate and send it to someone before getting in.' },
      { type: 'rule', icon: '🎒', text: 'Keep your bag accessible (on your lap or at your feet), never in the boot.' },
      { type: 'sub', title: 'Country tips' },
      { type: 'rule', icon: '🏔️', text: 'Mountain roads are the main risk (precipices, no guardrails). Buckle up.' },
      { type: 'rule', icon: '🙏', text: 'Nepalis are welcoming. A "namaste" (hands together) opens all doors.' },
      { type: 'sub', title: 'Emergency numbers' },
      { type: 'kv', items: [{ k: 'Emergency', v: '100' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Nepal is considered safe for women travelling alone. Nepalese are respectful. Some cases of harassment in rural areas but overall positive.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Nepali is the official language. English is fairly widespread in tourist areas (Kathmandu, Pokhara, trekking regions). Trekking guides speak English.' },
      { type: 'phrase', items: [
        { local: 'Namaste', meaning: 'Hello (hands together in front of the chest)' },
        { local: 'Dhanyabad', meaning: 'Thank you' },
        { local: 'Kati paisa?', meaning: 'How much does it cost?' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Nepal is very cheap. Tight budget: 10-20 €/day. Dhal bhat (rice and lentils) is the national dish: 1-2 €, unlimited refills in many restaurants.' },
      { type: 'kv', items: [
        { k: 'Dhal bhat', v: '200-500 NPR (1-3 €)' },
        { k: 'Guesthouse', v: '300-1,000 NPR (2-7 €)' },
        { k: 'Local bus', v: '100-500 NPR (0.70-3 €)' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wild camping is possible in mountain areas. Tea houses on trekking circuits offer cheap accommodation and meals. City guesthouses are very affordable.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Local bus / Tourist bus', detail: 'Local buses are crowded but cheap. Tourist buses are more comfortable.', price: '2-15 €' },
        { emoji: '🛩️', name: 'Domestic flight', detail: 'Necessary for Lukla (Everest). Spectacular views.', price: '100-200 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'ok' }, { name: 'Feb', level: 'good' }, { name: 'Mar', level: 'great' },
        { name: 'Apr', level: 'great' }, { name: 'May', level: 'good' }, { name: 'Jun', level: 'bad' },
        { name: 'Jul', level: 'bad' }, { name: 'Aug', level: 'bad' }, { name: 'Sep', level: 'ok' },
        { name: 'Oct', level: 'great' }, { name: 'Nov', level: 'great' }, { name: 'Dec', level: 'good' },
      ]},
      { type: 'text', text: 'October-November: ideal (clear skies, Himalayan views). March-May: good too (rhododendrons in bloom). June-September: monsoon (blocked roads, leeches in the mountains).' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Nepal is a unique blend of Hinduism and Buddhism. Nepalese are among the most smiling people in the world. Dhal bhat is "the fuel": twice a day, unlimited refills. Trekking is a national industry and guides are remarkably kind.' },
      { type: 'event', items: [
        { month: 'Oct', day: '⟳', name: 'Dashain', desc: 'The biggest Nepalese festival (15 days). Kites, family reunions. Very busy transport.' },
      ]},
    ]},
  },
  // ==================== KAZAKHSTAN ====================
  KZ: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Hitchhiking is legal in Kazakhstan. No restrictions. Informal transport is common as the country is immense (9th largest in the world) and public transport is limited between cities.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Kazakhstan is good for hitchhiking. Distances are immense (Almaty-Astana: 1,200 km) but drivers cover long distances. Wait time: 15-45 min on main roads. In rural areas, traffic is very low.' },
      { type: 'rule', icon: '🚛', text: 'Trucks are best for long distances. Approach drivers at gas stations.' },
      { type: 'rule', icon: '💰', text: 'Many drivers expect payment (informal transport is common). Clarify "besplatno" (free) before getting in.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Kazakhstan is a safe country for hitchhiking. Distances are immense and petrol stations are rare in rural areas. Bring supplies.' },
      { type: 'sub', title: 'Use SpotHitch for your safety' },
      { type: 'rule', icon: '🛡️', text: 'Activate Guardian Mode before every trip. A trusted person follows your position in real time.' },
      { type: 'rule', icon: '🆘', text: 'Set up SOS mode with your contacts. One tap triggers a triple alert (push, SMS, call).' },
      { type: 'rule', icon: '📱', text: 'Take a photo of the licence plate and send it to someone before getting in.' },
      { type: 'rule', icon: '🎒', text: 'Keep your bag accessible (on your lap or at your feet), never in the boot.' },
      { type: 'sub', title: 'Country tips' },
      { type: 'rule', icon: '🗺️', text: 'Distances are immense and petrol stations are rare in rural areas. Bring water, food and a charger.' },
      { type: 'rule', icon: '📋', text: 'Always carry your passport. Police checks are frequent but benevolent.' },
      { type: 'sub', title: 'Emergency numbers' },
      { type: 'kv', items: [{ k: 'Emergency', v: '112' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Kazakhstan is relatively safe for women. Society is more secular than Central Asian neighbours. Travelling as a duo is recommended in isolated rural areas.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Kazakh and Russian are the two official languages. Russian is spoken by almost everyone. English is very rare. Russian is essential.' },
      { type: 'phrase', items: [
        { local: 'Salam', meaning: 'Hello (Kazakh)' },
        { local: 'Rakhmet / Spasibo', meaning: 'Thank you (Kazakh / Russian)' },
        { local: 'Besplatno', meaning: 'Free (Russian)' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Kazakhstan is moderately expensive for Central Asia. Tight budget: 15-25 €/day. Bazaars are cheap for food.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wild camping is easy in the endless steppes (nobody to bother you). Nomad yurts are sometimes open to travellers. In cities, hostels are cheap.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚂', name: 'Train', detail: 'Extensive Soviet-era network, night trains', price: '10-30 €' },
        { emoji: '🚌', name: 'Bus', detail: 'Between major cities', price: '5-20 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mar', level: 'ok' },
        { name: 'Apr', level: 'good' }, { name: 'May', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'good' }, { name: 'Aug', level: 'good' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'ok' }, { name: 'Dec', level: 'bad' },
      ]},
      { type: 'text', text: 'May-June and September: ideal. Summer is hot in the steppes (40°C+). Winter is extreme (down to -40°C in Astana). Spring sees the steppes bloom.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Kazakhstan blends nomadic culture and modernity. Kumiss (fermented mare\'s milk) and beshbarmak (meat with noodles) are traditional dishes. Nomadic hospitality (offering tea, a meal, a bed) is deeply rooted.' },
    ]},
  },
  // ==================== KYRGYZSTAN ====================
  KG: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Hitchhiking is legal in Kyrgyzstan. Very common practice. The country is mountainous and public transport is limited. Informal transport is a way of life.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Kyrgyzstan is one of the best Central Asian countries for hitchhiking. Kyrgyz are welcoming and curious. Wait time: 10-30 min on main roads. In the mountains, traffic is low but everyone stops.' },
      { type: 'text', text: 'The Bishkek-Osh road (via Teo-Ashuu pass at 3,500m) is a classic. The tour of Lake Issyk-Kul is easy in summer.' },
      { type: 'rule', icon: '💰', text: 'Marshrutkas (shared taxis) stop everywhere. Clarify "besplatno" as some private drivers expect payment.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Kyrgyzstan is a safe country for hitchhiking. Mountain roads are dangerous but spectacular. Drivers stop readily.' },
      { type: 'sub', title: 'Use SpotHitch for your safety' },
      { type: 'rule', icon: '🛡️', text: 'Activate Guardian Mode before every trip. A trusted person follows your position in real time.' },
      { type: 'rule', icon: '🆘', text: 'Set up SOS mode with your contacts. One tap triggers a triple alert (push, SMS, call).' },
      { type: 'rule', icon: '📱', text: 'Take a photo of the licence plate and send it to someone before getting in.' },
      { type: 'rule', icon: '🎒', text: 'Keep your bag accessible (on your lap or at your feet), never in the boot.' },
      { type: 'sub', title: 'Country tips' },
      { type: 'rule', icon: '🏔️', text: 'Mountain roads are dangerous (passes above 3,000 m, no guardrails). Buckle up.' },
      { type: 'rule', icon: '🌄', text: 'The scenery is spectacular. Enjoy the ride and share moments with Kyrgyz drivers.' },
      { type: 'sub', title: 'Emergency numbers' },
      { type: 'kv', items: [{ k: 'Emergency', v: '103' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Kyrgyzstan is moderately safe for women alone. Tourist areas and cities are welcoming. In rural areas, travel with a companion if possible.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Kyrgyz and Russian are the official languages. Russian is understood everywhere. English is very limited. Basic Russian is essential.' },
      { type: 'phrase', items: [
        { local: 'Salam', meaning: 'Hello (Kyrgyz)' },
        { local: 'Rakhmat', meaning: 'Thank you (Kyrgyz)' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Kyrgyzstan is very cheap. Tight budget: 10-20 €/day. Yurt accommodation via CBT (Community Based Tourism): 10-15 €/night with meals.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wild camping is legal and easy in the mountains and jailoos (high-altitude pastures). Shepherd yurts often welcome travellers. The CBT network organises authentic yurt stays.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚐', name: 'Marshrutka', detail: 'Minibus between cities, cheap', price: '1-5 €' },
        { emoji: '🚗', name: 'Shared taxi', detail: 'Faster than the bus, waits to be full', price: '3-10 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mar', level: 'ok' },
        { name: 'Apr', level: 'good' }, { name: 'May', level: 'good' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Aug', level: 'great' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'ok' }, { name: 'Dec', level: 'bad' },
      ]},
      { type: 'text', text: 'June to September: ideal. Mountain passes are open. Summer at Lake Issyk-Kul is beautiful. Winter closes the passes and hitchhiking becomes difficult.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Kyrgyz nomadic culture is alive. Kumiss (mare\'s milk) and beshbarmak are culinary traditions. Hospitality is sacred: refusing tea is rude. Equestrian games (kok-boru, eagle hunting) are spectacular.' },
    ]},
  },
  // ==================== UZBEKISTAN ====================
  UZ: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Hitchhiking is legal in Uzbekistan. Informal transport is very common. Many private cars function as informal taxis (especially Daewoo Matiz and Chevrolet Lacetti).' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Uzbekistan works on semi-paid hitchhiking. Raising your hand by the road stops private cars acting as taxis. Clarify "besplatno" (free) BEFORE getting in. Wait time: 5-15 min in cities, 15-30 min between cities.' },
      { type: 'text', text: 'The Silk Road route (Tashkent-Samarkand-Bukhara-Khiva) is well served. Shared taxis are so cheap that they make free hitchhiking less necessary.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Uzbekistan is a safe country for hitchhiking. Police checkpoints are frequent but no problem if you have your documents.' },
      { type: 'sub', title: 'Use SpotHitch for your safety' },
      { type: 'rule', icon: '🛡️', text: 'Activate Guardian Mode before every trip. A trusted person follows your position in real time.' },
      { type: 'rule', icon: '🆘', text: 'Set up SOS mode with your contacts. One tap triggers a triple alert (push, SMS, call).' },
      { type: 'rule', icon: '📱', text: 'Take a photo of the licence plate and send it to someone before getting in.' },
      { type: 'rule', icon: '🎒', text: 'Keep your bag accessible (on your lap or at your feet), never in the boot.' },
      { type: 'sub', title: 'Country tips' },
      { type: 'rule', icon: '📋', text: 'Police checkpoints are frequent. Always carry your passport and registration.' },
      { type: 'rule', icon: '🕌', text: 'Uzbeks are hospitable. You will often be invited for plov (national dish) or tea.' },
      { type: 'sub', title: 'Emergency numbers' },
      { type: 'kv', items: [{ k: 'Emergency', v: '101' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Uzbekistan is safe for women travelling alone. Society is conservative but respectful. Female travellers report positive experiences.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Uzbek is the official language. Russian is very widespread (especially in Tashkent). English is limited to tourist areas (Samarkand, Bukhara).' },
      { type: 'phrase', items: [
        { local: 'Assalomu alaykum', meaning: 'Hello (formal)' },
        { local: 'Rahmat', meaning: 'Thank you' },
        { local: 'Bepul', meaning: 'Free' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Uzbekistan is very cheap. Tight budget: 10-20 €/day. Plov (pilaf rice) is the national dish: 1-2 € in a chaikhana (tea house).' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Hostels and B&Bs are cheap (5-15 €). Chaikhanas (tea houses) sometimes allow sleeping on tapchans (outdoor daybeds). Wild camping is possible in rural areas.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚂', name: 'Afrosiyob (high-speed)', detail: 'Fast train Tashkent-Samarkand-Bukhara', price: '5-15 €' },
        { emoji: '🚗', name: 'Shared taxi', detail: 'Private cars between cities, waits to be full', price: '2-10 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Feb', level: 'ok' }, { name: 'Mar', level: 'good' },
        { name: 'Apr', level: 'great' }, { name: 'May', level: 'great' }, { name: 'Jun', level: 'ok' },
        { name: 'Jul', level: 'bad' }, { name: 'Aug', level: 'bad' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'great' }, { name: 'Nov', level: 'good' }, { name: 'Dec', level: 'ok' },
      ]},
      { type: 'text', text: 'April-May and September-October: ideal (20-28°C). Summer is scorching (45°C+). Winter is cold in the mountains.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Uzbekistan is the heart of the Silk Road. Samarkand, Bukhara and Khiva are architectural wonders. Hospitality is sacred. Thursday plov is a social event. Weddings (often 300+ guests) are occasions to celebrate and foreigners are sometimes spontaneously invited.' },
    ]},
  },
  // ==================== JORDAN ====================
  JO: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Hitchhiking is legal in Jordan. Common practice. Jordanians are among the most hospitable people in the Middle East. The country is small (450 km north-south) and safe.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Jordan is excellent for hitchhiking. Jordanians stop very easily and are curious about foreigners. Wait time: 5-15 min. Many drivers refuse money and insist on treating you to a meal.' },
      { type: 'kv', items: [
        { k: 'King\'s Highway', v: 'Beautiful, good traffic', color: 'green' },
        { k: 'Amman-Aqaba', v: 'Dense traffic, easy', color: 'green' },
        { k: 'Wadi Rum-Aqaba', v: 'Little traffic but everyone stops', color: 'amber' },
      ]},
      { type: 'tip', text: '💡 Jordanians often give their phone number and insist on helping you throughout your stay.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Jordan is a safe and hospitable country for hitchhiking. Jordanians are welcoming and the country is stable.' },
      { type: 'sub', title: 'Use SpotHitch for your safety' },
      { type: 'rule', icon: '🛡️', text: 'Activate Guardian Mode before every trip. A trusted person follows your position in real time.' },
      { type: 'rule', icon: '🆘', text: 'Set up SOS mode with your contacts. One tap triggers a triple alert (push, SMS, call).' },
      { type: 'rule', icon: '📱', text: 'Take a photo of the licence plate and send it to someone before getting in.' },
      { type: 'rule', icon: '🎒', text: 'Keep your bag accessible (on your lap or at your feet), never in the boot.' },
      { type: 'sub', title: 'Country tips' },
      { type: 'rule', icon: '🤝', text: 'Jordanians are very hospitable. You will often be offered tea or a meal.' },
      { type: 'rule', icon: '🏜️', text: 'The country is compact and roads are in good condition. Wadi Rum and Petra are easily accessible.' },
      { type: 'sub', title: 'Emergency numbers' },
      { type: 'kv', items: [{ k: 'Emergency', v: '911' }] },
    ]},
    women: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'Jordan is relatively safe for women. Jordanian hospitality applies to everyone. Dress conservatively (especially outside Amman). Some staring but incidents are rare.' },
      { type: 'rule', icon: '👕', text: 'Clothing covering shoulders and knees, especially in rural areas.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Jordanian Arabic is the main language. English is very widespread, especially in Amman and tourist areas. Many Jordanians speak fluent English.' },
      { type: 'phrase', items: [
        { local: 'Marhaba / Ahlan', meaning: 'Hello / Welcome' },
        { local: 'Shukran', meaning: 'Thank you' },
        { local: 'Inshallah', meaning: 'God willing (used constantly)' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Jordan is moderately expensive. Tight budget: 20-35 €/day. The Jordan Pass (70+ JOD) includes Petra and the visa.' },
      { type: 'kv', items: [
        { k: 'Falafel / shawarma', v: '0.50-1.50 JOD (0.70-2 €)' },
        { k: 'Hostel', v: '8-20 JOD (10-25 €)' },
        { k: 'Petra (entrance)', v: '50 JOD (70 €) or included in Jordan Pass' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wild camping is possible in Wadi Rum (unforgettable experience under the stars) and in rural areas. Bedouins often invite travellers into their tent for tea and sometimes the night.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'JETT Bus', detail: 'Reliable long-distance buses', price: '3-10 JOD' },
        { emoji: '🚐', name: 'Minibus', detail: 'Local transport between cities, wait to be full', price: '0.50-3 JOD' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'ok' }, { name: 'Feb', level: 'good' }, { name: 'Mar', level: 'great' },
        { name: 'Apr', level: 'great' }, { name: 'May', level: 'great' }, { name: 'Jun', level: 'ok' },
        { name: 'Jul', level: 'bad' }, { name: 'Aug', level: 'bad' }, { name: 'Sep', level: 'ok' },
        { name: 'Oct', level: 'great' }, { name: 'Nov', level: 'great' }, { name: 'Dec', level: 'ok' },
      ]},
      { type: 'text', text: 'March-May and October-November: ideal (20-28°C). Summer is scorching (35-45°C, especially Aqaba and Wadi Rum). Winter is cool and rainy in Amman.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Jordanian hospitality is exceptional. "Ahlan wa sahlan" (welcome) is sincere. Bedouins in Wadi Rum offer tea (chai), mansaf (national dish with yoghurt) and stories. Refusing an invitation is impolite. Petra is a wonder of the world.' },
    ]},
  },
  // ==================== OMAN ====================
  OM: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Hitchhiking is legal in Oman. The concept is not formalised but raising your hand by the road works very well. Omanis are naturally helpful.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Oman is excellent for hitchhiking. Omanis are extremely welcoming and stop very easily. Wait time: 5-15 min on main roads. In rural areas (wadis, mountains), traffic is low but everyone stops.' },
      { type: 'text', text: 'Drivers make significant detours to help you, offer meals and sometimes accommodation. Hitchhiking is almost too easy: cars stop before you even raise your thumb.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Oman is one of the safest countries in the world. Crime rate is virtually zero. The Sultan is revered and the country is very orderly.' },
      { type: 'kv', items: [{ k: 'Emergencies', v: '9999' }, { k: 'Police', v: '9999' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Oman is safe for women travelling alone. Society is conservative but respectful. Dress modestly (covered shoulders and knees). Omanis are courteous and harassment is rare.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Omani Arabic is the main language. English is widely spoken, especially in Muscat and tourist areas. No major language barrier.' },
      { type: 'phrase', items: [
        { local: 'As-salaam alaikum', meaning: 'Peace be upon you (universal greeting)' },
        { local: 'Shukran jazeelan', meaning: 'Thank you very much' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Oman is moderately expensive. Tight budget: 25-40 €/day. Petrol is very cheap. Traditional Omani restaurants are affordable.' },
      { type: 'kv', items: [
        { k: 'Local meal', v: '1-3 OMR (2.50-7.50 €)' },
        { k: 'Hostel', v: '5-15 OMR (12-37 €)' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wild camping is legal and popular in Oman. Wadis (valleys) and beaches are beautiful spots. Many Omanis camp themselves on weekends. The starry sky in the desert is spectacular.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Mwasalat (bus)', detail: 'Expanding bus network, main public transport', price: '0.50-5 OMR' },
        { emoji: '🚗', name: 'Car rental', detail: 'Often the best option for exploring wadis and mountains', price: '10-20 OMR/day' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'great' }, { name: 'Feb', level: 'great' }, { name: 'Mar', level: 'great' },
        { name: 'Apr', level: 'good' }, { name: 'May', level: 'ok' }, { name: 'Jun', level: 'bad' },
        { name: 'Jul', level: 'bad' }, { name: 'Aug', level: 'bad' }, { name: 'Sep', level: 'ok' },
        { name: 'Oct', level: 'great' }, { name: 'Nov', level: 'great' }, { name: 'Dec', level: 'great' },
      ]},
      { type: 'text', text: 'October to March: ideal (25-30°C). Summer is scorching (45°C+) and hitchhiking is not recommended. Dhofar (Salalah) has a unique monsoon season (khareef) in summer: green and cool.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Oman is a refined and welcoming country. Omani coffee (qahwa) and dates are offered at every meeting. The country is proud of its tolerance (mosques, churches and temples coexist). Frankincense is a traditional gift. Omanis in white dishdasha and kumma are elegant and courteous.' },
    ]},
  },
  // ==================== SENEGAL ====================
  SN: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Hitchhiking is legal in Senegal. The concept of "teranga" (hospitality) means drivers stop naturally. Informal transport is the main mode in rural areas.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Senegal is good for hitchhiking thanks to teranga (legendary hospitality). Drivers stop easily. Much transport is informal: "sept-places" (shared taxis) and ndiaga ndiayes (minibuses) stop everywhere.' },
      { type: 'rule', icon: '🚛', text: 'Trucks take passengers on long distances (Dakar-Saint-Louis, Dakar-Ziguinchor).' },
      { type: 'rule', icon: '💰', text: 'Many drivers expect payment. Clarify before getting in. The line between free hitchhiking and paid transport is blurry.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Senegal is a safe country for hitchhiking. Senegalese are hospitable and love chatting with travellers. Bring a hat and water.' },
      { type: 'sub', title: 'Use SpotHitch for your safety' },
      { type: 'rule', icon: '🛡️', text: 'Activate Guardian Mode before every trip. A trusted person follows your position in real time.' },
      { type: 'rule', icon: '🆘', text: 'Set up SOS mode with your contacts. One tap triggers a triple alert (push, SMS, call).' },
      { type: 'rule', icon: '📱', text: 'Take a photo of the licence plate and send it to someone before getting in.' },
      { type: 'rule', icon: '🎒', text: 'Keep your bag accessible (on your lap or at your feet), never in the boot.' },
      { type: 'sub', title: 'Country tips' },
      { type: 'rule', icon: '🤝', text: 'Senegalese are known for their teranga (hospitality). They love sharing an ataya (tea) with travellers.' },
      { type: 'rule', icon: '☀️', text: 'Protect yourself from the sun: hat, sunscreen and water at all times. The heat is intense.' },
      { type: 'sub', title: 'Emergency numbers' },
      { type: 'kv', items: [{ k: 'Police', v: '17' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Senegal is relatively safe for women but street harassment exists, especially in Dakar. Teranga protects female travellers. Dress modestly in rural areas.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'French is the official language and almost everyone speaks it. Wolof is the most widespread local language. French speakers have no language barrier.' },
      { type: 'phrase', items: [
        { local: 'Nanga def?', meaning: 'How are you? (Wolof)' },
        { local: 'Jerejef', meaning: 'Thank you (Wolof)' },
        { local: 'Inshallah', meaning: 'God willing' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Senegal is moderately expensive for West Africa. Tight budget: 15-25 €/day. Thieboudienne (rice with fish) is the national dish.' },
      { type: 'kv', items: [
        { k: 'Local meal', v: '500-1,500 CFA (0.75-2.30 €)' },
        { k: 'Guesthouse', v: '5,000-15,000 CFA (7-23 €)' },
        { k: 'Sept-place (100 km)', v: '2,000-4,000 CFA (3-6 €)' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wild camping is possible on beaches and in the bush. Campements (rural guesthouses) are cheap and convivial. Senegalese easily invite travellers into their homes.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚐', name: 'Sept-place / Ndiaga Ndiaye', detail: 'Shared taxis and minibuses, extensive network', price: '1-6 €' },
        { emoji: '🚂', name: 'TER Dakar', detail: 'Recent express train Dakar-AIBD', price: '1-3 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'great' }, { name: 'Feb', level: 'great' }, { name: 'Mar', level: 'great' },
        { name: 'Apr', level: 'good' }, { name: 'May', level: 'ok' }, { name: 'Jun', level: 'ok' },
        { name: 'Jul', level: 'bad' }, { name: 'Aug', level: 'bad' }, { name: 'Sep', level: 'bad' },
        { name: 'Oct', level: 'ok' }, { name: 'Nov', level: 'great' }, { name: 'Dec', level: 'great' },
      ]},
      { type: 'text', text: 'November to May: dry season, ideal. July-October: rainy season (hivernage), flooded roads in rural areas.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Teranga (hospitality) is the soul of Senegal. Mint tea (ataya) served in three rounds is an essential social ritual. Thieboudienne is a communal dish shared from a large bowl. Music (mbalax, Youssou N\'Dour) punctuates daily life.' },
    ]},
  },
  // ==================== NAMIBIA ====================
  NA: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Hitchhiking is legal in Namibia. Common practice as the country is immense and public transport is virtually non-existent outside main routes.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Namibia is doable by hitchhiking but distances are immense and traffic very low. The country is the 2nd least densely populated in the world (3 people/km²). Wait time: 30 min-3h, sometimes more on secondary roads.' },
      { type: 'kv', items: [
        { k: 'B1/B2 (main axes)', v: 'Moderate traffic, doable', color: 'green' },
        { k: 'Roads to Sossusvlei', v: 'Little traffic, long waits possible', color: 'amber' },
        { k: 'Northeast (Caprivi Strip)', v: 'Doable but isolated', color: 'amber' },
      ]},
      { type: 'rule', icon: '💧', text: 'ALWAYS carry at least 5 litres of water. Dehydration in the desert is the #1 danger.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Namibia is a safe country for hitchhiking. Distances are immense and traffic is sparse, so bring water and a solar charger.' },
      { type: 'sub', title: 'Use SpotHitch for your safety' },
      { type: 'rule', icon: '🛡️', text: 'Activate Guardian Mode before every trip. A trusted person follows your position in real time.' },
      { type: 'rule', icon: '🆘', text: 'Set up SOS mode with your contacts. One tap triggers a triple alert (push, SMS, call).' },
      { type: 'rule', icon: '📱', text: 'Take a photo of the licence plate and send it to someone before getting in.' },
      { type: 'rule', icon: '🎒', text: 'Keep your bag accessible (on your lap or at your feet), never in the boot.' },
      { type: 'sub', title: 'Country tips' },
      { type: 'rule', icon: '💧', text: 'Distances are immense (500+ km between cities). Always carry water and a solar charger.' },
      { type: 'rule', icon: '🏜️', text: 'Traffic is sparse in rural areas. Expect long waits and be patient.' },
      { type: 'sub', title: 'Emergency numbers' },
      { type: 'kv', items: [{ k: 'Emergency', v: '10111' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Namibia is relatively safe for women. Tourist areas are safe. Travelling as a duo is recommended for isolated areas (Skeleton Coast, Kaokoveld).' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'English is the official language and widely spoken. Afrikaans is common among white and coloured populations. Oshiwambo is the most spoken Bantu language.' },
      { type: 'phrase', items: [
        { local: 'Moro', meaning: 'Hello (Oshiwambo)' },
        { local: 'Tangi unene', meaning: 'Thank you very much (Oshiwambo)' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Namibia is moderately expensive. Tight budget: 20-35 €/day. National park entrance fees (Etosha, Sossusvlei) are affordable.' },
      { type: 'kv', items: [
        { k: 'Camping (national park)', v: '150-300 NAD (8-16 €)' },
        { k: 'Local meal', v: '50-150 NAD (3-8 €)' },
        { k: 'Backpacker hostel', v: '150-350 NAD (8-19 €)' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wild camping is tolerated in the desert and rural areas (ask permission from farms). Campsites in national parks (NWR) are well equipped. The Namibian starry sky is among the purest in the world.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Intercape', detail: 'Long-distance bus, limited network', price: '200-600 NAD' },
        { emoji: '🚐', name: 'Minibus / Combis', detail: 'Local transport between cities', price: '50-200 NAD' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'ok' }, { name: 'Feb', level: 'ok' }, { name: 'Mar', level: 'good' },
        { name: 'Apr', level: 'great' }, { name: 'May', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Aug', level: 'great' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'ok' }, { name: 'Dec', level: 'ok' },
      ]},
      { type: 'text', text: 'May to October: dry season, ideal (warm days, cool nights). The rainy season (November-April) makes some tracks impassable. Etosha is best in dry season (animals at waterholes).' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Namibia is a country of contrasts: Namib dunes, Skeleton Coast, Etosha. Culture is diverse (Himba, San, Herero, Ovambo). Braai (barbecue) is as important as in South Africa. Game jerky (biltong) is the road snack.' },
    ]},
  },
  // ==================== KENYA ====================
  KE: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Hitchhiking is not formally regulated in Kenya. Informal transport (matatus) is the main mode. Raising your hand by the road stops any vehicle.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Kenya operates on semi-informal transport. Matatus (minibuses) are everywhere and very cheap. For free hitchhiking, trucks on the Nairobi-Mombasa or Nairobi-Naivasha road take passengers. Clarify "free" or "bure" before getting in.' },
      { type: 'rule', icon: '💰', text: 'The line between free hitchhiking and paid transport is blurry. Always clarify before.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Kenya is safe for hitchhiking on main roads. Travel during the day and use petrol stations to meet drivers.' },
      { type: 'sub', title: 'Use SpotHitch for your safety' },
      { type: 'rule', icon: '🛡️', text: 'Activate Guardian Mode before every trip. A trusted person follows your position in real time.' },
      { type: 'rule', icon: '🆘', text: 'Set up SOS mode with your contacts. One tap triggers a triple alert (push, SMS, call).' },
      { type: 'rule', icon: '📱', text: 'Take a photo of the licence plate and send it to someone before getting in.' },
      { type: 'rule', icon: '🎒', text: 'Keep your bag accessible (on your lap or at your feet), never in the boot.' },
      { type: 'sub', title: 'Country tips' },
      { type: 'rule', icon: '☀️', text: 'Travel during the day only. Hitching at night is not recommended on Kenyan roads.' },
      { type: 'rule', icon: '🛣️', text: 'Main roads (Nairobi to Mombasa, Nairobi to Nakuru) are well travelled and safe.' },
      { type: 'sub', title: 'Emergency numbers' },
      { type: 'kv', items: [{ k: 'Emergency', v: '999' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Women travelling alone in Kenya report mixed experiences. Tourist areas (Masai Mara, Amboseli) are safe. Matatus are a safer alternative to hitchhiking.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'English and Swahili are the official languages. English is well spoken (language of education). Swahili is the everyday language.' },
      { type: 'phrase', items: [
        { local: 'Jambo / Habari', meaning: 'Hello / How are you (Swahili)' },
        { local: 'Asante sana', meaning: 'Thank you very much' },
        { local: 'Bure', meaning: 'Free' },
        { local: 'Hakuna matata', meaning: 'No worries (yes, it\'s real!)' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Kenya is moderately expensive (especially safaris). Tight budget without safaris: 15-25 €/day. Nyama choma (grills) are hearty.' },
      { type: 'kv', items: [
        { k: 'Local meal', v: '200-500 KES (1.50-4 €)' },
        { k: 'Hostel', v: '800-2,000 KES (6-15 €)' },
        { k: 'Matatu (100 km)', v: '200-500 KES (1.50-4 €)' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wild camping is not recommended (wild animals). Park campsites are safe and well organised. Backpacker hostels are well developed in Nairobi and on the coast.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚐', name: 'Matatu', detail: 'Ubiquitous minibuses, music blasting, unique experience', price: '1-5 €' },
        { emoji: '🚂', name: 'Madaraka Express (SGR)', detail: 'Modern train Nairobi-Mombasa (4h30)', price: '10-30 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'great' }, { name: 'Feb', level: 'great' }, { name: 'Mar', level: 'good' },
        { name: 'Apr', level: 'bad' }, { name: 'May', level: 'bad' }, { name: 'Jun', level: 'good' },
        { name: 'Jul', level: 'great' }, { name: 'Aug', level: 'great' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'ok' }, { name: 'Dec', level: 'good' },
      ]},
      { type: 'text', text: 'January-February and June-October: dry season, ideal. July-October: Great Migration at the Masai Mara. April-May: heavy rains (impassable roads in rural areas).' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Kenya is a vibrant and diverse country (42 tribes). The Masai are iconic but the country is much more than that. Nyama choma (grilled meat) and ugali (maize paste) are everyday dishes. Kenyans are welcoming and proud of their wildlife.' },
    ]},
  },
  // ==================== ETHIOPIA ====================
  ET: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Hitchhiking is legal in Ethiopia. Informal transport (getting on Isuzu trucks) is common. Drivers stop easily but often expect payment.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Ethiopia is a special case. Hitchhiking works but the line between free and paid is very blurry. Trucks regularly take passengers. Clarify "free, no birr" before getting in. In rural areas, you are an attraction: crowds of children shout "You! You! Money!"' },
      { type: 'text', text: 'Main roads (Addis-Bahir Dar, Addis-Lalibela) are paved. Tracks in the Simien or Danakil require an organised vehicle.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Ethiopia is safe for hitchhiking in tourist areas. Distances are long, so bring patience and supplies.' },
      { type: 'sub', title: 'Use SpotHitch for your safety' },
      { type: 'rule', icon: '🛡️', text: 'Activate Guardian Mode before every trip. A trusted person follows your position in real time.' },
      { type: 'rule', icon: '🆘', text: 'Set up SOS mode with your contacts. One tap triggers a triple alert (push, SMS, call).' },
      { type: 'rule', icon: '📱', text: 'Take a photo of the licence plate and send it to someone before getting in.' },
      { type: 'rule', icon: '🎒', text: 'Keep your bag accessible (on your lap or at your feet), never in the boot.' },
      { type: 'sub', title: 'Country tips' },
      { type: 'rule', icon: '🗺️', text: 'Distances are long between cities. Bring water and food for each journey.' },
      { type: 'rule', icon: '📋', text: 'Check the security situation before travelling. Some regions experience tensions.' },
      { type: 'sub', title: 'Emergency numbers' },
      { type: 'kv', items: [{ k: 'Emergency', v: '991' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Street harassment is common in Ethiopia. Women travelling alone report difficult experiences. Travelling as a duo is strongly recommended.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Amharic is the official language (unique Ge\'ez alphabet). English is taught in schools but poorly spoken in rural areas. Learn a few words of Amharic.' },
      { type: 'phrase', items: [
        { local: 'Selam', meaning: 'Hello' },
        { local: 'Amesegenalehu', meaning: 'Thank you' },
        { local: 'Nefsih / Free', meaning: 'Free' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Ethiopia is cheap. Tight budget: 10-20 €/day. Injera (spongy flatbread) with wots (stews) is the daily dish: 1-3 €.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wild camping is possible but ask permission locally. Pensions (basic hotels) cost 2-8 €. Orthodox monasteries sometimes host travellers.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚐', name: 'Minibus', detail: 'Main transport between cities, wait to be full (sometimes hours)', price: '1-10 €' },
        { emoji: '🚌', name: 'Selam Bus', detail: 'Long-distance bus, more comfortable', price: '5-15 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'great' }, { name: 'Feb', level: 'great' }, { name: 'Mar', level: 'good' },
        { name: 'Apr', level: 'ok' }, { name: 'May', level: 'ok' }, { name: 'Jun', level: 'bad' },
        { name: 'Jul', level: 'bad' }, { name: 'Aug', level: 'bad' }, { name: 'Sep', level: 'ok' },
        { name: 'Oct', level: 'great' }, { name: 'Nov', level: 'great' }, { name: 'Dec', level: 'great' },
      ]},
      { type: 'text', text: 'October to March: dry season, ideal. June-September: heavy rains (impassable roads). January: Timkat (Ethiopian Epiphany), the biggest festival. Ethiopia has its own calendar (13 months, 7-8 years behind).' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Ethiopia is unique in Africa: never colonised, its own calendar, its own alphabet, ancient Orthodox church. The coffee ceremony is a social ritual lasting 30-60 minutes (3 cups mandatory). Injera is eaten with the hands. Hospitality is sincere but begging children are a challenge.' },
      { type: 'event', items: [
        { month: 'Jan', day: '19', name: 'Timkat (Epiphany)', desc: 'The biggest religious festival. Spectacular processions in Gondar and Lalibela.' },
      ]},
    ]},
  },
  // ==================== MYANMAR ====================
  MM: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Hitchhiking is not regulated in Myanmar. The concept does not formally exist but drivers stop easily if you wave. Informal transport is common.' },
      { type: 'warn', text: '⚠️ Myanmar has been in political crisis since 2021 (coup). Check the security situation before travelling. Some areas are off-limits to foreigners.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Myanmar is a country where people are incredibly welcoming. Truck and pickup drivers stop easily. Much transport is informal (riding in the back of pickups). The concept of free rides is natural for the Burmese.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Check the security situation before travelling to Myanmar. The political situation changes regularly.' },
      { type: 'sub', title: 'Use SpotHitch for your safety' },
      { type: 'rule', icon: '🛡️', text: 'Activate Guardian Mode before every trip. A trusted person follows your position in real time.' },
      { type: 'rule', icon: '🆘', text: 'Set up SOS mode with your contacts. One tap triggers a triple alert (push, SMS, call).' },
      { type: 'rule', icon: '📱', text: 'Take a photo of the licence plate and send it to someone before getting in.' },
      { type: 'rule', icon: '🎒', text: 'Keep your bag accessible (on your lap or at your feet), never in the boot.' },
      { type: 'sub', title: 'Country tips' },
      { type: 'rule', icon: '📋', text: 'Check your foreign ministry\'s advisories before any trip. The situation is evolving.' },
      { type: 'rule', icon: '🌍', text: 'Check recent traveller forums for up-to-date information on accessible areas.' },
      { type: 'sub', title: 'Emergency numbers' },
      { type: 'kv', items: [{ k: 'Emergency', v: '199' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Myanmar was considered very safe for women (respectful Buddhist culture). The situation has changed since 2021. Check the current situation.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Burmese is the official language. English is limited but growing among young urbanites.' },
      { type: 'phrase', items: [
        { local: 'Mingalaba', meaning: 'Hello' },
        { local: 'Kyay zu tin ba de', meaning: 'Thank you' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Myanmar is cheap. Tight budget: $15-25/day. Teashops serve meals for $1-2.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Guesthouses are cheap ($5-15). Monasteries sometimes host travellers. Wild camping is possible in rural areas.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Long-distance bus', detail: 'Extensive network, comfortable VIP buses', price: '$5-20' },
        { emoji: '🚂', name: 'Train', detail: 'Slow but scenic (Hsipaw, Goteik viaduct)', price: '$2-10' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'great' }, { name: 'Feb', level: 'great' }, { name: 'Mar', level: 'good' },
        { name: 'Apr', level: 'ok' }, { name: 'May', level: 'bad' }, { name: 'Jun', level: 'bad' },
        { name: 'Jul', level: 'bad' }, { name: 'Aug', level: 'bad' }, { name: 'Sep', level: 'bad' },
        { name: 'Oct', level: 'ok' }, { name: 'Nov', level: 'great' }, { name: 'Dec', level: 'great' },
      ]},
      { type: 'text', text: 'November to February: ideal. March-May: very hot. June-October: intense monsoon.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Myanmar is a deeply Buddhist country. Golden pagodas (Shwedagon) are spectacular. The Burmese are smiling and generous. Thanaka (yellow paste on the face) is a traditional cosmetic. Milky tea (laphet yay) is the national drink.' },
    ]},
  },
  // ==================== INDONESIA ====================
  ID: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Hitchhiking is not a formal concept in Indonesia. Informal transport is the norm: motorbike taxis (ojek), bemos, angkots. Drivers stop if you wave but often expect payment.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Indonesia is the world\'s largest archipelago (17,000 islands). Classic hitchhiking is difficult as informal transport is ubiquitous and very cheap. In rural areas (Sumatra, Kalimantan, Papua), trucks take passengers.' },
      { type: 'rule', icon: '🏍️', text: 'Ojeks (motorbike taxis) are everywhere. Free if someone offers, otherwise clarify the price.' },
      { type: 'text', text: 'Bali is not representative of Indonesia. Java, Sumatra and Sulawesi are more authentic for hitchhiking.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Indonesia is a safe country for hitchhiking. Bali and Java are the easiest islands for hitching. Indonesians are extremely welcoming.' },
      { type: 'sub', title: 'Use SpotHitch for your safety' },
      { type: 'rule', icon: '🛡️', text: 'Activate Guardian Mode before every trip. A trusted person follows your position in real time.' },
      { type: 'rule', icon: '🆘', text: 'Set up SOS mode with your contacts. One tap triggers a triple alert (push, SMS, call).' },
      { type: 'rule', icon: '📱', text: 'Take a photo of the licence plate and send it to someone before getting in.' },
      { type: 'rule', icon: '🎒', text: 'Keep your bag accessible (on your lap or at your feet), never in the boot.' },
      { type: 'sub', title: 'Country tips' },
      { type: 'rule', icon: '🏝️', text: 'Bali and Java are the easiest islands for hitching. Traffic is heavy and drivers stop readily.' },
      { type: 'rule', icon: '🤝', text: 'Indonesians are extremely welcoming. You will often be offered food or a detour.' },
      { type: 'sub', title: 'Emergency numbers' },
      { type: 'kv', items: [{ k: 'Emergency', v: '112' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Indonesia is generally safe for women. Dress modestly (Indonesia is the world\'s largest Muslim country). Bali is more relaxed. Aceh enforces Sharia law.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Bahasa Indonesia is the official language (easy to learn, no conjugation). English is common in tourist areas. 700+ local languages exist.' },
      { type: 'phrase', items: [
        { local: 'Selamat pagi/siang/sore', meaning: 'Good morning/afternoon/evening' },
        { local: 'Terima kasih', meaning: 'Thank you' },
        { local: 'Gratis', meaning: 'Free' },
        { local: 'Ke mana?', meaning: 'Where are you going?' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Indonesia is very cheap (except tourist Bali). Tight budget: 10-20 €/day. Nasi goreng (fried rice) costs 0.50-1.50 €.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Losmen/homestays are very cheap (3-10 €). Wild camping is possible in rural areas and on volcanoes.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Bus', detail: 'Extensive network on Java and Sumatra', price: '2-15 €' },
        { emoji: '⛴️', name: 'PELNI Ferry', detail: 'Boats between islands, slow but cheap', price: '5-30 €' },
        { emoji: '✈️', name: 'Low-cost flights', detail: 'Lion Air, AirAsia. Often the only option between distant islands.', price: '15-60 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mar', level: 'ok' },
        { name: 'Apr', level: 'good' }, { name: 'May', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Aug', level: 'great' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'ok' }, { name: 'Dec', level: 'bad' },
      ]},
      { type: 'text', text: 'May to September: dry season, ideal. November-March: monsoon (daily but short rains). Bali and Java are doable year-round.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Indonesia is incredibly diverse: Hindu in Bali, Muslim in Java, Christian in Flores, animist in Papua. Gotong royong (communal mutual aid) is a core value. Nasi goreng (fried rice) is the national dish. Indonesians are among the most smiling people in Asia.' },
    ]},
  },
  // ==================== PHILIPPINES ====================
  PH: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Hitchhiking is not regulated in the Philippines. Informal transport is the norm: jeepneys, tricycles, habal-habal (motorbikes). Drivers stop easily.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'The Philippines is a very welcoming country. Filipinos are among the most hospitable people in Asia. Hitchhiking works but public transport is so cheap that it is rarely necessary. On less touristy islands, pickups and motorbikes stop easily.' },
      { type: 'text', text: 'Mindanao is harder to access (some areas not recommended). Luzon and the Visayas are the easiest.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'The Philippines is safe for hitchhiking on the main islands. Filipinos are welcoming and English is widely spoken.' },
      { type: 'sub', title: 'Use SpotHitch for your safety' },
      { type: 'rule', icon: '🛡️', text: 'Activate Guardian Mode before every trip. A trusted person follows your position in real time.' },
      { type: 'rule', icon: '🆘', text: 'Set up SOS mode with your contacts. One tap triggers a triple alert (push, SMS, call).' },
      { type: 'rule', icon: '📱', text: 'Take a photo of the licence plate and send it to someone before getting in.' },
      { type: 'rule', icon: '🎒', text: 'Keep your bag accessible (on your lap or at your feet), never in the boot.' },
      { type: 'sub', title: 'Country tips' },
      { type: 'rule', icon: '🏝️', text: 'The main islands (Luzon, Visayas) are the easiest for hitching. Avoid the far south of Mindanao.' },
      { type: 'rule', icon: '🗣️', text: 'English is widely spoken. Communication is easy and Filipinos love to chat.' },
      { type: 'sub', title: 'Emergency numbers' },
      { type: 'kv', items: [{ k: 'Emergency', v: '911' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'The Philippines is generally safe for women. Society is matriarchal in many communities. Filipinos are respectful.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Filipino (Tagalog) and English are the official languages. English is very well spoken (3rd largest English-speaking country in the world). No language barrier.' },
      { type: 'phrase', items: [
        { local: 'Kumusta?', meaning: 'How are you?' },
        { local: 'Salamat po', meaning: 'Thank you (respectful)' },
        { local: 'Saan ka pupunta?', meaning: 'Where are you going?' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'The Philippines is cheap. Tight budget: 15-25 €/day. Rice with adobo (marinated chicken/pork) costs 1-2 €.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Guesthouses are cheap (5-15 €). Wild camping is possible on deserted beaches. Filipinos easily invite travellers into their homes.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚐', name: 'Jeepney', detail: 'Icon of the Philippines. Colourful local transport.', price: '0.20-0.50 €' },
        { emoji: '⛴️', name: 'Ferry / bangka', detail: 'Between islands. 2GO Travel for long distances.', price: '5-30 €' },
        { emoji: '✈️', name: 'Cebu Pacific / AirAsia', detail: 'Cheap inter-island flights', price: '15-50 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'great' }, { name: 'Feb', level: 'great' }, { name: 'Mar', level: 'great' },
        { name: 'Apr', level: 'great' }, { name: 'May', level: 'good' }, { name: 'Jun', level: 'ok' },
        { name: 'Jul', level: 'ok' }, { name: 'Aug', level: 'bad' }, { name: 'Sep', level: 'bad' },
        { name: 'Oct', level: 'bad' }, { name: 'Nov', level: 'ok' }, { name: 'Dec', level: 'good' },
      ]},
      { type: 'text', text: 'December to May: dry season, ideal. June-November: monsoon and typhoons. The south (Mindanao) is less affected by typhoons.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Filipinos are joyful, welcoming and love to sing (karaoke = national institution). Lechon (roasted pig) is the festive dish. San Miguel is the national beer. "Filipino time" means nothing is rushed.' },
    ]},
  },
  // ==================== SRI LANKA ====================
  LK: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Hitchhiking is legal in Sri Lanka. The concept is understood and hitchhiking works well. Sri Lankans are naturally welcoming and stop easily.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Sri Lanka is easy for hitchhiking. The country is small (430 km north-south) and drivers are welcoming. Tuk-tuks and buses are everywhere but free hitchhiking works too. Wait time: 10-20 min.' },
      { type: 'text', text: 'Hill Country roads (Kandy-Ella-Nuwara Eliya) are the most scenic. The south and west coast has more traffic.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Sri Lanka is a safe country for hitchhiking. Drivers are hospitable and coastal roads are the easiest for hitching.' },
      { type: 'sub', title: 'Use SpotHitch for your safety' },
      { type: 'rule', icon: '🛡️', text: 'Activate Guardian Mode before every trip. A trusted person follows your position in real time.' },
      { type: 'rule', icon: '🆘', text: 'Set up SOS mode with your contacts. One tap triggers a triple alert (push, SMS, call).' },
      { type: 'rule', icon: '📱', text: 'Take a photo of the licence plate and send it to someone before getting in.' },
      { type: 'rule', icon: '🎒', text: 'Keep your bag accessible (on your lap or at your feet), never in the boot.' },
      { type: 'sub', title: 'Country tips' },
      { type: 'rule', icon: '🌊', text: 'Coastal roads are the easiest for hitching. Traffic is heavy and drivers are welcoming.' },
      { type: 'rule', icon: '🤝', text: 'Sri Lankans are hospitable and protective towards travellers. Accept invitations with gratitude.' },
      { type: 'sub', title: 'Emergency numbers' },
      { type: 'kv', items: [{ k: 'Emergency', v: '119' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Sri Lanka is moderately safe for women alone. Harassment exists but is generally limited to staring and comments. The south and Hill Country are the safest.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Sinhala and Tamil are the official languages. English is fairly widespread in tourist and educated areas.' },
      { type: 'phrase', items: [
        { local: 'Ayubowan', meaning: 'Hello / Long life (Sinhala)' },
        { local: 'Istuti', meaning: 'Thank you (Sinhala)' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Sri Lanka is cheap. Tight budget: 15-25 €/day. Rice & curry is the daily dish: 1-3 €.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Guesthouses are cheap (5-15 €). Wild camping is possible in the Hill Country. Buddhist temples sometimes host travellers.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚂', name: 'Train', detail: 'Hill Country trains are among the most beautiful journeys in the world (Kandy-Ella).', price: '1-5 €' },
        { emoji: '🚌', name: 'Bus', detail: 'Dense and very cheap network', price: '0.50-3 €' },
        { emoji: '🛺', name: 'Tuk-tuk', detail: 'Ubiquitous local transport', price: '0.50-5 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'great' }, { name: 'Feb', level: 'great' }, { name: 'Mar', level: 'great' },
        { name: 'Apr', level: 'good' }, { name: 'May', level: 'ok' }, { name: 'Jun', level: 'ok' },
        { name: 'Jul', level: 'good' }, { name: 'Aug', level: 'good' }, { name: 'Sep', level: 'ok' },
        { name: 'Oct', level: 'bad' }, { name: 'Nov', level: 'bad' }, { name: 'Dec', level: 'good' },
      ]},
      { type: 'text', text: 'Sri Lanka has two opposite monsoons: southwest coast (May-September) and northeast coast (October-January). There is always a dry side. December-March: best for the south and west coast.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Sri Lanka is "the pearl of the Indian Ocean." Theravada Buddhism permeates the culture (temples, monks, festivals). Ceylon tea is a national pride. Rice & curry is an art: up to 10 different dishes around the rice. Buddhist festivals (Vesak, Perahera) are spectacular.' },
    ]},
  },
  // ==================== MONGOLIA ====================
  MN: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Hitchhiking is legal in Mongolia. Informal transport is the norm outside Ulaanbaatar. On tracks (there are very few paved roads), every passing vehicle stops.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Mongolia is a unique country for hitchhiking. Outside Ulaanbaatar, there are virtually no paved roads: just tracks across the steppe. Every vehicle (truck, jeep, motorbike) stops as traffic is very low and distances immense.' },
      { type: 'rule', icon: '💰', text: 'Drivers often expect payment (transport is a service in a country without buses). Negotiate before.' },
      { type: 'rule', icon: '🏔️', text: 'Nomad yurts (gers) are open to travellers. It is Mongolian tradition.' },
      { type: 'warn', text: '⚠️ Distances are immense and there is NOTHING between towns. Bring water, food and a warm sleeping bag.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Mongolia is a safe country for hitchhiking. Distances are immense and roads sometimes non-existent. Bring a tent and supplies.' },
      { type: 'sub', title: 'Use SpotHitch for your safety' },
      { type: 'rule', icon: '🛡️', text: 'Activate Guardian Mode before every trip. A trusted person follows your position in real time.' },
      { type: 'rule', icon: '🆘', text: 'Set up SOS mode with your contacts. One tap triggers a triple alert (push, SMS, call).' },
      { type: 'rule', icon: '📱', text: 'Take a photo of the licence plate and send it to someone before getting in.' },
      { type: 'rule', icon: '🎒', text: 'Keep your bag accessible (on your lap or at your feet), never in the boot.' },
      { type: 'sub', title: 'Country tips' },
      { type: 'rule', icon: '⛺', text: 'Distances are immense and roads sometimes non-existent. Bring a tent and food.' },
      { type: 'rule', icon: '🏜️', text: 'Outside Ulaanbaatar, there is virtually no phone signal. Inform your contacts before each journey.' },
      { type: 'sub', title: 'Emergency numbers' },
      { type: 'kv', items: [{ k: 'Emergency', v: '102' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Mongolia is relatively safe for women. Society is egalitarian (Mongolian women are strong and independent). Avoid Ulaanbaatar bars late at night.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Mongolian is the official language (Cyrillic alphabet). Russian is understood by those over 40. English is very limited outside Ulaanbaatar.' },
      { type: 'phrase', items: [
        { local: 'Sain baina uu', meaning: 'Hello' },
        { local: 'Bayarlalaa', meaning: 'Thank you' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Mongolia is cheap. Tight budget: 15-25 €/day. Buuz (meat dumplings) is the national dish: 1-2 €. Yurt accommodation with nomad families is free or very cheap.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wild camping is unlimited in Mongolia: the steppe is infinite and nobody will bother you. Nomads welcome travellers in their yurts (sacred tradition). Offer a small gift in return.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚐', name: 'Mikr / Furgon', detail: 'Minibuses between cities, wait to be full (sometimes hours)', price: '5-15 €' },
        { emoji: '🚂', name: 'Trans-Mongolian', detail: 'Legendary train Ulaanbaatar-Irkutsk or Ulaanbaatar-Beijing', price: '30-100 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mar', level: 'bad' },
        { name: 'Apr', level: 'ok' }, { name: 'May', level: 'good' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Aug', level: 'great' }, { name: 'Sep', level: 'good' },
        { name: 'Oct', level: 'ok' }, { name: 'Nov', level: 'bad' }, { name: 'Dec', level: 'bad' },
      ]},
      { type: 'text', text: 'June to August: ideal (15-25°C). Naadam (July) is the national festival. Winter is extreme (down to -40°C). Ulaanbaatar is the coldest capital in the world.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Mongolia is the land of nomads. 30% of the population still lives in yurts. Hospitality is sacred: a traveller arriving at a yurt receives salted milk tea (suutei tsai), airag (fermented mare\'s milk) and food. Naadam (July) celebrates the "three manly games": wrestling, archery and horse racing.' },
      { type: 'event', items: [
        { month: 'Jul', day: '11-13', name: 'Naadam', desc: 'The biggest Mongolian festival. Wrestling, archery, horse racing. Incredible atmosphere.' },
      ]},
    ]},
  },
  // ==================== CUBA ====================
  CU: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Hitchhiking is legal and even encouraged in Cuba. The government created "puntos de botella" (official hitchhiking points) where officials ("amarillos," in yellow vests) organise rides.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Cuba is probably the best country in the world for hitchhiking. State vehicles are REQUIRED by law to pick up hitchhikers. The "amarillos" (officials in yellow vests at crossroads) officially organise hitchhiking. Wait time: 5-30 min.' },
      { type: 'rule', icon: '🟡', text: 'Puntos de botella (official hitchhiking points) are at city exits. Look for the amarillos in yellow vests.' },
      { type: 'rule', icon: '🚛', text: 'State trucks (camiones) are the main transport in rural areas. Ride in the back, it is normal.' },
      { type: 'text', text: 'Old American cars (almendrones) are shared taxis. Clarify the price. Free hitchhiking works very well as cars are rare and expensive.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Cuba is one of the safest countries in the Americas. Violent crime is virtually non-existent. Minor scams (jineteros) are the main tourist risk.' },
      { type: 'kv', items: [{ k: 'Emergencies', v: '106 (police) / 104 (ambulance)' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Cuba is safe for women travelling alone. Machismo exists (piropos = street compliments) but serious incidents are very rare. Cuban society is protective of visitors.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Cuban Spanish is the only language. English is very limited except in tourist hotels. French is sometimes understood by older people (cooperation with Quebec).' },
      { type: 'phrase', items: [
        { local: '¿Me da botella?', meaning: 'Will you give me a ride? (Cuban expression)' },
        { local: '¡Dale!', meaning: 'OK / Let\'s go!' },
        { local: 'Gracias, companero', meaning: 'Thanks, comrade' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Cuba is financially complicated. Two economies coexist (tourist and local). Tight budget: 20-35 €/day eating locally. Casas particulares (rooms in private homes): 15-25 €/night.' },
      { type: 'warn', text: '⚠️ American bank cards do NOT work. Bring euros in cash. The official exchange rate is unfavourable. The informal market offers better rates.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Casas particulares (rooms in private homes) are the standard option. Cubans are welcoming and conversations are fascinating. Wild camping is possible on beaches but ask permission locally.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Viazul', detail: 'Air-conditioned tourist buses. Reliable but expensive for Cuba.', price: '10-40 €' },
        { emoji: '🚛', name: 'Camiones', detail: 'State trucks converted to buses. Local transport in Cuban pesos.', price: '0.50-2 €' },
        { emoji: '🚗', name: 'Almendrones (shared taxi)', detail: 'Old American cars, shared rides', price: '2-10 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'great' }, { name: 'Feb', level: 'great' }, { name: 'Mar', level: 'great' },
        { name: 'Apr', level: 'good' }, { name: 'May', level: 'ok' }, { name: 'Jun', level: 'ok' },
        { name: 'Jul', level: 'ok' }, { name: 'Aug', level: 'bad' }, { name: 'Sep', level: 'bad' },
        { name: 'Oct', level: 'bad' }, { name: 'Nov', level: 'good' }, { name: 'Dec', level: 'great' },
      ]},
      { type: 'text', text: 'November to April: dry season, ideal. August-October: hurricane season possible. Cuba is hot and humid year-round (25-33°C).' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Cuba is a world apart. Music (son, salsa, rumba) is everywhere. Rum and cigars are institutions. Conversations with Cubans are fascinating (politics, history, dreams). The socialist system creates a unique solidarity: everyone shares what they have.' },
      { type: 'event', items: [
        { month: 'Jul', day: '⟳', name: 'Carnival of Santiago', desc: 'The biggest carnival in Cuba. Music, dance, conga in the streets.' },
      ]},
    ]},
  },
  // ==================== GUATEMALA ====================
  GT: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Hitchhiking is legal in Guatemala. Pickups (camionetas) are the main transport in rural areas and take passengers for a small payment. Free hitchhiking also works.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Guatemala is doable by hitchhiking. Pickups and trucks stop easily in rural areas. Guatemalans are welcoming. Wait time: 15-30 min. The Highlands (Lake Atitlan, Antigua, Chichicastenango) are the easiest area.' },
      { type: 'rule', icon: '🛻', text: 'Ride in the back of pickups, it is normal transport. A small payment is often expected.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Guatemala is safe in tourist areas (Antigua, Atitlan, Highlands). Gasolineras (petrol stations) are good spots to find a ride.' },
      { type: 'sub', title: 'Use SpotHitch for your safety' },
      { type: 'rule', icon: '🛡️', text: 'Activate Guardian Mode before every trip. A trusted person follows your position in real time.' },
      { type: 'rule', icon: '🆘', text: 'Set up SOS mode with your contacts. One tap triggers a triple alert (push, SMS, call).' },
      { type: 'rule', icon: '📱', text: 'Take a photo of the licence plate and send it to someone before getting in.' },
      { type: 'rule', icon: '🎒', text: 'Keep your bag accessible (on your lap or at your feet), never in the boot.' },
      { type: 'sub', title: 'Country tips' },
      { type: 'rule', icon: '⛽', text: 'Gasolineras are good spots to meet drivers in a safe setting.' },
      { type: 'rule', icon: '🌄', text: 'Stick to tourist areas (Antigua, Atitlan, Semuc Champey) and the Highlands for hitching.' },
      { type: 'sub', title: 'Emergency numbers' },
      { type: 'kv', items: [{ k: 'Police', v: '120' }, { k: 'Fire brigade', v: '110' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Guatemala is tricky for women alone. The Highlands are safer. Travelling as a duo is recommended.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Spanish is the main language. 21 Mayan languages are spoken in the Highlands. English is limited to tourist areas.' },
      { type: 'phrase', items: [
        { local: '¿Me da jalon?', meaning: 'Will you give me a ride?' },
        { local: '¡Puchica!', meaning: 'Expression of surprise (Guatemalan)' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Guatemala is cheap. Tight budget: 15-25 €/day. Comedores (canteens) serve meals for 1-3 €.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Hospedajes are cheap (3-10 €). Camping is possible around Lake Atitlan and in the mountains.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Chicken bus', detail: 'Former American school buses, painted. Unique experience, crowded, cheap.', price: '0.50-3 €' },
        { emoji: '🚐', name: 'Tourist shuttle', detail: 'Minibuses between tourist spots', price: '5-15 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'great' }, { name: 'Feb', level: 'great' }, { name: 'Mar', level: 'great' },
        { name: 'Apr', level: 'good' }, { name: 'May', level: 'ok' }, { name: 'Jun', level: 'ok' },
        { name: 'Jul', level: 'ok' }, { name: 'Aug', level: 'ok' }, { name: 'Sep', level: 'bad' },
        { name: 'Oct', level: 'bad' }, { name: 'Nov', level: 'good' }, { name: 'Dec', level: 'great' },
      ]},
      { type: 'text', text: 'November to April: dry season, ideal. The Highlands are cool (15-25°C). The coast is hot and humid.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Guatemala is the heart of the Maya world. Colourful markets (Chichicastenango), the ruins of Tikal and Lake Atitlan are wonders. Mayan communities are alive (languages, costumes, traditions). Guatemalan coffee is among the best in the world.' },
    ]},
  },
  // ==================== COSTA RICA ====================
  CR: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Hitchhiking is legal in Costa Rica. Fairly common practice, especially in rural areas and on Pacific beach roads.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Costa Rica is easy for hitchhiking. Ticos (Costa Ricans) are welcoming and "pura vida" (life is beautiful) is more than a slogan. Wait time: 15-30 min. Pacific roads (Nicoya, Osa) have fewer buses and hitchhiking is almost mandatory.' },
      { type: 'rule', icon: '🛻', text: 'Pickups and 4x4s are the most common vehicles in rural areas. Surfers stop easily.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Costa Rica is a safe country for hitchhiking. Ticos (Costa Ricans) are welcoming and mountain roads offer spectacular scenery.' },
      { type: 'sub', title: 'Use SpotHitch for your safety' },
      { type: 'rule', icon: '🛡️', text: 'Activate Guardian Mode before every trip. A trusted person follows your position in real time.' },
      { type: 'rule', icon: '🆘', text: 'Set up SOS mode with your contacts. One tap triggers a triple alert (push, SMS, call).' },
      { type: 'rule', icon: '📱', text: 'Take a photo of the licence plate and send it to someone before getting in.' },
      { type: 'rule', icon: '🎒', text: 'Keep your bag accessible (on your lap or at your feet), never in the boot.' },
      { type: 'sub', title: 'Country tips' },
      { type: 'rule', icon: '🏔️', text: 'Mountain roads are winding. Expect motion sickness and take breaks.' },
      { type: 'rule', icon: '😊', text: 'Ticos are very welcoming. "Pura Vida" is their philosophy. Embrace it!' },
      { type: 'sub', title: 'Emergency numbers' },
      { type: 'kv', items: [{ k: 'Emergency', v: '911' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Costa Rica is safe for women travelling alone. Ticos are respectful. Surf areas are laid-back and inclusive.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Spanish is the main language. English is fairly widespread in tourist areas and on the Caribbean coast. "Pura vida" is the universal expression (hello, goodbye, thanks, how are you, all is well).' },
      { type: 'phrase', items: [
        { local: '¡Pura vida!', meaning: 'All good / Thanks / Hi (universal)' },
        { local: 'Mae', meaning: 'Dude (Tico expression)' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Costa Rica is the most expensive country in Central America. Tight budget: 25-40 €/day. Sodas (local canteens) serve casados (full meals) for 3-5 €.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wild camping is possible on Pacific beaches. Hostels are well developed (10-20 €). Costa Rica is a pioneer of ecotourism.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Bus', detail: 'Extensive and cheap network. Terminal 7-10 in San Jose.', price: '2-15 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'great' }, { name: 'Feb', level: 'great' }, { name: 'Mar', level: 'great' },
        { name: 'Apr', level: 'good' }, { name: 'May', level: 'ok' }, { name: 'Jun', level: 'ok' },
        { name: 'Jul', level: 'ok' }, { name: 'Aug', level: 'ok' }, { name: 'Sep', level: 'bad' },
        { name: 'Oct', level: 'bad' }, { name: 'Nov', level: 'good' }, { name: 'Dec', level: 'great' },
      ]},
      { type: 'text', text: 'December to April: dry season (verano). The Caribbean coast has a reverse cycle (dry in September-October). Surfing is better in rainy season.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: '"Pura vida" sums it all up: life is beautiful, no stress. Costa Rica has no army (abolished in 1949) and invests in education and the environment. 25% of the territory is in nature reserves. Ticos are proud of their biodiversity (5% of the world\'s biodiversity).' },
    ]},
  },
  // ==================== EGYPT ====================
  EG: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Hitchhiking is not formally regulated in Egypt. Informal transport (microbuses, pickups) is the main mode. Raising your hand by the road stops vehicles.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Egypt operates on semi-informal transport. Microbuses stop everywhere (0.10-0.50 €). For free hitchhiking, trucks on long-distance roads (Cairo-Luxor, Cairo-Hurghada) take passengers. Egyptian hospitality helps a lot.' },
      { type: 'rule', icon: '💰', text: 'The line between free and paid is very blurry. Clarify "mish flous" (no money) or "free" before getting in.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Egypt is safe for travellers in tourist areas. For long night journeys, prefer long-distance buses over hitching.' },
      { type: 'sub', title: 'Use SpotHitch for your safety' },
      { type: 'rule', icon: '🛡️', text: 'Activate Guardian Mode before every trip. A trusted person follows your position in real time.' },
      { type: 'rule', icon: '🆘', text: 'Set up SOS mode with your contacts. One tap triggers a triple alert (push, SMS, call).' },
      { type: 'rule', icon: '📱', text: 'Take a photo of the licence plate and send it to someone before getting in.' },
      { type: 'rule', icon: '🎒', text: 'Keep your bag accessible (on your lap or at your feet), never in the boot.' },
      { type: 'sub', title: 'Country tips' },
      { type: 'rule', icon: '🏛️', text: 'Tourist areas (Cairo, Luxor, Aswan, coast) are safe and well monitored.' },
      { type: 'rule', icon: '🚌', text: 'For long night journeys, long-distance buses are a safe and affordable alternative.' },
      { type: 'sub', title: 'Emergency numbers' },
      { type: 'kv', items: [{ k: 'Emergency', v: '122' }] },
    ]},
    women: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'Street harassment is a major problem in Egypt, especially in Cairo. Women hitchhiking alone is not recommended. Travelling as a duo (with a man) radically changes the experience.' },
      { type: 'rule', icon: '👫', text: 'Travelling with a male companion is strongly recommended.' },
      { type: 'rule', icon: '👕', text: 'Dress very conservatively (covered shoulders and knees).' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Egyptian Arabic is the main language (the most understood dialect in the Arab world thanks to cinema). English is common in tourist areas.' },
      { type: 'phrase', items: [
        { local: 'Ahlan wa sahlan', meaning: 'Welcome' },
        { local: 'Shukran', meaning: 'Thank you' },
        { local: 'Mish flous', meaning: 'No money (free)' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Egypt is very cheap for foreigners (since the devaluation). Tight budget: 10-20 €/day. Koshari (national dish) costs 0.50-1 €.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Hostels are cheap (3-10 €). Wild camping is possible in the desert (White Desert, Siwa). Egyptians sometimes invite travellers into their homes.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚐', name: 'Microbus', detail: 'Ubiquitous local transport, very cheap', price: '0.10-0.50 €' },
        { emoji: '🚂', name: 'Train', detail: 'Extensive network along the Nile. Cairo-Luxor by night train.', price: '5-25 €' },
        { emoji: '🚌', name: 'GoBus / Blue Bus', detail: 'Modern long-distance buses', price: '5-15 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'great' }, { name: 'Feb', level: 'great' }, { name: 'Mar', level: 'great' },
        { name: 'Apr', level: 'good' }, { name: 'May', level: 'ok' }, { name: 'Jun', level: 'bad' },
        { name: 'Jul', level: 'bad' }, { name: 'Aug', level: 'bad' }, { name: 'Sep', level: 'ok' },
        { name: 'Oct', level: 'great' }, { name: 'Nov', level: 'great' }, { name: 'Dec', level: 'great' },
      ]},
      { type: 'text', text: 'October to March: ideal (20-28°C). Summer is scorching (40-45°C in the south). Sinai and the Red Sea are pleasant almost year-round.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Egypt is a fascinating country. The Pyramids, Luxor and the Nile are eternal wonders. Egyptians are warm, funny and love to chat. Koshari (pasta, rice, lentils, fried onions) is the people\'s dish. Mint tea (shai) is offered at all hours.' },
    ]},
  },
  // ==================== TANZANIA ====================
  TZ: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Hitchhiking is not regulated in Tanzania. Informal transport (dala-dala = minibuses) is the main mode. Drivers stop if you wave.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Tanzania operates like neighbouring Kenya. Dala-dalas are everywhere and very cheap. Free hitchhiking is possible on long-distance roads with trucks. Tanzanians are welcoming.' },
      { type: 'rule', icon: '💰', text: 'Clarify "bure" (free) before getting in. Paid informal transport is the norm.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Tanzania is safe for hitchhiking on main roads. Travel during the day and use matatu (minibus) stops as landmarks.' },
      { type: 'sub', title: 'Use SpotHitch for your safety' },
      { type: 'rule', icon: '🛡️', text: 'Activate Guardian Mode before every trip. A trusted person follows your position in real time.' },
      { type: 'rule', icon: '🆘', text: 'Set up SOS mode with your contacts. One tap triggers a triple alert (push, SMS, call).' },
      { type: 'rule', icon: '📱', text: 'Take a photo of the licence plate and send it to someone before getting in.' },
      { type: 'rule', icon: '🎒', text: 'Keep your bag accessible (on your lap or at your feet), never in the boot.' },
      { type: 'sub', title: 'Country tips' },
      { type: 'rule', icon: '☀️', text: 'Travel during the day only. Main roads are safe but poorly lit at night.' },
      { type: 'rule', icon: '🗺️', text: 'Main roads (Dar to Arusha, Dar to Dodoma) are the busiest for hitching.' },
      { type: 'sub', title: 'Emergency numbers' },
      { type: 'kv', items: [{ k: 'Emergency', v: '112' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Tanzania is moderately safe for women. Tourist areas (Zanzibar, Serengeti) are safe. Dress modestly, especially in Zanzibar (Muslim).' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Swahili and English are the official languages. Swahili is the everyday language. English is well spoken in tourist areas.' },
      { type: 'phrase', items: [
        { local: 'Jambo / Mambo', meaning: 'Hello / What\'s up (informal)' },
        { local: 'Asante sana', meaning: 'Thank you very much' },
        { local: 'Bure', meaning: 'Free' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Tanzania is moderately expensive (safaris are very pricey). Tight budget without safaris: 15-25 €/day. Zanzibar is touristy and pricier.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Guesthouses are cheap (5-15 €). Camping in national parks is organised and safe. Zanzibar has many hostels.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚐', name: 'Dala-dala', detail: 'Ubiquitous minibuses, crowded, cheap', price: '0.30-2 €' },
        { emoji: '⛴️', name: 'Ferry', detail: 'Dar es Salaam-Zanzibar (2h)', price: '$20-35' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'great' }, { name: 'Feb', level: 'great' }, { name: 'Mar', level: 'ok' },
        { name: 'Apr', level: 'bad' }, { name: 'May', level: 'bad' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Aug', level: 'great' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'ok' }, { name: 'Dec', level: 'good' },
      ]},
      { type: 'text', text: 'June-October: dry season, ideal for safaris. January-February: Great Migration in the Serengeti. April-May: heavy rains.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Tanzania is home to the Serengeti, Kilimanjaro and Zanzibar. The Masai are an iconic community. Ugali (maize paste) and nyama choma (grills) are everyday dishes. Zanzibar\'s Swahili culture blends African, Arab and Indian influences.' },
    ]},
  },
  // ==================== TAJIKISTAN ====================
  TJ: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Hitchhiking is legal in Tajikistan. Informal transport is the norm as roads are rare and buses virtually non-existent in the Pamir.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Tajikistan is legendary for hitchhiking. The Pamir Highway (M41) is one of the highest roads in the world (4,655m) and a hitchhiking classic. Traffic is low but everyone stops. Drivers are extremely welcoming.' },
      { type: 'rule', icon: '💰', text: 'Drivers often expect payment (petrol is expensive, roads are long). Negotiating or sharing petrol costs is normal.' },
      { type: 'rule', icon: '🏔️', text: 'The Pamir Highway requires a GBAO permit (permit for the Gorno-Badakhshan region).' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Tajikistan is safe. Crime is low. Pamir roads are dangerous (cliffs, no guardrails, altitude). Altitude can cause acute mountain sickness.' },
      { type: 'kv', items: [{ k: 'Emergencies', v: '112' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Tajikistan is relatively safe for women. Society is conservative but respectful. Travelling as a duo is recommended in the Pamir.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Tajik (close to Persian/Farsi) is the official language. Russian is very widespread. English is very rare. Basic Russian is essential.' },
      { type: 'phrase', items: [
        { local: 'Salom', meaning: 'Hello' },
        { local: 'Rahmat', meaning: 'Thank you' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Tajikistan is very cheap. Tight budget: 10-20 €/day. Plov and manty (dumplings) cost 1-2 €. Homestay accommodation in the Pamir: 10-15 € with meals.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Homestays are the norm in the Pamir (no hotels). Wild camping is unlimited in the mountains. Nights are very cold at altitude.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚗', name: 'Shared taxi', detail: 'Main transport between cities. Waits to be full.', price: '5-30 €' },
        { emoji: '🚐', name: 'Marshrutka', detail: 'Minibus on main roads', price: '2-10 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mar', level: 'bad' },
        { name: 'Apr', level: 'ok' }, { name: 'May', level: 'good' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Aug', level: 'great' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'ok' }, { name: 'Dec', level: 'bad' },
      ]},
      { type: 'text', text: 'June to September: ideal for the Pamir (passes open, bearable temperatures). Winter closes the passes and hitchhiking is virtually impossible.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'The Pamir is nicknamed "the roof of the world." Pamiris are among the most welcoming people on the planet. Hospitality is sacred: tea, bread, yak butter are offered to every visitor. The Ismaili culture (Aga Khan) is unique. The scenery is breathtaking.' },
    ]},
  },
  // ==================== SOUTH KOREA ====================
  KR: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Hitchhiking is legal in South Korea. The practice is rare as public transport is excellent and cheap. Koreans do not always understand the concept.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'South Korea is a special case. Hitchhiking is possible but drivers are surprised. Wait time: 20-60 min. Gas stations (jusoyuso) on motorways are the best spots. Koreans who stop are very enthusiastic and generous.' },
      { type: 'text', text: 'The country is small (380 km north-south) and public transport excellent (KTX, buses). Hitchhiking is more of an adventure than a necessity.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'South Korea is a very safe country for hitchhiking. Motorway rest areas are the best spots.' },
      { type: 'sub', title: 'Use SpotHitch for your safety' },
      { type: 'rule', icon: '🛡️', text: 'Activate Guardian Mode before every trip. A trusted person follows your position in real time.' },
      { type: 'rule', icon: '🆘', text: 'Set up SOS mode with your contacts. One tap triggers a triple alert (push, SMS, call).' },
      { type: 'rule', icon: '📱', text: 'Take a photo of the licence plate and send it to someone before getting in.' },
      { type: 'rule', icon: '🎒', text: 'Keep your bag accessible (on your lap or at your feet), never in the boot.' },
      { type: 'sub', title: 'Country tips' },
      { type: 'rule', icon: '🅿️', text: 'Motorway rest areas (\ud734\uac8c\uc18c) are the best spots. They are clean and very busy.' },
      { type: 'rule', icon: '🍜', text: 'Korean rest areas are legendary for their food. Recharge your batteries there.' },
      { type: 'sub', title: 'Emergency numbers' },
      { type: 'kv', items: [{ k: 'Emergency', v: '112' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'South Korea is very safe for women travelling alone. Incidents are very rare.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Korean is the only language. The Hangul alphabet is easy to learn (in a few hours). English is limited despite intensive education. Google Translate is useful.' },
      { type: 'phrase', items: [
        { local: 'Annyeonghaseyo', meaning: 'Hello' },
        { local: 'Gamsahamnida', meaning: 'Thank you' },
        { local: 'Hitchhike', meaning: 'Understood by young Koreans' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Korea is moderately expensive. Tight budget: 25-40 €/day. Street bibimbap costs 4-6 €. Jjimjilbangs (public saunas) offer cheap accommodation (8-12 €).' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Jjimjilbangs (public saunas/spas) are the budget option: 8-12 € for a night with sauna, shower and rest area. Motels (love motels) are affordable (15-30 €). Camping is possible in national parks.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚄', name: 'KTX', detail: 'High-speed train. Seoul-Busan in 2h30.', price: '25-50 €' },
        { emoji: '🚌', name: 'Express bus', detail: 'Excellent and cheap network', price: '5-20 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Feb', level: 'ok' }, { name: 'Mar', level: 'good' },
        { name: 'Apr', level: 'great' }, { name: 'May', level: 'great' }, { name: 'Jun', level: 'good' },
        { name: 'Jul', level: 'bad' }, { name: 'Aug', level: 'bad' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'great' }, { name: 'Nov', level: 'good' }, { name: 'Dec', level: 'ok' },
      ]},
      { type: 'text', text: 'April-May (cherry blossoms) and September-October (autumn foliage): ideal. July-August: monsoon (intense rains). Winter is cold (-10°C in Seoul).' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'South Korea is a unique blend of tradition and ultra-modernity. Kimchi, Korean barbecue (samgyeopsal) and soju are institutions. K-pop and dramas have conquered the world. Koreans are curious and enthusiastic about foreigners who hitchhike.' },
    ]},
  },
  // ==================== PAKISTAN ====================
  PK: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Hitchhiking is legal in Pakistan. Informal transport is a way of life. Jingle trucks (decorated trucks) take passengers with pleasure.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Pakistan is considered by many travellers as the most hospitable country in the world. Drivers systematically refuse money, insist on paying for meals and offer accommodation. Wait time: 5-15 min.' },
      { type: 'kv', items: [
        { k: 'Karakoram Highway (KKH)', v: 'Legendary. Most beautiful road in the world.', color: 'green' },
        { k: 'Hunza Valley', v: 'Paradise. Everyone stops.', color: 'green' },
        { k: 'Balochistan', v: 'Not recommended (security)', color: 'red' },
      ]},
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Check security advisories before travelling to Pakistan. The north (Hunza, Gilgit-Baltistan) is safe and extremely welcoming.' },
      { type: 'sub', title: 'Use SpotHitch for your safety' },
      { type: 'rule', icon: '🛡️', text: 'Activate Guardian Mode before every trip. A trusted person follows your position in real time.' },
      { type: 'rule', icon: '🆘', text: 'Set up SOS mode with your contacts. One tap triggers a triple alert (push, SMS, call).' },
      { type: 'rule', icon: '📱', text: 'Take a photo of the licence plate and send it to someone before getting in.' },
      { type: 'rule', icon: '🎒', text: 'Keep your bag accessible (on your lap or at your feet), never in the boot.' },
      { type: 'sub', title: 'Country tips' },
      { type: 'rule', icon: '🏔️', text: 'The north (Hunza, Gilgit-Baltistan) is safe and the locals are remarkably hospitable.' },
      { type: 'rule', icon: '📋', text: 'Check your foreign ministry\'s security advisories before travelling. Some areas are not recommended.' },
      { type: 'sub', title: 'Emergency numbers' },
      { type: 'kv', items: [{ k: 'Emergency', v: '15' }] },
    ]},
    women: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'Pakistan is conservative. Shalwar kameez recommended. Travelling as a duo with a man is strongly recommended. Hunza is more open.' },
      { type: 'rule', icon: '👕', text: 'Shalwar kameez + dupatta strongly recommended.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Urdu is the national language. English is well spoken by the educated. Punjabi and Pashto are regional languages.' },
      { type: 'phrase', items: [
        { local: 'Assalam o alaikum', meaning: 'Peace be upon you' },
        { local: 'Shukriya', meaning: 'Thank you' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Very cheap. Tight budget: 8-15 €/day. Drivers often pay for the meal.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Guesthouses: 3-10 €. Families very often invite you into their homes. In Hunza, homestays are the norm.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Natco', detail: 'KKH bus (Islamabad-Hunza)', price: '3-15 €' },
        { emoji: '🚛', name: 'Jingle trucks', detail: 'Superbly decorated trucks, slow but cultural', price: 'Often free' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Feb', level: 'ok' }, { name: 'Mar', level: 'good' },
        { name: 'Apr', level: 'great' }, { name: 'May', level: 'great' }, { name: 'Jun', level: 'good' },
        { name: 'Jul', level: 'ok' }, { name: 'Aug', level: 'ok' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'great' }, { name: 'Nov', level: 'good' }, { name: 'Dec', level: 'ok' },
      ]},
      { type: 'text', text: 'April-May and September-October: ideal for the north. The KKH sometimes closes in winter (Khunjerab 4,693m). The south is scorching in summer.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Chai (milk tea) is offered at all hours. Drivers make 100 km detours to help you. Biryani and naans are institutions. Cricket is the national religion.' },
    ]},
  },
  // ==================== MALAYSIA ====================
  MY: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Hitchhiking is legal in Malaysia. Drivers stop easily, especially for foreigners.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Malaysia is easy for hitchhiking. Malaysians are welcoming and curious. Wait time: 15-30 min. Petronas and Shell stations are the best spots.' },
      { type: 'kv', items: [
        { k: 'Peninsular (KL-Penang)', v: 'Good traffic, easy', color: 'green' },
        { k: 'Borneo (Sabah, Sarawak)', v: 'Harder, less traffic', color: 'amber' },
      ]},
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Malaysia is a safe country for hitchhiking. The peninsula and Sarawak are welcoming towards travellers.' },
      { type: 'sub', title: 'Use SpotHitch for your safety' },
      { type: 'rule', icon: '🛡️', text: 'Activate Guardian Mode before every trip. A trusted person follows your position in real time.' },
      { type: 'rule', icon: '🆘', text: 'Set up SOS mode with your contacts. One tap triggers a triple alert (push, SMS, call).' },
      { type: 'rule', icon: '📱', text: 'Take a photo of the licence plate and send it to someone before getting in.' },
      { type: 'rule', icon: '🎒', text: 'Keep your bag accessible (on your lap or at your feet), never in the boot.' },
      { type: 'sub', title: 'Country tips' },
      { type: 'rule', icon: '🌴', text: 'Peninsular Malaysia and Sarawak (Borneo) are the most welcoming areas for hitching.' },
      { type: 'rule', icon: '🗣️', text: 'English is well spoken in Malaysia. Communication with drivers is easy.' },
      { type: 'sub', title: 'Emergency numbers' },
      { type: 'kv', items: [{ k: 'Emergency', v: '999' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Safe for women. Multicultural and respectful society. Modest clothing in Malay/Muslim areas.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Bahasa Melayu is official. English is very widespread (former British colony). Mandarin and Tamil also spoken.' },
      { type: 'phrase', items: [
        { local: 'Terima kasih', meaning: 'Thank you' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Cheap. Tight budget: 15-25 €/day. Nasi lemak: 1-2 €.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Hostels and guesthouses: 5-15 €. Camping in national parks (Taman Negara, Kinabalu).' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Express bus', detail: 'Extensive and cheap network', price: '3-15 €' },
        { emoji: '✈️', name: 'AirAsia', detail: 'Reference low-cost in Asia, KL hub', price: '15-50 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'good' }, { name: 'Feb', level: 'great' }, { name: 'Mar', level: 'great' },
        { name: 'Apr', level: 'good' }, { name: 'May', level: 'good' }, { name: 'Jun', level: 'good' },
        { name: 'Jul', level: 'great' }, { name: 'Aug', level: 'great' }, { name: 'Sep', level: 'good' },
        { name: 'Oct', level: 'ok' }, { name: 'Nov', level: 'ok' }, { name: 'Dec', level: 'ok' },
      ]},
      { type: 'text', text: 'Tropical year-round (28-33°C). East coast: monsoon November-February. West coast doable year-round.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Melting pot: mosques, Chinese temples, Hindu temples coexist. Food is the social glue: mamak, hawker centres. Teh tarik (pulled tea) is the national art.' },
    ]},
  },
  // ==================== TAIWAN ====================
  TW: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Hitchhiking is legal in Taiwan. Taiwanese are extremely welcoming and stop easily for foreigners.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Taiwan is excellent for hitchhiking. Taiwanese are curious and love to help. Wait time: 10-20 min. The country is small (395 km) and drivers make detours to help you.' },
      { type: 'text', text: 'The east coast (Taroko Gorge, Hualien, Taitung) is the most scenic. Rest areas on motorways are the best spots.' },
      { type: 'tip', text: '💡 Taiwanese often invite you to eat, visit and sleep at their home. Offer a gift from your country.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Taiwan is a very safe country for hitchhiking. Taiwanese are extremely welcoming and love helping travellers.' },
      { type: 'sub', title: 'Use SpotHitch for your safety' },
      { type: 'rule', icon: '🛡️', text: 'Activate Guardian Mode before every trip. A trusted person follows your position in real time.' },
      { type: 'rule', icon: '🆘', text: 'Set up SOS mode with your contacts. One tap triggers a triple alert (push, SMS, call).' },
      { type: 'rule', icon: '📱', text: 'Take a photo of the licence plate and send it to someone before getting in.' },
      { type: 'rule', icon: '🎒', text: 'Keep your bag accessible (on your lap or at your feet), never in the boot.' },
      { type: 'sub', title: 'Country tips' },
      { type: 'rule', icon: '🤝', text: 'Taiwanese are extremely welcoming. They often make detours to help you.' },
      { type: 'rule', icon: '🏪', text: 'Konbinis (7-Eleven, FamilyMart) are everywhere and perfect for resting or charging your phone.' },
      { type: 'sub', title: 'Emergency numbers' },
      { type: 'kv', items: [{ k: 'Police', v: '110' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Very safe for women. Progressive society (first legal same-sex marriage in Asia, 2019).' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Mandarin (traditional characters). English limited outside Taipei. Google Translate useful.' },
      { type: 'phrase', items: [
        { local: 'Ni hao', meaning: 'Hello' },
        { local: 'Xiexie', meaning: 'Thank you' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Moderately expensive. Tight budget: 20-35 €/day. Night markets: meals 2-4 €.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Hostels: 10-20 €. Camping in the mountains. Temples sometimes host travellers.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚄', name: 'THSR (high-speed)', detail: 'Taipei-Kaohsiung in 1h30', price: '15-40 €' },
        { emoji: '🚂', name: 'TRA', detail: 'Local train, beautiful east coast', price: '3-15 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'ok' }, { name: 'Feb', level: 'ok' }, { name: 'Mar', level: 'good' },
        { name: 'Apr', level: 'great' }, { name: 'May', level: 'great' }, { name: 'Jun', level: 'ok' },
        { name: 'Jul', level: 'bad' }, { name: 'Aug', level: 'bad' }, { name: 'Sep', level: 'ok' },
        { name: 'Oct', level: 'great' }, { name: 'Nov', level: 'great' }, { name: 'Dec', level: 'good' },
      ]},
      { type: 'text', text: 'April-May and October-November: ideal. Typhoons July-September. Mild winter (15-20°C).' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Night markets among the best in the world. Bubble tea was invented here. Spectacular temples. People among the kindest in Asia.' },
    ]},
  },
  // ==================== LEBANON ====================
  LB: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Hitchhiking is legal in Lebanon. The service (shared taxi) is the main transport. Raising your hand stops cars.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Lebanon is small (170 km) and easy for hitchhiking. Lebanese are extremely welcoming. Wait time: 5-15 min. The service (shared taxi) is so cheap that free hitchhiking is a luxury.' },
      { type: 'rule', icon: '💰', text: 'Many cars that stop are services (shared taxis). Clarify if it is free.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Check the security situation before travelling to Lebanon. Tourist areas (Beirut, Byblos, Baalbek) are generally safe.' },
      { type: 'sub', title: 'Use SpotHitch for your safety' },
      { type: 'rule', icon: '🛡️', text: 'Activate Guardian Mode before every trip. A trusted person follows your position in real time.' },
      { type: 'rule', icon: '🆘', text: 'Set up SOS mode with your contacts. One tap triggers a triple alert (push, SMS, call).' },
      { type: 'rule', icon: '📱', text: 'Take a photo of the licence plate and send it to someone before getting in.' },
      { type: 'rule', icon: '🎒', text: 'Keep your bag accessible (on your lap or at your feet), never in the boot.' },
      { type: 'sub', title: 'Country tips' },
      { type: 'rule', icon: '📋', text: 'Check the security situation before any trip. The situation changes regularly.' },
      { type: 'rule', icon: '🤝', text: 'Lebanese are hospitable and multilingual. Communication is easy.' },
      { type: 'sub', title: 'Emergency numbers' },
      { type: 'kv', items: [{ k: 'Emergency', v: '112' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Lebanon is the most liberal country in the Levant. Beirut is cosmopolitan. Harassment is less intense than in neighbouring countries.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Lebanese Arabic, French very widespread, English too. Many speak 3 languages.' },
      { type: 'phrase', items: [
        { local: 'Kifak/Kifik?', meaning: 'How are you?' },
        { local: 'Merci ktir', meaning: 'Thank you very much' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Economic crisis. Tight budget in dollars: 15-30 €/day. Street shawarma: $1-2.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Hostels: $10-20. Camping in the mountains (Qadisha, Cedars). Lebanese easily invite you.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚐', name: 'Service / Van', detail: 'Shared taxis, main transport', price: '$0.50-3' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'ok' }, { name: 'Feb', level: 'ok' }, { name: 'Mar', level: 'good' },
        { name: 'Apr', level: 'great' }, { name: 'May', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'good' }, { name: 'Aug', level: 'good' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'great' }, { name: 'Nov', level: 'good' }, { name: 'Dec', level: 'ok' },
      ]},
      { type: 'text', text: 'April-June and September-November: ideal. Skiing in the morning, beach in the afternoon (Lebanese proverb).' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Mosques and churches side by side. Lebanese cuisine among the best in the world (mezze, tabbouleh, hummus). Nightlife in Beirut. Coffee and hookah are institutions.' },
    ]},
  },
  // ==================== PANAMA ====================
  PA: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Hitchhiking is legal in Panama. Common practice in rural areas. Transit hub between the Americas.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Panama is doable by hitchhiking. The Pan-American Highway crosses the country with good traffic. Wait time: 15-30 min.' },
      { type: 'warn', text: '⚠️ The Darien Gap is a roadless jungle between Panama and Colombia. Passage by boat or plane only.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Panama is a safe country for hitchhiking. Petrol stations along the Pan-American Highway are good spots to find a ride.' },
      { type: 'sub', title: 'Use SpotHitch for your safety' },
      { type: 'rule', icon: '🛡️', text: 'Activate Guardian Mode before every trip. A trusted person follows your position in real time.' },
      { type: 'rule', icon: '🆘', text: 'Set up SOS mode with your contacts. One tap triggers a triple alert (push, SMS, call).' },
      { type: 'rule', icon: '📱', text: 'Take a photo of the licence plate and send it to someone before getting in.' },
      { type: 'rule', icon: '🎒', text: 'Keep your bag accessible (on your lap or at your feet), never in the boot.' },
      { type: 'sub', title: 'Country tips' },
      { type: 'rule', icon: '⛽', text: 'Petrol stations along the Pan-American Highway are the best spots for hitching.' },
      { type: 'rule', icon: '🌴', text: 'Tourist areas (Bocas del Toro, Boquete, San Blas) are safe and welcoming.' },
      { type: 'sub', title: 'Emergency numbers' },
      { type: 'kv', items: [{ k: 'Emergency', v: '911' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Moderately safe for women. Tourist areas are safe.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Spanish main language. English fairly widespread (American influence from the canal).' },
      { type: 'phrase', items: [
        { local: '¿Me da un ride?', meaning: 'Will you give me a ride?' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'US dollar. More expensive than neighbours. Tight budget: $20-35/day.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Hostels in Bocas del Toro and Boquete: $8-15. Camping on the San Blas islands.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Bus', detail: 'Extensive network', price: '$2-15' },
        { emoji: '⛴️', name: 'Sailboat to Colombia', detail: '5 days via San Blas', price: '$350-500' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'great' }, { name: 'Feb', level: 'great' }, { name: 'Mar', level: 'great' },
        { name: 'Apr', level: 'good' }, { name: 'May', level: 'ok' }, { name: 'Jun', level: 'ok' },
        { name: 'Jul', level: 'ok' }, { name: 'Aug', level: 'ok' }, { name: 'Sep', level: 'bad' },
        { name: 'Oct', level: 'bad' }, { name: 'Nov', level: 'ok' }, { name: 'Dec', level: 'great' },
      ]},
      { type: 'text', text: 'December-April: dry season. May-November: afternoon rains.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'The Panama Canal is an engineering marvel. The Kuna live on paradise islands (San Blas) with their own government. Ceviche and rum are the pillars of the cuisine.' },
    ]},
  },
  // ==================== GHANA ====================
  GH: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Informal transport (tro-tros) is the main mode. Free hitchhiking is possible but paid transport is the norm.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Ghana is one of the most welcoming countries in West Africa. Tro-tros are ubiquitous and very cheap. Free hitchhiking works with trucks and pickups in rural areas.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Ghana is a safe and stable country for hitchhiking. Petrol stations are good spots to meet drivers.' },
      { type: 'sub', title: 'Use SpotHitch for your safety' },
      { type: 'rule', icon: '🛡️', text: 'Activate Guardian Mode before every trip. A trusted person follows your position in real time.' },
      { type: 'rule', icon: '🆘', text: 'Set up SOS mode with your contacts. One tap triggers a triple alert (push, SMS, call).' },
      { type: 'rule', icon: '📱', text: 'Take a photo of the licence plate and send it to someone before getting in.' },
      { type: 'rule', icon: '🎒', text: 'Keep your bag accessible (on your lap or at your feet), never in the boot.' },
      { type: 'sub', title: 'Country tips' },
      { type: 'rule', icon: '⛽', text: 'Petrol stations are reliable spots to find a ride safely.' },
      { type: 'rule', icon: '🌍', text: 'Ghana is one of the most stable countries in Africa. Ghanaians are welcoming and curious.' },
      { type: 'sub', title: 'Emergency numbers' },
      { type: 'kv', items: [{ k: 'Police', v: '191' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Relatively safe for women. Respectful society.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'English official and widely spoken. Twi (Akan) is the main local language.' },
      { type: 'phrase', items: [
        { local: 'Akwaaba', meaning: 'Welcome (Twi)' },
        { local: 'Medaase', meaning: 'Thank you (Twi)' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Moderately expensive for Africa. Tight budget: 15-25 €/day. Jollof rice: 1-3 €.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Guesthouses: 5-15 €. Camping possible on Cape Coast beaches.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚐', name: 'Tro-tro', detail: 'Ubiquitous minibuses, cheap', price: '0.50-3 €' },
        { emoji: '🚌', name: 'STC / VIP Bus', detail: 'More comfortable', price: '3-10 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'great' }, { name: 'Feb', level: 'great' }, { name: 'Mar', level: 'good' },
        { name: 'Apr', level: 'ok' }, { name: 'May', level: 'ok' }, { name: 'Jun', level: 'bad' },
        { name: 'Jul', level: 'ok' }, { name: 'Aug', level: 'ok' }, { name: 'Sep', level: 'ok' },
        { name: 'Oct', level: 'ok' }, { name: 'Nov', level: 'great' }, { name: 'Dec', level: 'great' },
      ]},
      { type: 'text', text: 'November-March: dry season, ideal. May-June: main rainy season.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: '"Door of Return" for the African diaspora (Cape Coast Castle). Jollof rice is a national pride. Kente cloth is the traditional fabric. Stable democracy.' },
    ]},
  },
  // ==================== UGANDA ====================
  UG: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Informal transport (boda-bodas, matatus) is ubiquitous. Free hitchhiking works with trucks.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: '"The Pearl of Africa" is welcoming. Trucks on main roads take passengers. Boda-bodas are everywhere but dangerous.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Uganda is a safe country for hitchhiking. Drivers are welcoming and Total petrol stations are good spots.' },
      { type: 'sub', title: 'Use SpotHitch for your safety' },
      { type: 'rule', icon: '🛡️', text: 'Activate Guardian Mode before every trip. A trusted person follows your position in real time.' },
      { type: 'rule', icon: '🆘', text: 'Set up SOS mode with your contacts. One tap triggers a triple alert (push, SMS, call).' },
      { type: 'rule', icon: '📱', text: 'Take a photo of the licence plate and send it to someone before getting in.' },
      { type: 'rule', icon: '🎒', text: 'Keep your bag accessible (on your lap or at your feet), never in the boot.' },
      { type: 'sub', title: 'Country tips' },
      { type: 'rule', icon: '⛽', text: 'Total petrol stations are well spread out and make excellent spots for hitching.' },
      { type: 'rule', icon: '🤝', text: 'Ugandans are welcoming and curious. A smile and a few words are enough to make contact.' },
      { type: 'sub', title: 'Emergency numbers' },
      { type: 'kv', items: [{ k: 'Emergency', v: '999' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Moderately safe. Tourist areas are safe. Modest clothing in rural areas.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'English and Swahili are official. English well spoken. Luganda is the main local language.' },
      { type: 'phrase', items: [
        { local: 'Oli otya?', meaning: 'How are you? (Luganda)' },
        { local: 'Webale', meaning: 'Thank you' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Cheap (except gorillas: $700/permit). Tight budget: 15-25 €/day. The rolex (chapati+omelette): 0.50 €.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Guesthouses: 5-15 €. Camping in national parks (organised and safe).' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🏍️', name: 'Boda-boda', detail: 'Ubiquitous motorbike taxis, fast but dangerous', price: '0.30-3 €' },
        { emoji: '🚐', name: 'Matatu', detail: 'Minibuses between cities', price: '2-8 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'great' }, { name: 'Feb', level: 'great' }, { name: 'Mar', level: 'ok' },
        { name: 'Apr', level: 'bad' }, { name: 'May', level: 'bad' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Aug', level: 'great' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'ok' }, { name: 'Nov', level: 'bad' }, { name: 'Dec', level: 'good' },
      ]},
      { type: 'text', text: 'June-September and December-February: dry seasons.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: '"The Pearl of Africa" (Churchill). Mountain gorillas (Bwindi), chimpanzees (Kibale), source of the Nile (Jinja).' },
    ]},
  },
  // ==================== RWANDA ====================
  RW: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Hitchhiking is not traditional but the country is small and very well organised. Motorbike taxis and buses are the main transport.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'The cleanest and most organised country in Africa. Small (26,000 km²) and can be crossed in a few hours. Motorbike taxis are ubiquitous and cheap.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Rwanda is a very safe country for hitchhiking. It is one of the cleanest and most organised countries in Africa, with roads in good condition.' },
      { type: 'sub', title: 'Use SpotHitch for your safety' },
      { type: 'rule', icon: '🛡️', text: 'Activate Guardian Mode before every trip. A trusted person follows your position in real time.' },
      { type: 'rule', icon: '🆘', text: 'Set up SOS mode with your contacts. One tap triggers a triple alert (push, SMS, call).' },
      { type: 'rule', icon: '📱', text: 'Take a photo of the licence plate and send it to someone before getting in.' },
      { type: 'rule', icon: '🎒', text: 'Keep your bag accessible (on your lap or at your feet), never in the boot.' },
      { type: 'sub', title: 'Country tips' },
      { type: 'rule', icon: '🛣️', text: 'Rwandan roads are among the best in East Africa. The road network is well maintained.' },
      { type: 'rule', icon: '🌿', text: 'The country is nicknamed "the land of a thousand hills". The scenery is stunning and safety is excellent.' },
      { type: 'sub', title: 'Emergency numbers' },
      { type: 'kv', items: [{ k: 'Emergency', v: '112' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Safe for women. Highest rate of women in parliament in the world (>60%).' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Kinyarwanda, French and English are official. All three are used.' },
      { type: 'phrase', items: [
        { local: 'Muraho', meaning: 'Hello' },
        { local: 'Murakoze', meaning: 'Thank you' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Moderately expensive. Tight budget: 20-30 €/day. Gorillas: $1,500/permit.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Guesthouses: 10-20 €. Growing hostel scene in Kigali.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🏍️', name: 'Motorbike taxi', detail: 'Main transport, helmets mandatory', price: '0.30-2 €' },
        { emoji: '🚌', name: 'Bus', detail: 'Modern buses between cities', price: '2-8 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'great' }, { name: 'Feb', level: 'great' }, { name: 'Mar', level: 'ok' },
        { name: 'Apr', level: 'bad' }, { name: 'May', level: 'bad' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Aug', level: 'great' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'ok' }, { name: 'Nov', level: 'bad' }, { name: 'Dec', level: 'good' },
      ]},
      { type: 'text', text: 'June-September and December-February: dry seasons. Temperate climate year-round (20-27°C).' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Remarkable transformation since 1994. Plastic bags banned since 2008. Umuganda (monthly community work). Gorillas (Volcanoes NP). Excellent coffee.' },
    ]},
  },
  // ==================== MALAWI ====================
  MW: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Hitchhiking is legal. "The warm heart of Africa": exceptional welcome.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'One of the best countries in Africa for hitchhiking. Malawians are extraordinarily welcoming. Wait time: 15-30 min. Trucks and pickups stop easily.' },
      { type: 'text', text: 'Lake Malawi (3rd largest in Africa) is the main attraction.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Malawi is a safe and welcoming country for hitchhiking. Nicknamed "the warm heart of Africa", the locals are remarkably kind.' },
      { type: 'sub', title: 'Use SpotHitch for your safety' },
      { type: 'rule', icon: '🛡️', text: 'Activate Guardian Mode before every trip. A trusted person follows your position in real time.' },
      { type: 'rule', icon: '🆘', text: 'Set up SOS mode with your contacts. One tap triggers a triple alert (push, SMS, call).' },
      { type: 'rule', icon: '📱', text: 'Take a photo of the licence plate and send it to someone before getting in.' },
      { type: 'rule', icon: '🎒', text: 'Keep your bag accessible (on your lap or at your feet), never in the boot.' },
      { type: 'sub', title: 'Country tips' },
      { type: 'rule', icon: '🤝', text: 'Malawians are known for their warm welcome. Making contact comes naturally.' },
      { type: 'rule', icon: '🌊', text: 'Lake Malawi is the jewel of the country. The roads along it are pleasant and well travelled.' },
      { type: 'sub', title: 'Emergency numbers' },
      { type: 'kv', items: [{ k: 'Police', v: '990' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Safe for women. "The warm heart of Africa" applies to everyone.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'English and Chichewa are official. English well spoken.' },
      { type: 'phrase', items: [
        { local: 'Moni', meaning: 'Hello' },
        { local: 'Zikomo', meaning: 'Thank you' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Very cheap. Tight budget: 10-20 €/day. Nsima with relish: < 1 €.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Lodges and guesthouses: 5-15 €. Camping on Lake Malawi beaches: beautiful.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚐', name: 'Minibus', detail: 'Main transport, waits to be full', price: '1-5 €' },
        { emoji: '⛴️', name: 'Ilala Ferry', detail: 'Legendary ferry on the lake (3 days)', price: '5-20 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mar', level: 'ok' },
        { name: 'Apr', level: 'good' }, { name: 'May', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Aug', level: 'great' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'great' }, { name: 'Nov', level: 'good' }, { name: 'Dec', level: 'ok' },
      ]},
      { type: 'text', text: 'May-October: dry season, ideal. Lake swimmable year-round (24-28°C).' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: '"The warm heart of Africa" is not an empty slogan. Lake Malawi = freshwater paradise. Gule Wamkulu (Chewa mask dance, UNESCO).' },
    ]},
  },
}
