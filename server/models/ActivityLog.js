import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema({
  // Who performed the action
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // Action type
  action: {
    type: String,
    enum: [
      // Event actions
      'event_created',
      'event_updated',
      'event_deleted',
      'event_status_changed',
      'registration_opened',
      'registration_closed',
      // Registration actions
      'event_registered',
      'registration_cancelled',
      // Payment actions
      'payment_verified',
      'payment_rejected',
      // User actions
      'user_created',
      'user_updated',
      'user_deleted',
      'user_role_changed',
      // Certificate actions
      'certificate_uploaded',
      'certificate_deleted',
      'certificate_email_sent',
      // Email actions
      'email_sent',
      'bulk_email_sent',
      // Attendance actions
      'attendance_marked',
      'attendance_unmarked',
      // System actions
      'settings_updated',
      'login',
      'logout',
    ],
    required: true,
  },
  // Description of what happened
  description: {
    type: String,
    required: true,
  },
  // Related entities
  targetType: {
    type: String,
    enum: ['event', 'user', 'certificate', 'email', 'settings', 'system'],
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  targetName: String,
  // Additional details (JSON)
  metadata: {
    type: mongoose.Schema.Types.Mixed,
  },
  // IP address for security
  ipAddress: String,
  userAgent: String,
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for efficient queries
activityLogSchema.index({ user: 1, createdAt: -1 });
activityLogSchema.index({ action: 1, createdAt: -1 });
activityLogSchema.index({ targetType: 1, targetId: 1 });

// Static method to create log entry
activityLogSchema.statics.log = async function(data) {
  try {
    const log = await this.create(data);
    return log;
  } catch (error) {
    console.error('Failed to create activity log:', error);
    return null;
  }
};

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

export default ActivityLog;
