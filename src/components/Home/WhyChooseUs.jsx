"use client";

import { FaShieldAlt, FaBolt, FaHeadset, FaMapMarkerAlt } from "react-icons/fa";
import { motion } from "framer-motion";

const features = [
  { icon: <FaBolt className="text-yellow-500 text-2xl" />, title: "Instant Booking", desc: "Reserve your slot in seconds with our fast and seamless booking system." },
  { icon: <FaShieldAlt className="text-green-500 text-2xl" />, title: "Verified Venues", desc: "Every facility listed is verified for quality, safety, and accurate information." },
  { icon: <FaMapMarkerAlt className="text-red-500 text-2xl" />, title: "Wide Coverage", desc: "Find sports facilities across multiple locations in your city." },
  { icon: <FaHeadset className="text-blue-500 text-2xl" />, title: "24/7 Support", desc: "Our support team is always ready to help you with any booking issues." },
];

const stats = [
  { value: "500+", label: "Facilities" },
  { value: "12K+", label: "Happy Players" },
  { value: "8", label: "Sport Types" },
  { value: "99%", label: "Satisfaction" },
];

export default function WhyChooseUs() {
  return (
    <section className="py-12 sm:py-16 px-4 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10 sm:mb-12"
      >
        <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-3">
          Why Choose SportFlow?
        </h2>
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
          We make sports facility booking simple, reliable, and enjoyable
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10 sm:mb-14">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-5 sm:p-6 hover:shadow-md transition"
          >
            <div className="w-11 h-11 bg-slate-50 dark:bg-slate-700 rounded-xl flex items-center justify-center mb-4">
              {f.icon}
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-sm sm:text-base">{f.title}</h3>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-blue-600 rounded-2xl p-6 sm:p-8 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center text-white">
        {stats.map((s) => (
          <div key={s.label}>
            <p className="text-2xl sm:text-4xl font-extrabold">{s.value}</p>
            <p className="text-blue-100 text-xs sm:text-sm mt-1">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
