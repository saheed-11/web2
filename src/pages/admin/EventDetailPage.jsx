import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Settings as SettingsIcon,
  Layout,
  FormInput,
  Users,
  CreditCard,
  BarChart3,
  Award,
  Loader,
} from 'lucide-react';
import { eventService } from '../../services/authService';
import { useToast } from '../../hooks/useToast';
import ToastContainer from '../../components/ToastContainer';

// Import tab components
import OverviewTab from '../../components/admin/event-detail/OverviewTab';
import FormBuilderTab from '../../components/admin/event-detail/FormBuilderTab';
import ResponsesTab from '../../components/admin/event-detail/ResponsesTab';
import PaymentsTab from '../../components/admin/event-detail/PaymentsTab';
import AnalyticsTab from '../../components/admin/event-detail/AnalyticsTab';
import ReviewCertificatesTab from '../../components/admin/event-detail/ReviewCertificatesTab';
import EventSettingsTab from '../../components/admin/event-detail/EventSettingsTab';

const tabs = [
  { id: 'overview', label: 'Overview', icon: Layout },
  { id: 'form-builder', label: 'Form Builder', icon: FormInput },
  { id: 'responses', label: 'Responses', icon: Users },
  { id: 'payments', label: 'Payments', icon: CreditCard },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'review-certificates', label: 'Review & Certificates', icon: Award },
  { id: 'settings', label: 'Settings', icon: SettingsIcon },
];

const EventDetailPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { toasts, hideToast, showSuccess, showError } = useToast();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchEvent();
  }, [eventId]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const data = await eventService.getEvent(eventId);
      setEvent(data);
    } catch (error) {
      showError('Failed to load event');
      console.error('Fetch event error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEvent = async (updatedData) => {
    try {
      setSaving(true);
      await eventService.updateEvent(eventId, updatedData);
      showSuccess('Event updated successfully');
      fetchEvent();
    } catch (error) {
      showError('Failed to update event');
      console.error('Save event error:', error);
    } finally {
      setSaving(false);
    }
  };

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <Loader className="w-8 h-8 animate-spin text-ieee-blue" />
        </div>
      );
    }

    if (!event) {
      return (
        <div className="text-center py-12">
          <p className="text-slate-500 dark:text-slate-400">Event not found</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'overview':
        return <OverviewTab event={event} onSave={handleSaveEvent} saving={saving} />;
      case 'form-builder':
        return <FormBuilderTab event={event} onSave={handleSaveEvent} saving={saving} />;
      case 'responses':
        return <ResponsesTab event={event} />;
      case 'payments':
        return <PaymentsTab event={event} />;
      case 'analytics':
        return <AnalyticsTab event={event} />;
      case 'review-certificates':
        return <ReviewCertificatesTab event={event} onRefresh={fetchEvent} />;
      case 'settings':
        return <EventSettingsTab event={event} onSave={handleSaveEvent} saving={saving} />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <Loader className="w-12 h-12 animate-spin text-ieee-blue" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <ToastContainer toasts={toasts} hideToast={hideToast} />

      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top section with back button and event title */}
          <div className="py-6">
            <button
              onClick={() => navigate('/admin/events')}
              className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Events
            </button>

            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                  {event?.title || 'Event Details'}
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">
                  Manage all aspects of your event from this dashboard
                </p>
              </div>

              {/* Quick stats */}
              <div className="flex gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    {event?.attendees?.length || 0}
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">Registered</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    {event?.maxAttendees || 0}
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">Capacity</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-ieee-blue">
                    {Math.round(((event?.attendees?.length || 0) / (event?.maxAttendees || 1)) * 100)}%
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">Filled</div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    relative flex items-center gap-2 px-4 py-3 font-medium text-sm whitespace-nowrap transition-colors
                    ${
                      isActive
                        ? 'text-ieee-blue dark:text-ieee-blue'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}

                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-ieee-blue"
                      initial={false}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {renderTabContent()}
        </motion.div>
      </div>
    </div>
  );
};

export default EventDetailPage;
