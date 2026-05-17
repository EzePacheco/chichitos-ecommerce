import Link from "next/link";
import { Icon, Logo } from "@/components/ui/design-system";

export function SiteHeader() {
  return (
    <header className="header">
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>
      <div className="container header__inner">
        <Link
          className="header__logo-link"
          href="/"
          aria-label="Ir al inicio de Chichitos"
        >
          <Logo height={44} priority />
        </Link>

        <nav className="header__nav" aria-label="Navegación principal">
          <Link href="/catalogo">Catálogo</Link>
          <Link href="/#como-comprar">Cómo comprar</Link>
          <Link href="/checkout">Checkout</Link>
          <Link href="/admin">Admin</Link>
        </nav>

        <div className="header__actions">
          <Link
            className="icon-btn"
            href="/catalogo"
            aria-label="Buscar en el catálogo"
          >
            <Icon name="search" />
          </Link>
          <Link className="icon-btn" href="/carrito" aria-label="Ver carrito">
            <Icon name="bag" />
            <span className="icon-btn__badge">2</span>
          </Link>
          <Link
            className="icon-btn menu-btn"
            href="/catalogo"
            aria-label="Abrir catálogo"
          >
            <Icon name="menu" />
          </Link>
        </div>
      </div>
    </header>
  );
}
