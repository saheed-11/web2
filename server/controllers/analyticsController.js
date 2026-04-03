import Registration from '../models/Registration.js';
import Event from '../models/Event.js';
import mongoose from 'mongoose';

/**
 * @desc    Get event analytics
 * @route   GET /api/events/:eventId/analytics
 * @access  Private/Admin
 */
export const getEventAnalytics = async (req, res) => {
  try {
    const { eventId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: 'Invalid event ID' });
    }

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const registrations = await Registration.find({ event: eventId }).populate('user');

    // Total registrations
    const totalRegistrations = registrations.length;

    // Registrations by status
    const statusBreakdown = registrations.reduce((acc, reg) => {
      acc[reg.status] = (acc[reg.status] || 0) + 1;
      return acc;
    }, {});

    // Payment statistics
    const paymentStats = {
      totalCollected: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
    };

    registrations.forEach((reg) => {
      if (reg.payment.status === 'approved') {
        paymentStats.totalCollected += reg.payment.amount || 0;
        paymentStats.approved += 1;
      } else if (reg.payment.status === 'pending' || reg.payment.status === 'submitted') {
        paymentStats.pending += 1;
      } else if (reg.payment.status === 'rejected') {
        paymentStats.rejected += 1;
      }
    });

    // Department-wise breakdown
    const departmentBreakdown = registrations.reduce((acc, reg) => {
      const dept = reg.user?.department || 'Not Specified';
      acc[dept] = (acc[dept] || 0) + 1;
      return acc;
    }, {});

    // Year-wise breakdown
    const yearBreakdown = registrations.reduce((acc, reg) => {
      const year = reg.user?.year || 'Not Specified';
      acc[year] = (acc[year] || 0) + 1;
      return acc;
    }, {});

    // IEEE Member vs Non-IEEE
    const membershipBreakdown = {
      ieeeMembers: registrations.filter((r) => r.isIeeeMember).length,
      nonIeeeMembers: registrations.filter((r) => !r.isIeeeMember).length,
    };

    // Registrations over time (daily)
    const registrationTimeline = {};
    registrations.forEach((reg) => {
      const date = new Date(reg.registeredAt).toISOString().split('T')[0];
      registrationTimeline[date] = (registrationTimeline[date] || 0) + 1;
    });

    // Attendance statistics
    const attendanceStats = {
      attended: registrations.filter((r) => r.attended).length,
      notAttended: registrations.filter((r) => !r.attended && r.status === 'confirmed').length,
    };

    // Review submission rate
    const reviewStats = {
      submitted: registrations.filter((r) => r.review.submitted).length,
      pending: registrations.filter(
        (r) => !r.review.submitted && r.status === 'confirmed' && new Date() > new Date(event.date)
      ).length,
    };

    // Certificate statistics
    const certificateStats = {
      available: registrations.filter((r) => r.certificate.status === 'available').length,
      locked: registrations.filter((r) => r.certificate.status === 'locked').length,
      reviewPending: registrations.filter((r) => r.certificate.status === 'review_pending').length,
      notUploaded: registrations.filter((r) => r.certificate.status === 'not_uploaded').length,
      totalDownloads: registrations.reduce((sum, r) => sum + (r.certificate.downloadCount || 0), 0),
    };

    // Form completion rate (assuming some fields might be optional)
    const formCompletionRate =
      totalRegistrations > 0
        ? (registrations.filter((r) => r.formResponses && r.formResponses.length > 0).length /
            totalRegistrations) *
          100
        : 0;

    res.json({
      event: {
        id: event._id,
        title: event.title,
        date: event.date,
        maxAttendees: event.maxAttendees,
      },
      summary: {
        totalRegistrations,
        capacity: event.maxAttendees,
        capacityPercentage: (totalRegistrations / event.maxAttendees) * 100,
        totalRevenue: paymentStats.totalCollected,
      },
      statusBreakdown,
      paymentStats,
      departmentBreakdown,
      yearBreakdown,
      membershipBreakdown,
      registrationTimeline: Object.entries(registrationTimeline)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => new Date(a.date) - new Date(b.date)),
      attendanceStats,
      reviewStats,
      certificateStats,
      formCompletionRate: Math.round(formCompletionRate),
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get dashboard statistics
 * @route   GET /api/admin/analytics/dashboard
 * @access  Private/Admin
 */
export const getDashboardAnalytics = async (req, res) => {
  try {
    // Total events
    const totalEvents = await Event.countDocuments();

    // Events by status
    const upcomingEvents = await Event.countDocuments({
      status: { $in: ['upcoming', 'published'] },
      date: { $gte: new Date() },
    });

    const ongoingEvents = await Event.countDocuments({ status: 'ongoing' });
    const completedEvents = await Event.countDocuments({ status: 'completed' });

    // Total registrations
    const totalRegistrations = await Registration.countDocuments();

    // Recent registrations (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentRegistrations = await Registration.countDocuments({
      registeredAt: { $gte: thirtyDaysAgo },
    });

    // Payment statistics (all events)
    const paymentAggregation = await Registration.aggregate([
      {
        $match: {
          'payment.status': 'approved',
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$payment.amount' },
          count: { $sum: 1 },
        },
      },
    ]);

    const totalRevenue = paymentAggregation[0]?.totalRevenue || 0;
    const paidRegistrations = paymentAggregation[0]?.count || 0;

    // Pending payments
    const pendingPayments = await Registration.countDocuments({
      'payment.status': { $in: ['pending', 'submitted'] },
    });

    // Top events by registrations
    const topEvents = await Event.aggregate([
      {
        $lookup: {
          from: 'registrations',
          localField: '_id',
          foreignField: 'event',
          as: 'registrations',
        },
      },
      {
        $project: {
          title: 1,
          date: 1,
          category: 1,
          registrationCount: { $size: '$registrations' },
        },
      },
      {
        $sort: { registrationCount: -1 },
      },
      {
        $limit: 5,
      },
    ]);

    res.json({
      events: {
        total: totalEvents,
        upcoming: upcomingEvents,
        ongoing: ongoingEvents,
        completed: completedEvents,
      },
      registrations: {
        total: totalRegistrations,
        recent: recentRegistrations,
        paid: paidRegistrations,
      },
      revenue: {
        total: totalRevenue,
        pendingPayments,
      },
      topEvents,
    });
  } catch (error) {
    console.error('Get dashboard analytics error:', error);
    res.status(500).json({ message: error.message });
  }
};
