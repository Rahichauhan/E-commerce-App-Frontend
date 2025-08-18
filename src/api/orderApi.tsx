import type {
  ResponseDTO,
  OrderRequestDTO,
  OrderResponseDTO,
} from '../types/order';

const BASE_URL = 'http://localhost:8083/api/orders';

const getAuthHeader = () => {
  const token = localStorage.getItem('jwt');
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};



// ✅ Get orders by customer ID
export async function getOrdersByCustomerId(
  customerId: string
): Promise<ResponseDTO<OrderResponseDTO[]>> {
  const res = await fetch(`${BASE_URL}/customer/${customerId}`, {
    headers: getAuthHeader(),
  });
  return res.json();
}

// ✅ Get order by order ID
export async function getOrderById(
  orderId: string
): Promise<ResponseDTO<OrderResponseDTO>> {
  const res = await fetch(`${BASE_URL}/${orderId}`, {
    headers: getAuthHeader(),
  });
  return res.json();
}

// ✅ Cancel an order
export async function cancelOrder(
  orderId: string
): Promise<ResponseDTO<null>> {
  const res = await fetch(`${BASE_URL}/${orderId}/cancel`, {
    method: 'PUT',
    headers: getAuthHeader(),
  });
  return res.json();
}

// ✅ Get all orders (admin only)
export async function getAllOrders(): Promise<ResponseDTO<OrderResponseDTO[]>> {
  const res = await fetch(BASE_URL, {
    headers: getAuthHeader(),
  });
  return res.json();
}

// ✅ Place an order using /createOrder endpoint
export async function placeOrder(
  order: OrderRequestDTO
): Promise<ResponseDTO<OrderResponseDTO>> {
  const res = await fetch(`${BASE_URL}/createOrder`, {
    method: 'POST',
    headers: getAuthHeader(),
    body: JSON.stringify(order),
  });
  return res.json();
}
