import React, { useContext, useState } from "react";
import { AuthenticationContext } from "../../../contexts/AuthenticationContext";
import { useAnalyticsFunctions } from "../../../utils/analyticsFunctions";
import Comment from "./Comment";
import PostModal from "./PostModal";

const Post = ({ post, onVote }) => {
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);
  const { authentication, gun } = useContext(AuthenticationContext);
  const { recordEngagement } = useAnalyticsFunctions();

  const truncatedContent =
    post.content.length > 200
      ? post.content.slice(0, 200) + "..."
      : post.content;

  const handleEdit = () => {
    if (post.author !== authentication.username) {
      alert("You can only edit your own posts.");
      return;
    }
    gun
      .get("posts")
      .get(post.id)
      .put({ content: editedContent, updatedAt: Date.now() });
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (post.author !== authentication.username) {
      alert("You can only delete your own posts.");
      return;
    }
    gun.get("posts").get(post.id).put(null);
    gun.get("posts_comments").get(post.id).put(null);
  };

  const handleAddComment = (commentContent) => {
    if (!authentication.username) {
      console.error("Username not available");
      return;
    }
    const commentId = Gun.text.random();
    const newComment = {
      author: authentication.username,
      content: commentContent,
      timestamp: Date.now(),
    };

    gun.get("posts_comments").get(post.id).get(commentId).put(newComment);
  };

  const handleVote = (voteType) => {
    const currentVote = post.userVote;
    let pointsChange = 0;

    if (currentVote === voteType) {
      pointsChange = voteType === "up" ? -1 : 1;
    } else {
      pointsChange = voteType === "up" ? 1 : -1;
      if (currentVote) {
        pointsChange *= 2;
      }
    }

    const newTotalPoints = post.points + pointsChange;

    gun
      .get("posts")
      .get(post.id)
      .put({
        points: newTotalPoints,
        userVote: currentVote === voteType ? null : voteType,
      });

    recordEngagement(
      voteType === "up" ? "upvote" : "downvote",
      authentication.username,
      pointsChange,
      post.id,
      post.content,
      newTotalPoints
    );

    onVote(post.id, voteType);
  };

  const comments = post.comments ? Object.values(post.comments) : [];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-start mb-4">
        <h4
          className="text-lg font-semibold text-gray-800 cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          Post by {post.author || "Anonymous"}
        </h4>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleVote("up")}
            className={`p-1 rounded ${
              post.userVote === "up"
                ? "bg-green-100 text-green-600"
                : "text-gray-400 hover:text-green-600"
            }`}
          >
            ▲
          </button>
          <span className="font-medium text-gray-600">{post.points}</span>
          <button
            onClick={() => handleVote("down")}
            className={`p-1 rounded ${
              post.userVote === "down"
                ? "bg-red-100 text-red-600"
                : "text-gray-400 hover:text-red-600"
            }`}
          >
            ▼
          </button>
        </div>
      </div>
      {isEditing ? (
        <input
          type="text"
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 mb-2"
        />
      ) : (
        <p className="text-gray-600 mb-4">{truncatedContent}</p>
      )}
      <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
        <span>Posted: {new Date(post.createdAt).toLocaleString()}</span>
        {post.updatedAt && (
          <span>Updated: {new Date(post.updatedAt).toLocaleString()}</span>
        )}
      </div>
      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => setIsCommentsOpen(!isCommentsOpen)}
          className="text-green-600 hover:text-green-700 transition-colors duration-200"
        >
          {isCommentsOpen
            ? "Hide Comments"
            : `Show Comments (${comments ? comments.length : 0})`}
        </button>
        {post.author === authentication.username && (
          <>
            {isEditing ? (
              <button
                onClick={handleEdit}
                className="text-blue-600 hover:text-blue-700 transition-colors duration-200"
              >
                Save
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="text-blue-600 hover:text-blue-700 transition-colors duration-200"
              >
                Edit
              </button>
            )}
            <button
              onClick={handleDelete}
              className="text-red-600 hover:text-red-700 transition-colors duration-200"
            >
              Delete
            </button>
          </>
        )}
      </div>
      <div
        className={`mt-4 space-y-4 overflow-hidden transition-max-height duration-300 ease-in-out ${
          isCommentsOpen ? "max-h-[1000px]" : "max-h-0"
        }`}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const comment = e.target.elements.comment.value;
            if (comment.trim()) {
              handleAddComment(comment);
              e.target.reset();
            }
          }}
          className="mb-4"
        >
          <input
            name="comment"
            type="text"
            placeholder="Add a comment..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit"
            className="mt-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors duration-200"
          >
            Add Comment
          </button>
        </form>
        {comments.map((comment, index) => (
          <Comment key={index} {...comment} />
        ))}
      </div>
      <PostModal
        post={{ ...post, comments }}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onVote={handleVote}
        onAddComment={handleAddComment}
      />
    </div>
  );
};

export default Post;
