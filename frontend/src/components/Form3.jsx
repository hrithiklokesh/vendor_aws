// import React, { useState, useEffect, useContext } from "react";
// import { VendorContext } from "../context/VendorContext";
// import { UserContext } from "../context/UserContext";
// import { useNavigate } from "react-router-dom";
// import "../Styles/Form3.css";
// import "../Styles/Form1.css";

// export default function Form3() {
//   const navigate = useNavigate();
//   const { vendorData, setVendorData } = useContext(VendorContext);
//   const { currentUser } = useContext(UserContext) || {};
    
//   const [formData, setFormData] = useState({
//     productDescription: vendorData.serviceProductDetails.productDescription || "",
//     paymentTerms: vendorData.serviceProductDetails.paymentTerms || "",
//     paymentMode: vendorData.serviceProductDetails.paymentMode || "",
//   });

//   // State to control the visibility of the "Save Changes" indicator
//   const [showSaveIndicator, setShowSaveIndicator] = useState(false);

//   // Load saved data from localStorage on mount
//   useEffect(() => {
//     if (currentUser) {
//       const savedData = localStorage.getItem(`form3Data_${currentUser.id}`);
//       if (savedData) {
//         const parsedData = JSON.parse(savedData);
//         setFormData(parsedData);
//         setVendorData(prev => ({
//           ...prev,
//           serviceProductDetails: parsedData
//         }));
//       }
//     }
//   }, [currentUser]);

//   // Handle input changes
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handlePrevious = () => {
//     navigate("/Form2");
//   };

//   const handleNext = () => {
//     if (currentUser) {
//       localStorage.setItem(`form3Data_${currentUser.id}`, JSON.stringify(formData));
//     }
//     setVendorData(prev => ({
//       ...prev,
//       serviceProductDetails: {
//         productDescription: formData.productDescription,
//         paymentTerms: formData.paymentTerms,
//         paymentMode: formData.paymentMode,
//       }
//     }));
//     navigate("/Form4");
//   };

//   // New onSubmit handler for form validation
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const requiredFields = [
//       "productDescription",
//       "paymentTerms",
//       "paymentMode"
//     ];
//     for (const field of requiredFields) {
//       if (!formData[field] || formData[field].trim() === "") {
//         alert("Please fill the field: " + field);
//         return;
//       }
//     }
//     handleNext();
//   };

//   return (
//     <div className="main-container">
      
//       {/* Sidebar */}
//       <div className="wrapper">
//         <span className="f1-text">CG</span>
//         <span className="f1-text-2">Complete your KYC</span>
//         <span className="f1-text-3">
//           Please complete your KYC verification by submitting the required
//           documents to ensure seamless access to our services
//         </span>
//         <div className="f3-section">
//           <div className="img" />
//           <span className="f1-text-4">Vendor Details</span>
//         </div>
//         <span className="text-5">Please provide vendor details</span>
//         <div className="box">
//           <div className="img" />
//           <span className="f2-text-6">Company details</span>
//         </div>
//         <span className="f2-text-7">Please provide your company details</span>
//         <div className="section-2">
//           <div className="f3-img" />
//           <span className="form3-service-product-offered">Service/product offered</span>
//         </div>
//         <span className="form3-provide-details-service">
//           Please provide details about your service
//         </span>
//         <div className="flex-row-a">
//           <div className="check-fill-1" />
//           <span className="f1-bank-details">Bank details</span>
//         </div>
//         <span className="f1-provide-bank-details">Please provide Bank details</span>
//         <div className="flex-row-ecd">
//           <div className="check-fill-2" />
//           <span className="f1-compliance-certifications">
//             Compliance and certifications
//           </span>
//         </div>
//         <span className="f1-provide-certifications">
//           Please provide certifications
//         </span>
//         <div className="flex-row-ca">
//           <div className="check-fill-3" />
//           <span className="f1-additional-details">Additional details</span>
//         </div>
//         <span className="f1-text-f">Please provide Additional details</span>
//       </div>

//       {/* Form Section */}
//       <form onSubmit={handleSubmit}>
//         <span className="f3-service-products-offered">Service/products offered</span>
//         <span className="f3-product-details-verification">
//           Provide your details about your products for verification and onboarding.
//         </span>

//         {/* Product/Service Description */}
//         <div className="f3-rectangle-7">
//           <textarea
//             required
//             className="f3-tell-us-product"
//             name="productDescription"
//             value={formData.productDescription}
//             placeholder="Enter your product description"
//             onChange={handleInputChange}
//             style={{
//               position: "relative",
//               width: "100%",
//               height: "100%",
//               border: "none",
//               background: "transparent",
//               fontFamily: "Poppins, var(--default-font-family)",
//               fontSize: "14px",
//               fontWeight: "500",
//               color: "#555555",
//               opacity: "0.5",
//               padding: "10px",
//               lineHeight: "12px",
//               resize: "none",
//               textAlign: "left",
//             }}
//           />
//         </div>
//         <span className="f3-asterisk">*</span>
//         <span className="f3-product-description">Product/service Description</span>
//         <div className="f3-line" />

//         {/* Payment Terms */}
//         <div className="f3-rectangle-8">
//           <select
//             required
//             className="f3-terms"
//             name="paymentTerms"
//             value={formData.paymentTerms}
//             onChange={handleInputChange}
//             style={{
//               position: "relative",
//               width: "100%",
//               height: "100%",
//               border: "none",
//               background: "transparent",
//               fontFamily: "Poppins, var(--default-font-family)",
//               fontSize: "18px",
//               fontWeight: "500",
//               color: "#555555",
//               opacity: "0.5",
//               paddingLeft: "15px",
//               appearance: "none",
//               lineHeight: "36px",
//             }}
//           >
//             <option value="">Terms</option>
//             <option value="Net 30">Net 30</option>
//             <option value="Net 60">Net 60</option>
//             <option value="Due on Receipt">Due on Receipt</option>
//           </select>
//           <div className="f3-arrow-down-light" />
//         </div>
//         <span className="f3-asterisk-9">*</span>
//         <span className="f3-payment-terms">Payment terms</span>
//         <div className="f3-line-a" />

//         {/* Mode of Payments */}
//         <div className="f3-rectangle-b">
//           <select
//             required
//             className="f3-payment-mode"
//             name="paymentMode"
//             value={formData.paymentMode}
//             onChange={handleInputChange}
//             style={{
//               position: "relative",
//               width: "100%",
//               height: "100%",
//               border: "none",
//               background: "transparent",
//               fontFamily: "Poppins, var(--default-font-family)",
//               fontSize: "18px",
//               fontWeight: "500",
//               color: "#555555",
//               opacity: "0.5",
//               paddingLeft: "15px",
//               appearance: "none",
//               lineHeight: "28px",
//             }}
//           >
//             <option value="">Payment mode</option>
//             <option value="Bank Transfer">Bank Transfer</option>
//             <option value="Credit Card">Credit Card</option>
//             <option value="Cash">Cash</option>
//           </select>
//           <div className="f3-arrow-down-light-c" />
//         </div>
//         <span className="f3-asterisk-d">*</span>
//         <span className="f3-mode-of-payments">Mode of paymeants</span>

//         {/* Buttons */}
//         <button type="submit" className="f3-pic-6">
//           <span className="f3-text-26">Next</span>
//         </button>
//         <div className="f3-box-2" onClick={handlePrevious}>
//           <span className="f3-text-27">Previous</span>
//         </div>
//         <div className="f3-bottom-spacer" />
//       </form>
//     </div>
//   );
// }

import React, { useState, useEffect, useContext } from "react";
import { VendorContext } from "../context/VendorContext";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function Form3() {
  const navigate = useNavigate();
  const { vendorData, setVendorData } = useContext(VendorContext);
  const { currentUser } = useContext(UserContext) || {};

  const [formData, setFormData] = useState({
    productDescription: vendorData.serviceProductDetails.productDescription || "",
    paymentTerms: vendorData.serviceProductDetails.paymentTerms || "",
    paymentMode: vendorData.serviceProductDetails.paymentMode || "",
  });

  useEffect(() => {
    if (currentUser) {
      const savedData = localStorage.getItem(`form3Data_${currentUser.id}`);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setFormData(parsedData);
        setVendorData(prev => ({
          ...prev,
          serviceProductDetails: parsedData
        }));
      }
    }
  }, [currentUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePrevious = () => {
    navigate("/Form2");
  };

  const handleNext = () => {
    if (currentUser) {
      localStorage.setItem(`form3Data_${currentUser.id}`, JSON.stringify(formData));
    }
    setVendorData(prev => ({
      ...prev,
      serviceProductDetails: { ...formData }
    }));
    navigate("/Form4");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const requiredFields = ["productDescription", "paymentTerms", "paymentMode"];
    for (const field of requiredFields) {
      if (!formData[field] || formData[field].trim() === "") {
        alert("Please fill the field: " + field);
        return;
      }
    }
    handleNext();
  };

  const renderSelect = (label, name, options) => (
    <div className="flex flex-col md:flex-row items-start gap-4">
      <label className="w-full md:w-1/4 text-lg font-medium text-left">{label}</label>
      <select
        required
        name={name}
        value={formData[name]}
        onChange={handleInputChange}
        className="flex-1 w-full md:w-3/4 border border-gray-300 rounded px-4 py-2 text-lg opacity-70"
      >
        <option value="">Select</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="flex w-screen h-screen overflow-hidden bg-white">
      <Sidebar currentStep={2} />

      <div className="flex-1 ml-0 md:ml-[] h-screen overflow-y-auto px-4 md:px-10 py-10">
        <span className="text-2xl font-medium block mb-1">Service/Products Offered</span>
        <span className="text-base text-gray-500 block mb-8 pb-4">Provide your details about your products for verification and onboarding.</span>

        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-0">
          <div className="flex flex-col md:flex-row items-start gap-4">
            <label className="w-full md:w-1/4 text-lg font-medium text-left">Product/Service Description</label>
            <textarea
              required
              name="productDescription"
              value={formData.productDescription}
              onChange={handleInputChange}
              placeholder="Enter your product description"
              className="flex-1 w-full md:w-3/4 border border-gray-300 rounded px-4 py-2 text-lg opacity-70 resize-none"
              rows={4}
            />
          </div>

          {renderSelect("Payment Terms", "paymentTerms", ["Net 30", "Net 60", "Due on Receipt"])}
          {renderSelect("Mode of Payments", "paymentMode", ["Bank Transfer", "Credit Card", "Cash"])}

          <div className="flex gap-4">
            <button
              type="button"
              onClick={handlePrevious}
              className="w-1/2 md:w-1/4 bg-gray-200 text-black py-3 rounded-lg text-lg font-semibold hover:bg-gray-300 transition-all"
            >
              Previous
            </button>
            <button
              type="submit"
              className="w-1/2 md:w-1/4 bg-[#00c298] text-white py-3 rounded-lg text-lg font-semibold hover:bg-[#00aa89] transition-all"
            >
              Next
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
