// import React from "react";
// import "../styles/Footer.css";

// const Footer = () => {
//   return (
//     <footer className="site-footer">
//       <div className="footer-content">
//         <div className="footer-top">
//           <div className="footer-container"style={{padding: "20px"}}>
//             <div className="footer-logo">
//                 <div className="image-8f"></div>
//             </div>
//             <div className="footer-info">
//               <h3 className="contact-info">Caasdi Global</h3>
//             <p className="address">
//               #262, 80ft Road, BSK 1st stage, 2nd Block,<br />Srinivasnagar,
//               Bengaluru,Karnataka-560050
//             </p>
//             <h3 className="contact-info">Contact Information</h3>
//             <p className="email-info">Email: corporate@caasdiglobal.in</p>
//             <p className="phone-info">
//               Phone: +91-9606461633, +91-9606461642<br />
//               +91-9606461633
//             </p>
//           </div>
        
//             {/* <div className="brand-description" style={{padding: "20px"}}>
//             <p className="brand-partner">
//               Your trusted brand partner, so you can focus on building from within
//               while we handle development and solutions to drive your growth
//               forward
//             </p>
//             <div>
//                 <a href="#" style={{color:"white"}}> @Terms and conditions</a>
//             </div>
//           </div> */}
//           </div>
//           <div className="footer-info">
//             <h3 className="contact-info">Legal</h3>
//               <a href="#" style={{color:"white", textDecoration:"none"}}>Terms and conditions</a>
//               <a href="#" style={{color:"white", textDecoration:"none"}}>Policies</a>
//           </div>
//           <div className="footer-info">
//             <h3 className="contact-info">Company</h3>
//               <a href="#about" style={{color:"white", textDecoration:"none"}}>About Us</a>
//               <a href="#expertise" style={{color:"white", textDecoration:"none"}}>Expertise</a>
//               <a href="#scroller" style={{color:"white", textDecoration:"none"}}>Services</a>
//               <a href="https://www.linkedin.com/company/caasdi-global/jobs/" style={{color:"white", textDecoration:"none"}}>Career</a>
//               <a href="https://www.linkedin.com/company/caasdi-global/posts/?feedView=all" style={{color:"white", textDecoration:"none"}}>Blogs</a>
    
//           </div>
//           <div className="footer-social">
//             <h3 className="follow-us">Follow Us</h3>
//             <div className="social-icons">
//               <a href="https://www.instagram.com/caasdi_global/  " className="social-icon instagram" aria-label="Instagram"></a>
//               <a href="https://in.linkedin.com/company/caasdi-global " className="social-icon linkedin" aria-label="LinkedIn"></a>
//               <a href="https://x.com/caasdiglobal " className="social-icon twitter" aria-label="Twitter"></a>
              
//             </div>
//           </div>
//         </div>
//         <div className="footer-bottom">
//           <p className="copyright">
//             © Caasdi Global 2024 All Rights Reserved
//           </p>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;

import React from "react";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-top">
          <div className="footer-container" style={{ padding: "20px" }}>
            <div className="footer-logo">
              <div className="image-8f"></div>
            </div>
            <div className="footer-info">
              <h3 className="contact-info">Caasdi Global</h3>
              <p className="address">
                #262, 80ft Road, BSK 1st stage, 2nd Block,<br />
                Srinivasnagar, Bengaluru, Karnataka-560050
              </p>
              <h3 className="contact-info">Contact Information</h3>
              <p className="email-info">Email: corporate@caasdiglobal.in</p>
              <p className="phone-info">
                Phone: +91-9606461633, +91-9606461642, 
                <br />+91-9606461643
              </p>
            </div>
          </div>

          <div className="footer-info">
            <h3 className="contact-info">Legal</h3>
            <a href="#" style={{ color: "white", textDecoration: "none" }}>
              Terms and conditions
            </a>
            <a href="#" style={{ color: "white", textDecoration: "none" }}>
              Policies
            </a>
          </div>

          <div className="footer-info">
            <h3 className="contact-info">Company</h3>
            <a href="#about" style={{ color: "white", textDecoration: "none" }}>
              About Us
            </a>
            <a href="#expertise" style={{ color: "white", textDecoration: "none" }}>
              Expertise
            </a>
            <a href="#scroller" style={{ color: "white", textDecoration: "none" }}>
              Services
            </a>
            <a href="https://www.linkedin.com/company/caasdi-global/jobs/" style={{ color: "white", textDecoration: "none" }}>
              Career
            </a>
            <a href="https://www.linkedin.com/company/caasdi-global/posts/?feedView=all" style={{ color: "white", textDecoration: "none" }}>
              Blogs
            </a>
          </div>

          <div className="footer-social">
            <h3 className="follow-us">Follow Us</h3>
            <div className="social-icons">
              <a href="https://www.instagram.com/caasdi_global/" className="social-icon instagram" aria-label="Instagram"></a>
              <a href="https://in.linkedin.com/company/caasdi-global" className="social-icon linkedin" aria-label="LinkedIn"></a>
              <a href="https://x.com/caasdiglobal" className="social-icon twitter" aria-label="Twitter"></a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright">© Caasdi Global 2024 All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
