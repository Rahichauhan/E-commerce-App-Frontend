import React from 'react';
import type { OrderResponseDTO } from '../types/order';

interface OrderDetailsProps {
  order: OrderResponseDTO;
}

export default function OrderDetails({ order }: OrderDetailsProps) {
  return (
    <div>
      <h3>Order Details for #{order.orderId}</h3>
      <p>Status: {order.orderStatus}</p>
      <p>Payment Mode: {order.paymentMode}</p>
      <p>Total Amount: ₹{order.totalAmount.toFixed(2)}</p>
      <p>Address: {order.address}</p>

      <h4>Items:</h4>
      <ul>
        {order.items.map(item => (
          <li key={item.inventoryId}>
            <strong>{item.productName}</strong> — Quantity: {item.quantity} — Price: ₹{item.price.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
}
