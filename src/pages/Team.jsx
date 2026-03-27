import React from 'react';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';

const Team = () => {
  const faculty = [
    {
      name: 'Dr. Rajesh Kumar',
      role: 'Faculty Advisor',
      department: 'Computer Science',
      image: 'https://ui-avatars.com/api/?name=Rajesh+Kumar&background=0369a1&color=fff&size=400',
      email: 'rajesh.kumar@carmelcet.in',
      linkedin: '#',
    },
    {
      name: 'Dr. Priya Menon',
      role: 'Co-Faculty Advisor',
      department: 'Electronics',
      image: 'https://ui-avatars.com/api/?name=Priya+Menon&background=0369a1&color=fff&size=400',
      email: 'priya.menon@carmelcet.in',
      linkedin: '#',
    },
  ];

  const coreTeam = [
    {
      name: 'Aditya Menon',
      role: 'Chairperson',
      year: 'Final Year CSE',
      image: 'https://ui-avatars.com/api/?name=Aditya+Menon&background=0369a1&color=fff&size=400',
      email: 'aditya@example.com',
      linkedin: '#',
      github: '#',
    },
    {
      name: 'Sneha Krishnan',
      role: 'Vice Chairperson',
      year: 'Third Year ECE',
      image: 'https://ui-avatars.com/api/?name=Sneha+Krishnan&background=7c3aed&color=fff&size=400',
      email: 'sneha@example.com',
      linkedin: '#',
      github: '#',
    },
    {
      name: 'Arjun Prakash',
      role: 'Secretary',
      year: 'Final Year CSE',
      image: 'https://ui-avatars.com/api/?name=Arjun+Prakash&background=0369a1&color=fff&size=400',
      email: 'arjun@example.com',
      linkedin: '#',
      github: '#',
    },
    {
      name: 'Meera Nair',
      role: 'Treasurer',
      year: 'Third Year ECE',
      image: 'https://ui-avatars.com/api/?name=Meera+Nair&background=7c3aed&color=fff&size=400',
      email: 'meera@example.com',
      linkedin: '#',
      github: '#',
    },
    {
      name: 'Karthik Raghavan',
      role: 'Technical Lead',
      year: 'Final Year CSE',
      image: 'https://ui-avatars.com/api/?name=Karthik+Raghavan&background=0369a1&color=fff&size=400',
      email: 'karthik@example.com',
      linkedin: '#',
      github: '#',
    },
    {
      name: 'Divya Sharma',
      role: 'Event Coordinator',
      year: 'Third Year CSE',
      image: 'https://ui-avatars.com/api/?name=Divya+Sharma&background=7c3aed&color=fff&size=400',
      email: 'divya@example.com',
      linkedin: '#',
      github: '#',
    },
    {
      name: 'Rahul Menon',
      role: 'PR & Media Head',
      year: 'Third Year ECE',
      image: 'https://ui-avatars.com/api/?name=Rahul+Menon&background=0369a1&color=fff&size=400',
      email: 'rahul@example.com',
      linkedin: '#',
      github: '#',
    },
    {
      name: 'Anjali Iyer',
      role: 'Design Lead',
      year: 'Second Year CSE',
      image: 'https://ui-avatars.com/api/?name=Anjali+Iyer&background=7c3aed&color=fff&size=400',
      email: 'anjali@example.com',
      linkedin: '#',
      github: '#',
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
              Our Team
            </h1>
            <p className="text-xl text-blue-100">
              Meet the dedicated individuals driving IEEE forward at Carmel College
            </p>
          </motion.div>
        </div>
      </section>

      {/* Faculty Advisors */}
      <section className="section bg-white dark:bg-gray-900">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4 text-gray-900 dark:text-white">
              Faculty Advisors
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Guiding our branch with expertise and mentorship
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {faculty.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card text-center"
              >
                <div className="relative inline-block mb-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-40 h-40 rounded-full mx-auto border-4 border-ieee-blue/20"
                  />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                  {member.name}
                </h3>
                <p className="text-ieee-blue font-semibold text-lg mb-1">{member.role}</p>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{member.department}</p>
                <div className="flex justify-center space-x-3">
                  <a
                    href={`mailto:${member.email}`}
                    className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-ieee-blue hover:text-white transition-colors"
                    aria-label="Email"
                  >
                    <Mail size={20} />
                  </a>
                  <a
                    href={member.linkedin}
                    className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-ieee-blue hover:text-white transition-colors"
                    aria-label="LinkedIn"
                  >
                    in
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Team */}
      <section className="section bg-gray-50 dark:bg-gray-800">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4 text-gray-900 dark:text-white">
              Core Committee 2025-26
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              The leadership team managing day-to-day operations and events
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreTeam.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-gray-700 rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-shadow group"
              >
                <div className="relative inline-block mb-4">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-28 h-28 rounded-full mx-auto border-4 border-transparent group-hover:border-ieee-blue/30 transition-colors"
                  />
                </div>
                <h3 className="text-lg font-bold mb-1 text-gray-900 dark:text-white">
                  {member.name}
                </h3>
                <p className="text-ieee-blue font-semibold mb-1">{member.role}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{member.year}</p>
                <div className="flex justify-center space-x-2">
                  <a
                    href={`mailto:${member.email}`}
                    className="p-2 bg-gray-100 dark:bg-gray-600 rounded-lg hover:bg-ieee-blue hover:text-white transition-colors"
                    aria-label="Email"
                  >
                    <Mail size={16} />
                  </a>
                  <a
                    href={member.linkedin}
                    className="p-2 bg-gray-100 dark:bg-gray-600 rounded-lg hover:bg-ieee-blue hover:text-white transition-colors"
                    aria-label="LinkedIn"
                  >
                    in
                  </a>
                  <a
                    href={member.github}
                    className="p-2 bg-gray-100 dark:bg-gray-600 rounded-lg hover:bg-ieee-blue hover:text-white transition-colors"
                    aria-label="GitHub"
                  >
                    gh
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Team CTA */}
      <section className="section bg-gradient-to-br from-ieee-blue to-blue-800 text-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-6">
              Want to Join Our Team?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              We're always looking for passionate students to join our team. Contact us to learn about opportunities!
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

export default Team;
