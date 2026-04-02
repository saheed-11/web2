import mongoose from 'mongoose';

const emailLogSchema = new mongoose.Schema({
  // Recipient
  to: {
    type: String,
    required: true,
  },
  toUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  // Sender
  from: String,
  // Email details
  subject: {
    type: String,
    required: true,
  },
  htmlBody: String,
  textBody: String,
  // Template used
  template: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EmailTemplate',
  },
  templateName: String,
  // Related entities
  relatedEvent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
  },
  // Email type
  type: {
    type: String,
    enum: [
      'registration_confirmation',
      'event_reminder',
      'certificate_notification',
      'welcome',
      'password_reset',
      'announcement',
      'bulk',
      'custom',
    ],
  },
  // Status
  status: {
    type: String,
    enum: ['pending', 'sent', 'failed', 'bounced'],
    default: 'pending',
  },
  // Error message if failed
  error: String,
  // Tracking
  sentAt: Date,
  openedAt: Date,
  clickedAt: Date,
  // Sent by
  sentBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for efficient queries
emailLogSchema.index({ to: 1, createdAt: -1 });
emailLogSchema.index({ status: 1, createdAt: -1 });
emailLogSchema.index({ relatedEvent: 1 });

const EmailLog = mongoose.model('EmailLog', emailLogSchema);

export default EmailLog;
