// react imports
import React from "react";
import { useState } from "react";

// rrd imports
import { Outlet } from "react-router-dom";

// components imports
import Sidebar from "../components/SideBar";
import Loading from "../components/Loading";

// icons library imports
import { Menu, X } from "lucide-react";

import { useSelector } from "react-redux";

import TopBar from "../components/TopBar";

const Layout = () => {
  const user = useSelector((state) => state.user.value);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return user ? (
    <div className="w-full flex h-screen">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 bg-slate-50 flex flex-col">
        <TopBar />
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
      {sidebarOpen ? (
        <X
          className="absolute top-3 right-3 p-2 z-100 pg-white rounded-md shadow-w-10 h-10 text-gray-600 sm:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      ) : (
        <Menu
          className="absolute top-3 right-3 p-2 z-100 pg-white rounded-md shadow-w-10 h-10 text-gray-600 sm:hidden"
          onClick={() => setSidebarOpen(true)}
        />
      )}
    </div>
  ) : (
    <Loading />
  );
};

export default Layout;
