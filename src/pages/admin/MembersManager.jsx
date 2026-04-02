import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Users,
  Download,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Mail,
  Phone,
  Calendar,
  Award,
  ChevronLeft,
  ChevronRight,
  UserCog,
  X,
  User,
  BookOpen,
  CheckCircle,
} from 'lucide-react';
import { adminService } from '../../services/authService';
import { formatDate } from '../../utils/helpers';
import { useToast } from '../../hooks/useToast';
import ToastContainer from '../../components/ToastContainer';

// Member Details Modal
const MemberModal = ({ member, onClose, onRoleUpdate }) => {
  const [role, setRole] = useState(member.role);
  const [saving, setSaving] = useState(false);

  const handleSaveRole = async () => {
    if (role === member.role) {
      onClose();
      return;
    }
    setSaving(true);
    await onRoleUpdate(member._id, role);
    setSaving(false);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-ieee-blue to-ieee-blue-dark rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {member.name}
                </h2>
                <p className="text-slate-500 dark:text-slate-400">{member.email}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-1">
                <Phone className="w-4 h-4" />
                <span className="text-sm">Phone</span>
              </div>
              <p className="font-medium text-slate-900 dark:text-white">
                {member.phone || 'Not provided'}
              </p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-1">
                <BookOpen className="w-4 h-4" />
                <span className="text-sm">Department</span>
              </div>
              <p className="font-medium text-slate-900 dark:text-white">
                {member.department || 'Not specified'}
              </p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-1">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Year</span>
              </div>
              <p className="font-medium text-slate-900 dark:text-white">
                {member.year || 'Not specified'}
              </p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-1">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Joined</span>
              </div>
              <p className="font-medium text-slate-900 dark:text-white">
                {formatDate(member.createdAt)}
              </p>
            </div>
          </div>

          {/* Role Update */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-700 border-0 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-ieee-blue"
            >
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Registered Events */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-ieee-blue" />
              Registered Events ({member.registeredEvents?.length || 0})
            </h3>
            {member.registeredEvents && member.registeredEvents.length > 0 ? (
              <div className="space-y-3">
                {member.registeredEvents.map((reg) => (
                  <div
                    key={reg._id}
                    className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl"
                  >
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">
                        {reg.event?.title || 'Event'}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Registered: {formatDate(reg.registeredAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {reg.attended && (
                        <span className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm">
                          <CheckCircle className="w-4 h-4" />
                          Attended
                        </span>
                      )}
                      {reg.certificateUrl && (
                        <a
                          href={`http://localhost:5000${reg.certificateUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-ieee-blue hover:text-ieee-blue-dark text-sm"
                        >
                          Certificate
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 dark:text-slate-400 text-center py-4">
                No events registered
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 dark:border-slate-700 flex gap-3">
          <button
            onClick={handleSaveRole}
            disabled={saving}
            className="flex-1 px-4 py-2.5 bg-ieee-blue text-white rounded-xl hover:bg-ieee-blue-dark transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const MembersManager = () => {
  const { toasts, hideToast, showSuccess, showError } = useToast();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showMemberModal, setShowMemberModal] = useState(false);

  // Filters and pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const membersPerPage = 10;

  const departments = ['Computer Science', 'Electrical', 'Electronics', 'Mechanical', 'Civil', 'Other'];
  const roles = ['student', 'admin'];

  useEffect(() => {
    fetchMembers();
  }, [searchQuery, roleFilter, departmentFilter, currentPage]);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const data = await adminService.getUsers({
        search: searchQuery,
        role: roleFilter,
        department: departmentFilter,
        page: currentPage,
        limit: membersPerPage,
      });
      
      // Handle both old and new API response formats
      if (data.users) {
        setMembers(data.users);
        setTotalPages(data.pagination?.pages || 1);
      } else if (Array.isArray(data)) {
        setMembers(data);
        setTotalPages(Math.ceil(data.length / membersPerPage));
      }
    } catch (error) {
      showError('Failed to fetch members');
    } finally {
      setLoading(false);
    }
  };

  const handleViewMember = async (memberId) => {
    try {
      const member = await adminService.getUserById(memberId);
      setSelectedMember(member);
      setShowMemberModal(true);
    } catch (error) {
      showError('Failed to fetch member details');
    }
  };

  const handleUpdateRole = async (memberId, newRole) => {
    try {
      await adminService.updateUserRole(memberId, newRole);
      showSuccess('Role updated successfully');
      fetchMembers();
    } catch (error) {
      showError('Failed to update role');
    }
  };

  const handleDeleteMember = async (memberId) => {
    if (!window.confirm('Are you sure you want to delete this member?')) return;

    try {
      await adminService.deleteUser(memberId);
      showSuccess('Member deleted successfully');
      fetchMembers();
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to delete member');
    }
  };

  const handleExportCSV = async () => {
    try {
      const data = await adminService.exportUsers({
        role: roleFilter,
        department: departmentFilter,
      });
      
      // Convert to CSV
      const headers = ['Name', 'Email', 'Phone', 'Department', 'Year', 'Role', 'Joined', 'Events Registered', 'Events Attended'];
      const csvContent = [
        headers.join(','),
        ...data.map(m => [
          `"${m.name}"`,
          m.email,
          m.phone || '',
          m.department || '',
          m.year || '',
          m.role,
          m.joinedAt,
          m.eventsRegistered,
          m.eventsAttended,
        ].join(','))
      ].join('\n');

      // Download
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `members-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

      showSuccess('Members exported successfully');
    } catch (error) {
      showError('Failed to export members');
    }
  };

  return (
    <div className="space-y-6">
      <ToastContainer toasts={toasts} hideToast={hideToast} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Members</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Manage your chapter members and their roles
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-700 border-0 rounded-xl text-slate-900 dark:text-white placeholder-slate-500 focus:ring-2 focus:ring-ieee-blue"
              />
            </div>
          </div>

          {/* Role Filter */}
          <div className="w-full lg:w-48">
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-700 border-0 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-ieee-blue"
            >
              <option value="all">All Roles</option>
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Department Filter */}
          <div className="w-full lg:w-48">
            <select
              value={departmentFilter}
              onChange={(e) => {
                setDepartmentFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-700 border-0 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-ieee-blue"
            >
              <option value="all">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white">
                  Member
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white">
                  Department
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white">
                  Year
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white">
                  Role
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white">
                  Events
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white">
                  Joined
                </th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ieee-blue"></div>
                    </div>
                  </td>
                </tr>
              ) : members.length > 0 ? (
                members.map((member) => (
                  <tr
                    key={member._id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-ieee-blue to-ieee-blue-dark rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-semibold text-sm">
                            {member.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">
                            {member.name}
                          </p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {member.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                      {member.department || '—'}
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                      {member.year || '—'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        member.role === 'admin'
                          ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400'
                          : 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                      }`}>
                        {member.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                      {member.registeredEvents?.length || 0}
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                      {formatDate(member.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleViewMember(member._id)}
                          className="p-2 text-slate-500 hover:text-ieee-blue hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteMember(member._id)}
                          className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <Users className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-500 dark:text-slate-400">No members found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Member Modal */}
      <AnimatePresence>
        {showMemberModal && selectedMember && (
          <MemberModal
            member={selectedMember}
            onClose={() => {
              setShowMemberModal(false);
              setSelectedMember(null);
            }}
            onRoleUpdate={handleUpdateRole}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MembersManager;
