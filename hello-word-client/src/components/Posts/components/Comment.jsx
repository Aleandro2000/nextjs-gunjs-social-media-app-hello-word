import React from "react";

const Comment = ({ author, content, timestamp }) => (
  <div className="bg-gray-50 rounded-lg p-3 mb-2">
    <div className="flex justify-between items-center mb-2">
      <span className="font-medium text-gray-700">{author}</span>
      <span className="text-xs text-gray-500">
        Posted: {new Date(timestamp).toLocaleString()}
      </span>
    </div>
    <p className="text-gray-600">{content}</p>
  </div>
);

export default Comment;
