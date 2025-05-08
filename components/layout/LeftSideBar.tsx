"use client";

import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { navLinks } from "@/lib/constants";

const LeftSideBar = () => {
  const pathname = usePathname();

  return (
    <div className="hidden lg:flex h-screen w-64 flex-col justify-between px-6 py-10 bg-blue-2 shadow-lg text-white">
      {/* Logo */}
      <Link href="/" className="flex justify-center mb-10">
        <Image src="/logo.png" alt="logo" width={70} height={40} />
      </Link>

      {/* Navigation Links */}
      <div className="flex flex-col gap-6">
        {navLinks.map((link) => {
          const isActive = pathname === link.url;
          return (
            <Link
              href={link.url}
              key={link.label}
              className={`flex items-center gap-3 px-4 py-2 rounded-md transition-colors duration-200 ${
                isActive
                  ? "bg-white text-blue-2 font-semibold"
                  : "text-white hover:bg-white/10"
              }`}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>

      {/* User Profile */}
      <div className="flex items-center gap-3 px-4 py-2 mt-10 bg-white/10 rounded-md">
        <UserButton />
        <span className="text-sm">הפרופיל שלי</span>
      </div>
    </div>
  );
};

export default LeftSideBar;
