import { customerDetails } from './customer-details';
import { OrderItems } from './orderItems';
import { User } from './user';

export interface Order {
  userId: number;
  customerDetails: customerDetails;
  createdAt: Date;
  orderItems: OrderItems[];
  orderTotal: number;
  status: string;
}
