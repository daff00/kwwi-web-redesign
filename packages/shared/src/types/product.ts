export interface Product {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
  image_path: string | null;
  sort_order: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}
