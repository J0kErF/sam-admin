"use client";

import { useState } from "react";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "@/lib/constants";
import { Menu, X } from "lucide-react";

const LeftSideBar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Toggle Button on Small Screens */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleSidebar}
          className="bg-blue-700 text-white p-2 rounded-md shadow"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-screen w-64 bg-gradient-to-b from-blue-50 to-blue-100 border-r shadow-md
          text-gray-800 flex flex-col justify-between transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:relative
        `}
      >
        {/* Sidebar Scrollable Content */}
        <div className="flex flex-col h-full overflow-y-auto px-4 py-6">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Link href="/">
              <Image
                src="/icons/icon-512.png"
                alt="logo"
                width={48}
                height={48}
                className="rounded shadow-sm"
              />
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.url}
                onClick={() => setIsOpen(false)} // auto-close on mobile
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition ${
                  pathname === link.url
                    ? "bg-blue-600 text-white shadow"
                    : "text-gray-700 hover:bg-blue-200 hover:text-blue-900"
                }`}
              >
                {link.icon}
                <span className="truncate">{link.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="px-4 py-3 bg-blue-700 text-white flex items-center gap-2 text-sm">
          <UserButton />
          <span className="truncate">הפרופיל שלי</span>
        </div>
      </aside>
    </>
  );
};

export default LeftSideBar;
