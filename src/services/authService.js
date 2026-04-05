import api from './api';

// Auth Services
export const authService = {
  // Login
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  // Signup
  signup: async (userData) => {
    const response = await api.post('/auth/signup', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get Profile
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  // Update Profile
  updateProfile: async (userData) => {
    const response = await api.put('/auth/profile', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Check if user is admin
  isAdmin: () => {
    const user = authService.getCurrentUser();
    return user?.role === 'admin';
  },
};

// Event Services
export const eventService = {
  // Get all events
  getEvents: async () => {
    const response = await api.get('/events');
    return response.data;
  },

  // Get single event
  getEvent: async (id) => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },

  // Register for event (simple - no custom form)
  registerForEvent: async (id) => {
    const response = await api.post(`/events/${id}/register`);
    return response.data;
  },

  // Register for event with custom form data
  registerForEventWithForm: async (eventId, registrationData) => {
    const response = await api.post(`/registrations/events/${eventId}/register`, registrationData);
    return response.data;
  },

  // Unregister from event
  unregisterFromEvent: async (id) => {
    const response = await api.delete(`/events/${id}/register`);
    return response.data;
  },

  // Create event (admin only)
  createEvent: async (eventData) => {
    const response = await api.post('/events', eventData);
    return response.data;
  },

  // Update event (admin only)
  updateEvent: async (id, eventData) => {
    const response = await api.put(`/events/${id}`, eventData);
    return response.data;
  },

  // Delete event (admin only)
  deleteEvent: async (id) => {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  },
};

// Admin Services
export const adminService = {
  // Get dashboard stats
  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  // Get all users with optional filters
  getUsers: async (params = {}) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  // Get user by ID
  getUser: async (id) => {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  },

  // Update user role
  updateUserRole: async (id, role) => {
    const response = await api.put(`/admin/users/${id}/role`, { role });
    return response.data;
  },

  // Update user details
  updateUser: async (id, userData) => {
    const response = await api.put(`/admin/users/${id}`, userData);
    return response.data;
  },

  // Delete user
  deleteUser: async (id) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },

  // Upload certificate
  uploadCertificate: async (eventId, userId, file) => {
    const formData = new FormData();
    formData.append('certificate', file);

    const response = await api.post(
      `/admin/events/${eventId}/certificate/${userId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  // Get analytics data
  getAnalytics: async (params = {}) => {
    const response = await api.get('/admin/analytics', { params });
    return response.data;
  },

  // Get activity logs
  getActivityLogs: async (params = {}) => {
    const response = await api.get('/admin/activity-logs', { params });
    return response.data;
  },

  // Get notifications
  getNotifications: async (params = {}) => {
    const response = await api.get('/admin/notifications', { params });
    return response.data;
  },

  // Create notification
  createNotification: async (notificationData) => {
    const response = await api.post('/admin/notifications', notificationData);
    return response.data;
  },

  // Mark notification as read
  markNotificationRead: async (id) => {
    const response = await api.put(`/admin/notifications/${id}/read`);
    return response.data;
  },

  // Mark all notifications as read
  markAllNotificationsRead: async () => {
    const response = await api.put('/admin/notifications/mark-all-read');
    return response.data;
  },

  // Generate QR code for event
  generateEventQR: async (eventId) => {
    const response = await api.post(`/admin/events/${eventId}/generate-qr`);
    return response.data;
  },

  // Mark attendance
  markAttendance: async (eventId, userId) => {
    const response = await api.post(`/admin/events/${eventId}/attendance/${userId}`);
    return response.data;
  },

  // Get email logs
  getEmailLogs: async (params = {}) => {
    const response = await api.get('/admin/email-logs', { params });
    return response.data;
  },

  // Send bulk email
  sendBulkEmail: async (emailData) => {
    const response = await api.post('/admin/emails/send-bulk', emailData);
    return response.data;
  },

  // Export users to CSV data
  exportUsers: async (params = {}) => {
    const response = await api.get('/admin/users/export', { params });
    return response.data;
  },

  // Get event registrations with details
  getEventRegistrations: async (eventId) => {
    const response = await api.get(`/admin/events/${eventId}/registrations`);
    return response.data;
  },
};
