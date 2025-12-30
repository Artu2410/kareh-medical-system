import { clsx } from "clsx";
import { motion } from "framer-motion";

export default function PageContainer({
  children,
  isCollapsed = false,
}) {
  return (
    <motion.main
      animate={{
        marginLeft: isCollapsed ? "80px" : "280px",
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={clsx(
        "hidden md:block flex-1",
        "pt-6 pb-8 px-6 bg-slate-50 min-h-screen"
      )}
    >
      {children}
    </motion.main>
  );
}

export function PageMobileContainer({ children }) {
  return (
    <main className="md:hidden block pt-20 pb-8 px-4 bg-slate-50 min-h-screen">
      {children}
    </main>
  );
}
