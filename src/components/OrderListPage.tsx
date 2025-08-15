import { useEffect, useState } from 'react';
import { getOrdersByCustomerId, cancelOrder } from '../api/orderApi';
import type { OrderResponseDTO } from '../types/order';
import OrderDetails from '../components/OrderDetails';

export default function OrderListPage() {
  const [orders, setOrders] = useState<OrderResponseDTO[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderResponseDTO | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cancelMessage, setCancelMessage] = useState<string | null>(null);

  const customerId = localStorage.getItem('uid');

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

  const handleCancel = async (id: string) => {
    try {
      const response = await cancelOrder(id);
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
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Your Orders</h2>

      {error && <p className="text-red-500 mb-3">{error}</p>}
      

      <ul className="space-y-4">
        {orders.map(order => (
          <li
            key={order.orderId}
            className="bg-white shadow rounded-lg p-4 border border-gray-200"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">Order {order.id}</p>
                <p className="text-gray-500">Status: {order.orderStatus}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() =>
                    setSelectedOrder(
                      selectedOrder?.orderId === order.orderId ? null : order
                    )
                  }
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {selectedOrder?.id === order.id
                    ? 'Hide Details'
                    : 'View Details'}
                </button>

                {selectedOrder?.id === order.id && (
                  <div className="mt-4 border-t pt-4">
                    <OrderDetails order={selectedOrder} />
                  </div>
                )}
                
                {order.orderStatus !== 'CANCELLED' && (
                  <button
                    onClick={() => handleCancel(order.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Cancel Order
                  </button>
                )}

                {cancelMessage && <p className="text-green-600 mb-3">{cancelMessage}</p>}
              </div>
            </div>

          </li>
        ))}
      </ul>
    </div>
  );
}
