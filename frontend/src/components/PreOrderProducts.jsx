import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import { Store } from "./Store";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { showNotification } from "../redux/features/cart/notificationSlice";
import { addtoCart } from "../redux/features/cart/cartSlice";

function PreOrderProducts({ products }) {
  const displayProduct = products
    .filter(
      (product) =>
        product.properties?.saleType === "Pre Order" && product?.stocks > 0
    )
    .slice(0, 8);

  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const addToCartHandler = async (item) => {
    const existItem = cartItems.find((x) => x.slug === item.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${item.slug}`);
    if (data.product.stocks < quantity) {
      window.alert("Sorry. Product is out of stock");
      return;
    }
    dispatch(
      showNotification({
        message: "Successfully added to Cart",
        title: item.title,
        image: item.image[0].url,
      })
    );
    dispatch(addtoCart({ ...item, quantity }));
  };

  return (
    <div className="max-w-screen-xl mx-auto py-10">
      <div
        data-aos="fade-up"
        data-aos-delay="200"
        className="flex items-center justify-between"
      >
        <h1 className="text-[30px] font-bold py-5 ">PRE-ORDER</h1>
        <Link to="/collections/pre-order">
          <div className="flex items-center gap-2 group overflow-hidden cursor-pointer">
            <h1 className="italic text-xl  transform group">
              View All
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></span>
            </h1>

            <IoIosArrowForward className="opacity-0  transition-all duration-300 transform group-hover:opacity-100 group-hover:translate-x-1" />
          </div>
        </Link>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {displayProduct.map((item) => (
          <div key={item._id} data-aos="fade-up" data-aos-delay="200">
            <div className="shadow-xl relative ">
              <h1 className="text-sm sm:text-base text-right px-3 pt-2 text-gray-500">
                Stocks: {item.stocks}
              </h1>
              <div className="w-full h-50 lg:h-75 xl:h-96 group cursor-pointer overflow-hidden">
                <Link
                  to={`product/${item.slug}`}
                  className="text-[15px] sm:text-base flex justify-center"
                >
                  <img
                    className="img-filter w-full h-full object-cover group-hover:scale-110 duration-500"
                    src={item.image[0].url}
                    alt=""
                  />
                </Link>
              </div>
              <h1 className="text-base sm:text-xl font-bold text-center truncate mx-5">
                {item.title}
              </h1>
              <h1 className="text-[13px] sm:text-base md:text-sm text-center sm:py-2">
                {item.category}
              </h1>
              <h1 className="text-[18px] sm:text-xl font-semibold text-red-500 text-center">
                ₱
                {item.price.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </h1>
              <div className="flex justify-center pt-2 pb-5">
                {item.stocks === 0 ? (
                  <button
                    type="button"
                    className="bg-red-500 cursor-not-allowed rounded-[5px] w-full p-2 text-white font-semibold"
                  >
                    Out of Stocks
                  </button>
                ) : (
                  <button
                    type="button"
                    className="border-black border-[1px] rounded-[5px] font-semibold p-2 mx-3 container hover:bg-primary hover:text-white "
                    onClick={() => addToCartHandler(item)}
                  >
                    Add to Cart
                  </button>
                )}
              </div>

              {item.properties?.saleType === "Pre Order" && (
                <div className="absolute top-14 right-0">
                  <h1 className="bg-primary text-white rounded-l-[20px] px-3 py-[5px]">
                    Pre Order
                  </h1>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PreOrderProducts;
