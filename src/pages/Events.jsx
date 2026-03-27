import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, Users, Search, Filter, ChevronRight } from 'lucide-react';

const Events = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const upcomingEvents = [
    {
      id: 1,
      title: 'AI/ML Workshop Series',
      date: 'April 15-17, 2026',
      time: '10:00 AM - 4:00 PM',
      location: 'Main Auditorium',
      type: 'Workshop',
      attendees: 150,
      image: 'https://images.unsplash.com/photo-1555421689-d68471e189f2?w=400&h=250&fit=crop',
      description: 'Comprehensive 3-day workshop covering fundamentals of Machine Learning, Neural Networks, and practical AI applications using Python and TensorFlow.',
      registrationOpen: true,
    },
    {
      id: 2,
      title: 'Web Development Bootcamp',
      date: 'April 22-24, 2026',
      time: '9:00 AM - 5:00 PM',
      location: 'Computer Lab 1',
      type: 'Bootcamp',
      attendees: 100,
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop',
      description: 'Learn modern web development with React, Node.js, and MongoDB. Build real-world projects and deploy them online.',
      registrationOpen: true,
    },
    {
      id: 3,
      title: 'Industry Tech Talk: Cloud Computing',
      date: 'May 5, 2026',
      time: '2:00 PM - 5:00 PM',
      location: 'Seminar Hall',
      type: 'Seminar',
      attendees: 200,
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=250&fit=crop',
      description: 'Industry experts from leading tech companies discuss cloud computing trends, AWS services, and career opportunities.',
      registrationOpen: true,
    },
    {
      id: 4,
      title: 'Hackathon 2026',
      date: 'May 20-21, 2026',
      time: '24 Hours',
      location: 'Innovation Hub',
      type: 'Competition',
      attendees: 250,
      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=250&fit=crop',
      description: '24-hour coding marathon to build innovative solutions for real-world problems. Win prizes worth ₹1 lakh!',
      registrationOpen: true,
    },
  ];

  const pastEvents = [
    {
      id: 5,
      title: 'Python Programming Workshop',
      date: 'March 10, 2026',
      type: 'Workshop',
      attendees: 120,
      image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400&h=250&fit=crop',
      description: 'Intensive workshop on Python programming covering basics to advanced topics including data science libraries.',
    },
    {
      id: 6,
      title: 'IoT Innovation Summit',
      date: 'February 25, 2026',
      type: 'Conference',
      attendees: 300,
      image: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=400&h=250&fit=crop',
      description: 'Full-day conference on Internet of Things with industry speakers and project demonstrations.',
    },
    {
      id: 7,
      title: 'Cybersecurity Awareness Program',
      date: 'February 10, 2026',
      type: 'Seminar',
      attendees: 180,
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=250&fit=crop',
      description: 'Expert-led session on cybersecurity best practices, ethical hacking, and career paths in security.',
    },
    {
      id: 8,
      title: 'Mobile App Development Workshop',
      date: 'January 28, 2026',
      type: 'Workshop',
      attendees: 90,
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=250&fit=crop',
      description: 'Hands-on workshop on building mobile applications using React Native and Flutter.',
    },
  ];

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

          {filteredUpcoming.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-8">
              {filteredUpcoming.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="card group overflow-hidden"
                >
                  <div className="relative h-48 mb-4 -mt-6 -mx-6 overflow-hidden">
                    <img
                      src={event.image}
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
                      <span className="text-sm">{event.date}</span>
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
                      <span className="text-sm">{event.attendees} attendees expected</span>
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    {event.description}
                  </p>

                  <button className="btn-primary w-full flex items-center justify-center">
                    Register Now
                    <ChevronRight size={18} className="ml-2" />
                  </button>
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
                  key={event.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white dark:bg-gray-700 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow group"
                >
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={event.image}
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
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 text-sm mb-3">
                      <Users size={14} />
                      <span>{event.attendees} attendees</span>
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
