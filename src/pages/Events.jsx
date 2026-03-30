import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, Users, Search, Filter, ChevronRight, CheckCircle } from 'lucide-react';
import { eventService, authService } from '../services/authService';
import { useNavigate } from 'react-router-dom';

const Events = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await eventService.getEvents();
        setEvents(data);
      } catch (error) {
        console.error('Failed to fetch events:', error);
        setMessage({ type: 'error', text: 'Failed to load events' });
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Get current user for checking registration status
  const currentUser = authService.getCurrentUser();

  // Handle event registration
  const handleRegister = async (eventId) => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }

    setRegistering(eventId);
    setMessage({ type: '', text: '' });

    try {
      await eventService.registerForEvent(eventId);
      setMessage({ type: 'success', text: 'Successfully registered for event!' });
      // Refresh events to update attendee count
      const data = await eventService.getEvents();
      setEvents(data);
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to register';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setRegistering(null);
    }
  };

  // Check if user is registered for an event
  const isRegistered = (event) => {
    if (!currentUser) return false;
    return event.attendees?.includes(currentUser._id);
  };

  // Separate events into upcoming and past
  const now = new Date();
  const upcomingEvents = events.filter(event => new Date(event.date) >= now);
  const pastEvents = events.filter(event => new Date(event.date) < now);

  const eventTypes = ['all', 'Workshop', 'Bootcamp', 'Seminar', 'Conference', 'Competition'];

  const filterEvents = (events) => {
    return events.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = selectedFilter === 'all' || event.type === selectedFilter;
      return matchesSearch && matchesFilter;
    });
  };

  const filteredUpcoming = filterEvents(upcomingEvents);
  const filteredPast = filterEvents(pastEvents);

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-ieee-blue via-blue-600 to-blue-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute w-96 h-96 bg-white rounded-full blur-3xl top-0 right-0"></div>
          <div className="absolute w-96 h-96 bg-white rounded-full blur-3xl bottom-0 left-0"></div>
        </div>

        <div className="container-custom px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display mb-6">
              Events & Workshops
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Explore our upcoming technical workshops, seminars, and networking events
            </p>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/60 focus:outline-none focus:border-white/40"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="w-full md:w-auto pl-12 pr-8 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white focus:outline-none focus:border-white/40 appearance-none cursor-pointer"
                >
                  {eventTypes.map(type => (
                    <option key={type} value={type} className="bg-ieee-blue text-white">
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="section bg-white dark:bg-gray-900">
        <div className="container-custom">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4 text-gray-900 dark:text-white">
              Upcoming Events
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Register now for our upcoming workshops and events
            </p>
          </div>

          {/* Status Message */}
          {message.text && (
            <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message.text}
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg">Loading events...</p>
            </div>
          ) : filteredUpcoming.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-8">
              {filteredUpcoming.map((event, index) => (
                <motion.div
                  key={event._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="card group overflow-hidden"
                >
                  <div className="relative h-48 mb-4 -mt-6 -mx-6 overflow-hidden">
                    <img
                      src={event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=250&fit=crop'}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 px-3 py-1 rounded-full text-sm font-semibold text-ieee-blue">
                      {event.type}
                    </div>
                    {event.registrationOpen && (
                      <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Registration Open
                      </div>
                    )}
                  </div>

                  <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-ieee-blue transition-colors">
                    {event.title}
                  </h3>

                  <div className="space-y-2 mb-4 text-gray-600 dark:text-gray-300">
                    <div className="flex items-center space-x-2">
                      <Calendar size={18} className="text-ieee-blue" />
                      <span className="text-sm">{new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock size={18} className="text-ieee-blue" />
                      <span className="text-sm">{event.time}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin size={18} className="text-ieee-blue" />
                      <span className="text-sm">{event.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users size={18} className="text-ieee-blue" />
                      <span className="text-sm">{event.attendees?.length || 0} / {event.maxAttendees} registered</span>
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    {event.description}
                  </p>

                  {isRegistered(event) ? (
                    <button 
                      className="w-full flex items-center justify-center px-6 py-3 bg-green-100 text-green-700 font-semibold rounded-xl cursor-default"
                      disabled
                    >
                      <CheckCircle size={18} className="mr-2" />
                      Already Registered
                    </button>
                  ) : event.registrationOpen ? (
                    <button 
                      onClick={() => handleRegister(event._id)}
                      disabled={registering === event._id}
                      className="btn-primary w-full flex items-center justify-center disabled:opacity-50"
                    >
                      {registering === event._id ? 'Registering...' : 'Register Now'}
                      <ChevronRight size={18} className="ml-2" />
                    </button>
                  ) : (
                    <button 
                      className="w-full flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-500 font-semibold rounded-xl cursor-not-allowed"
                      disabled
                    >
                      Registration Closed
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                No upcoming events match your search criteria.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Past Events */}
      <section className="section bg-gray-50 dark:bg-gray-800">
        <div className="container-custom">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4 text-gray-900 dark:text-white">
              Past Events
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Highlights from our previous successful events
            </p>
          </div>

          {filteredPast.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredPast.map((event, index) => (
                <motion.div
                  key={event._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white dark:bg-gray-700 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow group"
                >
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=250&fit=crop'}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-800/90 px-2 py-1 rounded text-xs font-semibold text-ieee-blue">
                      {event.type}
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white line-clamp-2">
                      {event.title}
                    </h3>
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 text-sm mb-2">
                      <Calendar size={14} />
                      <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 text-sm mb-3">
                      <Users size={14} />
                      <span>{event.attendees?.length || 0} attended</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                      {event.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                No past events match your search criteria.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-gradient-to-br from-ieee-blue to-blue-800 text-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-6">
              Want to Host an Event?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Have an idea for a workshop or event? Contact us to collaborate and make it happen!
            </p>
            <a href="/contact" className="btn-secondary inline-block">
              Get in Touch
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Events;
