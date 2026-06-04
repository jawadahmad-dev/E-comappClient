export interface createProduct {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  sellingPrice: number;
  imageUrl: string;
  stock: number;
  avgReview?: number;
  reviewCount?: number;
}
