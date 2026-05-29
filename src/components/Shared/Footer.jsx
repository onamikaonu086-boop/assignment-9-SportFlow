import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          
          <div>
            <Link href="/" className="text-3xl font-extrabold text-white tracking-tighter">
              SportFlow
            </Link>
            <p className="mt-4 text-sm leading-relaxed">
              SportFlow is your ultimate destination for booking sports facilities. 
              Reserve your favourite turfs, courts, and arenas with ease and play your best game.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="hover:text-blue-400 transition">Home</Link></li>
              <li><Link href="/facilities" className="hover:text-blue-400 transition">All Facilities</Link></li>
              <li><Link href="/my-bookings" className="hover:text-blue-400 transition">My Bookings</Link></li>
              <li><Link href="/add-facility" className="hover:text-blue-400 transition">Add Facility</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3"><FaMapMarkerAlt className="text-blue-500" /> Rajshahi, Bangladesh</li>
              <li className="flex items-center gap-3"><FaPhone className="text-blue-500" /> +880 1234 567890</li>
              <li className="flex items-center gap-3"><FaEnvelope className="text-blue-500" /> support@sportflow.com</li>
            </ul>
            
            <div className="flex gap-4 mt-6">
              <Link href="#" className="text-xl hover:text-blue-500 transition"><FaFacebook /></Link>
              <Link href="#" className="text-xl hover:text-blue-400 transition"><FaTwitter /></Link>
              <Link href="#" className="text-xl hover:text-pink-500 transition"><FaInstagram /></Link>
              <Link href="#" className="text-xl hover:text-blue-600 transition"><FaLinkedin /></Link>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} SportFlow. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;