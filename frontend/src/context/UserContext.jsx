import { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export function UserProvider({ children }) {
  console.log("UserContext - Initializing");
  
  // Initialize currentUser from localStorage if available
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('currentUser');
      const parsedUser = savedUser ? JSON.parse(savedUser) : null;
      console.log("UserContext - Loaded user from localStorage:", parsedUser);
      return parsedUser;
    } catch (error) {
      console.error("Error loading user from localStorage:", error);
      return null;
    }
  });
  
  // Debug effect to log when currentUser changes
  useEffect(() => {
    console.log("UserContext - Current user updated:", currentUser);
  }, [currentUser]);
  
  // Function to set user and save to localStorage
  const setUser = (user) => {
    console.log("UserContext - Setting user:", user);
    setCurrentUser(user);
    
    // Save user to localStorage
    if (user) {
      try {
        localStorage.setItem('currentUser', JSON.stringify(user));
        console.log("UserContext - Saved user to localStorage");
      } catch (error) {
        console.error("Error saving user to localStorage:", error);
      }
    } else {
      localStorage.removeItem('currentUser');
      console.log("UserContext - Removed user from localStorage");
    }
  };

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser: setUser }}>
      {children}
    </UserContext.Provider>
  );
}
