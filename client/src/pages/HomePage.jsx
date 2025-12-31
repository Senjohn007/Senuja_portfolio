// src/pages/HomePage.jsx
import Navbar from "../components/layouts/Navbar";
import Footer from "../components/layouts/Footer";
import SectionWrapper from "../components/layouts/SectionWrapper";
import { Link } from "react-router-dom";


function HomePage() {
  const projects = [
    {
      _id: "demo-1",
      title: "AI Study Planner",
      description:
        "Smart study planner that uses AI to generate personalized schedules and track your progress.",
      techStack: ["React", "Node.js", "MongoDB"],
    },
    {
      _id: "demo-2",
      title: "Green Village Guesthouse",
      description:
        "Guesthouse management system with bookings, payments, and analytics dashboard.",
      techStack: ["React", "Supabase", "Tailwind"],
    },
    {
      _id: "demo-3",
      title: "E-Prescription System",
      description:
        "Hospital e-prescription platform for doctors, pharmacists, and patients.",
      techStack: [".NET", "React", "SQL Server"],
    },
  ];

  const skills = [
    { name: "React", category: "Frontend" },
    { name: "Tailwind CSS", category: "Frontend" },
    { name: "Node.js", category: "Backend" },
    { name: "Express", category: "Backend" },
    { name: "MongoDB", category: "Data" },
    { name: "Docker", category: "Tools" },
    { name: "Kubernetes", category: "Tools" },
    { name: "Git & GitHub", category: "Tools" },
  ];

  const achievements = [
    {
      title: "3rd Year SE Student – SLIIT",
      issuer: "SLIIT",
      date: "Ongoing",
      description: "Specializing in full‑stack web development and software architecture.",
    },
    {
      title: "Project Lead – Group Projects",
      issuer: "SLIIT",
      date: "2023–2025",
      description: "Led multiple MERN and microservices based academic projects.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50">
      <Navbar />

      <main>
        {/* Hero */}
        <SectionWrapper id="hero" className="flex flex-col gap-10 md:flex-row md:items-center">
          <div className="flex-1 space-y-6">
            <p className="text-sm font-medium text-sky-600 dark:text-sky-400">
              Software Engineering Student · MERN · Kubernetes
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
              Building practical, production‑ready web applications.
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl">
              A 3rd‑year Software Engineering student at SLIIT focused on full‑stack MERN,
              microservices, and modern DevOps workflows using Docker and Kubernetes.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => {
                  const el = document.getElementById("projects");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-sky-700 transition"
              >
                View projects
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById("contact");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center rounded-lg border border-slate-300 dark:border-slate-700 px-5 py-2.5 text-sm font-medium text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Contact me
              </button>
            </div>
          </div>

          <div className="flex-1">
            <div className="relative mx-auto max-w-sm">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-sky-500/40 via-violet-500/30 to-emerald-400/30 blur-2xl" />
              <div className="relative rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-6 shadow-xl">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-3">
                  Current focus
                </p>
                <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-200">
                  <li>· MERN microservices with Kubernetes and Docker</li>
                  <li>· Hospital E‑Prescription and Guesthouse systems</li>
                  <li>· Clean, responsive UIs with React + Tailwind</li>
                </ul>
              </div>
            </div>
          </div>
        </SectionWrapper>

        {/* Projects */}
        <SectionWrapper id="projects">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Featured projects</h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Real‑world applications built with modern stacks.
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {projects.map((project) => (
              <div
                key={project._id}
                className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm hover:shadow-md transition"
              >
                <h3 className="text-base font-semibold mb-2 group-hover:text-sky-600 dark:group-hover:text-sky-400">
                  {project.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mb-3 line-clamp-3">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[11px] text-slate-700 dark:text-slate-200"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <Link
                  to={`/projects/${project._id}`}
                  className="inline-flex items-center text-xs font-medium text-sky-600 dark:text-sky-400 hover:underline"
                >
                  View details
                </Link>
              </div>
            ))}
          </div>
        </SectionWrapper>

        {/* Skills */}
        <SectionWrapper id="skills">
          <h2 className="text-2xl font-semibold tracking-tight mb-2">Skills</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">
            A balanced stack across frontend, backend, data, and DevOps.
          </p>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {skills.map((skill) => (
              <div
                key={skill.name}
                className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs"
              >
                <span className="font-medium">{skill.name}</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {skill.category}
                </span>
              </div>
            ))}
          </div>
        </SectionWrapper>

        {/* Achievements */}
        <SectionWrapper id="achievements">
          <h2 className="text-2xl font-semibold tracking-tight mb-2">Achievements</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">
            Education and roles that shaped current engineering skills.
          </p>

          <div className="space-y-4">
            {achievements.map((a) => (
              <div
                key={a.title}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4"
              >
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-semibold">{a.title}</h3>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    {a.date}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                  {a.issuer}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {a.description}
                </p>
              </div>
            ))}
          </div>
        </SectionWrapper>

        {/* Contact */}
        <SectionWrapper id="contact">
          <h2 className="text-2xl font-semibold tracking-tight mb-2">Contact</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">
            Have a project, internship, or collaboration in mind? Reach out.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              // later: call POST /api/messages
            }}
            className="max-w-xl space-y-4"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium mb-1">Name</label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Email</label>
                <input
                  type="email"
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">Message</label>
              <textarea
                rows="4"
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                required
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center rounded-lg bg-sky-600 px-5 py-2.5 text-xs font-medium text-white hover:bg-sky-700 transition"
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
