"use client";

import Link from "next/link";
import { useState } from "react";

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    price: number;
    images?: string[] | string | null;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);

  // Xử lý images có thể là array, string hoặc null
  const getImageUrl = () => {
    if (!product.images || imageError) return null;
    if (Array.isArray(product.images)) {
      return product.images[0] || null;
    }
    if (typeof product.images === "string") {
      return product.images || null;
    }
    return null;
  };

  const imageUrl = getImageUrl();

  return (
    <div className="border rounded-lg p-4 shadow hover:shadow-lg transition">
      <Link href={`/products/${product.id}`}>
        <div>
          <div className="w-full h-48 bg-gray-200 rounded flex items-center justify-center">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={product.name}
                className="w-full h-full object-cover rounded"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="text-gray-400 text-center">
                <svg
                  className="w-16 h-16 mx-auto mb-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-sm">Không có ảnh</p>
              </div>
            )}
          </div>
          <h2 className="mt-2 font-semibold">{product.name}</h2>
          <p className="text-blue-600 font-bold">{product.price.toLocaleString()} ₫</p>
        </div>
      </Link>
    </div>
  );
}
