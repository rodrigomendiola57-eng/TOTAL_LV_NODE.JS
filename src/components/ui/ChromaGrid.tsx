"use client";

import { gsap } from "gsap";
import { useEffect, useRef } from "react";
import "./ChromaGrid.css";

export interface ChromaGridItem {
  image: string;
  title: string;
  subtitle: string;
  handle?: string;
  location?: string;
  borderColor?: string;
  gradient?: string;
  url?: string;
}

export interface ChromaGridProps {
  items: ChromaGridItem[];
  className?: string;
  radius?: number;
  columns?: number;
  rows?: number;
  damping?: number;
  fadeOut?: number;
  ease?: string;
}

export function ChromaGrid({
  items,
  className = "",
  radius = 300,
  columns = 3,
  rows = 2,
  damping = 0.45,
  fadeOut = 0.6,
  ease = "power3.out",
}: ChromaGridProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const fadeRef = useRef<HTMLDivElement>(null);
  const setX = useRef<((value: number) => void) | null>(null);
  const setY = useRef<((value: number) => void) | null>(null);
  const pos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    setX.current = gsap.quickSetter(el, "--x", "px") as (value: number) => void;
    setY.current = gsap.quickSetter(el, "--y", "px") as (value: number) => void;
    const { width, height } = el.getBoundingClientRect();
    pos.current = { x: width / 2, y: height / 2 };
    setX.current(pos.current.x);
    setY.current(pos.current.y);
  }, []);

  const moveTo = (x: number, y: number) => {
    gsap.to(pos.current, {
      x,
      y,
      duration: damping,
      ease,
      onUpdate: () => {
        setX.current?.(pos.current.x);
        setY.current?.(pos.current.y);
      },
      overwrite: true,
    });
  };

  const handleMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const root = rootRef.current;
    if (!root) return;

    const rect = root.getBoundingClientRect();
    moveTo(event.clientX - rect.left, event.clientY - rect.top);
    gsap.to(fadeRef.current, { opacity: 0, duration: 0.25, overwrite: true });
  };

  const handleLeave = () => {
    gsap.to(fadeRef.current, {
      opacity: 1,
      duration: fadeOut,
      overwrite: true,
    });
  };

  const handleCardClick = (url?: string) => {
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const handleCardMove = (event: React.MouseEvent<HTMLElement>) => {
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--mouse-x", `${event.clientX - rect.left}px`);
    card.style.setProperty("--mouse-y", `${event.clientY - rect.top}px`);
  };

  return (
    <div
      ref={rootRef}
      className={`chroma-grid ${className}`.trim()}
      style={
        {
          "--r": `${radius}px`,
          "--cols": columns,
          "--rows": rows,
        } as React.CSSProperties
      }
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      {items.map((item, index) => (
        <article
          key={`${item.title}-${index}`}
          className="chroma-card"
          onMouseMove={handleCardMove}
          onClick={() => handleCardClick(item.url)}
          style={
            {
              "--card-border": item.borderColor ?? "#D6B585",
              "--card-gradient":
                item.gradient ??
                "linear-gradient(155deg, #4A4E38 0%, #1a1a16 55%, #0a0a08 100%)",
              cursor: item.url ? "pointer" : "default",
            } as React.CSSProperties
          }
        >
          <div className="chroma-img-wrapper">
            <img src={item.image} alt={item.title} loading="lazy" />
          </div>
          <footer className="chroma-info">
            <h3 className="name">{item.title}</h3>
            <p className="role">{item.subtitle}</p>
            {item.handle ? <span className="handle">{item.handle}</span> : null}
            {item.location ? (
              <p className="location">{item.location}</p>
            ) : null}
          </footer>
        </article>
      ))}
      <div className="chroma-overlay" aria-hidden />
      <div ref={fadeRef} className="chroma-fade" aria-hidden />
    </div>
  );
}

export default ChromaGrid;
