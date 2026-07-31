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
  const paddedAsset = variant !== "full";
  const width = paddedAsset
    ? Math.round((height * 1050) / 438)
    : Math.round(height * 1.5);

  if (paddedAsset) {
    const renderedHeight = Math.round((height * 1024) / 438);
    const renderedWidth = Math.round((height * 1536) / 438);

    return (
      <span className="logo-frame" style={{ height, width }}>
        <Image
          className="logo-img"
          src={src}
          alt="Chichitos"
          width={renderedWidth}
          height={renderedHeight}
          priority={priority}
          style={{
            left: -Math.round((height * 248) / 438),
            top: -Math.round((height * 290) / 438),
          }}
        />
      </span>
    );
  }

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
