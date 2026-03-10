"use client";

import { motion } from "motion/react";
import Link from "next/link";

const navItems = [
  { label: "Works", href: "#works" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 mix-blend-difference"
    >
      <Link href="/" className="text-lg font-bold tracking-tight text-white">
        justdann.
      </Link>

      <div className="flex items-center gap-8">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="text-sm font-medium text-white/80 transition-colors hover:text-white"
          >
            {item.label}
          </Link>
        ))}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black mix-blend-difference"
        >
          Resume
        </motion.button>
      </div>
    </motion.nav>
  );
}
