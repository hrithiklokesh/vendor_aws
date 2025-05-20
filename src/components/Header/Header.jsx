import React, { useState, useContext, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
// Import NavLink, useLocation, and useNavigate
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import DateYearFunction from "./DateYearFunction";
import { VendorContext } from "../../context/VendorContext";
import { NotificationContext } from "../../context/NotificationContext";

export const Header = () => {
  const [isVendor, setIsVendor] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const notificationDropdownRef = useRef(null);
  
  // Get current location
  const location = useLocation();
  const navigate = useNavigate();
  // Check if we are on the dashboard route
  const isOnDashboard = location.pathname === "/VendorDashboard";
  
  // Get user data from context
  const { currentUser, vendorData, setUser, setVendorData, logout } = useContext(VendorContext);
  
  // Get notification data from context
  const { unreadCount, notifications, refreshNotifications } = useContext(NotificationContext);
  
  // Get only pending leads that need approval
  const pendingNotifications = notifications?.filter(notification => 
    notification.isPending && !notification.isRead
  ) || [];
  
  // Handle clicks outside notification dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationDropdownRef.current && !notificationDropdownRef.current.contains(event.target)) {
        setShowNotificationDropdown(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [notificationDropdownRef]);
  
  // Extract email and role from URL parameters
  const urlParams = new URLSearchParams(location.search);
  const emailFromUrl = urlParams.get('email');
  const roleFromUrl = urlParams.get('role');
  
  // Effect to set user from URL parameters if available
  useEffect(() => {
    if (emailFromUrl && (!currentUser || currentUser.email !== emailFromUrl)) {
      console.log("Header: Setting user from URL parameters:", { email: emailFromUrl, role: roleFromUrl });
      
      // Create a new user object from URL parameters
      const newUser = {
        email: emailFromUrl, // Use email as the primary identifier
        role: roleFromUrl || 'vendor'
      };
      
      // Set the new user in context
      setUser(newUser);
      
      // Clean up the URL by removing the parameters
      if (location.pathname === '/VendorDashboard') {
        navigate('/VendorDashboard', { replace: true });
      }
    }
  }, [emailFromUrl, roleFromUrl, currentUser, setUser, navigate, location.pathname]);
  
  // Only log on first render, not on every update
  React.useEffect(() => {
    console.log("Header - Current User:", currentUser);
    console.log("Header - Vendor Data:", vendorData);
  }, []);
  
  // Refresh notifications when user changes
  useEffect(() => {
    if (currentUser?.email && refreshNotifications) {
      try {
        refreshNotifications();
      } catch (err) {
        console.error("Header: Error refreshing notifications:", err);
      }
    }
  }, [currentUser]);
  
  // Toggle notification dropdown
  const toggleNotificationDropdown = () => {
    setShowNotificationDropdown(!showNotificationDropdown);
    
    // Close mobile menu if open
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };
  
  // Effect to fetch vendor data when currentUser changes or dashboard is loaded
  useEffect(() => {
    const fetchVendorInfo = async () => {
      try {
        // Get the email from the current user
        const userEmail = currentUser?.email;
        
        if (!userEmail) {
          console.log("Header: No user email available to fetch vendor data");
          return;
        }
        
        console.log("Header: Fetching vendor data for email:", userEmail);
        
        // First, get the vendor by email to find the correct vendorId
        const emailResponse = await fetch(`http://localhost:5001/api/vendor/vendor-by-email?email=${encodeURIComponent(userEmail)}`);
        
        if (!emailResponse.ok) {
          throw new Error(`Server responded with status: ${emailResponse.status}`);
        }
        
        const emailData = await emailResponse.json();
        console.log("Header: Email lookup response:", emailData);
        
        if (emailData.success && emailData.data) {
          // Get the vendorId from the response
          const vendorId = emailData.data.vendorId || emailData.data.id;
          console.log("Header: Found vendorId:", vendorId);
          
          if (!vendorId) {
            console.log("Header: No vendorId found in the response");
            return;
          }
          
          // Now fetch the complete vendor data using the vendorId
          const detailResponse = await fetch(`http://localhost:5001/api/vendor/vendor/${vendorId}`);
          
          if (!detailResponse.ok) {
            throw new Error(`Server responded with status: ${detailResponse.status}`);
          }
          
          const vendorDetail = await detailResponse.json();
          console.log("Header: Vendor detail response:", vendorDetail);
          
          if (vendorDetail) {
            // Update the vendor data in context
            setVendorData({
              vendorDetails: vendorDetail.vendorDetails || {},
              companyDetails: vendorDetail.companyDetails || {},
              serviceProductDetails: vendorDetail.serviceProductDetails || {},
              bankDetails: vendorDetail.bankDetails || {},
              complianceCertifications: vendorDetail.complianceCertifications || {},
              additionalDetails: vendorDetail.additionalDetails || {}
            });
            
            // If we have a currentUser but no name, update with the vendor name
            if (currentUser && !currentUser.name && vendorDetail.vendorDetails?.primaryContactName) {
              setUser({
                ...currentUser,
                vendorId: vendorId, // Make sure to set the correct vendorId
                name: vendorDetail.vendorDetails.primaryContactName
              });
            }
          } else {
            console.log("Header: No vendor details found in response");
          }
        } else {
          console.log("Header: No vendor found with email:", userEmail);
        }
      } catch (error) {
        console.error('Header: Error fetching vendor info:', error);
      }
    };
    
    // Only fetch if we have a currentUser with an email
    if (currentUser && currentUser.email) {
      fetchVendorInfo();
    }
  }, [currentUser, isOnDashboard, setVendorData, setUser]);
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };
  
  // Helper function for NavLink classes
  const getNavLinkClass = ({ isActive }) => {
    return `hover:text-emerald-200 transition-colors ${isActive ? 'opacity-100 font-semibold' : 'opacity-50'}`;
  };
  
  // Helper function for Mobile NavLink classes
  const getMobileNavLinkClass = ({ isActive }) => {
    return `hover:opacity-75 ${isActive ? 'opacity-100 font-semibold' : 'opacity-50'}`;
  };
  
  // Helper function to get appropriate greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  // Render notification dropdown
  const renderNotificationDropdown = () => {
    return (
      <div 
        ref={notificationDropdownRef}
        className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
      >
        <div className="px-4 py-2 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
            {unreadCount > 0 && (
              <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none bg-red-100 text-red-800 rounded-full">
                {unreadCount} unread
              </span>
            )}
          </div>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {notifications.length > 0 ? (
            <ul className="divide-y divide-gray-100">
              {[...notifications.filter(n => !n.isRead), ...notifications.filter(n => n.isRead)]
                .slice(0, 5)
                .map((notification) => (
                <li key={notification.id} className={`p-4 hover:bg-gray-50 ${notification.isPending ? 'bg-red-50' : ''}`}>
                  <Link
                    to={notification.link}
                    onClick={() => setShowNotificationDropdown(false)}
                    className="block"
                  >
                    <div className="flex gap-3">
                      <div className="flex-shrink-0">
                        <div className={`w-10 h-10 ${notification.isPending ? 'bg-red-100' : 'bg-blue-100'} rounded-full flex items-center justify-center`}>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${notification.isPending ? 'text-red-600' : 'text-blue-600'}`}>
                            {notification.isPending ? (
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                            ) : (
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            )}
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${notification.isPending ? 'text-red-800' : 'text-gray-800'}`}>
                          {notification.title}
                        </p>
                        <p className="text-sm text-gray-600 truncate">
                          {notification.message}
                        </p>
                        <div className="mt-1 flex">
                          <span className="inline-flex items-center text-xs text-gray-500">
                            {notification.time}
                          </span>
                          {notification.isPending && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                              Action Required
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="py-6 text-center text-gray-500">
              <p>No notifications</p>
            </div>
          )}
        </div>
        
        {notifications.length > 0 && (
          <div className="px-4 py-3 bg-gray-50 text-right border-t border-gray-200">
            <Link
              to="/VendorDashboard/notifications"
              onClick={() => setShowNotificationDropdown(false)}
              className="text-emerald-600 hover:text-emerald-800 text-sm font-medium"
            >
              View all notifications
            </Link>
          </div>
        )}
      </div>
    );
  };
  
  // Replace your existing notification button with this one
  const notificationButton = (
    <div className="relative" ref={notificationDropdownRef}>
      <button 
        onClick={toggleNotificationDropdown}
        aria-label="Notifications" 
        className="relative p-1 text-white hover:bg-white/20 rounded-full"
      >
        <img src="https://c.animaapp.com/VmmSqCQF/img/group@2x.png" alt="Notification" className="w-5 h-5 sm:w-6 sm:h-6" /> 
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-xs font-bold text-black ring-2 ring-gray-900">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
      
      {/* Notification Dropdown */}
      {showNotificationDropdown && renderNotificationDropdown()}
    </div>
  );

  return (
    // Conditional Height: Apply min-h-[150px] only on dashboard, else min-h-[80px]
    // lg:h-[291px] remains dashboard-only, lg:h-auto for others.
    <header className={`[background:linear-gradient(90deg,rgba(9,91,73,1)_0%,rgba(0,0,0,1)_100%)] rounded-[20px] p-4 lg:p-[18px] shadow-2xl relative flex flex-col justify-between ${isOnDashboard ? 'min-h-[150px] lg:h-[291px]' : 'min-h-[80px] lg:h-auto'}`}>
      {/* --- Top Section --- */}
      {/* Removed flex-wrap from here, handling mobile layout differently */}
      <div className="relative flex justify-between items-start gap-4"> {/* Changed items-center to items-start for mobile alignment */}

        {/* Logo (Stays Top-Left) */}
        <NavLink to="/VendorDashboard" className="text-white text-3xl lg:text-[40px] font-bold font-['Montserrat'] flex-shrink-0" aria-label="Homepage">
          CG
        </NavLink>

        {/* --- Mobile --- Search & Hamburger Container --- */}
        {/* This container holds search and hamburger, appears only on mobile */}
        <div className="flex-grow flex flex-col items-center gap-3 lg:hidden px-2"> {/* Added px-2 for spacing */}
           {/* Hamburger Button (Moved to top-right of this container) */}
           {/* Using absolute positioning relative to the overall top section div */}
           <button
              className="absolute top-0 right-0 text-white hover:bg-white/20 p-1 rounded z-20" // Added z-20
              onClick={toggleMobileMenu}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
            >
            {isMobileMenuOpen ? (
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
            )}
           </button>

           {/* Search Bar (Centers below logo/button row because of flex-col and items-center on parent) */}
           {/* Takes full width of its container, max-w-xs keeps it from getting too wide */}
           <div className="relative w-full max-w-xs mt-8"> {/* Added margin-top to push it down slightly */}
            <input
              type="text"
              placeholder="Search here"
              className="w-full h-9 bg-white bg-opacity-10 rounded-xl py-[7px] px-2.5 text-sm text-white placeholder-white placeholder-opacity-50 border-none focus:ring-1 focus:ring-white/50"
              aria-label="Search"
            />
            <img
              src="https://c.animaapp.com/VmmSqCQF/img/tabler-search.svg"
              alt="Search"
              className="absolute right-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50"
            />
          </div>
        </div>


        {/* Desktop Navigation (Hidden on Mobile) */}
        <nav className="hidden lg:flex space-x-[30px] text-white text-base font-medium font-['Poppins'] flex-shrink-0"> {/* Added flex-shrink-0 */}
          <NavLink to="/VendorDashboard" className={getNavLinkClass} end>Dashboard</NavLink>
          <NavLink to="/VendorDashboard/projects" className={getNavLinkClass}>Projects</NavLink>
          <NavLink to="/VendorDashboard/leads" className={getNavLinkClass}>Leads</NavLink>
          <NavLink to="/VendorDashboard/template" className={getNavLinkClass}>Workspace</NavLink>
          {/* <NavLink to="/pricing" className={getNavLinkClass}>Pricing</NavLink> */}
        </nav>


        {/* Mobile Menu Dropdown (Appears below header when toggled) */}
        {/* Positioned relative to the main header */}
        {isMobileMenuOpen && (
          // Adjusted top to account for potentially shorter header, using mt-2 relative to header top section
          <div className="absolute top-[calc(100%+8px)] left-0 right-0 mx-4 bg-gray-900 bg-opacity-95 rounded-lg shadow-lg lg:hidden z-50"> {/* Increased z-index */}
             {/* Navigation Links */}
            <nav className="flex flex-col space-y-4 p-4 text-white text-base font-medium font-['Poppins']">
              <NavLink to="/VendorDashboard" className={getMobileNavLinkClass} onClick={closeMobileMenu} end>Dashboard</NavLink>
              <NavLink to="VendorDashboard/projects" className={getMobileNavLinkClass} onClick={closeMobileMenu}>Projects</NavLink>
              <NavLink to="VendorDashboard/leads" className={getMobileNavLinkClass} onClick={closeMobileMenu}>Leads</NavLink>
              <NavLink to="VendorDashboard/notifications" className={getMobileNavLinkClass} onClick={closeMobileMenu}>Notifications</NavLink>
              <NavLink to="VendorDashboard/template" className={getMobileNavLinkClass} onClick={closeMobileMenu}>Template</NavLink> {/* Assuming Template link in mobile too */}
              {/* If you had Pricing */}
              {/* <NavLink to="/pricing" className={getMobileNavLinkClass} onClick={closeMobileMenu}>Pricing</NavLink> */}
            </nav>

            {/* Mobile Controls Section (Vendor/Client Toggle, Icons) */}
            <div className="mt-2 mb-4 px-4 flex items-center justify-between">
              {/* Updated Mobile Toggle */}
              <div
                className={`w-[59px] h-[23px] rounded-[17px] cursor-pointer relative ${isVendor ? 'bg-gradient-to-r from-teal-400 to-[#423e3e]' : 'bg-gradient-to-r from-[#423e3e] to-[#efcf4e]'}`}
            onClick={() => setIsVendor(!isVendor)}
                role="button" aria-label="Toggle Vendor/Client mode" tabIndex={0}
          >
            {isVendor ? (
                  <span className="text-white text-[8px] font-medium absolute right-[5%] top-1/2 -translate-y-1/2">Vendor</span>
                ) : (
                  <span className="text-white text-[8px] font-medium absolute left-[10%] top-1/2 -translate-y-1/2">Client</span>
                )}
                <div
                  className={`absolute top-1/2 -translate-y-1/2 w-[30%] h-[19px] bg-white rounded-full transition-all duration-200 ease-in-out ${ isVendor ? 'left-[5%]' : 'left-[65%]' }`} />
              </div>

              {/* Icons */}
              <div className="flex items-center space-x-3 sm:space-x-4"> {/* Adjusted space */}
                {notificationButton}
                 <button aria-label="Messages" className="p-1 text-white hover:bg-white/20 rounded-full"> <img src="https://c.animaapp.com/VmmSqCQF/img/tabler-message.svg" alt="Message" className="w-5 h-5" /> </button>
                 <button 
                   onClick={() => {
                     // Check if user is logged in
                     const userFromStorage = localStorage.getItem('currentUser');
                     if (currentUser || userFromStorage) {
                       console.log("Header Mobile: User found, navigating to profile");
                       navigate('/home');
                     } else {
                       console.log("Header Mobile: No user found in localStorage or context");
                       // Just navigate to home anyway and let the component handle it
                       navigate('/home');
                     }
                   }}
                   aria-label="Profile" 
                   className="p-1 text-white hover:bg-white/20 rounded-full"
                 > 
                   <img src="https://c.animaapp.com/VmmSqCQF/img/group-1@2x.png" alt="Profile" className="w-5 h-5" /> 
                 </button>
                 <button 
                   onClick={() => {
                     console.log("Mobile logout button clicked");
                     // Clear all data
                     logout();
                     // Clear any session storage
                     sessionStorage.clear();
                     // Clear any remaining localStorage items
                     localStorage.clear();
                     // Force a complete page reload to clear any state
                     window.location.href = "/login";
                   }} 
                   className="px-3 py-1 text-white text-sm bg-red-600 hover:bg-red-700 rounded-md"
                 >
                   Logout
                 </button>
              </div>
            </div>
          </div>
        )}

        {/* --- Desktop --- Right Controls (Hidden on Mobile) --- */}
        <div className="hidden lg:flex items-center justify-end gap-2 sm:gap-4 flex-shrink-0"> {/* Added flex-shrink-0 */}
          {/* Search Bar */}
          <div className="relative">
            <input type="text" placeholder="Search here" className="w-[254px] h-9 bg-white bg-opacity-10 rounded-xl py-[7px] px-2.5 text-sm text-white placeholder-white placeholder-opacity-50 border-none focus:ring-1 focus:ring-white/50" aria-label="Search" />
            <img src="https://c.animaapp.com/VmmSqCQF/img/tabler-search.svg" alt="Search" className="absolute right-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
          </div>
          {/* Icons Container */}
          <div className="flex items-center space-x-2 sm:space-x-4">
             {notificationButton}
             <button aria-label="Messages" className="p-1 text-white hover:bg-white/20 rounded-full"> <img src="https://c.animaapp.com/VmmSqCQF/img/tabler-message.svg" alt="Message" className="w-5 h-5 sm:w-6 sm:h-6" /> </button>
             <button 
               onClick={() => {
                 // Check if user is logged in
                 const userFromStorage = localStorage.getItem('currentUser');
                 if (currentUser || userFromStorage) {
                   console.log("Header: User found, navigating to profile");
                   navigate('/home');
                 } else {
                   console.log("Header: No user found in localStorage or context");
                   // Just navigate to home anyway and let the component handle it
                   navigate('/home');
                 }
               }}
               aria-label="Profile" 
               className="p-1 text-white hover:bg-white/20 rounded-full"
             > 
               <img src="https://c.animaapp.com/VmmSqCQF/img/group-1@2x.png" alt="Profile" className="w-5 h-5 sm:w-6 sm:h-6" /> 
             </button>
             <button 
               onClick={() => {
                 console.log("Logout button clicked");
                 // Clear all data
                 logout();
                 // Clear any session storage
                 sessionStorage.clear();
                 // Clear any remaining localStorage items
                 localStorage.clear();
                 // Force a complete page reload to clear any state
                 window.location.href = "/login";
               }} 
               className="ml-2 px-3 py-1 text-white text-sm bg-red-600 hover:bg-red-700 rounded-md"
             >
               Logout
             </button>
          </div>
          {/* Updated Desktop Toggle */}
          <div
             className={`w-[59px] h-[23px] rounded-[17px] cursor-pointer relative ${isVendor ? 'bg-gradient-to-r from-teal-400 to-[#423e3e]' : 'bg-gradient-to-r from-[#423e3e] to-[#efcf4e]'}`}
             onClick={() => setIsVendor(!isVendor)}
             role="button" aria-label="Toggle Vendor/Client mode" tabIndex={0}
           >
             {isVendor ? (
               <span className="text-white text-[8px] font-medium absolute right-[5%] top-1/2 -translate-y-1/2">Vendor</span>
             ) : (
               <span className="text-white text-[8px] font-medium absolute left-[10%] top-1/2 -translate-y-1/2">Client</span>
             )}
             <div
               className={`absolute top-1/2 -translate-y-1/2 w-[30%] h-[19px] bg-white rounded-full transition-all duration-200 ease-in-out ${ isVendor ? 'left-[5%]' : 'left-[65%]' }`} />
          </div>
        </div>
        </div>

      {/* --- Bottom Section (Conditional Rendering for Dashboard) --- */}
      {/* Only render this div if isOnDashboard is true */}
      {isOnDashboard && (
        // This section will only appear on the dashboard, contributing to its larger height
        <div className="mt-auto pt-4 flex flex-col lg:flex-row flex-wrap justify-between items-start lg:items-end gap-4">
          {/* Greeting */}
          <div className="text-white">
            <h2 className="text-2xl lg:text-[32px] font-medium font-['Montserrat']">
              {getGreeting()}, {vendorData?.vendorDetails?.primaryContactName || currentUser?.name || 'User'}! 😎
              {/* Debug info - remove in production */}
              {/* {process.env.NODE_ENV === 'development' && (
                <span className="text-xs opacity-50 block">
                  {vendorData?.vendorDetails?.primaryContactName ? 'Using vendor name' : currentUser?.name ? 'Using user name' : 'Using default'}
                </span>
              )} */}
            </h2>
          </div>
          {/* Bottom Right Buttons */}
          <div className="flex flex-wrap items-center justify-start lg:justify-end gap-2 lg:gap-4">
            {/* Date Section */}
            <DateYearFunction />
            {/* Wrapper for B2B and Prompt buttons */}
            <div className="flex items-center gap-2 lg:gap-4">
              <button className="w-auto px-4 h-[45px] bg-white bg-opacity-10 hover:bg-opacity-20 rounded-[9px] flex items-center justify-center text-white text-sm lg:text-base font-semibold font-['Montserrat']"> B2B <img src="https://c.animaapp.com/VmmSqCQF/img/guidance-shop.svg" alt="Shop" className="ml-2 w-5 h-5 lg:w-6 lg:h-6" /> </button>
              <button className="w-auto px-4 h-[45px] bg-white bg-opacity-10 hover:bg-opacity-20 rounded-[9px] flex items-center justify-center text-white text-sm lg:text-base font-semibold font-['Montserrat']"> Prompt <img src="https://c.animaapp.com/VmmSqCQF/img/vector.svg" alt="Prompt" className="ml-2 w-4 h-4 lg:w-[18px] lg:h-[18px]" /> </button>
          </div>
          </div>
        </div>
      )}
      </header>
    );
  };
