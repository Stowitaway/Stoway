// Roughly covers the Lisbon metro area (left,top,right,bottom) to bias results.
const LISBON_VIEWBOX = "-9.25,38.80,-9.05,38.68";

export async function geocodeAddress(address) {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("format", "json");
  url.searchParams.set("q", address);
  url.searchParams.set("limit", "1");
  url.searchParams.set("viewbox", LISBON_VIEWBOX);
  url.searchParams.set("bounded", "1");

  const res = await fetch(url);
  if (!res.ok) throw new Error("Geocoding request failed");
  const results = await res.json();
  if (!results.length) return null;
  return { lat: parseFloat(results[0].lat), lng: parseFloat(results[0].lon) };
}

// Randomly offsets a coordinate within `radiusMeters` so the exact address
// can't be reverse-engineered from the stored, public marker position.
export function fuzzLocation({ lat, lng }, radiusMeters = 130) {
  const angle = Math.random() * 2 * Math.PI;
  const distance = Math.random() * radiusMeters;
  const dLat = (distance * Math.cos(angle)) / 111320;
  const dLng =
    (distance * Math.sin(angle)) / (111320 * Math.cos((lat * Math.PI) / 180));
  return { lat: lat + dLat, lng: lng + dLng };
}
