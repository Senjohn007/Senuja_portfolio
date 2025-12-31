function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 mt-10">
      <div className="max-w-6xl mx-auto px-4 py-6 text-xs text-slate-500 dark:text-slate-400 flex justify-between">
        <span>© {new Date().getFullYear()} Your Name</span>
        <span>Built with MERN</span>
      </div>
    </footer>
  );
}

export default Footer;


