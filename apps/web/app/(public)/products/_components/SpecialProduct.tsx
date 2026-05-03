import { Card } from "@/components/ui/card";
import Image from "next/image";

const specialProducts = [
  { id: 1, image: "/special-product-1.webp" },
  { id: 2, image: "/special-product-2.webp" },
  { id: 3, image: "/special-product-3.webp" },
  { id: 4, image: "/special-product-4.webp" },
  { id: 5, image: "/special-product-5.webp" },
];

export default function SpecialProduct() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {specialProducts.map((product) => (
        <Card
          key={product.id}
          className="relative overflow-hidden bg-[#FAF6F0] border border-[#866544]/20 shadow-sm text-center flex flex-col items-center transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-[#CA9C60]/60 hover:bg-[#F5EDE0] group cursor-pointer h-full"
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
  );
}
