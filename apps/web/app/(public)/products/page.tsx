import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Products",
  description: "Explore our products",
};

export default async function ProductsPage() {
  let products: Awaited<ReturnType<typeof api.getProducts>> = [];

  try {
    products = await api.getProducts();
  } catch {
    // Server not running or no products yet — show empty state
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section
        className="relative h-screen flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/hero-bg.png')" }}
      >
        {/* Black 20% Tint Overlay */}
        <div className="absolute inset-0 bg-black/500 z-0"></div>

        {/* Seamless Gradient Fade at the Bottom */}
        {/* Change from-[#866544] to from-white if your next section is actually white */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#866544] to-transparent z-0"></div>

        {/* Content (z-10 keeps it above the tint and gradient) */}
        <div className="relative z-10 text-center">
          <h1 className="text-white text-5xl font-bold drop-shadow-md">
            {" "}
            Products Hero Section
          </h1>
        </div>
      </section>
      {products.length === 0 ? (
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
      )}
    </div>
  );
}
