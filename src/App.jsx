import { useEffect, useMemo, useState } from "react";
import Header from "./components/Header";
import ListingCard from "./components/ListingCard";
import ListSpaceModal from "./components/ListSpaceModal";
import MapView from "./components/MapView";
import { INITIAL_LISTINGS } from "./data/listings";
import { useLanguage } from "./i18n/LanguageContext";

function App() {
  const { t } = useLanguage();
  const [listings, setListings] = useState(INITIAL_LISTINGS);
  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [showMap, setShowMap] = useState(true);
  const [highlightedId, setHighlightedId] = useState(null);

  const filteredListings = useMemo(() => {
    const query = search.trim().toLowerCase();
    return listings.filter((listing) => {
      const matchesSearch =
        !query || listing.neighbourhood.toLowerCase().includes(query);
      const matchesType = activeType === "all" || listing.type === activeType;
      return matchesSearch && matchesType;
    });
  }, [listings, search, activeType]);

  useEffect(() => {
    if (highlightedId === null) return;
    const el = document.getElementById(`listing-${highlightedId}`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    const timeout = setTimeout(() => setHighlightedId(null), 2500);
    return () => clearTimeout(timeout);
  }, [highlightedId]);

  const handleAddListing = (newListing) => {
    setListings((prev) => [
      { ...newListing, id: prev.length ? Math.max(...prev.map((l) => l.id)) + 1 : 1 },
      ...prev,
    ]);
    setShowModal(false);
  };

  return (
    <div className="min-h-screen">
      <Header
        search={search}
        onSearchChange={setSearch}
        activeType={activeType}
        onTypeChange={setActiveType}
        onListSpaceClick={() => setShowModal(true)}
      />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <p className="text-sm text-kraft-700">
            {filteredListings.length}{" "}
            {t(filteredListings.length === 1 ? "resultsOne" : "resultsOther")}
          </p>
          <button
            type="button"
            onClick={() => setShowMap((v) => !v)}
            className="shrink-0 rounded-md border border-kraft-300 bg-kraft-50 px-3 py-1.5 text-sm font-medium text-kraft-800 hover:bg-kraft-200"
          >
            {showMap ? `🗺️ ${t("hideMap")}` : `🗺️ ${t("showMap")}`}
          </button>
        </div>

        <div className={`flex flex-col gap-6 ${showMap ? "lg:flex-row" : ""}`}>
          <div className={showMap ? "lg:w-1/2" : "w-full"}>
            {filteredListings.length === 0 ? (
              <div className="rounded-lg border border-kraft-300 bg-kraft-50 p-10 text-center text-kraft-700">
                {t("noResults")}
              </div>
            ) : (
              <div
                className={`grid grid-cols-1 gap-5 sm:grid-cols-2 ${
                  showMap ? "" : "lg:grid-cols-3"
                }`}
              >
                {filteredListings.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    highlighted={listing.id === highlightedId}
                  />
                ))}
              </div>
            )}
          </div>

          {showMap && (
            <div className="lg:w-1/2">
              <div className="sticky top-4 h-[60vh] overflow-hidden rounded-lg border border-kraft-300 lg:h-[75vh]">
                <MapView
                  listings={filteredListings}
                  highlightedId={highlightedId}
                  onMarkerClick={setHighlightedId}
                />
              </div>
            </div>
          )}
        </div>
      </main>

      {showModal && (
        <ListSpaceModal
          onClose={() => setShowModal(false)}
          onSubmit={handleAddListing}
        />
      )}
    </div>
  );
}

export default App;
