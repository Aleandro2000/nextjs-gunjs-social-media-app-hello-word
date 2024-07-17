import React from "react";
import withAuth from "../../src/HOCs/withAuth";
import SettingsPage from "../../src/components/Settings/SettingsPage";

function Settings() {
	return <SettingsPage />;
}

export default withAuth(Settings);
