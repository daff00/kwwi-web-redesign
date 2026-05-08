"use client";

import { toast } from "sonner";
import { api } from "@/lib/api";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  MapPin,
  Mail,
  Phone,
  MessageCircle,
  Printer,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ContactSubmission } from "@/lib/api";

const countryLabels: Record<string, string> = {
  jp: "Japan",
  kr: "South Korea",
  id: "Indonesia",
  other: "Other",
};

const toOptionalString = (value: string) => {
  const trimmed = value.trim();
  return trimmed.length ? trimmed : undefined;
};

const tabs = ["General Inquiry", "Get Quote"];

const locations = [
  {
    label: "Headquarters",
    address: "Jalan Raya Serang Km. 12, Desa Bunder Cikupa, Tangerang – 15710",
    phone: "+6221-5960132",
    fax: "+6221-5960424",
    email: "kwwi@gmx.com",
  },
  {
    label: "Sawmill Factory",
    address:
      "Jalan Raya Tegal – Pemalang Km.11, Desa Sidaharja, Kecamatan Suradadi, Kabupaten Tegal",
    phone: null,
    fax: null,
    email: null,
  },
];

const contactItems = [
  {
    icon: Mail,
    label: "Email",
    value: "kwwi@gmx.com",
    href: "mailto:kwwi@gmx.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+62 21-5960132",
    href: "tel:+62215960132",
  },
  { icon: Printer, label: "Fax", value: "+62 21-5960424", href: null },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "Chat with us",
    href: "https://wa.me/62215960132",
  },
];

// Reusable label component
function FieldLabel({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="text-[#1E5C33] text-xs font-semibold flex items-center gap-1">
      {children}
      {required && <span className="text-red-500">*</span>}
    </label>
  );
}

// Reusable field wrapper
function Field({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-1.5">{children}</div>;
}

// Consistent input className
const inputCls =
  "bg-white border border-[#BFD8C4] text-[#314D3D] placeholder:text-[#BFD8C4] rounded-xl h-11 focus:border-[#4EA86D] focus:ring-1 focus:ring-[#4EA86D]";
const selectTriggerCls =
  "bg-white border border-[#BFD8C4] text-[#314D3D] rounded-xl h-11 focus:border-[#4EA86D] focus:ring-1 focus:ring-[#4EA86D]";

export default function ContactClient() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    country: "",
    countryOther: "",
    port: "",
    productTypes: [] as string[],
    customSpec: "", // ← free text for Custom specification
    thickness: "",
    width: "",
    length: "",
    quantity: "",
    delivery: "",
    incoterm: "",
    message: "",
  });

  useEffect(() => {
    const tab = searchParams.get("tab");
    setActiveTab(tab === "quote" ? 1 : 0);
  }, [searchParams]);

  const set = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const toggleProductType = (type: string) => {
    setForm((prev) => ({
      ...prev,
      productTypes: prev.productTypes.includes(type)
        ? prev.productTypes.filter((t) => t !== type)
        : [...prev.productTypes, type],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const loadingToastId = toast.loading("Sending message...", {
      description: "Please wait while we deliver your inquiry.",
    });

    try {
      const payload: ContactSubmission = {
        formType: activeTab === 1 ? "get_quote" : "general_inquiry",
        tab: activeTab === 1 ? "quote" : "inquiry",
        name: form.name.trim(),
        company: toOptionalString(form.company),
        email: form.email.trim(),
        phone: toOptionalString(form.phone),
        country:
          form.country === "other"
            ? toOptionalString(form.countryOther)
            : countryLabels[form.country],
        port: activeTab === 1 ? toOptionalString(form.port) : undefined,
        productTypes: activeTab === 1 ? form.productTypes : [],
        customSpec:
          activeTab === 1 ? toOptionalString(form.customSpec) : undefined,
        thickness:
          activeTab === 1 ? toOptionalString(form.thickness) : undefined,
        width: activeTab === 1 ? toOptionalString(form.width) : undefined,
        length: activeTab === 1 ? toOptionalString(form.length) : undefined,
        quantity: activeTab === 1 ? toOptionalString(form.quantity) : undefined,
        delivery: activeTab === 1 ? toOptionalString(form.delivery) : undefined,
        incoterm: activeTab === 1 ? toOptionalString(form.incoterm) : undefined,
        message: form.message.trim(),
      };

      await api.submitContact(payload);

      toast.dismiss(loadingToastId);
      toast.success("Message sent", {
        description: "We received your inquiry and will reply soon.",
      });

      setSent(true);
    } catch (error) {
      toast.dismiss(loadingToastId);
      toast.error("Failed to send message", {
        description: (
          <div className="whitespace-pre-line">
            {error instanceof Error ? error.message : "Please try again later."}
          </div>
        ),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <section
        className="relative min-h-[100dvh] overflow-hidden flex items-center bg-[#1E5C33] bg-cover bg-center"
        style={{ backgroundImage: "url('/contact-hero-bg.webp')" }}
      >
        <div className="absolute inset-0 bg-black/50 z-0" />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-white to-transparent z-0" />
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-28 lg:py-36 w-full flex flex-col justify-center items-start text-white">
          <div className="mb-4">
            <Badge className="rounded-[15px] bg-white/10 text-white border-white/30 backdrop-blur p-3.75 text-sm">
              Contact PT Kalimas Wood Working Industry
            </Badge>
          </div>
          <h1 className="mb-1.75 max-w-6xl text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl lg:text-6xl drop-shadow-lg">
            Get In Touch With Us <br /> We're Here to Help
          </h1>
          <p className="mb-8 max-w-4xl text-sm sm:text-base text-white/90">
            Please feel free to contact us if you would like to make a business
            inquiry or want to know more about us. <br></br>
          </p>
          <p className="invisible">a</p>
          <div className="flex flex-wrap gap-4 invisible">
            <Badge className="rounded-[15px] bg-white/10 text-white border-white/30 backdrop-blur p-3.75 text-sm">
              • Learn More
            </Badge>
            <Badge className="rounded-[15px] bg-white/10 text-white border-white/30 backdrop-blur p-3.75 text-sm">
              • View Our Products
            </Badge>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-white py-16 flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-10 items-start">
            {/* LEFT — Tabbed Form */}
            <div className="w-full lg:w-3/5">
              {/* Tab selector */}
                  <div className="flex gap-2 mb-8 bg-[#E3EDE7] p-1 rounded-xl w-fit">
                {tabs.map((tab, i) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(i)}
                    className={cn(
                      "px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200",
                      activeTab === i
                        ? "bg-[#1E5C33] text-white shadow-sm"
                        : "text-[#314D3D]/70 hover:text-[#314D3D]",
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Form header */}
              <h2 className="text-[#314D3D] text-3xl font-bold mb-2">
                {activeTab === 1 ? "Your Specifications" : "Your Message"}
              </h2>
              <div className="bg-[#314D3D] h-1 w-10 mb-5" />
              <p className="text-[#314D3D] text-sm leading-relaxed mb-8 max-w-sm">
                {activeTab === 1
                  ? "Please fill in as much detail as possible. The more we know, the faster we can prepare an accurate quotation."
                  : "Fill in the form below and we'll get back to you as soon as possible."}
              </p>

              {/* Form outline box */}
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-6 bg-white border border-[#314D3D]/60 rounded-2xl p-8 shadow-sm"
              >
                {/* Contact details group */}
                <div className="flex flex-col gap-4" />
                <p className="text-[#314D3D] text-xs font-bold uppercase tracking-widest border-b border-[#EDE9E3] pb-2">
                  Contact Details
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel required>Full name</FieldLabel>
                    <Input
                      value={form.name}
                      onChange={(e) => set("name", e.target.value)}
                      placeholder="e.g. Tanaka"
                      className={inputCls}
                    />
                  </Field>
                  <Field>
                    <FieldLabel required>Company name</FieldLabel>
                    <Input
                      value={form.company}
                      onChange={(e) => set("company", e.target.value)}
                      placeholder="e.g. Osaka Trading Co."
                      className={inputCls}
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel required>Email address</FieldLabel>
                    <Input
                      type="email"
                      value={form.email}
                      onChange={(e) => set("email", e.target.value)}
                      placeholder="you@company.com"
                      className={inputCls}
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Phone / WhatsApp</FieldLabel>
                    <Input
                      value={form.phone}
                      onChange={(e) => set("phone", e.target.value)}
                      placeholder="+81 ..."
                      className={inputCls}
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel required>Country</FieldLabel>
                    <Select
                      value={form.country}
                      onValueChange={(v) => set("country", v)}
                    >
                      <SelectTrigger className={selectTriggerCls}>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="jp">Japan</SelectItem>
                        <SelectItem value="kr">South Korea</SelectItem>
                        <SelectItem value="id">Indonesia</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>

                  {/* Show destination port only on Get Quote */}
                  {activeTab === 1 && (
                    <Field>
                      <FieldLabel>Destination port</FieldLabel>
                      <Input
                        value={form.port}
                        onChange={(e) => set("port", e.target.value)}
                        placeholder="e.g. Osaka, Busan"
                        className={inputCls}
                      />
                    </Field>
                  )}
                </div>

                {/* Other country free text — both tabs */}
                {form.country === "other" && (
                  <Field>
                    <FieldLabel required>
                      Please specify your country
                    </FieldLabel>
                    <Input
                      value={form.countryOther}
                      onChange={(e) => set("countryOther", e.target.value)}
                      placeholder="e.g. Malaysia, Vietnam..."
                      className={inputCls}
                    />
                  </Field>
                )}

                {/* Product specs — only on Get Quote tab */}
                {activeTab === 1 && (
                  <div className="flex flex-col gap-4">
                    <p className="text-[#314D3D] text-xs font-bold uppercase tracking-widest border-b border-[#EDE9E3] pb-2">
                      Product Specifications
                    </p>

                    {(() => {
                      const isNotSure = form.productTypes.includes(
                        "Not sure — advise me",
                      );
                      const isCustom = form.productTypes.includes(
                        "Custom specification",
                      );
                      const isLocked = isNotSure || isCustom;

                      return (
                        <>
                          {/* Product type */}
                          <Field>
                            <FieldLabel required>Product type</FieldLabel>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                              {[
                                "Pine FJLB",
                                "Falcata FJLB",
                                "Custom specification",
                                "Not sure — advise me",
                              ].map((type) => (
                                <label
                                  key={type}
                                  className={cn(
                                          "flex items-center gap-2 cursor-pointer rounded-xl px-3 py-3 text-xs font-medium border transition-all duration-200",
                                          form.productTypes.includes(type)
                                            ? "bg-[#1E5C33] text-white border-[#1E5C33]"
                                            : "bg-white text-[#1E5C33] border-[#BFD8C4] hover:border-[#4EA86D]",
                                          isNotSure && type !== "Not sure — advise me"
                                            ? "opacity-40 cursor-not-allowed"
                                            : "",
                                        )}
                                >
                                  <input
                                    type="checkbox"
                                    className="hidden"
                                    checked={form.productTypes.includes(type)}
                                    disabled={
                                      isNotSure &&
                                      type !== "Not sure — advise me"
                                    }
                                    onChange={() => {
                                      if (type === "Not sure — advise me") {
                                        setForm((prev) => ({
                                          ...prev,
                                          productTypes:
                                            prev.productTypes.includes(type)
                                              ? []
                                              : [type],
                                          customSpec: "",
                                          thickness: "",
                                          width: "",
                                          length: "",
                                          quantity: "",
                                          delivery: "",
                                          incoterm: "",
                                        }));
                                      } else if (
                                        type === "Custom specification"
                                      ) {
                                        setForm((prev) => ({
                                          ...prev,
                                          productTypes:
                                            prev.productTypes.includes(type)
                                              ? prev.productTypes.filter(
                                                  (t) => t !== type,
                                                )
                                              : [
                                                  ...prev.productTypes.filter(
                                                    (t) =>
                                                      t !==
                                                      "Not sure — advise me",
                                                  ),
                                                  type,
                                                ],
                                          thickness: "",
                                          width: "",
                                          length: "",
                                          quantity: "",
                                          delivery: "",
                                          incoterm: "",
                                        }));
                                      } else {
                                        toggleProductType(type);
                                      }
                                    }}
                                  />
                                  <div
                                    className={cn(
                                      "w-3.5 h-3.5 rounded border shrink-0 flex items-center justify-center",
                                      form.productTypes.includes(type)
                                        ? "bg-[#4EA86D] border-[#4EA86D]"
                                        : "border-[#BFD8C4]",
                                    )}
                                  >
                                    {form.productTypes.includes(type) && (
                                      <svg
                                        viewBox="0 0 10 8"
                                        className="w-2.5 h-2.5"
                                      >
                                        <path
                                          d="M1 4l3 3 5-6"
                                          stroke="white"
                                          strokeWidth="1.5"
                                          fill="none"
                                          strokeLinecap="round"
                                        />
                                      </svg>
                                    )}
                                  </div>
                                  {type}
                                </label>
                              ))}
                            </div>
                          </Field>

                          {/* Custom spec */}
                          {isCustom && (
                            <Field>
                              <FieldLabel required>
                                Describe your custom specification
                              </FieldLabel>
                                <Textarea
                                rows={3}
                                value={form.customSpec}
                                onChange={(e) =>
                                  setForm((p) => ({
                                    ...p,
                                    customSpec: e.target.value,
                                  }))
                                }
                                placeholder="Describe your custom dimensions, grade, finish, or other requirements..."
                                className="bg-white border border-[#BFD8C4] text-[#314D3D] placeholder:text-[#BFD8C4] rounded-xl resize-none focus:border-[#4EA86D] focus:ring-1 focus:ring-[#4EA86D]"
                              />
                            </Field>
                          )}

                          {/* Locked area */}
                          <div
                            className={cn(
                              "flex flex-col gap-4",
                              isLocked && "opacity-40 pointer-events-none",
                            )}
                          >
                            {isLocked && (
                              <div className="bg-[#EFF7EF] border border-[#BFD8C4]/40 rounded-xl px-4 py-3 text-xs text-[#1E5C33] text-center">
                                {isCustom
                                  ? "Specifications locked — please describe your custom requirements in the text box above"
                                  : "Specifications locked — please describe your needs in the notes below"}
                              </div>
                            )}

                            {/* Dimensions */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              <Field>
                                <FieldLabel>Thickness (mm)</FieldLabel>
                                <Select
                                  value={form.thickness}
                                  onValueChange={(v) => set("thickness", v)}
                                  disabled={isLocked}
                                >
                                  <SelectTrigger className={selectTriggerCls}>
                                    <SelectValue placeholder="Select" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {[
                                      "8",
                                      "9",
                                      "10",
                                      "12",
                                      "15",
                                      "18",
                                      "20",
                                      "25",
                                      "30",
                                      "Custom",
                                    ].map((t) => (
                                      <SelectItem key={t} value={t}>
                                        {t === "Custom" ? "Custom" : `${t}mm`}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </Field>

                              <Field>
                                <FieldLabel>Width (mm)</FieldLabel>
                                <Select
                                  value={form.width}
                                  onValueChange={(v) => set("width", v)}
                                  disabled={isLocked}
                                >
                                  <SelectTrigger className={selectTriggerCls}>
                                    <SelectValue placeholder="Select" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {[
                                      "300",
                                      "400",
                                      "500",
                                      "600",
                                      "900",
                                      "1200",
                                      "Custom",
                                    ].map((w) => (
                                      <SelectItem key={w} value={w}>
                                        {w === "Custom" ? "Custom" : `${w}mm`}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </Field>

                              <Field>
                                <FieldLabel>Length (mm)</FieldLabel>
                                <Select
                                  value={form.length}
                                  onValueChange={(v) => set("length", v)}
                                  disabled={isLocked}
                                >
                                  <SelectTrigger className={selectTriggerCls}>
                                    <SelectValue placeholder="Select" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {[
                                      "1000",
                                      "1800",
                                      "2000",
                                      "2400",
                                      "3000",
                                      "4000",
                                      "5000",
                                      "Custom",
                                    ].map((l) => (
                                      <SelectItem key={l} value={l}>
                                        {l === "Custom" ? "Custom" : `${l}mm`}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </Field>
                            </div>

                            {/* Qty + Delivery + Incoterm */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              <Field>
                                <FieldLabel>Estimated quantity</FieldLabel>
                                <Select
                                  value={form.quantity}
                                  onValueChange={(v) => set("quantity", v)}
                                  disabled={isLocked}
                                >
                                  <SelectTrigger className={selectTriggerCls}>
                                    <SelectValue placeholder="Select" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="lt10">
                                      {"< 10 m³"}
                                    </SelectItem>
                                    <SelectItem value="10-50">
                                      10 – 50 m³
                                    </SelectItem>
                                    <SelectItem value="50-100">
                                      50 – 100 m³
                                    </SelectItem>
                                    <SelectItem value="gt100">
                                      100+ m³
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </Field>

                              <Field>
                                <FieldLabel>Required delivery</FieldLabel>
                                <Input
                                  value={form.delivery}
                                  onChange={(e) =>
                                    set("delivery", e.target.value)
                                  }
                                  placeholder="e.g. Q3 2026"
                                    className={inputCls}
                                  disabled={isLocked}
                                />
                              </Field>

                              <Field>
                                <FieldLabel>Incoterm preference</FieldLabel>
                                <Select
                                  value={form.incoterm}
                                  onValueChange={(v) => set("incoterm", v)}
                                  disabled={isLocked}
                                >
                                  <SelectTrigger className={selectTriggerCls}>
                                    <SelectValue placeholder="Select" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="fob">FOB</SelectItem>
                                    <SelectItem value="cif">CIF</SelectItem>
                                    <SelectItem value="cfr">CFR</SelectItem>
                                    <SelectItem value="exw">EXW</SelectItem>
                                    <SelectItem value="unsure">
                                      Not sure
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </Field>
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                )}

                {/* Message group */}
                <div className="flex flex-col gap-4">
                  <p className="text-[#314D3D] text-xs font-bold uppercase tracking-widest border-b border-[#EDE9E3] pb-2">
                    {activeTab === 1 ? "Additional Notes" : "Your Message"}
                  </p>
                  <Field>
                    <FieldLabel required={activeTab === 0}>
                      {activeTab === 1
                        ? "Special requirements or notes"
                        : "Message"}
                    </FieldLabel>
                      <Textarea
                      rows={4}
                      value={form.message}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, message: e.target.value }))
                      }
                      placeholder={
                        activeTab === 1
                          ? "Dimensions, surface finish, moisture content spec, packaging requirements..."
                          : "How can we help you?"
                      }
                      className="bg-white border border-[#BFD8C4] text-[#314D3D] placeholder:text-[#BFD8C4] rounded-xl resize-none focus:border-[#4EA86D] focus:ring-1 focus:ring-[#4EA86D]"
                    />
                  </Field>
                </div>

                {/* Submit */}
                {sent ? (
                  <div className="w-full h-12 bg-green-50 border border-green-200 rounded-xl flex items-center justify-center gap-2">
                    <span className="text-green-600 text-sm font-semibold">
                      ✓ Message sent! We'll respond within 1 business day.
                    </span>
                  </div>
                ) : (
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 bg-[#1E5C33] hover:bg-[#4EA86D] text-white font-bold rounded-xl text-sm"
                  >
                    {loading ? (
                      <span className="inline-flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending...
                      </span>
                    ) : activeTab === 1 ? (
                      "Submit Quote Request"
                    ) : (
                      "Send Message"
                    )}
                  </Button>
                )}

                <p className="text-[#6B8B73] text-xs text-center">
                  Fields marked with <span className="text-red-500">*</span> are
                  required · We typically respond within 1 business day · All
                  inquiries are confidential
                </p>
              </form>
            </div>

            {/* RIGHT — Company Info */}
            <div className="w-full lg:w-2/5 flex flex-col gap-5 lg:sticky lg:top-24">
              {/* Contact + Locations combined card */}
              <Card className="bg-white border border-[#314D3D]/60 rounded-2xl p-6 shadow-sm flex flex-col gap-6">
                {/* Header */}
                <div className="flex items-center gap-2">
                  <div className="bg-[#1E5C33] rounded-lg p-1.5 shrink-0">
                    <Mail className="text-white w-3.5 h-3.5" />
                  </div>
                  <p className="text-[#314D3D] font-bold text-sm">
                    Contact us directly
                  </p>
                </div>

                {/* Divider */}
                <div className="border-t border-[#EDE9E3]" />

                {/* Locations INSIDE contact card */}
                <div className="flex flex-col gap-5">
                  {locations.map((loc) => (
                    <div key={loc.label} className="flex flex-col gap-3">
                      {/* Location header */}
                      <div className="flex items-center gap-2">
                        <div className="bg-[#1E5C33] rounded-lg p-1.5 shrink-0">
                          <MapPin className="text-white w-3.5 h-3.5" />
                        </div>
                        <p className="text-[#314D3D] font-bold text-sm">
                          {loc.label}
                        </p>
                      </div>

                      {/* Address */}
                      <p className="text-[#314D3D] text-xs leading-relaxed">
                        {loc.address}
                      </p>

                      {/* Contact details */}
                      <div className="flex flex-col gap-2 pl-1">
                        {loc.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="text-[#1E5C33] w-3.5 h-3.5 shrink-0" />
                            <p className="text-[#314D3D] text-xs font-medium">
                              {loc.phone}
                            </p>
                          </div>
                        )}

                        {loc.fax && (
                          <div className="flex items-center gap-2">
                            <Printer className="text-[#1E5C33] w-3.5 h-3.5 shrink-0" />
                            <p className="text-[#314D3D] text-xs font-medium">
                              {loc.fax}
                            </p>
                          </div>
                        )}

                        {loc.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="text-[#1E5C33] w-3.5 h-3.5 shrink-0" />
                            <a
                              href={`mailto:${loc.email}`}
                              className="text-[#314D3D] text-xs font-medium hover:underline"
                            >
                              {loc.email}
                            </a>
                          </div>
                        )}
                      </div>

                      {/* subtle divider between locations */}
                      <div className="border-t border-[#F1ECE3] mt-2" />
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
