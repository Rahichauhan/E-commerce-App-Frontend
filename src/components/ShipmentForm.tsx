import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchShipments } from '../api/shipmentApi';
import type { ShipmentDTO } from '../types/shipment';

export default function AdminShipmentPage() {
  const [shipments, setShipments] = useState<ShipmentDTO[]>([]);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem('token');
  console.log('Admin token:', token); // ✅ log the token

  const navigate = useNavigate();

  useEffect(() => {
    const loadShipments = async () => {
      try {
        const res = await fetchShipments ();
        if (res.data) {
          setShipments(res.data);
        } else {
          setError(res.message || 'No shipment data found');
        }
      } catch (err) {
        setError('Failed to fetch shipment data');
      }
    };

    loadShipments();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">All Shipments</h2>
        <button
          onClick={() => navigate('/admin/shipment-details')}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition duration-200"
        >
          Modify Shipment
        </button>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="space-y-4">
        {shipments.map((shipment) => (
          <div
            key={shipment.shipmentId}
            className="border border-gray-300 p-4 rounded-md bg-white shadow-sm"
          >
            <p><strong>Shipment ID:</strong> {shipment.shipmentId}</p>
            <p><strong>Order ID:</strong> {shipment.orderId}</p>
            <p><strong>Status:</strong> {shipment.shipmentStatus}</p>
            <p><strong>Address:</strong> {shipment.shippedToAddress}</p>
            <p><strong>Estimated Arrival:</strong> {shipment.estimatedArrival}</p>
            <p><strong>Created At:</strong> {new Date(shipment.createdAt).toLocaleString()}</p>
            <p><strong>Updated At:</strong> {new Date(shipment.updatedAt).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
