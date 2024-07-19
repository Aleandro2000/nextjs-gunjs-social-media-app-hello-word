import { useAnalytics } from "../hooks/useAnalytics";

export const useAnalyticsFunctions = () => {
  const { updateAnalytics } = useAnalytics();

  const recordNewPost = (username, postId, title) => {
    updateAnalytics("newPost");
    updateAnalytics("updateUserAnalytics", {
      username,
      totalPosts: (prevTotalPosts) => prevTotalPosts + 1,
    });
    updateAnalytics("updatePostPoints", {
      postId,
      title,
      points: 0,
      newTotalPoints: 0,
    });
    updateAnalytics("updatePostActivity", {
      date: new Date().toISOString().split("T")[0],
    });
  };

  const recordEngagement = (
    type,
    username,
    points,
    postId,
    postTitle,
    newTotalPoints
  ) => {
    updateAnalytics("newEngagement", { type });
    updateAnalytics("updateUserAnalytics", {
      username,
      points: (prevPoints) => prevPoints + points,
      recentActivity: (prevActivity) => [
        { action: `Received ${type}`, points, timestamp: Date.now() },
        ...prevActivity.slice(0, 9), // Keep only the 10 most recent activities
      ],
    });
    updateAnalytics("updatePostPoints", {
      postId,
      title: postTitle,
      points,
      newTotalPoints,
    });
  };

  const recordNewUser = () => {
    updateAnalytics("newUser");
  };

  const updatePostPoints = (postId, title, points, newTotalPoints) => {
    updateAnalytics("updatePostPoints", {
      postId,
      title,
      points,
      newTotalPoints,
    });
  };

  const updateUserRank = (username, newRank) => {
    updateAnalytics("updateUserAnalytics", {
      username,
      rank: newRank,
    });
  };

  const recordPointsHistory = (username, points) => {
    updateAnalytics("updateUserAnalytics", {
      username,
      pointsHistory: (prevHistory) =>
        [
          ...prevHistory,
          { date: new Date().toISOString().split("T")[0], points },
        ].slice(-30), // Keep only the last 30 days
    });
  };

  return {
    recordNewPost,
    recordNewUser,
    recordEngagement,
    updatePostPoints,
    updateUserRank,
    recordPointsHistory,
  };
};
