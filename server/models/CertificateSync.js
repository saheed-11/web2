import mongoose from 'mongoose';

/**
 * Certificate Sync Log Model
 * Tracks Google Drive certificate synchronization attempts
 */
const certificateSyncSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  syncedAt: {
    type: Date,
    default: Date.now,
  },
  syncedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  driveFolderId: {
    type: String,
    required: true,
  },
  driveFolderUrl: String,
  // Sync statistics
  totalFiles: {
    type: Number,
    default: 0,
  },
  matchedCount: {
    type: Number,
    default: 0,
  },
  unmatchedCount: {
    type: Number,
    default: 0,
  },
  // Files that couldn't be matched to any participant
  unmatchedFiles: [{
    filename: String,
    fileId: String,
    reason: String, // 'no_participant_found', 'duplicate_name', etc.
  }],
  // Files with duplicate participant matches
  conflictFiles: [{
    filename: String,
    fileId: String,
    candidates: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      registrationId: String,
      name: String,
      email: String,
      similarity: Number,
    }],
  }],
  // Successfully matched files
  matchedFiles: [{
    filename: String,
    fileId: String,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    registrationId: String,
  }],
  // Sync status
  status: {
    type: String,
    enum: ['completed', 'partial', 'failed'],
    default: 'completed',
  },
  errorMessage: String,
});

const CertificateSync = mongoose.model('CertificateSync', certificateSyncSchema);

export default CertificateSync;
