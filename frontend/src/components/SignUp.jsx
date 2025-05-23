
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./SignUp.css";
// import { Amplify, Auth } from "aws-amplify";
// import { awsExports } from "../aws-exports";

// // Configure AWS Amplify with Cognito
// Amplify.configure({
//   Auth: {
//     region: awsExports.REGION,
//     userPoolId: awsExports.USER_POOL_ID,
//     userPoolWebClientId: awsExports.USER_POOL_APP_CLIENT_ID,
//   },
// });

import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/SignUp.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { Amplify, Auth } from "aws-amplify";
import awsExports from "../aws-exports";
import image1 from "../assets/bg.png";
import image2 from "../assets/image1.jpg";
import image3 from "../assets/image3.jpg";
import { VendorContext } from "../context/VendorContext";
import Alert from "./ui/Alert";

Amplify.configure(awsExports);


function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [existingUser, setExistingUser] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("error");
  const navigate = useNavigate();
  const { setUser: setContextUser } = useContext(VendorContext);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);

    if (existingUser) {
      setExistingUser(false);
    }
    
    // Clear alert when user starts typing
    if (showAlert) {
      setShowAlert(false);
    }
    
    if (!newEmail) {
      setEmailError("Email is required.");
    } else if (!validateEmail(newEmail)) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError("");
    }
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    
    // Clear alert when user starts typing
    if (showAlert) {
      setShowAlert(false);
    }
    
    if (!newPassword) {
      setPasswordError("Password is required.");
    } else if (!validatePassword(newPassword)) {
      setPasswordError("Password must be at least 8 characters long.");
    } else {
      setPasswordError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");
    setShowAlert(false);

    if (!email) {
      // Only set the alert message, not the inline error
      setAlertMessage("Email is required. Please enter a valid email address.");
      setAlertType("error");
      setShowAlert(true);
      return;
    }
    if (!validateEmail(email)) {
      // Only set the alert message, not the inline error
      setAlertMessage("Invalid email format. Please enter a valid email address with format: example@domain.com");
      setAlertType("error");
      setShowAlert(true);
      return;
    }
    if (!password) {
      // Only set the alert message, not the inline error
      setAlertMessage("Password is required. Please enter a password.");
      setAlertType("error");
      setShowAlert(true);
      return;
    }
    if (!validatePassword(password)) {
      // Only set the alert message, not the inline error
      setAlertMessage("Password must be at least 8 characters long for security reasons.");
      setAlertType("error");
      setShowAlert(true);
      return;
    }
    if (!termsAccepted) {
      setAlertMessage("Please accept the terms and conditions to continue.");
      setAlertType("warning");
      setShowAlert(true);
      return;
    }

    try {
      const signUpResponse = await Auth.signUp({
        username: email,
        password,
        attributes: { email },
      });
      console.log("Sign-up successful:", signUpResponse);
      
      //Create a temporary user object for context
      // Note: This user is not fully authenticated yet, but we store basic info
      // Use vendorId format instead of email as the ID
      const namePrefix = (email.split('@')[0].substring(0, 3) + 'XXX').substring(0, 3).toUpperCase();
      const now = new Date();
      const year = now.getFullYear().toString().slice(-2);
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const day = now.getDate().toString().padStart(2, '0');
      const dateStr = `${year}${month}${day}`;
      const randomSuffix = Math.floor(Math.random() * 900) + 100; // Random 3-digit number
      
      // Generate a vendorId in the same format as the backend
      const vendorId = `${namePrefix}-${dateStr}-${randomSuffix}`;
      
      const userData = {
        id: vendorId, // Use vendorId instead of email
        vendorId: vendorId, // Add vendorId explicitly
        email: email,
        name: email.split('@')[0], // Use part before @ as name
        pendingVerification: true
      };
      
      // Store user data in localStorage for persistence
      localStorage.setItem('currentUser', JSON.stringify(userData));
      
      // Update the context with the user data
      setContextUser(userData);
      
      // Store password temporarily for auto-login after verification
      // This will be removed after successful verification
      // Use a simple encryption to avoid storing plain text password
      const encryptedPassword = btoa(password); // Base64 encoding (not secure, but better than plaintext)
      localStorage.setItem(`temp_password_${email}`, encryptedPassword);
      
      // Navigate to verification page
      navigate("/verification", { state: { email } });

    } catch (error) {
      console.error("Error during sign-up:", error);
      if (error.code === "UsernameExistsException") {
        // Show an alert for existing user
        setAlertMessage("This email is already registered. Please login instead.");
        setAlertType("warning");
        setShowAlert(true);
        
        // Only set the flag that this is an existing user, don't show inline error
        setExistingUser(true);
        
        // We'll handle the redirect in the UI rather than with a timeout
      } else {
        // Only show the alert, not the inline error
        setAlertMessage(error.message || "An error occurred during sign-up. Please try again.");
        setAlertType("error");
        setShowAlert(true);
      }
    }
  };

  const handleGoogleSignIn = () => {
    // // const url = "https://us-east-1r522gnfpq.auth.us-east-1.amazoncognito.com/login?response_type=code&client_id=4k2rtnhvl9v22eakb5p6l8uj6k&redirect_uri=http://localhost:3000/callback";
    // // console.log("Redirecting to:", url);
    // // window.location.href = url;
    window.open("http://localhost:5001/api/auth/google", "_self");
  };

  const togglePasswordVisibility = () =>{
    setShowPassword(!showPassword);
  };

  const handleLoginRedirect = () => {
    console.log("Navigating to /login");
    navigate("/login", { replace: true });
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
  
    // const slides = [
    //   {
    //     image: image1,
    //     title: "Slide 1 Title",
    //     subtitle: "This is the first slide description.",
    //   },
    //   {
    //     image: image2,
    //     title: "Slide 2 Title",
    //     subtitle: "This is the second slide description.",
    //   },
    //   {
    //     image: image3,
    //     title: "Slide 3 Title",
    //     subtitle: "This is the third slide description.",
    //   },
    // ];
  
const slides = [
      {
        image: image1,
        title: "Revoltionzing Business Execution",
        subtitle: "AI-driven matching and automation streamline your entire operations",
        qutoes: " Save time. Cut costs. Scale faster ",

      },
      {
        image: image2,
        title: "What makes us stand out?",
        subtitle: "Hassel-free business setup support",
        qutoes: "From idea to execution — we’ve got you covered",

      },
      {
        image: image3,
        title: "Built for Modern Business Needs",
        subtitle: "Designed for Startups, SMEs, and large enterprises.",
        qutoes: "Achieve more with less friction."
      },
    ];
  return (
    <div className="su-main-container">

    {showAlert && (<Alert
      message={alertMessage}
      type={alertType}
      onClose={()=>setShowAlert(false)}
      />
    )}
      {/* <div className="carousel-container"> */}
        <Slider {...settings} className="carousel">
          {slides.map((slide, index) => (
            <div key={index} className="slide">
              <div className="image-container">
                <img
                  src={slide.image}
                  alt={`Slide ${index + 1}`}
                  className="slide-image"
                />
              </div>
              <div className="slide-content">
                <h2 className="slide-title">{slide.title}</h2>
                <p className="slide-subtitle">{slide.subtitle}</p>
                <p className="slide-button">Learn More</p>
              </div>
            </div>
          ))}
        </Slider>
      {/* </div> */}
      <span className="su-cg">CG</span>
      <span className="su-hello-user">Hello, User</span>
      <span className="su-next-step-success">
        Are you ready to take next step towards success ?
      </span>
      <div className="su-rectangle-1">
        <input
          type="su-email"
          className="su-email-input"
          placeholder="Email"
          value={email}
          onChange={handleEmailChange}
          required
        />
        {emailError && <span className="su-error-icon" />}
      </div>
      <div className="su-rectangle-2">
        <input
          type={showPassword ? "text" : "password"}
          className="su-password-input"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="button"
          className="su-toggle-password"
          onClick={togglePasswordVisibility}
        >
          <span className={showPassword ? "su-eye-off" : "su-eye-on"} />
        </button>
        {passwordError && <span className="su-error-icon" />}
      </div>
      <div className="su-terms-section">
        <input
          type="checkbox"
          className="su-rectangle-3"
          checked={termsAccepted}
          onChange={(e) => setTermsAccepted(e.target.checked)}
        />
        <span className="agreeto-caasdi-global">
          I understand and agree to Caasdi Global
        </span>
        <span className="terms-and-conditions">Terms and condition</span>
      </div>
      <button className="su-rectangle-4" onClick={handleSubmit}>
        <span className="su-create-account">Create Account</span>
      </button>
      
      
      <span className="su-or">or</span>
      <div className="su-line" />
      <div className="su-line-5" />
      <button className="su-rectangle-6" onClick={handleGoogleSignIn}>
      <div className="su-google" />
      <span className="su-signup-with-google">Signup with Google</span>
    </button>
      {/* <div className="su-rectangle-7" />
      <div className="su-rectangle-8" />
      <div className="su-rectangle-9" /> */}
      <div className="su-login-section">
        <span className="already-have-an-account">Already have an account? </span>
        <span className="signup-login" onClick={handleLoginRedirect}>
          Login
        </span>
      </div>
    </div>
  );
}

export default SignUp;