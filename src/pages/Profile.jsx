import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Phone, BookOpen, Calendar, Download, Award, Loader, Edit2, Save, X,
  LayoutDashboard, Settings, Bell, ChevronRight, Clock, CheckCircle2, 
  TrendingUp, CalendarDays, FileText, ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { getErrorMessage, formatDate } from '../utils/helpers';
import { useToast } from '../hooks/useToast';
import ToastContainer from '../components/ToastContainer';

const Profile = () => {
  const { user: currentUser, updateUserProfile } = useAuth();
  const { toasts, hideToast, showSuccess, showError } = useToast();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    department: '',
    year: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await authService.getProfile();
      setProfile(data);
      setFormData({
        name: data.name,
        phone: data.phone || '',
        department: data.department || '',
        year: data.year || '',
      });
    } catch (error) {
      showError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      await updateUserProfile(formData);
      showSuccess('Profile updated successfully!');
      setIsEditing(false);
      await fetchProfile();
    } catch (error) {
      showError(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: profile.name,
      phone: profile.phone || '',
      department: profile.department || '',
      year: profile.year || '',
    });
    setIsEditing(false);
  };

  // Calculate stats
  const totalEvents = profile?.registeredEvents?.length || 0;
  const attendedEvents = profile?.registeredEvents?.filter(e => e.attended)?.length || 0;
  const certificates = profile?.registeredEvents?.filter(e => e.certificateUrl)?.length || 0;
  const upcomingEvents = profile?.registeredEvents?.filter(e => !e.attended)?.length || 0;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'events', label: 'My Events', icon: CalendarDays },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-ieee-blue mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
      <ToastContainer toasts={toasts} hideToast={hideToast} />
      
      {/* Top Header Bar */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-ieee-blue to-ieee-blue-dark rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Student Dashboard
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Welcome back, {profile?.name?.split(' ')[0]}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors relative">
                <Bell className="w-5 h-5" />
                {upcomingEvents > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {upcomingEvents}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar */}
          <motion.aside 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-72 flex-shrink-0"
          >
            {/* Profile Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-6">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-ieee-blue to-ieee-blue-dark rounded-full flex items-center justify-center mx-auto mb-4 ring-4 ring-ieee-blue/20">
                  <User className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                  {profile?.name}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                  {profile?.email}
                </p>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-ieee-blue/10 text-ieee-blue dark:bg-ieee-blue/20">
                  {profile?.role?.charAt(0).toUpperCase() + profile?.role?.slice(1)} Member
                </span>
              </div>
              
              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                    <span className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      Department
                    </span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {profile?.department || '—'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                    <span className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Year
                    </span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {profile?.year || '—'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                    <span className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Member Since
                    </span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '—'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                    activeTab === tab.id
                      ? 'bg-ieee-blue text-white shadow-lg shadow-ieee-blue/25'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                  {activeTab === tab.id && (
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  )}
                </button>
              ))}
            </nav>
          </motion.aside>

          {/* Main Content */}
          <motion.main 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 min-w-0"
          >
            <AnimatePresence mode="wait">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                          <CalendarDays className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      </div>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalEvents}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Total Events</p>
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                          <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">{attendedEvents}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Attended</p>
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                          <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">{certificates}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Certificates</p>
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
                          <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">{upcomingEvents}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Upcoming</p>
                    </div>
                  </div>

                  {/* Recent Activity & Quick Actions */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Events */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                      <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                          <CalendarDays className="w-5 h-5 text-ieee-blue" />
                          Recent Events
                        </h3>
                      </div>
                      <div className="p-6">
                        {profile?.registeredEvents && profile.registeredEvents.length > 0 ? (
                          <div className="space-y-4">
                            {profile.registeredEvents.slice(0, 3).map((reg) => (
                              <div
                                key={reg._id}
                                className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl"
                              >
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                  reg.attended 
                                    ? 'bg-green-100 dark:bg-green-900/30' 
                                    : 'bg-blue-100 dark:bg-blue-900/30'
                                }`}>
                                  {reg.attended ? (
                                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                                  ) : (
                                    <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-slate-900 dark:text-white truncate">
                                    {reg.event?.title || 'Event'}
                                  </p>
                                  <p className="text-sm text-slate-500 dark:text-slate-400">
                                    {formatDate(reg.registeredAt)}
                                  </p>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  reg.attended
                                    ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                                    : 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                                }`}>
                                  {reg.attended ? 'Attended' : 'Registered'}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <CalendarDays className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                            <p className="text-slate-500 dark:text-slate-400">No events yet</p>
                            <a href="/events" className="text-ieee-blue hover:underline text-sm mt-2 inline-block">
                              Browse Events →
                            </a>
                          </div>
                        )}
                        {profile?.registeredEvents?.length > 3 && (
                          <button
                            onClick={() => setActiveTab('events')}
                            className="w-full mt-4 py-2 text-ieee-blue hover:text-ieee-blue-dark font-medium text-sm"
                          >
                            View All Events →
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                      <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                          <FileText className="w-5 h-5 text-ieee-blue" />
                          Quick Actions
                        </h3>
                      </div>
                      <div className="p-6 space-y-3">
                        <a 
                          href="/events" 
                          className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors group"
                        >
                          <div className="w-10 h-10 bg-ieee-blue/10 rounded-lg flex items-center justify-center">
                            <CalendarDays className="w-5 h-5 text-ieee-blue" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-slate-900 dark:text-white">Browse Events</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Find upcoming events</p>
                          </div>
                          <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-ieee-blue transition-colors" />
                        </a>
                        
                        <button 
                          onClick={() => setActiveTab('settings')}
                          className="w-full flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors group text-left"
                        >
                          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                            <Settings className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-slate-900 dark:text-white">Update Profile</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Edit your information</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 transition-colors" />
                        </button>

                        {certificates > 0 && (
                          <button 
                            onClick={() => setActiveTab('events')}
                            className="w-full flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors group text-left"
                          >
                            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                              <Download className="w-5 h-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-slate-900 dark:text-white">Download Certificates</p>
                              <p className="text-sm text-slate-500 dark:text-slate-400">{certificates} available</p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-green-600 transition-colors" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Events Tab */}
              {activeTab === 'events' && (
                <motion.div
                  key="events"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm"
                >
                  <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                      <Award className="w-6 h-6 text-ieee-blue" />
                      My Events
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      All events you've registered for
                    </p>
                  </div>

                  <div className="p-6">
                    {profile?.registeredEvents && profile.registeredEvents.length > 0 ? (
                      <div className="space-y-4">
                        {profile.registeredEvents.map((reg) => (
                          <div
                            key={reg._id}
                            className="border border-slate-200 dark:border-slate-700 rounded-xl p-6 hover:shadow-md transition-shadow bg-slate-50/50 dark:bg-slate-700/30"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div className="flex items-start gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                  reg.attended 
                                    ? 'bg-green-100 dark:bg-green-900/30' 
                                    : 'bg-blue-100 dark:bg-blue-900/30'
                                }`}>
                                  {reg.attended ? (
                                    <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                                  ) : (
                                    <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                  )}
                                </div>
                                <div>
                                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                    {reg.event?.title || 'Event'}
                                  </h3>
                                  <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-slate-500 dark:text-slate-400">
                                    <span className="flex items-center gap-1">
                                      <Calendar className="w-4 h-4" />
                                      Registered: {formatDate(reg.registeredAt)}
                                    </span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      reg.attended
                                        ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                                        : 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                                    }`}>
                                      {reg.attended ? 'Attended' : 'Registered'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              {reg.certificateUrl && (
                                <a
                                  href={`http://localhost:5000${reg.certificateUrl}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 px-4 py-2 bg-ieee-blue text-white rounded-lg hover:bg-ieee-blue-dark transition-colors text-sm font-medium"
                                >
                                  <Download className="w-4 h-4" />
                                  Certificate
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <CalendarDays className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                          No events yet
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 mb-6">
                          You haven't registered for any events yet.
                        </p>
                        <a 
                          href="/events" 
                          className="inline-flex items-center gap-2 px-6 py-3 bg-ieee-blue text-white rounded-lg hover:bg-ieee-blue-dark transition-colors"
                        >
                          Browse Events
                          <ChevronRight className="w-4 h-4" />
                        </a>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm"
                >
                  <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                          <Settings className="w-6 h-6 text-ieee-blue" />
                          Profile Settings
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                          Update your personal information
                        </p>
                      </div>
                      {!isEditing && (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="flex items-center gap-2 px-4 py-2 bg-ieee-blue text-white rounded-lg hover:bg-ieee-blue-dark transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Full Name
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-ieee-blue focus:border-transparent dark:bg-slate-700 dark:text-white transition-all"
                          />
                        ) : (
                          <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-700 rounded-xl">
                            <User className="w-5 h-5 text-slate-400" />
                            <span className="text-slate-900 dark:text-white">{profile?.name}</span>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Email Address
                        </label>
                        <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-700 rounded-xl">
                          <Mail className="w-5 h-5 text-slate-400" />
                          <span className="text-slate-900 dark:text-white">{profile?.email}</span>
                          <span className="ml-auto text-xs text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-slate-600 px-2 py-0.5 rounded">
                            Verified
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Phone Number
                        </label>
                        {isEditing ? (
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-ieee-blue focus:border-transparent dark:bg-slate-700 dark:text-white transition-all"
                            placeholder="+1234567890"
                          />
                        ) : (
                          <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-700 rounded-xl">
                            <Phone className="w-5 h-5 text-slate-400" />
                            <span className="text-slate-900 dark:text-white">{profile?.phone || 'Not provided'}</span>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Department
                        </label>
                        {isEditing ? (
                          <select
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-ieee-blue focus:border-transparent dark:bg-slate-700 dark:text-white transition-all"
                          >
                            <option value="">Select Department</option>
                            <option value="Computer Science">Computer Science</option>
                            <option value="Electrical">Electrical Engineering</option>
                            <option value="Electronics">Electronics & Communication</option>
                            <option value="Mechanical">Mechanical Engineering</option>
                            <option value="Civil">Civil Engineering</option>
                            <option value="Other">Other</option>
                          </select>
                        ) : (
                          <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-700 rounded-xl">
                            <BookOpen className="w-5 h-5 text-slate-400" />
                            <span className="text-slate-900 dark:text-white">{profile?.department || 'Not provided'}</span>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Academic Year
                        </label>
                        {isEditing ? (
                          <select
                            name="year"
                            value={formData.year}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-ieee-blue focus:border-transparent dark:bg-slate-700 dark:text-white transition-all"
                          >
                            <option value="">Select Year</option>
                            <option value="1st">1st Year</option>
                            <option value="2nd">2nd Year</option>
                            <option value="3rd">3rd Year</option>
                            <option value="4th">4th Year</option>
                          </select>
                        ) : (
                          <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-700 rounded-xl">
                            <Calendar className="w-5 h-5 text-slate-400" />
                            <span className="text-slate-900 dark:text-white">{profile?.year ? `${profile.year} Year` : 'Not provided'}</span>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Member Since
                        </label>
                        <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-700 rounded-xl">
                          <Clock className="w-5 h-5 text-slate-400" />
                          <span className="text-slate-900 dark:text-white">
                            {profile?.createdAt ? formatDate(profile.createdAt) : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {isEditing && (
                      <div className="flex gap-4 mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                        <button
                          onClick={handleSave}
                          disabled={saving}
                          className="flex items-center gap-2 px-6 py-3 bg-ieee-blue text-white rounded-xl hover:bg-ieee-blue-dark transition-colors disabled:opacity-50 font-medium"
                        >
                          {saving ? (
                            <>
                              <Loader className="w-4 h-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4" />
                              Save Changes
                            </>
                          )}
                        </button>
                        <button
                          onClick={handleCancel}
                          className="flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors font-medium"
                        >
                          <X className="w-4 h-4" />
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.main>
        </div>
      </div>
    </div>
  );
};

export default Profile;
