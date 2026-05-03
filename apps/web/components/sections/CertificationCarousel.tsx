"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, BadgeCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import Image from "next/image";

const certificateImages = [
  { src: "/cert-1.webp", alt: "SVLK Certificate" },
  { src: "/cert-2.webp", alt: "TLAS Certificate" },
];

const certifications = [
  {
    title: "SVLK / TLAS Certified",
    description: "With VLHH-36-12-0008 registration number",
  },
  {
    title: "Export Licensed",
    description: "Indonesian Ministry of Trade Approved",
  },
];

export default function CertificationCarousel() {
  const [current, setCurrent] = useState(0);

  // Auto-advance every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % certificateImages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const prev = () =>
    setCurrent(
      (p) => (p - 1 + certificateImages.length) % certificateImages.length,
    );
  const next = () => setCurrent((p) => (p + 1) % certificateImages.length);

  return (
    <section className="bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-10">
          {/* Carousel */}
          <div className="relative w-full lg:w-1/2 aspect-[4/3] bg-[#F5F5F0] rounded-2xl overflow-hidden flex items-center justify-center border border-[#866544]/20 shadow-sm">
            {/* Placeholder — replace with <Image> when ready */}
            <Image
              src={certificateImages[current].src}
              alt={certificateImages[current].alt}
              fill
              className="object-contain transition-opacity duration-500"
            />

            {/* Left arrow */}
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition z-10"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Right arrow */}
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition z-10"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {certificateImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    i === current ? "bg-[#CA9C60]" : "bg-[#CA9C60]/30"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Certification Cards */}
          <div className="flex flex-col gap-5 w-full lg:w-1/2">
            {certifications.map((cert) => (
              <Card
                key={cert.title}
                className="flex flex-row items-center gap-4 px-5 py-5 bg-[#FAF6F0] border border-[#866544]/20 rounded-2xl shadow-sm"
              >
                {/* Left gold strip */}
                <div className="w-1 self-stretch bg-[#CA9C60] rounded-full shrink-0" />

                {/* Icon */}
                <div className="bg-[#CA9C60] rounded-full p-2.5 shrink-0">
                  <BadgeCheck className="text-white w-6 h-6" />
                </div>

                {/* Text */}
                <div className="flex flex-col">
                  <p className="text-[#866544] font-bold text-sm">
                    {cert.title}
                  </p>
                  <p className="text-[#866544] text-sm leading-snug">
                    {cert.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
