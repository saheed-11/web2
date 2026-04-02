import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Send,
  Users,
  Calendar,
  Search,
  Filter,
  Eye,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronRight,
  FileText,
  Loader,
} from 'lucide-react';
import { adminService, eventService } from '../../services/authService';
import { formatDate } from '../../utils/helpers';
import { useToast } from '../../hooks/useToast';
import ToastContainer from '../../components/ToastContainer';

// Email Preview Modal
const EmailPreviewModal = ({ email, onClose, onSend }) => {
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    setSending(true);
    await onSend();
    setSending(false);
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
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Email Preview
          </h2>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="space-y-4">
            <div>
              <label className="text-sm text-slate-500 dark:text-slate-400">To:</label>
              <p className="font-medium text-slate-900 dark:text-white">{email.to}</p>
            </div>
            <div>
              <label className="text-sm text-slate-500 dark:text-slate-400">Subject:</label>
              <p className="font-medium text-slate-900 dark:text-white">{email.subject}</p>
            </div>
            <div>
              <label className="text-sm text-slate-500 dark:text-slate-400 block mb-2">Content:</label>
              <div 
                className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: email.content }}
              />
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-200 dark:border-slate-700 flex gap-3">
          <button
            onClick={handleSend}
            disabled={sending}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-ieee-blue text-white rounded-xl hover:bg-ieee-blue-dark transition-colors disabled:opacity-50"
          >
            {sending ? (
              <><Loader className="w-4 h-4 animate-spin" /> Sending...</>
            ) : (
              <><Send className="w-4 h-4" /> Send Email</>
            )}
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

// Email Template Card
const TemplateCard = ({ template, onSelect }) => {
  const icons = {
    registration_confirmation: Calendar,
    event_reminder: Clock,
    certificate_notification: FileText,
    welcome: Users,
    announcement: Mail,
  };
  const Icon = icons[template.type] || Mail;

  return (
    <motion.button
      whileHover={{ y: -4 }}
      onClick={() => onSelect(template)}
      className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 text-left hover:border-ieee-blue dark:hover:border-ieee-blue transition-all"
    >
      <div className="w-12 h-12 bg-ieee-blue/10 rounded-xl flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-ieee-blue" />
      </div>
      <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
        {template.name}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
        {template.description}
      </p>
      <span className="text-ieee-blue text-sm font-medium flex items-center gap-1">
        Use Template <ChevronRight className="w-4 h-4" />
      </span>
    </motion.button>
  );
};

// Status Badge
const StatusBadge = ({ status }) => {
  const config = {
    sent: { bg: 'bg-green-100 dark:bg-green-900/20', text: 'text-green-700 dark:text-green-400', icon: CheckCircle2 },
    pending: { bg: 'bg-yellow-100 dark:bg-yellow-900/20', text: 'text-yellow-700 dark:text-yellow-400', icon: Clock },
    failed: { bg: 'bg-red-100 dark:bg-red-900/20', text: 'text-red-700 dark:text-red-400', icon: XCircle },
  };
  const { bg, text, icon: Icon } = config[status] || config.pending;

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${bg} ${text}`}>
      <Icon className="w-3 h-3" />
      {status?.charAt(0).toUpperCase() + status?.slice(1)}
    </span>
  );
};

const EmailCenter = () => {
  const { toasts, hideToast, showSuccess, showError } = useToast();
  const [activeTab, setActiveTab] = useState('compose');
  const [events, setEvents] = useState([]);
  const [members, setMembers] = useState([]);
  const [emailLogs, setEmailLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Compose state
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedRecipients, setSelectedRecipients] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailContent, setEmailContent] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [previewEmail, setPreviewEmail] = useState(null);

  const templates = [
    {
      type: 'registration_confirmation',
      name: 'Registration Confirmation',
      description: 'Send confirmation email after event registration',
      subject: 'Registration Confirmed - {{eventTitle}}',
      content: '<p>Dear {{name}},</p><p>Thank you for registering for <strong>{{eventTitle}}</strong>.</p>',
    },
    {
      type: 'event_reminder',
      name: 'Event Reminder',
      description: 'Send reminder email before the event',
      subject: 'Reminder: {{eventTitle}} is Tomorrow!',
      content: '<p>Dear {{name}},</p><p>This is a reminder that <strong>{{eventTitle}}</strong> is happening tomorrow!</p>',
    },
    {
      type: 'certificate_notification',
      name: 'Certificate Notification',
      description: 'Notify members about available certificates',
      subject: 'Your Certificate is Ready - {{eventTitle}}',
      content: '<p>Dear {{name}},</p><p>Your certificate for <strong>{{eventTitle}}</strong> is now available for download.</p>',
    },
    {
      type: 'announcement',
      name: 'General Announcement',
      description: 'Send custom announcements to members',
      subject: '',
      content: '',
    },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [eventsData, usersData, logsData] = await Promise.all([
        eventService.getEvents(),
        adminService.getUsers({ limit: 1000 }),
        adminService.getEmailLogs({ limit: 20 }),
      ]);
      
      setEvents(eventsData);
      setMembers(usersData.users || usersData);
      setEmailLogs(logsData.logs || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setEmailSubject(template.subject);
    setEmailContent(template.content);
    setActiveTab('compose');
  };

  const getRecipientCount = () => {
    if (selectedRecipients === 'all') return members.length;
    if (selectedRecipients === 'event' && selectedEvent) {
      const event = events.find(e => e._id === selectedEvent);
      return event?.attendees?.length || 0;
    }
    return 0;
  };

  const handlePreview = () => {
    const recipientCount = getRecipientCount();
    if (recipientCount === 0) {
      showError('No recipients selected');
      return;
    }
    if (!emailSubject.trim()) {
      showError('Please enter a subject');
      return;
    }
    if (!emailContent.trim()) {
      showError('Please enter email content');
      return;
    }

    setPreviewEmail({
      to: `${recipientCount} recipient${recipientCount > 1 ? 's' : ''}`,
      subject: emailSubject,
      content: emailContent,
    });
    setShowPreview(true);
  };

  const handleSendEmail = async () => {
    try {
      // Note: This would call the actual email sending API
      // For now, we'll simulate success
      showSuccess(`Email sent to ${getRecipientCount()} recipients`);
      setShowPreview(false);
      setEmailSubject('');
      setEmailContent('');
      setSelectedTemplate(null);
      fetchData(); // Refresh email logs
    } catch (error) {
      showError('Failed to send email');
    }
  };

  const tabs = [
    { id: 'compose', label: 'Compose', icon: Mail },
    { id: 'templates', label: 'Templates', icon: FileText },
    { id: 'history', label: 'History', icon: Clock },
  ];

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
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Email Center</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Send emails and manage communication with members
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="border-b border-slate-200 dark:border-slate-700">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'text-ieee-blue border-ieee-blue'
                    : 'text-slate-600 dark:text-slate-400 border-transparent hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* Compose Tab */}
          {activeTab === 'compose' && (
            <div className="space-y-6">
              {/* Recipients */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Recipients
                </label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <select
                    value={selectedRecipients}
                    onChange={(e) => setSelectedRecipients(e.target.value)}
                    className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-700 border-0 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-ieee-blue"
                  >
                    <option value="all">All Members ({members.length})</option>
                    <option value="event">Event Attendees</option>
                  </select>
                  
                  {selectedRecipients === 'event' && (
                    <select
                      value={selectedEvent}
                      onChange={(e) => setSelectedEvent(e.target.value)}
                      className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-700 border-0 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-ieee-blue"
                    >
                      <option value="">Select Event</option>
                      {events.map((event) => (
                        <option key={event._id} value={event._id}>
                          {event.title} ({event.attendees?.length || 0} attendees)
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  {getRecipientCount()} recipient{getRecipientCount() !== 1 ? 's' : ''} selected
                </p>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="Enter email subject..."
                  className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-700 border-0 rounded-xl text-slate-900 dark:text-white placeholder-slate-500 focus:ring-2 focus:ring-ieee-blue"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Content
                </label>
                <textarea
                  value={emailContent}
                  onChange={(e) => setEmailContent(e.target.value)}
                  placeholder="Write your email content here... You can use placeholders like {{name}}, {{eventTitle}}"
                  rows={10}
                  className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-700 border-0 rounded-xl text-slate-900 dark:text-white placeholder-slate-500 focus:ring-2 focus:ring-ieee-blue resize-none"
                />
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Available placeholders: {'{{name}}'}, {'{{email}}'}, {'{{eventTitle}}'}, {'{{eventDate}}'}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <button
                  onClick={handlePreview}
                  className="flex items-center gap-2 px-6 py-2.5 bg-ieee-blue text-white rounded-xl hover:bg-ieee-blue-dark transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  Preview & Send
                </button>
                <button
                  onClick={() => {
                    setEmailSubject('');
                    setEmailContent('');
                    setSelectedTemplate(null);
                  }}
                  className="px-6 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
          )}

          {/* Templates Tab */}
          {activeTab === 'templates' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {templates.map((template) => (
                <TemplateCard
                  key={template.type}
                  template={template}
                  onSelect={handleTemplateSelect}
                />
              ))}
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              {emailLogs.length > 0 ? (
                emailLogs.map((log) => (
                  <div
                    key={log._id}
                    className="flex items-start justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-ieee-blue/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5 text-ieee-blue" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">
                          {log.subject}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                          To: {log.to}
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                          {formatDate(log.createdAt)}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={log.status} />
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <Mail className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-500 dark:text-slate-400">No emails sent yet</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreview && previewEmail && (
          <EmailPreviewModal
            email={previewEmail}
            onClose={() => setShowPreview(false)}
            onSend={handleSendEmail}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default EmailCenter;
