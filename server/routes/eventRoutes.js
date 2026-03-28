import express from 'express';
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  unregisterFromEvent,
} from '../controllers/eventController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.route('/').get(getEvents).post(protect, admin, createEvent);

router
  .route('/:id')
  .get(getEventById)
  .put(protect, admin, updateEvent)
  .delete(protect, admin, deleteEvent);

router
  .route('/:id/register')
  .post(protect, registerForEvent)
  .delete(protect, unregisterFromEvent);

export default router;
