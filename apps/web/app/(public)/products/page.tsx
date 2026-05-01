import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BadgeCheck, Ruler, Box, Droplets } from "lucide-react";
import { api } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import SectionHeader from "@/components/sections/SectionHeader";
import GradeClassification from "./_components/GradeClassification";

export const metadata: Metadata = {
  title: "Products",
  description: "Explore our products",
};

export default async function ProductsPage() {
  let products: Awaited<ReturnType<typeof api.getProducts>> = [];

  const Divider = () => <div className="w-full h-px bg-[#ECEAE8] mt-16" />;

  try {
    products = await api.getProducts();
  } catch {
    // Server not running or no products yet — show empty state
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <section
        className="relative h-screen flex items-center bg-cover bg-center"
        style={{ backgroundImage: "url('/products-hero-bg.webp')" }}
      >
        <div className="absolute inset-0 bg-black/50 z-0" />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-white to-transparent z-0" />
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 flex h-full flex-col justify-center items-start text-white">
          <div className="mb-4">
            <Badge className="rounded-[15px] bg-white/10 text-white border-white/30 backdrop-blur p-3.75 text-sm">
              Our Products & Custom Solutions
            </Badge>
          </div>
          <h1 className="mb-1.75 max-w-6xl text-3xl font-semibold leading-tight md:text-6xl drop-shadow-lg">
            Pine FJLB & Falcata Products & <br /> Custom Solutions
          </h1>
          <p className="mb-8 max-w-4xl text-sm md:text-base text-white/90">
            Merkusii Pine and Falcata finger-joint laminated boards engineered
            for strength, stability, and global quality, with custom solutions
            available.
          </p>
          <div className="flex flex-wrap gap-4">
            {[
              { label: "Learn More", href: "/about" },
              { label: "View Our Products", href: "#product-overview" },
            ].map(({ label, href }) => (
              <Badge
                key={href}
                asChild
                className="rounded-[15px] bg-white/10 text-white border-white/30 backdrop-blur p-3.75 text-sm hover:bg-white/20 hover:text-white"
              >
                <Link href={href}>• {label}</Link>
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Company Overview */}
      <section id="product-overview" className="bg-white pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Overview"
            title="Specializing in Merkusii Pine & Falcata FJLB"
            extraDescription={
              <>
                <p className="text-[#866544] leading-relaxed text-lg mb-6">
                  We hold wood legality certificate VLHH-36-12-0008,
                  guaranteeing that all raw materials do not come from illegal
                  logging.
                </p>
                <p className="text-[#866544] leading-relaxed text-lg mb-6">
                  Our products are used for housing components and furniture,
                  primarily in Japan and South Korea.
                </p>
              </>
            }
            rightContent={
              <div className="flex flex-col gap-4 pt-13">
                {[
                  {
                    title: "VLHH-36-12-0008 Certified",
                    subtitle: "Full timber legality traceability",
                  },
                  {
                    title: "Housing & Furniture Applications",
                    subtitle: "Japan & Korea primary markets",
                  },
                  {
                    title: "F**** Formaldehyde Rating",
                    subtitle: "Adhesive passed emission testing",
                  },
                ].map((item) => (
                  <Card
                    key={item.title}
                    className="flex flex-row flex-center items-center gap-4 px-5 py-5 bg-[#FAF6F0] border border-[#866544]/20 rounded-2xl shadow-sm"
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
                        {item.title}
                      </p>
                      <p className="text-[#866544] text-sm leading-snug">
                        {item.subtitle}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            }
          />
          <Divider />
        </div>
      </section>

      {/* FJLB Product Information */}
      <section className="bg-white pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="FJLB Product Information"
            title="Specifications"
          />
          {/* Image + Specs row */}
          <div className="flex flex-col md:flex-row gap-10 items-center mt-5">
            {/* Left - Image */}
            <div className="relative w-full md:w-1/2 aspect-[16/9] rounded-2xl overflow-hidden bg-gradient-to-b from-[#C4A882] to-[#8B6F4E] flex items-center justify-center shrink-0">
              <Image
                src="/FJLB-img.webp"
                alt="FJLB Product"
                fill
                className="object-contain"
              />
            </div>

            {/* Right - Spec Cards */}
            <div className="flex flex-col gap-4 w-full md:w-1/2">
              {[
                {
                  icon: Ruler,
                  title: "Dimensions",
                  lines: [
                    "Thickness: 8mm – 200mm (tolerance -0/+0.2)",
                    "Width: 300mm – 1200mm (tolerance -0/+5)",
                    "Length: 1000mm – 5000mm (tolerance -0/+10)",
                  ],
                },
                {
                  icon: Box,
                  title: "Finger joint mark position",
                  lines: ["On top · On side"],
                },
                {
                  icon: Droplets,
                  title: "Moisture content",
                  lines: ["MC < 12%"],
                },
                {
                  icon: Box,
                  title: "F**** Rated Adhesive",
                  lines: ["The adhesive used in finger joint and laminating processes passed formaldehyde emission tests and received F**** certification."],
                },
              ].map((spec) => (
                <Card
                  key={spec.title}
                  className="flex flex-row flex-center items-center gap-4 px-5 py-5 bg-[#FAF6F0] border border-[#866544]/20 rounded-2xl shadow-sm"
                >
                  {/* Left gold strip */}
                  <div className="w-1 self-stretch bg-[#CA9C60] rounded-full shrink-0" />
                  {/* Icon bubble */}
                  <div className="bg-[#CA9C60] rounded-full p-2.5 shrink-0">
                    <spec.icon className="text-white w-6 h-6" />
                  </div>
                  {/* Text */}
                  <div className="flex flex-col">
                    <p className="text-[#866544] font-bold text-sm mb-1">
                      {spec.title}
                    </p>
                    {spec.lines.map((line) => (
                      <p
                        key={line}
                        className="text-[#866544] text-sm leading-snug"
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </div>
          <Divider />
        </div>
      </section>
      <GradeClassification />
      {/* {products.length === 0 ? (
        <div className="text-center py-20">
          <Badge variant="secondary" className="text-base px-4 py-2">
            No products yet
          </Badge>
          <p className="text-muted-foreground mt-4">Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              {product.image_url && (
                <div className="relative h-48 w-full">
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle>{product.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  {product.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )} */}
    </div>
  );
}
