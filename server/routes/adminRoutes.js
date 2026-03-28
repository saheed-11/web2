import express from 'express';
import {
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
  uploadCertificate,
  getDashboardStats,
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(protect, admin);

router.get('/stats', getDashboardStats);
router.route('/users').get(getAllUsers);
router.route('/users/:id').get(getUserById).delete(deleteUser);
router.put('/users/:id/role', updateUserRole);
router.post('/events/:eventId/certificate/:userId', uploadCertificate);

export default router;
