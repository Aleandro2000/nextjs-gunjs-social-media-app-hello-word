import React, { useEffect, useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAnalytics } from "../../hooks/useAnalytics";

const StatCard = ({ title, value, change }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-3xl font-bold text-gray-900 mb-2">{value || 0}</p>
    {change !== undefined && !isNaN(change) ? (
      <p
        className={`text-sm font-medium ${
          change >= 0 ? "text-green-600" : "text-red-600"
        }`}
      >
        {change >= 0 ? "↑" : "↓"} {Math.abs(change)}% from last week
      </p>
    ) : (
      <p className="text-sm font-medium text-gray-500">
        No change data available
      </p>
    )}
  </div>
);

const AnalyticsPage = () => {
  const { analytics, fetchAnalytics } = useAnalytics();

  console.log("analytics", analytics);
  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const processedEngagementData = useMemo(() => {
    if (!analytics || !analytics.engagementBreakdown) return [];

    const counts = analytics.engagementBreakdown.reduce((acc, item) => {
      acc[item.id] = (acc[item.id] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [analytics]);

  if (!analytics) {
    return <div>Loading...</div>;
  }

  const COLORS = ["#10B981", "#EF4444", "#3B82F6"];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Analytics</h1>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Posts"
          value={analytics.totalPosts}
          change={analytics.totalPostsChange}
        />
        <StatCard
          title="Average Points per Post"
          value={analytics.averagePointsPerPost?.toFixed(1)}
          change={analytics.averagePointsPerPostChange}
        />
        <StatCard
          title="Total Engagement"
          value={analytics.totalEngagement}
          change={analytics.totalEngagementChange}
        />
      </div>

      {/* Post Activity */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Post Activity (Last 7 Days)
        </h2>
        <div className="h-64">
          {analytics.postActivity && analytics.postActivity.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.postActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="posts" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p>No post activity data available</p>
          )}
        </div>
      </div>

      {/* Engagement Breakdown */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Engagement Breakdown
        </h2>
        <div className="h-64">
          {processedEngagementData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={processedEngagementData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {processedEngagementData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p>No engagement breakdown data available</p>
          )}
        </div>
      </div>

      {/* Top Performing Posts */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Top Performing Posts
        </h2>
        {analytics.topPerformingPosts &&
        analytics.topPerformingPosts.length > 0 ? (
            <ul className="space-y-4">
              {analytics.topPerformingPosts.map((post, index) => (
                <li key={index} className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">
                    {post.title}
                  </span>
                  <span className="text-sm font-semibold text-green-600">
                    {post.points} points
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No top performing posts data available</p>
          )}
      </div>
    </div>
  );
};

export default AnalyticsPage;
