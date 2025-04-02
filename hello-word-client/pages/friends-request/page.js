import React from "react";
import withAuth from "../../src/HOCs/withAuth";
import FriendsRequestPage from "../../src/components/FriendsRequest/FriendsRequestPage";

function FriendsRequest() {
  return <FriendsRequestPage />;
}

export default withAuth(FriendsRequest);
