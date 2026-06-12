"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, X, Briefcase } from "lucide-react";

const DEFAULT_DEPTS = ["Sales", "Rentals", "Marketing", "Administration", "Legal"];

export default function DepartmentsPage() {
  const [depts, setDepts] = useState<string[]>(DEFAULT_DEPTS);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [value, setValue] = useState("");

  function openAdd() {
    setEditing(null);
    setValue("");
    setShowModal(true);
  }

  function openEdit(d: string) {
    setEditing(d);
    setValue(d);
    setShowModal(true);
  }

  function handleSave() {
    if (!value.trim()) return;
    if (editing) {
      setDepts((prev) => prev.map((d) => (d === editing ? value.trim() : d)));
    } else {
      if (depts.includes(value.trim())) return;
      setDepts((prev) => [...prev, value.trim()]);
    }
    setShowModal(false);
  }

  function handleDelete(d: string) {
    if (!confirm(`Remove "${d}" department?`)) return;
    setDepts((prev) => prev.filter((x) => x !== d));
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Departments</h1>
          <p className="text-gray-500 text-sm">Manage organizational departments for staff assignment</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 bg-forest-800 text-white rounded-lg text-sm font-medium hover:bg-forest-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Department
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
        {depts.length === 0 ? (
          <p className="px-5 py-10 text-center text-gray-400 text-sm">No departments yet.</p>
        ) : (
          depts.map((d) => (
            <div key={d} className="px-5 py-4 flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-forest-50 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-forest-600" />
                </div>
                <span className="font-medium text-gray-900">{d}</span>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => openEdit(d)}
                  className="p-1.5 rounded hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(d)}
                  className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">
                {editing ? "Edit Department" : "Add Department"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department Name</label>
                <input
                  autoFocus
                  type="text"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSave()}
                  placeholder="e.g. Property Management"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
                />
              </div>
              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={!value.trim()}
                  className="flex-1 py-2.5 bg-forest-800 hover:bg-forest-700 disabled:opacity-40 text-white rounded-xl text-sm font-semibold transition-colors"
                >
                  {editing ? "Save" : "Add"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
