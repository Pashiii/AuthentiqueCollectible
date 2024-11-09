import React from "react";
import { useFetchRelatedProductsQuery } from "../redux/features/products/productApi";
import { useNavigate } from "react-router-dom";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, products: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function RelatedProducts({ product }) {
  const {
    data: related = [],
    error,
    isLoading,
  } = useFetchRelatedProductsQuery(product);

  const navigate = useNavigate();
  const handleNavigate = (slug) => {
    navigate(`/product/${slug}`);
  };

  const displayProd = related.slice(0, 4);
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  return (
    <div>
      <div className="container max-w-screen-xl mx-auto  my-10">
        <div className="pb-[50px]">
          <h1 data-aos="fade-up" className="text-2xl font-bold py-5">
            Related Products
          </h1>
          <div className="grid grid-cols-1 min-[350px]:grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {displayProd.map((data, index) => (
              <div
                key={data._id}
                data-aos="fade-up"
                data-aos-delay={data.aosDelay}
                className="border border-black rounded-[10px] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] text-center "
              >
                <h1 className="text-sm sm:text-base text-right px-3 pt-2">
                  Stocks: 1
                </h1>
                <a href={data.link} className="flex justify-center py-4">
                  <img
                    src={data.image[0].url}
                    alt=""
                    className="min-[300px]:max-[350px]:h-[250px] h-[150px] sm:h-[200px] md:h-[250px] lg:h-[200px] xl:h-[300px] w-full object-cover"
                    onClick={() => handleNavigate(data.slug)}
                  />
                </a>
                <h1 className="text-base sm:text-xl font-bold text-center truncate mx-5">
                  {data.title}
                </h1>
                <h1 className="text-[13px] sm:text-base md:text-sm text-center sm:py-2">
                  {data.category}
                </h1>
                <h1 className="text-[18px] sm:text-xl font-semibold text-red-500 text-center">
                  {data.price.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </h1>
                <div className="flex justify-center py-2 ">
                  <button
                    type="button"
                    className="border-black border-[1px] rounded-[5px] p-auto py-1 mx-3 container"
                  >
                    Add to Cart
                  </button>
                </div>
                <div></div>
                <a href="#" className="text-[15px] sm:text-base text-center">
                  See Details
                </a>
                {data.properties?.saleType === "Pre Order" && (
                  <div className="absolute top-14 right-0">
                    <h1 className="bg-primary text-white rounded-l-[20px] px-3 py-[5px]">
                      Pre Order
                    </h1>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RelatedProducts;
