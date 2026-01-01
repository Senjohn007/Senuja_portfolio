// client/src/pages/ProjectDetailPage.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/layouts/Navbar";
import Footer from "../components/layouts/Footer";
import { getProject } from "../lib/api";

function ProjectDetailPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getProject(id);
        setProject(data || null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <Navbar />
        <main className="mx-auto max-w-4xl px-4 py-10">
          <p className="text-sm text-slate-500">Loading project...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <Navbar />
        <main className="mx-auto max-w-4xl px-4 py-10 space-y-3">
          <p className="text-sm text-red-500">Project not found.</p>
          <Link to="/" className="text-sm text-sky-600 hover:underline">
            ← Back to projects
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const thumb = project.images?.[0];
  const created =
    project.createdAt && new Date(project.createdAt).toLocaleDateString();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-10 space-y-8">
        {/* Header + hero image */}
        <header className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">
                {project.category}
                {created && ` · ${created}`}
              </p>
              <h1 className="mt-1 text-3xl font-bold">{project.title}</h1>
            </div>
            {project.featured && (
              <span className="rounded-full bg-amber-100 px-3 py-1 text-[11px] font-medium text-amber-700">
                Featured project
              </span>
            )}
          </div>

          <p className="max-w-2xl text-sm text-slate-600 dark:text-slate-300">
            {project.description}
          </p>

          {thumb && (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900">
              <img
                src={thumb}
                alt={project.title}
                className="h-64 w-full object-cover md:h-80"
                loading="lazy"
              />
            </div>
          )}
        </header>

        {/* Problem */}
        <section>
          <h2 className="mb-2 text-lg font-semibold">Problem</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {project.problem ||
              "Describe the real-world problem this project solves, such as inefficient workflows, poor visibility, or manual processes."}
          </p>
        </section>

        {/* Solution & features */}
        <section>
          <h2 className="mb-2 text-lg font-semibold">Solution & features</h2>
          {project.features && project.features.length > 0 ? (
            <ul className="list-disc space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-300">
              {project.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">
              Highlight the main features here: dashboards, automation flows,
              integrations, authentication, role‑based access, etc.
            </p>
          )}
        </section>

        {/* Tech stack */}
        <section>
          <h2 className="mb-2 text-lg font-semibold">Tech stack</h2>
          {project.techStack && project.techStack.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-800 dark:bg-slate-800 dark:text-slate-100"
                >
                  {t}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">
              List technologies used across frontend, backend, data, and tools.
            </p>
          )}
        </section>

        {/* Challenges and learnings */}
        <section>
          <h2 className="mb-2 text-lg font-semibold">Challenges & learnings</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {project.learnings ||
              "Summarize key implementation challenges (performance, data modeling, auth, deployment) and what you learned from solving them."}
          </p>
        </section>

        {/* Links */}
        <section className="flex flex-wrap gap-3 text-sm">
          {project.links?.demo && (
            <a
              href={project.links.demo}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 px-3 py-1 text-xs font-medium text-slate-800 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              Live demo
            </a>
          )}
          {project.links?.repo && (
            <a
              href={project.links.repo}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
            >
              GitHub repo
            </a>
          )}
        </section>

        <Link to="/" className="text-sm text-sky-600 hover:underline">
          ← Back to projects
        </Link>
      </main>

      <Footer />
    </div>
  );
}

export default ProjectDetailPage;
