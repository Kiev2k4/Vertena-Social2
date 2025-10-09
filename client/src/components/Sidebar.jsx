import React from "react";

// rrd imports
import { useNavigate, Link } from "react-router-dom";

// clerk imports
import { UserButton, useClerk } from "@clerk/clerk-react";

// components imports
import MenuItems from "./MenuItems";

// assets imports
import { assets } from "../assets/assets";

// icons imports
import { CirclePlus, LogOut } from "lucide-react";

import { useSelector } from "react-redux";

import NotificationBell from "./NotificationBell";

const SideBar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.value);
  const { signOut } = useClerk();

  return (
    <div
      className={`w-60 xl:w-72 bg-white border-r border-gray-200 flex flex-col justify-between items-center max-sm:absolute top-0 botton-0 z-20
    ${
      sidebarOpen ? "translate-x-0" : "max-sm:-translate-x-full"
    } transition-all-duration-300 ease-in-out`}
    >
      <div className="w-full">
        <img
          src={assets.logo}
          onClick={() => navigate("/")}
          className="w-40 ml-7 my-2 cursor-pointer"
        />
        <hr className="border-gray-300 mb-8" />

        <MenuItems setSidebarOpen={setSidebarOpen} />

        <Link
          to="/create-post"
          className="flex items-center justify-center gap-2 py-2.5 mt-6 mx-6 rounded-lg bg-gradient-to-r from-red-400 to-purple-700 hover:from-indigo-700 hover:to-purple-900 text-white hover:scale-103 active:scale-95 transition duration-600 text-white cursor-pointer"
        >
          <CirclePlus className="w-5 h-5" />
          Create Post
        </Link>
      </div>
      <div className="w-full border-t border-gray-200 p-4 px-7 flex items-center justify-between">
        <div className="flex gap-2 items-center cursor-pointer">
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox: "w-8 h-8",
              },
            }}
          />
          <div>
            <h1 className="text-sm font-medium">{user.full_name}</h1>
            <p className="text-xs text-gray-500">@{user.username}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="max-sm:hidden">
            {" "}
            {/* ✅ Only show on desktop */}
            <NotificationBell />
          </div>
          <LogOut
            onClick={signOut}
            className="w-4.5 text-gray-400 hover:text-gray-700 transition cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export default SideBar;
