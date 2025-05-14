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
      {/* Mobile Hamburger */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleSidebar}
          className="text-white bg-blue-600 p-2 rounded-lg shadow-md"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-full w-64 bg-gradient-to-b from-blue-100 to-blue-200 text-gray-800 shadow-xl
          flex flex-col justify-between transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:relative lg:flex
        `}
      >
        {/* Logo & Nav */}
        <div className="flex flex-col h-full overflow-y-auto px-6 py-8 gap-6">
          {/* Logo */}
          <div className="flex items-center justify-center mb-2">
            <Link href="/">
              <Image
                src="/icons/icon-512.png"
                alt="logo"
                width={60}
                height={60}
                className="rounded-full shadow-sm"
              />
            </Link>
          </div>

          {/* Nav Links */}
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.url}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium ${
                  pathname === link.url
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-blue-500 hover:text-white"
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* User Info */}
        <div className="px-6 py-4 bg-blue-800 rounded-t-lg text-white flex items-center gap-3">
          <UserButton />
          <span className="text-sm">הפרופיל שלי</span>
        </div>
      </aside>
    </>
  );
};

export default LeftSideBar;
