import React from "react";
import { useNavigate } from "react-router-dom";

function ProductsAdmin() {
  const navigate = useNavigate();

  return (
    <div>
      <h1 className="text-3xl font-bold">Products</h1>
      <div className="flex-grow border-t border-black border-[2px]"></div>
      <div className=" border-2 bg-gray-200 shadow-lg mt-12">
        <div className="flex justify-between bg-white p-5">
          <h1 className="font-bold text-2xl">Collectible's</h1>
          <button
            className="bg-primary text-white p-2 px-10 rounded-[20px]"
            onClick={() => navigate(`/admin/products/collectible`)}
          >
            View
          </button>
        </div>
        <div className="flex justify-between p-5">
          <h1 className="font-bold text-2xl">Apparel's</h1>
          <button
            className="bg-primary text-white p-2 px-10 rounded-[20px]"
            onClick={() => navigate(`/admin/products/apparel`)}
          >
            View
          </button>
        </div>
        <div className="flex justify-between bg-white p-5">
          <h1 className="font-bold text-2xl">Coffee</h1>
          <button
            className="bg-primary text-white p-2 px-10 rounded-[20px]"
            onClick={() => navigate(`/admin/products/coffee`)}
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductsAdmin;
