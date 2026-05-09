"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { X } from "lucide-react";

export default function AboutInteractive({
  processCards,
}: {
  processCards: Array<{
    number: string | number;
    image: string;
    title: string;
    description: string;
  }>;
}) {
  const [selectedImage, setSelectedImage] = useState<{
    src: string;
    name?: string;
  } | null>(null);

  return (
    <>
      {processCards.map((item) => (
        <Card
          key={item.number}
          className="relative overflow-hidden bg-[#EEEAE4] border border-[#866544]/20 shadow-sm flex flex-col transition-all duration-300 ease-in-out group cursor-pointer hover:-translate-y-1 hover:border-[#CA9C60]/60 hover:bg-[#E8E2D8]"
          onClick={() =>
            item.image &&
            setSelectedImage({ src: item.image, name: item.title })
          }
        >
          <div className="absolute top-0 left-0 w-full h-1.5 bg-[#CA9C60]" />
          <div className="relative w-full aspect-[4/3] bg-[#D9D4CC] mt-1.5">
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col gap-3 px-5 py-5">
            <div className="flex items-start gap-3">
              <span className="text-4xl font-bold text-[#CA9C60]/30 leading-none shrink-0">
                {item.number}
              </span>
              <h3 className="text-[#5C3D1E] text-base font-bold underline underline-offset-2 decoration-[#CA9C60] leading-snug">
                {item.title}
              </h3>
            </div>
            <p className="text-[#7A5C3A] text-sm leading-relaxed text-justify">
              {item.description}
            </p>
          </div>
        </Card>
      ))}

      {/* Fullscreen Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          {/* Remove stopPropagation from the full-size wrapper */}
          <div className="relative flex items-center justify-center w-full h-full">
            {/* Wrap only the image in a relative container and stop propagation here */}
            <div
              className="relative max-w-[90vw] max-h-[90vh] w-auto h-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage.src}
                alt={selectedImage.name}
                className="object-contain max-w-[90vw] max-h-[90vh] w-auto h-auto block"
              />
            </div>

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
