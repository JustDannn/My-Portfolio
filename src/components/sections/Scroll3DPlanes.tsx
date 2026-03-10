"use client";

import {
  motion,
  useScroll,
  useTransform,
  useVelocity,
  useSpring,
} from "motion/react";
import { useRef } from "react";
import Image from "next/image";
import { projects } from "@/data/content";

function PlaneCard({
  project,
  index,
}: {
  project: (typeof projects)[0];
  index: number;
}) {
  return (
    <div
      className="relative h-[420px] w-[340px] flex-shrink-0 overflow-hidden rounded-xl md:h-[520px] md:w-[400px] lg:h-[580px] lg:w-[450px]"
      data-cursor-hover
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Image fill */}
      <Image
        src={project.image}
        alt={project.title}
        fill
        className="object-cover"
        sizes="(max-width:768px) 340px, (max-width:1024px) 400px, 450px"
      />

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Index number — top-left */}
      <span className="absolute top-5 left-6 font-mono text-sm font-medium text-white/70">
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Title — bottom-right */}
      <div className="absolute right-6 bottom-6 left-6 text-right">
        <h3 className="text-xl font-bold leading-snug text-white md:text-2xl">
          {project.title}
        </h3>
        <div className="mt-2 flex flex-wrap justify-end gap-1.5">
          {project.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/20 px-2.5 py-0.5 text-[10px] font-medium text-white/60"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Color accent stripe at bottom */}
      <div
        className="absolute bottom-0 left-0 h-1 w-full"
        style={{ backgroundColor: project.color }}
      />
    </div>
  );
}

export function Scroll3DPlanes() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll progress across the tall container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // --- Velocity chain ---
  const scrollVelocity = useVelocity(scrollYProgress);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 40,
    stiffness: 300,
  });

  // --- Horizontal translation: scroll down → move track left ---
  const trackX = useTransform(scrollYProgress, [0, 1], ["0%", "-70%"]);

  // --- 3D velocity transforms ---
  // rotateY: fast scroll tilts the cards like opening doors
  const rotateY = useTransform(smoothVelocity, [-0.08, 0, 0.08], [25, 0, -25]);
  // rotateZ: slight chaotic tilt
  const rotateZ = useTransform(smoothVelocity, [-0.08, 0, 0.08], [-3, 0, 3]);
  // skewX: motion blur illusion
  const skewX = useTransform(smoothVelocity, [-0.08, 0, 0.08], [-6, 0, 6]);

  // --- Background title parallax ---
  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);
  const titleOpacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [0.04, 0.06, 0.06, 0.03],
  );

  return (
    <section
      id="works"
      ref={containerRef}
      className="relative h-[300vh] bg-bg-dark"
    >
      {/* Sticky viewport */}
      <div className="sticky top-0 flex h-screen items-center overflow-hidden [perspective:1000px]">
        {/* Background typography */}
        <motion.div
          className="pointer-events-none absolute inset-0 flex items-center justify-center select-none"
          style={{ y: titleY }}
        >
          <motion.h2
            className="whitespace-nowrap text-[7rem] font-black uppercase leading-none tracking-tighter text-white md:text-[11rem] lg:text-[15rem]"
            style={{ opacity: titleOpacity }}
          >
            LATEST WORKS ({String(projects.length).padStart(2, "0")})
          </motion.h2>
        </motion.div>

        {/* Small label top-left */}
        <div className="absolute top-8 left-8 z-10 md:top-12 md:left-12">
          <span className="mb-1 block text-xs font-medium uppercase tracking-widest text-primary">
            Portfolio
          </span>
          <span className="text-sm text-white/40">Selected Projects</span>
        </div>

        {/* Card count top-right */}
        <div className="absolute top-8 right-8 z-10 md:top-12 md:right-12">
          <span className="font-mono text-sm text-white/30">
            {String(projects.length).padStart(2, "0")} Projects
          </span>
        </div>

        {/* Horizontal track with 3D velocity transforms */}
        <motion.div
          className="flex items-center gap-5 pl-[10vw] md:gap-8"
          style={{
            x: trackX,
            rotateY,
            rotateZ,
            skewX,
            transformStyle: "preserve-3d",
          }}
        >
          {projects.map((project, i) => (
            <PlaneCard key={project.id} project={project} index={i} />
          ))}

          {/* Ghost spacer so the last card can be centered */}
          <div className="w-[30vw] flex-shrink-0" />
        </motion.div>

        {/* Scroll progress indicator */}
        <div className="absolute bottom-8 left-8 right-8 md:bottom-12 md:left-12 md:right-12">
          <div className="h-[1px] w-full bg-white/10">
            <motion.div
              className="h-full origin-left bg-primary"
              style={{ scaleX: scrollYProgress }}
            />
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest text-white/30">
              Scroll to explore
            </span>
            <motion.span
              className="font-mono text-xs text-white/30"
              style={{
                // Display progress as percentage text
                opacity: useTransform(scrollYProgress, [0, 0.05], [0.3, 1]),
              }}
            >
              <ProgressText progress={scrollYProgress} />
            </motion.span>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Small helper to render the scroll percentage as text */
function ProgressText({
  progress,
}: {
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const rounded = useTransform(progress, (v) => `${Math.round(v * 100)}%`);
  return <motion.span>{rounded}</motion.span>;
}
