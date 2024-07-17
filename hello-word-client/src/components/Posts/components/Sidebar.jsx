import { useRouter } from "next/router";
import React from "react";

const Sidebar = ({ isOpen }) => {
	const router = useRouter();

	const menuItems = [
		{ name: "Dashboard", path: "/dashboard/page" },
		{ name: "Posts", path: "/posts/page" },
		{ name: "Analytics", path: "/analytics/page" },
		{ name: "Settings", path: "/settings/page" },
	];

	const handleNavigation = (path) => {
		router.push(path);
	};

	return (
		<div
			className={`fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-40 pt-20 transform transition-transform duration-300 ${
				isOpen ? "translate-x-0" : "-translate-x-full"
			}`}
		>
			<div className="p-5 space-y-4">
				{menuItems.map((item) => (
					<button
						key={item.name}
						onClick={() => handleNavigation(item.path)}
						className={`w-full text-left py-2 px-4 rounded transition-colors duration-200 ${
							router.pathname === item.path
								? "bg-green-100 text-green-700"
								: "text-gray-700 hover:bg-green-100"
						}`}
					>
						{item.name}
					</button>
				))}
			</div>
		</div>
	);
};

export default Sidebar;
