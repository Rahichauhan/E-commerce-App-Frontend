import { FaBell } from "react-icons/fa";

interface NotificationToastProps {
  message: string;
}

const NotificationToast: React.FC<NotificationToastProps> = ({ message }) => {
  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[1000] bg-white border border-gray-300 shadow-lg rounded-lg px-6 py-4 flex items-center space-x-4 animate-fade-in-up">
      <FaBell className="text-yellow-500 text-xl animate-bounce" />
      <span className="text-gray-800 font-medium">{message}</span>
    </div>
  );
};

export default NotificationToast;
