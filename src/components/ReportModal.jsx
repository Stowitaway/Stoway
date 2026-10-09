import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useLanguage } from "../i18n/LanguageContext";
import { supabase } from "../lib/supabaseClient";
import { Modal } from "../design-system/components/overlays/Modal";
import { Field, Input } from "../design-system/components/forms/Input";
import { Select } from "../design-system/components/forms/Select";
import { Textarea } from "../design-system/components/forms/Textarea";
import { Button } from "../design-system/components/core/Button";

const REASONS = ["illegal", "scam", "prohibited_items", "misleading", "abuse", "other"];

export default function ReportModal({ targetType, targetId, onClose }) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [reason, setReason] = useState(REASONS[0]);
  const [details, setDetails] = useState("");
  const [email, setEmail] = useState("");
  const [goodFaith, setGoodFaith] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const title = targetType === "conversation" ? t("report.titleConversation") : t("report.titleListing");
  const detailsOk = details.trim().length >= 10 && details.trim().length <= 2000;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!detailsOk || !goodFaith) return;
    setSubmitting(true);
    setError("");
    const { error: insertError } = await supabase.from("reports").insert({
      reporter_id: user?.id ?? null,
      reporter_email: user ? user.email : email || null,
      target_type: targetType,
      target_id: targetId,
      reason,
      details: details.trim(),
      good_faith: true,
    });
    setSubmitting(false);
    if (insertError) {
      setError(t("report.error"));
      return;
    }
    setDone(true);
  };

  return (
    <Modal title={title} onClose={onClose}>
      {done ? (
        <p style={{ fontSize: "var(--text-md)", color: "var(--text-strong)" }}>{t("report.thanks")}</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Field label={t("report.reason")}>
            <Select value={reason} onChange={(e) => setReason(e.target.value)}>
              {REASONS.map((r) => (
                <option key={r} value={r}>
                  {t(`report.reasons.${r}`)}
                </option>
              ))}
            </Select>
          </Field>

          <Field
            label={t("report.details")}
            hint={`${details.trim().length}/2000`}
          >
            <Textarea
              required
              rows={4}
              minLength={10}
              maxLength={2000}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          </Field>

          {!user && (
            <Field label={t("report.email")}>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </Field>
          )}

          <label className="flex items-start gap-2" style={{ fontSize: "var(--text-sm)" }}>
            <input
              type="checkbox"
              checked={goodFaith}
              onChange={(e) => setGoodFaith(e.target.checked)}
              required
              className="mt-1"
            />
            <span>{t("report.goodFaith")}</span>
          </label>

          {error && <p style={{ color: "var(--status-danger)", fontSize: "var(--text-sm)" }}>{error}</p>}

          <Button type="submit" variant="primary" disabled={!detailsOk || !goodFaith || submitting}>
            {t("report.submit")}
          </Button>
        </form>
      )}
    </Modal>
  );
}
