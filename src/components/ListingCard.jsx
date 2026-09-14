import { ROOM_TYPES } from "../data/listings";

export default function ListingCard({ listing }) {
  const type = ROOM_TYPES.find((t) => t.value === listing.type);

  return (
    <article className="flex flex-col overflow-hidden rounded-lg border border-kraft-300 bg-kraft-50 transition hover:shadow-md">
      <div className="relative flex h-36 items-center justify-center border-b border-kraft-300 bg-kraft-100">
        <span className="text-5xl">{type?.icon}</span>
        <span className="absolute right-3 top-3 rounded bg-stamp px-2 py-0.5 text-sm font-medium text-kraft-50">
          €{listing.price}/Monat
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-semibold leading-tight text-kraft-900">
            {listing.title}
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-kraft-700">
          <span className="rounded-full bg-kraft-200 px-2 py-0.5">
            📍 {listing.neighbourhood}
          </span>
          <span className="rounded-full bg-kraft-200 px-2 py-0.5">
            {type?.label}
          </span>
          <span className="rounded-full bg-kraft-200 px-2 py-0.5">
            {listing.size} m²
          </span>
        </div>

        <p className="line-clamp-3 flex-1 text-sm text-kraft-800">
          {listing.description}
        </p>

        <div className="mt-2 flex items-center justify-between border-t border-kraft-300 pt-2 text-sm">
          <span className="text-kraft-700">Vermietet von {listing.host}</span>
          <button
            type="button"
            className="rounded-md bg-kraft-700 px-3 py-1.5 font-medium text-kraft-50 transition hover:bg-kraft-800"
          >
            Anfragen
          </button>
        </div>
      </div>
    </article>
  );
}
