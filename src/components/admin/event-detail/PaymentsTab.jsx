import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Check,
  X,
  Clock,
  Download,
  Eye,
  RefreshCw,
  DollarSign,
  Search,
  Filter,
  IndianRupee,
  QrCode,
  Image as ImageIcon,
  ExternalLink,
} from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const PaymentsTab = ({ event }) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewingPayment, setViewingPayment] = useState(null);

  useEffect(() => {
    fetchPayments();
  }, [event._id]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/admin/events/${event._id}/payments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPayments(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching payments:', error);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPayment = async (registrationId, action, rejectionReason = '') => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/admin/payments/${registrationId}/verify`,
        { action, rejectionReason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchPayments();
    } catch (error) {
      console.error('Error verifying payment:', error);
    }
  };

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.registrationId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.payment?.transactionId?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || payment.payment?.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: filteredPayments.reduce((sum, p) => sum + (p.payment?.amount || 0), 0),
    approved: filteredPayments.filter((p) => p.payment?.status === 'approved').length,
    pending: filteredPayments.filter((p) => p.payment?.status === 'submitted').length,
    rejected: filteredPayments.filter((p) => p.payment?.status === 'rejected').length,
    totalApproved: filteredPayments
      .filter((p) => p.payment?.status === 'approved')
      .reduce((sum, p) => sum + (p.payment?.amount || 0), 0),
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
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Payments</h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Manage and verify payment submissions
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Revenue"
          value={`₹${stats.totalApproved.toLocaleString()}`}
          icon={IndianRupee}
          color="green"
        />
        <StatCard label="Approved" value={stats.approved} icon={Check} color="green" />
        <StatCard label="Pending Review" value={stats.pending} icon={Clock} color="yellow" />
        <StatCard label="Rejected" value={stats.rejected} icon={X} color="red" />
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, or transaction ID..."
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
            <option value="submitted">Pending Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="pending">Not Submitted</option>
          </select>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                  Participant
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                  Registration ID
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                  Transaction ID
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                  Submitted
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-900 dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <div className="text-slate-500 dark:text-slate-400">
                      {searchTerm || statusFilter !== 'all'
                        ? 'No payments match your filters'
                        : event.pricing?.isFree
                        ? 'This is a free event'
                        : 'No payment submissions yet'}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPayments.map((payment) => (
                  <PaymentRow
                    key={payment._id}
                    payment={payment}
                    onVerify={handleVerifyPayment}
                    onView={() => setViewingPayment(payment)}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Detail Modal */}
      {viewingPayment && (
        <PaymentDetailModal
          payment={viewingPayment}
          onClose={() => setViewingPayment(null)}
          onVerify={handleVerifyPayment}
          onRefresh={fetchPayments}
        />
      )}
    </div>
  );
};

const StatCard = ({ label, value, icon: Icon, color }) => {
  const colorClasses = {
    green: 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400',
    yellow: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400',
    red: 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400',
    blue: 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400',
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">{label}</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
        </div>
        <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

const PaymentRow = ({ payment, onVerify, onView }) => {
  const getStatusBadge = (status) => {
    const config = {
      approved: {
        bg: 'bg-green-100 dark:bg-green-900/20',
        text: 'text-green-700 dark:text-green-400',
        icon: Check,
      },
      submitted: {
        bg: 'bg-blue-100 dark:bg-blue-900/20',
        text: 'text-blue-700 dark:text-blue-400',
        icon: Clock,
      },
      pending: {
        bg: 'bg-yellow-100 dark:bg-yellow-900/20',
        text: 'text-yellow-700 dark:text-yellow-400',
        icon: Clock,
      },
      rejected: {
        bg: 'bg-red-100 dark:bg-red-900/20',
        text: 'text-red-700 dark:text-red-400',
        icon: X,
      },
    };

    const statusConfig = config[status] || config.pending;
    const Icon = statusConfig.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bg} ${statusConfig.text}`}
      >
        <Icon className="w-4 h-4" />
        {status}
      </span>
    );
  };

  return (
    <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
      <td className="px-6 py-4">
        <div>
          <div className="font-medium text-slate-900 dark:text-white">
            {payment.user?.name || 'N/A'}
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400">
            {payment.user?.email || 'N/A'}
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="font-mono text-sm text-slate-900 dark:text-white">
          {payment.registrationId}
        </span>
      </td>
      <td className="px-6 py-4">
        <span className="font-semibold text-slate-900 dark:text-white">
          ₹{payment.payment?.amount?.toLocaleString() || 0}
        </span>
      </td>
      <td className="px-6 py-4">
        <span className="font-mono text-sm text-slate-600 dark:text-slate-400">
          {payment.payment?.transactionId || payment.payment?.utrNumber || 'N/A'}
        </span>
      </td>
      <td className="px-6 py-4">{getStatusBadge(payment.payment?.status)}</td>
      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
        {payment.payment?.submittedAt
          ? new Date(payment.payment.submittedAt).toLocaleString()
          : 'N/A'}
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center justify-end gap-2">
          {payment.payment?.status === 'submitted' && (
            <>
              <button
                onClick={() => onVerify(payment._id, 'approve')}
                className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/30 transition-colors text-sm flex items-center gap-1"
              >
                <Check className="w-4 h-4" />
                Approve
              </button>
              <button
                onClick={() => onVerify(payment._id, 'reject', 'Invalid transaction proof')}
                className="px-3 py-1 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors text-sm flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                Reject
              </button>
            </>
          )}
          <button
            onClick={onView}
            className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-sm flex items-center gap-1"
          >
            <Eye className="w-4 h-4" />
            View
          </button>
        </div>
      </td>
    </tr>
  );
};

const PaymentDetailModal = ({ payment, onClose, onVerify, onRefresh }) => {
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  const handleApprove = async () => {
    await onVerify(payment._id, 'approve');
    onRefresh();
    onClose();
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }
    await onVerify(payment._id, 'reject', rejectionReason);
    onRefresh();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-700"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between sticky top-0 bg-white dark:bg-slate-800 z-10">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Payment Details</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Participant Info */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-3">
              Participant Information
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-600 dark:text-slate-400">Name:</span>
                <p className="font-medium text-slate-900 dark:text-white mt-1">
                  {payment.user?.name}
                </p>
              </div>
              <div>
                <span className="text-slate-600 dark:text-slate-400">Email:</span>
                <p className="font-medium text-slate-900 dark:text-white mt-1">
                  {payment.user?.email}
                </p>
              </div>
              <div>
                <span className="text-slate-600 dark:text-slate-400">Registration ID:</span>
                <p className="font-medium text-slate-900 dark:text-white mt-1 font-mono">
                  {payment.registrationId}
                </p>
              </div>
              <div>
                <span className="text-slate-600 dark:text-slate-400">Amount:</span>
                <p className="font-medium text-slate-900 dark:text-white mt-1">
                  ₹{payment.payment?.amount?.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Payment Information</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-600 dark:text-slate-400">Transaction ID / UTR:</span>
                <p className="font-medium text-slate-900 dark:text-white mt-1 font-mono">
                  {payment.payment?.transactionId || payment.payment?.utrNumber || 'N/A'}
                </p>
              </div>
              <div>
                <span className="text-slate-600 dark:text-slate-400">Submitted At:</span>
                <p className="font-medium text-slate-900 dark:text-white mt-1">
                  {payment.payment?.submittedAt
                    ? new Date(payment.payment.submittedAt).toLocaleString()
                    : 'N/A'}
                </p>
              </div>
              {payment.payment?.verifiedAt && (
                <>
                  <div>
                    <span className="text-slate-600 dark:text-slate-400">Verified At:</span>
                    <p className="font-medium text-slate-900 dark:text-white mt-1">
                      {new Date(payment.payment.verifiedAt).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-600 dark:text-slate-400">Status:</span>
                    <p className="font-medium text-slate-900 dark:text-white mt-1">
                      {payment.payment.status}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Screenshot */}
          {payment.payment?.screenshotUrl && (
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-3">
                Payment Screenshot
              </h4>
              <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                <img
                  src={payment.payment.screenshotUrl}
                  alt="Payment proof"
                  className="w-full max-h-96 object-contain bg-slate-50 dark:bg-slate-900"
                />
              </div>
              <a
                href={payment.payment.screenshotUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-3 text-sm text-ieee-blue hover:underline"
              >
                <ExternalLink className="w-4 h-4" />
                Open in new tab
              </a>
            </div>
          )}

          {/* Rejection Reason */}
          {payment.payment?.status === 'rejected' && payment.payment?.rejectionReason && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
              <h4 className="font-semibold text-red-900 dark:text-red-400 mb-2">
                Rejection Reason
              </h4>
              <p className="text-sm text-red-800 dark:text-red-300">
                {payment.payment.rejectionReason}
              </p>
            </div>
          )}

          {/* Reject Form */}
          {showRejectForm && (
            <div className="bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Rejection Reason
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-ieee-blue dark:bg-slate-700 dark:text-white resize-none"
                placeholder="Explain why this payment is being rejected..."
              />
            </div>
          )}
        </div>

        {/* Actions */}
        {payment.payment?.status === 'submitted' && (
          <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-end gap-3 sticky bottom-0 bg-white dark:bg-slate-800">
            {showRejectForm ? (
              <>
                <button
                  onClick={() => setShowRejectForm(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Confirm Rejection
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setShowRejectForm(true)}
                  className="px-4 py-2 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-xl hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Reject Payment
                </button>
                <button
                  onClick={handleApprove}
                  className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Approve Payment
                </button>
              </>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default PaymentsTab;
