import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Event from './models/Event.js';
import Registration from './models/Registration.js';
import EmailTemplate from './models/EmailTemplate.js';
import ActivityLog from './models/ActivityLog.js';
import Notification from './models/Notification.js';
import EmailLog from './models/EmailLog.js';
import CertificateSync from './models/CertificateSync.js';

dotenv.config();

/**
 * IEEE Student Branch Database Seed Script
 *
 * This script seeds the database with comprehensive sample data including:
 * - Users (1 admin, 3 students)
 * - Events (6 events with full details: pricing, tags, custom fields, speakers, etc.)
 * - Registrations (5 registrations linking users to events)
 * - Email Templates (4 system templates for various email types)
 * - Activity Logs (6 activity records for tracking user actions)
 * - Notifications (5 notifications for events and registrations)
 * - Email Logs (3 email records for tracking sent emails)
 *
 * The seed data reflects the current database schema with all latest fields including:
 * - Event pricing configuration (IEEE member vs non-member)
 * - UPI payment configuration
 * - Custom registration form fields
 * - Review form fields for post-event feedback
 * - Meeting links for online/hybrid events
 * - Tags and categories for better event organization
 * - Comprehensive payment tracking and verification
 * - Certificate management system
 *
 * Run with: npm run seed
 */

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
    // Clear existing data from all collections
    await User.deleteMany({});
    await Event.deleteMany({});
    await Registration.deleteMany({});
    await EmailTemplate.deleteMany({});
    await ActivityLog.deleteMany({});
    await Notification.deleteMany({});
    await EmailLog.deleteMany({});
    await CertificateSync.deleteMany({});
    console.log('Cleared existing data from all collections');

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

    // Create sample events with new fields
    const events = await Event.insertMany([
      {
        title: 'Web Development Workshop',
        description: 'Learn modern web development with React and Node.js. This hands-on workshop covers frontend and backend development.',
        date: new Date('2024-04-15'),
        endDate: new Date('2024-04-15'),
        time: '10:00 AM',
        endTime: '5:00 PM',
        location: 'Main Auditorium',
        category: 'Workshop',
        type: 'Workshop',
        mode: 'offline',
        status: 'upcoming',
        image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee',
        registrationOpen: true,
        registrationDeadline: new Date('2024-04-14'),
        maxAttendees: 100,
        tags: ['Web Development', 'React', 'Node.js', 'Full Stack'],
        speakers: [
          { name: 'Dr. Sarah Wilson', designation: 'Senior Developer', organization: 'TechCorp', bio: 'Expert in full-stack development with 10+ years of experience.' }
        ],
        pricing: {
          isFree: false,
          ieeeMemberPrice: 100,
          nonIeeeMemberPrice: 150,
          currency: 'INR'
        },
        upiConfig: {
          upiId: 'ieee@upi',
          payeeName: 'IEEE Student Branch'
        },
        customFields: [
          {
            fieldId: 'laptop',
            type: 'radio',
            label: 'Will you bring a laptop?',
            required: true,
            options: ['Yes', 'No'],
            order: 1
          },
          {
            fieldId: 'experience',
            type: 'dropdown',
            label: 'Your web development experience',
            required: true,
            options: ['Beginner', 'Intermediate', 'Advanced'],
            order: 2
          }
        ],
        reviewFormFields: [
          {
            fieldId: 'rating',
            type: 'rating',
            label: 'Overall rating',
            required: true,
            order: 1
          },
          {
            fieldId: 'feedback',
            type: 'textarea',
            label: 'Your feedback',
            required: false,
            order: 2
          }
        ],
        createdBy: admin._id,
      },
      {
        title: 'AI & Machine Learning Bootcamp',
        description: 'Intensive bootcamp covering AI and ML fundamentals including neural networks, deep learning, and practical applications.',
        date: new Date('2024-04-20'),
        endDate: new Date('2024-04-22'),
        time: '9:00 AM',
        endTime: '6:00 PM',
        location: 'Lab Building',
        category: 'Bootcamp',
        type: 'Bootcamp',
        mode: 'hybrid',
        meetingLink: 'https://meet.google.com/abc-defg-hij',
        status: 'upcoming',
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995',
        registrationOpen: true,
        registrationDeadline: new Date('2024-04-18'),
        maxAttendees: 50,
        tags: ['AI', 'Machine Learning', 'Deep Learning', 'Neural Networks'],
        speakers: [
          { name: 'Prof. James Chen', designation: 'AI Researcher', organization: 'MIT', bio: 'Leading researcher in neural networks and AI systems.' },
          { name: 'Dr. Emily Brown', designation: 'ML Engineer', organization: 'Google', bio: 'Senior ML engineer with expertise in production ML systems.' }
        ],
        pricing: {
          isFree: false,
          ieeeMemberPrice: 500,
          nonIeeeMemberPrice: 750,
          currency: 'INR'
        },
        upiConfig: {
          upiId: 'ieee@upi',
          payeeName: 'IEEE Student Branch'
        },
        createdBy: admin._id,
      },
      {
        title: 'Cloud Computing Seminar',
        description: 'Industry experts discussing cloud technologies, AWS, Azure, and Google Cloud platforms.',
        date: new Date('2024-04-25'),
        endDate: new Date('2024-04-25'),
        time: '2:00 PM',
        endTime: '4:00 PM',
        location: 'Online - Zoom',
        category: 'Seminar',
        type: 'Seminar',
        mode: 'online',
        meetingLink: 'https://zoom.us/j/123456789',
        status: 'upcoming',
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa',
        registrationOpen: true,
        registrationDeadline: new Date('2024-04-24'),
        maxAttendees: 150,
        tags: ['Cloud Computing', 'AWS', 'Azure', 'Google Cloud'],
        speakers: [
          { name: 'Alex Johnson', designation: 'Cloud Architect', organization: 'AWS', bio: 'AWS certified architect with 8 years of cloud experience.' }
        ],
        pricing: {
          isFree: true,
          currency: 'INR'
        },
        createdBy: admin._id,
      },
      {
        title: 'IEEE Tech Conference 2024',
        description: 'Annual technology conference featuring keynote speakers, panel discussions, and networking opportunities.',
        date: new Date('2024-05-01'),
        endDate: new Date('2024-05-02'),
        time: '9:00 AM',
        endTime: '5:00 PM',
        location: 'Grand Hall',
        category: 'Conference',
        type: 'Conference',
        mode: 'offline',
        status: 'upcoming',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
        registrationOpen: true,
        registrationDeadline: new Date('2024-04-28'),
        maxAttendees: 300,
        tags: ['Conference', 'Technology', 'Networking', 'Innovation'],
        speakers: [
          { name: 'Dr. Michael Lee', designation: 'IEEE Fellow', organization: 'IEEE', bio: 'IEEE Fellow with contributions to wireless communications.' },
          { name: 'Lisa Park', designation: 'CTO', organization: 'StartupHub', bio: 'Tech entrepreneur and startup mentor.' },
          { name: 'Robert Williams', designation: 'Professor', organization: 'Stanford', bio: 'Professor of Computer Science at Stanford University.' }
        ],
        pricing: {
          isFree: false,
          ieeeMemberPrice: 200,
          nonIeeeMemberPrice: 350,
          currency: 'INR'
        },
        upiConfig: {
          upiId: 'ieee@upi',
          payeeName: 'IEEE Student Branch'
        },
        createdBy: admin._id,
      },
      {
        title: 'Hackathon 2024',
        description: '24-hour coding competition with amazing prizes. Build innovative solutions and compete with the best.',
        date: new Date('2024-05-10'),
        endDate: new Date('2024-05-11'),
        time: '8:00 AM',
        endTime: '8:00 AM',
        location: 'Innovation Center',
        category: 'Hackathon',
        type: 'Hackathon',
        mode: 'offline',
        status: 'upcoming',
        image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d',
        registrationOpen: true,
        registrationDeadline: new Date('2024-05-08'),
        maxAttendees: 80,
        tags: ['Hackathon', 'Coding', 'Competition', 'Innovation'],
        speakers: [],
        pricing: {
          isFree: false,
          ieeeMemberPrice: 250,
          nonIeeeMemberPrice: 400,
          currency: 'INR'
        },
        upiConfig: {
          upiId: 'ieee@upi',
          payeeName: 'IEEE Student Branch'
        },
        customFields: [
          {
            fieldId: 'team_name',
            type: 'text',
            label: 'Team Name',
            required: true,
            order: 1
          },
          {
            fieldId: 'team_size',
            type: 'dropdown',
            label: 'Team Size',
            required: true,
            options: ['1', '2', '3', '4'],
            order: 2
          }
        ],
        createdBy: admin._id,
      },
      {
        title: 'Cybersecurity Webinar',
        description: 'Learn about the latest cybersecurity threats and how to protect your systems.',
        date: new Date('2024-05-15'),
        endDate: new Date('2024-05-15'),
        time: '3:00 PM',
        endTime: '5:00 PM',
        location: 'Online - Teams',
        category: 'Webinar',
        type: 'Webinar',
        mode: 'online',
        meetingLink: 'https://teams.microsoft.com/l/meetup-join/xyz',
        status: 'upcoming',
        image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b',
        registrationOpen: true,
        registrationDeadline: new Date('2024-05-14'),
        maxAttendees: 200,
        tags: ['Cybersecurity', 'Security', 'Webinar', 'Ethical Hacking'],
        speakers: [
          { name: 'David Kim', designation: 'Security Expert', organization: 'CyberSec Inc.', bio: 'Certified ethical hacker and security consultant.' }
        ],
        pricing: {
          isFree: true,
          currency: 'INR'
        },
        createdBy: admin._id,
      },
    ]);
    console.log(`${events.length} events created`);

    // Create email templates
    const emailTemplates = await EmailTemplate.insertMany([
      {
        name: 'Registration Confirmation',
        type: 'registration_confirmation',
        subject: 'Registration Confirmed - {{eventTitle}}',
        htmlBody: `
          <h2>Registration Confirmed!</h2>
          <p>Dear {{userName}},</p>
          <p>Your registration for <strong>{{eventTitle}}</strong> has been confirmed.</p>
          <p><strong>Event Details:</strong></p>
          <ul>
            <li>Date: {{eventDate}}</li>
            <li>Time: {{eventTime}}</li>
            <li>Location: {{eventLocation}}</li>
            <li>Mode: {{eventMode}}</li>
          </ul>
          <p><strong>Registration ID:</strong> {{registrationId}}</p>
          {{#if meetingLink}}
          <p><strong>Meeting Link:</strong> <a href="{{meetingLink}}">{{meetingLink}}</a></p>
          {{/if}}
          <p>We look forward to seeing you at the event!</p>
          <p>Best regards,<br>IEEE Student Branch</p>
        `,
        textBody: 'Your registration for {{eventTitle}} has been confirmed. Registration ID: {{registrationId}}',
        placeholders: [
          { key: '{{userName}}', description: 'Name of the registered user', example: 'John Doe' },
          { key: '{{eventTitle}}', description: 'Title of the event', example: 'Web Development Workshop' },
          { key: '{{eventDate}}', description: 'Event date', example: '2024-04-15' },
          { key: '{{eventTime}}', description: 'Event time', example: '10:00 AM' },
          { key: '{{eventLocation}}', description: 'Event location', example: 'Main Auditorium' },
          { key: '{{eventMode}}', description: 'Event mode', example: 'offline' },
          { key: '{{registrationId}}', description: 'Unique registration ID', example: 'IEEE-EVT-2024-0001' },
          { key: '{{meetingLink}}', description: 'Online meeting link if applicable', example: 'https://zoom.us/j/123' }
        ],
        active: true,
        isSystem: true,
        createdBy: admin._id,
      },
      {
        name: 'Event Reminder',
        type: 'event_reminder',
        subject: 'Reminder: {{eventTitle}} - Tomorrow!',
        htmlBody: `
          <h2>Event Reminder</h2>
          <p>Dear {{userName}},</p>
          <p>This is a friendly reminder that <strong>{{eventTitle}}</strong> is happening tomorrow!</p>
          <p><strong>Event Details:</strong></p>
          <ul>
            <li>Date: {{eventDate}}</li>
            <li>Time: {{eventTime}}</li>
            <li>Location: {{eventLocation}}</li>
          </ul>
          {{#if meetingLink}}
          <p><strong>Meeting Link:</strong> <a href="{{meetingLink}}">Join here</a></p>
          {{/if}}
          <p>Don't forget to bring your ID and any required materials.</p>
          <p>See you there!<br>IEEE Student Branch</p>
        `,
        textBody: 'Reminder: {{eventTitle}} is tomorrow at {{eventTime}}. Location: {{eventLocation}}',
        placeholders: [
          { key: '{{userName}}', description: 'Name of the user', example: 'John Doe' },
          { key: '{{eventTitle}}', description: 'Title of the event', example: 'Web Development Workshop' },
          { key: '{{eventDate}}', description: 'Event date', example: '2024-04-15' },
          { key: '{{eventTime}}', description: 'Event time', example: '10:00 AM' },
          { key: '{{eventLocation}}', description: 'Event location', example: 'Main Auditorium' },
          { key: '{{meetingLink}}', description: 'Online meeting link', example: 'https://zoom.us/j/123' }
        ],
        active: true,
        isSystem: true,
        createdBy: admin._id,
      },
      {
        name: 'Certificate Notification',
        type: 'certificate_notification',
        subject: 'Your Certificate is Ready - {{eventTitle}}',
        htmlBody: `
          <h2>Certificate Available!</h2>
          <p>Dear {{userName}},</p>
          <p>Congratulations! Your certificate for <strong>{{eventTitle}}</strong> is now available.</p>
          <p>You can download your certificate from your dashboard.</p>
          <p><strong>Certificate Link:</strong> <a href="{{certificateUrl}}">Download Certificate</a></p>
          <p>Thank you for participating!</p>
          <p>Best regards,<br>IEEE Student Branch</p>
        `,
        textBody: 'Your certificate for {{eventTitle}} is ready. Download it from: {{certificateUrl}}',
        placeholders: [
          { key: '{{userName}}', description: 'Name of the user', example: 'John Doe' },
          { key: '{{eventTitle}}', description: 'Title of the event', example: 'Web Development Workshop' },
          { key: '{{certificateUrl}}', description: 'Direct link to certificate', example: 'https://drive.google.com/...' }
        ],
        active: true,
        isSystem: true,
        createdBy: admin._id,
      },
      {
        name: 'Welcome Email',
        type: 'welcome',
        subject: 'Welcome to IEEE Student Branch!',
        htmlBody: `
          <h2>Welcome!</h2>
          <p>Dear {{userName}},</p>
          <p>Welcome to the IEEE Student Branch community!</p>
          <p>We're excited to have you join us. Explore upcoming events, register for workshops, and connect with fellow students.</p>
          <p>Your account has been successfully created with email: {{userEmail}}</p>
          <p>Best regards,<br>IEEE Student Branch</p>
        `,
        textBody: 'Welcome to IEEE Student Branch! Your account has been created.',
        placeholders: [
          { key: '{{userName}}', description: 'Name of the user', example: 'John Doe' },
          { key: '{{userEmail}}', description: 'Email of the user', example: 'john@student.edu' }
        ],
        active: true,
        isSystem: true,
        createdBy: admin._id,
      },
    ]);
    console.log(`${emailTemplates.length} email templates created`);

    // Create registrations linking students to events
    const registrations = await Registration.create([
      {
        user: students[0]._id,
        event: events[0]._id,
        registrationId: 'IEEE-EVT-2024-0001',
        status: 'confirmed',
        isIeeeMember: true,
        ieeeId: 'IEEE12345',
        formResponses: [
          { fieldId: 'laptop', fieldLabel: 'Will you bring a laptop?', fieldType: 'radio', value: 'Yes' },
          { fieldId: 'experience', fieldLabel: 'Your web development experience', fieldType: 'dropdown', value: 'Intermediate' }
        ],
        payment: {
          required: true,
          amount: 100,
          status: 'approved',
          transactionId: 'TXN123456',
          utrNumber: 'UTR123456',
          verifiedAt: new Date(),
          verifiedBy: admin._id,
        },
        attended: false,
        confirmationEmailSent: true,
      },
      {
        user: students[1]._id,
        event: events[0]._id,
        registrationId: 'IEEE-EVT-2024-0002',
        status: 'confirmed',
        isIeeeMember: false,
        formResponses: [
          { fieldId: 'laptop', fieldLabel: 'Will you bring a laptop?', fieldType: 'radio', value: 'Yes' },
          { fieldId: 'experience', fieldLabel: 'Your web development experience', fieldType: 'dropdown', value: 'Beginner' }
        ],
        payment: {
          required: true,
          amount: 150,
          status: 'approved',
          transactionId: 'TXN123457',
          verifiedAt: new Date(),
          verifiedBy: admin._id,
        },
        attended: false,
        confirmationEmailSent: true,
      },
      {
        user: students[2]._id,
        event: events[1]._id,
        registrationId: 'IEEE-EVT-2024-0003',
        status: 'confirmed',
        isIeeeMember: true,
        ieeeId: 'IEEE67890',
        payment: {
          required: true,
          amount: 500,
          status: 'approved',
          transactionId: 'TXN123458',
          verifiedAt: new Date(),
          verifiedBy: admin._id,
        },
        attended: false,
        confirmationEmailSent: true,
      },
      {
        user: students[0]._id,
        event: events[2]._id,
        registrationId: 'IEEE-EVT-2024-0004',
        status: 'confirmed',
        isIeeeMember: true,
        ieeeId: 'IEEE12345',
        payment: {
          required: false,
          status: 'not_required',
        },
        attended: false,
        confirmationEmailSent: true,
      },
      {
        user: students[1]._id,
        event: events[4]._id,
        registrationId: 'IEEE-EVT-2024-0005',
        status: 'confirmed',
        isIeeeMember: false,
        formResponses: [
          { fieldId: 'team_name', fieldLabel: 'Team Name', fieldType: 'text', value: 'Code Warriors' },
          { fieldId: 'team_size', fieldLabel: 'Team Size', fieldType: 'dropdown', value: '3' }
        ],
        payment: {
          required: true,
          amount: 400,
          status: 'pending',
        },
        attended: false,
        confirmationEmailSent: true,
      },
    ]);
    console.log(`${registrations.length} registrations created`);

    // Update events with attendees
    await Event.findByIdAndUpdate(events[0]._id, {
      $push: { attendees: { $each: [students[0]._id, students[1]._id] } }
    });
    await Event.findByIdAndUpdate(events[1]._id, {
      $push: { attendees: students[2]._id }
    });
    await Event.findByIdAndUpdate(events[2]._id, {
      $push: { attendees: students[0]._id }
    });
    await Event.findByIdAndUpdate(events[4]._id, {
      $push: { attendees: students[1]._id }
    });
    console.log('Updated events with attendees');

    // Create activity logs
    const activityLogs = await ActivityLog.create([
      {
        user: admin._id,
        action: 'event_created',
        description: 'Created event: Web Development Workshop',
        targetType: 'event',
        targetId: events[0]._id,
        targetName: 'Web Development Workshop',
        metadata: { category: 'Workshop', mode: 'offline' }
      },
      {
        user: admin._id,
        action: 'event_created',
        description: 'Created event: AI & Machine Learning Bootcamp',
        targetType: 'event',
        targetId: events[1]._id,
        targetName: 'AI & Machine Learning Bootcamp',
        metadata: { category: 'Bootcamp', mode: 'hybrid' }
      },
      {
        user: admin._id,
        action: 'user_created',
        description: 'Created admin user',
        targetType: 'user',
        targetId: admin._id,
        targetName: 'Admin User',
        metadata: { role: 'admin' }
      },
      {
        user: students[0]._id,
        action: 'event_registered',
        description: 'Registered for: Web Development Workshop',
        targetType: 'event',
        targetId: events[0]._id,
        targetName: 'Web Development Workshop',
        metadata: { registrationId: 'IEEE-EVT-2024-0001' }
      },
      {
        user: students[1]._id,
        action: 'event_registered',
        description: 'Registered for: Web Development Workshop',
        targetType: 'event',
        targetId: events[0]._id,
        targetName: 'Web Development Workshop',
        metadata: { registrationId: 'IEEE-EVT-2024-0002' }
      },
      {
        user: admin._id,
        action: 'payment_verified',
        description: 'Verified payment for registration IEEE-EVT-2024-0001',
        targetType: 'event',
        targetId: events[0]._id,
        targetName: 'Web Development Workshop',
        metadata: { registrationId: 'IEEE-EVT-2024-0001', amount: 100 }
      },
    ]);
    console.log(`${activityLogs.length} activity logs created`);

    // Create notifications
    const notifications = await Notification.create([
      {
        targetRole: 'all',
        type: 'event_created',
        title: 'New Event: Web Development Workshop',
        message: 'A new workshop on web development has been added. Register now!',
        relatedEvent: events[0]._id,
        priority: 'normal',
        actionUrl: `/events/${events[0]._id}`,
        actionLabel: 'View Event',
      },
      {
        targetRole: 'all',
        type: 'event_created',
        title: 'New Event: AI & Machine Learning Bootcamp',
        message: 'Join our intensive 3-day AI bootcamp. Limited seats available!',
        relatedEvent: events[1]._id,
        priority: 'high',
        actionUrl: `/events/${events[1]._id}`,
        actionLabel: 'Register Now',
      },
      {
        user: students[0]._id,
        type: 'registration_new',
        title: 'Registration Confirmed',
        message: 'Your registration for Web Development Workshop has been confirmed.',
        relatedEvent: events[0]._id,
        relatedUser: students[0]._id,
        priority: 'high',
        actionUrl: `/my-registrations`,
        actionLabel: 'View Registration',
      },
      {
        user: students[1]._id,
        type: 'registration_new',
        title: 'Registration Confirmed',
        message: 'Your registration for Web Development Workshop has been confirmed.',
        relatedEvent: events[0]._id,
        relatedUser: students[1]._id,
        priority: 'high',
        actionUrl: `/my-registrations`,
        actionLabel: 'View Registration',
      },
      {
        targetRole: 'admin',
        type: 'system',
        title: 'System Update',
        message: 'Database has been seeded with initial data.',
        priority: 'low',
      },
    ]);
    console.log(`${notifications.length} notifications created`);

    // Create email logs
    const emailLogs = await EmailLog.create([
      {
        to: students[0].email,
        toUser: students[0]._id,
        subject: 'Registration Confirmed - Web Development Workshop',
        htmlBody: '<p>Your registration has been confirmed.</p>',
        template: emailTemplates[0]._id,
        templateName: 'Registration Confirmation',
        relatedEvent: events[0]._id,
        type: 'registration_confirmation',
        status: 'sent',
        sentAt: new Date(),
        sentBy: admin._id,
      },
      {
        to: students[1].email,
        toUser: students[1]._id,
        subject: 'Registration Confirmed - Web Development Workshop',
        htmlBody: '<p>Your registration has been confirmed.</p>',
        template: emailTemplates[0]._id,
        templateName: 'Registration Confirmation',
        relatedEvent: events[0]._id,
        type: 'registration_confirmation',
        status: 'sent',
        sentAt: new Date(),
        sentBy: admin._id,
      },
      {
        to: students[2].email,
        toUser: students[2]._id,
        subject: 'Registration Confirmed - AI & Machine Learning Bootcamp',
        htmlBody: '<p>Your registration has been confirmed.</p>',
        template: emailTemplates[0]._id,
        templateName: 'Registration Confirmation',
        relatedEvent: events[1]._id,
        type: 'registration_confirmation',
        status: 'sent',
        sentAt: new Date(),
        sentBy: admin._id,
      },
    ]);
    console.log(`${emailLogs.length} email logs created`);

    console.log('\n✅ Seed data created successfully!\n');
    console.log('=== Database Summary ===');
    console.log(`Users: ${1 + students.length} (1 admin, ${students.length} students)`);
    console.log(`Events: ${events.length} with complete details (pricing, tags, custom fields, etc.)`);
    console.log(`Registrations: ${registrations.length} linking users to events`);
    console.log(`Email Templates: ${emailTemplates.length} system templates`);
    console.log(`Activity Logs: ${activityLogs.length} activity records`);
    console.log(`Notifications: ${notifications.length} notifications`);
    console.log(`Email Logs: ${emailLogs.length} email records`);
    console.log('\n=== Login Credentials ===');
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
