import React, { type JSX } from 'react';
import ShipmentDetails from '../components/ShipmentDetails';

export default function UserShipmentPage(): JSX.Element {
  return (
    <div>
      <h2>Track Your Shipment</h2>
      <ShipmentDetails isAdmin={false} />
    </div>
  );
}
