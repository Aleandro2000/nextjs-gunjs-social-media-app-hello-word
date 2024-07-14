import React, { useContext, useEffect } from "react";
import { AuthenticationContext } from "../contexts/AuthenticationContext";
import { useRouter } from "next/router";

const withAuth = (Component) => {
  const Auth = (props) => {
    const [authentication] = useContext(AuthenticationContext);
    const router = useRouter();

    useEffect(() => {
      if (!authentication) router.replace("/");
    }, [authentication, router]);

    return <Component {...props} />;
  };

  return Auth;
};

export default withAuth;
