import { useMemo, useState } from "react";
import Header from "./components/Header";
import ListingCard from "./components/ListingCard";
import ListSpaceModal from "./components/ListSpaceModal";
import { INITIAL_LISTINGS } from "./data/listings";
import { useLanguage } from "./i18n/LanguageContext";

function App() {
  const { t } = useLanguage();
  const [listings, setListings] = useState(INITIAL_LISTINGS);
  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState("all");
  const [showModal, setShowModal] = useState(false);

  const filteredListings = useMemo(() => {
    const query = search.trim().toLowerCase();
    return listings.filter((listing) => {
      const matchesSearch =
        !query || listing.neighbourhood.toLowerCase().includes(query);
      const matchesType = activeType === "all" || listing.type === activeType;
      return matchesSearch && matchesType;
    });
  }, [listings, search, activeType]);

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

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <p className="mb-4 text-sm text-kraft-700">
          {filteredListings.length}{" "}
          {t(filteredListings.length === 1 ? "resultsOne" : "resultsOther")}
        </p>

        {filteredListings.length === 0 ? (
          <div className="rounded-lg border border-kraft-300 bg-kraft-50 p-10 text-center text-kraft-700">
            {t("noResults")}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
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
