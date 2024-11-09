import axios from "axios";
import React, { useState } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import { toast } from "react-toastify";

function ViewVerification({ idImage, setViewId, userId }) {
  const handleVerifiedAsync = async (verified) => {
    try {
      const response = await axios.patch(
        `/api/auth/change-verification/${userId}`,
        {
          verification: verified,
        }
      );
      setViewId(false);
      toast.success(response.data.message, {
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
      const errorMessage = error?.data?.message || "Failed to verify";
      console.log(errorMessage);
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
    <div>
      <div className="fixed inset-0 z-[9999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300">
        <div className="relative m-4 p-4 w-2/5 min-w-[20%] max-w-[30%] rounded-3xl bg-secondary shadow-sm">
          <IoIosCloseCircle
            className="absolute right-5 text-red-500 text-4xl"
            onClick={() => setViewId(false)}
          />
          <div className="flex shrink-0 items-center justify-center mt-10 text-xl font-medium text-black">
            <h1 className="text-3xl">Customer’s Identification Card</h1>
          </div>
          <div className="relative flex flex-col justify-center items-center gap-3 border-slate-200 py-4 leading-normal  font-light">
            {idImage?.image?.map((img, i) => (
              <img src={img.url} alt="" className="w-[400px]" key={i} />
            ))}
          </div>
          {idImage.verified === false ? (
            <div className="flex shrink-0 flex-wrap items-center py-4 justify-center ">
              <button
                className="rounded-2xl bg-primary py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-green-700 focus:shadow-none active:bg-green-700 hover:bg-green-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
                type="button"
                onClick={() => handleVerifiedAsync(true)}
              >
                Verify ID
              </button>
            </div>
          ) : (
            <div className="flex shrink-0 flex-wrap items-center py-4 justify-center ">
              <button
                className="rounded-2xl bg-primary py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-green-700 focus:shadow-none active:bg-green-700 hover:bg-green-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
                type="button"
                onClick={() => handleVerifiedAsync(false)}
              >
                Unverify ID
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ViewVerification;
