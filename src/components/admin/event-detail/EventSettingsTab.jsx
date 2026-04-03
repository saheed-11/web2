const EventSettingsTab = ({ event, onSave, saving }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Event Settings</h2>
      <p className="text-slate-600 dark:text-slate-400">
        Advanced event settings coming soon. This will include pricing configuration, admin notes, danger zone actions, and more.
      </p>
    </div>
  );
};

export default EventSettingsTab;
