type WhatsAppFloatProps = {
  phoneNumber?: string;
};

export function WhatsAppFloat({ phoneNumber }: WhatsAppFloatProps) {
  if (!phoneNumber) {
    return null;
  }

  const message = encodeURIComponent("Hola Chichitos, quiero hacer una consulta sobre una prenda.");

  return (
    <a
      className="button whatsapp-float"
      href={`https://wa.me/${phoneNumber}?text=${message}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Consultar por WhatsApp"
    >
      WhatsApp
    </a>
  );
}
