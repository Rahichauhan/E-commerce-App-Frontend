import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import type { OrderRequestDTO, ResponseDTO, OrderResponseDTO } from "../types/order";
import { placeOrder } from "../api/orderApi";
import { HttpStatusCode } from "axios";

interface CartItem {
  inventoryId: string;
  productName: string;
  quantity: number;
  price: number;
}

type PaymentMode = "CARD" | "UPI" | "COD";

export default function PlaceOrderPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const cartItems: CartItem[] = (location.state as { cart?: CartItem[] })?.cart || [];

  const [paymentMode, setPaymentMode] = useState<PaymentMode>("CARD");
  const [address, setAddress] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Redirect if cart is empty
  useEffect(() => {
    if (!cartItems.length) {
      navigate("/cart");
    }
  }, [cartItems, navigate]);

  const totalAmount = cartItems.reduce((sum, item) => {
    const price = Number(item.price);
    const quantity = Number(item.quantity);

    if (isNaN(price) || isNaN(quantity)) return sum;

    return sum + price * quantity;
  }, 0);

  const handlePlaceOrder = async () => {
    setError(null);
    setSuccessMessage(null);

    const customerId = localStorage.getItem("uid");
    if (!customerId) {
      setError("User not logged in.");
      return;
    }
    if (!address.trim()) {
      setError("Please enter a shipping address.");
      return;
    }

    const orderRequest: OrderRequestDTO = {
      customerId,
      paymentMode,
      totalAmount,
      address,
      items: cartItems.map((item) => ({
        inventoryId: item.inventoryId,
        productName: item.productName,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    setLoading(true);
    try {
      const response: ResponseDTO<OrderResponseDTO> = await placeOrder(orderRequest);
      if ((response.status.toString() == "OK" || response.status.toString() == "CREATED" ) && response.data) {
        setSuccessMessage(`Order placed successfully! Order ID: ${response.data.orderId}`);
      } else {
        setError(response.message || "Failed to place order");
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Error placing order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Place Order</h2>

      <h3 className="text-lg font-semibold text-gray-700 mb-2">Cart Summary</h3>
      <ul className="divide-y divide-gray-200 mb-4">
        {cartItems.map((item) => {
          const price = Number(item.price);
          const quantity = Number(item.quantity);
          const itemTotal = (!isNaN(price) && !isNaN(quantity)) ? (price * quantity).toFixed(2) : "0.00";
          return (
            <li key={item.inventoryId} className="py-2 flex justify-between text-gray-700">
              <span>{item.productName} ({!isNaN(quantity) ? quantity : 0})</span>
              <span>₹{itemTotal}</span>
            </li>
          );
        })}
      </ul>
      <p className="text-lg font-semibold text-gray-800 mb-4">
        Total: ₹{totalAmount.toFixed(2)}
      </p>

      {/* Payment Mode */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">Payment Mode:</label>
        <select
          value={paymentMode}
          onChange={(e) => setPaymentMode(e.target.value as PaymentMode)}
          className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
        >
          <option value="CARD">Card</option>
          <option value="UPI">UPI</option>
          <option value="COD">Cash on Delivery</option>
        </select>
      </div>

      {/* Address */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">Shipping Address:</label>
        <textarea
          rows={3}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter shipping address"
          className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Error & Success */}
      {error && <p className="text-red-500 mb-3">{error}</p>}
      {successMessage && (
        <div className="mb-4">
          <p className="text-green-600 mb-3">{successMessage}</p>
          <button
            onClick={() => navigate("/home")}
            className="w-full py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition"
          >
            Continue Shopping
          </button>
        </div>
      )}

      {/* Place Order Button */}
      <button
        onClick={handlePlaceOrder}
        disabled={loading}
        className={`w-full py-2 rounded-lg text-white font-semibold transition 
          ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
      >
        {loading ? "Placing order..." : "Place Order"}
      </button>
    </div>
  );
}
