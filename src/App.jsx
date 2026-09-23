import { useEffect, useMemo, useState } from "react";
import { useAuth } from "./auth/AuthContext";
import AuthModal from "./components/AuthModal";
import ChatModal from "./components/ChatModal";
import Footer from "./components/Footer";
import Header from "./components/Header";
import ListingCard from "./components/ListingCard";
import ListingDetailModal from "./components/ListingDetailModal";
import ListSpaceModal from "./components/ListSpaceModal";
import MapView from "./components/MapView";
import { localizedText } from "./data/listings";
import { useLanguage } from "./i18n/LanguageContext";
import { supabase } from "./lib/supabaseClient";

function mapRow(row) {
  return { ...row, host: row.host_name };
}

function App() {
  const { t, locale } = useLanguage();
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showMap, setShowMap] = useState(true);
  const [highlightedId, setHighlightedId] = useState(null);
  const [selectedListing, setSelectedListing] = useState(null);
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatConversationId, setChatConversationId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    supabase
      .from("listings")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          setLoadError(error.message);
        } else {
          setListings(data.map(mapRow));
        }
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredListings = useMemo(() => {
    const query = search.trim().toLowerCase();
    return listings.filter((listing) => {
      const matchesSearch =
        !query ||
        listing.neighbourhood.toLowerCase().includes(query) ||
        localizedText(listing.title, locale).toLowerCase().includes(query) ||
        localizedText(listing.description, locale).toLowerCase().includes(query);
      const matchesType = activeType === "all" || listing.type === activeType;
      return matchesSearch && matchesType;
    });
  }, [listings, search, activeType, locale]);

  useEffect(() => {
    if (highlightedId === null) return;
    const el = document.getElementById(`listing-${highlightedId}`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    const timeout = setTimeout(() => setHighlightedId(null), 2500);
    return () => clearTimeout(timeout);
  }, [highlightedId]);

  const handleCreated = (row) => {
    setListings((prev) => [mapRow(row), ...prev]);
    setShowModal(false);
  };

  const handleRequest = async (listing) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    if (!listing.owner_id || listing.owner_id === user.id) return;

    setSelectedListing(null);

    const { data: existing } = await supabase
      .from("conversations")
      .select("*")
      .eq("listing_id", listing.id)
      .eq("guest_id", user.id)
      .maybeSingle();

    let conversation = existing;
    if (!conversation) {
      const { data: created, error } = await supabase
        .from("conversations")
        .insert({
          listing_id: listing.id,
          listing_title: localizedText(listing.title, "en"),
          host_id: listing.owner_id,
          host_name: listing.host,
          guest_id: user.id,
          guest_name: user.user_metadata?.full_name || user.email,
        })
        .select()
        .single();
      if (error) return;
      conversation = created;
    }

    setChatConversationId(conversation.id);
    setShowChatModal(true);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header
        search={search}
        onSearchChange={setSearch}
        activeType={activeType}
        onTypeChange={setActiveType}
        onListSpaceClick={() => (user ? setShowModal(true) : setShowAuthModal(true))}
        onAuthClick={() => setShowAuthModal(true)}
        onChatClick={() => {
          setChatConversationId(null);
          setShowChatModal(true);
        }}
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6">
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

        {loadError && (
          <div className="mb-4 rounded-lg border border-stamp bg-kraft-50 p-4 text-sm text-stamp">
            {loadError}
          </div>
        )}

        <div className={`flex flex-col gap-6 ${showMap ? "lg:flex-row" : ""}`}>
          <div className={showMap ? "lg:w-1/2" : "w-full"}>
            {loading ? (
              <div className="rounded-lg border border-kraft-300 bg-kraft-50 p-10 text-center text-kraft-700">
                …
              </div>
            ) : filteredListings.length === 0 ? (
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
                    onOpen={setSelectedListing}
                    onRequest={handleRequest}
                  />
                ))}
              </div>
            )}
          </div>

          {showMap && (
            <div className="lg:w-1/2">
              <div className="sticky top-4 h-[60vh] overflow-hidden rounded-xl border border-kraft-300 lg:h-[75vh]">
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

      <Footer />

      {showModal && (
        <ListSpaceModal
          onClose={() => setShowModal(false)}
          onCreated={handleCreated}
        />
      )}

      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onAuthenticated={() => setShowAuthModal(false)}
        />
      )}

      {selectedListing && (
        <ListingDetailModal
          listing={selectedListing}
          onClose={() => setSelectedListing(null)}
          onRequest={handleRequest}
        />
      )}

      {showChatModal && (
        <ChatModal
          initialConversationId={chatConversationId}
          onClose={() => setShowChatModal(false)}
        />
      )}
    </div>
  );
}

export default App;
