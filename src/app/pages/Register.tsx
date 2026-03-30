import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Lock, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { register } = useAuth();

  const validateUsername = (username: string): boolean => {
    // KU number format: k1234567
    const kuNumberRegex = /^k\d{7}$/i;
    // Email format: k1234567@kingston.ac.uk
    const emailRegex = /^k\d{7}@kingston\.ac\.uk$/i;
    
    return kuNumberRegex.test(username) || emailRegex.test(username);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate username format
    if (!validateUsername(username.trim())) {
      setError("Please enter a valid KU number (e.g., k1234567) or email (e.g., k1234567@kingston.ac.uk)");
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Attempt to register
    const success = register(username.trim(), password);
    
    if (success) {
      navigate("/");
    } else {
      setError("This username is already registered. Please sign in instead.");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-primary via-primary/90 to-primary/80 px-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-2xl shadow-2xl p-8">
          {/* Logo and Title */}
          <div className="flex flex-col items-center mb-8">
            {/* Custom Logo */}
            <div className="relative mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-800 to-indigo-900 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3">
                <div className="text-white">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
                    <path d="M12 8V12L14.5 14.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="12" cy="12" r="2" fill="currentColor"/>
                  </svg>
                </div>
              </div>
            </div>
            
            <h1 className="text-2xl mb-2 text-center">Create Account</h1>
            <p className="text-muted-foreground text-center">
              Sign up to start tracking your expenses
            </p>
          </div>

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block mb-2 text-foreground">
                KU Number or Email
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError("");
                  }}
                  placeholder="k1234567 or k1234567@kingston.ac.uk"
                  className="w-full pl-10 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block mb-2 text-foreground">
                Create Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="Minimum 6 characters"
                  className="w-full pl-10 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  autoComplete="new-password"
                  minLength={6}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block mb-2 text-foreground">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="Re-enter password"
                  className="w-full pl-10 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  autoComplete="new-password"
                  minLength={6}
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-3">
                <p className="text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Create Account
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}