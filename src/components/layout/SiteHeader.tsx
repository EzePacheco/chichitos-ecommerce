import Image from "next/image";
import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>
      <div className="container site-header-inner">
        <Link className="brand-link" href="/" aria-label="Ir al inicio de Chichitos">
          <span className="brand-mark" aria-hidden="true">
            <Image
              src="/brand/logo-chichitos-dark.png"
              alt=""
              width={46}
              height={46}
              priority
            />
          </span>
          <span>Chichitos</span>
        </Link>
        <nav className="main-nav" aria-label="Navegacion principal">
          <Link href="/catalogo">Catalogo</Link>
          <Link href="/carrito">Carrito</Link>
          <Link href="/checkout">Checkout</Link>
          <Link href="/admin">Admin</Link>
        </nav>
      </div>
    </header>
  );
}
