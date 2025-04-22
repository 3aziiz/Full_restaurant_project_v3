// ManagerLayout.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

function ManagerLayout() {
  const navigate = useNavigate();
  
  return (
    <div className="h-screen w-screen flex flex-col">
      {/* Manager header */}
      <header className="bg-blue-800 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Restaurant Manager Dashboard</h1>
        <button 
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-blue-700 rounded hover:bg-blue-600"
        >
          Back to Main Site
        </button>
      </header>
      
      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="bg-blue-900 text-white w-64 p-4">
          <nav>
            <ul className="space-y-2">
              <li><button className="w-full text-left p-2 hover:bg-blue-800 rounded">Dashboard</button></li>
              <li><button className="w-full text-left p-2 hover:bg-blue-800 rounded">Menu Management</button></li>
              <li><button className="w-full text-left p-2 hover:bg-blue-800 rounded">Orders</button></li>
              <li><button className="w-full text-left p-2 hover:bg-blue-800 rounded">Tables</button></li>
              <li><button className="w-full text-left p-2 hover:bg-blue-800 rounded">Settings</button></li>
            </ul>
          </nav>
        </div>
        
        {/* Content area */}
        <div className="flex-1 p-6 overflow-auto bg-gray-100">
          <h2 className="text-2xl font-bold mb-6">Restaurant Manager Dashboard</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Dashboard cards */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium">Today's Orders</h3>
              <p className="text-3xl font-bold mt-2">42</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium">Active Tables</h3>
              <p className="text-3xl font-bold mt-2">12</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium">Revenue Today</h3>
              <p className="text-3xl font-bold mt-2">$1,234</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManagerLayout;