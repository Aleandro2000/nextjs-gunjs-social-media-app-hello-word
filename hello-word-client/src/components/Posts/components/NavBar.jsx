import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { AuthenticationContext } from "../../../contexts/AuthenticationContext";

const Navbar = ({ userPoints, toggleSidebar }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { logout, removeAccount } = useContext(AuthenticationContext);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleLogout = () => {
    logout();
    router.replace("/");
  };

  const handleRemoveAccount = () => {
    removeAccount();
    router.replace("/");
  };

  return (
    <nav
      className={`fixed w-full transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      } bg-white shadow-md z-50`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="mr-4 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <h1 className="text-2xl font-bold text-green-600">Hello Word!</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-green-600">
              Your Points: {userPoints ?? 0}
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-full bg-green-600 text-white hover:bg-green-700 transition-colors duration-200"
            >
              Logout
            </button>
            <button
              onClick={handleRemoveAccount}
              className="px-4 py-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors duration-200"
            >
              Remove Account
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
