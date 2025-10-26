"use client";

import { useEffect, useState } from "react";
import { getUser, logoutUser } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function AccountPage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const u = getUser();
    if (!u) {
      router.push("/auth/login"); // ✅ nếu chưa đăng nhập thì chuyển về login
    } else {
      setUser(u);
    }
  }, [router]);

  const handleLogout = () => {
    logoutUser();
    router.push("/"); // ✅ đăng xuất xong quay về trang chủ
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md text-center">
        <img
          src={user.avatar || "/default-avatar.png"}
          alt="Avatar"
          className="w-24 h-24 mx-auto rounded-full object-cover mb-4"
        />
        <h2 className="text-2xl font-bold mb-2">{user.name}</h2>
        <p className="text-gray-600 mb-6">{user.email}</p>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Đăng xuất
        </button>
      </div>
    </div>
  );
}
