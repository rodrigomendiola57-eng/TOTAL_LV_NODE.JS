"""
Defaults del singleton AsesoriaPage.
Espejo de ASESORIA_PAGE_DEFAULT en src/lib/data/asesoria.ts
(tabs/pillars en camelCase para alinear con el frontend público).
"""

ASESORIA_PAGE_DEFAULTS = {
    "hero_eyebrow": "Total Living · Asesoría",
    "hero_title": "Asesoría inmobiliaria",
    "hero_subtitle": (
        "Te acompañamos a comprar, vender o invertir con criterio: "
        "opciones claras, datos reales y un asesor dedicado en cada paso."
    ),
    "hero_image_external_url": (
        "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d"
        "?q=80&w=2070&auto=format&fit=crop"
    ),
    "services_title": "Servicios de Asesoría Inmobiliaria",
    "tabs": [
        {
            "id": "compra",
            "tabLabel": "Compra",
            "title": "Asesoría de compra",
            "description": (
                "De un mercado saturado de opciones a una ruta clara: "
                "perfilamos tu búsqueda, filtramos con criterio y te "
                "acompañamos hasta la firma."
            ),
            "whatsappMessage": (
                "Hola, me interesa la asesoría de compra de Total Living."
            ),
            "process": [
                {
                    "id": "brief",
                    "title": "Brief estratégico",
                    "description": (
                        "Presupuesto, zona, estilo de vida y horizonte. "
                        "Definimos qué sí y qué no."
                    ),
                },
                {
                    "id": "shortlist",
                    "title": "Shortlist curada",
                    "description": (
                        "Solo propiedades que cumplen el brief. "
                        "Sin ruido, sin tours innecesarios."
                    ),
                },
                {
                    "id": "visitas",
                    "title": "Visitas con criterio",
                    "description": (
                        "Recorridos enfocados, lectura de plusvalía "
                        "y comparación objetiva."
                    ),
                },
                {
                    "id": "cierre",
                    "title": "Negociación y cierre",
                    "description": (
                        "Oferta, revisión documental y acompañamiento "
                        "notarial hasta la escritura."
                    ),
                },
            ],
            "features": [
                {
                    "icon": "Search",
                    "title": "Filtrado inteligente",
                    "description": (
                        "Cruzamos presupuesto, zona y estilo de vida "
                        "para llegar solo a lo que sí hace sentido."
                    ),
                    "detail": "Shortlist curada · sin ruido",
                },
                {
                    "icon": "FileCheck",
                    "title": "Acompañamiento documental",
                    "description": (
                        "Revisión legal y notarial de punta a punta, "
                        "sin sorpresas ni letras pequeñas."
                    ),
                    "detail": "Due diligence · cierre seguro",
                },
                {
                    "icon": "Handshake",
                    "title": "Negociación táctica",
                    "description": (
                        "Defendemos tu presupuesto con datos de mercado, "
                        "no con intuición."
                    ),
                    "detail": "Comparables · oferta óptima",
                },
                {
                    "icon": "MapPin",
                    "title": "Lectura de zona",
                    "description": (
                        "Plusvalía, conectividad y proyección real "
                        "en Querétaro antes de decidir."
                    ),
                    "detail": "Contexto local · plusvalía",
                },
            ],
        },
        {
            "id": "venta",
            "tabLabel": "Venta",
            "title": "Asesoría de venta",
            "description": (
                "Posicionamos tu propiedad para vender al precio justo, "
                "en el tiempo correcto — con estrategia, no con prisa."
            ),
            "whatsappMessage": (
                "Hola, quiero una asesoría de venta con Total Living."
            ),
            "process": [
                {
                    "id": "valoracion",
                    "title": "Valoración real",
                    "description": (
                        "Comparables, absorción y precio de salida "
                        "que el mercado sí paga."
                    ),
                },
                {
                    "id": "preparacion",
                    "title": "Preparación",
                    "description": (
                        "Staging, narrativa y assets visuales para "
                        "destacar desde el primer scroll."
                    ),
                },
                {
                    "id": "exposicion",
                    "title": "Exposición selectiva",
                    "description": (
                        "Canales premium y filtro de prospectos: "
                        "menos visitas, más calidad."
                    ),
                },
                {
                    "id": "negociacion",
                    "title": "Negociación y cierre",
                    "description": (
                        "Ofertas, contraofertas y acompañamiento "
                        "hasta la firma notarial."
                    ),
                },
            ],
            "features": [
                {
                    "icon": "LineChart",
                    "title": "Valoración estratégica",
                    "description": (
                        "Precio de salida basado en comparables reales, "
                        "no en cifras optimistas."
                    ),
                    "detail": "Pricing · absorción",
                },
                {
                    "icon": "Sparkles",
                    "title": "Marketing premium",
                    "description": (
                        "Fotografía, narrativa y medios de alto nivel "
                        "para propiedades que compiten por atención."
                    ),
                    "detail": "Story · visuales",
                },
                {
                    "icon": "Users",
                    "title": "Perfilamiento de prospectos",
                    "description": (
                        "Filtramos interesados reales antes de abrir "
                        "la puerta de tu propiedad."
                    ),
                    "detail": "Calidad · no volumen",
                },
                {
                    "icon": "Handshake",
                    "title": "Negociación con datos",
                    "description": (
                        "Defendemos tu precio con evidencia de mercado "
                        "y timing, no con presión."
                    ),
                    "detail": "Oferta · cierre",
                },
            ],
        },
        {
            "id": "inversion",
            "tabLabel": "Inversión",
            "title": "Asesoría de inversión",
            "description": (
                "Leemos el mercado antes de que se mueva, "
                "para que tu capital llegue primero."
            ),
            "whatsappMessage": (
                "Hola, quiero asesoría de inversión inmobiliaria "
                "con Total Living."
            ),
            "process": [],
            "features": [
                {
                    "icon": "TrendingUp",
                    "title": "Oferta y demanda",
                    "description": (
                        "Identificamos zonas con presión de demanda "
                        "real antes de que suban de precio."
                    ),
                },
                {
                    "icon": "Target",
                    "title": "Estrategia de colocación",
                    "description": (
                        "Definimos el momento y el canal correctos "
                        "para vender o rentar con ventaja."
                    ),
                },
                {
                    "icon": "PiggyBank",
                    "title": "Maximización de ROI",
                    "description": (
                        "Modelamos plusvalía, renta y horizonte de "
                        "salida antes de comprometer capital."
                    ),
                },
            ],
        },
    ],
    "pillars": [
        {
            "id": "analisis",
            "title": "Análisis de mercado",
            "description": (
                "Datos y contexto local de Querétaro antes de "
                "cada recomendación."
            ),
        },
        {
            "id": "acompanamiento",
            "title": "Acompañamiento",
            "description": (
                "Un asesor dedicado, disponible en cada etapa del proceso."
            ),
        },
        {
            "id": "resultado",
            "title": "Resultado",
            "description": (
                "Priorizamos decisiones que mueven tu patrimonio, "
                "no volumen de opciones."
            ),
        },
    ],
    "cta_title": "¿Listo para trazar tu ruta?",
    "cta_subtitle": (
        "Una primera conversación sin costo para entender tu objetivo "
        "y proponer el siguiente paso."
    ),
    "cta_label": "Contactar a un asesor",
    "cta_whatsapp_message": (
        "Hola, quiero agendar una asesoría inmobiliaria con Total Living."
    ),
    "is_published": True,
}
