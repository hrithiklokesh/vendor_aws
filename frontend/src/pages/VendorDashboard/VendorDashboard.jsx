import React, { useContext, useEffect, useState, useCallback } from "react";
import { RevenueChart } from "../../components/RevenueChart/RevenueChart";
import { StatCard } from "../../components/StatCard/StatCard";
import { ProjectList } from "../../components/ProjectList/ProjectList";
import TenderCarousel from "../../components/TenderCard/TenderCarousel";
import { VendorContext } from "../../context/VendorContext";
import { useLocation, useNavigate } from "react-router-dom";

const mockTenders = [
  {
    title: "Public work mail department",
    description: "04 Pghj | Road to rawadisa",
    closingDate: "25th April, 2025",
    amount: "2.9 cr",
  },
  {
    title: "National Highway Authority",
    description: "NH-27 | Highway expansion project",
    closingDate: "12th May, 2025",
    amount: "15.3 cr",
  },
  {
    title: "Ministry of Railways",
    description: "Track electrification | Eastern Corridor",
    closingDate: "3rd June, 2025",
    amount: "8.7 cr",
  },
  {
    title: "Municipal Corporation of Delhi",
    description: "Waste management system | South Delhi",
    closingDate: "17th April, 2025",
    amount: "4.2 cr",
  },
  {
    title: "Airport Authority of India",
    description: "Terminal renovation | Domestic wing",
    closingDate: "30th May, 2025",
    amount: "12.5 cr",
  },
  {
    title: "Ministry of Urban Development",
    description: "Smart city project | Water conservation",
    closingDate: "22nd July, 2025",
    amount: "6.8 cr",
  }
];

// --- Generate More Realistic Revenue Data ---
const generateRealisticRevenueData = (years) => {
  const data = [];
  const endDate = new Date(); // Today
  // Ensure start date is the beginning of the month 'years' ago
  const startDate = new Date(endDate.getFullYear() - years, endDate.getMonth(), 1);

  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    // Simulate some seasonality and randomness
    const month = currentDate.getMonth();
    const baseRevenue = 50000 + Math.sin(month / 6 * Math.PI) * 20000; // Simple sine wave for seasonality
    const randomFactor = 0.8 + Math.random() * 0.4; // Randomness factor (0.8 to 1.2)
    const monthRevenue = baseRevenue * randomFactor * (1 + (currentDate.getFullYear() - startDate.getFullYear()) * 0.05); // Slight yearly growth

    data.push({
      // Format as YYYY-MM-DD for easier sorting/filtering
      date: currentDate.toISOString().split('T')[0],
      revenue: Math.max(0, Math.round(monthRevenue)) // Ensure non-negative
    });
    // Move to the first day of the next month
    currentDate.setMonth(currentDate.getMonth() + 1, 1);
  }
  // Sort just in case date manipulation caused issues (though it shouldn't here)
  return data.sort((a, b) => new Date(a.date) - new Date(b.date));
};

// Generate 5 years of monthly data ending today
const realisticRevenueData = generateRealisticRevenueData(5);

export const VendorDashboard = () => {
  const { currentUser, vendorData, setVendorData, setUser } = useContext(VendorContext);
  const [vendorName, setVendorName] = useState("");
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State to track API call status
  const [vendorInfoFetched, setVendorInfoFetched] = useState(false);
  const [projectsFetched, setProjectsFetched] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract email and role from URL parameters
  const urlParams = new URLSearchParams(location.search);
  const emailFromUrl = urlParams.get('email');
  const roleFromUrl = urlParams.get('role');
  
  // Effect to set user from URL parameters if available
  useEffect(() => {
    if (emailFromUrl && (!currentUser || currentUser.email !== emailFromUrl)) {
      console.log("VendorDashboard: Setting user from URL parameters:", { email: emailFromUrl, role: roleFromUrl });
      
      // Create a new user object from URL parameters
      const newUser = {
        email: emailFromUrl, // Use email as the primary identifier
        role: roleFromUrl || 'vendor'
      };
      
      // Set the new user in context
      setUser(newUser);
      
      // Clean up the URL by removing the parameters
      navigate('/VendorDashboard', { replace: true });
      
      // Reset fetch states when user changes
      setVendorInfoFetched(false);
      setProjectsFetched(false);
    }
  }, [emailFromUrl, roleFromUrl, currentUser, setUser, navigate]);
  
  // Effect to fetch vendor data when currentUser changes
  useEffect(() => {
    const fetchVendorInfo = async () => {
      // Skip if we've already fetched vendor info or don't have email
      if (vendorInfoFetched || (vendorData && vendorData.vendorId)) {
        return;
      }
      
      try {
        // Get the email from the current user
        const userEmail = currentUser?.email;
        
        if (!userEmail) {
          console.log("VendorDashboard: No user email available to fetch vendor data");
          return;
        }
        
        console.log("VendorDashboard: Fetching vendor data for email:", userEmail);
        
        // First, get the vendor by email to find the correct vendorId
        const emailResponse = await fetch(`http://localhost:5001/api/vendor/vendor-by-email?email=${encodeURIComponent(userEmail)}`);
        
        if (!emailResponse.ok) {
          throw new Error(`Server responded with status: ${emailResponse.status}`);
        }
        
        const emailData = await emailResponse.json();
        console.log("VendorDashboard: Email lookup response:", emailData);
        
        if (emailData.success && emailData.data) {
          // Get the vendorId from the response
          const vendorId = emailData.data.vendorId || emailData.data.id;
          console.log("VendorDashboard: Found vendorId:", vendorId);
          
          if (!vendorId) {
            console.log("VendorDashboard: No vendorId found in the response");
            return;
          }
          
          // Now fetch the complete vendor data using the vendorId
          const detailResponse = await fetch(`http://localhost:5001/api/vendor/vendor/${vendorId}`);
          
          if (!detailResponse.ok) {
            throw new Error(`Server responded with status: ${detailResponse.status}`);
          }
          
          const vendorDetail = await detailResponse.json();
          console.log("VendorDashboard: Vendor detail response:", vendorDetail);
          
          if (vendorDetail) {
            // Update the vendor data in context with all fields
            setVendorData({
              vendorId: vendorDetail.vendorId || vendorDetail.id || vendorId,
              vendorDetails: vendorDetail.vendorDetails || {},
              companyDetails: vendorDetail.companyDetails || {},
              serviceProductDetails: vendorDetail.serviceProductDetails || {},
              bankDetails: vendorDetail.bankDetails || {},
              complianceCertifications: vendorDetail.complianceCertifications || {},
              additionalDetails: vendorDetail.additionalDetails || {},
              status: vendorDetail.status,
              profileImage: vendorDetail.profileImage
            });
            
            // If we have a currentUser but no name, update with the vendor name
            if (currentUser && !currentUser.name && vendorDetail.vendorDetails?.primaryContactName) {
              setUser({
                ...currentUser,
                vendorId: vendorId, // Make sure to set the correct vendorId
                name: vendorDetail.vendorDetails.primaryContactName
              });
            }
            
            setVendorInfoFetched(true);
          } else {
            console.log("VendorDashboard: No vendor details found in response");
          }
        } else {
          console.log("VendorDashboard: No vendor found with email:", userEmail);
        }
      } catch (error) {
        console.error('VendorDashboard: Error fetching vendor info:', error);
        setError("Failed to fetch vendor information");
      }
    };
    
    // Only fetch if we have a currentUser with an email and haven't fetched yet
    if (currentUser && currentUser.email && !vendorInfoFetched) {
      fetchVendorInfo();
    }
  }, [currentUser, setVendorData, setUser, vendorData, vendorInfoFetched]);
  
  // Function to fetch projects
  const fetchProjects = useCallback(async () => {
    // Skip if we've already fetched projects
    if (projectsFetched) {
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Get vendorId from currentUser or vendorData
      const vendorId = currentUser?.vendorId || vendorData?.vendorId || currentUser?.id;
      
      if (!vendorId) {
        console.log("VendorDashboard: No vendorId available to fetch projects");
        setIsLoading(false);
        return;
      }
      
      console.log("VendorDashboard: Fetching projects for vendorId:", vendorId);
      
      // Use the same API endpoint as ProjectsPage
      const response = await fetch(`http://localhost:5001/api/projects/vendor/${vendorId}`);
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const projectsData = await response.json();
      console.log("VendorDashboard: Projects data:", projectsData);
      
      // Format dates and set projects
      const formattedProjects = Array.isArray(projectsData) ? projectsData.map(project => ({
        ...project,
        createdAt: project.createdAt || project.date ? new Date(project.createdAt || project.date) : new Date(),
        completedAt: project.completedAt ? new Date(project.completedAt) : null,
        // Ensure status is set for calculations
        status: project.status || "Pending"
      })) : [];
      
      setProjects(formattedProjects);
      setProjectsFetched(true);
      setIsLoading(false);
    } catch (error) {
      console.error("VendorDashboard: Error fetching projects:", error);
      setError("Failed to fetch projects");
      setIsLoading(false);
    }
  }, [currentUser, vendorData, projectsFetched]);
  
  // Effect to fetch projects when we have the necessary data
  useEffect(() => {
    const hasVendorId = currentUser?.vendorId || vendorData?.vendorId || currentUser?.id;
    
    if (hasVendorId && !projectsFetched) {
      fetchProjects();
    }
  }, [currentUser, vendorData, fetchProjects, projectsFetched]);
  
  // Reset fetch states when user changes
  useEffect(() => {
    return () => {
      setVendorInfoFetched(false);
      setProjectsFetched(false);
    };
  }, [currentUser?.email]);
  
  // Effect to set vendor name for display
  useEffect(() => {
    if (vendorData?.vendorDetails?.primaryContactName) {
      setVendorName(vendorData.vendorDetails.primaryContactName);
    } else if (currentUser?.name) {
      setVendorName(currentUser.name);
    }
  }, [vendorData, currentUser]);
  
  // Map different status values to standard categories
  const getStandardStatus = (status) => {
    if (!status) return "Pending";
    
    // Convert to lowercase for case-insensitive comparison
    const lowercaseStatus = status.toLowerCase();
    
    if (lowercaseStatus.includes('complete') || lowercaseStatus === 'done' || lowercaseStatus === 'finished') {
      return "Completed";
    } else if (lowercaseStatus.includes('progress') || lowercaseStatus === 'ongoing' || lowercaseStatus === 'inprogress') {
      return "InProgress";
    } else if (lowercaseStatus.includes('pend') || lowercaseStatus === 'new' || lowercaseStatus === 'waiting') {
      return "Pending";
    }
    
    // Default case
    return status;
  };
  
  // Calculate project counts from real data
  const totalProjects = projects.length;
  
  // Count projects by standardized status
  const completedProjects = projects.filter(project => getStandardStatus(project.status) === "Completed").length;
  const pendingProjects = projects.filter(project => getStandardStatus(project.status) === "Pending").length;
  const inProgressProjects = projects.filter(project => getStandardStatus(project.status) === "InProgress").length;
  
  const completionPercentage = totalProjects > 0 
    ? Math.round((completedProjects / totalProjects) * 100) 
    : 0;
    
  // Log vendor data for debugging - only once on mount
  useEffect(() => {
    console.log("VendorDashboard - Current User:", currentUser);
    console.log("VendorDashboard - Vendor Data:", vendorData);
  }, []);

  return (
    // Add p-5 here to pad the content area of this specific page
    <div className="p-5">
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">
        {/* Left Column */}
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Total Projects" value={totalProjects.toString()} subtitle="" />
            <StatCard title="Project Completed" value={completedProjects.toString()} subtitle="" />
            <StatCard title="Project Pending" value={pendingProjects.toString()} subtitle="" />
            <StatCard 
              title="Project Completion" 
              value={`${completionPercentage}%`} 
              subtitle="" 
            />
          </div>
          <div className="mt-4">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <p className="text-gray-500">Loading projects...</p>
              </div>
            ) : error ? (
              <div className="flex justify-center items-center h-64">
                <p className="text-red-500">{error}</p>
              </div>
            ) : (
              <ProjectList 
                projects={projects.map(project => ({
                  ...project,
                  status: getStandardStatus(project.status)
                }))} 
              />
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4 mt-4 lg:mt-0 min-w-0">
          <TenderCarousel tenders={mockTenders} />
          <RevenueChart data={realisticRevenueData} />
        </div>
      </div>
    </div>
  );
};