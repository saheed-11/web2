import { useState, useEffect } from 'react';
import {
  Save,
  RefreshCw,
  FolderOpen,
  Link as LinkIcon,
  CheckCircle,
  XCircle,
  AlertCircle,
  Upload,
  Download,
  Star,
  Plus,
  Eye,
  Calendar,
} from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ReviewCertificatesTab = ({ event, onRefresh }) => {
  const [activeSection, setActiveSection] = useState('review-form');
  const [reviewFormFields, setReviewFormFields] = useState([]);
  const [reviewDeadline, setReviewDeadline] = useState('');
  const [certificateConfig, setCertificateConfig] = useState({
    driveFolderId: '',
    driveFolderUrl: '',
  });
  const [syncLog, setSyncLog] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (event) {
      setReviewFormFields(event.reviewFormFields || []);
      setReviewDeadline(
        event.reviewSubmissionDeadline
          ? new Date(event.reviewSubmissionDeadline).toISOString().split('T')[0]
          : ''
      );
      setCertificateConfig({
        driveFolderId: event.certificatesDriveFolderId || '',
        driveFolderUrl: event.certificatesDriveFolderUrl || '',
      });
      if (event.lastCertificateSync) {
        setSyncLog(event.lastCertificateSync);
      }
    }
  }, [event]);

  const defaultReviewFields = [
    {
      fieldId: 'overall-rating',
      type: 'rating',
      label: 'Overall Event Rating',
      required: true,
      order: 0,
    },
    {
      fieldId: 'liked-most',
      type: 'paragraph',
      label: 'What did you like most about this event?',
      required: true,
      order: 1,
    },
    {
      fieldId: 'improvements',
      type: 'paragraph',
      label: 'What could be improved?',
      required: false,
      order: 2,
    },
    {
      fieldId: 'future-events',
      type: 'radio',
      label: 'Would you attend future IEEE events?',
      options: ['Yes', 'No', 'Maybe'],
      required: true,
      order: 3,
    },
    {
      fieldId: 'additional-comments',
      type: 'paragraph',
      label: 'Any additional comments',
      required: false,
      order: 4,
    },
  ];

  const handleLoadDefaultForm = () => {
    setReviewFormFields(defaultReviewFields);
  };

  const handleSaveReviewForm = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_URL}/events/${event._id}`,
        {
          reviewFormFields,
          reviewSubmissionDeadline: reviewDeadline || null,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onRefresh();
      alert('Review form saved successfully');
    } catch (error) {
      console.error('Error saving review form:', error);
      alert('Failed to save review form');
    } finally {
      setSaving(false);
    }
  };

  const handleSyncCertificates = async () => {
    if (!certificateConfig.driveFolderId && !certificateConfig.driveFolderUrl) {
      alert('Please enter a Google Drive folder ID or URL first');
      return;
    }

    try {
      setSyncing(true);
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/admin/events/${event._id}/sync-certificates`,
        {
          driveFolderId: certificateConfig.driveFolderId,
          driveFolderUrl: certificateConfig.driveFolderUrl,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSyncLog(response.data);
      onRefresh();
      alert(`Certificate sync complete! Matched: ${response.data.matchedCount}`);
    } catch (error) {
      console.error('Error syncing certificates:', error);
      alert(error.response?.data?.message || 'Failed to sync certificates');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Review & Certificates
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Manage post-event feedback and certificate distribution
          </p>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700">
        <button
          onClick={() => setActiveSection('review-form')}
          className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
            activeSection === 'review-form'
              ? 'border-ieee-blue text-ieee-blue'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Review Form Builder
        </button>
        <button
          onClick={() => setActiveSection('certificates')}
          className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
            activeSection === 'certificates'
              ? 'border-ieee-blue text-ieee-blue'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Certificate Management
        </button>
      </div>

      {/* Review Form Builder Section */}
      {activeSection === 'review-form' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Post-Event Review Form
              </h3>
              <button
                onClick={handleLoadDefaultForm}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors flex items-center gap-2 text-sm"
              >
                <Plus className="w-4 h-4" />
                Load Default Form
              </button>
            </div>

            {/* Review Deadline */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Review Submission Deadline
              </label>
              <input
                type="date"
                value={reviewDeadline}
                onChange={(e) => setReviewDeadline(e.target.value)}
                className="w-full max-w-md px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-ieee-blue dark:bg-slate-700 dark:text-white"
              />
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                Participants must submit their review before this date to unlock their certificate
              </p>
            </div>

            {/* Form Fields Preview */}
            <div className="space-y-4">
              <h4 className="font-medium text-slate-900 dark:text-white">Form Fields</h4>
              {reviewFormFields.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                  <p className="text-slate-500 dark:text-slate-400">
                    No review form configured. Click "Load Default Form" to get started.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {reviewFormFields
                    .sort((a, b) => a.order - b.order)
                    .map((field, index) => (
                      <div
                        key={index}
                        className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-700"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-slate-900 dark:text-white">
                                {field.label}
                              </span>
                              {field.required && (
                                <span className="text-xs bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 px-2 py-1 rounded">
                                  Required
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                              Type: {field.type}
                              {field.options && ` • Options: ${field.options.join(', ')}`}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Save Button */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSaveReviewForm}
                disabled={saving || reviewFormFields.length === 0}
                className="px-6 py-3 bg-ieee-blue text-white rounded-xl hover:bg-ieee-blue-dark transition-colors flex items-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Review Form
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Certificate Management Section */}
      {activeSection === 'certificates' && (
        <div className="space-y-6">
          {/* Google Drive Configuration */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Google Drive Certificate Sync
            </h3>

            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">
                  How it works:
                </h4>
                <ol className="text-sm text-blue-800 dark:text-blue-300 space-y-1 list-decimal list-inside">
                  <li>Upload all participant certificates to a Google Drive folder</li>
                  <li>Name each file as: firstname_lastname.pdf (e.g., john_doe.pdf)</li>
                  <li>Share the folder with the service account (view access)</li>
                  <li>Paste the folder ID or URL below and click "Sync Certificates"</li>
                  <li>System will automatically match files to registered participants</li>
                </ol>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  <FolderOpen className="w-4 h-4 inline mr-2" />
                  Google Drive Folder URL or ID
                </label>
                <input
                  type="text"
                  value={certificateConfig.driveFolderUrl}
                  onChange={(e) =>
                    setCertificateConfig({ ...certificateConfig, driveFolderUrl: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-ieee-blue dark:bg-slate-700 dark:text-white"
                  placeholder="https://drive.google.com/drive/folders/1a2b3c4d5e6f or just the folder ID"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  The folder must be shared with the service account for access
                </p>
              </div>

              <button
                onClick={handleSyncCertificates}
                disabled={syncing || !certificateConfig.driveFolderUrl}
                className="w-full px-6 py-3 bg-ieee-blue text-white rounded-xl hover:bg-ieee-blue-dark transition-colors flex items-center justify-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {syncing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Syncing Certificates...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-5 h-5" />
                    Sync Certificates from Drive
                  </>
                )}
              </button>

              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
                <p className="text-sm text-yellow-900 dark:text-yellow-300">
                  <strong>Important:</strong> Certificates will only be unlocked for participants
                  who have:
                </p>
                <ul className="text-sm text-yellow-800 dark:text-yellow-300 mt-2 space-y-1 list-disc list-inside">
                  <li>Confirmed registration (payment approved if paid event)</li>
                  <li>Submitted the post-event review form</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Sync Log */}
          {syncLog && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Last Sync Report
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-semibold">Matched</span>
                  </div>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-300 mt-2">
                    {syncLog.matchedCount || 0}
                  </p>
                </div>

                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
                  <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
                    <XCircle className="w-5 h-5" />
                    <span className="font-semibold">Unmatched</span>
                  </div>
                  <p className="text-2xl font-bold text-red-900 dark:text-red-300 mt-2">
                    {syncLog.unmatchedCount || 0}
                  </p>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-semibold">Synced At</span>
                  </div>
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-300 mt-2">
                    {new Date(syncLog.syncedAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Unmatched Files */}
              {syncLog.unmatchedFiles && syncLog.unmatchedFiles.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium text-slate-900 dark:text-white mb-3">
                    Unmatched Files (No participant found)
                  </h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {syncLog.unmatchedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg text-sm"
                      >
                        <div className="font-mono text-slate-900 dark:text-white">
                          {file.filename}
                        </div>
                        <div className="text-slate-500 dark:text-slate-400 text-xs mt-1">
                          {file.reason}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Certificate Unlock Rules */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Certificate Unlock Logic
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                <div className="w-6 h-6 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <div className="text-sm">
                  <p className="font-medium text-slate-900 dark:text-white">Available</p>
                  <p className="text-slate-600 dark:text-slate-400">
                    Certificate matched, payment confirmed, and review submitted
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                <div className="w-6 h-6 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="text-sm">
                  <p className="font-medium text-slate-900 dark:text-white">Review Pending</p>
                  <p className="text-slate-600 dark:text-slate-400">
                    Certificate uploaded but participant hasn't submitted review
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                <div className="w-6 h-6 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                </div>
                <div className="text-sm">
                  <p className="font-medium text-slate-900 dark:text-white">Not Uploaded</p>
                  <p className="text-slate-600 dark:text-slate-400">
                    No matching certificate file found in Drive folder
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewCertificatesTab;
