"use client";
import React from "react";

const Dashboard = () => {
  return (
    <div>
      {/* Render the actual dashboard content here */}
      <h1>Welcome to the Dashboard</h1>
      <div className="flex gap-3 mt-6">
        <div className="w-64 h-40  bg-slate-400 rounded">
          
          <h1 className="text-center text-2xl">Product</h1>
          <h1 className="text-center text-2xl">100</h1>
        </div>
        <div className="w-64 h-40  bg-slate-400 rounded"></div>
        <div className="w-64 h-40  bg-slate-400 rounded"></div>
        <div className="w-64 h-40  bg-slate-400 rounded"></div>
      </div>
    </div>
  );
};

export default Dashboard;
