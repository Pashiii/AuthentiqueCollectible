import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import axios from "axios";
import { Store } from "./Store";
import { useDispatch, useSelector } from "react-redux";
import { addtoCart } from "../redux/features/cart/cartSlice";
import { showNotification } from "../redux/features/cart/notificationSlice";

function LatestProduct({ products }) {
  const displayProd = products
    .filter(
      (product) =>
        product.properties?.saleType === "Latest Product" && product?.stocks > 0
    )

    .slice(0, 20);

  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const addToCartHandler = async (items) => {
    const existItem = cartItems.find((x) => x.slug === items.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${items.slug}`);
    const mystocks = data.product.stocks;

    if (mystocks < quantity) {
      window.alert("Sorry. Product is out of stock");
      return;
    }
    dispatch(
      showNotification({
        message: "Successfully added to Cart",
        title: items.title,
        image: items.image[0].url,
      })
    );
    dispatch(addtoCart({ ...items, quantity }));
  };

  return (
    <div>
      <div className="max-w-screen-xl mx-auto py-10 ">
        <div className="pb-[50px]">
          <div data-aos="fade-up" className="flex items-center justify-between">
            <h1 className="text-[30px] font-bold py-5 ">LATEST PRODUCTS</h1>
            <Link to="/collections/latest-product">
              <div className="flex items-center gap-2 group overflow-hidden cursor-pointer">
                <h1 className="italic text-xl  transform">
                  View All
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></span>
                </h1>
                <IoIosArrowForward className="opacity-0  transition-all duration-300 transform group-hover:opacity-100 group-hover:translate-x-1" />
              </div>
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pb-5">
            {displayProd.map((items) => (
              <div
                key={items._id}
                data-aos="fade-up"
                data-aos-delay="200"
                className="border-black border-[1px] rounded-[10px] shadow-xl"
              >
                <h1 className="text-sm sm:text-base text-right px-3 pt-2">
                  Stocks: {items.stocks}
                </h1>
                <div className="w-full h-50 lg:h-75 xl:h-96 group cursor-pointer overflow-hidden">
                  <Link
                    to={`product/${items.slug}`}
                    className="text-[15px] sm:text-base flex justify-center"
                  >
                    <img
                      src={items.image[0].url}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-110 duration-500 img-filter"
                    />
                  </Link>
                </div>
                <h1 className="text-base sm:text-xl font-bold text-center truncate mx-5">
                  {items.title}
                </h1>
                <h1 className="text-[13px] sm:text-base md:text-sm text-center sm:py-2">
                  {items.category}
                </h1>
                <h1 className="text-[18px] sm:text-xl font-semibold text-red-500 text-center">
                  {items.price.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </h1>
                <div className="flex justify-center pt-2 pb-5">
                  <button
                    type="button"
                    className="border-black border-[1px] rounded-[5px] font-semibold p-2 mx-3 container hover:bg-primary hover:text-white "
                    onClick={() => {
                      addToCartHandler(items);
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
          {/* <div className="grid grid-cols-1 min-[350px]:grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {displayProd.map((data, index) => (
              <div key={data._id}>
                <div
                  data-aos="fade-up"
                  data-aos-delay="200"
                  className="border border-black rounded-[10px] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] text-center "
                >
                  <h1 className="text-sm sm:text-base text-right px-3 pt-2">
                    Stocks: {data.stocks}
                  </h1>
                  <Link
                    to={`/product/${data.slug}`}
                    className="flex justify-center py-4"
                  >
                    <img
                      src={data.photo[0].image}
                      alt=""
                      className="min-[300px]:max-[350px]:h-[250px] h-[150px] sm:h-[200px] md:h-[250px] lg:h-[200px] xl:h-[300px] w-full object-cover"
                    />
                  </Link>
                  <h1 className="text-base sm:text-xl font-bold text-center truncate mx-5">
                    {data.title}
                  </h1>
                  <h1 className="text-[13px] sm:text-base md:text-sm text-center sm:py-2">
                    {data.genre}
                  </h1>
                  <h1 className="text-[18px] sm:text-xl font-semibold text-red-500 text-center">
                    ₱
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
                </div>
              </div>
            ))}
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default LatestProduct;
