/**
 * Enriched guide sections (v17) — German translation
 * Data verified from 200+ sources across FR/EN/DE/NL/ES
 * Rule: only included if confirmed by 3+ independent sources
 * If insufficient data → section omitted (displayed as "no data" in UI)
 */

export const guideSectionsData = {
  // ==================== FRANCE ====================
  FR: {
    laws: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'Trampen ist in Frankreich legal. Das Verbot betrifft die Autobahnen selbst (Fahrbahnen, Standstreifen, Auffahrten). Rastplätze, Mautstellen und Tankstellen sind erlaubt.' },
      { type: 'sub', title: 'Wo es erlaubt ist' },
      { type: 'rule', icon: '✅', text: 'Mautstellen: der klassische französische Spot. Die Autos bremsen ab und du kannst mit den Fahrern sprechen.' },
      { type: 'rule', icon: '✅', text: 'Autobahn-Tankstellen (Raststätten)' },
      { type: 'rule', icon: '✅', text: 'Stadtausgänge, Kreisverkehre vor den Autobahnen' },
      { type: 'rule', icon: '✅', text: 'National- und Departementstraßen (RN, RD)' },
      { type: 'sub', title: 'Wo es verboten ist' },
      { type: 'rule', icon: '🚫', text: 'Auf den Autobahn-Fahrbahnen (A1, A6, A7...)' },
      { type: 'rule', icon: '🚫', text: 'Auf den Auffahrten' },
      { type: 'rule', icon: '🚫', text: 'Auf dem Standstreifen' },
      { type: 'sub', title: 'Bußgelder' },
      { type: 'text', text: 'Theoretisch 11 bis 40 € Bußgeld, aber Bestrafung sehr selten (~5% der Fälle). In der Praxis bringt dich die Polizei zu einem erlaubten Standort. Manche Gendarmen sind nett und halten sogar für dich an.' },
      { type: 'tip', text: '💡 In der Bretagne sind die Autobahnen kostenlos (keine Mautstellen). Nutze Tankstellen oder Stadtausgänge.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Frankreich ist ein einfaches Land zum Trampen. Durchschnittliche Wartezeit: 30-45 Min im Sommer, bis zu 1 Std im Winter. Die Mautstellen-Technik ist extrem effektiv: du arbeitest dich von Schranke zu Schranke vor.' },
      { type: 'sub', title: 'Die Mautstellen-Technik' },
      { type: 'text', text: 'Die Königsmethode in Frankreich. Stelle dich auf die Ausfahrtseite der Mautstelle mit einem Schild zur nächsten Stadt oder Raststätte. Die Autos fahren im Schritttempo, du kannst mit den Fahrern sprechen. Frag direkt: "Fahren Sie Richtung Lyon?" Das ist effektiver als mit dem Daumen zu warten.' },
      { type: 'sub', title: 'Tankstellen' },
      { type: 'text', text: 'Autobahn-Tankstellen sind die zweitbesten Spots. Kauf einen kleinen Kaffee, um Kunde zu werden, falls das Personal dich wegschicken will. Du kannst die Fahrer dort direkt ansprechen.' },
      { type: 'sub', title: 'Kennzeichen-Trick' },
      { type: 'text', text: 'Die letzten zwei Ziffern des Kennzeichens zeigen das Zulassungsdepartement: 75 = Paris, 13 = Marseille, 69 = Lyon, 33 = Bordeaux, 31 = Toulouse. Seit 2009 weniger zuverlässig (freie Nummernwahl), aber immer noch nützlich.' },
      { type: 'sub', title: 'Zu meidende Zonen' },
      { type: 'kv', items: [
        { k: 'Île-de-France', v: 'Sehr schwierig am Stadtrand von Paris', color: 'red' },
        { k: 'Périphérique / A86', v: 'Unmöglich, zu viel Verkehr', color: 'red' },
      ]},
      { type: 'tip', text: '💡 Fahrer bieten oft Geld (5-60 €) oder Mahlzeiten an. Sonntags fahren nur Tiefkühl-LKW.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Frankreich ist ein sicheres Land zum Trampen. Die Tramper-Kultur ist seit den 90ern zurückgegangen, wird aber immer noch gut akzeptiert, besonders auf dem Land und im Süden.' },
      { type: 'sub', title: 'Grundregeln' },
      { type: 'rule', icon: '📱', text: 'Fotografiere das Kennzeichen und sende es an eine Vertrauensperson, bevor du einsteigst.' },
      { type: 'rule', icon: '🎒', text: 'Behalte dein Gepäck griffbereit, nicht im Kofferraum.' },
      { type: 'rule', icon: '🌙', text: 'Vermeide nachts auf einsamen Straßen zu trampen.' },
      { type: 'sub', title: 'Notrufnummern' },
      { type: 'kv', items: [
        { k: 'SAMU (medizinischer Notfall)', v: '15' },
        { k: 'Polizei', v: '17' },
        { k: 'Feuerwehr', v: '18' },
        { k: 'Europäische Notrufnummer', v: '112' },
      ]},
      { type: 'info', text: '📍 Aktiviere den SpotHitch Begleitmodus, um deinen Standort in Echtzeit zu teilen.' },
    ]},
    women: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'Frankreich ist für allein trampende Frauen generell sicher, besonders im Süden und in ländlichen Gebieten. Frauen werden schneller mitgenommen als Männer. Erfahrene Reisende bestätigen wenige Zwischenfälle.' },
      { type: 'rule', icon: '👨‍👩‍👧', text: 'Bevorzuge Autos mit Paaren, Familien oder weiblichen Fahrerinnen.' },
      { type: 'rule', icon: '📍', text: 'Erwähne, dass jemand weiß, wo du bist.' },
      { type: 'rule', icon: '🚗', text: 'Meide Autos mit mehreren Männern, wenn du allein bist.' },
      { type: 'text', text: 'Mautstellen sind die sichersten Spots: gut beleuchtet, mit Durchgangsverkehr, und du kannst den Fahrer vor dem Einsteigen einschätzen.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Französisch ist unerlässlich. Die meisten Franzosen sprechen wenig Englisch, besonders auf dem Land. Ein paar Worte Französisch ändern alles: die Fahrer schätzen die Mühe.' },
      { type: 'phrase', items: [
        { local: 'Bonjour, vous allez vers... ?', meaning: 'Um Fahrer anzusprechen' },
        { local: 'Je fais du stop', meaning: 'Ich trampe' },
        { local: 'Merci beaucoup, bonne route !', meaning: 'Beim Aussteigen' },
        { local: 'Je peux descendre ici', meaning: 'Ich kann hier aussteigen' },
      ]},
      { type: 'tip', text: '💡 Kostenlose Straßenkarten sind manchmal an Mautstellen erhältlich. Eine Papierkarte ist nützlich bei leerem Akku.' },
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Durchschnittliches Budget: 20-40 €/Tag. Sparsam möglich mit 10-15 €/Tag durch Wildcampen und Supermarkt-Einkäufe. Fahrer spendieren oft das Essen.' },
      { type: 'kv', items: [
        { k: 'Jugendherberge', v: '15-30 €/Nacht' },
        { k: 'Kommunaler Campingplatz', v: '5-12 €/Nacht' },
        { k: 'Baguette + Käse', v: '2-3 €' },
        { k: 'Tagesmenü Restaurant', v: '12-15 €' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wildcampen ist in Frankreich technisch verboten, aber in den Bergen und auf dem Land geduldet, wenn du unauffällig bist, abseits von Häusern, und früh aufbrichst. Strikt verboten an der Küste, in Nationalparks und weniger als 200m von einer Wasserquelle.' },
      { type: 'rule', icon: '⛺', text: 'Kommunale Campingplätze: 5-12 €/Nacht, oft gut gelegen.' },
      { type: 'rule', icon: '🏠', text: 'Warmshowers (Radtouristen) und Couchsurfing sind in Frankreich aktiv.' },
      { type: 'rule', icon: '🌿', text: 'Biwak in den Bergen geduldet: nach 19 Uhr aufbauen, vor 9 Uhr abbauen.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚄', name: 'TGV', detail: 'Schnelles aber teures Netz. Frühzeitig buchen für günstige Preise.', price: '10-120 €' },
        { emoji: '🚌', name: 'FlixBus / BlaBlaBus', detail: 'Günstige Fernverbindungen', price: '5-30 €' },
        { emoji: '🚗', name: 'BlaBlaCar', detail: 'Sehr beliebte Mitfahrgelegenheit in Frankreich, oft 50% günstiger als der Zug', price: '5-40 €' },
        { emoji: '🚃', name: 'TER', detail: 'Regionalzüge, Wochenend-Ermäßigungen in manchen Regionen', price: '5-25 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mär', level: 'ok' },
        { name: 'Apr', level: 'good' }, { name: 'Mai', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Aug', level: 'great' }, { name: 'Sep', level: 'great' },
        { name: 'Okt', level: 'good' }, { name: 'Nov', level: 'ok' }, { name: 'Dez', level: 'bad' },
      ]},
      { type: 'text', text: 'Mai bis September: ideal. Der Sommer ist Hochsaison mit viel Urlaubsverkehr. Der Süden (Provence, Côte d\'Azur) ist fast das ganze Jahr über befahrbar. Der Winter in den Bergen ist nicht empfehlenswert.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Die Tramper-Kultur in Frankreich hat eine lange Geschichte. Die Rucksacktouristen der 70er und 80er Jahre haben die Praxis populär gemacht. Heute ist es weniger verbreitet, aber gut akzeptiert. Franzosen sind neugierig und plaudern gern während der Fahrt. Die gemeinsame Mahlzeit ist ein wichtiger Moment der Geselligkeit.' },
      { type: 'event', items: [
        { month: 'Jun', day: '21', name: 'Fête de la Musique', desc: 'Kostenlose Konzerte überall. Festliche Stimmung, viel Verkehr.' },
        { month: 'Jul', day: '14', name: 'Nationalfeiertag', desc: 'Feuerwerk überall. Starker Verkehr am Wochenende.' },
        { month: 'Jul-Aug', day: '⟳', name: 'Grands départs', desc: 'Reisewellen auf den Autobahnen. Viel Verkehr = mehr Chancen.' },
      ]},
    ]},
  },
  // ==================== GERMANY ====================
  DE: {
    laws: {
      filterTypes: ['q', 'c', 'a'],
      blocks: [
        { type: 'text', text: 'Trampen ist in Deutschland legal. Das einzige Verbot betrifft die Autobahn selbst (Fahrbahnen und Standstreifen) sowie Kraftfahrstraßen.' },
        { type: 'sub', title: 'Wo es erlaubt ist' },
        { type: 'rule', icon: '✅', text: 'Raststätten (Tankstellen direkt an der Autobahn)' },
        { type: 'rule', icon: '✅', text: 'Autohöfe (Tankstellen in Autobahnnähe, aber außerhalb)' },
        { type: 'rule', icon: '✅', text: 'Auffahrten vor dem blauen Autobahnschild' },
        { type: 'rule', icon: '✅', text: 'Rote Ampeln an Autobahnzufahrten in Städten' },
        { type: 'sub', title: 'Wo es verboten ist' },
        { type: 'rule', icon: '🚫', text: 'Auf den Autobahn-Fahrbahnen (die Polizei kommt innerhalb von Minuten)' },
        { type: 'rule', icon: '🚫', text: 'Auf dem Standstreifen' },
        { type: 'rule', icon: '🚫', text: 'Auf Kraftfahrstraßen' },
        { type: 'sub', title: 'Bußgelder' },
        { type: 'text', text: '20 bis 50 € Bußgeld, wenn du auf der Autobahn erwischt wirst. In der Praxis bringt dich die Polizei einfach zu einem erlaubten Standort. Unwissenheit vortäuschen funktioniert oft.' },
        { type: 'sub', title: 'Tankstellen' },
        { type: 'text', text: 'Raststätten sind technisch Privatgelände. Das Personal kann dich bitten zu gehen, aber in der Praxis ist das selten. Wenn es passiert, geh zum Parkplatz.' },
        { type: 'tip', text: '💡 LKW dürfen sonntags und an Feiertagen vor 22 Uhr nicht fahren. Der Verkehr ist an diesen Tagen deutlich geringer.' },
      ],
    },
    hitchhiking: {
      filterTypes: ['q', 'c', 'b'],
      blocks: [
        { type: 'text', text: 'Deutschland ist eines der besten Länder Europas zum Trampen. Die durchschnittliche Wartezeit beträgt etwa 15 Minuten. Wenn du Fahrer an Tankstellen ansprichst, reicht es oft, 1 bis 3 Personen zu fragen, um eine Mitfahrgelegenheit zu finden.' },
        { type: 'sub', title: 'Die besten Spot-Arten' },
        { type: 'rule', icon: '🥇', text: 'Raststätten (Tankstellen an der Autobahn). Fahrer direkt beim Tanken ansprechen ist die effektivste Methode.' },
        { type: 'rule', icon: '🥈', text: 'Autobahnauffahrten. Stelle dich vor das blaue Autobahnschild.' },
        { type: 'rule', icon: '🥉', text: 'Rote Ampeln in der Stadt zur Autobahnauffahrt. Du kannst durch die Scheibe mit den Fahrern sprechen.' },
        { type: 'sub', title: 'Geschwindigkeit und Entfernungen' },
        { type: 'text', text: 'Kein Tempolimit auf vielen Autobahnabschnitten. Es ist möglich, mehr als 1000 km pro Tag zu schaffen, indem man von Raststätte zu Raststätte fährt. Geschätzte Durchschnittsgeschwindigkeit: 50 km/h im Sommer, 40 km/h im Winter.' },
        { type: 'sub', title: 'Zu meidende Zonen' },
        { type: 'kv', items: [
          { k: 'Ruhrgebiet (Dortmund, Essen, Duisburg)', v: 'Sehr schwierig', color: 'red' },
          { k: 'Bayern und Baden-Württemberg', v: 'Mehr Polizeikontrollen', color: 'amber' },
        ]},
        { type: 'sub', title: 'Kennzeichen-Trick' },
        { type: 'text', text: 'Deutsche Kennzeichen beginnen mit der Stadtabkürzung (B = Berlin, HH = Hamburg, M = München). Das kann helfen, die Fahrtrichtung zu erraten, aber seit die Kennzeichenmitnahme bei Umzug möglich ist, ist es weniger zuverlässig.' },
        { type: 'tip', text: '💡 Ein humorvolles Schild (z.B. "Tokyo") wirkt als Eisbrecher. Deutsche schätzen Humor.' },
      ],
    },
    safety: {
      filterTypes: ['c', 'a'],
      blocks: [
        { type: 'text', text: 'Deutschland ist ein sicheres Land zum Trampen. Kriminelle Vorfälle beim Trampen sind extrem selten.' },
        { type: 'sub', title: 'Grundregeln' },
        { type: 'rule', icon: '📱', text: 'Fotografiere das Kennzeichen und sende es an eine Vertrauensperson, bevor du einsteigst.' },
        { type: 'rule', icon: '🎒', text: 'Behalte dein Gepäck griffbereit, nicht im Kofferraum.' },
        { type: 'rule', icon: '🌙', text: 'Vermeide nachts zu trampen.' },
        { type: 'rule', icon: '🚪', text: 'Prüfe, ob die Kindersicherung der hinteren Türen nicht aktiviert ist.' },
        { type: 'sub', title: 'Notrufnummern' },
        { type: 'kv', items: [
          { k: 'Notfall / Feuerwehr', v: '112' },
          { k: 'Polizei', v: '110' },
        ]},
        { type: 'info', text: '📍 Aktiviere den SpotHitch Begleitmodus, um deinen Standort in Echtzeit zu teilen.' },
      ],
    },
    women: {
      filterTypes: ['q', 'c', 'a'],
      blocks: [
        { type: 'text', text: 'Deutschland gilt als eines der sichersten Länder Europas für allein trampende Frauen. Mehrere erfahrene Reisende bestätigen dies. Frauen werden in der Regel schneller mitgenommen als Männer.' },
        { type: 'sub', title: 'Tipps' },
        { type: 'rule', icon: '👨‍👩‍👧', text: 'Bevorzuge Fahrten mit Paaren, Familien oder Fahrerinnen.' },
        { type: 'rule', icon: '📍', text: 'Erwähne beiläufig, dass jemand weiß, wo du bist und auf Nachrichten wartet.' },
        { type: 'rule', icon: '👁️', text: 'Vertraue deinem Instinkt. Lehne ohne zu zögern ab, wenn etwas nicht stimmt.' },
        { type: 'rule', icon: '🚗', text: 'Meide Autos mit mehreren Männern, wenn du allein bist.' },
        { type: 'text', text: 'Reisende, die über ein Jahr durch ganz Europa getrampt sind, berichten von kaum negativen Erfahrungen. Deutschland wird regelmäßig unter den sichersten Ländern genannt.' },
      ],
    },
    language: {
      filterTypes: ['c', 'q'],
      blocks: [
        { type: 'text', text: 'Die Amtssprache ist Deutsch. Deutschland steht weltweit auf Platz 4 bei der Englischkompetenz. Viele Fahrer sprechen Englisch, besonders jüngere und in Städten. LKW-Fahrer (oft polnischer oder osteuropäischer Herkunft) sprechen allerdings selten etwas anderes als ihre Sprache und etwas Deutsch.' },
        { type: 'sub', title: 'Nützliche Sätze' },
        { type: 'phrase', items: [
          { local: 'Hallo, ich fahre nach...', meaning: 'Hallo, ich fahre nach...' },
          { local: 'Können Sie mich mitnehmen?', meaning: 'Können Sie mich mitnehmen?' },
          { local: 'Danke für die Mitfahrt!', meaning: 'Danke für die Mitfahrt!' },
          { local: 'Können Sie mich hier rauslassen?', meaning: 'Können Sie mich hier rauslassen?' },
        ]},
        { type: 'tip', text: '💡 Schau dir die Kennzeichen an, um die Sprache des Fahrers zu erraten, und sprich ihn in seiner vermuteten Sprache an.' },
      ],
    },
    budget: {
      filterTypes: ['b', 'q'],
      blocks: [
        { type: 'text', text: 'Backpacker-Budget in Deutschland: etwa 50 bis 70 € pro Tag. Mit Trampen und Übernachtung bei Einheimischen kommt man unter 30 €.' },
        { type: 'sub', title: 'Günstig essen' },
        { type: 'rule', icon: '🌭', text: 'Currywurst oder Döner Kebab: 3 bis 5 €. Das Grundnahrungsmittel des Reisenden in Deutschland.' },
        { type: 'rule', icon: '🥨', text: 'Bäckereien: Brezel + Kaffee für 3 bis 5 €.' },
        { type: 'rule', icon: '🛒', text: 'Lidl (deutsche Kette), Aldi, Netto, Penny: Discounter überall vertreten.' },
        { type: 'rule', icon: '⛽', text: 'Vermeide Tankstellen-Essen (teuer). Bockwurst hat das beste Preis-Leistungs-Verhältnis. Leitungswasser an Raststätten ist kostenlos.' },
        { type: 'sub', title: 'Großzügigkeit der Fahrer' },
        { type: 'text', text: 'Mehrere Reisende berichten, dass deutsche Fahrer darauf bestehen, ein Essen oder einen Tee auszugeben. LKW-Fahrer laden oft zum gemeinsamen Essen ein.' },
        { type: 'tip', text: '💡 Die App Foodsharing.de ermöglicht es, kostenlos Lebensmittel abzuholen, die Supermärkte und Bäckereien wegwerfen wollten.' },
      ],
    },
    sleep: {
      filterTypes: ['b', 'q', 'a'],
      blocks: [
        { type: 'text', text: 'Wildcampen mit Zelt ist in Deutschland verboten. Biwakieren ohne Zelt (Schlafsack auf dem Boden) wird für eine Nacht geduldet, außer in Naturschutzgebieten.' },
        { type: 'sub', title: 'Gesetzliche Ausnahmen' },
        { type: 'rule', icon: '✅', text: 'Brandenburg und Mecklenburg-Vorpommern: Eine Nacht für nicht-motorisierte Reisende erlaubt.' },
        { type: 'rule', icon: '✅', text: 'Schleswig-Holstein: ~20 offizielle Biwakplätze.' },
        { type: 'rule', icon: '✅', text: 'Trekkingplätze: 10-15 €/Nacht, manche kostenlos.' },
        { type: 'sub', title: 'Bußgelder' },
        { type: 'text', text: '10 bis 250 € Bußgeld für illegales Campen. In Schutzgebieten bis zu 2.500 €.' },
        { type: 'sub', title: 'Kostenlose Unterkünfte' },
        { type: 'rule', icon: '🛋️', text: 'TrustRoots: aus der Tramper-Community entstanden, kostenlos. BeWelcome (~120.000 Nutzer), Couchers: ebenfalls kostenlos.' },
        { type: 'rule', icon: '🛏️', text: 'Jugendherbergen (DJH): ~400 in ganz Deutschland, Schlafsaal 20 bis 35 €/Nacht.' },
        { type: 'info', text: '🆘 mokli-help.de listet kostenlose Duschen und Notunterkünfte in deutschen Großstädten.' },
      ],
    },
    transport: {
      filterTypes: ['c', 'b'],
      blocks: [
        { type: 'text', text: 'Deutschland hat ein ausgezeichnetes Netz an öffentlichen Verkehrsmitteln und Mitfahrgelegenheiten.' },
        { type: 'sub', title: 'Zug' },
        { type: 'transport', items: [
          { emoji: '🚄', name: 'Deutschlandticket', detail: 'Unbegrenzter Regionalverkehr im ganzen Land (kein ICE/IC)', price: '63 €/Monat' },
          { emoji: '🚃', name: 'Schönes-Wochenende-Ticket', detail: '5 Personen, Regionalzüge, 1 Wochenendtag', price: '~7 €/Pers.' },
          { emoji: '🚃', name: 'Länder-Ticket', detail: 'Regionalzüge in 1-2 Bundesländern, gültig 9-3 Uhr', price: 'ab 25 €' },
        ]},
        { type: 'sub', title: 'Bus und Mitfahrgelegenheit' },
        { type: 'transport', items: [
          { emoji: '🚌', name: 'FlixBus / FlixTrain', detail: '', price: 'ab 4,99 €' },
          { emoji: '🚗', name: 'BlaBlaCar', detail: '130 Millionen Mitglieder', price: '~5 €/100 km' },
          { emoji: '🤝', name: 'BesserMitfahren.de', detail: 'Kostenlos, ohne Anmeldung', price: 'kostenlos' },
          { emoji: '🤝', name: 'Fahrgemeinschaft.de', detail: 'Vom ADAC betrieben, kostenlos', price: 'kostenlos' },
        ]},
      ],
    },
    season: {
      filterTypes: ['c', 'q'],
      blocks: [
        { type: 'text', text: 'Trampen funktioniert das ganze Jahr in Deutschland, aber der Sommer bietet die besten Bedingungen: längere Tage, mehr Verkehr, größere Tagesstrecken.' },
        { type: 'sub', title: 'Monatsübersicht' },
        { type: 'season', months: [
          { name: 'Jan', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mär', level: 'ok' },
          { name: 'Apr', level: 'good' }, { name: 'Mai', level: 'great' }, { name: 'Jun', level: 'great' },
          { name: 'Jul', level: 'great' }, { name: 'Aug', level: 'good' }, { name: 'Sep', level: 'great' },
          { name: 'Okt', level: 'good' }, { name: 'Nov', level: 'ok' }, { name: 'Dez', level: 'bad' },
        ]},
        { type: 'sub', title: 'Details' },
        { type: 'rule', icon: '☀️', text: 'April bis September: ideal. Lange Tage, gutes Wetter, viel Verkehr.' },
        { type: 'rule', icon: '🍂', text: 'Oktober: noch gut, die Herbstfarben sind ein Bonus.' },
        { type: 'rule', icon: '❄️', text: 'November bis März: schwierig. Früh dunkel (17 Uhr), kalt, Winterreifen von November bis März/April Pflicht.' },
        { type: 'warn', text: '⚠️ Meide Samstagabende und Sonntage an Autohöfen (LKW-Stationen): LKW dürfen sonntags vor 22 Uhr nicht fahren, der Verkehr ist sehr gering.' },
      ],
    },
    culture: {
      filterTypes: ['c', 'b'],
      blocks: [
        { type: 'text', text: 'Deutsche können anfangs misstrauisch wirken, aber sobald der Kontakt hergestellt ist, sind sie herzlich. Viele Fahrer, die anhalten, haben selbst in ihrer Jugend getrampt.' },
        { type: 'sub', title: 'Was funktioniert' },
        { type: 'rule', icon: '😊', text: 'Gepflegtes Aussehen und Lächeln. Deutsche achten auf das Erscheinungsbild.' },
        { type: 'rule', icon: '📋', text: 'Ein lesbares Schild ist essenziell. Zwischenziele funktionieren besser als das Endziel.' },
        { type: 'rule', icon: '🗣️', text: 'Ein paar Worte Deutsch machen einen großen Unterschied, auch wenn der Fahrer Englisch spricht.' },
        { type: 'sub', title: 'Mitfahrbank' },
        { type: 'text', text: 'Deutschland hat die Mitfahrbank erfunden: öffentliche Bänke mit Richtungsschildern, an denen Autofahrer wissen, dass ein Fahrgast auf eine Mitfahrgelegenheit wartet. Seit Mitte der 2010er Jahre gibt es sie in über 20 Regionen.' },
        { type: 'sub', title: 'Tramper-Rennen' },
        { type: 'text', text: 'Das Tramprennen gibt es seit 2008. Über 100 Teilnehmer, ~2000 km im Team durch Europa, organisiert vom Club of Roam. Abgefahren e.V. organisiert auch die Deutsche Tramper-Meisterschaft.' },
        { type: 'sub', title: 'Veranstaltungen' },
        { type: 'event', items: [
          { month: 'Feb', day: '⟳', name: 'Karneval', desc: 'Rheinischer Karneval (Köln, Düsseldorf, Mainz). Festliche Stimmung.' },
          { month: 'Apr', day: '⟳', name: 'Ostern', desc: 'Ostermärkte, Familien unterwegs.' },
          { month: 'Jun', day: '⟳', name: 'Fête de la Musique', desc: 'Kostenlose Konzerte in Großstädten.' },
          { month: 'Sep-Okt', day: '⟳', name: 'Oktoberfest', desc: 'München, 6 Millionen Besucher. Starker Verkehr Richtung Bayern.' },
          { month: 'Nov-Dez', day: '⟳', name: 'Weihnachtsmärkte', desc: 'In allen Städten. Nürnberg, Dresden, Köln.' },
        ]},
        { type: 'tip', text: '💡 In Deutschland nehmen manche Stammfahrer regelmäßig Tramper mit. Die Tramper-Kultur ist bei älteren Fahrern fest verankert.' },
      ],
    },
  },

  // ==================== BELGIUM ====================
  BE: {
    laws: {
      filterTypes: ['q', 'c', 'a'],
      blocks: [
        { type: 'text', text: 'Trampen ist in Belgien legal. Es gibt keine spezifische Regelung. Auf den Autobahnen selbst verboten, an Raststätten und Parkplätzen erlaubt.' },
        { type: 'sub', title: 'Gut zu wissen' },
        { type: 'text', text: 'Belgische Autobahnen verwenden E-Nummern (E40, E19, E411), keine nationalen Nummern. Belgische Autofahrer erkennen keine A-Nummern.' },
        { type: 'text', text: 'Die Brüsseler Mobilitätsministerin Elke Van den Brandt hat die Menschen öffentlich ermutigt, per Anhalter zur Arbeit zu fahren.' },
      ],
    },
    hitchhiking: {
      filterTypes: ['q', 'c', 'b'],
      blocks: [
        { type: 'text', text: 'Belgien gilt als eines der besten Länder Europas zum Trampen. Mit einem Schild beträgt die durchschnittliche Wartezeit etwa 10 Minuten. Die Dichte an Tankstellen ist sehr hoch.' },
        { type: 'sub', title: 'Regionale Unterschiede' },
        { type: 'kv', items: [
          { k: 'Flandern (Norden, niederländischsprachig)', v: 'Sehr einfach', color: 'green' },
          { k: 'Brüssel', v: 'Einfach', color: 'green' },
          { k: 'Wallonien (Süden, französischsprachig)', v: 'Schwieriger', color: 'amber' },
        ]},
        { type: 'text', text: 'In Flandern ist die Bevölkerungs-, Straßen- und Tankstellendichte höher. In Wallonien ist es eher wie in Frankreich: man braucht mehr Geduld.' },
        { type: 'sub', title: 'Brüssel verlassen' },
        { type: 'text', text: 'Von Delta (Metro/Tram/Bus-Knotenpunkt nahe der ULB) ist es einfach, Richtung Namur und Luxemburg zu starten. Viele Ausländer, die in Belgien arbeiten, machen internationale Fahrten zugänglich.' },
        { type: 'tip', text: '💡 Wenn du länger als eine Stunde wartest, wechsle den Spot. Halte 100 Meter Abstand zwischen deiner Position und dem Abholpunkt, damit Autos Zeit zum Anhalten haben.' },
      ],
    },
    safety: {
      filterTypes: ['c', 'a'],
      blocks: [
        { type: 'text', text: 'Belgien gilt als eines der sichersten Länder für Tramper in Europa. Belgier werden als gastfreundlich und gern bereit beschrieben, Fremde mitzunehmen.' },
        { type: 'sub', title: 'Tipps der belgischen Polizei' },
        { type: 'text', text: 'Inspektorin Sofie Lenaerts (Verkehrssicherheits-Moderatorin) empfiehlt: nachts nicht trampen, alkoholisierte Fahrer ablehnen, wenn möglich zu zweit reisen, Ortungs-Apps nutzen (Family Track, Glympse, Find My).' },
        { type: 'sub', title: 'Notrufnummern' },
        { type: 'kv', items: [
          { k: 'Europäischer Notruf', v: '112' },
          { k: 'Belgische Polizei', v: '101' },
        ]},
        { type: 'text', text: 'Die meisten Tankstellen sind rund um die Uhr geöffnet mit freundlichem Personal. Du kannst dort ein Nickerchen machen, wenn du nachts strandest.' },
      ],
    },
    women: {
      filterTypes: ['q', 'c', 'a'],
      blocks: [
        { type: 'text', text: 'Niederländischsprachige Quellen berichten, dass trampende Frauen schneller mitgenommen werden als Männer: Autofahrer machen sich Sorgen um ihre Sicherheit und halten eher an.' },
        { type: 'text', text: 'Die Rückmeldungen sind überwiegend positiv. Es kommt selten vor, dass eine Fahrt schlecht verläuft. Die gleichen Sicherheitsregeln wie überall gelten: dem Instinkt vertrauen, Kennzeichen an eine Vertrauensperson senden, nachts meiden.' },
      ],
    },
    language: {
      filterTypes: ['c', 'q'],
      blocks: [
        { type: 'text', text: 'Belgien hat drei Amtssprachen: Niederländisch (Flandern/Norden), Französisch (Wallonien/Süden) und Deutsch (kleines östliches Gebiet). Brüssel ist überwiegend französischsprachig. Englisch wird gut gesprochen, besonders in Flandern und bei jungen Leuten.' },
        { type: 'sub', title: 'Sprachtipp' },
        { type: 'text', text: 'Grüße mit beiden Sprachen ("Dag" auf Niederländisch + "Bonjour" auf Französisch), um beide Regionen abzudecken. Stelle dich als Ausländer vor, um Sprachspannungen zu vermeiden. Schau auf die Händleraufkleber am Auto, um die Region des Fahrers zu erraten.' },
        { type: 'warn', text: '⚠️ Erwähne nicht, dass du Wallone bist, wenn du in Flandern bist: manche flämische Fahrer könnten nicht anhalten. Stelle dich besser als Ausländer vor.' },
      ],
    },
    budget: {
      filterTypes: ['b', 'q'],
      blocks: [
        { type: 'text', text: 'Backpacker-Budget in Belgien: etwa 48 € pro Tag, Minimum 22 € für Sparfüchse.' },
        { type: 'sub', title: 'Günstig essen' },
        { type: 'rule', icon: '🍟', text: 'Frietkot (belgische Pommesbude): für 5 € bekommst du eine größere und günstigere Mahlzeit als bei McDonald\'s.' },
        { type: 'rule', icon: '🍺', text: 'Bier ist oft günstiger als Wasser oder Limonade.' },
        { type: 'rule', icon: '🛒', text: 'Discounter: Lidl, Aldi, Colruyt.' },
        { type: 'warn', text: '⚠️ Essen an Autobahnraststätten ist sehr teuer. Kaufe vorher in der Stadt ein.' },
      ],
    },
    sleep: {
      filterTypes: ['b', 'q', 'a'],
      blocks: [
        { type: 'text', text: 'Wildcampen ist in Belgien verboten. Mögliches Bußgeld bis zu 150 €.' },
        { type: 'sub', title: 'Legale Alternativen' },
        { type: 'rule', icon: '✅', text: 'Offizielle Biwakzonen in den Ardennen: kostenlose Übernachtung, maximal 48 Stunden.' },
        { type: 'rule', icon: '✅', text: 'Welcome To My Garden: Netzwerk, bei dem Privatpersonen ihren Garten zum kostenlosen Campen anbieten. Auch in Brüssel verfügbar.' },
        { type: 'rule', icon: '✅', text: '24-Stunden-Tankstellen: freundliches Personal, du kannst dort ein Nickerchen machen.' },
        { type: 'sub', title: 'Unterkünfte' },
        { type: 'kv', items: [
          { k: 'Jugendherbergen (Brüssel)', v: '30 bis 50 €/Nacht' },
          { k: 'Herbergen (Gent, Brügge)', v: '~24 €/Nacht' },
        ]},
      ],
    },
    transport: {
      filterTypes: ['c', 'b'],
      blocks: [
        { type: 'text', text: 'Belgien hat interessante Verkehrsoptionen und ein einzigartiges organisiertes Tramper-System.' },
        { type: 'sub', title: 'Organisiertes Trampen' },
        { type: 'transport', items: [
          { emoji: '🤝', name: 'Covoit\'Stop', detail: 'Provinz Lüttich (16 Gemeinden). Anmeldung, unterzeichnete Charta, Führungszeugnis geprüft', price: 'kostenlos' },
        ]},
        { type: 'sub', title: 'Zug' },
        { type: 'transport', items: [
          { emoji: '🚃', name: 'SNCB Wochenendticket', detail: '30% Ermäßigung Sa/So/Feiertage', price: 'ab ~10 €' },
          { emoji: '🚃', name: 'SNCB unter 26 Jahre', detail: '40% Standard-Ermäßigung', price: '' },
          { emoji: '👶', name: 'Kinder < 12 Jahre', detail: 'Kostenlos (max. 4 pro zahlendem Erwachsenen)', price: 'kostenlos' },
        ]},
        { type: 'sub', title: 'Bus und Mitfahrgelegenheit' },
        { type: 'transport', items: [
          { emoji: '🚌', name: 'FlixBus', detail: '', price: 'ab 5 €' },
          { emoji: '🚗', name: 'BlaBlaCar', detail: 'Sehr beliebt in Belgien', price: '' },
        ]},
      ],
    },
    culture: {
      filterTypes: ['c', 'b'],
      blocks: [
        { type: 'text', text: 'Belgier sind sehr gastfreundlich gegenüber Reisenden, besonders Ausländern. Trampen funktioniert besser mit Belgiern als mit Franzosen oder Niederländern, die nur durchfahren.' },
        { type: 'sub', title: 'Tipps' },
        { type: 'rule', icon: '😊', text: 'Lächle unter allen Umständen, auch nach stundenlangem Warten.' },
        { type: 'rule', icon: '🗣️', text: 'Unterhalte dich kurz mit dem Fahrer zum Kennenlernen, bevor du einsteigst, dann vertraue deinem Instinkt.' },
        { type: 'rule', icon: '🎒', text: 'Wenn du noch nie getrampt bist, wird Belgien als Einsteigerland empfohlen. Beginne mit kurzen Strecken.' },
        { type: 'sub', title: 'Veranstaltungen' },
        { type: 'event', items: [
          { month: 'Feb', day: '⟳', name: 'Karneval von Binche', desc: 'UNESCO-Welterbe, die Gilles werfen Orangen.' },
          { month: 'Jul', day: '21', name: 'Belgischer Nationalfeiertag', desc: 'Festivitäten und Feuerwerk in Brüssel.' },
          { month: 'Jul', day: '⟳', name: 'Tomorrowland', desc: 'Weltweites Elektro-Festival in Boom, 400.000 Besucher.' },
          { month: 'Aug', day: '⟳', name: 'Gentse Feesten', desc: '10 Tage kostenlose Festivitäten in Gent.' },
          { month: 'Dez', day: '⟳', name: 'Weihnachtsmärkte', desc: 'Brüssel, Brügge, Lüttich. Sehr beliebt.' },
        ]},
      ],
    },
  },

  // ==================== NETHERLANDS ====================
  NL: {
    laws: {
      filterTypes: ['q', 'c', 'a'],
      blocks: [
        { type: 'text', text: 'Trampen ist in den Niederlanden legal. Grundregel: überall wo du gehen darfst, kannst du trampen. Auf den Autobahnen (Snelweg) selbst verboten.' },
        { type: 'sub', title: 'Offizielle Spots: die Liftershalte' },
        { type: 'text', text: 'Die Niederlande sind das einzige Land der Welt mit offiziellen Tramper-Haltestellen (Liftershalte), gekennzeichnet durch Schilder. Man findet sie in Amsterdam, Groningen, Utrecht, Zoetermeer, Maastricht und in mehreren Provinzen.' },
      ],
    },
    hitchhiking: {
      filterTypes: ['q', 'c', 'b'],
      blocks: [
        { type: 'text', text: 'Die Niederlande sind ein einfaches Land zum Trampen. Die durchschnittliche Wartezeit beträgt 5 bis 45 Minuten je nach Spot. An einem guten Standort kann die Wartezeit unter 10 Minuten fallen.' },
        { type: 'sub', title: 'Methode' },
        { type: 'text', text: 'Viele Autofahrer halten nicht an, wenn du am Straßenrand den Daumen rausstreckst, aber sie nehmen dich mit, wenn du sie direkt an der Tankstelle ansprichst. Fahrer persönlich anzusprechen ist deutlich effektiver.' },
        { type: 'sub', title: 'Einschränkungen' },
        { type: 'text', text: 'Die meisten Fahrten sind kürzer als 50 km. Man braucht oft mehrere Mitfahrgelegenheiten, um das Land zu durchqueren. Nebenstraßen sind schmal, ohne Seitenstreifen, mit Hecken zwischen Feldern und Straße.' },
        { type: 'sub', title: 'Beste Zeiten' },
        { type: 'kv', items: [
          { k: 'Vormittage und Nachmittage unter der Woche', v: 'Ideal', color: 'green' },
          { k: 'Samstag und Sonntag nachmittags', v: 'Schlecht (Familien unterwegs)', color: 'red' },
          { k: 'Nacht', v: 'Zu meiden', color: 'red' },
        ]},
        { type: 'tip', text: '💡 Die Mehrheit der niederländischen Autofahrer ist grundsätzlich bereit, einen Tramper mitzunehmen.' },
      ],
    },
    safety: {
      filterTypes: ['c', 'a'],
      blocks: [
        { type: 'text', text: 'Die Niederlande gehören zu den sichersten Ländern der Welt zum Trampen. Die Erfahrungsberichte sind überwiegend positiv: es kommt selten vor, dass eine Fahrt schlecht verläuft.' },
        { type: 'sub', title: 'Notrufnummern' },
        { type: 'kv', items: [
          { k: 'Notruf', v: '112' },
        ]},
        { type: 'text', text: 'Moderne Technologie (GPS, WhatsApp, Standortfreigabe) hat das Trampen sicherer als je zuvor gemacht.' },
      ],
    },
    women: {
      filterTypes: ['q', 'c', 'a'],
      blocks: [
        { type: 'text', text: 'Die Niederlande werden regelmäßig unter den sichersten Ländern der Welt für alleinreisende Frauen genannt. Trampende Frauen stellen fest, dass Autofahrer schneller für sie anhalten, oft aus Sorge um ihre Sicherheit.' },
        { type: 'text', text: 'Die wenigen negativen Erfahrungen überwiegen nicht die Hunderte oder Tausende positiver Erfahrungen.' },
      ],
    },
    language: {
      filterTypes: ['c', 'q'],
      blocks: [
        { type: 'text', text: 'Niederländisch ist die Amtssprache. Die Niederlande stehen weltweit auf Platz 1 bei der Englischkompetenz. Fast jeder spricht fließend Englisch.' },
        { type: 'sub', title: 'Nützliche Sätze' },
        { type: 'phrase', items: [
          { local: 'Mag ik meerijden naar...?', meaning: 'Kann ich mit Ihnen Richtung... mitfahren?' },
          { local: 'Bedankt voor de lift!', meaning: 'Danke für die Mitfahrt!' },
        ]},
        { type: 'warn', text: '⚠️ Vermeide es, Deutsch mit Niederländern zu sprechen. Viele mögen das nicht und könnten nicht anhalten.' },
      ],
    },
    budget: {
      filterTypes: ['b', 'q'],
      blocks: [
        { type: 'text', text: 'Backpacker-Budget in den Niederlanden: etwa 50 bis 70 € pro Tag. Amsterdam ist deutlich teurer als der Rest des Landes.' },
        { type: 'sub', title: 'Günstig essen' },
        { type: 'rule', icon: '🧇', text: 'Street Food: Stroopwafels, Kibbeling (frittierter Fisch), Pommes mit Mayo.' },
        { type: 'rule', icon: '🛒', text: 'Supermärkte: Albert Heijn, Jumbo, Lidl. Gute Fertiggerichte.' },
        { type: 'tip', text: '💡 Die App Too Good To Go ermöglicht es, günstig Lebensmittel zu retten, die Restaurants und Supermärkte wegwerfen wollten.' },
      ],
    },
    sleep: {
      filterTypes: ['b', 'q', 'a'],
      blocks: [
        { type: 'text', text: 'Wildcampen ist in den Niederlanden verboten. Bußgeld: 140 €, aber meistens bittet die Polizei dich einfach, zusammenzupacken.' },
        { type: 'sub', title: 'Legale Alternative: Paalkamperen' },
        { type: 'text', text: 'Paalkamperen (Pfahlcamping) ist ein legales System, bei dem markierte Pfähle autorisierte Natur-Campingplätze anzeigen. Maximal 72 Stunden (manchmal nur 1 Nacht je nach Zone).' },
        { type: 'sub', title: 'Unterkünfte' },
        { type: 'kv', items: [
          { k: 'Stayokay (niederländisches HI-Netzwerk)', v: 'ab 20 €/Nacht' },
          { k: 'Hostels Amsterdam', v: '25 bis 50 €/Nacht' },
        ]},
      ],
    },
    transport: {
      filterTypes: ['c', 'b'],
      blocks: [
        { type: 'text', text: 'Die Niederlande haben ein ausgezeichnetes öffentliches Verkehrsnetz. Der Rückgang des Trampens liegt teilweise daran, dass Studenten ein kostenloses Verkehrsabo haben.' },
        { type: 'sub', title: 'Optionen' },
        { type: 'transport', items: [
          { emoji: '🚃', name: 'Samenreiskorting', detail: '40% Rabatt, wenn du mit jemandem reist, der ein Abo hat', price: '' },
          { emoji: '🚌', name: 'FlixBus', detail: '', price: 'ab 5 €' },
          { emoji: '🚗', name: 'BlaBlaCar', detail: '', price: '' },
        ]},
        { type: 'sub', title: 'App' },
        { type: 'text', text: 'Die App 9292 plant alle öffentlichen Verkehrsmittel (Zug, Bus, Tram, Metro, Fähre) und verkauft E-Tickets.' },
      ],
    },
    culture: {
      filterTypes: ['c', 'b'],
      blocks: [
        { type: 'text', text: 'Niederländer werden als offen und pragmatisch beschrieben. Viele Fahrer mittleren Alters haben während ihres Studiums getrampt und geben es weiter.' },
        { type: 'sub', title: 'Was funktioniert' },
        { type: 'rule', icon: '🧹', text: 'Gepflegtes Aussehen. Ein Kamm in den Haaren und saubere Kleidung bewirken Wunder. Vermeide den Hippie-Look.' },
        { type: 'rule', icon: '😊', text: 'Nicht jeder will reden. Manche wollen dir einfach die Fahrt schenken, ohne Unterhaltung. Respektiere das.' },
        { type: 'sub', title: 'Veranstaltungen' },
        { type: 'event', items: [
          { month: 'Apr', day: '27', name: 'Koningsdag', desc: 'Königstag. Das ganze Land in Orange, Märkte, Konzerte.' },
          { month: 'Apr-Mai', day: '⟳', name: 'Keukenhof', desc: 'Tulpengärten. 7 Millionen Blumenzwiebeln in Blüte.' },
          { month: 'Aug', day: '⟳', name: 'Gay Pride Amsterdam', desc: 'Bootsparade auf den Grachten.' },
          { month: 'Nov', day: '⟳', name: 'Sinterklaas', desc: 'Ankunft des Nikolaus per Schiff, nationale Feierlichkeiten.' },
        ]},
        { type: 'tip', text: '💡 Das Liftershalte-Netzwerk wird landesweit weiter ausgebaut.' },
      ],
    },
  },

  // ==================== LUXEMBOURG ====================
  LU: {
    laws: {
      filterTypes: ['q', 'c'],
      blocks: [
        { type: 'text', text: 'Trampen ist in Luxemburg legal. Gleiche Regeln wie im Rest der EU: auf Autobahnen verboten, an Raststätten erlaubt.' },
      ],
    },
    hitchhiking: {
      filterTypes: ['q', 'c', 'b'],
      blocks: [
        { type: 'text', text: 'Luxemburg ist ausgezeichnet für Langstrecken-Trampen dank seiner zentralen Lage im europäischen Autobahnnetz. Wartezeit oft unter 15 Minuten, selbst abends, selbst zu dritt.' },
        { type: 'sub', title: 'Der Schlüssel-Spot' },
        { type: 'text', text: 'Die Aire de Capellen Süd gilt als Paradies für Tramper. Direktfahrten nach Avignon, Valencia (Spanien) und Marokko wurden dort in weniger als einer Stunde ergattert.' },
        { type: 'sub', title: 'Einschränkungen' },
        { type: 'text', text: 'Viel Verkehr auf den Autobahnen kommt von Grenzpendlern, die tanken (Benzin ist günstiger). Das sind sehr kurze Fahrten. Nutze ein Richtungsschild oder schau auf die Kennzeichen zum Filtern.' },
        { type: 'text', text: 'Lokal und auf dem Land trampt kaum jemand. Der Bus ist kostenlos, daher ist Trampen innerhalb des Landes unnötig.' },
      ],
    },
    safety: {
      filterTypes: ['c', 'a'],
      blocks: [
        { type: 'text', text: 'Luxemburg ist ein sehr sicheres Land. Keine spezifischen Daten über Tramper-bezogene Vorfälle.' },
        { type: 'sub', title: 'Notrufnummern' },
        { type: 'kv', items: [
          { k: 'Europäischer Notruf', v: '112' },
          { k: 'Polizei', v: '113' },
        ]},
      ],
    },
    language: {
      filterTypes: ['c', 'q'],
      blocks: [
        { type: 'text', text: 'Die meisten Luxemburger sprechen fließend Luxemburgisch, Französisch, Deutsch UND Englisch. Die Sprachbarriere ist nahezu inexistent. Es ist eines der wenigen Länder, in denen du in fast jeder europäischen Sprache kommunizieren kannst.' },
      ],
    },
    budget: {
      filterTypes: ['b', 'q'],
      blocks: [
        { type: 'text', text: 'Luxemburg ist ein teures Land. Restaurants und Unterkünfte sind kostspielig.' },
        { type: 'sub', title: 'Unterkünfte' },
        { type: 'kv', items: [
          { k: 'Jugendherbergen', v: 'ab 12 bis 20 €/Nacht' },
        ]},
        { type: 'tip', text: '💡 Benzin ist in Luxemburg günstiger als in den Nachbarländern. Deshalb tanken so viele Grenzpendler hier.' },
      ],
    },
    sleep: {
      filterTypes: ['b', 'q'],
      blocks: [
        { type: 'text', text: 'Wildcampen und Biwakieren sind in Luxemburg verboten. Camping nur auf offiziellen Plätzen oder auf Privatgrund mit Genehmigung des Eigentümers.' },
      ],
    },
    transport: {
      filterTypes: ['c', 'b'],
      blocks: [
        { type: 'text', text: 'Luxemburg ist das erste Land der Welt, das ALLE öffentlichen Verkehrsmittel kostenlos gemacht hat, seit März 2020.' },
        { type: 'sub', title: 'Kostenlose Verkehrsmittel' },
        { type: 'rule', icon: '🚌', text: 'Bus: kostenlos im ganzen Land.' },
        { type: 'rule', icon: '🚃', text: 'Zug (2. Klasse): kostenlos im ganzen Land.' },
        { type: 'rule', icon: '🚋', text: 'Straßenbahn: kostenlos. Die Linie erreicht seit März 2025 den Flughafen.' },
        { type: 'rule', icon: '🇫🇷', text: 'Auch auf bestimmten grenzüberschreitenden Zügen nach Frankreich kostenlos (Athus, Audun-le-Tiche, Volmerange-les-Mines).' },
        { type: 'text', text: 'Die Fahrgastzahlen sind explodiert: von 25 Millionen (2019) auf 31,3 Millionen (2024). Die Straßenbahn stieg von 6,2 auf 31,7 Millionen.' },
        { type: 'tip', text: '💡 Um Luxemburg per Anhalter zu verlassen, nimm einen kostenlosen Bus bis zu einer Autobahn-Tankstelle und trampe von dort.' },
      ],
    },
    culture: {
      filterTypes: ['c', 'b'],
      blocks: [
        { type: 'text', text: 'Luxemburg ist hauptsächlich ein Transitland für Tramper. Seine geringe Größe (2.586 km²) und die kostenlosen Verkehrsmittel machen das Trampen innerhalb des Landes überflüssig. Der Nutzen liegt darin, es als Ausgangspunkt für den Rest Europas zu verwenden.' },
        { type: 'sub', title: 'Veranstaltungen' },
        { type: 'event', items: [
          { month: 'Jun', day: '23', name: 'Nationalfeiertag', desc: 'Vorabend: Feuerwerk, Konzerte im ganzen Land.' },
          { month: 'Aug', day: '⟳', name: 'Schueberfouer', desc: 'Jahrhundertealter Jahrmarkt in Luxemburg-Stadt.' },
        ]},
      ],
    },
  },

  // ==================== SWITZERLAND ====================
  CH: {
    laws: {
      filterTypes: ['q', 'c', 'a'],
      blocks: [
        { type: 'text', text: 'Trampen ist in der Schweiz legal. Nur auf Autobahnen, Schnellstraßen und deren Auffahrten verboten. An Rastplätzen und Parkplätzen erlaubt.' },
        { type: 'sub', title: 'Besonderheiten' },
        { type: 'text', text: 'Schweizer Autobahnen sind kostenlos (Vignettensystem, keine Mautstellen). Autobahnschilder sind grün (anders als die roten/blauen Schilder der Nachbarländer).' },
        { type: 'text', text: 'Die Schweiz ist nicht in der EU. Fahrer möchten eventuell prüfen, ob du einen Ausweis hast.' },
        { type: 'warn', text: '⚠️ Wenn du per LKW nach Italien fährst, bitte den Fahrer, am Zoll nicht zu erwähnen, dass du trampst. Die Grenzpolizei könnte dich bitten auszusteigen.' },
      ],
    },
    hitchhiking: {
      filterTypes: ['q', 'c', 'b'],
      blocks: [
        { type: 'text', text: 'Trampen funktioniert gut in der Schweiz, variiert aber stark nach Sprachregion. Durchschnittliche Wartezeit: etwa 10 Minuten in der Deutschschweiz. Deutlich länger in der Romandie.' },
        { type: 'sub', title: 'Regionale Unterschiede' },
        { type: 'kv', items: [
          { k: 'Deutschschweiz (Nord/Ost)', v: 'Schnell (~10 Min)', color: 'green' },
          { k: 'Ländliche Bergregionen', v: 'Einfach (lokale Tradition)', color: 'green' },
          { k: 'Romandie (Westen)', v: 'Schwieriger', color: 'amber' },
        ]},
        { type: 'sub', title: 'Methode' },
        { type: 'text', text: 'Da die Autobahnen kostenlos sind, benutzt fast jeder sie. Trampen auf Nebenstraßen ist daher schwieriger. Autobahn-Tankstellen bleiben die beste Wahl. Ein Schild wird in der Schweiz sehr geschätzt.' },
        { type: 'sub', title: 'Einstellung der Fahrer' },
        { type: 'text', text: 'Ältere Schweizer Fahrer (50+) sind aufgeschlossener. Jüngere neigen dazu, Tramper zu ignorieren oder ihnen aktiv auszuweichen. Etwa 1 von 40 Autos hält an.' },
        { type: 'sub', title: 'Mitfahrbänkli' },
        { type: 'text', text: 'Immer mehr Schweizer Gemeinden installieren Mitfahrbänkli mit Richtungsschildern. In einer getesteten Gemeinde war die Nutzung doppelt so hoch wie die des Postautos.' },
      ],
    },
    safety: {
      filterTypes: ['c', 'a'],
      blocks: [
        { type: 'text', text: 'Die Schweiz ist ein sehr sicheres Land zum Trampen. Experten führen den Rückgang der Praxis eher auf einen Modetrend als auf tatsächliche Sicherheitsprobleme zurück.' },
        { type: 'sub', title: 'Notrufnummern' },
        { type: 'kv', items: [
          { k: 'Europäischer Notruf', v: '112' },
          { k: 'Polizei', v: '117' },
          { k: 'Krankenwagen', v: '144' },
          { k: 'Feuerwehr', v: '118' },
          { k: 'Pannenhilfe', v: '140' },
        ]},
        { type: 'warn', text: '⚠️ Im Winter können die Temperaturen in den Bergen bis -25°C fallen. Gute Ausrüstung und eine Unterkunft sind unerlässlich. Unterschätze niemals die Kälte in der Höhe.' },
      ],
    },
    language: {
      filterTypes: ['c', 'q'],
      blocks: [
        { type: 'text', text: 'Die Schweiz hat 4 Amtssprachen: Deutsch (Nord/Ost, mit starkem Schweizer Akzent), Französisch (Westen), Italienisch (Süden) und Rätoromanisch (östliche Berge). Englisch wird von der Mehrheit der Bevölkerung gut verstanden.' },
        { type: 'tip', text: '💡 Die Romandie ist schwieriger zum Trampen als die Deutschschweiz. Wenn du Deutsch sprichst, hast du es leichter.' },
      ],
    },
    budget: {
      filterTypes: ['b', 'q'],
      blocks: [
        { type: 'text', text: 'Die Schweiz ist eines der teuersten Länder Europas. Backpacker-Budget: etwa 43 €/Tag Minimum, Durchschnitt 120 bis 200 CHF/Tag. Währung: Schweizer Franken (CHF).' },
        { type: 'sub', title: 'Essen' },
        { type: 'text', text: 'Ein Restaurantessen kostet 25 bis 60 CHF. Um Kosten zu sparen, kaufe ausschließlich bei Aldi und Lidl ein (deutlich günstiger als Coop oder Migros).' },
        { type: 'sub', title: 'Unterkünfte' },
        { type: 'kv', items: [
          { k: 'Jugendherbergen', v: '35 bis 83 €/Nacht' },
        ]},
      ],
    },
    sleep: {
      filterTypes: ['b', 'q', 'a'],
      blocks: [
        { type: 'text', text: 'Die Schweiz ist eines der wenigen europäischen Länder, in denen Wildcampen relativ geduldet wird, besonders in der Höhe.' },
        { type: 'sub', title: 'Regeln' },
        { type: 'rule', icon: '✅', text: 'Über der Baumgrenze (~2000m): Camping für eine Nacht erlaubt, nicht in Gruppen.' },
        { type: 'rule', icon: '✅', text: 'Notbiwak (ohne Zelt): immer erlaubt.' },
        { type: 'rule', icon: '✅', text: 'Kanton Obwalden: Wildcampen grundsätzlich erlaubt.' },
        { type: 'rule', icon: '🚫', text: 'Verboten in Naturschutzgebieten, Wildschutzzonen, Nationalparks, Militärzonen.' },
        { type: 'text', text: 'Die Regeln variieren je nach Kanton und Gemeinde. Informiere dich lokal.' },
      ],
    },
    transport: {
      filterTypes: ['c', 'b'],
      blocks: [
        { type: 'text', text: 'Schweizer Verkehrsmittel sind ausgezeichnet, aber teuer. So kannst du sparen.' },
        { type: 'sub', title: 'Zugrabatten' },
        { type: 'transport', items: [
          { emoji: '🚄', name: 'Halbtax-Abo', detail: '50% auf alle Züge, Busse, Schiffe, Stadtverkehr', price: '150 CHF/Monat' },
          { emoji: '🎫', name: 'Spartageskarte', detail: 'Unbegrenzter Tageskarte, Vorausbuchung', price: 'ab 29 CHF' },
          { emoji: '🌙', name: 'GA Night (< 25 Jahre)', detail: 'Kostenlose Fahrten ab 19 Uhr', price: '' },
        ]},
        { type: 'sub', title: 'Bus und Mitfahrgelegenheit' },
        { type: 'transport', items: [
          { emoji: '🚌', name: 'PostBus (Postauto)', detail: 'Gelbe Busse, die fast das ganze Land abdecken', price: '' },
          { emoji: '🚌', name: 'FlixBus', detail: '', price: 'ab 5 €' },
          { emoji: '🚗', name: 'BlaBlaCar', detail: '', price: '' },
        ]},
      ],
    },
    season: {
      filterTypes: ['c', 'q'],
      blocks: [
        { type: 'text', text: 'Frühling und Herbst sind die besten Jahreszeiten zum Trampen in der Schweiz. Der Winter ist in den Bergen gefährlich.' },
        { type: 'sub', title: 'Monatsübersicht' },
        { type: 'season', months: [
          { name: 'Jan', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mär', level: 'ok' },
          { name: 'Apr', level: 'good' }, { name: 'Mai', level: 'great' }, { name: 'Jun', level: 'great' },
          { name: 'Jul', level: 'good' }, { name: 'Aug', level: 'good' }, { name: 'Sep', level: 'great' },
          { name: 'Okt', level: 'good' }, { name: 'Nov', level: 'ok' }, { name: 'Dez', level: 'bad' },
        ]},
        { type: 'warn', text: '⚠️ Im Winter können Alpenpässe gesperrt sein, was die Routen stark einschränkt. Die Temperaturen fallen in der Höhe sehr tief. Plane entsprechende Ausrüstung ein.' },
      ],
    },
    culture: {
      filterTypes: ['c', 'b'],
      blocks: [
        { type: 'text', text: 'Trampen war in der Schweiz bis in die 1990er Jahre normal. Die ältere Generation hat Abenteuergeschichten. Der Rückgang wird dem Wohlstand und Mitfahr-Apps zugeschrieben, nicht der Unsicherheit. Seit einigen Jahren gibt es eine Wiederbelebung, getragen von sozialen Medien und Umweltbewusstsein.' },
        { type: 'sub', title: 'Schweizer Tramper-Meisterschaft' },
        { type: 'text', text: 'Jedes Jahr in der Schweiz organisiert, versammelt dieses Event Dutzende Teilnehmer, die darum wetteifern, ein 200-300 km entferntes Ziel per Anhalter am schnellsten zu erreichen.' },
        { type: 'sub', title: 'Veranstaltungen' },
        { type: 'event', items: [
          { month: 'Feb', day: '⟳', name: 'Fasnacht (Basel)', desc: 'Größter Karneval der Schweiz, 3 Tage.' },
          { month: 'Jul', day: '⟳', name: 'Montreux Jazz Festival', desc: 'Legendäres Jazzfestival am Genfersee.' },
          { month: 'Jul', day: '⟳', name: 'Paléo Festival (Nyon)', desc: 'Größtes Open-Air-Festival der Schweiz.' },
          { month: 'Aug', day: '1', name: 'Nationalfeiertag', desc: 'Feuerwerk auf den Seen, Höhenfeuer in den Bergen.' },
          { month: 'Nov', day: '⟳', name: 'Zibelemärit (Bern)', desc: 'Zwiebelmarkt, mittelalterliche Tradition.' },
        ]},
      ],
    },
  },

  // ==================== AUSTRIA ====================
  AT: {
    laws: {
      filterTypes: ['q', 'c', 'a'],
      blocks: [
        { type: 'text', text: 'Trampen ist in Österreich legal. Auf Autobahnen und Schnellstraßen verboten. An Rastplätzen, Tankstellen und Nebenstraßen erlaubt.' },
        { type: 'sub', title: 'Mindestalter (variiert nach Bundesland)' },
        { type: 'kv', items: [
          { k: 'Kärnten und Vorarlberg', v: 'Mindestalter 14 Jahre' },
          { k: 'Steiermark', v: 'Mindestalter 16 Jahre' },
          { k: 'Andere Bundesländer', v: 'Keine Altersbeschränkung' },
        ]},
        { type: 'sub', title: 'Versicherung' },
        { type: 'text', text: 'Bei einem Unfall deckt die Haftpflichtversicherung des Fahrzeugs den Tramper wie jeden anderen Fahrgast ab.' },
        { type: 'tip', text: '💡 LKW dürfen sonntags und an Feiertagen nicht auf österreichischen Autobahnen fahren.' },
      ],
    },
    hitchhiking: {
      filterTypes: ['q', 'c', 'b'],
      blocks: [
        { type: 'text', text: 'Österreich ist ein gutes Land zum Trampen, aber die Erfahrungen variieren stark nach Region. In den Bergen beträgt die Wartezeit oft ~10 Minuten. Auf manchen Autobahnen kann es über 2 Stunden dauern.' },
        { type: 'sub', title: 'Regionale Unterschiede' },
        { type: 'kv', items: [
          { k: 'Westen (Tirol, Vorarlberg)', v: 'Einfacher', color: 'green' },
          { k: 'Ländliche Bergregionen', v: 'Gut (lokale Tradition)', color: 'green' },
          { k: 'Osten (Wien, Graz)', v: 'Schwieriger', color: 'amber' },
        ]},
        { type: 'text', text: 'Wien ist leicht zu erreichen, aber schwer zu verlassen. Graz ist von einer "Todeszone" von ~40 km Autobahn umgeben, die per Anhalter fast unmöglich zu bewältigen ist.' },
        { type: 'sub', title: 'Schlüssel-Spots' },
        { type: 'text', text: 'Die Raststätte Walserberg (deutsch-österreichische Grenze bei Salzburg) ist riesig und ideal als Ausgangspunkt. In Innsbruck ermöglicht die DEZ-Zone mit zwei Tankstellen im Abstand von 2 Minuten den Wechsel. Kostenloses WLAN an vielen Raststätten.' },
        { type: 'sub', title: 'Mitfahrbankerl' },
        { type: 'text', text: 'Die österreichische Bundesregierung fördert Mitfahrbankerl im Rahmen der Klimaschutzinitiative klimaaktiv. Sie sind vor allem in Niederösterreich und Tirol verbreitet.' },
      ],
    },
    safety: {
      filterTypes: ['c', 'a'],
      blocks: [
        { type: 'text', text: 'Österreich gilt als sicheres Tramperland, auf dem gleichen Niveau wie Deutschland und die Niederlande.' },
        { type: 'sub', title: 'Tipps des ÖAMTC (Österreichischer Automobil-Club)' },
        { type: 'rule', icon: '🎒', text: 'Behalte deinen Rucksack griffbereit, nicht im Kofferraum.' },
        { type: 'rule', icon: '🔒', text: 'Prüfe, ob die Kindersicherung der hinteren Türen nicht aktiviert ist.' },
        { type: 'rule', icon: '📱', text: 'Notiere das Kennzeichen und sende es per SMS an Familie oder Freunde.' },
        { type: 'sub', title: 'Notrufnummern' },
        { type: 'kv', items: [
          { k: 'Europäischer Notruf', v: '112' },
          { k: 'Polizei', v: '133' },
          { k: 'Krankenwagen', v: '144' },
          { k: 'Feuerwehr', v: '122' },
          { k: 'Pannenhilfe', v: '120 / 123' },
        ]},
      ],
    },
    women: {
      filterTypes: ['q', 'c', 'a'],
      blocks: [
        { type: 'text', text: 'Österreich wird unter den sicheren Ländern Europas für alleinreisende Frauen gelistet. Die offiziellen Empfehlungen (ÖAMTC) raten, wenn möglich zu zweit zu trampen und Fahrzeuge mit mehreren Männern zu meiden.' },
      ],
    },
    language: {
      filterTypes: ['c', 'q'],
      blocks: [
        { type: 'text', text: 'Deutsch ist die Amtssprache, mit einem eigenen österreichischen Akzent. Österreich steht weltweit auf Platz 3 bei der Englischkompetenz. Fast jeder spricht zumindest Grundkenntnisse in Englisch, besonders in touristischen Gebieten.' },
        { type: 'sub', title: 'Nützliche Sätze' },
        { type: 'phrase', items: [
          { local: 'Grüß Gott', meaning: 'Hallo (traditionelle österreichische Begrüßung)' },
          { local: 'Nehmen Sie mich mit nach...?', meaning: 'Können Sie mich nach... mitnehmen?' },
          { local: 'Danke für die Mitfahrt!', meaning: 'Danke für die Mitfahrt!' },
        ]},
        { type: 'tip', text: '💡 In Österreich heißt Trampen "Autostoppen" oder einfach "Stoppen", nicht "Trampen" wie in Deutschland.' },
      ],
    },
    budget: {
      filterTypes: ['b', 'q'],
      blocks: [
        { type: 'text', text: 'Backpacker-Budget in Österreich: etwa 55 bis 95 € pro Tag. Günstiger als die Schweiz, teurer als Osteuropa.' },
        { type: 'sub', title: 'Unterkünfte' },
        { type: 'kv', items: [
          { k: 'Jugendherbergen', v: '25 bis 40 €/Nacht' },
          { k: 'Wien (Schlafsaal)', v: '32 bis 40 €/Nacht' },
        ]},
        { type: 'sub', title: 'Günstig essen' },
        { type: 'rule', icon: '🛒', text: 'Discounter: Hofer (= Aldi in Österreich), Billa, Spar, Lidl, Penny.' },
        { type: 'text', text: 'Österreichische Fahrer haben Tramper schon zum Essen eingeladen und bei ihrer Familie übernachten lassen. Das sind oft die bewegendsten Momente der Reise.' },
      ],
    },
    sleep: {
      filterTypes: ['b', 'q', 'a'],
      blocks: [
        { type: 'text', text: 'Wildcampen ist in Österreich streng geregelt und die Bußgelder sind sehr hoch. Die Regeln variieren erheblich von Bundesland zu Bundesland.' },
        { type: 'sub', title: 'Nach Bundesland' },
        { type: 'kv', items: [
          { k: 'Oberösterreich (über der Baumgrenze)', v: 'Erlaubt', color: 'green' },
          { k: 'Steiermark (Ödland, 1 Nacht)', v: 'Erlaubt', color: 'green' },
          { k: 'Salzburg (alpines Gelände)', v: 'Geduldet', color: 'amber' },
          { k: 'Tirol', v: 'Verboten. Bußgeld ab 220 €', color: 'red' },
          { k: 'Niederösterreich', v: 'Verboten. Bußgeld bis 14.500 €', color: 'red' },
          { k: 'Kärnten', v: 'Verboten. Bußgeld bis 3.630 €', color: 'red' },
          { k: 'Wien / Burgenland', v: 'Verboten', color: 'red' },
        ]},
        { type: 'text', text: 'Notbiwak (aus Sicherheitsgründen: schlechtes Wetter, Verletzung, Dunkelheit) ist überall immer erlaubt. Aber geplantes Biwakieren (mit Zelt, Isomatte, Kocher) wird als Wildcampen behandelt.' },
        { type: 'warn', text: '⚠️ Camping im Wald ist in GANZ Österreich verboten, ohne Ausnahme.' },
      ],
    },
    transport: {
      filterTypes: ['c', 'b'],
      blocks: [
        { type: 'text', text: 'Österreich hat ein einzigartiges nationales Verkehrsticket in Europa.' },
        { type: 'sub', title: 'KlimaTicket' },
        { type: 'transport', items: [
          { emoji: '🎫', name: 'KlimaTicket', detail: 'Alle öffentlichen Verkehrsmittel des Landes, unbegrenzt', price: '1.095 €/Jahr (~3 €/Tag)' },
          { emoji: '🎫', name: 'KlimaTicket < 26 / > 64 Jahre', detail: 'Ermäßigter Tarif', price: '821 €/Jahr' },
        ]},
        { type: 'text', text: '130.000 Österreicher haben im ersten Monat ein Abo abgeschlossen. 85% haben Autofahrten ersetzt.' },
        { type: 'sub', title: 'Weitere Optionen' },
        { type: 'transport', items: [
          { emoji: '🚄', name: 'ÖBB Sparschiene', detail: 'Frühbucher-Tickets zum Sparpreis', price: 'ab 19 €' },
          { emoji: '🚄', name: 'Vorteilscard < 26 Jahre', detail: '50% auf alle Züge, 1 Jahr', price: '19 €' },
          { emoji: '🚌', name: 'FlixBus', detail: '', price: 'ab 5 €' },
          { emoji: '🚗', name: 'BlaBlaCar', detail: '', price: '' },
          { emoji: '🌙', name: 'Nightjet (ÖBB)', detail: 'Nachtzüge nach Deutschland, Schweiz, Italien', price: '' },
        ]},
      ],
    },
    season: {
      filterTypes: ['c', 'q'],
      blocks: [
        { type: 'text', text: 'Der Sommer ist die beste Jahreszeit zum Trampen in Österreich. Der Winter ist möglich, aber schwierig (Kälte, kurze Tage).' },
        { type: 'sub', title: 'Monatsübersicht' },
        { type: 'season', months: [
          { name: 'Jan', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mär', level: 'ok' },
          { name: 'Apr', level: 'good' }, { name: 'Mai', level: 'great' }, { name: 'Jun', level: 'great' },
          { name: 'Jul', level: 'great' }, { name: 'Aug', level: 'good' }, { name: 'Sep', level: 'great' },
          { name: 'Okt', level: 'good' }, { name: 'Nov', level: 'ok' }, { name: 'Dez', level: 'bad' },
        ]},
        { type: 'warn', text: '⚠️ Meide Sonntage: LKW sind sonntags und an Feiertagen auf den Autobahnen verboten, der Verkehr ist sehr gering.' },
      ],
    },
    culture: {
      filterTypes: ['c', 'b'],
      blocks: [
        { type: 'text', text: 'Die österreichische Gastfreundschaft variiert stark. Manche Reisende finden Österreicher sehr gastfreundlich, andere beschreiben sie als zurückhaltend. In den Bergen sind die Menschen offener, da viele als Kinder getrampt haben und Busse selten fahren.' },
        { type: 'sub', title: 'Was funktioniert' },
        { type: 'rule', icon: '😊', text: 'Ein aufrichtiges Lächeln löst viele Vorbehalte.' },
        { type: 'rule', icon: '🏔️', text: 'Auf Bergstraßen, nach einer Wanderung, sind die Chancen, dass ein Auto anhält, sehr hoch.' },
        { type: 'sub', title: 'Veranstaltungen' },
        { type: 'event', items: [
          { month: 'Jan', day: '⟳', name: 'Neujahrskonzerte (Wien)', desc: 'Weltweite Musiktradition.' },
          { month: 'Feb', day: '⟳', name: 'Opernball (Wien)', desc: 'Größter Ball der Welt.' },
          { month: 'Jul-Aug', day: '⟳', name: 'Salzburger Festspiele', desc: 'Oper, Theater und klassische Musik.' },
          { month: 'Sep-Okt', day: '⟳', name: 'Almabtrieb', desc: 'Abtrieb der geschmückten Herden von den Almen. Volksfest.' },
          { month: 'Nov-Dez', day: '⟳', name: 'Christkindlmärkte', desc: 'Weihnachtsmärkte. Wien, Salzburg, Innsbruck, Graz.' },
          { month: 'Dez', day: '5', name: 'Krampuslauf', desc: 'Krampus-Umzug, einzigartige alpine Tradition.' },
        ]},
        { type: 'tip', text: '💡 Die Alpenlandschaften sind atemberaubend. Bevorzuge kleine Bergstraßen für die Aussicht, auch wenn es länger dauert.' },
      ],
    },
  },

  // ==================== SPAIN ====================
  ES: {
    laws: {
      filterTypes: ['q', 'c', 'a'],
      blocks: [
        { type: 'text', text: 'Trampen ist auf National- und Nebenstraßen in Spanien legal. Auf Autobahnen (Autopistas) und Schnellstraßen (Autovías) verboten gemäß Artikel 125 der Allgemeinen Verkehrsordnung.' },
        { type: 'sub', title: 'Bußgelder' },
        { type: 'text', text: '80 € Bußgeld für den Tramper UND den Fahrer, der ihn auf einer verbotenen Straße mitnimmt. Manche Gemeinden verhängen höhere Bußgelder (bis zu 3.000 € in bestimmten lokalen Fällen).' },
        { type: 'sub', title: 'In der Praxis' },
        { type: 'text', text: 'Tankstellen und Rastplätze an Autobahnen sind erlaubt. Viele Spanier (und sogar manche Polizisten) glauben fälschlicherweise, dass Trampen komplett illegal ist.' },
        { type: 'warn', text: '⚠️ Die Guardia Civil entfernt Tramper aktiv von Mautstellen. Die Mitarbeiter der Autobahngesellschaften ebenfalls.' },
      ],
    },
    hitchhiking: {
      filterTypes: ['q', 'c', 'b'],
      blocks: [
        { type: 'text', text: 'Spanien ist eines der schwierigsten Länder Europas zum Trampen. Die durchschnittliche Wartezeit beträgt 60 bis 120 Minuten. Plane maximal 300 bis 350 km pro Tag ein.' },
        { type: 'sub', title: 'Pflichtmethode' },
        { type: 'text', text: 'Fahrer direkt an Tankstellen anzusprechen ist quasi Pflicht. Der Daumen am Straßenrand funktioniert in Spanien fast nicht. Sprich höflich an: "Hola, vas a...?"' },
        { type: 'sub', title: 'Regionale Unterschiede' },
        { type: 'kv', items: [
          { k: 'Galicien, Asturien, Extremadura', v: 'Einfacher', color: 'green' },
          { k: 'Aragón, Navarra', v: 'In Ordnung', color: 'green' },
          { k: 'Andalusien (Landesinnere)', v: 'Schwierig (leere Tankstellen)', color: 'amber' },
          { k: 'Katalonien', v: 'Sehr schwierig', color: 'red' },
          { k: 'Baskenland', v: 'Sehr schwierig', color: 'red' },
        ]},
        { type: 'sub', title: 'Grenztipp' },
        { type: 'text', text: 'La Jonquera (französische Grenze) ist einer der größten Raststätten Europas. Ideal, um vor der Einreise nach Spanien eine Langstreckenfahrt zu finden.' },
        { type: 'warn', text: '⚠️ Während der Siesta (14-17 Uhr) sinkt der Verkehr stark. Vermeide das Trampen zu diesen Zeiten, besonders im Sommer.' },
      ],
    },
    safety: {
      filterTypes: ['c', 'a'],
      blocks: [
        { type: 'text', text: 'Spanien ist insgesamt sicher (Platz 23 im Global Peace Index). Das Hauptrisiko für Reisende sind Taschendiebe in Großstädten, nicht das Trampen.' },
        { type: 'text', text: 'Trampen ist in Spanien weniger verbreitet als im Rest Europas, aber durchaus machbar. Spanier sind herzlich und gastfreundlich, sobald ein Gespräch begonnen wird.' },
        { type: 'sub', title: 'Notrufnummern' },
        { type: 'kv', items: [
          { k: 'Notruf', v: '112' },
          { k: 'Guardia Civil (Straßen, ländlich)', v: '062' },
          { k: 'Nationalpolizei (Städte)', v: '091' },
        ]},
      ],
    },
    women: {
      filterTypes: ['q', 'c', 'a'],
      blocks: [
        { type: 'text', text: 'Spanien gilt als eines der sichersten Länder für alleinreisende Frauen generell. Mehrere Frauen, die allein getrampt haben, berichten von positiven Erfahrungen.' },
        { type: 'sub', title: 'Erfahrungsberichte' },
        { type: 'text', text: 'Vorfälle sind selten und meist geringfügig (unangemessene Geste, unangemessenes Gespräch), alle handelbar durch klare Ablehnung. Als Frau zu trampen kann ein Vorteil sein: Fahrer halten oft aus Sorge um deine Sicherheit an.' },
        { type: 'rule', icon: '👨‍👩‍👧', text: 'Bevorzuge Paare und Familien. Lehne Autos mit mehreren Männern ab.' },
        { type: 'rule', icon: '📍', text: 'Teile deine Route in Echtzeit über Google Maps mit einer Vertrauensperson.' },
      ],
    },
    language: {
      filterTypes: ['c', 'q'],
      blocks: [
        { type: 'text', text: 'Spanisch (Kastilisch) ist unverzichtbar. Nur 22% der Spanier sprechen Englisch. Spanien hat eines der niedrigsten Englischniveaus in Westeuropa. Außerhalb touristischer Gebiete solltest du nicht auf Englisch zählen.' },
        { type: 'sub', title: 'Regionalsprachen' },
        { type: 'text', text: 'Katalanisch, Baskisch und Galicisch sind in ihren Regionen ko-offiziell. Ein paar Worte in der Lokalsprache helfen sehr.' },
        { type: 'sub', title: 'Nützliche Sätze' },
        { type: 'phrase', items: [
          { local: 'Hola, vas a...?', meaning: 'Hallo, fährst du nach...?' },
          { local: 'Me puedes llevar?', meaning: 'Kannst du mich mitnehmen?' },
          { local: 'Gracias, buen viaje!', meaning: 'Danke, gute Fahrt!' },
          { local: 'Me puedes dejar aquí?', meaning: 'Kannst du mich hier rauslassen?' },
        ]},
      ],
    },
    budget: {
      filterTypes: ['b', 'q'],
      blocks: [
        { type: 'text', text: 'Backpacker-Budget in Spanien: etwa 38 bis 50 € pro Tag. Der Süden (Sevilla, Cádiz, Granada) ist deutlich günstiger als der Norden.' },
        { type: 'sub', title: 'Günstig essen' },
        { type: 'rule', icon: '🍽️', text: 'Menú del día: 8 bis 15 € für ein 3-Gänge-Menü. Restaurants sind gesetzlich verpflichtet, es anzubieten.' },
        { type: 'rule', icon: '🍺', text: 'Kostenlose Tapas zum Getränk in Kastilien, Andalusien und Kastilien-La Mancha.' },
        { type: 'rule', icon: '🥖', text: 'Pintxos im Baskenland: 1 bis 2 € pro Stück.' },
        { type: 'rule', icon: '🛒', text: 'Supermärkte: Mercadona, Carrefour, Lidl. Komplette Mahlzeit für 5 bis 10 €.' },
        { type: 'warn', text: '⚠️ Essen an Autobahnraststätten ist sehr teuer. Kaufe in der Stadt ein.' },
      ],
    },
    sleep: {
      filterTypes: ['b', 'q', 'a'],
      blocks: [
        { type: 'text', text: 'Wildcampen ist in Spanien verboten. Bußgelder von 30 bis 3.000 € je nach Region. Aber Biwakieren (schlafen ohne Zelt) wird in den Bergen eher geduldet.' },
        { type: 'sub', title: 'Nach Region' },
        { type: 'kv', items: [
          { k: 'Galicien, Kantabrien, Asturien, Navarra', v: 'Toleranter', color: 'green' },
          { k: 'Pyrenäen, Aragón (Berge)', v: 'Biwak geduldet', color: 'green' },
          { k: 'Ländliches Landesinnere', v: 'Polizei sagt nur, du sollst gehen', color: 'amber' },
          { k: 'Touristische Küsten, Strände', v: 'Null Toleranz', color: 'red' },
          { k: 'Balearen, Kanaren', v: 'Null Toleranz', color: 'red' },
        ]},
        { type: 'sub', title: 'Alternativen' },
        { type: 'rule', icon: '⛪', text: 'Albergues de peregrinos auf dem Jakobsweg: sehr günstige Unterkunft mit Pilgerausweis.' },
        { type: 'rule', icon: '🛋️', text: 'Couchsurfing: aktive Community in Madrid und Barcelona.' },
        { type: 'rule', icon: '🏕️', text: 'Campingplätze: 10 bis 18 €/Nacht für 2 mit Zelt. Die meisten haben einen Pool.' },
      ],
    },
    transport: {
      filterTypes: ['c', 'b'],
      blocks: [
        { type: 'text', text: 'Spanien hat das viertgrößte Autobahnnetz der Welt. Viele Spanier nutzen BlaBlaCar statt zu trampen.' },
        { type: 'sub', title: 'Optionen' },
        { type: 'transport', items: [
          { emoji: '🚗', name: 'BlaBlaCar', detail: 'Sehr beliebt in Spanien', price: '~5 €/100 km' },
          { emoji: '🚗', name: 'Amovens', detail: 'Spanischer Konkurrent, null Provision', price: '' },
          { emoji: '🚌', name: 'ALSA', detail: 'Größte spanische Busgesellschaft', price: 'ab 10 €' },
          { emoji: '🚌', name: 'FlixBus', detail: '', price: 'ab 5 €' },
          { emoji: '🚄', name: 'Ouigo / Iryo', detail: 'Spanische Billig-Hochgeschwindigkeitszüge', price: 'ab 9 €' },
        ]},
      ],
    },
    season: {
      filterTypes: ['c', 'q'],
      blocks: [
        { type: 'text', text: 'Frühling und Herbst sind die besten Jahreszeiten. Der Sommer ist die schlechteste Zeit zum Trampen in Spanien.' },
        { type: 'sub', title: 'Monatsübersicht' },
        { type: 'season', months: [
          { name: 'Jan', level: 'ok' }, { name: 'Feb', level: 'ok' }, { name: 'Mär', level: 'good' },
          { name: 'Apr', level: 'great' }, { name: 'Mai', level: 'great' }, { name: 'Jun', level: 'good' },
          { name: 'Jul', level: 'bad' }, { name: 'Aug', level: 'bad' }, { name: 'Sep', level: 'great' },
          { name: 'Okt', level: 'great' }, { name: 'Nov', level: 'ok' }, { name: 'Dez', level: 'ok' },
        ]},
        { type: 'warn', text: '⚠️ Juli und August: extreme Hitze (40°C+ im Landesinneren), Siesta tötet den Verkehr, Preise am Maximum. Bei 40°C am Straßenrand warten ist unerträglich.' },
      ],
    },
    culture: {
      filterTypes: ['c', 'b'],
      blocks: [
        { type: 'text', text: 'Eine Tramper-Kultur hat in Spanien nie wirklich existiert. Unter Franco haben Jugendbewegungen nicht wie im Rest Europas Fuß gefasst. Als sich Spanien öffnete, waren Autos bereits erschwinglich.' },
        { type: 'sub', title: 'Was funktioniert' },
        { type: 'rule', icon: '🗣️', text: 'Das direkte Ansprechen an Tankstellen ist quasi Pflicht. Der Daumen am Straßenrand wird als ungewöhnlich empfunden.' },
        { type: 'rule', icon: '😊', text: 'Spanier sind herzlich und großzügig, sobald der Kontakt hergestellt ist. Die Hürde ist der erste Stopp.' },
        { type: 'rule', icon: '🕐', text: 'Passe dich den spanischen Zeiten an: Mittagessen gegen 14 Uhr, Abendessen nach 21 Uhr. Die Siesta (14-17 Uhr) reduziert den Verkehr.' },
        { type: 'sub', title: 'Veranstaltungen' },
        { type: 'event', items: [
          { month: 'Mär', day: '⟳', name: 'Las Fallas (Valencia)', desc: 'Riesige Skulpturen werden verbrannt, Feuerwerk.' },
          { month: 'Mär-Apr', day: '⟳', name: 'Semana Santa', desc: 'Prozessionen im ganzen Land, besonders Sevilla.' },
          { month: 'Apr', day: '⟳', name: 'Feria de Abril (Sevilla)', desc: 'Flamenco, Pferde, traditionelle Trachten.' },
          { month: 'Jul', day: '6-14', name: 'San Fermín (Pamplona)', desc: 'Stierrennen durch die Straßen.' },
          { month: 'Aug', day: '⟳', name: 'La Tomatina (Buñol)', desc: 'Riesige Tomatenschlacht.' },
          { month: 'Aug', day: '15', name: 'Mariä Himmelfahrt', desc: 'Feiertag, viele Leute auf den Straßen.' },
        ]},
      ],
    },
  },

  // ==================== PORTUGAL ====================
  PT: {
    laws: {
      filterTypes: ['q', 'c'],
      blocks: [
        { type: 'text', text: 'Trampen ist in Portugal legal. Das Betreten von Autobahnen (Autoestradas) ist verboten, aber es gibt kein spezielles Bußgeld für Tramper. Die Polizei kann dich bitten, die Zone zu verlassen, oder dir eine Mitfahrgelegenheit anbieten.' },
        { type: 'text', text: 'Tankstellen und Mautstellen sind die besten Orte. Dort nach Fahrten zu fragen ist erlaubt und empfohlen.' },
        { type: 'warn', text: '⚠️ Tramper sind nicht immer durch die Standard-Kfz-Versicherung in Portugal abgedeckt. Das ist einer der Gründe, warum manche Fahrer zögern anzuhalten.' },
      ],
    },
    hitchhiking: {
      filterTypes: ['q', 'c', 'b'],
      blocks: [
        { type: 'text', text: 'Portugal ist einfacher als Spanien zum Trampen, bleibt aber eine Herausforderung. Die mittlere Wartezeit beträgt etwa 40 Minuten. Die längste von einem Reisenden registrierte Fahrt ist 460 km (Ourique nach Porto).' },
        { type: 'sub', title: 'Methode' },
        { type: 'text', text: 'Direktes Ansprechen funktioniert am besten: "Hallo, entschuldigen Sie die Störung, ich fahre nach... fahren Sie zufällig in die gleiche Richtung?" Portugiesen reagieren besser auf ein höfliches Gespräch als auf den erhobenen Daumen.' },
        { type: 'sub', title: 'Regionale Unterschiede' },
        { type: 'kv', items: [
          { k: 'Achse Lissabon-Coimbra-Porto', v: 'Am einfachsten', color: 'green' },
          { k: 'Algarve (Südküste)', v: 'In Ordnung (Touristen)', color: 'green' },
          { k: 'Nördliches Landesinnere', v: 'Länger', color: 'amber' },
          { k: 'Grenzgebiete zu Spanien', v: 'Sehr wenig Verkehr', color: 'red' },
        ]},
        { type: 'sub', title: 'Lissabon verlassen' },
        { type: 'text', text: 'Per Anhalter aus Lissabon herauszukommen ist schwierig. Nimm den Zug bis Vila Franca de Xira (2,20 €, 30 Min), um zur Mautstelle der A1 und zur Nationalstraße zu gelangen.' },
      ],
    },
    safety: {
      filterTypes: ['c', 'a'],
      blocks: [
        { type: 'text', text: 'Portugal ist das fünftsicherste Land Europas und eines der sichersten der Welt. Gewaltkriminalität ist sehr selten. Das Hauptrisiko sind Taschendiebe in Lissabon (Tram 28) und in touristischen Gebieten von Porto.' },
        { type: 'sub', title: 'Notrufnummern' },
        { type: 'kv', items: [
          { k: 'Notruf', v: '112' },
        ]},
        { type: 'text', text: 'Die Polizei ist in PSP (Stadtgebiete) und GNR (ländliche Gebiete) unterteilt. Lissabon hat ein Touristenpolizeirevier am Bahnhof Rossio mit mehrsprachigen Beamten.' },
      ],
    },
    women: {
      filterTypes: ['q', 'c', 'a'],
      blocks: [
        { type: 'text', text: 'Portugal gilt als eines der besten Länder der Welt für alleinreisende Frauen. Mehrere Frauen berichten, sich nie belästigt gefühlt zu haben.' },
        { type: 'text', text: 'Portugiesische Männer werden als respektvoll beschrieben: wenn sie flirten, geschieht es mit Stil und sie akzeptieren leicht ein höfliches "Nein". Fahrerinnen und Paare bieten oft aus Solidarität Fahrten an.' },
      ],
    },
    language: {
      filterTypes: ['c', 'q'],
      blocks: [
        { type: 'text', text: 'Portugiesisch ist die Amtssprache. Das Englischniveau ist deutlich besser als in Spanien: Portugal gehört zu den besten nicht-englischsprachigen Ländern. Englisch wird ab der Grundschule unterrichtet. Spanisch wird dank gemeinsamer Wurzeln weitgehend verstanden.' },
        { type: 'sub', title: 'Nützliche Sätze' },
        { type: 'phrase', items: [
          { local: 'Olá, pode dar-me boleia até...?', meaning: 'Hallo, können Sie mich nach... mitnehmen?' },
          { local: 'Fala inglês?', meaning: 'Sprechen Sie Englisch?' },
          { local: 'Obrigado / Obrigada', meaning: 'Danke (Mann / Frau)' },
          { local: 'Pode ajudar-me?', meaning: 'Können Sie mir helfen?' },
        ]},
        { type: 'tip', text: '💡 Portugiesen strahlen, wenn Besucher sich bemühen, ein paar Worte Portugiesisch zu sprechen. Schon ein einfaches "Olá" macht einen großen Unterschied.' },
      ],
    },
    budget: {
      filterTypes: ['b', 'q'],
      blocks: [
        { type: 'text', text: 'Portugal ist eines der erschwinglichsten Länder Westeuropas. Backpacker-Budget: etwa 35 bis 50 € pro Tag. Außerhalb von Lissabon und Porto sinken die Preise erheblich.' },
        { type: 'sub', title: 'Günstig essen' },
        { type: 'rule', icon: '🍽️', text: 'Prato do dia (Tagesgericht): 8 bis 12 € mit Suppe, Hauptgericht, Dessert und manchmal einem Glas Wein.' },
        { type: 'rule', icon: '🛒', text: 'Supermärkte: Pingo Doce, Continente, Lidl, Aldi. Fertiggerichte erhältlich.' },
        { type: 'sub', title: 'Unterkünfte' },
        { type: 'kv', items: [
          { k: 'Jugendherbergen', v: '15 bis 25 €/Nacht' },
        ]},
        { type: 'text', text: 'Die Region Alentejo ist besonders erschwinglich. Porto wird als "wirklich erschwinglich für Westeuropa" beschrieben.' },
      ],
    },
    sleep: {
      filterTypes: ['b', 'q', 'a'],
      blocks: [
        { type: 'text', text: 'Seit Juli 2021 sind Wildcampen und Biwakieren in Portugal effektiv verboten. Bußgelder: 120 bis 600 € (bis zu 36.000 € für schwere Verstöße in Schutzgebieten).' },
        { type: 'sub', title: 'Zonen' },
        { type: 'kv', items: [
          { k: 'Algarve und Lissabon', v: 'Strenge Durchsetzung', color: 'red' },
          { k: 'Atlantikküste', v: 'Strenge Durchsetzung', color: 'red' },
          { k: 'Nördliches Landesinnere und Berge', v: 'Toleranter wenn unauffällig', color: 'amber' },
        ]},
        { type: 'sub', title: 'Kostenlose oder günstige Alternativen' },
        { type: 'rule', icon: '🚒', text: 'Bombeiros (Feuerwehrkasernen): manche bieten Reisenden kostenlose Betten, wenn sie höflich fragen. Bring deinen Schlafsack mit.' },
        { type: 'rule', icon: '🛋️', text: 'Couchsurfing: aktive Community in Lissabon und Porto.' },
        { type: 'rule', icon: '🌾', text: 'Portugal EasyCamp: Aufenthalte bei Bauern und Winzern, oft günstiger als Campingplätze.' },
        { type: 'tip', text: '💡 Facebook-Gruppen "Boleia" + Stadtname helfen, Fahrten und manchmal Unterkünfte bei Einheimischen zu finden.' },
      ],
    },
    transport: {
      filterTypes: ['c', 'b'],
      blocks: [
        { type: 'text', text: 'Das portugiesische Schienennetz ist begrenzt, aber die Busse sind zuverlässig und erschwinglich.' },
        { type: 'sub', title: 'Optionen' },
        { type: 'transport', items: [
          { emoji: '🚌', name: 'Rede Expressos', detail: 'Größte Busgesellschaft, 202 Städte', price: 'ab 5 €' },
          { emoji: '🚌', name: 'FlixBus', detail: 'Lissabon-Porto ab 9 €', price: 'ab 5 €' },
          { emoji: '🚗', name: 'BlaBlaCar', detail: 'Beliebt für Überlandfahrten', price: '' },
          { emoji: '🚗', name: 'Boleia.net', detail: 'Portugiesische Mitfahrplattform', price: '' },
          { emoji: '🚃', name: 'CP (Züge)', detail: 'Günstige Regionalzüge rund um Lissabon', price: 'ab 2,20 €' },
        ]},
      ],
    },
    season: {
      filterTypes: ['c', 'q'],
      blocks: [
        { type: 'text', text: 'Frühling und Frühherbst sind die besten Zeiten. Der Sommer ist im Landesinneren sehr heiß und an der Küste sehr touristisch.' },
        { type: 'sub', title: 'Monatsübersicht' },
        { type: 'season', months: [
          { name: 'Jan', level: 'ok' }, { name: 'Feb', level: 'ok' }, { name: 'Mär', level: 'good' },
          { name: 'Apr', level: 'great' }, { name: 'Mai', level: 'great' }, { name: 'Jun', level: 'good' },
          { name: 'Jul', level: 'ok' }, { name: 'Aug', level: 'bad' }, { name: 'Sep', level: 'great' },
          { name: 'Okt', level: 'great' }, { name: 'Nov', level: 'ok' }, { name: 'Dez', level: 'ok' },
        ]},
        { type: 'text', text: 'Die Algarve (Süden) bleibt auch im Winter mild (15-20°C). Der Norden und das Zentrum sind von November bis März regnerisch.' },
        { type: 'warn', text: '⚠️ Portugal ist SEHR windig, besonders an der Küste. Rechne mit starkem Wind, auch im Sommer. Nachts kann der Küstenwind eiskalt sein.' },
      ],
    },
    culture: {
      filterTypes: ['c', 'b'],
      blocks: [
        { type: 'text', text: 'Portugiesen werden als sehr warmherzig und gastfreundlich beschrieben, aber Trampen gehört nicht zu ihrer Kultur. Einheimische Autofahrer halten selten an. Ausländische Touristen (besonders im Sommer in der Algarve) nehmen eher Tramper mit.' },
        { type: 'sub', title: 'Was funktioniert' },
        { type: 'rule', icon: '🗣️', text: 'Direktes und höfliches Ansprechen ist entscheidend. Portugiesen schätzen die persönliche Interaktion.' },
        { type: 'rule', icon: '📋', text: 'Ein Schild mit deinem Ziel verbessert deine Chancen.' },
        { type: 'sub', title: 'Veranstaltungen' },
        { type: 'event', items: [
          { month: 'Feb', day: '⟳', name: 'Karneval', desc: 'Große Feierlichkeiten, besonders in Torres Vedras und Loule.' },
          { month: 'Jun', day: '12-13', name: 'Santo António (Lissabon)', desc: 'Fest des Schutzpatrons, gegrillte Sardinen, Umzüge.' },
          { month: 'Jun', day: '23-24', name: 'São João (Porto)', desc: 'Größtes Fest von Porto, Feuer, Musik, Plastikhämmer.' },
          { month: 'Jul', day: '⟳', name: 'NOS Alive (Lissabon)', desc: 'Internationales Musikfestival.' },
          { month: 'Aug', day: '⟳', name: 'Festival do Sudoeste', desc: 'Musikfestival im Alentejo.' },
          { month: 'Okt', day: '5', name: 'Tag der Republik', desc: 'Nationaler Feiertag.' },
        ]},
        { type: 'tip', text: '💡 Eine Tramperfahrt in Portugal kann leicht zu einer improvisierten Stadtführung werden. Fahrer bieten manchmal spontan an, ihre Stadt zu zeigen.' },
      ],
    },
  },

  // ==================== ITALY ====================
  IT: {
    laws: {
      filterTypes: ['q', 'c', 'a'],
      blocks: [
        { type: 'text', text: 'Trampen ist auf Autobahnen (Autostrade) in Italien verboten, einschließlich Auffahrten, Raststätten und Autobahnparkplätze. Es ist eines der wenigen Länder Europas mit einem so strikten Verbot.' },
        { type: 'sub', title: 'Bußgelder' },
        { type: 'text', text: '21 bis 168 € Bußgeld für den Tramper. Der Fahrer, der anhält, riskiert ebenfalls ein Bußgeld. Die Durchsetzung variiert je nach Region und Beamtem.' },
        { type: 'sub', title: 'Was erlaubt ist' },
        { type: 'rule', icon: '✅', text: 'Fahrer direkt an Tankstellen (Autogrill) ansprechen und um eine Mitfahrt bitten. Das ist die funktionierende Methode.' },
        { type: 'rule', icon: '✅', text: 'Trampen auf Nationalstraßen (Strade Statali) und Nebenstraßen.' },
        { type: 'rule', icon: '🚫', text: 'Daumenraus auf Autobahnen, Auffahrten, Mautstellen und Autobahnraststätten.' },
        { type: 'warn', text: '⚠️ Viele Italiener und sogar manche Polizisten glauben, dass Trampen komplett illegal ist. Stelle dich vor die "No Autostop"-Schilder an den Autobahnauffahrten.' },
      ],
    },
    hitchhiking: {
      filterTypes: ['q', 'c', 'b'],
      blocks: [
        { type: 'text', text: 'Italien ist eines der schwierigsten Länder Westeuropas zum Trampen. Wartezeiten von 1 bis 2 Stunden sind häufig. Die Gewinnerstrategie: von Autogrill zu Autogrill vorarbeiten und Fahrer direkt ansprechen.' },
        { type: 'sub', title: 'Unterschiede Nord/Süd' },
        { type: 'kv', items: [
          { k: 'Süditalien (Kalabrien, Sizilien)', v: 'Einfacher, gastfreundliche Leute', color: 'green' },
          { k: 'Sardinien', v: 'Gut (lokale Gastfreundschaft)', color: 'green' },
          { k: 'Friaul-Julisch Venetien, Südtirol', v: 'In Ordnung', color: 'green' },
          { k: 'Industrieller Norden (Mailand, Turin)', v: 'Schwierig, Leute in Eile', color: 'red' },
          { k: 'Alpen (Tunnel)', v: 'Sehr schwierig (kein Halt möglich)', color: 'red' },
        ]},
        { type: 'sub', title: 'Schild-Trick' },
        { type: 'text', text: 'Ein Schild auf Italienisch mit "Siamo bravi" (wir sind nett) hat sich als wirksam erwiesen. Schreibe eine Stadt in 200-300 km Entfernung, nicht dein Endziel. Ausländer (Franzosen, Deutsche, Polen) auf Durchreise halten eher an als Italiener.' },
        { type: 'tip', text: '💡 In Sizilien kannst du kostenlos auf die Fähre in Villa San Giovanni: die Tickets gelten pro Fahrzeug, nicht pro Passagier.' },
      ],
    },
    safety: {
      filterTypes: ['c', 'a'],
      blocks: [
        { type: 'text', text: 'Italien ist insgesamt sicher zum Reisen. Gewalttätige Vorfälle beim Trampen sind extrem selten. Das Hauptrisiko ist rechtlicher Natur (Bußgelder), nicht körperlich.' },
        { type: 'sub', title: 'Notrufnummern' },
        { type: 'kv', items: [
          { k: 'Europäischer Notruf', v: '112' },
          { k: 'Carabinieri', v: '112' },
          { k: 'Polizei', v: '113' },
          { k: 'Feuerwehr', v: '115' },
          { k: 'Krankenwagen', v: '118' },
        ]},
        { type: 'text', text: 'In der Nähe von Großstädten (besonders Rom) können alleinreisende Frauen mit Prostituierten verwechselt werden. Vermeide das Trampen in diesen Gebieten.' },
      ],
    },
    women: {
      filterTypes: ['q', 'c', 'a'],
      blocks: [
        { type: 'text', text: 'Italien ist für Frauen nicht gefährlich, aber aufdringliche Blicke und unerwünschte Aufmerksamkeit sind häufig, besonders im Süden. Trampen ist durchaus machbar, auch in Sizilien.' },
        { type: 'sub', title: 'Spezifische Tipps' },
        { type: 'rule', icon: '👕', text: 'Kleide dich schlicht: kein Make-up, kein Schmuck, Wanderschuhe, "Abenteurerin"-Look.' },
        { type: 'rule', icon: '👨‍👩‍👧', text: 'Bevorzuge Paare und Familien. Fahrerinnen sind selten, aber sehr sicher.' },
        { type: 'rule', icon: '📱', text: 'Fotografiere das Kennzeichen sichtbar (der Fahrer sieht, dass du es tust). Das beruhigt alle.' },
      ],
    },
    language: {
      filterTypes: ['c', 'q'],
      blocks: [
        { type: 'text', text: 'Italienisch ist essenziell. Die Mehrheit der Italiener spricht kein Englisch, besonders außerhalb touristischer Gebiete. Schon ein paar Worte Italienisch verändern die Interaktion komplett.' },
        { type: 'sub', title: 'Nützliche Sätze' },
        { type: 'phrase', items: [
          { local: 'Cerco un passaggio per...', meaning: 'Ich suche eine Mitfahrgelegenheit nach...' },
          { local: 'Vado a...', meaning: 'Ich fahre nach...' },
          { local: 'Area servizio', meaning: 'Raststätte' },
          { local: 'Grazie mille!', meaning: 'Vielen Dank!' },
        ]},
        { type: 'tip', text: '💡 Gesten sind in Italien essenziell. Körpersprache hilft enorm, wenn die Worte fehlen.' },
      ],
    },
    budget: {
      filterTypes: ['b', 'q'],
      blocks: [
        { type: 'text', text: 'Backpacker-Budget in Italien: etwa 18 bis 30 € pro Tag mit Disziplin. Die Binnenregionen (Basilikata, Molise, Kalabrien) sind deutlich günstiger als die Küsten und touristischen Städte.' },
        { type: 'sub', title: 'Günstig essen' },
        { type: 'rule', icon: '🍕', text: 'Pizza al taglio (Stückpizza): 1 bis 2,50 €. Focaccia: 0,80 €. Arancini: 2 €.' },
        { type: 'rule', icon: '🛒', text: 'Supermärkte: LIDL, Carrefour, COOP. Pasta + Sauce = ~3 €/Mahlzeit in der Hostelküche.' },
        { type: 'sub', title: 'Großzügigkeit' },
        { type: 'text', text: 'Italienische Fahrer bieten manchmal spontan Mahlzeiten, Unterkünfte oder sogar Geld an.' },
      ],
    },
    sleep: {
      filterTypes: ['b', 'q', 'a'],
      blocks: [
        { type: 'text', text: 'Wildcampen ist in Italien verboten. Bußgelder: 100 bis 500 €. Aber Biwakieren (Sonnenuntergang bis Sonnenaufgang, ohne Zelt) wird in den Bergen geduldet.' },
        { type: 'sub', title: 'Ausnahmen' },
        { type: 'rule', icon: '✅', text: 'Trentino-Südtirol: Biwakieren bis zu 24 Stunden erlaubt.' },
        { type: 'rule', icon: '✅', text: 'Aostatal: Biwakieren über 2.500 m erlaubt.' },
        { type: 'rule', icon: '🚫', text: 'Strände: überall strenge Durchsetzung.' },
        { type: 'sub', title: 'Alternativen' },
        { type: 'rule', icon: '🛋️', text: 'Couchsurfing: aktiv in Universitätsstädten (Turin, Pisa, Padua).' },
        { type: 'rule', icon: '🌾', text: 'WWOOF / Workaway: Farmarbeit im Austausch gegen Unterkunft und Verpflegung.' },
        { type: 'text', text: 'Auf Sardinien und Sizilien laden Einheimische Reisende manchmal spontan zu sich nach Hause ein.' },
      ],
    },
    transport: {
      filterTypes: ['c', 'b'],
      blocks: [
        { type: 'text', text: 'Italien hat erschwingliche Verkehrsalternativen, wenn das Trampen nicht funktioniert.' },
        { type: 'sub', title: 'Optionen' },
        { type: 'transport', items: [
          { emoji: '🚌', name: 'FlixBus / MarinoBus', detail: 'Umfangreiches Netz, 60-80% günstiger als der Zug', price: 'ab 5 €' },
          { emoji: '🚗', name: 'BlaBlaCar', detail: 'Sehr genutzt in Italien', price: '' },
          { emoji: '🚄', name: 'Italo', detail: 'Private Hochgeschwindigkeitszüge (Rom-Florenz-Venedig)', price: 'ab 9 €' },
          { emoji: '🚃', name: 'Trenitalia Regional', detail: 'Langsame aber erschwingliche Züge', price: '' },
        ]},
      ],
    },
    season: {
      filterTypes: ['c', 'q'],
      blocks: [
        { type: 'text', text: 'Frühling und Frühherbst sind die besten Zeiten. Meide Oktober-November (alles schließt) und August (Ferragosto, Straßenchaos).' },
        { type: 'sub', title: 'Monatsübersicht' },
        { type: 'season', months: [
          { name: 'Jan', level: 'ok' }, { name: 'Feb', level: 'ok' }, { name: 'Mär', level: 'good' },
          { name: 'Apr', level: 'great' }, { name: 'Mai', level: 'great' }, { name: 'Jun', level: 'great' },
          { name: 'Jul', level: 'good' }, { name: 'Aug', level: 'ok' }, { name: 'Sep', level: 'great' },
          { name: 'Okt', level: 'ok' }, { name: 'Nov', level: 'bad' }, { name: 'Dez', level: 'ok' },
        ]},
        { type: 'text', text: 'Im Sommer halten ausländische Touristen (Franzosen, Deutsche), die den Norden durchqueren, eher an als Italiener selbst.' },
      ],
    },
    culture: {
      filterTypes: ['c', 'b'],
      blocks: [
        { type: 'text', text: 'Italiener haben eine negative Wahrnehmung vom Trampen. Viele halten es für etwas, das nur Landstreicher tun. Aber sobald der Kontakt hergestellt ist, ist die italienische Gastfreundschaft aufrichtig und großzügig, besonders im Süden und auf den Inseln.' },
        { type: 'sub', title: 'Was funktioniert' },
        { type: 'rule', icon: '🗣️', text: 'Italienisch sprechen, auch schlecht, ändert alles. Direktes Ansprechen am Autogrill ist Pflicht.' },
        { type: 'rule', icon: '😊', text: 'Erst menschlicher Kontakt: Lächeln, Gespräch, Blickkontakt. Erst dann die Bitte um eine Mitfahrt.' },
        { type: 'sub', title: 'Veranstaltungen' },
        { type: 'event', items: [
          { month: 'Feb', day: '⟳', name: 'Carnevale di Venezia', desc: 'Masken, Kostüme, 10 Tage Festivitäten.' },
          { month: 'Apr', day: '25', name: 'Festa della Liberazione', desc: 'Feiertag, nationale Feierlichkeiten.' },
          { month: 'Mai', day: '⟳', name: 'Giro d\'Italia', desc: 'Radrennen, Stimmung auf den Straßen.' },
          { month: 'Jul', day: '2+16', name: 'Palio di Siena', desc: 'Mittelalterliches Pferderennen in der Stadt.' },
          { month: 'Aug', day: '15', name: 'Ferragosto', desc: 'Ganz Italien im Urlaub. Volle Straßen.' },
          { month: 'Dez', day: '⟳', name: 'Mercatini di Natale', desc: 'Weihnachtsmärkte, besonders im Trentino.' },
        ]},
      ],
    },
  },
  // ==================== GREECE ====================
  GR: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Es gibt kein spezielles Gesetz, das Trampen in Griechenland verbietet. Auf Autobahnen ist es wie im Rest der EU verboten, aber auf normalen Straßen wird es geduldet. Bußgelder (100-150 €) sind selten und werden inkonsistent angewandt.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Griechenland ist deutlich einfacher als Italien oder Spanien zum Trampen. Die Wartezeiten variieren von wenigen Minuten bis zu einer Stunde. In ländlichen Gebieten und auf den Inseln trampen die Einheimischen selbst.' },
      { type: 'sub', title: 'Nach Zone' },
      { type: 'kv', items: [
        { k: 'Kreta (besonders West/Süd)', v: 'Sehr einfach', color: 'green' },
        { k: 'Ländliche Inseln', v: 'Einfach (wenige Busse)', color: 'green' },
        { k: 'Ländliche Festlandstraßen', v: 'Einfach', color: 'green' },
        { k: 'Überlandachsen (Athen-Thessaloniki)', v: 'Schwieriger', color: 'amber' },
        { k: 'Athen verlassen', v: 'Sehr schwierig', color: 'red' },
      ]},
      { type: 'sub', title: 'Methode' },
      { type: 'text', text: 'Auf Kreta wird der erhobene Daumen nicht immer verstanden. Benutze stattdessen eine Handbewegung, um Autos zum Anhalten zu signalisieren, als wärst du in Eile. Ein Schild auf Griechisch UND Englisch erhöht deine Chancen.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Griechenland ist eines der sichersten Länder Europas für Reisende. Negative Vorfälle beim Trampen sind extrem selten. Griechische Fahrer bieten spontan Essen, Getränke und Unterkunft an.' },
      { type: 'sub', title: 'Notrufnummern' },
      { type: 'kv', items: [
        { k: 'Notruf', v: '112' },
        { k: 'Polizei', v: '100' },
        { k: 'Krankenwagen', v: '166' },
        { k: 'Feuerwehr', v: '199' },
      ]},
    ]},
    women: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'Griechenland gilt als eines der besten Reiseziele der Welt für alleinreisende Frauen. Die Einstellung gegenüber alleinreisenden Frauen wird als die eines "großen beschützenden Cousins" beschrieben, nicht aufdringlich.' },
      { type: 'text', text: 'Frauen reisen in Griechenland sicher, tagsüber wie nachts, per Bus, Fähre und Trampen. Vorfälle sind nahezu inexistent.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Griechisch ist die Amtssprache. Englisch wird in touristischen Gebieten und von jungen Leuten gut gesprochen (ab der Grundschule unterrichtet). Auf dem Land ist es eingeschränkter. Viele Griechen sprechen auch Deutsch (Diaspora).' },
      { type: 'sub', title: 'Nützliche Sätze' },
      { type: 'phrase', items: [
        { local: 'Kalimera', meaning: 'Guten Morgen' },
        { local: 'Efcharistó', meaning: 'Danke' },
        { local: 'Parakaló', meaning: 'Bitte / Gern geschehen' },
        { local: 'Boríte na me páte sto...?', meaning: 'Können Sie mich nach... bringen?' },
      ]},
      { type: 'tip', text: '💡 Ein paar Worte Griechisch lösen sehr herzliche Reaktionen aus. Griechen schätzen die Mühe enorm.' },
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Griechenland ist für Backpacker erschwinglich. Budget: 22 bis 42 € pro Tag. Günstiger als Italien. Die weniger touristischen Inseln (Naxos, Paros, Ios) bieten das beste Preis-Leistungs-Verhältnis.' },
      { type: 'sub', title: 'Günstig essen' },
      { type: 'rule', icon: '🥙', text: 'Gyros: unter 5 €. Souvlaki: 2-3 €.' },
      { type: 'rule', icon: '🛒', text: 'Supermärkte: Feta, Pita, Joghurt, Tomaten, Oliven. Sehr günstig.' },
      { type: 'sub', title: 'Transport' },
      { type: 'text', text: 'KTEL-Busse: etwa 5 €/100 km (staatlich festgelegte Tarife). Fähren zu den Inseln: erschwinglich, 2-3 Monate im Voraus buchen für beliebte Routen.' },
    ]},
    sleep: { filterTypes: ['b', 'q', 'a'], blocks: [
      { type: 'text', text: 'Wildcampen ist in Griechenland offiziell verboten. Bußgeld: 150 €, bis zu 3.000 € + 3 Monate Gefängnis in touristischen Gebieten oder Naturschutzgebieten.' },
      { type: 'sub', title: 'In der Praxis' },
      { type: 'text', text: 'Das Verbot gilt von Sonnenaufgang bis Sonnenuntergang. Nachts schlafen und morgens zusammenpacken wird in der Nebensaison und abseits touristischer Gebiete weitgehend geduldet. Abgelegene Strände sind leicht zu finden.' },
      { type: 'sub', title: 'Alternativen' },
      { type: 'rule', icon: '🛋️', text: 'Couchsurfing: aktive Community in Athen und Thessaloniki.' },
      { type: 'rule', icon: '🏠', text: 'Spontane Einladungen: Griechen laden Reisende regelmäßig zum Essen oder Schlafen ein, besonders auf dem Land und auf den Inseln.' },
      { type: 'sub', title: 'Unterkünfte' },
      { type: 'kv', items: [
        { k: 'Hostels Athen', v: '9 bis 25 €/Nacht' },
        { k: 'Hostels Inseln', v: '20 bis 25 €/Nacht' },
        { k: 'Studios auf Booking', v: 'ab 10 €/Pers/Nacht' },
      ]},
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Das KTEL-Busnetz ist so günstig, dass Trampen in Griechenland manchmal weniger nötig ist.' },
      { type: 'sub', title: 'Optionen' },
      { type: 'transport', items: [
        { emoji: '🚌', name: 'KTEL (Überlandbus)', detail: 'Umfangreiches Netz, auch kleine Dörfer. Staatlich festgelegte Tarife.', price: '~5 €/100 km' },
        { emoji: '⛴️', name: 'Fähren', detail: 'Unverzichtbar für die Inseln. Nachtfähren = Unterkunft sparen.', price: '10 bis 50 €' },
        { emoji: '🚃', name: 'Züge', detail: 'Begrenztes Netz, aber bis zu 50% günstiger als der Bus', price: '' },
        { emoji: '🚗', name: 'BlaBlaCar', detail: 'In Griechenland verfügbar', price: '' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mär', level: 'ok' },
        { name: 'Apr', level: 'good' }, { name: 'Mai', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'good' }, { name: 'Aug', level: 'ok' }, { name: 'Sep', level: 'great' },
        { name: 'Okt', level: 'good' }, { name: 'Nov', level: 'bad' }, { name: 'Dez', level: 'bad' },
      ]},
      { type: 'warn', text: '⚠️ Von November bis März schließen die meisten Inseln (Hotels, Restaurants, reduzierte Fähren). Das Festland bleibt zugänglich, aber es gibt sehr wenige Touristen auf den Straßen.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Griechenland ist das Land der Philoxenia (Liebe zum Fremden). Es ist ein tief verwurzelter kultureller Wert, der bis ins antike Griechenland zurückreicht: Zeus Xenios beschützte Reisende, und jeder Fremde konnte ein verkleideter Gott sein.' },
      { type: 'sub', title: 'In der Praxis' },
      { type: 'text', text: 'Fahrer, die anhalten, beherbergen Reisende oft kostenlos, laden zum Essen ein, zeigen die Region. Die griechische Gastfreundschaft ist aufrichtig und großzügig, selbst bei den bescheidensten Leuten.' },
      { type: 'rule', icon: '🎁', text: 'Nimm Einladungen an (ablehnen kann als Zurückweisung empfunden werden). Bringe ein kleines Geschenk mit (Gebäck, Wein), wenn du eingeladen wirst.' },
      { type: 'sub', title: 'Veranstaltungen' },
      { type: 'event', items: [
        { month: 'Feb-Mär', day: '⟳', name: 'Apokries (Karneval)', desc: 'Patras hat den größten Karneval Griechenlands.' },
        { month: 'Apr', day: '⟳', name: 'Orthodoxes Ostern', desc: 'Das größte Fest Griechenlands. Gebratene Lämmer, Feuerwerk.' },
        { month: 'Jun', day: '⟳', name: 'Athener Festival', desc: 'Theater, Musik, Tanz im Odeon des Herodes Atticus.' },
        { month: 'Aug', day: '15', name: 'Mariä Himmelfahrt (Dekapentavgoustos)', desc: 'Größtes Sommerfest. Wallfahrten, Inselfeste.' },
        { month: 'Okt', day: '28', name: 'Ochi-Tag', desc: 'Nationalfeiertag, Militärparaden.' },
      ]},
      { type: 'tip', text: '💡 Kretisches Sprichwort: "Ein Gast im Haus ist ein Geschenk Gottes." Auf dem Land ist die Ankunft eines Fremden immer noch ein besonderes Ereignis.' },
    ]},
  },

  // ==================== NORWAY ====================
  NO: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Trampen ist in Norwegen legal. Auf den Autobahnen selbst verboten, aber an Auffahrten, Tankstellen und Nebenstraßen erlaubt. Seit 2024 sind fast alle Küstenfähren für Fußgänger kostenlos.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Norwegen funktioniert gut zum Trampen, aber das Vorankommen ist langsam wegen der kurvenreichen Bergstraßen und des spärlichen Verkehrs. Plane ~500 km/Tag Maximum ein.' },
      { type: 'sub', title: 'Unterschiede Nord/Süd' },
      { type: 'kv', items: [
        { k: 'Norden (Lofoten, Tromsø, Nordkapp)', v: 'Ausgezeichnet (5-30 Min)', color: 'green' },
        { k: 'Mitte (Trondheim)', v: 'In Ordnung', color: 'green' },
        { k: 'Süden (Oslo, Stavanger)', v: 'Schwierig (bis zu 2 Std)', color: 'amber' },
      ]},
      { type: 'text', text: 'Die Lofoten sind ein Tramper-Paradies: eine einzige Hauptstraße (E10), spektakuläre Landschaften, gastfreundliche Fahrer. Im Norden haben viele Fahrer noch nie einen Tramper gesehen.' },
      { type: 'tip', text: '💡 An Fähren sprich die Fahrer VOR dem Einschiffen an, nicht danach. Sie warten und haben Zeit zum Plaudern.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Norwegen ist eines der sichersten Länder der Welt. Das Hauptrisiko ist das Wetter und die Abgeschiedenheit (lange Strecken zwischen Städten, Kälte, Regen, Schnee), nicht die Menschen.' },
      { type: 'sub', title: 'Notrufnummern' },
      { type: 'kv', items: [
        { k: 'Notruf', v: '112' },
        { k: 'Polizei', v: '02800' },
        { k: 'Krankenwagen', v: '113' },
      ]},
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Skandinavien wird als "die perfekte Region beschrieben, um als Frau das Trampen auszuprobieren". Die Stellung der Frau in der nordischen Gesellschaft ist sehr hoch und Belästigung nahezu inexistent.' },
      { type: 'text', text: 'Norwegen eignet sich sehr gut zum Solo-Trampen für Frauen. Der Empfang ist herzlich und positive Begegnungen sind die Norm.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Fast alle Norweger sprechen fließend Englisch. Keine Sprachbarriere.' },
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Norwegen ist extrem teuer. Die Lebensmittelpreise sind etwa doppelt so hoch wie in Deutschland, selbst in Discountern (Rema 1000, Kiwi). Ein Restaurantbesuch ist für Backpacker unbezahlbar.' },
      { type: 'text', text: 'Die Kombination Trampen + Wildcampen (kostenlos dank Allemannsretten) + Kochen auf dem Kocher ist die einzige tragfähige Strategie für ein kleines Budget.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Das Allemannsretten (Jedermannsrecht) ist im norwegischen Gesetz von 1957 verankert. Du darfst kostenlos auf unkultiviertem Land (Wälder, Berge, Heiden, Ufer) ohne Genehmigung campen.' },
      { type: 'sub', title: 'Regeln' },
      { type: 'rule', icon: '✅', text: 'Kostenloses Camping bis zu 2 Nächte am selben Ort.' },
      { type: 'rule', icon: '✅', text: 'Beeren- und Pilzesammeln erlaubt.' },
      { type: 'rule', icon: '🚫', text: 'Mindestens 150 m Abstand zu Wohnhäusern.' },
      { type: 'rule', icon: '🚫', text: 'Kein offenes Feuer in der Natur.' },
      { type: 'rule', icon: '🚫', text: 'Nicht auf Kulturland.' },
      { type: 'warn', text: '⚠️ Auf den Lofoten gibt es lokale Einschränkungen wegen Übertourismus. Informiere dich lokal.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '⛴️', name: 'Küstenfähren', detail: 'Seit 2024 kostenlos für Fußgänger', price: 'kostenlos' },
        { emoji: '🚌', name: 'Vy Bus4You', detail: 'Günstige Überlandbusse', price: '' },
        { emoji: '🚌', name: 'FlixBus', detail: 'Einige Linien in Norwegen', price: 'ab 5 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mär', level: 'bad' },
        { name: 'Apr', level: 'ok' }, { name: 'Mai', level: 'good' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Aug', level: 'great' }, { name: 'Sep', level: 'ok' },
        { name: 'Okt', level: 'bad' }, { name: 'Nov', level: 'bad' }, { name: 'Dez', level: 'bad' },
      ]},
      { type: 'text', text: 'Juni bis August: Mitternachtssonne nördlich des Polarkreises. Nahezu endlose Tage. September: Übergangszeit (kälter, weniger Verkehr). Winter: extrem schwierig (Polarnacht, Kälte, Eisglätte, sehr wenige Autos).' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Norweger sind beim ersten Kontakt zurückhaltend, aber hilfsbereit. Im Norden sind die Leute deutlich herzlicher und gastfreundlicher. Fahrer machen manchmal Umwege, um dich an den richtigen Ort zu bringen.' },
      { type: 'sub', title: 'Veranstaltungen' },
      { type: 'event', items: [
        { month: 'Mai', day: '17', name: 'Syttende Mai', desc: 'Nationalfeiertag. Umzüge, Trachten im ganzen Land.' },
        { month: 'Jun', day: '23', name: 'Sankthansaften', desc: 'Johannisfeuer an den Stränden und Fjorden.' },
        { month: 'Jul', day: '⟳', name: 'Midnight Sun Marathon (Tromsø)', desc: 'Marathon unter der Mitternachtssonne.' },
      ]},
    ]},
  },

  // ==================== SWEDEN ====================
  SE: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Trampen ist in Schweden legal. Auf Autobahnen verboten, aber an Auffahrten und Tankstellen erlaubt. Der Ruf als "Land, wo es verboten ist" ist ein Mythos: niemand wird dich behelligen.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Schweden hat unter Trampern einen schlechten Ruf, aber erfahrene Reisende sagen, "es ist wirklich nicht so schlimm, wie alle behaupten". Durchschnittliche Wartezeit: ~30 Minuten. Der Norden ist deutlich einfacher als der Süden.' },
      { type: 'text', text: 'Die Erfahrungsberichte sind überwiegend positiv, auch solo. Direktes Ansprechen an Tankstellen funktioniert besser als der Daumen am Straßenrand.' },
      { type: 'tip', text: '💡 Die großen Tankstellen (Rasta) entlang der Autobahnen sind die besten Spots zum Trampen.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Sehr sicheres Land. Keine Vorfälle von Trampern berichtet. Das Hauptrisiko sind die langen Strecken im Norden mit wenigen Autos.' },
      { type: 'sub', title: 'Notrufnummern' },
      { type: 'kv', items: [{ k: 'Notruf', v: '112' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Schweden ist eines der gleichberechtigtsten Länder der Welt. Frauen werden schneller mitgenommen als Männer. Skandinavien wird als "die perfekte Region beschrieben, um als Frau das Trampen auszuprobieren".' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Fast alle Schweden sprechen fließend Englisch. Keine Sprachbarriere. Das schwedische Wort für Trampen ist "lifta".' },
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Teuer, aber etwas günstiger als Norwegen. Discounter: Lidl, Willys, ICA Maxi. Selbst kochen ist essenziell.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Das Allemansrätten (Jedermannsrecht) ist seit 1994 in der schwedischen Verfassung verankert. Du darfst dein Zelt auf jedem unkultivierten Gelände für 1-2 Nächte ohne Genehmigung aufstellen.' },
      { type: 'sub', title: 'Regeln' },
      { type: 'rule', icon: '✅', text: '1-2 Nächte am selben Ort, nicht auf eingezäuntem oder kultiviertem Gelände.' },
      { type: 'rule', icon: '✅', text: 'Beeren-, Pilze- und Wildblumensammeln erlaubt.' },
      { type: 'rule', icon: '🚫', text: '150-200 m Abstand zu Wohnhäusern halten.' },
      { type: 'rule', icon: '🚫', text: 'Lagerfeuer nur bei sicheren Bedingungen (häufige Verbote im Sommer).' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'FlixBus / FlixTrain', detail: 'Betrieb in Schweden', price: 'ab 5 €' },
        { emoji: '🚃', name: 'SJ (schwedische Züge)', detail: 'Frühzeitig buchen für Rabatte', price: '' },
        { emoji: '🤝', name: 'Skjutsgruppen.nu', detail: 'Schwedische Mitfahr-Plattform', price: '' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mär', level: 'ok' },
        { name: 'Apr', level: 'ok' }, { name: 'Mai', level: 'good' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Aug', level: 'great' }, { name: 'Sep', level: 'good' },
        { name: 'Okt', level: 'ok' }, { name: 'Nov', level: 'bad' }, { name: 'Dez', level: 'bad' },
      ]},
      { type: 'text', text: 'Juni bis August: lange Tage, mildes Wetter, maximaler Verkehr. Achtung vor Mücken in Lappland (Juni-Juli). Winter: schwierig (-20°C im Norden, Dunkelheit).' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Schweden sind introvertiert und werden dich nicht ansprechen, aber sie sind hilfsbereit, wenn DU sie ansprichst. Im Norden werden die Leute "keinen Fremden draußen frieren lassen". Zieh deine Schuhe aus, wenn du ein Haus oder eine LKW-Kabine betrittst.' },
      { type: 'sub', title: 'Veranstaltungen' },
      { type: 'event', items: [
        { month: 'Jun', day: '⟳', name: 'Midsommar', desc: 'Sommersonnenwende. Tanz um den Maibaum, Blumenkränze, Nationalfest.' },
        { month: 'Aug', day: '⟳', name: 'Krebsfest (Kräftskiva)', desc: 'Krebsfeste im Freien im ganzen Land.' },
        { month: 'Dez', day: '13', name: 'Lucia', desc: 'Kerzenprozessionen, traditionelle Gesänge.' },
      ]},
    ]},
  },

  // ==================== ICELAND ====================
  IS: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Trampen ist in Island völlig legal und gesellschaftlich akzeptiert. Keine Einschränkungen. Es ist eine gängige Praxis, besonders auf der Route 1 (Ringstraße).' },
      { type: 'warn', text: '⚠️ Die Grenzpolizei kann einen Nachweis ausreichender Mittel verlangen (Bankkarte oder Bargeld). Die Einreise kann ohne abgelehnt werden.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Island ist im Sommer sehr einfach zum Trampen. Durchschnittliche Wartezeit: 5 bis 30 Minuten auf der Ringstraße. Sowohl Isländer ALS AUCH Touristen in Mietwagen halten an.' },
      { type: 'sub', title: 'Nach Zone' },
      { type: 'kv', items: [
        { k: 'Ringstraße (Route 1)', v: 'Sehr einfach', color: 'green' },
        { k: 'Reykjavik → Akranes (Bus + Trampen)', v: 'Einfach', color: 'green' },
        { k: 'Westfjorde', v: 'Sehr schwierig (zurückhaltende Einheimische)', color: 'red' },
        { k: 'Hochland / Inland', v: 'Nahezu unmöglich (kein Verkehr)', color: 'red' },
      ]},
      { type: 'text', text: 'Versuche nicht, direkt aus Reykjavik per Anhalter zu fahren. Nimm einen Bus nach Akranes und starte von dort. N1-Tankstellen sind die sozialen Zentren der Dörfer und gute Spots.' },
      { type: 'tip', text: '💡 Samferda.is: isländische Mitfahr-Plattform, auf der du die Benzinkosten teilen kannst.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Island gilt als das sicherste Land der Welt für alleinreisende Frauen. Kriminalität nahezu inexistent. Die echte Gefahr ist das Wetter: es wechselt innerhalb von Minuten, und abseits einer Stadt bei arktischem Wetter festzusitzen ist das Hauptrisiko.' },
      { type: 'sub', title: 'Notrufnummern' },
      { type: 'kv', items: [{ k: 'Notruf', v: '112' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Island ist die weltweite Referenz in Sachen Gleichberechtigung und Sicherheit für Frauen. Trampen funktioniert perfekt für alleinreisende Frauen. Autofahrer wollen oft noch mehr helfen, wenn du eine Frau bist.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Fast alle Isländer sprechen fließend Englisch. Keine Sprachbarriere. Touristen aller Nationalitäten bieten ebenfalls Fahrten an.' },
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Island ist das teuerste nordische Land. Mindestbudget: 60 bis 100 €/Tag. Trampen ist die Schlüsselstrategie, um den größten Kostenfaktor zu reduzieren (Mietwagen, sehr teuer). Währung: Isländische Krone (ISK). Der günstigste Supermarkt ist Bonus.' },
      { type: 'sub', title: 'Unterkünfte' },
      { type: 'kv', items: [
        { k: 'Offizielle Campingplätze', v: '5 bis 25 €/Nacht' },
        { k: 'Hostels (Schlafsaal Reykjavik)', v: 'ab ~30 €/Nacht' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q', 'a'], blocks: [
      { type: 'text', text: 'Wildcampen mit Zelt ist nur in unbewohnten Gebieten erlaubt, für 1 Nacht, mit maximal 3 Zelten, und wenn kein Verbotsschild vorhanden ist. Wohnmobile MÜSSEN auf offiziellen Campingplätzen bleiben (Gesetz von 2015).' },
      { type: 'warn', text: '⚠️ Seit 2017 wurden die Regeln wegen des Verhaltens mancher Touristen verschärft. In bewohnten Gebieten (Südisland) ist Camping außerhalb von Campingplätzen verboten.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Keine Eisenbahn in Island. Busse existieren, sind aber teuer und fahren selten.' },
      { type: 'sub', title: 'Optionen' },
      { type: 'transport', items: [
        { emoji: '🤝', name: 'Samferda.is', detail: 'Isländische Mitfahrgelegenheit, Benzinkostenteilung', price: '' },
        { emoji: '✈️', name: 'Inlandsflüge', detail: 'Reykjavik-Akureyri (Icelandair Connect)', price: '' },
        { emoji: '⛴️', name: 'Fähre Smyril Line', detail: 'Dänemark → Färöer → Island (Seyðisfjörður)', price: '' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mär', level: 'bad' },
        { name: 'Apr', level: 'bad' }, { name: 'Mai', level: 'ok' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Aug', level: 'great' }, { name: 'Sep', level: 'ok' },
        { name: 'Okt', level: 'bad' }, { name: 'Nov', level: 'bad' }, { name: 'Dez', level: 'bad' },
      ]},
      { type: 'text', text: 'Ausschließlich Juni bis August. Fast 24 Stunden Licht, mehr Verkehr (Touristen), milde Temperaturen (10-15°C). Mai und September möglich, aber kälter und weniger Autos. Winter: nahezu unmöglich (Dunkelheit, Stürme, sehr wenige Autos).' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Isländer sind gastfreundlich und vertrauensvoll dank der historischen Isolation und der kleinen Bevölkerung (~370.000). Tourismus ist ein wichtiger Wirtschaftszweig, daher sind die Einheimischen an Besucher gewöhnt. Isländer in großen 4x4 halten öfter an als Touristen in Mietwagen (oft voll).' },
      { type: 'sub', title: 'Veranstaltungen' },
      { type: 'event', items: [
        { month: 'Feb', day: '⟳', name: 'Þorrablót', desc: 'Wikinger-Food-Festival mit traditionellen Gerichten.' },
        { month: 'Jun', day: '17', name: 'Nationalfeiertag', desc: 'Unabhängigkeitsfeier, Umzüge.' },
        { month: 'Aug', day: '⟳', name: 'Þjóðhátíð (Vestmannaeyjar)', desc: 'Größtes Festival Islands, Musik und Lagerfeuer.' },
      ]},
    ]},
  },

  // ==================== FINLAND ====================
  FI: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Trampen ist in Finnland legal. Auf Autobahnen (Moottoritie) und bestimmten Schnellstraßen (Moottoriliikennetie) verboten. An Auffahrten (oft mit Bushaltestelle) und Tankstellen erlaubt.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Finnland ist ein gemischtes Land zum Trampen. Finnen sind introvertiert und zögern, Fremde mitzunehmen. Der Süden und die Städte (Helsinki, Tampere) sind schwierig. Aber je weiter nördlich du kommst (Lappland), desto einfacher wird es.' },
      { type: 'sub', title: 'Lappland-Paradox' },
      { type: 'text', text: 'In Lappland gibt es manchmal nur 5 Autos pro Stunde auf Nebenstraßen. Aber die Fahrer legen sehr lange Strecken zurück und schätzen die Gesellschaft. Sie halten leichter an, besonders bei schlechtem Wetter (Mitgefühl).' },
      { type: 'tip', text: '💡 Finnische Fahrer brauchen einen sicheren Platz zum Anhalten. Positioniere dich dort, wo eindeutig Platz zum Parken ist.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Finnland gehört zu den sichersten Ländern der Welt. Keine Vorfälle von Trampern berichtet. Die Samen werden als "zu den freundlichsten und hilfsbereitesten Menschen gehörend" beschrieben.' },
      { type: 'sub', title: 'Notrufnummern' },
      { type: 'kv', items: [{ k: 'Notruf', v: '112' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Finnland und Skandinavien werden als "die perfekte Region beschrieben, um als Frau das Trampen auszuprobieren". Die Stellung der Frau in der nordischen Gesellschaft ist sehr hoch und du wirst nirgendwo belästigt.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Die meisten Finnen sprechen Englisch, besonders junge Leute und in Städten. Finnisch und Schwedisch sind die Amtssprachen. Finnisch unterscheidet sich stark von den skandinavischen Sprachen und ist schwer zu lernen.' },
      { type: 'phrase', items: [
        { local: 'Kiitos paljon', meaning: 'Vielen Dank' },
        { local: 'Kyyti', meaning: 'Eine Mitfahrgelegenheit' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Lebensmittel sind im Vergleich zum Rest Europas sehr teuer. Die Kombination Trampen + Wildcampen (Jokamiehenoikeus) + Kochen auf dem Kocher ist die Budget-Strategie.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Das Jokamiehenoikeus (Jedermannsrecht) erlaubt es, kostenlos auf unkultiviertem Land zu campen. Du darfst Beeren, Pilze sammeln und mit der Angel fischen.' },
      { type: 'rule', icon: '✅', text: 'Kostenloses Camping auf unkultiviertem Gelände, 1-2 Nächte.' },
      { type: 'rule', icon: '🚫', text: 'Lagerfeuer sind NICHT Teil des Jokamiehenoikeus. Nur an ausgewiesenen Feuerstellen.' },
      { type: 'rule', icon: '🚫', text: 'In Nationalparks: nur auf ausgewiesenen Zeltplätzen.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Onnibus', detail: 'Fernbusse, sehr günstig', price: 'ab 1 €' },
        { emoji: '🚌', name: 'FlixBus', detail: 'Einige Linien in Finnland', price: 'ab 5 €' },
        { emoji: '🚃', name: 'VR (finnische Züge)', detail: 'Frühzeitig buchen für Rabatte', price: '' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mär', level: 'bad' },
        { name: 'Apr', level: 'ok' }, { name: 'Mai', level: 'good' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Aug', level: 'good' }, { name: 'Sep', level: 'ok' },
        { name: 'Okt', level: 'bad' }, { name: 'Nov', level: 'bad' }, { name: 'Dez', level: 'bad' },
      ]},
      { type: 'warn', text: '⚠️ Im Juni-Juli in Lappland sind Mücken ein großes Problem. Bringe Insektenschutzmittel und ein Moskitonetz mit.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Finnen sind zurückhaltend, aber die Begegnungen sind herzlich, sobald der Kontakt hergestellt ist. In Lappland sind die Menschen besonders gastfreundlich. Die Gastfreundschaft ist aufrichtig.' },
      { type: 'sub', title: 'Veranstaltungen' },
      { type: 'event', items: [
        { month: 'Feb', day: '⟳', name: 'Markt von Jokkmokk', desc: 'Historischer samischer Markt in Lappland (auch auf schwedischer Seite).' },
        { month: 'Jun', day: '⟳', name: 'Juhannus (Mittsommer)', desc: 'Sommersonnenwende, Lagerfeuer, Saunas, See.' },
        { month: 'Jul', day: '⟳', name: 'Frauentragen-WM', desc: 'Frauentrag-Rennen in Sonkajärvi. Ja, das gibt es wirklich.' },
        { month: 'Dez', day: '⟳', name: 'Weihnachtsmanndorf (Rovaniemi)', desc: 'Wintertourismus, Nordlichter.' },
      ]},
    ]},
  },

  // ==================== DENMARK ====================
  DK: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Trampen ist in Dänemark legal, außer auf Autobahnen (Fußgänger verboten). Du kannst von den Auffahrten aus trampen. Grenzkontrollen möglich: habe immer deinen Reisepass dabei.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Dänemark ist eines der besten Länder Europas zum Trampen, vergleichbar mit Serbien. Wartezeit: maximal 10 bis 20 Minuten. Die Leute sind entspannt und bringen dich hin, wo du willst.' },
      { type: 'text', text: 'Die Fahrten sind kurz (einige Dutzend km bis zur nächsten Stadt), plane also mehrere Mitfahrgelegenheiten pro Tag ein. Fähren gehören zum Erlebnis: sie sind oft kostenlos für Fußgänger oder werden pro Fahrzeug berechnet.' },
      { type: 'tip', text: '💡 Das flache Gelände und das dichte Straßennetz machen Dänemark sehr zugänglich. Es ist ein ausgezeichnetes Land für Tramper-Anfänger.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Sehr sicheres Land. Dänische Fahrer werden als sympathisch, großzügig und offen beschrieben. Jung, alt, Männer, Frauen: alle halten an.' },
      { type: 'sub', title: 'Notrufnummern' },
      { type: 'kv', items: [{ k: 'Notruf', v: '112' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Dänemark ist sicher für allein trampende Frauen. Mitfahrgelegenheiten kommen von Personen jeden Alters und Geschlechts. Die Praxis ist so normalisiert, dass alle anhalten.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'ALLE Fahrer sprechen Englisch. Im Westen und Süden des Landes sprechen viele auch Deutsch. Kommunikation ist kein Problem.' },
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Dänemark ist das günstigste der 5 nordischen Länder, aber im Vergleich zum Rest Europas immer noch teuer. Discounter: Netto, Rema 1000, Lidl. Street Food (Hotdogs, Shawarma) ist relativ erschwinglich.' },
    ]},
    sleep: { filterTypes: ['b', 'q', 'a'], blocks: [
      { type: 'text', text: 'Dänemark hat KEIN Jedermannsrecht wie Norwegen oder Schweden. Wildcampen ist verboten (Bußgeld 40-135 €). Aber es gibt kostenlose legale Alternativen.' },
      { type: 'sub', title: 'Kostenlose Alternativen' },
      { type: 'rule', icon: '✅', text: 'Fri Teltning: 275+ kostenlose Campingzonen in Staatswäldern. Max. 1 Nacht, max. 2 kleine Zelte, kein Auto.' },
      { type: 'rule', icon: '✅', text: 'Shelterplads: kostenlose Waldunterstände in vielen Wäldern verfügbar.' },
      { type: 'rule', icon: '✅', text: 'Naturlagerplätze: Naturcampingplätze bei Bauern oder auf Gemeindeland, ~3 €/Nacht, max. 2 Nächte.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'FlixBus', detail: 'Umfangreiches Netz in Dänemark', price: 'ab 5 €' },
        { emoji: '🚃', name: 'DSB (dänische Züge)', detail: 'Orange-Tickets (Frühbucher = sehr günstig)', price: '' },
        { emoji: '⛴️', name: 'Fähren', detail: 'Zwischen den Inseln, manche kostenlos für Fußgänger', price: '' },
        { emoji: '🚲', name: 'Fahrrad', detail: 'Dänemark ist flach mit ausgezeichneten Radwegen', price: '' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mär', level: 'ok' },
        { name: 'Apr', level: 'good' }, { name: 'Mai', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Aug', level: 'great' }, { name: 'Sep', level: 'good' },
        { name: 'Okt', level: 'ok' }, { name: 'Nov', level: 'bad' }, { name: 'Dez', level: 'bad' },
      ]},
      { type: 'text', text: 'Mai bis September. Dänemark hat ein milderes Klima als die anderen nordischen Länder. Sommer: 15-22°C, lange Tage. Winter: nicht empfehlenswert (kalt, feucht, dunkel, wenige Autos).' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Dänen sind die entspanntesten aller Nordeuropäer beim Trampen. Freundlich, offen, hilfsbereit. Es ist üblich, einen Kaffee angeboten zu bekommen und von Umwegen zu profitieren, um am richtigen Ort abgesetzt zu werden.' },
      { type: 'sub', title: 'Veranstaltungen' },
      { type: 'event', items: [
        { month: 'Jun', day: '23', name: 'Sankt Hans Aften', desc: 'Johannisfeuer an den Stränden. Nationale Tradition.' },
        { month: 'Jul', day: '⟳', name: 'Roskilde Festival', desc: 'Größtes Musikfestival Nordeuropas, 130.000 Besucher.' },
        { month: 'Dez', day: '⟳', name: 'Weihnachtsmärkte (Tivoli)', desc: 'Tivoli Gardens in Kopenhagen, märchenhaft.' },
      ]},
    ]},
  },
  // ==================== UNITED KINGDOM ====================
  GB: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Trampen ist im Vereinigten Königreich legal. Auf Autobahnen (Motorways) ist das Gehen verboten. Man trampt von den Auffahrten (Slip Roads) und an Raststätten (Motorway Services).' },
      { type: 'sub', title: 'Nach Nation' },
      { type: 'rule', icon: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', text: 'Schottland: auch auf Schnellstraßen mit Doppelfahrbahn erlaubt (A9, A90). Wildcampen legal.' },
      { type: 'rule', icon: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', text: 'Wales: keine besonderen Einschränkungen. Gastfreundliche ländliche Mentalität.' },
      { type: 'rule', icon: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', text: 'England: legal, aber weniger praktiziert und schwieriger.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Das Vereinigte Königreich variiert stark nach Region. Wenige Autofahrer halten in England an, aber in Schottland und Wales ist es deutlich einfacher.' },
      { type: 'sub', title: 'Nach Region' },
      { type: 'kv', items: [
        { k: 'Schottische Highlands', v: 'Ausgezeichnet (1 von 5 Autos)', color: 'green' },
        { k: 'Ländliches Wales', v: 'Gut und angenehm', color: 'green' },
        { k: 'Südwest-England', v: 'In Ordnung', color: 'green' },
        { k: 'Nordengland', v: 'Mittel', color: 'amber' },
        { k: 'Südost / London', v: 'Sehr schwierig', color: 'red' },
      ]},
      { type: 'text', text: 'Die NC500 (North Coast 500) in Schottland ist im Sommer ausgezeichnet: Touristen aus aller Welt. Fort William ist ein idealer Knotenpunkt. In England halten am ehesten ehemalige Studenten der 70er-80er Jahre an.' },
      { type: 'tip', text: '💡 Verwende Autobahnnamen (M4, M1) auf deinem Schild statt Städtenamen. Das ist die britische Konvention für Langstrecken-Trampen.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Das Vereinigte Königreich ist insgesamt sicher. Die mediale Angst übersteigt das tatsächliche Risiko bei weitem. Die Polizei ist generell verständnisvoll und kann dir sogar helfen, einen besseren Spot zu finden.' },
      { type: 'sub', title: 'Notrufnummern' },
      { type: 'kv', items: [{ k: 'Notruf', v: '999 oder 112' }] },
    ]},
    women: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'Männer halten häufiger an als Frauen, um Tramper mitzunehmen. Paradoxerweise sagen viele Fahrer, dass sie eher für eine Frau als für einen einzelnen Mann anhalten würden.' },
      { type: 'text', text: 'Reisende haben Schottland und Wales allein durchquert, ohne Probleme. Wildcampen in Schottland ist legal und sehr sicher.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Keine Barriere. Englisch überall. Manche regionale Akzente (schottische Highlands, ländliches Wales) können stark sein, aber die Kommunikation ist nie ein Problem.' },
      { type: 'text', text: 'Im Vereinigten Königreich sagt man "lift" für eine Mitfahrt und "lorry" für einen LKW.' },
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Das Vereinigte Königreich ist teuer, aber Trampen hilft erheblich. Währung: Pfund Sterling (GBP).' },
      { type: 'sub', title: 'Günstig essen' },
      { type: 'rule', icon: '🛒', text: 'Aldi und Lidl für Einkäufe. Early-Bird-Menüs in Restaurants vor 18 Uhr.' },
      { type: 'sub', title: 'Unterkünfte' },
      { type: 'kv', items: [{ k: 'YHA Hostels (Schlafsaal)', v: '15 bis 30 £/Nacht' }] },
    ]},
    sleep: { filterTypes: ['b', 'q', 'a'], blocks: [
      { type: 'text', text: 'Die Regeln variieren erheblich nach Nation.' },
      { type: 'sub', title: 'Schottland' },
      { type: 'rule', icon: '✅', text: 'Wildcampen fast überall LEGAL (Scottish Outdoor Access Code). Ausnahme: Loch Lomond Park im Sommer (Genehmigung erforderlich).' },
      { type: 'rule', icon: '✅', text: 'Bothies: halb verlassene Schäferhütten, kostenlos, gepflegt von der Mountain Bothies Association.' },
      { type: 'sub', title: 'England und Wales' },
      { type: 'rule', icon: '🚫', text: 'Wildcampen technisch verboten (zivilrechtlicher Verstoß, nicht strafrechtlich). Ausnahme: Dartmoor National Park (ausgewiesene Zonen).' },
      { type: 'rule', icon: '✅', text: 'Nearly Wild Camping: Netzwerk von 100+ Plätzen für naturnahe Camper.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Megabus', detail: 'Sehr günstige Überlandbusse', price: 'ab 1 £' },
        { emoji: '🚌', name: 'National Express', detail: 'Größtes Fernbus-Netz', price: 'ab 2 £' },
        { emoji: '🚌', name: 'FlixBus', detail: 'Hauptlinien', price: 'ab 5 £' },
        { emoji: '🚗', name: 'BlaBlaCar', detail: 'Mitfahrgelegenheit', price: '' },
      ]},
      { type: 'tip', text: '💡 Fähren (Dover, Holyhead) berechnen pro Fahrzeug. Du kannst kostenlos übersetzen, indem du einen Fahrer mit Platz findest.' },
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mär', level: 'ok' },
        { name: 'Apr', level: 'good' }, { name: 'Mai', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'good' }, { name: 'Aug', level: 'good' }, { name: 'Sep', level: 'great' },
        { name: 'Okt', level: 'ok' }, { name: 'Nov', level: 'bad' }, { name: 'Dez', level: 'bad' },
      ]},
      { type: 'warn', text: '⚠️ In Schottland sind Midges (Stechmücken) von Mai bis September aggressiv, am schlimmsten Juli-August. Bringe guten Insektenschutz mit.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Trampen war in den 70er-80er Jahren im Vereinigten Königreich sehr beliebt (50% der über 55-Jährigen haben es gemacht). Nur 7% der 18-24-Jährigen haben es versucht. Die Praxis gilt als überholt, aber wer anhält, sind oft nostalgische Ex-Tramper.' },
      { type: 'sub', title: 'Was funktioniert' },
      { type: 'rule', icon: '😁', text: 'Ein breites Lächeln und Augenkontakt mit jedem Fahrer. Auffällige Kleidung zieht positive Aufmerksamkeit an.' },
      { type: 'rule', icon: '📋', text: 'An Raststätten Fahrer ansprechen, die das Gebäude betreten/verlassen, nicht an der Zapfsäule ("Health and Safety").' },
      { type: 'sub', title: 'Veranstaltungen' },
      { type: 'event', items: [
        { month: 'Jun', day: '⟳', name: 'Glastonbury Festival', desc: 'Größtes Musikfestival der Welt, Somerset.' },
        { month: 'Aug', day: '⟳', name: 'Edinburgh Fringe', desc: 'Größtes Kunstfestival der Welt, 3 Wochen.' },
        { month: 'Nov', day: '5', name: 'Bonfire Night', desc: 'Feuerwerk im ganzen Land.' },
      ]},
    ]},
  },

  // ==================== IRELAND ====================
  IE: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Trampen ist in Irland legal, außer auf Autobahnen (Motorways). In der Praxis greift die Polizei (Gardaí) selbst auf Schnellstraßen selten ein. Wenn sie es tut, leitet sie dich zu einem sichereren Ort.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Irland ist eines der besten Länder Europas zum Trampen. Die durchschnittliche Wartezeit beträgt 5 Minuten. Autos bremsen manchmal schon ab, wenn sie dich am Straßenrand sehen, ohne dass du überhaupt den Daumen rausstreckst.' },
      { type: 'sub', title: 'Warum es so gut funktioniert' },
      { type: 'text', text: 'Viele ländliche Gebiete haben keinen öffentlichen Nahverkehr. Fahrten zu geben gehört zum Alltag. Iren sind gesellig und schätzen die Unterhaltung. Ein neuer Tramper = ein neuer Gesprächspartner.' },
      { type: 'sub', title: 'Nach Zone' },
      { type: 'kv', items: [
        { k: 'Westküste (Wild Atlantic Way)', v: 'Ausgezeichnet', color: 'green' },
        { k: 'Kleine ländliche Städte', v: 'Ausgezeichnet (neugierige Leute)', color: 'green' },
        { k: 'Nationalstraßen (R)', v: 'Sehr gut', color: 'green' },
        { k: 'Autobahnkreisverkehre', v: 'Gut (< 5 Min)', color: 'green' },
        { k: 'Dublin / Cork / Limerick', v: 'Schwierig zum Starten', color: 'amber' },
      ]},
      { type: 'tip', text: '💡 Viele kurze Fahrten sind schneller als auf eine lange zu warten. Ein Schild mit dem Namen der nächsten Stadt verkürzt die Wartezeit. Starte morgens früh, um die LKW zu erwischen.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Irland gilt als eines der sichersten Länder der Welt für Reisende. Trampen ist dort eine uralte Tradition und generell sehr sicher.' },
      { type: 'sub', title: 'Notrufnummern' },
      { type: 'kv', items: [
        { k: 'Notruf', v: '112 oder 999' },
        { k: 'Gardaí (Polizei)', v: '112' },
      ]},
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Irland gilt als eines der sichersten Länder für alleinreisende Frauen. Die Erfahrungen sind überwiegend positiv. Die üblichen Vorsichtsmaßnahmen gelten.' },
      { type: 'text', text: 'Der Wild Atlantic Way eignet sich sehr gut zum Trampen zu zweit, mit Wartezeiten von 5 bis 15 Minuten.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Englisch ist die Alltagssprache überall in Irland. Irisch-Gälisch (Gaeilge) wird im Alltag nur von ~4% der Bevölkerung gesprochen, in den Gaeltacht-Gebieten (Westküste). Selbst dort spricht jeder Englisch.' },
      { type: 'phrase', items: [
        { local: 'Dia dhuit', meaning: 'Hallo (auf Gälisch)' },
        { local: 'Go raibh maith agat', meaning: 'Danke (auf Gälisch)' },
      ]},
      { type: 'tip', text: '💡 Ein paar Worte Gälisch in den ländlichen Gebieten des Westens erzeugen sofortige Herzlichkeit bei den Einheimischen.' },
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Irland ist mäßig teuer. Die Kombination Trampen + Camping + Einladungen der Einheimischen macht das Reisen sehr erschwinglich.' },
      { type: 'sub', title: 'Unterkünfte' },
      { type: 'kv', items: [
        { k: 'Hostels (Schlafsaal)', v: '20 bis 50 €/Nacht' },
        { k: 'B&B mit Frühstück', v: '60 bis 80 €/Nacht' },
      ]},
      { type: 'rule', icon: '🛒', text: 'Aldi und Lidl für Einkäufe. Early-Bird-Menüs in Restaurants vor 18 Uhr.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wildcampen wird in Irland geduldet und ist weitgehend ungeregelt. Leere Felder sind "wenige Minuten von jeder Stadt entfernt" verfügbar. Bauern um Erlaubnis zu fragen wird empfohlen, aber es ist ihnen oft egal.' },
      { type: 'rule', icon: '✅', text: 'Kostenloses Camping auf unkultivierten Feldern (mit stillschweigender Erlaubnis).' },
      { type: 'rule', icon: '🚫', text: 'Meide Felder mit Feldfrüchten oder Vieh.' },
      { type: 'rule', icon: '🚫', text: 'Kein sichtbares Feuer von Straßen oder Häusern.' },
      { type: 'warn', text: '⚠️ Irland ist sehr feucht. Ein Zelt mit hoher Wasserdichtigkeit (>3000mm) ist essenziell. Die Herausforderung ist nicht starker Regen, sondern anhaltender Nieselregen, der tagelang dauern kann.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Bus Éireann', detail: 'Nationaler Busdienst', price: '' },
        { emoji: '🚌', name: 'Dublin Coach / GoBus / Citylink', detail: 'Günstigere Überlandbusse', price: '' },
        { emoji: '🚗', name: 'BlaBlaCar', detail: 'Aktiv in Irland', price: '' },
        { emoji: '🚃', name: 'Irish Rail', detail: 'Begrenztes Netz, moderate Preise', price: '' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mär', level: 'ok' },
        { name: 'Apr', level: 'good' }, { name: 'Mai', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'good' }, { name: 'Aug', level: 'good' }, { name: 'Sep', level: 'great' },
        { name: 'Okt', level: 'good' }, { name: 'Nov', level: 'bad' }, { name: 'Dez', level: 'bad' },
      ]},
      { type: 'text', text: 'Mai-Juni: bestes Wetter, längste Tage. September-Oktober: weniger Touristen, niedrigere Preise, Herbstfarben. Das irische Wetter ist extrem unberechenbar: es kann jederzeit regnen.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Trampen ist tief in der irischen Kultur verwurzelt. In ländlichen Gebieten ohne öffentliche Verkehrsmittel gehört das Mitnehmen seit Jahrzehnten zum Alltag. Iren sind gesellig und gastfreundlich.' },
      { type: 'sub', title: 'Was funktioniert' },
      { type: 'rule', icon: '🗣️', text: 'Iren lieben es zu plaudern. Sei offen für Gespräche, stelle Fragen über die Region.' },
      { type: 'rule', icon: '🎒', text: 'Halte deinen Rucksack klein. Große Taschen schrecken ab. Nur solo oder zu zweit (3+ = nahezu unmöglich).' },
      { type: 'sub', title: 'Veranstaltungen' },
      { type: 'event', items: [
        { month: 'Mär', day: '17', name: 'St Patrick\'s Day', desc: 'Nationalfeiertag. Feierlichkeiten im ganzen Land und weltweit.' },
        { month: 'Mai', day: '⟳', name: 'Fleadh Cheoil', desc: 'Festival traditioneller irischer Musik.' },
        { month: 'Sep', day: '⟳', name: 'Galway Oyster Festival', desc: 'Austernfestival, das älteste Food-Festival Irlands.' },
        { month: 'Okt', day: '⟳', name: 'Bram Stoker Festival (Dublin)', desc: 'Halloween-Festival. Die Wiege von Halloween ist irisch.' },
      ]},
      { type: 'tip', text: '💡 Die gesamte irische Gesellschaft beteiligt sich an der Tramper-Tradition: von Bauern bis IT-Fachleuten, alle halten an.' },
    ]},
  },

  // ==================== CROATIA ====================
  HR: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Trampen ist in Kroatien legal. Du kannst an Mautstellen trampen. Die Polizei kümmert sich generell nicht darum.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Mäßig bis einfach im Sommer an der Küste (selten mehr als 20 Min Wartezeit). Schwierig im Winter, wenn die Küstenstädte zu "Geisterstädten" werden. Mautstellen sind die besten Spots.' },
      { type: 'sub', title: 'Küstentipp' },
      { type: 'text', text: 'Nebenstraßen entlang der Küste funktionieren besser als Autobahnen, da Einheimische sie nutzen, um Mautgebühren zu vermeiden. Grenzschlangen am Wochenende (10+ km) schaffen einzigartige Gelegenheiten.' },
      { type: 'warn', text: '⚠️ LANDMINEN in Zentralkroatien (nicht an der Küste). Überprüfe immer die Minenfeldkarte (misportal.hcr.hr), bevor du markierte Wege verlässt.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Insgesamt sicher. Die Küste ist vollständig entmint. Küstenstraßen können gefährlich sein (Berg auf einer Seite, Klippe auf der anderen). Vorsicht als Fußgänger.' },
      { type: 'kv', items: [{ k: 'Notruf', v: '112' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Kroatien gilt als ausgezeichnetes Reiseziel für alleinreisende Frauen. Das Sicherheitsgefühl ist hoch. Zum Trampen wird empfohlen, zu zweit zu reisen.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Kroatisch ist die Amtssprache. 95% der 15-34-Jährigen sprechen eine Fremdsprache (vor allem Englisch). Italienisch ist an der Küste weit verbreitet.' },
      { type: 'phrase', items: [
        { local: 'Mogu li dobiti prijevoz do...?', meaning: 'Kann ich eine Mitfahrt nach... bekommen?' },
        { local: 'Hvala!', meaning: 'Danke!' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Teurer als andere Balkanländer, besonders im Sommer an der Küste. Burek: ~1 €. Hostels: 15-25 €/Nacht. Mahlzeit: 5-10 €.' },
    ]},
    sleep: { filterTypes: ['b', 'q', 'a'], blocks: [
      { type: 'text', text: 'Wildcampen ist nicht erlaubt (Bußgelder). Couchsurfing funktioniert gut. Erschwingliche Campingplätze verfügbar. Besuche im Mai/Juni/September für niedrigere Preise.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Überlandbusse', detail: 'Umfangreiches und erschwingliches Netz', price: '' },
        { emoji: '⛴️', name: 'Katamarane zu den Inseln', detail: 'Schneller und günstiger als Autofähren', price: '' },
        { emoji: '🚗', name: 'BlaBlaCar (blablacar.hr)', detail: 'Aktiv in Kroatien', price: '' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mär', level: 'ok' },
        { name: 'Apr', level: 'good' }, { name: 'Mai', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'good' }, { name: 'Aug', level: 'good' }, { name: 'Sep', level: 'great' },
        { name: 'Okt', level: 'ok' }, { name: 'Nov', level: 'bad' }, { name: 'Dez', level: 'bad' },
      ]},
      { type: 'text', text: 'Mai-Juni und September: ideal (schönes Wetter, weniger überlaufen, günstiger). Juli-August: einfach für Fahrten, aber sehr überlaufen und teuer an der Küste.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Kroaten werden als "extrem offen, freundlich und gastfreundlich" beschrieben. Die 3 S des Trampens in Kroatien: Lächeln, Sonnencreme und ein Blatt mit deinem Ziel.' },
      { type: 'event', items: [
        { month: 'Jul', day: '⟳', name: 'Ultra Europe (Split)', desc: 'Elektronisches Musikfestival, 150.000 Besucher.' },
        { month: 'Jul-Aug', day: '⟳', name: 'Sommerfestival Dubrovnik', desc: 'Theater, Musik, Tanz über 6 Wochen.' },
      ]},
    ]},
  },

  // ==================== SLOVENIA ====================
  SI: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Trampen ist in Slowenien legal und wird praktiziert. Es ist verboten, Autobahnen zu Fuß zu überqueren. Das Land ist klein genug, um in ~3 Stunden durchquert zu werden.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Gutes Land zum Trampen. Wartezeit generell unter 15 Minuten. Fahrer freuen sich, Tramper zu sehen, und erzählen oft von ihren eigenen Tramper-Geschichten aus der Jugend.' },
      { type: 'tip', text: '💡 Slowenien beherbergt das einzige Tramper-Museum der Welt.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Sehr sicher. Slowenien ist eines der sichersten Länder Europas. Keine Landminen. Keine besonderen Bedenken für Tramper.' },
      { type: 'kv', items: [{ k: 'Notruf', v: '112' }] },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Ausgezeichnetes Englischniveau. Die Mehrheit der Slowenen spricht auch Deutsch und etwas Italienisch. Zwei regionale Begrüßungen: "Živjo" (Ljubljana) und "Zdravo" (Maribor).' },
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Teurer als andere Balkanländer, aber günstiger als Westeuropa. Das Fahrrad-Sharing in Ljubljana: 1 €/Woche oder 3 €/JAHR. Bus: 1,30 € (90 Min). Hostels: 15-25 €/Nacht.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wildcampen offiziell verboten, aber das Gesetz wird selten durchgesetzt, solange du kein Feuer machst. Frage Grundstückseigentümer um Erlaubnis, in ihrem Garten zu campen. Couchsurfing aktiv in Ljubljana.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Bus', detail: 'Gut vernetztes Netz', price: '' },
        { emoji: '🚗', name: 'BlaBlaCar', detail: 'Aktiv in Slowenien', price: '' },
        { emoji: '🚲', name: 'Fahrrad-Sharing Ljubljana', detail: 'Unglaublich günstig', price: '3 €/Jahr' },
      ]},
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Trampen ist in Slowenien kulturell akzeptiert und nostalgisch besetzt. Fahrer erzählen von ihren Jugenderlebnissen. Junge Leute verstehen und praktizieren es. Es wird als das "tramperfreundlichste" Balkanland beschrieben.' },
      { type: 'event', items: [
        { month: 'Feb', day: '⟳', name: 'Kurentovanje (Ptuj)', desc: 'Größter Karneval Sloweniens, traditionelle Kurent-Masken.' },
        { month: 'Jun', day: '⟳', name: 'Festival Ljubljana', desc: 'Musik, Theater, Tanz in der Altstadt.' },
      ]},
    ]},
  },

  // ==================== ALBANIA ====================
  AL: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Kein Gesetz gegen Trampen in Albanien. Achtung: nahe der griechischen Grenze (Kakavia) behaupten "Taxi-Mafias" fälschlicherweise, dass Trampen illegal sei, um dich zu zwingen, ein Taxi zu nehmen. Gehe an den Taxiständen vorbei, bevor du den Daumen rausstreckst.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Albanien ist ein wahres Paradies zum Trampen und das einfachste Land auf dem Balkan. Wartezeit generell unter 15 Minuten. Etwa alle 5 Minuten kommt ein Auto auf den Hauptstraßen vorbei.' },
      { type: 'sub', title: 'Entscheidende Unterscheidung' },
      { type: 'text', text: 'Viele Autos, die anhalten, sind tatsächlich inoffizielle Privattaxis. Sage deutlich "autostop, jo lek" (Trampen, kein Geld) und zeige deinen Daumen, um Missverständnisse zu vermeiden.' },
      { type: 'text', text: 'Manche Fahrer bieten spontan den Trampern Geld an. Die albanische Gastfreundschaft ist legendär.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Insgesamt sicher. Gewaltkriminalität gegenüber Touristen ist nahezu inexistent. Fahrer machen Umwege, um zu helfen. Achtung auf die Straßenverhältnisse (schlechte Straßen, unberechenbares Fahren) und wenig Verkehr in den nördlichen Bergen.' },
      { type: 'kv', items: [{ k: 'Notruf', v: '112' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Albanien ist sicher für alleinreisende Frauen. Straßenbelästigung ist selten. Trampen funktioniert gut für alleinreisende Frauen, mit Wartezeiten von 15-20 Minuten.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Albanisch ist eine einzigartige Sprache (nicht slawisch). Junge Städter sprechen fließend Englisch. Erwarte kein Englisch bei über 30-Jährigen. Italienisch und Griechisch sind verbreitet. Deutsch wird von manchen verstanden (Diaspora in Deutschland/Schweiz).' },
      { type: 'phrase', items: [
        { local: 'Autostop, jo lek', meaning: 'Trampen, kein Geld' },
        { local: 'Faleminderit', meaning: 'Danke' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Das günstigste Land auf dem Balkan. Ein 2-wöchiger Aufenthalt ist für unter 200 € möglich. Hostel: ~10 €/Nacht mit Frühstück. Die Furgons (Minibusse) decken das Land für wenige Euro ab.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wildcampen ist in Albanien offiziell erlaubt, eines der wenigen europäischen Länder. Meide Nationalparks, Reservate, Privatgrundstücke und Regierungsgebäude. Die Strände nördlich von Durrës eignen sich zum Zelten.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚐', name: 'Furgons (Minibusse)', detail: 'Rückgrat des albanischen Transports. Kein fester Fahrplan, hebe die Hand zum Anhalten.', price: '~3,50 €/120 km' },
        { emoji: '🚌', name: 'Reguläre Busse', detail: 'Hauptlinien zwischen Großstädten', price: '' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mär', level: 'ok' },
        { name: 'Apr', level: 'good' }, { name: 'Mai', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'good' }, { name: 'Aug', level: 'good' }, { name: 'Sep', level: 'great' },
        { name: 'Okt', level: 'good' }, { name: 'Nov', level: 'ok' }, { name: 'Dez', level: 'bad' },
      ]},
      { type: 'text', text: 'Mai-Juni und September-Oktober: ideal. Die Bergstraßen im Norden können im Winter unpassierbar sein.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Die albanische Gastfreundschaft ist legendär. Fahrer machen kilometerlange Umwege zum Helfen, bieten Mahlzeiten, Raki, Kaffee, Souvenirs und sogar Geld an. Das Konzept des "Besa" (heiliger Ehrenkodex und Gastfreundschaft) ist tief verankert.' },
      { type: 'event', items: [
        { month: 'Mär', day: '14', name: 'Dita e Verës (Elbasan)', desc: 'Frühlingsfest, die älteste albanische Tradition.' },
        { month: 'Aug', day: '⟳', name: 'Kala Festival (Dhermi)', desc: 'Musikfestival an einem Strand der albanischen Riviera.' },
      ]},
    ]},
  },

  // ==================== SERBIA ====================
  RS: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Trampen auf Autobahnen wird "ungern gesehen, aber du wirst keine Probleme bekommen". Die Polizei leitet Tramper zu den Ausfahrten weiter. Mautstellen gelten als normale und legale Tramper-Standorte.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Schwierig. Durchschnittliche Wartezeit: 2-3 Stunden. Fahrer direkt an kleinen Tankstellen ansprechen funktioniert deutlich besser als der Daumen am Straßenrand. Tagsüber machbar. Nachts sehr schwer (schlechte Straßenbeleuchtung).' },
      { type: 'tip', text: '💡 Beste Strategie in Serbien: Trampen und günstige Busse abwechseln. Lokale Busse zwischen Kleinstädten dienen als "Sprungbretter", wenn das Trampen nicht klappt.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Tagsüber sicher. Serbische Fahrer sind freundlich, sobald sie anhalten.' },
      { type: 'warn', text: '⚠️ Nachts werden gelegentlich Überfälle auf Rastplätzen gemeldet. Halte nach Einbruch der Dunkelheit an 24h-Tankstellen oder Motels.' },
      { type: 'kv', items: [{ k: 'Notruf', v: '112' }] },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Serbisch ist die Hauptsprache (kyrillisches und lateinisches Alphabet). Englisch nimmt bei jungen Leuten zu, ist aber auf dem Land begrenzt. Sprecher slawischer Sprachen (Tschechisch, Slowakisch, Polnisch, Russisch) haben einen sprachlichen Vorteil.' },
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Günstig im Vergleich zu Ungarn oder Westeuropa. Pljeskavica (Lokalgericht): 2-3 €. Hostel: 8-12 €/Nacht. Flug nach Niš: manchmal 10 €.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wildcampen offiziell verboten, aber "generell geduldet". Couchsurfing aktiv in Belgrad. Sehr erschwingliche Hostels.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Bus', detail: 'Deckt das ganze Land ab, günstig', price: '' },
        { emoji: '🚗', name: 'BlaBlaCar (blablacar.rs)', detail: 'Aktiv in Serbien', price: '' },
      ]},
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Serben werden als "freundlich und sehr offen für Begegnungen" beschrieben, sobald der Kontakt hergestellt ist. Die Herausforderung ist, sie zum Anhalten zu bringen. Der Mix aus Trampen + günstigen Bussen ist die beste Strategie.' },
      { type: 'event', items: [
        { month: 'Jul', day: '⟳', name: 'EXIT Festival (Novi Sad)', desc: 'Eines der größten Musikfestivals Europas, in der Festung Petrovaradin.' },
        { month: 'Aug', day: '⟳', name: 'Guča Trompetenfestival', desc: 'Trompeten- und Balkanmusikfestival. 600.000 Besucher.' },
      ]},
    ]},
  },

  // ==================== BOSNIA AND HERZEGOVINA ====================
  BA: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Trampen ist in Bosnien-Herzegowina legal. Die Polizei wird dir keine Probleme machen.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Variabel je nach Quelle und Standort. Manche Reisende haben nie länger als 10 Minuten gewartet (Strecke Split-Mostar-Sarajevo). Andere hatten sehr lange Wartezeiten. Der niedrige Autobesitz bedeutet weniger Langstreckenfahrzeuge.' },
      { type: 'warn', text: '⚠️ LANDMINEN. Verlasse NIEMALS die Straßen, um ins Gebüsch oder verlassene Gebäude zu gehen, in Gebieten, die du nicht kennst. Manche Häuser sind seit dem Krieg noch vermint.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Insgesamt sicher für Tramper. Von niederländischen Quellen als "sicherer als Belgien" beschrieben. Die Gastfreundschaft gegenüber Ausländern ist bemerkenswert herzlich.' },
      { type: 'kv', items: [{ k: 'Notruf', v: '112' }] },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Bosnisch, Kroatisch und Serbisch werden alle gesprochen (gegenseitig verständlich). Viele Einwohner sprechen dank der Nachkriegsemigration Englisch. Die Erwähnung, woher du kommst, hilft, Vertrauen aufzubauen, da viele Bosnier Verwandte im Ausland haben.' },
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Eines der günstigsten Balkanländer. Burek: ~1 €. Hostel in Sarajevo: 10-15 €/Nacht. Zigaretten (<3 €/Packung) sind nützlich als Dankeschön-Geschenk.' },
      { type: 'tip', text: '💡 "KM" auf Schildern kann die Währung bedeuten (Konvertible Mark), nicht Kilometer!' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wildcampen offiziell verboten, aber generell geduldet. Einheimische sind unglaublich gastfreundlich: Bauern bieten Duschen und Kaffee, Fahrer laden Tramper zum Übernachten ein.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Busse und Züge sehr günstig. Wenige Autobahnen. Die Kombination Trampen + öffentliche Verkehrsmittel ist der empfohlene Ansatz.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Bosnier sind "sehr herzlich und freundlich" mit einem Stolz darauf, Touristen zu empfangen. Fahrer nehmen Tramper mit nach Hause zum Essen und Kaffeetrinken, fahren über ihr Ziel hinaus, um sie an einem besseren Ort abzusetzen.' },
      { type: 'rule', icon: '🚬', text: 'Beim Aussteigen ein paar Zigaretten anzubieten ist eine wirkungsvolle Dankeschön-Geste, die Sprachbarrieren überbrückt.' },
      { type: 'event', items: [
        { month: 'Aug', day: '⟳', name: 'Sarajevo Film Festival', desc: 'Internationales Filmfestival, während der Belagerung gegründet.' },
      ]},
    ]},
  },

  // ==================== MONTENEGRO ====================
  ME: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Keine spezifische gesetzliche Einschränkung zum Trampen gefunden. Keine Berichte über polizeiliche Einmischung.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Schwierig. Montenegro wird regelmäßig als eines der schwierigsten Balkanländer zum Trampen genannt. Montenegriner nehmen Tramper ungern mit. Die meisten Reisenden, die Erfolg haben, werden von Albanern oder anderen Ausländern mitgenommen, nicht von Einheimischen.' },
      { type: 'text', text: 'Der Verkehr ist spärlich, die kurvenreichen Bergstraßen machen das Anhalten schwierig. Direktes Ansprechen an Tankstellen funktioniert besser als der Daumen am Straßenrand.' },
      { type: 'tip', text: '💡 Die Fähre von Kotor ist kostenlos und spart viel Zeit auf dem Weg nach Podgorica.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Sicheres Land. Anders als seine Nachbarn hat Montenegro die Konflikte der 90er Jahre vermieden, daher keine Landminen. Die engen Küstenstraßen und Tunnel sind das Hauptrisiko für Fußgänger.' },
      { type: 'kv', items: [{ k: 'Notruf', v: '112' }] },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Montenegrinisch (im Wesentlichen identisch mit Serbisch/Bosnisch/Kroatisch). Viele Leute fühlen sich mit Italienisch wohler als mit Englisch. Russisch wird ebenfalls verstanden (zahlreiche russische Bewohner im Sommer).' },
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Mittelklasse für den Balkan (teurer als Albanien/Bosnien, günstiger als Kroatien). Hostels: 12-20 €/Nacht. Mahlzeit: 5-8 €.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wildcampen offiziell verboten, aber geduldet, wenn du dich normal verhältst und Strände sowie touristische Gebiete meidest.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Bus', detail: 'Zuverlässigste Option, deckt die meisten Routen ab', price: '' },
        { emoji: '⛴️', name: 'Fähre von Kotor', detail: 'Kostenlos, essenziell um Podgorica zu erreichen', price: 'kostenlos' },
      ]},
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Gemischte Gastfreundschaft. Der Empfang kann kalt sein im Vergleich zu Nachbarländern, und die meisten Begegnungen finden mit Expatriates statt, nicht mit Einheimischen. Manche Montenegriner sind jedoch sehr gastfreundlich. Konsens: Montenegro ist keine tramperfreundliche Kultur im Vergleich zu seinen Nachbarn.' },
    ]},
  },

  // ==================== NORTH MACEDONIA ====================
  MK: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Kein spezifisches Gesetz gegen Trampen gefunden. Keine Berichte über polizeiliche Einmischung.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Einfach. Beschrieben als "eines der besten europäischen Länder zum Trampen". Wartezeit generell unter 20-30 Minuten. An Tankstellen nahe Skopje kommen Fahrten in 5-10 Minuten.' },
      { type: 'text', text: 'Herausforderung: ländliche/Bergstraßen mit sehr wenig Verkehr (weniger als 100 Autos/Stunde). Bei wenig Verkehr sei darauf vorbereitet, lange mit ausgestrecktem Daumen zu gehen.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Sehr sicher. Einheimische sind nicht nur gastfreundlich, sondern oft beschützend gegenüber Besuchern.' },
      { type: 'kv', items: [{ k: 'Notruf', v: '112' }] },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Mazedonisch (slawisch) und Albanisch sind die Hauptsprachen. Englisch nimmt zu, ist aber außerhalb von Skopje und Ohrid begrenzt. Kennzeichenabkürzungen sind nützlich: SK=Skopje, OH=Ohrid, BT=Bitola.' },
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Sehr günstig. Unter den erschwinglichsten Balkanländern. Hostels: 8-12 €/Nacht.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wildcampen offiziell verboten, aber "generell geduldet" (gleiches Schema wie Serbien/Bosnien). Reisende werden manchmal eingeladen, bei Familien zu schlafen.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Busnetz deckt die Hauptrouten ab. Furgon-Minibusse in manchen Gebieten. Internationale Busse nach Albanien (Ohrid-Pogradec), Kosovo, Serbien und Griechenland.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Die Leute sind "extrem freundlich und besonders fasziniert von Reisenden". Fahrer zeigen aufrichtiges Interesse und bieten ihre Hilfe an, ohne Bezahlung zu erwarten. Die Atmosphäre wird als "gemütlich" beschrieben (entspannt, ohne Hektik).' },
      { type: 'event', items: [
        { month: 'Jul', day: '⟳', name: 'Ohrid Sommerfestival', desc: 'Musik, Theater und Tanz am Ohridsee, UNESCO-Welterbe.' },
      ]},
    ]},
  },

  // ==================== POLAND ====================
  PL: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Trampen ist in Polen auf normalen Straßen legal. Es wurde vom Nationalen Tourismusbüro von 1958 bis Mitte der 90er offiziell organisiert ("Akcja Autostop"), mit Heften, Coupons und einer Lotterie für Fahrer.' },
      { type: 'rule', icon: '🚫', text: 'Auf Autobahnen und Schnellstraßen verboten. An Tankstellen, Mautstellen und Auffahrten erlaubt.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Historisch eines der tramperfreundlichsten Länder Europas. Durchschnittliche Wartezeit: 15 Min bis 1 Std. Allerdings zeigen neuere Berichte (2023) eine Verschlechterung: 30 Min bis 3 Std Wartezeit, Polen halten zunehmend ungern an.' },
      { type: 'sub', title: 'Netzwerk-Trick' },
      { type: 'text', text: 'Polen hat "zu viele Straßen" (4-5 mögliche Routen für jedes Ziel). Akzeptiere Fahrten in die ungefähre Richtung statt auf die exakte Route. LKW-Fahrer nutzen manchmal CB-Funk, um die nächste Fahrt für dich zu organisieren.' },
      { type: 'tip', text: '💡 Zeige deinen Rucksack gut sichtbar, um wie ein "professioneller Tramper" auszusehen. Das beruhigt polnische Fahrer.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Sicheres Land, unter den 25 sichersten der Welt. Die Polizei ist freundlich gegenüber Trampern, die die Regeln beachten.' },
      { type: 'kv', items: [{ k: 'Notruf', v: '112' }] },
      { type: 'warn', text: '⚠️ Im Norden Polens im Sommer stehen Prostituierte am Straßenrand. Alleinreisende Frauen können verwechselt werden. Tipp: keine freizügige Kleidung tragen, den Rucksack vor sich halten.' },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Polen steht auf Platz 12 der sichersten Länder für alleinreisende Frauen (Note 4,7/5). Das Sicherheitsgefühl ist hoch. Siehe die Warnung oben für den Norden des Landes im Sommer.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: '~24% sprechen Englisch, ~20% Russisch, ~12% Deutsch. Junge Leute (77% der Studenten) sprechen Fremdsprachen. LKW-Fahrer sprechen oft nur Polnisch. Polen reagieren sehr positiv auf Ausländer, die Polnisch versuchen.' },
      { type: 'phrase', items: [
        { local: 'Dzień dobry', meaning: 'Guten Tag' },
        { local: 'Dziękuję', meaning: 'Danke' },
        { local: 'Skąd najlepiej łapać stopa do...?', meaning: 'Wo ist der beste Platz zum Trampen nach...?' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Eines der günstigsten EU-Länder. Backpacker-Budget: 25-35 €/Tag. Hostel: 13-16 €/Nacht. Lokale Mahlzeit: 5-7 €. Die MOP (Raststätten) bieten kostenlose Duschen mit warmem Wasser.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Seit Mai 2021 sind 600.000 Hektar in 425 Waldgebieten legal zum Campen geöffnet (max. 9 Personen, max. 2 Nächte). Nutze die App mBDL, um legale Zonen zu finden (orange Zonen).' },
      { type: 'rule', icon: '✅', text: '425 legale Waldcampingzonen (App mBDL)' },
      { type: 'rule', icon: '🚫', text: 'Verboten in Nationalparks und Naturschutzgebieten (besonders die Hohe Tatra)' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'FlixBus / PolskiBus', detail: 'Extrem günstig (Angebote ab 0,23 €)', price: 'ab 1 €' },
        { emoji: '🚗', name: 'BlaBlaCar', detail: 'Sehr beliebt ("E-Trampen")', price: '' },
        { emoji: '📱', name: 'jakdojade.pl', detail: 'App für alle polnischen Verkehrsmittel', price: '' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mär', level: 'ok' },
        { name: 'Apr', level: 'good' }, { name: 'Mai', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Aug', level: 'great' }, { name: 'Sep', level: 'good' },
        { name: 'Okt', level: 'ok' }, { name: 'Nov', level: 'bad' }, { name: 'Dez', level: 'bad' },
      ]},
      { type: 'text', text: 'Sommer: optimal. Winter: sehr schwierig (bis -20°C, kurze Tage, eingeschränkte Sicht).' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Tiefe Tramper-Kultur, verwurzelt im offiziellen kommunistischen Programm (1958-1995). Viele heutige Fahrer haben in ihrer Jugend getrampt. Polen wirken beim ersten Kontakt kühl, tauen aber schnell auf.' },
      { type: 'event', items: [
        { month: 'Aug', day: '⟳', name: 'Pol\'and\'Rock Festival', desc: 'Größtes kostenloses Festival Europas (ehem. Woodstock Polen), 750.000 Besucher.' },
        { month: 'Nov', day: '1', name: 'Allerheiligen (Wszystkich Świętych)', desc: 'Friedhöfe mit Kerzen beleuchtet. Einzigartiges Schauspiel.' },
        { month: 'Dez', day: '⟳', name: 'Weihnachtsmärkte', desc: 'Krakau und Breslau haben die schönsten.' },
      ]},
    ]},
  },

  // ==================== CZECH REPUBLIC ====================
  CZ: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Trampen ist auf normalen Straßen in Tschechien legal. Direkt auf Autobahnen und Schnellstraßen verboten. An Auffahrten und Tankstellen erlaubt.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Eines der tramperfreundlichsten Länder Europas. Auf normalen Straßen kommt eine Fahrt in der Regel in 10 Minuten. Es ist ein Transitland mit viel internationalem Verkehr und LKW-Fahrern.' },
      { type: 'text', text: 'An Autobahnauffahrten in Stadtnähe kannst du auf 3 bis 6 andere Tramper treffen. Fahrten werden in der Reihenfolge der Ankunft oder nach Ziel vergeben.' },
      { type: 'tip', text: '💡 Alle tschechischen Autobahnen (1, 2, 5, 8, 11) führen von/nach Prag. Vermeide es, vor Prag festzusitzen: fahre in die Stadt und starte von dort neu.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Sicher. Kriminalität beschränkt sich auf Taschendiebe in touristischen Gebieten. Die deutsche Polizei kontrolliert manchmal Dokumente an der tschechisch-deutschen Grenze.' },
      { type: 'kv', items: [{ k: 'Notruf', v: '112' }] },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Ältere Fahrer: nur Tschechisch, manchmal Russisch, selten Deutsch. Jüngere: zumindest Grundkenntnisse in Englisch. LKW-Fahrer sind freundlich und sprechen generell Tschechisch + etwas Deutsch.' },
      { type: 'phrase', items: [
        { local: 'Dobrý den', meaning: 'Guten Tag' },
        { local: 'Jedete do...?', meaning: 'Fahren Sie nach...?' },
        { local: 'Děkuji', meaning: 'Danke' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Backpacker-Budget: 35-55 €/Tag. Prag ist deutlich teurer als der Rest des Landes. Währung: Tschechische Krone (CZK), nicht Euro. Camping sehr günstig (~3 € in manchen Städten).' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wildcampen verboten, aber Biwakieren für eine Nacht wird geduldet (Schlafsack, Hängematte, Biwaksack, kein Zelt). Hinterlasse keine Spuren. Verboten in Nationalparks und Reservaten.' },
      { type: 'rule', icon: '✅', text: 'Kostenlose Holzunterstände ("bouda" oder "útulna") in manchen Wandergebieten verfügbar.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'RegioJet', detail: 'Günstiger und komfortabler tschechischer Bus (CZ, SK, PL, AT, HU)', price: 'ab 5 €' },
        { emoji: '🚌', name: 'FlixBus', detail: 'Umfangreiches Netz', price: 'ab 5 €' },
        { emoji: '🚗', name: 'BlaBlaCar', detail: 'Aktiv in Tschechien', price: '' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'ok' }, { name: 'Feb', level: 'ok' }, { name: 'Mär', level: 'ok' },
        { name: 'Apr', level: 'good' }, { name: 'Mai', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Aug', level: 'great' }, { name: 'Sep', level: 'good' },
        { name: 'Okt', level: 'ok' }, { name: 'Nov', level: 'ok' }, { name: 'Dez', level: 'ok' },
      ]},
      { type: 'text', text: 'Sommer: optimal, besonders auf der Achse Tschechien-Kroatien (Lieblings-Urlaubsziel der Tschechen). Die Prager Weihnachtsmärkte ziehen im Winter Verkehr an.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Starke Tramper-Tradition, gesellschaftlich akzeptiert als "alltägliche Transportform". Eine Facebook-Gruppe verbindet tschechische und slowakische Tramper.' },
      { type: 'event', items: [
        { month: 'Jul', day: '⟳', name: 'Colours of Ostrava', desc: 'Multikulturelles Musikfestival, Ostrava.' },
        { month: 'Dez', day: '⟳', name: 'Prager Weihnachtsmärkte', desc: 'Unter den schönsten Europas.' },
      ]},
    ]},
  },

  // ==================== SLOVAKIA ====================
  SK: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Trampen ist auf normalen Straßen in der Slowakei legal. Auf Autobahnen verboten. Achtung: die slowakische Polizei ahndet Tramper auf Autobahnen (strenger als Nachbarländer). Nutze Tankstellen und Auffahrten.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Widersprüchliche Meinungen. Manche finden die Slowakei "sehr einfach" (unter 30 Min Wartezeit). Andere bewerten sie als schwierig (5/10) mit bis zu 2 Std Wartezeit. Hängt wahrscheinlich vom Standort und der Jahreszeit ab.' },
      { type: 'text', text: 'Das Land ist ziemlich bergig (60%+ des Territoriums), was viele natürliche Gelegenheiten schafft. Die Autobahnen D1 und E77 sind die besten Achsen. Bratislava ist ein zentraler Knotenpunkt Mitteleuropas.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Sicheres Land. Die beste Kombination: zu zweit gemischt reisen (Mann und Frau).' },
      { type: 'kv', items: [{ k: 'Notruf', v: '112' }] },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Englisch und Deutsch werden von manchen gesprochen, besonders jüngeren. Russisch wird von Älteren verstanden, aber "nicht unbedingt geschätzt". Im Süden: Ungarisch ist nützlich. Grundkenntnisse in Slowakisch werden sehr geschätzt.' },
      { type: 'phrase', items: [
        { local: 'Dobrý deň', meaning: 'Guten Tag' },
        { local: 'Idete do...?', meaning: 'Fahren Sie nach...?' },
        { local: 'Ďakujem', meaning: 'Danke' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Backpacker-Budget: 40-50 €/Tag. Hostel: 16-22 €/Nacht. Lokale Mahlzeit: 8-10 €.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wildcampen offiziell verboten, aber außerhalb von Nationalparks (besonders Hohe Tatra) geduldet. Notbiwak (Schlafsack + Plane, kein Zelt) ist generell unproblematisch.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'RegioJet', detail: 'Tschechischer Bus mit umfangreichen slowakischen Routen', price: '' },
        { emoji: '🚌', name: 'FlixBus', detail: 'Deckt die Slowakei ab', price: 'ab 5 €' },
        { emoji: '🤝', name: 'Lokale Mitfahrgelegenheit', detail: 'Lokale Mitfahr-Plattformen aktiv in der Slowakei', price: '' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mär', level: 'ok' },
        { name: 'Apr', level: 'good' }, { name: 'Mai', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Aug', level: 'great' }, { name: 'Sep', level: 'good' },
        { name: 'Okt', level: 'ok' }, { name: 'Nov', level: 'bad' }, { name: 'Dez', level: 'bad' },
      ]},
      { type: 'text', text: 'Sommer: optimal. Winter: deutlich längere Wartezeiten, strenge Kälte in den Bergen. Sonntags: Geschäfte geschlossen (religiöse Tradition), reduzierte Verkehrsmittel.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Slowaken werden als "unglaublich freundlich" beschrieben und tun ihr Bestes, damit du dich wohlfühlst. Manche laden Tramper zum Familienessen ein oder auf ein Getränk mit Freunden. Bezahlung wird nie erwartet.' },
      { type: 'event', items: [
        { month: 'Jul', day: '⟳', name: 'Pohoda Festival', desc: 'Größtes Musikfestival der Slowakei, Trenčín.' },
      ]},
    ]},
  },

  // ==================== HUNGARY ====================
  HU: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Trampen ist in Ungarn legal. Lange Tradition: die Mehrheit der Ungarn hat in ihrer Jugend getrampt oder Tramper mitgenommen. Als Fußgänger auf Autobahnen verboten.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Relativ einfach, besonders auf dem Land. Wartezeit selten über 90 Minuten im Sommer. Tankstellen sind die besten Spots.' },
      { type: 'sub', title: 'Besonderheiten' },
      { type: 'rule', icon: '📋', text: 'Ein Schild mit deinem Ziel ist NOTWENDIG. Viele Ungarn verstehen die Daumen-Geste nicht als Tramper-Zeichen.' },
      { type: 'text', text: 'Manche rumänische und ungarische Fahrer könnten eine Bezahlung verlangen. Lehne höflich ab und warte auf eine andere Fahrt. Mitfahrten in LKW sind sehr selten (Versicherungsgründe).' },
      { type: 'warn', text: '⚠️ Nachts haben die Fahrer Angst vor DIR. Trampe nur tagsüber.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Sicher und politisch stabil. Das Leitungswasser ist überall trinkbar.' },
      { type: 'kv', items: [{ k: 'Notruf', v: '112' }] },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Die größte Sprachbarriere der 4 Länder. Ungarisch ist eine finno-ugrische Sprache, ohne Bezug zu slawischen oder germanischen Sprachen. Weniger Leute sprechen Fremdsprachen als in Nachbarländern. Ein Ungarisch-Sprachführer wird dringend empfohlen.' },
      { type: 'phrase', items: [
        { local: 'Jó napot', meaning: 'Guten Tag' },
        { local: 'Köszönöm', meaning: 'Danke' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Backpacker-Budget: 25-45 €/Tag. Budapest ist günstig für eine europäische Hauptstadt. Hostel (Schlafsaal): ab ~10 €. Lokale Mahlzeit: 6-7 €.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wildcampen legal erlaubt, aber sehr eingeschränkt: maximal 24 Stunden am selben Ort. Verboten in Nationalparks (häufige Patrouille von Rangern). Feuerverbot in Trockenperioden.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'FlixBus', detail: 'Umfangreiches Netz ab Budapest', price: 'ab 5 €' },
        { emoji: '🚗', name: 'BlaBlaCar', detail: 'Aktiv in Ungarn', price: '' },
        { emoji: '🚃', name: 'Züge', detail: 'Gut in der EU vernetzt, Interrail-Pass gültig', price: '' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mär', level: 'ok' },
        { name: 'Apr', level: 'good' }, { name: 'Mai', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'good' }, { name: 'Aug', level: 'good' }, { name: 'Sep', level: 'great' },
        { name: 'Okt', level: 'good' }, { name: 'Nov', level: 'ok' }, { name: 'Dez', level: 'ok' },
      ]},
      { type: 'text', text: 'Frühling und Herbst: ideal. Sommer: viel Verkehr (Sziget Festival, Balaton-Tourismus), aber kann sehr heiß werden (+35°C im Juli). Die Budapester Weihnachtsmärkte ziehen im Winter Verkehr an.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Lange Tramper-Tradition, von der Mehrheit der Ungarn praktiziert. Landbewohner sind sehr freundlich und hilfsbereit. Frage nach Fahrten Richtung Budapest statt Umfahrung: Transitfahrer (Rumänen, Serben, Bulgaren, Türken) umfahren oft die Stadt über den Ring.' },
      { type: 'event', items: [
        { month: 'Aug', day: '⟳', name: 'Sziget Festival (Budapest)', desc: 'Eines der größten Musikfestivals Europas, auf einer Donau-Insel.' },
        { month: 'Aug', day: '⟳', name: 'Balaton-Festival', desc: 'Sommer am Plattensee, viel Verkehr in der Region.' },
        { month: 'Dez', day: '⟳', name: 'Budapester Weihnachtsmärkte', desc: 'Unter den schönsten Europas.' },
      ]},
    ]},
  },

  // ==================== ROMANIA ====================
  RO: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Trampen ist in Rumänien legal. Seit ~2014 ist es Fahrern verboten, von Trampern Geld zu verlangen (bezahltes Trampen ist illegal). Auf Autobahnen verboten. In der Praxis trampt jeder.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Sehr einfach. Eines der tramperfreundlichsten Länder Europas. Wartezeit: 2 Minuten bis 1,5 Stunden je nach Standort. Trampen ist ein gängiges Transportmittel (begrenzte öffentliche Verkehrsmittel, wenige Autobahnen). Du kannst mit Einheimischen an den Stadtausgängen um Fahrten konkurrieren.' },
      { type: 'text', text: 'Rumänen verwenden 2-Buchstaben-Codes für Bezirke auf Schildern (z.B. CJ = Cluj). Nutze ein Schild. Kreisverkehre an Stadtausgängen und Nationalstraßen (E) funktionieren am besten.' },
      { type: 'warn', text: '⚠️ Manche illegale Fahrer zielen auf Ausländer ab und verlangen überhöhte Preise (bis zu 100 €). Sage immer "fără bani" (ohne Geld) oder "nu am bani" (ich habe kein Geld) VOR dem Einsteigen.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Insgesamt sicher. Rumänische Fahrer sind notorisch aggressiv am Steuer (gefährliches Überholen, hohe Geschwindigkeit). Schnall dich an. Streunende Hunde häufig auf dem Land.' },
      { type: 'kv', items: [{ k: 'Notruf', v: '112' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Generell sicher für alleinreisende Frauen. Die Solo-Erfahrungen sind überwiegend positiv. Ländliche Gebiete sind besonders gastfreundlich.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Rumänisch ist eine romanische Sprache (lateinisches Alphabet). Französisch-, Italienisch- und Spanischsprecher haben einen bedeutenden Vorteil. Junge Stadtbewohner sprechen gut Englisch. Auf dem Land und bei älteren Fahrern kann die Kommunikation schwierig sein. In Siebenbürgen wird Ungarisch gesprochen.' },
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Eines der günstigsten Länder Europas. Backpacker-Budget: unter 30 €/Tag. Hostel: ~10 €/Nacht. Restaurantessen: 7-10 €. BlaBlaCar ist beliebt und erschwinglich.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wildcampen ist auf öffentlichem Land LEGAL (nicht in Nationalparks, Naturschutzgebieten, noch im Donaudelta). Achtung vor Bären in den Karpaten. Couchsurfing aktiv, besonders in Cluj-Napoca und Bukarest. TrustRoots beliebt bei Trampern.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚗', name: 'BlaBlaCar', detail: 'Sehr beliebt in Rumänien', price: '' },
        { emoji: '🚌', name: 'FlixBus', detail: 'Hauptrouten', price: 'ab 5 €' },
        { emoji: '🚃', name: 'Züge', detail: 'Langsam, aber günstig', price: '' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mär', level: 'ok' },
        { name: 'Apr', level: 'great' }, { name: 'Mai', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'good' }, { name: 'Aug', level: 'good' }, { name: 'Sep', level: 'great' },
        { name: 'Okt', level: 'good' }, { name: 'Nov', level: 'ok' }, { name: 'Dez', level: 'bad' },
      ]},
      { type: 'text', text: 'April-Oktober: ideal. Die Transfăgărășan (schönste Bergstraße) ist nur von Juni bis Oktober geöffnet. Winter: gefährliche Straßen, kurze Tage.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Trampen ist tief in der rumänischen Kultur verankert. Es ist ein gängiges Transportmittel, nicht nur für Reisende. Die Stadtausgänge haben eigene Abholzonen. Fahrer sind unglaublich freundlich, großzügig und neugierig auf Ausländer. Siebenbürgen ist die gastfreundlichste Region.' },
      { type: 'event', items: [
        { month: 'Aug', day: '⟳', name: 'Untold Festival (Cluj)', desc: 'Eines der größten Musikfestivals Osteuropas.' },
        { month: 'Sep', day: '⟳', name: 'George Enescu Festival (Bukarest)', desc: 'Weltbekanntes Festival für klassische Musik.' },
      ]},
    ]},
  },

  // ==================== BULGARIA ====================
  BG: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Kein Gesetz verbietet Trampen in Bulgarien, außer auf den wenigen echten Autobahnabschnitten. Es ist ein Erbe der sozialistischen Zeit, weitgehend akzeptiert.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Sehr einfach, besonders auf der Achse Sofia-Plovdiv (Europa-Türkei-Korridor). Ost-West ist einfacher als Nord-Süd. Im Sommer ist die Schwarzmeerküste beliebt, aber mit Konkurrenz.' },
      { type: 'text', text: 'LKW-Fahrer (TIR) sind zahlreich und bereit, Passagiere mitzunehmen. Achtung im Sommer (35°C+): LKW müssen von 13 bis 21 Uhr parken. Starte früh morgens.' },
      { type: 'warn', text: '⚠️ Schreibe dein Ziel in KYRILLISCH. Das verbessert die Chancen, dass Fahrer anhalten, erheblich.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Insgesamt sicher, aber mit spezifischen Warnungen. Aggressives Fahren ist üblich. Die Polizei kann Pässe kontrollieren und an Grenzen möglicherweise Bestechung suchen. Inhaber westlicher Pässe werden selten behelligt.' },
      { type: 'kv', items: [{ k: 'Notruf', v: '112' }] },
      { type: 'tip', text: '💡 In Bulgarien sind die Kopfgesten für "Ja" und "Nein" gegenüber dem Westen vertauscht (Nicken = Nein, Kopfschütteln = Ja). Viele Bulgaren haben sich an westliche Konventionen angepasst, aber Verwirrung ist häufig.' },
    ]},
    women: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'Generell sicher für alleinreisende Frauen. Kriminalität ist gering und Einheimische sind hilfsbereit.' },
      { type: 'warn', text: '⚠️ Auf den Hauptachsen (Sofia-Istanbul, Sofia-Varna) sind Sexarbeiterinnen am Straßenrand präsent. Frauen sollten sich schlicht kleiden und sich von diesen Zonen fernhalten. Nutze nur den erhobenen Daumen (Handwinken kann mit einem Locksignal verwechselt werden).' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Bulgarisch verwendet das kyrillische Alphabet, was eine bedeutende Barriere darstellt. Englisch ist außerhalb der Großstädte begrenzt. Kommunikation beruht oft auf Gesten. Fahrer bieten häufig Rakia (handgemachten Schnaps) als soziale Geste an.' },
      { type: 'phrase', items: [
        { local: 'Avtostop', meaning: 'Trampen' },
        { local: 'Blagodarya', meaning: 'Danke' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Unter den günstigsten Ländern Europas. Backpacker-Budget: ~30 €/Tag. Reichhaltiges Restaurantessen für unter 15 €. Hostel: 8-12 €/Nacht.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wildcampen technisch verboten, aber außerhalb von touristischen Gebieten, Städten und Naturschutzgebieten weitgehend geduldet. Bis zu 1.000 € Bußgeld in Schutzgebieten. Feuer sind außerhalb öffentlicher Feuerstellen strikt verboten. Krapets (rumänische Grenze) hat eine kostenlose Wildcamping-Zone am Strand.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Facebook-Mitfahr-Gruppen sind in Bulgarien beliebter als BlaBlaCar. Schneller und günstiger als Busse. Busse und Minibusse verbinden die meisten Städte. Züge existieren, sind aber langsam.' },
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mär', level: 'ok' },
        { name: 'Apr', level: 'good' }, { name: 'Mai', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'good' }, { name: 'Aug', level: 'good' }, { name: 'Sep', level: 'great' },
        { name: 'Okt', level: 'good' }, { name: 'Nov', level: 'ok' }, { name: 'Dez', level: 'bad' },
      ]},
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Trampen hat sozialistische Wurzeln. Viele ältere Fahrer sind nostalgisch und gastfreundlich. Fahrer sind neugierig, freundlich und gastfreundlich. Rakia wird als soziale Geste geteilt.' },
      { type: 'event', items: [
        { month: 'Jun', day: '⟳', name: 'Rosenfestival (Kazanlak)', desc: 'Feier der Rosenernte, jahrhundertealte Tradition.' },
        { month: 'Jul', day: '⟳', name: 'July Morning (Küste)', desc: 'Hippie-Treffen zum Sonnenaufgang an den Schwarzmeerstränden.' },
      ]},
    ]},
  },

  // ==================== LITHUANIA ====================
  LT: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Trampen auf Autobahnen ist nicht ausdrücklich verboten (aber das Gehen darauf schon). In der Praxis stehen Tramper ohne Probleme nahe den Autobahnen. Schulkinder gehen entlang der Straßen, also sind Fahrer daran gewöhnt.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Litauen wird als "Paradies für Tramper" beschrieben. Wartezeit: 30 bis 90 Minuten, unter 30 Minuten zu zweit.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Keine größeren Bedenken. Das Land ist sehr sicher. Zu zweit reisen reduziert die Risiken erheblich.' },
      { type: 'kv', items: [{ k: 'Notruf', v: '112' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Die baltischen Staaten werden als "Paradies für Tramperinnen" und "sehr frauenfreundlich" beschrieben.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Litauisch ist die Hauptsprache. Englischsprecher sind außerhalb von Vilnius begrenzt. Fahrer sind trotz Sprachbarriere freundlich. Eine SIM-Karte kostet ~0,30 € an Kiosken (nützlich für Übersetzungs-Apps).' },
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Backpacker-Budget: ~45 €/Tag. Züge sind extrem günstig (oft unter 2 €/Fahrt).' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wildcampen ist in Litauen LEGAL, außer in Naturschutzgebieten, Stadtgebieten, Stränden und auf Privatgrundstücken.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Lux Express', detail: 'Busse zwischen baltischen Hauptstädten', price: '~25 €' },
        { emoji: '🚃', name: 'Züge', detail: 'Vilnius-Riga direkt (seit 2023), sehr günstig', price: 'ab 2 €' },
        { emoji: '🤝', name: 'Lokale Mitfahrgelegenheit', detail: 'Litauische Mitfahr-Plattformen', price: '' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mär', level: 'bad' },
        { name: 'Apr', level: 'ok' }, { name: 'Mai', level: 'good' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Aug', level: 'great' }, { name: 'Sep', level: 'good' },
        { name: 'Okt', level: 'ok' }, { name: 'Nov', level: 'bad' }, { name: 'Dez', level: 'bad' },
      ]},
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Etablierte Tramper-Kultur. Lokale Tramper-Clubs sind aktiv. Die Menschen sind schüchtern, aber freundlich. Vergleichbar mit Polen in Bezug auf die Tramper-Kultur.' },
    ]},
  },

  // ==================== LATVIA ====================
  LV: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Kein Gesetz verbietet Trampen in Lettland. Erlaubt, solange du die Verkehrssicherheit nicht gefährdest.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Ziemlich einfach. Die Leute sind an Tramper auf den Hauptstraßen (E67/Via Baltica) und auf dem Land gewöhnt. Viele junge Letten trampen im Sommer zu Festivals oder nach Hause.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Sicher und ruhig. Das Land ist sehr sicher. Die Straßenverhältnisse verschlechtern sich im Winter und frühen Frühling.' },
      { type: 'kv', items: [{ k: 'Notruf', v: '112' }] },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Bevölkerung geteilt zwischen Lettisch- und Russischsprechern. Die meisten Erwachsenen beherrschen beides. Junge Leute sprechen generell gut Englisch. Kostenloses WLAN in fast allen Städten (Bibliotheken, Stadtzentren).' },
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Backpacker-Budget: ~45 €/Tag. Züge oft unter 2 €/Fahrt.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wildcampen ist in Lettland LEGAL, sofern kein ausdrückliches Verbot besteht. Verboten in Naturschutzgebieten, Nationalparks, Dünen mit Vegetation und Stadtstränden. Privatgrundstücke: Genehmigung des Eigentümers erforderlich.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Lux Express', detail: 'Riga-Tallinn (~4 Std, ~20 €), Riga-Vilnius (~4,5 Std, ~25 €)', price: 'ab 15 €' },
        { emoji: '📱', name: 'Facebook-Gruppen', detail: 'Mitfahrgelegenheit nach Route (sehr beliebt)', price: '' },
        { emoji: '🚗', name: 'BlaBlaCar', detail: 'Aktiv in Lettland', price: '' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mär', level: 'bad' },
        { name: 'Apr', level: 'ok' }, { name: 'Mai', level: 'good' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Aug', level: 'great' }, { name: 'Sep', level: 'good' },
        { name: 'Okt', level: 'ok' }, { name: 'Nov', level: 'bad' }, { name: 'Dez', level: 'bad' },
      ]},
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Trampen ist eine akzeptierte Praxis. Letten sind zurückhaltend, aber hilfsbereit. Keine Grenzkontrollen innerhalb des Schengen-Raums mit Estland und Litauen.' },
      { type: 'event', items: [
        { month: 'Jun', day: '23-24', name: 'Jāņi (Līgo)', desc: 'Sommersonnenwende, Lagerfeuer, Blumenkränze, das größte lettische Fest.' },
      ]},
    ]},
  },

  // ==================== ESTONIA ====================
  EE: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Trampen ist in Estland legal. Gesetzliche Pflicht nachts: du MUSST einen Leuchtreflektor auf dunklen Straßen tragen. Warnwesten werden empfohlen, können aber dazu führen, dass Fahrer dich für einen Polizisten halten.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Relativ gut. Wartezeit: typischerweise 5-10 Minuten, manchmal 30-90 Minuten. Autos halten auf Autobahnen und kleinen Straßen. Alle Fahrzeugtypen halten an: Autos, LKW, Traktoren, sogar Taxis auf dem Heimweg.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Sehr sicher. Kriminalität beim Trampen ist extrem selten. Achtung vor alkoholisierten Fahrern: meide Autos, deren Insassen betrunken wirken.' },
      { type: 'kv', items: [{ k: 'Notruf', v: '112' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Die baltischen Staaten werden als "Paradies für Tramperinnen" beschrieben. Tallinn ist sehr sicher für alleinreisende Frauen.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Estnisch und Russisch sind die Hauptsprachen. Englisch wird von jungen Leuten und Berufstätigen gut gesprochen. Gespräche laufen je nach Fahrer auf Estnisch, Russisch oder Englisch.' },
      { type: 'phrase', items: [
        { local: 'Aitäh sõidu eest', meaning: 'Danke für die Mitfahrt' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Backpacker-Budget: ~45 €/Tag. Züge extrem günstig. Leitungswasser und Brunnenwasser ist überall in Estland trinkbar.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wildcampen ist in Estland LEGAL, außer auf Privatgrundstücken, in Nationalparks oder Militärzonen. Nimm Proviant mit: wenige Raststätten am Straßenrand.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Lux Express', detail: 'Tallinn-Riga (~4 Std)', price: 'ab 15 €' },
        { emoji: '⛴️', name: 'Fähren', detail: 'Zu den Inseln (Saaremaa, Hiiumaa)', price: '' },
      ]},
      { type: 'text', text: 'Sehr digital vernetztes Land (e-Estonia). Übersetzungs-Apps und Online-Karten funktionieren überall perfekt.' },
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mär', level: 'bad' },
        { name: 'Apr', level: 'ok' }, { name: 'Mai', level: 'good' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Aug', level: 'good' }, { name: 'Sep', level: 'ok' },
        { name: 'Okt', level: 'bad' }, { name: 'Nov', level: 'bad' }, { name: 'Dez', level: 'bad' },
      ]},
      { type: 'text', text: 'Nur im Sommer zuverlässig (fast 24 Std Licht im Juni). Winter: Schnee, Kälte, Dunkelheit. Manche Straßen werden von 110 auf 90 km/h im Winter reduziert.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Esten sind zurückhaltend, aber hilfsbereit. Die Inseln (Kihnu, Saaremaa) bewahren traditionelle Lebensweisen und bieten einzigartige Tramper-Erlebnisse.' },
      { type: 'event', items: [
        { month: 'Jun', day: '23-24', name: 'Jaanipäev (Johannistag)', desc: 'Sommersonnenwende, Lagerfeuer. Größtes estnisches Fest.' },
      ]},
    ]},
  },

  // ==================== TURKEY ====================
  TR: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Trampen ("Otostop") ist in der Türkei nicht ausdrücklich illegal, aber auf Autobahnen (Otoban) verboten. In der Praxis ist die Durchsetzung sehr lasch und die Leute trampen routinemäßig auf den Straßen.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Die Türkei wird von allen Quellen als "Paradies für Tramper" beschrieben. Die Wartezeit übersteigt auf befahrenen Straßen selten 15 Minuten.' },
      { type: 'sub', title: 'Nach Region (vom einfachsten zum schwierigsten)' },
      { type: 'kv', items: [
        { k: 'Südost-Anatolien', v: 'Das erste Auto hält', color: 'green' },
        { k: 'Schwarzmeerküste', v: 'Sehr einfach', color: 'green' },
        { k: 'Zentral-Anatolien', v: '~20 Min Wartezeit', color: 'green' },
        { k: 'Mittelmeerküste', v: 'Länger (bis 2 Std)', color: 'amber' },
        { k: 'Istanbul', v: 'Sehr schwierig (kann 10 Std dauern)', color: 'red' },
      ]},
      { type: 'text', text: 'Auf dem Land reicht es, eine Straße entlangzugehen: Fahrer halten von selbst an, ohne dass du den Daumen rausstreckst.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'In 99% der Fälle verläuft das Trampen gut. In der Osttürkei kann die Polizei misstrauisch gegenüber Ausländern sein (PKK-Spannungen). Sie sind ernst, bieten aber Tee und Respekt.' },
      { type: 'kv', items: [{ k: 'Notruf', v: '112' }] },
      { type: 'warn', text: '⚠️ Meide die Grenzregionen zu Syrien und Irak. Das Außenministerium rät von diesen Gebieten ab.' },
    ]},
    women: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'Das am meisten dokumentierte Thema. Die Türkei gilt als "nicht für Tramper-Anfängerinnen" wenn du allein bist. Der Kleidungsstil ist entscheidend: lange Hosen, Ärmel mindestens bis zum Ellbogen.' },
      { type: 'text', text: 'Die Erfahrungen variieren enorm je nach Kleidung, Verhalten, Sprachkenntnissen und Region. Empfehlung aller Quellen: sicherer zu zweit oder in der Gruppe.' },
      { type: 'phrase', items: [
        { local: 'Çok ayıp', meaning: 'Das ist sehr schlecht (um Verhalten abzuwehren)' },
        { local: 'Evliyim', meaning: 'Ich bin verheiratet' },
      ]},
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Sehr wenige sprechen Englisch (~20% der Fahrer). Google Translate mit Sprachfunktion ist essenziell. Türkisch ist "relativ leicht zu lernen und auszusprechen". Speichere eine vorübersetzte Nachricht, die deine Reise erklärt.' },
      { type: 'phrase', items: [
        { local: 'Otostop', meaning: 'Trampen' },
        { local: 'Param yok', meaning: 'Ich habe kein Geld' },
        { local: 'Nereye gidiyorsunuz?', meaning: 'Wohin fahren Sie?' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Backpacker-Budget: 25-45 €/Tag. Traditionelle Mahlzeit: 3-5 €. Hostel: 5-15 €/Nacht. Fahrer kaufen häufig Tee, Essen und sogar komplette Mahlzeiten. "Essen und Tee im Überfluss."' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wildcampen befindet sich in einer rechtlichen Grauzone. Technisch verboten, aber die Durchsetzung ist lasch. Generell geduldet in ländlichen und bewaldeten Gebieten. An manchen Stränden verboten (Nistplätze für Meeresschildkröten). Einladungen bei Fahrern nach Hause sind extrem häufig.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚐', name: 'Dolmuş (geteilter Minibus)', detail: 'Sehr günstig, kein Fahrplan, hebe die Hand zum Anhalten', price: '1-3 €' },
        { emoji: '🚌', name: 'Überlandbusse', detail: 'Modern, komfortabel, Service an Bord, klimatisiert', price: '' },
      ]},
      { type: 'tip', text: '💡 ~30% der Überlandbusfahrer geben dir eine kostenlose Fahrt, wenn du erklärst, dass du kein Geld hast.' },
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'ok' }, { name: 'Feb', level: 'ok' }, { name: 'Mär', level: 'good' },
        { name: 'Apr', level: 'great' }, { name: 'Mai', level: 'great' }, { name: 'Jun', level: 'good' },
        { name: 'Jul', level: 'ok' }, { name: 'Aug', level: 'ok' }, { name: 'Sep', level: 'great' },
        { name: 'Okt', level: 'great' }, { name: 'Nov', level: 'good' }, { name: 'Dez', level: 'ok' },
      ]},
      { type: 'text', text: 'April ist der beste Monat. Frühling und Herbst ideal. Sommer: sehr heiß (35°C+ an der Südküste und im Landesinneren). Winter: kalt im Landesinneren, mild an der Südküste.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Die türkische Gastfreundschaft ist legendär. Tee wird bei jedem Halt angeboten. Fahrer kaufen Mahlzeiten, machen improvisierte Sightseeing-Touren und laden dich zu sich nach Hause ein. Essen/Getränke annehmen schafft eine Verbindung. Ablehnen kann beleidigen.' },
      { type: 'event', items: [
        { month: 'Apr', day: '23', name: 'Tag der nationalen Souveränität', desc: 'Feiertag, Feierlichkeiten im ganzen Land.' },
        { month: 'Apr-Mai', day: '⟳', name: 'Ramadan und Eid', desc: 'Variable Daten. Während des Ramadan fasten die Menschen tagsüber. Eid ist sehr festlich.' },
        { month: 'Okt', day: '29', name: 'Tag der Republik', desc: 'Größter türkischer Nationalfeiertag.' },
      ]},
    ]},
  },

  // ==================== GEORGIA ====================
  GE: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Keine gesetzlichen Einschränkungen zum Trampen in Georgien. Anders als in den meisten europäischen Ländern kümmert es niemanden, wenn du direkt auf den Autobahnen trampst.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Die meiste Zeit einfach. Durchschnittliche Wartezeit: ~30 Minuten. Auf dem Land halten Fahrer an, auch ohne dass du den Daumen rausstreckst: mit einem Rucksack gehen reicht. Polizeiautos bieten auch Fahrten an und helfen bei der Organisation der Weiterreise.' },
      { type: 'tip', text: '💡 Die georgische Gastfreundschaft ist unglaublich. Fahrer laden dich regelmäßig zum Essen, Trinken und Übernachten ein.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Insgesamt sicher. Das Hauptrisiko ist aggressives Fahren (hohe Geschwindigkeit, ignorierte Verkehrsregeln). Bergstraßen können gefährlich sein. Alkohol abzulehnen (besonders Chacha, den nationalen Schnaps) kann auf dem Land beleidigen.' },
      { type: 'kv', items: [{ k: 'Notruf', v: '112' }] },
    ]},
    women: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'Georgien gilt als sicher für alleinreisende Frauen. Georgische Männer sind gegenüber Frauen generell respektvoll, können aber aufdringlich sein. Sei bestimmt und sie werden aufhören.' },
      { type: 'text', text: 'Manche Fahrer können sozial aufdringlich sein (wiederholte Einladungen, Interesse an Ausländerinnen). Sei bestimmt. Empfehlung: wenn möglich zu zweit reisen.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Ältere sprechen Russisch, Jüngere (<30 Jahre) eher Englisch, besonders in Tiflis und Batumi. In Dörfern gibt es möglicherweise nur Georgischsprecher. Gute Mobilfunkabdeckung für Übersetzungs-Apps.' },
      { type: 'phrase', items: [
        { local: 'Gamarjoba', meaning: 'Hallo' },
        { local: 'Madloba', meaning: 'Danke' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Ultra-Budget möglich: ~6 €/Tag (Camping + Trampen + Kochen). Komfortables Budget: ~30 €/Tag. Hostel in Tiflis: ab 5 €/Nacht. Komplette Mahlzeit: 3-5 €. Metro/Bus in Tiflis: wenige Cents.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wildcampen ist in Georgien auf öffentlichem Land legal. Auf Privatgrundstücken ohne Erlaubnis verboten. Beliebte kostenlose Spots: Kasbegi, Juta-Tal, Udziro-See in Ratscha, Swanetien. Einladungen bei Einheimischen sind häufig.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚐', name: 'Marshrutka (geteilte Minivans)', detail: 'Rückgrat des Transports. Sehr günstig.', price: '1-7 €' },
        { emoji: '🚃', name: 'Züge', detail: 'Sowjetisches Netz. Tiflis-Batumi schnell. Tiflis-Sugdidi Nachtzug.', price: '4-15 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mär', level: 'ok' },
        { name: 'Apr', level: 'good' }, { name: 'Mai', level: 'good' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Aug', level: 'great' }, { name: 'Sep', level: 'great' },
        { name: 'Okt', level: 'good' }, { name: 'Nov', level: 'ok' }, { name: 'Dez', level: 'bad' },
      ]},
      { type: 'text', text: 'Ende Juni bis Ende September: ideal zum Trekking und Trampen in den Bergen (Großer Kaukasus offen Juli-August). Ende September bis Anfang November: 15-20°C in Städten, Herbstfarben.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Die georgische Gastfreundschaft gilt als eine der besten der Welt. Fahrer laden spontan zum Essen, Trinken und Schlafen ein. Chacha (Traubenschnaps) ist das Nationalgetränk. Die georgische Küche ist reichhaltig: Wein, Khinkali (Teigtaschen), Khachapuri (Käsebrot).' },
      { type: 'event', items: [
        { month: 'Okt', day: '14', name: 'Tbilisoba', desc: 'Fest von Tiflis. Musik, Tanz, Gastronomie in der ganzen Stadt.' },
        { month: 'Okt', day: '⟳', name: 'Rtveli (Weinlese)', desc: 'Traubenernte. Georgien ist die Wiege des Weins (8000 Jahre).' },
      ]},
    ]},
  },

  // ==================== ARMENIA ====================
  AM: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Trampen ist in Armenien legal. Keine dokumentierten Einschränkungen. Benutze den erhobenen Daumen (Handfläche nach unten = du willst ein Taxi).' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Mehrere Quellen stufen Armenien als eines der besten Länder der Welt zum Trampen ein. Durchschnittliche Wartezeit: 5-10 Minuten, manchmal unter 5 Minuten.' },
      { type: 'text', text: 'Einheimische trampen ebenfalls, da öffentliche Verkehrsmittel begrenzt und Minivans überfüllt sind. Es ist ein normales Transportmittel. In abgelegenen Gebieten kann der Verkehr sehr gering sein (1 Std+ Wartezeit).' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Armenien ist eines der sichersten Länder der Welt. Das Sicherheitsgefühl ist sehr hoch. Die Polizei ist wohlwollend und hilfsbereit.' },
      { type: 'kv', items: [{ k: 'Notruf', v: '112' }] },
      { type: 'warn', text: '⚠️ Meide die Grenzgebiete zu Aserbaidschan (Minen, militärische Spannungen). Die Strecke Nojemberyan-Idjevan wird speziell abgeraten.' },
    ]},
    women: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'Die Angst lässt von Jahr zu Jahr nach. Manche Fahrer können sozial aufdringlich sein (wiederholte Einladungen, romantisches Interesse). Sei bestimmt und klar. Bevorzuge Autos mit Frauen oder Kindern. Meide alleiniges Reisen in den abgelegenen Gebieten des Südens.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Russisch ist die häufigste Fremdsprache, wird von fast allen gesprochen. Außerhalb von Jerewan unverzichtbar. Englisch ist selten, besonders auf dem Land. Das armenische Alphabet ist einzigartig und die Sprache sehr schwer zu lernen.' },
      { type: 'phrase', items: [
        { local: 'Barev', meaning: 'Hallo' },
        { local: 'Shnorhakalutyun', meaning: 'Danke' },
        { local: 'Anvchar?', meaning: 'Kostenlos?' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Ultra-Budget möglich: ~7 €/Tag. Komfortables Budget: 25-45 €/Tag. Hostel: 8-18 €/Nacht. Lokale Mahlzeit: 3-5 €. Metro in Jerewan: < 0,20 €. Fahrer bieten oft Cola, Eis oder komplette Mahlzeiten kostenlos an.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wildcampen ist auf allem öffentlichen Land ohne Genehmigung legal. Sicher in den meisten Regionen, außer nahe der aserbaidschanischen Grenze. Ab Oktober wird es kalt. Achtung vor Wölfen, Wildtieren und streunenden Hunden. Einheimische sind neugierig und laden dich möglicherweise auf einen Kaffee ein.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚐', name: 'Marshrutkas', detail: 'Überfüllte Minivans, aber günstig. Decken die meisten Routen ab.', price: '0,30-1 €' },
        { emoji: '🚌', name: 'Bus', detail: 'Nur Großstädte', price: '' },
      ]},
      { type: 'warn', text: '⚠️ Daumen hoch = Trampen. Handfläche nach unten = Taxi. Kläre VOR dem Einsteigen, um Geldforderungen zu vermeiden.' },
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mär', level: 'ok' },
        { name: 'Apr', level: 'good' }, { name: 'Mai', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'good' }, { name: 'Aug', level: 'good' }, { name: 'Sep', level: 'great' },
        { name: 'Okt', level: 'good' }, { name: 'Nov', level: 'ok' }, { name: 'Dez', level: 'bad' },
      ]},
      { type: 'text', text: 'Mai-Juni und September-Oktober: ideal (22-26°C). Sommer: heiß in der Ebene (bis 40°C), aber ideal in den Bergen. Winter: kalt, Schnee in den Bergen, nicht empfehlenswert zum Trampen.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Die armenische Gastfreundschaft gilt als eine der besten der Welt. Fahrer halten an, ohne dass man fragt, kaufen Getränke, laden zum Essen ein und stellen ihre Familie vor. Die kurdischen Gemeinschaften im Süden Armeniens sind "außergewöhnlich gastfreundlich". Essen/Getränke anzunehmen zeigt deinen guten Willen.' },
      { type: 'event', items: [
        { month: 'Apr', day: '24', name: 'Gedenktag', desc: 'Gedenken an den armenischen Völkermord. Prozessionen in Jerewan.' },
        { month: 'Sep-Okt', day: '⟳', name: 'Areni Weinfestival', desc: 'Weinfestival im Dorf Areni, Wiege des ältesten bekannten Weinbergs.' },
      ]},
    ]},
  },

  // ==================== BELARUS ====================
  BY: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Trampen ist in Belarus legal. Keine spezifischen Einschränkungen. Die Praxis ist üblich, da öffentliche Verkehrsmittel außerhalb von Minsk begrenzt sind.' },
      { type: 'warn', text: '⚠️ Für die meisten Nationalitäten ist ein Visum Pflicht. 30 Tage kostenloses Visum bei Einreise über den Flughafen Minsk. Landeinreise aus Russland: keine Grenzkontrolle (Zollunion), aber du brauchst ein belarussisches Visum.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Belarus ist einfach zum Trampen. Durchschnittliche Wartezeit: 15-30 Min auf Hauptstraßen. Fahrer sind neugierig, Ausländer zu treffen (selten im Land). Die Autobahnen (M1, M6) haben guten Verkehr.' },
      { type: 'text', text: 'Viele Fahrer versuchen, Geld abzulehnen. Die klassische Technik: an Tankstellen oder Bushaltestellen am Stadtrand stellen. LKW-Fahrer sind gastfreundlich, sprechen aber selten etwas anderes als Russisch/Belarussisch.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Das Land ist in Bezug auf Kriminalität sehr sicher. Kriminalitätsrate unter den niedrigsten in Europa. Allerdings bedeutet das autoritäre Regime häufige Polizeikontrollen. Habe immer deinen Reisepass und deine Migrationsregistrierung dabei.' },
      { type: 'kv', items: [
        { k: 'Notruf', v: '112' },
        { k: 'Polizei', v: '102' },
        { k: 'Krankenwagen', v: '103' },
      ]},
      { type: 'warn', text: '⚠️ Fotografiere keine Regierungs- oder Militärgebäude. Vermeide politische Diskussionen mit Fahrern.' },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Das Land gilt als sicher für alleinreisende Frauen. Vorfälle sind sehr selten. Die Gesellschaft ist konservativ, aber respektvoll. Vermeide alleiniges Reisen nachts in abgelegenen Gebieten.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Russisch ist die Hauptsprache (von 99% der Bevölkerung im Alltag gesprochen). Belarussisch ist offiziell, aber wenig verwendet. Englisch ist außerhalb von Minsk sehr selten. Russisch ist zur Kommunikation unverzichtbar.' },
      { type: 'phrase', items: [
        { local: 'Zdrastvuyte', meaning: 'Guten Tag (formell)' },
        { local: 'Spasibo', meaning: 'Danke' },
        { local: 'Besplatno', meaning: 'Kostenlos' },
        { local: 'Do...', meaning: 'Bis... (+ Stadtname)' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Sehr günstig. Sparbudget: 10-15 €/Tag. Mahlzeit in einer Stolovaya (sowjetische Kantine): 2-4 €. Hostel in Minsk: 8-15 €/Nacht. Metro in Minsk: ~0,30 €.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wildcampen wird in Wäldern geduldet (60% des Landes). In Nationalparks ohne Genehmigung verboten. Fahrer laden manchmal zum Übernachten ein. Meldepflicht innerhalb von 10 Tagen im Hotel oder Migrationsbüro.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚂', name: 'Zug', detail: 'Zuverlässiges und günstiges sowjetisches Netz', price: '2-10 €' },
        { emoji: '🚌', name: 'Marshrutka', detail: 'Häufige Minibusse zwischen Städten', price: '1-5 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mär', level: 'ok' },
        { name: 'Apr', level: 'ok' }, { name: 'Mai', level: 'good' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Aug', level: 'great' }, { name: 'Sep', level: 'good' },
        { name: 'Okt', level: 'ok' }, { name: 'Nov', level: 'bad' }, { name: 'Dez', level: 'bad' },
      ]},
      { type: 'text', text: 'Juni bis August: ideal (20-28°C). Der Winter ist hart (bis -20°C) und zum Trampen nicht empfehlenswert. Im Sommer gibt es viele Mücken in den Sumpfgebieten.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Belarus bewahrt eine einzigartige sowjetische Atmosphäre. Die Menschen sind beim ersten Kontakt zurückhaltend, aber sehr herzlich, sobald das Eis gebrochen ist. Wodka und Salo (geräucherter Speck) sind die lokalen Spezialitäten. Lehne niemals einen Toast ab.' },
    ]},
  },

  // ==================== MOLDOVA ====================
  MD: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Trampen ist in Moldawien legal. Sehr gängige Praxis, besonders auf dem Land, wo öffentliche Verkehrsmittel selten sind. Fahrer halten leicht an.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Moldawien ist einfach zum Trampen. Das Land ist klein (340 km Nord-Süd) und an einem Tag zu durchqueren. Wartezeit: 10-20 Min. Fahrer sind neugierig auf Ausländer. Achtung: manche Fahrer erwarten eine Bezahlung (lokale informelle Transportpraxis). Kläre, dass es kostenlos ist mit "gratis".' },
      { type: 'warn', text: '⚠️ Transnistrien (selbsternannte Republik im Osten) ist zugänglich, aber mit Grenzkontrollen. Trampen dort ist einfach, aber Russisch ist unverzichtbar.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Moldawien ist ein sicheres Land mit niedriger Kriminalität. Vermeide alleiniges Reisen nachts in abgelegenen Gebieten. Taxibetrug ist das Hauptrisiko (kläre den Preis vorher).' },
      { type: 'kv', items: [{ k: 'Notruf', v: '112' }, { k: 'Polizei', v: '902' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Gilt als sicher für alleinreisende Frauen. Die Gesellschaft ist traditionell. Reisende berichten von positiven Erfahrungen. Meide Transnistrien allein.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Rumänisch ist die Amtssprache. Russisch ist sehr verbreitet, besonders in Chișinău und Transnistrien. Englisch wird von jungen Stadtbewohnern gesprochen. Auf dem Land ist Rumänisch oder Russisch unverzichtbar.' },
      { type: 'phrase', items: [
        { local: 'Bună ziua', meaning: 'Guten Tag' },
        { local: 'Mulțumesc', meaning: 'Danke' },
        { local: 'Gratis', meaning: 'Kostenlos' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Das günstigste Land Europas. Sparbudget: 8-12 €/Tag. Komplettes Restaurantessen: 3-5 €. Ausgezeichneter lokaler Wein für 1-2 €/Flasche. Hostel: 8-12 €/Nacht.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wildcampen wird geduldet, ist aber nicht üblich. Die Weinberge bieten schöne Plätze. Familien laden Reisende oft zum Übernachten ein, besonders auf dem Land.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚐', name: 'Marshrutka', detail: 'Haupttransport zwischen Städten, häufig und günstig', price: '1-3 €' },
        { emoji: '🚂', name: 'Zug', detail: 'Langsam, aber vorhanden auf Hauptlinien', price: '1-5 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mär', level: 'ok' },
        { name: 'Apr', level: 'good' }, { name: 'Mai', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'good' }, { name: 'Aug', level: 'good' }, { name: 'Sep', level: 'great' },
        { name: 'Okt', level: 'good' }, { name: 'Nov', level: 'ok' }, { name: 'Dez', level: 'bad' },
      ]},
      { type: 'text', text: 'Mai-Juni und September-Oktober: ideal. Der Sommer kann sehr heiß sein (35°C+). Der Herbst ist die Weinlesezeit, der ideale Besuchszeitraum.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Moldawien ist das Land des Weins. Die unterirdischen Keller von Mileștii Mici sind die größten der Welt (200 km Gänge). Die moldawische Gastfreundschaft ist aufrichtig und großzügig. Man wird dir Hauswein, Mămăligă (Polenta) und Plăcintă (Teigtasche) anbieten.' },
      { type: 'event', items: [
        { month: 'Okt', day: '⟳', name: 'Ziua Vinului (Tag des Weins)', desc: 'Nationales Weinfestival in Chișinău. Überall kostenlose Verkostung.' },
      ]},
    ]},
  },

  // ==================== UKRAINE ====================
  UA: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Trampen ist in der Ukraine legal. Keine Einschränkungen. Gängige und kulturell akzeptierte Praxis. Ukrainer kennen das Konzept.' },
      { type: 'warn', text: '⚠️ Seit 2022 hat sich die Sicherheitslage grundlegend verändert. Prüfe die aktiven Konfliktgebiete vor der Reise. Der Westen des Landes (Lwiw, Karpaten) bleibt am zugänglichsten. Kriegsrecht kann die Bewegungsfreiheit einschränken.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'In Friedenszeiten ist die Ukraine eines der besten Tramperländer Europas. Fahrer sind großzügig und neugierig. Wartezeit: 10-20 Min. LKW-Fahrer fahren lange Strecken. Die Hauptstraßen (M06 Kiew-Lwiw, M05 Kiew-Odessa) haben guten Verkehr.' },
      { type: 'text', text: 'Viele Fahrer bieten spontan Essen, Getränke und Unterkunft an. Das Konzept "Avtostop" ist gut verstanden. Manche Fahrer machen erhebliche Umwege, um zu helfen.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Die Sicherheit hängt vollständig von der Zone ab. In Friedenszeiten ist die Ukraine ein sicheres Land mit gastfreundlichen Menschen. Konsultiere die Reisehinweise des Außenministeriums vor der Reise.' },
      { type: 'kv', items: [
        { k: 'Notruf', v: '112' },
        { k: 'Polizei', v: '102' },
        { k: 'Krankenwagen', v: '103' },
      ]},
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'In Friedenszeiten berichten mehrere Reisende von positiven Erfahrungen in der Ukraine. Die Gesellschaft ist traditionell, aber respektvoll. Lwiw und die Karpaten sind die am meisten empfohlenen Regionen für alleinreisende Frauen.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Ukrainisch ist die Amtssprache. Russisch wird von der Mehrheit verstanden, aber seine Verwendung ist seit 2022 politisch sensibel. Nutze vorzugsweise Ukrainisch oder Englisch. Englisch wird von jungen Leuten in Kiew und Lwiw gesprochen.' },
      { type: 'phrase', items: [
        { local: 'Dobriy den', meaning: 'Guten Tag' },
        { local: 'Dyakuyu', meaning: 'Danke' },
        { local: 'Bezkoshtovno', meaning: 'Kostenlos' },
        { local: 'Do... (+ Stadt)', meaning: 'Bis...' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Sehr günstig. Sparbudget: 10-15 €/Tag. Mahlzeit in einer Yidalnya (Kantine): 2-4 €. Hostel in Kiew: 5-10 €/Nacht. Nachtzug Kiew-Lwiw: ~8 €.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wildcampen wird in Wäldern und den Karpaten geduldet. Ukrainer laden Reisende oft zu sich ein. Couchsurfing aktiv in Kiew und Lwiw.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚂', name: 'Ukrsalisnyzja (Zug)', detail: 'Umfangreiches Netz, komfortable und günstige Nachtzüge', price: '3-15 €' },
        { emoji: '🚐', name: 'Marshrutka', detail: 'Häufige Minibusse zwischen Städten', price: '1-5 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mär', level: 'ok' },
        { name: 'Apr', level: 'good' }, { name: 'Mai', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'good' }, { name: 'Aug', level: 'good' }, { name: 'Sep', level: 'great' },
        { name: 'Okt', level: 'good' }, { name: 'Nov', level: 'ok' }, { name: 'Dez', level: 'bad' },
      ]},
      { type: 'text', text: 'Mai-Juni und September: ideal (20-28°C). Der Sommer ist heiß im Süden. Der Winter ist hart (-10 bis -20°C) und nicht empfehlenswert. Die Karpaten sind im Herbst wunderschön.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Die ukrainische Gastfreundschaft ist aufrichtig und großzügig. Borschtsch, Salo (Speck) und Horilka (Pfefferwodka) sind unverzichtbar. Fahrer bieten oft Obst, Brot und Getränke an. Die Kultur des Teilens ist tief verwurzelt.' },
    ]},
  },

  // ==================== KOSOVO ====================
  XK: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Trampen ist im Kosovo legal. Keine bekannten Einschränkungen. Die Praxis ist üblich, da das Busnetz begrenzt ist.' },
      { type: 'warn', text: '⚠️ Kosovo wird nicht von allen Ländern anerkannt. Prüfe, ob dein Land es anerkennt, bevor du reist. Die Einreise aus Serbien kann problematisch sein (von Serbien als illegale Einreise betrachtet).' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Kosovo ist sehr einfach zum Trampen. Das Land ist klein (150 km von Ost nach West) und in wenigen Stunden zu durchqueren. Fahrer sind extrem gastfreundlich, besonders gegenüber Ausländern. Wartezeit: 5-15 Min.' },
      { type: 'text', text: 'Kosovaren haben ein tiefes Dankbarkeitsgefühl gegenüber Ausländern. Viele bieten Mahlzeiten, Kaffee an und bestehen darauf zu helfen. Die Autobahn Pristina-Prizren hat guten Verkehr.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Kosovo ist sicher für Reisende. Kriminalität gegenüber Touristen ist nahezu inexistent. Die internationale Präsenz (KFOR, EULEX) trägt zur Sicherheit bei.' },
      { type: 'kv', items: [{ k: 'Notruf', v: '112' }, { k: 'Polizei', v: '192' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Gilt als sicher für alleinreisende Frauen. Die Gesellschaft ist traditionell, aber sehr respektvoll gegenüber Ausländern. Mehrere Reisende berichten von positiven Erfahrungen.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Albanisch ist die Hauptsprache. Serbisch wird in den serbischen Enklaven im Norden gesprochen. Englisch ist bei jungen Leuten weit verbreitet (internationaler Einfluss seit 1999). Deutsch wird von vielen verstanden (große Diaspora in Deutschland/Schweiz).' },
      { type: 'phrase', items: [
        { local: 'Faleminderit', meaning: 'Danke' },
        { local: 'Ku po shkon?', meaning: 'Wohin fährst du?' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Sehr günstig. Sparbudget: 10-15 €/Tag. Komplette Mahlzeit: 3-5 €. Kaffee: 0,50-1 €. Hostel: 8-12 €/Nacht. Kosovo verwendet den Euro.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wildcampen ist in ländlichen Gebieten möglich. Kosovarische Familien laden Reisende sehr leicht zu sich ein. Es ist eine Frage der Ehre.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Bus', detail: 'Begrenztes Netz, deckt aber die Hauptstädte ab', price: '2-5 €' },
        { emoji: '🚐', name: 'Furgon', detail: 'Informelle Minibusse, häufig und günstig', price: '1-3 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mär', level: 'ok' },
        { name: 'Apr', level: 'good' }, { name: 'Mai', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'good' }, { name: 'Aug', level: 'good' }, { name: 'Sep', level: 'great' },
        { name: 'Okt', level: 'good' }, { name: 'Nov', level: 'ok' }, { name: 'Dez', level: 'bad' },
      ]},
      { type: 'text', text: 'Mai-Juni und September: ideal. Der Sommer ist heiß (35°C+). Der Winter ist kalt mit Schnee.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Kosovo ist ein junges Land (unabhängig seit 2008) mit einer sehr jungen Bevölkerung (Medianalter: 29 Jahre). Die Gastfreundschaft ist außergewöhnlich. Macchiato und türkischer Kaffee sind Institutionen. Das Land vibriert vor Energie und Optimismus.' },
    ]},
  },

  // ==================== MOROCCO ====================
  MA: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Trampen ist in Marokko legal und sehr verbreitet. Keine Einschränkungen. Es ist ein gängiges Transportmittel auch für Einheimische. Die Praxis ist in der marokkanischen Gastfreundschaftskultur verankert.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Marokko ist eines der besten Länder der Welt zum Trampen. Durchschnittliche Wartezeit: 5-15 Min. Fahrer halten sehr leicht an, manchmal ohne dass man fragt. LKW nehmen regelmäßig Tramper auf Langstrecken mit.' },
      { type: 'sub', title: 'Wichtige Punkte' },
      { type: 'rule', icon: '🚛', text: 'LKW-Fahrer sind die besten Verbündeten. Sie fahren lange Strecken und sind es gewohnt, Leute mitzunehmen.' },
      { type: 'rule', icon: '⛽', text: 'Tankstellen an Stadtausgängen sind die besten Spots.' },
      { type: 'rule', icon: '🤝', text: 'Manche Fahrer erwarten eine kleine Bezahlung (informeller Transport). Kläre "autostop, bla flous" (ohne Geld) oder biete an, Benzin zu teilen.' },
      { type: 'text', text: 'Im Süden und Atlas ist der Verkehr gering, aber die Leute halten fast immer an. Grands taxis collectifs sind das Haupttransportmittel zwischen Städten.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Marokko ist insgesamt sicher. Gewaltkriminalität ist selten. Touristen-Betrug (falsche Führer, überhöhte Preise) ist das Hauptrisiko. Marokkaner sind mehrheitlich gastfreundlich und beschützend gegenüber Reisenden.' },
      { type: 'kv', items: [
        { k: 'Polizei', v: '19' },
        { k: 'Gendarmerie (außerhalb)', v: '177' },
        { k: 'Feuerwehr / Notarzt', v: '15' },
      ]},
      { type: 'warn', text: '⚠️ Meide die Grenzgebiete zu Algerien (geschlossen) und die abgelegenen Regionen der Westsahara ohne lokalen Führer.' },
    ]},
    women: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'Marokko ist heikler für alleinreisende Frauen. Straßenbelästigung (Kommentare, aufdringliche Blicke) ist in Städten häufig. Beim Trampen sind die Erfahrungen gemischt: viele positive Fahrten, aber einige unangenehme Situationen berichtet.' },
      { type: 'rule', icon: '👫', text: 'Zu zweit reisen wird dringend empfohlen.' },
      { type: 'rule', icon: '👕', text: 'Kleide dich konservativ (Schultern und Knie bedeckt).' },
      { type: 'rule', icon: '💍', text: '"Mein Mann wartet auf mich in..." ist ein wirksamer Satz, um ein Gespräch abzubrechen.' },
      { type: 'text', text: 'Touristische Gebiete (Marrakesch, Fes) sind intensiver. Ländliche Gebiete und der Atlas sind oft respektvoller und gastfreundlicher.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Marokkanisches Arabisch (Darija) und Berberisch sind die Lokalsprachen. Französisch ist weit verbreitet (Bildungs- und Geschäftssprache). Englisch nimmt bei jungen Leuten zu. Spanisch wird im Norden verstanden (Tanger, Tétouan, Nador).' },
      { type: 'phrase', items: [
        { local: 'Salam / Salam aleikoum', meaning: 'Hallo / Friede sei mit dir' },
        { local: 'Choukran', meaning: 'Danke' },
        { local: 'Bla flous', meaning: 'Ohne Geld (kostenlos)' },
        { local: 'Wach kayn chi triq l...?', meaning: 'Gibt es einen Weg nach...?' },
        { local: 'Bslama', meaning: 'Auf Wiedersehen' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Sehr günstig. Sparbudget: 10-20 €/Tag. Pfefferminztee wird oft kostenlos angeboten.' },
      { type: 'kv', items: [
        { k: 'Mahlzeit im Imbiss', v: '2-4 €' },
        { k: 'Tajine im Restaurant', v: '4-8 €' },
        { k: 'Hostel / einfaches Riad', v: '5-15 €/Nacht' },
        { k: 'Grand taxi collectif (50 km)', v: '1-3 €' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wildcampen wird im Atlas-Gebirge und in der Wüste geduldet. Meide Strände nahe Städten. Marokkaner laden Reisende oft zum Tee, Essen und manchmal Übernachten ein. In den Berberdörfern des Atlas ist Gastfreundschaft nahezu selbstverständlich.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚕', name: 'Grand Taxi', detail: 'Sammeltaxis zwischen Städten. 6 Passagiere, warten bis voll.', price: '1-5 €' },
        { emoji: '🚌', name: 'CTM / Supratours', detail: 'Komfortable und zuverlässige Fernbusse', price: '5-20 €' },
        { emoji: '🚂', name: 'ONCF (Zug)', detail: 'Begrenztes, aber zuverlässiges Netz (Tanger-Marrakesch)', price: '5-25 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'ok' }, { name: 'Feb', level: 'good' }, { name: 'Mär', level: 'great' },
        { name: 'Apr', level: 'great' }, { name: 'Mai', level: 'great' }, { name: 'Jun', level: 'good' },
        { name: 'Jul', level: 'ok' }, { name: 'Aug', level: 'ok' }, { name: 'Sep', level: 'good' },
        { name: 'Okt', level: 'great' }, { name: 'Nov', level: 'great' }, { name: 'Dez', level: 'ok' },
      ]},
      { type: 'text', text: 'März-Mai und September-November: ideal. Der Sommer ist im Süden und Landesinneren glühend heiß (40-45°C). Der Winter ist an der Küste mild, aber kalt im Atlas (Schnee). Ramadan: der Rhythmus ändert sich, aber die Gastfreundschaft bleibt.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Die marokkanische Gastfreundschaft ist legendär. Pfefferminztee ist ein heiliges Ritual: einen abzulehnen ist unhöflich. Fahrer bieten oft Tee, Essen an und machen Umwege, um zu helfen. Die Berberkultur im Atlas ist besonders gastfreundlich.' },
      { type: 'event', items: [
        { month: 'Jun', day: '⟳', name: 'Gnaoua-Festival (Essaouira)', desc: 'Gnaoua- und Weltmusik. Unglaubliche Atmosphäre.' },
        { month: 'Nov', day: '⟳', name: 'Dattelfestival (Erfoud)', desc: 'Feier der Dattelernte im Südosten.' },
      ]},
    ]},
  },
  // ==================== UNITED STATES ====================
  US: {
    laws: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'Die Rechtslage variiert je nach Bundesstaat. Grundsätzlich ist Trampen auf den Interstates (Bundesautobahnen) überall verboten, aber an Auffahrten und Nebenstraßen in vielen Staaten toleriert oder sogar legal.' },
      { type: 'sub', title: 'Staaten, wo es legal ist' },
      { type: 'text', text: 'Oregon, Nevada, Colorado, Wyoming, Montana, Idaho und andere westliche Staaten tolerieren oder erlauben Trampen an Auffahrten ausdrücklich. Prüfe die Gesetze jedes Staates vorher.' },
      { type: 'sub', title: 'Staaten, wo es verboten ist' },
      { type: 'text', text: 'New York, New Jersey, Pennsylvania, Delaware, Connecticut und andere verbieten Trampen auch an Auffahrten. In Florida variiert das Gesetz je nach County.' },
      { type: 'sub', title: 'Bußgelder' },
      { type: 'text', text: 'Selten bestraft. Die Polizei wird dich normalerweise bitten weiterzugehen. Im schlimmsten Fall: Bußgeld von 25-100 $ oder eine Verwarnung.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Die USA sind das Land, in dem das Trampen seit den 70er Jahren am meisten zurückgegangen ist. Die Entfernungen sind riesig, die Motorisierungsrate liegt bei 95%, und die Angstkultur (stranger danger) macht Fahrer misstrauisch. Durchschnittliche Wartezeit: 1-3h, manchmal deutlich länger.' },
      { type: 'sub', title: 'Wo es funktioniert' },
      { type: 'kv', items: [
        { k: 'Ländlicher Westen (Montana, Wyoming, Idaho)', v: 'Am besten', color: 'green' },
        { k: 'Pacific Northwest (Oregon, Washington)', v: 'Gut, alternative Kultur', color: 'green' },
        { k: 'Hawaii', v: 'Einfach und verbreitet', color: 'green' },
        { k: 'Ländlicher Süden (ländliches Texas, Louisiana)', v: 'Unterschiedlich aber freundlich', color: 'amber' },
        { k: 'Ostküste / Großstädte', v: 'Sehr schwierig', color: 'red' },
      ]},
      { type: 'sub', title: 'Strategie' },
      { type: 'text', text: 'In den USA ist das Ansprechen von Fahrern an Tankstellen (Gas Stations) oder Truck Stops effektiver als der Daumen am Straßenrand. Truck Stops (TA, Pilot, Flying J, Love\'s) sind die besten Spots für lange Strecken.' },
      { type: 'tip', text: '💡 Facebook-Gruppen "Ride Share" nach Bundesstaat sind eine ergänzende Alternative zum Trampen.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Das tatsächliche Risiko wird durch die Medienkultur überschätzt. Trampen bleibt ein sicheres Transportmittel, wenn die grundlegenden Vorsichtsmaßnahmen beachtet werden. Allerdings ist das Misstrauen gegenseitig: sowohl Fahrer als auch Tramper sind auf der Hut.' },
      { type: 'kv', items: [{ k: 'Notfälle', v: '911' }] },
      { type: 'warn', text: '⚠️ Steige niemals ein, wenn der Fahrer unter Drogen- oder Alkoholeinfluss zu stehen scheint. Trampe nicht nachts. Manche abgelegenen ländlichen Gebiete haben kein Handynetz.' },
    ]},
    women: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'Die USA sind das Land, in dem Frauen das meiste Misstrauen berichten (von beiden Seiten). Alleine als Frau zu trampen wird von den meisten Quellen abgeraten, besonders in abgelegenen Gebieten. Gemischte Paare oder Zweiergruppen werden viel besser wahrgenommen.' },
      { type: 'rule', icon: '👫', text: 'Zu zweit reisen ist fast unverzichtbar.' },
      { type: 'rule', icon: '📱', text: 'Teile deinen Standort in Echtzeit (SpotHitch, Google Maps, WhatsApp).' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Englisch ist unverzichtbar. Spanisch ist im Südwesten sehr nützlich (Texas, Arizona, New Mexico, Kalifornien). Keine Sprachbarriere für englischsprachige Reisende.' },
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Die USA sind teuer. Knappes Budget: mindestens 30-50 $/Tag. Truck Stops bieten reichhaltige Mahlzeiten zu vernünftigen Preisen.' },
      { type: 'kv', items: [
        { k: 'Hostel', v: '25-50 $/Nacht' },
        { k: 'Walmart (Parkplatz-Camping)', v: 'Kostenlos (toleriert)' },
        { k: 'Fast Food', v: '8-15 $' },
        { k: 'Diner / Truck Stop', v: '10-20 $' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wildcampen ist auf Bundesland (BLM Land, National Forests) legal, das Millionen Hektar im Westen abdeckt. In den meisten Fällen kostenlos und ohne Genehmigung. Walmart erlaubt oft das Übernachten auf seinen Parkplätzen. Truck-Stop-Parkplätze sind nachts nutzbar.' },
      { type: 'tip', text: '💡 Es gibt zahlreiche Apps und Websites, um kostenlose Campingplätze auf Bundesland zu finden.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Greyhound', detail: 'Fernbus, ausgedehntes Netz', price: '30-100 $' },
        { emoji: '🚌', name: 'FlixBus', detail: 'Günstigere Alternative, wachsendes Netz', price: '10-50 $' },
        { emoji: '🚂', name: 'Amtrak', detail: 'Zug, langsam aber landschaftlich reizvoll. Der California Zephyr ist wunderschön.', price: '30-200 $' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mär', level: 'ok' },
        { name: 'Apr', level: 'good' }, { name: 'Mai', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'good' }, { name: 'Aug', level: 'good' }, { name: 'Sep', level: 'great' },
        { name: 'Okt', level: 'good' }, { name: 'Nov', level: 'ok' }, { name: 'Dez', level: 'bad' },
      ]},
      { type: 'text', text: 'Mai-Jun und September: ideal im Westen. Der Sommer ist im Südwesten glühend heiß (45°C+ in Arizona). Der Winter sperrt die Bergpässe. Der Nordosten ist von April bis Oktober befahrbar.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Trampen hat einen mythischen Platz in der amerikanischen Kultur (Jack Kerouac, Route 66, die Beatniks). Heute ist die Praxis marginal, aber diejenigen, die Tramper mitnehmen, sind oft außergewöhnliche Menschen: ehemalige Reisende, einsame Fernfahrer, Abenteurer. Die Gespräche sind oft unvergesslich.' },
      { type: 'event', items: [
        { month: 'Aug', day: '⟳', name: 'Burning Man (Nevada)', desc: 'Festival in der Wüste. Viele Tramper auf Nevadas Straßen.' },
      ]},
    ]},
  },
  // ==================== CANADA ====================
  CA: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Trampen ist in den meisten Provinzen legal. Auf den Highways in einigen Provinzen (Ontario, British Columbia) verboten, aber an Auffahrten erlaubt. In Alberta und den Prärieprovinzen wird Trampen generell toleriert.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Kanada ist einfacher als die USA zum Trampen. Die kanadische Kultur ist offener und die Entfernungen zwischen Gemeinden schaffen eine natürliche Solidarität. Durchschnittliche Wartezeit: 30 Min-1h30. Der Westen (British Columbia, Alberta) ist am einfachsten.' },
      { type: 'sub', title: 'Beste Regionen' },
      { type: 'kv', items: [
        { k: 'British Columbia (außer Vancouver)', v: 'Sehr gut, lebendige Tramperkultur', color: 'green' },
        { k: 'Alberta (Highway 1, Highway 93)', v: 'Guter Verkehr, Rocky Mountains', color: 'green' },
        { k: 'Atlantikprovinzen', v: 'Einfach und freundlich', color: 'green' },
        { k: 'Ländliches Ontario', v: 'Ordentlich', color: 'amber' },
        { k: 'Toronto, Montréal (Stadtausfahrt)', v: 'Schwierig', color: 'red' },
      ]},
      { type: 'text', text: 'Tankstellen (Esso, Petro-Canada, Shell) und Tim Hortons am Straßenrand sind die besten Spots, um Fahrer anzusprechen.' },
      { type: 'warn', text: '⚠️ Auf der Highway 16 (nördliches B.C.) sind die Entfernungen sehr lang und die Netzabdeckung begrenzt. Plane deine Route und informiere jemanden.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Kanada ist ein sehr sicheres Land. Kanadier sind für ihre Freundlichkeit bekannt. Das Hauptrisiko sind die riesigen Entfernungen zwischen den Städten (manchmal 200+ km ohne Handynetz). Nimm Wasser und Essen mit.' },
      { type: 'kv', items: [{ k: 'Notfälle', v: '911' }] },
      { type: 'warn', text: '⚠️ Vorsicht vor Bären (Grizzly in B.C./Alberta, Schwarzbär überall). Beim Campen Essen aufhängen.' },
    ]},
    women: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'Kanada ist sicherer als die USA für Frauen. Alleinreisende Frauen berichten von überwiegend positiven Erfahrungen. In abgelegenen Gebieten plane deine Route und informiere jemanden.' },
      { type: 'rule', icon: '📱', text: 'Informiere jemanden über deine Route. Manche Gebiete haben kein Netz.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Englisch überall, außer in Québec. In Québec ist Französisch die Hauptsprache. Die Québécois schätzen es, wenn man Französisch spricht. In den Atlantikprovinzen (New Brunswick) koexistieren beide Sprachen.' },
      { type: 'phrase', items: [
        { local: 'Je fais du pouce', meaning: 'Québec-Ausdruck für Trampen' },
        { local: 'Merci, bonne route !', meaning: 'Beim Aussteigen (in Québec)' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Kanada ist teuer. Knappes Budget: 30-50 CAD/Tag (~20-35 €). Supermärkte (Walmart, No Frills) sind günstiger als Restaurants. Tim Hortons ist günstig für schnelle Mahlzeiten.' },
      { type: 'kv', items: [
        { k: 'Hostel', v: '25-50 CAD/Nacht' },
        { k: 'Tim Hortons Mahlzeit', v: '5-10 CAD' },
        { k: 'Provinz-Campingplatz', v: '15-35 CAD/Nacht' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wildcampen ist auf Crown Lands (Kronland) erlaubt, die 89% des Territoriums bedecken. In den meisten Provinzen kostenlos und ohne Genehmigung. Die Rastplätze entlang der Highways erlauben oft, einige Stunden zu schlafen.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Rider Express / FlixBus', detail: 'Fernbus, begrenztes Netz im Westen', price: '30-100 CAD' },
        { emoji: '🚂', name: 'VIA Rail', detail: 'Transkontinentaler Zug, langsam aber landschaftlich reizvoll', price: '50-300 CAD' },
      ]},
      { type: 'tip', text: '💡 Facebook-Gruppen und lokale Anzeigenplattformen sind nützlich für Mitfahrgelegenheiten in Kanada.' },
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mär', level: 'bad' },
        { name: 'Apr', level: 'ok' }, { name: 'Mai', level: 'good' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Aug', level: 'great' }, { name: 'Sep', level: 'good' },
        { name: 'Okt', level: 'ok' }, { name: 'Nov', level: 'bad' }, { name: 'Dez', level: 'bad' },
      ]},
      { type: 'text', text: 'Juni bis August: ideal. Kanada hat extreme Winter (-30 bis -40°C in den Prärien). Trampen im Winter ist gefährlich (Unterkühlung). September ist wunderschön für die Herbstfarben im Osten.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Kanadier sind bekannt für ihre Höflichkeit und Gastfreundschaft. "Sorry" ist das häufigste Wort. Fahrer bieten oft Kaffee, Mahlzeiten und Unterkunft an. Die Outdoor-Kultur (Camping, Wandern) macht die Leute offen für Reisende.' },
    ]},
  },
  // ==================== NEW ZEALAND ====================
  NZ: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Trampen ist in Neuseeland vollkommen legal. Keine Einschränkungen. Es ist ein anerkanntes und kulturell akzeptiertes Transportmittel. Sogar die offizielle Tourismus-Website erwähnt es.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Neuseeland ist eines der besten Länder der Welt zum Trampen. Durchschnittliche Wartezeit: 10-30 Min. Kiwis halten leicht an und sind sehr gastfreundlich. Trampen wird als normales Transportmittel angesehen.' },
      { type: 'sub', title: 'Nordinsel vs. Südinsel' },
      { type: 'kv', items: [
        { k: 'Südinsel', v: 'Einfacher, weniger Verkehr aber jeder hält an', color: 'green' },
        { k: 'Nordinsel', v: 'Auch gut, mehr Verkehr um Auckland/Wellington', color: 'green' },
      ]},
      { type: 'text', text: 'Der State Highway 1 ist die Hauptstraße beider Inseln. Die Fähre zwischen den Inseln (Interislander) ist die einzige Option zwischen Wellington und Picton.' },
      { type: 'tip', text: '💡 Ein Schild mit deinem Ziel ist fast unverzichtbar. Kiwis möchten genau wissen, wohin du fährst.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Neuseeland ist eines der sichersten Länder der Welt. Kriminalität gegen Touristen ist sehr selten. Alleinreisende, auch Frauen, berichten von sehr positiven Erfahrungen.' },
      { type: 'kv', items: [{ k: 'Notfälle', v: '111' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Neuseeland gilt als eines der sichersten Länder der Welt für alleinreisende Frauen. Viele Reisende trampen ohne Probleme. Das Land war das erste, das Frauen das Wahlrecht gewährte (1893).' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Englisch ist die Hauptsprache. Māori ist die zweite Amtssprache (einige Wörter werden im Alltag verwendet: kia ora = hallo). Keine Sprachbarriere.' },
      { type: 'phrase', items: [
        { local: 'Kia ora', meaning: 'Hallo (Māori, von allen benutzt)' },
        { local: 'Sweet as', meaning: 'Cool, kein Problem (Kiwi-Ausdruck)' },
        { local: 'Chur / Cheers', meaning: 'Danke' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'NZ ist teuer. Knappes Budget: 30-50 NZD/Tag (~17-28 €). Lebensmittel im Supermarkt sind erschwinglich (Countdown, Pak\'nSave). Kostenlose Unterkünfte (DOC Campsites, Freedom Camping) helfen, die Kosten zu senken.' },
      { type: 'kv', items: [
        { k: 'Hostel (YHA, BBH)', v: '25-40 NZD/Nacht' },
        { k: 'DOC Campsite (einfach)', v: '0-8 NZD/Nacht' },
        { k: 'Fish & Chips', v: '8-15 NZD' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: '"Freedom Camping" (Wildcampen mit Van oder Zelt) ist reguliert, aber möglich. Die DOC Campsites (Department of Conservation) bieten kostenlose oder sehr günstige Stellplätze an wunderschönen Orten. Wildcampen mit Zelt wird toleriert, wenn du diskret bist und deinen Müll mitnimmst.' },
      { type: 'tip', text: '💡 Mehrere lokale Apps verzeichnen kostenlose Campingplätze in Neuseeland.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'InterCity', detail: 'Hauptbusnetz. Der FlexiPass bietet Ermäßigungen.', price: '15-80 NZD' },
        { emoji: '⛴️', name: 'Interislander / Bluebridge', detail: 'Fähre Wellington-Picton (3h30)', price: '55-80 NZD' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'great' }, { name: 'Feb', level: 'great' }, { name: 'Mär', level: 'great' },
        { name: 'Apr', level: 'good' }, { name: 'Mai', level: 'ok' }, { name: 'Jun', level: 'bad' },
        { name: 'Jul', level: 'bad' }, { name: 'Aug', level: 'bad' }, { name: 'Sep', level: 'ok' },
        { name: 'Okt', level: 'good' }, { name: 'Nov', level: 'good' }, { name: 'Dez', level: 'great' },
      ]},
      { type: 'text', text: 'Südhalbkugel: der Sommer ist von Dezember bis Februar. November bis März: ideal. Der Winter (Juni-August) ist im Süden kühl, aber machbar. Das Wetter wechselt schnell, nimm immer eine wasserdichte Schicht mit.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Kiwis sind entspannt und gastfreundlich. "No worries" ist eine Lebensweise. Fahrer machen Umwege, bieten Kaffee an und manchmal ein Bett. Die Outdoor-Kultur (Tramping = Wandern) schafft eine natürliche Verbindung mit Reisenden. Das Land ist klein (4,8 Millionen Einwohner) und die Leute kennen sich.' },
    ]},
  },
  // ==================== AUSTRALIA ====================
  AU: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Die Rechtslage variiert je nach Bundesstaat. Legal in den meisten Staaten (Victoria, New South Wales, Western Australia). Verboten in Queensland (Bußgeld möglich, aber selten durchgesetzt). Immer verboten auf Autobahnen (Freeways/Motorways).' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Australien war in den 70er-80er Jahren ein Tramper-Paradies, aber die Praxis ist stark zurückgegangen. Die Entfernungen sind riesig (Perth-Sydney: 3.900 km). Wartezeit: 30 Min-3h je nach Gebiet.' },
      { type: 'sub', title: 'Beste Regionen' },
      { type: 'kv', items: [
        { k: 'Ostküste (Sydney-Cairns)', v: 'Am meisten Verkehr', color: 'green' },
        { k: 'Tasmanien', v: 'Klein, einfach, jeder hält an', color: 'green' },
        { k: 'Outback / Zentrum', v: 'Wenig Verkehr, lange Wartezeiten aber gastfreundliche Leute', color: 'amber' },
        { k: 'Perth-Adelaide (Nullarbor Plain)', v: 'Riskant: 1.200 km Wüste', color: 'red' },
      ]},
      { type: 'text', text: 'Roadhouses (abgelegene Tankstellen) und Truck Stops sind die besten Spots. Road Trains (Dreifach-LKWs) nehmen manchmal Passagiere auf langen Strecken mit.' },
      { type: 'warn', text: '⚠️ Immer 5-10 Liter Wasser als Reserve im Outback dabei haben. Dehydrierung ist tödlich.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Australien ist generell sicher, aber die Entfernungen und die Hitze sind die echten Gefahren. Im Outback übersteigen die Temperaturen 45°C und es gibt kein Handynetz über Hunderte von Kilometern.' },
      { type: 'kv', items: [{ k: 'Notfälle', v: '000' }, { k: 'Vom Handy', v: '112' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Die Erfahrungen sind gemischt. Die Ostküste und Tasmanien gelten als sicher. Das abgelegene Outback wird für alleinreisende Frauen nicht empfohlen. Zu zweit reisen ist ratsam.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Australisches Englisch hat seinen eigenen Wortschatz (arvo = Nachmittag, brekkie = Frühstück, servo = Tankstelle, ute = Pickup). Australier sind informell und benutzen viel Slang.' },
      { type: 'phrase', items: [
        { local: 'G\'day mate', meaning: 'Hallo (informell)' },
        { local: 'No worries', meaning: 'Kein Problem' },
        { local: 'Ta / Cheers', meaning: 'Danke' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Australien ist teuer. Knappes Budget: 40-60 AUD/Tag (~25-37 €). Lebensmittel im Supermarkt (Woolworths, Coles, Aldi) sind erschwinglich. Auswärts essen ist teuer.' },
      { type: 'kv', items: [
        { k: 'Hostel', v: '25-45 AUD/Nacht' },
        { k: 'Pub-Mahlzeit', v: '15-25 AUD' },
        { k: 'Free Camping', v: 'Kostenlos (Camping-Apps)' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wildcampen (Bush Camping) ist auf öffentlichem Land und in vielen ländlichen Gebieten legal. Mehrere lokale Apps verzeichnen kostenlose Spots. Die Rastplätze entlang der Highways erlauben kostenloses Übernachten. Vorsicht vor Schlangen und Spinnen.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Greyhound Australia', detail: 'Fernbus, ausgedehntes Netz', price: '30-200 AUD' },
        { emoji: '✈️', name: 'Billigflüge', detail: 'Jetstar, Bonza. Oft günstiger als der Bus für lange Strecken.', price: '50-150 AUD' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'ok' }, { name: 'Feb', level: 'ok' }, { name: 'Mär', level: 'good' },
        { name: 'Apr', level: 'great' }, { name: 'Mai', level: 'great' }, { name: 'Jun', level: 'good' },
        { name: 'Jul', level: 'good' }, { name: 'Aug', level: 'good' }, { name: 'Sep', level: 'great' },
        { name: 'Okt', level: 'great' }, { name: 'Nov', level: 'good' }, { name: 'Dez', level: 'ok' },
      ]},
      { type: 'text', text: 'Südhalbkugel: der Winter (Juni-August) ist die beste Jahreszeit im tropischen Norden. Der Sommer (Dezember-Februar) ist ideal im Süden (Melbourne, Tasmanien). Meide das Outback im Sommer (45°C+).' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Die australische Kultur ist entspannt und gastfreundlich. "Mateship" (Solidarität unter Kumpels) ist ein grundlegender Wert. BBQs an der Straße und geteilte Biere sind Institutionen. Der Humor ist trocken und Selbstironie allgegenwärtig.' },
    ]},
  },
  // ==================== ISRAEL ====================
  IL: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Trampen (Trempiyada auf Hebräisch) ist legal und verbreitet in Israel. Es ist ein etabliertes Transportmittel, besonders für Soldaten. Die Tramppunkte (Trempiyada) sind durch offizielle Schilder an Kreuzungen markiert.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Israel ist ein ausgezeichnetes Land zum Trampen. Das Land ist klein (470 km Nord-Süd) und Israelis sind sehr direkt und gastfreundlich. Wartezeit: 5-20 Min. Soldaten in Uniform trampen massenhaft (Pflichtdienst, kein Auto).' },
      { type: 'sub', title: 'Trempiyada' },
      { type: 'text', text: 'Trempiyada-Punkte sind offizielle Trampstellen, oft an Kreuzungen. Ein Finger, der auf den Boden zeigt, bedeutet "ich fahre in diese Richtung". Das ist die lokale Geste, nicht der Daumen.' },
      { type: 'kv', items: [
        { k: 'Route 1 (Jerusalem-Tel Aviv)', v: 'Dichter Verkehr, einfach', color: 'green' },
        { k: 'Route 90 (Jordantal)', v: 'Guter Verkehr, Landschaften', color: 'green' },
        { k: 'Negev (Süden)', v: 'Wenig Verkehr, lange Wartezeiten', color: 'amber' },
      ]},
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Die Sicherheit hängt von der Region ab. Die zentralen Gebiete (Tel Aviv, Haifa, Galiläa) sind sicher. Meide das Westjordanland ohne Ortskenntnisse und die Grenzgebiete zu Gaza und zum Libanon.' },
      { type: 'kv', items: [
        { k: 'Notfälle / Polizei', v: '100' },
        { k: 'Krankenwagen (Magen David Adom)', v: '101' },
        { k: 'Feuerwehr', v: '102' },
      ]},
      { type: 'warn', text: '⚠️ Die Sicherheitslage kann sich schnell ändern. Prüfe Echtzeit-Warnungen. Die App Red Alert warnt vor Raketen.' },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Israel gilt als sicher für alleinreisende Frauen. Israelinnen trampen oft alleine. Die Gesellschaft ist progressiv und egalitär, besonders in Tel Aviv. Einige Vorsichtsmaßnahmen in ultraorthodoxen Gebieten (bescheidene Kleidung).' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Hebräisch ist die Hauptsprache. Arabisch ist die zweite Amtssprache. Englisch ist sehr verbreitet (fast jeder spricht Englisch). Russisch ist unter Einwanderern aus der ehemaligen UdSSR üblich.' },
      { type: 'phrase', items: [
        { local: 'Shalom', meaning: 'Hallo / Auf Wiedersehen / Frieden' },
        { local: 'Toda (raba)', meaning: 'Danke (vielmals)' },
        { local: 'Tremp', meaning: 'Eine Mitfahrgelegenheit / ein Tramp' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Israel ist teuer. Knappes Budget: 40-60 $/Tag. Straßenessen (Falafel, Shawarma) ist erschwinglich. Supermärkte sind teuer.' },
      { type: 'kv', items: [
        { k: 'Falafel / Shawarma', v: '15-25 ILS (~4-7 €)' },
        { k: 'Hostel', v: '80-150 ILS/Nacht (~20-40 €)' },
        { k: 'Egged-Bus', v: '10-50 ILS' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wildcampen ist in den meisten Nationalparks verboten, aber im Negev und an manchen Stränden toleriert. Die Jugendherbergen (IYHA) sind gut verteilt. Freiwilligenarbeit in Kibbuz oder auf Bio-Farmen (WWOOF) bietet Kost und Logis gegen Arbeit.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Egged / Dan', detail: 'Ausgedehntes und zuverlässiges Busnetz', price: '10-50 ILS' },
        { emoji: '🚂', name: 'Israel Railways', detail: 'Schnellzug Tel Aviv-Jerusalem, wachsendes Netz', price: '15-40 ILS' },
      ]},
      { type: 'warn', text: '⚠️ Kein öffentlicher Nahverkehr am Schabbat (Freitagabend bis Samstagabend) außer in Haifa. Trampen ist die einzige kostenlose Option am Schabbat.' },
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'ok' }, { name: 'Feb', level: 'good' }, { name: 'Mär', level: 'great' },
        { name: 'Apr', level: 'great' }, { name: 'Mai', level: 'good' }, { name: 'Jun', level: 'ok' },
        { name: 'Jul', level: 'bad' }, { name: 'Aug', level: 'bad' }, { name: 'Sep', level: 'ok' },
        { name: 'Okt', level: 'great' }, { name: 'Nov', level: 'great' }, { name: 'Dez', level: 'ok' },
      ]},
      { type: 'text', text: 'März-Mai und Oktober-November: ideal. Der Sommer ist glühend heiß (35-45°C im Negev). Der Winter ist an der Küste mild (15-20°C) aber regnerisch.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Israelis sind direkt (das ist keine Unhöflichkeit, es ist kulturell). Sie stellen persönliche Fragen ohne Filter und bieten spontan ihre Hilfe an. Politische Diskussionen sind unvermeidlich. Kaffee und Hummus sind nationale Obsessionen.' },
    ]},
  },
  // ==================== ARGENTINA ====================
  AR: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Trampen (dedo im argentinischen Spanisch, "hacer dedo" = den Daumen heben) ist legal und verbreitet in Argentinien. Keine Einschränkungen. Es ist ein normales Transportmittel in Patagonien und in ländlichen Gebieten.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Argentinien ist ein ausgezeichnetes Land zum Trampen, besonders in Patagonien und im Nordwesten. Wartezeit: 15-45 Min in touristischen Gebieten, manchmal 2-3h im tiefen Patagonien (sehr wenig Verkehr).' },
      { type: 'sub', title: 'Nach Region' },
      { type: 'kv', items: [
        { k: 'Patagonien (Ruta 40)', v: 'Mythisch, aber wenig Verkehr. 2-3h Wartezeit einplanen.', color: 'amber' },
        { k: 'Nordwesten (Salta, Jujuy, Tucumán)', v: 'Einfach und gastfreundlich', color: 'green' },
        { k: 'Seengebiet (Bariloche)', v: 'Sehr gut, viele Backpacker', color: 'green' },
        { k: 'Buenos Aires (Stadtausfahrt)', v: 'Schwierig, nimm einen Bus bis zum Stadtrand', color: 'red' },
      ]},
      { type: 'text', text: 'YPF-Tankstellen sind die besten Spots. In Patagonien sprich die Fahrer an der Tankstelle an. Die Ruta 40 (5.000 km lang) ist der heilige Gral des argentinischen Trampens.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Argentinien ist außerhalb von Buenos Aires generell sicher zum Trampen. Patagonien ist sehr sicher. Der Nordwesten ist gastfreundlich. Meide die Vororte von Buenos Aires und Rosario.' },
      { type: 'kv', items: [{ k: 'Notfälle', v: '911' }, { k: 'Polizei', v: '101' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Alleinreisende Frauen berichten von überwiegend positiven Erfahrungen in Argentinien, besonders in Patagonien und im Nordwesten. Argentinier sind respektvoll, aber flirten gerne (Piropos = Straßenkomplimente). Ignorieren und weitergehen. Zu zweit reisen wird für abgelegene Gebiete empfohlen.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Argentinisches Spanisch (Castellano Rioplatense) ist die einzige Sprache. Englisch ist außerhalb von Buenos Aires selten. Grundkenntnisse in Spanisch sind unverzichtbar. Das "vos" ersetzt das "tú" und das "sh" ersetzt das "ll/y".' },
      { type: 'phrase', items: [
        { local: 'Hago dedo', meaning: 'Ich trampe' },
        { local: 'Me llevás hasta...?', meaning: 'Nimmst du mich mit bis... ?' },
        { local: 'Gracias, genial!', meaning: 'Danke, genial!' },
        { local: '¿Tenés lugar?', meaning: 'Hast du Platz?' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Argentinien schwankt stark (Inflation). 2025-2026 ist das Land mit dem Blue Dollar günstig für Ausländer. Knappes Budget: 15-25 €/Tag. Vollständige Mahlzeit: 3-6 €. Hostel: 5-15 €/Nacht.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wildcampen wird überall in Patagonien und in ländlichen Gebieten toleriert. Kommunale Campingplätze sind in vielen Städten kostenlos oder sehr günstig. In Patagonien ist der Wind der Hauptfeind (Böen von 100+ km/h).' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Fernbus', detail: 'Ausgezeichnetes Netz (Cama = Bett, Semi-Cama = Neigbar). Sehr komfortabel.', price: '10-50 €' },
        { emoji: '✈️', name: 'Inlandsflüge', detail: 'Aerolíneas Argentinas, FlyBondi. Die Entfernungen rechtfertigen das Fliegen.', price: '30-100 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'great' }, { name: 'Feb', level: 'great' }, { name: 'Mär', level: 'great' },
        { name: 'Apr', level: 'good' }, { name: 'Mai', level: 'ok' }, { name: 'Jun', level: 'bad' },
        { name: 'Jul', level: 'bad' }, { name: 'Aug', level: 'bad' }, { name: 'Sep', level: 'ok' },
        { name: 'Okt', level: 'good' }, { name: 'Nov', level: 'great' }, { name: 'Dez', level: 'great' },
      ]},
      { type: 'text', text: 'Südhalbkugel: der Sommer (Dezember-Februar) ist ideal für Patagonien. Der Nordwesten ist ganzjährig besuchbar (trocken im Winter). Der Winter in Patagonien ist rau (-10°C, Wind, Schnee).' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Argentinier sind herzlich, gesprächig und leidenschaftlich. Mate ist ein soziales Ritual: einen angebotenen Mate anzunehmen ist ein Zeichen der Freundschaft. Asados (Grillpartys) sind Gemeinschaftsereignisse. Gespräche können stundenlang dauern.' },
      { type: 'event', items: [
        { month: 'Feb', day: '⟳', name: 'Karneval (Gualeguaychú)', desc: 'Der größte Karneval Argentiniens.' },
        { month: 'Jan', day: '⟳', name: 'Festival de Cosquín', desc: 'Festival der argentinischen Folklore, traditionelle Musik.' },
      ]},
    ]},
  },
  // ==================== CHILE ====================
  CL: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Trampen ist in Chile legal. Keine Einschränkungen. Die Praxis ist in Patagonien und im Süden verbreitet. Die Carabineros (Polizei) sind gegenüber Trampern generell wohlwollend.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Chile ist sehr gut zum Trampen, besonders im Süden (Región de los Lagos, Carretera Austral). Das Land ist lang (4.300 km) und schmal. Die Ruta 5 (Panamericana) ist die Hauptachse.' },
      { type: 'sub', title: 'Nach Region' },
      { type: 'kv', items: [
        { k: 'Carretera Austral', v: 'Mythisch. Jeder hält an. Wenig Verkehr.', color: 'green' },
        { k: 'Seengebiet (Temuco-Puerto Montt)', v: 'Einfach, guter Verkehr', color: 'green' },
        { k: 'Norden (Atacama)', v: 'Wenig Verkehr, lange Wartezeiten', color: 'amber' },
        { k: 'Santiago (Stadtausfahrt)', v: 'Schwierig, Bus bis zum Stadtrand', color: 'red' },
      ]},
      { type: 'text', text: 'Die Mautstellen (Peajes) auf der Ruta 5 sind ausgezeichnete Spots: die Autos bremsen und du kannst mit den Fahrern sprechen. Copec- und Shell-Tankstellen funktionieren auch gut.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Chile ist das sicherste Land Südamerikas. Gewaltkriminalität ist außerhalb mancher Viertel in Santiago selten. Chilenen sind gastfreundlich und das chilenische Patagonien ist sehr sicher.' },
      { type: 'kv', items: [{ k: 'Notfälle', v: '131' }, { k: 'Carabineros (Polizei)', v: '133' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Chile gilt als sicher für alleinreisende Frauen. Patagonien und der Süden werden besonders empfohlen. Mehrere Solo-Reisende berichten von sehr positiven Erfahrungen.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Chilenisches Spanisch ist schnell und voller Slang. Das "po" am Satzende ist typisch (sí po = ja, no po = nein). Englisch ist außerhalb von Santiago selten.' },
      { type: 'phrase', items: [
        { local: 'Ando a dedo', meaning: 'Ich trampe' },
        { local: '¿Me podís llevar?', meaning: 'Kannst du mich mitnehmen?' },
        { local: 'Gracias, bacán!', meaning: 'Danke, super!' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Chile ist teurer als Argentinien. Knappes Budget: 15-30 €/Tag. Supermärkte (Lider, Jumbo) sind erschwinglich. Patagonien ist teurer.' },
      { type: 'kv', items: [
        { k: 'Hostel', v: '8-20 €/Nacht' },
        { k: 'Menú del día', v: '3-6 €' },
        { k: 'Empanada', v: '1-2 €' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wildcampen wird in ländlichen Gebieten und in Patagonien toleriert. CONAF-Campingplätze (Nationalparks) sind günstig. Die Carretera Austral hat zahlreiche wunderschöne Wildcamping-Spots.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Turbus / Pullman', detail: 'Komfortable Fernbusse, ausgedehntes Netz', price: '5-40 €' },
        { emoji: '⛴️', name: 'Navimag', detail: 'Fähre Puerto Montt-Puerto Natales (4 Tage, Fjorde)', price: '150-400 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'great' }, { name: 'Feb', level: 'great' }, { name: 'Mär', level: 'good' },
        { name: 'Apr', level: 'ok' }, { name: 'Mai', level: 'bad' }, { name: 'Jun', level: 'bad' },
        { name: 'Jul', level: 'bad' }, { name: 'Aug', level: 'bad' }, { name: 'Sep', level: 'ok' },
        { name: 'Okt', level: 'good' }, { name: 'Nov', level: 'great' }, { name: 'Dez', level: 'great' },
      ]},
      { type: 'text', text: 'November bis März: ideal für Patagonien und den Süden. Der Norden (Atacama) ist ganzjährig besuchbar. Der Winter sperrt die Carretera Austral (Schnee, gesperrte Straßen).' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Chilenen sind beim ersten Kontakt zurückhaltend, aber sehr herzlich, wenn das Eis gebrochen ist. Das "Once" (Vesper gegen 17 Uhr mit Tee, Brot, Avocado) ist eine wichtige Mahlzeit. Pisco Sour und chilenischer Wein sind Nationalstolz.' },
    ]},
  },
  // ==================== COLOMBIA ====================
  CO: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Trampen ist in Kolumbien legal. Keine Einschränkungen. Die Praxis ist auch bei Einheimischen verbreitet, besonders bei Studenten. Mautstellen (Peajes) sind die klassischen Spots.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Kolumbien ist ein gutes Land zum Trampen. Kolumbianer sind extrem gastfreundlich. Wartezeit: 15-30 Min auf Hauptstraßen. LKWs (Tractomulas) nehmen regelmäßig Passagiere mit.' },
      { type: 'sub', title: 'Wichtige Punkte' },
      { type: 'rule', icon: '🛣️', text: 'Mautstellen (Peajes) sind die besten Spots. Alle Hauptstraßen haben welche.' },
      { type: 'rule', icon: '🚛', text: 'LKW-Fahrer sind am zuverlässigsten für lange Strecken. Sehr gastfreundlich.' },
      { type: 'rule', icon: '⛽', text: 'Tankstellen an Stadtausfahrten funktionieren gut.' },
      { type: 'kv', items: [
        { k: 'Kaffeedreieck (Pereira, Armenia, Manizales)', v: 'Einfach und gastfreundlich', color: 'green' },
        { k: 'Karibikküste', v: 'Einfach, entspannte Atmosphäre', color: 'green' },
        { k: 'Bogotá (Stadtausfahrt)', v: 'Schwierig, nimm einen Bus bis zum Stadtrand', color: 'red' },
      ]},
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Kolumbien hat sich seit den 2000er Jahren enorm verändert. Touristengebiete und Hauptstraßen sind sicher. Meide abgelegene, nicht-touristische Gebiete und Grenzregionen (Venezuela, ländliches Ecuador).' },
      { type: 'kv', items: [{ k: 'Notfälle', v: '123' }, { k: 'Polizei', v: '112' }] },
      { type: 'warn', text: '⚠️ Reise nicht nachts auf Nebenstraßen. Erkundige dich vor Ort über zu meidende Gebiete. "Falsos Positivos" von Retenes (falsche Kontrollpunkte) sind sehr selten, aber es gibt sie.' },
    ]},
    women: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'Die Erfahrungen sind gemischt. Kolumbianer sind respektvoll, aber Machismo ist vorhanden. Alleinreisende Frauen berichten von positiven Erfahrungen auf Hauptstraßen. Zu zweit reisen wird für ländliche Gebiete empfohlen.' },
      { type: 'rule', icon: '👫', text: 'Mit einem/einer Begleiter(in) zu reisen ist empfohlen.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Kolumbianisches Spanisch gilt als eines der klarsten und am einfachsten zu verstehenden. Englisch ist außerhalb der touristischen Großstädte selten. Spanisch-Grundkenntnisse sind unverzichtbar.' },
      { type: 'phrase', items: [
        { local: 'Hago dedo / Pido aventón', meaning: 'Ich trampe' },
        { local: '¿Me lleva?', meaning: 'Nehmen Sie mich mit?' },
        { local: '¡Gracias, parcero!', meaning: 'Danke, Kumpel!' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Kolumbien ist günstig. Knappes Budget: 15-25 €/Tag. Die "Corrientazos" (Tagesmenü) sind reichhaltig und günstig.' },
      { type: 'kv', items: [
        { k: 'Hostel', v: '5-15 €/Nacht' },
        { k: 'Corrientazo (Tagesmenü)', v: '2-4 €' },
        { k: 'Fernbus', v: '10-30 €' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wildcampen ist in ländlichen Gebieten möglich, aber erkundige dich vor Ort. Kolumbianer laden Reisende manchmal zu sich nach Hause ein. Hängematten sind eine beliebte Alternative in tropischen Gebieten.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Fernbus', detail: 'Ausgedehntes Netz. Bolivariano und Expreso sind die besten Gesellschaften.', price: '5-30 €' },
        { emoji: '🚐', name: 'Colectivos / Chivas', detail: 'Bunter und günstiger Nahverkehr', price: '0,50-3 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'great' }, { name: 'Feb', level: 'great' }, { name: 'Mär', level: 'good' },
        { name: 'Apr', level: 'ok' }, { name: 'Mai', level: 'ok' }, { name: 'Jun', level: 'good' },
        { name: 'Jul', level: 'great' }, { name: 'Aug', level: 'great' }, { name: 'Sep', level: 'ok' },
        { name: 'Okt', level: 'ok' }, { name: 'Nov', level: 'ok' }, { name: 'Dez', level: 'great' },
      ]},
      { type: 'text', text: 'Dezember-Februar und Juni-August: Trockenzeiten. Das Klima variiert je nach Höhenlage (Bogotá: 15°C, Küste: 30°C). Die Karibikküste ist ganzjährig warm.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Kolumbianer gehören zu den gastfreundlichsten Menschen Lateinamerikas. Kaffee ist Nationalstolz (Kaffeezone = UNESCO). Musik (Vallenato, Cumbia, Reggaeton) ist allgegenwärtig. Fahrer drehen die Musik voll auf und es wird eine Feier.' },
      { type: 'event', items: [
        { month: 'Feb', day: '⟳', name: 'Karneval von Barranquilla', desc: 'Der zweitgrößte Karneval der Welt nach Rio.' },
        { month: 'Aug', day: '⟳', name: 'Feria de las Flores (Medellín)', desc: 'Blumenfestival, Silleteros-Umzug.' },
      ]},
    ]},
  },
  // ==================== THAILAND ====================
  TH: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Trampen ist in Thailand legal. Keine Einschränkungen. Das Konzept ist den Thais wenig bekannt, da der öffentliche Nahverkehr günstig und allgegenwärtig ist. Es ist eher "informeller Transport" als klassisches Trampen.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Thailand ist ein Sonderfall. Trampen im westlichen Sinne ist selten, aber Thais sind von Natur aus hilfsbereit. Wenn du mit einem Rucksack am Straßenrand stehst, wird irgendwann jemand anhalten und Hilfe anbieten. Das ist eine Form der Gastfreundschaft, kein traditionelles Trampen.' },
      { type: 'sub', title: 'Wie es funktioniert' },
      { type: 'rule', icon: '🏍️', text: 'Motorräder und Pickups halten leichter an als Autos.' },
      { type: 'rule', icon: '🤝', text: 'An Tankstellen oder Märkten warten ist effektiver als der Daumen am Straßenrand.' },
      { type: 'rule', icon: '👋', text: 'Kein Daumen hoch: strecke die Hand mit der Handfläche nach unten aus und winke zum Boden (wie beim Herbeiwinken eines Taxis).' },
      { type: 'text', text: 'Der Norden (Chiang Mai, Chiang Rai, Mae Hong Son) und der Nordosten (Isan) sind am einfachsten. Der touristische Süden ist schwieriger, da überall Taxis und Songthaews fahren.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Thailand ist ein sicheres Land für Reisende. Gewaltkriminalität gegen Touristen ist sehr selten. Betrug (Tuk-Tuk, Juwelierläden, Taxis ohne Taxameter) ist das Hauptrisiko.' },
      { type: 'kv', items: [
        { k: 'Notfälle / Touristenpolizei', v: '1155' },
        { k: 'Krankenwagen', v: '1669' },
        { k: 'Polizei', v: '191' },
      ]},
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Thailand gilt als sicher für alleinreisende Frauen. Der Buddhismus beeinflusst den Respekt gegenüber Frauen. Vorfälle sind selten. Partyzonen (Full Moon Party) erfordern mehr Vorsicht.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Thai ist die Amtssprache. Englisch ist außerhalb touristischer Gebiete begrenzt. Google Translate mit Kamera ist ein wertvolles Werkzeug. Thai ist eine Tonsprache (5 Töne): die Aussprache ist entscheidend.' },
      { type: 'phrase', items: [
        { local: 'Sawadee krap/ka', meaning: 'Hallo (krap = Mann, ka = Frau)' },
        { local: 'Khop khun krap/ka', meaning: 'Danke' },
        { local: 'Pai... dai mai?', meaning: 'Nach... fahren möglich?' },
        { local: 'Free, mai tong jai', meaning: 'Kostenlos, muss nicht bezahlen' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Thailand ist sehr günstig. Knappes Budget: 10-20 €/Tag (selbst ohne Trampen). Ein Pad Thai vom Straßenstand kostet 1-2 €.' },
      { type: 'kv', items: [
        { k: 'Straßenessen', v: '30-80 THB (1-2 €)' },
        { k: 'Hostel', v: '150-400 THB (4-11 €)' },
        { k: 'Fernbus', v: '200-800 THB (5-22 €)' },
        { k: '7-Eleven Sandwich', v: '30-60 THB (1-2 €)' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wildcampen wird in ländlichen Gebieten toleriert. Buddhistische Tempel beherbergen manchmal Reisende (freiwillige Spende). Guesthouses sind so günstig (4-8 €), dass Camping nicht wirklich nötig ist.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'VIP-Bus / 1. Klasse', detail: 'Komfortabel, Klimaanlage, ausgedehntes Netz', price: '5-20 €' },
        { emoji: '🚂', name: 'Zug (SRT)', detail: 'Langsam aber landschaftlich reizvoll. Nachtzug Bangkok-Chiang Mai = Klassiker.', price: '5-30 €' },
        { emoji: '🛺', name: 'Songthaew', detail: 'Geteilter Pickup mit Bänken, Nahverkehr', price: '0,30-1 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'great' }, { name: 'Feb', level: 'great' }, { name: 'Mär', level: 'good' },
        { name: 'Apr', level: 'ok' }, { name: 'Mai', level: 'ok' }, { name: 'Jun', level: 'ok' },
        { name: 'Jul', level: 'ok' }, { name: 'Aug', level: 'bad' }, { name: 'Sep', level: 'bad' },
        { name: 'Okt', level: 'bad' }, { name: 'Nov', level: 'good' }, { name: 'Dez', level: 'great' },
      ]},
      { type: 'text', text: 'November bis Februar: kühle und trockene Jahreszeit, ideal. März-Mai: sehr heiß (40°C+). Juni-Oktober: Monsun (Starkregen am Nachmittag, überflutbare Straßen in manchen Regionen).' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Thailand ist das "Land des Lächelns". Thais sind nicht-konfrontativ und lächelnd. Erhebe niemals die Stimme, zeige nicht die Füße (unhöflich), und ziehe deine Schuhe aus, wenn du bei jemandem eintritst. Der König ist heilig: mache NIEMALS negative Kommentare (Majestätsbeleidigung = Gefängnis).' },
      { type: 'event', items: [
        { month: 'Apr', day: '13-15', name: 'Songkran (Thai Neujahr)', desc: 'Riesige Wasserschlacht im ganzen Land. Chaotischer aber festlicher Transport.' },
        { month: 'Nov', day: '⟳', name: 'Loy Krathong', desc: 'Laternen und schwimmende Opfergaben. Magische Atmosphäre.' },
      ]},
    ]},
  },
  // ==================== INDIA ====================
  IN: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Trampen ist in Indien nicht geregelt. Es gibt kein formelles Konzept, aber informeller Transport (in LKWs, Pickups, Traktoren mitfahren) ist ein Lebensstil. LKW-Fahrer nehmen regelmäßig Passagiere mit.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Indien ist ein Sonderfall. Den Daumen hochhalten gibt es nicht. Strecke die Hand mit der Handfläche nach unten aus. LKWs sind das Haupttransportmittel zum Trampen. LKW-Fahrer (Truckwallahs) bilden eine solidarische Gemeinschaft.' },
      { type: 'sub', title: 'Wie es funktioniert' },
      { type: 'rule', icon: '🚛', text: 'Dhabas (Straßenrestaurants) sind die Haltepunkte der LKW-Fahrer. Sprich die Fahrer während ihrer Mahlzeit an.' },
      { type: 'rule', icon: '💰', text: 'LKW-Fahrer akzeptieren oft eine bescheidene Bezahlung. Verhandle VOR dem Einsteigen. Kläre, ob es kostenlos ist oder wie viel.' },
      { type: 'rule', icon: '🛣️', text: 'Die National Highways (NH) haben den meisten Fernverkehr.' },
      { type: 'kv', items: [
        { k: 'Ladakh / Manali-Leh Highway', v: 'Mythisch. Militär- und Zivil-LKWs.', color: 'green' },
        { k: 'Rajasthan', v: 'Gut. LKWs und Jeeps.', color: 'green' },
        { k: 'Himachal Pradesh', v: 'Einfach, gastfreundliche Einheimische', color: 'green' },
        { k: 'Großstädte (Delhi, Mumbai)', v: 'Unmöglich in der Stadt, einfach an den Ausfahrten', color: 'red' },
      ]},
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Indien ist generell sicher, aber kann chaotisch sein. LKW-Fahrer sind generell zuverlässig. Steige nie in ein Fahrzeug, wenn die Insassen betrunken zu sein scheinen. Der indische Verkehr ist die Hauptgefahr (unberechenbares Fahren).' },
      { type: 'kv', items: [
        { k: 'Notfälle', v: '112' },
        { k: 'Polizei', v: '100' },
        { k: 'Krankenwagen', v: '108' },
      ]},
    ]},
    women: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'Alleine als Frau zu trampen wird in Indien abgeraten. Sexuelle Belästigung ist ein dokumentiertes Problem. Zu zweit reisen (mit einem Mann) verändert die Erfahrung grundlegend. Frauen, die in Indien zu zweit getrampt sind, berichten von positiven Erfahrungen.' },
      { type: 'rule', icon: '👫', text: 'Mit einem männlichen Begleiter zu reisen wird dringend empfohlen.' },
      { type: 'rule', icon: '👕', text: 'Konservative Kleidung unverzichtbar (Schultern und Knie bedeckt, keine enge Kleidung).' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Hindi ist die am weitesten verbreitete Sprache, aber Indien hat 22 Amtssprachen und Hunderte von Dialekten. Englisch wird in Städten und von jungen Gebildeten verstanden. LKW-Fahrer sprechen oft nur Hindi.' },
      { type: 'phrase', items: [
        { local: 'Namaste', meaning: 'Hallo (universell in Indien)' },
        { local: 'Dhanyavaad / Shukriya', meaning: 'Danke (Hindi)' },
        { local: '... tak jaana hai', meaning: 'Ich möchte nach... fahren' },
        { local: 'Free hai?', meaning: 'Ist es kostenlos?' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Indien ist eines der günstigsten Länder der Welt. Knappes Budget: 5-15 €/Tag. Dhabas (Straßenkantinen) servieren reichhaltige Mahlzeiten für 1-2 €.' },
      { type: 'kv', items: [
        { k: 'Dhaba (komplette Mahlzeit)', v: '50-150 INR (0,50-1,50 €)' },
        { k: 'Guesthouse', v: '300-800 INR (3-8 €)' },
        { k: 'Zug Sleeper Class', v: '100-500 INR (1-5 €)' },
        { k: 'Chai (Tee)', v: '10-20 INR (0,10-0,20 €)' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wildcampen ist im Himalaya und in ländlichen Gebieten möglich. Dhabas erlauben manchmal, auf den Charpoys (Seilbetten) für wenige Rupien zu schlafen. Sikh-Tempel (Gurdwara) bieten kostenlose Unterkunft und Mahlzeiten für alle (Langar).' },
      { type: 'tip', text: '💡 Gurdwaras (Sikh-Tempel) nehmen JEDEN kostenlos auf. Essen und Unterkunft. Das ist eine Säule des Sikhismus.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚂', name: 'Indian Railways', detail: 'Größtes Eisenbahnnetz der Welt. Sleeper Class = Budget. AC = Komfort.', price: '1-20 €' },
        { emoji: '🚌', name: 'Regierungsbusse', detail: 'Dichtes Netz, günstig aber langsam', price: '1-10 €' },
        { emoji: '🛺', name: 'Auto-Rikscha', detail: 'Nahverkehr in den Städten', price: '0,30-2 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'good' }, { name: 'Feb', level: 'great' }, { name: 'Mär', level: 'great' },
        { name: 'Apr', level: 'ok' }, { name: 'Mai', level: 'bad' }, { name: 'Jun', level: 'bad' },
        { name: 'Jul', level: 'bad' }, { name: 'Aug', level: 'bad' }, { name: 'Sep', level: 'ok' },
        { name: 'Okt', level: 'great' }, { name: 'Nov', level: 'great' }, { name: 'Dez', level: 'good' },
      ]},
      { type: 'text', text: 'Oktober bis März: ideal für den größten Teil Indiens. April-Mai: sehr heiß (45°C+). Juni-September: Monsun (überflutete Straßen, Erdrutsche in den Bergen). Ladakh ist nur von Juni bis September zugänglich.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Indien ist ein garantierter Kulturschock. Gastfreundschaft ist tief verwurzelt. Fahrer bieten Chai (Tee), Mahlzeiten und manchmal Unterkunft an. Das "Head Wobble" (Kopfbewegung) bedeutet gleichzeitig ja/einverstanden/vielleicht. Iss nur mit der rechten Hand (die linke gilt als unrein).' },
      { type: 'event', items: [
        { month: 'Mär', day: '⟳', name: 'Holi', desc: 'Fest der Farben. Überall werden Farbpulver geworfen. Gestörter Transport, aber unglaubliche Atmosphäre.' },
        { month: 'Okt-Nov', day: '⟳', name: 'Diwali', desc: 'Lichterfest. Feuerwerk, Lichterketten, Süßigkeiten. Die Menschen sind besonders großzügig.' },
      ]},
    ]},
  },
  // ==================== JAPAN ====================
  JP: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Trampen ist in Japan legal. Keine Einschränkungen. Die Service Areas (SA) und Parking Areas (PA) auf den Autobahnen sind die klassischen Spots. Es ist verboten, auf der Autobahn selbst zu stehen.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Japan ist trotz der kulturellen Barriere erstaunlich gut zum Trampen. Wartezeit: 15-45 Min. Japaner, die anhalten, sind oft neugierig und begeistert. Viele machen wichtige Umwege oder laden zum Essen ein.' },
      { type: 'sub', title: 'Die japanische Methode' },
      { type: 'rule', icon: '📝', text: 'Ein Schild in Katakana (japanische Schrift) mit deinem Ziel ist quasi Pflicht. Japaner lesen selten das lateinische Alphabet.' },
      { type: 'rule', icon: '⛽', text: 'Service Areas (SA) auf den Autobahnen sind die besten Spots. Du kannst sie zu Fuß oder per Trampen vom Eingang erreichen.' },
      { type: 'rule', icon: '😊', text: 'Lächeln, sich verbeugen und höflich sein ist entscheidend. Das Erscheinungsbild zählt: sei sauber und gut gekleidet.' },
      { type: 'kv', items: [
        { k: 'Hokkaidō', v: 'Am besten. Groß, ländlich, gastfreundlich.', color: 'green' },
        { k: 'Ländliche Gebiete (Shikoku, Kyūshū)', v: 'Sehr gut, neugierige Leute', color: 'green' },
        { k: 'Tokio, Osaka (Stadtausfahrt)', v: 'Schwierig, nutze den Zug bis zu einer SA', color: 'red' },
      ]},
      { type: 'tip', text: '💡 Eine Flagge deines Landes am Rucksack ist ein hervorragender Eisbrecher in Japan.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Japan ist eines der sichersten Länder der Welt. Du kannst deinen Rucksack unbeaufsichtigt lassen. Kriminalität gegen Ausländer ist quasi inexistent. Das einzige Risiko ist, sich zu verirren.' },
      { type: 'kv', items: [{ k: 'Notfälle / Feuerwehr', v: '119' }, { k: 'Polizei', v: '110' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Japan ist sehr sicher für alleinreisende Frauen. Reisende berichten von extrem positiven Erfahrungen. Japaner sind respektvoll und die Gesellschaft ist sehr sicher. Auch Fahrerinnen halten an.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Japanisch ist die einzige Sprache. Englisch ist selbst in Großstädten sehr begrenzt. Ein Schild in Katakana ist unverzichtbar. Google Translate (Kameramodus) ist dein bester Freund.' },
      { type: 'phrase', items: [
        { local: 'Konnichiwa', meaning: 'Hallo' },
        { local: 'Arigatō gozaimasu', meaning: 'Vielen Dank' },
        { local: 'Hitchhike shimasu', meaning: 'Ich trampe (wird von Japanern verstanden)' },
        { local: '... made onegaishimasu', meaning: 'Bis... bitte' },
      ]},
      { type: 'tip', text: '💡 Schreibe deine Ziele in Katakana auf Schilder. Japaner lieben den Aufwand und das erhöht deine Chancen.' },
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Japan ist teuer, aber es gibt Tricks. Knappes Budget: 25-40 €/Tag mit Trampen und Camping.' },
      { type: 'kv', items: [
        { k: 'Konbini (7-Eleven, Lawson) Mahlzeit', v: '300-600 ¥ (2-4 €)' },
        { k: 'Manga-Café (Nacht)', v: '1.500-2.500 ¥ (10-17 €)' },
        { k: 'Hostel', v: '2.000-4.000 ¥ (13-27 €)' },
        { k: 'Onsen (Thermalbad)', v: '300-1.000 ¥ (2-7 €)' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wildcampen ist technisch verboten, aber in Japan sehr toleriert (Biwak-Kultur). Michi-no-Eki (Straßenstationen) und Parks erlauben diskretes Campen. Manga-Cafés (mit Dusche) sind eine komfortable Alternative für Stadtnächte.' },
      { type: 'tip', text: '💡 Japanische Fahrer laden Tramper manchmal in Onsen (Thermalbäder), Restaurants oder sogar zu sich nach Hause ein. Eine einzigartige Erfahrung.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚄', name: 'Shinkansen', detail: 'Hochgeschwindigkeitszug. Der JR Pass bietet unbegrenzten Zugang.', price: 'JR Pass 7 Tage: ~200 €' },
        { emoji: '🚌', name: 'Nachtbus', detail: 'Willer Express, günstiger als der Shinkansen', price: '2.000-6.000 ¥' },
        { emoji: '⛴️', name: 'Fähre', detail: 'Zwischen den Inseln, oft mit Kabine', price: '2.000-10.000 ¥' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mär', level: 'good' },
        { name: 'Apr', level: 'great' }, { name: 'Mai', level: 'great' }, { name: 'Jun', level: 'ok' },
        { name: 'Jul', level: 'ok' }, { name: 'Aug', level: 'ok' }, { name: 'Sep', level: 'good' },
        { name: 'Okt', level: 'great' }, { name: 'Nov', level: 'great' }, { name: 'Dez', level: 'ok' },
      ]},
      { type: 'text', text: 'April-Mai (Sakura, Kirschblüte) und Oktober-November (Kōyō, Herbstlaub): ideal. Juni: Regenzeit (Tsuyu). Der Sommer ist heiß und feucht (35°C). Der Winter in Hokkaidō ist rau, aber Trampen funktioniert.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Trampen in Japan ist eine einzigartige kulturelle Erfahrung. Fahrer, die anhalten, sind oft von der Begegnung begeistert. Sie bringen dich in lokale Restaurants, Onsen, Sehenswürdigkeiten, die sie dir zeigen wollen. Manche Fahrer machen stundenlange Umwege. Biete ein kleines Geschenk aus deinem Land als Dankeschön an (sehr geschätzt).' },
      { type: 'event', items: [
        { month: 'Apr', day: '⟳', name: 'Hanami (Kirschblüte)', desc: 'Picknicks unter den Kirschbäumen überall. Festliche Zeit.' },
        { month: 'Jul-Aug', day: '⟳', name: 'Matsuri (Sommerfeste)', desc: 'Lokale Festivals überall. Feuerwerke (Hanabi). Einzigartige Atmosphäre.' },
      ]},
    ]},
  },
  // ==================== SOUTH AFRICA ====================
  ZA: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Trampen ist in Südafrika legal. Keine Einschränkungen. Minibus-Taxis sind das Haupttransportmittel der Südafrikaner, aber manche trampen auch informell.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Südafrika ist zum Trampen möglich, erfordert aber Vorsicht. Die Entfernungen sind groß und die Kriminalitätsrate in manchen Gebieten hoch. Ländliche Gebiete und die Garden Route sind am besten geeignet.' },
      { type: 'kv', items: [
        { k: 'Garden Route (Kapstadt-Port Elizabeth)', v: 'Am besten, touristisch und sicher', color: 'green' },
        { k: 'Drakensberg / ländlicher Free State', v: 'Gut, gastfreundlich', color: 'green' },
        { k: 'Johannesburg', v: 'Zum Trampen unbedingt meiden', color: 'red' },
        { k: 'Townships / Stadtgebiete', v: 'Abgeraten', color: 'red' },
      ]},
      { type: 'text', text: 'Tankstellen (Engen, Shell, Caltex) sind die besten Spots. Sprich die Fahrer direkt an. Die Afrikaaner (Land) sind oft am gastfreundlichsten gegenüber Trampern.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Südafrika hat eine hohe Kriminalitätsrate. Carjacking und Diebstähle sind reale Risiken. Ländliche und touristische Gebiete sind jedoch viel sicherer. Trampe NIEMALS nachts.' },
      { type: 'kv', items: [{ k: 'Notfälle', v: '10111' }, { k: 'Krankenwagen', v: '10177' }] },
      { type: 'warn', text: '⚠️ Trampe nicht allein in Stadtgebieten. Bevorzuge ländliche Gebiete und die Garden Route. Informiere dich vor Ort über zu meidende Gebiete.' },
    ]},
    women: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'Alleine als Frau zu trampen wird in Südafrika abgeraten. Das Land hat eine hohe Rate an geschlechtsspezifischer Gewalt. Zu zweit reisen wird dringend empfohlen. Die Garden Route mit einem/einer Begleiter(in) ist machbar.' },
      { type: 'rule', icon: '👫', text: 'Mit einem/einer Begleiter(in) zu reisen ist quasi Pflicht.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Südafrika hat 11 Amtssprachen. Englisch wird fast überall verstanden. Afrikaans ist die Sprache vieler Fahrer im Western Cape und Free State. Zulu und Xhosa sind die am meisten gesprochenen Sprachen.' },
      { type: 'phrase', items: [
        { local: 'Howzit', meaning: 'Hallo / Wie geht\'s (südafrikanischer Slang)' },
        { local: 'Sharp sharp', meaning: 'Cool, OK' },
        { local: 'Dankie / Enkosi', meaning: 'Danke (Afrikaans / Xhosa)' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Südafrika ist für Ausländer erschwinglich. Knappes Budget: 20-35 €/Tag.' },
      { type: 'kv', items: [
        { k: 'Backpacker-Hostel', v: '100-250 ZAR (5-13 €)' },
        { k: 'Restaurantmahlzeit', v: '80-150 ZAR (4-8 €)' },
        { k: 'Braai (BBQ) vom Supermarkt', v: '50-100 ZAR (3-5 €)' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wildcampen ist in ländlichen Gebieten möglich, aber die Sicherheit muss vor Ort bewertet werden. Campingplätze in Naturreservaten (SANParks) sind sicher und gut ausgestattet. Das Backpacker-Hostel-Netz ist entlang der Garden Route ausgezeichnet.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚐', name: 'Baz Bus', detail: 'Hop-on/Hop-off-Bus für Backpacker, Küstennetz', price: '200-500 ZAR' },
        { emoji: '🚌', name: 'Greyhound / Intercape', detail: 'Zuverlässige Fernbusse', price: '200-800 ZAR' },
        { emoji: '🚂', name: 'Shosholoza Meyl', detail: 'Günstiger Fernzug (Joburg-Kapstadt)', price: '200-600 ZAR' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'great' }, { name: 'Feb', level: 'great' }, { name: 'Mär', level: 'great' },
        { name: 'Apr', level: 'good' }, { name: 'Mai', level: 'ok' }, { name: 'Jun', level: 'ok' },
        { name: 'Jul', level: 'ok' }, { name: 'Aug', level: 'ok' }, { name: 'Sep', level: 'good' },
        { name: 'Okt', level: 'great' }, { name: 'Nov', level: 'great' }, { name: 'Dez', level: 'great' },
      ]},
      { type: 'text', text: 'Südhalbkugel: der Sommer (November-März) ist ideal. Das Western Cape ist mediterran (trocken im Sommer, regnerisch im Winter). Der Drakensberg ist im Winter kalt. Der Krüger ist von Mai bis September am besten (Trockenzeit, Tiere sichtbar).' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Südafrika ist die "Regenbogennation". Die Kulturen vermischen sich und die Gespräche sind reichhaltig. Braai (Grillen) ist eine Nationalreligion. Biltong (Trockenfleisch) ist der Reisesnack schlechthin. Ubuntu ("Ich bin, weil wir sind") ist die vorherrschende Philosophie.' },
    ]},
  },
  // ==================== IRAN ====================
  IR: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Trampen ist im Iran legal. Keine Einschränkungen. Die Praxis ist verbreitet, da viele Iraner kein Auto haben und der ländliche Nahverkehr begrenzt ist. Die iranische Gastfreundschaft macht Trampen natürlich.' },
      { type: 'warn', text: '⚠️ Ein Visum ist für die meisten Nationalitäten Pflicht. Manche Länder (USA, UK, Kanada) erfordern einen Pflichtführer. Prüfe die Anforderungen vor der Reise.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Der Iran ist eines der besten Länder der Welt zum Trampen. Die iranische Gastfreundschaft (Ta\'arof) ist legendär. Fahrer halten an, ohne dass man es verlangt, bestehen darauf, die Mahlzeit zu bezahlen, und bieten Unterkunft bei sich zu Hause an. Durchschnittliche Wartezeit: 5-15 Min.' },
      { type: 'text', text: 'Das Konzept des Tarof (übertriebene Höflichkeit) bedeutet, dass Iraner darauf bestehen, dir zu helfen. Wenn ein Fahrer dein Geld ablehnt, ist es aufrichtig (biete aber aus Höflichkeit 3-mal an). In ländlichen Gebieten ist der Verkehr gering, aber jeder hält an.' },
      { type: 'sub', title: 'Empfohlene Gebiete' },
      { type: 'kv', items: [
        { k: 'Isfahan-Schiras-Yazd (touristisches Dreieck)', v: 'Ausgezeichnet, guter Verkehr', color: 'green' },
        { k: 'Kaspische Küste (Norden)', v: 'Einfach, grüne Landschaften', color: 'green' },
        { k: 'Iranisches Kurdistan (Westen)', v: 'Sehr gastfreundlich', color: 'green' },
        { k: 'Grenzgebiete (Irak, Afghanistan, Pakistan)', v: 'Abgeraten', color: 'red' },
      ]},
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Der Iran ist ein sehr sicheres Land für Reisende. Die Kriminalität ist niedrig. Iraner sind beschützend gegenüber Ausländern. Das Hauptrisiko ist, zu viel zu essen (jeder Fahrer besteht darauf, dich einzuladen). Meide die Grenzgebiete (Sistan-Belutschistan, Grenzen zu Irak und Afghanistan).' },
      { type: 'kv', items: [{ k: 'Notfälle', v: '115' }, { k: 'Polizei', v: '110' }] },
    ]},
    women: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'Frauen müssen im Iran das Hijab (Kopftuch) tragen (gesetzlich vorgeschrieben). Alleine als Frau zu trampen ist möglich, erfordert aber Vorsicht. Viele Reisende berichten von positiven Erfahrungen, aber auch von einigen unangenehmen Situationen. Zu zweit reisen wird empfohlen.' },
      { type: 'rule', icon: '🧕', text: 'Hijab ist Pflicht (Kopftuch, das die Haare bedeckt). Weite Kleidung, die Arme und Beine bedeckt.' },
      { type: 'rule', icon: '👫', text: 'Familien und Fahrerinnen sind die sichersten Mitfahrgelegenheiten.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Farsi (Persisch) ist die Hauptsprache. Englisch ist außerhalb von Teheran und Isfahan selten. Das Alphabet ist arabisch (von rechts nach links gelesen). Iraner lieben es, wenn Ausländer ein paar Worte Farsi sprechen.' },
      { type: 'phrase', items: [
        { local: 'Salam', meaning: 'Hallo' },
        { local: 'Merci / Mamnun', meaning: 'Danke' },
        { local: 'Lotfan', meaning: 'Bitte' },
        { local: 'Mosāfer hastam', meaning: 'Ich bin ein Reisender' },
        { local: 'Rāyegan', meaning: 'Kostenlos' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Der Iran ist sehr günstig (besonders mit dem inoffiziellen Wechselkurs). Knappes Budget: 10-20 €/Tag. Fahrer bezahlen oft die Mahlzeit. Das Problem: internationale Bankkarten funktionieren NICHT im Iran. Bringe Euro oder Dollar in bar mit.' },
      { type: 'kv', items: [
        { k: 'Lokale Mahlzeit (Kebab, Reis)', v: '2-5 €' },
        { k: 'Mosāferkhāne (einfaches Hotel)', v: '5-15 €' },
        { k: 'Fernbus (VIP)', v: '3-10 €' },
      ]},
      { type: 'warn', text: '⚠️ KEINE internationale Bankkarte funktioniert im Iran (Sanktionen). Bringe dein GESAMTES Geld in bar mit (Euro oder Dollar).' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wildcampen wird in den Bergen (Alborz, Zagros) toleriert. In der Stadt sind Mosāferkhāne (einfache Hotels) günstig. Fahrer laden Reisende SEHR oft zu sich nach Hause ein. Abzulehnen ist fast unhöflich. Moscheen bieten manchmal Unterkunft für Reisende.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'VIP-Bus', detail: 'Komfortabel, ausgedehntes Netz, sehr günstig', price: '3-10 €' },
        { emoji: '🚂', name: 'Zug', detail: 'Begrenztes Netz, aber komfortable Nachtzüge', price: '5-15 €' },
        { emoji: '🚕', name: 'Savari (Sammeltaxi)', detail: 'Geteilte Taxis zwischen Städten, warten bis sie voll sind', price: '2-8 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Feb', level: 'ok' }, { name: 'Mär', level: 'great' },
        { name: 'Apr', level: 'great' }, { name: 'Mai', level: 'great' }, { name: 'Jun', level: 'ok' },
        { name: 'Jul', level: 'bad' }, { name: 'Aug', level: 'bad' }, { name: 'Sep', level: 'ok' },
        { name: 'Okt', level: 'great' }, { name: 'Nov', level: 'good' }, { name: 'Dez', level: 'ok' },
      ]},
      { type: 'text', text: 'März-Mai (Nowruz, persisches Neujahr) und September-November: ideal. Der Sommer ist im Süden glühend heiß (45°C+), aber in den Bergen angenehm. Der Winter ist im Norden und in den Bergen kalt.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Die iranische Gastfreundschaft wird von vielen Reisenden als die beste der Welt betrachtet. Ta\'arof (Höflichkeitskodex) bedeutet, dass Iraner darauf bestehen, dich einzuladen, zu füttern und zu beherbergen. Die persische Kultur ist verfeinert (Dichtung von Hafis, Rumi). Iraner sind stolz darauf, ihr Land zu zeigen und westliche Vorurteile zu widerlegen.' },
      { type: 'event', items: [
        { month: 'Mär', day: '20-21', name: 'Nowruz (Persisches Neujahr)', desc: 'Das größte Fest des Jahres. 13 Tage Urlaub. Alle reisen, viel Verkehr.' },
      ]},
    ]},
  },
  // ==================== TUNISIA ====================
  TN: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Trampen ist in Tunesien legal. Keine Einschränkungen. Die Praxis ist bei Einheimischen verbreitet, besonders in ländlichen Gebieten. "Louages" (Sammeltaxis) sind das Haupttransportmittel, aber Trampen funktioniert gut.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Tunesien ist einfach zum Trampen. Das Land ist klein (780 km Nord-Süd) und die Tunesier sind gastfreundlich. Wartezeit: 10-30 Min. Fahrer halten leicht an, besonders für Ausländer.' },
      { type: 'rule', icon: '🚛', text: 'LKWs nehmen auf langen Strecken Passagiere mit (Achtung: manche erwarten ein Trinkgeld).' },
      { type: 'rule', icon: '⛽', text: 'Tankstellen an Stadtausfahrten sind die besten Spots.' },
      { type: 'text', text: 'Der Süden (Tozeur, Douz, Tataouine) hat wenig Verkehr, aber jeder hält an. Der Norden und die Küste haben mehr Verkehr.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Tunesien ist generell sicher für Reisende. Meide die Grenzgebiete zu Libyen und Algerien (Kasserine, Jendouba). Touristenbetrug gibt es in den Medinas.' },
      { type: 'kv', items: [{ k: 'Polizei', v: '197' }, { k: 'SAMU', v: '190' }, { k: 'Notfälle', v: '112' }] },
    ]},
    women: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'Straßenbelästigung ist in Tunesien häufig. Alleinreisende Frauen, die trampen, berichten von gemischten Erfahrungen. Zu zweit reisen wird dringend empfohlen. Touristengebiete (Sidi Bou Saïd, Hammamet) sind entspannter.' },
      { type: 'rule', icon: '👫', text: 'Zu zweit reisen wird dringend empfohlen.' },
      { type: 'rule', icon: '👕', text: 'Kleide dich außerhalb der Badeorte konservativ.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Tunesisches Arabisch (Derja) ist die Lokalsprache. Französisch ist weit verbreitet (fast jeder spricht es). Englisch nimmt bei den Jungen zu.' },
      { type: 'phrase', items: [
        { local: 'Bahi / Barcha', meaning: 'Gut / Viel' },
        { local: 'Yaatik essaha', meaning: 'Danke (möge Gott dir Gesundheit geben)' },
        { local: 'Win temchi?', meaning: 'Wohin fährst du?' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Sehr günstig. Knappes Budget: 15-25 €/Tag. Der Freitags-Couscous wird oft kostenlos geteilt.' },
      { type: 'kv', items: [
        { k: 'Lokale Mahlzeit', v: '2-5 TND (0,60-1,50 €)' },
        { k: 'Hostel', v: '20-50 TND (6-15 €)' },
        { k: 'Louage (100 km)', v: '5-10 TND (1,50-3 €)' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wildcampen wird im Süden und in ländlichen Gebieten toleriert. Tunesier laden Reisende leicht zu sich nach Hause ein. Jugendherbergen sind günstig.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚐', name: 'Louage', detail: 'Sammeltaxi zwischen Städten. Wartet bis es voll ist. Schnell und günstig.', price: '1-5 €' },
        { emoji: '🚂', name: 'SNCFT (Zug)', detail: 'Begrenztes Netz, aber günstig', price: '1-5 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'ok' }, { name: 'Feb', level: 'good' }, { name: 'Mär', level: 'great' },
        { name: 'Apr', level: 'great' }, { name: 'Mai', level: 'great' }, { name: 'Jun', level: 'good' },
        { name: 'Jul', level: 'ok' }, { name: 'Aug', level: 'ok' }, { name: 'Sep', level: 'good' },
        { name: 'Okt', level: 'great' }, { name: 'Nov', level: 'good' }, { name: 'Dez', level: 'ok' },
      ]},
      { type: 'text', text: 'März-Mai und September-November: ideal. Der Sommer ist heiß (40°C+ im Süden). Der Winter ist an der Küste mild, aber in den Bergen kühl.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Die tunesische Gastfreundschaft ist aufrichtig. Pfefferminztee und türkischer Kaffee werden großzügig angeboten. Der Freitags-Couscous ist ein Familienritual. Tunesier sind stolz auf ihre Geschichte (Karthago) und sprechen gerne darüber.' },
    ]},
  },
  // ==================== MEXICO ====================
  MX: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Trampen ("pedir aventón" oder "pedir raid") ist in Mexiko legal. Keine Einschränkungen. Verbreitet in ländlichen Gebieten. Indigene Gemeinschaften trampen regelmäßig.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Mexiko ist gut zum Trampen außerhalb der Risikogebiete. Mexikaner sind gastfreundlich und neugierig gegenüber Ausländern. Wartezeit: 15-45 Min. LKWs nehmen regelmäßig Passagiere mit.' },
      { type: 'sub', title: 'Beste Regionen' },
      { type: 'kv', items: [
        { k: 'Oaxaca / Chiapas', v: 'Ausgezeichnet, gastfreundliche Gemeinschaften', color: 'green' },
        { k: 'Yucatán', v: 'Gut, touristisch, guter Verkehr', color: 'green' },
        { k: 'Baja California', v: 'Machbar, wenig Verkehr in der Wüste', color: 'amber' },
        { k: 'Norden (Sinaloa, Tamaulipas, Chihuahua)', v: 'Abgeraten (Kartelle)', color: 'red' },
      ]},
      { type: 'rule', icon: '⛽', text: 'Casetas (Mautstellen) und Pemex-Tankstellen sind die besten Spots.' },
      { type: 'rule', icon: '🚛', text: '"Tráilers" (LKWs) fahren lange Strecken. Sprich die Fahrer an Tankstellen an.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Die Sicherheit variiert stark je nach Region. Der Süden (Oaxaca, Chiapas, Yucatán) und das Zentrum (Guanajuato, Puebla) sind am sichersten. Meide unbedingt den Nordwesten (Sinaloa), Tamaulipas und problematische Grenzgebiete.' },
      { type: 'kv', items: [{ k: 'Notfälle', v: '911' }, { k: 'Touristenpolizei', v: '078' }] },
      { type: 'warn', text: '⚠️ Reise NIEMALS nachts auf den Straßen Nordmexikos. Erkundige dich vor Ort und bei anderen Reisenden (Facebook-Gruppen) über zu meidende Gebiete.' },
    ]},
    women: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'Machismo ist in Mexiko vorhanden. Alleinreisende Frauen, die trampen, berichten von gemischten Erfahrungen. Der Süden ist sicherer. Zu zweit reisen wird dringend empfohlen.' },
      { type: 'rule', icon: '👫', text: 'Mit einem/einer Begleiter(in) zu reisen wird dringend empfohlen.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Spanisch ist unverzichtbar. Englisch ist außerhalb touristischer Gebiete (Cancún, Playa del Carmen) selten. 68 indigene Sprachen werden noch gesprochen.' },
      { type: 'phrase', items: [
        { local: '¿Me da un aventón / raid?', meaning: 'Nehmen Sie mich per Anhalter mit?' },
        { local: '¿Hasta dónde va?', meaning: 'Wie weit fahren Sie?' },
        { local: '¡Gracias, que le vaya bien!', meaning: 'Danke, gute Fahrt!' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Mexiko ist günstig. Knappes Budget: 15-25 €/Tag.' },
      { type: 'kv', items: [
        { k: 'Straßentacos', v: '10-30 MXN (0,50-1,50 €)' },
        { k: 'Comida corrida (Tagesmenü)', v: '50-100 MXN (2,50-5 €)' },
        { k: 'Hostel', v: '150-400 MXN (7-20 €)' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wildcampen ist an den Pazifikstränden und in ländlichen Gebieten möglich. Hängematten sind eine beliebte Alternative an der Küste. Mexikaner laden Reisende manchmal zu sich nach Hause ein.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'ADO / ETN', detail: 'Luxuriöse Fernbusse. ADO deckt den Süden ab, ETN das Zentrum.', price: '5-40 €' },
        { emoji: '🚐', name: 'Colectivos', detail: 'Lokale Minibusse, sehr günstig', price: '0,30-2 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'great' }, { name: 'Feb', level: 'great' }, { name: 'Mär', level: 'great' },
        { name: 'Apr', level: 'good' }, { name: 'Mai', level: 'ok' }, { name: 'Jun', level: 'ok' },
        { name: 'Jul', level: 'ok' }, { name: 'Aug', level: 'ok' }, { name: 'Sep', level: 'bad' },
        { name: 'Okt', level: 'good' }, { name: 'Nov', level: 'great' }, { name: 'Dez', level: 'great' },
      ]},
      { type: 'text', text: 'November bis April: Trockenzeit, ideal. Juni-Oktober: Regenzeit (Schauer am Nachmittag). September: Hurrikane an den Küsten. Yucatán ist ganzjährig warm und feucht.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Mexikaner sind herzlich und stolz auf ihre Kultur. Essen steht im Mittelpunkt (Tacos, Mole, Tamales). Mezcal und Tequila werden großzügig geteilt. Der Día de los Muertos (2. November) ist ein einzigartiger kultureller Moment.' },
      { type: 'event', items: [
        { month: 'Nov', day: '1-2', name: 'Día de los Muertos', desc: 'Totenfest. Altäre, Opfergaben, geschmückte Friedhöfe. Oaxaca ist der beste Ort.' },
        { month: 'Sep', day: '15-16', name: 'Fiestas Patrias', desc: 'Unabhängigkeitsfest. Der "Grito" um Mitternacht, Feuerwerk, Feste überall.' },
      ]},
    ]},
  },
  // ==================== BRAZIL ====================
  BR: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Trampen ("carona" oder "pedir carona") ist in Brasilien legal. Keine Einschränkungen. Die Praxis ist weniger verbreitet als im spanischsprachigen Amerika, funktioniert aber, besonders im Süden.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Brasilien ist zum Trampen möglich, aber die Entfernungen sind riesig (5. größtes Land der Welt). Wartezeit: 30 Min-2h. Der Süden (Rio Grande do Sul, Santa Catarina, Paraná) ist am einfachsten.' },
      { type: 'kv', items: [
        { k: 'Süden (RS, SC, PR)', v: 'Am besten, europäische Kultur, gastfreundlich', color: 'green' },
        { k: 'Minas Gerais', v: 'Gut, herzliche Leute', color: 'green' },
        { k: 'Nordosten (Bahia Küste)', v: 'Machbar, LKWs', color: 'amber' },
        { k: 'Amazonien', v: 'Quasi unmöglich auf der Straße, stattdessen Flussboote', color: 'red' },
      ]},
      { type: 'rule', icon: '⛽', text: 'Postos de Gasolina (Tankstellen) sind die besten Spots. Sprich die LKW-Fahrer in Straßenrestaurants an.' },
      { type: 'rule', icon: '🚛', text: 'LKW-Fahrer ("Caminhoneiros") sind deine beste Option für lange Strecken.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Die Sicherheit hängt von der Region ab. Der Süden und ländliche Gebiete sind sicher. Meide Favelas und Vororte der Großstädte (São Paulo, Rio). Trampe nicht nachts.' },
      { type: 'kv', items: [{ k: 'Notfälle', v: '190 (Polizei) / 192 (SAMU)' }] },
    ]},
    women: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'Straßenbelästigung gibt es in Brasilien. Alleinreisende Frauen, die trampen, berichten von unterschiedlichen Erfahrungen. Der Süden ist sicherer. Zu zweit reisen wird empfohlen.' },
      { type: 'rule', icon: '👫', text: 'Zu zweit reisen wird empfohlen, besonders im Norden und Nordosten.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Brasilianisches Portugiesisch ist die einzige Sprache. Spanisch wird teilweise verstanden, aber sprich NICHT Spanisch (wird als unhöflich empfunden). Englisch ist außerhalb der Großstädte selten.' },
      { type: 'phrase', items: [
        { local: 'Oi, tudo bem?', meaning: 'Hi, alles klar?' },
        { local: 'Carona, por favor', meaning: 'Eine Mitfahrgelegenheit, bitte' },
        { local: 'Obrigado/a', meaning: 'Danke (männl./weibl.)' },
        { local: 'Pra onde você vai?', meaning: 'Wohin fahren Sie?' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Brasilien ist mäßig teuer für Südamerika. Knappes Budget: 20-35 €/Tag. Der Süden ist günstiger als Rio oder São Paulo.' },
      { type: 'kv', items: [
        { k: 'Prato feito (Tagesgericht)', v: '15-30 BRL (3-6 €)' },
        { k: 'Hostel', v: '40-100 BRL (8-20 €)' },
        { k: 'Açaí (Schüssel)', v: '10-20 BRL (2-4 €)' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wildcampen ist an einsamen Stränden und in ländlichen Gebieten möglich. Campingplätze im Süden sind günstig. Pousadas (Pensionen) bieten ein gutes Preis-Leistungs-Verhältnis.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Fernbus', detail: 'Ausgezeichnetes Netz. Leito = Liegesitz. Semi-Leito = Neigbar.', price: '10-60 €' },
        { emoji: '✈️', name: 'Inlandsflüge', detail: 'GOL, LATAM, Azul. Oft günstiger als der Bus für lange Strecken.', price: '20-100 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'good' }, { name: 'Feb', level: 'good' }, { name: 'Mär', level: 'great' },
        { name: 'Apr', level: 'great' }, { name: 'Mai', level: 'great' }, { name: 'Jun', level: 'good' },
        { name: 'Jul', level: 'good' }, { name: 'Aug', level: 'good' }, { name: 'Sep', level: 'great' },
        { name: 'Okt', level: 'great' }, { name: 'Nov', level: 'good' }, { name: 'Dez', level: 'good' },
      ]},
      { type: 'text', text: 'Brasilien ist riesig: das Klima reicht von tropisch bis subtropisch. Der Süden ist gemäßigt. März-Mai und September-November sind für die meisten Regionen ideal. Der Sommer (Dezember-Februar) ist im Zentrum-Süden die Regenzeit.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Brasilianer gehören zu den herzlichsten Menschen der Welt. Musik (Samba, Forró, MPB) ist allgegenwärtig. Churrasco (Grillen) ist ein soziales Ritual. Brasilianer feiern gerne und empfangen Ausländer mit offenen Armen.' },
      { type: 'event', items: [
        { month: 'Feb-Mär', day: '⟳', name: 'Karneval', desc: 'Der größte Karneval der Welt. Rio, Salvador und Olinda sind die besten. Chaotischer Transport.' },
        { month: 'Jun', day: '⟳', name: 'Festas Juninas', desc: 'Johannisfeste. Tänze, Lagerfeuer, Straßenessen im ganzen Nordosten.' },
      ]},
    ]},
  },
  // ==================== PERU ====================
  PE: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Trampen ist in Peru legal. Verbreitete Praxis in ländlichen Gebieten. Einheimische trampen ebenfalls ("pedir jalada"), da der Transport in den Anden begrenzt ist.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Peru ist gut zum Trampen, besonders in den Anden. Wartezeit: 20 Min-1h. LKWs sind das Haupttransportmittel in den Bergen. Achtung: viele Fahrer erwarten eine Bezahlung (informeller Transport). Kläre "gratis" vor dem Einsteigen.' },
      { type: 'rule', icon: '🚛', text: 'LKWs in den Anden halten leicht an. Stelle dich an Kontrollpunkten (Garitas) auf.' },
      { type: 'rule', icon: '⛽', text: 'Grifos (Tankstellen) an Stadtausfahrten sind die besten Spots.' },
      { type: 'kv', items: [
        { k: 'Heiliges Tal / Cusco', v: 'Einfach, touristisch', color: 'green' },
        { k: 'Ländliche Anden', v: 'LKWs, wenig Verkehr aber alles hält an', color: 'green' },
        { k: 'Panamericana (Küste)', v: 'Guter Verkehr, Fern-LKWs', color: 'green' },
        { k: 'Lima (Stadtausfahrt)', v: 'Schwierig, Bus bis zum Stadtrand', color: 'red' },
      ]},
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Peru ist außerhalb von Lima und mancher Grenzgebiete (VRAEM) generell sicher. Die Anden und der touristische Süden (Cusco, Arequipa) sind sicher.' },
      { type: 'kv', items: [{ k: 'Notfälle', v: '105 (Polizei) / 116 (Feuerwehr)' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Machismo gibt es, aber der touristische Süden ist für Frauen relativ sicher. Zu zweit reisen wird in ländlichen Gebieten empfohlen.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Spanisch ist die Hauptsprache. Quechua und Aymara werden in den Anden gesprochen. Englisch ist außerhalb von Cusco und Lima selten.' },
      { type: 'phrase', items: [
        { local: '¿Me da una jalada?', meaning: 'Nehmen Sie mich per Anhalter mit?' },
        { local: 'Gratis, por favor', meaning: 'Kostenlos, bitte' },
        { local: '¡Gracias, caserito!', meaning: 'Danke, Freund! (Peruanismus)' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Peru ist günstig. Knappes Budget: 12-20 €/Tag. Die Menüs (Almuerzo) sind reichhaltig und günstig.' },
      { type: 'kv', items: [
        { k: 'Menú (komplette Mahlzeit)', v: '5-12 PEN (1-3 €)' },
        { k: 'Hostel', v: '20-60 PEN (5-15 €)' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wildcampen wird in den Anden und ländlichen Gebieten toleriert. Frage die lokalen Gemeinschaften um Erlaubnis. Hospedajes (einfache Pensionen) sind sehr günstig.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Cruz del Sur / Oltursa', detail: 'Komfortable Fernbusse', price: '5-40 €' },
        { emoji: '🚐', name: 'Combi / Colectivo', detail: 'Nahverkehr, sehr günstig, Bergstraßen', price: '0,30-3 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mär', level: 'ok' },
        { name: 'Apr', level: 'good' }, { name: 'Mai', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Aug', level: 'great' }, { name: 'Sep', level: 'great' },
        { name: 'Okt', level: 'good' }, { name: 'Nov', level: 'ok' }, { name: 'Dez', level: 'bad' },
      ]},
      { type: 'text', text: 'Mai bis September: Trockenzeit in den Anden, ideal. Dezember-März: Regenzeit (gesperrte Straßen in den Bergen). Die Küste ist ganzjährig trocken.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Peruaner sind gastfreundlich und stolz auf ihre Gastronomie (Peru ist die kulinarische Hauptstadt Südamerikas). Ceviche, Lomo Saltado und Pisco Sour sind Institutionen. Die Andengemeinschaften haben eine starke Kultur des Teilens.' },
      { type: 'event', items: [
        { month: 'Jun', day: '24', name: 'Inti Raymi (Cusco)', desc: 'Inka-Sonnenfest. Spektakuläre Nachstellung in Sacsayhuamán.' },
      ]},
    ]},
  },
  // ==================== BOLIVIA ====================
  BO: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Trampen ist in Bolivien legal. Sehr verbreitete Praxis, da viele ländliche Gemeinschaften keinen regelmäßigen Transport haben. LKWs sind ein normales Transportmittel in den Anden.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Bolivien ist ein gutes Land zum Trampen. LKW-Fahrer nehmen regelmäßig Passagiere mit (oft gegen eine bescheidene Bezahlung). Kläre, ob es kostenlos ist. Wartezeit: 15-45 Min. Der Altiplano hat wenig Verkehr, aber die Leute halten an.' },
      { type: 'kv', items: [
        { k: 'La Paz-Oruro-Potosí', v: 'Guter Verkehr, Hauptstraße', color: 'green' },
        { k: 'Yungas / Amazonien', v: 'LKWs, wenig Verkehr, Abenteuer', color: 'amber' },
        { k: 'Salar de Uyuni', v: 'Sehr wenig Verkehr, organisiere eine Tour', color: 'amber' },
      ]},
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Bolivien ist sicher für Reisende. Das Hauptrisiko ist die Höhenkrankheit (La Paz liegt auf 3.640m, der Salar auf 3.650m). Bergstraßen sind gefährlich (Kurven, Abgründe, keine Leitplanken).' },
      { type: 'kv', items: [{ k: 'Notfälle', v: '110 (Polizei) / 118 (Krankenwagen)' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Bolivien ist für Frauen relativ sicher. Die indigenen Gemeinschaften sind respektvoll. Zu zweit reisen wird in abgelegenen Gebieten empfohlen.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Spanisch ist die Hauptsprache. Quechua und Aymara sind in den Anden weit verbreitet. Englisch ist selten.' },
      { type: 'phrase', items: [
        { local: '¿Me lleva?', meaning: 'Nehmen Sie mich mit?' },
        { local: '¿Es gratis?', meaning: 'Ist es kostenlos?' },
        { local: 'Jallalla!', meaning: 'Es lebe! (Aymara, positiver Ausruf)' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Bolivien ist das günstigste Land Südamerikas. Knappes Budget: 8-15 €/Tag. Almuerzo komplett: 1-2 €. Hostel: 3-8 €/Nacht.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wildcampen ist überall in ländlichen Gebieten und auf dem Altiplano möglich. Die Nächte sind in der Höhe sehr kalt (bis -15°C). Ein guter Schlafsack ist unverzichtbar.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Bus / Flota', detail: 'Fernbus, Straßen oft unbefestigt', price: '3-15 €' },
        { emoji: '🚐', name: 'Trufi / Micro', detail: 'Nahverkehr mit Minibus', price: '0,15-1 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mär', level: 'ok' },
        { name: 'Apr', level: 'good' }, { name: 'Mai', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Aug', level: 'great' }, { name: 'Sep', level: 'great' },
        { name: 'Okt', level: 'good' }, { name: 'Nov', level: 'ok' }, { name: 'Dez', level: 'bad' },
      ]},
      { type: 'text', text: 'Mai bis September: Trockenzeit, ideal. Dezember-März: intensive Regenfälle, gesperrte Straßen, überfluteter Salar (aber spektakulärer Wasserspiegel).' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Bolivien hat den höchsten Anteil indigener Bevölkerung in Südamerika (62%). Die Aymara- und Quechua-Kultur ist lebendig. Das Kokablatt ist heilig und allgegenwärtig (Koka kauen = normal, keine Droge). Cholitas (Frauen in Tracht) sind ein Nationalstolz.' },
    ]},
  },
  // ==================== ECUADOR ====================
  EC: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Trampen ist in Ecuador legal. Verbreitete Praxis. Das Land ist klein (640 km Nord-Süd) und leicht zu durchqueren. Die Währung ist der US-Dollar.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Ecuador ist einfach zum Trampen. Das Land ist klein und die Ecuadorianer sind gastfreundlich. Wartezeit: 15-30 Min. Pickups ("Camionetas") nehmen oft Passagiere mit (manchmal gegen bescheidene Bezahlung).' },
      { type: 'rule', icon: '🛻', text: 'Camionetas (Pickups) halten leicht an. Steig auf die Ladefläche, das ist normal und üblich.' },
      { type: 'rule', icon: '⛽', text: 'Mautstellen und Tankstellen sind die besten Spots.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Ecuador ist mäßig sicher. Touristengebiete (Quito-Zentrum, Cuenca, Baños) sind sicher. Meide die kolumbianische Grenze (Esmeraldas, Sucumbíos) und die südlichen Viertel von Guayaquil.' },
      { type: 'kv', items: [{ k: 'Notfälle', v: '911' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Ecuador ist mäßig sicher für Frauen. Die Anden sind sicherer als die Küste. Zu zweit reisen wird empfohlen.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Spanisch ist die Hauptsprache. Kichwa wird in den Anden gesprochen. Englisch ist auf touristische Gebiete beschränkt.' },
      { type: 'phrase', items: [
        { local: '¿Me da un jalón?', meaning: 'Nehmen Sie mich per Anhalter mit? (Ecuador)' },
        { local: '¡Chevere!', meaning: 'Genial!' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Ecuador verwendet den US-Dollar. Knappes Budget: 15-25 $/Tag. Almuerzos (Tagesmenü) kosten 2-3 $. Hostel: 8-15 $/Nacht.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wildcampen ist in den Anden und im Amazonas-Regenwald möglich. Hospedajes (Pensionen) sind sehr günstig.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Bus', detail: 'Ausgedehntes und günstiges Netz. Busse halten überall.', price: '1 $/Fahrstunde' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'ok' }, { name: 'Feb', level: 'ok' }, { name: 'Mär', level: 'ok' },
        { name: 'Apr', level: 'ok' }, { name: 'Mai', level: 'good' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Aug', level: 'great' }, { name: 'Sep', level: 'great' },
        { name: 'Okt', level: 'good' }, { name: 'Nov', level: 'good' }, { name: 'Dez', level: 'ok' },
      ]},
      { type: 'text', text: 'Juni-September: Trockenzeit in den Anden. Die Küste ist von Juni bis November trocken. Der Amazonas ist ganzjährig feucht.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Ecuador ist für ein kleines Land unglaublich vielfältig: Küste, Anden, Amazonas und Galápagos. Die indigenen Märkte (Otavalo) sind spektakulär. Cuy (Meerschweinchen) ist ein traditionelles Gericht in den Anden.' },
    ]},
  },
  // ==================== URUGUAY ====================
  UY: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Trampen ist in Uruguay legal. Akzeptierte und kulturell normale Praxis. Das Land ist klein (660 km Ost-West) und sicher.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Uruguay ist einfach und sicher zum Trampen. Das Land ist klein und die Uruguayer sind entspannt und gastfreundlich. Wartezeit: 15-30 Min. Hauptstraßen (Ruta 1, Ruta 5) haben guten Verkehr.' },
      { type: 'text', text: 'Ancap-Tankstellen und Mautstellen sind die besten Spots. Im Sommer (Januar-Februar) ist die Küste (Punta del Diablo, Cabo Polonio) stark von Argentiniern besucht und Trampen ist einfach.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Uruguay ist das sicherste Land Südamerikas. Die Kriminalitätsrate ist niedrig außerhalb mancher Viertel von Montevideo.' },
      { type: 'kv', items: [{ k: 'Notfälle', v: '911' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Uruguay gilt als sicher für alleinreisende Frauen. Das Land ist progressiv (erstes Land in Lateinamerika, das Cannabis und die Ehe für alle legalisiert hat).' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Rioplatensisches Spanisch (wie Argentinien, mit "vos" und "sh"). Portuñol wird an der brasilianischen Grenze gesprochen. Englisch ist begrenzt.' },
      { type: 'phrase', items: [
        { local: '¿Me llevás?', meaning: 'Nimmst du mich mit?' },
        { local: 'Ta, gracias', meaning: 'OK, danke (Uruguayanismus)' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Uruguay ist teurer als Argentinien. Knappes Budget: 20-35 €/Tag. Die Parilladas (Grillgerichte) sind reichhaltig.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wildcampen wird an Stränden und in ländlichen Gebieten toleriert. Cabo Polonio ist ein Dorf ohne Strom, nur per 4x4 erreichbar, ideal zum Campen.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Bus (CUTCSA, COT)', detail: 'Ausgedehntes und zuverlässiges Netz', price: '5-25 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'great' }, { name: 'Feb', level: 'great' }, { name: 'Mär', level: 'great' },
        { name: 'Apr', level: 'good' }, { name: 'Mai', level: 'ok' }, { name: 'Jun', level: 'bad' },
        { name: 'Jul', level: 'bad' }, { name: 'Aug', level: 'bad' }, { name: 'Sep', level: 'ok' },
        { name: 'Okt', level: 'good' }, { name: 'Nov', level: 'great' }, { name: 'Dez', level: 'great' },
      ]},
      { type: 'text', text: 'November bis März: ideal. Der Winter (Juni-August) ist kühl (5-15°C), aber nicht streng.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Mate ist die Nationalreligion. Uruguayer laufen überall mit ihrer Thermoskanne und ihrem Mate herum. Das Sonntagsasado ist heilig. Das Land ist entspannt und progressiv. Tango (Candombe) ist genauso wichtig wie in Argentinien.' },
    ]},
  },
  // ==================== VIETNAM ====================
  VN: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Trampen ist in Vietnam kein formelles Konzept. Es gibt kein Gesetz dagegen, aber die Praxis existiert kulturell nicht. Vietnamesen, die anhalten, verstehen nicht unbedingt, dass es kostenlos ist.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Vietnam ist ein Sonderfall. Klassisches Trampen (Daumen hoch) funktioniert nicht, da das Konzept nicht existiert. Aber Vietnamesen sind von Natur aus hilfsbereit und bieten Hilfe an, wenn du verloren wirkst. Viele Reisende machen Vietnam per Motorrad (Easy Rider) statt per Anhalter.' },
      { type: 'rule', icon: '🏍️', text: 'Motorradtaxis (Xe Ôm) halten ständig an. Kläre, dass es kostenlos ist, wenn jemand anhält.' },
      { type: 'rule', icon: '🚛', text: 'LKWs auf dem Highway 1 nehmen manchmal Passagiere mit. Sprich Fahrer an den Haltestellen an.' },
      { type: 'text', text: 'Der bergige Norden (Ha Giang, Sapa) ist einfacher, da es weniger öffentlichen Nahverkehr gibt und die Leute natürlich anhalten.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Vietnam ist ein sehr sicheres Land. Gewaltkriminalität ist quasi inexistent. Taschendiebstahl und Betrug (Taxis, Touren) sind die Hauptrisiken. Der Verkehr ist chaotisch, aber schwere Unfälle mit Fußgängern sind selten.' },
      { type: 'kv', items: [{ k: 'Notfälle', v: '113 (Polizei) / 115 (Krankenwagen)' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Vietnam ist sicher für alleinreisende Frauen. Belästigung ist selten. Vietnamesinnen sind unabhängig und in der Gesellschaft respektiert.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Vietnamesisch ist die einzige Sprache. 6 Töne machen die Aussprache sehr schwierig. Englisch nimmt bei den Jungen in Großstädten zu, ist aber in ländlichen Gebieten sehr begrenzt. Französisch wird von einigen Älteren verstanden.' },
      { type: 'phrase', items: [
        { local: 'Xin chào', meaning: 'Hallo' },
        { local: 'Cảm ơn', meaning: 'Danke' },
        { local: 'Đi... được không?', meaning: 'Nach... fahren möglich?' },
        { local: 'Miễn phí', meaning: 'Kostenlos' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Vietnam ist sehr günstig. Knappes Budget: 10-20 €/Tag selbst ohne Trampen. Phở vom Straßenstand kostet 1-2 €.' },
      { type: 'kv', items: [
        { k: 'Phở / Bánh mì', v: '20.000-40.000 VND (0,80-1,60 €)' },
        { k: 'Hostel', v: '100.000-200.000 VND (4-8 €)' },
        { k: 'Sleeper-Bus (Fernbus)', v: '100.000-300.000 VND (4-12 €)' },
        { k: 'Bia hơi (Frischbier)', v: '5.000-10.000 VND (0,20-0,40 €)' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wildcampen ist in den Bergen des Nordens möglich. Nhà Nghỉ (Pensionen) sind so günstig (3-5 €), dass Camping nicht nötig ist. Familien in Bergdörfern nehmen manchmal Reisende auf.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Sleeper-Bus', detail: 'Liege-Fernbusse, ausgedehntes Netz', price: '4-15 €' },
        { emoji: '🚂', name: 'Reunification Express', detail: 'Zug Hanoi-HCMC (30h). Langsam aber landschaftlich reizvoll.', price: '15-40 €' },
        { emoji: '🏍️', name: 'Motorrad', detail: 'Viele Backpacker kaufen ein Motorrad (300-500 $) und verkaufen es am Ende der Reise.', price: '' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'ok' }, { name: 'Feb', level: 'good' }, { name: 'Mär', level: 'great' },
        { name: 'Apr', level: 'great' }, { name: 'Mai', level: 'good' }, { name: 'Jun', level: 'ok' },
        { name: 'Jul', level: 'ok' }, { name: 'Aug', level: 'bad' }, { name: 'Sep', level: 'bad' },
        { name: 'Okt', level: 'good' }, { name: 'Nov', level: 'great' }, { name: 'Dez', level: 'good' },
      ]},
      { type: 'text', text: 'Vietnam erstreckt sich über 1.650 km: der Norden hat Jahreszeiten (kalt im Winter), das Zentrum hat Taifune (September-November), der Süden ist tropisch (trocken Dezember-April). März-Mai: gut für das ganze Land.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Vietnamesen sind neugierig, lächelnd und gastfreundlich. Kaffee (Cà Phê Sữa Đá = Eiskaffee mit Kondensmilch) ist eine Institution. Das Straßenessen gehört zu den besten der Welt. Vietnamesen laden Ausländer gerne zum Anstoßen ein (Một, hai, ba, dzo! = 1, 2, 3, Prost!).' },
      { type: 'event', items: [
        { month: 'Jan-Feb', day: '⟳', name: 'Tết (Mondneujahr)', desc: 'Das größte Fest. Das Land schließt für eine Woche. Chaotischer Transport vorher/nachher.' },
      ]},
    ]},
  },
  // ==================== LAOS ====================
  LA: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Trampen ist in Laos nicht geregelt. Das Konzept ist unbekannt, aber informeller Transport (in LKWs, Pickups mitfahren) ist in ländlichen Gebieten üblich.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Laos ist ein ruhiges Land, wo informelles Trampen funktioniert. Der Verkehr ist gering (Laos ist wenig motorisiert), aber Fahrer halten leicht an. Wartezeit: 20 Min-1h+. In abgelegenen Gebieten kann der Verkehr quasi null sein.' },
      { type: 'rule', icon: '🛻', text: 'Pickups und LKWs sind die häufigsten Fahrzeuge auf ländlichen Straßen.' },
      { type: 'text', text: 'Sǎwngthǎew (LKW-Busse mit Bänken hinten) halten überall an und kosten fast nichts. Eine Art "bezahltes Trampen" zu sehr niedrigen Preisen.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Laos ist ein sehr sicheres Land. Die Kriminalität ist sehr niedrig. Das Hauptrisiko sind UXO (Blindgänger aus dem Vietnamkrieg) in ländlichen Gebieten. Verlasse NIEMALS die ausgetretenen Pfade auf dem Land.' },
      { type: 'kv', items: [{ k: 'Notfälle', v: '1195 (Krankenwagen) / 1191 (Polizei)' }] },
      { type: 'warn', text: '⚠️ Laos ist das am meisten bombardierte Land der Geschichte. 30% der Bomben sind nicht explodiert. Gehe NIEMALS abseits der Wege in ländlichen Gebieten.' },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Laos ist sicher für alleinreisende Frauen. Die buddhistische Kultur ist respektvoll. Vorfälle sind sehr selten.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Lao ist die Amtssprache (dem Thai sehr ähnlich, gegenseitig verständlich). Englisch ist sehr begrenzt. Französisch wird von einigen Älteren verstanden (ehemalige französische Kolonie).' },
      { type: 'phrase', items: [
        { local: 'Sabaidee', meaning: 'Hallo' },
        { local: 'Khop chai', meaning: 'Danke' },
        { local: 'Pai... dai bor?', meaning: 'Nach... fahren möglich?' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Laos ist sehr günstig. Knappes Budget: 10-20 €/Tag. Klebreis (Sticky Rice) mit Laap (Fleischsalat) kostet weniger als 1 €.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wildcampen ist möglich, aber Vorsicht vor UXO. Pensionen sind sehr günstig (3-8 €). Tempel beherbergen manchmal Reisende.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚐', name: 'Sǎwngthǎew', detail: 'LKWs mit Bänken. Haupttransportmittel auf dem Land.', price: '1-5 €' },
        { emoji: '🚌', name: 'VIP-Bus', detail: 'Fernbus, wachsendes Netz', price: '5-15 €' },
        { emoji: '🛥️', name: 'Slow Boat', detail: 'Boot auf dem Mekong (Luang Prabang-Huay Xai, 2 Tage)', price: '15-25 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'great' }, { name: 'Feb', level: 'great' }, { name: 'Mär', level: 'good' },
        { name: 'Apr', level: 'ok' }, { name: 'Mai', level: 'ok' }, { name: 'Jun', level: 'ok' },
        { name: 'Jul', level: 'bad' }, { name: 'Aug', level: 'bad' }, { name: 'Sep', level: 'bad' },
        { name: 'Okt', level: 'ok' }, { name: 'Nov', level: 'great' }, { name: 'Dez', level: 'great' },
      ]},
      { type: 'text', text: 'November bis Februar: ideal (kühl und trocken). März-Mai: sehr heiß. Juni-Oktober: Monsun (überflutete Straßen, manche Straßen gesperrt).' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Laos ist das entspannteste Land Südostasiens. "Bor pen nyang" (kein Problem) ist das nationale Mantra. Der Theravada-Buddhismus durchdringt die Kultur. Die morgendliche Almosengabe an die Mönche (Tak Bat) in Luang Prabang ist ein heiliger Moment.' },
    ]},
  },
  // ==================== CAMBODIA ====================
  KH: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Trampen ist in Kambodscha nicht geregelt. Das Konzept existiert nicht formell, aber informeller Transport ist üblich. Fahrer halten leicht an, wenn du winkst.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Kambodscha funktioniert mit informellem Trampen. Pickups, LKWs und Motorräder halten leicht an. Viele Fahrer erwarten eine kleine Bezahlung (informeller Transport). Kläre. Das Busnetz ist in ländlichen Gebieten begrenzt.' },
      { type: 'text', text: 'Die Hauptstraßen (Phnom Penh-Siem Reap, Phnom Penh-Sihanoukville) haben Verkehr. Nebenstraßen sind oft in schlechtem Zustand.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Kambodscha ist sicher für Reisende. Meide die Grenzgebiete zu Thailand (Preah Vihear) und Antipersonenminen in ländlichen Gebieten (verlasse nicht die Wege).' },
      { type: 'kv', items: [{ k: 'Notfälle / Polizei', v: '117' }, { k: 'Krankenwagen', v: '119' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Kambodscha ist generell sicher für alleinreisende Frauen. Die Gesellschaft ist respektvoll. Meide nachts die Partyzonen (Sihanoukville).' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Khmer ist die Amtssprache. Englisch ist in touristischen Gebieten (Siem Reap, Phnom Penh) verbreitet. Französisch wird von einigen Älteren verstanden.' },
      { type: 'phrase', items: [
        { local: 'Sok sabay', meaning: 'Hallo / Wie geht\'s' },
        { local: 'Aw kun', meaning: 'Danke' },
        { local: 'Tov... baan te?', meaning: 'Nach... fahren möglich?' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Kambodscha ist sehr günstig. Knappes Budget: 10-20 $/Tag. Der US-Dollar ist die De-facto-Währung (der Riel wird für Kleingeld verwendet).' },
      { type: 'kv', items: [
        { k: 'Lokale Mahlzeit', v: '1-3 $' },
        { k: 'Hostel', v: '3-8 $/Nacht' },
        { k: 'Angkor Bier', v: '0,50 $ (Happy Hour)' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Pensionen sind so günstig (3-5 $), dass Camping nicht nötig ist. Wildcampen ist in ländlichen Gebieten möglich.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Bus', detail: 'Wachsendes Netz. Giant Ibis und Mekong Express sind zuverlässig.', price: '5-15 $' },
        { emoji: '🛥️', name: 'Boot', detail: 'Phnom Penh-Siem Reap über den Tonle Sap', price: '25-35 $' },
        { emoji: '🛺', name: 'Tuk-Tuk', detail: 'Allgegenwärtiger Nahverkehr', price: '1-5 $' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'great' }, { name: 'Feb', level: 'great' }, { name: 'Mär', level: 'good' },
        { name: 'Apr', level: 'ok' }, { name: 'Mai', level: 'ok' }, { name: 'Jun', level: 'ok' },
        { name: 'Jul', level: 'ok' }, { name: 'Aug', level: 'bad' }, { name: 'Sep', level: 'bad' },
        { name: 'Okt', level: 'ok' }, { name: 'Nov', level: 'great' }, { name: 'Dez', level: 'great' },
      ]},
      { type: 'text', text: 'November bis Februar: ideal (kühl und trocken). März-Mai: sehr heiß (38°C+). Juni-Oktober: Monsun (überflutete Straßen in ländlichen Gebieten).' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Kambodschaner sind trotz der tragischen Geschichte (Rote Khmer) lächelnd und widerstandsfähig. Angkor Wat ist Nationalstolz. Fahrer sind neugierig und gastfreundlich. Sprich niemals leichtfertig über Politik oder die Roten Khmer.' },
    ]},
  },
  // ==================== NEPAL ====================
  NP: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Trampen ist in Nepal nicht geregelt. Informeller Transport (auf Busdächern mitfahren, in LKWs) ist ein normaler Lebensstil in den Berggebieten.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Nepal ist einfach für informelles Trampen. LKWs und Pickups halten leicht an. In den Bergen ist der Verkehr gering, aber jeder hält an. Nepalesen sind extrem gastfreundlich.' },
      { type: 'rule', icon: '🚛', text: 'Tata-LKWs auf Bergstraßen nehmen Passagiere mit (oft gegen kleine Bezahlung). Kläre vorher.' },
      { type: 'rule', icon: '🏔️', text: 'In den Trekking-Regionen (Annapurna, Everest) gibt es Transport per Jeep oder zu Fuß. Kein traditionelles Trampen.' },
      { type: 'text', text: 'Das Kathmandutal und die Straßen des Terai (Südebene) haben mehr Verkehr. Die Straße Kathmandu-Pokhara ist am meisten befahren.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Nepal ist ein sicheres und friedliches Land. Kriminalität gegen Touristen ist sehr selten. Bergstraßen sind die Hauptgefahr (Abgründe, ungeteerte Straßen, waghalsige Fahrer).' },
      { type: 'kv', items: [{ k: 'Touristenpolizei', v: '1144' }, { k: 'Notfälle', v: '102 (Polizei) / 103 (Krankenwagen)' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Nepal gilt als sicher für alleinreisende Frauen. Nepalesen sind respektvoll. Einige Fälle von Belästigung in ländlichen Gebieten, aber insgesamt positiv.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Nepali ist die Amtssprache. Englisch ist in touristischen Gebieten (Kathmandu, Pokhara, Trekking-Regionen) recht verbreitet. Trekking-Guides sprechen Englisch.' },
      { type: 'phrase', items: [
        { local: 'Namaste', meaning: 'Hallo (Hände vor der Brust zusammen)' },
        { local: 'Dhanyabad', meaning: 'Danke' },
        { local: 'Kati paisa?', meaning: 'Wie viel kostet es?' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Nepal ist sehr günstig. Knappes Budget: 10-20 €/Tag. Dhal Bhat (Reis und Linsen) ist das Nationalgericht: 1-2 €, in vielen Restaurants unbegrenzt.' },
      { type: 'kv', items: [
        { k: 'Dhal Bhat', v: '200-500 NPR (1-3 €)' },
        { k: 'Guesthouse', v: '300-1.000 NPR (2-7 €)' },
        { k: 'Lokalbus', v: '100-500 NPR (0,70-3 €)' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wildcampen ist in Berggebieten möglich. Tea Houses auf den Trekkingrouten bieten günstige Unterkunft und Mahlzeiten. Pensionen in der Stadt sind sehr erschwinglich.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Lokalbus / Tourist Bus', detail: 'Lokalbusse sind überfüllt, aber günstig. Tourist-Busse sind komfortabler.', price: '2-15 €' },
        { emoji: '🛩️', name: 'Inlandsflug', detail: 'Notwendig für Lukla (Everest). Spektakuläre Aussichten.', price: '100-200 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'ok' }, { name: 'Feb', level: 'good' }, { name: 'Mär', level: 'great' },
        { name: 'Apr', level: 'great' }, { name: 'Mai', level: 'good' }, { name: 'Jun', level: 'bad' },
        { name: 'Jul', level: 'bad' }, { name: 'Aug', level: 'bad' }, { name: 'Sep', level: 'ok' },
        { name: 'Okt', level: 'great' }, { name: 'Nov', level: 'great' }, { name: 'Dez', level: 'good' },
      ]},
      { type: 'text', text: 'Oktober-November: ideal (klarer Himmel, Blick auf den Himalaya). März-Mai: auch gut (Rhododendren in Blüte). Juni-September: Monsun (gesperrte Straßen, Blutegel in den Bergen).' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Nepal ist eine einzigartige Mischung aus Hinduismus und Buddhismus. Nepalesen gehören zu den freundlichsten Menschen der Welt. Dhal Bhat ist "die Energie": zweimal täglich, unbegrenzt. Trekking ist eine nationale Industrie und die Guides sind bemerkenswert freundlich.' },
      { type: 'event', items: [
        { month: 'Okt', day: '⟳', name: 'Dashain', desc: 'Das größte nepalesische Fest (15 Tage). Drachen, Familien vereint. Sehr voller Transport.' },
      ]},
    ]},
  },  // ==================== KAZAKHSTAN ====================
  KZ: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Trampen ist in Kasachstan legal. Keine Einschränkungen. Informeller Transport ist üblich, da das Land riesig ist (9. größtes der Welt) und der öffentliche Nahverkehr zwischen den Städten begrenzt ist.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Kasachstan ist gut zum Trampen. Die Entfernungen sind riesig (Almaty-Astana: 1.200 km), aber Fahrer fahren lange Strecken. Wartezeit: 15-45 Min auf Hauptstraßen. In ländlichen Gebieten ist der Verkehr sehr gering.' },
      { type: 'rule', icon: '🚛', text: 'LKWs sind am besten für lange Strecken. Sprich Fahrer an Tankstellen an.' },
      { type: 'rule', icon: '💰', text: 'Viele Fahrer erwarten eine Bezahlung (informeller Transport üblich). Kläre "besplatno" (kostenlos) vor dem Einsteigen.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Kasachstan ist sicher. Die Polizei kann Kontrollen durchführen (hab deinen Reisepass dabei). Die Straßen sind lang und gerade, Hitze und Wind sind die wahren Feinde.' },
      { type: 'kv', items: [{ k: 'Notfälle', v: '112' }, { k: 'Polizei', v: '102' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Kasachstan ist für Frauen relativ sicher. Die Gesellschaft ist säkularer als die zentralasiatischen Nachbarn. Zu zweit reisen wird in abgelegenen ländlichen Gebieten empfohlen.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Kasachisch und Russisch sind die beiden Amtssprachen. Russisch wird von fast jedem gesprochen. Englisch ist sehr selten. Russisch ist unverzichtbar.' },
      { type: 'phrase', items: [
        { local: 'Salam', meaning: 'Hallo (Kasachisch)' },
        { local: 'Rakhmet / Spasibo', meaning: 'Danke (Kasachisch / Russisch)' },
        { local: 'Besplatno', meaning: 'Kostenlos (Russisch)' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Kasachstan ist mäßig teuer für Zentralasien. Knappes Budget: 15-25 €/Tag. Basare sind günstig für Essen.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wildcampen ist in den endlosen Steppen einfach (niemand stört dich). Nomadenjurten sind manchmal für Reisende offen. In der Stadt sind Hostels günstig.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚂', name: 'Zug', detail: 'Ausgedehntes sowjetisches Netz, Nachtzüge', price: '10-30 €' },
        { emoji: '🚌', name: 'Bus', detail: 'Zwischen den Großstädten', price: '5-20 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mär', level: 'ok' },
        { name: 'Apr', level: 'good' }, { name: 'Mai', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'good' }, { name: 'Aug', level: 'good' }, { name: 'Sep', level: 'great' },
        { name: 'Okt', level: 'good' }, { name: 'Nov', level: 'ok' }, { name: 'Dez', level: 'bad' },
      ]},
      { type: 'text', text: 'Mai-Jun und September: ideal. Der Sommer ist in den Steppen heiß (40°C+). Der Winter ist extrem (bis -40°C in Astana). Im Frühling blühen die Steppen.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Kasachstan verbindet Nomadenkultur und Moderne. Kumys (gegorene Stutenmilch) und Beshbarmak (Fleisch mit Nudeln) sind die traditionellen Gerichte. Die Nomaden-Gastfreundschaft (Tee, Essen, ein Bett anbieten) ist tief verwurzelt.' },
    ]},
  },
  // ==================== KYRGYZSTAN ====================
  KG: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Trampen ist in Kirgisistan legal. Sehr verbreitete Praxis. Das Land ist gebirgig und der öffentliche Nahverkehr begrenzt. Informeller Transport ist ein Lebensstil.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Kirgisistan ist eines der besten Länder Zentralasiens zum Trampen. Kirgisen sind gastfreundlich und neugierig. Wartezeit: 10-30 Min auf Hauptstraßen. In den Bergen ist der Verkehr gering, aber jeder hält an.' },
      { type: 'text', text: 'Die Straße Bischkek-Osch (über den Teo-Ashuu-Pass auf 3.500m) ist ein Klassiker. Die Umrundung des Issyk-Kul-Sees ist im Sommer einfach.' },
      { type: 'rule', icon: '💰', text: 'Marschrutkas (Sammeltaxis) halten überall an. Kläre "besplatno", da manche private Fahrer Bezahlung erwarten.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Kirgisistan ist sicher. Die Kriminalität ist niedrig. Bergstraßen sind die Hauptgefahr (Pässe über 3.000m, keine Leitplanken).' },
      { type: 'kv', items: [{ k: 'Notfälle', v: '112' }, { k: 'Polizei', v: '102' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Kirgisistan ist mäßig sicher für alleinreisende Frauen. Brautraub (Ala Katschuu) existiert noch in ländlichen Gebieten (nicht gegen Ausländerinnen, aber kulturell verstörend). Touristengebiete sind sicher.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Kirgisisch und Russisch sind die Amtssprachen. Russisch wird überall verstanden. Englisch ist sehr begrenzt. Grundlegendes Russisch ist unverzichtbar.' },
      { type: 'phrase', items: [
        { local: 'Salam', meaning: 'Hallo (Kirgisisch)' },
        { local: 'Rakhmat', meaning: 'Danke (Kirgisisch)' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Kirgisistan ist sehr günstig. Knappes Budget: 10-20 €/Tag. Unterkunft in Jurten über CBT (Community Based Tourism): 10-15 €/Nacht mit Mahlzeiten.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Wildcampen ist legal und einfach in den Bergen und Jailoos (Hochweiden). Hirtenjurten nehmen oft Reisende auf. Das CBT-Netzwerk organisiert authentische Jurtenaufenthalte.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚐', name: 'Marschrutka', detail: 'Minibusse zwischen Städten, günstig', price: '1-5 €' },
        { emoji: '🚗', name: 'Sammeltaxi', detail: 'Schneller als der Bus, wartet bis es voll ist', price: '3-10 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mär', level: 'ok' },
        { name: 'Apr', level: 'good' }, { name: 'Mai', level: 'good' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Aug', level: 'great' }, { name: 'Sep', level: 'great' },
        { name: 'Okt', level: 'good' }, { name: 'Nov', level: 'ok' }, { name: 'Dez', level: 'bad' },
      ]},
      { type: 'text', text: 'Juni bis September: ideal. Die Bergpässe sind offen. Der Sommer am Issyk-Kul-See ist wunderschön. Der Winter sperrt die Pässe und Trampen wird schwierig.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Die kirgisische Nomadenkultur ist lebendig. Kumys (Stutenmilch) und Beshbarmak sind die kulinarischen Traditionen. Gastfreundschaft ist heilig: Tee abzulehnen ist unhöflich. Die Reiterspiele (Kok-Boru, Adlerjagd) sind spektakulär.' },
    ]},
  },
  // ==================== UZBEKISTAN ====================
  UZ: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Trampen ist in Usbekistan legal. Informeller Transport ist sehr verbreitet. Viele Privatwagen funktionieren als informelle Taxis (besonders Daewoo Matiz und Chevrolet Lacetti).' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Usbekistan funktioniert als halb-bezahltes Trampen. Die Hand am Straßenrand heben stoppt Privatwagen, die als Taxi fahren. Kläre "besplatno" (kostenlos) VOR dem Einsteigen. Wartezeit: 5-15 Min in der Stadt, 15-30 Min zwischen Städten.' },
      { type: 'text', text: 'Die Seidenstraße (Taschkent-Samarkand-Buchara-Chiwa) ist gut bedient. Sammeltaxis sind so günstig, dass kostenloses Trampen weniger nötig ist.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Usbekistan ist sehr sicher. Das Land ist autoritär und die Kriminalität sehr niedrig. Polizeikontrollen sind häufig (hab deinen Reisepass und deine Registrierung dabei).' },
      { type: 'kv', items: [{ k: 'Notfälle', v: '112' }, { k: 'Polizei', v: '102' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Usbekistan ist sicher für alleinreisende Frauen. Die Gesellschaft ist konservativ, aber respektvoll. Reisende berichten von positiven Erfahrungen.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Usbekisch ist die Amtssprache. Russisch ist weit verbreitet (besonders in Taschkent). Englisch ist auf touristische Gebiete beschränkt (Samarkand, Buchara).' },
      { type: 'phrase', items: [
        { local: 'Assalomu alaykum', meaning: 'Hallo (formell)' },
        { local: 'Rahmat', meaning: 'Danke' },
        { local: 'Bepul', meaning: 'Kostenlos' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Usbekistan ist sehr günstig. Knappes Budget: 10-20 €/Tag. Plov (Pilaw-Reis) ist das Nationalgericht: 1-2 € in einem Chaikhana (Teehaus).' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Hostels und B&Bs sind günstig (5-15 €). Chaikhanas (Teehäuser) erlauben manchmal, auf den Tapchans (Ruhebetten im Freien) zu schlafen. Wildcampen ist in ländlichen Gebieten möglich.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚂', name: 'Afrosiyob (Schnellzug)', detail: 'Schnellzug Taschkent-Samarkand-Buchara', price: '5-15 €' },
        { emoji: '🚗', name: 'Sammeltaxi', detail: 'Privatwagen zwischen Städten, wartet bis es voll ist', price: '2-10 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'bad' }, { name: 'Feb', level: 'ok' }, { name: 'Mär', level: 'good' },
        { name: 'Apr', level: 'great' }, { name: 'Mai', level: 'great' }, { name: 'Jun', level: 'ok' },
        { name: 'Jul', level: 'bad' }, { name: 'Aug', level: 'bad' }, { name: 'Sep', level: 'great' },
        { name: 'Okt', level: 'great' }, { name: 'Nov', level: 'good' }, { name: 'Dez', level: 'ok' },
      ]},
      { type: 'text', text: 'April-Mai und September-Oktober: ideal (20-28°C). Der Sommer ist glühend heiß (45°C+). Der Winter ist in den Bergen kalt.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Usbekistan ist das Herz der Seidenstraße. Samarkand, Buchara und Chiwa sind architektonische Wunder. Gastfreundschaft ist heilig. Der Donnerstags-Plov ist ein gesellschaftliches Ereignis. Hochzeiten (oft 300+ Gäste) sind Feiergelegenheiten, zu denen Fremde manchmal spontan eingeladen werden.' },
    ]},
  },
  // ==================== JORDAN ====================
  JO: {
    laws: { filterTypes: ['q', 'c'], blocks: [{ type: 'text', text: 'Trampen ist in Jordanien legal. Verbreitete Praxis. Jordanier gehören zu den gastfreundlichsten Völkern des Nahen Ostens. Das Land ist klein (450 km Nord-Süd) und sicher.' }] },
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Jordanien ist ausgezeichnet zum Trampen. Jordanier halten sehr leicht an und sind neugierig auf Ausländer. Wartezeit: 5-15 Min. Viele Fahrer lehnen Geld ab und bestehen darauf, dich zum Essen einzuladen.' },
      { type: 'kv', items: [
        { k: 'King\'s Highway', v: 'Wunderschön, guter Verkehr', color: 'green' },
        { k: 'Amman-Aqaba', v: 'Dichter Verkehr, einfach', color: 'green' },
        { k: 'Wadi Rum-Aqaba', v: 'Wenig Verkehr, aber alles hält an', color: 'amber' },
      ]},
      { type: 'tip', text: '💡 Jordanier geben oft ihre Telefonnummer und bestehen darauf, dir während deines gesamten Aufenthalts zu helfen.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Jordanien ist sehr sicher. Das Land ist stabil und die Kriminalität niedrig. Meide die syrische Grenze (Nordosten).' },
      { type: 'kv', items: [{ k: 'Notfälle', v: '911' }] },
    ]},
    women: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'Jordanien ist für Frauen relativ sicher. Kleide dich konservativ (besonders außerhalb von Amman).' },
      { type: 'rule', icon: '👕', text: 'Kleidung, die Schultern und Knie bedeckt, besonders in ländlichen Gebieten.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Jordanisches Arabisch ist die Hauptsprache. Englisch ist weit verbreitet.' },
      { type: 'phrase', items: [{ local: 'Marhaba', meaning: 'Hallo' }, { local: 'Shukran', meaning: 'Danke' }] },
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Mäßig teuer. Knappes Budget: 20-35 €/Tag. Der Jordan Pass (70+ JOD) enthält Petra und das Visum.' },
      { type: 'kv', items: [{ k: 'Falafel / Shawarma', v: '0,50-1,50 JOD' }, { k: 'Hostel', v: '8-20 JOD' }] },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [{ type: 'text', text: 'Wildcampen ist im Wadi Rum möglich. Beduinen laden Reisende oft ein.' }] },
    transport: { filterTypes: ['c', 'b'], blocks: [{ type: 'transport', items: [{ emoji: '🚌', name: 'JETT Bus', detail: 'Zuverlässige Fernbusse', price: '3-10 JOD' }] }] },
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Jan', level: 'ok' }, { name: 'Feb', level: 'good' }, { name: 'Mär', level: 'great' },
        { name: 'Apr', level: 'great' }, { name: 'Mai', level: 'great' }, { name: 'Jun', level: 'ok' },
        { name: 'Jul', level: 'bad' }, { name: 'Aug', level: 'bad' }, { name: 'Sep', level: 'ok' },
        { name: 'Okt', level: 'great' }, { name: 'Nov', level: 'great' }, { name: 'Dez', level: 'ok' },
      ]},
      { type: 'text', text: 'März-Mai und Oktober-November: ideal. Der Sommer ist glühend heiß (35-45°C).' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [{ type: 'text', text: 'Die jordanische Gastfreundschaft ist außergewöhnlich. "Ahlan wa sahlan" ist aufrichtig. Beduinen im Wadi Rum bieten Tee, Mansaf und Geschichten an. Petra ist ein Weltwunder.' }] },
  },
  // ==================== OMAN ====================
  OM: {
    laws: { filterTypes: ['q', 'c'], blocks: [{ type: 'text', text: 'Trampen ist in Oman legal. Omanis sind von Natur aus hilfsbereit.' }] },
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Oman ist ausgezeichnet zum Trampen. Omanis sind extrem gastfreundlich. Wartezeit: 5-15 Min. Fahrer machen wichtige Umwege und bieten Mahlzeiten an.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Oman ist eines der sichersten Länder der Welt. Die Kriminalitätsrate ist quasi null. Der Sultan wird verehrt und das Land ist sehr geordnet.' },
      { type: 'sub', title: 'Nutze SpotHitch für deine Sicherheit' },
      { type: 'rule', icon: '🛡️', text: 'Aktiviere den Guardian-Modus vor jeder Fahrt. Eine Vertrauensperson verfolgt deine Position in Echtzeit.' },
      { type: 'rule', icon: '🆘', text: 'Richte den SOS-Modus mit deinen Kontakten ein. Ein Tippen löst einen dreifachen Alarm aus (Push, SMS, Anruf).' },
      { type: 'rule', icon: '📱', text: 'Fotografiere das Kennzeichen und sende es jemandem, bevor du einsteigst.' },
      { type: 'rule', icon: '🎒', text: 'Halte deinen Rucksack griffbereit (auf dem Schoß oder zu deinen Füßen), nie im Kofferraum.' },
      { type: 'sub', title: 'Landestipps' },
      { type: 'rule', icon: '🌡️', text: 'Im Sommer sind Temperaturen über 45 °C üblich. Nimm immer ausreichend Wasser mit und schütze dich vor der Sonne.' },
      { type: 'rule', icon: '🤝', text: 'Omanis sind von Natur aus gastfreundlich. Omanischer Kaffee und Datteln werden bei jeder Begegnung angeboten.' },
      { type: 'sub', title: 'Notrufnummern' },
      { type: 'kv', items: [{ k: 'Notruf', v: '9999' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [{ type: 'text', text: 'Sicher für Frauen. Konservativ aber respektvoll. Bescheidene Kleidung.' }] },
    language: { filterTypes: ['c', 'q'], blocks: [{ type: 'text', text: 'Omanisches Arabisch. Englisch weitgehend gesprochen.' }, { type: 'phrase', items: [{ local: 'As-salaam alaikum', meaning: 'Friede sei mit euch' }, { local: 'Shukran jazeelan', meaning: 'Vielen Dank' }] }] },
    budget: { filterTypes: ['b', 'q'], blocks: [{ type: 'text', text: 'Mäßig teuer. Knappes Budget: 25-40 €/Tag.' }, { type: 'kv', items: [{ k: 'Lokale Mahlzeit', v: '1-3 OMR' }, { k: 'Hostel', v: '5-15 OMR' }] }] },
    sleep: { filterTypes: ['b', 'q'], blocks: [{ type: 'text', text: 'Wildcampen ist legal und beliebt. Wadis und Strände sind wunderschöne Spots.' }] },
    transport: { filterTypes: ['c', 'b'], blocks: [{ type: 'transport', items: [{ emoji: '🚌', name: 'Mwasalat', detail: 'Wachsendes Busnetz', price: '0,50-5 OMR' }] }] },
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [{ name: 'Jan', level: 'great' }, { name: 'Feb', level: 'great' }, { name: 'Mär', level: 'great' }, { name: 'Apr', level: 'good' }, { name: 'Mai', level: 'ok' }, { name: 'Jun', level: 'bad' }, { name: 'Jul', level: 'bad' }, { name: 'Aug', level: 'bad' }, { name: 'Sep', level: 'ok' }, { name: 'Okt', level: 'great' }, { name: 'Nov', level: 'great' }, { name: 'Dez', level: 'great' }] },
      { type: 'text', text: 'Oktober bis März: ideal (25-30°C). Der Sommer ist glühend heiß (45°C+).' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [{ type: 'text', text: 'Raffiniertes und gastfreundliches Land. Omanischer Kaffee und Datteln bei jeder Begegnung. Toleranz (Moscheen, Kirchen, Tempel koexistieren). Weihrauch ist ein traditionelles Geschenk.' }] },
  },
  // ==================== SENEGAL ====================
  SN: {
    laws: { filterTypes: ['q', 'c'], blocks: [{ type: 'text', text: 'Trampen ist im Senegal legal. Die Teranga (Gastfreundschaft) führt dazu, dass Fahrer natürlich anhalten.' }] },
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [{ type: 'text', text: 'Dank der Teranga gut zum Trampen. Sept-places und Ndiaga Ndiaye halten überall.' }, { type: 'rule', icon: '💰', text: 'Grenze zwischen kostenlosem Trampen und bezahltem Transport ist fließend. Kläre vorher.' }] },
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Der Senegal ist ein sicheres Land für Tramper. Die Senegalesen sind gastfreundlich und lieben es, mit Reisenden zu plaudern. Denke an Hut und Wasser.' },
      { type: 'sub', title: 'Nutze SpotHitch für deine Sicherheit' },
      { type: 'rule', icon: '🛡️', text: 'Aktiviere den Guardian-Modus vor jeder Fahrt. Eine Vertrauensperson verfolgt deine Position in Echtzeit.' },
      { type: 'rule', icon: '🆘', text: 'Richte den SOS-Modus mit deinen Kontakten ein. Ein Tippen löst einen dreifachen Alarm aus (Push, SMS, Anruf).' },
      { type: 'rule', icon: '📱', text: 'Fotografiere das Kennzeichen und sende es jemandem, bevor du einsteigst.' },
      { type: 'rule', icon: '🎒', text: 'Halte deinen Rucksack griffbereit (auf dem Schoß oder zu deinen Füßen), nie im Kofferraum.' },
      { type: 'sub', title: 'Landestipps' },
      { type: 'rule', icon: '🤝', text: 'Senegalesen sind bekannt für ihre Teranga (Gastfreundschaft). Sie teilen gerne einen Ataya (Tee) mit Reisenden.' },
      { type: 'rule', icon: '☀️', text: 'Schütze dich vor der Sonne: Hut, Sonnencreme und Wasser immer dabei. Die Hitze ist intensiv.' },
      { type: 'sub', title: 'Notrufnummern' },
      { type: 'kv', items: [{ k: 'Polizei', v: '17' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [{ type: 'text', text: 'Relativ sicher. Die Teranga schützt Reisende. Bescheidene Kleidung in ländlichen Gebieten.' }] },
    language: { filterTypes: ['c', 'q'], blocks: [{ type: 'text', text: 'Französisch Amtssprache, fast jeder spricht es. Wolof ist die wichtigste Lokalsprache.' }, { type: 'phrase', items: [{ local: 'Nanga def?', meaning: 'Wie geht\'s? (Wolof)' }, { local: 'Jërëjëf', meaning: 'Danke (Wolof)' }] }] },
    budget: { filterTypes: ['b', 'q'], blocks: [{ type: 'text', text: 'Mäßig teuer für Westafrika. Budget: 15-25 €/Tag. Thiéboudienne ist das Nationalgericht.' }] },
    sleep: { filterTypes: ['b', 'q'], blocks: [{ type: 'text', text: 'Campements sind günstig und gesellig. Senegalesen laden leicht ein.' }] },
    transport: { filterTypes: ['c', 'b'], blocks: [{ type: 'transport', items: [{ emoji: '🚐', name: 'Sept-place', detail: 'Sammeltaxis, ausgedehntes Netz', price: '1-6 €' }] }] },
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [{ name: 'Jan', level: 'great' }, { name: 'Feb', level: 'great' }, { name: 'Mär', level: 'great' }, { name: 'Apr', level: 'good' }, { name: 'Mai', level: 'ok' }, { name: 'Jun', level: 'ok' }, { name: 'Jul', level: 'bad' }, { name: 'Aug', level: 'bad' }, { name: 'Sep', level: 'bad' }, { name: 'Okt', level: 'ok' }, { name: 'Nov', level: 'great' }, { name: 'Dez', level: 'great' }] },
      { type: 'text', text: 'November bis Mai: Trockenzeit, ideal. Juli-Oktober: Regenzeit.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [{ type: 'text', text: 'Teranga ist die Seele des Senegals. Ataya (Pfefferminztee) in drei Aufgüssen ist ein unverzichtbares Ritual. Thiéboudienne wird aus einer großen Schüssel geteilt.' }] },
  },
  // ==================== NAMIBIA ====================
  NA: {
    laws: { filterTypes: ['q', 'c'], blocks: [{ type: 'text', text: 'Trampen ist in Namibia legal. Das Land ist riesig und der öffentliche Nahverkehr quasi inexistent.' }] },
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [{ type: 'text', text: 'Machbar aber riesige Entfernungen und sehr geringer Verkehr (2. dünnst besiedeltes Land der Welt). Wartezeit: 30 Min-3h+.' }, { type: 'rule', icon: '💧', text: 'IMMER mindestens 5 Liter Wasser dabei haben.' }] },
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Namibia ist ein sicheres Land für Tramper. Die Entfernungen sind riesig und der Verkehr gering, also nimm Wasser und Solarladegerät mit.' },
      { type: 'sub', title: 'Nutze SpotHitch für deine Sicherheit' },
      { type: 'rule', icon: '🛡️', text: 'Aktiviere den Guardian-Modus vor jeder Fahrt. Eine Vertrauensperson verfolgt deine Position in Echtzeit.' },
      { type: 'rule', icon: '🆘', text: 'Richte den SOS-Modus mit deinen Kontakten ein. Ein Tippen löst einen dreifachen Alarm aus (Push, SMS, Anruf).' },
      { type: 'rule', icon: '📱', text: 'Fotografiere das Kennzeichen und sende es jemandem, bevor du einsteigst.' },
      { type: 'rule', icon: '🎒', text: 'Halte deinen Rucksack griffbereit (auf dem Schoß oder zu deinen Füßen), nie im Kofferraum.' },
      { type: 'sub', title: 'Landestipps' },
      { type: 'rule', icon: '💧', text: 'Die Entfernungen sind riesig (500+ km zwischen Städten). Nimm immer Wasser und ein Solarladegerät mit.' },
      { type: 'rule', icon: '🏜️', text: 'Der Verkehr ist in ländlichen Gebieten gering. Rechne mit langen Wartezeiten und bringe Geduld mit.' },
      { type: 'sub', title: 'Notrufnummern' },
      { type: 'kv', items: [{ k: 'Notruf', v: '10111' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [{ type: 'text', text: 'Relativ sicher. Zu zweit reisen wird für abgelegene Gebiete empfohlen.' }] },
    language: { filterTypes: ['c', 'q'], blocks: [{ type: 'text', text: 'Englisch Amtssprache. Afrikaans und Oshiwambo auch verbreitet.' }, { type: 'phrase', items: [{ local: 'Moro', meaning: 'Hallo (Oshiwambo)' }, { local: 'Tangi unene', meaning: 'Vielen Dank' }] }] },
    budget: { filterTypes: ['b', 'q'], blocks: [{ type: 'text', text: 'Mäßig teuer. Budget: 20-35 €/Tag.' }, { type: 'kv', items: [{ k: 'Camping (Nationalpark)', v: '150-300 NAD (8-16 €)' }] }] },
    sleep: { filterTypes: ['b', 'q'], blocks: [{ type: 'text', text: 'Wildcampen in der Wüste toleriert. Der namibische Sternenhimmel gehört zu den reinsten der Welt.' }] },
    transport: { filterTypes: ['c', 'b'], blocks: [{ type: 'transport', items: [{ emoji: '🚌', name: 'Intercape', detail: 'Fernbus, begrenztes Netz', price: '200-600 NAD' }] }] },
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [{ name: 'Jan', level: 'ok' }, { name: 'Feb', level: 'ok' }, { name: 'Mär', level: 'good' }, { name: 'Apr', level: 'great' }, { name: 'Mai', level: 'great' }, { name: 'Jun', level: 'great' }, { name: 'Jul', level: 'great' }, { name: 'Aug', level: 'great' }, { name: 'Sep', level: 'great' }, { name: 'Okt', level: 'good' }, { name: 'Nov', level: 'ok' }, { name: 'Dez', level: 'ok' }] },
      { type: 'text', text: 'Mai bis Oktober: Trockenzeit, ideal. Etosha am besten in der Trockenzeit.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [{ type: 'text', text: 'Land der Kontraste: Namib-Dünen, Skelettküste, Etosha. Vielfältige Kultur (Himba, San, Herero). Braai und Biltong sind Reisesnacks.' }] },
  },
  // ==================== KENYA ====================
  KE: {
    laws: { filterTypes: ['q', 'c'], blocks: [{ type: 'text', text: 'Informeller Transport (Matatus) ist der Hauptmodus. Die Hand heben stoppt jedes Fahrzeug.' }] },
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [{ type: 'text', text: 'Matatus sind überall und sehr günstig. LKWs nehmen auf Fernstraßen Passagiere mit. Kläre "free" oder "bure".' }] },
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Kenia ist sicher für Tramper auf den Hauptstraßen. Reise tagsüber und nutze Tankstellen, um Fahrer zu treffen.' },
      { type: 'sub', title: 'Nutze SpotHitch für deine Sicherheit' },
      { type: 'rule', icon: '🛡️', text: 'Aktiviere den Guardian-Modus vor jeder Fahrt. Eine Vertrauensperson verfolgt deine Position in Echtzeit.' },
      { type: 'rule', icon: '🆘', text: 'Richte den SOS-Modus mit deinen Kontakten ein. Ein Tippen löst einen dreifachen Alarm aus (Push, SMS, Anruf).' },
      { type: 'rule', icon: '📱', text: 'Fotografiere das Kennzeichen und sende es jemandem, bevor du einsteigst.' },
      { type: 'rule', icon: '🎒', text: 'Halte deinen Rucksack griffbereit (auf dem Schoß oder zu deinen Füßen), nie im Kofferraum.' },
      { type: 'sub', title: 'Landestipps' },
      { type: 'rule', icon: '☀️', text: 'Reise nur tagsüber. Nachts trampen ist auf kenianischen Straßen nicht empfehlenswert.' },
      { type: 'rule', icon: '🛣️', text: 'Die Hauptstrecken (Nairobi nach Mombasa, Nairobi nach Nakuru) sind gut befahren und sicher.' },
      { type: 'sub', title: 'Notrufnummern' },
      { type: 'kv', items: [{ k: 'Notruf', v: '999' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [{ type: 'text', text: 'Gemischte Erfahrungen. Touristengebiete sicher. Matatus sind sicherer als Trampen.' }] },
    language: { filterTypes: ['c', 'q'], blocks: [{ type: 'text', text: 'Englisch und Swahili Amtssprachen.' }, { type: 'phrase', items: [{ local: 'Jambo', meaning: 'Hallo' }, { local: 'Asante sana', meaning: 'Vielen Dank' }, { local: 'Hakuna matata', meaning: 'Kein Problem' }] }] },
    budget: { filterTypes: ['b', 'q'], blocks: [{ type: 'text', text: 'Mäßig teuer (Safaris sehr teuer). Budget ohne Safari: 15-25 €/Tag.' }] },
    sleep: { filterTypes: ['b', 'q'], blocks: [{ type: 'text', text: 'Wildcampen abgeraten (Wildtiere). Campingplätze in Parks sicher.' }] },
    transport: { filterTypes: ['c', 'b'], blocks: [{ type: 'transport', items: [{ emoji: '🚐', name: 'Matatu', detail: 'Minibusse, Musik auf voller Lautstärke', price: '1-5 €' }, { emoji: '🚂', name: 'Madaraka Express', detail: 'Nairobi-Mombasa (4h30)', price: '10-30 €' }] }] },
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [{ name: 'Jan', level: 'great' }, { name: 'Feb', level: 'great' }, { name: 'Mär', level: 'good' }, { name: 'Apr', level: 'bad' }, { name: 'Mai', level: 'bad' }, { name: 'Jun', level: 'good' }, { name: 'Jul', level: 'great' }, { name: 'Aug', level: 'great' }, { name: 'Sep', level: 'great' }, { name: 'Okt', level: 'good' }, { name: 'Nov', level: 'ok' }, { name: 'Dez', level: 'good' }] },
      { type: 'text', text: 'Jan-Feb und Jun-Okt: Trockenzeit. Jul-Okt: Große Migration in der Masai Mara.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [{ type: 'text', text: 'Lebendiges Land mit 42 Stämmen. Nyama Choma und Ugali sind Alltagsgerichte. Kenianer sind stolz auf ihre Tierwelt.' }] },
  },
  // ==================== ETHIOPIA ====================
  ET: {
    laws: { filterTypes: ['q', 'c'], blocks: [{ type: 'text', text: 'Trampen legal. Informeller Transport (Isuzu-LKWs) üblich. Fahrer erwarten oft Bezahlung.' }] },
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [{ type: 'text', text: 'Sonderfall. Trampen funktioniert, aber Grenze kostenlos/bezahlt ist fließend. Kläre "free, no birr".' }] },
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Äthiopien ist sicher für Tramper in touristischen Gebieten. Die Entfernungen sind lang, also nimm Geduld und Proviant mit.' },
      { type: 'sub', title: 'Nutze SpotHitch für deine Sicherheit' },
      { type: 'rule', icon: '🛡️', text: 'Aktiviere den Guardian-Modus vor jeder Fahrt. Eine Vertrauensperson verfolgt deine Position in Echtzeit.' },
      { type: 'rule', icon: '🆘', text: 'Richte den SOS-Modus mit deinen Kontakten ein. Ein Tippen löst einen dreifachen Alarm aus (Push, SMS, Anruf).' },
      { type: 'rule', icon: '📱', text: 'Fotografiere das Kennzeichen und sende es jemandem, bevor du einsteigst.' },
      { type: 'rule', icon: '🎒', text: 'Halte deinen Rucksack griffbereit (auf dem Schoß oder zu deinen Füßen), nie im Kofferraum.' },
      { type: 'sub', title: 'Landestipps' },
      { type: 'rule', icon: '🗺️', text: 'Die Entfernungen zwischen den Städten sind lang. Nimm Wasser und Essen für jede Fahrt mit.' },
      { type: 'rule', icon: '📋', text: 'Prüfe die Sicherheitslage vor der Reise. In einigen Regionen gibt es Spannungen.' },
      { type: 'sub', title: 'Notrufnummern' },
      { type: 'kv', items: [{ k: 'Notruf', v: '991' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [{ type: 'text', text: 'Straßenbelästigung häufig. Zu zweit reisen dringend empfohlen.' }] },
    language: { filterTypes: ['c', 'q'], blocks: [{ type: 'text', text: 'Amharisch Amtssprache (einzigartiges Ge\'ez-Alphabet). Englisch begrenzt.' }, { type: 'phrase', items: [{ local: 'Selam', meaning: 'Hallo' }, { local: 'Amesegenalehu', meaning: 'Danke' }] }] },
    budget: { filterTypes: ['b', 'q'], blocks: [{ type: 'text', text: 'Günstig. Budget: 10-20 €/Tag. Injera mit Wots: 1-3 €.' }] },
    sleep: { filterTypes: ['b', 'q'], blocks: [{ type: 'text', text: 'Pensionen: 2-8 €. Orthodoxe Klöster beherbergen manchmal Reisende.' }] },
    transport: { filterTypes: ['c', 'b'], blocks: [{ type: 'transport', items: [{ emoji: '🚐', name: 'Minibus', detail: 'Haupttransport, wartet bis voll', price: '1-10 €' }] }] },
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [{ name: 'Jan', level: 'great' }, { name: 'Feb', level: 'great' }, { name: 'Mär', level: 'good' }, { name: 'Apr', level: 'ok' }, { name: 'Mai', level: 'ok' }, { name: 'Jun', level: 'bad' }, { name: 'Jul', level: 'bad' }, { name: 'Aug', level: 'bad' }, { name: 'Sep', level: 'ok' }, { name: 'Okt', level: 'great' }, { name: 'Nov', level: 'great' }, { name: 'Dez', level: 'great' }] },
      { type: 'text', text: 'Okt-Mär: Trockenzeit, ideal. Jun-Sep: Große Regenzeit.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [{ type: 'text', text: 'Einzigartig in Afrika: nie kolonisiert, eigener Kalender, eigenes Alphabet. Kaffeezeremonie = 30-60 Min soziales Ritual. Injera wird mit den Händen gegessen.' }, { type: 'event', items: [{ month: 'Jan', day: '19', name: 'Timkat', desc: 'Größtes religiöses Fest. Spektakuläre Prozessionen.' }] }] },
  },
  // ==================== MYANMAR ====================
  MM: {
    laws: { filterTypes: ['q', 'c'], blocks: [{ type: 'text', text: 'Nicht geregelt. Informeller Transport üblich.' }, { type: 'warn', text: '⚠️ Politische Krise seit 2021. Prüfe die Sicherheitslage.' }] },
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [{ type: 'text', text: 'Unglaublich gastfreundliche Menschen. LKW- und Pickup-Fahrer halten leicht an. Kostenlosigkeit ist für Birmanen natürlich.' }] },
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Prüfe die Sicherheitslage, bevor du nach Myanmar reist. Die politische Situation verändert sich regelmäßig.' },
      { type: 'sub', title: 'Nutze SpotHitch für deine Sicherheit' },
      { type: 'rule', icon: '🛡️', text: 'Aktiviere den Guardian-Modus vor jeder Fahrt. Eine Vertrauensperson verfolgt deine Position in Echtzeit.' },
      { type: 'rule', icon: '🆘', text: 'Richte den SOS-Modus mit deinen Kontakten ein. Ein Tippen löst einen dreifachen Alarm aus (Push, SMS, Anruf).' },
      { type: 'rule', icon: '📱', text: 'Fotografiere das Kennzeichen und sende es jemandem, bevor du einsteigst.' },
      { type: 'rule', icon: '🎒', text: 'Halte deinen Rucksack griffbereit (auf dem Schoß oder zu deinen Füßen), nie im Kofferraum.' },
      { type: 'sub', title: 'Landestipps' },
      { type: 'rule', icon: '📋', text: 'Prüfe die Reisehinweise des Auswärtigen Amtes vor jeder Reise. Die Situation verändert sich.' },
      { type: 'rule', icon: '🌍', text: 'Lies aktuelle Reiseberichte in Foren, um Informationen über zugängliche Gebiete zu erhalten.' },
      { type: 'sub', title: 'Notrufnummern' },
      { type: 'kv', items: [{ k: 'Notruf', v: '199' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [{ type: 'text', text: 'Galt als sehr sicher (buddhistische Kultur). Situation seit 2021 verändert.' }] },
    language: { filterTypes: ['c', 'q'], blocks: [{ type: 'text', text: 'Birmanisch Amtssprache. Englisch begrenzt.' }, { type: 'phrase', items: [{ local: 'Mingalaba', meaning: 'Hallo' }, { local: 'Kyay zu tin ba de', meaning: 'Danke' }] }] },
    budget: { filterTypes: ['b', 'q'], blocks: [{ type: 'text', text: 'Günstig. Budget: 15-25 $/Tag.' }] },
    sleep: { filterTypes: ['b', 'q'], blocks: [{ type: 'text', text: 'Pensionen: 5-15 $. Klöster beherbergen manchmal Reisende.' }] },
    transport: { filterTypes: ['c', 'b'], blocks: [{ type: 'transport', items: [{ emoji: '🚌', name: 'Fernbus', detail: 'Komfortable VIP-Busse', price: '5-20 $' }] }] },
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [{ name: 'Jan', level: 'great' }, { name: 'Feb', level: 'great' }, { name: 'Mär', level: 'good' }, { name: 'Apr', level: 'ok' }, { name: 'Mai', level: 'bad' }, { name: 'Jun', level: 'bad' }, { name: 'Jul', level: 'bad' }, { name: 'Aug', level: 'bad' }, { name: 'Sep', level: 'bad' }, { name: 'Okt', level: 'ok' }, { name: 'Nov', level: 'great' }, { name: 'Dez', level: 'great' }] },
      { type: 'text', text: 'Nov-Feb: ideal. Jun-Okt: intensiver Monsun.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [{ type: 'text', text: 'Zutiefst buddhistisch. Goldene Pagoden (Shwedagon) spektakulär. Birmanen sind lächelnd und großzügig. Laphet Yay (Milchtee) ist das Nationalgetränk.' }] },
  },
  // ==================== INDONESIA ====================
  ID: {
    laws: { filterTypes: ['q', 'c'], blocks: [{ type: 'text', text: 'Kein formelles Trampkonzept. Informeller Transport ist die Norm: Ojek, Bemos, Angkots.' }] },
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [{ type: 'text', text: 'Größter Archipel der Welt (17.000 Inseln). Klassisches Trampen schwierig, da informelle Transporte allgegenwärtig und sehr günstig sind. In ländlichen Gebieten (Sumatra, Kalimantan) nehmen LKWs Passagiere mit.' }] },
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Indonesien ist ein sicheres Land für Tramper. Bali und Java sind die einfachsten Inseln zum Trampen. Die Indonesier sind extrem gastfreundlich.' },
      { type: 'sub', title: 'Nutze SpotHitch für deine Sicherheit' },
      { type: 'rule', icon: '🛡️', text: 'Aktiviere den Guardian-Modus vor jeder Fahrt. Eine Vertrauensperson verfolgt deine Position in Echtzeit.' },
      { type: 'rule', icon: '🆘', text: 'Richte den SOS-Modus mit deinen Kontakten ein. Ein Tippen löst einen dreifachen Alarm aus (Push, SMS, Anruf).' },
      { type: 'rule', icon: '📱', text: 'Fotografiere das Kennzeichen und sende es jemandem, bevor du einsteigst.' },
      { type: 'rule', icon: '🎒', text: 'Halte deinen Rucksack griffbereit (auf dem Schoß oder zu deinen Füßen), nie im Kofferraum.' },
      { type: 'sub', title: 'Landestipps' },
      { type: 'rule', icon: '🏝️', text: 'Bali und Java sind die einfachsten Inseln zum Trampen. Der Verkehr ist dicht und Fahrer halten gerne an.' },
      { type: 'rule', icon: '🤝', text: 'Indonesier sind extrem gastfreundlich. Man bietet dir oft Essen oder einen Umweg an.' },
      { type: 'sub', title: 'Notrufnummern' },
      { type: 'kv', items: [{ k: 'Notruf', v: '112' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [{ type: 'text', text: 'Generell sicher. Bescheidene Kleidung (größtes muslimisches Land). Bali entspannter.' }] },
    language: { filterTypes: ['c', 'q'], blocks: [{ type: 'text', text: 'Bahasa Indonesia Amtssprache (leicht zu lernen). Englisch in Touristengebieten.' }, { type: 'phrase', items: [{ local: 'Terima kasih', meaning: 'Danke' }, { local: 'Gratis', meaning: 'Kostenlos' }] }] },
    budget: { filterTypes: ['b', 'q'], blocks: [{ type: 'text', text: 'Sehr günstig (außer touristisches Bali). Budget: 10-20 €/Tag. Nasi Goreng: 0,50-1,50 €.' }] },
    sleep: { filterTypes: ['b', 'q'], blocks: [{ type: 'text', text: 'Losmen/Homestays: 3-10 €. Camping an Vulkanen möglich.' }] },
    transport: { filterTypes: ['c', 'b'], blocks: [{ type: 'transport', items: [{ emoji: '🚌', name: 'Bus', detail: 'Ausgedehnt auf Java und Sumatra', price: '2-15 €' }, { emoji: '⛴️', name: 'PELNI-Fähre', detail: 'Zwischen den Inseln', price: '5-30 €' }] }] },
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [{ name: 'Jan', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mär', level: 'ok' }, { name: 'Apr', level: 'good' }, { name: 'Mai', level: 'great' }, { name: 'Jun', level: 'great' }, { name: 'Jul', level: 'great' }, { name: 'Aug', level: 'great' }, { name: 'Sep', level: 'great' }, { name: 'Okt', level: 'good' }, { name: 'Nov', level: 'ok' }, { name: 'Dez', level: 'bad' }] },
      { type: 'text', text: 'Mai-Sep: Trockenzeit, ideal. Nov-Mär: Monsun.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [{ type: 'text', text: 'Unglaublich vielfältig: hinduistisch (Bali), muslimisch (Java), christlich (Flores). Gotong Royong (gegenseitige Hilfe) ist ein grundlegender Wert. Nasi Goreng ist das Nationalgericht.' }] },
  },
  // ==================== PHILIPPINES ====================
  PH: {
    laws: { filterTypes: ['q', 'c'], blocks: [{ type: 'text', text: 'Nicht geregelt. Jeepneys, Tricycles, Habal-habal sind die Norm.' }] },
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [{ type: 'text', text: 'Sehr gastfreundlich. Transport so günstig, dass Trampen selten nötig ist. Auf weniger touristischen Inseln halten Pickups leicht an.' }] },
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Die Philippinen sind sicher für Tramper auf den Hauptinseln. Filipinos sind gastfreundlich und Englisch wird überall gesprochen.' },
      { type: 'sub', title: 'Nutze SpotHitch für deine Sicherheit' },
      { type: 'rule', icon: '🛡️', text: 'Aktiviere den Guardian-Modus vor jeder Fahrt. Eine Vertrauensperson verfolgt deine Position in Echtzeit.' },
      { type: 'rule', icon: '🆘', text: 'Richte den SOS-Modus mit deinen Kontakten ein. Ein Tippen löst einen dreifachen Alarm aus (Push, SMS, Anruf).' },
      { type: 'rule', icon: '📱', text: 'Fotografiere das Kennzeichen und sende es jemandem, bevor du einsteigst.' },
      { type: 'rule', icon: '🎒', text: 'Halte deinen Rucksack griffbereit (auf dem Schoß oder zu deinen Füßen), nie im Kofferraum.' },
      { type: 'sub', title: 'Landestipps' },
      { type: 'rule', icon: '🏝️', text: 'Die Hauptinseln (Luzon, Visayas) sind am einfachsten für Tramper. Meide den äußersten Süden von Mindanao.' },
      { type: 'rule', icon: '🗣️', text: 'Englisch wird überall gesprochen. Die Kommunikation ist einfach und Filipinos lieben es zu plaudern.' },
      { type: 'sub', title: 'Notrufnummern' },
      { type: 'kv', items: [{ k: 'Notruf', v: '911' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [{ type: 'text', text: 'Generell sicher. Matriarchalische Gesellschaft. Filipinos sind respektvoll.' }] },
    language: { filterTypes: ['c', 'q'], blocks: [{ type: 'text', text: 'Filipino und Englisch Amtssprachen. Englisch wird sehr gut gesprochen.' }, { type: 'phrase', items: [{ local: 'Salamat po', meaning: 'Danke (respektvoll)' }] }] },
    budget: { filterTypes: ['b', 'q'], blocks: [{ type: 'text', text: 'Günstig. Budget: 15-25 €/Tag.' }] },
    sleep: { filterTypes: ['b', 'q'], blocks: [{ type: 'text', text: 'Pensionen: 5-15 €. Filipinos laden leicht ein.' }] },
    transport: { filterTypes: ['c', 'b'], blocks: [{ type: 'transport', items: [{ emoji: '🚐', name: 'Jeepney', detail: 'Ikone der Philippinen', price: '0,20-0,50 €' }, { emoji: '⛴️', name: 'Fähre', detail: 'Zwischen den Inseln', price: '5-30 €' }] }] },
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [{ name: 'Jan', level: 'great' }, { name: 'Feb', level: 'great' }, { name: 'Mär', level: 'great' }, { name: 'Apr', level: 'great' }, { name: 'Mai', level: 'good' }, { name: 'Jun', level: 'ok' }, { name: 'Jul', level: 'ok' }, { name: 'Aug', level: 'bad' }, { name: 'Sep', level: 'bad' }, { name: 'Okt', level: 'bad' }, { name: 'Nov', level: 'ok' }, { name: 'Dez', level: 'good' }] },
      { type: 'text', text: 'Dez-Mai: Trockenzeit, ideal. Jun-Nov: Monsun und Taifune.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [{ type: 'text', text: 'Fröhlich, gastfreundlich, singen gerne (Karaoke = nationale Institution). Lechon ist das Festtagsgericht. "Filipino Time" = nichts ist eilig.' }] },
  },
  // ==================== SRI LANKA ====================
  LK: {
    laws: { filterTypes: ['q', 'c'], blocks: [{ type: 'text', text: 'Trampen ist legal. Sri Lanker sind gastfreundlich und halten leicht an.' }] },
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [{ type: 'text', text: 'Einfach zum Trampen. Klein (430 km). Wartezeit: 10-20 Min. Hill Country Straßen am landschaftlich reizvollsten.' }] },
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Sri Lanka ist ein sicheres Land für Tramper. Die Fahrer sind gastfreundlich und die Küstenstraßen eignen sich am besten zum Trampen.' },
      { type: 'sub', title: 'Nutze SpotHitch für deine Sicherheit' },
      { type: 'rule', icon: '🛡️', text: 'Aktiviere den Guardian-Modus vor jeder Fahrt. Eine Vertrauensperson verfolgt deine Position in Echtzeit.' },
      { type: 'rule', icon: '🆘', text: 'Richte den SOS-Modus mit deinen Kontakten ein. Ein Tippen löst einen dreifachen Alarm aus (Push, SMS, Anruf).' },
      { type: 'rule', icon: '📱', text: 'Fotografiere das Kennzeichen und sende es jemandem, bevor du einsteigst.' },
      { type: 'rule', icon: '🎒', text: 'Halte deinen Rucksack griffbereit (auf dem Schoß oder zu deinen Füßen), nie im Kofferraum.' },
      { type: 'sub', title: 'Landestipps' },
      { type: 'rule', icon: '🌊', text: 'Die Küstenstraßen eignen sich am besten zum Trampen. Der Verkehr ist dicht und die Fahrer gastfreundlich.' },
      { type: 'rule', icon: '🤝', text: 'Sri Lanker sind gastfreundlich und beschützend gegenüber Reisenden. Nimm Einladungen dankbar an.' },
      { type: 'sub', title: 'Notrufnummern' },
      { type: 'kv', items: [{ k: 'Notruf', v: '119' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [{ type: 'text', text: 'Mäßig sicher. Süden und Hill Country am sichersten.' }] },
    language: { filterTypes: ['c', 'q'], blocks: [{ type: 'text', text: 'Singhalesisch und Tamil Amtssprachen. Englisch recht verbreitet.' }, { type: 'phrase', items: [{ local: 'Ayubowan', meaning: 'Hallo (Singhalesisch)' }, { local: 'Istuti', meaning: 'Danke' }] }] },
    budget: { filterTypes: ['b', 'q'], blocks: [{ type: 'text', text: 'Günstig. Budget: 15-25 €/Tag. Rice & Curry: 1-3 €.' }] },
    sleep: { filterTypes: ['b', 'q'], blocks: [{ type: 'text', text: 'Pensionen: 5-15 €. Tempel beherbergen manchmal Reisende.' }] },
    transport: { filterTypes: ['c', 'b'], blocks: [{ type: 'transport', items: [{ emoji: '🚂', name: 'Zug', detail: 'Hill Country Züge = schönste Strecken der Welt', price: '1-5 €' }, { emoji: '🛺', name: 'Tuk-Tuk', detail: 'Allgegenwärtig', price: '0,50-5 €' }] }] },
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [{ name: 'Jan', level: 'great' }, { name: 'Feb', level: 'great' }, { name: 'Mär', level: 'great' }, { name: 'Apr', level: 'good' }, { name: 'Mai', level: 'ok' }, { name: 'Jun', level: 'ok' }, { name: 'Jul', level: 'good' }, { name: 'Aug', level: 'good' }, { name: 'Sep', level: 'ok' }, { name: 'Okt', level: 'bad' }, { name: 'Nov', level: 'bad' }, { name: 'Dez', level: 'good' }] },
      { type: 'text', text: 'Zwei gegensätzliche Monsune: es gibt immer eine trockene Seite. Dez-Mär: am besten für Süd- und Westküste.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [{ type: 'text', text: '"Perle des Indischen Ozeans". Theravada-Buddhismus durchdringt die Kultur. Ceylon-Tee ist Nationalstolz. Rice & Curry ist eine Kunst.' }] },
  },
  // ==================== MONGOLIA ====================
  MN: {
    laws: { filterTypes: ['q', 'c'], blocks: [{ type: 'text', text: 'Legal. Informeller Transport die Norm. Auf den Pisten hält jedes Fahrzeug an.' }] },
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [{ type: 'text', text: 'Einzigartig. Quasi keine asphaltierten Straßen. Jedes Fahrzeug hält an.' }, { type: 'rule', icon: '🏔️', text: 'Nomadenjurten sind für Reisende offen. Mongolische Tradition.' }, { type: 'warn', text: '⚠️ Riesige Entfernungen. NICHTS zwischen den Städten. Nimm Wasser, Essen und warmen Schlafsack mit.' }] },
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Die Mongolei ist ein sicheres Land für Tramper. Die Entfernungen sind riesig und Straßen manchmal nicht vorhanden. Nimm Zelt und Proviant mit.' },
      { type: 'sub', title: 'Nutze SpotHitch für deine Sicherheit' },
      { type: 'rule', icon: '🛡️', text: 'Aktiviere den Guardian-Modus vor jeder Fahrt. Eine Vertrauensperson verfolgt deine Position in Echtzeit.' },
      { type: 'rule', icon: '🆘', text: 'Richte den SOS-Modus mit deinen Kontakten ein. Ein Tippen löst einen dreifachen Alarm aus (Push, SMS, Anruf).' },
      { type: 'rule', icon: '📱', text: 'Fotografiere das Kennzeichen und sende es jemandem, bevor du einsteigst.' },
      { type: 'rule', icon: '🎒', text: 'Halte deinen Rucksack griffbereit (auf dem Schoß oder zu deinen Füßen), nie im Kofferraum.' },
      { type: 'sub', title: 'Landestipps' },
      { type: 'rule', icon: '⛺', text: 'Die Entfernungen sind riesig und Straßen manchmal nicht vorhanden. Nimm Zelt und Essen mit.' },
      { type: 'rule', icon: '🏜️', text: 'Außerhalb von Ulaanbaatar gibt es kaum Netz. Informiere deine Vertrauenspersonen vor jeder Fahrt.' },
      { type: 'sub', title: 'Notrufnummern' },
      { type: 'kv', items: [{ k: 'Notruf', v: '102' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [{ type: 'text', text: 'Relativ sicher. Egalitäre Gesellschaft. Meide Ulaanbaatar-Bars spätabends.' }] },
    language: { filterTypes: ['c', 'q'], blocks: [{ type: 'text', text: 'Mongolisch (kyrillisch). Englisch außerhalb Ulaanbaatars sehr begrenzt.' }, { type: 'phrase', items: [{ local: 'Sain baina uu', meaning: 'Hallo' }, { local: 'Bayarlalaa', meaning: 'Danke' }] }] },
    budget: { filterTypes: ['b', 'q'], blocks: [{ type: 'text', text: 'Günstig. Budget: 15-25 €/Tag. Buuz (Fleischknödel): 1-2 €.' }] },
    sleep: { filterTypes: ['b', 'q'], blocks: [{ type: 'text', text: 'Wildcampen unbegrenzt. Nomaden nehmen Reisende in Jurten auf (heilige Tradition).' }] },
    transport: { filterTypes: ['c', 'b'], blocks: [{ type: 'transport', items: [{ emoji: '🚐', name: 'Mikr / Furgon', detail: 'Minibusse, warten bis voll', price: '5-15 €' }, { emoji: '🚂', name: 'Transmongolische Eisenbahn', detail: 'Mythisch: Ulaanbaatar-Irkutsk/Peking', price: '30-100 €' }] }] },
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [{ name: 'Jan', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mär', level: 'bad' }, { name: 'Apr', level: 'ok' }, { name: 'Mai', level: 'good' }, { name: 'Jun', level: 'great' }, { name: 'Jul', level: 'great' }, { name: 'Aug', level: 'great' }, { name: 'Sep', level: 'good' }, { name: 'Okt', level: 'ok' }, { name: 'Nov', level: 'bad' }, { name: 'Dez', level: 'bad' }] },
      { type: 'text', text: 'Jun-Aug: ideal (15-25°C). Naadam im Juli. Winter extrem (bis -40°C).' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [{ type: 'text', text: 'Land der Nomaden. 30% leben in Jurten. Gastfreundschaft heilig. Naadam feiert Ringen, Bogenschießen, Pferderennen.' }, { type: 'event', items: [{ month: 'Jul', day: '11-13', name: 'Naadam', desc: 'Größtes mongolisches Festival.' }] }] },
  },
  // ==================== CUBA ====================
  CU: {
    laws: { filterTypes: ['q', 'c'], blocks: [{ type: 'text', text: 'Legal und gefördert. Offizielle "Puntos de Botella" mit Amarillos in gelber Weste.' }] },
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [{ type: 'text', text: 'Wahrscheinlich bestes Land der Welt. Staatliche Fahrzeuge sind per Gesetz VERPFLICHTET, Tramper mitzunehmen. Wartezeit: 5-30 Min.' }, { type: 'rule', icon: '🟡', text: 'Puntos de Botella an Stadtausfahrten. Suche die Amarillos in gelber Weste.' }] },
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Kuba ist eines der sichersten Länder Amerikas. Gewaltkriminalität ist quasi inexistent. Kleinere Betrügereien (Jineteros) sind das Hauptrisiko für Touristen.' },
      { type: 'sub', title: 'Nutze SpotHitch für deine Sicherheit' },
      { type: 'rule', icon: '🛡️', text: 'Aktiviere den Guardian-Modus vor jeder Fahrt. Eine Vertrauensperson verfolgt deine Position in Echtzeit.' },
      { type: 'rule', icon: '🆘', text: 'Richte den SOS-Modus mit deinen Kontakten ein. Ein Tippen löst einen dreifachen Alarm aus (Push, SMS, Anruf).' },
      { type: 'rule', icon: '📱', text: 'Fotografiere das Kennzeichen und sende es jemandem, bevor du einsteigst.' },
      { type: 'rule', icon: '🎒', text: 'Halte deinen Rucksack griffbereit (auf dem Schoß oder zu deinen Füßen), nie im Kofferraum.' },
      { type: 'sub', title: 'Landestipps' },
      { type: 'rule', icon: '🟡', text: 'Suche die Puntos de Botella an Stadtausfahrten. Amarillos in gelben Westen helfen dir, eine Mitfahrt zu finden.' },
      { type: 'rule', icon: '😊', text: 'Kubaner sind solidarisch und hilfsbereit. Das sozialistische System fördert eine einzigartige Hilfsbereitschaft.' },
      { type: 'sub', title: 'Notrufnummern' },
      { type: 'kv', items: [{ k: 'Polizei', v: '106' }, { k: 'Krankenwagen', v: '104' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [{ type: 'text', text: 'Sicher. Piropos gibt es, aber ernste Vorfälle sehr selten.' }] },
    language: { filterTypes: ['c', 'q'], blocks: [{ type: 'text', text: 'Kubanisches Spanisch. Englisch sehr begrenzt.' }, { type: 'phrase', items: [{ local: '¿Me da botella?', meaning: 'Nehmen Sie mich per Anhalter mit?' }, { local: 'Gracias, compañero', meaning: 'Danke, Genosse' }] }] },
    budget: { filterTypes: ['b', 'q'], blocks: [{ type: 'text', text: 'Finanziell kompliziert. Budget: 20-35 €/Tag. Casas Particulares: 15-25 €.' }, { type: 'warn', text: '⚠️ Amerikanische Bankkarten funktionieren NICHT. Bringe Euro in bar mit.' }] },
    sleep: { filterTypes: ['b', 'q'], blocks: [{ type: 'text', text: 'Casas Particulares sind die Standardoption. Kubaner sind gastfreundlich.' }] },
    transport: { filterTypes: ['c', 'b'], blocks: [{ type: 'transport', items: [{ emoji: '🚌', name: 'Víazul', detail: 'Klimatisierte Touristenbusse', price: '10-40 €' }, { emoji: '🚗', name: 'Almendrones', detail: 'Alte Amerikaner, Sammeltaxis', price: '2-10 €' }] }] },
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [{ name: 'Jan', level: 'great' }, { name: 'Feb', level: 'great' }, { name: 'Mär', level: 'great' }, { name: 'Apr', level: 'good' }, { name: 'Mai', level: 'ok' }, { name: 'Jun', level: 'ok' }, { name: 'Jul', level: 'ok' }, { name: 'Aug', level: 'bad' }, { name: 'Sep', level: 'bad' }, { name: 'Okt', level: 'bad' }, { name: 'Nov', level: 'good' }, { name: 'Dez', level: 'great' }] },
      { type: 'text', text: 'Nov-Apr: Trockenzeit, ideal. Aug-Okt: Hurrikan möglich.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [{ type: 'text', text: 'Welt für sich. Musik (Son, Salsa, Rumba) überall. Rum und Zigarren sind Institutionen. Sozialistisches System schafft einzigartige Solidarität.' }, { type: 'event', items: [{ month: 'Jul', day: '⟳', name: 'Karneval von Santiago', desc: 'Größter Karneval Kubas.' }] }] },
  },
  // ==================== GUATEMALA ====================
  GT: {
    laws: { filterTypes: ['q', 'c'], blocks: [{ type: 'text', text: 'Legal. Pickups sind der Haupttransport in ländlichen Gebieten.' }] },
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [{ type: 'text', text: 'Machbar. Highlands (Atitlán, Antigua) am einfachsten. Wartezeit: 15-30 Min.' }, { type: 'rule', icon: '🛻', text: 'Steig auf die Pickup-Ladefläche. Kleine Bezahlung oft erwartet.' }] },
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Guatemala ist in touristischen Gebieten (Antigua, Atitlán, Highlands) sicher. Tankstellen (Gasolineras) sind gute Spots, um eine Mitfahrt zu finden.' },
      { type: 'sub', title: 'Nutze SpotHitch für deine Sicherheit' },
      { type: 'rule', icon: '🛡️', text: 'Aktiviere den Guardian-Modus vor jeder Fahrt. Eine Vertrauensperson verfolgt deine Position in Echtzeit.' },
      { type: 'rule', icon: '🆘', text: 'Richte den SOS-Modus mit deinen Kontakten ein. Ein Tippen löst einen dreifachen Alarm aus (Push, SMS, Anruf).' },
      { type: 'rule', icon: '📱', text: 'Fotografiere das Kennzeichen und sende es jemandem, bevor du einsteigst.' },
      { type: 'rule', icon: '🎒', text: 'Halte deinen Rucksack griffbereit (auf dem Schoß oder zu deinen Füßen), nie im Kofferraum.' },
      { type: 'sub', title: 'Landestipps' },
      { type: 'rule', icon: '⛽', text: 'Gasolineras sind sichere Spots, um Fahrer zu treffen und eine Mitfahrt zu organisieren.' },
      { type: 'rule', icon: '🌄', text: 'Bevorzuge touristische Gebiete (Antigua, Atitlán, Semuc Champey) und die Highlands zum Trampen.' },
      { type: 'sub', title: 'Notrufnummern' },
      { type: 'kv', items: [{ k: 'Polizei', v: '120' }, { k: 'Feuerwehr', v: '110' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [{ type: 'text', text: 'Heikel für alleinreisende Frauen. Highlands sicherer. Zu zweit empfohlen.' }] },
    language: { filterTypes: ['c', 'q'], blocks: [{ type: 'text', text: 'Spanisch Hauptsprache. 21 Maya-Sprachen in den Highlands.' }, { type: 'phrase', items: [{ local: '¿Me da jalón?', meaning: 'Nehmen Sie mich mit?' }] }] },
    budget: { filterTypes: ['b', 'q'], blocks: [{ type: 'text', text: 'Günstig. Budget: 15-25 €/Tag. Comedores: 1-3 €.' }] },
    sleep: { filterTypes: ['b', 'q'], blocks: [{ type: 'text', text: 'Hospedajes: 3-10 €. Camping um den Lago Atitlán möglich.' }] },
    transport: { filterTypes: ['c', 'b'], blocks: [{ type: 'transport', items: [{ emoji: '🚌', name: 'Chicken Bus', detail: 'Ehemalige US-Schulbusse, bunt bemalt', price: '0,50-3 €' }] }] },
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [{ name: 'Jan', level: 'great' }, { name: 'Feb', level: 'great' }, { name: 'Mär', level: 'great' }, { name: 'Apr', level: 'good' }, { name: 'Mai', level: 'ok' }, { name: 'Jun', level: 'ok' }, { name: 'Jul', level: 'ok' }, { name: 'Aug', level: 'ok' }, { name: 'Sep', level: 'bad' }, { name: 'Okt', level: 'bad' }, { name: 'Nov', level: 'good' }, { name: 'Dez', level: 'great' }] },
      { type: 'text', text: 'Nov-Apr: Trockenzeit, ideal.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [{ type: 'text', text: 'Herz der Maya-Welt. Farbenfrohe Märkte, Tikal, Lago Atitlán. Maya-Gemeinschaften lebendig. Kaffee unter den besten der Welt.' }] },
  },
  // ==================== COSTA RICA ====================
  CR: {
    laws: { filterTypes: ['q', 'c'], blocks: [{ type: 'text', text: 'Legal. Verbreitet in ländlichen Gebieten und an Pazifikstränden.' }] },
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [{ type: 'text', text: 'Einfach. "Pura vida" ist mehr als ein Slogan. Wartezeit: 15-30 Min. Surfer halten leicht an.' }] },
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Costa Rica ist ein sicheres Land für Tramper. Die Ticos (Costaricaner) sind gastfreundlich und die Bergstraßen bieten spektakuläre Ausblicke.' },
      { type: 'sub', title: 'Nutze SpotHitch für deine Sicherheit' },
      { type: 'rule', icon: '🛡️', text: 'Aktiviere den Guardian-Modus vor jeder Fahrt. Eine Vertrauensperson verfolgt deine Position in Echtzeit.' },
      { type: 'rule', icon: '🆘', text: 'Richte den SOS-Modus mit deinen Kontakten ein. Ein Tippen löst einen dreifachen Alarm aus (Push, SMS, Anruf).' },
      { type: 'rule', icon: '📱', text: 'Fotografiere das Kennzeichen und sende es jemandem, bevor du einsteigst.' },
      { type: 'rule', icon: '🎒', text: 'Halte deinen Rucksack griffbereit (auf dem Schoß oder zu deinen Füßen), nie im Kofferraum.' },
      { type: 'sub', title: 'Landestipps' },
      { type: 'rule', icon: '🏔️', text: 'Die Bergstraßen sind kurvenreich. Rechne mit Reiseübelkeit und mache regelmäßig Pausen.' },
      { type: 'rule', icon: '😊', text: 'Die Ticos sind sehr gastfreundlich. "Pura Vida" ist ihre Lebensphilosophie. Lass dich davon anstecken!' },
      { type: 'sub', title: 'Notrufnummern' },
      { type: 'kv', items: [{ k: 'Notruf', v: '911' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [{ type: 'text', text: 'Sicher für Frauen. Ticos respektvoll.' }] },
    language: { filterTypes: ['c', 'q'], blocks: [{ type: 'text', text: 'Spanisch. "Pura vida" = universeller Ausdruck.' }, { type: 'phrase', items: [{ local: '¡Pura vida!', meaning: 'Alles gut / Danke / Hallo' }] }] },
    budget: { filterTypes: ['b', 'q'], blocks: [{ type: 'text', text: 'Teuerstes Land Zentralamerikas. Budget: 25-40 €/Tag. Sodas: 3-5 €.' }] },
    sleep: { filterTypes: ['b', 'q'], blocks: [{ type: 'text', text: 'Wildcampen an Pazifikstränden. Hostels: 10-20 €.' }] },
    transport: { filterTypes: ['c', 'b'], blocks: [{ type: 'transport', items: [{ emoji: '🚌', name: 'Bus', detail: 'Ausgedehnt und günstig', price: '2-15 €' }] }] },
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [{ name: 'Jan', level: 'great' }, { name: 'Feb', level: 'great' }, { name: 'Mär', level: 'great' }, { name: 'Apr', level: 'good' }, { name: 'Mai', level: 'ok' }, { name: 'Jun', level: 'ok' }, { name: 'Jul', level: 'ok' }, { name: 'Aug', level: 'ok' }, { name: 'Sep', level: 'bad' }, { name: 'Okt', level: 'bad' }, { name: 'Nov', level: 'good' }, { name: 'Dez', level: 'great' }] },
      { type: 'text', text: 'Dez-Apr: Trockenzeit (Verano).' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [{ type: 'text', text: '"Pura vida" fasst alles zusammen. Kein Militär seit 1949. 25% Naturreservat. 5% der weltweiten Biodiversität.' }] },
  },
  // ==================== EGYPT ====================
  EG: {
    laws: { filterTypes: ['q', 'c'], blocks: [{ type: 'text', text: 'Nicht formell geregelt. Mikrobusse und Pickups sind der Hauptmodus.' }] },
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [{ type: 'text', text: 'Halb-informeller Transport. Mikrobusse halten überall. LKWs auf Fernstraßen nehmen Passagiere mit.' }, { type: 'rule', icon: '💰', text: 'Kläre "mish flous" (kein Geld) vor dem Einsteigen.' }] },
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Ägypten ist sicher für Reisende in touristischen Gebieten. Für lange Nachtfahrten nimm lieber einen Fernbus statt zu trampen.' },
      { type: 'sub', title: 'Nutze SpotHitch für deine Sicherheit' },
      { type: 'rule', icon: '🛡️', text: 'Aktiviere den Guardian-Modus vor jeder Fahrt. Eine Vertrauensperson verfolgt deine Position in Echtzeit.' },
      { type: 'rule', icon: '🆘', text: 'Richte den SOS-Modus mit deinen Kontakten ein. Ein Tippen löst einen dreifachen Alarm aus (Push, SMS, Anruf).' },
      { type: 'rule', icon: '📱', text: 'Fotografiere das Kennzeichen und sende es jemandem, bevor du einsteigst.' },
      { type: 'rule', icon: '🎒', text: 'Halte deinen Rucksack griffbereit (auf dem Schoß oder zu deinen Füßen), nie im Kofferraum.' },
      { type: 'sub', title: 'Landestipps' },
      { type: 'rule', icon: '🏛️', text: 'Touristische Gebiete (Kairo, Luxor, Assuan, Küste) sind sicher und gut überwacht.' },
      { type: 'rule', icon: '🚌', text: 'Für lange Nachtfahrten sind Fernbusse eine sichere und günstige Alternative zum Trampen.' },
      { type: 'sub', title: 'Notrufnummern' },
      { type: 'kv', items: [{ k: 'Notruf', v: '122' }] },
    ]},
    women: { filterTypes: ['q', 'c', 'a'], blocks: [{ type: 'text', text: 'Straßenbelästigung großes Problem. Alleine trampen abgeraten.' }, { type: 'rule', icon: '👫', text: 'Mit männlichem Begleiter dringend empfohlen.' }] },
    language: { filterTypes: ['c', 'q'], blocks: [{ type: 'text', text: 'Ägyptisches Arabisch. Englisch in Touristengebieten.' }, { type: 'phrase', items: [{ local: 'Shukran', meaning: 'Danke' }, { local: 'Mish flous', meaning: 'Kein Geld (kostenlos)' }] }] },
    budget: { filterTypes: ['b', 'q'], blocks: [{ type: 'text', text: 'Sehr günstig. Budget: 10-20 €/Tag. Koshari: 0,50-1 €.' }] },
    sleep: { filterTypes: ['b', 'q'], blocks: [{ type: 'text', text: 'Hostels: 3-10 €. Wildcampen in der Wüste möglich.' }] },
    transport: { filterTypes: ['c', 'b'], blocks: [{ type: 'transport', items: [{ emoji: '🚐', name: 'Mikrobus', detail: 'Allgegenwärtig, sehr günstig', price: '0,10-0,50 €' }, { emoji: '🚂', name: 'Zug', detail: 'Netz entlang des Nils', price: '5-25 €' }] }] },
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [{ name: 'Jan', level: 'great' }, { name: 'Feb', level: 'great' }, { name: 'Mär', level: 'great' }, { name: 'Apr', level: 'good' }, { name: 'Mai', level: 'ok' }, { name: 'Jun', level: 'bad' }, { name: 'Jul', level: 'bad' }, { name: 'Aug', level: 'bad' }, { name: 'Sep', level: 'ok' }, { name: 'Okt', level: 'great' }, { name: 'Nov', level: 'great' }, { name: 'Dez', level: 'great' }] },
      { type: 'text', text: 'Okt-Mär: ideal (20-28°C). Sommer glühend heiß (40-45°C im Süden).' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [{ type: 'text', text: 'Pyramiden, Luxor, Nil. Ägypter sind herzlich und witzig. Koshari ist das Volksgericht. Shai (Tee) zu jeder Stunde.' }] },
  },
  // ==================== TANZANIA ====================
  TZ: {
    laws: { filterTypes: ['q', 'c'], blocks: [{ type: 'text', text: 'Nicht geregelt. Dala-Dala (Minibusse) sind der Hauptmodus.' }] },
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [{ type: 'text', text: 'Funktioniert wie Kenia. Dala-Dalas überall und günstig. Kostenloses Trampen mit LKWs möglich.' }, { type: 'rule', icon: '💰', text: 'Kläre "bure" (kostenlos) vor dem Einsteigen.' }] },
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Tansania ist sicher für Tramper auf den Hauptstraßen. Reise tagsüber und nutze Matatu-Haltestellen (Minibusse) als Orientierungspunkte.' },
      { type: 'sub', title: 'Nutze SpotHitch für deine Sicherheit' },
      { type: 'rule', icon: '🛡️', text: 'Aktiviere den Guardian-Modus vor jeder Fahrt. Eine Vertrauensperson verfolgt deine Position in Echtzeit.' },
      { type: 'rule', icon: '🆘', text: 'Richte den SOS-Modus mit deinen Kontakten ein. Ein Tippen löst einen dreifachen Alarm aus (Push, SMS, Anruf).' },
      { type: 'rule', icon: '📱', text: 'Fotografiere das Kennzeichen und sende es jemandem, bevor du einsteigst.' },
      { type: 'rule', icon: '🎒', text: 'Halte deinen Rucksack griffbereit (auf dem Schoß oder zu deinen Füßen), nie im Kofferraum.' },
      { type: 'sub', title: 'Landestipps' },
      { type: 'rule', icon: '☀️', text: 'Reise nur tagsüber. Die Hauptstraßen sind sicher, aber nachts schlecht beleuchtet.' },
      { type: 'rule', icon: '🗺️', text: 'Die Hauptstrecken (Dar nach Arusha, Dar nach Dodoma) sind am besten zum Trampen geeignet.' },
      { type: 'sub', title: 'Notrufnummern' },
      { type: 'kv', items: [{ k: 'Notruf', v: '112' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [{ type: 'text', text: 'Mäßig sicher. Bescheidene Kleidung auf Sansibar (muslimisch).' }] },
    language: { filterTypes: ['c', 'q'], blocks: [{ type: 'text', text: 'Swahili und Englisch Amtssprachen.' }, { type: 'phrase', items: [{ local: 'Jambo', meaning: 'Hallo' }, { local: 'Asante sana', meaning: 'Vielen Dank' }, { local: 'Bure', meaning: 'Kostenlos' }] }] },
    budget: { filterTypes: ['b', 'q'], blocks: [{ type: 'text', text: 'Mäßig teuer (Safaris sehr teuer). Budget ohne Safari: 15-25 €/Tag.' }] },
    sleep: { filterTypes: ['b', 'q'], blocks: [{ type: 'text', text: 'Pensionen: 5-15 €. Camping in Nationalparks sicher.' }] },
    transport: { filterTypes: ['c', 'b'], blocks: [{ type: 'transport', items: [{ emoji: '🚐', name: 'Dala-Dala', detail: 'Allgegenwärtig, günstig', price: '0,30-2 €' }, { emoji: '⛴️', name: 'Fähre', detail: 'Dar-Sansibar (2h)', price: '20-35 $' }] }] },
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [{ name: 'Jan', level: 'great' }, { name: 'Feb', level: 'great' }, { name: 'Mär', level: 'ok' }, { name: 'Apr', level: 'bad' }, { name: 'Mai', level: 'bad' }, { name: 'Jun', level: 'great' }, { name: 'Jul', level: 'great' }, { name: 'Aug', level: 'great' }, { name: 'Sep', level: 'great' }, { name: 'Okt', level: 'good' }, { name: 'Nov', level: 'ok' }, { name: 'Dez', level: 'good' }] },
      { type: 'text', text: 'Jun-Okt: Trockenzeit für Safaris. Jan-Feb: Migration in der Serengeti.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [{ type: 'text', text: 'Serengeti, Kilimandscharo, Sansibar. Masai sind emblematisch. Swahili-Kultur auf Sansibar vermischt afrikanische, arabische und indische Einflüsse.' }] },
  },
  // ==================== TAJIKISTAN ====================
  TJ: {
    laws: { filterTypes: ['q', 'c'], blocks: [{ type: 'text', text: 'Legal. Informeller Transport die Norm im Pamir.' }] },
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [{ type: 'text', text: 'Mythisch. Pamir Highway (M41) = eine der höchsten Straßen der Welt (4.655m). Wenig Verkehr, aber jeder hält an.' }, { type: 'rule', icon: '🏔️', text: 'GBAO-Genehmigung für den Pamir erforderlich.' }] },
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Tadschikistan ist sicher. Die Kriminalität ist niedrig. Die Straßen des Pamir sind gefährlich (Abgründe, keine Leitplanken, Höhe). Die Höhenlage kann zu Höhenkrankheit führen.' },
      { type: 'sub', title: 'Nutze SpotHitch für deine Sicherheit' },
      { type: 'rule', icon: '🛡️', text: 'Aktiviere den Guardian-Modus vor jeder Fahrt. Eine Vertrauensperson verfolgt deine Position in Echtzeit.' },
      { type: 'rule', icon: '🆘', text: 'Richte den SOS-Modus mit deinen Kontakten ein. Ein Tippen löst einen dreifachen Alarm aus (Push, SMS, Anruf).' },
      { type: 'rule', icon: '📱', text: 'Fotografiere das Kennzeichen und sende es jemandem, bevor du einsteigst.' },
      { type: 'rule', icon: '🎒', text: 'Halte deinen Rucksack griffbereit (auf dem Schoß oder zu deinen Füßen), nie im Kofferraum.' },
      { type: 'sub', title: 'Landestipps' },
      { type: 'rule', icon: '🏔️', text: 'Im Pamir sind die Straßen extrem: Abgründe, keine Leitplanken, Höhen über 4.000 m. Bereite dich auf die Höhe vor.' },
      { type: 'rule', icon: '🤝', text: 'Pamiri gehören zu den gastfreundlichsten Menschen der Welt. Tee, Brot und Yakbutter für jeden Besucher.' },
      { type: 'sub', title: 'Notrufnummern' },
      { type: 'kv', items: [{ k: 'Notruf', v: '112' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [{ type: 'text', text: 'Relativ sicher. Konservativ aber respektvoll. Zu zweit im Pamir empfohlen.' }] },
    language: { filterTypes: ['c', 'q'], blocks: [{ type: 'text', text: 'Tadschikisch (dem Farsi verwandt). Russisch weit verbreitet.' }, { type: 'phrase', items: [{ local: 'Salom', meaning: 'Hallo' }, { local: 'Rahmat', meaning: 'Danke' }] }] },
    budget: { filterTypes: ['b', 'q'], blocks: [{ type: 'text', text: 'Sehr günstig. Budget: 10-20 €/Tag. Homestay im Pamir: 10-15 € mit Mahlzeiten.' }] },
    sleep: { filterTypes: ['b', 'q'], blocks: [{ type: 'text', text: 'Homestays im Pamir die Norm. Wildcampen in Bergen unbegrenzt.' }] },
    transport: { filterTypes: ['c', 'b'], blocks: [{ type: 'transport', items: [{ emoji: '🚗', name: 'Sammeltaxi', detail: 'Haupttransport', price: '5-30 €' }] }] },
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [{ name: 'Jan', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mär', level: 'bad' }, { name: 'Apr', level: 'ok' }, { name: 'Mai', level: 'good' }, { name: 'Jun', level: 'great' }, { name: 'Jul', level: 'great' }, { name: 'Aug', level: 'great' }, { name: 'Sep', level: 'great' }, { name: 'Okt', level: 'good' }, { name: 'Nov', level: 'ok' }, { name: 'Dez', level: 'bad' }] },
      { type: 'text', text: 'Jun-Sep: ideal für den Pamir. Winter sperrt die Pässe.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [{ type: 'text', text: '"Dach der Welt". Pamiri unter den gastfreundlichsten Menschen der Erde. Tee, Brot, Yakbutter für jeden Besucher. Atemberaubende Landschaften.' }] },
  },
  // ==================== SOUTH KOREA ====================
  KR: {
    laws: { filterTypes: ['q', 'c'], blocks: [{ type: 'text', text: 'Legal. Selten, da der öffentliche Nahverkehr ausgezeichnet und günstig ist.' }] },
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [{ type: 'text', text: 'Möglich, aber Fahrer sind überrascht. Wartezeit: 20-60 Min. Tankstellen auf Autobahnen sind die besten Spots. Koreaner, die anhalten, sind begeistert und großzügig.' }] },
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Südkorea ist ein sehr sicheres Land für Tramper. Die Autobahnraststätten sind die besten Spots.' },
      { type: 'sub', title: 'Nutze SpotHitch für deine Sicherheit' },
      { type: 'rule', icon: '🛡️', text: 'Aktiviere den Guardian-Modus vor jeder Fahrt. Eine Vertrauensperson verfolgt deine Position in Echtzeit.' },
      { type: 'rule', icon: '🆘', text: 'Richte den SOS-Modus mit deinen Kontakten ein. Ein Tippen löst einen dreifachen Alarm aus (Push, SMS, Anruf).' },
      { type: 'rule', icon: '📱', text: 'Fotografiere das Kennzeichen und sende es jemandem, bevor du einsteigst.' },
      { type: 'rule', icon: '🎒', text: 'Halte deinen Rucksack griffbereit (auf dem Schoß oder zu deinen Füßen), nie im Kofferraum.' },
      { type: 'sub', title: 'Landestipps' },
      { type: 'rule', icon: '🅿️', text: 'Die Autobahnraststätten (휴게소) sind die besten Spots. Sie sind sauber und sehr gut besucht.' },
      { type: 'rule', icon: '🍜', text: 'Koreanische Raststätten sind legendär für ihr Essen. Nutze sie, um dich zu stärken und Energie zu tanken.' },
      { type: 'sub', title: 'Notrufnummern' },
      { type: 'kv', items: [{ k: 'Notruf', v: '112' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [{ type: 'text', text: 'Sehr sicher für Frauen.' }] },
    language: { filterTypes: ['c', 'q'], blocks: [{ type: 'text', text: 'Koreanisch. Hangul in wenigen Stunden lernbar. Englisch begrenzt.' }, { type: 'phrase', items: [{ local: 'Annyeonghaseyo', meaning: 'Hallo' }, { local: 'Gamsahamnida', meaning: 'Danke' }] }] },
    budget: { filterTypes: ['b', 'q'], blocks: [{ type: 'text', text: 'Mäßig teuer. Budget: 25-40 €/Tag. Jjimjilbangs (Saunas) = günstige Übernachtung (8-12 €).' }] },
    sleep: { filterTypes: ['b', 'q'], blocks: [{ type: 'text', text: 'Jjimjilbangs: 8-12 €/Nacht mit Sauna und Ruhebereich. Camping in Nationalparks möglich.' }] },
    transport: { filterTypes: ['c', 'b'], blocks: [{ type: 'transport', items: [{ emoji: '🚄', name: 'KTX', detail: 'Seoul-Busan in 2h30', price: '25-50 €' }, { emoji: '🚌', name: 'Express-Bus', detail: 'Ausgezeichnet und günstig', price: '5-20 €' }] }] },
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [{ name: 'Jan', level: 'bad' }, { name: 'Feb', level: 'ok' }, { name: 'Mär', level: 'good' }, { name: 'Apr', level: 'great' }, { name: 'Mai', level: 'great' }, { name: 'Jun', level: 'good' }, { name: 'Jul', level: 'bad' }, { name: 'Aug', level: 'bad' }, { name: 'Sep', level: 'great' }, { name: 'Okt', level: 'great' }, { name: 'Nov', level: 'good' }, { name: 'Dez', level: 'ok' }] },
      { type: 'text', text: 'Apr-Mai (Kirschblüte) und Sep-Okt (Herbstlaub): ideal.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [{ type: 'text', text: 'Mischung aus Tradition und Ultramoderne. Kimchi, koreanisches BBQ und Soju sind Institutionen. K-Pop hat die Welt erobert.' }] },
  },
  // ==================== PAKISTAN ====================
  PK: {
    laws: { filterTypes: ['q', 'c'], blocks: [{ type: 'text', text: 'Legal. Jingle Trucks nehmen mit Freude Passagiere mit.' }] },
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [{ type: 'text', text: 'Von vielen als gastfreundlichstes Land der Welt betrachtet. Fahrer lehnen Geld ab und bestehen darauf, Mahlzeit zu bezahlen. Wartezeit: 5-15 Min.' }, { type: 'kv', items: [{ k: 'Karakoram Highway', v: 'Mythisch. Schönste Straße der Welt.', color: 'green' }, { k: 'Hunza-Tal', v: 'Paradies. Jeder hält an.', color: 'green' }, { k: 'Belutschistan', v: 'Abgeraten', color: 'red' }] }] },
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Prüfe die Sicherheitshinweise, bevor du nach Pakistan reist. Der Norden (Hunza, Gilgit-Baltistan) ist sicher und extrem gastfreundlich.' },
      { type: 'sub', title: 'Nutze SpotHitch für deine Sicherheit' },
      { type: 'rule', icon: '🛡️', text: 'Aktiviere den Guardian-Modus vor jeder Fahrt. Eine Vertrauensperson verfolgt deine Position in Echtzeit.' },
      { type: 'rule', icon: '🆘', text: 'Richte den SOS-Modus mit deinen Kontakten ein. Ein Tippen löst einen dreifachen Alarm aus (Push, SMS, Anruf).' },
      { type: 'rule', icon: '📱', text: 'Fotografiere das Kennzeichen und sende es jemandem, bevor du einsteigst.' },
      { type: 'rule', icon: '🎒', text: 'Halte deinen Rucksack griffbereit (auf dem Schoß oder zu deinen Füßen), nie im Kofferraum.' },
      { type: 'sub', title: 'Landestipps' },
      { type: 'rule', icon: '🏔️', text: 'Der Norden (Hunza, Gilgit-Baltistan) ist sicher und die Bewohner sind bemerkenswert gastfreundlich.' },
      { type: 'rule', icon: '📋', text: 'Prüfe die Reisehinweise des Auswärtigen Amtes vor der Reise. Einige Regionen sind nicht empfohlen.' },
      { type: 'sub', title: 'Notrufnummern' },
      { type: 'kv', items: [{ k: 'Rettung', v: '1122' }] },
    ]},
    women: { filterTypes: ['q', 'c', 'a'], blocks: [{ type: 'text', text: 'Konservativ. Shalwar Kameez empfohlen. Mit Mann reisen dringend empfohlen.' }] },
    language: { filterTypes: ['c', 'q'], blocks: [{ type: 'text', text: 'Urdu national. Englisch gut bei Gebildeten.' }, { type: 'phrase', items: [{ local: 'Assalam o alaikum', meaning: 'Friede sei mit euch' }, { local: 'Shukriya', meaning: 'Danke' }] }] },
    budget: { filterTypes: ['b', 'q'], blocks: [{ type: 'text', text: 'Sehr günstig. Budget: 8-15 €/Tag. Fahrer bezahlen oft die Mahlzeit.' }] },
    sleep: { filterTypes: ['b', 'q'], blocks: [{ type: 'text', text: 'Pensionen: 3-10 €. Familien laden sehr oft ein. Homestays im Hunza die Norm.' }] },
    transport: { filterTypes: ['c', 'b'], blocks: [{ type: 'transport', items: [{ emoji: '🚌', name: 'Natco', detail: 'Bus der KKH', price: '3-15 €' }, { emoji: '🚛', name: 'Jingle Trucks', detail: 'Prächtig dekoriert, langsam aber kulturell', price: 'Oft kostenlos' }] }] },
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [{ name: 'Jan', level: 'bad' }, { name: 'Feb', level: 'ok' }, { name: 'Mär', level: 'good' }, { name: 'Apr', level: 'great' }, { name: 'Mai', level: 'great' }, { name: 'Jun', level: 'good' }, { name: 'Jul', level: 'ok' }, { name: 'Aug', level: 'ok' }, { name: 'Sep', level: 'great' }, { name: 'Okt', level: 'great' }, { name: 'Nov', level: 'good' }, { name: 'Dez', level: 'ok' }] },
      { type: 'text', text: 'Apr-Mai und Sep-Okt: ideal für den Norden.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [{ type: 'text', text: 'Chai zu jeder Stunde. Fahrer machen 100 km Umwege. Biryani und Naans sind Institutionen. Cricket ist Nationalreligion.' }] },
  },
  // ==================== MALAYSIA ====================
  MY: {
    laws: { filterTypes: ['q', 'c'], blocks: [{ type: 'text', text: 'Legal. Fahrer halten leicht an für Ausländer.' }] },
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [{ type: 'text', text: 'Einfach. Gastfreundlich und neugierig. Wartezeit: 15-30 Min. Petronas-Tankstellen beste Spots.' }] },
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Malaysia ist ein sicheres Land für Tramper. Die Halbinsel und Sarawak sind gastfreundlich gegenüber Reisenden.' },
      { type: 'sub', title: 'Nutze SpotHitch für deine Sicherheit' },
      { type: 'rule', icon: '🛡️', text: 'Aktiviere den Guardian-Modus vor jeder Fahrt. Eine Vertrauensperson verfolgt deine Position in Echtzeit.' },
      { type: 'rule', icon: '🆘', text: 'Richte den SOS-Modus mit deinen Kontakten ein. Ein Tippen löst einen dreifachen Alarm aus (Push, SMS, Anruf).' },
      { type: 'rule', icon: '📱', text: 'Fotografiere das Kennzeichen und sende es jemandem, bevor du einsteigst.' },
      { type: 'rule', icon: '🎒', text: 'Halte deinen Rucksack griffbereit (auf dem Schoß oder zu deinen Füßen), nie im Kofferraum.' },
      { type: 'sub', title: 'Landestipps' },
      { type: 'rule', icon: '🌴', text: 'Die malaiische Halbinsel und Sarawak (Borneo) sind die gastfreundlichsten Regionen zum Trampen.' },
      { type: 'rule', icon: '🗣️', text: 'Englisch wird in Malaysia gut gesprochen. Die Kommunikation mit Fahrern ist einfach.' },
      { type: 'sub', title: 'Notrufnummern' },
      { type: 'kv', items: [{ k: 'Notruf', v: '999' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [{ type: 'text', text: 'Sicher. Multikulturell und respektvoll.' }] },
    language: { filterTypes: ['c', 'q'], blocks: [{ type: 'text', text: 'Bahasa Melayu. Englisch weit verbreitet.' }, { type: 'phrase', items: [{ local: 'Terima kasih', meaning: 'Danke' }] }] },
    budget: { filterTypes: ['b', 'q'], blocks: [{ type: 'text', text: 'Günstig. Budget: 15-25 €/Tag. Nasi Lemak: 1-2 €.' }] },
    sleep: { filterTypes: ['b', 'q'], blocks: [{ type: 'text', text: 'Hostels: 5-15 €. Camping in Nationalparks.' }] },
    transport: { filterTypes: ['c', 'b'], blocks: [{ type: 'transport', items: [{ emoji: '🚌', name: 'Express-Bus', detail: 'Ausgedehnt und günstig', price: '3-15 €' }, { emoji: '✈️', name: 'AirAsia', detail: 'Billigflieger, Hub KL', price: '15-50 €' }] }] },
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [{ name: 'Jan', level: 'good' }, { name: 'Feb', level: 'great' }, { name: 'Mär', level: 'great' }, { name: 'Apr', level: 'good' }, { name: 'Mai', level: 'good' }, { name: 'Jun', level: 'good' }, { name: 'Jul', level: 'great' }, { name: 'Aug', level: 'great' }, { name: 'Sep', level: 'good' }, { name: 'Okt', level: 'ok' }, { name: 'Nov', level: 'ok' }, { name: 'Dez', level: 'ok' }] },
      { type: 'text', text: 'Tropisch ganzjährig. Ostküste: Monsun Nov-Feb. Westküste ganzjährig machbar.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [{ type: 'text', text: 'Schmelztiegel: Moscheen, chinesische und Hindu-Tempel koexistieren. Essen = sozialer Kitt. Teh Tarik ist Nationalkunst.' }] },
  },
  // ==================== TAIWAN ====================
  TW: {
    laws: { filterTypes: ['q', 'c'], blocks: [{ type: 'text', text: 'Legal. Taiwaner extrem gastfreundlich.' }] },
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [{ type: 'text', text: 'Ausgezeichnet. Neugierig und hilfsbereit. Wartezeit: 10-20 Min. Klein (395 km). Fahrer machen Umwege.' }, { type: 'tip', text: '💡 Taiwaner laden oft zum Essen und Übernachten ein. Biete ein Geschenk aus deinem Land an.' }] },
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Taiwan ist ein sehr sicheres Land für Tramper. Die Taiwaner sind extrem gastfreundlich und helfen Reisenden gerne.' },
      { type: 'sub', title: 'Nutze SpotHitch für deine Sicherheit' },
      { type: 'rule', icon: '🛡️', text: 'Aktiviere den Guardian-Modus vor jeder Fahrt. Eine Vertrauensperson verfolgt deine Position in Echtzeit.' },
      { type: 'rule', icon: '🆘', text: 'Richte den SOS-Modus mit deinen Kontakten ein. Ein Tippen löst einen dreifachen Alarm aus (Push, SMS, Anruf).' },
      { type: 'rule', icon: '📱', text: 'Fotografiere das Kennzeichen und sende es jemandem, bevor du einsteigst.' },
      { type: 'rule', icon: '🎒', text: 'Halte deinen Rucksack griffbereit (auf dem Schoß oder zu deinen Füßen), nie im Kofferraum.' },
      { type: 'sub', title: 'Landestipps' },
      { type: 'rule', icon: '🤝', text: 'Taiwaner sind extrem gastfreundlich. Sie machen oft Umwege, um dir zu helfen.' },
      { type: 'rule', icon: '🏪', text: 'Konbini (7-Eleven, FamilyMart) gibt es überall. Perfekt zum Ausruhen oder Handy aufladen.' },
      { type: 'sub', title: 'Notrufnummern' },
      { type: 'kv', items: [{ k: 'Polizei', v: '110' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [{ type: 'text', text: 'Sehr sicher. Progressive Gesellschaft (erste gleichgeschlechtliche Ehe in Asien).' }] },
    language: { filterTypes: ['c', 'q'], blocks: [{ type: 'text', text: 'Mandarin. Englisch außerhalb Taipei begrenzt.' }, { type: 'phrase', items: [{ local: 'Nǐ hǎo', meaning: 'Hallo' }, { local: 'Xièxiè', meaning: 'Danke' }] }] },
    budget: { filterTypes: ['b', 'q'], blocks: [{ type: 'text', text: 'Mäßig teuer. Budget: 20-35 €/Tag. Nachtmärkte: 2-4 €.' }] },
    sleep: { filterTypes: ['b', 'q'], blocks: [{ type: 'text', text: 'Hostels: 10-20 €. Camping in Bergen möglich.' }] },
    transport: { filterTypes: ['c', 'b'], blocks: [{ type: 'transport', items: [{ emoji: '🚄', name: 'THSR', detail: 'Taipei-Kaohsiung in 1h30', price: '15-40 €' }] }] },
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [{ name: 'Jan', level: 'ok' }, { name: 'Feb', level: 'ok' }, { name: 'Mär', level: 'good' }, { name: 'Apr', level: 'great' }, { name: 'Mai', level: 'great' }, { name: 'Jun', level: 'ok' }, { name: 'Jul', level: 'bad' }, { name: 'Aug', level: 'bad' }, { name: 'Sep', level: 'ok' }, { name: 'Okt', level: 'great' }, { name: 'Nov', level: 'great' }, { name: 'Dez', level: 'good' }] },
      { type: 'text', text: 'Apr-Mai und Okt-Nov: ideal. Taifune Jul-Sep.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [{ type: 'text', text: 'Nachtmärkte unter den besten der Welt. Bubble Tea hier erfunden. Freundlichste Menschen Asiens.' }] },
  },
  // ==================== LEBANON ====================
  LB: {
    laws: { filterTypes: ['q', 'c'], blocks: [{ type: 'text', text: 'Legal. Service (Sammeltaxi) ist Haupttransport.' }] },
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [{ type: 'text', text: 'Klein (170 km), einfach. Extrem gastfreundlich. Wartezeit: 5-15 Min.' }, { type: 'rule', icon: '💰', text: 'Viele Autos sind Services (Sammeltaxis). Kläre ob kostenlos.' }] },
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Prüfe die Sicherheitslage, bevor du in den Libanon reist. Touristische Gebiete (Beirut, Byblos, Baalbek) sind in der Regel sicher.' },
      { type: 'sub', title: 'Nutze SpotHitch für deine Sicherheit' },
      { type: 'rule', icon: '🛡️', text: 'Aktiviere den Guardian-Modus vor jeder Fahrt. Eine Vertrauensperson verfolgt deine Position in Echtzeit.' },
      { type: 'rule', icon: '🆘', text: 'Richte den SOS-Modus mit deinen Kontakten ein. Ein Tippen löst einen dreifachen Alarm aus (Push, SMS, Anruf).' },
      { type: 'rule', icon: '📱', text: 'Fotografiere das Kennzeichen und sende es jemandem, bevor du einsteigst.' },
      { type: 'rule', icon: '🎒', text: 'Halte deinen Rucksack griffbereit (auf dem Schoß oder zu deinen Füßen), nie im Kofferraum.' },
      { type: 'sub', title: 'Landestipps' },
      { type: 'rule', icon: '📋', text: 'Prüfe die Sicherheitslage vor jeder Reise. Die Situation verändert sich regelmäßig.' },
      { type: 'rule', icon: '🤝', text: 'Libanesen sind gastfreundlich und mehrsprachig. Die Kommunikation ist einfach.' },
      { type: 'sub', title: 'Notrufnummern' },
      { type: 'kv', items: [{ k: 'Notruf', v: '112' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [{ type: 'text', text: 'Liberalstes Land der Levante. Beirut kosmopolitisch.' }] },
    language: { filterTypes: ['c', 'q'], blocks: [{ type: 'text', text: 'Libanesisches Arabisch, Französisch und Englisch. Viele sprechen 3 Sprachen.' }, { type: 'phrase', items: [{ local: 'Kifak?', meaning: 'Wie geht\'s?' }, { local: 'Merci ktir', meaning: 'Vielen Dank' }] }] },
    budget: { filterTypes: ['b', 'q'], blocks: [{ type: 'text', text: 'Wirtschaftskrise. Budget: 15-30 €/Tag. Shawarma: 1-2 $.' }] },
    sleep: { filterTypes: ['b', 'q'], blocks: [{ type: 'text', text: 'Hostels: 10-20 $. Camping in Bergen. Libanesen laden leicht ein.' }] },
    transport: { filterTypes: ['c', 'b'], blocks: [{ type: 'transport', items: [{ emoji: '🚐', name: 'Service / Van', detail: 'Sammeltaxis, Haupttransport', price: '0,50-3 $' }] }] },
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [{ name: 'Jan', level: 'ok' }, { name: 'Feb', level: 'ok' }, { name: 'Mär', level: 'good' }, { name: 'Apr', level: 'great' }, { name: 'Mai', level: 'great' }, { name: 'Jun', level: 'great' }, { name: 'Jul', level: 'good' }, { name: 'Aug', level: 'good' }, { name: 'Sep', level: 'great' }, { name: 'Okt', level: 'great' }, { name: 'Nov', level: 'good' }, { name: 'Dez', level: 'ok' }] },
      { type: 'text', text: 'Apr-Jun und Sep-Nov: ideal.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [{ type: 'text', text: 'Moscheen und Kirchen nebeneinander. Libanesische Küche unter den besten der Welt. Nachtleben in Beirut. Kaffee und Shisha sind Institutionen.' }] },
  },
  // ==================== PANAMA ====================
  PA: {
    laws: { filterTypes: ['q', 'c'], blocks: [{ type: 'text', text: 'Legal. Verbreitet in ländlichen Gebieten.' }] },
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [{ type: 'text', text: 'Machbar. Panamericana mit gutem Verkehr. Wartezeit: 15-30 Min.' }, { type: 'warn', text: '⚠️ Darién Gap = Dschungel ohne Straße. Passage nur per Boot oder Flugzeug.' }] },
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Panama ist ein sicheres Land für Tramper. Tankstellen entlang der Panamericana sind gute Spots, um eine Mitfahrt zu finden.' },
      { type: 'sub', title: 'Nutze SpotHitch für deine Sicherheit' },
      { type: 'rule', icon: '🛡️', text: 'Aktiviere den Guardian-Modus vor jeder Fahrt. Eine Vertrauensperson verfolgt deine Position in Echtzeit.' },
      { type: 'rule', icon: '🆘', text: 'Richte den SOS-Modus mit deinen Kontakten ein. Ein Tippen löst einen dreifachen Alarm aus (Push, SMS, Anruf).' },
      { type: 'rule', icon: '📱', text: 'Fotografiere das Kennzeichen und sende es jemandem, bevor du einsteigst.' },
      { type: 'rule', icon: '🎒', text: 'Halte deinen Rucksack griffbereit (auf dem Schoß oder zu deinen Füßen), nie im Kofferraum.' },
      { type: 'sub', title: 'Landestipps' },
      { type: 'rule', icon: '⛽', text: 'Tankstellen entlang der Panamericana sind die besten Spots zum Trampen.' },
      { type: 'rule', icon: '🌴', text: 'Touristische Gebiete (Bocas del Toro, Boquete, San Blas) sind sicher und gastfreundlich.' },
      { type: 'sub', title: 'Notrufnummern' },
      { type: 'kv', items: [{ k: 'Notruf', v: '911' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [{ type: 'text', text: 'Mäßig sicher. Touristengebiete sicher.' }] },
    language: { filterTypes: ['c', 'q'], blocks: [{ type: 'text', text: 'Spanisch. Englisch recht verbreitet (Kanal-Einfluss).' }] },
    budget: { filterTypes: ['b', 'q'], blocks: [{ type: 'text', text: 'US-Dollar. Teurer als Nachbarn. Budget: 20-35 $/Tag.' }] },
    sleep: { filterTypes: ['b', 'q'], blocks: [{ type: 'text', text: 'Hostels in Bocas del Toro: 8-15 $. Camping auf San-Blas-Inseln.' }] },
    transport: { filterTypes: ['c', 'b'], blocks: [{ type: 'transport', items: [{ emoji: '🚌', name: 'Bus', detail: 'Ausgedehnt', price: '2-15 $' }, { emoji: '⛴️', name: 'Segelboot nach Kolumbien', detail: '5 Tage über San Blas', price: '350-500 $' }] }] },
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [{ name: 'Jan', level: 'great' }, { name: 'Feb', level: 'great' }, { name: 'Mär', level: 'great' }, { name: 'Apr', level: 'good' }, { name: 'Mai', level: 'ok' }, { name: 'Jun', level: 'ok' }, { name: 'Jul', level: 'ok' }, { name: 'Aug', level: 'ok' }, { name: 'Sep', level: 'bad' }, { name: 'Okt', level: 'bad' }, { name: 'Nov', level: 'ok' }, { name: 'Dez', level: 'great' }] },
      { type: 'text', text: 'Dez-Apr: Trockenzeit. Mai-Nov: Regen am Nachmittag.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [{ type: 'text', text: 'Panamakanal = Ingenieurwunder. Kuna auf paradiesischen San-Blas-Inseln. Ceviche und Rum.' }] },
  },
  // ==================== GHANA ====================
  GH: {
    laws: { filterTypes: ['q', 'c'], blocks: [{ type: 'text', text: 'Tro-Tros sind der Hauptmodus. Kostenloses Trampen mit LKWs und Pickups möglich.' }] },
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [{ type: 'text', text: 'Eines der gastfreundlichsten Länder Westafrikas. Tro-Tros allgegenwärtig und günstig.' }] },
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Ghana ist ein sicheres und stabiles Land für Tramper. Tankstellen sind gute Spots, um Fahrer zu treffen.' },
      { type: 'sub', title: 'Nutze SpotHitch für deine Sicherheit' },
      { type: 'rule', icon: '🛡️', text: 'Aktiviere den Guardian-Modus vor jeder Fahrt. Eine Vertrauensperson verfolgt deine Position in Echtzeit.' },
      { type: 'rule', icon: '🆘', text: 'Richte den SOS-Modus mit deinen Kontakten ein. Ein Tippen löst einen dreifachen Alarm aus (Push, SMS, Anruf).' },
      { type: 'rule', icon: '📱', text: 'Fotografiere das Kennzeichen und sende es jemandem, bevor du einsteigst.' },
      { type: 'rule', icon: '🎒', text: 'Halte deinen Rucksack griffbereit (auf dem Schoß oder zu deinen Füßen), nie im Kofferraum.' },
      { type: 'sub', title: 'Landestipps' },
      { type: 'rule', icon: '⛽', text: 'Tankstellen sind verlässliche Spots, um in Sicherheit eine Mitfahrt zu finden.' },
      { type: 'rule', icon: '🌍', text: 'Ghana ist eines der stabilsten Länder Afrikas. Ghanaer sind gastfreundlich und neugierig.' },
      { type: 'sub', title: 'Notrufnummern' },
      { type: 'kv', items: [{ k: 'Polizei', v: '191' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [{ type: 'text', text: 'Relativ sicher. Respektvolle Gesellschaft.' }] },
    language: { filterTypes: ['c', 'q'], blocks: [{ type: 'text', text: 'Englisch Amtssprache. Twi wichtigste Lokalsprache.' }, { type: 'phrase', items: [{ local: 'Akwaaba', meaning: 'Willkommen (Twi)' }, { local: 'Medaase', meaning: 'Danke' }] }] },
    budget: { filterTypes: ['b', 'q'], blocks: [{ type: 'text', text: 'Mäßig teuer für Afrika. Budget: 15-25 €/Tag.' }] },
    sleep: { filterTypes: ['b', 'q'], blocks: [{ type: 'text', text: 'Pensionen: 5-15 €.' }] },
    transport: { filterTypes: ['c', 'b'], blocks: [{ type: 'transport', items: [{ emoji: '🚐', name: 'Tro-Tro', detail: 'Allgegenwärtig, günstig', price: '0,50-3 €' }] }] },
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [{ name: 'Jan', level: 'great' }, { name: 'Feb', level: 'great' }, { name: 'Mär', level: 'good' }, { name: 'Apr', level: 'ok' }, { name: 'Mai', level: 'ok' }, { name: 'Jun', level: 'bad' }, { name: 'Jul', level: 'ok' }, { name: 'Aug', level: 'ok' }, { name: 'Sep', level: 'ok' }, { name: 'Okt', level: 'ok' }, { name: 'Nov', level: 'great' }, { name: 'Dez', level: 'great' }] },
      { type: 'text', text: 'Nov-Mär: Trockenzeit, ideal.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [{ type: 'text', text: '"Tor der Rückkehr" für die afrikanische Diaspora. Jollof Rice Nationalstolz. Stabile Demokratie.' }] },
  },
  // ==================== UGANDA ====================
  UG: {
    laws: { filterTypes: ['q', 'c'], blocks: [{ type: 'text', text: 'Informeller Transport (Boda-Bodas, Matatus) allgegenwärtig.' }] },
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [{ type: 'text', text: '"Perle Afrikas". LKWs auf Hauptstraßen nehmen Passagiere mit.' }] },
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Uganda ist ein sicheres Land für Tramper. Die Fahrer sind gastfreundlich und Total-Tankstellen sind gute Spots.' },
      { type: 'sub', title: 'Nutze SpotHitch für deine Sicherheit' },
      { type: 'rule', icon: '🛡️', text: 'Aktiviere den Guardian-Modus vor jeder Fahrt. Eine Vertrauensperson verfolgt deine Position in Echtzeit.' },
      { type: 'rule', icon: '🆘', text: 'Richte den SOS-Modus mit deinen Kontakten ein. Ein Tippen löst einen dreifachen Alarm aus (Push, SMS, Anruf).' },
      { type: 'rule', icon: '📱', text: 'Fotografiere das Kennzeichen und sende es jemandem, bevor du einsteigst.' },
      { type: 'rule', icon: '🎒', text: 'Halte deinen Rucksack griffbereit (auf dem Schoß oder zu deinen Füßen), nie im Kofferraum.' },
      { type: 'sub', title: 'Landestipps' },
      { type: 'rule', icon: '⛽', text: 'Total-Tankstellen sind gut verteilt und eignen sich hervorragend als Spots zum Trampen.' },
      { type: 'rule', icon: '🤝', text: 'Ugander sind gastfreundlich und neugierig. Ein Lächeln und ein paar Worte genügen, um Kontakt herzustellen.' },
      { type: 'sub', title: 'Notrufnummern' },
      { type: 'kv', items: [{ k: 'Notruf', v: '999' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [{ type: 'text', text: 'Mäßig sicher. Bescheidene Kleidung in ländlichen Gebieten.' }] },
    language: { filterTypes: ['c', 'q'], blocks: [{ type: 'text', text: 'Englisch und Swahili Amtssprachen. Luganda wichtigste Lokalsprache.' }, { type: 'phrase', items: [{ local: 'Oli otya?', meaning: 'Wie geht\'s? (Luganda)' }, { local: 'Webale', meaning: 'Danke' }] }] },
    budget: { filterTypes: ['b', 'q'], blocks: [{ type: 'text', text: 'Günstig (außer Gorillas: 700 $/Genehmigung). Budget: 15-25 €/Tag.' }] },
    sleep: { filterTypes: ['b', 'q'], blocks: [{ type: 'text', text: 'Pensionen: 5-15 €. Camping in Nationalparks sicher.' }] },
    transport: { filterTypes: ['c', 'b'], blocks: [{ type: 'transport', items: [{ emoji: '🏍️', name: 'Boda-Boda', detail: 'Motorradtaxis, schnell aber gefährlich', price: '0,30-3 €' }] }] },
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [{ name: 'Jan', level: 'great' }, { name: 'Feb', level: 'great' }, { name: 'Mär', level: 'ok' }, { name: 'Apr', level: 'bad' }, { name: 'Mai', level: 'bad' }, { name: 'Jun', level: 'great' }, { name: 'Jul', level: 'great' }, { name: 'Aug', level: 'great' }, { name: 'Sep', level: 'great' }, { name: 'Okt', level: 'ok' }, { name: 'Nov', level: 'bad' }, { name: 'Dez', level: 'good' }] },
      { type: 'text', text: 'Jun-Sep und Dez-Feb: Trockenzeiten.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [{ type: 'text', text: '"Perle Afrikas" (Churchill). Berggorillas (Bwindi), Schimpansen (Kibale), Nilquellen (Jinja).' }] },
  },
  // ==================== RWANDA ====================
  RW: {
    laws: { filterTypes: ['q', 'c'], blocks: [{ type: 'text', text: 'Nicht traditionell. Klein und gut organisiert. Motorradtaxis und Busse.' }] },
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [{ type: 'text', text: 'Sauberstes und organisiertestes Land Afrikas. Klein (26.000 km²). Motorradtaxis günstig.' }] },
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Ruanda ist ein sehr sicheres Land für Tramper. Es ist eines der saubersten und am besten organisierten Länder Afrikas mit guten Straßen.' },
      { type: 'sub', title: 'Nutze SpotHitch für deine Sicherheit' },
      { type: 'rule', icon: '🛡️', text: 'Aktiviere den Guardian-Modus vor jeder Fahrt. Eine Vertrauensperson verfolgt deine Position in Echtzeit.' },
      { type: 'rule', icon: '🆘', text: 'Richte den SOS-Modus mit deinen Kontakten ein. Ein Tippen löst einen dreifachen Alarm aus (Push, SMS, Anruf).' },
      { type: 'rule', icon: '📱', text: 'Fotografiere das Kennzeichen und sende es jemandem, bevor du einsteigst.' },
      { type: 'rule', icon: '🎒', text: 'Halte deinen Rucksack griffbereit (auf dem Schoß oder zu deinen Füßen), nie im Kofferraum.' },
      { type: 'sub', title: 'Landestipps' },
      { type: 'rule', icon: '🛣️', text: 'Ruandas Straßen gehören zu den besten Ostafrikas. Das Straßennetz ist gut gepflegt.' },
      { type: 'rule', icon: '🌿', text: 'Das Land wird "Land der tausend Hügel" genannt. Die Landschaften sind wunderschön und die Sicherheit ausgezeichnet.' },
      { type: 'sub', title: 'Notrufnummern' },
      { type: 'kv', items: [{ k: 'Notruf', v: '112' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [{ type: 'text', text: 'Sicher. Höchster Frauenanteil im Parlament weltweit (>60%).' }] },
    language: { filterTypes: ['c', 'q'], blocks: [{ type: 'text', text: 'Kinyarwanda, Französisch und Englisch.' }, { type: 'phrase', items: [{ local: 'Muraho', meaning: 'Hallo' }, { local: 'Murakoze', meaning: 'Danke' }] }] },
    budget: { filterTypes: ['b', 'q'], blocks: [{ type: 'text', text: 'Mäßig teuer. Budget: 20-30 €/Tag. Gorillas: 1.500 $/Genehmigung.' }] },
    sleep: { filterTypes: ['b', 'q'], blocks: [{ type: 'text', text: 'Pensionen: 10-20 €. Wachsende Hostelszene in Kigali.' }] },
    transport: { filterTypes: ['c', 'b'], blocks: [{ type: 'transport', items: [{ emoji: '🏍️', name: 'Motorradtaxi', detail: 'Haupttransport, Helmpflicht', price: '0,30-2 €' }, { emoji: '🚌', name: 'Bus', detail: 'Moderne Busse', price: '2-8 €' }] }] },
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [{ name: 'Jan', level: 'great' }, { name: 'Feb', level: 'great' }, { name: 'Mär', level: 'ok' }, { name: 'Apr', level: 'bad' }, { name: 'Mai', level: 'bad' }, { name: 'Jun', level: 'great' }, { name: 'Jul', level: 'great' }, { name: 'Aug', level: 'great' }, { name: 'Sep', level: 'great' }, { name: 'Okt', level: 'ok' }, { name: 'Nov', level: 'bad' }, { name: 'Dez', level: 'good' }] },
      { type: 'text', text: 'Jun-Sep und Dez-Feb: Trockenzeiten. Ganzjährig gemäßigt (20-27°C).' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [{ type: 'text', text: 'Bemerkenswerte Transformation seit 1994. Plastiktüten seit 2008 verboten. Umuganda (monatliche Gemeinschaftsarbeit). Gorillas (Volcanoes NP). Ausgezeichneter Kaffee.' }] },
  },
  // ==================== MALAWI ====================
  MW: {
    laws: { filterTypes: ['q', 'c'], blocks: [{ type: 'text', text: 'Legal. "The Warm Heart of Africa": außergewöhnliche Gastfreundschaft.' }] },
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [{ type: 'text', text: 'Eines der besten Länder Afrikas zum Trampen. Außerordentlich gastfreundlich. Wartezeit: 15-30 Min.' }, { type: 'text', text: 'Der Malawisee (3. größter Afrikas) ist die Hauptattraktion.' }] },
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Malawi ist ein sicheres und gastfreundliches Land für Tramper. Es wird "das warme Herz Afrikas" genannt und die Bewohner sind bemerkenswert freundlich.' },
      { type: 'sub', title: 'Nutze SpotHitch für deine Sicherheit' },
      { type: 'rule', icon: '🛡️', text: 'Aktiviere den Guardian-Modus vor jeder Fahrt. Eine Vertrauensperson verfolgt deine Position in Echtzeit.' },
      { type: 'rule', icon: '🆘', text: 'Richte den SOS-Modus mit deinen Kontakten ein. Ein Tippen löst einen dreifachen Alarm aus (Push, SMS, Anruf).' },
      { type: 'rule', icon: '📱', text: 'Fotografiere das Kennzeichen und sende es jemandem, bevor du einsteigst.' },
      { type: 'rule', icon: '🎒', text: 'Halte deinen Rucksack griffbereit (auf dem Schoß oder zu deinen Füßen), nie im Kofferraum.' },
      { type: 'sub', title: 'Landestipps' },
      { type: 'rule', icon: '🤝', text: 'Malawier sind für ihren herzlichen Empfang bekannt. Der Kontakt entsteht ganz natürlich.' },
      { type: 'rule', icon: '🌊', text: 'Der Malawisee ist das Juwel des Landes. Die Straßen entlang des Sees sind angenehm und gut befahren.' },
      { type: 'sub', title: 'Notrufnummern' },
      { type: 'kv', items: [{ k: 'Polizei', v: '997' }, { k: 'Krankenwagen', v: '998' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [{ type: 'text', text: 'Sicher für Frauen. "The Warm Heart of Africa" gilt für alle.' }] },
    language: { filterTypes: ['c', 'q'], blocks: [{ type: 'text', text: 'Englisch und Chichewa Amtssprachen. Englisch gut gesprochen.' }, { type: 'phrase', items: [{ local: 'Moni', meaning: 'Hallo' }, { local: 'Zikomo', meaning: 'Danke' }] }] },
    budget: { filterTypes: ['b', 'q'], blocks: [{ type: 'text', text: 'Sehr günstig. Budget: 10-20 €/Tag. Nsima mit Beilage: < 1 €.' }] },
    sleep: { filterTypes: ['b', 'q'], blocks: [{ type: 'text', text: 'Lodges: 5-15 €. Camping an Stränden des Malawisees: wunderschön.' }] },
    transport: { filterTypes: ['c', 'b'], blocks: [{ type: 'transport', items: [{ emoji: '🚐', name: 'Minibus', detail: 'Haupttransport, wartet bis voll', price: '1-5 €' }, { emoji: '⛴️', name: 'Ilala-Fähre', detail: 'Mythische Fähre auf dem See (3 Tage)', price: '5-20 €' }] }] },
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [{ name: 'Jan', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mär', level: 'ok' }, { name: 'Apr', level: 'good' }, { name: 'Mai', level: 'great' }, { name: 'Jun', level: 'great' }, { name: 'Jul', level: 'great' }, { name: 'Aug', level: 'great' }, { name: 'Sep', level: 'great' }, { name: 'Okt', level: 'great' }, { name: 'Nov', level: 'good' }, { name: 'Dez', level: 'ok' }] },
      { type: 'text', text: 'Mai-Okt: Trockenzeit, ideal. See ganzjährig badbar (24-28°C).' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [{ type: 'text', text: '"The Warm Heart of Africa" ist kein leerer Slogan. Malawisee = Süßwasserparadies. Gule Wamkulu (Maskentanz der Chewa, UNESCO).' }] },
  },
}
