import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users, Calendar, Award, BookOpen, TrendingUp, Rocket,
  Target, Lightbulb, ArrowRight, Star, CheckCircle
} from 'lucide-react';
import { eventService } from '../services/authService';

const Home = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const events = await eventService.getEvents();
        // Filter for upcoming events (date >= today) and take first 3
        const now = new Date();
        const upcoming = events
          .filter(event => new Date(event.date) >= now)
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(0, 3);
        setUpcomingEvents(upcoming);
      } catch (error) {
        console.error('Failed to fetch events:', error);
        // Fallback to empty array on error
        setUpcomingEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const stats = [
    { number: '500+', label: 'Active Members', icon: Users },
    { number: '100+', label: 'Events Hosted', icon: Calendar },
    { number: '50+', label: 'Projects Completed', icon: Rocket },
    { number: '25+', label: 'Awards Won', icon: Award },
  ];

  const features = [
    {
      icon: BookOpen,
      title: 'Technical Workshops',
      description: 'Hands-on learning sessions on cutting-edge technologies and industry practices.',
      color: 'bg-blue-500'
    },
    {
      icon: Users,
      title: 'Networking Events',
      description: 'Connect with industry professionals, alumni, and fellow students.',
      color: 'bg-purple-500'
    },
    {
      icon: Lightbulb,
      title: 'Innovation Projects',
      description: 'Work on real-world projects that solve problems and create impact.',
      color: 'bg-green-500'
    },
    {
      icon: Target,
      title: 'Career Development',
      description: 'Resume reviews, interview prep, and mentorship from industry experts.',
      color: 'bg-orange-500'
    },
    {
      icon: Award,
      title: 'Competitions',
      description: 'Participate in hackathons, coding contests, and technical challenges.',
      color: 'bg-red-500'
    },
    {
      icon: TrendingUp,
      title: 'Professional Growth',
      description: 'Access IEEE publications, conferences, and global networking opportunities.',
      color: 'bg-indigo-500'
    },
  ];

  const testimonials = [
    {
      name: 'Rahul Menon',
      role: 'Final Year, CSE',
      image: 'https://ui-avatars.com/api/?name=Rahul+Menon&background=0369a1&color=fff',
      quote: 'Being part of IEEE has transformed my college experience. The workshops and projects have given me practical skills that I use every day.',
    },
    {
      name: 'Priya Sharma',
      role: 'Third Year, ECE',
      image: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=0369a1&color=fff',
      quote: 'The networking opportunities through IEEE are incredible. I\'ve connected with industry professionals who have guided my career path.',
    },
    {
      name: 'Arun Kumar',
      role: 'Alumni, 2023',
      image: 'https://ui-avatars.com/api/?name=Arun+Kumar&background=0369a1&color=fff',
      quote: 'IEEE membership opened doors to internships and job opportunities. The skills I gained here made me stand out in interviews.',
    },
  ];

  // Helper function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-ieee-blue via-blue-600 to-blue-800">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-ieee-navy via-slate-900 to-ieee-blue">
          <div className="absolute w-96 h-96 bg-blue-400/20 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
          <div className="absolute w-96 h-96 bg-purple-400/20 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-1000"></div>
        </div>

        <div className="container-custom px-4 z-10">
          <motion.div
            className="text-center text-white max-w-5xl mx-auto"
            initial="initial"
            animate="animate"
            variants={fadeInUp}
          >
            <motion.p
              className="text-sm md:text-base font-semibold uppercase tracking-wider mb-4 text-blue-100"
              variants={fadeInUp}
            >
              Computer Science and Engineering
            </motion.p>
            <motion.h1
              className="text-4xl md:text-6xl lg:text-7xl font-bold font-display mb-6"
              variants={fadeInUp}
            >
              IEEE Student Branch
            </motion.h1>
            <motion.h2
              className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-6"
              variants={fadeInUp}
            >
              Carmel College of Engineering and Technology
            </motion.h2>
            <motion.p
              className="text-lg md:text-xl mb-8 text-blue-50 max-w-3xl mx-auto leading-relaxed"
              variants={fadeInUp}
            >
              Advancing technology for the benefit of humanity — empowering students through
              innovation, collaboration, and professional development.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              variants={fadeInUp}
            >
              <Link
                to="/about"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-ieee-blue font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg"
              >
                Learn More
                <ArrowRight className="ml-2" size={20} />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-ieee-blue transition-all duration-300 hover:scale-105"
              >
                Join IEEE
                <ArrowRight className="ml-2" size={20} />
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center p-2">
            <div className="w-1 h-3 bg-white/70 rounded-full animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section bg-white dark:bg-gray-900">
        <div className="container-custom">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700"
              >
                <stat.icon className="w-10 h-10 mx-auto mb-3 text-ieee-blue" />
                <h3 className="text-3xl md:text-4xl font-bold text-ieee-blue dark:text-blue-400 mb-2">
                  {stat.number}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About IEEE Summary */}
      <section className="section bg-gray-50 dark:bg-gray-800">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center space-x-2 bg-ieee-blue/10 text-ieee-blue px-4 py-2 rounded-full mb-4">
                <Star size={16} />
                <span className="font-semibold">About IEEE</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold font-display mb-6 text-gray-900 dark:text-white">
                What is IEEE?
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                IEEE (Institute of Electrical and Electronics Engineers) is the world's largest
                technical professional organization dedicated to advancing technology for the benefit
                of humanity.
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                With over 420,000 members in 160+ countries, IEEE offers access to technical
                innovation, cutting-edge information, networking opportunities, and exclusive member
                benefits.
              </p>
              <div className="space-y-3">
                {['Access to 900+ peer-reviewed journals', 'Global networking opportunities', 'Professional development resources', 'Student discounts and benefits'].map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="text-green-500 flex-shrink-0 mt-1" size={20} />
                    <span className="text-gray-700 dark:text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
              <Link
                to="/about"
                className="inline-flex items-center mt-6 text-ieee-blue font-semibold hover:underline"
              >
                Learn more about IEEE
                <ArrowRight className="ml-2" size={18} />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-ieee-blue to-blue-800 p-8 flex items-center justify-center shadow-2xl">
                <div className="text-center text-white">
                  <svg width="200" height="200" viewBox="0 0 200 200" className="mx-auto mb-6">
                    <circle cx="100" cy="100" r="80" stroke="white" strokeWidth="2" fill="none" opacity="0.2"/>
                    <circle cx="100" cy="100" r="60" stroke="white" strokeWidth="2" fill="none" opacity="0.3"/>
                    <circle cx="100" cy="100" r="40" stroke="white" strokeWidth="2" fill="none" opacity="0.4"/>
                    <circle cx="100" cy="100" r="20" fill="white" opacity="0.8"/>
                  </svg>
                  <h3 className="text-2xl font-bold mb-2">420,000+</h3>
                  <p className="text-blue-100">Members Worldwide</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features/What We Offer */}
      <section className="section bg-white dark:bg-gray-900">
        <div className="container-custom">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold font-display mb-4 text-gray-900 dark:text-white">
                What We Offer
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Explore the opportunities and benefits of being part of our IEEE student branch
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card group"
              >
                <div className={`${feature.color} w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="text-white" size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="section bg-gray-50 dark:bg-gray-800">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4 text-gray-900 dark:text-white">
              Upcoming Events
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Join us for exciting workshops, seminars, and networking opportunities
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">Loading events...</p>
            </div>
          ) : upcomingEvents.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {upcomingEvents.map((event, index) => (
                <motion.div
                  key={event._id || index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="card"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold px-3 py-1 bg-ieee-blue/10 text-ieee-blue rounded-full">
                      {event.type}
                    </span>
                    <Calendar className="text-gray-400" size={20} />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                    {event.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{formatDate(event.date)}</p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{event.description}</p>
                  <Link
                    to="/events"
                    className="inline-flex items-center text-ieee-blue font-semibold hover:underline"
                  >
                    Learn more
                    <ArrowRight className="ml-1" size={16} />
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No upcoming events at the moment.</p>
            </div>
          )}

          <div className="text-center mt-8">
            <Link to="/events" className="btn-primary inline-block">
              View All Events
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section bg-white dark:bg-gray-900">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4 text-gray-900 dark:text-white">
              What Our Members Say
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Hear from students who have benefited from IEEE membership
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-6 relative"
              >
                <div className="absolute top-6 right-6 text-ieee-blue/20">
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="currentColor">
                    <path d="M9.99999 6.66675L6.66666 10.0001V26.6667H16.6667V16.6667H11.6667L15 13.3334V6.66675H9.99999ZM26.6667 6.66675L23.3333 10.0001V26.6667H33.3333V16.6667H28.3333L31.6667 13.3334V6.66675H26.6667Z" />
                  </svg>
                </div>
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 italic leading-relaxed">
                  "{testimonial.quote}"
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-gradient-to-br from-ieee-blue via-blue-600 to-blue-800 text-white">
        <div className="container-custom">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-6">
              Ready to Join IEEE?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Be part of the world's largest technical professional organization and unlock endless
              opportunities for growth and innovation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-ieee-blue font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg"
              >
                Join Now
                <ArrowRight className="ml-2" size={20} />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-ieee-blue transition-all duration-300 hover:scale-105"
              >
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
