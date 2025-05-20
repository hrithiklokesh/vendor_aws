// import React, { useState, useEffect, useContext } from "react";
// import { VendorContext } from "../context/VendorContext";
// import { UserContext } from "../context/UserContext";
// import { useNavigate } from "react-router-dom";
// import "../Styles/Form2.css";
// import "../Styles/Form1.css";

// export default function Form2() {
//   const navigate = useNavigate();
//   const { vendorData, setVendorData } = useContext(VendorContext);
//   const { currentUser } = useContext(UserContext) || {};

//   const [formData, setFormData] = useState({
//     businessType: vendorData.companyDetails.businessType || "",
//     industryType: vendorData.companyDetails.industryType || "",
//     yearOfEstablishment: vendorData.companyDetails.yearOfEstablishment || "",
//     taxIdentificationNumber: vendorData.companyDetails.taxIdentificationNumber || "",
//     authorizedSignatoryName: vendorData.companyDetails.authorizedSignatoryName || "",
//   });

//   // State to control the visibility of the "Save Changes" indicator
//   const [showSaveIndicator, setShowSaveIndicator] = useState(false);

//   // Load saved data from localStorage on component mount
//   useEffect(() => {
//     if (currentUser) {
//       const savedData = localStorage.getItem(`form2Data_${currentUser.id}`);
//       if (savedData) {
//         const parsedData = JSON.parse(savedData);
//         setFormData(parsedData);
//         setVendorData(prev => ({
//           ...prev,
//           companyDetails: parsedData
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
//     navigate("/Form1");
//   };

//   const handleNext = () => {
//     if (currentUser) {
//       localStorage.setItem(`form2Data_${currentUser.id}`, JSON.stringify(formData));
//     }
//     setVendorData(prev => ({
//       ...prev,
//       companyDetails: {
//         industryType: formData.industryType,
//         businessType: formData.businessType,
//         yearOfEstablishment: formData.yearOfEstablishment,
//         taxIdentificationNumber: formData.taxIdentificationNumber,
//         authorizedSignatoryName: formData.authorizedSignatoryName,
//       }
//     }));
//     navigate("/Form3"); // Navigate to Form3
//   };

//   // New onSubmit handler for form validation
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const requiredFields = [
//       "businessType",
//       "industryType",
//       "yearOfEstablishment",
//       "taxIdentificationNumber",
//       "authorizedSignatoryName"
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
//     <div className="f2-main-container">
//       {/* Sidebar */}
//       <div className="wrapperr">
//         <span className="f1-text">CG</span>
//         <span className="f1-text-2">Complete your KYC</span>
//         <span className="f1-text-3">
//           Please complete your KYC verification by submitting the required
//           documents to ensure seamless access to our services
//         </span>
//         <div className="f2-img" />
//         <span className="form2-text-4">Vendor Details</span>
//         <span className="f2-text-5">Please provide vendor details</span>
//         <div className="box">
//           <div className="img" />
//           <span className="f2-text-6">Company details</span>
//         </div>
//         <span className="f2-text-7">Please provide your company details</span>
//         <div className="section-2">
//           <div className="check-fill" />
//           <span className="service-product-offered">Service/product offered</span>
//         </div>
//         <span className="provide-details-service">
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
//         <span className="f2-company-details-6">Company details</span>
//         <span className="f2-company-verification">
//           Provide your company details for verification and onboarding.
//         </span>

//         {/* Business Type */}
//         <span className="f2-business-type">Business Type</span>
//         <div className="f2-line" />
//         <div className="f2-rectangle-7">
//           <div className="select-container">
//             <select
//               required
//               className="f2-select-one"
//               name="businessType"
//               value={formData.businessType}
//               onChange={handleInputChange}
//               style={{
//                 position: "relative",
//                 width: "100%",
//                 height: "100%",
//                 border: "none",
//                 background: "transparent",
//                 fontFamily: "Poppins, var(--default-font-family)",
//                 fontSize: "18px",
//                 fontWeight: "500",
//                 color: "#555555",
//                 opacity: "0.5",
//                 paddingLeft: "18px",
//                 appearance: "none",
//                 lineHeight: "26px",
//               }}
//             >
//               <option value="">Select one</option>
//               <option value="Sole Proprietorship">Sole Proprietorship</option>
//               <option value="Partnership">Partnership</option>
//               <option value="Corporation">Corporation</option>
//               <option value="LLC">LLC</option>
//             </select>
//           </div>
//           <div className="f2-arrow-down-light" />
//         </div>

//         {/* Industry Type */}
//         <span className="f2-asterisk">*</span>
//         <span className="f2-industry-type">Industry type</span>
//         <div className="f2-line-b" />
//         <div className="f2-rectangle-8">
//           <select
//             required
//             className="f2-select-one-9"
//             name="industryType"
//             value={formData.industryType}
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
//               paddingLeft: "22px",
//               appearance: "none",
//               lineHeight: "28px",
//             }}
//           >
//             <option value="">Select one</option>
//             <option value="Technology">Technology</option>
//             <option value="Manufacturing">Manufacturing</option>
//             <option value="Healthcare">Healthcare</option>
//             <option value="Retail">Retail</option>
//           </select>
//           <div className="f2-arrow-down-light-a" />
//         </div>

//         {/* Year of Establishment */}
//         <span className="f2-asterisk-d">*</span>
//         <span className="f2-year-of-establishment">Year of Establishment</span>
//         <div className="f2-line-e" />
//         <div className="f2-rectangle-c">
//           <input
//             required
//             type="text"
//             className="f2-year"
//             name="yearOfEstablishment"
//             placeholder="Enter Year of Establishment"
//             value={formData.yearOfEstablishment}
//             onChange={handleInputChange}
//             style={{
//               position: "relative",
//               width: "70%",
//               border: "none",
//               background: "transparent",
//               fontFamily: "Poppins, var(--default-font-family)",
//               fontSize: "20px",
//               fontWeight: "500",
//               color: "#555555",
//               opacity: "0.5",
//               paddingLeft: "19px",
//               lineHeight: "58px",
//               textAlign: "left",
//             }}
//           />
//         </div>

//         {/* Tax Identification Number */}
//         <span className="f2-asterisk-f">*</span>
//         <span className="f2-tax-identification-number">
//           Tax Identification number
//         </span>
//         <div className="f2-line-11" />
//         <div className="f2-rectangle-10">
//           <input
//             required
//             type="text"
//             className="f2-ti-number"
//             name="taxIdentificationNumber"
//             placeholder="Enter Tax Identification Number"
//             value={formData.taxIdentificationNumber}
//             onChange={handleInputChange}
//             style={{
//               position: "relative",
//               width: "70%",
//               border: "none",
//               background: "transparent",
//               fontFamily: "Poppins, var(--default-font-family)",
//               fontSize: "18px",
//               fontWeight: "500",
//               color: "#555555",
//               opacity: "0.5",
//               paddingLeft: "15px",
//               lineHeight: "58px",
//               textAlign: "left",
//             }}
//           />
//         </div>

//         {/* Authorized Signatory Name */}
//         <span className="f2-asterisk-13">*</span>
//         <span className="f2-authorized-signatory-name">
//           Authorized Signatory name
//         </span>
//         <div className="f2-rectangle-12">
//           <input
//             required
//             type="text"
//             className="f2-signature"
//             name="authorizedSignatoryName"
//             placeholder="Enter Authorized Signatory Name"
//             value={formData.authorizedSignatoryName}
//             onChange={handleInputChange}
//             style={{
//               position: "relative",
//               width: "70%",
//               border: "none",
//               background: "transparent",
//               fontFamily: "Poppins, var(--default-font-family)",
//               fontSize: "18px",
//               fontWeight: "500",
//               color: "#555555",
//               opacity: "0.5",
//               paddingLeft: "15px",
//               lineHeight: "58px",
//               textAlign: "left",
//             }}
//           />
//         </div>

//         {/* Buttons */}
//         <div className="f2-rectangle-15" onClick={handlePrevious}>
//           <span className="f2-save">Previous</span>
//         </div>
//         <button type="submit" className="f2-rectangle-14">
//           <span className="f2-next">Next</span>
//         </button>
//       </form>
//     </div>
//   );
// }


import React, { useState, useEffect, useContext } from "react";
import { VendorContext } from "../context/VendorContext";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function Form2() {
  const navigate = useNavigate();
  const { vendorData, setVendorData } = useContext(VendorContext);
  const { currentUser } = useContext(UserContext) || {};

  const [formData, setFormData] = useState({
    businessType: vendorData.companyDetails.businessType || "",
    industryType: vendorData.companyDetails.industryType || "",
    yearOfEstablishment: vendorData.companyDetails.yearOfEstablishment || "",
    taxIdentificationNumber: vendorData.companyDetails.taxIdentificationNumber || "",
    authorizedSignatoryName: vendorData.companyDetails.authorizedSignatoryName || "",
  });

  useEffect(() => {
    if (currentUser) {
      const savedData = localStorage.getItem(`form2Data_${currentUser.id}`);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setFormData(parsedData);
        setVendorData(prev => ({
          ...prev,
          companyDetails: parsedData
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
    navigate("/Form1");
  };

  const handleNext = () => {
    if (currentUser) {
      localStorage.setItem(`form2Data_${currentUser.id}`, JSON.stringify(formData));
    }
    setVendorData(prev => ({
      ...prev,
      companyDetails: { ...formData }
    }));
    navigate("/Form3");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const requiredFields = [
      "businessType",
      "industryType",
      "yearOfEstablishment",
      "taxIdentificationNumber",
      "authorizedSignatoryName"
    ];
    for (const field of requiredFields) {
      if (!formData[field] || formData[field].trim() === "") {
        alert("Please fill the field: " + field);
        return;
      }
    }
    handleNext();
  };

  const renderField = (label, name, type = "text") => (
    <div className="flex flex-col md:flex-row items-start gap-4">
      <label className="w-full md:w-1/4 text-lg font-medium text-left">{label}</label>
      <input
        required
        type={type}
        name={name}
        value={formData[name]}
        onChange={handleInputChange}
        placeholder={label}
        className="flex-1 w-full md:w-3/4 border border-gray-300 rounded px-4 py-2 text-lg"
      />
    </div>
  );

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
        <option value="">Select one</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="flex w-screen h-screen overflow-hidden bg-white">
      <Sidebar currentStep={1} />

      <div className="flex-1 ml-0 md:ml-[] h-screen overflow-y-auto px-4 md:px-10 py-10">
        <span className="text-2xl font-medium block mb-1">Company Details</span>
        <span className="text-base text-gray-500 block mb-8 pb-4">Provide your company details for verification and onboarding.</span>

        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-0">
          {renderSelect("Business Type", "businessType", ["Sole Proprietorship", "Partnership", "Corporation", "LLC"])}
          {renderSelect("Industry Type", "industryType", ["Technology", "Manufacturing", "Healthcare", "Retail"])}
          {renderField("Year of Establishment", "yearOfEstablishment")}
          {renderField("Tax Identification Number", "taxIdentificationNumber")}
          {renderField("Authorized Signatory Name", "authorizedSignatoryName")}

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
