import React, { useContext } from "react";
import Signin from "../../pages/signin";
import { AuthenticationContext } from "../contexts/AuthenticationContext";

const withAuth = Component => {
    const Auth = (props) => {
        const [authentication] = useContext(AuthenticationContext);
  
        if (!authentication)
            return <Signin />;
  
        return (
            <Component {...props} />
        );
    };
  
    return Auth;
};
  
export default withAuth;