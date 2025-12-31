import { useParams } from "react-router-dom";
import Navbar from "../components/layouts/Navbar";
import Footer from "../components/layouts/Footer";
import { useEffect, useState } from "react";
import axios from "axios";

function ProjectDetailPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/projects/${id}`)
      .then((res) => setProject(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!project) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
        <p className="text-slate-600 dark:text-slate-300 mb-6">
          {project.description}
        </p>
        {/* render techStack, links, images, etc. */}
      </main>
      <Footer />
    </div>
  );
}

export default ProjectDetailPage;


