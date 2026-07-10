import type { ChromaGridItem } from "@/components/ui/ChromaGrid";
import type { TeamMember } from "@/types/company";

const TL_GRADIENTS = [
  "linear-gradient(155deg, #5A5E48 0%, #2a2a24 48%, #0a0a08 100%)",
  "linear-gradient(165deg, #4A4E38 0%, #38382E 42%, #0c0c0a 100%)",
  "linear-gradient(145deg, #6b5f45 0%, #38382E 50%, #0a0a08 100%)",
  "linear-gradient(180deg, #4A4E38 0%, #1f1f1a 55%, #080807 100%)",
  "linear-gradient(200deg, #5A5E48 0%, #2e2e28 45%, #0a0a08 100%)",
  "linear-gradient(135deg, #D6B585 0%, #4A4E38 38%, #0a0a08 100%)",
] as const;

const TL_BORDERS = [
  "#D6B585",
  "#C4A574",
  "#B8956A",
  "#A68B5B",
  "#8F7A52",
  "#D6B585",
] as const;

const DEFAULT_PHOTOS = [
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=600&auto=format&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1519081908943-47d27b1acf64?q=80&w=600&auto=format&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=600&auto=format&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop&crop=faces",
] as const;

export function teamMembersToChromaItems(members: TeamMember[]): ChromaGridItem[] {
  return members.map((member, index) => ({
    image: member.photo ?? DEFAULT_PHOTOS[index % DEFAULT_PHOTOS.length],
    title: member.name,
    subtitle: member.role,
    handle: member.department,
    location: member.bio,
    borderColor: TL_BORDERS[index % TL_BORDERS.length],
    gradient: TL_GRADIENTS[index % TL_GRADIENTS.length],
    url: member.linkedIn,
  }));
}
