"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { FaHome, FaList, FaBook, FaPlus, FaTools, FaSignInAlt, FaUserPlus, FaBars, FaTimes, FaSignOutAlt } from "react-icons/fa";
import ThemeToggle from "@/components/ThemeToggle";
import { authClient } from "@/lib/auth-client";
import { showSuccess } from "@/lib/alert";

const Navbar = () => {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      showSuccess("Logged out successfully!");
      setMobileMenuOpen(false);
      setDropdownOpen(false);
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const user = session?.user;

  return (
    <nav className="bg-white dark:bg-slate-900 shadow-sm sticky top-0 z-50 transition-colors duration-300 border-b border-slate-100 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">

          {/* Logo */}
          <Link href="/" className="text-2xl md:text-3xl font-extrabold text-blue-600 tracking-tighter">
            SportFlow
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 font-medium text-gray-700 dark:text-gray-200">
            {[
              { href: "/", icon: <FaHome />, label: "Home" },
              { href: "/facilities", icon: <FaList />, label: "All Facilities" },
            ].map(({ href, icon, label }) => (
              <Link key={href} href={href} className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 transition text-sm">
                {icon} {label}
              </Link>
            ))}
            {user && [
              { href: "/my-bookings", icon: <FaBook />, label: "My Bookings" },
              { href: "/add-facility", icon: <FaPlus />, label: "Add Facility" },
              { href: "/manage-my-facilities", icon: <FaTools />, label: "Manage" },
            ].map(({ href, icon, label }) => (
              <Link key={href} href={href} className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 transition text-sm">
                {icon} {label}
              </Link>
            ))}
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />

            {isPending ? (
              <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
            ) : user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center focus:outline-none cursor-pointer"
                  aria-haspopup="true"
                  aria-expanded={dropdownOpen}
                >
                  <img
                    src={user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=2563EB&color=fff`}
                    alt={user.name}
                    className="w-9 h-9 rounded-full border-2 border-blue-600 object-cover transition transform hover:scale-105"
                  />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 py-1 z-50 transition-all">
                    
                    <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-700">
                      <p className="font-semibold text-[10px] text-slate-400 uppercase tracking-wider">Signed in as</p>
                      <p className="font-bold text-slate-800 dark:text-white truncate text-sm mt-0.5">{user.name}</p>
                      <p className="text-xs text-slate-400 truncate">{user.email}</p>
                    </div>

                    <Link 
                      href="/my-bookings" 
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition"
                    >
                      <FaBook className="text-blue-500" /> My Bookings
                    </Link>

                    <Link 
                      href="/add-facility" 
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition"
                    >
                      <FaPlus className="text-green-500" /> Add Facility
                    </Link>

                    <Link 
                      href="/manage-my-facilities" 
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition"
                    >
                      <FaTools className="text-yellow-500" /> Manage Facilities
                    </Link>

                    {/* লগআউট বাটন */}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition border-t border-slate-100 dark:border-slate-700 text-left font-medium cursor-pointer"
                    >
                      <FaSignOutAlt /> Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="flex items-center gap-2 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition font-semibold text-sm">
                  <FaSignInAlt /> Login
                </Link>
                <Link href="/register" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition font-semibold text-sm shadow-sm">
                  <FaUserPlus /> Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              className="text-gray-700 dark:text-white p-1 focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 px-4 pt-2 pb-4 space-y-1">
          {user && (
            <div className="flex items-center gap-3 py-3 mb-2 border-b border-slate-100 dark:border-slate-700">
              <img
                src={user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=2563EB&color=fff`}
                alt={user.name}
                className="w-8 h-8 rounded-full border-2 border-blue-600 object-cover"
              />
              <div>
                <p className="font-semibold text-gray-800 dark:text-white text-sm truncate">{user.name}</p>
                <p className="text-xs text-gray-400 truncate">{user.email}</p>
              </div>
            </div>
          )}

          {[
            { href: "/", icon: <FaHome />, label: "Home" },
            { href: "/facilities", icon: <FaList />, label: "All Facilities" },
            ...(user ? [
              { href: "/my-bookings", icon: <FaBook />, label: "My Bookings" },
              { href: "/add-facility", icon: <FaPlus />, label: "Add Facility" },
              { href: "/manage-my-facilities", icon: <FaTools />, label: "Manage Facilities" },
            ] : []),
          ].map(({ href, icon, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 py-2.5 px-2 text-sm text-gray-700 dark:text-gray-200 hover:text-blue-600 rounded-lg transition"
            >
              {icon} {label}
            </Link>
          ))}

          {user ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 py-2.5 px-2 text-sm text-red-500 w-full text-left font-medium cursor-pointer"
            >
              <FaSignOutAlt /> Logout
            </button>
          ) : (
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 py-2.5 px-2 text-sm text-gray-700 dark:text-gray-200 hover:text-blue-600 rounded-lg transition font-medium"
              >
                <FaSignInAlt /> Login
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 py-2.5 px-2 text-sm text-blue-600 font-bold transition"
              >
                <FaUserPlus /> Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;