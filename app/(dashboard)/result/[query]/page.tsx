import { notFound } from "next/navigation";

export default async function SearchResult({ params }: { params: { query: string } }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/search/${params.query}`, {
    cache: "no-store",
  });

  if (!res.ok) return notFound();

  const results = await res.json();
  if (!results?.length) return notFound();

  return (
    <div className="p-6 max-w-screen-lg mx-auto">
      <h1 className="text-2xl font-bold text-right mb-4">
        תוצאות חיפוש עבור: {decodeURIComponent(params.query)}
      </h1>

      <ul className="space-y-4">
        {results.map((item: any) => (
          <li
            key={item._id}
            className="bg-white rounded-xl shadow p-4 border text-right"
          >
            <p className="font-semibold">{item.title || item.name}</p>
            <p className="text-sm text-gray-600">{item.description || item.email || "—"}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
