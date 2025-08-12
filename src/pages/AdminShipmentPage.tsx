import React, { type JSX } from 'react';
import ShipmentForm from '../components/ShipmentForm';
import ShipmentDetails from '../components/ShipmentDetails';

export default function AdminShipmentPage(): JSX.Element {
  return (
    <div>
      <h2>Admin Shipment Dashboard</h2>
      <ShipmentForm />
      <ShipmentDetails isAdmin={true} />
    </div>
  );
}
