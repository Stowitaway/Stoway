import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { NEIGHBOURHOODS, ROOM_TYPES } from "../data/listings";
import { fuzzLocation, geocodeAddress } from "../lib/geocode";
import { useLanguage } from "../i18n/LanguageContext";
import { supabase } from "../lib/supabaseClient";

const emptyForm = {
  title: "",
  address: "",
  neighbourhood: NEIGHBOURHOODS[0],
  type: ROOM_TYPES[0].value,
  size: "",
  price: "",
  description: "",
  photos: [],
};

async function uploadPhotos(userId, photos) {
  const urls = [];
  for (const { file } of photos) {
    const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}-${file.name}`;
    const { error } = await supabase.storage
      .from("listing-photos")
      .upload(path, file);
    if (error) throw error;
    const { data } = supabase.storage.from("listing-photos").getPublicUrl(path);
    urls.push(data.publicUrl);
  }
  return urls;
}

export default function ListSpaceModal({ onClose, onCreated }) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const update = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handlePhotosChange = (e) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    const newPhotos = files.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    setForm((f) => ({ ...f, photos: [...f.photos, ...newPhotos] }));
  };

  const removePhoto = (index) => {
    setForm((f) => {
      URL.revokeObjectURL(f.photos[index].previewUrl);
      return { ...f, photos: f.photos.filter((_, i) => i !== index) };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const geocoded = await geocodeAddress(
        `${form.address}, ${form.neighbourhood}, Lisboa, Portugal`,
      );
      if (!geocoded) {
        setError(t("modal.addressNotFound"));
        setSubmitting(false);
        return;
      }
      const { lat, lng } = fuzzLocation(geocoded);

      const photoUrls = await uploadPhotos(user.id, form.photos);
      const { data, error: insertError } = await supabase
        .from("listings")
        .insert({
          owner_id: user.id,
          host_name: user.user_metadata?.full_name || user.email,
          title: form.title,
          description: form.description,
          neighbourhood: form.neighbourhood,
          type: form.type,
          size: Number(form.size) || 0,
          price: Number(form.price) || 0,
          photos: photoUrls,
          lat,
          lng,
        })
        .select()
        .single();
      if (insertError) throw insertError;
      onCreated(data);
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
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
            {t("modal.title")}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("modal.close")}
            className="rounded-full px-2 py-1 text-kraft-700 hover:bg-kraft-200"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-5 py-5">
          <label className="flex flex-col gap-1 text-sm text-kraft-800">
            {t("modal.fieldTitle")}
            <input
              required
              type="text"
              value={form.title}
              onChange={update("title")}
              placeholder={t("modal.titlePlaceholder")}
              className="rounded-md border border-kraft-300 bg-white px-3 py-2 text-sm focus:border-kraft-500 focus:outline-none focus:ring-2 focus:ring-kraft-400"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm text-kraft-800">
            {t("modal.fieldAddress")}
            <input
              required
              type="text"
              value={form.address}
              onChange={update("address")}
              placeholder={t("modal.addressPlaceholder")}
              className="rounded-md border border-kraft-300 bg-white px-3 py-2 text-sm focus:border-kraft-500 focus:outline-none focus:ring-2 focus:ring-kraft-400"
            />
            <span className="text-xs text-kraft-600">
              {t("modal.addressPrivacyHint")}
            </span>
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col gap-1 text-sm text-kraft-800">
              {t("modal.fieldNeighbourhood")}
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
              {t("modal.fieldRoomType")}
              <select
                value={form.type}
                onChange={update("type")}
                className="rounded-md border border-kraft-300 bg-white px-3 py-2 text-sm focus:border-kraft-500 focus:outline-none focus:ring-2 focus:ring-kraft-400"
              >
                {ROOM_TYPES.map((rt) => (
                  <option key={rt.value} value={rt.value}>
                    {t(`roomTypes.${rt.value}`)}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col gap-1 text-sm text-kraft-800">
              {t("modal.fieldSize")}
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
              {t("modal.fieldPrice")}
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

          <div className="flex flex-col gap-2 text-sm text-kraft-800">
            <span>{t("modal.fieldPhotos")}</span>

            {form.photos.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {form.photos.map((photo, index) => (
                  <div key={index} className="group relative aspect-square">
                    <img
                      src={photo.previewUrl}
                      alt=""
                      className="h-full w-full rounded-md border border-kraft-300 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      aria-label={t("modal.removePhoto")}
                      className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-kraft-900 text-xs text-kraft-50 shadow"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            <label className="flex cursor-pointer items-center justify-center rounded-md border border-dashed border-kraft-400 bg-white px-3 py-4 text-sm text-kraft-600 hover:bg-kraft-100">
              <span>📷 {t("modal.addPhotos")}</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotosChange}
                className="hidden"
              />
            </label>
          </div>

          <label className="flex flex-col gap-1 text-sm text-kraft-800">
            {t("modal.fieldDescription")}
            <textarea
              required
              rows={3}
              value={form.description}
              onChange={update("description")}
              placeholder={t("modal.descriptionPlaceholder")}
              className="resize-none rounded-md border border-kraft-300 bg-white px-3 py-2 text-sm focus:border-kraft-500 focus:outline-none focus:ring-2 focus:ring-kraft-400"
            />
          </label>

          {error && <p className="text-sm text-stamp">{error}</p>}

          <div className="mt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-kraft-300 px-4 py-2 text-sm text-kraft-800 hover:bg-kraft-200"
            >
              {t("modal.cancel")}
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-md bg-stamp px-4 py-2 text-sm font-medium text-kraft-50 transition hover:opacity-90 disabled:opacity-60"
            >
              {t("modal.publish")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
