import type { ReactNode } from "react";

export type GarmentType =
  | "Remera"
  | "Buzo"
  | "Body"
  | "Pantalón"
  | "Campera"
  | "Accesorio";

export type DesignShape =
  | "cloud"
  | "star"
  | "sun"
  | "moon"
  | "rocket"
  | "flower"
  | "heart"
  | "rainbow";

type GarmentPlaceholderProps = {
  type?: GarmentType;
  color?: string;
  designShape?: DesignShape | null;
  designColor?: string;
  scale?: number;
  className?: string;
};

const garmentPaths: Record<GarmentType, string> = {
  Remera:
    "M40 35 L20 25 L10 45 L25 55 L25 95 L75 95 L75 55 L90 45 L80 25 L60 35 C58 42 52 46 50 46 C48 46 42 42 40 35 Z",
  Buzo: "M40 35 L18 28 L8 50 L22 60 L22 96 L78 96 L78 60 L92 50 L82 28 L60 35 C58 44 52 48 50 48 C48 48 42 44 40 35 Z M28 38 L28 50 M72 38 L72 50",
  Body: "M40 30 L25 22 L15 38 L28 48 L30 70 C30 78 38 84 50 84 C62 84 70 78 70 70 L72 48 L85 38 L75 22 L60 30 C58 38 52 42 50 42 C48 42 42 38 40 30 Z",
  Pantalón: "M30 15 L70 15 L72 40 L62 95 L52 95 L50 50 L48 95 L38 95 L28 40 Z",
  Campera:
    "M38 30 L18 22 L10 42 L22 52 L22 96 L42 96 L42 50 L58 50 L58 96 L78 96 L78 52 L90 42 L82 22 L62 30 C60 38 54 42 50 42 C46 42 40 38 38 30 Z",
  Accesorio:
    "M20 60 Q20 30 50 30 Q80 30 80 60 L80 70 L20 70 Z M15 70 L85 70 L82 80 L18 80 Z",
};

export function GarmentPlaceholder({
  type = "Remera",
  color = "var(--cream-50)",
  designShape = "cloud",
  designColor = "var(--celeste)",
  scale = 1,
  className,
}: GarmentPlaceholderProps) {
  const path = garmentPaths[type] || garmentPaths.Remera;

  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      role="img"
      aria-label={`Placeholder de ${type}`}
      style={{ overflow: "visible" }}
    >
      <defs>
        <filter id="paperGrain" x="0" y="0" width="100%" height="100%">
          <feTurbulence baseFrequency="0.9" numOctaves="2" seed="3" />
          <feColorMatrix values="0 0 0 0 0.95 0 0 0 0 0.93 0 0 0 0 0.88 0 0 0 0.08 0" />
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>
      </defs>
      <path
        d={path}
        fill={color}
        stroke="var(--ink-900)"
        strokeLinejoin="round"
        strokeWidth="1.2"
      />
      <path d={path} fill="url(#paperGrain)" opacity="0.5" />
      {designShape ? (
        <g transform={`translate(50 62) scale(${scale * 1.1})`}>
          <DesignSvg shape={designShape} color={designColor} />
        </g>
      ) : null}
    </svg>
  );
}

type DesignSvgProps = {
  shape: DesignShape;
  color?: string;
  scale?: number;
  className?: string;
};

export function DesignSvg({
  shape,
  color = "var(--coral)",
  scale = 1,
  className,
}: DesignSvgProps) {
  const common = { transform: `scale(${scale})`, transformOrigin: "center" };
  const shapes: Record<DesignShape, ReactNode> = {
    cloud: (
      <path d="M -14 4 Q -18 -2 -12 -4 Q -14 -12 -4 -10 Q 0 -16 8 -12 Q 16 -12 14 -4 Q 20 -2 16 6 Z" />
    ),
    star: (
      <polygon points="0,-14 4,-4 14,-3 6,4 8,14 0,9 -8,14 -6,4 -14,-3 -4,-4" />
    ),
    sun: (
      <>
        <circle cx="0" cy="0" r="7" />
        <g fill="none" stroke={color} strokeWidth="2">
          <line x1="0" y1="-13" x2="0" y2="-10" />
          <line x1="0" y1="13" x2="0" y2="10" />
          <line x1="-13" y1="0" x2="-10" y2="0" />
          <line x1="13" y1="0" x2="10" y2="0" />
          <line x1="-9" y1="-9" x2="-7" y2="-7" />
          <line x1="9" y1="9" x2="7" y2="7" />
          <line x1="-9" y1="9" x2="-7" y2="7" />
          <line x1="9" y1="-9" x2="7" y2="-7" />
        </g>
      </>
    ),
    moon: (
      <path d="M -2 -12 Q -14 -6 -10 6 Q -4 14 8 10 Q -2 6 -4 -2 Q -2 -8 -2 -12 Z" />
    ),
    rocket: (
      <>
        <path d="M 0 -14 Q 8 -6 8 4 L 0 10 L -8 4 Q -8 -6 0 -14 Z" />
        <circle cx="0" cy="-4" r="3" fill="white" />
        <path d="M -8 4 L -12 12 L -4 10 Z M 8 4 L 12 12 L 4 10 Z" />
      </>
    ),
    flower: (
      <>
        <circle cx="0" cy="-7" r="4" />
        <circle cx="6" cy="-2" r="4" />
        <circle cx="4" cy="6" r="4" />
        <circle cx="-4" cy="6" r="4" />
        <circle cx="-6" cy="-2" r="4" />
        <circle cx="0" cy="0" r="3" fill="white" />
      </>
    ),
    heart: (
      <path d="M 0 12 L -10 0 Q -14 -8 -7 -10 Q -2 -10 0 -4 Q 2 -10 7 -10 Q 14 -8 10 0 Z" />
    ),
    rainbow: (
      <>
        <path
          d="M -14 6 Q 0 -14 14 6"
          stroke={color}
          strokeWidth="3"
          fill="none"
        />
        <path
          d="M -10 6 Q 0 -8 10 6"
          stroke="white"
          strokeWidth="2.5"
          fill="none"
        />
      </>
    ),
  };

  return (
    <g className={className} fill={color} style={common}>
      {shapes[shape]}
    </g>
  );
}

type GarmentTagProps = {
  children: ReactNode;
  variant?: "dashed" | "durazno" | "salvia" | "celeste" | "mostaza";
};

export function GarmentTag({ children, variant = "dashed" }: GarmentTagProps) {
  const variantClass =
    variant === "dashed" ? "chip--dashed" : `chip--${variant}`;
  return <span className={`chip ${variantClass}`}>{children}</span>;
}
