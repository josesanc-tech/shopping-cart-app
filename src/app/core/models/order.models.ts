export interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  orderDate: string;
  subtotal: number;
  discountAmount: number;
  totalAmount: number;
  items: OrderItem[];
}
