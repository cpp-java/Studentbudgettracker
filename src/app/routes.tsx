import { createBrowserRouter } from "react-router";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Expenses } from "./pages/Expenses";
import { Income } from "./pages/Income";
import { Budgets } from "./pages/Budgets";
import { Analytics } from "./pages/Analytics";
import { Settings } from "./pages/Settings";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Login,
  },
  {
    path: "/register",
    Component: Register,
  },
  {
    path: "/",
    Component: Layout,
    children: [
      {
        path: "dashboard",
        Component: Dashboard,
      },
      {
        path: "expenses",
        Component: Expenses,
      },
      {
        path: "income",
        Component: Income,
      },
      {
        path: "budgets",
        Component: Budgets,
      },
      {
        path: "analytics",
        Component: Analytics,
      },
      {
        path: "settings",
        Component: Settings,
      },
    ],
  },
]);