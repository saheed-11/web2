import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, Clock, ArrowRight, Tag } from 'lucide-react';

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: 'Getting Started with Machine Learning: A Beginner\'s Guide',
      excerpt: 'Explore the fundamentals of machine learning, key concepts, and resources to kickstart your AI journey.',
      image: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=800&h=500&fit=crop',
      author: 'Aditya Menon',
      date: 'March 20, 2026',
      readTime: '8 min read',
      category: 'AI/ML',
      tags: ['Machine Learning', 'AI', 'Tutorial'],
    },
    {
      id: 2,
      title: 'Building Scalable Web Applications with React and Node.js',
      excerpt: 'Learn best practices for creating performant and scalable full-stack applications using modern JavaScript technologies.',
      image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=500&fit=crop',
      author: 'Karthik Raghavan',
      date: 'March 15, 2026',
      readTime: '10 min read',
      category: 'Web Development',
      tags: ['React', 'Node.js', 'Web Development'],
    },
    {
      id: 3,
      title: 'The Future of IoT: Trends and Opportunities',
      excerpt: 'Discover the latest trends in Internet of Things and how they\'re shaping the future of technology.',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=500&fit=crop',
      author: 'Sneha Krishnan',
      date: 'March 10, 2026',
      readTime: '6 min read',
      category: 'IoT',
      tags: ['IoT', 'Technology', 'Future Tech'],
    },
    {
      id: 4,
      title: 'Cybersecurity Best Practices for Developers',
      excerpt: 'Essential security practices every developer should implement to protect their applications and users.',
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=500&fit=crop',
      author: 'Arjun Prakash',
      date: 'March 5, 2026',
      readTime: '7 min read',
      category: 'Security',
      tags: ['Cybersecurity', 'Security', 'Best Practices'],
    },
    {
      id: 5,
      title: 'Introduction to Blockchain and Decentralized Applications',
      excerpt: 'Understanding blockchain technology and how to build decentralized applications (DApps).',
      image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=500&fit=crop',
      author: 'Meera Nair',
      date: 'February 28, 2026',
      readTime: '9 min read',
      category: 'Blockchain',
      tags: ['Blockchain', 'DApps', 'Cryptocurrency'],
    },
    {
      id: 6,
      title: 'Mobile App Development: Native vs Cross-Platform',
      excerpt: 'Comparing native and cross-platform mobile development approaches to help you choose the right path.',
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=500&fit=crop',
      author: 'Divya Sharma',
      date: 'February 20, 2026',
      readTime: '5 min read',
      category: 'Mobile Dev',
      tags: ['Mobile', 'React Native', 'Flutter'],
    },
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
              Blog & Articles
            </h1>
            <p className="text-xl text-blue-100">
              Insights, tutorials, and technical articles from our community
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="section bg-white dark:bg-gray-900">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-8 items-center card"
          >
            <div className="relative h-80 -ml-6 -mt-6 -mb-6 md:mb-0 md:-my-6 overflow-hidden rounded-l-2xl">
              <img
                src={blogPosts[0].image}
                alt={blogPosts[0].title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-ieee-blue px-4 py-2 rounded-full text-white font-semibold">
                Featured
              </div>
            </div>

            <div className="p-4">
              <span className="inline-block px-3 py-1 bg-ieee-blue/10 text-ieee-blue rounded-full text-sm font-semibold mb-4">
                {blogPosts[0].category}
              </span>
              <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                {blogPosts[0].title}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                {blogPosts[0].excerpt}
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
                <div className="flex items-center space-x-2">
                  <User size={16} />
                  <span>{blogPosts[0].author}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar size={16} />
                  <span>{blogPosts[0].date}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock size={16} />
                  <span>{blogPosts[0].readTime}</span>
                </div>
              </div>
              <button className="btn-primary flex items-center">
                Read Article
                <ArrowRight size={18} className="ml-2" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="section bg-gray-50 dark:bg-gray-800">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4 text-gray-900 dark:text-white">
              Recent Articles
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Stay updated with the latest in technology and IEEE activities
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.slice(1).map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card group overflow-hidden"
              >
                <div className="relative h-48 -mt-6 -mx-6 mb-4 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 dark:bg-gray-800/90 px-3 py-1 rounded-full text-sm font-semibold text-ieee-blue">
                    {post.category}
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-ieee-blue transition-colors line-clamp-2">
                  {post.title}
                </h3>

                <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <div className="flex items-center space-x-1">
                    <User size={14} />
                    <span>{post.author}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center space-x-1">
                    <Clock size={14} />
                    <span>{post.readTime}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded"
                    >
                      <Tag size={10} className="mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>

                <button className="text-ieee-blue font-semibold hover:underline flex items-center">
                  Read More
                  <ArrowRight size={16} className="ml-1" />
                </button>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="section bg-gradient-to-br from-ieee-blue to-blue-800 text-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-6">
              Want to Contribute?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Share your knowledge! Write technical articles and contribute to our blog.
            </p>
            <a href="/contact" className="btn-secondary inline-block">
              Submit an Article
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
