import Event from '../models/Event.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

// Helper function to validate MongoDB ObjectId
const isValidObjectId = (id) => {
  if (!id || typeof id !== 'string') return false;
  try {
    return mongoose.Types.ObjectId.isValid(id) && 
           (new mongoose.Types.ObjectId(id)).toString() === id;
  } catch (error) {
    return false;
  }
};

// @desc    Get all events
// @route   GET /api/events
// @access  Public
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find({}).sort({ date: -1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
export const getEventById = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid event ID format' });
    }

    const event = await Event.findById(req.params.id).populate('attendees', 'name email');

    if (event) {
      res.json(event);
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new event
// @route   POST /api/events
// @access  Private/Admin
export const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      endDate,
      time,
      endTime,
      location,
      type,
      category,
      mode,
      meetingLink,
      status,
      image,
      maxAttendees,
      speakers,
      registrationOpen,
      registrationDeadline,
      tags,
      customFields,
      reviewFormFields,
      reviewSubmissionDeadline,
      pricing,
      upiConfig,
      certificatesDriveFolderId,
      certificatesDriveFolderUrl,
      registrationSlug,
    } = req.body;

    const event = await Event.create({
      title,
      description,
      date,
      endDate,
      time,
      endTime,
      location,
      type: type || category, // Use type or category
      category: category || type, // Use category or type
      mode: mode || 'offline',
      meetingLink,
      status: status || 'draft',
      image,
      maxAttendees,
      speakers: speakers || [],
      registrationOpen: registrationOpen !== undefined ? registrationOpen : true,
      registrationDeadline,
      tags: tags || [],
      customFields: customFields || [],
      reviewFormFields: reviewFormFields || [],
      reviewSubmissionDeadline,
      pricing: pricing || { isFree: true, ieeeMemberPrice: 0, nonIeeeMemberPrice: 0, currency: 'INR' },
      upiConfig,
      certificatesDriveFolderId,
      certificatesDriveFolderUrl,
      registrationSlug,
      createdBy: req.user._id,
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private/Admin
export const updateEvent = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid event ID format' });
    }

    const event = await Event.findById(req.params.id);

    if (event) {
      event.title = req.body.title || event.title;
      event.description = req.body.description || event.description;
      event.date = req.body.date || event.date;
      event.endDate = req.body.endDate !== undefined ? req.body.endDate : event.endDate;
      event.time = req.body.time || event.time;
      event.endTime = req.body.endTime !== undefined ? req.body.endTime : event.endTime;
      event.location = req.body.location || event.location;
      event.type = req.body.type || req.body.category || event.type;
      event.category = req.body.category || req.body.type || event.category;
      event.mode = req.body.mode || event.mode;
      event.meetingLink = req.body.meetingLink !== undefined ? req.body.meetingLink : event.meetingLink;
      event.status = req.body.status || event.status;
      event.image = req.body.image !== undefined ? req.body.image : event.image;
      event.registrationOpen = req.body.registrationOpen !== undefined
        ? req.body.registrationOpen
        : event.registrationOpen;
      event.registrationDeadline = req.body.registrationDeadline !== undefined
        ? req.body.registrationDeadline
        : event.registrationDeadline;
      event.maxAttendees = req.body.maxAttendees || event.maxAttendees;

      // Handle speakers array - filter out any speakers without a name
      if (req.body.speakers !== undefined) {
        event.speakers = (req.body.speakers || []).filter(s => s && s.name);
      }

      // Handle tags array
      if (req.body.tags !== undefined) {
        event.tags = req.body.tags || [];
      }

      // Handle custom fields
      if (req.body.customFields !== undefined) {
        event.customFields = req.body.customFields || [];
      }

      // Handle review form fields
      if (req.body.reviewFormFields !== undefined) {
        event.reviewFormFields = req.body.reviewFormFields || [];
      }

      // Handle review submission deadline
      if (req.body.reviewSubmissionDeadline !== undefined) {
        event.reviewSubmissionDeadline = req.body.reviewSubmissionDeadline;
      }

      // Handle pricing configuration
      if (req.body.pricing !== undefined) {
        event.pricing = req.body.pricing;
      }

      // Handle UPI configuration
      if (req.body.upiConfig !== undefined) {
        event.upiConfig = req.body.upiConfig;
      }

      // Handle certificate drive folder
      if (req.body.certificatesDriveFolderId !== undefined) {
        event.certificatesDriveFolderId = req.body.certificatesDriveFolderId;
      }
      if (req.body.certificatesDriveFolderUrl !== undefined) {
        event.certificatesDriveFolderUrl = req.body.certificatesDriveFolderUrl;
      }

      // Handle registration slug
      if (req.body.registrationSlug !== undefined) {
        event.registrationSlug = req.body.registrationSlug;
      }

      event.updatedAt = Date.now();

      const updatedEvent = await event.save();
      res.json(updatedEvent);
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ message: error.message || 'Failed to update event' });
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private/Admin
export const deleteEvent = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid event ID format' });
    }

    const event = await Event.findById(req.params.id);

    if (event) {
      await event.deleteOne();
      res.json({ message: 'Event removed' });
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Register for event
// @route   POST /api/events/:id/register
// @access  Private
export const registerForEvent = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid event ID format' });
    }

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (!event.registrationOpen) {
      return res.status(400).json({ message: 'Registration is closed for this event' });
    }

    if (event.attendees.length >= event.maxAttendees) {
      return res.status(400).json({ message: 'Event is full' });
    }

    // Check if already registered
    const alreadyRegistered = event.attendees.includes(req.user._id);

    if (alreadyRegistered) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }

    // Add user to event attendees
    event.attendees.push(req.user._id);
    await event.save();

    // Add event to user's registered events using findByIdAndUpdate to bypass pre-save hook
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $push: {
          registeredEvents: {
            event: event._id,
            registeredAt: new Date(),
            attended: false,
          }
        }
      }
    );

    res.json({ message: 'Successfully registered for event' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Unregister from event
// @route   DELETE /api/events/:id/register
// @access  Private
export const unregisterFromEvent = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid event ID format' });
    }

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Remove user from event attendees
    event.attendees = event.attendees.filter(
      attendee => attendee.toString() !== req.user._id.toString()
    );
    await event.save();

    // Remove event from user's registered events using findByIdAndUpdate
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $pull: {
          registeredEvents: { event: event._id }
        }
      }
    );

    res.json({ message: 'Successfully unregistered from event' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
