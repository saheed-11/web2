import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Image as ImageIcon } from 'lucide-react';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Events', 'Workshops', 'Conferences', 'Team Activities', 'Awards'];

  const galleryItems = [
    {
      id: 1,
      type: 'image',
      url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
      category: 'Events',
      title: 'Annual Tech Fest 2025',
      description: 'Our flagship technology festival with over 500 participants'
    },
    {
      id: 2,
      type: 'image',
      url: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&h=600&fit=crop',
      category: 'Workshops',
      title: 'Python Programming Workshop',
      description: 'Intensive hands-on coding session'
    },
    {
      id: 3,
      type: 'image',
      url: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=600&fit=crop',
      category: 'Team Activities',
      title: 'Team Building Activity',
      description: 'Annual team outing and bonding session'
    },
    {
      id: 4,
      type: 'image',
      url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=600&fit=crop',
      category: 'Conferences',
      title: 'IEEE Regional Conference',
      description: 'Regional IEEE student branch conference 2025'
    },
    {
      id: 5,
      type: 'image',
      url: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&h=600&fit=crop',
      category: 'Awards',
      title: 'Best Student Branch Award',
      description: 'Received excellence award for outstanding performance'
    },
    {
      id: 6,
      type: 'image',
      url: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800&h=600&fit=crop',
      category: 'Workshops',
      title: 'Web Development Bootcamp',
      description: 'Full-stack development intensive training'
    },
    {
      id: 7,
      type: 'image',
      url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop',
      category: 'Events',
      title: 'Hackathon 2025',
      description: '24-hour coding marathon with amazing projects'
    },
    {
      id: 8,
      type: 'image',
      url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=600&fit=crop',
      category: 'Team Activities',
      title: 'Core Team Meeting',
      description: 'Strategic planning session with the leadership team'
    },
    {
      id: 9,
      type: 'image',
      url: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=600&fit=crop',
      category: 'Workshops',
      title: 'IoT Innovation Workshop',
      description: 'Hands-on session on Internet of Things'
    },
  ];

  const filteredItems = selectedCategory === 'All'
    ? galleryItems
    : galleryItems.filter(item => item.category === selectedCategory);

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
              Gallery
            </h1>
            <p className="text-xl text-blue-100">
              Moments captured from our events, workshops, and activities
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="section bg-white dark:bg-gray-900">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-ieee-blue text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Gallery Grid */}
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-shadow cursor-pointer aspect-[4/3]"
                onClick={() => setSelectedImage(item)}
              >
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <span className="inline-block w-fit px-3 py-1 bg-ieee-blue text-white text-sm font-semibold rounded-full mb-2">
                    {item.category}
                  </span>
                  <h3 className="text-white font-bold text-lg mb-1">{item.title}</h3>
                  <p className="text-white/90 text-sm">{item.description}</p>
                </div>
                <div className="absolute top-4 right-4 bg-white/90 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.type === 'video' ? (
                    <Play size={20} className="text-ieee-blue" />
                  ) : (
                    <ImageIcon size={20} className="text-ieee-blue" />
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-4 right-4 text-white p-2 hover:bg-white/20 rounded-lg transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <X size={32} />
            </button>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="max-w-5xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage.url}
                alt={selectedImage.title}
                className="w-full h-auto rounded-lg shadow-2xl"
              />
              <div className="mt-6 text-center">
                <span className="inline-block px-4 py-2 bg-ieee-blue text-white text-sm font-semibold rounded-full mb-3">
                  {selectedImage.category}
                </span>
                <h3 className="text-white text-2xl font-bold mb-2">
                  {selectedImage.title}
                </h3>
                <p className="text-white/80 text-lg">
                  {selectedImage.description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
              Be Part of Our Story
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join IEEE and create memories that last a lifetime through amazing events and activities!
            </p>
            <a href="/contact" className="btn-secondary inline-block">
              Join Now
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Gallery;
