import { FaGithub, FaLinkedin, FaEnvelope, FaInstagram, FaFacebook } from "react-icons/fa";
import { motion } from "framer-motion";
import { useState } from "react";

function Footer() {
  const year = new Date().getFullYear();
  const [emailHovered, setEmailHovered] = useState(false);
  const [githubHovered, setGithubHovered] = useState(false);
  const [linkedinHovered, setLinkedinHovered] = useState(false);
  const [instagramHovered, setInstagramHovered] = useState(false);
  const [facebookHovered, setFacebookHovered] = useState(false);

  // Social links data
  const socialLinks = [
    {
      id: 'email',
      href: "mailto:senujamasinghe@gmail.com",
      icon: <FaEnvelope size={14} />,
      label: "Email",
      hovered: emailHovered,
      setHovered: setEmailHovered,
      gradient: "from-sky-500 to-blue-600",
      hoverColor: "hover:bg-sky-600"
    },
    {
      id: 'github',
      href: "https://github.com/Senjohn007",
      icon: <FaGithub size={14} />,
      label: "GitHub",
      hovered: githubHovered,
      setHovered: setGithubHovered,
      gradient: "from-slate-700 to-slate-900",
      hoverColor: "hover:bg-slate-900"
    },
    {
      id: 'linkedin',
      href: "https://www.linkedin.com/in/senuja-masinghe-55891b36b/",
      icon: <FaLinkedin size={14} />,
      label: "LinkedIn",
      hovered: linkedinHovered,
      setHovered: setLinkedinHovered,
      gradient: "from-blue-500 to-blue-700",
      hoverColor: "hover:bg-blue-600"
    },
    {
      id: 'instagram',
      href: "https://www.instagram.com/yourusername", // Replace with your Instagram URL
      icon: <FaInstagram size={14} />,
      label: "Instagram",
      hovered: instagramHovered,
      setHovered:setInstagramHovered,
      gradient: "from-purple-500 to-pink-500",
      hoverColor: "hover:bg-purple-600"
    },
    {
      id: 'facebook',
      href: "https://www.facebook.com/yourusername", // Replace with your Facebook URL
      icon: <FaFacebook size={14} />,
      label: "Facebook",
      hovered: facebookHovered,
      setHovered: setFacebookHovered,
      gradient: "from-blue-600 to-blue-800",
      hoverColor: "hover:bg-blue-700"
    }
  ];

  return (
    <footer className="relative mt-20 overflow-hidden">
      {/* Background gradient matching homepage style */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50/80 via-white/60 to-slate-100/80 dark:from-slate-950/80 dark:via-slate-900/60 dark:to-slate-950/80"></div>
      
      {/* Glassmorphism overlay for ash-like effect */}
      <div className="absolute inset-0 backdrop-blur-sm bg-slate-100/20 dark:bg-slate-900/20"></div>
      
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div 
          className="h-full w-full" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230ea5e9' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
      </div>
      
      {/* Decorative gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-br from-sky-400/10 to-blue-600/10 blur-3xl"
          animate={{ 
            x: [0, 30, 0], 
            y: [0, -20, 0], 
            scale: [1, 1.1, 1] 
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            repeatType: "reverse",
            ease: "easeInOut" 
          }}
        />
        <motion.div 
          className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-tr from-purple-400/10 to-pink-600/10 blur-3xl"
          animate={{ 
            x: [0, -20, 0], 
            y: [0, 30, 0], 
            scale: [1, 1.2, 1] 
          }}
          transition={{ 
            duration: 25, 
            repeat: Infinity, 
            repeatType: "reverse",
            ease: "easeInOut" 
          }}
        />
      </div>
      
      {/* Glassmorphism top border */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-300/50 to-transparent dark:via-slate-700/50"></div>
      
      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row">
        {/* Copyright with enhanced animation */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-1 sm:items-start"
        >
          <motion.span 
            className="text-sm font-medium text-slate-700 dark:text-slate-300"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            © {year} Senuja Masinghe
          </motion.span>
          <motion.span 
            className="text-xs text-slate-600 dark:text-slate-400"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Crafted with passion
          </motion.span>
        </motion.div>

        {/* Enhanced social links with glassmorphism */}
        <motion.div 
          className="flex items-center gap-4"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {socialLinks.map((link) => (
            <motion.a
              key={link.id}
              href={link.href}
              {...(link.id !== 'email' && { 
                target: "_blank", 
                rel: "noreferrer" 
              })}
              aria-label={link.label}
              onMouseEnter={() => link.setHovered(true)}
              onMouseLeave={() => link.setHovered(false)}
              whileHover={{ y: -5, scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className={`relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full glass text-slate-700 transition-colors ${link.hoverColor} hover:text-white dark:text-slate-200`}
            >
              {/* Background gradient that appears on hover */}
              <motion.div
                className={`absolute inset-0 bg-gradient-to-r ${link.gradient}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: link.hovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />
              {/* Icon */}
              <span className="relative z-10">{link.icon}</span>
            </motion.a>
          ))}
        </motion.div>

        {/* Tech stack with enhanced styling */}
        <motion.div 
          className="flex flex-col items-center gap-1 sm:items-end"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <span className="text-xs text-slate-600 dark:text-slate-400">
            Built with
          </span>
          <div className="flex items-center gap-2">
            <motion.span 
              className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600 font-medium"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              MERN
            </motion.span>
            <span className="text-slate-500 dark:text-slate-400">,</span>
            <motion.span 
              className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600 font-medium"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              Tailwind
            </motion.span>
            <span className="text-slate-500 dark:text-slate-400">&</span>
            <motion.span 
              className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-600 font-medium"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              Motion
            </motion.span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}

export default Footer;