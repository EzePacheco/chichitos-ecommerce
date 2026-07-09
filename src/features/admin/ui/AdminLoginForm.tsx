"use client";

import { useState } from "react";
import { Info, User } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { createBrowserSupabaseClient } from "@/platform/supabase/browser";

type AdminLoginFormProps = {
  nextPath: string;
};

export function AdminLoginForm({ nextPath }: AdminLoginFormProps) {
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleGoogleLogin() {
    setErrorMessage(undefined);
    setIsSubmitting(true);

    try {
      const redirectTo = new URL("/auth/callback", window.location.origin);
      redirectTo.searchParams.set("next", nextPath);

      const supabase = createBrowserSupabaseClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectTo.toString(),
          queryParams: {
            prompt: "select_account",
          },
        },
      });

      if (error) {
        setErrorMessage(
          "No pudimos iniciar sesión con Google. Probá nuevamente.",
        );
        setIsSubmitting(false);
      }
    } catch {
      setErrorMessage(
        "Falta configuración pública de Supabase para iniciar sesión.",
      );
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex-col mt-6">
      <Button
        type="button"
        variant="primary"
        size="lg"
        onClick={handleGoogleLogin}
        disabled={isSubmitting}
      >
        <User size={18} />
        {isSubmitting ? "Redirigiendo a Google..." : "Ingresar con Google"}
      </Button>
      {errorMessage ? (
        <div className="disclaimer" role="alert">
          <Info size={18} />
          <span>{errorMessage}</span>
        </div>
      ) : null}
    </div>
  );
}
