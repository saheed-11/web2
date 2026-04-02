import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  // Recipient (null for broadcast to all admins)
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  // For role-based notifications
  targetRole: {
    type: String,
    enum: ['all', 'admin', 'student', 'volunteer'],
  },
  // Notification type
  type: {
    type: String,
    enum: [
      'event_created',
      'event_updated',
      'event_cancelled',
      'event_reminder',
      'registration_new',
      'registration_cancelled',
      'certificate_uploaded',
      'member_joined',
      'member_role_changed',
      'system',
      'announcement',
    ],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  // Related entities
  relatedEvent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
  },
  relatedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  // Action link
  actionUrl: String,
  actionLabel: String,
  // Read status (tracked per user for broadcast notifications)
  readBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    readAt: {
      type: Date,
      default: Date.now,
    },
  }],
  // For individual notifications
  read: {
    type: Boolean,
    default: false,
  },
  readAt: Date,
  // Priority
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal',
  },
  // Auto-expire
  expiresAt: Date,
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for efficient queries
notificationSchema.index({ user: 1, read: 1, createdAt: -1 });
notificationSchema.index({ targetRole: 1, createdAt: -1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
