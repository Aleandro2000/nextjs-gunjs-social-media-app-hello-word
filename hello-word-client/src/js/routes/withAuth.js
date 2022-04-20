import React from "react";
import { useRouter } from "next/router";
import { SessionStorage } from "../utils";

const withAuth = Component => {
    const Auth = (props) => {
        const router = useRouter();
  
        if (!SessionStorage.getItem("username") && typeof window !== "undefined")
            router.push("/login");
  
        return (
            <Component {...props} />
        );
    };
  
    if (Component.getInitialProps)
        Auth.getInitialProps = Component.getInitialProps;
  
    return Auth;
};
  
export default withAuth;