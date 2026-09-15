export const LISBON_CENTER = [38.7223, -9.1393];

export const NEIGHBOURHOOD_COORDS = {
  Alfama: [38.7139, -9.1292],
  Baixa: [38.7092, -9.1364],
  Chiado: [38.7107, -9.1427],
  Belém: [38.697, -9.2033],
  Alcântara: [38.7053, -9.178],
  Graça: [38.7167, -9.13],
  "Príncipe Real": [38.715, -9.149],
  "Campo de Ourique": [38.7145, -9.165],
  "Parque das Nações": [38.768, -9.094],
  Areeiro: [38.742, -9.131],
  Benfica: [38.753, -9.208],
  Arroios: [38.728, -9.133],
};

function hashToInt(id) {
  const str = String(id);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return hash;
}

// Deterministic small offset so listings in the same neighbourhood don't
// stack exactly on top of each other on the map.
export function jitterCoords([lat, lng], id) {
  const n = hashToInt(id);
  const seedA = (n * 9301 + 49297) % 233280;
  const seedB = (n * 33329 + 5237) % 233280;
  const offsetA = (seedA / 233280 - 0.5) * 0.012;
  const offsetB = (seedB / 233280 - 0.5) * 0.012;
  return [lat + offsetA, lng + offsetB];
}
