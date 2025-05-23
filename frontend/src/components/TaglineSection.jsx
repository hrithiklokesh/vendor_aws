// import React, { useRef } from 'react';
// import { motion, useScroll, useTransform } from 'framer-motion';
// import { useInView } from 'react-intersection-observer';
// import '../styles/TaglineSection.css';

// const TaglineSection = () => {
//   const [ref, inView] = useInView({
//     threshold: 0.3,
//     triggerOnce: false
//   });

//   const lineRef = useRef(null);
//   const { scrollYProgress } = useScroll({
//     target: lineRef,
//     offset: ["start end", "end start"]
//   });

//   const lineWidth = useTransform(scrollYProgress, [0, 0.5], ["0%", "100%"]);

//   return (
//     <section id="tagline" className="tagline-section" ref={ref}>
//       <div className="tagline-content">
//         <div className="line-container" ref={lineRef}>
//           <motion.div 
//             className="animated-line"
//             style={{ width: lineWidth }}
//           ></motion.div>
//         </div>
        
//         <motion.div 
//           className="tagline-text"
//           initial={{ opacity: 0, y: 50 }}
//           animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
//           transition={{ duration: 0.8 }}
//         >
//           <h2 className="main-tagline">Invest your time</h2>
//           <p className="sub-tagline">embark on a journey of growth</p>
//         </motion.div>
//       </div>
//     </section>
//   );
// };

// export default TaglineSection;


import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import '../styles/TaglineSection.css';

const TaglineSection = () => {
  const lineRef = useRef(null);
  const { scrollY } = useScroll();

  const lineScale = useTransform(scrollY, [200, 400], [0.8, 1]);
  const lineOpacity = useTransform(scrollY, [200, 400], [0, 1]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const lineElement = entry.target.querySelector('.line');
        if (entry.isIntersecting) {
          lineElement.classList.remove('animate');
          void lineElement.offsetWidth;
          lineElement.classList.add('animate');
        } else {
          lineElement.classList.remove('animate');
        }
      },
      {
        threshold: 0.5
      }
    );

    if (lineRef.current) {
      observer.observe(lineRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="tagline" className="tagline-section">
      <div className="line-section-wrapper">
        <motion.div
          ref={lineRef}
          className="line-section"
          style={{
            scale: lineScale,
            opacity: lineOpacity,
            zIndex: 5
          }}
        >
          <span className="invest-your-time">Invest your time </span>
          <span className="journey-of-growth">
            Embark on an&nbsp; <span className='gradient-subheading'>Innovative, Adaptive, Efficient</span> &nbsp;journey of growth
            </span>
          {/* <span className="with">with</span>
          <span className="tags">Innovation. Adaption. Efficiency</span> */}
          <div className="line" />
        </motion.div>
      </div>
    </section>
  );
};

export default TaglineSection;  