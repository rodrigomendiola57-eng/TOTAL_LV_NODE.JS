"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  forwardRef,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  type RefObject,
} from "react";
import { Color, Mesh, type ShaderMaterial } from "three";

function hexToNormalizedRGB(hex: string): [number, number, number] {
  const normalized = hex.replace("#", "");
  return [
    parseInt(normalized.slice(0, 2), 16) / 255,
    parseInt(normalized.slice(2, 4), 16) / 255,
    parseInt(normalized.slice(4, 6), 16) / 255,
  ];
}

const vertexShader = `
varying vec2 vUv;
varying vec3 vPosition;

void main() {
  vPosition = position;
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
varying vec2 vUv;
varying vec3 vPosition;

uniform float uTime;
uniform vec3  uColor;
uniform float uSpeed;
uniform float uScale;
uniform float uRotation;
uniform float uNoiseIntensity;

const float e = 2.71828182845904523536;

float noise(vec2 texCoord) {
  float G = e;
  vec2  r = (G * sin(G * texCoord));
  return fract(r.x * r.y * (1.0 + texCoord.x));
}

vec2 rotateUvs(vec2 uv, float angle) {
  float c = cos(angle);
  float s = sin(angle);
  mat2  rot = mat2(c, -s, s, c);
  return rot * uv;
}

void main() {
  float rnd        = noise(gl_FragCoord.xy);
  vec2  uv         = rotateUvs(vUv * uScale, uRotation);
  vec2  tex        = uv * uScale;
  float tOffset    = uSpeed * uTime;

  tex.y += 0.03 * sin(8.0 * tex.x - tOffset);

  float pattern = 0.6 +
                  0.4 * sin(5.0 * (tex.x + tex.y +
                                   cos(3.0 * tex.x + 5.0 * tex.y) +
                                   0.02 * tOffset) +
                           sin(20.0 * (tex.x + tex.y - 0.1 * tOffset)));

  vec4 col = vec4(uColor, 1.0) * vec4(pattern) - rnd / 15.0 * uNoiseIntensity;
  col.a = 1.0;
  gl_FragColor = col;
}
`;

interface SilkUniforms {
  uSpeed: { value: number };
  uScale: { value: number };
  uNoiseIntensity: { value: number };
  uColor: { value: Color };
  uRotation: { value: number };
  uTime: { value: number };
}

interface SilkPlaneProps {
  uniforms: SilkUniforms;
}

/**
 * Mantiene el plano a tamaño del viewport y fuerza redibujo tras resize.
 * Sin esto, al navegar/volver el buffer WebGL puede quedar con una franja
 * vertical “rota” (tamaño viejo + CSS estirado o píxeles sin limpiar).
 */
const SilkPlane = forwardRef<Mesh, SilkPlaneProps>(function SilkPlane(
  { uniforms },
  ref,
) {
  const { viewport, size, invalidate, gl } = useThree();
  const meshRef = ref as RefObject<Mesh | null>;

  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    mesh.scale.set(viewport.width, viewport.height, 1);

    // Asegura que el drawing buffer coincida con el tamaño medido.
    if (size.width > 0 && size.height > 0) {
      gl.setSize(size.width, size.height, false);
    }

    invalidate();
  }, [meshRef, viewport.width, viewport.height, size.width, size.height, gl, invalidate]);

  useFrame((_, delta) => {
    const material = meshRef.current?.material as ShaderMaterial | undefined;
    if (!material?.uniforms?.uTime) return;
    material.uniforms.uTime.value += 0.1 * delta;
  });

  return (
    <mesh ref={ref}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial
        uniforms={uniforms as unknown as Record<string, { value: unknown }>}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
});

/** Tras montar / volver a la pestaña, fuerza 1–2 frames para asentar el tamaño. */
function SilkMountSync({ paused }: { paused: boolean }) {
  const { invalidate } = useThree();

  useEffect(() => {
    let frame2 = 0;
    const frame1 = window.requestAnimationFrame(() => {
      invalidate();
      frame2 = window.requestAnimationFrame(() => invalidate());
    });

    const onVisible = () => {
      if (!document.hidden) invalidate();
    };

    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("pageshow", onVisible);

    return () => {
      window.cancelAnimationFrame(frame1);
      window.cancelAnimationFrame(frame2);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("pageshow", onVisible);
    };
  }, [invalidate]);

  useEffect(() => {
    // Al reanudar animación o al pausar con "demand", pinta un frame limpio.
    invalidate();
  }, [paused, invalidate]);

  return null;
}

export interface SilkProps {
  speed?: number;
  scale?: number;
  color?: string;
  noiseIntensity?: number;
  rotation?: number;
  paused?: boolean;
  /** DPR del canvas. En móvil conviene 1 para rendimiento. */
  dpr?: number | [number, number];
  className?: string;
}

export function Silk({
  speed = 5,
  scale = 1,
  color = "#4A4E38",
  noiseIntensity = 1.5,
  rotation = 0,
  paused = false,
  dpr = [1, 1.25],
  className,
}: SilkProps) {
  const meshRef = useRef<Mesh>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const uniforms = useMemo<SilkUniforms>(
    () => ({
      uSpeed: { value: speed },
      uScale: { value: scale },
      uNoiseIntensity: { value: noiseIntensity },
      uColor: { value: new Color(...hexToNormalizedRGB(color)) },
      uRotation: { value: rotation },
      uTime: { value: 0 },
    }),
    [speed, scale, noiseIntensity, color, rotation],
  );

  useEffect(() => {
    const node = containerRef.current;
    if (!node || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(() => {
      window.dispatchEvent(new Event("resize"));
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={className} aria-hidden>
      <Canvas
        dpr={dpr}
        frameloop={paused ? "demand" : "always"}
        resize={{ scroll: true, debounce: { scroll: 50, resize: 0 } }}
        gl={{
          antialias: false,
          powerPreference: "high-performance",
          alpha: false,
          preserveDrawingBuffer: false,
        }}
        style={{ width: "100%", height: "100%", display: "block" }}
        onCreated={({ gl, invalidate: inv }) => {
          gl.setClearColor(new Color(...hexToNormalizedRGB(color)), 1);
          inv();
        }}
      >
        <SilkMountSync paused={paused} />
        <SilkPlane ref={meshRef} uniforms={uniforms} />
      </Canvas>
    </div>
  );
}
