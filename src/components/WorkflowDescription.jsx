import React, { useEffect, useState, useRef } from "react";
import "../styles/WorkflowDescription.css";
const WorkflowDescription = ({ text, position }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 } // Trigger when 20% of the component is visible
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`workflow-description ${position} ${
        isVisible ? "visible" : ""
      }`}
    >
      <p className="description-text">{text}</p>
    </div>
  );
};

export default WorkflowDescription;