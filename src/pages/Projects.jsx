import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Users, Award } from 'lucide-react';

const Projects = () => {
  const projects = [
    {
      id: 1,
      title: 'Smart Campus IoT System',
      description: 'IoT-based system for monitoring and managing campus facilities including lighting, temperature, and energy consumption.',
      image: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=600&h=400&fit=crop',
      category: 'IoT',
      team: ['Aditya Menon', 'Rahul Kumar', 'Priya Sharma'],
      technologies: ['Arduino', 'Node.js', 'MongoDB', 'React'],
      github: '#',
      demo: '#',
      status: 'Completed',
      year: '2025'
    },
    {
      id: 2,
      title: 'AI-Powered Exam Proctoring',
      description: 'Machine learning system for automated exam proctoring with face recognition and anomaly detection.',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop',
      category: 'AI/ML',
      team: ['Sneha Krishnan', 'Arjun Prakash'],
      technologies: ['Python', 'TensorFlow', 'OpenCV', 'Flask'],
      github: '#',
      demo: '#',
      status: 'Ongoing',
      year: '2026'
    },
    {
      id: 3,
      title: 'Student Portal Mobile App',
      description: 'Cross-platform mobile application for accessing academic resources, attendance, and college updates.',
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop',
      category: 'Mobile Dev',
      team: ['Karthik Raghavan', 'Divya Sharma', 'Anjali Iyer'],
      technologies: ['React Native', 'Firebase', 'Node.js'],
      github: '#',
      demo: '#',
      status: 'Completed',
      year: '2025'
    },
    {
      id: 4,
      title: 'Blockchain-Based Certificate Verification',
      description: 'Decentralized system for issuing and verifying academic certificates using blockchain technology.',
      image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&h=400&fit=crop',
      category: 'Blockchain',
      team: ['Meera Nair', 'Rahul Menon'],
      technologies: ['Ethereum', 'Solidity', 'Web3.js', 'React'],
      github: '#',
      demo: '#',
      status: 'Ongoing',
      year: '2026'
    },
    {
      id: 5,
      title: 'Library Management System',
      description: 'Comprehensive system for managing library resources, book loans, and digital catalog with QR code integration.',
      image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600&h=400&fit=crop',
      category: 'Web Development',
      team: ['Aditya Menon', 'Sneha Krishnan', 'Karthik Raghavan'],
      technologies: ['Django', 'PostgreSQL', 'Bootstrap', 'jQuery'],
      github: '#',
      demo: '#',
      status: 'Completed',
      year: '2024'
    },
    {
      id: 6,
      title: 'Autonomous Line Following Robot',
      description: 'Robotics project featuring an autonomous robot with obstacle avoidance and line following capabilities.',
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&h=400&fit=crop',
      category: 'Robotics',
      team: ['Arjun Prakash', 'Divya Sharma'],
      technologies: ['Arduino', 'C++', 'IR Sensors', 'Motor Controllers'],
      github: '#',
      demo: '#',
      status: 'Completed',
      year: '2024'
    },
  ];

  const categories = ['All', 'AI/ML', 'IoT', 'Web Development', 'Mobile Dev', 'Blockchain', 'Robotics'];
  const [selectedCategory, setSelectedCategory] = React.useState('All');

  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter(p => p.category === selectedCategory);

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
              Student Projects
            </h1>
            <p className="text-xl text-blue-100">
              Innovative solutions and research projects by our talented members
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

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card group overflow-hidden"
              >
                <div className="relative h-48 -mt-6 -mx-6 mb-4 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 bg-white dark:bg-gray-800 px-3 py-1 rounded-full text-sm font-semibold text-ieee-blue">
                    {project.category}
                  </div>
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {project.status}
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white group-hover:text-ieee-blue transition-colors">
                  {project.title}
                </h3>

                <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm leading-relaxed">
                  {project.description}
                </p>

                <div className="mb-4">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <Users size={16} className="mr-2" />
                    <span>{project.team.join(', ')}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Award size={16} className="mr-2" />
                    <span>{project.year}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-blue-50 dark:bg-gray-700 text-ieee-blue dark:text-blue-400 text-xs rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex space-x-3">
                  <a
                    href={project.github}
                    className="flex-1 flex items-center justify-center px-4 py-2 bg-gray-900 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-semibold"
                  >
                    <span className="mr-2">⚙</span>
                    Code
                  </a>
                  <a
                    href={project.demo}
                    className="flex-1 flex items-center justify-center px-4 py-2 bg-ieee-blue text-white rounded-lg hover:bg-ieee-blue-dark transition-colors text-sm font-semibold"
                  >
                    <ExternalLink size={16} className="mr-2" />
                    Demo
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
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
              Have a Project Idea?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join IEEE and get support, mentorship, and resources to bring your ideas to life!
            </p>
            <a href="/contact" className="btn-secondary inline-block">
              Get Started
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Projects;
