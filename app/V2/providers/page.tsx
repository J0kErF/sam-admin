"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2, X, Plus } from "lucide-react";

type Provider = {
  _id: string;
  companyName: string;
  address: string;
  phoneNumber: string;
  email: string;
  contactName: string;
  notes: string;
};

export default function ProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [providerToDelete, setProviderToDelete] = useState<Provider | null>(null);

  const [form, setForm] = useState({
    companyName: "",
    address: "",
    phoneNumber: "",
    email: "",
    contactName: "",
    notes: "",
  });

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    const res = await fetch("/api/providers");
    const data = await res.json();
    setProviders(data.providers);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = editId ? `/api/providers/${editId}` : "/api/providers/add";
    const method = editId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      const data = await res.json();
      if (editId) {
        setProviders((prev) => prev.map((p) => (p._id === editId ? data.provider : p)));
      } else {
        setProviders((prev) => [...prev, data.provider]);
      }
      closeModal();
    }
  };

  const startEdit = (provider: Provider) => {
    setForm({ ...provider });
    setEditId(provider._id);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setForm({
      companyName: "",
      address: "",
      phoneNumber: "",
      email: "",
      contactName: "",
      notes: "",
    });
    setEditId(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditId(null);
    setForm({
      companyName: "",
      address: "",
      phoneNumber: "",
      email: "",
      contactName: "",
      notes: "",
    });
  };

  const confirmDelete = async (id: string) => {
    const res = await fetch("/api/providers", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setProviders((prev) => prev.filter((p) => p._id !== id));
    }

    setProviderToDelete(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">ניהול ספקים</h1>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
        >
          <Plus size={16} /> הוסף ספק
        </button>
      </div>

      <div className="overflow-x-auto shadow-md rounded border border-gray-200">
        <table className="min-w-full text-sm bg-white text-center">
          <thead className="bg-gray-100 text-gray-700 font-semibold">
            <tr>
              <th className="px-4 py-3 border-b">חברה</th>
              <th className="px-4 py-3 border-b">איש קשר</th>
              <th className="px-4 py-3 border-b">טלפון</th>
              <th className="px-4 py-3 border-b">אימייל</th>
              <th className="px-4 py-3 border-b">הערות</th>
              <th className="px-4 py-3 border-b">פעולות</th>
            </tr>
          </thead>
          <tbody>
            {providers.map((p) => (
              <tr key={p._id} className="hover:bg-gray-50 border-b transition">
                <td className="px-4 py-2 text-center">{p.companyName}</td>
                <td className="px-4 py-2 text-center">{p.contactName}</td>
                <td className="px-4 py-2 text-center">{p.phoneNumber}</td>
                <td className="px-4 py-2 text-center">{p.email}</td>
                <td className="px-4 py-2 text-center">{p.notes}</td>
                <td className="px-4 py-2 flex justify-center gap-2">
                  <button
                    onClick={() => startEdit(p)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Edit"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => setProviderToDelete(p)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={closeModal}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-2xl rounded-lg p-6 shadow-lg relative"
          >
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-semibold mb-4">
              {editId ? "עדכון ספק" : "הוסף ספק חדש"}
            </h2>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="companyName" placeholder="שם החברה" value={form.companyName} onChange={handleChange} className="border px-4 py-2 rounded focus:ring-2 focus:ring-blue-500" required />
              <input name="address" placeholder="כתובת" value={form.address} onChange={handleChange} className="border px-4 py-2 rounded focus:ring-2 focus:ring-blue-500" />
              <input name="phoneNumber" placeholder="מספר טלפון" value={form.phoneNumber} onChange={handleChange} className="border px-4 py-2 rounded focus:ring-2 focus:ring-blue-500" />
              <input name="email" placeholder="אימייל" value={form.email} onChange={handleChange} className="border px-4 py-2 rounded focus:ring-2 focus:ring-blue-500" />
              <input name="contactName" placeholder="שם איש קשר" value={form.contactName} onChange={handleChange} className="border px-4 py-2 rounded focus:ring-2 focus:ring-blue-500" />
              <textarea name="notes" placeholder="הערות" value={form.notes} onChange={handleChange} rows={3} className="md:col-span-2 border px-4 py-2 rounded focus:ring-2 focus:ring-blue-500" />
              <div className="md:col-span-2 flex gap-4 mt-2 justify-end">
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-medium">שמור</button>
                <button type="button" onClick={closeModal} className="text-gray-500 hover:underline">ביטול</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {providerToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setProviderToDelete(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white max-w-md w-full p-6 rounded-md shadow-lg relative"
          >
            <button
              onClick={() => setProviderToDelete(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-semibold text-red-600 mb-2">מחק ספק</h2>
            <p className="text-sm text-gray-700 mb-4">
              האם אתה בטוח שברצונך למחוק את <span className="font-semibold text-black">{providerToDelete.companyName}</span>?
            </p>
            <div className="flex justify-end gap-4">
              <button onClick={() => setProviderToDelete(null)} className="text-gray-500 hover:underline">ביטול</button>
              <button onClick={() => confirmDelete(providerToDelete._id)} className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded">כן, מחק</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
