"use client";

import { useEffect, useState } from "react";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Download } from "lucide-react";
import { navLinks } from "@/lib/constants";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
};

const TopBar = () => {
  const [dropdownMenu, setDropdownMenu] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const pathname = usePathname();

  // Register service worker
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then(() => console.log("✅ Service Worker Registered"))
        .catch((err) => console.error("❌ SW Registration Failed", err));
    }
  }, []);

  // Listen for the install prompt
  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  // Handle PWA install
  const handleInstall = () => {
    if (installPrompt) {
      installPrompt.prompt();
      installPrompt.userChoice.then(() => setInstallPrompt(null));
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full flex justify-between items-center px-4 py-3 bg-white shadow-md border-b border-gray-200 lg:hidden">
      {/* Logo */}
      <Link href="/" className="hover:opacity-90 transition">
        <Image src="/icons/icon-192.png" alt="logo" width={50} height={50} />
      </Link>

      {/* Install + Menu + User */}
      <div className="relative flex items-center gap-4">


        <Menu
          className="w-6 h-6 text-gray-700 cursor-pointer"
          onClick={() => setDropdownMenu((prev) => !prev)}
        />

        {dropdownMenu && (
          <div className="absolute top-12 right-0 w-56 bg-white rounded-xl shadow-xl border border-gray-100 p-4 flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 rtl">
            {installPrompt && (
              <button
                onClick={handleInstall}
                className="flex items-center justify-end gap-3 px-2 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all"
              >
                <span>התקן אפליקציה</span>
                <Download className="w-5 h-5" />
              </button>
            )}

            {navLinks.map((link) => {
              const isActive = pathname === link.url;
              return (
                <Link
                  key={link.label}
                  href={link.url}
                  onClick={() => setDropdownMenu(false)}
                  className={`flex items-center justify-end gap-3 px-2 py-2 rounded-md text-sm font-medium transition-all ${isActive
                      ? "bg-blue-100 text-blue-700 shadow-sm"
                      : "text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  <span>{link.label}</span>
                  <span className="text-[18px]">{link.icon}</span>
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
