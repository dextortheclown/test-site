import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SuccessPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userID, email } = location.state || {}; // Destructure state

  // Redirect to login if state is missing
  if (!userID || !email) {
    navigate("/");
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">Welcome!</h1>
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-sm">
        <p className="text-lg font-semibold text-gray-800">
          <span className="text-gray-600">User ID:</span> {userID}
        </p>
        <p className="text-lg font-semibold text-gray-800 mt-2">
          <span className="text-gray-600">Email:</span> {email}
        </p>
      </div>
    </div>
  );
};

export default SuccessPage;
