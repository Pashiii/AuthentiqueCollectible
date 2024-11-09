import React, { useEffect, useState } from "react";
import { PiUserCircleFill } from "react-icons/pi";
import { IoHome } from "react-icons/io5";
import { IoIosPeople } from "react-icons/io";
import { BiSolidCategory } from "react-icons/bi";
import { IoDiamondOutline } from "react-icons/io5";
import { FaBoxOpen } from "react-icons/fa";
import { FaTruck } from "react-icons/fa";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLogoutUserMutation } from "../redux/features/auth/authApi";
import { useDispatch } from "react-redux";
import { logout } from "../redux/features/auth/authSlice";

function Adminsidebar() {
  const location = useLocation();

  const [activeItem, setActiveItem] = useState();
  const [logoutUser] = useLogoutUserMutation();
  const dispatchs = useDispatch();
  const navigate = useNavigate();
  const handleNavigate = (e) => {
    setActiveItem(e);
    navigate(`/admin/${e}`);
  };
  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
      dispatchs(logout());
      navigate("/signin");
    } catch (error) {
      console.log("Failed to logout", error);
    }
  };

  return (
    <div className="bg-[#B5B5B5] w-[250px] ">
      <div className="flex flex-col justify-center items-center mb-10 mt-5">
        <PiUserCircleFill className="text-[100px]" />
        <h1 className="text-2xl font-semibold">Hello Admin</h1>
      </div>
      <div className="flex-grow border-t border-black border-[1px]"></div>
      <div className="flex justify-center items-center">
        <ul className="flex flex-col mt-5 text-2xl gap-3 font-semibold w-[200px]">
          <li
            className={`flex items-center gap-2 cursor-pointer p-2 rounded-[20px] transition-colors duration-200 ${
              location.pathname.includes("/dashboard")
                ? "bg-primary text-white"
                : "hover:bg-gray-200"
            }`}
            onClick={() => handleNavigate("dashboard")}
          >
            <IoHome />
            <h1>Dashboard</h1>
          </li>
          <li
            className={`flex items-center gap-2 cursor-pointer p-2 rounded-[20px] transition-colors duration-200 ${
              location.pathname.includes("/customer")
                ? "bg-primary text-white"
                : "hover:bg-gray-200"
            }`}
            onClick={() => handleNavigate("customer")}
          >
            <IoIosPeople />
            <h1>Customer</h1>
          </li>
          <li
            className={`flex items-center gap-2 cursor-pointer p-2 rounded-[20px] transition-colors duration-200 ${
              location.pathname.includes("/category")
                ? "bg-primary text-white"
                : "hover:bg-gray-200"
            }`}
            onClick={() => handleNavigate("category")}
          >
            <BiSolidCategory />
            <h1>Category</h1>
          </li>
          <li
            className={`flex items-center gap-2 cursor-pointer p-2 rounded-[20px] transition-colors duration-200 ${
              location.pathname.includes("/auction")
                ? "bg-primary text-white"
                : "hover:bg-gray-200"
            }`}
            onClick={() => handleNavigate("auction")}
          >
            <IoDiamondOutline />
            <h1>Auction</h1>
          </li>
          <li
            className={`flex items-center gap-2 cursor-pointer p-2 rounded-[20px] transition-colors duration-200 ${
              location.pathname.includes("/products")
                ? "bg-primary text-white"
                : "hover:bg-gray-200"
            }`}
            onClick={() => handleNavigate("products")}
          >
            <FaBoxOpen />
            <h1>Products</h1>
          </li>
          <li
            className={`flex items-center gap-2 cursor-pointer p-2 rounded-[20px] transition-colors duration-200 ${
              location.pathname.includes("/orders")
                ? "bg-primary text-white"
                : "hover:bg-gray-200"
            }`}
            onClick={() => handleNavigate("orders")}
          >
            <FaTruck />
            <h1>Orders</h1>
          </li>
          <Link onClick={handleLogout}>
            <li
              className={`flex items-center gap-2 cursor-pointer p-2 rounded-[20px] transition-colors duration-200 ${
                activeItem === "logout" ? "bg-gray-300" : "hover:bg-gray-200"
              }`}
            >
              <RiLogoutBoxRLine />

              <h1>Logout</h1>
            </li>
          </Link>
        </ul>
      </div>
    </div>
  );
}

export default Adminsidebar;
