import { Link, useNavigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import { useEffect } from "react";

export default function AdminDashboard() {



   const navigate = useNavigate();
    useEffect(() => {
        const loginKey = localStorage.getItem("login");
        const userType = localStorage.getItem("userType");
        if (loginKey && userType == "ADMIN") {
          // do nothing
        } else {
          navigate("/error", {
            replace: true,
            state: { message: "Please log in as Admin to access this page." }
          });
    
        }
      }, [navigate]);

    return (
        <AdminLayout>
            <div className="min-h-screen bg-gray-50">

                {/* DASHBOARD LINKS */}
                <main className="container mx-auto px-4 py-8">
                    <div className="flex flex-col space-y-4 max-w-xs ml-4">
                        <Link
                            to="/admin/inventory"
                            className="bg-white shadow-md rounded-lg p-4 hover:bg-blue-50 border border-gray-200 text-lg font-medium text-gray-800"
                        >
                            Inventory Management - Add, update, and delete products.
                        </Link>
                        <Link
                            to="/admin/order"
                            className="bg-white shadow-md rounded-lg p-4 hover:bg-blue-50 border border-gray-200 text-lg font-medium text-gray-800"
                        >
                            Order Management - View and manage customer orders.
                        </Link>
                        <Link
                            to="/admin/shipment"
                            className="bg-white shadow-md rounded-lg p-4 hover:bg-blue-50 border border-gray-200 text-lg font-medium text-gray-800"
                        >
                            Shipment Management - Track and update shipment statuses.
                        </Link>
                    </div>
                </main>
            </div>
        </AdminLayout>
    );
}
