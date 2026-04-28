import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Home",
  description: "Welcome to KWWI",
};

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section
        className="relative h-screen flex items-center bg-cover bg-center"
        style={{ backgroundImage: "url('/hero-bg.png')" }}
      >
        {/* Black 50% Tint Overlay */}
        <div className="absolute inset-0 bg-black/50 z-0"></div>

        {/* Seamless Gradient Fade at the Bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#866544] to-transparent z-0"></div>

        {/* Content (z-10 keeps it above the tint and gradient) */}
        {/* Added container class so the left alignment matches the navbar/footer */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 flex h-full flex-col justify-center items-start text-white">
          {/* Badge */}
          <div className="mb-4">
            <Badge className="rounded-[15px] bg-white/10 text-white border-white/30 backdrop-blur p-3.75 text-sm">
              Export-Grade Wood Manufacturing
            </Badge>
          </div>

          {/* Heading */}
          <h1 className="mb-1.75 max-w-6xl text-3xl font-semibold leading-tight md:text-6xl drop-shadow-lg text-left">
            High Performance <br />
            Finger-Jointed Laminated Board
          </h1>

          {/* Description */}
          <p className="mb-8 max-w-4xl text-sm md:text-base text-white/90 text-left">
            Delivering consistent quality for furniture and construction
            industries across Japan, Korea, and beyond.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4 justify-start">
            <Badge
              asChild
              className="rounded-[15px] bg-white/10 text-white border-white/30 backdrop-blur p-3.75 text-sm hover:bg-white/20 hover:text-white"
            >
              <Link href="/about">• Learn More</Link>
            </Badge>

            <Badge
              asChild
              className="rounded-[15px] bg-white/10 text-white border-white/30 backdrop-blur p-3.75 text-sm hover:bg-white/20 hover:text-white"
            >
              <Link href="/products">• View Our Products</Link>
            </Badge>
          </div>
        </div>
      </section>
    </div>
  );
}
