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
  // Unique registration ID (e.g., IEEE-EVT-2025-0047)
  registrationId: {
    type: String,
    unique: true,
    required: true,
  },
  // Custom form responses
  formResponses: [fieldResponseSchema],
  // Registration status
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'waitlist', 'pending_payment'],
    default: 'confirmed',
  },
  // IEEE membership info (captured during registration)
  isIeeeMember: {
    type: Boolean,
    default: false,
  },
  ieeeId: String,
  // Payment information
  payment: {
    required: {
      type: Boolean,
      default: false,
    },
    amount: Number,
    status: {
      type: String,
      enum: ['pending', 'submitted', 'approved', 'rejected', 'not_required'],
      default: 'not_required',
    },
    transactionId: String,
    utrNumber: String,
    screenshotUrl: String,
    submittedAt: Date,
    verifiedAt: Date,
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    rejectionReason: String,
  },
  // Attendance
  attended: {
    type: Boolean,
    default: false,
  },
  checkInTime: Date,
  checkOutTime: Date,
  checkInQrScanned: {
    type: Boolean,
    default: false,
  },
  // Certificate information
  certificate: {
    status: {
      type: String,
      enum: ['not_uploaded', 'locked', 'review_pending', 'available'],
      default: 'not_uploaded',
    },
    url: String, // Google Drive direct download URL
    unlockedAt: Date,
    adminOverride: {
      type: Boolean,
      default: false,
    },
    downloadCount: {
      type: Number,
      default: 0,
    },
    lastDownloadedAt: Date,
  },
  // Review/Feedback (post-event)
  review: {
    submitted: {
      type: Boolean,
      default: false,
    },
    responses: [fieldResponseSchema],
    submittedAt: Date,
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

/**
 * Pre-save middleware to generate unique registration ID and update timestamp
 * Format: IEEE-EVT-YYYY-XXXX (e.g., IEEE-EVT-2025-0047)
 */
registrationSchema.pre('save', async function() {
  this.updatedAt = new Date();

  // Generate registration ID if not already set
  if (!this.registrationId) {
    const year = new Date().getFullYear();
    const count = await this.constructor.countDocuments({ event: this.event });
    const paddedCount = String(count + 1).padStart(4, '0');
    this.registrationId = `IEEE-EVT-${year}-${paddedCount}`;
  }
});

const Registration = mongoose.model('Registration', registrationSchema);

export default Registration;
