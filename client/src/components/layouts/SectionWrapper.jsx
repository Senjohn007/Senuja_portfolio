function SectionWrapper({ id, className = "", children }) {
  return (
    <section
      id={id}
      className={`py-16 max-w-6xl mx-auto px-4 ${className}`}
    >
      {children}
    </section>
  );
}

export default SectionWrapper;
