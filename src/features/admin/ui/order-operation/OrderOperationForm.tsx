"use client";

import { useState } from "react";
import type { AdminOrderDetail } from "@/server/orders/admin-orders";
import { saveOrderOperationAction } from "@/features/admin/server/actions";
import { AdminActionForm } from "@/features/admin/ui/AdminActionForm";
import { AdminField } from "@/features/admin/ui/AdminField";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";

type OrderOperationFormProps = {
  order: AdminOrderDetail;
};

export function OrderOperationForm({ order }: OrderOperationFormProps) {
  const [operationalStatus, setOperationalStatus] = useState(order.rawStatus);
  const [cancelConfirmationOpen, setCancelConfirmationOpen] = useState(false);

  return (
    <>
      <AdminActionForm
        action={saveOrderOperationAction}
        pendingLabel="Guardando operación..."
        submitLabel="Guardar operación"
      >
        <input name="orderId" type="hidden" value={order.id} />

        <section className="admin-form__section">
          <h3>Estado y seguimiento</h3>
          <AdminField
            label="Estado"
            name="operationalStatus"
            requirement="required"
          >
            <select
              className="select"
              onChange={(event) => {
                const nextStatus = event.target.value as typeof operationalStatus;

                if (
                  nextStatus === "cancelled" &&
                  operationalStatus !== "cancelled"
                ) {
                  setCancelConfirmationOpen(true);
                  return;
                }

                setOperationalStatus(nextStatus);
              }}
              value={operationalStatus}
            >
              <option value="new">Nuevo</option>
              <option value="in_production">En producción</option>
              <option value="ready">Listo</option>
              <option value="shipped">Enviado</option>
              <option value="completed">Completado</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </AdminField>
          <AdminField
            label="Notas internas"
            name="adminNotes"
            requirement="optional"
          >
            <textarea
              className="textarea"
              defaultValue={order.adminNotes ?? ""}
              rows={4}
            />
          </AdminField>
        </section>

        <details className="admin-form__details admin-form__section" open>
          <summary className="admin-form__section-head admin-form__summary">
            <strong>Datos del cliente</strong>
          </summary>
          <div className="field-grid">
            <AdminField
              label="Cliente"
              name="buyerName"
              requirement="required"
            >
              <input className="input" defaultValue={order.customer} />
            </AdminField>
            <AdminField
              label="Teléfono"
              name="buyerPhone"
              requirement="required"
            >
              <input
                className="input"
                defaultValue={order.buyerPhone}
                inputMode="tel"
                type="tel"
              />
            </AdminField>
          </div>
          <AdminField
            label="Email"
            name="buyerEmail"
            requirement="optional"
          >
            <input
              className="input"
              defaultValue={order.buyerEmail ?? ""}
              type="email"
            />
          </AdminField>
        </details>

        <details className="admin-form__details admin-form__section" open>
          <summary className="admin-form__section-head admin-form__summary">
            <strong>Datos de entrega</strong>
          </summary>
          <div className="field-grid">
            <AdminField
              label="Recibe"
              name="recipientName"
              requirement="optional"
            >
              <input
                className="input"
                defaultValue={order.delivery?.recipientName ?? ""}
              />
            </AdminField>
            <AdminField
              label="Código postal"
              name="postalCode"
              requirement="optional"
            >
              <input
                className="input"
                defaultValue={order.delivery?.postalCode ?? ""}
              />
            </AdminField>
          </div>
          <AdminField
            label="Dirección"
            name="addressLine"
            requirement="optional"
          >
            <input
              className="input"
              defaultValue={order.delivery?.addressLine ?? ""}
            />
          </AdminField>
          <div className="field-grid">
            <AdminField label="Ciudad" name="city" requirement="optional">
              <input
                className="input"
                defaultValue={order.delivery?.city ?? ""}
              />
            </AdminField>
            <AdminField
              label="Provincia"
              name="province"
              requirement="optional"
            >
              <input
                className="input"
                defaultValue={order.delivery?.province ?? ""}
              />
            </AdminField>
          </div>
          <AdminField
            label="Instrucciones"
            name="instructions"
            requirement="optional"
          >
            <textarea
              className="textarea"
              defaultValue={order.delivery?.instructions ?? ""}
              rows={3}
            />
          </AdminField>
        </details>
      </AdminActionForm>

      <Dialog
        open={cancelConfirmationOpen}
        onOpenChange={setCancelConfirmationOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancelar pedido</DialogTitle>
            <DialogDescription>
              El pedido quedará marcado como cancelado cuando guardes la
              operación. Esta acción no modifica ni devuelve el pago.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => setCancelConfirmationOpen(false)}
              type="button"
              variant="ghost"
            >
              Volver
            </Button>
            <Button
              onClick={() => {
                setOperationalStatus("cancelled");
                setCancelConfirmationOpen(false);
              }}
              type="button"
              variant="destructive"
            >
              Sí, marcar como cancelado
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
