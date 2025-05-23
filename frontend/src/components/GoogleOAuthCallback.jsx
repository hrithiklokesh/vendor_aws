import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { VendorContext } from '../context/VendorContext';

export default function GoogleOAuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState(null);
  const { setUser: setContextUser } = useContext(VendorContext);

  useEffect(() => {
    // Extract token and email from URL query params
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const email = params.get('email');
    const status = params.get('status');
    const filledFormParam = params.get('filledForm');
    const filledForm = filledFormParam === 'true';
    const role = params.get('role') || 'vendor';

    if (!email) {
      setError('No email found in URL');
      return;
    }

    // Create a user object for the context
    const userData = {
      id: email, // Using email as ID since we don't have a proper ID from Google OAuth
      email: email,
      name: email.split('@')[0] // Use part before @ as name
    };
    
    // Update the context with the user data
    setContextUser(userData);

    // Check user status using our new endpoint
    const checkUserStatus = async () => {
      try {
        console.log("GoogleOAuthCallback - Processing with email:", email);
        
        // First, ensure the user exists in our system by creating a vendor record if needed
        try {
          const createResponse = await fetch('http://localhost:5001/api/vendor/create-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: email,
              name: email.split('@')[0],
              status: 'pending',
              hasFilledForm: false,
              role: 'vendor'
            }),
          });
          
          const createData = await createResponse.json();
          console.log("GoogleOAuthCallback - Create/check user response:", createData);
        } catch (createError) {
          console.error("GoogleOAuthCallback - Error creating/checking user:", createError);
        }
        
        // Use the new endpoint that checks both collections
        const response = await fetch(`http://localhost:5001/api/vendor/user-status?email=${encodeURIComponent(email)}`);
        const data = await response.json();
        
        console.log("User status data in GoogleOAuthCallback:", data);
        
        if (data.success) {
          const userData = data.data;
          const currentStatus = userData.status;
          const hasFilledForm = userData.hasFilledForm;
          
          // Update the user context with more complete data
          setContextUser({
            id: userData.id || email,
            email: email,
            name: userData.name || email.split('@')[0],
            status: currentStatus,
            hasFilledForm: hasFilledForm,
            role: userData.role || role
          });
          
          if (currentStatus === 'approved') {
            // If approved, go directly to dashboard regardless of form completion
            navigate("/VendorDashboard", { state: { role, email }, replace: true });
          } else if (currentStatus === 'rejected') {
            alert("Your vendor application has been rejected. Please contact support.");
            navigate("/Form1", { state: { role, email }, replace: true });
          } else if (currentStatus === 'pending' && hasFilledForm) {
            navigate("/Auditorapprove", { state: { role, email }, replace: true });
          } else {
            navigate("/Form1", { state: { role, email }, replace: true });
          }
        } else {
          // If user not found in either collection, use URL params as fallback
          if (status === 'approved') {
            navigate("/VendorDashboard", { state: { role, email }, replace: true });
          } else {
            navigate("/Form1", { state: { role, email }, replace: true });
          }
        }
      } catch (err) {
        console.error("Error checking user status:", err);
        setError('Error checking user status');
        
        // Fallback to URL params if API call fails
        if (status === 'approved') {
          navigate("/VendorDashboard", { state: { role, email }, replace: true });
        } else {
          navigate("/Form1", { state: { role, email }, replace: true });
        }
      }
    };

    checkUserStatus();
  }, [location.search, navigate, setContextUser]);

  if (error) {
    return (
      <div className="p-6 text-center text-red-600">
        <h2>Error during Google login</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 text-center">
      <h2>Verifying Google login...</h2>
    </div>
  );
}
