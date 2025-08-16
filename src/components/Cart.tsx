
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaPlus, FaMinus, FaExclamationCircle } from "react-icons/fa";

interface Product {
  inventoryId: string;
  productId: string;
  productName: string;
  productDesc: string;
  quantityAvailable: number;
  price: number;
  lastUpdated: string;
}

interface CartItem extends Product {
  cartItemId: string,
  selectedQuantity: number;
}

interface CartHoverListProps {
  available: boolean;
  cart: CartItem[];
  onRemoveItem: (inventoryId: string) => void;
  onUpdateQuantity: (newQuantity: number, cartItemId: string) => void;
  onNavigateToCart: () => void;
}

const CartHoverList: React.FC<CartHoverListProps> = ({
  available,
  cart,
  onRemoveItem,
  onUpdateQuantity,
  onNavigateToCart,
}) => {
  const navigate = useNavigate();

  const handleProceedToCart = () => {
    onNavigateToCart();
    navigate("/place-order", { state: { cart } });
  };

  const calculateTotal = () => {
    return cart.reduce(
      (total, item) => total + item.price * item.selectedQuantity,
      0
    );
  };

  if (cart.length === 0 && available) {
    return (
      <div className="absolute top-full right-0 mt-2 w-72 rounded-lg bg-white shadow-xl ring-1 ring-black ring-opacity-5 z-50 p-4 text-center">
        <p className="text-gray-500">Your cart is empty.</p>
      </div>
    );
  }
  if (!available) {
    return (
      <div className="absolute top-full right-0 mt-2 w-72 rounded-lg bg-white shadow-xl ring-1 ring-black ring-opacity-5 z-50 p-4 text-center">
        <div className="flex items-center justify-center gap-2">
          <FaExclamationCircle className="text-red-500" />
          <p className="text-gray-500 m-0">Unable to fetch cart</p>
        </div>
      </div>

    );
  }

  return (
    <div className="absolute top-full right-0 mt-2 w-80 rounded-lg bg-white shadow-xl ring-1 ring-black ring-opacity-5 z-50">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-bold text-gray-900">Your Cart</h3>
      </div>
      <ul className="max-h-60 overflow-y-auto divide-y divide-gray-200">
        {cart.map((item) => (
          <li key={item.inventoryId} className="flex py-4 px-4 items-center">
            <div className="flex-grow">
              <h4 className="text-sm font-medium text-gray-800 line-clamp-1">
                {item.productName}
              </h4>
              <p className="text-sm text-gray-600">
                ₹{item.price} x {item.selectedQuantity}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() =>
                  onUpdateQuantity(item.selectedQuantity - 1, item.cartItemId)
                }
                disabled={item.selectedQuantity <= 1}
                className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
              >
                <FaMinus size={12} />
              </button>
              <span className="text-sm font-medium">
                {item.selectedQuantity}
              </span>
              <button
                onClick={() =>
                  onUpdateQuantity(item.selectedQuantity + 1, item.cartItemId)
                }
                disabled={item.selectedQuantity >= item.quantityAvailable}
                className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
              >
                <FaPlus size={12} />
              </button>
            </div>
            <button
              onClick={() => onRemoveItem(item.cartItemId)}
              className="ml-4 text-red-500 hover:text-red-700"
            >
              <FaTrash size={14} />
            </button>
          </li>
        ))}
      </ul>
      <div className="border-t border-gray-200 p-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-base font-bold">Total:</span>
          <span className="text-lg font-bold text-green-600">
            ₹{calculateTotal().toFixed(2)}
          </span>
        </div>
        <button
          onClick={handleProceedToCart}
          className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Proceed to Order
        </button>
      </div>
    </div>
  );
};

export default CartHoverList;