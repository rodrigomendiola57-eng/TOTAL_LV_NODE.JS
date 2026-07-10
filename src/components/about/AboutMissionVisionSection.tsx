"use client";

import { AboutSectionHeading } from "@/components/about/AboutSectionHeading";
import {
  ABOUT_CONTAINER,
  ABOUT_SECTION_SHELL,
} from "@/lib/about-layout";
import { useLiteMotion } from "@/hooks/use-lite-motion";
import { cn } from "@/lib/utils";
import type { MissionVision } from "@/types/company";
import {
  motion,
  useInView,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import Image from "next/image";
import { useRef, type RefObject } from "react";

const revealEase = [0.22, 1, 0.36, 1] as const;

const MISSION_IMAGE =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1400&auto=format&fit=crop";
const VISION_IMAGE =
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1400&auto=format&fit=crop";

interface AboutMissionVisionSectionProps {
  missionVision: MissionVision;
}

const IMMERSIVE_HEIGHT_CLASS =
  "min-h-[min(82svh,40rem)] sm:min-h-[min(84svh,42rem)] lg:min-h-0 lg:h-[88svh]";

interface StatementLinesProps {
  text: string;
  baseDelay?: number;
  liteMotion: boolean;
}

function StatementLines({ text, baseDelay = 0, liteMotion }: StatementLinesProps) {
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div className="space-y-3 sm:space-y-4">
      {sentences.map((sentence, index) =>
        liteMotion ? (
          <p
            key={`${index}-${sentence.slice(0, 12)}`}
            className="font-outfit text-lg font-light leading-[1.78] tracking-[0.02em] text-tl-beige/88 sm:text-xl sm:leading-[1.82] lg:text-2xl lg:leading-[1.85]"
          >
            {sentence}
          </p>
        ) : (
          <motion.p
            key={`${index}-${sentence.slice(0, 12)}`}
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.45 }}
            transition={{
              duration: 0.85,
              ease: revealEase,
              delay: baseDelay + index * 0.12,
            }}
            className="font-outfit text-lg font-light leading-[1.78] tracking-[0.02em] text-tl-beige/88 sm:text-xl sm:leading-[1.82] lg:text-2xl lg:leading-[1.85]"
          >
            {sentence}
          </motion.p>
        ),
      )}
    </div>
  );
}

interface ImmersiveHalfProps {
  kind: "mission" | "vision";
  title: string;
  statement: string;
  image: string;
  imageAlt: string;
  scrollProgress: MotionValue<number>;
  liteMotion: boolean;
}

function ImmersiveHalfLite({
  kind,
  title,
  statement,
  image,
  imageAlt,
}: Omit<ImmersiveHalfProps, "scrollProgress" | "liteMotion">) {
  const isMission = kind === "mission";

  return (
    <article
      className={cn(
        "relative flex flex-1 flex-col justify-end overflow-hidden",
        IMMERSIVE_HEIGHT_CLASS,
        "lg:rounded-none",
      )}
    >
      <div className="absolute inset-0">
        <Image
          src={image}
          alt={imageAlt}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
        <div
          className={cn(
            "absolute inset-0",
            isMission
              ? "bg-gradient-to-t from-[#0a0a08] via-[#121210]/88 to-[#1a1a16]/55 lg:bg-gradient-to-r lg:from-[#0a0a08] lg:via-[#121210]/82 lg:to-[#121210]/35"
              : "bg-gradient-to-t from-[#0a0a08] via-[#121210]/88 to-[#1a1a16]/55 lg:bg-gradient-to-l lg:from-[#0a0a08] lg:via-[#121210]/82 lg:to-[#121210]/35",
          )}
        />
        <div className="absolute inset-0 bg-tl-olive/20 mix-blend-multiply" />
      </div>

      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute select-none font-outfit font-extralight uppercase leading-[0.88] tracking-[-0.03em]",
          isMission
            ? "right-2 top-6 text-[clamp(3.25rem,15vw,8.5rem)] sm:top-8 lg:left-6 lg:right-auto"
            : "left-2 top-6 text-[clamp(3.25rem,15vw,8.5rem)] sm:top-8 lg:right-6 lg:left-auto",
        )}
      >
        <span className="text-tl-gold/55 drop-shadow-[0_0_40px_rgba(214,181,133,0.25)]">
          {isMission ? "M" : "V"}
        </span>
        <span className="text-tl-beige/18">ISIÓN</span>
      </div>

      <div className="relative z-[1] px-6 pb-12 pt-28 sm:px-10 sm:pb-14 lg:px-12 lg:pb-16 xl:px-16">
        <h3 className="font-outfit text-[clamp(2.25rem,8vw,4.5rem)] font-extralight leading-[1.02] tracking-[0.01em] text-tl-beige">
          {title}
        </h3>

        <div
          className={cn(
            "mt-5 h-px w-16 bg-gradient-to-r from-tl-gold to-tl-gold/20 sm:mt-6 sm:w-24",
            !isMission && "lg:ml-auto",
          )}
        />

        <div className="mt-6 max-w-xl sm:mt-8 lg:max-w-lg xl:max-w-xl">
          <StatementLines text={statement} baseDelay={0.08} liteMotion />
        </div>
      </div>
    </article>
  );
}

function ImmersiveHalfRich({
  kind,
  title,
  statement,
  image,
  imageAlt,
  scrollProgress,
}: Omit<ImmersiveHalfProps, "liteMotion">) {
  const ref = useRef<HTMLElement>(null);
  const isMission = kind === "mission";

  const localScroll = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(localScroll.scrollYProgress, [0, 1], ["-12%", "12%"]);
  const imageScale = useTransform(localScroll.scrollYProgress, [0, 0.5, 1], [1.08, 1, 1.08]);
  const contentY = useTransform(scrollProgress, [0, 0.5, 1], [40, 0, -30]);
  const contentOpacity = useTransform(
    localScroll.scrollYProgress,
    [0, 0.25, 0.75, 1],
    [0.4, 1, 1, 0.45],
  );
  const watermarkY = useTransform(localScroll.scrollYProgress, [0, 1], [20, -20]);

  return (
    <article
      ref={ref}
      className={cn(
        "relative flex flex-1 flex-col justify-end overflow-hidden",
        IMMERSIVE_HEIGHT_CLASS,
        "lg:rounded-none",
      )}
    >
      <motion.div
        className="absolute inset-0 will-change-transform"
        style={{ y: imageY, scale: imageScale }}
      >
        <Image
          src={image}
          alt={imageAlt}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
        <div
          className={cn(
            "absolute inset-0",
            isMission
              ? "bg-gradient-to-t from-[#0a0a08] via-[#121210]/88 to-[#1a1a16]/55 lg:bg-gradient-to-r lg:from-[#0a0a08] lg:via-[#121210]/82 lg:to-[#121210]/35"
              : "bg-gradient-to-t from-[#0a0a08] via-[#121210]/88 to-[#1a1a16]/55 lg:bg-gradient-to-l lg:from-[#0a0a08] lg:via-[#121210]/82 lg:to-[#121210]/35",
          )}
        />
        <div className="absolute inset-0 bg-tl-olive/20 mix-blend-multiply" />
      </motion.div>

      <motion.div
        aria-hidden
        className={cn(
          "pointer-events-none absolute select-none font-outfit font-extralight uppercase leading-[0.88] tracking-[-0.03em]",
          isMission
            ? "right-2 top-6 text-[clamp(3.25rem,15vw,8.5rem)] sm:top-8 lg:left-6 lg:right-auto"
            : "left-2 top-6 text-[clamp(3.25rem,15vw,8.5rem)] sm:top-8 lg:right-6 lg:left-auto",
        )}
        style={{ y: watermarkY }}
      >
        <span className="text-tl-gold/55 drop-shadow-[0_0_40px_rgba(214,181,133,0.25)]">
          {isMission ? "M" : "V"}
        </span>
        <span className="text-tl-beige/18">ISIÓN</span>
      </motion.div>

      <motion.div
        className="relative z-[1] px-6 pb-12 pt-28 sm:px-10 sm:pb-14 lg:px-12 lg:pb-16 xl:px-16"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <motion.h3
          initial={{ opacity: 0, clipPath: "inset(0 100% 0 0)" }}
          whileInView={{ opacity: 1, clipPath: "inset(0 0% 0 0)" }}
          viewport={{ once: true, amount: 0.45 }}
          transition={{ duration: 1, ease: revealEase, delay: 0.08 }}
          className="font-outfit text-[clamp(2.25rem,8vw,4.5rem)] font-extralight leading-[1.02] tracking-[0.01em] text-tl-beige"
        >
          {title}
        </motion.h3>

        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.9, ease: revealEase, delay: 0.15 }}
          className={cn(
            "mt-5 h-px w-16 origin-left bg-gradient-to-r from-tl-gold to-tl-gold/20 sm:mt-6 sm:w-24",
            !isMission && "origin-right lg:ml-auto",
          )}
        />

        <div className="mt-6 max-w-xl sm:mt-8 lg:max-w-lg xl:max-w-xl">
          <StatementLines text={statement} baseDelay={0.2} liteMotion={false} />
        </div>
      </motion.div>
    </article>
  );
}

function ImmersiveHalf(props: ImmersiveHalfProps) {
  if (props.liteMotion) {
    return <ImmersiveHalfLite {...props} />;
  }

  return <ImmersiveHalfRich {...props} />;
}

function ScrollProgressBar({ progress }: { progress: MotionValue<number> }) {
  const scaleX = useSpring(progress, { stiffness: 120, damping: 28, restDelta: 0.001 });

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-[2px] bg-white/[0.06] lg:hidden">
      <motion.div
        className="h-full origin-left bg-gradient-to-r from-tl-gold/30 via-tl-gold to-tl-gold/30"
        style={{ scaleX }}
      />
    </div>
  );
}

function MissionVisionStageLite({
  missionVision,
}: {
  missionVision: MissionVision;
}) {
  return (
    <div className="relative flex flex-col lg:w-full lg:max-w-none lg:flex-row lg:px-0">
      <ImmersiveHalf
        kind="mission"
        title={missionVision.mission.title}
        statement={missionVision.mission.statement}
        image={MISSION_IMAGE}
        imageAlt="Interior residencial premium en Querétaro"
        scrollProgress={undefined as unknown as MotionValue<number>}
        liteMotion
      />
      <ImmersiveHalf
        kind="vision"
        title={missionVision.vision.title}
        statement={missionVision.vision.statement}
        image={VISION_IMAGE}
        imageAlt="Horizonte urbano y arquitectura contemporánea"
        scrollProgress={undefined as unknown as MotionValue<number>}
        liteMotion
      />
    </div>
  );
}

function MissionVisionStageRich({
  missionVision,
  stageRef,
}: {
  missionVision: MissionVision;
  stageRef: RefObject<HTMLDivElement | null>;
}) {
  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ["start end", "end start"],
  });

  return (
    <>
      <ScrollProgressBar progress={scrollYProgress} />
      <div className="relative flex flex-col lg:w-full lg:max-w-none lg:flex-row lg:px-0">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 z-[4] hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-tl-gold/50 to-transparent lg:block"
        />
        <CenterPulseDot stageRef={stageRef} />
        <ImmersiveHalf
          kind="mission"
          title={missionVision.mission.title}
          statement={missionVision.mission.statement}
          image={MISSION_IMAGE}
          imageAlt="Interior residencial premium en Querétaro"
          scrollProgress={scrollYProgress}
          liteMotion={false}
        />
        <ImmersiveHalf
          kind="vision"
          title={missionVision.vision.title}
          statement={missionVision.vision.statement}
          image={VISION_IMAGE}
          imageAlt="Horizonte urbano y arquitectura contemporánea"
          scrollProgress={scrollYProgress}
          liteMotion={false}
        />
      </div>
    </>
  );
}

function CenterPulseDot({
  stageRef,
}: {
  stageRef: RefObject<HTMLDivElement | null>;
}) {
  const inView = useInView(stageRef, { amount: 0.2 });

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-1/2 z-[4] hidden h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-tl-gold/60 bg-tl-gold/30 shadow-[0_0_24px_rgba(214,181,133,0.5)] lg:block"
      animate={
        inView
          ? { scale: [1, 1.25, 1], opacity: [0.7, 1, 0.7] }
          : { scale: 1, opacity: 0.55 }
      }
      transition={
        inView
          ? { duration: 2.8, repeat: Infinity, ease: "easeInOut" }
          : { duration: 0.25 }
      }
    />
  );
}

export function AboutMissionVisionSection({
  missionVision,
}: AboutMissionVisionSectionProps) {
  const liteMotion = useLiteMotion();
  const stageRef = useRef<HTMLDivElement>(null);

  return (
    <section
      id="mision-vision"
      className={cn(
        ABOUT_SECTION_SHELL,
        "relative overflow-x-clip lg:py-0",
      )}
    >
      {/* Encabezado solo en móvil/tablet; en desktop solo los dos paneles */}
      <div className={cn(ABOUT_CONTAINER, "lg:hidden")}>
        {liteMotion ? (
          <div className="mb-8 sm:mb-10">
            <AboutSectionHeading
              eyebrow="Propósito"
              title="Misión y visión"
              description="El norte estratégico que orienta nuestro portafolio, nuestro equipo y la experiencia que entregamos en cada operación."
              align="center"
            />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.8, ease: revealEase }}
            className="mb-8 sm:mb-10"
          >
            <AboutSectionHeading
              eyebrow="Propósito"
              title="Misión y visión"
              description="El norte estratégico que orienta nuestro portafolio, nuestro equipo y la experiencia que entregamos en cada operación."
              align="center"
            />
          </motion.div>
        )}
      </div>

      <div ref={stageRef} className="relative lg:w-screen lg:max-w-[100vw] lg:ml-[calc(50%-50vw)]">
        {liteMotion ? (
          <MissionVisionStageLite missionVision={missionVision} />
        ) : (
          <MissionVisionStageRich missionVision={missionVision} stageRef={stageRef} />
        )}

        {liteMotion ? (
          <div className="relative z-[2] mt-8 flex items-center justify-center gap-4 px-6 sm:mt-10 lg:hidden">
            <div className="h-px max-w-[8rem] flex-1 bg-gradient-to-r from-transparent to-tl-gold/40 sm:max-w-xs" />
            <p className="font-outfit text-[10px] font-light uppercase tracking-[0.32em] text-tl-beige/45 sm:text-[11px]">
              Querétaro · Estrategia real
            </p>
            <div className="h-px max-w-[8rem] flex-1 bg-gradient-to-l from-transparent to-tl-gold/40 sm:max-w-xs" />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease: revealEase, delay: 0.05 }}
            className="relative z-[2] mt-8 flex items-center justify-center gap-4 px-6 sm:mt-10 lg:hidden"
          >
            <div className="h-px max-w-[8rem] flex-1 bg-gradient-to-r from-transparent to-tl-gold/40 sm:max-w-xs" />
            <p className="font-outfit text-[10px] font-light uppercase tracking-[0.32em] text-tl-beige/45 sm:text-[11px]">
              Querétaro · Estrategia real
            </p>
            <div className="h-px max-w-[8rem] flex-1 bg-gradient-to-l from-transparent to-tl-gold/40 sm:max-w-xs" />
          </motion.div>
        )}
      </div>
    </section>
  );
}
