"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaHome, FaList, FaBook, FaPlus, FaTools, FaSignInAlt, FaUserPlus, FaBars, FaTimes, FaSignOutAlt } from "react-icons/fa";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar } from "@heroui/react";
import ThemeToggle from "@/components/ThemeToggle";
import { authClient } from "@/lib/auth-client";
import { showSuccess } from "@/lib/alert";
// import { setStoredToken } from "@/lib/api"; 

const Navbar = () => {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      // setStoredToken(null); 
      showSuccess("Logged out successfully!");
      setMobileMenuOpen(false);
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

          {/* Desktop Right Actions (Theme Toggle, Login/Register or Profile) */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            
            {isPending ? (
              <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
            ) : user ? (
              <Dropdown placement="bottom-end" backdrop="blur" className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl shadow-xl">
                <DropdownTrigger>
                  <Avatar
                    isBordered
                    as="button"
                    className="transition-transform border-blue-600 w-9 h-9 text-sm"
                    src={user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=2563EB&color=fff`}
                    name={user.name}
                  />
                </DropdownTrigger>
                
                <DropdownMenu aria-label="Profile Actions" variant="flat">
                  <DropdownItem key="profile" className="h-14 gap-2 border-b border-slate-100 dark:border-slate-700" textValue={user.name}>
                    <p className="font-semibold text-xs text-slate-400 uppercase">Signed in as</p>
                    <p className="font-bold text-slate-800 dark:text-white truncate">{user.name}</p>
                  </DropdownItem>
                  
                  <DropdownItem key="bookings" startContent={<FaBook className="text-blue-500" />} textValue="My Bookings">
                    <Link href="/my-bookings" className="w-full block text-sm">My Bookings</Link>
                  </DropdownItem>
                  
                  <DropdownItem key="add-facility" startContent={<FaPlus className="text-green-500" />} textValue="Add Facility">
                    <Link href="/add-facility" className="w-full block text-sm">Add Facility</Link>
                  </DropdownItem>
                  
                  <DropdownItem key="manage" startContent={<FaTools className="text-yellow-500" />} textValue="Manage Facilities">
                    <Link href="/manage-my-facilities" className="w-full block text-sm">Manage Facilities</Link>
                  </DropdownItem>
                  
                  <DropdownItem key="logout" className="text-red-500 hover:text-red-600" startContent={<FaSignOutAlt />} onClick={handleLogout} textValue="Log Out">
                    <span className="font-medium text-sm">Log Out</span>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            ) : (
              // Desktop Login & Register Buttons
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
            <button className="text-gray-700 dark:text-white p-1 focus:outline-none" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
              {mobileMenuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 px-4 pt-2 pb-4 space-y-1 animate-in fade-in slide-in-from-top-5 duration-200">
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
            <Link key={href} href={href} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 py-2.5 px-2 text-sm text-gray-700 dark:text-gray-200 hover:text-blue-600 rounded-lg transition">
              {icon} {label}
            </Link>
          ))}
          
          {/* Mobile Login / Register / Logout Handler */}
          {user ? (
            <button onClick={handleLogout} className="flex items-center gap-2 py-2.5 px-2 text-sm text-red-500 w-full text-left font-medium cursor-pointer">
              <FaSignOutAlt /> Logout
            </button>
          ) : (
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 py-2.5 px-2 text-sm text-gray-700 dark:text-gray-200 hover:text-blue-600 rounded-lg transition font-medium">
                <FaSignInAlt /> Login
              </Link>
              <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 py-2.5 px-2 text-sm text-blue-600 font-bold transition">
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