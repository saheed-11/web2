import Registration from '../models/Registration.js';
import Event from '../models/Event.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

/**
 * @desc    Get all registrations for an event
 * @route   GET /api/events/:eventId/registrations
 * @access  Private/Admin
 */
export const getEventRegistrations = async (req, res) => {
  try {
    const { eventId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: 'Invalid event ID' });
    }

    const registrations = await Registration.find({ event: eventId })
      .populate('user', 'name email department year phone')
      .sort({ registeredAt: -1 });

    res.json(registrations);
  } catch (error) {
    console.error('Get event registrations error:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get single registration
 * @route   GET /api/registrations/:id
 * @access  Private
 */
export const getRegistration = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id)
      .populate('user', 'name email department year phone')
      .populate('event', 'title date location category');

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    // Allow user to see their own registration or admin to see any
    if (
      registration.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(registration);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Create new registration
 * @route   POST /api/events/:eventId/register
 * @access  Private
 */
export const createRegistration = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { formResponses, isIeeeMember, ieeeId } = req.body;

    // Validate eventId format
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: 'Invalid event ID format' });
    }

    // Validate user context
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'User authentication required' });
    }

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if registration is open
    if (!event.registrationOpen) {
      return res.status(400).json({ message: 'Registration is closed' });
    }

    // Check registration deadline
    if (event.registrationDeadline && new Date() > new Date(event.registrationDeadline)) {
      return res.status(400).json({ message: 'Registration deadline has passed' });
    }

    // Check if already registered
    const existingRegistration = await Registration.findOne({
      user: req.user._id,
      event: eventId,
    });

    if (existingRegistration) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }

    // Check capacity
    const registrationCount = await Registration.countDocuments({ event: eventId });
    if (registrationCount >= event.maxAttendees) {
      // Add to waitlist
      const registration = await Registration.create({
        user: req.user._id,
        event: eventId,
        formResponses,
        isIeeeMember,
        ieeeId,
        status: 'waitlist',
      });

      return res.status(201).json({
        message: 'Event is full. You have been added to the waitlist.',
        registration,
      });
    }

    // Determine payment requirement and amount
    let paymentRequired = !event.pricing.isFree;
    let paymentAmount = 0;

    if (paymentRequired) {
      paymentAmount = isIeeeMember
        ? event.pricing.ieeeMemberPrice
        : event.pricing.nonIeeeMemberPrice;
    }

    // Create registration
    const registration = await Registration.create({
      user: req.user._id,
      event: eventId,
      formResponses,
      isIeeeMember,
      ieeeId,
      status: paymentRequired ? 'pending_payment' : 'confirmed',
      payment: {
        required: paymentRequired,
        amount: paymentAmount,
        status: paymentRequired ? 'pending' : 'not_required',
      },
    });

    // Add to event attendees if not payment required
    if (!paymentRequired) {
      event.attendees.push(req.user._id);
      await event.save();
    }

    const populatedRegistration = await Registration.findById(registration._id)
      .populate('user', 'name email department year')
      .populate('event', 'title date location category');

    res.status(201).json({
      message: 'Registration successful',
      registration: populatedRegistration,
    });
  } catch (error) {
    console.error('Create registration error:', error);
    
    // Handle specific MongoDB errors
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'You are already registered for this event' 
      });
    }
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error: ' + Object.values(error.errors).map(e => e.message).join(', ')
      });
    }
    
    res.status(500).json({ message: error.message || 'Registration failed' });
  }
};

/**
 * @desc    Submit payment proof
 * @route   POST /api/registrations/:id/payment
 * @access  Private
 */
export const submitPaymentProof = async (req, res) => {
  try {
    const { transactionId, utrNumber, screenshotUrl } = req.body;

    const registration = await Registration.findById(req.params.id);

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    // Check ownership
    if (registration.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (!registration.payment.required) {
      return res.status(400).json({ message: 'Payment not required for this registration' });
    }

    registration.payment.transactionId = transactionId;
    registration.payment.utrNumber = utrNumber;
    registration.payment.screenshotUrl = screenshotUrl;
    registration.payment.status = 'submitted';
    registration.payment.submittedAt = new Date();

    await registration.save();

    res.json({
      message: 'Payment proof submitted successfully. Awaiting verification.',
      registration,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Verify payment (Admin)
 * @route   PUT /api/registrations/:id/payment/verify
 * @access  Private/Admin
 */
export const verifyPayment = async (req, res) => {
  try {
    const { approved, rejectionReason } = req.body;

    const registration = await Registration.findById(req.params.id);

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    if (approved) {
      registration.payment.status = 'approved';
      registration.payment.verifiedAt = new Date();
      registration.payment.verifiedBy = req.user._id;
      registration.status = 'confirmed';

      // Add to event attendees
      const event = await Event.findById(registration.event);
      if (!event.attendees.includes(registration.user)) {
        event.attendees.push(registration.user);
        await event.save();
      }
    } else {
      registration.payment.status = 'rejected';
      registration.payment.rejectionReason = rejectionReason;
      registration.status = 'pending_payment';
    }

    await registration.save();

    res.json({
      message: `Payment ${approved ? 'approved' : 'rejected'}`,
      registration,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Submit review/feedback
 * @route   POST /api/registrations/:id/review
 * @access  Private
 */
export const submitReview = async (req, res) => {
  try {
    const { responses } = req.body;

    const registration = await Registration.findById(req.params.id).populate('event');

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    // Check ownership
    if (registration.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Check if event has ended
    if (new Date() < new Date(registration.event.date)) {
      return res.status(400).json({ message: 'Cannot submit review before event ends' });
    }

    // Check review deadline
    if (
      registration.event.reviewSubmissionDeadline &&
      new Date() > new Date(registration.event.reviewSubmissionDeadline)
    ) {
      return res.status(400).json({ message: 'Review submission deadline has passed' });
    }

    registration.review.submitted = true;
    registration.review.responses = responses;
    registration.review.submittedAt = new Date();

    // Update certificate status if payment is confirmed
    if (registration.status === 'confirmed' && registration.certificate.url) {
      if (!registration.certificate.adminOverride) {
        registration.certificate.status = 'available';
        registration.certificate.unlockedAt = new Date();
      }
    } else if (registration.status === 'confirmed') {
      registration.certificate.status = 'review_pending';
    }

    await registration.save();

    res.json({
      message: 'Review submitted successfully',
      registration,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Download certificate
 * @route   GET /api/registrations/:id/certificate/download
 * @access  Private
 */
export const downloadCertificate = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    // Check ownership
    if (registration.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Check if certificate is available
    if (registration.certificate.status !== 'available') {
      let message = 'Certificate not available';

      if (registration.certificate.status === 'review_pending') {
        message = 'Please submit the post-event review to unlock your certificate';
      } else if (registration.certificate.status === 'locked') {
        message = 'Your registration is pending payment approval';
      } else if (registration.certificate.status === 'not_uploaded') {
        message = 'Certificate not yet published by organizer';
      }

      return res.status(403).json({ message });
    }

    // Update download count
    registration.certificate.downloadCount += 1;
    registration.certificate.lastDownloadedAt = new Date();
    await registration.save();

    // Return the Google Drive download URL
    res.json({
      certificateUrl: registration.certificate.url,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Mark attendance (Admin)
 * @route   PUT /api/registrations/:id/checkin
 * @access  Private/Admin
 */
export const markAttendance = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    registration.attended = true;
    registration.checkInTime = new Date();
    registration.checkInQrScanned = true;

    await registration.save();

    res.json({
      message: 'Attendance marked successfully',
      registration,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Cancel registration
 * @route   DELETE /api/registrations/:id
 * @access  Private
 */
export const cancelRegistration = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    // Check ownership or admin
    if (
      registration.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    registration.status = 'cancelled';
    await registration.save();

    // Remove from event attendees
    const event = await Event.findById(registration.event);
    event.attendees = event.attendees.filter(
      (attendee) => attendee.toString() !== registration.user.toString()
    );
    await event.save();

    // Promote from waitlist if available
    const waitlistRegistration = await Registration.findOne({
      event: registration.event,
      status: 'waitlist',
    }).sort({ registeredAt: 1 });

    if (waitlistRegistration) {
      waitlistRegistration.status = event.pricing.isFree ? 'confirmed' : 'pending_payment';
      await waitlistRegistration.save();

      // TODO: Send email notification to waitlisted user
    }

    res.json({ message: 'Registration cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get user's registrations
 * @route   GET /api/registrations/my
 * @access  Private
 */
export const getMyRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ user: req.user._id })
      .populate('event', 'title date location category image status')
      .sort({ registeredAt: -1 });

    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Export registrations to CSV (Admin)
 * @route   GET /api/events/:eventId/registrations/export
 * @access  Private/Admin
 */
export const exportRegistrations = async (req, res) => {
  try {
    const { eventId } = req.params;

    const registrations = await Registration.find({ event: eventId })
      .populate('user', 'name email department year phone')
      .populate('event', 'title date');

    // Convert to CSV format
    const csvHeader = 'Registration ID,Name,Email,Department,Year,Phone,IEEE Member,IEEE ID,Status,Payment Status,Attended,Registered At\n';

    const csvRows = registrations.map((reg) => {
      return [
        reg.registrationId,
        reg.user.name,
        reg.user.email,
        reg.user.department || '',
        reg.user.year || '',
        reg.user.phone || '',
        reg.isIeeeMember ? 'Yes' : 'No',
        reg.ieeeId || '',
        reg.status,
        reg.payment.status,
        reg.attended ? 'Yes' : 'No',
        new Date(reg.registeredAt).toLocaleString(),
      ].join(',');
    });

    const csv = csvHeader + csvRows.join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="registrations-${eventId}.csv"`);
    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
