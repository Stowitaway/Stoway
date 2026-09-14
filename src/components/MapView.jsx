import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { ROOM_TYPES, localizedText } from "../data/listings";
import {
  LISBON_CENTER,
  NEIGHBOURHOOD_COORDS,
  jitterCoords,
} from "../data/neighbourhoodCoords";
import { useLanguage } from "../i18n/LanguageContext";

function createMarkerIcon(iconUrl, isActive) {
  return L.divIcon({
    html: `<div style="
      display:flex;align-items:center;justify-content:center;
      width:36px;height:36px;border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);
      background:${isActive ? "#c2703d" : "#333333"};
      border:2px solid white;
      box-shadow:0 1px 4px rgba(0,0,0,0.4);
      overflow:hidden;
    "><img src="${iconUrl}" style="width:22px;height:22px;object-fit:cover;border-radius:4px;transform:rotate(45deg);" /></div>`,
    className: "",
    iconSize: [36, 36],
    iconAnchor: [18, 34],
    popupAnchor: [0, -32],
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
        const base = NEIGHBOURHOOD_COORDS[listing.neighbourhood] ?? LISBON_CENTER;
        const position = jitterCoords(base, listing.id);
        const type = ROOM_TYPES.find((rt) => rt.value === listing.type);
        const isActive = listing.id === highlightedId;

        return (
          <Marker
            key={listing.id}
            position={position}
            icon={createMarkerIcon(type?.icon, isActive)}
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
