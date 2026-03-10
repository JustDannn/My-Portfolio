"use client";

import { motion } from "motion/react";
import { FadeIn } from "@/components/animations/FadeIn";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { Github, Linkedin, Mail, Twitter } from "lucide-react";

const socials = [
  { icon: Github, label: "GitHub", href: "https://github.com" },
  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com" },
  { icon: Twitter, label: "Twitter", href: "https://twitter.com" },
  { icon: Mail, label: "Email", href: "mailto:daninurfatah@gmail.com" },
];

export function Footer() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-bg-light py-24 md:py-32"
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#4F46E5 1px, transparent 1px), linear-gradient(90deg, #4F46E5 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12 lg:px-20">
        <div className="flex flex-col items-center text-center">
          <FadeIn>
            <span className="mb-4 block text-sm font-medium text-primary uppercase tracking-widest">
              Get in Touch
            </span>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h2 className="text-5xl font-bold leading-tight tracking-tight text-foreground md:text-7xl lg:text-8xl">
              Let&apos;s work{" "}
              <span className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                together
              </span>
            </h2>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="mt-6 max-w-md text-lg text-muted">
              Got a project in mind? I&apos;d love to hear about it. Drop me a
              message and let&apos;s build something great.
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <MagneticButton className="mt-10">
              <motion.a
                href="mailto:hello@justdann.dev"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-3 rounded-full bg-foreground px-10 py-5 text-base font-semibold text-bg-light"
                data-cursor-hover
              >
                <Mail className="h-5 w-5" />
                Say Hello
              </motion.a>
            </MagneticButton>
          </FadeIn>

          {/* Social links */}
          <FadeIn delay={0.4}>
            <div className="mt-16 flex items-center gap-6">
              {socials.map((social) => (
                <MagneticButton key={social.label} strength={0.4}>
                  <motion.a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-foreground/10 text-foreground/60 transition-colors hover:border-primary hover:text-primary"
                    data-cursor-hover
                  >
                    <social.icon className="h-5 w-5" />
                  </motion.a>
                </MagneticButton>
              ))}
            </div>
          </FadeIn>
        </div>

        {/* Bottom bar */}
        <FadeIn delay={0.5}>
          <div className="mt-24 flex flex-col items-center justify-between gap-4 border-t border-foreground/10 pt-8 md:flex-row">
            <p className="text-sm text-muted">
              &copy; {new Date().getFullYear()} Justdann. All rights reserved.
            </p>
            <p className="text-sm text-muted">
              Crafted with passion & lots of data.
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
