import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";

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
