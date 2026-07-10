"use client";

import { ContactChannelList } from "@/components/contact/ContactChannelList";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactReassurance } from "@/components/contact/ContactReassurance";
import {
  contactBody,
  contactButton,
  contactEyebrow,
  contactFormColumn,
  contactInfoColumn,
  contactLabel,
  contactMainGrid,
  contactSectionShell,
  contactTitle,
} from "@/components/contact/contact-typography";
import { Reveal } from "@/components/ui/Reveal";
import { ABOUT_CONTAINER } from "@/lib/about-layout";
import { CONTACT_PAGE } from "@/lib/data/contact-page";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

interface ContactViewProps {
  propertyContext?: {
    id: number;
    title: string;
  } | null;
}

export function ContactView({ propertyContext = null }: ContactViewProps) {
  const defaultMessage = propertyContext
    ? `Me interesa la propiedad "${propertyContext.title}". Me gustaría recibir más información.`
    : "";

  return (
    <main className="relative isolate flex min-h-dvh flex-1 flex-col overflow-x-hidden bg-[#1a1a18] font-outfit">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#1a1a18_0%,#242820_38%,#1a1a18_100%)]" />
        <div className="absolute left-1/2 top-[-10%] h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(214,181,133,0.14),transparent_68%)] blur-3xl" />
        <div className="absolute bottom-[4%] left-[-10%] h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(74,78,56,0.32),transparent_70%)] blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(242,236,224,1)_1px,transparent_1px),linear-gradient(90deg,rgba(242,236,224,1)_1px,transparent_1px)] bg-[size:58px_58px] opacity-[0.03] [mask-image:radial-gradient(72%_52%_at_50%_18%,black,transparent)]" />
      </div>

      <section className={contactSectionShell}>
        <div className={cn(ABOUT_CONTAINER, "max-w-6xl xl:max-w-7xl")}>
          <div className={contactMainGrid}>
            <div className={contactFormColumn}>
              <Reveal delay={0.02}>
                <ContactForm
                  interestedIn={propertyContext?.id ?? null}
                  propertyLabel={propertyContext?.title}
                  defaultMessage={defaultMessage}
                />
              </Reveal>
            </div>

            <div className={contactInfoColumn}>
              <Reveal>
                <div className="max-w-2xl xl:max-w-none">
                  <p className={contactEyebrow}>{CONTACT_PAGE.hero.eyebrow}</p>
                  <h1 className={cn("mt-3 sm:mt-4", contactTitle)}>
                    {CONTACT_PAGE.hero.title}
                  </h1>
                  <p className={cn("mt-4 max-w-xl sm:mt-5", contactBody)}>
                    {CONTACT_PAGE.hero.description}
                  </p>
                </div>
              </Reveal>

              <Reveal delay={0.05}>
                <ContactChannelList channels={CONTACT_PAGE.channels} />
              </Reveal>

              <Reveal delay={0.08}>
                <ContactReassurance />
              </Reveal>

              {propertyContext ? (
                <Reveal delay={0.1}>
                  <div className="rounded-2xl border border-tl-gold/22 bg-tl-gold/10 p-4 sm:p-5 md:p-6">
                    <p className={contactLabel}>Propiedad de interés</p>
                    <p className={cn("mt-2", contactBody)}>{propertyContext.title}</p>
                    <Link
                      href={`/propiedades/${propertyContext.id}`}
                      className={cn(
                        "mt-3 inline-flex min-h-11 items-center gap-1 text-tl-gold transition-opacity hover:opacity-80",
                        contactButton,
                      )}
                    >
                      Ver ficha
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </div>
                </Reveal>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
