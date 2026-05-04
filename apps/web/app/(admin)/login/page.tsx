import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, LockKeyhole, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { login } from "../actions";

export const metadata: Metadata = {
  title: "Admin Login",
  description: "Sign in to access the admin dashboard.",
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#24180f]">
      <section
        className="relative min-h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/hero-bg.webp')" }}
      >
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#866544] to-transparent" />

        <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-4 py-24 sm:px-6 lg:px-8">
          <div className="grid w-full items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="max-w-3xl text-white">
              <Link
                href="/"
                className="mb-8 inline-flex items-center gap-3 transition-opacity hover:opacity-90"
              >
                <div className="relative h-14 w-[189px]">
                  <Image
                    src="/logo-white.webp"
                    alt="KWWI Logo"
                    fill
                    priority
                    className="object-contain object-left"
                  />
                </div>
              </Link>

              <h1 className="mt-5 max-w-2xl text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
                Sign in to the <br />
                KWWI dashboard
              </h1>

              <p className="mt-5 max-w-xl text-sm leading-6 text-white/85 sm:text-base">
                The admin area follows the same warm, grounded visual language
                as the public site, so the transition feels deliberate instead
                of abrupt.
              </p>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {[
                  {
                    icon: ShieldCheck,
                    title: "Trusted access",
                    text: "Protected entry for dashboard users.",
                  },
                  {
                    icon: LockKeyhole,
                    title: "Focused workflow",
                    text: "A quieter surface for quick sign-in.",
                  },
                  {
                    icon: ArrowRight,
                    title: "Same brand feel",
                    text: "Brown accents and glass styling from public pages.",
                  },
                ].map(({ icon: Icon, title, text }) => (
                  <div
                    key={title}
                    className="rounded-[20px] border border-white/15 bg-white/10 p-4 backdrop-blur"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h2 className="mt-3 text-base font-semibold">{title}</h2>
                    <p className="mt-2 text-sm leading-6 text-white/75">
                      {text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <Card className="w-full max-w-xl border border-[#866544]/20 bg-white/90 shadow-[0_24px_80px_rgba(61,43,31,0.18)] backdrop-blur-xl">
              <div className="h-1.5 bg-[#CA9C60]" />
              <CardHeader className="space-y-4 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#866544]/10 text-[#866544]">
                    <LockKeyhole className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-[#5C3D1E]">
                      Admin Login
                    </CardTitle>
                  </div>
                </div>

                <CardDescription className="text-[#7A5C3A]">
                  Enter your administrator credentials to continue.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form action={login as unknown as string} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[#5C3D1E]">
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="admin@example.com"
                      required
                      autoComplete="email"
                      className="h-12 rounded-[15px] border-[#866544]/20 bg-white/95 text-[#5C3D1E] placeholder:text-[#A08B74] focus-visible:ring-[#CA9C60]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-[#5C3D1E]">
                      Password
                    </Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      required
                      autoComplete="current-password"
                      className="h-12 rounded-[15px] border-[#866544]/20 bg-white/95 text-[#5C3D1E] placeholder:text-[#A08B74] focus-visible:ring-[#CA9C60]"
                    />
                  </div>

                  {params.error ? (
                    <p className="rounded-[15px] border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-700">
                      {params.error}
                    </p>
                  ) : null}

                  <Button
                    type="submit"
                    className="h-12 w-full rounded-[20px] bg-[#866544] text-white hover:bg-[#866544]/90"
                  >
                    Sign in
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>

                <p className="mt-6 text-center text-sm text-[#7A5C3A]">
                  <Link
                    href="/"
                    className="font-medium text-[#866544] hover:underline"
                  >
                    Return to public site
                  </Link>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}