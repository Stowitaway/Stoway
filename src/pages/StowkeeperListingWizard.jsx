import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import logo from "../assets/brand/stoway-logo-blue.png";
import { NEIGHBOURHOODS, ROOM_TYPES, localizedText } from "../data/listings";
import { fuzzLocation, geocodeAddress } from "../lib/geocode";
import { useLanguage } from "../i18n/LanguageContext";
import { supabase } from "../lib/supabaseClient";
import { navigate } from "../lib/navigation";
import { Field, Input } from "../design-system/components/forms/Input";
import { Select } from "../design-system/components/forms/Select";
import { Textarea } from "../design-system/components/forms/Textarea";
import { PhotoUploader } from "../design-system/components/forms/PhotoUploader";
import { Button } from "../design-system/components/core/Button";
import { Icon } from "../design-system/components/core/Icon";
import { Tag } from "../design-system/components/core/Tag";
import { PriceStamp } from "../design-system/components/core/PriceStamp";
import { TERMS_VERSION, interpolateLinks } from "../lib/legal";

const ROOM_ICON = { cellar: "house-down", garage: "car-front-fill", storage: "door-closed" };

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
    const { error } = await supabase.storage.from("listing-photos").upload(path, file);
    if (error) throw error;
    const { data } = supabase.storage.from("listing-photos").getPublicUrl(path);
    urls.push(data.publicUrl);
  }
  return urls;
}

// A full-page, one-question-per-screen flow for creating or editing a
// listing, in place of the old single popup form. `listing`: pass an
// existing row to edit it, omit to create a new one.
export default function StowkeeperListingWizard({ listing, onDone }) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const isEdit = Boolean(listing);

  const [form, setForm] = useState(() => formFromListing(listing));
  const [hostTermsAccepted, setHostTermsAccepted] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [stepError, setStepError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

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

  const handleExit = () => {
    if (window.confirm(t("wizard.exitConfirm"))) {
      onDone();
      navigate("/stowkeeper");
    }
  };

  const submit = async () => {
    setSubmitting(true);
    setStepError("");
    try {
      let lat;
      let lng;
      if (!isEdit) {
        const geocoded = await geocodeAddress(`${form.address}, ${form.neighbourhood}, Lisboa, Portugal`);
        if (!geocoded) {
          setStepError(t("modal.addressNotFound"));
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
        const { data, error } = await supabase.from("listings").update(payload).eq("id", listing.id).select().single();
        if (error) throw error;
        onDone(data, "updated");
      } else {
        const { data, error } = await supabase
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
        if (error) throw error;
        onDone(data, "created");
      }
      navigate("/stowkeeper");
    } catch (err) {
      setStepError(err.message);
      setSubmitting(false);
    }
  };

  // --- Step definitions -----------------------------------------------
  const steps = [
    !isEdit && {
      key: "intro",
      icon: null,
      validate: () => true,
      render: () => (
        <div className="flex flex-col items-center gap-4 py-10 text-center">
          <img src={logo} alt="" width={72} height={72} />
          <h1 className="m-0" style={{ fontSize: "var(--text-3xl)", fontWeight: "var(--weight-bold)", color: "var(--text-strong)" }}>
            {t("wizard.introTitle")}
          </h1>
          <p className="m-0" style={{ fontSize: "var(--text-md)", color: "var(--text-muted)", maxWidth: 440 }}>
            {t("wizard.introBody")}
          </p>
        </div>
      ),
    },
    {
      key: "title",
      icon: "pencil-square",
      validate: () => form.title.trim().length > 0,
      render: () => (
        <Field label={null}>
          <Input
            autoFocus
            type="text"
            value={form.title}
            onChange={update("title")}
            placeholder={t("modal.titlePlaceholder")}
            style={{ fontSize: "var(--text-xl)", padding: "var(--space-4)" }}
          />
        </Field>
      ),
    },
    {
      key: "type",
      icon: "box-seam",
      validate: () => Boolean(form.type),
      render: () => (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {ROOM_TYPES.map((rt) => {
            const selected = form.type === rt.value;
            return (
              <button
                key={rt.value}
                type="button"
                onClick={() => setForm((f) => ({ ...f, type: rt.value }))}
                className="flex flex-col items-center gap-3 rounded-xl p-6"
                style={{
                  border: `var(--border-width-strong) solid ${selected ? "var(--border-brand)" : "var(--border-subtle)"}`,
                  background: "var(--surface-card)",
                  cursor: "pointer",
                  transition: "var(--transition-base)",
                }}
              >
                <span
                  className={`sw-roomicon--${rt.value}`}
                  style={{ width: 72, height: 72, borderRadius: "var(--radius-pill)", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <Icon name={ROOM_ICON[rt.value]} style={{ fontSize: 32 }} />
                </span>
                <span style={{ fontSize: "var(--text-md)", fontWeight: "var(--weight-semibold)", color: "var(--text-strong)" }}>
                  {t(`roomTypes.${rt.value}`)}
                </span>
              </button>
            );
          })}
        </div>
      ),
    },
    !isEdit && {
      key: "location",
      icon: "geo-alt-fill",
      validate: () => form.address.trim().length > 0,
      render: () => (
        <div className="flex flex-col gap-4">
          <Field label={t("modal.fieldNeighbourhood")}>
            <Select value={form.neighbourhood} onChange={update("neighbourhood")}>
              {NEIGHBOURHOODS.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </Select>
          </Field>
          <Field label={t("modal.fieldAddress")} hint={t("modal.addressPrivacyHint")}>
            <Input
              autoFocus
              type="text"
              value={form.address}
              onChange={update("address")}
              placeholder={t("modal.addressPlaceholder")}
            />
          </Field>
        </div>
      ),
    },
    isEdit && {
      key: "neighbourhood",
      icon: "geo-alt-fill",
      validate: () => true,
      render: () => (
        <Field label={t("modal.fieldNeighbourhood")}>
          <Select value={form.neighbourhood} onChange={update("neighbourhood")}>
            {NEIGHBOURHOODS.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </Select>
        </Field>
      ),
    },
    {
      key: "sizePrice",
      icon: "rulers",
      validate: () => Number(form.size) > 0 && Number(form.price) > 0,
      render: () => (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label={t("modal.fieldSize")}>
            <Input autoFocus required type="number" min="1" value={form.size} onChange={update("size")} />
          </Field>
          <Field label={t("modal.fieldPrice")}>
            <Input required type="number" min="1" value={form.price} onChange={update("price")} />
          </Field>
        </div>
      ),
    },
    {
      key: "photos",
      icon: "camera",
      validate: () => form.photos.length > 0,
      render: () => (
        <PhotoUploader
          label={null}
          addLabel={t("modal.addPhotos")}
          hint=""
          photos={form.photos.map((p) => (p.kind === "existing" ? p.url : p.previewUrl))}
          onAdd={handlePhotosAdd}
          onRemove={removePhoto}
        />
      ),
    },
    {
      key: "description",
      icon: "chat-left-text",
      validate: () => form.description.trim().length > 0,
      render: () => (
        <Field label={null}>
          <Textarea
            autoFocus
            required
            rows={7}
            value={form.description}
            onChange={update("description")}
            placeholder={t("modal.descriptionPlaceholder")}
          />
        </Field>
      ),
    },
    {
      key: "review",
      icon: "check-circle",
      validate: () => isEdit || hostTermsAccepted,
      render: () => (
        <div className="flex flex-col gap-5">
          <div
            className="flex items-center gap-4 rounded-xl p-4"
            style={{ border: "var(--border-width-hairline) solid var(--border-subtle)" }}
          >
            <div
              className="shrink-0 overflow-hidden rounded-lg"
              style={{ width: 96, height: 72, background: "var(--surface-muted)" }}
            >
              {form.photos[0] && (
                <img
                  src={form.photos[0].kind === "existing" ? form.photos[0].url : form.photos[0].previewUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="m-0 truncate" style={{ fontSize: "var(--text-md)", fontWeight: "var(--weight-semibold)", color: "var(--text-strong)" }}>
                {form.title}
              </h3>
              <div className="mt-1 flex flex-wrap gap-2">
                <Tag>{form.neighbourhood}</Tag>
                <Tag>{t(`roomTypes.${form.type}`)}</Tag>
                <Tag>{form.size} m²</Tag>
              </div>
              <div className="mt-1">
                <PriceStamp amount={form.price} unit={t("perMonth")} />
              </div>
            </div>
          </div>

          {!isEdit && (
            <label className="flex items-start gap-2" style={{ fontSize: "var(--text-sm)" }}>
              <input
                type="checkbox"
                checked={hostTermsAccepted}
                onChange={(e) => setHostTermsAccepted(e.target.checked)}
                className="mt-1"
              />
              <span>
                {interpolateLinks(t("hostTerms.label"), {
                  terms: { label: t("legalTabTerms"), href: "/legal#terms" },
                })}
              </span>
            </label>
          )}
        </div>
      ),
    },
  ].filter(Boolean);

  const step = steps[stepIndex];
  const isLastStep = stepIndex === steps.length - 1;
  const isFirstStep = stepIndex === 0;

  const handleNext = () => {
    if (!step.validate()) {
      setStepError(
        step.key === "review" ? t("hostTerms.required") : t("wizard.stepRequired"),
      );
      return;
    }
    setStepError("");
    if (isLastStep) {
      submit();
    } else {
      setStepIndex((i) => i + 1);
    }
  };

  const handleBack = () => {
    setStepError("");
    setStepIndex((i) => Math.max(0, i - 1));
  };

  const progressPct = Math.round(((stepIndex + 1) / steps.length) * 100);

  return (
    <div className="flex min-h-screen flex-col" style={{ background: "var(--surface-sunken)" }}>
      <div style={{ height: 4, background: "var(--surface-muted)" }}>
        <div
          style={{
            height: "100%",
            width: `${progressPct}%`,
            background: "var(--brand)",
            transition: "width var(--duration-base) var(--ease-standard)",
          }}
        />
      </div>

      <div className="mx-auto w-full flex-1 px-4 sm:px-6" style={{ maxWidth: 640, paddingTop: "var(--space-8)", paddingBottom: "var(--space-20)" }}>
        <div className="mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={handleExit}
            style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: "var(--text-muted)", fontSize: "var(--text-sm)" }}
          >
            <Icon name="x-lg" /> {t("wizard.exit")}
          </button>
          <span style={{ fontSize: "var(--text-xs)", color: "var(--text-subtle)" }}>
            {stepIndex + 1} / {steps.length}
          </span>
        </div>

        <div key={step.key} className="rounded-2xl p-6 sm:p-8" style={{ background: "var(--surface-card)", boxShadow: "var(--shadow-md)" }}>
          {step.icon && (
            <span
              className="mb-4 inline-flex items-center justify-center"
              style={{ width: 48, height: 48, borderRadius: "var(--radius-pill)", background: "var(--surface-brand-soft)", color: "var(--brand)" }}
            >
              <Icon name={step.icon} style={{ fontSize: 22 }} />
            </span>
          )}
          {step.key !== "intro" && (
            <h2 className="mb-1 mt-0" style={{ fontSize: "var(--text-2xl)", fontWeight: "var(--weight-bold)", color: "var(--text-strong)" }}>
              {t(`wizard.${step.key}Title`)}
            </h2>
          )}
          {step.key !== "intro" && t(`wizard.${step.key}Body`) !== `wizard.${step.key}Body` && (
            <p className="mb-6 mt-0" style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>
              {t(`wizard.${step.key}Body`)}
            </p>
          )}

          {step.render()}

          {stepError && (
            <p className="mt-4 mb-0" style={{ fontSize: "var(--text-sm)", color: "var(--status-danger)" }}>
              {stepError}
            </p>
          )}
        </div>
      </div>

      <div
        className="sticky bottom-0 flex items-center justify-between px-4 py-4 sm:px-6"
        style={{ background: "var(--surface-card)", borderTop: "var(--border-width-hairline) solid var(--border-subtle)" }}
      >
        <Button variant="outline" onClick={handleBack} disabled={isFirstStep || submitting}>
          {t("wizard.back")}
        </Button>
        <Button variant="primary" onClick={handleNext} disabled={submitting}>
          {isLastStep ? t(isEdit ? "modal.saveChanges" : "modal.publish") : t("wizard.next")}
        </Button>
      </div>
    </div>
  );
}
