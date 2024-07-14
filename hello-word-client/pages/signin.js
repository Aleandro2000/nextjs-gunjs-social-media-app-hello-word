import React from "react";
import SignIn from "../src/components/SignIn/SignIn";
import withAuth from "../src/HOCs/withAuth";

function Signin() {
  return <SignIn />;
}

export default withAuth(Signin);
