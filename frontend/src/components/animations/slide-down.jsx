import { motion, AnimatePresence } from "framer-motion";

export function SlideDown({ children, show, duration }) {
  const animDuration = duration || 0.3;
  
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ 
            opacity: 1, 
            height: 'auto'
          }}
          exit={{ 
            opacity: 0, 
            height: 0 
          }}
          transition={{ 
            duration: animDuration,
            opacity: { duration: animDuration * 1.5 }, // Делаем opacity медленнее
            height: { duration: animDuration }
          }}
          className="w-full overflow-hidden" // Добавляем overflow-hidden
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}