import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaCube } from "react-icons/fa";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("login");
    localStorage.removeItem("useremail");
    localStorage.removeItem("jwt");
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="container mx-auto p-4 flex justify-between items-center">
          {/* Left: Hamburger + Logo */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              <FaBars size={24} />
            </button>
            <div
              onClick={() => navigate("/admin")}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <FaCube size={28} className="text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">
                Nexus Mart
              </span>
            </div>
          </div>

          {/* Right: Logout */}
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-red-600 border border-red-600 rounded-lg hover:bg-red-50 hover:text-red-700 transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      </header>

      {/* SIDEBAR / NAV LINKS */}
      {menuOpen && (
        <nav className="bg-gray-100 border-b border-gray-300 p-4">
          <ul className="space-y-2">
            <li>
              <Link
                to="/admin/inventory"
                className="block text-gray-700 hover:text-blue-600"
              >
                Inventory Management
              </Link>
            </li>
            <li>
              <Link
                to="/admin/order"
                className="block text-gray-700 hover:text-blue-600"
              >
                Order Management
              </Link>
            </li>
            <li>
              <Link
                to="/admin/shipment"
                className="block text-gray-700 hover:text-blue-600"
              >
                Shipment Management
              </Link>
            </li>
          </ul>
        </nav>
      )}

      {/* MAIN CONTENT */}
      <main className="flex-1 container mx-auto p-4">{children}</main>
    </div>
  );
}
