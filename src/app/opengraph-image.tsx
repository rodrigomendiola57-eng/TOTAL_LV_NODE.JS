import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Total Living | Inmobiliaria Premium en Querétaro";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const icon = await readFile(join(process.cwd(), "src/app/icon.svg"));
  const iconSrc = `data:image/svg+xml;base64,${icon.toString("base64")}`;

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
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 18% 20%, rgba(214,181,133,0.18) 0%, rgba(26,26,24,0) 46%), linear-gradient(125deg, #1a1a18 0%, #24231f 55%, #161614 100%)",
            display: "flex",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 8,
            height: "100%",
            background: "#D6B585",
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
            padding: "56px 72px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
            <img
              src={iconSrc}
              alt=""
              width={88}
              height={88}
              style={{ borderRadius: 88 }}
            />
            <div
              style={{
                display: "flex",
                color: "#D6B585",
                fontSize: 22,
                letterSpacing: "0.34em",
                textTransform: "uppercase",
                fontWeight: 300,
              }}
            >
              Total Living
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 22, maxWidth: 860 }}>
            <div
              style={{
                display: "flex",
                color: "#F2ECE0",
                fontSize: 64,
                fontWeight: 300,
                lineHeight: 1.08,
                letterSpacing: "-0.02em",
              }}
            >
              Inmobiliaria premium en Querétaro
            </div>
            <div
              style={{
                display: "flex",
                color: "#D6B585",
                fontSize: 28,
                fontWeight: 300,
                letterSpacing: "0.04em",
                opacity: 0.92,
              }}
            >
              Venta · Renta · Desarrollos · Inversión
            </div>
          </div>

          <div
            style={{
              display: "flex",
              color: "#F2ECE0",
              fontSize: 22,
              fontWeight: 300,
              letterSpacing: "0.08em",
              opacity: 0.55,
            }}
          >
            totalliving.mx
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
