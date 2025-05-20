import React, { useState, useRef, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Auth } from "aws-amplify";
import "../styles/SignUp.css";
import { VendorContext } from "../context/VendorContext";

function Verification() {
  const [codeDigits, setCodeDigits] = useState(["", "", "", "", "", ""]);
  const [codeError, setCodeError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { email } = location.state || {};
  const inputRefs = useRef([]);
  const { setUser: setContextUser } = useContext(VendorContext);

  useEffect(() => {
    const checkAuthAndState = async () => {
      try {
        // Check if user is already authenticated
        const user = await Auth.currentAuthenticatedUser();
        if (user) {
          // If user is already authenticated, they don't need verification
          // But we'll let them stay on this page to complete verification
          console.log("User is already authenticated, but allowing verification");
        }
      } catch (error) {
        // User is not authenticated
        if (!email) {
          // If no email is provided in state, redirect to signup
          console.log("No email provided, redirecting to signup");
          navigate("/signup", { replace: true });
        }
      }
    };
    checkAuthAndState();

    // Prevent going back
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = () => {
      window.history.pushState(null, "", window.location.href);
      // Don't redirect to home, just stay on this page
    };

    // Cleanup function
    return () => {
      window.onpopstate = null;
    };
  }, [navigate, email]);

  const handleChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newCodeDigits = [...codeDigits];
    newCodeDigits[index] = value;
    setCodeDigits(newCodeDigits);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !codeDigits[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();

    const code = codeDigits.join("");

    if (!code || code.length !== 6) {
      setCodeError("Please enter a 6-digit verification code.");
      return;
    }

    if (!email) {
      alert("Please enter your email id");
      setCodeError("Email is missing. Please go back and sign up again.");
      return;
    }

    try {
      console.log("Verifying user with email:", email, "and code:", code);
      await Auth.confirmSignUp(email, code);
      console.log("Verification successful");
      
      try {
        // Get the stored encrypted password
        const storedEncryptedPassword = localStorage.getItem(`temp_password_${email}`);
        
        if (!storedEncryptedPassword) {
          console.error("No stored password found for auto-login");
          alert("Account verified! Please log in with your credentials.");
          navigate("/login", { state: { email }, replace: true });
          return;
        }
        
        // Decrypt the password (decode from Base64)
        const password = atob(storedEncryptedPassword);
        
        console.log("Attempting auto-login after verification");
        
        // After successful verification, sign in the user
        const user = await Auth.signIn(email, password);
        
        // Create a user object for the context
        const userData = {
          id: user.username || email,
          email: user.attributes?.email || email,
          name: user.attributes?.name || email.split('@')[0]
        };
        
        // Update the context with the authenticated user data
        setContextUser(userData);
        
        // Create a vendor record in the database to ensure they appear in the auditor dashboard
        try {
          const response = await fetch('http://localhost:5001/api/vendor/create-user', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: email,
              name: email.split('@')[0],
              status: 'pending',
              hasFilledForm: false,
              role: 'vendor'
            }),
          });
          
          const data = await response.json();
          console.log("Created vendor record:", data);
        } catch (createError) {
          console.error("Error creating vendor record:", createError);
        }
        
        // Clear any temporary password
        localStorage.removeItem(`temp_password_${email}`);
        
        alert("Account verified! Please proceed with filling up the form.");
        navigate("/Form1", { state: { email }, replace: true });
      } catch (signInError) {
        console.error("Error signing in after verification:", signInError);
        // If sign-in fails, redirect to login page
        alert("Account verified! Please log in with your credentials.");
        navigate("/login", { state: { email }, replace: true });
      }
    } catch (error) {
      console.error("Error verifying code:", error);
      if (error.code === "CodeMismatchException") {
        alert("Incorrect code, please check and try again");
        setCodeError("Invalid verification code provided, please try again.");
      } else if (error.code === "NotAuthorizedException") {
        setCodeError("User is already verified or not authorized. Please proceed to login.");
        navigate("/Form1", { state: { email }, replace: true });
      } else if (error.code === "UserNotFoundException") {
        alert("User not found, please signup again");
        setCodeError("User not found. Please sign up again.");
      } else {
        setCodeError(error.message || "An error occurred during verification.");
      }
    }
  };

  return (
    <div className="main-container">
      <div className="rectangle" />
      <span className="su-cg">CG</span>
      <span className="whats-new">what’s new?</span>
      <span className="hello-user">Verify Your Account</span>
      <span className="next-step-success">
        Enter the verification code sent to {email || "your email"}
      </span>

      <div className="code-input-container">
        {codeDigits.map((digit, index) => (
          <input
            key={index}
            type="text"
            className="code-input-box"
            maxLength="1"
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            ref={(el) => (inputRefs.current[index] = el)}
            required
          />
        ))}
      </div>

      {codeError && (
        <div className="error-container">
          <span className="error-message">{codeError}</span>
          <span className="error-icon" />
        </div>
      )}

      <button className="su-rectangle-4" onClick={handleVerify}>
        <span className="create-account">Verify</span>
      </button>

      <span className="vendor-project-management">
        Vendor and project management
      </span>
      <span className="smart-vendor-match">
        Offers smart vendor matching, private tendering, dedicated project
        managers, CRM & task management, forecasting & analytics, and
        end-to-end project support. While currently managed manually, we
        are developing an AI-driven SaaS platform to enhance efficiency and
        automation.
      </span>
    </div>
  );
}

export default Verification;