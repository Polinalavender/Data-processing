import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Account = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    const fetchUser = async () => {
      if (!user || !user.id) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/api/users/${user.id}`);
        setUserDetails(response.data);
      } catch (err) {
        console.error("Failed to fetch user details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  if (loading) {
    return <div className="text-white text-center mt-20">Loading account details...</div>;
  }

  if (!userDetails) {
    return <div className="text-white text-center mt-20">No account information found.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-800 via-blue-600 to-purple-700 text-white flex items-center justify-center">
      <div className="bg-opacity-90 bg-black p-10 rounded-3xl shadow-2xl max-w-4xl w-full transform hover:scale-105 transition-all duration-300 ease-in-out">
        <h2 className="text-4xl font-extrabold mb-6 text-center text-gradient">Account Details</h2>
        
        <div className="space-y-6 text-lg font-medium">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-xl">Email:</span>
            <span>{userDetails.email}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="font-semibold text-xl">Name:</span>
            <span>{userDetails.firstName} {userDetails.lastName}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="font-semibold text-xl">Language:</span>
            <span>{userDetails.language}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="font-semibold text-xl">Status:</span>
            <span>{userDetails.status}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="font-semibold text-xl">Referred By:</span>
            <span>{userDetails.referredBy ?? "None"}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="font-semibold text-xl">Referral Bonus:</span>
            <span>{userDetails.hasReferralBonus ? "€2 Applied" : "Not Earned Yet"}</span>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <button
            className="w-full max-w-xs bg-gradient-to-r from-red-500 to-orange-500 p-3 rounded-full font-semibold text-xl transform hover:scale-105 transition-all duration-200 ease-in-out"
            onClick={() => navigate("/")}
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Account;
