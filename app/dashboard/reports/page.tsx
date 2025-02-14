import { ReportsList } from "./_components/ReportsList";

export default function ReportsPage() {
  return (
    <div>
      <div className="flex items-center gap-2">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
          Reports
        </h1>
      </div>
      <p className="leading-7 text-sm text-gray-600 dark:text-gray-400 mb-6">
        Manage reported items and take appropriate actions.
      </p>
      <ReportsList />
    </div>
  );
}
