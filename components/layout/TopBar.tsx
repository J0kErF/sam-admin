"use client";

import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { navLinks } from "@/lib/constants";

const TopBar = () => {
  const [dropdownMenu, setDropdownMenu] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 w-full flex justify-between items-center px-4 py-3 bg-white shadow-md border-b border-gray-200 lg:hidden">
      {/* Logo */}
      <Link href="/" className="hover:opacity-90 transition">
        <Image src="/logo.png" alt="logo" width={45} height={45} />
      </Link>

      {/* Mobile Menu & User */}
      <div className="relative flex items-center gap-4">
        <Menu
          className="w-6 h-6 text-gray-700 cursor-pointer"
          onClick={() => setDropdownMenu((prev) => !prev)}
        />
        {dropdownMenu && (
          <div className="absolute top-12 right-0 w-56 bg-white rounded-lg shadow-lg border border-gray-100 p-4 flex flex-col gap-3 animate-in fade-in slide-in-from-top-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.url;
              return (
                <Link
                  key={link.label}
                  href={link.url}
                  className={`flex items-center gap-3 px-2 py-2 rounded-md text-sm font-medium transition-all ${
                    isActive
                      ? "bg-blue-100 text-blue-700 shadow-sm"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setDropdownMenu(false)}
                >
                  <span className="text-[16px]">{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>
        )}
        <UserButton />
      </div>
    </header>
  );
};

export default TopBar;
