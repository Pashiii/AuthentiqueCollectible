import React, { useState, useEffect } from "react";
import { LuAlarmClock } from "react-icons/lu";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addtoCart } from "../redux/features/cart/cartSlice";
import { showNotification } from "../redux/features/cart/notificationSlice";
import { Link } from "react-router-dom";

function FlashSale({ products }) {
  const [quantity, setQuantity] = useState(1);
  const [countdowns, setCountdowns] = useState({});

  const displayProduct = products.filter(
    (product) => product.properties?.saleType === "Flash Sale"
  );

  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const addToCartHandler = async (product) => {
    const existItem = cartItems.find((x) => x.slug === product.slug);
    const finalQuantity = existItem ? existItem.quantity + quantity : quantity;
    const { data } = await axios.get(`/api/products/${product.slug}`);
    const mystocks = data.product.stocks;
    console.log(finalQuantity);
    if (mystocks < finalQuantity) {
      window.alert("Sorry. Product is out of stock");
      return;
    }
    dispatch(
      showNotification({
        message: "Successfully added to Cart",
        title: product.title,
        image: product.image[0].url,
      })
    );
    dispatch(addtoCart({ ...product, quantity: finalQuantity }));
  };
  const updateQuantity = (amount) => {
    if (quantity + amount > displayProduct.stocks || quantity + amount < 1)
      return;
    setQuantity(quantity + amount);
  };

  useEffect(() => {
    const intervals = [];

    displayProduct.forEach((product) => {
      if (product.properties) {
        const countdownEndTime = new Date(product.properties.timeEnd).getTime();
        const intervalId = setInterval(async () => {
          const timeLeft = countdownEndTime - Date.now();

          if (timeLeft < 0) {
            clearInterval(intervalId);
            setCountdowns((prev) => ({ ...prev, [product._id]: null }));

            try {
              await axios.patch(`/api/products/remove-on-sale/${product._id}`);
            } catch (error) {
              console.error("Error removing onSale:", error);
            }
          } else {
            const secondsLeft = Math.floor((timeLeft / 1000) % 60);
            const minutesLeft = Math.floor((timeLeft / (1000 * 60)) % 60);
            const hoursLeft = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
            const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24));

            setCountdowns((prev) => ({
              ...prev,
              [product._id]: {
                days: daysLeft,
                hours: hoursLeft,
                minutes: minutesLeft,
                seconds: secondsLeft,
              },
            }));
          }
        }, 1000);

        intervals.push(intervalId);
      }
    });

    return () => {
      intervals.forEach(clearInterval);
    };
  }, [products]);

  return (
    <div>
      {products.map((data, i) => (
        <div className="" key={i}>
          {data.properties.saleType == "Flash Sale" && (
            <div className="lg:grid lg:grid-cols-2 gap-2 py-5">
              <div
                data-aos="fade-up"
                data-aos-delay="150"
                className="p-10 h-[450px] md:h-[590px] flex justify-end"
              >
                <img
                  src={data.image[0].url}
                  className="w-full h-full rounded-2xl border-black border-[1px] bg-center  shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] object-contain"
                />
              </div>
              <div data-aos="fade-up" data-aos-delay="250" className="h-auto ">
                <h1 className="text-[40px] lg:text-[50px] font-semibold text-red-600 flex items-center justify-center gap-2">
                  Flash Sales
                  <LuAlarmClock />
                </h1>
                <p className="text-[25px] lg:text-[35px] text-center">
                  This Flash Sales ends in:
                </p>
                <div className="w-full flash-sale ">
                  <ul className="flex gap-2 m-[20px] text-xs sm:text-base lg:text-lg text-black-500 justify-center ">
                    {countdowns[data._id] && (
                      <>
                        <li className="w-[60px] sm:w-[100px] sm:h-[80px] lg:w-[120px] h-[60px] lg:h-[100px] border-black border-2 flex justify-center items-end rounded-[10px] relative">
                          <span className="absolute top-[15px] text-red-500 text-xl sm:text-[30px] lg:text-[50px] font-bold">
                            {countdowns[data._id].days}
                          </span>
                          Days
                        </li>
                        <li className="w-[60px] sm:w-[100px] sm:h-[80px] lg:w-[120px] h-[60px] lg:h-[100px] border-black border-2 flex justify-center items-end rounded-[10px] relative">
                          <span className="absolute top-[15px] text-red-500 text-xl sm:text-[30px] lg:text-[50px] font-bold">
                            {countdowns[data._id].hours}
                          </span>
                          Hours
                        </li>
                        <li className="w-[60px] sm:w-[100px] sm:h-[80px] lg:w-[120px] h-[60px] lg:h-[100px] border-black border-2 flex justify-center items-end rounded-[10px] relative">
                          <span className="absolute top-[15px] text-red-500 text-xl sm:text-[30px] lg:text-[50px] font-bold">
                            {countdowns[data._id].minutes}
                          </span>
                          Minutes
                        </li>
                        <li className="w-[60px] sm:w-[100px] sm:h-[80px] lg:w-[120px] h-[60px] lg:h-[100px] border-black border-2 flex justify-center items-end rounded-[10px] relative">
                          <span className="absolute top-[15px] text-red-500 text-xl sm:text-[30px] lg:text-[50px] font-bold">
                            {countdowns[data._id].seconds}
                          </span>
                          Seconds
                        </li>
                      </>
                    )}
                  </ul>
                </div>

                <h1 className="py-5 text-4xl font-bold">{data.title}</h1>
                <h1>{data.category}</h1>
                <div className="flex items-center gap-5">
                  <h1 className="text-2xl font-semibold py-3 line-through">
                    ₱
                    {data?.oldPrice?.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </h1>
                  <h1 className="text-2xl text-red-500 font-semibold py-3">
                    ₱
                    {data?.price?.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </h1>
                </div>
                <h1 className="text-right text-xs">Stocks: {data.stocks}</h1>
                <div className="flex justify-between py-3">
                  <h1>Quantity</h1>
                  <div className="border-black border-[1px] h-[20px] w-[80px] rounded-[5px] shadow-md px-2 flex items-center justify-between">
                    <button
                      className=" font-bold cursor-pointer "
                      onClick={() => updateQuantity(-1)}
                      disabled={quantity === 1}
                    >
                      -
                    </button>
                    <span className="font-bold">{quantity}</span>
                    <button
                      className="font-bold cursor-pointer "
                      onClick={() => updateQuantity(1)}
                      disabled={quantity >= data.stocks}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex gap-5 justify-center py-5">
                  {data.stocks === 0 ? (
                    <button className="font-semibold shadow-xl bg-red-500 rounded-[10px] lg:w-[250px] lg:h-[50px] w-[150px] h-[40px] animate-in fade-in text-white cursor-not-allowed">
                      Out Of Stock
                    </button>
                  ) : (
                    <button
                      className="font-semibold shadow-xl bg-white rounded-[10px] lg:w-[250px] lg:h-[50px] w-[150px] h-[40px] animate-in fade-in"
                      onClick={() => addToCartHandler(data)}
                    >
                      Add to Cart
                    </button>
                  )}

                  <Link to={`product/${data.slug}`}>
                    <button className="font-semibold shadow-2xl rounded-[10px] lg:w-[250px] lg:h-[50px] w-[150px] h-[40px] bg-[#8B8888] text-white">
                      View Details
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default FlashSale;
