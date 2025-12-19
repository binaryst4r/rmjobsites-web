import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../lib/auth-context";
import { useCategories } from "../lib/categories-context";
import { useCart } from "../lib/cart-context";
import { MagnifyingGlassIcon, UserIcon } from "@heroicons/react/24/solid";
import { ShoppingBagIcon } from "@heroicons/react/24/solid";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { api } from "../lib/api";
import type { Product } from "../types/Product";
import { formatCentsToDollars } from "../lib/money";

export const Navbar = () => {
  const { user } = useAuth();
  const { categories } = useCategories();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mobile search states
  const [mobileSearchQuery, setMobileSearchQuery] = useState("");
  const [mobileSearchResults, setMobileSearchResults] = useState<Product[]>([]);
  const [isMobileSearching, setIsMobileSearching] = useState(false);

  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    const timeoutId = setTimeout(async () => {
      try {
        const response = await api.searchProducts(searchQuery);
        setSearchResults(response.products || []);
      } catch (error) {
        console.error("Search failed:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
        setSearchQuery("");
        setSearchResults([]);
      }
    };

    if (isSearchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isSearchOpen]);

  // Escape key to close
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsSearchOpen(false);
        setSearchQuery("");
        setSearchResults([]);
      }
    };

    if (isSearchOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isSearchOpen]);

  // Auto-focus input when search opens
  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Mobile search debouncing
  useEffect(() => {
    if (!mobileSearchQuery.trim()) {
      setMobileSearchResults([]);
      return;
    }

    setIsMobileSearching(true);
    const timeoutId = setTimeout(async () => {
      try {
        const response = await api.searchProducts(mobileSearchQuery);
        setMobileSearchResults(response.products || []);
      } catch (error) {
        console.error("Mobile search failed:", error);
        setMobileSearchResults([]);
      } finally {
        setIsMobileSearching(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [mobileSearchQuery]);

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isSearchOpen) {
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  const handleResultClick = (productId: string) => {
    setIsSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
    navigate(`/products/${productId}`);
  };

  const handleMobileResultClick = (productId: string) => {
    setMobileSearchQuery("");
    setMobileSearchResults([]);
    setIsMobileMenuOpen(false);
    navigate(`/products/${productId}`);
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setMobileSearchQuery("");
    setMobileSearchResults([]);
  };

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      {!user && (
        <div className="w-full bg-red-900 h-9 text-white text-xs">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex gap-4 justify-end items-center h-full">
            <Link to="/login">Sign In</Link>

            <Link to="/register">Create Account</Link>
          </div>
        </div>
      )}
      <nav className="relative bg-white border-b border-gray-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-center items-center relative">
            {/* Desktop Logo - Left */}
            <div className="hidden sm:flex absolute left-0">
              <div className="flex shrink-0 items-center">
                <img
                  alt="Your Company"
                  src="/rm-logo.png"
                  className="h-8 w-auto"
                />
              </div>
            </div>

            {/* Mobile Logo - Center */}
            <div className="flex sm:hidden">
              <img
                alt="Your Company"
                src="/rm-logo.png"
                className="h-8 w-auto"
              />
            </div>
            {/* Center section - Nav Links or Search */}
            <div
              className="hidden sm:ml-6 sm:flex sm:items-center relative"
              ref={searchRef}
            >
              {!isSearchOpen ? (
                <div className="flex space-x-8">
                  <Link
                    to="/shop"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900"
                  >
                    Shop Products
                  </Link>
                  <Link
                    to="/request-service"
                    className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  >
                    Request Service
                  </Link>
                  <Link
                    to="/rent-equipment"
                    className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  >
                    Rent Equipment
                  </Link>
                </div>
              ) : (
                <div className="relative w-96">
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <MagnifyingGlassIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </div>
                    <input
                      ref={inputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="block w-full rounded-md border-0 py-2 pl-10 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-900 sm:text-sm"
                      placeholder="Search products..."
                    />
                    <button
                      onClick={handleSearchToggle}
                      className="absolute inset-y-0 right-0 flex items-center pr-3"
                    >
                      <XMarkIcon
                        className="h-5 w-5 text-gray-400 hover:text-gray-600"
                        aria-hidden="true"
                      />
                    </button>
                  </div>

                  {/* Search Results Dropdown */}
                  {(searchQuery.trim() || isSearching) && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white shadow-lg rounded-md border border-gray-200 max-h-96 overflow-y-auto z-50">
                      {isSearching ? (
                        <div className="px-4 py-3 text-sm text-gray-500">
                          Searching...
                        </div>
                      ) : searchResults.length > 0 ? (
                        <div className="py-2">
                          {searchResults.map((product) => (
                            <button
                              key={product.id}
                              onClick={() => handleResultClick(product.id)}
                              className="w-full px-4 py-3 hover:bg-gray-50 flex items-center justify-between text-left transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">💡</span>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">
                                    {product.name}
                                    {product.variations[0]?.name && (
                                      <span className="text-gray-500 ml-1">
                                        ({product.variations[0].name})
                                      </span>
                                    )}
                                  </p>
                                </div>
                              </div>
                              <div className="text-sm font-semibold text-gray-900">
                                $
                                {formatCentsToDollars(
                                  product.variations[0]?.price_money?.amount ||
                                    0
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      ) : searchQuery.trim() ? (
                        <div className="px-4 py-3 text-sm text-gray-500">
                          No products found
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center absolute right-0">
              <button
                type="button"
                onClick={handleSearchToggle}
                className="relative rounded-full p-1 text-black hover:text-gray-800 focus:outline-2 focus:outline-offset-2 focus:outline-red-900"
              >
                <span className="absolute -inset-1.5" />
                <span className="sr-only">Search</span>
                <MagnifyingGlassIcon aria-hidden="true" className="size-6" />
              </button>

              {/* Profile dropdown */}
              {user && (
                <Menu as="div" className="relative ml-3">
                  <MenuButton className="relative flex rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">Open user menu</span>
                    <UserIcon aria-hidden="true" className="size-6" />
                  </MenuButton>

                  <MenuItems
                    transition
                    className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg outline outline-black/5 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                  >
                    <MenuItem>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                      >
                        Your profile
                      </a>
                    </MenuItem>
                    <MenuItem>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                      >
                        Settings
                      </a>
                    </MenuItem>
                    {user.admin && (
                      <MenuItem>
                        <Link
                          to="/admin/service-requests"
                          className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                        >
                          View Service Requests
                        </Link>
                      </MenuItem>
                    )}
                    {user.admin && (
                      <MenuItem>
                        <Link
                          to="/admin/rental-requests"
                          className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                        >
                          View Rental Requests
                        </Link>
                      </MenuItem>
                    )}
                    <MenuItem>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                      >
                        Sign out
                      </a>
                    </MenuItem>
                  </MenuItems>
                </Menu>
              )}
              <Link
                to="/cart"
                className="relative rounded-full p-1 text-black hover:text-gray-800 focus:outline-2 focus:outline-offset-2 focus:outline-red-900 ml-3"
              >
                <span className="absolute -inset-1.5" />
                <span className="sr-only">Shopping cart</span>
                <ShoppingBagIcon aria-hidden="true" className="size-6" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-900 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {itemCount}
                  </span>
                )}
              </Link>
            </div>
            {/* Mobile Left - Menu Button */}
            <div className="absolute left-0 flex items-center sm:hidden">
              <button
                onClick={handleMobileMenuToggle}
                className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-2 focus:-outline-offset-1 focus:outline-indigo-600"
              >
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open main menu</span>
                <Bars3Icon aria-hidden="true" className="block size-6" />
              </button>
            </div>

            {/* Mobile Right - Shopping Bag */}
            <div className="absolute right-0 flex items-center sm:hidden">
              <Link
                to="/cart"
                className="relative rounded-full p-2 text-black hover:text-gray-800 focus:outline-2 focus:outline-offset-2 focus:outline-red-900"
              >
                <span className="absolute -inset-1.5" />
                <span className="sr-only">Shopping cart</span>
                <ShoppingBagIcon aria-hidden="true" className="size-6" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-900 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {itemCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      <>
        {/* Backdrop */}
        <div
          className={`fixed inset-0 bg-black z-40 sm:hidden transition-opacity duration-300 ease-in-out ${
            isMobileMenuOpen ? "opacity-50" : "opacity-0 pointer-events-none"
          }`}
          onClick={closeMobileMenu}
        />

        {/* Drawer Panel */}
        <div
          className={`fixed top-0 left-0 h-screen w-4/5 bg-white z-50 transform transition-transform duration-300 ease-in-out sm:hidden flex flex-col ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 shrink-0">
            <button
              onClick={closeMobileMenu}
              className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
            <img alt="Your Company" src="/rm-logo.png" className="h-8 w-auto" />
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-4 pt-4 pb-3 space-y-4">
            {/* Mobile Search Section */}
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlassIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </div>
              <input
                type="text"
                value={mobileSearchQuery}
                onChange={(e) => setMobileSearchQuery(e.target.value)}
                className="block w-full rounded-md border-2 border-blue-600 py-2.5 pl-10 pr-3 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
                placeholder="Find Product"
              />
            </div>

            {/* Mobile Search Results */}
            {(mobileSearchQuery.trim() || isMobileSearching) && (
              <div className="bg-gray-50 rounded-md">
                {isMobileSearching ? (
                  <div className="px-4 py-3 text-sm text-gray-500">
                    Searching...
                  </div>
                ) : mobileSearchResults.length > 0 ? (
                  <div>
                    <p className="px-4 pt-3 pb-2 text-sm text-gray-500">
                      Results:
                    </p>
                    <div className="space-y-2 pb-3">
                      {mobileSearchResults.map((product) => (
                        <button
                          key={product.id}
                          onClick={() => handleMobileResultClick(product.id)}
                          className="w-full px-4 py-3 bg-white hover:bg-gray-100 flex items-center gap-3 text-left transition-colors"
                        >
                          <div className="w-12 h-12 bg-yellow-100 rounded flex items-center justify-center flex-shrink-0">
                            <span className="text-2xl">💡</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {product.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              $
                              {formatCentsToDollars(
                                product.variations[0]?.price_money?.amount || 0
                              )}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : mobileSearchQuery.trim() ? (
                  <div className="px-4 py-3 text-sm text-gray-500">
                    No products found
                  </div>
                ) : null}
              </div>
            )}

            {/* Categories Section */}
            <div className="pt-2">
              <h3 className="text-xs font-semibold text-gray-900 mb-2">
                Categories
              </h3>
              <div className="space-y-0 divide-y divide-gray-200">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    to={`/shop/category/${category.id}`}
                    onClick={closeMobileMenu}
                    className="block py-3 text-xs text-gray-900 hover:bg-gray-50 transition-colors"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-2 p-4">
            <Link
              to="/shop"
              onClick={closeMobileMenu}
              className="block text-xs font-medium text-gray-900"
            >
              Shop
            </Link>
            <Link
              to="/request-service"
              onClick={closeMobileMenu}
              className="block text-xs font-medium text-gray-900"
            >
              Request Service
            </Link>
            <Link
              to="/rent-equipment"
              onClick={closeMobileMenu}
              className="block text-xs font-medium text-gray-900"
            >
              Rent Equipment
            </Link>
          </div>

          {/* Admin Section */}
          {user && user.admin && (
            <div className="border-t border-gray-200 px-4 pt-4 pb-2">
              <h3 className="text-xs font-semibold text-gray-900 mb-2">
                Admin
              </h3>
              <div className="space-y-2">
                <Link
                  to="/admin/service-requests"
                  onClick={closeMobileMenu}
                  className="block text-xs font-medium text-gray-900"
                >
                  View Service Requests
                </Link>
                <Link
                  to="/admin/rental-requests"
                  onClick={closeMobileMenu}
                  className="block text-xs font-medium text-gray-900"
                >
                  View Rental Requests
                </Link>
              </div>
            </div>
          )}

          {/* Authentication Links - Fixed at Bottom */}
          {!user && (
            <div className="border-t border-gray-200 p-4 shrink-0 space-y-2">
              <Link
                to="/login"
                onClick={closeMobileMenu}
                className="block text-xs font-medium text-gray-900"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={closeMobileMenu}
                className="block text-xs font-medium text-gray-900"
              >
                Create Account
              </Link>
            </div>
          )}
        </div>
      </>
    </>
  );
};
