"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type SectionFrameProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  id?: string;
};

export default function SectionFrame({
  eyebrow,
  title,
  description,
  children,
  id,
}: SectionFrameProps) {
  return (
    <section id={id} className="relative px-6 py-24 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-10 max-w-3xl"
        >
          <span className="inline-flex items-center gap-3 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-1.5 font-mono text-[0.72rem] uppercase tracking-[0.32em] text-cyan-100/80">
            <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.85)]" />
            {eyebrow}
          </span>
          <h2 className="mt-5 max-w-2xl text-3xl font-semibold tracking-[-0.05em] text-white sm:text-4xl lg:text-5xl">
            {title}
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
            {description}
          </p>
        </motion.div>

        {children}
      </div>
    </section>
  );
}
