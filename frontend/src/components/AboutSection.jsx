import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import '../styles/AboutSection.css';

const AboutSection = () => {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: false
  });

  const containerVariants = {
    hidden: { opacity: 0, y: 100 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8 }
    }
  };

  return (
    <section id="about" className="about-section" ref={ref}>
      <div className="background-image"></div>
      
      <motion.div 
        className="about-content"
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        <motion.h2 
          className="about-title"
          variants={itemVariants}
        >
          Step beyond marketplaces, seize success!
        </motion.h2>
        
        <motion.p 
          className="about-description"
          variants={itemVariants}
        >
          At CAASDI GLOBAL, we're making a groundbreaking platform that combines automation,
          AI-driven insights, and seamless execution. Say goodbye to traditional
          marketplaces and hello to a predictive, self-sustaining business
          ecosystem designed for your success.
        </motion.p>
      </motion.div>
    </section>
  );
};

export default AboutSection;
