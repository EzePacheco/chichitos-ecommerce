"use client";

import { RotateCcw } from "lucide-react";
import { Button } from "@/shared/ui/button";

export default function AdminError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="card admin-error" role="alert">
      <span className="eyebrow">No se pudo cargar</span>
      <h1>Algo salió mal en el panel</h1>
      <p>
        No se modificaron datos. Revisá tu conexión y volvé a intentar.
      </p>
      <Button onClick={reset} type="button" variant="primary">
        <RotateCcw size={18} /> Reintentar
      </Button>
    </section>
  );
}
