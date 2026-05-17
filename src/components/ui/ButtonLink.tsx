type ButtonLinkProps = {
  children: React.ReactNode;
  href: string;
  variant?: "primary" | "ghost";
};

export function ButtonLink({ children, href, variant = "primary" }: ButtonLinkProps) {
  return (
    <a className={`button button-${variant}`} href={href}>
      {children}
    </a>
  );
}
