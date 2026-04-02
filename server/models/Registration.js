import mongoose from 'mongoose';

// Schema for storing custom form field responses
const fieldResponseSchema = new mongoose.Schema({
  fieldId: {
    type: String,
    required: true,
  },
  fieldLabel: String,
  fieldType: String,
  value: mongoose.Schema.Types.Mixed, // Can store string, array, file path, etc.
});

const registrationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  // Custom form responses
  formResponses: [fieldResponseSchema],
  // Registration status
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'waitlist'],
    default: 'confirmed',
  },
  // Attendance
  attended: {
    type: Boolean,
    default: false,
  },
  checkInTime: Date,
  checkOutTime: Date,
  // Certificate
  certificateUrl: String,
  certificateEmailSent: {
    type: Boolean,
    default: false,
  },
  // Email tracking
  confirmationEmailSent: {
    type: Boolean,
    default: false,
  },
  reminderEmailSent: {
    type: Boolean,
    default: false,
  },
  // Feedback
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    comment: String,
    submittedAt: Date,
  },
  // Timestamps
  registeredAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound index to ensure unique registration per user per event
registrationSchema.index({ user: 1, event: 1 }, { unique: true });

// Pre-save middleware
registrationSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Registration = mongoose.model('Registration', registrationSchema);

export default Registration;
