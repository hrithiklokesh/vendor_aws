// import React, { useContext, useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { VendorContext } from '../context/VendorContext';
// import '../Styles/Form6.css';

// export default function Form6() {
//   const navigate = useNavigate();
//   const vendorContext = useContext(VendorContext);
//   const { vendorData, setVendorData } = vendorContext;

//   const [showSaveIndicator, setShowSaveIndicator] = useState(false);
//   const [formData, setFormData] = useState({
//     clientReferences: vendorData.additionalDetails.clientReferences || '',
//     specialInstructions: vendorData.additionalDetails.specialInstructions || '',
//     additionalDocument: vendorData.additionalDetails.additionalDocument || null,
//     acknowledgment: vendorData.additionalDetails.acknowledgment || false,
//   });

//   // Load saved data from localStorage on mount
//   useEffect(() => {
//     const savedData = localStorage.getItem("form6Data");
//     if (savedData) {
//       const parsedData = JSON.parse(savedData);
//       setFormData(parsedData);
//     }
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value, files, type, checked } = e.target;
//     if (files) {
//       setFormData(prev => ({ ...prev, [name]: files[0] }));
//     } else if (type === 'checkbox') {
//       setFormData(prev => ({ ...prev, [name]: checked }));
//     } else {
//       setFormData(prev => ({ ...prev, [name]: value }));
//     }
//   };
  
//   // Handle file deletion
//   const handleDeleteFile = (fieldName) => {
//     setFormData(prev => ({ ...prev, [fieldName]: null }));
//   };

//   const handlePrevious = () => {
//     navigate("/Form5");
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!formData.acknowledgment) {
//       alert('Please acknowledge the terms before submitting.');
//       return;
//     }

//     // Update context with final form data
//     setVendorData(prev => ({
//       ...prev,
//       additionalDetails: formData,
//     }));

//     // Get the current user's email from the context
//     const userEmail = vendorData.vendorDetails?.primaryContactEmail || 
//                      (vendorContext.currentUser ? vendorContext.currentUser.email : null);
    
//     if (!userEmail) {
//       alert('User email not found. Please ensure you are logged in and have filled out the vendor details form.');
//       return;
//     }

//     // Debug log before submission
//     console.log('Submitting form data:', {
//       userEmail,
//       vendorData: {
//         ...vendorData,
//         additionalDetails: formData
//       }
//     });

//     // Prepare form data for submission
//     const formDataToSend = new FormData();
    
//     // Add the user's email to ensure proper association
//     formDataToSend.append('email', userEmail);
    
//     // Create a copy of complianceCertifications without the file objects
//     // to avoid circular JSON structure
//     const complianceCertificationsForJson = { ...vendorData.complianceCertifications };
//     if (complianceCertificationsForJson.uploadDocument) {
//       complianceCertificationsForJson.uploadDocument = {
//         url: complianceCertificationsForJson.uploadDocument.url,
//         originalName: complianceCertificationsForJson.uploadDocument.originalName,
//         contentType: complianceCertificationsForJson.uploadDocument.contentType
//       };
//     }
//     if (complianceCertificationsForJson.isoCertificate) {
//       complianceCertificationsForJson.isoCertificate = {
//         url: complianceCertificationsForJson.isoCertificate.url,
//         originalName: complianceCertificationsForJson.isoCertificate.originalName,
//         contentType: complianceCertificationsForJson.isoCertificate.contentType
//       };
//     }
    
//     // Add all the form data
//     formDataToSend.append('vendorDetails', JSON.stringify({
//       ...vendorData.vendorDetails || {},
//       primaryContactEmail: userEmail // Ensure email is in vendorDetails too
//     }));
//     formDataToSend.append('companyDetails', JSON.stringify(vendorData.companyDetails || {}));
//     formDataToSend.append('serviceProductDetails', JSON.stringify(vendorData.serviceProductDetails || {}));
//     formDataToSend.append('bankDetails', JSON.stringify(vendorData.bankDetails || {}));
//     formDataToSend.append('complianceCertifications', JSON.stringify(complianceCertificationsForJson || {}));
//     formDataToSend.append('additionalDetails', JSON.stringify(formData || {}));
    
//     console.log("Form6 submission - complianceCertifications:", complianceCertificationsForJson);
    
//     // Append files if they exist
//     // For Form5 files, we don't need to re-upload them if they already have URLs
//     // The backend will use the URLs from the JSON data
//     if (vendorData.complianceCertifications.uploadDocument) {
//       if (vendorData.complianceCertifications.uploadDocument.file && 
//           !vendorData.complianceCertifications.uploadDocument.url) {
//         // Only upload if we have a file but no URL (not already uploaded)
//         console.log("Appending uploadDocument file to form data");
//         formDataToSend.append('uploadDocument', vendorData.complianceCertifications.uploadDocument.file);
//       } else if (vendorData.complianceCertifications.uploadDocument.url) {
//         console.log("Using existing uploadDocument URL:", 
//           vendorData.complianceCertifications.uploadDocument.url);
//       }
//     }
    
//     if (vendorData.complianceCertifications.isoCertificate) {
//       if (vendorData.complianceCertifications.isoCertificate.file && 
//           !vendorData.complianceCertifications.isoCertificate.url) {
//         // Only upload if we have a file but no URL (not already uploaded)
//         console.log("Appending isoCertificate file to form data");
//         formDataToSend.append('isoCertificate', vendorData.complianceCertifications.isoCertificate.file);
//       } else if (vendorData.complianceCertifications.isoCertificate.url) {
//         console.log("Using existing isoCertificate URL:", 
//           vendorData.complianceCertifications.isoCertificate.url);
//       }
//     }
    
//     // For Form6 file - this is always uploaded in the final submission
//     if (formData.additionalDocument) {
//       console.log("Appending additionalDocument file to form data");
//       formDataToSend.append('additionalDocument', formData.additionalDocument);
//     }

//     try {
//       const response = await fetch('http://localhost:5001/api/vendor/submit', {
//         method: 'POST',
//         body: formDataToSend,
//       });
      
//       const result = await response.json();
      
//       if (response.ok) {
//         console.log('Form submitted successfully', result);
//         // Clear form data from context after successful submission
//         setVendorData({
//           vendorDetails: {},
//           companyDetails: {},
//           serviceProductDetails: {},
//           bankDetails: {},
//           complianceCertifications: {},
//           additionalDetails: {},
//         });
//         navigate('/Auditorapprove');
//       } else {
//         console.error('Submission failed', result);
//         alert(`Submission failed: ${result.message}`);
//       }
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       alert('Error submitting form. Please try again.');
//     }
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
//         <div className="f6-section">
//           <div className="img" />
//           <span className="f1-text-4">Vendor Details</span>
//         </div>
//         <span className="f1-text-5">Please provide vendor details</span>
//         <div className="box">
//           <div className="img" />
//           <span className="f2-text-6">Company details</span>
//         </div>
//         <span className="f2-text-7">Please provide your company details</span>
//         <div className="section-2">
//           <div className="f3-img" />
//           <span className="f4-service-product-offered">Service/product offered</span>
//         </div>
//         <span className="f4-provide-details-service">
//           Please provide details about your service
//         </span>
//         <div className="flex-row-a">
//           <div className="img" />
//           <span className="form4-bank-details">Bank details</span>
//         </div>
//         <span className="form4-provide-bank-details">Please provide Bank details</span>
//         <div className="flex-row-ecd">
//           <div className="img" />
//           <span className="form5-compliance-certifications">
//             Compliance and certifications
//           </span>
//         </div>
//         <span className="form5-provide-certifications">
//           Please provide certifications
//         </span>
//         <div className="flex-row-ca">
//           <div className="img" />
//           <span className="form6-additional-details">Additional details</span>
//         </div>
//         <span className="form6-text-f">Please provide Additional details</span>
//       </div>

//       {/* Scrollable Right Section */}
//       <form onSubmit={handleSubmit} className="f6-form-section">
//         <span className="additional-details-6">Additional details</span>
//         <span className="certification-verification-onboarding">
//           Provide your certification for verification and onboarding.
//         </span>

//         {/* Client References */}
//         <span className="client-references">Client references</span>
//         <textarea
//           className="f6-rectangle-7"
//           name="clientReferences"
//           value={formData.clientReferences}
//           onChange={handleInputChange}
//         />
//         <div className="line" />

//         {/* Special Instruction or Notes */}
//         <span className="special-instruction-notes">Special instruction or notes</span>
//         <textarea
//           className="f6-rectangle-8"
//           name="specialInstructions"
//           value={formData.specialInstructions}
//           onChange={handleInputChange}
//         />
//         <div className="line-9" />

//         {/* Additional Document */}
//         <span className="addition-document">Addition document</span>
//         <div className="rectangle-a">
//           {formData.additionalDocument ? (
//             <div className="file-display">
//               <span className="file-name">{formData.additionalDocument.name}</span>
//               <button 
//                 className="delete-btn" 
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   handleDeleteFile("additionalDocument");
//                 }}
//               >
//                 Delete
//               </button>
//             </div>
//           ) : (
//             <>
//               <span className="attach-document">attach document</span>
//               <label className="upload-label">
//                 <span className="upload">upload</span>
//                 <input
//                   type="file"
//                   name="additionalDocument"
//                   onChange={handleInputChange}
//                   style={{ display: "none" }}
//                 />
//                 <div className="material-symbols-upload" />
//               </label>
//             </>
//           )}
//         </div>
//         <div className="line-c" />

//         {/* Acknowledgment */}
//         <span className="acknowledgment">Acknowledgment</span>
//         <label className="acknowledgment-label">
//           <input
//             type="checkbox"
//             className="rectangle-d"
//             name="acknowledgment"
//             checked={formData.acknowledgment}
//             onChange={handleInputChange}
//             required
//           />
//           <span className="undersigned-confirm-agree">
//             I, the undersigned, hereby confirm that the details provided are accurate and true to the best of my knowledge. I agree to abide by the policies and terms set by [Your Company Name].
//           </span>
//         </label>

//         <button type="submit" className="rectangle-e">
//           <span className="submit">Submit</span>
//         </button>
//         <div className="rectangle-f" onClick={handlePrevious}>
//           <span className="save">Previous</span>
//         </div>
//         <div className="f6-bottom-spacer" />
//       </form>
//     </div>
//   );
// }


import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { VendorContext } from '../context/VendorContext';
import Sidebar from './Sidebar';

export default function Form6() {
  const navigate = useNavigate();
  const vendorContext = useContext(VendorContext);
  const { vendorData, setVendorData } = vendorContext;

  const [formData, setFormData] = useState({
    clientReferences: vendorData.additionalDetails.clientReferences || '',
    specialInstructions: vendorData.additionalDetails.specialInstructions || '',
    additionalDocument: vendorData.additionalDetails.additionalDocument || null,
    acknowledgment: vendorData.additionalDetails.acknowledgment || false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem("form6Data");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setFormData(parsedData);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    if (files) {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleDeleteFile = (fieldName) => {
    setFormData(prev => ({ ...prev, [fieldName]: null }));
  };

  const handlePrevious = () => {
    navigate("/Form5");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.acknowledgment) {
      alert('Please acknowledge the terms before submitting.');
      return;
    }

    setIsSubmitting(true);
    setVendorData(prev => ({ ...prev, additionalDetails: formData }));

    const userEmail = vendorData.vendorDetails?.primaryContactEmail || (vendorContext.currentUser?.email);

    if (!userEmail) {
      alert('User email not found. Please ensure you are logged in and have filled out the vendor details form.');
      setIsSubmitting(false);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('email', userEmail);

    const complianceCertificationsForJson = { ...vendorData.complianceCertifications };
    if (complianceCertificationsForJson.uploadDocument) {
      complianceCertificationsForJson.uploadDocument = {
        url: complianceCertificationsForJson.uploadDocument.url,
        originalName: complianceCertificationsForJson.uploadDocument.originalName,
        contentType: complianceCertificationsForJson.uploadDocument.contentType
      };
    }
    if (complianceCertificationsForJson.isoCertificate) {
      complianceCertificationsForJson.isoCertificate = {
        url: complianceCertificationsForJson.isoCertificate.url,
        originalName: complianceCertificationsForJson.isoCertificate.originalName,
        contentType: complianceCertificationsForJson.isoCertificate.contentType
      };
    }

    formDataToSend.append('vendorDetails', JSON.stringify({ ...vendorData.vendorDetails, primaryContactEmail: userEmail }));
    formDataToSend.append('companyDetails', JSON.stringify(vendorData.companyDetails));
    formDataToSend.append('serviceProductDetails', JSON.stringify(vendorData.serviceProductDetails));
    formDataToSend.append('bankDetails', JSON.stringify(vendorData.bankDetails));
    formDataToSend.append('complianceCertifications', JSON.stringify(complianceCertificationsForJson));
    formDataToSend.append('additionalDetails', JSON.stringify(formData));

    if (formData.additionalDocument) {
      formDataToSend.append('additionalDocument', formData.additionalDocument);
    }

    try {
      const response = await fetch('http://localhost:5001/api/vendor/submit', {
        method: 'POST',
        body: formDataToSend,
      });

      const result = await response.json();

      if (response.ok) {
        setVendorData({
          vendorDetails: {},
          companyDetails: {},
          serviceProductDetails: {},
          bankDetails: {},
          complianceCertifications: {},
          additionalDetails: {},
        });
        navigate('/Auditorapprove');
      } else {
        alert(`Submission failed: ${result.message}`);
      }
    } catch (error) {
      alert('Error submitting form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex w-screen h-screen overflow-hidden bg-white">
      <Sidebar currentStep={5} />

      <form onSubmit={handleSubmit} className="flex-1 ml-0 md:ml-[] h-screen overflow-y-auto px-4 md:px-10 py-10 space-y-6 max-w-4xl">
        <h2 className="text-2xl font-medium">Additional details</h2>
        <p className="text-base text-gray-500 pb-4">Provide your certification for verification and onboarding.</p>

        <div>
          <label className="block text-lg font-medium mb-1">Client references</label>
          <textarea
            name="clientReferences"
            value={formData.clientReferences}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded px-4 py-2 text-lg resize-none"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-lg font-medium mb-1">Special instruction or notes</label>
          <textarea
            name="specialInstructions"
            value={formData.specialInstructions}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded px-4 py-2 text-lg resize-none"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-lg font-medium mb-1">Additional document</label>
          {formData.additionalDocument ? (
            <div>
              <div className="text-sm">{formData.additionalDocument.name}</div>
              <button
                type="button"
                onClick={() => handleDeleteFile("additionalDocument")}
                className="text-red-500 text-sm mt-1"
              >
                Delete
              </button>
            </div>
          ) : (
            <label className="cursor-pointer text-blue-600 hover:underline">
              Upload
              <input
                type="file"
                name="additionalDocument"
                onChange={handleInputChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        <div>
          <label className="flex items-start gap-2">
            <input
              type="checkbox"
              name="acknowledgment"
              checked={formData.acknowledgment}
              onChange={handleInputChange}
              required
              className="mt-1"
            />
            <span className="text-sm text-gray-700">
              I, the undersigned, hereby confirm that the details provided are accurate and true to the best of my knowledge. I agree to abide by the policies and terms set by [Your Company Name].
            </span>
          </label>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={handlePrevious}
            className="w-1/2 md:w-1/4 bg-gray-200 text-black py-3 rounded-lg text-lg font-semibold hover:bg-gray-300 transition-all"
            disabled={isSubmitting}
          >
            Previous
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-1/2 md:w-1/4 py-3 rounded-lg text-lg font-semibold transition-all ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#00c298] text-white hover:bg-[#00aa89]'}`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
}