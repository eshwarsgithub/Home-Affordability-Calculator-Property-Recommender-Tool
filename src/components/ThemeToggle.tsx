"use client";

import { useEffect, useState } from "react";

const THEME_KEY = "theme";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<string>("light");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(THEME_KEY);
      const initial = stored === "dark" ? "dark" : "light"; // default to light (preview)
      setTheme(initial);
      document.documentElement.setAttribute("data-theme", initial);
    } catch (e) {
      // ignore (e.g., SSR)
    }
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch (e) {
      // ignore
    }
    document.documentElement.setAttribute("data-theme", next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={theme === "dark"}
      title={theme === "dark" ? "Switch to day mode" : "Switch to dark mode"}
      className="ml-4 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-sky-200"
    >
      {theme === "dark" ? (
        <span aria-hidden>🌙</span>
      ) : (
        <span aria-hidden>☀️</span>
      )}
      <span className="sr-only">Toggle theme</span>
      <span className="ml-1">{theme === "dark" ? "Dark" : "Day"}</span>
    </button>
  );
}
