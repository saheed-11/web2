import React from 'react';
import { motion } from 'framer-motion';
import { Target, Eye, Award, Users, TrendingUp, Globe, CheckCircle, Calendar } from 'lucide-react';

const About = () => {
  const milestones = [
    { year: '2010', event: 'IEEE Student Branch Established', description: 'Started with 50 founding members' },
    { year: '2015', event: 'First National Conference', description: 'Hosted 500+ participants from across India' },
    { year: '2020', event: 'Excellence Award', description: 'Recognized as Best IEEE Student Branch in Kerala' },
    { year: '2024', event: '1000+ Members', description: 'Reached milestone of over 1000 active members' },
  ];

  const teamMembers = [
    {
      name: 'Dr. Rajesh Kumar',
      role: 'Faculty Advisor',
      image: 'https://ui-avatars.com/api/?name=Rajesh+Kumar&background=0369a1&color=fff&size=200',
      department: 'Computer Science'
    },
    {
      name: 'Aditya Menon',
      role: 'Chairperson',
      image: 'https://ui-avatars.com/api/?name=Aditya+Menon&background=0369a1&color=fff&size=200',
      department: 'Final Year CSE'
    },
    {
      name: 'Sneha Krishnan',
      role: 'Vice Chairperson',
      image: 'https://ui-avatars.com/api/?name=Sneha+Krishnan&background=0369a1&color=fff&size=200',
      department: 'Third Year ECE'
    },
    {
      name: 'Arjun Prakash',
      role: 'Secretary',
      image: 'https://ui-avatars.com/api/?name=Arjun+Prakash&background=0369a1&color=fff&size=200',
      department: 'Final Year CSE'
    },
    {
      name: 'Meera Nair',
      role: 'Treasurer',
      image: 'https://ui-avatars.com/api/?name=Meera+Nair&background=0369a1&color=fff&size=200',
      department: 'Third Year ECE'
    },
    {
      name: 'Karthik Raghavan',
      role: 'Technical Lead',
      image: 'https://ui-avatars.com/api/?name=Karthik+Raghavan&background=0369a1&color=fff&size=200',
      department: 'Final Year CSE'
    },
  ];

  const values = [
    {
      icon: Globe,
      title: 'Global Impact',
      description: 'Contributing to technological advancement on a global scale through local initiatives.'
    },
    {
      icon: Users,
      title: 'Collaboration',
      description: 'Fostering teamwork and partnerships across departments and institutions.'
    },
    {
      icon: TrendingUp,
      title: 'Innovation',
      description: 'Encouraging creative thinking and pioneering solutions to real-world problems.'
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'Maintaining the highest standards in technical education and professional development.'
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
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-full mb-6">
              <svg width="24" height="24" viewBox="0 0 36 36" fill="none">
                <path d="M18 3L5 11V25L18 33L31 25V11L18 3Z" stroke="white" strokeWidth="2"/>
                <circle cx="18" cy="18" r="3" fill="white"/>
              </svg>
              <span className="font-semibold">About Us</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display mb-6">
              IEEE Student Branch
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-4">
              Carmel College of Engineering and Technology
            </p>
            <p className="text-lg text-blue-50 leading-relaxed">
              Empowering the next generation of engineers and technologists through innovation,
              collaboration, and professional excellence.
            </p>
          </motion.div>
        </div>
      </section>

      {/* What is IEEE */}
      <section className="section bg-white dark:bg-gray-900">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold font-display mb-6 text-gray-900 dark:text-white">
                What is IEEE?
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                The Institute of Electrical and Electronics Engineers (IEEE) is the world's largest
                technical professional organization dedicated to advancing technology for the benefit
                of humanity.
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                IEEE and its members inspire a global community to innovate for a better tomorrow
                through its highly cited publications, conferences, technology standards, and
                professional and educational activities.
              </p>
              <div className="space-y-3">
                {[
                  '420,000+ members in 160+ countries',
                  '900+ peer-reviewed journals and magazines',
                  '1,900+ annual conferences worldwide',
                  '39 technical societies and councils',
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="text-green-500 flex-shrink-0 mt-1" size={20} />
                    <span className="text-gray-700 dark:text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-gray-800 dark:to-gray-700 p-8 flex flex-col items-center justify-center shadow-xl">
                <svg width="180" height="180" viewBox="0 0 180 180" className="mb-6">
                  <circle cx="90" cy="90" r="70" fill="none" stroke="#0369a1" strokeWidth="2" opacity="0.2"/>
                  <circle cx="90" cy="90" r="50" fill="none" stroke="#0369a1" strokeWidth="2" opacity="0.4"/>
                  <circle cx="90" cy="90" r="30" fill="#0369a1" opacity="0.6"/>
                  <circle cx="90" cy="90" r="15" fill="#0369a1"/>
                </svg>
                <h3 className="text-3xl font-bold text-ieee-blue dark:text-blue-400 mb-2">
                  Since 1884
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-center">
                  Over 140 years of technological innovation
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Our Branch */}
      <section className="section bg-gray-50 dark:bg-gray-800">
        <div className="container-custom">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold font-display mb-4 text-gray-900 dark:text-white">
                About Our Student Branch
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Fostering technical excellence and professional growth since 2010
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="card"
            >
              <Target className="w-12 h-12 text-ieee-blue mb-4" />
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Our Mission</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                To foster technological innovation and excellence for the benefit of humanity by
                providing our members with access to technical information, professional development
                opportunities, and a global network of like-minded individuals. We aim to bridge the
                gap between academic learning and industry requirements through practical workshops,
                seminars, and hands-on projects.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="card"
            >
              <Eye className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Our Vision</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                To be recognized as a leading IEEE student branch that nurtures future technology
                leaders and innovators. We envision creating a vibrant community where students can
                explore emerging technologies, collaborate on groundbreaking projects, and develop
                the skills necessary to excel in their careers and make meaningful contributions to
                society.
              </p>
            </motion.div>
          </div>

          {/* Core Values */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
              >
                <value.icon className="w-10 h-10 text-ieee-blue mb-3" />
                <h4 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">{value.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline/Milestones */}
      <section className="section bg-white dark:bg-gray-900">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4 text-gray-900 dark:text-white">
              Our Journey
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Key milestones in our branch's history
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative pl-8 pb-12 border-l-2 border-ieee-blue last:pb-0"
              >
                <div className="absolute left-0 top-0 -ml-2 w-4 h-4 rounded-full bg-ieee-blue"></div>
                <div className="card ml-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-2xl font-bold text-ieee-blue">{milestone.year}</span>
                    <Calendar className="text-gray-400" size={20} />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                    {milestone.event}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">{milestone.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Preview */}
      <section className="section bg-gray-50 dark:bg-gray-800">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4 text-gray-900 dark:text-white">
              Our Leadership Team
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Meet the dedicated individuals driving our success
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card text-center group"
              >
                <div className="relative inline-block mb-4">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 rounded-full mx-auto border-4 border-ieee-blue/20 group-hover:border-ieee-blue transition-colors"
                  />
                  <div className="absolute inset-0 rounded-full bg-ieee-blue/10 group-hover:bg-ieee-blue/20 transition-colors"></div>
                </div>
                <h3 className="text-xl font-bold mb-1 text-gray-900 dark:text-white">
                  {member.name}
                </h3>
                <p className="text-ieee-blue font-semibold mb-1">{member.role}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{member.department}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <a
              href="/team"
              className="btn-primary inline-block"
            >
              View Full Team
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
