import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("nexus_token"));
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("nexus_user");

    return stored ? JSON.parse(stored) : null;
  });



  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem("nexus_token", authToken);
    localStorage.setItem("nexus_user", JSON.stringify(userData));
  };
  
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("nexus_token");
    localStorage.removeItem("nexus_user");
  };


  return (
    <AuthContext.Provider value={{ user, token, login, logout }} >
      {children}
    </AuthContext.Provider>
  );
};


// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);