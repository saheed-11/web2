import mongoose from 'mongoose';

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
  time: {
    type: String,
    required: [true, 'Please provide event time'],
  },
  location: {
    type: String,
    required: [true, 'Please provide event location'],
  },
  type: {
    type: String,
    enum: ['Workshop', 'Bootcamp', 'Seminar', 'Conference', 'Competition'],
    required: [true, 'Please provide event type'],
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
  },
  registrationOpen: {
    type: Boolean,
    default: true,
  },
  maxAttendees: {
    type: Number,
    default: 100,
  },
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

const Event = mongoose.model('Event', eventSchema);

export default Event;
