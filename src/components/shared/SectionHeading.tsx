"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  className?: string;
  align?: "left" | "center";
}

export function SectionHeading({
  title,
  subtitle,
  className,
  align = "center",
}: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className={cn(
        "mb-12",
        align === "center" && "text-center",
        className
      )}
    >
      <h2
        className="text-3xl md:text-4xl lg:text-5xl font-bold gradient-text mb-4"
        style={{ fontFamily: "var(--font-orbitron)" }}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
      {/* Glowing underline */}
      <div
        className={cn(
          "mt-4 h-[2px] w-24 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] rounded-full",
          align === "center" && "mx-auto"
        )}
      />
    </motion.div>
  );
}
