"use client";

import { useEffect, useRef, useState } from "react";
import { buildWhatsAppHref } from "@/shared/contact/whatsapp";

type WhatsAppFloatProps = {
  phoneNumber?: string;
};

export function WhatsAppFloat({ phoneNumber }: WhatsAppFloatProps) {
  const [visible, setVisible] = useState(true);
  const lastY = useRef(0);

  useEffect(() => {
    function handleScroll() {
      const y = window.scrollY;
      setVisible(y < lastY.current || y < 200);
      lastY.current = y;
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      style={{ opacity: visible ? 1 : 0.4 }}
    >
      <svg
        className="wa-float__icon"
        viewBox="0 0 32 32"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M16.001 5.333c-5.891 0-10.667 4.776-10.667 10.667 0 1.96.534 3.795 1.46 5.376L5.333 26.667l5.467-1.43a10.62 10.62 0 0 0 5.2 1.336c5.892 0 10.667-4.776 10.667-10.667S21.893 5.333 16.001 5.333zm0 19.466c-1.586 0-3.067-.453-4.32-1.226l-3.013.787.8-2.933a8.7 8.7 0 0 1-1.36-4.667c0-4.853 3.96-8.8 8.813-8.8 4.853 0 8.813 3.947 8.813 8.8 0 4.853-3.96 8.813-8.813 8.813zm4.853-6.587c-.267-.133-1.573-.773-1.813-.867-.24-.093-.413-.133-.587.133-.173.267-.68.867-.84 1.053-.16.187-.307.213-.573.067-.267-.133-1.12-.413-2.133-1.32-.787-.707-1.32-1.573-1.48-1.84-.16-.267-.013-.413.12-.547.12-.12.267-.307.4-.467.133-.16.173-.267.267-.453.093-.187.04-.347-.027-.48-.067-.133-.587-1.413-.8-1.933-.213-.507-.427-.44-.587-.453-.16-.013-.347-.013-.533-.013-.187 0-.493.067-.747.347-.267.267-.987.96-.987 2.36 0 1.4 1.013 2.747 1.147 2.933.133.187 1.973 3.027 4.787 4.24.667.293 1.187.467 1.6.6.667.213 1.28.187 1.76.107.533-.08 1.573-.64 1.8-1.267.227-.627.227-1.16.16-1.267-.067-.107-.24-.173-.507-.307z" />
      </svg>
      <span className="wa-float__label">WhatsApp</span>
    </a>
  );
}
