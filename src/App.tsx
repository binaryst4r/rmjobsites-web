import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./lib/auth-context";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Navbar } from "./components/Navbar";
import { Account } from "./pages/Account";
import { MyAccount } from "./pages/account/MyAccount";
import { OrderHistory } from "./pages/account/OrderHistory";
import { AppProviders } from "./components/AppProviders";
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

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <AppProviders>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<CategoryList />} />
          <Route path="/shop/category/:categoryId" element={<ProductsByCategory />} />
          <Route path="/shop/product/:productId" element={<ProductDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

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
    </AppProviders>
  );
}

export default App;
