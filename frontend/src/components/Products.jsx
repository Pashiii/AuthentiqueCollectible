import React from "react";
import ProductsCard from "./ProductsCard";

function Products({ products }) {
  return (
    <div className="max-w-screen-xl mx-auto py-10 grid grid-cols-2 lg:grid-cols-4 gap-10">
      {products.map((item) => (
        <ProductsCard key={item._id} products={item} />
      ))}
    </div>
  );
}

export default Products;
