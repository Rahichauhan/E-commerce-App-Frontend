import { useEffect, useState } from 'react';
import { getOrdersByCustomerId, cancelOrder } from '../api/orderApi';
import type { OrderResponseDTO } from '../types/order';
import OrderDetails from '../components/OrderDetails';
import { HttpStatusCode } from 'axios';

export default function OrderListPage() {
  const [orders, setOrders] = useState<OrderResponseDTO[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderResponseDTO | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cancelMessages, setCancelMessages] = useState<Record<string, string>>({});

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
      if (response.status.toString() == "OK") {
        setCancelMessages(prev => ({ ...prev, [id]: '✅ Order cancelled successfully' }));
        if (customerId) fetchOrders(customerId);
        setSelectedOrder(null);
      } else {
        setCancelMessages(prev => ({ ...prev, [id]: '❌ Failed to cancel order' }));
      }
    } catch {
      setCancelMessages(prev => ({ ...prev, [id]: '⚠️ Error cancelling order' }));
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Your Orders</h2>

      {error && <p className="text-red-500 mb-3">{error}</p>}

      <ul className="space-y-4">
        {orders.map(order => (
          <li
            key={order.id}
            className="bg-white shadow rounded-lg p-4 border border-gray-200"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">Order {order.id}</p>
                <p className="text-gray-500">Status: {order.orderStatus}</p>
              </div>

              <div className="flex flex-col space-y-2">
                <div className="flex space-x-2">
                  <button
                    onClick={() =>
                      setSelectedOrder(selectedOrder?.id === order.id ? null : order)
                    }
                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {selectedOrder?.id === order.id ? 'Hide Details' : 'View Details'}
                  </button>

                  {order.orderStatus !== 'CANCELLED' && (
                    <button
                      onClick={() => handleCancel(order.id)}
                      className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>

                {cancelMessages[order.id] && (
                  <p
                    className={`text-sm ${
                      cancelMessages[order.id].includes('successfully')
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {cancelMessages[order.id]}
                  </p>
                )}
              </div>
            </div>

            {selectedOrder?.id === order.id && (
              <div className="mt-4 border-t pt-4">
                <OrderDetails order={selectedOrder} />
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
