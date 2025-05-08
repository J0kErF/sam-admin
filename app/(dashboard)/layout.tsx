import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { ClerkProvider } from "@clerk/nextjs";

import LeftSideBar from "@/components/layout/LeftSideBar";
import TopBar from "@/components/layout/TopBar";
import { ToasterProvider } from "@/lib/ToasterProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "סמיח מזגנים - מערכת ניהול",
  keywords: ["סמיח מזגנים", "מערכת ניהול", "סמיח", "מזגנים"],
  description: "Admin dashboard to manage sameeh mazganem's data",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} bg-white`}>
          <ToasterProvider />
          <div className="flex min-h-screen">
            <LeftSideBar />
            <div className="flex-1 flex flex-col">
              <TopBar />
              <main className="flex-1 p-4 overflow-y-auto">{children}</main>
            </div>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
