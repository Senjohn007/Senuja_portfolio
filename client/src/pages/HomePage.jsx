// src/pages/HomePage.jsx
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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      <Navbar />

      <main>
        {/* ============== Hero ============== */}
        <SectionWrapper
          id="hero"
          className="flex flex-col gap-10 md:flex-row md:items-center"
        >
          <motion.div
            variants={sectionVariant}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6 }}
            className="flex-1 space-y-6"
          >
            <p className="text-sm font-medium text-sky-600 dark:text-sky-400">
              Senuja Masinghe · Data Science Undergraduate
            </p>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Turning data into meaningful insights.
            </h1>

            <p className="max-w-xl text-sm text-slate-600 dark:text-slate-300 sm:text-base">
              3rd-year Data Science undergraduate at SLIIT with a strong
              interest in analysis, visualization, and building impactful
              data‑driven solutions using Python, SQL, and Power BI.
            </p>

            <div className="flex flex-wrap gap-3">
              <motion.a
                whileHover={{ scale: 1.03, y: -2 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                href="http://localhost:5000/cv.pdf"
                className="inline-flex items-center justify-center rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-sky-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                Download CV
              </motion.a>

              <motion.button
                type="button"
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                onClick={() => scrollToSection("projects")}
                className="inline-flex items-center justify-center rounded-lg border border-sky-600 px-5 py-2.5 text-sm font-medium text-sky-700 transition-colors hover:bg-sky-50 dark:text-sky-300 dark:hover:bg-slate-900/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                View projects
              </motion.button>

              <motion.button
                type="button"
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                onClick={() => scrollToSection("contact")}
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium transition-colors hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                Contact me
              </motion.button>
            </div>
          </motion.div>

          {/* Right side: larger profile photo */}
          <motion.div
            className="flex-1"
            variants={sectionVariant}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="relative mx-auto flex max-w-xs flex-col items-center sm:max-w-md">
              {/* Animated gradient glow behind avatar */}
              <motion.div
                className="pointer-events-none absolute -inset-10 rounded-full bg-gradient-to-tr from-sky-500/40 via-violet-500/30 to-emerald-400/30 blur-3xl"
                animate={{ scale: [1, 1.07, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* Bigger circular avatar frame */}
              <motion.div
                whileHover={{ scale: 1.04, rotate: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 18 }}
                className="relative h-56 w-56 overflow-hidden rounded-full border-4 border-slate-100 bg-slate-900 shadow-2xl ring-4 ring-sky-500/40 dark:border-slate-800 sm:h-64 sm:w-64"
              >
                <img
                  src={profileImage}
                  alt="Senuja Masinghe"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </motion.div>
            </div>
          </motion.div>
        </SectionWrapper>

        {/* Current focus card moved under hero, aligned with content */}
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
              <div className="relative rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900/80">
                <p className="mb-3 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Current focus
                </p>
                <ul className="space-y-2 text-xs">
                  <li>• Data analysis with Python &amp; Pandas</li>
                  <li>• Interactive dashboards using Power BI</li>
                  <li>• SQL for querying and transforming data</li>
                </ul>
              </div>
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
              <h2 className="mb-2 text-2xl font-semibold">About</h2>
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

            <div className="relative space-y-4 border-l border-slate-200 pl-4 text-xs dark:border-slate-700">
              <div className="absolute -left-[5px] top-1 h-2 w-2 rounded-full bg-sky-500" />
              <div>
                <p className="text-[11px] uppercase tracking-wide text-slate-500">
                  2022 – Present
                </p>
                <p className="mt-0.5 font-semibold">
                  BSc (Hons) in Information Technology – Data Science
                </p>
                <p className="text-slate-600 dark:text-slate-300">
                  Sri Lanka Institute of Information Technology (SLIIT).
                </p>
              </div>

              <div className="relative">
                <div className="absolute -left-[5px] top-1 h-2 w-2 rounded-full bg-sky-500" />
                <p className="text-[11px] uppercase tracking-wide text-slate-500">
                  2023 – Present
                </p>
                <p className="mt-0.5 font-semibold">Hands‑on projects</p>
                <p className="text-slate-600 dark:text-slate-300">
                  Building dashboards, data pipelines, and full‑stack tools to
                  practice cloud, APIs, and analytics.
                </p>
              </div>

              <div className="relative">
                <div className="absolute -left-[5px] top-1 h-2 w-2 rounded-full bg-sky-500" />
                <p className="text-[11px] uppercase tracking-wide text-slate-500">
                  Next
                </p>
                <p className="mt-0.5 font-semibold">Internship &amp; research</p>
                <p className="text-slate-600 dark:text-slate-300">
                  Looking for opportunities in data engineering, analytics, or
                  ML‑driven products.
                </p>
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
                <h2 className="text-2xl font-semibold">Projects</h2>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Academic and self-learning projects focused on data analysis,
                  visualization, and full‑stack solutions.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {PROJECT_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveFilter(cat)}
                    className={`rounded-full border px-3 py-1 text-[11px] font-medium transition-colors ${
                      activeFilter === cat
                        ? "border-sky-600 bg-sky-600 text-white"
                        : "border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <p className="text-sm text-slate-500">Loading projects...</p>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProjects.map((project) => {
                  const thumb = project.images?.[0];
                  const hasRepo = !!project.links?.repo;
                  const hasDemo = !!project.links?.demo;

                  return (
                    <motion.article
                      key={project._id}
                      whileHover={{ y: -4, scale: 1.02 }}
                      transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                      }}
                      className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-colors hover:border-sky-500/80 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                    >
                      {thumb && (
                        <div className="h-40 w-full overflow-hidden border-b border-slate-100 dark:border-slate-800">
                          <img
                            src={thumb}
                            alt={project.title}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                          />
                        </div>
                      )}

                      <div className="flex flex-1 flex-col p-4">
                        <h3 className="mb-1 text-base font-semibold">
                          {project.title}
                        </h3>
                        <p className="mb-2 text-[11px] uppercase tracking-wide text-slate-500">
                          {project.category}
                        </p>

                        <p className="mb-3 line-clamp-3 text-xs text-slate-600 dark:text-slate-300">
                          {project.description}
                        </p>

                        <div className="mb-3 flex flex-wrap gap-1.5">
                          {project.techStack?.map((tech) => (
                            <span
                              key={tech}
                              className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-700 dark:bg-slate-800 dark:text-slate-200"
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
                              <a
                                href={project.links.demo}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-full border border-slate-300 px-2 py-1 text-[11px] text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                              >
                                Live demo
                              </a>
                            )}
                            {hasRepo && (
                              <a
                                href={project.links.repo}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-full bg-slate-900 px-2 py-1 text-[11px] font-medium text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
                              >
                                GitHub
                              </a>
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
            <h2 className="mb-1 text-2xl font-semibold">Skills</h2>
            <p className="mb-6 text-sm text-slate-600 dark:text-slate-300">
              Core tools and concepts used in data science workflows.
            </p>

            {loading ? (
              <p className="text-sm text-slate-500">Loading skills...</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {skills.map((skill) => (
                  <motion.div
                    key={skill._id || skill.name}
                    whileHover={{ y: -2, scale: 1.01 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                    }}
                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs shadow-sm transition-colors hover:border-sky-500/80 dark:border-slate-800 dark:bg-slate-900"
                  >
                    <span className="font-medium">{skill.name}</span>
                    <span className="text-slate-500">{skill.category}</span>
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
            <h2 className="mb-1 text-2xl font-semibold">Achievements</h2>
            <p className="mb-6 text-sm text-slate-600 dark:text-slate-300">
              Academic background and certifications.
            </p>

            {loading ? (
              <p className="text-sm text-slate-500">Loading achievements...</p>
            ) : (
              <div className="space-y-4">
                {achievements.map((item) => (
                  <motion.div
                    key={item._id || item.title}
                    whileHover={{ y: -2, scale: 1.01 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                    }}
                    className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-colors hover:border-sky-500/80 dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-sm font-semibold">{item.title}</h3>
                      <span className="text-[11px] text-slate-500">
                        {item.date
                          ? new Date(item.date).toLocaleDateString()
                          : ""}
                      </span>
                    </div>
                    <p className="mb-1 text-[11px] text-slate-500">
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
            <h2 className="mb-1 text-2xl font-semibold">Contact</h2>
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
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  required
                  value={contact.name}
                  onChange={handleContactChange}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs outline-none transition focus-visible:ring-2 focus-visible:ring-sky-500 dark:border-slate-700 dark:bg-slate-900"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  value={contact.email}
                  onChange={handleContactChange}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs outline-none transition focus-visible:ring-2 focus-visible:ring-sky-500 dark:border-slate-700 dark:bg-slate-900"
                />
              </div>

              <textarea
                rows="4"
                name="message"
                placeholder="Message"
                required
                value={contact.message}
                onChange={handleContactChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs outline-none transition focus-visible:ring-2 focus-visible:ring-sky-500 dark:border-slate-700 dark:bg-slate-900"
              />

              <motion.button
                type="submit"
                disabled={sending}
                whileHover={!sending ? { y: -2 } : {}}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="inline-flex items-center justify-center rounded-lg bg-sky-600 px-5 py-2.5 text-xs font-medium text-white shadow-sm transition-colors hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                {sending ? "Sending..." : "Send message"}
              </motion.button>

              {status && (
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {status}
                </p>
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
