const ReviewCertificatesTab = ({ event, onRefresh }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Review & Certificates</h2>
      <p className="text-slate-600 dark:text-slate-400">
        Certificate management with Google Drive sync coming soon. This will allow admins to sync certificates from Google Drive, manage review forms, and control certificate unlock status.
      </p>
    </div>
  );
};

export default ReviewCertificatesTab;
