import type { Metadata } from "next";
import { Caveat, DM_Serif_Display, Outfit } from "next/font/google";
import { Toaster } from "@/shared/ui/Toast";
import "./globals.css";

const display = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
});

const sans = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

const script = Caveat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-script",
});

export const metadata: Metadata = {
  title: "Chichitos | Ropa infantil estampada a pedido",
  description:
    "Ecommerce argentino de ropa infantil estampada con DTF, disenos propios y compra online completa.",
  icons: {
    icon: "/favicon.ico?v=cream",
    shortcut: "/favicon.ico?v=cream",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es-AR"
      className={`${display.variable} ${sans.variable} ${script.variable}`}
    >
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
