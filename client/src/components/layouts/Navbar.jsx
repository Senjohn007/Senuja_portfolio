// client/src/components/layouts/Navbar.jsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { FiMoon, FiSun, FiMenu, FiX } from "react-icons/fi";
import { motion } from "framer-motion";

const sections = [
  { id: "hero", label: "Home" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "achievements", label: "Achievements" },
  { id: "contact", label: "Contact" },
];

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const handleNavClick = (id) => {
    setOpen(false);
    if (location.pathname !== "/") {
      navigate("/", { replace: false });
      setTimeout(() => scrollToSection(id), 80);
    } else {
      scrollToSection(id);
    }
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:h-16">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-1 text-sm font-semibold tracking-tight"
        >
          <motion.span
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="rounded-md bg-sky-600 px-2 py-1 text-[11px] font-bold text-white"
          >
            SM
          </motion.span>
          <span className="hidden text-xs text-slate-700 dark:text-slate-200 sm:inline">
            Senuja Masinghe
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-5 md:flex">
          {sections.map((s) => (
            <motion.button
              key={s.id}
              type="button"
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              onClick={() => handleNavClick(s.id)}
              className="text-xs font-medium text-slate-700 transition-colors hover:text-sky-500 dark:text-slate-200 dark:hover:text-sky-400"
            >
              {s.label}
            </motion.button>
          ))}

          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <FiSun size={16} /> : <FiMoon size={16} />}
          </button>
        </div>

        {/* Mobile actions */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <FiSun size={16} /> : <FiMoon size={16} />}
          </button>

          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            aria-label="Toggle navigation"
          >
            {open ? <FiX size={18} /> : <FiMenu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="border-b border-slate-200 bg-white/95 px-4 pb-3 pt-2 shadow-sm dark:border-slate-800 dark:bg-slate-950/95 md:hidden"
        >
          <div className="flex flex-col gap-2">
            {sections.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => handleNavClick(s.id)}
                className="w-full rounded-md px-2 py-2 text-left text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                {s.label}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </header>
  );
}

export default Navbar;
