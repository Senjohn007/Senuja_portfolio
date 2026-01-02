import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/layouts/Navbar";
import Footer from "../components/layouts/Footer";
import { getProject } from "../lib/api";
import { 
  FiArrowLeft, 
  FiExternalLink, 
  FiGithub, 
  FiCalendar, 
  FiTag,
  FiStar,
  FiX,
  FiChevronLeft,
  FiChevronRight
} from "react-icons/fi";

function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageIndex, setImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

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

  const nextImage = () => {
    if (!project?.images) return;
    setImageIndex((prev) => (prev + 1) % project.images.length);
  };

  const prevImage = () => {
    if (!project?.images) return;
    setImageIndex((prev) => (prev - 1 + project.images.length) % project.images.length);
  };

  const openLightbox = (index) => {
    setImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  // Loading state with skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-50">
        <Navbar />
        <main className="mx-auto max-w-4xl px-4 py-10">
          <div className="space-y-4">
            <div className="h-8 w-48 bg-slate-200 rounded animate-pulse dark:bg-slate-800"></div>
            <div className="h-4 w-64 bg-slate-200 rounded animate-pulse dark:bg-slate-800"></div>
            <div className="h-64 bg-slate-200 rounded-lg animate-pulse dark:bg-slate-800"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Error state
  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-50">
        <Navbar />
        <main className="mx-auto max-w-4xl px-4 py-10 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16"
          >
            <div className="mb-4 text-6xl">🔍</div>
            <h1 className="text-2xl font-bold mb-2">Project not found</h1>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              The project you're looking for doesn't exist or has been removed.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-2 text-sm font-medium text-white"
            >
              <FiArrowLeft className="w-4 h-4" />
              Back to projects
            </motion.button>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  const thumb = project.images?.[0];
  const created =
    project.createdAt && new Date(project.createdAt).toLocaleDateString();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-50">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-br from-sky-400/10 to-blue-600/10 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-tr from-purple-400/10 to-pink-600/10 blur-3xl"></div>
      </div>

      <Navbar />

      <main className="relative z-10 mx-auto max-w-4xl px-4 py-10 space-y-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Back button */}
          <motion.div variants={itemVariants}>
            <motion.button
              whileHover={{ x: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 hover:text-sky-500 dark:hover:text-sky-400 transition-colors"
            >
              <FiArrowLeft className="w-4 h-4" />
              Back to projects
            </motion.button>
          </motion.div>

          {/* Header + hero image */}
          <motion.header variants={itemVariants} className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <FiTag className="w-3 h-3" />
                  <span className="uppercase tracking-wide">{project.category}</span>
                  {created && (
                    <>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <FiCalendar className="w-3 h-3" />
                        {created}
                      </span>
                    </>
                  )}
                </div>
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-50 dark:to-slate-400">
                  {project.title}
                </h1>
              </div>
              {project.featured && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 px-3 py-1 text-xs font-medium text-white shadow-lg"
                >
                  <FiStar className="w-3 h-3" />
                  Featured
                </motion.div>
              )}
            </div>

            <p className="max-w-2xl text-sm text-slate-600 dark:text-slate-300">
              {project.description}
            </p>

            {/* Image gallery with lightbox */}
            {project.images && project.images.length > 0 && (
              <motion.div
                variants={itemVariants}
                className="relative overflow-hidden rounded-2xl border border-slate-200/50 glass shadow-lg"
              >
                <div className="relative h-64 md:h-80">
                  <img
                    src={project.images[imageIndex]}
                    alt={`${project.title} screenshot ${imageIndex + 1}`}
                    className="h-full w-full object-cover cursor-pointer"
                    onClick={() => openLightbox(imageIndex)}
                    loading="lazy"
                  />
                  
                  {/* Image navigation */}
                  {project.images.length > 1 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          prevImage();
                        }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-slate-800 shadow-md backdrop-blur-sm hover:bg-white dark:bg-slate-800/80 dark:text-white dark:hover:bg-slate-800"
                      >
                        <FiChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          nextImage();
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-slate-800 shadow-md backdrop-blur-sm hover:bg-white dark:bg-slate-800/80 dark:text-white dark:hover:bg-slate-800"
                      >
                        <FiChevronRight className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  
                  {/* Image indicators */}
                  {project.images.length > 1 && (
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                      {project.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={(e) => {
                            e.stopPropagation();
                            setImageIndex(index);
                          }}
                          className={`h-1.5 w-1.5 rounded-full transition-all ${
                            index === imageIndex
                              ? "w-6 bg-white"
                              : "bg-white/50"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Thumbnail strip */}
                {project.images.length > 1 && (
                  <div className="flex gap-2 p-2 overflow-x-auto">
                    {project.images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setImageIndex(index)}
                        className={`flex-shrink-0 h-12 w-12 rounded overflow-hidden border-2 ${
                          index === imageIndex
                            ? "border-sky-500"
                            : "border-transparent"
                        }`}
                      >
                        <img
                          src={img}
                          alt={`Thumbnail ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </motion.header>

          {/* Problem */}
          <motion.section variants={itemVariants} className="space-y-3">
            <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-50 dark:to-slate-400">
              Problem
            </h2>
            <div className="rounded-xl border border-slate-200/50 glass p-4 shadow-sm">
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {project.problem ||
                  "Describe the real-world problem this project solves, such as inefficient workflows, poor visibility, or manual processes."}
              </p>
            </div>
          </motion.section>

          {/* Solution & features */}
          <motion.section variants={itemVariants} className="space-y-3">
            <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-50 dark:to-slate-400">
              Solution & Features
            </h2>
            <div className="rounded-xl border border-slate-200/50 glass p-4 shadow-sm">
              {project.features && project.features.length > 0 ? (
                <ul className="space-y-2">
                  {project.features.map((f, index) => (
                    <motion.li
                      key={f}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300"
                    >
                      <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-sky-500 flex-shrink-0"></span>
                      {f}
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-500">
                  Highlight the main features here: dashboards, automation flows,
                  integrations, authentication, role-based access, etc.
                </p>
              )}
            </div>
          </motion.section>

          {/* Tech stack */}
          <motion.section variants={itemVariants} className="space-y-3">
            <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-50 dark:to-slate-400">
              Tech Stack
            </h2>
            <div className="rounded-xl border border-slate-200/50 glass p-4 shadow-sm">
              {project.techStack && project.techStack.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((t, index) => (
                    <motion.span
                      key={t}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.05 * index }}
                      className="rounded-full bg-slate-100/70 px-3 py-1 text-xs text-slate-700 dark:bg-slate-800/70 dark:text-slate-200"
                    >
                      {t}
                    </motion.span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">
                  List technologies used across frontend, backend, data, and tools.
                </p>
              )}
            </div>
          </motion.section>

          {/* Challenges and learnings */}
          <motion.section variants={itemVariants} className="space-y-3">
            <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-50 dark:to-slate-400">
              Challenges & Learnings
            </h2>
            <div className="rounded-xl border border-slate-200/50 glass p-4 shadow-sm">
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {project.learnings ||
                  "Summarize key implementation challenges (performance, data modeling, auth, deployment) and what you learned from solving them."}
              </p>
            </div>
          </motion.section>

          {/* Links */}
          <motion.section variants={itemVariants} className="flex flex-wrap gap-3">
            {project.links?.demo && (
              <motion.a
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                href={project.links.demo}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300/50 glass px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100/70 dark:border-slate-700/50 dark:text-slate-200 dark:hover:bg-slate-800/70"
              >
                <FiExternalLink className="w-3 h-3" />
                Live Demo
              </motion.a>
            )}
            {project.links?.repo && (
              <motion.a
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                href={project.links.repo}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-slate-900 to-slate-700 px-4 py-2 text-xs font-medium text-white hover:from-slate-800 hover:to-slate-600 dark:from-slate-100 dark:to-slate-300 dark:text-slate-900 dark:hover:from-slate-200 dark:hover:to-slate-400"
              >
                <FiGithub className="w-3 h-3" />
                View Code
              </motion.a>
            )}
          </motion.section>
        </motion.div>
      </main>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && project.images && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={closeLightbox}
          >
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={closeLightbox}
              className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm hover:bg-white/20"
            >
              <FiX className="w-5 h-5" />
            </motion.button>
            
            {project.images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-4 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm hover:bg-white/20"
                >
                  <FiChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-4 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm hover:bg-white/20"
                >
                  <FiChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
            
            <motion.img
              key={imageIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              src={project.images[imageIndex]}
              alt={`${project.title} screenshot ${imageIndex + 1}`}
              className="max-h-[80vh] max-w-full rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            
            {project.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
                {project.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setImageIndex(index);
                    }}
                    className={`h-2 w-2 rounded-full transition-all ${
                      index === imageIndex
                        ? "w-8 bg-white"
                        : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

export default ProjectDetailPage;