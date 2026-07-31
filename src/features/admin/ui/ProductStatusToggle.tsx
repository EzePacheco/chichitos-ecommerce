"use client";

import { useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { setCatalogProductStatusAction } from "@/features/admin/server/actions";

type ProductStatusToggleProps = {
  productId: string;
  productName: string;
  slug: string;
  status: "active" | "draft";
};

function StatusSubmitButton({
  isPublished,
  onDisable,
}: {
  isPublished: boolean;
  onDisable: () => void;
}) {
  const { pending } = useFormStatus();

  return (
    <Button
      disabled={pending}
      onClick={isPublished ? onDisable : undefined}
      size="sm"
      type={isPublished ? "button" : "submit"}
      variant="outline"
    >
      {pending
        ? "Actualizando..."
        : isPublished
          ? "Deshabilitar"
          : "Publicar"}
    </Button>
  );
}

export function ProductStatusToggle({
  productId,
  productName,
  slug,
  status,
}: ProductStatusToggleProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const isPublished = status === "active";

  return (
    <>
      <form action={setCatalogProductStatusAction} ref={formRef}>
        <input name="productId" type="hidden" value={productId} />
        <input name="slug" type="hidden" value={slug} />
        <input
          name="status"
          type="hidden"
          value={isPublished ? "draft" : "active"}
        />
        <StatusSubmitButton
          isPublished={isPublished}
          onDisable={() => setConfirmOpen(true)}
        />
      </form>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deshabilitar producto</DialogTitle>
            <DialogDescription>
              «{productName}» va a dejar de mostrarse en la tienda. Podés
              volver a publicarlo cuando quieras desde esta misma tabla.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => setConfirmOpen(false)}
              type="button"
              variant="ghost"
            >
              Cancelar
            </Button>
            <Button
              onClick={() => {
                setConfirmOpen(false);
                formRef.current?.requestSubmit();
              }}
              type="button"
              variant="primary"
            >
              Sí, deshabilitar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
