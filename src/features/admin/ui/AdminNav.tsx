"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronLeft,
  Home,
  Layers,
  Package,
  Settings,
  Store,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Logo } from "@/shared/ui/design-system";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: Home },
  { href: "/admin/pedidos", label: "Pedidos", icon: Package },
  { href: "/admin/productos", label: "Productos", icon: Store },
  { href: "/admin/disenos", label: "Diseños", icon: Layers },
  { href: "/admin/configuracion", label: "Configuración", icon: Settings },
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

  return (
    <aside className="admin__sidebar">
      <div className="admin__brand">
        <Logo variant="white" height={44} />
      </div>
      <nav className="admin__nav" aria-label="Navegación de admin">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              className={isActive(pathname, item.href) ? "active" : ""}
              href={item.href}
              key={item.href}
            >
              <Icon size={18} /> {item.label}
            </Link>
          );
        })}
      </nav>
      <div style={{ marginTop: "auto" }}>
        <Button asChild variant="soft" size="sm">
          <Link href="/">
            <ChevronLeft size={16} /> Volver a la tienda
          </Link>
        </Button>
        <div className="flex-row mt-4 admin__account">
          <div className="admin__avatar">{adminInitial}</div>
          <div className="caption">
            <div style={{ color: "var(--cream-50)", fontWeight: 700 }}>
              {displayName}
            </div>
            <div style={{ color: "var(--cream-300)" }}>{email}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
