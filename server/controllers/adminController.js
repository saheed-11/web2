import User from '../models/User.js';
import Event from '../models/Event.js';
import multer from 'multer';
import path from 'path';

// Configure multer for certificate uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'server/uploads/certificates/');
  },
  filename: function (req, file, cb) {
    cb(null, `cert-${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: Images and PDFs only!');
    }
  }
}).single('certificate');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
// @access  Private/Admin
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('registeredEvents.event');

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
export const updateUserRole = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.role = req.body.role || user.role;
      user.updatedAt = Date.now();

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      // Don't allow admin to delete themselves
      if (user._id.toString() === req.user._id.toString()) {
        return res.status(400).json({ message: 'Cannot delete your own account' });
      }

      await user.deleteOne();
      res.json({ message: 'User removed' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upload certificate for user
// @route   POST /api/admin/events/:eventId/certificate/:userId
// @access  Private/Admin
export const uploadCertificate = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err });
    }

    try {
      const { eventId, userId } = req.params;
      const event = await Event.findById(eventId);
      const user = await User.findById(userId);

      if (!event || !user) {
        return res.status(404).json({ message: 'Event or User not found' });
      }

      if (!req.file) {
        return res.status(400).json({ message: 'Please upload a certificate file' });
      }

      const certificateUrl = `/uploads/certificates/${req.file.filename}`;

      // Add certificate to event
      event.certificates.push({
        user: userId,
        certificateUrl,
        uploadedAt: Date.now(),
      });
      await event.save();

      // Update user's registered events with certificate
      const registeredEvent = user.registeredEvents.find(
        reg => reg.event.toString() === eventId
      );

      if (registeredEvent) {
        registeredEvent.certificateUrl = certificateUrl;
        registeredEvent.attended = true;
        await user.save();
      }

      res.json({
        message: 'Certificate uploaded successfully',
        certificateUrl,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
};

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'student' });
    const totalEvents = await Event.countDocuments({});
    const upcomingEvents = await Event.countDocuments({ date: { $gte: new Date() } });
    const totalRegistrations = await User.aggregate([
      { $unwind: '$registeredEvents' },
      { $count: 'total' }
    ]);

    res.json({
      totalUsers,
      totalEvents,
      upcomingEvents,
      totalRegistrations: totalRegistrations[0]?.total || 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
