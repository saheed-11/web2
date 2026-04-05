import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Loader, CheckCircle, Upload, Star } from 'lucide-react';

const RegistrationForm = ({ event, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isIeeeMember, setIsIeeeMember] = useState(false);

  // Sort fields by order
  const sortedFields = [...(event.customFields || [])].sort((a, b) => a.order - b.order);

  // Check if field should be visible based on conditional logic
  const isFieldVisible = (field) => {
    if (!field.conditionalLogic?.enabled) return true;

    const dependsOnFieldId = field.conditionalLogic.dependsOnFieldId;
    const dependsOnValue = field.conditionalLogic.dependsOnValue;
    const actualValue = formData[dependsOnFieldId];

    if (Array.isArray(actualValue)) {
      return actualValue.includes(dependsOnValue);
    }

    return actualValue === dependsOnValue;
  };

  const handleChange = (fieldId, value, fieldType) => {
    setFormData({
      ...formData,
      [fieldId]: value,
    });

    // Clear error for this field
    if (errors[fieldId]) {
      setErrors({
        ...errors,
        [fieldId]: null,
      });
    }
  };

  const handleCheckboxChange = (fieldId, option, checked) => {
    const currentValues = formData[fieldId] || [];
    let newValues;

    if (checked) {
      newValues = [...currentValues, option];
    } else {
      newValues = currentValues.filter((v) => v !== option);
    }

    handleChange(fieldId, newValues, 'checkbox');
  };

  const validateForm = () => {
    const newErrors = {};

    sortedFields.forEach((field) => {
      if (!isFieldVisible(field)) return;

      if (field.required && !formData[field.fieldId]) {
        newErrors[field.fieldId] = `${field.label} is required`;
      }

      // Validate IEEE ID format if applicable
      if (field.type === 'ieeeId' && field.validateIEEE && formData[field.fieldId]) {
        const ieeeIdPattern = /^\d{8,10}$/;
        if (!ieeeIdPattern.test(formData[field.fieldId])) {
          newErrors[field.fieldId] = 'Invalid IEEE ID format';
        }
      }

      // Validate email format
      if (field.type === 'email' && formData[field.fieldId]) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(formData[field.fieldId])) {
          newErrors[field.fieldId] = 'Invalid email format';
        }
      }

      // Validate phone format
      if (field.type === 'phone' && formData[field.fieldId]) {
        const phonePattern = /^[0-9]{10}$/;
        if (!phonePattern.test(formData[field.fieldId].replace(/\D/g, ''))) {
          newErrors[field.fieldId] = 'Invalid phone number format';
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Prepare form responses in the format expected by backend
    const formResponses = sortedFields
      .filter((field) => isFieldVisible(field))
      .map((field) => ({
        fieldId: field.fieldId,
        fieldLabel: field.label,
        fieldType: field.type,
        value: formData[field.fieldId] || '',
      }));

    // Check if user has IEEE ID field filled
    const ieeeIdField = sortedFields.find((f) => f.type === 'ieeeId');
    const ieeeId = ieeeIdField ? formData[ieeeIdField.fieldId] : null;

    onSubmit({
      formResponses,
      isIeeeMember,
      ieeeId,
    });
  };

  const renderField = (field) => {
    const baseClasses =
      'w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-ieee-blue focus:border-transparent dark:bg-slate-700 dark:text-white transition-all';

    switch (field.type) {
      case 'text':
      case 'email':
      case 'phone':
      case 'number':
      case 'ieeeId':
        return (
          <input
            type={field.type === 'ieeeId' ? 'text' : field.type}
            value={formData[field.fieldId] || ''}
            onChange={(e) => handleChange(field.fieldId, e.target.value, field.type)}
            placeholder={field.placeholder}
            className={baseClasses}
          />
        );

      case 'paragraph':
        return (
          <textarea
            rows={4}
            value={formData[field.fieldId] || ''}
            onChange={(e) => handleChange(field.fieldId, e.target.value, field.type)}
            placeholder={field.placeholder}
            className={baseClasses}
          />
        );

      case 'date':
        return (
          <input
            type="date"
            value={formData[field.fieldId] || ''}
            onChange={(e) => handleChange(field.fieldId, e.target.value, field.type)}
            className={baseClasses}
          />
        );

      case 'dropdown':
        return (
          <select
            value={formData[field.fieldId] || ''}
            onChange={(e) => handleChange(field.fieldId, e.target.value, field.type)}
            className={baseClasses}
          >
            <option value="">Select...</option>
            {field.options?.map((option, i) => (
              <option key={i} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case 'radio':
        return (
          <div className="space-y-3">
            {field.options?.map((option, i) => (
              <label
                key={i}
                className="flex items-center gap-3 p-3 border border-slate-300 dark:border-slate-600 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                <input
                  type="radio"
                  name={field.fieldId}
                  value={option}
                  checked={formData[field.fieldId] === option}
                  onChange={(e) => handleChange(field.fieldId, e.target.value, field.type)}
                  className="w-4 h-4 text-ieee-blue focus:ring-ieee-blue"
                />
                <span className="text-slate-700 dark:text-slate-300">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div className="space-y-3">
            {field.options?.map((option, i) => (
              <label
                key={i}
                className="flex items-center gap-3 p-3 border border-slate-300 dark:border-slate-600 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={(formData[field.fieldId] || []).includes(option)}
                  onChange={(e) => handleCheckboxChange(field.fieldId, option, e.target.checked)}
                  className="w-4 h-4 text-ieee-blue rounded focus:ring-ieee-blue"
                />
                <span className="text-slate-700 dark:text-slate-300">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'file':
        return (
          <div className="space-y-2">
            <input
              type="file"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  // Check file size if configured
                  if (field.fileConfig?.maxSizeMB) {
                    const maxSizeBytes = field.fileConfig.maxSizeMB * 1024 * 1024;
                    if (file.size > maxSizeBytes) {
                      setErrors({
                        ...errors,
                        [field.fieldId]: `File size must be less than ${field.fileConfig.maxSizeMB}MB`,
                      });
                      return;
                    }
                  }

                  // Check file type if configured
                  if (field.fileConfig?.allowedTypes?.length > 0) {
                    const fileExtension = file.name.split('.').pop().toLowerCase();
                    if (!field.fileConfig.allowedTypes.includes(fileExtension)) {
                      setErrors({
                        ...errors,
                        [field.fieldId]: `Allowed file types: ${field.fileConfig.allowedTypes.join(', ')}`,
                      });
                      return;
                    }
                  }

                  handleChange(field.fieldId, file.name, field.type);
                }
              }}
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-ieee-blue file:text-white hover:file:bg-ieee-blue-dark cursor-pointer"
            />
            {field.fileConfig && (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Max size: {field.fileConfig.maxSizeMB}MB
                {field.fileConfig.allowedTypes?.length > 0 &&
                  ` | Allowed: ${field.fileConfig.allowedTypes.join(', ')}`}
              </p>
            )}
          </div>
        );

      case 'rating':
        return (
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-8 h-8 cursor-pointer transition-colors ${
                  formData[field.fieldId] >= star
                    ? 'text-yellow-500 fill-yellow-500'
                    : 'text-slate-300 dark:text-slate-600'
                }`}
                onClick={() => handleChange(field.fieldId, star, field.type)}
              />
            ))}
          </div>
        );

      default:
        return (
          <input
            type="text"
            value={formData[field.fieldId] || ''}
            onChange={(e) => handleChange(field.fieldId, e.target.value, field.type)}
            placeholder={field.placeholder}
            className={baseClasses}
          />
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700"
    >
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Event Registration
        </h3>
        <p className="text-slate-600 dark:text-slate-400">
          Please fill out the form below to register for this event
        </p>
      </div>

      {/* Pricing Information */}
      {event.pricing && !event.pricing.isFree && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Registration Fee
              </h4>
              <div className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
                <p>
                  IEEE Members: {event.pricing.currency} {event.pricing.ieeeMemberPrice}
                </p>
                <p>
                  Non-IEEE Members: {event.pricing.currency} {event.pricing.nonIeeeMemberPrice}
                </p>
              </div>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-2">
                Payment details will be provided after registration
              </p>
            </div>
          </div>
        </div>
      )}

      {/* IEEE Membership Toggle */}
      {event.pricing && !event.pricing.isFree && (
        <div className="mb-6">
          <label className="flex items-center gap-3 p-4 border border-slate-300 dark:border-slate-600 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
            <input
              type="checkbox"
              checked={isIeeeMember}
              onChange={(e) => setIsIeeeMember(e.target.checked)}
              className="w-5 h-5 text-ieee-blue rounded focus:ring-ieee-blue"
            />
            <div>
              <span className="font-medium text-slate-900 dark:text-white">
                I am an IEEE Member
              </span>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Check this box if you have a valid IEEE membership
              </p>
            </div>
          </label>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {sortedFields.filter(isFieldVisible).map((field) => (
          <div key={field.fieldId}>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {field.helperText && (
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">{field.helperText}</p>
            )}
            {renderField(field)}
            {errors[field.fieldId] && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors[field.fieldId]}
              </p>
            )}
          </div>
        ))}

        {sortedFields.length === 0 && (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
            <p>No additional information required. Click submit to complete your registration.</p>
          </div>
        )}

        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-ieee-blue text-white rounded-xl font-medium hover:bg-ieee-blue-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Submit Registration
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default RegistrationForm;
