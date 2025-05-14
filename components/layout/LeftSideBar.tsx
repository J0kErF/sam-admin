"use client";

import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "@/lib/constants";

const LeftSideBar = () => {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 left-0 h-screen w-64 bg-gradient-to-b from-blue-100 to-blue-200 shadow-xl text-gray-800 flex flex-col z-30 max-lg:hidden">
      {/* Logo & Nav */}
      <div className="flex flex-col h-full overflow-y-auto px-6 py-8 gap-8">
        {/* Logo */}
        <div className="flex items-center justify-center">
          <Link href="/">
            <Image src="/icons/icon-512.png" alt="logo" width={60} height={60} />
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-2 flex-grow">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.url}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                pathname === link.url
                  ? "bg-blue-600 text-white font-semibold shadow-md"
                  : "text-gray-700 hover:bg-blue-500 hover:text-white"
              }`}
            >
              {link.icon}
              <span className="text-sm">{link.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* User Button */}
      <div className="px-6 py-4 bg-blue-800 rounded-t-lg text-white flex items-center gap-3">
        <UserButton />
        <span className="text-sm">הפרופיל שלי</span>
      </div>
    </aside>
  );
};

export default LeftSideBar;
