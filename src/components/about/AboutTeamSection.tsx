"use client";

import { AboutOrgChart } from "@/components/about/AboutOrgChart";
import { AboutSectionHeading } from "@/components/about/AboutSectionHeading";
import { ProfileCard } from "@/components/ui/ProfileCard";
import {
  ABOUT_SECTION_SCROLL_MT,
  ABOUT_SECTION_PY,
} from "@/lib/about-layout";
import { teamMemberToProfileProps } from "@/lib/team-profile";
import { useLiteMotion } from "@/hooks/use-lite-motion";
import type { OrgChartNode, TeamMember } from "@/types/company";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const revealEase = [0.22, 1, 0.36, 1] as const;

interface AboutTeamSectionProps {
  team: TeamMember[];
  orgChart: OrgChartNode;
  teamEyebrow?: string;
  teamTitle?: string;
  orgEyebrow?: string;
  orgTitle?: string;
}

export function AboutTeamSection({
  team,
  orgChart,
  teamEyebrow = "Equipo Total Living",
  teamTitle = "El equipo detrás de cada decisión",
  orgEyebrow = "Organigrama",
  orgTitle = "Estructura organizacional",
}: AboutTeamSectionProps) {
  const liteMotion = useLiteMotion();
  const viewport = { once: true as const, amount: liteMotion ? 0.2 : 0.35 };

  const SectionWrap = liteMotion ? "div" : motion.div;
  const sectionMotion = liteMotion
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport,
        transition: { duration: 0.75, ease: revealEase },
      };

  // --- Organigrama Partitioning Logic ---
  // Level 1: CEO (Alfredo Mendiola)
  const level1 = team.filter(
    (m) =>
      m.id === "director-general" ||
      m.name.toLowerCase().includes("alfredo")
  );

  // Level 2: CFO/Marketing Heads (Patricia Chavarría y Andrea Torre únicamente)
  const level2 = team.filter(
    (m) =>
      !level1.includes(m) &&
      (m.id === "directora-ejecutiva" ||
        m.id === "andrea-torre" ||
        m.name.toLowerCase().includes("patricia") ||
        m.name.toLowerCase().includes("andrea torre"))
  );

  // Level 3: Advisors (Miguel Moreno, Luis Carlos, Laura Nates, Asesores Total Living, etc.)
  const level3 = team.filter(
    (m) => !level1.includes(m) && !level2.includes(m)
  );

  // Helper to render a card element cleanly
  const renderMemberCard = (member: TeamMember, globalIndex: number) => {
    const profile = teamMemberToProfileProps(member, globalIndex);

    const cardElement = (
      <ProfileCard
        className="pc-card-wrapper--team"
        {...profile}
        showUserInfo
        enableTilt={false}
        enableMobileTilt={false}
        behindGlowEnabled={false}
      />
    );

    if (liteMotion) {
      return (
        <div key={member.id} className="w-full max-w-[320px] sm:max-w-[330px]">
          {cardElement}
        </div>
      );
    }

    return (
      <motion.div
        key={member.id}
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{
          duration: 0.7,
          ease: revealEase,
          delay: globalIndex * 0.05,
        }}
        className="w-full max-w-[320px] sm:max-w-[330px]"
      >
        {cardElement}
      </motion.div>
    );
  };

  return (
    <section
      id="equipo"
      className={`${ABOUT_SECTION_SCROLL_MT} ${ABOUT_SECTION_PY} border-b border-transparent`}
    >
      {/* We expand the page container to max-w-7xl for more breathing room */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionWrap {...sectionMotion}>
          <AboutSectionHeading
            eyebrow={teamEyebrow}
            title={teamTitle}
            align="center"
          />
        </SectionWrap>

        <div className="mt-12 sm:mt-20 space-y-16 sm:space-y-24">
          {/* Nivel 1: Dirección General (CEO) */}
          {level1.length > 0 && (
            <div className="flex flex-col items-center">
              <div className="grid grid-cols-1 justify-items-center w-full">
                {level1.map((member, idx) => renderMemberCard(member, idx))}
              </div>
            </div>
          )}

          {/* Nivel 2: Directivos y Jefaturas (Patricia y Andrea lado a lado) */}
          {level2.length > 0 && (
            <div className="flex flex-col items-center">
              <div className="mb-6 h-px w-20 bg-tl-gold/25 sm:mb-8" />
              <p className="mb-6 font-outfit text-[10px] font-normal uppercase tracking-[0.2em] text-tl-gold/75 sm:mb-8 sm:text-xs">
                Directivos y Jefaturas
              </p>
              <div className="grid grid-cols-1 justify-items-center gap-10 sm:grid-cols-2 lg:gap-x-14 w-full max-w-3xl mx-auto">
                {level2.map((member, idx) =>
                  renderMemberCard(member, level1.length + idx)
                )}
              </div>
            </div>
          )}

          {/* Nivel 3: Asesores Inmobiliarios (3 en 3) */}
          {level3.length > 0 && (
            <div className="flex flex-col items-center">
              <div className="mb-6 h-px w-20 bg-tl-gold/25 sm:mb-8" />
              <p className="mb-6 font-outfit text-[10px] font-normal uppercase tracking-[0.2em] text-tl-gold/75 sm:mb-8 sm:text-xs">
                Asesores & Equipo Comercial
              </p>
              <div className="w-full">
                <div className="grid grid-cols-1 justify-items-center gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-10 lg:gap-y-14 w-full">
                  {level3.map((member, idx) =>
                    renderMemberCard(member, level1.length + level2.length + idx)
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
