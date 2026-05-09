"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { X } from "lucide-react";

const specialProducts = [
  { id: 1, image: "/special-product-1.webp" },
  { id: 2, image: "/special-product-2.webp" },
  { id: 3, image: "/special-product-3.webp" },
  { id: 4, image: "/special-product-4.webp" },
  { id: 5, image: "/special-product-5.webp" },
];

export default function SpecialProduct() {
  const [selectedImage, setSelectedImage] = useState<{
    src: string;
    name?: string;
  } | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {specialProducts.map((product) => (
          <Card
            key={product.id}
            className="relative overflow-hidden bg-[#FAF6F0] border border-[#866544]/20 shadow-sm text-center flex flex-col items-center transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-[#CA9C60]/60 hover:bg-[#F5EDE0] group cursor-pointer h-full"
            onClick={() =>
              product.image &&
              setSelectedImage({
                src: product.image,
                name: `Product ${product.id}`,
              })
            }
          >
            {/* Top gold strip */}
            <div className="absolute top-0 left-0 w-full h-4 bg-[#CA9C60]" />

            {/* Image area */}
            <div className="relative w-full h-72 bg-[#A0845C] overflow-hidden">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={`Product ${product.id}`}
                  fill
                  className="object-cover"
                  style={{
                    objectPosition: "center center",
                    transform: "scale(1.1)",
                    transformOrigin: "63% center",
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-b from-[#C4A882] to-[#8B6F4E] flex items-center justify-center">
                  <span className="text-white/50 text-xs">Product Image</span>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative flex items-center justify-center w-full h-full">
            <img
              src={selectedImage.src}
              alt={selectedImage.name || ""}
              className="object-contain max-w-[90vw] max-h-[90vh] w-auto h-auto block"
              onClick={(e) => e.stopPropagation()}
            />

            <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-md">
              <p className="text-sm font-bold tracking-widest">
                {selectedImage.name}
              </p>
            </div>

            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
