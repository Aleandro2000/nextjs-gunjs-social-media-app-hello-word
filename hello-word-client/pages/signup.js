import React from "react";
import SignUp from "../src/components/SignUp/SignUp";
import withAuth from "../src/HOCs/withAuth";

function Signup() {
  return <SignUp />;
}

export default withAuth(Signup);
