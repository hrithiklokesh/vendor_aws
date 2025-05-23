

import React, { useEffect, useRef, useState } from "react";

const WorkflowStep = ({ position, title }) => {
  const stepRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting); // Update visibility on enter & exit
        });
      },
      { threshold: 0.2 } // Trigger when 20% is visible
    );

    if (stepRef.current) {
      observer.observe(stepRef.current);
    }

    return () => {
      if (stepRef.current) {
        observer.unobserve(stepRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={stepRef}
      className={`workflow-step ${position} ${isVisible ? "scrolled" : ""}`}
    >
      <div className="step-content">
        {position === "left" ? (
          <>
            <div className="rectangle">
              <h2 className="step-title">{title}</h2>
            </div>
            <div className="horizontal-parent">
              <div className={`horizontal-line ${isVisible ? "animate" : ""}`}></div>
            </div>
          </>
        ) : (
          <>
            <div className="horizontal-parent-right">
              <div className={`horizontal-line-right ${isVisible ? "animate" : ""}`}></div>
            </div>
            <div className="rectangle right">
              <h2 className="step-title">{title}</h2>
            </div>
          </>
        )}
      </div>
      <div className={`vertical-line ${isVisible ? "animate" : ""}`}></div>
    </div>
  );
};

export default WorkflowStep;
