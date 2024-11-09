import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Slider from "react-slick";
import RelatedProducts from "./RelatedProducts";
import axios from "axios";
import { useFetchProductBySlugQuery } from "../redux/features/products/productApi";
import { useDispatch, useSelector } from "react-redux";
import { addtoCart } from "../redux/features/cart/cartSlice";
import { showNotification } from "../redux/features/cart/notificationSlice";
import { AiOutlineThunderbolt } from "react-icons/ai";
import LoadingTracking from "./LoadingTracking";
import ErrorInput from "./ErrorInput";
import PhotoView from "./PhotoView";

// const reducer = (state, action) => {
//   switch (action.type) {
//     case "FETCH_REQUEST":
//       return { ...state, loading: true };
//     case "FETCH_SUCCESS":
//       return { ...state, product: action.payload, loading: false };
//     case "FETCH_FAIL":
//       return { ...state, loading: false, error: action.payload };
//     default:
//       return state;
//   }
// };

function Product() {
  const params = useParams();
  const { slug } = params;

  const [selectedImage, setSelectedImage] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [useInitialPayment, setUseInitialPayment] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    data: { product = [] } = {},
    error,
    isLoading,
  } = useFetchProductBySlugQuery(slug, {
    pollingInterval: 1000,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  var settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
  };

  const formatDate = (date) => {
    const dateObj = new Date(date);
    const day = dateObj.getDate();
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const month = monthNames[dateObj.getMonth()]; // Get month name
    const year = dateObj.getFullYear();

    return `${month} ${day}, ${year}`; // Format: Month Day, Year
  };

  const handleImageChange = (index) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedImage(index);
      setIsTransitioning(false);
    }, 150);
  };

  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const addToCartHandler = async () => {
    const existItem = cartItems.find((x) => x.slug === product.slug);
    const finalQuantity = existItem ? existItem.quantity + quantity : quantity;
    const { data } = await axios.get(`/api/products/${product.slug}`);
    const mystocks = data.product.stocks;
    const price = useInitialPayment
      ? product.properties.initialPay
      : product.price;
    const remainingBalance = useInitialPayment
      ? product.price - product.properties.initialPay
      : 0;
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
    dispatch(
      addtoCart({
        ...product,
        quantity: finalQuantity,
        price,
        remainingBalance,
      })
    );
  };

  const updateQuantity = (amount) => {
    if (quantity + amount > product.stocks || quantity + amount < 1) return;
    setQuantity(quantity + amount);
  };
  const [timeLeft, setTimeLeft] = useState([]);
  const prevTimeLeftRef = useRef(timeLeft);

  useEffect(() => {
    let intervalId;

    if (product.properties?.saleType === "Flash Sale") {
      const calculateTimeLeft = () => {
        const endTime = new Date(product.properties?.timeEnd).getTime();
        const currentTime = new Date().getTime();
        const difference = endTime - currentTime;

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        const newTimeLeft =
          difference > 0
            ? { days, hours, minutes, seconds }
            : { days: 0, hours: 0, minutes: 0, seconds: 0 };

        // Only update the state if the new time is different from the previous one
        if (
          JSON.stringify(newTimeLeft) !==
          JSON.stringify(prevTimeLeftRef.current)
        ) {
          setTimeLeft(newTimeLeft);
          prevTimeLeftRef.current = newTimeLeft;
        }
      };

      calculateTimeLeft();

      intervalId = setInterval(() => {
        calculateTimeLeft();
      }, 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [product]);
  if (isLoading) return <LoadingTracking />;
  if (error) return <ErrorInput />;

  return (
    <div>
      <div className="container max-w-screen-xl mx-auto  my-10 lg:grid lg:grid-cols-2 gap-10 ">
        {/* Product Image */}
        <div>
          <div
            className="relative border-[1px] border-black rounded-[10px] shadow-2xl w-full h-[50vh] md:h-[70vh]  bg-white"
            onClick={() => setIsModalOpen(true)}
          >
            <img
              src={product.image[selectedImage].url}
              alt=""
              className={`h-full w-full object-contain rounded-md image-transition${
                isTransitioning ? "" : "show"
              }`}
            />
          </div>
          <div className="mt-2">
            <Slider {...settings}>
              {product.image.map((imgSrc, i) => (
                <div key={i}>
                  <img
                    src={imgSrc.url}
                    onClick={() => {
                      handleImageChange(i);
                    }}
                    alt=""
                    className={`w-full h-[100px] object-contain rounded-md cursor-pointer border-[1px] border-black bg-white 
                `}
                  />
                </div>
              ))}
            </Slider>
          </div>
        </div>
        {isModalOpen && (
          <PhotoView
            images={product.image}
            selectedImage={selectedImage}
            setIsModalOpen={setIsModalOpen}
          />
        )}

        {/* Products Details */}
        <div className="flex flex-col gap-5">
          <div>
            <h2 className="text-5xl font-bold">{product.title}</h2>

            <h3 className="mt-3 text-xl">{product.category}</h3>
            <div className="flex items-center gap-4 mt-3">
              {product.oldPrice && (
                <p className="line-through font-base text-gray-500">
                  {`₱${product.oldPrice?.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`}
                </p>
              )}

              <p className="text-2xl font-medium text-gray-900">
                ₱
                {useInitialPayment
                  ? product?.properties?.initialPay.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                  : product?.price?.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
              </p>

              {product.properties?.saleType == "Pre Order" && (
                <h1 className="bg-primary text-white rounded-r-[20px] px-5 py-[5px] font-bold">
                  PRE ORDER
                </h1>
              )}
              {product.properties?.saleType == "Flash Sale" && (
                <>
                  <h1 className="bg-red-500 text-white rounded-r-[20px] px-5 py-[5px] font-bold flex justify-center items-center">
                    <AiOutlineThunderbolt className="text-xl" />
                    FLASH SALE
                  </h1>
                </>
              )}
            </div>
            {product.properties?.saleType == "Flash Sale" && (
              <div>
                <div className="flex items-center space-x-4 mt-4">
                  <div className="flex flex-col items-center px-4">
                    <span className="text-4xl lg:text-3xl text-red-400">
                      {timeLeft.days}
                    </span>
                    <span className="text-red-400 mt-2">Days</span>
                  </div>
                  <span className="w-[1px] h-20 bg-gray-400"></span>
                  <div className="flex flex-col items-center px-4">
                    <span className="text-4xl lg:text-3xl text-red-400">
                      {timeLeft.hours}
                    </span>
                    <span className="text-red-400 mt-2">Hours</span>
                  </div>
                  <span className="w-[1px] h-20 bg-gray-400"></span>
                  <div className="flex flex-col items-center px-4">
                    <span className="text-4xl lg:text-3xl text-red-400">
                      {timeLeft.minutes}
                    </span>
                    <span className="text-red-400 mt-2">Minutes</span>
                  </div>
                  <span className="w-[1px] h-20 bg-gray-400"></span>
                  <div className="flex flex-col items-center px-4">
                    <span className="text-4xl lg:text-3xl text-red-400">
                      {timeLeft.seconds}
                    </span>
                    <span className="text-red-400 mt-2">Seconds</span>
                  </div>
                </div>
              </div>
            )}

            {product.properties?.saleType == "Pre Order" && (
              <div className="mt-5 ">
                {product.properties.initialPay !== 0 && (
                  <h1 className="text-lg font-semibold">
                    <input
                      type="checkbox"
                      checked={useInitialPayment}
                      onChange={() => setUseInitialPayment(!useInitialPayment)}
                    />
                    <span> Initial Payment: ₱</span>

                    {product?.properties?.initialPay.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </h1>
                )}

                <h1 className="text-lg font-semibold">
                  Pre-order Deadline: {formatDate(product.properties?.deadLine)}
                </h1>
                <h1 className="text-lg font-semibold">
                  ETA: {formatDate(product.properties?.eta)}
                </h1>
              </div>
            )}
          </div>
          <div className="w-full flex justify-between">
            <div className=" flex items-center justify-between text-gray-500 gap-4 ">
              <p>Quantity:</p>

              <div className="border-black border-[1px] h-[20px] w-[80px] rounded-[5px] shadow-md px-2 flex items-center justify-between">
                <button
                  onClick={() => updateQuantity(-1)}
                  disabled={quantity === 1}
                  className="font-bold cursor-pointer"
                >
                  -
                </button>
                <span className="font-bold">{quantity}</span>
                <button
                  onClick={() => updateQuantity(1)}
                  disabled={quantity >= product.stocks}
                  className="font-bold cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>
            <p>Stocks: {product.stocks}</p>
          </div>

          <div>
            <div className="mt-10">
              {product.stocks === 0 ? (
                <button className="border-[1px] border-black py-3 w-[75%] rounded-[10px]  mb-5 bg-red-500 cursor-not-allowed font-semibold text-white">
                  Out of Stocks
                </button>
              ) : (
                <button
                  className="border-[1px] border-black py-3 px-24 h-[50px] rounded-[10px] mb-5 font-semibold"
                  onClick={addToCartHandler}
                >
                  Add to Cart
                </button>
              )}
            </div>
          </div>
          <div className="mt-10">
            <h1 className="text-2xl font-bold">Product Description</h1>
            <p className="text-lg">{product.description}</p>
          </div>
        </div>
      </div>
      <div>
        <RelatedProducts product={product._id} />
      </div>
    </div>
  );
}

export default Product;
