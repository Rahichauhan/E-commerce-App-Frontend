import React, { useState, type ChangeEvent, type FormEvent } from 'react';
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
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Order ID (UUID)"
        value={orderId}
        onChange={handleOrderIdChange}
        required
        pattern="[0-9a-fA-F\-]{36}" // basic UUID format validation
        title="Enter a valid UUID"
      />
      <input
        type="text"
        placeholder="Shipping Address"
        value={address}
        onChange={handleAddressChange}
        required
      />
      <button type="submit">Add Shipment</button>
    </form>
  );
}
