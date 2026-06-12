export default function RolesPage() {
  const ROLES = [
    { name: "Superadmin", permissions: ["All access"], users: 1 },
    { name: "Agent", permissions: ["View listings", "Manage appointments"], users: 3 },
    { name: "Staff", permissions: ["View listings", "View appointments"], users: 5 },
    { name: "Marketing", permissions: ["Manage blog", "View listings"], users: 2 },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Roles & Permissions</h1>
        <p className="text-gray-500 text-sm">Manage user roles and access levels</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {ROLES.map((role) => (
          <div key={role.name} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">{role.name}</h3>
              <span className="text-xs text-gray-500">{role.users} users</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {role.permissions.map((p) => (
                <span key={p} className="px-2 py-0.5 bg-forest-50 text-forest-700 rounded text-xs">{p}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
