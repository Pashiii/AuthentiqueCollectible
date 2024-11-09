import React, { useEffect, useState, useRef } from "react";
import { useFetchAllBannersQuery } from "../redux/features/banner/bannerApi";

function Banner() {
  const { data: banner, error, isLoading } = useFetchAllBannersQuery();
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const isDragging = useRef(false);

  const prevSlide = () => {
    setCurrent(current === 0 ? banner?.length - 1 : current - 1);
  };

  const nextSlide = () => {
    setCurrent(current === banner?.length - 1 ? 0 : current + 1);
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
  if (!banner || banner?.length === 0) {
    return <div></div>;
  }
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message || "An error occurred."}</div>;
  return (
    <div>
      <div
        className="overflow-hidden  max-w-[2000px] h-[330px] sm:h-[380px] lg:h-[570px] xl:h-[700px] 2xl:h-[780px] w-full m-auto py-16 px-4 relative group"
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
      >
        <div
          style={{ backgroundImage: `url(${banner[current].image})` }}
          className="w-full h-full rounded-2xl bg-center bg-cover duration-500 "
        ></div>

        {/* Button Pic */}
        <div className="absolute bottom-[100px] py-4 flex justify-center gap-1 w-full">
          {banner.map((slides, i) => {
            return (
              <div
                key={slides._id}
                className="max-w-[100px] w-full h-[3px] object-cover cursor-pointer"
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
    </div>
  );
}

export default Banner;
