import React, { useEffect, useState } from "react";
import Comment from "./Comment";

const ChatModal = ({ chat, isOpen, onClose, onVote, onAddComment }) => {
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }

    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [isOpen]);

  const handleAddComment = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(chat.id, newComment);
      setNewComment("");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="p-6 overflow-y-auto"
          style={{ maxHeight: "calc(90vh - 4rem)" }}
        >
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold">chat #{chat.id}</h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onVote(chat.id, "up")}
                className={`p-1 rounded ${
                  chat.userVote === "up"
                    ? "bg-green-100 text-green-600"
                    : "text-gray-400 hover:text-green-600"
                }`}
              >
                ▲
              </button>
              <span className="font-medium text-gray-600">{chat.points}</span>
              <button
                onClick={() => onVote(chat.id, "down")}
                className={`p-1 rounded ${
                  chat.userVote === "down"
                    ? "bg-red-100 text-red-600"
                    : "text-gray-400 hover:text-red-600"
                }`}
              >
                ▼
              </button>
            </div>
          </div>
          <p className="text-gray-700 mb-4">{chat.content}</p>
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-500">
              {chat.author || "Anonymous"}
            </span>
            <span className="text-sm text-gray-500">
              {new Date(chat.createdAt).toLocaleString()}
            </span>
          </div>
          <h3 className="text-xl font-semibold mb-4">Chat</h3>
          <form onSubmit={handleAddComment} className="mb-6">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              type="submit"
              className="mt-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors duration-200"
            >
              Send
            </button>
          </form>
          {chat.comments &&
            chat.comments.map((comment, index) => (
              <Comment key={index} {...comment} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
