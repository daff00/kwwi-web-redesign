"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, Printer } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#F4F6F4] text-white pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-x-8 mb-12">
          {/* Column 1: Brand & Description */}
          <div className="flex flex-col gap-6 lg:col-span-5 lg:pr-12">
            <Link
              href="/"
              className="inline-block"
              onClick={() => window.scrollTo(0, 0)}
            >
              <div className="relative w-[270px] h-[81px] flex-shrink-0">
                <Image
                  src="/logo-color.svg"
                  alt="KWWI Logo"
                  fill
                  className="object-contain object-left"
                />
              </div>
            </Link>
            <p className="text-[#14261C] leading-relaxed">
              An Indonesian manufacturer specializing in finger-jointed
              laminated wood board products, delivering export-grade quality
              since 1998.
            </p>
            <p className="text-[#14261C] leading-relaxed">
              The company holds the wood legality certificate VLHH-36-12-0008,
              ensuring that all raw materials are sourced from legal and
              responsibly managed operations.
            </p>
          </div>

          {/* Column 2: Headquarters */}
          <div className="flex flex-col gap-6 lg:col-span-4 lg:pl-8">
            <h3 className="text-xl font-bold tracking-wide text-[#14261C]">Headquarters</h3>
            <div className="flex flex-col gap-4 text-[#14261C]">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 shrink-0 mt-0.5 text-[#14261C]" />
                <span className="leading-relaxed text-[#14261C]">
                  Jalan Raya Serang Km. 12 <br/> Desa Bunder <br/> Cikupa, Tangerang – 15710
                </span>
              </div>
              <a
                href="tel:+62215960132"
                className="flex items-center gap-3 hover:text-white transition-colors duration-300"
              >
                <Phone className="h-5 w-5 shrink-0" />
                <span>Phone: +6221-5960132</span>
              </a>
              <div className="flex items-center gap-3">
                <Printer className="h-5 w-5 shrink-0" />
                <span>Fax: +6221-5960424</span>
              </div>
              <a
                href="mailto:kwwi@gmx.com"
                className="flex items-center gap-3 hover:text-white transition-colors duration-300"
              >
                <Mail className="h-5 w-5 shrink-0" />
                <span>kwwi@gmx.com</span>
              </a>
            </div>
          </div>

          {/* Column 3: Navigation */}
          <div className="flex flex-col gap-6 lg:col-span-3 lg:pl-8 lg:items-end">
            <h3 className="text-xl font-bold tracking-wide text-[#14261C]">Navigation</h3>
            <nav className="flex flex-col gap-4 items-start lg:items-end">
              {[
                { name: "Home", href: "/" },
                { name: "About Us", href: "/about" },
                { name: "Products", href: "/products" },
                { name: "Contact", href: "/contact" },
                { name: "Get Quote", href: "/contact?tab=quote" },
              ].map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => window.scrollTo(0, 0)}
                  className="text-[#14261C] hover:text-[#14261C]/70 transition-colors duration-300"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Bottom Bar: Copyright */}
        <div className="border-t border-white/20 pt-8 flex flex-col items-center justify-center gap-4 text-sm text-white/70">
          <p>
            &copy; {currentYear} PT Kalimas Wood Working Industry. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}