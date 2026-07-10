import { AboutHeroVideo } from "@/components/about/AboutHeroVideo";

export function AboutHero() {
  return (
    <section
      className="relative h-[100svh] min-h-[100svh] w-full overflow-hidden lg:h-[100dvh] lg:min-h-[100dvh]"
      aria-label="Video institucional Total Living"
    >
      <AboutHeroVideo />
    </section>
  );
}