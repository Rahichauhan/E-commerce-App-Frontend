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
        fetchedProducts.forEach((prod: { inventoryId: string | number; }) => {
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

    const fetchCartDetails = async () => {
      try {
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
        const fetchedCart = Array.isArray(json.data.orderItemList)
          ? json.data.orderItemList
          : [];

        const cartItems = fetchedCart
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
      } catch (err) {
        console.error("Error fetching cart:", err);
      }
    };

    if (products.length > 0) {
      fetchCartDetails();
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

    let url = "";
    let body: any = null;

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

    const cartItem = {
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
      body: JSON.stringify(cartItem),
    });

    if (!res.ok) throw new Error("Failed to add to cart");

    const json = await res.json();
    const fetchedCart = Array.isArray(json.data.orderItemList)
      ? json.data.orderItemList
      : [];

    const cartItems = fetchedCart
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
    const fetchedCart = Array.isArray(json.data.orderItemList)
      ? json.data.orderItemList
      : [];

    const cartItems = fetchedCart
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
    localStorage.clear();
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
      {/* Header */}
      {/* Main content */}
      {/* Rendered Products */}
    </div>
  );
};

export default HomePage;
