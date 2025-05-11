"use client";

import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { navLinks } from "@/lib/constants";

const LeftSideBar = () => {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 left-0 h-screen min-w-[230px] bg-blue-100 text-white flex flex-col justify-between px-6 py-8 shadow-xl z-30 max-lg:hidden">
      {/* Logo */}
      <div className="flex flex-col gap-10">
        <Link href="/" className="flex items-center justify-center">
          <Image src="/icons/icon-512.png" alt="logo" width={60} height={60} />
        </Link>

        {/* Nav Links */}
        <nav className="flex flex-col gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.url}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                pathname === link.url
                  ? "bg-blue-600 text-white font-semibold"
                  : "text-gray-700 hover:bg-blue-500 hover:text-white"
              }`}
            >
              {link.icon}
              <span className="text-sm">{link.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* User section */}
      <div className="mt-6 flex items-center gap-3 px-4 py-3 bg-blue-800 rounded-lg">
        <UserButton />
        <span className="text-sm text-white">הפרופיל שלי</span>
      </div>
    </aside>
  );
};

export default LeftSideBar;
