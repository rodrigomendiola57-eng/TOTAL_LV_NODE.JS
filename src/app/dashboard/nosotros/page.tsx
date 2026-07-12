import Link from "next/link";

const MODULES = [
  {
    href: "/dashboard/nosotros/textos",
    title: "Editar textos",
    description:
      "Filosofía, valores, misión, visión, CTA e imágenes de la página pública /nosotros.",
  },
  {
    href: "/dashboard/nosotros/equipo",
    title: "Editar equipo Total Living",
    description:
      "Alta y edición de asesores y directivos: foto, bio y redes sociales.",
  },
] as const;

export default function DashboardNosotrosHubPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="font-outfit text-[10px] uppercase tracking-[0.22em] text-tl-gold/80">
          Módulo
        </p>
        <h1 className="mt-2 font-outfit text-4xl font-extralight text-tl-beige">
          Nosotros
        </h1>
        <p className="mt-3 max-w-2xl font-outfit text-sm font-light leading-relaxed text-tl-beige/60">
          Textos de la página e información del equipo. Ambos alimentan{" "}
          <span className="text-tl-beige/80">/nosotros</span>.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {MODULES.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-2xl border border-tl-gold/20 bg-[#0a0a0a] p-6 transition-colors hover:border-tl-gold/45"
          >
            <h2 className="font-outfit text-2xl font-extralight text-tl-beige">
              {item.title}
            </h2>
            <p className="mt-2 font-outfit text-sm font-light text-tl-beige/55">
              {item.description}
            </p>
            <p className="mt-5 font-outfit text-[10px] uppercase tracking-[0.16em] text-tl-gold">
              Abrir →
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
