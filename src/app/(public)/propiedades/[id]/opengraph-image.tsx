import { getPropertyById } from "@/lib/api";
import { formatPrice } from "@/lib/format-price";
import { resolveMediaUrl } from "@/lib/media-url";
import { absoluteSiteUrl } from "@/lib/site-url";
import { formatPropertyLocation } from "@/types/property";
import { ImageResponse } from "next/og";

export const alt = "Mira esta propiedad en Total Living";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface OpenGraphImageProps {
  params: Promise<{ id: string }>;
}

export default async function Image({ params }: OpenGraphImageProps) {
  const { id } = await params;
  const property = await getPropertyById(id);

  const title = property?.title ?? "Propiedad";
  const location = property ? formatPropertyLocation(property) : "Total Living";
  const price = property
    ? formatPrice(property.price, property.currency)
    : "";
  const operation = property?.operation_type ?? "Propiedad";

  const coverRaw =
    resolveMediaUrl(property?.cover_image_url) ?? property?.cover_image_url;
  const coverUrl = coverRaw ? absoluteSiteUrl(coverRaw) : null;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          backgroundColor: "#1a1a18",
          fontFamily: "sans-serif",
        }}
      >
        {coverUrl ? (
          <img
            src={coverUrl}
            alt=""
            width={1200}
            height={630}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : null}

        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(115deg, rgba(26,26,24,0.92) 0%, rgba(26,26,24,0.72) 42%, rgba(26,26,24,0.35) 100%)",
            display: "flex",
          }}
        />

        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
            padding: "52px 56px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                color: "#D6B585",
                fontSize: 22,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                fontWeight: 300,
              }}
            >
              Total Living
            </div>
            <div
              style={{
                color: "#F2ECE0",
                fontSize: 28,
                fontWeight: 300,
                letterSpacing: "0.02em",
                opacity: 0.88,
              }}
            >
              Mira esta propiedad
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 760 }}>
            <div
              style={{
                display: "flex",
                color: "#F2ECE0",
                fontSize: title.length > 48 ? 42 : 52,
                fontWeight: 300,
                lineHeight: 1.12,
                letterSpacing: "-0.01em",
              }}
            >
              {title.length > 70 ? `${title.slice(0, 67)}…` : title}
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 12,
                alignItems: "center",
                color: "#D6B585",
                fontSize: 24,
                fontWeight: 300,
                letterSpacing: "0.04em",
              }}
            >
              <span>{operation}</span>
              <span style={{ opacity: 0.45 }}>·</span>
              <span style={{ color: "#F2ECE0", opacity: 0.72 }}>{location}</span>
            </div>

            {price ? (
              <div
                style={{
                  display: "flex",
                  color: "#D6B585",
                  fontSize: 40,
                  fontWeight: 300,
                  letterSpacing: "0.01em",
                }}
              >
                {price}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
