import type { Metadata } from 'next';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Products',
  description: 'Explore our products',
};

export default async function ProductsPage() {
  let products: Awaited<ReturnType<typeof api.getProducts>> = [];

  try {
    products = await api.getProducts();
  } catch {
    // Server not running or no products yet — show empty state
  }

  return (
    <div className="container mx-auto py-16 px-4">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold mb-3">Our Products</h1>
        <p className="text-muted-foreground text-lg">
          Explore what we have to offer
        </p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20">
          <Badge variant="secondary" className="text-base px-4 py-2">
            No products yet
          </Badge>
          <p className="text-muted-foreground mt-4">
            Check back soon!
          </p>
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