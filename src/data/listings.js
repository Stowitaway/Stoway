export const ROOM_TYPES = [
  { value: "cellar", label: "Keller", icon: "🧺" },
  { value: "garage", label: "Garage", icon: "🚗" },
  { value: "storage", label: "Lagerraum", icon: "📦" },
  { value: "parking", label: "Parkplatz", icon: "🅿️" },
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

export const INITIAL_LISTINGS = [
  {
    id: 1,
    title: "Trockener Kellerraum nahe Sé Catedral",
    neighbourhood: "Alfama",
    type: "cellar",
    size: 8,
    price: 45,
    description:
      "Ruhiger, trockener Kellerraum im Erdgeschoss eines Altbaus. Ideal für Möbel, Kisten oder Saisonware. Ebenerdiger Zugang über den Innenhof.",
    host: "Mariana",
  },
  {
    id: 2,
    title: "Garagenstellplatz mit Rolltor",
    neighbourhood: "Belém",
    type: "garage",
    size: 15,
    price: 80,
    description:
      "Abschließbare Garage mit elektrischem Rolltor, ganzjährig zugänglich. Platz für Fahrrad, Werkzeug oder Umzugskartons.",
    host: "João",
  },
  {
    id: 3,
    title: "Lagerraum im Souterrain, videoüberwacht",
    neighbourhood: "Baixa",
    type: "storage",
    size: 12,
    price: 60,
    description:
      "Sicherer Lagerraum mit Videoüberwachung und eigenem Schlüssel. Zentral gelegen, Zugang rund um die Uhr möglich.",
    host: "Sofia",
  },
  {
    id: 4,
    title: "Parkplatz mit Zusatzstauraum",
    neighbourhood: "Chiado",
    type: "parking",
    size: 10,
    price: 70,
    description:
      "Privater Außenstellplatz mit kleinem, abschließbarem Schrank an der Seite für zusätzliches Gepäck oder Reifen.",
    host: "Pedro",
  },
  {
    id: 5,
    title: "Geräumiger Keller mit Regalen",
    neighbourhood: "Graça",
    type: "cellar",
    size: 20,
    price: 95,
    description:
      "Großer Kellerraum, bereits mit stabilen Metallregalen ausgestattet. Perfekt für Langzeit-Einlagerung.",
    host: "Beatriz",
  },
  {
    id: 6,
    title: "Doppelgarage, teilbar",
    neighbourhood: "Campo de Ourique",
    type: "garage",
    size: 28,
    price: 120,
    description:
      "Große Doppelgarage, auf Wunsch mit Trennwand teilbar. Geeignet für Möbel eines ganzen Umzugs oder ein Fahrzeug plus Stauraum.",
    host: "Carlos",
  },
  {
    id: 7,
    title: "Kleiner Verschlag im Innenhof",
    neighbourhood: "Arroios",
    type: "storage",
    size: 5,
    price: 30,
    description:
      "Kompakter, trockener Verschlag im gemeinsamen Innenhof. Ideal für Kartons, Koffer oder Fahrräder.",
    host: "Inês",
  },
  {
    id: 8,
    title: "Stellplatz nahe Metro Oriente",
    neighbourhood: "Parque das Nações",
    type: "parking",
    size: 12,
    price: 65,
    description:
      "Überdachter Stellplatz in Tiefgarage, fußläufig zur Metro. Rund um die Uhr per Chipkarte erreichbar.",
    host: "Rui",
  },
];
