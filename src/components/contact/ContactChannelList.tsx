import {
  contactHint,
  contactLabel,
  contactValue,
} from "@/components/contact/contact-typography";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export interface ContactChannelItem {
  id: "email" | "whatsapp" | "location";
  label: string;
  value: string;
  href: string;
  hint: string;
}

interface ContactChannelListProps {
  channels: readonly ContactChannelItem[];
  className?: string;
}

export function ContactChannelList({ channels, className }: ContactChannelListProps) {
  return (
    <div className={cn("flex flex-col gap-2.5 sm:gap-3", className)}>
      {channels.map((channel) => {
        const isExternal =
          channel.href.startsWith("http") || channel.href.startsWith("mailto:");

        return (
          <ContactChannelRow
            key={channel.id}
            label={channel.label}
            value={channel.value}
            hint={channel.hint}
            href={channel.href}
            isExternal={isExternal}
          />
        );
      })}
    </div>
  );
}

function ContactChannelRow({
  label,
  value,
  hint,
  href,
  isExternal,
}: {
  label: string;
  value: string;
  hint: string;
  href: string;
  isExternal: boolean;
}) {
  return (
    <Link
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className="group grid min-h-[4.75rem] grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-white/8 bg-black/20 px-3.5 py-3.5 transition-all hover:border-tl-gold/30 hover:bg-black/30 active:scale-[0.995] sm:min-h-[5.25rem] sm:items-start sm:gap-4 sm:px-5 sm:py-4 md:py-5"
    >
      <div className="min-w-0 space-y-1 sm:space-y-1.5">
        <p className={cn(contactLabel, "text-sm tracking-[0.12em] sm:text-[0.9375rem]")}>
          {label}
        </p>
        <p
          className={cn(
            contactValue,
            "text-[1.125rem] leading-snug break-words [overflow-wrap:anywhere] hyphens-auto sm:text-[1.2rem] md:text-[1.35rem]",
          )}
        >
          {value}
        </p>
        <p
          className={cn(
            contactHint,
            "text-sm line-clamp-2 sm:text-[0.9375rem] sm:line-clamp-none md:text-base",
          )}
        >
          {hint}
        </p>
      </div>

      <ArrowUpRight className="h-4 w-4 shrink-0 text-tl-beige/20 transition-colors group-hover:text-tl-gold sm:mt-1 sm:h-5 sm:w-5" />
    </Link>
  );
}
