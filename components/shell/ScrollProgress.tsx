'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const width = useSpring(scrollYProgress, { stiffness: 180, damping: 34, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX: width }}
      className="fixed inset-x-0 top-0 z-[60] h-px origin-left bg-gradient-to-r from-accent-cyan via-accent-blue to-accent-violet"
    />
  );
}
