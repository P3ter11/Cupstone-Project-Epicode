import React from 'react';
import { useState, useEffect, createContext } from 'react';

export const UserContext = createContext(null);

export default function UserContextProvider({ children }) {

  const [token, setToken] = useState(localStorage.getItem("Token") || "");
  const [authenticated, setAuthenticated] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() =>{
    setAuthenticated(token!=="");
  }, [token]);


  const value = {
    token,
    setToken,
    authenticated,
    userData,
    setUserData
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
