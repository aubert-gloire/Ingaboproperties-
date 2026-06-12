import { connectDB } from "@/lib/mongodb";
import Appointment from "@/models/Appointment";
import StatusBadge from "@/components/admin/StatusBadge";
import { format } from "date-fns";

export default async function AppointmentsPage() {
  await connectDB();
  const appointments = await Appointment.find().sort({ createdAt: -1 }).lean();
  const a = JSON.parse(JSON.stringify(appointments));

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Appointment Requests</h1>
        <p className="text-gray-500 text-sm">Manage and confirm client appointment requests</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Booked</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Client</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Property Interest</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Preferred Date</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Time</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {a.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-12 text-center text-gray-400">No appointments yet.</td></tr>
            ) : a.map((appt: any) => (
              <tr key={appt._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                  {format(new Date(appt.createdAt), "MMM d, yyyy")}
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-900">{appt.fullName}</p>
                  <p className="text-xs text-gray-400">{appt.phone}</p>
                </td>
                <td className="px-4 py-3 text-gray-600 line-clamp-1 max-w-32">{appt.propertyTitle || appt.propertyInterest || "—"}</td>
                <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                  {appt.preferredDate ? format(new Date(appt.preferredDate), "MMM d, yyyy") : "—"}
                </td>
                <td className="px-4 py-3 text-gray-600">{appt.preferredTime}</td>
                <td className="px-4 py-3"><StatusBadge status={appt.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    {appt.status === "pending" && (
                      <>
                        <button className="px-2.5 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700">Confirm</button>
                        <button className="px-2.5 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600">Cancel</button>
                      </>
                    )}
                    <button className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded text-xs hover:bg-gray-200">View</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
