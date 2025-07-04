import React, { useState, useEffect } from "react";

const NewChatForm = ({ onChat }) => {
  const [postContent, setPostContent] = useState("");
  const [postImage, setPostImage] = useState(null);
  const [scheduleDate, setScheduleDate] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  useEffect(() => {
    setScheduleDate(new Date().toISOString().slice(0, 16));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (postContent.trim()) {
      onChat({
        content: postContent,
        image: postImage,
        scheduleDate,
        isAnonymous,
      });
      setPostContent("");
      setPostImage(null);
      setScheduleDate(new Date().toISOString().slice(0, 16));
      setIsAnonymous(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">
        Start a Conversation
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          rows="3"
        />
        <div className="flex items-center space-x-4">
          <input
            type="file"
            onChange={(e) => setPostImage(e.target.files[0])}
            className="text-sm cursor-pointer text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
          />
          <input
            type="datetime-local"
            value={scheduleDate}
            onChange={(e) => setScheduleDate(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="anonymous"
            checked={isAnonymous}
            onChange={() => setIsAnonymous(!isAnonymous)}
            className="mr-2"
          />
          <label htmlFor="anonymous" className="text-sm text-gray-700">
            Send anonymously
          </label>
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 rounded-full bg-green-600 text-white hover:bg-green-700 transition-colors duration-200"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default NewChatForm;
