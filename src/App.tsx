import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./lib/auth-context";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { Navbar } from "./components/Navbar";
import { Account } from "./pages/Account";
import { MyAccount } from "./pages/account/MyAccount";
import { OrderHistory } from "./pages/account/OrderHistory";
import { CategoryList } from "./pages/CategoryList";
import { ProductsByCategory } from "./pages/ProductsByCategory";
import { ProductDetails } from "./pages/ProductDetails";
import { ServiceRequest } from "./pages/ServiceRequest";
import EquipmentRental from "./pages/EquipmentRental";
import { RequireAdmin } from "./components/RequireAdmin";
import { AdminServiceRequests } from "./pages/admin/ServiceRequests";
import { AdminRentalRequests } from "./pages/admin/RentalRequests";
import { Cart } from "./pages/Cart";
import { Checkout } from "./pages/Checkout";
import { OrderConfirmation } from "./pages/OrderConfirmation";
import Notification from "./components/Notification";
import { LandingPage } from "./pages/marketing/LandingPage";
import { AboutPage } from "./pages/marketing/AboutPage";
import { ContactPage } from "./pages/marketing/ContactPage";
import { ProjectsPage } from "./pages/marketing/ProjectsPage";
import { ServicesPage } from "./pages/marketing/ServicesPage";

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      <Navbar />
      <Notification />
      <Routes>
        {/* Marketing Pages */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/dashboard" element={<Home />} />

        {/* Shop Routes */}
        <Route path="/shop" element={<CategoryList />} />
        <Route path="/shop/category/:categoryId" element={<ProductsByCategory />} />
        <Route path="/shop/product/:productId" element={<ProductDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Account Routes with Nested Routing */}
        <Route path="/account" element={<Account />}>
          <Route index element={<Navigate to="/account/my-account" replace />} />
          <Route path="my-account" element={<MyAccount />} />
          <Route path="orders" element={<OrderHistory />} />
        </Route>

        <Route path="/request-service" element={<ServiceRequest />} />
        <Route path="/rent-equipment" element={<EquipmentRental />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />

        {/* Admin Routes */}
        <Route
          path="/admin/service-requests"
          element={
            <RequireAdmin>
              <AdminServiceRequests />
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/rental-requests"
          element={
            <RequireAdmin>
              <AdminRentalRequests />
            </RequireAdmin>
          }
        />

        <Route path="*" element={<Navigate to={isAuthenticated ? "/account" : "/login"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
