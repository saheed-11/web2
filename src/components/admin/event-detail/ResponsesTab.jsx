import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Download,
  Mail,
  CheckCircle,
  XCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  QrCode,
  Trash2,
  MoreVertical,
  User,
  Phone,
  Calendar,
  Hash,
  Check,
  X,
} from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ResponsesTab = ({ event }) => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [expandedRow, setExpandedRow] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    fetchRegistrations();
  }, [event._id]);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/admin/events/${event._id}/registrations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRegistrations(response.data);
    } catch (error) {
      console.error('Error fetching registrations:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRegistrations = registrations.filter((reg) => {
    const matchesSearch =
      reg.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.registrationId?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || reg.status === statusFilter;

    const matchesPayment =
      paymentFilter === 'all' ||
      (paymentFilter === 'not_required' && !reg.payment?.required) ||
      reg.payment?.status === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(filteredRegistrations.map((r) => r._id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const exportToCSV = () => {
    const headers = ['Registration ID', 'Name', 'Email', 'Status', 'Payment Status', 'Registered At'];
    const rows = filteredRegistrations.map((reg) => [
      reg.registrationId,
      reg.user?.name || 'N/A',
      reg.user?.email || 'N/A',
      reg.status,
      reg.payment?.status || 'not_required',
      new Date(reg.registeredAt).toLocaleDateString(),
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `${event.title}-registrations.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      confirmed: { bg: 'bg-green-100 dark:bg-green-900/20', text: 'text-green-700 dark:text-green-400', icon: CheckCircle },
      pending: { bg: 'bg-yellow-100 dark:bg-yellow-900/20', text: 'text-yellow-700 dark:text-yellow-400', icon: Clock },
      pending_payment: { bg: 'bg-orange-100 dark:bg-orange-900/20', text: 'text-orange-700 dark:text-orange-400', icon: Clock },
      cancelled: { bg: 'bg-red-100 dark:bg-red-900/20', text: 'text-red-700 dark:text-red-400', icon: XCircle },
      waitlist: { bg: 'bg-blue-100 dark:bg-blue-900/20', text: 'text-blue-700 dark:text-blue-400', icon: Clock },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
        <Icon className="w-4 h-4" />
        {status.replace('_', ' ')}
      </span>
    );
  };

  const getPaymentBadge = (payment) => {
    if (!payment?.required) {
      return <span className="text-sm text-slate-500 dark:text-slate-400">Free Event</span>;
    }

    const paymentConfig = {
      approved: { bg: 'bg-green-100 dark:bg-green-900/20', text: 'text-green-700 dark:text-green-400', icon: Check },
      pending: { bg: 'bg-yellow-100 dark:bg-yellow-900/20', text: 'text-yellow-700 dark:text-yellow-400', icon: Clock },
      submitted: { bg: 'bg-blue-100 dark:bg-blue-900/20', text: 'text-blue-700 dark:text-blue-400', icon: Clock },
      rejected: { bg: 'bg-red-100 dark:bg-red-900/20', text: 'text-red-700 dark:text-red-400', icon: X },
    };

    const config = paymentConfig[payment.status] || paymentConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
        <Icon className="w-4 h-4" />
        {payment.status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-ieee-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Responses</h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            {filteredRegistrations.length} registrations
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={exportToCSV}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button
            disabled={selectedRows.length === 0}
            className="px-4 py-2 bg-ieee-blue text-white rounded-xl hover:bg-ieee-blue-dark transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Mail className="w-4 h-4" />
            Email Selected ({selectedRows.length})
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, or ID..."
              className="w-full pl-12 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-ieee-blue dark:bg-slate-700 dark:text-white"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-ieee-blue dark:bg-slate-700 dark:text-white"
          >
            <option value="all">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="pending_payment">Pending Payment</option>
            <option value="waitlist">Waitlist</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Payment Filter */}
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-ieee-blue dark:bg-slate-700 dark:text-white"
          >
            <option value="all">All Payments</option>
            <option value="not_required">Free Event</option>
            <option value="approved">Approved</option>
            <option value="submitted">Submitted</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedRows.length === filteredRegistrations.length && filteredRegistrations.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-ieee-blue border-slate-300 rounded focus:ring-ieee-blue"
                  />
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                  Registration ID
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                  Payment
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                  Registered
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-900 dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {filteredRegistrations.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center">
                    <div className="text-slate-500 dark:text-slate-400">
                      {searchTerm || statusFilter !== 'all' || paymentFilter !== 'all'
                        ? 'No registrations match your filters'
                        : 'No registrations yet'}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRegistrations.map((registration) => (
                  <RegistrationRow
                    key={registration._id}
                    registration={registration}
                    isSelected={selectedRows.includes(registration._id)}
                    isExpanded={expandedRow === registration._id}
                    onSelect={handleSelectRow}
                    onToggleExpand={() =>
                      setExpandedRow(expandedRow === registration._id ? null : registration._id)
                    }
                    getStatusBadge={getStatusBadge}
                    getPaymentBadge={getPaymentBadge}
                    onRefresh={fetchRegistrations}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const RegistrationRow = ({
  registration,
  isSelected,
  isExpanded,
  onSelect,
  onToggleExpand,
  getStatusBadge,
  getPaymentBadge,
  onRefresh,
}) => {
  const [showQR, setShowQR] = useState(false);

  const handleCheckIn = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/admin/registrations/${registration._id}/check-in`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onRefresh();
    } catch (error) {
      console.error('Error checking in:', error);
    }
  };

  return (
    <>
      <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
        <td className="px-6 py-4">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect(registration._id)}
            className="w-4 h-4 text-ieee-blue border-slate-300 rounded focus:ring-ieee-blue"
          />
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm text-slate-900 dark:text-white">
              {registration.registrationId}
            </span>
            <button
              onClick={() => setShowQR(!showQR)}
              className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded transition-colors"
            >
              <QrCode className="w-4 h-4 text-slate-500" />
            </button>
          </div>
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-ieee-blue/10 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-ieee-blue" />
            </div>
            <span className="font-medium text-slate-900 dark:text-white">
              {registration.user?.name || 'N/A'}
            </span>
          </div>
        </td>
        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
          {registration.user?.email || 'N/A'}
        </td>
        <td className="px-6 py-4">{getStatusBadge(registration.status)}</td>
        <td className="px-6 py-4">{getPaymentBadge(registration.payment)}</td>
        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
          {new Date(registration.registeredAt).toLocaleDateString()}
        </td>
        <td className="px-6 py-4 text-right">
          <div className="flex items-center justify-end gap-2">
            {!registration.attended && (
              <button
                onClick={handleCheckIn}
                className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/30 transition-colors text-sm"
              >
                Check In
              </button>
            )}
            <button
              onClick={onToggleExpand}
              className="p-2 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors"
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              )}
            </button>
          </div>
        </td>
      </tr>

      {/* Expanded Details */}
      <AnimatePresence>
        {isExpanded && (
          <tr>
            <td colSpan="8" className="px-0 py-0">
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-6 py-6 bg-slate-50 dark:bg-slate-700/30 border-t border-b border-slate-200 dark:border-slate-700">
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-4">
                    Registration Details
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* User Info */}
                    <div className="space-y-3">
                      <h5 className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Participant Information
                      </h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-600 dark:text-slate-400">Name:</span>
                          <span className="text-slate-900 dark:text-white font-medium">
                            {registration.user?.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-600 dark:text-slate-400">Email:</span>
                          <span className="text-slate-900 dark:text-white font-medium">
                            {registration.user?.email}
                          </span>
                        </div>
                        {registration.user?.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-600 dark:text-slate-400">Phone:</span>
                            <span className="text-slate-900 dark:text-white font-medium">
                              {registration.user.phone}
                            </span>
                          </div>
                        )}
                        {registration.isIeeeMember && (
                          <div className="flex items-center gap-2">
                            <Hash className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-600 dark:text-slate-400">IEEE ID:</span>
                            <span className="text-slate-900 dark:text-white font-medium">
                              {registration.ieeeId}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Form Responses */}
                    {registration.formResponses && registration.formResponses.length > 0 && (
                      <div className="space-y-3">
                        <h5 className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          Form Responses
                        </h5>
                        <div className="space-y-2 text-sm">
                          {registration.formResponses.map((response, idx) => (
                            <div key={idx}>
                              <span className="text-slate-600 dark:text-slate-400">
                                {response.fieldLabel}:
                              </span>{' '}
                              <span className="text-slate-900 dark:text-white font-medium">
                                {Array.isArray(response.value)
                                  ? response.value.join(', ')
                                  : response.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Attendance */}
                  {registration.attended && (
                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                      <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                        <CheckCircle className="w-4 h-4" />
                        <span>
                          Checked in at {new Date(registration.checkInTime).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </td>
          </tr>
        )}
      </AnimatePresence>
    </>
  );
};

export default ResponsesTab;
