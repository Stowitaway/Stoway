import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useLanguage } from "../i18n/LanguageContext";
import { navigate } from "../lib/navigation";
import { supabase } from "../lib/supabaseClient";
import { Button } from "../design-system/components/core/Button";
import { Field, Input } from "../design-system/components/forms/Input";

async function deleteAllPhotos(userId) {
  for (;;) {
    const { data, error } = await supabase.storage
      .from("listing-photos")
      .list(userId, { limit: 1000 });
    if (error) throw error;
    if (!data || data.length === 0) return;
    const paths = data.map((f) => `${userId}/${f.name}`);
    const { error: removeError } = await supabase.storage.from("listing-photos").remove(paths);
    if (removeError) throw removeError;
    if (data.length < 1000) return;
  }
}

export default function AccountPage() {
  const { t } = useLanguage();
  const { user, signOut } = useAuth();
  const [confirmEmail, setConfirmEmail] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  if (!user) return null;

  const matches = confirmEmail.trim().toLowerCase() === user.email.trim().toLowerCase();

  const handleDelete = async () => {
    setError("");
    setDeleting(true);
    try {
      await deleteAllPhotos(user.id);
      const { error: rpcError } = await supabase.rpc("delete_my_account");
      if (rpcError) throw rpcError;
      setDone(true);
      await signOut();
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setError(err.message || t("report.error"));
      setDeleting(false);
    }
  };

  if (done) {
    return (
      <div className="article-page">
        <p style={{ fontSize: "var(--text-md)", color: "var(--text-strong)" }}>{t("account.deleted")}</p>
      </div>
    );
  }

  return (
    <div className="article-page">
      <article className="legal-article">
        <h1>{t("account.settings")}</h1>

        <Field label={t("account.name")}>
          <Input value={user.user_metadata?.full_name || ""} readOnly disabled />
        </Field>
        <div className="mt-4">
          <Field label={t("account.email")}>
            <Input value={user.email} readOnly disabled />
          </Field>
        </div>

        <div
          className="mt-10 rounded-lg p-5"
          style={{ border: "var(--border-width-strong) solid var(--status-danger)" }}
        >
          <h2 className="mt-0" style={{ color: "var(--status-danger)" }}>
            {t("account.deleteTitle")}
          </h2>
          <p>{t("account.deleteWarning")}</p>
          <Field label={t("account.deleteConfirm")}>
            <Input
              type="email"
              value={confirmEmail}
              onChange={(e) => setConfirmEmail(e.target.value)}
              autoComplete="off"
            />
          </Field>
          {error && (
            <p style={{ color: "var(--status-danger)", fontSize: "var(--text-sm)" }}>{error}</p>
          )}
          <div className="mt-4">
            <Button variant="neutral" disabled={!matches || deleting} onClick={handleDelete}>
              {t("account.deleteButton")}
            </Button>
          </div>
        </div>
      </article>
    </div>
  );
}
