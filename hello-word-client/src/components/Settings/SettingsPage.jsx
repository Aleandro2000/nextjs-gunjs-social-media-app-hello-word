import React, { useState } from "react";

const SettingSection = ({ title, children }) => (
	<div className="mb-8 p-6 bg-white rounded-lg shadow-md transform hover:scale-105 transition-transform duration-300">
		<h2 className="text-2xl font-bold text-green-600 mb-4">{title}</h2>
		{children}
	</div>
);

const ToggleSwitch = ({ label, isOn, onToggle }) => (
	<label className="flex items-center cursor-pointer">
		<div className="relative">
			<input
				type="checkbox"
				className="sr-only"
				checked={isOn}
				onChange={onToggle}
			/>
			<div
				className={`w-10 h-4 bg-gray-400 rounded-full shadow-inner ${
					isOn ? "bg-green-400" : ""
				}`}
			></div>
			<div
				className={`absolute w-6 h-6 bg-white rounded-full shadow -left-1 -top-1 transition ${
					isOn ? "transform translate-x-full bg-green-500" : ""
				}`}
			></div>
		</div>
		<div className="ml-3 text-gray-700 font-medium">{label}</div>
	</label>
);

const SettingsPage = () => {
	const [notifications, setNotifications] = useState(true);
	const [darkMode, setDarkMode] = useState(false);
	const [privacyMode, setPrivacyMode] = useState(false);

	return (
		<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<h1 className="text-4xl font-extrabold text-green-600 mb-12 text-center">
				Settings
			</h1>

			<div className="space-y-12">
				<SettingSection title="Account">
					<div className="space-y-4">
						<div>
							<label
								htmlFor="username"
								className="block text-sm font-medium text-gray-700"
							>
								Username
							</label>
							<input
								type="text"
								id="username"
								name="username"
								className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
							/>
						</div>
						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium text-gray-700"
							>
								Email
							</label>
							<input
								type="email"
								id="email"
								name="email"
								className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
							/>
						</div>
						<button className="mt-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
							Update Account
						</button>
					</div>
				</SettingSection>

				<SettingSection title="Preferences">
					<div className="space-y-4">
						<ToggleSwitch
							label="Enable Notifications"
							isOn={notifications}
							onToggle={() => setNotifications(!notifications)}
						/>
						<ToggleSwitch
							label="Dark Mode"
							isOn={darkMode}
							onToggle={() => setDarkMode(!darkMode)}
						/>
						<ToggleSwitch
							label="Enhanced Privacy Mode"
							isOn={privacyMode}
							onToggle={() => setPrivacyMode(!privacyMode)}
						/>
					</div>
				</SettingSection>

				<SettingSection title="Security">
					<div className="space-y-4">
						<button className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
							Change Password
						</button>
						<button className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500">
							Enable Two-Factor Authentication
						</button>
					</div>
				</SettingSection>

				<SettingSection title="Danger Zone">
					<div className="space-y-4">
						<button className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
							Delete Account
						</button>
					</div>
				</SettingSection>
			</div>
		</div>
	);
};

export default SettingsPage;
