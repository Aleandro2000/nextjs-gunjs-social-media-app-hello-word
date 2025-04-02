import React from "react";

const FilterBar = ({ onFilterChange, activeFilter }) => (
  <div className="mb-6 flex justify-between items-center">
    <div className="space-x-4">
      {["all", "my", "recent"].map((filterType) => (
        <button
          key={filterType}
          onClick={() => onFilterChange(filterType)}
          className={`px-4 py-2 rounded-lg ${
            activeFilter === filterType
              ? "bg-green-500 text-white"
              : "bg-green-100 text-green-700 hover:bg-green-200"
          } transition-colors duration-200`}
        >
          {filterType === "all"
            ? "All Chats"
            : filterType === "my"
              ? "My Chats"
              : "Recent"}
        </button>
      ))}
    </div>
    <input
      type="text"
      placeholder="Search chats..."
      className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
      onChange={(e) => onFilterChange("search", e.target.value)}
    />
  </div>
);

export default FilterBar;
