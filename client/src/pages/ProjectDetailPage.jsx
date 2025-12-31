import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/layouts/Navbar";
import Footer from "../components/layouts/Footer";
import { getProject } from "../lib/api"; // or create getProjectById

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
        <main className="max-w-4xl mx-auto px-4 py-10">
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
        <main className="max-w-4xl mx-auto px-4 py-10">
          <p className="text-sm text-red-500">Project not found.</p>
          <Link to="/" className="text-sm text-sky-600 hover:underline">
            ← Back to projects
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-10 space-y-8">
        <div>
          <p className="text-xs text-slate-500 mb-1">{project.category}</p>
          <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {project.description}
          </p>
        </div>

        <section>
          <h2 className="text-lg font-semibold mb-2">Problem</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {project.problem || "Describe the real-world problem this project solves."}
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">Solution & Features</h2>
          <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-300">
            {(project.features || []).map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">Tech stack</h2>
          <div className="flex flex-wrap gap-2">
            {project.techStack?.map((t) => (
              <span
                key={t}
                className="px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs"
              >
                {t}
              </span>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">Challenges & learnings</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {project.learnings ||
              "Summarize key implementation challenges and what you learned."}
          </p>
        </section>

        <section className="flex flex-wrap gap-3 text-sm">
          {project.links?.demo && (
            <a
              href={project.links.demo}
              target="_blank"
              rel="noreferrer"
              className="text-sky-600 hover:underline"
            >
              Live demo
            </a>
          )}
          {project.links?.repo && (
            <a
              href={project.links.repo}
              target="_blank"
              rel="noreferrer"
              className="text-sky-600 hover:underline"
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
