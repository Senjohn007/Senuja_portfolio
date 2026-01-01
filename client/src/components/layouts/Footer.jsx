// client/src/components/layouts/Footer.jsx
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import { motion } from "framer-motion";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-10 border-t border-slate-200 dark:border-slate-800">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-slate-500 dark:text-slate-400 sm:flex-row">
        <span>© {year} Senuja Masinghe</span>

        <div className="flex items-center gap-3">
          <motion.a
            href="mailto:senujamasinghe@gmail.com"
            aria-label="Email"
            whileHover={{ y: -2, scale: 1.05 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="rounded-full bg-slate-100 p-1.5 text-slate-700 transition-colors hover:bg-sky-600 hover:text-white dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-sky-600"
          >
            <FaEnvelope size={14} />
          </motion.a>

          <motion.a
            href="https://github.com/Senjohn007"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            whileHover={{ y: -2, scale: 1.05 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="rounded-full bg-slate-100 p-1.5 text-slate-700 transition-colors hover:bg-sky-600 hover:text-white dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-sky-600"
          >
            <FaGithub size={14} />
          </motion.a>

          <motion.a
            href="https://www.linkedin.com/in/senuja-masinghe-55891b36b/"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            whileHover={{ y: -2, scale: 1.05 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="rounded-full bg-slate-100 p-1.5 text-slate-700 transition-colors hover:bg-sky-600 hover:text-white dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-sky-600"
          >
            <FaLinkedin size={14} />
          </motion.a>
        </div>

        <span className="text-[11px] text-slate-400 dark:text-slate-500">
          Built with MERN, Tailwind &amp; Motion
        </span>
      </div>
    </footer>
  );
}

export default Footer;
