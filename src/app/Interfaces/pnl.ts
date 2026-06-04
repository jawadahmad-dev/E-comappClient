import { ResProduct } from './res-product';

export interface Pnl {
  productId: number;
  profitnLoss: number;
  sellItemsQty: number;
  rank: number;
  resProduct: ResProduct;
}
