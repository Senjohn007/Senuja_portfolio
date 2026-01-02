import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import { motion } from "framer-motion";
import { useState } from "react";

function Footer() {
  const year = new Date().getFullYear();
  const [emailHovered, setEmailHovered] = useState(false);
  const [githubHovered, setGithubHovered] = useState(false);
  const [linkedinHovered, setLinkedinHovered] = useState(false);

  return (
    <footer className="mt-10 border-t border-slate-200/50 bg-gradient-to-b from-slate-50 to-white dark:border-slate-800/50 dark:from-slate-950 dark:to-slate-900">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-slate-500 dark:text-slate-400 sm:flex-row">
        <motion.span 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
        >
          © {year} Senuja Masinghe
        </motion.span>

        <div className="flex items-center gap-3">
          <motion.a
            href="mailto:senujamasinghe@gmail.com"
            aria-label="Email"
            onHoverStart={() => setEmailHovered(true)}
            onHoverEnd={() => setEmailHovered(false)}
            whileHover={{ y: -3, scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-slate-100/70 text-slate-700 backdrop-blur-sm transition-colors hover:bg-sky-600 hover:text-white dark:bg-slate-800/70 dark:text-slate-200"
          >
            <FaEnvelope size={14} />
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-sky-500 to-blue-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: emailHovered ? 1 : 0 }}
              transition={{ duration: 0.2 }}
            />
            <FaEnvelope size={14} className="relative z-10" />
          </motion.a>

          <motion.a
            href="https://github.com/Senjohn007"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            onHoverStart={() => setGithubHovered(true)}
            onHoverEnd={() => setGithubHovered(false)}
            whileHover={{ y: -3, scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95, rotate: -5 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-slate-100/70 text-slate-700 backdrop-blur-sm transition-colors hover:bg-slate-900 hover:text-white dark:bg-slate-800/70 dark:text-slate-200"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-slate-700 to-slate-900"
              initial={{ opacity: 0 }}
              animate={{ opacity: githubHovered ? 1 : 0 }}
              transition={{ duration: 0.2 }}
            />
            <FaGithub size={14} className="relative z-10" />
          </motion.a>

          <motion.a
            href="https://www.linkedin.com/in/senuja-masinghe-55891b36b/"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            onHoverStart={() => setLinkedinHovered(true)}
            onHoverEnd={() => setLinkedinHovered(false)}
            whileHover={{ y: -3, scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-slate-100/70 text-slate-700 backdrop-blur-sm transition-colors hover:bg-blue-600 hover:text-white dark:bg-slate-800/70 dark:text-slate-200"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-700"
              initial={{ opacity: 0 }}
              animate={{ opacity: linkedinHovered ? 1 : 0 }}
              transition={{ duration: 0.2 }}
            />
            <FaLinkedin size={14} className="relative z-10" />
          </motion.a>
        </div>

        <motion.span 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="text-[11px] text-slate-400 dark:text-slate-500"
        >
          Built with <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600">MERN</span>, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">Tailwind</span> &amp; <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-600">Motion</span>
        </motion.span>
      </div>
    </footer>
  );
}

export default Footer;