"use client";

import { HeroPropertySearch } from "@/components/layout/HeroPropertySearch";
import { Reveal } from "@/components/ui/Reveal";
import {
  playBackgroundVideo,
  prepareBackgroundVideo,
} from "@/lib/background-video";
import { ASESORIA_HERO_IMAGE, HOME_HERO_VIDEO } from "@/lib/hero-media";
import { HERO_CONTENT_OFFSET } from "@/lib/site-nav";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

interface HeroSectionProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  backgroundUrl?: string | null;
  videoUrl?: string | null;
}

function HomeHeroVideo({
  posterUrl,
  primaryVideoUrl,
}: {
  posterUrl: string;
  primaryVideoUrl: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activeSrc, setActiveSrc] = useState(primaryVideoUrl);
  const [showVideo, setShowVideo] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isInView, setIsInView] = useState(true);
  const [allowMotion, setAllowMotion] = useState(true);

  useEffect(() => {
    setActiveSrc(primaryVideoUrl);
    setShowVideo(true);
    setIsPlaying(false);
  }, [primaryVideoUrl]);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => setAllowMotion(!motionQuery.matches);
    syncMotion();
    motionQuery.addEventListener("change", syncMotion);
    return () => motionQuery.removeEventListener("change", syncMotion);
  }, []);

  useEffect(() => {
    const node = containerRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting && entry.intersectionRatio > 0.12);
      },
      { threshold: [0, 0.12, 0.35], rootMargin: "8% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const tryPlay = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    if (!allowMotion || document.hidden || !isInView) {
      video.pause();
      setIsPlaying(false);
      return;
    }

    const playing = await playBackgroundVideo(video);
    setIsPlaying(playing);
    if (!playing && video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
      setShowVideo(false);
    }
  }, [allowMotion, isInView]);

  useEffect(() => {
    void tryPlay();
  }, [isInView, tryPlay, activeSrc, allowMotion]);

  useEffect(() => {
    const onVisibility = () => {
      void tryPlay();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [tryPlay]);

  function handleError() {
    if (activeSrc !== HOME_HERO_VIDEO) {
      setActiveSrc(HOME_HERO_VIDEO);
      return;
    }
    setShowVideo(false);
    setIsPlaying(false);
  }

  const bindVideo = useCallback((node: HTMLVideoElement | null) => {
    videoRef.current = node;
    if (node) prepareBackgroundVideo(node);
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 min-h-full w-full">
      <Image
        src={posterUrl}
        alt=""
        aria-hidden
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />

      {showVideo && allowMotion ? (
        <video
          key={activeSrc}
          ref={bindVideo}
          src={activeSrc}
          autoPlay
          muted
          loop
          playsInline
          controls={false}
          disablePictureInPicture
          disableRemotePlayback
          preload="metadata"
          aria-hidden
          onLoadedData={() => void tryPlay()}
          onCanPlay={() => void tryPlay()}
          onPlaying={() => setIsPlaying(true)}
          onError={handleError}
          className={cn(
            "tl-background-video pointer-events-none absolute inset-0 z-[1] h-full w-full object-cover object-center transition-opacity duration-500",
            isPlaying ? "opacity-100" : "opacity-0",
          )}
        />
      ) : null}
    </div>
  );
}

export function HeroSection({
  eyebrow = "Real Estate Premium",
  title = "Total Living",
  subtitle = "Estrategia Real detrás de cada Propiedad",
  backgroundUrl,
  videoUrl,
}: HeroSectionProps) {
  const poster = backgroundUrl ?? ASESORIA_HERO_IMAGE;
  const video = videoUrl?.trim() || HOME_HERO_VIDEO;

  return (
    <section
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden lg:min-h-[100dvh]"
      data-tl-media-hero
    >
      <HomeHeroVideo posterUrl={poster} primaryVideoUrl={video} />
      <div className="absolute inset-0 z-[2] bg-gradient-to-b from-black/55 via-black/45 to-black/92" />

      <Reveal
        className={`relative z-10 mx-auto w-full max-w-6xl px-5 pb-10 text-center sm:px-6 sm:pb-14 ${HERO_CONTENT_OFFSET}`}
      >
        <p className="font-outfit text-[10px] font-light uppercase tracking-[0.22em] text-tl-gold/90 sm:text-xs sm:tracking-[0.28em]">
          {eyebrow}
        </p>
        <h1 className="text-fluid-h1 mx-auto mt-5 max-w-[12ch] text-balance font-outfit font-extralight tracking-[0.02em] text-tl-beige sm:mt-6 sm:max-w-none">
          {title}
        </h1>
        <p className="mx-auto mt-4 max-w-[22rem] font-outfit text-[10px] font-light uppercase leading-relaxed tracking-[0.14em] text-tl-beige/75 sm:mt-6 sm:max-w-2xl sm:text-base sm:tracking-[0.22em]">
          {subtitle}
        </p>

        <HeroPropertySearch />
      </Reveal>
    </section>
  );
}
