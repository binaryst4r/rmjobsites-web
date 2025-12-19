import { NavLink, Outlet } from "react-router-dom";

export const AccountLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Navigation */}
      <div className="hidden md:block bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <NavLink
              to="/account/my-account"
              className={({ isActive }) =>
                `py-4 px-1 border-b-2 font-medium text-sm ${
                  isActive
                    ? "border-red-800 text-red-800"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`
              }
            >
              My Account
            </NavLink>
            <NavLink
              to="/account/orders"
              className={({ isActive }) =>
                `py-4 px-1 border-b-2 font-medium text-sm ${
                  isActive
                    ? "border-red-800 text-red-800"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`
              }
            >
              Order History
            </NavLink>
          </nav>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden bg-white border-b">
        <div className="px-4">
          <nav className="flex space-x-4">
            <NavLink
              to="/account/my-account"
              className={({ isActive }) =>
                `py-3 px-1 border-b-2 font-medium text-sm flex-1 text-center ${
                  isActive
                    ? "border-red-800 text-red-800"
                    : "border-transparent text-gray-500"
                }`
              }
            >
              My Account
            </NavLink>
            <NavLink
              to="/account/orders"
              className={({ isActive }) =>
                `py-3 px-1 border-b-2 font-medium text-sm flex-1 text-center ${
                  isActive
                    ? "border-red-800 text-red-800"
                    : "border-transparent text-gray-500"
                }`
              }
            >
              Orders
            </NavLink>
          </nav>
        </div>
      </div>

      <Outlet />
    </div>
  );
};
