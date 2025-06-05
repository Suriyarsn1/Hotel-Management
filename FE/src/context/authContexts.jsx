import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

// Create the Auth context
export const Authcontext = createContext();

function AuthProvider({ children }) {
  // State for user, token, and userId
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const navigate=useNavigate()

  //get token from localStorage 
  useEffect(() => {
    const getToken = localStorage.getItem("token");
    if (getToken) {
      setToken(getToken);
    }
  }, []);

  //  check if token exists and is expired, remove if expired
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken && isTokenExpired(storedToken)) {
      localStorage.removeItem('token');
    }
  }, []);

  // get user from localStorage and set in state
  useEffect(() => {
    const storeUser = localStorage.getItem('user');
    if (storeUser) {
      setUser(JSON.parse(storeUser));
    } else {
      setUser(null);
    }
  }, [token]);

  //  get userId from localStorage and set in state
  useEffect(() => {
    const storeUserId = localStorage.getItem('userId');
    setUserId(storeUserId ? storeUserId : null);
  }, [token]);

  // Logout function
  const Logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    setUser(null);
    setToken(null);
    setUserId(null);
    navigate('/')
  };

 // check if JWT token is expired
  const isTokenExpired = (token) => {
    if (!token) return true;
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (e) {
      return true;
    }
  };

  // Provide auth state 
  return (
    <Authcontext.Provider value={{ Logout, user, token, userId }}>
      {children}
    </Authcontext.Provider>
  );
}

export default AuthProvider;
