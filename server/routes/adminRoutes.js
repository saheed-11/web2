import express from 'express';
import {
  getAllUsers,
  getUserById,
  updateUserRole,
  updateUser,
  deleteUser,
  uploadCertificate,
  getDashboardStats,
  getAnalytics,
  getActivityLogs,
  getAdminNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  generateEventQR,
  markAttendance,
  getEmailLogs,
  exportUsers,
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(protect, admin);

// Dashboard & Analytics
router.get('/stats', getDashboardStats);
router.get('/analytics', getAnalytics);

// Users
router.get('/users', getAllUsers);
router.get('/users/export', exportUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

// Certificates
router.post('/events/:eventId/certificate/:userId', uploadCertificate);

// QR Code & Attendance
router.post('/events/:id/qr', generateEventQR);
router.post('/events/:eventId/attendance/:userId', markAttendance);

// Activity Logs
router.get('/activity-logs', getActivityLogs);

// Notifications
router.get('/notifications', getAdminNotifications);
router.put('/notifications/read-all', markAllNotificationsRead);
router.put('/notifications/:id/read', markNotificationRead);

// Email Logs
router.get('/email-logs', getEmailLogs);

export default router;
