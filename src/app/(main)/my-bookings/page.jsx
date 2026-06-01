"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { showSuccess, showError, showConfirm } from "@/lib/alert";
import { FaCalendarAlt, FaClock, FaMoneyBillWave, FaTimesCircle, FaCheckCircle, FaHourglassHalf } from "react-icons/fa";
import LoadingSpinner from "@/components/Shared/LoadingSpinner";
import Link from "next/link";

const statusConfig = {
  pending: {
    label: "Pending",
    icon: <FaHourglassHalf />,
    className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
  cancelled: {
    label: "Cancelled",
    icon: <FaTimesCircle />,
    className: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
  },
  confirmed: {
    label: "Confirmed",
    icon: <FaCheckCircle />,
    className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  },
};

export default function MyBookingsPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    if (!isPending && !session?.user) router.push("/login?redirect=/my-bookings");
  }, [isPending, session, router]);

  useEffect(() => {
    if (!session?.user) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/my-bookings`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => { setBookings(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [session]);

  const handleCancel = async (booking) => {
    const confirmed = await showConfirm({
      title: "Cancel Booking?",
      text: `Are you sure you want to cancel your booking for "${booking.facility_name}"?`,
      confirmText: "Yes, Cancel",
      confirmColor: "#ef4444",
    });
    if (!confirmed) return;

    setCancellingId(booking._id);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/${booking._id}/cancel`, {
        method: "PATCH",
        credentials: "include",
      });
      if (res.ok) {
        showSuccess("Booking cancelled.");
        setBookings((prev) => prev.map((b) => b._id === booking._id ? { ...b, status: "cancelled" } : b));
      } else {
        showError("Failed to cancel. Please try again.");
      }
    } catch {
      showError("Something went wrong.");
    } finally {
      setCancellingId(null);
    }
  };

  if (isPending || loading) return <LoadingSpinner />;
  if (!session?.user) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 py-8 sm:py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-1.5">My Bookings</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">Manage and track all your facility reservations</p>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-12 sm:p-16 text-center shadow-sm">
            <div className="text-6xl mb-4">🏟️</div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-700 dark:text-white mb-2">No bookings yet</h2>
            <p className="text-gray-400 text-sm mb-6">You haven&apos;t booked any facility yet.</p>
            <Link href="/facilities" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold transition text-sm">
              Explore Facilities
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.map((booking) => {
              const status = statusConfig[booking.status] || statusConfig.pending;
              const isCancelled = booking.status === "cancelled";
              return (
                <div key={booking._id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2 truncate">{booking.facility_name}</h3>
                      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1.5">
                          <FaCalendarAlt className="text-blue-400 shrink-0" /> {booking.booking_date}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <FaClock className="text-purple-400 shrink-0" /> {booking.time_slot}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <FaClock className="text-orange-400 shrink-0" /> {booking.hours}h
                        </span>
                        <span className="flex items-center gap-1.5">
                          <FaMoneyBillWave className="text-green-400 shrink-0" /> ৳{booking.total_price}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${status.className}`}>
                        {status.icon} {status.label}
                      </span>
                      {!isCancelled && (
                        <button
                          onClick={() => handleCancel(booking)}
                          disabled={cancellingId === booking._id}
                          className="px-3 py-1.5 rounded-xl border border-red-300 text-red-500 text-xs font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 transition disabled:opacity-50 cursor-pointer"
                        >
                          {cancellingId === booking._id ? "..." : "Cancel"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
