// // import React, { useState, useEffect, useContext } from "react";
// // import { VendorContext } from "../context/VendorContext";
// // import { UserContext } from "../context/UserContext";
// // import { useNavigate } from "react-router-dom";
// // import { uploadFileToS3, deleteFileFromS3 } from "../utils/fileUpload";
// // import "../Styles/Form5.css";
// // import "../Styles/Form1.css";
// // import "../Styles/Form4.css";
// // import "../styles/Form2.css";

// // export default function Form5() {
// //   const navigate = useNavigate();
// //   const { vendorData, setVendorData } = useContext(VendorContext);
// //   const { currentUser } = useContext(UserContext) || {};

// //   const [formData, setFormData] = useState({
// //     hasCertifications: vendorData.complianceCertifications.hasCertifications || false,
// //     uploadDocument: vendorData.complianceCertifications.uploadDocument || null,
// //     isoCertificate: vendorData.complianceCertifications.isoCertificate || null,
// //     healthSafetyStandards: vendorData.complianceCertifications.healthSafetyStandards || "",
// //   });

// //   // State to control the visibility of the "Save Changes" indicator
// //   const [showSaveIndicator, setShowSaveIndicator] = useState(false);

// //   // Load saved data from localStorage on mount
// //   useEffect(() => {
// //     if (currentUser) {
// //       const savedData = localStorage.getItem(`form5Data_${currentUser.id}`);
// //       if (savedData) {
// //         const parsedData = JSON.parse(savedData);
// //         setFormData(parsedData);
// //         setVendorData(prev => ({
// //           ...prev,
// //           complianceCertifications: parsedData
// //         }));
// //       }
// //     }
// //   }, [currentUser]);

// //   // Handle input changes
// //   const handleInputChange = async (e) => {
// //     const { name, value, files } = e.target;
// //     if (name === "hasCertifications") {
// //       setFormData((prevData) => ({
// //         ...prevData,
// //         [name]: value === "yes",
// //       }));
// //     } else if (files) {
// //       // Store the file in local state first for UI feedback
// //       setFormData((prevData) => ({
// //         ...prevData,
// //         [name]: {
// //           file: files[0],
// //           name: files[0].name,
// //           uploading: true
// //         },
// //       }));
      
// //       try {
// //         // Only upload to S3 if we have the user's email
// //         if (currentUser && currentUser.email) {
// //           // Upload the file to S3
// //           const section = 'complianceCertifications';
// //           console.log('Uploading file to S3:', {
// //             fileName: files[0].name,
// //             email: currentUser.email,
// //             documentType: name,
// //             section: section
// //           });
// //           const response = await uploadFileToS3(files[0], currentUser.email, name, section);
          
// //           console.log('S3 upload response:', {
// //             success: response.success,
// //             message: response.message,
// //             url: response.data?.url,
// //             documentType: response.data?.documentType,
// //             section: response.data?.section
// //           });
          
// //           // Update the form data with the S3 URL
// //           setFormData((prevData) => ({
// //             ...prevData,
// //             [name]: {
// //               file: files[0],
// //               name: files[0].name,
// //               url: response.data.url,
// //               uploading: false
// //             },
// //           }));
          
// //           // Show save indicator
// //           setShowSaveIndicator(true);
// //           setTimeout(() => setShowSaveIndicator(false), 3000);
// //         }
// //       } catch (error) {
// //         console.error('Error uploading file:', error);
// //         console.error('Error details:', {
// //           message: error.message,
// //           stack: error.stack,
// //           name: error.name
// //         });
// //         // Revert to previous state if upload fails
// //         setFormData((prevData) => ({
// //           ...prevData,
// //           [name]: null,
// //         }));
// //         alert(`Failed to upload file: ${error.message}. Please try again.`);
// //       }
// //     } else {
// //       setFormData((prevData) => ({
// //         ...prevData,
// //         [name]: value,
// //       }));
// //     }
// //   };
  
// //   // Handle file deletion
// //   const handleDeleteFile = async (fieldName) => {
// //     try {
// //       // Only delete from S3 if we have the URL and user's email
// //       if (formData[fieldName]?.url && currentUser && currentUser.email) {
// //         await deleteFileFromS3(currentUser.email, fieldName, 'complianceCertifications');
// //       }
      
// //       // Update local state
// //       setFormData((prevData) => ({
// //         ...prevData,
// //         [fieldName]: null,
// //       }));
      
// //       // Show save indicator
// //       setShowSaveIndicator(true);
// //       setTimeout(() => setShowSaveIndicator(false), 3000);
// //     } catch (error) {
// //       console.error('Error deleting file:', error);
// //       alert('Failed to delete file. Please try again.');
// //     }
// //   };

// //   const handlePrevious = () => {
// //     navigate("/Form4");
// //   };

// //   const handleNext = () => {
// //     if (currentUser) {
// //       localStorage.setItem(`form5Data_${currentUser.id}`, JSON.stringify(formData));
// //     }
    
// //     // Ensure we're saving the S3 URLs to the vendor data
// //     // Also save the file objects for the backend to use
// //     setVendorData(prev => ({
// //       ...prev,
// //       complianceCertifications: {
// //         hasCertifications: formData.hasCertifications,
// //         uploadDocument: formData.uploadDocument ? {
// //           url: formData.uploadDocument.url,
// //           originalName: formData.uploadDocument.name,
// //           contentType: formData.uploadDocument.file?.type,
// //           // Keep the file object for the backend to use
// //           file: formData.uploadDocument.file
// //         } : null,
// //         isoCertificate: formData.isoCertificate ? {
// //           url: formData.isoCertificate.url,
// //           originalName: formData.isoCertificate.name,
// //           contentType: formData.isoCertificate.file?.type,
// //           // Keep the file object for the backend to use
// //           file: formData.isoCertificate.file
// //         } : null,
// //         healthSafetyStandards: formData.healthSafetyStandards,
// //       }
// //     }));
    
// //     console.log("Form5 data saved to context:", {
// //       uploadDocument: formData.uploadDocument ? {
// //         url: formData.uploadDocument.url,
// //         name: formData.uploadDocument.name,
// //         hasFile: !!formData.uploadDocument.file
// //       } : null,
// //       isoCertificate: formData.isoCertificate ? {
// //         url: formData.isoCertificate.url,
// //         name: formData.isoCertificate.name,
// //         hasFile: !!formData.isoCertificate.file
// //       } : null
// //     });
    
// //     navigate("/Form6");
// //   };

// //   // Form validation and submission handler
// //   const handleSubmit = (e) => {
// //     e.preventDefault();
// //     if (formData.hasCertifications === null || formData.hasCertifications === undefined) {
// //       alert("Please specify if you have certifications");
// //       return;
// //     }
    
// //     if (formData.hasCertifications) {
// //       // Check if document is uploaded and has a URL (meaning it's in S3)
// //       if (!formData.uploadDocument) {
// //         alert("Please upload the document");
// //         return;
// //       }
      
// //       if (formData.uploadDocument.uploading) {
// //         alert("Please wait for the document to finish uploading");
// //         return;
// //       }
      
// //       if (!formData.uploadDocument.url) {
// //         alert("Document upload failed. Please try again.");
// //         return;
// //       }
      
// //       // Check if ISO certificate is uploaded and has a URL
// //       if (!formData.isoCertificate) {
// //         alert("Please upload the ISO certificate");
// //         return;
// //       }
      
// //       if (formData.isoCertificate.uploading) {
// //         alert("Please wait for the ISO certificate to finish uploading");
// //         return;
// //       }
      
// //       if (!formData.isoCertificate.url) {
// //         alert("ISO certificate upload failed. Please try again.");
// //         return;
// //       }
// //     }
    
// //     if (!formData.healthSafetyStandards || formData.healthSafetyStandards.trim() === "") {
// //       alert("Please fill the health and safety standards");
// //       return;
// //     }
    
// //     handleNext();
// //   };

// //   return (
// //     <div className="main-container">
// //       {/* Save indicator */}
// //       {showSaveIndicator && (
// //         <div className="save-indicator" style={{
// //           position: 'fixed',
// //           top: '20px',
// //           right: '20px',
// //           background: '#4CAF50',
// //           color: 'white',
// //           padding: '10px 20px',
// //           borderRadius: '4px',
// //           zIndex: 1000,
// //           boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
// //         }}>
// //           Changes saved successfully!
// //         </div>
// //       )}
      
// //       {/* Inline CSS for placeholder centering and styling */}

// //       {/* Sidebar */}
// //       <div className="wrapper">
// //         <span className="f1-text">CG</span>
// //         <span className="f1-text-2">Complete your KYC</span>
// //         <span className="f1-text-3">
// //           Please complete your KYC verification by submitting the required
// //           documents to ensure seamless access to our services
// //         </span>
// //         <div className="form5-img" />
// //         <span className="form5-text-4">Vendor Details</span>
// //         <span className="form5-text-5">Please provide vendor details</span>
// //         <div className="box">
// //           <div className="img" />
// //           <span className="f2-text-6">Company details</span>
// //         </div>
// //         <span className="f2-text-7">Please provide your company details</span>
// //         <div className="section-2">
// //           <div className="f3-img" />
// //           <span className="f4-service-product-offered">Service/product offered</span>
// //         </div>
// //         <span className="f4-provide-details-service">
// //           Please provide details about your service
// //         </span>
// //         <div className="flex-row-a">
// //           <div className="img" />
// //           <span className="form4-bank-details">Bank details</span>
// //         </div>
// //         <span className="form4-provide-bank-details">Please provide Bank details</span>
// //         <div className="flex-row-ecd">
// //           <div className="img" />
// //           <span className="form5-compliance-certifications">
// //             Compliance and certifications
// //           </span>
// //         </div>
// //         <span className="form5-provide-certifications">Please provide certifications</span>
// //         <div className="flex-row-ca">
// //           <div className="check-fill-3" />
// //           <span className="f5-additional-details">Additional details</span>
// //         </div>
// //         <span className="f5-text-f">Please provide Additional details</span>
// //       </div>

// //       {/* Form Section */}
// //       <form onSubmit={handleSubmit}>
// //         <span className="CandC">Compliance and Certifications</span>
// //         <span className="f5-text-12">
// //           Provide your certification for verification and onboarding.
// //         </span>
// //         <span className="f5-text-13">Do you have necessary certifications/licenses?</span>

// //         {/* Yes/No Radio Buttons */}
// //         <div className="f5-radio-group">
// //           <label>
// //             <input
// //               type="radio"
// //               name="hasCertifications"
// //               value="yes"
// //               checked={formData.hasCertifications === true}
// //               onChange={handleInputChange}
// //             />
// //             Yes
// //           </label>
// //           <label>
// //             <input
// //               type="radio"
// //               name="hasCertifications"
// //               value="no"
// //               checked={formData.hasCertifications === false}
// //               onChange={handleInputChange}
// //             />
// //             No
// //           </label>
// //         </div>

// //         {/* Upload Document */}
// //         <div className="f5-section" onClick={() => !formData.uploadDocument && document.getElementById("uploadDocument").click()}>
// //           <div className="f5-box-5" />
// //           <input
// //             type="file"
// //             name="uploadDocument"
// //             onChange={handleInputChange}
// //             id="uploadDocument"
// //             style={{ display: "none" }}
// //           />
// //           {formData.uploadDocument ? (
// //             <div className="file-display">
// //               <span className="file-name">{formData.uploadDocument.name}</span>
// //               {formData.uploadDocument.uploading && <span className="upload-status">Uploading...</span>}
// //               {formData.uploadDocument.url && <span className="upload-status">Uploaded to S3</span>}
// //               <button 
// //                 className="delete-btn" 
// //                 onClick={(e) => {
// //                   e.stopPropagation();
// //                   handleDeleteFile("uploadDocument");
// //                 }}
// //                 disabled={formData.uploadDocument.uploading}
// //               >
// //                 Delete
// //               </button>
// //             </div>
// //           ) : (
// //             <>
// //               <span className="f5-text-16">Upload document</span>
// //               <span className="f5-text-17">upload</span>
// //               <div className="f5-img-7" />
// //             </>
// //           )}
// //         </div>
// //         <div className="f5-img-8" />

// //         {/* ISO Certificate */}
// //         <div className="f5-wrapper-4" onClick={() => !formData.isoCertificate && document.getElementById("isoCertificate").click()}>
// //           <div className="f5-section-2" />
// //           <input
// //             type="file"
// //             name="isoCertificate"
// //             onChange={handleInputChange}
// //             id="isoCertificate"
// //             style={{ display: "none" }}
// //           />
// //           {formData.isoCertificate ? (
// //             <div className="file-display">
// //               <span className="file-name">{formData.isoCertificate.name}</span>
// //               {formData.isoCertificate.uploading && <span className="upload-status">Uploading...</span>}
// //               {formData.isoCertificate.url && <span className="upload-status">Uploaded to S3</span>}
// //               <button 
// //                 className="delete-btn" 
// //                 onClick={(e) => {
// //                   e.stopPropagation();
// //                   handleDeleteFile("isoCertificate");
// //                 }}
// //                 disabled={formData.isoCertificate.uploading}
// //               >
// //                 Delete
// //               </button>
// //             </div>
// //           ) : (
// //             <>
// //               <span className="f5-text-18">upload</span>
// //               <span className="f5-text-19">ISO Certificate</span>
// //               <div className="f5-pic-4" />
// //             </>
// //           )}
// //         </div>
// //         <span className="f5-text-1a">ISO Certificate</span>
// //         <div className="f5-img-9" />

// //         {/* Health and Safety Standards */}
// //         <div className="f5-group">
// //           <textarea
// //             className="f5-text-1b"
// //             placeholder="Health and safety standards you take"
// //             name="healthSafetyStandards"
// //             value={formData.healthSafetyStandards}
// //             onChange={handleInputChange}
// //             style={{
// //               position: "relative",
// //               width: "100%",
// //               height: "100%",
// //               border: "none",
// //               background: "transparent",
// //               fontFamily: "Poppins, var(--default-font-family)",
// //               fontSize: "18px",
// //               fontWeight: "500",
// //               color: "#555555",
// //               opacity: "0.5",
// //               padding: "10px",
// //               lineHeight: "38px",
// //               resize: "none",
// //               textAlign: "left",
// //             }}
// //           />
// //         </div>
// //         <span className="f5-text-1c">Health and safety standards</span>

// //         {/* Buttons */}
// //         <button type="submit" className="f5-img-a">
// //           <span className="f5-text-1d">Next</span>
// //         </button>
// //         <div className="f5-wrapper-5" onClick={handlePrevious}>
// //           <span className="f5-text-1e">Previous</span>
// //         </div>
// //       </form>
// //     </div>
// //   );
// // }

// import React, { useState, useEffect, useContext } from "react";
// import { VendorContext } from "../context/VendorContext";
// import { UserContext } from "../context/UserContext";
// import { useNavigate } from "react-router-dom";
// import { uploadFileToS3, deleteFileFromS3 } from "../utils/fileUpload";

// export default function Form5() {
//   const navigate = useNavigate();
//   const { vendorData, setVendorData } = useContext(VendorContext);
//   const { currentUser } = useContext(UserContext) || {};

//   const [formData, setFormData] = useState({
//     hasCertifications: vendorData.complianceCertifications.hasCertifications || false,
//     uploadDocument: vendorData.complianceCertifications.uploadDocument || null,
//     isoCertificate: vendorData.complianceCertifications.isoCertificate || null,
//     healthSafetyStandards: vendorData.complianceCertifications.healthSafetyStandards || "",
//   });

//   const [showSaveIndicator, setShowSaveIndicator] = useState(false);

//   useEffect(() => {
//     if (currentUser) {
//       const savedData = localStorage.getItem(`form5Data_${currentUser.id}`);
//       if (savedData) {
//         const parsedData = JSON.parse(savedData);
//         setFormData(parsedData);
//         setVendorData(prev => ({
//           ...prev,
//           complianceCertifications: parsedData
//         }));
//       }
//     }
//   }, [currentUser]);

//   const handleInputChange = async (e) => {
//     const { name, value, files } = e.target;
//     if (name === "hasCertifications") {
//       setFormData((prevData) => ({
//         ...prevData,
//         [name]: value === "yes",
//       }));
//     } else if (files) {
//       setFormData((prevData) => ({
//         ...prevData,
//         [name]: {
//           file: files[0],
//           name: files[0].name,
//           uploading: true
//         },
//       }));
//       try {
//         if (currentUser && currentUser.email) {
//           const section = 'complianceCertifications';
//           const response = await uploadFileToS3(files[0], currentUser.email, name, section);
//           setFormData((prevData) => ({
//             ...prevData,
//             [name]: {
//               file: files[0],
//               name: files[0].name,
//               url: response.data.url,
//               uploading: false
//             },
//           }));
//           setShowSaveIndicator(true);
//           setTimeout(() => setShowSaveIndicator(false), 3000);
//         }
//       } catch (error) {
//         console.error('Error uploading file:', error);
//         setFormData((prevData) => ({
//           ...prevData,
//           [name]: null,
//         }));
//         alert(`Failed to upload file: ${error.message}. Please try again.`);
//       }
//     } else {
//       setFormData((prevData) => ({
//         ...prevData,
//         [name]: value,
//       }));
//     }
//   };

//   const handleDeleteFile = async (fieldName) => {
//     try {
//       if (formData[fieldName]?.url && currentUser && currentUser.email) {
//         await deleteFileFromS3(currentUser.email, fieldName, 'complianceCertifications');
//       }
//       setFormData((prevData) => ({
//         ...prevData,
//         [fieldName]: null,
//       }));
//       setShowSaveIndicator(true);
//       setTimeout(() => setShowSaveIndicator(false), 3000);
//     } catch (error) {
//       console.error('Error deleting file:', error);
//       alert('Failed to delete file. Please try again.');
//     }
//   };

//   const handlePrevious = () => navigate("/Form4");

//   const handleNext = () => {
//     if (currentUser) {
//       localStorage.setItem(`form5Data_${currentUser.id}`, JSON.stringify(formData));
//     }
//     setVendorData(prev => ({
//       ...prev,
//       complianceCertifications: {
//         hasCertifications: formData.hasCertifications,
//         uploadDocument: formData.uploadDocument ? {
//           url: formData.uploadDocument.url,
//           originalName: formData.uploadDocument.name,
//           contentType: formData.uploadDocument.file?.type,
//           file: formData.uploadDocument.file
//         } : null,
//         isoCertificate: formData.isoCertificate ? {
//           url: formData.isoCertificate.url,
//           originalName: formData.isoCertificate.name,
//           contentType: formData.isoCertificate.file?.type,
//           file: formData.isoCertificate.file
//         } : null,
//         healthSafetyStandards: formData.healthSafetyStandards,
//       }
//     }));
//     navigate("/Form6");
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (formData.hasCertifications === null || formData.hasCertifications === undefined) {
//       return alert("Please specify if you have certifications");
//     }
//     if (formData.hasCertifications) {
//       if (!formData.uploadDocument?.url) return alert("Please upload the document");
//       if (!formData.isoCertificate?.url) return alert("Please upload the ISO certificate");
//     }
//     if (!formData.healthSafetyStandards.trim()) {
//       return alert("Please fill the health and safety standards");
//     }
//     handleNext();
//   };

//   return (
//     <div className="relative w-screen min-h-screen bg-white">
//       {showSaveIndicator && (
//         <div className="fixed top-5 right-5 bg-green-600 text-white py-2 px-4 rounded shadow-md z-50">
//           Changes saved successfully!
//         </div>
//       )}

//       {/* LEFT SIDEBAR - Only visible on md and up */}
//       <div className="hidden md:block fixed top-0 left-0 h-screen w-[339px] bg-[#f6fffd] p-6 overflow-y-auto">
//         <div className="text-3xl font-bold text-[#105a4a] mb-1">CG</div>
//         <div className="text-lg font-medium text-black mb-1">Complete your KYC</div>
//         <p className="text-sm font-light text-black opacity-50 mb-6">
//           Please complete your KYC verification by submitting the required documents to ensure seamless access to our services.
//         </p>

//         <div className="flex items-center gap-3 mb-4">
//           <div className="w-6 h-6 bg-[url('https://static.codia.ai/custom_image/2025-03-28/082932/check-icon.svg')] bg-cover" />
//           <div>
//             <p className="text-base font-medium">Vendor Details</p>
//             <p className="text-sm text-black opacity-70">Please provide vendor details</p>
//           </div>
//         </div>

//         <div className="flex items-center gap-3 mb-4">
//           <div className="w-6 h-6 bg-[url('https://static.codia.ai/custom_image/2025-03-28/082932/business-info-icon.svg')] bg-cover" />
//           <div>
//             <p className="text-base font-medium">Company Details</p>
//             <p className="text-sm text-black opacity-70">Please provide your company details</p>
//           </div>
//         </div>

//         <div className="flex items-center gap-3 mb-4">
//           <div className="w-6 h-6 bg-[url('https://static.codia.ai/custom_image/2025-03-28/082932/service-product-icon.svg')] bg-cover" />
//           <div>
//             <p className="text-base font-medium">Service/product offered</p>
//             <p className="text-sm text-black opacity-70">Please provide details about your service</p>
//           </div>
//         </div>

//         <div className="flex items-center gap-3 mb-4">
//           <div className="w-6 h-6 bg-[url('https://static.codia.ai/custom_image/2025-03-28/082932/bank-details-icon.svg')] bg-cover" />
//           <div>
//             <p className="text-base font-medium">Bank Details</p>
//             <p className="text-sm text-black opacity-70">Please provide bank details</p>
//           </div>
//         </div>

//         <div className="flex items-center gap-3 mb-4">
//           <div className="w-6 h-6 bg-[url('https://static.codia.ai/custom_image/2025-03-28/082932/compliance-icon.svg')] bg-cover" />
//           <div>
//             <p className="text-base font-medium">Compliance and Certifications</p>
//             <p className="text-sm text-black opacity-70">Please provide certifications</p>
//           </div>
//         </div>

//         <div className="flex items-center gap-3">
//           <div className="w-6 h-6 bg-[url('https://static.codia.ai/custom_image/2025-03-28/082932/additional-details-icon.svg')] bg-cover" />
//           <div>
//             <p className="text-base font-medium opacity-50">Additional Details</p>
//             <p className="text-sm text-black opacity-50">Please provide additional details</p>
//           </div>
//         </div>
//       </div>

//       {/* FORM SECTION */}
//       <form
//         className="md:ml-[339px] w-full md:w-[calc(100%-391px)] p-6 md:p-10"
//         onSubmit={handleSubmit}
//       >
//         <h2 className="text-[32px] font-medium mb-2">Compliance and Certifications</h2>
//         <p className="text-base text-black/50 mb-6">
//           Provide your certification for verification and onboarding.
//         </p>
//         <p className="text-xl font-medium mb-2">
//           Do you have necessary certifications/licenses?
//         </p>

//         <div className="flex space-x-4 mb-6">
//           <label className="flex items-center gap-2">
//             <input type="radio" name="hasCertifications" value="yes" checked={formData.hasCertifications === true} onChange={handleInputChange} /> Yes
//           </label>
//           <label className="flex items-center gap-2">
//             <input type="radio" name="hasCertifications" value="no" checked={formData.hasCertifications === false} onChange={handleInputChange} /> No
//           </label>
//         </div>

//         <div
//           className="relative border rounded-lg p-4 mb-6 w-full max-w-xl cursor-pointer"
//           onClick={() => !formData.uploadDocument && document.getElementById("uploadDocument").click()}
//         >
//           <input type="file" id="uploadDocument" name="uploadDocument" onChange={handleInputChange} className="hidden" />
//           {formData.uploadDocument ? (
//             <div className="flex justify-between items-center">
//               <span className="truncate max-w-[70%] text-sm font-medium text-[#105a4a]">
//                 {formData.uploadDocument.name}
//               </span>
//               <div className="flex gap-2 items-center">
//                 {formData.uploadDocument.uploading && <span className="text-sm">Uploading...</span>}
//                 {formData.uploadDocument.url && <span className="text-sm text-green-600">Uploaded</span>}
//                 <button
//                   className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 rounded"
//                   onClick={(e) => { e.stopPropagation(); handleDeleteFile("uploadDocument"); }}
//                   disabled={formData.uploadDocument.uploading}
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           ) : (
//             <span className="text-gray-500">Click to upload document</span>
//           )}
//         </div>

//         <div
//           className="relative border rounded-lg p-4 mb-6 w-full max-w-xl cursor-pointer"
//           onClick={() => !formData.isoCertificate && document.getElementById("isoCertificate").click()}
//         >
//           <input type="file" id="isoCertificate" name="isoCertificate" onChange={handleInputChange} className="hidden" />
//           {formData.isoCertificate ? (
//             <div className="flex justify-between items-center">
//               <span className="truncate max-w-[70%] text-sm font-medium text-[#105a4a]">
//                 {formData.isoCertificate.name}
//               </span>
//               <div className="flex gap-2 items-center">
//                 {formData.isoCertificate.uploading && <span className="text-sm">Uploading...</span>}
//                 {formData.isoCertificate.url && <span className="text-sm text-green-600">Uploaded</span>}
//                 <button
//                   className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 rounded"
//                   onClick={(e) => { e.stopPropagation(); handleDeleteFile("isoCertificate"); }}
//                   disabled={formData.isoCertificate.uploading}
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           ) : (
//             <span className="text-gray-500">Click to upload ISO Certificate</span>
//           )}
//         </div>

//         <label htmlFor="healthSafetyStandards" className="block text-lg font-medium mb-2">Health and safety standards</label>
//         <textarea
//           id="healthSafetyStandards"
//           name="healthSafetyStandards"
//           value={formData.healthSafetyStandards}
//           onChange={handleInputChange}
//           placeholder="Health and safety standards you take"
//           className="w-full max-w-xl p-3 border rounded-lg text-gray-600 text-base focus:outline-none focus:ring focus:ring-green-300"
//           rows={5}
//         />

//         <div className="flex flex-wrap gap-4 mt-8">
//           <button
//             type="button"
//             onClick={handlePrevious}
//             className="border border-[#00c298] text-[#21be9c] px-6 py-3 rounded-xl text-lg font-medium"
//           >
//             Previous
//           </button>
//           <button
//             type="submit"
//             className="bg-[#21be9c] text-white px-6 py-3 rounded-xl text-lg font-medium"
//           >
//             Next
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

import React, { useState, useEffect, useContext } from "react";
import { VendorContext } from "../context/VendorContext";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { uploadFileToS3, deleteFileFromS3 } from "../utils/fileUpload";
import Sidebar from "./Sidebar";

export default function Form5() {
  const navigate = useNavigate();
  const { vendorData, setVendorData } = useContext(VendorContext);
  const { currentUser } = useContext(UserContext) || {};

  const [formData, setFormData] = useState({
    hasCertifications: vendorData.complianceCertifications.hasCertifications || false,
    uploadDocument: vendorData.complianceCertifications.uploadDocument || null,
    isoCertificate: vendorData.complianceCertifications.isoCertificate || null,
    healthSafetyStandards: vendorData.complianceCertifications.healthSafetyStandards || "",
  });

  const [showSaveIndicator, setShowSaveIndicator] = useState(false);

  useEffect(() => {
    if (currentUser) {
      const savedData = localStorage.getItem(`form5Data_${currentUser.id}`);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setFormData(parsedData);
        setVendorData(prev => ({
          ...prev,
          complianceCertifications: parsedData
        }));
      }
    }
  }, [currentUser]);

  const handleInputChange = async (e) => {
    const { name, value, files } = e.target;
    if (name === "hasCertifications") {
      setFormData(prev => ({ ...prev, [name]: value === "yes" }));
    } else if (files) {
      const file = files[0];
      setFormData(prev => ({ ...prev, [name]: { file, name: file.name, uploading: true } }));

      try {
        if (currentUser?.email) {
          const section = "complianceCertifications";
          const response = await uploadFileToS3(file, currentUser.email, name, section);

          setFormData(prev => ({
            ...prev,
            [name]: {
              file,
              name: file.name,
              url: response.data.url,
              uploading: false
            },
          }));

          setShowSaveIndicator(true);
          setTimeout(() => setShowSaveIndicator(false), 3000);
        }
      } catch (error) {
        console.error("Error uploading file:", error);
        setFormData(prev => ({ ...prev, [name]: null }));
        alert(`Failed to upload file: ${error.message}. Please try again.`);
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleDeleteFile = async (fieldName) => {
    try {
      if (formData[fieldName]?.url && currentUser?.email) {
        await deleteFileFromS3(currentUser.email, fieldName, "complianceCertifications");
      }
      setFormData(prev => ({ ...prev, [fieldName]: null }));
      setShowSaveIndicator(true);
      setTimeout(() => setShowSaveIndicator(false), 3000);
    } catch (error) {
      console.error("Error deleting file:", error);
      alert("Failed to delete file. Please try again.");
    }
  };

  const handlePrevious = () => navigate("/Form4");

  const handleNext = () => {
    if (currentUser) {
      localStorage.setItem(`form5Data_${currentUser.id}`, JSON.stringify(formData));
    }
    setVendorData(prev => ({
      ...prev,
      complianceCertifications: {
        hasCertifications: formData.hasCertifications,
        uploadDocument: formData.uploadDocument ? {
          url: formData.uploadDocument.url,
          originalName: formData.uploadDocument.name,
          contentType: formData.uploadDocument.file?.type,
          file: formData.uploadDocument.file
        } : null,
        isoCertificate: formData.isoCertificate ? {
          url: formData.isoCertificate.url,
          originalName: formData.isoCertificate.name,
          contentType: formData.isoCertificate.file?.type,
          file: formData.isoCertificate.file
        } : null,
        healthSafetyStandards: formData.healthSafetyStandards,
      }
    }));
    navigate("/Form6");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.hasCertifications == null) {
      alert("Please specify if you have certifications");
      return;
    }
    if (formData.hasCertifications) {
      if (!formData.uploadDocument?.url) return alert("Please upload the document");
      if (!formData.isoCertificate?.url) return alert("Please upload the ISO certificate");
    }
    if (!formData.healthSafetyStandards.trim()) {
      alert("Please fill the health and safety standards");
      return;
    }
    handleNext();
  };

  return (
    <div className="flex w-screen h-screen overflow-hidden bg-white">
      {showSaveIndicator && (
        <div className="fixed top-5 right-5 bg-green-600 text-white py-2 px-4 rounded shadow z-50">
          Changes saved successfully!
        </div>
      )}

      <Sidebar currentStep={4} />

      <div className="flex-1 ml-0 md:ml-[] h-screen overflow-y-auto px-4 md:px-10 py-10">
        <h2 className="text-2xl font-medium mb-1">Compliance and Certifications</h2>
        <p className="text-base text-gray-500 mb-6">Provide your certification for verification and onboarding.</p>

        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
          <div className="text-lg font-medium">Do you have necessary certifications/licenses?</div>
          <div className="flex gap-8">
            <label className="flex items-center gap-2">
              <input type="radio" name="hasCertifications" value="yes" checked={formData.hasCertifications === true} onChange={handleInputChange} />
              Yes
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="hasCertifications" value="no" checked={formData.hasCertifications === false} onChange={handleInputChange} />
              No
            </label>
          </div>

          {/* Upload Document */}
          <div onClick={() => !formData.uploadDocument && document.getElementById("uploadDocument").click()} className="cursor-pointer border rounded p-4">
            <input type="file" name="uploadDocument" id="uploadDocument" onChange={handleInputChange} style={{ display: "none" }} />
            {formData.uploadDocument ? (
              <div>
                <div className="text-sm">{formData.uploadDocument.name}</div>
                <div className="text-xs text-green-600">{formData.uploadDocument.uploading ? "Uploading..." : "Uploaded to S3"}</div>
                <button type="button" onClick={(e) => { e.stopPropagation(); handleDeleteFile("uploadDocument"); }} className="text-red-500 text-sm mt-1">Delete</button>
              </div>
            ) : (
              <div className="text-sm text-gray-500">Click to upload document</div>
            )}
          </div>

          {/* ISO Certificate */}
          <div onClick={() => !formData.isoCertificate && document.getElementById("isoCertificate").click()} className="cursor-pointer border rounded p-4">
            <input type="file" name="isoCertificate" id="isoCertificate" onChange={handleInputChange} style={{ display: "none" }} />
            {formData.isoCertificate ? (
              <div>
                <div className="text-sm">{formData.isoCertificate.name}</div>
                <div className="text-xs text-green-600">{formData.isoCertificate.uploading ? "Uploading..." : "Uploaded to S3"}</div>
                <button type="button" onClick={(e) => { e.stopPropagation(); handleDeleteFile("isoCertificate"); }} className="text-red-500 text-sm mt-1">Delete</button>
              </div>
            ) : (
              <div className="text-sm text-gray-500">Click to upload ISO Certificate</div>
            )}
          </div>

          {/* Health and Safety Standards */}
          <div>
            <label className="block text-lg font-medium mb-1">Health and Safety Standards</label>
            <textarea
              required
              name="healthSafetyStandards"
              value={formData.healthSafetyStandards}
              onChange={handleInputChange}
              placeholder="Health and safety standards you take"
              className="w-full border border-gray-300 rounded px-4 py-2 text-lg resize-none"
              rows={4}
            />
          </div>

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