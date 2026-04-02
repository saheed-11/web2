import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Calendar,
  UserCheck,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  ChevronRight,
  Activity,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Link } from 'react-router-dom';
import { adminService, eventService } from '../../services/authService';
import { formatDate } from '../../utils/helpers';

// Stats Card Component
const StatsCard = ({ title, value, icon: Icon, trend, trendValue, color, subtext }) => {
  const colorClasses = {
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
    red: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
  };

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
      className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{value}</p>
          {subtext && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{subtext}</p>
          )}
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${
              trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend === 'up' ? (
                <ArrowUpRight className="w-4 h-4" />
              ) : (
                <ArrowDownRight className="w-4 h-4" />
              )}
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${colorClasses[color]}`}>
          <Icon className="w-7 h-7" />
        </div>
      </div>
    </motion.div>
  );
};

// Activity Item Component
const ActivityItem = ({ activity }) => {
  const getActionIcon = (action) => {
    switch (action) {
      case 'event_created':
      case 'event_updated':
        return <Calendar className="w-4 h-4" />;
      case 'user_created':
      case 'user_role_changed':
        return <Users className="w-4 h-4" />;
      case 'certificate_uploaded':
        return <CheckCircle2 className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getActionColor = (action) => {
    if (action.includes('created')) return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
    if (action.includes('updated')) return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
    if (action.includes('deleted')) return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';
    return 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400';
  };

  return (
    <div className="flex items-start gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl transition-colors">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${getActionColor(activity.action)}`}>
        {getActionIcon(activity.action)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-900 dark:text-white">
          {activity.description}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          by {activity.user?.name || 'System'} • {formatDate(activity.createdAt)}
        </p>
      </div>
    </div>
  );
};

const CHART_COLORS = ['#0369a1', '#0ea5e9', '#38bdf8', '#7dd3fc', '#bae6fd'];

const DashboardHome = () => {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [activities, setActivities] = useState([]);
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsData, analyticsData, activityData, eventsData] = await Promise.all([
        adminService.getStats(),
        adminService.getAnalytics(),
        adminService.getActivityLogs({ limit: 5 }),
        eventService.getEvents(),
      ]);

      setStats(statsData);
      setAnalytics(analyticsData);
      setActivities(activityData.logs || []);
      setRecentEvents(eventsData.slice(0, 5));
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ieee-blue"></div>
      </div>
    );
  }

  // Format chart data
  const memberGrowthData = analytics?.memberGrowth?.map(item => ({
    month: item.month,
    members: item.count,
  })) || [];

  const registrationData = analytics?.eventRegistrations?.map(item => ({
    month: item.month,
    registrations: item.count,
  })) || [];

  const categoryData = analytics?.eventsByCategory?.map(item => ({
    name: item.category,
    value: item.count,
  })) || [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Welcome back! Here's what's happening with your chapter.
          </p>
        </div>
        <Link
          to="/admin/events"
          className="inline-flex items-center gap-2 px-4 py-2 bg-ieee-blue text-white rounded-xl hover:bg-ieee-blue-dark transition-colors shadow-lg shadow-ieee-blue/25"
        >
          <Plus className="w-4 h-4" />
          Create Event
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Members"
          value={stats?.totalUsers || 0}
          icon={Users}
          color="blue"
          trend="up"
          trendValue={`+${stats?.newUsersThisMonth || 0} this month`}
        />
        <StatsCard
          title="Total Events"
          value={stats?.totalEvents || 0}
          icon={Calendar}
          color="green"
          subtext={`${stats?.activeEvents || 0} active`}
        />
        <StatsCard
          title="Total Registrations"
          value={stats?.totalRegistrations || 0}
          icon={UserCheck}
          color="purple"
          trend="up"
          trendValue={`+${stats?.registrationsThisMonth || 0} this month`}
        />
        <StatsCard
          title="Upcoming Events"
          value={stats?.upcomingEvents || 0}
          icon={Clock}
          color="orange"
          subtext={`${stats?.ongoingEvents || 0} ongoing`}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Member Growth Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Member Growth</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">New members over time</p>
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={memberGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="members" fill="#0369a1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Registration Trends Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Registration Trends</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Event registrations over time</p>
            </div>
            <Activity className="w-5 h-5 text-ieee-blue" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={registrationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="registrations"
                  stroke="#0369a1"
                  strokeWidth={3}
                  dot={{ fill: '#0369a1', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Events by Category */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Events by Category</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Distribution of event types</p>
            </div>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {categoryData.slice(0, 4).map((item, index) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                  />
                  <span className="text-slate-600 dark:text-slate-400">{item.name}</span>
                </div>
                <span className="font-medium text-slate-900 dark:text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Events */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Events</h3>
            <Link
              to="/admin/events"
              className="text-sm text-ieee-blue hover:text-ieee-blue-dark flex items-center gap-1"
            >
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentEvents.map((event) => (
              <div
                key={event._id}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  event.status === 'completed'
                    ? 'bg-green-100 dark:bg-green-900/30'
                    : event.status === 'ongoing'
                    ? 'bg-blue-100 dark:bg-blue-900/30'
                    : 'bg-orange-100 dark:bg-orange-900/30'
                }`}>
                  <Calendar className={`w-5 h-5 ${
                    event.status === 'completed'
                      ? 'text-green-600 dark:text-green-400'
                      : event.status === 'ongoing'
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-orange-600 dark:text-orange-400'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                    {event.title}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {formatDate(event.date)} • {event.attendees?.length || 0} registered
                  </p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  event.status === 'completed'
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                    : event.status === 'ongoing'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                    : 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400'
                }`}>
                  {event.status || 'upcoming'}
                </span>
              </div>
            ))}
            {recentEvents.length === 0 && (
              <p className="text-center text-slate-500 dark:text-slate-400 py-4">
                No events yet
              </p>
            )}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Activity</h3>
          </div>
          <div className="space-y-1">
            {activities.length > 0 ? (
              activities.map((activity) => (
                <ActivityItem key={activity._id} activity={activity} />
              ))
            ) : (
              <p className="text-center text-slate-500 dark:text-slate-400 py-4">
                No recent activity
              </p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-ieee-blue to-ieee-blue-dark rounded-2xl p-6 text-white"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold">Attendance Rate</h3>
            <p className="text-white/80 mt-1">Overall event attendance performance</p>
          </div>
          <div className="flex items-center gap-8">
            <div className="text-center">
              <p className="text-4xl font-bold">{analytics?.attendanceRate || 0}%</p>
              <p className="text-sm text-white/80">Attendance Rate</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold">{stats?.completedEvents || 0}</p>
              <p className="text-sm text-white/80">Events Completed</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold">{stats?.totalAdmins || 0}</p>
              <p className="text-sm text-white/80">Admins</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardHome;
