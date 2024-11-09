import React from "react";
import LogoImage from "/images/logo.png";
import { Outlet } from "react-router-dom";
import Adminsidebar from "./AdminSidebar/";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Admin() {
  return (
    <div>
      <div className="bg-primary top-0 left-0 w-full">
        <div className="mx-10 py-2 sm:py-4 flex justify-between items-center">
          <div className="flex items-center gap-5 text-white text-2xl">
            <div className="lg:hidden menu-bars"></div>
            <div className="text-white cursor-pointer flex items-center gap-3 font-semibold">
              <img
                src={LogoImage}
                alt=""
                className="w-[55px] h-[55px] cursor-pointer"
              />
              <h1 className="hidden lg:block">Authentique Collectibles</h1>
            </div>
          </div>
        </div>
      </div>
      <div className="flex min-h-screen w-full ">
        <Adminsidebar />
        <div className="flex flex-1 flex-col">
          <main className="p-6">
            <Outlet />
            <ToastContainer />
          </main>
        </div>
      </div>
    </div>
  );
}

export default Admin;
