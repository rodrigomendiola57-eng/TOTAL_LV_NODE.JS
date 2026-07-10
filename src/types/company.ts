export interface CompanyValue {
  id: string;
  title: string;
  description: string;
  icon: "heart" | "shield" | "users" | "globe" | "sparkles";
}

export interface MissionVision {
  mission: {
    title: string;
    statement: string;
  };
  vision: {
    title: string;
    statement: string;
  };
}

export interface TeamSocialLink {
  platform: "linkedin" | "instagram" | "facebook" | "whatsapp" | "email";
  url: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  bio: string;
  photo?: string;
  linkedIn?: string;
  socials?: TeamSocialLink[];
}

export interface OrgChartNode {
  id: string;
  name: string;
  role: string;
  department?: string;
  children?: OrgChartNode[];
}

export interface AboutSectionLink {
  id: string;
  label: string;
}

export interface PhilosophyPillar {
  id: string;
  letter: string;
  title: string;
  description: string;
}

export interface CompanyProfile {
  hero: {
    eyebrow: string;
    titleLines: string[];
    description: string;
    methodTag: string;
    stats: Array<{ value: string; label: string }>;
  };
  philosophy: {
    title: string;
    subtitle: string;
    introLines: string[];
    methodClosing: string;
    pillars: PhilosophyPillar[];
  };
  values: CompanyValue[];
  missionVision: MissionVision;
  team: TeamMember[];
  orgChart: OrgChartNode;
  sectionNav: AboutSectionLink[];
}
