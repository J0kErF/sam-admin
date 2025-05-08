"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/result/${query}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex items-center justify-end gap-2">
      <Input
        type="text"
        placeholder="חפש מוצר או לקוח..."
        className="w-full sm:w-64 rtl text-right"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">
        חיפוש
      </Button>
    </form>
  );
}
