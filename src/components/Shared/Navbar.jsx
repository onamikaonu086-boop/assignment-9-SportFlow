"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaHome, FaList, FaBook, FaPlus, FaTools, FaSignInAlt, FaBars, FaTimes } from "react-icons/fa";
import ThemeToggle from "@/components/ThemeToggle";
import { authClient, useSession } from "@/lib/auth-client";
import { showSuccess } from "@/lib/alert";

const Navbar = () => {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    await authClient.signOut();
    showSuccess("Logged out successfully!");
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    router.push("/");
  };

  const user = session?.user;

  return (
    <nav className="bg-white dark:bg-slate-900 shadow-sm sticky top-0 z-50 transition-colors duration-300 border-b border-slate-100 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          <Link href="/" className="text-2xl md:text-3xl font-extrabold text-blue-600 tracking-tighter">
            SportFlow
          </Link>

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

          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            {isPending ? (
              <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
            ) : user ? (
              <div className="relative" ref={dropdownRef}>
                <button onClick={() => setDropdownOpen(!dropdownOpen)} className="focus:outline-none" title={user.name}>
                  <img
                    src={user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=2563EB&color=fff`}
                    alt={user.name}
                    className="w-9 h-9 rounded-full border-2 border-blue-600 object-cover"
                  />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl py-2 z-50">
                    <p className="px-4 py-2.5 text-sm font-semibold text-gray-800 dark:text-white border-b border-slate-100 dark:border-slate-700 truncate">{user.name}</p>
                    {[
                      { href: "/my-bookings", icon: <FaBook className="text-blue-500" />, label: "My Bookings" },
                      { href: "/add-facility", icon: <FaPlus className="text-green-500" />, label: "Add Facility" },
                      { href: "/manage-my-facilities", icon: <FaTools className="text-yellow-500" />, label: "Manage Facilities" },
                    ].map(({ href, icon, label }) => (
                      <Link key={href} href={href} onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-slate-50 dark:hover:bg-slate-700">
                        {icon} {label}
                      </Link>
                    ))}
                    <hr className="my-1 border-slate-100 dark:border-slate-700" />
                    <button onClick={handleLogout} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-slate-700 cursor-pointer">
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition font-semibold text-sm">
                <FaSignInAlt /> Login
              </Link>
            )}
          </div>

          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button className="text-gray-700 dark:text-white p-1" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
              {mobileMenuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 px-4 pt-2 pb-4 space-y-1">
          {user && (
            <div className="flex items-center gap-3 py-3 mb-2 border-b border-slate-100 dark:border-slate-700">
              <img
                src={user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=2563EB&color=fff`}
                alt={user.name}
                className="w-8 h-8 rounded-full border-2 border-blue-600 object-cover"
              />
              <span className="font-semibold text-gray-800 dark:text-white text-sm truncate">{user.name}</span>
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
            <Link key={href} href={href} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 py-2.5 px-2 text-sm text-gray-700 dark:text-gray-200 hover:text-blue-600 rounded-lg">
              {icon} {label}
            </Link>
          ))}
          {user ? (
            <button onClick={handleLogout} className="flex items-center gap-2 py-2.5 px-2 text-sm text-red-500 w-full cursor-pointer">
              Logout
            </button>
          ) : (
            <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 py-2.5 px-2 text-sm text-blue-600 font-semibold">
              <FaSignInAlt /> Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
