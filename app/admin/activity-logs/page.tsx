import { connectDB } from "@/lib/mongodb";
import ActivityLog from "@/models/ActivityLog";
import { format } from "date-fns";

export default async function ActivityLogsPage() {
  await connectDB();
  const logs = await ActivityLog.find().sort({ createdAt: -1 }).limit(100).lean();
  const l = JSON.parse(JSON.stringify(logs));

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Activity Logs</h1>
        <p className="text-gray-500 text-sm">A timestamped record of all admin actions</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="divide-y divide-gray-100">
          {l.length === 0 ? (
            <p className="px-4 py-12 text-center text-gray-400">No activity recorded yet.</p>
          ) : l.map((log: any) => (
            <div key={log._id} className="px-4 py-3 flex items-start gap-4 hover:bg-gray-50 transition-colors">
              <div className="w-8 h-8 bg-forest-100 rounded-full flex items-center justify-center flex-shrink-0 text-forest-600 font-bold text-sm">
                {log.userName?.charAt(0).toUpperCase() || "?"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">{log.userName}</span>{" "}
                  <span className="text-forest-600">{log.action}</span>{" "}
                  <span className="text-gray-500">{log.resourceType}</span>
                  {log.resourceId && <span className="text-gray-400 text-xs"> #{log.resourceId.slice(-6)}</span>}
                </p>
                {log.details && <p className="text-xs text-gray-400 mt-0.5">{log.details}</p>}
              </div>
              <p className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
                {format(new Date(log.createdAt), "MMM d, HH:mm")}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
