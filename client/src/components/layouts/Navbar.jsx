import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import { FiMoon, FiSun, FiMenu, FiX, FiLock } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

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
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);

      // Determine active section
      const sections = ["hero", "projects", "skills", "achievements", "contact"];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (id) => {
    setOpen(false);
    if (location.pathname !== "/") {
      navigate("/", { replace: false });
      setTimeout(() => scrollToSection(id), 80);
    } else {
      scrollToSection(id);
    }
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0, transition: { duration: 0.3 } },
    visible: { 
      opacity: 1, 
      height: "auto", 
      transition: { 
        duration: 0.3,
        staggerChildren: 0.1,
        delayChildren: 0.1
      } 
    },
    exit: { opacity: 0, height: 0, transition: { duration: 0.3 } }
  };

  const mobileItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <header className={`sticky top-0 z-30 transition-all duration-300 ${
      scrolled 
        ? "border-b border-slate-200/50 bg-white/90 backdrop-blur-md shadow-sm dark:border-slate-800/50 dark:bg-slate-950/90" 
        : "border-b border-transparent bg-white/80 backdrop-blur-sm dark:bg-slate-950/80"
    }`}>
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:h-16">
        {/* Logo with enhanced animation */}
        <Link
          to="/"
          className="flex items-center gap-1 text-sm font-semibold tracking-tight"
        >
          <motion.span
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className="relative flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-sky-500 to-blue-600 text-[11px] font-bold text-white shadow-lg"
          >
            SM
            <motion.span
              className="absolute inset-0 rounded-md bg-white opacity-0"
              whileHover={{ opacity: 0.2 }}
              transition={{ duration: 0.2 }}
            />
          </motion.span>
          <span className="hidden text-xs text-slate-700 dark:text-slate-200 sm:inline">
            Senuja Masinghe
          </span>
        </Link>

        {/* Desktop nav with enhanced styling */}
        <div className="hidden items-center gap-5 md:flex">
          {sections.map((s) => (
            <motion.button
              key={s.id}
              type="button"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              onClick={() => handleNavClick(s.id)}
              className={`relative text-xs font-medium transition-colors ${
                activeSection === s.id
                  ? "text-sky-600 dark:text-sky-400"
                  : "text-slate-700 hover:text-sky-500 dark:text-slate-200 dark:hover:text-sky-400"
              }`}
            >
              {s.label}
              {activeSection === s.id && (
                <motion.div
                  layoutId="activeSection"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-sky-500 to-blue-600"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          ))}

          {/* Admin entry (desktop) */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-1 rounded-md border border-slate-200/50 bg-white/50 px-2 py-1 text-[11px] font-medium text-slate-600 backdrop-blur-sm transition-all hover:border-sky-500/50 hover:bg-sky-50/70 hover:text-sky-600 dark:border-slate-700/50 dark:bg-slate-900/50 dark:text-slate-300 dark:hover:bg-sky-950/50 dark:hover:text-sky-300"
            >
              <FiLock size={12} />
              <span>Admin</span>
            </Link>
          </motion.div>

          <motion.button
            type="button"
            whileHover={{ scale: 1.1, rotate: 15 }}
            whileTap={{ scale: 0.95, rotate: -15 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            onClick={toggleTheme}
            className="relative inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200/50 bg-white/50 text-slate-700 backdrop-blur-sm transition-all hover:bg-slate-100/70 dark:border-slate-700/50 dark:bg-slate-900/50 dark:text-slate-200 dark:hover:bg-slate-800/70"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <FiSun size={16} /> : <FiMoon size={16} />}
          </motion.button>
        </div>

        {/* Mobile actions with enhanced animations */}
        <div className="flex items-center gap-2 md:hidden">
          {/* Admin entry (mobile icon only) */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Link
              to="/admin/login"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200/50 bg-white/50 text-slate-600 backdrop-blur-sm transition-all hover:bg-slate-100/70 dark:border-slate-700/50 dark:bg-slate-900/50 dark:text-slate-300 dark:hover:bg-slate-800/70"
              aria-label="Admin login"
            >
              <FiLock size={14} />
            </Link>
          </motion.div>

          <motion.button
            type="button"
            whileHover={{ scale: 1.1, rotate: 15 }}
            whileTap={{ scale: 0.95, rotate: -15 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            onClick={toggleTheme}
            className="relative inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200/50 bg-white/50 text-slate-700 backdrop-blur-sm transition-all hover:bg-slate-100/70 dark:border-slate-700/50 dark:bg-slate-900/50 dark:text-slate-200 dark:hover:bg-slate-800/70"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <FiSun size={16} /> : <FiMoon size={16} />}
          </motion.button>

          <motion.button
            type="button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            onClick={() => setOpen((prev) => !prev)}
            className="relative inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200/50 bg-white/50 text-slate-700 backdrop-blur-sm transition-all hover:bg-slate-100/70 dark:border-slate-700/50 dark:bg-slate-900/50 dark:text-slate-200 dark:hover:bg-slate-800/70"
            aria-label="Toggle navigation"
          >
            <AnimatePresence mode="wait">
              {open ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FiX size={18} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FiMenu size={18} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </nav>

      {/* Mobile menu with enhanced animations */}
      <AnimatePresence>
        {open && (
          <motion.div
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="border-b border-slate-200/50 bg-white/95 backdrop-blur-md shadow-sm dark:border-slate-800/50 dark:bg-slate-950/95 md:hidden"
          >
            <div className="flex flex-col gap-2 px-4 pb-3 pt-2">
              {sections.map((s) => (
                <motion.button
                  key={s.id}
                  variants={mobileItemVariants}
                  type="button"
                  onClick={() => handleNavClick(s.id)}
                  className={`relative w-full rounded-md px-2 py-2 text-left text-xs font-medium transition-colors ${
                    activeSection === s.id
                      ? "bg-sky-50/70 text-sky-600 dark:bg-sky-950/50 dark:text-sky-400"
                      : "text-slate-700 hover:bg-slate-100/70 dark:text-slate-200 dark:hover:bg-slate-800/70"
                  }`}
                >
                  {s.label}
                  {activeSection === s.id && (
                    <motion.div
                      layoutId="activeMobileSection"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-sky-500 to-blue-600"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;