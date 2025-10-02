"use client";

import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "elevated" | "bordered";
}

export function Card({
  children,
  className = "",
  variant = "default",
}: CardProps): React.JSX.Element {
  const baseClasses = "rounded-xl transition-all duration-200";

  const variantClasses = {
    default:
      "border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/60",
    elevated:
      "shadow-lg border border-slate-200 bg-white hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-slate-950/50",
    bordered:
      "border-2 border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50",
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </div>
  );
}
