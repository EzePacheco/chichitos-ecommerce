import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";

export type IconName =
  | "bag"
  | "card"
  | "check"
  | "chevronL"
  | "chevronR"
  | "cloud"
  | "download"
  | "edit"
  | "filter"
  | "heart"
  | "home"
  | "info"
  | "layers"
  | "menu"
  | "package"
  | "pin"
  | "plus"
  | "ruler"
  | "search"
  | "settings"
  | "sparkles"
  | "store"
  | "trash"
  | "truck"
  | "user"
  | "x";

type IconProps = {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  className?: string;
  style?: CSSProperties;
};

const iconPaths: Record<IconName, ReactNode> = {
  bag: <><path d="M6 8h12l-1 12H7L6 8Z" /><path d="M9 8a3 3 0 0 1 6 0" /></>,
  card: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 10h18" /><path d="M7 15h4" /></>,
  check: <path d="m5 12 4 4L19 6" />,
  chevronL: <path d="m15 18-6-6 6-6" />,
  chevronR: <path d="m9 18 6-6-6-6" />,
  cloud: <path d="M17.5 18H8a5 5 0 1 1 1.4-9.8A6 6 0 0 1 20 12a3.5 3.5 0 0 1-2.5 6Z" />,
  download: <><path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M5 21h14" /></>,
  edit: <><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></>,
  filter: <><path d="M4 6h16" /><path d="M7 12h10" /><path d="M10 18h4" /></>,
  heart: <path d="M20.8 8.6c0 5.2-8.8 10.2-8.8 10.2S3.2 13.8 3.2 8.6A4.8 4.8 0 0 1 12 5.8a4.8 4.8 0 0 1 8.8 2.8Z" />,
  home: <><path d="m3 11 9-8 9 8" /><path d="M5 10v10h14V10" /><path d="M10 20v-6h4v6" /></>,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 10v6" /><path d="M12 7h.01" /></>,
  layers: <><path d="m12 2 9 5-9 5-9-5Z" /><path d="m3 12 9 5 9-5" /><path d="m3 17 9 5 9-5" /></>,
  menu: <><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></>,
  package: <><path d="m12 2 8 4.5v9L12 20l-8-4.5v-9Z" /><path d="M12 11 4 6.5" /><path d="m12 11 8-4.5" /><path d="M12 11v9" /></>,
  pin: <><path d="M12 21s7-5.2 7-12a7 7 0 1 0-14 0c0 6.8 7 12 7 12Z" /><circle cx="12" cy="9" r="2.5" /></>,
  plus: <><path d="M12 5v14" /><path d="M5 12h14" /></>,
  ruler: <><path d="M4 15 15 4l5 5L9 20Z" /><path d="m9 10 2 2" /><path d="m12 7 2 2" /><path d="m6 13 2 2" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="m16 16 5 5" /></>,
  settings: <><path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" /><path d="M19.4 15a1.8 1.8 0 0 0 .4 2l.1.1a2.1 2.1 0 0 1-3 3l-.1-.1a1.8 1.8 0 0 0-2-.4 1.8 1.8 0 0 0-1 1.6V21a2.1 2.1 0 0 1-4.2 0v-.2a1.8 1.8 0 0 0-1-1.6 1.8 1.8 0 0 0-2 .4l-.1.1a2.1 2.1 0 0 1-3-3l.1-.1a1.8 1.8 0 0 0 .4-2 1.8 1.8 0 0 0-1.6-1H3a2.1 2.1 0 0 1 0-4.2h.2a1.8 1.8 0 0 0 1.6-1 1.8 1.8 0 0 0-.4-2l-.1-.1a2.1 2.1 0 0 1 3-3l.1.1a1.8 1.8 0 0 0 2 .4 1.8 1.8 0 0 0 1-1.6V3a2.1 2.1 0 0 1 4.2 0v.2a1.8 1.8 0 0 0 1 1.6 1.8 1.8 0 0 0 2-.4l.1-.1a2.1 2.1 0 0 1 3 3l-.1.1a1.8 1.8 0 0 0-.4 2 1.8 1.8 0 0 0 1.6 1h.2a2.1 2.1 0 0 1 0 4.2h-.2a1.8 1.8 0 0 0-1.6 1Z" /></>,
  sparkles: <><path d="M12 2 9.7 8.4 3 11l6.7 2.6L12 20l2.3-6.4L21 11l-6.7-2.6Z" /><path d="M5 3v4" /><path d="M3 5h4" /></>,
  store: <><path d="M4 10h16l-1-5H5Z" /><path d="M6 10v10h12V10" /><path d="M9 20v-6h6v6" /></>,
  trash: <><path d="M4 7h16" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M6 7l1 14h10l1-14" /><path d="M9 7V4h6v3" /></>,
  truck: <><path d="M3 6h11v10H3Z" /><path d="M14 10h4l3 3v3h-7Z" /><circle cx="7" cy="18" r="2" /><circle cx="17" cy="18" r="2" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
  x: <><path d="M6 6l12 12" /><path d="M18 6 6 18" /></>,
};

export function Icon({ name, size = 20, strokeWidth = 1.75, className, style }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      height={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
      style={style}
      viewBox="0 0 24 24"
      width={size}
    >
      {iconPaths[name]}
    </svg>
  );
}

type LogoProps = {
  variant?: "dark" | "white" | "full";
  height?: number;
  priority?: boolean;
};

export function Logo({ variant = "dark", height = 44, priority = false }: LogoProps) {
  const src = variant === "white" ? "/brand/logo-chichitos-white.png" : variant === "full" ? "/brand/logo-chichitos-full.png" : "/brand/logo-chichitos-dark.png";
  const width = variant === "full" ? Math.round(height * 1.9) : Math.round(height * 2.7);

  return <Image className="logo-img" src={src} alt="Chichitos" width={width} height={height} priority={priority} />;
}

export type GarmentType = "Remera" | "Buzo" | "Body" | "Pantalón" | "Campera" | "Accesorio";
export type DesignShape = "cloud" | "star" | "sun" | "moon" | "rocket" | "flower" | "heart" | "rainbow";

type GarmentPlaceholderProps = {
  type?: GarmentType;
  color?: string;
  designShape?: DesignShape | null;
  designColor?: string;
  scale?: number;
  className?: string;
};

const garmentPaths: Record<GarmentType, ReactNode> = {
  Remera: <path d="M -30 -22 L -16 -32 Q -8 -24 0 -24 Q 8 -24 16 -32 L 30 -22 L 20 2 L 14 -2 L 14 30 L -14 30 L -14 -2 L -20 2 Z" />,
  Buzo: <path d="M -28 -18 L -12 -32 Q 0 -22 12 -32 L 28 -18 L 22 6 L 14 2 L 14 30 L -14 30 L -14 2 L -22 6 Z M -10 -29 Q 0 -18 10 -29" />,
  Body: <path d="M -22 -26 Q -10 -34 0 -24 Q 10 -34 22 -26 L 16 -4 L 12 26 Q 0 34 -12 26 L -16 -4 Z M -10 26 Q 0 20 10 26" />,
  Pantalón: <path d="M -18 -30 L 18 -30 L 14 32 L 2 32 L 0 -8 L -2 32 L -14 32 Z" />,
  Campera: <path d="M -26 -20 L -10 -32 L 0 -24 L 10 -32 L 26 -20 L 20 4 L 14 0 L 14 30 L -14 30 L -14 0 L -20 4 Z M 0 -22 L 0 30" />,
  Accesorio: <path d="M -24 -2 Q -18 -28 0 -28 Q 18 -28 24 -2 Q 18 20 0 28 Q -18 20 -24 -2 Z" />,
};

export function GarmentPlaceholder({
  type = "Remera",
  color = "var(--cream-50)",
  designShape = "cloud",
  designColor = "var(--celeste)",
  scale = 1,
  className,
}: GarmentPlaceholderProps) {
  return (
    <svg className={className} viewBox="-48 -48 96 96" role="img" aria-label={`Placeholder de ${type}`}>
      <g fill={color} stroke="var(--ink-900)" strokeLinejoin="round" strokeWidth="2.4">
        {garmentPaths[type]}
      </g>
      {designShape ? <DesignSvg shape={designShape} color={designColor} scale={scale} /> : null}
    </svg>
  );
}

type DesignSvgProps = {
  shape: DesignShape;
  color?: string;
  scale?: number;
  className?: string;
};

export function DesignSvg({ shape, color = "var(--coral)", scale = 1, className }: DesignSvgProps) {
  const common = { transform: `scale(${scale})`, transformOrigin: "center" };
  const shapes: Record<DesignShape, ReactNode> = {
    cloud: <path d="M -14 4 Q -18 -2 -12 -4 Q -14 -12 -4 -10 Q 0 -16 8 -12 Q 16 -12 14 -4 Q 20 -2 16 6 Z" />,
    star: <polygon points="0,-14 4,-4 14,-3 6,4 8,14 0,9 -8,14 -6,4 -14,-3 -4,-4" />,
    sun: <><circle cx="0" cy="0" r="7" /><g fill="none" stroke={color} strokeWidth="2"><line x1="0" y1="-13" x2="0" y2="-10" /><line x1="0" y1="13" x2="0" y2="10" /><line x1="-13" y1="0" x2="-10" y2="0" /><line x1="13" y1="0" x2="10" y2="0" /><line x1="-9" y1="-9" x2="-7" y2="-7" /><line x1="9" y1="9" x2="7" y2="7" /><line x1="-9" y1="9" x2="-7" y2="7" /><line x1="9" y1="-9" x2="7" y2="-7" /></g></>,
    moon: <path d="M -2 -12 Q -14 -6 -10 6 Q -4 14 8 10 Q -2 6 -4 -2 Q -2 -8 -2 -12 Z" />,
    rocket: <><path d="M 0 -14 Q 8 -6 8 4 L 0 10 L -8 4 Q -8 -6 0 -14 Z" /><circle cx="0" cy="-4" r="3" fill="white" /><path d="M -8 4 L -12 12 L -4 10 Z M 8 4 L 12 12 L 4 10 Z" /></>,
    flower: <><circle cx="0" cy="-7" r="4" /><circle cx="6" cy="-2" r="4" /><circle cx="4" cy="6" r="4" /><circle cx="-4" cy="6" r="4" /><circle cx="-6" cy="-2" r="4" /><circle cx="0" cy="0" r="3" fill="white" /></>,
    heart: <path d="M 0 12 L -10 0 Q -14 -8 -7 -10 Q -2 -10 0 -4 Q 2 -10 7 -10 Q 14 -8 10 0 Z" />,
    rainbow: <><path d="M -14 6 Q 0 -14 14 6" stroke={color} strokeWidth="3" fill="none" /><path d="M -10 6 Q 0 -8 10 6" stroke="white" strokeWidth="2.5" fill="none" /></>,
  };

  return (
    <g className={className} fill={color} style={common}>
      {shapes[shape]}
    </g>
  );
}

type EyebrowProps = {
  children: ReactNode;
  color?: string;
};

export function Eyebrow({ children, color }: EyebrowProps) {
  return (
    <span className="eyebrow" style={color ? { color } : undefined}>
      {children}
    </span>
  );
}

type GarmentTagProps = {
  children: ReactNode;
  variant?: "dashed" | "durazno" | "salvia" | "celeste" | "mostaza";
};

export function GarmentTag({ children, variant = "dashed" }: GarmentTagProps) {
  const variantClass = variant === "dashed" ? "chip--dashed" : `chip--${variant}`;
  return <span className={`chip ${variantClass}`}>{children}</span>;
}

export function OrderStatusBadge({ status }: { status: "new" | "prod" | "ready" | "shipped" | "done" | "cancelled" }) {
  const labels = {
    new: "Nuevo",
    prod: "En producción",
    ready: "Listo",
    shipped: "Enviado",
    done: "Completado",
    cancelled: "Cancelado",
  };

  return <span className={`status status--${status}`}>{labels[status]}</span>;
}
