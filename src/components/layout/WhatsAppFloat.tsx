import { Icon } from "@/components/ui/design-system";
import { buildWhatsAppHref } from "@/lib/whatsapp";

type WhatsAppFloatProps = {
  phoneNumber?: string;
};

export function WhatsAppFloat({ phoneNumber }: WhatsAppFloatProps) {
  const whatsappHref = buildWhatsAppHref(
    phoneNumber,
    "Hola Chichitos, quiero hacer una consulta sobre una prenda.",
  );

  if (!whatsappHref) {
    return null;
  }

  return (
    <a
      className="wa-float"
      href={whatsappHref}
      target="_blank"
      rel="noreferrer"
      aria-label="Consultar por WhatsApp"
    >
      <span className="wa-float__icon" aria-hidden="true">
        <Icon name="cloud" size={28} />
      </span>
      <span className="wa-float__label">WhatsApp</span>
    </a>
  );
}
