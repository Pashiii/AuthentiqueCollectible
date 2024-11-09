import React from "react";
import { useNavigate } from "react-router-dom";

function OrdersAdmin() {
  const navigate = useNavigate();
  return (
    <div>
      <h1 className="text-3xl font-bold">Order Details</h1>
      <div className="flex-grow border-t border-black border-[2px]"></div>
      <div className=" border-2 bg-gray-200 shadow-lg mt-12">
        <div className="flex justify-between bg-white p-5">
          <h1 className="font-bold text-2xl">Pre-Order's</h1>
          <button
            className="bg-primary text-white p-2 px-10 rounded-[20px]"
            onClick={() => navigate("/admin/orders/list/pre-order")}
          >
            View
          </button>
        </div>
        <div className="flex justify-between p-5">
          <h1 className="font-bold text-2xl">Store Product's</h1>
          <button
            className="bg-primary text-white p-2 px-10 rounded-[20px]"
            onClick={() => navigate("/admin/orders/list/store-orders")}
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrdersAdmin;
