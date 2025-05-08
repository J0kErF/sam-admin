"use client";

import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "@/lib/constants";

const LeftSideBar = () => {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col justify-between w-64 h-screen px-6 py-8 bg-[#1F2937] text-white shadow-xl">
      {/* Logo */}
      <div className="flex justify-center mb-10">
        <Link href="/">
          <Image src="/logo.png" alt="logo" width={60} height={60} className="rounded-md hover:opacity-90 transition" />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-3">
        {navLinks.map((link) => {
          const isActive = pathname === link.url;
          return (
            <Link
              key={link.label}
              href={link.url}
              className={`flex items-center gap-3 px-4 py-2 rounded-md transition-all duration-200 ${
                isActive
                  ? "bg-white text-blue-700 font-semibold shadow"
                  : "hover:bg-gray-700 hover:text-white"
              }`}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Info */}
      <div className="flex items-center gap-3 px-4 py-3 mt-10 rounded-lg bg-gray-700/50 backdrop-blur-sm">
        <UserButton afterSignOutUrl="/" />
        <span className="text-sm font-medium text-white">הפרופיל שלי</span>
      </div>
    </aside>
  );
};

export default LeftSideBar;
