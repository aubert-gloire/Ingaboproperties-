import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import WhatsAppFloat from "@/components/public/WhatsAppFloat";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function PublicLayout(props: { params: Promise<{ locale: string }>; children: React.ReactNode }) {
  const { locale } = await props.params;

  if (!routing.locales.includes(locale as "en" | "fr" | "rw")) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <Navbar />
      <main className="flex-1">{props.children}</main>
      <Footer />
      <WhatsAppFloat />
    </NextIntlClientProvider>
  );
}
