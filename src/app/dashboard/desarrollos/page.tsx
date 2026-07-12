import Link from "next/link";

const MODULES = [
  {
    href: "/dashboard/desarrollos/textos",
    title: "Editar textos",
    description:
      "Hero, mensaje vacío y SEO del listado público de desarrollos.",
  },
  {
    href: "/dashboard/desarrollos/catalogo",
    title: "Agregar / gestionar desarrollos",
    description:
      "Alta, edición y publicación de proyectos en la base de datos.",
  },
] as const;

export default function DashboardDesarrollosHubPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="font-outfit text-[10px] uppercase tracking-[0.22em] text-tl-gold/80">
          Módulo
        </p>
        <h1 className="mt-2 font-outfit text-4xl font-extralight text-tl-beige">
          Desarrollos
        </h1>
        <p className="mt-3 max-w-2xl font-outfit text-sm font-light leading-relaxed text-tl-beige/60">
          Fase 1: conexión sólida. El módulo se divide en textos del listado y
          el catálogo de proyectos (CRUD).
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {MODULES.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-2xl border border-tl-gold/20 bg-[#0a0a0a]/70 p-6 transition-colors hover:border-tl-gold/45"
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
