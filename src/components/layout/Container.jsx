export default function Container({ children, className = "", narrow = false }) {
  const maxWidth = narrow ? "max-w-3xl" : "max-w-[1200px]";
  return (
    <div className={`mx-auto px-4 md:px-6 lg:px-8 ${maxWidth} ${className}`}>
      {children}
    </div>
  );
}
