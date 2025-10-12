"use client";

import React, { useState } from "react";
import { logoutUser } from "@/auth/login";
import { clearSession } from "@/auth/setSession";

const DashboardButtons = () => {
  const [message, setMessage] = useState("");

  const handleLogout = async () => {
    await logoutUser();
    await clearSession();
    setMessage("Logged out successfully");
    window.location.href = "/login";
    
  };
  

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-6">
        <button
          className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow hover:bg-blue-700 transition"
          onClick={() => setMessage("Ticket button clicked")}
        >
          Ticket
        </button>

        <button
          className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow hover:bg-blue-700 transition"
          onClick={() => setMessage("Lead button clicked")}
        >
          Lead
        </button>

        <button
          className="bg-red-600 text-white px-6 py-3 rounded-xl shadow hover:bg-red-700 transition"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      {message && <div className="text-green-600 font-medium">{message}</div>}
    </div>
  );
};

export default DashboardButtons;
