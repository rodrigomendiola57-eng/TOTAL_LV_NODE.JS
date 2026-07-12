"use client";

import { BrandLogoAnimated } from "@/components/layout/BrandLogoAnimated";
import { cn } from "@/lib/utils";
import { Loader2, Lock } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/dashboard";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
        return;
      }

      const target =
        nextPath.startsWith("/dashboard") ? nextPath : "/dashboard";
      router.replace(target);
      router.refresh();
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-md rounded-2xl border border-tl-gold/20 bg-black/40 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-md sm:p-8"
    >
      <div className="mb-8 flex flex-col items-center text-center">
        <BrandLogoAnimated
          animationKey="login"
          innerClassName="relative flex items-center gap-2.5"
          symbolClassName="h-9 w-auto opacity-95"
          title="TOTAL LIVING"
          titleClassName="font-cormorant text-2xl font-light tracking-[0.08em] text-tl-beige"
        />
        <div
          aria-hidden
          className="mt-4 h-px w-24 bg-gradient-to-r from-transparent via-tl-gold/70 to-transparent"
        />
        <p className="mt-4 font-outfit text-[11px] font-light uppercase tracking-[0.28em] text-tl-gold/90">
          Panel Admin
        </p>
        <p className="mt-2 font-outfit text-sm font-extralight text-tl-beige/60">
          Acceso exclusivo para el equipo Total Living
        </p>
      </div>

      <label className="block">
        <span className="font-outfit text-[11px] font-light uppercase tracking-[0.16em] text-tl-beige/50">
          Usuario
        </span>
        <input
          name="username"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 font-outfit text-base font-extralight text-tl-beige outline-none transition-colors placeholder:text-tl-beige/30 focus:border-tl-gold/40"
          placeholder="usuario"
          required
        />
      </label>

      <label className="mt-4 block">
        <span className="font-outfit text-[11px] font-light uppercase tracking-[0.16em] text-tl-beige/50">
          Contraseña
        </span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 font-outfit text-base font-extralight text-tl-beige outline-none transition-colors placeholder:text-tl-beige/30 focus:border-tl-gold/40"
          placeholder="••••••••"
          required
        />
      </label>

      {error ? (
        <p
          role="alert"
          className="mt-4 rounded-xl border border-red-400/30 bg-red-500/10 px-3 py-2.5 font-outfit text-sm font-extralight text-red-200/90"
        >
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className={cn(
          "mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-tl-gold bg-tl-gold px-6 font-outfit text-xs font-light uppercase tracking-[0.16em] text-tl-black transition-colors",
          "hover:bg-[#e2c59a] disabled:cursor-not-allowed disabled:opacity-60",
        )}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} />
        ) : (
          <Lock className="h-4 w-4" strokeWidth={1.5} />
        )}
        {loading ? "Entrando…" : "Entrar al panel"}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#0a0a0a] px-4 py-10 font-outfit">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#0a0a0a_0%,#161812_45%,#0a0a0a_100%)]" />
        <div className="absolute left-1/2 top-[-20%] h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(214,181,133,0.12),transparent_70%)] blur-3xl" />
      </div>

      <Suspense
        fallback={
          <div className="font-outfit text-sm text-tl-beige/50">Cargando…</div>
        }
      >
        <LoginForm />
      </Suspense>
    </main>
  );
}
