import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Calendar,
  UserCheck,
  BarChart3,
  Loader,
  Plus,
  Edit,
  Trash2,
  Upload,
} from 'lucide-react';
import { adminService, eventService } from '../../services/authService';
import { getErrorMessage, formatDate } from '../../utils/helpers';
import EventModal from '../../components/admin/EventModal';
import UsersTable from '../../components/admin/UsersTable';
import CertificateUpload from '../../components/admin/CertificateUpload';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showCertUpload, setShowCertUpload] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsData, eventsData, usersData] = await Promise.all([
        adminService.getStats(),
        eventService.getEvents(),
        adminService.getUsers(),
      ]);

      setStats(statsData);
      setEvents(eventsData);
      setUsers(usersData);
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = () => {
    setSelectedEvent(null);
    setShowEventModal(true);
  };

  const handleEditEvent = (event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      await eventService.deleteEvent(eventId);
      fetchDashboardData();
    } catch (error) {
      setError(getErrorMessage(error));
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      await adminService.deleteUser(userId);
      fetchDashboardData();
    } catch (error) {
      setError(getErrorMessage(error));
    }
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      await adminService.updateUserRole(userId, newRole);
      fetchDashboardData();
    } catch (error) {
      setError(getErrorMessage(error));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-12 h-12 animate-spin text-ieee-blue" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 px-4">
      <div className="container-custom max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Admin Dashboard
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                Manage events, users, and certificates
              </p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Total Users</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                    {stats?.totalUsers || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Total Events</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                    {stats?.totalEvents || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Upcoming Events</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                    {stats?.upcomingEvents || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Total Registrations</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                    {stats?.totalRegistrations || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Tabs */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
            <div className="border-b border-slate-200 dark:border-slate-700">
              <div className="flex overflow-x-auto">
                {['overview', 'events', 'users', 'certificates'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-4 font-medium capitalize whitespace-nowrap transition-colors ${
                      activeTab === tab
                        ? 'text-ieee-blue border-b-2 border-ieee-blue'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Dashboard Overview
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Welcome to the admin dashboard. Use the tabs above to manage events, users, and certificates.
                  </p>
                </div>
              )}

              {/* Events Tab */}
              {activeTab === 'events' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      Manage Events
                    </h3>
                    <button
                      onClick={handleCreateEvent}
                      className="flex items-center gap-2 px-4 py-2 bg-ieee-blue text-white rounded-lg hover:bg-ieee-blue-dark transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Create Event
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {events.map((event) => (
                      <div
                        key={event._id}
                        className="border border-slate-200 dark:border-slate-700 rounded-lg p-6"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                              {event.title}
                            </h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                              {event.description}
                            </p>
                            <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-400">
                              <span>📅 {formatDate(event.date)}</span>
                              <span>⏰ {event.time}</span>
                              <span>📍 {event.location}</span>
                              <span>👥 {event.attendees?.length || 0} attendees</span>
                              <span className={`px-2 py-1 rounded ${
                                event.registrationOpen
                                  ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                                  : 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                              }`}>
                                {event.registrationOpen ? 'Open' : 'Closed'}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <button
                              onClick={() => handleEditEvent(event)}
                              className="p-2 text-ieee-blue hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteEvent(event._id)}
                              className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Users Tab */}
              {activeTab === 'users' && (
                <UsersTable
                  users={users}
                  onDeleteUser={handleDeleteUser}
                  onUpdateUserRole={handleUpdateUserRole}
                />
              )}

              {/* Certificates Tab */}
              {activeTab === 'certificates' && (
                <CertificateUpload
                  events={events}
                  users={users}
                  onUploadComplete={fetchDashboardData}
                />
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Event Modal */}
      {showEventModal && (
        <EventModal
          event={selectedEvent}
          onClose={() => setShowEventModal(false)}
          onSave={() => {
            setShowEventModal(false);
            fetchDashboardData();
          }}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
