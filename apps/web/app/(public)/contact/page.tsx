import type { Metadata } from "next";
import { Suspense } from "react";
import ContactClient from "./_components/ContactClient";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with KWWI for export inquiries and quotes.",
};

export default function ContactPage() {
  return (
    <Suspense>
      <ContactClient />
    </Suspense>
  );
}