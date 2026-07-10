"use client";

import {
  DEFAULT_ALBUM_IMAGES,
  type AboutAlbumImage,
} from "@/lib/home-content-mappers";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import {
  memo,
  useCallback,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from "react";

const DRAG_THRESHOLD = 80;

const DESKTOP_STACK_TRANSITION = {
  type: "spring" as const,
  stiffness: 320,
  damping: 32,
  mass: 0.8,
};

const MOBILE_STACK_TRANSITION = {
  type: "tween" as const,
  duration: 0.32,
  ease: [0.22, 1, 0.36, 1] as const,
};

const ABOUT_IMAGES = DEFAULT_ALBUM_IMAGES;

function stackOrder(index: number, activeIndex: number, total: number) {
  return (index - activeIndex + total) % total;
}

/** Cambia de foto solo al soltar — evita reordenar el stack mientras arrastras. */
function useDragAlbum(imageCount: number, variant: "mobile" | "desktop") {
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const dragRef = useRef({
    pointerId: -1,
    accumulated: 0,
    pendingDelta: 0,
    rafId: 0 as number | 0,
    startX: 0,
    startY: 0,
    axis: null as "x" | "y" | null,
  });
  const allowVerticalScroll = variant === "mobile";

  const flushDragFrame = useCallback(() => {
    const drag = dragRef.current;
    if (drag.pendingDelta === 0) {
      drag.rafId = 0;
      return;
    }

    const delta = drag.pendingDelta;
    drag.pendingDelta = 0;
    drag.rafId = 0;
    drag.accumulated += delta;
    setDragOffset((prev) => prev + delta);
  }, []);

  const onPointerDown = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    dragRef.current.pointerId = event.pointerId;
    dragRef.current.accumulated = 0;
    dragRef.current.pendingDelta = 0;
    dragRef.current.startX = event.clientX;
    dragRef.current.startY = event.clientY;
    dragRef.current.axis = allowVerticalScroll ? null : "x";
    if (dragRef.current.rafId) {
      cancelAnimationFrame(dragRef.current.rafId);
      dragRef.current.rafId = 0;
    }
    setDragOffset(0);
    if (!allowVerticalScroll) {
      event.currentTarget.setPointerCapture(event.pointerId);
    }
  }, [allowVerticalScroll]);

  const onPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (dragRef.current.pointerId !== event.pointerId) return;

      if (allowVerticalScroll && dragRef.current.axis === null) {
        const deltaX = event.clientX - dragRef.current.startX;
        const deltaY = event.clientY - dragRef.current.startY;
        if (Math.abs(deltaX) < 8 && Math.abs(deltaY) < 8) return;

        if (Math.abs(deltaY) > Math.abs(deltaX)) {
          dragRef.current.axis = "y";
          dragRef.current.pointerId = -1;
          return;
        }

        dragRef.current.axis = "x";
        event.currentTarget.setPointerCapture(event.pointerId);
      }

      if (allowVerticalScroll && dragRef.current.axis === "y") return;
      if (allowVerticalScroll && dragRef.current.axis === null) return;

      dragRef.current.pendingDelta += event.movementX;
      if (!dragRef.current.rafId) {
        dragRef.current.rafId = requestAnimationFrame(flushDragFrame);
      }
    },
    [allowVerticalScroll, flushDragFrame],
  );

  const endDrag = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (dragRef.current.axis === "y") {
        dragRef.current.pointerId = -1;
        dragRef.current.axis = null;
        dragRef.current.accumulated = 0;
        dragRef.current.pendingDelta = 0;
        setDragOffset(0);
        return;
      }

      if (dragRef.current.pointerId !== event.pointerId) return;

      if (dragRef.current.rafId) {
        cancelAnimationFrame(dragRef.current.rafId);
        flushDragFrame();
      }

      const steps = Math.trunc(dragRef.current.accumulated / DRAG_THRESHOLD);
      if (steps !== 0) {
        setActiveIndex((prev) => (prev + steps + imageCount * 1000) % imageCount);
      }

      dragRef.current.pointerId = -1;
      dragRef.current.accumulated = 0;
      dragRef.current.pendingDelta = 0;
      dragRef.current.axis = null;
      setDragOffset(0);

      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    },
    [flushDragFrame, imageCount],
  );

  return {
    activeIndex,
    dragOffset,
    setActiveIndex,
    onPointerDown,
    onPointerMove,
    onPointerUp: endDrag,
    onPointerCancel: endDrag,
  };
}

const AlbumCard = memo(function AlbumCard({
  src,
  srcMobile,
  alt,
  order,
  total,
  isActive,
  dragOffset,
  variant,
}: {
  src: string;
  srcMobile: string;
  alt: string;
  order: number;
  total: number;
  isActive: boolean;
  dragOffset: number;
  variant: "mobile" | "desktop";
}) {
  const depth = order;
  const xShift = depth * (variant === "mobile" ? 8 : 10);
  const yShift = depth * (variant === "mobile" ? 5 : 7);
  const scale = 1 - depth * 0.028;
  const isDragging = isActive && dragOffset !== 0;

  return (
    <motion.div
      className="absolute inset-0"
      initial={false}
      animate={{
        x: isActive ? dragOffset * 0.35 + xShift : xShift,
        y: yShift,
        scale,
        opacity: depth === 0 ? 1 : Math.max(0.35, 0.88 - depth * 0.14),
        zIndex: total - depth,
      }}
      transition={
        isDragging
          ? { duration: 0 }
          : variant === "mobile"
            ? MOBILE_STACK_TRANSITION
            : DESKTOP_STACK_TRANSITION
      }
      style={{ transformOrigin: "center center" }}
    >
      <div
        className={`relative h-full w-full overflow-hidden rounded-2xl bg-tl-black/50 ${
          depth === 0
            ? "shadow-[0_16px_48px_-20px_rgba(0,0,0,0.9)] ring-1 ring-white/15"
            : "ring-1 ring-white/8"
        }`}
      >
        <Image
          src={variant === "mobile" ? srcMobile : src}
          alt={alt}
          fill
          sizes={variant === "mobile" ? "100vw" : "(min-width: 1024px) 38vw, 100vw"}
          quality={variant === "mobile" ? 70 : 75}
          priority={variant === "mobile"}
          className="object-cover"
          draggable={false}
        />
        {depth === 0 ? (
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-tl-black/35 via-transparent to-transparent" />
        ) : null}
      </div>
    </motion.div>
  );
});

function AlbumControls({
  count,
  activeIndex,
  onSelect,
}: {
  count: number;
  activeIndex: number;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="mt-4 flex flex-col items-center justify-center gap-2.5">
      <p className="font-outfit font-light text-[10px] uppercase tracking-[0.16em] text-tl-beige/45">
        Arrastra · {activeIndex + 1}/{count}
      </p>
      <div className="flex items-center justify-center gap-2">
        {Array.from({ length: count }, (_, index) => (
          <button
            key={index}
            type="button"
            aria-label={`Ver imagen ${index + 1}`}
            onClick={() => onSelect(index)}
            className={`h-1.5 rounded-full transition-all ${
              index === activeIndex
                ? "w-6 bg-tl-gold"
                : "w-1.5 bg-white/30 hover:bg-white/55"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function AboutImageAlbumStack({
  className,
  variant,
  images = ABOUT_IMAGES,
}: {
  className?: string;
  variant: "mobile" | "desktop";
  images?: AboutAlbumImage[];
}) {
  const albumImages = images.length > 0 ? images : ABOUT_IMAGES;
  const {
    activeIndex,
    dragOffset,
    setActiveIndex,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
  } = useDragAlbum(albumImages.length, variant);

  const touchClass =
    variant === "mobile"
      ? "touch-pan-y cursor-grab active:cursor-grabbing"
      : "touch-none cursor-grab active:cursor-grabbing";

  const orderedCards = useMemo(
    () =>
      albumImages.map((image, index) => ({
        ...image,
        index,
        order: stackOrder(index, activeIndex, albumImages.length),
      })).sort((a, b) => b.order - a.order),
    [activeIndex, albumImages],
  );

  return (
    <div className="w-full">
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        className={`relative h-[min(480px,52vh)] max-h-[540px] w-full select-none ${touchClass} ${className ?? ""}`}
        aria-label="Álbum de imágenes. Haz clic y arrastra horizontalmente para cambiar de foto."
        role="group"
      >
        {orderedCards.map(({ src, srcMobile, alt, index, order }) => (
          <AlbumCard
            key={`${src}-${index}`}
            src={src}
            srcMobile={srcMobile}
            alt={alt}
            order={order}
            total={albumImages.length}
            isActive={index === activeIndex}
            dragOffset={index === activeIndex ? dragOffset : 0}
            variant={variant}
          />
        ))}
      </div>

      <AlbumControls
        count={albumImages.length}
        activeIndex={activeIndex}
        onSelect={setActiveIndex}
      />
    </div>
  );
}

export function AboutImageAlbumDesktop({
  sectionRef,
  images,
}: {
  sectionRef: RefObject<HTMLElement | null>;
  images?: AboutAlbumImage[];
}) {
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.85", "end 0.15"],
  });
  const stackY = useTransform(scrollYProgress, [0, 1], ["3%", "-3%"]);

  return (
    <div className="relative hidden lg:block">
      <motion.div style={{ y: stackY }}>
        <AboutImageAlbumStack variant="desktop" images={images} />
      </motion.div>
    </div>
  );
}

export function AboutImageAlbumMobile({
  images,
}: {
  images?: AboutAlbumImage[];
}) {
  return (
    <div className="lg:hidden">
      <AboutImageAlbumStack
        variant="mobile"
        images={images}
        className="h-[min(380px,62vw)] max-h-[420px]"
      />
    </div>
  );
}
