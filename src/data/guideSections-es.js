/**
 * Enriched guide sections (v17) — Spanish translation
 * Data verified from 200+ sources across FR/EN/DE/NL/ES
 * Rule: only included if confirmed by 3+ independent sources
 * If insufficient data → section omitted (displayed as "no data" in UI)
 */

export const guideSectionsData = {
  // ==================== FRANCE ====================
  FR: {
    laws: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'El autostop es legal en Francia. La prohibición se aplica a las autopistas en sí (carriles de circulación, arcenes de emergencia, rampas de acceso). Las áreas de descanso, peajes y estaciones de servicio están permitidos.' },
      { type: 'sub', title: 'Dónde está permitido' },
      { type: 'rule', icon: '✅', text: 'Áreas de peaje: el spot clásico francés. Los coches reducen la velocidad y puedes hablar con los conductores.' },
      { type: 'rule', icon: '✅', text: 'Estaciones de servicio de autopista (áreas de servicio)' },
      { type: 'rule', icon: '✅', text: 'Salidas de ciudad, rotondas antes de las autopistas' },
      { type: 'rule', icon: '✅', text: 'Carreteras nacionales y departamentales (RN, RD)' },
      { type: 'sub', title: 'Dónde está prohibido' },
      { type: 'rule', icon: '🚫', text: 'En los carriles de la autopista (A1, A6, A7...)' },
      { type: 'rule', icon: '🚫', text: 'En las rampas de acceso' },
      { type: 'rule', icon: '🚫', text: 'En los arcenes de emergencia' },
      { type: 'sub', title: 'Multas' },
      { type: 'text', text: 'Multa de 11 a 40 € en teoría, pero las sanciones son muy raras (~5% de los casos). En la práctica, la policía te lleva a un lugar autorizado. Algunos gendarmes son simpáticos e incluso hacen autostop por ti.' },
      { type: 'tip', text: '💡 En Bretaña, las autopistas son gratuitas (sin peajes). Usa las estaciones de servicio o las salidas de ciudades.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Francia es un país fácil para el autostop. Tiempo de espera promedio: 30 a 45 min en verano, hasta 1h en invierno. La técnica de las áreas de peaje es tremendamente eficaz: avanzas de barrera en barrera.' },
      { type: 'sub', title: 'La técnica de los peajes' },
      { type: 'text', text: 'El método estrella en Francia. Colócate en el lado de salida del peaje con un cartel indicando la próxima ciudad o área. Los coches van al paso, puedes hablar con los conductores. Pregunta directamente: "Vous allez vers Lyon ?" Es más eficaz que esperar con el pulgar.' },
      { type: 'sub', title: 'Estaciones de servicio' },
      { type: 'text', text: 'Las estaciones de servicio de autopista son los segundos mejores spots. Compra un pequeño café para convertirte en cliente si el personal te pide que te vayas. Puedes abordar a los conductores directamente.' },
      { type: 'sub', title: 'Truco de las matrículas' },
      { type: 'text', text: 'Los dos últimos dígitos de la matrícula indican el departamento de matriculación: 75 = París, 13 = Marsella, 69 = Lyon, 33 = Burdeos, 31 = Toulouse. Menos fiable desde 2009 (elección libre del número) pero aún útil.' },
      { type: 'sub', title: 'Zonas a evitar' },
      { type: 'kv', items: [
        { k: 'Isla de Francia', v: 'Muy difícil a la salida de París', color: 'red' },
        { k: 'Periférico / A86', v: 'Imposible, demasiado tráfico', color: 'red' },
      ]},
      { type: 'tip', text: '💡 Los conductores suelen ofrecer dinero (5 a 60 €) o comidas. Los domingos, solo circulan los camiones de congelados.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Francia es un país seguro para el autostop. La cultura del dedo ha declinado desde los años 90 pero sigue bien aceptada, especialmente en zonas rurales y en el sur.' },
      { type: 'sub', title: 'Reglas básicas' },
      { type: 'rule', icon: '📱', text: 'Fotografía la matrícula y envíala a un conocido antes de subir.' },
      { type: 'rule', icon: '🎒', text: 'Mantén tus pertenencias accesibles, no en el maletero.' },
      { type: 'rule', icon: '🌙', text: 'Evita hacer autostop de noche en carreteras desiertas.' },
      { type: 'sub', title: 'Números de emergencia' },
      { type: 'kv', items: [
        { k: 'SAMU (urgencia médica)', v: '15' },
        { k: 'Policía', v: '17' },
        { k: 'Bomberos', v: '18' },
        { k: 'Número europeo', v: '112' },
      ]},
      { type: 'info', text: '📍 Activa el modo Compañero SpotHitch para compartir tu posición en tiempo real.' },
    ]},
    women: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'Francia es generalmente segura para las mujeres que hacen autostop solas, especialmente en el sur y las zonas rurales. Las mujeres son recogidas más rápido que los hombres. Viajeras experimentadas confirman pocos incidentes.' },
      { type: 'rule', icon: '👨‍👩‍👧', text: 'Prefiere coches con parejas, familias o mujeres conductoras.' },
      { type: 'rule', icon: '📍', text: 'Menciona que alguien sabe dónde estás.' },
      { type: 'rule', icon: '🚗', text: 'Evita coches con varios hombres cuando estés sola.' },
      { type: 'text', text: 'Las áreas de peaje son los spots más seguros: bien iluminados, con paso de gente, y puedes evaluar al conductor antes de subir.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'El francés es indispensable. La mayoría de los franceses hablan poco inglés, especialmente en zonas rurales. Unas pocas palabras en francés lo cambian todo: los conductores aprecian el esfuerzo.' },
      { type: 'phrase', items: [
        { local: 'Bonjour, vous allez vers... ?', meaning: 'Para abordar a los conductores' },
        { local: 'Je fais du stop', meaning: 'Estoy haciendo autostop' },
        { local: 'Merci beaucoup, bonne route !', meaning: 'Al bajar del coche' },
        { local: 'Je peux descendre ici', meaning: 'Puedo bajarme aquí' },
      ]},
      { type: 'tip', text: '💡 A veces hay mapas de carreteras gratuitos en las cabinas de peaje. Tener un mapa en papel es útil en caso de que se agote la batería.' },
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Presupuesto medio: 20 a 40 €/día. Presupuesto ajustado posible a 10 a 15 €/día con acampada libre y compras en supermercado. Los conductores suelen invitar a comer.' },
      { type: 'kv', items: [
        { k: 'Albergue juvenil', v: '15-30 €/noche' },
        { k: 'Camping municipal', v: '5-12 €/noche' },
        { k: 'Baguette + queso', v: '2-3 €' },
        { k: 'Menú del día en restaurante', v: '12-15 €' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'La acampada libre está técnicamente prohibida en Francia, pero tolerada en montaña y en zonas rurales si eres discreto, lejos de las viviendas, y te vas temprano. Estrictamente prohibida en el litoral, en los parques nacionales y a menos de 200 m de un punto de agua.' },
      { type: 'rule', icon: '⛺', text: 'Campings municipales: 5 a 12 €/noche, a menudo bien situados.' },
      { type: 'rule', icon: '🏠', text: 'Warmshowers (cicloturistas) y Couchsurfing siguen activos en Francia.' },
      { type: 'rule', icon: '🌿', text: 'Vivac tolerado en montaña: instálate después de las 19h, vete antes de las 9h.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚄', name: 'TGV', detail: 'Red rápida pero cara. Reserva con antelación para precios bajos.', price: '10-120 €' },
        { emoji: '🚌', name: 'FlixBus / BlaBlaBus', detail: 'Líneas de larga distancia económicas', price: '5-30 €' },
        { emoji: '🚗', name: 'BlaBlaCar', detail: 'Coche compartido muy popular en Francia, a menudo 50% más barato que el tren', price: '5-40 €' },
        { emoji: '🚃', name: 'TER', detail: 'Trenes regionales, tarifas reducidas los fines de semana en algunas regiones', price: '5-25 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Ene', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mar', level: 'ok' },
        { name: 'Abr', level: 'good' }, { name: 'May', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Ago', level: 'great' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'ok' }, { name: 'Dic', level: 'bad' },
      ]},
      { type: 'text', text: 'Mayo a septiembre: ideal. El verano es la temporada alta con mucho tráfico vacacional. El sur (Provenza, Costa Azul) es practicable casi todo el año. El invierno en montaña no es recomendable.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'La cultura del autostop en Francia tiene una larga historia. Los mochileros de los años 70 y 80 popularizaron la práctica. Hoy es menos común pero bien aceptada. Los franceses son curiosos y les gusta conversar durante el trayecto. La comida compartida es un momento clave de convivencia.' },
      { type: 'event', items: [
        { month: 'Jun', day: '21', name: 'Fête de la Musique', desc: 'Conciertos gratuitos por todas partes. Ambiente festivo, mucha circulación.' },
        { month: 'Jul', day: '14', name: 'Fiesta nacional', desc: 'Fuegos artificiales por todas partes. Gran tráfico el fin de semana alrededor.' },
        { month: 'Jul-Ago', day: '⟳', name: 'Grandes salidas', desc: 'Cruces en las autopistas. Mucho tráfico = más oportunidades.' },
      ]},
    ]},
  },
  // ==================== GERMANY ====================
  DE: {
    laws: {
      filterTypes: ['q', 'c', 'a'],
      blocks: [
        { type: 'text', text: 'El autostop es legal en Alemania. La única prohibición se aplica a la Autobahn en sí (carriles de circulación y arcén de emergencia) así como a las Kraftfahrstrassen (vías rápidas).' },
        { type: 'sub', title: 'Dónde está permitido' },
        { type: 'rule', icon: '✅', text: 'Raststätten (áreas de servicio con gasolinera en la Autobahn)' },
        { type: 'rule', icon: '✅', text: 'Autohof (gasolineras accesibles desde la Autobahn pero situadas fuera)' },
        { type: 'rule', icon: '✅', text: 'Rampas de acceso antes de la señal azul de la Autobahn' },
        { type: 'rule', icon: '✅', text: 'Semáforos en rojo que llevan a entradas de autopista en ciudad' },
        { type: 'sub', title: 'Dónde está prohibido' },
        { type: 'rule', icon: '🚫', text: 'En los carriles de la Autobahn (la policía llega en minutos)' },
        { type: 'rule', icon: '🚫', text: 'En los arcenes de emergencia' },
        { type: 'rule', icon: '🚫', text: 'En las Kraftfahrstrassen (vías rápidas)' },
        { type: 'sub', title: 'Multas' },
        { type: 'text', text: 'Multa de 20 a 50 € si te pillan en la Autobahn. En la práctica, la policía simplemente te lleva a un lugar autorizado. Fingir que no lo sabías suele funcionar.' },
        { type: 'sub', title: 'Estaciones de servicio' },
        { type: 'text', text: 'Las Raststätten son técnicamente propiedad privada. El personal puede pedirte que te vayas, pero en la práctica es raro. Si ocurre, desplázate al aparcamiento.' },
        { type: 'tip', text: '💡 Los camiones no tienen derecho a circular los domingos y festivos antes de las 22h. El tráfico se reduce esos días.' },
      ],
    },
    hitchhiking: {
      filterTypes: ['q', 'c', 'b'],
      blocks: [
        { type: 'text', text: 'Alemania es uno de los mejores países de Europa para el autostop. El tiempo de espera medio es de unos 15 minutos. Abordando a los conductores en las gasolineras, a menudo basta con preguntar a 1 a 3 personas para encontrar un viaje.' },
        { type: 'sub', title: 'Los mejores tipos de spots' },
        { type: 'rule', icon: '🥇', text: 'Raststätten (áreas de servicio con gasolinera). Abordar a los conductores directamente mientras repostan es el método más eficaz.' },
        { type: 'rule', icon: '🥈', text: 'Rampas de acceso. Colócate antes de la señal azul de la Autobahn.' },
        { type: 'rule', icon: '🥉', text: 'Semáforos en rojo en ciudad que llevan a la autopista. Puedes hablar con los conductores por la ventanilla.' },
        { type: 'sub', title: 'Velocidad y distancias' },
        { type: 'text', text: 'Sin límite de velocidad en muchos tramos de Autobahn. Es posible recorrer más de 1000 km en un día encadenando Raststätten. Velocidad media estimada: 50 km/h en verano, 40 km/h en invierno.' },
        { type: 'sub', title: 'Zonas a evitar' },
        { type: 'kv', items: [
          { k: 'Zona del Ruhr (Dortmund, Essen, Duisburg)', v: 'Muy difícil', color: 'red' },
          { k: 'Baviera y Baden-Wurtemberg', v: 'Más controles policiales', color: 'amber' },
        ]},
        { type: 'sub', title: 'Truco de las matrículas' },
        { type: 'text', text: 'Las matrículas alemanas empiezan con la abreviatura de la ciudad de matriculación (B = Berlín, HH = Hamburgo, M = Múnich). Puede ayudar a adivinar la dirección del conductor, pero desde que el cambio de matrícula ya no es obligatorio al mudarse, es menos fiable.' },
        { type: 'tip', text: '💡 Un cartel humorístico (ej: "Tokyo") funciona como rompehielos. Los alemanes aprecian el humor.' },
      ],
    },
    safety: {
      filterTypes: ['c', 'a'],
      blocks: [
        { type: 'text', text: 'Alemania es un país seguro para el autostop. Los actos criminales relacionados con el autostop son extremadamente raros.' },
        { type: 'sub', title: 'Reglas básicas' },
        { type: 'rule', icon: '📱', text: 'Fotografía la matrícula y envíala a un conocido antes de subir.' },
        { type: 'rule', icon: '🎒', text: 'Mantén tus pertenencias accesibles, no en el maletero.' },
        { type: 'rule', icon: '🌙', text: 'Evita hacer autostop de noche.' },
        { type: 'rule', icon: '🚪', text: 'Comprueba que el seguro para niños de las puertas traseras no esté activado.' },
        { type: 'sub', title: 'Números de emergencia' },
        { type: 'kv', items: [
          { k: 'Emergencias / Bomberos', v: '112' },
          { k: 'Policía', v: '110' },
        ]},
        { type: 'info', text: '📍 Activa el modo Compañero SpotHitch para compartir tu posición en tiempo real.' },
      ],
    },
    women: {
      filterTypes: ['q', 'c', 'a'],
      blocks: [
        { type: 'text', text: 'Alemania está considerada como uno de los países más seguros de Europa para las mujeres que hacen autostop solas. Varias viajeras experimentadas lo confirman. Las mujeres generalmente son recogidas más rápido que los hombres.' },
        { type: 'sub', title: 'Consejos' },
        { type: 'rule', icon: '👨‍👩‍👧', text: 'Prefiere viajes con parejas, familias o mujeres conductoras.' },
        { type: 'rule', icon: '📍', text: 'Menciona discretamente que alguien sabe dónde estás y espera noticias tuyas.' },
        { type: 'rule', icon: '👁️', text: 'Confía en tu instinto. Rechaza sin dudar si algo no va bien.' },
        { type: 'rule', icon: '🚗', text: 'Evita coches con varios hombres cuando estés sola.' },
        { type: 'text', text: 'Viajeras que han recorrido toda Europa durante más de un año reportan no haber tenido prácticamente ninguna experiencia negativa. Alemania es regularmente citada entre los países más seguros.' },
      ],
    },
    language: {
      filterTypes: ['c', 'q'],
      blocks: [
        { type: 'text', text: 'El idioma oficial es el alemán. Alemania ocupa el 4º puesto mundial en dominio del inglés. Muchos conductores hablan inglés, especialmente los jóvenes y en zonas urbanas. Sin embargo, los camioneros (a menudo polacos o de Europa del Este) raramente hablan otra cosa que su idioma y algo de alemán.' },
        { type: 'sub', title: 'Frases útiles' },
        { type: 'phrase', items: [
          { local: 'Hallo, ich fahre nach...', meaning: 'Hola, voy a...' },
          { local: 'Können Sie mich mitnehmen?', meaning: '¿Puede llevarme?' },
          { local: 'Danke für die Mitfahrt!', meaning: '¡Gracias por el viaje!' },
          { local: 'Können Sie mich hier rauslassen?', meaning: '¿Puede dejarme aquí?' },
        ]},
        { type: 'tip', text: '💡 Mira las matrículas para adivinar el idioma del conductor y dirígete a él en su idioma presumido.' },
      ],
    },
    budget: {
      filterTypes: ['b', 'q'],
      blocks: [
        { type: 'text', text: 'Presupuesto mochilero en Alemania: alrededor de 50 a 70 € por día. Haciendo autostop y durmiendo en casas de locales, se puede bajar a menos de 30 €.' },
        { type: 'sub', title: 'Comer barato' },
        { type: 'rule', icon: '🌭', text: 'Currywurst o döner kebab: 3 a 5 €. Es la comida básica del viajero en Alemania.' },
        { type: 'rule', icon: '🥨', text: 'Panaderías: pretzel + café por 3 a 5 €.' },
        { type: 'rule', icon: '🛒', text: 'Lidl (cadena alemana), Aldi, Netto, Penny: supermercados discount presentes en todas partes.' },
        { type: 'rule', icon: '⛽', text: 'Evita la comida de las gasolineras (cara). La Bockwurst es la mejor relación calidad-precio. El agua de los grifos de carretera es gratuita.' },
        { type: 'sub', title: 'Generosidad de los conductores' },
        { type: 'text', text: 'Varios viajeros reportan que los conductores alemanes insisten en invitar a una comida o un té. Los camioneros a menudo invitan a comer con ellos.' },
        { type: 'tip', text: '💡 La app Foodsharing.de permite recoger gratis comida que los supermercados y panaderías iban a tirar.' },
      ],
    },
    sleep: {
      filterTypes: ['b', 'q', 'a'],
      blocks: [
        { type: 'text', text: 'La acampada libre con tienda está prohibida en Alemania. El vivac sin tienda (saco de dormir en el suelo) se tolera por una noche, excepto en las reservas naturales.' },
        { type: 'sub', title: 'Excepciones legales' },
        { type: 'rule', icon: '✅', text: 'Brandeburgo y Mecklemburgo-Pomerania Occidental: una noche autorizada para viajeros no motorizados.' },
        { type: 'rule', icon: '✅', text: 'Schleswig-Holstein: ~20 sitios de vivac oficiales.' },
        { type: 'rule', icon: '✅', text: 'Trekkingplätze (campamentos de trekking): 10 a 15 €/noche, algunos gratuitos.' },
        { type: 'sub', title: 'Multas' },
        { type: 'text', text: 'Multa de 10 a 250 € por acampada ilegal. En zonas protegidas, hasta 2.500 €.' },
        { type: 'sub', title: 'Alojamiento gratuito' },
        { type: 'rule', icon: '🛋️', text: 'TrustRoots: nacido de la comunidad de autostopistas, gratuito. BeWelcome (~120.000 usuarios), Couchers: también gratuitos.' },
        { type: 'rule', icon: '🛏️', text: 'Albergues juveniles (DJH): ~400 en toda Alemania, dormitorios 20 a 35 €/noche.' },
        { type: 'info', text: '🆘 mokli-help.de lista las duchas gratuitas y alojamientos de emergencia en las grandes ciudades alemanas.' },
      ],
    },
    transport: {
      filterTypes: ['c', 'b'],
      blocks: [
        { type: 'text', text: 'Alemania tiene una excelente red de transporte público y de coche compartido.' },
        { type: 'sub', title: 'Tren' },
        { type: 'transport', items: [
          { emoji: '🚄', name: 'Deutschlandticket', detail: 'Transporte regional ilimitado en todo el país (no ICE/IC)', price: '63 €/mes' },
          { emoji: '🚃', name: 'Schönes-Wochenende-Ticket', detail: '5 personas, trenes regionales, 1 día de fin de semana', price: '~7 €/pers.' },
          { emoji: '🚃', name: 'Länder-Ticket', detail: 'Trenes regionales en 1-2 Länder, válido 9h-3h', price: 'desde 25 €' },
        ]},
        { type: 'sub', title: 'Bus y coche compartido' },
        { type: 'transport', items: [
          { emoji: '🚌', name: 'FlixBus / FlixTrain', detail: '', price: 'desde 4,99 €' },
          { emoji: '🚗', name: 'BlaBlaCar', detail: '130 millones de miembros', price: '~5 €/100 km' },
          { emoji: '🤝', name: 'BesserMitfahren.de', detail: 'Gratuito, sin registro', price: 'gratuito' },
          { emoji: '🤝', name: 'Fahrgemeinschaft.de', detail: 'Gestionado por el ADAC, gratuito', price: 'gratuito' },
        ]},
      ],
    },
    season: {
      filterTypes: ['c', 'q'],
      blocks: [
        { type: 'text', text: 'El autostop funciona todo el año en Alemania, pero el verano ofrece las mejores condiciones: días más largos, más tráfico, distancias más largas por día.' },
        { type: 'sub', title: 'Resumen por mes' },
        { type: 'season', months: [
          { name: 'Ene', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mar', level: 'ok' },
          { name: 'Abr', level: 'good' }, { name: 'May', level: 'great' }, { name: 'Jun', level: 'great' },
          { name: 'Jul', level: 'great' }, { name: 'Ago', level: 'good' }, { name: 'Sep', level: 'great' },
          { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'ok' }, { name: 'Dic', level: 'bad' },
        ]},
        { type: 'sub', title: 'Detalle' },
        { type: 'rule', icon: '☀️', text: 'Abril a septiembre: ideal. Días largos, buen tiempo, mucho tráfico.' },
        { type: 'rule', icon: '🍂', text: 'Octubre: aún bueno, los colores de otoño son un bonus.' },
        { type: 'rule', icon: '❄️', text: 'Noviembre a marzo: difícil. Oscurece pronto (17h), frío, neumáticos de nieve obligatorios de noviembre a marzo/abril.' },
        { type: 'warn', text: '⚠️ Evita los sábados por la noche y domingos en los Autohof (estaciones de camiones): los camiones no circulan los domingos antes de las 22h, el tráfico es muy bajo.' },
      ],
    },
    culture: {
      filterTypes: ['c', 'b'],
      blocks: [
        { type: 'text', text: 'Los alemanes pueden parecer desconfiados al principio, pero una vez establecido el contacto son cálidos. Muchos conductores que paran hicieron autostop cuando eran jóvenes.' },
        { type: 'sub', title: 'Lo que funciona' },
        { type: 'rule', icon: '😊', text: 'Apariencia cuidada y sonrisa. Los alemanes son sensibles a la presentación.' },
        { type: 'rule', icon: '📋', text: 'Un cartel legible es esencial. Los destinos intermedios funcionan mejor que el destino final.' },
        { type: 'rule', icon: '🗣️', text: 'Unas pocas palabras en alemán marcan una gran diferencia, incluso si el conductor habla inglés.' },
        { type: 'sub', title: 'Mitfahrbank' },
        { type: 'text', text: 'Alemania inventó los Mitfahrbank: bancos públicos instalados por los municipios con carteles de dirección, donde los automovilistas saben que un pasajero espera un viaje. Más de 20 territorios los tienen desde mediados de los años 2010.' },
        { type: 'sub', title: 'Carreras de autostop' },
        { type: 'text', text: 'El Tramprennen (carrera de autostop) existe desde 2008. Más de 100 participantes, ~2000 km en equipo a través de Europa, organizado por Club of Roam. Abgefahren e.V. también organiza el campeonato alemán de autostop.' },
        { type: 'sub', title: 'Eventos' },
        { type: 'event', items: [
          { month: 'Feb', day: '⟳', name: 'Karneval', desc: 'Carnaval renano (Colonia, Düsseldorf, Mainz). Ambiente festivo.' },
          { month: 'Abr', day: '⟳', name: 'Ostern', desc: 'Pascua. Mercados de Pascua, familias en las carreteras.' },
          { month: 'Jun', day: '⟳', name: 'Fête de la Musique', desc: 'Conciertos gratuitos en las grandes ciudades.' },
          { month: 'Sep-Oct', day: '⟳', name: 'Oktoberfest', desc: 'Múnich, 6 millones de visitantes. Tráfico intenso hacia Baviera.' },
          { month: 'Nov-Dic', day: '⟳', name: 'Weihnachtsmärkte', desc: 'Mercados navideños en todas las ciudades. Núremberg, Dresde, Colonia.' },
        ]},
        { type: 'tip', text: '💡 En Alemania, algunos conductores habituales recogen autostopistas con mucha frecuencia. La cultura del autostop está bien arraigada entre los conductores mayores.' },
      ],
    },
  },

  // ==================== BELGIUM ====================
  BE: {
    laws: {
      filterTypes: ['q', 'c', 'a'],
      blocks: [
        { type: 'text', text: 'El autostop es legal en Bélgica. No hay una regulación específica. Prohibido en las autopistas en sí, permitido en áreas de servicio y aparcamientos.' },
        { type: 'sub', title: 'Bueno saberlo' },
        { type: 'text', text: 'Las autopistas belgas usan números E (E40, E19, E411) y no números nacionales. Los automovilistas belgas no reconocen los números A.' },
        { type: 'text', text: 'La ministra de Movilidad de Bruselas, Elke Van den Brandt, animó públicamente a la gente a hacer autostop para ir al trabajo.' },
      ],
    },
    hitchhiking: {
      filterTypes: ['q', 'c', 'b'],
      blocks: [
        { type: 'text', text: 'Bélgica es considerada uno de los mejores países de Europa para el autostop. Con un cartel, el tiempo de espera medio es de unos 10 minutos. La densidad de gasolineras es muy alta.' },
        { type: 'sub', title: 'Diferencias regionales' },
        { type: 'kv', items: [
          { k: 'Flandes (norte, neerlandófono)', v: 'Muy fácil', color: 'green' },
          { k: 'Bruselas', v: 'Fácil', color: 'green' },
          { k: 'Valonia (sur, francófono)', v: 'Más difícil', color: 'amber' },
        ]},
        { type: 'text', text: 'En Flandes, la densidad de población, carreteras y gasolineras es más alta. En Valonia, es más comparable a Francia: se necesita más paciencia.' },
        { type: 'sub', title: 'Salir de Bruselas' },
        { type: 'text', text: 'Desde Delta (nudo metro/tranvía/bus cerca de la ULB), es fácil partir hacia Namur y Luxemburgo. Muchos extranjeros que trabajan en Bélgica hacen accesibles los viajes internacionales.' },
        { type: 'tip', text: '💡 Si esperas más de una hora, cambia de spot. Mantén 100 metros entre tu posición y el punto de recogida para que los coches tengan tiempo de parar.' },
      ],
    },
    safety: {
      filterTypes: ['c', 'a'],
      blocks: [
        { type: 'text', text: 'Bélgica es considerada uno de los países más seguros para el autostop en Europa. Los belgas son descritos como acogedores y dispuestos a llevar a extranjeros.' },
        { type: 'sub', title: 'Consejos de la policía belga' },
        { type: 'text', text: 'La inspectora Sofie Lenaerts (presentadora de seguridad vial) recomienda: evitar el autostop de noche, rechazar a conductores ebrios, viajar en pareja cuando sea posible, usar apps de localización (Family Track, Glympse, Find My).' },
        { type: 'sub', title: 'Números de emergencia' },
        { type: 'kv', items: [
          { k: 'Emergencias europeo', v: '112' },
          { k: 'Policía belga', v: '101' },
        ]},
        { type: 'text', text: 'La mayoría de las gasolineras están abiertas 24h con personal simpático. Puedes echar una siesta si te quedas tirado de noche.' },
      ],
    },
    women: {
      filterTypes: ['q', 'c', 'a'],
      blocks: [
        { type: 'text', text: 'Las fuentes neerlandófonas reportan que las mujeres que hacen autostop son recogidas más rápidamente que los hombres: los automovilistas se preocupan por su seguridad y paran más rápido.' },
        { type: 'text', text: 'Los comentarios son muy mayoritariamente positivos. Es raro que un viaje salga mal. Se aplican las mismas reglas de seguridad que en todas partes: confía en tu instinto, envía la matrícula a un conocido, evita la noche.' },
      ],
    },
    language: {
      filterTypes: ['c', 'q'],
      blocks: [
        { type: 'text', text: 'Bélgica tiene tres idiomas oficiales: el neerlandés (Flandes/norte), el francés (Valonia/sur) y el alemán (pequeña región del este). Bruselas es mayoritariamente francófona. El inglés se habla bien, especialmente en Flandes y entre los jóvenes.' },
        { type: 'sub', title: 'Truco lingüístico' },
        { type: 'text', text: 'Saluda con ambos idiomas ("Dag" en neerlandés + "Bonjour" en francés) para cubrir ambas regiones. Preséntate como extranjero para evitar tensiones lingüísticas. Mira los adhesivos del concesionario en el coche para adivinar la región del conductor.' },
        { type: 'warn', text: '⚠️ No menciones ser valón en Flandes: algunos conductores flamencos podrían no parar. Mejor presentarse como extranjero.' },
      ],
    },
    budget: {
      filterTypes: ['b', 'q'],
      blocks: [
        { type: 'text', text: 'Presupuesto mochilero en Bélgica: alrededor de 48 € por día, mínimo 22 € para los más ahorradores.' },
        { type: 'sub', title: 'Comer barato' },
        { type: 'rule', icon: '🍟', text: 'Frietkot (fritería belga): por 5 € tienes una comida más abundante y barata que un McDonald\'s.' },
        { type: 'rule', icon: '🍺', text: 'La cerveza suele ser más barata que el agua o el refresco.' },
        { type: 'rule', icon: '🛒', text: 'Supermercados discount: Lidl, Aldi, Colruyt.' },
        { type: 'warn', text: '⚠️ La comida en las áreas de autopista es muy cara. Compra en la ciudad antes.' },
      ],
    },
    sleep: {
      filterTypes: ['b', 'q', 'a'],
      blocks: [
        { type: 'text', text: 'La acampada libre está prohibida en Bélgica. Multa posible hasta 150 €.' },
        { type: 'sub', title: 'Alternativas legales' },
        { type: 'rule', icon: '✅', text: 'Zonas de vivac oficiales en las Ardenas: noche gratuita, máximo 48h.' },
        { type: 'rule', icon: '✅', text: 'Welcome To My Garden: red donde particulares ofrecen su jardín para acampar gratis. Disponible incluso en Bruselas.' },
        { type: 'rule', icon: '✅', text: 'Gasolineras abiertas 24h: el personal es simpático, puedes echar una siesta.' },
        { type: 'sub', title: 'Alojamiento' },
        { type: 'kv', items: [
          { k: 'Albergues juveniles (Bruselas)', v: '30 a 50 €/noche' },
          { k: 'Albergues (Gante, Brujas)', v: '~24 €/noche' },
        ]},
      ],
    },
    transport: {
      filterTypes: ['c', 'b'],
      blocks: [
        { type: 'text', text: 'Bélgica tiene opciones de transporte interesantes y un sistema de autostop organizado único.' },
        { type: 'sub', title: 'Autostop organizado' },
        { type: 'transport', items: [
          { emoji: '🤝', name: 'Covoit\'Stop', detail: 'Provincia de Lieja (16 municipios). Inscripción, carta firmada, antecedentes verificados', price: 'gratuito' },
        ]},
        { type: 'sub', title: 'Tren' },
        { type: 'transport', items: [
          { emoji: '🚃', name: 'SNCB Weekend Ticket', detail: '30% de descuento sáb/dom/festivos', price: 'desde ~10 €' },
          { emoji: '🚃', name: 'SNCB menores de 26 años', detail: '40% de descuento estándar', price: '' },
          { emoji: '👶', name: 'Niños < 12 años', detail: 'Gratis (máx. 4 por adulto pagante)', price: 'gratuito' },
        ]},
        { type: 'sub', title: 'Bus y coche compartido' },
        { type: 'transport', items: [
          { emoji: '🚌', name: 'FlixBus', detail: '', price: 'desde 5 €' },
          { emoji: '🚗', name: 'BlaBlaCar', detail: 'Muy popular en Bélgica', price: '' },
        ]},
      ],
    },
    culture: {
      filterTypes: ['c', 'b'],
      blocks: [
        { type: 'text', text: 'Los belgas son muy acogedores con los viajeros, especialmente los extranjeros. El autostop funciona mejor con belgas que con franceses u holandeses que solo atraviesan el país.' },
        { type: 'sub', title: 'Consejos' },
        { type: 'rule', icon: '😊', text: 'Sonríe en toda circunstancia, incluso después de horas de espera.' },
        { type: 'rule', icon: '🗣️', text: 'Habla brevemente con el conductor para conoceros antes de subir, luego confía en tu instinto.' },
        { type: 'rule', icon: '🎒', text: 'Si nunca has hecho autostop, Bélgica es recomendada como país para empezar. Comienza con trayectos cortos.' },
        { type: 'sub', title: 'Eventos' },
        { type: 'event', items: [
          { month: 'Feb', day: '⟳', name: 'Carnaval de Binche', desc: 'Patrimonio UNESCO, los Gilles lanzan naranjas.' },
          { month: 'Jul', day: '21', name: 'Fiesta nacional belga', desc: 'Festividades y fuegos artificiales en Bruselas.' },
          { month: 'Jul', day: '⟳', name: 'Tomorrowland', desc: 'Festival electro mundial en Boom, 400.000 visitantes.' },
          { month: 'Ago', day: '⟳', name: 'Gentse Feesten', desc: '10 días de festividades gratuitas en Gante.' },
          { month: 'Dic', day: '⟳', name: 'Mercados navideños', desc: 'Bruselas, Brujas, Lieja. Muy populares.' },
        ]},
      ],
    },
  },

  // ==================== NETHERLANDS ====================
  NL: {
    laws: {
      filterTypes: ['q', 'c', 'a'],
      blocks: [
        { type: 'text', text: 'El autostop es legal en los Países Bajos. La idea básica: donde tengas derecho a caminar, puedes hacer autostop. Prohibido en las autopistas (snelweg) en sí.' },
        { type: 'sub', title: 'Spots oficiales: los Liftershalte' },
        { type: 'text', text: 'Los Países Bajos son el único país del mundo con paradas de autostop oficiales (Liftershalte) señalizadas con carteles. Se encuentran en Ámsterdam, Groningen, Utrecht, Zoetermeer, Maastricht y en varias provincias.' },
      ],
    },
    hitchhiking: {
      filterTypes: ['q', 'c', 'b'],
      blocks: [
        { type: 'text', text: 'Los Países Bajos son un país fácil para el autostop. El tiempo de espera medio es de 5 a 45 minutos según el spot. En un buen emplazamiento, la espera puede bajar a menos de 10 minutos.' },
        { type: 'sub', title: 'Método' },
        { type: 'text', text: 'Muchos automovilistas no pararán si haces dedo al borde de la carretera, pero te llevarán si les preguntas directamente en la gasolinera. Abordar a los conductores en persona es claramente más eficaz.' },
        { type: 'sub', title: 'Limitaciones' },
        { type: 'text', text: 'La mayoría de los trayectos son de menos de 50 km. A menudo se necesitan varios viajes para atravesar el país. Las carreteras secundarias son estrechas, sin arcén, con setos que separan los campos de la carretera.' },
        { type: 'sub', title: 'Mejores momentos' },
        { type: 'kv', items: [
          { k: 'Mañanas y tardes entre semana', v: 'Ideal', color: 'green' },
          { k: 'Sábados y domingos por la tarde', v: 'Malo (familias en coche)', color: 'red' },
          { k: 'Noche', v: 'A evitar', color: 'red' },
        ]},
        { type: 'tip', text: '💡 La mayoría de los automovilistas holandeses están abiertos a la idea de llevar a un autostopista.' },
      ],
    },
    safety: {
      filterTypes: ['c', 'a'],
      blocks: [
        { type: 'text', text: 'Los Países Bajos son uno de los países más seguros del mundo para el autostop. Los comentarios de experiencia son muy mayoritariamente positivos: es raro que un viaje salga mal.' },
        { type: 'sub', title: 'Números de emergencia' },
        { type: 'kv', items: [
          { k: 'Emergencias', v: '112' },
        ]},
        { type: 'text', text: 'La tecnología moderna (GPS, WhatsApp, localización) ha hecho el autostop más seguro que nunca.' },
      ],
    },
    women: {
      filterTypes: ['q', 'c', 'a'],
      blocks: [
        { type: 'text', text: 'Los Países Bajos son regularmente citados entre los países más seguros del mundo para viajeras solas. Las mujeres que hacen autostop constatan que los automovilistas paran más rápido por ellas, a menudo por preocupación por su seguridad.' },
        { type: 'text', text: 'Las pocas experiencias negativas no compensan los cientos o miles de experiencias positivas.' },
      ],
    },
    language: {
      filterTypes: ['c', 'q'],
      blocks: [
        { type: 'text', text: 'El neerlandés es el idioma oficial. Los Países Bajos ocupan el 1er puesto mundial en dominio del inglés. Casi todo el mundo habla inglés con fluidez.' },
        { type: 'sub', title: 'Frases útiles' },
        { type: 'phrase', items: [
          { local: 'Mag ik meerijden naar...?', meaning: '¿Puedo viajar con usted hacia...?' },
          { local: 'Bedankt voor de lift!', meaning: '¡Gracias por el viaje!' },
        ]},
        { type: 'warn', text: '⚠️ Evita hablar alemán a los holandeses. A muchos no les gusta y podrían no parar.' },
      ],
    },
    budget: {
      filterTypes: ['b', 'q'],
      blocks: [
        { type: 'text', text: 'Presupuesto mochilero en los Países Bajos: alrededor de 50 a 70 € por día. Ámsterdam es notablemente más caro que el resto del país.' },
        { type: 'sub', title: 'Comer barato' },
        { type: 'rule', icon: '🧇', text: 'Comida callejera: stroopwafels, kibbeling (pescado frito), patatas fritas con mayonesa.' },
        { type: 'rule', icon: '🛒', text: 'Supermercados: Albert Heijn, Jumbo, Lidl. Buenos platos preparados.' },
        { type: 'tip', text: '💡 La app Too Good To Go permite recoger comida a precio reducido que los restaurantes y supermercados iban a tirar.' },
      ],
    },
    sleep: {
      filterTypes: ['b', 'q', 'a'],
      blocks: [
        { type: 'text', text: 'La acampada libre está prohibida en los Países Bajos. Multa: 140 €, pero la mayoría de las veces la policía simplemente te pide que recojas.' },
        { type: 'sub', title: 'Alternativa legal: Paalkamperen' },
        { type: 'text', text: 'El Paalkamperen (camping del poste) es un sistema legal donde postes marcados señalan emplazamientos de camping natural autorizados. Máximo 72h (a veces solo 1 noche según la zona).' },
        { type: 'sub', title: 'Alojamiento' },
        { type: 'kv', items: [
          { k: 'Stayokay (red HI holandesa)', v: 'desde 20 €/noche' },
          { k: 'Albergues Ámsterdam', v: '25 a 50 €/noche' },
        ]},
      ],
    },
    transport: {
      filterTypes: ['c', 'b'],
      blocks: [
        { type: 'text', text: 'Los Países Bajos tienen una excelente red de transporte público. El declive del autostop se debe en parte a que los estudiantes tienen un abono de transporte gratuito.' },
        { type: 'sub', title: 'Opciones' },
        { type: 'transport', items: [
          { emoji: '🚃', name: 'Samenreiskorting', detail: '40% de descuento si viajas con alguien que tiene abono', price: '' },
          { emoji: '🚌', name: 'FlixBus', detail: '', price: 'desde 5 €' },
          { emoji: '🚗', name: 'BlaBlaCar', detail: '', price: '' },
        ]},
        { type: 'sub', title: 'App' },
        { type: 'text', text: 'La app 9292 planifica todos los transportes públicos (tren, bus, tranvía, metro, ferry) y vende billetes electrónicos.' },
      ],
    },
    culture: {
      filterTypes: ['c', 'b'],
      blocks: [
        { type: 'text', text: 'Los holandeses son descritos como abiertos de mente y pragmáticos. Muchos conductores de mediana edad hicieron autostop durante sus estudios y devuelven el favor.' },
        { type: 'sub', title: 'Lo que funciona' },
        { type: 'rule', icon: '🧹', text: 'Apariencia cuidada. Un peine en el pelo y ropa limpia hacen milagros. Evita el look hippie.' },
        { type: 'rule', icon: '😊', text: 'No todo el mundo quiere conversar. Algunos solo quieren ofrecerte el viaje sin conversación. Respeta eso.' },
        { type: 'sub', title: 'Eventos' },
        { type: 'event', items: [
          { month: 'Abr', day: '27', name: 'Koningsdag', desc: 'Día del Rey. Todo el país de naranja, mercados, conciertos.' },
          { month: 'Abr-May', day: '⟳', name: 'Keukenhof', desc: 'Jardines de tulipanes. 7 millones de bulbos en flor.' },
          { month: 'Ago', day: '⟳', name: 'Gay Pride Ámsterdam', desc: 'Desfile de barcos por los canales.' },
          { month: 'Nov', day: '⟳', name: 'Sinterklaas', desc: 'Llegada de San Nicolás en barco, festividades nacionales.' },
        ]},
        { type: 'tip', text: '💡 La red de Liftershalte está en desarrollo en todo el país.' },
      ],
    },
  },

  // ==================== LUXEMBOURG ====================
  LU: {
    laws: {
      filterTypes: ['q', 'c'],
      blocks: [
        { type: 'text', text: 'El autostop es legal en Luxemburgo. Mismas reglas que el resto de la UE: prohibido en las autopistas, permitido en las áreas de servicio.' },
      ],
    },
    hitchhiking: {
      filterTypes: ['q', 'c', 'b'],
      blocks: [
        { type: 'text', text: 'Luxemburgo es excelente para los trayectos de larga distancia gracias a su posición central en la red de autopistas europea. Tiempo de espera a menudo inferior a 15 minutos, incluso por la tarde, incluso con 3 personas.' },
        { type: 'sub', title: 'El spot clave' },
        { type: 'text', text: 'El Área de Capellen Sur está considerada un paraíso para autostopistas. Se han conseguido viajes directos a Aviñón, Valencia (España) y Marruecos en menos de una hora.' },
        { type: 'sub', title: 'Limitaciones' },
        { type: 'text', text: 'Mucho tráfico en las autopistas viene de transfronterizos que llenan el depósito (combustible más barato). Son trayectos muy cortos. Usa un cartel direccional o mira las matrículas para filtrar.' },
        { type: 'text', text: 'A nivel local y en zonas rurales, poca gente hace autostop. El bus es gratis, así que no tiene sentido hacer dedo para desplazarse dentro del país.' },
      ],
    },
    safety: {
      filterTypes: ['c', 'a'],
      blocks: [
        { type: 'text', text: 'Luxemburgo es un país muy seguro. No hay datos específicos sobre incidentes relacionados con el autostop.' },
        { type: 'sub', title: 'Números de emergencia' },
        { type: 'kv', items: [
          { k: 'Emergencias europeo', v: '112' },
          { k: 'Policía', v: '113' },
        ]},
      ],
    },
    language: {
      filterTypes: ['c', 'q'],
      blocks: [
        { type: 'text', text: 'La mayoría de los luxemburgueses hablan con fluidez el luxemburgués, el francés, el alemán Y el inglés. La barrera del idioma es prácticamente inexistente. Es uno de los pocos países donde puedes comunicarte en casi cualquier idioma europeo.' },
      ],
    },
    budget: {
      filterTypes: ['b', 'q'],
      blocks: [
        { type: 'text', text: 'Luxemburgo es un país caro. Los restaurantes y alojamientos son costosos.' },
        { type: 'sub', title: 'Alojamiento' },
        { type: 'kv', items: [
          { k: 'Albergues juveniles', v: 'desde 12 a 20 €/noche' },
        ]},
        { type: 'tip', text: '💡 La gasolina es más barata en Luxemburgo que en los países vecinos. Por eso tantos transfronterizos llenan el depósito allí.' },
      ],
    },
    sleep: {
      filterTypes: ['b', 'q'],
      blocks: [
        { type: 'text', text: 'La acampada libre y el vivac están prohibidos en Luxemburgo. Camping únicamente en sitios oficiales o en terreno privado con el acuerdo del propietario.' },
      ],
    },
    transport: {
      filterTypes: ['c', 'b'],
      blocks: [
        { type: 'text', text: 'Luxemburgo es el primer país del mundo en hacer TODOS sus transportes públicos gratuitos, desde marzo de 2020.' },
        { type: 'sub', title: 'Transportes gratuitos' },
        { type: 'rule', icon: '🚌', text: 'Bus: gratis en todo el país.' },
        { type: 'rule', icon: '🚃', text: 'Tren (2ª clase): gratis en todo el país.' },
        { type: 'rule', icon: '🚋', text: 'Tranvía: gratis. La línea llega al aeropuerto desde marzo de 2025.' },
        { type: 'rule', icon: '🇫🇷', text: 'Gratis también en algunos trenes transfronterizos hacia Francia (Athus, Audun-le-Tiche, Volmerange-les-Mines).' },
        { type: 'text', text: 'La afluencia ha explotado: de 25 millones de pasajeros (2019) a 31,3 millones (2024). El tranvía pasó de 6,2 a 31,7 millones.' },
        { type: 'tip', text: '💡 Para salir de Luxemburgo haciendo dedo, toma un bus gratuito hasta una gasolinera en la autopista, luego haz autostop desde allí.' },
      ],
    },
    culture: {
      filterTypes: ['c', 'b'],
      blocks: [
        { type: 'text', text: 'Luxemburgo es sobre todo un país de tránsito para los autostopistas. Su pequeño tamaño (2.586 km²) y sus transportes gratuitos hacen innecesario el autostop interior. El interés es usarlo como punto de partida hacia el resto de Europa.' },
        { type: 'sub', title: 'Eventos' },
        { type: 'event', items: [
          { month: 'Jun', day: '23', name: 'Fiesta nacional', desc: 'Víspera: fuegos artificiales, conciertos en todo el país.' },
          { month: 'Ago', day: '⟳', name: 'Schueberfouer', desc: 'Feria centenaria en la Ciudad de Luxemburgo.' },
        ]},
      ],
    },
  },

  // ==================== SWITZERLAND ====================
  CH: {
    laws: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'El autostop es legal en Suiza. Prohibido únicamente en las autopistas, vías rápidas y sus rampas de acceso. Permitido en áreas de descanso y aparcamientos.' },
      { type: 'sub', title: 'Particularidades' },
      { type: 'text', text: 'Las autopistas suizas son gratuitas (sistema de viñeta, sin peajes). Las señales de autopista son verdes (a diferencia de las rojas/azules de los países vecinos).' },
      { type: 'text', text: 'Suiza no está en la UE. Los conductores pueden querer verificar que tengas un documento de identidad.' },
      { type: 'warn', text: '⚠️ Si viajas en camión hacia Italia, pide al chófer que no mencione que haces autostop en la aduana. La policía fronteriza podría pedirte que bajes.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'El autostop funciona bien en Suiza pero varía mucho según la región lingüística. Tiempo de espera medio: unos 10 minutos en la Suiza germanófona. Mucho más largo en la Suiza francófona.' },
      { type: 'sub', title: 'Diferencias regionales' },
      { type: 'kv', items: [
        { k: 'Suiza germanófona (norte/este)', v: 'Rápido (~10 min)', color: 'green' },
        { k: 'Zonas de montaña rurales', v: 'Fácil (tradición local)', color: 'green' },
        { k: 'Suiza francófona (oeste)', v: 'Más difícil', color: 'amber' },
      ]},
      { type: 'sub', title: 'Método' },
      { type: 'text', text: 'Como las autopistas son gratuitas, casi todo el mundo las usa. El autostop en carreteras secundarias es por tanto más difícil. Las gasolineras de autopista siguen siendo la mejor opción. Un cartel es muy apreciado en Suiza.' },
      { type: 'sub', title: 'Actitud de los conductores' },
      { type: 'text', text: 'Los conductores suizos mayores (50+) son más receptivos. Los jóvenes tienden a ignorar a los autostopistas e incluso a evitarlos activamente. Aproximadamente 1 coche de cada 40 para.' },
      { type: 'sub', title: 'Mitfahrbänkli' },
      { type: 'text', text: 'Cada vez más municipios suizos instalan Mitfahrbänkli (bancos de autostop) con carteles de dirección. En un municipio probado, la frecuencia era el doble que la del autobús postal.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Suiza es un país muy seguro para el autostop. Los expertos atribuyen el declive de la práctica a un efecto de moda más que a problemas de seguridad reales.' },
      { type: 'sub', title: 'Números de emergencia' },
      { type: 'kv', items: [
        { k: 'Emergencias europeo', v: '112' },
        { k: 'Policía', v: '117' },
        { k: 'Ambulancia', v: '144' },
        { k: 'Bomberos', v: '118' },
        { k: 'Asistencia en carretera', v: '140' },
      ]},
      { type: 'warn', text: '⚠️ En invierno, las temperaturas pueden bajar hasta -25°C en montaña. Un buen equipamiento y un refugio son indispensables. Nunca subestimes el frío en altitud.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Suiza tiene 4 idiomas oficiales: el alemán (norte/este, con un acento suizo muy marcado), el francés (oeste), el italiano (sur) y el romanche (montañas del este). El inglés es bien comprendido por la mayoría de la población.' },
      { type: 'tip', text: '💡 La Suiza francófona es más difícil para el autostop que la germanófona. Si hablas alemán, tendrás más facilidad.' },
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Suiza es uno de los países más caros de Europa. Presupuesto mochilero: unos 43 €/día mínimo, media 120 a 200 CHF/día. Moneda: franco suizo (CHF).' },
      { type: 'sub', title: 'Comer' },
      { type: 'text', text: 'Una comida en restaurante cuesta 25 a 60 CHF. Para reducir costes, compra únicamente en Aldi y Lidl (mucho más barato que Coop o Migros).' },
      { type: 'sub', title: 'Alojamiento' },
      { type: 'kv', items: [
        { k: 'Albergues juveniles', v: '35 a 83 €/noche' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q', 'a'], blocks: [
      { type: 'text', text: 'Suiza es uno de los pocos países europeos donde la acampada libre está relativamente tolerada, especialmente en altitud.' },
      { type: 'sub', title: 'Reglas' },
      { type: 'rule', icon: '✅', text: 'Por encima del límite de los árboles (~2000 m): camping de una noche autorizado, no en grupo.' },
      { type: 'rule', icon: '✅', text: 'Vivac de emergencia (sin tienda): siempre autorizado.' },
      { type: 'rule', icon: '✅', text: 'Cantón de Obwald: acampada libre generalmente autorizada.' },
      { type: 'rule', icon: '🚫', text: 'Prohibido en reservas naturales, zonas de protección de fauna, parques nacionales, zonas militares.' },
      { type: 'text', text: 'Las reglas varían por cantón y por municipio. Infórmate localmente.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Los transportes suizos son excelentes pero caros. Aquí tienes cómo ahorrar.' },
      { type: 'sub', title: 'Descuentos en tren' },
      { type: 'transport', items: [
        { emoji: '🚄', name: 'Swiss Half Fare Card', detail: '50% en todos los trenes, buses, barcos, transporte urbano', price: '150 CHF/mes' },
        { emoji: '🎫', name: 'Spartageskarte', detail: 'Día ilimitado, reserva anticipada', price: 'desde 29 CHF' },
        { emoji: '🌙', name: 'GA Night (< 25 años)', detail: 'Viajes gratis a partir de las 19h', price: '' },
      ]},
      { type: 'sub', title: 'Bus y coche compartido' },
      { type: 'transport', items: [
        { emoji: '🚌', name: 'PostBus (Postauto)', detail: 'Buses amarillos que cubren casi todo el país', price: '' },
        { emoji: '🚌', name: 'FlixBus', detail: '', price: 'desde 5 €' },
        { emoji: '🚗', name: 'BlaBlaCar', detail: '', price: '' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'La primavera y el otoño son las mejores estaciones para el autostop en Suiza. El invierno es peligroso en montaña.' },
      { type: 'sub', title: 'Resumen por mes' },
      { type: 'season', months: [
        { name: 'Ene', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mar', level: 'ok' },
        { name: 'Abr', level: 'good' }, { name: 'May', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'good' }, { name: 'Ago', level: 'good' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'ok' }, { name: 'Dic', level: 'bad' },
      ]},
      { type: 'warn', text: '⚠️ En invierno, los puertos alpinos pueden estar cerrados, limitando mucho los itinerarios. Las temperaturas bajan mucho en altitud. Prevé un equipamiento adecuado.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'El autostop era normal en Suiza hasta los años 1990. La generación mayor tiene historias de aventuras. El declive se atribuye a la prosperidad y las apps de coche compartido, no a la inseguridad. Un renacimiento está en marcha desde hace algunos años, impulsado por las redes sociales y las preocupaciones medioambientales.' },
      { type: 'sub', title: 'Campeonato suizo de autostop' },
      { type: 'text', text: 'Organizado cada año en Suiza, este evento reúne a decenas de participantes que compiten para llegar a un destino a 200 a 300 km lo más rápido posible haciendo autostop.' },
      { type: 'sub', title: 'Eventos' },
      { type: 'event', items: [
        { month: 'Feb', day: '⟳', name: 'Fasnacht (Basilea)', desc: 'Mayor carnaval de Suiza, 3 días.' },
        { month: 'Jul', day: '⟳', name: 'Montreux Jazz Festival', desc: 'Festival de jazz legendario a orillas del lago Lemán.' },
        { month: 'Jul', day: '⟳', name: 'Paléo Festival (Nyon)', desc: 'Mayor festival al aire libre de Suiza.' },
        { month: 'Ago', day: '1', name: 'Fiesta nacional', desc: 'Fuegos artificiales en los lagos, hogueras en las montañas.' },
        { month: 'Nov', day: '⟳', name: 'Zibelemärit (Berna)', desc: 'Mercado de cebollas, tradición medieval.' },
      ]},
    ]},
  },

  // ==================== AUSTRIA ====================
  AT: {
    laws: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'El autostop es legal en Austria. Prohibido en las Autobahnen y Schnellstrassen (vías rápidas). Permitido en áreas de descanso, gasolineras y carreteras secundarias.' },
      { type: 'sub', title: 'Edad mínima (varía por Land)' },
      { type: 'kv', items: [
        { k: 'Carintia y Vorarlberg', v: '14 años mínimo' },
        { k: 'Estiria', v: '16 años mínimo' },
        { k: 'Otros Länder', v: 'Sin restricción de edad' },
      ]},
      { type: 'sub', title: 'Seguro' },
      { type: 'text', text: 'En caso de accidente, el seguro de responsabilidad civil del vehículo cubre al autostopista como a cualquier pasajero.' },
      { type: 'tip', text: '💡 Los camiones no tienen derecho a circular los domingos y festivos en las autopistas austriacas.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Austria es un buen país para el autostop, pero las experiencias varían mucho según la región. En montaña, los tiempos de espera suelen ser de ~10 minutos. En algunas autopistas, puede subir a más de 2 horas.' },
      { type: 'sub', title: 'Diferencias regionales' },
      { type: 'kv', items: [
        { k: 'Oeste (Tirol, Vorarlberg)', v: 'Más fácil', color: 'green' },
        { k: 'Zonas de montaña rurales', v: 'Bien (tradición local)', color: 'green' },
        { k: 'Este (Viena, Graz)', v: 'Más difícil', color: 'amber' },
      ]},
      { type: 'text', text: 'Viena es fácil de acceder pero difícil de abandonar. Graz está rodeada de una "zona muerta" de ~40 km de autopista casi imposible de recorrer haciendo dedo.' },
      { type: 'sub', title: 'Spots clave' },
      { type: 'text', text: 'La Raststätte Walserberg (frontera germano-austriaca cerca de Salzburgo) es enorme e ideal como punto de partida. En Innsbruck, la zona DEZ con dos gasolineras a 2 minutos una de otra permite alternar. WiFi gratuito en muchas áreas de descanso.' },
      { type: 'sub', title: 'Mitfahrbankerl' },
      { type: 'text', text: 'El gobierno federal austriaco promueve los Mitfahrbankerl (bancos de autostop) dentro de su iniciativa climática klimaaktiv. Están presentes sobre todo en Baja Austria y en el Tirol.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Austria está considerada como un país seguro para el autostop, al mismo nivel que Alemania y los Países Bajos.' },
      { type: 'sub', title: 'Consejos del ÖAMTC (automóvil club austriaco)' },
      { type: 'rule', icon: '🎒', text: 'Mantén tu mochila accesible, no en el maletero.' },
      { type: 'rule', icon: '🔒', text: 'Comprueba que el seguro para niños de las puertas traseras no esté activado.' },
      { type: 'rule', icon: '📱', text: 'Anota la matrícula y envíala a tu familia o amigos por SMS.' },
      { type: 'sub', title: 'Números de emergencia' },
      { type: 'kv', items: [
        { k: 'Emergencias europeo', v: '112' },
        { k: 'Policía', v: '133' },
        { k: 'Ambulancia', v: '144' },
        { k: 'Bomberos', v: '122' },
        { k: 'Asistencia en carretera', v: '120 / 123' },
      ]},
    ]},
    women: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'Austria figura entre los países seguros de Europa para las mujeres que viajan solas. Las recomendaciones oficiales (ÖAMTC) aconsejan hacer autostop en pareja cuando sea posible y evitar vehículos con varios hombres.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'El alemán es el idioma oficial, con un acento austriaco distinto. Austria ocupa el 3er puesto mundial en dominio del inglés. Casi todo el mundo habla al menos un inglés básico, especialmente en zonas turísticas.' },
      { type: 'sub', title: 'Frases útiles' },
      { type: 'phrase', items: [
        { local: 'Grüß Gott', meaning: 'Buenos días (saludo austriaco tradicional)' },
        { local: 'Nehmen Sie mich mit nach...?', meaning: '¿Puede llevarme a...?' },
        { local: 'Danke für die Mitfahrt!', meaning: '¡Gracias por el viaje!' },
      ]},
      { type: 'tip', text: '💡 El autostop en Austria se llama "Autostoppen" o simplemente "Stoppen", no "Trampen" como en Alemania.' },
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Presupuesto mochilero en Austria: alrededor de 55 a 95 € por día. Más barato que Suiza, más caro que Europa del Este.' },
      { type: 'sub', title: 'Alojamiento' },
      { type: 'kv', items: [
        { k: 'Albergues juveniles', v: '25 a 40 €/noche' },
        { k: 'Viena (dormitorio)', v: '32 a 40 €/noche' },
      ]},
      { type: 'sub', title: 'Comer barato' },
      { type: 'rule', icon: '🛒', text: 'Supermercados discount: Hofer (= Aldi en Austria), Billa, Spar, Lidl, Penny.' },
      { type: 'text', text: 'Conductores austriacos han invitado a autostopistas a comer en sus casas y a dormir con su familia. A menudo son los momentos más conmovedores del viaje.' },
    ]},
    sleep: { filterTypes: ['b', 'q', 'a'], blocks: [
      { type: 'text', text: 'La acampada libre está estrictamente regulada en Austria y las multas son muy elevadas. Las reglas varían considerablemente de un Land a otro.' },
      { type: 'sub', title: 'Por Land' },
      { type: 'kv', items: [
        { k: 'Alta Austria (por encima de los árboles)', v: 'Autorizado', color: 'green' },
        { k: 'Estiria (terreno baldío, 1 noche)', v: 'Autorizado', color: 'green' },
        { k: 'Salzburgo (medio alpino)', v: 'Tolerado', color: 'amber' },
        { k: 'Tirol', v: 'Prohibido. Multa desde 220 €', color: 'red' },
        { k: 'Baja Austria', v: 'Prohibido. Multa hasta 14.500 €', color: 'red' },
        { k: 'Carintia', v: 'Prohibido. Multa hasta 3.630 €', color: 'red' },
        { k: 'Viena / Burgenland', v: 'Prohibido', color: 'red' },
      ]},
      { type: 'text', text: 'El vivac de emergencia (por razones de seguridad: mal tiempo, lesión, caída de la noche) siempre está autorizado en todas partes. Pero el vivac planificado (con tienda, colchoneta, hornillo) se trata como acampada libre.' },
      { type: 'warn', text: '⚠️ El camping en bosque está prohibido en TODA Austria, sin excepción.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Austria tiene un pase de transporte nacional único en Europa.' },
      { type: 'sub', title: 'KlimaTicket' },
      { type: 'transport', items: [
        { emoji: '🎫', name: 'KlimaTicket', detail: 'Todos los transportes públicos del país, ilimitado', price: '1.095 €/año (~3 €/día)' },
        { emoji: '🎫', name: 'KlimaTicket < 26 años / > 64 años', detail: 'Tarifa reducida', price: '821 €/año' },
      ]},
      { type: 'text', text: '130.000 austriacos se suscribieron el primer mes. El 85% sustituyó viajes en coche.' },
      { type: 'sub', title: 'Otras opciones' },
      { type: 'transport', items: [
        { emoji: '🚄', name: 'ÖBB Sparschiene', detail: 'Billetes anticipados a precio reducido', price: 'desde 19 €' },
        { emoji: '🚄', name: 'Vorteilscard < 26 años', detail: '50% en todos los trenes, 1 año', price: '19 €' },
        { emoji: '🚌', name: 'FlixBus', detail: '', price: 'desde 5 €' },
        { emoji: '🚗', name: 'BlaBlaCar', detail: '', price: '' },
        { emoji: '🌙', name: 'Nightjet (ÖBB)', detail: 'Trenes nocturnos hacia Alemania, Suiza, Italia', price: '' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'El verano es la mejor estación para el autostop en Austria. El invierno es posible pero difícil (frío, días cortos).' },
      { type: 'sub', title: 'Resumen por mes' },
      { type: 'season', months: [
        { name: 'Ene', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mar', level: 'ok' },
        { name: 'Abr', level: 'good' }, { name: 'May', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Ago', level: 'good' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'ok' }, { name: 'Dic', level: 'bad' },
      ]},
      { type: 'warn', text: '⚠️ Evita los domingos: los camiones están prohibidos en las autopistas los domingos y festivos, el tráfico se reduce mucho.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'La acogida austriaca varía mucho. Algunos viajeros encuentran a los austriacos muy acogedores, otros los describen como reservados. En montaña, la gente es más abierta porque muchos hicieron autostop de niños y los buses pasan raramente.' },
      { type: 'sub', title: 'Lo que funciona' },
      { type: 'rule', icon: '😊', text: 'Una sonrisa sincera resuelve muchas reticencias.' },
      { type: 'rule', icon: '🏔️', text: 'En las carreteras de montaña, después de una excursión, las posibilidades de que un coche pare son muy altas.' },
      { type: 'sub', title: 'Eventos' },
      { type: 'event', items: [
        { month: 'Ene', day: '⟳', name: 'Conciertos de Año Nuevo (Viena)', desc: 'Tradición musical mundial.' },
        { month: 'Feb', day: '⟳', name: 'Baile de la Ópera (Viena)', desc: 'El baile más grande del mundo.' },
        { month: 'Jul-Ago', day: '⟳', name: 'Festival de Salzburgo', desc: 'Ópera, teatro y música clásica.' },
        { month: 'Sep-Oct', day: '⟳', name: 'Almabtrieb', desc: 'Descenso de los rebaños decorados de los pastos alpinos. Fiesta popular.' },
        { month: 'Nov-Dic', day: '⟳', name: 'Christkindlmärkte', desc: 'Mercados navideños. Viena, Salzburgo, Innsbruck, Graz.' },
        { month: 'Dic', day: '5', name: 'Krampuslauf', desc: 'Desfile del Krampus, tradición alpina única.' },
      ]},
      { type: 'tip', text: '💡 Los paisajes alpinos son magníficos. Privilegia las pequeñas carreteras de montaña para disfrutar de la vista, aunque lleve más tiempo.' },
    ]},
  },

  // ==================== SPAIN ====================
  ES: {
    laws: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'El autostop es legal en las carreteras nacionales y secundarias en España. Está prohibido en las autopistas (autopistas) y autovías por el artículo 125 del Reglamento General de Circulación.' },
      { type: 'sub', title: 'Multas' },
      { type: 'text', text: 'Multa de 80 € para el autostopista Y el conductor que le recoja en una carretera prohibida. Algunos municipios aplican multas más altas (hasta 3.000 € en ciertos casos locales).' },
      { type: 'sub', title: 'En la práctica' },
      { type: 'text', text: 'Las gasolineras y áreas de descanso de autopista están permitidas. Muchos españoles (y algunos policías) creen erróneamente que el autostop es totalmente ilegal.' },
      { type: 'warn', text: '⚠️ La Guardia Civil retira activamente a los autostopistas de los peajes. Los empleados de las sociedades de autopista también.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'España es uno de los países más difíciles de Europa para el autostop. El tiempo de espera medio es de 60 a 120 minutos. Prevé un máximo de 300 a 350 km por día.' },
      { type: 'sub', title: 'Método obligatorio' },
      { type: 'text', text: 'Abordar a los conductores directamente en las gasolineras es casi obligatorio. El pulgar al borde de la carretera casi no funciona en España. Acércate educadamente: "Hola, ¿vas a...?"' },
      { type: 'sub', title: 'Diferencias regionales' },
      { type: 'kv', items: [
        { k: 'Galicia, Asturias, Extremadura', v: 'Más fácil', color: 'green' },
        { k: 'Aragón, Navarra', v: 'Correcto', color: 'green' },
        { k: 'Andalucía interior', v: 'Difícil (estaciones desiertas)', color: 'amber' },
        { k: 'Cataluña', v: 'Muy difícil', color: 'red' },
        { k: 'País Vasco', v: 'Muy difícil', color: 'red' },
      ]},
      { type: 'sub', title: 'Truco fronterizo' },
      { type: 'text', text: 'La Jonquera (frontera francesa) es una de las mayores paradas de carretera de Europa. Ideal para encontrar un viaje de larga distancia antes de entrar en España.' },
      { type: 'warn', text: '⚠️ Durante la siesta (14h a 17h), el tráfico cae mucho. Evita hacer autostop durante esas horas, especialmente en verano.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'España es globalmente segura (23ª en el Global Peace Index). El riesgo principal para los viajeros son los carteristas en las grandes ciudades, no el autostop.' },
      { type: 'text', text: 'El autostop es menos común en España que en el resto de Europa, pero es perfectamente viable. Los españoles son cálidos y acogedores una vez que se inicia la conversación.' },
      { type: 'sub', title: 'Números de emergencia' },
      { type: 'kv', items: [
        { k: 'Emergencias', v: '112' },
        { k: 'Guardia Civil (carreteras, rural)', v: '062' },
        { k: 'Policía Nacional (ciudades)', v: '091' },
      ]},
    ]},
    women: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'España está considerada como uno de los países más seguros para las viajeras solas en general. Varias mujeres que han hecho autostop solas reportan experiencias positivas.' },
      { type: 'sub', title: 'Experiencias' },
      { type: 'text', text: 'Los incidentes son raros y generalmente menores (gesto fuera de lugar, conversación inapropiada), todos manejables con un rechazo firme. El hecho de ser mujer puede ser una ventaja: los conductores paran a menudo por preocupación por tu seguridad.' },
      { type: 'rule', icon: '👨‍👩‍👧', text: 'Privilegia parejas y familias. Rechaza coches con varios hombres.' },
      { type: 'rule', icon: '📍', text: 'Comparte tu itinerario en tiempo real en Google Maps con un conocido.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'El español (castellano) es indispensable. Solo el 22% de los españoles hablan inglés. España es uno de los países de Europa Occidental con el nivel más bajo de inglés. Fuera de las zonas turísticas, no cuentes con el inglés.' },
      { type: 'sub', title: 'Lenguas regionales' },
      { type: 'text', text: 'El catalán, el vasco y el gallego son cooficiales en sus regiones. Unas pocas palabras en la lengua local ayudan mucho.' },
      { type: 'sub', title: 'Frases útiles' },
      { type: 'phrase', items: [
        { local: 'Hola, ¿vas a...?', meaning: 'Para abordar a los conductores' },
        { local: '¿Me puedes llevar?', meaning: 'Para pedir un viaje' },
        { local: '¡Gracias, buen viaje!', meaning: 'Al bajar del coche' },
        { local: '¿Me puedes dejar aquí?', meaning: 'Para pedir que te dejen en un sitio' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Presupuesto mochilero en España: alrededor de 38 a 50 € por día. El sur (Sevilla, Cádiz, Granada) es notablemente más barato que el norte.' },
      { type: 'sub', title: 'Comer barato' },
      { type: 'rule', icon: '🍽️', text: 'Menú del día: 8 a 15 € por una comida de 3 platos. Los restaurantes están legalmente obligados a ofrecerlo.' },
      { type: 'rule', icon: '🍺', text: 'Tapas gratuitas con la bebida en Castilla, Andalucía y Castilla-La Mancha.' },
      { type: 'rule', icon: '🥖', text: 'Pintxos en el País Vasco: 1 a 2 € por unidad.' },
      { type: 'rule', icon: '🛒', text: 'Supermercados: Mercadona, Carrefour, Lidl. Comida completa por 5 a 10 €.' },
      { type: 'warn', text: '⚠️ La comida en las áreas de autopista es muy cara. Compra en la ciudad.' },
    ]},
    sleep: { filterTypes: ['b', 'q', 'a'], blocks: [
      { type: 'text', text: 'La acampada libre está prohibida en España. Las multas van de 30 a 3.000 € según la región. Pero el vivac (dormir sin tienda) está más tolerado en montaña.' },
      { type: 'sub', title: 'Por región' },
      { type: 'kv', items: [
        { k: 'Galicia, Cantabria, Asturias, Navarra', v: 'Más tolerante', color: 'green' },
        { k: 'Pirineos, Aragón (montaña)', v: 'Vivac tolerado', color: 'green' },
        { k: 'Interior rural', v: 'La policía solo dice que te vayas', color: 'amber' },
        { k: 'Costas turísticas, playas', v: 'Tolerancia cero', color: 'red' },
        { k: 'Baleares, Canarias', v: 'Tolerancia cero', color: 'red' },
      ]},
      { type: 'sub', title: 'Alternativas' },
      { type: 'rule', icon: '⛪', text: 'Albergues de peregrinos en el Camino de Santiago: alojamiento muy económico con credencial de peregrino.' },
      { type: 'rule', icon: '🛋️', text: 'Couchsurfing: comunidad activa en Madrid y Barcelona.' },
      { type: 'rule', icon: '🏕️', text: 'Campings: 10 a 18 €/noche para 2 con tienda. La mayoría tienen piscina.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'España tiene la 4ª red de autopistas más grande del mundo. Muchos españoles usan BlaBlaCar en lugar de hacer autostop.' },
      { type: 'sub', title: 'Opciones' },
      { type: 'transport', items: [
        { emoji: '🚗', name: 'BlaBlaCar', detail: 'Muy popular en España', price: '~5 €/100 km' },
        { emoji: '🚗', name: 'Amovens', detail: 'Competidor español, cero comisión', price: '' },
        { emoji: '🚌', name: 'ALSA', detail: 'Principal compañía de autobuses española', price: 'desde 10 €' },
        { emoji: '🚌', name: 'FlixBus', detail: '', price: 'desde 5 €' },
        { emoji: '🚄', name: 'Ouigo / Iryo', detail: 'AVE low-cost españoles', price: 'desde 9 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'La primavera y el otoño son las mejores estaciones. El verano es el peor momento para hacer autostop en España.' },
      { type: 'sub', title: 'Resumen por mes' },
      { type: 'season', months: [
        { name: 'Ene', level: 'ok' }, { name: 'Feb', level: 'ok' }, { name: 'Mar', level: 'good' },
        { name: 'Abr', level: 'great' }, { name: 'May', level: 'great' }, { name: 'Jun', level: 'good' },
        { name: 'Jul', level: 'bad' }, { name: 'Ago', level: 'bad' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'great' }, { name: 'Nov', level: 'ok' }, { name: 'Dic', level: 'ok' },
      ]},
      { type: 'warn', text: '⚠️ Julio y agosto: calor extremo (40°C+ en el interior), siesta que mata el tráfico, precios al máximo. Esperar al borde de la carretera bajo 40°C es insoportable.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'La cultura del autostop nunca existió realmente en España. Bajo Franco, los movimientos juveniles no arraigaron como en el resto de Europa. Cuando España se abrió, los coches ya eran asequibles.' },
      { type: 'sub', title: 'Lo que funciona' },
      { type: 'rule', icon: '🗣️', text: 'El enfoque directo en las gasolineras es casi obligatorio. El pulgar al borde de la carretera se ve como inusual.' },
      { type: 'rule', icon: '😊', text: 'Los españoles son cálidos y generosos una vez establecido el contacto. La barrera es la primera parada.' },
      { type: 'rule', icon: '🕐', text: 'Adáptate a los horarios españoles: almuerzo sobre las 14h, cena después de las 21h. La siesta (14h a 17h) reduce el tráfico.' },
      { type: 'sub', title: 'Eventos' },
      { type: 'event', items: [
        { month: 'Mar', day: '⟳', name: 'Las Fallas (Valencia)', desc: 'Esculturas gigantes quemadas, fuegos artificiales.' },
        { month: 'Mar-Abr', day: '⟳', name: 'Semana Santa', desc: 'Procesiones en todo el país, especialmente Sevilla.' },
        { month: 'Abr', day: '⟳', name: 'Feria de Abril (Sevilla)', desc: 'Baile flamenco, caballos, trajes tradicionales.' },
        { month: 'Jul', day: '6-14', name: 'San Fermín (Pamplona)', desc: 'Encierro de toros por las calles.' },
        { month: 'Ago', day: '⟳', name: 'La Tomatina (Buñol)', desc: 'Batalla de tomates gigante.' },
        { month: 'Ago', day: '15', name: 'Asunción', desc: 'Festivo, mucha gente en las carreteras.' },
      ]},
    ]},
  },

  // ==================== PORTUGAL ====================
  PT: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'El autostop es legal en Portugal. Caminar por las autopistas (autoestradas) está prohibido, pero no hay multa específica para los autostopistas. La policía puede pedirte que abandones la zona u ofrecerte un viaje.' },
      { type: 'text', text: 'Las gasolineras y áreas de peaje son los mejores sitios. Pedir viajes allí está permitido y recomendado.' },
      { type: 'warn', text: '⚠️ Los autostopistas no siempre están cubiertos por el seguro de automóvil estándar en Portugal. Es una de las razones por las que algunos conductores dudan en parar.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Portugal es más fácil que España para el autostop, pero sigue siendo un reto. El tiempo de espera mediano es de unos 40 minutos. El trayecto más largo registrado por un viajero es de 460 km (Ourique a Oporto).' },
      { type: 'sub', title: 'Método' },
      { type: 'text', text: 'El enfoque directo funciona mejor: "Hola, disculpe que le moleste, voy a... ¿va usted en la misma dirección?" Los portugueses responden mejor a una conversación educada que al pulgar levantado.' },
      { type: 'sub', title: 'Diferencias regionales' },
      { type: 'kv', items: [
        { k: 'Eje Lisboa-Coímbra-Oporto', v: 'El más fácil', color: 'green' },
        { k: 'Algarve (costa sur)', v: 'Correcto (turistas)', color: 'green' },
        { k: 'Interior norte', v: 'Más largo', color: 'amber' },
        { k: 'Zonas fronterizas con España', v: 'Tráfico muy escaso', color: 'red' },
      ]},
      { type: 'sub', title: 'Salir de Lisboa' },
      { type: 'text', text: 'Salir de Lisboa haciendo dedo es difícil. Toma el tren hasta Vila Franca de Xira (2,20 €, 30 min) para acceder al peaje de la A1 y a la carretera nacional.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Portugal es el 5º país más seguro de Europa y uno de los más seguros del mundo. Los crímenes violentos son muy raros. El principal riesgo son los carteristas en Lisboa (tranvía 28) y en las zonas turísticas de Oporto.' },
      { type: 'sub', title: 'Números de emergencia' },
      { type: 'kv', items: [
        { k: 'Emergencias', v: '112' },
      ]},
      { type: 'text', text: 'La policía se divide en PSP (zonas urbanas) y GNR (zonas rurales). Lisboa tiene una comisaría de policía turística en la estación de Rossio con agentes multilingües.' },
    ]},
    women: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'Portugal está considerado como uno de los mejores países del mundo para viajeras solas. Varias mujeres reportan no haberse sentido nunca acosadas.' },
      { type: 'text', text: 'Los hombres portugueses son descritos como respetuosos: cuando ligan, lo hacen con clase y aceptan fácilmente un "no" educado. Las conductoras y las parejas a menudo ofrecen viajes por solidaridad.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'El portugués es el idioma oficial. El nivel de inglés es mucho mejor que en España: Portugal figura entre los mejores países no anglófonos. El inglés se enseña desde primaria. El español es ampliamente comprendido gracias a las raíces comunes.' },
      { type: 'sub', title: 'Frases útiles' },
      { type: 'phrase', items: [
        { local: 'Olá, pode dar-me boleia até...?', meaning: '¿Puede llevarme a...?' },
        { local: 'Fala inglês?', meaning: '¿Habla inglés?' },
        { local: 'Obrigado / Obrigada', meaning: 'Gracias (hombre / mujer)' },
        { local: 'Pode ajudar-me?', meaning: '¿Puede ayudarme?' },
      ]},
      { type: 'tip', text: '💡 Los portugueses se iluminan cuando los visitantes hacen el esfuerzo de hablar unas palabras en portugués. Incluso un simple "Olá" marca una gran diferencia.' },
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Portugal es uno de los países más asequibles de Europa Occidental. Presupuesto mochilero: unos 35 a 50 € por día. Fuera de Lisboa y Oporto, los precios bajan considerablemente.' },
      { type: 'sub', title: 'Comer barato' },
      { type: 'rule', icon: '🍽️', text: 'Prato do dia (plato del día): 8 a 12 € con sopa, plato, postre y a veces una copa de vino.' },
      { type: 'rule', icon: '🛒', text: 'Supermercados: Pingo Doce, Continente, Lidl, Aldi. Platos preparados disponibles.' },
      { type: 'sub', title: 'Alojamiento' },
      { type: 'kv', items: [
        { k: 'Albergues juveniles', v: '15 a 25 €/noche' },
      ]},
      { type: 'text', text: 'La región del Alentejo es particularmente asequible. Oporto es descrito como "realmente asequible para Europa Occidental".' },
    ]},
    sleep: { filterTypes: ['b', 'q', 'a'], blocks: [
      { type: 'text', text: 'Desde julio de 2021, la acampada libre y el vivac están efectivamente prohibidos en Portugal. Multas: 120 a 600 € (hasta 36.000 € para infracciones graves en zonas protegidas).' },
      { type: 'sub', title: 'Zonas' },
      { type: 'kv', items: [
        { k: 'Algarve y Lisboa', v: 'Aplicación estricta', color: 'red' },
        { k: 'Costa atlántica', v: 'Aplicación estricta', color: 'red' },
        { k: 'Norte interior y montaña', v: 'Más tolerante si eres discreto', color: 'amber' },
      ]},
      { type: 'sub', title: 'Alternativas gratuitas o baratas' },
      { type: 'rule', icon: '🚒', text: 'Bombeiros (cuarteles de bomberos): algunos ofrecen camas gratis a los viajeros que piden educadamente. Lleva tu saco de dormir.' },
      { type: 'rule', icon: '🛋️', text: 'Couchsurfing: comunidad activa en Lisboa y Oporto.' },
      { type: 'rule', icon: '🌾', text: 'Portugal EasyCamp: estancias con agricultores y viticultores, a menudo más barato que los campings.' },
      { type: 'tip', text: '💡 Los grupos de Facebook "Boleia" + nombre de ciudad permiten encontrar viajes y a veces alojamiento en casas particulares.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'La red ferroviaria portuguesa es limitada pero los autobuses son fiables y asequibles.' },
      { type: 'sub', title: 'Opciones' },
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Rede Expressos', detail: 'Principal compañía de autobuses, 202 ciudades', price: 'desde 5 €' },
        { emoji: '🚌', name: 'FlixBus', detail: 'Lisboa-Oporto desde 9 €', price: 'desde 5 €' },
        { emoji: '🚗', name: 'BlaBlaCar', detail: 'Popular para el interurbano', price: '' },
        { emoji: '🚗', name: 'Boleia.net', detail: 'Plataforma portuguesa de coche compartido', price: '' },
        { emoji: '🚃', name: 'CP (trenes)', detail: 'Trenes regionales asequibles alrededor de Lisboa', price: 'desde 2,20 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'La primavera y el inicio del otoño son los mejores períodos. El verano es muy caluroso en el interior y muy turístico en la costa.' },
      { type: 'sub', title: 'Resumen por mes' },
      { type: 'season', months: [
        { name: 'Ene', level: 'ok' }, { name: 'Feb', level: 'ok' }, { name: 'Mar', level: 'good' },
        { name: 'Abr', level: 'great' }, { name: 'May', level: 'great' }, { name: 'Jun', level: 'good' },
        { name: 'Jul', level: 'ok' }, { name: 'Ago', level: 'bad' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'great' }, { name: 'Nov', level: 'ok' }, { name: 'Dic', level: 'ok' },
      ]},
      { type: 'text', text: 'El Algarve (sur) se mantiene suave incluso en invierno (15 a 20°C). El norte y el centro son lluviosos de noviembre a marzo.' },
      { type: 'warn', text: '⚠️ Portugal es MUY ventoso, especialmente en la costa. Prevé viento fuerte, incluso en verano. Por la noche, el viento costero puede ser helado.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Los portugueses son descritos como muy cálidos y acogedores, pero el autostop no está en su cultura. Los automovilistas locales rara vez paran. Los turistas extranjeros (sobre todo en verano en el Algarve) son más propensos a recoger autostopistas.' },
      { type: 'sub', title: 'Lo que funciona' },
      { type: 'rule', icon: '🗣️', text: 'El enfoque directo y educado es crucial. Los portugueses valoran la interacción personal.' },
      { type: 'rule', icon: '📋', text: 'Un cartel con tu destino mejora tus posibilidades.' },
      { type: 'sub', title: 'Eventos' },
      { type: 'event', items: [
        { month: 'Feb', day: '⟳', name: 'Carnaval', desc: 'Grandes celebraciones, especialmente en Torres Vedras y Loulé.' },
        { month: 'Jun', day: '12-13', name: 'Santo António (Lisboa)', desc: 'Fiesta del santo patrón, sardinas a la brasa, desfiles.' },
        { month: 'Jun', day: '23-24', name: 'São João (Oporto)', desc: 'Mayor fiesta de Oporto, fuegos, música, martillos de plástico.' },
        { month: 'Jul', day: '⟳', name: 'NOS Alive (Lisboa)', desc: 'Festival de música internacional.' },
        { month: 'Ago', day: '⟳', name: 'Festival do Sudoeste', desc: 'Festival de música en el Alentejo.' },
        { month: 'Oct', day: '5', name: 'Día de la República', desc: 'Festivo nacional.' },
      ]},
      { type: 'tip', text: '💡 Un viaje en autostop por Portugal puede fácilmente convertirse en una visita guiada improvisada. Los conductores a veces proponen espontáneamente enseñar su ciudad.' },
    ]},
  },

  // ==================== ITALY ====================
  IT: {
    laws: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'El autostop está prohibido en las autopistas (autostrade) en Italia, incluyendo las rampas de acceso, las áreas de servicio y los aparcamientos de autopista. Es uno de los pocos países de Europa con una prohibición tan estricta.' },
      { type: 'sub', title: 'Multas' },
      { type: 'text', text: 'Multa de 21 a 168 € para el autostopista. El conductor que pare también se arriesga a una multa. La aplicación varía según las regiones y los agentes.' },
      { type: 'sub', title: 'Lo que está permitido' },
      { type: 'rule', icon: '✅', text: 'Pedir un viaje abordando directamente a los conductores en las gasolineras (Autogrill). Es el método que funciona.' },
      { type: 'rule', icon: '✅', text: 'Hacer autostop en las carreteras nacionales (strade statali) y secundarias.' },
      { type: 'rule', icon: '🚫', text: 'Hacer dedo en las autopistas, rampas, peajes y áreas de servicio de autopista.' },
      { type: 'warn', text: '⚠️ Muchos italianos e incluso algunos policías piensan que el autostop es totalmente ilegal. Colócate antes de las señales "no autostop" en las entradas de autopista.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Italia es uno de los países más difíciles de Europa Occidental para el autostop. Los tiempos de espera de 1 a 2 horas son frecuentes. La estrategia ganadora: avanzar de Autogrill en Autogrill abordando a los conductores directamente.' },
      { type: 'sub', title: 'Diferencias norte/sur' },
      { type: 'kv', items: [
        { k: 'Sur de Italia (Calabria, Sicilia)', v: 'Más fácil, gente acogedora', color: 'green' },
        { k: 'Cerdeña', v: 'Bueno (hospitalidad local)', color: 'green' },
        { k: 'Friuli-Venecia Julia, Tirol del Sur', v: 'Correcto', color: 'green' },
        { k: 'Norte industrial (Milán, Turín)', v: 'Difícil, gente con prisa', color: 'red' },
        { k: 'Alpes (túneles)', v: 'Muy difícil (sin parada)', color: 'red' },
      ]},
      { type: 'sub', title: 'Truco del cartel' },
      { type: 'text', text: 'Un cartel en italiano con "Siamo bravi" (somos majos) ha demostrado su eficacia. Escribe una ciudad a 200 a 300 km, no tu destino final. Los extranjeros (franceses, alemanes, polacos) en tránsito paran más que los italianos.' },
      { type: 'tip', text: '💡 En Sicilia, puedes subir gratis al ferry en Villa San Giovanni: los billetes son por vehículo, no por pasajero.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Italia es globalmente segura para viajar. Los incidentes violentos relacionados con el autostop son extremadamente raros. El riesgo principal es legal (multas), no físico.' },
      { type: 'sub', title: 'Números de emergencia' },
      { type: 'kv', items: [
        { k: 'Emergencias europeo', v: '112' },
        { k: 'Carabinieri', v: '112' },
        { k: 'Policía', v: '113' },
        { k: 'Bomberos', v: '115' },
        { k: 'Ambulancia', v: '118' },
      ]},
      { type: 'text', text: 'En las afueras de las grandes ciudades (especialmente Roma), las mujeres solas pueden ser confundidas con prostitutas. Evita hacer autostop en esas zonas.' },
    ]},
    women: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'Italia no es peligrosa para las mujeres, pero las miradas insistentes y la atención no deseada son comunes, especialmente en el sur. El autostop es perfectamente factible, incluso en Sicilia.' },
      { type: 'sub', title: 'Consejos específicos' },
      { type: 'rule', icon: '👕', text: 'Vístete de forma sobria: sin maquillaje, sin joyas, calzado de senderismo, look "aventurera".' },
      { type: 'rule', icon: '👨‍👩‍👧', text: 'Prefiere parejas y familias. Las conductoras son raras pero muy seguras.' },
      { type: 'rule', icon: '📱', text: 'Toma una foto de la matrícula de forma visible (el conductor ve que lo haces). Eso tranquiliza a todo el mundo.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'El italiano es esencial. La mayoría de los italianos no hablan inglés, especialmente fuera de las zonas turísticas. Incluso unas pocas palabras en italiano transforman completamente la interacción.' },
      { type: 'sub', title: 'Frases útiles' },
      { type: 'phrase', items: [
        { local: 'Cerco un passaggio per...', meaning: 'Busco un viaje hacia...' },
        { local: 'Vado a...', meaning: 'Voy a...' },
        { local: 'Area servizio', meaning: 'Área de servicio' },
        { local: 'Grazie mille!', meaning: '¡Muchas gracias!' },
      ]},
      { type: 'tip', text: '💡 Los gestos son esenciales en Italia. La comunicación física ayuda enormemente cuando faltan las palabras.' },
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Presupuesto mochilero en Italia: alrededor de 18 a 30 € por día con disciplina. Las regiones interiores (Basilicata, Molise, Calabria) son notablemente más baratas que las costas y ciudades turísticas.' },
      { type: 'sub', title: 'Comer barato' },
      { type: 'rule', icon: '🍕', text: 'Pizza al taglio (por porción): 1 a 2,50 €. Focaccia: 0,80 €. Arancini: 2 €.' },
      { type: 'rule', icon: '🛒', text: 'Supermercados: LIDL, Carrefour, COOP. Pasta + salsa = ~3 €/comida en cocina de albergue.' },
      { type: 'sub', title: 'Generosidad' },
      { type: 'text', text: 'Los conductores italianos a veces ofrecen espontáneamente comidas, alojamiento o incluso dinero.' },
    ]},
    sleep: { filterTypes: ['b', 'q', 'a'], blocks: [
      { type: 'text', text: 'La acampada libre está prohibida en Italia. Multas: 100 a 500 €. Pero el vivac (del atardecer al amanecer, sin tienda) está tolerado en montaña.' },
      { type: 'sub', title: 'Excepciones' },
      { type: 'rule', icon: '✅', text: 'Trentino-Alto Adigio: vivac autorizado hasta 24h.' },
      { type: 'rule', icon: '✅', text: 'Valle de Aosta: vivac autorizado por encima de 2.500 m.' },
      { type: 'rule', icon: '🚫', text: 'Playas: aplicación estricta en todas partes.' },
      { type: 'sub', title: 'Alternativas' },
      { type: 'rule', icon: '🛋️', text: 'Couchsurfing: activo en las ciudades universitarias (Turín, Pisa, Padua).' },
      { type: 'rule', icon: '🌾', text: 'WWOOF / Workaway: trabajo en la granja a cambio de alojamiento y comida.' },
      { type: 'text', text: 'En Cerdeña y Sicilia, los locales a veces invitan espontáneamente a los viajeros a sus casas.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Italia tiene alternativas de transporte asequibles cuando el autostop no funciona.' },
      { type: 'sub', title: 'Opciones' },
      { type: 'transport', items: [
        { emoji: '🚌', name: 'FlixBus / MarinoBus', detail: 'Red extensa, 60 a 80% más barato que el tren', price: 'desde 5 €' },
        { emoji: '🚗', name: 'BlaBlaCar', detail: 'Muy utilizado en Italia', price: '' },
        { emoji: '🚄', name: 'Italo', detail: 'Trenes de alta velocidad privados (Roma-Florencia-Venecia)', price: 'desde 9 €' },
        { emoji: '🚃', name: 'Trenitalia regional', detail: 'Trenes lentos pero asequibles', price: '' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'La primavera y el inicio del otoño son los mejores períodos. Evita octubre y noviembre (todo cierra) y agosto (Ferragosto, caos en las carreteras).' },
      { type: 'sub', title: 'Resumen por mes' },
      { type: 'season', months: [
        { name: 'Ene', level: 'ok' }, { name: 'Feb', level: 'ok' }, { name: 'Mar', level: 'good' },
        { name: 'Abr', level: 'great' }, { name: 'May', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'good' }, { name: 'Ago', level: 'ok' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'ok' }, { name: 'Nov', level: 'bad' }, { name: 'Dic', level: 'ok' },
      ]},
      { type: 'text', text: 'En verano, los turistas extranjeros (franceses, alemanes) que atraviesan el norte son más propensos a parar que los propios italianos.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Los italianos tienen una percepción negativa del autostop. Muchos consideran que solo los vagabundos hacen dedo. Pero una vez establecido el contacto, la hospitalidad italiana es sincera y generosa, especialmente en el sur y en las islas.' },
      { type: 'sub', title: 'Lo que funciona' },
      { type: 'rule', icon: '🗣️', text: 'Hablar italiano, aunque sea mal, lo cambia todo. El enfoque directo en los Autogrill es obligatorio.' },
      { type: 'rule', icon: '😊', text: 'El contacto humano primero: sonrisa, conversación, mirada. Luego la petición de viaje.' },
      { type: 'sub', title: 'Eventos' },
      { type: 'event', items: [
        { month: 'Feb', day: '⟳', name: 'Carnevale di Venezia', desc: 'Máscaras, disfraces, 10 días de festividades.' },
        { month: 'Abr', day: '25', name: 'Festa della Liberazione', desc: 'Festivo, celebraciones nacionales.' },
        { month: 'May', day: '⟳', name: 'Giro d\'Italia', desc: 'Tour ciclista, ambiente en las carreteras.' },
        { month: 'Jul', day: '2+16', name: 'Palio di Siena', desc: 'Carrera de caballos medieval en la ciudad.' },
        { month: 'Ago', day: '15', name: 'Ferragosto', desc: 'Toda Italia de vacaciones. Carreteras cargadas.' },
        { month: 'Dic', day: '⟳', name: 'Mercatini di Natale', desc: 'Mercados navideños, especialmente en Trentino.' },
      ]},
    ]},
  },

  // ==================== GREECE ====================
  GR: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'No hay ley específica que prohíba el autostop en Grecia. En las autopistas está prohibido como en el resto de la UE, pero en las carreteras normales se tolera. Las multas (100 a 150 €) son raras y aplicadas de forma inconsistente.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Grecia es notablemente más fácil que Italia o España para el autostop. Los tiempos de espera varían de pocos minutos a una hora. En zonas rurales y en las islas, los propios locales hacen dedo.' },
      { type: 'sub', title: 'Por zona' },
      { type: 'kv', items: [
        { k: 'Creta (especialmente oeste/sur)', v: 'Muy fácil', color: 'green' },
        { k: 'Islas rurales', v: 'Fácil (pocos buses)', color: 'green' },
        { k: 'Carreteras rurales continente', v: 'Fácil', color: 'green' },
        { k: 'Ejes interurbanos (Atenas-Tesalónica)', v: 'Más difícil', color: 'amber' },
        { k: 'Salir de Atenas', v: 'Muy difícil', color: 'red' },
      ]},
      { type: 'sub', title: 'Método' },
      { type: 'text', text: 'En Creta, el pulgar levantado no siempre se entiende. Usa mejor un gesto con la mano para señalar a los coches que paren, como si tuvieras prisa. Un cartel en griego Y en inglés aumenta tus posibilidades.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Grecia es uno de los países más seguros de Europa para los viajeros. Los conductores griegos ofrecen espontáneamente comida, bebidas y alojamiento.' },
      { type: 'sub', title: 'Usa SpotHitch para tu seguridad' },
      { type: 'rule', icon: '🛡️', text: 'Activa el Modo Guardián antes de cada viaje. Una persona de confianza sigue tu posición en tiempo real.' },
      { type: 'rule', icon: '🆘', text: 'Configura el modo SOS con tus contactos. Un toque activa una triple alerta (push, SMS, llamada).' },
      { type: 'rule', icon: '📱', text: 'Fotografía la matrícula y envíala a alguien antes de subir.' },
      { type: 'rule', icon: '🎒', text: 'Mantén tu mochila accesible (en tu regazo o a tus pies), nunca en el maletero.' },
      { type: 'sub', title: 'Consejos del país' },
      { type: 'rule', icon: '🏝️', text: 'En las islas, el autostop es muy fácil. El tráfico es reducido y los conductores paran de buena gana.' },
      { type: 'rule', icon: '😊', text: 'Los griegos son espontáneamente generosos. Acepta las invitaciones con gratitud, es parte de su cultura.' },
      { type: 'sub', title: 'Números de emergencia' },
      { type: 'kv', items: [{ k: 'Emergencias', v: '112' }, { k: 'Policía', v: '100' }, { k: 'Ambulancia', v: '166' }] },
    ]},
    women: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'Grecia está considerada como uno de los mejores destinos del mundo para viajeras solas. La actitud hacia las mujeres solas es descrita como la de un "primo mayor protector" más que intrusiva.' },
      { type: 'text', text: 'Las mujeres viajan con total seguridad en Grecia, de día como de noche, en bus, en ferry y haciendo dedo. Los incidentes son casi inexistentes.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'El griego es el idioma oficial. El inglés se habla bien en las zonas turísticas y por los jóvenes (se enseña en la escuela desde primaria). En zona rural, es más limitado. Muchos griegos hablan también alemán (diáspora).' },
      { type: 'sub', title: 'Frases útiles' },
      { type: 'phrase', items: [
        { local: 'Kalimera', meaning: 'Buenos días' },
        { local: 'Efcharistó', meaning: 'Gracias' },
        { local: 'Parakaló', meaning: 'Por favor / De nada' },
        { local: 'Boríte na me páte sto...?', meaning: '¿Puede llevarme a...?' },
      ]},
      { type: 'tip', text: '💡 Unas pocas palabras en griego desencadenan reacciones muy cálidas. Los griegos aprecian enormemente el esfuerzo.' },
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Grecia es asequible para mochileros. Presupuesto: 22 a 42 € por día. Más barato que Italia. Las islas menos turísticas (Naxos, Paros, Ios) ofrecen la mejor relación calidad-precio.' },
      { type: 'sub', title: 'Comer barato' },
      { type: 'rule', icon: '🥙', text: 'Gyros: menos de 5 €. Souvlaki: 2 a 3 €.' },
      { type: 'rule', icon: '🛒', text: 'Supermercados: feta, pita, yogur, tomates, aceitunas. Muy baratos.' },
      { type: 'sub', title: 'Transporte' },
      { type: 'text', text: 'Bus KTEL: unos 5 €/100 km (tarifas fijadas por el gobierno). Ferries para las islas: asequibles, reserva 2 a 3 meses con antelación para las rutas populares.' },
    ]},
    sleep: { filterTypes: ['b', 'q', 'a'], blocks: [
      { type: 'text', text: 'La acampada libre está oficialmente prohibida en Grecia. Multa: 150 €, pudiendo llegar hasta 3.000 € + 3 meses de cárcel en zonas turísticas o reservas naturales.' },
      { type: 'sub', title: 'En la práctica' },
      { type: 'text', text: 'La prohibición se aplica del amanecer al atardecer. Dormir de noche y recoger por la mañana está ampliamente tolerado en temporada baja y lejos de las zonas turísticas. Las playas aisladas son fáciles de encontrar.' },
      { type: 'sub', title: 'Alternativas' },
      { type: 'rule', icon: '🛋️', text: 'Couchsurfing: comunidad activa en Atenas y Tesalónica.' },
      { type: 'rule', icon: '🏠', text: 'Invitaciones espontáneas: los griegos invitan regularmente a los viajeros a cenar o dormir en sus casas, especialmente en zona rural y en las islas.' },
      { type: 'sub', title: 'Alojamiento' },
      { type: 'kv', items: [
        { k: 'Albergues Atenas', v: '9 a 25 €/noche' },
        { k: 'Albergues islas', v: '20 a 25 €/noche' },
        { k: 'Estudios en Booking', v: 'desde 10 €/pers/noche' },
      ]},
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'La red de autobuses KTEL es tan barata que el autostop a veces es menos necesario en Grecia.' },
      { type: 'sub', title: 'Opciones' },
      { type: 'transport', items: [
        { emoji: '🚌', name: 'KTEL (bus interurbano)', detail: 'Red extensa, incluso los pueblos pequeños. Tarifas fijadas por el Estado.', price: '~5 €/100 km' },
        { emoji: '⛴️', name: 'Ferries', detail: 'Esenciales para las islas. Ferries nocturnos = ahorrar un alojamiento.', price: '10 a 50 €' },
        { emoji: '🚃', name: 'Trenes', detail: 'Red limitada pero hasta 50% más barato que el bus', price: '' },
        { emoji: '🚗', name: 'BlaBlaCar', detail: 'Disponible en Grecia', price: '' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'La ventana ideal va de finales de mayo a principios de octubre. Junio y septiembre son el punto ideal: clima veraniego sin calor extremo ni multitudes.' },
      { type: 'sub', title: 'Resumen por mes' },
      { type: 'season', months: [
        { name: 'Ene', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mar', level: 'ok' },
        { name: 'Abr', level: 'good' }, { name: 'May', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'good' }, { name: 'Ago', level: 'ok' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'bad' }, { name: 'Dic', level: 'bad' },
      ]},
      { type: 'warn', text: '⚠️ De noviembre a marzo, la mayoría de las islas cierran (hoteles, restaurantes, ferries reducidos). El continente sigue accesible pero hay muy pocos turistas en las carreteras.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Grecia es el país de la philoxenia (el amor a los extranjeros). Es un valor cultural profundo que se remonta a la Grecia antigua: Zeus Xenios protegía a los viajeros, y cualquier extranjero podía ser un dios disfrazado.' },
      { type: 'sub', title: 'En la práctica' },
      { type: 'text', text: 'Los conductores que paran a menudo alojan gratuitamente a los viajeros, les invitan a cenar, les hacen visitar la región. La hospitalidad griega es sincera y generosa, incluso entre la gente más modesta.' },
      { type: 'rule', icon: '🎁', text: 'Acepta las invitaciones (rechazar puede parecer un desaire). Lleva un pequeño regalo (pastelería, vino) si te invitan a una casa.' },
      { type: 'sub', title: 'Eventos' },
      { type: 'event', items: [
        { month: 'Feb-Mar', day: '⟳', name: 'Apokries (Carnaval)', desc: 'Patras tiene el mayor carnaval de Grecia.' },
        { month: 'Abr', day: '⟳', name: 'Pascua ortodoxa', desc: 'La mayor fiesta de Grecia. Corderos asados, fuegos artificiales.' },
        { month: 'Jun', day: '⟳', name: 'Festival de Atenas', desc: 'Teatro, música, danza en el Odeón de Herodes Ático.' },
        { month: 'Ago', day: '15', name: 'Asunción (Dekapentavgoustos)', desc: 'Mayor fiesta estival. Peregrinaciones, fiestas en las islas.' },
        { month: 'Oct', day: '28', name: 'Día del No (Ochi)', desc: 'Fiesta nacional, desfiles militares.' },
      ]},
      { type: 'tip', text: '💡 Dicho cretense: "Un invitado en casa es un regalo de Dios." En zona rural, la llegada de un extranjero sigue siendo un evento especial.' },
    ]},
  },

  // ==================== NORWAY ====================
  NO: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'El autostop es legal en Noruega. Prohibido en las autopistas en sí pero permitido en las rampas de acceso, gasolineras y carreteras secundarias. Desde 2024, casi todos los ferries costeros son gratuitos para los peatones.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Noruega funciona bien para el autostop pero la progresión es lenta por las carreteras sinuosas de montaña y el tráfico disperso. Prevé ~500 km/día máximo.' },
      { type: 'sub', title: 'Diferencias norte/sur' },
      { type: 'kv', items: [
        { k: 'Norte (Lofoten, Tromsø, Nordkapp)', v: 'Excelente (5 a 30 min)', color: 'green' },
        { k: 'Centro (Trondheim)', v: 'Correcto', color: 'green' },
        { k: 'Sur (Oslo, Stavanger)', v: 'Difícil (hasta 2h)', color: 'amber' },
      ]},
      { type: 'text', text: 'Las Lofoten son un paraíso para el autostop: una sola carretera principal (E10), paisajes espectaculares, conductores acogedores. En el norte, muchos conductores nunca han visto un autostopista.' },
      { type: 'tip', text: '💡 En los ferries, acércate a los conductores ANTES del embarque en vez de después. Están esperando y tienen tiempo para charlar.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Noruega es uno de los países más seguros del mundo. El principal riesgo es el clima y el aislamiento, no la gente.' },
      { type: 'sub', title: 'Usa SpotHitch para tu seguridad' },
      { type: 'rule', icon: '🛡️', text: 'Activa el Modo Guardián antes de cada viaje. Una persona de confianza sigue tu posición en tiempo real.' },
      { type: 'rule', icon: '🆘', text: 'Configura el modo SOS con tus contactos. Un toque activa una triple alerta (push, SMS, llamada).' },
      { type: 'rule', icon: '📱', text: 'Fotografía la matrícula y envíala a alguien antes de subir.' },
      { type: 'rule', icon: '🎒', text: 'Mantén tu mochila accesible (en tu regazo o a tus pies), nunca en el maletero.' },
      { type: 'sub', title: 'Consejos del país' },
      { type: 'rule', icon: '❄️', text: 'En invierno, las temperaturas son extremas y los días muy cortos. Prevé ropa de abrigo y reflectante.' },
      { type: 'rule', icon: '🛣️', text: 'Las distancias son largas entre ciudades. Lleva agua, comida y un cargador portátil.' },
      { type: 'sub', title: 'Números de emergencia' },
      { type: 'kv', items: [{ k: 'Emergencias', v: '112' }, { k: 'Polic��a', v: '02800' }, { k: 'Ambulancia', v: '113' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Escandinavia es descrita como "la región perfecta para probar el autostop como mujer". El estatus de la mujer en la sociedad nórdica es muy alto y el acoso es casi inexistente.' },
      { type: 'text', text: 'Noruega se presta muy bien al autostop en solitario para las mujeres. La acogida es cálida y los encuentros positivos son la norma.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Casi todos los noruegos hablan inglés con fluidez. Ninguna barrera idiomática.' },
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Noruega es extremadamente cara. Los precios alimentarios son aproximadamente el doble que los de Francia, incluso en los supermercados discount (Rema 1000, Kiwi). Una comida en restaurante es prohibitiva para un mochilero.' },
      { type: 'text', text: 'La combinación autostop + acampada libre (gratis gracias al Allemannsretten) + cocinar con hornillo es la única estrategia viable para viajar con presupuesto ajustado.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'El Allemannsretten (derecho de acceso público) está inscrito en la ley noruega de 1957. Puedes acampar gratis en las tierras no cultivadas (bosques, montañas, páramos, orillas) sin autorización.' },
      { type: 'sub', title: 'Reglas' },
      { type: 'rule', icon: '✅', text: 'Camping gratis hasta 2 noches en el mismo sitio.' },
      { type: 'rule', icon: '✅', text: 'Recolección de bayas y setas autorizada.' },
      { type: 'rule', icon: '🚫', text: 'Mantener mínimo 150 m de las viviendas.' },
      { type: 'rule', icon: '🚫', text: 'Sin fuego en plena naturaleza.' },
      { type: 'rule', icon: '🚫', text: 'No en tierras cultivadas.' },
      { type: 'warn', text: '⚠️ En las Lofoten, existen restricciones locales por el sobreturismo. Infórmate localmente.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '⛴️', name: 'Ferries costeros', detail: 'Gratuitos para peatones desde 2024', price: 'gratuito' },
        { emoji: '🚌', name: 'Vy Bus4You', detail: 'Buses interurbanos asequibles', price: '' },
        { emoji: '🚌', name: 'FlixBus', detail: 'Algunas líneas en Noruega', price: 'desde 5 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Ene', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mar', level: 'bad' },
        { name: 'Abr', level: 'ok' }, { name: 'May', level: 'good' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Ago', level: 'great' }, { name: 'Sep', level: 'ok' },
        { name: 'Oct', level: 'bad' }, { name: 'Nov', level: 'bad' }, { name: 'Dic', level: 'bad' },
      ]},
      { type: 'text', text: 'Junio a agosto: sol de medianoche al norte del círculo polar. Días casi infinitos. Septiembre: temporada media (más frío, menos tráfico). Invierno: extremadamente difícil (noche polar, frío, hielo, muy pocos coches).' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Los noruegos son reservados en el primer contacto pero serviciales. En el norte, la gente es notablemente más cálida y acogedora. Los conductores a veces hacen un desvío para dejarte en el sitio correcto.' },
      { type: 'sub', title: 'Eventos' },
      { type: 'event', items: [
        { month: 'May', day: '17', name: 'Syttende Mai', desc: 'Fiesta nacional. Desfiles, trajes tradicionales en todo el país.' },
        { month: 'Jun', day: '23', name: 'Sankthansaften', desc: 'Hogueras de San Juan en las playas y fiordos.' },
        { month: 'Jul', day: '⟳', name: 'Midnight Sun Marathon (Tromsø)', desc: 'Maratón bajo el sol de medianoche.' },
      ]},
    ]},
  },

  // ==================== SWEDEN ====================
  SE: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'El autostop es legal en Suecia. Prohibido en las autopistas pero permitido en las rampas y gasolineras. La reputación de "país donde está prohibido" es un mito: nadie te molestará.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Suecia tiene mala reputación entre los autostopistas, pero los viajeros experimentados dicen que "realmente no es tan malo como todo el mundo dice". Tiempo de espera medio: ~30 minutos. El norte es notablemente más fácil que el sur.' },
      { type: 'text', text: 'Los comentarios de experiencia son mayoritariamente positivos, incluso en solitario. El enfoque directo en las gasolineras funciona mejor que el pulgar al borde de la carretera.' },
      { type: 'tip', text: '💡 Las grandes gasolineras (Rasta) a lo largo de las autopistas son los mejores spots para el autostop.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Suecia es un país muy seguro. Ningún incidente reportado por autostopistas. El principal riesgo son las largas distancias en el norte.' },
      { type: 'sub', title: 'Usa SpotHitch para tu seguridad' },
      { type: 'rule', icon: '🛡️', text: 'Activa el Modo Guardián antes de cada viaje. Una persona de confianza sigue tu posición en tiempo real.' },
      { type: 'rule', icon: '🆘', text: 'Configura el modo SOS con tus contactos. Un toque activa una triple alerta (push, SMS, llamada).' },
      { type: 'rule', icon: '📱', text: 'Fotografía la matrícula y envíala a alguien antes de subir.' },
      { type: 'rule', icon: '🎒', text: 'Mantén tu mochila accesible (en tu regazo o a tus pies), nunca en el maletero.' },
      { type: 'sub', title: 'Consejos del país' },
      { type: 'rule', icon: '🌲', text: 'En el norte, las distancias son inmensas y el tráfico escaso. Prevé esperas largas y equipo adecuado.' },
      { type: 'rule', icon: '☀️', text: 'En verano, los días son muy largos (hasta 24h de luz en el norte). Aprovéchalo para avanzar.' },
      { type: 'sub', title: 'Números de emergencia' },
      { type: 'kv', items: [{ k: 'Emergencias', v: '112' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Suecia es uno de los países más igualitarios del mundo. Las mujeres son recogidas haciendo dedo más rápidamente que los hombres. Escandinavia es descrita como "la región perfecta para probar el autostop como mujer".' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Casi todos los suecos hablan inglés con fluidez. Ninguna barrera idiomática. La palabra sueca para autostop es "lifta".' },
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Caro pero un poco menos que Noruega. Supermercados discount: Lidl, Willys, ICA Maxi. Cocinar uno mismo es esencial.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'El Allemansrätten (derecho de acceso público) está inscrito en la Constitución sueca desde 1994. Puedes plantar tu tienda en cualquier terreno no cultivado durante 1 a 2 noches sin autorización.' },
      { type: 'sub', title: 'Reglas' },
      { type: 'rule', icon: '✅', text: '1 a 2 noches en el mismo sitio, no en terreno cercado o cultivado.' },
      { type: 'rule', icon: '✅', text: 'Recolección de bayas, setas y flores silvestres autorizada.' },
      { type: 'rule', icon: '🚫', text: 'Mantener 150 a 200 m de las viviendas.' },
      { type: 'rule', icon: '🚫', text: 'Hogueras solo cuando las condiciones sean seguras (prohibiciones frecuentes en verano).' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'FlixBus / FlixTrain', detail: 'Opera en Suecia', price: 'desde 5 €' },
        { emoji: '🚃', name: 'SJ (trenes suecos)', detail: 'Reserva con antelación para descuentos', price: '' },
        { emoji: '🤝', name: 'Skjutsgruppen.nu', detail: 'Plataforma sueca de coche compartido', price: '' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Ene', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mar', level: 'ok' },
        { name: 'Abr', level: 'ok' }, { name: 'May', level: 'good' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Ago', level: 'great' }, { name: 'Sep', level: 'good' },
        { name: 'Oct', level: 'ok' }, { name: 'Nov', level: 'bad' }, { name: 'Dic', level: 'bad' },
      ]},
      { type: 'text', text: 'Junio a agosto: días largos, clima suave, máximo de tráfico. Atención a los mosquitos en Laponia (junio a julio). Invierno: difícil (-20°C en el norte, oscuridad).' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Los suecos son introvertidos y no se acercarán a ti, pero son serviciales cuando TÚ los abordas. En el norte, la gente "no dejará que un extranjero se congele afuera". Quítate los zapatos al entrar en una casa o en la cabina de un camión.' },
      { type: 'sub', title: 'Eventos' },
      { type: 'event', items: [
        { month: 'Jun', day: '⟳', name: 'Midsommar', desc: 'Solsticio de verano. Baile alrededor del mástil, coronas de flores, fiesta nacional.' },
        { month: 'Ago', day: '⟳', name: 'Fiesta del cangrejo (Kräftskiva)', desc: 'Fiestas de cangrejos de río al aire libre en todo el país.' },
        { month: 'Dic', day: '13', name: 'Lucia', desc: 'Procesiones con velas, canciones tradicionales.' },
      ]},
    ]},
  },

  // ==================== ICELAND ====================
  IS: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'El autostop es perfectamente legal y socialmente aceptado en Islandia. Ninguna restricción. Es una práctica habitual, especialmente en la Ruta 1 (Ring Road).' },
      { type: 'warn', text: '⚠️ La policía fronteriza puede pedir una prueba de fondos suficientes (tarjeta bancaria o efectivo). La entrada puede ser denegada sin ello.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Islandia es muy fácil para el autostop en verano. Tiempo de espera medio: 5 a 30 minutos en la Ring Road. Los islandeses Y los turistas en coche de alquiler paran.' },
      { type: 'sub', title: 'Por zona' },
      { type: 'kv', items: [
        { k: 'Ring Road (Ruta 1)', v: 'Muy fácil', color: 'green' },
        { k: 'Reikiavik → Akranes (bus + autostop)', v: 'Fácil', color: 'green' },
        { k: 'Fiordos del Oeste', v: 'Muy difícil (locales reservados)', color: 'red' },
        { k: 'Interior / Highlands', v: 'Casi imposible (sin tráfico)', color: 'red' },
      ]},
      { type: 'text', text: 'No intentes salir de Reikiavik haciendo dedo directamente. Toma un bus hasta Akranes y empieza desde allí. Las estaciones N1 son los centros sociales de los pueblos y buenos spots.' },
      { type: 'tip', text: '💡 Samferda.is: plataforma islandesa de coche compartido donde puedes compartir los gastos de gasolina.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Islandia está considerada el país más seguro del mundo para viajeros. El verdadero peligro es el clima, que cambia en pocos minutos.' },
      { type: 'sub', title: 'Usa SpotHitch para tu seguridad' },
      { type: 'rule', icon: '🛡️', text: 'Activa el Modo Guardián antes de cada viaje. Una persona de confianza sigue tu posición en tiempo real.' },
      { type: 'rule', icon: '🆘', text: 'Configura el modo SOS con tus contactos. Un toque activa una triple alerta (push, SMS, llamada).' },
      { type: 'rule', icon: '📱', text: 'Fotografía la matrícula y envíala a alguien antes de subir.' },
      { type: 'rule', icon: '🎒', text: 'Mantén tu mochila accesible (en tu regazo o a tus pies), nunca en el maletero.' },
      { type: 'sub', title: 'Consejos del país' },
      { type: 'rule', icon: '🌬️', text: 'El tiempo cambia en minutos. Lleva siempre ropa impermeable y capas térmicas, incluso en verano.' },
      { type: 'rule', icon: '🛣️', text: 'La carretera circular (Ring Road) es el eje principal. Las gasolineras N1 son los spots más seguros.' },
      { type: 'sub', title: 'Números de emergencia' },
      { type: 'kv', items: [{ k: 'Emergencias', v: '112' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Islandia es la referencia mundial en igualdad de género y seguridad para las mujeres. El autostop funciona perfectamente para las mujeres solas. Los automovilistas a menudo quieren ayudarte aún más cuando eres mujer.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Casi todos los islandeses hablan inglés con fluidez. Ninguna barrera idiomática. Los turistas de todas las nacionalidades también ofrecen viajes.' },
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Islandia es el país nórdico más caro. Presupuesto mínimo: 60 a 100 €/día. El autostop es la estrategia clave para reducir el principal gasto (el alquiler de coche, muy caro). Moneda: corona islandesa (ISK). El supermercado más barato es Bonus.' },
      { type: 'sub', title: 'Alojamiento' },
      { type: 'kv', items: [
        { k: 'Campings oficiales', v: '5 a 25 €/noche' },
        { k: 'Albergues (dormitorio Reikiavik)', v: 'desde ~30 €/noche' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q', 'a'], blocks: [
      { type: 'text', text: 'La acampada libre con tienda está autorizada únicamente en zona inhabitada, por 1 noche, con máximo 3 tiendas, y si no hay cartel de prohibición. Las autocaravanas DEBEN permanecer en campings oficiales (ley de 2015).' },
      { type: 'warn', text: '⚠️ Desde 2017, las reglas se han endurecido por el comportamiento de algunos turistas. En zona habitada (sur de Islandia), el camping fuera de campings está prohibido.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'No hay ferrocarril en Islandia. Los autobuses existen pero son caros y poco frecuentes.' },
      { type: 'sub', title: 'Opciones' },
      { type: 'transport', items: [
        { emoji: '🤝', name: 'Samferda.is', detail: 'Coche compartido islandés, compartir gastos de gasolina', price: '' },
        { emoji: '✈️', name: 'Vuelos interiores', detail: 'Reikiavik-Akureyri (Icelandair Connect)', price: '' },
        { emoji: '⛴️', name: 'Ferry Smyril Line', detail: 'Dinamarca → Feroe → Islandia (Seyðisfjörður)', price: '' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Ene', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mar', level: 'bad' },
        { name: 'Abr', level: 'bad' }, { name: 'May', level: 'ok' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Ago', level: 'great' }, { name: 'Sep', level: 'ok' },
        { name: 'Oct', level: 'bad' }, { name: 'Nov', level: 'bad' }, { name: 'Dic', level: 'bad' },
      ]},
      { type: 'text', text: 'Junio a agosto exclusivamente. Casi 24h de luz, más tráfico (turistas), temperaturas suaves (10 a 15°C). Mayo y septiembre posibles pero más fríos y menos coches. Invierno: casi imposible (oscuridad, tormentas, muy pocos coches).' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Los islandeses son acogedores y confiados gracias al aislamiento histórico y la pequeña población (~370.000). El turismo es una industria importante, así que los locales están acostumbrados a los visitantes. Los islandeses en grandes 4x4 paran más a menudo que los turistas en coches de alquiler (a menudo llenos).' },
      { type: 'sub', title: 'Eventos' },
      { type: 'event', items: [
        { month: 'Feb', day: '⟳', name: 'Þorrablót', desc: 'Festival gastronómico vikingo con platos tradicionales.' },
        { month: 'Jun', day: '17', name: 'Fiesta nacional', desc: 'Celebración de la independencia, desfiles.' },
        { month: 'Ago', day: '⟳', name: 'Þjóðhátíð (Vestmannaeyjar)', desc: 'Mayor festival de Islandia, música y hogueras.' },
      ]},
    ]},
  },

  // ==================== FINLAND ====================
  FI: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'El autostop es legal en Finlandia. Prohibido en las autopistas (moottoritie) y ciertas vías rápidas (moottoriliikennetie). Permitido en las rampas de acceso (a menudo con parada de bus) y en las gasolineras.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Finlandia es un país con resultados mixtos para el autostop. Los finlandeses son introvertidos y dudan en llevar desconocidos. El sur y las ciudades (Helsinki, Tampere) son difíciles. Pero cuanto más subes hacia el norte (Laponia), más fácil se vuelve.' },
      { type: 'sub', title: 'Paradoja lapona' },
      { type: 'text', text: 'En Laponia, a veces solo pasan 5 coches por hora en las carreteras secundarias. Pero los conductores recorren distancias muy largas y aprecian la compañía. Paran más fácilmente, especialmente con mal tiempo (compasión).' },
      { type: 'tip', text: '💡 Los conductores finlandeses necesitan un espacio seguro para parar. Colócate donde haya claramente sitio para aparcar.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Finlandia es uno de los países más seguros del mundo. Los finlandeses son discretos pero muy serviciales.' },
      { type: 'sub', title: 'Usa SpotHitch para tu seguridad' },
      { type: 'rule', icon: '🛡️', text: 'Activa el Modo Guardián antes de cada viaje. Una persona de confianza sigue tu posición en tiempo real.' },
      { type: 'rule', icon: '🆘', text: 'Configura el modo SOS con tus contactos. Un toque activa una triple alerta (push, SMS, llamada).' },
      { type: 'rule', icon: '📱', text: 'Fotografía la matrícula y envíala a alguien antes de subir.' },
      { type: 'rule', icon: '🎒', text: 'Mantén tu mochila accesible (en tu regazo o a tus pies), nunca en el maletero.' },
      { type: 'sub', title: 'Consejos del país' },
      { type: 'rule', icon: '🌲', text: 'En Laponia, las distancias son largas y el tráfico escaso. Prevé comida, agua y ropa de abrigo.' },
      { type: 'rule', icon: '😊', text: 'Los finlandeses son reservados pero amables. Si paran, es que de verdad quieren ayudarte.' },
      { type: 'sub', title: 'Números de emergencia' },
      { type: 'kv', items: [{ k: 'Emergencias', v: '112' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Finlandia y Escandinavia son descritas como "la región perfecta para probar el autostop como mujer". El estatus de la mujer en la sociedad nórdica es muy alto y no serás acosada en ningún sitio.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'La mayoría de los finlandeses hablan inglés, especialmente los jóvenes y en la ciudad. El finés y el sueco son los idiomas oficiales. El finés es muy diferente de las lenguas escandinavas y difícil de aprender.' },
      { type: 'phrase', items: [
        { local: 'Kiitos paljon', meaning: 'Muchas gracias' },
        { local: 'Kyyti', meaning: 'Un viaje' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Los alimentos son muy caros comparados con el resto de Europa. La combinación autostop + acampada libre (Jokamiehenoikeus) + cocinar con hornillo es la estrategia presupuestaria.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'El Jokamiehenoikeus (derecho de acceso público) permite acampar gratis en las tierras no cultivadas. Puedes recoger bayas, setas y pescar con caña.' },
      { type: 'rule', icon: '✅', text: 'Camping gratis en terreno no cultivado, 1 a 2 noches.' },
      { type: 'rule', icon: '🚫', text: 'Las hogueras NO forman parte del Jokamiehenoikeus. Solo en los emplazamientos designados.' },
      { type: 'rule', icon: '🚫', text: 'En los parques nacionales: únicamente en las zonas de tiendas designadas.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Onnibus', detail: 'Bus de larga distancia, muy barato', price: 'desde 1 €' },
        { emoji: '🚌', name: 'FlixBus', detail: 'Algunas líneas en Finlandia', price: 'desde 5 €' },
        { emoji: '🚃', name: 'VR (trenes finlandeses)', detail: 'Reserva con antelación para descuentos', price: '' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Ene', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mar', level: 'bad' },
        { name: 'Abr', level: 'ok' }, { name: 'May', level: 'good' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Ago', level: 'good' }, { name: 'Sep', level: 'ok' },
        { name: 'Oct', level: 'bad' }, { name: 'Nov', level: 'bad' }, { name: 'Dic', level: 'bad' },
      ]},
      { type: 'warn', text: '⚠️ En junio y julio en Laponia, los mosquitos son un problema importante. Prevé repelente y una mosquitera.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Los finlandeses son reservados pero los encuentros son cálidos una vez establecido el contacto. En Laponia, la gente es particularmente acogedora. La hospitalidad es sincera.' },
      { type: 'sub', title: 'Eventos' },
      { type: 'event', items: [
        { month: 'Feb', day: '⟳', name: 'Mercado de Jokkmokk', desc: 'Mercado sami histórico en Laponia (también del lado sueco).' },
        { month: 'Jun', day: '⟳', name: 'Juhannus (Midsommar)', desc: 'Solsticio de verano, hogueras, saunas, lago.' },
        { month: 'Jul', day: '⟳', name: 'Wife Carrying Championship', desc: 'Carrera de portar mujeres en Sonkajärvi. Sí, es real.' },
        { month: 'Dic', day: '⟳', name: 'Pueblo de Papá Noel (Rovaniemi)', desc: 'Turismo invernal, auroras boreales.' },
      ]},
    ]},
  },

  // ==================== DENMARK ====================
  DK: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'El autostop es legal en Dinamarca excepto en las autopistas (peatones prohibidos). Puedes hacer dedo desde las rampas de acceso. Controles en fronteras posibles: ten siempre tu pasaporte.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Dinamarca es uno de los mejores países de Europa para el autostop, comparable a Serbia. Tiempo de espera: 10 a 20 minutos máximo. La gente es relajada y te lleva donde quieras.' },
      { type: 'text', text: 'Los trayectos son cortos (unas decenas de km hasta la próxima ciudad) así que prevé varios viajes por día. Los ferries forman parte de la experiencia: a menudo son gratuitos para peatones o facturados por vehículo.' },
      { type: 'tip', text: '💡 El terreno plano y la densa red de carreteras hacen Dinamarca muy accesible. Es un excelente país para empezar con el autostop.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Dinamarca es un país muy seguro. Los daneses son simpáticos, generosos y abiertos. Todo el mundo para.' },
      { type: 'sub', title: 'Usa SpotHitch para tu seguridad' },
      { type: 'rule', icon: '🛡️', text: 'Activa el Modo Guardián antes de cada viaje. Una persona de confianza sigue tu posición en tiempo real.' },
      { type: 'rule', icon: '🆘', text: 'Configura el modo SOS con tus contactos. Un toque activa una triple alerta (push, SMS, llamada).' },
      { type: 'rule', icon: '📱', text: 'Fotografía la matrícula y envíala a alguien antes de subir.' },
      { type: 'rule', icon: '🎒', text: 'Mantén tu mochila accesible (en tu regazo o a tus pies), nunca en el maletero.' },
      { type: 'sub', title: 'Consejos del país' },
      { type: 'rule', icon: '🚗', text: 'El país es pequeño y bien conectado. Las gasolineras de autopista son los mejores spots.' },
      { type: 'rule', icon: '🌧️', text: 'El tiempo es impredecible. Lleva siempre un chubasquero, incluso en verano.' },
      { type: 'sub', title: 'Números de emergencia' },
      { type: 'kv', items: [{ k: 'Emergencias', v: '112' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Dinamarca es segura para las mujeres que hacen autostop solas. Los viajes vienen de personas de todas las edades y géneros. La práctica está lo suficientemente normalizada como para que todo el mundo pare.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'TODOS los conductores hablan inglés. En el oeste y el sur del país, muchos hablan también alemán. La comunicación es cero problemas.' },
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Dinamarca es el más barato de los 5 países nórdicos, pero sigue siendo caro comparado con el resto de Europa. Supermercados discount: Netto, Rema 1000, Lidl. La comida callejera (perritos calientes, shawarma) es relativamente asequible.' },
    ]},
    sleep: { filterTypes: ['b', 'q', 'a'], blocks: [
      { type: 'text', text: 'Dinamarca NO tiene derecho de acceso a la naturaleza como Noruega o Suecia. La acampada libre está prohibida (multa 40 a 135 €). Pero existen alternativas legales gratuitas.' },
      { type: 'sub', title: 'Alternativas gratuitas' },
      { type: 'rule', icon: '✅', text: 'Fri Teltning: 275+ zonas de camping gratuito en bosques del Estado. 1 noche máx., 2 tiendas pequeñas máx., sin coche.' },
      { type: 'rule', icon: '✅', text: 'Shelterplads: refugios forestales gratuitos disponibles en muchos bosques.' },
      { type: 'rule', icon: '✅', text: 'Naturlagerplätze: sitios naturales en terrenos de agricultores o comunales, ~3 €/noche, máx. 2 noches.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'FlixBus', detail: 'Red extensa en Dinamarca', price: 'desde 5 €' },
        { emoji: '🚃', name: 'DSB (trenes daneses)', detail: 'Billetes Orange (compra anticipada = muy baratos)', price: '' },
        { emoji: '⛴️', name: 'Ferries', detail: 'Entre las islas, algunos gratuitos para peatones', price: '' },
        { emoji: '🚲', name: 'Bicicleta', detail: 'Dinamarca es plana con excelentes carriles bici', price: '' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Ene', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mar', level: 'ok' },
        { name: 'Abr', level: 'good' }, { name: 'May', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Ago', level: 'great' }, { name: 'Sep', level: 'good' },
        { name: 'Oct', level: 'ok' }, { name: 'Nov', level: 'bad' }, { name: 'Dic', level: 'bad' },
      ]},
      { type: 'text', text: 'Mayo a septiembre. Dinamarca tiene un clima más suave que los otros países nórdicos. Verano: 15 a 22°C, días largos. Invierno: no recomendado (frío, húmedo, oscuro, pocos coches).' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Los daneses son los más relajados de todos los nórdicos para el autostop. Amigables, abiertos, serviciales. Es habitual que te inviten a un café y se desvíen para dejarte en el sitio correcto.' },
      { type: 'sub', title: 'Eventos' },
      { type: 'event', items: [
        { month: 'Jun', day: '23', name: 'Sankt Hans Aften', desc: 'Hogueras de San Juan en las playas. Tradición nacional.' },
        { month: 'Jul', day: '⟳', name: 'Roskilde Festival', desc: 'Mayor festival de música del norte de Europa, 130.000 personas.' },
        { month: 'Dic', day: '⟳', name: 'Mercados navideños (Tivoli)', desc: 'Tivoli Gardens en Copenhague, mágico.' },
      ]},
    ]},
  },

  // ==================== UNITED KINGDOM ====================
  GB: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'El autostop es legal en el Reino Unido. Caminar por las autopistas (motorways) está prohibido. El autostop se hace desde la base de las rampas de acceso (slip roads) y en las áreas de servicio (motorway services).' },
      { type: 'sub', title: 'Por nación' },
      { type: 'rule', icon: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', text: 'Escocia: permitido incluso en las vías rápidas de doble calzada (A9, A90). Acampada libre legal.' },
      { type: 'rule', icon: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', text: 'Gales: sin restricción específica. Mentalidad rural acogedora.' },
      { type: 'rule', icon: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', text: 'Inglaterra: legal pero menos practicado y menos fácil.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'El Reino Unido es muy variable según la región. Pocos automovilistas paran en Inglaterra, pero en Escocia y Gales es notablemente más fácil.' },
      { type: 'sub', title: 'Por región' },
      { type: 'kv', items: [
        { k: 'Highlands de Escocia', v: 'Excelente (1 coche de cada 5)', color: 'green' },
        { k: 'Gales rural', v: 'Bueno y agradable', color: 'green' },
        { k: 'Suroeste de Inglaterra', v: 'Correcto', color: 'green' },
        { k: 'Norte de Inglaterra', v: 'Regular', color: 'amber' },
        { k: 'Sureste / Londres', v: 'Muy difícil', color: 'red' },
      ]},
      { type: 'text', text: 'La NC500 (North Coast 500) en Escocia es excelente en verano: turistas de todo el mundo. Fort William es un hub ideal. En Inglaterra, los antiguos estudiantes de los años 70 y 80 son los más propensos a parar.' },
      { type: 'tip', text: '💡 Usa los nombres de autopista (M4, M1) en tu cartel en lugar de nombres de ciudad. Es la convención británica para el autostop de larga distancia.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'El Reino Unido es globalmente seguro. La policía es comprensiva e incluso puede ayudarte a encontrar un mejor spot.' },
      { type: 'sub', title: 'Usa SpotHitch para tu seguridad' },
      { type: 'rule', icon: '🛡️', text: 'Activa el Modo Guardián antes de cada viaje. Una persona de confianza sigue tu posición en tiempo real.' },
      { type: 'rule', icon: '🆘', text: 'Configura el modo SOS con tus contactos. Un toque activa una triple alerta (push, SMS, llamada).' },
      { type: 'rule', icon: '📱', text: 'Fotografía la matrícula y envíala a alguien antes de subir.' },
      { type: 'rule', icon: '🎒', text: 'Mantén tu mochila accesible (en tu regazo o a tus pies), nunca en el maletero.' },
      { type: 'sub', title: 'Consejos del país' },
      { type: 'rule', icon: '🚗', text: 'Los coches circulan por la izquierda. Colócate del lado correcto de la carretera para ser visible.' },
      { type: 'rule', icon: '⛽', text: 'Las estaciones de servicio de motorway son los mejores spots. Aborda a los conductores mientras repostan.' },
      { type: 'sub', title: 'Números de emergencia' },
      { type: 'kv', items: [{ k: 'Emergencias', v: '999 o 112' }] },
    ]},
    women: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'Los hombres paran más a menudo que las mujeres para recoger autostopistas. Paradójicamente, muchos conductores dicen que pararían más fácilmente por una mujer que por un hombre solo.' },
      { type: 'text', text: 'Viajeras han recorrido Escocia y Gales solas sin problemas. La acampada libre en Escocia es legal y muy segura.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Ninguna barrera. El inglés está en todas partes. Algunos acentos regionales (Highlands escoceses, Gales rural) pueden ser espesos, pero la comunicación nunca es un problema.' },
      { type: 'text', text: 'En el Reino Unido, se dice "lift" para un viaje y "lorry" para un camión.' },
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'El Reino Unido es caro, pero el autostop ayuda considerablemente. Moneda: libra esterlina (GBP).' },
      { type: 'sub', title: 'Comer barato' },
      { type: 'rule', icon: '🛒', text: 'Aldi y Lidl para las compras. Menús early-bird en los restaurantes antes de las 18h.' },
      { type: 'sub', title: 'Alojamiento' },
      { type: 'kv', items: [{ k: 'Albergues YHA (dormitorio)', v: '15 a 30 £/noche' }] },
    ]},
    sleep: { filterTypes: ['b', 'q', 'a'], blocks: [
      { type: 'text', text: 'Las reglas varían considerablemente según la nación.' },
      { type: 'sub', title: 'Escocia' },
      { type: 'rule', icon: '✅', text: 'Acampada libre LEGAL casi en todas partes (Scottish Outdoor Access Code). Excepción: parque de Loch Lomond en verano (permiso requerido).' },
      { type: 'rule', icon: '✅', text: 'Bothies: cabañas de pastor semi-abandonadas, gratuitas, mantenidas por la Mountain Bothies Association.' },
      { type: 'sub', title: 'Inglaterra y Gales' },
      { type: 'rule', icon: '🚫', text: 'Acampada libre técnicamente prohibida (infracción civil, no penal). Excepción: Dartmoor National Park (zonas designadas).' },
      { type: 'rule', icon: '✅', text: 'Nearly Wild Camping: red de 100+ sitios que acogen a campistas en busca de naturaleza.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Megabus', detail: 'Buses interurbanos muy baratos', price: 'desde 1 £' },
        { emoji: '🚌', name: 'National Express', detail: 'Mayor red de buses de larga distancia', price: 'desde 2 £' },
        { emoji: '🚌', name: 'FlixBus', detail: 'Líneas principales', price: 'desde 5 £' },
        { emoji: '🚗', name: 'BlaBlaCar', detail: 'Coche compartido', price: '' },
      ]},
      { type: 'tip', text: '💡 Los ferries (Dover, Holyhead) facturan por vehículo. Puedes cruzar gratis encontrando un conductor con sitio.' },
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Ene', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mar', level: 'ok' },
        { name: 'Abr', level: 'good' }, { name: 'May', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'good' }, { name: 'Ago', level: 'good' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'ok' }, { name: 'Nov', level: 'bad' }, { name: 'Dic', level: 'bad' },
      ]},
      { type: 'warn', text: '⚠️ En Escocia, los midges (mosquitos diminutos) son feroces de mayo a septiembre, peores en julio y agosto. Prevé un buen repelente.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'El autostop era muy popular en el Reino Unido en los años 70 y 80 (50% de los mayores de 55 lo hicieron). Solo el 7% de los 18 a 24 años lo han probado. La práctica se ve como pasada de moda pero quienes paran son a menudo antiguos autostopistas nostálgicos.' },
      { type: 'sub', title: 'Lo que funciona' },
      { type: 'rule', icon: '😁', text: 'Una gran sonrisa y contacto visual con cada conductor. Llevar ropa distintiva atrae atención positiva.' },
      { type: 'rule', icon: '📋', text: 'En las áreas de servicio, acércate a los conductores que entran/salen del edificio, no en el surtidor ("health and safety" obliga).' },
      { type: 'sub', title: 'Eventos' },
      { type: 'event', items: [
        { month: 'Jun', day: '⟳', name: 'Glastonbury Festival', desc: 'Mayor festival de música del mundo, Somerset.' },
        { month: 'Ago', day: '⟳', name: 'Edinburgh Fringe', desc: 'Mayor festival de artes del mundo, 3 semanas.' },
        { month: 'Nov', day: '5', name: 'Bonfire Night', desc: 'Fuegos artificiales en todo el país.' },
      ]},
    ]},
  },

  // ==================== IRELAND ====================
  IE: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'El autostop es legal en Irlanda excepto en las autopistas (motorways). En la práctica, incluso en las vías rápidas, la policía (Gardaí) rara vez interviene. Si lo hace, es para dirigirte a un lugar más seguro.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Irlanda es uno de los mejores países de Europa para el autostop. El tiempo de espera medio es de 5 minutos. Los coches a veces frenan al verte al borde de la carretera, sin que hagas el gesto.' },
      { type: 'sub', title: 'Por qué funciona tan bien' },
      { type: 'text', text: 'Muchas zonas rurales no tienen transporte público. Dar viajes forma parte de la vida cotidiana. Los irlandeses son sociables y aprecian la conversación. Un nuevo autostopista = un nuevo compañero de charla.' },
      { type: 'sub', title: 'Por zona' },
      { type: 'kv', items: [
        { k: 'Costa oeste (Wild Atlantic Way)', v: 'Excelente', color: 'green' },
        { k: 'Pueblos rurales pequeños', v: 'Excelente (gente curiosa)', color: 'green' },
        { k: 'Carreteras nacionales (R)', v: 'Muy bueno', color: 'green' },
        { k: 'Rotondas de autopista', v: 'Bueno (< 5 min)', color: 'green' },
        { k: 'Dublín / Cork / Limerick', v: 'Difícil de empezar', color: 'amber' },
      ]},
      { type: 'tip', text: '💡 Muchos trayectos cortos van más rápido que esperar un trayecto largo. Un cartel con el nombre del próximo pueblo reduce el tiempo de espera. Sal temprano por la mañana para pillar los camiones.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Irlanda está considerada como uno de los países más seguros del mundo para los viajeros. El autostop es una tradición ancestral.' },
      { type: 'sub', title: 'Usa SpotHitch para tu seguridad' },
      { type: 'rule', icon: '🛡️', text: 'Activa el Modo Guardián antes de cada viaje. Una persona de confianza sigue tu posición en tiempo real.' },
      { type: 'rule', icon: '🆘', text: 'Configura el modo SOS con tus contactos. Un toque activa una triple alerta (push, SMS, llamada).' },
      { type: 'rule', icon: '📱', text: 'Fotografía la matrícula y envíala a alguien antes de subir.' },
      { type: 'rule', icon: '🎒', text: 'Mantén tu mochila accesible (en tu regazo o a tus pies), nunca en el maletero.' },
      { type: 'sub', title: 'Consejos del país' },
      { type: 'rule', icon: '🌧️', text: 'El tiempo es muy cambiante. Lleva siempre un chubasquero y ropa de abrigo, incluso en verano.' },
      { type: 'rule', icon: '🍺', text: 'Los irlandeses son extremadamente acogedores. Es frecuente que te inviten a una pinta en el pub local.' },
      { type: 'sub', title: 'Números de emergencia' },
      { type: 'kv', items: [{ k: 'Emergencias', v: '112 o 999' }, { k: 'Gardaí (policía)', v: '112' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Irlanda está considerada como uno de los países más seguros para viajeras solas. Las experiencias son muy mayoritariamente positivas. Se aplican las precauciones estándar.' },
      { type: 'text', text: 'El Wild Atlantic Way se presta muy bien al autostop en pareja, con tiempos de espera de 5 a 15 minutos.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'El inglés es el idioma cotidiano en toda Irlanda. El gaélico irlandés (Gaeilge) solo lo hablan a diario ~4% de la población, en las zonas Gaeltacht (costa oeste). Incluso allí, todo el mundo habla inglés.' },
      { type: 'phrase', items: [
        { local: 'Dia dhuit', meaning: 'Hola (en gaélico)' },
        { local: 'Go raibh maith agat', meaning: 'Gracias (en gaélico)' },
      ]},
      { type: 'tip', text: '💡 Unas palabras de gaélico en las zonas rurales del oeste crean una calidez inmediata con los locales.' },
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Irlanda es moderadamente cara. La combinación autostop + camping + invitaciones de los locales hace el viaje muy asequible.' },
      { type: 'sub', title: 'Alojamiento' },
      { type: 'kv', items: [
        { k: 'Albergues (dormitorio)', v: '20 a 50 €/noche' },
        { k: 'B&B con desayuno', v: '60 a 80 €/noche' },
      ]},
      { type: 'rule', icon: '🛒', text: 'Aldi y Lidl para las compras. Menús early-bird en los restaurantes antes de las 18h.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'La acampada libre está tolerada y ampliamente no regulada en Irlanda. Hay campos vacíos disponibles "a pocos minutos de cualquier pueblo". Pedir permiso a los granjeros es recomendable pero a menudo les da igual.' },
      { type: 'rule', icon: '✅', text: 'Camping gratis en campos no cultivados (con permiso implícito).' },
      { type: 'rule', icon: '🚫', text: 'Evita campos con cultivos o ganado.' },
      { type: 'rule', icon: '🚫', text: 'Sin fuego visible desde las carreteras o las casas.' },
      { type: 'warn', text: '⚠️ Irlanda es muy húmeda. Una tienda con alta impermeabilidad (>3000mm) es esencial. El reto no es la lluvia fuerte sino la llovizna persistente que puede durar días.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Bus Éireann', detail: 'Servicio nacional de autobuses', price: '' },
        { emoji: '🚌', name: 'Dublin Coach / GoBus / Citylink', detail: 'Buses interurbanos más baratos', price: '' },
        { emoji: '🚗', name: 'BlaBlaCar', detail: 'Activo en Irlanda', price: '' },
        { emoji: '🚃', name: 'Irish Rail', detail: 'Red limitada, precios moderados', price: '' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Ene', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mar', level: 'ok' },
        { name: 'Abr', level: 'good' }, { name: 'May', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'good' }, { name: 'Ago', level: 'good' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'bad' }, { name: 'Dic', level: 'bad' },
      ]},
      { type: 'text', text: 'Mayo y junio: mejor clima, días más largos. Septiembre y octubre: menos turistas, precios más bajos, colores de otoño. El clima irlandés es extremadamente impredecible: puede llover en cualquier momento del año.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'El autostop está profundamente arraigado en la cultura irlandesa. En las zonas rurales sin transporte público, dar viajes forma parte de la vida cotidiana desde hace décadas. Los irlandeses son sociables y acogedores.' },
      { type: 'sub', title: 'Lo que funciona' },
      { type: 'rule', icon: '🗣️', text: 'A los irlandeses les encanta charlar. Sé abierto a la conversación, haz preguntas sobre la región.' },
      { type: 'rule', icon: '🎒', text: 'Lleva una mochila pequeña. Las mochilas grandes asustan. Solo o en pareja (3+ = casi imposible).' },
      { type: 'sub', title: 'Eventos' },
      { type: 'event', items: [
        { month: 'Mar', day: '17', name: 'St Patrick\'s Day', desc: 'Fiesta nacional. Festividades en todo el país y en el mundo.' },
        { month: 'May', day: '⟳', name: 'Fleadh Cheoil', desc: 'Festival de música tradicional irlandesa.' },
        { month: 'Sep', day: '⟳', name: 'Galway Oyster Festival', desc: 'Festival de las ostras, el food festival más antiguo de Irlanda.' },
        { month: 'Oct', day: '⟳', name: 'Bram Stoker Festival (Dublín)', desc: 'Festival de Halloween, la cuna de Halloween es irlandesa.' },
      ]},
      { type: 'tip', text: '💡 Toda la sociedad irlandesa participa en la tradición del dedo: de los granjeros a los informáticos, todo el mundo para.' },
    ]},
  },

  // ==================== CROATIA ====================
  HR: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'El autostop es legal en Croacia. Puedes hacer dedo en las estaciones de peaje. La policía generalmente no se preocupa.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Moderado a fácil en verano en la costa (rara vez más de 20 min de espera). Difícil en invierno cuando las ciudades costeras se convierten en "ciudades fantasma". Los peajes son los mejores spots.' },
      { type: 'sub', title: 'Truco costero' },
      { type: 'text', text: 'Las carreteras secundarias a lo largo de la costa funcionan mejor que las autopistas porque los locales las toman para evitar los peajes. Las colas en las fronteras el fin de semana (10+ km) crean oportunidades únicas.' },
      { type: 'warn', text: '⚠️ MINAS TERRESTRES en el centro de Croacia (no en la costa). Comprueba siempre el mapa de campos de minas (misportal.hcr.hr) antes de salir de las carreteras señalizadas.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Croacia es un país seguro para el autostop. Las carreteras costeras están bien transitadas en verano y los conductores son acogedores con los viajeros.' },
      { type: 'sub', title: 'Usa SpotHitch para tu seguridad' },
      { type: 'rule', icon: '🛡️', text: 'Activa el Modo Guardián antes de cada viaje. Una persona de confianza sigue tu posición en tiempo real.' },
      { type: 'rule', icon: '🆘', text: 'Configura el modo SOS con tus contactos. Un toque activa una triple alerta (push, SMS, llamada).' },
      { type: 'rule', icon: '📱', text: 'Fotografía la matrícula y envíala a alguien antes de subir.' },
      { type: 'rule', icon: '🎒', text: 'Mantén tu mochila accesible (en tu regazo o a tus pies), nunca en el maletero.' },
      { type: 'sub', title: 'Consejos del país' },
      { type: 'rule', icon: '⛽', text: 'Las estaciones OMV e INA son excelentes spots para abordar a los conductores.' },
      { type: 'rule', icon: '🏖️', text: 'En verano, las carreteras costeras dálmatas tienen un tráfico denso. Aprovéchalo para avanzar rápidamente.' },
      { type: 'sub', title: 'Números de emergencia' },
      { type: 'kv', items: [{ k: 'Emergencias', v: '112' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Croacia está considerada como un excelente destino para viajeras solas. La sensación de seguridad es alta. Para el autostop, viajar en pareja es recomendable.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'El croata es el idioma oficial. El 95% de los jóvenes de 15 a 34 años hablan un idioma extranjero (sobre todo inglés). El italiano es ampliamente conocido en la costa.' },
      { type: 'phrase', items: [
        { local: 'Mogu li dobiti prijevoz do...?', meaning: '¿Puedo conseguir un viaje hacia...?' },
        { local: 'Hvala!', meaning: '¡Gracias!' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Más caro que los otros países de los Balcanes, especialmente en verano en la costa. Burek: ~1 €. Albergues: 15 a 25 €/noche. Comida: 5 a 10 €.' },
    ]},
    sleep: { filterTypes: ['b', 'q', 'a'], blocks: [
      { type: 'text', text: 'La acampada libre no está permitida (multas). Couchsurfing funciona bien. Campings asequibles disponibles. Visita en mayo/junio/septiembre para precios más bajos.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Buses interurbanos', detail: 'Red extensa y asequible', price: '' },
        { emoji: '⛴️', name: 'Catamaranes para las islas', detail: 'Más rápidos y más baratos que los car-ferries', price: '' },
        { emoji: '🚗', name: 'BlaBlaCar (blablacar.hr)', detail: 'Activo en Croacia', price: '' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Ene', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mar', level: 'ok' },
        { name: 'Abr', level: 'good' }, { name: 'May', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'good' }, { name: 'Ago', level: 'good' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'ok' }, { name: 'Nov', level: 'bad' }, { name: 'Dic', level: 'bad' },
      ]},
      { type: 'text', text: 'Mayo, junio y septiembre: ideal (buen tiempo, menos masificado, más barato). Julio y agosto: fácil para los viajes pero muy masificado y caro en la costa.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Los croatas son descritos como "extremadamente abiertos, amigables y hospitalarios". Las 3 S del autostop en Croacia: sonrisa, crema solar y una hoja con tu destino.' },
      { type: 'event', items: [
        { month: 'Jul', day: '⟳', name: 'Ultra Europe (Split)', desc: 'Festival de música electrónica, 150.000 visitantes.' },
        { month: 'Jul-Ago', day: '⟳', name: 'Festival de verano de Dubrovnik', desc: 'Teatro, música, danza durante 6 semanas.' },
      ]},
    ]},
  },

  // ==================== SLOVENIA ====================
  SI: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'El autostop es legal y practicado en Eslovenia. Prohibido cruzar las autopistas a pie. El país es bastante pequeño para cruzarlo en ~3 horas.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Buen país para el autostop. Tiempo de espera generalmente inferior a 15 minutos. Los conductores están contentos de ver autostopistas y a menudo cuentan sus propias historias de dedo cuando eran jóvenes.' },
      { type: 'tip', text: '💡 Eslovenia alberga el único Museo del Autostop del mundo.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Eslovenia es muy segura para el autostop. Es un país pequeño y acogedor donde la gente para fácilmente, a menudo por nostalgia de sus propios viajes.' },
      { type: 'sub', title: 'Usa SpotHitch para tu seguridad' },
      { type: 'rule', icon: '🛡️', text: 'Activa el Modo Guardián antes de cada viaje. Una persona de confianza sigue tu posición en tiempo real.' },
      { type: 'rule', icon: '🆘', text: 'Configura el modo SOS con tus contactos. Un toque activa una triple alerta (push, SMS, llamada).' },
      { type: 'rule', icon: '📱', text: 'Fotografía la matrícula y envíala a alguien antes de subir.' },
      { type: 'rule', icon: '🎒', text: 'Mantén tu mochila accesible (en tu regazo o a tus pies), nunca en el maletero.' },
      { type: 'sub', title: 'Consejos del país' },
      { type: 'rule', icon: '🗺️', text: 'El país es pequeño: puedes cruzarlo en 3 horas. Cada viaje cuenta.' },
      { type: 'rule', icon: '😊', text: 'Los conductores son muy abiertos. No dudes en iniciar la conversación, les encanta compartir sus buenos planes.' },
      { type: 'sub', title: 'Números de emergencia' },
      { type: 'kv', items: [{ k: 'Emergencias', v: '112' }] },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Excelente nivel de inglés. La mayoría de los eslovenos hablan también alemán y un poco de italiano. Dos saludos regionales: "Živjo" (Liubliana) y "Zdravo" (Maribor).' },
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Más caro que los otros países de los Balcanes pero más barato que Europa Occidental. El bici-compartido de Liubliana: 1 €/semana o 3 €/AÑO. Bus: 1,30 € (90 min). Albergues: 15 a 25 €/noche.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Acampada libre oficialmente prohibida pero la ley rara vez se aplica mientras no hagas fuego. Pide a los propietarios permiso para acampar en su jardín. Couchsurfing activo en Liubliana.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Bus', detail: 'Red bien conectada', price: '' },
        { emoji: '🚗', name: 'BlaBlaCar', detail: 'Activo en Eslovenia', price: '' },
        { emoji: '🚲', name: 'Bici-compartido Liubliana', detail: 'Increíblemente barato', price: '3 €/año' },
      ]},
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'El autostop es culturalmente aceptado y nostálgico en Eslovenia. Los conductores cuentan sus historias de juventud. Los jóvenes entienden y practican. Es descrito como el país más favorable al autostop de los Balcanes.' },
      { type: 'event', items: [
        { month: 'Feb', day: '⟳', name: 'Kurentovanje (Ptuj)', desc: 'Mayor carnaval de Eslovenia, máscaras tradicionales Kurent.' },
        { month: 'Jun', day: '⟳', name: 'Festival de Liubliana', desc: 'Música, teatro, danza en el casco antiguo.' },
      ]},
    ]},
  },

  // ==================== ALBANIA ====================
  AL: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Ninguna ley contra el autostop en Albania. Atención: cerca de la frontera griega (Kakavia), "mafias de taxis" afirman falsamente que el autostop es ilegal para forzarte a tomar un taxi. Camina más allá de las estaciones de taxi antes de levantar el pulgar.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Albania es un verdadero paraíso para el autostop y el país más fácil de los Balcanes. Tiempo de espera generalmente bajo 15 minutos. Pasan coches aproximadamente cada 5 minutos en las carreteras principales.' },
      { type: 'sub', title: 'Distinción crucial' },
      { type: 'text', text: 'Muchos coches que paran son en realidad taxis privados informales. Di claramente "autostop, jo lek" (autostop, sin dinero) mostrando tu pulgar para evitar malentendidos.' },
      { type: 'text', text: 'Algunos conductores ofrecen espontáneamente dinero A los autostopistas. La hospitalidad albanesa es legendaria.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Albania es un país seguro para el autostop. Los conductores son notablemente hospitalarios y a menudo hacen desvíos para ayudarte.' },
      { type: 'sub', title: 'Usa SpotHitch para tu seguridad' },
      { type: 'rule', icon: '🛡️', text: 'Activa el Modo Guardián antes de cada viaje. Una persona de confianza sigue tu posición en tiempo real.' },
      { type: 'rule', icon: '🆘', text: 'Configura el modo SOS con tus contactos. Un toque activa una triple alerta (push, SMS, llamada).' },
      { type: 'rule', icon: '📱', text: 'Fotografía la matrícula y envíala a alguien antes de subir.' },
      { type: 'rule', icon: '🎒', text: 'Mantén tu mochila accesible (en tu regazo o a tus pies), nunca en el maletero.' },
      { type: 'sub', title: 'Consejos del país' },
      { type: 'rule', icon: '🏔️', text: 'Las carreteras de montaña están a veces en mal estado. Infórmate sobre el estado de la calzada antes de aventurarte.' },
      { type: 'rule', icon: '🤝', text: 'La hospitalidad albanesa es legendaria. Acepta el café o el raki con gratitud, es un gesto de bienvenida.' },
      { type: 'sub', title: 'Números de emergencia' },
      { type: 'kv', items: [{ k: 'Emergencias', v: '112' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Albania es segura para viajeras solas. El acoso callejero es poco frecuente. El autostop funciona bien para mujeres solas, con tiempos de espera de 15 a 20 minutos.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'El albanés es un idioma único (no eslavo). Los jóvenes urbanos hablan inglés con fluidez. No esperes inglés en los mayores de 30 años. El italiano y el griego son comunes. El alemán es entendido por algunos (diáspora en Alemania/Suiza).' },
      { type: 'phrase', items: [
        { local: 'Autostop, jo lek', meaning: 'Autostop, sin dinero' },
        { local: 'Faleminderit', meaning: 'Gracias' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'El país más barato de los Balcanes. Una estancia de 2 semanas es posible por menos de 200 €. Albergue: ~10 €/noche con desayuno. Los furgons (minibuses) cubren el país por unos pocos euros.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'La acampada libre está oficialmente autorizada en Albania, uno de los pocos países europeos. Evita parques nacionales, reservas, propiedades privadas y edificios gubernamentales. Las playas al norte de Durrës son adecuadas para acampar con tienda.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚐', name: 'Furgons (minibuses)', detail: 'Columna vertebral del transporte albanés. Sin horario fijo, levanta la mano para pararlos.', price: '~3,50 €/120 km' },
        { emoji: '🚌', name: 'Buses regulares', detail: 'Líneas principales entre grandes ciudades', price: '' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Ene', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mar', level: 'ok' },
        { name: 'Abr', level: 'good' }, { name: 'May', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'good' }, { name: 'Ago', level: 'good' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'ok' }, { name: 'Dic', level: 'bad' },
      ]},
      { type: 'text', text: 'Mayo, junio y septiembre, octubre: ideal. Las carreteras de montaña del norte pueden ser impracticables en invierno.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'La hospitalidad albanesa es legendaria. Los conductores se desvían kilómetros para ayudar, ofrecen comidas, raki, café, recuerdos e incluso dinero. El concepto de "besa" (código de honor sagrado y de hospitalidad) está profundamente arraigado.' },
      { type: 'event', items: [
        { month: 'Mar', day: '14', name: 'Dita e Verës (Elbasan)', desc: 'Fiesta de la primavera, la tradición albanesa más antigua.' },
        { month: 'Ago', day: '⟳', name: 'Kala Festival (Dhermi)', desc: 'Festival de música en una playa de la Riviera albanesa.' },
      ]},
    ]},
  },

  // ==================== SERBIA ====================
  RS: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'El autostop en las autopistas está "mal visto pero no tendrás problemas". La policía dirige a los autostopistas hacia las rampas de salida. Las estaciones de peaje son consideradas lugares de autostop normales y legales.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Difícil. Tiempo de espera medio: 2 a 3 horas. Abordar a los conductores directamente en las gasolineras pequeñas funciona mucho mejor que el pulgar al borde de la carretera. De día, es factible. De noche, es muy duro (mala iluminación de las carreteras).' },
      { type: 'tip', text: '💡 La mejor estrategia en Serbia: alternar autostop y autobuses baratos. Los buses locales entre pueblos sirven como "trampolines" cuando el autostop no funciona.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Serbia es segura de día. Los conductores serbios son amigables una vez que paran.' },
      { type: 'sub', title: 'Usa SpotHitch para tu seguridad' },
      { type: 'rule', icon: '🛡️', text: 'Activa el Modo Guardián antes de cada viaje. Una persona de confianza sigue tu posición en tiempo real.' },
      { type: 'rule', icon: '🆘', text: 'Configura el modo SOS con tus contactos. Un toque activa una triple alerta (push, SMS, llamada).' },
      { type: 'rule', icon: '📱', text: 'Fotografía la matrícula y envíala a alguien antes de subir.' },
      { type: 'rule', icon: '🎒', text: 'Mantén tu mochila accesible (en tu regazo o a tus pies), nunca en el maletero.' },
      { type: 'sub', title: 'Consejos del país' },
      { type: 'rule', icon: '⛽', text: 'Las gasolineras NIS y OMV son buenos spots para encontrar conductores.' },
      { type: 'rule', icon: '😊', text: 'Los serbios son acogedores y curiosos. Una conversación amistosa te abrirá muchas puertas.' },
      { type: 'sub', title: 'Números de emergencia' },
      { type: 'kv', items: [{ k: 'Emergencias', v: '112' }] },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'El serbio es el idioma principal (alfabetos cirílico y latino). El inglés progresa entre los jóvenes pero sigue limitado en zona rural. Los hablantes de lenguas eslavas (checo, eslovaco, polaco, ruso) tienen ventaja lingüística.' },
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Barato comparado con Hungría o Europa Occidental. Pljeskavica (plato local): 2 a 3 €. Albergue: 8 a 12 €/noche. Vuelo a Niš: a veces 10 €.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Acampada libre oficialmente prohibida pero "generalmente tolerada". Couchsurfing activo en Belgrado. Albergues muy asequibles.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Bus', detail: 'Cubren todo el país, baratos', price: '' },
        { emoji: '🚗', name: 'BlaBlaCar (blablacar.rs)', detail: 'Activo en Serbia', price: '' },
      ]},
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Los serbios son descritos como "amigables y muy abiertos a los encuentros" una vez establecido el contacto. El reto es hacerlos parar. La mezcla autostop + bus barato es la mejor estrategia.' },
      { type: 'event', items: [
        { month: 'Jul', day: '⟳', name: 'EXIT Festival (Novi Sad)', desc: 'Uno de los mayores festivales de música de Europa, en la fortaleza de Petrovaradin.' },
        { month: 'Ago', day: '⟳', name: 'Guča Trumpet Festival', desc: 'Festival de trompeta y música balcánica. 600.000 visitantes.' },
      ]},
    ]},
  },

  // ==================== BOSNIA AND HERZEGOVINA ====================
  BA: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'El autostop es legal en Bosnia-Herzegovina. La policía no te causará problemas.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Variable según las fuentes y los lugares. Algunos viajeros nunca esperaron más de 10 minutos (ruta Split-Mostar-Sarajevo). Otros tuvieron esperas muy largas. La baja tasa de propiedad de coches significa menos vehículos de larga distancia.' },
      { type: 'warn', text: '⚠️ MINAS TERRESTRES. NUNCA abandones las carreteras para ir a los arbustos o estructuras abandonadas en zonas que no conoces. Algunas casas siguen trampadas desde la guerra.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Bosnia es un país seguro para el autostop. La gente es muy acogedora con los viajeros extranjeros.' },
      { type: 'sub', title: 'Usa SpotHitch para tu seguridad' },
      { type: 'rule', icon: '🛡️', text: 'Activa el Modo Guardián antes de cada viaje. Una persona de confianza sigue tu posición en tiempo real.' },
      { type: 'rule', icon: '🆘', text: 'Configura el modo SOS con tus contactos. Un toque activa una triple alerta (push, SMS, llamada).' },
      { type: 'rule', icon: '📱', text: 'Fotografía la matrícula y envíala a alguien antes de subir.' },
      { type: 'rule', icon: '🎒', text: 'Mantén tu mochila accesible (en tu regazo o a tus pies), nunca en el maletero.' },
      { type: 'sub', title: 'Consejos del país' },
      { type: 'rule', icon: '🛣️', text: 'Quédate en las carreteras señalizadas en zona rural. Algunos caminos de campo están poco mantenidos.' },
      { type: 'rule', icon: '☕', text: 'Aceptar un café bosnio es un gesto de cortesía. A los conductores les encanta compartir un momento con los viajeros.' },
      { type: 'sub', title: 'Números de emergencia' },
      { type: 'kv', items: [{ k: 'Emergencias', v: '112' }] },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'El bosnio, el croata y el serbio se hablan todos (mutuamente comprensibles). Muchos residentes hablan inglés gracias a la emigración posguerra. Mencionar de dónde vienes ayuda a crear confianza, ya que muchos bosnios tienen familiares emigrados.' },
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Uno de los países más baratos de los Balcanes. Burek: ~1 €. Albergue en Sarajevo: 10 a 15 €/noche. Los cigarrillos (<3 €/paquete) son útiles como regalo de agradecimiento.' },
      { type: 'tip', text: '💡 "KM" en los carteles puede significar la moneda (Marco Convertible), ¡no kilómetros!' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Acampada libre oficialmente prohibida pero generalmente tolerada. Los locales son increíblemente hospitalarios: granjeros ofrecen duchas y café a los campistas, conductores invitan a los autostopistas a dormir en sus casas.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Buses y trenes muy baratos. Pocas autopistas. La combinación autostop + transporte público es el enfoque recomendado.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Los bosnios son "muy cálidos y amigables" con orgullo de acoger a los turistas. Los conductores llevan a los autostopistas a sus casas para comer y tomar café, se pasan de su destino para dejarles en un sitio mejor.' },
      { type: 'rule', icon: '🚬', text: 'Ofrecer unos cigarrillos al bajar del coche es un gesto de agradecimiento poderoso que trasciende las barreras lingüísticas.' },
      { type: 'event', items: [
        { month: 'Ago', day: '⟳', name: 'Sarajevo Film Festival', desc: 'Festival de cine internacional fundado durante el asedio.' },
      ]},
    ]},
  },

  // ==================== MONTENEGRO ====================
  ME: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Ninguna restricción legal específica sobre el autostop encontrada. No hay informes de interferencia policial.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Difícil. Montenegro es regularmente citado como uno de los países más difíciles de los Balcanes para el autostop. A los montenegrinos no les gusta llevar autostopistas. La mayoría de los viajeros que lo consiguen son recogidos por albaneses u otros extranjeros, no por locales.' },
      { type: 'text', text: 'El tráfico es disperso, las carreteras de montaña sinuosas dificultan la parada. El enfoque directo en las gasolineras funciona mejor que el pulgar al borde de la carretera.' },
      { type: 'tip', text: '💡 El ferry de Kotor es gratuito y ahorra mucho tiempo para llegar a Podgorica.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Montenegro es un país seguro para el autostop. Las carreteras costeras son estrechas y sinuosas, así que hazte bien visible cuando hagas dedo.' },
      { type: 'sub', title: 'Usa SpotHitch para tu seguridad' },
      { type: 'rule', icon: '🛡️', text: 'Activa el Modo Guardián antes de cada viaje. Una persona de confianza sigue tu posición en tiempo real.' },
      { type: 'rule', icon: '🆘', text: 'Configura el modo SOS con tus contactos. Un toque activa una triple alerta (push, SMS, llamada).' },
      { type: 'rule', icon: '📱', text: 'Fotografía la matrícula y envíala a alguien antes de subir.' },
      { type: 'rule', icon: '🎒', text: 'Mantén tu mochila accesible (en tu regazo o a tus pies), nunca en el maletero.' },
      { type: 'sub', title: 'Consejos del país' },
      { type: 'rule', icon: '👀', text: 'En las carreteras costeras, colócate en un lugar amplio y bien visible, lejos de las curvas cerradas.' },
      { type: 'rule', icon: '🌊', text: 'En verano, el tráfico turístico en la costa facilita el autostop. Aprovecha las gasolineras para abordar a los conductores.' },
      { type: 'sub', title: 'Números de emergencia' },
      { type: 'kv', items: [{ k: 'Emergencias', v: '112' }] },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'El montenegrino (esencialmente idéntico al serbio/bosnio/croata). Mucha gente se maneja mejor en italiano que en inglés. El ruso también se entiende (numerosos residentes rusos en verano).' },
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Gama media para los Balcanes (más caro que Albania/Bosnia, más barato que Croacia). Albergues: 12 a 20 €/noche. Comida: 5 a 8 €.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Acampada libre oficialmente prohibida pero tolerada si te comportas normalmente y evitas las playas y zonas turísticas.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Bus', detail: 'Opción más fiable, cubren la mayoría de las rutas', price: '' },
        { emoji: '⛴️', name: 'Ferry de Kotor', detail: 'Gratuito, esencial para llegar a Podgorica', price: 'gratuito' },
      ]},
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Hospitalidad mixta. La acogida puede ser fría comparada con los países vecinos, y la mayoría de los encuentros son con expatriados más que con locales. Algunos montenegrinos son sin embargo muy acogedores. El consenso: Montenegro no es una cultura favorable al autostop comparado con sus vecinos.' },
    ]},
  },

  // ==================== NORTH MACEDONIA ====================
  MK: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Ninguna ley específica contra el autostop encontrada. No hay informes de interferencia policial.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Fácil. Descrito como "uno de los mejores países europeos para el autostop". Tiempo de espera generalmente bajo 20 a 30 minutos. En las gasolineras cerca de Skopje, los viajes llegan en 5 a 10 minutos.' },
      { type: 'text', text: 'Reto: las carreteras rurales/de montaña con muy poco tráfico (menos de 100 coches/hora). Cuando el tráfico es escaso, prepárate para caminar mucho con el pulgar levantado.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Macedonia del Norte es un país seguro para el autostop. Los habitantes son acogedores y a menudo protectores con los viajeros.' },
      { type: 'sub', title: 'Usa SpotHitch para tu seguridad' },
      { type: 'rule', icon: '🛡️', text: 'Activa el Modo Guardián antes de cada viaje. Una persona de confianza sigue tu posición en tiempo real.' },
      { type: 'rule', icon: '🆘', text: 'Configura el modo SOS con tus contactos. Un toque activa una triple alerta (push, SMS, llamada).' },
      { type: 'rule', icon: '📱', text: 'Fotografía la matrícula y envíala a alguien antes de subir.' },
      { type: 'rule', icon: '🎒', text: 'Mantén tu mochila accesible (en tu regazo o a tus pies), nunca en el maletero.' },
      { type: 'sub', title: 'Consejos del país' },
      { type: 'rule', icon: '🛣️', text: 'Las carreteras principales están en buen estado y bien conectadas entre las grandes ciudades.' },
      { type: 'rule', icon: '🙏', text: 'A los habitantes les encanta ayudar a los viajeros. Una sonrisa y un cartel con tu destino son suficientes.' },
      { type: 'sub', title: 'Números de emergencia' },
      { type: 'kv', items: [{ k: 'Emergencias', v: '112' }] },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'El macedonio (eslavo) y el albanés son los idiomas principales. El inglés progresa pero sigue limitado fuera de Skopje y Ohrid. Las abreviaturas de las matrículas son útiles: SK=Skopje, OH=Ohrid, BT=Bitola.' },
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Muy barato. Entre los países más asequibles de los Balcanes. Albergues: 8 a 12 €/noche.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Acampada libre oficialmente prohibida pero "generalmente tolerada" (mismo patrón que Serbia/Bosnia). Los viajeros son a veces invitados a dormir en las casas de las familias.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Red de autobuses cubriendo las rutas principales. Minibuses tipo furgon en algunas zonas. Buses internacionales hacia Albania (Ohrid-Pogradec), Kosovo, Serbia y Grecia.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'La gente es "extremadamente amigable y particularmente fascinada por los viajeros". Los conductores muestran un interés sincero y ofrecen su ayuda sin esperar pago. El ambiente es descrito como "gemächlich" (tranquilo, sin prisa).' },
      { type: 'event', items: [
        { month: 'Jul', day: '⟳', name: 'Ohrid Summer Festival', desc: 'Música, teatro y danza a orillas del lago Ohrid, sitio UNESCO.' },
      ]},
    ]},
  },

  // ==================== POLAND ====================
  PL: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'El autostop es legal en Polonia en las carreteras normales. Fue oficialmente organizado por la Oficina Nacional de Turismo de 1958 a mediados de los 90 ("Akcja Autostop"), con cuadernos, cupones y una lotería para los conductores.' },
      { type: 'rule', icon: '🚫', text: 'Prohibido en autopistas y vías rápidas. Permitido en gasolineras, peajes y rampas de acceso.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Históricamente uno de los países más favorables al autostop en Europa. Tiempo de espera medio: 15 min a 1h. Sin embargo, informes recientes (2023) muestran un deterioro: 30 min a 3h de espera, los polacos son cada vez más reacios a parar fuera de las zonas designadas.' },
      { type: 'sub', title: 'Truco de red' },
      { type: 'text', text: 'Polonia tiene "demasiadas carreteras" (4 a 5 itinerarios posibles para cada destino). Acepta los viajes en la dirección general en lugar del itinerario exacto. Los camioneros a veces usan la radio CB para organizarte tu siguiente viaje.' },
      { type: 'tip', text: '💡 Muestra tu mochila bien visible para parecer un "autostopista profesional". Eso tranquiliza a los conductores polacos.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Polonia es un país seguro para el autostop. La conducción es rápida en las carreteras nacionales, así que mantente atento cuando te posiciones.' },
      { type: 'sub', title: 'Usa SpotHitch para tu seguridad' },
      { type: 'rule', icon: '🛡️', text: 'Activa el Modo Guardián antes de cada viaje. Una persona de confianza sigue tu posición en tiempo real.' },
      { type: 'rule', icon: '🆘', text: 'Configura el modo SOS con tus contactos. Un toque activa una triple alerta (push, SMS, llamada).' },
      { type: 'rule', icon: '📱', text: 'Fotografía la matrícula y envíala a alguien antes de subir.' },
      { type: 'rule', icon: '🎒', text: 'Mantén tu mochila accesible (en tu regazo o a tus pies), nunca en el maletero.' },
      { type: 'sub', title: 'Consejos del país' },
      { type: 'rule', icon: '⛽', text: 'Las estaciones Orlen (cadena nacional) son spots fiables con mucho paso.' },
      { type: 'rule', icon: '👀', text: 'La velocidad es alta en las carreteras nacionales. Colócate en un lugar bien visible con espacio para detenerse.' },
      { type: 'sub', title: 'Números de emergencia' },
      { type: 'kv', items: [{ k: 'Emergencias', v: '112' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Polonia ocupa el 12° puesto de países más seguros para viajeras solas (nota 4,7/5). La sensación de seguridad es alta. Ver la advertencia anterior para el norte del país en verano.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: '~24% hablan inglés, ~20% ruso, ~12% alemán. Los jóvenes (77% de los estudiantes) hablan idiomas extranjeros. Los camioneros hablan a menudo solo polaco. Los polacos responden muy positivamente a los extranjeros que intentan hablar polaco.' },
      { type: 'phrase', items: [
        { local: 'Dzień dobry', meaning: 'Buenos días' },
        { local: 'Dziękuję', meaning: 'Gracias' },
        { local: 'Skąd najlepiej łapać stopa do...?', meaning: '¿Dónde es el mejor sitio para hacer autostop hacia...?' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Uno de los países más baratos de la UE. Presupuesto mochilero: 25 a 35 €/día. Albergue: 13 a 16 €/noche. Comida local: 5 a 7 €. Las MOP (áreas de descanso de carretera) ofrecen duchas gratis con agua caliente.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Desde mayo de 2021, 600.000 hectáreas repartidas en 425 zonas forestales están legalmente abiertas al camping (máx. 9 personas, máx. 2 noches). Usa la app mBDL para encontrar las zonas legales (zonas naranjas).' },
      { type: 'rule', icon: '✅', text: '425 zonas forestales legales para camping (app mBDL)' },
      { type: 'rule', icon: '🚫', text: 'Prohibido en parques nacionales y reservas naturales (especialmente los Tatras)' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'FlixBus / PolskiBus', detail: 'Extremadamente barato (promos desde 0,23 €)', price: 'desde 1 €' },
        { emoji: '🚗', name: 'BlaBlaCar', detail: 'Muy popular ("e-autostop")', price: '' },
        { emoji: '📱', name: 'jakdojade.pl', detail: 'App para todos los transportes públicos polacos', price: '' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Ene', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mar', level: 'ok' },
        { name: 'Abr', level: 'good' }, { name: 'May', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Ago', level: 'great' }, { name: 'Sep', level: 'good' },
        { name: 'Oct', level: 'ok' }, { name: 'Nov', level: 'bad' }, { name: 'Dic', level: 'bad' },
      ]},
      { type: 'text', text: 'Verano: óptimo. Invierno: muy difícil (hasta -20°C, días cortos, visibilidad reducida).' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Cultura profunda de autostop enraizada en el programa oficial comunista (1958-1995). Muchos conductores actuales hicieron autostop en su juventud. Los polacos parecen fríos en el primer contacto pero se calientan rápido.' },
      { type: 'event', items: [
        { month: 'Ago', day: '⟳', name: 'Pol\'and\'Rock Festival', desc: 'Mayor festival gratuito de Europa (ex-Woodstock Polonia), 750.000 personas.' },
        { month: 'Nov', day: '1', name: 'Todos los Santos (Wszystkich Świętych)', desc: 'Cementerios iluminados con velas. Espectáculo único.' },
        { month: 'Dic', day: '⟳', name: 'Mercados navideños', desc: 'Cracovia y Wrocław tienen los más bonitos.' },
      ]},
    ]},
  },

  // ==================== CZECH REPUBLIC ====================
  CZ: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'El autostop es legal en las carreteras normales en Chequia. Prohibido directamente en las autopistas y vías rápidas. Permitido en las rampas de acceso y gasolineras.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Uno de los países más favorables al autostop en Europa. En las carreteras normales, un viaje llega generalmente en 10 minutos. Es un país de tránsito con mucho tráfico internacional y camioneros.' },
      { type: 'text', text: 'En las entradas de autopista cerca de las ciudades, puedes encontrarte con 3 a 6 otros autostopistas. Los viajes se dan por orden de llegada o por destino.' },
      { type: 'tip', text: '💡 Todas las autopistas checas (1, 2, 5, 8, 11) llevan a/desde Praga. Evita quedarte atascado antes de Praga: entra en la ciudad y sal de nuevo.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Chequia es un país seguro para el autostop. Las áreas de descanso son concurridas y constituyen buenos puntos de partida.' },
      { type: 'sub', title: 'Usa SpotHitch para tu seguridad' },
      { type: 'rule', icon: '🛡️', text: 'Activa el Modo Guardián antes de cada viaje. Una persona de confianza sigue tu posición en tiempo real.' },
      { type: 'rule', icon: '🆘', text: 'Configura el modo SOS con tus contactos. Un toque activa una triple alerta (push, SMS, llamada).' },
      { type: 'rule', icon: '📱', text: 'Fotografía la matrícula y envíala a alguien antes de subir.' },
      { type: 'rule', icon: '🎒', text: 'Mantén tu mochila accesible (en tu regazo o a tus pies), nunca en el maletero.' },
      { type: 'sub', title: 'Consejos del país' },
      { type: 'rule', icon: '⛽', text: 'Las áreas de descanso a lo largo de las autopistas son spots fiables con paso regular.' },
      { type: 'rule', icon: '🍺', text: 'El país es muy acogedor. Los conductores pueden invitarte a un hospoda (taberna tradicional).' },
      { type: 'sub', title: 'Números de emergencia' },
      { type: 'kv', items: [{ k: 'Emergencias', v: '112' }, { k: 'Ambulancia', v: '155' }] },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Los conductores mayores: solo checo, a veces ruso, raramente alemán. Los jóvenes: al menos un inglés básico. Los camioneros son amigables y hablan generalmente checo + un poco de alemán.' },
      { type: 'phrase', items: [
        { local: 'Dobrý den', meaning: 'Buenos días' },
        { local: 'Jedete do...?', meaning: '¿Va a...?' },
        { local: 'Děkuji', meaning: 'Gracias' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Presupuesto mochilero: 35 a 55 €/día. Praga es notablemente más caro que el resto del país. Moneda: corona checa (CZK), no el euro. Camping muy barato (~3 € en algunas ciudades).' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Acampada libre prohibida pero el vivac de una noche está tolerado (saco de dormir, hamaca, bivy sack, sin tienda). No dejes ninguna huella. Prohibido en parques nacionales y reservas.' },
      { type: 'rule', icon: '✅', text: 'Refugios de madera gratuitos ("bouda" o "útulna") disponibles en ciertas zonas de senderismo.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'RegioJet', detail: 'Bus checo barato y cómodo (CZ, SK, PL, AT, HU)', price: 'desde 5 €' },
        { emoji: '🚌', name: 'FlixBus', detail: 'Red extensa', price: 'desde 5 €' },
        { emoji: '🚗', name: 'BlaBlaCar', detail: 'Activo en Chequia', price: '' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Ene', level: 'ok' }, { name: 'Feb', level: 'ok' }, { name: 'Mar', level: 'ok' },
        { name: 'Abr', level: 'good' }, { name: 'May', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Ago', level: 'great' }, { name: 'Sep', level: 'good' },
        { name: 'Oct', level: 'ok' }, { name: 'Nov', level: 'ok' }, { name: 'Dic', level: 'ok' },
      ]},
      { type: 'text', text: 'Verano: óptimo, especialmente en el eje Chequia-Croacia (destino vacacional preferido de los checos). Los mercados navideños de Praga atraen tráfico en invierno.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Fuerte tradición de autostop, socialmente aceptado como "forma de transporte cotidiana". Un grupo de Facebook conecta a los autostopistas checos y eslovacos.' },
      { type: 'event', items: [
        { month: 'Jul', day: '⟳', name: 'Colours of Ostrava', desc: 'Festival de música multicultural, Ostrava.' },
        { month: 'Dic', day: '⟳', name: 'Mercados navideños de Praga', desc: 'Entre los más bonitos de Europa.' },
      ]},
    ]},
  },

  // ==================== SLOVAKIA ====================
  SK: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'El autostop es legal en las carreteras normales en Eslovaquia. Prohibido en las autopistas. Atención: la policía eslovaca multa a los autostopistas pillados en las autopistas (más estricta que los países vecinos). Usa las gasolineras y rampas de acceso.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Opiniones contradictorias. Algunos encuentran Eslovaquia "muy fácil" (menos de 30 min de espera). Otros la consideran difícil (5/10) con esperas hasta 2h. Depende probablemente de la ubicación y la temporada.' },
      { type: 'text', text: 'El país es bastante montañoso (60%+ del territorio), lo que crea muchas oportunidades naturales. Las autopistas D1 y E77 son los mejores ejes. Bratislava es un cruce central de Europa Central.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Eslovaquia es un país seguro para el autostop. Los habitantes son acogedores, especialmente en zona rural donde la tradición del dedo sigue viva.' },
      { type: 'sub', title: 'Usa SpotHitch para tu seguridad' },
      { type: 'rule', icon: '🛡️', text: 'Activa el Modo Guardián antes de cada viaje. Una persona de confianza sigue tu posición en tiempo real.' },
      { type: 'rule', icon: '🆘', text: 'Configura el modo SOS con tus contactos. Un toque activa una triple alerta (push, SMS, llamada).' },
      { type: 'rule', icon: '📱', text: 'Fotografía la matrícula y envíala a alguien antes de subir.' },
      { type: 'rule', icon: '🎒', text: 'Mantén tu mochila accesible (en tu regazo o a tus pies), nunca en el maletero.' },
      { type: 'sub', title: 'Consejos del país' },
      { type: 'rule', icon: '🏘️', text: 'En zona rural, los conductores paran más fácilmente. Las carreteras de campo son ideales.' },
      { type: 'rule', icon: '😊', text: 'Los eslovacos son discretos pero cálidos. Una sonrisa y un cartel bastan para romper el hielo.' },
      { type: 'sub', title: 'Números de emergencia' },
      { type: 'kv', items: [{ k: 'Emergencias', v: '112' }] },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'El inglés y el alemán son hablados por algunos, especialmente los jóvenes. El ruso es entendido por los mayores pero "no necesariamente apreciado". En el sur: el húngaro es útil. El eslovaco básico es muy apreciado.' },
      { type: 'phrase', items: [
        { local: 'Dobrý deň', meaning: 'Buenos días' },
        { local: 'Idete do...?', meaning: '¿Va a...?' },
        { local: 'Ďakujem', meaning: 'Gracias' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Presupuesto mochilero: 40 a 50 €/día. Albergue: 16 a 22 €/noche. Comida local: 8 a 10 €.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Acampada libre oficialmente prohibida pero tolerada fuera de los parques nacionales (especialmente los Tatras). El vivac de emergencia (saco de dormir + lona, sin tienda) generalmente no da problemas.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'RegioJet', detail: 'Bus checo con rutas eslovacas extensas', price: '' },
        { emoji: '🚌', name: 'FlixBus', detail: 'Cubre Eslovaquia', price: 'desde 5 €' },
        { emoji: '🤝', name: 'Coche compartido local', detail: 'Plataformas locales de coche compartido activas en Eslovaquia', price: '' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Ene', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mar', level: 'ok' },
        { name: 'Abr', level: 'good' }, { name: 'May', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Ago', level: 'great' }, { name: 'Sep', level: 'good' },
        { name: 'Oct', level: 'ok' }, { name: 'Nov', level: 'bad' }, { name: 'Dic', level: 'bad' },
      ]},
      { type: 'text', text: 'Verano: óptimo. Invierno: esperas notablemente más largas, frío riguroso en montaña. Los domingos: las tiendas cierran (tradición religiosa), transporte público reducido.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Los eslovacos son descritos como "increíblemente amigables" y hacen todo lo posible para que te sientas cómodo. Algunos invitan a los autostopistas a almorzar en familia o a tomar algo con amigos. Nunca se pide pago.' },
      { type: 'event', items: [
        { month: 'Jul', day: '⟳', name: 'Pohoda Festival', desc: 'Mayor festival de música de Eslovaquia, Trenčín.' },
      ]},
    ]},
  },

  // ==================== HUNGARY ====================
  HU: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'El autostop es legal en Hungría. Larga tradición: la mayoría de los húngaros han hecho autostop o llevado autostopistas en su juventud. Prohibido en las autopistas como peatón.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Relativamente fácil, especialmente en zona rural. Tiempo de espera rara vez superior a 90 minutos en verano. Las gasolineras son los mejores spots.' },
      { type: 'sub', title: 'Particularidades' },
      { type: 'rule', icon: '📋', text: 'Un cartel con tu destino es NECESARIO. Muchos húngaros no entienden el gesto del pulgar como una señal de autostop.' },
      { type: 'text', text: 'Algunos conductores rumanos y húngaros pueden pedir un pago. Rechaza educadamente y espera otro viaje. Los viajes en camión son muy raros (razones de seguro).' },
      { type: 'warn', text: '⚠️ De noche, los conductores tienen miedo de TI. Haz autostop solo de día.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Hungría es un país seguro para el autostop. Las estaciones MOL son excelentes spots para encontrar conductores.' },
      { type: 'sub', title: 'Usa SpotHitch para tu seguridad' },
      { type: 'rule', icon: '🛡️', text: 'Activa el Modo Guardián antes de cada viaje. Una persona de confianza sigue tu posición en tiempo real.' },
      { type: 'rule', icon: '🆘', text: 'Configura el modo SOS con tus contactos. Un toque activa una triple alerta (push, SMS, llamada).' },
      { type: 'rule', icon: '📱', text: 'Fotografía la matrícula y envíala a alguien antes de subir.' },
      { type: 'rule', icon: '🎒', text: 'Mantén tu mochila accesible (en tu regazo o a tus pies), nunca en el maletero.' },
      { type: 'sub', title: 'Consejos del país' },
      { type: 'rule', icon: '⛽', text: 'Las estaciones MOL (cadena nacional) están bien repartidas y son ideales para abordar a los conductores.' },
      { type: 'rule', icon: '💧', text: 'El agua del grifo es potable en toda Hungría. Rellena tu cantimplora en cada parada.' },
      { type: 'sub', title: 'Números de emergencia' },
      { type: 'kv', items: [{ k: 'Emergencias', v: '112' }] },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'La mayor barrera lingüística de los 4 países. El húngaro es una lengua fino-ugria, sin relación con las lenguas eslavas o germánicas. Menos gente habla idiomas extranjeros que en los países vecinos. Una guía de conversación húngara es muy recomendable.' },
      { type: 'phrase', items: [
        { local: 'Jó napot', meaning: 'Buenos días' },
        { local: 'Köszönöm', meaning: 'Gracias' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Presupuesto mochilero: 25 a 45 €/día. Budapest es barata para una capital europea. Albergue (dormitorio): desde ~10 €. Comida local: 6 a 7 €.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Acampada libre legalmente autorizada pero muy restringida: máximo 24h en el mismo sitio. Prohibida en parques nacionales (patrullas frecuentes de guardas forestales). Prohibición de fuegos en época seca.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'FlixBus', detail: 'Red extensa desde Budapest', price: 'desde 5 €' },
        { emoji: '🚗', name: 'BlaBlaCar', detail: 'Activo en Hungría', price: '' },
        { emoji: '🚃', name: 'Trenes', detail: 'Bien conectados en la UE, pase Interrail válido', price: '' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Ene', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mar', level: 'ok' },
        { name: 'Abr', level: 'good' }, { name: 'May', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'good' }, { name: 'Ago', level: 'good' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'ok' }, { name: 'Dic', level: 'ok' },
      ]},
      { type: 'text', text: 'Primavera y otoño: ideal. Verano: mucho tráfico (Sziget Festival, turismo en el lago Balaton) pero puede ser muy caluroso (+35°C en julio). Los mercados navideños de Budapest atraen tráfico en invierno.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Larga tradición de autostop, practicado por la mayoría de los húngaros. Los rurales son muy amigables y serviciales. Pide viajes hacia Budapest en lugar de alrededor: los conductores en tránsito (rumanos, serbios, búlgaros, turcos) a menudo bordean la ciudad por la circunvalación.' },
      { type: 'event', items: [
        { month: 'Ago', day: '⟳', name: 'Sziget Festival (Budapest)', desc: 'Uno de los mayores festivales de música de Europa, en una isla del Danubio.' },
        { month: 'Ago', day: '⟳', name: 'Festival del Balaton', desc: 'Verano en el lago Balaton, mucho tráfico en la región.' },
        { month: 'Dic', day: '⟳', name: 'Mercados navideños de Budapest', desc: 'Entre los más bonitos de Europa.' },
      ]},
    ]},
  },

  // ==================== ROMANIA ====================
  RO: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'El autostop es legal en Rumanía. Desde ~2014, está prohibido que los conductores pidan dinero por llevar a autostopistas (el autostop de pago es ilegal). Prohibido en las autopistas. En la práctica, todo el mundo hace autostop.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Muy fácil. Uno de los países más favorables al autostop en Europa. Tiempo de espera: 2 minutos a 1h30 según el lugar. El autostop es un modo de transporte habitual (transporte público limitado, pocas autopistas). Puedes competir con locales a las salidas de ciudad.' },
      { type: 'text', text: 'Los rumanos usan códigos de 2 letras para los departamentos en los carteles (ej: CJ = Cluj). Usa un cartel. Las rotondas a las salidas de ciudad y las carreteras nacionales (E) funcionan mejor.' },
      { type: 'warn', text: '⚠️ Algunos conductores ilegales apuntan a los extranjeros y piden tarifas infladas (hasta 100 €). Di siempre "fără bani" (sin dinero) o "nu am bani" (no tengo dinero) ANTES de subir.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Rumanía es un país seguro para el autostop. La conducción es a veces agresiva en las carreteras nacionales, así que abróchate siempre el cinturón.' },
      { type: 'sub', title: 'Usa SpotHitch para tu seguridad' },
      { type: 'rule', icon: '🛡️', text: 'Activa el Modo Guardián antes de cada viaje. Una persona de confianza sigue tu posición en tiempo real.' },
      { type: 'rule', icon: '🆘', text: 'Configura el modo SOS con tus contactos. Un toque activa una triple alerta (push, SMS, llamada).' },
      { type: 'rule', icon: '📱', text: 'Fotografía la matrícula y envíala a alguien antes de subir.' },
      { type: 'rule', icon: '🎒', text: 'Mantén tu mochila accesible (en tu regazo o a tus pies), nunca en el maletero.' },
      { type: 'sub', title: 'Consejos del país' },
      { type: 'rule', icon: '🔒', text: 'Abróchate siempre el cinturón. Los adelantamientos en carreteras nacionales pueden ser bruscos.' },
      { type: 'rule', icon: '🤗', text: 'Los rumanos son muy acogedores, especialmente en el campo. No te sorprendas si te invitan a comer.' },
      { type: 'sub', title: 'Números de emergencia' },
      { type: 'kv', items: [{ k: 'Emergencias', v: '112' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Generalmente seguro para mujeres solas. Las experiencias en solitario son mayoritariamente positivas. Las zonas rurales son particularmente acogedoras.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'El rumano es una lengua romance (alfabeto latino). Los francófonos, italófonos e hispanohablantes tienen una ventaja significativa. Los jóvenes en la ciudad hablan bien inglés. En rural y con los conductores mayores, la comunicación puede ser difícil. El húngaro se habla en Transilvania.' },
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Uno de los países más baratos de Europa. Presupuesto mochilero: menos de 30 €/día. Albergue: ~10 €/noche. Comida en restaurante: 7 a 10 €. BlaBlaCar es popular y asequible.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'La acampada libre es LEGAL en las tierras públicas (no en parques nacionales, reservas naturales ni el Delta del Danubio). Atención a los osos en los Cárpatos. Couchsurfing activo, especialmente en Cluj-Napoca y Bucarest. TrustRoots popular entre autostopistas.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚗', name: 'BlaBlaCar', detail: 'Muy popular en Rumanía', price: '' },
        { emoji: '🚌', name: 'FlixBus', detail: 'Rutas principales', price: 'desde 5 €' },
        { emoji: '🚃', name: 'Trenes', detail: 'Lentos pero baratos', price: '' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Ene', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mar', level: 'ok' },
        { name: 'Abr', level: 'great' }, { name: 'May', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'good' }, { name: 'Ago', level: 'good' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'ok' }, { name: 'Dic', level: 'bad' },
      ]},
      { type: 'text', text: 'Abril a octubre: ideal. La Transfăgărășan (la carretera de montaña más bonita) solo está abierta de junio a octubre. Invierno: carreteras peligrosas, días cortos.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'El autostop está profundamente arraigado en la cultura rumana. Es un modo de transporte habitual, no solo para viajeros. Las salidas de ciudad tienen zonas de recogida dedicadas. Los conductores son increíblemente amigables, generosos y curiosos con los extranjeros. Transilvania es la región más acogedora.' },
      { type: 'event', items: [
        { month: 'Ago', day: '⟳', name: 'Untold Festival (Cluj)', desc: 'Uno de los mayores festivales de música de Europa del Este.' },
        { month: 'Sep', day: '⟳', name: 'George Enescu Festival (Bucarest)', desc: 'Festival de música clásica de renombre mundial.' },
      ]},
    ]},
  },

  // ==================== BULGARIA ====================
  BG: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Ninguna ley prohíbe el autostop en Bulgaria excepto en los pocos tramos de verdadera autopista. Es una herencia de la época socialista, ampliamente aceptado.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Muy fácil, especialmente en el eje Sofía-Plovdiv (corredor Europa-Turquía). El este-oeste es más fácil que el norte-sur. En verano, la costa del Mar Negro es popular pero con competencia.' },
      { type: 'text', text: 'Los camioneros (TIR) son numerosos y dispuestos a llevar pasajeros. Atención en verano (35°C+): los camiones deben aparcar de 13h a 21h. Sal temprano por la mañana.' },
      { type: 'warn', text: '⚠️ Escribe tu destino en CIRÍLICO. Mejora considerablemente las posibilidades de que los conductores paren.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Bulgaria es un país seguro para el autostop. Las carreteras secundarias están a veces en mal estado, así que prioriza los ejes principales.' },
      { type: 'sub', title: 'Usa SpotHitch para tu seguridad' },
      { type: 'rule', icon: '🛡️', text: 'Activa el Modo Guardián antes de cada viaje. Una persona de confianza sigue tu posición en tiempo real.' },
      { type: 'rule', icon: '🆘', text: 'Configura el modo SOS con tus contactos. Un toque activa una triple alerta (push, SMS, llamada).' },
      { type: 'rule', icon: '📱', text: 'Fotografía la matrícula y envíala a alguien antes de subir.' },
      { type: 'rule', icon: '🎒', text: 'Mantén tu mochila accesible (en tu regazo o a tus pies), nunca en el maletero.' },
      { type: 'sub', title: 'Consejos del país' },
      { type: 'rule', icon: '🛣️', text: 'Prioriza las carreteras principales y las autopistas. Las carreteras secundarias están a veces mal mantenidas.' },
      { type: 'rule', icon: '🔄', text: 'Atención: en Bulgaria, asentir con la cabeza significa "no" y negarla significa "sí". La confusión es frecuente.' },
      { type: 'sub', title: 'Números de emergencia' },
      { type: 'kv', items: [{ k: 'Emergencias', v: '112' }] },
    ]},
    women: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'Generalmente seguro para viajeras solas. La criminalidad es baja y los locales son serviciales.' },
      { type: 'warn', text: '⚠️ En los grandes ejes (Sofía-Estambul, Sofía-Varna), hay trabajadoras sexuales al borde de las carreteras. Las mujeres deben vestirse sobriamente y alejarse de esas zonas. Usa solo el pulgar levantado (agitar la mano puede confundirse con una señal de solicitud).' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'El búlgaro usa el alfabeto cirílico, lo que constituye una barrera significativa. El inglés es limitado fuera de las grandes ciudades. La comunicación se basa a menudo en los gestos. Los conductores ofrecen frecuentemente rakia (aguardiente artesanal) como gesto social.' },
      { type: 'phrase', items: [
        { local: 'Avtostop', meaning: 'Autostop' },
        { local: 'Blagodarya', meaning: 'Gracias' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Entre los países más baratos de Europa. Presupuesto mochilero: ~30 €/día. Comida abundante en restaurante por menos de 15 €. Albergue: 8 a 12 €/noche.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Acampada libre técnicamente prohibida pero ampliamente tolerada fuera de las zonas turísticas, ciudades y reservas naturales. Multa hasta 1.000 € en zona protegida. Los fuegos están estrictamente prohibidos fuera de los hogares públicos. Krapets (frontera rumana) tiene una zona de acampada libre gratuita en la playa.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Los grupos de Facebook de coche compartido son más populares que BlaBlaCar en Bulgaria. Más rápidos y más baratos que los buses. Buses y minibuses conectan la mayoría de las ciudades. Trenes existentes pero lentos.' },
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Ene', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mar', level: 'ok' },
        { name: 'Abr', level: 'good' }, { name: 'May', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'good' }, { name: 'Ago', level: 'good' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'ok' }, { name: 'Dic', level: 'bad' },
      ]},
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'El autostop tiene raíces socialistas. Muchos conductores mayores son nostálgicos y acogedores. Los conductores son curiosos, amables y hospitalarios. El rakia se comparte como gesto social.' },
      { type: 'event', items: [
        { month: 'Jun', day: '⟳', name: 'Festival de las Rosas (Kazanlak)', desc: 'Celebración de la cosecha de rosas, tradición secular.' },
        { month: 'Jul', day: '⟳', name: 'Julio Morning (costa)', desc: 'Reunión hippie al amanecer en las playas del Mar Negro.' },
      ]},
    ]},
  },

  // ==================== LITHUANIA ====================
  LT: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'El autostop en las autopistas no está explícitamente prohibido (pero caminar sobre ellas sí). En la práctica, los autostopistas se colocan cerca de las autopistas sin problemas. Los escolares caminan por las carreteras, así que los conductores están acostumbrados.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Lituania es descrita como un "paraíso para el autostop". Tiempo de espera: 30 a 90 minutos, bajo 30 minutos en pareja.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Lituania es un país muy seguro para el autostop. La Via Baltica (E67) es un excelente eje para avanzar hacia el norte o el sur.' },
      { type: 'sub', title: 'Usa SpotHitch para tu seguridad' },
      { type: 'rule', icon: '🛡️', text: 'Activa el Modo Guardián antes de cada viaje. Una persona de confianza sigue tu posición en tiempo real.' },
      { type: 'rule', icon: '🆘', text: 'Configura el modo SOS con tus contactos. Un toque activa una triple alerta (push, SMS, llamada).' },
      { type: 'rule', icon: '📱', text: 'Fotografía la matrícula y envíala a alguien antes de subir.' },
      { type: 'rule', icon: '🎒', text: 'Mantén tu mochila accesible (en tu regazo o a tus pies), nunca en el maletero.' },
      { type: 'sub', title: 'Consejos del país' },
      { type: 'rule', icon: '🛣️', text: 'La Via Baltica (E67) atraviesa el país de sur a norte. Es el eje más transitado para el autostop.' },
      { type: 'rule', icon: '⛽', text: 'Las estaciones de servicio a lo largo de los grandes ejes son spots fiables para encontrar un viaje.' },
      { type: 'sub', title: 'Números de emergencia' },
      { type: 'kv', items: [{ k: 'Emergencias', v: '112' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Los países bálticos son descritos como un "paraíso para las autostopistas" y "muy favorables a las mujeres".' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'El lituano es el idioma principal. Los anglófonos son limitados fuera de Vilna. Los conductores son amigables a pesar de la barrera lingüística. Una SIM cuesta ~0,30 € en los quioscos (útil para apps de traducción).' },
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Presupuesto mochilero: ~45 €/día. Los trenes son extremadamente baratos (a menudo menos de 2 €/trayecto).' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'La acampada libre es LEGAL en Lituania, excepto en reservas naturales, zonas urbanas, playas y propiedades privadas.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Lux Express', detail: 'Bus entre capitales bálticas', price: '~25 €' },
        { emoji: '🚃', name: 'Trenes', detail: 'Vilna-Riga directo (desde 2023), muy barato', price: 'desde 2 €' },
        { emoji: '🤝', name: 'Coche compartido local', detail: 'Plataformas lituanas de coche compartido', price: '' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Ene', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mar', level: 'bad' },
        { name: 'Abr', level: 'ok' }, { name: 'May', level: 'good' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Ago', level: 'great' }, { name: 'Sep', level: 'good' },
        { name: 'Oct', level: 'ok' }, { name: 'Nov', level: 'bad' }, { name: 'Dic', level: 'bad' },
      ]},
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Cultura de autostop establecida. Los clubes de autostopistas locales están activos. La gente es tímida pero amigable. Comparable a Polonia en términos de cultura del autostop.' },
    ]},
  },

  // ==================== LATVIA ====================
  LV: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Ninguna ley prohíbe el autostop en Letonia. Permitido siempre que no pongas en peligro la seguridad vial.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Bastante fácil. La gente está acostumbrada a los autostopistas en las carreteras principales (E67/Via Baltica) y en zona rural. Muchos jóvenes letones hacen autostop en verano para ir a festivales o volver a casa.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Letonia es un país seguro y tranquilo para el autostop. La Via Baltica (E67) es el mejor eje para avanzar eficazmente.' },
      { type: 'sub', title: 'Usa SpotHitch para tu seguridad' },
      { type: 'rule', icon: '🛡️', text: 'Activa el Modo Guardián antes de cada viaje. Una persona de confianza sigue tu posición en tiempo real.' },
      { type: 'rule', icon: '🆘', text: 'Configura el modo SOS con tus contactos. Un toque activa una triple alerta (push, SMS, llamada).' },
      { type: 'rule', icon: '📱', text: 'Fotografía la matrícula y envíala a alguien antes de subir.' },
      { type: 'rule', icon: '🎒', text: 'Mantén tu mochila accesible (en tu regazo o a tus pies), nunca en el maletero.' },
      { type: 'sub', title: 'Consejos del país' },
      { type: 'rule', icon: '🛣️', text: 'La Via Baltica (E67) es el eje principal. Las gasolineras a lo largo de esta ruta son excelentes spots.' },
      { type: 'rule', icon: '❄️', text: 'En invierno y a principios de primavera, las carreteras pueden ser resbaladizas. Prevé ropa de abrigo y visible.' },
      { type: 'sub', title: 'Números de emergencia' },
      { type: 'kv', items: [{ k: 'Emergencias', v: '112' }] },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Población dividida entre letonófonos y rusófonos. La mayoría de los adultos conocen ambos. Los jóvenes generalmente hablan bien inglés. WiFi gratuito en casi todas las ciudades (bibliotecas, centros urbanos).' },
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Presupuesto mochilero: ~45 €/día. Trenes a menudo por debajo de 2 €/trayecto.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'La acampada libre es LEGAL en Letonia salvo prohibición explícita. Prohibida en reservas naturales, parques nacionales, dunas con vegetación y playas urbanas. Propiedad privada: permiso del propietario requerido.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Lux Express', detail: 'Riga-Tallin (~4h, ~20 €), Riga-Vilna (~4h30, ~25 €)', price: 'desde 15 €' },
        { emoji: '📱', name: 'Grupos de Facebook', detail: 'Coche compartido por ruta (muy popular)', price: '' },
        { emoji: '🚗', name: 'BlaBlaCar', detail: 'Activo en Letonia', price: '' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Ene', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mar', level: 'bad' },
        { name: 'Abr', level: 'ok' }, { name: 'May', level: 'good' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Ago', level: 'great' }, { name: 'Sep', level: 'good' },
        { name: 'Oct', level: 'ok' }, { name: 'Nov', level: 'bad' }, { name: 'Dic', level: 'bad' },
      ]},
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'El autostop es una práctica aceptada. Los letones son reservados pero serviciales. Sin controles en las fronteras Schengen con Estonia y Lituania.' },
      { type: 'event', items: [
        { month: 'Jun', day: '23-24', name: 'Jāņi (Līgo)', desc: 'Solsticio de verano, hogueras, coronas de flores, la mayor fiesta letona.' },
      ]},
    ]},
  },

  // ==================== ESTONIA ====================
  EE: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'El autostop es legal en Estonia. Obligación legal de noche: DEBES llevar un reflector luminoso en las carreteras oscuras. Los chalecos de seguridad son recomendados pero pueden hacer creer a los conductores que eres policía.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Relativamente bueno. Tiempo de espera: 5 a 10 minutos típicamente, a veces 30 a 90 minutos. Los coches paran en las autopistas y las carreteras pequeñas. Todo tipo de vehículos paran: coches, camiones, tractores, incluso taxis que vuelven a casa.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Estonia es un país muy seguro para el autostop. La Via Baltica (E67) es el eje ideal para cruzar el pa��s.' },
      { type: 'sub', title: 'Usa SpotHitch para tu seguridad' },
      { type: 'rule', icon: '🛡️', text: 'Activa el Modo Guardián antes de cada viaje. Una persona de confianza sigue tu posición en tiempo real.' },
      { type: 'rule', icon: '🆘', text: 'Configura el modo SOS con tus contactos. Un toque activa una triple alerta (push, SMS, llamada).' },
      { type: 'rule', icon: '📱', text: 'Fotografía la matrícula y envíala a alguien antes de subir.' },
      { type: 'rule', icon: '🎒', text: 'Mantén tu mochila accesible (en tu regazo o a tus pies), nunca en el maletero.' },
      { type: 'sub', title: 'Consejos del país' },
      { type: 'rule', icon: '🛣️', text: 'La Via Baltica (E67) conecta Tallin con la frontera letona. Es el eje más transitado.' },
      { type: 'rule', icon: '⛽', text: 'Las estaciones de servicio son spots seguros y bien iluminados, perfectos para abordar a los conductores.' },
      { type: 'sub', title: 'Números de emergencia' },
      { type: 'kv', items: [{ k: 'Emergencias', v: '112' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Los países bálticos son descritos como un "paraíso para las autostopistas". Tallin es muy segura para viajeras solas.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'El estonio y el ruso son los idiomas principales. El inglés es bien hablado por los jóvenes y los activos. Las conversaciones se hacen en estonio, ruso o inglés según el conductor.' },
      { type: 'phrase', items: [
        { local: 'Aitäh sõidu eest', meaning: 'Gracias por el viaje' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Presupuesto mochilero: ~45 €/día. Trenes extremadamente baratos. El agua del grifo y de los pozos es potable en toda Estonia.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'La acampada libre es LEGAL en Estonia excepto en propiedad privada, en parques nacionales o zonas militares. Lleva comida: pocas áreas de servicio al borde de la carretera.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Lux Express', detail: 'Tallin-Riga (~4h)', price: 'desde 15 €' },
        { emoji: '⛴️', name: 'Ferries', detail: 'Hacia las islas (Saaremaa, Hiiumaa)', price: '' },
      ]},
      { type: 'text', text: 'País muy conectado digitalmente (e-Estonia). Las apps de traducción y mapas en línea funcionan perfectamente en todas partes.' },
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Ene', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mar', level: 'bad' },
        { name: 'Abr', level: 'ok' }, { name: 'May', level: 'good' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Ago', level: 'good' }, { name: 'Sep', level: 'ok' },
        { name: 'Oct', level: 'bad' }, { name: 'Nov', level: 'bad' }, { name: 'Dic', level: 'bad' },
      ]},
      { type: 'text', text: 'Solo el verano es fiable (casi 24h de luz en junio). Invierno: nieve, frío, oscuridad. Algunas carreteras pasan de 110 a 90 km/h en invierno.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Los estonios son reservados pero serviciales. Las islas (Kihnu, Saaremaa) preservan modos de vida tradicionales y ofrecen experiencias de autostop únicas.' },
      { type: 'event', items: [
        { month: 'Jun', day: '23-24', name: 'Jaanipäev (San Juan)', desc: 'Solsticio de verano, hogueras. Mayor fiesta estonia.' },
      ]},
    ]},
  },

  // ==================== TURKEY ====================
  TR: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'El autostop ("otostop") no es explícitamente ilegal en Turquía, pero está prohibido en las autopistas (otoban). En la práctica, la aplicación es muy laxa y la gente hace autostop en las carreteras de forma rutinaria.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Turquía es descrita como un "paraíso para los autostopistas" por todas las fuentes. El tiempo de espera rara vez supera los 15 minutos en las carreteras frecuentadas.' },
      { type: 'sub', title: 'Por región (del más fácil al más difícil)' },
      { type: 'kv', items: [
        { k: 'Sureste anatolio', v: 'El 1er coche para', color: 'green' },
        { k: 'Costa del Mar Negro', v: 'Muy fácil', color: 'green' },
        { k: 'Anatolia central', v: '~20 min de espera', color: 'green' },
        { k: 'Costa mediterránea', v: 'Más largo (hasta 2h)', color: 'amber' },
        { k: 'Estambul', v: 'Muy difícil (puede llevar 10h)', color: 'red' },
      ]},
      { type: 'text', text: 'En zona rural, caminar por una carretera basta: los conductores paran por sí solos sin que levantes el pulgar.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Turquía es un país seguro para el autostop. La hospitalidad turca es legendaria y los conductores paran fácilmente, especialmente en las gasolineras.' },
      { type: 'sub', title: 'Usa SpotHitch para tu seguridad' },
      { type: 'rule', icon: '🛡️', text: 'Activa el Modo Guardián antes de cada viaje. Una persona de confianza sigue tu posición en tiempo real.' },
      { type: 'rule', icon: '🆘', text: 'Configura el modo SOS con tus contactos. Un toque activa una triple alerta (push, SMS, llamada).' },
      { type: 'rule', icon: '📱', text: 'Fotografía la matrícula y envíala a alguien antes de subir.' },
      { type: 'rule', icon: '🎒', text: 'Mantén tu mochila accesible (en tu regazo o a tus pies), nunca en el maletero.' },
      { type: 'sub', title: 'Consejos del país' },
      { type: 'rule', icon: '⛽', text: 'Las estaciones de servicio son los spots más seguros y eficaces para encontrar un viaje.' },
      { type: 'rule', icon: '🌍', text: 'Evita las zonas fronterizas del sur (Siria, Irak). El resto del país es muy acogedor.' },
      { type: 'sub', title: 'Números de emergencia' },
      { type: 'kv', items: [{ k: 'Emergencias', v: '112' }] },
    ]},
    women: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'El tema más documentado. Turquía está considerada como "no para autostopistas principiantes" si estás sola. El código de vestimenta es crucial: pantalones largos, mangas hasta los codos mínimo.' },
      { type: 'text', text: 'Las experiencias varían enormemente según la vestimenta, el comportamiento, las competencias lingüísticas y la región. Recomendación de todas las fuentes: más seguro en pareja o en grupo.' },
      { type: 'phrase', items: [
        { local: 'Çok ayıp', meaning: 'Está muy mal (para rechazar un comportamiento)' },
        { local: 'Evliyim', meaning: 'Estoy casado/a' },
      ]},
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Muy poca gente habla inglés (~20% de los conductores). Google Translate con función vocal es esencial. El turco es "relativamente fácil de aprender y pronunciar". Graba un mensaje pre-traducido explicando tu viaje.' },
      { type: 'phrase', items: [
        { local: 'Otostop', meaning: 'Autostop' },
        { local: 'Param yok', meaning: 'No tengo dinero' },
        { local: 'Nereye gidiyorsunuz?', meaning: '¿A dónde va?' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Presupuesto mochilero: 25 a 45 €/día. Comida tradicional: 3 a 5 €. Albergue: 5 a 15 €/noche. Los conductores compran frecuentemente té, comida e incluso comidas completas. "Comida y té a raudales."' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'La acampada libre existe en una zona gris legal. Técnicamente prohibida pero la aplicación es laxa. Generalmente tolerada en zonas rurales y forestales. Prohibida en ciertas playas (sitios de anidación de tortugas). Las invitaciones a casas de los conductores son extremadamente comunes.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚐', name: 'Dolmuş (minibús compartido)', detail: 'Muy barato, sin horario, levanta la mano para pararlo', price: '1 a 3 €' },
        { emoji: '🚌', name: 'Buses interurbanos', detail: 'Modernos, cómodos, servicio a bordo, climatizados', price: '' },
      ]},
      { type: 'tip', text: '💡 ~30% de los chóferes de buses interurbanos te darán un viaje gratis si explicas que no tienes dinero.' },
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Ene', level: 'ok' }, { name: 'Feb', level: 'ok' }, { name: 'Mar', level: 'good' },
        { name: 'Abr', level: 'great' }, { name: 'May', level: 'great' }, { name: 'Jun', level: 'good' },
        { name: 'Jul', level: 'ok' }, { name: 'Ago', level: 'ok' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'great' }, { name: 'Nov', level: 'good' }, { name: 'Dic', level: 'ok' },
      ]},
      { type: 'text', text: 'Abril es el mejor mes. Primavera y otoño ideales. Verano: muy caluroso (35°C+ en la costa sur y en el interior). Invierno: frío en el interior, suave en la costa sur.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'La hospitalidad turca es legendaria. El té se ofrece en cada parada. Los conductores compran comidas, hacen visitas improvisadas e invitan a sus casas. Aceptar la comida/bebida crea un vínculo. Rechazar puede ofender.' },
      { type: 'event', items: [
        { month: 'Abr', day: '23', name: 'Fiesta de la Soberanía Nacional', desc: 'Festivo, celebraciones en todo el país.' },
        { month: 'Abr-May', day: '⟳', name: 'Ramadán y Eid', desc: 'Fechas variables. Durante el Ramadán, la gente ayuna de día. El Eid es muy festivo.' },
        { month: 'Oct', day: '29', name: 'Fiesta de la República', desc: 'Mayor fiesta nacional turca.' },
      ]},
    ]},
  },

  // ==================== GEORGIA ====================
  GE: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Ninguna restricción legal sobre el autostop en Georgia. A diferencia de la mayoría de los países europeos, a nadie le preocupa si haces autostop directamente en las autopistas.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Fácil la mayor parte del tiempo. Tiempo de espera medio: ~30 minutos. En zona rural, los conductores paran incluso sin que levantes el pulgar: caminar con una mochila basta. Los coches de policía también ofrecen viajes y ayudan a organizar el siguiente.' },
      { type: 'tip', text: '💡 La hospitalidad georgiana es increíble. Los conductores te invitan a comer, a beber y a dormir en sus casas regularmente.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Georgia es un país seguro para el autostop. La hospitalidad georgiana es legendaria. El principal riesgo viene de las carreteras de montaña (curvas cerradas, sin guardarraíl).' },
      { type: 'sub', title: 'Usa SpotHitch para tu seguridad' },
      { type: 'rule', icon: '🛡️', text: 'Activa el Modo Guardián antes de cada viaje. Una persona de confianza sigue tu posición en tiempo real.' },
      { type: 'rule', icon: '🆘', text: 'Configura el modo SOS con tus contactos. Un toque activa una triple alerta (push, SMS, llamada).' },
      { type: 'rule', icon: '📱', text: 'Fotografía la matrícula y envíala a alguien antes de subir.' },
      { type: 'rule', icon: '🎒', text: 'Mantén tu mochila accesible (en tu regazo o a tus pies), nunca en el maletero.' },
      { type: 'sub', title: 'Consejos del país' },
      { type: 'rule', icon: '🏔️', text: 'Las carreteras de montaña son peligrosas (curvas sin guardarraíl, velocidad alta). Abróchate el cinturón.' },
      { type: 'rule', icon: '🍷', text: 'Los conductores pueden ofrecerte vino o chacha. Aceptar una copa es un gesto de amistad en Georgia.' },
      { type: 'sub', title: 'Números de emergencia' },
      { type: 'kv', items: [{ k: 'Emergencias', v: '112' }] },
    ]},
    women: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'Georgia está considerada segura para viajeras solas. Los hombres georgianos son generalmente respetuosos con las mujeres pero pueden ser insistentes. Sé firme y pararán.' },
      { type: 'text', text: 'Algunos conductores pueden ser insistentes socialmente (invitaciones repetidas, interés por las extranjeras). Sé firme. Recomendación: viajar en pareja cuando sea posible.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Los mayores hablan ruso, los jóvenes (<30 años) hablan más inglés, especialmente en Tbilisi y Batumi. Los pueblos pueden tener solo hablantes de georgiano. Buena cobertura móvil para apps de traducción.' },
      { type: 'phrase', items: [
        { local: 'Gamarjoba', meaning: 'Hola' },
        { local: 'Madloba', meaning: 'Gracias' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Ultra-presupuesto posible: ~6 €/día (camping + autostop + cocinar). Presupuesto cómodo: ~30 €/día. Albergue en Tbilisi: desde 5 €/noche. Comida completa: 3 a 5 €. Metro/bus en Tbilisi: unos céntimos.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'La acampada libre es legal en Georgia en las tierras públicas. Prohibida en propiedad privada sin permiso. Spots populares gratuitos: Kazbegi, valle de Juta, lago Udziro en Racha, Svaneti. Las invitaciones a casas de locales son frecuentes.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚐', name: 'Marshrutka (furgonetas compartidas)', detail: 'Columna vertebral del transporte. Muy barato.', price: '1 a 7 €' },
        { emoji: '🚃', name: 'Trenes', detail: 'Red soviética. Tbilisi-Batumi rápido. Tbilisi-Zugdidi nocturno.', price: '4 a 15 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Ene', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mar', level: 'ok' },
        { name: 'Abr', level: 'good' }, { name: 'May', level: 'good' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Ago', level: 'great' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'ok' }, { name: 'Dic', level: 'bad' },
      ]},
      { type: 'text', text: 'Finales de junio a finales de septiembre: ideal para trekking y autostop en montaña (Gran Cáucaso abierto julio y agosto). Finales de septiembre a principios de noviembre: 15 a 20°C en la ciudad, colores de otoño.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'La hospitalidad georgiana está considerada una de las mejores del mundo. Los conductores invitan espontáneamente a comer, beber y dormir. El chacha (aguardiente de uva) es la bebida nacional. La cocina georgiana es rica: vino, khinkali (raviolis), khachapuri (pan con queso).' },
      { type: 'event', items: [
        { month: 'Oct', day: '14', name: 'Tbilisoba', desc: 'Fiesta de Tbilisi. Música, danza, gastronomía en toda la ciudad.' },
        { month: 'Oct', day: '⟳', name: 'Rtveli (vendimia)', desc: 'Cosecha de la uva. Georgia es la cuna del vino (8.000 años).' },
      ]},
    ]},
  },

  // ==================== ARMENIA ====================
  AM: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'El autostop es legal en Armenia. Ninguna restricción documentada. Usa el pulgar levantado (palma hacia abajo = quieres un taxi).' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Varias fuentes clasifican Armenia como uno de los mejores países del mundo para el autostop. Tiempo de espera medio: 5 a 10 minutos, a veces bajo 5 minutos.' },
      { type: 'text', text: 'Los locales también hacen autostop porque el transporte público es limitado y las furgonetas están abarrotadas. Es un modo de transporte normal. En zona remota, el tráfico puede ser muy escaso (1h+ de espera).' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Armenia es un país muy seguro para el autostop. Los habitantes son cálidos y el país es apacible. El principal riesgo viene de las carreteras de montaña.' },
      { type: 'sub', title: 'Usa SpotHitch para tu seguridad' },
      { type: 'rule', icon: '🛡️', text: 'Activa el Modo Guardián antes de cada viaje. Una persona de confianza sigue tu posición en tiempo real.' },
      { type: 'rule', icon: '🆘', text: 'Configura el modo SOS con tus contactos. Un toque activa una triple alerta (push, SMS, llamada).' },
      { type: 'rule', icon: '📱', text: 'Fotografía la matrícula y envíala a alguien antes de subir.' },
      { type: 'rule', icon: '🎒', text: 'Mantén tu mochila accesible (en tu regazo o a tus pies), nunca en el maletero.' },
      { type: 'sub', title: 'Consejos del país' },
      { type: 'rule', icon: '🏔️', text: 'Las carreteras de montaña son el principal riesgo. Son sinuosas y a veces están mal mantenidas.' },
      { type: 'rule', icon: '🤝', text: 'Los armenios son de una hospitalidad notable. A menudo te invitarán a compartir una comida.' },
      { type: 'sub', title: 'Números de emergencia' },
      { type: 'kv', items: [{ k: 'Emergencias', v: '911' }] },
    ]},
    women: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'El miedo disminuye año tras año. Algunos conductores pueden ser insistentes socialmente (invitaciones repetidas, interés romántico). Sé firme y clara. Prefiere los coches con mujeres o niños. Evita viajar sola en las zonas aisladas del sur.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'El ruso es la lengua extranjera más común, hablada por casi todo el mundo. Esencial fuera de Ereván. El inglés es raro, especialmente en zona rural. El alfabeto armenio es único y el idioma muy difícil de aprender.' },
      { type: 'phrase', items: [
        { local: 'Barev', meaning: 'Hola' },
        { local: 'Shnorhakalutyun', meaning: 'Gracias' },
        { local: 'Anvchar?', meaning: '¿Gratis?' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Ultra-presupuesto posible: ~7 €/día. Presupuesto cómodo: 25 a 45 €/día. Albergue: 8 a 18 €/noche. Comida local: 3 a 5 €. Metro de Ereván: < 0,20 €. Los conductores a menudo ofrecen cola, helado o comidas completas gratis.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'La acampada libre es legal en todas las tierras públicas sin permiso. Segura en la mayoría de las regiones excepto cerca de la frontera azerbaiyana. Hace frío a partir de octubre. Atención a los lobos, animales salvajes y perros callejeros. Los locales son curiosos y pueden invitarte a un café en sus casas.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚐', name: 'Marshrutkas', detail: 'Furgonetas abarrotadas pero baratas. Cubren la mayoría de las rutas.', price: '0,30 a 1 €' },
        { emoji: '🚌', name: 'Bus', detail: 'Únicamente las grandes ciudades', price: '' },
      ]},
      { type: 'warn', text: '⚠️ Pulgar levantado = autostop. Palma hacia abajo = taxi. Acláralo ANTES de subir para evitar que te pidan dinero.' },
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Ene', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mar', level: 'ok' },
        { name: 'Abr', level: 'good' }, { name: 'May', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'good' }, { name: 'Ago', level: 'good' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'ok' }, { name: 'Dic', level: 'bad' },
      ]},
      { type: 'text', text: 'Mayo, junio y septiembre, octubre: ideal (22 a 26°C). Verano: caluroso en la llanura (hasta 40°C) pero ideal en montaña. Invierno: frío, nieve en montaña, no recomendado para el autostop.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'La hospitalidad armenia está considerada entre las mejores del mundo. Los conductores paran sin que se les pida, compran bebidas, invitan a comer y presentan a su familia. Las comunidades kurdas del sur de Armenia son "excepcionalmente hospitalarias". Aceptar la comida/bebida muestra tu buena voluntad.' },
      { type: 'event', items: [
        { month: 'Abr', day: '24', name: 'Día del Recuerdo', desc: 'Conmemoración del genocidio armenio. Procesiones en Ereván.' },
        { month: 'Sep-Oct', day: '⟳', name: 'Areni Wine Festival', desc: 'Festival del vino en el pueblo de Areni, cuna del viñedo más antiguo conocido.' },
      ]},
    ]},
  },
  // ==================== BELARUS ====================
  BY: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'El autostop es legal en Bielorrusia. No hay restricciones específicas. La práctica es habitual porque el transporte público es limitado fuera de Minsk.' },
      { type: 'warn', text: '⚠️ Se necesita visado para la mayoría de nacionalidades. Visado gratuito de 30 días si llegas por el aeropuerto de Minsk. Entrada terrestre desde Rusia: sin control fronterizo (unión aduanera), pero necesitas visado bielorruso.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Bielorrusia es fácil para el autostop. Tiempo de espera medio: 15-30 min en las carreteras principales. Los conductores sienten curiosidad por conocer extranjeros (poco frecuentes en el país). Las autopistas (M1, M6) tienen buen tráfico.' },
      { type: 'text', text: 'Muchos conductores intentan rechazar el dinero. La técnica clásica: colocarse en gasolineras o paradas de bus a la salida de la ciudad. Los camioneros son acogedores pero rara vez hablan algo distinto del ruso/bielorruso.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Bielorrusia es muy segura en cuanto a criminalidad. Los controles policiales son frecuentes. Lleva siempre tu pasaporte encima.' },
      { type: 'sub', title: 'Usa SpotHitch para tu seguridad' },
      { type: 'rule', icon: '🛡️', text: 'Activa el Modo Guardián antes de cada viaje. Una persona de confianza sigue tu posición en tiempo real.' },
      { type: 'rule', icon: '🆘', text: 'Configura el modo SOS con tus contactos. Un toque activa una triple alerta (push, SMS, llamada).' },
      { type: 'rule', icon: '📱', text: 'Fotografía la matrícula y envíala a alguien antes de subir.' },
      { type: 'rule', icon: '🎒', text: 'Mantén tu mochila accesible (en tu regazo o a tus pies), nunca en el maletero.' },
      { type: 'sub', title: 'Consejos del país' },
      { type: 'rule', icon: '📋', text: 'Lleva siempre tu pasaporte y tu registro migratorio. Los controles de policía son frecuentes.' },
      { type: 'rule', icon: '🚫', text: 'No fotografíes edificios gubernamentales ni militares. Evita las discusiones políticas con los conductores.' },
      { type: 'sub', title: 'Números de emergencia' },
      { type: 'kv', items: [{ k: 'Emergencias', v: '112' }, { k: 'Policía', v: '102' }, { k: 'Ambulancia', v: '103' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'El país se considera seguro para mujeres que viajan solas. Los incidentes son muy raros. La sociedad es conservadora pero respetuosa. Evita viajar sola de noche en zonas aisladas.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'El ruso es el idioma principal (hablado por el 99% de la población a diario). El bielorruso es oficial pero poco usado. El inglés es muy raro fuera de Minsk. El ruso es indispensable para comunicarse.' },
      { type: 'phrase', items: [
        { local: 'Zdrastvuyte', meaning: 'Hola (formal)' },
        { local: 'Spasibo', meaning: 'Gracias' },
        { local: 'Besplatno', meaning: 'Gratis' },
        { local: 'Do...', meaning: 'Hasta... (+ nombre de ciudad)' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Muy barato. Presupuesto ajustado: 10-15 €/día. Comida en una stolovaya (cantina soviética): 2-4 €. Hostel en Minsk: 8-15 €/noche. El metro de Minsk cuesta ~0,30 €.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'La acampada libre está tolerada en los bosques (60% del territorio). Está prohibida en los parques nacionales sin autorización. Los conductores a veces invitan a dormir en su casa. Obligación de registro en los 10 días en hotel o en la oficina de migraciones.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚂', name: 'Tren', detail: 'Red soviética fiable y barata', price: '2-10 €' },
        { emoji: '🚌', name: 'Marshrutka', detail: 'Minibuses frecuentes entre ciudades', price: '1-5 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Ene', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mar', level: 'ok' },
        { name: 'Abr', level: 'ok' }, { name: 'May', level: 'good' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Ago', level: 'great' }, { name: 'Sep', level: 'good' },
        { name: 'Oct', level: 'ok' }, { name: 'Nov', level: 'bad' }, { name: 'Dic', level: 'bad' },
      ]},
      { type: 'text', text: 'Junio a agosto: ideal (20-28°C). El invierno es duro (hasta -20°C) y desaconsejado para hacer dedo. Los mosquitos son numerosos en verano en las zonas pantanosas.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Bielorrusia conserva una atmósfera soviética única. La gente es reservada en el primer contacto pero muy cálida una vez roto el hielo. El vodka y el salo (tocino ahumado) son las especialidades locales. Nunca rechaces un brindis.' },
    ]},
  },
  // ==================== MOLDOVA ====================
  MD: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'El autostop es legal en Moldavia. Práctica muy habitual, sobre todo en zona rural donde el transporte público es escaso. Los conductores paran fácilmente.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Moldavia es fácil para el autostop. El país es pequeño (340 km de norte a sur) y se puede cruzar en un día. Tiempo de espera: 10-20 min. Los conductores sienten curiosidad por los extranjeros. Atención: algunos conductores esperan un pago (transporte informal local). Aclara que es gratis con "gratis".' },
      { type: 'warn', text: '⚠️ Transnistria (república autoproclamada al este) es accesible pero con controles fronterizos. El autostop allí es fácil pero el ruso es indispensable.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Moldavia es un país seguro con baja criminalidad. Evita viajar solo de noche en zonas aisladas.' },
      { type: 'sub', title: 'Usa SpotHitch para tu seguridad' },
      { type: 'rule', icon: '🛡️', text: 'Activa el Modo Guardián antes de cada viaje. Una persona de confianza sigue tu posición en tiempo real.' },
      { type: 'rule', icon: '🆘', text: 'Configura el modo SOS con tus contactos. Un toque activa una triple alerta (push, SMS, llamada).' },
      { type: 'rule', icon: '📱', text: 'Fotografía la matrícula y envíala a alguien antes de subir.' },
      { type: 'rule', icon: '🎒', text: 'Mantén tu mochila accesible (en tu regazo o a tus pies), nunca en el maletero.' },
      { type: 'sub', title: 'Consejos del país' },
      { type: 'rule', icon: '🛣️', text: 'Las carreteras principales entre Chisináu y las ciudades principales son seguras y transitadas.' },
      { type: 'rule', icon: '🍷', text: 'Los moldavos son hospitalarios. Es frecuente que te ofrezcan vino casero. Acepta con una sonrisa.' },
      { type: 'sub', title: 'Números de emergencia' },
      { type: 'kv', items: [{ k: 'Emergencias', v: '112' }, { k: 'Policía', v: '902' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Considerado seguro para mujeres que viajan solas. La sociedad es tradicional. Viajeras reportan experiencias positivas. Evita Transnistria sola.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'El rumano es el idioma oficial. El ruso está muy extendido, sobre todo en Chișinău y Transnistria. El inglés lo hablan los jóvenes urbanos. En zona rural, el rumano o el ruso es indispensable.' },
      { type: 'phrase', items: [
        { local: 'Bună ziua', meaning: 'Hola' },
        { local: 'Mulțumesc', meaning: 'Gracias' },
        { local: 'Gratis', meaning: 'Gratis' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'El país más barato de Europa. Presupuesto ajustado: 8-12 €/día. Una comida completa en restaurante: 3-5 €. Vino local excelente a 1-2 €/botella. Hostel: 8-12 €/noche.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'La acampada libre está tolerada pero no es habitual. Los viñedos ofrecen lugares bonitos. Las familias a menudo invitan a los viajeros a dormir en su casa, sobre todo en zona rural.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚐', name: 'Marshrutka', detail: 'Principal transporte entre ciudades, frecuente y barato', price: '1-3 €' },
        { emoji: '🚂', name: 'Tren', detail: 'Lento pero existente en las líneas principales', price: '1-5 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Ene', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mar', level: 'ok' },
        { name: 'Abr', level: 'good' }, { name: 'May', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'good' }, { name: 'Ago', level: 'good' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'ok' }, { name: 'Dic', level: 'bad' },
      ]},
      { type: 'text', text: 'Mayo-junio y septiembre-octubre: ideal. El verano puede ser muy caluroso (35°C+). El otoño es la temporada de vendimia, momento ideal para visitar.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Moldavia es el país del vino. Las bodegas subterráneas de Mileștii Mici son las más grandes del mundo (200 km de galerías). La hospitalidad moldava es sincera y generosa. Te ofrecerán vino casero, mămăligă (polenta) y plăcintă (empanada).' },
      { type: 'event', items: [
        { month: 'Oct', day: '⟳', name: 'Ziua Vinului (Día del Vino)', desc: 'Festival nacional del vino en Chișinău. Degustación gratuita por todas partes.' },
      ]},
    ]},
  },
  // ==================== UKRAINE ====================
  UA: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'El autostop es legal en Ucrania. Sin restricciones. Práctica habitual y culturalmente aceptada. Los ucranianos están familiarizados con el concepto.' },
      { type: 'warn', text: '⚠️ Desde 2022, la situación de seguridad ha cambiado radicalmente. Verifica las zonas de conflicto activo antes de viajar. El oeste del país (Lviv, Cárpatos) sigue siendo lo más accesible. La ley marcial puede restringir los desplazamientos.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'En tiempos de paz, Ucrania es uno de los mejores países de Europa para el autostop. Los conductores son generosos y curiosos. Tiempo de espera: 10-20 min. Los camioneros hacen largas distancias. Las carreteras principales (M06 Kiev-Lviv, M05 Kiev-Odesa) tienen buen tráfico.' },
      { type: 'text', text: 'Muchos conductores ofrecen espontáneamente comida, bebidas y alojamiento. El concepto "avtoStop" es bien entendido. Algunos conductores hacen desvíos importantes para ayudarte.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Verifica la situación de seguridad antes de viajar a Ucrania. Las zonas oeste y centro son históricamente más estables.' },
      { type: 'sub', title: 'Usa SpotHitch para tu seguridad' },
      { type: 'rule', icon: '🛡️', text: 'Activa el Modo Guardián antes de cada viaje. Una persona de confianza sigue tu posición en tiempo real.' },
      { type: 'rule', icon: '🆘', text: 'Configura el modo SOS con tus contactos. Un toque activa una triple alerta (push, SMS, llamada).' },
      { type: 'rule', icon: '📱', text: 'Fotografía la matrícula y envíala a alguien antes de subir.' },
      { type: 'rule', icon: '🎒', text: 'Mantén tu mochila accesible (en tu regazo o a tus pies), nunca en el maletero.' },
      { type: 'sub', title: 'Consejos del país' },
      { type: 'rule', icon: '📋', text: 'Consulta los avisos del Ministerio de Asuntos Exteriores antes de cualquier desplazamiento. La situación evoluciona.' },
      { type: 'rule', icon: '🌍', text: 'Las zonas oeste (Lviv, Ivano-Frankivsk) y centro (Kyiv, Vinnytsia) son históricamente las más estables.' },
      { type: 'sub', title: 'Números de emergencia' },
      { type: 'kv', items: [{ k: 'Emergencias', v: '112' }, { k: 'Policía', v: '102' }, { k: 'Ambulancia', v: '103' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'En tiempos de paz, varias viajeras reportan experiencias positivas en Ucrania. La sociedad es tradicional pero respetuosa. Lviv y los Cárpatos son las regiones más recomendadas para mujeres que viajan solas.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'El ucraniano es el idioma oficial. El ruso es comprendido por la mayoría pero su uso es políticamente sensible desde 2022. Usa preferiblemente ucraniano o inglés. El inglés lo hablan los jóvenes en Kiev y Lviv.' },
      { type: 'phrase', items: [
        { local: 'Dobriy den', meaning: 'Hola' },
        { local: 'Dyakuyu', meaning: 'Gracias' },
        { local: 'Bezkoshtovno', meaning: 'Gratis' },
        { local: 'Do... (+ ciudad)', meaning: 'Hasta...' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Muy barato. Presupuesto ajustado: 10-15 €/día. Comida en una cantina: 2-4 €. Hostel en Kiev: 5-10 €/noche. Tren nocturno Kiev-Lviv: ~8 €.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'La acampada libre está tolerada en los bosques y los Cárpatos. Los ucranianos a menudo invitan a los viajeros a su casa. Couchsurfing activo en Kiev y Lviv.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚂', name: 'Ukrzaliznytsia (tren)', detail: 'Red extensa, trenes nocturnos cómodos y baratos', price: '3-15 €' },
        { emoji: '🚐', name: 'Marshrutka', detail: 'Minibuses frecuentes entre ciudades', price: '1-5 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Ene', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mar', level: 'ok' },
        { name: 'Abr', level: 'good' }, { name: 'May', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'good' }, { name: 'Ago', level: 'good' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'ok' }, { name: 'Dic', level: 'bad' },
      ]},
      { type: 'text', text: 'Mayo-junio y septiembre: ideal (20-28°C). El verano es caluroso en el sur. El invierno es duro (-10 a -20°C) y desaconsejado. Los Cárpatos son magníficos en otoño.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'La hospitalidad ucraniana es sincera y generosa. El borshch, el salo (tocino) y la horilka (vodka con pimienta) son imprescindibles. Los conductores a menudo ofrecen frutas, pan y bebidas. La cultura del compartir está profundamente arraigada.' },
    ]},
  },
  // ==================== KOSOVO ====================
  XK: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'El autostop es legal en Kosovo. No hay restricciones conocidas. La práctica es habitual porque la red de autobuses es limitada.' },
      { type: 'warn', text: '⚠️ Kosovo no está reconocido por todos los países. Verifica si tu país lo reconoce antes de viajar. La entrada desde Serbia puede causar problemas (considerada entrada ilegal por Serbia).' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Kosovo es muy fácil para el autostop. El país es pequeño (150 km de este a oeste) y se cruza en pocas horas. Los conductores son extremadamente acogedores, sobre todo con los extranjeros. Tiempo de espera: 5-15 min.' },
      { type: 'text', text: 'Los kosovares tienen un profundo sentimiento de gratitud hacia los extranjeros. Muchos ofrecen comidas, café e insisten en ayudarte. La autopista Pristina-Prizren tiene buen tráfico.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Kosovo es un país seguro para el autostop. Los habitantes son muy hospitalarios con los extranjeros y curiosos por conocer a viajeros.' },
      { type: 'sub', title: 'Usa SpotHitch para tu seguridad' },
      { type: 'rule', icon: '🛡️', text: 'Activa el Modo Guardián antes de cada viaje. Una persona de confianza sigue tu posición en tiempo real.' },
      { type: 'rule', icon: '🆘', text: 'Configura el modo SOS con tus contactos. Un toque activa una triple alerta (push, SMS, llamada).' },
      { type: 'rule', icon: '📱', text: 'Fotografía la matrícula y envíala a alguien antes de subir.' },
      { type: 'rule', icon: '🎒', text: 'Mantén tu mochila accesible (en tu regazo o a tus pies), nunca en el maletero.' },
      { type: 'sub', title: 'Consejos del país' },
      { type: 'rule', icon: '🤝', text: 'Los kosovares son de los pueblos más acogedores de los Balcanes. Les encanta charlar con los extranjeros.' },
      { type: 'rule', icon: '☕', text: 'A menudo te ofrecerán un café turco o una comida. Aceptar es un signo de respeto.' },
      { type: 'sub', title: 'Números de emergencia' },
      { type: 'kv', items: [{ k: 'Emergencias', v: '112' }, { k: 'Policía', v: '192' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Considerado seguro para mujeres que viajan solas. La sociedad es tradicional pero muy respetuosa con los extranjeros. Varias viajeras reportan experiencias positivas.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'El albanés es el idioma principal. El serbio se habla en los enclaves serbios del norte. El inglés está muy extendido entre los jóvenes (influencia internacional desde 1999). El alemán es comprendido por muchos (gran diáspora en Alemania/Suiza).' },
      { type: 'phrase', items: [
        { local: 'Faleminderit', meaning: 'Gracias' },
        { local: 'Ku po shkon?', meaning: '¿A dónde vas?' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Muy barato. Presupuesto ajustado: 10-15 €/día. Comida completa: 3-5 €. Café: 0,50-1 €. Hostel: 8-12 €/noche. Kosovo usa el euro.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'La acampada libre es posible en las zonas rurales. Las familias kosovares invitan muy fácilmente a los viajeros a su casa. Es una cuestión de honor.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Bus', detail: 'Red limitada pero cubre las ciudades principales', price: '2-5 €' },
        { emoji: '🚐', name: 'Furgon', detail: 'Minibuses informales, frecuentes y baratos', price: '1-3 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Ene', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mar', level: 'ok' },
        { name: 'Abr', level: 'good' }, { name: 'May', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'good' }, { name: 'Ago', level: 'good' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'ok' }, { name: 'Dic', level: 'bad' },
      ]},
      { type: 'text', text: 'Mayo-junio y septiembre: ideal. El verano es caluroso (35°C+). El invierno es frío con nieve.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Kosovo es un país joven (independiente desde 2008) con una población muy joven (edad mediana: 29 años). La hospitalidad es excepcional. El macchiato y el café turco son instituciones. El país vibra con energía y optimismo.' },
    ]},
  },
  // ==================== MOROCCO ====================
  MA: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'El autostop es legal y muy extendido en Marruecos. Sin restricciones. Es un modo de transporte habitual también para los locales. La práctica está arraigada en la cultura de hospitalidad marroquí.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Marruecos es uno de los mejores países del mundo para el autostop. Tiempo de espera medio: 5-15 min. Los conductores paran muy fácilmente, a veces sin que se lo pidas. Los camiones llevan autostopistas regularmente en largas distancias.' },
      { type: 'sub', title: 'Puntos clave' },
      { type: 'rule', icon: '🚛', text: 'Los camioneros son los mejores aliados. Recorren largas distancias y están acostumbrados a llevar gente.' },
      { type: 'rule', icon: '⛽', text: 'Las gasolineras a la salida de las ciudades son los mejores spots.' },
      { type: 'rule', icon: '🤝', text: 'Algunos conductores esperan un pequeño pago (transporte informal). Aclara "autostop, bla flous" (sin dinero) o propón compartir la gasolina.' },
      { type: 'text', text: 'En el sur y el Atlas, el tráfico es bajo pero la gente para casi sistemáticamente. Los grandes taxis colectivos son el transporte principal entre ciudades.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Marruecos es un país seguro para el autostop. Las carreteras nacionales están en buen estado y los marroquíes son acogedores con los viajeros. En verano, prevé mucha agua.' },
      { type: 'sub', title: 'Usa SpotHitch para tu seguridad' },
      { type: 'rule', icon: '🛡️', text: 'Activa el Modo Guardián antes de cada viaje. Una persona de confianza sigue tu posición en tiempo real.' },
      { type: 'rule', icon: '🆘', text: 'Configura el modo SOS con tus contactos. Un toque activa una triple alerta (push, SMS, llamada).' },
      { type: 'rule', icon: '📱', text: 'Fotografía la matrícula y envíala a alguien antes de subir.' },
      { type: 'rule', icon: '🎒', text: 'Mantén tu mochila accesible (en tu regazo o a tus pies), nunca en el maletero.' },
      { type: 'sub', title: 'Consejos del país' },
      { type: 'rule', icon: '🛣️', text: 'Las carreteras nacionales están en buen estado. Colócate en las salidas de ciudad o en las gasolineras.' },
      { type: 'rule', icon: '💧', text: 'En verano, las temperaturas superan los 40°C. Lleva siempre agua y protégete del sol.' },
      { type: 'sub', title: 'Números de emergencia' },
      { type: 'kv', items: [{ k: 'Policía', v: '19' }] },
    ]},
    women: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'Marruecos es más delicado para las mujeres que viajan solas. El acoso callejero (comentarios, miradas insistentes) es frecuente en las ciudades. En autostop, las experiencias son mixtas: muchos trayectos positivos pero algunas situaciones incómodas reportadas.' },
      { type: 'rule', icon: '👫', text: 'Viajar en pareja es muy recomendable.' },
      { type: 'rule', icon: '👕', text: 'Viste de forma conservadora (hombros y rodillas cubiertos).' },
      { type: 'rule', icon: '💍', text: '"Mi marido me espera en..." es una frase eficaz para cortar.' },
      { type: 'text', text: 'Las zonas turísticas (Marrakech, Fez) son más intensas. Las zonas rurales y el Atlas suelen ser más respetuosos y acogedores.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'El árabe marroquí (darija) y el bereber son los idiomas locales. El francés está muy extendido (lengua de educación y negocios). El inglés progresa entre los jóvenes. El español se entiende en el norte (Tánger, Tetuán, Nador).' },
      { type: 'phrase', items: [
        { local: 'Salam / Salam aleikoum', meaning: 'Hola / La paz sea contigo' },
        { local: 'Choukran', meaning: 'Gracias' },
        { local: 'Bla flous', meaning: 'Sin dinero (gratis)' },
        { local: 'Wach kayn chi triq l...?', meaning: '¿Hay un camino hacia...?' },
        { local: 'Bslama', meaning: 'Adiós' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Muy barato. Presupuesto ajustado: 10-20 €/día. El té de menta suele ser invitado.' },
      { type: 'kv', items: [
        { k: 'Comida en un puesto local', v: '2-4 €' },
        { k: 'Tajín en restaurante', v: '4-8 €' },
        { k: 'Hostel / riad básico', v: '5-15 €/noche' },
        { k: 'Gran taxi colectivo (50 km)', v: '1-3 €' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'La acampada libre está tolerada en las montañas del Atlas y el desierto. Evita las playas cerca de las ciudades. Los marroquíes a menudo invitan a los viajeros a su casa para el té, la comida, y a veces a dormir. En los pueblos bereberes del Atlas, la hospitalidad es casi sistemática.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚕', name: 'Gran taxi', detail: 'Taxis colectivos entre ciudades. 6 pasajeros, esperan estar llenos.', price: '1-5 €' },
        { emoji: '🚌', name: 'CTM / Supratours', detail: 'Buses de larga distancia cómodos y fiables', price: '5-20 €' },
        { emoji: '🚂', name: 'ONCF (tren)', detail: 'Red limitada pero fiable (Tánger-Marrakech)', price: '5-25 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Ene', level: 'ok' }, { name: 'Feb', level: 'good' }, { name: 'Mar', level: 'great' },
        { name: 'Abr', level: 'great' }, { name: 'May', level: 'great' }, { name: 'Jun', level: 'good' },
        { name: 'Jul', level: 'ok' }, { name: 'Ago', level: 'ok' }, { name: 'Sep', level: 'good' },
        { name: 'Oct', level: 'great' }, { name: 'Nov', level: 'great' }, { name: 'Dic', level: 'ok' },
      ]},
      { type: 'text', text: 'Marzo-mayo y septiembre-noviembre: ideal. El verano es abrasador en el sur y el interior (40-45°C). El invierno es suave en la costa pero frío en el Atlas (nieve). Ramadán: el ritmo cambia pero la hospitalidad permanece.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'La hospitalidad marroquí es legendaria. El té de menta es un ritual sagrado: rechazarlo es de mala educación. Los conductores a menudo ofrecen el té, la comida, y hacen desvíos para ayudarte. La cultura bereber en el Atlas es particularmente acogedora.' },
      { type: 'event', items: [
        { month: 'Jun', day: '⟳', name: 'Festival Gnaoua (Esauira)', desc: 'Música gnaoua y world music. Ambiente increíble.' },
        { month: 'Nov', day: '⟳', name: 'Festival de los Dátiles (Erfoud)', desc: 'Celebración de la cosecha de dátiles en el sureste.' },
      ]},
    ]},
  },
  // ==================== UNITED STATES ====================
  US: {
    laws: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'La legalidad varía según los estados. En general: el autostop está prohibido en las Interstates (autopistas federales) en todas partes, pero tolerado o legal en las rampas de acceso y carreteras secundarias en muchos estados.' },
      { type: 'sub', title: 'Estados donde es legal' },
      { type: 'text', text: 'Oregón, Nevada, Colorado, Wyoming, Montana, Idaho y otros estados del oeste toleran o autorizan explícitamente el autostop en las rampas. Verifica la ley de cada estado antes.' },
      { type: 'sub', title: 'Estados donde está prohibido' },
      { type: 'text', text: 'Nueva York, Nueva Jersey, Pensilvania, Delaware, Connecticut y otros prohíben el autostop incluso en las rampas. En Florida, la ley cambia según los condados.' },
      { type: 'sub', title: 'Multas' },
      { type: 'text', text: 'Rara vez se multa. La policía generalmente te pedirá que te muevas. En el peor de los casos: multa de 25-100 $ o una advertencia.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'EEUU es el país donde el autostop más ha decaído desde los años 70. Las distancias son inmensas, la tasa de motorización es del 95%, y la cultura del miedo (stranger danger) hace que los conductores desconfíen. Tiempo de espera medio: 1-3h, a veces mucho más.' },
      { type: 'sub', title: 'Dónde funciona' },
      { type: 'kv', items: [
        { k: 'Oeste rural (Montana, Wyoming, Idaho)', v: 'Lo mejor', color: 'green' },
        { k: 'Pacific Northwest (Oregón, Washington)', v: 'Bueno, cultura alternativa', color: 'green' },
        { k: 'Hawái', v: 'Fácil y habitual', color: 'green' },
        { k: 'Sur rural (Texas rural, Luisiana)', v: 'Variable pero amistoso', color: 'amber' },
        { k: 'Costa Este / grandes ciudades', v: 'Muy difícil', color: 'red' },
      ]},
      { type: 'sub', title: 'Estrategia' },
      { type: 'text', text: 'En EEUU, abordar a los conductores en las gasolineras (gas stations) o los truck stops es más eficaz que el pulgar al borde de la carretera. Los truck stops (TA, Pilot, Flying J, Love\'s) son los mejores spots para largas distancias.' },
      { type: 'tip', text: '💡 Los grupos de Facebook "Ride Share" por estado son una alternativa complementaria al autostop.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Estados Unidos es seguro para el autostop en la mayoría de las regiones. Las gas stations son excelentes spots. Prevé agua y provisiones, las distancias son inmensas.' },
      { type: 'sub', title: 'Usa SpotHitch para tu seguridad' },
      { type: 'rule', icon: '🛡️', text: 'Activa el Modo Guardián antes de cada viaje. Una persona de confianza sigue tu posición en tiempo real.' },
      { type: 'rule', icon: '🆘', text: 'Configura el modo SOS con tus contactos. Un toque activa una triple alerta (push, SMS, llamada).' },
      { type: 'rule', icon: '📱', text: 'Fotografía la matrícula y envíala a alguien antes de subir.' },
      { type: 'rule', icon: '🎒', text: 'Mantén tu mochila accesible (en tu regazo o a tus pies), nunca en el maletero.' },
      { type: 'sub', title: 'Consejos del país' },
      { type: 'rule', icon: '⛽', text: 'Las gas stations (gasolineras) son los mejores spots para abordar a los conductores antes de que se marchen.' },
      { type: 'rule', icon: '🗺️', text: 'Las distancias son inmensas (a veces 200+ km entre ciudades). Prevé agua, comida y un cargador solar.' },
      { type: 'sub', title: 'Números de emergencia' },
      { type: 'kv', items: [{ k: 'Emergencias', v: '911' }] },
    ]},
    women: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'EEUU es el país donde las mujeres reportan más desconfianza (de ambos lados). Hacer autostop sola como mujer está desaconsejado por la mayoría de fuentes, sobre todo en zonas aisladas. Las parejas mixtas o grupos de dos son mucho mejor percibidos.' },
      { type: 'rule', icon: '👫', text: 'Viajar en pareja es casi indispensable.' },
      { type: 'rule', icon: '📱', text: 'Comparte tu posición en tiempo real (SpotHitch, Google Maps, WhatsApp).' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'El inglés es indispensable. El español es muy útil en el suroeste (Texas, Arizona, Nuevo México, California). Sin barrera lingüística para hispanohablantes en el suroeste.' },
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'EEUU es caro. Presupuesto ajustado: 30-50 $/día mínimo. Los truck stops ofrecen comidas abundantes a precios razonables.' },
      { type: 'kv', items: [
        { k: 'Hostel', v: '25-50 $/noche' },
        { k: 'Walmart (camping en parking)', v: 'Gratis (tolerado)' },
        { k: 'Fast food', v: '8-15 $' },
        { k: 'Diner / truck stop', v: '10-20 $' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'La acampada libre es legal en las tierras federales (BLM land, National Forests) que cubren millones de hectáreas en el oeste. Gratis y sin permiso en la mayoría de los casos. Walmart a menudo permite acampar en sus parkings. Los parkings de truck stops son utilizables por la noche.' },
      { type: 'tip', text: '💡 Existen numerosas apps y sitios para encontrar spots de acampada gratis en las tierras federales.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Greyhound', detail: 'Bus de larga distancia, red extensa', price: '30-100 $' },
        { emoji: '🚌', name: 'FlixBus', detail: 'Alternativa más barata, red en expansión', price: '10-50 $' },
        { emoji: '🚂', name: 'Amtrak', detail: 'Tren, lento pero panorámico. El California Zephyr es magnífico.', price: '30-200 $' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Ene', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mar', level: 'ok' },
        { name: 'Abr', level: 'good' }, { name: 'May', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'good' }, { name: 'Ago', level: 'good' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'ok' }, { name: 'Dic', level: 'bad' },
      ]},
      { type: 'text', text: 'Mayo-junio y septiembre: ideal en el oeste. El verano es abrasador en el suroeste (45°C+ en Arizona). El invierno cierra los puertos de montaña. El noreste es practicable de abril a octubre.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'El autostop tiene un lugar mítico en la cultura americana (Jack Kerouac, Ruta 66, los beatniks). Hoy la práctica es marginal pero quienes recogen autostopistas suelen ser gente extraordinaria: antiguos mochileros, camioneros solitarios, aventureros. Las conversaciones suelen ser memorables.' },
      { type: 'event', items: [
        { month: 'Ago', day: '⟳', name: 'Burning Man (Nevada)', desc: 'Festival en el desierto. Muchos autostopistas en las carreteras de Nevada.' },
      ]},
    ]},
  },
  // ==================== CANADA ====================
  CA: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'El autostop es legal en la mayoría de las provincias. Prohibido en autopistas (highways) en algunas provincias (Ontario, Columbia Británica) pero permitido en las rampas de acceso. En Alberta y las provincias de las Praderas, el autostop se tolera generalmente.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Canadá es más fácil que EEUU para el autostop. La cultura canadiense es más abierta y las distancias entre comunidades crean una solidaridad natural. Tiempo de espera medio: 30 min-1h30. El oeste (Columbia Británica, Alberta) es lo más fácil.' },
      { type: 'sub', title: 'Mejores zonas' },
      { type: 'kv', items: [
        { k: 'Columbia Británica (fuera de Vancouver)', v: 'Muy bueno, cultura del autostop viva', color: 'green' },
        { k: 'Alberta (Highway 1, Highway 93)', v: 'Buen tráfico, Rocosas', color: 'green' },
        { k: 'Provincias marítimas', v: 'Fácil y amistoso', color: 'green' },
        { k: 'Ontario rural', v: 'Correcto', color: 'amber' },
        { k: 'Toronto, Montreal (salida de ciudad)', v: 'Difícil', color: 'red' },
      ]},
      { type: 'text', text: 'Las gasolineras (Esso, Petro-Canada, Shell) y los Tim Hortons al borde de la carretera son los mejores spots para abordar conductores.' },
      { type: 'warn', text: '⚠️ En la Highway 16 (norte de C.B.), las distancias son muy largas y la cobertura de red es limitada. Planifica tu ruta y avisa a alguien.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Canadá es un país muy seguro para el autostop. Las distancias son inmensas, así que prevé siempre agua y comida.' },
      { type: 'sub', title: 'Usa SpotHitch para tu seguridad' },
      { type: 'rule', icon: '🛡️', text: 'Activa el Modo Guardián antes de cada viaje. Una persona de confianza sigue tu posición en tiempo real.' },
      { type: 'rule', icon: '🆘', text: 'Configura el modo SOS con tus contactos. Un toque activa una triple alerta (push, SMS, llamada).' },
      { type: 'rule', icon: '📱', text: 'Fotografía la matrícula y envíala a alguien antes de subir.' },
      { type: 'rule', icon: '🎒', text: 'Mantén tu mochila accesible (en tu regazo o a tus pies), nunca en el maletero.' },
      { type: 'sub', title: 'Consejos del país' },
      { type: 'rule', icon: '🗺️', text: 'Las distancias son inmensas (a veces 200+ km sin cobertura). Lleva siempre agua, comida y un cargador.' },
      { type: 'rule', icon: '🍁', text: 'Los canadienses son famosos por su amabilidad. Un cartel claro y una sonrisa bastan para conseguir un viaje.' },
      { type: 'sub', title: 'Números de emergencia' },
      { type: 'kv', items: [{ k: 'Emergencias', v: '911' }] },
    ]},
    women: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'Canadá es más seguro que EEUU para las mujeres. Las viajeras solas reportan experiencias mayoritariamente positivas. En zonas aisladas, planifica tu itinerario y avisa a alguien.' },
      { type: 'rule', icon: '📱', text: 'Avisa a alguien de tu itinerario. Algunas zonas no tienen cobertura.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Inglés en todas partes excepto Quebec. En Quebec, el francés es el idioma principal. Los quebequenses aprecian que hables francés. En las provincias atlánticas (Nuevo Brunswick), ambos idiomas coexisten.' },
      { type: 'phrase', items: [
        { local: 'Je fais du pouce', meaning: 'La expresión quebequense para el autostop' },
        { local: 'Merci, bonne route !', meaning: 'Al bajar (en Quebec)' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Canadá es caro. Presupuesto ajustado: 30-50 CAD/día (~20-35 €). Los supermercados (Walmart, No Frills) son más baratos que los restaurantes. Tim Hortons es barato para comidas rápidas.' },
      { type: 'kv', items: [
        { k: 'Hostel', v: '25-50 CAD/noche' },
        { k: 'Tim Hortons comida', v: '5-10 CAD' },
        { k: 'Camping provincial', v: '15-35 CAD/noche' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'La acampada libre está permitida en las Crown Lands (tierras de la Corona) que cubren el 89% del territorio. Gratis sin permiso en la mayoría de las provincias. Las rest areas a lo largo de las highways a menudo permiten dormir unas horas.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Rider Express / FlixBus', detail: 'Bus de larga distancia, red limitada en el oeste', price: '30-100 CAD' },
        { emoji: '🚂', name: 'VIA Rail', detail: 'Tren transcontinental, lento pero panorámico', price: '50-300 CAD' },
      ]},
      { type: 'tip', text: '💡 Los grupos de Facebook y las plataformas de anuncios locales son útiles para compartir coche en Canadá.' },
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Ene', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mar', level: 'bad' },
        { name: 'Abr', level: 'ok' }, { name: 'May', level: 'good' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Ago', level: 'great' }, { name: 'Sep', level: 'good' },
        { name: 'Oct', level: 'ok' }, { name: 'Nov', level: 'bad' }, { name: 'Dic', level: 'bad' },
      ]},
      { type: 'text', text: 'Junio a agosto: ideal. Canadá tiene inviernos extremos (-30 a -40°C en las Praderas). El autostop en invierno es peligroso (hipotermia). Septiembre es magnífico para los colores de otoño en el este.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Los canadienses son conocidos por su cortesía y hospitalidad. "Sorry" es la palabra más frecuente. Los conductores a menudo ofrecen café, comida y alojamiento. La cultura outdoor (camping, senderismo) hace a la gente abierta con los viajeros.' },
    ]},
  },
  // ==================== NEW ZEALAND ====================
  NZ: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'El autostop es perfectamente legal en Nueva Zelanda. Sin restricciones. Es un modo de transporte reconocido y culturalmente aceptado. Incluso el sitio oficial de turismo lo menciona.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Nueva Zelanda es uno de los mejores países del mundo para el autostop. Tiempo de espera medio: 10-30 min. Los kiwis paran fácilmente y son muy acogedores. El autostop se ve como un modo de transporte normal.' },
      { type: 'sub', title: 'Isla Norte vs Isla Sur' },
      { type: 'kv', items: [
        { k: 'Isla Sur', v: 'Más fácil, menos tráfico pero todo el mundo para', color: 'green' },
        { k: 'Isla Norte', v: 'También bueno, más tráfico alrededor de Auckland/Wellington', color: 'green' },
      ]},
      { type: 'text', text: 'La State Highway 1 es la carretera principal de las dos islas. El ferry entre las islas (Interislander) es la única opción entre Wellington y Picton.' },
      { type: 'tip', text: '💡 Un cartel con tu destino es casi indispensable. Los kiwis quieren saber exactamente a dónde vas.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Nueva Zelanda es un país muy seguro para el autostop. Es una tradición bien arraigada.' },
      { type: 'sub', title: 'Usa SpotHitch para tu seguridad' },
      { type: 'rule', icon: '🛡️', text: 'Activa el Modo Guardián antes de cada viaje. Una persona de confianza sigue tu posición en tiempo real.' },
      { type: 'rule', icon: '🆘', text: 'Configura el modo SOS con tus contactos. Un toque activa una triple alerta (push, SMS, llamada).' },
      { type: 'rule', icon: '📱', text: 'Fotografía la matrícula y envíala a alguien antes de subir.' },
      { type: 'rule', icon: '🎒', text: 'Mantén tu mochila accesible (en tu regazo o a tus pies), nunca en el maletero.' },
      { type: 'sub', title: 'Consejos del país' },
      { type: 'rule', icon: '👍', text: 'Los kiwis paran fácilmente. El autostop es una forma de vida aceptada en Nueva Zelanda.' },
      { type: 'rule', icon: '🏔️', text: 'Los paisajes son magníficos. Disfruta de cada trayecto para descubrir la naturaleza neozelandesa.' },
      { type: 'sub', title: 'Números de emergencia' },
      { type: 'kv', items: [{ k: 'Emergencias', v: '111' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Nueva Zelanda está considerada como uno de los países más seguros del mundo para mujeres que viajan solas. Numerosas viajeras hacen autostop sin problemas. El país fue el primero en conceder el derecho al voto a las mujeres (1893).' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'El inglés es el idioma principal. El māori es la segunda lengua oficial (algunas palabras se usan a diario: kia ora = hola). Sin barrera lingüística.' },
      { type: 'phrase', items: [
        { local: 'Kia ora', meaning: 'Hola (māori, usado por todos)' },
        { local: 'Sweet as', meaning: 'Genial, sin problema (expresión kiwi)' },
        { local: 'Chur / Cheers', meaning: 'Gracias' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'NZ es cara. Presupuesto ajustado: 30-50 NZD/día (~17-28 €). La comida en supermercado es asequible (Countdown, Pak\'nSave). Los alojamientos gratuitos (DOC campsites, Freedom camping) ayudan a reducir costes.' },
      { type: 'kv', items: [
        { k: 'Hostel (YHA, BBH)', v: '25-40 NZD/noche' },
        { k: 'DOC campsite (básico)', v: '0-8 NZD/noche' },
        { k: 'Fish & chips', v: '8-15 NZD' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'El "freedom camping" (acampada libre en furgoneta o tienda) está regulado pero es posible. Los DOC campsites (Department of Conservation) ofrecen emplazamientos gratuitos o muy baratos en lugares magníficos. La acampada libre en tienda se tolera si eres discreto y te llevas tu basura.' },
      { type: 'tip', text: '💡 Varias apps locales referencian los spots de acampada gratis en Nueva Zelanda.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'InterCity', detail: 'Principal red de buses. El FlexiPass ofrece descuentos.', price: '15-80 NZD' },
        { emoji: '⛴️', name: 'Interislander / Bluebridge', detail: 'Ferry Wellington-Picton (3h30)', price: '55-80 NZD' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Ene', level: 'great' }, { name: 'Feb', level: 'great' }, { name: 'Mar', level: 'great' },
        { name: 'Abr', level: 'good' }, { name: 'May', level: 'ok' }, { name: 'Jun', level: 'bad' },
        { name: 'Jul', level: 'bad' }, { name: 'Ago', level: 'bad' }, { name: 'Sep', level: 'ok' },
        { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'good' }, { name: 'Dic', level: 'great' },
      ]},
      { type: 'text', text: 'Hemisferio sur: el verano va de diciembre a febrero. Noviembre a marzo: ideal. El invierno (junio-agosto) es fresco en el sur pero practicable. El tiempo cambia rápido, lleva siempre una capa impermeable.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Los kiwis son relajados y acogedores. El "no worries" es un modo de vida. Los conductores hacen desvíos, ofrecen café y a veces una cama. La cultura outdoor (tramping = senderismo) crea un vínculo natural con los viajeros. El país es pequeño (4,8 millones de habitantes) y la gente se conoce.' },
    ]},
  },
  // ==================== AUSTRALIA ====================
  AU: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'La legalidad varía según los estados. Legal en la mayoría (Victoria, Nueva Gales del Sur, Australia Occidental). Prohibido en Queensland (multa posible pero rara vez aplicada). Siempre prohibido en autopistas (freeways/motorways).' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Australia fue un paraíso del autostop en los años 70-80 pero la práctica ha decaído mucho. Las distancias son inmensas (Perth-Sídney: 3.900 km). Tiempo de espera: 30 min-3h según la zona.' },
      { type: 'sub', title: 'Mejores zonas' },
      { type: 'kv', items: [
        { k: 'Costa Este (Sídney-Cairns)', v: 'Lo que más tráfico tiene', color: 'green' },
        { k: 'Tasmania', v: 'Pequeña, fácil, todo el mundo para', color: 'green' },
        { k: 'Outback / Centro', v: 'Poco tráfico, esperas largas pero gente acogedora', color: 'amber' },
        { k: 'Perth-Adelaida (Nullarbor Plain)', v: 'Arriesgado: 1.200 km de desierto', color: 'red' },
      ]},
      { type: 'text', text: 'Las roadhouses (gasolineras aisladas) y los truck stops son los mejores spots. Los road trains (camiones triples) a veces llevan pasajeros en largas distancias.' },
      { type: 'warn', text: '⚠️ Lleva SIEMPRE 5-10 litros de agua de reserva en el Outback. La deshidratación mata.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Australia es segura para el autostop, pero las distancias son un reto mayor que la seguridad personal.' },
      { type: 'sub', title: 'Usa SpotHitch para tu seguridad' },
      { type: 'rule', icon: '🛡️', text: 'Activa el Modo Guardián antes de cada viaje. Una persona de confianza sigue tu posición en tiempo real.' },
      { type: 'rule', icon: '🆘', text: 'Configura el modo SOS con tus contactos. Un toque activa una triple alerta (push, SMS, llamada).' },
      { type: 'rule', icon: '📱', text: 'Fotografía la matrícula y envíala a alguien antes de subir.' },
      { type: 'rule', icon: '🎒', text: 'Mantén tu mochila accesible (en tu regazo o a tus pies), nunca en el maletero.' },
      { type: 'sub', title: 'Consejos del país' },
      { type: 'rule', icon: '💧', text: 'Las distancias son inmensas (500+ km entre ciudades). Lleva siempre agua y protección solar.' },
      { type: 'rule', icon: '☀️', text: 'Nada de autostop de noche en el outback. La fauna (canguros, wombats) hace las carreteras peligrosas tras el ocaso.' },
      { type: 'sub', title: 'Números de emergencia' },
      { type: 'kv', items: [{ k: 'Emergencias', v: '000' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Las experiencias son mixtas. La costa este y Tasmania se consideran seguras. El Outback aislado está desaconsejado para mujeres solas. Se recomienda viajar en pareja.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'El inglés australiano tiene su propio vocabulario (arvo = afternoon, brekkie = breakfast, servo = gas station, ute = pickup). Los australianos son informales y usan mucho argot.' },
      { type: 'phrase', items: [
        { local: 'G\'day mate', meaning: 'Hola (informal)' },
        { local: 'No worries', meaning: 'Sin problema' },
        { local: 'Ta / Cheers', meaning: 'Gracias' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Australia es cara. Presupuesto ajustado: 40-60 AUD/día (~25-37 €). La comida en supermercado (Woolworths, Coles, Aldi) es asequible. Comer fuera es caro.' },
      { type: 'kv', items: [
        { k: 'Hostel', v: '25-45 AUD/noche' },
        { k: 'Comida en pub', v: '15-25 AUD' },
        { k: 'Free camping', v: 'Gratis (apps de camping)' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'La acampada libre (bush camping) es legal en tierras públicas y muchas zonas rurales. Varias apps locales referencian los spots gratuitos. Las rest areas a lo largo de las highways permiten dormir gratis. Cuidado con las serpientes y arañas.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Greyhound Australia', detail: 'Bus de larga distancia, red extensa', price: '30-200 AUD' },
        { emoji: '✈️', name: 'Vuelos low-cost', detail: 'Jetstar, Bonza. A menudo más barato que el bus para largas distancias.', price: '50-150 AUD' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Ene', level: 'ok' }, { name: 'Feb', level: 'ok' }, { name: 'Mar', level: 'good' },
        { name: 'Abr', level: 'great' }, { name: 'May', level: 'great' }, { name: 'Jun', level: 'good' },
        { name: 'Jul', level: 'good' }, { name: 'Ago', level: 'good' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'great' }, { name: 'Nov', level: 'good' }, { name: 'Dic', level: 'ok' },
      ]},
      { type: 'text', text: 'Hemisferio sur: el invierno (junio-agosto) es la mejor temporada en el norte tropical. El verano (diciembre-febrero) es ideal en el sur (Melbourne, Tasmania). Evita el Outback en verano (45°C+).' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'La cultura australiana es relajada y acogedora. El "mateship" (solidaridad entre mates) es un valor fundamental. Las BBQ en la carretera y las cervezas compartidas son instituciones. El humor es seco y la autoburla constante.' },
    ]},
  },
  // ==================== ISRAEL ====================
  IL: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'El autostop (trempiyada en hebreo) es legal y habitual en Israel. Es un modo de transporte establecido, sobre todo para los soldados. Los puntos de autostop (trempiyada) están señalizados con carteles oficiales en las intersecciones.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Israel es un excelente país para el autostop. El país es pequeño (470 km de norte a sur) y los israelíes son muy directos y acogedores. Tiempo de espera: 5-20 min. Los soldados en uniforme hacen autostop en masa (obligatorio, no tienen coche).' },
      { type: 'sub', title: 'Trempiyada' },
      { type: 'text', text: 'Los puntos de trempiyada son paradas oficiales de autostop, a menudo en cruces. Un dedo apuntando al suelo significa "voy en esta dirección". Es el gesto local, no el pulgar.' },
      { type: 'kv', items: [
        { k: 'Ruta 1 (Jerusalén-Tel Aviv)', v: 'Tráfico denso, fácil', color: 'green' },
        { k: 'Ruta 90 (valle del Jordán)', v: 'Buen tráfico, paisajes', color: 'green' },
        { k: 'Néguev (sur)', v: 'Poco tráfico, largas esperas', color: 'amber' },
      ]},
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'La seguridad depende de la región. Las zonas centrales (Tel Aviv, Haifa, Galilea) son seguras.' },
      { type: 'sub', title: 'Usa SpotHitch para tu seguridad' },
      { type: 'rule', icon: '🛡️', text: 'Activa el Modo Guardián antes de cada viaje. Una persona de confianza sigue tu posición en tiempo real.' },
      { type: 'rule', icon: '🆘', text: 'Configura el modo SOS con tus contactos. Un toque activa una triple alerta (push, SMS, llamada).' },
      { type: 'rule', icon: '📱', text: 'Fotografía la matrícula y envíala a alguien antes de subir.' },
      { type: 'rule', icon: '🎒', text: 'Mantén tu mochila accesible (en tu regazo o a tus pies), nunca en el maletero.' },
      { type: 'sub', title: 'Consejos del país' },
      { type: 'rule', icon: '🗺️', text: 'El autostop (tremping) es una tradición. Los trempiadot (paradas de autostop) son puntos oficiales.' },
      { type: 'rule', icon: '📋', text: 'La situación de seguridad puede cambiar rápidamente. Consulta las alertas en tiempo real.' },
      { type: 'sub', title: 'Números de emergencia' },
      { type: 'kv', items: [{ k: 'Emergencias / Policía', v: '100' }, { k: 'Ambulancia (Magen David Adom)', v: '101' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Israel se considera seguro para mujeres que viajan solas. Las israelíes hacen mucho autostop solas. La sociedad es progresista e igualitaria, sobre todo en Tel Aviv. Algunas precauciones en las zonas ultraortodoxas (vestimenta modesta).' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'El hebreo es el idioma principal. El árabe es la segunda lengua oficial. El inglés está muy extendido (casi todo el mundo habla inglés). El ruso es habitual entre los inmigrantes de la ex-URSS.' },
      { type: 'phrase', items: [
        { local: 'Shalom', meaning: 'Hola / Adiós / Paz' },
        { local: 'Toda (raba)', meaning: 'Gracias (muchas)' },
        { local: 'Tremp', meaning: 'Un aventón / un autostop' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Israel es caro. Presupuesto ajustado: 40-60 $/día. La comida callejera (falafel, shawarma) es asequible. Los supermercados son caros.' },
      { type: 'kv', items: [
        { k: 'Falafel / shawarma', v: '15-25 ILS (~4-7 €)' },
        { k: 'Hostel', v: '80-150 ILS/noche (~20-40 €)' },
        { k: 'Bus Egged', v: '10-50 ILS' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'La acampada libre está prohibida en la mayoría de parques nacionales pero tolerada en el Néguev y algunas playas. Los albergues juveniles (IYHA) están bien repartidos. El voluntariado en kibutz o en granjas orgánicas (WWOOF) ofrece alojamiento y comida a cambio de trabajo.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Egged / Dan', detail: 'Red de buses extensa y fiable', price: '10-50 ILS' },
        { emoji: '🚂', name: 'Israel Railways', detail: 'Tren rápido Tel Aviv-Jerusalén, red en expansión', price: '15-40 ILS' },
      ]},
      { type: 'warn', text: '⚠️ No hay transporte público en Shabbat (viernes por la noche al sábado por la noche) excepto en Haifa. El autostop es la única opción gratuita en Shabbat.' },
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Ene', level: 'ok' }, { name: 'Feb', level: 'good' }, { name: 'Mar', level: 'great' },
        { name: 'Abr', level: 'great' }, { name: 'May', level: 'good' }, { name: 'Jun', level: 'ok' },
        { name: 'Jul', level: 'bad' }, { name: 'Ago', level: 'bad' }, { name: 'Sep', level: 'ok' },
        { name: 'Oct', level: 'great' }, { name: 'Nov', level: 'great' }, { name: 'Dic', level: 'ok' },
      ]},
      { type: 'text', text: 'Marzo-mayo y octubre-noviembre: ideal. El verano es abrasador (35-45°C en el Néguev). El invierno es suave en la costa (15-20°C) pero lluvioso.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Los israelíes son directos (no es grosería, es cultural). Hacen preguntas personales sin filtro y ofrecen su ayuda espontáneamente. Las discusiones políticas son inevitables. El café y el hummus son obsesiones nacionales.' },
    ]},
  },
  // ==================== ARGENTINA ====================
  AR: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'El autostop (dedo en español argentino, "hacer dedo" = levantar el pulgar) es legal y habitual en Argentina. Sin restricciones. Es un modo de transporte normal en Patagonia y en las zonas rurales.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Argentina es un excelente país para el autostop, sobre todo en Patagonia y en el noroeste. Tiempo de espera: 15-45 min en zona turística, a veces 2-3h en Patagonia profunda (muy poco tráfico).' },
      { type: 'sub', title: 'Por región' },
      { type: 'kv', items: [
        { k: 'Patagonia (Ruta 40)', v: 'Mítica pero poco tráfico. Prever 2-3h de espera.', color: 'amber' },
        { k: 'Noroeste (Salta, Jujuy, Tucumán)', v: 'Fácil y acogedor', color: 'green' },
        { k: 'Región de los lagos (Bariloche)', v: 'Muy bueno, muchos mochileros', color: 'green' },
        { k: 'Buenos Aires (salida)', v: 'Difícil, toma un bus hasta la salida de la ciudad', color: 'red' },
      ]},
      { type: 'text', text: 'Las estaciones de servicio YPF son los mejores spots. En Patagonia, habla con los conductores en la estación. La Ruta 40 (5.000 km de largo) es el Grial del autostop argentino.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Argentina es segura para el autostop, especialmente en la Patagonia y las zonas rurales.' },
      { type: 'sub', title: 'Usa SpotHitch para tu seguridad' },
      { type: 'rule', icon: '🛡️', text: 'Activa el Modo Guardián antes de cada viaje. Una persona de confianza sigue tu posición en tiempo real.' },
      { type: 'rule', icon: '🆘', text: 'Configura el modo SOS con tus contactos. Un toque activa una triple alerta (push, SMS, llamada).' },
      { type: 'rule', icon: '📱', text: 'Fotografía la matrícula y envíala a alguien antes de subir.' },
      { type: 'rule', icon: '🎒', text: 'Mantén tu mochila accesible (en tu regazo o a tus pies), nunca en el maletero.' },
      { type: 'sub', title: 'Consejos del país' },
      { type: 'rule', icon: '⛽', text: 'Las estaciones YPF (cadena nacional) son los mejores spots para abordar a los conductores.' },
      { type: 'rule', icon: '🗺️', text: 'En Patagonia, las distancias son inmensas (a veces 300+ km entre dos ciudades). Prevé agua y comida.' },
      { type: 'sub', title: 'Números de emergencia' },
      { type: 'kv', items: [{ k: 'Emergencias', v: '911' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Las viajeras solas reportan experiencias mayoritariamente positivas en Argentina, sobre todo en Patagonia y el noroeste. Los argentinos son respetuosos pero galanes (piropos = cumplidos callejeros). Ignora y sigue. Se recomienda viajar en pareja en las zonas aisladas.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'El español argentino (castellano rioplatense) es la lengua única. El inglés es raro fuera de Buenos Aires. Algunas bases de español son indispensables. El "vos" reemplaza al "tú" y el "sh" reemplaza al "ll/y".' },
      { type: 'phrase', items: [
        { local: 'Hago dedo', meaning: 'Hago autostop' },
        { local: 'Me llevás hasta...?', meaning: '¿Me llevás hasta...?' },
        { local: 'Gracias, genial!', meaning: '¡Gracias, genial!' },
        { local: '¿Tenés lugar?', meaning: '¿Tenés lugar?' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Argentina fluctúa mucho (inflación). En 2025-2026, el país es barato para los extranjeros con el dólar blue. Presupuesto ajustado: 15-25 €/día. Comida completa: 3-6 €. Hostel: 5-15 €/noche.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'La acampada libre está tolerada en toda Patagonia y en las zonas rurales. Los campings municipales son gratuitos o muy baratos en muchas ciudades. En Patagonia, el viento es el principal enemigo (ráfagas de 100+ km/h).' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Bus de larga distancia', detail: 'Red excelente (cama = cama, semi-cama = reclinable). Muy cómodos.', price: '10-50 €' },
        { emoji: '✈️', name: 'Vuelos interiores', detail: 'Aerolíneas Argentinas, FlyBondi. Las distancias justifican el avión.', price: '30-100 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Ene', level: 'great' }, { name: 'Feb', level: 'great' }, { name: 'Mar', level: 'great' },
        { name: 'Abr', level: 'good' }, { name: 'May', level: 'ok' }, { name: 'Jun', level: 'bad' },
        { name: 'Jul', level: 'bad' }, { name: 'Ago', level: 'bad' }, { name: 'Sep', level: 'ok' },
        { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'great' }, { name: 'Dic', level: 'great' },
      ]},
      { type: 'text', text: 'Hemisferio sur: el verano (diciembre-febrero) es ideal para Patagonia. El noroeste se visita todo el año (seco en invierno). El invierno en Patagonia es duro (-10°C, viento, nieve).' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Los argentinos son cálidos, habladores y apasionados. El mate es un ritual social: aceptar un mate que te ofrecen es señal de amistad. Los asados son eventos comunitarios. La conversación puede durar horas.' },
      { type: 'event', items: [
        { month: 'Feb', day: '⟳', name: 'Carnaval (Gualeguaychú)', desc: 'El carnaval más grande de Argentina.' },
        { month: 'Ene', day: '⟳', name: 'Festival de Cosquín', desc: 'Festival de folklore argentino, música tradicional.' },
      ]},
    ]},
  },
  // ==================== CHILE ====================
  CL: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'El autostop es legal en Chile. Sin restricciones. La práctica es habitual en Patagonia y el sur. Los carabineros (policía) son generalmente benévolos con los autostopistas.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Chile es muy bueno para el autostop, sobre todo en el sur (Región de los Lagos, Carretera Austral). El país es largo (4.300 km) y estrecho. La Ruta 5 (Panamericana) es el eje principal.' },
      { type: 'sub', title: 'Por región' },
      { type: 'kv', items: [
        { k: 'Carretera Austral', v: 'Mítica. Todo el mundo para. Poco tráfico.', color: 'green' },
        { k: 'Región de los lagos (Temuco-Puerto Montt)', v: 'Fácil, buen tráfico', color: 'green' },
        { k: 'Norte (Atacama)', v: 'Poco tráfico, largas esperas', color: 'amber' },
        { k: 'Santiago (salida)', v: 'Difícil, bus hasta la salida', color: 'red' },
      ]},
      { type: 'text', text: 'Los peajes en la Ruta 5 son excelentes spots: los coches frenan y puedes hablar con los conductores. Las gasolineras Copec y Shell también funcionan bien.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Chile es un país seguro para el autostop. La Patagonia es un paraíso para los autostopistas.' },
      { type: 'sub', title: 'Usa SpotHitch para tu seguridad' },
      { type: 'rule', icon: '🛡️', text: 'Activa el Modo Guardián antes de cada viaje. Una persona de confianza sigue tu posición en tiempo real.' },
      { type: 'rule', icon: '🆘', text: 'Configura el modo SOS con tus contactos. Un toque activa una triple alerta (push, SMS, llamada).' },
      { type: 'rule', icon: '📱', text: 'Fotografía la matrícula y envíala a alguien antes de subir.' },
      { type: 'rule', icon: '🎒', text: 'Mantén tu mochila accesible (en tu regazo o a tus pies), nunca en el maletero.' },
      { type: 'sub', title: 'Consejos del país' },
      { type: 'rule', icon: '🏔️', text: 'En Patagonia, el autostop funciona muy bien. Los conductores paran fácilmente en estas regiones remotas.' },
      { type: 'rule', icon: '🗺️', text: 'En el norte (Atacama), las distancias son largas y el tráfico escaso. Prevé agua y protección solar.' },
      { type: 'sub', title: 'Números de emergencia' },
      { type: 'kv', items: [{ k: 'Emergencias', v: '131' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Chile se considera seguro para mujeres que viajan solas. Patagonia y el sur son particularmente recomendados. Varias viajeras solas reportan experiencias muy positivas.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'El español chileno es rápido y lleno de argot. El "po" al final de la frase es típico (sí po = sí, no po = no). El inglés es raro fuera de Santiago.' },
      { type: 'phrase', items: [
        { local: 'Ando a dedo', meaning: 'Hago autostop' },
        { local: '¿Me podís llevar?', meaning: '¿Me podís llevar?' },
        { local: 'Gracias, bacán!', meaning: '¡Gracias, genial!' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Chile es más caro que Argentina. Presupuesto ajustado: 15-30 €/día. Los supermercados (Lider, Jumbo) son asequibles. Patagonia es más cara.' },
      { type: 'kv', items: [
        { k: 'Hostel', v: '8-20 €/noche' },
        { k: 'Menú del día', v: '3-6 €' },
        { k: 'Empanada', v: '1-2 €' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'La acampada libre está tolerada en las zonas rurales y en Patagonia. Los campings CONAF (parques nacionales) son baratos. La Carretera Austral tiene numerosos spots de acampada libre magníficos.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Turbus / Pullman', detail: 'Buses de larga distancia cómodos, red extensa', price: '5-40 €' },
        { emoji: '⛴️', name: 'Navimag', detail: 'Ferry Puerto Montt-Puerto Natales (4 días, fiordos)', price: '150-400 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Ene', level: 'great' }, { name: 'Feb', level: 'great' }, { name: 'Mar', level: 'good' },
        { name: 'Abr', level: 'ok' }, { name: 'May', level: 'bad' }, { name: 'Jun', level: 'bad' },
        { name: 'Jul', level: 'bad' }, { name: 'Ago', level: 'bad' }, { name: 'Sep', level: 'ok' },
        { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'great' }, { name: 'Dic', level: 'great' },
      ]},
      { type: 'text', text: 'Noviembre a marzo: ideal para Patagonia y el sur. El norte (Atacama) se visita todo el año. El invierno cierra la Carretera Austral (nieve, carreteras cortadas).' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Los chilenos son reservados en el primer contacto pero muy cálidos una vez roto el hielo. La "once" (merienda hacia las 17h con té, pan, aguacate) es una comida importante. El pisco sour y el vino chileno son orgullos nacionales.' },
    ]},
  },
  // ==================== COLOMBIA ====================
  CO: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'El autostop es legal en Colombia. Sin restricciones. La práctica es habitual también entre los locales, sobre todo los estudiantes. Los peajes son los spots clásicos.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Colombia es un buen país para el autostop. Los colombianos son extremadamente acogedores. Tiempo de espera: 15-30 min en las carreteras principales. Los camiones (tractomulas) llevan pasajeros regularmente.' },
      { type: 'sub', title: 'Puntos clave' },
      { type: 'rule', icon: '🛣️', text: 'Los peajes son los mejores spots. Todas las carreteras principales los tienen.' },
      { type: 'rule', icon: '🚛', text: 'Los camioneros son los más fiables para las largas distancias. Muy acogedores.' },
      { type: 'rule', icon: '⛽', text: 'Las gasolineras a la salida de las ciudades funcionan bien.' },
      { type: 'kv', items: [
        { k: 'Eje cafetero (Pereira, Armenia, Manizales)', v: 'Fácil y acogedor', color: 'green' },
        { k: 'Costa caribe', v: 'Fácil, ambiente relajado', color: 'green' },
        { k: 'Bogotá (salida)', v: 'Difícil, toma un bus hasta la salida', color: 'red' },
      ]},
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Colombia es segura en las zonas turísticas y en las carreteras principales. Los peajes son los mejores spots.' },
      { type: 'sub', title: 'Usa SpotHitch para tu seguridad' },
      { type: 'rule', icon: '🛡️', text: 'Activa el Modo Guardián antes de cada viaje. Una persona de confianza sigue tu posición en tiempo real.' },
      { type: 'rule', icon: '🆘', text: 'Configura el modo SOS con tus contactos. Un toque activa una triple alerta (push, SMS, llamada).' },
      { type: 'rule', icon: '📱', text: 'Fotografía la matrícula y envíala a alguien antes de subir.' },
      { type: 'rule', icon: '🎒', text: 'Mantén tu mochila accesible (en tu regazo o a tus pies), nunca en el maletero.' },
      { type: 'sub', title: 'Consejos del país' },
      { type: 'rule', icon: '🛣️', text: 'Los peajes (casetas de cobro) son los mejores spots. Los coches reducen la velocidad y puedes hablar con los conductores.' },
      { type: 'rule', icon: '☀️', text: 'Viaja solo de día por las carreteras principales. Las zonas turísticas son seguras y acogedoras.' },
      { type: 'sub', title: 'Números de emergencia' },
      { type: 'kv', items: [{ k: 'Emergencias', v: '123' }] },
    ]},
    women: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'Las experiencias son mixtas. Los colombianos son respetuosos pero el machismo está presente. Las mujeres que viajan solas reportan experiencias positivas en las carreteras principales. Se recomienda viajar en pareja en las zonas rurales.' },
      { type: 'rule', icon: '👫', text: 'Se recomienda viajar con un(a) compañero(a).' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'El español colombiano está considerado como uno de los más claros y fáciles de entender. El inglés es raro fuera de las grandes ciudades turísticas. Bases de español son indispensables.' },
      { type: 'phrase', items: [
        { local: 'Hago dedo / Pido aventón', meaning: 'Hago autostop' },
        { local: '¿Me lleva?', meaning: '¿Me lleva?' },
        { local: '¡Gracias, parcero!', meaning: '¡Gracias, amigo!' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Colombia es barata. Presupuesto ajustado: 15-25 €/día. Los "corrientazos" (menú del día popular) son abundantes y baratos.' },
      { type: 'kv', items: [
        { k: 'Hostel', v: '5-15 €/noche' },
        { k: 'Corrientazo (menú del día)', v: '2-4 €' },
        { k: 'Bus de larga distancia', v: '10-30 €' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'La acampada libre es posible en las zonas rurales pero infórmate localmente. Los colombianos a veces invitan a los viajeros a su casa. Las hamacas son una alternativa popular en las zonas tropicales.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Bus de larga distancia', detail: 'Red extensa. Bolivariano y Expreso son las mejores compañías.', price: '5-30 €' },
        { emoji: '🚐', name: 'Colectivos / Chivas', detail: 'Transporte local colorido y barato', price: '0,50-3 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Ene', level: 'great' }, { name: 'Feb', level: 'great' }, { name: 'Mar', level: 'good' },
        { name: 'Abr', level: 'ok' }, { name: 'May', level: 'ok' }, { name: 'Jun', level: 'good' },
        { name: 'Jul', level: 'great' }, { name: 'Ago', level: 'great' }, { name: 'Sep', level: 'ok' },
        { name: 'Oct', level: 'ok' }, { name: 'Nov', level: 'ok' }, { name: 'Dic', level: 'great' },
      ]},
      { type: 'text', text: 'Diciembre-febrero y junio-agosto: temporadas secas. El clima varía según la altitud (Bogotá: 15°C, costa: 30°C). La costa caribe es calurosa todo el año.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Los colombianos están entre la gente más acogedora de Latinoamérica. El café es un orgullo nacional (zona cafetera = UNESCO). La música (vallenato, cumbia, reggaetón) es omnipresente. Los conductores ponen la música a tope y se convierte en una fiesta.' },
      { type: 'event', items: [
        { month: 'Feb', day: '⟳', name: 'Carnaval de Barranquilla', desc: 'El 2° carnaval más grande del mundo después de Río.' },
        { month: 'Ago', day: '⟳', name: 'Feria de las Flores (Medellín)', desc: 'Festival de las flores, desfile de silleteros.' },
      ]},
    ]},
  },
  // ==================== THAILAND ====================
  TH: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'El autostop es legal en Tailandia. Sin restricciones. El concepto es poco conocido por los tailandeses ya que el transporte público es barato y omnipresente. Es más "transporte informal" que autostop clásico.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Tailandia es un caso particular. El autostop al estilo occidental es raro, pero los tailandeses son naturalmente serviciales. Si estás al borde de la carretera con una mochila, alguien acabará parando y ofreciéndote ayuda. Es una forma de hospitalidad, no autostop tradicional.' },
      { type: 'sub', title: 'Cómo funciona' },
      { type: 'rule', icon: '🏍️', text: 'Las motos y pickups paran más fácilmente que los coches.' },
      { type: 'rule', icon: '🤝', text: 'Esperar en gasolineras o mercados es más eficaz que el pulgar al borde de la carretera.' },
      { type: 'rule', icon: '👋', text: 'No levantes el pulgar: extiende la mano con la palma hacia abajo y agítala hacia el suelo (como para llamar un taxi).' },
      { type: 'text', text: 'El norte (Chiang Mai, Chiang Rai, Mae Hong Son) y el noreste (Isan) son las zonas más fáciles. El sur turístico es más difícil porque los taxis y songthaews están por todas partes.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Tailandia es un país seguro para el autostop. Los tailandeses son acogedores y serviciales con los viajeros.' },
      { type: 'sub', title: 'Usa SpotHitch para tu seguridad' },
      { type: 'rule', icon: '🛡️', text: 'Activa el Modo Guardián antes de cada viaje. Una persona de confianza sigue tu posición en tiempo real.' },
      { type: 'rule', icon: '🆘', text: 'Configura el modo SOS con tus contactos. Un toque activa una triple alerta (push, SMS, llamada).' },
      { type: 'rule', icon: '📱', text: 'Fotografía la matrícula y envíala a alguien antes de subir.' },
      { type: 'rule', icon: '🎒', text: 'Mantén tu mochila accesible (en tu regazo o a tus pies), nunca en el maletero.' },
      { type: 'sub', title: 'Consejos del país' },
      { type: 'rule', icon: '📝', text: 'Un cartel con tu destino escrito en tailandés aumenta considerablemente tus posibilidades. Pide en tu albergue que te lo escriban.' },
      { type: 'rule', icon: '😊', text: 'Los tailandeses son muy acogedores. Un wai (saludo tradicional, manos juntas) siempre es apreciado.' },
      { type: 'sub', title: 'Números de emergencia' },
      { type: 'kv', items: [{ k: 'Policía turística', v: '1155' }, { k: 'Policía', v: '191' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Tailandia se considera segura para mujeres que viajan solas. El budismo influye en el respeto hacia las mujeres. Los incidentes son raros. Las zonas de fiesta (Full Moon Party) requieren más prudencia.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'El tailandés es el idioma oficial. El inglés es limitado fuera de las zonas turísticas. Google Translate con la cámara es una herramienta preciosa. El tailandés es tonal (5 tonos): la pronunciación es crucial.' },
      { type: 'phrase', items: [
        { local: 'Sawadee krap/ka', meaning: 'Hola (krap = hombre, ka = mujer)' },
        { local: 'Khop khun krap/ka', meaning: 'Gracias' },
        { local: 'Pai... dai mai?', meaning: '¿Ir a... posible?' },
        { local: 'Free, mai tong jai', meaning: 'Gratis, no hace falta pagar' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Tailandia es muy barata. Presupuesto ajustado: 10-20 €/día (incluso sin autostop). El pad thai callejero cuesta 1-2 €.' },
      { type: 'kv', items: [
        { k: 'Street food', v: '30-80 THB (1-2 €)' },
        { k: 'Hostel', v: '150-400 THB (4-11 €)' },
        { k: 'Bus de larga distancia', v: '200-800 THB (5-22 €)' },
        { k: '7-Eleven sándwich', v: '30-60 THB (1-2 €)' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'La acampada libre está tolerada en las zonas rurales. Los templos budistas a veces acogen viajeros (contribución voluntaria). Las guesthouses son tan baratas (4-8 €) que acampar no es realmente necesario.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Bus VIP / 1ª clase', detail: 'Cómodos, AC, red extensa', price: '5-20 €' },
        { emoji: '🚂', name: 'Tren (SRT)', detail: 'Lento pero panorámico. Tren nocturno Bangkok-Chiang Mai = clásico.', price: '5-30 €' },
        { emoji: '🛺', name: 'Songthaew', detail: 'Pickup compartido con bancos, transporte local', price: '0,30-1 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Ene', level: 'great' }, { name: 'Feb', level: 'great' }, { name: 'Mar', level: 'good' },
        { name: 'Abr', level: 'ok' }, { name: 'May', level: 'ok' }, { name: 'Jun', level: 'ok' },
        { name: 'Jul', level: 'ok' }, { name: 'Ago', level: 'bad' }, { name: 'Sep', level: 'bad' },
        { name: 'Oct', level: 'bad' }, { name: 'Nov', level: 'good' }, { name: 'Dic', level: 'great' },
      ]},
      { type: 'text', text: 'Noviembre a febrero: temporada fresca y seca, ideal. Marzo-mayo: muy caluroso (40°C+). Junio-octubre: monzón (lluvias torrenciales por la tarde, carreteras inundables en ciertas regiones).' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Tailandia es "el país de la sonrisa". Los tailandeses son no confrontativos y sonrientes. Nunca levantes la voz, no muestres los pies (es de mala educación), y quítate los zapatos al entrar en una casa. El rey es sagrado: NUNCA hagas comentarios negativos (delito de lesa majestad = prisión).' },
      { type: 'event', items: [
        { month: 'Abr', day: '13-15', name: 'Songkran (Año Nuevo tailandés)', desc: 'Batalla de agua gigante en todo el país. Transporte caótico pero festivo.' },
        { month: 'Nov', day: '⟳', name: 'Loy Krathong', desc: 'Linternas y ofrendas flotantes. Ambiente mágico.' },
      ]},
    ]},
  },
  // ==================== INDIA ====================
  IN: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'El autostop no está regulado en India. No hay un concepto formal de autostop pero el transporte informal (subirse a camiones, pickups, tractores) es un modo de vida. Los camioneros llevan pasajeros habitualmente.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'India es un caso único. El pulgar levantado no existe. Extiende la mano con la palma hacia abajo. Los camiones son el principal medio de transporte en autostop. Los conductores de camión (truckwallahs) forman una comunidad solidaria.' },
      { type: 'sub', title: 'Cómo funciona' },
      { type: 'rule', icon: '🚛', text: 'Los dhabas (restaurantes de carretera) son las paradas de los camioneros. Aborda a los conductores durante su comida.' },
      { type: 'rule', icon: '💰', text: 'Los camioneros a menudo aceptan un pago modesto. Negocia ANTES de subir. Aclara si es gratis o cuánto.' },
      { type: 'rule', icon: '🛣️', text: 'Las National Highways (NH) tienen el mayor tráfico de larga distancia.' },
      { type: 'kv', items: [
        { k: 'Ladakh / Manali-Leh Highway', v: 'Mítica. Camiones militares y civiles.', color: 'green' },
        { k: 'Rajastán', v: 'Bueno. Camiones y jeeps.', color: 'green' },
        { k: 'Himachal Pradesh', v: 'Fácil, locales acogedores', color: 'green' },
        { k: 'Grandes ciudades (Delhi, Bombay)', v: 'Imposible en la ciudad, fácil a la salida', color: 'red' },
      ]},
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'India es segura para el autostop en las rutas principales. El concepto de hacer dedo es natural aquí.' },
      { type: 'sub', title: 'Usa SpotHitch para tu seguridad' },
      { type: 'rule', icon: '🛡️', text: 'Activa el Modo Guardián antes de cada viaje. Una persona de confianza sigue tu posición en tiempo real.' },
      { type: 'rule', icon: '🆘', text: 'Configura el modo SOS con tus contactos. Un toque activa una triple alerta (push, SMS, llamada).' },
      { type: 'rule', icon: '📱', text: 'Fotografía la matrícula y envíala a alguien antes de subir.' },
      { type: 'rule', icon: '🎒', text: 'Mantén tu mochila accesible (en tu regazo o a tus pies), nunca en el maletero.' },
      { type: 'sub', title: 'Consejos del país' },
      { type: 'rule', icon: '🍛', text: 'Las gasolineras y los dhabas (restaurantes de carretera) son los mejores spots. Los camioneros hacen paradas allí.' },
      { type: 'rule', icon: '🚛', text: 'El concepto de autostop es natural en India. Levanta la mano, los camioneros y los conductores paran fácilmente.' },
      { type: 'sub', title: 'Números de emergencia' },
      { type: 'kv', items: [{ k: 'Emergencias', v: '112' }] },
    ]},
    women: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'Hacer autostop sola como mujer está desaconsejado en India. El acoso sexual es un problema documentado. Viajar en pareja (con un hombre) cambia radicalmente la experiencia. Las mujeres que han hecho autostop en India en pareja reportan experiencias positivas.' },
      { type: 'rule', icon: '👫', text: 'Viajar con un compañero masculino es muy recomendable.' },
      { type: 'rule', icon: '👕', text: 'Vestimenta conservadora indispensable (hombros y rodillas cubiertos, nada ajustado).' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'El hindi es el idioma más extendido pero India tiene 22 lenguas oficiales y cientos de dialectos. El inglés se entiende en las ciudades y por los jóvenes educados. Los camioneros a menudo solo hablan hindi.' },
      { type: 'phrase', items: [
        { local: 'Namaste', meaning: 'Hola (universal en India)' },
        { local: 'Dhanyavaad / Shukriya', meaning: 'Gracias (hindi)' },
        { local: '... tak jaana hai', meaning: 'Quiero ir a...' },
        { local: 'Free hai?', meaning: '¿Es gratis?' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'India es uno de los países más baratos del mundo. Presupuesto ajustado: 5-15 €/día. Los dhabas (cantinas de carretera) sirven comidas abundantes por 1-2 €.' },
      { type: 'kv', items: [
        { k: 'Dhaba (comida completa)', v: '50-150 INR (0,50-1,50 €)' },
        { k: 'Guesthouse', v: '300-800 INR (3-8 €)' },
        { k: 'Tren Sleeper Class', v: '100-500 INR (1-5 €)' },
        { k: 'Chai (té)', v: '10-20 INR (0,10-0,20 €)' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'La acampada libre es posible en el Himalaya y las zonas rurales. Los dhabas a veces permiten dormir en los charpoys (camas de cuerda) por unas rupias. Los templos sijs (gurdwara) ofrecen alojamiento y comida gratis a todos (langar).' },
      { type: 'tip', text: '💡 Los gurdwaras (templos sijs) acogen a TODO EL MUNDO gratis. Comida y alojamiento. Es un pilar del sijismo.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚂', name: 'Indian Railways', detail: 'La mayor red ferroviaria del mundo. Sleeper Class = económico. AC = confort.', price: '1-20 €' },
        { emoji: '🚌', name: 'Buses gubernamentales', detail: 'Red densa, baratos pero lentos', price: '1-10 €' },
        { emoji: '🛺', name: 'Auto-rickshaw', detail: 'Transporte local en las ciudades', price: '0,30-2 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Ene', level: 'good' }, { name: 'Feb', level: 'great' }, { name: 'Mar', level: 'great' },
        { name: 'Abr', level: 'ok' }, { name: 'May', level: 'bad' }, { name: 'Jun', level: 'bad' },
        { name: 'Jul', level: 'bad' }, { name: 'Ago', level: 'bad' }, { name: 'Sep', level: 'ok' },
        { name: 'Oct', level: 'great' }, { name: 'Nov', level: 'great' }, { name: 'Dic', level: 'good' },
      ]},
      { type: 'text', text: 'Octubre a marzo: ideal para la mayor parte de India. Abril-mayo: muy caluroso (45°C+). Junio-septiembre: monzón (carreteras inundadas, deslizamientos en montaña). Ladakh solo es accesible de junio a septiembre.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'India es un choque cultural garantizado. La hospitalidad está profundamente arraigada. Los conductores ofrecen el chai (té), las comidas y a veces alojamiento. El "head wobble" (movimiento de cabeza) significa sí/de acuerdo/quizás todo a la vez. Come solo con la mano derecha (la izquierda es impura).' },
      { type: 'event', items: [
        { month: 'Mar', day: '⟳', name: 'Holi', desc: 'Festival de los colores. Polvos de colores lanzados por todas partes. Transporte alterado pero ambiente increíble.' },
        { month: 'Oct-Nov', day: '⟳', name: 'Diwali', desc: 'Festival de las luces. Fuegos artificiales, guirnaldas, dulces. La gente es particularmente generosa.' },
      ]},
    ]},
  },
  // ==================== JAPAN ====================
  JP: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'El autostop es legal en Japón. Sin restricciones. Las áreas de servicio (SA) y las áreas de parking (PA) en las autopistas son los spots clásicos. Está prohibido pararse en las vías de la autopista misma.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Japón es sorprendentemente bueno para el autostop a pesar de la barrera cultural. Tiempo de espera: 15-45 min. Los japoneses que paran suelen ser curiosos y entusiastas. Muchos harán desvíos importantes o te invitarán a comer.' },
      { type: 'sub', title: 'El método japonés' },
      { type: 'rule', icon: '📝', text: 'Un cartel en katakana (escritura japonesa) con tu destino es casi obligatorio. Los japoneses rara vez leen el alfabeto latino.' },
      { type: 'rule', icon: '⛽', text: 'Las SA (Service Areas) en las autopistas son los mejores spots. Puedes acceder a pie o en autostop desde la entrada.' },
      { type: 'rule', icon: '😊', text: 'Sonreír, inclinarse y ser cortés es crucial. La apariencia importa: ve limpio y bien vestido.' },
      { type: 'kv', items: [
        { k: 'Hokkaidō', v: 'Lo mejor. Grande, rural, acogedor.', color: 'green' },
        { k: 'Zonas rurales (Shikoku, Kyūshū)', v: 'Muy bueno, gente curiosa', color: 'green' },
        { k: 'Tokio, Osaka (salida)', v: 'Difícil, usa el tren hasta una SA', color: 'red' },
      ]},
      { type: 'tip', text: '💡 Una bandera de tu país en la mochila es un excelente rompehielos en Japón.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Japón es extremadamente seguro para el autostop. Los japoneses son educados y serviciales.' },
      { type: 'sub', title: 'Usa SpotHitch para tu seguridad' },
      { type: 'rule', icon: '🛡️', text: 'Activa el Modo Guardián antes de cada viaje. Una persona de confianza sigue tu posición en tiempo real.' },
      { type: 'rule', icon: '🆘', text: 'Configura el modo SOS con tus contactos. Un toque activa una triple alerta (push, SMS, llamada).' },
      { type: 'rule', icon: '📱', text: 'Fotografía la matrícula y envíala a alguien antes de subir.' },
      { type: 'rule', icon: '🎒', text: 'Mantén tu mochila accesible (en tu regazo o a tus pies), nunca en el maletero.' },
      { type: 'sub', title: 'Consejos del país' },
      { type: 'rule', icon: '📝', text: 'Un cartel con tu destino en japonés (katakana o kanji) aumenta tus posibilidades. Pide en un konbini que te lo escriban.' },
      { type: 'rule', icon: '🏪', text: 'Las áreas de descanso de autopista (SA y PA) son los mejores spots. Están bien equipadas y los conductores hacen paradas largas.' },
      { type: 'sub', title: 'Números de emergencia' },
      { type: 'kv', items: [{ k: 'Policía', v: '110' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Japón es muy seguro para mujeres que viajan solas. Viajeras reportan experiencias extremadamente positivas. Los japoneses son respetuosos y la sociedad es muy segura. Las conductoras también paran.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'El japonés es el único idioma. El inglés es muy limitado incluso en las grandes ciudades. Un cartel en katakana es indispensable. Google Translate (modo cámara) es tu mejor amigo.' },
      { type: 'phrase', items: [
        { local: 'Konnichiwa', meaning: 'Hola' },
        { local: 'Arigatō gozaimasu', meaning: 'Muchas gracias' },
        { local: 'Hitchhike shimasu', meaning: 'Hago autostop (entendido por los japoneses)' },
        { local: '... made onegaishimasu', meaning: 'Hasta... por favor' },
      ]},
      { type: 'tip', text: '💡 Escribe tus destinos en katakana en cartones. Los japoneses adoran el esfuerzo y eso aumenta tus posibilidades.' },
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Japón es caro pero existen trucos. Presupuesto ajustado: 25-40 €/día con autostop y camping.' },
      { type: 'kv', items: [
        { k: 'Konbini (7-Eleven, Lawson) comida', v: '300-600 ¥ (2-4 €)' },
        { k: 'Manga café (noche)', v: '1.500-2.500 ¥ (10-17 €)' },
        { k: 'Hostel', v: '2.000-4.000 ¥ (13-27 €)' },
        { k: 'Onsen (baño termal)', v: '300-1.000 ¥ (2-7 €)' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'La acampada libre está técnicamente prohibida pero muy tolerada en Japón (cultura del vivac). Los michi-no-eki (estaciones de borde de carretera) y los parques permiten acampar discretamente. Los manga cafés (con ducha) son una alternativa cómoda para las noches en la ciudad.' },
      { type: 'tip', text: '💡 Los conductores japoneses a veces invitan a los autostopistas a un onsen (baño termal), a comer en restaurantes o incluso a su casa. Es una experiencia única.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚄', name: 'Shinkansen', detail: 'Tren de alta velocidad. El JR Pass ofrece acceso ilimitado.', price: 'JR Pass 7d: ~200 €' },
        { emoji: '🚌', name: 'Bus nocturno', detail: 'Willer Express, más barato que el Shinkansen', price: '2.000-6.000 ¥' },
        { emoji: '⛴️', name: 'Ferry', detail: 'Entre las islas, a menudo con cabina', price: '2.000-10.000 ¥' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Ene', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mar', level: 'good' },
        { name: 'Abr', level: 'great' }, { name: 'May', level: 'great' }, { name: 'Jun', level: 'ok' },
        { name: 'Jul', level: 'ok' }, { name: 'Ago', level: 'ok' }, { name: 'Sep', level: 'good' },
        { name: 'Oct', level: 'great' }, { name: 'Nov', level: 'great' }, { name: 'Dic', level: 'ok' },
      ]},
      { type: 'text', text: 'Abril-mayo (sakura, cerezos en flor) y octubre-noviembre (kōyō, hojas de otoño): ideal. Junio: temporada de lluvias (tsuyu). El verano es caluroso y húmedo (35°C). El invierno en Hokkaidō es duro pero el autostop funciona.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'El autostop en Japón es una experiencia cultural única. Los conductores que paran suelen ser apasionados por el encuentro. Te llevarán a restaurantes locales, onsen, sitios turísticos que quieren mostrarte. Algunos conductores hacen horas de desvío. Ofrece un pequeño regalo de tu país como agradecimiento (muy apreciado).' },
      { type: 'event', items: [
        { month: 'Abr', day: '⟳', name: 'Hanami (cerezos en flor)', desc: 'Picnics bajo los cerezos por todas partes. Período festivo.' },
        { month: 'Jul-Ago', day: '⟳', name: 'Matsuri (festivales de verano)', desc: 'Festivales locales por todas partes. Fuegos artificiales (hanabi). Ambiente único.' },
      ]},
    ]},
  },
  // ==================== SOUTH AFRICA ====================
  ZA: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'El autostop es legal en Sudáfrica. Sin restricciones. Los minibus-taxis son el transporte principal de los sudafricanos pero algunos también hacen autostop informal.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Sudáfrica es posible para el autostop pero requiere precaución. Las distancias son grandes y la tasa de criminalidad elevada en ciertas zonas. Las zonas rurales y la Garden Route son las más adaptadas.' },
      { type: 'kv', items: [
        { k: 'Garden Route (Ciudad del Cabo-Port Elizabeth)', v: 'Lo mejor, turístico y seguro', color: 'green' },
        { k: 'Drakensberg / Free State rural', v: 'Bueno, acogedor', color: 'green' },
        { k: 'Johannesburgo', v: 'Evitar absolutamente para el autostop', color: 'red' },
        { k: 'Townships / zonas urbanas', v: 'Desaconsejado', color: 'red' },
      ]},
      { type: 'text', text: 'Las gasolineras (Engen, Shell, Caltex) son los mejores spots. Aborda directamente a los conductores. Los afrikáners (campo) suelen ser los más acogedores con los autostopistas.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Sudáfrica requiere precaución. Las zonas rurales y la Garden Route son las más seguras para el autostop.' },
      { type: 'sub', title: 'Usa SpotHitch para tu seguridad' },
      { type: 'rule', icon: '🛡️', text: 'Activa el Modo Guardián antes de cada viaje. Una persona de confianza sigue tu posición en tiempo real.' },
      { type: 'rule', icon: '🆘', text: 'Configura el modo SOS con tus contactos. Un toque activa una triple alerta (push, SMS, llamada).' },
      { type: 'rule', icon: '📱', text: 'Fotografía la matrícula y envíala a alguien antes de subir.' },
      { type: 'rule', icon: '🎒', text: 'Mantén tu mochila accesible (en tu regazo o a tus pies), nunca en el maletero.' },
      { type: 'sub', title: 'Consejos del país' },
      { type: 'rule', icon: '⛽', text: 'Las estaciones Engen y Shell son spots seguros y concurridos para encontrar un viaje.' },
      { type: 'rule', icon: '☀️', text: 'Viaja exclusivamente de día. La Garden Route y las zonas rurales son las más seguras para el autostop.' },
      { type: 'sub', title: 'Números de emergencia' },
      { type: 'kv', items: [{ k: 'Emergencias', v: '10111' }] },
    ]},
    women: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'El autostop sola como mujer está desaconsejado en Sudáfrica. El país tiene una alta tasa de violencia de género. Viajar en pareja es muy recomendable. La Garden Route con un(a) compañero(a) es factible.' },
      { type: 'rule', icon: '👫', text: 'Viajar con un(a) compañero(a) es casi obligatorio.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Sudáfrica tiene 11 idiomas oficiales. El inglés se entiende casi en todas partes. El afrikáans es el idioma de muchos conductores en el Western Cape y el Free State. El zulú y el xhosa son los idiomas más hablados.' },
      { type: 'phrase', items: [
        { local: 'Howzit', meaning: 'Hola / ¿Qué tal? (argot sudafricano)' },
        { local: 'Sharp sharp', meaning: 'Genial, OK' },
        { local: 'Dankie / Enkosi', meaning: 'Gracias (afrikáans / xhosa)' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Sudáfrica es asequible para los extranjeros. Presupuesto ajustado: 20-35 €/día.' },
      { type: 'kv', items: [
        { k: 'Backpacker hostel', v: '100-250 ZAR (5-13 €)' },
        { k: 'Comida en restaurante', v: '80-150 ZAR (4-8 €)' },
        { k: 'Braai (BBQ) del supermercado', v: '50-100 ZAR (3-5 €)' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'La acampada libre es posible en las zonas rurales pero la seguridad debe evaluarse localmente. Los campings en las reservas naturales (SANParks) son seguros y bien equipados. La red de backpacker hostels es excelente a lo largo de la Garden Route.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚐', name: 'Baz Bus', detail: 'Bus hop-on/hop-off para mochileros, red costera', price: '200-500 ZAR' },
        { emoji: '🚌', name: 'Greyhound / Intercape', detail: 'Buses de larga distancia fiables', price: '200-800 ZAR' },
        { emoji: '🚂', name: 'Shosholoza Meyl', detail: 'Tren de larga distancia barato (Joburg-Ciudad del Cabo)', price: '200-600 ZAR' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Ene', level: 'great' }, { name: 'Feb', level: 'great' }, { name: 'Mar', level: 'great' },
        { name: 'Abr', level: 'good' }, { name: 'May', level: 'ok' }, { name: 'Jun', level: 'ok' },
        { name: 'Jul', level: 'ok' }, { name: 'Ago', level: 'ok' }, { name: 'Sep', level: 'good' },
        { name: 'Oct', level: 'great' }, { name: 'Nov', level: 'great' }, { name: 'Dic', level: 'great' },
      ]},
      { type: 'text', text: 'Hemisferio sur: el verano (noviembre-marzo) es ideal. El Western Cape es mediterráneo (seco en verano, lluvioso en invierno). El Drakensberg es frío en invierno. El Kruger es mejor de mayo a septiembre (estación seca, animales visibles).' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Sudáfrica es la "nación arcoíris". Las culturas se mezclan y las conversaciones son ricas. El braai (barbacoa) es una religión nacional. El biltong (carne seca) es el snack de carretera por excelencia. Ubuntu ("soy porque somos") es la filosofía dominante.' },
    ]},
  },
  // ==================== IRAN ====================
  IR: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'El autostop es legal en Irán. Sin restricciones. La práctica es habitual porque muchos iraníes no tienen coche y los transportes rurales son limitados. La hospitalidad iraní hace del autostop algo natural.' },
      { type: 'warn', text: '⚠️ Se necesita visado para la mayoría de nacionalidades. Algunos países (EEUU, Reino Unido, Canadá) necesitan guía obligatorio. Verifica los requisitos antes de viajar.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Irán es uno de los mejores países del mundo para el autostop. La hospitalidad iraní (ta\'arof) es legendaria. Los conductores paran sin que se lo pidas, insisten en pagar la comida, y proponen alojamiento en su casa. Tiempo de espera medio: 5-15 min.' },
      { type: 'text', text: 'El concepto de tarof (cortesía excesiva) significa que los iraníes insisten en ayudarte. Si un conductor rechaza tu dinero, es sincero (pero ofrece 3 veces por cortesía). En zona rural, el tráfico es bajo pero todo el mundo para.' },
      { type: 'sub', title: 'Zonas recomendadas' },
      { type: 'kv', items: [
        { k: 'Isfahán-Shiraz-Yazd (triángulo turístico)', v: 'Excelente, buen tráfico', color: 'green' },
        { k: 'Costa del Caspio (norte)', v: 'Fácil, paisajes verdes', color: 'green' },
        { k: 'Kurdistán iraní (oeste)', v: 'Muy hospitalario', color: 'green' },
        { k: 'Zonas fronterizas (Irak, Afganistán, Pakistán)', v: 'Desaconsejado', color: 'red' },
      ]},
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Irán es muy seguro para el autostop. La hospitalidad iraní es legendaria y los conductores hacen desvíos para ayudarte.' },
      { type: 'sub', title: 'Usa SpotHitch para tu seguridad' },
      { type: 'rule', icon: '🛡️', text: 'Activa el Modo Guardián antes de cada viaje. Una persona de confianza sigue tu posición en tiempo real.' },
      { type: 'rule', icon: '🆘', text: 'Configura el modo SOS con tus contactos. Un toque activa una triple alerta (push, SMS, llamada).' },
      { type: 'rule', icon: '📱', text: 'Fotografía la matrícula y envíala a alguien antes de subir.' },
      { type: 'rule', icon: '🎒', text: 'Mantén tu mochila accesible (en tu regazo o a tus pies), nunca en el maletero.' },
      { type: 'sub', title: 'Consejos del país' },
      { type: 'rule', icon: '👔', text: 'Respeta el código de vestimenta local. Las tarjetas bancarias internacionales no funcionan: prevé efectivo.' },
      { type: 'rule', icon: '🍵', text: 'La hospitalidad iraní es inmensa. Te ofrecerán té, comida e incluso alojamiento. Acepta con gratitud.' },
      { type: 'sub', title: 'Números de emergencia' },
      { type: 'kv', items: [{ k: 'Emergencias', v: '115' }] },
    ]},
    women: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'Las mujeres deben llevar hijab (pañuelo) en Irán (obligatorio por ley). El autostop sola como mujer es posible pero requiere precaución. Muchas viajeras reportan experiencias positivas pero también algunas situaciones incómodas. Se recomienda viajar en pareja.' },
      { type: 'rule', icon: '🧕', text: 'El hijab es obligatorio (pañuelo cubriendo el pelo). Ropa holgada cubriendo brazos y piernas.' },
      { type: 'rule', icon: '👫', text: 'Las familias y las mujeres conductoras son los aventones más seguros.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'El farsi (persa) es el idioma principal. El inglés es raro fuera de Teherán e Isfahán. El alfabeto es árabe (se lee de derecha a izquierda). Los iraníes adoran cuando los extranjeros hablan unas palabras de farsi.' },
      { type: 'phrase', items: [
        { local: 'Salam', meaning: 'Hola' },
        { local: 'Merci / Mamnun', meaning: 'Gracias' },
        { local: 'Lotfan', meaning: 'Por favor' },
        { local: 'Mosāfer hastam', meaning: 'Soy un viajero' },
        { local: 'Rāyegan', meaning: 'Gratis' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Irán es muy barato (sobre todo con el tipo de cambio no oficial). Presupuesto ajustado: 10-20 €/día. Los conductores a menudo pagan la comida. El problema: las tarjetas bancarias internacionales NO funcionan en Irán. Lleva euros o dólares en efectivo.' },
      { type: 'kv', items: [
        { k: 'Comida local (kebab, arroz)', v: '2-5 €' },
        { k: 'Mosāferkhāne (hotel básico)', v: '5-15 €' },
        { k: 'Bus de larga distancia (VIP)', v: '3-10 €' },
      ]},
      { type: 'warn', text: '⚠️ NINGUNA tarjeta bancaria internacional funciona en Irán (sanciones). Lleva TODO tu dinero en efectivo (euros o dólares).' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'La acampada libre está tolerada en las montañas (Alborz, Zagros). En la ciudad, los mosāferkhāne (hoteles básicos) son baratos. Los conductores invitan MUY a menudo a los viajeros a su casa. Rechazar es casi de mala educación. Las mezquitas a veces ofrecen alojamiento a los viajeros.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Bus VIP', detail: 'Cómodos, red extensa, muy baratos', price: '3-10 €' },
        { emoji: '🚂', name: 'Tren', detail: 'Red limitada pero trenes nocturnos cómodos', price: '5-15 €' },
        { emoji: '🚕', name: 'Savari (taxi colectivo)', detail: 'Taxis compartidos interurbanos, esperan estar llenos', price: '2-8 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Ene', level: 'bad' }, { name: 'Feb', level: 'ok' }, { name: 'Mar', level: 'great' },
        { name: 'Abr', level: 'great' }, { name: 'May', level: 'great' }, { name: 'Jun', level: 'ok' },
        { name: 'Jul', level: 'bad' }, { name: 'Ago', level: 'bad' }, { name: 'Sep', level: 'ok' },
        { name: 'Oct', level: 'great' }, { name: 'Nov', level: 'good' }, { name: 'Dic', level: 'ok' },
      ]},
      { type: 'text', text: 'Marzo-mayo (Nowruz, año nuevo persa) y septiembre-noviembre: ideal. El verano es abrasador en el sur (45°C+) pero agradable en montaña. El invierno es frío en el norte y las montañas.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'La hospitalidad iraní está considerada como la mejor del mundo por muchos viajeros. El ta\'arof (código de cortesía) implica que los iraníes insistan en invitarte, alimentarte y alojarte. La cultura persa es refinada (poesía de Hafez, Rumi). Los iraníes están orgullosos de mostrar su país y de deconstruir los prejuicios occidentales.' },
      { type: 'event', items: [
        { month: 'Mar', day: '20-21', name: 'Nowruz (Año Nuevo persa)', desc: 'La mayor fiesta del año. 13 días de vacaciones. Todo el mundo viaja, mucho tráfico.' },
      ]},
    ]},
  },
  // ==================== TUNISIA ====================
  TN: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'El autostop es legal en Túnez. Sin restricciones. La práctica es habitual entre los locales, sobre todo en zona rural. Los "louages" (taxis colectivos) son el transporte principal pero el autostop funciona bien.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Túnez es fácil para el autostop. El país es pequeño (780 km de norte a sur) y los tunecinos son acogedores. Tiempo de espera: 10-30 min. Los conductores paran fácilmente, sobre todo para los extranjeros.' },
      { type: 'rule', icon: '🚛', text: 'Los camiones llevan pasajeros en largas distancias (atención: algunos esperan propina).' },
      { type: 'rule', icon: '⛽', text: 'Las gasolineras a la salida de las ciudades son los mejores spots.' },
      { type: 'text', text: 'El sur (Tozeur, Douz, Tataouine) tiene poco tráfico pero todo el mundo para. El norte y la costa tienen más circulación.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Túnez es seguro para el autostop en las zonas turísticas. Los tunecinos son hospitalarios y acogedores.' },
      { type: 'sub', title: 'Usa SpotHitch para tu seguridad' },
      { type: 'rule', icon: '🛡️', text: 'Activa el Modo Guardián antes de cada viaje. Una persona de confianza sigue tu posición en tiempo real.' },
      { type: 'rule', icon: '🆘', text: 'Configura el modo SOS con tus contactos. Un toque activa una triple alerta (push, SMS, llamada).' },
      { type: 'rule', icon: '📱', text: 'Fotografía la matrícula y envíala a alguien antes de subir.' },
      { type: 'rule', icon: '🎒', text: 'Mantén tu mochila accesible (en tu regazo o a tus pies), nunca en el maletero.' },
      { type: 'sub', title: 'Consejos del país' },
      { type: 'rule', icon: '🏖️', text: 'Las zonas turísticas (Túnez, Susa, Yerba, Tozeur) son seguras y bien conectadas.' },
      { type: 'rule', icon: '🤝', text: 'Los tunecinos son hospitalarios. Una sonrisa y algunas palabras en árabe abren muchas puertas.' },
      { type: 'sub', title: 'Números de emergencia' },
      { type: 'kv', items: [{ k: 'Policía', v: '197' }] },
    ]},
    women: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'El acoso callejero es frecuente en Túnez. Las mujeres que viajan solas en autostop reportan experiencias mixtas. Se recomienda mucho viajar en pareja. Las zonas turísticas (Sidi Bou Said, Hammamet) son más relajadas.' },
      { type: 'rule', icon: '👫', text: 'Viajar en pareja es muy recomendable.' },
      { type: 'rule', icon: '👕', text: 'Viste de forma conservadora fuera de las zonas balnearias.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'El árabe tunecino (derja) es el idioma local. El francés está muy extendido (casi todo el mundo lo habla). El inglés progresa entre los jóvenes.' },
      { type: 'phrase', items: [
        { local: 'Bahi / Barcha', meaning: 'Bien / Mucho' },
        { local: 'Yaatik essaha', meaning: 'Gracias (que Dios te dé salud)' },
        { local: 'Win temchi?', meaning: '¿A dónde vas?' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Muy barato. Presupuesto ajustado: 15-25 €/día. El cuscús del viernes se comparte a menudo gratis.' },
      { type: 'kv', items: [
        { k: 'Comida local', v: '2-5 TND (0,60-1,50 €)' },
        { k: 'Hostel', v: '20-50 TND (6-15 €)' },
        { k: 'Louage (100 km)', v: '5-10 TND (1,50-3 €)' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'La acampada libre está tolerada en el sur y las zonas rurales. Los tunecinos invitan fácilmente a los viajeros a su casa. Los albergues juveniles son baratos.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚐', name: 'Louage', detail: 'Taxi colectivo entre ciudades. Espera estar lleno. Rápido y barato.', price: '1-5 €' },
        { emoji: '🚂', name: 'SNCFT (tren)', detail: 'Red limitada pero barata', price: '1-5 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Ene', level: 'ok' }, { name: 'Feb', level: 'good' }, { name: 'Mar', level: 'great' },
        { name: 'Abr', level: 'great' }, { name: 'May', level: 'great' }, { name: 'Jun', level: 'good' },
        { name: 'Jul', level: 'ok' }, { name: 'Ago', level: 'ok' }, { name: 'Sep', level: 'good' },
        { name: 'Oct', level: 'great' }, { name: 'Nov', level: 'good' }, { name: 'Dic', level: 'ok' },
      ]},
      { type: 'text', text: 'Marzo-mayo y septiembre-noviembre: ideal. El verano es caluroso (40°C+ en el sur). El invierno es suave en la costa pero fresco en las montañas.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'La hospitalidad tunecina es sincera. El té de menta y el café turco se ofrecen generosamente. El cuscús del viernes es un ritual familiar. Los tunecinos están orgullosos de su historia (Cartago) y les gusta hablar de ella.' },
    ]},
  },
  // ==================== MEXICO ====================
  MX: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'El autostop ("pedir aventón" o "pedir raid") es legal en México. Sin restricciones. Práctica habitual en zona rural. Las comunidades indígenas hacen autostop regularmente.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'México es bueno para el autostop fuera de las zonas de riesgo. Los mexicanos son acogedores y curiosos con los extranjeros. Tiempo de espera: 15-45 min. Los camiones llevan pasajeros regularmente.' },
      { type: 'sub', title: 'Mejores zonas' },
      { type: 'kv', items: [
        { k: 'Oaxaca / Chiapas', v: 'Excelente, comunidades acogedoras', color: 'green' },
        { k: 'Yucatán', v: 'Bueno, turístico, buen tráfico', color: 'green' },
        { k: 'Baja California', v: 'Factible, poco tráfico en el desierto', color: 'amber' },
        { k: 'Norte (Sinaloa, Tamaulipas, Chihuahua)', v: 'Desaconsejado (cárteles)', color: 'red' },
      ]},
      { type: 'rule', icon: '⛽', text: 'Las casetas (peajes) y las gasolineras Pemex son los mejores spots.' },
      { type: 'rule', icon: '🚛', text: 'Los "tráilers" (camiones) hacen largas distancias. Aborda a los conductores en las gasolineras.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'México es seguro para el autostop en las zonas turísticas y en las carreteras principales.' },
      { type: 'sub', title: 'Usa SpotHitch para tu seguridad' },
      { type: 'rule', icon: '🛡️', text: 'Activa el Modo Guardián antes de cada viaje. Una persona de confianza sigue tu posición en tiempo real.' },
      { type: 'rule', icon: '🆘', text: 'Configura el modo SOS con tus contactos. Un toque activa una triple alerta (push, SMS, llamada).' },
      { type: 'rule', icon: '📱', text: 'Fotografía la matrícula y envíala a alguien antes de subir.' },
      { type: 'rule', icon: '🎒', text: 'Mantén tu mochila accesible (en tu regazo o a tus pies), nunca en el maletero.' },
      { type: 'sub', title: 'Consejos del país' },
      { type: 'rule', icon: '🛣️', text: 'Las casetas de cobro (peajes) son los mejores spots. Los coches reducen la velocidad y puedes charlar con los conductores.' },
      { type: 'rule', icon: '🌮', text: 'Las zonas turísticas (Oaxaca, Yucatán, Baja California) y las carreteras principales son las más seguras para el autostop.' },
      { type: 'sub', title: 'Números de emergencia' },
      { type: 'kv', items: [{ k: 'Emergencias', v: '911' }] },
    ]},
    women: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'El machismo está presente en México. Las mujeres que viajan solas en autostop reportan experiencias mixtas. El sur es más seguro. Se recomienda mucho viajar en pareja.' },
      { type: 'rule', icon: '👫', text: 'Viajar con un(a) compañero(a) es muy recomendable.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'El español es indispensable. El inglés es raro fuera de las zonas turísticas (Cancún, Playa del Carmen). 68 lenguas indígenas se siguen hablando.' },
      { type: 'phrase', items: [
        { local: '¿Me da un aventón / raid?', meaning: '¿Me lleva en autostop?' },
        { local: '¿Hasta dónde va?', meaning: '¿Hasta dónde va?' },
        { local: '¡Gracias, que le vaya bien!', meaning: '¡Gracias, buen viaje!' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'México es barato. Presupuesto ajustado: 15-25 €/día.' },
      { type: 'kv', items: [
        { k: 'Tacos de la calle', v: '10-30 MXN (0,50-1,50 €)' },
        { k: 'Comida corrida (menú del día)', v: '50-100 MXN (2,50-5 €)' },
        { k: 'Hostel', v: '150-400 MXN (7-20 €)' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'La acampada libre es posible en las playas del Pacífico y en las zonas rurales. Las hamacas son una alternativa popular en la costa. Los mexicanos a veces invitan a los viajeros a su casa.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'ADO / ETN', detail: 'Buses de larga distancia lujosos. ADO cubre el sur, ETN el centro.', price: '5-40 €' },
        { emoji: '🚐', name: 'Colectivos', detail: 'Minibuses locales, muy baratos', price: '0,30-2 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Ene', level: 'great' }, { name: 'Feb', level: 'great' }, { name: 'Mar', level: 'great' },
        { name: 'Abr', level: 'good' }, { name: 'May', level: 'ok' }, { name: 'Jun', level: 'ok' },
        { name: 'Jul', level: 'ok' }, { name: 'Ago', level: 'ok' }, { name: 'Sep', level: 'bad' },
        { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'great' }, { name: 'Dic', level: 'great' },
      ]},
      { type: 'text', text: 'Noviembre a abril: temporada seca, ideal. Junio-octubre: temporada de lluvias (aguaceros por la tarde). Septiembre: huracanes en las costas. El Yucatán es caluroso y húmedo todo el año.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Los mexicanos son cálidos y orgullosos de su cultura. La comida es central (tacos, mole, tamales). El mezcal y el tequila se comparten generosamente. El Día de los Muertos (2 de noviembre) es un momento cultural único.' },
      { type: 'event', items: [
        { month: 'Nov', day: '1-2', name: 'Día de los Muertos', desc: 'Fiesta de los muertos. Altares, ofrendas, cementerios decorados. Oaxaca es el mejor lugar.' },
        { month: 'Sep', day: '15-16', name: 'Fiestas Patrias', desc: 'Fiesta de la independencia. El "Grito" a medianoche, fuegos artificiales, fiestas por todas partes.' },
      ]},
    ]},
  },
  // ==================== BRAZIL ====================
  BR: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'El autostop ("carona" o "pedir carona") es legal en Brasil. Sin restricciones. La práctica es menos habitual que en Hispanoamérica pero funciona, sobre todo en el sur.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Brasil es posible para el autostop pero las distancias son inmensas (el 5° país más grande del mundo). Tiempo de espera: 30 min-2h. El sur (Rio Grande do Sul, Santa Catarina, Paraná) es lo más fácil.' },
      { type: 'kv', items: [
        { k: 'Sur (RS, SC, PR)', v: 'Lo mejor, cultura europea, acogedor', color: 'green' },
        { k: 'Minas Gerais', v: 'Bueno, gente cálida', color: 'green' },
        { k: 'Nordeste (Bahía costa)', v: 'Factible, camiones', color: 'amber' },
        { k: 'Amazonia', v: 'Casi imposible por carretera, barcos fluviales en su lugar', color: 'red' },
      ]},
      { type: 'rule', icon: '⛽', text: 'Las gasolineras (postos de gasolina) son los mejores spots. Aborda a los camioneros en los restaurantes de carretera.' },
      { type: 'rule', icon: '🚛', text: 'Los camioneros ("caminhoneiros") son tu mejor opción para las largas distancias.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Brasil es seguro para el autostop en las zonas turísticas y en las carreteras principales.' },
      { type: 'sub', title: 'Usa SpotHitch para tu seguridad' },
      { type: 'rule', icon: '🛡️', text: 'Activa el Modo Guardián antes de cada viaje. Una persona de confianza sigue tu posición en tiempo real.' },
      { type: 'rule', icon: '🆘', text: 'Configura el modo SOS con tus contactos. Un toque activa una triple alerta (push, SMS, llamada).' },
      { type: 'rule', icon: '📱', text: 'Fotografía la matrícula y envíala a alguien antes de subir.' },
      { type: 'rule', icon: '🎒', text: 'Mantén tu mochila accesible (en tu regazo o a tus pies), nunca en el maletero.' },
      { type: 'sub', title: 'Consejos del país' },
      { type: 'rule', icon: '⛽', text: 'Los postos (gasolineras) son los spots más seguros. Los camioneros hacen paradas frecuentes all��.' },
      { type: 'rule', icon: '🗣️', text: 'Aprende algunas palabras de portugués. Pocos brasileños hablan inglés y el esfuerzo es muy apreciado.' },
      { type: 'sub', title: 'Números de emergencia' },
      { type: 'kv', items: [{ k: 'Policía', v: '190' }] },
    ]},
    women: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'El acoso callejero existe en Brasil. Las mujeres que viajan solas en autostop reportan experiencias variables. El sur es más seguro. Se recomienda viajar en pareja.' },
      { type: 'rule', icon: '👫', text: 'Se recomienda viajar en pareja, sobre todo en el norte y el nordeste.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'El portugués brasileño es el idioma único. El español se entiende parcialmente pero NO hables español (se percibe como irrespetuoso). El inglés es raro fuera de las grandes ciudades.' },
      { type: 'phrase', items: [
        { local: 'Oi, tudo bem?', meaning: 'Hola, ¿qué tal?' },
        { local: 'Carona, por favor', meaning: 'Un aventón, por favor' },
        { local: 'Obrigado/a', meaning: 'Gracias (masc./fem.)' },
        { local: 'Pra onde você vai?', meaning: '¿A dónde va?' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Brasil es moderadamente caro para Sudamérica. Presupuesto ajustado: 20-35 €/día. El sur es más barato que Río o São Paulo.' },
      { type: 'kv', items: [
        { k: 'Prato feito (plato del día)', v: '15-30 BRL (3-6 €)' },
        { k: 'Hostel', v: '40-100 BRL (8-20 €)' },
        { k: 'Açaí (bol)', v: '10-20 BRL (2-4 €)' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'La acampada libre es posible en playas desiertas y en zona rural. Los campings son baratos en el sur. Las pousadas (guesthouses) ofrecen buena relación calidad-precio.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Bus de larga distancia', detail: 'Red excelente. Leito = cama. Semi-leito = reclinable.', price: '10-60 €' },
        { emoji: '✈️', name: 'Vuelos interiores', detail: 'GOL, LATAM, Azul. A menudo más barato que el bus para largas distancias.', price: '20-100 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Ene', level: 'good' }, { name: 'Feb', level: 'good' }, { name: 'Mar', level: 'great' },
        { name: 'Abr', level: 'great' }, { name: 'May', level: 'great' }, { name: 'Jun', level: 'good' },
        { name: 'Jul', level: 'good' }, { name: 'Ago', level: 'good' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'great' }, { name: 'Nov', level: 'good' }, { name: 'Dic', level: 'good' },
      ]},
      { type: 'text', text: 'Brasil es inmenso: el clima varía de tropical a subtropical. El sur es templado. Marzo-mayo y septiembre-noviembre son ideales para la mayoría de las regiones. El verano (diciembre-febrero) es la temporada de lluvias en el centro-sur.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Los brasileños están entre la gente más cálida del mundo. La música (samba, forró, MPB) es omnipresente. El churrasco (barbacoa) es un ritual social. Los brasileños adoran hacer fiesta y acoger a los extranjeros.' },
      { type: 'event', items: [
        { month: 'Feb-Mar', day: '⟳', name: 'Carnaval', desc: 'El mayor carnaval del mundo. Río, Salvador y Olinda son los mejores. Transporte caótico.' },
        { month: 'Jun', day: '⟳', name: 'Festas Juninas', desc: 'Fiestas de San Juan. Bailes, hogueras, comida callejera en todo el Nordeste.' },
      ]},
    ]},
  },
  // ==================== PERU ====================
  PE: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'El autostop es legal en Perú. Práctica habitual en zona rural. Los locales también hacen dedo ("pedir jalada") porque los transportes son limitados en los Andes.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Perú es bueno para el autostop, sobre todo en los Andes. Tiempo de espera: 20 min-1h. Los camiones son el transporte principal en montaña. Atención: muchos conductores esperan un pago (transporte informal). Aclara "gratis" antes de subir.' },
      { type: 'rule', icon: '🚛', text: 'Los camiones en los Andes paran fácilmente. Colócate en los controles de carretera (garitas).' },
      { type: 'rule', icon: '⛽', text: 'Los grifos (gasolineras) a la salida de las ciudades son los mejores spots.' },
      { type: 'kv', items: [
        { k: 'Valle Sagrado / Cusco', v: 'Fácil, turístico', color: 'green' },
        { k: 'Andes rurales', v: 'Camiones, poco tráfico pero todo para', color: 'green' },
        { k: 'Panamericana (costa)', v: 'Buen tráfico, camiones de larga distancia', color: 'green' },
        { k: 'Lima (salida)', v: 'Difícil, bus hasta la salida', color: 'red' },
      ]},
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Perú es seguro para el autostop en las carreteras principales y las zonas turísticas.' },
      { type: 'sub', title: 'Usa SpotHitch para tu seguridad' },
      { type: 'rule', icon: '🛡️', text: 'Activa el Modo Guardián antes de cada viaje. Una persona de confianza sigue tu posición en tiempo real.' },
      { type: 'rule', icon: '🆘', text: 'Configura el modo SOS con tus contactos. Un toque activa una triple alerta (push, SMS, llamada).' },
      { type: 'rule', icon: '📱', text: 'Fotografía la matrícula y envíala a alguien antes de subir.' },
      { type: 'rule', icon: '🎒', text: 'Mantén tu mochila accesible (en tu regazo o a tus pies), nunca en el maletero.' },
      { type: 'sub', title: 'Consejos del país' },
      { type: 'rule', icon: '🛣️', text: 'Los peajes y las gasolineras son los mejores spots. Los coches reducen la velocidad y puedes abordar a los conductores.' },
      { type: 'rule', icon: '🏔️', text: 'En altitud (Cusco, Puno), tómate tiempo para aclimatarte. El mal de altura es un riesgo real.' },
      { type: 'sub', title: 'Números de emergencia' },
      { type: 'kv', items: [{ k: 'Emergencias', v: '105' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'El machismo existe pero el sur turístico es relativamente seguro para las mujeres. Se recomienda viajar en pareja en las zonas rurales.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'El español es el idioma principal. El quechua y el aimara se hablan en los Andes. El inglés es raro fuera de Cusco y Lima.' },
      { type: 'phrase', items: [
        { local: '¿Me da una jalada?', meaning: '¿Me lleva en autostop?' },
        { local: 'Gratis, por favor', meaning: 'Gratis, por favor' },
        { local: '¡Gracias, caserito!', meaning: '¡Gracias, amigo! (peruanismo)' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Perú es barato. Presupuesto ajustado: 12-20 €/día. Los menús (almuerzo) son abundantes y baratos.' },
      { type: 'kv', items: [
        { k: 'Menú (comida completa)', v: '5-12 PEN (1-3 €)' },
        { k: 'Hostel', v: '20-60 PEN (5-15 €)' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'La acampada libre está tolerada en los Andes y las zonas rurales. Pide permiso a las comunidades locales. Los hospedajes (guesthouses básicos) son muy baratos.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Cruz del Sur / Oltursa', detail: 'Buses de larga distancia cómodos', price: '5-40 €' },
        { emoji: '🚐', name: 'Combi / Colectivo', detail: 'Transporte local, muy barato, rutas de montaña', price: '0,30-3 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Ene', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mar', level: 'ok' },
        { name: 'Abr', level: 'good' }, { name: 'May', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Ago', level: 'great' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'ok' }, { name: 'Dic', level: 'bad' },
      ]},
      { type: 'text', text: 'Mayo a septiembre: temporada seca en los Andes, ideal. Diciembre-marzo: temporada de lluvias (carreteras cortadas en montaña). La costa es seca todo el año.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Los peruanos son acogedores y orgullosos de su gastronomía (Perú es la capital culinaria de Sudamérica). El ceviche, el lomo saltado y el pisco sour son instituciones. Las comunidades andinas tienen una fuerte cultura del compartir.' },
      { type: 'event', items: [
        { month: 'Jun', day: '24', name: 'Inti Raymi (Cusco)', desc: 'Fiesta del Sol inca. Recreación espectacular en Sacsayhuamán.' },
      ]},
    ]},
  },
  // ==================== BOLIVIA ====================
  BO: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'El autostop es legal en Bolivia. Práctica muy habitual porque muchas comunidades rurales no tienen transporte regular. Los camiones son un modo de transporte normal en los Andes.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Bolivia es un buen país para el autostop. Los conductores de camión llevan pasajeros regularmente (a menudo a cambio de un pago modesto). Aclara si es gratis. Tiempo de espera: 15-45 min. El Altiplano tiene poco tráfico pero la gente para.' },
      { type: 'kv', items: [
        { k: 'La Paz-Oruro-Potosí', v: 'Buen tráfico, carretera principal', color: 'green' },
        { k: 'Yungas / Amazonia', v: 'Camiones, poco tráfico, aventura', color: 'amber' },
        { k: 'Salar de Uyuni', v: 'Muy poco tráfico, organiza con un tour', color: 'amber' },
      ]},
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Bolivia es un país seguro para el autostop. Las carreteras de montaña son el principal riesgo.' },
      { type: 'sub', title: 'Usa SpotHitch para tu seguridad' },
      { type: 'rule', icon: '🛡️', text: 'Activa el Modo Guardián antes de cada viaje. Una persona de confianza sigue tu posición en tiempo real.' },
      { type: 'rule', icon: '🆘', text: 'Configura el modo SOS con tus contactos. Un toque activa una triple alerta (push, SMS, llamada).' },
      { type: 'rule', icon: '📱', text: 'Fotografía la matrícula y envíala a alguien antes de subir.' },
      { type: 'rule', icon: '🎒', text: 'Mantén tu mochila accesible (en tu regazo o a tus pies), nunca en el maletero.' },
      { type: 'sub', title: 'Consejos del país' },
      { type: 'rule', icon: '🏔️', text: 'Las carreteras de montaña son a veces peligrosas (curvas, precipicios). Tómate tu tiempo para aclimatarte.' },
      { type: 'rule', icon: '💧', text: 'Bebe mucha agua en altitud. El soroche (mal de montaña) es frecuente por encima de 3.000 m.' },
      { type: 'sub', title: 'Números de emergencia' },
      { type: 'kv', items: [{ k: 'Emergencias', v: '110' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Bolivia es relativamente segura para las mujeres. Las comunidades indígenas son respetuosas. Se recomienda viajar en pareja en las zonas aisladas.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'El español es el idioma principal. El quechua y el aimara se hablan mucho en los Andes. El inglés es raro.' },
      { type: 'phrase', items: [
        { local: '¿Me lleva?', meaning: '¿Me lleva?' },
        { local: '¿Es gratis?', meaning: '¿Es gratis?' },
        { local: 'Jallalla!', meaning: '¡Viva! (aimara, expresión positiva)' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Bolivia es el país más barato de Sudamérica. Presupuesto ajustado: 8-15 €/día. Almuerzo completo: 1-2 €. Hostel: 3-8 €/noche.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'La acampada libre es posible en todas partes en las zonas rurales y el Altiplano. Las noches son muy frías en altitud (hasta -15°C). Un buen saco de dormir es indispensable.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Bus / Flota', detail: 'Buses de larga distancia, carreteras a menudo de tierra', price: '3-15 €' },
        { emoji: '🚐', name: 'Trufi / Micro', detail: 'Transporte local en minibús', price: '0,15-1 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Ene', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mar', level: 'ok' },
        { name: 'Abr', level: 'good' }, { name: 'May', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Ago', level: 'great' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'ok' }, { name: 'Dic', level: 'bad' },
      ]},
      { type: 'text', text: 'Mayo a septiembre: temporada seca, ideal. Diciembre-marzo: lluvias intensas, carreteras cortadas, Salar inundado (pero espejo de agua espectacular).' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Bolivia tiene la mayor proporción de población indígena de Sudamérica (62%). La cultura aimara y quechua está viva. La hoja de coca es sagrada y omnipresente (mascar coca = normal, no es droga). Las Cholitas (mujeres en traje tradicional) son un orgullo nacional.' },
    ]},
  },
  // ==================== ECUADOR ====================
  EC: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'El autostop es legal en Ecuador. Práctica habitual. El país es pequeño (640 km de norte a sur) y se cruza fácilmente. La moneda es el dólar americano.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Ecuador es fácil para el autostop. El país es pequeño y los ecuatorianos son acogedores. Tiempo de espera: 15-30 min. Las camionetas (pickups) a menudo llevan pasajeros (a veces a cambio de un pago modesto).' },
      { type: 'rule', icon: '🛻', text: 'Las camionetas (pickups) paran fácilmente. Sube a la caja, es normal y habitual.' },
      { type: 'rule', icon: '⛽', text: 'Los peajes y las gasolineras son los mejores spots.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Ecuador es seguro para el autostop en las carreteras principales. Los peajes son los spots más eficaces.' },
      { type: 'sub', title: 'Usa SpotHitch para tu seguridad' },
      { type: 'rule', icon: '🛡️', text: 'Activa el Modo Guardián antes de cada viaje. Una persona de confianza sigue tu posición en tiempo real.' },
      { type: 'rule', icon: '🆘', text: 'Configura el modo SOS con tus contactos. Un toque activa una triple alerta (push, SMS, llamada).' },
      { type: 'rule', icon: '📱', text: 'Fotografía la matrícula y envíala a alguien antes de subir.' },
      { type: 'rule', icon: '🎒', text: 'Mantén tu mochila accesible (en tu regazo o a tus pies), nunca en el maletero.' },
      { type: 'sub', title: 'Consejos del país' },
      { type: 'rule', icon: '🛣️', text: 'Los peajes son los mejores spots para abordar a los conductores con total seguridad.' },
      { type: 'rule', icon: '🏔️', text: 'Cuidado con la altitud en la Sierra (Quito, Cuenca). Tómate tiempo para aclimatarte.' },
      { type: 'sub', title: 'Números de emergencia' },
      { type: 'kv', items: [{ k: 'Emergencias', v: '911' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Ecuador es moderadamente seguro para las mujeres. Los Andes son más seguros que la costa. Se recomienda viajar en pareja.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'El español es el idioma principal. El kichwa se habla en los Andes. El inglés está limitado a las zonas turísticas.' },
      { type: 'phrase', items: [
        { local: '¿Me da un jalón?', meaning: '¿Me lleva? (Ecuador)' },
        { local: '¡Chévere!', meaning: '¡Genial!' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Ecuador usa el dólar americano. Presupuesto ajustado: 15-25 $/día. Los almuerzos (menú del día) cuestan 2-3 $. Hostel: 8-15 $/noche.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'La acampada libre es posible en los Andes y la selva amazónica. Los hospedajes (guesthouses) son muy baratos.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Bus', detail: 'Red extensa y barata. Los buses paran en todas partes.', price: '1 $/hora de trayecto' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Ene', level: 'ok' }, { name: 'Feb', level: 'ok' }, { name: 'Mar', level: 'ok' },
        { name: 'Abr', level: 'ok' }, { name: 'May', level: 'good' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Ago', level: 'great' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'good' }, { name: 'Dic', level: 'ok' },
      ]},
      { type: 'text', text: 'Junio-septiembre: temporada seca en los Andes. La costa es seca de junio a noviembre. La Amazonia es húmeda todo el año.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Ecuador es increíblemente diverso para un país pequeño: costa, Andes, Amazonia y Galápagos. Los mercados indígenas (Otavalo) son espectaculares. El cuy (cobaya) es un plato tradicional en los Andes.' },
    ]},
  },
  // ==================== URUGUAY ====================
  UY: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'El autostop es legal en Uruguay. Práctica aceptada y culturalmente normal. El país es pequeño (660 km de este a oeste) y seguro.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Uruguay es fácil y seguro para el autostop. El país es pequeño y los uruguayos son relajados y acogedores. Tiempo de espera: 15-30 min. Las carreteras principales (Ruta 1, Ruta 5) tienen buen tráfico.' },
      { type: 'text', text: 'Las estaciones Ancap y los peajes son los mejores spots. En verano (enero-febrero), la costa (Punta del Diablo, Cabo Polonio) es muy frecuentada por los argentinos y el autostop es fácil.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Uruguay es seguro y acogedor para el autostop. El país es pequeño y las distancias cortas.' },
      { type: 'sub', title: 'Usa SpotHitch para tu seguridad' },
      { type: 'rule', icon: '🛡️', text: 'Activa el Modo Guardián antes de cada viaje. Una persona de confianza sigue tu posición en tiempo real.' },
      { type: 'rule', icon: '🆘', text: 'Configura el modo SOS con tus contactos. Un toque activa una triple alerta (push, SMS, llamada).' },
      { type: 'rule', icon: '📱', text: 'Fotografía la matrícula y envíala a alguien antes de subir.' },
      { type: 'rule', icon: '🎒', text: 'Mantén tu mochila accesible (en tu regazo o a tus pies), nunca en el maletero.' },
      { type: 'sub', title: 'Consejos del país' },
      { type: 'rule', icon: '⛽', text: 'Las estaciones Ancap (cadena nacional) están bien repartidas y son ideales para encontrar un viaje.' },
      { type: 'rule', icon: '🗺️', text: 'El país es pequeño. Puedes cruzarlo en un día. Cada viaje te acerca rápidamente a tu destino.' },
      { type: 'sub', title: 'Números de emergencia' },
      { type: 'kv', items: [{ k: 'Emergencias', v: '911' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Uruguay se considera seguro para mujeres que viajan solas. El país es progresista (primero en Latinoamérica en legalizar el cannabis y el matrimonio igualitario).' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'El español rioplatense (como Argentina, con "vos" y "sh"). El portuñol se habla en la frontera brasileña. El inglés es limitado.' },
      { type: 'phrase', items: [
        { local: '¿Me llevás?', meaning: '¿Me llevás?' },
        { local: 'Ta, gracias', meaning: 'OK, gracias (uruguayismo)' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Uruguay es más caro que Argentina. Presupuesto ajustado: 20-35 €/día. Las parrilladas son abundantes.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'La acampada libre está tolerada en las playas y en zona rural. Cabo Polonio es un pueblo sin electricidad accesible solo en 4x4, ideal para acampar.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Bus (CUTCSA, COT)', detail: 'Red extensa y fiable', price: '5-25 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Ene', level: 'great' }, { name: 'Feb', level: 'great' }, { name: 'Mar', level: 'great' },
        { name: 'Abr', level: 'good' }, { name: 'May', level: 'ok' }, { name: 'Jun', level: 'bad' },
        { name: 'Jul', level: 'bad' }, { name: 'Ago', level: 'bad' }, { name: 'Sep', level: 'ok' },
        { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'great' }, { name: 'Dic', level: 'great' },
      ]},
      { type: 'text', text: 'Noviembre a marzo: ideal. El invierno (junio-agosto) es fresco (5-15°C) pero no riguroso.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'El mate es la religión nacional. Los uruguayos pasean con su termo y su mate a todas partes. El asado del domingo es sagrado. El país es relajado y progresista. El tango (candombe) es tan importante como en Argentina.' },
    ]},
  },
  // ==================== VIETNAM ====================
  VN: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'El autostop no es un concepto formal en Vietnam. No hay ley en contra pero la práctica no existe culturalmente. Los vietnamitas que paran no siempre entienden que es gratis.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Vietnam es un caso particular. El autostop clásico (pulgar levantado) no funciona porque el concepto no existe. Pero los vietnamitas son naturalmente serviciales y te propondrán ayuda si pareces perdido. Muchos viajeros recorren Vietnam en moto (Easy Rider) en vez de hacer dedo.' },
      { type: 'rule', icon: '🏍️', text: 'Los moto-taxis (xe ôm) paran constantemente. Aclara que es gratis si alguien para.' },
      { type: 'rule', icon: '🚛', text: 'Los camiones en la Highway 1 a veces llevan pasajeros. Aborda a los conductores en las paradas.' },
      { type: 'text', text: 'El norte montañoso (Ha Giang, Sapa) es más fácil porque hay menos transporte público y la gente para naturalmente.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Vietnam es un país seguro para el autostop. Los vietnamitas son acogedores y curiosos con los viajeros.' },
      { type: 'sub', title: 'Usa SpotHitch para tu seguridad' },
      { type: 'rule', icon: '🛡️', text: 'Activa el Modo Guardián antes de cada viaje. Una persona de confianza sigue tu posición en tiempo real.' },
      { type: 'rule', icon: '🆘', text: 'Configura el modo SOS con tus contactos. Un toque activa una triple alerta (push, SMS, llamada).' },
      { type: 'rule', icon: '📱', text: 'Fotografía la matrícula y envíala a alguien antes de subir.' },
      { type: 'rule', icon: '🎒', text: 'Mantén tu mochila accesible (en tu regazo o a tus pies), nunca en el maletero.' },
      { type: 'sub', title: 'Consejos del país' },
      { type: 'rule', icon: '⛽', text: 'Las estaciones de servicio son los mejores spots para los trayectos largos. Los camioneros hacen paradas frecuentes allí.' },
      { type: 'rule', icon: '🏍️', text: 'El tráfico es caótico en la ciudad. Para el autostop, sal de la ciudad y colócate en las carreteras nacionales.' },
      { type: 'sub', title: 'Números de emergencia' },
      { type: 'kv', items: [{ k: 'Policía', v: '113' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Vietnam es seguro para mujeres que viajan solas. El acoso es raro. Las vietnamitas son independientes y respetadas en la sociedad.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'El vietnamita es el idioma único. 6 tonos hacen la pronunciación muy difícil. El inglés progresa entre los jóvenes en las grandes ciudades pero sigue muy limitado en zona rural. El francés lo entienden algunos ancianos.' },
      { type: 'phrase', items: [
        { local: 'Xin chào', meaning: 'Hola' },
        { local: 'Cảm ơn', meaning: 'Gracias' },
        { local: 'Đi... được không?', meaning: '¿Ir a... posible?' },
        { local: 'Miễn phí', meaning: 'Gratis' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Vietnam es muy barato. Presupuesto ajustado: 10-20 €/día incluso sin autostop. El phở callejero cuesta 1-2 €.' },
      { type: 'kv', items: [
        { k: 'Phở / Bánh mì', v: '20.000-40.000 VND (0,80-1,60 €)' },
        { k: 'Hostel', v: '100.000-200.000 VND (4-8 €)' },
        { k: 'Bus Sleeper (larga distancia)', v: '100.000-300.000 VND (4-12 €)' },
        { k: 'Bia hơi (cerveza fresca)', v: '5.000-10.000 VND (0,20-0,40 €)' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'La acampada libre es posible en las montañas del norte. Los nhà nghỉ (guesthouses) son tan baratos (3-5 €) que acampar no es necesario. Las familias en los pueblos de montaña a veces acogen viajeros.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Bus Sleeper', detail: 'Buses cama de larga distancia, red extensa', price: '4-15 €' },
        { emoji: '🚂', name: 'Reunification Express', detail: 'Tren Hanói-HCMC (30h). Lento pero panorámico.', price: '15-40 €' },
        { emoji: '🏍️', name: 'Moto', detail: 'Muchos mochileros compran una moto (300-500 $) y la revenden al final del viaje.', price: '' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Ene', level: 'ok' }, { name: 'Feb', level: 'good' }, { name: 'Mar', level: 'great' },
        { name: 'Abr', level: 'great' }, { name: 'May', level: 'good' }, { name: 'Jun', level: 'ok' },
        { name: 'Jul', level: 'ok' }, { name: 'Ago', level: 'bad' }, { name: 'Sep', level: 'bad' },
        { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'great' }, { name: 'Dic', level: 'good' },
      ]},
      { type: 'text', text: 'Vietnam se extiende 1.650 km: el norte tiene estaciones (frío en invierno), el centro tiene tifones (septiembre-noviembre), el sur es tropical (seco diciembre-abril). Marzo-mayo: bueno para todo el país.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Los vietnamitas son curiosos, sonrientes y acogedores. El café (cà phê sữa đá = café helado con leche condensada) es una institución. La comida callejera está entre las mejores del mundo. Los vietnamitas adoran invitar a los extranjeros a brindar (un, hai, ba, dzô! = 1, 2, 3, ¡salud!).' },
      { type: 'event', items: [
        { month: 'Ene-Feb', day: '⟳', name: 'Tết (Año Nuevo lunar)', desc: 'La mayor fiesta. El país cierra durante una semana. Transporte caótico antes/después.' },
      ]},
    ]},
  },
  // ==================== LAOS ====================
  LA: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'El autostop no está regulado en Laos. El concepto es desconocido pero el transporte informal (subirse a camiones, pickups) es habitual en las zonas rurales.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Laos es un país tranquilo donde el autostop informal funciona. El tráfico es bajo (Laos está poco motorizado) pero los conductores paran fácilmente. Tiempo de espera: 20 min-1h+. En las zonas remotas, el tráfico puede ser casi nulo.' },
      { type: 'rule', icon: '🛻', text: 'Los pickups y los camiones son los vehículos más habituales en las carreteras rurales.' },
      { type: 'text', text: 'Los sǎwngthǎew (camiones-bus con bancos atrás) paran en todas partes y cuestan casi nada. Es un "autostop de pago" muy barato.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Laos es un país seguro para el autostop. Los laotianos son tranquilos y acogedores.' },
      { type: 'sub', title: 'Usa SpotHitch para tu seguridad' },
      { type: 'rule', icon: '🛡️', text: 'Activa el Modo Guardián antes de cada viaje. Una persona de confianza sigue tu posición en tiempo real.' },
      { type: 'rule', icon: '🆘', text: 'Configura el modo SOS con tus contactos. Un toque activa una triple alerta (push, SMS, llamada).' },
      { type: 'rule', icon: '📱', text: 'Fotografía la matrícula y envíala a alguien antes de subir.' },
      { type: 'rule', icon: '🎒', text: 'Mantén tu mochila accesible (en tu regazo o a tus pies), nunca en el maletero.' },
      { type: 'sub', title: 'Consejos del país' },
      { type: 'rule', icon: '🏔️', text: 'Las carreteras de montaña están a veces en mal estado. Prevé trayectos más largos de lo esperado.' },
      { type: 'rule', icon: '🤝', text: 'Los laotianos son acogedores y los conductores paran fácilmente para los viajeros.' },
      { type: 'sub', title: 'Números de emergencia' },
      { type: 'kv', items: [{ k: 'Policía', v: '191' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Laos es seguro para mujeres que viajan solas. La cultura budista es respetuosa. Los incidentes son muy raros.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'El lao es el idioma oficial (muy cercano al tailandés, mutuamente inteligible). El inglés es muy limitado. El francés lo entienden algunos ancianos (ex colonia francesa).' },
      { type: 'phrase', items: [
        { local: 'Sabaidee', meaning: 'Hola' },
        { local: 'Khop chai', meaning: 'Gracias' },
        { local: 'Pai... dai bor?', meaning: '¿Ir a... posible?' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Laos es muy barato. Presupuesto ajustado: 10-20 €/día. El sticky rice (arroz glutinoso) con laap (ensalada de carne) cuesta menos de 1 €.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'La acampada libre es posible pero cuidado con los UXO. Las guesthouses son muy baratas (3-8 €). Los templos a veces acogen viajeros.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚐', name: 'Sǎwngthǎew', detail: 'Camiones con bancos. Principal transporte rural.', price: '1-5 €' },
        { emoji: '🚌', name: 'Bus VIP', detail: 'Larga distancia, red en desarrollo', price: '5-15 €' },
        { emoji: '🛥️', name: 'Slow Boat', detail: 'Barco por el Mekong (Luang Prabang-Huay Xai, 2 días)', price: '15-25 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Ene', level: 'great' }, { name: 'Feb', level: 'great' }, { name: 'Mar', level: 'good' },
        { name: 'Abr', level: 'ok' }, { name: 'May', level: 'ok' }, { name: 'Jun', level: 'ok' },
        { name: 'Jul', level: 'bad' }, { name: 'Ago', level: 'bad' }, { name: 'Sep', level: 'bad' },
        { name: 'Oct', level: 'ok' }, { name: 'Nov', level: 'great' }, { name: 'Dic', level: 'great' },
      ]},
      { type: 'text', text: 'Noviembre a febrero: ideal (fresco y seco). Marzo-mayo: muy caluroso. Junio-octubre: monzón (carreteras inundadas, algunas cortadas).' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Laos es el país más relajado del Sudeste Asiático. "Bor pen nyang" (sin problema) es el mantra nacional. El budismo Theravada impregna la cultura. La ofrenda matinal a los monjes (tak bat) en Luang Prabang es un momento sagrado.' },
    ]},
  },
  // ==================== CAMBODIA ====================
  KH: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'El autostop no está regulado en Camboya. El concepto no existe formalmente pero el transporte informal es habitual. Los conductores paran fácilmente si haces señas.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Camboya funciona en autostop informal. Los pickups, camiones y motos paran fácilmente. Muchos conductores esperan un pequeño pago (transporte informal). Aclara. La red de buses es limitada en las zonas rurales.' },
      { type: 'text', text: 'Las carreteras principales (Phnom Penh-Siem Reap, Phnom Penh-Sihanoukville) tienen tráfico. Las carreteras secundarias suelen estar en mal estado.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Camboya es un país seguro para el autostop. Los camboyanos son acogedores y sonrientes.' },
      { type: 'sub', title: 'Usa SpotHitch para tu seguridad' },
      { type: 'rule', icon: '🛡️', text: 'Activa el Modo Guardián antes de cada viaje. Una persona de confianza sigue tu posición en tiempo real.' },
      { type: 'rule', icon: '🆘', text: 'Configura el modo SOS con tus contactos. Un toque activa una triple alerta (push, SMS, llamada).' },
      { type: 'rule', icon: '📱', text: 'Fotografía la matrícula y envíala a alguien antes de subir.' },
      { type: 'rule', icon: '🎒', text: 'Mantén tu mochila accesible (en tu regazo o a tus pies), nunca en el maletero.' },
      { type: 'sub', title: 'Consejos del país' },
      { type: 'rule', icon: '🛣️', text: 'Las carreteras principales (Nom Pen a Siem Reap, Nom Pen a Sihanoukville) están en buen estado y bien transitadas.' },
      { type: 'rule', icon: '😊', text: 'Los camboyanos son acogedores. Una sonrisa es universal, incluso sin hablar el idioma.' },
      { type: 'sub', title: 'Números de emergencia' },
      { type: 'kv', items: [{ k: 'Policía', v: '117' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Camboya es globalmente segura para mujeres que viajan solas. La sociedad es respetuosa. Evita las zonas de fiesta (Sihanoukville) de noche.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'El jemer es el idioma oficial. El inglés está extendido en las zonas turísticas (Siem Reap, Phnom Penh). El francés lo entienden algunos ancianos.' },
      { type: 'phrase', items: [
        { local: 'Sok sabay', meaning: 'Hola / ¿Qué tal?' },
        { local: 'Aw kun', meaning: 'Gracias' },
        { local: 'Tov... baan te?', meaning: '¿Ir a... posible?' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Camboya es muy barata. Presupuesto ajustado: 10-20 $/día. El dólar americano es la moneda de facto (el riel se usa para el cambio pequeño).' },
      { type: 'kv', items: [
        { k: 'Comida local', v: '1-3 $' },
        { k: 'Hostel', v: '3-8 $/noche' },
        { k: 'Cerveza Angkor', v: '0,50 $ (happy hour)' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Las guesthouses son tan baratas (3-5 $) que acampar no es necesario. La acampada libre es posible en las zonas rurales.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Bus', detail: 'Red en desarrollo. Giant Ibis y Mekong Express son fiables.', price: '5-15 $' },
        { emoji: '🛥️', name: 'Barco', detail: 'Phnom Penh-Siem Reap por el Tonlé Sap', price: '25-35 $' },
        { emoji: '🛺', name: 'Tuk-tuk', detail: 'Transporte local omnipresente', price: '1-5 $' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Ene', level: 'great' }, { name: 'Feb', level: 'great' }, { name: 'Mar', level: 'good' },
        { name: 'Abr', level: 'ok' }, { name: 'May', level: 'ok' }, { name: 'Jun', level: 'ok' },
        { name: 'Jul', level: 'ok' }, { name: 'Ago', level: 'bad' }, { name: 'Sep', level: 'bad' },
        { name: 'Oct', level: 'ok' }, { name: 'Nov', level: 'great' }, { name: 'Dic', level: 'great' },
      ]},
      { type: 'text', text: 'Noviembre a febrero: ideal (fresco y seco). Marzo-mayo: muy caluroso (38°C+). Junio-octubre: monzón (carreteras inundadas en zonas rurales).' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Los camboyanos son sonrientes y resilientes a pesar de la trágica historia (Jemeres Rojos). Angkor Wat es un orgullo nacional. Los conductores son curiosos y acogedores. Nunca hables de política o de los Jemeres Rojos a la ligera.' },
    ]},
  },
  // ==================== NEPAL ====================
  NP: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'El autostop no está regulado en Nepal. El transporte informal (subirse a los techos de buses, a camiones) es un modo de vida normal en las zonas de montaña.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Nepal es fácil para el autostop informal. Los camiones y pickups paran fácilmente. En montaña, el tráfico es bajo pero todo el mundo para. Los nepalíes son extremadamente acogedores.' },
      { type: 'rule', icon: '🚛', text: 'Los camiones Tata en las carreteras de montaña llevan pasajeros (a menudo a cambio de un pequeño pago). Aclara antes.' },
      { type: 'rule', icon: '🏔️', text: 'En las regiones de trekking (Annapurna, Everest), el transporte es en jeep o a pie. No hay autostop tradicional.' },
      { type: 'text', text: 'El valle de Katmandú y las carreteras del Terai (llanura del sur) tienen más tráfico. La carretera Katmandú-Pokhara es la más frecuentada.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Nepal es un país seguro para el autostop. Los nepalíes son acogedores y serviciales.' },
      { type: 'sub', title: 'Usa SpotHitch para tu seguridad' },
      { type: 'rule', icon: '🛡️', text: 'Activa el Modo Guardián antes de cada viaje. Una persona de confianza sigue tu posición en tiempo real.' },
      { type: 'rule', icon: '🆘', text: 'Configura el modo SOS con tus contactos. Un toque activa una triple alerta (push, SMS, llamada).' },
      { type: 'rule', icon: '📱', text: 'Fotografía la matrícula y envíala a alguien antes de subir.' },
      { type: 'rule', icon: '🎒', text: 'Mantén tu mochila accesible (en tu regazo o a tus pies), nunca en el maletero.' },
      { type: 'sub', title: 'Consejos del país' },
      { type: 'rule', icon: '🏔️', text: 'Las carreteras de montaña son el principal riesgo (precipicios, sin guardarraíl). Abróchate el cinturón.' },
      { type: 'rule', icon: '🙏', text: 'Los nepalíes son acogedores. Un "namaste" (manos juntas) abre todas las puertas.' },
      { type: 'sub', title: 'Números de emergencia' },
      { type: 'kv', items: [{ k: 'Emergencias', v: '100' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Nepal se considera seguro para mujeres que viajan solas. Los nepalíes son respetuosos. Algunos casos de acoso en zona rural pero globalmente positivo.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'El nepalí es el idioma oficial. El inglés está bastante extendido en las zonas turísticas (Katmandú, Pokhara, regiones de trekking). Los guías de trekking hablan inglés.' },
      { type: 'phrase', items: [
        { local: 'Namaste', meaning: 'Hola (manos juntas ante el pecho)' },
        { local: 'Dhanyabad', meaning: 'Gracias' },
        { local: 'Kati paisa?', meaning: '¿Cuánto cuesta?' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Nepal es muy barato. Presupuesto ajustado: 10-20 €/día. El dhal bhat (arroz y lentejas) es el plato nacional: 1-2 €, a voluntad en muchos restaurantes.' },
      { type: 'kv', items: [
        { k: 'Dhal bhat', v: '200-500 NPR (1-3 €)' },
        { k: 'Guesthouse', v: '300-1.000 NPR (2-7 €)' },
        { k: 'Bus local', v: '100-500 NPR (0,70-3 €)' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'La acampada libre es posible en las zonas de montaña. Los tea houses en los circuitos de trekking ofrecen alojamiento y comida baratos. Las guesthouses en la ciudad son muy asequibles.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Bus local / Tourist Bus', detail: 'Los buses locales van llenos pero son baratos. Los tourist bus son más cómodos.', price: '2-15 €' },
        { emoji: '🛩️', name: 'Vuelo interior', detail: 'Necesario para Lukla (Everest). Vistas espectaculares.', price: '100-200 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Ene', level: 'ok' }, { name: 'Feb', level: 'good' }, { name: 'Mar', level: 'great' },
        { name: 'Abr', level: 'great' }, { name: 'May', level: 'good' }, { name: 'Jun', level: 'bad' },
        { name: 'Jul', level: 'bad' }, { name: 'Ago', level: 'bad' }, { name: 'Sep', level: 'ok' },
        { name: 'Oct', level: 'great' }, { name: 'Nov', level: 'great' }, { name: 'Dic', level: 'good' },
      ]},
      { type: 'text', text: 'Octubre-noviembre: ideal (cielo despejado, vistas del Himalaya). Marzo-mayo: también bueno (rododendros en flor). Junio-septiembre: monzón (carreteras cortadas, sanguijuelas en montaña).' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Nepal es una mezcla única de hinduismo y budismo. Los nepalíes están entre la gente más sonriente del mundo. El dhal bhat es "la energía": dos veces al día, a voluntad. El trekking es una industria nacional y los guías son de una amabilidad notable.' },
      { type: 'event', items: [
        { month: 'Oct', day: '⟳', name: 'Dashain', desc: 'La mayor fiesta nepalí (15 días). Cometas, familias reunidas. Transporte muy cargado.' },
      ]},
    ]},
  },
  // ==================== KAZAKHSTAN ====================
  KZ: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'El autostop es legal en Kazajistán. Sin restricciones. El transporte informal es habitual porque el país es inmenso (9° más grande del mundo) y los transportes públicos son limitados entre ciudades.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Kazajistán es bueno para el autostop. Las distancias son inmensas (Almaty-Astaná: 1.200 km) pero los conductores hacen largas distancias. Tiempo de espera: 15-45 min en las carreteras principales. En zona rural, el tráfico es muy bajo.' },
      { type: 'rule', icon: '🚛', text: 'Los camiones son los mejores para largas distancias. Aborda a los conductores en las gasolineras.' },
      { type: 'rule', icon: '💰', text: 'Muchos conductores esperan un pago (transporte informal habitual). Aclara "besplatno" (gratis) antes de subir.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Kazajistán es un país seguro para el autostop. Las distancias son inmensas, así que prevé agua y provisiones.' },
      { type: 'sub', title: 'Usa SpotHitch para tu seguridad' },
      { type: 'rule', icon: '🛡️', text: 'Activa el Modo Guardián antes de cada viaje. Una persona de confianza sigue tu posición en tiempo real.' },
      { type: 'rule', icon: '🆘', text: 'Configura el modo SOS con tus contactos. Un toque activa una triple alerta (push, SMS, llamada).' },
      { type: 'rule', icon: '📱', text: 'Fotografía la matrícula y envíala a alguien antes de subir.' },
      { type: 'rule', icon: '🎒', text: 'Mantén tu mochila accesible (en tu regazo o a tus pies), nunca en el maletero.' },
      { type: 'sub', title: 'Consejos del país' },
      { type: 'rule', icon: '🗺️', text: 'Las distancias son inmensas y las gasolineras escasas en zona rural. Lleva agua, comida y un cargador.' },
      { type: 'rule', icon: '📋', text: 'Lleva siempre tu pasaporte encima. Los controles de policía son frecuentes pero amistosos.' },
      { type: 'sub', title: 'Números de emergencia' },
      { type: 'kv', items: [{ k: 'Emergencias', v: '112' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Kazajistán es relativamente seguro para las mujeres. La sociedad es más laica que los vecinos de Asia Central. Se recomienda viajar en pareja en las zonas rurales aisladas.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'El kazajo y el ruso son los dos idiomas oficiales. El ruso lo habla casi todo el mundo. El inglés es muy raro. El ruso es indispensable.' },
      { type: 'phrase', items: [
        { local: 'Salam', meaning: 'Hola (kazajo)' },
        { local: 'Rakhmet / Spasibo', meaning: 'Gracias (kazajo / ruso)' },
        { local: 'Besplatno', meaning: 'Gratis (ruso)' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Kazajistán es moderadamente caro para Asia Central. Presupuesto ajustado: 15-25 €/día. Los bazares son baratos para la comida.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'La acampada libre es fácil en las estepas infinitas (nadie te molestará). Las yurtas de los nómadas a veces están abiertas a los viajeros. En la ciudad, los hostels son baratos.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚂', name: 'Tren', detail: 'Red soviética extensa, trenes nocturnos', price: '10-30 €' },
        { emoji: '🚌', name: 'Bus', detail: 'Entre las grandes ciudades', price: '5-20 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Ene', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mar', level: 'ok' },
        { name: 'Abr', level: 'good' }, { name: 'May', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'good' }, { name: 'Ago', level: 'good' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'ok' }, { name: 'Dic', level: 'bad' },
      ]},
      { type: 'text', text: 'Mayo-junio y septiembre: ideal. El verano es caluroso en las estepas (40°C+). El invierno es extremo (hasta -40°C en Astaná). La primavera ve las estepas florecer.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Kazajistán mezcla cultura nómada y modernidad. El kumis (leche de yegua fermentada) y el beshbarmak (carne con pasta) son los platos tradicionales. La hospitalidad nómada (ofrecer té, comida, una cama) está profundamente arraigada.' },
    ]},
  },
  // ==================== KYRGYZSTAN ====================
  KG: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'El autostop es legal en Kirguistán. Práctica muy habitual. El país es montañoso y los transportes públicos limitados. El transporte informal es un modo de vida.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Kirguistán es uno de los mejores países de Asia Central para el autostop. Los kirguises son acogedores y curiosos. Tiempo de espera: 10-30 min en las carreteras principales. En montaña, el tráfico es bajo pero todo el mundo para.' },
      { type: 'text', text: 'La carretera Biskek-Osh (por el paso de Teo-Ashuu a 3.500m) es un clásico. El circuito del lago Issyk-Kul es fácil en verano.' },
      { type: 'rule', icon: '💰', text: 'Las marshrutkas (taxis colectivos) paran en todas partes. Aclara "besplatno" porque algunos conductores privados esperan un pago.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Kirguistán es un país seguro para el autostop. Los kirguises son acogedores y los paisajes son espectaculares.' },
      { type: 'sub', title: 'Usa SpotHitch para tu seguridad' },
      { type: 'rule', icon: '🛡️', text: 'Activa el Modo Guardián antes de cada viaje. Una persona de confianza sigue tu posición en tiempo real.' },
      { type: 'rule', icon: '🆘', text: 'Configura el modo SOS con tus contactos. Un toque activa una triple alerta (push, SMS, llamada).' },
      { type: 'rule', icon: '📱', text: 'Fotografía la matrícula y envíala a alguien antes de subir.' },
      { type: 'rule', icon: '🎒', text: 'Mantén tu mochila accesible (en tu regazo o a tus pies), nunca en el maletero.' },
      { type: 'sub', title: 'Consejos del país' },
      { type: 'rule', icon: '🏔️', text: 'Las carreteras de montaña son peligrosas (puertos a 3.000 m+, sin guardarraíl). Abróchate el cinturón.' },
      { type: 'rule', icon: '🌄', text: 'Los paisajes son espectaculares. Disfruta del trayecto y comparte momentos con los conductores kirguises.' },
      { type: 'sub', title: 'Números de emergencia' },
      { type: 'kv', items: [{ k: 'Emergencias', v: '103' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Kirguistán es moderadamente seguro para mujeres solas. El rapto de novias (ala kachuu) aún existe en zona rural (no contra extranjeras pero culturalmente perturbador). Las zonas turísticas son seguras.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'El kirguís y el ruso son los idiomas oficiales. El ruso se entiende en todas partes. El inglés es muy limitado. Un ruso básico es indispensable.' },
      { type: 'phrase', items: [
        { local: 'Salam', meaning: 'Hola (kirguís)' },
        { local: 'Rakhmat', meaning: 'Gracias (kirguís)' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Kirguistán es muy barato. Presupuesto ajustado: 10-20 €/día. El alojamiento en yurta vía CBT (Community Based Tourism): 10-15 €/noche con comida.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'La acampada libre es legal y fácil en las montañas y los jailoos (pastos de altitud). Las yurtas de los pastores a menudo acogen viajeros. La red CBT organiza estancias en yurtas auténticas.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚐', name: 'Marshrutka', detail: 'Minibuses entre ciudades, baratos', price: '1-5 €' },
        { emoji: '🚗', name: 'Taxi compartido', detail: 'Más rápido que el bus, espera estar lleno', price: '3-10 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Ene', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mar', level: 'ok' },
        { name: 'Abr', level: 'good' }, { name: 'May', level: 'good' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Ago', level: 'great' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'ok' }, { name: 'Dic', level: 'bad' },
      ]},
      { type: 'text', text: 'Junio a septiembre: ideal. Los pasos de montaña están abiertos. El verano en el lago Issyk-Kul es magnífico. El invierno cierra los pasos y el autostop se vuelve difícil.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'La cultura nómada kirguisa está viva. El kumis (leche de yegua) y el beshbarmak son las tradiciones culinarias. La hospitalidad es sagrada: rechazar el té es de mala educación. Los juegos ecuestres (kok-boru, caza con águila) son espectaculares.' },
    ]},
  },
  // ==================== UZBEKISTAN ====================
  UZ: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'El autostop es legal en Uzbekistán. El transporte informal es muy habitual. Muchos coches privados funcionan como taxis informales (sobre todo los Daewoo Matiz y Chevrolet Lacetti).' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Uzbekistán funciona en autostop semi-de pago. Levantar la mano al borde de la carretera para coches privados que hacen de taxi. Aclara "besplatno" (gratis) ANTES de subir. Tiempo de espera: 5-15 min en ciudad, 15-30 min entre ciudades.' },
      { type: 'text', text: 'La ruta de la Seda (Taskent-Samarcanda-Bujará-Jiva) está bien servida. Los taxis compartidos son tan baratos que hacen menos necesario el autostop gratuito.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Uzbekistán es seguro para el autostop. Los uzbekos son hospitalarios y curiosos con los viajeros.' },
      { type: 'sub', title: 'Usa SpotHitch para tu seguridad' },
      { type: 'rule', icon: '🛡️', text: 'Activa el Modo Guardián antes de cada viaje. Una persona de confianza sigue tu posición en tiempo real.' },
      { type: 'rule', icon: '🆘', text: 'Configura el modo SOS con tus contactos. Un toque activa una triple alerta (push, SMS, llamada).' },
      { type: 'rule', icon: '📱', text: 'Fotografía la matrícula y envíala a alguien antes de subir.' },
      { type: 'rule', icon: '🎒', text: 'Mantén tu mochila accesible (en tu regazo o a tus pies), nunca en el maletero.' },
      { type: 'sub', title: 'Consejos del país' },
      { type: 'rule', icon: '📋', text: 'Los controles de policía son frecuentes. Lleva siempre tu pasaporte y tu registro encima.' },
      { type: 'rule', icon: '🕌', text: 'Los uzbekos son hospitalarios. A menudo te ofrecerán un plato de plov o una taza de té. Acepta con gratitud.' },
      { type: 'sub', title: 'Números de emergencia' },
      { type: 'kv', items: [{ k: 'Emergencias', v: '101' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Uzbekistán es seguro para mujeres que viajan solas. La sociedad es conservadora pero respetuosa. Las viajeras reportan experiencias positivas.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'El uzbeko es el idioma oficial. El ruso está muy extendido (sobre todo en Taskent). El inglés está limitado a las zonas turísticas (Samarcanda, Bujará).' },
      { type: 'phrase', items: [
        { local: 'Assalomu alaykum', meaning: 'Hola (formal)' },
        { local: 'Rahmat', meaning: 'Gracias' },
        { local: 'Bepul', meaning: 'Gratis' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Uzbekistán es muy barato. Presupuesto ajustado: 10-20 €/día. El plov (arroz pilaf) es el plato nacional: 1-2 € en un chaikhana (salón de té).' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Los hostels y B&B son baratos (5-15 €). Los chaikhanas (salones de té) a veces permiten dormir en los tapchans (camas de reposo exteriores). La acampada libre es posible en las zonas rurales.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚂', name: 'Afrosiyob (AVE)', detail: 'Tren rápido Taskent-Samarcanda-Bujará', price: '5-15 €' },
        { emoji: '🚗', name: 'Taxi compartido', detail: 'Coches privados entre ciudades, espera estar lleno', price: '2-10 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Ene', level: 'bad' }, { name: 'Feb', level: 'ok' }, { name: 'Mar', level: 'good' },
        { name: 'Abr', level: 'great' }, { name: 'May', level: 'great' }, { name: 'Jun', level: 'ok' },
        { name: 'Jul', level: 'bad' }, { name: 'Ago', level: 'bad' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'great' }, { name: 'Nov', level: 'good' }, { name: 'Dic', level: 'ok' },
      ]},
      { type: 'text', text: 'Abril-mayo y septiembre-octubre: ideal (20-28°C). El verano es abrasador (45°C+). El invierno es frío en las montañas.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Uzbekistán es el corazón de la Ruta de la Seda. Samarcanda, Bujará y Jiva son maravillas arquitectónicas. La hospitalidad es sagrada. El plov del jueves es un evento social. Las bodas (a menudo 300+ invitados) son ocasiones de fiesta y los extranjeros a veces son invitados espontáneamente.' },
    ]},
  },
  // ==================== JORDAN ====================
  JO: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'El autostop es legal en Jordania. Práctica habitual. Los jordanos están entre los pueblos más hospitalarios de Oriente Medio. El país es pequeño (450 km de norte a sur) y seguro.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Jordania es excelente para el autostop. Los jordanos paran muy fácilmente y sienten curiosidad por los extranjeros. Tiempo de espera: 5-15 min. Muchos conductores rechazan el dinero e insisten en invitarte a comer.' },
      { type: 'kv', items: [
        { k: 'King\'s Highway (carretera de los reyes)', v: 'Magnífica, buen tráfico', color: 'green' },
        { k: 'Ammán-Aqaba', v: 'Tráfico denso, fácil', color: 'green' },
        { k: 'Wadi Rum-Aqaba', v: 'Poco tráfico pero todo para', color: 'amber' },
      ]},
      { type: 'tip', text: '💡 Los jordanos a menudo dan su número de teléfono e insisten en ayudarte durante toda tu estancia.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Jordania es un país seguro y hospitalario para el autostop. Los jordanos son acogedores con los viajeros.' },
      { type: 'sub', title: 'Usa SpotHitch para tu seguridad' },
      { type: 'rule', icon: '🛡️', text: 'Activa el Modo Guardián antes de cada viaje. Una persona de confianza sigue tu posición en tiempo real.' },
      { type: 'rule', icon: '🆘', text: 'Configura el modo SOS con tus contactos. Un toque activa una triple alerta (push, SMS, llamada).' },
      { type: 'rule', icon: '📱', text: 'Fotografía la matrícula y envíala a alguien antes de subir.' },
      { type: 'rule', icon: '🎒', text: 'Mantén tu mochila accesible (en tu regazo o a tus pies), nunca en el maletero.' },
      { type: 'sub', title: 'Consejos del país' },
      { type: 'rule', icon: '🤝', text: 'Los jordanos son muy hospitalarios. Te ofrecerán té, comida e incluso alojamiento. Acepta con gratitud.' },
      { type: 'rule', icon: '🏜️', text: 'El país es compacto y las carreteras están en buen estado. El Wadi Rum y Petra son fácilmente accesibles.' },
      { type: 'sub', title: 'Números de emergencia' },
      { type: 'kv', items: [{ k: 'Emergencias', v: '911' }] },
    ]},
    women: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'Jordania es relativamente segura para las mujeres. La hospitalidad jordana se aplica a todos. Viste de forma conservadora (sobre todo fuera de Ammán). Algunas miradas insistentes pero los incidentes son raros.' },
      { type: 'rule', icon: '👕', text: 'Ropa que cubra hombros y rodillas, sobre todo en zona rural.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'El árabe jordano es el idioma principal. El inglés está muy extendido, sobre todo en Ammán y las zonas turísticas. Muchos jordanos hablan inglés con fluidez.' },
      { type: 'phrase', items: [
        { local: 'Marhaba / Ahlan', meaning: 'Hola / Bienvenido' },
        { local: 'Shukran', meaning: 'Gracias' },
        { local: 'Inshallah', meaning: 'Si Dios quiere (se usa constantemente)' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Jordania es moderadamente cara. Presupuesto ajustado: 20-35 €/día. El Jordan Pass (70+ JOD) incluye Petra y el visado.' },
      { type: 'kv', items: [
        { k: 'Falafel / shawarma', v: '0,50-1,50 JOD (0,70-2 €)' },
        { k: 'Hostel', v: '8-20 JOD (10-25 €)' },
        { k: 'Petra (entrada)', v: '50 JOD (70 €) o incluido en el Jordan Pass' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'La acampada libre es posible en el Wadi Rum (experiencia inolvidable bajo las estrellas) y en zonas rurales. Los beduinos a menudo invitan a los viajeros bajo su tienda para el té y a veces la noche.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'JETT Bus', detail: 'Buses de larga distancia fiables', price: '3-10 JOD' },
        { emoji: '🚐', name: 'Minibús', detail: 'Transporte local entre ciudades, esperan estar llenos', price: '0,50-3 JOD' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Ene', level: 'ok' }, { name: 'Feb', level: 'good' }, { name: 'Mar', level: 'great' },
        { name: 'Abr', level: 'great' }, { name: 'May', level: 'great' }, { name: 'Jun', level: 'ok' },
        { name: 'Jul', level: 'bad' }, { name: 'Ago', level: 'bad' }, { name: 'Sep', level: 'ok' },
        { name: 'Oct', level: 'great' }, { name: 'Nov', level: 'great' }, { name: 'Dic', level: 'ok' },
      ]},
      { type: 'text', text: 'Marzo-mayo y octubre-noviembre: ideal (20-28°C). El verano es abrasador (35-45°C, sobre todo Aqaba y Wadi Rum). El invierno es fresco y lluvioso en Ammán.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'La hospitalidad jordana es excepcional. El "Ahlan wa sahlan" (bienvenido) es sincero. Los beduinos en el Wadi Rum ofrecen té (chai), mansaf (plato nacional con yogur) e historias. Rechazar la invitación es de mala educación. Petra es una maravilla del mundo.' },
    ]},
  },
  // ==================== OMAN ====================
  OM: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'El autostop es legal en Omán. El concepto es poco formalizado pero levantar la mano al borde de la carretera funciona muy bien. Los omaníes son naturalmente serviciales.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Omán es excelente para el autostop. Los omaníes son extremadamente acogedores y paran muy fácilmente. Tiempo de espera: 5-15 min en las carreteras principales. En zona rural (wadis, montañas), el tráfico es bajo pero todo el mundo para.' },
      { type: 'text', text: 'Los conductores hacen desvíos importantes para ayudarte, ofrecen la comida y a veces el alojamiento. El autostop es casi demasiado fácil: los coches paran antes de que levantes el pulgar.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Omán es uno de los países más seguros del mundo. La tasa de criminalidad es casi nula.' },
      { type: 'sub', title: 'Usa SpotHitch para tu seguridad' },
      { type: 'rule', icon: '🛡️', text: 'Activa el Modo Guardián antes de cada viaje. Una persona de confianza sigue tu posición en tiempo real.' },
      { type: 'rule', icon: '🆘', text: 'Configura el modo SOS con tus contactos. Un toque activa una triple alerta (push, SMS, llamada).' },
      { type: 'rule', icon: '📱', text: 'Fotografía la matrícula y envíala a alguien antes de subir.' },
      { type: 'rule', icon: '🎒', text: 'Mantén tu mochila accesible (en tu regazo o a tus pies), nunca en el maletero.' },
      { type: 'sub', title: 'Consejos del país' },
      { type: 'rule', icon: '🏜️', text: 'Las distancias son largas y el calor intenso. Lleva siempre agua en abundancia y protección solar.' },
      { type: 'rule', icon: '🤝', text: 'Los omaníes son hospitalarios y educados. Respeta las costumbres locales y viste con modestia.' },
      { type: 'sub', title: 'Números de emergencia' },
      { type: 'kv', items: [{ k: 'Emergencias', v: '9999' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Omán es seguro para mujeres que viajan solas. La sociedad es conservadora pero respetuosa. Viste de forma modesta (hombros y rodillas cubiertos). Los omaníes son corteses y el acoso es raro.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'El árabe omaní es el idioma principal. El inglés se habla ampliamente, sobre todo en Mascate y las zonas turísticas. Sin barrera lingüística mayor.' },
      { type: 'phrase', items: [
        { local: 'As-salaam alaikum', meaning: 'La paz sea contigo (saludo universal)' },
        { local: 'Shukran jazeelan', meaning: 'Muchas gracias' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Omán es moderadamente caro. Presupuesto ajustado: 25-40 €/día. La gasolina es muy barata. Los restaurantes omaníes tradicionales son asequibles.' },
      { type: 'kv', items: [
        { k: 'Comida local', v: '1-3 OMR (2,50-7,50 €)' },
        { k: 'Hostel', v: '5-15 OMR (12-37 €)' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'La acampada libre es legal y popular en Omán. Los wadis (valles) y las playas son spots magníficos. Muchos omaníes acampan ellos mismos los fines de semana. El cielo estrellado en el desierto es espectacular.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Mwasalat (bus)', detail: 'Red de buses en expansión, principal transporte público', price: '0,50-5 OMR' },
        { emoji: '🚗', name: 'Alquiler de coche', detail: 'A menudo la mejor opción para explorar los wadis y montañas', price: '10-20 OMR/día' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Ene', level: 'great' }, { name: 'Feb', level: 'great' }, { name: 'Mar', level: 'great' },
        { name: 'Abr', level: 'good' }, { name: 'May', level: 'ok' }, { name: 'Jun', level: 'bad' },
        { name: 'Jul', level: 'bad' }, { name: 'Ago', level: 'bad' }, { name: 'Sep', level: 'ok' },
        { name: 'Oct', level: 'great' }, { name: 'Nov', level: 'great' }, { name: 'Dic', level: 'great' },
      ]},
      { type: 'text', text: 'Octubre a marzo: ideal (25-30°C). El verano es abrasador (45°C+) y el autostop está desaconsejado. El Dhofar (Salalah) tiene una temporada de monzón única (khareef) en verano: verde y fresco.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Omán es un país refinado y acogedor. El café omaní (qahwa) y los dátiles se ofrecen en cada encuentro. El país está orgulloso de su tolerancia (mezquitas, iglesias y templos coexisten). El incienso (frankincense) es un regalo tradicional. Los omaníes en dishdasha blanco y kumma son elegantes y corteses.' },
    ]},
  },
  // ==================== SENEGAL ====================
  SN: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'El autostop es legal en Senegal. El concepto de "teranga" (hospitalidad) hace que los conductores paren naturalmente. El transporte informal es el modo principal en zona rural.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Senegal es bueno para el autostop gracias a la teranga (hospitalidad legendaria). Los conductores paran fácilmente. Mucho transporte es informal: los "sept-places" (taxis colectivos) y los ndiaga ndiaye (minibuses) paran en todas partes.' },
      { type: 'rule', icon: '🚛', text: 'Los camiones llevan pasajeros en largas distancias (Dakar-Saint-Louis, Dakar-Ziguinchor).' },
      { type: 'rule', icon: '💰', text: 'Muchos conductores esperan un pago. Aclara antes de subir. La distinción autostop gratis / transporte de pago es difusa.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Senegal es un país seguro para el autostop. Los senegaleses son conocidos por su hospitalidad.' },
      { type: 'sub', title: 'Usa SpotHitch para tu seguridad' },
      { type: 'rule', icon: '🛡️', text: 'Activa el Modo Guardián antes de cada viaje. Una persona de confianza sigue tu posición en tiempo real.' },
      { type: 'rule', icon: '🆘', text: 'Configura el modo SOS con tus contactos. Un toque activa una triple alerta (push, SMS, llamada).' },
      { type: 'rule', icon: '📱', text: 'Fotografía la matrícula y envíala a alguien antes de subir.' },
      { type: 'rule', icon: '🎒', text: 'Mantén tu mochila accesible (en tu regazo o a tus pies), nunca en el maletero.' },
      { type: 'sub', title: 'Consejos del país' },
      { type: 'rule', icon: '🤝', text: 'Los senegaleses son conocidos por su teranga (hospitalidad). Les encanta compartir un ataya (té) con los viajeros.' },
      { type: 'rule', icon: '☀️', text: 'Protégete del sol: sombrero, crema solar y agua permanentemente. El calor es intenso.' },
      { type: 'sub', title: 'Números de emergencia' },
      { type: 'kv', items: [{ k: 'Policía', v: '17' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Senegal es relativamente seguro para las mujeres pero el acoso callejero existe, sobre todo en Dakar. La teranga protege a las viajeras. Viste de forma modesta en zona rural.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'El francés es el idioma oficial y casi todo el mundo lo habla. El wolof es el idioma local más extendido. Los francófonos no tienen barrera lingüística.' },
      { type: 'phrase', items: [
        { local: 'Nanga def?', meaning: '¿Cómo estás? (wolof)' },
        { local: 'Jërëjëf', meaning: 'Gracias (wolof)' },
        { local: 'Inshallah', meaning: 'Si Dios quiere' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Senegal es moderadamente caro para África Occidental. Presupuesto ajustado: 15-25 €/día. El thiéboudienne (arroz con pescado) es el plato nacional.' },
      { type: 'kv', items: [
        { k: 'Comida local', v: '500-1.500 CFA (0,75-2,30 €)' },
        { k: 'Albergue', v: '5.000-15.000 CFA (7-23 €)' },
        { k: 'Sept-place (100 km)', v: '2.000-4.000 CFA (3-6 €)' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'La acampada libre es posible en las playas y en la sabana. Los campements (guesthouses rurales) son baratos y acogedores. Los senegaleses invitan fácilmente a los viajeros a su casa.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚐', name: 'Sept-place / Ndiaga Ndiaye', detail: 'Taxis colectivos y minibuses, red extensa', price: '1-6 €' },
        { emoji: '🚂', name: 'TER Dakar', detail: 'Tren expreso reciente Dakar-AIBD', price: '1-3 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Ene', level: 'great' }, { name: 'Feb', level: 'great' }, { name: 'Mar', level: 'great' },
        { name: 'Abr', level: 'good' }, { name: 'May', level: 'ok' }, { name: 'Jun', level: 'ok' },
        { name: 'Jul', level: 'bad' }, { name: 'Ago', level: 'bad' }, { name: 'Sep', level: 'bad' },
        { name: 'Oct', level: 'ok' }, { name: 'Nov', level: 'great' }, { name: 'Dic', level: 'great' },
      ]},
      { type: 'text', text: 'Noviembre a mayo: temporada seca, ideal. Julio-octubre: temporada de lluvias (hivernage), carreteras inundadas en zona rural.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'La teranga (hospitalidad) es el alma de Senegal. El té de menta (ataya) en tres servicios es un ritual social imprescindible. El thiéboudienne es un plato comunitario compartido en un gran cuenco. La música (mbalax, Youssou N\'Dour) marca el ritmo de la vida cotidiana.' },
    ]},
  },
  // ==================== NAMIBIA ====================
  NA: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'El autostop es legal en Namibia. Práctica habitual porque el país es inmenso y los transportes públicos casi inexistentes fuera de las líneas principales.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Namibia es factible en autostop pero las distancias son inmensas y el tráfico muy bajo. El país es el 2° menos densamente poblado del mundo (3 hab/km²). Tiempo de espera: 30 min-3h, a veces más en carreteras secundarias.' },
      { type: 'kv', items: [
        { k: 'B1/B2 (ejes principales)', v: 'Tráfico moderado, factible', color: 'green' },
        { k: 'Carreteras hacia Sossusvlei', v: 'Poco tráfico, larga espera posible', color: 'amber' },
        { k: 'Noreste (Caprivi Strip)', v: 'Factible pero aislado', color: 'amber' },
      ]},
      { type: 'rule', icon: '💧', text: 'Lleva SIEMPRE al menos 5 litros de agua. La deshidratación en el desierto es el peligro n°1.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Namibia es un país seguro para el autostop. Las distancias son inmensas y el tráfico escaso.' },
      { type: 'sub', title: 'Usa SpotHitch para tu seguridad' },
      { type: 'rule', icon: '🛡️', text: 'Activa el Modo Guardián antes de cada viaje. Una persona de confianza sigue tu posición en tiempo real.' },
      { type: 'rule', icon: '🆘', text: 'Configura el modo SOS con tus contactos. Un toque activa una triple alerta (push, SMS, llamada).' },
      { type: 'rule', icon: '📱', text: 'Fotografía la matrícula y envíala a alguien antes de subir.' },
      { type: 'rule', icon: '🎒', text: 'Mantén tu mochila accesible (en tu regazo o a tus pies), nunca en el maletero.' },
      { type: 'sub', title: 'Consejos del país' },
      { type: 'rule', icon: '💧', text: 'Las distancias son inmensas (500+ km entre ciudades). Lleva siempre agua y protección solar.' },
      { type: 'rule', icon: '🏜️', text: 'El tráfico es escaso en zona rural. Prevé largas esperas y mucha paciencia.' },
      { type: 'sub', title: 'Números de emergencia' },
      { type: 'kv', items: [{ k: 'Emergencias', v: '10111' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Namibia es relativamente segura para las mujeres. Las zonas turísticas son seguras. Se recomienda viajar en pareja en las zonas aisladas (Skeleton Coast, Kaokoveld).' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'El inglés es el idioma oficial y ampliamente hablado. El afrikáans es habitual entre las poblaciones blancas y coloured. El oshiwambo es el idioma bantú más hablado.' },
      { type: 'phrase', items: [
        { local: 'Moro', meaning: 'Hola (oshiwambo)' },
        { local: 'Tangi unene', meaning: 'Muchas gracias (oshiwambo)' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Namibia es moderadamente cara. Presupuesto ajustado: 20-35 €/día. La entrada a los parques nacionales (Etosha, Sossusvlei) es asequible.' },
      { type: 'kv', items: [
        { k: 'Camping (parque nacional)', v: '150-300 NAD (8-16 €)' },
        { k: 'Comida local', v: '50-150 NAD (3-8 €)' },
        { k: 'Backpacker hostel', v: '150-350 NAD (8-19 €)' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'La acampada libre está tolerada en el desierto y las zonas rurales (pide permiso a las granjas). Los campings en los parques nacionales (NWR) están bien equipados. El cielo estrellado namibio está entre los más puros del mundo.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Intercape', detail: 'Bus de larga distancia, red limitada', price: '200-600 NAD' },
        { emoji: '🚐', name: 'Minibús / Combis', detail: 'Transporte local entre ciudades', price: '50-200 NAD' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Ene', level: 'ok' }, { name: 'Feb', level: 'ok' }, { name: 'Mar', level: 'good' },
        { name: 'Abr', level: 'great' }, { name: 'May', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Ago', level: 'great' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'ok' }, { name: 'Dic', level: 'ok' },
      ]},
      { type: 'text', text: 'Mayo a octubre: temporada seca, ideal (días calurosos, noches frescas). La temporada de lluvias (noviembre-abril) hace algunas pistas impracticables. Etosha es mejor en temporada seca (animales en los puntos de agua).' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Namibia es un país de contrastes: dunas del Namib, Skeleton Coast, Etosha. La cultura es diversa (Himba, San, Herero, Ovambo). El braai (barbacoa) es tan importante como en Sudáfrica. El game jerky (biltong) es el snack de carretera.' },
    ]},
  },
  // ==================== KENYA ====================
  KE: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'El autostop no está formalmente regulado en Kenia. El transporte informal (matatus) es el modo principal. Levantar la mano al borde de la carretera para cualquier vehículo.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Kenia funciona en transporte semi-informal. Los matatus (minibuses) están en todas partes y son muy baratos. Para el autostop gratis, los camiones en la carretera Nairobi-Mombasa o Nairobi-Naivasha llevan pasajeros. Aclara "free" o "bure" antes de subir.' },
      { type: 'rule', icon: '💰', text: 'La distinción entre autostop gratis y transporte de pago es difusa. Aclara siempre antes.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Kenia es segura para el autostop en las carreteras principales y de día.' },
      { type: 'sub', title: 'Usa SpotHitch para tu seguridad' },
      { type: 'rule', icon: '🛡️', text: 'Activa el Modo Guardián antes de cada viaje. Una persona de confianza sigue tu posición en tiempo real.' },
      { type: 'rule', icon: '🆘', text: 'Configura el modo SOS con tus contactos. Un toque activa una triple alerta (push, SMS, llamada).' },
      { type: 'rule', icon: '📱', text: 'Fotografía la matrícula y envíala a alguien antes de subir.' },
      { type: 'rule', icon: '🎒', text: 'Mantén tu mochila accesible (en tu regazo o a tus pies), nunca en el maletero.' },
      { type: 'sub', title: 'Consejos del país' },
      { type: 'rule', icon: '☀️', text: 'Viaja solo de día. El autostop de noche está desaconsejado en las carreteras kenianas.' },
      { type: 'rule', icon: '🛣️', text: 'Las carreteras principales (Nairobi a Mombasa, Nairobi a Nakuru) son transitadas y seguras.' },
      { type: 'sub', title: 'Números de emergencia' },
      { type: 'kv', items: [{ k: 'Emergencias', v: '999' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Las mujeres que viajan solas en Kenia reportan experiencias mixtas. Las zonas turísticas (Masai Mara, Amboseli) son seguras. Los matatus son una alternativa más segura al autostop.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'El inglés y el suajili son los idiomas oficiales. El inglés se habla bien (lengua de educación). El suajili es el idioma del día a día.' },
      { type: 'phrase', items: [
        { local: 'Jambo / Habari', meaning: 'Hola / ¿Qué tal? (suajili)' },
        { local: 'Asante sana', meaning: 'Muchas gracias' },
        { local: 'Bure', meaning: 'Gratis' },
        { local: 'Hakuna matata', meaning: 'Sin problemas (¡sí, es real!)' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Kenia es moderadamente cara (sobre todo los safaris). Presupuesto ajustado sin safari: 15-25 €/día. Las nyama choma (parrilladas) son abundantes.' },
      { type: 'kv', items: [
        { k: 'Comida local', v: '200-500 KES (1,50-4 €)' },
        { k: 'Hostel', v: '800-2.000 KES (6-15 €)' },
        { k: 'Matatu (100 km)', v: '200-500 KES (1,50-4 €)' },
      ]},
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'La acampada libre está desaconsejada (animales salvajes). Los campings en los parques son seguros y bien organizados. Los backpacker hostels están bien desarrollados en Nairobi y en la costa.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚐', name: 'Matatu', detail: 'Minibuses omnipresentes, música a tope, experiencia única', price: '1-5 €' },
        { emoji: '🚂', name: 'Madaraka Express (SGR)', detail: 'Tren moderno Nairobi-Mombasa (4h30)', price: '10-30 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Ene', level: 'great' }, { name: 'Feb', level: 'great' }, { name: 'Mar', level: 'good' },
        { name: 'Abr', level: 'bad' }, { name: 'May', level: 'bad' }, { name: 'Jun', level: 'good' },
        { name: 'Jul', level: 'great' }, { name: 'Ago', level: 'great' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'ok' }, { name: 'Dic', level: 'good' },
      ]},
      { type: 'text', text: 'Enero-febrero y junio-octubre: temporada seca, ideal. Julio-octubre: gran migración en el Masai Mara. Abril-mayo: grandes lluvias (carreteras impracticables en zona rural).' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Kenia es un país vibrante y diverso (42 tribus). Los masai son emblemáticos pero el país es mucho más que eso. La nyama choma (carne a la brasa) y el ugali (pasta de maíz) son los platos cotidianos. Los kenianos son acogedores y orgullosos de su fauna.' },
    ]},
  },
  // ==================== ETHIOPIA ====================
  ET: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'El autostop es legal en Etiopía. El transporte informal (subirse a camiones Isuzu) es habitual. Los conductores paran fácilmente pero a menudo esperan un pago.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Etiopía es un caso particular. El autostop funciona pero la distinción gratis/de pago es muy difusa. Los camiones llevan pasajeros regularmente. Aclara "free, no birr" antes de subir. En zona rural, eres una atracción: multitudes de niños gritan "You! You! Money!"' },
      { type: 'text', text: 'Las carreteras principales (Adís Abeba-Bahir Dar, Adís Abeba-Lalibela) están asfaltadas. Las pistas en el Simien o el Danakil necesitan un vehículo organizado.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Etiopía es segura para el autostop en las carreteras principales. Los etíopes son acogedores.' },
      { type: 'sub', title: 'Usa SpotHitch para tu seguridad' },
      { type: 'rule', icon: '🛡️', text: 'Activa el Modo Guardián antes de cada viaje. Una persona de confianza sigue tu posición en tiempo real.' },
      { type: 'rule', icon: '🆘', text: 'Configura el modo SOS con tus contactos. Un toque activa una triple alerta (push, SMS, llamada).' },
      { type: 'rule', icon: '📱', text: 'Fotografía la matrícula y envíala a alguien antes de subir.' },
      { type: 'rule', icon: '🎒', text: 'Mantén tu mochila accesible (en tu regazo o a tus pies), nunca en el maletero.' },
      { type: 'sub', title: 'Consejos del país' },
      { type: 'rule', icon: '🗺️', text: 'Las distancias son largas entre ciudades. Prevé agua y comida para cada trayecto.' },
      { type: 'rule', icon: '📋', text: 'Verifica la situación de seguridad antes de viajar. Algunas regiones experimentan tensiones.' },
      { type: 'sub', title: 'Números de emergencia' },
      { type: 'kv', items: [{ k: 'Emergencias', v: '991' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'El acoso callejero es frecuente en Etiopía. Las mujeres que viajan solas reportan experiencias difíciles. Se recomienda mucho viajar en pareja.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'El amárico es el idioma oficial (alfabeto ge\'ez único). El inglés se enseña en la escuela pero se habla poco en zona rural. Aprende unas palabras de amárico.' },
      { type: 'phrase', items: [
        { local: 'Selam', meaning: 'Hola' },
        { local: 'Amesegenalehu', meaning: 'Gracias' },
        { local: 'Nefsih / Free', meaning: 'Gratis' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Etiopía es barata. Presupuesto ajustado: 10-20 €/día. La injera (tortita esponjosa) con wots (guisos) es el plato diario: 1-3 €.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'La acampada libre es posible pero pide permiso localmente. Las pensiones (hoteles básicos) cuestan 2-8 €. Los monasterios ortodoxos a veces acogen viajeros.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚐', name: 'Minibús', detail: 'Principal transporte entre ciudades, esperan estar llenos (a veces horas)', price: '1-10 €' },
        { emoji: '🚌', name: 'Selam Bus', detail: 'Buses de larga distancia, más cómodos', price: '5-15 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Ene', level: 'great' }, { name: 'Feb', level: 'great' }, { name: 'Mar', level: 'good' },
        { name: 'Abr', level: 'ok' }, { name: 'May', level: 'ok' }, { name: 'Jun', level: 'bad' },
        { name: 'Jul', level: 'bad' }, { name: 'Ago', level: 'bad' }, { name: 'Sep', level: 'ok' },
        { name: 'Oct', level: 'great' }, { name: 'Nov', level: 'great' }, { name: 'Dic', level: 'great' },
      ]},
      { type: 'text', text: 'Octubre a marzo: temporada seca, ideal. Junio-septiembre: grandes lluvias (carreteras impracticables). Enero: Timkat (Epifanía etíope), la mayor fiesta. Etiopía tiene su propio calendario (13 meses, 7-8 años de desfase).' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Etiopía es única en África: nunca colonizada, calendario propio, alfabeto propio, iglesia ortodoxa antigua. La ceremonia del café es un ritual social que dura 30-60 minutos (3 tazas obligatorias). La injera se come con las manos. La hospitalidad es sincera pero los niños que piden limosna son un desafío.' },
      { type: 'event', items: [
        { month: 'Ene', day: '19', name: 'Timkat (Epifanía)', desc: 'La mayor fiesta religiosa. Procesiones espectaculares en Gondar y Lalibela.' },
      ]},
    ]},
  },
  // ==================== MYANMAR ====================
  MM: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'El autostop no está regulado en Myanmar. El concepto no existe formalmente pero los conductores paran fácilmente si haces señas. El transporte informal es habitual.' },
      { type: 'warn', text: '⚠️ Myanmar atraviesa una crisis política desde 2021 (golpe de estado). Verifica la situación de seguridad antes de viajar. Algunas zonas están prohibidas para los extranjeros.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Myanmar es un país donde la gente es increíblemente acogedora. Los conductores de camiones y pickups paran fácilmente. Mucho transporte es informal (subirse atrás de los pickups). El concepto de gratuidad es natural para los birmanos.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Verifica la situación de seguridad antes de viajar a Myanmar. La situación política evoluciona regularmente.' },
      { type: 'sub', title: 'Usa SpotHitch para tu seguridad' },
      { type: 'rule', icon: '🛡️', text: 'Activa el Modo Guardián antes de cada viaje. Una persona de confianza sigue tu posición en tiempo real.' },
      { type: 'rule', icon: '🆘', text: 'Configura el modo SOS con tus contactos. Un toque activa una triple alerta (push, SMS, llamada).' },
      { type: 'rule', icon: '📱', text: 'Fotografía la matrícula y envíala a alguien antes de subir.' },
      { type: 'rule', icon: '🎒', text: 'Mantén tu mochila accesible (en tu regazo o a tus pies), nunca en el maletero.' },
      { type: 'sub', title: 'Consejos del país' },
      { type: 'rule', icon: '📋', text: 'Verifica los avisos del Ministerio de Asuntos Exteriores antes de cualquier desplazamiento. La situación evoluciona.' },
      { type: 'rule', icon: '🌍', text: 'Consulta los foros de viajeros recientes para obtener información actualizada sobre las zonas accesibles.' },
      { type: 'sub', title: 'Números de emergencia' },
      { type: 'kv', items: [{ k: 'Emergencias', v: '199' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Myanmar se consideraba muy seguro para las mujeres (cultura budista respetuosa). La situación ha cambiado desde 2021. Infórmate sobre la situación actual.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'El birmano es el idioma oficial. El inglés es limitado pero en progresión entre los jóvenes urbanos.' },
      { type: 'phrase', items: [
        { local: 'Mingalaba', meaning: 'Hola' },
        { local: 'Kyay zu tin ba de', meaning: 'Gracias' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Myanmar es barato. Presupuesto ajustado: 15-25 $/día. Los teashops sirven comidas por 1-2 $.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Las guesthouses son baratas (5-15 $). Los monasterios a veces acogen viajeros. La acampada libre es posible en zonas rurales.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Bus de larga distancia', detail: 'Red extensa, buses VIP cómodos', price: '5-20 $' },
        { emoji: '🚂', name: 'Tren', detail: 'Lento pero panorámico (Hsipaw, viaducto de Goteik)', price: '2-10 $' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Ene', level: 'great' }, { name: 'Feb', level: 'great' }, { name: 'Mar', level: 'good' },
        { name: 'Abr', level: 'ok' }, { name: 'May', level: 'bad' }, { name: 'Jun', level: 'bad' },
        { name: 'Jul', level: 'bad' }, { name: 'Ago', level: 'bad' }, { name: 'Sep', level: 'bad' },
        { name: 'Oct', level: 'ok' }, { name: 'Nov', level: 'great' }, { name: 'Dic', level: 'great' },
      ]},
      { type: 'text', text: 'Noviembre a febrero: ideal. Marzo-mayo: muy caluroso. Junio-octubre: monzón intensa.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Myanmar es un país profundamente budista. Las pagodas doradas (Shwedagon) son espectaculares. Los birmanos son sonrientes y generosos. El thanaka (pasta amarilla en la cara) es un cosmético tradicional. El té con leche (laphet yay) es la bebida nacional.' },
    ]},
  },
  // ==================== INDONESIA ====================
  ID: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'El autostop no es un concepto formal en Indonesia. El transporte informal es la norma: moto-taxis (ojek), bemos, angkots. Los conductores paran si haces señas pero a menudo esperan un pago.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Indonesia es el mayor archipiélago del mundo (17.000 islas). El autostop clásico es difícil porque los transportes informales son omnipresentes y muy baratos. En zona rural (Sumatra, Kalimantan, Papúa), los camiones llevan pasajeros.' },
      { type: 'rule', icon: '🏍️', text: 'Los ojeks (moto-taxis) están en todas partes. Gratis si alguien te lo propone, si no aclara el precio.' },
      { type: 'text', text: 'Bali no es representativo de Indonesia. Java, Sumatra y Sulawesi son más auténticos para el autostop.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Indonesia es segura para el autostop. Los indonesios son extremadamente acogedores con los viajeros.' },
      { type: 'sub', title: 'Usa SpotHitch para tu seguridad' },
      { type: 'rule', icon: '🛡️', text: 'Activa el Modo Guardián antes de cada viaje. Una persona de confianza sigue tu posición en tiempo real.' },
      { type: 'rule', icon: '🆘', text: 'Configura el modo SOS con tus contactos. Un toque activa una triple alerta (push, SMS, llamada).' },
      { type: 'rule', icon: '📱', text: 'Fotografía la matrícula y envíala a alguien antes de subir.' },
      { type: 'rule', icon: '🎒', text: 'Mantén tu mochila accesible (en tu regazo o a tus pies), nunca en el maletero.' },
      { type: 'sub', title: 'Consejos del país' },
      { type: 'rule', icon: '🏝️', text: 'Bali y Java son las islas más fáciles para el autostop. El tráfico es denso y los conductores paran fácilmente.' },
      { type: 'rule', icon: '🤝', text: 'Los indonesios son extremadamente acogedores. A menudo te invitarán a comer o a tomar un café.' },
      { type: 'sub', title: 'Números de emergencia' },
      { type: 'kv', items: [{ k: 'Emergencias', v: '112' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Indonesia es globalmente segura para las mujeres. Viste de forma modesta (Indonesia es el mayor país musulmán del mundo). Bali es más relajado. Aceh aplica la sharia.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'El bahasa indonesia es el idioma oficial (fácil de aprender, sin conjugación). El inglés es habitual en las zonas turísticas. Existen 700+ idiomas locales.' },
      { type: 'phrase', items: [
        { local: 'Selamat pagi/siang/sore', meaning: 'Buenos días/tardes (mañana/mediodía/tarde)' },
        { local: 'Terima kasih', meaning: 'Gracias' },
        { local: 'Gratis', meaning: 'Gratis' },
        { local: 'Ke mana?', meaning: '¿A dónde va?' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Indonesia es muy barata (excepto Bali turístico). Presupuesto ajustado: 10-20 €/día. El nasi goreng (arroz frito) cuesta 0,50-1,50 €.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Los losmen/homestays son muy baratos (3-10 €). La acampada libre es posible en zonas rurales y volcanes.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Bus', detail: 'Red extensa en Java y Sumatra', price: '2-15 €' },
        { emoji: '⛴️', name: 'Ferry PELNI', detail: 'Barcos entre las islas, lentos pero baratos', price: '5-30 €' },
        { emoji: '✈️', name: 'Vuelos low-cost', detail: 'Lion Air, AirAsia. A menudo la única opción entre islas lejanas.', price: '15-60 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Ene', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mar', level: 'ok' },
        { name: 'Abr', level: 'good' }, { name: 'May', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Ago', level: 'great' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'ok' }, { name: 'Dic', level: 'bad' },
      ]},
      { type: 'text', text: 'Mayo a septiembre: temporada seca, ideal. Noviembre-marzo: monzón (lluvias diarias pero cortas). Bali y Java son practicables todo el año.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Indonesia es increíblemente diversa: hinduista en Bali, musulmana en Java, cristiana en Flores, animista en Papúa. El gotong royong (ayuda comunitaria) es un valor fundamental. El nasi goreng (arroz frito) es el plato nacional. Los indonesios están entre la gente más sonriente de Asia.' },
    ]},
  },
  // ==================== PHILIPPINES ====================
  PH: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'El autostop no está regulado en Filipinas. El transporte informal es la norma: jeepneys, triciclos, habal-habal (motos). Los conductores paran fácilmente.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Filipinas es un país muy acogedor. Los filipinos están entre la gente más hospitalaria de Asia. El autostop funciona pero el transporte público es tan barato que rara vez es necesario. En las islas menos turísticas, los pickups y motos paran fácilmente.' },
      { type: 'text', text: 'Mindanao es más difícil de acceso (ciertas zonas desaconsejadas). Luzón y las Visayas son lo más fácil.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Filipinas es segura para el autostop en las islas principales. Los filipinos son acogedores y alegres.' },
      { type: 'sub', title: 'Usa SpotHitch para tu seguridad' },
      { type: 'rule', icon: '🛡️', text: 'Activa el Modo Guardián antes de cada viaje. Una persona de confianza sigue tu posición en tiempo real.' },
      { type: 'rule', icon: '🆘', text: 'Configura el modo SOS con tus contactos. Un toque activa una triple alerta (push, SMS, llamada).' },
      { type: 'rule', icon: '📱', text: 'Fotografía la matrícula y envíala a alguien antes de subir.' },
      { type: 'rule', icon: '🎒', text: 'Mantén tu mochila accesible (en tu regazo o a tus pies), nunca en el maletero.' },
      { type: 'sub', title: 'Consejos del país' },
      { type: 'rule', icon: '🏝️', text: 'Las islas principales (Luzón, Visayas) son las más fáciles para el autostop. Evita la isla de Mindanao.' },
      { type: 'rule', icon: '🗣️', text: 'El inglés es ampliamente hablado. La comunicación con los conductores es fácil y agradable.' },
      { type: 'sub', title: 'Números de emergencia' },
      { type: 'kv', items: [{ k: 'Emergencias', v: '911' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Filipinas es globalmente segura para las mujeres. La sociedad es matriarcal en muchas comunidades. Los filipinos son respetuosos.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'El filipino (tagalo) y el inglés son los idiomas oficiales. El inglés se habla muy bien (3° país anglófono del mundo). Sin barrera lingüística.' },
      { type: 'phrase', items: [
        { local: 'Kumusta?', meaning: '¿Cómo estás?' },
        { local: 'Salamat po', meaning: 'Gracias (respetuoso)' },
        { local: 'Saan ka pupunta?', meaning: '¿A dónde vas?' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Filipinas es barata. Presupuesto ajustado: 15-25 €/día. El arroz con adobo (pollo/cerdo marinado) cuesta 1-2 €.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Las guesthouses son baratas (5-15 €). La acampada libre es posible en playas desiertas. Los filipinos invitan fácilmente a los viajeros a su casa.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚐', name: 'Jeepney', detail: 'Icono de Filipinas. Transporte local colorido.', price: '0,20-0,50 €' },
        { emoji: '⛴️', name: 'Ferry / bangka', detail: 'Entre las islas. 2GO Travel para largas distancias.', price: '5-30 €' },
        { emoji: '✈️', name: 'Cebu Pacific / AirAsia', detail: 'Vuelos inter-islas baratos', price: '15-50 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Ene', level: 'great' }, { name: 'Feb', level: 'great' }, { name: 'Mar', level: 'great' },
        { name: 'Abr', level: 'great' }, { name: 'May', level: 'good' }, { name: 'Jun', level: 'ok' },
        { name: 'Jul', level: 'ok' }, { name: 'Ago', level: 'bad' }, { name: 'Sep', level: 'bad' },
        { name: 'Oct', level: 'bad' }, { name: 'Nov', level: 'ok' }, { name: 'Dic', level: 'good' },
      ]},
      { type: 'text', text: 'Diciembre a mayo: temporada seca, ideal. Junio-noviembre: monzón y tifones. El sur (Mindanao) se ve menos afectado por los tifones.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Los filipinos son alegres, acogedores y adoran cantar (karaoke = institución nacional). El lechón (cerdo asado) es el plato de fiesta. San Miguel es la cerveza nacional. El "Filipino time" significa que nada tiene prisa.' },
    ]},
  },
  // ==================== SRI LANKA ====================
  LK: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'El autostop es legal en Sri Lanka. El concepto se entiende y el autostop funciona bien. Los cingaleses son naturalmente acogedores y paran fácilmente.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Sri Lanka es fácil para el autostop. El país es pequeño (430 km de norte a sur) y los conductores son acogedores. Los tuk-tuks y buses están en todas partes pero el autostop gratis también funciona. Tiempo de espera: 10-20 min.' },
      { type: 'text', text: 'Las carreteras del Hill Country (Kandy-Ella-Nuwara Eliya) son las más panorámicas. La costa sur y oeste tiene más tráfico.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Sri Lanka es un país seguro para el autostop. Los esrilanqueses son hospitalarios y protectores con los viajeros.' },
      { type: 'sub', title: 'Usa SpotHitch para tu seguridad' },
      { type: 'rule', icon: '🛡️', text: 'Activa el Modo Guardián antes de cada viaje. Una persona de confianza sigue tu posición en tiempo real.' },
      { type: 'rule', icon: '🆘', text: 'Configura el modo SOS con tus contactos. Un toque activa una triple alerta (push, SMS, llamada).' },
      { type: 'rule', icon: '📱', text: 'Fotografía la matrícula y envíala a alguien antes de subir.' },
      { type: 'rule', icon: '🎒', text: 'Mantén tu mochila accesible (en tu regazo o a tus pies), nunca en el maletero.' },
      { type: 'sub', title: 'Consejos del país' },
      { type: 'rule', icon: '🌊', text: 'Las carreteras costeras son las más fáciles para el autostop. El tráfico es denso y los conductores acogedores.' },
      { type: 'rule', icon: '🤝', text: 'Los esrilanqueses son hospitalarios y protectores con los viajeros. Acepta las invitaciones con gratitud.' },
      { type: 'sub', title: 'Números de emergencia' },
      { type: 'kv', items: [{ k: 'Emergencias', v: '119' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Sri Lanka es moderadamente seguro para mujeres solas. El acoso existe pero generalmente se limita a miradas y comentarios. El sur y el Hill Country son los más seguros.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'El cingalés y el tamil son los idiomas oficiales. El inglés está bastante extendido en las zonas turísticas y educadas.' },
      { type: 'phrase', items: [
        { local: 'Ayubowan', meaning: 'Hola / Larga vida (cingalés)' },
        { local: 'Istuti', meaning: 'Gracias (cingalés)' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Sri Lanka es barata. Presupuesto ajustado: 15-25 €/día. El rice & curry es el plato diario: 1-3 €.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Las guesthouses son baratas (5-15 €). La acampada libre es posible en el Hill Country. Los templos budistas a veces acogen viajeros.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚂', name: 'Tren', detail: 'Los trenes del Hill Country están entre los trayectos más bonitos del mundo (Kandy-Ella).', price: '1-5 €' },
        { emoji: '🚌', name: 'Bus', detail: 'Red densa y muy barata', price: '0,50-3 €' },
        { emoji: '🛺', name: 'Tuk-tuk', detail: 'Transporte local omnipresente', price: '0,50-5 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Ene', level: 'great' }, { name: 'Feb', level: 'great' }, { name: 'Mar', level: 'great' },
        { name: 'Abr', level: 'good' }, { name: 'May', level: 'ok' }, { name: 'Jun', level: 'ok' },
        { name: 'Jul', level: 'good' }, { name: 'Ago', level: 'good' }, { name: 'Sep', level: 'ok' },
        { name: 'Oct', level: 'bad' }, { name: 'Nov', level: 'bad' }, { name: 'Dic', level: 'good' },
      ]},
      { type: 'text', text: 'Sri Lanka tiene dos monzones opuestos: costa suroeste (mayo-septiembre) y costa noreste (octubre-enero). Siempre hay un lado seco. Diciembre-marzo: mejor para la costa sur y oeste.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Sri Lanka es "la perla del océano Índico". El budismo Theravada impregna la cultura (templos, monjes, fiestas). El té de Ceilán es un orgullo nacional. El rice & curry es un arte: hasta 10 platos diferentes alrededor del arroz. Las fiestas budistas (Vesak, Perahera) son espectaculares.' },
    ]},
  },
  // ==================== MONGOLIA ====================
  MN: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'El autostop es legal en Mongolia. El transporte informal es la norma fuera de Ulán Bator. En las pistas (hay muy pocas carreteras asfaltadas), todo vehículo que pasa para.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Mongolia es un país único para el autostop. Fuera de Ulán Bator, prácticamente no hay carreteras asfaltadas: son pistas en la estepa. Todo vehículo (camión, jeep, moto) para porque el tráfico es muy bajo y las distancias inmensas.' },
      { type: 'rule', icon: '💰', text: 'Los conductores a menudo esperan un pago (el transporte es un servicio en un país sin buses). Negocia antes.' },
      { type: 'rule', icon: '🏔️', text: 'Las yurtas (gers) de los nómadas están abiertas a los viajeros. Es la tradición mongola.' },
      { type: 'warn', text: '⚠️ Las distancias son inmensas y no hay NADA entre las ciudades. Lleva agua, comida y un saco de dormir cálido.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Mongolia es un país seguro para el autostop. Las distancias son inmensas y las carreteras a veces inexistentes.' },
      { type: 'sub', title: 'Usa SpotHitch para tu seguridad' },
      { type: 'rule', icon: '🛡️', text: 'Activa el Modo Guardián antes de cada viaje. Una persona de confianza sigue tu posición en tiempo real.' },
      { type: 'rule', icon: '🆘', text: 'Configura el modo SOS con tus contactos. Un toque activa una triple alerta (push, SMS, llamada).' },
      { type: 'rule', icon: '📱', text: 'Fotografía la matrícula y envíala a alguien antes de subir.' },
      { type: 'rule', icon: '🎒', text: 'Mantén tu mochila accesible (en tu regazo o a tus pies), nunca en el maletero.' },
      { type: 'sub', title: 'Consejos del país' },
      { type: 'rule', icon: '⛺', text: 'Las distancias son inmensas y las carreteras a veces inexistentes. Prevé una tienda y comida.' },
      { type: 'rule', icon: '🏜️', text: 'Fuera de Ulán Bator, el tráfico es muy escaso. Prepárate para largas esperas en paisajes inmensos.' },
      { type: 'sub', title: 'Números de emergencia' },
      { type: 'kv', items: [{ k: 'Emergencias', v: '102' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Mongolia es relativamente segura para las mujeres. La sociedad es igualitaria (las mujeres mongolas son fuertes e independientes). Evita los bares de Ulán Bator tarde por la noche.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'El mongol es el idioma oficial (alfabeto cirílico). El ruso lo entienden los mayores de 40 años. El inglés es muy limitado fuera de Ulán Bator.' },
      { type: 'phrase', items: [
        { local: 'Sain baina uu', meaning: 'Hola' },
        { local: 'Bayarlalaa', meaning: 'Gracias' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Mongolia es barata. Presupuesto ajustado: 15-25 €/día. El buuz (raviolis de carne) es el plato nacional: 1-2 €. El alojamiento en yurta con familias nómadas es gratuito o muy barato.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'La acampada libre es ilimitada en Mongolia: la estepa es infinita y nadie te molestará. Los nómadas acogen viajeros en sus yurtas (tradición sagrada). Ofrece un pequeño regalo a cambio.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚐', name: 'Mikr / Furgon', detail: 'Minibuses entre ciudades, esperan estar llenos (a veces horas)', price: '5-15 €' },
        { emoji: '🚂', name: 'Transmongoliano', detail: 'Tren mítico Ulán Bator-Irkutsk o Ulán Bator-Pekín', price: '30-100 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Ene', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mar', level: 'bad' },
        { name: 'Abr', level: 'ok' }, { name: 'May', level: 'good' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Ago', level: 'great' }, { name: 'Sep', level: 'good' },
        { name: 'Oct', level: 'ok' }, { name: 'Nov', level: 'bad' }, { name: 'Dic', level: 'bad' },
      ]},
      { type: 'text', text: 'Junio a agosto: ideal (15-25°C). El Naadam (julio) es el festival nacional. El invierno es extremo (hasta -40°C). Ulán Bator es la capital más fría del mundo.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Mongolia es el país de los nómadas. El 30% de la población aún vive en yurta. La hospitalidad es sagrada: un viajero que llega a una yurta recibe té con leche salado (süütei tsai), airag (leche de yegua fermentada) y comida. El Naadam (julio) celebra los "tres juegos viriles": lucha, tiro con arco y carrera de caballos.' },
      { type: 'event', items: [
        { month: 'Jul', day: '11-13', name: 'Naadam', desc: 'El mayor festival mongol. Lucha, tiro con arco, carrera de caballos. Ambiente increíble.' },
      ]},
    ]},
  },
  // ==================== CUBA ====================
  CU: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'El autostop es legal e incluso promovido en Cuba. El gobierno ha creado "puntos de botella" (puntos de autostop oficiales) donde funcionarios ("amarillos", con chaleco amarillo) organizan el autostop.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Cuba es probablemente el mejor país del mundo para el autostop. Los vehículos del estado están OBLIGADOS por ley a llevar autostopistas. Los "amarillos" (funcionarios de amarillo en los cruces) organizan el autostop oficialmente. Tiempo de espera: 5-30 min.' },
      { type: 'rule', icon: '🟡', text: 'Los puntos de botella (puntos de autostop oficiales) están a la salida de las ciudades. Busca a los amarillos con chaleco amarillo.' },
      { type: 'rule', icon: '🚛', text: 'Los camiones del estado (camiones) son el transporte principal en zona rural. Sube atrás, es normal.' },
      { type: 'text', text: 'Los viejos coches americanos (almendrones) son taxis colectivos. Aclara el precio. El autostop gratis funciona muy bien porque los coches son escasos y caros.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Cuba es uno de los países más seguros de las Américas. La criminalidad violenta es casi inexistente.' },
      { type: 'sub', title: 'Usa SpotHitch para tu seguridad' },
      { type: 'rule', icon: '🛡️', text: 'Activa el Modo Guardián antes de cada viaje. Una persona de confianza sigue tu posición en tiempo real.' },
      { type: 'rule', icon: '🆘', text: 'Configura el modo SOS con tus contactos. Un toque activa una triple alerta (push, SMS, llamada).' },
      { type: 'rule', icon: '📱', text: 'Fotografía la matrícula y envíala a alguien antes de subir.' },
      { type: 'rule', icon: '🎒', text: 'Mantén tu mochila accesible (en tu regazo o a tus pies), nunca en el maletero.' },
      { type: 'sub', title: 'Consejos del país' },
      { type: 'rule', icon: '🚗', text: 'Los boteros (taxis colectivos) y los camiones estatales son las opciones principales. Levanta la mano para pararlos.' },
      { type: 'rule', icon: '😊', text: 'Los cubanos son acogedores y sociables. Una conversación amistosa es la mejor forma de conseguir un viaje.' },
      { type: 'sub', title: 'Números de emergencia' },
      { type: 'kv', items: [{ k: 'Policía', v: '106' }, { k: 'Ambulancia', v: '104' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Cuba es segura para mujeres que viajan solas. El machismo existe (piropos = cumplidos callejeros) pero los incidentes graves son muy raros. La sociedad cubana es protectora con los visitantes.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'El español cubano es el idioma único. El inglés es muy limitado excepto en los hoteles turísticos. El francés a veces lo entienden los más mayores (cooperación con Quebec).' },
      { type: 'phrase', items: [
        { local: '¿Me da botella?', meaning: '¿Me lleva en autostop? (expresión cubana)' },
        { local: '¡Dale!', meaning: '¡OK / Vamos!' },
        { local: 'Gracias, compañero', meaning: 'Gracias, camarada' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Cuba es complicado financieramente. Dos economías coexisten (turista y local). Presupuesto ajustado: 20-35 €/día comiendo local. Las casas particulares (habitaciones en casas de cubanos): 15-25 €/noche.' },
      { type: 'warn', text: '⚠️ Las tarjetas bancarias americanas NO funcionan. Lleva euros en efectivo. El cambio oficial es desfavorable. El mercado informal ofrece mejor tipo.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Las casas particulares (habitaciones en casas de cubanos) son la opción estándar. Los cubanos son acogedores y las conversaciones apasionantes. La acampada libre es posible en las playas pero pide permiso localmente.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Víazul', detail: 'Buses turísticos climatizados. Fiables pero caros para Cuba.', price: '10-40 €' },
        { emoji: '🚛', name: 'Camiones', detail: 'Camiones del estado convertidos en buses. Transporte local en peso cubano.', price: '0,50-2 €' },
        { emoji: '🚗', name: 'Almendrones (taxi colectivo)', detail: 'Viejos americanos, trayectos compartidos', price: '2-10 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Ene', level: 'great' }, { name: 'Feb', level: 'great' }, { name: 'Mar', level: 'great' },
        { name: 'Abr', level: 'good' }, { name: 'May', level: 'ok' }, { name: 'Jun', level: 'ok' },
        { name: 'Jul', level: 'ok' }, { name: 'Ago', level: 'bad' }, { name: 'Sep', level: 'bad' },
        { name: 'Oct', level: 'bad' }, { name: 'Nov', level: 'good' }, { name: 'Dic', level: 'great' },
      ]},
      { type: 'text', text: 'Noviembre a abril: temporada seca, ideal. Agosto-octubre: posibles huracanes. Cuba es caluroso y húmedo todo el año (25-33°C).' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Cuba es un mundo aparte. La música (son, salsa, rumba) está en todas partes. El ron y los puros son instituciones. Las conversaciones con los cubanos son fascinantes (política, historia, sueños). El sistema socialista crea una solidaridad única: todo el mundo comparte lo que tiene.' },
      { type: 'event', items: [
        { month: 'Jul', day: '⟳', name: 'Carnaval de Santiago', desc: 'El mayor carnaval de Cuba. Música, baile, conga por las calles.' },
      ]},
    ]},
  },
  // ==================== GUATEMALA ====================
  GT: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'El autostop es legal en Guatemala. Los pickups (camionetas) son el transporte principal en zona rural y llevan pasajeros a cambio de un pequeño pago. El autostop gratis también funciona.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Guatemala es factible en autostop. Los pickups y camiones paran fácilmente en zona rural. Los guatemaltecos son acogedores. Tiempo de espera: 15-30 min. Los Highlands (Lago Atitlán, Antigua, Chichicastenango) son la zona más fácil.' },
      { type: 'rule', icon: '🛻', text: 'Sube a la caja de los pickups, es el transporte normal. A menudo se espera un pequeño pago.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Guatemala es segura en las zonas turísticas (Antigua, Atitlán, Highlands). Las gasolineras son buenos spots.' },
      { type: 'sub', title: 'Usa SpotHitch para tu seguridad' },
      { type: 'rule', icon: '🛡️', text: 'Activa el Modo Guardián antes de cada viaje. Una persona de confianza sigue tu posición en tiempo real.' },
      { type: 'rule', icon: '🆘', text: 'Configura el modo SOS con tus contactos. Un toque activa una triple alerta (push, SMS, llamada).' },
      { type: 'rule', icon: '📱', text: 'Fotografía la matrícula y envíala a alguien antes de subir.' },
      { type: 'rule', icon: '🎒', text: 'Mantén tu mochila accesible (en tu regazo o a tus pies), nunca en el maletero.' },
      { type: 'sub', title: 'Consejos del país' },
      { type: 'rule', icon: '⛽', text: 'Las gasolineras son buenos spots para encontrar conductores en un entorno seguro.' },
      { type: 'rule', icon: '🌄', text: 'Prioriza las zonas turísticas (Antigua, Atitlán, Semuc Champey) y los Highlands para hacer autostop.' },
      { type: 'sub', title: 'Números de emergencia' },
      { type: 'kv', items: [{ k: 'Policía', v: '120' }, { k: 'Bomberos', v: '110' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Guatemala es delicado para mujeres solas. Los Highlands son más seguros. Se recomienda viajar en pareja.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'El español es el idioma principal. 21 lenguas mayas se hablan en los Highlands. El inglés está limitado a las zonas turísticas.' },
      { type: 'phrase', items: [
        { local: '¿Me da jalón?', meaning: '¿Me lleva?' },
        { local: '¡Puchica!', meaning: 'Expresión de asombro (guatemalteca)' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Guatemala es barata. Presupuesto ajustado: 15-25 €/día. Los comedores (cantinas) sirven comidas por 1-3 €.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Los hospedajes son baratos (3-10 €). Acampar es posible alrededor del Lago Atitlán y en las montañas.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Chicken bus', detail: 'Antiguos buses escolares americanos pintados. Experiencia única, abarrotados, baratos.', price: '0,50-3 €' },
        { emoji: '🚐', name: 'Shuttle turístico', detail: 'Minibuses entre los puntos turísticos', price: '5-15 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Ene', level: 'great' }, { name: 'Feb', level: 'great' }, { name: 'Mar', level: 'great' },
        { name: 'Abr', level: 'good' }, { name: 'May', level: 'ok' }, { name: 'Jun', level: 'ok' },
        { name: 'Jul', level: 'ok' }, { name: 'Ago', level: 'ok' }, { name: 'Sep', level: 'bad' },
        { name: 'Oct', level: 'bad' }, { name: 'Nov', level: 'good' }, { name: 'Dic', level: 'great' },
      ]},
      { type: 'text', text: 'Noviembre a abril: temporada seca, ideal. Los Highlands son frescos (15-25°C). La costa es calurosa y húmeda.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Guatemala es el corazón del mundo maya. Los mercados coloridos (Chichicastenango), las ruinas de Tikal y el Lago Atitlán son maravillas. Las comunidades mayas están vivas (lenguas, trajes, tradiciones). El café guatemalteco está entre los mejores del mundo.' },
    ]},
  },
  // ==================== COSTA RICA ====================
  CR: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'El autostop es legal en Costa Rica. Práctica bastante habitual, sobre todo en zona rural y en las carreteras de playas del Pacífico.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Costa Rica es fácil para el autostop. Los ticos (costarricenses) son acogedores y "pura vida" (la vida es bella) es más que un eslogan. Tiempo de espera: 15-30 min. Las carreteras del Pacífico (Nicoya, Osa) tienen menos buses y el autostop es casi obligatorio.' },
      { type: 'rule', icon: '🛻', text: 'Los pickups y 4x4 son los vehículos más habituales en zona rural. Los surfistas paran fácilmente.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Costa Rica es un país seguro para el autostop. Los ticos son acogedores y amables.' },
      { type: 'sub', title: 'Usa SpotHitch para tu seguridad' },
      { type: 'rule', icon: '🛡️', text: 'Activa el Modo Guardián antes de cada viaje. Una persona de confianza sigue tu posición en tiempo real.' },
      { type: 'rule', icon: '🆘', text: 'Configura el modo SOS con tus contactos. Un toque activa una triple alerta (push, SMS, llamada).' },
      { type: 'rule', icon: '📱', text: 'Fotografía la matrícula y envíala a alguien antes de subir.' },
      { type: 'rule', icon: '🎒', text: 'Mantén tu mochila accesible (en tu regazo o a tus pies), nunca en el maletero.' },
      { type: 'sub', title: 'Consejos del país' },
      { type: 'rule', icon: '🏔️', text: 'Las carreteras de montaña son sinuosas. Prevé el mareo y haz pausas.' },
      { type: 'rule', icon: '😊', text: 'Los ticos son muy acogedores. "Pura Vida" es su filosofía de vida. Adóptala.' },
      { type: 'sub', title: 'Números de emergencia' },
      { type: 'kv', items: [{ k: 'Emergencias', v: '911' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Costa Rica es segura para mujeres que viajan solas. Los ticos son respetuosos. Las zonas de surf son relajadas e inclusivas.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'El español es el idioma principal. El inglés está bastante extendido en las zonas turísticas y en la costa caribeña. "Pura vida" es la expresión universal (hola, adiós, gracias, qué tal, todo bien).' },
      { type: 'phrase', items: [
        { local: '¡Pura vida!', meaning: 'Todo bien / Gracias / Hola (universal)' },
        { local: 'Mae', meaning: 'Tío (expresión tica)' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Costa Rica es el país más caro de Centroamérica. Presupuesto ajustado: 25-40 €/día. Las sodas (cantinas locales) sirven casados (comida completa) por 3-5 €.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'La acampada libre es posible en las playas del Pacífico. Los hostels están bien desarrollados (10-20 €). Costa Rica es pionera del ecoturismo.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Bus', detail: 'Red extensa y barata. Terminal 7-10 en San José.', price: '2-15 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Ene', level: 'great' }, { name: 'Feb', level: 'great' }, { name: 'Mar', level: 'great' },
        { name: 'Abr', level: 'good' }, { name: 'May', level: 'ok' }, { name: 'Jun', level: 'ok' },
        { name: 'Jul', level: 'ok' }, { name: 'Ago', level: 'ok' }, { name: 'Sep', level: 'bad' },
        { name: 'Oct', level: 'bad' }, { name: 'Nov', level: 'good' }, { name: 'Dic', level: 'great' },
      ]},
      { type: 'text', text: 'Diciembre a abril: temporada seca (verano). La costa caribeña tiene un ciclo inverso (seca en septiembre-octubre). El surf es mejor en temporada de lluvias.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: '"Pura vida" lo resume todo: la vida es bella, sin estrés. Costa Rica no tiene ejército (abolido en 1949) e invierte en educación y medioambiente. El 25% del territorio está en reserva natural. Los ticos están orgullosos de su biodiversidad (5% de la biodiversidad mundial).' },
    ]},
  },
  // ==================== EGYPT ====================
  EG: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'El autostop no está formalmente regulado en Egipto. El transporte informal (microbuses, pickups) es el modo principal. Levantar la mano al borde de la carretera para vehículos.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Egipto funciona en transporte semi-informal. Los microbuses paran en todas partes (0,10-0,50 €). Para el autostop gratis, los camiones en las carreteras de larga distancia (El Cairo-Lúxor, El Cairo-Hurghada) llevan pasajeros. La hospitalidad egipcia ayuda mucho.' },
      { type: 'rule', icon: '💰', text: 'La distinción gratis/de pago es muy difusa. Aclara "mish flous" (sin dinero) o "free" antes de subir.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Egipto es seguro para el autostop en las zonas turísticas. Los egipcios son acogedores y serviciales.' },
      { type: 'sub', title: 'Usa SpotHitch para tu seguridad' },
      { type: 'rule', icon: '🛡️', text: 'Activa el Modo Guardián antes de cada viaje. Una persona de confianza sigue tu posición en tiempo real.' },
      { type: 'rule', icon: '🆘', text: 'Configura el modo SOS con tus contactos. Un toque activa una triple alerta (push, SMS, llamada).' },
      { type: 'rule', icon: '📱', text: 'Fotografía la matrícula y envíala a alguien antes de subir.' },
      { type: 'rule', icon: '🎒', text: 'Mantén tu mochila accesible (en tu regazo o a tus pies), nunca en el maletero.' },
      { type: 'sub', title: 'Consejos del país' },
      { type: 'rule', icon: '🏛️', text: 'Las zonas turísticas (El Cairo, Luxor, Asuán, costa) son seguras y bien vigiladas.' },
      { type: 'rule', icon: '🚌', text: 'Para los trayectos largos de noche, los autobuses de larga distancia son una alternativa segura y económica.' },
      { type: 'sub', title: 'Números de emergencia' },
      { type: 'kv', items: [{ k: 'Emergencias', v: '122' }] },
    ]},
    women: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'El acoso callejero es un problema mayor en Egipto, sobre todo en El Cairo. Las mujeres que viajan solas en autostop están desaconsejadas. Viajar en pareja (con un hombre) cambia radicalmente la experiencia.' },
      { type: 'rule', icon: '👫', text: 'Viajar con un compañero masculino es muy recomendable.' },
      { type: 'rule', icon: '👕', text: 'Viste de forma muy conservadora (hombros y rodillas cubiertos).' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'El árabe egipcio es el idioma principal (el dialecto más comprendido del mundo árabe gracias al cine). El inglés es habitual en las zonas turísticas.' },
      { type: 'phrase', items: [
        { local: 'Ahlan wa sahlan', meaning: 'Bienvenido' },
        { local: 'Shukran', meaning: 'Gracias' },
        { local: 'Mish flous', meaning: 'Sin dinero (gratis)' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Egipto es muy barato para los extranjeros (desde la devaluación). Presupuesto ajustado: 10-20 €/día. El koshari (plato nacional) cuesta 0,50-1 €.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Los hostels son baratos (3-10 €). La acampada libre es posible en el desierto (White Desert, Siwa). Los egipcios a veces invitan a los viajeros a su casa.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚐', name: 'Microbús', detail: 'Transporte local omnipresente, muy barato', price: '0,10-0,50 €' },
        { emoji: '🚂', name: 'Tren', detail: 'Red extensa a lo largo del Nilo. El Cairo-Lúxor en tren nocturno.', price: '5-25 €' },
        { emoji: '🚌', name: 'GoBus / Blue Bus', detail: 'Buses de larga distancia modernos', price: '5-15 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Ene', level: 'great' }, { name: 'Feb', level: 'great' }, { name: 'Mar', level: 'great' },
        { name: 'Abr', level: 'good' }, { name: 'May', level: 'ok' }, { name: 'Jun', level: 'bad' },
        { name: 'Jul', level: 'bad' }, { name: 'Ago', level: 'bad' }, { name: 'Sep', level: 'ok' },
        { name: 'Oct', level: 'great' }, { name: 'Nov', level: 'great' }, { name: 'Dic', level: 'great' },
      ]},
      { type: 'text', text: 'Octubre a marzo: ideal (20-28°C). El verano es abrasador (40-45°C en el sur). El Sinaí y el Mar Rojo son agradables casi todo el año.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Egipto es un país fascinante. Las Pirámides, Lúxor y el Nilo son maravillas eternas. Los egipcios son cálidos, divertidos y adoran conversar. El koshari (pasta, arroz, lentejas, cebolla frita) es el plato del pueblo. El té de menta (shai) se ofrece a toda hora.' },
    ]},
  },
  // ==================== TANZANIA ====================
  TZ: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'El autostop no está regulado en Tanzania. El transporte informal (dala-dala = minibús) es el modo principal. Los conductores paran si haces señas.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Tanzania funciona como la vecina Kenia. Los dala-dala están en todas partes y son muy baratos. El autostop gratis es posible en las carreteras de larga distancia con los camiones. Los tanzanos son acogedores.' },
      { type: 'rule', icon: '💰', text: 'Aclara "bure" (gratis) antes de subir. El transporte informal de pago es la norma.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Tanzania es segura para el autostop en las carreteras principales y de día.' },
      { type: 'sub', title: 'Usa SpotHitch para tu seguridad' },
      { type: 'rule', icon: '🛡️', text: 'Activa el Modo Guardián antes de cada viaje. Una persona de confianza sigue tu posición en tiempo real.' },
      { type: 'rule', icon: '🆘', text: 'Configura el modo SOS con tus contactos. Un toque activa una triple alerta (push, SMS, llamada).' },
      { type: 'rule', icon: '📱', text: 'Fotografía la matrícula y envíala a alguien antes de subir.' },
      { type: 'rule', icon: '🎒', text: 'Mantén tu mochila accesible (en tu regazo o a tus pies), nunca en el maletero.' },
      { type: 'sub', title: 'Consejos del país' },
      { type: 'rule', icon: '☀️', text: 'Viaja solo de día. Las carreteras principales son seguras pero poco iluminadas de noche.' },
      { type: 'rule', icon: '🗺️', text: 'Las carreteras principales (Dar es Salaam a Arusha, Dar es Salaam a Dodoma) son las más transitadas para el autostop.' },
      { type: 'sub', title: 'Números de emergencia' },
      { type: 'kv', items: [{ k: 'Emergencias', v: '112' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Tanzania es moderadamente segura para las mujeres. Las zonas turísticas (Zanzíbar, Serengueti) son seguras. Viste de forma modesta, sobre todo en Zanzíbar (musulmana).' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'El suajili y el inglés son los idiomas oficiales. El suajili es el idioma del día a día. El inglés se habla bien en las zonas turísticas.' },
      { type: 'phrase', items: [
        { local: 'Jambo / Mambo', meaning: 'Hola / ¿Qué tal? (informal)' },
        { local: 'Asante sana', meaning: 'Muchas gracias' },
        { local: 'Bure', meaning: 'Gratis' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Tanzania es moderadamente cara (safaris muy caros). Presupuesto ajustado sin safari: 15-25 €/día. Zanzíbar es turístico y más caro.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Las guesthouses son baratas (5-15 €). El camping en los parques nacionales está organizado y es seguro. Zanzíbar tiene numerosos hostels.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚐', name: 'Dala-dala', detail: 'Minibuses omnipresentes, abarrotados, baratos', price: '0,30-2 €' },
        { emoji: '⛴️', name: 'Ferry', detail: 'Dar es Salaam-Zanzíbar (2h)', price: '20-35 $' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Ene', level: 'great' }, { name: 'Feb', level: 'great' }, { name: 'Mar', level: 'ok' },
        { name: 'Abr', level: 'bad' }, { name: 'May', level: 'bad' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Ago', level: 'great' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'ok' }, { name: 'Dic', level: 'good' },
      ]},
      { type: 'text', text: 'Junio-octubre: temporada seca, ideal para safaris. Enero-febrero: gran migración en el Serengueti. Abril-mayo: grandes lluvias.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Tanzania alberga el Serengueti, el Kilimanjaro y Zanzíbar. Los masai son una comunidad emblemática. El ugali (pasta de maíz) y la nyama choma (parrilladas) son los platos cotidianos. La cultura suajili de Zanzíbar mezcla influencias africanas, árabes e indias.' },
    ]},
  },
  // ==================== TAJIKISTAN ====================
  TJ: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'El autostop es legal en Tayikistán. El transporte informal es la norma porque las carreteras son escasas y los buses casi inexistentes en el Pamir.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Tayikistán es mítico para el autostop. La Pamir Highway (M41) es una de las carreteras más altas del mundo (4.655m) y un clásico del autostop. El tráfico es bajo pero todo el mundo para. Los conductores son extremadamente acogedores.' },
      { type: 'rule', icon: '💰', text: 'Los conductores a menudo esperan un pago (gasolina cara, carreteras largas). Negociar o compartir la gasolina es normal.' },
      { type: 'rule', icon: '🏔️', text: 'La Pamir Highway necesita un GBAO permit (permiso para la región del Alto Badajshán).' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Tayikistán es seguro para el autostop. Las carreteras del Pamir son el principal riesgo (precipicios, altitud).' },
      { type: 'sub', title: 'Usa SpotHitch para tu seguridad' },
      { type: 'rule', icon: '🛡️', text: 'Activa el Modo Guardián antes de cada viaje. Una persona de confianza sigue tu posición en tiempo real.' },
      { type: 'rule', icon: '🆘', text: 'Configura el modo SOS con tus contactos. Un toque activa una triple alerta (push, SMS, llamada).' },
      { type: 'rule', icon: '📱', text: 'Fotografía la matrícula y envíala a alguien antes de subir.' },
      { type: 'rule', icon: '🎒', text: 'Mantén tu mochila accesible (en tu regazo o a tus pies), nunca en el maletero.' },
      { type: 'sub', title: 'Consejos del país' },
      { type: 'rule', icon: '🏔️', text: 'Las carreteras del Pamir son peligrosas (precipicios, sin barandillas, altitud extrema). Abróchate siempre el cinturón.' },
      { type: 'rule', icon: '💧', text: 'La altitud puede causar mal agudo de montaña. Tómate tiempo para aclimatarte y bebe mucha agua.' },
      { type: 'sub', title: 'Números de emergencia' },
      { type: 'kv', items: [{ k: 'Emergencias', v: '112' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Tayikistán es relativamente seguro para las mujeres. La sociedad es conservadora pero respetuosa. Se recomienda viajar en pareja en el Pamir.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'El tayiko (cercano al persa/farsi) es el idioma oficial. El ruso está muy extendido. El inglés es muy raro. Un ruso básico es indispensable.' },
      { type: 'phrase', items: [
        { local: 'Salom', meaning: 'Hola' },
        { local: 'Rahmat', meaning: 'Gracias' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Tayikistán es muy barato. Presupuesto ajustado: 10-20 €/día. El plov y los manty (raviolis) cuestan 1-2 €. El alojamiento en homestay en el Pamir: 10-15 € con comida.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Los homestays son la norma en el Pamir (no hay hoteles). La acampada libre es ilimitada en las montañas. Las noches son muy frías en altitud.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚗', name: 'Taxi compartido', detail: 'Principal transporte entre ciudades. Espera estar lleno.', price: '5-30 €' },
        { emoji: '🚐', name: 'Marshrutka', detail: 'Minibuses en las carreteras principales', price: '2-10 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Ene', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mar', level: 'bad' },
        { name: 'Abr', level: 'ok' }, { name: 'May', level: 'good' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Ago', level: 'great' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'good' }, { name: 'Nov', level: 'ok' }, { name: 'Dic', level: 'bad' },
      ]},
      { type: 'text', text: 'Junio a septiembre: ideal para el Pamir (pasos abiertos, temperaturas soportables). El invierno cierra los pasos y el autostop es casi imposible.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'El Pamir se apoda "el techo del mundo". Los pamiri están entre la gente más acogedora del planeta. La hospitalidad es sagrada: té, pan, mantequilla de yak se ofrecen a todo visitante. La cultura ismaelí (Aga Khan) es única. Los paisajes son impresionantes.' },
    ]},
  },
  // ==================== SOUTH KOREA ====================
  KR: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'El autostop es legal en Corea del Sur. La práctica es rara porque los transportes públicos son excelentes y baratos. Los coreanos no siempre entienden el concepto.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Corea del Sur es un caso particular. El autostop es posible pero los conductores se sorprenden. Tiempo de espera: 20-60 min. Las gasolineras (jusoyuso) en las autopistas son los mejores spots. Los coreanos que paran suelen ser muy entusiastas y generosos.' },
      { type: 'text', text: 'El país es pequeño (380 km de norte a sur) y los transportes públicos excelentes (KTX, bus). El autostop es más una aventura que una necesidad.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Corea del Sur es un país muy seguro para el autostop. Los coreanos son amables y serviciales.' },
      { type: 'sub', title: 'Usa SpotHitch para tu seguridad' },
      { type: 'rule', icon: '🛡️', text: 'Activa el Modo Guardián antes de cada viaje. Una persona de confianza sigue tu posición en tiempo real.' },
      { type: 'rule', icon: '🆘', text: 'Configura el modo SOS con tus contactos. Un toque activa una triple alerta (push, SMS, llamada).' },
      { type: 'rule', icon: '📱', text: 'Fotografía la matrícula y envíala a alguien antes de subir.' },
      { type: 'rule', icon: '🎒', text: 'Mantén tu mochila accesible (en tu regazo o a tus pies), nunca en el maletero.' },
      { type: 'sub', title: 'Consejos del país' },
      { type: 'rule', icon: '🅿️', text: 'Las áreas de descanso de autopista (hwugesil) son los mejores spots. Son cómodas y los conductores hacen paradas largas.' },
      { type: 'rule', icon: '🍜', text: 'Las áreas de descanso coreanas son legendarias por su comida. Aprovecha para recargar energías.' },
      { type: 'sub', title: 'Números de emergencia' },
      { type: 'kv', items: [{ k: 'Emergencias', v: '112' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Corea del Sur es muy segura para mujeres que viajan solas. Los incidentes son muy raros.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'El coreano es el idioma único. El alfabeto hangul es fácil de aprender (en unas horas). El inglés es limitado a pesar de la educación intensiva. Google Translate es útil.' },
      { type: 'phrase', items: [
        { local: 'Annyeonghaseyo', meaning: 'Hola' },
        { local: 'Gamsahamnida', meaning: 'Gracias' },
        { local: 'Hitchhike', meaning: 'Comprendido por los jóvenes coreanos' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Corea es moderadamente cara. Presupuesto ajustado: 25-40 €/día. El bibimbap callejero cuesta 4-6 €. Los jjimjilbangs (saunas públicos) ofrecen alojamiento barato (8-12 €).' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Los jjimjilbangs (saunas/spas públicos) son la opción económica: 8-12 € por una noche con sauna, ducha y espacio de descanso. Los moteles (motel love) son asequibles (15-30 €). El camping es posible en los parques nacionales.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚄', name: 'KTX', detail: 'Tren de alta velocidad. Seúl-Busan en 2h30.', price: '25-50 €' },
        { emoji: '🚌', name: 'Bus Express', detail: 'Red excelente y barata', price: '5-20 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Ene', level: 'bad' }, { name: 'Feb', level: 'ok' }, { name: 'Mar', level: 'good' },
        { name: 'Abr', level: 'great' }, { name: 'May', level: 'great' }, { name: 'Jun', level: 'good' },
        { name: 'Jul', level: 'bad' }, { name: 'Ago', level: 'bad' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'great' }, { name: 'Nov', level: 'good' }, { name: 'Dic', level: 'ok' },
      ]},
      { type: 'text', text: 'Abril-mayo (cerezos en flor) y septiembre-octubre (follaje de otoño): ideal. Julio-agosto: monzón (lluvias intensas). El invierno es frío (-10°C en Seúl).' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Corea del Sur es una mezcla única de tradición y ultramodernidad. El kimchi, la barbacoa coreana (samgyeopsal) y el soju son instituciones. El K-pop y los dramas han conquistado el mundo. Los coreanos son curiosos y entusiastas con los extranjeros que hacen dedo.' },
    ]},
  },
  // ==================== PAKISTAN ====================
  PK: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'El autostop es legal en Pakistán. El transporte informal es un modo de vida. Los jingle trucks (camiones decorados) llevan pasajeros con gusto.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Pakistán está considerado por muchos viajeros como el país más hospitalario del mundo. Los conductores rechazan sistemáticamente el dinero, insisten en pagar la comida y ofrecen alojamiento. Tiempo de espera: 5-15 min.' },
      { type: 'kv', items: [
        { k: 'Karakoram Highway (KKH)', v: 'Mítica. La carretera más bella del mundo.', color: 'green' },
        { k: 'Valle de Hunza', v: 'Paraíso. Todo el mundo para.', color: 'green' },
        { k: 'Baluchistán', v: 'Desaconsejado (seguridad)', color: 'red' },
      ]},
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Verifica los avisos de seguridad antes de viajar a Pakistán. El norte (Hunza, Gilgit-Baltistan) es seguro y acogedor.' },
      { type: 'sub', title: 'Usa SpotHitch para tu seguridad' },
      { type: 'rule', icon: '🛡️', text: 'Activa el Modo Guardián antes de cada viaje. Una persona de confianza sigue tu posición en tiempo real.' },
      { type: 'rule', icon: '🆘', text: 'Configura el modo SOS con tus contactos. Un toque activa una triple alerta (push, SMS, llamada).' },
      { type: 'rule', icon: '📱', text: 'Fotografía la matrícula y envíala a alguien antes de subir.' },
      { type: 'rule', icon: '🎒', text: 'Mantén tu mochila accesible (en tu regazo o a tus pies), nunca en el maletero.' },
      { type: 'sub', title: 'Consejos del país' },
      { type: 'rule', icon: '🏔️', text: 'El norte (Hunza, Gilgit-Baltistan) es seguro y los habitantes son de una hospitalidad excepcional.' },
      { type: 'rule', icon: '📋', text: 'Verifica los avisos de seguridad del Ministerio de Asuntos Exteriores antes de viajar. Algunas zonas están desaconsejadas.' },
      { type: 'sub', title: 'Números de emergencia' },
      { type: 'kv', items: [{ k: 'Emergencias', v: '15' }] },
    ]},
    women: { filterTypes: ['q', 'c', 'a'], blocks: [
      { type: 'text', text: 'Pakistán es conservador. Se recomienda shalwar kameez. Viajar en pareja con un hombre es muy recomendable. Hunza es más abierto.' },
      { type: 'rule', icon: '👕', text: 'Shalwar kameez + dupatta muy recomendable.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'El urdu es el idioma nacional. El inglés lo hablan bien los educados. El punyabí y el pastún son las lenguas regionales.' },
      { type: 'phrase', items: [
        { local: 'Assalam o alaikum', meaning: 'La paz sea contigo' },
        { local: 'Shukriya', meaning: 'Gracias' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Muy barato. Presupuesto ajustado: 8-15 €/día. Los conductores a menudo pagan la comida.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Las guesthouses: 3-10 €. Las familias invitan muy a menudo a su casa. En Hunza, los homestays son la norma.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Natco', detail: 'Bus de la KKH (Islamabad-Hunza)', price: '3-15 €' },
        { emoji: '🚛', name: 'Jingle trucks', detail: 'Camiones magníficamente decorados, lento pero cultural', price: 'A menudo gratis' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Ene', level: 'bad' }, { name: 'Feb', level: 'ok' }, { name: 'Mar', level: 'good' },
        { name: 'Abr', level: 'great' }, { name: 'May', level: 'great' }, { name: 'Jun', level: 'good' },
        { name: 'Jul', level: 'ok' }, { name: 'Ago', level: 'ok' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'great' }, { name: 'Nov', level: 'good' }, { name: 'Dic', level: 'ok' },
      ]},
      { type: 'text', text: 'Abril-mayo y septiembre-octubre: ideal para el norte. La KKH cierra a veces en invierno (Khunjerab 4.693m). El sur es abrasador en verano.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'El chai (té con leche) se ofrece a toda hora. Los conductores hacen desvíos de 100 km para ayudarte. El biryani y los naans son instituciones. El cricket es la religión nacional.' },
    ]},
  },
  // ==================== MALAYSIA ====================
  MY: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'El autostop es legal en Malasia. Los conductores paran fácilmente, sobre todo para los extranjeros.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Malasia es fácil para el autostop. Los malasios son acogedores y curiosos. Tiempo de espera: 15-30 min. Las gasolineras Petronas y Shell son los mejores spots.' },
      { type: 'kv', items: [
        { k: 'Peninsular (KL-Penang)', v: 'Buen tráfico, fácil', color: 'green' },
        { k: 'Borneo (Sabah, Sarawak)', v: 'Más difícil, menos tráfico', color: 'amber' },
      ]},
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Malasia es un país seguro para el autostop. Los malayos son acogedores y amables con los viajeros.' },
      { type: 'sub', title: 'Usa SpotHitch para tu seguridad' },
      { type: 'rule', icon: '🛡️', text: 'Activa el Modo Guardián antes de cada viaje. Una persona de confianza sigue tu posición en tiempo real.' },
      { type: 'rule', icon: '🆘', text: 'Configura el modo SOS con tus contactos. Un toque activa una triple alerta (push, SMS, llamada).' },
      { type: 'rule', icon: '📱', text: 'Fotografía la matrícula y envíala a alguien antes de subir.' },
      { type: 'rule', icon: '🎒', text: 'Mantén tu mochila accesible (en tu regazo o a tus pies), nunca en el maletero.' },
      { type: 'sub', title: 'Consejos del país' },
      { type: 'rule', icon: '🌴', text: 'La península malaya y Sarawak (Borneo) son las zonas más acogedoras para el autostop.' },
      { type: 'rule', icon: '🗣️', text: 'El inglés es ampliamente hablado. La comunicación con los conductores es fácil.' },
      { type: 'sub', title: 'Números de emergencia' },
      { type: 'kv', items: [{ k: 'Emergencias', v: '999' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Seguro para las mujeres. Sociedad multicultural y respetuosa. Vestimenta modesta en las zonas malayas/musulmanas.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Bahasa melayu oficial. El inglés está muy extendido (ex colonia británica). El mandarín y el tamil también se hablan.' },
      { type: 'phrase', items: [
        { local: 'Terima kasih', meaning: 'Gracias' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Barato. Presupuesto ajustado: 15-25 €/día. El nasi lemak: 1-2 €.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Hostels y guesthouses: 5-15 €. Camping en los parques nacionales (Taman Negara, Kinabalu).' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Bus Express', detail: 'Red extensa y barata', price: '3-15 €' },
        { emoji: '✈️', name: 'AirAsia', detail: 'Low-cost de referencia en Asia, hub KL', price: '15-50 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Ene', level: 'good' }, { name: 'Feb', level: 'great' }, { name: 'Mar', level: 'great' },
        { name: 'Abr', level: 'good' }, { name: 'May', level: 'good' }, { name: 'Jun', level: 'good' },
        { name: 'Jul', level: 'great' }, { name: 'Ago', level: 'great' }, { name: 'Sep', level: 'good' },
        { name: 'Oct', level: 'ok' }, { name: 'Nov', level: 'ok' }, { name: 'Dic', level: 'ok' },
      ]},
      { type: 'text', text: 'Tropical todo el año (28-33°C). Costa este: monzón noviembre-febrero. Costa oeste practicable todo el año.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Crisol de culturas: mezquitas, templos chinos, templos hindúes coexisten. La comida es el cemento social: mamak, hawker centers. El teh tarik (té tirado) es el arte nacional.' },
    ]},
  },
  // ==================== TAIWAN ====================
  TW: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'El autostop es legal en Taiwán. Los taiwaneses son extremadamente acogedores y paran fácilmente para los extranjeros.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Taiwán es excelente para el autostop. Los taiwaneses son curiosos y adoran ayudar. Tiempo de espera: 10-20 min. El país es pequeño (395 km) y los conductores hacen desvíos para ayudarte.' },
      { type: 'text', text: 'La costa este (garganta de Taroko, Hualien, Taitung) es la más panorámica. Las áreas de descanso en las autopistas son los mejores spots.' },
      { type: 'tip', text: '💡 Los taiwaneses a menudo invitan a comer, visitar y dormir en su casa. Ofrece un regalo de tu país.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Taiwán es un país muy seguro para el autostop. Los taiwaneses son extremadamente acogedores.' },
      { type: 'sub', title: 'Usa SpotHitch para tu seguridad' },
      { type: 'rule', icon: '🛡️', text: 'Activa el Modo Guardián antes de cada viaje. Una persona de confianza sigue tu posición en tiempo real.' },
      { type: 'rule', icon: '🆘', text: 'Configura el modo SOS con tus contactos. Un toque activa una triple alerta (push, SMS, llamada).' },
      { type: 'rule', icon: '📱', text: 'Fotografía la matrícula y envíala a alguien antes de subir.' },
      { type: 'rule', icon: '🎒', text: 'Mantén tu mochila accesible (en tu regazo o a tus pies), nunca en el maletero.' },
      { type: 'sub', title: 'Consejos del país' },
      { type: 'rule', icon: '🤝', text: 'Los taiwaneses son extremadamente acogedores. A menudo hacen desvíos para llevarte a tu destino.' },
      { type: 'rule', icon: '🏪', text: 'Los konbini (7-Eleven, FamilyMart) están por todas partes y son perfectos para descansar o cargar tu teléfono.' },
      { type: 'sub', title: 'Números de emergencia' },
      { type: 'kv', items: [{ k: 'Policía', v: '110' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Muy seguro para las mujeres. Sociedad progresista (primer matrimonio igualitario legalizado en Asia, 2019).' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Mandarín (caracteres tradicionales). Inglés limitado fuera de Taipéi. Google Translate útil.' },
      { type: 'phrase', items: [
        { local: 'Nǐ hǎo', meaning: 'Hola' },
        { local: 'Xièxiè', meaning: 'Gracias' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Moderadamente caro. Presupuesto ajustado: 20-35 €/día. Los mercados nocturnos: comida 2-4 €.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Hostels: 10-20 €. Camping en las montañas. Los templos a veces acogen viajeros.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚄', name: 'THSR (AVE)', detail: 'Taipéi-Kaohsiung en 1h30', price: '15-40 €' },
        { emoji: '🚂', name: 'TRA', detail: 'Tren local, costa este magnífica', price: '3-15 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Ene', level: 'ok' }, { name: 'Feb', level: 'ok' }, { name: 'Mar', level: 'good' },
        { name: 'Abr', level: 'great' }, { name: 'May', level: 'great' }, { name: 'Jun', level: 'ok' },
        { name: 'Jul', level: 'bad' }, { name: 'Ago', level: 'bad' }, { name: 'Sep', level: 'ok' },
        { name: 'Oct', level: 'great' }, { name: 'Nov', level: 'great' }, { name: 'Dic', level: 'good' },
      ]},
      { type: 'text', text: 'Abril-mayo y octubre-noviembre: ideal. Tifones julio-septiembre. Invierno suave (15-20°C).' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Mercados nocturnos entre los mejores del mundo. El bubble tea se inventó aquí. Templos espectaculares. Gente entre la más amable de Asia.' },
    ]},
  },
  // ==================== LEBANON ====================
  LB: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'El autostop es legal en Líbano. El service (taxi compartido) es el transporte principal. Levantar la mano para coches.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Líbano es pequeño (170 km) y fácil para el autostop. Los libaneses son extremadamente acogedores. Tiempo de espera: 5-15 min. El service (taxi compartido) es tan barato que el autostop gratis es un lujo.' },
      { type: 'rule', icon: '💰', text: 'Muchos coches que paran son services (taxis compartidos). Aclara si es gratis.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Verifica la situación de seguridad antes de viajar al Líbano. Las zonas turísticas (Beirut, Biblos) son las más estables.' },
      { type: 'sub', title: 'Usa SpotHitch para tu seguridad' },
      { type: 'rule', icon: '🛡️', text: 'Activa el Modo Guardián antes de cada viaje. Una persona de confianza sigue tu posición en tiempo real.' },
      { type: 'rule', icon: '🆘', text: 'Configura el modo SOS con tus contactos. Un toque activa una triple alerta (push, SMS, llamada).' },
      { type: 'rule', icon: '📱', text: 'Fotografía la matrícula y envíala a alguien antes de subir.' },
      { type: 'rule', icon: '🎒', text: 'Mantén tu mochila accesible (en tu regazo o a tus pies), nunca en el maletero.' },
      { type: 'sub', title: 'Consejos del país' },
      { type: 'rule', icon: '📋', text: 'Verifica la situación de seguridad antes de cualquier desplazamiento. La situación evoluciona regularmente.' },
      { type: 'rule', icon: '🤝', text: 'Los libaneses son hospitalarios y políglotas. La comunicación es fácil.' },
      { type: 'sub', title: 'Números de emergencia' },
      { type: 'kv', items: [{ k: 'Emergencias', v: '112' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Líbano es el país más liberal del Levante. Beirut es cosmopolita. El acoso es menos intenso que en los países vecinos.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Árabe libanés, francés muy extendido, inglés también. Muchos hablan 3 idiomas.' },
      { type: 'phrase', items: [
        { local: 'Kifak/Kifik?', meaning: '¿Cómo estás?' },
        { local: 'Merci ktir', meaning: 'Muchas gracias' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Crisis económica. Presupuesto ajustado en dólares: 15-30 €/día. Shawarma callejero: 1-2 $.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Hostels: 10-20 $. Camping en las montañas (Qadisha, Cedros). Los libaneses invitan fácilmente.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚐', name: 'Service / Van', detail: 'Taxis compartidos, transporte principal', price: '0,50-3 $' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Ene', level: 'ok' }, { name: 'Feb', level: 'ok' }, { name: 'Mar', level: 'good' },
        { name: 'Abr', level: 'great' }, { name: 'May', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'good' }, { name: 'Ago', level: 'good' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'great' }, { name: 'Nov', level: 'good' }, { name: 'Dic', level: 'ok' },
      ]},
      { type: 'text', text: 'Abril-junio y septiembre-noviembre: ideal. Esquiar por la mañana, playa por la tarde (dicho libanés).' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Mezquitas e iglesias una al lado de otra. Cocina libanesa entre las mejores del mundo (mezze, tabulé, hummus). Vida nocturna en Beirut. Café y narguile son instituciones.' },
    ]},
  },
  // ==================== PANAMA ====================
  PA: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'El autostop es legal en Panamá. Práctica habitual en zona rural. Hub de tránsito entre Américas.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Panamá es factible en autostop. La Panamericana cruza el país con buen tráfico. Tiempo de espera: 15-30 min.' },
      { type: 'warn', text: '⚠️ El Tapón del Darién es una selva sin carretera entre Panamá y Colombia. Paso en barco o avión únicamente.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Panamá es un país seguro para el autostop. La Panamericana es el eje principal.' },
      { type: 'sub', title: 'Usa SpotHitch para tu seguridad' },
      { type: 'rule', icon: '🛡️', text: 'Activa el Modo Guardián antes de cada viaje. Una persona de confianza sigue tu posición en tiempo real.' },
      { type: 'rule', icon: '🆘', text: 'Configura el modo SOS con tus contactos. Un toque activa una triple alerta (push, SMS, llamada).' },
      { type: 'rule', icon: '📱', text: 'Fotografía la matrícula y envíala a alguien antes de subir.' },
      { type: 'rule', icon: '🎒', text: 'Mantén tu mochila accesible (en tu regazo o a tus pies), nunca en el maletero.' },
      { type: 'sub', title: 'Consejos del país' },
      { type: 'rule', icon: '⛽', text: 'Las gasolineras a lo largo de la Panamericana son los mejores spots para el autostop.' },
      { type: 'rule', icon: '🌴', text: 'Las zonas turísticas (Bocas del Toro, Boquete, San Blas) son seguras y acogedoras.' },
      { type: 'sub', title: 'Números de emergencia' },
      { type: 'kv', items: [{ k: 'Emergencias', v: '911' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Moderadamente seguro para las mujeres. Zonas turísticas seguras.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Español principal. Inglés bastante extendido (influencia americana del canal).' },
      { type: 'phrase', items: [
        { local: '¿Me da un ride?', meaning: '¿Me lleva?' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Dólar americano. Más caro que los vecinos. Presupuesto ajustado: 20-35 $/día.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Hostels en Bocas del Toro y Boquete: 8-15 $. Camping en las islas San Blas.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚌', name: 'Bus', detail: 'Red extensa', price: '2-15 $' },
        { emoji: '⛴️', name: 'Velero hacia Colombia', detail: '5 días vía San Blas', price: '350-500 $' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Ene', level: 'great' }, { name: 'Feb', level: 'great' }, { name: 'Mar', level: 'great' },
        { name: 'Abr', level: 'good' }, { name: 'May', level: 'ok' }, { name: 'Jun', level: 'ok' },
        { name: 'Jul', level: 'ok' }, { name: 'Ago', level: 'ok' }, { name: 'Sep', level: 'bad' },
        { name: 'Oct', level: 'bad' }, { name: 'Nov', level: 'ok' }, { name: 'Dic', level: 'great' },
      ]},
      { type: 'text', text: 'Diciembre-abril: temporada seca. Mayo-noviembre: lluvias por la tarde.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'El canal de Panamá es una maravilla de ingeniería. Los kunas viven en islas paradisíacas (San Blas) con su propio gobierno. El ceviche y el ron son pilares de la gastronomía.' },
    ]},
  },
  // ==================== GHANA ====================
  GH: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'El transporte informal (tro-tros) es el modo principal. El autostop gratis es posible pero el transporte de pago es la norma.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Ghana es uno de los países más acogedores de África Occidental. Los tro-tros son omnipresentes y muy baratos. El autostop gratis funciona con camiones y pickups en zona rural.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Ghana es un país seguro y estable para el autostop. Los ghaneses son acogedores y alegres.' },
      { type: 'sub', title: 'Usa SpotHitch para tu seguridad' },
      { type: 'rule', icon: '🛡️', text: 'Activa el Modo Guardián antes de cada viaje. Una persona de confianza sigue tu posición en tiempo real.' },
      { type: 'rule', icon: '🆘', text: 'Configura el modo SOS con tus contactos. Un toque activa una triple alerta (push, SMS, llamada).' },
      { type: 'rule', icon: '📱', text: 'Fotografía la matrícula y envíala a alguien antes de subir.' },
      { type: 'rule', icon: '🎒', text: 'Mantén tu mochila accesible (en tu regazo o a tus pies), nunca en el maletero.' },
      { type: 'sub', title: 'Consejos del país' },
      { type: 'rule', icon: '⛽', text: 'Las gasolineras son spots fiables para encontrar un viaje con total seguridad.' },
      { type: 'rule', icon: '🌍', text: 'Ghana es uno de los países más estables y acogedores de África occidental.' },
      { type: 'sub', title: 'Números de emergencia' },
      { type: 'kv', items: [{ k: 'Policía', v: '191' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Relativamente seguro para las mujeres. Sociedad respetuosa.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Inglés oficial y ampliamente hablado. El twi (akan) es el idioma local principal.' },
      { type: 'phrase', items: [
        { local: 'Akwaaba', meaning: 'Bienvenido (twi)' },
        { local: 'Medaase', meaning: 'Gracias (twi)' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Moderadamente caro para África. Presupuesto ajustado: 15-25 €/día. El jollof rice: 1-3 €.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Guesthouses: 5-15 €. Camping posible en las playas de Cape Coast.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚐', name: 'Tro-tro', detail: 'Minibuses omnipresentes, baratos', price: '0,50-3 €' },
        { emoji: '🚌', name: 'STC / VIP Bus', detail: 'Más cómodos', price: '3-10 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Ene', level: 'great' }, { name: 'Feb', level: 'great' }, { name: 'Mar', level: 'good' },
        { name: 'Abr', level: 'ok' }, { name: 'May', level: 'ok' }, { name: 'Jun', level: 'bad' },
        { name: 'Jul', level: 'ok' }, { name: 'Ago', level: 'ok' }, { name: 'Sep', level: 'ok' },
        { name: 'Oct', level: 'ok' }, { name: 'Nov', level: 'great' }, { name: 'Dic', level: 'great' },
      ]},
      { type: 'text', text: 'Noviembre-marzo: temporada seca, ideal. Mayo-junio: gran temporada de lluvias.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: '"Puerta de retorno" para la diáspora africana (Cape Coast Castle). El jollof rice es un orgullo nacional. El kente cloth es el tejido tradicional. Democracia estable.' },
    ]},
  },
  // ==================== UGANDA ====================
  UG: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Transporte informal (boda-bodas, matatus) omnipresente. El autostop gratis funciona con los camiones.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: '"La Perla de África" es acogedora. Los camiones en las carreteras principales llevan pasajeros. Los boda-bodas están en todas partes pero son peligrosos.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Uganda es segura para el autostop en las carreteras principales. Los ugandeses son acogedores y curiosos.' },
      { type: 'sub', title: 'Usa SpotHitch para tu seguridad' },
      { type: 'rule', icon: '🛡️', text: 'Activa el Modo Guardián antes de cada viaje. Una persona de confianza sigue tu posición en tiempo real.' },
      { type: 'rule', icon: '🆘', text: 'Configura el modo SOS con tus contactos. Un toque activa una triple alerta (push, SMS, llamada).' },
      { type: 'rule', icon: '📱', text: 'Fotografía la matrícula y envíala a alguien antes de subir.' },
      { type: 'rule', icon: '🎒', text: 'Mantén tu mochila accesible (en tu regazo o a tus pies), nunca en el maletero.' },
      { type: 'sub', title: 'Consejos del país' },
      { type: 'rule', icon: '⛽', text: 'Las estaciones Total están bien repartidas y constituyen excelentes spots para encontrar un viaje.' },
      { type: 'rule', icon: '🤝', text: 'Los ugandeses son acogedores y curiosos. Una sonrisa y algunas palabras bastan para crear contacto.' },
      { type: 'sub', title: 'Números de emergencia' },
      { type: 'kv', items: [{ k: 'Emergencias', v: '999' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Moderadamente seguro. Zonas turísticas seguras. Vestimenta modesta en zona rural.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Inglés y suajili oficiales. Inglés bien hablado. Luganda idioma local principal.' },
      { type: 'phrase', items: [
        { local: 'Oli otya?', meaning: '¿Cómo estás? (luganda)' },
        { local: 'Webale', meaning: 'Gracias' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Barato (excepto gorilas: 700 $/permiso). Presupuesto ajustado: 15-25 €/día. El rolex (chapati+tortilla): 0,50 €.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Guesthouses: 5-15 €. Camping en los parques nacionales (organizado y seguro).' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🏍️', name: 'Boda-boda', detail: 'Moto-taxis omnipresentes, rápidos pero peligrosos', price: '0,30-3 €' },
        { emoji: '🚐', name: 'Matatu', detail: 'Minibuses entre ciudades', price: '2-8 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Ene', level: 'great' }, { name: 'Feb', level: 'great' }, { name: 'Mar', level: 'ok' },
        { name: 'Abr', level: 'bad' }, { name: 'May', level: 'bad' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Ago', level: 'great' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'ok' }, { name: 'Nov', level: 'bad' }, { name: 'Dic', level: 'good' },
      ]},
      { type: 'text', text: 'Junio-septiembre y diciembre-febrero: temporadas secas.' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: '"La perla de África" (Churchill). Gorilas de montaña (Bwindi), chimpancés (Kibale), fuentes del Nilo (Jinja).' },
    ]},
  },
  // ==================== RWANDA ====================
  RW: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'El autostop no es tradicional pero el país es pequeño y muy bien organizado. Los moto-taxis y buses son el transporte principal.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'El país más limpio y organizado de África. Pequeño (26.000 km²) y se cruza en unas horas. Los moto-taxis son omnipresentes y baratos.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Ruanda es un país muy seguro para el autostop. Las carreteras son de las mejores de África.' },
      { type: 'sub', title: 'Usa SpotHitch para tu seguridad' },
      { type: 'rule', icon: '🛡️', text: 'Activa el Modo Guardián antes de cada viaje. Una persona de confianza sigue tu posición en tiempo real.' },
      { type: 'rule', icon: '🆘', text: 'Configura el modo SOS con tus contactos. Un toque activa una triple alerta (push, SMS, llamada).' },
      { type: 'rule', icon: '📱', text: 'Fotografía la matrícula y envíala a alguien antes de subir.' },
      { type: 'rule', icon: '🎒', text: 'Mantén tu mochila accesible (en tu regazo o a tus pies), nunca en el maletero.' },
      { type: 'sub', title: 'Consejos del país' },
      { type: 'rule', icon: '🛣️', text: 'Las carreteras ruandesas son de las mejores de África. Están bien mantenidas y señalizadas.' },
      { type: 'rule', icon: '🌿', text: 'El país es apodado "el país de las mil colinas". Los paisajes son magníficos y la seguridad es excelente.' },
      { type: 'sub', title: 'Números de emergencia' },
      { type: 'kv', items: [{ k: 'Emergencias', v: '112' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Seguro para las mujeres. Mayor tasa de mujeres en el parlamento del mundo (>60%).' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Kinyarwanda, francés e inglés oficiales. Los tres se usan.' },
      { type: 'phrase', items: [
        { local: 'Muraho', meaning: 'Hola' },
        { local: 'Murakoze', meaning: 'Gracias' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Moderadamente caro. Presupuesto ajustado: 20-30 €/día. Gorilas: 1.500 $/permiso.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Guesthouses: 10-20 €. Escena hostel en desarrollo en Kigali.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🏍️', name: 'Moto-taxi', detail: 'Transporte principal, cascos obligatorios', price: '0,30-2 €' },
        { emoji: '🚌', name: 'Bus', detail: 'Buses modernos entre ciudades', price: '2-8 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Ene', level: 'great' }, { name: 'Feb', level: 'great' }, { name: 'Mar', level: 'ok' },
        { name: 'Abr', level: 'bad' }, { name: 'May', level: 'bad' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Ago', level: 'great' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'ok' }, { name: 'Nov', level: 'bad' }, { name: 'Dic', level: 'good' },
      ]},
      { type: 'text', text: 'Junio-septiembre y diciembre-febrero: temporadas secas. Clima templado todo el año (20-27°C).' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: 'Transformación notable desde 1994. Bolsas de plástico prohibidas desde 2008. Umuganda (trabajo comunitario mensual). Gorilas (Volcanoes NP). Café excelente.' },
    ]},
  },
  // ==================== MALAWI ====================
  MW: {
    laws: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'El autostop es legal. "El corazón cálido de África": acogida excepcional.' },
    ]},
    hitchhiking: { filterTypes: ['q', 'c', 'b'], blocks: [
      { type: 'text', text: 'Uno de los mejores países de África para el autostop. Los malauíes son extraordinariamente acogedores. Tiempo de espera: 15-30 min. Camiones y pickups paran fácilmente.' },
      { type: 'text', text: 'El lago Malaui (3° más grande de África) es la atracción principal.' },
    ]},
    safety: { filterTypes: ['c', 'a'], blocks: [
      { type: 'text', text: 'Malaui es un país seguro y acogedor para el autostop. Los malauíes son famosos por su hospitalidad.' },
      { type: 'sub', title: 'Usa SpotHitch para tu seguridad' },
      { type: 'rule', icon: '🛡️', text: 'Activa el Modo Guardián antes de cada viaje. Una persona de confianza sigue tu posición en tiempo real.' },
      { type: 'rule', icon: '🆘', text: 'Configura el modo SOS con tus contactos. Un toque activa una triple alerta (push, SMS, llamada).' },
      { type: 'rule', icon: '📱', text: 'Fotografía la matrícula y envíala a alguien antes de subir.' },
      { type: 'rule', icon: '🎒', text: 'Mantén tu mochila accesible (en tu regazo o a tus pies), nunca en el maletero.' },
      { type: 'sub', title: 'Consejos del país' },
      { type: 'rule', icon: '🤝', text: 'Los malauíes son famosos por su acogida cálida. El contacto se establece de forma natural.' },
      { type: 'rule', icon: '🌊', text: 'El lago Malaui es la joya del país. Las carreteras que lo bordean son agradables y bien transitadas.' },
      { type: 'sub', title: 'Números de emergencia' },
      { type: 'kv', items: [{ k: 'Policía', v: '990' }] },
    ]},
    women: { filterTypes: ['q', 'c'], blocks: [
      { type: 'text', text: 'Seguro para las mujeres. "El corazón cálido de África" se aplica a todos.' },
    ]},
    language: { filterTypes: ['c', 'q'], blocks: [
      { type: 'text', text: 'Inglés y chichewa oficiales. Inglés bien hablado.' },
      { type: 'phrase', items: [
        { local: 'Moni', meaning: 'Hola' },
        { local: 'Zikomo', meaning: 'Gracias' },
      ]},
    ]},
    budget: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Muy barato. Presupuesto ajustado: 10-20 €/día. El nsima con relish: < 1 €.' },
    ]},
    sleep: { filterTypes: ['b', 'q'], blocks: [
      { type: 'text', text: 'Lodges y guesthouses: 5-15 €. Camping en las playas del lago Malaui: magnífico.' },
    ]},
    transport: { filterTypes: ['c', 'b'], blocks: [
      { type: 'transport', items: [
        { emoji: '🚐', name: 'Minibús', detail: 'Transporte principal, esperan estar llenos', price: '1-5 €' },
        { emoji: '⛴️', name: 'Ilala Ferry', detail: 'Ferry mítico por el lago (3 días)', price: '5-20 €' },
      ]},
    ]},
    season: { filterTypes: ['c', 'q'], blocks: [
      { type: 'season', months: [
        { name: 'Ene', level: 'bad' }, { name: 'Feb', level: 'bad' }, { name: 'Mar', level: 'ok' },
        { name: 'Abr', level: 'good' }, { name: 'May', level: 'great' }, { name: 'Jun', level: 'great' },
        { name: 'Jul', level: 'great' }, { name: 'Ago', level: 'great' }, { name: 'Sep', level: 'great' },
        { name: 'Oct', level: 'great' }, { name: 'Nov', level: 'good' }, { name: 'Dic', level: 'ok' },
      ]},
      { type: 'text', text: 'Mayo-octubre: temporada seca, ideal. Lago bañable todo el año (24-28°C).' },
    ]},
    culture: { filterTypes: ['c', 'b'], blocks: [
      { type: 'text', text: '"El corazón cálido de África" no es un eslogan vacío. Lago Malaui = paraíso de agua dulce. Gule Wamkulu (danza de máscaras chewa, UNESCO).' },
    ]},
  },
}
