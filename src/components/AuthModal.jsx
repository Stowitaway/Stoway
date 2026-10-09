import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useLanguage } from "../i18n/LanguageContext";
import { Modal } from "../design-system/components/overlays/Modal";
import { Field, Input } from "../design-system/components/forms/Input";
import { Button } from "../design-system/components/core/Button";
import { interpolateLinks } from "../lib/legal";

export default function AuthModal({ onClose, onAuthenticated }) {
  const { t } = useLanguage();
  const { signUp, signIn } = useAuth();
  const [mode, setMode] = useState("signIn");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");

    if (mode === "signUp" && !acceptTerms) return;

    setSubmitting(true);

    if (mode === "signUp") {
      const { error: signUpError } = await signUp(email, password, fullName);
      setSubmitting(false);
      if (signUpError) {
        setError(signUpError.message);
        return;
      }
      setInfo(t("auth.checkEmail"));
      return;
    }

    const { error: signInError } = await signIn(email, password);
    setSubmitting(false);
    if (signInError) {
      setError(signInError.message);
      return;
    }
    onAuthenticated?.();
  };

  return (
    <Modal title={mode === "signIn" ? t("auth.logIn") : t("auth.signUp")} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {mode === "signUp" && (
          <Field label={t("auth.fullName")}>
            <Input
              required
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </Field>
        )}

        <Field label={t("auth.email")}>
          <Input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>

        <Field label={t("auth.password")}>
          <Input
            required
            type="password"
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>

        {mode === "signUp" && (
          <label className="flex items-start gap-2" style={{ fontSize: "var(--text-sm)" }}>
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="mt-1"
            />
            <span>
              {interpolateLinks(t("auth.acceptTerms"), {
                terms: { label: t("legalTabTerms"), href: "/legal#terms" },
                privacy: { label: t("legalTabPrivacy"), href: "/legal#privacy" },
              })}
            </span>
          </label>
        )}

        {error && <p className="m-0" style={{ fontSize: "var(--text-sm)", color: "var(--status-danger)" }}>{error}</p>}
        {info && <p className="m-0" style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>{info}</p>}

        <Button type="submit" variant="primary" disabled={submitting || (mode === "signUp" && !acceptTerms)} block>
          {mode === "signIn" ? t("auth.logIn") : t("auth.signUp")}
        </Button>

        <Button
          type="button"
          variant="link"
          onClick={() => {
            setMode((m) => (m === "signIn" ? "signUp" : "signIn"));
            setError("");
            setInfo("");
          }}
        >
          {mode === "signIn" ? t("auth.needAccount") : t("auth.haveAccount")}
        </Button>
      </form>
    </Modal>
  );
}
