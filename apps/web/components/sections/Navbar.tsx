"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, ArrowRight, Mail, Phone } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const centerLinks = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Products", href: "/products" },
];

export function Navbar() {
  const [navState, setNavState] = useState("top");
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const whiteThreshold = window.innerHeight - 80;
      if (scrollY > whiteThreshold) {
        setNavState("white");
      } else if (scrollY > 50) {
        setNavState("glass");
      } else {
        setNavState("top");
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out",
        navState === "white" &&
          "bg-white/90 backdrop-blur-md text-[#866544] shadow-sm",
        navState === "glass" &&
          "bg-black/20 backdrop-blur-md text-white shadow-sm",
        navState === "top" && "bg-transparent text-white",
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 relative">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link
              href="/"
              className="flex items-center gap-3 hover:opacity-90 transition-opacity"
            >
              <div className="relative w-[189px] h-[56px]">
                <Image
                  src={
                    navState === "white" ? "/logo-brown.png" : "/logo-white.png"
                  }
                  alt="KWWI Logo"
                  fill
                  className="object-contain"
                />
              </div>
            </Link>
          </div>

          {/* Center Navigation */}
          <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 space-x-8">
            {centerLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className="relative font-medium py-1 px-1 transition-opacity hover:opacity-80"
                >
                  {link.name}
                  <motion.span
                    className="absolute bottom-0 left-0 h-[2px] w-full bg-current"
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{
                      scaleX: isActive ? 1 : 0,
                      opacity: isActive ? 1 : 0,
                    }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    style={{ originX: 0 }}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            <Link
              href="/contact"
              className={cn(
                "hidden md:flex items-center justify-center font-bold w-[162px] h-[48px] rounded-[20px] transition-all duration-300",
                navState === "white"
                  ? "bg-[#866544] text-white hover:bg-[#866544]/90"
                  : "bg-[#f4f4f4]/[0.21] border border-[#ffffff]/[0.21] text-white hover:bg-[#f4f4f4]/[0.3]",
              )}
            >
              Get Quote
            </Link>

            {/* Mobile Menu */}
            <div className="md:hidden flex items-center z-50">
              <Sheet>
                <SheetTrigger className="hover:opacity-80 transition-opacity cursor-pointer">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="bg-white border-l-0 w-[85vw] sm:w-[400px] flex flex-col px-8 py-10"
                >
                  <SheetTitle className="text-[#866544] text-left text-xl tracking-widest uppercase font-bold mb-12">
                    Navigation
                  </SheetTitle>

                  <div className="flex flex-col flex-1 space-y-8">
                    {centerLinks.map((link) => {
                      const isActive = pathname === link.href;
                      return (
                        <Link
                          key={link.name}
                          href={link.href}
                          className={cn(
                            "group flex items-center justify-between text-3xl font-medium transition-colors duration-300",
                            isActive
                              ? "text-[#866544]"
                              : "text-gray-400 hover:text-[#866544]",
                          )}
                        >
                          <span>{link.name}</span>
                          <ArrowRight
                            className={cn(
                              "h-8 w-8 transition-all duration-300 ease-out",
                              isActive
                                ? "translate-x-0 opacity-100"
                                : "-translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100",
                            )}
                          />
                        </Link>
                      );
                    })}
                  </div>

                  {/* Mobile Footer */}
                  <div className="mt-auto pt-8 border-t border-gray-100 flex flex-col gap-8">
                    <div className="flex flex-col gap-3 text-sm text-[#866544]/70 font-medium">
                      <a
                        href="mailto:kwwi@gmx.com"
                        className="flex items-center gap-3 hover:text-[#866544] transition-colors"
                      >
                        <Mail className="h-5 w-5" />
                        <span>kwwi@gmx.com</span>
                      </a>
                      <a
                        href="tel:+62215960132"
                        className="flex items-center gap-3 hover:text-[#866544] transition-colors"
                      >
                        <Phone className="h-5 w-5" />
                        <span>+62 21 596 0132</span>
                      </a>
                    </div>
                    <Link
                      href="/contact"
                      className="flex items-center justify-center w-full h-14 bg-[#866544] text-white font-bold rounded-3xl hover:bg-[#866544]/90 transition-colors text-lg shadow-md"
                    >
                      Get Quote
                    </Link>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
