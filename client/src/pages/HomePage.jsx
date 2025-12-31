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

/* =======================
   Helpers
======================= */

const PROJECT_CATEGORIES = ["All", "Data"];

const scrollToSection = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

/* =======================
   Component
======================= */

function HomePage() {
  // API data
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  // project filter
  const [activeFilter, setActiveFilter] = useState("All");

  // contact form
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50">
      <Navbar />

      <main>
        {/* ================= Hero ================= */}
        <SectionWrapper
          id="hero"
          className="flex flex-col gap-10 md:flex-row md:items-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 space-y-6"
          >
            <p className="text-sm font-medium text-sky-600 dark:text-sky-400">
              Senuja Masinghe · Data Science Undergraduate
            </p>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
              Turning data into meaningful insights.
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl">
              3rd-year Data Science undergraduate at SLIIT with a strong
              interest in analysis, visualization, and building impactful
              data‑driven solutions using Python, SQL, and Power BI.
            </p>

            <div className="flex flex-wrap gap-3">
              <a
                href="/files/my.cv" // keep in sync with server/public filename
                className="rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-sky-700 transition"
              >
                Download CV
              </a>

              <button
                onClick={() => scrollToSection("projects")}
                className="rounded-lg border border-sky-600 px-5 py-2.5 text-sm font-medium text-sky-700 dark:text-sky-300 hover:bg-sky-50 dark:hover:bg-slate-900/60 transition"
              >
                View projects
              </button>

              <button
                onClick={() => scrollToSection("contact")}
                className="rounded-lg border border-slate-300 dark:border-slate-700 px-5 py-2.5 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Contact me
              </button>
            </div>
          </motion.div>

          <motion.div
            className="flex-1"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="relative mx-auto max-w-sm">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-sky-500/40 via-violet-500/30 to-emerald-400/30 blur-2xl" />
              <div className="relative rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-6 shadow-xl">
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

        {/* ================= About ================= */}
        <SectionWrapper id="about">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="grid gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)] items-start"
          >
            <div>
              <h2 className="mb-2 text-2xl font-semibold">About</h2>
              <p className="mb-3 text-sm text-slate-600 dark:text-slate-300">
                Data‑driven problem solver who enjoys turning messy, real‑world
                datasets into clear stories and actionable insights. Passionate
                about building end‑to‑end solutions, from data pipelines to
                dashboards.
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Currently studying at SLIIT, exploring statistics, machine
                learning, and data engineering while applying them in projects
                around education, healthcare, and productivity.
              </p>
            </div>

            {/* simple vertical timeline */}
            <div className="relative pl-4 border-l border-slate-200 dark:border-slate-700 text-xs space-y-4">
              <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-sky-500" />
              <div>
                <p className="text-[11px] uppercase tracking-wide text-slate-500">
                  2022 – Present
                </p>
                <p className="font-semibold mt-0.5">
                  BSc (Hons) in Information Technology – Data Science
                </p>
                <p className="text-slate-600 dark:text-slate-300">
                  Sri Lanka Institute of Information Technology (SLIIT).
                </p>
              </div>

              <div className="relative">
                <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-sky-500" />
                <p className="text-[11px] uppercase tracking-wide text-slate-500">
                  2023 – Present
                </p>
                <p className="font-semibold mt-0.5">Hands‑on projects</p>
                <p className="text-slate-600 dark:text-slate-300">
                  Building dashboards, data pipelines, and full‑stack tools to
                  practice cloud, APIs, and analytics.
                </p>
              </div>

              <div className="relative">
                <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-sky-500" />
                <p className="text-[11px] uppercase tracking-wide text-slate-500">
                  Next
                </p>
                <p className="font-semibold mt-0.5">Internship & research</p>
                <p className="text-slate-600 dark:text-slate-300">
                  Looking for opportunities in data engineering, analytics, or
                  ML‑driven products.
                </p>
              </div>
            </div>
          </motion.div>
        </SectionWrapper>

        {/* ================= Projects ================= */}
        <SectionWrapper id="projects">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-4 flex items-baseline justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold">Projects</h2>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Academic and self-learning projects focused on data analysis
                  and visualization.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {PROJECT_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveFilter(cat)}
                    className={`rounded-full border px-3 py-1 text-[11px] font-medium transition ${
                      activeFilter === cat
                        ? "border-sky-600 bg-sky-600 text-white"
                        : "border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
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
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                {filteredProjects.map((project) => (
                  <motion.div
                    key={project._id}
                    className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 hover:-translate-y-1 hover:shadow-md transition"
                    whileHover={{ y: -4 }}
                  >
                    <h3 className="mb-2 text-base font-semibold">
                      {project.title}
                    </h3>

                    <p className="mb-3 text-xs text-slate-600 dark:text-slate-300 line-clamp-3">
                      {project.description}
                    </p>

                    <div className="mb-3 flex flex-wrap gap-1.5">
                      {project.techStack?.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[11px]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <Link
                      to={`/projects/${project._id}`}
                      className="text-xs font-medium text-sky-600 dark:text-sky-400 hover:underline"
                    >
                      View details →
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </SectionWrapper>

        {/* ================= Skills ================= */}
        <SectionWrapper id="skills">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
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
                  <div
                    key={skill._id || skill.name}
                    className="flex justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs"
                  >
                    <span className="font-medium">{skill.name}</span>
                    <span className="text-slate-500">{skill.category}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </SectionWrapper>

        {/* ================= Achievements ================= */}
        <SectionWrapper id="achievements">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="mb-1 text-2xl font-semibold">Achievements</h2>
            <p className="mb-6 text-sm text-slate-600 dark:text-slate-300">
              Academic background and certifications.
            </p>

            {loading ? (
              <p className="text-sm text-slate-500">
                Loading achievements...
              </p>
            ) : (
              <div className="space-y-4">
                {achievements.map((item) => (
                  <div
                    key={item._id || item.title}
                    className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4"
                  >
                    <div className="mb-1 flex justify-between">
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
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </SectionWrapper>

        {/* ================= Contact ================= */}
        <SectionWrapper id="contact">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
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
                  className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-sky-500"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  value={contact.email}
                  onChange={handleContactChange}
                  className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <textarea
                rows="4"
                name="message"
                placeholder="Message"
                required
                value={contact.message}
                onChange={handleContactChange}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-sky-500"
              />

              <button
                type="submit"
                disabled={sending}
                className="rounded-lg bg-sky-600 px-5 py-2.5 text-xs font-medium text-white hover:bg-sky-700 disabled:opacity-60"
              >
                {sending ? "Sending..." : "Send message"}
              </button>

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
