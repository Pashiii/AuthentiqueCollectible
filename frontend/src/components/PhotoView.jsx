import React, { useEffect, useState } from "react";
import Slider from "react-slick";

function PhotoView({ images, selectedImage, setIsModalOpen }) {
  const [currentImage, setCurrentImage] = useState(selectedImage);

  const handleImageChange = (index) => {
    setCurrentImage(index);
  };

  useEffect(() => {
    document.body.classList.add("overflow-hidden");

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black ">
      <div className="relative w-full h-full">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-white text-xl font-bold"
          onClick={() => setIsModalOpen(false)}
        >
          Close ✖
        </button>

        {/* Main Image */}
        <div className="flex justify-center items-center my-10 h-[70vh]">
          <img
            src={images[currentImage].url}
            alt={`Image ${currentImage + 1}`}
            className="max-w-full max-h-[90vh] object-contain bg-white"
          />
        </div>

        {/* Thumbnails */}
        <div className="absolute bottom-5 w-full px-10 py-10">
          <Slider
            dots={false}
            infinite={false}
            draggable={false}
            slidesToScroll={1}
            slidesToShow={10}
            responsive={[
              {
                breakpoint: 1024,
                settings: {
                  slidesToShow: 4,
                },
              },
            ]}
          >
            {images.map((imgSrc, i) => (
              <div key={i} className="px-2">
                <img
                  src={imgSrc.url}
                  alt=""
                  onClick={() => handleImageChange(i)}
                  className={`w-full  h-[100px] object-contain cursor-pointer bg-white${
                    i === currentImage ? "" : ""
                  }`}
                />
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
}

export default PhotoView;
