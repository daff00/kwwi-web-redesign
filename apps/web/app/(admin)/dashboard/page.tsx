import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { logout } from "../actions";
import { api } from "@/lib/api";
import ProductManager from "@/components/sections/ProductManager";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!user || !session) redirect("/login");

  let products: Awaited<ReturnType<typeof api.getProducts>> = [];
  try {
    products = await api.getProducts();
  } catch {
    // Express server not running
  }

  return (
    <div className="min-h-screen bg-muted/40 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <form action={logout as unknown as string}>
            <Button variant="outline" type="submit">
              Sign out
            </Button>
          </form>
        </div>

        {/* Admin info */}
        <Card>
          <CardHeader>
            <CardTitle>Welcome back</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Logged in as{" "}
              <span className="font-medium text-foreground">{user.email}</span>
            </p>
          </CardContent>
        </Card>

        <Separator />

        {/* Product management */}
        <ProductManager
          initialProducts={products}
          accessToken={session.access_token}
        />
      </div>
    </div>
  );
}
