import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { localizedText } from "../data/listings";
import {
  LISBON_CENTER,
  NEIGHBOURHOOD_COORDS,
  jitterCoords,
} from "../data/neighbourhoodCoords";
import { useLanguage } from "../i18n/LanguageContext";

function createPriceIcon(price, isActive) {
  return L.divIcon({
    html: `<div style="
      display:inline-flex;align-items:center;justify-content:center;
      padding:4px 10px;
      border-radius:999px;
      background:${isActive ? "#2b241c" : "#fffdf8"};
      color:${isActive ? "#fffdf8" : "#ffb52e"};
      font-family:Karla, Arial, Helvetica, sans-serif;
      font-size:12px;
      font-weight:700;
      white-space:nowrap;
      box-shadow:0 1px 4px rgba(43,36,28,0.35);
      border:2px solid #ddd0b4;
    ">${price}€</div>`,
    className: "",
    iconSize: [0, 0],
    iconAnchor: [20, 13],
    popupAnchor: [0, -16],
  });
}

export default function MapView({ listings, highlightedId, onMarkerClick }) {
  const { locale, t } = useLanguage();

  return (
    <MapContainer
      center={LISBON_CENTER}
      zoom={12}
      scrollWheelZoom
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {listings.map((listing) => {
        const position =
          listing.lat != null && listing.lng != null
            ? [listing.lat, listing.lng]
            : jitterCoords(
                NEIGHBOURHOOD_COORDS[listing.neighbourhood] ?? LISBON_CENTER,
                listing.id,
              );
        const isActive = listing.id === highlightedId;

        return (
          <Marker
            key={listing.id}
            position={position}
            icon={createPriceIcon(listing.price, isActive)}
            eventHandlers={{ click: () => onMarkerClick(listing.id) }}
          >
            <Popup>
              <strong>{localizedText(listing.title, locale)}</strong>
              <br />
              {listing.neighbourhood} · €{listing.price}
              {t("perMonth")}
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
