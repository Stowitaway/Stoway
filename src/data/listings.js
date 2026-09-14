export const ROOM_TYPES = [
  { value: "cellar", icon: "🧺" },
  { value: "garage", icon: "🚗" },
  { value: "storage", icon: "📦" },
  { value: "parking", icon: "🅿️" },
];

export const NEIGHBOURHOODS = [
  "Alfama",
  "Baixa",
  "Chiado",
  "Belém",
  "Alcântara",
  "Graça",
  "Príncipe Real",
  "Campo de Ourique",
  "Parque das Nações",
  "Areeiro",
  "Benfica",
  "Arroios",
];

export function localizedText(field, locale) {
  if (typeof field === "string") return field;
  return field[locale] ?? field.en;
}

export const INITIAL_LISTINGS = [
  {
    id: 1,
    neighbourhood: "Alfama",
    type: "cellar",
    size: 8,
    price: 45,
    host: "Mariana",
    title: {
      en: "Dry cellar room near Sé Catedral",
      pt: "Cave seca perto da Sé Catedral",
      de: "Trockener Kellerraum nahe Sé Catedral",
      it: "Cantina asciutta vicino alla Sé Catedral",
    },
    description: {
      en: "Quiet, dry cellar room on the ground floor of an old building. Great for furniture, boxes or seasonal items. Level access via the courtyard.",
      pt: "Cave seca e sossegada no rés-do-chão de um prédio antigo. Ótima para móveis, caixas ou artigos sazonais. Acesso direto pelo pátio.",
      de: "Ruhiger, trockener Kellerraum im Erdgeschoss eines Altbaus. Ideal für Möbel, Kisten oder Saisonware. Ebenerdiger Zugang über den Innenhof.",
      it: "Cantina tranquilla e asciutta al piano terra di un edificio d'epoca. Ideale per mobili, scatole o articoli stagionali. Accesso in piano dal cortile.",
    },
  },
  {
    id: 2,
    neighbourhood: "Belém",
    type: "garage",
    size: 15,
    price: 80,
    host: "João",
    title: {
      en: "Garage spot with roller door",
      pt: "Garagem com portão basculante",
      de: "Garagenstellplatz mit Rolltor",
      it: "Garage con serranda elettrica",
    },
    description: {
      en: "Lockable garage with electric roller door, accessible year-round. Room for a bike, tools or moving boxes.",
      pt: "Garagem fechada com portão elétrico, acessível todo o ano. Espaço para bicicleta, ferramentas ou caixas de mudança.",
      de: "Abschließbare Garage mit elektrischem Rolltor, ganzjährig zugänglich. Platz für Fahrrad, Werkzeug oder Umzugskartons.",
      it: "Garage chiudibile a chiave con serranda elettrica, accessibile tutto l'anno. Spazio per bici, attrezzi o scatoloni per il trasloco.",
    },
  },
  {
    id: 3,
    neighbourhood: "Baixa",
    type: "storage",
    size: 12,
    price: 60,
    host: "Sofia",
    title: {
      en: "Basement storage room, CCTV monitored",
      pt: "Arrecadação na cave, com videovigilância",
      de: "Lagerraum im Souterrain, videoüberwacht",
      it: "Ripostiglio nel seminterrato, con videosorveglianza",
    },
    description: {
      en: "Secure storage room with CCTV and your own key. Centrally located, accessible around the clock.",
      pt: "Arrecadação segura com videovigilância e chave própria. Localização central, acesso 24 horas.",
      de: "Sicherer Lagerraum mit Videoüberwachung und eigenem Schlüssel. Zentral gelegen, Zugang rund um die Uhr möglich.",
      it: "Ripostiglio sicuro con videosorveglianza e chiave personale. Posizione centrale, accessibile 24 ore su 24.",
    },
  },
  {
    id: 4,
    neighbourhood: "Chiado",
    type: "parking",
    size: 10,
    price: 70,
    host: "Pedro",
    title: {
      en: "Parking spot with extra storage",
      pt: "Lugar de estacionamento com arrumação extra",
      de: "Parkplatz mit Zusatzstauraum",
      it: "Posto auto con spazio extra",
    },
    description: {
      en: "Private outdoor parking spot with a small lockable cabinet on the side for extra luggage or tyres.",
      pt: "Lugar de estacionamento privado ao ar livre, com um pequeno armário fechado à parte para bagagem ou pneus.",
      de: "Privater Außenstellplatz mit kleinem, abschließbarem Schrank an der Seite für zusätzliches Gepäck oder Reifen.",
      it: "Posto auto privato all'aperto con un piccolo armadietto chiudibile a lato per bagagli extra o pneumatici.",
    },
  },
  {
    id: 5,
    neighbourhood: "Graça",
    type: "cellar",
    size: 20,
    price: 95,
    host: "Beatriz",
    title: {
      en: "Spacious cellar with shelving",
      pt: "Cave espaçosa com prateleiras",
      de: "Geräumiger Keller mit Regalen",
      it: "Cantina spaziosa con scaffalature",
    },
    description: {
      en: "Large cellar room already fitted with sturdy metal shelving. Perfect for long-term storage.",
      pt: "Cave grande já equipada com prateleiras metálicas resistentes. Perfeita para armazenamento de longa duração.",
      de: "Großer Kellerraum, bereits mit stabilen Metallregalen ausgestattet. Perfekt für Langzeit-Einlagerung.",
      it: "Ampia cantina già dotata di solide scaffalature in metallo. Perfetta per il deposito a lungo termine.",
    },
  },
  {
    id: 6,
    neighbourhood: "Campo de Ourique",
    type: "garage",
    size: 28,
    price: 120,
    host: "Carlos",
    title: {
      en: "Double garage, dividable",
      pt: "Garagem dupla, divisível",
      de: "Doppelgarage, teilbar",
      it: "Garage doppio, divisibile",
    },
    description: {
      en: "Large double garage, can be split with a partition on request. Fits furniture from a whole house move or a car plus storage.",
      pt: "Garagem dupla grande, divisível com uma mamparra a pedido. Cabe a mobília de uma mudança inteira ou um carro mais arrumação.",
      de: "Große Doppelgarage, auf Wunsch mit Trennwand teilbar. Geeignet für Möbel eines ganzen Umzugs oder ein Fahrzeug plus Stauraum.",
      it: "Ampio garage doppio, divisibile con una parete a richiesta. Adatto ai mobili di un intero trasloco o a un'auto più spazio di deposito.",
    },
  },
  {
    id: 7,
    neighbourhood: "Arroios",
    type: "storage",
    size: 5,
    price: 30,
    host: "Inês",
    title: {
      en: "Small storage nook in the courtyard",
      pt: "Pequena arrecadação no pátio",
      de: "Kleiner Verschlag im Innenhof",
      it: "Piccolo ripostiglio nel cortile",
    },
    description: {
      en: "Compact, dry storage nook in the shared courtyard. Great for boxes, suitcases or bicycles.",
      pt: "Arrecadação compacta e seca no pátio comum. Ótima para caixas, malas ou bicicletas.",
      de: "Kompakter, trockener Verschlag im gemeinsamen Innenhof. Ideal für Kartons, Koffer oder Fahrräder.",
      it: "Ripostiglio compatto e asciutto nel cortile condominiale. Ideale per scatole, valigie o biciclette.",
    },
  },
  {
    id: 8,
    neighbourhood: "Parque das Nações",
    type: "parking",
    size: 12,
    price: 65,
    host: "Rui",
    title: {
      en: "Parking spot near Oriente metro",
      pt: "Lugar de estacionamento perto do metro Oriente",
      de: "Stellplatz nahe Metro Oriente",
      it: "Posto auto vicino alla metro Oriente",
    },
    description: {
      en: "Covered parking spot in an underground garage, walking distance to the metro. Accessible 24/7 with a keycard.",
      pt: "Lugar coberto numa garagem subterrânea, a poucos passos do metro. Acesso 24 horas com cartão.",
      de: "Überdachter Stellplatz in Tiefgarage, fußläufig zur Metro. Rund um die Uhr per Chipkarte erreichbar.",
      it: "Posto auto coperto in garage sotterraneo, a pochi passi dalla metro. Accessibile 24 ore su 24 con tessera magnetica.",
    },
  },
];
