"use client";

import { useEffect, useState } from "react";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, RefreshCcw } from "lucide-react";
import { navLinks } from "@/lib/constants";
import { NoteType } from "@/lib/models/Note";

type Note = {
  _id: string;
  title: string;
  content?: string;
  type?: NoteType;
  createdAt?: string;
  notifyAt?: string;
  done?: boolean;
  seen?: boolean;
};

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
};

const TopBar = () => {
  const [dropdownMenu, setDropdownMenu] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await fetch("/api/notes");
        const data = await res.json();
        setNotes(data);
      } catch (err) {
        console.error("Failed to fetch notes");
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  let indicatorColor = "";
  let indicatorTooltip = "טוען סטטוס...";

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
    <header className="sticky top-0 z-30 w-full flex justify-between items-center px-4 py-3 bg-white shadow-md border-b border-gray-200 lg:hidden">
      {/* Logo & Indicator */}
      <Link href="/" className="relative flex items-center gap-2">
        <Image src="/icons/icon-192.png" alt="logo" width={50} height={50} />
        {indicatorColor && (
          <span
            className={`w-3.5 h-3.5 rounded-full border border-white ${indicatorColor}`}
            title={indicatorTooltip}
          />
        )}
        <RefreshCcw
          className="w-4 h-4 text-gray-600 hover:text-blue-600 transition cursor-pointer"
          onClick={() => window.location.reload()}
        />
      </Link>

      {/* Install + Menu + User */}
      <div className="relative flex items-center gap-4">
        <Menu
          className="w-6 h-6 text-gray-700 cursor-pointer"
          onClick={() => setDropdownMenu((prev) => !prev)}
        />

        {dropdownMenu && (
          <div className="absolute top-12 right-0 w-56 bg-white rounded-xl shadow-xl border border-gray-100 p-4 flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 rtl">
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
