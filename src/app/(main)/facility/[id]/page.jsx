"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { showSuccess, showError } from "@/lib/alert";
import { FaMapMarkerAlt, FaUsers, FaClock, FaDollarSign, FaArrowLeft } from "react-icons/fa";
import LoadingSpinner from "@/components/Shared/LoadingSpinner";
import Link from "next/link";

const typeColors = {
  Football: "bg-green-100 text-green-700",
  Badminton: "bg-yellow-100 text-yellow-700",
  Swimming: "bg-blue-100 text-blue-700",
  Tennis: "bg-orange-100 text-orange-700",
  Cricket: "bg-red-100 text-red-700",
};

export default function FacilityDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [facility, setFacility] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [bookingDate, setBookingDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [hours, setHours] = useState(1);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push(`/login?redirect=/facility/${id}`);
    }
  }, [isPending, session, id, router]);

  useEffect(() => {
    if (!id) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/facilities/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setFacility(data);
        if (data.available_slots?.length > 0) setTimeSlot(data.available_slots[0]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const totalPrice = facility ? facility.price_per_hour * hours : 0;
  const today = new Date().toISOString().split("T")[0];

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!bookingDate) { showError("Please select a booking date"); return; }
    if (!timeSlot) { showError("Please select a time slot"); return; }

    setSubmitting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          facility_id: facility._id,
          facility_name: facility.name,
          booking_date: bookingDate,
          time_slot: timeSlot,
          hours: Number(hours),
          total_price: totalPrice,
        }),
      });

      if (res.ok) {
        showSuccess("Booking confirmed!");
        router.push("/my-bookings");
      } else {
        const err = await res.json();
        showError(err.error || "Booking failed. Try again.");
      }
    } catch {
      showError("Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (isPending || loading) return <LoadingSpinner />;
  if (!session?.user) return null;

  if (!facility || facility.error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-xl text-gray-500">Facility not found.</p>
        <Link href="/facilities" className="text-blue-600 hover:underline">
          Back to Facilities
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 pb-16">
      <div className="relative h-64 md:h-80 w-full overflow-hidden">
        <img
          src={facility.image || "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200"}
          alt={facility.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute bottom-6 left-6">
          <span className={`text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block ${typeColors[facility.facility_type] || "bg-gray-100 text-gray-700"}`}>
            {facility.facility_type}
          </span>
          <h1 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-white">{facility.name}</h1>
        </div>
        <Link
          href="/facilities"
          className="absolute top-5 left-5 flex items-center gap-2 text-white bg-black/30 hover:bg-black/50 px-3 py-2 rounded-xl text-sm transition"
        >
          <FaArrowLeft /> Back
        </Link>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">Facility Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              {[
                { icon: <FaMapMarkerAlt className="text-blue-500" />, bg: "bg-blue-50 dark:bg-slate-700", label: "Location", value: facility.location },
                { icon: <FaUsers className="text-purple-500" />, bg: "bg-purple-50 dark:bg-slate-700", label: "Capacity", value: `${facility.capacity} persons` },
                { icon: <FaDollarSign className="text-green-500" />, bg: "bg-green-50 dark:bg-slate-700", label: "Price", value: `৳${facility.price_per_hour} / hour` },
                { icon: <FaClock className="text-yellow-500" />, bg: "bg-yellow-50 dark:bg-slate-700", label: "Owner", value: facility.owner_email },
              ].map(({ icon, bg, label, value }) => (
                <div key={label} className="flex items-center gap-3">
                  <span className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center`}>{icon}</span>
                  <div>
                    <p className="text-gray-400 text-xs">{label}</p>
                    <p className="font-semibold text-gray-800 dark:text-white truncate">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">About this Facility</h2>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
              {facility.description || "No description provided."}
            </p>
          </div>

          {facility.available_slots?.length > 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Available Time Slots</h2>
              <div className="flex flex-wrap gap-2">
                {facility.available_slots.map((slot) => (
                  <span key={slot} className="px-4 py-2 bg-blue-50 dark:bg-slate-700 text-blue-700 dark:text-blue-300 rounded-xl text-sm font-medium">
                    {slot}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-md sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">Book This Facility</h2>

            <form onSubmit={handleBooking} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Facility</label>
                <input
                  value={facility.name}
                  readOnly
                  className="w-full border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-2.5 bg-slate-50 dark:bg-slate-700 text-gray-700 dark:text-gray-300 text-sm cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Booking Date</label>
                <input
                  type="date"
                  min={today}
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  required
                  className="w-full border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-2.5 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Time Slot</label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  required
                  className="w-full border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-2.5 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white text-sm"
                >
                  {facility.available_slots?.map((slot) => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Hours</label>
                <input
                  type="number"
                  min={1}
                  max={8}
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  required
                  className="w-full border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-2.5 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white text-sm"
                />
              </div>

              <div className="bg-blue-50 dark:bg-slate-700 rounded-xl p-4 flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Price</span>
                <span className="text-xl font-extrabold text-blue-600">৳{totalPrice}</span>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition disabled:opacity-60 cursor-pointer"
              >
                {submitting ? "Confirming..." : "Confirm Booking"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
