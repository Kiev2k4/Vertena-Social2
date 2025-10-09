import React from "react";
import NotificationBell from "./NotificationBell";

const TopBar = () => {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sm:hidden">
      <h1 className="font-semibold text-lg">Vertena</h1>
      <NotificationBell />
    </div>
  );
};

export default TopBar;
