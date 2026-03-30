import { createContext, useContext, useState, ReactNode } from "react";

interface User {
  username: string; // KU number or email
  password: string;
}

interface AuthContextType {
  userEmail: string;
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  register: (username: string, password: string) => boolean;
  logout: () => void;
  changePassword: (currentPassword: string, newPassword: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userEmail, setUserEmail] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  const register = (username: string, password: string): boolean => {
    // Check if user already exists
    if (users.find((u) => u.username === username)) {
      return false;
    }

    // Add new user
    setUsers([...users, { username, password }]);
    return true;
  };

  const login = (username: string, password: string): boolean => {
    // Find user and verify password
    const user = users.find((u) => u.username === username && u.password === password);
    
    if (user) {
      setUserEmail(user.username);
      setIsAuthenticated(true);
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUserEmail("");
    setIsAuthenticated(false);
  };

  const changePassword = (currentPassword: string, newPassword: string): boolean => {
    // Find user and verify current password
    const userIndex = users.findIndex((u) => u.username === userEmail && u.password === currentPassword);
    
    if (userIndex !== -1) {
      // Update user password
      const updatedUsers = [...users];
      updatedUsers[userIndex].password = newPassword;
      setUsers(updatedUsers);
      return true;
    }
    
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        userEmail,
        isAuthenticated,
        login,
        register,
        logout,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}