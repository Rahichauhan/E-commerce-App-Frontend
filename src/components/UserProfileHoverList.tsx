import React, { useState } from "react";
import { FaEdit, FaUserCircle, FaPhone, FaLock, FaCheck,FaExclamationCircle } from "react-icons/fa";

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: number;
}

interface UserProfileHoverListProps {
  user: UserProfile;
  onUpdateUser: (field: string, value: string | number | { oldPassword: string; newPassword: string }) => Promise<void>;
  onClose: () => void;
}

const UserProfileHoverList: React.FC<UserProfileHoverListProps> = ({ user, onUpdateUser }) => {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [updatedValue, setUpdatedValue] = useState<string>("");
  const [oldPassword, setOldPassword] = useState<string>("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleEditClick = (field: string, currentValue: string | number) => {
    setEditingField(field);
    setUpdatedValue(String(currentValue));
  };

  const handleSaveClick = async (field: string) => {
    try {
      if (field === "password") {
        await onUpdateUser(field, {
          oldPassword,
          newPassword: updatedValue,
        });
        setOldPassword("");
        setUpdatedValue("");
      } else {
        await onUpdateUser(field, updatedValue);
      }

      setEditingField(null);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (error) {
      setShowError(true);
      setTimeout(() => setShowError(false), 5000);
      setErrorMessage(""+error)
      console.error("Failed to update user:", error);
      // Handle error display
    }
  };

  const renderField = (label: string, fieldName: keyof UserProfile, icon: React.ReactNode) => {
    return (
      <div className="flex items-center justify-between p-2 border-b border-gray-200">
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-semibold text-gray-700">{label}:</span>
        </div>
        {editingField === fieldName ? (
          <div className="flex items-center gap-2">
            <input
              type={fieldName === "phone" ? "tel" : "text"}
              value={updatedValue}
              onChange={(e) => setUpdatedValue(e.target.value)}
              className="w-32 p-1 text-sm border rounded"
            />
            <button
              onClick={() => handleSaveClick(fieldName)}
              className="p-1 text-white bg-green-500 rounded hover:bg-green-600"
            >
              <FaCheck size={12} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-gray-600">
              {user[fieldName]}
            </span>
            <button
              onClick={() => handleEditClick(fieldName, user[fieldName])}
              className="text-gray-500 hover:text-blue-500"
            >
              <FaEdit size={12} />
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="absolute right-0 w-80 mt-2 bg-white rounded-lg shadow-lg z-50 p-4 transform transition-all duration-300 ease-out scale-95 origin-top-right">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-200">
        <h3 className="text-lg font-bold text-gray-900">Your Profile</h3>
        {showSuccess && (
          <span className="text-sm text-green-600 flex items-center gap-1">
            <FaCheck /> Updated!
          </span>
        )}
        {showError && (
          <span className="text-sm text-red-600 flex items-center gap-1">
            <FaExclamationCircle /> {errorMessage}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-2">
        {renderField("First Name", "firstName", <FaUserCircle />)}
        {renderField("Last Name", "lastName", <FaUserCircle />)}
        {renderField("Phone", "phone", <FaPhone />)}
      </div>
      <div className="mt-4 border-t pt-4">
        <button
          onClick={() => setEditingField("password")}
          className="flex items-center gap-2 w-full text-left py-2 px-3 text-sm text-blue-600 rounded-lg hover:bg-blue-50"
        >
          <FaLock /> Update Password
        </button>
        {editingField === "password" && (
          <div className="mt-2 p-2 bg-gray-50 rounded-lg">
            <input
              type="password"
              placeholder="Old Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full p-2 mb-2 text-sm border rounded-lg"
            />
            <input
              type="password"
              placeholder="New Password"
              value={updatedValue}
              onChange={(e) => setUpdatedValue(e.target.value)}
              className="w-full p-2 text-sm border rounded-lg"
            />
            <button
              onClick={() => handleSaveClick("password")}
              className="mt-2 w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700"
            >
              Save Password
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfileHoverList;
