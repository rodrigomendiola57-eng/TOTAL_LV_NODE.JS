import type { ComponentType, SVGProps } from "react";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  WhatsAppIcon,
  YoutubeIcon,
} from "@/components/ui/SocialIcons";

export type SocialLink = {
  label: string;
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

/** Reemplazar href cuando estén las URLs oficiales de la marca. */
export const SOCIAL_LINKS: SocialLink[] = [
  { label: "Instagram", href: "#", icon: InstagramIcon },
  { label: "Facebook", href: "#", icon: FacebookIcon },
  { label: "LinkedIn", href: "#", icon: LinkedinIcon },
  { label: "YouTube", href: "#", icon: YoutubeIcon },
  { label: "WhatsApp", href: "#", icon: WhatsAppIcon },
];
