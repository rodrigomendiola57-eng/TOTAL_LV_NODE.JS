"use client";

import { HomeExpertiseSilkBackdrop } from "@/components/layout/HomeExpertiseSilkBackdrop";
import { useLiteMotion } from "@/hooks/use-lite-motion";
import {
  HOME_JOURNAL_ITEMS,
  type HomeJournalItem,
} from "@/lib/data/home-journal";
import { HOME_HERO_VIDEO } from "@/lib/hero-media";
import { cn } from "@/lib/utils";
import {
  getJournalCarouselStartIndex,
  HOME_JOURNAL_MAX,
} from "@/types/home-content";
import { motion, useReducedMotion } from "framer-motion";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import Image from "next/image";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";

const fadeEase = [0.22, 1, 0.36, 1] as const;
export { HOME_JOURNAL_MAX };

/** Carrusel móvil / grid desktop: mismo ratio vertical 9:16; desktop más ancho por columna. */
type CardVariant = "rail" | "grid";

function cardFrame(variant: CardVariant) {
  return cn(
    "relative overflow-hidden rounded-2xl border border-white/12 aspect-[9/16]",
    variant === "rail"
      ? "w-[min(78vw,18rem)] shrink-0 sm:w-[17rem]"
      : "w-full",
  );
}

const ActiveVideoContext = createContext<{
  activeId: string | null;
  setActiveId: (id: string | null) => void;
}>({ activeId: null, setActiveId: () => {} });

function SocialHeader() {
  return (
    <div className="relative z-20 px-3 pt-3">
      <div
        aria-hidden
        className="flex h-9 w-9 items-center justify-center rounded-full border border-tl-gold/45 bg-tl-black/55 p-1.5 backdrop-blur-sm sm:h-10 sm:w-10"
      >
        <Image
          src="/logo-symbol.svg"
          alt=""
          width={28}
          height={28}
          className="h-full w-full object-contain opacity-95"
        />
      </div>
    </div>
  );
}

function CaptionBlock({
  title,
  body,
  compact,
  emphasis,
}: {
  title: string;
  body: string;
  compact?: boolean;
  /** Más contraste / tamaño para cards con video */
  emphasis?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative z-20 px-3.5 pb-4 sm:px-4 sm:pb-5",
        compact && "pb-3.5",
        emphasis && "pt-8",
      )}
    >
      <p
        className={cn(
          "font-outfit font-normal uppercase leading-snug tracking-[0.06em] text-tl-gold",
          emphasis ? "text-base sm:text-lg" : "text-[15px] sm:text-base",
        )}
      >
        {title}
      </p>
      <p
        className={cn(
          "mt-2 font-outfit font-extralight leading-relaxed text-tl-beige/85",
          emphasis
            ? "line-clamp-5 text-[15px] sm:text-base"
            : compact
              ? "line-clamp-3 text-sm"
              : "line-clamp-4 text-sm sm:text-[15px]",
        )}
      >
        {body}
      </p>
    </div>
  );
}

function TextPostCard({
  item,
  variant,
}: {
  item: HomeJournalItem;
  variant: CardVariant;
}) {
  return (
    <article
      className={cn(
        cardFrame(variant),
        "flex flex-col bg-gradient-to-b from-white/[0.07] to-black/40",
      )}
    >
      <SocialHeader />
      <div className="flex flex-1 flex-col justify-center px-4 py-5">
        <p className="font-outfit text-[10px] font-light uppercase tracking-[0.2em] text-tl-gold/80">
          #{item.category.replace(/\s+/g, "").toLowerCase()}
        </p>
        <h3 className="mt-3 font-cormorant text-[1.45rem] font-light leading-[1.15] text-tl-beige sm:text-[1.65rem]">
          {item.title}
        </h3>
        <p className="mt-3 font-outfit text-[13px] font-extralight leading-relaxed text-tl-beige/72">
          {item.body}
        </p>
      </div>
      <div className="border-t border-white/[0.06] px-3 py-2.5">
        <p className="font-outfit text-[9px] font-light uppercase tracking-[0.16em] text-tl-beige/35">
          Publicación · Total Living
        </p>
      </div>
    </article>
  );
}

function ImagePostCard({
  item,
  variant,
}: {
  item: HomeJournalItem;
  variant: CardVariant;
}) {
  const imageUrl =
    item.imageUrl ||
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=900&q=80";

  return (
    <article className={cn(cardFrame(variant), "bg-black/40")}>
      <Image
        src={imageUrl}
        alt={item.title}
        fill
        sizes={variant === "grid" ? "280px" : "300px"}
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-black/85" />
      <SocialHeader />
      <div className="absolute inset-x-0 bottom-0">
        <CaptionBlock title={item.title} body={item.body} />
      </div>
    </article>
  );
}

function VideoPostCard({
  item,
  variant,
}: {
  item: HomeJournalItem;
  variant: CardVariant;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { activeId, setActiveId } = useContext(ActiveVideoContext);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const src = item.videoUrl || HOME_HERO_VIDEO;
  const posterUrl = item.imageUrl;
  const isActive = activeId === item.id;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (!isActive && !video.paused) {
      video.pause();
      setPlaying(false);
    }
  }, [isActive]);

  const togglePlay = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      setActiveId(item.id);
      try {
        video.muted = muted;
        await video.play();
        setPlaying(true);
      } catch {
        /* gesture */
      }
    } else {
      video.pause();
      setPlaying(false);
      setActiveId(null);
    }
  }, [item.id, muted, setActiveId]);

  const toggleMute = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      const video = videoRef.current;
      const next = !muted;
      setMuted(next);
      if (video) video.muted = next;
    },
    [muted],
  );

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onEnded = () => {
      setPlaying(false);
      setActiveId(null);
    };
    video.addEventListener("ended", onEnded);
    return () => video.removeEventListener("ended", onEnded);
  }, [setActiveId]);

  return (
    <article className={cn(cardFrame(variant), "bg-black/50")}>
      {/* Portada (si hay) hasta reproducir; play/mute solo en video */}
      {posterUrl ? (
        <Image
          src={posterUrl}
          alt=""
          aria-hidden
          fill
          sizes={variant === "grid" ? "25vw" : "280px"}
          className={cn(
            "object-cover object-center transition-opacity duration-300",
            playing ? "opacity-0" : "opacity-100",
          )}
        />
      ) : null}

      <video
        ref={videoRef}
        src={src}
        poster={posterUrl}
        playsInline
        muted={muted}
        loop
        preload="none"
        className={cn(
          "absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-300",
          playing || !posterUrl ? "opacity-100" : "opacity-0",
        )}
        onClick={() => void togglePlay()}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-black/15 to-black/90"
      />

      <SocialHeader />

      <div className="absolute right-2.5 top-[42%] z-20 flex -translate-y-1/2 flex-col gap-2">
        <button
          type="button"
          onClick={() => void togglePlay()}
          aria-label={playing ? "Pausar" : "Reproducir"}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-black/50 text-tl-beige backdrop-blur-sm transition-colors hover:border-tl-gold/55 hover:text-tl-gold"
        >
          {playing ? (
            <Pause className="h-4 w-4" strokeWidth={1.5} />
          ) : (
            <Play className="h-4 w-4 fill-current" strokeWidth={1.5} />
          )}
        </button>
        <button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? "Activar sonido" : "Silenciar"}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-black/50 text-tl-beige backdrop-blur-sm transition-colors hover:border-tl-gold/55 hover:text-tl-gold"
        >
          {muted ? (
            <VolumeX className="h-4 w-4" strokeWidth={1.5} />
          ) : (
            <Volume2 className="h-4 w-4" strokeWidth={1.5} />
          )}
        </button>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-20">
        <CaptionBlock
          title={item.title}
          body={item.body}
          compact
          emphasis
        />
      </div>
    </article>
  );
}

function FeedCard({
  item,
  variant,
}: {
  item: HomeJournalItem;
  variant: CardVariant;
}) {
  // Solo video muestra play/mute. Foto y texto no.
  if (item.kind === "video" && item.videoUrl) {
    return <VideoPostCard item={item} variant={variant} />;
  }
  if (item.kind === "image" || (item.kind === "video" && item.imageUrl)) {
    return <ImagePostCard item={item} variant={variant} />;
  }
  return <TextPostCard item={item} variant={variant} />;
}

function SocialFeedCarousel({
  items,
  className,
}: {
  items: HomeJournalItem[];
  className?: string;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const count = items.length;
  const initialIndex = getJournalCarouselStartIndex(count);
  const [index, setIndex] = useState(initialIndex);

  const syncIndex = useCallback(() => {
    const el = scrollerRef.current;
    if (!el || count === 0) return;
    const cards = el.querySelectorAll<HTMLElement>("[data-feed-card]");
    if (!cards.length) return;
    const scrollMid = el.scrollLeft + el.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    cards.forEach((card, i) => {
      const mid = card.offsetLeft + card.offsetWidth / 2;
      const dist = Math.abs(mid - scrollMid);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    });
    setIndex(best);
  }, [count]);

  const goToCard = useCallback(
    (i: number, behavior: ScrollBehavior = "smooth") => {
      const el = scrollerRef.current;
      if (!el) return;
      const cards = el.querySelectorAll<HTMLElement>("[data-feed-card]");
      const card = cards[i];
      if (!card) return;
      const max = Math.max(0, el.scrollWidth - el.clientWidth);
      const left = card.offsetLeft - (el.clientWidth - card.offsetWidth) / 2;
      el.scrollTo({ left: Math.min(max, Math.max(0, left)), behavior });
    },
    [],
  );

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const start = getJournalCarouselStartIndex(items.length);
    setIndex(start);

    const frame = requestAnimationFrame(() => {
      goToCard(start, "auto");
      syncIndex();
    });

    el.addEventListener("scroll", syncIndex, { passive: true });
    window.addEventListener("resize", syncIndex, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("scroll", syncIndex);
      window.removeEventListener("resize", syncIndex);
    };
  }, [goToCard, syncIndex, items]);

  return (
    <div className={className}>
      <div
        ref={scrollerRef}
        className={cn(
          "flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain",
          "pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          "px-[max(1rem,calc(50%-min(39vw,9rem)))] sm:gap-4 sm:px-[max(1.5rem,calc(50%-8.5rem))]",
          "lg:px-[max(2rem,calc(50%-8.5rem))] lg:[scroll-padding-inline:max(2rem,calc(50%-8.5rem))]",
          "[scroll-padding-inline:max(1rem,calc(50%-min(39vw,9rem)))] sm:[scroll-padding-inline:max(1.5rem,calc(50%-8.5rem))]",
        )}
        aria-roledescription="carousel"
        aria-label="Feed Total Living"
      >
        {items.map((item, i) => (
          <div
            key={item.id}
            data-feed-card
            className={cn(
              "shrink-0 snap-center snap-always transition-opacity duration-300",
              i === index ? "opacity-100" : "opacity-60",
            )}
          >
            <FeedCard item={item} variant="rail" />
          </div>
        ))}
      </div>

      {count > 1 ? (
        <div className="mt-5 flex items-center justify-center gap-2 sm:mt-6">
          {items.map((item, i) => (
            <button
              key={item.id}
              type="button"
              aria-label={`Ir al card ${i + 1}`}
              aria-current={i === index ? "true" : undefined}
              onClick={() => goToCard(i)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === index
                  ? "w-6 bg-tl-gold"
                  : "w-1.5 bg-white/25 hover:bg-white/40",
              )}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function SocialFeedGrid({ items }: { items: HomeJournalItem[] }) {
  const n = items.length;
  const colsClass =
    n <= 1
      ? "lg:grid-cols-1 lg:max-w-sm"
      : n === 2
        ? "lg:grid-cols-2 lg:max-w-3xl"
        : n === 3
          ? "lg:grid-cols-3 lg:max-w-5xl"
          : "lg:grid-cols-4 lg:max-w-7xl";

  return (
    <div
      className={cn(
        "mx-auto hidden w-full gap-3 px-5 lg:grid xl:gap-4 xl:px-8",
        colsClass,
      )}
    >
      {items.map((item) => (
        <FeedCard key={item.id} item={item} variant="grid" />
      ))}
    </div>
  );
}

function ActiveVideoProvider({ children }: { children: ReactNode }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  return (
    <ActiveVideoContext.Provider value={{ activeId, setActiveId }}>
      {children}
    </ActiveVideoContext.Provider>
  );
}

/**
 * Novedades: hasta HOME_JOURNAL_MAX posts.
 * ≤4 en desktop = grid. >4 = carrusel (móvil y desktop) con card inicial en el medio.
 */
export function HomeJournalSection({
  title = "Novedades Total Living",
  subtitle = "Historias, capacitaciones y promociones",
  items,
}: {
  title?: string;
  subtitle?: string;
  items?: HomeJournalItem[];
} = {}) {
  const reducedMotion = useReducedMotion();
  const liteMotion = useLiteMotion();
  const disableMotion = Boolean(reducedMotion) || liteMotion;
  const silkReducedMotion = Boolean(reducedMotion);
  const feedItems = (
    items && items.length > 0 ? items : HOME_JOURNAL_ITEMS
  ).slice(0, HOME_JOURNAL_MAX);
  const useDesktopCarousel = feedItems.length > 4;

  return (
    <section
      id="novedades"
      className="home-scroll-section relative w-full overflow-hidden"
      aria-labelledby="home-journal-title"
    >
      <HomeExpertiseSilkBackdrop reducedMotion={silkReducedMotion} />

      <div className="relative z-10 py-10 sm:py-12 md:py-14 lg:py-16">
        <div className="mx-auto mb-6 max-w-6xl px-4 text-center sm:mb-8 sm:px-6">
          {disableMotion ? (
            <div>
              <h2
                id="home-journal-title"
                className="text-fluid-h2 font-cormorant font-light text-tl-beige"
              >
                {title}
              </h2>
              <p className="mx-auto mt-3 max-w-md font-outfit text-sm font-extralight text-tl-beige/55">
                {subtitle}
              </p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.55, ease: fadeEase }}
            >
              <h2
                id="home-journal-title"
                className="text-fluid-h2 font-cormorant font-light text-tl-beige"
              >
                {title}
              </h2>
              <p className="mx-auto mt-3 max-w-md font-outfit text-sm font-extralight text-tl-beige/55">
                {subtitle}
              </p>
            </motion.div>
          )}
        </div>

        <ActiveVideoProvider>
          {useDesktopCarousel ? (
            <SocialFeedCarousel items={feedItems} />
          ) : (
            <>
              <SocialFeedCarousel items={feedItems} className="lg:hidden" />
              <SocialFeedGrid items={feedItems} />
            </>
          )}
        </ActiveVideoProvider>
      </div>
    </section>
  );
}
