import React, { useState } from "react";
import LogoImage from "/images/logo.png";
import { Link } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import { useForgetPassMutation } from "../redux/features/auth/authApi";
import { toast } from "react-toastify";
import { MdError } from "react-icons/md";

function ForgetPass() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [forgetPass] = useForgetPassMutation();

  const handleForgetPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await forgetPass(email).unwrap();
      console.log(response);
      setMessage("");
      setSuccessMessage(
        "We've sent you an email with a link to update your password."
      );
      toast.success(response.message, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error) {
      const errorMessage = error?.data?.message;
      setSuccessMessage("");
      setMessage(errorMessage);
      toast.error(errorMessage, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };
  return (
    <div className="grid lg:grid-cols-2 m-auto p-[100px] h-auto">
      <div className="bg-secondary flex flex-col items-center justify-center">
        <img src={LogoImage} alt="" className="w-[200px]" />
        <div className="text-center xl:text-left">
          <h1 className="text-4xl font-bold pt-5">AUTHENTIQUE COLLECTIBLES</h1>
          <p className="text-lg">TOYS • BAGS SNEAKERS • & MORE</p>
        </div>
      </div>
      <div className="bg-primary">
        <div className="m-auto px-10 py-10 text-white">
          <h1 className="text-2xl font-bold ">Forgot Password?</h1>
          <div className="h-[3px] bg-white mt-5"></div>
          <form onSubmit={handleForgetPassword}>
            <div className="flex flex-col justify-center">
              <h1 className="text-2xl py-20 text-center font-semibold">
                Recover your Account
              </h1>
              {successMessage && (
                <p className="text-green-400 flex items-center gap-2 text-base">
                  <MdError />
                  {successMessage}
                </p>
              )}
              {message && (
                <p className="text-red-400 flex items-center gap-2 text-base">
                  <MdError />
                  {message}
                </p>
              )}
              <label className="font-thin text-lg text-gray-300">
                Please type your email below
              </label>
              <input
                type="email"
                value={email}
                className="bg-transparent border-white border-[1px] outline-none rounded-[10px] w-full p-2"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div className="flex items-center justify-center pt-10">
                <button
                  type="submit"
                  className="bg-white text-black w-[450px] h-10 rounded-[10px]"
                >
                  Submit
                </button>
              </div>
              <div className="flex items-center justify-center pt-5 pb-10 ">
                <Link to="/signin">
                  <p className="font-normal italic underline text-sm text-center cursor-pointer">
                    Return to login
                  </p>
                </Link>

                <IoIosArrowForward />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ForgetPass;
