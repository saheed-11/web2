import { useState, useEffect } from 'react';
import { X, Loader, Plus, Trash2, Tag } from 'lucide-react';
import { eventService } from '../../services/authService';
import { getErrorMessage } from '../../utils/helpers';

// Convert 12-hour time format (e.g., "10:00 AM") to 24-hour format (e.g., "10:00")
const convertTo24Hour = (time12h) => {
  if (!time12h) return '';
  // If already in 24-hour format (HH:mm), return as-is
  if (/^\d{2}:\d{2}$/.test(time12h)) return time12h;
  
  const match = time12h.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return time12h;
  
  let [, hours, minutes, period] = match;
  hours = parseInt(hours, 10);
  
  if (period.toUpperCase() === 'PM' && hours !== 12) {
    hours += 12;
  } else if (period.toUpperCase() === 'AM' && hours === 12) {
    hours = 0;
  }
  
  return `${hours.toString().padStart(2, '0')}:${minutes}`;
};

// Convert 24-hour time format (e.g., "14:00") to 12-hour format (e.g., "2:00 PM")
const convertTo12Hour = (time24h) => {
  if (!time24h) return '';
  // If already in 12-hour format, return as-is
  if (/AM|PM/i.test(time24h)) return time24h;
  
  const [hours, minutes] = time24h.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12;
  
  return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
};

const EventModal = ({ event, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    endDate: '',
    endTime: '',
    location: '',
    category: 'Workshop',
    mode: 'offline',
    meetingLink: '',
    status: 'draft',
    image: '',
    maxAttendees: 100,
    registrationOpen: true,
    registrationDeadline: '',
    speakers: [],
    tags: [],
    pricing: {
      isFree: true,
      ieeeMemberPrice: 0,
      nonIeeeMemberPrice: 0,
      currency: 'INR',
    },
  });

  const [newSpeaker, setNewSpeaker] = useState({ name: '', designation: '', organization: '' });
  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (event) {
      // Clean up speakers data to only include necessary fields
      const cleanSpeakers = (event.speakers || []).map(speaker => ({
        name: speaker.name || '',
        designation: speaker.designation || '',
        organization: speaker.organization || '',
      })).filter(speaker => speaker.name); // Only keep speakers with a name

      setFormData({
        title: event.title || '',
        description: event.description || '',
        date: event.date ? new Date(event.date).toISOString().split('T')[0] : '',
        time: convertTo24Hour(event.time) || '',
        endDate: event.endDate ? new Date(event.endDate).toISOString().split('T')[0] : '',
        endTime: convertTo24Hour(event.endTime) || '',
        location: event.location || '',
        category: event.category || event.type || 'Workshop',
        mode: event.mode || 'offline',
        meetingLink: event.meetingLink || '',
        status: event.status || 'draft',
        image: event.image || '',
        maxAttendees: event.maxAttendees || 100,
        registrationOpen: event.registrationOpen !== undefined ? event.registrationOpen : true,
        registrationDeadline: event.registrationDeadline ? new Date(event.registrationDeadline).toISOString().split('T')[0] : '',
        speakers: cleanSpeakers,
        tags: event.tags || [],
        pricing: {
          isFree: event.pricing?.isFree !== undefined ? event.pricing.isFree : true,
          ieeeMemberPrice: event.pricing?.ieeeMemberPrice || 0,
          nonIeeeMemberPrice: event.pricing?.nonIeeeMemberPrice || 0,
          currency: event.pricing?.currency || 'INR',
        },
      });
    }
  }, [event]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Handle nested pricing fields
    if (name.startsWith('pricing.')) {
      const pricingField = name.split('.')[1];
      setFormData({
        ...formData,
        pricing: {
          ...formData.pricing,
          [pricingField]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()],
      });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleAddSpeaker = () => {
    if (newSpeaker.name.trim()) {
      setFormData({
        ...formData,
        speakers: [...formData.speakers, { ...newSpeaker }],
      });
      setNewSpeaker({ name: '', designation: '', organization: '' });
    }
  };

  const handleRemoveSpeaker = (index) => {
    setFormData({
      ...formData,
      speakers: formData.speakers.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Convert time to 12-hour format for storage (to match existing DB format)
      const dataToSave = {
        ...formData,
        time: convertTo12Hour(formData.time),
        endTime: formData.endTime ? convertTo12Hour(formData.endTime) : undefined,
      };

      if (event) {
        await eventService.updateEvent(event._id, dataToSave);
      } else {
        await eventService.createEvent(dataToSave);
      }
      onSave();
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
            {event ? 'Edit Event' : 'Create Event'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Event Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-ieee-blue dark:bg-slate-700 dark:text-white"
              placeholder="e.g., Web Development Workshop"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-ieee-blue dark:bg-slate-700 dark:text-white"
              placeholder="Describe the event..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-ieee-blue dark:bg-slate-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Time *
              </label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-ieee-blue dark:bg-slate-700 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-ieee-blue dark:bg-slate-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                End Time
              </label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-ieee-blue dark:bg-slate-700 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Location / Venue *
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-ieee-blue dark:bg-slate-700 dark:text-white"
              placeholder="e.g., Main Auditorium or Zoom Link"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Event Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-ieee-blue dark:bg-slate-700 dark:text-white"
              >
                <option value="Workshop">Workshop</option>
                <option value="Bootcamp">Bootcamp</option>
                <option value="Seminar">Seminar</option>
                <option value="Conference">Conference</option>
                <option value="Competition">Competition</option>
                <option value="Hackathon">Hackathon</option>
                <option value="Webinar">Webinar</option>
                <option value="Tech Talk">Tech Talk</option>
                <option value="Networking">Networking</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Mode
              </label>
              <select
                name="mode"
                value={formData.mode}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-ieee-blue dark:bg-slate-700 dark:text-white"
              >
                <option value="offline">Offline</option>
                <option value="online">Online</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          {/* Meeting Link - shown only for online/hybrid events */}
          {(formData.mode === 'online' || formData.mode === 'hybrid') && (
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Meeting Link
              </label>
              <input
                type="url"
                name="meetingLink"
                value={formData.meetingLink}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-ieee-blue dark:bg-slate-700 dark:text-white"
                placeholder="e.g., https://zoom.us/j/123456789"
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-ieee-blue dark:bg-slate-700 dark:text-white"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Max Attendees *
              </label>
              <input
                type="number"
                name="maxAttendees"
                value={formData.maxAttendees}
                onChange={handleChange}
                required
                min="1"
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-ieee-blue dark:bg-slate-700 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Registration Deadline
            </label>
            <input
              type="date"
              name="registrationDeadline"
              value={formData.registrationDeadline}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-ieee-blue dark:bg-slate-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Image URL
            </label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-ieee-blue dark:bg-slate-700 dark:text-white"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* Speakers Section */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Speakers / Guests
            </label>
            <div className="space-y-3">
              {formData.speakers.map((speaker, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 dark:text-white">{speaker.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {speaker.designation} {speaker.organization && `at ${speaker.organization}`}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveSpeaker(index)}
                    className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Name"
                  value={newSpeaker.name}
                  onChange={(e) => setNewSpeaker({ ...newSpeaker, name: e.target.value })}
                  className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm dark:bg-slate-700 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Designation"
                  value={newSpeaker.designation}
                  onChange={(e) => setNewSpeaker({ ...newSpeaker, designation: e.target.value })}
                  className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm dark:bg-slate-700 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Organization"
                  value={newSpeaker.organization}
                  onChange={(e) => setNewSpeaker({ ...newSpeaker, organization: e.target.value })}
                  className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm dark:bg-slate-700 dark:text-white"
                />
              </div>
              <button
                type="button"
                onClick={handleAddSpeaker}
                className="flex items-center gap-2 px-3 py-2 text-sm text-ieee-blue hover:bg-ieee-blue/10 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Speaker
              </button>
            </div>
          </div>

          {/* Tags Section */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Tags
            </label>
            <div className="space-y-3">
              {/* Display existing tags */}
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <div
                      key={index}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-ieee-blue/10 text-ieee-blue rounded-full text-sm"
                    >
                      <Tag className="w-3 h-3" />
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-ieee-blue-dark"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add new tag */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a tag (e.g., AI, Robotics, Workshop)"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm dark:bg-slate-700 dark:text-white"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 text-sm text-ieee-blue hover:bg-ieee-blue/10 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Pricing Section */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Pricing
            </label>
            <div className="space-y-4 p-4 bg-slate-50 dark:bg-slate-700/30 rounded-lg">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isFree"
                  name="pricing.isFree"
                  checked={formData.pricing.isFree}
                  onChange={handleChange}
                  className="w-4 h-4 text-ieee-blue border-slate-300 rounded focus:ring-ieee-blue"
                />
                <label htmlFor="isFree" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Free Event
                </label>
              </div>

              {!formData.pricing.isFree && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                      IEEE Member Price
                    </label>
                    <input
                      type="number"
                      name="pricing.ieeeMemberPrice"
                      value={formData.pricing.ieeeMemberPrice}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm dark:bg-slate-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Non-IEEE Member Price
                    </label>
                    <input
                      type="number"
                      name="pricing.nonIeeeMemberPrice"
                      value={formData.pricing.nonIeeeMemberPrice}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm dark:bg-slate-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Currency
                    </label>
                    <select
                      name="pricing.currency"
                      value={formData.pricing.currency}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm dark:bg-slate-700 dark:text-white"
                    >
                      <option value="INR">INR (₹)</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="registrationOpen"
              name="registrationOpen"
              checked={formData.registrationOpen}
              onChange={handleChange}
              className="w-4 h-4 text-ieee-blue border-slate-300 rounded focus:ring-ieee-blue"
            />
            <label htmlFor="registrationOpen" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Registration Open
            </label>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-ieee-blue hover:bg-ieee-blue-dark text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                event ? 'Update Event' : 'Create Event'
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;
