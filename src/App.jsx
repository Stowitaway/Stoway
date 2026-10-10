import { useEffect, useMemo, useState } from "react";
import { useAuth } from "./auth/AuthContext";
import AuthModal from "./components/AuthModal";
import ChatModal from "./components/ChatModal";
import FavoritesModal from "./components/FavoritesModal";
import Footer from "./components/Footer";
import Header from "./components/Header";
import ListingCard from "./components/ListingCard";
import ListingDetailModal from "./components/ListingDetailModal";
import ListSpaceModal from "./components/ListSpaceModal";
import MapView from "./components/MapView";
import LegalPage from "./pages/LegalPage";
import ContactPage from "./pages/ContactPage";
import HowItWorksPage from "./pages/HowItWorksPage";
import AccountPage from "./pages/AccountPage";
import { Button } from "./design-system/components/core/Button";
import { IconButton } from "./design-system/components/core/IconButton";
import { EmptyState } from "./design-system/components/overlays/EmptyState";
import { localizedText } from "./data/listings";
import { useLanguage } from "./i18n/LanguageContext";
import { navigate, usePath } from "./lib/navigation";
import { supabase } from "./lib/supabaseClient";

const PAGE_TITLES = {
  "/legal": "legalTitle",
  "/contact": "contactTitle",
  "/how-it-works": "howTitle",
  "/account": "account.settings",
};

function mapRow(row) {
  return { ...row, host: row.host_name };
}

function App() {
  const { t, locale } = useLanguage();
  const { user } = useAuth();
  const path = usePath();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showMap, setShowMap] = useState(
    () => typeof window === "undefined" || window.matchMedia("(min-width: 1024px)").matches,
  );
  const [mapExpanded, setMapExpanded] = useState(false);
  const [highlightedId, setHighlightedId] = useState(null);
  const [selectedListing, setSelectedListing] = useState(null);
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatConversationId, setChatConversationId] = useState(null);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [showFavoritesModal, setShowFavoritesModal] = useState(false);

  useEffect(() => {
    const titleKey = PAGE_TITLES[path];
    document.title = titleKey ? `${t(titleKey)} · Stoway` : "Stoway";
  }, [path, t]);

  useEffect(() => {
    if (path === "/account" && !user) {
      navigate("/");
      setShowAuthModal(true);
    }
  }, [path, user]);

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
    if (!user) {
      setFavoriteIds(new Set());
      return;
    }
    supabase
      .from("favorites")
      .select("listing_id")
      .eq("user_id", user.id)
      .then(({ data }) => {
        setFavoriteIds(new Set((data ?? []).map((row) => row.listing_id)));
      });
  }, [user]);

  const handleToggleFavorite = async (listing) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    const isFavorite = favoriteIds.has(listing.id);
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (isFavorite) next.delete(listing.id);
      else next.add(listing.id);
      return next;
    });
    if (isFavorite) {
      await supabase
        .from("favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("listing_id", listing.id);
    } else {
      await supabase
        .from("favorites")
        .insert({ user_id: user.id, listing_id: listing.id });
    }
  };

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

  const handleListSpaceClick = () => (user ? setShowModal(true) : setShowAuthModal(true));

  return (
    <div className="flex min-h-screen flex-col">
      <Header
        search={search}
        onSearchChange={setSearch}
        activeType={activeType}
        onTypeChange={setActiveType}
        onListSpaceClick={handleListSpaceClick}
        onAuthClick={() => setShowAuthModal(true)}
        onChatClick={() => {
          setChatConversationId(null);
          setShowChatModal(true);
        }}
        onFavoritesClick={() =>
          user ? setShowFavoritesModal(true) : setShowAuthModal(true)
        }
      />

      {path === "/legal" ? (
        <LegalPage />
      ) : path === "/contact" ? (
        <ContactPage />
      ) : path === "/how-it-works" ? (
        <HowItWorksPage onListSpaceClick={handleListSpaceClick} />
      ) : path === "/account" ? (
        <AccountPage />
      ) : (
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6">
          <div className="mb-4 flex items-center justify-between gap-4">
            <p className="m-0" style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>
              {filteredListings.length}{" "}
              {t(filteredListings.length === 1 ? "resultsOne" : "resultsOther")}
            </p>
            <Button
              variant="outline"
              size="sm"
              icon={showMap ? "list-ul" : "map"}
              onClick={() => {
                setShowMap((v) => !v);
                setMapExpanded(false);
              }}
            >
              {showMap ? t("hideMap") : t("showMap")}
            </Button>
          </div>

          {loadError && (
            <div
              className="mb-4 rounded-md p-4"
              style={{ fontSize: "var(--text-sm)", background: "var(--status-danger-soft)", color: "var(--status-danger)" }}
            >
              {loadError}
            </div>
          )}

          <div className={`flex flex-col gap-6 ${showMap ? "lg:flex-row" : ""}`}>
            {!(showMap && mapExpanded) && (
              <div className={showMap ? "lg:w-3/5" : "w-full"}>
                {loading ? (
                  <EmptyState icon="hourglass-split">…</EmptyState>
                ) : filteredListings.length === 0 ? (
                  <EmptyState
                    icon="search"
                    title={t("noResults")}
                    action={
                      <Button variant="outline" onClick={() => { setSearch(""); setActiveType("all"); }}>
                        {t("filterAll")}
                      </Button>
                    }
                  />
                ) : (
                  <div
                    className={`grid grid-cols-1 sm:grid-cols-2 ${showMap ? "" : "lg:grid-cols-3"}`}
                    style={{ columnGap: "var(--gap-grid-x)", rowGap: "var(--gap-grid-y)" }}
                  >
                    {filteredListings.map((listing) => (
                      <ListingCard
                        key={listing.id}
                        listing={listing}
                        highlighted={listing.id === highlightedId}
                        onOpen={setSelectedListing}
                        onRequest={handleRequest}
                        isFavorite={favoriteIds.has(listing.id)}
                        onToggleFavorite={handleToggleFavorite}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {showMap && (
              <div className={mapExpanded ? "w-full" : "order-first lg:order-none lg:w-2/5"}>
                <div
                  className={`sticky top-4 relative overflow-hidden h-[60vh] ${mapExpanded ? "lg:h-[80vh]" : "lg:h-[75vh]"}`}
                  style={{ borderRadius: "var(--radius-card)", boxShadow: "var(--shadow-sm)" }}
                >
                  <span className="absolute left-3 top-3 z-10 hidden lg:block">
                    <IconButton
                      icon={mapExpanded ? "fullscreen-exit" : "arrows-fullscreen"}
                      variant="onimage"
                      label={mapExpanded ? t("collapseMap") : t("expandMap")}
                      onClick={() => setMapExpanded((v) => !v)}
                    />
                  </span>
                  <MapView
                    listings={filteredListings}
                    highlightedId={highlightedId}
                    onMarkerClick={setHighlightedId}
                    favoriteIds={favoriteIds}
                  />
                </div>
              </div>
            )}
          </div>
        </main>
      )}

      <Footer onListSpaceClick={handleListSpaceClick} />

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
          isFavorite={favoriteIds.has(selectedListing.id)}
          onToggleFavorite={handleToggleFavorite}
        />
      )}

      {showChatModal && (
        <ChatModal
          initialConversationId={chatConversationId}
          onClose={() => setShowChatModal(false)}
        />
      )}

      {showFavoritesModal && (
        <FavoritesModal
          listings={listings.filter((l) => favoriteIds.has(l.id))}
          onClose={() => setShowFavoritesModal(false)}
          onOpenListing={setSelectedListing}
          onRequest={handleRequest}
          favoriteIds={favoriteIds}
          onToggleFavorite={handleToggleFavorite}
        />
      )}
    </div>
  );
}

export default App;
