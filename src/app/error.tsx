"use client";

interface HomeErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: HomeErrorProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-tl-black px-6 text-center">
      <p className="font-outfit font-light text-xs uppercase tracking-[0.25em] text-tl-gold">
        Total Living
      </p>
      <h2 className="mt-3 font-cormorant text-4xl font-light text-tl-beige sm:text-5xl">
        Tuvimos un problema cargando las propiedades
      </h2>
      <p className="mt-4 max-w-xl font-outfit font-light text-sm text-tl-beige/80">
        Intenta nuevamente en unos segundos. Si el problema persiste, revisa la
        conexión con el backend.
      </p>
      <button
        onClick={reset}
        className="mt-8 rounded-full border border-tl-gold px-6 py-3 font-outfit font-light text-xs uppercase tracking-[0.18em] text-tl-gold transition-colors hover:bg-tl-gold hover:text-tl-black"
        type="button"
      >
        Reintentar
      </button>
      {error.digest ? (
        <p className="mt-4 font-outfit font-light text-xs text-tl-olive/80">
          Código de error: {error.digest}
        </p>
      ) : null}
    </main>
  );
}
