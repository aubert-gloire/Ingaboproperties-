export default function SettingsPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Platform Settings</h1>
        <p className="text-gray-500 text-sm">Configure your Ingabo Properties platform</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-800 mb-4">Contact Information</h2>
          <div className="space-y-3">
            {[
              { label: "Email", value: "ingaboproperties@gmail.com" },
              { label: "Phone", value: "+250 788 812 776" },
              { label: "WhatsApp", value: "+250 788 812 776" },
              { label: "Address", value: "KG 11 Ave, Kigali, Rwanda" },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <span className="text-sm text-gray-500">{label}</span>
                <span className="text-sm font-medium text-gray-900">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-800 mb-4">Social Media</h2>
          <div className="space-y-3">
            {[
              { label: "Instagram", value: "@ingaboproperties" },
              { label: "WhatsApp", value: "wa.me/250788812776" },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <span className="text-sm text-gray-500">{label}</span>
                <span className="text-sm font-medium text-gray-900">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
