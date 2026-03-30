import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, BookOpen, Calendar, Download, Award, Loader, Edit2, Save, X } from 'lucide-react';
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
      // Refetch profile to get updated data including registered events
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-12 h-12 animate-spin text-ieee-blue" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-4">
      <ToastContainer toasts={toasts} hideToast={hideToast} />
      <div className="container-custom max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gradient-to-br from-ieee-blue to-ieee-blue-dark rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                    {profile?.name}
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400 capitalize">
                    {profile?.role} Member
                  </p>
                </div>
              </div>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-ieee-blue text-white rounded-lg hover:bg-ieee-blue-dark transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Profile
                </button>
              )}
            </div>

            {/* Profile Info */}
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
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-ieee-blue dark:bg-slate-700 dark:text-white"
                  />
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                    <User className="w-5 h-5 text-slate-400" />
                    <span className="text-slate-900 dark:text-white">{profile?.name}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Email Address
                </label>
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                  <Mail className="w-5 h-5 text-slate-400" />
                  <span className="text-slate-900 dark:text-white">{profile?.email}</span>
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
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-ieee-blue dark:bg-slate-700 dark:text-white"
                    placeholder="+1234567890"
                  />
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
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
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-ieee-blue dark:bg-slate-700 dark:text-white"
                  >
                    <option value="">Select</option>
                    <option value="Computer Science">CS</option>
                    <option value="Electrical">EE</option>
                    <option value="Electronics">ECE</option>
                    <option value="Mechanical">ME</option>
                    <option value="Civil">CE</option>
                    <option value="Other">Other</option>
                  </select>
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                    <BookOpen className="w-5 h-5 text-slate-400" />
                    <span className="text-slate-900 dark:text-white">{profile?.department || 'Not provided'}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Year
                </label>
                {isEditing ? (
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-ieee-blue dark:bg-slate-700 dark:text-white"
                  >
                    <option value="">Select</option>
                    <option value="1st">1st</option>
                    <option value="2nd">2nd</option>
                    <option value="3rd">3rd</option>
                    <option value="4th">4th</option>
                  </select>
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                    <Calendar className="w-5 h-5 text-slate-400" />
                    <span className="text-slate-900 dark:text-white">{profile?.year || 'Not provided'}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Member Since
                </label>
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                  <Calendar className="w-5 h-5 text-slate-400" />
                  <span className="text-slate-900 dark:text-white">
                    {profile?.createdAt ? formatDate(profile.createdAt) : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex gap-4 mt-6">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-3 bg-ieee-blue text-white rounded-lg hover:bg-ieee-blue-dark transition-colors disabled:opacity-50"
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
                  className="flex items-center gap-2 px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Registered Events */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <Award className="w-6 h-6 text-ieee-blue" />
              My Events
            </h2>

            {profile?.registeredEvents && profile.registeredEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {profile.registeredEvents.map((reg) => (
                  <div
                    key={reg._id}
                    className="border border-slate-200 dark:border-slate-700 rounded-xl p-6 hover:shadow-lg transition-shadow"
                  >
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                      {reg.event?.title || 'Event'}
                    </h3>
                    <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                      <p>
                        Registered: {formatDate(reg.registeredAt)}
                      </p>
                      <p className="flex items-center gap-2">
                        Status:
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          reg.attended
                            ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                            : 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                        }`}>
                          {reg.attended ? 'Attended' : 'Registered'}
                        </span>
                      </p>
                      {reg.certificateUrl && (
                        <a
                          href={`http://localhost:5000${reg.certificateUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-ieee-blue hover:text-ieee-blue-dark transition-colors mt-3"
                        >
                          <Download className="w-4 h-4" />
                          Download Certificate
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-600 dark:text-slate-400 text-center py-8">
                You haven't registered for any events yet.
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
