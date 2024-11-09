import React from "react";

function Notifications() {
  return (
    <div>
      <div className="absolute w-[400px] h-[350px] bg-primary border-2 right-0 shadow-lg rounded-lg z-10">
        <h1 className="text-center text-lg py-5">NOTIFICATION</h1>
        <div className="container">
          <div className="flex-grow border-t border-white border-[1px] mb-5"></div>
        </div>
        <h1 className="text-base px-3">New</h1>
      </div>
    </div>
  );
}

export default Notifications;
