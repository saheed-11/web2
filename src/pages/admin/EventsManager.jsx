import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  Calendar,
  MapPin,
  Users,
  Clock,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  CheckCircle2,
  XCircle,
  AlertCircle,
  QrCode,
  ChevronLeft,
  ChevronRight,
  Download,
  Upload,
} from 'lucide-react';
import { adminService, eventService } from '../../services/authService';
import { formatDate } from '../../utils/helpers';
import EventModal from '../../components/admin/EventModal';
import { useToast } from '../../hooks/useToast';
import ToastContainer from '../../components/ToastContainer';

// Status Badge Component
const StatusBadge = ({ status }) => {
  const statusConfig = {
    upcoming: { bg: 'bg-orange-100 dark:bg-orange-900/20', text: 'text-orange-700 dark:text-orange-400', icon: Clock },
    ongoing: { bg: 'bg-blue-100 dark:bg-blue-900/20', text: 'text-blue-700 dark:text-blue-400', icon: AlertCircle },
    completed: { bg: 'bg-green-100 dark:bg-green-900/20', text: 'text-green-700 dark:text-green-400', icon: CheckCircle2 },
    cancelled: { bg: 'bg-red-100 dark:bg-red-900/20', text: 'text-red-700 dark:text-red-400', icon: XCircle },
  };

  const config = statusConfig[status] || statusConfig.upcoming;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      <Icon className="w-3 h-3" />
      {status?.charAt(0).toUpperCase() + status?.slice(1)}
    </span>
  );
};

// Event Card Component
const EventCard = ({ event, onEdit, onDelete, onToggleRegistration, onGenerateQR, onViewDetails }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
      onClick={() => onViewDetails(event)}
    >
      {/* Event Image */}
      <div className="relative h-40 bg-gradient-to-br from-ieee-blue to-ieee-blue-dark overflow-hidden">
        {event.image && (
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover opacity-80"
          />
        )}
        <div className="absolute top-3 left-3">
          <StatusBadge status={event.status} />
        </div>
        <div className="absolute top-3 right-3">
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            <AnimatePresence>
              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowMenu(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-20 overflow-hidden"
                  >
                    <button
                      onClick={() => { onEdit(event); setShowMenu(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                      <Edit className="w-4 h-4" /> Edit Event
                    </button>
                    <button
                      onClick={() => { onToggleRegistration(event); setShowMenu(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                      {event.registrationOpen ? (
                        <><XCircle className="w-4 h-4" /> Close Registration</>
                      ) : (
                        <><CheckCircle2 className="w-4 h-4" /> Open Registration</>
                      )}
                    </button>
                    <button
                      onClick={() => { onGenerateQR(event); setShowMenu(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                      <QrCode className="w-4 h-4" /> Generate QR Code
                    </button>
                    <button
                      onClick={() => { onDelete(event._id); setShowMenu(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="w-4 h-4" /> Delete Event
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
        <div className="absolute bottom-3 left-3">
          <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-medium">
            {event.category || event.type}
          </span>
        </div>
      </div>

      {/* Event Content */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 line-clamp-1">
          {event.title}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
          {event.description}
        </p>

        {/* Event Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(event.date)}</span>
            <span className="mx-1">•</span>
            <Clock className="w-4 h-4" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <MapPin className="w-4 h-4" />
            <span className="truncate">{event.location}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-600 dark:text-slate-400">
              <span className="font-semibold text-slate-900 dark:text-white">
                {event.attendees?.length || 0}
              </span>
              /{event.maxAttendees}
            </span>
          </div>
          <div className={`px-2.5 py-1 rounded-full text-xs font-medium ${
            event.registrationOpen
              ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
              : 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400'
          }`}>
            {event.registrationOpen ? 'Registration Open' : 'Registration Closed'}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// QR Code Modal
const QRCodeModal = ({ event, qrCode, onClose }) => (
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
      className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-sm w-full"
    >
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 text-center">
        Event QR Code
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-4">
        {event.title}
      </p>
      <div className="bg-white p-4 rounded-xl flex items-center justify-center">
        {qrCode ? (
          <img src={qrCode} alt="QR Code" className="w-64 h-64" />
        ) : (
          <div className="w-64 h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ieee-blue"></div>
          </div>
        )}
      </div>
      <div className="mt-4 flex gap-3">
        <button
          onClick={() => {
            const link = document.createElement('a');
            link.download = `qr-${event.title.replace(/\s+/g, '-')}.png`;
            link.href = qrCode;
            link.click();
          }}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-ieee-blue text-white rounded-xl hover:bg-ieee-blue-dark transition-colors"
        >
          <Download className="w-4 h-4" />
          Download
        </button>
        <button
          onClick={onClose}
          className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
        >
          Close
        </button>
      </div>
    </motion.div>
  </motion.div>
);

const EventsManager = () => {
  const { toasts, hideToast, showSuccess, showError } = useToast();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrCode, setQrCode] = useState(null);
  const [qrEvent, setQrEvent] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 9;

  const categories = ['Workshop', 'Bootcamp', 'Seminar', 'Conference', 'Competition', 'Hackathon', 'Webinar', 'Tech Talk', 'Networking', 'Other'];
  const statuses = ['upcoming', 'ongoing', 'completed', 'cancelled'];

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const data = await eventService.getEvents();
      setEvents(data);
    } catch (error) {
      showError('Failed to fetch events');
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
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      await eventService.deleteEvent(eventId);
      showSuccess('Event deleted successfully');
      fetchEvents();
    } catch (error) {
      showError('Failed to delete event');
    }
  };

  const handleToggleRegistration = async (event) => {
    try {
      await eventService.updateEvent(event._id, {
        registrationOpen: !event.registrationOpen,
      });
      showSuccess(`Registration ${event.registrationOpen ? 'closed' : 'opened'} successfully`);
      fetchEvents();
    } catch (error) {
      showError('Failed to update registration status');
    }
  };

  const handleGenerateQR = async (event) => {
    setQrEvent(event);
    setQrCode(null);
    setShowQRModal(true);

    try {
      const result = await adminService.generateEventQR(event._id);
      setQrCode(result.qrCode);
    } catch (error) {
      showError('Failed to generate QR code');
      setShowQRModal(false);
    }
  };

  const handleUpdateEventStatus = async (eventId, status) => {
    try {
      await eventService.updateEvent(eventId, { status });
      showSuccess('Event status updated');
      fetchEvents();
    } catch (error) {
      showError('Failed to update event status');
    }
  };

  const handleViewDetails = (event) => {
    navigate(`/admin/events/${event._id}`);
  };

  // Filter events
  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || 
                            event.category === categoryFilter || 
                            event.type === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Pagination
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * eventsPerPage,
    currentPage * eventsPerPage
  );

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Events</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Manage your chapter events and registrations
          </p>
        </div>
        <button
          onClick={handleCreateEvent}
          className="inline-flex items-center gap-2 px-4 py-2 bg-ieee-blue text-white rounded-xl hover:bg-ieee-blue-dark transition-colors shadow-lg shadow-ieee-blue/25"
        >
          <Plus className="w-4 h-4" />
          Create Event
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
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-700 border-0 rounded-xl text-slate-900 dark:text-white placeholder-slate-500 focus:ring-2 focus:ring-ieee-blue"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="w-full lg:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-700 border-0 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-ieee-blue"
            >
              <option value="all">All Statuses</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="w-full lg:w-48">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-700 border-0 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-ieee-blue"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Showing {paginatedEvents.length} of {filteredEvents.length} events
        </p>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {paginatedEvents.map((event) => (
            <EventCard
              key={event._id}
              event={event}
              onEdit={handleEditEvent}
              onDelete={handleDeleteEvent}
              onToggleRegistration={handleToggleRegistration}
              onGenerateQR={handleGenerateQR}
              onViewDetails={handleViewDetails}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
            No events found
          </h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            {searchQuery || statusFilter !== 'all' || categoryFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'Create your first event to get started'}
          </p>
          {!searchQuery && statusFilter === 'all' && categoryFilter === 'all' && (
            <button
              onClick={handleCreateEvent}
              className="inline-flex items-center gap-2 px-4 py-2 bg-ieee-blue text-white rounded-xl hover:bg-ieee-blue-dark transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Event
            </button>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                currentPage === page
                  ? 'bg-ieee-blue text-white'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Event Modal */}
      {showEventModal && (
        <EventModal
          event={selectedEvent}
          onClose={() => setShowEventModal(false)}
          onSave={() => {
            setShowEventModal(false);
            fetchEvents();
            showSuccess(selectedEvent ? 'Event updated successfully' : 'Event created successfully');
          }}
        />
      )}

      {/* QR Code Modal */}
      <AnimatePresence>
        {showQRModal && qrEvent && (
          <QRCodeModal
            event={qrEvent}
            qrCode={qrCode}
            onClose={() => {
              setShowQRModal(false);
              setQrCode(null);
              setQrEvent(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default EventsManager;
