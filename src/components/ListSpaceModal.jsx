import { useState } from "react";
import { NEIGHBOURHOODS, ROOM_TYPES } from "../data/listings";

const emptyForm = {
  title: "",
  neighbourhood: NEIGHBOURHOODS[0],
  type: ROOM_TYPES[0].value,
  size: "",
  price: "",
  description: "",
  host: "",
};

export default function ListSpaceModal({ onClose, onSubmit }) {
  const [form, setForm] = useState(emptyForm);

  const update = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      size: Number(form.size) || 0,
      price: Number(form.price) || 0,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-kraft-900/50 p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg border-2 border-kraft-400 bg-kraft-50 shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-kraft-300 bg-kraft-100 px-5 py-4">
          <h2 className="text-xl font-semibold text-kraft-900">
            Deinen Stauraum vermieten
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Schließen"
            className="rounded-full px-2 py-1 text-kraft-700 hover:bg-kraft-200"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-5 py-5">
          <label className="flex flex-col gap-1 text-sm text-kraft-800">
            Titel
            <input
              required
              type="text"
              value={form.title}
              onChange={update("title")}
              placeholder="z. B. Trockener Keller in Alfama"
              className="rounded-md border border-kraft-300 bg-white px-3 py-2 text-sm focus:border-kraft-500 focus:outline-none focus:ring-2 focus:ring-kraft-400"
            />
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col gap-1 text-sm text-kraft-800">
              Stadtteil
              <select
                value={form.neighbourhood}
                onChange={update("neighbourhood")}
                className="rounded-md border border-kraft-300 bg-white px-3 py-2 text-sm focus:border-kraft-500 focus:outline-none focus:ring-2 focus:ring-kraft-400"
              >
                {NEIGHBOURHOODS.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1 text-sm text-kraft-800">
              Raumtyp
              <select
                value={form.type}
                onChange={update("type")}
                className="rounded-md border border-kraft-300 bg-white px-3 py-2 text-sm focus:border-kraft-500 focus:outline-none focus:ring-2 focus:ring-kraft-400"
              >
                {ROOM_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col gap-1 text-sm text-kraft-800">
              Größe (m²)
              <input
                required
                type="number"
                min="1"
                value={form.size}
                onChange={update("size")}
                className="rounded-md border border-kraft-300 bg-white px-3 py-2 text-sm focus:border-kraft-500 focus:outline-none focus:ring-2 focus:ring-kraft-400"
              />
            </label>

            <label className="flex flex-col gap-1 text-sm text-kraft-800">
              Preis (€/Monat)
              <input
                required
                type="number"
                min="1"
                value={form.price}
                onChange={update("price")}
                className="rounded-md border border-kraft-300 bg-white px-3 py-2 text-sm focus:border-kraft-500 focus:outline-none focus:ring-2 focus:ring-kraft-400"
              />
            </label>
          </div>

          <label className="flex flex-col gap-1 text-sm text-kraft-800">
            Dein Name
            <input
              required
              type="text"
              value={form.host}
              onChange={update("host")}
              placeholder="z. B. Mariana"
              className="rounded-md border border-kraft-300 bg-white px-3 py-2 text-sm focus:border-kraft-500 focus:outline-none focus:ring-2 focus:ring-kraft-400"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm text-kraft-800">
            Beschreibung
            <textarea
              required
              rows={3}
              value={form.description}
              onChange={update("description")}
              placeholder="Zugang, Sicherheit, Besonderheiten…"
              className="resize-none rounded-md border border-kraft-300 bg-white px-3 py-2 text-sm focus:border-kraft-500 focus:outline-none focus:ring-2 focus:ring-kraft-400"
            />
          </label>

          <div className="mt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-kraft-300 px-4 py-2 text-sm text-kraft-800 hover:bg-kraft-200"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              className="rounded-md bg-stamp px-4 py-2 text-sm font-medium text-kraft-50 transition hover:opacity-90"
            >
              Angebot veröffentlichen
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
