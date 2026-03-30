import { RouterProvider } from "react-router";
import { router } from "./routes";
import { AuthProvider } from "./context/AuthContext";
import { ExpenseProvider } from "./context/ExpenseContext";

export default function App() {
  return (
    <AuthProvider>
      <ExpenseProvider>
        <RouterProvider router={router} />
      </ExpenseProvider>
    </AuthProvider>
  );
}