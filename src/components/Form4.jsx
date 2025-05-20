// import React, { useState, useEffect, useContext } from "react";
// import { VendorContext } from "../context/VendorContext";
// import { UserContext } from "../context/UserContext";
// import { useNavigate } from "react-router-dom";
// import Sidebar from "./sidebar";

// export default function Form4() {
//   const navigate = useNavigate();
//   const { vendorData, setVendorData } = useContext(VendorContext);
//   const { currentUser } = useContext(UserContext) || {};
      
//   const [formData, setFormData] = useState({
//     bankName: vendorData.bankDetails.bankName || "",
//     accountName: vendorData.bankDetails.accountName || "",
//     accountNumber: vendorData.bankDetails.accountNumber || "",
//     ifscCode: vendorData.bankDetails.ifscCode || "",
//     branchAddress: vendorData.bankDetails.branchAddress || "",
//   });

//   // State to control the visibility of the "Save Changes" indicator
//   const [showSaveIndicator, setShowSaveIndicator] = useState(false);

//   // Load saved data from localStorage on mount
//   useEffect(() => {
//     if (currentUser) {
//       const savedData = localStorage.getItem(`form4Data_${currentUser.id}`);
//       if (savedData) {
//         const parsedData = JSON.parse(savedData);
//         setFormData(parsedData);
//         setVendorData(prev => ({
//           ...prev,
//           bankDetails: parsedData
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
//     navigate("/Form3");
//   };

//   const handleNext = () => {
//     if (currentUser) {
//       localStorage.setItem(`form4Data_${currentUser.id}`, JSON.stringify(formData));
//     }
//     setVendorData(prev => ({
//       ...prev,
//       bankDetails: {
//         bankName: formData.bankName,
//         accountName: formData.accountName,
//         accountNumber: formData.accountNumber,
//         ifscCode: formData.ifscCode,
//         branchAddress: formData.branchAddress,
//       }
//     }));
//     navigate("/Form5");
//   };

//   // New onSubmit handler for form validation
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const requiredFields = [
//       "bankName",
//       "accountName",
//       "accountNumber",
//       "ifscCode",
//       "branchAddress"
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

//       <Sidebar currentStep={0} />

//       {/* Form Section */}
//       <form onSubmit={handleSubmit}>
//         <span className="text-10">Bank details</span>
//         <span className="text-12">
//           Provide your bank details for verification and onboarding.
//         </span>

//         {/* Bank Name */}
//         <div className="box-2">
//           <input
//             type="text"
//             className="text-13"
//             placeholder="Bank Name"
//             required
//             name="bankName"
//             value={formData.bankName}
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
//         <span className="text-14">Bank name</span>
//         <div className="img-4" />

//         {/* Account Name */}
//         <div className="box-3">
//           <input
//             type="text"
//             className="text-15"
//             placeholder="Account Name"
//             required
//             name="accountName"
//             value={formData.accountName}
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
//         <span className="text-16">Account name</span>
//         <div className="pic-5" />

//         {/* Account Number */}
//         <div className="section-3">
//           <input
//             type="text"
//             className="text-17"
//             placeholder="Account Number"
//             required
//             name="accountNumber"
//             value={formData.accountNumber}
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
//         <span className="f4-text-18">Account number</span>
//         <div className="img-5" />

//         {/* IFSC Code */}
//         <div className="section-4">
//           <input
//             type="text"
//             className="text-19"
//             placeholder="IFSC Code"
//             required
//             name="ifscCode"
//             value={formData.ifscCode}
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
//         <span className="text-1a">IFSC Code</span>

//         {/* Branch Address */}
//         <div className="f4-rectangle">
//           <input
//             type="text"
//             className="branch-address"
//             placeholder="Branch Address"
//             required
//             name="branchAddress"
//             value={formData.branchAddress}
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
//               padding: "10px",
//               lineHeight: "38px",
//               resize: "none",
//               textAlign: "left",
//             }}
//           />
//         </div>
//         <span className="branch-address-1">Branch address</span>

//         {/* Buttons */}
//         <button type="submit" className="f4-rectangle-2">
//           <span className="next">Next</span>
//         </button>
//         <div className="f4-rectangle-3" onClick={handlePrevious}>
//           <span className="f4-save">Previous</span>
//         </div>
//       </form>
//     </div>
//   );
// }

import React, { useState, useEffect, useContext } from "react";
import { VendorContext } from "../context/VendorContext";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function Form4() {
  const navigate = useNavigate();
  const { vendorData, setVendorData } = useContext(VendorContext);
  const { currentUser } = useContext(UserContext) || {};

  const [formData, setFormData] = useState({
    bankName: vendorData.bankDetails.bankName || "",
    accountName: vendorData.bankDetails.accountName || "",
    accountNumber: vendorData.bankDetails.accountNumber || "",
    ifscCode: vendorData.bankDetails.ifscCode || "",
    branchAddress: vendorData.bankDetails.branchAddress || "",
  });

  useEffect(() => {
    if (currentUser) {
      const savedData = localStorage.getItem(`form4Data_${currentUser.id}`);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setFormData(parsedData);
        setVendorData(prev => ({
          ...prev,
          bankDetails: parsedData
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
    navigate("/Form3");
  };

  const handleNext = () => {
    if (currentUser) {
      localStorage.setItem(`form4Data_${currentUser.id}`, JSON.stringify(formData));
    }
    setVendorData(prev => ({
      ...prev,
      bankDetails: { ...formData }
    }));
    navigate("/Form5");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const requiredFields = ["bankName", "accountName", "accountNumber", "ifscCode", "branchAddress"];
    for (const field of requiredFields) {
      if (!formData[field] || formData[field].trim() === "") {
        alert("Please fill the field: " + field);
        return;
      }
    }
    handleNext();
  };

  const renderField = (label, name) => (
    <div className="flex flex-col md:flex-row items-start gap-4">
      <label className="w-full md:w-1/4 text-lg font-medium text-left">{label}</label>
      <input
        required
        type="text"
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
      <Sidebar currentStep={3} />

      <div className="flex-1 ml-0 md:ml-[] h-screen overflow-y-auto px-4 md:px-10 py-10">
        <span className="text-2xl font-medium block mb-1">Bank Details</span>
        <span className="text-base text-gray-500 block mb-8 pb-4">Provide your bank details for verification and onboarding.</span>

        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-0">
          {renderField("Bank Name", "bankName")}
          {renderField("Account Name", "accountName")}
          {renderField("Account Number", "accountNumber")}
          {renderField("IFSC Code", "ifscCode")}
          {renderField("Branch Address", "branchAddress")}

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
