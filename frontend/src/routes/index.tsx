import { createBrowserRouter, Navigate } from "react-router-dom";

// Layouts
import { PublicLayout } from "../layouts/PublicLayout";
import { AdminLayout } from "../layouts/AdminLayout";
import { ProtectedRoute } from "../auth/ProtectedRoute";

// Public Pages
import { HomePage } from "../pages/HomePage";
import { AboutPage } from "../pages/AboutPage";
import { ProductsPage } from "../pages/ProductsPage";
import { ProductDetailPage } from "../pages/ProductDetailPage";
import { ServicesPage } from "../pages/ServicesPage";
import { RequestQuotePage } from "../pages/RequestQuotePage";
import { CustomizedRequirementPage } from "../pages/CustomizedRequirementPage";
import { ContactPage } from "../pages/ContactPage";
import { NotFoundPage } from "../pages/NotFoundPage";

// Admin Pages
import { AdminLoginPage } from "../pages/admin/AdminLoginPage";
import { AdminDashboardPage } from "../pages/admin/AdminDashboardPage";
import { AdminProductsPage } from "../pages/admin/AdminProductsPage";
import { AdminProductFormPage } from "../pages/admin/AdminProductFormPage";
import { AdminEnquiriesPage } from "../pages/admin/AdminEnquiriesPage";
import { AdminEnquiryDetailPage } from "../pages/admin/AdminEnquiryDetailPage";
import { AdminServicesPage } from "../pages/admin/AdminServicesPage";
import { AdminContentPage } from "../pages/admin/AdminContentPage";
import { AdminSettingsPage } from "../pages/admin/AdminSettingsPage";

export const router = createBrowserRouter([
  // Public Website Routes
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "about", element: <AboutPage /> },
      { path: "products", element: <ProductsPage /> },
      { path: "products/:slug", element: <ProductDetailPage /> },
      { path: "services", element: <ServicesPage /> },
      { path: "request-quote", element: <RequestQuotePage /> },
      { path: "customized-requirement", element: <CustomizedRequirementPage /> },
      { path: "contact", element: <ContactPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },

  // Admin Authentication Route
  {
    path: "/admin/login",
    element: <AdminLoginPage />,
  },

  // Protected Admin Routes
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      { path: "dashboard", element: <AdminDashboardPage /> },
      { path: "products", element: <AdminProductsPage /> },
      { path: "products/new", element: <AdminProductFormPage /> },
      { path: "products/:id/edit", element: <AdminProductFormPage /> },
      { path: "enquiries", element: <AdminEnquiriesPage /> },
      { path: "enquiries/:id", element: <AdminEnquiryDetailPage /> },
      { path: "services", element: <AdminServicesPage /> },
      { path: "content", element: <AdminContentPage /> },
      { path: "settings", element: <AdminSettingsPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },

  // Catch-all Fallback
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

export default router;
