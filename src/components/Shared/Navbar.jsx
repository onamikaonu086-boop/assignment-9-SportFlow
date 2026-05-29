import Link from 'next/link';
import { FaHome, FaList, FaBook, FaPlus, FaTools, FaSignInAlt, FaSun, FaMoon, FaUserPlus } from 'react-icons/fa';

const Navbar = () => {
  return (
    <nav className="bg-white dark:bg-slate-900 shadow-md sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-3xl font-extrabold text-blue-600 tracking-tighter">
              SportFlow
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6 font-medium text-gray-700 dark:text-gray-200">
            <Link href="/" className="flex items-center gap-2 hover:text-blue-600 transition">
              <FaHome /> Home
            </Link>
            <Link href="/facilities" className="flex items-center gap-2 hover:text-blue-600 transition">
              <FaList /> Facilities
            </Link>
            <Link href="/my-bookings" className="flex items-center gap-2 hover:text-blue-600 transition">
              <FaBook /> Bookings
            </Link>
            <Link href="/add-facility" className="flex items-center gap-2 hover:text-blue-600 transition">
              <FaPlus /> Add
            </Link>
            <Link href="/manage-my-facilities" className="flex items-center gap-2 hover:text-blue-600 transition">
              <FaTools /> Manage
            </Link>
          </div>

          {/* Right Side: Theme Toggle, Login & Register */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle */}
            <label className="flex cursor-pointer gap-2 items-center mr-2">
              <FaSun className="text-yellow-500" />
              <input type="checkbox" className="toggle theme-controller" />
              <FaMoon className="text-gray-400" />
            </label>

            {/* Login & Register Buttons */}
            <Link href="/login" className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 font-medium">
              <FaSignInAlt /> Login
            </Link>
            <Link href="/register" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
              <FaUserPlus /> Register
            </Link>
          </div>

          {/* Mobile Menu Icon */}
          <div className="md:hidden text-gray-700 dark:text-white">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;