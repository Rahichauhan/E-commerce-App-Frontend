import { useState } from 'react';
import type { OrderResponseDTO } from '../types/order';
import type { ShipmentDTO, ResponseDTO } from '../types/shipment';
import { fetchShipmentByOrderId } from '../api/shipmentApi';

interface OrderDetailsProps {
  order: OrderResponseDTO;
}

export default function OrderDetails({ order }: OrderDetailsProps) {
  const [shipment, setShipment] = useState<ShipmentDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [showShipment, setShowShipment] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleToggleShipment = async () => {
    if (!showShipment) {
      setLoading(true);
      setError(null);
      try {
        const res: ResponseDTO<ShipmentDTO> = await fetchShipmentByOrderId(order.id);
        if (res.data) {
          setShipment(res.data);
        } else {
          setError('No shipment details found.');
        }
      } catch (err) {
        setError('Failed to fetch shipment details.');
      } finally {
        setLoading(false);
      }
    }
    setShowShipment(!showShipment);
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
      <h3 className="text-lg font-semibold mb-2 text-gray-800">
        Order Details for {order.id}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 mb-4 text-sm text-gray-700">
        <p>
          <span className="font-medium">Status:</span> {order.orderStatus}
        </p>
        <p>
          <span className="font-medium">Payment Mode:</span> {order.paymentMode}
        </p>
        <p>
          <span className="font-medium">Total Amount:</span> ₹{order.totalAmount.toFixed(2)}
        </p>
        <p className="sm:col-span-2">
          <span className="font-medium">Address:</span> {order.address}
        </p>
      </div>

      <h4 className="text-md font-semibold text-gray-800 mb-2">Items:</h4>
      <ul className="space-y-2 mb-4">
        {order.items.map(item => (
          <li
            key={item.inventoryId}
            className="bg-white p-3 rounded border border-gray-200 shadow-sm flex justify-between items-center"
          >
            <div>
              <p className="font-medium text-gray-900">{item.productName}</p>
              <p className="text-gray-500 text-sm">
                Quantity: {item.quantity}
              </p>
            </div>
            <p className="font-semibold text-gray-800">
              ₹{item.price.toFixed(2)}
            </p>
          </li>
        ))}
      </ul>

      {/* Toggle Button */}
      <button
        onClick={handleToggleShipment}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors duration-200"
      >
        {showShipment ? 'Hide Shipment Details' : 'Track Shipment'}
      </button>

      {/* Shipment Details */}
      {showShipment && (
        <div className="mt-4">
          {loading && <p className="text-gray-500">Loading shipment details...</p>}
          {error && <p className="text-red-600">{error}</p>}
          {shipment && (
            <div className="bg-white p-4 rounded border border-gray-200 shadow-sm text-sm text-gray-700">
              <p><span className="font-medium">Shipment Date:</span> {shipment.shipmentDate}</p>
              <p><span className="font-medium">Estimated Arrival:</span> {shipment.estimatedArrival}</p>
              <p><span className="font-medium">Shipped To:</span> {shipment.shippedToAddress}</p>
              <p><span className="font-medium">Status:</span> {shipment.shipmentStatus}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

