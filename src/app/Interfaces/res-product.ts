import { Review } from './review';

export interface ResProduct {
  id: number;
  title: string;
  description: string;
  category: string;
  sellingPrice: number;
  imageUrl: string;
  reviews: Review[];
  stock: number;
  avgReview: number;
  reviewCount: number;
}
