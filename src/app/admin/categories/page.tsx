// "use client";

// import { useEffect, useState } from "react";
// import { API_URL } from "@/lib/api";

// interface Category {
//   id: number;
//   name: string;
//   slug: string;
//   created_at: string;
// }

// export default function CategoriesPage() {
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [name, setName] = useState("");
//   const [slug, setSlug] = useState("");
//   const [editingId, setEditingId] = useState<number | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   const getAuthHeaders = () => {
//     const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;
//     const headers: Record<string, string> = { "Content-Type": "application/json" };
//     if (token) headers.Authorization = `Bearer ${token}`;
//     return headers;
//   };

//   // Lấy danh mục từ backend
//   const fetchCategories = async () => {
//     try {
//       setError(null);
//       const res = await fetch(`${API_URL}/categories`);
//       const data = await res.json();
//       setCategories(Array.isArray(data) ? data : []);
//     } catch (e: any) {
//       setError(e?.message || "Lỗi tải danh mục");
//     }
//   };

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   // Thêm hoặc cập nhật
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!name.trim()) return;

//     const payload = { name, slug };

//     if (editingId) {
//       await fetch(`${API_URL}/categories/${editingId}`, {
//         method: "PUT",
//         headers: getAuthHeaders(),
//         body: JSON.stringify(payload),
//       });
//     } else {
//       await fetch(`${API_URL}/categories`, {
//         method: "POST",
//         headers: getAuthHeaders(),
//         body: JSON.stringify(payload),
//       });
//     }

//     setName("");
//     setSlug("");
//     setEditingId(null);
//     fetchCategories();
//   };

//   // Xoá
//   const handleDelete = async (id: number) => {
//     if (confirm("Bạn có chắc muốn xoá danh mục này?")) {
//       await fetch(`${API_URL}/categories/${id}`, {
//         method: "DELETE",
//         headers: getAuthHeaders(),
//       });
//       fetchCategories();
//     }
//   };

//   // Chọn để sửa
//   const handleEdit = (cat: Category) => {
//     setName(cat.name);
//     setSlug(cat.slug);
//     setEditingId(cat.id);
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Quản lý Danh mục</h1>

//       {error && (
//         <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>
//       )}

//       {/* Form thêm/sửa */}
//       <form onSubmit={handleSubmit} className="space-y-3 mb-6">
//         <input
//           type="text"
//           placeholder="Tên danh mục"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           className="border rounded p-2 w-full"
//         />
//         {/* Ẩn nhập slug để backend tự tạo từ name */}
//         <button
//           type="submit"
//           className="bg-blue-600 text-white px-4 py-2 rounded"
//         >
//           {editingId ? "Cập nhật" : "Thêm mới"}
//         </button>
//       </form>

//       {/* Danh sách danh mục */}
//       <table className="w-full border">
//         <thead>
//           <tr className="bg-gray-100">
//             <th className="border p-2">ID</th>
//             <th className="border p-2">Tên</th>
//             {/* Ẩn cột slug */}
//             <th className="border p-2">Ngày tạo</th>
//             <th className="border p-2">Hành động</th>
//           </tr>
//         </thead>
//         <tbody>
//           {categories.map((cat) => (
//             <tr key={cat.id}>
//               <td className="border p-2">{cat.id}</td>
//               <td className="border p-2">{cat.name}</td>
//               {/* Ẩn slug */}
//               <td className="border p-2">
//                 {new Date(cat.created_at).toLocaleDateString()}
//               </td>
//               <td className="border p-2 space-x-2">
//                 <button
//                   onClick={() => handleEdit(cat)}
//                   className="bg-yellow-500 text-white px-2 py-1 rounded"
//                 >
//                   Sửa
//                 </button>
//                 <button
//                   onClick={() => handleDelete(cat.id)}
//                   className="bg-red-600 text-white px-2 py-1 rounded"
//                 >
//                   Xoá
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// Thay thế toàn bộ file front-end/src/app/admin/categories/page.tsx
"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/lib/api";
import { fetchWithAdminAuth } from "@/lib/adminAuth";

interface Category {
  id: number;
  name: string;
  slug: string;
  created_at: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getAuthHeaders = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;
    return headers;
  };

  // Lấy danh mục từ backend
  const fetchCategories = async () => {
    try {
      setError(null);
      const res = await fetchWithAdminAuth(`${API_URL}/categories`);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setError(e?.message || "Lỗi tải danh mục");
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Thêm hoặc cập nhật
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      const payload = { name, slug };

      let res;
      if (editingId) {
        res = await fetchWithAdminAuth(`${API_URL}/categories/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetchWithAdminAuth(`${API_URL}/categories`, {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errorText}`);
      }

      setName("");
      setSlug("");
      setEditingId(null);
      await fetchCategories();
    } catch (err: any) {
      setError(err?.message || "Lỗi khi lưu danh mục");
    } finally {
      setLoading(false);
    }
  };

  // Xoá
  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xoá danh mục này?")) return;
    
    setLoading(true);
    try {
      const res = await fetchWithAdminAuth(`${API_URL}/categories/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errorText}`);
      }

      await fetchCategories();
    } catch (err: any) {
      setError(err?.message || "Lỗi khi xóa danh mục");
    } finally {
      setLoading(false);
    }
  };

  // Chọn để sửa
  const handleEdit = (cat: Category) => {
    setName(cat.name);
    setSlug(cat.slug);
    setEditingId(cat.id);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Quản lý Danh mục</h1>

      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>
      )}

      {/* Form thêm/sửa */}
      <form onSubmit={handleSubmit} className="space-y-3 mb-6">
        <input
          type="text"
          placeholder="Tên danh mục"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border rounded p-2 w-full"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-2 rounded text-white ${loading ? "bg-gray-400" : "bg-blue-600"}`}
        >
          {loading ? "Đang xử lý..." : editingId ? "Cập nhật" : "Thêm mới"}
        </button>
      </form>

      {/* Danh sách danh mục */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">ID</th>
            <th className="border p-2">Tên</th>
            <th className="border p-2">Ngày tạo</th>
            <th className="border p-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.id}>
              <td className="border p-2">{cat.id}</td>
              <td className="border p-2">{cat.name}</td>
              <td className="border p-2">
                {new Date(cat.created_at).toLocaleDateString()}
              </td>
              <td className="border p-2 space-x-2">
                <button
                  onClick={() => handleEdit(cat)}
                  disabled={loading}
                  className="bg-yellow-500 text-white px-2 py-1 rounded disabled:opacity-50"
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  disabled={loading}
                  className="bg-red-600 text-white px-2 py-1 rounded disabled:opacity-50"
                >
                  Xoá
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}