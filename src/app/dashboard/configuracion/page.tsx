import { Settings } from "lucide-react";

const SETTINGS_SECTIONS = [
  {
    title: "Cuenta y acceso",
    description: "Gestión de usuarios administrativos y permisos del panel.",
  },
  {
    title: "Integraciones",
    description: "WhatsApp Business API, Meta Ads y webhooks del sitio público.",
  },
  {
    title: "Notificaciones",
    description: "Alertas de nuevos leads, propiedades destacadas y seguimiento CRM.",
  },
];

export default function DashboardSettingsPage() {
  return (
    <div className="space-y-8">
      <header>
        <p className="font-outfit font-light text-[10px] uppercase tracking-[0.22em] text-tl-gold">
          Configuración
        </p>
        <h1 className="mt-2 font-cormorant text-4xl font-light text-tl-beige">
          Ajustes del Panel
        </h1>
        <p className="mt-2 max-w-2xl font-outfit font-light text-sm text-tl-beige/65">
          Personaliza la operación del dashboard administrativo y las
          integraciones omnicanal.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        {SETTINGS_SECTIONS.map((section) => (
          <article
            key={section.title}
            className="rounded-2xl border border-tl-gold/20 bg-tl-black/60 p-6"
          >
            <Settings className="h-5 w-5 text-tl-gold/70" strokeWidth={1.25} />
            <h2 className="mt-4 font-outfit font-light text-sm text-tl-beige">
              {section.title}
            </h2>
            <p className="mt-2 font-outfit font-light text-xs leading-relaxed text-tl-beige/55">
              {section.description}
            </p>
            <p className="mt-4 font-outfit font-light text-[10px] uppercase tracking-[0.14em] text-tl-gold/70">
              Próximamente
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
