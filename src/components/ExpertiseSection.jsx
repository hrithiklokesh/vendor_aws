// import React, { useRef } from "react";
// import { Link } from "react-scroll";
// import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
// import "../styles/ExpertiseSection.css";

// const ExpertiseSection = ({ scrollY, hideScrollLink }) => {
//   const carouselRef = useRef(null);

//   const scrollLeft = () => {
//     if (carouselRef.current) {
//       carouselRef.current.scrollBy({ left: -300, behavior: "smooth" });
//     }
//   };

//   const scrollRight = () => {
//     if (carouselRef.current) {
//       carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
//     }
//   };

//   return (
//     <section id = "expertise" className="expertise-section" style={{ transform: `translateY(${scrollY * 0.1}px)` }}>
//       <div className="expertise-content">
//         <h2 className="comprehensive-expertise fade-in">
//           <span className="gradient-text">Our Comprehensive</span> Services
//         </h2>
//       </div>

//       <div className="carousel-container">
//         <div className="carousel" ref={carouselRef}>
//           <article className="expertise-card">
//             <h3 className="card-title">Vendor & Project Management</h3>
//             <p className="card-description">
//             Offers smart vendor matching, private tendering, dedicated project managers, CRM & task management, forecasting & analytics, and end-to-end project support. While currently managed manually, we are developing an AI-driven SaaS platform to enhance efficiency and automation. </p>
//           </article>
//           <article className="expertise-card">
//             <h3 className="card-title">B2B E-Commerce</h3>
//             <p className="card-description">
//             simplifies procurement by connecting businesses with a verified suppliernetwork, ensuring quality materials and competitive pricing. We currently provide manual 
// procurement assistance, with a self-service marketplace, real-time stock updates, and secure 
// transactions coming soon through our SaaS platform.
//             </p>
//           </article>
//           <article className="expertise-card">
//               <h3 className="card-title">Cost Estimation & Business Execution</h3>
//               <p className="card-description">
//               streamlines project budgeting with instant cost 
// breakdowns, vendor bidding insights, and transparent pricing. While these processes are 
// currently manual, we are developing AI-driven automation to optimize cost analysis and 
// enhance decision-making. 
//               </p>
//           </article>
          
//         </div>

//         <div className="carousel-wrapper">
//           <div className="carousel-buttons">
//             <button className="carousel-btn left" onClick={scrollLeft}>
//               <FaChevronLeft />
//             </button>
//             <button className="carousel-btn right" onClick={scrollRight}>
//               <FaChevronRight />
//             </button>
//           </div>
//         </div>
//       </div>
     
//     </section>
//   );
// };

// export default ExpertiseSection;

import React, { useRef, useEffect, useState } from "react";
import {
  FaCheckCircle,
  FaClock,
  FaIndustry,
  FaMoneyBillWave,
  FaHeadset,
  FaHandshake,
  FaChartLine,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

import "../styles/ExpertiseSection.css";

const fadingItems = [
  { icon: <FaMoneyBillWave />, text: "COST EFFICIENCY" },
  { icon: <FaIndustry />, text: "MULTI INDUSTRY EXPERTISE" },
  { icon: <FaClock />, text: "TIME SAVING" },
  { icon: <FaHeadset />, text: "24/7 SUPPORT" },
  { icon: <FaHandshake />, text: "TRANSPARENT COMMUNICATION" },
  { icon: <FaChartLine />, text: "GUARANTEED GROWTH" },
];

const ExpertiseSection = ({ scrollY }) => {
  const carouselRef = useRef(null);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prevIndex) => (prevIndex + 1) % fadingItems.length);
    }, 2000); // Change text every 2 seconds

    return () => clearInterval(interval);
  }, []);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <section
      id="expertise"
      className="expertise-section"
      style={{ transform: `translateY(${scrollY * 0.1}px)` }}
    >
      <div className="expertise-content">
        <h2 className="comprehensive-expertise fade-in">
          <span className="gradient-text">Our Comprehensive</span> Services
        </h2>

        {/* 🔹 Fading Highlight Bar - Below 'Services' */}
        <div className="fading-highlight-bar">
          <div className="highlight-item">
            {fadingItems[currentTextIndex].icon} {/* ✅ Render the icon dynamically */}
            <span className="fading-text">{fadingItems[currentTextIndex].text}</span>
          </div>
        </div>
      </div>

      <div className="exp-carousel-container">
        <div className="exp-carousel" ref={carouselRef}>
          <article className="expertise-card">
            <h3 className="card-title">Vendor & Project Management</h3>
            <p className="card-description">
              Offers smart vendor matching, private tendering, dedicated project
              managers, CRM & task management, forecasting & analytics, and
              end-to-end project support. While currently managed manually, we
              are developing an AI-driven SaaS platform to enhance efficiency
              and automation.
            </p>
          </article>
          <article className="expertise-card">
            <h3 className="card-title">B2B E-Commerce</h3>
            <p className="card-description">
              Simplifies procurement by connecting businesses with a verified
              supplier network, ensuring quality materials and competitive
              pricing. We currently provide manual procurement assistance, with
              a self-service marketplace, real-time stock updates, and secure
              transactions coming soon through our SaaS platform.
            </p>
          </article>
          <article className="expertise-card">
            <h3 className="card-title">Cost Estimation & Business Execution</h3>
            <p className="card-description">
              Streamlines project budgeting with instant cost breakdowns, vendor
              bidding insights, and transparent pricing. While these processes
              are currently manual, we are developing AI-driven automation to
              optimize cost analysis and enhance decision-making.
            </p>
          </article>
        </div>

        <div className="carousel-wrapper">
          <div className="carousel-buttons">
            <button className="carousel-btn left" onClick={scrollLeft}>
              <FaChevronLeft />
            </button>
            <button className="carousel-btn right" onClick={scrollRight}>
              <FaChevronRight />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExpertiseSection;
