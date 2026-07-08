"use client";

interface PropertyCatalogErrorProps {
  reset: () => void;
}

export function PropertyCatalogError({ reset }: PropertyCatalogErrorProps) {
  return (
    <main className="flex min-h-[70vh] flex-1 flex-col items-center justify-center bg-tl-black px-4 pt-24 text-center sm:px-6">
      <p className="font-outfit font-light text-[10px] uppercase tracking-[0.24em] text-tl-gold">
        Total Living
      </p>
      <h1 className="mt-4 font-cormorant text-4xl font-light text-tl-beige sm:text-5xl">
        No pudimos cargar el catálogo
      </h1>
      <p className="mt-4 max-w-lg font-outfit font-light text-sm leading-relaxed text-tl-beige/70">
        Hubo un problema al conectar con nuestro servidor. Verifica que el
        backend esté activo e inténtalo de nuevo.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-8 rounded-full border border-tl-gold bg-tl-gold px-6 py-3 font-outfit font-light text-xs uppercase tracking-[0.16em] text-tl-black transition-opacity hover:opacity-90"
      >
        Reintentar conexión
      </button>
    </main>
  );
}
