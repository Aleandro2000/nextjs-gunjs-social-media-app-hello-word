import React, { useContext, useEffect, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AuthenticationContext } from "../../contexts/AuthenticationContext";
import { useAnalytics } from "../../hooks/useAnalytics";

const StatCard = ({ title, value, icon }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
      </div>
      <div className="text-green-500 text-2xl">{icon}</div>
    </div>
  </div>
);

const TrendingTopic = ({ topic, posts }) => (
  <div className="flex items-center justify-between py-2">
    <span className="text-sm font-medium text-gray-600">#{topic}</span>
    <span className="text-xs font-medium text-gray-500">{posts} posts</span>
  </div>
);

const DashboardPage = () => {
  const { authentication } = useContext(AuthenticationContext);
  const { analytics, fetchUserAnalytics } = useAnalytics();
  const [userAnalytics, setUserAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (authentication && authentication.username) {
        try {
          const data = await fetchUserAnalytics(authentication.username);
          setUserAnalytics(data);
        } catch (error) {
          console.error("Error fetching user analytics:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [authentication, fetchUserAnalytics]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userAnalytics) {
    return <div>Error loading user analytics. Please try again later.</div>;
  }

  const visibilityStatus =
    userAnalytics.points >= 0 ? "Visible to All" : "Shadow Banned";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {/* User Points and Status */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Your Status
        </h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              Current Points
            </p>
            <p className="text-4xl font-bold text-green-600">
              {userAnalytics.points}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              Visibility Status
            </p>
            <p
              className={`text-lg font-semibold ${
                userAnalytics.points >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {visibilityStatus}
            </p>
          </div>
        </div>
      </div>

      {/* Points History Chart */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Points History
        </h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={userAnalytics.pointsHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="points"
                stroke="#10B981"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Posts"
          value={userAnalytics.totalPosts}
          icon="📝"
        />
        <StatCard
          title="Active Users"
          value={analytics.activeUsers}
          icon="👥"
        />
        <StatCard
          title="Your Rank"
          value={`#${userAnalytics.rank}`}
          icon="🏆"
        />
      </div>

      {/* Trending Topics */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Trending Topics
        </h2>
        <div className="space-y-2">
          {analytics?.trendingTopics?.map((topic, index) => (
            <TrendingTopic
              key={index}
              topic={topic.topic}
              posts={topic.posts}
            />
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Recent Activity
        </h2>
        <ul className="space-y-4">
          {userAnalytics.recentActivity.map((activity, index) => (
            <li key={index} className="flex justify-between items-center">
              <span className="text-sm text-gray-600">{activity.action}</span>
              <span className="text-sm font-semibold text-green-600">
                +{activity.points} points
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DashboardPage;
