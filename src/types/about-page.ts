import type { OrgChartNode, TeamSocialLink } from "@/types/company";

export interface AboutPageContent {
  id: number;
  philosophy_title: string;
  philosophy_subtitle: string;
  philosophy_intro_lines: string[];
  philosophy_method_closing: string;
  philosophy_pillars: Array<{
    id: string;
    letter: string;
    title: string;
    description: string;
  }>;
  values: Array<{
    id: string;
    title: string;
    description: string;
    icon: "heart" | "shield" | "users" | "globe" | "sparkles";
  }>;
  mission_title: string;
  mission_statement: string;
  vision_title: string;
  vision_statement: string;
  mission_image_url: string;
  mission_image_external_url: string;
  vision_image_url: string;
  vision_image_external_url: string;
  team_eyebrow: string;
  team_title: string;
  org_eyebrow: string;
  org_title: string;
  org_chart: OrgChartNode;
  cta_eyebrow: string;
  cta_title: string;
  cta_body: string;
  cta_primary_label: string;
  cta_primary_url: string;
  cta_secondary_label: string;
  cta_secondary_url: string;
  section_nav: Array<{ id: string; label: string }>;
  content_en?: Record<string, unknown>;
  is_published: boolean;
  updated_at?: string;
}

export type AboutPageUpdatePayload = Partial<
  Omit<
    AboutPageContent,
    "id" | "mission_image_url" | "vision_image_url" | "updated_at"
  >
>;

export interface TeamMemberApiModel {
  id: number;
  slug: string;
  name: string;
  role: string;
  department: string;
  bio: string;
  photo_url: string;
  photo_external_url?: string;
  socials: TeamSocialLink[];
  content_en?: Record<string, any>;
  is_published: boolean;
  order: number;
  updated_at?: string;
}

export type TeamMemberWritePayload = {
  slug?: string;
  name: string;
  role: string;
  department?: string;
  bio?: string;
  photo_external_url?: string;
  socials?: TeamSocialLink[];
  content_en?: Record<string, any>;
  is_published?: boolean;
  order?: number;
};
