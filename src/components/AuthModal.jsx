import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useLanguage } from "../i18n/LanguageContext";

export default function AuthModal({ onClose, onAuthenticated }) {
  const { t } = useLanguage();
  const { signUp, signIn } = useAuth();
  const [mode, setMode] = useState("signIn");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-kraft-900/50 p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm overflow-hidden rounded-lg border-2 border-kraft-400 bg-kraft-50 shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-kraft-300 bg-kraft-100 px-5 py-4">
          <h2 className="text-xl font-semibold text-kraft-900">
            {mode === "signIn" ? t("auth.logIn") : t("auth.signUp")}
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
          {mode === "signUp" && (
            <label className="flex flex-col gap-1 text-sm text-kraft-800">
              {t("auth.fullName")}
              <input
                required
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="rounded-md border border-kraft-300 bg-white px-3 py-2 text-sm focus:border-kraft-500 focus:outline-none focus:ring-2 focus:ring-kraft-400"
              />
            </label>
          )}

          <label className="flex flex-col gap-1 text-sm text-kraft-800">
            {t("auth.email")}
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-md border border-kraft-300 bg-white px-3 py-2 text-sm focus:border-kraft-500 focus:outline-none focus:ring-2 focus:ring-kraft-400"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm text-kraft-800">
            {t("auth.password")}
            <input
              required
              type="password"
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-md border border-kraft-300 bg-white px-3 py-2 text-sm focus:border-kraft-500 focus:outline-none focus:ring-2 focus:ring-kraft-400"
            />
          </label>

          {error && <p className="text-sm text-stamp">{error}</p>}
          {info && <p className="text-sm text-kraft-700">{info}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="rounded-md bg-stamp px-4 py-2 text-sm font-medium text-kraft-50 transition hover:opacity-90 disabled:opacity-60"
          >
            {mode === "signIn" ? t("auth.logIn") : t("auth.signUp")}
          </button>

          <button
            type="button"
            onClick={() => {
              setMode((m) => (m === "signIn" ? "signUp" : "signIn"));
              setError("");
              setInfo("");
            }}
            className="text-sm text-kraft-700 underline hover:text-kraft-900"
          >
            {mode === "signIn" ? t("auth.needAccount") : t("auth.haveAccount")}
          </button>
        </form>
      </div>
    </div>
  );
}
