"use client";

import { useEffect, useState } from "react";
import { getUser, setAuth, logoutUser } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function EditAccountPage() {
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    const u = getUser();
    if (!u) {
      router.push("/auth/login"); // chưa đăng nhập thì chuyển về login
    } else {
      setName(u.name || "");
      setAvatar(u.avatar || "");
    }
  }, [router]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const user = getUser();
    if (!user) return;

    const updatedUser = {
      ...user,
      name,
      avatar,
      // mật khẩu thường nên gửi backend, ở đây demo nên chỉ update frontend
      password: password || user.password,
    };

    // Lưu lại user mới vào localStorage
    setAuth(localStorage.getItem("token") || "", updatedUser);

    alert("Cập nhật thông tin thành công!");
    router.push("/account"); // quay lại trang profile
  };

  const handleLogout = () => {
    logoutUser();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <form
        onSubmit={handleSave}
        className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Chỉnh sửa thông tin cá nhân
        </h2>

        {/* Avatar */}
        <div className="mb-4 text-center">
          <img
            src={avatar || "/default-avatar.png"}
            alt="Avatar"
            className="w-24 h-24 mx-auto rounded-full object-cover mb-2"
          />
          <input
            type="text"
            placeholder="URL ảnh avatar"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            className="w-full p-3 border rounded-lg"
          />
        </div>

        {/* Tên */}
        <input
          type="text"
          placeholder="Tên của bạn"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 mb-4 border rounded-lg"
          required
        />

        {/* Mật khẩu */}
        <input
          type="password"
          placeholder="Mật khẩu mới (tùy chọn)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-6 border rounded-lg"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
        >
          Lưu thay đổi
        </button>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition mt-3"
        >
          Đăng xuất
        </button>
      </form>
    </div>
  );
}
