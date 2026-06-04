import { ResProduct } from './res-product';
import { User } from './user';

export interface CartItems {
  id: number;
  productId: number;
  quantity: number;
  productTotal: number;
  resProduct: ResProduct;
  user: User;
}
