import { type JSX } from 'react';
import ShipmentForm from '../components/ShipmentForm';
import ShipmentDetails from '../components/ShipmentDetails';
import AdminLayout from '../layouts/AdminLayout';

export default function AdminShipmentPage(): JSX.Element {
  return (
    <AdminLayout>
      <h2 className="text-2xl font-bold mb-4">Admin Shipment Dashboard</h2>
      <ShipmentForm />
      <ShipmentDetails isAdmin={true} />
    </AdminLayout>
  );
}
