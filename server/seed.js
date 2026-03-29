import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Event from './models/Event.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Event.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    // Don't pre-hash - the User model's pre-save hook handles hashing
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@ieee.edu',
      password: 'Admin@123',
      role: 'admin',
      phone: '+1234567890',
      department: 'Computer Science',
      year: '4th',
    });
    console.log('Admin user created:', admin.email);

    // Create sample students
    // insertMany doesn't trigger pre-save hooks, so we must hash passwords manually
    const hashedStudentPassword = await bcrypt.hash('Student@123', 10);
    const students = await User.insertMany([
      {
        name: 'John Doe',
        email: 'john@student.edu',
        password: hashedStudentPassword,
        role: 'student',
        phone: '+1234567891',
        department: 'Computer Science',
        year: '2nd',
      },
      {
        name: 'Jane Smith',
        email: 'jane@student.edu',
        password: hashedStudentPassword,
        role: 'student',
        phone: '+1234567892',
        department: 'Electronics',
        year: '3rd',
      },
      {
        name: 'Mike Johnson',
        email: 'mike@student.edu',
        password: hashedStudentPassword,
        role: 'student',
        phone: '+1234567893',
        department: 'Electrical',
        year: '1st',
      },
    ]);
    console.log(`${students.length} students created`);

    // Create sample events
    const events = await Event.insertMany([
      {
        title: 'Web Development Workshop',
        description: 'Learn modern web development with React and Node.js',
        date: new Date('2024-04-15'),
        time: '10:00 AM',
        location: 'Main Auditorium',
        type: 'Workshop',
        image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee',
        registrationOpen: true,
        maxAttendees: 100,
        createdBy: admin._id,
      },
      {
        title: 'AI & Machine Learning Bootcamp',
        description: 'Intensive bootcamp covering AI and ML fundamentals',
        date: new Date('2024-04-20'),
        time: '9:00 AM',
        location: 'Lab Building',
        type: 'Bootcamp',
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995',
        registrationOpen: true,
        maxAttendees: 50,
        createdBy: admin._id,
      },
      {
        title: 'Cloud Computing Seminar',
        description: 'Industry experts discussing cloud technologies',
        date: new Date('2024-04-25'),
        time: '2:00 PM',
        location: 'Conference Hall',
        type: 'Seminar',
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa',
        registrationOpen: true,
        maxAttendees: 150,
        createdBy: admin._id,
      },
      {
        title: 'IEEE Tech Conference 2024',
        description: 'Annual technology conference with guest speakers',
        date: new Date('2024-05-01'),
        time: '9:00 AM',
        location: 'Grand Hall',
        type: 'Conference',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
        registrationOpen: true,
        maxAttendees: 300,
        createdBy: admin._id,
      },
      {
        title: 'Hackathon 2024',
        description: '24-hour coding competition with prizes',
        date: new Date('2024-05-10'),
        time: '8:00 AM',
        location: 'Innovation Center',
        type: 'Competition',
        image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d',
        registrationOpen: true,
        maxAttendees: 80,
        createdBy: admin._id,
      },
    ]);
    console.log(`${events.length} events created`);

    console.log('\n✅ Seed data created successfully!\n');
    console.log('Credentials:');
    console.log('Admin - Email: admin@ieee.edu, Password: Admin@123');
    console.log('Student - Email: john@student.edu, Password: Student@123');
    console.log('Student - Email: jane@student.edu, Password: Student@123');
    console.log('Student - Email: mike@student.edu, Password: Student@123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

connectDB().then(() => seedData());
