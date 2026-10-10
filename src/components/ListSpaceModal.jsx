import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { NEIGHBOURHOODS, ROOM_TYPES, localizedText } from "../data/listings";
import { fuzzLocation, geocodeAddress } from "../lib/geocode";
import { useLanguage } from "../i18n/LanguageContext";
import { supabase } from "../lib/supabaseClient";
import { Modal } from "../design-system/components/overlays/Modal";
import { Field, Input } from "../design-system/components/forms/Input";
import { Select } from "../design-system/components/forms/Select";
import { Textarea } from "../design-system/components/forms/Textarea";
import { PhotoUploader } from "../design-system/components/forms/PhotoUploader";
import { Button } from "../design-system/components/core/Button";
import { TERMS_VERSION, interpolateLinks } from "../lib/legal";

function formFromListing(listing) {
  if (!listing) {
    return {
      title: "",
      address: "",
      neighbourhood: NEIGHBOURHOODS[0],
      type: ROOM_TYPES[0].value,
      size: "",
      price: "",
      description: "",
      photos: [],
    };
  }
  return {
    title: localizedText(listing.title, "en"),
    address: "",
    neighbourhood: listing.neighbourhood,
    type: listing.type,
    size: String(listing.size ?? ""),
    price: String(listing.price ?? ""),
    description: localizedText(listing.description, "en"),
    photos: (listing.photos ?? []).map((url, i) => ({ id: `existing-${i}`, kind: "existing", url })),
  };
}

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

// listing: pass an existing row to edit it; omit to create a new one.
export default function ListSpaceModal({ listing, onClose, onCreated, onUpdated }) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const isEdit = Boolean(listing);
  const [form, setForm] = useState(() => formFromListing(listing));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [hostTermsAccepted, setHostTermsAccepted] = useState(false);
  const [showHostTermsError, setShowHostTermsError] = useState(false);

  const update = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handlePhotosAdd = (files) => {
    const newPhotos = files.map((file) => ({
      id: `new-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      kind: "new",
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    setForm((f) => ({ ...f, photos: [...f.photos, ...newPhotos] }));
  };

  const removePhoto = (index) => {
    setForm((f) => {
      const item = f.photos[index];
      if (item.kind === "new") URL.revokeObjectURL(item.previewUrl);
      return { ...f, photos: f.photos.filter((_, i) => i !== index) };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEdit && !hostTermsAccepted) {
      setShowHostTermsError(true);
      return;
    }
    if (form.photos.length === 0) {
      setError(t("modal.photosRequired"));
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      let lat;
      let lng;
      if (!isEdit) {
        const geocoded = await geocodeAddress(
          `${form.address}, ${form.neighbourhood}, Lisboa, Portugal`,
        );
        if (!geocoded) {
          setError(t("modal.addressNotFound"));
          setSubmitting(false);
          return;
        }
        ({ lat, lng } = fuzzLocation(geocoded));
      }

      const newFiles = form.photos.filter((p) => p.kind === "new");
      const uploadedUrls = await uploadPhotos(user.id, newFiles);
      const existingUrls = form.photos.filter((p) => p.kind === "existing").map((p) => p.url);
      const photoUrls = [...existingUrls, ...uploadedUrls];

      const payload = {
        title: form.title,
        description: form.description,
        neighbourhood: form.neighbourhood,
        type: form.type,
        size: Number(form.size) || 0,
        price: Number(form.price) || 0,
        photos: photoUrls,
      };

      if (isEdit) {
        const { data, error: updateError } = await supabase
          .from("listings")
          .update(payload)
          .eq("id", listing.id)
          .select()
          .single();
        if (updateError) throw updateError;
        onUpdated(data);
      } else {
        const { data, error: insertError } = await supabase
          .from("listings")
          .insert({
            ...payload,
            owner_id: user.id,
            host_name: user.user_metadata?.full_name || user.email,
            lat,
            lng,
            host_terms_accepted_at: new Date().toISOString(),
            host_terms_version: TERMS_VERSION,
          })
          .select()
          .single();
        if (insertError) throw insertError;
        onCreated(data);
      }
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  return (
    <Modal title={t(isEdit ? "modal.editTitle" : "modal.title")} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label={t("modal.fieldTitle")}>
          <Input
            required
            type="text"
            value={form.title}
            onChange={update("title")}
            placeholder={t("modal.titlePlaceholder")}
          />
        </Field>

        {!isEdit && (
          <Field label={t("modal.fieldAddress")} hint={t("modal.addressPrivacyHint")}>
            <Input
              required
              type="text"
              value={form.address}
              onChange={update("address")}
              placeholder={t("modal.addressPlaceholder")}
            />
          </Field>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label={t("modal.fieldNeighbourhood")}>
            <Select value={form.neighbourhood} onChange={update("neighbourhood")}>
              {NEIGHBOURHOODS.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </Select>
          </Field>

          <Field label={t("modal.fieldRoomType")}>
            <Select value={form.type} onChange={update("type")}>
              {ROOM_TYPES.map((rt) => (
                <option key={rt.value} value={rt.value}>
                  {t(`roomTypes.${rt.value}`)}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label={t("modal.fieldSize")}>
            <Input required type="number" min="1" value={form.size} onChange={update("size")} />
          </Field>

          <Field label={t("modal.fieldPrice")}>
            <Input required type="number" min="1" value={form.price} onChange={update("price")} />
          </Field>
        </div>

        <PhotoUploader
          label={t("modal.fieldPhotos")}
          addLabel={t("modal.addPhotos")}
          hint=""
          photos={form.photos.map((p) => (p.kind === "existing" ? p.url : p.previewUrl))}
          onAdd={handlePhotosAdd}
          onRemove={removePhoto}
        />

        <Field label={t("modal.fieldDescription")}>
          <Textarea
            required
            rows={3}
            value={form.description}
            onChange={update("description")}
            placeholder={t("modal.descriptionPlaceholder")}
          />
        </Field>

        {!isEdit && (
          <div>
            <label className="flex items-start gap-2" style={{ fontSize: "var(--text-sm)" }}>
              <input
                type="checkbox"
                checked={hostTermsAccepted}
                onChange={(e) => {
                  setHostTermsAccepted(e.target.checked);
                  if (e.target.checked) setShowHostTermsError(false);
                }}
                className="mt-1"
              />
              <span>
                {interpolateLinks(t("hostTerms.label"), {
                  terms: { label: t("legalTabTerms"), href: "/legal#terms" },
                })}
              </span>
            </label>
            {showHostTermsError && (
              <p className="m-0 mt-1" style={{ fontSize: "var(--text-xs)", color: "var(--status-danger)" }}>
                {t("hostTerms.required")}
              </p>
            )}
          </div>
        )}

        {error && <p className="m-0" style={{ fontSize: "var(--text-sm)", color: "var(--status-danger)" }}>{error}</p>}

        <div className="mt-2 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose}>
            {t("modal.cancel")}
          </Button>
          <Button type="submit" variant="primary" disabled={submitting || (!isEdit && !hostTermsAccepted)}>
            {t(isEdit ? "modal.saveChanges" : "modal.publish")}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
