import type { ComponentType, SVGProps } from "react";
import {
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
  WhatsAppIcon,
} from "@/components/ui/SocialIcons";
import { getSiteWhatsAppUrl } from "@/lib/whatsapp";

export type SocialLink = {
  label: string;
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

/**
 * Redes oficiales del sitio (Inicio, navbar móvil, footer).
 * Solo: Facebook, Instagram, WhatsApp y TikTok.
 */
export const SOCIAL_LINKS: SocialLink[] = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/total.living.mx/",
    icon: FacebookIcon,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/total.living.mx/",
    icon: InstagramIcon,
  },
  {
    label: "WhatsApp",
    href: getSiteWhatsAppUrl("Hola, me interesa conocer más sobre Total Living."),
    icon: WhatsAppIcon,
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@total.living.mx",
    icon: TikTokIcon,
  },
];
