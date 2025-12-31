// src/pages/HomePage.jsx
import Navbar from "../components/layouts/Navbar";
import Footer from "../components/layouts/Footer";
import SectionWrapper from "../components/layouts/SectionWrapper";
import { Link } from "react-router-dom";

/* =======================
   Static Data
======================= */

const PROJECTS = [
  {
    _id: "customer-analytics",
    title: "Customer Analytics Dashboard",
    description:
      "An end-to-end Power BI dashboard analyzing customer behavior, revenue trends, and retention using an e-commerce dataset.",
    techStack: ["Power BI", "DAX", "SQL"],
  },
  {
    _id: "sales-analysis",
    title: "Sales Performance Analysis",
    description:
      "Data analysis project focused on identifying top-performing products, regions, and time-based sales patterns.",
    techStack: ["Python", "Pandas", "Matplotlib"],
  },
  {
    _id: "student-performance",
    title: "Student Performance Analysis",
    description:
      "Exploratory data analysis project examining academic performance factors and trends using structured datasets.",
    techStack: ["Python", "NumPy", "Pandas"],
  },
];

const SKILLS = [
  { name: "Python", category: "Programming" },
  { name: "Pandas", category: "Data Analysis" },
  { name: "NumPy", category: "Data Analysis" },
  { name: "Matplotlib", category: "Visualization" },
  { name: "Power BI", category: "Visualization" },
  { name: "SQL", category: "Databases" },
  { name: "Statistics", category: "Foundations" },
  { name: "Git & GitHub", category: "Tools" },
];

const ACHIEVEMENTS = [
  {
    title: "3rd Year Data Science Undergraduate",
    issuer: "Sri Lanka Institute of Information Technology (SLIIT)",
    date: "Ongoing",
    description:
      "Specializing in data analysis, data visualization, and applied statistics with hands-on academic projects.",
  },
  {
    title: "Completed Data Analytics & Data Science Certifications",
    issuer: "Cisco Networking Academy",
    date: "2024",
    description:
      "Completed Data Analytics Essentials and Data Science Essentials with Python, focusing on real-world datasets.",
  },
];

/* =======================
   Helpers
======================= */

const scrollToSection = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

/* =======================
   Component
======================= */

function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50">
      <Navbar />

      <main>
        {/* ================= Hero ================= */}
        <SectionWrapper
          id="hero"
          className="flex flex-col gap-10 md:flex-row md:items-center"
        >
          <div className="flex-1 space-y-6">
            <p className="text-sm font-medium text-sky-600 dark:text-sky-400">
              Senuja Masinghe · Data Science Undergraduate
            </p>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
              Turning data into meaningful insights.
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl">
              I’m a 3rd-year Data Science undergraduate at SLIIT with a strong
              interest in data analysis, visualization, and extracting insights
              from real-world datasets using Python, SQL, and Power BI.
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => scrollToSection("projects")}
                className="rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-sky-700 transition"
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
          </div>

          <div className="flex-1">
            <div className="relative mx-auto max-w-sm">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-sky-500/40 via-violet-500/30 to-emerald-400/30 blur-2xl" />
              <div className="relative rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-6 shadow-xl">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-3">
                  Current focus
                </p>
                <ul className="space-y-2 text-xs">
                  <li>• Data analysis with Python & Pandas</li>
                  <li>• Interactive dashboards using Power BI</li>
                  <li>• SQL for querying and transforming data</li>
                </ul>
              </div>
            </div>
          </div>
        </SectionWrapper>

        {/* ================= Projects ================= */}
        <SectionWrapper id="projects">
          <h2 className="text-2xl font-semibold mb-1">Projects</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">
            Academic and self-learning projects focused on data analysis and visualization.
          </p>

          <div className="grid gap-6 md:grid-cols-3">
            {PROJECTS.map((project) => (
              <div
                key={project._id}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 hover:shadow-md transition"
              >
                <h3 className="text-base font-semibold mb-2">
                  {project.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 mb-3 line-clamp-3">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {project.techStack.map((tech) => (
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
              </div>
            ))}
          </div>
        </SectionWrapper>

        {/* ================= Skills ================= */}
        <SectionWrapper id="skills">
          <h2 className="text-2xl font-semibold mb-1">Skills</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">
            Core tools and concepts used in data science workflows.
          </p>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {SKILLS.map((skill) => (
              <div
                key={skill.name}
                className="flex justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs"
              >
                <span className="font-medium">{skill.name}</span>
                <span className="text-slate-500">{skill.category}</span>
              </div>
            ))}
          </div>
        </SectionWrapper>

        {/* ================= Achievements ================= */}
        <SectionWrapper id="achievements">
          <h2 className="text-2xl font-semibold mb-1">Achievements</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">
            Academic background and certifications.
          </p>

          <div className="space-y-4">
            {ACHIEVEMENTS.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4"
              >
                <div className="flex justify-between mb-1">
                  <h3 className="text-sm font-semibold">{item.title}</h3>
                  <span className="text-[11px] text-slate-500">
                    {item.date}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mb-1">
                  {item.issuer}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </SectionWrapper>

        {/* ================= Contact ================= */}
        <SectionWrapper id="contact">
          <h2 className="text-2xl font-semibold mb-1">Contact</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">
            Open to internships, data-related projects, and learning opportunities.
          </p>

          <form className="max-w-xl space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                type="text"
                placeholder="Name"
                required
                className="rounded-lg border px-3 py-2 text-xs"
              />
              <input
                type="email"
                placeholder="Email"
                required
                className="rounded-lg border px-3 py-2 text-xs"
              />
            </div>

            <textarea
              rows="4"
              placeholder="Message"
              required
              className="w-full rounded-lg border px-3 py-2 text-xs"
            />

            <button
              type="submit"
              className="rounded-lg bg-sky-600 px-5 py-2.5 text-xs font-medium text-white hover:bg-sky-700"
            >
              Send message
            </button>
          </form>
        </SectionWrapper>
      </main>

      <Footer />
    </div>
  );
}

export default HomePage;
