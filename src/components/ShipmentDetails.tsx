// inside your component file
import { useState } from 'react';
import {
  fetchShipmentById,
  updateShipmentStatus,
  cancelShipment,
  deleteShipment,
} from '../api/shipmentApi';

interface Shipment {
  orderId: string;
  shipmentStatus: string;
  estimatedArrival: string;
  shippedToAddress: string;
}

interface ShipmentDetailsProps {
  isAdmin: boolean;
}

const shipmentStatuses = [
  'PENDING',
  'PROCESSING',
  'SHIPPED',
  'IN_TRANSIT',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'CANCELLED',
  'RETURNED',
  'FAILED_DELIVERY',
];

export default function ShipmentDetails({ isAdmin }: ShipmentDetailsProps) {
  const [shipmentId, setShipmentId] = useState<string>('');
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('PENDING');

  const handleFetch = async () => {
    const res = await fetchShipmentById(shipmentId);
    if (res.data) {
      setShipment(res.data);
      setSelectedStatus(res.data.shipmentStatus);
    } else {
      setShipment(null);
      alert(res.message);
    }
  };

  const handleStatusUpdate = async () => {
    const res = await updateShipmentStatus(shipmentId, selectedStatus);
    if (res.data) {
      await handleFetch();
    } else {
      alert(res.message);
    }
  };

  const handleCancel = async () => {
    if (!shipment) return;
    const res = await cancelShipment(shipment.orderId);
    if (res.data !== null || res.status === 200) {
      await handleFetch();
    } else {
      alert(res.message);
    }
  };

  const handleDelete = async () => {
    const res = await deleteShipment(shipmentId);
    if (res.data !== null || res.status === 200) {
      setShipment(null);
    } else {
      alert(res.message);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 space-y-4 w-full max-w-lg mt-6">
      <h3 className="text-lg font-semibold text-gray-800">Shipment Details</h3>

      <div className="flex gap-2">
        <input
          placeholder="Shipment ID"
          value={shipmentId}
          onChange={(e) => setShipmentId(e.target.value)}
          className="flex-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={handleFetch}
          className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md transition duration-200"
        >
          Fetch
        </button>
      </div>

      {shipment && (
        <div className="border-t pt-4 space-y-2">
          <p><strong>Order ID:</strong> {shipment.orderId}</p>
          <p><strong>Status:</strong> {shipment.shipmentStatus}</p>
          <p><strong>Estimated Arrival:</strong> {shipment.estimatedArrival}</p>
          <p><strong>Address:</strong> {shipment.shippedToAddress}</p>

          {isAdmin && (
            <div className="mt-4 space-y-4">
              <div className="flex gap-2 items-center">
                <label htmlFor="status" className="font-medium">Update Status:</label>
                <select
                  id="status"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="border border-gray-300 p-2 rounded-md"
                >
                  {shipmentStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleStatusUpdate}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-200"
                >
                  Update Status
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleCancel}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-md transition duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
