import { Outlet, NavLink, useNavigate } from "react-router";
import { Home, BarChart3, Receipt, PiggyBank, Wallet, Settings } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

export function Layout() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="h-screen flex flex-col bg-background max-w-md mx-auto">
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-slate-200 shadow-lg">
        <div className="flex justify-around py-3">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
                isActive
                  ? "text-blue-500"
                  : "text-slate-400"
              }`
            }
          >
            <Home className="w-6 h-6" />
            <span className="text-xs">Home</span>
          </NavLink>

          <NavLink
            to="/expenses"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
                isActive
                  ? "text-blue-500"
                  : "text-slate-400"
              }`
            }
          >
            <Receipt className="w-6 h-6" />
            <span className="text-xs">Expenses</span>
          </NavLink>

          <NavLink
            to="/analytics"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
                isActive
                  ? "text-blue-500"
                  : "text-slate-400"
              }`
            }
          >
            <BarChart3 className="w-6 h-6" />
            <span className="text-xs">Analytics</span>
          </NavLink>

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
                isActive
                  ? "text-blue-500"
                  : "text-slate-400"
              }`
            }
          >
            <Settings className="w-6 h-6" />
            <span className="text-xs">Settings</span>
          </NavLink>
        </div>
      </nav>
    </div>
  );
}