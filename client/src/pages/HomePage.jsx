import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import {
  getSkills,
  getProjects,
  getAchievements,
  postMessage,
} from "../lib/api";
import Navbar from "../components/layouts/Navbar";
import Footer from "../components/layouts/Footer";
import SectionWrapper from "../components/layouts/SectionWrapper";
import ParticleBackground from "../components/animations/ParticleBackground";
import GradientOrbs from "../components/animations/GradientOrbs";
import FloatingShapes from "../components/animations/FloatingShapes";
import NoiseTexture from "../components/animations/NoiseTexture";

import {
  FiDownload,
  FiArrowRight,
  FiMail,
  FiPhone,
  FiMapPin,
  FiExternalLink,
  FiGithub,
  FiLinkedin,
  FiSend,
  FiCode,
  FiDatabase,
  FiTrendingUp,
  FiInstagram,
  FiFacebook,
  FiLayers,
  FiCpu,
  FiTerminal,
} from "react-icons/fi";

// Import your profile image
import profileImage from "../assets/senuja_portrait.jpg";

const scrollToSection = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

// Enhanced Skill Bar Component
const SkillBar = ({ name, proficiency, category }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Get icon and color based on category
  const getIconInfo = () => {
    switch (category) {
      case "Frontend":
        return {
          icon: <FiCode />,
          bgColor: "bg-blue-100 dark:bg-blue-900/30",
          iconColor: "text-blue-500",
        };
      case "Backend":
        return {
          icon: <FiTerminal />,
          bgColor: "bg-green-100 dark:bg-green-900/30",
          iconColor: "text-green-500",
        };
      case "Tools":
        return {
          icon: <FiLayers />,
          bgColor: "bg-purple-100 dark:bg-purple-900/30",
          iconColor: "text-purple-500",
        };
      case "Data":
        return {
          icon: <FiDatabase />,
          bgColor: "bg-orange-100 dark:bg-orange-900/30",
          iconColor: "text-orange-500",
        };
      default:
        return {
          icon: <FiCpu />,
          bgColor: "bg-gray-100 dark:bg-gray-900/30",
          iconColor: "text-gray-500",
        };
    }
  };

  const { icon, bgColor, iconColor } = getIconInfo();

  return (
    <div ref={ref} className="mb-6">
      <div className="flex items-center mb-3">
        {/* Enhanced icon container with animation */}
        <motion.div
          className={`flex items-center justify-center w-10 h-10 rounded-xl ${bgColor} mr-3`}
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300, damping: 10 }}
        >
          <span className={`text-xl ${iconColor}`}>{icon}</span>
        </motion.div>

        <div className="flex-1">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
              {name}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {proficiency}%
            </span>
          </div>

          {/* Enhanced category badge with icon */}
          <div className="flex items-center mt-1">
            <motion.span
              className={`inline-flex items-center text-xs px-2 py-1 rounded-full ${bgColor} ${iconColor}`}
              whileHover={{ scale: 1.05 }}
            >
              <span className="mr-1">{icon}</span>
              {category}
            </motion.span>
          </div>
        </div>
      </div>

      {/* Enhanced progress bar with gradient and glow effect */}
      <div className="w-full bg-slate-200/30 dark:bg-slate-700/30 rounded-full h-3 overflow-hidden relative">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-sky-500 to-blue-600 relative overflow-hidden"
          initial={{ width: 0 }}
          animate={isInView ? { width: `${proficiency}%` } : { width: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          {/* Animated shine effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: ["-100%", "200%"] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          />

          {/* Glow effect for high proficiency */}
          {proficiency >= 80 && (
            <motion.div
              className="absolute inset-0 bg-white/20 blur-sm"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
};

// Enhanced filter buttons with icons
const SkillFilterButtons = ({ activeSkillFilter, setActiveSkillFilter }) => {
  const filterOptions = [
    {
      name: "All",
      icon: <FiLayers />,
      color: "bg-slate-100 dark:bg-slate-800",
    },
    {
      name: "Frontend",
      icon: <FiCode />,
      color: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      name: "Backend",
      icon: <FiTerminal />,
      color: "bg-green-100 dark:bg-green-900/30",
    },
    {
      name: "Tools",
      icon: <FiLayers />,
      color: "bg-purple-100 dark:bg-purple-900/30",
    },
    {
      name: "Data",
      icon: <FiDatabase />,
      color: "bg-orange-100 dark:bg-orange-900/30",
    },
  ];

  return (
    <div className="flex justify-center mb-8">
      <div className="inline-flex rounded-xl border border-slate-200/30 dark:border-slate-700/30 glass p-1">
        {filterOptions.map((filter) => (
          <motion.button
            key={filter.name}
            type="button"
            onClick={() => setActiveSkillFilter(filter.name)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeSkillFilter === filter.name
                ? "bg-sky-500 text-white shadow-md shadow-sky-500/25"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100/50 dark:hover:bg-slate-800/50"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-base">{filter.icon}</span>
            {filter.name}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

// Timeline Item Component
const TimelineItem = ({ date, title, description, isLast = false, icon }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      className="relative pl-8 pb-8"
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="absolute left-0 top-1.5 h-3 w-3 rounded-full bg-sky-500 shadow-lg shadow-sky-500/50"
        animate={isInView ? { scale: [1, 1.5, 1] } : {}}
        transition={{ duration: 0.5, delay: 0.2 }}
      />
      {!isLast && (
        <motion.div
          className="absolute left-1.5 top-4 h-full w-0.5 bg-slate-300 dark:bg-slate-700"
          initial={{ height: 0 }}
          animate={isInView ? { height: "100%" } : { height: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        />
      )}
      <div className="ml-4">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">
          {date}
        </p>
        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 mb-1 flex items-center gap-2">
          {icon && <span className="text-sky-500">{icon}</span>}
          {title}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

// Project Card Component
const ProjectCard = ({ project, index }) => {
  const thumb = project.images?.[0];
  const hasRepo = !!project.links?.repo;
  const hasDemo = !!project.links?.demo;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative overflow-hidden rounded-2xl border border-slate-200/30 dark:border-slate-700/30 glass shadow-md hover:shadow-xl transition-all duration-500"
    >
      {thumb && (
        <div className="relative h-56 w-full overflow-hidden">
          <img
            src={thumb}
            alt={project.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />
          <motion.div
            className="absolute bottom-4 left-4 right-4"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: isHovered ? 0 : 10, opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="flex gap-2">
              {hasDemo && (
                <a
                  href={project.links.demo}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
                  aria-label="View live demo"
                >
                  <FiExternalLink className="w-4 h-4" />
                </a>
              )}
              {hasRepo && (
                <a
                  href={project.links.repo}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
                  aria-label="View source code"
                >
                  <FiGithub className="w-4 h-4" />
                </a>
              )}
            </div>
          </motion.div>
        </div>
      )}

      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
            {project.title}
          </h3>
          <motion.span
            className="text-xs px-2 py-1 rounded-full bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400"
            whileHover={{ scale: 1.1 }}
          >
            {project.category}
          </motion.span>
        </div>

        <p className="text-base text-slate-600 dark:text-slate-300 mb-4 line-clamp-3">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.techStack?.slice(0, 3).map((tech, i) => (
            <motion.span
              key={tech}
              className="text-xs px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
              whileHover={{ scale: 1.1, y: -2 }}
              transition={{ delay: i * 0.05 }}
            >
              {tech}
            </motion.span>
          ))}
          {project.techStack?.length > 3 && (
            <span className="text-xs px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              +{project.techStack.length - 3} more
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <Link
            to={`/projects/${project._id}`}
            className="inline-flex items-center gap-1 text-sm font-medium text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 group"
          >
            View details
            <FiArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

// Loading Component
const LoadingSpinner = ({ message }) => (
  <div className="text-center py-20">
    <div className="relative inline-flex items-center justify-center">
      <div className="w-16 h-16 rounded-full border-4 border-slate-200 dark:border-slate-700 border-t-sky-500 animate-spin"></div>
      <div
        className="absolute w-10 h-10 rounded-full border-4 border-slate-200 dark:border-slate-700 border-b-blue-500 animate-spin"
        style={{ animationDelay: "150ms" }}
      ></div>
      <div
        className="absolute w-6 h-6 rounded-full border-4 border-slate-200 dark:border-slate-700 border-l-indigo-500 animate-spin"
        style={{ animationDelay: "300ms" }}
      ></div>
    </div>
    <p className="mt-6 text-slate-600 dark:text-slate-300 animate-pulse">
      {message}
    </p>
  </div>
);

function HomePage() {
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeProjectFilter, setActiveProjectFilter] = useState("All");
  const [activeSkillFilter, setActiveSkillFilter] = useState("All");
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [contact, setContact] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");

  // Scroll progress indicator
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useEffect(() => {
    async function load() {
      try {
        const [skillsData, projectsData, achievementsData] = await Promise.all([
          getSkills(),
          getProjects(),
          getAchievements(),
        ]);
        setSkills(skillsData);
        setProjects(projectsData);
        setAchievements(achievementsData);
        setFilteredProjects(projectsData);
        setFilteredSkills(skillsData);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    const filtered =
      activeProjectFilter === "All"
        ? projects
        : projects.filter((p) => p.category === activeProjectFilter);
    setFilteredProjects(filtered);
  }, [activeProjectFilter, projects]);

  useEffect(() => {
    const filtered =
      activeSkillFilter === "All"
        ? skills
        : skills.filter((s) => s.category === activeSkillFilter);
    setFilteredSkills(filtered);
  }, [activeSkillFilter, skills]);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-50">
      {/* Scroll Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 to-blue-600 z-50 origin-left"
        style={{ scaleX }}
      />

      {/* Background animations */}
      <ParticleBackground />
      {/* <GradientOrbs /> */}
      {/* <FloatingShapes /> */}
      {/* <NoiseTexture /> */}

      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-br from-sky-400/10 to-blue-600/10 blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-tr from-purple-400/10 to-pink-600/10 blur-3xl"
          animate={{
            x: [0, -30, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />

        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-slate-300/10 dark:bg-slate-700/10"
            style={{
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, Math.random() * 100 - 50],
              x: [0, Math.random() * 100 - 50],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      <Navbar />

      <main className="relative z-10">
        {/* Hero Section */}
        <SectionWrapper
          id="hero"
          className="min-h-screen flex items-center justify-center px-4 py-20"
        >
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <motion.div
                className="inline-flex items-center px-3 py-1 rounded-full glass text-sm font-medium text-sky-600 dark:text-sky-400"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <FiCpu className="mr-2" />
                Data Science Undergraduate
              </motion.div>

              <motion.h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <span className="block">Building intelligent solutions</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-600">
                  with data and code.
                </span>
              </motion.h1>

              <motion.p
                className="text-lg text-slate-600 dark:text-slate-300 max-w-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                A 3rd-year Data Science undergraduate at SLIIT, focused on
                transforming data into insights through analysis, visualization,
                and data-driven solutions using Python, SQL, and Power BI.
              </motion.p>

              <motion.div
                className="flex flex-wrap gap-4 pt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <motion.a
                  href="http://localhost:5000/cv.pdf"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-medium shadow-lg shadow-sky-500/25"
                >
                  <FiDownload className="w-4 h-4" />
                  Download CV
                </motion.a>

                <motion.button
                  type="button"
                  onClick={() => scrollToSection("projects")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-700 glass text-slate-700 dark:text-slate-200 font-medium"
                >
                  <FiLayers className="w-4 h-4" />
                  View projects
                  <FiArrowRight className="w-4 h-4" />
                </motion.button>

                <motion.button
                  type="button"
                  onClick={() => scrollToSection("contact")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-700 glass text-slate-700 dark:text-slate-200 font-medium"
                >
                  <FiMail className="w-4 h-4" />
                  Contact me
                  <FiArrowRight className="w-4 h-4" />
                </motion.button>
              </motion.div>
            </motion.div>

            <motion.div
              className="flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="relative">
                {/* Animated gradient glow behind avatar */}
                <motion.div
                  className="absolute -inset-4 rounded-full bg-gradient-to-tr from-sky-500/40 via-violet-500/30 to-emerald-400/30 blur-xl"
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.7, 1, 0.7],
                    rotate: [0, 5, 0, -5, 0],
                  }}
                  transition={{
                    duration: 7,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                {/* Avatar */}
                <motion.div
                  whileHover={{
                    scale: 1.05,
                    rotate: 2,
                    boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.3)",
                  }}
                  transition={{ type: "spring", stiffness: 200, damping: 18 }}
                  className="relative h-96 w-96 overflow-hidden rounded-2xl border-4 border-white/50 bg-slate-900 shadow-2xl ring-4 ring-sky-500/40 backdrop-blur-sm dark:border-slate-800/50"
                >
                  <img
                    src={profileImage}
                    alt="Senuja Masinghe"
                    className="h-full w-full object-contain"
                    loading="lazy"
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                </motion.div>

                {/* Floating elements around the avatar */}
                <motion.div
                  className="absolute top-12 right-12 h-8 w-8 rounded-full bg-sky-500/30"
                  animate={{
                    y: [0, -15, 0],
                    x: [0, 8, 0],
                    opacity: [0.3, 0.7, 0.3],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                  }}
                />
                <motion.div
                  className="absolute bottom-12 left-12 h-10 w-10 rounded-full bg-violet-500/30"
                  animate={{
                    y: [0, 15, 0],
                    x: [0, -8, 0],
                    opacity: [0.3, 0.7, 0.3],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                  }}
                />

                <motion.div
                  className="absolute top-1/3 -left-8 h-6 w-6 rounded-full bg-emerald-500/30"
                  animate={{
                    y: [0, -10, 0],
                    x: [0, 5, 0],
                    opacity: [0.3, 0.7, 0.3],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                  }}
                />
              </div>
            </motion.div>
          </div>
        </SectionWrapper>

        {/* Current Focus Section */}
        <SectionWrapper id="focus" className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl border border-slate-200/30 dark:border-slate-700/30 glass p-8 shadow-lg"
            >
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-8 flex items-center gap-2">
                <FiTrendingUp className="text-sky-500" />
                Current Focus
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    text: "Exploratory data analysis using Python & Pandas",
                    icon: <FiCode />,
                  },
                  {
                    text: "Designing interactive dashboards with Power BI",
                    icon: <FiDatabase />,
                  },
                  {
                    text: "Querying and transforming data using SQL",
                    icon: <FiTerminal />,
                  },
                  {
                    text: "Building ETL pipelines using SSIS",
                    icon: <FiLayers />,
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ x: 6 }}
                    className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-100/40 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <div className="flex-shrink-0 text-sky-500 text-xl mt-1">
                      {item.icon}
                    </div>

                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {item.text}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </SectionWrapper>

        {/* About Section */}
        <SectionWrapper id="about" className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-4">
                About Me
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                A data-driven problem solver focused on transforming complex,
                real-world data into meaningful insights through analysis,
                visualization, and storytelling.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="space-y-4"
              >
                <p className="text-slate-700 dark:text-slate-300">
                  I enjoy working with messy, real-world datasets and turning
                  them into clear stories and actionable insights, with a
                  growing interest in building end-to-end data solutions from
                  data pipelines and transformation to analytics and dashboards.
                </p>
                <p className="text-slate-700 dark:text-slate-300">
                  Currently a 3rd-year Data Science undergraduate at SLIIT, I am
                  exploring statistics, machine learning, data science and data
                  engineering while applying these skills through practical
                  projects in domains such as education, healthcare, and
                  productivity.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="space-y-0"
              >
                {/* Education */}
                <TimelineItem
                  date="2023 – Present"
                  title="BSc (Hons) in Information Technology – Data Science"
                  description="Sri Lanka Institute of Information Technology (SLIIT), with a strong foundation in data analytics, statistics, databases, and software engineering."
                  icon={<FiDatabase />}
                />

                {/* Practical Experience */}
                <TimelineItem
                  date="2024 – Present"
                  title="Hands-on projects & practical learning"
                  description="Developing interactive dashboards, ETL pipelines, and full-stack applications while working with real-world datasets, APIs, and cloud-based tools."
                  icon={<FiLayers />}
                />

                {/* Future Goals */}
                <TimelineItem
                  date="Next"
                  title="Internship, research & early-career roles"
                  description="Actively seeking opportunities in data analytics, data engineering, or machine-learning–driven products to apply skills in real-world environments."
                  icon={<FiTrendingUp />}
                  isLast={true}
                />
              </motion.div>
            </div>
          </div>
        </SectionWrapper>

        {/* Projects Section */}
        <SectionWrapper id="projects" className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-4">
                Projects
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                A collection of academic and personal projects demonstrating
                hands-on experience in data analysis, interactive
                visualizations, ETL pipelines and full-stack web solutions.
              </p>
            </motion.div>

            <div className="flex justify-center mb-8">
              <div className="inline-flex rounded-xl border border-slate-200/30 dark:border-slate-700/30 glass p-1">
                {["All", "Web", "Mobile", "Data", "PowerBI", "Other"].map(
                  (filter) => (
                    <motion.button
                      key={filter}
                      type="button"
                      onClick={() => setActiveProjectFilter(filter)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        activeProjectFilter === filter
                          ? "bg-sky-500 text-white shadow-md shadow-sky-500/25"
                          : "text-slate-600 dark:text-slate-300 hover:bg-slate-100/50 dark:hover:bg-slate-800/50"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {filter}
                    </motion.button>
                  )
                )}
              </div>
            </div>

            {loading ? (
              <LoadingSpinner message="Loading projects..." />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredProjects.map((project, index) => (
                  <ProjectCard
                    key={project._id}
                    project={project}
                    index={index}
                  />
                ))}
              </div>
            )}
          </div>
        </SectionWrapper>

        {/* Skills Section */}
        <SectionWrapper id="skills" className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-4">
                Skills
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                Key tools, technologies, and methodologies applied across data
                analysis, visualization, ETL, and full-stack development
                workflows.
              </p>
            </motion.div>

            {/* Enhanced filter buttons */}
            <SkillFilterButtons
              activeSkillFilter={activeSkillFilter}
              setActiveSkillFilter={setActiveSkillFilter}
            />

            {loading ? (
              <LoadingSpinner message="Loading skills..." />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredSkills.map((skill, index) => (
                  <motion.div
                    key={skill._id || skill.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="rounded-2xl border border-slate-200/30 dark:border-slate-700/30 glass p-6 shadow-md hover:shadow-lg transition-shadow"
                  >
                    <SkillBar
                      name={skill.name}
                      proficiency={skill.proficiency}
                      category={skill.category}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </SectionWrapper>

        {/* Achievements Section */}
        <SectionWrapper id="achievements" className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-4">
                Achievements
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                Academic achievements, professional certifications, and notable
                accomplishments demonstrating hands-on skills and commitment to
                continuous learning.
              </p>
            </motion.div>

            {loading ? (
              <LoadingSpinner message="Loading achievements..." />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {achievements.map((item, index) => (
                  <motion.div
                    key={item._id || item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="rounded-2xl border border-slate-200/30 dark:border-slate-700/30 glass p-6 shadow-md"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                        {item.title}
                      </h3>
                      <motion.span
                        className="text-xs px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                        whileHover={{ scale: 1.1 }}
                      >
                        {item.date
                          ? new Date(item.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                            })
                          : ""}
                      </motion.span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                      {item.issuer}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                      {item.description}
                    </p>

                    {/* Add certificate URL if available */}
                    {item.certificateUrl && (
                      <motion.a
                        href={item.certificateUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-sm font-medium text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 group"
                        whileHover={{ scale: 1.05 }}
                      >
                        View Certificate
                        <FiExternalLink className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                      </motion.a>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </SectionWrapper>

        {/* Contact Section */}
        <SectionWrapper id="contact" className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-4">
                Get In Touch
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                I’m open to internships, data analytics or engineering projects,
                and opportunities to apply and expand my skills in real-world
                environments.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <motion.div
                  className="rounded-2xl border border-slate-200/30 dark:border-slate-700/30 glass p-6 shadow-md"
                  whileHover={{ y: -5 }}
                >
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
                    Get In Touch
                  </h3>

                  <form onSubmit={handleContactSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                        >
                          Name
                        </label>
                        <motion.input
                          type="text"
                          id="name"
                          name="name"
                          placeholder="Your name"
                          required
                          value={contact.name}
                          onChange={handleContactChange}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200/30 dark:border-slate-700/30 bg-white/50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                          whileFocus={{ scale: 1.02 }}
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                        >
                          Email
                        </label>
                        <motion.input
                          type="email"
                          id="email"
                          name="email"
                          placeholder="Your email"
                          required
                          value={contact.email}
                          onChange={handleContactChange}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200/30 dark:border-slate-700/30 bg-white/50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                          whileFocus={{ scale: 1.02 }}
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                      >
                        Message
                      </label>
                      <motion.textarea
                        id="message"
                        name="message"
                        rows="4"
                        placeholder="Your message"
                        required
                        value={contact.message}
                        onChange={handleContactChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200/30 dark:border-slate-700/30 bg-white/50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                        whileFocus={{ scale: 1.02 }}
                      />
                    </div>

                    <motion.button
                      type="submit"
                      disabled={sending}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-medium shadow-lg shadow-sky-500/25 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {sending ? (
                        <>
                          <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <FiSend className="w-5 h-10" />
                          Send message
                        </>
                      )}
                    </motion.button>

                    {status && (
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`text-sm ${
                          status.includes("successfully")
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {status}
                      </motion.p>
                    )}
                  </form>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <motion.div
                  className="rounded-2xl border border-slate-200/30 dark:border-slate-700/30 glass p-6 shadow-md"
                  whileHover={{ y: -5 }}
                >
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
                    Contact Information
                  </h3>
                  <div className="space-y-4">
                    <motion.a
                      href="mailto:senujamasinghe@gmail.com"
                      className="flex items-center gap-3 text-slate-600 dark:text-slate-300 hover:text-sky-500 dark:hover:text-sky-400 transition-colors"
                      whileHover={{ x: 5 }}
                    >
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center">
                        <FiMail className="w-4 h-4 text-sky-500" />
                      </div>
                      senujamasinghe@gmail.com
                    </motion.a>
                    <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center">
                        <FiPhone className="w-4 h-4 text-sky-500" />
                      </div>
                      <div>
                        <p>+94 70 236 2892 | +94 72 126 1959</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      I usually respond within 24–48 hours
                    </p>
                    <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center">
                        <FiMapPin className="w-4 h-4 text-sky-500" />
                      </div>
                      Gampaha, Sri Lanka
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="rounded-2xl border border-slate-200/30 dark:border-slate-700/30 glass p-6 shadow-md"
                  whileHover={{ y: -5 }}
                >
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
                    Social Profiles
                  </h3>
                  <div className="flex gap-4">
                    {/* GitHub */}
                    <motion.a
                      href="https://github.com/Senjohn007"
                      target="_blank"
                      rel="noreferrer"
                      whileHover={{ scale: 1.1, y: -3, rotate: 5 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center justify-center w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 transition-colors"
                      aria-label="GitHub"
                    >
                      <FiGithub className="w-5 h-5" />
                    </motion.a>

                    {/* LinkedIn */}
                    <motion.a
                      href="https://www.linkedin.com/in/senuja-masinghe-55891b36b/"
                      target="_blank"
                      rel="noreferrer"
                      whileHover={{ scale: 1.1, y: -3, rotate: -5 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center justify-center w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-blue-600 hover:text-white transition-colors"
                      aria-label="LinkedIn"
                    >
                      <FiLinkedin className="w-5 h-5" />
                    </motion.a>

                    {/* Instagram */}
                    <motion.a
                      href="https://www.instagram.com/yourusername"
                      target="_blank"
                      rel="noreferrer"
                      whileHover={{ scale: 1.1, y: -3, rotate: 5 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center justify-center w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-pink-500 hover:text-white transition-colors"
                      aria-label="Instagram"
                    >
                      <FiInstagram className="w-5 h-5" />
                    </motion.a>

                    {/* Facebook */}
                    <motion.a
                      href="https://www.facebook.com/yourusername"
                      target="_blank"
                      rel="noreferrer"
                      whileHover={{ scale: 1.1, y: -3, rotate: -5 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center justify-center w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-blue-700 hover:text-white transition-colors"
                      aria-label="Facebook"
                    >
                      <FiFacebook className="w-5 h-5" />
                    </motion.a>

                    {/* Gmail / Email */}
                    <motion.a
                      href="mailto:senujamasinghe@gmail.com"
                      target="_blank"
                      rel="noreferrer"
                      whileHover={{ scale: 1.1, y: -3, rotate: 5 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center justify-center w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-red-500 hover:text-white transition-colors"
                      aria-label="Email"
                    >
                      <FiMail className="w-5 h-5" />
                    </motion.a>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </SectionWrapper>
      </main>

      <Footer />
    </div>
  );
}

export default HomePage;
