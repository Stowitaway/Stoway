import {
  config,
  Map as MapLibreMap,
  Marker,
  NavigationControl,
  Popup,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef } from "react";
import { localizedText } from "../data/listings";
import {
  LISBON_CENTER,
  NEIGHBOURHOOD_COORDS,
  jitterCoords,
} from "../data/neighbourhoodCoords";
import { useLanguage } from "../i18n/LanguageContext";

const MAP_STYLE = "https://tiles.openfreemap.org/styles/bright";

// Vite's bundler doesn't correctly resolve maplibre-gl's internal worker
// script (it 404s at runtime), so load the matching worker build from a
// CDN instead of letting the bundler try to chunk it.
config.WORKER_URL =
  "https://unpkg.com/maplibre-gl@6.11.1/dist/maplibre-gl-worker.mjs";

function createPriceElement(price, isActive) {
  const el = document.createElement("div");
  el.textContent = `${price}€`;
  el.style.cssText = `
    display:inline-flex;align-items:center;justify-content:center;
    padding:4px 10px;
    border-radius:999px;
    background:${isActive ? "#2b241c" : "#fffdf8"};
    color:${isActive ? "#fffdf8" : "#ffb52e"};
    font-family:Karla, Arial, Helvetica, sans-serif;
    font-size:12px;
    font-weight:700;
    white-space:nowrap;
    cursor:pointer;
    box-shadow:0 1px 4px rgba(43,36,28,0.35);
    border:2px solid #ddd0b4;
  `;
  return el;
}

function createPopupContent(title, neighbourhood, price, perMonth) {
  const root = document.createElement("div");
  const strong = document.createElement("strong");
  strong.textContent = title;
  root.append(strong, document.createElement("br"));
  root.append(`${neighbourhood} · €${price}${perMonth}`);
  return root;
}

export default function MapView({ listings, highlightedId, onMarkerClick }) {
  const { locale, t } = useLanguage();
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const onMarkerClickRef = useRef(onMarkerClick);
  useEffect(() => {
    onMarkerClickRef.current = onMarkerClick;
  }, [onMarkerClick]);

  useEffect(() => {
    const map = new MapLibreMap({
      container: containerRef.current,
      style: MAP_STYLE,
      center: [LISBON_CENTER[1], LISBON_CENTER[0]],
      zoom: 11,
    });
    map.addControl(new NavigationControl({ showCompass: false }));
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = listings.map((listing) => {
      const [lat, lng] =
        listing.lat != null && listing.lng != null
          ? [listing.lat, listing.lng]
          : jitterCoords(
              NEIGHBOURHOOD_COORDS[listing.neighbourhood] ?? LISBON_CENTER,
              listing.id,
            );
      const isActive = listing.id === highlightedId;
      const el = createPriceElement(listing.price, isActive);
      el.addEventListener("click", () => onMarkerClickRef.current(listing.id));

      const popup = new Popup({ offset: 16 }).setDOMContent(
        createPopupContent(
          localizedText(listing.title, locale),
          listing.neighbourhood,
          listing.price,
          t("perMonth"),
        ),
      );
      const marker = new Marker({ element: el })
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(map);
      if (isActive) marker.getElement().style.zIndex = 1;
      return marker;
    });
  }, [listings, highlightedId, locale, t]);

  return <div ref={containerRef} className="h-full w-full" />;
}
