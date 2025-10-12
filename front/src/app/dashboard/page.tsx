import { cookies } from "next/headers";
import React from "react";
import Link from "next/link";
import DashboardButtons from "./DashboardButton"; 

const DashboardPage = async () => {
  const cookieStore = await cookies();
  const sid = cookieStore.get("sid");

  if (!sid) {
    return <div>
        You must be logged in
        <Link href="/login">
        <button className="ml-2 px-3 py-1 bg-blue-500 text-white rounded">Login</button>
        </Link>
        
        </div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">ERP Client Actions</h1>
      <DashboardButtons />
    </div>
  );
};

export default DashboardPage;
