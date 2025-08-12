import React, { useState } from 'react';
import type { OrderRequestDTO, ResponseDTO, OrderResponseDTO } from '../types/order';
import { placeOrder } from '../api/orderApi';

interface CartItem {
  inventoryId: string;
  productName: string;
  quantity: number;
  price: number;
}

interface PlaceOrderPageProps {
  cartItems: CartItem[];
  onOrderPlaced?: (order: OrderResponseDTO) => void;
}

export default function PlaceOrderPage({ cartItems, onOrderPlaced }: PlaceOrderPageProps) {
  const [paymentMode, setPaymentMode] = useState('CREDIT_CARD');
  const [address, setAddress] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePlaceOrder = async () => {
    setError(null);
    setSuccessMessage(null);

    const customerId = localStorage.getItem('customerId');
    if (!customerId) {
      setError('User not logged in.');
      return;
    }
    if (!address.trim()) {
      setError('Please enter a shipping address.');
      return;
    }

    const orderRequest: OrderRequestDTO = {
      customerId,
      paymentMode,
      totalAmount,
      address,
      items: cartItems.map(item => ({
        inventoryId: item.inventoryId,
        productName: item.productName,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    setLoading(true);
    try {
      const response: ResponseDTO<OrderResponseDTO> = await placeOrder(orderRequest);
      if ((response.status === 200 || response.status === 201) && response.data) {
        setSuccessMessage(`Order placed successfully! Order ID: ${response.data.orderId}`);
        if (onOrderPlaced) onOrderPlaced(response.data);
      } else {
        setError(response.message || 'Failed to place order');
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error placing order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Place Order</h2>

      <h3>Cart Summary</h3>
      <ul>
        {cartItems.map(item => (
          <li key={item.inventoryId}>
            {item.productName} — Qty: {item.quantity} — Price: ₹{item.price.toFixed(2)}
          </li>
        ))}
      </ul>
      <p><strong>Total: ₹{totalAmount.toFixed(2)}</strong></p>

      <div>
        <label>
          Payment Mode:
          <select value={paymentMode} onChange={e => setPaymentMode(e.target.value)}>
            <option value="CREDIT_CARD">Credit Card</option>
            <option value="DEBIT_CARD">Debit Card</option>
            <option value="COD">Cash on Delivery</option>
          </select>
        </label>
      </div>

      <div>
        <label>
          Shipping Address:
          <textarea
            rows={3}
            value={address}
            onChange={e => setAddress(e.target.value)}
            placeholder="Enter shipping address"
          />
        </label>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

      <button onClick={handlePlaceOrder} disabled={loading}>
        {loading ? 'Placing order...' : 'Place Order'}
      </button>
    </div>
  );
}
