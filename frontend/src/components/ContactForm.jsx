import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/ContactSection.css";

const ContactSection = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });

  const [startTyping, setStartTyping] = useState(false);
  const typingRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setStartTyping(true);
      }
    });
    if (typingRef.current) {
      observer.observe(typingRef.current);
    }
    return () => observer.disconnect();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5001/api/contact", formData);
      toast.success(response.data.message || "Form submitted successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (error) {
      console.error("Error submitting form", error);
      toast.error("Form submission failed. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <section className="contact-section">
      <div className="contact-content">
        <div className="contact-info">
          <h2 className="contact-heading" ref={typingRef}>
            <span className={`get-in-touch-81 ${startTyping ? 'typing-animation' : ''}`}>Get in Touch: </span>
            <span className="answer-questions-82">We're Here to Answer Your Questions</span>
          </h2>
          <button className="book-consultant-btn" onClick={() => window.open("https://wa.me/919606461633", "_blank")}>
            <span className="book-free-consultant">Book your free consultant</span>
          </button>
        </div>

        <div className="contact-form-container">
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="get-in-touch-form">
              <h3 className="get-in-content" style={{color:"#ffffff"}}>Get in Touch</h3>
              <p className="reach-us-content">You can reach us any time</p>
            </div>

            <div className="form-row">
              <div className="form-group">
                <input type="text" className="form-control" name="firstName" placeholder="First name" value={formData.firstName} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <input type="text" className="form-control" name="lastName" placeholder="Last name" value={formData.lastName} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-group">
              <input type="email" className="form-control" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <input type="tel" className="form-control" name="phone" placeholder="Phone number" value={formData.phone} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <textarea className="form-control textArea" name="message" placeholder="Your message" rows="5" value={formData.message} onChange={handleChange} required></textarea>
            </div>

            <button type="submit" className="submit-btn">
              <span className="landing-submit">Submit</span>
            </button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </section>
  );
};

export default ContactSection;
