"use client";

import { motion } from "motion/react";
import { useRef, useState } from "react";
import { FadeIn } from "@/components/animations/FadeIn";
import { services } from "@/data/content";
import { ArrowUpRight } from "lucide-react";

function ServiceItem({
  service,
  index,
}: {
  service: (typeof services)[0];
  index: number;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);

  return (
    <FadeIn delay={index * 0.1}>
      <motion.div
        ref={itemRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group border-b border-white/10 py-8 md:py-10"
        data-cursor-hover
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-6 md:gap-10">
            <motion.span
              animate={{
                color: isHovered ? "#4F46E5" : "rgba(255,255,255,0.3)",
              }}
              className="text-sm font-mono font-medium mt-1"
            >
              {service.number}
            </motion.span>

            <div className="space-y-3">
              <motion.h3
                animate={{ x: isHovered ? 10 : 0 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="text-2xl font-bold text-white md:text-3xl"
              >
                {service.title}
              </motion.h3>
              <motion.p
                initial={{ height: 0, opacity: 0 }}
                animate={{
                  height: isHovered ? "auto" : 0,
                  opacity: isHovered ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
                className="max-w-lg overflow-hidden text-sm leading-relaxed text-white/50"
              >
                {service.description}
              </motion.p>
            </div>
          </div>

          <motion.div
            animate={{
              rotate: isHovered ? 45 : 0,
              scale: isHovered ? 1.2 : 1,
            }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <ArrowUpRight className="h-6 w-6 text-white/30 group-hover:text-primary" />
          </motion.div>
        </div>
      </motion.div>
    </FadeIn>
  );
}

export function Services() {
  return (
    <section id="services" className="relative bg-bg-dark py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-20">
        <FadeIn>
          <div className="mb-16">
            <span className="mb-2 block text-sm font-medium text-primary uppercase tracking-widest">
              What I Do
            </span>
            <h2 className="text-4xl font-bold text-white md:text-5xl">
              Skills
            </h2>
          </div>
        </FadeIn>

        <div>
          {services.map((service, i) => (
            <ServiceItem key={service.id} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
