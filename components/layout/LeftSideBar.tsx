"use client";

import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "@/lib/constants";

const LeftSideBar = () => {
  const pathname = usePathname();

  return (
    <aside className="h-screen sticky top-0 left-0 w-64 bg-white shadow-xl border-r border-gray-200 flex flex-col justify-between px-6 py-8">
      {/* Logo */}
      <div className="flex justify-center">
        <Link href="/" className="hover:opacity-90 transition">
          <Image src="/logo.png" alt="logo" width={60} height={40} />
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col gap-3 mt-12">
        {navLinks.map((link) => {
          const isActive = pathname === link.url;
          return (
            <Link
              key={link.label}
              href={link.url}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                isActive
                  ? "bg-blue-100 text-blue-700 shadow-sm"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span className="text-[18px]">{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="flex items-center gap-3 border-t pt-4 mt-10">
        <UserButton />
        <span className="text-sm text-gray-700">הפרופיל שלי</span>
      </div>
    </aside>
  );
};

export default LeftSideBar;
