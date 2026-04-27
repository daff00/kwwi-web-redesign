'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { createProductSchema, type CreateProductInput } from '@kwwi/shared';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Field,
  FieldLabel,
  FieldError,
} from '@/components/ui/field';
import { Separator } from '@/components/ui/separator';
import { Trash2, Plus, ImageIcon } from 'lucide-react';

type Product = Awaited<ReturnType<typeof api.getProducts>>[number];

interface ProductManagerProps {
  initialProducts: Product[];
  accessToken: string;
}

export default function ProductManager({
  initialProducts,
  accessToken,
}: ProductManagerProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateProductInput>({
    resolver: zodResolver(createProductSchema),
    defaultValues: { name: '', description: '' },
  });

  async function onSubmit(values: CreateProductInput) {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('description', values.description);
      if (imageFile) formData.append('image', imageFile);

      await api.createProduct(formData, accessToken);
      toast.success('Product created!');

      const updated = await api.getProducts();
      setProducts(updated);
      reset();
      setImageFile(null);
      setIsDialogOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create product');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await api.deleteProduct(id, accessToken);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success('Product deleted');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete product');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Products</h2>
          <p className="text-sm text-muted-foreground">
            {products.length} product{products.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

              {/* Name field */}
              <Controller
                name="name"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="name">Product Name</FieldLabel>
                    <Input
                      {...field}
                      id="name"
                      placeholder="Product name"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Description field */}
              <Controller
                name="description"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="description">Description</FieldLabel>
                    <Textarea
                      {...field}
                      id="description"
                      placeholder="Product description"
                      rows={3}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Image upload */}
              <Field>
                <FieldLabel>Image (optional)</FieldLabel>
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                  />
                  {imageFile && (
                    <Badge variant="secondary">
                      <ImageIcon className="mr-1 h-3 w-3" />
                      {imageFile.name}
                    </Badge>
                  )}
                </div>
              </Field>

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? 'Creating...' : 'Create Product'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Separator />

      {products.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No products yet. Add your first one!
        </div>
      ) : (
        <div className="grid gap-4">
          {products.map((product) => (
            <Card key={product.id}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-medium">
                  {product.name}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                  onClick={() => handleDelete(product.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {product.description}
                </p>
                {product.image_url && (
                  <Badge variant="outline" className="mt-2">
                    Has image
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}