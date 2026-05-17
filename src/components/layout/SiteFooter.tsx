import Link from "next/link";
import { Logo } from "@/components/ui/design-system";

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <Logo variant="white" height={60} />
            <p>
              Diseños propios, estampados a pedido. Hecha en Argentina, a mano,
              con tiempo.
            </p>
          </div>

          <div>
            <h4>Tienda</h4>
            <ul>
              <li>
                <Link href="/catalogo">Catálogo</Link>
              </li>
              <li>
                <Link href="/#como-comprar">Cómo comprar</Link>
              </li>
              <li>
                <Link href="/carrito">Carrito</Link>
              </li>
              <li>
                <Link href="/checkout">Checkout</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4>Ayuda</h4>
            <ul>
              <li>
                <Link href="/producto/remera-algodon">Guía de talles</Link>
              </li>
              <li>
                <Link href="/checkout">Envíos y retiro</Link>
              </li>
              <li>
                <Link href="/checkout">Mercado Pago</Link>
              </li>
              <li>
                <Link href="/admin">Admin</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4>Contacto</h4>
            <ul>
              <li>
                <a href="mailto:hola@chichitos.local">hola@chichitos.local</a>
              </li>
              <li>
                <Link href="/catalogo">Consultar por WhatsApp</Link>
              </li>
              <li>
                <span>Buenos Aires, Argentina</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer__legal">
          <span>© 2026 Chichitos</span>
          <span>Hecha para jugar, lista para soñar.</span>
        </div>
      </div>
    </footer>
  );
}
