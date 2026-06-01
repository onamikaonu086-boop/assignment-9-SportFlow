"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { FaMapMarkerAlt, FaUsers, FaStar, FaSearch, FaTimes } from "react-icons/fa";
import LoadingSpinner from "@/components/Shared/LoadingSpinner";

const SPORT_TYPES = ["Football", "Badminton", "Swimming", "Tennis", "Cricket"];

const typeColors = {
  Football: "bg-green-100 text-green-700",
  Badminton: "bg-yellow-100 text-yellow-700",
  Swimming: "bg-blue-100 text-blue-700",
  Tennis: "bg-orange-100 text-orange-700",
  Cricket: "bg-red-100 text-red-700",
};

export default function AllFacilitiesPage() {
  const { data: session } = useSession();
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (selectedTypes.length > 0) params.set("type", selectedTypes.join(","));
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/facilities?${params}`);
        const data = await res.json();
        setFacilities(data);
      } catch {
        setFacilities([]);
      } finally {
        setLoading(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [search, selectedTypes]);

  const toggleType = (type) =>
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );

  const clearFilters = () => { setSearch(""); setSelectedTypes([]); };
  const hasFilters = search || selectedTypes.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 py-8 sm:py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
            All Facilities
          </h1>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            Find and book the perfect sports venue for your game
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-100 dark:border-slate-700 mb-6">
          <div className="relative mb-4">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by facility name..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white text-sm"
            />
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 shrink-0">
              Sport:
            </span>
            {SPORT_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => toggleType(type)}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition cursor-pointer ${
                  selectedTypes.includes(type)
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-slate-200 dark:border-slate-600 text-gray-600 dark:text-gray-300 hover:border-blue-400"
                }`}
              >
                {type}
              </button>
            ))}
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-xs text-red-500 hover:underline cursor-pointer ml-1"
              >
                <FaTimes /> Clear
              </button>
            )}
          </div>
        </div>

        {!loading && (
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-4">
            Showing <span className="font-semibold text-gray-800 dark:text-white">{facilities.length}</span>{" "}
            {facilities.length === 1 ? "facility" : "facilities"}
          </p>
        )}

        {loading ? (
          <LoadingSpinner />
        ) : facilities.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg mb-4">No facilities found</p>
            {hasFilters && (
              <button onClick={clearFilters} className="text-blue-600 font-semibold hover:underline text-sm">
                Clear filters and try again
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {facilities.map((facility) => (
              <FacilityCard key={facility._id} facility={facility} user={session?.user} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FacilityCard({ facility, user }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow h-full">
      <div className="relative h-44 sm:h-48 overflow-hidden shrink-0">
        <img
          src={facility.image || "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600"}
          alt={facility.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        <span className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full ${typeColors[facility.facility_type] || "bg-gray-100 text-gray-700"}`}>
          {facility.facility_type}
        </span>
      </div>

      <div className="p-4 sm:p-5 flex flex-col flex-1">
        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 truncate">
          {facility.name}
        </h3>

        <div className="space-y-1.5 text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-3">
          <p className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-blue-500 shrink-0" />
            <span className="truncate">{facility.location}</span>
          </p>
          <p className="flex items-center gap-2">
            <FaUsers className="text-purple-500 shrink-0" />
            Capacity: {facility.capacity} persons
          </p>
          <p className="flex items-center gap-2">
            <FaStar className="text-yellow-400 shrink-0" />
            {facility.booking_count || 0} bookings
          </p>
        </div>

        {facility.description && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-3 line-clamp-2">
            {facility.description}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700">
          <p className="text-blue-600 font-extrabold text-base sm:text-lg">
            ৳{facility.price_per_hour}
            <span className="text-xs font-normal text-gray-400">/hr</span>
          </p>
          <Link
            href={user ? `/facility/${facility._id}` : `/login?redirect=/facility/${facility._id}`}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm transition"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}
