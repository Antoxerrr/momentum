import { motion, AnimatePresence } from "framer-motion";

export function Fade({ children, show, duration }) {
  const animDuration = duration || 0.3;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          transition={{ 
            duration: animDuration,
            opacity: { duration: animDuration },
          }}
          className="w-full"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
