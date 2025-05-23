import React, { useRef, useState } from "react";
import Slider from "react-slick";
import "../styles/IndustriesSection.css";

const industriesData = [
  { id: 1, title: "Manufacturing & Industrial", description: "From raw materials to automation, we've got you covered" },
  { id: 2, title: "Construction and Infrastructure", description: "Manage commercial builds and facility upkeep seamlessly" },
  { id: 3, title: "Logistics and Supply chain", description: "Optimize freight, warehousing and 3PL Partnership" },
  { id: 4, title: "Healthcare & Pharmaceuticals", description: "Streamline medical supplies and equipment procurement" },
  { id: 5, title: "Retail & E-commerce", description: "Enhance inventory management and fulfillment operations" },
  { id: 6, title: "Food & Beverage", description: "Manage perishable goods and ensure food safety compliance" },
  { id: 7, title: "Energy & Utilities", description: "Optimize resource allocation and maintenance scheduling" },
  { id: 8, title: "Technology & Electronics", description: "Manage component sourcing and production efficiency" },
  { id: 9, title: "Automotive & Transportation", description: "Streamline parts procurement and assembly operations" },
];

const IndustriesSection = ({ scrollY }) => {
  const sliderRef = useRef();
  const [prevActive, setPrevActive] = useState(false);
  const [nextActive, setNextActive] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState(null);

  const settings = {
    dots: false,
    infinite: true,
    speed: 700,
    slidesToShow: 3,
    slidesToScroll: 3,
    arrows: false,
    centerMode: true,
    centerPadding: "0",
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 2, slidesToScroll: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  const goToNext = () => {
    sliderRef.current.slickNext();
    setNextActive(true);
    setTimeout(() => setNextActive(false), 300);
  };

  const goToPrev = () => {
    sliderRef.current.slickPrev();
    setPrevActive(true);
    setTimeout(() => setPrevActive(false), 300);
  };

  const openModal = (industry) => {
    setSelectedIndustry(industry);
    setModalOpen(true);
  };

  return (
    <section className="industries-section" id="industries-section" style={{ transform: `translateY(${scrollY * 0.05}px)` }}>
      <div className="industries-content">
        <h2 className="industries-heading fade-in">
          <span className="gradient-text">Industries </span>We Serve <br />
          <div className="subheading"><i><q>Like water, we adapt—flowing seamlessly into every industry's needs.</q></i></div>
        </h2>
        
        
        
        <Slider ref={sliderRef} {...settings} className="industries-slider">
          {industriesData.map((industry) => (
            <div key={industry.id} className="industry-slide">
              <div className="industry-card">
                <div className="industry-card-content">
                  <h3 className="industry-title">{industry.title}</h3>
                  <p className="industry-description">{industry.description}</p>
                </div>
                <div className="plus-button-container">
                  <button className="plus-button" onClick={() => openModal(industry)}>
                    <span className="plus-icon">+</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </Slider>

        <div className="industries-navigation">
          <button className={`industries-nav-button prev-button ${prevActive ? "active" : ""}`} onClick={goToPrev}>
            <div className="industries-arrow-icon prev-icon"></div>
          </button>
          <button className={`industries-nav-button next-button ${nextActive ? "active" : ""}`} onClick={goToNext}>
            <div className="industries-arrow-icon next-icon"></div>
          </button>
        </div>
      </div>

      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={() => setModalOpen(false)}>×</button>
            <h2>{selectedIndustry.title}</h2>
            <p>{selectedIndustry.description}</p>
          </div>
        </div>
      )}
    </section>
  );
};

export default IndustriesSection;
