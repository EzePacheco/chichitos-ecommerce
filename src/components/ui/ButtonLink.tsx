type ButtonLinkProps = {
  children: React.ReactNode;
  href: string;
  variant?: "primary" | "ghost" | "soft" | "whatsapp";
  size?: "sm" | "md" | "lg";
};

export function ButtonLink({
  children,
  href,
  variant = "primary",
  size = "md",
}: ButtonLinkProps) {
  const sizeClass = size === "md" ? "" : ` btn--${size}`;

  return (
    <a className={`btn btn--${variant}${sizeClass}`} href={href}>
      {children}
    </a>
  );
}
