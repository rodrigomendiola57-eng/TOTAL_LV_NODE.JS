import { resolveMediaUrl } from "@/lib/media-url";
import type { AboutPageContent, TeamMemberApiModel } from "@/types/about-page";
import type {
  CompanyProfile,
  MissionVision,
  OrgChartNode,
  TeamMember,
} from "@/types/company";
import { COMPANY_PROFILE } from "@/lib/data/company";

export interface AboutPublicContent {
  philosophy: CompanyProfile["philosophy"];
  values: CompanyProfile["values"];
  missionVision: MissionVision;
  missionImage: string;
  visionImage: string;
  team: TeamMember[];
  orgChart: OrgChartNode;
  sectionNav: CompanyProfile["sectionNav"];
  teamEyebrow: string;
  teamTitle: string;
  orgEyebrow: string;
  orgTitle: string;
  cta: {
    eyebrow: string;
    title: string;
    body: string;
    primaryLabel: string;
    primaryUrl: string;
    secondaryLabel: string;
    secondaryUrl: string;
  };
}

const FALLBACK_MISSION_IMAGE =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1400&auto=format&fit=crop";
const FALLBACK_VISION_IMAGE =
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1400&auto=format&fit=crop";

export function mapTeamMemberApi(row: TeamMemberApiModel): TeamMember {
  const photo =
    resolveMediaUrl(row.photo_url) ||
    row.photo_external_url ||
    row.photo_url ||
    undefined;

  return {
    id: row.slug,
    name: row.name,
    role: row.role,
    department: row.department,
    bio: row.bio,
    photo: photo || undefined,
    socials: Array.isArray(row.socials) ? row.socials : [],
  };
}

export function mapAboutPageToPublic(
  page: AboutPageContent,
  teamRows: TeamMemberApiModel[],
): AboutPublicContent {
  const missionImage =
    resolveMediaUrl(page.mission_image_url) ||
    page.mission_image_external_url ||
    FALLBACK_MISSION_IMAGE;
  const visionImage =
    resolveMediaUrl(page.vision_image_url) ||
    page.vision_image_external_url ||
    FALLBACK_VISION_IMAGE;

  return {
    philosophy: {
      title: page.philosophy_title,
      subtitle: page.philosophy_subtitle,
      introLines: page.philosophy_intro_lines ?? [],
      methodClosing: page.philosophy_method_closing,
      pillars: page.philosophy_pillars ?? [],
    },
    values: (page.values ?? []) as CompanyProfile["values"],
    missionVision: {
      mission: {
        title: page.mission_title,
        statement: page.mission_statement,
      },
      vision: {
        title: page.vision_title,
        statement: page.vision_statement,
      },
    },
    missionImage,
    visionImage,
    team: teamRows.map(mapTeamMemberApi),
    orgChart: (page.org_chart as OrgChartNode) || COMPANY_PROFILE.orgChart,
    sectionNav: page.section_nav?.length
      ? page.section_nav
      : COMPANY_PROFILE.sectionNav,
    teamEyebrow: page.team_eyebrow || "Equipo Total Living",
    teamTitle: page.team_title || "El equipo detrás de cada decisión",
    orgEyebrow: page.org_eyebrow || "Organigrama",
    orgTitle: page.org_title || "Estructura organizacional",
    cta: {
      eyebrow: page.cta_eyebrow,
      title: page.cta_title,
      body: page.cta_body,
      primaryLabel: page.cta_primary_label,
      primaryUrl: page.cta_primary_url,
      secondaryLabel: page.cta_secondary_label,
      secondaryUrl: page.cta_secondary_url,
    },
  };
}

export function getAboutPublicFallback(): AboutPublicContent {
  return {
    philosophy: COMPANY_PROFILE.philosophy,
    values: COMPANY_PROFILE.values,
    missionVision: COMPANY_PROFILE.missionVision,
    missionImage: FALLBACK_MISSION_IMAGE,
    visionImage: FALLBACK_VISION_IMAGE,
    team: COMPANY_PROFILE.team,
    orgChart: COMPANY_PROFILE.orgChart,
    sectionNav: COMPANY_PROFILE.sectionNav,
    teamEyebrow: "Equipo Total Living",
    teamTitle: "El equipo detrás de cada decisión",
    orgEyebrow: "Organigrama",
    orgTitle: "Estructura organizacional",
    cta: {
      eyebrow: "¿Listo para empezar?",
      title: "Hablemos de tu próxima inversión",
      body: "Un asesor Total Living puede orientarte con el mismo enfoque estratégico que guía a nuestro equipo interno.",
      primaryLabel: "Contactar",
      primaryUrl: "/contacto",
      secondaryLabel: "Ver propiedades",
      secondaryUrl: "/propiedades/venta",
    },
  };
}
