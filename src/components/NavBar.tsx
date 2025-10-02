"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Zap, ArrowRightLeft, Home } from "lucide-react";

export function NavBar(): React.JSX.Element {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Home", icon: <Home className="h-4 w-4" /> },
    { href: "/cosmo", label: "Cosmo Feed", icon: <Zap className="h-4 w-4" /> },
    {
      href: "/transfer",
      label: "Transfer",
      icon: <ArrowRightLeft className="h-4 w-4" />,
    },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-lg text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="hidden sm:block">Sol Cosmo Transfer</span>
            <span className="sm:hidden">SCT</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-1">
            {navItems.map(({ href, label, icon }) => (
              <Link
                key={href}
                href={href}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${
                    isActive(href)
                      ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800"
                  }
                `}
              >
                {icon}
                <span className="hidden sm:block">{label}</span>
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <div className="hidden md:block text-xs text-slate-500 dark:text-slate-400">
              Devnet • Phantom
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
