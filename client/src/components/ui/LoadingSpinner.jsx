import { motion } from 'framer-motion';

const LoadingSpinner = ({ size = "md" }) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12"
  };
  
  return (
    <div className="flex justify-center items-center">
      <motion.div
        className={`${sizeClasses[size]} rounded-full border-2 border-sky-500 border-t-transparent`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
};

export default LoadingSpinner;