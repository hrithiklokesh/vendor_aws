import { Link } from 'react-router-dom';
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

import {
    Mail, Award, Share2, MapPin, Phone, ChevronDown, Eye, Download, Settings, Edit,
    X as CloseIcon // Use X as CloseIcon for modal close
} from "lucide-react";
import { TrashIcon } from '@heroicons/react/24/outline';
import { UserContext } from "../../context/UserContext";
import { VendorContext } from "../../context/VendorContext";
import profilePlaceholder from '../../assets/profileplaceholder.jpg'
import AppHeader from "../../components/AppHeader/Appheader";
import UserProfileCard from '../../components/UserProfileCard/UserProfileCard'; // Import the new component

const BuildingIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 22V2a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v20"></path>
        <path d="M2 22h20"></path>
        <path d="M12 13H6.5"></path>
        <path d="M12 18H6.5"></path>
        <path d="M12 8H6.5"></path>
        <path d="M17.5 8H22"></path>
        <path d="M17.5 13H22"></path>
        <path d="M17.5 18H22"></path>
    </svg>
);

const initialProjectsData = [
    {
        id: 'proj1',
        title: 'Orange labs',
        description: 'We help organizations partnering with Orange Labs to drive innovation and develop cutting-edge solutions in telecommunications and digital.',
        client: 'ZenCorp Technologies, USA',
        duration: 'Jan 2023 - Aug 2023',
        category: 'Healthcare',
        team: 'global team of researchers, engineers',
        objective: 'The objective of Orange Labs is to drive innovation and develop cutting-edge technologies that shape the future of telecommunications and digital services.',
        features: 'Orange Labs focuses on cutting-edge research in AI, 5G/6G, IoT, cloud computing, cybersecurity, and data privacy. It maintains a rich patent portfolio, and a commitment to user-centric and sustainable innovation.',
        impact: 'Orange Labs impacts the tech world by advancing 5G/6G, enhancing cybersecurity, and delivering smart, sustainable digital innovations.',
        deliverables: 'Orange Labs delivers prototypes, patents, research insights, and innovative digital and telecom solutions.',
        compliance: 'Orange Labs ensures compliance with global data protection regulations, industry standards, and ethical research practices to maintain security, privacy, and trust.',
        documents: [{ name: 'Award_Certificate_Final.jpg', id: 'doc1', url: '#' }],
        isNew: true,
        date: new Date('2023-08-31'),
        initiallyExpanded: true
    },
    {
        id: 'proj2',
        title: 'Lenskart',
        description: 'Collaborating with Lenskart to develop more efficient solutions that enhance their digital experience and streamline end-to-end customer service.',
        client: 'Lenskart Eyewear Pvt. Ltd.',
        duration: 'Sep 2022 - Dec 2022',
        category: 'E-commerce / Retail',
        team: 'Cross-functional team (Dev, UX, QA)',
        objective: 'Improve online customer journey and checkout conversion rate.',
        features: 'Revamped product discovery, simplified checkout flow, integrated virtual try-on.',
        impact: 'Increased conversion rate by 15%, reduced cart abandonment.',
        deliverables: 'Updated website components, user flow documentation.',
        compliance: 'PCI DSS, Standard e-commerce regulations.',
        documents: [],
        isNew: false,
        date: new Date('2022-12-31'),
        initiallyExpanded: false
    },
    {
        id: 'proj3',
        title: 'Flying machine',
        description: 'Collaborating with Flying machine to deliver tailored solutions that enhance their brand presence, optimize retail operations, and elevate customer engagement.',
        client: 'Flying Machine (Arvind Fashions)',
        duration: 'May 2022 - Aug 2022',
        category: 'Fashion / Retail',
        team: 'Marketing tech team, Retail analysts',
        objective: 'Implement a new CRM system and loyalty program.',
        features: 'Customer segmentation, targeted promotions, omnichannel loyalty points.',
        impact: 'Improved customer retention by 10%, increased average order value.',
        deliverables: 'CRM platform integration, Loyalty program portal.',
        compliance: 'Data privacy regulations (India).',
        documents: [{ name: 'CaseStudy_FM.pdf', id: 'doc2', url: '#' }],
        isNew: false,
        date: new Date('2022-08-31'),
        initiallyExpanded: false
    }
];

const countryCodes = [
    { code: '+1', country: 'USA' },
    { code: '+44', country: 'UK' },
    { code: '+91', country: 'India' },
    { code: '+81', country: 'Japan' },
    // Add more country codes as needed
];

const countryStateData = {
    'USA': ['California', 'New York', 'Texas'],
    'UK': ['London', 'Manchester', 'Birmingham'],
    'India': ['Karnataka', 'Maharashtra', 'Delhi'],
    'Japan': ['Tokyo', 'Osaka', 'Kyoto'],
    // Add more countries and their states
};

export default function UserProjectPage() {
    const { currentUser } = useContext(UserContext);
    const { currentUser: vendorUser, vendorData, setVendorData } = useContext(VendorContext);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dataFetched, setDataFetched] = useState(false);
    
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [profileData, setProfileData] = useState({
        name: currentUser?.name || vendorUser?.name || 'Loading...',
        vendorId: '#Loading',
        image: profilePlaceholder,
        companyName: 'Loading...',
        phone: 'Loading...',
        location: 'Loading...',
        email: currentUser?.email || vendorUser?.email || 'Loading...',
    });
    const [profileFormData, setProfileFormData] = useState({ ...profileData });
    const [imagePreview, setImagePreview] = useState(profileData.image);
    const [projects, setProjects] = useState([]); // Initialize with empty array
    const [sortOrder, setSortOrder] = useState('recent');
    const [expandedProjects, setExpandedProjects] = useState({});
    const [projectsLoading, setProjectsLoading] = useState(true);
    const [projectsError, setProjectsError] = useState(null);

    // New state for project editing
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [projectFormData, setProjectFormData] = useState({});

    const [selectedCountry, setSelectedCountry] = useState('');
    const [states, setStates] = useState([]);
    const [selectedState, setSelectedState] = useState('');
    const [phoneCountryCode, setPhoneCountryCode] = useState('');
    const [phoneNumberWithoutCode, setPhoneNumberWithoutCode] = useState('');

    // First useEffect just to log context values
    useEffect(() => {
        console.log("UserProjectPage - Current User Context:", currentUser);
        console.log("UserProjectPage - Vendor User Context:", vendorUser);
    }, [currentUser, vendorUser]);

    // Check if we need to recover user data from localStorage
    useEffect(() => {
        if (!currentUser?.email && !vendorUser?.email) {
            console.log("UserProjectPage - No user email in context, attempting to recover from localStorage");
            try {
                const savedUser = localStorage.getItem('currentUser');
                if (savedUser) {
                    const parsedUser = JSON.parse(savedUser);
                    console.log("UserProjectPage - Recovered user from localStorage:", parsedUser);
                    if (parsedUser?.email) {
                        // Update profile data with recovered email
                        setProfileData(prev => ({
                            ...prev,
                            email: parsedUser.email,
                            name: parsedUser.name || prev.name
                        }));
                    }
                }
            } catch (error) {
                console.error("UserProjectPage - Error recovering user from localStorage:", error);
            }
        }
    }, [currentUser, vendorUser]);

    // Fetch vendor data from backend with a delay to ensure context is properly initialized
    useEffect(() => {
        // Skip if we've already fetched data
        if (dataFetched) {
            return;
        }
        
        // Define the fetch function
        const fetchVendorData = async () => {
            try {
                setLoading(true);
                
                // Use email from either context or profile data
                const emailToUse = currentUser?.email || vendorUser?.email || profileData.email;
                
                console.log("UserProjectPage - Attempting to fetch vendor data using email:", emailToUse);
                
                if (!emailToUse || emailToUse === 'Loading...') {
                    console.log("UserProjectPage - No valid email found, displaying error");
                    setError("No user email found. Please log in again.");
                    setLoading(false);
                    return;
                }
                
                const response = await fetch(`http://localhost:5001/api/vendor/vendors?email=${encodeURIComponent(emailToUse)}`);
                
                if (!response.ok) {
                    throw new Error(`Server responded with status: ${response.status}`);
                }
                
                const data = await response.json();
                console.log("Vendor data response:", data);
                
                if (data.success && data.data && data.data.length > 0) {
                    const vendor = data.data[0];
                    
                    // Prepare profile data first
                    const newProfileData = {
                        name: vendor.vendorDetails?.primaryContactName || currentUser?.name || vendorUser?.name || '',
                        vendorId: `#${vendor._id.substring(0, 6)}` || '#CXV001',
                        image: profilePlaceholder, // Use placeholder for now
                        companyName: vendor.companyDetails?.companyName || vendor.vendorDetails?.companyName || '',
                        phone: vendor.vendorDetails?.primaryContactPhone || '',
                        location: `${vendor.companyDetails?.state || ''}, ${vendor.companyDetails?.country || ''}`,
                        email: vendor.vendorDetails?.primaryContactEmail || emailToUse || '',
                    };
                    
                    // Set profile data immediately
                    setProfileData(newProfileData);
                    
                    // Update the vendor data in context
                    setVendorData({
                        vendorDetails: vendor.vendorDetails || {},
                        companyDetails: vendor.companyDetails || {},
                        serviceProductDetails: vendor.serviceProductDetails || {},
                        bankDetails: vendor.bankDetails || {},
                        complianceCertifications: vendor.complianceCertifications || {},
                        additionalDetails: vendor.additionalDetails || {}
                    });
                    
                    setDataFetched(true);
                } else {
                    setError("No vendor data found");
                }
                
                setLoading(false);
            } catch (error) {
                console.error('Error fetching vendor data:', error);
                setError("Failed to fetch vendor data");
                setLoading(false);
            }
        };
        
        // Add a small delay to ensure context is properly initialized
        const timer = setTimeout(() => {
            console.log("UserProjectPage - Executing delayed data fetch");
            fetchVendorData();
        }, 500);
        
        return () => clearTimeout(timer);
    }, [currentUser, vendorUser, profileData.email, dataFetched, setVendorData]);

    // Initialize profile form data when modal opens
    useEffect(() => {
        if (isProfileModalOpen) {
            setProfileFormData({ ...profileData });
            setImagePreview(profileData.image);
            
            // Parse location and phone
            const [state, country] = (profileData.location || ',').split(', ');
            setSelectedCountry(country || '');
            setSelectedState(state || '');
            setStates(countryStateData[country] || []);
            
            const [code, ...numberParts] = (profileData.phone || '').split(' ');
            setPhoneCountryCode(code || '');
            setPhoneNumberWithoutCode(numberParts.join(' ') || '');
        }
    }, [isProfileModalOpen, profileData]);

    useEffect(() => {
        const isObjectURL = typeof imagePreview === 'string' && imagePreview.startsWith('blob:');
        return () => {
            if (isObjectURL) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    // Fetch projects from backend with delay to ensure user context is available
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setProjectsLoading(true);
                
                // Use email from either context or profile data
                const emailToUse = currentUser?.email || vendorUser?.email || profileData.email;
                
                console.log("UserProjectPage - Attempting to fetch projects using email:", emailToUse);
                
                if (!emailToUse || emailToUse === 'Loading...') {
                    console.log("UserProjectPage - No valid email found for projects, displaying error");
                    setProjectsError("No user email found. Please log in again.");
                    setProjectsLoading(false);
                    return;
                }
                
                const response = await fetch(`http://localhost:5001/api/vendor/projects?email=${encodeURIComponent(emailToUse)}`);
                
                if (!response.ok) {
                    throw new Error(`Server responded with status: ${response.status}`);
                }
                
                const data = await response.json();
                console.log("Projects data response:", data);
                
                if (data.success && data.data) {
                    // Initialize expandedProjects based on initiallyExpanded flag
                    const initialExpandedState = {};
                    data.data.forEach(project => {
                        initialExpandedState[project.id] = project.initiallyExpanded || false;
                    });
                    setExpandedProjects(initialExpandedState);
                    
                    // Set the projects data
                    setProjects(data.data);
                } else {
                    // If no projects found, use dummy data for now
                    setProjects(initialProjectsData);
                    
                    // Initialize expandedProjects for dummy data
                    const initialExpandedState = {};
                    initialProjectsData.forEach(project => {
                        initialExpandedState[project.id] = project.initiallyExpanded || false;
                    });
                    setExpandedProjects(initialExpandedState);
                }
                
                setProjectsLoading(false);
            } catch (error) {
                console.error('Error fetching projects:', error);
                setProjectsError("Failed to fetch projects. Using sample data.");
                
                // Fallback to dummy data on error
                setProjects(initialProjectsData);
                
                // Initialize expandedProjects for dummy data
                const initialExpandedState = {};
                initialProjectsData.forEach(project => {
                    initialExpandedState[project.id] = project.initiallyExpanded || false;
                });
                setExpandedProjects(initialExpandedState);
                
                setProjectsLoading(false);
            }
        };
        
        // Add a small delay to ensure user context is properly initialized
        const timer = setTimeout(() => {
            console.log("UserProjectPage - Executing delayed projects fetch");
            fetchProjects();
        }, 600); // Slightly longer delay than vendor data fetch
        
        return () => clearTimeout(timer);
    }, [currentUser, vendorUser, profileData.email]);

    const handleProfileEditClick = () => {
        setIsProfileModalOpen(true);
    };

    const handleProfileCloseModal = () => {
        setIsProfileModalOpen(false);
    };

    const handleProfileInputChange = (e) => {
        const { name, value } = e.target;
        setProfileFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleProfileFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            if (typeof imagePreview === 'string' && imagePreview.startsWith('blob:')) {
                URL.revokeObjectURL(imagePreview);
            }
            setImagePreview(previewUrl);
            setProfileFormData((prevData) => ({ ...prevData, imageFile: file, image: previewUrl }));
        }
    };

    const handleProfileSave = async () => {
        try {
            // Construct the updated location and phone
            if (!selectedState || !selectedCountry) {
                alert("Please select both state and country");
                return;
            }
            
            const updatedLocation = `${selectedState}, ${selectedCountry}`;
            const updatedPhone = `${phoneCountryCode} ${phoneNumberWithoutCode}`;
            
            // Create a new object with the updated data
            const dataToSave = { 
                ...profileFormData, 
                location: updatedLocation, 
                phone: updatedPhone 
            };
            
            // Remove the imageFile property if it exists
            if (dataToSave.imageFile) {
                delete dataToSave.imageFile;
            }
            
            // Update local state first for immediate UI feedback
            setProfileData(dataToSave);
            
            // Prepare data for backend
            const vendorUpdateData = {
                vendorDetails: {
                    ...vendorData.vendorDetails,
                    primaryContactName: dataToSave.name,
                    primaryContactPhone: updatedPhone,
                    primaryContactEmail: dataToSave.email,
                    companyName: dataToSave.companyName,
                    location: updatedLocation
                },
                companyDetails: {
                    ...vendorData.companyDetails,
                    companyName: dataToSave.companyName,
                    country: selectedCountry,
                    state: selectedState
                }
            };
            
            // Create FormData object for the API call
            const formData = new FormData();
            formData.append('vendorDetails', JSON.stringify(vendorUpdateData.vendorDetails));
            formData.append('companyDetails', JSON.stringify(vendorUpdateData.companyDetails));
            
            // If there's a new profile image
            if (profileFormData.imageFile) {
                formData.append('profileImage', profileFormData.imageFile);
            }
            
            // Send update to backend
            const response = await fetch(`http://localhost:5001/api/vendor/update-profile`, {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                throw new Error(`Server responded with status: ${response.status}`);
            }
            
            const result = await response.json();
            console.log("Profile update result:", result);
            
            // Update vendor data in context
            setVendorData({
                ...vendorData,
                vendorDetails: vendorUpdateData.vendorDetails,
                companyDetails: vendorUpdateData.companyDetails
            });
            
            // Close modal
            setIsProfileModalOpen(false);
            
            // Show success message
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile:", error);
            alert(`Failed to update profile: ${error.message}`);
        }
    };

    const toggleProjectExpansion = (projectId) => {
        setExpandedProjects(prev => ({
            ...prev,
            [projectId]: !prev[projectId]
        }));
    };
    
    // Function to delete a project
    const handleDeleteProject = async (projectId) => {
        if (!window.confirm("Are you sure you want to delete this project?")) {
            return;
        }
        
        try {
            const response = await fetch(`http://localhost:5001/api/vendor/projects/${projectId}`, {
                method: 'DELETE',
            });
            
            if (!response.ok) {
                throw new Error(`Server responded with status: ${response.status}`);
            }
            
            const result = await response.json();
            console.log("Project delete result:", result);
            
            if (result.success) {
                // Remove the project from state
                setProjects(prev => prev.filter(proj => proj._id !== projectId));
                
                // Remove from expanded projects state
                setExpandedProjects(prev => {
                    const newState = { ...prev };
                    delete newState[projectId];
                    return newState;
                });
                
                // Show success message
                alert("Project deleted successfully!");
            } else {
                throw new Error("Failed to delete project");
            }
        } catch (error) {
            console.error("Error deleting project:", error);
            alert(`Failed to delete project: ${error.message}`);
        }
    };

    const handleSortChange = (event) => {
        setSortOrder(event.target.value);
    };

    // --- Project Edit Handlers ---
    const handleProjectEditClick = (project) => {
        // Make a deep copy of the project to avoid reference issues
        const projectCopy = JSON.parse(JSON.stringify(project));
        
        // Convert date string to Date object if needed
        if (projectCopy.date && typeof projectCopy.date === 'string') {
            projectCopy.date = new Date(projectCopy.date);
        }
        
        setEditingProject(projectCopy);
        setProjectFormData(projectCopy);
        setIsProjectModalOpen(true);
    };

    const handleProjectCloseModal = () => {
        setIsProjectModalOpen(false);
        setEditingProject(null);
        setProjectFormData({});
    };

    const handleProjectInputChange = (e) => {
        const { name, value } = e.target;
        setProjectFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleProjectSave = async () => {
        try {
            // Validate required fields
            if (!projectFormData.title || !projectFormData.description) {
                alert("Please fill in at least the title and description fields");
                return;
            }
            
            // Create FormData for file uploads
            const formData = new FormData();
            
            // Add project data as JSON
            const projectData = {
                ...projectFormData,
                vendorEmail: currentUser?.email,
            };
            
            // Remove actual file objects from the JSON data
            const projectDataForJson = { ...projectData };
            
            // Handle documents and photos properly
            const hasNewDocuments = projectFormData.documents && 
                projectFormData.documents.some(doc => typeof doc !== 'string' && !(doc.id));
            
            const hasNewPhotos = projectFormData.photos && 
                projectFormData.photos.some(photo => typeof photo !== 'string' && !(photo.url));
            
            // Remove file objects from JSON
            if (hasNewDocuments || hasNewPhotos) {
                delete projectDataForJson.documents;
                delete projectDataForJson.photos;
            }
            
            formData.append('projectData', JSON.stringify(projectDataForJson));
            
            // Add new documents if any
            if (hasNewDocuments && projectFormData.documents) {
                projectFormData.documents.forEach((doc) => {
                    if (typeof doc !== 'string' && !(doc.id)) {
                        formData.append('documents', doc);
                    }
                });
            }
            
            // Add new photos if any
            if (hasNewPhotos && projectFormData.photos) {
                projectFormData.photos.forEach((photo) => {
                    if (typeof photo !== 'string' && !(photo.url)) {
                        formData.append('photos', photo);
                    }
                });
            }
            
            // Send to backend
            const projectId = editingProject._id;
            const response = await fetch(`http://localhost:5001/api/vendor/projects/${projectId}`, {
                method: 'PUT',
                body: formData,
            });
            
            if (!response.ok) {
                throw new Error(`Server responded with status: ${response.status}`);
            }
            
            const result = await response.json();
            console.log("Project update result:", result);
            
            if (result.success && result.data) {
                // Update the project in state with the updated data from the backend
                const updatedProject = {
                    ...result.data,
                    date: new Date(result.data.date),
                };
                
                // Update projects state
                setProjects(prev => 
                    prev.map(proj => proj._id === projectId ? updatedProject : proj)
                );
                
                // Close modal
                handleProjectCloseModal();
                
                // Show success message
                alert("Project updated successfully!");
            } else {
                throw new Error("Failed to update project");
            }
        } catch (error) {
            console.error("Error updating project:", error);
            alert(`Failed to update project: ${error.message}`);
        }
    };

    // Helper function to format date for input
    // const formatDateForInput = (date) => {
    //     if (!date) return '';
    //     const d = new Date(date);
    //     const year = d.getFullYear();
    //     let month = '' + (d.getMonth() + 1);
    //     let day = '' + d.getDate();
    //     if (month.length < 2) month = '0' + month;
    //     if (day.length < 2) day = '0' + day;
    //     return [year, month, day].join('-');
    // };

    const handleDocumentUpload = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;
      
        setProjectFormData(prev => ({
          ...prev,
          documents: [...(prev.documents || []), ...files]
        }));
      
        // Clear the input to allow selecting the same files again if needed
        e.target.value = '';
      };
      
      const handleRemoveDocument = (index) => {
        setProjectFormData(prev => {
          const newDocuments = [...prev.documents];
          newDocuments.splice(index, 1);
          return {
            ...prev,
            documents: newDocuments
          };
        });
      };

      const handlePhotoUpload = (e) => {
  const files = Array.from(e.target.files).slice(0, 5);
  setProjectFormData((prev) => ({
    ...prev,
    photos: [...(prev.photos || []), ...files].slice(0, 5)
  }));
};

const handleRemovePhoto = (index) => {
  setProjectFormData((prev) => ({
    ...prev,
    photos: prev.photos.filter((_, i) => i !== index)
  }));
};

const navigate = useNavigate();
const navigateTo = (path) => {
    navigate(path);
  };

  const [showAddModal, setShowAddModal] = useState(false);
const [newProject, setNewProject] = useState({
  id: '',
  title: '',
  description: '',
  client: '',
  duration: '',
  category: '',
  team: '',
  objective: '',
  features: '',
  impact: '',
  deliverables: '',
  compliance: '',
  documents: [],
  photos: [],
  isNew: true
});

const handleAddProject = async () => {
    try {
        // Validate required fields
        if (!newProject.title || !newProject.description) {
            alert("Please fill in at least the title and description fields");
            return;
        }
        
        // Create FormData for file uploads
        const formData = new FormData();
        
        // Add project data as JSON
        const projectData = {
            ...newProject,
            date: new Date(),
            vendorEmail: currentUser?.email,
        };
        
        // Remove actual file objects from the JSON data
        const projectDataForJson = { ...projectData };
        delete projectDataForJson.documents;
        delete projectDataForJson.photos;
        
        formData.append('projectData', JSON.stringify(projectDataForJson));
        
        // Add documents if any
        if (newProject.documents && newProject.documents.length > 0) {
            newProject.documents.forEach((doc, index) => {
                formData.append(`documents`, doc);
            });
        }
        
        // Add photos if any
        if (newProject.photos && newProject.photos.length > 0) {
            newProject.photos.forEach((photo, index) => {
                formData.append(`photos`, photo);
            });
        }
        
        // Send to backend
        const response = await fetch('http://localhost:5001/api/vendor/projects', {
            method: 'POST',
            body: formData,
        });
        
        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log("Project added result:", result);
        
        if (result.success && result.data) {
            // Add the new project to the state with the ID from the backend
            const savedProject = {
                ...result.data,
                date: new Date(result.data.date),
                isNew: true
            };
            
            // Update projects state
            setProjects(prev => [savedProject, ...prev]);
            
            // Update expanded projects state
            setExpandedProjects(prev => ({ 
                ...prev, 
                [savedProject._id]: false 
            }));
            
            // Reset form
            setNewProject({
                title: '',
                description: '',
                client: '',
                duration: '',
                category: '',
                team: '',
                objective: '',
                features: '',
                impact: '',
                deliverables: '',
                compliance: '',
                documents: [],
                photos: [],
                isNew: true
            });
            
            // Close modal
            setShowAddModal(false);
            
            // Show success message
            alert("Project added successfully!");
        } else {
            throw new Error("Failed to add project");
        }
    } catch (error) {
        console.error("Error adding project:", error);
        alert(`Failed to add project: ${error.message}`);
    }
};
  
// Add this helper function to safely handle URL creation for photos
const getPhotoUrl = (photo) => {
  if (!photo) return '';
  
  if (typeof photo === 'string') {
    return photo; // Return the URL string directly
  }
  
  if (photo instanceof File) {
    try {
      return URL.createObjectURL(photo);
    } catch (error) {
      console.error('Error creating object URL:', error);
      return '';
    }
  }
  
  // Handle blob or other object types
  if (photo instanceof Blob) {
    try {
      return URL.createObjectURL(photo);
    } catch (error) {
      console.error('Error creating object URL for blob:', error);
      return '';
    }
  }
  
  // Return empty string as fallback
  console.warn('Unknown photo type:', photo);
  return '';
};

    return (
        <>
            <div className="min-h-screen bg-gray-50 font-sans p-5">
                {/* Header */}
                <AppHeader />

                {/* Main Content Area */}
                <main className="container mx-auto px-4 py-8 -mt-24 relative z-10" style={{top: '90px'}}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        {/* Profile Section Column - Updated Responsive Version */}
                        <div className="lg:col-span-1 w-full lg:sticky lg:top-8">
                            <UserProfileCard
                                profileData={profileData}
                                loading={loading}
                                error={error}
                                onEditProfileClick={handleProfileEditClick}
                            />
                        </div>

                        {/* Project Section Column */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg shadow-md p-6 w-full">
                                {/* Project Header & Sorting */}
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-800">Projects</h2>
                                        <p className="text-sm text-gray-500">Recent works and collaborations</p>
                                    </div>
                                    <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowAddModal(true)}
                                        className="bg-gradient-to-l from-[#095B49] to-[#000000] text-white px-4 py-2 rounded-md text-sm shadow"
                                    >
                                    + Add Project
                                    </button>
                                    {/* Sort Dropdown */}
                                    <div className="relative">
                                        <label htmlFor="sortOrder" className="sr-only">Sort projects</label>
                                        <select
                                            id="sortOrder"
                                            value={sortOrder}
                                            onChange={handleSortChange}
                                            className="appearance-none bg-gray-100 border border-gray-300 px-4 py-2 pr-8 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 cursor-pointer"
                                        >
                                            <option value="recent">Recent</option>
                                            <option value="oldest">Oldest</option>
                                        </select>
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                            <ChevronDown size={16} />
                                        </div>
                                    </div>
                                    </div>
                                </div>

                                {showAddModal && (
                                    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center p-4">
                                        <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-6 overflow-y-auto max-h-[90vh]">
                                            <h3 className="text-2xl font-bold mb-6 text-gray-800">Add New Project</h3>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {/* Text Inputs */}
                                                <input
                                                    type="text"
                                                    placeholder="Title"
                                                    className="border rounded px-3 py-2 text-sm w-full"
                                                    value={newProject.title}
                                                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Client"
                                                    className="border rounded px-3 py-2 text-sm w-full"
                                                    value={newProject.client}
                                                    onChange={(e) => setNewProject({ ...newProject, client: e.target.value })}
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Duration"
                                                    className="border rounded px-3 py-2 text-sm w-full"
                                                    value={newProject.duration}
                                                    onChange={(e) => setNewProject({ ...newProject, duration: e.target.value })}
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Category"
                                                    className="border rounded px-3 py-2 text-sm w-full"
                                                    value={newProject.category}
                                                    onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Team"
                                                    className="border rounded px-3 py-2 text-sm w-full"
                                                    value={newProject.team}
                                                    onChange={(e) => setNewProject({ ...newProject, team: e.target.value })}
                                                />

                                                {/* Text Areas */}
                                                <textarea
                                                    placeholder="Description"
                                                    className="border rounded px-3 py-2 text-sm w-full md:col-span-2"
                                                    rows="3"
                                                    value={newProject.description}
                                                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                                                />
                                                <textarea
                                                    placeholder="Objective"
                                                    className="border rounded px-3 py-2 text-sm w-full md:col-span-2"
                                                    rows="3"
                                                    value={newProject.objective}
                                                    onChange={(e) => setNewProject({ ...newProject, objective: e.target.value })}
                                                />
                                                <textarea
                                                    placeholder="Key Features"
                                                    className="border rounded px-3 py-2 text-sm w-full md:col-span-2"
                                                    rows="3"
                                                    value={newProject.features}
                                                    onChange={(e) => setNewProject({ ...newProject, features: e.target.value })}
                                                />
                                                <textarea
                                                    placeholder="Impact"
                                                    className="border rounded px-3 py-2 text-sm w-full md:col-span-2"
                                                    rows="3"
                                                    value={newProject.impact}
                                                    onChange={(e) => setNewProject({ ...newProject, impact: e.target.value })}
                                                />

                                                <textarea
                                                    placeholder="Delivarables"
                                                    className="border rounded px-3 py-2 text-sm w-full md:col-span-2"
                                                    rows="3"
                                                    value={newProject.deliverables}
                                                    onChange={(e) => setNewProject({ ...newProject, deliverables: e.target.value })}
                                                />  

                                                <textarea
                                                    placeholder="Compliance"
                                                    className="border rounded px-3 py-2 text-sm w-full md:col-span-2"
                                                    rows="3"
                                                    value={newProject.compliance}
                                                    onChange={(e) => setNewProject({ ...newProject, compliance: e.target.value })}
                                                />

                                                {/* Document Upload Section */}
                                                <div className="w-full md:col-span-2 mt-4">
                                                    <label className="block text-gray-700 font-semibold mb-2">Upload Project Documents</label>
                                                    <div className="flex flex-col gap-2">
                                                        {newProject.documents?.map((doc, index) => (
                                                            <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                                                                📄 {doc.name}
                                                            </div>
                                                        ))}
                                                        {newProject.documents?.length < 5 && (
                                                            <>
                                                                <label
                                                                    htmlFor="projectDocsUpload"
                                                                    className="px-4 py-2 border border-dashed border-gray-400 text-gray-500 rounded-md text-sm cursor-pointer hover:border-emerald-500 hover:text-emerald-700 w-fit"
                                                                >
                                                                    + Upload Documents (PDF, DOCX, etc.)
                                                                </label>
                                                                <input
                                                                    type="file"
                                                                    id="projectDocsUpload"
                                                                    accept=".pdf,.doc,.docx,.txt"
                                                                    multiple
                                                                    className="hidden"
                                                                    onChange={(e) => {
                                                                        const files = Array.from(e.target.files);
                                                                        const updatedDocs = [...(newProject.documents || []), ...files];
                                                                        if (updatedDocs.length > 5) {
                                                                            alert("You can upload a maximum of 5 documents.");
                                                                            return;
                                                                        }
                                                                        setNewProject({ ...newProject, documents: updatedDocs });
                                                                    }}
                                                                />
                                                            </>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Image Upload Section */}
                                                <div className="w-full md:col-span-2 mt-4">
                                                    <label className="block text-gray-700 font-semibold mb-2">Project Images</label>
                                                    <div className="flex flex-wrap gap-4">
                                                        {newProject.photos?.map((image, index) => (
                                                            <div key={`new-photo-${index}`} className="relative">
                                                                <img
                                                                    src={getPhotoUrl(image)}
                                                                    alt={`Project ${index + 1}`}
                                                                    className="w-24 h-24 object-cover rounded-md border"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        const updatedPhotos = [...newProject.photos];
                                                                        updatedPhotos.splice(index, 1);
                                                                        setNewProject({ ...newProject, photos: updatedPhotos });
                                                                    }}
                                                                    className="absolute top-1 right-1 bg-white text-red-500 hover:text-red-700 rounded-full p-1 shadow"
                                                                    title="Remove"
                                                                >
                                                                    <TrashIcon className="h-3 w-3" />
                                                                </button>
                                                            </div>
                                                        ))}
                                                        {newProject.photos?.length < 5 && (
                                                            <>
                                                                <label
                                                                    htmlFor="projectImageUpload"
                                                                    className="w-24 h-24 flex items-center justify-center border-2 border-dashed text-gray-400 rounded-md cursor-pointer hover:border-emerald-500"
                                                                >
                                                                    +
                                                                </label>
                                                                <input
                                                                    type="file"
                                                                    id="projectImageUpload"
                                                                    accept="image/*"
                                                                    multiple
                                                                    className="hidden"
                                                                    onChange={(e) => {
                                                                        const files = Array.from(e.target.files);
                                                                        const updatedFiles = [...(newProject.photos || []), ...files];
                                                                        if (updatedFiles.length > 5) {
                                                                            alert("You can upload a maximum of 5 images.");
                                                                            return;
                                                                        }
                                                                        setNewProject({ ...newProject, photos: updatedFiles });
                                                                    }}
                                                                />
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex justify-end gap-3 mt-8">
                                                <button
                                                    onClick={() => setShowAddModal(false)}
                                                    className="px-4 py-2 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={handleAddProject}
                                                    className="px-4 py-2 text-sm rounded-md bg-gradient-to-l from-[#095B49] to-[#000000] text-white hover:opacity-90"
                                                >
                                                    Add Project
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Project Items List */}
                                <div className="space-y-4">
                                    {projects.length > 0 ? (
                                        projects.map((project) => {
                                            const isExpanded = expandedProjects[project.id || project._id];
                                            return (
                                                <div key={project.id || project._id} className="border rounded-lg overflow-hidden hover:shadow-sm transition-shadow duration-200">
                                                    {/* Project Header (Clickable) */}
                                                    <div
                                                        className={`p-4 flex justify-between items-start cursor-pointer ${isExpanded ? 'bg-emerald-50 border-b' : 'bg-gray-50 hover:bg-gray-100'}`}
                                                        onClick={() => toggleProjectExpansion(project.id || project._id)}
                                                        aria-expanded={isExpanded}
                                                        aria-controls={`project-details-${project.id || project._id}`}
                                                    >
                                                        {/* Header Content */}
                                                        <div>
                                                            <h3 className="font-bold flex items-center gap-2 text-gray-800">
                                                                {project.title}
                                                                {project.isNew && <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-0.5 rounded-full font-semibold">NEW</span>}
                                                            </h3>
                                                            <p className={`text-sm text-gray-600 mt-1 ${isExpanded ? '' : 'line-clamp-2'}`}>
                                                                {project.description}
                                                            </p>
                                                        </div>
                                                        {/* Actions */}
                                                        <div className="flex items-center space-x-2 flex-shrink-0">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleProjectEditClick(project);
                                                                }}
                                                                className="text-gray-500 hover:text-emerald-600 focus:outline-none"
                                                                title="Edit Project"
                                                            >
                                                                <Edit size={18} />
                                                            </button>
                                                            <button
                                                                className="text-gray-500 hover:text-gray-800 flex-shrink-0 ml-2 mt-1"
                                                                aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
                                                            >
                                                                <ChevronDown size={20} className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : 'rotate-0'}`} />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Project Details (Conditionally Rendered) */}
                                                    <div
                                                        id={`project-details-${project.id || project._id}`}
                                                        className={`transition-all duration-300 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[1500px] opacity-100' : 'max-h-0 opacity-0'}`}
                                                    >
                                                        {/* Render details only when expanded */}
                                                        {isExpanded && (
                                                            <div className="p-4 space-y-4">
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                                                                    {project.client && <div> <h4 className="text-sm font-medium text-gray-500 mb-0.5">Client</h4> <p className="font-medium text-gray-800">{project.client}</p> </div>}
                                                                    {project.duration && <div> <h4 className="text-sm font-medium text-gray-500 mb-0.5">Project duration</h4> <p className="font-medium text-gray-800">{project.duration}</p> </div>}
                                                                    {project.category && <div> <h4 className="text-sm font-medium text-gray-500 mb-0.5">Work category</h4> <p className="font-medium text-gray-800">{project.category}</p> </div>}
                                                                    {project.team && <div> <h4 className="text-sm font-medium text-gray-500 mb-0.5">Team involved</h4> <p className="font-medium text-gray-800">{project.team}</p> </div>}
                                                                    {project.objective && <div className="md:col-span-2"> <h4 className="text-sm font-medium text-gray-500 mb-0.5">Objective</h4> <p className="font-medium text-gray-800">{project.objective}</p> </div>}
                                                                    {project.features && <div className="md:col-span-2"> <h4 className="text-sm font-medium text-gray-500 mb-0.5">Key features</h4> <p className="font-medium text-gray-800">{project.features}</p> </div>}
                                                                    {project.impact && <div className="md:col-span-2"> <h4 className="text-sm font-medium text-gray-500 mb-0.5">Business impact</h4> <p className="font-medium text-gray-800">{project.impact}</p> </div>}
                                                                    {project.deliverables && <div className="md:col-span-2"> <h4 className="text-sm font-medium text-gray-500 mb-0.5">Deliverables</h4> <p className="font-medium text-gray-800">{project.deliverables}</p> </div>}
                                                                    {project.compliance && <div className="md:col-span-2"> <h4 className="text-sm font-medium text-gray-500 mb-0.5">Compliance</h4> <p className="font-medium text-gray-800">{project.compliance}</p> </div>}
                                                                    
                                                                </div>
                                                                {/* Documents Section */}
                                                                {project.documents && project.documents.length > 0 && (
                                                                    <div className="pt-2">
                                                                        <h4 className="text-sm font-medium text-gray-500 mb-1">Documents</h4>
                                                                        <div className="space-y-2">
                                                                            {project.documents.map(doc => (
                                                                                <div key={doc.id} className="flex items-center justify-between p-2 border rounded-md bg-gray-50 hover:bg-gray-100">
                                                                                    <span className="text-sm text-gray-700 font-medium truncate pr-2">{doc.name}</span>
                                                                                    <div className="flex gap-3 flex-shrink-0">
                                                                                        <a href={doc.url || '#'} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-emerald-600" title="View"> <Eye size={18} /> </a>
                                                                                        <a href={doc.url || '#'} download={doc.name} className="text-gray-500 hover:text-emerald-600" title="Download"> <Download size={18} /> </a>
                                                                                    </div>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                    
                                                                )}
                                                                {project.photos && project.photos.length > 0 && (
                                                                    <div className="pt-2">
                                                                        <h4 className="text-sm font-medium text-gray-500 mb-2">Photos</h4>
                                                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                                                                            {project.photos.slice(0, 5).map((photo, index) => (
                                                                                <div key={`photo-${index}`} className="relative group">
                                                                                    <img
                                                                                        src={getPhotoUrl(photo)}
                                                                                        alt={`Project Photo ${index + 1}`}
                                                                                        className="w-full h-24 object-cover rounded"
                                                                                    />
                                                                                    <button
                                                                                        type="button"
                                                                                        onClick={() => handleRemovePhoto(index)}
                                                                                        className="absolute top-1 right-1 bg-white text-red-500 hover:text-red-700 rounded-full p-1 shadow group-hover:opacity-100 opacity-75"
                                                                                        title="Remove"
                                                                                    >
                                                                                        <TrashIcon className="h-4 w-4" />
                                                                                    </button>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <p className="text-center text-gray-500 py-4">No projects match the current criteria.</p>
                                    )}

                                    {/* More Button */}
                                    {initialProjectsData.length > 0 && (
                                        <div className="text-right pt-2">
                                            <button className="text-emerald-600 hover:text-emerald-800 text-sm font-medium">View More Projects...</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            
            {/* Edit Profile Modal */}
            {isProfileModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-in-out">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-in-out scale-100">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center mb-4 border-b pb-2">
                            <h2 className="text-xl font-semibold text-gray-800">Edit Profile</h2>
                            <button onClick={handleProfileCloseModal} className="text-gray-400 hover:text-gray-600">
                                <CloseIcon size={20} />
                            </button>
                        </div>
                        {/* Modal Form */}
                        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                            <div className="flex flex-col items-center space-y-3">
                                <img src={imagePreview} alt="Profile Preview" className="w-32 h-32 rounded-full object-cover border-2 border-gray-300 shadow-sm" onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/160"; }} />
                                <label htmlFor="profileImage" className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-4 py-2 rounded-md transition-colors">Change Image</label>
                                <input id="profileImage" name="profileImage" type="file" accept="image/png, image/jpeg, image/gif" onChange={handleProfileFileChange} className="hidden" />
                            </div>
                            {/* Input Fields */}
                            <div><label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label><input type="text" id="name" name="name" value={profileFormData.name} onChange={handleProfileInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" required /></div>
                            <div><label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">Company Name</label><input type="text" id="companyName" name="companyName" value={profileFormData.companyName} onChange={handleProfileInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" /></div>
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                <div className="flex rounded-md shadow-sm">
                                    <select
                                        value={phoneCountryCode}
                                        onChange={(e) => {
                                            setPhoneCountryCode(e.target.value);
                                            setProfileFormData(prev => ({ ...prev, phone: `${e.target.value} ${phoneNumberWithoutCode}` }));
                                        }}
                                        className="px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                                    >
                                        <option value="">Code</option>
                                        {countryCodes.map(c => (
                                            <option key={c.code} value={c.code}>{c.code} ({c.country})</option>
                                        ))}
                                    </select>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={phoneNumberWithoutCode}
                                        onChange={(e) => {
                                            setPhoneNumberWithoutCode(e.target.value);
                                            setProfileFormData(prev => ({ ...prev, phone: `${phoneCountryCode} ${e.target.value}` }));
                                        }}
                                        className="flex-1 px-3 py-2 border-t border-b border-r border-gray-300 rounded-r-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                                        placeholder="Phone number"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                <div className="flex rounded-md shadow-sm">
                                    <select
                                        value={selectedCountry}
                                        onChange={(e) => {
                                            const newCountry = e.target.value;
                                            setSelectedCountry(newCountry);
                                            setStates(countryStateData[newCountry] || []);
                                            setSelectedState('');
                                            setProfileFormData(prev => ({ ...prev, location: `${selectedState || ''}, ${newCountry}` }));
                                        }}
                                        className="px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                                    >
                                        <option value="">Country</option>
                                        {Object.keys(countryStateData).map(country => (
                                            <option key={country} value={country}>{country}</option>
                                        ))}
                                    </select>
                                    <select
                                        value={selectedState}
                                        onChange={(e) => {
                                            const newState = e.target.value;
                                            setSelectedState(newState);
                                            setProfileFormData(prev => ({ ...prev, location: `${newState}, ${selectedCountry}` }));
                                        }}
                                        className="flex-1 px-3 py-2 border-t border-b border-r border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                                        disabled={states.length === 0}
                                    >
                                        <option value="">State/Region</option>
                                        {states.map(state => (
                                            <option key={state} value={state}>{state}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div><label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label><input type="email" id="email" name="email" value={profileFormData.email} onChange={handleProfileInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" required /></div>
                            {/* Action Buttons */}
                            <div className="flex justify-end gap-3 pt-4 border-t mt-6">
                                <button type="button" onClick={handleProfileCloseModal} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors">Cancel</button>
                                <button type="button" onClick={handleProfileSave} className="px-4 py-2 bg-gradient-to-l from-[#095B49] to-[#000000] text-white rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-opacity">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Project Modal */}
            {isProjectModalOpen && editingProject && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-in-out">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-in-out scale-100">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center mb-4 border-b pb-2">
                            <h2 className="text-xl font-semibold text-gray-800">Edit Project</h2>
                            <button onClick={handleProjectCloseModal} className="text-gray-400 hover:text-gray-600">
                                <CloseIcon size={20} />
                            </button>
                        </div>
                        {/* Modal Form */}
                        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                            <div><label htmlFor="editTitle" className="block text-sm font-medium text-gray-700 mb-1">Title</label><input type="text" id="editTitle" name="title" value={projectFormData.title || ''} onChange={handleProjectInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" required /></div>
                            <div><label htmlFor="editDescription" className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea id="editDescription" name="description" value={projectFormData.description || ''} onChange={handleProjectInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"></textarea></div>
                            <div><label htmlFor="editClient" className="block text-sm font-medium text-gray-700 mb-1">Client</label><input type="text" id="editClient" name="client" value={projectFormData.client || ''} onChange={handleProjectInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" /></div>
                            <div><label htmlFor="editDuration" className="block text-sm font-medium text-gray-700 mb-1">Duration</label><input type="text" id="editDuration" name="duration" value={projectFormData.duration || ''} onChange={handleProjectInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" /></div>
                            <div><label htmlFor="editCategory" className="block text-sm font-medium text-gray-700 mb-1">Category</label><input type="text" id="editCategory" name="category" value={projectFormData.category || ''} onChange={handleProjectInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" /></div>
                            <div><label htmlFor="editTeam" className="block text-sm font-medium text-gray-700 mb-1">Team Involved</label><input type="text" id="editTeam" name="team" value={projectFormData.team || ''} onChange={handleProjectInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" /></div>
                            <div><label htmlFor="editObjective" className="block text-sm font-medium text-gray-700 mb-1">Objective</label><textarea id="editObjective" name="objective" value={projectFormData.objective || ''} onChange={handleProjectInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"></textarea></div>
                            <div><label htmlFor="editFeatures" className="block text-sm font-medium text-gray-700 mb-1">Key Features</label><textarea id="editFeatures" name="features" value={projectFormData.features || ''} onChange={handleProjectInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"></textarea></div>
                            <div><label htmlFor="editImpact" className="block text-sm font-medium text-gray-700 mb-1">Business Impact</label><textarea id="editImpact" name="impact" value={projectFormData.impact || ''} onChange={handleProjectInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"></textarea></div>
                            <div><label htmlFor="editDeliverables" className="block text-sm font-medium text-gray-700 mb-1">Deliverables</label><textarea id="editDeliverables" name="deliverables" value={projectFormData.deliverables || ''} onChange={handleProjectInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"></textarea></div>
                            <div><label htmlFor="editCompliance" className="block text-sm font-medium text-gray-700 mb-1">Compliance</label><input type="text" id="editCompliance" name="compliance" value={projectFormData.compliance || ''} onChange={handleProjectInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" /></div>
                            {/* <div><label htmlFor="editDate" className="block text-sm font-medium text-gray-700 mb-1">Date</label><input type="date" id="editDate" name="date" value={formatDateForInput(projectFormData.date)} onChange={handleProjectInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" /></div> */}
                            <div>
                                <label htmlFor="editDocument" className="block text-sm font-medium text-gray-700 mb-1">
                                    Documents
                                </label>
                                
                                {/* Display existing documents if any */}
                                {projectFormData.documents?.length > 0 && (
                                    <div className="mb-3 space-y-2">
                                        {projectFormData.documents.map((doc, index) => (
                                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                                <span className="text-sm truncate">{doc.name}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveDocument(index)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <TrashIcon className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                
                                {/* File upload input */}
                                <input
                                    type="file"
                                    id="editDocument"
                                    name="documents"
                                    onChange={handleDocumentUpload}
                                    multiple  // Allow multiple files
                                    className="block w-full text-sm text-gray-500
                                        file:mr-4 file:py-2 file:px-4
                                        file:rounded-md file:border-0
                                        file:text-sm file:font-semibold
                                        file:bg-emerald-50 file:text-emerald-700
                                        hover:file:bg-emerald-100"
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    Upload multiple project documents (PDF, DOC, PPT, etc.)
                                </p>
                            </div>
                            <div>
                                <label htmlFor="editPhotos" className="block text-sm font-medium text-gray-700 mb-1">
                                    Photos
                                </label>

                                {/* Display existing photos if any */}
                                {projectFormData.photos?.length > 0 && (
                                    <div className="mb-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                                        {projectFormData.photos.slice(0, 5).map((photo, index) => (
                                            <div key={`photo-${index}`} className="relative group">
                                                <img
                                                    src={getPhotoUrl(photo)}
                                                    alt={`Photo ${index + 1}`}
                                                    className="w-full h-24 object-cover rounded"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemovePhoto(index)}
                                                    className="absolute top-1 right-1 bg-white text-red-500 hover:text-red-700 rounded-full p-1 shadow group-hover:opacity-100 opacity-75"
                                                    title="Remove"
                                                >
                                                    <TrashIcon className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                
                                {/* File upload input */}
                                <input
                                    type="file"
                                    id="editPhotos"
                                    name="photos"
                                    onChange={handlePhotoUpload}
                                    multiple  // Allow multiple files
                                    className="block w-full text-sm text-gray-500
                                        file:mr-4 file:py-2 file:px-4
                                        file:rounded-md file:border-0
                                        file:text-sm file:font-semibold
                                        file:bg-emerald-50 file:text-emerald-700
                                        hover:file:bg-emerald-100"
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    Upload multiple project photos
                                </p>
                            </div>
                            {/* Action Buttons */}
                            <div className="flex justify-end gap-3 pt-4 border-t mt-6">
                                <button type="button" onClick={handleProjectCloseModal} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors">Cancel</button>
                                <button type="button" onClick={handleProjectSave} className="px-4 py-2 bg-gradient-to-l from-[#095B49] to-[#000000] text-white rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-opacity">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}