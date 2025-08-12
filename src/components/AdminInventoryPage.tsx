import { useEffect, useState } from "react";

interface Product {
  inventoryId: string;
  productName: string;
  productDesc: string;
  quantityAvailable: number;
  price: number;
}

const AdminInventoryPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<Partial<Product>>({});
  const [isEditing, setIsEditing] = useState(false);

  // Helper: Always attach JWT token
  const apiFetch = async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem("jwt");
    return fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });
  };

  // Fetch inventory
  const fetchInventory = async () => {
    try {
      const res = await apiFetch("http://localhost:8090/api/inventory");
      if (!res.ok) throw new Error("Failed to fetch inventory");
      const json = await res.json();
      setProducts(Array.isArray(json.data) ? json.data : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // Handle form input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Save or Update Product
  const handleSave = async () => {
    try {
      const method = isEditing ? "PUT" : "POST";
      const url = isEditing
        ? `http://localhost:8090/api/inventory/${form.inventoryId}`
        : "http://localhost:8090/api/inventory";

      const res = await apiFetch(url, {
        method,
        body: JSON.stringify({
          productName: form.productName,
          productDesc: form.productDesc,
          quantityAvailable: Number(form.quantityAvailable),
          price: Number(form.price),
        }),
      });

      if (!res.ok) throw new Error("Failed to save product");

      setForm({});
      setIsEditing(false);
      fetchInventory();
    } catch (err) {
      console.error(err);
    }
  };

  // Delete product
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await apiFetch(`http://localhost:8090/api/inventory/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      fetchInventory();
    } catch (err) {
      console.error(err);
    }
  };

  // Edit product
  const handleEdit = (product: Product) => {
    setForm(product);
    setIsEditing(true);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Admin Inventory Management</h1>

      {/* Product Form */}
      <div className="mb-6 bg-white shadow-md p-4 rounded-lg">
        <h2 className="text-xl mb-2">{isEditing ? "Edit Product" : "Add Product"}</h2>

        {/* Do not show inventoryId in the form unless editing */}
        {isEditing && (
          <input
            type="text"
            name="inventoryId"
            placeholder="Inventory ID"
            value={form.inventoryId || ""}
            disabled
            className="border p-2 w-full mb-2 bg-gray-100 text-gray-600"
          />
        )}

        <input
          type="text"
          name="productName"
          placeholder="Product Name"
          value={form.productName || ""}
          onChange={handleChange}
          className="border p-2 w-full mb-2"
        />
        <textarea
          name="productDesc"
          placeholder="Product Description"
          value={form.productDesc || ""}
          onChange={handleChange}
          className="border p-2 w-full mb-2"
        />
        <input
          type="number"
          name="quantityAvailable"
          placeholder="Quantity Available"
          value={form.quantityAvailable || ""}
          onChange={handleChange}
          className="border p-2 w-full mb-2"
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price || ""}
          onChange={handleChange}
          className="border p-2 w-full mb-2"
        />
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {isEditing ? "Update Product" : "Add Product"}
        </button>
      </div>

      {/* Product List */}
      <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Description</th>
            <th className="p-3 text-center">Quantity</th>
            <th className="p-3 text-center">Price</th>
            <th className="p-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center p-4 text-gray-500">
                No products available
              </td>
            </tr>
          ) : (
            products.map((p) => (
              <tr key={p.inventoryId} className="border-b">
                <td className="p-3">{p.productName}</td>
                <td className="p-3">{p.productDesc}</td>
                <td className="p-3 text-center">{p.quantityAvailable}</td>
                <td className="p-3 text-center">₹{p.price}</td>
                <td className="p-3 text-center space-x-2">
                  <button
                    onClick={() => handleEdit(p)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.inventoryId)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminInventoryPage;
