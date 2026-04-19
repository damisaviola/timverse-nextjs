"use client";

import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when page is scrolled down 400px
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          className="fixed bottom-24 right-5 z-[60] p-3 rounded-full bg-accent text-white shadow-xl hover:bg-accent-dark transition-colors duration-300 md:bottom-8 md:right-8 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-2 ring-offset-background"
          aria-label="Scroll to top"
          id="scroll-to-top-btn"
        >
          <ChevronUp size={24} strokeWidth={2.5} />
          
          {/* Subtle Glow Effect */}
          <div className="absolute inset-0 rounded-full bg-accent/20 animate-pulse -z-10" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
