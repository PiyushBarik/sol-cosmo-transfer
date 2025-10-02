"use client";

import React from "react";

interface SkeletonRowProps {
  columns: number;
  className?: string;
}

export function SkeletonRow({
  columns,
  className = "",
}: SkeletonRowProps): React.JSX.Element {
  return (
    <tr className={`animate-pulse ${className}`}>
      {Array.from({ length: columns }).map((_, index) => (
        <td key={index} className="px-4 py-3">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
        </td>
      ))}
    </tr>
  );
}

interface SkeletonCardProps {
  className?: string;
}

export function SkeletonCard({
  className = "",
}: SkeletonCardProps): React.JSX.Element {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-3"></div>
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-2"></div>
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
    </div>
  );
}

interface SkeletonAvatarProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function SkeletonAvatar({
  size = "md",
  className = "",
}: SkeletonAvatarProps): React.JSX.Element {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div
      className={`animate-pulse bg-slate-200 dark:bg-slate-700 rounded-full ${sizeClasses[size]} ${className}`}
    />
  );
}
