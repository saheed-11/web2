import { google } from 'googleapis';
import Registration from '../models/Registration.js';
import CertificateSync from '../models/CertificateSync.js';
import Event from '../models/Event.js';

/**
 * Initialize Google Drive API client
 */
const initDriveClient = () => {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
  });

  return google.drive({ version: 'v3', auth });
};

/**
 * Normalize name for matching
 * Converts "John Doe" to "john_doe", handles special characters
 */
const normalizeName = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, '') // Remove special characters
    .replace(/\s+/g, '_'); // Replace spaces with underscores
};

/**
 * Extract name from filename
 * "john_doe.pdf" -> "john_doe"
 */
const extractNameFromFilename = (filename) => {
  return filename
    .replace(/\.(pdf|PDF)$/, '') // Remove extension
    .toLowerCase()
    .trim();
};

/**
 * Calculate similarity between two strings (simple Levenshtein-like)
 */
const calculateSimilarity = (str1, str2) => {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;

  if (longer.length === 0) return 1.0;

  const editDistance = (s1, s2) => {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();

    const costs = [];
    for (let i = 0; i <= s1.length; i++) {
      let lastValue = i;
      for (let j = 0; j <= s2.length; j++) {
        if (i === 0) costs[j] = j;
        else {
          if (j > 0) {
            let newValue = costs[j - 1];
            if (s1.charAt(i - 1) !== s2.charAt(j - 1))
              newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
            costs[j - 1] = lastValue;
            lastValue = newValue;
          }
        }
      }
      if (i > 0) costs[s2.length] = lastValue;
    }
    return costs[s2.length];
  };

  return (longer.length - editDistance(longer, shorter)) / parseFloat(longer.length);
};

/**
 * @desc    Sync certificates from Google Drive
 * @route   POST /api/events/:eventId/certificates/sync
 * @access  Private/Admin
 */
export const syncCertificates = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { driveFolderId, driveFolderUrl } = req.body;

    if (!driveFolderId) {
      return res.status(400).json({ message: 'Google Drive folder ID is required' });
    }

    // Validate Google Drive credentials
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
      return res.status(500).json({
        message: 'Google Drive API credentials not configured. Please set environment variables.',
      });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Initialize Drive client
    const drive = initDriveClient();

    // List all files in the folder
    const response = await drive.files.list({
      q: `'${driveFolderId}' in parents and trashed=false and mimeType='application/pdf'`,
      fields: 'files(id, name, webViewLink)',
      pageSize: 1000,
    });

    const files = response.data.files || [];

    if (files.length === 0) {
      return res.status(400).json({
        message: 'No PDF files found in the specified Google Drive folder',
      });
    }

    // Get all registrations for this event
    const registrations = await Registration.find({ event: eventId }).populate('user', 'name email');

    const matchedFiles = [];
    const unmatchedFiles = [];
    const conflictFiles = [];

    // Match each file to a participant
    for (const file of files) {
      const fileNameNormalized = extractNameFromFilename(file.name);

      // Try to find exact match
      const candidates = registrations
        .map((reg) => {
          const userNameNormalized = normalizeName(reg.user.name);
          const similarity = calculateSimilarity(fileNameNormalized, userNameNormalized);

          return {
            registration: reg,
            similarity,
          };
        })
        .filter((c) => c.similarity > 0.7) // Only keep if similarity > 70%
        .sort((a, b) => b.similarity - a.similarity);

      if (candidates.length === 0) {
        // No match found
        unmatchedFiles.push({
          filename: file.name,
          fileId: file.id,
          reason: 'no_participant_found',
        });
      } else if (candidates.length === 1 || candidates[0].similarity > 0.95) {
        // Single match or very high confidence match
        const registration = candidates[0].registration;
        const certificateUrl = `https://drive.google.com/uc?export=download&id=${file.id}`;

        registration.certificate.url = certificateUrl;
        registration.certificate.status = 'locked'; // Default to locked

        // Unlock if conditions met
        if (
          registration.status === 'confirmed' &&
          (registration.review.submitted || registration.certificate.adminOverride)
        ) {
          registration.certificate.status = 'available';
          registration.certificate.unlockedAt = new Date();
        } else if (registration.status === 'confirmed' && !registration.review.submitted) {
          registration.certificate.status = 'review_pending';
        }

        await registration.save();

        matchedFiles.push({
          filename: file.name,
          fileId: file.id,
          userId: registration.user._id,
          registrationId: registration.registrationId,
        });
      } else {
        // Multiple potential matches - conflict
        conflictFiles.push({
          filename: file.name,
          fileId: file.id,
          candidates: candidates.slice(0, 3).map((c) => ({
            userId: c.registration.user._id,
            registrationId: c.registration.registrationId,
            name: c.registration.user.name,
            email: c.registration.user.email,
            similarity: c.similarity,
          })),
        });
      }
    }

    // Update event with sync info
    event.certificatesDriveFolderId = driveFolderId;
    event.certificatesDriveFolderUrl = driveFolderUrl || '';
    event.lastCertificateSync = {
      syncedAt: new Date(),
      syncedBy: req.user._id,
      matchedCount: matchedFiles.length,
      unmatchedCount: unmatchedFiles.length + conflictFiles.length,
    };
    await event.save();

    // Create sync log
    const syncLog = await CertificateSync.create({
      event: eventId,
      syncedBy: req.user._id,
      driveFolderId,
      driveFolderUrl,
      totalFiles: files.length,
      matchedCount: matchedFiles.length,
      unmatchedCount: unmatchedFiles.length,
      matchedFiles,
      unmatchedFiles,
      conflictFiles,
      status: conflictFiles.length > 0 ? 'partial' : 'completed',
    });

    res.json({
      message: 'Certificate sync completed',
      syncLog: {
        totalFiles: files.length,
        matched: matchedFiles.length,
        unmatched: unmatchedFiles.length,
        conflicts: conflictFiles.length,
        matchedFiles,
        unmatchedFiles,
        conflictFiles,
      },
    });
  } catch (error) {
    console.error('Certificate sync error:', error);

    // Log failed sync
    if (req.params.eventId) {
      await CertificateSync.create({
        event: req.params.eventId,
        syncedBy: req.user._id,
        driveFolderId: req.body.driveFolderId,
        driveFolderUrl: req.body.driveFolderUrl,
        status: 'failed',
        errorMessage: error.message,
      });
    }

    res.status(500).json({
      message: 'Certificate sync failed',
      error: error.message,
    });
  }
};

/**
 * @desc    Manually assign certificate to a participant
 * @route   PUT /api/registrations/:id/certificate/assign
 * @access  Private/Admin
 */
export const assignCertificate = async (req, res) => {
  try {
    const { certificateUrl, adminOverride } = req.body;

    const registration = await Registration.findById(req.params.id);

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    registration.certificate.url = certificateUrl;
    registration.certificate.adminOverride = adminOverride || false;

    // Determine status
    if (registration.status === 'confirmed' && (registration.review.submitted || adminOverride)) {
      registration.certificate.status = 'available';
      registration.certificate.unlockedAt = new Date();
    } else if (registration.status === 'confirmed') {
      registration.certificate.status = 'review_pending';
    } else {
      registration.certificate.status = 'locked';
    }

    await registration.save();

    res.json({
      message: 'Certificate assigned successfully',
      registration,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get certificate sync logs for an event
 * @route   GET /api/events/:eventId/certificates/sync-logs
 * @access  Private/Admin
 */
export const getSyncLogs = async (req, res) => {
  try {
    const { eventId } = req.params;

    const logs = await CertificateSync.find({ event: eventId })
      .populate('syncedBy', 'name email')
      .sort({ syncedAt: -1 });

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Resolve certificate conflict
 * @route   PUT /api/certificates/resolve-conflict
 * @access  Private/Admin
 */
export const resolveConflict = async (req, res) => {
  try {
    const { syncLogId, fileId, registrationId } = req.body;

    const syncLog = await CertificateSync.findById(syncLogId);

    if (!syncLog) {
      return res.status(404).json({ message: 'Sync log not found' });
    }

    // Find the conflict
    const conflict = syncLog.conflictFiles.find((c) => c.fileId === fileId);

    if (!conflict) {
      return res.status(404).json({ message: 'Conflict not found' });
    }

    // Find the registration
    const registration = await Registration.findOne({ registrationId });

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    // Assign certificate
    const certificateUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
    registration.certificate.url = certificateUrl;

    if (registration.status === 'confirmed' && registration.review.submitted) {
      registration.certificate.status = 'available';
      registration.certificate.unlockedAt = new Date();
    } else if (registration.status === 'confirmed') {
      registration.certificate.status = 'review_pending';
    } else {
      registration.certificate.status = 'locked';
    }

    await registration.save();

    // Remove from conflicts, add to matched
    syncLog.conflictFiles = syncLog.conflictFiles.filter((c) => c.fileId !== fileId);
    syncLog.matchedFiles.push({
      filename: conflict.filename,
      fileId: conflict.fileId,
      userId: registration.user,
      registrationId: registration.registrationId,
    });
    syncLog.matchedCount += 1;

    await syncLog.save();

    res.json({
      message: 'Conflict resolved successfully',
      registration,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
