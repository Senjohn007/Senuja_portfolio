// client/src/components/layouts/Footer.jsx
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 mt-10">
      <div className="max-w-6xl mx-auto px-4 py-6 text-xs text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3">
        <span>© {new Date().getFullYear()} Senuja Masinghe</span>

        <div className="flex items-center gap-3">
          <a
            href="mailto:senujamasinghe@gmail.com"
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Email"
          >
            <FaEnvelope size={14} />
          </a>
          <a
            href="https://github.com/Senjohn007"
            target="_blank"
            rel="noreferrer"
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="GitHub"
          >
            <FaGithub size={14} />
          </a>
          <a
            href="https://www.linkedin.com/in/senuja-masinghe-55891b36b/"
            target="_blank"
            rel="noreferrer"
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="LinkedIn"
          >
            <FaLinkedin size={14} />
          </a>
        </div>

        <span className="text-[11px] text-slate-400">
          Built with MERN, Tailwind & Motion
        </span>
      </div>
    </footer>
  );
}

export default Footer;
