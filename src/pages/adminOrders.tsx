import { useEffect, useState } from 'react';
import {
  getAllOrders,
  getOrdersByCustomerId,
  getOrderById,
} from '../api/orderApi';
import type { OrderResponseDTO } from '../types/order';
import OrderDetails from '../components/OrderDetails';
import AdminLayout from '../layouts/AdminLayout';

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
    <AdminLayout>
      <h2 className="text-xl font-bold mb-4">Admin Order Management</h2>

      <div className="mb-4 flex space-x-2">
        <input
          type="text"
          placeholder="Enter Customer ID"
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          onClick={fetchOrdersByCustomer}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Search by Customer
        </button>
        <button
          onClick={fetchAllOrders}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Show All Orders
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {orders.length === 0 && !error && <p>No orders found.</p>}

      <ul className="space-y-2">
        {orders.map((order) => (
          <li key={order.orderId} className="border p-3 rounded">
            <strong>Order #{order.orderId}</strong> — Status: <em>{order.orderStatus}</em>{' '}
            <button
              onClick={() => fetchOrderDetails(order.orderId)}
              className="ml-2 px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
            >
              View Details
            </button>
          </li>
        ))}
      </ul>

      {selectedOrder && (
        <div className="mt-4">
          <OrderDetails order={selectedOrder} />
        </div>
      )}
    </AdminLayout>
  );
}
