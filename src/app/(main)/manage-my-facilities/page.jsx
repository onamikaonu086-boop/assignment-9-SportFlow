"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { showSuccess, showError, showConfirm } from "@/lib/alert";
import { FaEdit, FaTrash, FaMapMarkerAlt, FaUsers, FaTimes } from "react-icons/fa";
import LoadingSpinner from "@/components/Shared/LoadingSpinner";
import Link from "next/link";

const SPORT_TYPES = ["Football", "Badminton", "Swimming", "Tennis", "Cricket"];

const typeColors = {
  Football: "bg-green-100 text-green-700",
  Badminton: "bg-yellow-100 text-yellow-700",
  Swimming: "bg-blue-100 text-blue-700",
  Tennis: "bg-orange-100 text-orange-700",
  Cricket: "bg-red-100 text-red-700",
};

export default function ManageMyFacilitiesPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingFacility, setEditingFacility] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isPending && !session?.user) router.push("/login?redirect=/manage-my-facilities");
  }, [isPending, session, router]);

  const fetchMyFacilities = () => {
    if (!session?.user) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/my-facilities`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => { setFacilities(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchMyFacilities(); }, [session]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updateData = Object.fromEntries(formData.entries());
    updateData.price_per_hour = Number(updateData.price_per_hour);
    updateData.capacity = Number(updateData.capacity);

    setSubmitting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/facilities/${editingFacility._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updateData),
      });
      if (res.ok) {
        showSuccess("Facility updated successfully!");
        setEditingFacility(null);
        fetchMyFacilities();
      } else {
        showError("Update failed. Please try again.");
      }
    } catch {
      showError("Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (facility) => {
    const confirmed = await showConfirm({
      title: "Delete Facility?",
      text: `"${facility.name}" will be permanently removed.`,
      confirmText: "Yes, Delete",
      confirmColor: "#ef4444",
    });
    if (!confirmed) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/facilities/${facility._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        showSuccess("Facility deleted.");
        setFacilities((prev) => prev.filter((f) => f._id !== facility._id));
      } else {
        showError("Delete failed. Please try again.");
      }
    } catch {
      showError("Something went wrong.");
    }
  };

  if (isPending || loading) return <LoadingSpinner />;
  if (!session?.user) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 py-8 sm:py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-1">Manage Facilities</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">Update or remove your listed venues</p>
          </div>
          <Link href="/add-facility" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold transition text-sm shrink-0">
            + Add New Facility
          </Link>
        </div>

        {facilities.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-12 sm:p-16 text-center shadow-sm">
            <div className="text-6xl mb-4">🏟️</div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-700 dark:text-white mb-2">No facilities listed yet</h2>
            <p className="text-gray-400 text-sm mb-6">Add a sports facility for others to book.</p>
            <Link href="/add-facility" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold transition text-sm">
              Add Facility
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {facilities.map((facility) => (
              <div key={facility._id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row overflow-hidden">
                <div className="w-full sm:w-36 h-36 sm:h-auto shrink-0 overflow-hidden">
                  <img
                    src={facility.image || "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400"}
                    alt={facility.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <h3 className="text-base font-bold text-gray-900 dark:text-white truncate">{facility.name}</h3>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ${typeColors[facility.facility_type] || "bg-gray-100 text-gray-700"}`}>
                        {facility.facility_type}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1"><FaMapMarkerAlt className="text-blue-400" />{facility.location}</span>
                      <span className="flex items-center gap-1"><FaUsers className="text-purple-400" />{facility.capacity} persons</span>
                      <span className="font-semibold text-blue-600">৳{facility.price_per_hour}/hr</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{facility.booking_count || 0} bookings</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => setEditingFacility(facility)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-blue-200 text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-700 text-xs font-semibold transition cursor-pointer"
                    >
                      <FaEdit /> Update
                    </button>
                    <button
                      onClick={() => handleDelete(facility)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 dark:hover:bg-slate-700 text-xs font-semibold transition cursor-pointer"
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editingFacility && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 relative">
            <button onClick={() => setEditingFacility(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-white cursor-pointer">
              <FaTimes size={18} />
            </button>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">Update Facility</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-gray-300">Facility Name</label>
                  <input name="name" defaultValue={editingFacility.name} required className="w-full border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-2.5 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-gray-300">Facility Type</label>
                  <select name="facility_type" defaultValue={editingFacility.facility_type} required className="w-full border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-2.5 bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white text-sm">
                    {SPORT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-gray-300">Location</label>
                  <input name="location" defaultValue={editingFacility.location} required className="w-full border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-2.5 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-gray-300">Price Per Hour (৳)</label>
                  <input name="price_per_hour" type="number" defaultValue={editingFacility.price_per_hour} required className="w-full border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-2.5 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-gray-300">Capacity (persons)</label>
                  <input name="capacity" type="number" defaultValue={editingFacility.capacity} required className="w-full border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-2.5 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white text-sm" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-gray-300">Image URL</label>
                  <input name="image" defaultValue={editingFacility.image} className="w-full border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-2.5 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white text-sm" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-gray-300">Description</label>
                  <textarea name="description" defaultValue={editingFacility.description} rows={3} className="w-full border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-2.5 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white text-sm resize-none" />
                </div>
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setEditingFacility(null)} className="flex-1 border border-slate-200 dark:border-slate-600 text-gray-600 dark:text-gray-300 py-2.5 rounded-xl font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition text-sm cursor-pointer">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-semibold transition disabled:opacity-60 text-sm cursor-pointer">
                  {submitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
