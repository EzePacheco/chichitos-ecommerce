"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, Search, ShoppingBag, Sparkles, X } from "lucide-react";
import { Logo } from "@/shared/ui/design-system";
import { Button } from "@/shared/ui/button";
import { buildWhatsAppHref } from "@/shared/contact/whatsapp";

type NavLink = {
  href: string;
  label: string;
  external?: boolean;
  matchPrefix?: string;
};

type SiteHeaderProps = {
  whatsappNumber?: string;
  cartCount?: number;
};

export function SiteHeader({ whatsappNumber, cartCount = 0 }: SiteHeaderProps) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const whatsappHref = buildWhatsAppHref(
    whatsappNumber,
    "Hola Chichitos, quiero hacer una consulta sobre una prenda.",
  );

  const links: NavLink[] = [
    { href: "/", label: "Inicio" },
    { href: "/catalogo", label: "Catálogo", matchPrefix: "/catalogo" },
    { href: "/#como-comprar", label: "Cómo comprar" },
  ];

  if (whatsappHref) {
    links.push({ href: whatsappHref, label: "WhatsApp", external: true });
  }

  function isActive(link: NavLink) {
    if (link.external) return false;
    if (link.matchPrefix) return pathname.startsWith(link.matchPrefix);
    return pathname === link.href;
  }

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
          {links.map((link) =>
            link.external ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className={isActive(link) ? "active" : ""}
              >
                {link.label}
              </Link>
            ),
          )}
        </nav>

        <div className="header__actions">
          <Link
            className="icon-btn"
            href="/catalogo"
            aria-label="Buscar en el catálogo"
          >
            <Search size={20} />
          </Link>
          <Link className="icon-btn" href="/carrito" aria-label="Ver carrito">
            <ShoppingBag size={20} />
            {cartCount > 0 ? (
              <span className="icon-btn__badge">{cartCount}</span>
            ) : null}
          </Link>
          <button
            type="button"
            className="icon-btn menu-btn"
            onClick={() => setDrawerOpen(true)}
            aria-label="Abrir menú"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      <div
        className={`drawer ${drawerOpen ? "is-open" : ""}`}
        onClick={(event) => {
          if (event.target === event.currentTarget) setDrawerOpen(false);
        }}
        aria-hidden={!drawerOpen}
      >
        <div className="drawer__panel">
          <div
            style={{
              alignItems: "center",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Logo height={36} />
            <button
              type="button"
              className="icon-btn"
              onClick={() => setDrawerOpen(false)}
              aria-label="Cerrar menú"
            >
              <X size={20} />
            </button>
          </div>
          <ul className="drawer__list">
            {links.map((link) => (
              <li key={link.href}>
                {link.external ? (
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => setDrawerOpen(false)}
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link href={link.href} onClick={() => setDrawerOpen(false)}>
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
          {whatsappHref ? (
            <Button asChild variant="whatsapp">
              <a href={whatsappHref} target="_blank" rel="noreferrer">
                <Sparkles size={18} /> Hablar por WhatsApp
              </a>
            </Button>
          ) : null}
        </div>
      </div>
    </header>
  );
}
