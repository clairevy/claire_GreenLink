// src/routes/AppRouter.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";

// Public Pages
import PublicLayout from "../layouts/PublicLayout";
import HomePage from "../pages/public/HomePage";
import HTXPage from "../pages/public/HTXPage";
import AboutPage from "../pages/public/AboutPage";
import LoginPage from "../pages/public/LoginPage.jsx";
import RegisterPage from "../pages/public/RegisterPage.jsx";
import TraceabilityPage from "../pages/public/TraceabilityPage";
import CooperativeProfile from "../pages/public/CooperativeProfile";
import ProcessPage from "../pages/public/ProcessPage";

// Buyer Pages
import BuyerLayout from "../layouts/BuyerLayout";
import BuyerDashboard from "../pages/buyer/BuyerDashboard";
import BuyerPosts from "../pages/buyer/BuyerPosts";
import BuyerOrders from "../pages/buyer/BuyerOrders";

// Cooperative Pages
import CooperativeLayout from "../layouts/CooperativeLayout";
import CoopDashboard from "../pages/cooperative/CoopDashboard";
import CoopOrders from "../pages/cooperative/CoopOrders";
import CoopPosts from "../pages/cooperative/CoopPosts";
import CoopProduct from "../pages/cooperative/CoopProduct";
import CoopReports from "../pages/cooperative/CoopReports";

// Supplier Pages
import SupplierLayout from "../layouts/SupplierLayout";
import SupplierDashboard from "../pages/supplier/SupplierDashboard";
import SupplierOrders from "../pages/supplier/SupplierOrders";
import SupplierHistory from "../pages/supplier/SupplierHistory";

// Error Pages
import NotFoundPage from "../pages/NotFoundPage";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* ========== PUBLIC ROUTES ========== */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="htx" element={<HTXPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="trace" element={<TraceabilityPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="cooperatives/:id" element={<CooperativeProfile />} />
          <Route path="process" element={<ProcessPage />} />
        </Route>

        {/* ========== BUYER ROUTES ========== */}
        <Route
          path="/buyer"
          element={
            <PrivateRoute allowedRoles={["buyer"]}>
              <BuyerLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="/buyer/dashboard" replace />} />
          <Route path="dashboard" element={<BuyerDashboard />} />
          <Route path="posts" element={<BuyerPosts />} />
          <Route path="orders" element={<BuyerOrders />} />
        </Route>

        {/* ========== COOPERATIVE ROUTES ========== */}
        <Route
          path="/cooperative"
          element={
            <PrivateRoute allowedRoles={["cooperative"]}>
              <CooperativeLayout />
            </PrivateRoute>
          }
        >
          <Route
            index
            element={<Navigate to="/cooperative/dashboard" replace />}
          />
          <Route path="dashboard" element={<CoopDashboard />} />
          <Route path="orders" element={<CoopOrders />} />
          <Route path="posts" element={<CoopPosts />} />
          <Route path="product" element={<CoopProduct />} />
          <Route path="reports" element={<CoopReports />} />
        </Route>

        {/* ========== SUPPLIER ROUTES ========== */}
        <Route
          path="/supplier"
          element={
            <PrivateRoute allowedRoles={["supplier"]}>
              <SupplierLayout />
            </PrivateRoute>
          }
        >
          <Route
            index
            element={<Navigate to="/supplier/dashboard" replace />}
          />
          <Route path="dashboard" element={<SupplierDashboard />} />
          <Route path="orders" element={<SupplierOrders />} />
          <Route path="history" element={<SupplierHistory />} />
        </Route>

        {/* ========== ERROR ROUTES ========== */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
