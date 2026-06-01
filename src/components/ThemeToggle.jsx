"use client";

import { useEffect, useState } from "react";
import { FaSun, FaMoon } from "react-icons/fa";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme") || "light";
    const dark = saved === "dark";
    setIsDark(dark);
    applyTheme(dark);
  }, []);

  const applyTheme = (dark) => {
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
    document.documentElement.classList.toggle("dark", dark);
  };

  const toggle = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    localStorage.setItem("theme", newDark ? "dark" : "light");
    applyTheme(newDark);
  };

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
    >
      {isDark ? (
        <FaSun className="text-yellow-400 text-lg" />
      ) : (
        <FaMoon className="text-gray-500 text-lg" />
      )}
    </button>
  );
}
