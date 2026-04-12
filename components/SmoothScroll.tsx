"use client";

import React, { useRef, useState, useCallback, useLayoutEffect } from "react";
import {
  useScroll,
  useTransform,
  useSpring,
  motion,
} from "framer-motion";

const SmoothScroll = ({ children }: { children: React.ReactNode }) => {
  // Scroll reference
  const scrollRef = useRef<HTMLDivElement>(null);
  const [pageHeight, setPageHeight] = useState(0);

  // Resize observer to update page height
  const resizePageHeight = useCallback((entries: ResizeObserverEntry[]) => {
    setPageHeight(entries[0].contentRect.height);
  }, []);

  useLayoutEffect(() => {
    if (!scrollRef.current) return;
    const resizeObserver = new ResizeObserver((entries) =>
      resizePageHeight(entries)
    );
    scrollRef.current && resizeObserver.observe(scrollRef.current);
    
    return () => resizeObserver.disconnect();
  }, [resizePageHeight]);

  const { scrollY } = useScroll();
  const transform = useTransform(scrollY, [0, pageHeight], [0, -pageHeight]);
  const physics = { damping: 15, mass: 0.27, stiffness: 55 };
  const spring = useSpring(transform, physics);

  return (
    <>
      {/* Scroll area ghost */}
      <motion.div
        style={{ height: pageHeight }}
        className="relative w-full"
      />
      {/* Fixed wrapper */}
      <motion.div
        ref={scrollRef}
        style={{ y: spring }}
        className="fixed top-0 left-0 w-full overflow-hidden will-change-transform"
      >
        {children}
      </motion.div>
    </>
  );
};

export default SmoothScroll;
