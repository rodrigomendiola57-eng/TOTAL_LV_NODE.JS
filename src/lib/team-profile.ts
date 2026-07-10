import type { ProfileCardProps } from "@/components/ui/ProfileCard";
import type { TeamMember } from "@/types/company";

const TL_GRADIENTS = [
  "linear-gradient(145deg, rgba(90, 94, 72, 0.72) 0%, rgba(214, 181, 133, 0.28) 100%)",
  "linear-gradient(165deg, rgba(74, 78, 56, 0.75) 0%, rgba(198, 165, 116, 0.25) 100%)",
  "linear-gradient(155deg, rgba(56, 56, 46, 0.8) 0%, rgba(214, 181, 133, 0.2) 100%)",
  "linear-gradient(180deg, rgba(74, 78, 56, 0.7) 0%, rgba(26, 26, 22, 0.9) 100%)",
  "linear-gradient(200deg, rgba(90, 94, 72, 0.65) 0%, rgba(214, 181, 133, 0.22) 100%)",
  "linear-gradient(135deg, rgba(214, 181, 133, 0.35) 0%, rgba(56, 56, 46, 0.85) 100%)",
] as const;

const TL_GLOWS = [
  "rgba(214, 181, 133, 0.58)",
  "rgba(196, 165, 116, 0.52)",
  "rgba(168, 139, 91, 0.5)",
  "rgba(214, 181, 133, 0.48)",
  "rgba(143, 122, 82, 0.5)",
  "rgba(214, 181, 133, 0.55)",
] as const;

const DEFAULT_PHOTOS = [
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=600&auto=format&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1519081908943-47d27b1acf64?q=80&w=600&auto=format&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=600&auto=format&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop&crop=faces",
] as const;

export function teamMemberToProfileProps(
  member: TeamMember,
  index: number,
): Pick<
  ProfileCardProps,
  | "avatarUrl"
  | "name"
  | "title"
  | "bio"
  | "socials"
  | "innerGradient"
  | "behindGlowColor"
> {
  return {
    avatarUrl: member.photo ?? DEFAULT_PHOTOS[index % DEFAULT_PHOTOS.length],
    name: member.name,
    title: member.role,
    bio: member.bio,
    socials: member.socials ?? [],
    innerGradient: TL_GRADIENTS[index % TL_GRADIENTS.length],
    behindGlowColor: TL_GLOWS[index % TL_GLOWS.length],
  };
}