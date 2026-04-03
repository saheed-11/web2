import express from 'express';
import {
  getEventRegistrations,
  getRegistration,
  createRegistration,
  submitPaymentProof,
  verifyPayment,
  submitReview,
  downloadCertificate,
  markAttendance,
  cancelRegistration,
  getMyRegistrations,
  exportRegistrations,
} from '../controllers/registrationController.js';
import {
  syncCertificates,
  assignCertificate,
  getSyncLogs,
  resolveConflict,
} from '../controllers/certificateController.js';
import { getEventAnalytics } from '../controllers/analyticsController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Registration routes
router.get('/my', protect, getMyRegistrations);
router.get('/:id', protect, getRegistration);
router.post('/events/:eventId/register', protect, createRegistration);
router.post('/:id/payment', protect, submitPaymentProof);
router.put('/:id/payment/verify', protect, admin, verifyPayment);
router.post('/:id/review', protect, submitReview);
router.get('/:id/certificate/download', protect, downloadCertificate);
router.put('/:id/checkin', protect, admin, markAttendance);
router.delete('/:id', protect, cancelRegistration);

// Event-specific registration routes
router.get('/events/:eventId/registrations', protect, admin, getEventRegistrations);
router.get('/events/:eventId/registrations/export', protect, admin, exportRegistrations);

// Certificate management routes
router.post('/events/:eventId/certificates/sync', protect, admin, syncCertificates);
router.get('/events/:eventId/certificates/sync-logs', protect, admin, getSyncLogs);
router.put('/:id/certificate/assign', protect, admin, assignCertificate);
router.put('/certificates/resolve-conflict', protect, admin, resolveConflict);

// Analytics routes
router.get('/events/:eventId/analytics', protect, admin, getEventAnalytics);

export default router;
