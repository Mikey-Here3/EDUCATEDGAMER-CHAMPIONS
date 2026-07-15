"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-medium transition-all duration-300 rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-to-r from-[#7B2EFF] to-[#5A1DBF] text-white shadow-[0_0_15px_rgba(123,46,255,0.3)] hover:shadow-[0_0_30px_rgba(123,46,255,0.5)]",
        secondary:
          "bg-transparent border border-[var(--color-border-bright)] text-[var(--color-primary-light)] hover:bg-[var(--color-surface)]",
        outline:
          "bg-transparent border border-[var(--color-border)] text-gray-300 hover:border-[var(--color-primary)] hover:text-[var(--color-primary-light)]",
        ghost:
          "bg-transparent text-gray-300 hover:text-[var(--color-primary-light)] hover:bg-[var(--color-surface)]",
      },
      size: {
        sm: "text-xs px-3 py-1.5",
        md: "text-sm px-5 py-2.5",
        lg: "text-base px-8 py-3.5",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

interface NeonButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
  className?: string;
  href?: string;
}

export function NeonButton({
  children,
  variant,
  size,
  className,
  href,
  disabled,
  ...props
}: NeonButtonProps) {
  const commonClasses = cn(buttonVariants({ variant, size }), className);

  return (
    <motion.div
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className="inline-block"
    >
      {href ? (
        <a
          href={href}
          className={commonClasses}
          {...(props as any)}
        >
          {children}
        </a>
      ) : (
        <button
          type="button"
          disabled={disabled}
          className={commonClasses}
          {...(props as any)}
        >
          {children}
        </button>
      )}
    </motion.div>
  );
}
