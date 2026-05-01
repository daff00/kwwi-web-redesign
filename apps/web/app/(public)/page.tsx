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
      {/* Hero */}
      <section className="relative h-screen flex items-center bg-cover bg-center" style={{ backgroundImage: "url('/hero-bg.webp')" }}>
        <div className="absolute inset-0 bg-black/50 z-0" />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#866544] to-transparent z-0" />
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 flex h-full flex-col justify-center items-start text-white">
          <div className="mb-4">
            <Badge className="rounded-[15px] bg-white/10 text-white border-white/30 backdrop-blur p-3.75 text-sm">
              Export-Grade Wood Manufacturing
            </Badge>
          </div>
          <h1 className="mb-1.75 max-w-6xl text-3xl font-semibold leading-tight md:text-6xl drop-shadow-lg">
            High Performance <br /> Finger-Jointed Laminated Boards
          </h1>
          <p className="mb-8 max-w-4xl text-sm md:text-base text-white/90">
            Delivering consistent quality for furniture and construction industries across Japan, South Korea, and beyond. Built on experience, driven by quality since 1998.
          </p>
          <div className="flex flex-wrap gap-4">
            {[{ label: "Learn More", href: "#company-overview" }, { label: "View Our Products", href: "/products" }].map(({ label, href }) => (
              <Badge key={href} asChild className="rounded-[15px] bg-white/10 text-white border-white/30 backdrop-blur p-3.75 text-sm hover:bg-white/20 hover:text-white">
                <Link href={href}>• {label}</Link>
              </Badge>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
