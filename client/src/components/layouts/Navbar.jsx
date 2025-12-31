import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { FiMoon, FiSun } from "react-icons/fi";

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

  // ✅ get theme and toggleTheme from context
  const { theme, toggleTheme } = useTheme();

  const handleNavClick = (id) => {
    if (location.pathname !== "/") {
      navigate("/", { replace: false });
      setTimeout(() => scrollToSection(id), 50);
    } else {
      scrollToSection(id);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-950/80 backdrop-blur border-b border-slate-200 dark:border-slate-800">
      <nav className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="font-semibold">
          YourLogo
        </Link>
        <div className="flex items-center gap-6">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => handleNavClick(s.id)}
              className="text-sm text-slate-700 dark:text-slate-200 hover:text-sky-500 dark:hover:text-sky-400"
            >
              {s.label}
            </button>
          ))}

          {/* ✅ theme toggle button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {theme === "dark" ? <FiSun size={16} /> : <FiMoon size={16} />}
          </button>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
