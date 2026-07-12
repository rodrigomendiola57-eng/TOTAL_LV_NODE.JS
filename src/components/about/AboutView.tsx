import { AboutHero } from "@/components/about/AboutHero";
import { AboutMissionVisionSection } from "@/components/about/AboutMissionVisionSection";
import { AboutPhilosophySection } from "@/components/about/AboutPhilosophySection";
import { AboutSectionNav } from "@/components/about/AboutSectionNav";
import { AboutSilkBackdrop } from "@/components/about/AboutSilkBackdrop";
import { AboutTeamSection } from "@/components/about/AboutTeamSection";
import { AboutValuesSection } from "@/components/about/AboutValuesSection";
import { Reveal } from "@/components/ui/Reveal";
import { ABOUT_CONTAINER } from "@/lib/about-layout";
import type { AboutPublicContent } from "@/lib/about-public";
import Link from "next/link";

interface AboutViewProps {
  content: AboutPublicContent;
}

export function AboutView({ content }: AboutViewProps) {
  const {
    philosophy,
    values,
    missionVision,
    missionImage,
    visionImage,
    team,
    orgChart,
    sectionNav,
    teamEyebrow,
    teamTitle,
    orgEyebrow,
    orgTitle,
    cta,
  } = content;

  return (
    <main className="relative flex flex-1 flex-col bg-[#1a1a18]">
      <AboutSilkBackdrop />

      <div className="relative z-10 flex flex-1 flex-col">
        <AboutHero />
        <AboutSectionNav sections={sectionNav} />
        <AboutPhilosophySection philosophy={philosophy} />
        <AboutValuesSection values={values} />
        <AboutMissionVisionSection
          missionVision={missionVision}
          missionImage={missionImage}
          visionImage={visionImage}
        />
        <AboutTeamSection
          team={team}
          orgChart={orgChart}
          teamEyebrow={teamEyebrow}
          teamTitle={teamTitle}
          orgEyebrow={orgEyebrow}
          orgTitle={orgTitle}
        />

        <section className="pb-[max(3.5rem,env(safe-area-inset-bottom,0px))] pt-4 sm:pb-16 sm:pt-6">
          <div className={ABOUT_CONTAINER}>
            <Reveal>
              <div className="rounded-2xl border border-tl-gold/25 bg-black/30 p-5 backdrop-blur-sm sm:rounded-3xl sm:p-10">
                <p className="font-outfit text-[10px] font-light uppercase tracking-[0.18em] text-tl-gold sm:text-xs sm:tracking-[0.24em]">
                  {cta.eyebrow}
                </p>
                <h2 className="mt-3 font-outfit text-[clamp(1.65rem,5.5vw,2.75rem)] font-extralight leading-tight text-tl-beige">
                  {cta.title}
                </h2>
                <p className="mt-4 max-w-2xl font-outfit text-sm font-light leading-relaxed text-tl-beige/80">
                  {cta.body}
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:mt-7 sm:flex-row sm:flex-wrap">
                  <Link
                    href={cta.primaryUrl || "/contacto"}
                    className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-tl-gold px-6 py-3 font-outfit font-light text-[11px] uppercase tracking-[0.14em] text-tl-gold transition-colors active:bg-tl-gold active:text-tl-black sm:w-auto sm:text-xs sm:tracking-[0.16em] sm:hover:bg-tl-gold sm:hover:text-tl-black"
                  >
                    {cta.primaryLabel || "Contactar"}
                  </Link>
                  <Link
                    href={cta.secondaryUrl || "/propiedades/venta"}
                    className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-white/15 px-6 py-3 font-outfit font-light text-[11px] uppercase tracking-[0.14em] text-tl-beige/80 transition-colors active:border-tl-gold/40 active:text-tl-gold sm:w-auto sm:text-xs sm:tracking-[0.16em] sm:hover:border-tl-gold/40 sm:hover:text-tl-gold"
                  >
                    {cta.secondaryLabel || "Ver propiedades"}
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </div>
    </main>
  );
}
