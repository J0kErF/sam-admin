"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import ImageUpload from "@/components/custom ui/ImageUpload";
import { useRouter } from "next/navigation";

export default function AddPartPage() {
  const [form, setForm] = useState({
    name: "",
    modelYearFrom: "",
    modelYearTo: "",
    carCompanies: "",
    subMake: "",
    sellPrice: "",
    category: "",
  });

  const [providers, setProviders] = useState([{ providerName: "", price: "", barcode: "", quantity: "", location: "" }]);
  const [media, setMedia] = useState<string[]>([]);
  const [availableProviders, setAvailableProviders] = useState<string[]>([]);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);

  const router = useRouter();

  useEffect(() => {
    fetch("/api/providers")
      .then((res) => res.json())
      .then((data) => {
        const names = data.providers.map((prov: { companyName: string }) => prov.companyName);
        setAvailableProviders(names);
      });

    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        const names = data.categories.map((cat: { name: string }) => cat.name);
        setAvailableCategories(names);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (url: string) => {
    setMedia((prev) => [...prev, url]);
  };

  const handleImageRemove = (url: string) => {
    setMedia((prev) => prev.filter((img) => img !== url));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const yearFrom = parseInt(form.modelYearFrom);
    const yearTo = parseInt(form.modelYearTo);
    const modelYears = Array.from({ length: yearTo - yearFrom + 1 }, (_, i) => yearFrom + i);

    const res = await fetch("/api/part/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        sellPrice: parseFloat(form.sellPrice),
        modelYears,
        carCompanies: form.carCompanies.split(",").map((c) => c.trim()),
        media,
        providers: providers.map((p) => ({
          providerName: p.providerName,
          price: parseFloat(p.price),
          barcode: p.barcode,
          quantity: isNaN(parseInt(p.quantity)) ? 0 : parseInt(p.quantity),
          location: p.location || ""
        })),
      }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("חלק נוסף בהצלחה!");
      router.push(`/V2/parts/${data.part._id}`);

    }
    else alert("שגיאה: " + data.message);
  };

  const handleProviderChange = (
    index: number,
    field: 'providerName' | 'price' | 'barcode' | 'quantity' | 'location',
    value: string
  ) => {
    const updated = [...providers];
    updated[index][field] = value;
    setProviders(updated);
  };

  const addProvider = () => {
    setProviders([...providers, { providerName: "", price: "", barcode: "", quantity: "", location: "" }]);
  };

  const removeProvider = (index: number) => {
    setProviders(providers.filter((_, i) => i !== index));
  };

  return (
    <div className="p-4 sm:p-6 md:p-10 max-w-6xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800">הוסף חלק חדש</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white shadow rounded-xl p-4 sm:p-6">
            <div className="space-y-3">
              <input name="name" placeholder="שם החלק" onChange={handleChange} className="border p-3 rounded w-full" required />
              <input name="sellPrice" placeholder="מחיר מכירה" type="number" onChange={handleChange} className="border p-3 rounded w-full" required />
              <div className="flex gap-3">
                <input
                  type="number"
                  name="modelYearFrom"
                  placeholder="שנה מ"
                  onChange={handleChange}
                  className="border p-3 rounded w-full"
                />
                <input
                  type="number"
                  name="modelYearTo"
                  placeholder="שנה עד"
                  onChange={handleChange}
                  className="border p-3 rounded w-full"
                />
              </div>
              <input name="carCompanies" placeholder="חברת רכב (למשל: טויוטה)" onChange={handleChange} className="border p-3 rounded w-full" />
              <input name="subMake" placeholder="תת-מותג (למשל: קורולה)" onChange={handleChange} className="border p-3 rounded w-full" />
              <select name="category" onChange={handleChange} className="border p-3 rounded w-full">
                <option value="">בחר קטגוריה</option>
                {availableCategories.map((cat, idx) => (
                  <option key={idx} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-white shadow rounded-xl p-4 sm:p-6">
            <h3 className="font-semibold mb-3 text-gray-700">תמונות</h3>
            <ImageUpload value={media} onChange={handleImageChange} onRemove={handleImageRemove} />
          </div>
        </div>

        <div className="bg-white shadow rounded-xl p-4 sm:p-6">
          <h3 className="font-semibold mb-4 text-gray-700">ספקים</h3>
          {providers.map((prov, idx) => (
            <div key={idx} className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-4">
              <select
                value={prov.providerName}
                onChange={(e) => handleProviderChange(idx, "providerName", e.target.value)}
                className="border p-2 rounded w-full"
              >
                <option value="">בחר ספק</option>
                {availableProviders.map((name, index) => (
                  <option key={index} value={name}>{name}</option>
                ))}
              </select>
              <input
                placeholder="מחיר"
                type="number"
                value={prov.price}
                onChange={(e) => handleProviderChange(idx, "price", e.target.value)}
                className="border p-2 rounded w-full"
              />
              <input
                placeholder="ברקוד"
                value={prov.barcode}
                onChange={(e) => handleProviderChange(idx, "barcode", e.target.value)}
                className="border p-2 rounded w-full"
              />
              <input
                placeholder="כמות"
                type="number"
                value={prov.quantity}
                onChange={(e) => handleProviderChange(idx, "quantity", e.target.value)}
                className="border p-2 rounded w-full"
              />
              <div className="flex gap-2">
                <input
                  placeholder="מיקום"
                  value={prov.location}
                  onChange={(e) => handleProviderChange(idx, "location", e.target.value)}
                  className="border p-2 rounded w-full"
                />
                <button type="button" onClick={() => removeProvider(idx)} className="text-red-600 hover:underline text-sm">הסר</button>
              </div>
            </div>
          ))}
          <button type="button" onClick={addProvider} className="text-blue-600 hover:underline mt-2 text-sm">+ הוסף ספק</button>
        </div>

        <div className="flex justify-end">
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow">
            הוסף חלק
          </button>
        </div>
      </form>
    </div>
  );
}
