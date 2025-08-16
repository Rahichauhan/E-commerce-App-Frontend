import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart, FaCube, FaShoppingBag, FaUser } from "react-icons/fa";
import CartHoverList from "./Cart";
import UserProfileHoverList from "./UserProfileHoverList";

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
  cartItemId: string;
  selectedQuantity: number;
}

interface Password {
  oldPassword: string;
  newPassword: string;
}

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: number;
  role: string;
  createdAt: string;
}

const HomePage: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [isHoveringCart, setIsHoveringCart] = useState(false);
  const [isHoveringUser, setIsHoveringUser] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [availableCart, setAvailableCart] = useState(false);

  const useremail = localStorage.getItem("useremail");
  const navigate = useNavigate();

  useEffect(() => {
    const loginKey = localStorage.getItem("login");
    if (loginKey) {
      setIsLoggedIn(true);
    } else {
      navigate("/error", {
        replace: true,
        state: { message: "Please log in to access this page." },
      });
    }
  }, [navigate]);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const token = localStorage.getItem("jwt");
        if (!token) throw new Error("No JWT token found. Please log in again.");

        const res = await fetch("http://localhost:8082/api/inventory", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch inventory");

        const json = await res.json();
        const fetchedProducts = Array.isArray(json.data) ? json.data : [];
        setProducts(fetchedProducts);

        const initialQuantities: { [key: string]: number } = {};
        fetchedProducts.forEach((prod: Product) => {
          initialQuantities[prod.inventoryId] = 1;
        });
        setQuantities(initialQuantities);
      } catch (err) {
        console.error("Error fetching inventory:", err);
      }
    };

    fetchInventory();
  }, []);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem("jwt");
        const userEmail = localStorage.getItem("useremail");
        if (!token || !userEmail) throw new Error("Authentication details not found.");

        const res = await fetch(
          `http://localhost:8090/user/get-user-info?email=${userEmail}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch user details");

        const json = await res.json();
        setUserProfile(json.data);
      } catch (err) {
        console.error("Error fetching user details:", err);
      }
    };

    fetchUserDetails();
  }, []);

  useEffect(() => {
    setAvailableCart(false);
    const fetchcartDetails = async () => {
      const uuid = localStorage.getItem("uid");
      const token = localStorage.getItem("jwt");

      const res = await fetch(`http://localhost:8081/cart/get-cart/${uuid}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch cart");

      const json = await res.json();
      const fetchedcart = Array.isArray(json.data.orderItemList)
        ? json.data.orderItemList
        : [];

      const cartItems = fetchedcart
        .map((cartItem: any) => {
          const productDetails = products.find((p) =>
            p.inventoryId.match(cartItem.productId)
          );
          if (productDetails) {
            return {
              ...productDetails,
              selectedQuantity: cartItem.quantity,
              cartItemId: cartItem.id,
            };
          }
          return null;
        })
        .filter(Boolean);

      setCart(cartItems as CartItem[]);
      setAvailableCart(true);
    };

    if (products.length > 0) {
      fetchcartDetails();
    }
  }, [products]);

  function isPasswordUpdate(obj: any): obj is Password {
    return (
      typeof obj === "object" &&
      obj !== null &&
      typeof obj.oldPassword === "string" &&
      typeof obj.newPassword === "string"
    );
  }

  const handleUpdateUser = async (
    field: string,
    value: Password | string | number
  ) => {
    const token = localStorage.getItem("jwt");
    const userEmail = localStorage.getItem("useremail");
    if (!token || !userEmail) throw new Error("Authentication details missing.");

    let body;
    let url;

    switch (field) {
      case "firstName":
        url = `http://localhost:8090/user/update-first-name/${userEmail}?fname=${value}`;
        break;
      case "lastName":
        url = `http://localhost:8090/user/update-last-name/${userEmail}?lname=${value}`;
        break;
      case "password":
        url = "http://localhost:8090/user/update-password";
        body = {
          email: userEmail,
          oldPassword: isPasswordUpdate(value) ? value.oldPassword : "",
          newPassword: isPasswordUpdate(value) ? value.newPassword : "",
        };
        break;
      case "phone":
        url = `http://localhost:8090/user/update-phone/${userEmail}?phone=${value}`;
        break;
      default:
        throw new Error("Invalid field to update.");
    }

    const res = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: body ? JSON.stringify(body) : null,
    });

    if (!res.ok) {
      const json = await res.json();
      throw new Error(json.message);
    }

    const json = await res.json();
    setUserProfile(json.data);
  };

  const addToCart = async (product: Product) => {
    const qty = quantities[product.inventoryId] || 1;
    const token = localStorage.getItem("jwt");
    if (!token) throw new Error("No JWT token found. Please log in again.");

    const cartitems = {
      productId: product.inventoryId,
      productName: product.productName,
      quantity: qty,
      price: product.price,
    };

    const uuid = localStorage.getItem("uid");

    const res = await fetch(`http://localhost:8081/cart/add-item/${uuid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(cartitems),
    });

    if (!res.ok) throw new Error("Failed to add to cart");

    const json = await res.json();
    const fetchedcart = Array.isArray(json.data.orderItemList)
      ? json.data.orderItemList
      : [];

    const cartItems = fetchedcart
      .map((cartItem: any) => {
        const productDetails = products.find((p) =>
          p.inventoryId.match(cartItem.productId)
        );
        if (productDetails) {
          return {
            ...productDetails,
            selectedQuantity: cartItem.quantity,
            cartItemId: cartItem.id,
          };
        }
        return null;
      })
      .filter(Boolean);

    setCart(cartItems as CartItem[]);
  };

  const handleRemoveItem = async (cartItemId: string) => {
    const uuid = localStorage.getItem("uid");
    const token = localStorage.getItem("jwt");

    const res = await fetch(
      `http://localhost:8081/cart/remove-item/${uuid}/${cartItemId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) throw new Error("Failed to remove item from cart");

    const json = await res.json();
    const fetchedcart = Array.isArray(json.data.orderItemList)
      ? json.data.orderItemList
      : [];

    const cartItems = fetchedcart
      .map((cartItem: any) => {
        const productDetails = products.find((p) =>
          p.inventoryId.match(cartItem.productId)
        );
        if (productDetails) {
          return {
            ...productDetails,
            selectedQuantity: cartItem.quantity,
            cartItemId: cartItem.id,
          };
        }
        return null;
      })
      .filter(Boolean);

    setCart(cartItems as CartItem[]);
  };

  const handleUpdateQuantity = async (
    newQuantity: number,
    cartItemId: string
  ) => {
    const uuid = localStorage.getItem("uid");
    const token = localStorage.getItem("jwt");

    await fetch(
      `http://localhost:8081/cart/update-item/${uuid}/${cartItemId}/${newQuantity}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.cartItemId === cartItemId
          ? { ...item, selectedQuantity: newQuantity }
          : item
      )
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("login");
    localStorage.removeItem("useremail");
    localStorage.removeItem("jwt");
    navigate("/");
  };

  const handleNavigateToCart = () => {
    setIsHoveringCart(false);
  };

  if (isLoggedIn === null) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="container mx-auto p-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <FaCube size={28} className="text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">Nexus Mart</span>
          </div>

          <div className="flex items-center space-x-6">
            <div className="cursor-pointer flex items-center gap-2 text-lg font-medium text-gray-700">
              Welcome,
              <span className="text-blue-600 font-semibold">
                {userProfile?.firstName}
              </span>
            </div>

            <button
              onClick={() => navigate("/my-orders")}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 hover:text-blue-700"
            >
              <FaShoppingBag size={18} />
              My Orders
            </button>

            <div
              className="relative"
              onMouseEnter={() => setTimeout(() => setIsHoveringCart(true), 300)}
              onMouseLeave={() => setTimeout(() => setIsHoveringCart(false), 300)}
            >
              <div className="cursor-pointer">
                <FaShoppingCart
                  size={28}
                  className="text-gray-600 hover:text-blue-600"
                />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
                    {cart.length}
                  </span>
                )}
              </div>

              {isHoveringCart && (
                <CartHoverList
                  available={availableCart}
                  cart={cart}
                  onRemoveItem={handleRemoveItem}
                  onUpdateQuantity={handleUpdateQuantity}
                  onNavigateToCart={handleNavigateToCart}
                />
              )}
            </div>

            <div
              className="relative"
              onMouseEnter={() => setTimeout(() => setIsHoveringUser(true), 300)}
              onMouseLeave={() => setTimeout(() => setIsHoveringUser(false), 300)}
            >
              <FaUser
                size={21}
                className="text-gray-600 hover:text-blue-600"
              />
              {isHoveringUser && userProfile && (
                <UserProfileHoverList
                  user={userProfile}
                  onUpdateUser={handleUpdateUser}
                  onClose={() => setIsHoveringUser(false)}
                />
              )}
            </div>

            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-red-600 border border-red-600 rounded-lg hover:bg-red-50 hover:text-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8">
        {products.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-xl text-gray-500">No products available</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <div
                key={product.inventoryId}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
              >
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {product.productName}
                  </h2>
                  <p className="text-gray-600 mb-4 text-sm line-clamp-3">
                    {product.productDesc}
                  </p>
                  <p className="text-lg font-bold text-green-600 mb-4">
                    ₹{product.price}
                  </p>
                  <label className="text-sm font-medium text-gray-700">
                    Quantity: {quantities[product.inventoryId] || 1}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={quantities[product.inventoryId] || 1}
                    onChange={(e) =>
                      setQuantities({
                        ...quantities,
                        [product.inventoryId]: parseInt(e.target.value),
                      })
                    }
                    className="w-full my-2"
                  />
                  <button
                    className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700"
                    onClick={() => addToCart(product)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;
