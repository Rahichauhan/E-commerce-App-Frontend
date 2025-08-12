export interface OrderItemResponseDTO {
  inventoryId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface OrderResponseDTO {
  orderId: string;
  customerId: string;
  orderStatus: string;
  paymentMode: string;
  totalAmount: number;
  address: string;
  items: OrderItemResponseDTO[];
}

export interface OrderRequestDTO {
  customerId: string;
  paymentMode: string;
  totalAmount: number;
  address: string;
  items: {
    inventoryId: string;
    productName: string;
    quantity: number;
    price: number;
  }[];
}

export interface ResponseDTO<T> {
  message: string;
  data: T | null;
  status: number;
  timestamp: string;
}
