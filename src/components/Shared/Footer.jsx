import Link from "next/link";
import { FaFacebook, FaInstagram, FaLinkedin, FaEnvelope, FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10 mb-10">
          <div>
            <Link href="/" className="text-2xl sm:text-3xl font-extrabold text-white tracking-tighter">
              SportFlow
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-slate-400 max-w-xs">
              Your ultimate destination for booking sports facilities. Reserve turfs, courts, and arenas with ease.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              {[
                { href: "/", label: "Home" },
                { href: "/facilities", label: "All Facilities" },
                { href: "/my-bookings", label: "My Bookings" },
                { href: "/add-facility", label: "Add Facility" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm hover:text-blue-400 transition">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Contact Us</h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-blue-500 mt-0.5 shrink-0" />
                Rajshahi, Bangladesh
              </li>
              <li className="flex items-center gap-3">
                <FaPhone className="text-blue-500 shrink-0" />
                +880 1234 567890
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-blue-500 shrink-0" />
                support@sportflow.com
              </li>
            </ul>

            <div className="flex gap-4 mt-5">
              {[
                { href: "#", icon: <FaFacebook />, hover: "hover:text-blue-500" },
                { href: "#", icon: <FaXTwitter />, hover: "hover:text-slate-200" },
                { href: "#", icon: <FaInstagram />, hover: "hover:text-pink-500" },
                { href: "#", icon: <FaLinkedin />, hover: "hover:text-blue-400" },
              ].map(({ href, icon, hover }, i) => (
                <Link key={i} href={href} className={`text-lg text-slate-400 ${hover} transition`}>
                  {icon}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 text-center text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} SportFlow. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
