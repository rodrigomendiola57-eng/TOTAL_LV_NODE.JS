"use client";

import { BrandLogoAnimated } from "@/components/layout/BrandLogoAnimated";
import { gsap } from "gsap";
import Link from "next/link";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import type { ComponentType, SVGProps } from "react";
import "./StaggeredMenu.css";

export interface StaggeredMenuItem {
  label: string;
  ariaLabel: string;
  link: string;
}

export interface StaggeredMenuSocialItem {
  label: string;
  href: string;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
}

export interface StaggeredSubmenuItem {
  label: string;
  link: string;
}

interface StaggeredMenuProps {
  position?: "left" | "right";
  colors?: string[];
  items?: StaggeredMenuItem[];
  socialItems?: StaggeredMenuSocialItem[];
  displaySocials?: boolean;
  displayItemNumbering?: boolean;
  className?: string;
  brandTitle?: string;
  logoUrl?: string;
  menuButtonColor?: string;
  openMenuButtonColor?: string;
  accentColor?: string;
  changeMenuColorOnOpen?: boolean;
  isFixed?: boolean;
  closeOnClickAway?: boolean;
  onMenuOpen?: () => void;
  onMenuClose?: () => void;
  propertySubItems?: StaggeredSubmenuItem[];
  /** Oculta la barra interna; usar con barra externa (MobileNavbarBar). */
  showHeader?: boolean;
  /** Modo controlado: estado abierto/cerrado desde el padre. */
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const StaggeredMenu: React.FC<StaggeredMenuProps> = ({
  position = "right",
  colors = ["#4A4E38", "#D6B585"],
  items = [],
  socialItems = [],
  displaySocials = true,
  displayItemNumbering = true,
  className,
  logoUrl,
  brandTitle = "TOTAL LIVING",
  menuButtonColor = "#F2ECE0",
  openMenuButtonColor = "#F2ECE0",
  accentColor = "#D6B585",
  changeMenuColorOnOpen = true,
  isFixed = true,
  closeOnClickAway = true,
  onMenuOpen,
  onMenuClose,
  propertySubItems = [],
  showHeader = true,
  isOpen: isOpenProp,
  onOpenChange,
}) => {
  const [open, setOpen] = useState(false);
  const [overlayLogoAnimKey, setOverlayLogoAnimKey] = useState(0);
  const [propertyExpanded, setPropertyExpanded] = useState(false);
  const openRef = useRef(false);

  const panelRef = useRef<HTMLDivElement | null>(null);
  const preLayersRef = useRef<HTMLDivElement | null>(null);
  const preLayerElsRef = useRef<HTMLElement[]>([]);

  const plusHRef = useRef<HTMLSpanElement | null>(null);
  const plusVRef = useRef<HTMLSpanElement | null>(null);
  const iconRef = useRef<HTMLSpanElement | null>(null);

  const textInnerRef = useRef<HTMLSpanElement | null>(null);
  const textWrapRef = useRef<HTMLSpanElement | null>(null);
  const [textLines, setTextLines] = useState<string[]>(["Menu", "Close"]);

  const openTlRef = useRef<gsap.core.Timeline | null>(null);
  const closeTweenRef = useRef<gsap.core.Tween | null>(null);
  const spinTweenRef = useRef<gsap.core.Tween | gsap.core.Timeline | null>(null);
  const textCycleAnimRef = useRef<gsap.core.Tween | null>(null);
  const colorTweenRef = useRef<gsap.core.Tween | null>(null);

  const toggleBtnRef = useRef<HTMLButtonElement | null>(null);
  const busyRef = useRef(false);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const panel = panelRef.current;
      const preContainer = preLayersRef.current;
      if (!panel) return;

      let preLayers: HTMLElement[] = [];
      if (preContainer) {
        preLayers = Array.from(
          preContainer.querySelectorAll<HTMLElement>(".sm-prelayer"),
        );
      }
      preLayerElsRef.current = preLayers;

      const offscreen = position === "left" ? -100 : 100;
      gsap.set([panel, ...preLayers], { xPercent: offscreen });

      const plusH = plusHRef.current;
      const plusV = plusVRef.current;
      const icon = iconRef.current;
      const textInner = textInnerRef.current;
      if (plusH && plusV && icon && textInner) {
        gsap.set(plusH, { transformOrigin: "50% 50%", rotate: 0 });
        gsap.set(plusV, { transformOrigin: "50% 50%", rotate: 90 });
        gsap.set(icon, { rotate: 0, transformOrigin: "50% 50%" });
        gsap.set(textInner, { yPercent: 0 });
      }
      if (toggleBtnRef.current) {
        gsap.set(toggleBtnRef.current, { color: menuButtonColor });
      }
    });
    return () => ctx.revert();
  }, [menuButtonColor, position]);

  const buildOpenTimeline = useCallback(() => {
    const panel = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return null;

    openTlRef.current?.kill();
    if (closeTweenRef.current) {
      closeTweenRef.current.kill();
      closeTweenRef.current = null;
    }

    const itemEls = Array.from(
      panel.querySelectorAll<HTMLElement>(".sm-panel-itemLabel"),
    );
    const numberEls = Array.from(
      panel.querySelectorAll<HTMLElement>(
        ".sm-panel-list[data-numbering] .sm-panel-item",
      ),
    );
    const socialTitle = panel.querySelector<HTMLElement>(".sm-socials-title");
    const socialLinks = Array.from(
      panel.querySelectorAll<HTMLElement>(".sm-socials-link"),
    );

    const offscreen = position === "left" ? -100 : 100;
    const layerStates = layers.map((el) => ({ el, start: offscreen }));
    const panelStart = offscreen;

    if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });
    if (numberEls.length) gsap.set(numberEls, { "--sm-num-opacity": 0 });
    if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
    if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });

    const tl = gsap.timeline({ paused: true });

    layerStates.forEach((ls, i) => {
      tl.fromTo(
        ls.el,
        { xPercent: ls.start },
        { xPercent: 0, duration: 0.5, ease: "power4.out" },
        i * 0.07,
      );
    });

    const lastTime = layerStates.length ? (layerStates.length - 1) * 0.07 : 0;
    const panelInsertTime = lastTime + (layerStates.length ? 0.08 : 0);
    const panelDuration = 0.65;

    tl.fromTo(
      panel,
      { xPercent: panelStart },
      { xPercent: 0, duration: panelDuration, ease: "power4.out" },
      panelInsertTime,
    );

    if (itemEls.length) {
      const itemsStart = panelInsertTime + panelDuration * 0.15;
      tl.to(
        itemEls,
        {
          yPercent: 0,
          rotate: 0,
          duration: 1,
          ease: "power4.out",
          stagger: { each: 0.1, from: "start" },
        },
        itemsStart,
      );
      if (numberEls.length) {
        tl.to(
          numberEls,
          {
            duration: 0.6,
            ease: "power2.out",
            "--sm-num-opacity": 1,
            stagger: { each: 0.08, from: "start" },
          },
          itemsStart + 0.1,
        );
      }
    }

    if (socialTitle || socialLinks.length) {
      const socialsStart = panelInsertTime + panelDuration * 0.4;
      if (socialTitle) {
        tl.to(
          socialTitle,
          { opacity: 1, duration: 0.5, ease: "power2.out" },
          socialsStart,
        );
      }
      if (socialLinks.length) {
        tl.to(
          socialLinks,
          {
            y: 0,
            opacity: 1,
            duration: 0.55,
            ease: "power3.out",
            stagger: { each: 0.08, from: "start" },
            onComplete: () => {
              gsap.set(socialLinks, { clearProps: "opacity" });
            },
          },
          socialsStart + 0.04,
        );
      }
    }

    openTlRef.current = tl;
    return tl;
  }, [position]);

  const playOpen = useCallback(() => {
    if (busyRef.current) return;
    busyRef.current = true;
    const tl = buildOpenTimeline();
    if (tl) {
      tl.eventCallback("onComplete", () => {
        busyRef.current = false;
      });
      tl.play(0);
    } else {
      busyRef.current = false;
    }
  }, [buildOpenTimeline]);

  const playClose = useCallback(() => {
    openTlRef.current?.kill();
    openTlRef.current = null;

    const panel = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return;

    const all = [...layers, panel];
    closeTweenRef.current?.kill();
    const offscreen = position === "left" ? -100 : 100;
    closeTweenRef.current = gsap.to(all, {
      xPercent: offscreen,
      duration: 0.32,
      ease: "power3.in",
      overwrite: "auto",
      onComplete: () => {
        const itemEls = Array.from(
          panel.querySelectorAll<HTMLElement>(".sm-panel-itemLabel"),
        );
        if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });
        busyRef.current = false;
      },
    });
  }, [position]);

  const animateIcon = useCallback((opening: boolean) => {
    const icon = iconRef.current;
    if (!icon) return;
    spinTweenRef.current?.kill();
    if (opening) {
      spinTweenRef.current = gsap.to(icon, {
        rotate: 225,
        duration: 0.8,
        ease: "power4.out",
        overwrite: "auto",
      });
    } else {
      spinTweenRef.current = gsap.to(icon, {
        rotate: 0,
        duration: 0.35,
        ease: "power3.inOut",
        overwrite: "auto",
      });
    }
  }, []);

  const animateColor = useCallback(
    (opening: boolean) => {
      const btn = toggleBtnRef.current;
      if (!btn) return;
      colorTweenRef.current?.kill();
      if (changeMenuColorOnOpen) {
        const targetColor = opening ? openMenuButtonColor : menuButtonColor;
        colorTweenRef.current = gsap.to(btn, {
          color: targetColor,
          delay: 0.18,
          duration: 0.3,
          ease: "power2.out",
        });
      } else {
        gsap.set(btn, { color: menuButtonColor });
      }
    },
    [openMenuButtonColor, menuButtonColor, changeMenuColorOnOpen],
  );

  const animateText = useCallback((opening: boolean) => {
    const inner = textInnerRef.current;
    if (!inner) return;
    textCycleAnimRef.current?.kill();

    const currentLabel = opening ? "Menu" : "Close";
    const targetLabel = opening ? "Close" : "Menu";
    const cycles = 3;
    const seq = [currentLabel];
    let last = currentLabel;
    for (let i = 0; i < cycles; i++) {
      last = last === "Menu" ? "Close" : "Menu";
      seq.push(last);
    }
    if (last !== targetLabel) seq.push(targetLabel);
    seq.push(targetLabel);
    setTextLines(seq);

    gsap.set(inner, { yPercent: 0 });
    const lineCount = seq.length;
    const finalShift = ((lineCount - 1) / lineCount) * 100;
    textCycleAnimRef.current = gsap.to(inner, {
      yPercent: -finalShift,
      duration: 0.5 + lineCount * 0.07,
      ease: "power4.out",
    });
  }, []);

  const setMenuOpen = useCallback(
    (next: boolean) => {
      openRef.current = next;
      setOpen(next);
      onOpenChange?.(next);
    },
    [onOpenChange],
  );

  const toggleMenu = useCallback(() => {
    const target = !openRef.current;
    setMenuOpen(target);
    if (target) {
      onMenuOpen?.();
      playOpen();
    } else {
      onMenuClose?.();
      playClose();
    }
    animateIcon(target);
    animateColor(target);
    animateText(target);
  }, [
    setMenuOpen,
    playOpen,
    playClose,
    animateIcon,
    animateColor,
    animateText,
    onMenuOpen,
    onMenuClose,
  ]);

  const closeMenu = useCallback(() => {
    if (!openRef.current) return;
    const active = document.activeElement;
    if (
      active instanceof HTMLElement &&
      panelRef.current?.contains(active)
    ) {
      active.blur();
    }
    setMenuOpen(false);
    onMenuClose?.();
    playClose();
    animateIcon(false);
    animateColor(false);
    animateText(false);
    setPropertyExpanded(false);
  }, [
    setMenuOpen,
    playClose,
    animateIcon,
    animateColor,
    animateText,
    onMenuClose,
  ]);

  const isControlled = isOpenProp !== undefined;
  const menuOpen = isControlled ? isOpenProp : open;

  useEffect(() => {
    if (menuOpen) {
      setOverlayLogoAnimKey((current) => current + 1);
    }
  }, [menuOpen]);

  useEffect(() => {
    if (isOpenProp === undefined) return;
    if (isOpenProp === openRef.current) return;

    openRef.current = isOpenProp;
    setOpen(isOpenProp);

    if (isOpenProp) {
      onMenuOpen?.();
      playOpen();
    } else {
      onMenuClose?.();
      playClose();
      setPropertyExpanded(false);
    }

    if (showHeader) {
      animateIcon(isOpenProp);
      animateColor(isOpenProp);
      animateText(isOpenProp);
    }
  }, [
    isOpenProp,
    showHeader,
    playOpen,
    playClose,
    animateIcon,
    animateColor,
    animateText,
    onMenuOpen,
    onMenuClose,
  ]);

  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!closeOnClickAway || !menuOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      const targetNode = event.target as Node;
      if (
        panelRef.current &&
        !panelRef.current.contains(targetNode) &&
        toggleBtnRef.current &&
        !toggleBtnRef.current.contains(targetNode)
      ) {
        closeMenu();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeOnClickAway, menuOpen, closeMenu]);

  const preLayerColors = (() => {
    const raw = colors && colors.length ? colors.slice(0, 4) : ["#4A4E38", "#D6B585"];
    const arr = [...raw];
    if (arr.length >= 3) {
      const mid = Math.floor(arr.length / 2);
      arr.splice(mid, 1);
    }
    return arr;
  })();

  return (
    <div
      className={
        (className ? className + " " : "") +
        "staggered-menu-wrapper" +
        (isFixed ? " fixed-wrapper" : "") +
        (!showHeader ? " overlay-only" : "")
      }
      style={
        accentColor
          ? ({ ["--sm-accent" as string]: accentColor } as React.CSSProperties)
          : undefined
      }
      data-position={position}
      data-open={menuOpen || undefined}
    >
      <div ref={preLayersRef} className="sm-prelayers" aria-hidden="true">
        {preLayerColors.map((c, i) => (
          <div key={i} className="sm-prelayer" style={{ background: c }} />
        ))}
      </div>

      {showHeader ? (
        <header className="staggered-menu-header" aria-label="Navegación principal">
          <Link href="/#inicio" className="sm-logo-link" aria-label="Total Living inicio">
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoUrl}
                alt=""
                className="sm-logo-img"
                draggable={false}
                width={44}
                height={36}
              />
            ) : null}
            <span className="sm-logo-title">{brandTitle}</span>
          </Link>
          <button
            ref={toggleBtnRef}
            className="sm-toggle"
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuOpen}
            aria-controls="staggered-menu-panel"
            onClick={toggleMenu}
            type="button"
          >
            <span ref={textWrapRef} className="sm-toggle-textWrap" aria-hidden="true">
              <span ref={textInnerRef} className="sm-toggle-textInner">
                {textLines.map((l, i) => (
                  <span className="sm-toggle-line" key={i}>
                    {l}
                  </span>
                ))}
              </span>
            </span>
            <span ref={iconRef} className="sm-icon" aria-hidden="true">
              <span ref={plusHRef} className="sm-icon-line" />
              <span ref={plusVRef} className="sm-icon-line sm-icon-line-v" />
            </span>
          </button>
        </header>
      ) : null}

      <aside
        id="staggered-menu-panel"
        ref={panelRef}
        className="staggered-menu-panel"
        aria-hidden={!menuOpen}
      >
        {!showHeader ? (
          <header className="sm-overlay-top" aria-label="Total Living">
            <BrandLogoAnimated
              animationKey={overlayLogoAnimKey}
              href="/#inicio"
              onClick={closeMenu}
              title={brandTitle}
              wrapperClassName="sm-overlay-logo"
              innerClassName="relative flex min-w-0 max-w-full flex-row flex-nowrap items-center justify-center gap-2 overflow-visible rounded-xl px-1 py-1 sm:gap-3"
              symbolClassName="sm-overlay-logo-img relative shrink-0 object-contain"
              titleClassName="sm-overlay-logo-title min-w-0 shrink"
              animateLetterSpacingFrom="0.1em"
              animateLetterSpacingTo="0.05em"
            />
          </header>
        ) : null}

        <div className="sm-panel-inner">
          <ul
            className="sm-panel-list"
            role="list"
            data-numbering={displayItemNumbering || undefined}
          >
            {items && items.length ? (
              items.map((it, idx) => (
                <li className="sm-panel-itemWrap" key={it.label + idx}>
                  {it.label === "Propiedades" && propertySubItems.length > 0 ? (
                    <>
                      <button
                        type="button"
                        className="sm-panel-item sm-panel-itemButton"
                        aria-label={it.ariaLabel}
                        data-index={idx + 1}
                        onClick={() => setPropertyExpanded((prev) => !prev)}
                      >
                        <span className="sm-panel-itemLabel">{it.label}</span>
                      </button>
                      <div
                        className={`sm-submenu ${propertyExpanded ? "is-open" : ""}`}
                        aria-hidden={!propertyExpanded}
                      >
                        {propertySubItems.map((subItem) => (
                          <Link
                            key={subItem.label}
                            href={subItem.link}
                            className="sm-submenu-link"
                            onClick={closeMenu}
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    </>
                  ) : (
                    <Link
                      className="sm-panel-item"
                      href={it.link}
                      aria-label={it.ariaLabel}
                      data-index={idx + 1}
                      onClick={closeMenu}
                    >
                      <span className="sm-panel-itemLabel">{it.label}</span>
                    </Link>
                  )}
                </li>
              ))
            ) : (
              <li className="sm-panel-itemWrap" aria-hidden="true">
                <span className="sm-panel-item">
                  <span className="sm-panel-itemLabel">Sin elementos</span>
                </span>
              </li>
            )}
          </ul>

          {displaySocials && socialItems && socialItems.length > 0 && (
            <div className="sm-socials" aria-label="Enlaces sociales">
              <p className="sm-socials-title">Síguenos</p>
              <ul className="sm-socials-list" role="list">
                {socialItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.label} className="sm-socials-item">
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="sm-socials-icon"
                        aria-label={item.label}
                      >
                        {Icon ? (
                          <Icon className="sm-socials-icon-svg" aria-hidden />
                        ) : (
                          item.label
                        )}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>

        {!showHeader ? (
          <div className="sm-overlay-footer">
            <button
              type="button"
              className="sm-overlay-close"
              aria-label="Cerrar menú"
              onClick={closeMenu}
            >
              <span className="sm-overlay-close-line" />
              <span className="sm-overlay-close-line" />
            </button>
          </div>
        ) : null}
      </aside>
    </div>
  );
};

export default StaggeredMenu;
