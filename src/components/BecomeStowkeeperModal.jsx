import { useState } from "react";
import { useLanguage } from "../i18n/LanguageContext";
import { supabase } from "../lib/supabaseClient";
import { COMMUNITY_AGREEMENT_VERSION } from "../lib/legal";
import { Modal } from "../design-system/components/overlays/Modal";
import { Button } from "../design-system/components/core/Button";

export default function BecomeStowkeeperModal({ onClose, onAgreed }) {
  const { t } = useLanguage();
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const points = t("stowkeeper.agreementPoints");
  const pointsList = Array.isArray(points) ? points : [];

  const handleContinue = async () => {
    if (!agreed) return;
    setSubmitting(true);
    setError("");
    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        stowkeeper_agreement_accepted_at: new Date().toISOString(),
        stowkeeper_agreement_version: COMMUNITY_AGREEMENT_VERSION,
      },
    });
    setSubmitting(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    onAgreed();
  };

  return (
    <Modal title={t("stowkeeper.becomeTitle")} onClose={onClose}>
      <div className="flex flex-col gap-4">
        <p className="m-0" style={{ fontSize: "var(--text-md)", color: "var(--text-body)" }}>
          {t("stowkeeper.becomeIntro")}
        </p>

        <div
          className="rounded-lg p-4"
          style={{ background: "var(--surface-sunken)" }}
        >
          <h3 className="mt-0 mb-2" style={{ fontSize: "var(--text-md)", fontWeight: "var(--weight-bold)", color: "var(--text-strong)" }}>
            {t("stowkeeper.agreementTitle")}
          </h3>
          <p className="mt-0 mb-2" style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>
            {t("stowkeeper.agreementIntro")}
          </p>
          <ul className="m-0" style={{ paddingLeft: "var(--space-5)", display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
            {pointsList.map((point, i) => (
              <li key={i} style={{ fontSize: "var(--text-sm)", color: "var(--text-body)" }}>
                {point}
              </li>
            ))}
          </ul>
        </div>

        <label className="flex items-start gap-2" style={{ fontSize: "var(--text-sm)" }}>
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1"
          />
          <span>{t("stowkeeper.agreeCheckbox")}</span>
        </label>

        {error && <p className="m-0" style={{ fontSize: "var(--text-sm)", color: "var(--status-danger)" }}>{error}</p>}

        <div className="mt-2 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose}>
            {t("modal.cancel")}
          </Button>
          <Button type="button" variant="primary" disabled={!agreed || submitting} onClick={handleContinue}>
            {t("stowkeeper.continueButton")}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
