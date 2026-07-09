import Image from "next/image";
import type { ReactNode } from "react";

type LogoProps = {
  variant?: "dark" | "white" | "full";
  height?: number;
  priority?: boolean;
};

export function Logo({
  variant = "dark",
  height = 44,
  priority = false,
}: LogoProps) {
  const src =
    variant === "white"
      ? "/brand/logo-chichitos-white.png"
      : variant === "full"
        ? "/brand/logo-chichitos-full.png"
        : "/brand/logo-chichitos-dark.png";
  const width = Math.round(height * 1.5);

  return (
    <Image
      className="logo-img"
      src={src}
      alt="Chichitos"
      width={width}
      height={height}
      priority={priority}
    />
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
