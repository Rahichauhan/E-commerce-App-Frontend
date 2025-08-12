export interface ShipmentDTO {
  shipmentId: string;
  orderId: string;
  shipmentDate: string;
  estimatedArrival: string;
  shippedToAddress: string;
  shipmentStatus: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResponseDTO<T> {
  message: string;
  data: T | null;
  status: number;
  timestamp: string;
}
export interface ShipmentRequestDTO {
  orderId: string; // Use string here because input returns string, convert to UUID on backend
  address: string;
}