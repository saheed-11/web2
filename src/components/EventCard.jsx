import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, Users, ChevronRight, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EventCard = ({ event, onRegister, isRegistered, isRegistering, index = 0 }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="card group overflow-hidden"
    >
      <div
        className="cursor-pointer"
        onClick={() => navigate(`/events/${event._id}`)}
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

        <h3
          className="text-2xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-ieee-blue transition-colors cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/events/${event._id}`);
          }}
        >
          {event.title}
        </h3>
      </div>

      <div className="space-y-2 mb-4 text-gray-600 dark:text-gray-300">
        <div className="flex items-center space-x-2">
          <Calendar size={18} className="text-ieee-blue" />
          <span className="text-sm">
            {new Date(event.date).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}
          </span>
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
          <span className="text-sm">
            {event.attendees?.length || 0} / {event.maxAttendees} registered
          </span>
        </div>
      </div>

      <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
        {event.description}
      </p>

      <div className="flex gap-3">
        <button
          onClick={() => navigate(`/events/${event._id}`)}
          className="flex-1 flex items-center justify-center px-4 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
        >
          View Details
          <ChevronRight size={18} className="ml-2" />
        </button>

        {isRegistered ? (
          <button
            className="flex-1 flex items-center justify-center px-4 py-3 bg-green-100 text-green-700 font-semibold rounded-xl cursor-default"
            disabled
          >
            <CheckCircle size={18} className="mr-2" />
            Registered
          </button>
        ) : event.registrationOpen ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRegister(event._id);
            }}
            disabled={isRegistering}
            className="flex-1 btn-primary flex items-center justify-center disabled:opacity-50"
          >
            {isRegistering ? 'Registering...' : 'Register'}
          </button>
        ) : null}
      </div>
    </motion.div>
  );
};

export default EventCard;
