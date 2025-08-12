import React, { useEffect, useState } from 'react';
import { getOrdersByCustomerId, cancelOrder } from '../api/orderApi';
import type { OrderResponseDTO } from '../types/order';
import OrderDetails from '../components/OrderDetails';

export default function OrderListPage() {
  const [orders, setOrders] = useState<OrderResponseDTO[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderResponseDTO | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cancelMessage, setCancelMessage] = useState<string | null>(null);

  const customerId = localStorage.getItem('customerId');

  useEffect(() => {
    if (customerId) {
      fetchOrders(customerId);
    } else {
      setError('Customer ID not found. Please log in again.');
    }
  }, []);

  const fetchOrders = async (id: string) => {
    try {
      const response = await getOrdersByCustomerId(id);
      if (response.data) {
        setOrders(response.data);
        setError(null);
      } else {
        setError(response.message || 'No orders found');
      }
    } catch {
      setError('Failed to fetch orders');
    }
  };

  const handleCancel = async (orderId: string) => {
    try {
      const response = await cancelOrder(orderId);
      if (response.status === 200) {
        setCancelMessage('Order cancelled successfully');
        if (customerId) fetchOrders(customerId);
        setSelectedOrder(null);
      } else {
        setCancelMessage('Failed to cancel order');
      }
    } catch {
      setCancelMessage('Error cancelling order');
    }
  };

  return (
    <div>
      <h2>Your Orders</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {cancelMessage && <p>{cancelMessage}</p>}
      <ul>
        {orders.map(order => (
          <li key={order.orderId}>
            Order #{order.orderId} - Status: {order.orderStatus}
            <button onClick={() => setSelectedOrder(order)}>View Details</button>
            {order.orderStatus !== 'CANCELLED' && (
              <button onClick={() => handleCancel(order.orderId)}>Cancel Order</button>
            )}
          </li>
        ))}
      </ul>
      {selectedOrder && <OrderDetails order={selectedOrder} />}
    </div>
  );
}
