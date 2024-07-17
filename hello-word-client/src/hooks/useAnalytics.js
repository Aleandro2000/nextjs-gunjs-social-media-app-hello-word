// src/hooks/useAnalytics.js
import { useCallback, useContext, useEffect, useState } from "react";
import { AuthenticationContext } from "../contexts/AuthenticationContext";

export const useAnalytics = () => {
	const { gun } = useContext(AuthenticationContext);
	const [analytics, setAnalytics] = useState(null);

	const fetchAnalytics = useCallback(() => {
		if (!gun) return;

		const analyticsRef = gun.get("analytics");

		analyticsRef.on((data) => {
			if (data) {
				setAnalytics((prevAnalytics) => ({
					...prevAnalytics,
					totalPosts: data.totalPosts,
					activeUsers: data.activeUsers,
					averagePointsPerPost: data.averagePointsPerPost,
					totalEngagement: data.totalEngagement,
					totalPostsChange: data.totalPostsChange,
					averagePointsPerPostChange: data.averagePointsPerPostChange,
					totalEngagementChange: data.totalEngagementChange,
				}));
			}
		});

		// Fetch post activity
		analyticsRef
			.get("postActivity")
			.map()
			.on((activity, id) => {
				if (activity) {
					setAnalytics((prevAnalytics) => ({
						...prevAnalytics,
						postActivity: [
							...(prevAnalytics?.postActivity || []),
							{ id, ...activity },
						],
					}));
				}
			});

		// Fetch engagement breakdown
		analyticsRef
			.get("engagementBreakdown")
			.map()
			.on((engagement, id) => {
				if (engagement) {
					setAnalytics((prevAnalytics) => ({
						...prevAnalytics,
						engagementBreakdown: [
							...(prevAnalytics?.engagementBreakdown || []),
							{ id, ...engagement },
						],
					}));
				}
			});

		// Fetch top performing posts
		analyticsRef
			.get("topPerformingPosts")
			.map()
			.on((post, id) => {
				if (post) {
					setAnalytics((prevAnalytics) => ({
						...prevAnalytics,
						topPerformingPosts: [
							...(prevAnalytics?.topPerformingPosts || []),
							{ id, ...post },
						],
					}));
				}
			});

		// Fetch trending topics
		analyticsRef
			.get("trendingTopics")
			.map()
			.on((topic, id) => {
				if (topic) {
					setAnalytics((prevAnalytics) => ({
						...prevAnalytics,
						trendingTopics: [
							...(prevAnalytics?.trendingTopics || []),
							{ id, ...topic },
						],
					}));
				}
			});

		return () => {
			analyticsRef.off();
			analyticsRef.get("postActivity").map().off();
			analyticsRef.get("engagementBreakdown").map().off();
			analyticsRef.get("topPerformingPosts").map().off();
			analyticsRef.get("trendingTopics").map().off();
		};
	}, [gun]);

	const fetchUserAnalytics = useCallback(
		(username) => {
			console.log("Fetching analytics for username:", username);
			if (!gun || !username)
				return Promise.reject("Invalid gun instance or username");

			return new Promise((resolve, reject) => {
				gun
					.get(`user_analytics`)
					.get(username)
					.once((data) => {
						console.log("Raw user analytics data:", data);
						if (data) {
							resolve({
								points: data.points || 0,
								totalPosts: data.totalPosts || 0,
								rank: data.rank || 0,
								pointsHistory: data.pointsHistory || [],
								recentActivity: data.recentActivity || [],
							});
						} else {
							console.log(
								"No existing user analytics found. Creating default data."
							);
							const defaultData = {
								points: 0,
								totalPosts: 0,
								rank: 0,
								pointsHistory: [],
								recentActivity: [],
							};
							gun.get(`user_analytics`).get(username).put(defaultData);
							resolve(defaultData);
						}
					});
			});
		},
		[gun]
	);

	const updateAnalytics = useCallback(
		(type, data) => {
			if (!gun) return;

			const analyticsRef = gun.get("analytics");

			switch (type) {
				case "newPost":
					analyticsRef.get("totalPosts").once((val) => {
						const newTotal = (val || 0) + 1;
						analyticsRef.get("totalPosts").put(newTotal);
						analyticsRef
							.get("totalPostsChange")
							.put((((newTotal - val) / val) * 100).toFixed(2));
					});
					break;
				case "newUser":
					analyticsRef.get("activeUsers").once((val) => {
						const newTotal = (val || 0) + 1;
						analyticsRef.get("activeUsers").put(newTotal);
					});
					break;
				case "newEngagement":
					analyticsRef.get("totalEngagement").once((val) => {
						const newTotal = (val || 0) + 1;
						analyticsRef.get("totalEngagement").put(newTotal);
						analyticsRef
							.get("totalEngagementChange")
							.put((((newTotal - val) / val) * 100).toFixed(2));
					});
					analyticsRef
						.get("engagementBreakdown")
						.get(data.type)
						.once((val) => {
							analyticsRef
								.get("engagementBreakdown")
								.get(data.type)
								.put((val || 0) + 1);
						});
					break;
				case "updatePostActivity":
					analyticsRef.get("postActivity").once((activities) => {
						const updatedActivities = activities || [];
						const todayIndex = updatedActivities.findIndex(
							(a) => a.date === data.date
						);
						if (todayIndex !== -1) {
							updatedActivities[todayIndex].posts += 1;
						} else {
							updatedActivities.push({ date: data.date, posts: 1 });
						}
						// Keep only the last 7 days
						const sortedActivities = updatedActivities
							.sort((a, b) => new Date(b.date) - new Date(a.date))
							.slice(0, 7);
						analyticsRef.get("postActivity").put(sortedActivities);
					});
					break;
				case "updatePostPoints":
					analyticsRef.get("averagePointsPerPost").once((avg) => {
						analyticsRef.get("totalPosts").once((totalPosts) => {
							const newAverage =
								((avg || 0) * totalPosts + data.points) / totalPosts;
							analyticsRef.get("averagePointsPerPost").put(newAverage);
							analyticsRef
								.get("averagePointsPerPostChange")
								.put((((newAverage - avg) / avg) * 100).toFixed(2));
						});
					});
					// Update top performing posts
					analyticsRef.get("topPerformingPosts").once((topPosts) => {
						let updatedTopPosts = topPosts || [];
						const existingIndex = updatedTopPosts.findIndex(
							(post) => post.id === data.postId
						);
						if (existingIndex !== -1) {
							updatedTopPosts[existingIndex].points = data.newTotalPoints;
						} else {
							updatedTopPosts.push({
								id: data.postId,
								title: data.title,
								points: data.newTotalPoints,
							});
						}
						updatedTopPosts.sort((a, b) => b.points - a.points);
						updatedTopPosts = updatedTopPosts.slice(0, 5); // Keep only top 5
						analyticsRef.get("topPerformingPosts").put(updatedTopPosts);
					});
					break;
				case "updateUserAnalytics":
					gun.get("user_analytics").get(data.username).put({
						points: data.points,
						totalPosts: data.totalPosts,
						rank: data.rank,
						pointsHistory: data.pointsHistory,
						recentActivity: data.recentActivity,
					});
					break;
				default:
					console.error("Unknown analytics update type:", type);
			}
		},
		[gun]
	);

	useEffect(() => {
		fetchAnalytics();
	}, [fetchAnalytics]);

	return {
		analytics,
		fetchAnalytics,
		fetchUserAnalytics,
		updateAnalytics,
	};
};
