/**
 * Bloqueo robusto del scroll de página (desktop + móvil).
 * `overflow: hidden` solo en body no basta: a menudo el scroll vive en `html`
 * o iOS sigue permitiendo el gesto. Fijamos el body y restauramos la posición.
 */

let lockCount = 0;
let savedScrollY = 0;
let savedHtmlOverflow = "";
let savedBodyOverflow = "";
let savedBodyPosition = "";
let savedBodyTop = "";
let savedBodyLeft = "";
let savedBodyRight = "";
let savedBodyWidth = "";
let savedBodyPaddingRight = "";

function getScrollbarGap(): number {
  if (typeof window === "undefined") return 0;
  return Math.max(0, window.innerWidth - document.documentElement.clientWidth);
}

export function lockBodyScroll(): () => void {
  if (typeof document === "undefined") return () => {};

  if (lockCount === 0) {
    savedScrollY = window.scrollY;
    savedHtmlOverflow = document.documentElement.style.overflow;
    savedBodyOverflow = document.body.style.overflow;
    savedBodyPosition = document.body.style.position;
    savedBodyTop = document.body.style.top;
    savedBodyLeft = document.body.style.left;
    savedBodyRight = document.body.style.right;
    savedBodyWidth = document.body.style.width;
    savedBodyPaddingRight = document.body.style.paddingRight;

    const gap = getScrollbarGap();
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${savedScrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
    if (gap > 0) {
      document.body.style.paddingRight = `${gap}px`;
    }
  }

  lockCount += 1;

  let released = false;
  return () => {
    if (released) return;
    released = true;
    lockCount = Math.max(0, lockCount - 1);
    if (lockCount > 0) return;

    document.documentElement.style.overflow = savedHtmlOverflow;
    document.body.style.overflow = savedBodyOverflow;
    document.body.style.position = savedBodyPosition;
    document.body.style.top = savedBodyTop;
    document.body.style.left = savedBodyLeft;
    document.body.style.right = savedBodyRight;
    document.body.style.width = savedBodyWidth;
    document.body.style.paddingRight = savedBodyPaddingRight;
    window.scrollTo(0, savedScrollY);
  };
}
