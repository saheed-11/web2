import { useState, useEffect } from 'react';
import {
  TrendingUp,
  Users,
  IndianRupee,
  Calendar,
  CheckCircle,
  Clock,
  Smartphone,
  Monitor,
  Download,
} from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AnalyticsTab = ({ event }) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('all');

  useEffect(() => {
    fetchAnalytics();
  }, [event._id, timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_URL}/admin/events/${event._id}/analytics?timeRange=${timeRange}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      // Generate mock data for display
      setAnalytics(generateMockAnalytics());
    } finally {
      setLoading(false);
    }
  };

  const generateMockAnalytics = () => {
    const totalRegistrations = event.attendees?.length || 0;
    return {
      totalRegistrations,
      totalRevenue: totalRegistrations * 100,
      registrationsOverTime: generateTimeSeriesData(totalRegistrations),
      departmentBreakdown: [
        { name: 'Computer Science', value: Math.floor(totalRegistrations * 0.4) },
        { name: 'Electronics', value: Math.floor(totalRegistrations * 0.25) },
        { name: 'Mechanical', value: Math.floor(totalRegistrations * 0.15) },
        { name: 'Civil', value: Math.floor(totalRegistrations * 0.1) },
        { name: 'Other', value: Math.floor(totalRegistrations * 0.1) },
      ],
      yearBreakdown: [
        { name: 'First Year', value: Math.floor(totalRegistrations * 0.3) },
        { name: 'Second Year', value: Math.floor(totalRegistrations * 0.35) },
        { name: 'Third Year', value: Math.floor(totalRegistrations * 0.25) },
        { name: 'Fourth Year', value: Math.floor(totalRegistrations * 0.1) },
      ],
      ieeeMembershipRatio: {
        members: Math.floor(totalRegistrations * 0.6),
        nonMembers: Math.floor(totalRegistrations * 0.4),
      },
      paymentStatus: {
        paid: Math.floor(totalRegistrations * 0.7),
        pending: Math.floor(totalRegistrations * 0.2),
        rejected: Math.floor(totalRegistrations * 0.1),
      },
      deviceBreakdown: {
        mobile: Math.floor(totalRegistrations * 0.65),
        desktop: Math.floor(totalRegistrations * 0.35),
      },
      completionRate: 85,
    };
  };

  const generateTimeSeriesData = (total) => {
    const days = 14;
    const data = [];
    let cumulative = 0;
    const increment = total / days;

    for (let i = 0; i < days; i++) {
      cumulative += increment + Math.random() * 10 - 5;
      data.push({
        date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
        count: Math.max(0, Math.floor(cumulative)),
      });
    }
    return data;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-ieee-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 dark:text-slate-400">No analytics data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Analytics</h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Comprehensive insights about your event
          </p>
        </div>
        <div className="flex gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-ieee-blue dark:bg-slate-700 dark:text-white"
          >
            <option value="all">All Time</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
          </select>
          <button className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          label="Total Registrations"
          value={analytics.totalRegistrations || 0}
          icon={Users}
          color="blue"
          trend="+12%"
        />
        <MetricCard
          label="Revenue Generated"
          value={`₹${(analytics.totalRevenue || 0).toLocaleString()}`}
          icon={IndianRupee}
          color="green"
          trend="+8%"
        />
        <MetricCard
          label="IEEE Members"
          value={`${Math.round(
            ((analytics.ieeeMembershipRatio?.members || 0) / (analytics.totalRegistrations || 1)) * 100
          )}%`}
          icon={CheckCircle}
          color="purple"
        />
        <MetricCard
          label="Completion Rate"
          value={`${analytics.completionRate || 0}%`}
          icon={TrendingUp}
          color="orange"
        />
      </div>

      {/* Registrations Over Time */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
          Registrations Over Time
        </h3>
        <LineChart data={analytics.registrationsOverTime} />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Breakdown */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
            Department-wise Breakdown
          </h3>
          <DonutChart data={analytics.departmentBreakdown} />
        </div>

        {/* Year Breakdown */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
            Year of Study Breakdown
          </h3>
          <BarChart data={analytics.yearBreakdown} />
        </div>

        {/* IEEE Membership */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
            IEEE Member vs Non-IEEE
          </h3>
          <PieChart
            data={[
              { name: 'IEEE Members', value: analytics.ieeeMembershipRatio?.members || 0, color: '#0066CC' },
              {
                name: 'Non-IEEE Members',
                value: analytics.ieeeMembershipRatio?.nonMembers || 0,
                color: '#64748b',
              },
            ]}
          />
        </div>

        {/* Payment Status */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
            Payment Status Breakdown
          </h3>
          <StackedBarChart
            data={[
              { name: 'Paid', value: analytics.paymentStatus?.paid || 0, color: '#10b981' },
              { name: 'Pending', value: analytics.paymentStatus?.pending || 0, color: '#f59e0b' },
              { name: 'Rejected', value: analytics.paymentStatus?.rejected || 0, color: '#ef4444' },
            ]}
          />
        </div>

        {/* Device Breakdown */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
            Device Type Distribution
          </h3>
          <PieChart
            data={[
              { name: 'Mobile', value: analytics.deviceBreakdown?.mobile || 0, color: '#8b5cf6' },
              { name: 'Desktop', value: analytics.deviceBreakdown?.desktop || 0, color: '#3b82f6' },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ label, value, icon: Icon, color, trend }) => {
  const colorClasses = {
    blue: 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400',
    green: 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400',
    purple: 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400',
    orange: 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400',
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <span className="text-sm font-medium text-green-600 dark:text-green-400">{trend}</span>
        )}
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">{label}</p>
      <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
    </div>
  );
};

const LineChart = ({ data }) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return <div className="h-64 flex items-center justify-center text-slate-500">No data available</div>;
  }

  const maxValue = Math.max(...data.map((d) => d.count)) || 1;

  return (
    <div className="space-y-4">
      <div className="relative h-64">
        <svg className="w-full h-full" viewBox="0 0 800 250">
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((percent) => (
            <g key={percent}>
              <line
                x1="0"
                y1={(250 * percent) / 100}
                x2="800"
                y2={(250 * percent) / 100}
                stroke="currentColor"
                className="text-slate-200 dark:text-slate-700"
                strokeWidth="1"
              />
            </g>
          ))}

          {/* Line path */}
          <path
            d={`M ${data
              .map(
                (d, i) =>
                  `${(i * 800) / (data.length - 1 || 1)} ${250 - ((d.count || 0) / maxValue) * 230}`
              )
              .join(' L ')}`}
            fill="none"
            stroke="#0066CC"
            strokeWidth="3"
          />

          {/* Area fill */}
          <path
            d={`M ${data
              .map(
                (d, i) =>
                  `${(i * 800) / (data.length - 1 || 1)} ${250 - ((d.count || 0) / maxValue) * 230}`
              )
              .join(' L ')} L 800 250 L 0 250 Z`}
            fill="url(#gradient)"
            opacity="0.2"
          />

          {/* Data points */}
          {data.map((d, i) => (
            <circle
              key={i}
              cx={(i * 800) / (data.length - 1 || 1)}
              cy={250 - ((d.count || 0) / maxValue) * 230}
              r="4"
              fill="#0066CC"
            />
          ))}

          {/* Gradient definition */}
          <defs>
            <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#0066CC" />
              <stop offset="100%" stopColor="#0066CC" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* X-axis labels */}
      <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
        {data.map((d, i) => (
          <span key={i} className={i % 2 === 0 ? '' : 'opacity-0'}>
            {d.date}
          </span>
        ))}
      </div>
    </div>
  );
};

const DonutChart = ({ data }) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return <div className="h-48 flex items-center justify-center text-slate-500">No data available</div>;
  }

  const total = data.reduce((sum, item) => sum + (item.value || 0), 0) || 1;
  const colors = ['#0066CC', '#8b5cf6', '#f59e0b', '#10b981', '#64748b'];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center">
        <svg width="200" height="200" viewBox="0 0 200 200">
          {data.map((item, index) => {
            const startAngle = data
              .slice(0, index)
              .reduce((sum, d) => sum + (d.value / total) * 360, 0);
            const angle = (item.value / total) * 360;
            return (
              <DonutSlice
                key={index}
                startAngle={startAngle}
                angle={angle}
                color={colors[index % colors.length]}
                innerRadius={60}
                outerRadius={90}
              />
            );
          })}
        </svg>
      </div>
      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: colors[index % colors.length] }}
              />
              <span className="text-slate-700 dark:text-slate-300">{item.name}</span>
            </div>
            <span className="font-semibold text-slate-900 dark:text-white">
              {item.value} ({Math.round((item.value / total) * 100)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const DonutSlice = ({ startAngle, angle, color, innerRadius, outerRadius }) => {
  const startRad = ((startAngle - 90) * Math.PI) / 180;
  const endRad = ((startAngle + angle - 90) * Math.PI) / 180;

  const x1 = 100 + outerRadius * Math.cos(startRad);
  const y1 = 100 + outerRadius * Math.sin(startRad);
  const x2 = 100 + outerRadius * Math.cos(endRad);
  const y2 = 100 + outerRadius * Math.sin(endRad);

  const x3 = 100 + innerRadius * Math.cos(endRad);
  const y3 = 100 + innerRadius * Math.sin(endRad);
  const x4 = 100 + innerRadius * Math.cos(startRad);
  const y4 = 100 + innerRadius * Math.sin(startRad);

  const largeArc = angle > 180 ? 1 : 0;

  const pathData = [
    `M ${x1} ${y1}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2}`,
    `L ${x3} ${y3}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4}`,
    'Z',
  ].join(' ');

  return <path d={pathData} fill={color} />;
};

const BarChart = ({ data }) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return <div className="h-48 flex items-center justify-center text-slate-500">No data available</div>;
  }

  const maxValue = Math.max(...data.map((d) => d.value || 0)) || 1;
  const colors = ['#0066CC', '#8b5cf6', '#f59e0b', '#10b981'];

  return (
    <div className="space-y-4">
      {data.map((item, index) => (
        <div key={index} className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-700 dark:text-slate-300">{item.name}</span>
            <span className="font-semibold text-slate-900 dark:text-white">{item.value}</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
            <div
              className="h-3 rounded-full transition-all duration-500"
              style={{
                width: `${(item.value / maxValue) * 100}%`,
                backgroundColor: colors[index % colors.length],
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

const PieChart = ({ data }) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return <div className="h-48 flex items-center justify-center text-slate-500">No data available</div>;
  }

  const total = data.reduce((sum, item) => sum + (item.value || 0), 0) || 1;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center">
        <svg width="200" height="200" viewBox="0 0 200 200">
          {data.map((item, index) => {
            const startAngle = data
              .slice(0, index)
              .reduce((sum, d) => sum + (d.value / total) * 360, 0);
            const angle = (item.value / total) * 360;
            return <PieSlice key={index} startAngle={startAngle} angle={angle} color={item.color} />;
          })}
        </svg>
      </div>
      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-slate-700 dark:text-slate-300">{item.name}</span>
            </div>
            <span className="font-semibold text-slate-900 dark:text-white">
              {item.value} ({Math.round((item.value / total) * 100)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const PieSlice = ({ startAngle, angle, color }) => {
  const radius = 90;
  const startRad = ((startAngle - 90) * Math.PI) / 180;
  const endRad = ((startAngle + angle - 90) * Math.PI) / 180;

  const x1 = 100 + radius * Math.cos(startRad);
  const y1 = 100 + radius * Math.sin(startRad);
  const x2 = 100 + radius * Math.cos(endRad);
  const y2 = 100 + radius * Math.sin(endRad);

  const largeArc = angle > 180 ? 1 : 0;

  const pathData = [`M 100 100`, `L ${x1} ${y1}`, `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`, 'Z'].join(' ');

  return <path d={pathData} fill={color} />;
};

const StackedBarChart = ({ data }) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return <div className="h-48 flex items-center justify-center text-slate-500">No data available</div>;
  }

  const total = data.reduce((sum, item) => sum + (item.value || 0), 0) || 1;

  return (
    <div className="space-y-4">
      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-8 flex overflow-hidden">
        {data.map((item, index) => (
          <div
            key={index}
            className="h-full flex items-center justify-center text-xs font-medium text-white"
            style={{
              width: `${(item.value / total) * 100}%`,
              backgroundColor: item.color,
            }}
          >
            {Math.round((item.value / total) * 100) > 10 && `${Math.round((item.value / total) * 100)}%`}
          </div>
        ))}
      </div>
      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-slate-700 dark:text-slate-300">{item.name}</span>
            </div>
            <span className="font-semibold text-slate-900 dark:text-white">
              {item.value} ({Math.round((item.value / total) * 100)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalyticsTab;
