"use client";

import { BrandLogoAnimated } from "@/components/layout/BrandLogoAnimated";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FormEvent,
  Suspense,
  useEffect,
  useState,
  useTransition,
} from "react";

const Ballpit = dynamic(() => import("@/components/ui/Ballpit"), {
  ssr: false,
  loading: () => null,
});

/** Colores de marca Total Living (gold / beige / olive / charcoal). */
const BALLPIT_COLORS = [0xd6b585, 0xf2ece0, 0x4a4e38, 0x2a2a24];

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/dashboard";
  const [isNavigating, startTransition] = useTransition();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const busy = loading || isNavigating;

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(
          typeof data.detail === "string"
            ? data.detail
            : "No se pudo iniciar sesión.",
        );
        setLoading(false);
        return;
      }

      const target = nextPath.startsWith("/dashboard")
        ? nextPath
        : "/dashboard";
      // Con las cookies ya puestas por la respuesta de login, precargamos el
      // bundle + RSC del dashboard (el guard del middleware ya lo deja pasar)
      // para que el replace navegue contra caché caliente.
      router.prefetch(target);
      // Sin router.refresh(): replace ya pide el RSC del dashboard.
      startTransition(() => {
        router.replace(target);
      });
    } catch {
      setError("No se pudo conectar con el servidor.");
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="relative z-10 w-full max-w-[22rem] sm:max-w-sm"
    >
      <header className="mb-8 text-center sm:mb-10">
        <BrandLogoAnimated
          animationKey="login"
          innerClassName="relative flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-3"
          symbolClassName="h-11 w-auto opacity-95 sm:h-10"
          title="TOTAL LIVING"
          titleClassName="font-cormorant text-[1.75rem] font-light tracking-[0.12em] text-tl-beige sm:text-3xl"
        />
        <p className="mt-5 font-outfit text-[10px] font-light uppercase tracking-[0.32em] text-tl-gold/90 sm:text-[11px]">
          Acceso
        </p>
      </header>

      <div className="space-y-5">
        <label className="block">
          <span className="mb-2 block font-outfit text-[10px] font-light uppercase tracking-[0.28em] text-tl-gold/85">
            Usuario
          </span>
          <input
            name="username"
            autoComplete="username"
            inputMode="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={busy}
            className={cn(
              "login-field min-h-12 w-full appearance-none rounded-xl border border-tl-beige/25",
              "bg-white/[0.06] px-4 py-3 backdrop-blur-md",
              "font-outfit text-base font-extralight text-tl-beige outline-none",
              "placeholder:text-tl-beige/35",
              "transition-[border-color,background-color,box-shadow]",
              "focus:border-tl-gold/55 focus:bg-white/[0.09] focus:shadow-[0_0_0_1px_rgba(214,181,133,0.2)]",
              "[color-scheme:dark]",
            )}
            placeholder="Tu usuario"
            required
          />
        </label>

        <label className="block">
          <span className="mb-2 block font-outfit text-[10px] font-light uppercase tracking-[0.28em] text-tl-gold/85">
            Contraseña
          </span>
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={busy}
            className={cn(
              "login-field min-h-12 w-full appearance-none rounded-xl border border-tl-beige/25",
              "bg-white/[0.06] px-4 py-3 backdrop-blur-md",
              "font-outfit text-base font-extralight text-tl-beige outline-none",
              "placeholder:text-tl-beige/35",
              "transition-[border-color,background-color,box-shadow]",
              "focus:border-tl-gold/55 focus:bg-white/[0.09] focus:shadow-[0_0_0_1px_rgba(214,181,133,0.2)]",
              "[color-scheme:dark]",
            )}
            placeholder="Tu contraseña"
            required
          />
        </label>
      </div>

      {error ? (
        <p
          role="alert"
          className="mt-5 font-outfit text-sm font-extralight text-red-300/95"
        >
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={busy}
        className={cn(
          "mt-8 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-tl-gold px-6 font-outfit text-xs font-light uppercase tracking-[0.18em] text-tl-black transition-opacity",
          "hover:opacity-90 active:opacity-80 disabled:cursor-not-allowed disabled:opacity-55",
        )}
      >
        {busy ? (
          <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} />
        ) : null}
        {busy ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}

function LoginBackdrop() {
  const [enabled, setEnabled] = useState(false);
  const [ballCount, setBallCount] = useState(120);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const narrow = window.matchMedia("(max-width: 640px)");

    const sync = () => {
      setEnabled(!reduce.matches);
      setBallCount(narrow.matches ? 70 : 140);
    };

    sync();
    reduce.addEventListener("change", sync);
    narrow.addEventListener("change", sync);
    return () => {
      reduce.removeEventListener("change", sync);
      narrow.removeEventListener("change", sync);
    };
  }, []);

  const showBallpit = enabled && !failed;

  return (
    <div aria-hidden className="absolute inset-0">
      <div className="absolute inset-0 bg-[#0c0c0a]" />
      {showBallpit ? (
        <div className="absolute inset-0 min-h-dvh w-full">
          <Ballpit
            className="h-full min-h-dvh w-full"
            count={ballCount}
            gravity={0.55}
            friction={0.997}
            wallBounce={0.92}
            followCursor={false}
            colors={BALLPIT_COLORS}
            ambientColor={0xf2ece0}
            ambientIntensity={0.55}
            lightIntensity={160}
            minSize={0.45}
            maxSize={0.95}
            maxPixelRatio={1.5}
            onError={() => setFailed(true)}
          />
        </div>
      ) : (
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(214,181,133,0.18),transparent_55%),radial-gradient(ellipse_at_70%_80%,rgba(74,78,56,0.35),transparent_50%)]" />
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="relative flex min-h-dvh items-start justify-center overflow-hidden bg-[#0c0c0a] px-5 pb-12 pt-[10vh] font-outfit sm:px-8 sm:pb-16 sm:pt-[12vh]">
      <LoginBackdrop />

      <div className="relative z-10 w-full max-w-[22rem] sm:max-w-sm">
        <Suspense
          fallback={
            <p className="text-center font-outfit text-sm text-tl-beige/50">
              Cargando…
            </p>
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
