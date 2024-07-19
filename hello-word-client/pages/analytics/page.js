import React from "react";
import withAuth from "../../src/HOCs/withAuth";
import AnalyticsPage from "../../src/components/Analytics/AnalyticsPage";

function Analytics() {
  return <AnalyticsPage />;
}

export default withAuth(Analytics);
