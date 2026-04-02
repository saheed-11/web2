import User from '../models/User.js';
import Event from '../models/Event.js';
import Registration from '../models/Registration.js';
import ActivityLog from '../models/ActivityLog.js';
import Notification from '../models/Notification.js';
import EmailLog from '../models/EmailLog.js';
import multer from 'multer';
import path from 'path';
import QRCode from 'qrcode';

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

// Helper function to log activity
const logActivity = async (userId, action, description, targetType, targetId, targetName, metadata, req) => {
  try {
    await ActivityLog.create({
      user: userId,
      action,
      description,
      targetType,
      targetId,
      targetName,
      metadata,
      ipAddress: req?.ip || req?.connection?.remoteAddress,
      userAgent: req?.headers?.['user-agent'],
    });
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
};

// Helper function to create notification
const createNotification = async (data) => {
  try {
    await Notification.create(data);
  } catch (error) {
    console.error('Failed to create notification:', error);
  }
};

// @desc    Get all users with filters
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    const { search, role, department, year, page = 1, limit = 20 } = req.query;
    
    let query = {};
    
    // Search by name or email
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    
    // Filter by role
    if (role && role !== 'all') {
      query.role = role;
    }
    
    // Filter by department
    if (department && department !== 'all') {
      query.department = department;
    }
    
    // Filter by year
    if (year && year !== 'all') {
      query.year = year;
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [users, total] = await Promise.all([
      User.find(query)
        .select('-password')
        .populate('registeredEvents.event', 'title date')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      User.countDocuments(query),
    ]);
    
    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
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
      const oldRole = user.role;
      user.role = req.body.role || user.role;
      user.updatedAt = Date.now();

      await User.findByIdAndUpdate(req.params.id, { role: user.role, updatedAt: user.updatedAt });

      // Log activity
      await logActivity(
        req.user._id,
        'user_role_changed',
        `Changed ${user.name}'s role from ${oldRole} to ${user.role}`,
        'user',
        user._id,
        user.name,
        { oldRole, newRole: user.role },
        req
      );

      // Create notification for the user
      await createNotification({
        user: user._id,
        type: 'member_role_changed',
        title: 'Role Updated',
        message: `Your role has been updated to ${user.role}`,
        priority: 'normal',
      });

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user details
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
export const updateUser = async (req, res) => {
  try {
    const { name, phone, department, year, role } = req.body;
    
    const updateFields = {};
    if (name) updateFields.name = name;
    if (phone !== undefined) updateFields.phone = phone;
    if (department !== undefined) updateFields.department = department;
    if (year !== undefined) updateFields.year = year;
    if (role) updateFields.role = role;
    updateFields.updatedAt = new Date();

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    ).select('-password');

    if (user) {
      await logActivity(
        req.user._id,
        'user_updated',
        `Updated user: ${user.name}`,
        'user',
        user._id,
        user.name,
        updateFields,
        req
      );

      res.json(user);
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

      const userName = user.name;
      await user.deleteOne();

      // Log activity
      await logActivity(
        req.user._id,
        'user_deleted',
        `Deleted user: ${userName}`,
        'user',
        req.params.id,
        userName,
        null,
        req
      );

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
      const existingCert = event.certificates.find(c => c.user.toString() === userId);
      if (existingCert) {
        existingCert.certificateUrl = certificateUrl;
        existingCert.uploadedAt = Date.now();
      } else {
        event.certificates.push({
          user: userId,
          certificateUrl,
          uploadedAt: Date.now(),
        });
      }
      await event.save();

      // Update user's registered events with certificate using findByIdAndUpdate
      await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            'registeredEvents.$[elem].certificateUrl': certificateUrl,
            'registeredEvents.$[elem].attended': true,
          }
        },
        {
          arrayFilters: [{ 'elem.event': eventId }]
        }
      );

      // Log activity
      await logActivity(
        req.user._id,
        'certificate_uploaded',
        `Uploaded certificate for ${user.name} - Event: ${event.title}`,
        'certificate',
        eventId,
        event.title,
        { userId, userName: user.name },
        req
      );

      // Create notification
      await createNotification({
        user: userId,
        type: 'certificate_uploaded',
        title: 'Certificate Available',
        message: `Your certificate for ${event.title} is now available for download`,
        relatedEvent: eventId,
        actionUrl: `/profile`,
        actionLabel: 'Download Certificate',
        priority: 'high',
      });

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
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const [
      totalUsers,
      totalAdmins,
      totalEvents,
      upcomingEvents,
      ongoingEvents,
      completedEvents,
      totalRegistrations,
      newUsersThisMonth,
      registrationsThisMonth,
    ] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'admin' }),
      Event.countDocuments({}),
      Event.countDocuments({ status: 'upcoming', date: { $gte: now } }),
      Event.countDocuments({ status: 'ongoing' }),
      Event.countDocuments({ status: 'completed' }),
      User.aggregate([
        { $unwind: '$registeredEvents' },
        { $count: 'total' }
      ]),
      User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      User.aggregate([
        { $unwind: '$registeredEvents' },
        { $match: { 'registeredEvents.registeredAt': { $gte: thirtyDaysAgo } } },
        { $count: 'total' }
      ]),
    ]);

    // Get active events (ongoing + upcoming with open registration)
    const activeEvents = await Event.countDocuments({
      $or: [
        { status: 'ongoing' },
        { status: 'upcoming', registrationOpen: true }
      ]
    });

    res.json({
      totalUsers,
      totalAdmins,
      totalEvents,
      upcomingEvents,
      ongoingEvents,
      completedEvents,
      activeEvents,
      totalRegistrations: totalRegistrations[0]?.total || 0,
      newUsersThisMonth,
      registrationsThisMonth: registrationsThisMonth[0]?.total || 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get analytics data
// @route   GET /api/admin/analytics
// @access  Private/Admin
export const getAnalytics = async (req, res) => {
  try {
    const { period = '6months' } = req.query;
    
    let startDate;
    const now = new Date();
    
    switch (period) {
      case '7days':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30days':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '6months':
        startDate = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
        break;
      case '1year':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
    }

    // Member growth over time
    const memberGrowth = await User.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // Event registrations over time
    const eventRegistrations = await User.aggregate([
      { $unwind: '$registeredEvents' },
      { $match: { 'registeredEvents.registeredAt': { $gte: startDate } } },
      {
        $group: {
          _id: {
            year: { $year: '$registeredEvents.registeredAt' },
            month: { $month: '$registeredEvents.registeredAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // Events by category
    const eventsByCategory = await Event.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalAttendees: { $sum: { $size: '$attendees' } },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Department distribution
    const departmentDistribution = await User.aggregate([
      { $match: { department: { $exists: true, $ne: '' } } },
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Top events by registrations
    const topEvents = await Event.find({})
      .select('title category date attendees')
      .sort({ 'attendees.length': -1 })
      .limit(5)
      .lean();

    // Attendance rate
    const attendanceData = await User.aggregate([
      { $unwind: '$registeredEvents' },
      {
        $group: {
          _id: null,
          totalRegistrations: { $sum: 1 },
          totalAttended: { $sum: { $cond: ['$registeredEvents.attended', 1, 0] } },
        },
      },
    ]);

    const attendanceRate = attendanceData[0]
      ? Math.round((attendanceData[0].totalAttended / attendanceData[0].totalRegistrations) * 100)
      : 0;

    res.json({
      memberGrowth: memberGrowth.map(item => ({
        month: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
        count: item.count,
      })),
      eventRegistrations: eventRegistrations.map(item => ({
        month: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
        count: item.count,
      })),
      eventsByCategory: eventsByCategory.map(item => ({
        category: item._id || 'Other',
        count: item.count,
        attendees: item.totalAttendees,
      })),
      departmentDistribution: departmentDistribution.map(item => ({
        department: item._id,
        count: item.count,
      })),
      topEvents: topEvents.map(event => ({
        title: event.title,
        category: event.category,
        date: event.date,
        registrations: event.attendees?.length || 0,
      })),
      attendanceRate,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get activity logs
// @route   GET /api/admin/activity-logs
// @access  Private/Admin
export const getActivityLogs = async (req, res) => {
  try {
    const { page = 1, limit = 20, action, userId } = req.query;
    
    let query = {};
    if (action) query.action = action;
    if (userId) query.user = userId;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [logs, total] = await Promise.all([
      ActivityLog.find(query)
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      ActivityLog.countDocuments(query),
    ]);
    
    res.json({
      logs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get notifications (admin)
// @route   GET /api/admin/notifications
// @access  Private/Admin
export const getAdminNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20, unreadOnly = false } = req.query;
    
    let query = {
      $or: [
        { user: req.user._id },
        { targetRole: 'admin' },
        { targetRole: 'all' },
      ],
    };
    
    if (unreadOnly === 'true') {
      query.$and = [
        query.$or ? { $or: query.$or } : {},
        {
          $or: [
            { read: false },
            { 'readBy.user': { $ne: req.user._id } },
          ],
        },
      ];
      delete query.$or;
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [notifications, total] = await Promise.all([
      Notification.find(query)
        .populate('relatedEvent', 'title')
        .populate('relatedUser', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Notification.countDocuments(query),
    ]);
    
    // Count unread
    const unreadCount = await Notification.countDocuments({
      $or: [
        { user: req.user._id, read: false },
        { targetRole: { $in: ['admin', 'all'] }, 'readBy.user': { $ne: req.user._id } },
      ],
    });
    
    res.json({
      notifications,
      unreadCount,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/admin/notifications/:id/read
// @access  Private/Admin
export const markNotificationRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    // For individual notifications
    if (notification.user) {
      notification.read = true;
      notification.readAt = new Date();
    } else {
      // For broadcast notifications
      const alreadyRead = notification.readBy.find(
        r => r.user.toString() === req.user._id.toString()
      );
      if (!alreadyRead) {
        notification.readBy.push({ user: req.user._id });
      }
    }
    
    await notification.save();
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/admin/notifications/read-all
// @access  Private/Admin
export const markAllNotificationsRead = async (req, res) => {
  try {
    // Mark individual notifications
    await Notification.updateMany(
      { user: req.user._id, read: false },
      { read: true, readAt: new Date() }
    );
    
    // Mark broadcast notifications
    const broadcastNotifications = await Notification.find({
      targetRole: { $in: ['admin', 'all'] },
      'readBy.user': { $ne: req.user._id },
    });
    
    for (const notification of broadcastNotifications) {
      notification.readBy.push({ user: req.user._id });
      await notification.save();
    }
    
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Generate QR code for event
// @route   POST /api/admin/events/:id/qr
// @access  Private/Admin
export const generateEventQR = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const checkInUrl = `${frontendUrl}/checkin/${event._id}`;
    
    // Generate QR code as data URL
    const qrCodeDataUrl = await QRCode.toDataURL(checkInUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: '#0369a1',
        light: '#ffffff',
      },
    });
    
    // Save QR code URL to event
    event.qrCode = qrCodeDataUrl;
    await event.save();
    
    await logActivity(
      req.user._id,
      'event_updated',
      `Generated QR code for event: ${event.title}`,
      'event',
      event._id,
      event.title,
      { action: 'qr_generated' },
      req
    );
    
    res.json({
      qrCode: qrCodeDataUrl,
      checkInUrl,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark attendance
// @route   POST /api/admin/events/:eventId/attendance/:userId
// @access  Private/Admin
export const markAttendance = async (req, res) => {
  try {
    const { eventId, userId } = req.params;
    const { attended = true } = req.body;
    
    const [event, user] = await Promise.all([
      Event.findById(eventId),
      User.findById(userId),
    ]);
    
    if (!event || !user) {
      return res.status(404).json({ message: 'Event or User not found' });
    }
    
    // Check if user is registered
    const isRegistered = event.attendees.some(a => a.toString() === userId);
    if (!isRegistered) {
      return res.status(400).json({ message: 'User is not registered for this event' });
    }
    
    // Update attendance in user's registered events
    await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          'registeredEvents.$[elem].attended': attended,
        }
      },
      {
        arrayFilters: [{ 'elem.event': eventId }]
      }
    );
    
    await logActivity(
      req.user._id,
      attended ? 'attendance_marked' : 'attendance_unmarked',
      `${attended ? 'Marked' : 'Unmarked'} attendance for ${user.name} - Event: ${event.title}`,
      'event',
      eventId,
      event.title,
      { userId, userName: user.name, attended },
      req
    );
    
    res.json({ message: `Attendance ${attended ? 'marked' : 'unmarked'} successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get email logs
// @route   GET /api/admin/email-logs
// @access  Private/Admin
export const getEmailLogs = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, type } = req.query;
    
    let query = {};
    if (status) query.status = status;
    if (type) query.type = type;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [logs, total] = await Promise.all([
      EmailLog.find(query)
        .populate('toUser', 'name email')
        .populate('relatedEvent', 'title')
        .populate('sentBy', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      EmailLog.countDocuments(query),
    ]);
    
    res.json({
      logs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Export users to CSV format
// @route   GET /api/admin/users/export
// @access  Private/Admin
export const exportUsers = async (req, res) => {
  try {
    const { role, department, year } = req.query;
    
    let query = {};
    if (role && role !== 'all') query.role = role;
    if (department && department !== 'all') query.department = department;
    if (year && year !== 'all') query.year = year;
    
    const users = await User.find(query)
      .select('name email phone department year role createdAt registeredEvents')
      .populate('registeredEvents.event', 'title')
      .lean();
    
    // Format data for CSV
    const exportData = users.map(user => ({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      department: user.department || '',
      year: user.year || '',
      role: user.role,
      joinedAt: new Date(user.createdAt).toLocaleDateString(),
      eventsRegistered: user.registeredEvents?.length || 0,
      eventsAttended: user.registeredEvents?.filter(e => e.attended)?.length || 0,
    }));
    
    res.json(exportData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
