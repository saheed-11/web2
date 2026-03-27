import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Clock, CheckCircle } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    interest: 'general'
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would send to a backend
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        interest: 'general'
      });
    }, 3000);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      details: 'ieeecarmelcollege@gmail.com',
      link: 'mailto:ieeecarmelcollege@gmail.com'
    },
    {
      icon: Phone,
      title: 'Phone',
      details: '+91 97780 12972',
      link: 'tel:+919778012972'
    },
    {
      icon: MapPin,
      title: 'Address',
      details: 'Punnapra P.O., Alappuzha, Kerala, India - 688004',
      link: 'https://maps.google.com'
    },
    {
      icon: Clock,
      title: 'Office Hours',
      details: 'Monday - Friday: 9:00 AM - 5:00 PM',
      link: null
    },
  ];

  const socialLinks = [
    { name: 'Facebook', url: 'https://facebook.com', color: 'bg-blue-600', letter: 'f' },
    { name: 'LinkedIn', url: 'https://linkedin.com', color: 'bg-blue-700', letter: 'in' },
    { name: 'Twitter', url: 'https://twitter.com', color: 'bg-blue-400', letter: '𝕏' },
  ];

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
              Get in Touch
            </h1>
            <p className="text-xl text-blue-100">
              Have questions? Want to join IEEE? We'd love to hear from you!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="section bg-white dark:bg-gray-900">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card text-center group"
              >
                <div className="w-14 h-14 bg-ieee-blue/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-ieee-blue group-hover:scale-110 transition-all duration-300">
                  <info.icon className="text-ieee-blue group-hover:text-white transition-colors" size={28} />
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
                  {info.title}
                </h3>
                {info.link ? (
                  <a
                    href={info.link}
                    className="text-gray-600 dark:text-gray-300 hover:text-ieee-blue transition-colors"
                  >
                    {info.details}
                  </a>
                ) : (
                  <p className="text-gray-600 dark:text-gray-300">{info.details}</p>
                )}
              </motion.div>
            ))}
          </div>

          {/* Main Contact Section */}
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold font-display mb-4 text-gray-900 dark:text-white">
                Send us a Message
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Fill out the form below and we'll get back to you as soon as possible.
              </p>

              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl flex items-center space-x-3"
                >
                  <CheckCircle className="text-green-600" size={24} />
                  <p className="text-green-800 dark:text-green-200 font-semibold">
                    Message sent successfully! We'll get back to you soon.
                  </p>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-ieee-blue dark:text-white"
                    placeholder="John Doe"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-ieee-blue dark:text-white"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-ieee-blue dark:text-white"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="interest" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    I'm interested in *
                  </label>
                  <select
                    id="interest"
                    name="interest"
                    value={formData.interest}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-ieee-blue dark:text-white"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="membership">IEEE Membership</option>
                    <option value="events">Attending Events</option>
                    <option value="collaboration">Collaboration Opportunities</option>
                    <option value="sponsorship">Sponsorship</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-ieee-blue dark:text-white"
                    placeholder="How can we help you?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-ieee-blue dark:text-white resize-none"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full flex items-center justify-center"
                  disabled={submitted}
                >
                  {submitted ? (
                    <>
                      <CheckCircle className="mr-2" size={20} />
                      Sent Successfully!
                    </>
                  ) : (
                    <>
                      <Send className="mr-2" size={20} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </motion.div>

            {/* Map and Social */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              {/* Map */}
              <div className="card p-0 overflow-hidden">
                <div className="h-80 bg-gray-200 dark:bg-gray-700 relative">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3937.1234567890!2d76.3456789!3d9.2345678!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOcKwMTQnMDQuNCJOIDc2wrAyMCc0NC40IkU!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Carmel College Location"
                    className="grayscale"
                  ></iframe>
                </div>
              </div>

              {/* Social Media */}
              <div className="card">
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                  Connect With Us
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Follow us on social media for updates, events, and more!
                </p>
                <div className="space-y-3">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                    >
                      <div className={`${social.color} w-12 h-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        {{in: "in", f: "f", 𝕏: "𝕏"}[social.name.toLowerCase()] || social.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {social.name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          @ieeecarmel
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Quick Info */}
              <div className="card bg-gradient-to-br from-ieee-blue to-blue-800 text-white">
                <h3 className="text-xl font-bold mb-4">Join IEEE Today!</h3>
                <p className="mb-6 text-blue-100">
                  Become a member and unlock access to exclusive resources, networking opportunities, and professional development.
                </p>
                <a
                  href="#membership"
                  className="inline-block px-6 py-3 bg-white text-ieee-blue font-semibold rounded-xl hover:bg-gray-100 transition-colors"
                >
                  Learn More
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section bg-gray-50 dark:bg-gray-800">
        <div className="container-custom max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4 text-gray-900 dark:text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Quick answers to common questions
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                question: 'How can I join IEEE?',
                answer: 'You can join IEEE by filling out the contact form above and selecting "IEEE Membership" as your interest. We\'ll guide you through the membership process.'
              },
              {
                question: 'What are the membership benefits?',
                answer: 'IEEE members get access to technical resources, networking opportunities, career development programs, and discounts on conferences and publications.'
              },
              {
                question: 'Are non-engineering students allowed to join?',
                answer: 'Yes! IEEE welcomes students from all disciplines who have an interest in technology and innovation.'
              },
              {
                question: 'How can I attend events?',
                answer: 'Visit our Events page to see upcoming workshops and seminars. Most events are free for IEEE members and have a nominal fee for non-members.'
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-md"
              >
                <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
                  {faq.question}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {faq.answer}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
