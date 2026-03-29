import { useState } from 'react';
import { Upload, Loader, CheckCircle } from 'lucide-react';
import { adminService } from '../../services/authService';
import { getErrorMessage } from '../../utils/helpers';

const CertificateUpload = ({ events, users, onUploadComplete }) => {
  const [selectedEvent, setSelectedEvent] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedEvent || !selectedUser || !file) {
      setError('Please select an event, user, and upload a certificate file');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await adminService.uploadCertificate(selectedEvent, selectedUser, file);
      setSuccess('Certificate uploaded successfully!');
      setSelectedEvent('');
      setSelectedUser('');
      setFile(null);
      e.target.reset();
      onUploadComplete();
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const registeredUsers = selectedEvent
    ? users.filter((user) =>
        user.registeredEvents?.some((reg) => reg.event?._id === selectedEvent || reg.event === selectedEvent)
      )
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          Upload Certificates
        </h3>
        <p className="text-slate-600 dark:text-slate-400">
          Upload certificates for students who attended events
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-600 dark:text-green-400 flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Select Event *
            </label>
            <select
              value={selectedEvent}
              onChange={(e) => {
                setSelectedEvent(e.target.value);
                setSelectedUser('');
              }}
              required
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-ieee-blue dark:bg-slate-700 dark:text-white"
            >
              <option value="">Choose an event</option>
              {events.map((event) => (
                <option key={event._id} value={event._id}>
                  {event.title} ({event.attendees?.length || 0} attendees)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Select Student *
            </label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              required
              disabled={!selectedEvent}
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-ieee-blue dark:bg-slate-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Choose a student</option>
              {registeredUsers.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
            {selectedEvent && registeredUsers.length === 0 && (
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                No students registered for this event
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Certificate File *
          </label>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 dark:border-slate-600 border-dashed rounded-lg cursor-pointer bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-10 h-10 mb-3 text-slate-400" />
                <p className="mb-2 text-sm text-slate-600 dark:text-slate-400">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  PDF, PNG, JPG (MAX. 10MB)
                </p>
                {file && (
                  <p className="mt-2 text-sm text-ieee-blue font-medium">{file.name}</p>
                )}
              </div>
              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.png,.jpg,.jpeg"
                className="hidden"
                required
              />
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !selectedEvent || !selectedUser || !file}
          className="w-full bg-ieee-blue hover:bg-ieee-blue-dark text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              Upload Certificate
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default CertificateUpload;
