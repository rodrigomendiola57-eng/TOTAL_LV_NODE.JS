"use client";

import { cn } from "@/lib/utils";
import { Volume2, VolumeX } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const DESKTOP_VIDEO_SRC = "https://totalliving-media-react-667051771961-us-east-1-an.s3.amazonaws.com/media/home/hero/video/hero-total-living.mp4";
const MOBILE_VIDEO_SRC = "https://totalliving-media-react-667051771961-us-east-1-an.s3.amazonaws.com/media/home/hero/video/hero-total-living-mobile.mp4";
const MOBILE_VIDEO_MQ = "(max-width: 1023px)";

function resolveHeroVideoSrc(): string {
  if (typeof window === "undefined") return DESKTOP_VIDEO_SRC;
  return window.matchMedia(MOBILE_VIDEO_MQ).matches
    ? MOBILE_VIDEO_SRC
    : DESKTOP_VIDEO_SRC;
}

export function AboutHeroVideo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [videoSrc, setVideoSrc] = useState(resolveHeroVideoSrc);
  const [isInView, setIsInView] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_VIDEO_MQ);

    const syncSource = () => {
      setVideoSrc(mediaQuery.matches ? MOBILE_VIDEO_SRC : DESKTOP_VIDEO_SRC);
    };

    syncSource();
    mediaQuery.addEventListener("change", syncSource);
    return () => mediaQuery.removeEventListener("change", syncSource);
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

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion || document.hidden || !isInView) {
      video.pause();
      return;
    }

    try {
      await video.play();
    } catch {
      /* autoplay bloqueado o aún cargando */
    }
  }, [isInView]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.load();
    void tryPlay();
  }, [videoSrc, tryPlay]);

  useEffect(() => {
    void tryPlay();
  }, [isInView, tryPlay]);

  useEffect(() => {
    const onVisibility = () => {
      void tryPlay();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [tryPlay]);

  const toggleMute = async () => {
    const video = videoRef.current;
    if (!video) return;

    const nextMuted = !isMuted;
    video.muted = nextMuted;
    setIsMuted(nextMuted);

    if (!nextMuted) {
      try {
        await video.play();
      } catch {
        video.muted = true;
        setIsMuted(true);
      }
    }
  };

  return (
    <div ref={containerRef} className="absolute inset-0 min-h-full w-full">
      {hasError ? (
        <p className="absolute inset-0 z-[2] flex items-center justify-center px-6 text-center font-outfit text-sm font-light text-tl-beige/60">
          No se pudo cargar el video. Recarga la página o revisa la conexión.
        </p>
      ) : null}

      <video
        key={videoSrc}
        ref={videoRef}
        src={videoSrc}
        autoPlay
        muted={isMuted}
        loop
        playsInline
        preload="metadata"
        aria-label="Video institucional Total Living"
        onLoadedData={() => void tryPlay()}
        onCanPlay={() => void tryPlay()}
        onError={() => setHasError(true)}
        className={cn(
          "absolute inset-0 z-[1] h-full w-full object-cover object-center",
          hasError && "opacity-0",
        )}
      />

      <button
        type="button"
        onClick={() => void toggleMute()}
        aria-label={isMuted ? "Activar audio del video" : "Silenciar video"}
        aria-pressed={!isMuted}
        className={cn(
          "absolute right-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border tl-mobile-solid-chrome transition-colors sm:bottom-6 sm:right-6 sm:backdrop-blur-sm",
          "bottom-[max(1.25rem,env(safe-area-inset-bottom,0px))]",
          isMuted
            ? "border-white/25 bg-black/55 text-tl-beige/80 hover:border-tl-gold/50 hover:text-tl-gold"
            : "border-tl-gold/50 bg-tl-gold/15 text-tl-gold hover:bg-tl-gold/25",
        )}
      >
        {isMuted ? (
          <VolumeX className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.5} />
        ) : (
          <Volume2 className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.5} />
        )}
      </button>
    </div>
  );
}
