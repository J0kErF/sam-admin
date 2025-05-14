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
      {/* Mobile Menu Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleSidebar}
          className="text-white bg-blue-700 hover:bg-blue-800 p-2 rounded-md shadow"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen bg-gradient-to-b from-blue-50 to-blue-100 shadow-md border-r
  text-gray-700 flex flex-col justify-between transition-transform duration-300 ease-in-out
  ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:relative`}
      >
        {/* Top Section: Logo + Nav */}
        <div className="flex flex-col h-full overflow-y-auto px-4 py-6">
          {/* Logo */}
          <div className="flex items-center justify-center mb-6">
            <Link href="/">
              <Image
                src="/icons/icon-512.png"
                alt="logo"
                width={48}
                height={48}
                className="rounded-md shadow-sm"
              />
            </Link>
          </div>

          {/* Nav */}
          <nav className="flex flex-col gap-2 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.url}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-150 ${pathname === link.url
                    ? "bg-blue-600 text-white shadow-sm"
                    : "hover:bg-blue-200 hover:text-blue-900 text-gray-700"
                  }`}
              >
                {link.icon}
                <span className="truncate">{link.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Bottom Section: User */}
        <div className="px-4 py-4 bg-blue-700 text-white flex items-center gap-2 text-sm">
          <UserButton />
          <span className="truncate">הפרופיל שלי</span>
        </div>
      </aside>

    </>
  );
};

export default LeftSideBar;
