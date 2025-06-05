"use client";

import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "@/lib/constants";
import { useEffect, useState } from "react";
import { RefreshCcw } from "lucide-react";


type Note = {
  _id: string;
  type?: string;
  notifyAt?: string;
  done?: boolean;
  seen?: boolean;
};

const LeftSideBar = () => {
  const pathname = usePathname();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await fetch("/api/notes");
        const data = await res.json();
        setNotes(data);
      } catch (err) {
        console.error("Failed to fetch notes", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();

    // Optional: refresh every 30 seconds
    const interval = setInterval(fetchNotes, 30000);
    return () => clearInterval(interval);
  }, []);
  let indicatorColor: string | null = null;
  let indicatorTooltip = "";

  if (!loading) {
    const hasExceeded = notes.some(
      note =>
        note.type === "תזכורת" &&
        note.notifyAt &&
        new Date(note.notifyAt) <= new Date() &&
        !note.done
    );
    const hasUnseen = notes.some(note => !note.seen);
    const hasUndone = notes.some(note => !note.done);

    if (hasExceeded) {
      indicatorColor = "bg-red-500";
      indicatorTooltip = "יש תזכורות שפג תוקפן ועדיין לא טופלו";
    } else if (hasUnseen) {
      indicatorColor = "bg-blue-500";
      indicatorTooltip = "יש פתקים שעדיין לא נצפו";
    } else if (hasUndone) {
      indicatorColor = "bg-yellow-400";
      indicatorTooltip = "יש פתקים שממתינים לטיפול";
    } else {
      indicatorColor = "bg-green-500";
      indicatorTooltip = "כל הפתקים טופלו ונצפו";
    }
  }

  return (
    <aside className="sticky top-0 left-0 h-screen w-64 bg-white border-r shadow-md flex flex-col justify-between z-30 max-lg:hidden">
      {/* Logo & Navigation */}
      <div className="flex flex-col gap-6 p-6">
        {/* Logo */}
        <div className="flex justify-center items-center mb-4 relative">
          <Link href="/" className="relative">
            <Image src="/icons/icon-512.png" alt="logo" width={48} height={48} />

          </Link>
          {indicatorColor && (
            <span
              className={`absolute -top-1 -right-0 w-4 h-4 rounded-full border border-white ${indicatorColor}`}
              title={indicatorTooltip}
            />
          )}
          <RefreshCcw
            className="absolute -bottom-1 right-0 w-4 h-4 text-gray-500 hover:text-blue-600 cursor-pointer"
            onClick={() => window.location.reload()}
          />
        </div>





        {/* Nav Links */}
        <nav className="flex flex-col gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.url;
            return (
              <Link
                key={link.label}
                href={link.url}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all ${isActive
                  ? "bg-blue-600 text-white font-semibold"
                  : "text-gray-700 hover:bg-blue-100 hover:text-blue-600"
                  }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Section */}
      <div className="flex items-center gap-3 bg-blue-50 border-t px-6 py-4">
        <UserButton />
        <div className="flex-1">
          <p className="text-sm text-gray-800 font-medium">הפרופיל שלי</p>
        </div>
      </div>
    </aside>
  );
};

export default LeftSideBar;
