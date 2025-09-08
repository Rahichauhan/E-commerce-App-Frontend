import { useNavigate, useLocation } from "react-router-dom";
import { FaCube } from "react-icons/fa";

const Error = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const message = location.state?.message || "Something went wrong. You are not authorized to view this page.";

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="container mx-auto p-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <FaCube size={28} className="text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">
              Nexus Mart
            </span>
          </div>
        </div>
      </header>

      <main className="flex items-center justify-center flex-col h-[80vh] text-center px-4">
        <h1 className="text-5xl font-bold text-red-600 mb-4">Oops!</h1>
        <p className="text-xl text-gray-700 mb-6">
          {message}
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Go Back
        </button>
      </main>
    </div>
  );
};

export default Error;
