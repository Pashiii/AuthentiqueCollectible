import React from "react";
import { useNavigate } from "react-router-dom";

function ProductsCard({ products }) {
  const navigate = useNavigate();

  const _id = products.title;
  const idString = (_id) => {
    return String(_id).toLowerCase().split(" ").join("");
  };
  const rootId = idString(_id);
  const handleDetails = () => {
    navigate(`/product/${rootId}`, {
      state: {
        item: products,
      },
    });
  };

  return (
    <div>
      <div className="w-full h-96 group cursor-pointer overflow-hidden">
        <img
          onClick={handleDetails}
          className="w-full h-full object-cover group-hover:scale-110 duration-500"
          src={products.image}
          alt="productImg"
        />
      </div>
      <div className="w-full border-[1px] px-2 py-4 shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-base font-bold">{products.title}</h2>
          </div>
          <div>
            <p>{products.saleprice}</p>
            <p>{products.price}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductsCard;
