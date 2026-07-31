"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronLeft,
  Home,
  Layers,
  Menu,
  Package,
  Settings,
  Store,
  X,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { Button } from "@/shared/ui/button";
import { Logo } from "@/shared/ui/design-system";

const navGroups = [
  {
    label: "Operación",
    items: [
      { href: "/admin", label: "Dashboard", icon: Home },
      { href: "/admin/pedidos", label: "Pedidos", icon: Package },
    ],
  },
  {
    label: "Catálogo",
    items: [
      { href: "/admin/productos", label: "Productos", icon: Store },
      { href: "/admin/disenos", label: "Diseños", icon: Layers },
    ],
  },
  {
    label: "Tienda",
    items: [
      { href: "/admin/configuracion", label: "Configuración", icon: Settings },
    ],
  },
];

function isActive(pathname: string, href: string) {
  return href === "/admin" ? pathname === href : pathname.startsWith(href);
}

export function AdminNav({
  email,
  displayName,
}: {
  email: string;
  displayName: string;
}) {
  const pathname = usePathname();
  const adminInitial = displayName.charAt(0).toUpperCase();
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) closeButtonRef.current?.focus();
  }, [open]);

  function closeNav() {
    setOpen(false);
    menuButtonRef.current?.focus();
  }

  function handleNavKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      closeNav();
      return;
    }

    if (event.key !== "Tab") return;

    const focusable = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    );
    const first = focusable[0];
    const last = focusable.at(-1);

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }

  return (
    <>
      <div className="admin__mobile-bar">
        <Logo height={36} />
        <Button
          aria-expanded={open}
          aria-label={open ? "Cerrar navegación" : "Abrir navegación"}
          onClick={() => (open ? closeNav() : setOpen(true))}
          ref={menuButtonRef}
          size="sm"
          type="button"
          variant="outline"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
          Menú
        </Button>
      </div>
      {open ? (
        <button
          aria-label="Cerrar navegación"
          className="admin__nav-backdrop"
          onClick={closeNav}
          tabIndex={-1}
          type="button"
        />
      ) : null}
      <aside
        className={`admin__sidebar ${open ? "is-open" : ""}`}
        onKeyDown={handleNavKeyDown}
      >
        <div className="admin__brand">
          <Logo variant="white" height={44} />
          <button
            aria-label="Cerrar navegación"
            className="admin__sidebar-close"
            onClick={closeNav}
            ref={closeButtonRef}
            type="button"
          >
            <X size={20} />
          </button>
        </div>
        <nav className="admin__nav" aria-label="Navegación de admin">
          {navGroups.map((group) => (
            <div className="admin__nav-group" key={group.label}>
              <span>{group.label}</span>
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(pathname, item.href);
                return (
                  <Link
                    aria-current={active ? "page" : undefined}
                    className={active ? "active" : ""}
                    href={item.href}
                    key={item.href}
                    onClick={() => setOpen(false)}
                  >
                    <Icon size={18} /> {item.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
        <div className="admin__sidebar-footer">
          <Button asChild variant="soft" size="sm">
            <Link href="/">
              <ChevronLeft size={16} /> Volver a la tienda
            </Link>
          </Button>
          <div className="flex-row admin__account">
            <div className="admin__avatar">{adminInitial}</div>
            <div className="caption">
              <div>{displayName}</div>
              <div>{email}</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
