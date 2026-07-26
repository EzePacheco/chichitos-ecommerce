import Link from "next/link";
import { buildWhatsAppHref } from "@/shared/contact/whatsapp";
import { Logo } from "@/shared/ui/design-system";

export function SiteFooter() {
  const whatsappHref = buildWhatsAppHref(
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
    "Hola Chichitos, quiero hacer una consulta sobre una prenda.",
  );

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <Logo variant="white" height={60} />
            <p>
              Indumentaria infantil estampada con DTF. Diseños propios, hecha en
              Argentina, a mano y con tiempo.
            </p>
          </div>

          <div>
            <h4>Tienda</h4>
            <ul>
              <li>
                <Link href="/catalogo">Catálogo</Link>
              </li>
              <li>
                <Link href="/#como-comprar">Diseños propios</Link>
              </li>
              <li>
                <Link href="/catalogo">Personalización</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4>Ayuda</h4>
            <ul>
              <li>
                <Link href="/#como-comprar">Cómo comprar</Link>
              </li>
              <li>
                <Link href="/checkout">Envíos y retiro</Link>
              </li>
              <li>
                <Link href="/checkout">Cambios y devoluciones</Link>
              </li>
            </ul>
          </div>

          {whatsappHref ? (
            <div>
              <h4>Contacto</h4>
              <ul>
                <li>
                  <a href={whatsappHref} target="_blank" rel="noreferrer">
                    WhatsApp
                  </a>
                </li>
              </ul>
            </div>
          ) : null}
        </div>

        <div className="footer__legal">
          <span>© 2026 Chichitos. Hecha con paciencia en Argentina.</span>
          <span>Pagás con Mercado Pago · Enviamos a todo el país</span>
        </div>
      </div>
    </footer>
  );
}
