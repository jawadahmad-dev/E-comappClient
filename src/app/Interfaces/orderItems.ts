import { ResProduct } from './res-product';

export interface OrderItems {
  orderId: number;
  productId: number;
  quantity: number;
  productTotal: number;
  resProduct: ResProduct;
}
