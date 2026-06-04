import { ResProduct } from './res-product';
import { User } from './user';

export interface Review {
  productId: number;
  userId: number;
  email: string;
  reviewValue: string;
  reviewDescription: string;

  resProduct: ResProduct;
  user: User;
}
