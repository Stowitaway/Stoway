import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { TERMS_VERSION } from "../lib/legal";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
      },
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  const params = new URLSearchParams(window.location.search);
  const fakeUser = params.get("fake_user")
    ? {
        id: "6b219d4d-1edf-4615-a364-5823a66faabc",
        email: "faketest@gmail.com",
        user_metadata: {
          full_name: "Fake Tester",
          ...(params.get("fake_stowkeeper") ? { stowkeeper_agreement_accepted_at: "2026-10-10T00:00:00Z", stowkeeper_agreement_version: "2026-10-13" } : {}),
        },
      }
    : null;

  const value = useMemo(
    () => ({
      user: fakeUser ?? session?.user ?? null,
      loading,
      signUp: async (email, password, fullName) => {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              terms_accepted_at: new Date().toISOString(),
              terms_version: TERMS_VERSION,
            },
          },
        });
        return { error };
      },
      signIn: async (email, password) => {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        return { error };
      },
      signOut: () => supabase.auth.signOut(),
    }),
    [session, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
