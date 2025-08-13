import { useState, type ChangeEvent, type FormEvent } from 'react';
import { addShipment } from '../api/shipmentApi';
import type { ShipmentRequestDTO } from '../types/shipment';

export default function ShipmentForm() {
  const [orderId, setOrderId] = useState<string>('');
  const [address, setAddress] = useState<string>('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const shipmentData: ShipmentRequestDTO = {
      orderId,
      address,
    };

    try {
      await addShipment(shipmentData);
      alert('Shipment Added Successfully');
      setOrderId('');
      setAddress('');
    } catch (err) {
      alert('Error adding shipment');
      console.error(err);
    }
  };

  const handleOrderIdChange = (e: ChangeEvent<HTMLInputElement>) => setOrderId(e.target.value);
  const handleAddressChange = (e: ChangeEvent<HTMLInputElement>) => setAddress(e.target.value);

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-lg p-6 space-y-4 w-full max-w-md"
    >
      <h3 className="text-lg font-semibold text-gray-800">Add New Shipment</h3>

      <input
        type="text"
        placeholder="Order ID (UUID)"
        value={orderId}
        onChange={handleOrderIdChange}
        required
        pattern="[0-9a-fA-F\-]{36}"
        title="Enter a valid UUID"
        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <input
        type="text"
        placeholder="Shipping Address"
        value={address}
        onChange={handleAddressChange}
        required
        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md transition duration-200"
      >
        Add Shipment
      </button>
    </form>
  );
}
