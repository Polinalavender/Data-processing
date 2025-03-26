import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Subscription = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const planPrices = {
    SD: 7.99,
    HD: 10.99,
    UHD: 13.99,
  };

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        if (!user?.id) {
          navigate("/login");
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/api/subscription/${user.id}`);
        if (response?.data) {
          navigate("/");
        }
      } catch (err) {
        if (err.response?.status === 404) {
          setLoading(false);
        } else {
          console.error("Error checking subscription:", err);
        }
      }
    };

    checkSubscription();
  }, [user, navigate]);

  const handleSubscription = async () => {
    if (!selectedPlan || !user?.id) return;

    const today = new Date();
    const oneMonthLater = new Date(today);
    oneMonthLater.setMonth(today.getMonth() + 1);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/subscription`, {
        userId: user.id,
        plan: selectedPlan,
        price: planPrices[selectedPlan],
        startDate: today.toISOString(),
        endDate: oneMonthLater.toISOString(),
      });

      console.log("Subscribed:", response.data);
      navigate("/");
    } catch (err) {
      console.error("Subscription failed", err);
    }
  };

  if (loading) {
    return <div className="text-white text-center mt-20">Checking subscription status...</div>;
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Choose a Subscription Plan</h2>
        <div className="space-y-4">
          <button
            className={`w-full p-3 rounded ${selectedPlan === "SD" ? "bg-red-600" : "bg-gray-700"}`}
            onClick={() => setSelectedPlan("SD")}
          >
            SD - €7.99/month
          </button>
          <button
            className={`w-full p-3 rounded ${selectedPlan === "HD" ? "bg-red-600" : "bg-gray-700"}`}
            onClick={() => setSelectedPlan("HD")}
          >
            HD - €10.99/month
          </button>
          <button
            className={`w-full p-3 rounded ${selectedPlan === "UHD" ? "bg-red-600" : "bg-gray-700"}`}
            onClick={() => setSelectedPlan("UHD")}
          >
            UHD - €13.99/month
          </button>
        </div>
        <button
          className="mt-6 w-full bg-red-600 p-2 rounded hover:bg-red-700"
          onClick={handleSubscription}
          disabled={!selectedPlan}
        >
          Subscribe
        </button>
      </div>
    </div>
  );
};

export default Subscription;