"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { FaMapMarkerAlt, FaUsers, FaStar } from "react-icons/fa";
import LoadingSpinner from "@/components/Shared/LoadingSpinner";
import { motion } from "framer-motion";

const typeColors = {
  Football: "bg-green-100 text-green-700",
  Badminton: "bg-yellow-100 text-yellow-700",
  Swimming: "bg-blue-100 text-blue-700",
  Tennis: "bg-orange-100 text-orange-700",
  Cricket: "bg-red-100 text-red-700",
};

export default function FeaturedFacilities() {
  const { data: session } = useSession();
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/facilities`)
      .then((res) => res.json())
      .then((data) => { setFacilities(data.slice(0, 6)); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  if (facilities.length === 0) {
    return (
      <section className="py-12 text-center px-4">
        <p className="text-gray-400">No facilities added yet.</p>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-2 sm:mb-3">
          Featured Facilities
        </h2>
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
          Discover top-rated sports venues available for booking right now
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {facilities.map((facility, index) => (
          <motion.div
            key={facility._id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow"
          >
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
              <div className="space-y-1.5 text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-4">
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

              <div className="mt-auto flex items-center justify-between">
                <p className="text-blue-600 font-extrabold text-base sm:text-lg">
                  ৳{facility.price_per_hour}
                  <span className="text-xs font-normal text-gray-400">/hr</span>
                </p>
                <Link
                  href={session?.user ? `/facility/${facility._id}` : `/login?redirect=/facility/${facility._id}`}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm transition"
                >
                  Book Now
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="text-center mt-8 sm:mt-10">
        <Link
          href="/facilities"
          className="inline-block border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-bold transition text-sm sm:text-base"
        >
          View All Facilities
        </Link>
      </div>
    </section>
  );
}
