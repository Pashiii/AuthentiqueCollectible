import React, { useEffect, useState, useRef } from "react";
import Wallpaper from "../../assets/images/wallpaper.png";
import SImg from "../../assets/images/second.jpg";
import TImg from "../../assets/images/third.jpg";
import flashS from "../../assets/images/luffy.jpg";
import { LuAlarmClock } from "react-icons/lu";

function Hero({ CartIncrement }) {
  const slides = [
    { id: 1, url: Wallpaper },
    { id: 2, url: SImg },
    { id: 3, url: TImg },
    { id: 4, url: SImg },
  ];

  const [current, setCurrent] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const isDragging = useRef(false);

  const touchIncreament = (e) => {
    touchStartX.Itemquantity = e.touches;
  };

  const prevSlide = () => {
    setCurrent(current === 0 ? slides.length - 1 : current - 1);
  };

  const nextSlide = () => {
    setCurrent(current === slides.length - 1 ? 0 : current + 1);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [current]);

  const handleStart = (e) => {
    touchStartX.current = e.touches ? e.touches[0].clientX : e.clientX;
    isDragging.current = true;
  };

  const handleMove = (e) => {
    if (!isDragging.current) return;
    touchEndX.current = e.touches ? e.touches[0].clientX : e.clientX;
  };

  const handleEnd = () => {
    if (isDragging.current) {
      if (touchStartX.current - touchEndX.current > 50) {
        nextSlide();
      } else if (touchEndX.current - touchStartX.current > 50) {
        prevSlide();
      }
      isDragging.current = false;
    }
  };

  const [Itemquantity, setQuantity] = useState(1);

  // Function to handle increment
  const handleIncrement = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  // Function to handle decrement
  const handleDecrement = () => {
    setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1)); // Prevents quantity from going below 1
  };

  return (
    <div className="container">
      <div
        className="overflow-hidden max-w-[2000px] h-[450px] sm:h-[780px] w-full m-auto py-16 px-4 relative group"
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
      >
        <div
          style={{ backgroundImage: `url(${slides[current].url})` }}
          className="w-full h-full rounded-2xl bg-center bg-cover duration-500"
        ></div>

        {/* Button Pic */}
        <div className="absolute bottom-[100px] py-4 flex justify-center gap-1 w-full">
          {slides.map((slides, i) => {
            return (
              <div
                key={slides.id}
                className="max-w-[100px] w-full h-[3px] cursor-pointer"
              >
                <div
                  onClick={() => {
                    setCurrent(i);
                  }}
                  className={`hidden lg:block w-full h-[3px] cursor-pointer object-cover ${
                    i === current ? "bg-black" : "bg-white"
                  }`}
                ></div>
              </div>
            );
          })}
        </div>
      </div>
      <div>
        <div className="text-center">
          <h1 data-aos="fade-up" className="font-bold sm:text-2xl text-xl">
            Authentique Collectibles
          </h1>
          <p
            data-aos="fade-up"
            data-aos-delay="100"
            className="m-5 sm:text-base py-2 text-sm"
          >
            AUTHENTIQUE COLLECTIBLES is a hobby store that sells ORIGINAL
            collectible TOYS, NBA CARDS, SHOES, BAGS, CAPS, and LIFESTYLE
            APPAREL from the US and JAPAN. We also have ICED COFFEE & FRAPPE
            that will surely satisfy your daily coffee cravings!
          </p>
        </div>
      </div>
      {/* Flash Sales */}
      <div>
        <div className="lg:grid lg:grid-cols-2 gap-2 py-5">
          <div
            data-aos="fade-up"
            data-aos-delay="150"
            className="p-10 h-[450px] md:h-[590px]"
          >
            <div
              style={{ backgroundImage: `url(${flashSale[0].img})` }}
              className="w-full h-full rounded-2xl border-black border-[1px] bg-center bg-cover shadow-2xl object-cover"
            ></div>
          </div>
          <div data-aos="fade-up" data-aos-delay="250" className="h-auto ">
            <div>
              {flashSale.map((data) => (
                <div className="" key={data.id}>
                  <h1 className="text-[40px] lg:text-[50px] font-semibold text-red-600 flex items-center justify-center gap-2">
                    Flash Sales
                    <LuAlarmClock />
                  </h1>
                  <p className="text-[25px] lg:text-[35px] text-center">
                    This Flash Sales ends in:{" "}
                  </p>
                  <div className="w-full flash-sale ">
                    <ul className="flex gap-2 m-[20px] text-xs sm:text-base lg:text-lg text-black-500 justify-center ">
                      {[
                        { label: "Days", value: "01" },
                        { label: "Hours", value: "12" },
                        { label: "Minutes", value: "15" },
                        { label: "Seconds", value: "17" },
                      ].map((time, index) => (
                        <li
                          key={index}
                          className="w-[60px] sm:w-[100px] sm:h-[80px] lg:w-[120px] h-[60px] lg:h-[100px] border-black border-2 flex justify-center items-end rounded-[10px] relative"
                        >
                          <span className="absolute top-[15px] text-red-500 text-xl sm:text-[30px] lg:text-[50px] font-bold">
                            {time.value}
                          </span>
                          {time.label}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <h1 className="py-5 text-4xl font-bold">{data.title}</h1>
                  <h1>{data.genre}</h1>
                  <h1 className="text-2xl font-semibold py-3">{data.price}</h1>
                  <h1 className="text-right text-xs">{data.stocks}</h1>
                  <div className="flex justify-between py-3">
                    <h1>Quantity</h1>
                    <div className="border-black border-[1px] h-[20px] w-[80px] rounded-[5px] shadow-md px-2 flex items-center justify-between">
                      <button
                        className=" font-bold cursor-pointer "
                        onClick={handleDecrement}
                      >
                        -
                      </button>
                      <span className="font-bold">{Itemquantity}</span>
                      <button
                        className="font-bold cursor-pointer "
                        onClick={handleIncrement}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-5 justify-center py-5">
                    <button
                      className="font-semibold border-[1px] border-black rounded-[10px] lg:w-[250px] lg:h-[50px] w-[150px] h-[40px] animate-in fade-in"
                      onClick={() => CartIncrement(Itemquantity)}
                    >
                      Add to Cart
                    </button>
                    <button className="font-semibold border-[1px] border-black rounded-[10px] lg:w-[250px] lg:h-[50px] w-[150px] h-[40px] bg-[#8B8888] text-white">
                      Buy Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Latest products */}
      <div>
        <div className="pb-[50px]">
          <h1 data-aos="fade-up" className="text-2xl font-bold py-5">
            Latest Products
          </h1>
          <div className="grid grid-cols-1 min-[350px]:grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {latestProd.map((data, index) => (
              <div
                key={data.id}
                data-aos="fade-up"
                data-aos-delay={data.aosDelay}
                className="border border-black rounded-[10px] shadow-lg text-center "
              >
                <h1 className="text-sm sm:text-base text-right px-3 pt-2">
                  Stocks: 1
                </h1>
                <a href={data.link} className="flex justify-center py-4">
                  <img
                    src={data.img}
                    alt=""
                    className="min-[300px]:max-[350px]:h-[250px] h-[150px] sm:h-[200px] md:h-[250px] lg:h-[200px] xl:h-[300px] w-full object-cover"
                  />
                </a>
                <h1 className="text-base sm:text-xl font-bold text-center truncate mx-5">
                  {data.title}
                </h1>
                <h1 className="text-[13px] sm:text-base md:text-sm text-center sm:py-2">
                  {data.genre}
                </h1>
                <h1 className="text-[18px] sm:text-xl font-semibold text-red-500 text-center">
                  {data.price}
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
            ))}
          </div>
        </div>
      </div>
      {/* Pre-Orders */}
      <div>
        <div className="pb-[50px]">
          <h1 data-aos="fade-up" className="text-2xl font-bold py-5">
            Pre-Order
          </h1>
          <div className="grid grid-cols-1 min-[350px]:grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {latestProd.map((data, index) => (
              <div
                key={data.id}
                data-aos="fade-up"
                data-aos-delay={data.aosDelay}
                className="border border-black rounded-[10px] shadow-lg text-center "
              >
                <h1 className="text-sm sm:text-base text-right px-3 pt-2">
                  Stocks: 1
                </h1>
                <a href={data.link} className="flex justify-center py-4">
                  <img
                    src={data.img}
                    alt=""
                    className="min-[300px]:max-[350px]:h-[250px] h-[150px] sm:h-[200px] md:h-[250px] lg:h-[200px] xl:h-[300px] w-full object-cover"
                  />
                </a>
                <h1 className="text-base sm:text-xl font-bold text-center truncate mx-5">
                  {data.title}
                </h1>
                <h1 className="text-[13px] sm:text-base md:text-sm text-center sm:py-2">
                  {data.genre}
                </h1>
                <h1 className="text-[18px] sm:text-xl font-semibold text-red-500 text-center">
                  {data.price}
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
