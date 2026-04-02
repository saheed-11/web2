import mongoose from 'mongoose';

const emailTemplateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  // Template type
  type: {
    type: String,
    enum: [
      'registration_confirmation',
      'event_reminder',
      'certificate_notification',
      'welcome',
      'password_reset',
      'announcement',
      'custom',
    ],
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  // HTML body with placeholders like {{name}}, {{eventTitle}}, etc.
  htmlBody: {
    type: String,
    required: true,
  },
  // Plain text version
  textBody: String,
  // Available placeholders for this template
  placeholders: [{
    key: String,
    description: String,
    example: String,
  }],
  // Is this template active?
  active: {
    type: Boolean,
    default: true,
  },
  // Is this a system template (can't be deleted)?
  isSystem: {
    type: Boolean,
    default: false,
  },
  // Preview data for testing
  previewData: {
    type: mongoose.Schema.Types.Mixed,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  updatedBy: {
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

// Pre-save middleware
emailTemplateSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const EmailTemplate = mongoose.model('EmailTemplate', emailTemplateSchema);

export default EmailTemplate;
