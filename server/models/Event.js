import mongoose from 'mongoose';

// Custom registration form field schema
const formFieldSchema = new mongoose.Schema({
  fieldId: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['text', 'email', 'phone', 'textarea', 'dropdown', 'checkbox', 'radio', 'file', 'date', 'number'],
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  placeholder: String,
  required: {
    type: Boolean,
    default: false,
  },
  options: [String], // For dropdown, checkbox, radio
  order: {
    type: Number,
    default: 0,
  },
});

// Speaker schema
const speakerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  designation: String,
  organization: String,
  image: String,
  bio: String,
});

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide event title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide event description'],
  },
  date: {
    type: Date,
    required: [true, 'Please provide event date'],
  },
  endDate: {
    type: Date,
  },
  time: {
    type: String,
    required: [true, 'Please provide event time'],
  },
  endTime: String,
  location: {
    type: String,
    required: [true, 'Please provide event location'],
  },
  // Event mode: online, offline, hybrid
  mode: {
    type: String,
    enum: ['online', 'offline', 'hybrid'],
    default: 'offline',
  },
  // Online meeting link
  meetingLink: String,
  // Event category
  category: {
    type: String,
    enum: ['Workshop', 'Bootcamp', 'Seminar', 'Conference', 'Competition', 'Hackathon', 'Webinar', 'Tech Talk', 'Networking', 'Other'],
    required: [true, 'Please provide event category'],
  },
  // Legacy type field - keeping for backward compatibility
  type: {
    type: String,
    enum: ['Workshop', 'Bootcamp', 'Seminar', 'Conference', 'Competition', 'Hackathon', 'Webinar', 'Tech Talk', 'Networking', 'Other'],
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
  },
  // Event status
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming',
  },
  registrationOpen: {
    type: Boolean,
    default: true,
  },
  registrationDeadline: Date,
  maxAttendees: {
    type: Number,
    default: 100,
  },
  // Speakers/Guests
  speakers: [speakerSchema],
  // Custom registration form fields
  customFields: [formFieldSchema],
  // Tags for filtering
  tags: [String],
  // Admin notes (internal)
  adminNotes: String,
  // QR code for check-in
  qrCode: String,
  attendees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  certificates: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    certificateUrl: {
      type: String,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
    emailSent: {
      type: Boolean,
      default: false,
    },
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save middleware to sync type with category
eventSchema.pre('save', function() {
  if (this.category && !this.type) {
    this.type = this.category;
  }
  if (this.type && !this.category) {
    this.category = this.type;
  }
});

// Virtual for registration count
eventSchema.virtual('registrationCount').get(function() {
  return this.attendees?.length || 0;
});

// Virtual for checking if event is full
eventSchema.virtual('isFull').get(function() {
  return this.attendees?.length >= this.maxAttendees;
});

// Virtual for available spots
eventSchema.virtual('availableSpots').get(function() {
  return Math.max(0, this.maxAttendees - (this.attendees?.length || 0));
});

// Enable virtuals in JSON
eventSchema.set('toJSON', { virtuals: true });
eventSchema.set('toObject', { virtuals: true });

const Event = mongoose.model('Event', eventSchema);

export default Event;
