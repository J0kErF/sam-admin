"use client";

import { useEffect, useState } from "react";
import { Trash2, Plus, X } from "lucide-react";

type Category = {
  _id: string;
  name: string;
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCategories(data.categories);
    setLoading(false);
  };

  const addCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setMessage("Category name cannot be empty.");
      return;
    }

    const res = await fetch("/api/categories/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    const data = await res.json();

    if (res.ok) {
      setCategories((prev) => [...prev, data.category]);
      setMessage("✅ הוסף קטגוריה!");
      setName("");
      closeModal();
    } else {
      setMessage(data.message || "Error adding category.");
    }

    setTimeout(() => setMessage(""), 3000);
  };

  const deleteCategory = async (id: string) => {
    if (!confirm("האם אתה בטוח שרוצה למחוק קטגוריה זו?")) return;

    const res = await fetch("/api/categories", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setCategories((prev) => prev.filter((cat) => cat._id !== id));
    }
  };

  const closeModal = () => {
    setName("");
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">נהל קטגוריות</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
        >
          <Plus size={16} /> הוסף קטגוריה
        </button>
      </div>

      {message && (
        <div className="mb-4 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-2 rounded text-sm shadow">
          {message}
        </div>
      )}

      {loading ? (
        <p className="text-gray-500">טוען...</p>
      ) : categories.length === 0 ? (
        <p className="text-gray-500">לא נמצאו קטגוריות.</p>
      ) : (
        <div className="overflow-x-auto shadow rounded-md border border-gray-200">
          <table className="min-w-full bg-white text-sm">
            <thead className="bg-gray-100 text-gray-600 font-semibold">
              <tr>
                <th className="text-left px-4 py-3 border-b">#</th>
                <th className="text-left px-4 py-3 border-b">שם קטגוריה</th>
                <th className="text-left px-4 py-3 border-b">פעולות</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category, index) => (
                <tr key={category._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{index + 1}</td>
                  <td className="px-4 py-2 border-b">{category.name}</td>
                  <td className="px-4 py-2 border-b">
                    <button
                      onClick={() => deleteCategory(category._id)}
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
      )}

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={closeModal}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-md rounded-md p-6 shadow-lg relative"
          >
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
            <h2 className="text-lg font-semibold mb-4">הוסף קטגוריה</h2>
            <form onSubmit={addCategory} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="שם קטגוריה"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border border-gray-300 px-4 py-2 rounded focus:ring-2 focus:ring-blue-500"
                required
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded"
                >
                  הוסף
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="text-gray-500 hover:underline"
                >
                  ביטול
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
