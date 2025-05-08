"use client";

import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "@/lib/constants";

const LeftSideBar = () => {
  const pathname = usePathname();

  return (
    <aside className="h-screen sticky top-0 left-0 flex flex-col justify-between bg-blue-2 px-6 py-10 shadow-xl max-lg:hidden">
      {/* Logo */}
      <div className="flex items-center justify-center">
        <Link href="/" className="hover:opacity-80 transition">
          <Image src="/logo.png" alt="logo" width={80} height={40} />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-6 mt-10">
        {navLinks.map((link) => {
          const isActive = pathname === link.url;
          return (
            <Link
              href={link.url}
              key={link.label}
              className={`flex items-center gap-4 px-4 py-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-white text-blue-600 shadow-md"
                  : "text-white hover:bg-blue-1/20"
              }`}
            >
              <span className="text-xl">{link.icon}</span>
              <span className="text-base font-medium">{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="flex items-center gap-4 px-4 py-3 bg-blue-1/10 rounded-lg text-white mt-auto">
        <UserButton />
        <span className="text-sm">הפרופיל שלי</span>
      </div>
    </aside>
  );
};

export default LeftSideBar;
