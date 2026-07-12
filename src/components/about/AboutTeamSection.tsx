"use client";

import { AboutOrgChart } from "@/components/about/AboutOrgChart";
import { AboutSectionHeading } from "@/components/about/AboutSectionHeading";
import { ProfileCard } from "@/components/ui/ProfileCard";
import {
  ABOUT_CONTAINER,
  ABOUT_SECTION_SCROLL_MT,
  ABOUT_SECTION_PY,
} from "@/lib/about-layout";
import { teamMemberToProfileProps } from "@/lib/team-profile";
import { useLiteMotion } from "@/hooks/use-lite-motion";
import type { OrgChartNode, TeamMember } from "@/types/company";
import { motion } from "framer-motion";

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

  return (
    <section
      id="equipo"
      className={`${ABOUT_SECTION_SCROLL_MT} ${ABOUT_SECTION_PY} border-b border-transparent`}
    >
      <div className={ABOUT_CONTAINER}>
        <SectionWrap {...sectionMotion}>
          <AboutSectionHeading
            eyebrow={teamEyebrow}
            title={teamTitle}
            align="center"
          />
        </SectionWrap>

        {liteMotion ? (
          <div className="mt-10 sm:mt-14">
            <div className="grid grid-cols-1 justify-items-center gap-10 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-12 lg:grid-cols-3 lg:gap-x-10 lg:gap-y-14">
              {team.map((member, index) => {
                const profile = teamMemberToProfileProps(member, index);
                return (
                  <div key={member.id} className="w-full max-w-[300px]">
                    <ProfileCard
                      className="pc-card-wrapper--team"
                      {...profile}
                      showUserInfo
                      enableTilt={false}
                      enableMobileTilt={false}
                      behindGlowEnabled={false}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.85, ease: revealEase, delay: 0.08 }}
          className="mt-10 sm:mt-14"
        >
          <div className="grid grid-cols-1 justify-items-center gap-10 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-12 lg:grid-cols-3 lg:gap-x-10 lg:gap-y-14">
            {team.map((member, index) => {
              const profile = teamMemberToProfileProps(member, index);

              return (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{
                    duration: 0.7,
                    ease: revealEase,
                    delay: index * 0.06,
                  }}
                  className="w-full max-w-[300px]"
                >
                  <ProfileCard
                    className="pc-card-wrapper--team"
                    {...profile}
                    showUserInfo
                    enableTilt={false}
                    enableMobileTilt={false}
                    behindGlowEnabled={false}
                  />
                </motion.div>
              );
            })}
          </div>
        </motion.div>
        )}

        {liteMotion ? (
          <div className="mt-12 sm:mt-16">
            <div className="mb-6 max-w-2xl sm:mb-8">
              <p className="font-outfit text-[10px] font-light uppercase tracking-[0.24em] text-tl-gold">
                {orgEyebrow}
              </p>
              <h3 className="mt-2 font-outfit text-2xl font-extralight text-tl-beige sm:text-4xl">
                {orgTitle}
              </h3>
              <p className="mt-3 font-outfit text-sm font-light leading-relaxed text-tl-beige/70">
                Vista general de la dirección y áreas clave. Los roles y nombres
                se pueden actualizar conforme crezca el equipo.
              </p>
            </div>
            <AboutOrgChart root={orgChart} />
          </div>
        ) : (
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.8, ease: revealEase, delay: 0.05 }}
          className="mt-12 sm:mt-16"
        >
          <div className="mb-6 max-w-2xl sm:mb-8">
            <p className="font-outfit text-[10px] font-light uppercase tracking-[0.24em] text-tl-gold">
              {orgEyebrow}
            </p>
            <h3 className="mt-2 font-outfit text-2xl font-extralight text-tl-beige sm:text-4xl">
              {orgTitle}
            </h3>
            <p className="mt-3 font-outfit text-sm font-light leading-relaxed text-tl-beige/70">
              Vista general de la dirección y áreas clave. Los roles y nombres
              se pueden actualizar conforme crezca el equipo.
            </p>
          </div>

          <AboutOrgChart root={orgChart} />
        </motion.div>
        )}
      </div>
    </section>
  );
}
