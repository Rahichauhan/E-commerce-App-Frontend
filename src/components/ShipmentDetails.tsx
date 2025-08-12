import React, { useState } from 'react';
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
  console.log("Fetching shipment with ID:", shipmentId);
  try {
    const res = await fetchShipmentById(shipmentId);
    console.log("API response:", res);
    if (res.data) {
      setShipment(res.data as Shipment);
    } else {
      setShipment(null);
      alert('Shipment not found');
    }
  } catch (error) {
    console.error(error);
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
    <div>
      <input
        placeholder="Shipment ID"
        value={shipmentId}
        onChange={(e) => setShipmentId(e.target.value)}
      />
      <button onClick={handleFetch}>Fetch Shipment</button>

      {shipment && (
        <div>
          <p><strong>Order ID:</strong> {shipment.orderId}</p>
          <p><strong>Status:</strong> {shipment.shipmentStatus}</p>
          <p><strong>Estimated Arrival:</strong> {shipment.estimatedArrival}</p>
          <p><strong>Address:</strong> {shipment.shippedToAddress}</p>

          {isAdmin && (
            <>
              <button onClick={() => handleStatusUpdate('DELIVERED')}>Mark Delivered</button>
              <button onClick={handleCancel}>Cancel Shipment</button>
              <button onClick={handleDelete}>Delete Shipment</button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
