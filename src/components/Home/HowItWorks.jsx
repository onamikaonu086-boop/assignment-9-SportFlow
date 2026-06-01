"use client";

import { FaSearch, FaCalendarCheck, FaRunning } from "react-icons/fa";
import { motion } from "framer-motion";

const steps = [
  {
    icon: <FaSearch className="text-blue-600 text-3xl" />,
    step: "01",
    title: "Find a Facility",
    desc: "Browse through our wide range of sports venues — football turfs, badminton courts, swimming pools, and more.",
  },
  {
    icon: <FaCalendarCheck className="text-blue-600 text-3xl" />,
    step: "02",
    title: "Pick a Time Slot",
    desc: "Choose your preferred date and available time slot that fits your schedule perfectly.",
  },
  {
    icon: <FaRunning className="text-blue-600 text-3xl" />,
    step: "03",
    title: "Play & Enjoy",
    desc: "Show up at the venue and enjoy your game. Cancel anytime before your booking date.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-12 sm:py-16 px-4 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-3">
            How It Works
          </h2>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            Book your favourite sports facility in 3 simple steps
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.15 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-8 text-center shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition"
            >
              <div className="w-16 h-16 bg-blue-50 dark:bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                {item.icon}
              </div>
              <span className="text-xs font-bold text-blue-500 tracking-widest">
                STEP {item.step}
              </span>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-1 mb-3">
                {item.title}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
