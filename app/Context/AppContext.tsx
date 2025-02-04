import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

axios.defaults.withCredentials = true;

type AuthContextType = {
  user: { username: string; accesskey: string } | null;
  setUser: React.Dispatch<React.SetStateAction<{ username: string; accesskey: string } | null>>;
};
type User = {
    username: string;
    accesskey: string;
  } | null;
  
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null);

  useEffect(() => {
    // Check if user is authenticated on app start
    axios.get("http://10.0.2.2:5030/api/UsersAPI/CheckSession")
      .then((response) => {
        if (response.data.isAuthenticated) {
          setUser({
            username: response.data.username,
            accesskey: response.data.accesskey,
          });
        }
      })
      .catch(() => setUser(null));
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext