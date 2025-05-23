import React, { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Header from "./Header";
import "../styles/HeroSection.css";

const HeroSection = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: false,
  });

  return (
    <section id="home" className="hero-section">
      <Header />
      <div className="hero-content">
        <motion.div
          className="title-container"
          style={{ y, opacity }}
          ref={ref}
        >
          <motion.p
            className="intro"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Introducing
          </motion.p>
          <motion.h1
            className="title"
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            CAASDI GLOBAL
          </motion.h1>
          <motion.p
            className="subtitle"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <span className="rotating-text-container">
              <span className="rotating-text">
                <span>Vendor</span>
                <span>Project</span>
                <span>Vendor</span>
                <span>Project</span>
              </span>
            </span>
            <span>Management with Human + AI</span>
          </motion.p>
        </motion.div>
      </div>
      <div className="ellipse-bg"></div>
    </section>
  );
};

export default HeroSection;
