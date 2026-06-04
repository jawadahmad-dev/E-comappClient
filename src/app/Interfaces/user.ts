import { CartItems } from './cart-item';
import { customerDetails } from './customer-details';
export interface User {
  name: string;
  email: string;
  password: string;
  role: string;
  isDeleted: boolean;
  cart: CartItems[];
  createdAt: Date;
  customerDetails: customerDetails;
}
