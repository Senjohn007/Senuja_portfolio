import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/layouts/Navbar";
import Footer from "../components/layouts/Footer";
import SectionWrapper from "../components/layouts/SectionWrapper";
import {
  getSkills,
  getProjects,
  getAchievements,
  postMessage,
} from "../lib/api";
import { motion } from "framer-motion";

// ⬇️ import your picture (adjust path/name as needed)
import profileImage from "../assets/profile.jpg";

const PROJECT_CATEGORIES = ["All", "Data"];

const scrollToSection = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

const sectionVariant = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
};

const textVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } }
};

const letterVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

function HomePage() {
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [contact, setContact] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [skillsData, projectsData, achievementsData] = await Promise.all(
          [getSkills(), getProjects(), getAchievements()]
        );
        setSkills(skillsData);
        setProjects(projectsData);
        setAchievements(achievementsData);
      } finally {
        setLoading(false);
        setIsLoaded(true);
      }
    }
    load();
  }, []);

  const filteredProjects =
    activeFilter === "All"
      ? projects
      : projects.filter((p) => p.category === activeFilter);

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContact((prev) => ({ ...prev, [name]: value }));
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setStatus("");

    if (!contact.name || !contact.email || !contact.message) {
      setStatus("Please fill all fields.");
      return;
    }

    try {
      setSending(true);
      await postMessage(contact);
      setStatus("Message sent successfully. Thank you for reaching out.");
      setContact({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus("Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const titleText = "Turning data into meaningful insights.";
  const titleLetters = titleText.split("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-50">
      <Navbar />

      <main>
        {/* ============== Hero ============== */}
        <SectionWrapper
          id="hero"
          className="flex flex-col gap-10 md:flex-row md:items-center overflow-hidden"
        >
          <motion.div
            variants={sectionVariant}
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            transition={{ duration: 0.6 }}
            className="flex-1 space-y-6"
          >
            <motion.div
              variants={textVariant}
              initial="hidden"
              animate={isLoaded ? "visible" : "hidden"}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <p className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-600 dark:from-sky-400 dark:to-blue-500">
                Senuja Masinghe · Data Science Undergraduate
              </p>
            </motion.div>

            <motion.h1 
              className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
              variants={textVariant}
              initial="hidden"
              animate={isLoaded ? "visible" : "hidden"}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {titleLetters.map((letter, index) => (
                <motion.span
                  key={index}
                  variants={letterVariant}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.03 }}
                >
                  {letter}
                </motion.span>
              ))}
            </motion.h1>

            <motion.p 
              className="max-w-xl text-sm text-slate-600 dark:text-slate-300 sm:text-base"
              variants={textVariant}
              initial="hidden"
              animate={isLoaded ? "visible" : "hidden"}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              3rd-year Data Science undergraduate at SLIIT with a strong
              interest in analysis, visualization, and building impactful
              data‑driven solutions using Python, SQL, and Power BI.
            </motion.p>

            <motion.div 
              className="flex flex-wrap gap-3"
              variants={textVariant}
              initial="hidden"
              animate={isLoaded ? "visible" : "hidden"}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <motion.a
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                href="http://localhost:5000/cv.pdf"
                className="relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg transition-all hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                <span className="relative z-10">Download CV</span>
                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-600 to-sky-500 opacity-0 transition-opacity hover:opacity-100"></div>
              </motion.a>

              <motion.button
                type="button"
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                onClick={() => scrollToSection("projects")}
                className="relative inline-flex items-center justify-center overflow-hidden rounded-lg border border-sky-500/30 bg-sky-50/50 px-5 py-2.5 text-sm font-medium text-sky-700 backdrop-blur-sm transition-all hover:bg-sky-100/70 dark:bg-sky-950/30 dark:text-sky-300 dark:hover:bg-sky-900/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                <span className="relative z-10">View projects</span>
                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-sky-500/10 to-blue-500/10 opacity-0 transition-opacity hover:opacity-100"></div>
              </motion.button>

              <motion.button
                type="button"
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                onClick={() => scrollToSection("contact")}
                className="relative inline-flex items-center justify-center overflow-hidden rounded-lg border border-slate-300 bg-white/50 px-5 py-2.5 text-sm font-medium backdrop-blur-sm transition-all hover:bg-slate-100/70 dark:border-slate-700 dark:bg-slate-900/50 dark:hover:bg-slate-800/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                <span className="relative z-10">Contact me</span>
                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-500/10 to-slate-600/10 opacity-0 transition-opacity hover:opacity-100"></div>
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right side: larger profile photo with enhanced animations */}
          <motion.div
            className="flex-1"
            variants={sectionVariant}
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative mx-auto flex max-w-xs flex-col items-center sm:max-w-md">
              {/* Enhanced animated gradient glow behind avatar */}
              <motion.div
                className="pointer-events-none absolute -inset-10 rounded-full bg-gradient-to-tr from-sky-500/40 via-violet-500/30 to-emerald-400/30 blur-3xl"
                animate={{ 
                  scale: [1, 1.07, 1], 
                  opacity: [0.7, 1, 0.7],
                  rotate: [0, 5, 0, -5, 0]
                }}
                transition={{ 
                  duration: 7, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              />

              {/* Bigger circular avatar frame with enhanced hover effect */}
              <motion.div
                whileHover={{ 
                  scale: 1.04, 
                  rotate: 2,
                  boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.3)"
                }}
                transition={{ type: "spring", stiffness: 200, damping: 18 }}
                className="relative h-56 w-56 overflow-hidden rounded-full border-4 border-white/50 bg-slate-900 shadow-2xl ring-4 ring-sky-500/40 backdrop-blur-sm dark:border-slate-800/50 sm:h-64 sm:w-64"
              >
                <img
                  src={profileImage}
                  alt="Senuja Masinghe"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              </motion.div>

              {/* Floating elements around the avatar */}
              <motion.div
                className="absolute top-10 right-10 h-6 w-6 rounded-full bg-sky-500/30 blur-md"
                animate={{
                  y: [0, -10, 0],
                  x: [0, 5, 0],
                  opacity: [0.3, 0.7, 0.3]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="absolute bottom-10 left-10 h-8 w-8 rounded-full bg-violet-500/30 blur-md"
                animate={{
                  y: [0, 10, 0],
                  x: [0, -5, 0],
                  opacity: [0.3, 0.7, 0.3]
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut"
                }}
              />
            </div>
          </motion.div>
        </SectionWrapper>

        {/* Current focus card with enhanced design */}
        <SectionWrapper className="pt-0">
          <motion.div
            variants={sectionVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="max-w-xl"
          >
            <div className="relative">
              <div className="pointer-events-none absolute -inset-4 rounded-3xl bg-gradient-to-tr from-sky-500/40 via-violet-500/30 to-emerald-400/30 blur-2xl" />
              <motion.div 
                className="relative rounded-3xl border border-slate-200/50 bg-white/80 p-6 shadow-xl backdrop-blur-sm dark:border-slate-800/50 dark:bg-slate-900/80"
                whileHover={{ y: -3, boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.15)" }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <p className="mb-3 text-xs font-medium uppercase tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-600 dark:from-sky-400 dark:to-blue-500">
                  Current focus
                </p>
                <ul className="space-y-2 text-xs">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-sky-500"></span>
                    <span>Data analysis with Python &amp; Pandas</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-violet-500"></span>
                    <span>Interactive dashboards using Power BI</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                    <span>SQL for querying and transforming data</span>
                  </li>
                </ul>
              </motion.div>
            </div>
          </motion.div>
        </SectionWrapper>

        {/* ============== About ============== */}
        <SectionWrapper id="about">
          <motion.div
            variants={sectionVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="grid items-start gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)]"
          >
            <div>
              <h2 className="mb-2 text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-50 dark:to-slate-400">About</h2>
              <p className="mb-3 text-sm text-slate-600 dark:text-slate-300">
                Data‑driven problem solver who enjoys turning messy, real‑world
                datasets into clear stories and actionable insights, with
                interest in end‑to‑end solutions from pipelines to dashboards.
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Currently studying at SLIIT and exploring statistics, machine
                learning, and data engineering while applying them in projects
                around education, healthcare, and productivity.
              </p>
            </div>

            <div className="relative space-y-4 border-l border-slate-200/50 pl-4 text-xs dark:border-slate-700/50">
              <div className="absolute -left-[5px] top-1 h-2 w-2 rounded-full bg-sky-500 shadow-lg shadow-sky-500/50" />
              <motion.div
                whileHover={{ x: 3 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <p className="text-[11px] uppercase tracking-wide text-slate-500">
                  2022 – Present
                </p>
                <p className="mt-0.5 font-semibold">
                  BSc (Hons) in Information Technology – Data Science
                </p>
                <p className="text-slate-600 dark:text-slate-300">
                  Sri Lanka Institute of Information Technology (SLIIT).
                </p>
              </motion.div>

              <div className="relative">
                <div className="absolute -left-[5px] top-1 h-2 w-2 rounded-full bg-violet-500 shadow-lg shadow-violet-500/50" />
                <motion.div
                  whileHover={{ x: 3 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <p className="text-[11px] uppercase tracking-wide text-slate-500">
                    2023 – Present
                  </p>
                  <p className="mt-0.5 font-semibold">Hands‑on projects</p>
                  <p className="text-slate-600 dark:text-slate-300">
                    Building dashboards, data pipelines, and full‑stack tools to
                    practice cloud, APIs, and analytics.
                  </p>
                </motion.div>
              </div>

              <div className="relative">
                <div className="absolute -left-[5px] top-1 h-2 w-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50" />
                <motion.div
                  whileHover={{ x: 3 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <p className="text-[11px] uppercase tracking-wide text-slate-500">
                    Next
                  </p>
                  <p className="mt-0.5 font-semibold">Internship &amp; research</p>
                  <p className="text-slate-600 dark:text-slate-300">
                    Looking for opportunities in data engineering, analytics, or
                    ML‑driven products.
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </SectionWrapper>

        {/* ============== Projects ============== */}
        <SectionWrapper id="projects">
          <motion.div
            variants={sectionVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-4 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-baseline">
              <div>
                <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-50 dark:to-slate-400">Projects</h2>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Academic and self-learning projects focused on data analysis,
                  visualization, and full‑stack solutions.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {PROJECT_CATEGORIES.map((cat) => (
                  <motion.button
                    key={cat}
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveFilter(cat)}
                    className={`rounded-full border px-3 py-1 text-[11px] font-medium transition-all ${
                      activeFilter === cat
                        ? "border-sky-600 bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg"
                        : "border-slate-300/50 bg-white/50 text-slate-700 hover:bg-slate-100/70 dark:border-slate-700/50 dark:bg-slate-900/50 dark:text-slate-200 dark:hover:bg-slate-800/70"
                    }`}
                  >
                    {cat}
                  </motion.button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-10">
                <div className="h-8 w-8 rounded-full border-2 border-sky-500 border-t-transparent animate-spin"></div>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProjects.map((project, index) => {
                  const thumb = project.images?.[0];
                  const hasRepo = !!project.links?.repo;
                  const hasDemo = !!project.links?.demo;

                  return (
                    <motion.article
                      key={project._id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ y: -5, scale: 1.02 }}
                      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/50 bg-white/80 shadow-sm backdrop-blur-sm transition-all hover:border-sky-500/50 hover:shadow-xl dark:border-slate-800/50 dark:bg-slate-900/80"
                    >
                      {thumb && (
                        <div className="relative h-40 w-full overflow-hidden border-b border-slate-100/50 dark:border-slate-800/50">
                          <img
                            src={thumb}
                            alt={project.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                      )}

                      <div className="flex flex-1 flex-col p-4">
                        <h3 className="mb-1 text-base font-semibold">
                          {project.title}
                        </h3>
                        <p className="mb-2 text-[11px] uppercase tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-600 dark:from-sky-400 dark:to-blue-500">
                          {project.category}
                        </p>

                        <p className="mb-3 line-clamp-3 text-xs text-slate-600 dark:text-slate-300">
                          {project.description}
                        </p>

                        <div className="mb-3 flex flex-wrap gap-1.5">
                          {project.techStack?.map((tech) => (
                            <span
                              key={tech}
                              className="rounded-full bg-slate-100/70 px-2 py-0.5 text-[11px] text-slate-700 dark:bg-slate-800/70 dark:text-slate-200"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>

                        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                          <Link
                            to={`/projects/${project._id}`}
                            className="text-xs font-medium text-sky-600 transition-colors hover:text-sky-500 hover:underline dark:text-sky-400"
                          >
                            View details →
                          </Link>

                          <div className="flex gap-2">
                            {hasDemo && (
                              <motion.a
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                href={project.links.demo}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-full border border-slate-300/50 bg-white/50 px-2 py-1 text-[11px] text-slate-700 hover:bg-slate-100/70 dark:border-slate-700/50 dark:bg-slate-900/50 dark:text-slate-200 dark:hover:bg-slate-800/70"
                              >
                                Live demo
                              </motion.a>
                            )}
                            {hasRepo && (
                              <motion.a
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                href={project.links.repo}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-full bg-gradient-to-r from-slate-900 to-slate-700 px-2 py-1 text-[11px] font-medium text-white hover:from-slate-800 hover:to-slate-600 dark:from-slate-100 dark:to-slate-300 dark:text-slate-900 dark:hover:from-slate-200 dark:hover:to-slate-400"
                              >
                                GitHub
                              </motion.a>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            )}
          </motion.div>
        </SectionWrapper>

        {/* ============== Skills ============== */}
        <SectionWrapper id="skills">
          <motion.div
            variants={sectionVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="mb-1 text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-50 dark:to-slate-400">Skills</h2>
            <p className="mb-6 text-sm text-slate-600 dark:text-slate-300">
              Core tools and concepts used in data science workflows.
            </p>

            {loading ? (
              <div className="flex justify-center py-10">
                <div className="h-8 w-8 rounded-full border-2 border-sky-500 border-t-transparent animate-spin"></div>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {skills.map((skill, index) => (
                  <motion.div
                    key={skill._id || skill.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ y: -3, scale: 1.02 }}
                    className="group flex items-center justify-between rounded-xl border border-slate-200/50 bg-white/80 px-3 py-2 text-xs shadow-sm backdrop-blur-sm transition-all hover:border-sky-500/50 hover:shadow-md dark:border-slate-800/50 dark:bg-slate-900/80"
                  >
                    <span className="font-medium">{skill.name}</span>
                    <span className="rounded-full bg-slate-100/70 px-2 py-0.5 text-slate-500 dark:bg-slate-800/70 dark:text-slate-400">{skill.category}</span>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </SectionWrapper>

        {/* ============== Achievements ============== */}
        <SectionWrapper id="achievements">
          <motion.div
            variants={sectionVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="mb-1 text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-50 dark:to-slate-400">Achievements</h2>
            <p className="mb-6 text-sm text-slate-600 dark:text-slate-300">
              Academic background and certifications.
            </p>

            {loading ? (
              <div className="flex justify-center py-10">
                <div className="h-8 w-8 rounded-full border-2 border-sky-500 border-t-transparent animate-spin"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {achievements.map((item, index) => (
                  <motion.div
                    key={item._id || item.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -3, x: 3 }}
                    className="group rounded-xl border border-slate-200/50 bg-white/80 p-4 shadow-sm backdrop-blur-sm transition-all hover:border-sky-500/50 hover:shadow-md dark:border-slate-800/50 dark:bg-slate-900/80"
                  >
                    <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-sm font-semibold">{item.title}</h3>
                      <span className="rounded-full bg-slate-100/70 px-2 py-0.5 text-[11px] text-slate-500 dark:bg-slate-800/70 dark:text-slate-400">
                        {item.date
                          ? new Date(item.date).toLocaleDateString()
                          : ""}
                      </span>
                    </div>
                    <p className="mb-1 text-[11px] text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-600 dark:from-sky-400 dark:to-blue-500">
                      {item.issuer}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      {item.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </SectionWrapper>

        {/* ============== Contact ============== */}
        <SectionWrapper id="contact">
          <motion.div
            variants={sectionVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="mb-1 text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-50 dark:to-slate-400">Contact</h2>
            <p className="mb-6 text-sm text-slate-600 dark:text-slate-300">
              Open to internships, data-related projects, and learning
              opportunities.
            </p>

            <form
              onSubmit={handleContactSubmit}
              className="max-w-xl space-y-4"
              noValidate
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <motion.div
                  whileFocus={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    required
                    value={contact.name}
                    onChange={handleContactChange}
                    className="w-full rounded-lg border border-slate-300/50 bg-white/80 px-3 py-2 text-xs outline-none transition-all focus-visible:ring-2 focus-visible:ring-sky-500 backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-900/80"
                  />
                </motion.div>
                <motion.div
                  whileFocus={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    required
                    value={contact.email}
                    onChange={handleContactChange}
                    className="w-full rounded-lg border border-slate-300/50 bg-white/80 px-3 py-2 text-xs outline-none transition-all focus-visible:ring-2 focus-visible:ring-sky-500 backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-900/80"
                  />
                </motion.div>
              </div>

              <motion.div
                whileFocus={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <textarea
                  rows="4"
                  name="message"
                  placeholder="Message"
                  required
                  value={contact.message}
                  onChange={handleContactChange}
                  className="w-full rounded-lg border border-slate-300/50 bg-white/80 px-3 py-2 text-xs outline-none transition-all focus-visible:ring-2 focus-visible:ring-sky-500 backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-900/80"
                />
              </motion.div>

              <motion.button
                type="submit"
                disabled={sending}
                whileHover={!sending ? { scale: 1.03, y: -2 } : {}}
                whileTap={!sending ? { scale: 0.98 } : {}}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 px-5 py-2.5 text-xs font-medium text-white shadow-lg transition-all hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                <span className="relative z-10">{sending ? "Sending..." : "Send message"}</span>
                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-600 to-sky-500 opacity-0 transition-opacity hover:opacity-100 disabled:hover:opacity-0"></div>
              </motion.button>

              {status && (
                <motion.p 
                  className="text-xs text-slate-600 dark:text-slate-300"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {status}
                </motion.p>
              )}
            </form>
          </motion.div>
        </SectionWrapper>
      </main>

      <Footer />
    </div>
  );
}

export default HomePage;