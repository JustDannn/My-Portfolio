"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { ParallaxScroll } from "@/components/animations/ParallaxScroll";
import { FadeIn } from "@/components/animations/FadeIn";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { ArrowDown } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-bg-light px-6 pt-32 pb-20 md:px-12 lg:px-20">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#4F46E5 1px, transparent 1px), linear-gradient(90deg, #4F46E5 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      {/* Main content */}
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center gap-12 lg:flex-row lg:items-center lg:justify-between">
        {/* Text side */}
        <div className="flex-1 space-y-6">
          <FadeIn delay={0.2}>
            <h1 className="text-5xl font-bold leading-[1.1] tracking-tight text-foreground md:text-7xl lg:text-8xl">
              Hello, I&apos;m{" "}
              <span className="bg-linear-to-r from-primary to-primary-light bg-clip-text text-transparent">
                Fattah
              </span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.35}>
            <p className="max-w-lg text-lg leading-relaxed text-muted md:text-xl">
              A <strong className="text-foreground">Data Scientist</strong> who
              crafts intelligent solutions at the intersection of data, design,
              and technology. Turning complex datasets into meaningful stories.
            </p>
          </FadeIn>

          <FadeIn delay={0.5}>
            <div className="flex items-center gap-4 pt-4">
              <MagneticButton>
                <motion.a
                  href="#works"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 rounded-full bg-foreground px-8 py-4 text-sm font-semibold text-bg-light transition-colors"
                >
                  View Projects
                </motion.a>
              </MagneticButton>
              <MagneticButton>
                <motion.a
                  href="#contact"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 rounded-full border-2 border-foreground/20 px-8 py-4 text-sm font-semibold text-foreground transition-colors hover:border-foreground/40"
                >
                  Get in Touch
                </motion.a>
              </MagneticButton>
            </div>
          </FadeIn>
        </div>

        {/* Profile image side */}
        <FadeIn direction="left" delay={0.3} className="flex-shrink-0">
          <motion.div
            className="relative"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <div className="relative h-[400px] w-[340px] overflow-hidden rounded-3xl md:h-[500px] md:w-[420px]">
              <Image
                src="/hero profile.png"
                alt="Dani profile"
                fill
                className="object-cover"
                priority
              />
            </div>
            {/* Decorative elements around image */}
            <motion.div
              className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-gradient-to-br from-primary/20 to-primary-light/20 blur-xl"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.div
              className="absolute -bottom-4 -left-4 h-32 w-32 rounded-full bg-gradient-to-br from-accent/20 to-accent-yellow/20 blur-xl"
              animate={{ scale: [1.2, 1, 1.2] }}
              transition={{ duration: 5, repeat: Infinity }}
            />
          </motion.div>
        </FadeIn>
      </div>

      {/* Scroll indicator */}
      <FadeIn
        delay={0.8}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          className="flex flex-col items-center gap-2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-xs font-medium text-muted uppercase tracking-widest">
            Scroll
          </span>
          <ArrowDown className="h-4 w-4 text-muted" />
        </motion.div>
      </FadeIn>
    </section>
  );
}
