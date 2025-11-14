import { motion, AnimatePresence } from 'framer-motion';

export function SlideDown({ children, show, duration }) {
  const animDuration = duration || 0.3;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          animate={{
            opacity: 1,
            height: 'auto',
          }}
          className="w-full overflow-hidden"
          exit={{
            opacity: 0,
            height: 0,
          }}
          initial={{ opacity: 0, height: 0 }}
          transition={{
            duration: animDuration,
            opacity: { duration: animDuration * 1.5 },
            height: { duration: animDuration },
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
