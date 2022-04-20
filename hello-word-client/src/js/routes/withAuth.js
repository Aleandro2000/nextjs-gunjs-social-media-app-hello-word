import React from "react";
import LoginComponent from "../components/Login/LoginComponent";

const withAuth = Component => {
    const Auth = (props) => {
        const { isLoggedIn } = props;
  
        if (!isLoggedIn) {
            return (
                <LoginComponent />
            );
        }
  
        return (
            <Component {...props} />
        );
    };
  
    if (Component.getInitialProps) {
        Auth.getInitialProps = Component.getInitialProps;
    }
  
    return Auth;
};
  
export default withAuth;