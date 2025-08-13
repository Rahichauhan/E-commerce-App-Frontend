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

export default function ShipmentDetails({ isAdmin }: ShipmentDetailsProps) {
  const [shipmentId, setShipmentId] = useState<string>('');
  const [shipment, setShipment] = useState<Shipment | null>(null);

  const handleFetch = async () => {
    try {
      const res = await fetchShipmentById(shipmentId);
      if (res.data) {
        setShipment(res.data as Shipment);
      } else {
        setShipment(null);
        alert('Shipment not found');
      }
    } catch (error) {
      alert('Shipment not found');
      setShipment(null);
    }
  };

  const handleStatusUpdate = async (status: string) => {
    try {
      await updateShipmentStatus(shipmentId, status);
      await handleFetch();
    } catch {
      alert('Error updating status');
    }
  };

  const handleCancel = async () => {
    if (!shipment) return;
    try {
      await cancelShipment(shipment.orderId);
      await handleFetch();
    } catch {
      alert('Error cancelling shipment');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteShipment(shipmentId);
      setShipment(null);
    } catch {
      alert('Error deleting shipment');
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
            <div className="flex flex-wrap gap-2 mt-4">
              <button
                onClick={() => handleStatusUpdate('DELIVERED')}
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition duration-200"
              >
                Mark Delivered
              </button>
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
          )}
        </div>
      )}
    </div>
  );
}
