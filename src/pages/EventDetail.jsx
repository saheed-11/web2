import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, Users, ChevronLeft, CheckCircle, Loader, ArrowRight, Monitor, Video, Tag } from 'lucide-react';
import { eventService, authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import ToastContainer from '../components/ToastContainer';
import RegistrationForm from '../components/RegistrationForm';

const EventDetail = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { toasts, hideToast, showSuccess, showError } = useToast();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);

  useEffect(() => {
    fetchEvent();
  }, [eventId]);

  const fetchEvent = async () => {
    try {
      const data = await eventService.getEvent(eventId);
      setEvent(data);
    } catch (error) {
      console.error('Failed to fetch event:', error);
      showError('Failed to load event details');
      setTimeout(() => navigate('/events'), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!authService.isAuthenticated()) {
      showError('Please login to register for events');
      setTimeout(() => navigate('/login'), 1500);
      return;
    }

    // Check if event has custom fields - if so, show the form
    if (event.customFields && event.customFields.length > 0) {
      setShowRegistrationForm(true);
      return;
    }

    // Otherwise, do simple registration
    setRegistering(true);

    try {
      await eventService.registerForEvent(eventId);
      showSuccess('Successfully registered for event!');

      // Refresh event to update attendee count
      await fetchEvent();

      // Update user profile in context
      if (currentUser) {
        const updatedProfile = await authService.getProfile();
        const updatedUser = {
          ...currentUser,
          registeredEvents: updatedProfile.registeredEvents
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to register';
      showError(errorMsg);
    } finally {
      setRegistering(false);
    }
  };

  const handleFormSubmit = async (registrationData) => {
    setRegistering(true);

    try {
      const result = await eventService.registerForEventWithForm(eventId, registrationData);
      showSuccess(result.message || 'Successfully registered for event!');

      // Refresh event to update attendee count
      await fetchEvent();

      // Update user profile in context
      if (currentUser) {
        const updatedProfile = await authService.getProfile();
        const updatedUser = {
          ...currentUser,
          registeredEvents: updatedProfile.registeredEvents
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }

      // Hide form and show success
      setShowRegistrationForm(false);
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to register';
      showError(errorMsg);
    } finally {
      setRegistering(false);
    }
  };

  const isRegistered = () => {
    if (!currentUser || !event) return false;
    return event.attendees?.some(attendee =>
      attendee === currentUser._id || attendee._id === currentUser._id
    );
  };

  const isEventFull = () => {
    return event && event.attendees?.length >= event.maxAttendees;
  };

  const isEventPast = () => {
    return event && new Date(event.date) < new Date();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <Loader className="w-12 h-12 animate-spin text-ieee-blue" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Event not found</h2>
          <Link to="/events" className="text-ieee-blue hover:underline">
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-20">
      <ToastContainer toasts={toasts} hideToast={hideToast} />

      <div className="container-custom max-w-5xl mx-auto px-4">
        {/* Breadcrumb */}
        <Link
          to="/events"
          className="inline-flex items-center gap-2 text-ieee-blue hover:text-ieee-blue-dark mb-6 transition-colors"
        >
          <ChevronLeft size={20} />
          Back to Events
        </Link>

        {showRegistrationForm ? (
          <RegistrationForm
            event={event}
            onSubmit={handleFormSubmit}
            onCancel={() => setShowRegistrationForm(false)}
            loading={registering}
          />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden"
          >
          {/* Event Image */}
          <div className="relative h-96 w-full overflow-hidden">
            <img
              src={event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=600&fit=crop'}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

            {/* Event Type Badge */}
            <div className="absolute top-6 right-6 bg-white dark:bg-slate-800 px-4 py-2 rounded-full text-sm font-semibold text-ieee-blue">
              {event.type}
            </div>

            {/* Registration Status Badge */}
            {isEventPast() ? (
              <div className="absolute top-6 left-6 bg-gray-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                Event Ended
              </div>
            ) : event.registrationOpen ? (
              <div className="absolute top-6 left-6 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                Registration Open
              </div>
            ) : (
              <div className="absolute top-6 left-6 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                Registration Closed
              </div>
            )}

            {/* Event Title */}
            <div className="absolute bottom-6 left-6 right-6">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                {event.title}
              </h1>
            </div>
          </div>

          {/* Event Details */}
          <div className="p-8">
            {/* Event Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-700 rounded-xl">
                <Calendar className="w-6 h-6 text-ieee-blue flex-shrink-0" />
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Date</p>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {new Date(event.date).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-700 rounded-xl">
                <Clock className="w-6 h-6 text-ieee-blue flex-shrink-0" />
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Time</p>
                  <p className="font-semibold text-slate-900 dark:text-white">{event.time}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-700 rounded-xl">
                <MapPin className="w-6 h-6 text-ieee-blue flex-shrink-0" />
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Venue</p>
                  <p className="font-semibold text-slate-900 dark:text-white">{event.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-700 rounded-xl">
                <Users className="w-6 h-6 text-ieee-blue flex-shrink-0" />
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Attendees</p>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {event.attendees?.length || 0} / {event.maxAttendees}
                  </p>
                </div>
              </div>
            </div>

            {/* Event Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                About This Event
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
                {event.description}
              </p>
            </div>

            {/* Event Mode and Meeting Link */}
            {event.mode && (event.mode === 'online' || event.mode === 'hybrid') && (
              <div className="mb-8">
                <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                  <Video className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                      {event.mode === 'online' ? 'Online Event' : 'Hybrid Event'}
                    </p>
                    {event.meetingLink && (
                      <a
                        href={event.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Join Meeting Link
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Tags */}
            {event.tags && event.tags.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Speakers */}
            {event.speakers && event.speakers.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  Speakers
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {event.speakers.map((speaker, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-700 rounded-xl"
                    >
                      {speaker.image && (
                        <img
                          src={speaker.image}
                          alt={speaker.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900 dark:text-white">
                          {speaker.name}
                        </h4>
                        {speaker.designation && (
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {speaker.designation}
                          </p>
                        )}
                        {speaker.organization && (
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {speaker.organization}
                          </p>
                        )}
                        {speaker.bio && (
                          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                            {speaker.bio}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pricing Information */}
            {event.pricing && !event.pricing.isFree && (
              <div className="mb-8">
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
                  <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                    Registration Fee
                  </h3>
                  <div className="space-y-1 text-sm text-yellow-800 dark:text-yellow-200">
                    <p>
                      IEEE Members: {event.pricing.currency} {event.pricing.ieeeMemberPrice}
                    </p>
                    <p>
                      Non-IEEE Members: {event.pricing.currency} {event.pricing.nonIeeeMemberPrice}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Registration Button */}
            <div className="flex justify-center">
              {isRegistered() ? (
                <button
                  className="flex items-center justify-center gap-2 px-8 py-4 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 font-semibold rounded-xl text-lg cursor-default"
                  disabled
                >
                  <CheckCircle size={24} />
                  Already Registered
                </button>
              ) : isEventPast() ? (
                <button
                  className="flex items-center justify-center gap-2 px-8 py-4 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-semibold rounded-xl text-lg cursor-not-allowed"
                  disabled
                >
                  Event Ended
                </button>
              ) : !event.registrationOpen ? (
                <button
                  className="flex items-center justify-center gap-2 px-8 py-4 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-semibold rounded-xl text-lg cursor-not-allowed"
                  disabled
                >
                  Registration Closed
                </button>
              ) : isEventFull() ? (
                <button
                  className="flex items-center justify-center gap-2 px-8 py-4 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-semibold rounded-xl text-lg cursor-not-allowed"
                  disabled
                >
                  Event Full
                </button>
              ) : (
                <button
                  onClick={handleRegister}
                  disabled={registering}
                  className="flex items-center justify-center gap-2 px-8 py-4 bg-ieee-blue hover:bg-ieee-blue-dark text-white font-semibold rounded-xl text-lg transition-colors disabled:opacity-50"
                >
                  {registering ? (
                    <>
                      <Loader className="w-6 h-6 animate-spin" />
                      Registering...
                    </>
                  ) : (
                    <>
                      Register Now
                      <ArrowRight size={24} />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </motion.div>
        )}
      </div>
    </div>
  );
};

export default EventDetail;
