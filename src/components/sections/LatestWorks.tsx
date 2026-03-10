"use client";

import { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useVelocity,
  useSpring,
  useMotionValue,
  useMotionValueEvent,
  type MotionValue,
} from "motion/react";
import { projects } from "@/data/content";
import { useWindowSize } from "@/hooks/useWindowSize";

// ─── Typewriter Text Effect ──────────────────────────────────
function TypewriterText({
  text,
  isVisible,
}: {
  text: string;
  isVisible: boolean;
}) {
  const [revealCount, setRevealCount] = useState(0);
  const frameRef = useRef<number>(0);
  const prevVisible = useRef(false);

  useEffect(() => {
    cancelAnimationFrame(frameRef.current);

    const entering = isVisible && !prevVisible.current;
    const exiting = !isVisible && prevVisible.current;
    prevVisible.current = isVisible;

    if (!entering && !exiting) return;

    const len = text.length;
    let count = entering ? 0 : len;

    const animate = () => {
      if (entering) {
        count = Math.min(count + 1, len);
        setRevealCount(count);
        if (count < len) {
          frameRef.current = requestAnimationFrame(animate);
        }
      } else {
        count = Math.max(count - 1, 0);
        setRevealCount(count);
        if (count > 0) {
          frameRef.current = requestAnimationFrame(animate);
        }
      }
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [isVisible, text]);

  return (
    <>
      {text.slice(0, revealCount)}
      {revealCount > 0 && revealCount < text.length && (
        <span className="animate-pulse">▌</span>
      )}
    </>
  );
}

// ─── Configuration ───────────────────────────────────────────
const PLANE_GAP = 900;
const TOTAL_DEPTH = (projects.length - 1) * PLANE_GAP;
const CAMERA_OFFSET = 300;
// 250vh per project = lots of scroll room so each plane lingers on screen
const SECTION_HEIGHT_VH = projects.length * 250;

// ─── Color interpolation ────────────────────────────────────
function lerpColor(a: string, b: string, t: number): string {
  const parse = (hex: string) => {
    const n = parseInt(hex.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  };
  const [r1, g1, b1] = parse(a);
  const [r2, g2, b2] = parse(b);
  return `rgb(${Math.round(r1 + (r2 - r1) * t)}, ${Math.round(g1 + (g2 - g1) * t)}, ${Math.round(b1 + (b2 - b1) * t)})`;
}

// ─── Single depth plane ──────────────────────────────────────
function DepthPlane({
  project,
  index,
  scrollYProgress,
  smoothVelocity,
  mouseX,
  mouseY,
  isMobile,
}: {
  project: (typeof projects)[0];
  index: number;
  scrollYProgress: MotionValue<number>;
  smoothVelocity: MotionValue<number>;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  isMobile: boolean;
}) {
  // ── Z: smooth linear depth ──
  const z = useTransform(
    scrollYProgress,
    [0, 1],
    [
      -(index * PLANE_GAP + CAMERA_OFFSET),
      TOTAL_DEPTH - index * PLANE_GAP - CAMERA_OFFSET,
    ],
  );

  // ── Opacity: depth-based ──
  const opacity = useTransform(
    z,
    [-PLANE_GAP * 2.5, -PLANE_GAP, -CAMERA_OFFSET, 100, PLANE_GAP * 0.5],
    [0, 0.25, 1, 0.4, 0],
  );

  // ── Mouse parallax (reduced on mobile) ──
  const depthFactor = 1 - index / projects.length;
  const parallaxX = useTransform(
    mouseX,
    [-1, 1],
    [-25 * depthFactor, 25 * depthFactor],
  );
  const parallaxY = useTransform(
    mouseY,
    [-1, 1],
    [-15 * depthFactor, 15 * depthFactor],
  );

  // ── Scroll drift ──
  const driftY = useTransform(smoothVelocity, [-0.3, 0, 0.3], [40, 0, -40]);

  // ── Breath ──
  const breathTiltX = useTransform(smoothVelocity, [-0.3, 0, 0.3], [-5, 0, 5]);
  const breathTiltY = useTransform(mouseX, [-1, 1], [-3, 3]);
  const breathScale = useTransform(
    smoothVelocity,
    [-0.3, -0.05, 0, 0.05, 0.3],
    [1.03, 1, 1, 1, 1.03],
  );

  // ── Zigzag ──
  const isLeft = index % 2 === 0;

  // ── Description: wide Z visibility window so text is readable while scrolling ──
  const textOpacity = useTransform(
    z,
    [-PLANE_GAP * 1.2, -PLANE_GAP * 0.6, -CAMERA_OFFSET, 0, PLANE_GAP * 0.2],
    [0, 0.8, 1, 0.8, 0],
  );
  const textSlideX = useTransform(
    z,
    [-PLANE_GAP * 1.2, -CAMERA_OFFSET, 0, PLANE_GAP * 0.3],
    [isLeft ? 60 : -60, 0, 0, isLeft ? -30 : 30],
  );

  const [isVisible, setIsVisible] = useState(false);

  useMotionValueEvent(z, "change", (zVal) => {
    const visible = zVal > -PLANE_GAP * 0.8 && zVal < PLANE_GAP * 0.15;
    if (visible !== isVisible) setIsVisible(visible);
  });

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      style={{
        z,
        opacity,
        transformStyle: "preserve-3d",
      }}
    >
      <motion.div style={{ y: driftY }}>
        <motion.div
          style={{
            x: parallaxX,
            y: parallaxY,
            rotateX: breathTiltX,
            rotateY: breathTiltY,
            scale: breathScale,
          }}
        >
          <div
            className="flex items-center gap-6 md:gap-16"
            style={{
              flexDirection: isMobile
                ? "column"
                : isLeft
                  ? "row"
                  : "row-reverse",
              marginLeft: isMobile ? 0 : isLeft ? -180 : 0,
              marginRight: isMobile ? 0 : isLeft ? 0 : -180,
            }}
          >
            {/* Card */}
            <div
              className="relative shrink-0 overflow-hidden rounded-2xl shadow-2xl pointer-events-auto group"
              style={{
                width: isMobile ? "75vw" : "clamp(300px, 38vw, 520px)",
                aspectRatio: "4/5",
              }}
              data-cursor-hover
            >
              <div
                className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-110"
                style={{ backgroundColor: project.color }}
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/5 to-transparent" />

              <span className="absolute top-6 left-7 font-mono text-sm tracking-widest text-white/80">
                {String(index + 1).padStart(2, "0")}
              </span>

              <div className="absolute right-7 bottom-7 left-7 text-right">
                <h3 className="text-xl font-bold uppercase leading-tight tracking-wide text-white md:text-3xl">
                  {project.title}
                </h3>
              </div>

              <div className="absolute top-6 right-7 flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-sm"
                  style={{ backgroundColor: project.color }}
                />
                <span className="font-mono text-[10px] text-white/50">
                  {project.color}
                </span>
              </div>
            </div>

            {/* Description panel */}
            <motion.div
              className="pointer-events-auto space-y-3 md:space-y-4"
              style={{
                width: isMobile ? "75vw" : undefined,
                maxWidth: 320,
                opacity: textOpacity,
                x: isMobile ? 0 : textSlideX,
              }}
            >
              <span
                className="inline-block h-px transition-all duration-300 ease-out"
                style={{
                  backgroundColor: project.color,
                  width: isVisible ? "60px" : "40px",
                }}
              />
              <p className="text-sm leading-relaxed text-black/60 md:text-base font-mono min-h-16">
                <TypewriterText
                  text={project.description}
                  isVisible={isVisible}
                />
              </p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border px-3 py-1 text-[10px] font-medium uppercase tracking-wider"
                    style={{
                      borderColor: `${project.color}40`,
                      color: project.color,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main component ──────────────────────────────────────────
export function LatestWorks() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [bgColor, setBgColor] = useState(projects[0].mood.bg);
  const [activeIndex, setActiveIndex] = useState(0);
  const { width } = useWindowSize();
  const isMobile = width > 0 && width < 768;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Smooth linear — no stepped breakpoints
  const cameraDepth = useTransform(scrollYProgress, [0, 1], [0, TOTAL_DEPTH]);

  // Velocity chain
  const scrollVelocity = useVelocity(scrollYProgress);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });

  // Mouse tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.set((e.clientX / window.innerWidth) * 2 - 1);
    mouseY.set((e.clientY / window.innerHeight) * 2 - 1);
  };

  // Background mood + active index
  useMotionValueEvent(cameraDepth, "change", (depth) => {
    const n = projects.length;
    const rawIndex = depth / PLANE_GAP;
    const curr = Math.min(Math.floor(rawIndex), n - 1);
    const next = Math.min(curr + 1, n - 1);
    const blend = Math.max(0, Math.min(1, rawIndex - curr));

    setBgColor(
      lerpColor(projects[curr].mood.bg, projects[next].mood.bg, blend),
    );
    setActiveIndex(Math.min(Math.round(rawIndex), n - 1));
  });

  // Blob opacity
  const accentOpacity = useTransform(
    smoothVelocity,
    [-0.3, -0.05, 0, 0.05, 0.3],
    [0.4, 0.15, 0.12, 0.15, 0.4],
  );

  return (
    <section
      id="works"
      ref={containerRef}
      className="relative"
      style={{ height: `${SECTION_HEIGHT_VH}vh` }}
    >
      <div
        className="sticky top-0 h-screen overflow-hidden"
        style={{
          perspective: isMobile ? 800 : 1200,
          backgroundColor: bgColor,
          transition: "background-color 0.15s ease",
        }}
        onMouseMove={handleMouseMove}
      >
        {/* Accent blobs */}
        <motion.div
          className="pointer-events-none absolute -top-1/4 -right-1/4 h-[60vh] w-[60vh] md:h-[80vh] md:w-[80vh] rounded-full blur-[80px] md:blur-[120px]"
          style={{
            backgroundColor: projects[activeIndex].mood.accent1,
            opacity: accentOpacity,
          }}
        />
        <motion.div
          className="pointer-events-none absolute -bottom-1/4 -left-1/4 h-[50vh] w-[50vh] md:h-[70vh] md:w-[70vh] rounded-full blur-[70px] md:blur-[100px]"
          style={{
            backgroundColor: projects[activeIndex].mood.accent2,
            opacity: accentOpacity,
          }}
        />
        {/* 3D scene */}
        <div
          className="absolute inset-0"
          style={{ transformStyle: "preserve-3d" }}
        >
          {projects.map((project, i) => (
            <DepthPlane
              key={project.id}
              project={project}
              index={i}
              scrollYProgress={scrollYProgress}
              smoothVelocity={smoothVelocity}
              mouseX={mouseX}
              mouseY={mouseY}
              isMobile={isMobile}
            />
          ))}
        </div>

        {/* Progress dots */}
        <div className="absolute right-4 top-1/2 z-20 flex -translate-y-1/2 flex-col gap-2.5 md:right-12 md:gap-3">
          {projects.map((_, i) => (
            <div
              key={i}
              className="transition-all duration-300"
              style={{
                width: i === activeIndex ? 10 : 6,
                height: i === activeIndex ? 10 : 6,
                borderRadius: "50%",
                backgroundColor:
                  i === activeIndex
                    ? projects[activeIndex].color
                    : "rgba(0,0,0,0.15)",
                transform: i === activeIndex ? "scale(1.3)" : "scale(1)",
              }}
            />
          ))}
        </div>

        {/* Counter */}
        <div className="absolute bottom-8 left-8 z-20 md:bottom-12 md:left-12">
          <span className="font-mono text-xs tracking-widest text-black/30">
            {String(activeIndex + 1).padStart(2, "0")} /{" "}
            {String(projects.length).padStart(2, "0")}
          </span>
        </div>

        {/* Scroll hint */}
        <motion.div
          className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2"
          animate={{ opacity: activeIndex === 0 ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        >
          <span className="text-[10px] uppercase tracking-[0.2em] text-black/25">
            Scroll to explore
          </span>
          <motion.div
            className="h-8 w-px bg-linear-to-b from-black/30 to-transparent"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 z-20 h-px bg-black/5">
          <motion.div
            className="h-full origin-left"
            style={{
              scaleX: scrollYProgress,
              backgroundColor: projects[activeIndex].color,
            }}
          />
        </div>
      </div>
    </section>
  );
}
