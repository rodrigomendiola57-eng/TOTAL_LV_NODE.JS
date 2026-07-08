"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import Image from "next/image";
import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

const DRAG_THRESHOLD = 80;

const ABOUT_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
    alt: "Fachada residencial contemporánea",
  },
  {
    src: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80",
    alt: "Propiedad premium con vista panorámica",
  },
  {
    src: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=80",
    alt: "Interior de diseño minimalista",
  },
  {
    src: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=80",
    alt: "Residencia moderna con jardín",
  },
];

function stackOrder(index: number, activeIndex: number, total: number) {
  return (index - activeIndex + total) % total;
}

function useDragAlbum(imageCount: number) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const dragRef = useRef({
    dragging: false,
    pointerId: -1,
    accumulated: 0,
  });

  const goNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % imageCount);
  }, [imageCount]);

  const goPrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + imageCount) % imageCount);
  }, [imageCount]);

  const onPointerDown = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    dragRef.current = {
      dragging: true,
      pointerId: event.pointerId,
      accumulated: 0,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragOffset(0);
  }, []);

  const onPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!dragRef.current.dragging || dragRef.current.pointerId !== event.pointerId) {
        return;
      }

      const delta = event.movementX;
      dragRef.current.accumulated += delta;
      setDragOffset((prev) => prev + delta);

      while (dragRef.current.accumulated >= DRAG_THRESHOLD) {
        dragRef.current.accumulated -= DRAG_THRESHOLD;
        goNext();
        setDragOffset(0);
      }

      while (dragRef.current.accumulated <= -DRAG_THRESHOLD) {
        dragRef.current.accumulated += DRAG_THRESHOLD;
        goPrev();
        setDragOffset(0);
      }
    },
    [goNext, goPrev],
  );

  const endDrag = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (dragRef.current.pointerId !== event.pointerId) return;
    dragRef.current.dragging = false;
    dragRef.current.pointerId = -1;
    dragRef.current.accumulated = 0;
    setDragOffset(0);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }, []);

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

function AlbumCard({
  src,
  alt,
  order,
  total,
  isActive,
  dragOffset,
}: {
  src: string;
  alt: string;
  order: number;
  total: number;
  isActive: boolean;
  dragOffset: number;
}) {
  const depth = order;
  const xShift = depth * 10;
  const yShift = depth * 7;
  const scale = 1 - depth * 0.028;

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
        isActive && dragOffset !== 0
          ? { duration: 0 }
          : { type: "spring", stiffness: 320, damping: 32, mass: 0.8 }
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
          src={src}
          alt={alt}
          fill
          unoptimized
          sizes="(min-width: 1024px) 38vw, 100vw"
          className="object-cover"
          draggable={false}
        />
        {depth === 0 ? (
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-tl-black/35 via-transparent to-transparent" />
        ) : null}
      </div>
    </motion.div>
  );
}

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

function AboutImageAlbumStack({ className }: { className?: string }) {
  const {
    activeIndex,
    dragOffset,
    setActiveIndex,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
  } = useDragAlbum(ABOUT_IMAGES.length);

  const orderedCards = useMemo(
    () =>
      ABOUT_IMAGES.map((image, index) => ({
        ...image,
        index,
        order: stackOrder(index, activeIndex, ABOUT_IMAGES.length),
      })).sort((a, b) => b.order - a.order),
    [activeIndex],
  );

  return (
    <div className="w-full">
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        className={`relative h-[min(480px,52vh)] max-h-[540px] w-full cursor-grab touch-none select-none active:cursor-grabbing ${className ?? ""}`}
        aria-label="Álbum de imágenes. Haz clic y arrastra horizontalmente para cambiar de foto."
        role="group"
      >
        {orderedCards.map(({ src, alt, index, order }) => (
          <AlbumCard
            key={src}
            src={src}
            alt={alt}
            order={order}
            total={ABOUT_IMAGES.length}
            isActive={index === activeIndex}
            dragOffset={index === activeIndex ? dragOffset : 0}
          />
        ))}
      </div>

      <AlbumControls
        count={ABOUT_IMAGES.length}
        activeIndex={activeIndex}
        onSelect={setActiveIndex}
      />
    </div>
  );
}

export function AboutImageAlbumDesktop({
  scrollYProgress,
}: {
  scrollYProgress: MotionValue<number>;
}) {
  const stackY = useTransform(scrollYProgress, [0, 1], ["3%", "-3%"]);

  return (
    <div className="relative hidden lg:block">
      <motion.div style={{ y: stackY }}>
        <AboutImageAlbumStack />
      </motion.div>
    </div>
  );
}

export function AboutImageAlbumMobile() {
  return (
    <div className="lg:hidden">
      <AboutImageAlbumStack className="h-[min(380px,62vw)] max-h-[420px]" />
    </div>
  );
}
