import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import CertificationCarousel from "@/components/sections/CertificationCarousel";
import MarketGlobe from "@/components/sections/MarketGlobe";
import SectionHeader from "../../../components/sections/SectionHeader";
import { statCards, processCards } from "./_data/_data";

export const metadata: Metadata = {
  title: "About",
  description: "Learn more about KWWI",
};

const Divider = () => <div className="w-full h-px bg-[#ECEAE8] mt-16" />;

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">

      {/* Hero */}
      <section className="relative h-screen flex items-center bg-cover bg-center" style={{ backgroundImage: "url('/about-hero-bg.webp')" }}>
        <div className="absolute inset-0 bg-black/50 z-0" />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-white to-transparent z-0" />
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 flex h-full flex-col justify-center items-start text-white">
          <div className="mb-4">
            <Badge className="rounded-[15px] bg-white/10 text-white border-white/30 backdrop-blur p-3.75 text-sm">
              Built on Experience, Driven by Quality
            </Badge>
          </div>
          <h1 className="mb-1.75 max-w-6xl text-3xl font-semibold leading-tight md:text-6xl drop-shadow-lg">
            Pine FJLB & Falcata Specialist <br /> Since 1998
          </h1>
          <p className="mb-8 max-w-4xl text-sm md:text-base text-white/90">
            Since 1998, we have delivered consistent, export-grade quality through advanced production processes and strict quality control.
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

      {/* Company Overview */}
      <section id="company-overview" className="bg-white pt-24 pb-7">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Company Overview"
            title="PT Kalimas Wood Working Industry"
            extraDescription={
              <>
                <p className="text-[#866544] leading-relaxed text-lg mb-6">Founded in 1998, we are an Indonesian manufacturer specializing in <b>export-grade Finger-Joint Laminated Boards (FJLB)</b>. Through advanced production processes and strict quality control, we ensure consistent and reliable products for international markets.</p>
                <p className="text-[#866544] leading-relaxed text-lg mb-6">We are committed to sustainability, <b>holding wood legality certification VLHH-36-12-0008</b> to guarantee responsibly sourced, non illegal raw materials. Using <b>Merkusii Pine and Falcata,</b> our products serve the housing and furniture industries, particularly in Japan and Korea.</p>
                <p className="text-[#866544] leading-relaxed text-lg mb-6"><b>Built on integrity, honesty, and transparency,</b> we foster long term trust with customers and partners.</p>
                <p className="text-[#866544] leading-relaxed text-lg mb-6">Our core product, <b>finger-joint laminated boards,</b> is engineered using precise bonding and laminating technology, delivering strength, stability, and global standard quality.</p>
              </>
            }
          />
        </div>
      </section>

      {/* Stat Cards */}
      <section className="bg-white pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {statCards.map(({ number, icon: Icon, title, description, footer }) => (
              <Card key={number} className="relative overflow-hidden bg-[#FAF6F0] border border-[#866544]/20 shadow-sm text-center px-8 py-10 flex flex-col items-center gap-4 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-[#CA9C60]/60 hover:bg-[#F5EDE0] group cursor-pointer">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-[#CA9C60]" />
                <span className="text-5xl font-bold text-[#CA9C60]/30 leading-none transition-colors duration-300 group-hover:text-[#CA9C60]/50">{number}</span>
                <div className="bg-[#CA9C60] rounded-2xl p-4 transition-transform duration-300 group-hover:scale-110">
                  <Icon className="text-white w-10 h-10" />
                </div>
                <h3 className="text-[#5C3D1E] text-xl font-bold mt-1">{title}</h3>
                <div className="w-12 h-px bg-[#CA9C60]/40" />
                <p className="text-[#7A5C3A] text-sm leading-relaxed text-justify">{description}</p>
                <div className="w-full h-px bg-[#CA9C60]/20 mt-auto" />
                <p className="text-[#7A5C3A] font-semibold text-sm">{footer}</p>
              </Card>
            ))}
          </div>
          <Divider />
        </div>
      </section>

      {/* Facilities */}
      <section className="bg-white pb-7">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Facilities"
            title="Heavy-duty Precision Woodworking Machines"
            extraDescription={
              <>
                <p className="text-[#866544] leading-relaxed text-lg mb-6">Our plant is equipped with purpose-built machinery for precision finger-jointing and lamination, ensuring dimensional accuracy and structural integrity across all product lines.</p>
                <p className="text-[#866544] leading-relaxed text-lg mb-6">To achieve high precision products, we constantly maintain and invest in newer heavy duty precision woodworking machines made mainly from Germany and Taiwan.</p>
              </>
            }
          />
        </div>
      </section>

      {/* Process Cards */}
      <section className="bg-white pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {processCards.map((item) => (
              <Card key={item.number} className="relative overflow-hidden bg-[#EEEAE4] border border-[#866544]/20 shadow-sm flex flex-col transition-all duration-300 ease-in-out group cursor-pointer hover:-translate-y-1 hover:border-[#CA9C60]/60 hover:bg-[#E8E2D8]">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-[#CA9C60]" />
                <div className="relative w-full aspect-[4/3] bg-[#D9D4CC] mt-1.5">
                  <Image src={item.image} alt={item.title} fill className="object-cover" />
                </div>
                <div className="flex flex-col gap-3 px-5 py-5">
                  <div className="flex items-start gap-3">
                    <span className="text-4xl font-bold text-[#CA9C60]/30 leading-none shrink-0">{item.number}</span>
                    <h3 className="text-[#5C3D1E] text-base font-bold underline underline-offset-2 decoration-[#CA9C60] leading-snug">{item.title}</h3>
                  </div>
                  <p className="text-[#7A5C3A] text-sm leading-relaxed text-justify">{item.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
        <Divider />
      </section>

      {/* Certifications */}
      <section className="bg-white pb-7">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Certifications"
            title="Verified, Compliant, Trusted"
            description="Every certificate we hold is a verifiable commitment to legal, safe, and export-ready manufacturing, backed by Indonesian government authorities and international trade standards."
          />
        </div>
        <CertificationCarousel />
        <Divider />
      </section>

      {/* Market */}
      <section className="bg-white pt-10 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Market"
            title="Where Our Products Go"
            description="KWWI primarily serves international buyers in Japan and South Korea, while maintaining supply to the Indonesian domestic market."
          />
        </div>
        <MarketGlobe />
      </section>

    </div>
  );
}