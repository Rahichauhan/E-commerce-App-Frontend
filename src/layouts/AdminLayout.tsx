import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaCube, FaUser } from "react-icons/fa";
import UserProfileHoverList from "../components/UserProfileHoverList";

interface AdminLayoutProps {
  children: React.ReactNode;
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
interface Password {
  oldPassword: string,
  newPassword: string
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const [isHoveringUser, setIsHoveringUser] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showNotificationDialog, setShowNotificationDialog] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");



  const reloadPage = () => {
    setTimeout(() => {
      window.location.reload();
    }, 2000);

  };

  const RefreshToken = async () => {
    console.log("Refreshing token");
    const refreshToken = localStorage.getItem("refreshToken");
    const userEmail = localStorage.getItem("useremail")
    const requestBody = {
      email: userEmail,
      token: refreshToken
    }
    const res = await fetch(`http://localhost:8090/access/verify-token`, {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify(requestBody)
    });
    const json = await res.json();
    console.log(json);
    if (res.ok) {
      localStorage.setItem("jwt", json.data)
      console.log("Reloading in 2 sec");
      reloadPage();
    } else {
      console.log(json, requestBody);
      localStorage.clear();
      navigate("/error", {
        replace: true,
        state: { message: "Please log in as user to access this page." }
      });
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("login");
    localStorage.removeItem("useremail");
    localStorage.removeItem("jwt");
    navigate("/");
  };
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem("jwt");
        const userEmail = localStorage.getItem("useremail");
        if (!token || !userEmail) throw new Error("Authentication details not found.");
        const res = await fetch(`http://localhost:8090/user/get-user-info?email=${userEmail}`, {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const json = await res.json();
          setUserProfile(json.data);

        }
        else {
          console.log("Refresh token to be called")
          RefreshToken();
        }
      } catch (err) {
        console.error("Error fetching user details:", err);
      }
    };
    fetchUserDetails();
  }, []);
  function isPasswordUpdate(obj: any): obj is Password {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      typeof obj.oldPassword === 'string' &&
      typeof obj.newPassword === 'string'
    );
  }
  const handleUpdateUser = async (field: string, value: Password | string | number) => {
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
        url = `http://localhost:8090/user/update-password`;
        body = {
          email: userEmail,
          oldPassword: isPasswordUpdate(value) ? value.oldPassword : "",
          newPassword: isPasswordUpdate(value) ? value.newPassword : ""
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
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const json = await res.json();
      throw new Error(json.message)
    };
    const json = await res.json();
    setUserProfile(json.data);
  };

  const notifyAll = async (message: string) => {
    try {
      const token = localStorage.getItem("jwt");
      if (!token) throw new Error("JWT token missing.");

      const m = 
        { context: message }
      
      const res = await fetch("http://localhost:8088/notification-service/notify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(m),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.message);
      }

      console.log("Notification sent to all users.");
    } catch (err) {
      console.error("Notification error:", err);
    }
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
          <div className="flex items-right space-x-2 justify-between items-center">
            <div
              className="relative"
              onMouseEnter={() => setTimeout(() => {
                setIsHoveringUser(true);
              }, 300)
              }
              onMouseLeave={() => setTimeout(() => {
                setIsHoveringUser(false);
              }, 300)
              }
            >
              <FaUser size={21}
                className="text-gray-600 hover:text-blue-600 transition-colors"
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
              className="px-4 py-2 text-sm font-medium text-red-600 border border-red-600 rounded-lg hover:bg-red-50 hover:text-red-700 transition-colors duration-200"
            >
              Logout
            </button>
            <button
              onClick={() => setShowNotificationDialog(true)}
              className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200"
            >
              Notify All
            </button>

          </div>

        </div>
      </header>

      {/* SIDEBAR / NAV LINKS */}
      {showNotificationDialog && (
        <div className="fixed inset-0 z-50 bg-gray-100/80 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl p-6 w-96">
            <h2 className="text-lg font-semibold mb-4">Send Notification</h2>
            <textarea
              className="w-full h-24 border border-gray-300 rounded-md p-2 mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your message..."
              value={notificationMessage}
              onChange={(e) => setNotificationMessage(e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowNotificationDialog(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await notifyAll(notificationMessage);
                  setShowNotificationDialog(false);
                  setNotificationMessage("");
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

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
