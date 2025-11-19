import { cn } from "@/lib/utils";
import type {
  ReactNode,
  ButtonHTMLAttributes,
  HTMLAttributes,
  ReactElement,
} from "react";
import { cloneElement, isValidElement } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
}

const baseButton =
  "inline-flex items-center justify-center border transition-all duration-150 ease-out rounded-full font-medium tracking-wide focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--color-royal)] border-transparent text-white shadow-[0_12px_24px_rgba(10,93,255,0.32)] hover:-translate-y-0.5 hover:shadow-[0_18px_30px_rgba(10,93,255,0.38)]",
  secondary:
    "bg-white/10 border-white/20 text-white hover:bg-white/16 hover:border-white/30",
  ghost: "bg-transparent border-transparent text-white hover:bg-white/10",
  outline: "bg-transparent border-white/40 text-white hover:border-white",
};

const sizeStyles = {
  sm: "text-sm px-4 py-1.5",
  md: "text-sm px-5 py-2",
  lg: "text-base px-6 py-2.5",
};

export const Button = ({ variant = "primary", size = "md", className, asChild, children, ...props }: ButtonProps) => {
  const classes = cn(
    baseButton,
    variantStyles[variant],
    sizeStyles[size],
    "focus-visible:outline-[var(--color-royal)]",
    className,
  );

  if (asChild && isValidElement(children)) {
    return cloneElement(children as ReactElement, {
      className: cn((children as ReactElement).props.className, classes),
      ...props,
    });
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: "success" | "warning" | "neutral" | "info";
}

const badgeColor: Record<NonNullable<BadgeProps["tone"]>, string> = {
  success: "bg-[rgba(15,191,120,0.16)] text-[#61ffc8] border border-[#61ffc8]/30",
  warning: "bg-[rgba(255,182,56,0.16)] text-[#ffd385] border border-[#ffd385]/30",
  neutral: "bg-white/12 text-white border border-white/20",
  info: "bg-[rgba(10,93,255,0.18)] text-[#8db6ff] border border-[#8db6ff]/30",
};

export const Badge = ({ children, tone = "info", className, ...props }: BadgeProps) => (
  <span
    className={cn(
      "inline-flex items-center gap-1 text-xs uppercase tracking-[0.2em] px-3 py-1 rounded-full",
      badgeColor[tone],
      className,
    )}
    {...props}
  >
    {children}
  </span>
);

interface SectionHeadingProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  eyebrow?: string;
  description?: string;
  align?: "left" | "center";
}

export const SectionHeading = ({ title, eyebrow, description, align = "left", className, ...props }: SectionHeadingProps) => (
  <div
    className={cn("space-y-3", align === "center" && "text-center mx-auto max-w-3xl", className)}
    {...props}
  >
    {eyebrow ? (
      <p className="text-xs font-semibold tracking-[0.4em] uppercase text-white/60">{eyebrow}</p>
    ) : null}
    <h2 className="font-serif text-[clamp(2rem,3vw,3.75rem)] leading-tight text-white">{title}</h2>
    {description ? <p className="text-base text-white/70 max-w-2xl mx-auto">{description}</p> : null}
  </div>
);

interface StatCardProps {
  label: string;
  value: string;
  delta?: number;
}

export const StatCard = ({ label, value, delta }: StatCardProps) => {
  const deltaTone = delta && delta >= 0 ? "text-[#61ffc8]" : "text-[#ff9c7b]";
  const deltaSign = delta && delta > 0 ? "▲" : delta && delta < 0 ? "▼" : null;
  return (
    <div className="surface-card space-y-2">
      <p className="text-sm uppercase tracking-[0.3em] text-white/60">{label}</p>
      <p className="text-3xl font-semibold">{value}</p>
      {typeof delta === "number" ? (
        <p className={`text-sm ${deltaTone}`}>
          {deltaSign} {Math.abs(delta).toFixed(1)}% vs LY
        </p>
      ) : null}
    </div>
  );
};

export const Card = ({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("surface-card", className)} {...props}>
    {children}
  </div>
);

export const Grid = ({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("grid gap-6", className)} {...props}>
    {children}
  </div>
);

export const Fieldset = ({ legend, children }: { legend: string; children: ReactNode }) => (
  <fieldset className="surface-card border-white/10">
    <legend className="text-sm uppercase tracking-[0.4em] text-white/60">{legend}</legend>
    <div className="mt-4 space-y-3">{children}</div>
  </fieldset>
);
