import React from "react";
import { Link } from "react-router-dom";

function ErrorInput() {
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center gap-2 my-20">
      <div className="font-bold text-[100px]">404</div>
      <div className="text-[50px]">Page not found</div>
      <Link to="/">
        <button className="border-[1px] border-black bg-secondary rounded-[5px] p-3 text-lg font-semibold text-primary">
          Continue Shopping
        </button>
      </Link>
    </div>
  );
}

export default ErrorInput;
