import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import EmployeeListPage from "./pages/EmployeeListPage";
import AddEmployeePage from "./pages/AddEmployeePage";
import EmployeeDetailPage from "./pages/EmployeeDetailPage";
import AIRecommendationsPage from "./pages/AIRecommendationsPage";

const Layout = ({ children }) => (
  <>
    <Navbar />
    <main>{children}</main>
  </>
);

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "var(--card)",
              color: "var(--text)",
              border: "1px solid var(--border)",
              fontFamily: "var(--font-body)",
              fontSize: "14px",
            },
          }}
        />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route path="/dashboard" element={
            <ProtectedRoute><Layout><DashboardPage /></Layout></ProtectedRoute>
          } />
          <Route path="/employees" element={
            <ProtectedRoute><Layout><EmployeeListPage /></Layout></ProtectedRoute>
          } />
          <Route path="/add-employee" element={
            <ProtectedRoute><Layout><AddEmployeePage /></Layout></ProtectedRoute>
          } />
          <Route path="/employees/:id" element={
            <ProtectedRoute><Layout><EmployeeDetailPage /></Layout></ProtectedRoute>
          } />
          <Route path="/ai-recommendations" element={
            <ProtectedRoute><Layout><AIRecommendationsPage /></Layout></ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
