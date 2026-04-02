import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award,
  Upload,
  Search,
  Calendar,
  Users,
  Download,
  CheckCircle2,
  X,
  FileText,
  Loader,
  Mail,
} from 'lucide-react';
import { adminService, eventService } from '../../services/authService';
import { formatDate } from '../../utils/helpers';
import { useToast } from '../../hooks/useToast';
import ToastContainer from '../../components/ToastContainer';

const CertificatesManager = () => {
  const { toasts, hideToast, showSuccess, showError } = useToast();
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [eventsData, usersData] = await Promise.all([
        eventService.getEvents(),
        adminService.getUsers({ limit: 1000 }),
      ]);
      setEvents(eventsData);
      setUsers(usersData.users || usersData);
    } catch (error) {
      showError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  // Get registered users for selected event
  const registeredUsers = selectedEvent
    ? users.filter(user =>
        user.registeredEvents?.some(
          (reg) => reg.event?._id === selectedEvent || reg.event === selectedEvent
        )
      )
    : [];

  // Get certificate status for a user in the selected event
  const getUserCertificateStatus = (user) => {
    const reg = user.registeredEvents?.find(
      (r) => r.event?._id === selectedEvent || r.event === selectedEvent
    );
    return {
      attended: reg?.attended || false,
      hasCertificate: !!reg?.certificateUrl,
      certificateUrl: reg?.certificateUrl,
    };
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (validateFile(droppedFile)) {
        setFile(droppedFile);
      }
    }
  };

  const validateFile = (file) => {
    const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      showError('Please upload a PDF, JPG, or PNG file');
      return false;
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      showError('File size must be less than 5MB');
      return false;
    }
    return true;
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedEvent) {
      showError('Please select an event');
      return;
    }
    if (!selectedUser) {
      showError('Please select a student');
      return;
    }
    if (!file) {
      showError('Please select a certificate file');
      return;
    }

    setUploading(true);
    try {
      await adminService.uploadCertificate(selectedEvent, selectedUser, file);
      showSuccess('Certificate uploaded successfully');
      setFile(null);
      setSelectedUser('');
      fetchData(); // Refresh data
    } catch (error) {
      showError('Failed to upload certificate');
    } finally {
      setUploading(false);
    }
  };

  // Get event statistics
  const getEventStats = () => {
    if (!selectedEvent) return null;
    const event = events.find(e => e._id === selectedEvent);
    const total = registeredUsers.length;
    const withCertificates = registeredUsers.filter(u => getUserCertificateStatus(u).hasCertificate).length;
    const attended = registeredUsers.filter(u => getUserCertificateStatus(u).attended).length;

    return { total, withCertificates, attended };
  };

  const stats = getEventStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ieee-blue"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ToastContainer toasts={toasts} hideToast={hideToast} />

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Certificates</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Upload and manage event certificates for participants
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Section */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 space-y-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Upload className="w-5 h-5 text-ieee-blue" />
              Upload Certificate
            </h2>

            {/* Event Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Select Event
              </label>
              <select
                value={selectedEvent}
                onChange={(e) => {
                  setSelectedEvent(e.target.value);
                  setSelectedUser('');
                }}
                className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-700 border-0 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-ieee-blue"
              >
                <option value="">Choose an event</option>
                {events.map((event) => (
                  <option key={event._id} value={event._id}>
                    {event.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Student Selection */}
            {selectedEvent && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Select Student ({registeredUsers.length} registered)
                </label>
                <select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-700 border-0 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-ieee-blue"
                >
                  <option value="">Choose a student</option>
                  {registeredUsers.map((user) => {
                    const status = getUserCertificateStatus(user);
                    return (
                      <option key={user._id} value={user._id}>
                        {user.name} {status.hasCertificate ? '✓' : ''}
                      </option>
                    );
                  })}
                </select>
                {registeredUsers.length === 0 && (
                  <p className="mt-2 text-sm text-amber-600 dark:text-amber-400">
                    No students registered for this event
                  </p>
                )}
              </div>
            )}

            {/* File Upload */}
            {selectedEvent && selectedUser && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Certificate File
                </label>
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                    dragActive
                      ? 'border-ieee-blue bg-ieee-blue/5'
                      : file
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/10'
                      : 'border-slate-300 dark:border-slate-600 hover:border-ieee-blue'
                  }`}
                >
                  {file ? (
                    <div className="flex items-center justify-center gap-3">
                      <FileText className="w-8 h-8 text-green-500" />
                      <div className="text-left">
                        <p className="font-medium text-slate-900 dark:text-white">{file.name}</p>
                        <p className="text-sm text-slate-500">
                          {(file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      <button
                        onClick={() => setFile(null)}
                        className="p-1 text-slate-400 hover:text-red-500"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                      <p className="text-slate-600 dark:text-slate-400 mb-2">
                        Drag & drop or click to upload
                      </p>
                      <p className="text-xs text-slate-500">
                        PDF, JPG, or PNG (max 5MB)
                      </p>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Upload Button */}
            <button
              onClick={handleUpload}
              disabled={!selectedEvent || !selectedUser || !file || uploading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-ieee-blue text-white rounded-xl hover:bg-ieee-blue-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <><Loader className="w-4 h-4 animate-spin" /> Uploading...</>
              ) : (
                <><Upload className="w-4 h-4" /> Upload Certificate</>
              )}
            </button>
          </div>
        </div>

        {/* Certificate List */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            {/* Stats Header */}
            {selectedEvent && stats && (
              <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Total Registered</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.withCertificates}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Certificates Issued</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.attended}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Marked Attended</p>
                  </div>
                </div>
              </div>
            )}

            {/* Participants List */}
            <div className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                {selectedEvent ? 'Registered Participants' : 'Select an event to view participants'}
              </h3>
              
              {selectedEvent ? (
                registeredUsers.length > 0 ? (
                  <div className="space-y-3">
                    {registeredUsers.map((user) => {
                      const status = getUserCertificateStatus(user);
                      return (
                        <div
                          key={user._id}
                          className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-ieee-blue to-ieee-blue-dark rounded-full flex items-center justify-center">
                              <span className="text-white font-semibold text-sm">
                                {user.name?.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-slate-900 dark:text-white">
                                {user.name}
                              </p>
                              <p className="text-sm text-slate-500 dark:text-slate-400">
                                {user.email}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {status.attended && (
                              <span className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm">
                                <CheckCircle2 className="w-4 h-4" />
                                Attended
                              </span>
                            )}
                            {status.hasCertificate ? (
                              <a
                                href={`http://localhost:5000${status.certificateUrl}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 px-3 py-1.5 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg text-sm font-medium hover:bg-green-200 dark:hover:bg-green-900/30 transition-colors"
                              >
                                <Download className="w-4 h-4" />
                                Certificate
                              </a>
                            ) : (
                              <span className="text-sm text-slate-400">No certificate</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-500 dark:text-slate-400">
                      No participants registered for this event
                    </p>
                  </div>
                )
              ) : (
                <div className="text-center py-12">
                  <Calendar className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-500 dark:text-slate-400">
                    Select an event from the dropdown to view participants
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificatesManager;
