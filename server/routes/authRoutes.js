import express from 'express';
import {
  signup,
  login,
  getProfile,
  updateProfile,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.route('/profile').get(protect, getProfile).put(protect, updateProfile);

export default router;
