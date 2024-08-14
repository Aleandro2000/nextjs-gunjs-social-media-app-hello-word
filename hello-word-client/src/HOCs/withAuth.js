import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import Navbar from "../components/Posts/components/Navbar";
import Sidebar from "../components/Posts/components/Sidebar";
import { AuthenticationContext } from "../contexts/AuthenticationContext";

const withAuth = (Component) => {
  const Auth = (props) => {
    const { authentication, user, loading } = useContext(AuthenticationContext);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
      if (!loading && !authentication) {
        router.replace("/");
      }
    }, [authentication, loading, router]);

    const toggleSidebar = () => { 
      setIsSidebarOpen(!isSidebarOpen);
    };

    if (loading) {
      return <div>Loading...</div>;
    }

    if (authentication) {
      return (
        <div className="min-h-screen bg-gray-100">
          <Navbar userPoints={user.userPoints} toggleSidebar={toggleSidebar} />
          <Sidebar isOpen={isSidebarOpen} />
          <div
            className={`pt-20 transition-all duration-300 ${
              isSidebarOpen ? "pl-64" : "pl-0"
            }`}
          >
            <Component {...props} />
          </div>
        </div>
      );
    }

    return null;
  };

  return Auth;
};

export default withAuth;
