// import React, { useState, useEffect, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import { VendorContext } from "../context/VendorContext";
// import { UserContext } from "../context/UserContext";
// import "../Styles/Form1.css";

// function Form1() {
//   const navigate = useNavigate();
//   const vendorContext = useContext(VendorContext);
//   const { vendorData, setVendorData, currentUser: vendorContextUser } = vendorContext;
//   const { currentUser: userContextUser } = useContext(UserContext) || {};
  
//   // Use either context's user
//   const currentUser = vendorContextUser || userContextUser;

//   // Initialize state for form fields
//   const [formData, setFormData] = useState({
//     companyName: vendorData.vendorDetails.companyName || "",
//     primaryContactName: vendorData.vendorDetails.primaryContactName || currentUser?.name || "",
//     designation: vendorData.vendorDetails.designation || "",
//     phoneNumber: vendorData.vendorDetails.phoneNumber || "",
//     primaryContactEmail: vendorData.vendorDetails.primaryContactEmail || currentUser?.email || "",
//     address: vendorData.vendorDetails.address || "",
//     city: vendorData.vendorDetails.city || "",
//     state: vendorData.vendorDetails.state || "",
//     pinCode: vendorData.vendorDetails.pinCode || "",
//     gstin: vendorData.vendorDetails.gstin || "",
//   });

//   // State to control the visibility of the "Save Changes" indicator
//   const [showSaveIndicator, setShowSaveIndicator] = useState(false);

//   // Load saved data from localStorage when component mounts
//   useEffect(() => {
//     if (currentUser) {
//       const userKey = `user-${currentUser.id}-form1Data`;
//       const savedData = localStorage.getItem(userKey);
//       if (savedData) {
//         setFormData(JSON.parse(savedData));
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

//   const handleNext = () => {
//     setVendorData(prev => ({
//       ...prev,
//       vendorDetails: {
//         companyName: formData.companyName,
//         primaryContactName: formData.primaryContactName,
//         designation: formData.designation,
//         phoneNumber: formData.phoneNumber,
//         primaryContactEmail: formData.primaryContactEmail,
//         address: formData.address,
//         city: formData.city,
//         state: formData.state,
//         pinCode: formData.pinCode,
//         gstin: formData.gstin
//       }
//     }));
//     navigate("/Form2"); // Navigate to Form2
//   };

//   // New onSubmit handler for form validation
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Check for empty required fields
//     const requiredFields = [
//       "companyName",
//       "primaryContactName",
//       "designation",
//       "phoneNumber",
//       "address",
//       "email",
//       "city",
//       "state",
//       "pinCode",
//       "gstin"
//     ];
//     for (const field of requiredFields) {
//       if (!formData[field] || formData[field].trim() === "") {
//         alert("Please fill the field: " + field);
//         return;
//       }
//     }
//     // If all fields are filled, proceed
//     handleNext();
//   };

//   return (
//     // <div className="f1-kyc-1-main-container">
//     //   {/* Left Section (Sidebar) */}
//     //   <div className="f1-wrapper">
//     //     <span className="f1-text">CG</span>
//     //     <span className="f1-text-2">Complete your KYC</span>
//     //     <span className="f1-text-3">
//     //       Please complete your KYC verification by submitting the required
//     //       documents to ensure seamless access to our services
//     //     </span>
//     //     <div className="f1-section">
//     //       <div className="img" />
//     //       <span className="f1-text-4">Vendor Details</span>
//     //     </div>
//     //     <span className="f1-text-5">Please provide vendor details</span>
//     //     <div className="box">
//     //       <div className="f1-img-2" />
//     //       <span className="f1-text-6">Company details</span>
//     //     </div>
//     //     <span className="f1-text-7">Please provide your company details</span>
//     //     <div className="section-2">
//     //       <div className="check-fill" />
//     //       <span className="service-product-offered">Service/product offered</span>
//     //     </div>
//     //     <span className="provide-details-service">
//     //       Please provide details about your service
//     //     </span>
//     //     <div className="flex-row-a">
//     //       <div className="check-fill-1" />
//     //       <span className="f1-bank-details">Bank details</span>
//     //     </div>
//     //     <span className="f1-provide-bank-details">Please provide Bank details</span>
//     //     <div className="flex-row-ecd">
//     //       <div className="check-fill-2" />
//     //       <span className="f1-compliance-certifications">
//     //         Compliance and certifications
//     //       </span>
//     //     </div>
//     //     <span className="f1-provide-certifications">
//     //       Please provide certifications
//     //     </span>
//     //     <div className="flex-row-ca">
//     //       <div className="check-fill-3" />
//     //       <span className="f1-additional-details">Additional details</span>
//     //     </div>
//     //     <span className="f1-text-f">Please provide Additional details</span>
//     //   </div>

//     //   {/* Right Section (Form) */}
//     //   <div className="f1-form-section">
//     //     <span className="f1-text-10">Vendor Details</span>
//     //     <span className="f1-text-12">
//     //       Provide your vendor details for verification and onboarding.
//     //     </span>

//     //     <form onSubmit={handleSubmit}>
//     //       {/* Vendor Name */}
//     //       <div className="f1-wrapper-4">
//     //         <input
//     //           required
//     //           type="text"
//     //           className="f1-text-13"
//     //           placeholder="Company name"
//     //           name="companyName"
//     //           value={formData.companyName}
//     //           onChange={handleInputChange}
//     //         />
//     //       </div>
//     //       <span className="f1-text-14">Vendor name</span>
//     //       <div className="f1-pic-3" />

//     //       {/* Primary Contact Name */}
//     //       <div className="f1-section-3">
//     //         <input
//     //           required
//     //           type="text"
//     //           className="f1-text-15"
//     //           placeholder="Name"
//     //           name="primaryContactName"
//     //           value={formData.primaryContactName}
//     //           onChange={handleInputChange}
//     //         />
//     //       </div>
//     //       <span className="f1-text-16">*</span>
//     //       <span className="f1-text-17">Primary contact name</span>

//     //       <div className="f1-wrapper-5">
//     //         <input
//     //           required
//     //           type="text"
//     //           className="f1-text-18"
//     //           placeholder="Designation"
//     //           name="designation"
//     //           value={formData.designation}
//     //           onChange={handleInputChange}
//     //         />
//     //       </div>
//     //       <div className="f1-pic-4" />

//     //       {/* Contact Details */}
//     //       <div className="f1-wrapper-6">
//     //         <input
//     //           required
//     //           type="text"
//     //           className="f1-text-19"
//     //           placeholder="Phone number"
//     //           name="phoneNumber"
//     //           value={formData.phoneNumber}
//     //           onChange={handleInputChange}
//     //         />
//     //       </div>
//     //       <span className="f1-text-1a">*</span>
//     //       <span className="f1-text-1b">Contact Details</span>

//     //       <div className="f1-group-2">
//     //         <input
//     //           required
//     //           type="email"
//     //           className="f1-text-1c"
//     //           placeholder="email"
//     //           name="email"
//     //           value={formData.email}
//     //           onChange={handleInputChange}
//     //         />
//     //       </div>
//     //       <div className="f1-pic-5" />
//     //       <span className="f1-text-1d">*</span>

//     //       {/* Address */}
//     //       <div className="f1-wrapper-7">
//     //         <input
//     //           required
//     //           type="text"
//     //           className="f1-text-1e"
//     //           placeholder="Address"
//     //           name="address"
//     //           value={formData.address}
//     //           onChange={handleInputChange}
//     //         />
//     //       </div>
//     //       <span className="f1-text-1f">Address</span>

//     //       <div className="f1-section-5">
//     //         <input
//     //           required
//     //           type="text"
//     //           className="f1-text-21"
//     //           placeholder="City"
//     //           name="city"
//     //           value={formData.city}
//     //           onChange={handleInputChange}
//     //         />
//     //       </div>

//     //       <div className="f1-section-4">
//     //         <input
//     //           required
//     //           type="text"
//     //           className="f1-text-20"
//     //           placeholder="State"
//     //           name="state"
//     //           value={formData.state}
//     //           onChange={handleInputChange}
//     //         />
//     //       </div>

//     //       <div className="f1-section-6">
//     //         <input
//     //           required
//     //           type="text"
//     //           className="f1-text-22"
//     //           placeholder="Pin code"
//     //           name="pinCode"
//     //           value={formData.pinCode}
//     //           onChange={handleInputChange}
//     //         />
//     //       </div>
//     //       <div className="f1-img-6" />

//     //       {/* Business Registration Number */}
//     //       <div className="f1-wrapper-8">
//     //         <input
//     //           required
//     //           type="text"
//     //           className="f1-text-23"
//     //           placeholder="GSTIN/Registration number"
//     //           name="gstin"
//     //           value={formData.gstin}
//     //           onChange={handleInputChange}
//     //         />
//     //       </div>
//     //       <span className="f1-text-24">*</span>
//     //       <span className="f1-text-25">Business registration number</span>

//     //       {/* Buttons */}
//     //       <button type="submit" className="f1-pic-6">
//     //         <span className="f1-text-26">Next</span>
//     //       </button>
//     //     </form>

//     //     <div className="f1-bottom-spacer" />
//     //   </div>
//     // </div>
//     <div className="flex w-screen h-screen overflow-hidden bg-white">
//     {/* Sidebar - hidden on screens smaller than md */}
//     <div className="w-0 md:w-[33%] h-full top-0 left-0 bg-[#f6fffd] text-black hidden md:flex flex-col fixed md:relative overflow-y-auto px-4 md:px-6 py-6">
//       <div className="w-full max-w-full">
//       <div className="text-3xl font-bold text-[#105a4a] mb-1">CG</div>

//         <span className="block text-lg font-medium">Complete your KYC</span>
//         <span className="block w-full text-sm font-light leading-6 opacity-50">
//           Please complete your KYC verification by submitting the required
//           documents to ensure seamless access to our services
//         </span>

//         {/* Steps section */}
//         <div className="mt-6 space-y-4">
//           <div className="flex items-center">
//             <div className="w-6 h-6 bg-[url('https://static.codia.ai/custom_image/2025-03-28/082932/check-icon.svg')] bg-no-repeat bg-center bg-cover mr-2" />
//             <span className="text-base font-medium">Vendor Details</span>
//           </div>
//           <span className="block text-sm font-light">Please provide vendor details</span>

//           <div className="flex items-center">
//             <div className="w-6 h-6 bg-[url('https://static.codia.ai/custom_image/2025-03-28/082932/business-info-icon.svg')] bg-no-repeat bg-center bg-cover mr-2" />
//             <span className="text-base font-medium opacity-50">Company details</span>
//           </div>
//           <span className="block text-sm font-light opacity-50">Please provide your company details</span>

//           <div className="flex items-center">
//             <div className="w-6 h-6 bg-[url('https://static.codia.ai/custom_image/2025-03-28/082932/service-product-icon.svg')] bg-no-repeat bg-center bg-cover mr-2" />
//             <span className="text-base font-medium opacity-50">Service/product offered</span>
//           </div>
//           <span className="block text-sm font-light opacity-50">Please provide details about your service</span>

//           <div className="flex items-center">
//             <div className="w-6 h-6 bg-[url('https://static.codia.ai/custom_image/2025-03-28/082932/bank-details-icon.svg')] bg-no-repeat bg-center bg-cover mr-2" />
//             <span className="text-base font-medium opacity-50">Bank details</span>
//           </div>
//           <span className="block text-sm font-light opacity-50">Please provide Bank details</span>

//           <div className="flex items-center">
//             <div className="w-6 h-6 bg-[url('https://static.codia.ai/custom_image/2025-03-28/082932/compliance-icon.svg')] bg-no-repeat bg-center bg-cover mr-2" />
//             <span className="text-base font-medium opacity-50">Compliance and certifications</span>
//           </div>
//           <span className="block text-sm font-light opacity-50">Please provide certifications</span>

//           <div className="flex items-center">
//             <div className="w-6 h-6 bg-[url('https://static.codia.ai/custom_image/2025-03-28/082932/additional-details-icon.svg')] bg-no-repeat bg-center bg-cover mr-2" />
//             <span className="text-base font-medium opacity-50">Additional details</span>
//           </div>
//           <span className="block text-sm font-light opacity-50">Please provide Additional details</span>
//         </div>
//       </div>
//     </div>

//     {/* Form Section */}
//     <div className="flex-1 ml-0 md:ml-[] h-screen overflow-y-auto px-4 md:px-10 py-10">
//         <span className="text-2xl font-medium block mb-1">Vendor Details</span>
//         <span className="text-base text-gray-500 block mb-8">Provide your vendor details for verification and onboarding.</span>

//         <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-0">
//           <div>
//             <input
//               required
//               type="text"
//               placeholder="Company name"
//               name="companyName"
//               value={formData.companyName}
//               onChange={handleInputChange}
//               className="w-full border border-gray-300 rounded px-4 py-2 text-lg"
//             />
//             <label className="text-lg font-medium mt-2 block">Vendor name</label>
//           </div>

//           <div>
//             <input
//               required
//               type="text"
//               placeholder="Name"
//               name="primaryContactName"
//               value={formData.primaryContactName}
//               onChange={handleInputChange}
//               className="w-full border border-gray-300 rounded px-4 py-2 text-lg"
//             />
//             <label className="text-lg font-medium mt-2 block">Primary contact name</label>
//           </div>

//           <div>
//             <input
//               required
//               type="text"
//               placeholder="Designation"
//               name="designation"
//               value={formData.designation}
//               onChange={handleInputChange}
//               className="w-full border border-gray-300 rounded px-4 py-2 text-lg"
//             />
//           </div>

//           <div>
//             <input
//               required
//               type="text"
//               placeholder="Phone number"
//               name="phoneNumber"
//               value={formData.phoneNumber}
//               onChange={handleInputChange}
//               className="w-full border border-gray-300 rounded px-4 py-2 text-lg"
//             />
//             <label className="text-lg font-medium mt-2 block">Contact Details</label>
//           </div>

//           <div>
//             <input
//               required
//               type="email"
//               placeholder="Email"
//               name="email"
//               value={formData.email}
//               onChange={handleInputChange}
//               className="w-full border border-gray-300 rounded px-4 py-2 text-lg"
//             />
//           </div>

//           <div>
//             <input
//               required
//               type="text"
//               placeholder="Address"
//               name="address"
//               value={formData.address}
//               onChange={handleInputChange}
//               className="w-full border border-gray-300 rounded px-4 py-2 text-lg"
//             />
//             <label className="text-lg font-medium mt-2 block">Address</label>
//           </div>

//           <div className="flex flex-col md:flex-row gap-4">
//             <input
//               required
//               type="text"
//               placeholder="City"
//               name="city"
//               value={formData.city}
//               onChange={handleInputChange}
//               className="w-full border border-gray-300 rounded px-4 py-2 text-lg"
//             />
//             <input
//               required
//               type="text"
//               placeholder="State"
//               name="state"
//               value={formData.state}
//               onChange={handleInputChange}
//               className="w-full border border-gray-300 rounded px-4 py-2 text-lg"
//             />
//           </div>

//           <div>
//             <input
//               required
//               type="text"
//               placeholder="Pin code"
//               name="pinCode"
//               value={formData.pinCode}
//               onChange={handleInputChange}
//               className="w-full border border-gray-300 rounded px-4 py-2 text-lg"
//             />
//           </div>

//           <div>
//             <input
//               required
//               type="text"
//               placeholder="GSTIN/Registration number"
//               name="gstin"
//               value={formData.gstin}
//               onChange={handleInputChange}
//               className="w-full border border-gray-300 rounded px-4 py-2 text-lg"
//             />
//             <label className="text-lg font-medium mt-2 block">Business registration number</label>
//           </div>

//           <button
//             type="submit"
//             className="w-full md:w-1/2 bg-[#00c298] text-white py-3 rounded-lg text-lg font-semibold hover:bg-[#00aa89] transition-all"
//           >
//             Next
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default Form1;



import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { VendorContext } from "../context/VendorContext";
import { UserContext } from "../context/UserContext";
// import "../Styles/Form1.css";
import Sidebar from "./Sidebar";

function Form1() {
  const navigate = useNavigate();
  const vendorContext = useContext(VendorContext);
  const { vendorData, setVendorData, currentUser: vendorContextUser } = vendorContext;
  const { currentUser: userContextUser } = useContext(UserContext) || {};
  
  // Use either context's user
  const currentUser = vendorContextUser || userContextUser;

  // Initialize state for form fields
  const [formData, setFormData] = useState({
    companyName: vendorData.vendorDetails.companyName || "",
    primaryContactName: vendorData.vendorDetails.primaryContactName || currentUser?.name || "",
    designation: vendorData.vendorDetails.designation || "",
    phoneNumber: vendorData.vendorDetails.phoneNumber || "",
    primaryContactEmail: vendorData.vendorDetails.primaryContactEmail || currentUser?.email || "",
    address: vendorData.vendorDetails.address || "",
    city: vendorData.vendorDetails.city || "",
    state: vendorData.vendorDetails.state || "",
    pinCode: vendorData.vendorDetails.pinCode || "",
    gstin: vendorData.vendorDetails.gstin || "",
  });

  // State to control the visibility of the "Save Changes" indicator
  const [showSaveIndicator, setShowSaveIndicator] = useState(false);

  // Load saved data from localStorage when component mounts
  useEffect(() => {
    if (currentUser) {
      const userKey = `user-${currentUser.id}-form1Data`;
      const savedData = localStorage.getItem(userKey);
      if (savedData) {
        setFormData(JSON.parse(savedData));
      }
    }
  }, [currentUser]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleNext = () => {
    setVendorData(prev => ({
      ...prev,
      vendorDetails: {
        companyName: formData.companyName,
        primaryContactName: formData.primaryContactName,
        designation: formData.designation,
        phoneNumber: formData.phoneNumber,
        primaryContactEmail: formData.primaryContactEmail,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pinCode: formData.pinCode,
        gstin: formData.gstin
      }
    }));
    navigate("/Form2"); // Navigate to Form2
  };

  // New onSubmit handler for form validation
  const handleSubmit = (e) => {
    e.preventDefault();
    // Check for empty required fields
    const requiredFields = [
      "companyName",
      "primaryContactName",
      "designation",
      "phoneNumber",
      "address",
      "email",
      "city",
      "state",
      "pinCode",
      "gstin"
    ];
    for (const field of requiredFields) {
      if (!formData[field] || formData[field].trim() === "") {
        alert("Please fill the field: " + field);
        return;
      }
    }
    // If all fields are filled, proceed
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

  return (
    <div className="flex w-screen h-screen overflow-hidden bg-white">
      <Sidebar currentStep={0} />

      {/* Form Section */}
      <div className="flex-1 ml-0 md:ml h-screen overflow-y-auto px-4 md:px-10 py-10">
        <span className="text-3xl font-medium block mb-1">Vendor Details</span>
        <span className="text-base text-gray-500 block mb-8 pb-8">Provide your vendor details for verification and onboarding.</span>

        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-0">
          {renderField("Company name", "companyName")}
          {renderField("Primary contact name", "primaryContactName")}
          {renderField("Designation", "designation")}
          {renderField("Phone number", "phoneNumber")}
          {renderField("Email", "email", "email")}
          {renderField("Address", "address")}

          <div className="flex flex-col md:flex-row gap-4">
            {renderField("City", "city")}
            {renderField("State", "state")}
          </div>

          {renderField("Pin code", "pinCode")}
          {renderField("GSTIN/Registration number", "gstin")}

          <button
            type="submit"
            className="w-full md:w-1/2 bg-[#00c298] text-white py-3 rounded-lg text-lg font-semibold hover:bg-[#00aa89] transition-all"
          >
            Next
          </button>
        </form>
      </div>
    </div>
  );
}

export default Form1;
