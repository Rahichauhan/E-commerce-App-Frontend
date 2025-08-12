import React, { useEffect, useState } from 'react';
import {
  getAllOrders,
  getOrdersByCustomerId,
  getOrderById,
} from '../api/orderApi';
import type { OrderResponseDTO } from '../types/order';
import OrderDetails from '../components/OrderDetails';

export default function AdminOrderManagementPage() {
  const [orders, setOrders] = useState<OrderResponseDTO[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderResponseDTO | null>(null);
  const [customerId, setCustomerId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const fetchAllOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllOrders();
      if (response.data) {
        setOrders(response.data);
      } else {
        setError(response.message || 'No orders found');
      }
    } catch {
      setError('Failed to fetch all orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrdersByCustomer = async () => {
    if (!customerId.trim()) {
      setError('Please enter a customer ID');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await getOrdersByCustomerId(customerId);
      if (response.data) {
        setOrders(response.data);
        setSelectedOrder(null);
      } else {
        setError(response.message || 'No orders found for this customer');
        setOrders([]);
      }
    } catch {
      setError('Failed to fetch orders for customer');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetails = async (orderId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getOrderById(orderId);
      if (response.data) {
        setSelectedOrder(response.data);
      } else {
        setError(response.message || 'Order not found');
      }
    } catch {
      setError('Failed to fetch order details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Admin Order Management</h2>

      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Enter Customer ID"
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
        />
        <button onClick={fetchOrdersByCustomer}>Search by Customer</button>
        <button onClick={fetchAllOrders} style={{ marginLeft: '1rem' }}>
          Show All Orders
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {orders.length === 0 && !error && <p>No orders found.</p>}

      <ul>
        {orders.map((order) => (
          <li key={order.orderId}>
            <strong>Order #{order.orderId}</strong> — Status: <em>{order.orderStatus}</em>{' '}
            <button onClick={() => fetchOrderDetails(order.orderId)}>
              View Details
            </button>
          </li>
        ))}
      </ul>

      {selectedOrder && <OrderDetails order={selectedOrder} />}
    </div>
  );
}
