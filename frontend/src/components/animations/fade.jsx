import { motion, AnimatePresence } from 'framer-motion';

export function Fade({ children, show, duration }) {
  const animDuration = duration || 0.3;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          animate={{
            opacity: 1,
          }}
          className="w-full"
          exit={{
            opacity: 0,
          }}
          initial={{ opacity: 0 }}
          transition={{
            duration: animDuration,
            opacity: { duration: animDuration },
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
