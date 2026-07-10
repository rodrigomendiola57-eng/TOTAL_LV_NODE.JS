import { Globe, Inbox, StickyNote } from "lucide-react";

export default function DashboardSettingsPage() {
  return (
    <div className="space-y-8">
      <header>
        <p className="font-outfit font-light text-[10px] uppercase tracking-[0.22em] text-tl-gold">
          Configuración
        </p>
        <h1 className="mt-2 font-cormorant text-4xl font-light text-tl-beige">
          CRM web
        </h1>
        <p className="mt-2 max-w-2xl font-outfit font-light text-sm text-tl-beige/65">
          Este módulo recibe leads únicamente desde el formulario de contacto
          del sitio público.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-2xl border border-tl-gold/20 bg-tl-black/60 p-6">
          <Globe className="h-5 w-5 text-tl-gold/70" strokeWidth={1.25} />
          <h2 className="mt-4 font-outfit font-light text-sm text-tl-beige">
            Formulario de contacto
          </h2>
          <p className="mt-2 font-outfit font-light text-xs leading-relaxed text-tl-beige/55">
            Cada envío crea un lead con estatus Nuevo y aparece en la bandeja
            del CRM con la consulta del visitante.
          </p>
          <p className="mt-4 break-all font-mono text-[10px] text-tl-gold/80">
            POST /api/leads/
          </p>
        </article>

        <article className="rounded-2xl border border-tl-gold/20 bg-tl-black/60 p-6">
          <StickyNote className="h-5 w-5 text-tl-gold/70" strokeWidth={1.25} />
          <h2 className="mt-4 font-outfit font-light text-sm text-tl-beige">
            Notas internas
          </h2>
          <p className="mt-2 font-outfit font-light text-xs leading-relaxed text-tl-beige/55">
            Desde el CRM puedes registrar seguimiento por lead. Las notas son
            solo para el equipo; no se envían al visitante.
          </p>
        </article>

        <article className="rounded-2xl border border-tl-gold/20 bg-tl-black/60 p-6 lg:col-span-2">
          <Inbox className="h-5 w-5 text-tl-gold/70" strokeWidth={1.25} />
          <h2 className="mt-4 font-outfit font-light text-sm text-tl-beige">
            Flujo recomendado
          </h2>
          <ol className="mt-3 space-y-2 font-outfit text-xs font-light leading-relaxed text-tl-beige/55">
            <li>1. Revisa leads nuevos en la bandeja.</li>
            <li>2. Contacta al prospecto por teléfono o correo.</li>
            <li>3. Cambia el estatus según avance la negociación.</li>
            <li>4. Deja notas internas para el resto del equipo.</li>
          </ol>
        </article>
      </div>
    </div>
  );
}
