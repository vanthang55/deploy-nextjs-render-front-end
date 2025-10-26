// app/admin/layout.tsx
"use client";

import { useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth";
import { usePathname, useRouter } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [adminUser, setAdminUser] = useState<any>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {  
    try {
      const data = localStorage.getItem("adminUser");
      setAdminUser(data ? JSON.parse(data) : null);
    } catch {
      setAdminUser(null);
    }
    const onChange = () => {
      try {
        const data = localStorage.getItem("adminUser");
        setAdminUser(data ? JSON.parse(data) : null);
      } catch {
        setAdminUser(null);
      }
    };
    window.addEventListener("adminAuthChange", onChange);
    setInitialized(true);
    return () => window.removeEventListener("adminAuthChange", onChange);
  }, []);

  const effectiveUser = user || adminUser;
  useEffect(() => {
    // Nếu đang ở trang login thì không cần kiểm tra auth
    if (pathname === "/admin/login") {
      return;
    }
    
    // Nếu chưa đăng nhập hoặc không phải admin -> chuyển hướng login riêng của admin
    if (initialized && (!effectiveUser || effectiveUser?.role !== "admin")) {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("redirectAfterLogin", pathname || "/admin");
      }
      router.replace("/admin/login");
    }
  }, [initialized, effectiveUser, router, pathname]);

  // Không revalidate token trên mỗi trang admin để tránh buộc đăng nhập lại

  // Nếu đang ở trang login thì render children trực tiếp (không sidebar)
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (!initialized) {
    return null;
  }

  if (!effectiveUser || effectiveUser?.role !== "admin") {
    return null;
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar admin */}
      <aside className="w-64 bg-gray-800 text-white p-6 space-y-4">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
        <nav className="space-y-2">
          <a href="/admin/dashboard" className="block hover:bg-gray-700 p-2 rounded">🏠 Dashboard</a>
          <a href="/admin/categories" className="block hover:bg-gray-700 p-2 rounded">📂 Categories</a>
          <a href="/admin/products" className="block hover:bg-gray-700 p-2 rounded">📦 Products</a>
          <a href="/admin/orders" className="block hover:bg-gray-700 p-2 rounded">🛒 Orders</a>
          <a href="/admin/users" className="block hover:bg-gray-700 p-2 rounded">👤 Users</a>
          <a href="/admin/reviews" className="block hover:bg-gray-700 p-2 rounded">⭐ Reviews</a>
          <a href="/admin/charts" className="block hover:bg-gray-700 p-2 rounded">📈 Charts</a>
          <a href="/admin/test-tools" className="block hover:bg-gray-700 p-2 rounded">🧪 Test Tools</a>
        </nav>
      </aside>

      {/* Nội dung chính */}
      <main className="flex-1 p-8 bg-gray-100">{children}</main>
    </div>
  );
}
