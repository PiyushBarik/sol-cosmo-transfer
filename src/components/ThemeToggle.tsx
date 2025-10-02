"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";

type Theme = "light" | "dark" | "system";

export function ThemeToggle(): React.JSX.Element {
  const [theme, setTheme] = useState<Theme>("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = (localStorage.getItem("theme") as Theme) || "system";
    setTheme(savedTheme);
    applyTheme(savedTheme);

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemThemeChange = () => {
      if (savedTheme === "system") {
        applyTheme("system");
      }
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);
    return () =>
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
  }, []);

  const applyTheme = (newTheme: Theme) => {
    const root = window.document.documentElement;

    if (newTheme === "system") {
      // Remove data-theme to let system preference take over
      root.removeAttribute("data-theme");
    } else {
      // Set explicit theme
      root.setAttribute("data-theme", newTheme);
    }
  };

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="flex items-center rounded-lg border border-slate-300 dark:border-slate-600 p-1">
        <div className="w-8 h-8 rounded-md" />
      </div>
    );
  }

  const themes: { value: Theme; icon: React.ReactNode; label: string }[] = [
    { value: "light", icon: <Sun className="h-4 w-4" />, label: "Light mode" },
    { value: "dark", icon: <Moon className="h-4 w-4" />, label: "Dark mode" },
    {
      value: "system",
      icon: <Monitor className="h-4 w-4" />,
      label: "System theme",
    },
  ];

  return (
    <div className="flex items-center rounded-lg border border-slate-300 dark:border-slate-600 p-1 bg-slate-100 dark:bg-slate-800">
      {themes.map(({ value, icon, label }) => (
        <button
          key={value}
          onClick={() => handleThemeChange(value)}
          className={`
            flex items-center justify-center w-8 h-8 rounded-md transition-all duration-200
            ${
              theme === value
                ? "bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-slate-100"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }
          `}
          aria-label={label}
          title={label}
        >
          {icon}
        </button>
      ))}
    </div>
  );
}
