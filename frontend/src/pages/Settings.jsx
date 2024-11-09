import React from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../redux/features/auth/authSlice";
import { useDispatch } from "react-redux";
import { useLogoutUserMutation } from "../redux/features/auth/authApi";

function Settings() {
  const navigate = useNavigate();
  const dispatchs = useDispatch();
  const [logoutUser] = useLogoutUserMutation();
  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
      dispatchs(logout());
      navigate("/");
    } catch (error) {
      console.log("Failed to logout", error);
    }
  };
  return (
    <div className="container min-h-screen">
      <div className="w-full p-5">
        <div className=" bg-[#d9d9d9] flex items-center gap-2 text-5xl p-5 font-bold">
          <Link to={"/account"}>
            <FaArrowLeft />
          </Link>
          <Link to={"/account"}>
            <h1>Settings</h1>
          </Link>
        </div>
        <div className="bg-[#d9d9d9] mt-3 pb-10 text-2xl underline">
          <Link to={"/account/profile"}>
            <h1 className="p-5">Account Information</h1>
          </Link>
          <div className="flex-grow border-t border-black border-[1px]"></div>
          <Link to={"/account/security"}>
            <h1 className="p-5">Account Security</h1>
          </Link>
          <div className="flex-grow border-t border-black border-[1px]"></div>
        </div>
        <div className="flex justify-end m-5">
          <button
            className="border-[1px] border-black w-[22vh] h-12 rounded-[10px] text-2xl font-semibold"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;
