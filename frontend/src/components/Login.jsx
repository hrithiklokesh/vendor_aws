import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Auth } from "aws-amplify";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import image1 from "../assets/bg.png";
import image2 from "../assets/image1.jpg";
import image3 from "../assets/image3.jpg";
import "../styles/Login.css";
import Slider from "react-slick";
import { VendorContext } from "../context/VendorContext";
import { UserContext } from "../context/UserContext";
import Alert from "./ui/Alert";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [user, setUser] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("error");
  const navigate = useNavigate();
  const location = useLocation();
  const { role, email: emailFromState, from } = location.state || {};
  const { setUser: setVendorContextUser, logout } = useContext(VendorContext);
  const { setCurrentUser } = useContext(UserContext);

  const handleLogin = async (e) => {
    // e.preventDefault();
    // setError(""); // Clear any previous errors
    
    // // Clear any existing user data
    // logout();
    // localStorage.removeItem('currentUser');
    // sessionStorage.clear();
    
    // console.log("Login: Cleared existing user data");
    
    // if (!email && !emailFromState) {
    //   setError("Email is required");
    //   return;
    // }
    
    // if (!password) {
    //   setError("Password is required");
    //   return;
    // }
     e.preventDefault();
    setError(""); // Clear any previous errors
    setShowAlert(false); // Clear any previous alerts
    
    // Check if both email and password are empty
    if ((!email && !emailFromState) && !password) {
      setAlertMessage("Please enter your email and password to log in.");
      setAlertType("error");
      setShowAlert(true);
      return;
    }
    
    // Check if email is empty
    if (!email && !emailFromState) {
      setAlertMessage("Email is required. Please enter your email address.");
      setAlertType("error");
      setShowAlert(true);
      return;
    }
    
    // Check if password is empty
    if (!password) {
      setAlertMessage("Password is required. Please enter your password.");
      setAlertType("error");
      setShowAlert(true);
      return;
    }
    
    // Validate email format
    const emailToValidate = email || emailFromState;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailToValidate)) {
      setAlertMessage("Invalid email format. Please enter a valid email address.");
      setAlertType("error");
      setShowAlert(true);
      return;
    }

    try {
      console.log("Attempting login with:", email || emailFromState);
      const user = await Auth.signIn(email || emailFromState, password);
      console.log("Login successful", user);

      // Create a user record in the database if it doesn't exist
      try {
        const response = await fetch('http://localhost:5001/api/vendor/create-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: user.attributes.email || user.username,
            name: user.attributes.name || user.username,
            status: 'pending',
            hasFilledForm: false,
            role: 'vendor'
          }),
        });
      
        const data = await response.json();
        console.log("User record check/creation:", data);
      
        // Add a small delay to allow server to process
        await new Promise(resolve => setTimeout(resolve, 500));  // <-- add this 0.5 second delay
      
      } catch (createError) {
        console.error("Error checking/creating user record:", createError);
      }

      // Fetch the vendor data to get the vendorId
      try {
        const vendorResponse = await fetch(`http://localhost:5001/api/vendor/vendor-by-email?email=${encodeURIComponent(user.attributes.email)}`);
        const vendorData = await vendorResponse.json();
        
        let vendorId;
        if (vendorData.success && vendorData.data && vendorData.data.length > 0) {
          // Use the vendorId from the database
          vendorId = vendorData.data[0].vendorId || vendorData.data[0].id;
          console.log("Found existing vendorId:", vendorId);
        } else {
          // Generate a temporary vendorId (will be replaced when vendor record is created)
          const namePrefix = (user.attributes.email.split('@')[0].substring(0, 3) + 'XXX').substring(0, 3).toUpperCase();
          const now = new Date();
          const year = now.getFullYear().toString().slice(-2);
          const month = (now.getMonth() + 1).toString().padStart(2, '0');
          const day = now.getDate().toString().padStart(2, '0');
          const dateStr = `${year}${month}${day}`;
          const randomSuffix = Math.floor(Math.random() * 900) + 100;
          vendorId = `${namePrefix}-${dateStr}-${randomSuffix}`;
          console.log("Generated temporary vendorId:", vendorId);
        }
        
        const userData = {
          vendorId: vendorId, // Add vendorId explicitly
          email: user.attributes.email, // Email is our primary identifier
          name: user.attributes.name || user.username
        };
        
        // Store user data in localStorage for persistence
        localStorage.setItem('currentUser', JSON.stringify(userData));
        
        setUser(userData);
        
        // Update both contexts with the user data
        setVendorContextUser(userData);
        setCurrentUser(userData);
      } catch (error) {
        console.error("Error fetching vendor data:", error);
        // Fallback if there's an error
        const userData = {
          email: user.attributes.email, // Email is our primary identifier
          name: user.attributes.name || user.username
        };
        
        // Store user data in localStorage for persistence
        localStorage.setItem('currentUser', JSON.stringify(userData));
        
        setUser(userData);
        
        // Update both contexts with the user data
        setVendorContextUser(userData);
        setCurrentUser(userData);
      }

      // Use the new endpoint that checks both collections
      const userEmail = user.attributes.email;
      const response = await fetch(`http://localhost:5001/api/vendor/user-status?email=${encodeURIComponent(userEmail)}`);
      const data = await response.json();
      
      console.log("User status data from login:", data);
      
      // If we have a 'from' location in state, redirect there after login
      if (from) {
        navigate(from.pathname, { replace: true });
        return;
      }
      
      // Otherwise, redirect based on user status
      if (data.success) {
        const userInfo = data.data;
        if (userInfo.status === 'approved') {
          // If approved, go directly to dashboard regardless of form completion
          // Use URL parameters instead of state
          const userEmail = user.attributes.email;
          navigate(`/VendorDashboard?email=${encodeURIComponent(userEmail)}&role=${role}`, { replace: true });
        } else if (userInfo.status === 'rejected') {
          alert("Your vendor application has been rejected. Please contact support.");
          const userEmail = user.attributes.email;
          navigate(`/Form1?email=${encodeURIComponent(userEmail)}&role=${role}`, { replace: true });
        } else if (userInfo.status === 'pending' && userInfo.hasFilledForm) {
          const userEmail = user.attributes.email;
          navigate(`/Auditorapprove?email=${encodeURIComponent(userEmail)}&role=${role}`, { replace: true });
        } else {
          const userEmail = user.attributes.email;
          navigate(`/Form1?email=${encodeURIComponent(userEmail)}&role=${role}`, { replace: true });
        }
      } else {
        const userEmail = user.attributes.email;
        navigate(`/Form1?email=${encodeURIComponent(userEmail)}&role=${role}`, { replace: true });
      }
    } catch (error) {
      console.error("Error logging in:", error);
      
      if (error.code === 'UserNotConfirmedException') {
        // User exists but is not confirmed
        alert("Your account needs verification. We'll send you to the verification page.");
        navigate("/verification", { state: { email: email || emailFromState } });
        return;
      }
      
      // Handle other common errors with user-friendly messages
      let errorMessage;
      switch (error.code) {
        case 'UserNotFoundException':
           setAlertMessage("We couldn't find an account with that email. Please check your email or sign up.");
          setAlertType("error");
          setShowAlert(true);
          break;
        case 'NotAuthorizedException':
          setAlertMessage("Email and password don't match our records. Please check your credentials.");
          setAlertType("error");
          setShowAlert(true);
          break;
        case 'PasswordResetRequiredException':
          setAlertMessage("You need to reset your password. Please use the 'Forgot Password' option.");
          setAlertType("warning");
          setShowAlert(true);
          break;
        default:
          setAlertMessage(error.message || "Invalid email or password. Please try again.");
          setAlertType("error");
          setShowAlert(true);
      }
      
      setError(errorMessage);
    }
  };

  const handleGoogleSignIn = async () => {
    // Clear any existing user data
    logout();
    localStorage.removeItem('currentUser');
    sessionStorage.clear();
    
    console.log("Login: Cleared existing user data for Google login");
    
    // Redirect to Google OAuth endpoint
    window.open("http://localhost:5001/api/auth/google", "_self");
  };

  // Handle Google redirect
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get('token');
    const email = urlParams.get('email');
    const status = urlParams.get('status');
    const filledFormParam = urlParams.get('filledForm');
    const filledForm = filledFormParam === 'true';
    const role = urlParams.get('role') || 'vendor';
    const name = urlParams.get('name') || email?.split('@')[0] || '';
  
    if (email && location.pathname !== '/VendorDashboard') {
      const checkUserStatus = async () => {
        try {
          console.log("Login - Google redirect with email:", email);
          
          // Fetch the vendor data to get the vendorId
          try {
            const vendorResponse = await fetch(`http://localhost:5001/api/vendor/vendor-by-email?email=${encodeURIComponent(email)}`);
            const vendorData = await vendorResponse.json();
            
            let vendorId;
            if (vendorData.success && vendorData.data && vendorData.data.length > 0) {
              // Use the vendorId from the database
              vendorId = vendorData.data[0].vendorId || vendorData.data[0].id;
              console.log("Google login - Found existing vendorId:", vendorId);
            } else {
              // Generate a temporary vendorId (will be replaced when vendor record is created)
              const namePrefix = (email.split('@')[0].substring(0, 3) + 'XXX').substring(0, 3).toUpperCase();
              const now = new Date();
              const year = now.getFullYear().toString().slice(-2);
              const month = (now.getMonth() + 1).toString().padStart(2, '0');
              const day = now.getDate().toString().padStart(2, '0');
              const dateStr = `${year}${month}${day}`;
              const randomSuffix = Math.floor(Math.random() * 900) + 100;
              vendorId = `${namePrefix}-${dateStr}-${randomSuffix}`;
              console.log("Google login - Generated temporary vendorId:", vendorId);
            }
            
            // Create a more complete user object with vendorId
            const userData = {
              vendorId: vendorId, // Add vendorId explicitly
              email: email, // Email is our primary identifier
              name: name,
            };
            
            // Store user data in localStorage for persistence
            localStorage.setItem('currentUser', JSON.stringify(userData));
    
            // Set user in both contexts
            setVendorContextUser(userData);
            setCurrentUser(userData);
          } catch (error) {
            console.error("Error fetching vendor data for Google login:", error);
            // Fallback if there's an error
            const userData = {
              email: email, // Email is our primary identifier
              name: name,
            };
            
            // Store user data in localStorage for persistence
            localStorage.setItem('currentUser', JSON.stringify(userData));
    
            // Set user in both contexts
            setVendorContextUser(userData);
            setCurrentUser(userData);
          }
          
          // Log the user data that was set (using the current context values)
          console.log("Login - Set user data in contexts:", { 
            vendorContext: currentUser || "Not available yet", 
            userContext: currentUser || "Not available yet" 
          });
  
          // First, ensure the user exists in our system by creating a vendor record if needed
          try {
            const createResponse = await fetch('http://localhost:5001/api/vendor/create-user', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: email,
                name: name,
                status: 'pending',
                hasFilledForm: false,
                role: 'vendor'
              }),
            });
            
            const createData = await createResponse.json();
            console.log("Login - Create/check user response:", createData);
          } catch (createError) {
            console.error("Login - Error creating/checking user:", createError);
          }
          
          // Now check the user status
          const response = await fetch(`http://localhost:5001/api/vendor/user-status?email=${encodeURIComponent(email)}`);
          const data = await response.json();
          console.log("Login - User status response:", data);
  
          // If we have a 'from' location in state, redirect there after login
          if (from) {
            navigate(from.pathname, { replace: true });
            return;
          }
  
          if (data.success) {
            const userData = data.data;
            const currentStatus = userData.status;
            const hasFilledForm = userData.hasFilledForm;
  
            if (currentStatus === 'approved') {
              // Use URL parameters instead of state
              navigate(`/VendorDashboard?email=${encodeURIComponent(email)}&role=${role}`, { replace: true });
            } else if (currentStatus === 'rejected') {
              setAlertMessage("Your vendor application has been rejected. Please contact support.");
              setAlertType("error");
              setShowAlert(true);
              setTimeout(() => {
                navigate(`/Form1?email=${encodeURIComponent(email)}&role=${role}`, { replace: true });
              }, 2000);
            } else if (currentStatus === 'pending' && hasFilledForm) {
              navigate(`/Auditorapprove?email=${encodeURIComponent(email)}&role=${role}`, { replace: true });
            } else {
              navigate(`/Form1?email=${encodeURIComponent(email)}&role=${role}`, { replace: true });
            }
          } else {
            // fallback using URL param `status`
            if (status === 'approved') {
              // Use URL parameters instead of state
              navigate(`/VendorDashboard?email=${encodeURIComponent(email)}&role=${role}`, { replace: true });
            } else if (status === 'rejected') {
              alert("Your vendor application has been rejected. Please contact support.");
              navigate(`/Form1?email=${encodeURIComponent(email)}&role=${role}`, { replace: true });
            } else if (status === 'pending' && filledForm) {
              navigate(`/Auditorapprove?email=${encodeURIComponent(email)}&role=${role}`, { replace: true });
            } else {
              navigate(`/Form1?email=${encodeURIComponent(email)}&role=${role}`, { replace: true });
            }
          }
        } catch (error) {
          console.error("Login - Error checking user status:", error);
          
          // Fallback navigation if everything fails
          navigate("/Form1", { state: { role, email }, replace: true });
        }
      };
  
      checkUserStatus();
    }
  }, [location.search, setVendorContextUser, setCurrentUser, navigate, from]);
  
  const handleSignUpRedirect = () => {
    navigate("/signup", { replace: true });
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
    appendDots: (dots) => <div className="custom-dots-container">{dots}</div>,
  };

  const slides = [
    { image: image1, title: "Slide 1 Title", subtitle: "This is the first slide description." },
    { image: image2, title: "Slide 2 Title", subtitle: "This is the second slide description." },
    { image:  image3, title: "Slide 3 Title", subtitle: "This is the third slide description." },
  ];

  return (
    <div className="login-main-container">
      {showAlert && (
        <Alert 
          message={alertMessage} 
          type={alertType} 
          onClose={() => setShowAlert(false)}
        />
      )}
      <Slider {...settings} className="login-carousel">
        {slides.map((slide, index) => (
          <div key={index} className="login-slide">
            <div className="login-image-container">
              <img src={slide.image} alt={`Slide ${index + 1}`} className="login-slide-image" />
            </div>
            <div className="login-slide-content">
              <h2 className="login-slide-title">{slide.title}</h2>
              <p className="login-slide-subtitle">{slide.subtitle}</p>
              <p className="login-slide-button">Learn More</p>
            </div>
          </div>
        ))}
      </Slider>
      <span className="login-cg">CG</span>
      
      <span className="login-hello-user">Hello, {role ? role.charAt(0).toUpperCase() + role.slice(1) : "User"}</span>
      <span className="login-next-step-success">Enter your email and password to log in</span>

      <div className="login-rectangle-1">
        <input
          type="email"
          className="login-email-input"
          placeholder="Email"
          value={email || emailFromState || ""}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {error && <span className="error-icon" />}
      </div>

      <div className="login-rectangle-2">
        <input
          type="password"
          className="login-password-input"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <button className="login-rectangle-4" onClick={handleLogin}>
        <span className="login-create-account">Login</span>
      </button>

      <span className="login-or">or</span>
      <div className="login-line" />
      <div className="login-line-5" />

      <button className="login-rectangle-6" onClick={handleGoogleSignIn}>
        <div className="login-google" />
        <span className="login-signup-with-google">Signin with Google</span>
      </button>

      <div className="login-section">
        <span className="already-have-account">Don't have an account? </span>
        <span className="login" onClick={handleSignUpRedirect}>Sign Up</span>
      </div>
    </div>
  );
}

export default Login;
