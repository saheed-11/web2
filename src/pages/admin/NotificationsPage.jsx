import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  Check,
  CheckCheck,
  Calendar,
  Award,
  Users,
  Mail,
  AlertCircle,
  Trash2,
  Loader,
} from 'lucide-react';
import { adminService } from '../../services/authService';
import { formatDate } from '../../utils/helpers';
import { useToast } from '../../hooks/useToast';
import ToastContainer from '../../components/ToastContainer';

const NotificationsPage = () => {
  const { toasts, hideToast, showSuccess, showError } = useToast();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await adminService.getNotifications();
      setNotifications(data.notifications || []);
    } catch (error) {
      showError('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await adminService.markNotificationRead(id);
      setNotifications(prev =>
        prev.map(n => n._id === id ? { ...n, read: true } : n)
      );
    } catch (error) {
      showError('Failed to mark as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await adminService.markAllNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      showSuccess('All notifications marked as read');
    } catch (error) {
      showError('Failed to mark all as read');
    }
  };

  const getIcon = (type) => {
    const icons = {
      event: Calendar,
      registration: Users,
      certificate: Award,
      email: Mail,
      system: AlertCircle,
    };
    return icons[type] || Bell;
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'read') return n.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Notifications</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="flex items-center gap-2 px-4 py-2 bg-ieee-blue/10 text-ieee-blue rounded-xl hover:bg-ieee-blue/20 transition-colors"
          >
            <CheckCheck className="w-4 h-4" />
            Mark All Read
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {['all', 'unread', 'read'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-ieee-blue text-white'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f === 'unread' && unreadCount > 0 && (
              <span className="ml-2 px-1.5 py-0.5 bg-white/20 rounded-full text-xs">
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        {filteredNotifications.length > 0 ? (
          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {filteredNotifications.map((notification) => {
              const Icon = getIcon(notification.type);
              return (
                <motion.div
                  key={notification._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`p-4 flex items-start gap-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${
                    !notification.read ? 'bg-ieee-blue/5' : ''
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    notification.read
                      ? 'bg-slate-100 dark:bg-slate-700'
                      : 'bg-ieee-blue/10'
                  }`}>
                    <Icon className={`w-5 h-5 ${
                      notification.read
                        ? 'text-slate-500 dark:text-slate-400'
                        : 'text-ieee-blue'
                    }`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium ${
                      notification.read
                        ? 'text-slate-700 dark:text-slate-300'
                        : 'text-slate-900 dark:text-white'
                    }`}>
                      {notification.title}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                      {formatDate(notification.createdAt)}
                    </p>
                  </div>

                  {!notification.read && (
                    <button
                      onClick={() => handleMarkAsRead(notification._id)}
                      className="flex-shrink-0 p-2 text-slate-400 hover:text-ieee-blue hover:bg-ieee-blue/10 rounded-lg transition-colors"
                      title="Mark as read"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center">
            <Bell className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-slate-500 dark:text-slate-400">
              {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
