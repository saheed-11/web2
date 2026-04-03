import { useState, useEffect } from 'react';
import { Save, IndianRupee, Smartphone, AlertTriangle, Trash2 } from 'lucide-react';

const EventSettingsTab = ({ event, onSave, saving }) => {
  const [formData, setFormData] = useState({
    pricing: {
      isFree: true,
      ieeeMemberPrice: 0,
      nonIeeeMemberPrice: 0,
      currency: 'INR',
    },
    upiConfig: {
      upiId: '',
      payeeName: '',
    },
    adminNotes: '',
  });

  useEffect(() => {
    if (event) {
      setFormData({
        pricing: {
          isFree: event.pricing?.isFree ?? true,
          ieeeMemberPrice: event.pricing?.ieeeMemberPrice || 0,
          nonIeeeMemberPrice: event.pricing?.nonIeeeMemberPrice || 0,
          currency: event.pricing?.currency || 'INR',
        },
        upiConfig: {
          upiId: event.upiConfig?.upiId || '',
          payeeName: event.upiConfig?.payeeName || '',
        },
        adminNotes: event.adminNotes || '',
      });
    }
  }, [event]);

  const handleChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const generateUPILink = () => {
    if (!formData.upiConfig.upiId || !formData.upiConfig.payeeName) {
      return 'Please configure UPI ID and Payee Name';
    }

    const price = formData.pricing.isFree
      ? 0
      : formData.pricing.ieeeMemberPrice || formData.pricing.nonIeeeMemberPrice;

    return `upi://pay?pa=${formData.upiConfig.upiId}&pn=${encodeURIComponent(
      formData.upiConfig.payeeName
    )}&am=${price}&cu=INR&tn=${encodeURIComponent(event.title)}-REG-ID`;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Pricing Configuration */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
          Pricing Configuration
        </h3>

        {/* Free Event Toggle */}
        <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.pricing.isFree}
              onChange={(e) => handleChange('pricing', 'isFree', e.target.checked)}
              className="w-5 h-5 text-ieee-blue border-slate-300 rounded focus:ring-ieee-blue"
            />
            <div>
              <span className="font-medium text-slate-900 dark:text-white">Free Event</span>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Enable this if the event is free to attend
              </p>
            </div>
          </label>
        </div>

        {/* Pricing Fields */}
        {!formData.pricing.isFree && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  <IndianRupee className="w-4 h-4 inline mr-2" />
                  IEEE Member Price (₹)
                </label>
                <input
                  type="number"
                  value={formData.pricing.ieeeMemberPrice}
                  onChange={(e) =>
                    handleChange('pricing', 'ieeeMemberPrice', Number(e.target.value))
                  }
                  min="0"
                  step="1"
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-ieee-blue dark:bg-slate-700 dark:text-white"
                  placeholder="e.g., 100"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Price for IEEE members
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  <IndianRupee className="w-4 h-4 inline mr-2" />
                  Non-IEEE Member Price (₹)
                </label>
                <input
                  type="number"
                  value={formData.pricing.nonIeeeMemberPrice}
                  onChange={(e) =>
                    handleChange('pricing', 'nonIeeeMemberPrice', Number(e.target.value))
                  }
                  min="0"
                  step="1"
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-ieee-blue dark:bg-slate-700 dark:text-white"
                  placeholder="e.g., 150"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Price for non-IEEE members
                </p>
              </div>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
              <p className="text-sm text-blue-900 dark:text-blue-300">
                <strong>Note:</strong> During registration, users will select whether they are IEEE
                members, and the appropriate price will be shown automatically.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* UPI Payment Configuration */}
      {!formData.pricing.isFree && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
            UPI Payment Configuration
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                <Smartphone className="w-4 h-4 inline mr-2" />
                UPI ID *
              </label>
              <input
                type="text"
                value={formData.upiConfig.upiId}
                onChange={(e) => handleChange('upiConfig', 'upiId', e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-ieee-blue dark:bg-slate-700 dark:text-white"
                placeholder="e.g., yourname@paytm, yourname@okaxis"
                required={!formData.pricing.isFree}
              />
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Your UPI ID where payments will be received
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Payee Name *
              </label>
              <input
                type="text"
                value={formData.upiConfig.payeeName}
                onChange={(e) => handleChange('upiConfig', 'payeeName', e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-ieee-blue dark:bg-slate-700 dark:text-white"
                placeholder="e.g., IEEE Student Branch, Your Organization Name"
                required={!formData.pricing.isFree}
              />
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Name that will appear in the UPI payment screen
              </p>
            </div>

            {/* UPI Link Preview */}
            <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
              <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                UPI Link Preview
              </h4>
              <div className="font-mono text-xs text-slate-600 dark:text-slate-400 break-all">
                {generateUPILink()}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                This link will be generated dynamically for each registration with the specific
                registration ID and amount.
              </p>
            </div>

            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
              <div className="flex gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-900 dark:text-yellow-300">
                  <p className="font-medium mb-1">Payment Verification Required</p>
                  <p>
                    After making payment via UPI, students will be asked to upload a screenshot or
                    enter their transaction ID. You'll need to manually verify each payment in the
                    Payments tab.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Notes */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">Admin Notes</h3>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Internal Notes (Not visible to participants)
          </label>
          <textarea
            value={formData.adminNotes}
            onChange={(e) => setFormData({ ...formData, adminNotes: e.target.value })}
            rows={6}
            className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-ieee-blue dark:bg-slate-700 dark:text-white resize-none"
            placeholder="Add any internal notes about this event..."
          />
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-6 border-2 border-red-200 dark:border-red-800">
        <h3 className="text-xl font-semibold text-red-900 dark:text-red-400 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Danger Zone
        </h3>
        <p className="text-sm text-red-800 dark:text-red-300 mb-4">
          Once you delete an event, there is no going back. This will permanently delete the event,
          all registrations, and associated data.
        </p>
        <button
          type="button"
          className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors flex items-center gap-2 font-medium"
        >
          <Trash2 className="w-4 h-4" />
          Delete Event
        </button>
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-4">
        <button
          type="submit"
          disabled={saving}
          className="px-8 py-3 bg-ieee-blue text-white rounded-xl hover:bg-ieee-blue-dark transition-colors flex items-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Save Settings
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default EventSettingsTab;
