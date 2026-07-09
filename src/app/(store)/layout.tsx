import { SiteFooter } from "@/features/store-shell/ui/SiteFooter";
import { SiteHeader } from "@/features/store-shell/ui/SiteHeader";
import { WhatsAppFloat } from "@/features/store-shell/ui/WhatsAppFloat";

export default function StoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SiteHeader
        whatsappNumber={process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}
      />
      <main id="contenido" className="site-main">
        {children}
      </main>
      <SiteFooter />
      <WhatsAppFloat phoneNumber={process.env.NEXT_PUBLIC_WHATSAPP_NUMBER} />
    </>
  );
}
