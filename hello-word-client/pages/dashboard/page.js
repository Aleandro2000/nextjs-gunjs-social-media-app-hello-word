import React from "react";
import withAuth from "../../src/HOCs/withAuth";
import DashboardPage from "../../src/components/Dashboard/DashboardPage";

function Dashboard() {
  return <DashboardPage />;
}

export default withAuth(Dashboard);
