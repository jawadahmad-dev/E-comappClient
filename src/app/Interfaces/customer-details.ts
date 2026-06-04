import { Order } from './order';

export interface customerDetails {
  userId: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  orders: Order[];
}
