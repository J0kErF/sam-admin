// ✅ Professional Client Form UI: /app/parts/page.tsx
"use client";

import { useEffect, useState } from "react";
import ImageUpload from "@/components/custom ui/ImageUpload";

export default function AddPartPage() {
  const [form, setForm] = useState({
    name: "",
    modelYears: "",
    carCompanies: "",
    subMake: "",
    sellPrice: "",
    category: "",
    media: [] as string[],
  });

  const [locations, setLocations] = useState([{ location: "", quantity: "" }]);
  const [providers, setProviders] = useState([{ providerName: "", price: "", barcode: "" }]);

  const [availableProviders, setAvailableProviders] = useState<string[]>([]);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const res = await fetch("/api/parts/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        sellPrice: parseFloat(form.sellPrice),
        modelYears: form.modelYears.split(",").map(Number),
        carCompanies: form.carCompanies.split(","),
        locations: locations.map((l) => ({ location: l.location, quantity: parseInt(l.quantity) })),
        providers: providers.map((p) => ({ providerName: p.providerName, price: parseFloat(p.price), barcode: p.barcode })),
      }),
    });

    const data = await res.json();
    if (res.ok) alert("Part added successfully!");
    else alert("Error: " + data.message);
  };

  const handleLocationChange = (index: number, field: 'location' | 'quantity', value: string) => {
    const updated = [...locations];
    updated[index][field] = value;
    setLocations(updated);
  };

  const addLocation = () => {
    setLocations([...locations, { location: "", quantity: "" }]);
  };

  const handleProviderChange = (index: number, field: 'providerName' | 'price' | 'barcode', value: string) => {
    const updated = [...providers];
    updated[index][field] = value;
    setProviders(updated);
  };

  const addProvider = () => {
    setProviders([...providers, { providerName: "", price: "", barcode: "" }]);
  };

  const handleImageChange = (url: string) => {
    setForm((prev) => ({ ...prev, media: [...prev.media, url] }));
  };

  const handleImageRemove = (url: string) => {
    setForm((prev) => ({ ...prev, media: prev.media.filter((img) => img !== url) }));
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add New Part</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <input name="name" placeholder="Part Name" onChange={handleChange} className="border p-2 rounded" required />
        <input name="sellPrice" placeholder="Sell Price" type="number" onChange={handleChange} className="border p-2 rounded" required />
        <input name="modelYears" placeholder="Model Years (e.g. 2018,2019)" onChange={handleChange} className="border p-2 rounded" />
        <input name="carCompanies" placeholder="Car Company (e.g. Toyota)" onChange={handleChange} className="border p-2 rounded" />
        <input name="subMake" placeholder="Sub Make (e.g. Corolla)" onChange={handleChange} className="border p-2 rounded" />

        <select name="category" onChange={handleChange} className="border p-2 rounded" required>
          <option value="">Select Category</option>
          {availableCategories.map((cat, idx) => (
            <option key={idx} value={cat}>{cat}</option>
          ))}
        </select>

        <div>
          <h3 className="font-semibold">Images</h3>
          <ImageUpload
            value={form.media}
            onChange={handleImageChange}
            onRemove={handleImageRemove}
          />
        </div>

        <div>
          <h3 className="font-semibold">Locations</h3>
          {locations.map((loc, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input
                placeholder="Location"
                value={loc.location}
                onChange={(e) => handleLocationChange(idx, "location", e.target.value)}
                className="border p-2 flex-1 rounded"
              />
              <input
                type="number"
                placeholder="Quantity"
                value={loc.quantity}
                onChange={(e) => handleLocationChange(idx, "quantity", e.target.value)}
                className="border p-2 w-24 rounded"
              />
            </div>
          ))}
          <button type="button" onClick={addLocation} className="text-blue-600 underline">+ Add Location</button>
        </div>

        <div>
          <h3 className="font-semibold">Providers</h3>
          {providers.map((prov, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <select
                value={prov.providerName}
                onChange={(e) => handleProviderChange(idx, "providerName", e.target.value)}
                className="border p-2 flex-1 rounded"
              >
                <option value="">Select Provider</option>
                {availableProviders.map((name, index) => (
                  <option key={index} value={name}>{name}</option>
                ))}
              </select>
              <input
                placeholder="Price"
                type="number"
                value={prov.price}
                onChange={(e) => handleProviderChange(idx, "price", e.target.value)}
                className="border p-2 w-24 rounded"
              />
              <input
                placeholder="Barcode"
                value={prov.barcode}
                onChange={(e) => handleProviderChange(idx, "barcode", e.target.value)}
                className="border p-2 w-40 rounded"
              />
            </div>
          ))}
          <button type="button" onClick={addProvider} className="text-blue-600 underline">+ Add Provider</button>
        </div>

        <button type="submit" className="bg-blue-600 text-white p-3 rounded hover:bg-blue-700">Add Part</button>
      </form>
    </div>
  );
}