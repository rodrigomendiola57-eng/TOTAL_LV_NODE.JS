import { Navbar } from "@/components/layout/Navbar";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { WhatsAppFloatingButton } from "@/components/layout/WhatsAppDesktopButton";
import { PublicLocaleProviders } from "@/components/i18n/PublicLocaleProviders";
import {
  LOCALE_COOKIE,
  normalizeLocale,
} from "@/lib/i18n/locales";
import { cookies } from "next/headers";

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const initialLocale = normalizeLocale(
    cookieStore.get(LOCALE_COOKIE)?.value,
  );

  return (
    <PublicLocaleProviders initialLocale={initialLocale}>
      <Navbar />
      <div className="flex min-h-0 flex-1 flex-col">
        {children}
        <SiteFooter />
      </div>
      <WhatsAppFloatingButton />
    </PublicLocaleProviders>
  );
}
