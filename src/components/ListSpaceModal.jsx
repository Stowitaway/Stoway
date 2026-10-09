import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { NEIGHBOURHOODS, ROOM_TYPES } from "../data/listings";
import { fuzzLocation, geocodeAddress } from "../lib/geocode";
import { useLanguage } from "../i18n/LanguageContext";
import { supabase } from "../lib/supabaseClient";
import { Modal } from "../design-system/components/overlays/Modal";
import { Field, Input } from "../design-system/components/forms/Input";
import { Select } from "../design-system/components/forms/Select";
import { Textarea } from "../design-system/components/forms/Textarea";
import { PhotoUploader } from "../design-system/components/forms/PhotoUploader";
import { Button } from "../design-system/components/core/Button";

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

  const handlePhotosAdd = (files) => {
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
    <Modal title={t("modal.title")} onClose={onClose}>
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

        <Field label={t("modal.fieldAddress")} hint={t("modal.addressPrivacyHint")}>
          <Input
            required
            type="text"
            value={form.address}
            onChange={update("address")}
            placeholder={t("modal.addressPlaceholder")}
          />
        </Field>

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
          photos={form.photos.map((p) => p.previewUrl)}
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

        {error && <p className="m-0" style={{ fontSize: "var(--text-sm)", color: "var(--status-danger)" }}>{error}</p>}

        <div className="mt-2 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose}>
            {t("modal.cancel")}
          </Button>
          <Button type="submit" variant="primary" disabled={submitting}>
            {t("modal.publish")}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
